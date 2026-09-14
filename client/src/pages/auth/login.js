/**
 * CoreTrade ERP — Modern Login Page
 */
import { t, getLang, setLang } from '../../core/i18n.js';
import { authApi } from '../../core/api.js';
import { store } from '../../core/store.js';
import { navigate } from '../../core/router.js';

export async function renderLogin(container) {
  const currentServerUrl = localStorage.getItem('server_url') || '';

  container.innerHTML = `
    <div style="position:relative; width:100%; min-height:100vh; min-height:100dvh; display:flex; align-items:center; justify-content:center;
         background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 60%, #020617 100%);
         padding: 1.5rem 1rem; overflow:hidden;">

      <!-- Decorative Ambient Lights (contained inside overflow:hidden) -->
      <div style="position:absolute; width:350px; height:350px; border-radius:50%;
           background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
           top: -80px; right: -80px; pointer-events:none; filter:blur(40px);"></div>
      <div style="position:absolute; width:300px; height:300px; border-radius:50%;
           background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%);
           bottom: -60px; left: -60px; pointer-events:none; filter:blur(40px);"></div>

      <div style="width:100%; max-width:400px; margin:0 auto; position:relative; z-index:1;">
        <!-- Logo & Header -->
        <div style="text-align:center; margin-bottom:1.75rem;">
          <div style="width:64px; height:64px; background: linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%);
               border-radius:20px; display:flex; align-items:center; justify-content:center;
               margin:0 auto 1rem; font-size:1.6rem; font-weight:800; color:white;
               box-shadow: 0 10px 30px -5px rgba(99,102,241,0.5), inset 0 1px 1px rgba(255,255,255,0.4);
               letter-spacing:-0.05em;">CT</div>
          <h1 style="font-size:1.6rem; font-weight:700; color:#f8fafc; margin:0 0 0.25rem 0; letter-spacing:-0.025em;" id="login-title">
            ${t('app.name')}
          </h1>
          <p style="color:#94a3b8; font-size:0.875rem; margin:0;" id="login-company">${t('app.company')}</p>
        </div>

        <!-- Glassmorphism Card -->
        <div style="background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
             border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.25rem;
             padding: 1.75rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);">

          <!-- Language Switcher Header -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <span style="font-size:0.85rem; font-weight:600; color:#cbd5e1;">${t('auth.login')}</span>
            <div class="lang-switcher" style="background:rgba(15,23,42,0.6); padding:3px; border-radius:9999px; border:1px solid rgba(255,255,255,0.08);">
              <button class="lang-btn ${getLang()==='en'?'active':''}" data-lang="en" id="login-lang-en" style="padding:3px 10px; font-size:0.75rem;">EN</button>
              <button class="lang-btn ${getLang()==='bn'?'active':''}" data-lang="bn" id="login-lang-bn" style="padding:3px 10px; font-size:0.75rem;">বাং</button>
            </div>
          </div>

          <form id="login-form" novalidate>
            <!-- Username Input -->
            <div class="form-group" style="margin-bottom:1.15rem;">
              <label class="form-label" for="login-username" id="label-username" style="font-size:0.825rem; font-weight:500; color:#cbd5e1; margin-bottom:0.4rem; display:block;">
                ${t('auth.username')} <span class="required-star">*</span>
              </label>
              <div style="position:relative;">
                <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#64748b; display:flex; pointer-events:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input type="text" id="login-username" name="username" class="form-control"
                  autocomplete="username" autocapitalize="none" spellcheck="false"
                  placeholder="${t('auth.username')}" required
                  style="padding-left:2.6rem; height:44px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); border-radius:0.75rem; color:#f8fafc; font-size:0.9rem;" />
              </div>
            </div>

            <!-- Password Input -->
            <div class="form-group" style="margin-bottom:1.15rem;">
              <label class="form-label" for="login-password" id="label-password" style="font-size:0.825rem; font-weight:500; color:#cbd5e1; margin-bottom:0.4rem; display:block;">
                ${t('auth.password')} <span class="required-star">*</span>
              </label>
              <div style="position:relative;">
                <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#64748b; display:flex; pointer-events:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input type="password" id="login-password" name="password" class="form-control"
                  autocomplete="current-password" placeholder="••••••••" required
                  style="padding-left:2.6rem; padding-right:2.6rem; height:44px; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.12); border-radius:0.75rem; color:#f8fafc; font-size:0.9rem;" />
                <button type="button" id="toggle-password" title="Toggle password visibility"
                  style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%);
                         background:none; border:none; color:#64748b; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center; border-radius:0.375rem;">
                  <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            <!-- Mobile / Server Config Drawer Toggle -->
            <div style="margin-bottom:1.25rem;">
              <button type="button" id="toggle-server-settings"
                style="background:none; border:none; color:#818cf8; font-size:0.8rem; font-weight:500; cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; padding:0;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span>${t('auth.serverUrl')}</span>
              </button>

              <div id="server-settings-panel" style="display:${currentServerUrl ? 'block' : 'none'}; margin-top:0.75rem; padding:0.85rem; background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:0.75rem;">
                <label for="login-server-url" style="color:#94a3b8; font-size:0.75rem; font-weight:500; display:block; margin-bottom:0.35rem;">
                  Backend Host URL (IP / Domain)
                </label>
                <input type="text" id="login-server-url" class="form-control"
                  placeholder="http://192.168.0.144:5000"
                  value="${currentServerUrl}"
                  style="height:38px; font-size:0.8rem; background:rgba(30,41,59,0.8); border:1px solid rgba(255,255,255,0.12); border-radius:0.5rem; color:#f8fafc;" />
                <small style="color:#64748b; font-size:0.725rem; display:block; margin-top:0.35rem; line-height:1.3;">
                  ${t('auth.serverUrlHint')}
                </small>
              </div>
            </div>

            <!-- Error Banner -->
            <div id="login-error" style="display:none; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4);
                 color:#fca5a5; padding:0.75rem; border-radius:0.75rem; font-size:0.825rem;
                 margin-bottom:1.15rem; align-items:center; gap:0.5rem;"></div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-full" id="login-btn"
              style="height:46px; border-radius:0.75rem; font-size:0.95rem; font-weight:600; background:linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border:none; box-shadow:0 4px 15px rgba(99,102,241,0.4);">
              ${t('auth.loginBtn')}
            </button>
          </form>
        </div>

        <p style="text-align:center; margin-top:1.5rem; color:#475569; font-size:0.75rem; font-weight:500;">
          CoreTrade ERP v1.0 · Islam Enterprise
        </p>
      </div>
    </div>
  `;

  // Language switcher event listeners
  document.getElementById('login-lang-en')?.addEventListener('click', () => {
    setLang('en');
    renderLogin(container);
  });
  document.getElementById('login-lang-bn')?.addEventListener('click', () => {
    setLang('bn');
    renderLogin(container);
  });

  // Toggle Server Settings panel
  document.getElementById('toggle-server-settings')?.addEventListener('click', () => {
    const panel = document.getElementById('server-settings-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') {
        document.getElementById('login-server-url')?.focus();
      }
    }
  });

  // Toggle password visibility
  let showPassword = false;
  document.getElementById('toggle-password')?.addEventListener('click', () => {
    showPassword = !showPassword;
    const input = document.getElementById('login-password');
    const eyeIcon = document.getElementById('eye-icon');
    if (input) {
      input.type = showPassword ? 'text' : 'password';
    }
    if (eyeIcon) {
      eyeIcon.innerHTML = showPassword
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
    }
  });

  // Form submission
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    const errEl = document.getElementById('login-error');
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const serverUrlInput = document.getElementById('login-server-url');

    if (serverUrlInput && serverUrlInput.value.trim()) {
      localStorage.setItem('server_url', serverUrlInput.value.trim());
    } else {
      localStorage.removeItem('server_url');
    }

    if (!username || !password) {
      errEl.style.display = 'flex';
      errEl.innerHTML = `<span>⚠️</span> <span>${t('auth.invalidCredentials')}</span>`;
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;
    btn.textContent = t('auth.loggingIn');
    errEl.style.display = 'none';

    try {
      const data = await authApi.login(username, password);
      if (data.token) {
        localStorage.setItem('ct_token', data.token);
      }
      store.user = data.user;
      navigate('/');
    } catch (err) {
      errEl.style.display = 'flex';
      errEl.innerHTML = `<span>⚠️</span> <span>${err.message || t('auth.invalidCredentials')}</span>`;
      btn.classList.remove('loading');
      btn.disabled = false;
      btn.textContent = t('auth.loginBtn');
      document.getElementById('login-password').value = '';
    }
  });

  // Focus username
  document.getElementById('login-username')?.focus();

  // Remove initial HTML loader if present
  document.getElementById('initial-loader')?.remove();
}
