<script lang="ts">
  import type { LayoutServerData } from "./$types";

  import "@unocss/reset/tailwind.css";
  import "uno.css";

  import { finishBar, startBar } from "../lib/progressFunction";
  import Progress from "./Progress.svelte";
  import { browser } from "$app/environment";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { pageDescription, pageTitle } from "$lib/store";
  import { mode, ModeWatcher, setMode } from "mode-watcher";

  export let data: LayoutServerData;

  beforeNavigate(startBar);
  afterNavigate(finishBar);

  $: browser && data.mode && setMode(data.mode);
  $: browser && (document.cookie = `mode=${$mode};path=/`);
</script>

<div class:dark={$mode ? $mode === "dark" : data.mode === "dark"} class="min-h-[100dvh] min-h-[100vh] flex">
  <div class="w-full flex-grow justify-center bg-white text-cool-gray-500 transition-all duration-300 dark:bg-coolgray-900" class:duration-800={$mode === "light"}>
    <slot />
  </div>
  <Progress />
</div>

<ModeWatcher darkClassNames={[]} />

<svelte:head>
  <title>{$pageTitle}</title>
  {#if $pageDescription}
    <meta name="description" content={$pageDescription} />
  {/if}
</svelte:head>
