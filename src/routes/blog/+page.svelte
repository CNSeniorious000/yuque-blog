<script lang="ts">
  import type { PageServerData } from "./$types";

  import Main from "../../lib/Main.svelte";
  import ArticleItem from "./ArticleItem.svelte";
  import { breadcrumb, leftBottom, rightBottom } from "$lib/store";
  import { baseurl, login, namespace, repo } from "$lib/utils";

  export let data: PageServerData;
  const { articles } = data;

  $breadcrumb = [
    ["/", login],
    ["/blog", repo],
  ];

  $leftBottom = `共 ${articles.length} 篇文章`;
  $rightBottom = `${baseurl}/${namespace}`;
</script>

<Main>
  <div class="p-4 transition-all md:p-2 sm:p-8">
    {#each articles as { slug, title, word_count, content_updated_at: lastUpdate }}
      <ArticleItem {slug} {title} {word_count} {lastUpdate} />
    {/each}
  </div>
</Main>

<svelte:head>
  <title>Muspi Merol's Blog</title>
</svelte:head>
