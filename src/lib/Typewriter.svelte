<script>
  import { fly, fade } from "svelte/transition";
  export let word = "";
  export let config = { y: 10, duration: 500 };
  export let interval = 50;
</script>

{#each word as letter, index}
  <span in:fly={{ ...config, opacity: 0, delay: interval * index }} out:fade={config}>{letter}</span>
{/each}
