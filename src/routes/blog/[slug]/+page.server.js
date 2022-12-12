import { apiBaseurl, headers, namespace } from "$lib/common";

export async function load({ params, fetch, setHeaders }) {
  let { slug } = params;
  let res = await fetch(`${apiBaseurl}/repos/${namespace}/docs/${slug}`, { headers });
  let { data } = await res.json();

  let limit = res.headers.get("x-ratelimit-limit");
  let remaining = res.headers.get("x-ratelimit-remaining");

  setHeaders({ age: res.headers.get("age") ?? 10, "cache-control": res.headers.get("cache-control") ?? "max-age=10" });

  return { limit, remaining, ...data };
}
