<script module>
  import type { LayoutParentData, LayoutServerData } from "./$types";

  interface Props {
    data: LayoutServerData & LayoutParentData;
    children?: import("svelte").Snippet;
  }
</script>

<script lang="ts">
  import { postPath } from "#lib/api/frontmatter.js";
  import { contentRepo } from "#lib/api/github.js";
  import Footer from "#lib/Footer.svelte";
  import Header from "#lib/Header.svelte";
  import { getLanguage } from "#lib/language.svelte.js";
  import Main from "#lib/Main.svelte";
  import { countLabel, login, repo, updatedLabel } from "#lib/utils.js";
  import { page } from "$app/state";

  const language = getLanguage();
  const { data, children }: Props = $props();

  const onPost = $derived(page.route.id === "/blog/[slug]");
  const slug = $derived((page.params as { slug: string }).slug);
  const breadcrumb = $derived<[string, string][]>(onPost ? [["/", login], ["/blog", repo], [`/blog/${slug}`, slug]] : [["/", login], ["/blog", repo]]);
  const editUrl = $derived(`https://github.com/${contentRepo}${onPost ? `/edit/main/${postPath(slug)}` : ""}`);
  const leftBottom = $derived(onPost ? data.article!.title : countLabel(data.list!.length, language.isChinese));
  const rightTop = $derived(onPost ? updatedLabel(data.article!.updated_at, language.locale, language.isChinese) : "");
</script>

<Header {breadcrumb} {rightTop} />

<Main>
  {@render children?.()}
</Main>

<Footer {editUrl} {leftBottom} />
