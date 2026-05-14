// ===== Irrigation Groups Page =====

import { mockIrrigationGroups } from '../mock.js';

export function renderGroups() {
  const { $content } = window.$app;
  const groups = mockIrrigationGroups;

  $content.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div class="page-title"><i class="fa-solid fa-users-gear"></i> 轮灌组管理</div>
        <div class="page-actions">
          <button class="btn btn-sm btn-primary" id="group-add">+ 新增轮灌组</button>
        </div>
      </div>

      ${groups.map(g => `
        <div class="list-card">
          <div class="list-card-header">
            <span class="list-card-title">${g.name}</span>
            <span class="tag tag-${g.status}">${g.status === 'running' ? '灌溉中' : '空闲'}</span>
          </div>
          <div class="list-card-meta">
            <span><i class="fa-solid fa-tag"></i> ${g.remark}</span>
            <span><i class="fa-solid fa-faucet-drip"></i> ${g.valveNames.length}个阀门</span>
            <span><i class="fa-solid fa-clock"></i> 灌溉时长 ${g.duration}${g.unit}</span>
            <span><i class="fa-regular fa-calendar"></i> 创建于 ${g.createTime}</span>
          </div>
          <div style="margin-top:6px; font-size:11px; color:var(--text-secondary)">
            阀门: ${g.valveNames.join('、')}
          </div>
          <div class="list-card-actions">
            ${g.status === 'idle' ? `
              <button class="btn btn-sm btn-primary" data-start="${g.id}"><i class="fa-solid fa-play"></i> 开始灌溉</button>
            ` : `
              <button class="btn btn-sm btn-danger" data-stop="${g.id}"><i class="fa-solid fa-stop"></i> 停止灌溉</button>
            `}
            <button class="btn btn-sm btn-ghost" data-edit="${g.id}"><i class="fa-solid fa-pen-to-square"></i> 编辑</button>
            <button class="btn btn-sm btn-ghost" data-delete="${g.id}"><i class="fa-solid fa-trash-can"></i> 删除</button>
          </div>
        </div>
      `).join('')}

      ${groups.length === 0 ? '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-users-gear"></i></div><div class="empty-state-text">暂无轮灌组</div></div>' : ''}
    </div>
  `;

  // 开始灌溉
  $content.querySelectorAll('[data-start]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.start);
      const group = groups.find(g => g.id === id);
      const confirmed = await window.showModal('开始灌溉', `确定要启动轮灌组 <b>${group.name}</b> 吗？<br/>灌溉时长: ${group.duration}${group.unit}`, { showCancel: true });
      if (confirmed) {
        window.showToast(`${group.name} 已开始灌溉`, 'success');
        renderGroups();
      }
    });
  });

  // 停止灌溉
  $content.querySelectorAll('[data-stop]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.stop);
      const group = groups.find(g => g.id === id);
      const confirmed = await window.showModal('停止灌溉', `确定要停止轮灌组 <b>${group.name}</b> 吗？`, { showCancel: true });
      if (confirmed) {
        window.showToast(`${group.name} 已停止灌溉`, 'success');
        renderGroups();
      }
    });
  });

  // 删除
  $content.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.delete);
      const group = groups.find(g => g.id === id);
      const confirmed = await window.showModal('删除确认', `确定要删除轮灌组 <b>${group.name}</b> 吗？此操作不可恢复。`, { showCancel: true, confirmText: '删除' });
      if (confirmed) {
        window.showToast(`${group.name} 已删除`, 'warning');
      }
    });
  });

  // 新增
  document.getElementById('group-add').addEventListener('click', () => {
    window.showModal('新增轮灌组', `
      <div class="form-group">
        <label class="form-label">组名称</label>
        <input class="form-input" placeholder="请输入轮灌组名称" />
      </div>
      <div class="form-group">
        <label class="form-label">灌溉时长 (分钟)</label>
        <input class="form-input" type="number" placeholder="30" />
      </div>
      <div class="form-group">
        <label class="form-label">备注</label>
        <input class="form-input" placeholder="请输入备注" />
      </div>
    `, { showCancel: true, confirmText: '创建' }).then(ok => {
      if (ok) window.showToast('轮灌组创建成功（Mock）', 'success');
    });
  });

  // 编辑
  $content.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.edit);
      const group = groups.find(g => g.id === id);
      window.showModal('编辑轮灌组', `
        <div class="form-group">
          <label class="form-label">组名称</label>
          <input class="form-input" value="${group.name}" />
        </div>
        <div class="form-group">
          <label class="form-label">灌溉时长 (分钟)</label>
          <input class="form-input" type="number" value="${group.duration}" />
        </div>
        <div class="form-group">
          <label class="form-label">备注</label>
          <input class="form-input" value="${group.remark}" />
        </div>
      `, { showCancel: true, confirmText: '保存' }).then(ok => {
        if (ok) window.showToast('轮灌组已更新（Mock）', 'success');
      });
    });
  });
}
