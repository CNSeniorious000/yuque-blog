import { listPosts } from "$lib/api/list.js";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const articles = (await listPosts()).map(({ slug, title, word_count, content_updated_at }) => ({ slug, title, word_count, content_updated_at }));

  return { articles };
}
