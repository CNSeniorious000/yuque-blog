<script>
  import "@unocss/reset/tailwind.css";
  import "uno.css";

  import { finishBar, startBar } from "../lib/progressFunction";
  import Progress from "./Progress.svelte";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { isDark } from "$lib/store";
  import { apiBaseurl } from "$lib/utils";

  beforeNavigate(startBar);
  afterNavigate(finishBar);
</script>

<div class:dark={$isDark} class="min-h-[100dvh] min-h-[100vh] flex">
  <div class="w-full flex-grow justify-center bg-white text-cool-gray-500 transition-all duration-300 dark:bg-coolgray-900" class:duration-800={!$isDark}>
    <slot />
  </div>
  <Progress />
</div>

<svelte:head>
  <link rel="dns-prefetch" href={apiBaseurl} />
</svelte:head>
