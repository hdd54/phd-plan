// ===== FEATURE: Task Search & Filter =====
(function(){
  if(window.__features['search']) return;
  window.__features['search'] = true;

  // ===== Inject search bar CSS =====
  var style = document.createElement('style');
  style.textContent =
    '.search-bar-wrap{display:flex;align-items:center;gap:.25rem;padding:.15rem 0}' +
    '.search-input{flex:1;background:var(--bg2);border:1px solid var(--line);border-radius:var(--rs);padding:.08rem .22rem;color:var(--fg);font-family:var(--font-sans);font-size:clamp(.5rem,.75vw,.55rem);outline:none;transition:border-color .2s}' +
    '.search-input:focus{border-color:var(--accent)}' +
    '.search-input::placeholder{color:var(--muted);font-size:clamp(.45rem,.65vw,.5rem)}' +
    '.search-count{font-size:clamp(.4rem,.6vw,.45rem);color:var(--muted);white-space:nowrap;flex-shrink:0;min-width:2.5rem;text-align:right}' +
    '.search-clear{font-size:clamp(.45rem,.65vw,.5rem);color:var(--muted);cursor:pointer;border:none;background:none;font-family:var(--font-sans);padding:.02rem .08rem;flex-shrink:0;line-height:1}' +
    '.search-clear:hover{color:var(--accent)}' +
    '.dr.search-hidden{display:none!important}';
  document.head.appendChild(style);

  // ===== Setup search bar for a weeks-wrap =====
  function setupSearch(wrap) {
    var parent = wrap.parentNode;
    if(parent.querySelector('.search-bar-wrap')) return;

    var bar = document.createElement('div');
    bar.className = 'search-bar-wrap';

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'search-input';
    input.placeholder = '搜索任务...';

    var count = document.createElement('span');
    count.className = 'search-count';

    var clear = document.createElement('button');
    clear.className = 'search-clear';
    clear.textContent = '\u2715';
    clear.style.display = 'none';

    bar.appendChild(input);
    bar.appendChild(count);
    bar.appendChild(clear);

    // Insert above the tag filter bar (or before weeks-wrap)
    var tagBar = parent.querySelector('.tag-filter-bar2') || parent.querySelector('.tag-filter-bar');
    if(tagBar) {
      parent.insertBefore(bar, tagBar);
    } else {
      parent.insertBefore(bar, wrap);
    }

    // Debounced search on input
    input.addEventListener('input', function(e) {
      var inp = e.target;
      if(inp._timer) clearTimeout(inp._timer);
      inp._timer = setTimeout(function() {
        inp._timer = null;
        var sb = inp.closest('.search-bar-wrap');
        if(!sb) return;
        var w = sb.parentNode.querySelector('.weeks-wrap');
        if(w) doSearch(w, inp.value);
      }, 300);
    });

    // Clear button
    clear.addEventListener('click', function() {
      input.value = '';
      clear.style.display = 'none';
      var sb = input.closest('.search-bar-wrap');
      if(sb) {
        var w = sb.parentNode.querySelector('.weeks-wrap');
        if(w) doSearch(w, '');
      }
      input.focus();
    });
  }

  // ===== Apply search filter on a weeks-wrap =====
  function doSearch(wrap, query) {
    var parent = wrap.parentNode;
    var bar = parent.querySelector('.search-bar-wrap');
    if(!bar) return;
    var countEl = bar.querySelector('.search-count');
    var clearEl = bar.querySelector('.search-clear');

    if(query) {
      clearEl.style.display = '';
    } else {
      clearEl.style.display = 'none';
    }

    var q = query.toLowerCase();
    var rows = wrap.querySelectorAll('.dr');

    // Apply search filter (class-based, works with tag filter's inline style)
    for(var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var ta = row.querySelector('.di');
      var match = !query || (ta && ta.value.toLowerCase().indexOf(q) !== -1);
      if(match) {
        row.classList.remove('search-hidden');
      } else {
        row.classList.add('search-hidden');
      }
    }

    // Count rows visible after BOTH search AND tag filter
    var visibleCount = 0;
    for(var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if(!row.classList.contains('search-hidden') && row.style.display !== 'none') {
        visibleCount++;
      }
    }

    if(query) {
      countEl.textContent = '找到 ' + visibleCount + ' 项';
    } else {
      countEl.textContent = '';
    }
  }

  // ===== Update match count when tag filter changes =====
  document.addEventListener('click', function(e) {
    var t = e.target;
    if(t.classList.contains('tfb-b2') || t.classList.contains('tfb-clr')) {
      setTimeout(function() {
        var bars = document.querySelectorAll('.search-bar-wrap');
        for(var i = 0; i < bars.length; i++) {
          var sb = bars[i];
          var inp = sb.querySelector('.search-input');
          if(inp && inp.value) {
            var w = sb.parentNode.querySelector('.weeks-wrap');
            if(w) doSearch(w, inp.value);
          }
        }
      }, 0);
    }
  });

  // ===== Initialize all weeks-wraps =====
  function initAll() {
    var wraps = document.querySelectorAll('.weeks-wrap');
    for(var i = 0; i < wraps.length; i++) {
      setupSearch(wraps[i]);
    }
  }

  // ===== Patch renderWeeks to re-init after re-render =====
  var _rw = window.renderWeeks;
  if(_rw) {
    window.renderWeeks = function(cid) {
      _rw.call(this, cid);
      setTimeout(initAll, 80);
    };
  }

  // ===== Initial run (800ms delay matches other features) =====
  setTimeout(initAll, 800);
})();
