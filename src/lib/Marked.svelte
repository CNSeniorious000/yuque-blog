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
  <div class="prose xl:text-lg dark:prose-invert dark:text-blue-gray-300 min-w-full max-w-full">
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

  :global(hr) {
    margin-top: 1em !important;
    border-bottom: 2px dashed #80808030 !important;
  }
</style>
