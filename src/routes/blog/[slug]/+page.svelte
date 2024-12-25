<script lang="ts">
  import type { LayoutParentData, LayoutServerData } from "../$types";

  import Marked from "$lib/Marked.svelte";
  import { formatDate } from "$lib/utils";
  import Seo from "sk-seo";

  export let data: LayoutServerData & LayoutParentData;
</script>

{#if data.article}
  <!-- a hack to keep these variables reactive -->
  {@const { title, description, markdown, updated_at } = data.article}

  <Marked {title} {description} {markdown} />

  <Seo {title} description={description || `最后更新于：${formatDate(updated_at, data.language)}`} />
{/if}
