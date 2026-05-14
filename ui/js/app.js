// ===== App Entry =====

import { getState, setState, subscribe, logout, toggleTheme, initTheme } from './store.js';
import { registerRoute, navigate, startRouter, renderPage } from './router.js';
import { mockValves, mockAlerts, mockProjects } from './mock.js';

// 页面模块
import { renderLogin } from './pages/login.js';
import { renderProjectSelect } from './pages/project-select.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderDevices } from './pages/devices.js';
import { renderValves } from './pages/valves.js';
import { renderGroups } from './pages/groups.js';
import { renderPlans } from './pages/plans.js';
import { renderZones } from './pages/zones.js';
import { renderCategories } from './pages/categories.js';

// 注册路由
registerRoute('login', renderLogin);
registerRoute('project-select', renderProjectSelect);
registerRoute('dashboard', renderDashboard);
registerRoute('devices', renderDevices);
registerRoute('valves', renderValves);
registerRoute('groups', renderGroups);
registerRoute('plans', renderPlans);
registerRoute('zones', renderZones);
registerRoute('categories', renderCategories);

// DOM
const $app = document.getElementById('app');
const $fullscreen = document.getElementById('fullscreen-page');
const $content = document.getElementById('content');
const $topbarProject = document.getElementById('topbar-project');
const $topbarTime = document.getElementById('topbar-time');
const $topbarUser = document.getElementById('topbar-user');
const $alertCount = document.getElementById('alert-count');
const $btnLogout = document.getElementById('btn-logout');
const $btnTheme = document.getElementById('btn-theme');
const $themeIcon = document.getElementById('theme-icon');
const $btnProjectSwitch = document.getElementById('btn-project-switch');
const $projectDropdown = document.getElementById('project-dropdown');

// 时钟
function updateClock() {
    const now = new Date();
    $topbarTime.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}
setInterval(updateClock, 10000);
updateClock();

// 主题图标更新
function updateThemeIcon(theme) {
    $themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// 状态变化 → UI 更新
subscribe((state) => {
    const isFullscreen = state.currentPage === 'login' || state.currentPage === 'project-select';

    if (isFullscreen) {
        $app.classList.add('hidden');
        $fullscreen.classList.remove('hidden');
    } else {
        $app.classList.remove('hidden');
        $fullscreen.classList.add('hidden');
        $topbarProject.textContent = state.project ? state.project.name : '未选择项目';
        $topbarUser.textContent = state.user ? state.user.name : '--';

        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.page === state.currentPage);
        });
    }

    // 告警数
    const unread = (state.alerts || []).filter(a => !a.read).length;
    $alertCount.textContent = unread;
    $alertCount.classList.toggle('show', unread > 0);

    // 主题图标
    updateThemeIcon(state.theme);
});

// 侧边栏导航
document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
});

// 退出
$btnLogout.addEventListener('click', () => { logout(); navigate('login'); });

// 告警
document.getElementById('topbar-alert').addEventListener('click', () => navigate('dashboard'));

// 主题切换
$btnTheme.addEventListener('click', () => toggleTheme());

// 项目切换下拉
let dropdownOpen = false;
$btnProjectSwitch.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownOpen = !dropdownOpen;
    if (dropdownOpen) {
        renderProjectDropdown();
        $projectDropdown.classList.add('show');
    } else {
        $projectDropdown.classList.remove('show');
    }
});

document.addEventListener('click', () => {
    if (dropdownOpen) { dropdownOpen = false; $projectDropdown.classList.remove('show'); }
});

$projectDropdown.addEventListener('click', (e) => e.stopPropagation());

function renderProjectDropdown() {
    const state = getState();
    $projectDropdown.innerHTML = mockProjects.map(p => `
    <div class="project-dropdown-item ${state.project && state.project.id === p.id ? 'active' : ''}" data-project-id="${p.id}">
      <span><i class="fa-solid fa-location-dot" style="font-size:10px;margin-right:4px"></i>${p.name}</span>
      ${state.project && state.project.id === p.id ? '<i class="fa-solid fa-check" style="font-size:10px"></i>' : ''}
    </div>
  `).join('') + `
    <div class="project-dropdown-divider"></div>
    <div class="project-dropdown-switch" id="dropdown-switch-project">
      <i class="fa-solid fa-arrows-rotate" style="font-size:10px;margin-right:4px"></i>切换项目...
    </div>
  `;

    $projectDropdown.querySelectorAll('[data-project-id]').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.projectId);
            const project = mockProjects.find(p => p.id === id);
            if (project) {
                import('./store.js').then(m => m.selectProject(project));
                window.showToast('已切换到: ' + project.name, 'success');
                dropdownOpen = false;
                $projectDropdown.classList.remove('show');
                navigate('dashboard');
            }
        });
    });

    const switchBtn = document.getElementById('dropdown-switch-project');
    if (switchBtn) {
        switchBtn.addEventListener('click', () => {
            dropdownOpen = false;
            $projectDropdown.classList.remove('show');
            navigate('project-select');
        });
    }
}

// Toast 通知 (居中上方)
window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const iconMap = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = `<i class="fa-solid ${iconMap[type] || iconMap.info}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
};

// Modal
window.showModal = function (title, bodyHtml, opts = {}) {
    const $overlay = document.getElementById('modal-overlay');
    const $title = document.getElementById('modal-title');
    const $body = document.getElementById('modal-body');
    const $confirm = document.getElementById('modal-confirm');
    const $cancel = document.getElementById('modal-cancel');

    $title.textContent = title;
    $body.innerHTML = bodyHtml;
    $overlay.classList.add('show');

    $cancel.style.display = opts.showCancel ? '' : 'none';
    $confirm.textContent = opts.confirmText || '确定';
    $cancel.textContent = opts.cancelText || '取消';

    return new Promise((resolve) => {
        const cleanup = () => {
            $overlay.classList.remove('show');
            $confirm.replaceWith($confirm.cloneNode(true));
            $cancel.replaceWith($cancel.cloneNode(true));
            document.getElementById('modal-close').replaceWith(document.getElementById('modal-close').cloneNode(true));
        };
        document.getElementById('modal-confirm').addEventListener('click', () => { cleanup(); resolve(true); });
        document.getElementById('modal-cancel').addEventListener('click', () => { cleanup(); resolve(false); });
        document.getElementById('modal-close').addEventListener('click', () => { cleanup(); resolve(false); });
    });
};

// 初始化
initTheme();
setState({ valves: [...mockValves], alerts: [...mockAlerts] });
window.$app = { $content, $fullscreen, navigate, getState, setState };
startRouter();
navigate('login');
