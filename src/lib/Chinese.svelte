<script module lang="ts">
  export const language = $state({
    forceEnglish: false,
    defaultIsChinese: false,
    get isChinese() {
      return this.forceEnglish ? false : this.defaultIsChinese;
    },
  });
</script>

<script>
  import { browser } from "$app/environment";

  const { acceptLanguage }: { acceptLanguage: string | undefined } = $props();

  language.defaultIsChinese = Boolean(browser ? navigator.language.includes("zh") : acceptLanguage?.includes("zh"));
</script>
