<script>
  import { language } from "$lib/Chinese.svelte";
</script>

<button class="ml-auto h-6 w-10 select-none rounded-full text-xs text-teal-7 font-bold ring-(1.2 teal-7/30 inset) transition-shadow dark:text-zinc-2 dark:ring-zinc-1/30" onclick={() => language.forceEnglish = language.isChinese}>
  <div class="grid h-full w-8 place-items-center rounded-full bg-teal-7 text-white transition-colors dark:bg-zinc-2 dark:text-zinc-8" class:translate-x-0.5rem={!language.isChinese}>
    {language.isChinese ? "En" : "中"}
  </div>
</button>
