export function escape(unsafe: unknown) {
  return String(unsafe).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/[<>&'"]/g, char => `&${({
    "<": "lt",
    ">": "gt",
    "&": "amp",
    "'": "apos",
    "\"": "quot",
  })[char]};`);
};
