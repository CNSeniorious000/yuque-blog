<script lang="ts">
  import type { PageServerData } from "./$types";

  import { page } from "$app/stores";
  import { breadcrumb } from "$lib/Breadcrumb.svelte";
  import Marked from "$lib/Marked.svelte";
  import { editUrl, leftBottom, pageDescription, pageTitle, rightTop } from "$lib/store";
  import { baseurl, formatDate, login, namespace, repo } from "$lib/utils";

  export let data: PageServerData;

  const { slug } = $page.params;
  const { description, title, markdown, updated_at } = data;

  $breadcrumb = [
    ["/", login],
    ["/blog", repo],
    [`/blog/${slug}`, slug],
  ];

  $rightTop = `最后更新于：${formatDate(updated_at)}`;
  $leftBottom = title;
  $editUrl = `${baseurl}/${namespace}/${slug}`;

  $pageTitle = title;
  $pageDescription = description || $rightTop;
</script>

<Marked {title} {description} {markdown} />
