import type { PostMeta } from "./frontmatter";

import { loadPosts } from "./store";

export async function getPost(slug: string): Promise<PostMeta & { body: string }> {
  const posts = await loadPosts();
  const post = posts.get(slug);
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }
  return { ...post.meta, body: post.body };
}
