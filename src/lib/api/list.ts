import type { PostMeta } from "./store";

import { loadPosts } from "./store";

export async function listPosts(): Promise<PostMeta[]> {
  return [...(await loadPosts()).values()].map(({ meta }) => meta).sort((a, b) => (a.content_updated_at < b.content_updated_at ? 1 : -1));
}
