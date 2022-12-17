<script>
  import { baseurl, namespace } from "$lib/common";
  import { onMount } from "svelte";
  import hljs from "highlight.js";
  import "highlight.js/styles/base16/google-light.css";

  function patchCodeBlocks() {
    let codeBlocks = document.querySelectorAll("[data-language]");
    for (let pre of codeBlocks) {
      let lang = pre.getAttribute("data-language");
      let { value } = hljs.highlight(pre.innerText, { language: lang });
      pre.innerHTML = value;
    }
  }

  onMount(patchCodeBlocks);

  export let data;
  let { creator, body_html, book } = data;
</script>

<header>
  <div class="text-sm text-blue-gray-400 m-10 flex-row justify-between">
    <p class="flex gap-1.5">
      <a class="hover:text-teal-600 transition-all" href="{baseurl}/{creator.login}">{creator.login}</a>
      <span class="opacity-50">/</span>
      <a class="hover:text-teal-600 transition-all" href="{baseurl}/{namespace}">{book.slug}</a>
      <span class="opacity-50">/</span>
      <a class="hover:text-teal-600 transition-all" href="{baseurl}/{namespace}/{data.slug}">{data.slug}</a>
    </p>
    {#if data.custom_description}
      <p class="overflow-ellipsis max-w-50% overflow-hidden whitespace-nowrap">{data.custom_description}</p>
    {/if}
  </div>
</header>

<main class="flex flex-grow mx-10 justify-center h-full text-blue-gray-700">
  <div class="transition-all w-full max-w-full lg:max-w-80% 2xl:max-w-6xl">
    <div class="rounded-xl p-10 shadow-md shadow-gray-100">
      <div class="text-base prose self-center min-w-full w-[unset]">
        {@html body_html}
      </div>
    </div>
  </div>
</main>

<footer>
  <div class="text-sm text-blue-gray-500 m-10 flex-row justify-between">
    <p>{data.title}</p>
    <p class="opacity-50">Last Modified: {data.updated_at}</p>
    <p class="hidden sm:display-[unset]">Rate Limit: Not Available</p>
  </div>
</footer>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<style>
  .prose :global(img) {
    border-radius: 0.375rem;
  }

  .prose :global(pre) {
    border: solid 1px #80808020;
    background-color: #80808007;
  }
</style>
