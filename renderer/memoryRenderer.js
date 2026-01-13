// renderer/memoryRenderer.js
// メモリパネル（5 × 16 グリッド）描画

export function renderMemoryPanel({
  container,
  memoryViewModel,
  ptr,
}) {
  container.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "memory-grid";

  memoryViewModel.forEach((cell) => {
    const cellEl = document.createElement("div");
    cellEl.className = "memory-cell";

    if (cell.index === ptr) {
      cellEl.classList.add("is-active");
    }

    /* =========================
     * index
     * ========================= */

    const indexEl = document.createElement("div");
    indexEl.className = "memory-index";
    indexEl.textContent = cell.index;

    /* =========================
     * value（コードポイント）
     * ========================= */

    const valueEl = document.createElement("div");
    valueEl.className = "memory-value";
    valueEl.textContent = cell.value;

    /* =========================
     * char（UTF-8 printable）
     * ========================= */

    const charEl = document.createElement("div");
    charEl.className = "memory-char";
    charEl.textContent = cell.char;

    cellEl.appendChild(indexEl);
    cellEl.appendChild(valueEl);
    cellEl.appendChild(charEl);

    grid.appendChild(cellEl);
  });

  container.appendChild(grid);
}
