# Feature Pack: Tag + 10 New Features Design

## Architecture

**Monolith with modular JS includes.** Single HTML file loads feature modules as needed via dynamic `<script>` injection. Each module self-initializes when its button/trigger is clicked. No build step, no bundler.

### File Structure
```
plan-plan-fighting.html      # Core app + CSS (unchanged)
js/
  core.js                    # Data layer (load/save/init), shared utils
  feature-tags.js            # Tag system (enhanced colors)
  feature-theme.js           # Dark/Light theme toggle
  feature-export.js          # Export/import backup
  feature-search.js          # Task search & filter
  feature-monthview.js       # Month calendar heatmap
  feature-stats.js           # Monthly statistics dashboard
  feature-housing.js         # Housing cost total table
  feature-reminder.js        # Task deadline reminders
  feature-fundloan.js        # Provident fund + combo loan calc
  feature-houselist.js       # House hunting checklist
  feature-pdf.js             # PDF report export
```

### Loading Strategy
- `core.js` loaded on page init (in `<head>`)
- Feature modules loaded on demand when user clicks the bottom bar button
- Each module registers itself: `window.__features = window.__features || {};`

---

## 1. Tag System Enhancement

### Current
- 7 tag colors (none/red/green/yellow/blue/purple/orange) → 6 colored + 1 none
- Tag picker shown on hover over each `.dr` row
- Pick a tag → dot color changes

### New
- **13 colors**: none, red, green, yellow, blue, purple, orange, pink, teal, sky, lime, brown, gray
- Compact single-row display: dot + short label text (1-2 chars) shown inline
- Click dot → open color picker popover (not hover-only)
- Tag data stored on each task as `{ text, done, tag }` where `tag` is color key
- **Daily panel** (每日任务) also gets tag picker

### Data
```js
// Color map (new)
TAG_COLORS = {
  '':   { cls: 'n',  label: '无', bg: 'var(--line-2)' },
  'r':  { cls: 'r',  label: '实验', bg: '#e74c3c' },
  'g':  { cls: 'g',  label: '写作', bg: '#2ecc71' },
  'y':  { cls: 'y',  label: '备考', bg: '#c9a040' },
  'b':  { cls: 'b',  label: '杂务', bg: '#4a7c8c' },
  'p':  { cls: 'p',  label: '阅读', bg: '#8b5cf6' },
  'o':  { cls: 'o',  label: '其他', bg: '#d4a574' },
  'k':  { cls: 'k',  label: '论文', bg: '#e91e63' },
  't':  { cls: 't',  label: '代码', bg: '#00bcd4' },
  's':  { cls: 's',  label: '会议', bg: '#87ceeb' },
  'l':  { cls: 'l',  label: '健身', bg: '#8bc34a' },
  'w':  { cls: 'w',  label: '理财', bg: '#795548' },
  'v':  { cls: 'v',  label: '杂项', bg: '#9e9e9e' },
};
```

### UI Changes in Week Row
Each `.dr` row becomes:
```
[day-label] [textarea] [tag-dot + short-label] [MD-btn] [checkbox] [journal-btn]
```
All on one compact row. The tag part is a small colored dot + 2-char abbreviation.

---

## 2. Theme Toggle (🌙)

### Behavior
- Toggle between **Dark** (current: charcoal/gold) and **Light** (warm paper/ink)
- Bottom bar button `🌙` / `☀️` reflects current mode
- CSS variables swapped via `document.documentElement.classList.toggle('light')`
- Preference saved to `localStorage._theme`

### Light Theme Variables
```css
.light {
  --bg: #faf7f2;
  --bg2: #f0ece6;
  --bg3: #e8e2d8;
  --fg: #2c2418;
  --fg-dim: #6b5d4f;
  --muted: #a09888;
  --line: rgba(0,0,0,.08);
  --line-2: rgba(0,0,0,.12);
}
```

---

## 3. Export / Backup (📤)

### Export
- Serialize entire `localStorage` (all `data.*` keys) as JSON
- Download as `phd-plan-backup-YYYY-MM-DD.json`

### Import
- File picker → read JSON → validate format → overwrite localStorage → reload page

### UI
- Bottom bar `📤` → modal with two buttons: "📥 下载备份" / "📤 恢复备份"
- Confirmation dialog before restore

---

## 4. Task Search & Filter (🔍)

### Behavior
- Search bar inserted at top of weeks-wrap (above tag filter bar)
- Real-time filtering on input: matches against task text content
- Also filterable by tag color (existing tag filter bar remains)
- Search and tag filter combine (AND logic)

### UI
- `<input>` with placeholder "🔍 搜索任务…" and ✕ clear button
- Matching rows highlighted, non-matching hidden
- Match count shown ("找到 3 项")

---

## 5. Month View Calendar (📅)

### Data Source
- Aggregate from all `data[cardId][wi].d` entries, grouped by day-of-week + week index
- Compute per-day: total tasks, completed tasks, completion %

### UI: Bottom bar `📅` modal
- Simple calendar grid: 7 columns (周一~周日), rows for each week
- Each cell shows ☐ / ☑ count with heatmap color (green intensity)
- Current week highlighted
- Navigation: prev/next month buttons

---

## 6. Monthly Statistics Dashboard (📊)

### Data Source
- Same aggregation as month view
- Plus pomo log data (`data._pomoLog`)

### Charts (pure CSS/HTML, no library)
- **Completion trend**: bar chart per week, 4-5 weeks shown
- **Tag distribution**: colored horizontal stacked bar
- **Pomo total**: total hours by week

### UI: Bottom bar `📊` modal
- Three card sections stacked vertically
- Numbers: total tasks, completed, rate%, pomo hours

---

## 7. Housing Cost Total Table (🏠)

### Fields
- 首付 (down payment)
- 贷款总额 (loan total)
- 税费估算 (taxes)
- 装修预算 (renovation)
- 物业费/月 (monthly property fee)
- 其他费用 (other)

### Calculations
- 总预算 = 首付 + 贷款 + 税费 + 装修 + 其他
- 月固定支出 = 月供 + 物业费

### UI: Bottom bar `🏠` modal
- Form with input fields, real-time total display
- Save button → `localStorage._housingCost`
- Editable (loads last saved values)

---

## 8. Task Reminders (⏰)

### Data
- `data._reminders[]` array of `{ cardId, wi, di, text, deadline, notified }`
- Deadline stored as ISO datetime string

### UI
- Each task row gets a small clock icon `🕐` if reminder set
- Click the icon → date/time picker popup
- Deadline shown as small text below task
- Overdue tasks highlighted red

### Notification
- On page load + every 60s, check for approaching deadlines (< 1 hour)
- Show browser notification + in-app toast
- Uses existing Notification API

---

## 9. Provident Fund + Combo Loan Calculator (🧮)

### Fields
- 公积金贷款额度 (fund loan amount)
- 公积金利率 (fund rate, default 3.1%)
- 公积金年限 (fund years)
- 商业贷款额度 (commercial loan amount)
- 商业贷款利率 (commercial rate, default 3.5%)
- 商业贷款年限 (commercial years)

### Calculations
- 公积金月供 (equal principal + interest)
- 商业贷款月供
- 总月供 = 公积金月供 + 商业贷款月供
- 总利息 = 公积金利息 + 商业贷款利息
- 还款总额

### UI: Bottom bar `🧮` modal
- Two sections (公积金 / 商贷) with inputs
- Combined result at bottom
- Tooltip explanation of formulas

---

## 10. House Hunting Checklist (🏡)

### Data: `data._houseList[]`
```js
{
  id: timestamp,
  name: '小区名',
  address: '地址',
  price: 350, // 万
  area: 89,   // ㎡
  layout: '3室2厅',
  floor: '15/30',
  orientation: '南',
  year: 2015,
  pros: '地铁近, 户型好',
  cons: '临街吵',
  score: 4,   // 1-5
  status: 'pending' // pending|visited|rejected|interested
}
```

### UI: Bottom bar `🏡` modal
- List of properties as cards
- "添加房源" button → form modal
- Each card shows: name, price, area, score stars, pros/cons
- Sort by: price, area, score
- Status badges (待看/已看/排除/有意)

---

## 11. PDF Report Export (📄)

### Approach
- Use `window.print()` with print-specific CSS styles
- Custom print stylesheet hides UI controls, shows clean report
- Sections: Progress summary → Monthly stats → Housing cost → Property list

### Trigger
- Bottom bar `📄` → opens print dialog
- Before print, inject report layout into a print-only div

---

## Implementation Order

1. **Tag system enhancement** (touches existing code, get it right first)
2. Theme toggle (simple CSS swap)
3. Export/backup (utility, no UI complexity)
4. Task search & filter (adds to existing weeks UI)
5. Month view calendar (new modal)
6. Monthly stats dashboard (new modal)
7. Housing cost table (new modal)
8. Task reminders (modifies existing rows)
9. Fund loan calculator (new modal)
10. House checklist (new modal)
11. PDF export (print styles)

## CSS Variables for All Features
All feature modals follow existing modal pattern:
- Overlay with backdrop blur
- Centered modal container
- Gold accent buttons
- Sans-serif font stack
- Responsive to mobile

## File Loading
Each `js/feature-*.js` file:
1. Checks if already loaded (`window.__features[name]`)
2. If not, injects its CSS (if any) via `<style>` element
3. Registers its bottom bar button handler
4. Self-initializes on first click
