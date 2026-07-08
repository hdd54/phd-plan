// ===== FEATURE: Month View Calendar Heatmap =====
(function(){
  if(window.__features['monthview']) return;
  window.__features['monthview'] = true;

  var OVERLAY_ID = 'calOverlay';
  var MODAL_ID = 'calModal';
  var WEEKS_PER_MONTH = 4;
  var DAY_NAMES = ['周一','周二','周三','周四','周五','周六','周日'];

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .cal-grid{display:grid;grid-template-columns:auto repeat(7,1fr);gap:2px;font-size:clamp(.45rem,.7vw,.52rem);width:100%}
    .cal-grid .cg-hdr{padding:clamp(.08rem,.15vw,.12rem) clamp(.1rem,.2vw,.15rem);text-align:center;color:var(--muted);font-weight:600;letter-spacing:.05em;font-size:clamp(.45rem,.65vw,.5rem)}
    .cal-grid .cg-lbl{padding:clamp(.08rem,.15vw,.12rem) clamp(.15rem,.25vw,.2rem);text-align:right;color:var(--fg-dim);font-size:clamp(.4rem,.6vw,.45rem);white-space:nowrap}
    .cal-grid .cg-cell{position:relative;padding:clamp(.12rem,.2vw,.18rem);text-align:center;border-radius:4px;cursor:default;transition:all .15s;min-height:clamp(32px,3.5vw,42px);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.3;border:1.5px solid transparent}
    .cal-grid .cg-cell:hover{filter:brightness(1.2);transform:scale(1.04);z-index:2}
    .cal-grid .cg-cell .cg-total{font-size:clamp(.38rem,.55vw,.42rem);color:var(--fg-dim)}
    .cal-grid .cg-cell .cg-done{font-size:clamp(.38rem,.55vw,.42rem)}
    .cal-grid .cg-cell.cw{border-color:var(--accent)!important;box-shadow:0 0 8px rgba(212,165,116,.3);border-width:1.5px}
    .cal-grid .cg-cell.tdy::after{content:'';position:absolute;top:-1px;right:-1px;width:clamp(4px,.5vw,6px);height:clamp(4px,.5vw,6px);border-radius:50%;background:var(--accent);box-shadow:0 0 6px rgba(212,165,116,.6)}
    .cal-grid .cg-empty{padding:clamp(.12rem,.2vw,.18rem);text-align:center;color:var(--muted);font-size:clamp(.4rem,.6vw,.45rem);min-height:clamp(32px,3.5vw,42px);display:flex;align-items:center;justify-content:center}
    .cal-nav{display:flex;align-items:center;justify-content:space-between;padding:0 clamp(.1rem,.2vw,.2rem);margin-bottom:clamp(.2rem,.4vw,.3rem)}
    .cal-nav .cn-title{font-family:var(--font-serif);font-size:clamp(.7rem,1.2vw,.9rem);color:var(--fg);font-weight:300;letter-spacing:.05em}
    .cal-nav .cn-btn{background:rgba(255,255,255,.04);border:1px solid var(--line-2);border-radius:100px;color:var(--fg-dim);font-size:clamp(.5rem,.8vw,.55rem);cursor:pointer;padding:.1rem .35rem;transition:all .2s;font-family:var(--font-sans);line-height:1.2}
    .cal-nav .cn-btn:hover{border-color:var(--accent);color:var(--accent)}
    .cal-nav .cn-btn:disabled{opacity:.2;cursor:default;border-color:var(--line-2);color:var(--muted)}
    .cal-legend{display:flex;align-items:center;justify-content:center;gap:.4rem;padding:clamp(.15rem,.3vw,.2rem) 0;font-size:clamp(.38rem,.55vw,.42rem);color:var(--muted);margin-top:clamp(.15rem,.3vw,.2rem)}
    .cal-legend .cl-bar{display:flex;gap:1px;height:clamp(8px,1vw,12px)}
    .cal-legend .cl-bar .cl-step{width:clamp(8px,1vw,12px);border-radius:1px}
  `;
  document.head.appendChild(style);

  // ===== Create modal HTML =====
  var div = document.createElement('div');
  div.innerHTML =
    '<div class="pomo-overlay" id="' + OVERLAY_ID + '"></div>' +
    '<div class="pomo-modal" id="' + MODAL_ID + '" style="width:clamp(380px,80vw,580px)">' +
      '<button class="pomo-close" id="calClose">✕</button>' +
      '<div class="pomo-body" id="calBody"></div>' +
    '</div>';
  document.body.appendChild(div);

  // ===== State =====
  var currentMonth = 0;

  // ===== Get max weeks across all cards =====
  function getMaxWeeks() {
    var max = 0, _d = window.data || {};
    for(var cid in _d) {
      if(cid.startsWith('_')) continue;
      var weeks = _d[cid];
      if(!Array.isArray(weeks)) continue;
      if(weeks.length > max) max = weeks.length;
    }
    return max;
  }

  // ===== Get week label =====
  function getWeekLabel(wi) {
    var _d = window.data || {};
    // Try to find a label from any card
    for(var cid in _d) {
      if(cid.startsWith('_')) continue;
      var weeks = _d[cid];
      if(!Array.isArray(weeks) || !weeks[wi]) continue;
      if(weeks[wi].w) return weeks[wi].w;
    }
    return '第' + (wi + 1) + '周';
  }

  // ===== Aggregate task data for a specific week and day =====
  function getDayStats(wi, di) {
    var total = 0, done = 0, _d = window.data || {};
    for(var cid in _d) {
      if(cid.startsWith('_')) continue;
      var weeks = _d[cid];
      if(!Array.isArray(weeks) || !weeks[wi]) continue;
      var week = weeks[wi];
      if(!week.d || !Array.isArray(week.d)) continue;
      var task = week.d[di];
      if(task === undefined || task === null) continue;
      total++;
      if(typeof task === 'object' && task.done) done++;
    }
    return { total: total, done: done };
  }

  // ===== Compute month range =====
  function getMonthRange(monthIdx) {
    var maxWeeks = getMaxWeeks();
    if(maxWeeks === 0) return { start: 0, end: 0, maxWeeks: 0 };
    var start = monthIdx * WEEKS_PER_MONTH;
    var end = Math.min(start + WEEKS_PER_MONTH, maxWeeks);
    return { start: start, end: end, maxWeeks: maxWeeks };
  }

  // ===== Get total months =====
  function getTotalMonths() {
    var maxWeeks = getMaxWeeks();
    return Math.ceil(maxWeeks / WEEKS_PER_MONTH);
  }

  // ===== Determine current week (last week with any data) =====
  function getCurrentWeek() {
    var maxWeeks = getMaxWeeks();
    return maxWeeks > 0 ? maxWeeks - 1 : 0;
  }

  // ===== Get today's day of week (0=周一, 6=周日) =====
  function getTodayDayIndex() {
    var d = new Date();
    var jsDay = d.getDay(); // 0=周日, 1=周一, ..., 6=周六
    // Convert: 周一=0, 周日=6
    return jsDay === 0 ? 6 : jsDay - 1;
  }

  // ===== Render calendar =====
  function renderCalendar() {
    var body = document.getElementById('calBody');
    if(!body) return;

    var range = getMonthRange(currentMonth);
    var totalMonths = getTotalMonths();
    var todayDi = getTodayDayIndex();
    var currentWi = getCurrentWeek();

    var html = '';

    // Navigation header
    html += '<div class="cal-nav">';
    html += '<button class="cn-btn" id="calPrevBtn"' + (currentMonth <= 0 ? ' disabled' : '') + '>&lt; 上月</button>';
    html += '<span class="cn-title">第' + (currentMonth + 1) + '月</span>';
    html += '<button class="cn-btn" id="calNextBtn"' + (currentMonth >= totalMonths - 1 ? ' disabled' : '') + '>下月 &gt;</button>';
    html += '</div>';

    // Legend
    html += '<div class="cal-legend">';
    html += '<span>0%</span>';
    html += '<div class="cl-bar">';
    var legendColors = ['#1a3a1a','#1e4d1e','#2d6b2d','#3d8b3d','#5aa85a','#7cc47c','#a3d9a3','#c8eac8','#e6f5e6','#f0faf0'];
    for(var li = legendColors.length - 1; li >= 0; li--) {
      html += '<div class="cl-step" style="background:' + legendColors[li] + '"></div>';
    }
    html += '</div>';
    html += '<span>100%</span>';
    html += '</div>';

    // Grid
    html += '<div class="cal-grid">';

    // Header row
    html += '<div class="cg-hdr"></div>'; // empty corner
    for(var di = 0; di < 7; di++) {
      html += '<div class="cg-hdr">' + DAY_NAMES[di] + '</div>';
    }

    // Data rows
    for(var wi = range.start; wi < range.end; wi++) {
      var isCurrentWeek = (wi === currentWi);
      var weekLabel = getWeekLabel(wi);

      html += '<div class="cg-lbl">' + weekLabel + '</div>';

      for(var dayIdx = 0; dayIdx < 7; dayIdx++) {
        var stats = getDayStats(wi, dayIdx);
        var isToday = (dayIdx === todayDi);
        var cellClass = 'cg-cell';

        if(isCurrentWeek) cellClass += ' cw';
        if(isToday) cellClass += ' tdy';

        // Heatmap color
        var pct = stats.total > 0 ? (stats.done / stats.total) : 0;
        var color = getHeatColor(pct);

        html += '<div class="' + cellClass + '" style="background:' + color + '" title="' + weekLabel + ' ' + DAY_NAMES[dayIdx] + '：完成 ' + stats.done + '/' + stats.total + ' (' + Math.round(pct * 100) + '%)">';
        if(stats.total > 0) {
          html += '<span class="cg-done">☑ ' + stats.done + '</span>';
          html += '<span class="cg-total">☐ ' + stats.total + '</span>';
        } else {
          html += '<span class="cg-empty" style="padding:0">-</span>';
        }
        html += '</div>';
      }
    }

    html += '</div>'; // .cal-grid

    body.innerHTML = html;

    // Wire nav buttons
    var prevBtn = document.getElementById('calPrevBtn');
    var nextBtn = document.getElementById('calNextBtn');
    if(prevBtn && !prevBtn.disabled) {
      prevBtn.addEventListener('click', function(){
        if(currentMonth > 0) { currentMonth--; renderCalendar(); }
      });
    }
    if(nextBtn && !nextBtn.disabled) {
      nextBtn.addEventListener('click', function(){
        if(currentMonth < totalMonths - 1) { currentMonth++; renderCalendar(); }
      });
    }
  }

  // ===== Heatmap color: green intensity based on completion rate =====
  function getHeatColor(pct) {
    // Scale: 0% -> very light green, 100% -> deep green
    // Using rgba with green channel
    var r, g, b;
    if(pct <= 0) {
      return 'rgba(30,30,28,0.4)';
    } else if(pct < 0.25) {
      // Light green
      var t = pct / 0.25;
      r = Math.round(40 + t * 20);
      g = Math.round(60 + t * 40);
      b = Math.round(40 + t * 10);
    } else if(pct < 0.5) {
      var t = (pct - 0.25) / 0.25;
      r = Math.round(60 - t * 20);
      g = Math.round(100 + t * 30);
      b = Math.round(50 - t * 10);
    } else if(pct < 0.75) {
      var t = (pct - 0.5) / 0.25;
      r = Math.round(40 - t * 15);
      g = Math.round(130 + t * 30);
      b = Math.round(40 - t * 15);
    } else {
      var t = (pct - 0.75) / 0.25;
      r = Math.round(25 - t * 10);
      g = Math.round(160 + t * 40);
      b = Math.round(25 - t * 10);
    }
    return 'rgb(' + Math.max(0, r) + ',' + Math.min(255, g) + ',' + Math.max(0, b) + ')';
  }

  // ===== Open/Close =====
  function openModal(){
    // Refresh data
    currentMonth = getTotalMonths() - 1;
    if(currentMonth < 0) currentMonth = 0;
    renderCalendar();
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
  }

  function closeModal(){
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  // ===== Wire events =====
  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('calClose').addEventListener('click', closeModal);

  var btn = document.getElementById('calBtn');
  if(btn) btn.addEventListener('click', openModal);

  console.log('feature-monthview: loaded');
})();
