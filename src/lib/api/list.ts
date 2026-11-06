import type { PostMeta } from "./store";

import { loadPosts } from "./store";

export async function listPosts(): Promise<PostMeta[]> {
  return [...(await loadPosts()).values()].map(({ meta }) => meta);
}
