<script module>
  interface Props {
    title?: string;
    description?: string;
  }
</script>

<script lang="ts">
  import { page } from "$app/state";

  // hand-rolled replacement for sk-seo, which subscribes to the removed $app/stores
  const { title, description }: Props = $props();
</script>

<svelte:head>
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={page.url.href} />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={page.url.hostname} />
  <meta property="twitter:url" content={page.url.href} />
  {#if title}
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta name="twitter:title" content={title} />
  {/if}
  {#if description}
    <meta name="description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:description" content={description} />
  {/if}
</svelte:head>
