<script lang="ts">
  import type { LayoutServerData } from "./$types";

  import { navigating, page } from "$app/stores";
  import Footer from "$lib/Footer.svelte";
  import Header from "$lib/Header.svelte";
  import Main from "$lib/Main.svelte";
  import { baseurl, formatDate, login, namespace, repo } from "$lib/utils";

  export let data: LayoutServerData;

  let breadcrumb: [string, string][];
  let editUrl: string;
  let leftBottom: string;
  let rightTop: string;

  $: if (!$navigating) {
    if ($page.route.id === "/blog/[slug]") {
      const { slug } = $page.params;
      breadcrumb = [["/", login], ["/blog", repo], [`/blog/${slug}`, slug]];
      editUrl = `${baseurl}/${namespace}/${slug}/edit`;
      const { title, updated_at } = data.article!;
      leftBottom = title;
      rightTop = `最后更新于：${formatDate(updated_at)}`;
    } else {
      breadcrumb = [["/", login], ["/blog", repo]];
      editUrl = `${baseurl}/${namespace}`;
      leftBottom = `共 ${data.list!.total} 篇文章`;
    }
  }
</script>

<Header {breadcrumb} {rightTop} />

<Main>
  <slot />
</Main>

<Footer {editUrl} {leftBottom} />
