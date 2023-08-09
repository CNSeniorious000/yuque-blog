<script>
  import { isDark } from "$lib/store";
  import Icon from "@iconify/svelte";

  let firstTime = true;
</script>

<div class="flex h-full flex-row justify-center transition-all">
  <div class="flex flex-col justify-center text-center gap-1 text-light-blue-700 dark:text-light-blue-300 transition-all">
    <button class="self-center text-xl w-3.1em rounded-full p-0.3em transition-all ease-out bg-cool-gray-100 hover:bg-cool-gray-200 dark:bg-cool-gray-800 dark:!bg-opacity-40 hover:dark:bg-cool-gray-700 active:scale-90" on:click={() => (($isDark = !$isDark), (firstTime = false))}>
      <!-- container -> w - p = translate-x + w <- child -->
      <div class="dark:translate-x-1em w-1.5em h-1.5em rounded-full flex items-center justify-center transition-all bg-white shadow-lg dark:shadow-none dark:bg-opacity-10">
        {#if $isDark} <Icon icon={firstTime ? "line-md:moon-loop" : "line-md:sunny-outline-to-moon-loop-transition"} /> {:else} <Icon icon={firstTime ? "line-md:sunny-outline" : "line-md:moon-to-sunny-outline-transition"} /> {/if}
      </div>
    </button>
    <h1>Click the icon above to toggle dark mode.</h1>
    <p class="text-cool-gray-500 transition-all">
      We use <a class="text-cool-gray-900 dark:text-cool-gray-300 transition-all duration-300" href="https://antfu.me/posts/icons-in-pure-css">Pure CSS</a> to achieve this.
    </p>
    <p>
      click here to go to <a href="/blog" class="inline font-bold">my blog</a>
    </p>
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
