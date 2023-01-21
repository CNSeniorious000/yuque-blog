<script>
  import "uno.css";
  import "@unocss/reset/antfu.css";
  import Progress from "./Progress.svelte";
  import { isDark } from "$lib/store";
  import { apiBaseurl } from "../lib/common";
  import { startBar, finishBar } from "../lib/progressFunction";
  import { beforeNavigate, afterNavigate } from "$app/navigation";

  beforeNavigate(startBar);
  afterNavigate(finishBar);
</script>

<div class:dark={$isDark} class="min-h-[100vh] min-h-[100dvh]">
  <div class="flex-grow justify-center bg-white dark:bg-coolgray-900 text-cool-gray-500 transition-all duration-300" class:duration-800={!$isDark}>
    <slot />
  </div>
  <Progress />
</div>

<svelte:head>
  <link rel="dns-prefetch" href={apiBaseurl} />
</svelte:head>
