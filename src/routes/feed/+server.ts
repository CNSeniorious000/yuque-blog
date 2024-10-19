import type { RequestHandler } from "./$types";

import { text } from "@sveltejs/kit";
import { listPosts } from "$lib/api/list";
import { escape } from "$lib/xml";

export const GET: RequestHandler = async ({ url: { origin } }) => {
  const articles = await listPosts();

  const entries = articles.map(({ id, slug, title, description, created_at, content_updated_at }) => `
    <entry>
      <id>${id}</id>
      <title>${escape(title)}</title>
      <link href="${origin}/blog/${slug}" />
      <summary>${escape(description)}</summary>
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
