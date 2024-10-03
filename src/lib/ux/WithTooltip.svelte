<script lang="ts">
  import InlineMarkdown from "$lib/ui/InlineMarkdown.svelte";
  import { Tooltip } from "bits-ui";
  import { fly } from "svelte/transition";

  export let disableHoverableContent = true;
  export let tips: string;
</script>

<Tooltip.Root openDelay={0} closeDelay={0} {disableHoverableContent} portal="#root">
  <Tooltip.Trigger asChild let:builder>
    <slot {builder} />
  </Tooltip.Trigger>
  <Tooltip.Content sideOffset={4} collisionPadding={4} asChild let:builder>
    <div transition:fly={{ y: 2, duration: 300 }} class="rounded bg-white px-0.5em py-0.3em text-xs text-zinc-7 shadow shadow-zinc-7/10 dark:(bg-zinc-7/40 text-zinc-3 backdrop-blur)" {...builder} use:builder.action>
      <InlineMarkdown markdown={tips} />
    </div>
  </Tooltip.Content>
</Tooltip.Root>
