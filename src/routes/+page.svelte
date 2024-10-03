<script>
  import Icon from "@iconify/svelte";
  import DarkModeToggle from "$lib/DarkModeToggle.svelte";
</script>

<div class="h-full flex flex-row justify-center transition">
  <div class="flex flex-col justify-center gap-1 text-center text-teal-700 transition dark:text-teal-300">
    <DarkModeToggle />
    <h1>Hi! I'm <strong>Muspi Merol</strong></h1>
    <h2 class="text-zinc-400"><a href="https://github.com/CNSeniorious000">@CNSeniorious000</a></h2>

    <h3 class="mt-2.5 flex flex-row gap-4">
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="/blog">
        <Icon icon="ph:star-duotone" />
        Blog
      </a>
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="https://github.com/CNSeniorious000">
        <Icon icon="mdi:github-face" />
        GitHub
      </a>
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="https://free-chat.asia/">
        <Icon icon="fluent:chat-sparkle-16-filled" />
        Free Chat
      </a>
      <a class="flex flex-row items-center gap-1 border border-zinc-300 rounded border-dashed px-2 py-1 text-sm text-zinc-500 transition-colors dark:border-zinc-600 hover:border-solid" href="mailto:kilo.meter@foxmail.com">
        <Icon icon="tabler:brand-mailgun" />
        Email
      </a>
    </h3>
  </div>
</div>
