<script module>
  interface Props {
    breadcrumb: [string, string][];
  }
</script>

<script lang="ts">
  import { afterAnimationEnd } from "../routes/Progress.svelte";
  import { progressStore } from "$lib/store";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  const { breadcrumb }: Props = $props();

  let ready = $state(false);
  let destroyed = false;

  const wait = () => {
    if (destroyed) {
      return;
    }
    if ($progressStore.loading) {
      afterAnimationEnd.push(wait);
    } else {
      ready = true;
    }
  };

  onMount(async () => {
    afterAnimationEnd.push(wait);
  });

  onDestroy(() => {
    destroyed = true;
  });
</script>

{#each breadcrumb as [href, title], index}
  <li class:z-1={ready} class="flex gap-1.5">
    <a in:fade={{ delay: 150, duration: 500 }} out:fade {href} class="ws-nowrap transition hover:text-teal-600 dark:hover:text-teal-400">
      {title}
    </a>
    {#if index !== breadcrumb.length - 1}
      <span in:fade={{ duration: 300 }} out:fade={{ delay: 150, duration: 500 }} class="opacity-40">/</span>
    {/if}
  </li>
{/each}
