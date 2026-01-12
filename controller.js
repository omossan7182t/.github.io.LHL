export class ExecutionController {
  constructor(vm) {
    this.vm = vm;
    this.stopReason = "RUNNING";
    this.breakpoints = new Set();
    this.ignoreFirstBp = false;
    this.warnings = [];
    this.debugMode = false;
  }

  step() {
    if (this.breakpoints.has(this.vm.ip) && !(this.ignoreFirstBp && this.vm.ip === 0)) {
      this.stopReason = "BP";
      return;
    }

    const status = this.vm.step();
    if (status === "ERROR") this.stopReason = "ERROR";
    else if (status === "END") this.stopReason = "END";
    else this.stopReason = "RUNNING";
  }
}
