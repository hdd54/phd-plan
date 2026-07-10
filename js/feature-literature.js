// ===== FEATURE: Literature Notes (文献笔记) =====
// Track papers read: title, authors, journal, keywords, contribution, evaluation
(function(){
  if(window.__features['literature']) return;
  window.__features['literature'] = true;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .lit-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .lit-overlay.s{display:block}
    .lit-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,800px);max-height:90vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .lit-modal.s{display:flex}
    .lit-header{display:flex;align-items:center;justify-content:space-between;padding:clamp(.5rem,.8vw,.7rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line)}
    .lit-header h3{font-family:var(--font-serif);font-size:clamp(.75rem,1.2vw,.95rem);font-weight:600;color:var(--fg)}
    .lit-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem}
    .lit-close:hover{color:var(--accent)}
    .lit-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .lit-toolbar{display:flex;gap:.3rem;margin-bottom:.5rem;flex-wrap:wrap;align-items:center}
    .lit-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .lit-add-btn:hover{background:rgba(212,165,116,.2)}
    .lit-search{margin-left:auto}
    .lit-search input{background:var(--bg3);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.12rem,.2vw,.18rem) clamp(.2rem,.3vw,.25rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.42rem,.65vw,.48rem);outline:none;width:clamp(100px,16vw,160px)}
    .lit-search input:focus{border-color:var(--accent)}

    .lit-card{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);margin-bottom:.45rem;padding:clamp(.35rem,.55vw,.5rem)}
    .lit-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.3rem;margin-bottom:.2rem}
    .lit-card-title{flex:1;font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.65rem);font-weight:600;color:var(--fg);background:none;border:none;outline:none;padding:0;width:100%;line-height:1.4;resize:none}
    .lit-card-title:focus{color:var(--accent)}
    .lit-card-actions{display:flex;gap:.1rem;flex-shrink:0}
    .lit-card-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .1rem;font-family:var(--font-sans)}
    .lit-card-actions button:hover{color:var(--accent-2)}

    .lit-meta{display:flex;gap:clamp(.15rem,.25vw,.2rem);flex-wrap:wrap;margin-bottom:.2rem}
    .lit-meta-field{display:flex;align-items:center;gap:.1rem}
    .lit-meta-field label{font-size:clamp(.35rem,.55vw,.4rem);color:var(--muted);white-space:nowrap;font-family:var(--font-sans)}
    .lit-meta-field input,.lit-meta-field select{background:var(--bg3);border:1px solid var(--line);border-radius:3px;padding:clamp(.06rem,.12vw,.1rem) clamp(.1rem,.18vw,.14rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.4rem,.6vw,.45rem);outline:none;max-width:clamp(80px,12vw,120px)}
    .lit-meta-field input:focus,.lit-meta-field select:focus{border-color:var(--accent)}
    .lit-meta-field.long input{max-width:clamp(120px,18vw,200px)}

    .lit-body-section{margin-bottom:.12rem}
    .lit-body-label{font-size:clamp(.35rem,.55vw,.4rem);color:var(--muted);font-family:var(--font-sans);display:block;letter-spacing:.02em}
    .lit-body-input{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.1rem,.18vw,.14rem) clamp(.14rem,.22vw,.18rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.42rem,.65vw,.48rem);outline:none;width:100%}
    .lit-body-input:focus{border-color:var(--accent)}
    .lit-body-input.ta{resize:vertical;min-height:clamp(28px,3vw,36px);line-height:1.5}

    .lit-keywords{display:flex;flex-wrap:wrap;gap:.15rem;margin-top:.08rem}
    .lit-keyword{background:rgba(212,165,116,.1);border:1px solid rgba(212,165,116,.2);border-radius:3px;padding:.02rem .25rem;font-size:clamp(.38rem,.6vw,.42rem);color:var(--accent);font-family:var(--font-sans);display:inline-flex;align-items:center;gap:.1rem}
    .lit-keyword .del{cursor:pointer;color:var(--muted);font-size:.9em}
    .lit-keyword .del:hover{color:var(--accent-2)}
    .lit-keyword-input{background:transparent;border:1px dashed var(--line);border-radius:3px;color:var(--muted);font-size:clamp(.38rem,.6vw,.42rem);padding:.02rem .2rem;font-family:var(--font-sans);outline:none;max-width:100px}
    .lit-keyword-input:focus{border-color:var(--accent);color:var(--fg)}

    .lit-rating{display:flex;gap:.05rem;align-items:center}
    .lit-star{cursor:pointer;font-size:clamp(.55rem,.85vw,.6rem);color:var(--line-2);transition:color .15s}
    .lit-star.s{color:#f0a030}
    .lit-star:hover{color:#f0a030}

    .lit-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .lit-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}
  `;
  document.head.appendChild(style);

  // ===== Data =====
  function getData(){
    var d = window.data || {};
    if(!d._literature) d._literature = [];
    return d._literature;
  }
  function save(){ window.save(); }
  function genId(){ return 'lit' + Date.now() + Math.random().toString(36).slice(2,6); }

  // ===== State =====
  var searchQuery = '';

  // ===== Render card =====
  function renderCard(entry, idx){
    var card = document.createElement('div');
    card.className = 'lit-card';
    card.dataset.idx = idx;

    // Header: title + actions
    var header = document.createElement('div');
    header.className = 'lit-card-header';

    var titleBox = document.createElement('textarea');
    titleBox.className = 'lit-card-title';
    titleBox.rows = 1;
    titleBox.placeholder = '论文标题';
    titleBox.value = entry.title || '';
    titleBox.addEventListener('input', function(){ getData()[idx].title = titleBox.value; save(); });
    header.appendChild(titleBox);

    var actions = document.createElement('div');
    actions.className = 'lit-card-actions';

    var expandBtn = document.createElement('button');
    expandBtn.textContent = '↕'; expandBtn.title = '折叠/展开';
    expandBtn.addEventListener('click', function(){
      var detail = card.querySelector('.lit-card-detail');
      if(detail) detail.style.display = detail.style.display === 'none' ? '' : 'none';
    });
    actions.appendChild(expandBtn);

    var copyBtn = document.createElement('button');
    copyBtn.textContent = '📋'; copyBtn.title = '复制引用';
    copyBtn.addEventListener('click', function(){
      var d = getData()[idx];
      var cite = (d.authors || '') + ' (' + (d.year || d.date ? (d.year || d.date).toString().substring(0,4) : '') + '). ' +
                 (d.title || '') + '. ' + (d.journal || '');
      fallbackCopy(cite);
    });
    actions.appendChild(copyBtn);

    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑'; delBtn.title = '删除';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除文献「' + (getData()[idx].title || '未命名') + '」？')) return;
      getData().splice(idx,1); save(); renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    card.appendChild(header);

    // Meta row: authors, journal, year, status, rating
    var meta = document.createElement('div');
    meta.className = 'lit-meta';

    var metaFields = [
      { label:'作者', key:'authors', val:entry.authors || '', cls:'long' },
      { label:'期刊/会议', key:'journal', val:entry.journal || '', cls:'long' },
      { label:'年份', key:'year', val:entry.year || '', cls:'', type:'number' },
      { label:'状态', key:'status', val:entry.status || '想读', type:'select',
        opts:['想读','在读','已读','精读','引用'] }
    ];

    var self = this;
    metaFields.forEach(function(f){
      var field = document.createElement('div');
      field.className = 'lit-meta-field' + (f.cls ? ' ' + f.cls : '');
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
        sel.addEventListener('change', function(){ getData()[idx][f.key] = sel.value; save(); });
        field.appendChild(sel);
      } else {
        var inp = document.createElement('input');
        inp.type = f.type || 'text';
        inp.value = f.val || '';
        inp.addEventListener('input', function(){ getData()[idx][f.key] = inp.value; save(); });
        field.appendChild(inp);
      }
      meta.appendChild(field);
    });

    // Rating stars
    var ratingField = document.createElement('div');
    ratingField.className = 'lit-meta-field';
    var rLabel = document.createElement('label');
    rLabel.textContent = '评分';
    ratingField.appendChild(rLabel);
    var stars = document.createElement('div');
    stars.className = 'lit-rating';
    var r = entry.rating || 0;
    for(var si=1; si<=5; si++){
      var star = document.createElement('span');
      star.className = 'lit-star' + (si <= r ? ' s' : '');
      star.textContent = '★';
      star.addEventListener('click', function(i){ return function(){
        getData()[idx].rating = i; save(); renderAll();
      };}(si));
      stars.appendChild(star);
    }
    ratingField.appendChild(stars);
    meta.appendChild(ratingField);
    card.appendChild(meta);

    // Detail (collapsible)
    var detail = document.createElement('div');
    detail.className = 'lit-card-detail';

    // Keywords
    var kwSection = document.createElement('div');
    kwSection.className = 'lit-body-section';
    var kwLabel = document.createElement('span');
    kwLabel.className = 'lit-body-label';
    kwLabel.textContent = '关键词';
    kwSection.appendChild(kwLabel);
    var kwContainer = document.createElement('div');
    kwContainer.className = 'lit-keywords';
    var kws = Array.isArray(entry.keywords) ? entry.keywords : [];
    kws.forEach(function(kw, ki){
      var tag = document.createElement('span');
      tag.className = 'lit-keyword';
      tag.innerHTML = kw + '<span class="del" data-ki="' + ki + '">×</span>';
      tag.querySelector('.del').addEventListener('click', function(){
        var d = getData()[idx];
        if(Array.isArray(d.keywords)){ d.keywords.splice(ki,1); save(); renderAll(); }
      });
      kwContainer.appendChild(tag);
    });
    var kwInput = document.createElement('input');
    kwInput.className = 'lit-keyword-input';
    kwInput.placeholder = '添加关键词...';
    kwInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ','){
        e.preventDefault();
        var v = kwInput.value.trim();
        if(!v) return;
        var d = getData()[idx];
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
    contribSection.className = 'lit-body-section';
    var contribLabel = document.createElement('span');
    contribLabel.className = 'lit-body-label';
    contribLabel.textContent = '一句话贡献';
    contribSection.appendChild(contribLabel);
    var contribInput = document.createElement('textarea');
    contribInput.className = 'lit-body-input ta';
    contribInput.rows = 2;
    contribInput.placeholder = '这篇论文最核心的贡献是什么？';
    contribInput.value = entry.contribution || '';
    contribInput.addEventListener('input', function(){ getData()[idx].contribution = contribInput.value; save(); });
    contribSection.appendChild(contribInput);
    detail.appendChild(contribSection);

    // Personal notes
    var notesSection = document.createElement('div');
    notesSection.className = 'lit-body-section';
    var notesLabel = document.createElement('span');
    notesLabel.className = 'lit-body-label';
    notesLabel.textContent = '个人评价 / 笔记';
    notesSection.appendChild(notesLabel);
    var notesInput = document.createElement('textarea');
    notesInput.className = 'lit-body-input ta';
    notesInput.rows = 2;
    notesInput.placeholder = '你的评价、疑问、可借鉴的思路...';
    notesInput.value = entry.notes || '';
    notesInput.addEventListener('input', function(){ getData()[idx].notes = notesInput.value; save(); });
    notesSection.appendChild(notesInput);
    detail.appendChild(notesSection);

    card.appendChild(detail);
    return card;
  }

  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }

  // ===== Render all =====
  function renderAll(){
    var list = document.getElementById('litList');
    if(!list) return;
    var data = getData();
    list.innerHTML = '';

    // Filter by search
    var filtered = data;
    if(searchQuery.trim()){
      var q = searchQuery.toLowerCase();
      filtered = data.filter(function(e){
        return (e.title || '').toLowerCase().indexOf(q) >= 0 ||
               (e.authors || '').toLowerCase().indexOf(q) >= 0 ||
               (e.journal || '').toLowerCase().indexOf(q) >= 0 ||
               (e.contribution || '').toLowerCase().indexOf(q) >= 0 ||
               (Array.isArray(e.keywords) && e.keywords.some(function(k){ return k.toLowerCase().indexOf(q) >= 0; }));
      });
    }

    if(filtered.length === 0){
      list.innerHTML = '<div class="lit-empty"><div class="lit-empty-icon">📚</div>' +
        (searchQuery ? '没有匹配的文献' : '还没有文献，点击「添加文献」开始') + '</div>';
      return;
    }

    // Sort by year descending, then by title
    filtered.sort(function(a,b){
      var ya = parseInt(a.year) || 0, yb = parseInt(b.year) || 0;
      if(yb !== ya) return yb - ya;
      return (a.title || '').localeCompare(b.title || '');
    });

    filtered.forEach(function(entry, fi){
      // Find the actual index in source array
      var actualIdx = -1;
      for(var i=0; i<data.length; i++){
        if(data[i] === entry){ actualIdx = i; break; }
      }
      if(actualIdx >= 0) list.appendChild(renderCard(data[actualIdx], actualIdx));
    });
  }

  function addEntry(){
    var d = getData();
    d.unshift({
      id: genId(), title: '', authors: '', journal: '', year: '',
      status: '想读', rating: 0, keywords: [],
      contribution: '', notes: ''
    });
    save();
    renderAll();
    setTimeout(function(){
      var titles = document.querySelectorAll('.lit-card-title');
      if(titles.length > 0) titles[0].focus();
    }, 100);
  }

  // ===== Modal =====
  function show(){
    document.getElementById('litOverlay').classList.add('s');
    document.getElementById('litModal').classList.add('s');
    renderAll();
  }
  function hide(){
    document.getElementById('litOverlay').classList.remove('s');
    document.getElementById('litModal').classList.remove('s');
  }
  function toggle(){
    var m = document.getElementById('litModal');
    if(m.classList.contains('s')) hide(); else show();
  }

  // ===== Init =====
  function init(){
    document.getElementById('litBtn').addEventListener('click', toggle);
    document.getElementById('litClose').addEventListener('click', hide);
    document.getElementById('litOverlay').addEventListener('click', hide);
    document.getElementById('litAddBtn').addEventListener('click', addEntry);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  console.log('feature-literature: loaded');
})();
