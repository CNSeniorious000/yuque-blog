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
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { language } from "$lib/Chinese.svelte";
  import { mode, ModeWatcher, setMode, systemPrefersMode, userPrefersMode } from "mode-watcher";
  import { untrack } from "svelte";

  const { data, children }: Props = $props();

  // svelte-ignore state_referenced_locally
  language.init(data.language);

  beforeNavigate(({ willUnload }) => {
    !willUnload && startBar();
  });
  afterNavigate(finishBar);

  $effect(() => {
    if (systemPrefersMode.current === untrack(() => mode.current) && userPrefersMode.current !== "system") {
      setMode("system");
    }
  });
</script>

<div class="min-h-screen w-full flex flex-col items-stretch justify-center bg-white text-zinc-4 transition-background-color !min-h-[100dvh] dark:bg-zinc-900">
  {@render children?.()}
</div>
<Progress />

<ModeWatcher disableTransitions={false} />

<svelte:head>
  <link rel="alternate" type="application/atom+xml" title="Atom Feed" href="/feed" />
  <link rel="alternate" type="text/markdown" title="LLM-friendly version of this page" href={page.route.id === "/blog/[slug]" ? `/blog/${page.params.slug}/llms.txt` : "/llms.txt"} />
</svelte:head>
