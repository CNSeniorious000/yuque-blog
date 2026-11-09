<script module>
  import type { LayoutServerData } from "./$types";

  interface Props {
    data: LayoutServerData;
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

  const header = $derived.by(() => {
    if (page.route.id === "/blog/[slug]") {
      const { slug } = page.params as { slug: string };
      return {
        breadcrumb: [["/", login], ["/blog", repo], [`/blog/${slug}`, slug]] as [string, string][],
        editUrl: `https://github.com/${contentRepo}/edit/main/${postPath(slug)}`,
        leftBottom: data.article!.title,
        rightTop: (language.isChinese ? "最后更新于：" : "Updated on ") + formatDate(data.article!.updated_at, language.locale),
      };
    }
    return {
      breadcrumb: [["/", login], ["/blog", repo]] as [string, string][],
      editUrl: `https://github.com/${contentRepo}`,
      leftBottom: language.isChinese ? `共 ${data.list!.length} 篇文章` : `${data.list!.length} articles`,
      rightTop: "",
    };
  });
</script>

<Header breadcrumb={header.breadcrumb} rightTop={header.rightTop} />

<Main>
  {@render children?.()}
</Main>

<Footer editUrl={header.editUrl} leftBottom={header.leftBottom} />
