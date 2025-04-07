<script module lang="ts">
  export const language = $state({
    forceEnglish: null as boolean | null,
    defaultIsChinese: false,
    get isChinese() {
      return this.forceEnglish === null ? this.defaultIsChinese : !this.forceEnglish;
    },
  });
</script>

<script>
  import { browser } from "$app/environment";

  const { acceptLanguage }: { acceptLanguage: string | undefined } = $props();

  language.defaultIsChinese = Boolean(browser ? navigator.language.includes("zh") : acceptLanguage?.includes("zh"));
</script>
