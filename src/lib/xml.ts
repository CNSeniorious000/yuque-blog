export function escape(unsafe: unknown) {
  // keep exactly the XML 1.0 Char range: #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  const safe = [...String(unsafe)].filter((char) => {
    const c = char.codePointAt(0) ?? 0;
    return c === 0x9 || c === 0xA || c === 0xD || (c >= 0x20 && c <= 0xD7FF) || (c >= 0xE000 && c <= 0xFFFD) || (c >= 0x10000 && c <= 0x10FFFF);
  }).join("");
  return safe.replace(/[<>&'"]/g, char => `&${({
    "<": "lt",
    ">": "gt",
    "&": "amp",
    "'": "apos",
    "\"": "quot",
  })[char]};`);
};
