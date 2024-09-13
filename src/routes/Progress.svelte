<script lang="ts">
  import Icon from "@iconify/svelte";
  import { progressStore } from "$lib/store";
  import Typewriter from "$lib/Typewriter.svelte";

  let blur = false; // delay 1s after loading turing true
  let blurTimer: ReturnType<typeof setTimeout> | undefined;

  $: loading = $progressStore.loading;
  $: progress = $progressStore.progress;
  $: blurRadius = blur ? "7.5pt" : 0;

  $: if (loading && !blurTimer) {
    // when loading state changes and loading doesn't finish in 1s (no duplicate trigger)
    blurTimer = setTimeout(() => {
      if (loading) {
        blur = true;
      } // then turn on the blur overlay
      blurTimer = undefined;
    }, 100);
  }

  $: if (!loading) {
    blur = false;
    clearTimeout(blurTimer);
    blurTimer = undefined;
  } // turn off the blur overlay when finish loading
</script>

<div style:--r={blurRadius} class="fixed grid h-full w-full place-items-center overflow-hidden bg-white backdrop-blur-$r transition-all duration-800 dark:bg-coolgray-900 !bg-opacity-0" class:!bg-opacity-100={blur} class:backdrop-saturate-150={!blur} class:pointer-events-none={!blur}>
  <div class="flex flex-col items-center gap-3 text-cool-gray-500 transition-all duration-800 lg:gap-4 dark:text-light-blue-400" class:opacity-0={!blur}>
    {#if blur}
      <Icon icon="svg-spinners:pulse-multiple" width="4vh" />
      <div class="flex flex-row gap-2 font-semibold uppercase md:gap-4 lg:text-lg">
        <Typewriter word="navigating" interval={20} />
      </div>
    {/if}
  </div>
</div>
<div style:--len="{progress * 100}%" class="fixed top-0 h-1 w-$len translate-y--1 bg-light-blue-500 transition-all duration-500 dark:bg-light-blue-400" class:translate-y-0={progress !== 0} class:transition-none={progress === 0} class:opacity-0={progress === 0 || progress > 1} />
