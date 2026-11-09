import type { RequestHandler } from "./$types";

import { getPost } from "#lib/api/each.js";
import { formatDate, markdownResponse, toLocalNlark } from "#lib/utils.js";

export const GET: RequestHandler = async ({ params: { slug }, request: { headers } }) => {
  const language = headers.get("accept-language");
  const { title, body, created_at } = await getPost(slug);

  return markdownResponse(`

# ${title} (${formatDate(created_at, language)})

${toLocalNlark(body)}

    `.trim());
};
