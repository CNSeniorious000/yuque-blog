import * as env from "$env/static/private";

export const githubToken = (env as { GITHUB_TOKEN?: string }).GITHUB_TOKEN ?? "";
