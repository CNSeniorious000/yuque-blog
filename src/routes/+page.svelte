<script>
  import Icon from "@iconify/svelte";
  import { mode, toggleMode } from "mode-watcher";

  let firstTime = true;
</script>

<div class="h-full flex flex-row justify-center transition">
  <div class="flex flex-col justify-center gap-1 text-center text-light-blue-700 transition dark:text-light-blue-300">
    <button class="mb-2.5 w-3.1em self-center rounded-full bg-zinc-100 p-0.3em text-xl transition ease-out active:scale-90 dark:bg-zinc-800 hover:bg-zinc-200 hover:dark:bg-zinc-700 dark:!bg-opacity-40" on:click={() => [(toggleMode()), (firstTime = false)]}>
      <!-- container -> w - p = translate-x + w <- child -->
      <div class="h-1.5em w-1.5em flex items-center justify-center rounded-full bg-white shadow-lg transition dark:translate-x-1em dark:bg-opacity-10 dark:shadow-none">
        {#if $mode === "dark"} <Icon icon={firstTime ? "line-md:moon-loop" : "line-md:sunny-outline-to-moon-loop-transition"} /> {:else} <Icon icon={firstTime ? "line-md:sunny-outline" : "line-md:moon-to-sunny-outline-transition"} /> {/if}
      </div>
    </button>
    <h1>Hi! I'm <strong>Muspi Merol</strong></h1>
    <h2 class="text-zinc-400"><a href="https://github.com/CNSeniorious000">@CNSeniorious000</a></h2>

    <h3 class="mt-2.5 flex flex-row gap-4">
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="/blog">
        <Icon icon="ph:star-duotone" />
        Blog
      </a>
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="https://github.com/CNSeniorious000">
        <Icon icon="mdi:github-face" />
        GitHub
      </a>
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="https://free-chat.asia/">
        <Icon icon="fluent:chat-sparkle-16-filled" />
        Free Chat
      </a>
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="mailto:kilo.meter@foxmail.com">
        <Icon icon="tabler:brand-mailgun" />
        Email
      </a>
    </h3>
  </div>
</div>

<style>
  button,
  button > div {
    transition-timing-function: cubic-bezier(0, 0, 0, 1);
    transition-duration: 0.3s;
  }
</style>
