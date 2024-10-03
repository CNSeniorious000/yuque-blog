<script>
  import WithTooltip from "./ux/WithTooltip.svelte";

  export let href = "";
  export let title;
</script>

{#if title}
  <WithTooltip tips={title} let:builder>
    <a {href} {...builder} use:builder.action><slot /></a>
  </WithTooltip>
{:else}
  <a {href}><slot /></a>
{/if}
