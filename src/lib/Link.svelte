<script lang="ts">
  import type { LinkSnippetProps } from "@humanspeak/svelte-markdown";

  import WithTooltip from "./ux/WithTooltip.svelte";

  const { href = "", title, children }: LinkSnippetProps = $props();

  const children_render = $derived(children);
</script>

{#if title}
  <WithTooltip tips={title}>
    {#snippet children({ props })}
      <a {href} {...props}>{@render children_render?.()}</a>
    {/snippet}
  </WithTooltip>
{:else}
  <a {href}>{@render children?.()}</a>
{/if}
