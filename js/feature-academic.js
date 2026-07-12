// ===== FEATURE: Academic Progress (学术进展) =====
// Merged tabbed modal: Experiment Log + Paper Milestones + Literature Notes
(function(){
  if(window.__features['academic']) return;
  window.__features['academic'] = true;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    /* ---- Academic Modal ---- */
    .ac-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .ac-overlay.s{display:block}
    .ac-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,820px);max-height:90vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .ac-modal.s{display:flex}
    .ac-header{display:flex;align-items:center;justify-content:space-between;padding:clamp(.5rem,.8vw,.7rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line);flex-shrink:0}
    .ac-header h3{font-family:var(--font-serif);font-size:clamp(.75rem,1.2vw,.95rem);font-weight:600;color:var(--fg)}
    .ac-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem;line-height:1}
    .ac-close:hover{color:var(--accent)}
    .ac-tabs{display:flex;gap:0;border-bottom:1px solid var(--line);flex-shrink:0;background:var(--bg)}
    .ac-tab{padding:clamp(.35rem,.6vw,.45rem) clamp(.6rem,1.1vw,.8rem);border:none;background:transparent;color:var(--muted);font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.62rem);cursor:pointer;transition:all .2s;border-bottom:2px solid transparent;letter-spacing:.03em}
    .ac-tab:hover{color:var(--fg-dim)}
    .ac-tab.a{color:var(--accent);border-bottom-color:var(--accent);background:color-mix(in srgb,var(--accent) 6%,transparent)}
    .ac-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .ac-panel{display:none}
    .ac-panel.a{display:block}

    /* ---- Experiment Log (reused from feature-exp-log.js with .ac- prefix) ---- */
    .ac-el-toolbar{display:flex;gap:.4rem;margin-bottom:.6rem}
    .ac-el-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .ac-el-add-btn:hover{background:rgba(212,165,116,.2)}
    .ac-el-entry{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);margin-bottom:.5rem;padding:clamp(.35rem,.55vw,.5rem)}
    .ac-el-entry-header{display:flex;align-items:center;justify-content:space-between;gap:.3rem;margin-bottom:.25rem}
    .ac-el-entry-title{flex:1;font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.65rem);font-weight:600;color:var(--fg);background:none;border:none;outline:none;padding:0;width:100%}
    .ac-el-entry-title:focus{color:var(--accent)}
    .ac-el-entry-date{font-size:clamp(.4rem,.65vw,.5rem);color:var(--muted);white-space:nowrap;font-family:var(--font-sans)}
    .ac-el-entry-actions{display:flex;gap:.15rem;flex-shrink:0}
    .ac-el-entry-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .12rem;font-family:var(--font-sans)}
    .ac-el-entry-actions button:hover{color:var(--accent-2)}
    .ac-el-entry-section{margin-bottom:.2rem}
    .ac-el-section-label{font-size:clamp(.4rem,.6vw,.48rem);color:var(--muted);font-family:var(--font-sans);display:block;margin-bottom:.05rem;font-weight:500;letter-spacing:.03em}
    .ac-el-section-input{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.1rem,.18vw,.15rem) clamp(.15rem,.25vw,.2rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.52rem);outline:none;width:100%;resize:vertical;min-height:clamp(28px,3vw,36px);line-height:1.5}
    .ac-el-section-input:focus{border-color:var(--accent)}
    .ac-el-section-input.short{min-height:auto;resize:none}
    .ac-el-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .ac-el-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}

    /* ---- Paper Milestones (reused from feature-paper-milestones.js) ---- */
    .ac-pm-toolbar{display:flex;gap:.4rem;margin-bottom:.6rem}
    .ac-pm-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .ac-pm-add-btn:hover{background:rgba(212,165,116,.2)}
    .ac-pm-card{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);margin-bottom:.5rem;padding:clamp(.4rem,.6vw,.6rem);position:relative}
    .ac-pm-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.3rem;margin-bottom:.3rem}
    .ac-pm-card-title{flex:1;font-family:var(--font-sans);font-size:clamp(.6rem,.95vw,.7rem);font-weight:600;color:var(--fg);background:none;border:none;width:100%;outline:none;resize:none;padding:0;line-height:1.4}
    .ac-pm-card-title:focus{color:var(--accent)}
    .ac-pm-card-actions{display:flex;gap:.15rem;flex-shrink:0}
    .ac-pm-card-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .12rem;font-family:var(--font-sans)}
    .ac-pm-card-actions button:hover{color:var(--accent-2)}
    .ac-pm-card-meta{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.35rem}
    .ac-pm-meta-input{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.08rem,.15vw,.12rem) clamp(.15rem,.25vw,.2rem);color:var(--fg-dim);font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.5rem);outline:none;flex:1;min-width:80px}
    .ac-pm-meta-input:focus{border-color:var(--accent);color:var(--fg)}
    .ac-pm-timeline{display:flex;flex-wrap:wrap;gap:clamp(.15rem,.25vw,.25rem);margin-top:.25rem}
    .ac-pm-stage{display:flex;align-items:center;gap:clamp(.12rem,.18vw,.18rem);padding:clamp(.08rem,.15vw,.12rem) clamp(.2rem,.3vw,.25rem);border-radius:999px;border:1px solid var(--line-2);background:transparent;cursor:pointer;transition:all .2s;font-size:clamp(.4rem,.65vw,.5rem);color:var(--muted);font-family:var(--font-sans);white-space:nowrap}
    .ac-pm-stage:hover{border-color:var(--accent-3);color:var(--fg-dim)}
    .ac-pm-stage.done{border-color:var(--accent-3);background:rgba(74,124,140,.12);color:var(--accent-3)}
    .ac-pm-stage.active{border-color:var(--accent);background:rgba(212,165,116,.12);color:var(--accent);font-weight:600}
    .ac-pm-stage .pm-st-icon{font-size:clamp(.45rem,.7vw,.55rem)}
    .ac-pm-stage .pm-st-date{font-size:clamp(.35rem,.55vw,.4rem);color:var(--muted);margin-left:.05rem}
    .ac-pm-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .ac-pm-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}

    /* ---- Literature Notes (reused from feature-literature.js) ---- */
    .ac-lit-toolbar{display:flex;gap:.3rem;margin-bottom:.5rem;flex-wrap:wrap;align-items:center}
    .ac-lit-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .ac-lit-add-btn:hover{background:rgba(212,165,116,.2)}
    .ac-lit-card{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);margin-bottom:.45rem;padding:clamp(.35rem,.55vw,.5rem)}
    .ac-lit-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.3rem;margin-bottom:.2rem}
    .ac-lit-card-title{flex:1;font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.65rem);font-weight:600;color:var(--fg);background:none;border:none;outline:none;padding:0;width:100%;line-height:1.4;resize:none}
    .ac-lit-card-title:focus{color:var(--accent)}
    .ac-lit-card-actions{display:flex;gap:.1rem;flex-shrink:0}
    .ac-lit-card-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .1rem;font-family:var(--font-sans)}
    .ac-lit-card-actions button:hover{color:var(--accent-2)}
    .ac-lit-meta{display:flex;gap:clamp(.15rem,.25vw,.2rem);flex-wrap:wrap;margin-bottom:.2rem}
    .ac-lit-meta-field{display:flex;align-items:center;gap:.1rem}
    .ac-lit-meta-field label{font-size:clamp(.35rem,.55vw,.4rem);color:var(--muted);white-space:nowrap;font-family:var(--font-sans)}
    .ac-lit-meta-field input,.ac-lit-meta-field select{background:var(--bg3);border:1px solid var(--line);border-radius:3px;padding:clamp(.06rem,.12vw,.1rem) clamp(.1rem,.18vw,.14rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.4rem,.6vw,.45rem);outline:none;max-width:clamp(80px,12vw,120px)}
    .ac-lit-meta-field input:focus,.ac-lit-meta-field select:focus{border-color:var(--accent)}
    .ac-lit-meta-field.long input{max-width:clamp(120px,18vw,200px)}
    .ac-lit-body-section{margin-bottom:.12rem}
    .ac-lit-body-label{font-size:clamp(.35rem,.55vw,.4rem);color:var(--muted);font-family:var(--font-sans);display:block;letter-spacing:.02em}
    .ac-lit-body-input{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.1rem,.18vw,.14rem) clamp(.14rem,.22vw,.18rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.42rem,.65vw,.48rem);outline:none;width:100%}
    .ac-lit-body-input:focus{border-color:var(--accent)}
    .ac-lit-body-input.ta{resize:vertical;min-height:clamp(28px,3vw,36px);line-height:1.5}
    .ac-lit-keywords{display:flex;flex-wrap:wrap;gap:.15rem;margin-top:.08rem}
    .ac-lit-keyword{background:rgba(212,165,116,.1);border:1px solid rgba(212,165,116,.2);border-radius:3px;padding:.02rem .25rem;font-size:clamp(.38rem,.6vw,.42rem);color:var(--accent);font-family:var(--font-sans);display:inline-flex;align-items:center;gap:.1rem}
    .ac-lit-keyword .del{cursor:pointer;color:var(--muted);font-size:.9em}
    .ac-lit-keyword .del:hover{color:var(--accent-2)}
    .ac-lit-keyword-input{background:transparent;border:1px dashed var(--line);border-radius:3px;color:var(--muted);font-size:clamp(.38rem,.6vw,.42rem);padding:.02rem .2rem;font-family:var(--font-sans);outline:none;max-width:100px}
    .ac-lit-keyword-input:focus{border-color:var(--accent);color:var(--fg)}
    .ac-lit-rating{display:flex;gap:.05rem;align-items:center}
    .ac-lit-star{cursor:pointer;font-size:clamp(.55rem,.85vw,.6rem);color:var(--line-2);transition:color .15s}
    .ac-lit-star.s{color:#f0a030}
    .ac-lit-star:hover{color:#f0a030}
    .ac-lit-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .ac-lit-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}

    /* ---- Page Navigation ---- */
    .ac-pg-nav{display:flex;align-items:center;justify-content:space-between;gap:.3rem;margin-bottom:.5rem;flex-wrap:wrap}
    .ac-pg-nav .pg-info{font-size:clamp(.45rem,.7vw,.5rem);color:var(--muted);font-family:var(--font-sans)}
    .ac-pg-nav .pg-btn{background:rgba(212,165,116,.1);border:1px solid var(--line-2);border-radius:6px;color:var(--fg-dim);padding:clamp(.15rem,.25vw,.2rem) clamp(.3rem,.5vw,.4rem);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.5rem);transition:all .2s}
    .ac-pg-nav .pg-btn:hover{border-color:var(--accent);color:var(--accent)}
    .ac-pg-nav .pg-btn:disabled{opacity:.3;cursor:default;border-color:var(--line-2);color:var(--muted)}

    /* ---- Paper Progress Timeline ---- */
    .ac-pt-entry{background:var(--bg3);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.3rem,.5vw,.4rem);margin-bottom:.35rem}
    .ac-pt-header{display:flex;align-items:center;gap:.25rem;margin-bottom:.2rem}
    .ac-pt-date{font-size:clamp(.4rem,.65vw,.48rem);color:var(--accent);font-family:var(--font-mono,'Courier New');font-weight:600}
    .ac-pt-add-item{background:none;border:1px dashed var(--line-2);border-radius:4px;color:var(--muted);font-size:clamp(.38rem,.6vw,.42rem);padding:.05rem .2rem;cursor:pointer;font-family:var(--font-sans);transition:all .2s;margin-left:auto}
    .ac-pt-add-item:hover{border-color:var(--accent);color:var(--accent)}
    .ac-pt-item{display:flex;gap:.2rem;margin-bottom:.12rem;align-items:flex-start}
    .ac-pt-item::before{content:'▹';color:var(--accent);font-size:clamp(.45rem,.7vw,.5rem);flex-shrink:0;margin-top:.02rem}
    .ac-pt-item-text{flex:1;font-size:clamp(.42rem,.65vw,.48rem);color:var(--fg-dim);background:none;border:none;outline:none;padding:0;resize:none;width:100%;line-height:1.5;min-height:1.2em;font-family:var(--font-sans)}
    .ac-pt-item-text:focus{color:var(--fg)}
    .ac-pt-add-block{display:flex;gap:.15rem;margin-top:.15rem}
    .ac-pt-add-block input{flex:1;background:var(--bg);border:1px solid var(--line-2);border-radius:4px;padding:clamp(.08rem,.15vw,.12rem) clamp(.12rem,.2vw,.16rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.4rem,.65vw,.48rem);outline:none}
    .ac-pt-add-block input:focus{border-color:var(--accent)}
    .ac-pt-add-block button{background:rgba(212,165,116,.12);border:1px solid var(--accent);border-radius:4px;color:var(--accent);padding:clamp(.06rem,.12vw,.1rem) clamp(.18rem,.3vw,.25rem);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.4rem,.65vw,.48rem);white-space:nowrap}
    .ac-pt-del-item{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.4rem,.6vw,.45rem);padding:0 .08rem;font-family:var(--font-sans);flex-shrink:0}
    .ac-pt-del-item:hover{color:var(--accent-2)}
    .ac-pt-add-entry{background:rgba(212,165,116,.08);border:1px dashed var(--accent-3);border-radius:var(--rs);color:var(--accent-3);padding:clamp(.2rem,.3vw,.25rem);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.42rem,.65vw,.48rem);text-align:center;transition:all .2s;margin-bottom:.35rem}
    .ac-pt-add-entry:hover{background:rgba(212,165,116,.15)}

    /* ---- Search bar ---- */
    .ac-sr-bar{display:flex;gap:.25rem;margin-bottom:.5rem;flex-wrap:wrap;align-items:center}
    .ac-sr-input{flex:1;min-width:140px;background:var(--bg3);border:1px solid var(--line);border-radius:6px;padding:clamp(.15rem,.25vw,.2rem) clamp(.2rem,.35vw,.3rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.5rem);outline:none}
    .ac-sr-input:focus{border-color:var(--accent)}
    .ac-sr-input::placeholder{color:var(--muted)}
    .ac-sr-clear{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.5rem,.8vw,.55rem);padding:0 .1rem;font-family:var(--font-sans)}
    .ac-sr-clear:hover{color:var(--accent)}
  `;
  document.head.appendChild(style);

  // ===== Tab state =====
  var activeTab = 'exp';

  // ===== Pagination state =====
  var expPageSize = 1;
  var expCurrentPage = 0;
  var expSearchQuery = '';
  var paperPageSize = 1;
  var paperCurrentPage = 0;
  var paperSearchQuery = '';
  var litPageSize = 1;
  var litCurrentPage = 0;

  // ===== Data helpers =====
  function getLog(){
    var d = window.data || {};
    if(!d._expLog) d._expLog = [];
    return d._expLog;
  }
  function getPapers(){
    var d = window.data || {};
    if(!d._papers) d._papers = [];
    return d._papers;
  }
  function getLitData(){
    var d = window.data || {};
    if(!d._literature) d._literature = [];
    return d._literature;
  }
  function save(){ window.save(); }
  function genId(pref){ return (pref||'a') + Date.now() + Math.random().toString(36).slice(2,6); }
  function todayStr(){ return new Date().toISOString().slice(0, 10); }

  // ====== Experiment Log Tab ======
  var PM_STAGES = [
    { key: 'idea',       label: '选题/想法',     icon: '💡' },
    { key: 'literature', label: '文献调研',     icon: '📚' },
    { key: 'experiment', label: '实验/设计',   icon: '🔬' },
    { key: 'writing',    label: '论文写作',     icon: '✍️' },
    { key: 'submit',     label: '已投稿',       icon: '📤' },
    { key: 'under-review', label: '审稿中',     icon: '👁️' },
    { key: 'revise',     label: '修改中',       icon: '🔧' },
    { key: 'accept',     label: '已接收',       icon: '✅' },
    { key: 'published',  label: '已发表',       icon: '🎉' }
  ];

  function renderExpEntry(entry, idx){
    var div = document.createElement('div');
    div.className = 'ac-el-entry';
    div.dataset.idx = idx;
    var header = document.createElement('div');
    header.className = 'ac-el-entry-header';
    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'ac-el-entry-title';
    titleInput.placeholder = '实验标题/编号';
    titleInput.value = entry.title || '';
    titleInput.addEventListener('input', function(){ getLog()[idx].title = titleInput.value; save(); });
    header.appendChild(titleInput);
    var dateSpan = document.createElement('span');
    dateSpan.className = 'ac-el-entry-date';
    dateSpan.textContent = entry.date || '';
    header.appendChild(dateSpan);
    var actions = document.createElement('div');
    actions.className = 'ac-el-entry-actions';
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.title = '删除';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除此实验记录？')) return;
      getLog().splice(idx, 1); save(); renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    div.appendChild(header);

    var dateSection = document.createElement('div');
    dateSection.className = 'ac-el-entry-section';
    var dateLabel = document.createElement('span');
    dateLabel.className = 'ac-el-section-label';
    dateLabel.textContent = '日期';
    dateSection.appendChild(dateLabel);
    var dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'ac-el-section-input short';
    dateInput.value = entry.date || todayStr();
    dateInput.style.maxWidth = '160px';
    dateInput.addEventListener('change', function(){
      getLog()[idx].date = dateInput.value; save();
      dateSpan.textContent = dateInput.value;
    });
    dateSection.appendChild(dateInput);
    div.appendChild(dateSection);

    // Purpose
    var purposeSection = document.createElement('div');
    purposeSection.className = 'ac-el-entry-section';
    var purposeLabel = document.createElement('span');
    purposeLabel.className = 'ac-el-section-label';
    purposeLabel.textContent = '目的';
    purposeSection.appendChild(purposeLabel);
    var purposeInput = document.createElement('textarea');
    purposeInput.className = 'ac-el-section-input short';
    purposeInput.rows = 1;
    purposeInput.placeholder = '实验目的...';
    purposeInput.value = entry.purpose || '';
    purposeInput.addEventListener('input', function(){ getLog()[idx].purpose = purposeInput.value; save(); });
    purposeSection.appendChild(purposeInput);
    div.appendChild(purposeSection);

    // Method
    var methodSection = document.createElement('div');
    methodSection.className = 'ac-el-entry-section';
    var methodLabel = document.createElement('span');
    methodLabel.className = 'ac-el-section-label';
    methodLabel.textContent = '方法/步骤';
    methodSection.appendChild(methodLabel);
    var methodInput = document.createElement('textarea');
    methodInput.className = 'ac-el-section-input';
    methodInput.rows = 2;
    methodInput.placeholder = '实验方法、关键步骤、参数...';
    methodInput.value = entry.method || '';
    methodInput.addEventListener('input', function(){ getLog()[idx].method = methodInput.value; save(); });
    methodSection.appendChild(methodInput);
    div.appendChild(methodSection);

    // Results
    var resultsSection = document.createElement('div');
    resultsSection.className = 'ac-el-entry-section';
    var resultsLabel = document.createElement('span');
    resultsLabel.className = 'ac-el-section-label';
    resultsLabel.textContent = '结果';
    resultsSection.appendChild(resultsLabel);
    var resultsInput = document.createElement('textarea');
    resultsInput.className = 'ac-el-section-input';
    resultsInput.rows = 2;
    resultsInput.placeholder = '实验结果、数据、观察...';
    resultsInput.value = entry.results || '';
    resultsInput.addEventListener('input', function(){ getLog()[idx].results = resultsInput.value; save(); });
    resultsSection.appendChild(resultsInput);
    div.appendChild(resultsSection);

    // Notes
    var notesSection = document.createElement('div');
    notesSection.className = 'ac-el-entry-section';
    var notesLabel = document.createElement('span');
    notesLabel.className = 'ac-el-section-label';
    notesLabel.textContent = '备注/后续';
    notesSection.appendChild(notesLabel);
    var notesInput = document.createElement('textarea');
    notesInput.className = 'ac-el-section-input short';
    notesInput.rows = 1;
    notesInput.placeholder = '备注、待办、后续计划...';
    notesInput.value = entry.notes || '';
    notesInput.addEventListener('input', function(){ getLog()[idx].notes = notesInput.value; save(); });
    notesSection.appendChild(notesInput);
    div.appendChild(notesSection);
    return div;
  }

  function addExpEntry(){
    var log = getLog();
    log.unshift({ id: genId('el'), date: todayStr(), title: '', purpose: '', method: '', results: '', notes: '' });
    save();
    renderAll();
    setTimeout(function(){
      var inputs = document.querySelectorAll('.ac-el-entry-title');
      if(inputs.length > 0) inputs[0].focus();
    }, 100);
  }

  function renderExpPanel(){
    var list = document.getElementById('acElList');
    if(!list) return;
    var log = getLog();
    list.innerHTML = '';

    // Search bar
    var srBar = document.createElement('div');
    srBar.className = 'ac-sr-bar';
    var srInput = document.createElement('input');
    srInput.className = 'ac-sr-input';
    srInput.type = 'text';
    srInput.placeholder = '搜索实验标题、目的...';
    srInput.value = expSearchQuery;
    srInput.addEventListener('input', function(){
      expSearchQuery = this.value; expCurrentPage = 0; renderExpPanel();
    });
    srBar.appendChild(srInput);
    var clrBtn = document.createElement('button');
    clrBtn.className = 'ac-sr-clear';
    clrBtn.textContent = '✕';
    clrBtn.addEventListener('click', function(){ expSearchQuery = ''; expCurrentPage = 0; renderExpPanel(); });
    srBar.appendChild(clrBtn);
    list.appendChild(srBar);

    // Filter
    var filtered = log;
    if(expSearchQuery.trim()){
      var q = expSearchQuery.toLowerCase();
      filtered = log.filter(function(e){
        return (e.title || '').toLowerCase().indexOf(q) >= 0 || (e.purpose || '').toLowerCase().indexOf(q) >= 0 || (e.method || '').toLowerCase().indexOf(q) >= 0;
      });
    }
    if(filtered.length === 0){
      list.innerHTML += '<div class="ac-el-empty"><div class="ac-el-empty-icon">🔬</div>' +
        (expSearchQuery ? '没有匹配的实验记录' : '还没有实验记录，点击「添加实验记录」开始记录') + '</div>';
      return;
    }
    // Paginate
    var totalPages = Math.max(1, Math.ceil(filtered.length / expPageSize));
    if(expCurrentPage >= totalPages) expCurrentPage = totalPages - 1;
    if(expCurrentPage < 0) expCurrentPage = 0;
    var start = expCurrentPage * expPageSize;
    var pageEntry = filtered[start];
    // Find actual index
    var actualIdx = -1;
    for(var i=0; i<log.length; i++){ if(log[i] === pageEntry){ actualIdx = i; break; } }
    if(actualIdx >= 0) list.appendChild(renderExpEntry(log[actualIdx], actualIdx));
    // Pagination nav
    var pgNav = document.createElement('div');
    pgNav.className = 'ac-pg-nav';
    var prevBtn = document.createElement('button');
    prevBtn.className = 'pg-btn';
    prevBtn.textContent = '‹ Prev';
    prevBtn.disabled = expCurrentPage <= 0;
    prevBtn.addEventListener('click', function(){ expCurrentPage--; renderExpPanel(); });
    pgNav.appendChild(prevBtn);
    var pgInfo = document.createElement('span');
    pgInfo.className = 'pg-info';
    pgInfo.textContent = (expCurrentPage + 1) + ' / ' + totalPages + ' 页 (' + filtered.length + ' 条)';
    pgNav.appendChild(pgInfo);
    var nextBtn = document.createElement('button');
    nextBtn.className = 'pg-btn';
    nextBtn.textContent = 'Next ›';
    nextBtn.disabled = expCurrentPage >= totalPages - 1;
    nextBtn.addEventListener('click', function(){ expCurrentPage++; renderExpPanel(); });
    pgNav.appendChild(nextBtn);
    list.appendChild(pgNav);
  }

  // ====== Paper Milestones Tab ======
  function renderPaperCard(paper, idx){
    var card = document.createElement('div');
    card.className = 'ac-pm-card';
    card.dataset.idx = idx;
    var header = document.createElement('div');
    header.className = 'ac-pm-card-header';
    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'ac-pm-card-title';
    titleInput.placeholder = '输入论文标题...';
    titleInput.value = paper.title || '';
    titleInput.addEventListener('input', function(){ getPapers()[idx].title = titleInput.value; save(); });
    header.appendChild(titleInput);
    var actions = document.createElement('div');
    actions.className = 'ac-pm-card-actions';
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.title = '删除此论文';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除「' + (paper.title || '未命名论文') + '」？')) return;
      getPapers().splice(idx, 1); save(); renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    card.appendChild(header);
    // Meta
    var meta = document.createElement('div');
    meta.className = 'ac-pm-card-meta';
    var journalInput = document.createElement('input');
    journalInput.type = 'text';
    journalInput.className = 'ac-pm-meta-input';
    journalInput.placeholder = '期刊/会议名称';
    journalInput.value = paper.journal || '';
    journalInput.addEventListener('input', function(){ getPapers()[idx].journal = journalInput.value; save(); });
    meta.appendChild(journalInput);
    card.appendChild(meta);
    // Timeline
    var timeline = document.createElement('div');
    timeline.className = 'ac-pm-timeline';
    var milestones = paper.milestones || {};
    var activeIdx = -1;
    for(var i = PM_STAGES.length - 1; i >= 0; i--){
      if(milestones[PM_STAGES[i].key]){ activeIdx = i; break; }
    }
    PM_STAGES.forEach(function(stage, si){
      var stageEl = document.createElement('div');
      stageEl.className = 'ac-pm-stage';
      var isDone = !!milestones[stage.key];
      if(isDone) stageEl.classList.add('done');
      if(si === activeIdx && isDone) stageEl.classList.add('active');
      stageEl.innerHTML = '<span class="pm-st-icon">' + stage.icon + '</span>' + stage.label;
      if(isDone && milestones[stage.key]){
        var dateSpan = document.createElement('span');
        dateSpan.className = 'pm-st-date';
        dateSpan.textContent = milestones[stage.key];
        stageEl.appendChild(dateSpan);
      }
      stageEl.addEventListener('click', function(e){
        e.stopPropagation();
        toggleMilestone(idx, stage.key);
      });
      timeline.appendChild(stageEl);
    });
    card.appendChild(timeline);
    // Progress timeline entries
    card.appendChild(renderPaperProgress(paper, idx));
    return card;
  }

  function toggleMilestone(idx, stageKey){
    var papers = getPapers();
    if(!papers[idx]) return;
    var paper = papers[idx];
    if(!paper.milestones) paper.milestones = {};
    if(paper.milestones[stageKey]){
      var keys = PM_STAGES.map(function(s){ return s.key; });
      var startIdx = keys.indexOf(stageKey);
      if(startIdx >= 0){
        for(var i = startIdx; i < keys.length; i++){ delete paper.milestones[keys[i]]; }
      }
    } else {
      paper.milestones[stageKey] = todayStr();
    }
    save();
    renderAll();
  }

  function addPaper(){
    var papers = getPapers();
    papers.push({ id: genId('p'), title: '', journal: '', milestones: {}, progress: [] });
    save(); renderAll();
    paperCurrentPage = Math.floor((papers.length - 1) / paperPageSize);
    renderAll();
    setTimeout(function(){
      var inputs = document.querySelectorAll('.ac-pm-card-title');
      if(inputs.length > 0) inputs[inputs.length - 1].focus();
    }, 100);
  }

  // ===== Paper Progress Timeline =====
  function renderPaperProgress(paper, idx){
    var container = document.createElement('div');
    container.style.marginTop = '.4rem';
    // Existing entries
    var entries = Array.isArray(paper.progress) ? paper.progress : [];
    if(entries.length === 0){
      var emptyHint = document.createElement('div');
      emptyHint.style.cssText = 'font-size:clamp(.4rem,.65vw,.48rem);color:var(--muted);text-align:center;padding:.3rem;font-family:var(--font-sans)';
      emptyHint.textContent = '暂无进展记录，点击下方按钮添加';
      container.appendChild(emptyHint);
    } else {
      entries.forEach(function(entry, ei){
        var eDiv = document.createElement('div');
        eDiv.className = 'ac-pt-entry';
        var eHeader = document.createElement('div');
        eHeader.className = 'ac-pt-header';
        var dateSpan = document.createElement('span');
        dateSpan.className = 'ac-pt-date';
        dateSpan.textContent = entry.date || '';
        eHeader.appendChild(dateSpan);
        var delEntryBtn = document.createElement('button');
        delEntryBtn.className = 'ac-pt-del-item';
        delEntryBtn.textContent = '🗑';
        delEntryBtn.title = '删除此进展';
        delEntryBtn.addEventListener('click', function(){
          if(!confirm('确认删除此进展记录？')) return;
          getPapers()[idx].progress.splice(ei, 1); save(); renderAll();
        });
        eHeader.appendChild(delEntryBtn);
        eDiv.appendChild(eHeader);
        // Items
        var items = Array.isArray(entry.items) ? entry.items : [];
        items.forEach(function(item, ii){
          var iDiv = document.createElement('div');
          iDiv.className = 'ac-pt-item';
          var iText = document.createElement('textarea');
          iText.className = 'ac-pt-item-text';
          iText.rows = 1;
          iText.value = item;
          iText.addEventListener('input', function(){
            getPapers()[idx].progress[ei].items[ii] = iText.value; save();
          });
          iDiv.appendChild(iText);
          var iDel = document.createElement('button');
          iDel.className = 'ac-pt-del-item';
          iDel.textContent = '×';
          iDel.addEventListener('click', function(){
            getPapers()[idx].progress[ei].items.splice(ii, 1); save(); renderAll();
          });
          iDiv.appendChild(iDel);
          eDiv.appendChild(iDiv);
        });
        // Add item to this entry
        var addItemBtn = document.createElement('button');
        addItemBtn.className = 'ac-pt-add-item';
        addItemBtn.textContent = '+ 添加描述';
        addItemBtn.addEventListener('click', function(){
          var p = getPapers()[idx].progress;
          if(!Array.isArray(p[ei].items)) p[ei].items = [];
          p[ei].items.push('');
          save(); renderAll();
        });
        eDiv.appendChild(addItemBtn);
        container.appendChild(eDiv);
      });
    }
    // Add new entry
    var addEntryBtn = document.createElement('button');
    addEntryBtn.className = 'ac-pt-add-entry';
    addEntryBtn.textContent = '+ 添加进展记录';
    addEntryBtn.addEventListener('click', function(){
      var p = getPapers()[idx];
      if(!Array.isArray(p.progress)) p.progress = [];
      var today = new Date();
      var dateStr = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
      p.progress.push({ date: dateStr, items: [''] });
      save(); renderAll();
    });
    container.appendChild(addEntryBtn);
    return container;
  }

  function renderPaperPipelineHTML(papers){
    var ALL_STAGES = [
      { key: 'idea',     label: '想法', icon: '💡' },
      { key: 'litReview', label: '文献综述', icon: '📚' },
      { key: 'method',   label: '方法设计', icon: '🔧' },
      { key: 'exp',      label: '实验', icon: '🧪' },
      { key: 'writing',  label: '写作', icon: '✍️' },
      { key: 'submit',   label: '投稿', icon: '📮' },
      { key: 'revision', label: '修改中', icon: '🔄' },
      { key: 'accept',   label: '已接收', icon: '✅' },
      { key: 'publish',  label: '已发表', icon: '🎉' },
    ];
    var total = papers.length;
    var doneCount = 0;
    var stageCounts = {};
    ALL_STAGES.forEach(function(s){ stageCounts[s.key] = 0; });
    papers.forEach(function(p){
      var ms = p.milestones || {};
      // Find highest completed stage
      var cur = -1;
      ALL_STAGES.forEach(function(s, i){
        if(ms[s.key]) cur = i;
      });
      if(cur >= 0) stageCounts[ALL_STAGES[cur].key] = (stageCounts[ALL_STAGES[cur].key] || 0) + 1;
      if(ms.accept || ms.publish) doneCount++;
    });

    var maxCount = Math.max.apply(null, ALL_STAGES.map(function(s){ return stageCounts[s.key] || 0; }));
    if(maxCount === 0) maxCount = 1;

    var html = '<div class="ac-pm-stats">';
    // Summary cards
    html += '<div class="ac-pm-stats-cards" style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">';
    html += '<div class="ac-pm-stat-card" style="flex:1;min-width:60px;background:var(--bg2);border-radius:8px;padding:10px;text-align:center">'+
      '<div style="font-size:1.4rem;font-weight:700;color:var(--accent)">'+total+'</div>'+
      '<div style="font-size:.75rem;color:var(--txt3)">总数</div></div>';
    html += '<div class="ac-pm-stat-card" style="flex:1;min-width:60px;background:var(--bg2);border-radius:8px;padding:10px;text-align:center">'+
      '<div style="font-size:1.4rem;font-weight:700;color:var(--green)">'+doneCount+'</div>'+
      '<div style="font-size:.75rem;color:var(--txt3)">已接收/发表</div></div>';
    html += '<div class="ac-pm-stat-card" style="flex:1;min-width:60px;background:var(--bg2);border-radius:8px;padding:10px;text-align:center">'+
      '<div style="font-size:1.4rem;font-weight:700;color:#e67e22">'+(total-doneCount)+'</div>'+
      '<div style="font-size:.75rem;color:var(--txt3)">进行中</div></div>';
    html += '</div>';

    // Funnel: show each stage bar
    html += '<div class="ac-pm-funnel" style="margin-bottom:12px">';
    ALL_STAGES.forEach(function(s){
      var cnt = stageCounts[s.key] || 0;
      var pct = Math.round(cnt / maxCount * 100);
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">'+
        '<span style="width:28px;flex:none;text-align:center;font-size:.85rem">'+s.icon+'</span>'+
        '<span style="width:56px;flex:none;font-size:.72rem;color:var(--txt2)">'+s.label+'</span>'+
        '<div style="flex:1;height:16px;background:var(--bg1);border-radius:4px;overflow:hidden">'+
        '<div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .3s"></div></div>'+
        '<span style="width:24px;flex:none;text-align:right;font-size:.72rem;color:var(--txt2);font-weight:600">'+cnt+'</span>'+
        '</div>';
    });
    html += '</div></div>';
    return html;
  }

  var paperSortMode = 'default';
  window.togglePaperSort = function(){
    var modes = ['default', 'stage', 'title'];
    var idx = modes.indexOf(paperSortMode);
    paperSortMode = modes[(idx + 1) % modes.length];
    renderPapersPanel();
  };
  window.getPaperSortLabel = function(mode){
    return { 'default': '默认排序', 'stage': '按进度', 'title': '按标题' }[mode] || '默认排序';
  };

  function renderPapersPanel(){
    var list = document.getElementById('acPmList');
    if(!list) return;
    var papers = getPapers();
    list.innerHTML = '';

    // Search bar
    var srBar = document.createElement('div');
    srBar.className = 'ac-sr-bar';
    var srInput = document.createElement('input');
    srInput.className = 'ac-sr-input';
    srInput.type = 'text';
    srInput.placeholder = '搜索论文标题、期刊...';
    srInput.value = paperSearchQuery;
    srInput.addEventListener('input', function(){
      paperSearchQuery = this.value; paperCurrentPage = 0; renderPapersPanel();
    });
    srBar.appendChild(srInput);
    var clrBtn = document.createElement('button');
    clrBtn.className = 'ac-sr-clear';
    clrBtn.textContent = '✕';
    clrBtn.addEventListener('click', function(){ paperSearchQuery = ''; paperCurrentPage = 0; renderPapersPanel(); });
    srBar.appendChild(clrBtn);
    list.appendChild(srBar);

    // Filter
    var filtered = papers;
    if(paperSearchQuery.trim()){
      var q = paperSearchQuery.toLowerCase();
      filtered = papers.filter(function(p){
        return (p.title || '').toLowerCase().indexOf(q) >= 0 || (p.journal || '').toLowerCase().indexOf(q) >= 0;
      });
    }

    // Stats header (only on first page or when no search)
    var header = document.createElement('div');
    header.innerHTML = renderPaperPipelineHTML(filtered);
    list.appendChild(header);

    if(filtered.length === 0){
      list.innerHTML += '<div class="ac-pm-empty"><div class="ac-pm-empty-icon">📄</div>' +
        (paperSearchQuery ? '没有匹配的论文' : '还没有论文，点击上方「添加论文」开始追踪') + '</div>';
      return;
    }
    // Paginate
    var totalPages = Math.max(1, Math.ceil(filtered.length / paperPageSize));
    if(paperCurrentPage >= totalPages) paperCurrentPage = totalPages - 1;
    if(paperCurrentPage < 0) paperCurrentPage = 0;
    var start = paperCurrentPage * paperPageSize;
    var pagePaper = filtered[start];
    // Find actual index
    var actualIdx = -1;
    for(var i=0; i<papers.length; i++){ if(papers[i] === pagePaper){ actualIdx = i; break; } }
    if(actualIdx >= 0) list.appendChild(renderPaperCard(papers[actualIdx], actualIdx));

    // Pagination nav
    var pgNav = document.createElement('div');
    pgNav.className = 'ac-pg-nav';
    var prevBtn = document.createElement('button');
    prevBtn.className = 'pg-btn';
    prevBtn.textContent = '‹ Prev';
    prevBtn.disabled = paperCurrentPage <= 0;
    prevBtn.addEventListener('click', function(){ paperCurrentPage--; renderPapersPanel(); });
    pgNav.appendChild(prevBtn);
    var pgInfo = document.createElement('span');
    pgInfo.className = 'pg-info';
    pgInfo.textContent = (paperCurrentPage + 1) + ' / ' + totalPages + ' 页 (' + filtered.length + ' 篇)';
    pgNav.appendChild(pgInfo);
    var nextBtn = document.createElement('button');
    nextBtn.className = 'pg-btn';
    nextBtn.textContent = 'Next ›';
    nextBtn.disabled = paperCurrentPage >= totalPages - 1;
    nextBtn.addEventListener('click', function(){ paperCurrentPage++; renderPapersPanel(); });
    pgNav.appendChild(nextBtn);
    list.appendChild(pgNav);

    // Sort toggle (moved to bottom)
    var sortBar = document.createElement('div');
    sortBar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-top:8px';
    sortBar.innerHTML = '<span style="font-size:.75rem;color:var(--txt3)">共 ' + papers.length + ' 篇论文</span>'+
      '<button class="bb" onclick="togglePaperSort()" style="font-size:.72rem;padding:3px 10px">排序: ' + getPaperSortLabel(paperSortMode) + '</button>';
    list.appendChild(sortBar);
  }

  // ====== Literature Tab ======
  var litSearchQuery = '';

  function renderLitCard(entry, idx){
    var card = document.createElement('div');
    card.className = 'ac-lit-card';
    card.dataset.idx = idx;
    var header = document.createElement('div');
    header.className = 'ac-lit-card-header';
    var titleBox = document.createElement('textarea');
    titleBox.className = 'ac-lit-card-title';
    titleBox.rows = 1;
    titleBox.placeholder = '论文标题';
    titleBox.value = entry.title || '';
    titleBox.addEventListener('input', function(){ getLitData()[idx].title = titleBox.value; save(); });
    header.appendChild(titleBox);
    var actions = document.createElement('div');
    actions.className = 'ac-lit-card-actions';
    var expandBtn = document.createElement('button');
    expandBtn.textContent = '↕'; expandBtn.title = '折叠/展开';
    expandBtn.addEventListener('click', function(){
      var detail = card.querySelector('.ac-lit-card-detail');
      if(detail) detail.style.display = detail.style.display === 'none' ? '' : 'none';
    });
    actions.appendChild(expandBtn);
    var copyBtn = document.createElement('button');
    copyBtn.textContent = '📋'; copyBtn.title = '复制引用';
    copyBtn.addEventListener('click', function(){
      var d = getLitData()[idx];
      var cite = (d.authors || '') + ' (' + (d.year || d.date ? (d.year || d.date).toString().substring(0,4) : '') + '). ' + (d.title || '') + '. ' + (d.journal || '');
      var ta = document.createElement('textarea');
      ta.value = cite; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta);
    });
    actions.appendChild(copyBtn);
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑'; delBtn.title = '删除';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除文献「' + (getLitData()[idx].title || '未命名') + '」？')) return;
      getLitData().splice(idx,1); save(); renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    card.appendChild(header);

    // Meta row
    var meta = document.createElement('div');
    meta.className = 'ac-lit-meta';
    var metaFields = [
      { label:'作者', key:'authors', val:entry.authors || '', cls:'long' },
      { label:'期刊/会议', key:'journal', val:entry.journal || '', cls:'long' },
      { label:'年份', key:'year', val:entry.year || '', cls:'', type:'number' },
      { label:'状态', key:'status', val:entry.status || '想读', type:'select', opts:['想读','在读','已读','精读','引用'] }
    ];
    metaFields.forEach(function(f){
      var field = document.createElement('div');
      field.className = 'ac-lit-meta-field' + (f.cls ? ' ' + f.cls : '');
      var label = document.createElement('label');
      label.textContent = f.label;
      field.appendChild(label);
      if(f.type === 'select'){
        var sel = document.createElement('select');
        f.opts.forEach(function(o){
          var opt = document.createElement('option');
          opt.value = o; opt.textContent = o;
          if(o === f.val) opt.selected = true;
          sel.appendChild(opt);
        });
        sel.addEventListener('change', function(){ getLitData()[idx][f.key] = sel.value; save(); });
        field.appendChild(sel);
      } else {
        var inp = document.createElement('input');
        inp.type = f.type || 'text';
        inp.value = f.val || '';
        inp.addEventListener('input', function(){ getLitData()[idx][f.key] = inp.value; save(); });
        field.appendChild(inp);
      }
      meta.appendChild(field);
    });
    // Rating
    var ratingField = document.createElement('div');
    ratingField.className = 'ac-lit-meta-field';
    var rLabel = document.createElement('label');
    rLabel.textContent = '评分';
    ratingField.appendChild(rLabel);
    var stars = document.createElement('div');
    stars.className = 'ac-lit-rating';
    var r = entry.rating || 0;
    for(var si=1; si<=5; si++){
      var star = document.createElement('span');
      star.className = 'ac-lit-star' + (si <= r ? ' s' : '');
      star.textContent = '★';
      star.addEventListener('click', function(i){ return function(){
        getLitData()[idx].rating = i; save(); renderAll();
      };}(si));
      stars.appendChild(star);
    }
    ratingField.appendChild(stars);
    meta.appendChild(ratingField);
    card.appendChild(meta);

    // Detail (collapsible)
    var detail = document.createElement('div');
    detail.className = 'ac-lit-card-detail';

    // Keywords
    var kwSection = document.createElement('div');
    kwSection.className = 'ac-lit-body-section';
    var kwLabel = document.createElement('span');
    kwLabel.className = 'ac-lit-body-label';
    kwLabel.textContent = '关键词';
    kwSection.appendChild(kwLabel);
    var kwContainer = document.createElement('div');
    kwContainer.className = 'ac-lit-keywords';
    var kws = Array.isArray(entry.keywords) ? entry.keywords : [];
    kws.forEach(function(kw, ki){
      var tag = document.createElement('span');
      tag.className = 'ac-lit-keyword';
      tag.innerHTML = kw + '<span class="del" data-ki="' + ki + '">×</span>';
      tag.querySelector('.del').addEventListener('click', function(){
        var d = getLitData()[idx];
        if(Array.isArray(d.keywords)){ d.keywords.splice(ki,1); save(); renderAll(); }
      });
      kwContainer.appendChild(tag);
    });
    var kwInput = document.createElement('input');
    kwInput.className = 'ac-lit-keyword-input';
    kwInput.placeholder = '添加关键词...';
    kwInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ','){
        e.preventDefault();
        var v = kwInput.value.trim();
        if(!v) return;
        var d = getLitData()[idx];
        if(!Array.isArray(d.keywords)) d.keywords = [];
        d.keywords.push(v); save();
        kwInput.value = '';
        renderAll();
      }
    });
    kwContainer.appendChild(kwInput);
    kwSection.appendChild(kwContainer);
    detail.appendChild(kwSection);

    // Contribution
    var contribSection = document.createElement('div');
    contribSection.className = 'ac-lit-body-section';
    var contribLabel = document.createElement('span');
    contribLabel.className = 'ac-lit-body-label';
    contribLabel.textContent = '一句话贡献';
    contribSection.appendChild(contribLabel);
    var contribInput = document.createElement('textarea');
    contribInput.className = 'ac-lit-body-input ta';
    contribInput.rows = 2;
    contribInput.placeholder = '这篇论文最核心的贡献是什么？';
    contribInput.value = entry.contribution || '';
    contribInput.addEventListener('input', function(){ getLitData()[idx].contribution = contribInput.value; save(); });
    contribSection.appendChild(contribInput);
    detail.appendChild(contribSection);

    // Personal notes
    var notesSection = document.createElement('div');
    notesSection.className = 'ac-lit-body-section';
    var notesLabel = document.createElement('span');
    notesLabel.className = 'ac-lit-body-label';
    notesLabel.textContent = '个人评价 / 笔记';
    notesSection.appendChild(notesLabel);
    var notesInput = document.createElement('textarea');
    notesInput.className = 'ac-lit-body-input ta';
    notesInput.rows = 2;
    notesInput.placeholder = '你的评价、疑问、可借鉴的思路...';
    notesInput.value = entry.notes || '';
    notesInput.addEventListener('input', function(){ getLitData()[idx].notes = notesInput.value; save(); });
    notesSection.appendChild(notesInput);
    detail.appendChild(notesSection);

    card.appendChild(detail);
    return card;
  }

  function addLitEntry(){
    var d = getLitData();
    d.unshift({ id: genId('lit'), title: '', authors: '', journal: '', year: '', status: '想读', rating: 0, keywords: [], contribution: '', notes: '' });
    save(); renderAll();
    setTimeout(function(){
      var titles = document.querySelectorAll('.ac-lit-card-title');
      if(titles.length > 0) titles[0].focus();
    }, 100);
  }

  function renderLitPanel(){
    var list = document.getElementById('acLitList');
    if(!list) return;
    var data = getLitData();
    list.innerHTML = '';
    // Search bar already in HTML via acLitSearch, but we add one here too for consistency
    var srBar = document.createElement('div');
    srBar.className = 'ac-sr-bar';
    var srInput = document.createElement('input');
    srInput.className = 'ac-sr-input';
    srInput.type = 'text';
    srInput.placeholder = '搜索标题、作者、关键词...';
    srInput.value = litSearchQuery;
    srInput.addEventListener('input', function(){
      litSearchQuery = this.value; litCurrentPage = 0; renderLitPanel();
    });
    srBar.appendChild(srInput);
    var clrBtn = document.createElement('button');
    clrBtn.className = 'ac-sr-clear';
    clrBtn.textContent = '✕';
    clrBtn.addEventListener('click', function(){ litSearchQuery = ''; litCurrentPage = 0; renderLitPanel(); });
    srBar.appendChild(clrBtn);
    list.appendChild(srBar);

    var filtered = data;
    if(litSearchQuery.trim()){
      var q = litSearchQuery.toLowerCase();
      filtered = data.filter(function(e){
        return (e.title || '').toLowerCase().indexOf(q) >= 0 ||
               (e.authors || '').toLowerCase().indexOf(q) >= 0 ||
               (e.journal || '').toLowerCase().indexOf(q) >= 0 ||
               (e.contribution || '').toLowerCase().indexOf(q) >= 0 ||
               (Array.isArray(e.keywords) && e.keywords.some(function(k){ return k.toLowerCase().indexOf(q) >= 0; }));
      });
    }
    if(filtered.length === 0){
      list.innerHTML += '<div class="ac-lit-empty"><div class="ac-lit-empty-icon">📚</div>' +
        (litSearchQuery ? '没有匹配的文献' : '还没有文献，点击「添加文献」开始') + '</div>';
      return;
    }
    filtered.sort(function(a,b){
      var ya = parseInt(a.year) || 0, yb = parseInt(b.year) || 0;
      if(yb !== ya) return yb - ya;
      return (a.title || '').localeCompare(b.title || '');
    });
    // Paginate
    var totalPages = Math.max(1, Math.ceil(filtered.length / litPageSize));
    if(litCurrentPage >= totalPages) litCurrentPage = totalPages - 1;
    if(litCurrentPage < 0) litCurrentPage = 0;
    var start = litCurrentPage * litPageSize;
    var pageEntry = filtered[start];
    var actualIdx = -1;
    for(var i=0; i<data.length; i++){ if(data[i] === pageEntry){ actualIdx = i; break; } }
    if(actualIdx >= 0) list.appendChild(renderLitCard(data[actualIdx], actualIdx));
    // Pagination nav
    var pgNav = document.createElement('div');
    pgNav.className = 'ac-pg-nav';
    var prevBtn = document.createElement('button');
    prevBtn.className = 'pg-btn';
    prevBtn.textContent = '‹ Prev';
    prevBtn.disabled = litCurrentPage <= 0;
    prevBtn.addEventListener('click', function(){ litCurrentPage--; renderLitPanel(); });
    pgNav.appendChild(prevBtn);
    var pgInfo = document.createElement('span');
    pgInfo.className = 'pg-info';
    pgInfo.textContent = (litCurrentPage + 1) + ' / ' + totalPages + ' 页 (' + filtered.length + ' 条)';
    pgNav.appendChild(pgInfo);
    var nextBtn = document.createElement('button');
    nextBtn.className = 'pg-btn';
    nextBtn.textContent = 'Next ›';
    nextBtn.disabled = litCurrentPage >= totalPages - 1;
    nextBtn.addEventListener('click', function(){ litCurrentPage++; renderLitPanel(); });
    pgNav.appendChild(nextBtn);
    list.appendChild(pgNav);
  }

  // ====== Render all (called after each action) ======
  function renderAll(){
    switch(activeTab){
      case 'exp': renderExpPanel(); break;
      case 'paper': renderPapersPanel(); break;
      case 'lit': renderLitPanel(); break;
    }
  }

  function switchTab(tab){
    activeTab = tab;
    document.querySelectorAll('.ac-tab').forEach(function(t){ t.classList.remove('a'); });
    document.querySelectorAll('.ac-panel').forEach(function(p){ p.classList.remove('a'); });
    var tabEl = document.getElementById('acTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(tabEl) tabEl.classList.add('a');
    var panel = document.getElementById('acPanel' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(panel) panel.classList.add('a');
    renderAll();
    // Update modal height
    var modal = document.getElementById('acModal');
    if(modal) modal.style.height = '';
  }

  // ====== Modal toggle ======
  function showModal(){
    var overlay = document.getElementById('acOverlay');
    var modal = document.getElementById('acModal');
    if(!overlay || !modal) return;
    overlay.classList.add('s');
    modal.classList.add('s');
    switchTab(activeTab);
  }

  function hideModal(){
    document.getElementById('acOverlay').classList.remove('s');
    document.getElementById('acModal').classList.remove('s');
  }

  function toggleModal(){
    var modal = document.getElementById('acModal');
    if(!modal) return;
    if(modal.classList.contains('s')) hideModal();
    else showModal();
  }

  // ====== Init ======
  function init(){
    var btn = document.getElementById('academicBtn');
    if(btn) btn.addEventListener('click', toggleModal);

    document.getElementById('acClose').addEventListener('click', hideModal);
    document.getElementById('acOverlay').addEventListener('click', hideModal);
    document.getElementById('acSaveBtn').addEventListener('click', function(){
      if(typeof window.save === 'function') {
        try { window.save(); showToast('💾 学术数据已保存'); }
        catch(e) { showToast('⚠️ 保存失败: ' + (e.message||e)); }
      } else { showToast('⚠️ 保存失败: save 函数不可用'); }
    });

    // Tab switching
    document.getElementById('acTabExp').addEventListener('click', function(){ switchTab('exp'); });
    document.getElementById('acTabPaper').addEventListener('click', function(){ switchTab('paper'); });
    document.getElementById('acTabLit').addEventListener('click', function(){ switchTab('lit'); });

    // Add buttons
    document.getElementById('acElAddBtn').addEventListener('click', function(){ addExpEntry(); expCurrentPage = 0; });
    document.getElementById('acPmAddBtn').addEventListener('click', addPaper);
    document.getElementById('acLitAddBtn').addEventListener('click', function(){ addLitEntry(); litCurrentPage = 0; });

    // Escape key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && document.getElementById('acModal').classList.contains('s')) hideModal();
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('feature-academic: loaded');
})();
