// ===== Project Select Page =====

import { mockProjects } from '../mock.js';
import { selectProject } from '../store.js';
import { navigate } from '../router.js';

export function renderProjectSelect() {
  const { $fullscreen } = window.$app;
  const projects = mockProjects;

  $fullscreen.innerHTML = `
    <div class="project-select fade-in">
      <div class="project-select-title"><i class="fa-solid fa-seedling" style="color:var(--primary);margin-right:4px"></i>选择项目</div>
      <div class="project-select-sub">请选择要进入的农场/大棚项目</div>
      <div class="project-grid">
        ${projects.map(p => `
          <div class="project-card slide-up" data-id="${p.id}">
            <div class="project-card-name">${p.name}</div>
            <div class="project-card-info">
              <div><i class="fa-solid fa-location-dot" style="margin-right:4px"></i>${p.location}</div>
              <div><i class="fa-solid fa-ruler" style="margin-right:4px"></i>${p.area}${p.areaUnit} &nbsp; <i class="fa-solid fa-microchip" style="margin-right:4px"></i>${p.deviceCount}台设备</div>
              <div><i class="fa-solid fa-check" style="color:var(--success);margin-right:4px"></i>在线 ${p.onlineCount}/${p.deviceCount}</div>
              <div style="margin-top:4px;color:var(--text-muted)">${p.description}</div>
            </div>
            <div class="project-card-status">
              <span class="tag tag-${p.status}">${p.status === 'active' ? '运行中' : '已停用'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.project-card').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      const project = projects.find(p => p.id === id);
      if (project) {
        selectProject(project);
        window.showToast('已进入: ' + project.name, 'success');
        navigate('dashboard');
      }
    });
  });
}
