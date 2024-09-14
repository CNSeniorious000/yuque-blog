import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
  const mode = cookies.get("mode") as "dark" | "light" | undefined;
  return { mode };
}) satisfies LayoutServerLoad;
