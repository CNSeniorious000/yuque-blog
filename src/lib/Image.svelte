<script lang="ts">
  import type { ImageSnippetProps } from "@humanspeak/svelte-markdown";

  import { onMount } from "svelte";

  type ImageDimensions = [number, number];
  type ImageDimensionsMap = Record<string, ImageDimensions>;

  interface Props extends ImageSnippetProps {
    lazy?: boolean;
    fadeIn?: boolean;
  }

  const { href = "", title = undefined, text = "", lazy = true, fadeIn = true }: Props = $props();

  let img: HTMLImageElement;
  let loaded = $state(false);
  let intersecting = $state(false);
  let error = $state(false);

  // Keep the component build-safe when the generated dimensions file is absent.
  const imageDimensionsModules = import.meta.glob<{ default: ImageDimensionsMap }>("./image-dimensions.json", { eager: true });
  const dimensionsMap: ImageDimensionsMap = Object.values(imageDimensionsModules)[0]?.default ?? {};
  const dimensions = $derived(!href ? undefined : dimensionsMap[href] || dimensionsMap[`https://cdn.nlark.com/${href.replace(/^\/nlark\//, "")}`]);
  const visible = $derived(!lazy || intersecting);

  onMount(() => {
    if (!lazy) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      intersecting = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          intersecting = true;
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      },
    );

    if (img) {
      observer.observe(img);
    }

    return () => {
      observer.disconnect();
    };
  });

  $effect(() => {
    if (!visible || !img?.currentSrc || !img.complete) {
      return;
    }

    error = img.naturalWidth === 0;
    loaded = true;
  });

  const handleLoad = () => {
    if (!error) {
      loaded = true;
    }
  };

  const handleError = () => {
    error = true;
    loaded = true;
  };
</script>

<img
  bind:this={img}
  src={visible ? href : undefined}
  {title}
  alt={text}
  loading={lazy ? "lazy" : "eager"}
  class:fade-in={fadeIn && loaded && !error}
  class:visible={!fadeIn && loaded && !error}
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
    opacity: 0;
  }

  img.fade-in {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }

  img.visible {
    opacity: 1;
    transition: none;
  }

  img.error {
    opacity: 0.5;
    filter: grayscale(100%);
  }
</style>
