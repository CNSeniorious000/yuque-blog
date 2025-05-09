<script module>
  export const afterAnimationEnd: (() => any)[] = [];
</script>

<script lang="ts">
  import pulse from "@iconify-icons/svg-spinners/pulse-multiple";
  import Icon from "@iconify/svelte";
  import { progressStore } from "$lib/store";
  import Typewriter from "$lib/Typewriter.svelte";
  import { untrack } from "svelte";

  let blur = $state(false); // delay 1s after loading turing true
  let blurTimer = $state<ReturnType<typeof setTimeout>>();

  const loading = $derived($progressStore.loading);
  const progress = $derived($progressStore.progress);
  const blurRadius = $derived(blur ? "7.5pt" : 0);

  $effect(() => {
    if (loading && !blurTimer) {
      // when loading state changes and loading doesn't finish in 1s (no duplicate trigger)
      blurTimer = setTimeout(() => {
        if (loading) {
          blur = true;
        } // then turn on the blur overlay
        blurTimer = undefined;
      }, 100);
    }
  });
  $effect(() => {
    if (!loading && untrack(() => !blur)) {
      // no animation triggered
      handleTransitionEnd();
    }
  });
  $effect(() => {
    if (!loading) {
      blur = false;
      clearTimeout(blurTimer);
      blurTimer = undefined;
    }
  }); // turn off the blur overlay when finish loading

  function handleTransitionEnd() {
    const tasks = [...afterAnimationEnd];
    afterAnimationEnd.length = 0;
    tasks.forEach(task => task());
  }
</script>

<div style:--r={blurRadius} ontransitionend={({ propertyName: p }) => p === "backdrop-filter" && handleTransitionEnd()} class="fixed inset-0 grid place-items-center overflow-hidden bg-white backdrop-blur-$r transition duration-800 dark:bg-zinc-900 !bg-opacity-0" class:!bg-opacity-100={blur} class:backdrop-saturate-150={!blur} class:pointer-events-none={!blur}>
  <div class="flex flex-col items-center gap-3 text-zinc-500 transition duration-800 lg:gap-4 dark:text-zinc-400" class:opacity-0={!blur}>
    {#if blur}
      <Icon icon={pulse} width="4vh" />
      <div class="flex flex-row gap-2 font-semibold uppercase md:gap-4 lg:text-lg">
        <Typewriter word="navigating" interval={20} />
      </div>
    {/if}
  </div>
</div>
<div style:--len="{progress * 100}%" class="transition-property fixed top-0 h-1 w-$len translate-y--1 bg-teal-500 duration-500 dark:bg-teal-400" class:translate-y-0={progress !== 0} class:transition-none={progress === 0} class:opacity-0={progress === 0 || progress > 1}></div>
