import { contentRepo, githubHeaders } from "$lib/serverConstants";
import { postFromMarkdown, postsDir, type Post } from "./frontmatter";

export type { Post, PostMeta } from "./frontmatter";

// one GraphQL call loads every doc; the cache doubles as in-flight dedup and revalidates by TTL
const ttl = 60_000;
let cache: { at: number, posts: Promise<Map<string, Post>> } | undefined;

export function loadPosts(): Promise<Map<string, Post>> {
  if (!cache || Date.now() - cache.at > ttl) {
    cache = { at: Date.now(), posts: fetchAll().catch((error) => {
      cache = undefined;
      throw error;
    }) };
  }
  return cache.posts;
}

async function fetchAll(): Promise<Map<string, Post>> {
  const [owner, name] = contentRepo.split("/");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: githubHeaders,
    body: JSON.stringify({ query: `{repository(owner:"${owner}",name:"${name}"){object(expression:"HEAD:${postsDir}"){...on Tree{entries{name object{...on Blob{text}}}}}}}` }),
  });
  const { data, errors } = await res.json() as { data?: { repository: { object: { entries: { name: string, object: { text: string } | null }[] } } }, errors?: unknown };
  if (errors || !data?.repository?.object) throw new Error(`GitHub GraphQL failed: ${JSON.stringify(errors ?? data)}`);

  const posts = new Map<string, Post>();
  for (const entry of data.repository.object.entries) {
    if (!entry.name.endsWith(".md") || !entry.object) continue;
    const post = postFromMarkdown(entry.name, entry.object.text);
    posts.set(post.meta.slug, post);
  }
  return posts;
}
