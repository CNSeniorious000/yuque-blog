<script>
  import { breadcrumbStore, rightTop, leftBottom, rightBottom } from "$lib/store";
  import Main from "../../lib/Main.svelte";
  import ArticleItem from "./ArticleItem.svelte";

  export let data;
  let { user, articles } = data;

  $breadcrumbStore = [
    ["/", user.login],
    ["/blog", data.slug],
  ];

  $rightTop = data.title;
  $leftBottom = `共 ${data.items_count} 篇文章`;
  $rightBottom = data.updated_at;
</script>

<Main>
  <div class="transition-all m-4 sm:m-8 md:m-2">
    {#each articles as { slug, title, format, content_updated_at: lastUpdate }}
      <ArticleItem {slug} {title} {format} {lastUpdate} />
    {/each}
  </div>
</Main>

<svelte:head>
  <title>Muspi Merol's Blog</title>
</svelte:head>
