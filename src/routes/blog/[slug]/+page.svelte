<script>
  import { baseurl, namespace, formatDate } from "$lib/utils";
  import { breadcrumbStore, rightTop, leftBottom, rightBottom } from "../../../lib/store";
  import Marked from "$lib/Marked.svelte";

  export let data;
  let { creator, book, slug, custom_description: description, title, body: markdown } = data;

  $breadcrumbStore = [
    ["/", creator.login],
    ["/blog", book.slug],
    ["/blog/" + slug, slug],
  ];

  $rightTop = "最后更新于：" + formatDate(data.updated_at);
  $leftBottom = title;
  $rightBottom = `${baseurl}/${namespace}/${slug}`;
</script>

<Marked {title} {description} {markdown} />
