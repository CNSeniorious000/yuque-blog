<script>
  import { formatDate } from "$lib/utils";

  export let slug;
  export let title;
  export let word_count;
  export let lastUpdate;
</script>

<a class="flex ws-nowrap items-center justify-between rounded-lg gap-5 h-8 pl-2 bg-blue-gray-900 dark:bg-blue-gray-100 dark:bg-opacity-0 bg-opacity-0 hover:bg-opacity-3 active:scale-99 easeou transition-all duration-50" href="/blog/{slug}">
  <div class="flex flex-row items-center overflow-overlay gap-2">
    <p class="overflow-hidden text-ellipsis">{title}</p>
    <p class="text-blue-gray-900/30 dark:text-blue-gray-200/30 text-xs">{word_count} 字</p>
  </div>
  <div class="date text-gray-400 dark:text-gray-600 text-sm hidden sm:flex transition-all duration-50 h-full px-2 rounded-md items-center">
    <div>{formatDate(lastUpdate)}</div>
  </div>
</a>

<style>
  a:hover > .date {
    background: rgb(13, 148, 136);
    color: white;
  }
</style>
