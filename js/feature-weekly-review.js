// ===== FEATURE: Notebook / Memo (记录本) =====
// Editable multi-page memo with save, add, delete, page navigation
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
    .rw-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1;display:flex;flex-direction:column}
    .rw-toolbar{display:flex;align-items:center;gap:.3rem;margin-bottom:.5rem;flex-wrap:wrap}
    .rw-nav{font-size:clamp(.7rem,1vw,.8rem);color:var(--muted);cursor:pointer;padding:.05rem .15rem;user-select:none}
    .rw-nav:hover{color:var(--accent)}
    .rw-label{flex:1;font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.6rem);color:var(--fg);font-weight:500;text-align:center}

    .rw-memo-actions{display:flex;gap:.3rem;flex-wrap:wrap;align-items:center}
    .rw-btn{background:rgba(212,165,116,.1);border:1px solid var(--accent);color:var(--accent);padding:clamp(.15rem,.25vw,.22rem) clamp(.3rem,.5vw,.4rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.4rem,.65vw,.45rem);transition:all .2s;white-space:nowrap}
    .rw-btn:hover{background:rgba(212,165,116,.2)}
    .rw-btn.danger{border-color:var(--accent-2);color:var(--accent-2)}
    .rw-btn.danger:hover{background:rgba(232,93,47,.2)}
    .rw-btn.primary{background:rgba(212,165,116,.25);font-weight:600}

    .rw-memo-title{width:100%;background:var(--bg3);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.2rem,.35vw,.28rem) clamp(.25rem,.4vw,.3rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.55rem,.85vw,.6rem);outline:none;margin-bottom:.3rem;box-sizing:border-box;font-weight:500}
    .rw-memo-title:focus{border-color:var(--accent)}
    .rw-memo-title::placeholder{color:var(--muted)}

    .rw-memo-content{flex:1;min-height:clamp(200px,40vh,350px);background:var(--bg3);border:1px solid var(--line);border-radius:var(--rs);padding:clamp(.3rem,.5vw,.4rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.48rem,.75vw,.55rem);outline:none;resize:vertical;line-height:1.8;box-sizing:border-box;width:100%}
    .rw-memo-content:focus{border-color:var(--accent)}
    .rw-memo-content::placeholder{color:var(--muted)}

    .rw-empty{text-align:center;padding:2rem;color:var(--muted);font-size:clamp(.5rem,.8vw,.55rem);font-family:var(--font-sans)}
    .rw-page-picker{display:flex;gap:.12rem;flex-wrap:wrap;justify-content:center;margin-bottom:.3rem}
    .rw-page-dot{width:clamp(22px,3vw,28px);height:clamp(22px,3vw,28px);border-radius:50%;border:1px solid var(--line-2);background:transparent;color:var(--muted);font-size:clamp(.4rem,.6vw,.45rem);cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:var(--font-sans);transition:all .2s}
    .rw-page-dot:hover{border-color:var(--accent);color:var(--accent)}
    .rw-page-dot.s{background:rgba(212,165,116,.15);border-color:var(--accent);color:var(--accent);font-weight:700}
  `;
  document.head.appendChild(style);

  // ===== Data =====
  function getPages(){
    var d = window.data || {};
    if(!d._memoPages || !Array.isArray(d._memoPages)){
      d._memoPages = [{ id: 'm1', title: '', content: '', updatedAt: new Date().toISOString() }];
    }
    return d._memoPages;
  }
  function save(){ window.save(); }

  // ===== State =====
  var currentPageIdx = 0;

  // ===== Update label =====
  function updateLabel(){
    var label = document.getElementById('rwLabel');
    if(!label) return;
    // First try to read directly from the DOM title input (source of truth for what user sees)
    var ti = document.querySelector('.rw-memo-title');
    if(ti && ti.value.trim()){
      label.textContent = ti.value.trim();
      return;
    }
    // Fallback: read from data
    var pages = getPages();
    if(pages.length === 0){ label.textContent = '0 页'; return; }
    var page = pages[currentPageIdx] || pages[0];
    var title = (page.title || '').trim();
    if(title){
      label.textContent = title;
    } else {
      label.textContent = (currentPageIdx + 1) + ' / ' + pages.length + ' 页';
    }
  }

  // ===== Render =====
  function render(){
    var content = document.getElementById('rwContent');
    if(!content) return;

    var pages = getPages();
    if(currentPageIdx >= pages.length) currentPageIdx = Math.max(0, pages.length - 1);
    if(currentPageIdx < 0) currentPageIdx = 0;

    updateLabel();

    content.innerHTML = '';

    if(pages.length === 0){
      content.innerHTML = '<div class="rw-empty">暂无页面，点击「+ 新建页」创建</div>';
      return;
    }

    var page = pages[currentPageIdx];

    // Title input
    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'rw-memo-title';
    titleInput.placeholder = '页面标题（可选）...';
    titleInput.value = page.title || '';
    titleInput.addEventListener('input', function(){
      getPages()[currentPageIdx].title = titleInput.value;
      getPages()[currentPageIdx].updatedAt = new Date().toISOString();
      save();
      updateLabel();
    });
    content.appendChild(titleInput);

    // Content textarea
    var textarea = document.createElement('textarea');
    textarea.className = 'rw-memo-content';
    textarea.placeholder = '在此记录你的想法、笔记、备忘...';
    textarea.value = page.content || '';
    textarea.addEventListener('input', function(){
      getPages()[currentPageIdx].content = textarea.value;
      getPages()[currentPageIdx].updatedAt = new Date().toISOString();
      save();
    });
    content.appendChild(textarea);
  }

  // ===== Actions =====
  function addPage(){
    var pages = getPages();
    pages.push({ id: 'm' + Date.now() + Math.random().toString(36).slice(2,6), title: '', content: '', updatedAt: new Date().toISOString() });
    currentPageIdx = pages.length - 1;
    save();
    render();
    // Focus the title
    setTimeout(function(){
      var title = document.querySelector('.rw-memo-title');
      if(title) title.focus();
    }, 100);
  }

  function deletePage(){
    var pages = getPages();
    if(pages.length <= 1){
      // Clear instead of delete the last page
      pages[0] = { id: 'm' + Date.now() + Math.random().toString(36).slice(2,6), title: '', content: '', updatedAt: new Date().toISOString() };
      currentPageIdx = 0;
      save();
      render();
      return;
    }
    if(!confirm('确认删除当前页面？')) return;
    pages.splice(currentPageIdx, 1);
    if(currentPageIdx >= pages.length) currentPageIdx = pages.length - 1;
    save();
    render();
  }

  function goPrev(){
    var pages = getPages();
    if(pages.length === 0) return;
    currentPageIdx = (currentPageIdx - 1 + pages.length) % pages.length;
    render();
  }

  function goNext(){
    var pages = getPages();
    if(pages.length === 0) return;
    currentPageIdx = (currentPageIdx + 1) % pages.length;
    render();
  }

  function goToPage(idx){
    currentPageIdx = idx;
    render();
  }

  // ===== Modal =====
  function show(){
    currentPageIdx = 0;
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

  // ===== Build toolbar buttons =====
  function buildToolbar(){
    var tb = document.getElementById('rwToolbar');
    if(!tb) return;

    // Navigation
    var prev = document.createElement('span');
    prev.className = 'rw-nav'; prev.id = 'rwPrev';
    prev.textContent = '◀';
    tb.appendChild(prev);

    var label = document.createElement('span');
    label.className = 'rw-label'; label.id = 'rwLabel';
    label.textContent = '0 页';
    tb.appendChild(label);

    var next = document.createElement('span');
    next.className = 'rw-nav'; next.id = 'rwNext';
    next.textContent = '▶';
    tb.appendChild(next);

    // Actions
    var actions = document.createElement('div');
    actions.className = 'rw-memo-actions';

    var saveBtn = document.createElement('button');
    saveBtn.className = 'rw-btn primary';
    saveBtn.id = 'rwSaveBtn';
    saveBtn.textContent = '💾 保存';
    actions.appendChild(saveBtn);

    var addBtn = document.createElement('button');
    addBtn.className = 'rw-btn';
    addBtn.id = 'rwAddPage';
    addBtn.textContent = '+ 新建页';
    actions.appendChild(addBtn);

    var delBtn = document.createElement('button');
    delBtn.className = 'rw-btn danger';
    delBtn.id = 'rwDelPage';
    delBtn.textContent = '🗑 删除页';
    actions.appendChild(delBtn);

    tb.appendChild(actions);
  }

  // ===== Init =====
  function init(){
    // Build toolbar buttons (the HTML has empty rwToolbar)
    buildToolbar();

    document.getElementById('reviewBtn').addEventListener('click', toggle);
    document.getElementById('rwClose').addEventListener('click', hide);
    document.getElementById('rwOverlay').addEventListener('click', hide);

    document.getElementById('rwPrev').addEventListener('click', goPrev);
    document.getElementById('rwNext').addEventListener('click', goNext);

    document.getElementById('rwAddPage').addEventListener('click', addPage);
    document.getElementById('rwDelPage').addEventListener('click', deletePage);

    document.getElementById('rwSaveBtn').addEventListener('click', function(){
      if(typeof window.save === 'function') {
        try { window.save(); showToast('💾 记录本已保存'); }
        catch(e) { showToast('⚠️ 保存失败: ' + (e.message||e)); }
      } else { showToast('⚠️ 保存失败: save 函数不可用'); }
    });

    // Escape key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        var modal = document.getElementById('rwModal');
        if(modal && modal.classList.contains('s')) hide();
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  console.log('feature-weekly-review: loaded (memo mode)');
})();
