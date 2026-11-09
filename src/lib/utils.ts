export const login = "muspi_merol";

export const repo = "blog";

const nlarkCdn = "https://cdn.nlark.com/";

export function toLocalNlark(body: string, base = "/nlark/") {
  return body.replaceAll(nlarkCdn, base);
}

export function formatDate(dateString: string, acceptLanguage: string | null | undefined) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  };
  return date.toLocaleDateString(pickLocale(acceptLanguage), options);
}

// Accept-Language arrives raw: rank ranges by quality, keep only tags Intl accepts, treat "*" as absent
function pickLocale(acceptLanguage: string | null | undefined) {
  const ranges = (acceptLanguage ?? "").split(",").map((range) => {
    const [tag, q] = range.trim().split(";q=");
    const quality = Number(q);
    return { tag: tag.trim(), q: Number.isFinite(quality) ? quality : 1 };
  }).sort((a, b) => b.q - a.q);
  for (const { tag } of ranges) {
    if (!tag || tag === "*") continue;
    try {
      return Intl.getCanonicalLocales(tag)[0];
    } catch {}
  }
  return undefined;
}
