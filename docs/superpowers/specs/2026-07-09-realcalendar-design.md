# Real Calendar + Milestone Calendar Design

## Overview
Add a real Gregorian month-view calendar to the plan-plan-fighting app,
showing milestone markers on dates. Separate from the existing abstract
week-group heatmap (`feature-monthview.js`).

## File
- New standalone feature: `js/feature-realcalendar.js`
- No changes to existing `feature-monthview.js`

## Entry
New button in the main UI: **「📅 月历」**
Click → opens modal with the calendar.

## Calendar Grid
- Standard 7-column grid: 周一 ~ 周日
- First day of month = 周一 (not Sunday)
- Days outside current month: dimmed/light styling
- Today: highlighted with accent circle
- Header: `◀  2026年7月  ▶` navigation + `[今天]` jump-to-today button
- Rows: 4–6 rows depending on month

## Milestones on Calendar
- Existing milestone data from `data._milestones[cid] = [{label, date, done, type}]`
- Milestones shown as **small colored dots** (●) on the date cell
- Multiple milestones per day: multiple dots
- Dot color: green = done, gold = in-progress, grey = pending
- Clicking a date cell → **popup bubble** (click-based, not hover) showing the milestones for that day:
  ```
  🏆 看房目标达成 · y1 · ✅ 已完成
  📌 贷款预审提交 · y3 · 🔄 进行中
  ```

## Monthly Milestone Summary
Below the calendar grid, a compact list:
```
📅 本月里程碑 (3)
  01-15  看房目标达成          ✅ y1
  01-20  贷款预审提交          🔄 y3
  01-28  首付资金到位          ✅ y2
```

## Interaction
- Click any date cell → show popup with all milestones for that day
- Click outside popup → dismiss
- Month navigation: prev/next buttons, today button
- Calendar scrolls through all months (no limit on past/future)

## Data
- Milestones read from `window.data._milestones` (existing structure, no changes)
- No task data needed on this calendar (purely milestone + date view)
- No new data model required

## CSS
- Injected via JS `document.createElement('style')` (same pattern as other features)
- Dark theme compatible (uses existing CSS variables: `--fg`, `--fg-dim`, `--muted`, `--accent`, etc.)
- Calendar grid: clean lines, subtle cell borders, responsive via clamp()

## Non-Goals
- Task completion heatmap on this calendar (kept in old monthview)
- Data migration or week-to-date mapping
- Editing milestones from the calendar view (read-only display)

## Design Constraints
- Zero-dependency vanilla JS
- Follows existing feature pattern: IIFE, `window.__features` guard, injected CSS
- Must not break existing monthview or any other feature
