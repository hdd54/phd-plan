// ===== FEATURE: Real Calendar + Milestone Calendar =====
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
    .rc-grid .rc-cell .rc-day{font-size:clamp(.5rem,.75vw,.58rem);line-height:1.2}
    .rc-grid .rc-cell .rc-dots{display:flex;gap:2px;margin-top:2px;flex-wrap:wrap;justify-content:center}
    .rc-grid .rc-cell .rc-dot{width:5px;height:5px;border-radius:50%;display:inline-block}
    .rc-dot-done{background:#5aa85a}
    .rc-dot-active{background:var(--accent)}
    .rc-dot-pending{background:var(--muted)}
    .rc-nav{display:flex;align-items:center;justify-content:space-between;gap:clamp(.15rem,.3vw,.25rem);padding:0 0 clamp(.3rem,.5vw,.4rem) 0;margin-bottom:clamp(.2rem,.4vw,.3rem);border-bottom:1px solid var(--line)}
    .rc-nav .rc-title{font-family:var(--font-serif);font-size:clamp(.75rem,1.3vw,.95rem);color:var(--fg);font-weight:400;letter-spacing:.05em}
    .rc-nav .rc-btn{background:rgba(255,255,255,.04);border:1px solid var(--line-2);border-radius:100px;color:var(--fg-dim);font-size:clamp(.5rem,.8vw,.55rem);cursor:pointer;padding:.1rem .4rem;transition:all .2s;font-family:var(--font-sans);line-height:1.2;white-space:nowrap}
    .rc-nav .rc-btn:hover{border-color:var(--accent);color:var(--accent)}
    .rc-nav .rc-today{background:rgba(212,165,116,.1);border-color:var(--accent);color:var(--accent)}
    .rc-nav .rc-today:hover{background:rgba(212,165,116,.2)}
    .rc-summary{margin-top:clamp(.3rem,.5vw,.5rem);padding-top:clamp(.3rem,.5vw,.5rem);border-top:1px solid var(--line);font-size:clamp(.45rem,.7vw,.52rem)}
    .rc-summary .rc-sum-title{font-weight:600;color:var(--fg-dim);margin-bottom:clamp(.15rem,.25vw,.2rem);letter-spacing:.05em}
    .rc-summary .rc-sum-item{padding:clamp(.08rem,.12vw,.1rem) 0;display:flex;align-items:center;gap:.35rem;color:var(--fg-dim);border-bottom:1px solid var(--line-2);line-height:1.4}
    .rc-summary .rc-sum-item:last-child{border-bottom:none}
    .rc-summary .rc-sum-date{font-family:var(--font-mono);font-size:clamp(.4rem,.6vw,.45rem);color:var(--muted);min-width:3em}
    .rc-summary .rc-sum-label{flex:1}
    .rc-summary .rc-sum-card{font-size:clamp(.38rem,.55vw,.42rem);color:var(--muted);min-width:2.5em;text-align:right}
    .rc-summary .rc-sum-status{min-width:1.5em;text-align:center}
    .rc-popup{position:fixed;z-index:1001;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:clamp(.3rem,.5vw,.5rem);box-shadow:0 8px 32px rgba(0,0,0,.3);min-width:200px;max-width:320px;font-size:clamp(.45rem,.7vw,.52rem)}
    .rc-popup .rc-pop-item{padding:clamp(.1rem,.15vw,.15rem) 0;display:flex;align-items:center;gap:.35rem;border-bottom:1px solid var(--line-2)}
    .rc-popup .rc-pop-item:last-child{border-bottom:none}
    .rc-popup .rc-pop-label{flex:1}
    .rc-popup .rc-pop-card{font-size:clamp(.4rem,.6vw,.45rem);color:var(--muted)}
    .rc-popup .rc-pop-close{position:absolute;top:4px;right:6px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.5rem,.7vw,.55rem);padding:2px 4px;line-height:1}
    .rc-popup .rc-pop-close:hover{color:var(--fg)}
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

  // ===== Initialize to current month =====
  function initView() {
    var now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
  }

  // ===== Get milestones for a specific date =====
  function getMilestonesForDate(dateStr) {
    var ms = (window.data && window.data._milestones) || {};
    var result = [];
    for (var cid in ms) {
      if (cid.startsWith('_')) continue;
      (ms[cid] || []).forEach(function(m) {
        if (m.date === dateStr) {
          result.push({ card: cid, label: m.label, done: m.done });
        }
      });
    }
    return result;
  }

  // ===== Format date to YYYY-MM-DD =====
  function fmtDate(y, m, d) {
    return y + '-' + (m < 9 ? '0' : '') + (m + 1) + '-' + (d < 10 ? '0' : '') + d;
  }

  // ===== esc helper =====
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function(m) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m];
    });
  }

  // ===== Show popup =====
  function showPopup(dateStr, cellEl) {
    var msList = getMilestonesForDate(dateStr);
    if (msList.length === 0) return;
    hidePopup();

    var rect = cellEl.getBoundingClientRect();
    var popup = document.createElement('div');
    popup.className = 'rc-popup';
    popup.id = 'rcPopup';

    var html = '<button class="rc-pop-close" id="rcPopClose">✕</button>';
    for (var i = 0; i < msList.length; i++) {
      var m = msList[i];
      var statusIcon = m.done ? '✅' : '🔄';
      html += '<div class="rc-pop-item">';
      html += '<span class="rc-pop-icon">' + statusIcon + '</span>';
      html += '<span class="rc-pop-label">' + esc(m.label) + '</span>';
      html += '<span class="rc-pop-card">' + esc(m.card) + '</span>';
      html += '</div>';
    }
    popup.innerHTML = html;

    var left = Math.min(rect.left, window.innerWidth - 330);
    var top = rect.bottom + 4;
    popup.style.left = Math.max(4, left) + 'px';
    popup.style.top = top + 'px';
    document.body.appendChild(popup);

    document.getElementById('rcPopClose').addEventListener('click', hidePopup);
    setTimeout(function(){ document.addEventListener('click', hidePopupOnOutside); }, 10);
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

  // ===== Render milestone summary =====
  function renderSummary() {
    var body = document.getElementById(BODY_ID);
    if (!body) return;

    var ms = (window.data && window.data._milestones) || {};
    var items = [];
    var prefix = fmtDate(viewYear, viewMonth, 1).slice(0, 7);

    for (var cid in ms) {
      if (cid.startsWith('_')) continue;
      (ms[cid] || []).forEach(function(m) {
        if (m.date && m.date.indexOf(prefix) === 0) {
          items.push({ card: cid, label: m.label, date: m.date, done: m.done });
        }
      });
    }

    if (items.length === 0) {
      var summary = body.querySelector('.rc-summary');
      if (summary) summary.remove();
      return;
    }

    items.sort(function(a, b) { return a.date.localeCompare(b.date); });

    var html = '<div class="rc-summary">';
    html += '<div class="rc-sum-title">📅 本月里程碑 (' + items.length + ')</div>';
    for (var i = 0; i < items.length; i++) {
      var m = items[i];
      var dayStr = m.date.slice(5);
      var statusIcon = m.done ? '✅' : '🔄';
      html += '<div class="rc-sum-item">';
      html += '<span class="rc-sum-date">' + dayStr + '</span>';
      html += '<span class="rc-sum-label">' + esc(m.label) + '</span>';
      html += '<span class="rc-sum-status">' + statusIcon + '</span>';
      html += '<span class="rc-sum-card">' + esc(m.card) + '</span>';
      html += '</div>';
    }
    html += '</div>';

    // Remove old summary if exists, then append
    var old = body.querySelector('.rc-summary');
    if (old) old.remove();
    body.insertAdjacentHTML('beforeend', html);
  }

  // ===== Render calendar =====
  function renderCalendar() {
    var body = document.getElementById(BODY_ID);
    if (!body) return;

    if (!window.data || !window.data._milestones) {
      body.innerHTML = '<div class="rc-empty">暂无里程碑数据，请先在卡片中添加里程碑</div>';
      return;
    }

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
    html += '<span class="rc-title">' + viewYear + '年' + MONTH_NAMES[viewMonth] + '</span>';
    html += '<button class="rc-btn" id="rcNextBtn">' + nextY + '年' + MONTH_NAMES[nextM] + ' ▶</button>';
    html += '<button class="rc-btn rc-today" id="rcTodayBtn">今天</button>';
    html += '</div>';

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
      var msList = isOther ? [] : getMilestonesForDate(dateStr);
      var cls = 'rc-cell';
      if (isOther) cls += ' rc-other';
      if (dateStr === todayStr) cls += ' rc-today';

      html += '<div class="' + cls + '" data-date="' + dateStr + '">';
      html += '<span class="rc-day">' + displayDay + '</span>';

      if (msList.length > 0) {
        html += '<div class="rc-dots">';
        for (var mi = 0; mi < Math.min(msList.length, 5); mi++) {
          var dotCls = msList[mi].done ? 'rc-dot-done' : 'rc-dot-active';
          html += '<span class="rc-dot ' + dotCls + '"></span>';
        }
        if (msList.length > 5) {
          html += '<span style="font-size:clamp(.35rem,.45vw,.4rem);color:var(--fg-dim);line-height:5px">+' + (msList.length - 5) + '</span>';
        }
        html += '</div>';
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

    // Wire cell clicks
    body.querySelectorAll('.rc-cell:not(.rc-other)').forEach(function(cell) {
      cell.addEventListener('click', function() {
        var dateStr = this.dataset.date;
        showPopup(dateStr, this);
      });
    });

    // Render summary
    renderSummary();
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
