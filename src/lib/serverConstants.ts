import * as env from "$env/static/private";

const { ACCESS_TOKEN: ak = "", BASE_URL = "https://yuque.com" } = env as { ACCESS_TOKEN?: string; BASE_URL?: string };

export const apiBaseurl = `${BASE_URL}/api/v2`;

export const baseurl = "https://www.yuque.com";

export const headers = { "X-Auth-Token": ak };
