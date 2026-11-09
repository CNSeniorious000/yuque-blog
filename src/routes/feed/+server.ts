import type { RequestHandler } from "./$types";

import { text } from "@sveltejs/kit";
import { getPost } from "$lib/api/each";
import { listPosts } from "$lib/api/list";
import { escape } from "$lib/xml";
import { marked } from "marked";

export const GET: RequestHandler = async ({ url: { origin } }) => {
  const articles = await listPosts();

  const entries = (await Promise.all(articles.map(async ({ id, slug, title, summary, created_at, content_updated_at }) => {
    const { body } = await getPost(slug);

    const content = marked.parse(body, { async: false });

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
  }))).join("\n");

  return text(`
    <?xml version="1.0" encoding="UTF-8" ?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Muspi Merol</title>
      <subtitle>Muspi Merol's Blog</subtitle>
      <link href="${escape(`${origin}/blog`)}" />
      <updated>${new Date().toISOString()}</updated>
      <id>${escape(origin)}</id>
      ${entries}
    </feed>
  `.trim(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
