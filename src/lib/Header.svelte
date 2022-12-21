<script>
  export let breadcrumb = [];
  export let right = "";
</script>

<header>
  <div class="transition-all text-sm text-blue-gray-400 m-6 sm:m-10 flex-row justify-between overflow-hidden">
    <p class="flex gap-1.5">
      {#each breadcrumb as [href, title], index (href)}
        <a class="transition-all hover:text-teal-600" {href}>{title}</a>
        {#if index + 1 != breadcrumb.length}
          <span class="opacity-40"> / </span>
        {/if}
      {/each}
    </p>
    {#if right}
      <p class="transition-all overflow-ellipsis max-w-50% opacity-0 sm:opacity-100 duration-500 overflow-hidden whitespace-nowrap">{right}</p>
    {/if}
  </div>
</header>
