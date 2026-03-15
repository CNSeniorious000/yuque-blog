import type { RequestHandler } from "./$types";

import header from "../llms.txt/header.md?raw";
import { ValibotJsonSchemaAdapter } from "@tmcp/adapter-valibot";
import { HttpTransport } from "@tmcp/transport-http";
import { getPost } from "$lib/api/each";
import { listPosts } from "$lib/api/list";
import { searchPosts } from "$lib/api/search";
import { login, namespace, repo } from "$lib/utils";
import { McpServer } from "tmcp";
import * as v from "valibot";

const BASE_URI = `${login.replaceAll("_", "-")}://${repo}`;
const serverDescription = header.match(/^> (.+)$/m)?.[1]?.replace(/\[(.*?)\]\([^)]+\)/g, "$1").replace(/\[\^[^\]]+\]/g, "").trim() ?? "I am Muspi Merol.";

let cachedPosts: Awaited<ReturnType<typeof listPosts>> | undefined;
let cachedAt = 0;
let inflightPosts: Promise<Awaited<ReturnType<typeof listPosts>>> | undefined;

const server = new McpServer(
  {
    name: "yuque-blog",
    version: "1.0.0",
    description: serverDescription,
    get websiteUrl() {
      return server.ctx.custom?.origin;
    },
  },
  {
    adapter: new ValibotJsonSchemaAdapter(),
    capabilities: { completions: {}, tools: {}, resources: {} },
  },
).withContext<{ origin: string }>();

function postUrl(slug: string) {
  const origin = server.ctx.custom?.origin;
  return origin ? `${origin}/blog/${slug}` : `/blog/${slug}`;
}

function postUri(slug: string) {
  return `${BASE_URI}/${slug}`;
}

function renderFrontmatter(metadata: Record<string, number | string | undefined>) {
  const lines = Object.entries(metadata)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}: ${typeof value === "number" ? value : JSON.stringify(value)}`);

  if (!lines.length) {
    return "";
  }

  return ["---", ...lines, "---", ""].join("\n");
}

async function listPostsForMcp() {
  const now = Date.now();
  if (cachedPosts && now - cachedAt < 15_000) {
    return cachedPosts;
  }

  if (inflightPosts) {
    return inflightPosts;
  }

  inflightPosts = listPosts().then((result) => {
    cachedPosts = result;
    cachedAt = Date.now();
    return result;
  }).finally(() => {
    inflightPosts = undefined;
  });

  return inflightPosts;
}

async function getListResource() {
  const { total, articles } = await listPostsForMcp();
  return {
    uri: BASE_URI,
    mimeType: "text/markdown",
    text: [
      renderFrontmatter({ total }),
      ...articles.map(({ slug, title, content_updated_at }) => `- [${title}](${postUrl(slug)}/llms.txt) - updated ${content_updated_at}`),
    ].join("\n"),
  };
}

async function getPostResource(slug: string) {
  const post = await getPost(slug);
  return {
    uri: postUri(slug),
    mimeType: "text/markdown",
    text: [
      renderFrontmatter({
        slug: post.slug,
        title: post.title,
        source: postUrl(post.slug),
        updated: post.updated_at,
        description: post.description,
      }),
      post.body,
    ].filter(Boolean).join("\n"),
  };
}

async function listPostResources() {
  const { articles } = await listPostsForMcp();
  return articles.map(({ slug, title, description }) => ({
    name: slug,
    title,
    description,
    uri: postUri(slug),
    mimeType: "text/markdown",
  }));
}

async function completeSlugs(query: string) {
  const needle = query.trim().toLowerCase();
  const { articles } = await listPostsForMcp();
  const matches = articles
    .map(({ slug }) => slug)
    .filter(slug => !needle || slug.toLowerCase().includes(needle));
  const values = matches.slice(0, 20);

  return { completion: { values, total: matches.length, hasMore: matches.length > values.length } };
}

server.tool(
  {
    name: "search-posts",
    title: "Search Posts",
    description: "Search blog posts in the current Yuque knowledge base by keyword.",
    schema: v.object({
      query: v.pipe(v.string(), v.minLength(1), v.maxLength(200), v.description("Keyword or phrase to search for.")),
    }),
    annotations: { destructiveHint: false, readOnlyHint: true },
  },
  async ({ query }) => {
    const { total, articles } = await searchPosts(query, { scope: namespace });
    return {
      content: [{
        type: "text",
        text: articles.length
          ? [
              renderFrontmatter({ total }),
              ...articles.map(({ slug, title, description }) => `- [${title}](${postUrl(slug)}/llms.txt)${description ? `\n  ${description}` : ""}`),
            ].join("\n")
          : "No results found.",
      }],
    };
  },
);

server.tool(
  {
    name: "list-posts",
    title: "List Posts",
    description: "List the available blog posts.",
    annotations: { destructiveHint: false, readOnlyHint: true },
  },
  async () => ({ content: [{ type: "resource", resource: await getListResource() }] }),
);

server.resource(
  { name: "posts", title: "Posts Index", description: "List of available blog posts.", uri: BASE_URI },
  async () => ({ contents: [await getListResource()] }),
);

server.tool(
  {
    name: "read-post",
    title: "Read Post",
    description: "Read a blog post by its Yuque slug.",
    schema: v.object({
      slug: v.pipe(v.string(), v.minLength(1), v.description("The post slug, for example `hello-world`.")),
    }),
    annotations: { destructiveHint: false, readOnlyHint: true },
  },
  async ({ slug }) => ({ content: [{ type: "resource", resource: await getPostResource(slug) }] }),
);

server.template(
  {
    name: "post",
    title: "Post by Slug",
    description: "Read a blog post resource by slug.",
    uri: `${BASE_URI}/{slug}`,
    mimeType: "text/markdown",
    complete: { slug: completeSlugs },
    list: listPostResources,
  },
  async (_uri, params) => ({
    contents: [await getPostResource(Array.isArray(params.slug) ? params.slug[0] : params.slug)],
  }),
);

const transport = new HttpTransport(server, { path: "/mcp", cors: true, disableSse: true });

const handler: RequestHandler = async ({ request, url }) => {
  return await transport.respond(request, { origin: url.origin }) ?? new Response("Not Found", { status: 404 });
};

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
export const OPTIONS = handler;
