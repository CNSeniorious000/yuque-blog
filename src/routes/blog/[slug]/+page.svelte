<script lang="ts">
  import type { PageServerData } from "./$types";

  import { page } from "$app/stores";
  import { withBreadcrumb } from "$lib/Breadcrumb.svelte";
  import Marked from "$lib/Marked.svelte";
  import { editUrl, leftBottom, rightTop } from "$lib/store";
  import { baseurl, formatDate, namespace } from "$lib/utils";

  export let data: PageServerData;

  const { slug } = $page.params;
  const { description, title, markdown, updated_at } = data;

  withBreadcrumb(`/blog/${slug}`, slug);

  $rightTop = `最后更新于：${formatDate(updated_at)}`;
  $leftBottom = title;
  $editUrl = `${baseurl}/${namespace}/${slug}`;
</script>

<Marked {title} {description} {markdown} />
