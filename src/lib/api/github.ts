import type { Post } from "./frontmatter";

import { postsDir, postsFromFiles } from "./frontmatter";

export const contentRepo = "CNSeniorious000/yuque-blog-content";

const [owner, name] = contentRepo.split("/");

async function graphql<T>(token: string | undefined, query: string): Promise<T> {
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set (see README)");
  }
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github+json", "User-Agent": "yuque-blog", "content-type": "application/json" },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({ query }),
  });
  const { data, errors } = await res.json() as { data?: T; errors?: unknown };
  if (errors || !data) {
    throw new Error(`GitHub GraphQL failed: ${JSON.stringify(errors ?? data)}`);
  }
  return data;
}

export async function fetchHeadOid(token: string | undefined): Promise<string> {
  const { repository } = await graphql<{ repository: { object: { oid: string } | null } }>(token, `{repository(owner:"${owner}",name:"${name}"){object(expression:"HEAD"){...on Commit{oid}}}}`);
  const oid = repository.object?.oid;
  if (!oid) {
    throw new Error("GitHub GraphQL failed: no HEAD commit");
  }
  return oid;
}

export async function fetchPostsFromGitHub(token: string | undefined): Promise<Map<string, Post>> {
  const { repository } = await graphql<{ repository: { object: { entries: { name: string; object: { text: string } | null }[] } | null } }>(token, `{repository(owner:"${owner}",name:"${name}"){object(expression:"HEAD:${postsDir}"){...on Tree{entries{name object{...on Blob{text}}}}}}}`);
  const entries = repository.object?.entries;
  if (!entries) {
    throw new Error("GitHub GraphQL failed: no posts tree");
  }
  const files: [string, string][] = [];
  for (const entry of entries) {
    if (typeof entry.object?.text === "string") {
      files.push([entry.name, entry.object.text]);
    }
  }
  const posts = new Map<string, Post>();
  for (const post of postsFromFiles(files)) {
    posts.set(post.meta.slug, post);
  }
  return posts;
}
