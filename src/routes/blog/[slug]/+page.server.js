import { apiBaseurl, headers, namespace } from "$lib/utils";

export async function load({ params, fetch, setHeaders }) {
  let { slug } = params;
  let res = await fetch(`${apiBaseurl}/repos/${namespace}/docs/${slug}`, { headers });
  let { data } = await res.json();

  setHeaders({ "cache-control": "max-age=60" });

  return data;
}
