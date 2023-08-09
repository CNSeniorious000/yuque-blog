<script>
  import { progressStore } from "$lib/store";
  import Icon from "@iconify/svelte";
  import Typewriter from "$lib/Typewriter.svelte";

  let blur = false; // delay 1s after loading turing ture
  let blurTimer = null;

  $: loading = $progressStore.loading;
  $: progress = $progressStore.progress;
  $: blurRadius = blur ? "7.5pt" : 0;

  $: if (loading && !blurTimer) {
    // when loading state changes and loading doesn't finish in 1s (no duplicate trigger)
    blurTimer = setTimeout(() => {
      if (loading) blur = true; // then turn on the blur overlay
      blurTimer = null;
    }, 100);
  }

  $: if (!loading) {
    blur = false;
    clearTimeout(blurTimer);
    blurTimer = null;
  } // turn off the blur overlay when finish loading
</script>

<div style:--r={blurRadius} class="backdrop-blur-$r fixed grid place-items-center w-full h-full overflow-hidden transition-all duration-800 bg-white dark:bg-coolgray-900 !bg-opacity-0" class:!bg-opacity-100={blur} class:backdrop-saturate-150={!blur} class:pointer-events-none={!blur}>
  <div class="text-cool-gray-500 dark:text-light-blue-400 flex flex-col items-center gap-3 lg:gap-4 transition-all duration-800" class:opacity-0={!blur}>
    {#if blur}
      <Icon icon="svg-spinners:pulse-multiple" width="4vh" />
      <div class="flex flex-row gap-2 md:gap-4 uppercase font-semibold lg:text-lg">
        <Typewriter word="navigating" interval={20} />
      </div>
    {/if}
  </div>
</div>
<div style:--len="{progress * 100}%" class="w-$len fixed top-0 h-1 bg-light-blue-500 dark:bg-light-blue-400 duration-500 transition-all translate-y--1" class:translate-y-0={progress != 0} class:transition-none={progress == 0} class:opacity-0={progress == 0 || progress > 1} />
