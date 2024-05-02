import { apiBaseurl, headers, namespace } from "$lib/utils";

export async function load({ params, fetch, setHeaders }) {
  const { slug } = params;
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs/${slug}`, { headers });
  const { data } = await res.json();

  setHeaders({ "cache-control": "max-age=60" });

  return data;
}
