<script>
  export let title;
  export let lastUpdateDate;
</script>

<footer class="overflow-hidden">
  <div class="text-sm text-blue-gray-500 m-6 sm:m-10 flex-row justify-between">
    <p>{title}</p>
    <p class="opacity-0 sm:opacity-100 duration-500">{lastUpdateDate}</p>
  </div>
</footer>
