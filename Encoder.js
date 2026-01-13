// Encoder.js
// UiLang Encoder
// tokenize 結果 → VM 実行用メモリ（code point 配列）に変換する

export class Encoder {
  constructor(languageRegistry) {
    this.lang = languageRegistry;
  }

  /**
   * エントリポイント
   * @param {TokenizeResult} tokenizeResult
   * @returns {EncodeResult}
   */
  encode(tokenizeResult) {
    const memory = [];
    const sourceMap = []; // memory index -> token index

    const tokens = tokenizeResult.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (this._shouldSkip(token)) {
        continue;
      }

      const beforeLen = memory.length;

      this._encodeToken(token, memory);

      const afterLen = memory.length;
      for (let ip = beforeLen; ip < afterLen; ip++) {
        sourceMap[ip] = i;
      }
    }

    return {
      memory,
      sourceMap,
      memorySize: memory.length
    };
  }

  // -----------------------------------------
  // 内部処理
  // -----------------------------------------

  _shouldSkip(token) {
    switch (token.type) {
      case 'whitespace':
      case 'comment':
        return true;
      default:
        return false;
    }
  }

  _encodeToken(token, memory) {
    switch (token.type) {
      case 'command':
        this._encodeCommand(token, memory);
        break;

      case 'number':
        this._encodeNumberLiteral(token, memory);
        break;

      case 'char':
        this._encodeChar(token, memory);
        break;

      default:
        throw new Error(
          `Encoder: unsupported token type "${token.type}" at ${token.pos}`
        );
    }
  }

  // -----------------------------------------
  // token type 別処理
  // -----------------------------------------

  _encodeCommand(token, memory) {
    const cmd = this.lang.getCommand(token.value);
    if (!cmd) {
      throw new Error(
        `Encoder: unknown command "${token.value}" at ${token.pos}`
      );
    }

    // command は opcode を 1 cell 消費
    memory.push(cmd.opcode);
  }

  _encodeNumberLiteral(token, memory) {
    const value = this._parseNumber(token.value);

    if (!Number.isSafeInteger(value)) {
      throw new Error(
        `Encoder: invalid number literal "${token.value}" at ${token.pos}`
      );
    }

    memory.push(value);
  }

  _encodeChar(token, memory) {
    // 1 文字 = UTF-16 code point
    // UiLang では「そのまま数値」として扱う
    const cp = token.value.codePointAt(0);
    memory.push(cp);
  }

  // -----------------------------------------
  // 数値パーサ
  // -----------------------------------------

  _parseNumber(raw) {
    // 16進
    if (raw.startsWith('0x') || raw.startsWith('0X')) {
      return parseInt(raw.slice(2), 16);
    }

    // 2進
    if (raw.startsWith('0b') || raw.startsWith('0B')) {
      return parseInt(raw.slice(2), 2);
    }

    // 8進
    if (raw.startsWith('0o') || raw.startsWith('0O')) {
      return parseInt(raw.slice(2), 8);
    }

    // 10進
    return parseInt(raw, 10);
  }
}
