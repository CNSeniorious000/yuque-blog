import { defineConfig, presetTypography, presetUno, transformerVariantGroup, transformerDirectives } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";

export default defineConfig({
    extractors: [extractorSvelte()],
    transformers: [transformerVariantGroup(), transformerDirectives()],
    presets: [presetUno(), presetTypography()],
});
