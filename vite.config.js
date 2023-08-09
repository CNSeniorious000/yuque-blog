import { sveltekit } from "@sveltejs/kit/vite";
import Unocss from "unocss/vite";
import extractorSvelte from "@unocss/extractor-svelte"
import { presetTypography, presetUno } from "unocss";

const config = {
  plugins: [
    Unocss({
      extractors: [extractorSvelte()],
      presets: [presetUno(), presetTypography()],
    }),
    sveltekit(),
  ],
};

export default config;
