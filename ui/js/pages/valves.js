// ===== Valve Control Page =====

import { getState, toggleValve } from '../store.js';

export function renderValves() {
  const { $content } = window.$app;

  function render() {
    const state = getState();
    const valves = state.valves || [];

    $content.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title"><i class="fa-solid fa-faucet-drip"></i> 阀门控制</div>
          <div class="page-actions">
            <button class="btn btn-sm btn-ghost" id="valve-open-all"><i class="fa-solid fa-play"></i> 全部开启</button>
            <button class="btn btn-sm btn-danger" id="valve-close-all"><i class="fa-solid fa-stop"></i> 全部关闭</button>
          </div>
        </div>

        <div class="valve-grid">
          ${valves.map(v => `
            <div class="valve-card" data-id="${v.id}">
              <div class="valve-card-header">
                <span class="valve-card-name">${v.name}</span>
                <span class="tag tag-${v.status}">${v.status === 'open' ? '开启' : v.status === 'closed' ? '关闭' : '故障'}</span>
              </div>
              <div class="valve-card-data">
                <div>编号: <span>${v.code}</span></div>
                <div>位置: <span>${v.location}</span></div>
                <div>流量: <span>${v.flow} m³/h</span></div>
                <div>压力: <span>${v.pressure} MPa</span></div>
              </div>
              <div class="valve-card-actions">
                ${v.status !== 'fault' ? `
                  <button class="valve-btn valve-btn-open ${v.status === 'open' ? 'hidden' : ''}" data-action="open" data-id="${v.id}">开启</button>
                  <button class="valve-btn valve-btn-close ${v.status === 'closed' ? 'hidden' : ''}" data-action="close" data-id="${v.id}">关闭</button>
                ` : `<button class="valve-btn valve-btn-close" style="flex:1" disabled><i class="fa-solid fa-triangle-exclamation"></i> 设备故障</button>`}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    $content.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        const valve = valves.find(v => v.id === id);
        if (!valve) return;

        const confirmed = await window.showModal(
          action === 'open' ? '开启阀门' : '关闭阀门',
          `确定要${action === 'open' ? '开启' : '关闭'} <b>${valve.name}</b> (${valve.code}) 吗？`,
          { showCancel: true }
        );

        if (confirmed) {
          toggleValve(id, action === 'open' ? 'open' : 'closed');
          window.showToast(`${valve.name} 已${action === 'open' ? '开启' : '关闭'}`, 'success');
          render();
        }
      });
    });

    document.getElementById('valve-open-all').addEventListener('click', async () => {
      const confirmed = await window.showModal('全部开启', '确定要开启所有阀门吗？此操作将通过 MQTT 发送指令。', { showCancel: true });
      if (confirmed) {
        valves.forEach(v => { if (v.status !== 'fault') toggleValve(v.id, 'open'); });
        window.showToast('已开启所有阀门', 'success');
        render();
      }
    });

    document.getElementById('valve-close-all').addEventListener('click', async () => {
      const confirmed = await window.showModal('全部关闭', '确定要关闭所有阀门吗？', { showCancel: true });
      if (confirmed) {
        valves.forEach(v => { if (v.status !== 'fault') toggleValve(v.id, 'closed'); });
        window.showToast('已关闭所有阀门', 'success');
        render();
      }
    });
  }

  render();
}
