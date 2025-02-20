import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetTypography, presetWebFonts, presetWind3, transformerDirectives, transformerVariantGroup } from "unocss";

export default defineConfig({
  extractors: [extractorSvelte()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [presetWind3(), presetTypography(), presetWebFonts({ provider: "none", fonts: { mono: "Fira Code Variable" } })],
});
