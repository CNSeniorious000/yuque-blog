import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetTypography, presetWebFonts, presetWind3, transformerDirectives, transformerVariantGroup } from "unocss";

export default defineConfig({
  extractors: [extractorSvelte()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [presetWind3(), presetTypography(), presetWebFonts({ provider: "none", fonts: { mono: "Fira Code Variable" } })],
  shortcuts: {
    "transition-color": "transition-color duration-800 dark:duration-300",
    "transition-shadow": "transition-shadow duration-800 dark:duration-300",
    "transition-colors": "transition-colors duration-800 dark:duration-300",
    "transition-background-color": "transition-background-color duration-800 dark:duration-300",
  },
});
