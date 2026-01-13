// renderer/codeRenderer.js
// ソースコード表示 + IP / BP / ERROR ハイライト

export function renderCode({
  container,
  source,
  tokens,
  ip,
  breakpoints,
  stopReason,
  errorIp,
}) {
  container.innerHTML = "";

  const lines = source.split("\n");

  lines.forEach((lineText, lineIndex) => {
    const lineEl = document.createElement("div");
    lineEl.className = "code-line";

    /* =========================
     * ガター（BP / 行番号）
     * ========================= */

    const gutter = document.createElement("span");
    gutter.className = "code-gutter";

    const bpEnabled = breakpoints?.has(lineIndex);
    gutter.textContent = bpEnabled ? "●" : "○";
    gutter.dataset.line = lineIndex;

    lineEl.appendChild(gutter);

    /* =========================
     * コード本体
     * ========================= */

    const code = document.createElement("span");
    code.className = "code-text";
    code.textContent = lineText || " ";

    lineEl.appendChild(code);

    /* =========================
     * ハイライト判定
     * ========================= */

    const tokenAtLine = tokens.find(
      (t) => t.sourceLine === lineIndex
    );

    if (tokenAtLine) {
      if (tokenAtLine.ip === ip) {
        lineEl.classList.add("is-ip");
      }

      if (stopReason === "ERROR" && tokenAtLine.ip === errorIp) {
        lineEl.classList.add("is-error");
      }
    }

    container.appendChild(lineEl);
  });
}
