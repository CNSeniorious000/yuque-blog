<script>
  import { progressStore } from "$lib/store";

  let blur = false; // delay 1s after loading turing ture
  let blurTimer = null;

  $: loading = $progressStore.loading;
  $: progress = $progressStore.progress;
  $: blurRadius = blur ? "10pt" : 0;

  $: if (loading && !blurTimer) {
    // when loading state changes and loading doesn't finish in 1s (no duplicate trigger)
    blurTimer = setTimeout(() => {
      if (loading) blur = true; // then turn on the blur overlay
      blurTimer = null;
    }, 1000);
  }

  $: if (!loading) {
    blur = false;
    clearTimeout(blurTimer);
    blurTimer = null;
  } // turn off the blur overlay when finish loading
</script>

<div style:--r={blurRadius} class="backdrop-blur-$r fixed w-full h-full pointer-events-none overflow-hidden transition-all duration-1000 bg-white dark:bg-coolgray-900 !bg-opacity-0" class:!bg-opacity-20={blur} class:backdrop-saturate-150={blur} />
<div style:--len="{progress * 100}%" class="w-$len fixed top-0 h-1 bg-light-blue-500 duration-500 transition-all" class:transition-none={progress == 0} class:opacity-0={progress > 1} />
