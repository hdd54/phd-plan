# 博士四年 · 全景规划 项目摘要

## 项目性质
一个面向博士生的四年全景规划网页工具，集 PWA 和 Electron 桌面应用于一体。目标用户是北京航空航天大学生物医学光子学专业的博士生（2026–2030）。

## 文件结构
- `plan-plan-fighting.html` — 主规划工具（单页应用，多页面系统）
- `index.html` — 旧版入口（重定向/备用）
- `cover.html` — 新建入口封面页（暗色学者主题、粒子动画背景、进入按钮）
- `main.js` — 主逻辑（已转移到 plan-plan-fighting.html 内 `<script>`）
- `manifest.json` — PWA 清单
- `sw.js` — Service Worker（NetworkFirst 策略）
- `icon.svg` — 应用图标
- `package.json` — Electron 打包配置

## 核心功能（已实现）
- 多页面系统：博士计划（默认页）+ 用户自定义计划页（新增/切换/删除）
- 四年度时间轴（2026-2029），按年/月/周展开，周计划强制 7 天（周一~周日）
- 动态添加月份和年份
- 所有文本区域均可编辑（点击即编辑模式）
- 页面可自定义标题和分类标签（默认：生涯/学术/收入/考公）
- 显示设置弹窗：字号、字体、行距控制
- footer 通过 `data._footer` 存储，可编辑
- 持久化存储（localStorage），刷新/离线均可使用
- PWA 离线可用 + 版本检测更新
- Electron 打包支持

## 最近变更

### Bug 修复（commit `0ea4ad0`）
1. **页面工具栏博士计划按钮丢失** — `renderPageToolbar()` 中 page0（"🎓 博士计划"）在切换到其他页面再切回时会消失。修复：在循环外独立渲染 page0 按钮，确保始终显示。
2. **新页面底部显示残留内容** — 实为 footer 文本从默认页泄漏到新页面。修复：footer 内容存储于 `data._footer`，新增页面默认空字符串，可独立编辑。
3. **addPageSection 未暴露全局** — 该函数定义在 IIFE 内，inline onclick 处理程序无法调用，导致新页面无法添加月份/年份。修复：通过 `window.addPageSection = addPageSection` 暴露到全局。

### 入口封面页（新增 `cover.html`）
- 暗色学者主题，匹配主工具视觉风格（#0a0908 背景、#d4a574 金色、朱砂红印章）
- 粒子画布背景：金色、朱砂红、翡翠绿、墨色四类粒子漂浮，鼠标悬停产生斥力效果
- 渐入动画标题「博士四年 · 全景规划」+「研」字印章装饰
- 统计数字行（SCI 目标 / 专利 / 存款 / 考公年限）
- 「进入规划」按钮锚定到 `plan-plan-fighting.html`
- 响应式适配 + prefers-reduced-motion 支持

### 动态页面大标题格式统一（commit `d7f8991`）
- `renderDynamicPage()` 新增 hero 节区：hmark（大标题）、hline（装饰分隔线）、hsub（副标题）、hstats（统计行），格式与 博士计划（page0）完全一致
- 动态页面 hero 内容通过 `data[pageId + '-hmark']` 等 per-page key 独立持久化，编辑后刷新保留
- 全局 blur 处理程序增加 `data-dyn-page` 判断：动态页面 hero 编辑存 per-page key，page0 hero 编辑沿用原 `data._overviews`

## 设计系统
- **配色**：`#0a0908`（墨黑底）、`#d4a574`（金色主题）、`#CC2936`（朱砂红）、`#3b7a5c`（翡翠绿）、`#f4f1ea`（暖白文字）
- **字体**：Fraunces（衬线展示）、Space Grotesk（无衬线正文）、Songti SC（中文字体）
- **装饰语言**：中式印章、水平分隔线配 diamond 符号、书法留白感间隔
