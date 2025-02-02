<script>
  import Inline from "./InlineMarkdown.svelte";
  import { TokenSquare } from "@promplate/pattern";
  import GitHub from "$lib/ui/GitHub.svelte";
  import WithTooltip from "$lib/ux/WithTooltip.svelte";
</script>

<div class="max-w-full flex flex-row gap-7 rounded-lg p-10 text-pretty leading-relaxed tracking-wide <2xl:text-sm sm:shadow-(lg zinc-9/5)">

  <div aria-hidden="true" class="font-calt text-zinc-8 transition-color <md:hidden dark:text-zinc-1">
    <TokenSquare length={16} isHighlighted={() => Math.random() < 0.07} />
  </div>

  <div class="relative flex flex-col gap-4 text-zinc-5 lg:max-w-60ch md:max-w-45ch sm:max-w-60ch">

    <GitHub owner="CNSeniorious000" />

    <h1>
      <Inline markdown="**庄毅辉**，aka " />

      <WithTooltip tips="The reverse of **lorem ipsum**">
        {#snippet children({ props })}
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <strong {...props} tabindex="0">
            Muspi Merol
          </strong>
        {/snippet}
      </WithTooltip>

      <Inline markdown="是一名 [BNUZ](https://www.bnuzh.edu.cn/ '北京师范大学（珠海校区）') 的 undergraduate、一个 opinionated 的开源爱好者。" />
    </h1>

    <h2>
      <Inline markdown="我关注 **LLM 应用**、**开发者工具**、**教育**以及**设计**。" />
    </h2>

    <div>
      <Inline markdown="我的理想工作是**产品经理**/**全栈工程师**/**受赞助全职开源**/**技术顾问**。我比较看重氛围活泼、技术前沿，且一定程度上支持 async" />
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
