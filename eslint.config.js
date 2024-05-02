import antfu from "@antfu/eslint-config";

export default antfu({
  formatters: true,
  unocss: true,
  svelte: true,
  lessOpinionated: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },
  rules: {
    "perfectionist/sort-imports": ["error", {
      groups: ["type", ["side-effect", "side-effect-style"]],
    }],
    "sort-imports": "off",
    "import/order": "off",
    "svelte/no-at-html-tags": "off",
    "style/brace-style": ["error", "1tbs"],
  },
});
