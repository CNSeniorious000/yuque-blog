export const baseurl = "https://www.yuque.com";

export const namespace = "muspi_merol/blog";

export const [login, repo] = namespace.split("/");

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const result = `${date.getMonth() + 1}月${date.getDate()}日`;
  return date.getFullYear() === new Date().getFullYear() ? result : `${date.getFullYear()}年${result}`;
}
