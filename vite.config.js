import { sveltekit } from "@sveltejs/kit/vite";
import Unocss from "unocss/vite";

const config = {
  plugins: [
    Unocss(),
    sveltekit(),
  ],
};

export default config;
