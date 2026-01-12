import { LanguageRegistry } from "./LanguageRegistry.js";

export function tokenizeNukuDialect(src, langId = "nuku") {
  const lang = LanguageRegistry.get(langId);
  const tokens = [];

  for (const ch of src) {
    const cmd = lang.commands[ch];
    if (!cmd) continue;

    tokens.push({
      op: cmd.op,
      delta: cmd.delta,
      char: ch
    });
  }

  // ジャンプテーブル構築
  const loopStack = [];
  tokens.forEach((tok, i) => {
    if (tok.op === "LOOP_START") loopStack.push(i);
    if (tok.op === "LOOP_END") {
      if (loopStack.length === 0) {
        tok.error = "unmatched loop";
      } else {
        const start = loopStack.pop();
        tok.jump = start;
        tokens[start].jump = i;
      }
    }
  });

  if (loopStack.length > 0) {
    loopStack.forEach(i => (tokens[i].error = "unmatched loop"));
  }

  return tokens;
}
