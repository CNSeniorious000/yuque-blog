export const login = "muspi_merol";

export const repo = "blog";

const nlarkCdn = "https://cdn.nlark.com/";

export function toLocalNlark(body: string, base = "/nlark/") {
  return body.replaceAll(nlarkCdn, base);
}

export function llmsUrl(routeId: string | null, slug?: string) {
  if (routeId === "/") {
    return "/llms-full.txt";
  }
  if (routeId === "/blog/[slug]") {
    return `/blog/${encodeURIComponent(slug ?? "")}/llms.txt`;
  }
  return "/llms.txt";
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
