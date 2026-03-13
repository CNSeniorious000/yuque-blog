import type { CollectorUi } from "./collect-image-sizes-ui";

import { createCollectorUi } from "./collect-image-sizes-ui";
import * as cheerio from "cheerio";
import imageSize from "image-size";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createFetch } from "xsfetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, "image-dimensions.json");

const API_BASEURL = "https://yuque.com/api/v2";
const NAMESPACE = "muspi_merol/blog";
const POST_CONCURRENCY = 5;
const IMAGE_CONCURRENCY = 20;
const IMAGE_REQUEST_TIMEOUT_MS = 20000;
const IMAGE_REQUEST_RETRIES = 2;

const headers = {
  "User-Agent": "yuque-blog-bot",
  "Accept": "application/json",
  "X-Auth-Token": process.env.ACCESS_TOKEN || "",
};

const fetch = createFetch({ debug: false });

interface PostSummary {
  slug: string;
  title?: string;
}

interface PostDetail {
  body_html?: string;
}

interface ImageSizeResult {
  url: string;
  size: [number, number] | null;
  error?: string;
}

class AsyncQueue<T> {
  private readonly items: T[] = [];
  private readonly resolvers: Array<(value: T | null) => void> = [];
  private closed = false;

  push(item: T) {
    if (this.closed) {
      throw new Error("Queue is closed");
    }

    const resolver = this.resolvers.shift();
    if (resolver) {
      resolver(item);
      return;
    }

    this.items.push(item);
  }

  close() {
    if (this.closed) {
      return;
    }

    this.closed = true;
    while (this.resolvers.length > 0) {
      this.resolvers.shift()?.(null);
    }
  }

  async shift(): Promise<T | null> {
    const item = this.items.shift();
    if (item !== undefined) {
      return item;
    }

    if (this.closed) {
      return null;
    }

    return new Promise(resolve => this.resolvers.push(resolve));
  }
}

function truncateMiddle(value: string, maxLength = 64) {
  if (value.length <= maxLength) {
    return value;
  }

  const edgeLength = Math.max(8, Math.floor((maxLength - 3) / 2));
  return `${value.slice(0, edgeLength)}...${value.slice(-edgeLength)}`;
}

function getHostLabel(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return truncateMiddle(url, 32);
  }
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function extractImageUrls(html: string): string[] {
  const $ = cheerio.load(html);
  const imageUrls = new Set<string>();

  $("img").each((_, elem) => {
    const src = $(elem).attr("src");
    if (src) {
      imageUrls.add(src);
    }
  });

  return Array.from(imageUrls);
}

async function getImageSize(url: string): Promise<ImageSizeResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, IMAGE_REQUEST_TIMEOUT_MS);

  try {
    return await fetchImageSizeAttempt(url, controller.signal);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { url, size: null, error: `Timed out after ${IMAGE_REQUEST_TIMEOUT_MS}ms` };
    }

    return { url, size: null, error: toErrorMessage(error) };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchImageSizeAttempt(url: string, signal: AbortSignal): Promise<ImageSizeResult> {
  let lastError = "Request failed";

  for (let attempt = 0; attempt <= IMAGE_REQUEST_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ImageSizeBot/1.0)",
        },
      });

      if (!response.ok) {
        lastError = `HTTP ${response.status}`;
        if (response.status === 404 || !isRetryableStatus(response.status) || attempt === IMAGE_REQUEST_RETRIES) {
          return { url, size: null, error: lastError };
        }

        continue;
      }

      const buffer = await response.arrayBuffer();
      const dimensions = imageSize(new Uint8Array(buffer));

      if (!dimensions?.width || !dimensions?.height) {
        return { url, size: null, error: "Invalid image data" };
      }

      return { url, size: [dimensions.width, dimensions.height] };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }

      lastError = toErrorMessage(error);
      if (attempt === IMAGE_REQUEST_RETRIES) {
        return { url, size: null, error: lastError };
      }
    }
  }

  return { url, size: null, error: lastError };
}

async function listPosts(ui: CollectorUi): Promise<PostSummary[]> {
  try {
    ui.appendLog("info", `Fetching docs from ${API_BASEURL}/repos/${NAMESPACE}/docs`);
    const res = await fetch(`${API_BASEURL}/repos/${NAMESPACE}/docs`, { headers });

    if (!res.ok) {
      ui.appendLog("error", `Docs API failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json() as { data?: PostSummary[] };
    return data.data || [];
  } catch (error) {
    ui.appendLog("error", `Failed to fetch posts: ${toErrorMessage(error)}`);
    return [];
  }
}

async function getPost(slug: string): Promise<PostDetail | null> {
  try {
    const res = await fetch(`${API_BASEURL}/repos/${NAMESPACE}/docs/${slug}`, { headers });
    if (!res.ok) {
      return null;
    }

    const data = await res.json() as { data?: PostDetail };
    return data.data || null;
  } catch {
    return null;
  }
}

async function writeDimensions(dimensions: Record<string, [number, number]>) {
  const nextContent = `${JSON.stringify(dimensions, null, 2)}\n`;

  try {
    const currentContent = await fs.readFile(OUTPUT_PATH, "utf8");
    if (currentContent === nextContent) {
      return;
    }
  } catch {
  }

  await fs.writeFile(OUTPUT_PATH, nextContent);
}

async function collectImageSizes(
  posts: PostSummary[],
  ui: CollectorUi,
  postConcurrency = POST_CONCURRENCY,
  imageConcurrency = IMAGE_CONCURRENCY,
) {
  const dimensions: Record<string, [number, number]> = {};
  const seenImageUrls = new Set<string>();
  const postQueue = new AsyncQueue<PostSummary>();
  const imageQueue = new AsyncQueue<string>();
  let postsProcessed = 0;
  let imagesProcessed = 0;
  let successCount = 0;
  let failureCount = 0;

  ui.setPhase("pipeline", `posts ${postConcurrency}, images ${imageConcurrency}`);
  ui.setPostProgress({ processed: 0, total: posts.length });
  ui.setImageProgress({ processed: 0, total: 0, successCount: 0, failureCount: 0 });

  for (const post of posts) {
    postQueue.push(post);
  }
  postQueue.close();

  const postWorkers = Array.from({ length: postConcurrency }, async () => {
    while (true) {
      const post = await postQueue.shift();
      if (!post) {
        return;
      }

      const postLabel = post.title || post.slug;
      const fullPost = await getPost(post.slug);
      if (!fullPost?.body_html) {
        ui.appendLog("error", `${truncateMiddle(postLabel, 36)} body_html missing`);
      } else {
        const imageUrls = extractImageUrls(fullPost.body_html);
        let newImageCount = 0;

        for (const imageUrl of imageUrls) {
          if (seenImageUrls.has(imageUrl)) {
            continue;
          }

          seenImageUrls.add(imageUrl);
          imageQueue.push(imageUrl);
          newImageCount += 1;
        }

        if (newImageCount > 0) {
          ui.appendLog("info", `${truncateMiddle(postLabel, 36)} ${newImageCount} new`);
          ui.setImageProgress({
            processed: imagesProcessed,
            total: seenImageUrls.size,
            successCount,
            failureCount,
          });
        }
      }

      postsProcessed += 1;
      ui.setPostProgress({ processed: postsProcessed, total: posts.length, currentPost: postLabel });
    }
  });

  const closeImageQueue = Promise.all(postWorkers).finally(() => {
    imageQueue.close();
  });

  const imageWorkers = Array.from({ length: imageConcurrency }, async () => {
    while (true) {
      const url = await imageQueue.shift();
      if (!url) {
        return;
      }

      ui.setImageProgress({
        processed: imagesProcessed,
        total: seenImageUrls.size,
        successCount,
        failureCount,
        currentImage: url,
      });

      try {
        const result = await getImageSize(url);
        imagesProcessed += 1;

        if (result.size) {
          successCount += 1;
          dimensions[result.url] = result.size;
          ui.appendLog("ok", `${getHostLabel(result.url)} ${result.size[0]}x${result.size[1]}`);
        } else {
          failureCount += 1;
          ui.appendLog("error", `${getHostLabel(result.url)} ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        imagesProcessed += 1;
        failureCount += 1;
        ui.appendLog("error", `${getHostLabel(url)} ${toErrorMessage(error)}`);
      }

      ui.setImageProgress({
        processed: imagesProcessed,
        total: seenImageUrls.size,
        successCount,
        failureCount,
        currentImage: url,
      });
    }
  });

  await Promise.all([closeImageQueue, Promise.all(imageWorkers)]);
  ui.appendLog("info", `Discovered ${seenImageUrls.size} unique images`);

  return {
    dimensions,
    successCount,
    totalCount: seenImageUrls.size,
  };
}

async function runCollection(ui: CollectorUi) {
  ui.setBootInfo();
  ui.setPhase("listing", "fetch post list");
  const posts = await listPosts(ui);

  if (posts.length === 0) {
    ui.appendLog("info", "No posts found. Writing empty dimensions file.");
    await writeDimensions({});
    ui.finish("0 posts, empty output written");
    return;
  }

  ui.appendLog("info", `Found ${posts.length} posts`);

  const { dimensions, successCount, totalCount } = await collectImageSizes(posts, ui);

  if (totalCount === 0) {
    ui.setPhase("write", "writing empty output");
    await writeDimensions({});
    ui.finish("no images found, empty output written");
    return;
  }

  ui.setPhase("write", "writing output");
  await writeDimensions(dimensions);

  const successRate = Math.round((successCount / totalCount) * 100);
  ui.appendLog("info", `Saved ${successCount} entries to ${truncateMiddle(OUTPUT_PATH, 72)}`);
  ui.finish(`done ${successCount}/${totalCount} (${successRate}%)`);
}

async function main() {
  const isInteractiveTerminal = Boolean(process.stdout.isTTY && process.stdin.isTTY);
  const ui = await createCollectorUi(isInteractiveTerminal);
  let exitCode = 0;
  let fatalMessage = "";
  let cleanupInterruptHandler = () => {};
  let cleanupSignalHandlers = () => {};
  let interrupted = false;

  const handleInterrupt = () => {
    if (interrupted) {
      return;
    }

    interrupted = true;

    void (async () => {
      try {
        ui.fail("Interrupted by Ctrl+C");
      } catch {
      }

      cleanupInterruptHandler();
      cleanupSignalHandlers();
      await ui.waitForExit();
      await ui.shutdown(true);
      process.exit(130);
    })();
  };

  if (ui.onInterrupt) {
    cleanupInterruptHandler = ui.onInterrupt(handleInterrupt);
  }

  const signalHandlers: Array<[NodeJS.Signals, () => void]> = [["SIGINT", handleInterrupt]];
  if (process.platform === "win32") {
    signalHandlers.push(["SIGBREAK", handleInterrupt]);
  }

  for (const [signal, handler] of signalHandlers) {
    process.on(signal, handler);
  }

  cleanupSignalHandlers = () => {
    for (const [signal, handler] of signalHandlers) {
      process.off(signal, handler);
    }
  };

  try {
    await runCollection(ui);
  } catch (error) {
    exitCode = 1;
    fatalMessage = toErrorMessage(error);
    ui.fail(fatalMessage);
  }

  cleanupInterruptHandler();
  cleanupSignalHandlers();
  await ui.waitForExit();
  await ui.shutdown(true);

  if (exitCode !== 0) {
    if (ui.needsExplicitExit) {
      process.exit(exitCode);
    }
    return;
  }

  if (ui.needsExplicitExit) {
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("OpenTUI collector failed:", toErrorMessage(error));
  process.exit(1);
});
