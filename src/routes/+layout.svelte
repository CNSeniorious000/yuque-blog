<script>
  import "uno.css";
  import "@unocss/reset/antfu.css";
  import Progress from "./Progress.svelte";
  import { isDark } from "$lib/store";
  import { startBar, finishBar } from "../lib/progressFunction";
  import { beforeNavigate, afterNavigate } from "$app/navigation";

  beforeNavigate(startBar);
  afterNavigate(finishBar);
</script>

<div class:dark={$isDark} class="min-h-[100vh]">
  <div class="flex-grow justify-center bg-white dark:bg-coolgray-900 text-cool-gray-500 transition-all">
    <slot />
  </div>
  <Progress />
</div>
