<script>
  export let edit;
  export let title;
</script>

<footer class="overflow-hidden">
  <div class="transition-all text-sm text-blue-gray-500 m-6 sm:m-10 !mt-3 flex-row justify-between">
    <p>{title}</p>
    <a class="opacity-0 sm:opacity-100 duration-500 hover:text-teal-600" href="{edit}">编辑此页</a>
  </div>
</footer>
