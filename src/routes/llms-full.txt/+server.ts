import type { RequestHandler } from "./$types";

import header from "../llms.txt/header.md?raw";
import { text } from "@sveltejs/kit";
import { getPost } from "$lib/api/each";
import { listPosts } from "$lib/api/list";
import { formatDate } from "$lib/utils";

export const GET: RequestHandler = async ({ url: { origin }, request: { headers } }) => {
  const language = headers.get("accept-language")?.split(",")[0];

  let blocks = [header.replace("{}", origin).trim()];
  const posts = await listPosts();

  blocks.push(`## Posts / more like Random Thoughts (top ${posts.articles.length}/${posts.total})`);

  blocks = blocks.concat(...await Promise.all(posts.articles.map(async ({ slug, title, created_at }) => {
    const article = await getPost(slug);
    const md = article.body.replaceAll("https://cdn.nlark.com/", "/nlark/").trim();
    return `# [${title}](/blog/${slug})` + ` (${formatDate(created_at, language)})` + `\n\n${md}`;
  })));

  const markdownOutput = blocks.join("\n\n");

  return text(markdownOutput, { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
  } });
};

export const config = { isr: { expiration: 300 } };
