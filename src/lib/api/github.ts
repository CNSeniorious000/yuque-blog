import type { Post } from "./frontmatter";

import { isPostFile, postsDir, postsFromFiles } from "./frontmatter";

export const contentRepo = "CNSeniorious000/yuque-blog-content";
export const [contentRepoOwner, contentRepoName] = contentRepo.split("/");

export function requireGithubToken(token: string | undefined): string {
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set (see README)");
  }
  return token;
}

async function graphql<T>(token: string | undefined, query: string): Promise<T> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { "Authorization": `Bearer ${requireGithubToken(token)}`, "Accept": "application/vnd.github+json", "User-Agent": "yuque-blog", "content-type": "application/json" },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({ query }),
  });
  const { data, errors } = await res.json() as { data?: T; errors?: unknown };
  if (errors || !data) {
    throw new Error(`GitHub GraphQL failed: ${JSON.stringify(errors ?? data)}`);
  }
  return data;
}

/** the ~200B probe used to notice upstream changes without downloading the corpus */
export async function fetchHeadOid(token: string | undefined): Promise<string> {
  const { repository } = await graphql<{ repository: { object: { oid: string } | null } }>(token, `{repository(owner:"${contentRepoOwner}",name:"${contentRepoName}"){object(expression:"HEAD"){...on Commit{oid}}}}`);
  const oid = repository.object?.oid;
  if (!oid) {
    throw new Error("GitHub GraphQL failed: no HEAD commit");
  }
  return oid;
}

/** raw post files paired with the head oid they belong to; parse policy belongs to the caller */
export async function fetchCorpus(token: string | undefined): Promise<{ oid: string; files: [string, string][] }> {
  const { repository } = await graphql<{ repository: { head: { oid: string } | null; tree: { entries: { name: string; object: { text: string | null; isTruncated: boolean } | null }[] } | null } }>(token, `{repository(owner:"${contentRepoOwner}",name:"${contentRepoName}"){head: object(expression:"HEAD"){...on Commit{oid}} tree: object(expression:"HEAD:${postsDir}"){...on Tree{entries{name object{...on Blob{text isTruncated}}}}}}}`);
  const oid = repository.head?.oid;
  const entries = repository.tree?.entries;
  if (!oid || !entries) {
    throw new Error("GitHub GraphQL failed: no posts tree");
  }
  const files: [string, string][] = [];
  for (const entry of entries) {
    if (!isPostFile(entry.name)) {
      continue;
    }
    if (typeof entry.object?.text !== "string" || entry.object.isTruncated) {
      throw new Error(`unreadable post blob: ${entry.name}`); // an incomplete corpus must never be served or recorded
    }
    files.push([entry.name, entry.object.text]);
  }
  return { oid, files };
}

export async function fetchPostsFromGitHub(token: string | undefined): Promise<{ oid: string; posts: Map<string, Post> }> {
  const { oid, files } = await fetchCorpus(token);
  const posts = new Map<string, Post>();
  for (const post of postsFromFiles(files)) {
    posts.set(post.meta.slug, post);
  }
  return { oid, posts };
}
