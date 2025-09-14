import type { LayoutServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";
import { isAIBot } from "ua-parser-js/helpers";

export const load = (async ({ cookies, request: { headers }, route, params }) => {
  if (isAIBot(headers.get("user-agent") ?? "")) {
    switch (route.id) {
      case "/":
        return redirect(302, "/llms-full.txt");
      case "/blog":
        return redirect(302, "/llms.txt");
      case "/blog/[slug]":
        return redirect(302, `/blog/${params.slug}/llms.txt`);
    }
  }
  const mode = cookies.get("mode") as "dark" | "light" | undefined;
  const language = headers.get("accept-language")?.split(",")[0];
  return { mode, language };
}) satisfies LayoutServerLoad;
