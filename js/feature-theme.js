// ===== FEATURE: Theme System =====
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
        '--card':'#14110f','--card-h':'#1f1a16',
        '--bg-gradient':'linear-gradient(180deg,#0a0908,#14100d)'
      },
      el: {}
    },
    'warm-light': {
      name: '暖色亮', icon: '☀️',
      vars: {
        '--bg':'#faf7f2','--bg2':'#f0ece6','--bg3':'#e8e2d8',
        '--fg':'#2c2418','--fg-dim':'#5a4d3f','--muted':'#7a6a5a',
        '--accent':'#d4a574','--accent-2':'#e85d2f','--accent-3':'#4a7c8c',
        '--line':'rgba(0,0,0,.07)','--line-2':'rgba(0,0,0,.12)',
        '--cinnabar':'#CC2936','--cinnabar-dim':'rgba(204,41,54,.12)',
        '--jade':'#3b7a5c','--jade-dim':'rgba(59,122,92,.1)',
        '--gold-leaf':'#C9A96E','--gold-dim':'rgba(212,165,116,.15)',
        '--card':'#f5f0e9','--card-h':'#eee8df',
        '--bg-gradient':'linear-gradient(180deg,#faf7f2,#f0ece6)'
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
        '--card':'#111827','--card-h':'#1a2332',
        '--bg-gradient':'linear-gradient(180deg,#0a0e17,#0f1525)'
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
        '--card':'#0f1a0f','--card-h':'#1a2a1a',
        '--bg-gradient':'linear-gradient(180deg,#0a0f0a,#0f1a0f)'
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
        '--card':'#18132a','--card-h':'#22183a',
        '--bg-gradient':'linear-gradient(180deg,#0e0a14,#18132a)'
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
        '--card':'#141414','--card-h':'#1c1c1c',
        '--bg-gradient':'linear-gradient(180deg,#0d0d0d,#161616)'
      },
      el: {}
    },
    'scarlet-red': {
      name: '嫣红', icon: '❤️',
      vars: {
        '--bg':'#0f0707','--bg2':'#1a0c0c','--bg3':'#2a1414',
        '--fg':'#f0e0e0','--fg-dim':'#c09090','--muted':'#905050',
        '--accent':'#e05050','--accent-2':'#d4a574','--accent-3':'#5a8a8a',
        '--line':'#2a1818','--line-2':'#3a2020',
        '--cinnabar':'#d03030','--cinnabar-dim':'rgba(208,48,48,.12)',
        '--jade':'#3a8a5a','--jade-dim':'rgba(58,138,90,.1)',
        '--gold-leaf':'#C9A96E','--gold-dim':'rgba(224,80,80,.12)',
        '--card':'#1a0c0c','--card-h':'#2a1414',
        '--bg-gradient':'linear-gradient(180deg,#0f0707,#1a0c0c)'
      },
      el: {}
    },
    'aurora': {
      name: '极光', icon: '🌌',
      vars: {
        '--bg':'#080e0e','--bg2':'#0c1a18','--bg3':'#142a26',
        '--fg':'#dcefeb','--fg-dim':'#8ab8b0','--muted':'#4a8278',
        '--accent':'#5cd4b0','--accent-2':'#7c5cf4','--accent-3':'#f4c85c',
        '--line':'#1a2a26','--line-2':'#263a34',
        '--cinnabar':'#c04040','--cinnabar-dim':'rgba(192,64,64,.12)',
        '--jade':'#2aaa7a','--jade-dim':'rgba(42,170,122,.1)',
        '--gold-leaf':'#d4a050','--gold-dim':'rgba(92,212,176,.12)',
        '--card':'#0c1a18','--card-h':'#142a26',
        '--bg-gradient':'linear-gradient(180deg,#080e0e,#0c1a18)'
      },
      el: {}
    },
    'autumn-leaves': {
      name: '秋叶', icon: '🍂',
      vars: {
        '--bg':'#0f0b06','--bg2':'#1a140e','--bg3':'#2a1e14',
        '--fg':'#efe4d8','--fg-dim':'#b8a088','--muted':'#7a6a50',
        '--accent':'#d49040','--accent-2':'#b85530','--accent-3':'#4a7a5a',
        '--line':'#2a2218','--line-2':'#3a3022',
        '--cinnabar':'#c04a30','--cinnabar-dim':'rgba(192,74,48,.12)',
        '--jade':'#4a8a4a','--jade-dim':'rgba(74,138,74,.1)',
        '--gold-leaf':'#c99440','--gold-dim':'rgba(212,144,64,.12)',
        '--card':'#1a140e','--card-h':'#2a1e14',
        '--bg-gradient':'linear-gradient(180deg,#0f0b06,#1a140e)'
      },
      el: {}
    },
    'misty-blue': {
      name: '雾灰蓝', icon: '🌫️',
      vars: {
        '--bg':'#0e1118','--bg2':'#151a24','--bg3':'#1e2430',
        '--fg':'#dce0ec','--fg-dim':'#9098b0','--muted':'#586078',
        '--accent':'#7a8ab8','--accent-2':'#b8987a','--accent-3':'#5a9a8a',
        '--line':'#222838','--line-2':'#2e3448',
        '--cinnabar':'#b84848','--cinnabar-dim':'rgba(184,72,72,.12)',
        '--jade':'#4a8a6a','--jade-dim':'rgba(74,138,106,.1)',
        '--gold-leaf':'#a0985a','--gold-dim':'rgba(122,138,184,.12)',
        '--card':'#151a24','--card-h':'#1e2430',
        '--bg-gradient':'linear-gradient(180deg,#0e1118,#151a24)'
      },
      el: {}
    },
    'midnight-cyan': {
      name: '午夜青', icon: '🌌',
      vars: {
        '--bg':'#061014','--bg2':'#0b1b20','--bg3':'#112b32',
        '--fg':'#e7f7f8','--fg-dim':'#9bc6ca','--muted':'#5a8288',
        '--accent':'#38c8d6','--accent-2':'#ff7a59','--accent-3':'#9fe870',
        '--line':'#163039','--line-2':'#21434d',
        '--cinnabar':'#ef5f54','--cinnabar-dim':'rgba(239,95,84,.12)',
        '--jade':'#3fcf8e','--jade-dim':'rgba(63,207,142,.1)',
        '--gold-leaf':'#e0c46c','--gold-dim':'rgba(56,200,214,.12)',
        '--card':'#0b1b20','--card-h':'#112b32',
        '--bg-gradient':'linear-gradient(180deg,#061014,#0b1b20)'
      },
      el: {}
    },
    'lotus-ink': {
      name: '莲墨', icon: '🪷',
      vars: {
        '--bg':'#0c0b12','--bg2':'#151321','--bg3':'#211d32',
        '--fg':'#f1edf7','--fg-dim':'#b9adc8','--muted':'#7d728d',
        '--accent':'#e0a8c8','--accent-2':'#86d0c4','--accent-3':'#c7b6ff',
        '--line':'#27223a','--line-2':'#3a3350',
        '--cinnabar':'#d65a78','--cinnabar-dim':'rgba(214,90,120,.12)',
        '--jade':'#66bfae','--jade-dim':'rgba(102,191,174,.1)',
        '--gold-leaf':'#d8bd7a','--gold-dim':'rgba(224,168,200,.12)',
        '--card':'#151321','--card-h':'#211d32',
        '--bg-gradient':'linear-gradient(180deg,#0c0b12,#151321)'
      },
      el: {}
    },
    'paper-bamboo': {
      name: '纸竹', icon: '🎋',
      vars: {
        '--bg':'#f7f3e8','--bg2':'#ece4d2','--bg3':'#ded2b9',
        '--fg':'#2b261b','--fg-dim':'#5a4f3d','--muted':'#7a6d55',
        '--accent':'#4f8a5f','--accent-2':'#c46a3a','--accent-3':'#447c93',
        '--line':'rgba(58,47,31,.12)','--line-2':'rgba(58,47,31,.2)',
        '--cinnabar':'#b94632','--cinnabar-dim':'rgba(185,70,50,.12)',
        '--jade':'#4f8a5f','--jade-dim':'rgba(79,138,95,.12)',
        '--gold-leaf':'#b68d42','--gold-dim':'rgba(79,138,95,.14)',
        '--card':'#f0e9d8','--card-h':'#e4dac4',
        '--bg-gradient':'linear-gradient(180deg,#f7f3e8,#ece4d2)'
      },
      el: {
        '.btm-bar':'background:rgba(247,243,232,.92)',
        '.fm-exit':'background:rgba(247,243,232,.85)'
      }
    },
    'sunrise-peach': {
      name: '晨桃', icon: '🌅',
      vars: {
        '--bg':'#140d0f','--bg2':'#211418','--bg3':'#341d21',
        '--fg':'#fff0e8','--fg-dim':'#d5aa9d','--muted':'#8c655d',
        '--accent':'#ffb36b','--accent-2':'#ff6f91','--accent-3':'#67d5c8',
        '--line':'#3a2428','--line-2':'#513238',
        '--cinnabar':'#ef5b62','--cinnabar-dim':'rgba(239,91,98,.12)',
        '--jade':'#55bda7','--jade-dim':'rgba(85,189,167,.1)',
        '--gold-leaf':'#f2c879','--gold-dim':'rgba(255,179,107,.13)',
        '--card':'#211418','--card-h':'#341d21',
        '--bg-gradient':'linear-gradient(180deg,#140d0f,#211418)'
      },
      el: {}
    },
    'glacier-white': {
      name: '冰川白', icon: '🏔️',
      vars: {
        '--bg':'#f4f8fb','--bg2':'#e8f0f5','--bg3':'#dce8ef',
        '--fg':'#1b2a32','--fg-dim':'#4a5d6a','--muted':'#6e7d88',
        '--accent':'#2f8fb4','--accent-2':'#d4686f','--accent-3':'#4b9f7d',
        '--line':'rgba(31,63,77,.1)','--line-2':'rgba(31,63,77,.18)',
        '--cinnabar':'#c8525d','--cinnabar-dim':'rgba(200,82,93,.12)',
        '--jade':'#4b9f7d','--jade-dim':'rgba(75,159,125,.1)',
        '--gold-leaf':'#ad8f42','--gold-dim':'rgba(47,143,180,.12)',
        '--card':'#edf4f8','--card-h':'#e0edf4',
        '--bg-gradient':'linear-gradient(180deg,#f4f8fb,#e8f0f5)'
      },
      el: {
        '.btm-bar':'background:rgba(244,248,251,.92)',
        '.fm-exit':'background:rgba(244,248,251,.85)'
      }
    },
    'neon-night': {
      name: '霓虹夜', icon: '🟣',
      vars: {
        '--bg':'#05070f','--bg2':'#0b1020','--bg3':'#131a30',
        '--fg':'#eef2ff','--fg-dim':'#a9b5d8','--muted':'#677194',
        '--accent':'#7dd3fc','--accent-2':'#fb7185','--accent-3':'#a78bfa',
        '--line':'#1b2540','--line-2':'#2b3658',
        '--cinnabar':'#fb7185','--cinnabar-dim':'rgba(251,113,133,.12)',
        '--jade':'#34d399','--jade-dim':'rgba(52,211,153,.1)',
        '--gold-leaf':'#fde68a','--gold-dim':'rgba(125,211,252,.12)',
        '--card':'#0b1020','--card-h':'#131a30',
        '--bg-gradient':'linear-gradient(180deg,#05070f,#0b1020)'
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
    Object.keys(THEMES).forEach(function(themeId){document.documentElement.classList.remove('t-' + themeId)});
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
    'justify-content:center;max-width:clamp(340px,88vw,760px);max-height:min(58vh,420px);overflow:auto}' +
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
