import { LanguageRegistry } from "./language/LanguageRegistry.js";
import { NukuLanguage } from "./language/NukuLanguage.js";
import { tokenizeNukuDialect } from "./tokenize/tokenizeNukuDialect.js";
import { VMState } from "./vm/VMState.js";

/**
 * =========================
 * Language registration
 * =========================
 */
LanguageRegistry.register(NukuLanguage);

/**
 * =========================
 * DOM elements
 * =========================
 */
const editor = document.getElementById("code-editor");
const output = document.getElementById("output");
const memoryGrid = document.getElementById("memory-grid");
const modeIndicator = document.getElementById("mode-indicator");

/**
 * =========================
 * State
 * =========================
 */
let vm = null;
let runState = "IDLE"; // IDLE | RUNNING | END | ERROR

/**
 * =========================
 * Initial state
 * =========================
 */
editor.value = "";
output.textContent = "";
modeIndicator.textContent = "Mode: Normal";

/**
 * =========================
 * Memory rendering
 * =========================
 */
function renderMemory(vm) {
  memoryGrid.innerHTML = "";

  // 最初の 80 メモリ（16 × 5）
  for (let i = 0; i < 80; i++) {
    const cell = document.createElement("div");
    cell.className = "memory-cell";

    if (i === vm.ptr) {
      cell.classList.add("memory-cell--active");
    }

    const value = vm.memory[i];
    cell.textContent = `${i}:${value}`;

    memoryGrid.appendChild(cell);
  }
}

/**
 * =========================
 * Output helper
 * =========================
 */
function appendOutput(ch) {
  output.textContent += ch;
}

/**
 * =========================
 * Run execution
 * =========================
 */
window.run = () => {
  output.textContent = "";
  modeIndicator.textContent = "Mode: Run";

  const result = tokenizeNukuDialect(editor.value);

  if (result.error) {
    runState = "ERROR";
    modeIndicator.textContent = "Mode: Error";
    alert(
      `ERROR: ${result.error.message}\n` +
      `at instruction ip=${result.error.ip}`
    );
    return;
  }

  vm = new VMState(result.tokens);
  runState = "RUNNING";

  while (runState === "RUNNING") {
    const stepResult = vm.step();

    if (stepResult.state === "RUNNING") {
      continue;
    }

    if (stepResult.state === "END") {
      runState = "END";
      modeIndicator.textContent = "Mode: End";
      break;
    }

    if (stepResult.state === "ERROR") {
      runState = "ERROR";
      modeIndicator.textContent = "Mode: Error";
      alert(
        `RUNTIME ERROR: ${stepResult.message}\n` +
        `at instruction ip=${stepResult.ip}`
      );
      break;
    }
  }

  renderMemory(vm);
};

/**
 * =========================
 * Step execution (for future UI)
 * =========================
 */
window.step = () => {
  if (!vm) {
    const result = tokenizeNukuDialect(editor.value);
    if (result.error) {
      alert(
        `ERROR: ${result.error.message}\n` +
        `at instruction ip=${result.error.ip}`
      );
      return;
    }
    vm = new VMState(result.tokens);
    runState = "RUNNING";
    modeIndicator.textContent = "Mode: Step";
  }

  const stepResult = vm.step();

  if (stepResult.state === "END") {
    runState = "END";
    modeIndicator.textContent = "Mode: End";
  }

  if (stepResult.state === "ERROR") {
    runState = "ERROR";
    modeIndicator.textContent = "Mode: Error";
    alert(
      `RUNTIME ERROR: ${stepResult.message}\n` +
      `at instruction ip=${stepResult.ip}`
    );
  }

  renderMemory(vm);
};
