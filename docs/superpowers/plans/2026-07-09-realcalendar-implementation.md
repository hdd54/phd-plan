# Real Calendar + Milestone Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real Gregorian month-view calendar with milestone markers, independent of the existing abstract week-group heatmap.

**Architecture:** New standalone vanilla JS feature file (`js/feature-realcalendar.js`) following the existing IIFE + `window.__features` guard pattern. Calendar reads milestones from existing `window.data._milestones`. No new data model. Injected CSS, created modal. A new button in the toolbar opens it.

**Tech Stack:** Vanilla JS, Date API, existing CSS variables.

## Global Constraints
- Zero external dependencies
- Must not break existing `feature-monthview.js` or any other feature
- Follow existing pattern: IIFE, `window.__features` guard, injected `<style>`, created modal DOM
- Dark theme: use existing CSS variables (`--fg`, `--fg-dim`, `--muted`, `--accent`, `--line-2`, `--bg`, etc.)
- Date format: `YYYY-MM-DD` (matching existing milestone data format)
- First day of week: 周一 (Monday)
- IDs must not conflict with existing `calOverlay`/`calModal`/`calBody`/`calBtn`

---
### Task 1: Create `js/feature-realcalendar.js` — scaffold + CSS + modal DOM

**Files:**
- Create: `js/feature-realcalendar.js` (lines 1-50)
- Test: `node --check js/feature-realcalendar.js` (syntax validation)

**Interfaces:**
- Consumes: `window.data._milestones`
- Produces: IIFE registers feature, creates DOM, wires button in Task 6

- [ ] **Step 1: Write the feature scaffold with IIFE + feature guard + CSS injection**

```javascript
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
  var viewYear, viewMonth; // current display year/month

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .rc-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:clamp(.45rem,.7vw,.52rem)}
    .rc-grid .rc-hdr{padding:clamp(.08rem,.15vw,.12rem);text-align:center;color:var(--muted);font-weight:600;letter-spacing:.05em;font-size:clamp(.45rem,.65vw,.5rem)}
    .rc-grid .rc-cell{position:relative;padding:clamp(.2rem,.3vw,.25rem);text-align:center;border-radius:4px;cursor:pointer;transition:all .15s;min-height:clamp(36px,4vw,48px);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;border:1.5px solid transparent}
    .rc-grid .rc-cell:hover{background:rgba(255,255,255,.04);border-color:var(--line-2)}
    .rc-grid .rc-cell.rc-other{color:var(--muted);opacity:.35}
    .rc-grid .rc-cell.rc-today{border-color:var(--accent)!important;box-shadow:0 0 8px rgba(212,165,116,.3)}
    .rc-grid .rc-cell .rc-day{font-size:clamp(.5rem,.75vw,.58rem);line-height:1.2}
    .rc-grid .rc-cell .rc-dots{display:flex;gap:2px;margin-top:2px;flex-wrap:wrap;justify-content:center}
    .rc-grid .rc-cell .rc-dot{width:5px;height:5px;border-radius:50%;display:inline-block}
    .rc-dot-done{background:#5aa85a}
    .rc-dot-active{background:var(--accent)}
    .rc-dot-pending{background:var(--muted)}
    .rc-nav{display:flex;align-items:center;justify-content:space-between;padding:0 0 clamp(.3rem,.5vw,.4rem) 0;margin-bottom:clamp(.2rem,.4vw,.3rem);border-bottom:1px solid var(--line)}
    .rc-nav .rc-title{font-family:var(--font-serif);font-size:clamp(.75rem,1.3vw,.95rem);color:var(--fg);font-weight:400;letter-spacing:.05em}
    .rc-nav .rc-btn{background:rgba(255,255,255,.04);border:1px solid var(--line-2);border-radius:100px;color:var(--fg-dim);font-size:clamp(.5rem,.8vw,.55rem);cursor:pointer;padding:.1rem .4rem;transition:all .2s;font-family:var(--font-sans);line-height:1.2}
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
    .rc-popup .rc-pop-close{position:absolute;top:4px;right:6px;background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.5rem,.7vw,.55rem);padding:2px 4px}
    .rc-popup .rc-pop-close:hover{color:var(--fg)}
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
```

- [ ] **Step 2: Verify syntax**

```bash
node --check js/feature-realcalendar.js
```
Expected: no output (clean syntax)

- [ ] **Step 3: Commit**

```bash
git add js/feature-realcalendar.js
git commit -m "feat: add realcalendar feature scaffold + CSS + modal DOM"
```

---

### Task 2: Implement calendar rendering logic

**Files:**
- Modify: `js/feature-realcalendar.js`

- [ ] **Step 1: Add state initialization and render function**

```javascript
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

  // ===== Render the calendar =====
  function renderCalendar() {
    var body = document.getElementById(BODY_ID);
    if (!body) return;

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
    html += '<div class="rc-nav">';
    html += '<button class="rc-btn" id="rcPrevBtn">◀ ' + MONTH_NAMES[(viewMonth + 10) % 12] + '</button>';
    html += '<span class="rc-title">' + viewYear + '年' + MONTH_NAMES[viewMonth] + '</span>';
    html += '<button class="rc-btn" id="rcNextBtn">' + MONTH_NAMES[(viewMonth + 12) % 12] + ' ▶</button>';
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
          html += '<span class="rc-dot" style="background:var(--fg-dim);width:5px;height:5px;border-radius:50%;font-size:clamp(.35rem,.45vw,.4rem);line-height:5px;text-align:center;color:var(--bg)">+</span>';
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
  }
```

- [ ] **Step 2: Verify syntax**

```bash
node --check js/feature-realcalendar.js
```

- [ ] **Step 3: Commit**

```bash
git add js/feature-realcalendar.js
git commit -m "feat: add calendar grid rendering with month nav + milestone lookup"
```

---

### Task 3: Add milestone popup + monthly summary

**Files:**
- Modify: `js/feature-realcalendar.js`

- [ ] **Step 1: Add popup show/hide functions and summary rendering, then append to renderCalendar()**

```javascript
  // ===== Show popup near a cell =====
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
      html += '<span class="rc-pop-status">' + statusIcon + '</span>';
      html += '<span class="rc-pop-label">' + esc(m.label) + '</span>';
      html += '<span class="rc-pop-card">' + esc(m.card) + '</span>';
      html += '</div>';
    }
    popup.innerHTML = html;

    // Position near cell, below
    var left = Math.min(rect.left, window.innerWidth - 330);
    var top = rect.bottom + 4;
    popup.style.left = Math.max(4, left) + 'px';
    popup.style.top = top + 'px';
    document.body.appendChild(popup);

    document.getElementById('rcPopClose').addEventListener('click', hidePopup);
    setTimeout(function(){
      document.addEventListener('click', hidePopupOnOutside);
    }, 10);
  }

  function hidePopupOnOutside(e) {
    var popup = document.getElementById('rcPopup');
    if (popup && !popup.contains(e.target) && !e.target.closest('.rc-cell')) {
      hidePopup();
    }
  }

  function hidePopup() {
    var popup = document.getElementById('rcPopup');
    if (popup) { popup.remove(); }
    document.removeEventListener('click', hidePopupOnOutside);
  }

  // ===== Render monthly milestone summary =====
  function renderSummary() {
    var body = document.getElementById(BODY_ID);
    if (!body) return;

    var ms = (window.data && window.data._milestones) || {};
    var items = [];
    var prefix = fmtDate(viewYear, viewMonth, 1).slice(0, 7); // "YYYY-MM"

    for (var cid in ms) {
      if (cid.startsWith('_')) continue;
      (ms[cid] || []).forEach(function(m) {
        if (m.date && m.date.indexOf(prefix) === 0) {
          items.push({ card: cid, label: m.label, date: m.date, done: m.done, type: m.type });
        }
      });
    }

    if (items.length === 0) return;

    items.sort(function(a, b) { return a.date.localeCompare(b.date); });

    var html = '<div class="rc-summary">';
    html += '<div class="rc-sum-title">📅 本月里程碑 (' + items.length + ')</div>';
    for (var i = 0; i < items.length; i++) {
      var m = items[i];
      var dayStr = m.date.slice(5); // "MM-DD"
      var statusIcon = m.done ? '✅' : '🔄';
      html += '<div class="rc-sum-item">';
      html += '<span class="rc-sum-date">' + dayStr + '</span>';
      html += '<span class="rc-sum-label">' + esc(m.label) + '</span>';
      html += '<span class="rc-sum-status">' + statusIcon + '</span>';
      html += '<span class="rc-sum-card">' + esc(m.card) + '</span>';
      html += '</div>';
    }
    html += '</div>';

    // Append after grid
    var grid = body.querySelector('.rc-grid');
    if (grid) {
      grid.insertAdjacentHTML('afterend', html);
    }
  }

  // ===== esc helper (HTML entities) =====
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m];
    });
  }
```

- [ ] **Step 2: Wire cell clicks and summary into renderCalendar()**

Update the `renderCalendar` function to:
- After `body.innerHTML = html`, add event listeners on cells and call `renderSummary()`
- Also add cell click handling

After the navigation wiring block in renderCalendar(), add:

```javascript
    // Wire cell clicks
    body.querySelectorAll('.rc-cell:not(.rc-other)').forEach(function(cell) {
      cell.addEventListener('click', function() {
        var dateStr = this.dataset.date;
        showPopup(dateStr, this);
      });
    });

    // Render milestone summary
    renderSummary();
```

- [ ] **Step 3: Verify syntax**

```bash
node --check js/feature-realcalendar.js
```

- [ ] **Step 4: Commit**

```bash
git add js/feature-realcalendar.js
git commit -m "feat: add milestone popup + monthly summary list"
```

---

### Task 4: Wire into HTML — button + script tag

**Files:**
- Modify: `plan-plan-fighting.html`

- [ ] **Step 1: Add toolbar button next to existing calBtn (line ~1186)**

Add after the existing `calBtn` (line 1186):

```html
<button class="bb" id="rcBtn" title="月历"><span class="bb-icon">🗓️</span><span class="lb-lbl">月历</span></button>
```

- [ ] **Step 2: Add script tag after feature-monthview.js (line ~5634)**

```html
<script src="js/feature-realcalendar.js"></script>
```

- [ ] **Step 3: Wire button + open/close in the feature file**

Add at the end of the IIFE in `js/feature-realcalendar.js`:

```javascript
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
```

- [ ] **Step 4: Verify full HTML syntax**

```bash
node C:\Users\25300\AppData\Local\Temp\opencode\find_js_error.js  # checks inline JS via vm.Script
```
Or use the existing `find_js_error.js` script.

- [ ] **Step 5: Commit**

```bash
git add plan-plan-fighting.html js/feature-realcalendar.js
git commit -m "feat: wire realcalendar button + script tag into page"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Every spec requirement is covered — Gregorian grid (Task 2), milestone dots (Task 2), milestone popup (Task 3), monthly summary (Task 3), new button (Task 4), existing monthview untouched (all tasks).
- [ ] **Placeholder scan:** No "TBD", "TODO", or placeholder code.
- [ ] **Type consistency:** All function names, IDs, and variable names are consistent across tasks.
- [ ] **Task independence:** Each task produces independently verifiable output.
