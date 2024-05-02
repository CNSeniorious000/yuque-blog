<script>
  import Main from "../../lib/Main.svelte";
  import ArticleItem from "./ArticleItem.svelte";
  import { breadcrumbStore, leftBottom, rightBottom, rightTop } from "$lib/store";
  import { baseurl, namespace } from "$lib/utils";

  export let data;
  const { user, articles } = data;

  $breadcrumbStore = [
    ["/", user.login],
    ["/blog", data.slug],
  ];

  $rightTop = data.title;
  $leftBottom = `共 ${data.items_count} 篇文章`;
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
