import { apiBaseurl, headers, namespace, getRateLimitInfo } from "$lib/common";

async function fetchBookInfo(fetch) {
  let res = await fetch(`${apiBaseurl}/repos/${namespace}`, { headers });
  let { data } = await res.json();
  return { data, headers: res.headers };
}

async function fetchArticles(fetch) {
  let res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  let { data } = await res.json();
  return { data, headers: res.headers };
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, setHeaders }) {
  let [
    {
      data: { user, items_count, updated_at, slug, description },
      headers: headers1,
    },
    { data: articles, headers: headers2 },
  ] = await Promise.all([fetchBookInfo(fetch), fetchArticles(fetch)]);

  let info1 = getRateLimitInfo(headers1);
  let info2 = getRateLimitInfo(headers2);

  setHeaders({ age: headers1.get("age") ?? 10, "cache-control": headers1.get("cache-control") ?? "max-age=10" });

  return { user, namespace, items_count, updated_at, slug, description, articles, limit: info1.limit, remaining: Math.min(info1.remaining, info2.remaining) };
}
