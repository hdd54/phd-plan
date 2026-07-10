# 3D Map and Calendar Reminders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the world map as a theme-aware interactive 3D globe, keep China as a matching 2D interactive map, and display unfinished calendar items due within seven days in the daily overview on every page load.

**Architecture:** Add one pure calendar-reminder utility and one focused Three.js globe renderer, then connect both through the existing map and overview code in `plan-plan-fighting.html`. Preserve `_mapNotesV2`, `data._calEntries`, the current China GeoJSON work, and the existing 2D world fallback.

**Tech Stack:** Static HTML/CSS/JavaScript, Three.js r128, D3 v7, TopoJSON Client 3, Node.js built-in test runner, Playwright browser verification.

## Global Constraints

- Do not change the `_mapNotesV2` or `data._calEntries` storage schemas.
- Read map colors from `--bg`, `--bg2`, `--bg3`, `--fg`, `--line`, and `--accent`.
- Preserve the uncommitted China GeoJSON changes already present in `plan-plan-fighting.html`.
- Fall back to the existing 2D world map when WebGL or remote geographic data is unavailable.
- Do not create duplicate animation loops or pointer handlers when the map modal is reopened.

---

### Task 1: Shared Calendar Reminder Utility

**Files:**
- Create: `js/calendar-reminders.js`
- Create: `tests/calendar-reminders.test.js`
- Modify: `js/feature-realcalendar.js`

**Interfaces:**
- Produces: `window.CalendarReminders.collect(data, today, horizonDays)` returning sorted `{date, days, label, entryIndex}` records.
- Consumes: `data._calEntries`, date keys in `YYYY-MM-DD`, and entries shaped as `{label:string, done:boolean}`.

- [ ] **Step 1: Write failing utility tests**

Create tests using `node:test`, load `js/calendar-reminders.js` through `vm.runInNewContext`, and assert that a fixed local date includes unfinished items on days 0 and 7 while excluding day 8, expired, completed, invalid-date, and empty-label entries:

```javascript
test('collects unfinished reminders from today through day seven', function () {
  const data = {_calEntries: {
    '2026-07-10': [{label: '今天事项', done: false}],
    '2026-07-17': [{label: '第七天事项', done: false}],
    '2026-07-18': [{label: '第八天事项', done: false}],
    '2026-07-09': [{label: '过期事项', done: false}],
    '2026-07-12': [{label: '已完成', done: true}, {label: '  ', done: false}],
    'not-a-date': [{label: '无效日期', done: false}]
  }};
  assert.deepEqual(collect(data, new Date(2026, 6, 10), 7), [
    {date: '2026-07-10', days: 0, label: '今天事项', entryIndex: 0},
    {date: '2026-07-17', days: 7, label: '第七天事项', entryIndex: 0}
  ]);
});
```

- [ ] **Step 2: Run the test and verify the initial failure**

Run: `node --test tests/calendar-reminders.test.js`

Expected: FAIL because `js/calendar-reminders.js` does not exist.

- [ ] **Step 3: Implement the pure reminder collector**

Create an IIFE that exposes a single frozen API. Parse date keys with a strict regex and construct local-midnight dates to avoid UTC shifts:

```javascript
(function (global) {
  'use strict';
  function parseDateKey(key) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key));
    if (!match) return null;
    var date = new Date(+match[1], +match[2] - 1, +match[3]);
    return date.getFullYear() === +match[1] && date.getMonth() === +match[2] - 1 && date.getDate() === +match[3] ? date : null;
  }
  function collect(data, today, horizonDays) {
    var base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var horizon = Number.isFinite(horizonDays) ? horizonDays : 7;
    var all = data && data._calEntries || {};
    var output = [];
    Object.keys(all).forEach(function (dateKey) {
      var date = parseDateKey(dateKey);
      if (!date || !Array.isArray(all[dateKey])) return;
      var days = Math.round((date - base) / 86400000);
      if (days < 0 || days > horizon) return;
      all[dateKey].forEach(function (entry, entryIndex) {
        var label = entry && String(entry.label || '').trim();
        if (!label || entry.done) return;
        output.push({date: dateKey, days: days, label: label, entryIndex: entryIndex});
      });
    });
    return output.sort(function (a, b) { return a.days - b.days || a.entryIndex - b.entryIndex; });
  }
  global.CalendarReminders = Object.freeze({collect: collect});
})(typeof window === 'undefined' ? globalThis : window);
```

- [ ] **Step 4: Replace duplicate calendar reminder filtering**

In `js/feature-realcalendar.js`, make `reminderItems()` delegate to `window.CalendarReminders.collect(window.data, new Date(), 7)`. Keep a defensive empty-array result when the utility is unavailable.

- [ ] **Step 5: Run utility and syntax tests**

Run: `node --test tests/calendar-reminders.test.js`

Expected: PASS with one passing test and zero failures.

Run: `node -e "const fs=require('fs');new Function(fs.readFileSync('js/calendar-reminders.js','utf8'));new Function(fs.readFileSync('js/feature-realcalendar.js','utf8'));console.log('calendar scripts ok')"`

Expected: `calendar scripts ok`.

---

### Task 2: Theme-Aware Three.js Globe Renderer

**Files:**
- Create: `js/feature-map-globe.js`
- Create: `tests/map-globe-contract.test.js`
- Modify: `plan-plan-fighting.html`

**Interfaces:**
- Produces: `window.MapGlobeRenderer.create(options)` returning `{setRegions, setSelected, renderTheme, zoomBy, resetView, resize, destroy}`.
- Consumes: `options.container`, world regions containing GeoJSON features, and callbacks `onHover(region, clientX, clientY)`, `onLeave()`, and `onSelect(region)`.

- [ ] **Step 1: Write failing contract tests**

Add a static Node test that verifies the renderer source exposes the required factory and public methods, contains `THREE.Raycaster`, uses a picking canvas, and does not instantiate more than one animation loop per renderer.

```javascript
test('globe renderer exposes the required interaction contract', function () {
  const source = fs.readFileSync('js/feature-map-globe.js', 'utf8');
  ['MapGlobeRenderer', 'setRegions', 'setSelected', 'renderTheme', 'zoomBy', 'resetView', 'resize', 'destroy', 'THREE.Raycaster'].forEach(function (token) {
    assert.match(source, new RegExp(token));
  });
  new Function(source);
});
```

- [ ] **Step 2: Run the contract test and verify the initial failure**

Run: `node --test tests/map-globe-contract.test.js`

Expected: FAIL because `js/feature-map-globe.js` does not exist.

- [ ] **Step 3: Implement renderer lifecycle and themed textures**

Create one renderer, scene, camera, sphere, ambient light, raycaster, visible texture canvas, and offscreen picking canvas per `create()` call. Use `d3.geoEquirectangular()` and `d3.geoPath(context)` to paint each feature twice: once using computed theme colors and once using a unique RGB identifier.

```javascript
function readTheme() {
  var css = getComputedStyle(document.documentElement);
  return {
    ocean: css.getPropertyValue('--bg3').trim() || '#111',
    land: css.getPropertyValue('--bg2').trim() || '#222',
    border: css.getPropertyValue('--fg').trim() || '#ddd',
    accent: css.getPropertyValue('--accent').trim() || '#d4a574'
  };
}
```

Store `id -> region` in an array matching pick colors. On each selection or theme update, repaint the visible texture and set `texture.needsUpdate = true`.

- [ ] **Step 4: Implement rotation, zoom, picking, and cleanup**

Use pointer capture for dragging, clamp sphere X rotation to `[-1.2, 1.2]`, normalize Y rotation, and clamp camera Z to `[2.2, 5.5]`. Raycast the sphere on pointer movement, convert the hit UV to picking-canvas pixels, and resolve the country from its RGB id. Cancel `requestAnimationFrame`, disconnect `ResizeObserver`, remove listeners, dispose geometries, materials, textures, and renderer in `destroy()`.

- [ ] **Step 5: Connect the renderer to the existing map app**

In `plan-plan-fighting.html`:

- Add `<script src="js/feature-map-globe.js"></script>` after Three.js and before the main inline application script.
- Change the world map page to contain a dedicated `#globe-3d` canvas host and retain `#globe-svg` as the hidden fallback.
- In `renderWorldFull`, call `MapGlobeRenderer.create()` once, pass the existing `onHover`, `hideTip`, and `selectRegion` behavior, then call `setRegions(data)` and `setSelected(selected)`.
- Route world zoom controls to `zoomBy()` and `resetView()`; retain SVG viewBox zoom for China.
- Resize the globe after opening the modal and after switching to the world tab.
- Preserve the current 2D SVG renderer and activate it only on renderer or data failure.

- [ ] **Step 6: Align China and globe styling**

Update map CSS so the globe host, China SVG background, borders, hover state, and selected glow use the same CSS variables. Keep China flat and preserve its current D3 Mercator province rendering and note selection behavior.

- [ ] **Step 7: Run renderer contract and syntax checks**

Run: `node --test tests/map-globe-contract.test.js`

Expected: PASS with zero failures.

Run: `node -e "const fs=require('fs');new Function(fs.readFileSync('js/feature-map-globe.js','utf8'));const html=fs.readFileSync('plan-plan-fighting.html','utf8');const re=/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;for(const m of html.matchAll(re))new Function(m[1]);console.log('map scripts ok')"`

Expected: `map scripts ok`.

---

### Task 3: Daily Overview Integration and Browser Verification

**Files:**
- Modify: `plan-plan-fighting.html`
- Test: `tests/calendar-reminders.test.js`
- Test: `tests/map-globe-contract.test.js`

**Interfaces:**
- Consumes: `window.CalendarReminders.collect(data, new Date(), 7)`.
- Produces: `#doReminders` reminder list rendered whenever `showDailyOverview()` runs after page load.

- [ ] **Step 1: Load the reminder utility before application startup**

Add `<script src="js/calendar-reminders.js"></script>` before the main inline script so both the daily overview and real calendar can use the same filtering rules.

- [ ] **Step 2: Add the reminder section and theme styles**

Insert a `#doReminders` section between `.do-stats` and `#doTip`. Style it with existing background, line, foreground, muted, and accent variables; constrain its height and allow vertical scrolling so many reminders cannot cover the action button.

- [ ] **Step 3: Render reminders on every page load**

Remove the `doLast` read, comparison, and write from `showDailyOverview()`. Collect reminders, escape event text, and render rows with `MM-DD`, `今天` or `N天后`, and the label. Render `未来7天暂无未完成事项` when empty.

```javascript
var reminders = window.CalendarReminders ? window.CalendarReminders.collect(_d, new Date(), 7) : [];
reminderEl.innerHTML = reminders.length ? reminders.map(function (item) {
  return '<div class="do-reminder-row"><time>' + item.date.slice(5) + '</time><span>' +
    (item.days === 0 ? '今天' : item.days + '天后') + '</span><strong>' + esc(item.label) + '</strong></div>';
}).join('') : '<div class="do-reminder-empty">未来7天暂无未完成事项</div>';
```

- [ ] **Step 4: Run all automated checks**

Run: `node --test tests/calendar-reminders.test.js tests/map-globe-contract.test.js`

Expected: all tests pass with zero failures.

Run the inline and external script parse command, then run `git diff --check`.

Expected: both commands exit with status 0.

- [ ] **Step 5: Verify in a real browser**

Start a local static server on an available port and use Playwright at desktop `1440x900` and mobile `390x844` sizes. Verify nonblank globe pixels, drag rotation, wheel and button zoom, hover tooltip, country click, note paging, China province hover/click/zoom, theme switching, no overlap, and no console errors.

Seed calendar entries for today, day 7, day 8, completed, and expired items in local storage. Reload twice and verify the overview opens both times and only today through day 7 unfinished entries appear.

- [ ] **Step 6: Review, commit, and push**

Inspect `git diff` so the pre-existing China changes are retained. Stage only the intended implementation, tests, and documentation, then commit with:

```text
feat: add 3D world map and overview reminders
```

Push `main` to `origin` and confirm the remote branch contains the new commit.
