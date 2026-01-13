// main.js
// アプリ全体のエントリポイント
// UI 初期化 / Language 登録 / Run・Step 制御 / 各 Renderer 連携

import { LanguageRegistry } from "./language/LanguageRegistry.js";
import { NukuLanguage } from "./language/NukuLanguage.js";

import { tokenizeNukuDialect } from "./tokenizer/tokenizeNukuDialect.js";
import { VMState } from "./vm/VMState.js";
import { ExecutionController } from "./controller/ExecutionController.js";

import { renderCode } from "./renderer/codeRenderer.js";
import { renderMemoryPanel } from "./renderer/memoryRenderer.js";
import { renderStatusBar } from "./renderer/statusBarRenderer.js";
import { renderErrorMessage } from "./renderer/errorRenderer.js";

/* =========================
 * DOM 取得
 * ========================= */

const codeTextarea = document.getElementById("code");
const runButton = document.getElementById("runBtn");
const stepButton = document.getElementById("stepBtn");

const codeView = document.getElementById("codeView");
const memoryPanel = document.getElementById("memoryPanel");
const statusBar = document.getElementById("statusBar");
const errorBox = document.getElementById("errorBox");

/* =========================
 * Language 初期化
 * ========================= */

LanguageRegistry.register(NukuLanguage);

// 現状は固定（将来プルダウン対応）
let currentLanguageId = "nuku";

/* =========================
 * Controller
 * ========================= */

let controller = null;

/* =========================
 * 初期ロード
 * ========================= */

initialize();

function initialize() {
  const src = codeTextarea.value || "";
  rebuildController(src);
  renderAll();
}

/* =========================
 * Controller 再構築
 * ========================= */

function rebuildController(src) {
  try {
    const tokenizeResult = tokenizeNukuDialect(src, currentLanguageId);
    const vm = VMState.fromTokenizeResult(tokenizeResult);
    controller = new ExecutionController(vm);
  } catch (err) {
    controller = null;
    renderErrorMessage({
      container: errorBox,
      stopReason: "ERROR",
      error: err,
    });
  }
}

/* =========================
 * Run / Step
 * ========================= */

runButton.addEventListener("click", () => {
  if (!controller) return;

  controller.run(() => {
    renderAll();
  });
});

stepButton.addEventListener("click", () => {
  if (!controller) return;

  controller.step();
  renderAll();
});

/* =========================
 * レンダリング統合
 * ========================= */

function renderAll() {
  if (!controller) return;

  const execState = controller.getExecutionState();
  const vm = execState.vm;

  renderCode({
    container: codeView,
    source: codeTextarea.value,
    tokens: vm.tokens,
    ip: vm.ip,
    breakpoints: execState.breakpoints,
    stopReason: execState.stopReason,
    errorIp: execState.errorIp,
  });

  renderMemoryPanel({
    container: memoryPanel,
    memoryViewModel: vm.getMemoryViewModel(),
    ptr: vm.ptr,
  });

  renderStatusBar({
    container: statusBar,
    stopReason: execState.stopReason,
    ip: vm.ip,
    ptr: vm.ptr,
    pendingCount: vm.pendingCount,
  });

  renderErrorMessage({
    container: errorBox,
    stopReason: execState.stopReason,
    error: execState.error,
  });
}

/* =========================
 * コード編集時
 * ========================= */

codeTextarea.addEventListener("input", () => {
  rebuildController(codeTextarea.value);
  renderAll();
});
