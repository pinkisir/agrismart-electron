// ===== Irrigation Zones Page =====

import { mockIrrigationZones } from '../mock.js';

export function renderZones() {
  const { $content } = window.$app;
  const zones = mockIrrigationZones;

  $content.innerHTML = `
    <div class="fade-in">
      <div class="page-header">
        <div class="page-title"><i class="fa-solid fa-map-location-dot"></i> 灌溉区域</div>
        <div class="page-actions">
          <button class="btn btn-sm btn-primary" id="zone-add">+ 新增区域</button>
        </div>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>区域名称</th>
                <th>面积</th>
                <th>作物</th>
                <th>所属轮灌组</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${zones.map(z => `
                <tr>
                  <td>${z.sortOrder}</td>
                  <td class="fw-600">${z.name}</td>
                  <td>${z.area} 亩</td>
                  <td>${z.cropName}</td>
                  <td><span class="tag tag-info">${z.groupName}</span></td>
                  <td style="color:var(--text-secondary)">${z.remark}</td>
                  <td>
                    <button class="btn btn-sm btn-ghost" data-edit="${z.id}">编辑</button>
                    <button class="btn btn-sm btn-ghost" data-delete="${z.id}" style="color:var(--danger)">删除</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      ${zones.length === 0 ? '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-map-location-dot"></i></div><div class="empty-state-text">暂无灌溉区域</div></div>' : ''}
    </div>
  `;

  // 新增
  document.getElementById('zone-add').addEventListener('click', () => {
    window.showModal('新增灌溉区域', `
      <div class="form-group">
        <label class="form-label">区域名称</label>
        <input class="form-input" placeholder="请输入区域名称" />
      </div>
      <div class="form-group">
        <label class="form-label">面积 (亩)</label>
        <input class="form-input" type="number" placeholder="20" />
      </div>
      <div class="form-group">
        <label class="form-label">种植作物</label>
        <input class="form-input" placeholder="请输入作物名称" />
      </div>
      <div class="form-group">
        <label class="form-label">所属轮灌组</label>
        <select class="form-select">
          <option>A区温室组</option>
          <option>B区温室组</option>
          <option>C区露天组</option>
          <option>D区大棚组</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">排序</label>
        <input class="form-input" type="number" value="${zones.length + 1}" />
      </div>
      <div class="form-group">
        <label class="form-label">备注</label>
        <input class="form-input" placeholder="请输入备注" />
      </div>
    `, { showCancel: true, confirmText: '创建' }).then(ok => {
      if (ok) window.showToast('灌溉区域创建成功（Mock）', 'success');
    });
  });

  // 编辑
  $content.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.edit);
      const zone = zones.find(z => z.id === id);
      window.showModal('编辑灌溉区域', `
        <div class="form-group">
          <label class="form-label">区域名称</label>
          <input class="form-input" value="${zone.name}" />
        </div>
        <div class="form-group">
          <label class="form-label">面积 (亩)</label>
          <input class="form-input" type="number" value="${zone.area}" />
        </div>
        <div class="form-group">
          <label class="form-label">种植作物</label>
          <input class="form-input" value="${zone.cropName}" />
        </div>
        <div class="form-group">
          <label class="form-label">排序</label>
          <input class="form-input" type="number" value="${zone.sortOrder}" />
        </div>
        <div class="form-group">
          <label class="form-label">备注</label>
          <input class="form-input" value="${zone.remark}" />
        </div>
      `, { showCancel: true, confirmText: '保存' }).then(ok => {
        if (ok) window.showToast('灌溉区域已更新（Mock）', 'success');
      });
    });
  });

  // 删除
  $content.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.delete);
      const zone = zones.find(z => z.id === id);
      const confirmed = await window.showModal('删除确认', `确定要删除灌溉区域 <b>${zone.name}</b> 吗？`, { showCancel: true, confirmText: '删除' });
      if (confirmed) {
        window.showToast(`${zone.name} 已删除`, 'warning');
      }
    });
  });
}
