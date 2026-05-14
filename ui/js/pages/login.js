// ===== Login Page =====

import { mockUsers } from '../mock.js';
import { login } from '../store.js';
import { navigate } from '../router.js';

export function renderLogin() {
  const { $fullscreen } = window.$app;
  $fullscreen.innerHTML = `
    <div class="login-box fade-in">
      <div class="login-logo"><i class="fa-solid fa-seedling"></i></div>
      <div class="login-title">AgriSmart Controller</div>
      <div class="login-subtitle">智慧农业物联网控制终端</div>
      <div class="login-form text-left">
        <div class="form-group">
          <input class="form-input" type="text" id="login-username" placeholder="请输入用户名" value="admin" />
        </div>
        <div class="form-group">
          <input class="form-input" type="password" id="login-password" placeholder="请输入密码" value="123456" />
        </div>
        <label class="login-remember">
          <input type="checkbox" checked /> 记住密码
        </label>
        <div class="form-group" style="margin-top:8px">
          <button class="btn btn-primary login-btn" id="login-btn">登 录</button>
        </div>
        <div style="text-align:center;margin-top:8px;font-size:11px;color:var(--text-muted)">
          演示账号: admin / 123456
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
}

function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    window.showToast('请输入用户名和密码', 'warning');
    return;
  }

  const user = mockUsers.find(u => u.username === username && u.password === password);
  if (!user) {
    window.showToast('用户名或密码错误', 'error');
    return;
  }

  login(user);
  window.showToast('登录成功', 'success');
  navigate('project-select');
}
