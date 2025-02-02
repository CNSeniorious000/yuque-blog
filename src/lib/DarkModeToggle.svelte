<script>
  import Icon from "@iconify/svelte";
  import { mode, toggleMode } from "mode-watcher";

  let firstTime = $state(true);
</script>

<button class="mb-2.5 w-3.1em self-center rounded-full bg-zinc-100 p-0.3em text-xl transition ease-out active:scale-90 dark:bg-zinc-800 hover:bg-zinc-200 hover:dark:bg-zinc-700 dark:!bg-opacity-40" onclick={() => [(toggleMode()), (firstTime = false)]}>
  <!-- container -> w - p = translate-x + w <- child -->
  <div class="h-1.5em w-1.5em flex items-center justify-center rounded-full bg-white shadow-lg transition dark:translate-x-1em dark:bg-opacity-10 dark:shadow-none">
    {#if $mode === "dark"}
      <Icon icon={firstTime ? "line-md:moon-loop" : "line-md:sunny-outline-to-moon-loop-transition"} />
    {:else}
      <Icon icon={firstTime ? "line-md:sunny-outline" : "line-md:moon-to-sunny-outline-transition"} />
    {/if}
  </div>
</button>

<style>
    button,
    button > div {
      transition-timing-function: cubic-bezier(0, 0, 0, 1);
      transition-duration: 0.3s;
    }
  </style>
