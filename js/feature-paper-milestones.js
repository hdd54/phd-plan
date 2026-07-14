// ===== FEATURE: Paper Milestone Tracker =====
// Tracks papers through their lifecycle stages with timeline visualization

(function(){
  if(window.__features['paper-milestones']) return;
  window.__features['paper-milestones'] = true;

  // ===== Constants =====
  var STAGES = [
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

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .pm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .pm-overlay.s{display:block}
    .pm-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(92vw,680px);max-height:85vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .pm-modal.s{display:flex}
    .pm-header{display:flex;align-items:center;justify-content:space-between;padding:clamp(.5rem,.8vw,.7rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line)}
    .pm-header h3{font-family:var(--font-serif);font-size:clamp(.75rem,1.2vw,.95rem);font-weight:600;color:var(--fg)}
    .pm-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem}
    .pm-close:hover{color:var(--accent)}
    .pm-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .pm-toolbar{display:flex;gap:.4rem;margin-bottom:.6rem}
    .pm-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .pm-add-btn:hover{background:rgba(212,165,116,.2)}

    /* Paper Card */
    .pm-card{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);margin-bottom:.5rem;padding:clamp(.4rem,.6vw,.6rem);position:relative}
    .pm-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.3rem;margin-bottom:.3rem}
    .pm-card-title{flex:1;font-family:var(--font-sans);font-size:clamp(.6rem,.95vw,.7rem);font-weight:600;color:var(--fg);background:none;border:none;width:100%;outline:none;resize:none;padding:0;line-height:1.4}
    .pm-card-title:focus{color:var(--accent)}
    .pm-card-actions{display:flex;gap:.15rem;flex-shrink:0}
    .pm-card-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .12rem;font-family:var(--font-sans)}
    .pm-card-actions button:hover{color:var(--accent-2)}

    .pm-card-meta{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.35rem}
    .pm-meta-input{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.08rem,.15vw,.12rem) clamp(.15rem,.25vw,.2rem);color:var(--fg-dim);font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.5rem);outline:none;flex:1;min-width:80px}
    .pm-meta-input:focus{border-color:var(--accent);color:var(--fg)}

    /* Timeline */
    .pm-timeline{display:flex;flex-wrap:wrap;gap:clamp(.15rem,.25vw,.25rem);margin-top:.25rem}
    .pm-stage{display:flex;align-items:center;gap:clamp(.12rem,.18vw,.18rem);padding:clamp(.08rem,.15vw,.12rem) clamp(.2rem,.3vw,.25rem);border-radius:999px;border:1px solid var(--line-2);background:transparent;cursor:pointer;transition:all .2s;font-size:clamp(.4rem,.65vw,.5rem);color:var(--muted);font-family:var(--font-sans);white-space:nowrap}
    .pm-stage:hover{border-color:var(--accent-3);color:var(--fg-dim)}
    .pm-stage.done{border-color:var(--accent-3);background:rgba(74,124,140,.12);color:var(--accent-3)}
    .pm-stage.active{border-color:var(--accent);background:rgba(212,165,116,.12);color:var(--accent);font-weight:600}
    .pm-stage .pm-st-icon{font-size:clamp(.45rem,.7vw,.55rem)}
    .pm-stage .pm-st-date{font-size:clamp(.35rem,.55vw,.4rem);color:var(--muted);margin-left:.05rem}

    /* Empty state */
    .pm-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .pm-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}
  `;
  document.head.appendChild(style);

  // ===== Data helpers =====
  function getPapers(){
    var d = window.data || {};
    if(!d._papers) d._papers = [];
    return d._papers;
  }

  function savePapers(){
    window.save();
  }

  function genId(){
    return 'p' + Date.now() + Math.random().toString(36).slice(2,6);
  }

  // ===== Render a single paper card =====
  function renderPaperCard(paper, idx){
    var card = document.createElement('div');
    card.className = 'pm-card';
    card.dataset.idx = idx;

    // Header: title + actions
    var header = document.createElement('div');
    header.className = 'pm-card-header';

    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'pm-card-title';
    titleInput.placeholder = '输入论文标题...';
    titleInput.value = paper.title || '';
    titleInput.addEventListener('input', function(){
      getPapers()[idx].title = titleInput.value;
      savePapers();
    });
    header.appendChild(titleInput);

    var actions = document.createElement('div');
    actions.className = 'pm-card-actions';
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.title = '删除此论文';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除「' + (paper.title || '未命名论文') + '」？')) return;
      getPapers().splice(idx, 1);
      savePapers();
      renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    card.appendChild(header);

    // Meta: journal
    var meta = document.createElement('div');
    meta.className = 'pm-card-meta';
    var journalInput = document.createElement('input');
    journalInput.type = 'text';
    journalInput.className = 'pm-meta-input';
    journalInput.placeholder = '期刊/会议名称';
    journalInput.value = paper.journal || '';
    journalInput.addEventListener('input', function(){
      getPapers()[idx].journal = journalInput.value;
      savePapers();
    });
    meta.appendChild(journalInput);
    card.appendChild(meta);

    // Timeline stages
    var timeline = document.createElement('div');
    timeline.className = 'pm-timeline';

    var milestones = paper.milestones || {};
    var allStages = STAGES;

    // Find current active stage index
    var activeIdx = -1;
    for(var i = allStages.length - 1; i >= 0; i--){
      if(milestones[allStages[i].key]){
        activeIdx = i;
        break;
      }
    }

    allStages.forEach(function(stage, si){
      var stageEl = document.createElement('div');
      stageEl.className = 'pm-stage';
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

      // Click to toggle milestone
      stageEl.addEventListener('click', function(e){
        e.stopPropagation();
        toggleMilestone(idx, stage.key);
      });

      timeline.appendChild(stageEl);
    });

    card.appendChild(timeline);

    return card;
  }

  // ===== Toggle a milestone on/off for a paper =====
  function toggleMilestone(idx, stageKey){
    var papers = getPapers();
    if(!papers[idx]) return;
    var paper = papers[idx];
    if(!paper.milestones) paper.milestones = {};

    if(paper.milestones[stageKey]){
      // Remove this milestone and all later milestones
      var keys = STAGES.map(function(s){ return s.key; });
      var startIdx = keys.indexOf(stageKey);
      if(startIdx >= 0){
        for(var i = startIdx; i < keys.length; i++){
          delete paper.milestones[keys[i]];
        }
      }
    } else {
      // Set milestone to today's date
      var d = new Date();
      paper.milestones[stageKey] = d.toISOString().slice(0, 10);
    }
    savePapers();
    renderAll();
  }

  // ===== Add new paper =====
  function addPaper(){
    var papers = getPapers();
    papers.push({
      id: genId(),
      title: '',
      journal: '',
      milestones: {},
    });
    savePapers();
    renderAll();
    // Focus the new paper's title input
    setTimeout(function(){
      var inputs = document.querySelectorAll('.pm-card-title');
      if(inputs.length > 0) inputs[inputs.length - 1].focus();
    }, 100);
  }

  // ===== Render all papers =====
  function renderAll(){
    var list = document.getElementById('pmList');
    if(!list) return;
    var papers = getPapers();
    list.innerHTML = '';
    if(papers.length === 0){
      list.innerHTML = '<div class="pm-empty"><div class="pm-empty-icon">📄</div>还没有论文，点击上方「添加论文」开始追踪</div>';
      return;
    }
    papers.forEach(function(paper, idx){
      list.appendChild(renderPaperCard(paper, idx));
    });
  }

  // ===== Modal toggle =====
  function showModal(){
    var overlay = document.getElementById('pmOverlay');
    var modal = document.getElementById('pmModal');
    if(!overlay || !modal) return;
    overlay.classList.add('s');
    modal.classList.add('s');
    renderAll();
  }

  function hideModal(){
    var overlay = document.getElementById('pmOverlay');
    var modal = document.getElementById('pmModal');
    if(!overlay || !modal) return;
    overlay.classList.remove('s');
    modal.classList.remove('s');
  }

  function toggleModal(){
    var modal = document.getElementById('pmModal');
    if(!modal) return;
    if(modal.classList.contains('s')) hideModal();
    else showModal();
  }

  // ===== Init =====
  function init(){
    // Wire up button
    var btn = document.getElementById('paperBtn');
    if(btn) btn.addEventListener('click', toggleModal);

    // Wire up modal controls
    var close = document.getElementById('pmClose');
    if(close) close.addEventListener('click', hideModal);
    var overlay = document.getElementById('pmOverlay');
    if(overlay) overlay.addEventListener('click', hideModal);
    var addBtn = document.getElementById('pmAddBtn');
    if(addBtn) addBtn.addEventListener('click', addPaper);
  }

  // Run on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('feature-paper-milestones: loaded');
})();
