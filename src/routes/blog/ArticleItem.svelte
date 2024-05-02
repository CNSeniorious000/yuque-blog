<script>
  import { formatDate } from "$lib/utils";

  export let slug;
  export let title;
  export let word_count;
  export let lastUpdate;
</script>

<a class="flex items-center justify-between rounded-lg h-8 pl-2 bg-blue-gray-900 dark:bg-blue-gray-100 dark:bg-opacity-0 bg-opacity-0 hover:bg-opacity-3 active:scale-99 easeou transition-all duration-50" href="/blog/{slug}">
  <div class="flex flex-row items-center overflow-overlay gap-2">
    <p class="whitespace-nowrap overflow-hidden">{title}</p>
    <p class="text-blue-gray-900 text-opacity-30 text-xs">{word_count} 字</p>
  </div>
  <div class="date text-blue-gray-400 text-sm justify-center hidden sm:block transition-all duration-50 py-1 px-1.5 mr-0.5 rounded-lg bg-blue-gray-50 dark:bg-blue-gray-800">{formatDate(lastUpdate)}</div>
</a>

<style>
  a:hover > .date {
    background: rgb(13, 148, 136);
    color: white;
  }
</style>
