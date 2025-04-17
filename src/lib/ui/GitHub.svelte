<script module>
  interface Props {
    owner: string;
  }
</script>

<script lang="ts">
  import Icon from "@iconify/svelte";

  const { owner }: Props = $props();
</script>

<a href="https://github.com/{owner}" class="w-fit flex flex-row items-center gap-0.6 rounded-full bg-teal-7/7 p-1.5 pr-2.2 text-xs text-teal-7 -translate-x-1 dark:(bg-sky-4/7 text-teal-4 hover:bg-teal-4/11) hover:bg-teal-7/11 transition-background-color transition-colors">
  <div class="size-1em text-base">
    <Icon icon="mdi:github" inline={true} />
  </div>
  <span class="font-bold tracking-wide font-mono">{owner}</span>
</a>
