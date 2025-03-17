import type { RequestHandler } from "./$types";

import header from "./header.md?raw";
import { text } from "@sveltejs/kit";
import { listPosts } from "$lib/api/list";
import { formatDate } from "$lib/utils";

export const GET: RequestHandler = async ({ url: { origin }, request: { headers } }) => {
  const language = headers.get("accept-language")?.split(",")[0];

  const blocks = [header.replace("{}", origin).trim()];
  const posts = await listPosts();

  blocks.push(`## Posts / more like Random Thoughts (top ${posts.articles.length}/${posts.total})`);

  blocks.push(posts.articles.map(({ slug, title, created_at }) => {
    return `- [${title}](/blog/${slug})` + ` (${formatDate(created_at, language)})`;
  }).join("\n"));

  const markdownOutput = blocks.join("\n\n");

  return text(markdownOutput, { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
  } });
};

export const config = { isr: { expiration: 10 } };
