import type { Post } from "./frontmatter";

import { postFromMarkdown, postsDir } from "./frontmatter";

export const contentRepo = "CNSeniorious000/yuque-blog-content";

export async function fetchPostsFromGitHub(token: string): Promise<Map<string, Post>> {
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

  const posts = new Map<string, Post>();
  for (const entry of data.repository.object.entries) {
    if (!entry.name.endsWith(".md") || !entry.object) {
      continue;
    }
    const post = postFromMarkdown(entry.name, entry.object.text);
    posts.set(post.meta.slug, post);
  }
  return posts;
}
