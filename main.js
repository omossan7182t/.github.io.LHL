console.log("main.js loaded");
// ===============================
// main.js
// エントリポイント
// ===============================

// DOM
const codeViewEl = document.getElementById("code-view");
const memoryViewEl = document.getElementById("memory-view");
const statusBarEl = document.getElementById("status-bar");
const errorPanelEl = document.getElementById("error-panel");

const btnRun = document.getElementById("btn-run");
const btnStep = document.getElementById("btn-step");
const btnReset = document.getElementById("btn-reset");

// ===============================
// サンプルコード（暫定）
// ===============================
const initialSource = `
+++++>+++++.<.
`;

// ===============================
// Controller 初期化
// ===============================
const controller = new ExecutionController({
  source: initialSource,
  codeViewEl,
  memoryViewEl,
  statusBarEl,
  errorPanelEl,
});

// ===============================
// 初期描画
// ===============================
controller.reset();

// ===============================
// UI Event bindings
// ===============================
btnRun.addEventListener("click", () => {
  controller.run();
});

btnStep.addEventListener("click", () => {
  controller.step();
});

btnReset.addEventListener("click", () => {
  controller.reset();
});
