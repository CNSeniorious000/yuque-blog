<script module>
  import type { LayoutParentData, LayoutServerData } from "./$types";

  interface Props {
    data: LayoutServerData & LayoutParentData;
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Footer from "$lib/Footer.svelte";
  import Header from "$lib/Header.svelte";
  import Main from "$lib/Main.svelte";
  import { baseurl, formatDate, login, namespace, repo } from "$lib/utils";

  const { data, children }: Props = $props();

  let breadcrumb = $state<[string, string][]>()!;
  let editUrl = $state<string>()!;
  let leftBottom = $state<string>()!;
  let rightTop = $state<string>()!;

  function update() {
    if (page.route.id === "/blog/[slug]") {
      const { slug } = page.params;
      breadcrumb = [["/", login], ["/blog", repo], [`/blog/${slug}`, slug]];
      editUrl = `${baseurl}/${namespace}/${slug}/edit`;
      const { title, updated_at } = data.article!;
      leftBottom = title;
      rightTop = `最后更新于：${formatDate(updated_at, data.language)}`;
    } else {
      breadcrumb = [["/", login], ["/blog", repo]];
      editUrl = `${baseurl}/${namespace}`;
      leftBottom = `共 ${data.list!.total} 篇文章`;
      rightTop = "";
    }
  }

  update();

  afterNavigate(({ from }) => {
    if (from?.route.id?.startsWith("/blog")) {
      update(); // don't trigger twice if navigating from other routes
    }
  });
</script>

<Header {breadcrumb} {rightTop} />

<Main>
  {@render children?.()}
</Main>

<Footer {editUrl} {leftBottom} />
