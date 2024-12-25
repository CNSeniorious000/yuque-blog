<script lang="ts">
  import type { LayoutServerData } from "./$types";

  import ArticleItem from "./ArticleItem.svelte";
  import Seo from "sk-seo";

  export let data: LayoutServerData;
  const { articles, total } = data.list!;
</script>

<div class="p-4 transition md:p-2 sm:p-8">
  {#each articles as { slug, title, word_count, content_updated_at: lastUpdate }}
    <ArticleItem {slug} {title} {word_count} {lastUpdate} />
  {/each}
</div>

<Seo title="Muspi Merol's Blog" description="共 {total} 篇文章" />
