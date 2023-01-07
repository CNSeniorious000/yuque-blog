export const apiBaseurl = "https://lark.muspimerol.site/api/v2";
export const baseurl = "//www.yuque.com";
export const namespace = "muspi_merol/blog";
export const headers = {}; // no need for token now

export function formatDate(string) {
  let date = new Date(string);
  let result = `${date.getMonth() + 1}月${date.getDate()}日`;
  return date.getFullYear() === new Date().getFullYear() ? result : `${date.getFullYear()}年${result}`;
}
