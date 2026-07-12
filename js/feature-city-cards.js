// ===== FEATURE: City Data Cards =====
(function(){
  if(window.__features['city-cards']) return;
  window.__features['city-cards'] = true;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .cc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .cc-overlay.s{display:block}
    .cc-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,780px);max-height:88vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .cc-modal.s{display:flex}
    .cc-header{display:flex;align-items:center;justify-content:space-between;padding:clamp(.5rem,.8vw,.7rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line)}
    .cc-header h3{font-family:var(--font-serif);font-size:clamp(.75rem,1.2vw,.95rem);font-weight:600;color:var(--fg)}
    .cc-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem}
    .cc-close:hover{color:var(--accent)}
    .cc-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .cc-toolbar{margin-bottom:.5rem}
    .cc-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .cc-add-btn:hover{background:rgba(212,165,116,.2)}

    /* Card grid */
    .cc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(clamp(220px,28vw,280px),1fr));gap:clamp(.35rem,.55vw,.5rem)}

    /* Card */
    .cc-card{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.35rem,.55vw,.5rem)}
    .cc-card-header{display:flex;align-items:center;justify-content:space-between;gap:.3rem;margin-bottom:.3rem;padding-bottom:.2rem;border-bottom:1px solid var(--line)}
    .cc-card-city{flex:1;font-family:var(--font-sans);font-size:clamp(.6rem,.9vw,.7rem);font-weight:600;color:var(--fg);background:none;border:none;outline:none;padding:0;width:100%}
    .cc-card-city:focus{color:var(--accent)}
    .cc-card-actions{display:flex;gap:.15rem;flex-shrink:0}
    .cc-card-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .12rem;font-family:var(--font-sans)}
    .cc-card-actions button:hover{color:var(--accent-2)}

    .cc-card-field{display:flex;flex-direction:column;gap:.03rem;margin-bottom:.15rem}
    .cc-card-field label{font-size:clamp(.38rem,.55vw,.42rem);color:var(--muted);font-family:var(--font-sans);letter-spacing:.02em}
    .cc-card-field input,.cc-card-field textarea{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.1rem,.18vw,.14rem) clamp(.14rem,.22vw,.18rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.42rem,.65vw,.48rem);outline:none}
    .cc-card-field input:focus,.cc-card-field textarea:focus{border-color:var(--accent)}
    .cc-card-field textarea{resize:vertical;min-height:clamp(32px,3.5vw,40px);line-height:1.5}
    .cc-card-field.half{display:inline-flex;width:48%}
    .cc-card-row{display:flex;gap:.25rem;flex-wrap:wrap}

    .cc-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .cc-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}
    /* Pagination */
    .cc-pg-nav{display:flex;align-items:center;justify-content:center;gap:.5rem;margin-top:.5rem;padding-top:.3rem;border-top:1px solid var(--line)}
    .cc-pg-btn{background:rgba(212,165,116,.1);border:1px solid var(--line-2);border-radius:6px;color:var(--fg-dim);padding:clamp(.12rem,.2vw,.18rem) clamp(.3rem,.5vw,.4rem);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.5rem);transition:all .2s}
    .cc-pg-btn:hover{border-color:var(--accent);color:var(--accent)}
    .cc-pg-btn:disabled{opacity:.3;cursor:default;border-color:var(--line-2);color:var(--muted)}
    .cc-pg-info{font-size:clamp(.45rem,.7vw,.5rem);color:var(--muted);font-family:var(--font-sans)}
  `;
  document.head.appendChild(style);

  // ===== Pagination state =====
  var ccPageSize = 2;
  var ccCurrentPage = 0;

  // ===== Data =====
  function getData(){
    var d = window.data || {};
    if(!d._cityCards) d._cityCards = [];
    return d._cityCards;
  }
  function save(){ window.save(); }
  function genId(){ return 'cc' + Date.now() + Math.random().toString(36).slice(2,6); }

  // ===== Render card =====
  function renderCard(c, idx){
    var card = document.createElement('div');
    card.className = 'cc-card';
    card.dataset.idx = idx;

    // Header
    var header = document.createElement('div');
    header.className = 'cc-card-header';
    var cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.className = 'cc-card-city';
    cityInput.placeholder = '城市名称';
    cityInput.value = c.city || '';
    cityInput.addEventListener('input', function(){ getData()[idx].city = cityInput.value; save(); });
    header.appendChild(cityInput);
    var actions = document.createElement('div');
    actions.className = 'cc-card-actions';
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑'; delBtn.title = '删除';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除 ' + (getData()[idx].city || '此城市') + '？')) return;
      getData().splice(idx,1); save(); renderAll();
    });
    actions.appendChild(delBtn);
    header.appendChild(actions);
    card.appendChild(header);

    // Fields
    var fields = [
      { label:'平均房价 (元/㎡)', key:'price', val:c.price || '' },
      { label:'平均租金 (元/月)', key:'rent', val:c.rent || '' },
      { label:'人均月收入 (元)', key:'income', val:c.income || '' },
      { label:'首付门槛 (万元)', key:'downThreshold', val:c.downThreshold || '' },
      { label:'房价收入比', key:'priceIncomeRatio', val:c.priceIncomeRatio || '' },
      { label:'人才政策', key:'talentPolicy', val:c.talentPolicy || '', large:true },
      { label:'求职环境', key:'jobMarket', val:c.jobMarket || '', large:true },
      { label:'生活评价', key:'lifestyle', val:c.lifestyle || '', large:true },
    ];

    fields.forEach(function(f){
      var field = document.createElement('div');
      field.className = 'cc-card-field';
      var label = document.createElement('label');
      label.textContent = f.label;
      field.appendChild(label);
      
      if(f.large){
        var ta = document.createElement('textarea');
        ta.rows = 2;
        ta.placeholder = f.label + '...';
        ta.value = f.val || '';
        ta.addEventListener('input', function(){ getData()[idx][f.key] = ta.value; save(); });
        field.appendChild(ta);
      } else {
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = f.label;
        inp.value = f.val || '';
        inp.addEventListener('input', function(){ getData()[idx][f.key] = inp.value; save(); });
        field.appendChild(inp);
      }
      card.appendChild(field);
    });

    return card;
  }

  // ===== Render all =====
  function renderAll(){
    var list = document.getElementById('ccList');
    if(!list) return;
    var data = getData();
    list.innerHTML = '';
    if(data.length === 0){
      list.innerHTML = '<div class="cc-empty"><div class="cc-empty-icon">🏙️</div>还没有城市数据，点击「添加城市」开始</div>';
      return;
    }
    var totalPages = Math.max(1, Math.ceil(data.length / ccPageSize));
    if(ccCurrentPage >= totalPages) ccCurrentPage = totalPages - 1;
    if(ccCurrentPage < 0) ccCurrentPage = 0;
    var start = ccCurrentPage * ccPageSize;
    var end = Math.min(start + ccPageSize, data.length);
    var pageData = data.slice(start, end);
    var grid = document.createElement('div');
    grid.className = 'cc-grid';
    pageData.forEach(function(c, idx){
      grid.appendChild(renderCard(c, start + idx));
    });
    list.appendChild(grid);
    // Pagination nav
    var pgNav = document.createElement('div');
    pgNav.className = 'cc-pg-nav';
    var prevBtn = document.createElement('button');
    prevBtn.className = 'cc-pg-btn';
    prevBtn.textContent = '‹ Prev';
    prevBtn.disabled = ccCurrentPage <= 0;
    prevBtn.addEventListener('click', function(){ ccCurrentPage--; renderAll(); });
    pgNav.appendChild(prevBtn);
    var pgInfo = document.createElement('span');
    pgInfo.className = 'cc-pg-info';
    pgInfo.textContent = (ccCurrentPage + 1) + ' / ' + totalPages + ' 页 (' + data.length + ' 城市)';
    pgNav.appendChild(pgInfo);
    var nextBtn = document.createElement('button');
    nextBtn.className = 'cc-pg-btn';
    nextBtn.textContent = 'Next ›';
    nextBtn.disabled = ccCurrentPage >= totalPages - 1;
    nextBtn.addEventListener('click', function(){ ccCurrentPage++; renderAll(); });
    pgNav.appendChild(nextBtn);
    list.appendChild(pgNav);
  }

  function addCity(){
    var d = getData();
    d.push({
      id: genId(), city: '', price: '', rent: '', income: '',
      downThreshold: '', priceIncomeRatio: '',
      talentPolicy: '', jobMarket: '', lifestyle: ''
    });
    save();
    // Go to the last page
    ccCurrentPage = Math.floor(d.length / ccPageSize);
    if(ccCurrentPage > 0 && d.length % ccPageSize === 1) ccCurrentPage = Math.floor((d.length - 1) / ccPageSize);
    renderAll();
  }

  // ===== Modal =====
  function show(){
    document.getElementById('ccOverlay').classList.add('s');
    document.getElementById('ccModal').classList.add('s');
    renderAll();
  }
  function hide(){
    document.getElementById('ccOverlay').classList.remove('s');
    document.getElementById('ccModal').classList.remove('s');
  }
  function toggle(){
    var m = document.getElementById('ccModal');
    if(m.classList.contains('s')) hide(); else show();
  }

  // ===== Init =====
  function init(){
    document.getElementById('cityBtn').addEventListener('click', toggle);
    document.getElementById('ccClose').addEventListener('click', hide);
    document.getElementById('ccOverlay').addEventListener('click', hide);
    document.getElementById('ccSaveBtn').addEventListener('click', function(){
      if(typeof window.save === 'function') {
        try { window.save(); showToast('💾 城市数据已保存'); }
        catch(e) { showToast('⚠️ 保存失败: ' + (e.message||e)); }
      } else { showToast('⚠️ 保存失败: save 函数不可用'); }
    });
    document.getElementById('ccAddBtn').addEventListener('click', addCity);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  console.log('feature-city-cards: loaded');
})();
