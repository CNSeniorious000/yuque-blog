import { apiBaseurl, headers, namespace } from "$lib/utils";

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
  const articles: Article[] = await fetchArticles(fetch);

  return { articles };
}
