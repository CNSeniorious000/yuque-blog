<script>
  import { breadcrumbStore, leftBottom, rightBottom, rightTop } from "../../../lib/store";
  import Marked from "$lib/Marked.svelte";
  import { baseurl, formatDate, namespace } from "$lib/utils";

  export let data;
  const { creator, book, slug, custom_description: description, title, body: markdown } = data;

  $breadcrumbStore = [
    ["/", creator.login],
    ["/blog", book.slug],
    [`/blog/${slug}`, slug],
  ];

  $rightTop = `最后更新于：${formatDate(data.updated_at)}`;
  $leftBottom = title;
  $rightBottom = `${baseurl}/${namespace}/${slug}`;
</script>

<Marked {title} {description} {markdown} />
