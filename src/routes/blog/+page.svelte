<script module>
  import type { LayoutParentData, LayoutServerData } from "./$types";

  import { language } from "$lib/Chinese.svelte";

  interface Props {
    data: LayoutServerData & LayoutParentData;
  }
</script>

<script lang="ts">
  import ArticleItem from "./ArticleItem.svelte";
  import Seo from "sk-seo";

  const { data }: Props = $props();
  // svelte-ignore state_referenced_locally
  const articles = data.list!;
</script>

<div class="p-4 transition md:p-2 sm:p-8">
  {#each articles as { slug, title, word_count, content_updated_at: lastUpdate }}
    <ArticleItem {slug} {title} {word_count} {lastUpdate} />
  {/each}
</div>

<Seo title="Muspi Merol's Blog" description={language.isChinese ? `共 ${articles.length} 篇文章` : `${articles.length} articles`} />
