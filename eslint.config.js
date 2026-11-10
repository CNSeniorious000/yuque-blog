import antfu from "@antfu/eslint-config";

export default antfu({
  formatters: true,
  typescript: true,
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
    // Url/Link render arbitrary markdown hrefs — resolve() would mangle external URLs
    "svelte/no-navigation-without-resolve": "off",
    // each blocks here iterate static lists with no natural unique keys, and index keys are worse
    "svelte/require-each-key": "off",
    "style/brace-style": ["error", "1tbs"],
  },
});
