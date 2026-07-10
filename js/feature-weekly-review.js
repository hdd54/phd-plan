// ===== FEATURE: Periodic Review (周/月/年回顾) =====
// Generates review reports from existing plan data for group meetings
(function(){
  if(window.__features['weekly-review']) return;
  window.__features['weekly-review'] = true;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .rw-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .rw-overlay.s{display:block}
    .rw-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(92vw,680px);max-height:88vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .rw-modal.s{display:flex}
    .rw-header{display:flex;align-items:center;gap:clamp(.3rem,.5vw,.5rem);padding:clamp(.4rem,.7vw,.6rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line);flex-wrap:wrap}
    .rw-header h3{font-family:var(--font-serif);font-size:clamp(.7rem,1.1vw,.85rem);font-weight:600;color:var(--fg);margin-right:.2rem}
    .rw-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem;margin-left:auto}
    .rw-close:hover{color:var(--accent)}
    .rw-tabs{display:flex;gap:.15rem}
    .rw-tab{background:transparent;border:1px solid var(--line);color:var(--muted);padding:clamp(.15rem,.25vw,.2rem) clamp(.3rem,.5vw,.4rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.42rem,.65vw,.48rem);transition:all .2s}
    .rw-tab.s{background:rgba(212,165,116,.12);border-color:var(--accent);color:var(--accent)}
    .rw-tab:hover{border-color:var(--accent);color:var(--accent)}
    .rw-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .rw-toolbar{display:flex;align-items:center;gap:.3rem;margin-bottom:.5rem;flex-wrap:wrap}
    .rw-nav{font-size:clamp(.7rem,1vw,.8rem);color:var(--muted);cursor:pointer;padding:.05rem .15rem;user-select:none}
    .rw-nav:hover{color:var(--accent)}
    .rw-label{flex:1;font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.6rem);color:var(--fg);font-weight:500;text-align:center}
    .rw-copy-btn{background:rgba(212,165,116,.1);border:1px solid var(--accent);color:var(--accent);padding:clamp(.15rem,.25vw,.22rem) clamp(.3rem,.5vw,.4rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.4rem,.65vw,.45rem);transition:all .2s}
    .rw-copy-btn:hover{background:rgba(212,165,116,.2)}

    .rw-report{font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.52rem);color:var(--fg);line-height:1.8;white-space:pre-wrap;background:var(--bg3);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.4rem,.65vw,.55rem);min-height:clamp(150px,40vh,300px);overflow-y:auto;tab-size:2}
    .rw-report .h{font-weight:600;color:var(--accent);font-size:clamp(.55rem,.85vw,.6rem)}
    .rw-report .h2{font-weight:600;color:var(--fg);font-size:clamp(.5rem,.75vw,.55rem);margin-top:.3rem}
    .rw-report .s{color:var(--muted);font-size:clamp(.4rem,.6vw,.45rem)}
    .rw-report .d{color:var(--fg-dim)}
    .rw-report .a{color:var(--accent)}
    .rw-empty{text-align:center;padding:2rem;color:var(--muted);font-size:clamp(.5rem,.8vw,.55rem)}
  `;
  document.head.appendChild(style);

  // ===== Helper: date utils =====
  function pad(n){ return n < 10 ? '0' + n : '' + n; }

  function getWeekNumber(d){
    var cd = new Date(d);
    cd.setHours(0,0,0,0);
    // ISO week
    cd.setDate(cd.getDate() + 3 - (cd.getDay() + 6) % 7);
    var week1 = new Date(cd.getFullYear(), 0, 4);
    return 1 + Math.round(((cd - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  function getWeekStart(d){
    var day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff);
  }

  function getWeekEnd(d){
    var start = getWeekStart(d);
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  }

  function formatDate(d){
    return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
  }

  function formatDateCN(d){
    return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日';
  }

  // ===== Data sources =====
  function getYears(){ return (window.data && window.data._customYears) || []; }
  function getPapers(){ return (window.data && window.data._papers) || []; }
  function getExpLog(){ return (window.data && window.data._expLog) || []; }

  // ===== Collect done tasks in a date range =====
  function collectDoneTasks(startDate, endDate, options){
    var results = { tasks: [], total: 0, done: 0 };
    var years = getYears();
    if(!years || years.length === 0) return results;

    var s = startDate.getTime(), e = endDate.getTime();

    years.forEach(function(year){
      if(!year.weeks) return;
      year.weeks.forEach(function(week){
        if(!week.d) return;
        // Parse week date info if available
        var weekStart = null;
        if(week.date || week.startDate){
          weekStart = new Date(week.date || week.startDate);
        } else if(year.id){
          // Approximate from year + week index
          var y = parseInt(year.id);
          if(!isNaN(y)){
            var wi = year.weeks.indexOf(week);
            var jan1 = new Date(y, 0, 1);
            weekStart = new Date(jan1);
            weekStart.setDate(jan1.getDate() + wi * 7);
          }
        }
        if(!weekStart) return;

        // Only check tasks that fall within range
        // (we can't know exact task dates, but we check the week)
        var ws = weekStart.getTime();
        if(ws < s || ws > e) return;

        week.d.forEach(function(task, ti){
          results.total++;
          if(typeof task === 'object' && task.done){
            results.done++;
            var text = typeof task.t === 'string' ? task.t : (typeof task === 'object' ? (task.t || task.text || '') : '');
            results.tasks.push({ text: text, week: week, taskIdx: ti });
          }
        });
      });
    });

    return results;
  }

  // ===== Collect exp logs in range =====
  function collectExpLogs(startDate, endDate){
    var logs = getExpLog();
    var s = startDate.getTime(), e = endDate.getTime();
    return logs.filter(function(l){
      if(!l.date) return false;
      var t = new Date(l.date).getTime();
      return t >= s && t <= e;
    });
  }

  // ===== Collect paper milestones in range =====
  function collectPapers(startDate, endDate){
    var papers = getPapers();
    var s = startDate.getTime(), e = endDate.getTime();
    return papers.filter(function(p){
      if(!p.date) return false;
      var t = new Date(p.date).getTime();
      return t >= s && t <= e;
    });
  }

  // ===== Collect journal entries in range =====
  function collectJournalEntries(startDate, endDate, opts){
    var entries = [];
    if(!window.data._journal) return entries;
    var s = startDate.getTime(), e = endDate.getTime();
    var journal = window.data._journal;
    Object.keys(journal).forEach(function(weekKey){
      var days = journal[weekKey];
      if(!days) return;
      Object.keys(days).forEach(function(dayKey){
        var dayData = days[dayKey];
        if(!dayData) return;
        // Try to determine date from key
        var dateStr = null;
        // Key might be YYYY-MM-DD or similar
        if(/^\d{4}-\d{2}-\d{2}/.test(dayKey)){
          dateStr = dayKey;
        }
        if(dateStr){
          var t = new Date(dateStr).getTime();
          if(t >= s && t <= e){
            var text = typeof dayData === 'string' ? dayData : (dayData.text || dayData.content || '');
            if(text) entries.push({ date: dateStr, text: text });
          }
        }
      });
    });
    return entries;
  }

  // ===== Generate report =====
  function generateReport(period, offset){
    var now = new Date();
    var startDate, endDate, label;

    if(period === 'week'){
      var weekStart = getWeekStart(now);
      weekStart.setDate(weekStart.getDate() + offset * 7);
      startDate = weekStart;
      endDate = new Date(weekStart);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23,59,59,999);
      label = formatDateCN(startDate) + ' ~ ' + formatDateCN(endDate) + ' (第' + getWeekNumber(startDate) + '周)';
    } else if(period === 'month'){
      var m = now.getMonth() + offset;
      var y = now.getFullYear();
      if(m < 0){ m = 11; y--; }
      if(m > 11){ m = 0; y++; }
      startDate = new Date(y, m, 1);
      endDate = new Date(y, m + 1, 0, 23, 59, 59, 999);
      label = y + '年' + (m+1) + '月';
    } else { // year
      var y = now.getFullYear() + offset;
      startDate = new Date(y, 0, 1);
      endDate = new Date(y, 11, 31, 23, 59, 59, 999);
      label = y + '年';
    }

    // Collect data
    var doneTasks = collectDoneTasks(startDate, endDate);
    var expLogs = collectExpLogs(startDate, endDate);
    var papers = collectPapers(startDate, endDate);
    var journal = collectJournalEntries(startDate, endDate);

    // Build report
    var lines = [];
    lines.push('═ '.repeat(20));
    lines.push('📊 ' + label + ' 组会汇报');
    lines.push('═ '.repeat(20));
    lines.push('');

    // 1. Task progress
    lines.push('━━━ 📋 本周任务进度 ━━━');
    if(doneTasks.total > 0){
      var pct = Math.round(doneTasks.done / doneTasks.total * 100);
      lines.push('完成：' + doneTasks.done + '/' + doneTasks.total + ' (' + pct + '%)');
      if(doneTasks.tasks.length > 0){
        lines.push('已完成事项：');
        doneTasks.tasks.forEach(function(t){
          lines.push('  ✅ ' + (t.text || '(未命名任务)'));
        });
      }
    } else {
      lines.push('（暂无任务数据）');
    }
    lines.push('');

    // 2. Experiments
    lines.push('━━━ 🔬 实验进展 ━━━');
    if(expLogs.length > 0){
      expLogs.forEach(function(log){
        lines.push('  [' + (log.date || '') + '] ' + (log.title || log.purpose || '(未命名)'));
        if(log.purpose) lines.push('    目的：' + log.purpose);
        if(log.results) lines.push('    结果：' + log.results);
      });
    } else {
      lines.push('  （暂无实验记录）');
    }
    lines.push('');

    // 3. Papers
    lines.push('━━━ 📄 论文进展 ━━━');
    if(papers.length > 0){
      papers.forEach(function(p){
        lines.push('  [' + (p.date || '') + '] ' + (p.title || '(未命名)') + ' — ' + (p.status || ''));
      });
    } else {
      lines.push('  （暂无论文更新）');
    }
    lines.push('');

    // 4. Journal highlights
    lines.push('━━━ 📝 日志摘要 ━━━');
    if(journal.length > 0){
      // Show last 5 entries max
      var shown = journal.slice(-5);
      shown.forEach(function(j){
        var preview = j.text.length > 80 ? j.text.substring(0, 80) + '...' : j.text;
        lines.push('  [' + j.date + '] ' + preview);
      });
    } else {
      lines.push('  （暂无日志）');
    }
    lines.push('');

    // 5. Status
    lines.push('━━━ 💬 下周计划 ━━━');
    lines.push('');
    lines.push('');
    lines.push('━━━ ⚠️ 遇到的问题 ━━━');
    lines.push('');
    lines.push('');
    lines.push('═ '.repeat(20));
    lines.push('由 PhD Planner 自动生成  |  ' + formatDateCN(new Date()));

    return { text: lines.join('\n'), label: label };
  }

  // ===== State =====
  var currentPeriod = 'week';
  var currentOffset = 0;

  // ===== Render =====
  function render(){
    var content = document.getElementById('rwContent');
    var label = document.getElementById('rwLabel');
    if(!content || !label) return;
    var report = generateReport(currentPeriod, currentOffset);
    label.textContent = report.label;
    content.innerHTML = '<div class="rw-report">' + report.text.replace(/\n/g, '<br>') + '</div>';
  }

  // ===== Copy to clipboard =====
  function copyReport(){
    var report = generateReport(currentPeriod, currentOffset);
    if(!report || !report.text) return;
    try {
      // Create a plain text Blob for clipboard (preserves formatting)
      var blob = new Blob([report.text], { type: 'text/plain' });
      navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': blob })
      ]).then(function(){
        // Visual feedback
        var btn = document.getElementById('rwCopyBtn');
        if(btn){
          var orig = btn.textContent;
          btn.textContent = '✅ 已复制!';
          setTimeout(function(){ btn.textContent = orig; }, 1500);
        }
      }).catch(function(){
        // Fallback
        fallbackCopy(report.text);
      });
    } catch(e) {
      fallbackCopy(report.text);
    }
  }

  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      var btn = document.getElementById('rwCopyBtn');
      if(btn){
        var orig = btn.textContent;
        btn.textContent = '✅ 已复制!';
        setTimeout(function(){ btn.textContent = orig; }, 1500);
      }
    } catch(e) {}
    document.body.removeChild(ta);
  }

  // ===== Modal =====
  function show(){
    currentOffset = 0;
    document.getElementById('rwOverlay').classList.add('s');
    document.getElementById('rwModal').classList.add('s');
    render();
  }
  function hide(){
    document.getElementById('rwOverlay').classList.remove('s');
    document.getElementById('rwModal').classList.remove('s');
  }
  function toggle(){
    var m = document.getElementById('rwModal');
    if(m.classList.contains('s')) hide(); else show();
  }

  // ===== Init =====
  function init(){
    document.getElementById('reviewBtn').addEventListener('click', toggle);
    document.getElementById('rwClose').addEventListener('click', hide);
    document.getElementById('rwOverlay').addEventListener('click', hide);
    document.getElementById('rwCopyBtn').addEventListener('click', copyReport);

    // Tab switching
    document.querySelectorAll('.rw-tab').forEach(function(tab){
      tab.addEventListener('click', function(){
        document.querySelectorAll('.rw-tab').forEach(function(t){ t.classList.remove('s'); });
        tab.classList.add('s');
        currentPeriod = tab.dataset.period;
        currentOffset = 0;
        render();
      });
    });

    // Navigation
    document.getElementById('rwPrev').addEventListener('click', function(){
      currentOffset--;
      render();
    });
    document.getElementById('rwNext').addEventListener('click', function(){
      currentOffset++;
      render();
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  console.log('feature-weekly-review: loaded');
})();
