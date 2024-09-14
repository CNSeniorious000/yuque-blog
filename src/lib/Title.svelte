<script>
  export let title = "";
  export let description = "";
</script>

<div class="flex flex-col gap-1">
  <h1 class="px-6 pt-6 text-3xl font-bold transition-all sm:px-10 sm:pt-10">{title}</h1>
  {#if description}
    <h2 class="px-6 pb-6 text-sm transition-all sm:px-10 sm:pb-10">{description}</h2>
  {:else}
    <br />
  {/if}
</div>
