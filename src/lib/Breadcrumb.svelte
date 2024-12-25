<script lang="ts">
  export let breadcrumb: [string, string][];
</script>

{#each breadcrumb as [href, title], index (href)}
  <li class="contents">
    <a {href} class="ws-nowrap transition hover:text-teal-600 dark:hover:text-teal-400">
      {title}
    </a>
    {#if index !== breadcrumb.length - 1}
      <span class="opacity-40">/</span>
    {/if}
  </li>
{/each}
