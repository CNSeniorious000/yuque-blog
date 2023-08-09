import { apiBaseurl, headers, namespace } from "$lib/utils";

async function fetchBookInfo(fetch) {
  let res = await fetch(`${apiBaseurl}/repos/${namespace}`, { headers });
  let { data } = await res.json();
  return data;
}

async function fetchArticles(fetch) {
  let res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  let { data } = await res.json();
  return data;
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, setHeaders }) {
  let [{ user, items_count, updated_at, slug, description }, articles] = await Promise.all([fetchBookInfo(fetch), fetchArticles(fetch)]);

  setHeaders({ "cache-control": "max-age=30" });

  return { user, namespace, items_count, updated_at, slug, description, articles };
}
