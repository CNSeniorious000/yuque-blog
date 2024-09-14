<script>
  import Footer from "../../lib/Footer.svelte";
  import Header from "../../lib/Header.svelte";
  import { withBreadcrumb } from "$lib/Breadcrumb.svelte";
  import Main from "$lib/Main.svelte";
  import { repo } from "$lib/utils";

  withBreadcrumb("/blog", repo);

</script>

<Header />

<Main>
  <slot />
</Main>

<Footer />
