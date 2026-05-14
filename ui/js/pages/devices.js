// ===== Device Management Page =====

import { mockDevices, mockDeviceCategories } from '../mock.js';

export function renderDevices() {
  const { $content } = window.$app;
  const categories = [{ id: 0, name: '全部' }, ...mockDeviceCategories];
  let currentFilter = 0;

  function render(filterId) {
    currentFilter = filterId;
    const filtered = filterId === 0 ? mockDevices : mockDevices.filter(d => d.categoryId === filterId);

    $content.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-title"><i class="fa-solid fa-microchip"></i> 设备管理</div>
        </div>
        <div class="device-filters">
          ${categories.map(c => `
            <button class="filter-btn ${c.id === currentFilter ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>
          `).join('')}
        </div>
        <div class="card">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>设备名称</th><th>编号</th><th>分类</th><th>位置</th><th>状态</th><th>信号</th><th>固件版本</th><th>最后在线</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(d => `
                  <tr>
                    <td class="fw-600">${d.name}</td>
                    <td>${d.code}</td>
                    <td>${d.categoryName}</td>
                    <td>${d.location}</td>
                    <td><span class="tag tag-${d.status}">${d.status === 'online' ? '在线' : d.status === 'offline' ? '离线' : '故障'}</span></td>
                    <td>${d.signal > 0 ? d.signal + '%' : '--'}</td>
                    <td>${d.firmwareVersion}</td>
                    <td style="font-size:11px;color:var(--text-secondary)">${d.lastOnline}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${filtered.length === 0 ? '<div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-microchip"></i></div><div>该分类下暂无设备</div></div>' : ''}
        </div>
      </div>
    `;

    $content.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => render(parseInt(btn.dataset.cat)));
    });
  }

  render(0);
}
