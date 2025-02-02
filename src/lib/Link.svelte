<script module>
  interface Props {
    href?: string;
    title: any;
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  import WithTooltip from "./ux/WithTooltip.svelte";

  const { href = "", title, children }: Props = $props();

  const children_render = $derived(children);
</script>

{#if title}
  <WithTooltip tips={title}>
    {#snippet children({ builder })}
      <a {href} {...builder} use:builder.action>{@render children_render?.()}</a>
    {/snippet}
  </WithTooltip>
{:else}
  <a {href}>{@render children?.()}</a>
{/if}
