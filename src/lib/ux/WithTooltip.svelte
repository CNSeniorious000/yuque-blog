<script module>
  interface Props {
    disableHoverableContent?: boolean;
    tips: string;
    children?: import("svelte").Snippet<[{ props: Record<string, any>; open: () => true; close: () => false }]>;
  }
</script>

<script lang="ts">
  import InlineMarkdown from "$lib/ui/InlineMarkdown.svelte";
  import { Tooltip } from "bits-ui";
  import { fly } from "svelte/transition";

  const { disableHoverableContent = true, tips, children }: Props = $props();
  let open = $state(false);
</script>

<Tooltip.Provider delayDuration={0} {disableHoverableContent}>
  <Tooltip.Root bind:open>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        {@render children?.({ props, open: () => open = true, close: () => open = false })}
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content sideOffset={4} collisionPadding={4}>
      <div transition:fly|global={{ y: 2, duration: 300 }} class="rounded bg-white px-0.5em py-0.3em text-xs text-zinc-7 shadow shadow-zinc-7/10 dark:(bg-zinc-7/40 text-zinc-3 backdrop-blur)">
        <InlineMarkdown markdown={tips} />
      </div>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
