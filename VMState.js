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
    if (!token) return "END";

    switch (token.op) {
      case "ADD":
        this.memory[this.ptr] += token.delta ?? 0;
        break;

      case "MOVE":
        this.ptr += token.delta ?? 0;
        break;

      case "OUTPUT":
        console.log(String.fromCharCode(this.memory[this.ptr]));
        break;

      case "INPUT":
        // 未実装
        break;
    }

    this.ip++;
    return "RUNNING";
  }
}
