// renderMemory.js

export function renderMemoryPanel(vm) {
  const panel = document.getElementById("memory-panel");
  const current = document.getElementById("memory-current");

  const model = vm.getMemoryViewModel(0, 80);

  panel.innerHTML = "";

  model.cells.forEach((cell) => {
    const el = document.createElement("div");
    el.className = "memory-cell";
    el.dataset.addr = cell.addr;

    if (cell.isCurrent) {
      el.classList.add("current");
    }

    el.innerHTML = `
      <div class="mem-addr">${cell.addr}</div>
      <div class="mem-value">${cell.value}</div>
      <div class="mem-char">${cell.char || "·"}</div>
    `;

    panel.appendChild(el);
  });

  // --- 現在セル詳細 ---
  current.innerHTML = `
    <strong>Current Cell</strong><br>
    PTR: ${model.currentPtr}<br>
    VALUE: ${model.currentValue}<br>
    CHAR: ${
      model.currentValue >= 0x20
        ? String.fromCodePoint(model.currentValue)
        : "·"
    }
  `;
}
