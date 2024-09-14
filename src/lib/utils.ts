import * as env from "$env/static/public";

const { PUBLIC_ACCESS_TOKEN: ak = "", PUBLIC_API_BASE: apiBase = "https://yuque.com" } = env as { PUBLIC_ACCESS_TOKEN?: string; PUBLIC_API_BASE?: string };

export const apiBaseurl = `${apiBase}/api/v2`;
export const baseurl = "//www.yuque.com";
export const namespace = "muspi_merol/blog";
export const [login, repo] = namespace.split("/");
export const headers = { "X-Auth-Token": ak };

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const result = `${date.getMonth() + 1}月${date.getDate()}日`;
  return date.getFullYear() === new Date().getFullYear() ? result : `${date.getFullYear()}年${result}`;
}
