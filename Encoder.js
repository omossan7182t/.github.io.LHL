// Encoder.js
// tokenize 結果を VM 実行用トークン列に変換する
// - number literal を 1 トークンとして保持
// - VM 側では op と value を見るだけで実行可能

export class Encoder {
  /**
   * @param {Array} tokenizeResult.tokens
   * @returns {Array} encoded tokens
   */
  static encode(tokenizeResult) {
    const { tokens } = tokenizeResult;
    const encoded = [];

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];

      switch (t.type) {
        case "COMMAND":
          encoded.push({
            op: t.op,
            delta: t.delta,
            ip: t.ip,
          });
          break;

        case "NUMBER":
          encoded.push({
            op: "NUMBER",
            value: t.value,
            ip: t.ip,
          });
          break;

        default:
          // 将来拡張用（今は来ない）
          throw new Error(`Unknown token type: ${t.type}`);
      }
    }

    return encoded;
  }
}
