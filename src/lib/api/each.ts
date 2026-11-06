import { loadPosts, type PostMeta } from "./store";

export interface Document extends PostMeta {
  body: string;
}

export async function getPost(slug: string): Promise<Document> {
  const posts = await loadPosts();
  const post = posts.get(slug);
  if (!post) throw new Error(`Failed to fetch post ${slug}: not found`);
  return { ...post.meta, body: post.body };
}
