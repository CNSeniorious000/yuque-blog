<script>
  import Fotter from "../../lib/Fotter.svelte";
  import Header from "../../lib/Header.svelte";
  import { leftBottom, rightBottom, rightTop } from "../../lib/store";
</script>

<Header right={$rightTop} />
<slot />
<Fotter title={$leftBottom} edit={$rightBottom} />
