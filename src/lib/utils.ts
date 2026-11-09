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

export const updatedLabel = (dateString: string, acceptLanguage: string | null | undefined, isChinese: boolean) => (isChinese ? "最后更新于：" : "Updated on ") + formatDate(dateString, acceptLanguage);

export const countLabel = (n: number, isChinese: boolean) => (isChinese ? `共 ${n} 篇文章` : `${n} articles`);

export const markdownResponse = (body: string) => new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });

export const xmlResponse = (body: string) => new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });

// Accept-Language arrives raw: rank ranges by quality, keep only tags Intl accepts, treat "*" as absent
export function pickLocale(acceptLanguage: string | null | undefined) {
  const ranges = (acceptLanguage ?? "").split(",").map((range) => {
    const [tag, q] = range.trim().split(/;[ \t]*q=/i);
    const quality = Number(q);
    return { tag: tag.trim(), q: Number.isFinite(quality) ? quality : 1 };
  }).sort((a, b) => b.q - a.q);
  for (const { tag, q } of ranges) {
    if (!tag || tag === "*" || q <= 0) {
      continue;
    }
    try {
      return Intl.getCanonicalLocales(tag)[0];
    } catch {}
  }
  return undefined;
}
