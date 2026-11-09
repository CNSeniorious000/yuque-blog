import type { RequestHandler } from "./$types";

import header from "./header.md?raw";
import { text } from "@sveltejs/kit";
import { listPosts } from "$lib/api/list";
import { formatDate } from "$lib/utils";

export const GET: RequestHandler = async ({ url: { origin }, request: { headers } }) => {
  const language = headers.get("accept-language");

  const blocks = [header.replace("{}", origin).trim()];
  const posts = await listPosts();

  blocks.push(`## Posts / more like Random Thoughts (top ${posts.length})`);

  blocks.push(posts.map(({ slug, title, created_at }) => {
    return `- [${title}](/blog/${slug}/llms.txt)` + ` (${formatDate(created_at, language)})`;
  }).join("\n"));

  const markdownOutput = blocks.join("\n\n");

  return text(markdownOutput, { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
  } });
};
