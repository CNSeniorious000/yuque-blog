import type { RequestHandler } from "./$types";

import { text } from "@sveltejs/kit";
import { getPost } from "$lib/api/each";
import { listPosts } from "$lib/api/list";
import { escape } from "$lib/xml";
import { load } from "cheerio";
import { parseDocument } from "htmlparser2";

export const GET: RequestHandler = async ({ url: { origin } }) => {
  const { articles } = await listPosts();

  const entries = (await Promise.all(articles.map(async ({ id, slug, title, description, created_at, content_updated_at }) => {
    const { body_html } = await getPost(slug);

    const $ = load(parseDocument(body_html));
    $("img").each((_, img) => {
      const src = $(img).attr("src");
      if (src && src.startsWith("https://cdn.nlark.com/")) {
        $(img).attr("src", src.replace("https://cdn.nlark.com/", `${origin}/nlark/`));
      }
    });
    $("span").each(function () {
      const content = $(this).html();
      if (content) {
        $(this).replaceWith(content);
      }
    });
    for (const attribute of ["id", "class", "data-lake-index-type", "data-href"]) {
      $(`[${attribute}]`).each((_, el) => {
        $(el).removeAttr(attribute);
      });
    }

    const content = $.html();

    return `
      <entry>
        <id>${id}</id>
        <title>${escape(title)}</title>
        <link href="${origin}/blog/${slug}" />
        <author>
          <name>Muspi Merol 庄毅辉</name>
        </author>
        <summary>${escape(description)}</summary>
        <content type="html">${escape(content)}</content>
        <published>${created_at}</published>
        <updated>${content_updated_at}</updated>
      </entry>`;
  }))).join("\n");

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

export const config = { isr: { expiration: 300 } };
