// errorRenderer.js
// 実行時 ERROR を UI に描画する簡易レンダラ
// ・ERROR 停止時のみ表示
// ・STOP_REASON が ERROR 以外なら非表示
// ・詳細なエラー分類やコード化は行わない（仕様通り）

export function renderErrorMessage({
  container,
  stopReason,
  error,
}) {
  if (!container) return;

  // ERROR 以外では何も表示しない
  if (stopReason !== "ERROR" || !error) {
    container.textContent = "";
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  container.textContent = buildMessage(error);
}

function buildMessage(error) {
  // error は VM 側 or tokenize 側で生成されたオブジェクトを想定
  // 想定構造：
  // {
  //   message: string,
  //   ip?: number,
  //   token?: object
  // }

  if (typeof error === "string") {
    return `ERROR: ${error}`;
  }

  if (!error || !error.message) {
    return "ERROR: Unknown error";
  }

  let msg = `ERROR: ${error.message}`;

  if (typeof error.ip === "number") {
    msg += ` (IP: ${error.ip})`;
  }

  return msg;
}
