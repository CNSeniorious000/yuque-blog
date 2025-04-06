<script module>
  interface Props {
    markdown: string;
    omitLeftMargin?: boolean;
  }
</script>

<script lang="ts">
  import Link from "../Link.svelte";
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import { language } from "$lib/Chinese.svelte";

  const { markdown, omitLeftMargin = false }: Props = $props();
</script>

<article class={["contents", language.isChinese && "[&_:where(strong,a)]:m-inline-0.1em", omitLeftMargin && "[&_:where(strong,a)]:!ml-0"]}>
  <SvelteMarkdown source={markdown} isInline renderers={{ link: Link }} />
</article>

<style>
  article :global(:where(strong, a)) {
    --uno: text-teal-7 font-normal transition-colors dark:text-zinc-50;
  }

  article :global(a) {
    --uno: underline underline-(0.5 teal-7/40 offset-3 dashed) dark:underline-zinc-1/60 hover:underline-solid;
  }
</style>
