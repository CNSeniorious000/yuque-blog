import imageDimensions from "./image-dimensions.json";

export const login = "muspi_merol";

export const repo = "blog";

const nlarkCdn = "https://cdn.nlark.com/";

const dimensions = imageDimensions as unknown as Record<string, [number, number]>;

export function toLocalNlark(body: string, base = "/nlark/") {
  return body.replaceAll(nlarkCdn, base).replace(/<img [^>]*>/g, fillHeight);
}

// Yuque's ne-image markup carries width but never height; derive it from the collected dimensions
// so the intrinsic ratio is reserved before the image loads. Scaled to the attribute width, since that is the display size.
function fillHeight(tag: string) {
  if (/\bheight="/.test(tag)) return tag;
  const src = /\bsrc="([^"]*)"/.exec(tag)?.[1] ?? "";
  const width = Number(/\bwidth="([^"]*)"/.exec(tag)?.[1]);
  const [w, h] = dimensions[src] ?? dimensions[nlarkCdn + src.replace(/^\/nlark\//, "")] ?? [];
  if (!w || !h) return tag;
  return tag.replace(/(\/?)>$/, ` height="${width ? Math.round((width * h) / w) : h}"$1>`);
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
