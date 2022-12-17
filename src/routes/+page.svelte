<script>
  import { isDark } from "$lib/store";
</script>

<div class="flex h-full flex-row justify-center transition-all">
  <div class="flex flex-col justify-center text-center gap-1 text-lightblue-700 dark:text-lightblue-300 transition-all">
    <button class="i-carbon-sun dark:i-carbon-moon self-center text-2xl" on:click={() => ($isDark = !$isDark)} />
    <h1>Click the icon above to toggle dark mode.</h1>
    <p class="text-cool-gray-300 dark:text-cool-gray-700 transition-all">
      We use <a class="text-cool-gray-500" href="https://antfu.me/posts/icons-in-pure-css">Pure CSS</a> to achieve this.
    </p>
    <p>
      click here to go to <a href="/blog" class="inline font-bold">my blog</a>
    </p>
  </div>
</div>

<svelte:head>
  <title>Muspi Merol</title>
</svelte:head>
