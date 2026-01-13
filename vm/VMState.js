// VMState.js
// Brainfuck 系 VM + number literal 対応（LH Language 共通 VM）

/**
 * Token 型（前提）
 * - { type: "command", op: string, delta?: number, jump?: number }
 * - { type: "number", value: number }
 */

export class VMState {
  constructor(tokens) {
    this.tokens = tokens;

    // メモリ
    this.memory = new Uint32Array(30000);
    this.ptr = 0;

    // 実行位置
    this.ip = 0;

    // number literal 用
    this.operandStack = [];

    // デバッグ用
    this.errorIp = null;
  }

  /**
   * step 実行
   * @returns {"RUNNING" | "END" | "ERROR"}
   */
  step() {
    const token = this.tokens[this.ip];

    // --- END ---
    if (!token) {
      return "END";
    }

    // --- NUMBER ---
    if (token.type === "number") {
      this.operandStack.push(token.value);
      this.ip++;
      return "RUNNING";
    }

    // --- COMMAND ---
    try {
      this.execute(token);
    } catch (e) {
      this.errorIp = this.ip;
      console.error(e);
      return "ERROR";
    }

    this.ip++;
    return "RUNNING";
  }

  /**
   * 命令実行
   * @param {object} token
   */
  execute(token) {
    switch (token.op) {
      case "ADD": {
        const v = this._consumeOperand(1);
        this.memory[this.ptr] += v;
        break;
      }

      case "MOVE": {
        const v = this._consumeOperand(1);
        this.ptr += v;
        if (this.ptr < 0) this.ptr = 0;
        if (this.ptr >= this.memory.length) {
          this.ptr = this.memory.length - 1;
        }
        break;
      }

      case "OUTPUT": {
        const cp = this.memory[this.ptr];
        const ch = String.fromCodePoint(cp);
        console.log(ch);
        break;
      }

      case "INPUT": {
        // MVP: 未実装（0 を入れる）
        this.memory[this.ptr] = 0;
        break;
      }

      case "LOOP_START": {
        if (this.memory[this.ptr] === 0) {
          if (token.jump == null) {
            throw new Error("Unmatched LOOP_START");
          }
          this.ip = token.jump;
        }
        break;
      }

      case "LOOP_END": {
        if (this.memory[this.ptr] !== 0) {
          if (token.jump == null) {
            throw new Error("Unmatched LOOP_END");
          }
          this.ip = token.jump;
        }
        break;
      }

      default:
        throw new Error(`Unknown op: ${token.op}`);
    }
  }

  /**
   * number literal 消費
   * @param {number} defaultValue
   */
  _consumeOperand(defaultValue) {
    if (this.operandStack.length === 0) {
      return defaultValue;
    }
    return this.operandStack.pop();
  }
}
