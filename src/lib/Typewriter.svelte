<script module>
  interface Props {
    word?: string;
    config?: any;
    interval?: number;
  }
</script>

<script lang="ts">
  import { fade, fly } from "svelte/transition";

  const { word = "", config = { y: 10, duration: 500 }, interval = 50 }: Props = $props();
</script>

{#each word as letter, index}
  <span in:fly|global={{ ...config, opacity: 0, delay: interval * index }} out:fade|global={config}>{letter}</span>
{/each}
