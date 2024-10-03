<script lang="ts">
  import Link from "../Link.svelte";
  import SvelteMarkdown from "svelte-markdown";

  export let markdown: string;
</script>

<article class="contents">
  <SvelteMarkdown source={markdown} isInline renderers={{ link: Link }} />
</article>

<style>
  article :global(:where(strong, a)) {
    margin-inline: 0.1em;
    --uno: text-teal-7 font-normal transition-colors dark:text-zinc-50;
  }

  article :global(a) {
    --uno: underline underline-(0.5 teal-7/40 offset-3 dashed) dark:underline-zinc-1/60 hover:underline-solid;
  }
</style>
