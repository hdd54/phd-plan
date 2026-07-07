// ===== FEATURE: Theme System (6 color schemes) =====
(function(){
  if(window.__features['theme']) return;
  window.__features['theme'] = true;

  // ===== Theme Definitions =====
  var THEMES = {
    'warm-dark': {
      name: '暖色暗', icon: '🌙',
      vars: {
        '--bg':'#0a0908','--bg2':'#14110f','--bg3':'#1c1815',
        '--fg':'#f4f1ea','--fg-dim':'#a8a29a','--muted':'#5a5550',
        '--accent':'#d4a574','--accent-2':'#e85d2f','--accent-3':'#4a7c8c',
        '--line':'#2a2724','--line-2':'#3a3530',
        '--cinnabar':'#CC2936','--cinnabar-dim':'rgba(204,41,54,.12)',
        '--jade':'#3b7a5c','--jade-dim':'rgba(59,122,92,.1)',
        '--gold-leaf':'#C9A96E','--gold-dim':'rgba(212,165,116,.12)',
        '--card':'#14110f','--card-h':'#1f1a16'
      },
      el: {} // no element overrides needed for dark
    },
    'warm-light': {
      name: '暖色亮', icon: '☀️',
      vars: {
        '--bg':'#faf7f2','--bg2':'#f0ece6','--bg3':'#e8e2d8',
        '--fg':'#2c2418','--fg-dim':'#6b5d4f','--muted':'#a09888',
        '--accent':'#d4a574','--accent-2':'#e85d2f','--accent-3':'#4a7c8c',
        '--line':'rgba(0,0,0,.07)','--line-2':'rgba(0,0,0,.12)',
        '--cinnabar':'#CC2936','--cinnabar-dim':'rgba(204,41,54,.12)',
        '--jade':'#3b7a5c','--jade-dim':'rgba(59,122,92,.1)',
        '--gold-leaf':'#C9A96E','--gold-dim':'rgba(212,165,116,.15)',
        '--card':'#f5f0e9','--card-h':'#eee8df'
      },
      el: {
        '.btm-bar':'background:rgba(250,247,242,.92)',
        '.fm-exit':'background:rgba(250,247,242,.85)'
      }
    },
    'deep-blue': {
      name: '深邃蓝', icon: '🌊',
      vars: {
        '--bg':'#0a0e17','--bg2':'#111827','--bg3':'#1a2332',
        '--fg':'#e2e8f0','--fg-dim':'#94a3b8','--muted':'#64748b',
        '--accent':'#60a5fa','--accent-2':'#f472b6','--accent-3':'#34d399',
        '--line':'#1e293b','--line-2':'#334155',
        '--cinnabar':'#ef4444','--cinnabar-dim':'rgba(239,68,68,.12)',
        '--jade':'#22c55e','--jade-dim':'rgba(34,197,94,.1)',
        '--gold-leaf':'#facc15','--gold-dim':'rgba(96,165,250,.12)',
        '--card':'#111827','--card-h':'#1a2332'
      },
      el: {}
    },
    'forest-green': {
      name: '森林绿', icon: '🌲',
      vars: {
        '--bg':'#0a0f0a','--bg2':'#0f1a0f','--bg3':'#1a2a1a',
        '--fg':'#e0ede0','--fg-dim':'#8aa88a','--muted':'#5a7a5a',
        '--accent':'#6bcd6b','--accent-2':'#d4a574','--accent-3':'#4a8c8c',
        '--line':'#1a2a1a','--line-2':'#2a3a2a',
        '--cinnabar':'#cc3636','--cinnabar-dim':'rgba(204,54,54,.12)',
        '--jade':'#4a9a4a','--jade-dim':'rgba(74,154,74,.1)',
        '--gold-leaf':'#c9a86a','--gold-dim':'rgba(107,205,107,.12)',
        '--card':'#0f1a0f','--card-h':'#1a2a1a'
      },
      el: {}
    },
    'twilight-purple': {
      name: '暮色紫', icon: '🔮',
      vars: {
        '--bg':'#0e0a14','--bg2':'#18132a','--bg3':'#22183a',
        '--fg':'#e8def8','--fg-dim':'#a89bc8','--muted':'#7a6a9a',
        '--accent':'#b794f4','--accent-2':'#f472b6','--accent-3':'#4a7c8c',
        '--line':'#2a1e3a','--line-2':'#3a2a4a',
        '--cinnabar':'#cc2946','--cinnabar-dim':'rgba(204,41,70,.12)',
        '--jade':'#5aaa7a','--jade-dim':'rgba(90,170,122,.1)',
        '--gold-leaf':'#c9a86a','--gold-dim':'rgba(183,148,244,.12)',
        '--card':'#18132a','--card-h':'#22183a'
      },
      el: {}
    },
    'minimal-gray': {
      name: '极简灰', icon: '◻️',
      vars: {
        '--bg':'#0d0d0d','--bg2':'#141414','--bg3':'#1c1c1c',
        '--fg':'#e8e8e8','--fg-dim':'#999999','--muted':'#666666',
        '--accent':'#aaaaaa','--accent-2':'#888888','--accent-3':'#777777',
        '--line':'#222222','--line-2':'#2a2a2a',
        '--cinnabar':'#bb4444','--cinnabar-dim':'rgba(187,68,68,.12)',
        '--jade':'#559955','--jade-dim':'rgba(85,153,85,.1)',
        '--gold-leaf':'#aaaa55','--gold-dim':'rgba(170,170,85,.1)',
        '--card':'#141414','--card-h':'#1c1c1c'
      },
      el: {}
    }
  };

  // Load saved theme
  var currentTheme = localStorage.getItem('_theme');
  if(!currentTheme || !THEMES[currentTheme]) currentTheme = 'warm-dark';

  // Inject theme engine CSS
  var css = document.createElement('style');
  css.textContent = '';
  document.head.appendChild(css);

  // ===== Apply theme =====
  function applyTheme(id) {
    var t = THEMES[id];
    if(!t) return;
    currentTheme = id;

    // Remove any previous theme class, then add current
    document.documentElement.classList.remove('t-warm-dark', 't-warm-light', 't-deep-blue', 't-forest-green', 't-twilight-purple', 't-minimal-gray');
    document.documentElement.classList.add('t-' + id);

    // Build CSS variable overrides
    var varCss = '.t-' + id + '{';
    for(var k in t.vars) {
      varCss += k + ':' + t.vars[k] + ';';
    }
    varCss += '}';

    // Element-specific overrides
    if(t.el) {
      for(var sel in t.el) {
        varCss += '.t-' + id + ' ' + sel + '{' + t.el[sel] + '}';
      }
    }

    css.textContent = varCss;

    // Save preference
    localStorage.setItem('_theme', id);

    // Update button
    updateBtn();
  }

  // ===== Update button =====
  function updateBtn() {
    var btn = document.getElementById('themeBtn');
    if(!btn) return;
    var t = THEMES[currentTheme];
    btn.innerHTML = '<span class="bb-icon">' + t.icon + '</span> ' + t.name;
  }

  // ===== Theme picker popup =====
  var pickerEl = null;

  function showPicker() {
    hidePicker(); // remove existing

    var btn = document.getElementById('themeBtn');
    if(!btn) return;

    pickerEl = document.createElement('div');
    pickerEl.className = 'theme-picker';

    var html = '';
    for(var id in THEMES) {
      var t = THEMES[id];
      var active = id === currentTheme ? ' tp-a' : '';
      // Extract accent color from vars for the dot
      var dotColor = t.vars['--accent'] || '#888';
      html += '<div class="tp-item' + active + '" data-theme="' + id + '">';
      html += '<span class="tp-dot" style="background:' + dotColor + '"></span>';
      html += '<span class="tp-label">' + t.icon + ' ' + t.name + '</span>';
      html += active ? '<span class="tp-check">✓</span>' : '';
      html += '</div>';
    }
    pickerEl.innerHTML = html;

    // Position near button
    document.body.appendChild(pickerEl);

    // Click handler
    pickerEl.addEventListener('click', function(e) {
      var item = e.target.closest('.tp-item');
      if(!item) return;
      var tid = item.dataset.theme;
      if(tid && THEMES[tid]) {
        applyTheme(tid);
        hidePicker();
      }
    });

    // Close on outside click
    setTimeout(function() {
      document.addEventListener('click', pickerOutside, true);
    }, 10);
  }

  function pickerOutside(e) {
    var btn = document.getElementById('themeBtn');
    if(pickerEl && !pickerEl.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      hidePicker();
    }
  }

  function hidePicker() {
    if(pickerEl) {
      pickerEl.remove();
      pickerEl = null;
    }
    document.removeEventListener('click', pickerOutside, true);
  }

  // Inject picker CSS
  var pStyle = document.createElement('style');
  pStyle.textContent =
    '.theme-picker{position:fixed;bottom:clamp(2.5rem,4vw,3.2rem);left:50%;transform:translateX(-50%);z-index:200;' +
    'background:var(--bg3);border:1px solid var(--line-2);border-radius:12px;padding:clamp(.35rem,.5vw,.45rem);' +
    'box-shadow:0 8px 40px rgba(0,0,0,.6);display:flex;gap:clamp(.2rem,.3vw,.3rem);flex-wrap:wrap;' +
    'justify-content:center;max-width:clamp(340px,80vw,480px)}' +
    '.tp-item{display:flex;align-items:center;gap:clamp(.2rem,.3vw,.25rem);padding:clamp(.25rem,.35vw,.3rem) clamp(.35rem,.5vw,.45rem);' +
    'border-radius:8px;cursor:pointer;transition:background .15s;border:1px solid transparent}' +
    '.tp-item:hover{background:rgba(255,255,255,.06);border-color:var(--line)}' +
    '.tp-item.tp-a{border-color:var(--accent);background:rgba(255,255,255,.04)}' +
    '.tp-dot{width:clamp(10px,1.2vw,12px);height:clamp(10px,1.2vw,12px);border-radius:50%;flex-shrink:0;border:1.5px solid rgba(255,255,255,.15)}' +
    '.tp-label{font-size:clamp(.5rem,.75vw,.55rem);color:var(--fg);white-space:nowrap}' +
    '.tp-check{font-size:clamp(.45rem,.65vw,.5rem);color:var(--accent);margin-left:.05rem}';
  document.head.appendChild(pStyle);

  // ===== Initialize =====
  applyTheme(currentTheme);

  // ===== Button handler =====
  var btn = document.getElementById('themeBtn');
  if(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if(pickerEl) { hidePicker(); }
      else { showPicker(); }
    });
  }
})();
