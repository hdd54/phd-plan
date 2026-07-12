// ===== FEATURE: Real Calendar (with day-click tag/event editor) =====
(function(){
  if(window.__features['realcalendar']) return;
  window.__features['realcalendar'] = true;

  var OVERLAY_ID = 'rcOverlay';
  var MODAL_ID = 'rcModal';
  var BODY_ID = 'rcBody';
  var BTN_ID = 'rcBtn';

  var MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var DAY_NAMES = ['一','二','三','四','五','六','日'];

  // ===== State =====
  var viewYear, viewMonth;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .rc-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:clamp(.45rem,.7vw,.52rem)}
    .rc-grid .rc-hdr{padding:clamp(.08rem,.15vw,.12rem);text-align:center;color:var(--muted);font-weight:600;letter-spacing:.05em;font-size:clamp(.45rem,.65vw,.5rem)}
    .rc-grid .rc-cell{position:relative;padding:clamp(.2rem,.3vw,.25rem);text-align:center;border-radius:4px;cursor:pointer;transition:all .15s;min-height:clamp(36px,4vw,48px);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;border:1.5px solid transparent;background:rgba(255,255,255,.015)}
    .rc-grid .rc-cell:hover{background:rgba(255,255,255,.04);border-color:var(--line-2)}
    .rc-grid .rc-cell.rc-other{opacity:.25;pointer-events:none}
    .rc-grid .rc-cell.rc-today{border-color:var(--accent)!important;box-shadow:0 0 8px rgba(212,165,116,.3)}
    .rc-grid .rc-cell.rc-has-event{background:rgba(212,165,116,.14);border-color:rgba(212,165,116,.52);box-shadow:inset 0 0 0 1px rgba(212,165,116,.14)}
    .rc-grid .rc-cell.rc-has-event .rc-day{color:var(--accent);font-weight:700}
    .rc-grid .rc-cell.rc-reminder{background:color-mix(in srgb,var(--accent) 18%,transparent);border-color:var(--accent);box-shadow:0 0 12px rgba(212,165,116,.34),inset 0 0 0 1px rgba(255,255,255,.08)}
    .rc-grid .rc-cell .rc-day{font-size:clamp(.5rem,.75vw,.58rem);line-height:1.2}
    .rc-grid .rc-cell .rc-cnt{position:absolute;top:1px;right:3px;font-size:clamp(.35rem,.45vw,.4rem);color:var(--fg);background:rgba(212,165,116,.2);border:1px solid rgba(212,165,116,.34);border-radius:8px;padding:0 3px;line-height:1.2}
    .rc-grid .rc-cell .rc-remind-dot{position:absolute;left:3px;bottom:2px;color:var(--accent);font-size:clamp(.36rem,.52vw,.42rem);letter-spacing:.02em}
    .rc-nav{display:flex;align-items:center;justify-content:space-between;gap:clamp(.15rem,.3vw,.25rem);padding:0 0 clamp(.3rem,.5vw,.4rem) 0;margin-bottom:clamp(.2rem,.4vw,.3rem);border-bottom:1px solid var(--line)}
    .rc-nav .rc-title{font-family:var(--font-serif);font-size:clamp(.75rem,1.3vw,.95rem);color:var(--fg);font-weight:400;letter-spacing:.05em;cursor:pointer;padding:.05rem .25rem;border-radius:6px;transition:all .15s;user-select:none}
    .rc-nav .rc-title:hover{background:rgba(255,255,255,.06)}
    .rc-nav .rc-btn{background:rgba(255,255,255,.04);border:1px solid var(--line-2);border-radius:100px;color:var(--fg-dim);font-size:clamp(.5rem,.8vw,.55rem);cursor:pointer;padding:.1rem .4rem;transition:all .2s;font-family:var(--font-sans);line-height:1.2;white-space:nowrap}
    .rc-nav .rc-btn:hover{border-color:var(--accent);color:var(--accent)}
    .rc-nav .rc-today{background:rgba(212,165,116,.1);border-color:var(--accent);color:var(--accent)}
    .rc-nav .rc-today:hover{background:rgba(212,165,116,.2)}
    .rc-picker{position:fixed;z-index:2000;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:clamp(.5rem,.8vw,.7rem);box-shadow:0 8px 32px rgba(0,0,0,.35);min-width:clamp(240px,30vw,320px);margin-top:4px}
    .rc-picker .rc-pick-year{display:flex;align-items:center;justify-content:center;gap:clamp(.5rem,1vw,.8rem);margin-bottom:clamp(.4rem,.6vw,.5rem)}
    .rc-picker .rc-pick-year .rc-py-btn{background:none;border:1px solid var(--line-2);border-radius:6px;color:var(--fg-dim);cursor:pointer;padding:clamp(.1rem,.15vw,.15rem) clamp(.25rem,.4vw,.35rem);font-size:clamp(.55rem,.85vw,.6rem);transition:all .15s;line-height:1}
    .rc-picker .rc-pick-year .rc-py-btn:hover{border-color:var(--accent);color:var(--accent)}
    .rc-picker .rc-pick-year .rc-py-val{font-family:var(--font-serif);font-size:clamp(.7rem,1.1vw,.8rem);color:var(--fg);min-width:4em;text-align:center;font-weight:400}
    .rc-picker .rc-pick-months{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(.2rem,.3vw,.25rem)}
    .rc-picker .rc-pick-months .rc-pm-btn{background:rgba(255,255,255,.03);border:1px solid var(--line-2);border-radius:6px;color:var(--fg-dim);cursor:pointer;padding:clamp(.2rem,.3vw,.3rem) 0;font-size:clamp(.5rem,.8vw,.55rem);transition:all .15s;text-align:center}
    .rc-picker .rc-pick-months .rc-pm-btn:hover{border-color:var(--accent);color:var(--accent)}
    .rc-picker .rc-pick-months .rc-pm-btn.rc-pm-cur{background:rgba(212,165,116,.12);border-color:var(--accent);color:var(--accent);font-weight:600}
    .rc-picker .rc-pick-months .rc-pm-btn.rc-pm-today{border-color:var(--muted);color:var(--fg)}
    .rc-nav{position:relative}
    .rc-popup{position:fixed;z-index:1001;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:clamp(.4rem,.6vw,.6rem);box-shadow:0 8px 32px rgba(0,0,0,.35);min-width:clamp(220px,30vw,300px);max-width:340px;font-size:clamp(.45rem,.7vw,.52rem)}
    .rc-popup .rc-pop-date{font-family:var(--font-serif);font-size:clamp(.55rem,.85vw,.6rem);color:var(--fg);padding-bottom:clamp(.2rem,.3vw,.3rem);margin-bottom:clamp(.2rem,.3vw,.3rem);border-bottom:1px solid var(--line);text-align:center;letter-spacing:.05em}
    .rc-popup .rc-pop-item{display:flex;align-items:center;gap:.3rem;padding:clamp(.12rem,.15vw,.15rem) 0;border-bottom:1px solid var(--line-2)}
    .rc-popup .rc-pop-item:last-child{border-bottom:none}
    .rc-popup .rc-pop-label{flex:1;color:var(--fg-dim)}
    .rc-popup .rc-pop-label.done{text-decoration:line-through;color:var(--muted)}
    .rc-popup .rc-pop-del{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.6vw,.5rem);padding:2px 4px;border-radius:4px;line-height:1;transition:all .15s}
    .rc-popup .rc-pop-del:hover{color:#e06c6c;background:rgba(224,108,108,.1)}
    .rc-popup .rc-pop-tog{background:none;border:1px solid var(--line-2);border-radius:4px;color:var(--muted);cursor:pointer;font-size:clamp(.4rem,.55vw,.45rem);padding:1px 4px;transition:all .15s;line-height:1.2}
    .rc-popup .rc-pop-tog:hover{border-color:var(--accent);color:var(--accent)}
    .rc-popup .rc-pop-tog.done{background:rgba(90,168,90,.15);border-color:#5aa85a;color:#5aa85a}
    .rc-popup .rc-pop-add{display:flex;gap:.25rem;margin-top:clamp(.25rem,.35vw,.35rem)}
    .rc-popup .rc-pop-add input{flex:1;background:rgba(255,255,255,.03);border:1px solid var(--line-2);border-radius:6px;color:var(--fg);padding:clamp(.15rem,.2vw,.2rem) clamp(.25rem,.35vw,.35rem);font-size:clamp(.45rem,.65vw,.5rem);font-family:var(--font-sans);outline:none}
    .rc-popup .rc-pop-add input:focus{border-color:var(--accent)}
    .rc-popup .rc-pop-add button{background:rgba(212,165,116,.1);border:1px solid var(--accent);border-radius:6px;color:var(--accent);cursor:pointer;padding:clamp(.12rem,.18vw,.18rem) clamp(.3rem,.45vw,.4rem);font-size:clamp(.45rem,.65vw,.5rem);transition:all .15s;white-space:nowrap;font-family:var(--font-sans)}
    .rc-popup .rc-pop-add button:hover{background:rgba(212,165,116,.2)}
    .rc-popup .rc-pop-close{position:absolute;top:4px;right:6px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.5rem,.7vw,.55rem);padding:2px 4px;line-height:1}
    .rc-popup .rc-pop-close:hover{color:var(--fg)}
    .rc-popup .rc-pop-empty{padding:clamp(.3rem,.5vw,.5rem);text-align:center;color:var(--muted);font-size:clamp(.42rem,.6vw,.48rem)}
    .rc-reminder-panel{border:1px solid rgba(212,165,116,.36);background:rgba(212,165,116,.08);border-radius:8px;padding:clamp(.28rem,.45vw,.4rem);margin:0 0 clamp(.28rem,.45vw,.4rem);color:var(--fg-dim);font-size:clamp(.46rem,.7vw,.54rem);line-height:1.5}
    .rc-reminder-panel strong{display:block;color:var(--accent);font-weight:500;margin-bottom:.12rem;letter-spacing:.05em}
    .rc-reminder-panel span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rc-empty{padding:clamp(1rem,2vw,2rem);text-align:center;color:var(--muted);font-size:clamp(.5rem,.8vw,.6rem)}
  `;
  document.head.appendChild(style);

  // ===== Create modal DOM =====
  var div = document.createElement('div');
  div.innerHTML =
    '<div class="pomo-overlay" id="' + OVERLAY_ID + '"></div>' +
    '<div class="pomo-modal" id="' + MODAL_ID + '" style="width:clamp(380px,85vw,620px)">' +
      '<button class="pomo-close" id="rcClose">✕</button>' +
      '<div class="pomo-body" id="' + BODY_ID + '"></div>' +
    '</div>';
  document.body.appendChild(div);

  // ===== Create picker element (appended to body, outside modal) =====
  var pickerEl = document.createElement('div');
  pickerEl.className = 'rc-picker';
  pickerEl.id = 'rcPicker';
  pickerEl.style.display = 'none';
  pickerEl.innerHTML =
    '<div class="rc-pick-year">' +
      '<button class="rc-py-btn" id="rcPyPrev">◀</button>' +
      '<span class="rc-py-val" id="rcPyVal"></span>' +
      '<button class="rc-py-btn" id="rcPyNext">▶</button>' +
    '</div>' +
    '<div class="rc-pick-months" id="rcPickMonths"></div>';
  document.body.appendChild(pickerEl);

  // Persistent picker close-on-outside (single handler, never leaks)
  var _pickOpen = false;
  var onPickClick = function(e) {
    if (!_pickOpen) return;
    var tb = document.getElementById('rcTitleBtn');
    if (!tb) { _pickOpen = false; return; }
    if (!pickerEl.contains(e.target) && e.target !== tb && !tb.contains(e.target)) {
      pickerEl.style.display = 'none';
      _pickOpen = false;
    }
  };
  document.addEventListener('click', onPickClick);

  // ===== Initialize to current month =====
  function initView() {
    var now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
  }

  // ===== Get entries for a specific date =====
  function getEntriesForDate(dateStr) {
    var all = (window.data && window.data._calEntries) || {};
    return (all[dateStr] || []).slice();
  }

  function saveEntries(dateStr, entries) {
    if (!window.data) return;
    if (!window.data._calEntries) window.data._calEntries = {};
    if (entries.length === 0) {
      delete window.data._calEntries[dateStr];
    } else {
      window.data._calEntries[dateStr] = entries;
    }
    if (typeof window.save === 'function') window.save();
  }

  // ===== Format date to YYYY-MM-DD =====
  function fmtDate(y, m, d) {
    return y + '-' + (m < 9 ? '0' : '') + (m + 1) + '-' + (d < 10 ? '0' : '') + d;
  }

  function dateFromKey(dateStr) {
    var parts = dateStr.split('-').map(function(v){ return parseInt(v, 10); });
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function daysUntil(dateStr) {
    var today = new Date();
    var base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((dateFromKey(dateStr) - base) / 86400000);
  }

  function reminderItems() {
    if (!window.CalendarReminders || typeof window.CalendarReminders.collect !== 'function') return [];
    return window.CalendarReminders.collect(window.data, new Date(), 7);
  }

  // ===== esc helper =====
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function(m) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m];
    });
  }

  // ===== Popup for adding/editing daily tags/events =====
  function showPopup(dateStr, cellEl) {
    hidePopup();
    var entries = getEntriesForDate(dateStr);

    var rect = cellEl.getBoundingClientRect();
    var popup = document.createElement('div');
    popup.className = 'rc-popup';
    popup.id = 'rcPopup';
    popup.dataset.date = dateStr;

    var dateDisplay = dateStr.slice(0,4) + '年' + parseInt(dateStr.slice(5,7)) + '月' + parseInt(dateStr.slice(8,10)) + '日';
    var html = '<button class="rc-pop-close" id="rcPopClose">✕</button>';
    html += '<div class="rc-pop-date">' + dateDisplay + '</div>';
    html += '<div id="rcPopItems">';
    if (entries.length === 0) {
      html += '<div class="rc-pop-empty">暂无标记，添加一个</div>';
    } else {
      for (var i = 0; i < entries.length; i++) {
        html += renderPopItem(i, entries[i]);
      }
    }
    html += '</div>';
    html += '<div class="rc-pop-add">';
    html += '<input id="rcPopInput" placeholder="添加标签/事件…" maxlength="100">';
    html += '<button id="rcPopAddBtn">添加</button>';
    html += '</div>';
    popup.innerHTML = html;

    var left = rect.left;
    var top = rect.bottom + 4;
    if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
    popup.style.left = Math.max(4, left) + 'px';
    popup.style.top = top + 'px';
    document.body.appendChild(popup);

    // Wire close
    document.getElementById('rcPopClose').addEventListener('click', hidePopup);

    // Wire add
    var input = document.getElementById('rcPopInput');
    document.getElementById('rcPopAddBtn').addEventListener('click', function() {
      addEntry(dateStr);
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addEntry(dateStr);
    });
    setTimeout(function(){ input.focus(); }, 50);

    // Wire existing item actions (delegated)
    wirePopActions(dateStr);

    // Click outside
    setTimeout(function(){ document.addEventListener('click', hidePopupOnOutside); }, 10);
  }

  function renderPopItem(idx, entry) {
    var labelCls = entry.done ? 'rc-pop-label done' : 'rc-pop-label';
    var togCls = entry.done ? 'rc-pop-tog done' : 'rc-pop-tog';
    var togText = entry.done ? '✓' : '○';
    return '<div class="rc-pop-item">' +
      '<button class="' + togCls + '" data-idx="' + idx + '" data-action="tog">' + togText + '</button>' +
      '<span class="' + labelCls + '">' + esc(entry.label) + '</span>' +
      '<button class="rc-pop-del" data-idx="' + idx + '" data-action="del">✕</button>' +
    '</div>';
  }

  function wirePopActions(dateStr) {
    var items = document.getElementById('rcPopItems');
    if (!items) return;
    items.querySelectorAll('[data-action]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = parseInt(this.dataset.idx);
        var entries = getEntriesForDate(dateStr);
        if (this.dataset.action === 'tog') {
          entries[idx].done = !entries[idx].done;
          saveEntries(dateStr, entries);
        } else if (this.dataset.action === 'del') {
          entries.splice(idx, 1);
          saveEntries(dateStr, entries);
        }
        // Refresh popup items
        var container = document.getElementById('rcPopItems');
        if (entries.length === 0) {
          container.innerHTML = '<div class="rc-pop-empty">暂无标记，添加一个</div>';
        } else {
          container.innerHTML = '';
          for (var i = 0; i < entries.length; i++) {
            container.insertAdjacentHTML('beforeend', renderPopItem(i, entries[i]));
          }
          wirePopActions(dateStr);
        }
        // Re-render calendar to update count badges
        renderCalendar();
      });
    });
  }

  function addEntry(dateStr) {
    var input = document.getElementById('rcPopInput');
    var val = input.value.trim();
    if (!val) return;
    var entries = getEntriesForDate(dateStr);
    entries.push({ label: val, done: false });
    saveEntries(dateStr, entries);
    input.value = '';
    // Refresh popup items
    var container = document.getElementById('rcPopItems');
    container.innerHTML = '';
    for (var i = 0; i < entries.length; i++) {
      container.insertAdjacentHTML('beforeend', renderPopItem(i, entries[i]));
    }
    wirePopActions(dateStr);
    input.focus();
    // Re-render calendar to update count badges
    renderCalendar();
  }

  function savePendingPopupInput(){
    var popup = document.getElementById('rcPopup');
    var input = document.getElementById('rcPopInput');
    if(!popup || !input) return;
    var val = input.value.trim();
    if(!val) return;
    var dateStr = popup.dataset.date;
    if(dateStr) addEntry(dateStr);
  }

  function hidePopupOnOutside(e) {
    var popup = document.getElementById('rcPopup');
    if (popup && !popup.contains(e.target) && !e.target.closest('.rc-cell')) {
      hidePopup();
    }
  }

  function hidePopup() {
    var popup = document.getElementById('rcPopup');
    if (popup) popup.remove();
    document.removeEventListener('click', hidePopupOnOutside);
  }

  // ===== Render calendar =====
  function renderCalendar() {
    var body = document.getElementById(BODY_ID);
    if (!body) return;

    if (!window.data) {
      body.innerHTML = '<div class="rc-empty">暂无数据</div>';
      return;
    }
    // Initialize _calEntries if needed
    if (!window.data._calEntries) window.data._calEntries = {};

    var firstDay = new Date(viewYear, viewMonth, 1);
    var lastDay = new Date(viewYear, viewMonth + 1, 0);
    var daysInMonth = lastDay.getDate();
    var daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    // Convert JS day (0=Sun) to our offset (0=Mon)
    var startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    var today = new Date();
    var todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());

    var html = '';

    // Navigation
    var prevM = (viewMonth + 10) % 12;
    var nextM = (viewMonth + 12) % 12;
    var prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    var nextY = viewMonth === 11 ? viewYear + 1 : viewYear;

    html += '<div class="rc-nav">';
    html += '<button class="rc-btn" id="rcPrevBtn">◀ ' + prevY + '年' + MONTH_NAMES[prevM] + '</button>';
    html += '<span class="rc-title" id="rcTitleBtn">' + viewYear + '年' + MONTH_NAMES[viewMonth] + ' ▾</span>';
    html += '<button class="rc-btn" id="rcNextBtn">' + nextY + '年' + MONTH_NAMES[nextM] + ' ▶</button>';
    html += '<button class="rc-btn rc-today" id="rcTodayBtn">今天</button>';
    html += '<button class="rc-btn" id="rcSaveBtn" style="margin-left:auto">💾 保存</button>';
    html += '</div>';

    var reminders = reminderItems();
    if (reminders.length) {
      html += '<div class="rc-reminder-panel"><strong>未来7天提醒</strong>';
      reminders.slice(0, 5).forEach(function(item) {
        html += '<span>' + esc(item.date.slice(5)) + ' · ' + (item.days === 0 ? '今天' : item.days + '天后') + ' · ' + esc(item.label) + '</span>';
      });
      if (reminders.length > 5) html += '<span>还有 ' + (reminders.length - 5) + ' 条提醒...</span>';
      html += '</div>';
    }

    // Grid header
    html += '<div class="rc-grid">';
    for (var di = 0; di < 7; di++) {
      html += '<div class="rc-hdr">' + DAY_NAMES[di] + '</div>';
    }

    // Fill cells
    var totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    for (var i = 0; i < totalCells; i++) {
      var cellDay = i - startOffset + 1;
      var isOther = (cellDay < 1 || cellDay > daysInMonth);
      var displayDay = cellDay;
      var cellMonth = viewMonth;
      var cellYear = viewYear;

      if (cellDay < 1) {
        displayDay = daysInPrev + cellDay;
        cellMonth = viewMonth - 1;
        if (cellMonth < 0) { cellMonth = 11; cellYear--; }
      } else if (cellDay > daysInMonth) {
        displayDay = cellDay - daysInMonth;
        cellMonth = viewMonth + 1;
        if (cellMonth > 11) { cellMonth = 0; cellYear++; }
      }

      var dateStr = fmtDate(cellYear, cellMonth, displayDay);
      var entries = isOther ? [] : getEntriesForDate(dateStr);
      var entryCount = entries.length;
      var hasOpenEntry = entries.some(function(entry){ return !entry.done; });
      var leftDays = entryCount > 0 ? daysUntil(dateStr) : 9999;
      var remindSoon = hasOpenEntry && leftDays >= 0 && leftDays <= 7;
      var cls = 'rc-cell';
      if (isOther) cls += ' rc-other';
      if (dateStr === todayStr) cls += ' rc-today';
      if (entryCount > 0) cls += ' rc-has-event';
      if (remindSoon) cls += ' rc-reminder';

      html += '<div class="' + cls + '" data-date="' + dateStr + '">';
      html += '<span class="rc-day">' + displayDay + '</span>';
      if (entryCount > 0) {
        html += '<span class="rc-cnt">' + entryCount + '</span>';
        if (remindSoon) html += '<span class="rc-remind-dot">提醒</span>';
      }

      html += '</div>';
    }

    html += '</div>'; // .rc-grid

    body.innerHTML = html;

    // Wire navigation
    document.getElementById('rcPrevBtn').addEventListener('click', function(){
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderCalendar();
    });
    document.getElementById('rcNextBtn').addEventListener('click', function(){
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderCalendar();
    });
    document.getElementById('rcTodayBtn').addEventListener('click', function(){
      var now = new Date();
      viewYear = now.getFullYear();
      viewMonth = now.getMonth();
      renderCalendar();
    });
    document.getElementById('rcSaveBtn').addEventListener('click', function(){
      savePendingPopupInput();
      if(typeof window.save === 'function') window.save();
    }, true);
    document.getElementById('rcSaveBtn').addEventListener('click', function(){
      if(typeof window.save === 'function') {
        try { window.save(); showToast('💾 日历数据已保存'); }
        catch(e) { showToast('⚠️ 保存失败: ' + (e.message||e)); }
      } else {
        showToast('⚠️ 保存失败: save 函数不可用');
      }
    });

    // Wire year/month picker
    var titleBtn = document.getElementById('rcTitleBtn');

    // Set picker year value
    document.getElementById('rcPyVal').textContent = viewYear;

    // Rebuild month buttons
    (function rebuildMonths() {
      var mContainer = document.getElementById('rcPickMonths');
      var todayM = new Date().getMonth();
      var todayY = new Date().getFullYear();
      mContainer.innerHTML = '';
      for (var mi = 0; mi < 12; mi++) {
        var mBtn = document.createElement('button');
        mBtn.className = 'rc-pm-btn';
        if (mi === viewMonth) mBtn.classList.add('rc-pm-cur');
        if (mi === todayM && viewYear === todayY) mBtn.classList.add('rc-pm-today');
        mBtn.dataset.m = mi;
        mBtn.textContent = MONTH_NAMES[mi];
        mContainer.appendChild(mBtn);
      }
    })();

    titleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!_pickOpen) {
        var rect = titleBtn.getBoundingClientRect();
        var pW = pickerEl.offsetWidth || 280;
        var left = rect.left + rect.width / 2 - pW / 2;
        left = Math.max(4, Math.min(left, window.innerWidth - pW - 4));
        pickerEl.style.left = left + 'px';
        pickerEl.style.top = (rect.bottom + 6) + 'px';
        pickerEl.style.display = 'block';
        _pickOpen = true;
      } else {
        pickerEl.style.display = 'none';
        _pickOpen = false;
      }
    });

    document.getElementById('rcPyPrev').addEventListener('click', function(e) {
      e.stopPropagation();
      viewYear--;
      document.getElementById('rcPyVal').textContent = viewYear;
      rebuildPickerMonths();
    });
    document.getElementById('rcPyNext').addEventListener('click', function(e) {
      e.stopPropagation();
      viewYear++;
      document.getElementById('rcPyVal').textContent = viewYear;
      rebuildPickerMonths();
    });

    function rebuildPickerMonths() {
      var mContainer = document.getElementById('rcPickMonths');
      var todayM = new Date().getMonth();
      var todayY = new Date().getFullYear();
      mContainer.innerHTML = '';
      for (var mi = 0; mi < 12; mi++) {
        var mBtn = document.createElement('button');
        mBtn.className = 'rc-pm-btn';
        if (mi === viewMonth) mBtn.classList.add('rc-pm-cur');
        if (mi === todayM && viewYear === todayY) mBtn.classList.add('rc-pm-today');
        mBtn.dataset.m = mi;
        mBtn.textContent = MONTH_NAMES[mi];
        mBtn.addEventListener('click', function() {
          viewMonth = parseInt(this.dataset.m);
          pickerEl.style.display = 'none';
          renderCalendar();
        });
        mContainer.appendChild(mBtn);
      }
    }

    // Wire month buttons
    document.querySelectorAll('#rcPickMonths .rc-pm-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        viewMonth = parseInt(this.dataset.m);
        pickerEl.style.display = 'none';
        renderCalendar();
      });
    });

    // Wire cell clicks via delegation (avoids handler loss after re-render)
    // Handler is bound once on the body element, not per-cell
    if (!body._cellDelegated) {
      body.addEventListener('click', function(e) {
        var cell = e.target.closest('.rc-cell:not(.rc-other)');
        if (cell) {
          var dateStr = cell.dataset.date;
          showPopup(dateStr, cell);
        }
      });
      body._cellDelegated = true;
    }

  }

  // ===== Open/Close =====
  function openModal() {
    initView();
    renderCalendar();
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
  }

  function closeModal() {
    hidePopup();
    pickerEl.style.display = 'none'; _pickOpen = false;
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  // ===== Wire events =====
  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('rcClose').addEventListener('click', closeModal);

  var btn = document.getElementById(BTN_ID);
  if (btn) btn.addEventListener('click', openModal);

  console.log('feature-realcalendar: loaded');
})();
