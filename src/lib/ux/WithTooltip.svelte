<script module>
  interface Props {
    tips: string;
    children?: import("svelte").Snippet<[{ props: Record<string, any> }]>;
  }
</script>

<script lang="ts">
  import InlineMarkdown from "$lib/ui/InlineMarkdown.svelte";
  import { Popover } from "bits-ui";
  import { fly } from "svelte/transition";

  const { tips, children }: Props = $props();
  let open = $state(false);

  function show() {
    open = true;
  }

  function hide() {
    open = false;
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props: { onclick: _1, onpointerdown: _2, ...props } })}
      {@render children?.({ props: { ...props, onfocus: show, onblur: hide, onmouseenter: show, onmouseleave: hide } })}
    {/snippet}
  </Popover.Trigger>
  <Popover.Content sideOffset={4} collisionPadding={4} trapFocus={false} side="top" onOpenAutoFocus={e => e.preventDefault()} onCloseAutoFocus={e => e.preventDefault()}>
    <div transition:fly|global={{ y: 2, duration: 300 }} class="rounded bg-white px-0.5em py-0.3em text-xs text-zinc-7 shadow shadow-zinc-7/10 backdrop-blur transition-colors dark:(bg-zinc-7/40 text-zinc-3)">
      <InlineMarkdown markdown={tips} />
    </div>
  </Popover.Content>
</Popover.Root>
