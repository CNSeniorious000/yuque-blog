<script>
  import { breadcrumb } from "$lib/store";

  export let right = "";
</script>

<header>
  <div class="m-6 flex flex-row justify-between overflow-hidden text-sm text-blue-gray-400 transition-all sm:m-10 !mb-3">
    <p class="flex gap-1.5">
      {#each $breadcrumb as [href, title], index (href)}
        <a class="whitespace-nowrap transition-all hover:text-teal-600 dark:hover:text-teal-400" {href}>{title}</a>
        {#if index + 1 !== $breadcrumb.length}
          <span class="opacity-40"> / </span>
        {/if}
      {/each}
    </p>
    {#if right}
      <p class="overflow-ellipsis max-w-50% overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 sm:opacity-100">{right}</p>
    {/if}
  </div>
</header>
