// ===== FEATURE: Theme Toggle (Dark/Light) =====
(function(){
  if(window.__features['theme']) return;
  window.__features['theme'] = true;

  // Inject light theme CSS
  var style = document.createElement('style');
  style.textContent = `
    .light-theme{
      --bg:#faf7f2; --bg2:#f0ece6; --bg3:#e8e2d8;
      --fg:#2c2418; --fg-dim:#6b5d4f; --muted:#a09888;
      --line:rgba(0,0,0,.07); --line-2:rgba(0,0,0,.12);
      --txt3:#a09888; --txt4:#a09888;
      --border:rgba(0,0,0,.07); --border2:rgba(0,0,0,.12);
      --gold-dim:rgba(212,165,116,.15);
    }
    .light-theme .btm-bar{background:rgba(250,247,242,.92)}
    .light-theme .pomo-modal{background:var(--bg2)}
    .light-theme .help-modal{background:var(--bg2)}
    .light-theme .do-modal{background:var(--bg2)}
    .light-theme .fm-exit{background:rgba(250,247,242,.85)}
    .light-theme .tg-picker{background:var(--bg2)}
  `;
  document.head.appendChild(style);

  // Load saved preference
  var isLight = localStorage.getItem('_theme') === 'light';
  if(isLight) document.documentElement.classList.add('light-theme');

  // Button handler
  var btn = document.getElementById('themeBtn');
  if(btn){
    btn.innerHTML = '<span class="bb-icon">' + (isLight ? '☀️' : '🌙') + '</span> ' + (isLight ? '亮色' : '主题');
    btn.addEventListener('click', function(){
      document.documentElement.classList.toggle('light-theme');
      var nowLight = document.documentElement.classList.contains('light-theme');
      localStorage.setItem('_theme', nowLight ? 'light' : 'dark');
      btn.innerHTML = '<span class="bb-icon">' + (nowLight ? '☀️' : '🌙') + '</span> ' + (nowLight ? '亮色' : '主题');
    });
  }
})();
