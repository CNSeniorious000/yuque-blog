<script module>
  interface Props {
    editUrl: string;
    leftBottom: string;
  }
</script>

<script lang="ts">
  const { editUrl, leftBottom }: Props = $props();
</script>

<footer class="overflow-hidden">
  <div class="m-6 flex flex-row justify-between text-sm text-zinc-500 transition-margin sm:m-10 !mt-3">
    <div>{leftBottom}</div>
    <a href={editUrl} class="opacity-0 duration-500 hover:text-teal-600 sm:opacity-100">编辑此页</a>
  </div>
</footer>
