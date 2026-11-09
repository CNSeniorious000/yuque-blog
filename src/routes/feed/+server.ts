import type { RequestHandler } from "./$types";

import { loadPosts } from "#lib/api/store.js";
import { toLocalNlark, xmlResponse } from "#lib/utils.js";
import { escape } from "#lib/xml.js";
import { marked } from "marked";

export const GET: RequestHandler = async ({ url: { origin } }) => {
  const articles = [...(await loadPosts()).values()].sort((a, b) => (a.meta.content_updated_at < b.meta.content_updated_at ? 1 : -1));

  const entries = articles.map(({ meta: { id, slug, title, summary, created_at, content_updated_at }, body }) => {
    const content = marked.parse(toLocalNlark(body, `${origin}/nlark/`), { async: false });

    return `
      <entry>
        <id>${escape(id)}</id>
        <title>${escape(title)}</title>
        <link href="${escape(`${origin}/blog/${slug}`)}" />
        <author>
          <name>Muspi Merol 庄毅辉</name>
        </author>
        <summary>${escape(summary)}</summary>
        <content type="html">${escape(content)}</content>
        <published>${escape(created_at)}</published>
        <updated>${escape(content_updated_at)}</updated>
      </entry>`;
  }).join("\n");

  return xmlResponse(`
    <?xml version="1.0" encoding="UTF-8" ?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Muspi Merol</title>
      <subtitle>Muspi Merol's Blog</subtitle>
      <link href="${escape(`${origin}/blog`)}" />
      <updated>${new Date().toISOString()}</updated>
      <id>${escape(origin)}</id>
      ${entries}
    </feed>
  `.trim());
};
