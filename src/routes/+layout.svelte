<script module>
  import type { LayoutServerData } from "./$types";

  interface Props {
    data: LayoutServerData;
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import "uno.css";
  import "$lib/global.css";
  import "@fontsource-variable/fira-code";

  import { finishBar, startBar } from "../lib/progressFunction";
  import Progress from "./Progress.svelte";
  import { browser } from "$app/environment";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { language } from "$lib/Chinese.svelte";
  import { mode, ModeWatcher, setMode } from "mode-watcher";

  const { data, children }: Props = $props();

  language.init(data.language);

  beforeNavigate(({ willUnload }) => {
    !willUnload && startBar();
  });
  afterNavigate(finishBar);

  browser && data.mode && setMode(data.mode);
  $effect(() => {
    browser && (document.cookie = `mode=${mode.current};path=/`);
  });
</script>

<div class:dark={mode.current ? mode.current === "dark" : data.mode === "dark"} class="contents" id="root">
  <div class="min-h-screen w-full flex flex-col items-stretch justify-center bg-white text-zinc-4 transition duration-300 !min-h-[100dvh] dark:bg-zinc-900" class:duration-800={mode.current === "light"}>
    {@render children?.()}
  </div>
  <Progress />
</div>

<ModeWatcher darkClassNames={[]} />

<svelte:head>
  <link rel="alternate" type="application/atom+xml" title="Atom Feed" href="/feed" />
</svelte:head>
