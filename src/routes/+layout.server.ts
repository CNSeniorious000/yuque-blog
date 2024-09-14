import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies, request }) => {
  const mode = cookies.get("mode") as "dark" | "light" | undefined;
  const language = request.headers.get("accept-language")?.split(",")[0];
  return { mode, language };
}) satisfies LayoutServerLoad;
