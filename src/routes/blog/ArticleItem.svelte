<script>
  import { formatDate } from "$lib/utils";

  export let slug;
  export let title;
  export let word_count;
  export let lastUpdate;
  export let language;
</script>

<a class="easeou h-8 flex items-center justify-between gap-5 ws-nowrap rounded-lg bg-zinc-900 bg-opacity-0 pl-2 transition duration-50 active:scale-99 dark:bg-zinc-100 dark:bg-opacity-0 hover:bg-opacity-3" href="/blog/{slug}">
  <div class="flex flex-row items-center gap-2 overflow-overlay">
    <p class="overflow-hidden text-ellipsis">{title}</p>
    <p class="text-xs text-zinc-900/30 dark:text-zinc-200/30">{word_count} 字</p>
  </div>
  <div class="date hidden h-full items-center rounded-md px-2 text-sm text-zinc-400 transition duration-50 sm:flex dark:text-zinc-600">
    <div>{formatDate(lastUpdate, language)}</div>
  </div>
</a>

<style>
  a:hover > .date {
    background: rgb(13, 148, 136);
    color: white;
  }
</style>
