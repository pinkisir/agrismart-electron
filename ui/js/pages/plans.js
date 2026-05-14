// ===== Irrigation Plans Page =====

import { mockIrrigationPlans } from '../mock.js';

export function renderPlans() {
  const { $content } = window.$app;
  const plans = mockIrrigationPlans;

  $content.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div class="page-title"><i class="fa-solid fa-calendar-check"></i> 灌溉计划</div>
        <div class="page-actions">
          <button class="btn btn-sm btn-primary" id="plan-add">+ 新增计划</button>
        </div>
      </div>

      ${plans.map(p => `
        <div class="list-card">
          <div class="list-card-header">
            <span class="list-card-title">${p.name}</span>
            <span class="tag tag-${p.enabled ? 'enabled' : 'disabled'}">${p.enabled ? '已启用' : '已禁用'}</span>
          </div>
          <div class="list-card-meta">
            <span><i class="fa-solid fa-users-gear"></i> ${p.groupName}</span>
            <span><i class="fa-solid fa-clock"></i> ${p.cronDesc}</span>
            <span><i class="fa-solid fa-hourglass-half"></i> ${p.duration}${p.unit}</span>
          </div>
          <div class="list-card-meta" style="margin-top:2px">
            <span>上次执行: ${p.lastRun}</span>
            <span>下次执行: ${p.nextRun}</span>
          </div>
          <div class="list-card-actions">
            <label class="toggle">
              <input type="checkbox" ${p.enabled ? 'checked' : ''} data-toggle="${p.id}" />
              <span class="toggle-slider"></span>
            </label>
            <button class="btn btn-sm btn-ghost" data-edit="${p.id}"><i class="fa-solid fa-pen-to-square"></i> 编辑</button>
            <button class="btn btn-sm btn-ghost" data-delete="${p.id}"><i class="fa-solid fa-trash-can"></i> 删除</button>
            ${p.enabled ? `<button class="btn btn-sm btn-accent" data-run="${p.id}"><i class="fa-solid fa-play"></i> 立即执行</button>` : ''}
          </div>
        </div>
      `).join('')}

      ${plans.length === 0 ? '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-calendar-check"></i></div><div class="empty-state-text">暂无灌溉计划</div></div>' : ''}
    </div>
  `;

  // 启用/禁用切换
  $content.querySelectorAll('[data-toggle]').forEach(toggle => {
    toggle.addEventListener('change', async () => {
      const id = parseInt(toggle.dataset.toggle);
      const plan = plans.find(p => p.id === id);
      const action = toggle.checked ? '启用' : '禁用';
      const confirmed = await window.showModal(
        `${action}计划`,
        `确定要${action}灌溉计划 <b>${plan.name}</b> 吗？`,
        { showCancel: true }
      );
      if (!confirmed) {
        toggle.checked = !toggle.checked; // 恢复
      } else {
        window.showToast(`${plan.name} 已${action}`, 'success');
      }
    });
  });

  // 立即执行
  $content.querySelectorAll('[data-run]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.run);
      const plan = plans.find(p => p.id === id);
      const confirmed = await window.showModal('立即执行', `确定要立即执行灌溉计划 <b>${plan.name}</b> 吗？`, { showCancel: true });
      if (confirmed) {
        window.showToast(`${plan.name} 开始执行`, 'success');
      }
    });
  });

  // 删除
  $content.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.delete);
      const plan = plans.find(p => p.id === id);
      const confirmed = await window.showModal('删除确认', `确定要删除灌溉计划 <b>${plan.name}</b> 吗？`, { showCancel: true, confirmText: '删除' });
      if (confirmed) {
        window.showToast(`${plan.name} 已删除`, 'warning');
      }
    });
  });

  // 新增
  document.getElementById('plan-add').addEventListener('click', () => {
    window.showModal('新增灌溉计划', `
      <div class="form-group">
        <label class="form-label">计划名称</label>
        <input class="form-input" placeholder="请输入计划名称" />
      </div>
      <div class="form-group">
        <label class="form-label">关联轮灌组</label>
        <select class="form-select">
          <option>A区温室组</option>
          <option>B区温室组</option>
          <option>C区露天组</option>
          <option>D区大棚组</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">执行时间</label>
        <input class="form-input" placeholder="如: 每天 06:00" />
      </div>
      <div class="form-group">
        <label class="form-label">灌溉时长 (分钟)</label>
        <input class="form-input" type="number" placeholder="30" />
      </div>
    `, { showCancel: true, confirmText: '创建' }).then(ok => {
      if (ok) window.showToast('灌溉计划创建成功（Mock）', 'success');
    });
  });

  // 编辑
  $content.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.edit);
      const plan = plans.find(p => p.id === id);
      window.showModal('编辑灌溉计划', `
        <div class="form-group">
          <label class="form-label">计划名称</label>
          <input class="form-input" value="${plan.name}" />
        </div>
        <div class="form-group">
          <label class="form-label">关联轮灌组</label>
          <select class="form-select">
            <option ${plan.groupId === 1 ? 'selected' : ''}>A区温室组</option>
            <option ${plan.groupId === 2 ? 'selected' : ''}>B区温室组</option>
            <option ${plan.groupId === 3 ? 'selected' : ''}>C区露天组</option>
            <option ${plan.groupId === 4 ? 'selected' : ''}>D区大棚组</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">灌溉时长 (分钟)</label>
          <input class="form-input" type="number" value="${plan.duration}" />
        </div>
      `, { showCancel: true, confirmText: '保存' }).then(ok => {
        if (ok) window.showToast('灌溉计划已更新（Mock）', 'success');
      });
    });
  });
}
