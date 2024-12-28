<script lang="ts">
  import Giscus from "@giscus/svelte";
  import { dev } from "$app/environment";
  import { mode } from "mode-watcher";

  export let id: number;
  export let strict = false;
  export let reactionsEnabled = true;
  export let emitMetadata = dev;
  export let inputPosition: "top" | "bottom" = "top";
  export let lang = "zh-CN";
</script>

<div class="m-6 transition-margin sm:m-10">
  <Giscus
    id="giscus"
    repo="CNSeniorious000/yuque-blog"
    repoId="R_kgDOImLjJQ"
    category="giscus"
    categoryId="DIC_kwDOImLjJc4Clj9D"
    term={String(id)}
    strict={strict ? "1" : "0"}
    reactionsEnabled={reactionsEnabled ? "1" : "0"}
    emitMetadata={emitMetadata ? "1" : "0"}
    inputPosition={inputPosition}
    theme="noborder_{$mode === "dark" ? "dark" : "light"}"
    lang={lang}
  />
</div>
