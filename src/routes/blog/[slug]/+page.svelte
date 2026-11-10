<script module>
  import type { LayoutParentData, LayoutServerData } from "../$types";

  interface Props {
    data: LayoutServerData & LayoutParentData;
  }
</script>

<script lang="ts">
  import { getLanguage } from "#lib/language.svelte.js";
  import Marked from "#lib/Marked.svelte";
  import Seo from "#lib/Seo.svelte";
  import Giscus from "#lib/ui/Giscus.svelte";
  import { updatedLabel } from "#lib/utils.js";

  const language = getLanguage();
  const { data }: Props = $props();
</script>

{#if data.article}
  <!-- a hack to keep these variables reactive -->
  {@const { id, title, description, markdown, updated_at } = data.article}

  <Marked {title} {description} {markdown} />

  <Seo {title} description={description || updatedLabel(updated_at, language.locale, language.isChinese)} />

  <Giscus {id} lang={language.locale} />
{/if}
