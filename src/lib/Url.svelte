<script module>
  interface Props {
    href?: string;
    title: any;
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  import UrlHighlighter from "./UrlHighlighter.svelte";
  import WithTooltip from "./ux/WithTooltip.svelte";
  import { page } from "$app/state";

  const { href = "", title, children }: Props = $props();

  const isUrl = $derived(URL.canParse(href, page.url));
  const children_render = $derived(children);
</script>

<WithTooltip>
  {#snippet children({ props })}
    <a {href} {...props}>{@render children_render?.()}</a>
  {/snippet}
  {#snippet tips()}
    {#if isUrl}
      <UrlHighlighter url={new URL(href, page.url)} />
    {:else}
      {title || href}
    {/if}
  {/snippet}
</WithTooltip>
