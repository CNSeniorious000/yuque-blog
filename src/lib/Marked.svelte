<script>
  import Title from "./Title.svelte";
  import Main from "./Main.svelte";
  export let markdown = "";
  export let title = "";
  export let description = "";

  import { onMount } from "svelte";
  import MarkdownIt from "markdown-it";
  let md = new MarkdownIt({ typographer: 1 });
  let html = md.render(markdown.replaceAll("<br />", "\n\n").replaceAll(new RegExp("<a name.*</a>\n", "g"), "")); // markdown preprocessing and rendering

  // patch code blocks at client side
  onMount(async () => {
    let codeBlocks = document.querySelectorAll(`code[class^="language-"]`);

    if (codeBlocks.length) {
      let hljsPromise = import("highlight.js");
      import("highlight.js/styles/base16/google-light.css");
      let hljs = await hljsPromise;
      let { highlight } = hljs.default;

      for (let code of codeBlocks) {
        let language = code.className.slice(9); // after "language-" prefix
        let { value } = highlight(code.innerText, { language });
        code.innerHTML = value;
      }
    }
  });
</script>

<Main>
  <Title {title} {description} />
  <div class="prose xl:text-lg dark:prose-invert text-blue-gray-800 dark:text-blue-gray-300 min-w-full max-w-full">
    {@html html}
  </div>
</Main>

<style>
  :global(.prose *) {
    margin-top: 0;
  }

  :global(.prose > *) {
    margin-left: 2.5rem;
    margin-right: 2.5rem;
    transition: all 150ms;
  }

  :global(.prose img) {
    border-radius: 0.375rem;
  }

  :global(.prose pre) {
    padding: 0.8em 1.2em;
    border: solid 1px #80808020;
    background-color: #80808007;
    line-height: 1.5rem;
  }

  :global(.prose blockquote) {
    padding-left: 0;
  }

  :global(.prose blockquote > *) {
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-left: solid 2px #80808040;
  }

  :global(.prose a) {
    font-weight: unset;
  }

  :global(.prose:last-child) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    :global(.prose > *) {
      margin-left: 2.5rem;
      margin-right: 2.5rem;
    }

    :global(.prose > pre) {
      border-radius: 0;
      margin-left: -1px;
      margin-right: -1px;
      padding: 1.1rem 2.5rem;
    }
  }

  @media (max-width: 639px) {
    :global(.prose > *) {
      margin-left: 1.5rem;
      margin-right: 1.5rem;
    }

    :global(.prose > pre) {
      padding: 0.8rem 1.5rem;
    }
  }

  :global(.prose hr) {
    margin-top: 1em !important;
    border-bottom: 2px dashed #80808030;
  }

  :global(.prose a) {
    transition: all 300ms;
    text-decoration: none;
    color: rgb(3, 105, 161);
  }

  :global(.prose a:hover) {
    color: rgb(13, 148, 136);
  }

  :global(.prose table) {
    border-radius: 0.375rem;
  }

  :global(.prose table :where(td, th)) {
    border-bottom: 1px solid rgb(226, 232, 240); /* blue-gray-200 */
    text-align: start;
    vertical-align: text-top;
  }

  :global(.prose table tr:last-child :where(td, th)) {
    border-bottom: none;
  }

  :global(.prose thead) {
    background: rgb(248, 250, 252); /* blue-gray-50 */
  }

  :global(.prose table td:first-child) {
    white-space: nowrap;
  }

  :global(.prose tbody tr) {
    transition: all 150ms ease-out;
  }

  :global(.prose tbody:has(:hover) tr:not(:hover)) {
    opacity: 40%;
  }
</style>
