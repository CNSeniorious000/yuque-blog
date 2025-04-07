<script module>
  import type { LayoutParentData, LayoutServerData } from "../$types";

  interface Props {
    data: LayoutServerData & LayoutParentData;
  }
</script>

<script lang="ts">
  import { language } from "$lib/Chinese.svelte";
  import Marked from "$lib/Marked.svelte";
  import Giscus from "$lib/ui/Giscus.svelte";
  import { formatDate } from "$lib/utils";
  import Seo from "sk-seo";

  const { data }: Props = $props();
</script>

{#if data.article}
  <!-- a hack to keep these variables reactive -->
  {@const { id, title, description, markdown, updated_at } = data.article}

  <Marked {title} {description} {markdown} />

  <Seo {title} description={description || (language.isChinese ? "最后更新于：" : "Updated on ") + formatDate(updated_at, data.language)} />

  <Giscus {id} lang={data.language} />
{/if}
