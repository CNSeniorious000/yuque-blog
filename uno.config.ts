import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetTypography, presetUno, transformerVariantGroup, transformerDirectives } from "unocss";

export default defineConfig({
  extractors: [extractorSvelte()],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [presetUno(), presetTypography()],
});
