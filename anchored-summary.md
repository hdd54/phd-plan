# 博士四年 · 全景规划 项目摘要

## 项目性质
一个面向博士生的四年全景规划网页工具，集 PWA 和 Electron 桌面应用于一体。目标用户是北京航空航天大学生物医学光子学专业的博士生（2026–2030）。

## 文件结构
- `plan-plan-fighting.html` — 主规划工具（单页应用，多页面系统），含 6160+ 行 HTML
- `index.html` — 旧版入口（重定向到 plan-plan-fighting.html）
- `cover.html` — 新建入口封面页（已整合进主 HTML）
- `css/` — 样式文件（从主 HTML 中提取）
- `js/` — 23 个 JS 文件（从主 HTML 中提取的功能模块 + 核心库）
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

## 功能模块（23 个 JS 文件）

### 核心
- `core.js` — 数据层、存储、全局初始化
- `app.js` — 应用主入口
- `calendar-reminders.js` — 日历提醒

### 论文管理
- `feature-paper-milestones.js` — 论文里程碑追踪（投稿/修改/接收/发表）
- `feature-literature.js` — 文献笔记本（标题/作者/期刊/关键词/评分/笔记）

### 实验与时间线
- `feature-exp-log.js` — 实验日志（记录实验日期/条件/结果）
- `feature-career-timeline.js` — 选调/求职时间线（公考/选调/求职节点追踪）
- `feature-weekly-review.js` — 周期回顾（周/月/年回顾，结构化总结模板）

### 财务与看房
- `feature-mortgage-compare.js` — 房贷多方案对比（利率/年限/月供/总利息）
- `feature-fundloan.js` — 公积金/商贷计算
- `feature-housing.js` — 看房记录
- `feature-houselist.js` — 房源清单
- `feature-housing-all.js` — 所有房产数据

### 数据与视图
- `feature-city-cards.js` — 城市数据卡（城市对比/数据展示）
- `feature-stats.js` — 统计视图
- `feature-map-globe.js` — 3D 地图/地球视图（Three.js）
- `feature-search.js` — 搜索功能

### 工具与辅助
- `feature-tags.js` — 标签系统
- `feature-theme.js` — 主题切换
- `feature-export.js` — 数据导出
- `feature-pdf.js` — PDF 生成
- `feature-realcalendar.js` — 真实日历视图
- `feature-reminder.js` — 提醒功能

## Cover 翻页书 + 动画过渡
- **翻页书布局**：左侧书封面（计划书/全景规划/印章），右侧 TOC 目录（可翻页，每页 8 条）
- **Three.js 交互式 3D 背景**：线框几何体 + 连接线 + 粒子系统 + 辉光精灵 + 滚动视差
- **进入动画**：翻页 → 缩小 → 上滑消失，延迟暴露 UI

## 设计系统
- **配色**：`#0a0908`（墨黑底）、`#d4a574`（金色主题）、`#CC2936`（朱砂红）、`#3b7a5c`（翡翠绿）、`#f4f1ea`（暖白文字）
- **字体**：Fraunces（衬线展示）、Space Grotesk（无衬线正文）、Songti SC（中文字体）
- **装饰语言**：中式印章、水平分隔线配 diamond 符号、书法留白感间隔

## 最近变更（current session）
1. **HTML 瘦身**：CSS 提取到 `css/`，JS 功能模块提取到 `js/`（23 个文件）
2. **新增 5 个功能**：论文里程碑、实验日志、选调/求职时间线、房贷多方案对比、城市数据卡
3. **新增 2 个增强功能**：周期回顾（周/月/年）、文献笔记本
4. **文件结构清理**：所有功能采用一致的 JS 模块模式
5. **Git 提交**：已提交到 GitHub（commit aa0d4ef, branch main）
