export class VMState {
  memory = new Uint8Array(30000);
  ptr = 0;
  ip = 0;
  tokens = [];

  constructor(tokens) {
    this.tokens = tokens;
  }

  step() {
    const token = this.tokens[this.ip];
    if (!token) return { state: "END" };

    switch (token.op) {
      case "ADD":
        this.memory[this.ptr] += token.delta ?? 0;
        this.ip++;
        break;

      case "MOVE":
        this.ptr += token.delta ?? 0;
        this.ip++;
        break;

      case "OUTPUT":
        console.log(String.fromCharCode(this.memory[this.ptr]));
        this.ip++;
        break;

      case "INPUT":
        // 未実装
        this.ip++;
        break;

      case "LOOP_START":
        if (this.memory[this.ptr] === 0) {
          this.ip = token.jump + 1;
        } else {
          this.ip++;
        }
        break;

      case "LOOP_END":
        if (this.memory[this.ptr] !== 0) {
          this.ip = token.jump + 1;
        } else {
          this.ip++;
        }
        break;

      default:
        return {
          state: "ERROR",
          message: `Unknown op: ${token.op}`,
          ip: this.ip
        };
    }

    return { state: "RUNNING" };
  }
}
