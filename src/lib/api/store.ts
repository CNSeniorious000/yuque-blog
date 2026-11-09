import type { Post } from "./frontmatter";

import { fetchHeadOid, fetchPostsFromGitHub } from "./github";
import { env } from "$env/dynamic/private";

// one GraphQL call loads every doc; the last snapshot keeps serving while a TTL revalidation runs in the background
const ttl = 60_000;
const retryDelay = 30_000;
let snapshot: { posts: Map<string, Post>; freshUntil: number; oid: string } | undefined;
let failure: { until: number; error: unknown } | undefined; // shared so a cold outage costs one fetch per window, not one fetch per request
let refreshing: Promise<Map<string, Post>> | undefined;

export async function loadPosts(): Promise<Map<string, Post>> {
  const now = Date.now();
  if (snapshot && (now < snapshot.freshUntil || now < (failure?.until ?? 0))) {
    return snapshot.posts;
  }
  if (!snapshot && failure && now < failure.until) {
    throw failure.error;
  }
  const attempt = (refreshing ??= revalidate().finally(() => {
    refreshing = undefined;
  }));
  return snapshot?.posts ?? attempt;
}

async function revalidate(): Promise<Map<string, Post>> {
  try {
    const token = env.GITHUB_TOKEN;
    if (snapshot && (await fetchHeadOid(token)) === snapshot.oid) {
      // upstream unchanged — extend the snapshot instead of re-downloading the corpus
      snapshot = { ...snapshot, freshUntil: Date.now() + ttl };
      failure = undefined;
      return snapshot.posts;
    }
    // cold start goes straight to the corpus fetch; the probe only pays off once a snapshot exists
    const { oid, posts } = await fetchPostsFromGitHub(token);
    snapshot = { posts, oid, freshUntil: Date.now() + ttl };
    failure = undefined;
    return posts;
  } catch (error) {
    // an outage keeps the last snapshot serving; with nothing to fall back on, fail fast within the window
    failure = { until: Date.now() + retryDelay, error };
    return snapshot?.posts ?? Promise.reject(error);
  }
}
