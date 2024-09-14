<script context="module" lang="ts">
  import { login } from "./utils";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";

  const breadcrumb = writable<[string, string][]>([["/", login]]); // [href, title]

  export const withBreadcrumb = (href: string, title: string) => {
    onMount(() => {
      breadcrumb.update(prev => [...prev, [href, title]]);
    });
    onDestroy(() => {
      breadcrumb.update(prev => prev.slice(0, -1));
    });
  };
</script>

{#each $breadcrumb as [href, title], index (href)}
  <slot {href} {title} {index} total={$breadcrumb.length} />
{/each}
