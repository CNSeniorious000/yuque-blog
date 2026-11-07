import type { Post } from "./frontmatter";

import { fetchPostsFromGitHub } from "./github";
import * as env from "$env/static/private";

// one GraphQL call loads every doc; the cache doubles as in-flight dedup and revalidates by TTL
const ttl = 60_000;
let cache: { at: number; posts: Promise<Map<string, Post>> } | undefined;

export function loadPosts(): Promise<Map<string, Post>> {
  if (!cache || Date.now() - cache.at > ttl) {
    const prev = cache;
    const posts = fetchPostsFromGitHub(env).catch((error) => {
      // serve the previous snapshot on a failed refresh, and only drop the cache if it is still ours
      if (cache?.posts === posts) {
        cache = prev ? { at: Date.now() - ttl + 30_000, posts: prev.posts } : undefined; // 30s backoff before retrying
      }
      return prev ? prev.posts : Promise.reject(error);
    });
    cache = { at: Date.now(), posts };
  }
  return cache.posts;
}
