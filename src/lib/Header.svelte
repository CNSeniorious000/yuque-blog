<script lang="ts">
  import Breadcrumb from "./Breadcrumb.svelte";

  export let breadcrumb: [string, string][];
  export let rightTop = "";
</script>

<header>
  <nav class="m-6 flex flex-row justify-between overflow-hidden text-sm text-zinc-400 transition-margin sm:m-10 !mb-3">
    <ol class="flex gap-1.5">
      <Breadcrumb {breadcrumb} />
    </ol>
    {#if rightTop}
      <div class="max-w-50% overflow-hidden text-ellipsis whitespace-nowrap opacity-0 transition duration-500 sm:opacity-100">
        {rightTop}
      </div>
    {/if}
  </nav>
</header>
