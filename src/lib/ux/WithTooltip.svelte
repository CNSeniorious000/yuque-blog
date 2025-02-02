<script module>
  interface Props {
    disableHoverableContent?: boolean;
    tips: string;
    children?: import("svelte").Snippet<[any]>;
  }
</script>

<script lang="ts">
  import InlineMarkdown from "$lib/ui/InlineMarkdown.svelte";
  import { Tooltip } from "bits-ui";
  import { fly } from "svelte/transition";

  const { disableHoverableContent = true, tips, children }: Props = $props();
  let open = $state<boolean>();

  const children_render = $derived(children);
</script>

<Tooltip.Root openDelay={0} closeDelay={0} {disableHoverableContent} portal="#root" bind:open>
  <Tooltip.Trigger asChild>
    {#snippet children({ builder })}
      {@render children_render?.({ builder, open: () => open = true, close: () => open = false })}
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content sideOffset={4} collisionPadding={4} asChild>
    {#snippet children({ builder })}
      <div transition:fly={{ y: 2, duration: 300 }} class="rounded bg-white px-0.5em py-0.3em text-xs text-zinc-7 shadow shadow-zinc-7/10 dark:(bg-zinc-7/40 text-zinc-3 backdrop-blur)" {...builder} use:builder.action>
        <InlineMarkdown markdown={tips} />
      </div>
    {/snippet}
  </Tooltip.Content>
</Tooltip.Root>
