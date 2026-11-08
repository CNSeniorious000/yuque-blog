import { loadPosts } from "./store";

export async function searchPosts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [];
  }
  return [...(await loadPosts()).values()]
    .filter(({ searchable }) => searchable.includes(q))
    .map(({ meta }) => ({ slug: meta.slug, title: meta.title, description: meta.summary }));
}
