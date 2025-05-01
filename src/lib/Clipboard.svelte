<script module>
  interface Props {
    content: string | (() => string);
  }
</script>

<script lang="ts">
  import clipboard from "@iconify-icons/line-md/clipboard";
  import clipboardCheckToClipboard from "@iconify-icons/line-md/clipboard-check-to-clipboard-transition";
  import clipboardToClipboardCheck from "@iconify-icons/line-md/clipboard-to-clipboard-check-transition";
  import Icon from "@iconify/svelte";

  const { content }: Props = $props();

  let status = $state<0 | 1 | 2>(0);

  let willChangeState: ReturnType<typeof setTimeout>;

  async function onclick() {
    await navigator.clipboard.writeText(typeof content === "string" ? content : content());
    status = 1;
    clearTimeout(willChangeState);
    willChangeState = setTimeout(() => (status = 2), 1000);
  }
</script>

<button {onclick} class="h-10 flex items-center gap-1 rounded-md bg-zinc-100 p-2 text-lg transition duration-100 ease-out active:scale-95 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:bg-opacity-70">
  {#if status === 0}
    <Icon inline icon={clipboard} />
  {:else if status === 1}
    <span class="text-base">copied!</span>
    <Icon inline icon={clipboardToClipboardCheck} />
  {:else}
    <Icon inline icon={clipboardCheckToClipboard} />
  {/if}
</button>
