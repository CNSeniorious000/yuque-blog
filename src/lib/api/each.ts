import type { PostMeta } from "./frontmatter";

import { lookupPost } from "./store";
import { error } from "@sveltejs/kit";

export class PostNotFoundError extends Error {
  constructor(readonly slug: string) {
    super(`Post not found: ${slug}`);
  }
}

export async function getPost(slug: string): Promise<PostMeta & { body: string }> {
  const post = await lookupPost(slug);
  if (!post) {
    throw new PostNotFoundError(slug);
  }
  return { ...post.meta, body: post.body };
}

// HTTP callers translate to 404; MCP surfaces PostNotFoundError's message directly
export async function getPostOr404(slug: string): Promise<PostMeta & { body: string }> {
  try {
    return await getPost(slug);
  } catch (e) {
    if (e instanceof PostNotFoundError) {
      error(404, e.message);
    }
    throw e;
  }
}
