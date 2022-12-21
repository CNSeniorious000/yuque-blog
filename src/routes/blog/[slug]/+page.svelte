<script>
  import { breadcrumbStore, rightTop, leftBottom, rightBottom } from "../../../lib/store";
  import Marked from "$lib/Marked.svelte";

  export let data;
  let { creator, book, slug, custom_description: description, title, body: markdown } = data;

  $breadcrumbStore = [
    ["/", creator.login],
    ["/blog", book.slug],
    ["/blog/" + slug, slug],
  ];

  $rightTop = data.update_time;

  $rightTop = data.created_at;
  $leftBottom = title;
  $rightBottom = data.updated_at;
</script>

<Marked {title} {description} {markdown} />
