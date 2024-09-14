<script>
  import Breadcrumb from "./Breadcrumb.svelte";
  import { rightTop } from "./store";
</script>

<header>
  <nav class="m-6 flex flex-row justify-between overflow-hidden text-sm text-blue-gray-400 transition-all sm:m-10 !mb-3">
    <ol class="flex gap-1.5">
      <Breadcrumb let:href let:title let:index let:total>
        <li class="contents">
          <a {href} class="ws-nowrap transition hover:text-teal-600 dark:hover:text-teal-400">
            {title}
          </a>
          {#if index !== total - 1}
            <span class="opacity-40">/</span>
          {/if}
        </li>
      </Breadcrumb>
    </ol>
    {#if $rightTop}
      <div class="max-w-50% overflow-hidden text-ellipsis whitespace-nowrap opacity-0 transition-all duration-500 sm:opacity-100">
        {$rightTop}
      </div>
    {/if}
  </nav>
</header>
