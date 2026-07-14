// ===== FEATURE: Career Timeline (职业/求职) =====
(function(){
  if(window.__features['career-timeline']) return;
  window.__features['career-timeline'] = true;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .ct-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .ct-overlay.s{display:block}
    .ct-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(92vw,680px);max-height:85vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .ct-modal.s{display:flex}
    .ct-header{display:flex;align-items:center;justify-content:space-between;padding:clamp(.5rem,.8vw,.7rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line)}
    .ct-header h3{font-family:var(--font-serif);font-size:clamp(.75rem,1.2vw,.95rem);font-weight:600;color:var(--fg)}
    .ct-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem}
    .ct-close:hover{color:var(--accent)}
    .ct-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .ct-toolbar{display:flex;gap:.4rem;margin-bottom:.6rem;flex-wrap:wrap;align-items:center}
    .ct-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .ct-add-btn:hover{background:rgba(212,165,116,.2)}
    .ct-filter{display:flex;gap:.2rem;margin-left:auto}
    .ct-filter-btn{background:transparent;border:1px solid var(--line);color:var(--muted);padding:clamp(.15rem,.25vw,.2rem) clamp(.25rem,.4vw,.35rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.4rem,.65vw,.5rem);transition:all .2s}
    .ct-filter-btn.s{background:rgba(212,165,116,.12);border-color:var(--accent);color:var(--accent)}
    .ct-filter-btn:hover{border-color:var(--accent);color:var(--accent)}

    .ct-timeline{position:relative;padding-left:clamp(1.2rem,2.2vw,1.8rem)}
    .ct-timeline::before{content:'';position:absolute;left:clamp(.4rem,.65vw,.5rem);top:0;bottom:0;width:2px;background:var(--line);border-radius:1px}

    .ct-item{position:relative;margin-bottom:clamp(.4rem,.65vw,.55rem);background:var(--card);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.3rem,.5vw,.45rem) clamp(.35rem,.55vw,.5rem);transition:all .2s}
    .ct-item:hover{border-color:var(--accent-2)}
    .ct-item::before{content:'';position:absolute;left:clamp(-.85rem,-1.4vw,-1.1rem);top:clamp(.45rem,.7vw,.55rem);width:clamp(.35rem,.55vw,.4rem);height:clamp(.35rem,.55vw,.4rem);border-radius:50%;background:var(--accent);border:2px solid var(--bg2)}
    .ct-item.type-职业::before{background:#4a9eff}
    .ct-item.type-求职::before{background:#f0a030}
    .ct-item.type-其他::before{background:var(--accent-2)}

    .ct-item-header{display:flex;align-items:center;justify-content:space-between;gap:.3rem;margin-bottom:.15rem}
    .ct-item-title{flex:1;font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.65rem);font-weight:600;color:var(--fg);background:none;border:none;outline:none;padding:0;width:100%}
    .ct-item-title:focus{color:var(--accent)}
    .ct-item-date{font-size:clamp(.4rem,.65vw,.48rem);color:var(--muted);white-space:nowrap;font-family:var(--font-mono,'Courier New')}
    .ct-item-badge{font-size:clamp(.35rem,.55vw,.42rem);padding:.02rem .25rem;border-radius:3px;font-family:var(--font-sans);font-weight:500;margin-right:.2rem}
    .ct-item-badge.职业{background:rgba(74,158,255,.12);color:#4a9eff}
    .ct-item-badge.求职{background:rgba(240,160,48,.12);color:#f0a030}
    .ct-item-badge.其他{background:rgba(212,165,116,.12);color:var(--accent)}
    .ct-item-actions{display:flex;gap:.15rem;flex-shrink:0}
    .ct-item-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .12rem;font-family:var(--font-sans)}
    .ct-item-actions button:hover{color:var(--accent-2)}
    .ct-item-desc{font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.5rem);color:var(--fg-dim);background:none;border:1px solid transparent;outline:none;padding:.05rem 0;width:100%;resize:vertical;min-height:1.2em;line-height:1.5;transition:border-color .2s}
    .ct-item-desc:focus{border-color:var(--accent);background:var(--bg3);border-radius:4px;padding:.05rem .12rem}

    .ct-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .ct-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}
  `;
  document.head.appendChild(style);

  // ===== Data helpers =====
  function getData(){
    var d = window.data || {};
    if(!d._career) d._career = [];
    return d._career;
  }
  function save(){ window.save(); }
  function genId(){ return 'ct' + Date.now() + Math.random().toString(36).slice(2,6); }
  function todayStr(){ return new Date().toISOString().slice(0, 10); }

  // ===== State =====
  var currentFilter = 'all';

  // ===== Render =====
  function renderItem(entry, idx){
    var div = document.createElement('div');
    div.className = 'ct-item type-' + (entry.type || '其他');
    div.dataset.idx = idx;

    var header = document.createElement('div');
    header.className = 'ct-item-header';

    var badge = document.createElement('span');
    badge.className = 'ct-item-badge ' + (entry.type || '其他');
    badge.textContent = entry.type || '其他';
    header.appendChild(badge);

    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'ct-item-title';
    titleInput.placeholder = '事项名称（如：XX省职业报名）';
    titleInput.value = entry.title || '';
    titleInput.addEventListener('input', function(){ getData()[idx].title = titleInput.value; save(); });
    header.appendChild(titleInput);

    var dateSpan = document.createElement('span');
    dateSpan.className = 'ct-item-date';
    dateSpan.textContent = entry.date || '';
    header.appendChild(dateSpan);

    var actions = document.createElement('div');
    actions.className = 'ct-item-actions';
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.title = '删除';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除？')) return;
      getData().splice(idx, 1); save(); renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    div.appendChild(header);

    // Date + Type row
    var meta = document.createElement('div');
    meta.style.cssText = 'display:flex;gap:.3rem;margin-bottom:.15rem;align-items:center;flex-wrap:wrap';

    var dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'ct-item-date';
    dateInput.style.cssText = 'font-size:clamp(.4rem,.65vw,.48rem);background:var(--bg3);border:1px solid var(--line);border-radius:3px;padding:.05rem .1rem;color:var(--fg);max-width:140px';
    dateInput.value = entry.date || todayStr();
    dateInput.addEventListener('change', function(){
      getData()[idx].date = dateInput.value;
      dateSpan.textContent = dateInput.value;
      save();
    });
    meta.appendChild(dateInput);

    var typeSelect = document.createElement('select');
    typeSelect.style.cssText = 'font-size:clamp(.4rem,.65vw,.48rem);background:var(--bg3);border:1px solid var(--line);border-radius:3px;padding:.05rem .1rem;color:var(--fg);font-family:var(--font-sans)';
    ['职业','求职','其他'].forEach(function(t){
      var opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      if(t === (entry.type || '其他')) opt.selected = true;
      typeSelect.appendChild(opt);
    });
    typeSelect.addEventListener('change', function(){
      getData()[idx].type = typeSelect.value;
      badge.textContent = typeSelect.value;
      badge.className = 'ct-item-badge ' + typeSelect.value;
      div.className = 'ct-item type-' + typeSelect.value;
      save();
      // Re-apply filter
      renderAll();
    });
    meta.appendChild(typeSelect);

    var statusSelect = document.createElement('select');
    statusSelect.style.cssText = 'font-size:clamp(.4rem,.65vw,.48rem);background:var(--bg3);border:1px solid var(--line);border-radius:3px;padding:.05rem .1rem;color:var(--fg);font-family:var(--font-sans)';
    ['待办','进行中','已完成','延期'].forEach(function(s){
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      if(s === (entry.status || '待办')) opt.selected = true;
      statusSelect.appendChild(opt);
    });
    statusSelect.addEventListener('change', function(){
      getData()[idx].status = statusSelect.value;
      save();
    });
    meta.appendChild(statusSelect);

    div.appendChild(meta);

    // Description
    var descInput = document.createElement('textarea');
    descInput.className = 'ct-item-desc';
    descInput.rows = 2;
    descInput.placeholder = '备注、链接、时间节点...';
    descInput.value = entry.desc || '';
    descInput.addEventListener('input', function(){ getData()[idx].desc = descInput.value; save(); });
    div.appendChild(descInput);

    return div;
  }

  function renderAll(){
    var timeline = document.getElementById('ctTimeline');
    if(!timeline) return;
    var data = getData();
    timeline.innerHTML = '';
    // Filter
    var filtered = data;
    if(currentFilter !== 'all'){
      filtered = data.filter(function(e){ return (e.type || '其他') === currentFilter; });
    }
    // Sort by date descending
    filtered.sort(function(a,b){ return (b.date||'') > (a.date||'') ? 1 : (b.date||'') < (a.date||'') ? -1 : 0; });

    if(filtered.length === 0){
      timeline.innerHTML = '<div class="ct-empty"><div class="ct-empty-icon">📋</div>' + (currentFilter === 'all' ? '还没有事项，点击「添加事项」开始' : '该分类暂无事项') + '</div>';
      return;
    }
    // Render in order, but we need the actual index in the source array for edit to work
    // Map sorted items back to their indices
    var sortedIndices = filtered.map(function(f){
      for(var i=0; i<data.length; i++){
        if(data[i] === f) return i;
      }
      return -1;
    });
    sortedIndices.forEach(function(idx){
      if(idx >= 0) timeline.appendChild(renderItem(data[idx], idx));
    });
  }

  function addEntry(){
    var data = getData();
    data.push({
      id: genId(), date: todayStr(), title: '',
      type: '职业', status: '待办', desc: ''
    });
    save();
    renderAll();
    // Scroll to bottom (newest)
    var timeline = document.getElementById('ctTimeline');
    if(timeline) timeline.scrollTop = timeline.scrollHeight;
  }

  function collectVisibleEntries(){
    document.querySelectorAll('#ctTimeline .ct-item').forEach(function(itemEl){
      var idx = parseInt(itemEl.dataset.idx, 10);
      var item = getData()[idx];
      if(!item) return;
      var title = itemEl.querySelector('.ct-item-title');
      var date = itemEl.querySelector('input[type="date"]');
      var selects = itemEl.querySelectorAll('select');
      var desc = itemEl.querySelector('.ct-item-desc');
      if(title) item.title = title.value;
      if(date) item.date = date.value;
      if(selects[0]) item.type = selects[0].value;
      if(selects[1]) item.status = selects[1].value;
      if(desc) item.desc = desc.value;
    });
  }

  // ===== Modal =====
  function show(){ 
    document.getElementById('ctOverlay').classList.add('s');
    document.getElementById('ctModal').classList.add('s');
    renderAll();
  }
  function hide(){
    collectVisibleEntries();
    save();
    document.getElementById('ctOverlay').classList.remove('s');
    document.getElementById('ctModal').classList.remove('s');
  }
  function toggle(){
    var m = document.getElementById('ctModal');
    if(m.classList.contains('s')) hide(); else show();
  }

  // ===== Init =====
  function init(){
    document.getElementById('careerBtn').addEventListener('click', toggle);
    document.getElementById('ctClose').addEventListener('click', hide);
    document.getElementById('ctOverlay').addEventListener('click', hide);
    document.getElementById('ctSaveBtn').addEventListener('click', function(){
      collectVisibleEntries();
      if(typeof window.save === 'function') window.save();
    }, true);
    document.getElementById('ctSaveBtn').addEventListener('click', function(){
      if(typeof window.save === 'function') {
        try { window.save(); showToast('💾 求职数据已保存'); }
        catch(e) { showToast('⚠️ 保存失败: ' + (e.message||e)); }
      } else { showToast('⚠️ 保存失败: save 函数不可用'); }
    });
    document.getElementById('ctAddBtn').addEventListener('click', addEntry);
    // Filter buttons
    document.querySelectorAll('.ct-filter-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        document.querySelectorAll('.ct-filter-btn').forEach(function(b){ b.classList.remove('s'); });
        btn.classList.add('s');
        currentFilter = btn.dataset.filter;
        renderAll();
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('feature-career-timeline: loaded');
})();
