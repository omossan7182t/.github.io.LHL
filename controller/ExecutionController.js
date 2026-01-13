// ExecutionController.js
// VMState を制御し、Run / Step / BP / ERROR / END を統合管理する

export class ExecutionController {
  constructor(vmState, options = {}) {
    this.vm = vmState;

    // 実行状態
    this.stopReason = "END"; // RUN | STEP | BP | ERROR | END
    this.running = false;

    // ブレークポイント
    this.breakpoints = new Set();

    // Run 再開時に最初の BP を 1 回無視するオプション
    this.ignoreFirstBp = false;

    // エラー情報
    this.error = null;

    // 実行履歴（直前命令）
    this.lastExecutedIp = null;

    // 描画フック
    this.onUpdate = options.onUpdate || (() => {});
  }

  /* ==========
   * Breakpoint
   * ========== */

  toggleBreakpoint(ip) {
    if (this.breakpoints.has(ip)) {
      this.breakpoints.delete(ip);
    } else {
      this.breakpoints.add(ip);
    }
    this.onUpdate();
  }

  hasBreakpoint(ip) {
    return this.breakpoints.has(ip);
  }

  /* ==========
   * Control
   * ========== */

  reset(vmState) {
    this.vm = vmState;
    this.stopReason = "END";
    this.running = false;
    this.error = null;
    this.lastExecutedIp = null;
    this.onUpdate();
  }

  step() {
    if (this.stopReason === "ERROR" || this.stopReason === "END") {
      return;
    }

    this.lastExecutedIp = this.vm.ip;

    const result = this.vm.step();

    if (result === "ERROR") {
      this.stopReason = "ERROR";
      this.error = this.vm.error || { message: "Unknown VM error" };
      this.running = false;
    } else if (result === "END") {
      this.stopReason = "END";
      this.running = false;
    } else {
      this.stopReason = "STEP";
    }

    this.onUpdate();
  }

  run() {
    if (this.running) return;

    this.running = true;
    this.stopReason = "RUN";

    const loop = () => {
      if (!this.running) return;

      // BP 判定（実行前）
      if (this.hasBreakpoint(this.vm.ip)) {
        if (this.ignoreFirstBp) {
          this.ignoreFirstBp = false;
        } else {
          this.stopReason = "BP";
          this.running = false;
          this.onUpdate();
          return;
        }
      }

      this.lastExecutedIp = this.vm.ip;

      const result = this.vm.step();

      if (result === "ERROR") {
        this.stopReason = "ERROR";
        this.error = this.vm.error || { message: "Unknown VM error" };
        this.running = false;
        this.onUpdate();
        return;
      }

      if (result === "END") {
        this.stopReason = "END";
        this.running = false;
        this.onUpdate();
        return;
      }

      // 継続
      this.onUpdate();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    this.onUpdate();
  }

  runIgnoreFirstBreakpoint() {
    this.ignoreFirstBp = true;
    this.run();
  }

  /* ==========
   * View helpers
   * ========== */

  getStatus() {
    return {
      stopReason: this.stopReason,
      ip: this.vm.ip,
      ptr: this.vm.ptr,
      pendingCount: this.vm.pendingCount ?? 0,
      running: this.running,
    };
  }
}
