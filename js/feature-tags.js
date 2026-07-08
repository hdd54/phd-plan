// ===== FEATURE: Task Tags (v2 - 13 colors + compact) =====
// Loaded after core.js, overrides inline tag system

(function(){
  // Skip if already loaded
  if(window.__features['tags']) return;
  window.__features['tags'] = true;

  // ===== Tag Color Definitions (13 colors) =====
  // TAG_COLORS and TAG_KEYS are in core.js
  var TAG_LABELS = {};
  var TAG_SHORT = {};
  TAG_KEYS.forEach(function(k){
    TAG_LABELS[k] = TAG_COLORS[k].label;
    TAG_SHORT[k] = TAG_COLORS[k].label ? TAG_COLORS[k].label.charAt(0) : '';
  });

  // ===== Inject compact tag CSS =====
  var style = document.createElement('style');
  style.textContent = `
    /* Compact tag layout */
    .dr{display:flex;align-items:center;gap:clamp(.12rem,.2vw,.2rem);padding:clamp(.15rem,.25vw,.2rem) clamp(.1rem,.15vw,.15rem);flex-wrap:nowrap;min-height:clamp(26px,2.8vw,32px)}
    .dl{flex-shrink:0;width:clamp(32px,5vw,40px);font-size:clamp(.5rem,.8vw,.55rem)}
    .di{flex:1;min-width:0;padding:clamp(.15rem,.25vw,.2rem) clamp(.2rem,.3vw,.25rem);border:none;background:transparent;color:var(--fg);font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.6rem);resize:none;outline:none;overflow:hidden;line-height:1.4}
    .dc{flex-shrink:0;width:clamp(14px,1.8vw,16px);height:clamp(14px,1.8vw,16px)}
    .md-btn,.journal-btn{flex-shrink:0;font-size:clamp(.4rem,.6vw,.45rem);padding:.02rem .15rem}
    /* Tag dot with short label */
    .tg-wrap{display:inline-flex;align-items:center;gap:2px;flex-shrink:0;position:relative;cursor:pointer;margin:0 1px}
    .tag-dot2{width:clamp(8px,1vw,10px);height:clamp(8px,1vw,10px);border-radius:50%;flex-shrink:0;transition:transform .15s}
    .tag-dot2:hover{transform:scale(1.4)}
    .tag-dot2.n{background:var(--line-2);opacity:.4}
    .tag-dot2.r{background:#e74c3c}.tag-dot2.g{background:#2ecc71}.tag-dot2.y{background:#c9a040}
    .tag-dot2.b{background:var(--accent-3)}.tag-dot2.p{background:#8b5cf6}.tag-dot2.o{background:#d4a574}
    .tag-dot2.k{background:#e91e63}.tag-dot2.t{background:#00bcd4}.tag-dot2.s{background:#64b5f6}
    .tag-dot2.l{background:#8bc34a}.tag-dot2.w{background:#795548}.tag-dot2.v{background:#9e9e9e}
    /* Compact inline picker */
    .tg-picker{display:none;position:absolute;top:100%;left:50%;transform:translateX(-50%);z-index:50;background:var(--bg3);border:1px solid var(--line);border-radius:8px;padding:3px;box-shadow:0 8px 32px rgba(0,0,0,.5);white-space:nowrap;margin-top:3px}
    .tg-picker.s{display:flex;gap:2px;flex-wrap:wrap;width:max-content}
    .tg-picker .tgp-btn{width:clamp(10px,1.2vw,12px);height:clamp(10px,1.2vw,12px);border-radius:50%;border:1.5px solid transparent;cursor:pointer;padding:0;background:transparent;transition:all .15s}
    .tg-picker .tgp-btn:hover{transform:scale(1.3)}
    .tg-picker .tgp-btn.a{border-color:var(--accent);box-shadow:0 0 6px rgba(212,165,116,.4);transform:scale(1.2)}
    .tgp-n{background:var(--line-2);opacity:.4}
    .tgp-r{background:#e74c3c}.tgp-g{background:#2ecc71}.tgp-y{background:#c9a040}
    .tgp-b{background:var(--accent-3)}.tgp-p{background:#8b5cf6}.tgp-o{background:#d4a574}
    .tgp-k{background:#e91e63}.tgp-t{background:#00bcd4}.tgp-s{background:#64b5f6}
    .tgp-l{background:#8bc34a}.tgp-w{background:#795548}.tgp-v{background:#9e9e9e}
    /* Compact filter bar */
    .tag-filter-bar2{display:flex;gap:.15rem;align-items:center;padding:clamp(.1rem,.2vw,.15rem) 0;flex-wrap:wrap}
    .tag-filter-bar2 .tfb-lbl{font-size:clamp(.45rem,.65vw,.5rem);color:var(--muted);margin-right:.05rem}
    .tag-filter-bar2 .tfb-b2{width:clamp(8px,1vw,10px);height:clamp(8px,1vw,10px);border-radius:50%;border:1px solid var(--line-2);cursor:pointer;padding:0;background:transparent;transition:all .15s}
    .tag-filter-bar2 .tfb-b2.a{border-color:var(--accent);box-shadow:0 0 4px rgba(212,165,116,.3)}
    .tag-filter-bar2 .tfb-b2.a::after{content:'';position:absolute;inset:1px;border-radius:50%;background:rgba(212,165,116,.5)}
    .tag-filter-bar2 .tfb-clr{font-size:clamp(.4rem,.6vw,.45rem);color:var(--muted);cursor:pointer;border:none;background:none;font-family:var(--font-sans);padding:.02rem .08rem}
    .tag-filter-bar2 .tfb-clr:hover{color:var(--accent)}
    /* Hide old tag elements */
    .tag-dot,.tag-picker,.tag-filter-bar{display:none!important}
  `;
  document.head.appendChild(style);

  // ===== Get task tag from data =====
  function getTaskTag(cid, wi, di){
    try {
      var _d = window.data || {};
      var t = _d[cid][wi].d[di];
      if(typeof t === 'object' && t.tag) return t.tag;
    } catch(e){}
    return '';
  }

  function setTaskTag(cid, wi, di, tagVal){
    var _d = window.data;
    if(!_d || !_d[cid] || !_d[cid][wi]) return;
    if(!_d[cid][wi].d) _d[cid][wi].d = [];
    if(!_d[cid][wi].d[di]) _d[cid][wi].d[di] = '';
    var td = _d[cid][wi].d[di];
    if(typeof td === 'string') _d[cid][wi].d[di] = { text: td, done: false, tag: tagVal };
    else td.tag = tagVal;
    save();
  }

  // ===== Enhance a single row with compact tag =====
  function enhanceRow(row){
    if(row.querySelector('.tg-wrap')) return;
    var textarea = row.querySelector('.di');
    if(!textarea) return;
    var cid = textarea.dataset.c, wi = parseInt(textarea.dataset.wi), di = parseInt(textarea.dataset.di);
    if(isNaN(wi) || isNaN(di)) return;

    var tag = getTaskTag(cid, wi, di);

    // Create tag wrapper
    var wrap = document.createElement('span');
    wrap.className = 'tg-wrap';

    // Create dot
    var dot = document.createElement('span');
    dot.className = 'tag-dot2 ' + (tag ? tag : 'n');
    wrap.appendChild(dot);

    // Create inline picker
    var picker = document.createElement('span');
    picker.className = 'tg-picker';
    // Add tag buttons in 2 rows
    var row1 = document.createElement('span');
    row1.style.cssText = 'display:flex;gap:2px';
    var row2 = document.createElement('span');
    row2.style.cssText = 'display:flex;gap:2px;margin-top:2px';
    TAG_KEYS.forEach(function(t, i){
      var btn = document.createElement('button');
      btn.className = 'tgp-btn tgp-' + (t || 'n');
      btn.title = TAG_COLORS[t].label;
      if(t === tag) btn.classList.add('a');
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        if(t === tag) t = ''; // toggle off
        setTaskTag(cid, wi, di, t);
        dot.className = 'tag-dot2 ' + (t || 'n');
        dot.title = TAG_COLORS[t].label;
        picker.querySelectorAll('.tgp-btn').forEach(function(b){ b.classList.remove('a'); });
        if(t) btn.classList.add('a');
        // Update filter
        applyTagFilter();
      });
      if(i < 7) row1.appendChild(btn);
      else row2.appendChild(btn);
    });
    picker.appendChild(row1);
    if(TAG_KEYS.length > 7) picker.appendChild(row2);
    wrap.appendChild(picker);

    // Toggle picker on dot click
    dot.addEventListener('click', function(e){
      e.stopPropagation();
      var all = document.querySelectorAll('.tg-picker.s');
      all.forEach(function(p){ if(p !== picker) p.classList.remove('s'); });
      picker.classList.toggle('s');
    });

    // Close picker on outside click
    document.addEventListener('click', function(e){
      if(!wrap.contains(e.target)) picker.classList.remove('s');
    });

    // Insert before day label (left side, avoid md-btn overlap on right)
    var dl2 = row.querySelector('.dl');
    if(dl2) row.insertBefore(wrap, dl2);
    else row.appendChild(wrap);
  }

  // ===== Apply tag filter =====
  var activeTagFilter = '';
  function applyTagFilter(){
    document.querySelectorAll('.weeks-wrap .dr').forEach(function(row){
      var tg = row.querySelector('.tg-wrap');
      if(!activeTagFilter) row.style.display = '';
      else {
        var dot = tg ? tg.querySelector('.tag-dot2') : null;
        var tagKey = '';
        if(dot){
          for(var k in TAG_COLORS){
            if(dot.classList.contains(k)){ tagKey = k; break; }
          }
        }
        row.style.display = (tagKey === activeTagFilter) ? '' : 'none';
      }
    });
  }

  // ===== Build compact filter bar =====
  function buildFilterBar(wrap){
    if(wrap.querySelector('.tag-filter-bar2')) return;
    var bar = document.createElement('div');
    bar.className = 'tag-filter-bar2';
    bar.innerHTML = '<span class="tfb-lbl">🏷</span>';

    TAG_KEYS.forEach(function(t){
      var btn = document.createElement('button');
      btn.className = 'tfb-b2';
      // Set background color via inline style
      var bg = TAG_COLORS[t].bg;
      btn.style.background = (t ? bg : 'var(--line-2)');
      btn.style.position = 'relative';
      if(t) btn.style.opacity = '0.5';
      else { btn.style.opacity = '0.3'; }
      btn.title = TAG_COLORS[t].label;

      btn.addEventListener('click', function(){
        if(activeTagFilter === t) activeTagFilter = '';
        else activeTagFilter = t;
        bar.querySelectorAll('.tfb-b2').forEach(function(b){
          b.classList.remove('a');
          b.style.opacity = (b.title && activeTagFilter === b.title.split('(')[0].trim()) ? '1' : (b.title ? '0.5' : '0.3');
        });
        if(activeTagFilter) {
          btn.classList.add('a');
          btn.style.opacity = '1';
        }
        applyTagFilter();
      });
      bar.appendChild(btn);
    });

    var clear = document.createElement('button');
    clear.className = 'tfb-clr';
    clear.textContent = '✕';
    clear.addEventListener('click', function(){
      activeTagFilter = '';
      bar.querySelectorAll('.tfb-b2').forEach(function(b){
        b.classList.remove('a');
        b.style.opacity = b.title ? '0.5' : '0.3';
      });
      applyTagFilter();
    });
    bar.appendChild(clear);
    wrap.parentNode.insertBefore(bar, wrap);
  }

  // ===== Main enhance function =====
  function enhanceAll(){
    document.querySelectorAll('.weeks-wrap').forEach(function(wrap){
      wrap.querySelectorAll('.dr').forEach(enhanceRow);
      buildFilterBar(wrap);
    });
  }

  // ===== Patch renderWeeks =====
  var origRender = window.renderWeeks;
  window.renderWeeks = function(cid){
    origRender.call(this, cid);
    setTimeout(enhanceAll, 30);
  };

  // ===== Initial run =====
  setTimeout(enhanceAll, 500);
  // Also run on dynamic content changes
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(enhanceAll, 1000); });

  // Re-run when weeks are re-rendered (e.g. add week, delete week)
  var origAddWeek = window.addWeek;
  if(origAddWeek){
    window.addWeek = function(){
      origAddWeek.apply(this, arguments);
      setTimeout(enhanceAll, 100);
    };
  }

  console.log('feature-tags: loaded (13 colors, compact)');
})();
