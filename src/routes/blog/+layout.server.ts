import type { LayoutServerLoad } from "./$types";

import { getPost } from "$lib/api/each.js";
import { listPosts } from "$lib/api/list.js";
import { toLocalNlark } from "$lib/utils";

export const config = { isr: { expiration: 300 } };

export const load = (async ({ route: { id }, params: { slug } }) => {
  if (id === "/blog") {
    const articles = await listPosts();
    return { list: articles.map(({ slug, title, word_count, content_updated_at }) => ({ slug, title, word_count, content_updated_at })) };
  } else {
    const { id, description, title, body, updated_at } = await getPost(slug!);
    return { article: { id, description: description || undefined, title, markdown: toLocalNlark(body), updated_at } };
  }
}) satisfies LayoutServerLoad;
