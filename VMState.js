export class VMState {
  memory = new Uint8Array(30000);
  ptr = 0;
  ip = 0;
  tokens = [];
  lastOutput = "";
  ipLine = 0;

  constructor(tokens) {
    this.tokens = tokens;
  }

  static fromTokenizeResult(tokens) {
    return new VMState(tokens);
  }

  step() {
    this.lastOutput = "";
    const token = this.tokens[this.ip];
    if (!token) return "END";

    try {
      switch (token.op) {
        case "ADD":
          this.memory[this.ptr] += token.delta ?? 0;
          break;
        case "MOVE":
          this.ptr += token.delta ?? 0;
          break;
        case "OUTPUT":
          this.lastOutput = String.fromCharCode(this.memory[this.ptr]);
          break;
        case "INPUT":
          break;
        case "LOOP_START":
          if (this.memory[this.ptr] === 0) this.ip = token.jump ?? this.ip;
          break;
        case "LOOP_END":
          if (this.memory[this.ptr] !== 0) this.ip = token.jump ?? this.ip;
          break;
      }
    } catch (e) {
      return "ERROR";
    }

    this.ip++;
    this.ipLine = this.ip; 
    return "RUNNING";
  }
}
