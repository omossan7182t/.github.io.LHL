export class VMState {
  memory = new Uint8Array(30000);
  ptr = 0;
  ip = 0;
  tokens = [];

  constructor(tokens) {
    this.tokens = tokens;
    this.buildJumpTable();
  }

  buildJumpTable() {
    const stack = [];

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];

      if (token.op === "LOOP_START") {
        stack.push(i);
      } else if (token.op === "LOOP_END") {
        if (stack.length === 0) {
          throw new Error(`Unmatched LOOP_END at ip=${i}`);
        }
        const start = stack.pop();
        this.tokens[start].jump = i;
        token.jump = start;
      }
    }

    if (stack.length > 0) {
      throw new Error("Unmatched LOOP_START");
    }
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

      case "LOOP_START":
        if (this.memory[this.ptr] === 0) {
          this.ip = token.jump;
        }
        break;

      case "LOOP_END":
        if (this.memory[this.ptr] !== 0) {
          this.ip = token.jump;
        }
        break;
    }

    this.ip++;
    return "RUNNING";
  }
}
