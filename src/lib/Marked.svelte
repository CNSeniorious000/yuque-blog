<script context="module">
  import MarkdownIt from "markdown-it";

  const md = new MarkdownIt({ typographer: true, html: true, linkify: true });
</script>

<script lang="ts">
  import Title from "./Title.svelte";

  export let markdown = "";
  export let title = "";
  export let description = "";

  import Clipboard from "./Clipboard.svelte";
  import { onMount } from "svelte";

  const html = md.render(markdown);

  // patch code blocks at client side
  onMount(async () => {
    const codeBlocks = document.querySelectorAll(`code[class^="language-"]`);

    if (codeBlocks.length) {
      const hljsPromise = import("highlight.js");
      import("highlight.js/styles/base16/google-light.css");
      const hljs = await hljsPromise;
      const { highlight } = hljs.default;

      for (const code of codeBlocks) {
        const language = code.className.slice(9); // after "language-" prefix
        const { value } = highlight(code.textContent!, { language });
        code.innerHTML = value;
      }
    }
  });
</script>

<div class="relative flex flex-row">
  <Title {title} {description} />
  <div class="absolute right-0 mx-6 mt-6 sm:mx-10 sm:mt-10">
    <Clipboard content={markdown} />
  </div>
</div>

<article class="max-w-full flex flex-col text-blue-gray-800 prose xl:text-lg dark:text-blue-gray-300 dark:prose-invert">
  {@html html}
</article>

<style>
  .prose :global(*) {
    margin-top: 0;
  }

  .prose :global(> *) {
    margin-left: 2.5rem;
    margin-right: 2.5rem;
    transition: 150ms;
  }

  .prose :global(:where(img, iframe)) {
    --uno: md:rounded-0.375rem;
  }

  .prose :global(iframe) {
    height: 70vh;
    --uno: <md:mx-0;
  }

  .prose :global(p:has(img)) {
    display: flex;
    justify-content: center;
  }

  .prose :global(p:has(:where(img, iframe))) {
    --uno: <md:mx-0;
  }

  .prose :global(pre) {
    padding: 0.8em 1.2em;
    border: solid 1px #80808020;
    background-color: #80808007;
    line-height: 1.5rem;
  }

  .prose :global(pre::-webkit-scrollbar) {
    display: none;
  }

  .prose :global(blockquote) {
    padding-left: 0;
  }

  .prose :global(blockquote > *) {
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-left: solid 2px #80808040;
  }

  .prose :global(a) {
    font-weight: unset;
  }

  .prose :global(*:last-child) {
    margin-bottom: 2rem;
  }

  @media (max-width: 767.9px) {
    .prose :global(> pre) {
      border-radius: 0;
      margin-left: -1px;
      margin-right: -1px;
      padding: 1.1rem 2.5rem;
    }
  }

  @media (max-width: 639.9px) {
    .prose > :global(*) {
      margin-left: 1.5rem;
      margin-right: 1.5rem;
    }

    .prose > :global(pre) {
      padding: 0.8rem 1.5rem;
    }
  }

  .prose :global(hr) {
    margin-top: 1em !important;
    border-bottom: 2px dashed #80808030;
  }

  .prose :global(a) {
    transition: 300ms;
    text-decoration: none;
    color: rgb(3, 105, 161); /* light-blue-700 */
  }

  .prose :global(a:hover) {
    color: rgb(13, 148, 136); /* teal-600 */
  }

  :global(.dark) .prose :global(a) {
    color: rgb(56, 189, 248); /* light-blue-400 */
  }

  :global(.dark) .prose :global(a:hover) {
    color: rgb(45, 212, 191); /* teal-400 */
  }

  .prose :global(table) {
    border-radius: 0.375rem;
    --uno: <md:(mx-0 w-full);
  }

  .prose :global(table :where(td, th)) {
    border-bottom: 1px solid rgb(226, 232, 240); /* blue-gray-200 */
    text-align: start;
    vertical-align: text-top;
    --uno: transition-padding <md:(first:pl-10 last:pr-10) <sm:(first:pl-6 last:pr-6);
  }

  :global(.dark) .prose :global(table :where(td, th)) {
    border-color: rgb(30, 41, 59); /* blue-gray-800 */
  }

  .prose :global(table tr:last-child :where(td, th)) {
    border-bottom: none;
  }

  .prose :global(thead) {
    background: rgb(248, 250, 252); /* blue-gray-50 */
  }

  :global(.dark) .prose :global(thead) {
    background: rgba(30, 41, 59, 0.5); /* blue-gray-800 */
  }

  .prose :global(table td:first-child) {
    white-space: nowrap;
  }

  .prose :global(table td:not(:first-child)) {
    --uno: <md:w-full;
  }

  .prose :global(tbody tr) {
    transition: 150ms ease-out;
  }

  .prose :global(tbody:has(:hover) tr:not(:hover)) {
    opacity: 40%;
  }

  :global(.dark) .prose :global(pre > code) {
    filter: brightness(200%);
  }
</style>
