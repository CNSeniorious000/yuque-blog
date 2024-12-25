import { apiBaseurl, headers } from "$lib/serverConstants";
import { namespace } from "$lib/utils";

interface Document {
  id: number;
  slug: string;
  title: string;
  word_count: number;
  description: string;
  created_at: string;
  content_updated_at: string;
}

export async function listPosts() { // TODO: pagination support
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  const { data, meta: { total } } = await res.json() as { data: Document[]; meta: { total: number } };
  return { total, articles: data };
}
