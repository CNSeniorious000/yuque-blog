<script module lang="ts">
  import { browser } from "$app/environment";

  const prefersChinese = browser && navigator.languages.join().includes("zh");

  export const language = $state({
    forceEnglish: null as boolean | null,
    get isChinese() {
      return this.forceEnglish === null ? prefersChinese : !this.forceEnglish;
    },
    get locale() {
      return this.isChinese ? "zh-CN" : "en-US";
    },
  });
</script>
