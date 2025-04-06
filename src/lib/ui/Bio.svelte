<script>
  import Inline from "./InlineMarkdown.svelte";
  import { TokenSquare } from "@promplate/pattern";
  import { language } from "$lib/Chinese.svelte";
  import GitHub from "$lib/ui/GitHub.svelte";
  import LanguageSwitch from "$lib/ui/LanguageSwitch.svelte";
  import WithTooltip from "$lib/ux/WithTooltip.svelte";

  const chinese = $derived(language.isChinese);
</script>

<div class="max-w-full flex flex-row gap-7 rounded-lg p-10 text-pretty tracking-wide <2xl:text-sm !leading-relaxed sm:shadow-(lg zinc-9/5)">

  <div aria-hidden="true" class="font-calt text-zinc-8 transition-color <md:hidden dark:text-zinc-1">
    <TokenSquare length={16} isHighlighted={() => Math.random() < 0.07} />
  </div>

  <div class="relative flex flex-col gap-4 text-zinc-5 lg:max-w-60ch md:max-w-45ch sm:max-w-60ch">

    <div class="flex flex-row items-center justify-between">
      <GitHub owner="CNSeniorious000" />
      <LanguageSwitch />
    </div>

    <h1>
      {#if chinese}
        <Inline markdown="**庄毅辉**，aka " omitLeftMargin />
      {:else}
        <Inline markdown="Yihui Zhuang, aka " />
      {/if}

      <WithTooltip tips="The reverse of **lorem ipsum**">
        {#snippet children({ props })}
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <strong {...props} tabindex="0">
            Muspi Merol
          </strong>
        {/snippet}
      </WithTooltip>

      <Inline markdown={chinese ? "是一名 [BNUZ](https://www.bnuzh.edu.cn/ '北京师范大学（珠海校区）') 的 undergraduate、一个 opinionated 的开源爱好者。" : "is an undergraduate at [BNUZ](https://english.bnuzh.edu.cn/ 'Beijing Normal University at Zhuhai') and an **opinionated** open-source enthusiast."} />
    </h1>

    <h2>
      <Inline markdown={chinese ? "我关注 **LLM 应用**、**开发者工具**、**教育**以及**设计**。" : "Working on **LLM applications**, **developer tools**, **education** and **design**."} />
    </h2>

    <div>
      <Inline markdown={chinese ? "我的理想工作是**产品经理**/**全栈工程师**/**受赞助全职开源**/**技术顾问**。我比较看重氛围活泼、技术前沿，且一定程度上支持 async" : "I’m also open for remote work opportunities."} />
    </div>

    <div class="flex flex-row gap-3 md:(absolute bottom-0 left-0) <md:mt-8">
      <a href="/blog"><code>/blog</code> 碎碎念</a>
      <a href="mailto:me@promplate.dev"><code>@email</code> 联系</a>
    </div>

  </div>

</div>

<style>
  strong, a {
    margin-inline: 0.1em;
    --uno: text-teal-7 underline underline-(0.5 teal-7/40 offset-3 dashed) transition-colors dark:text-zinc-50 dark:underline-zinc-1/60 hover:underline-solid;
  }

  code {
    --uno: font-mono;
  }

  .font-calt {
    font-feature-settings: "calt";
  }
</style>
