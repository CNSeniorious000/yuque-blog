<script>
  import Footer from "$lib/Footer.svelte";
  import Header from "$lib/Header.svelte";
  import Main from "$lib/Main.svelte";
</script>

<Header />

<Main>
  <slot />
</Main>

<Footer />
