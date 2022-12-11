import { sveltekit } from "@sveltejs/kit/vite";
import Unocss from "unocss/vite";
import { extractorSvelte } from "@unocss/core";
import presetUno from "@unocss/preset-uno";
import presetIcons from "@unocss/preset-icons";

const config = {
  plugins: [
    Unocss({
      extractors: [extractorSvelte],
      presets: [presetIcons(), presetUno()],
    }),
    sveltekit(),
  ],
};

export default config;
