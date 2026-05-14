// ===== Dashboard Page =====

import { mockDevices } from '../mock.js';
import { getState } from '../store.js';
import { navigate } from '../router.js';

export function renderDashboard() {
  const { $content } = window.$app;
  const state = getState();
  const valves = state.valves || [];
  const alerts = state.alerts || [];

  const devices = mockDevices;
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const faultDevices = devices.filter(d => d.status === 'fault').length;
  const openValves = valves.filter(v => v.status === 'open').length;
  const totalValves = valves.length;
  const runningGroups = ['B区温室组'];
  const recentAlerts = alerts.slice(0, 4);

  $content.innerHTML = `
    <div class="fade-in">
      <div class="dash-stats">
        <div class="stat-card">
          <div class="stat-card-label">设备总数</div>
          <div class="stat-card-value" style="color:var(--accent)">${totalDevices}<small>台</small></div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">在线设备</div>
          <div class="stat-card-value" style="color:var(--success)">${onlineDevices}<small>台</small></div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">离线设备</div>
          <div class="stat-card-value" style="color:var(--text-muted)">${offlineDevices}<small>台</small></div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">故障设备</div>
          <div class="stat-card-value" style="color:var(--danger)">${faultDevices}<small>台</small></div>
        </div>
      </div>

      <div class="dash-stats" style="margin-bottom:12px">
        <div class="stat-card cursor-pointer" data-goto="valves">
          <div class="stat-card-label">开启阀门 / 总阀门</div>
          <div class="stat-card-value" style="color:var(--primary)">${openValves}<small>/ ${totalValves}</small></div>
        </div>
        <div class="stat-card cursor-pointer" data-goto="groups">
          <div class="stat-card-label">运行中轮灌组</div>
          <div class="stat-card-value" style="color:var(--primary)">${runningGroups.length}<small>组</small></div>
        </div>
        <div class="stat-card cursor-pointer" data-goto="plans">
          <div class="stat-card-label">活跃灌溉计划</div>
          <div class="stat-card-value" style="color:var(--accent)">3<small>个</small></div>
        </div>
        <div class="stat-card">
          <div class="stat-card-label">当前项目</div>
          <div class="stat-card-value" style="color:var(--text);font-size:16px">${state.project ? state.project.name : '--'}</div>
        </div>
      </div>

      <div class="dash-row">
        <div class="dash-col">
          <div class="card">
            <div class="card-header">
              <span class="card-title"><i class="fa-solid fa-bell" style="color:var(--warning)"></i> 最新告警</span>
              <button class="btn btn-sm btn-ghost" data-goto="dashboard">查看全部</button>
            </div>
            <div>
              ${recentAlerts.map(a => `
                <div class="dash-alert-item">
                  <div class="dash-alert-dot" style="background:var(--${a.level === 'error' ? 'danger' : a.level === 'warning' ? 'warning' : 'accent'})"></div>
                  <div class="dash-alert-content">
                    <div class="dash-alert-title">${a.title}</div>
                    <div style="font-size:11px;color:var(--text-secondary)">${a.content}</div>
                  </div>
                  <div class="dash-alert-time">${a.time.split(' ')[1]}</div>
                </div>
              `).join('')}
              ${recentAlerts.length === 0 ? '<div style="text-align:center;padding:12px 0;font-size:12px;color:var(--text-muted)">暂无告警</div>' : ''}
            </div>
          </div>
        </div>

        <div class="dash-col" style="max-width:280px">
          <div class="card">
            <div class="card-header">
              <span class="card-title"><i class="fa-solid fa-bolt" style="color:var(--warning)"></i> 快捷操作</span>
            </div>
            <div class="dash-quick-actions">
              <button class="btn btn-primary btn-sm" data-goto="valves"><i class="fa-solid fa-faucet-drip"></i> 阀门控制</button>
              <button class="btn btn-accent btn-sm" data-goto="groups"><i class="fa-solid fa-users-gear"></i> 轮灌管理</button>
              <button class="btn btn-ghost btn-sm" data-goto="devices"><i class="fa-solid fa-microchip"></i> 设备列表</button>
              <button class="btn btn-ghost btn-sm" data-goto="plans"><i class="fa-solid fa-calendar-check"></i> 灌溉计划</button>
              <button class="btn btn-ghost btn-sm" data-goto="zones"><i class="fa-solid fa-map-location-dot"></i> 灌溉区域</button>
              <button class="btn btn-ghost btn-sm" data-goto="categories"><i class="fa-solid fa-folder-tree"></i> 分类管理</button>
            </div>
          </div>

          <div class="card" style="margin-top:8px">
            <div class="card-header">
              <span class="card-title"><i class="fa-solid fa-play" style="color:var(--primary)"></i> 运行中</span>
            </div>
            <div>
              ${runningGroups.map(g => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:3px 0">
                  <span style="font-size:12px">${g}</span>
                  <span class="tag tag-running">灌溉中</span>
                </div>
              `).join('')}
              ${runningGroups.length === 0 ? '<div style="text-align:center;padding:6px 0;font-size:12px;color:var(--text-muted)">无运行中任务</div>' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  $content.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.goto));
  });
}
