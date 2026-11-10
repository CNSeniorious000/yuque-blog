import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";

const fetchHeadOid = mock();
const fetchPostsFromGitHub = mock();
mock.module("../src/lib/api/github", () => ({ fetchHeadOid, fetchPostsFromGitHub }));
mock.module("$app/env/private", () => ({ GITHUB_TOKEN: "test-token" }));

const originalPosts = new Map([["existing", { slug: "existing" }]]);
const updatedPosts = new Map([...originalPosts, ["new", { slug: "new" }]]);
let now;
let loadPosts;
let lookupPost;

beforeEach(async () => {
  now = 1_000_000;
  spyOn(Date, "now").mockImplementation(() => now);
  fetchHeadOid.mockReset().mockResolvedValue("original");
  fetchPostsFromGitHub.mockReset().mockResolvedValue({ oid: "original", posts: originalPosts });
  // Each import gets its own cache state without exposing a production reset hook.
  ({ loadPosts, lookupPost } = await import(`../src/lib/api/store.ts?test=${crypto.randomUUID()}`));
});

afterEach(() => mock.restore());

test("shares a single cold fetch across concurrent requests", async () => {
  const pending = Promise.withResolvers();
  fetchPostsFromGitHub.mockReturnValueOnce(pending.promise);

  const first = loadPosts();
  const second = loadPosts();
  const post = lookupPost("existing");
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(1);
  expect(fetchPostsFromGitHub).toHaveBeenCalledWith("test-token");
  expect(fetchHeadOid).not.toHaveBeenCalled();

  pending.resolve({ oid: "original", posts: originalPosts });
  expect(await first).toBe(originalPosts);
  expect(await second).toBe(originalPosts);
  expect(await post).toBe(originalPosts.get("existing"));
});

test("shares and awaits an expired snapshot's revalidation", async () => {
  await loadPosts();
  now += 60_000;
  const pending = Promise.withResolvers();
  fetchHeadOid.mockReturnValueOnce(pending.promise);

  let settled = false;
  const first = loadPosts().then((posts) => {
    settled = true;
    return posts;
  });
  const second = loadPosts();
  await Promise.resolve();
  expect(settled).toBe(false);
  expect(fetchHeadOid).toHaveBeenCalledTimes(1);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(1);

  fetchPostsFromGitHub.mockResolvedValueOnce({ oid: "updated", posts: updatedPosts });
  pending.resolve("updated");
  expect(await first).toBe(updatedPosts);
  expect(await second).toBe(updatedPosts);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(2);
});

test("extends the TTL without fetching the corpus when HEAD is unchanged", async () => {
  await loadPosts();
  now += 59_999;
  expect(await loadPosts()).toBe(originalPosts);
  expect(fetchHeadOid).not.toHaveBeenCalled();

  now += 1;
  expect(await loadPosts()).toBe(originalPosts);
  expect(fetchHeadOid).toHaveBeenCalledTimes(1);
  expect(fetchHeadOid).toHaveBeenCalledWith("test-token");
  now += 59_999;
  expect(await loadPosts()).toBe(originalPosts);
  expect(fetchHeadOid).toHaveBeenCalledTimes(1);
  now += 1;
  expect(await loadPosts()).toBe(originalPosts);
  expect(fetchHeadOid).toHaveBeenCalledTimes(2);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(1);
});

test("refreshes changed HEADs and starts the TTL when the fetch completes", async () => {
  await loadPosts();
  now += 60_000;
  fetchHeadOid.mockResolvedValue("updated");
  const started = Promise.withResolvers();
  const pending = Promise.withResolvers();
  fetchPostsFromGitHub.mockImplementationOnce(() => {
    started.resolve();
    return pending.promise;
  });
  const refreshing = loadPosts();
  await started.promise;
  now += 5_000;
  pending.resolve({ oid: "updated", posts: updatedPosts });
  expect(await refreshing).toBe(updatedPosts);

  now += 59_999;
  expect(await lookupPost("new")).toBe(updatedPosts.get("new"));
  expect(fetchHeadOid).toHaveBeenCalledTimes(1);
  now += 1;
  expect(await loadPosts()).toBe(updatedPosts);
  expect(fetchHeadOid).toHaveBeenCalledTimes(2);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(2);
});

test.each(["HEAD", "corpus"])("serves stale posts after a %s failure and retries after backoff", async (stage) => {
  await loadPosts();
  now += 60_000;
  const error = new Error("upstream unavailable");
  fetchHeadOid.mockResolvedValue("updated");
  if (stage === "HEAD") {
    fetchHeadOid.mockRejectedValueOnce(error);
  } else {
    fetchPostsFromGitHub.mockRejectedValueOnce(error);
  }

  expect(await loadPosts()).toBe(originalPosts);
  const corpusCalls = stage === "HEAD" ? 1 : 2;
  now += 29_999;
  expect(await loadPosts()).toBe(originalPosts);
  expect(await lookupPost("existing")).toBe(originalPosts.get("existing"));
  expect(fetchHeadOid).toHaveBeenCalledTimes(1);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(corpusCalls);

  now += 1;
  fetchPostsFromGitHub.mockResolvedValueOnce({ oid: "updated", posts: updatedPosts });
  expect(await loadPosts()).toBe(updatedPosts);
  expect(fetchHeadOid).toHaveBeenCalledTimes(2);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(corpusCalls + 1);
});

test("shares cold failures and fails fast until the retry window expires", async () => {
  const pending = Promise.withResolvers();
  const error = new Error("upstream unavailable");
  fetchPostsFromGitHub.mockReturnValueOnce(pending.promise);
  const requests = Promise.allSettled([loadPosts(), loadPosts(), lookupPost("missing")]);
  pending.reject(error);
  expect(await requests).toEqual(Array.from({ length: 3 }, () => ({ status: "rejected", reason: error })));
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(1);

  now += 29_999;
  await expect(loadPosts()).rejects.toBe(error);
  await expect(lookupPost("missing")).rejects.toBe(error);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(1);
  now += 1;
  expect(await loadPosts()).toBe(originalPosts);
  expect(await lookupPost("missing")).toBeUndefined();
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(2);
  expect(fetchHeadOid).not.toHaveBeenCalled();
});

test("distinguishes a missing slug during a stale outage from a confirmed absence", async () => {
  expect(await lookupPost("missing")).toBeUndefined();
  now += 60_000;
  const error = new Error("upstream unavailable");
  fetchHeadOid.mockRejectedValueOnce(error);
  await expect(lookupPost("missing")).rejects.toBe(error);
  expect(await lookupPost("existing")).toBe(originalPosts.get("existing"));
  now += 29_999;
  await expect(lookupPost("missing")).rejects.toBe(error);
  expect(fetchHeadOid).toHaveBeenCalledTimes(1);

  now += 1;
  expect(await lookupPost("missing")).toBeUndefined();
  expect(fetchHeadOid).toHaveBeenCalledTimes(2);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(1);
});

test("keeps partial snapshots usable without claiming missing slugs are absent", async () => {
  const parseError = new AggregateError([new Error("invalid front matter")], "partial corpus");
  fetchPostsFromGitHub.mockResolvedValueOnce({ oid: "original", posts: originalPosts, parseError });
  expect(await lookupPost("existing")).toBe(originalPosts.get("existing"));
  await expect(lookupPost("missing")).rejects.toBe(parseError);
  now += 60_000;
  await expect(lookupPost("missing")).rejects.toBe(parseError);
  expect(fetchPostsFromGitHub).toHaveBeenCalledTimes(1);

  now += 60_000;
  const outage = new Error("upstream unavailable");
  fetchHeadOid.mockRejectedValueOnce(outage);
  await expect(lookupPost("missing")).rejects.toBe(outage);
  expect(await lookupPost("existing")).toBe(originalPosts.get("existing"));
  now += 30_000;
  await expect(lookupPost("missing")).rejects.toBe(parseError);
});

test.each([originalPosts, new Map()])("clears parse errors only after a complete replacement snapshot (%#)", async (posts) => {
  const parseError = new AggregateError([], "partial corpus");
  fetchPostsFromGitHub.mockResolvedValueOnce({ oid: "original", posts: originalPosts, parseError });
  await expect(lookupPost("missing")).rejects.toBe(parseError);
  now += 60_000;
  fetchHeadOid.mockResolvedValue("fixed");
  fetchPostsFromGitHub.mockResolvedValueOnce({ oid: "fixed", posts });
  expect(await lookupPost("missing")).toBeUndefined();
  expect(await loadPosts()).toBe(posts);
});
