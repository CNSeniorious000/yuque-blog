import type { RequestHandler } from "./$types";

import header from "../llms.txt/header.md?raw";
import { loadPosts } from "#lib/api/store.js";
import { formatDate, markdownResponse, toLocalNlark } from "#lib/utils.js";

export const GET: RequestHandler = async ({ url: { origin }, request: { headers } }) => {
  const language = headers.get("accept-language");

  let blocks = [header.replace("{}", origin).trim()];
  const posts = [...(await loadPosts()).values()].sort((a, b) => (a.meta.content_updated_at < b.meta.content_updated_at ? 1 : -1));

  blocks.push(`## Posts / more like Random Thoughts (top ${posts.length})`);

  blocks = blocks.concat(posts.map(({ meta: { slug, title, created_at }, body }) => {
    const md = toLocalNlark(body).trim();
    return `# [${title}](/blog/${slug})` + ` (${formatDate(created_at, language)})` + `\n\n${md}`;
  }));

  const markdownOutput = blocks.join("\n\n");

  return markdownResponse(markdownOutput);
};
