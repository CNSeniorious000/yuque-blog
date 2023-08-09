<script>
  export let title = "";
  export let description = "";
</script>

<div class="flex flex-col gap-1">
  <h1 class="transition-all px-6 pt-6 sm:px-10 sm:pt-10 text-3xl font-bold">{title}</h1>
  {#if description}
    <h2 class="transition-all px-6 pb-6 sm:px-10 sm:pb-10 text-sm">{description}</h2>
  {:else}
    <br />
  {/if}
</div>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>
