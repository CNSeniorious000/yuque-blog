export const postsDir = "posts";

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
export function parsePost(raw: string): Post {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  const fields: Record<string, unknown> = {};
  for (const line of (match?.[1] ?? "").split("\n")) {
    const i = line.indexOf(": ");
    if (i > 0) {
      fields[line.slice(0, i)] = JSON.parse(line.slice(i + 2));
    }
  }
  const body = match?.[2] ?? raw;
  const meta = {
    ...fields,
    description: fields.custom_description ?? "",
    summary: (fields.custom_description as string) || (fields.description as string) || "",
  } as unknown as PostMeta;
  return { meta, body, searchable: `${meta.title}\n${meta.summary}\n${body}`.toLowerCase() };
}

export function postFromMarkdown(fileName: string, raw: string): Post {
  const post = parsePost(raw);
  post.meta.slug ??= fileName.replace(/\.md$/, "");
  return post;
}

export function renderFrontmatter(metadata: Record<string, number | string | undefined>) {
  const lines = Object.entries(metadata)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}: ${typeof value === "number" ? value : JSON.stringify(value)}`);

  return lines.length ? ["---", ...lines, "---", ""].join("\n") : "";
}
