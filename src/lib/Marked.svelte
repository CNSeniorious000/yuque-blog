<script module>
  interface Props {
    markdown?: string;
    title?: string;
    description?: string;
  }
</script>

<script lang="ts">
  import Clipboard from "./Clipboard.svelte";
  import Code from "./Code.svelte";
  import Title from "./Title.svelte";
  import Url from "./Url.svelte";
  import SvelteMarkdown from "@humanspeak/svelte-markdown";

  let { markdown = $bindable(""), title = "", description = "" }: Props = $props();
</script>

<div class="relative flex flex-row">
  <Title {title} {description} />
  <div class="absolute right-0 mx-6 mt-6 sm:mx-10 sm:mt-10">
    <Clipboard content={() => markdown.replaceAll("/nlark/", new URL("/nlark/", location.origin).href)} />
  </div>
</div>

<article class="max-w-full flex flex-col text-zinc-800 prose xl:text-lg dark:text-zinc-300 dark:prose-invert">
  <SvelteMarkdown renderers={{ code: Code, link: Url }} source={markdown} />
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

  .prose :global(:where(img, iframe, table)) {
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
    --uno: \!b-zinc-5/13 \!bg-zinc-5/3 [&_span]:\!bg-transparent b-(1 solid);
    line-height: 1.5rem;
  }

  .prose :global(pre::-webkit-scrollbar) {
    display: none;
  }

  .prose :global(blockquote) {
    padding-left: 0;
    border-left: solid 3px #80808020;
    font-style: normal !important;
    --uno: text-sm op-80 py-1;
  }

  .prose :global(blockquote :last-child) {
    margin-bottom: 0;
  }

  .prose :global(blockquote > *) {
    padding-left: 1rem;
  }

  .prose :global(p) {
    margin-bottom: 0.5rem;
  }

  .prose :global(:where(ul, ol)) {
    padding-left: 2rem !important;
  }

  .prose :global(a) {
    font-weight: unset;
  }

  .prose > :global(*:last-child) {
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
    --uno: text-light-blue-700 dark:text-light-blue-400 hover:text-teal-600 dark:hover:text-teal-400;
  }

  .prose :global(table) {
    --uno: <md:(mx-0 w-full);
  }

  .prose :global(table :where(td, th)) {
    --uno: b-(1 zinc-1 solid) dark:b-zinc-8;
    text-align: start;
    vertical-align: text-top;
    --uno: transition-padding <md:(first:b-l-none last:b-r-none first:pl-10 last:pr-10) <sm:(first:pl-6 last:pr-6);
  }

  .prose :global(table tr:last-child :where(td, th)) {
    border-bottom: none;
  }

  .prose :global(thead) {
    --uno: bg-zinc-1/50 dark:bg-zinc-8/25;
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

  .prose :global(:where(h1, h2, h3, h4, h5, h6)) {
    --uno: mb-0.6em mt-1.2em;
  }

  .prose :global(hr + :where(h1, h2, h3, h4, h5, h6)) {
    --uno: mt-0;
  }
</style>
