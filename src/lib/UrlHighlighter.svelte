<script module>
  interface Props {
    url: URL;
  }
</script>

<script lang="ts">
  import "@fontsource-variable/fira-code";

  const { url }: Props = $props();

  const protocol = $derived(url.protocol);
  const hostname = $derived(url.hostname);
  const segments = $derived(url.pathname.replace(/^\//, "").split("/"));
  const entries = $derived(Array.from(url.searchParams.entries()));
  const hash = $derived(url.hash);

  function truncate(str: string, max: number): string {
    return str.length > max ? `${str.slice(0, 7)}...` : str;
  }
</script>

<div class="pointer-events-none flex flex-row ws-nowrap text-zinc-700 dark:text-zinc-300">
  <span class="op-30">
    {protocol}//
  </span>
  <span>
    {hostname}
  </span>
  {#if segments.length}
    {#each segments as segment, index}
      <span class="op-30">
        /
      </span>
      {#if segment}
        <span class={index % 2 ? "op-85" : "op-65"}>{truncate(segment, 25)}</span>
      {/if}
    {/each}
  {/if}
  {#if entries.length}
    {#each entries as [k, v], i}
      <span class="op-30">
        {i ? "&" : "?"}
      </span>
      <span class="text-sky-800/70 dark:text-sky-200/70">
        {k}
      </span>
      <span class="op-30">
        =
      </span>
      <span class="text-teal-800/70 dark:text-teal-200/70">
        {truncate(v, 15)}
      </span>
    {/each}
  {/if}
  {#if hash}
    <span class="op-30">#</span>
    <span class="op-85">
      {truncate(hash.replace(/^#/, ""), 15)}
    </span>
  {/if}
</div>
