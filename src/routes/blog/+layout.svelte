<script>
  import { breadcrumbStore, rightTop, leftBottom, rightBottom } from "../../lib/store";
  import Fotter from "../../lib/Fotter.svelte";
  import Header from "../../lib/Header.svelte";

  $: breadcrumb = $breadcrumbStore;
</script>

<Header {breadcrumb} right={$rightTop} />
<slot />
<Fotter title={$leftBottom} edit={$rightBottom} />
