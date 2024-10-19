import type { RequestHandler } from "./$types";

import { text } from "@sveltejs/kit";
import { apiBaseurl, headers } from "$lib/serverConstants";
import { namespace } from "$lib/utils";

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, c => `&${({
    "<": "lt",
    ">": "gt",
    "&": "amp",
    "'": "apos",
    "\"": "quot",
  })[c]};`);
};

interface Document {
  id: number;
  slug: string;
  title: string;
  description: string;
  created_at: string;
  content_updated_at: string;
}

export const GET: RequestHandler = async ({ fetch, url: { origin } }) => {
  const res = await fetch(`${apiBaseurl}/repos/${namespace}/docs`, { headers });
  const { data: articles }: { data: Document[] } = await res.json();

  const entries = articles.map(({ id, slug, title, description, created_at, content_updated_at }) => `
    <entry>
      <id>${id}</id>
      <title>${escapeXml(title)}</title>
      <link href="${origin}/blog/${slug}" />
      <summary>${escapeXml(description)}</summary>
      <published>${created_at}</published>
      <updated>${content_updated_at}</updated>
    </entry>`).join("\n");

  return text(`
    <?xml version="1.0" encoding="UTF-8" ?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Muspi Merol</title>
      <subtitle>Muspi Merol's Blog</subtitle>
      <link href="${origin}/blog" />
      <updated>${new Date().toISOString()}</updated>
      <id>${origin}</id>
      ${entries}
    </feed>
  `.trim(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
