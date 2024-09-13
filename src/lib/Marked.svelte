<script lang="ts">
  import Main from "./Main.svelte";
  import Title from "./Title.svelte";

  export let markdown = "";
  export let title = "";
  export let description = "";

  import Clipboard from "./Clipboard.svelte";
  import MarkdownIt from "markdown-it";
  import { onMount } from "svelte";

  const md = new MarkdownIt({ typographer: true });
  const cleaned_markdown = markdown.replaceAll("<br />", "\n\n").replaceAll(/<a name.*<\/a>\n/g, ""); // preprocessing
  const html = md.render(cleaned_markdown);

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

<Main>
  <div class="relative flex flex-row">
    <Title {title} {description} />
    <div class="absolute right-0 mx-6 mt-6 sm:mx-10 sm:mt-10">
      <Clipboard toCopy={cleaned_markdown} />
    </div>
  </div>
  <div class="max-w-full flex flex-col text-blue-gray-800 prose xl:text-lg dark:text-blue-gray-300 dark:prose-invert">
    {@html html}
  </div>
</Main>

<style>
  .prose :global(*) {
    margin-top: 0;
  }

  .prose :global(> *) {
    margin-left: 2.5rem;
    margin-right: 2.5rem;
    transition: all 150ms;
  }

  .prose :global(img) {
    border-radius: 0.375rem;
  }

  .prose :global(p:has(img)) {
    display: flex;
    justify-content: center;
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

  @media (max-width: 768px) {
    .prose :global(> pre) {
      border-radius: 0;
      margin-left: -1px;
      margin-right: -1px;
      padding: 1.1rem 2.5rem;
    }
  }

  @media (max-width: 639px) {
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
    transition: all 300ms;
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
  }

  .prose :global(table :where(td, th)) {
    border-bottom: 1px solid rgb(226, 232, 240); /* blue-gray-200 */
    text-align: start;
    vertical-align: text-top;
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

  .prose :global(tbody tr) {
    transition: all 150ms ease-out;
  }

  .prose :global(tbody:has(:hover) tr:not(:hover)) {
    opacity: 40%;
  }

  :global(.dark) .prose :global(pre > code) {
    filter: brightness(200%);
  }
</style>
