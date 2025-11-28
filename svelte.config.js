import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    output: {
      preloadStrategy: "preload-mjs",
    },
    prerender: {
      origin: "https://muspimerol.site",
    },
  },
};

export default config;
