<script>
  export let edit;
  export let title;
</script>

<footer class="overflow-hidden">
  <div class="m-6 flex flex-row justify-between text-sm text-blue-gray-500 transition-all sm:m-10 !mt-3">
    <p>{title}</p>
    <a class="opacity-0 duration-500 hover:text-teal-600 sm:opacity-100" href={edit}>编辑此页</a>
  </div>
</footer>
