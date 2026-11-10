<script module>
  import type { LayoutParentData, LayoutServerData } from "./$types";

  interface Props {
    data: LayoutServerData & LayoutParentData;
  }
</script>

<script lang="ts">
  import ArticleItem from "./ArticleItem.svelte";
  import { getLanguage } from "#lib/language.svelte.js";
  import Seo from "#lib/Seo.svelte";
  import { countLabel } from "#lib/utils.js";

  const language = getLanguage();
  const { data }: Props = $props();
  const articles = $derived(data.list!);
</script>

<div class="p-4 transition md:p-2 sm:p-8">
  {#each articles as { slug, title, word_count, content_updated_at: lastUpdate } (slug)}
    <ArticleItem {slug} {title} {word_count} {lastUpdate} />
  {/each}
</div>

<Seo title="Muspi Merol's Blog" description={countLabel(articles.length, language.isChinese)} />
