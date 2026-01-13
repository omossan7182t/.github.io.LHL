function renderErrorMessage(vmState) {
  let panel = document.getElementById('error-panel');

  // 初回のみ生成
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'error-panel';
    panel.style.marginTop = '8px';
    panel.style.padding = '8px';
    panel.style.border = '1px solid #c00';
    panel.style.background = '#200';
    panel.style.color = '#f66';
    panel.style.fontSize = '12px';
    panel.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(panel);
  }

  // ERROR でなければ非表示
  if (vmState.stopReason !== STOP_REASON.ERROR || !vmState.error) {
    panel.style.display = 'none';
    panel.textContent = '';
    return;
  }

  panel.style.display = 'block';

  const msg = [];
  msg.push('ERROR');

  if (typeof vmState.error.ip === 'number') {
    msg.push(`IP: ${vmState.error.ip}`);
  }

  if (vmState.error.message) {
    msg.push(vmState.error.message);
  }

  panel.textContent = msg.join('\n');
}
