<script module>
  interface Props {
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  const { children }: Props = $props();
</script>

<main class="flex flex-grow justify-center overflow-hidden text-zinc-700 dark:text-zinc-200">
  <div class="max-w-full w-full transition-all 2xl:max-w-6xl lg:max-w-80%">
    <div class="relative rounded-xl shadow-zinc-100 transition-all md:m-10 dark:shadow-none md:shadow-md md:dark:bg-zinc-800 md:dark:bg-opacity-10">
      {@render children?.()}
    </div>
  </div>
</main>
