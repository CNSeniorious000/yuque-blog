import { apiBaseurl, headers, namespace } from "$lib/common";

export async function load({ params, fetch, setHeaders }) {
  let { slug } = params;
  let res = await fetch(`${apiBaseurl}/repos/${namespace}/docs/${slug}`, { headers });
  let { data } = await res.json();

  setHeaders({ age: res.headers.get("age") ?? 60, "cache-control": res.headers.get("cache-control") ?? "max-age=60" });
  
  return data;
}
