<script>
  import { getContext } from "svelte";
  import { baseurl, namespace } from "./common";

  export let slug;
  export let title;
  export let format;
  export let lastUpdate;
</script>

<a class="flex items-center justify-between rounded-lg h-8 pl-2 bg-blue-gray-900 bg-opacity-0 hover:bg-opacity-3 active:scale-99 easeou transition-all duration-50" href="#">
  <div class="flex flex-row items-center overflow-overlay gap-2">
    <p>{title}</p>
    <p class="text-gray-900 text-opacity-20">{new Date(lastUpdate).getDate()}</p>
  </div>
  <div class="flex flex-row gap-1 items-center">
    <div class="bg-gray-900 bg-opacity-3 px-1 py-0.5 rounded grid place-items-center">
      <p class="text-gray-900 text-opacity-30 text-xs">{format}</p>
    </div>
    <a class="rounded-lg opacity-0 text-gray-900 text-opacity-80 bg-gray-900 bg-opacity-0 hover:bg-opacity-7 transition-all h-7 w-7 grid place-items-center" href="{baseurl}/{namespace}/{slug}"> <i class="i-carbon-edit" /> </a>
  </div>
</a>

<style>
  a:hover a {
    opacity: 1;
  }
</style>
