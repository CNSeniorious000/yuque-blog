# SvelteKit + Unocss + Yuque

> a simple blog template using Yuque as CMS

## Development

Content is read from [yuque-blog-content](https://github.com/CNSeniorious000/yuque-blog-content) through the GitHub API. Set `GITHUB_TOKEN` in `.env.local` (a fine-grained PAT scoped to read-only **Contents** on that repo is enough — prefer it over a full OAuth token) — without it the site has no posts to serve. The image-size collector (`bun run collect`) prefers a sibling `yuque-blog-content` checkout and falls back to the same API.
