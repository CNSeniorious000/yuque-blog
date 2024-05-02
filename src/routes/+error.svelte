<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
</script>

<div class="grid h-screen w-full place-items-center">
  <main class="flex flex-row items-center">
    <a class="group flex flex-row items-center gap-1.5" href="/">
      <Icon icon="ic:twotone-arrow-back" class="op-30 group-not-hover:op-0" />
      <img class="w-8 aspect-1" src="/svelte-lark.svg" alt="logo" />
    </a>

    <hr class="mx-4 h-1.2em w-0 border-(1 current solid) rounded-full op-25" />

    <a class="group flex flex-row cursor-help items-center gap-1.5" href="https://developer.mozilla.org/docs/Web/HTTP/Status/{$page.status}">
      <h1 class="rounded bg-neutral-5/10 px-1 py-0.5 text-xs font-bold font-mono">{$page.status}</h1>
      <h2>{$page.error?.message}</h2>
      <Icon icon="ic:twotone-arrow-forward" class="op-30 group-not-hover:op-0" />
    </a>
  </main>
</div>
