export const baseurl = "https://www.yuque.com";

export const namespace = "muspi_merol/blog";

export const [login, repo] = namespace.split("/");

const nlarkCdn = "https://cdn.nlark.com/";

export function toLocalNlark(body: string, base = "/nlark/") {
  return body.replaceAll(nlarkCdn, base);
}

export function formatDate(dateString: string, language: string | undefined) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  };
  try {
    return date.toLocaleDateString(language, options);
  } catch (e) {
    console.error(e);
    console.error(language);
    return date.toLocaleDateString("zh-CN", options);
  }
}
