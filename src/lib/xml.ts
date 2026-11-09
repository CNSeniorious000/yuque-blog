export function escape(unsafe: unknown) {
  // XML 1.0 forbids control chars except \t \n \r — drop the rest before entity-encoding
  const safe = String(unsafe).split("").filter(char => char === "\n" || char === "\r" || char === "\t" || char >= " ").join("");
  return safe.replace(/[<>&'"]/g, char => `&${({
    "<": "lt",
    ">": "gt",
    "&": "amp",
    "'": "apos",
    "\"": "quot",
  })[char]};`);
};
