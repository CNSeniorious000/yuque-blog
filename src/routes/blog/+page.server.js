import { apiBaseurl, headers, namespace } from "./common";

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  let res = await fetch(`${apiBaseurl}/repos/${namespace}`, { headers });
  let {
    data: { user, items_count, updated_at, slug, description },
  } = await res.json();
  let limit = res.headers.get("x-ratelimit-limit");
  let remaining = res.headers.get("x-ratelimit-remaining");

  res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  let { data: articles } = await res.json();
  return { user, namespace, items_count, updated_at, slug, limit, remaining, description, articles };
}
