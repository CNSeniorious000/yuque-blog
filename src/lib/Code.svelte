<script lang="ts">
  import { onMount } from "svelte";

  export let lang: string;
  export let text: string;

  let html: string;

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
