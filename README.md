# SvelteKit + Unocss + Yuque

> a simple blog template using Yuque as CMS

## Development

Content is read from [yuque-blog-content](https://github.com/CNSeniorious000/yuque-blog-content) through the GitHub API. Set `GITHUB_TOKEN` (fine-grained PAT with read-only **Contents** access to that repo) in `.env.local` — without it the site has no posts to serve. The image-size collector (`bun run collect`) prefers a sibling `yuque-blog-content` checkout and falls back to the same API.
A fine-grained PAT scoped to read-only **Contents** on `yuque-blog-content` is enough; prefer it over a full OAuth token.
