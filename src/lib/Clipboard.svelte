<script lang="ts">
  import Icon from "@iconify/svelte";

  export let content: string;

  let state = 0;

  let willChangeState: ReturnType<typeof setTimeout>;

  async function handleClick() {
    await navigator.clipboard.writeText(content);
    state = 1;
    clearTimeout(willChangeState);
    willChangeState = setTimeout(() => (state = 2), 1000);
  }
</script>

<button on:click={handleClick} class="h-10 flex items-center gap-1 rounded-md bg-cool-gray-100 p-2 text-lg transition duration-100 ease-out active:scale-95 dark:bg-cool-gray-800 hover:bg-cool-gray-200 dark:hover:bg-cool-gray-700 dark:hover:bg-opacity-70">
  {#if state === 0}
    <Icon inline icon="line-md:clipboard" />
  {:else if state === 1}
    <span class="text-base">copied!</span>
    <Icon inline icon="line-md:clipboard-to-clipboard-check-transition" />
  {:else}
    <Icon inline icon="line-md:clipboard-check-to-clipboard-transition" />
  {/if}
</button>
