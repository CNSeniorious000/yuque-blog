<script>
  import ArticleItem from "./ArticleItem.svelte";
  import { baseurl, namespace } from "$lib/common";

  export let data;
  let { user, articles } = data;
</script>

<header>
  <div class="text-sm text-blue-gray-400 m-10 flex-row justify-between">
    <p class="flex gap-1.5">
      <a class="hover:text-teal-600 transition-all" href="{baseurl}/{user.login}">{user.login}</a>
      <span class="opacity-50">/</span>
      <a class="hover:text-teal-600 transition-all" href="{baseurl}/{namespace}">{data.slug}</a>
    </p>
    <p>{data.description}</p>
  </div>
</header>

<main class="flex flex-grow justify-center h-full text-blue-gray-700">
  <div class="transition-all mx-10 w-full max-w-full lg:max-w-60% xl:max-w-3xl">
    <div class="rounded-xl p-2 shadow-md shadow-gray-100">
      {#each articles as { slug, title, format, content_updated_at: lastUpdate }}
        <ArticleItem {slug} {title} {format} {lastUpdate} />
      {/each}
    </div>
  </div>
</main>

<footer>
  <div class="text-sm text-blue-gray-500 m-10 flex-row justify-between">
    <p>共{data.items_count}篇文章</p>
    <p class="opacity-50">Last Modified: {data.updated_at}</p>
    <p class="hidden sm:display-[unset]">Rate Limit: Not Available</p>
  </div>
</footer>

<svelte:head>
  <title>Muspi Merol's Blog</title>
</svelte:head>
