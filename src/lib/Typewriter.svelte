<script>
  import { fade, fly } from "svelte/transition";

  export let word = "";
  export let config = { y: 10, duration: 500 };
  export let interval = 50;
</script>

{#each word as letter, index}
  <span in:fly|global={{ ...config, opacity: 0, delay: interval * index }} out:fade|global={config}>{letter}</span>
{/each}
