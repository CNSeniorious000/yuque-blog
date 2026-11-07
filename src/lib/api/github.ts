import type { Post } from "./frontmatter";

import { postsDir, postsFromFiles } from "./frontmatter";

export const contentRepo = "CNSeniorious000/yuque-blog-content";

export async function fetchPostsFromGitHub(token: string | undefined): Promise<Map<string, Post>> {
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set (see README)");
  }
  const [owner, name] = contentRepo.split("/");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github+json", "User-Agent": "yuque-blog", "content-type": "application/json" },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({ query: `{repository(owner:"${owner}",name:"${name}"){object(expression:"HEAD:${postsDir}"){...on Tree{entries{name object{...on Blob{text}}}}}}}` }),
  });
  const { data, errors } = await res.json() as { data?: { repository: { object: { entries: { name: string; object: { text: string } | null }[] } } }; errors?: unknown };
  if (errors || !data?.repository?.object) {
    throw new Error(`GitHub GraphQL failed: ${JSON.stringify(errors ?? data)}`);
  }

  const files: [string, string][] = [];
  for (const entry of data.repository.object.entries) {
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
