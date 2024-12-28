<script lang="ts">
  import type { LayoutParentData, LayoutServerData } from "../$types";

  import Marked from "$lib/Marked.svelte";
  import Giscus from "$lib/ui/Giscus.svelte";
  import { formatDate } from "$lib/utils";
  import Seo from "sk-seo";

  export let data: LayoutServerData & LayoutParentData;
</script>

{#if data.article}
  <!-- a hack to keep these variables reactive -->
  {@const { id, title, description, markdown, updated_at } = data.article}

  <Marked {title} {description} {markdown} />

  <Seo {title} description={description || `最后更新于：${formatDate(updated_at, data.language)}`} />

  <Giscus {id} lang={data.language} />
{/if}
