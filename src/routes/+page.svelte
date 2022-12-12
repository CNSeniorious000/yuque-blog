<script>
  let dark = false;
  const toggleDarkMode = () => (dark = !dark);
</script>

<div class:dark>
  <div class="flex h-100vh flex-row justify-center dark:bg-coolgray-900 transition-all">
    <div class="flex flex-col justify-center text-center gap-1 text-lightblue-700 dark:text-lightblue-300 transition-all">
      <button class="i-carbon-sun dark:i-carbon-moon self-center text-2xl" on:click={toggleDarkMode} />
      <h1>Click the icon above to toggle dark mode.</h1>
      <p class="text-cool-gray-300 dark:text-cool-gray-700 transition-all">
        We use <a class="text-cool-gray-500" href="https://antfu.me/posts/icons-in-pure-css">Pure CSS</a> to achieve this.
      </p>
    </div>
  </div>
</div>
