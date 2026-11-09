import type { RequestHandler } from "./$types";

import { text } from "@sveltejs/kit";
import { getPost } from "$lib/api/each";
import { formatDate, toLocalNlark } from "$lib/utils";

export const GET: RequestHandler = async ({ params: { slug }, request: { headers } }) => {
  const language = headers.get("accept-language");
  const { title, body, created_at } = await getPost(slug);

  return text(`

# ${title} (${formatDate(created_at, language)})

${toLocalNlark(body)}

    `.trim(), { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
  } });
};
