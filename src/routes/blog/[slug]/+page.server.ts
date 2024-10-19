import { getPost } from "$lib/api/each.js";
import { load as loadCheerio } from "cheerio";
import { parseDocument } from "htmlparser2";

export async function load({ params }) {
  const { slug } = params;
  const { description, title, body: markdown, body_html, updated_at } = await getPost(slug);

  const $ = loadCheerio(parseDocument(body_html));
  const fullText = $("div.lake-content").text();

  return { description: fullText.startsWith(description.replace(/\.\.\.$/, "")) ? undefined : description, title, markdown, updated_at };
}
