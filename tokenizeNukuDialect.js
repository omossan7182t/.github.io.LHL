import { LanguageRegistry } from "../language/LanguageRegistry.js";

export function tokenizeNukuDialect(src, langId = "nuku") {
  const lang = LanguageRegistry.get(langId);

  const tokens = [];
  const loopStack = [];

  let i = 0;
  let ip = 0;

  while (i < src.length) {
    // === number literal ===
    if (src[i] === "ぬ" && src[i + 1] === "っ") {
      let j = i + 2;
      let count = 1;

      while (src[j] === "っ") {
        count++;
        j++;
      }

      if (src[j] !== "く") {
        return {
          tokens: [],
          error: {
            message: "Invalid number literal",
            ip
          }
        };
      }

      const value = Math.pow(10, count - 1);

      tokens.push({
        op: "NUMBER",
        value,
        ip
      });

      ip++;
      i = j + 1;
      continue;
    }

    // === command ===
    const ch = src[i];
    const cmd = lang.commands[ch];

    if (!cmd) {
      i++;
      continue;
    }

    const token = {
      op: cmd.op,
      delta: cmd.delta,
      ip
    };

    if (cmd.op === "LOOP_START") {
      loopStack.push(ip);
    }

    if (cmd.op === "LOOP_END") {
      if (loopStack.length === 0) {
        return {
          tokens: [],
          error: {
            message: "Unmatched ']'",
            ip
          }
        };
      }
      const startIp = loopStack.pop();
      token.jump = startIp;
      tokens[startIp].jump = ip;
    }

    tokens.push(token);
    ip++;
    i++;
  }

  if (loopStack.length > 0) {
    return {
      tokens: [],
      error: {
        message: "Unmatched '['",
        ip: loopStack[0]
      }
    };
  }

  return { tokens, error: null };
}
