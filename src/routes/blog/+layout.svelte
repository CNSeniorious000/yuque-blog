<script>
  import Fotter from "../../lib/Fotter.svelte";
  import Header from "../../lib/Header.svelte";
  import { breadcrumbStore, leftBottom, rightBottom, rightTop } from "../../lib/store";

  $: breadcrumb = $breadcrumbStore;
</script>

<Header {breadcrumb} right={$rightTop} />
<slot />
<Fotter title={$leftBottom} edit={$rightBottom} />
