import { defineConfig, presetTypography, presetUno, transformerVariantGroup } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";

export default defineConfig({
    extractors: [extractorSvelte()],
    transformers: [transformerVariantGroup()],
    presets: [presetUno(), presetTypography()],
});
