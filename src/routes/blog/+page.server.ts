import { apiBaseurl, headers, namespace } from "$lib/utils";

type Fetch = typeof fetch;

async function fetchBookInfo(fetch: Fetch) {
  const res = await fetch(`${apiBaseurl}/repos/${namespace}`, { headers });
  const { data } = await res.json();
  return data;
}

async function fetchArticles(fetch: Fetch) {
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  const { data } = await res.json();
  return data;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, setHeaders }) {
  const [{ user, items_count, updated_at, slug, description }, articles] = await Promise.all([fetchBookInfo(fetch), fetchArticles(fetch)]);

  setHeaders({ "cache-control": "max-age=30" });

  return { user, namespace, items_count, updated_at, slug, description, articles };
}
