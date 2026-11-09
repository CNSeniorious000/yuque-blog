export const login = "muspi_merol";

export const repo = "blog";

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
