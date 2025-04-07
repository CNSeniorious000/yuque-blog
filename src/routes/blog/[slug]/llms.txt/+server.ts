import type { RequestHandler } from "./$types";

import { text } from "@sveltejs/kit";
import { getPost } from "$lib/api/each";
import { formatDate } from "$lib/utils";

export const GET: RequestHandler = async ({ params: { slug }, request: { headers } }) => {
  const language = headers.get("accept-language")?.split(",")[0];
  const { title, body, created_at } = await getPost(slug);

  return text(`

# ${title} (${formatDate(created_at, language)})

${body.replaceAll("https://cdn.nlark.com/", "/nlark/")}

    `.trim(), { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
  } });
};
