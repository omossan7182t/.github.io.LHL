import { LanguageRegistry } from "./LanguageRegistry.js";

export function tokenizeNukuDialect(src, langId = "nuku") {
  const lang = LanguageRegistry.get(langId);
  const tokens = [];

  for (const ch of src) {
    const cmd = lang.commands[ch];
    if (!cmd) continue;
    tokens.push({ op: cmd.op, delta: cmd.delta });
  }

  // ジャンプテーブル構築
  const loopStack = [];
  tokens.forEach((token, idx) => {
    if (token.op === "LOOP_START") loopStack.push(idx);
    if (token.op === "LOOP_END") {
      if (loopStack.length === 0) token.jump = null; // ERROR later
      else {
        const startIdx = loopStack.pop();
        token.jump = startIdx;
        tokens[startIdx].jump = idx;
      }
    }
  });
  if (loopStack.length > 0) throw new Error("Unmatched loop");

  return tokens;
}
