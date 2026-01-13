/**
 * Encoder
 *
 * AST（token 配列）を target language 向け文字列に変換する
 *
 * 前提：
 * - number literal は token.type === "number"
 * - command は token.type === "command"
 * - negative number は未対応（MVP）
 */

export class Encoder {
  constructor(strategy) {
    this.strategy = strategy;
  }

  /**
   * @param {Array} tokens
   * @returns {string}
   */
  encode(tokens) {
    let out = "";

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      switch (token.type) {
        case "number":
          out += this.encodeNumber(token.value);
          break;

        case "command":
          out += this.encodeCommand(token);
          break;

        default:
          throw new Error(`Unknown token type: ${token.type}`);
      }
    }

    return out;
  }

  encodeNumber(value) {
    if (!Number.isInteger(value)) {
      throw new Error(`number literal must be integer: ${value}`);
    }
    if (value < 0) {
      throw new Error(`negative number is not supported: ${value}`);
    }

    return this.strategy.encodeNumber(value);
  }

  encodeCommand(token) {
    return this.strategy.encodeCommand(token);
  }
}
