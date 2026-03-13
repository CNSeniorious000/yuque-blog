<script lang="ts">
  import type { CodeSnippetProps } from "@humanspeak/svelte-markdown";

  import { onMount } from "svelte";

  const { lang, text }: CodeSnippetProps = $props();

  let html = $state<string>();

  onMount(async () => {
    const shikiPromise = import("shiki");
    import("./shiki-dark.css");
    const { codeToHtml } = await shikiPromise;

    html = await codeToHtml(text, {
      lang,
      themes: {
        light: "one-light",
        dark: "vesper",
      },
      defaultColor: false,
    });
  });
</script>

{#if html}
  {@html html}
{:else}
  <pre><code>{text}</code></pre>
{/if}
