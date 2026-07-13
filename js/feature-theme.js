// ===== FEATURE: Theme System =====
(function(){
  if (window.__features && window.__features.theme) return;
  window.__features = window.__features || {};
  window.__features.theme = true;

  var THEMES = {
    'warm-dark': {
      name: '暖色暗夜', icon: '🌙',
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
      }
    },
    'ink-gold': {
      name: '墨金', icon: '✦',
      vars: {
        '--bg':'#070707','--bg2':'#10100f','--bg3':'#181713',
        '--fg':'#f2ead8','--fg-dim':'#b4a98e','--muted':'#6f6655',
        '--accent':'#d8b45f','--accent-2':'#c75842','--accent-3':'#5f8a78',
        '--line':'#232019','--line-2':'#342e22',
        '--cinnabar':'#c54536','--cinnabar-dim':'rgba(197,69,54,.12)',
        '--jade':'#4f9478','--jade-dim':'rgba(79,148,120,.1)',
        '--gold-leaf':'#d8b45f','--gold-dim':'rgba(216,180,95,.13)',
        '--card':'#10100f','--card-h':'#1b1913',
        '--bg-gradient':'linear-gradient(180deg,#070707,#12100b)'
      }
    },
    'deep-blue': {
      name: '深海蓝', icon: '🌊',
      vars: {
        '--bg':'#07101b','--bg2':'#0d1828','--bg3':'#14243a',
        '--fg':'#e5eefb','--fg-dim':'#94a8c5','--muted':'#5d6f8b',
        '--accent':'#62a8ff','--accent-2':'#ff7aa2','--accent-3':'#34d399',
        '--line':'#18283f','--line-2':'#263c5a',
        '--cinnabar':'#ef5b5b','--cinnabar-dim':'rgba(239,91,91,.12)',
        '--jade':'#22c58a','--jade-dim':'rgba(34,197,138,.1)',
        '--gold-leaf':'#f2ce6b','--gold-dim':'rgba(98,168,255,.12)',
        '--card':'#0d1828','--card-h':'#162740',
        '--bg-gradient':'linear-gradient(180deg,#07101b,#0d1828)'
      }
    },
    'forest-green': {
      name: '森林绿', icon: '🌲',
      vars: {
        '--bg':'#07100a','--bg2':'#0d1a11','--bg3':'#152a1b',
        '--fg':'#e4f1e4','--fg-dim':'#91ad94','--muted':'#5d7a61',
        '--accent':'#70d486','--accent-2':'#d4a574','--accent-3':'#54a0a0',
        '--line':'#17291b','--line-2':'#27402b',
        '--cinnabar':'#cc4a3d','--cinnabar-dim':'rgba(204,74,61,.12)',
        '--jade':'#57a86b','--jade-dim':'rgba(87,168,107,.1)',
        '--gold-leaf':'#c9a86a','--gold-dim':'rgba(112,212,134,.12)',
        '--card':'#0d1a11','--card-h':'#172b1d',
        '--bg-gradient':'linear-gradient(180deg,#07100a,#0d1a11)'
      }
    },
    'twilight-purple': {
      name: '暮色紫', icon: '☂',
      vars: {
        '--bg':'#0d0914','--bg2':'#171126','--bg3':'#241936',
        '--fg':'#eee6fb','--fg-dim':'#b3a5d0','--muted':'#7a6a9a',
        '--accent':'#b794f4','--accent-2':'#f472b6','--accent-3':'#60d0c8',
        '--line':'#2a1e3a','--line-2':'#3a2a4f',
        '--cinnabar':'#d64a7a','--cinnabar-dim':'rgba(214,74,122,.12)',
        '--jade':'#64c79e','--jade-dim':'rgba(100,199,158,.1)',
        '--gold-leaf':'#d2b66a','--gold-dim':'rgba(183,148,244,.12)',
        '--card':'#171126','--card-h':'#241936',
        '--bg-gradient':'linear-gradient(180deg,#0d0914,#171126)'
      }
    },
    'graphite': {
      name: '石墨灰', icon: '●',
      vars: {
        '--bg':'#090909','--bg2':'#121212','--bg3':'#1c1c1c',
        '--fg':'#ededed','--fg-dim':'#a5a5a5','--muted':'#696969',
        '--accent':'#b7b7b7','--accent-2':'#d06b61','--accent-3':'#78a8a0',
        '--line':'#242424','--line-2':'#333333',
        '--cinnabar':'#bd4d45','--cinnabar-dim':'rgba(189,77,69,.12)',
        '--jade':'#699e7a','--jade-dim':'rgba(105,158,122,.1)',
        '--gold-leaf':'#b6a46b','--gold-dim':'rgba(183,183,183,.1)',
        '--card':'#121212','--card-h':'#1d1d1d',
        '--bg-gradient':'linear-gradient(180deg,#090909,#141414)'
      }
    },
    'scarlet-red': {
      name: '绯红', icon: '♥',
      vars: {
        '--bg':'#100606','--bg2':'#1b0b0b','--bg3':'#2c1212',
        '--fg':'#f5e4e2','--fg-dim':'#c99a95','--muted':'#87514d',
        '--accent':'#e85d5d','--accent-2':'#d4a574','--accent-3':'#5fa0a0',
        '--line':'#2d1717','--line-2':'#422020',
        '--cinnabar':'#d73f3f','--cinnabar-dim':'rgba(215,63,63,.12)',
        '--jade':'#49a477','--jade-dim':'rgba(73,164,119,.1)',
        '--gold-leaf':'#C9A96E','--gold-dim':'rgba(232,93,93,.12)',
        '--card':'#1b0b0b','--card-h':'#2c1212',
        '--bg-gradient':'linear-gradient(180deg,#100606,#1b0b0b)'
      }
    },
    'aurora': {
      name: '极光', icon: '✨',
      vars: {
        '--bg':'#06100f','--bg2':'#0b1b18','--bg3':'#112b26',
        '--fg':'#e1f5f0','--fg-dim':'#91bdb4','--muted':'#56857b',
        '--accent':'#5ce0b8','--accent-2':'#8a6cff','--accent-3':'#f4c85c',
        '--line':'#18302b','--line-2':'#25443b',
        '--cinnabar':'#d65c5c','--cinnabar-dim':'rgba(214,92,92,.12)',
        '--jade':'#2fc78d','--jade-dim':'rgba(47,199,141,.1)',
        '--gold-leaf':'#d4a050','--gold-dim':'rgba(92,224,184,.12)',
        '--card':'#0b1b18','--card-h':'#112b26',
        '--bg-gradient':'linear-gradient(180deg,#06100f,#0b1b18)'
      }
    },
    'autumn-leaves': {
      name: '秋叶', icon: '🍂',
      vars: {
        '--bg':'#0f0a05','--bg2':'#1b120b','--bg3':'#2b1d12',
        '--fg':'#f1e4d4','--fg-dim':'#b89c7e','--muted':'#7a6149',
        '--accent':'#d49040','--accent-2':'#c65a34','--accent-3':'#5a8f66',
        '--line':'#2b2116','--line-2':'#3d2d1d',
        '--cinnabar':'#c94d34','--cinnabar-dim':'rgba(201,77,52,.12)',
        '--jade':'#5a9a5a','--jade-dim':'rgba(90,154,90,.1)',
        '--gold-leaf':'#c99440','--gold-dim':'rgba(212,144,64,.12)',
        '--card':'#1b120b','--card-h':'#2b1d12',
        '--bg-gradient':'linear-gradient(180deg,#0f0a05,#1b120b)'
      }
    },
    'misty-blue': {
      name: '雾蓝', icon: '☁',
      vars: {
        '--bg':'#0d1018','--bg2':'#141923','--bg3':'#1e2430',
        '--fg':'#dfe5f2','--fg-dim':'#9aa4ba','--muted':'#626b80',
        '--accent':'#8294c8','--accent-2':'#c49b78','--accent-3':'#61aa99',
        '--line':'#242a39','--line-2':'#333b4d',
        '--cinnabar':'#bb5555','--cinnabar-dim':'rgba(187,85,85,.12)',
        '--jade':'#5b9c7a','--jade-dim':'rgba(91,156,122,.1)',
        '--gold-leaf':'#b4a466','--gold-dim':'rgba(130,148,200,.12)',
        '--card':'#141923','--card-h':'#1e2430',
        '--bg-gradient':'linear-gradient(180deg,#0d1018,#141923)'
      }
    },
    'midnight-cyan': {
      name: '午夜青', icon: '◆',
      vars: {
        '--bg':'#051015','--bg2':'#0a1b21','--bg3':'#102b33',
        '--fg':'#e7f7f8','--fg-dim':'#9bc6ca','--muted':'#5a8288',
        '--accent':'#38c8d6','--accent-2':'#ff7a59','--accent-3':'#9fe870',
        '--line':'#163039','--line-2':'#21434d',
        '--cinnabar':'#ef5f54','--cinnabar-dim':'rgba(239,95,84,.12)',
        '--jade':'#3fcf8e','--jade-dim':'rgba(63,207,142,.1)',
        '--gold-leaf':'#e0c46c','--gold-dim':'rgba(56,200,214,.12)',
        '--card':'#0a1b21','--card-h':'#102b33',
        '--bg-gradient':'linear-gradient(180deg,#051015,#0a1b21)'
      }
    },
    'lotus-ink': {
      name: '莲墨', icon: '✿',
      vars: {
        '--bg':'#0c0a12','--bg2':'#151321','--bg3':'#211d32',
        '--fg':'#f1edf7','--fg-dim':'#b9adc8','--muted':'#7d728d',
        '--accent':'#e0a8c8','--accent-2':'#86d0c4','--accent-3':'#c7b6ff',
        '--line':'#27223a','--line-2':'#3a3350',
        '--cinnabar':'#d65a78','--cinnabar-dim':'rgba(214,90,120,.12)',
        '--jade':'#66bfae','--jade-dim':'rgba(102,191,174,.1)',
        '--gold-leaf':'#d8bd7a','--gold-dim':'rgba(224,168,200,.12)',
        '--card':'#151321','--card-h':'#211d32',
        '--bg-gradient':'linear-gradient(180deg,#0c0a12,#151321)'
      }
    },
    'sunrise-peach-dark': {
      name: '暗桃', icon: '◐',
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
      }
    },
    'neon-night': {
      name: '霓虹夜', icon: '▣',
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
      }
    },
    'wine-cellar': {
      name: '酒窖', icon: '◈',
      vars: {
        '--bg':'#10070d','--bg2':'#1b0d16','--bg3':'#2d1424',
        '--fg':'#f6e8ef','--fg-dim':'#c59bad','--muted':'#80586a',
        '--accent':'#c96f91','--accent-2':'#e0a45d','--accent-3':'#6fb8a8',
        '--line':'#301b28','--line-2':'#452537',
        '--cinnabar':'#ce496b','--cinnabar-dim':'rgba(206,73,107,.12)',
        '--jade':'#5eb39c','--jade-dim':'rgba(94,179,156,.1)',
        '--gold-leaf':'#d2a45d','--gold-dim':'rgba(201,111,145,.12)',
        '--card':'#1b0d16','--card-h':'#2d1424',
        '--bg-gradient':'linear-gradient(180deg,#10070d,#1b0d16)'
      }
    },
    'copper-night': {
      name: '铜夜', icon: '◇',
      vars: {
        '--bg':'#0d0805','--bg2':'#18100b','--bg3':'#271912',
        '--fg':'#f3e6d9','--fg-dim':'#b99578','--muted':'#765846',
        '--accent':'#c97d4a','--accent-2':'#e45a47','--accent-3':'#5ea890',
        '--line':'#2a1c14','--line-2':'#3d281c',
        '--cinnabar':'#d24e3c','--cinnabar-dim':'rgba(210,78,60,.12)',
        '--jade':'#5aa084','--jade-dim':'rgba(90,160,132,.1)',
        '--gold-leaf':'#c89a57','--gold-dim':'rgba(201,125,74,.12)',
        '--card':'#18100b','--card-h':'#271912',
        '--bg-gradient':'linear-gradient(180deg,#0d0805,#18100b)'
      }
    },
    'polar-night': {
      name: '极夜', icon: '◌',
      vars: {
        '--bg':'#070b12','--bg2':'#0e1520','--bg3':'#182231',
        '--fg':'#edf6ff','--fg-dim':'#a8b8c9','--muted':'#68798a',
        '--accent':'#9bdcff','--accent-2':'#c9a7ff','--accent-3':'#80e0c0',
        '--line':'#1d2a3a','--line-2':'#2b3a4d',
        '--cinnabar':'#d86a78','--cinnabar-dim':'rgba(216,106,120,.12)',
        '--jade':'#6ed0aa','--jade-dim':'rgba(110,208,170,.1)',
        '--gold-leaf':'#e0c57a','--gold-dim':'rgba(155,220,255,.12)',
        '--card':'#0e1520','--card-h':'#182231',
        '--bg-gradient':'linear-gradient(180deg,#070b12,#0e1520)'
      }
    },
    'moss-stone': {
      name: '苔石', icon: '⬟',
      vars: {
        '--bg':'#090e0b','--bg2':'#111912','--bg3':'#1b261d',
        '--fg':'#e8eddf','--fg-dim':'#a8b396','--muted':'#69745b',
        '--accent':'#a8c66c','--accent-2':'#d18a5c','--accent-3':'#70a8a0',
        '--line':'#20291f','--line-2':'#303b2d',
        '--cinnabar':'#c95d4b','--cinnabar-dim':'rgba(201,93,75,.12)',
        '--jade':'#83b06e','--jade-dim':'rgba(131,176,110,.1)',
        '--gold-leaf':'#c8b36b','--gold-dim':'rgba(168,198,108,.12)',
        '--card':'#111912','--card-h':'#1b261d',
        '--bg-gradient':'linear-gradient(180deg,#090e0b,#111912)'
      }
    },
    'royal-indigo': {
      name: '靛蓝', icon: '⬢',
      vars: {
        '--bg':'#090a18','--bg2':'#11142a','--bg3':'#1b1f42',
        '--fg':'#eeeaff','--fg-dim':'#b2aee0','--muted':'#706b9a',
        '--accent':'#8ea2ff','--accent-2':'#ff8eb3','--accent-3':'#72d6c9',
        '--line':'#25284a','--line-2':'#343862',
        '--cinnabar':'#e06080','--cinnabar-dim':'rgba(224,96,128,.12)',
        '--jade':'#63c7b7','--jade-dim':'rgba(99,199,183,.1)',
        '--gold-leaf':'#d6bd72','--gold-dim':'rgba(142,162,255,.12)',
        '--card':'#11142a','--card-h':'#1b1f42',
        '--bg-gradient':'linear-gradient(180deg,#090a18,#11142a)'
      }
    },
    'black-amber': {
      name: '黑琥珀', icon: '⬥',
      vars: {
        '--bg':'#060504','--bg2':'#100c08','--bg3':'#1d150d',
        '--fg':'#f4eadc','--fg-dim':'#b9a27f','--muted':'#75624a',
        '--accent':'#f0b75e','--accent-2':'#e66745','--accent-3':'#61b99a',
        '--line':'#24190e','--line-2':'#382512',
        '--cinnabar':'#d9553a','--cinnabar-dim':'rgba(217,85,58,.12)',
        '--jade':'#56a985','--jade-dim':'rgba(86,169,133,.1)',
        '--gold-leaf':'#f0b75e','--gold-dim':'rgba(240,183,94,.12)',
        '--card':'#100c08','--card-h':'#1d150d',
        '--bg-gradient':'linear-gradient(180deg,#060504,#100c08)'
      }
    }
  };

  var CUSTOM_THEME_ID = 'custom';
  var CUSTOM_THEME_KEY = '_customTheme';
  var CUSTOM_FIELDS = [
    ['--bg', '背景', '#080808'],
    ['--bg2', '面板', '#121212'],
    ['--bg3', '浮层', '#1c1c1c'],
    ['--card', '卡片', '#141414'],
    ['--card-h', '卡片悬停', '#202020'],
    ['--fg', '主文字', '#f2f2f2'],
    ['--fg-dim', '次文字', '#a8a8a8'],
    ['--muted', '弱文字', '#686868'],
    ['--accent', '主色', '#d4a574'],
    ['--accent-2', '强调二', '#e85d5d'],
    ['--accent-3', '强调三', '#5fa0a0']
  ];

  function hexToRgb(hex) {
    var h = String(hex || '').replace('#','').trim();
    if (h.length === 3) h = h.split('').map(function(ch){ return ch + ch; }).join('');
    var n = parseInt(h, 16);
    if (isNaN(n)) return { r: 212, g: 165, b: 116 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgba(hex, alpha) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
  }

  function safeHex(value, fallback) {
    value = String(value || '').trim();
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
  }

  function buildCustomTheme(raw) {
    raw = raw || {};
    var base = THEMES['warm-dark'].vars;
    var vars = {};
    CUSTOM_FIELDS.forEach(function(field) {
      vars[field[0]] = safeHex(raw[field[0]], field[2]);
    });
    vars['--line'] = raw['--line'] || base['--line'];
    vars['--line-2'] = raw['--line-2'] || base['--line-2'];
    vars['--cinnabar'] = vars['--accent-2'];
    vars['--cinnabar-dim'] = rgba(vars['--accent-2'], .12);
    vars['--jade'] = vars['--accent-3'];
    vars['--jade-dim'] = rgba(vars['--accent-3'], .1);
    vars['--gold-leaf'] = vars['--accent'];
    vars['--gold-dim'] = rgba(vars['--accent'], .12);
    vars['--bg-gradient'] = 'linear-gradient(180deg,' + vars['--bg'] + ',' + vars['--bg2'] + ')';
    return { name: raw.name || '自定义', icon: raw.icon || '🎨', vars: vars, custom: true };
  }

  function loadCustomTheme() {
    try {
      var saved = JSON.parse(localStorage.getItem(CUSTOM_THEME_KEY) || '{}');
      THEMES[CUSTOM_THEME_ID] = buildCustomTheme(saved);
    } catch(e) {
      THEMES[CUSTOM_THEME_ID] = buildCustomTheme({});
    }
  }

  function saveCustomTheme(raw) {
    localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(raw));
    THEMES[CUSTOM_THEME_ID] = buildCustomTheme(raw);
    applyTheme(CUSTOM_THEME_ID);
  }

  loadCustomTheme();

  var currentTheme = localStorage.getItem('_theme');
  if (!currentTheme || !THEMES[currentTheme]) currentTheme = 'warm-dark';

  var css = document.createElement('style');
  document.head.appendChild(css);

  function applyTheme(id) {
    var t = THEMES[id];
    if (!t) return;
    currentTheme = id;
    Object.keys(THEMES).forEach(function(themeId) {
      document.documentElement.classList.remove('t-' + themeId);
    });
    document.documentElement.classList.add('t-' + id);

    var varCss = '.t-' + id + '{';
    Object.keys(t.vars).forEach(function(k) {
      varCss += k + ':' + t.vars[k] + ';';
    });
    varCss += '}';
    css.textContent = varCss;
    localStorage.setItem('_theme', id);
    updateBtn();
  }

  function updateBtn() {
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    var t = THEMES[currentTheme];
    btn.innerHTML = '<span class="bb-icon">' + t.icon + '</span><span class="lb-lbl">' + t.name + '</span>';
  }

  var pickerEl = null;

  function customThemeValues() {
    try {
      var saved = JSON.parse(localStorage.getItem(CUSTOM_THEME_KEY) || '{}');
      var theme = buildCustomTheme(saved);
      return theme.vars;
    } catch(e) {
      return buildCustomTheme({}).vars;
    }
  }

  function customEditorHtml() {
    var values = customThemeValues();
    var html = '<div class="tp-custom">';
    html += '<div class="tp-custom-title">自定义主题颜色</div>';
    html += '<div class="tp-custom-grid">';
    CUSTOM_FIELDS.forEach(function(field) {
      var key = field[0];
      html += '<label class="tp-color-row">';
      html += '<span>' + field[1] + '</span>';
      html += '<input type="color" data-var="' + key + '" value="' + (values[key] || field[2]) + '">';
      html += '</label>';
    });
    html += '</div>';
    html += '<div class="tp-custom-actions">';
    html += '<button class="tp-save-custom" type="button">保存自定义</button>';
    html += '<button class="tp-reset-custom" type="button">恢复默认</button>';
    html += '</div></div>';
    return html;
  }

  function showPicker() {
    hidePicker();
    var btn = document.getElementById('themeBtn');
    if (!btn) return;

    pickerEl = document.createElement('div');
    pickerEl.className = 'theme-picker';

    var html = '';
    Object.keys(THEMES).forEach(function(id) {
      var t = THEMES[id];
      var active = id === currentTheme ? ' tp-a' : '';
      var dotColor = t.vars['--accent'] || '#888';
      html += '<button class="tp-item' + active + '" data-theme="' + id + '" type="button">';
      html += '<span class="tp-dot" style="background:' + dotColor + '"></span>';
      html += '<span class="tp-label">' + t.icon + ' ' + t.name + '</span>';
      html += active ? '<span class="tp-check">✓</span>' : '';
      html += '</button>';
    });
    html += customEditorHtml();
    pickerEl.innerHTML = html;
    document.body.appendChild(pickerEl);

    pickerEl.addEventListener('click', function(e) {
      var item = e.target.closest('.tp-item');
      if (item) {
        var tid = item.dataset.theme;
        if (tid && THEMES[tid]) {
          applyTheme(tid);
          hidePicker();
        }
        return;
      }

      if (e.target.closest('.tp-save-custom')) {
        var raw = { name: '自定义', icon: '🎨' };
        pickerEl.querySelectorAll('.tp-custom input[type="color"]').forEach(function(input) {
          raw[input.dataset.var] = input.value;
        });
        saveCustomTheme(raw);
        hidePicker();
        if (typeof showToast === 'function') showToast('🎨 自定义主题已保存');
        return;
      }

      if (e.target.closest('.tp-reset-custom')) {
        localStorage.removeItem(CUSTOM_THEME_KEY);
        THEMES[CUSTOM_THEME_ID] = buildCustomTheme({});
        applyTheme(CUSTOM_THEME_ID);
        hidePicker();
        if (typeof showToast === 'function') showToast('🎨 自定义主题已恢复默认');
      }
    });

    setTimeout(function() {
      document.addEventListener('click', pickerOutside, true);
    }, 10);
  }

  function pickerOutside(e) {
    var btn = document.getElementById('themeBtn');
    if (pickerEl && !pickerEl.contains(e.target) && btn && e.target !== btn && !btn.contains(e.target)) {
      hidePicker();
    }
  }

  function hidePicker() {
    if (pickerEl) {
      pickerEl.remove();
      pickerEl = null;
    }
    document.removeEventListener('click', pickerOutside, true);
  }

  var pStyle = document.createElement('style');
  pStyle.textContent =
    '.theme-picker{position:fixed;bottom:clamp(2.5rem,4vw,3.2rem);left:50%;transform:translateX(-50%);z-index:300;' +
    'background:var(--bg3);border:1px solid var(--line-2);border-radius:12px;padding:clamp(.35rem,.5vw,.45rem);' +
    'box-shadow:0 8px 40px rgba(0,0,0,.6);display:flex;gap:clamp(.2rem,.3vw,.3rem);flex-wrap:wrap;' +
    'justify-content:center;max-width:clamp(340px,88vw,780px);max-height:min(58vh,420px);overflow:auto}' +
    '.tp-item{display:flex;align-items:center;gap:clamp(.2rem,.3vw,.25rem);padding:clamp(.25rem,.35vw,.3rem) clamp(.35rem,.5vw,.45rem);' +
    'border-radius:8px;cursor:pointer;transition:background .15s,border-color .15s;border:1px solid transparent;background:transparent;color:var(--fg);font-family:var(--font-sans)}' +
    '.tp-item:hover{background:rgba(255,255,255,.06);border-color:var(--line)}' +
    '.tp-item.tp-a{border-color:var(--accent);background:rgba(255,255,255,.04)}' +
    '.tp-dot{width:clamp(10px,1.2vw,12px);height:clamp(10px,1.2vw,12px);border-radius:50%;flex-shrink:0;border:1.5px solid rgba(255,255,255,.15)}' +
    '.tp-label{font-size:clamp(.5rem,.75vw,.55rem);color:var(--fg);white-space:nowrap}' +
    '.tp-check{font-size:clamp(.45rem,.65vw,.5rem);color:var(--accent);margin-left:.05rem}' +
    '.tp-custom{width:100%;border-top:1px solid var(--line);margin-top:.25rem;padding-top:.35rem}' +
    '.tp-custom-title{font-size:clamp(.55rem,.8vw,.62rem);color:var(--accent);letter-spacing:.08em;margin:0 0 .3rem;text-align:center}' +
    '.tp-custom-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:.25rem}' +
    '.tp-color-row{display:flex;align-items:center;justify-content:space-between;gap:.35rem;border:1px solid var(--line);border-radius:8px;padding:.22rem .32rem;background:rgba(255,255,255,.025)}' +
    '.tp-color-row span{font-size:clamp(.5rem,.75vw,.55rem);color:var(--fg-dim);white-space:nowrap}' +
    '.tp-color-row input{width:30px;height:22px;border:0;background:transparent;padding:0;cursor:pointer}' +
    '.tp-custom-actions{display:flex;gap:.3rem;justify-content:center;margin-top:.35rem;flex-wrap:wrap}' +
    '.tp-custom-actions button{border:1px solid var(--line-2);border-radius:999px;background:rgba(255,255,255,.04);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.52rem,.78vw,.58rem);padding:.22rem .55rem;cursor:pointer}' +
    '.tp-save-custom{border-color:var(--accent)!important;color:var(--accent)!important;background:rgba(212,165,116,.08)!important}';
  document.head.appendChild(pStyle);

  applyTheme(currentTheme);

  var btn = document.getElementById('themeBtn');
  if (btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (pickerEl) hidePicker();
      else showPicker();
    });
  }
})();
