<script module lang="ts">
  import { browser } from "$app/environment";

  export const language = $state({
    forceEnglish: null as boolean | null,
    defaultIsChinese: false,
    get isChinese() {
      return this.forceEnglish === null ? this.defaultIsChinese : !this.forceEnglish;
    },
    get locale() {
      return this.isChinese ? "zh-CN" : "en-US";
    },
    init(acceptLanguage?: string) {
      this.defaultIsChinese = Boolean(browser ? navigator.languages.join().includes("zh") : acceptLanguage?.includes("zh"));
    },
  });
</script>
