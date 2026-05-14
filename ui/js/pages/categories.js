// ===== Category Management Page =====

import { mockDeviceCategories, mockCropCategories } from '../mock.js';

export function renderCategories() {
  const { $content } = window.$app;
  let currentTab = 'device';

  function render() {
    $content.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title"><i class="fa-solid fa-folder-tree"></i> 分类管理</div>
          <div class="page-actions">
            <button class="btn btn-sm btn-primary" id="cat-add">+ 新增分类</button>
          </div>
        </div>

        <!-- Tab 切换 -->
        <div class="cat-tabs">
          <div class="cat-tab ${currentTab === 'device' ? 'active' : ''}" data-tab="device">设备分类</div>
          <div class="cat-tab ${currentTab === 'crop' ? 'active' : ''}" data-tab="crop">作物分类</div>
        </div>

        ${currentTab === 'device' ? renderDeviceCategories() : renderCropCategories()}
      </div>
    `;

    // Tab 切换
    $content.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentTab = tab.dataset.tab;
        render();
      });
    });

    // 新增
    document.getElementById('cat-add').addEventListener('click', () => {
      if (currentTab === 'device') {
        window.showModal('新增设备分类', `
          <div class="form-group">
            <label class="form-label">分类名称</label>
            <input class="form-input" placeholder="请输入分类名称" />
          </div>
          <div class="form-group">
            <label class="form-label">分类编码</label>
            <input class="form-input" placeholder="如: VALVE" />
          </div>
        `, { showCancel: true, confirmText: '创建' }).then(ok => {
          if (ok) window.showToast('设备分类创建成功（Mock）', 'success');
        });
      } else {
        window.showModal('新增作物分类', `
          <div class="form-group">
            <label class="form-label">分类名称</label>
            <input class="form-input" placeholder="请输入作物分类名称" />
          </div>
          <div class="form-group">
            <label class="form-label">备注</label>
            <input class="form-input" placeholder="请输入备注" />
          </div>
        `, { showCancel: true, confirmText: '创建' }).then(ok => {
          if (ok) window.showToast('作物分类创建成功（Mock）', 'success');
        });
      }
    });

    // 删除绑定
    $content.querySelectorAll('[data-delete-cat]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = btn.dataset.deleteCat;
        const confirmed = await window.showModal('删除确认', `确定要删除分类 <b>${name}</b> 吗？`, { showCancel: true, confirmText: '删除' });
        if (confirmed) window.showToast(`${name} 已删除`, 'warning');
      });
    });
  }

  function renderDeviceCategories() {
    return `
      <div class="card">
        ${mockDeviceCategories.map(c => `
          <div class="cat-tree-item">
            <div>
              <span class="fw-600">${c.name}</span>
              <span style="color:var(--text-muted);margin-left:8px;font-size:11px">${c.code}</span>
              <span style="color:var(--text-secondary);margin-left:8px;font-size:11px">${c.deviceCount}台设备</span>
            </div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-ghost"><i class="fa-solid fa-pen-to-square"></i> 编辑</button>
              <button class="btn btn-sm btn-ghost" style="color:var(--danger)" data-delete-cat="${c.name}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderCropCategories() {
    return `
      <div class="card">
        ${mockCropCategories.map(c => `
          <div class="cat-tree-item">
            <div class="fw-600">${c.name}</div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-ghost"><i class="fa-solid fa-pen-to-square"></i> 编辑</button>
              <button class="btn btn-sm btn-ghost" style="color:var(--danger)" data-delete-cat="${c.name}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
          <div class="cat-tree-children">
            ${(c.children || []).map(child => `
              <div class="cat-tree-item">
                <div>
                  <span style="color:var(--text-secondary)">├</span>
                  <span>${child.name}</span>
                  ${child.remark ? `<span style="color:var(--text-muted);margin-left:6px;font-size:11px">${child.remark}</span>` : ''}
                </div>
                <div style="display:flex;gap:6px">
                  <button class="btn btn-sm btn-ghost"><i class="fa-solid fa-pen-to-square"></i></button>
                  <button class="btn btn-sm btn-ghost" style="color:var(--danger)" data-delete-cat="${child.name}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  render();
}
