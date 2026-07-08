// ===== FEATURE: Monthly Statistics Dashboard =====
(function(){
  if(window.__features['stats']) return;
  window.__features['stats'] = true;

  var OVERLAY_ID = 'statOverlay';
  var MODAL_ID = 'statModal';

  var style = document.createElement('style');
  style.textContent = `
    #${MODAL_ID}{width:clamp(340px,60vw,520px);max-height:clamp(400px,80vh,620px)}
    #${MODAL_ID} .stat-section{margin-bottom:clamp(.4rem,.8vw,.6rem)}
    #${MODAL_ID} .stat-section:last-child{margin-bottom:0}
    #${MODAL_ID} .stat-section-title{font-size:clamp(.6rem,.9vw,.65rem);color:var(--fg);letter-spacing:.08em;margin-bottom:clamp(.2rem,.4vw,.3rem);font-weight:500}
    #${MODAL_ID} .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(.25rem,.4vw,.35rem)}
    #${MODAL_ID} .stat-grid.three{grid-template-columns:1fr 1fr 1fr}
    #${MODAL_ID} .stat-card{background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.3rem,.5vw,.4rem);text-align:center}
    #${MODAL_ID} .stat-card.hl{border-color:rgba(212,165,116,.2);background:rgba(212,165,116,.04)}
    #${MODAL_ID} .stat-card .num{font-family:var(--font-serif);font-size:clamp(1.1rem,2vw,1.4rem);color:var(--fg);font-weight:300;line-height:1.2}
    #${MODAL_ID} .stat-card .lbl{font-size:clamp(.42rem,.65vw,.48rem);color:var(--muted);letter-spacing:.08em;margin-top:.04rem}
    #${MODAL_ID} .stat-card.hl .num{color:var(--accent)}
    #${MODAL_ID} .stat-chart-wrap{background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.3rem,.6vw,.5rem);margin-top:clamp(.15rem,.3vw,.2rem)}
    #${MODAL_ID} .stat-chart{display:flex;align-items:flex-end;gap:clamp(.12rem,.2vw,.18rem);height:clamp(80px,14vw,110px);padding:0 2px}
    #${MODAL_ID} .stat-chart .col{flex:1;min-width:clamp(12px,2vw,20px);position:relative;border-radius:2px 2px 0 0;transition:height .4s;cursor:pointer}
    #${MODAL_ID} .stat-chart .col .tip{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);font-size:clamp(.35rem,.5vw,.4rem);color:var(--muted);white-space:nowrap;margin-bottom:2px;opacity:0;transition:opacity .2s}
    #${MODAL_ID} .stat-chart .col:hover .tip{opacity:1}
    #${MODAL_ID} .stat-chart-lbl{display:flex;justify-content:space-between;margin-top:clamp(.1rem,.2vw,.15rem);font-size:clamp(.35rem,.5vw,.4rem);color:var(--muted)}
    #${MODAL_ID} .stat-chart-lbl span{flex:1;text-align:center}
    #${MODAL_ID} .stat-tag-bar{display:flex;height:clamp(16px,2.5vw,22px);border-radius:4px;overflow:hidden;margin-top:clamp(.1rem,.2vw,.15rem)}
    #${MODAL_ID} .stat-tag-seg{position:relative;transition:flex .3s}
    #${MODAL_ID} .stat-tag-seg:hover{opacity:.8}
    #${MODAL_ID} .stat-tag-seg .t-tip{display:none}
    #${MODAL_ID} .stat-tag-seg:hover .t-tip{display:block}
    #${MODAL_ID} .stat-tag-legend{display:flex;flex-wrap:wrap;gap:clamp(.08rem,.15vw,.12rem);margin-top:clamp(.15rem,.3vw,.2rem)}
    #${MODAL_ID} .stat-tag-legend .tl{display:inline-flex;align-items:center;gap:3px;font-size:clamp(.35rem,.5vw,.4rem);color:var(--muted)}
    #${MODAL_ID} .stat-tag-legend .tl-dot{width:clamp(5px,.6vw,7px);height:clamp(5px,.6vw,7px);border-radius:50%;flex-shrink:0}
  `;
  document.head.appendChild(style);

  var div = document.createElement('div');
  div.innerHTML = `
    <div class="pomo-overlay" id="${OVERLAY_ID}"></div>
    <div class="pomo-modal" id="${MODAL_ID}">
      <button class="pomo-close" id="statClose">✕</button>
      <div class="pomo-body" id="statBody">
        <div style="font-size:1.1rem;margin:.1rem 0 .2rem;letter-spacing:.1em;font-weight:400">📊 数据统计</div>
        <div id="statContent"></div>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  function openModal(){
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
    renderStats();
  }
  function closeModal(){
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('statClose').addEventListener('click', closeModal);

  function getWeekLabel(cid, wi){
    var parts = cid.split('-');
    var y = parts[0] || '';
    var label = y.replace('y', 'Y').replace('1','1').replace('2','2').replace('3','3').replace('4','4').replace('5','5');
    return label + 'W' + (wi + 1);
  }

  function renderStats(){
    var agg = window.aggregateTasks ? aggregateTasks() : null;
    if(!agg) return;

    var total = agg.total, done = agg.done;
    var rate = total ? Math.round(done / total * 100) : 0;
    var pomoHours = agg.pomoHours || 0;
    var pomoRounded = Math.round(pomoHours * 10) / 10;

    var html = '';

    // Summary cards
    html += '<div class="stat-section"><div class="stat-grid three">';
    html += '<div class="stat-card hl"><div class="num">' + total + '</div><div class="lbl">总任务</div></div>';
    html += '<div class="stat-card hl"><div class="num">' + done + '</div><div class="lbl">已完成</div></div>';
    html += '<div class="stat-card hl"><div class="num">' + rate + '%</div><div class="lbl">完成率</div></div>';
    html += '<div class="stat-card"><div class="num">' + pomoRounded + '</div><div class="lbl">番茄钟(h)</div></div>';
    html += '<div class="stat-card"><div class="num">' + (agg.weeks.length || 0) + '</div><div class="lbl">周数</div></div>';
    html += '</div></div>';

    // Completion trend
    var recent = agg.weeks.slice(-12);
    var maxRate = 1;
    recent.forEach(function(w){ if(w.total > 0){ var r = Math.round(w.done/w.total*100); if(r > maxRate) maxRate = r; } });
    html += '<div class="stat-section"><div class="stat-section-title">每周完成率趋势</div>';
    html += '<div class="stat-chart-wrap"><div class="stat-chart">';
    recent.forEach(function(w){
      var r = w.total ? Math.round(w.done / w.total * 100) : 0;
      var h = Math.max(3, r / Math.max(maxRate, 1) * 95);
      var color = r >= 70 ? 'rgba(212,165,116,.7)' : r >= 40 ? 'rgba(212,165,116,.4)' : 'rgba(212,165,116,.2)';
      html += '<div class="col" style="height:' + h + '%;background:' + color + '"><span class="tip">' + r + '%</span></div>';
    });
    html += '</div><div class="stat-chart-lbl">';
    recent.forEach(function(w){ html += '<span>' + w.name.replace('周','W') + '</span>'; });
    html += '</div></div></div>';

    // Tag distribution
    var hasTags = false;
    TAG_KEYS.forEach(function(k){ if(k && agg.byTag[k] > 0) hasTags = true; });
    if(hasTags){
      var totalTagged = 0;
      TAG_KEYS.forEach(function(k){ if(k) totalTagged += agg.byTag[k] || 0; });
      html += '<div class="stat-section"><div class="stat-section-title">标签分布</div>';
      html += '<div class="stat-chart-wrap"><div class="stat-tag-bar">';
      TAG_KEYS.forEach(function(k){
        if(!k || !agg.byTag[k]) return;
        var pct = agg.byTag[k] / totalTagged;
        html += '<div class="stat-tag-seg" style="flex:' + pct + ';background:' + TAG_COLORS[k].bg + '" title="' + TAG_COLORS[k].label + ': ' + agg.byTag[k] + '"></div>';
      });
      html += '</div><div class="stat-tag-legend">';
      TAG_KEYS.forEach(function(k){
        if(!k || !agg.byTag[k]) return;
        html += '<span class="tl"><span class="tl-dot" style="background:' + TAG_COLORS[k].bg + '"></span>' + TAG_COLORS[k].label + ' ' + agg.byTag[k] + '</span>';
      });
      html += '</div></div></div>';
    }

    // Pomo by week
    var _d = window.data || {};
    if(_d._pomoLog && _d._pomoLog.length > 0){
      var pomoByWeek = {};
      _d._pomoLog.forEach(function(r){
        var d = r.date || '';
        pomoByWeek[d] = (pomoByWeek[d] || 0) + (r.duration || 25);
      });
      var dates = Object.keys(pomoByWeek).sort().slice(-12);
      var maxPomo = 1;
      dates.forEach(function(d){ if(pomoByWeek[d] > maxPomo) maxPomo = pomoByWeek[d]; });
      html += '<div class="stat-section"><div class="stat-section-title">番茄钟时长趋势</div>';
      html += '<div class="stat-chart-wrap"><div class="stat-chart">';
      dates.forEach(function(d){
        var mins = pomoByWeek[d];
        var h = Math.max(3, mins / maxPomo * 95);
        html += '<div class="col" style="height:' + h + '%;background:rgba(232,93,47,.5)"><span class="tip">' + Math.round(mins) + 'min</span></div>';
      });
      html += '</div><div class="stat-chart-lbl">';
      dates.forEach(function(d){ html += '<span>' + d.slice(5) + '</span>'; });
      html += '</div></div></div>';
    }

    document.getElementById('statContent').innerHTML = html;
  }

  // Wire statBtn in bottom bar
  var btn = document.getElementById('statBtn');
  if(btn) btn.addEventListener('click', openModal);

  console.log('feature-stats: loaded');
})();
