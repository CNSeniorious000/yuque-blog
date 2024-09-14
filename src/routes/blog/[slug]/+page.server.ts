import { apiBaseurl, headers } from "$lib/serverConstants.js";
import { namespace } from "$lib/utils";

export async function load({ params, fetch }) {
  const { slug } = params;
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs/${slug}`, { headers });
  const { data } = await res.json();

  const { custom_description: description, title, body: markdown, updated_at } = data;

  return { description, title, markdown, updated_at };
}
