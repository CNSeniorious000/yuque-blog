import { PUBLIC_API_BASE as apiBase, PUBLIC_ACCESS_TOKEN as ak } from "$env/static/public"


export const apiBaseurl = apiBase + "/api/v2";
export const baseurl = "//www.yuque.com";
export const namespace = "muspi_merol/blog";
export const headers = { "X-Auth-Token": ak };

export function formatDate(string) {
  let date = new Date(string);
  let result = `${date.getMonth() + 1}月${date.getDate()}日`;
  return date.getFullYear() === new Date().getFullYear() ? result : `${date.getFullYear()}年${result}`;
}
