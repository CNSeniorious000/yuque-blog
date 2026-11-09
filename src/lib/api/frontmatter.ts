export const postsDir = "posts";

export function postPath(slug: string) {
  return `${postsDir}/${slug}.md`;
}

export function isPostFile(name: string) {
  return name.endsWith(".md");
}

export interface PostMeta {
  id: number;
  title: string;
  slug: string;
  /** hand-written summary (custom_description), "" when absent */
  description: string;
  /** best available summary: hand-written, falling back to the exporter's auto excerpt */
  summary: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  content_updated_at: string;
  [key: string]: unknown;
}

export interface Post {
  meta: PostMeta;
  body: string;
  searchable: string;
}

// front matter is machine-generated: `key: <json value>` per line
function parsePost(raw: string): Post {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("missing front matter");
  }
  const fields: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(": ");
    if (i > 0) {
      fields[line.slice(0, i)] = JSON.parse(line.slice(i + 2));
    }
  }
  const body = match[2];
  const custom = fields.custom_description;
  const excerpt = fields.description;
  if ((custom != null && typeof custom !== "string") || (excerpt != null && typeof excerpt !== "string")) {
    throw new TypeError("description fields must be strings"); // escaped into feeds and pages
  }
  const meta = {
    ...fields,
    description: custom ?? "",
    summary: custom || excerpt || "",
  } as PostMeta;
  if (typeof meta.title !== "string") {
    throw new TypeError("missing title"); // feeds and lists format titles unconditionally
  }
  // full datetime; the calendar probe rejects values Date.parse silently normalizes, e.g. 2024-02-31
  const isDate = (v: unknown) => {
    const m = typeof v === "string" ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(v) : null;
    if (!m || Number.isNaN(Date.parse(m.input))) {
      return false;
    }
    const [y, mo, d] = [+m[1], +m[2], +m[3]];
    const probe = new Date(Date.UTC(y, mo - 1, d));
    return probe.getUTCFullYear() === y && probe.getUTCMonth() === mo - 1 && probe.getUTCDate() === d;
  };
  if (!isDate(meta.created_at) || !isDate(meta.updated_at) || !isDate(meta.content_updated_at)) {
    throw new TypeError("invalid date field"); // feed <published>/<updated>, display formatting and sitemap lastmod
  }
  return { meta, body, searchable: `${meta.title}\n${meta.summary}\n${body}`.toLowerCase() };
}

export function postFromMarkdown(fileName: string, raw: string): Post {
  const post = parsePost(raw);
  post.meta.slug ??= fileName.replace(/\.md$/, "");
  return post;
}

// one malformed file must not take down the rest of the corpus
export function postsFromFiles(files: Iterable<readonly [string, string]>): Post[] {
  const posts: Post[] = [];
  for (const [name, text] of files) {
    if (!isPostFile(name)) {
      continue;
    }
    try {
      posts.push(postFromMarkdown(name, text));
    } catch (error) {
      console.error(`Skipping ${name}: ${error}`);
    }
  }
  return posts;
}

export function renderFrontmatter(metadata: Record<string, number | string | undefined>) {
  const lines = Object.entries(metadata)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}: ${typeof value === "number" ? value : JSON.stringify(value)}`);

  return lines.length ? ["---", ...lines, "---", ""].join("\n") : "";
}
