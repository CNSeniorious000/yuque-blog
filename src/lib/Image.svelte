<script lang="ts">
  import type { ImageSnippetProps } from "@humanspeak/svelte-markdown";

  import imageDimensions from "./image-dimensions.json";

  type ImageDimensions = [number, number];
  type ImageDimensionsMap = Record<string, ImageDimensions>;

  const { href, title, text }: ImageSnippetProps = $props();

  let error = $state(false);

  const dimensionsMap = imageDimensions as unknown as ImageDimensionsMap;
  const dimensions = $derived(!href ? undefined : dimensionsMap[href] || dimensionsMap[`https://cdn.nlark.com/${href.replace(/^\/nlark\//, "")}`]);

  const handleLoad = (event: Event) => {
    error = (event.currentTarget as HTMLImageElement | null)?.naturalWidth === 0;
  };

  const handleError = () => {
    error = true;
  };
</script>

<img
  src={href}
  {title}
  alt={text}
  loading="lazy"
  class:error
  onload={handleLoad}
  onerror={handleError}
  width={dimensions?.[0]}
  height={dimensions?.[1]}
/>

<style>
  img {
    max-width: 100%;
    height: auto;
  }

  img.error {
    opacity: 0.5;
    filter: grayscale(100%);
  }
</style>
