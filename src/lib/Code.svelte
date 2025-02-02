<script module>
  interface Props {
    lang: string;
    text: string;
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  const { lang, text }: Props = $props();

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
