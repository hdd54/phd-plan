// ===== FEATURE: Experiment Log =====
// Daily/weekly experiment journal for lab work tracking

(function(){
  if(window.__features['exp-log']) return;
  window.__features['exp-log'] = true;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .el-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .el-overlay.s{display:block}
    .el-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(92vw,680px);max-height:85vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .el-modal.s{display:flex}
    .el-header{display:flex;align-items:center;justify-content:space-between;padding:clamp(.5rem,.8vw,.7rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line)}
    .el-header h3{font-family:var(--font-serif);font-size:clamp(.75rem,1.2vw,.95rem);font-weight:600;color:var(--fg)}
    .el-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem}
    .el-close:hover{color:var(--accent)}
    .el-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .el-toolbar{display:flex;gap:.4rem;margin-bottom:.6rem}
    .el-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .el-add-btn:hover{background:rgba(212,165,116,.2)}

    .el-entry{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);margin-bottom:.5rem;padding:clamp(.35rem,.55vw,.5rem)}
    .el-entry-header{display:flex;align-items:center;justify-content:space-between;gap:.3rem;margin-bottom:.25rem}
    .el-entry-title{flex:1;font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.65rem);font-weight:600;color:var(--fg);background:none;border:none;outline:none;padding:0;width:100%}
    .el-entry-title:focus{color:var(--accent)}
    .el-entry-date{font-size:clamp(.4rem,.65vw,.5rem);color:var(--muted);white-space:nowrap;font-family:var(--font-sans)}
    .el-entry-actions{display:flex;gap:.15rem;flex-shrink:0}
    .el-entry-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .12rem;font-family:var(--font-sans)}
    .el-entry-actions button:hover{color:var(--accent-2)}
    .el-entry-section{margin-bottom:.2rem}
    .el-section-label{font-size:clamp(.4rem,.6vw,.48rem);color:var(--muted);font-family:var(--font-sans);display:block;margin-bottom:.05rem;font-weight:500;letter-spacing:.03em}
    .el-section-input{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.1rem,.18vw,.15rem) clamp(.15rem,.25vw,.2rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.52rem);outline:none;width:100%;resize:vertical;min-height:clamp(28px,3vw,36px);line-height:1.5}
    .el-section-input:focus{border-color:var(--accent)}
    .el-section-input.short{min-height:auto;resize:none}

    .el-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .el-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}
  `;
  document.head.appendChild(style);

  // ===== Data helpers =====
  function getLog(){
    var d = window.data || {};
    if(!d._expLog) d._expLog = [];
    return d._expLog;
  }

  function saveLog(){
    window.save();
  }

  function genId(){
    return 'el' + Date.now() + Math.random().toString(36).slice(2,6);
  }

  function todayStr(){
    return new Date().toISOString().slice(0, 10);
  }

  // ===== Render a single entry =====
  function renderEntry(entry, idx){
    var div = document.createElement('div');
    div.className = 'el-entry';
    div.dataset.idx = idx;

    // Header: title + date + actions
    var header = document.createElement('div');
    header.className = 'el-entry-header';

    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'el-entry-title';
    titleInput.placeholder = '实验标题/编号';
    titleInput.value = entry.title || '';
    titleInput.addEventListener('input', function(){
      getLog()[idx].title = titleInput.value;
      saveLog();
    });
    header.appendChild(titleInput);

    var dateSpan = document.createElement('span');
    dateSpan.className = 'el-entry-date';
    dateSpan.textContent = entry.date || '';
    header.appendChild(dateSpan);

    var actions = document.createElement('div');
    actions.className = 'el-entry-actions';
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.title = '删除';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除此实验记录？')) return;
      getLog().splice(idx, 1);
      saveLog();
      renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    div.appendChild(header);

    // Date picker
    var dateSection = document.createElement('div');
    dateSection.className = 'el-entry-section';
    var dateLabel = document.createElement('span');
    dateLabel.className = 'el-section-label';
    dateLabel.textContent = '日期';
    dateSection.appendChild(dateLabel);
    var dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'el-section-input short';
    dateInput.value = entry.date || todayStr();
    dateInput.style.maxWidth = '160px';
    dateInput.addEventListener('change', function(){
      getLog()[idx].date = dateInput.value;
      saveLog();
      // Update date display in header
      dateSpan.textContent = dateInput.value;
    });
    dateSection.appendChild(dateInput);
    div.appendChild(dateSection);

    // Purpose
    var purposeSection = document.createElement('div');
    purposeSection.className = 'el-entry-section';
    var purposeLabel = document.createElement('span');
    purposeLabel.className = 'el-section-label';
    purposeLabel.textContent = '目的';
    purposeSection.appendChild(purposeLabel);
    var purposeInput = document.createElement('textarea');
    purposeInput.className = 'el-section-input short';
    purposeInput.rows = 1;
    purposeInput.placeholder = '实验目的...';
    purposeInput.value = entry.purpose || '';
    purposeInput.addEventListener('input', function(){
      getLog()[idx].purpose = purposeInput.value;
      saveLog();
    });
    purposeSection.appendChild(purposeInput);
    div.appendChild(purposeSection);

    // Method / Steps
    var methodSection = document.createElement('div');
    methodSection.className = 'el-entry-section';
    var methodLabel = document.createElement('span');
    methodLabel.className = 'el-section-label';
    methodLabel.textContent = '方法/步骤';
    methodSection.appendChild(methodLabel);
    var methodInput = document.createElement('textarea');
    methodInput.className = 'el-section-input';
    methodInput.rows = 2;
    methodInput.placeholder = '实验方法、关键步骤、参数...';
    methodInput.value = entry.method || '';
    methodInput.addEventListener('input', function(){
      getLog()[idx].method = methodInput.value;
      saveLog();
    });
    methodSection.appendChild(methodInput);
    div.appendChild(methodSection);

    // Results
    var resultsSection = document.createElement('div');
    resultsSection.className = 'el-entry-section';
    var resultsLabel = document.createElement('span');
    resultsLabel.className = 'el-section-label';
    resultsLabel.textContent = '结果';
    resultsSection.appendChild(resultsLabel);
    var resultsInput = document.createElement('textarea');
    resultsInput.className = 'el-section-input';
    resultsInput.rows = 2;
    resultsInput.placeholder = '实验结果、数据、观察...';
    resultsInput.value = entry.results || '';
    resultsInput.addEventListener('input', function(){
      getLog()[idx].results = resultsInput.value;
      saveLog();
    });
    resultsSection.appendChild(resultsInput);
    div.appendChild(resultsSection);

    // Notes
    var notesSection = document.createElement('div');
    notesSection.className = 'el-entry-section';
    var notesLabel = document.createElement('span');
    notesLabel.className = 'el-section-label';
    notesLabel.textContent = '备注/后续';
    notesSection.appendChild(notesLabel);
    var notesInput = document.createElement('textarea');
    notesInput.className = 'el-section-input short';
    notesInput.rows = 1;
    notesInput.placeholder = '备注、待办、后续计划...';
    notesInput.value = entry.notes || '';
    notesInput.addEventListener('input', function(){
      getLog()[idx].notes = notesInput.value;
      saveLog();
    });
    notesSection.appendChild(notesInput);
    div.appendChild(notesSection);

    return div;
  }

  // ===== Add new entry =====
  function addEntry(){
    var log = getLog();
    log.unshift({
      id: genId(),
      date: todayStr(),
      title: '',
      purpose: '',
      method: '',
      results: '',
      notes: ''
    });
    saveLog();
    renderAll();
    setTimeout(function(){
      var inputs = document.querySelectorAll('.el-entry-title');
      if(inputs.length > 0) inputs[0].focus();
    }, 100);
  }

  // ===== Render all entries =====
  function renderAll(){
    var list = document.getElementById('elList');
    if(!list) return;
    var log = getLog();
    // Sort by date descending then by order of addition
    var sorted = log.slice().sort(function(a, b){
      return (b.date || '') > (a.date || '') ? 1 : (b.date || '') < (a.date || '') ? -1 : 0;
    });
    // Reorder `log` to match sorted, so indices stay consistent
    // Actually, let's just render from the log array directly (index-based)
    list.innerHTML = '';
    if(log.length === 0){
      list.innerHTML = '<div class="el-empty"><div class="el-empty-icon">🔬</div>还没有实验记录，点击「添加实验记录」开始记录</div>';
      return;
    }
    log.forEach(function(entry, idx){
      list.appendChild(renderEntry(entry, idx));
    });
  }

  // ===== Modal toggle =====
  function showModal(){
    var overlay = document.getElementById('elOverlay');
    var modal = document.getElementById('elModal');
    if(!overlay || !modal) return;
    overlay.classList.add('s');
    modal.classList.add('s');
    renderAll();
  }

  function hideModal(){
    var overlay = document.getElementById('elOverlay');
    var modal = document.getElementById('elModal');
    if(!overlay || !modal) return;
    overlay.classList.remove('s');
    modal.classList.remove('s');
  }

  function toggleModal(){
    var modal = document.getElementById('elModal');
    if(!modal) return;
    if(modal.classList.contains('s')) hideModal();
    else showModal();
  }

  // ===== Init =====
  function init(){
    var btn = document.getElementById('expLogBtn');
    if(btn) btn.addEventListener('click', toggleModal);

    var close = document.getElementById('elClose');
    if(close) close.addEventListener('click', hideModal);
    var overlay = document.getElementById('elOverlay');
    if(overlay) overlay.addEventListener('click', hideModal);
    var addBtn = document.getElementById('elAddBtn');
    if(addBtn) addBtn.addEventListener('click', addEntry);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('feature-exp-log: loaded');
})();
