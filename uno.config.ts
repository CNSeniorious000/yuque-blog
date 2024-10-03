import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetTypography, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from "unocss";

export default defineConfig({
  extractors: [extractorSvelte()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [presetUno(), presetTypography(), presetWebFonts({ provider: "none", fonts: { mono: "Fira Code Variable" } })],
});
