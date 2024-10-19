export function escape(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, char => `&${({
    "<": "lt",
    ">": "gt",
    "&": "amp",
    "'": "apos",
    "\"": "quot",
  })[char]};`);
};
