import { sveltekit } from "@sveltejs/kit/vite";
import Unocss from "unocss/vite";
import { presetTypography, extractorSvelte, presetUno, presetIcons } from "unocss";

const config = {
  plugins: [
    Unocss({
      extractors: [extractorSvelte],
      presets: [presetIcons(), presetUno(), presetTypography()],
    }),
    sveltekit(),
  ],
};

export default config;
