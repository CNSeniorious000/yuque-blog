<script module>
  interface Props {
    title?: string;
    description?: string;
  }
</script>

<script lang="ts">
  const { title = "", description = "" }: Props = $props();
</script>

<div class="flex flex-col gap-1">
  <h1 class="px-6 pt-6 text-3xl font-bold transition-padding sm:px-10 sm:pt-10">{title}</h1>
  {#if description}
    <h2 class="px-6 pb-6 text-sm transition-padding sm:px-10 sm:pb-10">{description}</h2>
  {:else}
    <br class="select-none" />
  {/if}
</div>
