import type { RequestHandler } from "./$types";

import { getPostOr404 } from "#lib/api/each.js";
import { formatDate, markdownResponse, toLocalNlark } from "#lib/utils.js";

export const GET: RequestHandler = async ({ params: { slug }, request: { headers } }) => {
  const language = headers.get("accept-language");
  const { title, body, created_at } = await getPostOr404(slug);

  return markdownResponse(`

# ${title} (${formatDate(created_at, language)})

${toLocalNlark(body)}

    `.trim());
};
