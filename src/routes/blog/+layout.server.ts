import type { LayoutServerLoad } from "./$types";

import { getPost } from "$lib/api/each.js";
import { listPosts } from "$lib/api/list.js";
import { load as loadCheerio } from "cheerio";
import { parseDocument } from "htmlparser2";

export const load = (async ({ route: { id }, params: { slug } }) => {
  if (id === "/blog") {
    const { total, articles } = await listPosts();
    return { list: { total, articles: articles.map(({ slug, title, word_count, content_updated_at }) => ({ slug, title, word_count, content_updated_at })) } };
  } else {
    const { description, title, body: markdown, body_html, updated_at } = await getPost(slug!);

    const $ = loadCheerio(parseDocument(body_html));
    const fullText = $("div.lake-content").text();

    return { article: { description: fullText.startsWith(description.replace(/\.\.\.$/, "")) ? undefined : description, title, markdown, updated_at } };
  }
}) satisfies LayoutServerLoad;
