<script>
  import moon from "@iconify-icons/line-md/moon-loop";
  import moonToSunny from "@iconify-icons/line-md/moon-to-sunny-outline-transition";
  import sunny from "@iconify-icons/line-md/sunny-outline";
  import sunnyToMoon from "@iconify-icons/line-md/sunny-outline-to-moon-loop-transition";
  import Icon from "@iconify/svelte";
  import { mode, setMode, systemPrefersMode, toggleMode } from "mode-watcher";

  let firstTime = $state(true);

  function toggle() {
    if (systemPrefersMode.current !== mode.current) {
      setMode("system");
    } else {
      toggleMode();
    }
  }
</script>

<button class="mb-2.5 w-3.1em self-center rounded-full bg-zinc-100 p-0.3em text-xl transition ease-out active:scale-90 dark:bg-zinc-800 hover:bg-zinc-200 hover:dark:bg-zinc-700 dark:!bg-opacity-40" onclick={() => [(toggle()), (firstTime = false)]}>
  <!-- container -> w - p = translate-x + w <- child -->
  <div class="h-1.5em w-1.5em flex items-center justify-center rounded-full bg-white shadow-lg transition dark:translate-x-1em dark:bg-opacity-10 dark:shadow-none">
    {#if mode.current === "dark"}
      <Icon icon={firstTime ? moon : sunnyToMoon} />
    {:else}
      <Icon icon={firstTime ? sunny : moonToSunny} />
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
