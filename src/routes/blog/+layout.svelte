<script module>
  import type { LayoutParentData, LayoutServerData } from "./$types";

  interface Props {
    data: LayoutServerData & LayoutParentData;
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  import { page } from "$app/state";
  import { postPath } from "$lib/api/frontmatter";
  import { contentRepo } from "$lib/api/github";
  import { language } from "$lib/Chinese.svelte";
  import Footer from "$lib/Footer.svelte";
  import Header from "$lib/Header.svelte";
  import Main from "$lib/Main.svelte";
  import { formatDate, login, repo } from "$lib/utils";

  const { data, children }: Props = $props();

  let breadcrumb = $state<[string, string][]>()!;
  let editUrl = $state<string>()!;
  let leftBottom = $state<string>()!;
  let rightTop = $state<string>()!;

  function update() {
    if (page.route.id === "/blog/[slug]") {
      const { slug } = page.params as { slug: string };
      breadcrumb = [["/", login], ["/blog", repo], [`/blog/${slug}`, slug]];
      editUrl = `https://github.com/${contentRepo}/edit/main/${postPath(slug)}`;
      const { title, updated_at } = data.article!;
      leftBottom = title;
      rightTop = (language.isChinese ? "最后更新于：" : "Updated on ") + formatDate(updated_at, language.locale);
    } else {
      breadcrumb = [["/", login], ["/blog", repo]];
      editUrl = `https://github.com/${contentRepo}`;
      leftBottom = language.isChinese ? `共 ${data.list!.length} 篇文章` : `${data.list!.length} articles`;
      rightTop = "";
    }
  }

  update();
  $effect(update); // recomputes the header when the visitor switches language
</script>

<Header {breadcrumb} {rightTop} />

<Main>
  {@render children?.()}
</Main>

<Footer {editUrl} {leftBottom} />
