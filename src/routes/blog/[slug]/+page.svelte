<script lang="ts">
  import type { PageServerData } from "./$types";

  import { page } from "$app/stores";
  import Marked from "$lib/Marked.svelte";
  import { breadcrumb, leftBottom, rightBottom, rightTop } from "$lib/store";
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
  $rightBottom = `${baseurl}/${namespace}/${slug}`;
</script>

<Marked {title} {description} {markdown} />
