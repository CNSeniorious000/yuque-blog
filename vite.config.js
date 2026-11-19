import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import process from "node:process";
import unocss from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    unocss(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: process.env.CF_PAGES ? (await import("adapter-cloudflare-pages")).default() : adapter(),
      paths: { origin: "https://muspimerol.site" },
      // MCP terminateSession() sends a bodyless DELETE with no Origin; this app has no cookie-auth'd mutations to forge
      csrf: { trustedOrigins: ["*"] },
    }),
  ],
});
