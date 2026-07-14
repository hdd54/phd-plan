// ===== FEATURE: Dashboard (升级版统计) =====
(function(){
  if(window.__features['stats']) return;
  window.__features['stats'] = true;

  var OVERLAY_ID = 'statOverlay';
  var MODAL_ID = 'statModal';

  // ====== CSS ======
  var style = document.createElement('style');
  style.textContent = `
    #${MODAL_ID}{width:clamp(360px,70vw,640px);max-height:clamp(420px,85vh,700px)}
    #${MODAL_ID} .stat-section{margin-bottom:clamp(.35rem,.6vw,.5rem)}
    #${MODAL_ID} .stat-section:last-child{margin-bottom:0}
    #${MODAL_ID} .stat-section-title{font-size:clamp(.55rem,.85vw,.6rem);color:var(--fg);letter-spacing:.08em;margin-bottom:clamp(.15rem,.25vw,.2rem);font-weight:500}

    /* Overview grid 2x2 */
    #${MODAL_ID} .dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(.25rem,.4vw,.35rem)}
    #${MODAL_ID} .dash-grid.four{grid-template-columns:1fr 1fr 1fr 1fr}
    #${MODAL_ID} .dash-card{background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.25rem,.4vw,.35rem)}
    #${MODAL_ID} .dash-card .num{font-family:var(--font-serif);font-size:clamp(1rem,1.8vw,1.3rem);color:var(--fg);font-weight:300;line-height:1.2}
    #${MODAL_ID} .dash-card .lbl{font-size:clamp(.4rem,.6vw,.45rem);color:var(--muted);letter-spacing:.05em;margin-top:.04rem}
    #${MODAL_ID} .dash-card .sub{font-size:clamp(.38rem,.55vw,.42rem);color:var(--fg-dim);margin-top:.06rem}
    #${MODAL_ID} .dash-card.hl{border-color:rgba(212,165,116,.2);background:rgba(212,165,116,.04)}
    #${MODAL_ID} .dash-card.hl .num{color:var(--accent)}
    #${MODAL_ID} .dash-card.g{border-color:rgba(46,204,113,.15);background:rgba(46,204,113,.03)}
    #${MODAL_ID} .dash-card.g .num{color:#2ecc71}
    #${MODAL_ID} .dash-card.b{border-color:rgba(74,124,140,.2);background:rgba(74,124,140,.04)}
    #${MODAL_ID} .dash-card.b .num{color:var(--accent-3)}
    #${MODAL_ID} .dash-card.o{border-color:rgba(212,165,116,.15);background:rgba(212,165,116,.03)}
    #${MODAL_ID} .dash-card.o .num{color:var(--accent)}

    /* Radar chart */
    #${MODAL_ID} .radar-wrap{display:flex;justify-content:center;margin:clamp(.1rem,.2vw,.15rem) 0}
    #${MODAL_ID} .radar-wrap canvas{max-width:100%;height:auto}

    /* Tabs for trend toggle */
    #${MODAL_ID} .trend-tabs{display:flex;gap:0;margin-bottom:clamp(.12rem,.2vw,.18rem)}
    #${MODAL_ID} .trend-tab{padding:clamp(.1rem,.18vw,.14rem) clamp(.35rem,.55vw,.45rem);border:1px solid var(--line);background:transparent;color:var(--muted);font-size:clamp(.4rem,.6vw,.45rem);cursor:pointer;font-family:var(--font-sans);transition:all .15s}
    #${MODAL_ID} .trend-tab:first-child{border-radius:4px 0 0 4px}
    #${MODAL_ID} .trend-tab:last-child{border-radius:0 4px 4px 0}
    #${MODAL_ID} .trend-tab+.trend-tab{border-left:none}
    #${MODAL_ID} .trend-tab.a{background:rgba(212,165,116,.12);color:var(--accent);border-color:rgba(212,165,116,.3)}

    /* Chart section */
    #${MODAL_ID} .stat-chart-wrap{background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.25rem,.45vw,.35rem);margin-top:clamp(.08rem,.15vw,.12rem)}
    #${MODAL_ID} .stat-chart{display:flex;align-items:flex-end;gap:clamp(.1rem,.18vw,.15rem);height:clamp(70px,12vw,100px);padding:0 2px}
    #${MODAL_ID} .stat-chart .col{flex:1;min-width:clamp(10px,1.8vw,18px);position:relative;border-radius:2px 2px 0 0;transition:height .4s;cursor:pointer}
    #${MODAL_ID} .stat-chart .col .tip{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:clamp(.32rem,.45vw,.36rem);color:var(--muted);white-space:nowrap;margin-bottom:2px;opacity:0;transition:opacity .2s;pointer-events:none}
    #${MODAL_ID} .stat-chart .col:hover .tip{opacity:1}
    #${MODAL_ID} .stat-chart-lbl{display:flex;justify-content:space-between;margin-top:clamp(.08rem,.15vw,.12rem);font-size:clamp(.32rem,.45vw,.36rem);color:var(--muted)}
    #${MODAL_ID} .stat-chart-lbl span{flex:1;text-align:center;overflow:hidden;text-overflow:ellipsis}

    /* Tag bar (kept from original) */
    #${MODAL_ID} .stat-tag-bar{display:flex;height:clamp(14px,2vw,18px);border-radius:4px;overflow:hidden;margin-top:clamp(.08rem,.15vw,.12rem)}
    #${MODAL_ID} .stat-tag-seg{position:relative;transition:flex .3s;cursor:pointer}
    #${MODAL_ID} .stat-tag-seg:hover{opacity:.8}
    #${MODAL_ID} .stat-tag-legend{display:flex;flex-wrap:wrap;gap:clamp(.06rem,.12vw,.1rem);margin-top:clamp(.12rem,.2vw,.16rem)}
    #${MODAL_ID} .stat-tag-legend .tl{display:inline-flex;align-items:center;gap:3px;font-size:clamp(.32rem,.45vw,.36rem);color:var(--muted)}

    /* Quick nav */
    #${MODAL_ID} .dash-nav{display:flex;gap:clamp(.2rem,.35vw,.3rem);justify-content:center;flex-wrap:wrap;margin-top:clamp(.2rem,.35vw,.3rem);padding-top:clamp(.25rem,.4vw,.35rem);border-top:1px solid var(--line)}
    #${MODAL_ID} .dash-nav-btn{background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:var(--rs);color:var(--fg-dim);padding:clamp(.2rem,.35vw,.28rem) clamp(.35rem,.55vw,.5rem);font-size:clamp(.42rem,.65vw,.48rem);cursor:pointer;font-family:var(--font-sans);transition:all .15s}
    #${MODAL_ID} .dash-nav-btn:hover{background:rgba(212,165,116,.08);border-color:rgba(212,165,116,.25);color:var(--accent)}
  `;
  document.head.appendChild(style);

  // ====== Modal HTML ======
  var div = document.createElement('div');
  div.innerHTML = `
    <div class="pomo-overlay" id="${OVERLAY_ID}"></div>
    <div class="pomo-modal" id="${MODAL_ID}">
      <button class="pomo-close" id="statClose">\u2715</button>
      <div class="pomo-body" id="statBody">
        <div style="font-size:1rem;margin:.05rem 0 .15rem;letter-spacing:.08em;font-weight:400">\uD83D\uDCCA \u5168\u5C40\u4EEA\u8868\u76D8</div>
        <div id="statContent"></div>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  // ====== Open / Close ======
  function openModal(){
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
    renderAll();
  }
  function closeModal(){
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }
  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('statClose').addEventListener('click', closeModal);

  var trendRange = 12; // 12 or 24 weeks

  // ====== Helper: get 项目 stats ======
  function get项目Stats(){
    var _d = window.data || {};
    var 项目s = _d._项目s || [];
    var stages = ['idea','literature','experiment','writing','submit','under-review','revise','accept','published'];
    var byStage = {};
    var accepted = 0, published = 0, inProgress = 0;
    项目s.forEach(function(p){
      var ms = p.milestones || {};
      var highest = -1;
      stages.forEach(function(s, i){
        if(ms[s]){ highest = i; }
      });
      if(highest >= 0){
        var key = stages[highest];
        byStage[key] = (byStage[key] || 0) + 1;
        if(key === 'accept') accepted++;
        if(key === 'published') published++;
        if(highest < 7) inProgress++; // before accept
      } else {
        inProgress++;
      }
    });
    // Calculate academic score for radar (0-100)
    var score = 0;
    if(项目s.length > 0){
      score = Math.round((accepted + published * 2) / Math.max(项目s.length, 1) * 50 + inProgress / Math.max(项目s.length, 1) * 20);
    }
    return { total: 项目s.length, byStage: byStage, accepted: accepted, published: published, inProgress: inProgress, score: Math.min(score, 95) };
  }

  // ====== Helper: get per-dimension task stats ======
  function getDimStats(){
    var _d = window.data || {};
    var dims = {
      academic: { ids: [], label: '\u5B66\u672F', tag: 'r' },
      exam:     { ids: [], label: '\u8003\u516C', tag: 'g' },
      finance:  { ids: [], label: '\u8D22\u52A1', tag: 'y' },
    };
    // Collect category IDs per dimension
    Object.keys(_d).forEach(function(cid){
      if(cid.startsWith('_')) return;
      if(cid.indexOf('academic') >= 0) dims.academic.ids.push(cid);
      else if(cid.indexOf('exam') >= 0) dims.exam.ids.push(cid);
      else if(cid.indexOf('finance') >= 0) dims.finance.ids.push(cid);
    });
    var result = {};
    Object.keys(dims).forEach(function(dk){
      var d = dims[dk];
      var total = 0, done = 0;
      d.ids.forEach(function(cid){
        var weeks = _d[cid];
        if(!Array.isArray(weeks)) return;
        weeks.forEach(function(w){
          if(!w || !w.d) return;
          w.d.forEach(function(t){
            total++;
            if(t && t.done) done++;
          });
        });
      });
      result[dk] = { total: total, done: done, rate: total ? Math.round(done/total*100) : 0 };
    });
    return result;
  }

  // ====== Render: Overview cards ======
  function renderOverview(){
    var agg = window.aggregateTasks ? window.aggregateTasks() : null;
    if(!agg) return '';
    var ps = get项目Stats();
    var dim = getDimStats();
    var rate = agg.total ? Math.round(agg.done/agg.total*100) : 0;
    var pomoH = Math.round(agg.pomoHours * 10) / 10;

    var html = '<div class="dash-grid four">';
    // Task
    html += '<div class="dash-card hl"><div class="num">' + agg.done + '/' + agg.total + '</div><div class="lbl">\u4EFB\u52A1 \u00B7 ' + rate + '%</div></div>';
    // Academic
    var acadRate = dim.academic.total ? dim.academic.rate + '%' : '\u2014';
    html += '<div class="dash-card g"><div class="num">' + ps.total + '</div><div class="lbl">\u8BBA\u6587 \u00B7 ' + ps.accepted + '\u63A5\u6536/' + ps.published + '\u53D1\u8868</div><div class="sub">\u5B66\u672F\u4EFB\u52A1 ' + acadRate + '</div></div>';
    // Exam
    var examRate = dim.exam.total ? dim.exam.rate + '%' : '\u2014';
    html += '<div class="dash-card b"><div class="num">' + (dim.exam.total || 0) + '</div><div class="lbl">\u8003\u516C \u00B7 \u5B8C\u6210\u7387 ' + examRate + '</div></div>';
    // Finance
    var finRate = dim.finance.total ? dim.finance.rate + '%' : '\u2014';
    html += '<div class="dash-card o"><div class="num">' + (dim.finance.total || 0) + '</div><div class="lbl">\u8D22\u52A1 \u00B7 \u5B8C\u6210\u7387 ' + finRate + '</div></div>';
    html += '</div>';

    // Row 2: 项目 pipeline mini
    html += '<div class="stat-section" style="margin-top:clamp(.15rem,.25vw,.2rem)"><div class="stat-section-title">\u8BBA\u6587 Pipeline</div><div class="dash-grid">';
    var stages = [
      { key: 'idea', label: '\u60F3\u6CD5', icon: '\uD83D\uDCA1' },
      { key: 'experiment', label: '\u5B9E\u9A8C', icon: '\uD83D\uDD2C' },
      { key: 'writing', label: '\u5199\u4F5C', icon: '\u270D\uFE0F' },
      { key: 'submit', label: '\u5DF2\u6295', icon: '\uD83D\uDCE4' },
      { key: 'under-review', label: '\u5BA1\u7A3F', icon: '\uD83D\uDC41\uFE0F' },
      { key: 'accept', label: '\u63A5\u6536', icon: '\u2705' },
    ];
    stages.forEach(function(s){
      var n = ps.byStage[s.key] || 0;
      html += '<div class="dash-card" style="text-align:center;padding:clamp(.15rem,.25vw,.2rem)"><div class="num" style="font-size:clamp(.8rem,1.4vw,1rem)">' + s.icon + ' ' + n + '</div><div class="lbl">' + s.label + '</div></div>';
    });
    html += '</div></div>';

    return html;
  }

  // ====== Render: Radar chart (Canvas) ======
  function renderRadar(){
    var ps = get项目Stats();
    var dim = getDimStats();
    var agg = window.aggregateTasks ? window.aggregateTasks() : null;

    // Compute 5 dimension values (0-100)
    var acadTaskRate = dim.academic.total ? dim.academic.rate : 0;
    var acad项目Score = ps.score || 0;
    var academic = Math.min(95, Math.round(acadTaskRate * 0.4 + acad项目Score * 0.6));

    var exam = dim.exam.total ? Math.min(95, dim.exam.rate) : 10;

    var finance = dim.finance.total ? Math.min(95, dim.finance.rate) : 10;

    // Health proxy from pomo consistency
    var health = 30;
    if(agg && agg.pomoHours > 0){
      health = Math.min(85, Math.round(agg.pomoHours / 40 * 70 + 15));
    }

    // Social: no direct data, estimate low
    var social = 20;

    var dims = [
      { label: '\u5B66\u672F', val: academic },
      { label: '\u8003\u516C', val: exam },
      { label: '\u8D22\u52A1', val: finance },
      { label: '\u5065\u5EB7', val: health },
      { label: '\u793E\u4EA4', val: social },
    ];

    var container = document.getElementById('radarContainer');
    if(!container) return;
    container.innerHTML = '';

    var size = Math.min(container.clientWidth || 240, 260);
    var cx = size / 2, cy = size / 2, r = size / 2 - 20;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    container.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var n = dims.length;
    var angleStep = Math.PI * 2 / n;

    // Draw grid (rings at 20, 40, 60, 80, 100)
    for(var ring = 1; ring <= 5; ring++){
      var pr = r * ring / 5;
      ctx.beginPath();
      for(var i = 0; i <= n; i++){
        var a = -Math.PI / 2 + i * angleStep;
        var x = cx + pr * Math.cos(a);
        var y = cy + pr * Math.sin(a);
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for(var i = 0; i < n; i++){
      var a = -Math.PI / 2 + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.strokeStyle = 'rgba(255,255,255,.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data polygon
    ctx.beginPath();
    for(var i = 0; i <= n; i++){
      var di = i % n;
      var a = -Math.PI / 2 + di * angleStep;
      var val = dims[di].val / 100 * r;
      var x = cx + val * Math.cos(a);
      var y = cy + val * Math.sin(a);
      if(i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(212,165,116,.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,165,116,.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for(var i = 0; i < n; i++){
      var a = -Math.PI / 2 + i * angleStep;
      var val = dims[i].val / 100 * r;
      var x = cx + val * Math.cos(a);
      var y = cy + val * Math.sin(a);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,165,116,.9)';
      ctx.fill();
    }

    // Draw labels
    ctx.font = Math.round(size / 22) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for(var i = 0; i < n; i++){
      var a = -Math.PI / 2 + i * angleStep;
      var lx = cx + (r + 14) * Math.cos(a);
      var ly = cy + (r + 14) * Math.sin(a);
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.fillText(dims[i].label, lx, ly);
      // Value next to label
      ctx.font = Math.round(size / 28) + 'px sans-serif';
      ctx.fillStyle = 'rgba(212,165,116,.6)';
      ctx.fillText(dims[i].val + '', lx, ly + (size / 22) + 2);
      ctx.font = Math.round(size / 22) + 'px sans-serif';
    }
  }

  // ====== Render: Enhanced trend charts ======
  var _trendTimer = null;

  function renderTrends(agg){
    var weeks = agg.weeks.slice(-trendRange);
    var maxRate = 1;
    weeks.forEach(function(w){ if(w.total > 0){ var r = Math.round(w.done/w.total*100); if(r > maxRate) maxRate = r; } });

    var html = '';

    // Trend toggle tabs
    html += '<div class="trend-tabs">';
    html += '<button class="trend-tab' + (trendRange === 12 ? ' a' : '') + '" data-r="12">12\u5468</button>';
    html += '<button class="trend-tab' + (trendRange === 24 ? ' a' : '') + '" data-r="24">24\u5468</button>';
    html += '</div>';

    // Completion rate trend
    html += '<div class="stat-section-title">\u6BCF\u5468\u5B8C\u6210\u7387</div>';
    html += '<div class="stat-chart-wrap"><div class="stat-chart">';
    weeks.forEach(function(w){
      var r = w.total ? Math.round(w.done / w.total * 100) : 0;
      var h = Math.max(3, r / Math.max(maxRate, 1) * 95);
      var color = r >= 70 ? 'rgba(212,165,116,.7)' : r >= 40 ? 'rgba(212,165,116,.4)' : 'rgba(212,165,116,.2)';
      html += '<div class="col" style="height:' + h + '%;background:' + color + '"><span class="tip">' + r + '%</span></div>';
    });
    html += '</div><div class="stat-chart-lbl">';
    weeks.forEach(function(w){ html += '<span>' + (w.name || '').replace('\u5468','W') + '</span>'; });
    html += '</div></div>';

    // Tag distribution
    var hasTags = false;
    TAG_KEYS.forEach(function(k){ if(k && agg.byTag[k] > 0) hasTags = true; });
    if(hasTags){
      var totalTagged = 0;
      TAG_KEYS.forEach(function(k){ if(k) totalTagged += agg.byTag[k] || 0; });
      html += '<div class="stat-section-title" style="margin-top:clamp(.12rem,.2vw,.16rem)">\u4EFB\u52A1\u6807\u7B7E\u5206\u5E03</div>';
      html += '<div class="stat-chart-wrap"><div class="stat-tag-bar">';
      TAG_KEYS.forEach(function(k){
        if(!k || !agg.byTag[k]) return;
        var pct = agg.byTag[k] / totalTagged;
        html += '<div class="stat-tag-seg" style="flex:' + pct + ';background:' + TAG_COLORS[k].bg + '" title="' + TAG_COLORS[k].label + ': ' + agg.byTag[k] + '"></div>';
      });
      html += '</div><div class="stat-tag-legend">';
      TAG_KEYS.forEach(function(k){
        if(!k || !agg.byTag[k]) return;
        html += '<span class="tl" style="display:inline-flex;align-items:center;gap:3px"><span style="width:clamp(4px,.5vw,6px);height:clamp(4px,.5vw,6px);border-radius:50%;background:' + TAG_COLORS[k].bg + ';flex-shrink:0"></span>' + TAG_COLORS[k].label + ' ' + agg.byTag[k] + '</span>';
      });
      html += '</div></div>';
    }

    return html;
  }

  // ====== Render: Quick nav buttons ======
  function renderNav(){
    var btns = [
      { id: 'academicBtn', icon: '\uD83C\uDF93', label: '\u5B66\u672F' },
      { id: 'calendarBtn', icon: '\uD83D\uDCC5', label: '\u65E5\u5386' },
      { id: 'financeBtn', icon: '\uD83D\uDCB0', label: '\u8D22\u52A1' },
      { id: 'pomoBtn', icon: '\uD83C\uDF45', label: '\u756A\u8304\u949F' },
    ];
    var html = '<div class="dash-nav">';
    btns.forEach(function(b){
      html += '<button class="dash-nav-btn" data-nav="' + b.id + '">' + b.icon + ' ' + b.label + '</button>';
    });
    html += '</div>';
    return html;
  }

  // ====== Main render ======
  function renderAll(){
    var agg = window.aggregateTasks ? window.aggregateTasks() : null;
    if(!agg){
      document.getElementById('statContent').innerHTML = '<div style="text-align:center;padding:2rem 1rem;color:var(--muted)">\u6CA1\u6709\u6570\u636E</div>';
      return;
    }

    var html = '';
    html += renderOverview();
    html += '<div class="stat-section"><div class="stat-section-title">\u4E94\u7EF4\u5EA6\u8BC4\u4F30</div><div class="radar-wrap"><div id="radarContainer"></div></div></div>';
    html += '<div class="stat-section" id="trendSection">' + renderTrends(agg) + '</div>';
    html += renderNav();

    document.getElementById('statContent').innerHTML = html;

    // Render radar after DOM is ready
    setTimeout(renderRadar, 50);

    // Wire trend tabs
    document.querySelectorAll('.trend-tab').forEach(function(tab){
      tab.addEventListener('click', function(){
        trendRange = parseInt(this.dataset.r);
        document.querySelectorAll('.trend-tab').forEach(function(t){ t.classList.remove('a'); });
        this.classList.add('a');
        var agg2 = window.aggregateTasks ? window.aggregateTasks() : null;
        if(agg2){
          document.getElementById('trendSection').innerHTML = renderTrends(agg2);
          // Re-wire tabs
          document.querySelectorAll('.trend-tab').forEach(function(t){
            t.addEventListener('click', function(){
              trendRange = parseInt(this.dataset.r);
              document.querySelectorAll('.trend-tab').forEach(function(tt){ tt.classList.remove('a'); });
              this.classList.add('a');
              var agg3 = window.aggregateTasks ? window.aggregateTasks() : null;
              if(agg3) document.getElementById('trendSection').innerHTML = renderTrends(agg3);
            });
          });
        }
      });
    });

    // Wire nav buttons
    document.querySelectorAll('.dash-nav-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var targetId = this.dataset.nav;
        closeModal();
        // Try clicking the target button if it exists
        var target = document.getElementById(targetId);
        if(target) setTimeout(function(){ target.click(); }, 200);
      });
    });
  }

  // ====== Init ======
  var btn = document.getElementById('statBtn');
  if(btn) btn.addEventListener('click', openModal);

  console.log('feature-stats: loaded (dashboard)');
})();
