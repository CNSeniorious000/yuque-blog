<script context="module" lang="ts">
  import { writable } from "svelte/store";

  export const breadcrumb = writable<[string, string][]>([]); // [href, title]
</script>

{#each $breadcrumb as [href, title], index (href)}
  <slot {href} {title} {index} total={$breadcrumb.length} />
{/each}
