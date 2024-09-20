import { apiBaseurl, headers } from "$lib/serverConstants.js";
import { namespace } from "$lib/utils";

type Fetch = typeof fetch;

async function fetchArticles(fetch: Fetch) {
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  const { data } = await res.json();
  return data;
}

interface Article {
  slug: string;
  title: string;
  word_count: number;
  content_updated_at: string;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  let articles: Article[] = await fetchArticles(fetch);
  articles = articles.map(({ slug, title, word_count, content_updated_at }) => ({ slug, title, word_count, content_updated_at }));

  return { articles };
}
