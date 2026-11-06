import * as env from "$env/static/private";

const { GITHUB_TOKEN = "" } = env as { GITHUB_TOKEN?: string };

export const contentRepo = "CNSeniorious000/yuque-blog-content";

export const githubHeaders = { "Authorization": `Bearer ${GITHUB_TOKEN}`, "Accept": "application/vnd.github+json", "User-Agent": "yuque-blog" };
