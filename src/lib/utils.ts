import { PUBLIC_ACCESS_TOKEN as ak, PUBLIC_API_BASE as apiBase } from "$env/static/public";

export const apiBaseurl = `${apiBase}/api/v2`;
export const baseurl = "//www.yuque.com";
export const namespace = "muspi_merol/blog";
export const headers = { "X-Auth-Token": ak };

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const result = `${date.getMonth() + 1}月${date.getDate()}日`;
  return date.getFullYear() === new Date().getFullYear() ? result : `${date.getFullYear()}年${result}`;
}
