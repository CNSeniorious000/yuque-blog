<script>
  import { isDark } from "$lib/store";
  import Icon from "@iconify/svelte";

  let firstTime = true;
</script>

<div class="flex h-full flex-row justify-center transition-all">
  <div class="flex flex-col justify-center text-center gap-1 text-light-blue-700 dark:text-light-blue-300 transition-all">
    <button class="self-center text-xl w-3.1em rounded-full p-0.3em mb-2.5 transition-all ease-out bg-cool-gray-100 hover:bg-cool-gray-200 dark:bg-cool-gray-800 dark:!bg-opacity-40 hover:dark:bg-cool-gray-700 active:scale-90" on:click={() => (($isDark = !$isDark), (firstTime = false))}>
      <!-- container -> w - p = translate-x + w <- child -->
      <div class="dark:translate-x-1em w-1.5em h-1.5em rounded-full flex items-center justify-center transition-all bg-white shadow-lg dark:shadow-none dark:bg-opacity-10">
        {#if $isDark} <Icon icon={firstTime ? "line-md:moon-loop" : "line-md:sunny-outline-to-moon-loop-transition"} /> {:else} <Icon icon={firstTime ? "line-md:sunny-outline" : "line-md:moon-to-sunny-outline-transition"} /> {/if}
      </div>
    </button>
    <h1>Hi! I'm <strong>Muspi Merol</strong></h1>
    <h2 class="text-cool-gray-400"><a href="https://github.com/CNSeniorious000">@CNSeniorious000</a></h2>

    <h3 class="flex flex-row gap-4 mt-2.5">
      <a class="flex flex-row items-center gap-1 rounded text-cool-gray-500 text-sm border border-dashed hover:border-solid border-cool-gray-300 dark:border-cool-gray-600 transition-colors px-2 py-1" href="/blog">
        <Icon icon="ph:star-duotone" />
        Blog
      </a>
      <a class="flex flex-row items-center gap-1 rounded text-cool-gray-500 text-sm border border-dashed hover:border-solid border-cool-gray-300 dark:border-cool-gray-600 transition-colors px-2 py-1" href="https://github.com/CNSeniorious000">
        <Icon icon="mdi:github-face" />
        GitHub
      </a>
      <a class="flex flex-row items-center gap-1 rounded text-cool-gray-500 text-sm border border-dashed hover:border-solid border-cool-gray-300 dark:border-cool-gray-600 transition-colors px-2 py-1" href="https://free-chat.asia/">
        <Icon icon="fluent:chat-sparkle-16-filled" />
        Free Chat
      </a>
      <a class="flex flex-row items-center gap-1 rounded text-cool-gray-500 text-sm border border-dashed hover:border-solid border-cool-gray-300 dark:border-cool-gray-600 transition-colors px-2 py-1" href="mailto:kilo.meter@foxmail.com">
        <Icon icon="tabler:brand-mailgun" />
        Email
      </a>
    </h3>
  </div>
</div>

<svelte:head>
  <title>Muspi Merol</title>
</svelte:head>

<style>
  button,
  button > div {
    transition-timing-function: cubic-bezier(0, 0, 0, 1);
    transition-duration: 0.3s;
  }
</style>
