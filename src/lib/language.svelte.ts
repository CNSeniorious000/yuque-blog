import { pickLocale } from "./utils";
import { createContext } from "svelte";

export function createLanguage(acceptLanguage: string | undefined) {
  const defaultLocale = pickLocale(acceptLanguage) ?? "en";
  const language = $state({
    forceEnglish: null as boolean | null,
    get locale() {
      return this.forceEnglish === null ? defaultLocale : this.forceEnglish ? "en" : "zh-CN";
    },
    get isChinese() {
      return this.locale.startsWith("zh");
    },
  });
  return language;
}

export const [getLanguage, setLanguage] = createContext<ReturnType<typeof createLanguage>>();
