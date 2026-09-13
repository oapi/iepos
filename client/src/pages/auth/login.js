/**
 * Login Page
 */
import { t, getLang, setLang } from '../../core/i18n.js';
import { authApi } from '../../core/api.js';
import { store } from '../../core/store.js';
import { navigate } from '../../core/router.js';

export async function renderLogin(container) {
  container.innerHTML = `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center;
         background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
         padding: 1rem;">

      <!-- Decorative blobs -->
      <div style="position:fixed; width:400px; height:400px; border-radius:50%;
           background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
           top: -100px; right: -100px; pointer-events:none;"></div>
      <div style="position:fixed; width:300px; height:300px; border-radius:50%;
           background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%);
           bottom: -50px; left: -50px; pointer-events:none;"></div>

      <div style="width:100%; max-width:420px; position:relative; z-index:1;">
        <!-- Logo -->
        <div style="text-align:center; margin-bottom:2rem;">
          <div style="width:60px; height:60px; background: linear-gradient(135deg, #6366f1, #0ea5e9);
               border-radius:16px; display:flex; align-items:center; justify-content:center;
               margin:0 auto 1rem; font-size:1.5rem; font-weight:800; color:white;
               box-shadow: 0 8px 32px rgba(99,102,241,0.4);">CT</div>
          <h1 style="font-size:1.5rem; font-weight:700; color:#f1f5f9; margin-bottom:0.25rem;" id="login-title">
            ${t('app.name')}
          </h1>
          <p style="color:#64748b; font-size:0.875rem;" id="login-company">${t('app.company')}</p>
        </div>

        <!-- Card -->
        <div style="background:#1e293b; border:1px solid #334155; border-radius:1rem;
             padding:2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">

          <!-- Lang switcher -->
          <div style="display:flex; justify-content:flex-end; margin-bottom:1.5rem;">
            <div class="lang-switcher">
              <button class="lang-btn ${getLang()==='en'?'active':''}" data-lang="en" id="login-lang-en">EN</button>
              <button class="lang-btn ${getLang()==='bn'?'active':''}" data-lang="bn" id="login-lang-bn">বাং</button>
            </div>
          </div>

          <form id="login-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="login-username" id="label-username">
                ${t('auth.username')} <span class="required-star">*</span>
              </label>
              <input type="text" id="login-username" name="username" class="form-control"
                autocomplete="username" autocapitalize="none" spellcheck="false"
                placeholder="${t('auth.username')}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password" id="label-password">
                ${t('auth.password')} <span class="required-star">*</span>
              </label>
              <div style="position:relative;">
                <input type="password" id="login-password" name="password" class="form-control"
                  autocomplete="current-password"
                  placeholder="••••••••" required />
                <button type="button" id="toggle-password"
                  style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%);
                         background:none; border:none; color:#64748b; cursor:pointer; font-size:0.9rem;">
                  👁
                </button>
              </div>
            </div>

            <div id="login-error" style="display:none; background:#fee2e2; border:1px solid #fca5a5;
                 color:#991b1b; padding:0.75rem; border-radius:0.5rem; font-size:0.875rem;
                 margin-bottom:1rem;"></div>

            <button type="submit" class="btn btn-primary btn-full btn-lg" id="login-btn">
              ${t('auth.loginBtn')}
            </button>
          </form>
        </div>

        <p style="text-align:center; margin-top:1.5rem; color:#334155; font-size:0.75rem;">
          CoreTrade ERP v1.0 · Islam Enterprise
        </p>
      </div>
    </div>
  `;

  // Language switcher on login page
  document.getElementById('login-lang-en')?.addEventListener('click', () => {
    setLang('en');
    renderLogin(container); // Re-render in new language
  });
  document.getElementById('login-lang-bn')?.addEventListener('click', () => {
    setLang('bn');
    renderLogin(container);
  });

  // Password toggle
  document.getElementById('toggle-password')?.addEventListener('click', () => {
    const input = document.getElementById('login-password');
    input.type = input.type === 'password' ? 'text' : 'password';
  });

  // Form submission
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    const errEl = document.getElementById('login-error');
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
      errEl.textContent = t('auth.invalidCredentials');
      errEl.style.display = 'block';
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
      errEl.textContent = err.message || t('auth.invalidCredentials');
      errEl.style.display = 'block';
      btn.classList.remove('loading');
      btn.disabled = false;
      btn.textContent = t('auth.loginBtn');
      document.getElementById('login-password').value = '';
    }
  });

  // Focus username
  document.getElementById('login-username')?.focus();

  // Hide initial loader
  document.getElementById('initial-loader')?.remove();
}
