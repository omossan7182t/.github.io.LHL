import { LanguageRegistry } from "./LanguageRegistry.js";
import { NukuLanguage } from "./NukuLanguage.js";
import { tokenizeNukuDialect } from "./tokenizeNukuDialect.js";
import { VMState } from "./VMState.js";

LanguageRegistry.register(NukuLanguage);

const codeInput = document.getElementById("codeInput");
const vmOutput = document.getElementById("vmOutput");
const runBtn = document.getElementById("runBtn");
const stepBtn = document.getElementById("stepBtn");
const statusBar = document.getElementById("statusBar");
const langSelect = document.getElementById("langSelect");
const sampleSelect = document.getElementById("sampleSelect");
let vm;

function renderMemory(vm) {
  const panel = document.getElementById("memoryPanel");
  panel.innerHTML = "";
  for (let i = 0; i < 80; i++) {
    const cell = document.createElement("div");
    cell.className = "memory-cell";
    if (i === vm.ptr) cell.classList.add("active");
    const val = vm.memory[i];
    const char = val >= 32 && val <= 126 ? String.fromCharCode(val) : "";
    cell.textContent = `${val}\n${char}`;
    panel.appendChild(cell);
  }
  const current = document.getElementById("currentCell");
  const val = vm.memory[vm.ptr];
  const char = val >= 32 && val <= 126 ? String.fromCharCode(val) : "";
  current.textContent = `Ptr: ${vm.ptr} | Value: ${val} | Char: ${char}`;
}

function loadSample(langId, sampleId) {
  const lang = LanguageRegistry.get(langId);
  const sampleCode = lang.samples[sampleId];
  if (!sampleCode) return;
  codeInput.value = sampleCode;
  const tokens = tokenizeNukuDialect(sampleCode, langId);
  vm = VMState.fromTokenizeResult(tokens);
  renderMemory(vm);
  vmOutput.textContent = "";
  statusBar.textContent = `Loaded sample: ${sampleId}`;
}

window.addEventListener("DOMContentLoaded", () => {
  loadSample("nuku", "helloWorld");
});

runBtn.addEventListener("click", () => {
  let status;
  while ((status = vm.step()) === "RUNNING") {
    vmOutput.textContent += vm.lastOutput;
    renderMemory(vm);
  }
  if (status !== "RUNNING") vmOutput.textContent += `\n[Stopped: ${status}]`;
});

stepBtn.addEventListener("click", () => {
  const status = vm.step();
  vmOutput.textContent += vm.lastOutput;
  renderMemory(vm);
  if (status !== "RUNNING") vmOutput.textContent += `\n[Stopped: ${status}]`;
});
