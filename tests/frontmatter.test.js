import { postFromMarkdown, postsFromFiles } from "../src/lib/api/frontmatter";
import { afterEach, expect, mock, spyOn, test } from "bun:test";

const markdown = "---\ntitle: \"Good post\"\nslug: \"custom-slug\"\nupdated_at: \"2026-11-10\"\ncontent_updated_at: \"2026-11-10\"\n---\n\nBody";
afterEach(() => mock.restore());

test("reports malformed files while preserving valid posts and strict parsing", () => {
  spyOn(console, "error").mockImplementation(() => {});
  const errors = [];
  const posts = postsFromFiles([["good.md", markdown], ["bad.md", "broken"], ["notes.txt", "ignored"]], error => errors.push(error));
  expect(posts.map(post => post.meta.slug)).toEqual(["custom-slug"]);
  expect(errors).toHaveLength(1);
  expect(errors[0].message).toBe("Failed to parse bad.md");
  expect(errors[0].cause.message).toBe("missing front matter");
  expect(() => postFromMarkdown("bad.md", "broken")).toThrow("missing front matter");
  expect(postsFromFiles([["bad.md", "broken"]])).toEqual([]);
});

test("marks a parsed corpus incomplete and rejects unreadable blobs", async () => {
  // 独立导入真实 GitHub 实现，不使用缓存状态测试的模块 mock。
  const { fetchPostsFromGitHub } = await import(`../src/lib/api/github.ts?test=${crypto.randomUUID()}`);
  spyOn(console, "error").mockImplementation(() => {});
  const entries = [{ name: "good.md", object: { text: markdown, isTruncated: false } }, { name: "bad.md", object: { text: "broken", isTruncated: false } }];
  spyOn(globalThis, "fetch").mockImplementation(async () => Response.json({ data: { repository: { head: { oid: "head" }, tree: { entries } } } }));
  const result = await fetchPostsFromGitHub("test-token");
  expect(result.oid).toBe("head");
  expect([...result.posts.keys()]).toEqual(["custom-slug"]);
  expect(result.parseError).toBeInstanceOf(AggregateError);
  expect(result.parseError.errors[0].message).toBe("Failed to parse bad.md");
  entries.pop();
  expect((await fetchPostsFromGitHub("test-token")).parseError).toBeUndefined();
  entries[0].object.isTruncated = true;
  await expect(fetchPostsFromGitHub("test-token")).rejects.toThrow("unreadable post blob: good.md");
  entries[0].object = null;
  await expect(fetchPostsFromGitHub("test-token")).rejects.toThrow("unreadable post blob: good.md");
  entries.length = 0;
  const empty = await fetchPostsFromGitHub("test-token");
  expect(empty.posts.size).toBe(0);
  expect(empty.parseError).toBeUndefined();
});
