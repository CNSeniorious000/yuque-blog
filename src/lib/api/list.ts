import { loadPosts, type PostMeta } from "./store";

export async function listPosts(): Promise<PostMeta[]> {
  return [...(await loadPosts()).values()].map(({ meta }) => meta);
}
