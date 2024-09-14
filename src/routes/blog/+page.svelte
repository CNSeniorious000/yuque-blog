<script lang="ts">
  import type { PageServerData } from "./$types";

  import ArticleItem from "./ArticleItem.svelte";
  import { editUrl, leftBottom, pageDescription, pageTitle } from "$lib/store";
  import { baseurl, namespace } from "$lib/utils";

  export let data: PageServerData;
  const { articles } = data;

  $pageTitle = "Muspi Merol's Blog";
  $pageDescription = $leftBottom = `共 ${articles.length} 篇文章`;
  $editUrl = `${baseurl}/${namespace}`;
</script>

<div class="p-4 transition-all md:p-2 sm:p-8">
  {#each articles as { slug, title, word_count, content_updated_at: lastUpdate }}
    <ArticleItem {slug} {title} {word_count} {lastUpdate} />
  {/each}
</div>
