// ExecutionController.js
// VMState を制御し、Run / Step / BP / ERROR / END を統合管理する

class ExecutionController {
  constructor({
    source,
    codeViewEl,
    memoryViewEl,
    statusBarEl,
    errorPanelEl,
  }) {
    this.source = source;

    // DOM
    this.codeViewEl = codeViewEl;
    this.memoryViewEl = memoryViewEl;
    this.statusBarEl = statusBarEl;
    this.errorPanelEl = errorPanelEl;

    // VM
    this.vm = null;

    // 実行状態
    this.stopReason = "END"; // RUN | STEP | BP | ERROR | END
    this.running = false;

    // BP
    this.breakpoints = new Set();
    this.ignoreFirstBp = false;

    // エラー
    this.error = null;
    this.lastExecutedIp = null;
  }

  /* ==========
   * 初期化
   * ========== */

  reset() {
    // tokenize → VMState 作成
    const tokens = tokenizeNukuDialect(this.source);
    this.vm = new VMState(tokens);

    this.stopReason = "END";
    this.running = false;
    this.error = null;
    this.lastExecutedIp = null;

    this.render();
  }

  /* ==========
   * 実行制御
   * ========== */

  step() {
    if (!this.vm) return;
    if (this.stopReason === "ERROR" || this.stopReason === "END") return;

    this.lastExecutedIp = this.vm.ip;
    const result = this.vm.step();

    if (result === "ERROR") {
      this.stopReason = "ERROR";
      this.error = this.vm.error || { message: "VM Error" };
      this.running = false;
    } else if (result === "END") {
      this.stopReason = "END";
      this.running = false;
    } else {
      this.stopReason = "STEP";
    }

    this.render();
  }

  run() {
    if (!this.vm || this.running) return;

    this.running = true;
    this.stopReason = "RUN";

    const loop = () => {
      if (!this.running) return;

      // BP
      if (this.breakpoints.has(this.vm.ip)) {
        if (this.ignoreFirstBp) {
          this.ignoreFirstBp = false;
        } else {
          this.stopReason = "BP";
          this.running = false;
          this.render();
          return;
        }
      }

      this.lastExecutedIp = this.vm.ip;
      const result = this.vm.step();

      if (result === "ERROR") {
        this.stopReason = "ERROR";
        this.error = this.vm.error || { message: "VM Error" };
        this.running = false;
        this.render();
        return;
      }

      if (result === "END") {
        this.stopReason = "END";
        this.running = false;
        this.render();
        return;
      }

      this.render();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  /* ==========
   * 描画
   * ========== */

  render() {
    renderCode(this.codeViewEl, this.vm, {
      breakpoints: this.breakpoints,
      errorIp: this.stopReason === "ERROR" ? this.vm.ip : null,
    });

    renderMemoryPanel(this.memoryViewEl, this.vm);
    renderStatusBar(this.statusBarEl, {
      stopReason: this.stopReason,
      ip: this.vm.ip,
      ptr: this.vm.ptr,
      pendingCount: this.vm.pendingCount ?? 0,
    });

    renderErrorMessage(this.errorPanelEl, this.error);
  }
}

window.ExecutionController = ExecutionController;
