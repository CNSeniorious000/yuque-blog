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

export async function listPosts() {
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  const { data } = await res.json();
  return data as Document[];
}
