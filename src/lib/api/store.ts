import type { Post } from "./frontmatter";

import { fetchPostsFromGitHub } from "./github";
import { githubToken } from "$lib/serverConstants";

export type { Post, PostMeta } from "./frontmatter";

// one GraphQL call loads every doc; the cache doubles as in-flight dedup and revalidates by TTL
const ttl = 60_000;
let cache: { at: number; posts: Promise<Map<string, Post>> } | undefined;

export function loadPosts(): Promise<Map<string, Post>> {
  if (!cache || Date.now() - cache.at > ttl) {
    const prev = cache;
    const posts = fetchPostsFromGitHub(githubToken).catch((error) => {
      // serve the previous snapshot on a failed refresh, and only drop the cache if it is still ours
      if (cache?.posts === posts) {
        cache = prev ? { at: 0, posts: prev.posts } : undefined;
      }
      return prev ? prev.posts : Promise.reject(error);
    });
    cache = { at: Date.now(), posts };
  }
  return cache.posts;
}
