// ===== FEATURE: House Hunting Checklist =====
(function(){
  if(window.__features['houselist']) return;
  window.__features['houselist'] = true;

  var OVERLAY_ID = 'houseOverlay';
  var MODAL_ID = 'houseModal';
  var STORAGE_KEY = '_houseList';
  var editingId = null;

  var STATUS_KEYS = ['pending','visited','rejected','interested'];
  var STATUS_LABELS = { pending: '\u5F85\u770B', visited: '\u5DF2\u770B', rejected: '\u6392\u9664', interested: '\u6709\u610F' };

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = [
    '.hl-list{display:flex;flex-direction:column;gap:.3rem}',
    '.hl-card{padding:.35rem;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02)}',
    '.hl-card .hc-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:.1rem}',
    '.hl-card .hc-name{font-size:.65rem;color:var(--fg);font-weight:400}',
    '.hl-card .hc-status{font-size:.45rem;padding:.02rem .2rem;border-radius:4px}',
    '.hl-card .hc-status.s0{background:rgba(255,255,255,.05);color:var(--muted)}',
    '.hl-card .hc-status.s1{background:rgba(212,165,116,.15);color:var(--accent)}',
    '.hl-card .hc-status.s2{background:rgba(232,93,47,.12);color:var(--accent-2)}',
    '.hl-card .hc-status.s3{background:rgba(74,124,140,.15);color:var(--accent-3)}',
    '.hl-card .hc-info{display:flex;gap:.3rem;flex-wrap:wrap;font-size:.5rem;color:var(--fg-dim);margin-bottom:.08rem}',
    '.hl-card .hc-info span{white-space:nowrap}',
    '.hl-card .hc-pros{font-size:.5rem;color:var(--jade);margin-bottom:.04rem}',
    '.hl-card .hc-cons{font-size:.5rem;color:var(--cinnabar)}',
    '.hl-card .hc-actions{display:flex;gap:.2rem;margin-top:.1rem}',
    '.hl-card .hc-actions button{font-size:.45rem;padding:.04rem .2rem;border:1px solid var(--line-2);border-radius:4px;background:transparent;color:var(--muted);cursor:pointer;font-family:var(--font-sans)}',
    '.hl-card .hc-actions button:hover{color:var(--accent);border-color:var(--accent)}',
    '.hl-card .hc-stars{color:#c9a040;font-size:.5rem}',
    '.hl-form{display:grid;grid-template-columns:1fr 1fr;gap:.2rem;margin:.3rem 0;padding:.3rem;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02)}',
    '.hl-form .hf-f{display:flex;flex-direction:column;gap:.05rem}',
    '.hl-form .hf-f.full{grid-column:span 2}',
    '.hl-form label{font-size:.45rem;color:var(--muted)}',
    '.hl-form input,.hl-form textarea,.hl-form select{padding:.2rem .3rem;border:1px solid var(--line-2);border-radius:4px;background:rgba(255,255,255,.03);color:var(--fg);font-size:.55rem;font-family:var(--font-sans);outline:none}',
    '.hl-form input:focus,.hl-form textarea:focus{border-color:var(--accent)}',
    '.hl-form textarea{resize:vertical;min-height:2rem}',
    '.hl-sort{display:flex;gap:.2rem;align-items:center;margin-bottom:.2rem}',
    '.hl-sort select{padding:.1rem .2rem;border:1px solid var(--line-2);border-radius:4px;background:transparent;color:var(--fg-dim);font-size:.5rem;font-family:var(--font-sans);outline:none}',
    '.hl-add-btn{width:100%;padding:.3rem;border:1px dashed var(--line-2);border-radius:8px;background:transparent;color:var(--muted);font-family:var(--font-sans);font-size:.55rem;cursor:pointer;transition:all .2s}',
    '.hl-add-btn:hover{border-color:var(--accent);color:var(--accent)}'
  ].join('');
  document.head.appendChild(style);

  // ===== Data helpers =====
  function getList() {
    try {
      var d = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(d) ? d : [];
    } catch(e) { return []; }
  }

  function saveList(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch(e) {}
  }

  function renderStars(score) {
    var s = '';
    for (var i = 0; i < 5; i++) {
      s += i < score ? '\u2605' : '\u2606';
    }
    return s;
  }

  function getStatusIndex(key) {
    for (var i = 0; i < STATUS_KEYS.length; i++) {
      if (STATUS_KEYS[i] === key) return i;
    }
    return 0;
  }

  // ===== Render list =====
  function renderList() {
    var list = getList();
    var sortBy = document.getElementById('hlSort').value;
    var container = document.getElementById('hlList');

    var sorted = list.slice();
    if (sortBy === 'price-desc') {
      sorted.sort(function(a,b){ return b.price - a.price; });
    } else if (sortBy === 'price-asc') {
      sorted.sort(function(a,b){ return a.price - b.price; });
    } else if (sortBy === 'area-desc') {
      sorted.sort(function(a,b){ return b.area - a.area; });
    } else if (sortBy === 'area-asc') {
      sorted.sort(function(a,b){ return a.area - b.area; });
    } else if (sortBy === 'score-desc') {
      sorted.sort(function(a,b){ return b.score - a.score; });
    } else if (sortBy === 'score-asc') {
      sorted.sort(function(a,b){ return a.score - b.score; });
    }

    var html = '';
    for (var i = 0; i < sorted.length; i++) {
      var h = sorted[i];
      var si = getStatusIndex(h.status);
      html += '<div class="hl-card">' +
        '<div class="hc-hdr">' +
          '<span class="hc-name">' + esc(h.name) + '</span>' +
          '<span class="hc-status s' + si + '">' + esc(STATUS_LABELS[h.status] || '\u5F85\u770B') + '</span>' +
        '</div>' +
        '<div class="hc-info">' +
          '<span>' + (h.price || 0) + '\u4E07</span>' +
          '<span>' + (h.area || 0) + '\u33A1</span>' +
          '<span>' + esc(h.layout || '') + '</span>' +
          '<span>' + esc(h.floor || '') + '</span>' +
          '<span>' + esc(h.orientation || '') + '</span>' +
        '</div>' +
        '<div class="hc-stars">' + renderStars(h.score || 3) + '</div>' +
        (h.pros ? '<div class="hc-pros">\u2705 ' + esc(h.pros) + '</div>' : '') +
        (h.cons ? '<div class="hc-cons">\u26A0\uFE0F ' + esc(h.cons) + '</div>' : '') +
        '<div class="hc-actions">' +
          '<button onclick="window.__editHouse(' + h.id + ')">\u7F16\u8F91</button>' +
          '<button onclick="window.__deleteHouse(' + h.id + ')">\u5220\u9664</button>' +
        '</div>' +
      '</div>';
    }
    if (sorted.length === 0) {
      html = '<div style="text-align:center;padding:.8rem;color:var(--muted);font-size:.55rem">\u6682\u65E0\u623F\u6E90\uFF0C\u70B9\u51FB\u4E0A\u65B9\u6309\u94AE\u6DFB\u52A0</div>';
    }
    container.innerHTML = html;
  }

  // ===== Form show/hide =====
  function showForm(data) {
    document.getElementById('hlListWrap').style.display = 'none';
    document.getElementById('hlFormWrap').style.display = 'block';
    document.getElementById('hlFormTitle').textContent = data ? '\u7F16\u8F91\u623F\u6E90' : '\u6DFB\u52A0\u623F\u6E90';

    if (data) {
      editingId = data.id;
      document.getElementById('hfName').value = data.name || '';
      document.getElementById('hfAddr').value = data.address || '';
      document.getElementById('hfPrice').value = data.price || '';
      document.getElementById('hfArea').value = data.area || '';
      document.getElementById('hfLayout').value = data.layout || '';
      document.getElementById('hfFloor').value = data.floor || '';
      document.getElementById('hfOrient').value = data.orientation || '';
      document.getElementById('hfYear').value = data.year || '';
      document.getElementById('hfPros').value = data.pros || '';
      document.getElementById('hfCons').value = data.cons || '';
      document.getElementById('hfScore').value = data.score || 3;
      document.getElementById('hfStatus').value = data.status || 'pending';
    } else {
      editingId = null;
      var ids = ['hfName','hfAddr','hfPrice','hfArea','hfLayout','hfFloor','hfOrient','hfYear','hfPros','hfCons'];
      for (var i = 0; i < ids.length; i++) { document.getElementById(ids[i]).value = ''; }
      document.getElementById('hfScore').value = '3';
      document.getElementById('hfStatus').value = 'pending';
    }
  }

  function hideForm() {
    document.getElementById('hlListWrap').style.display = '';
    document.getElementById('hlFormWrap').style.display = 'none';
    editingId = null;
    renderList();
  }

  function saveForm() {
    var name = document.getElementById('hfName').value.trim();
    if (!name) { showToast('\u26A0\uFE0F \u8BF7\u8F93\u5165\u623F\u6E90\u540D\u79F0'); return; }

    var obj = {
      name: name,
      address: document.getElementById('hfAddr').value.trim(),
      price: parseFloat(document.getElementById('hfPrice').value) || 0,
      area: parseFloat(document.getElementById('hfArea').value) || 0,
      layout: document.getElementById('hfLayout').value.trim(),
      floor: document.getElementById('hfFloor').value.trim(),
      orientation: document.getElementById('hfOrient').value.trim(),
      year: parseInt(document.getElementById('hfYear').value) || 0,
      pros: document.getElementById('hfPros').value.trim(),
      cons: document.getElementById('hfCons').value.trim(),
      score: parseInt(document.getElementById('hfScore').value) || 3,
      status: document.getElementById('hfStatus').value
    };

    var list = getList();
    if (editingId) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === editingId) {
          obj.id = editingId;
          list[i] = obj;
          break;
        }
      }
      showToast('\u2705 \u5DF2\u66F4\u65B0');
    } else {
      obj.id = Date.now();
      list.push(obj);
      showToast('\u2705 \u5DF2\u6DFB\u52A0');
    }
    saveList(list);
    hideForm();
  }

  window.__editHouse = function(id) {
    var list = getList();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { showForm(list[i]); return; }
    }
  };

  window.__deleteHouse = function(id) {
    if (!confirm('\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u623F\u6E90\u5417\uFF1F')) return;
    var list = getList();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
    saveList(list);
    renderList();
    showToast('\u2705 \u5DF2\u5220\u9664');
  };

  // ===== Open / Close =====
  function openModal() {
    hideForm();
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
  }

  function closeModal() {
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  // ===== Create modal HTML =====
  var div = document.createElement('div');
  div.innerHTML =
    '<div class="pomo-overlay" id="' + OVERLAY_ID + '"></div>' +
    '<div class="pomo-modal" id="' + MODAL_ID + '" style="width:clamp(360px,80vw,600px)">' +
      '<button class="pomo-close" id="hlClose">\u2715</button>' +
      '<div class="pomo-body" style="gap:.2rem">' +
        '<div style="font-size:.85rem;margin:.1rem 0 .25rem;font-family:var(--font-serif);letter-spacing:.04em;color:var(--accent)">\u8D2D\u623F\u6E05\u5355</div>' +
        '<div id="hlSortWrap" class="hl-sort">' +
          '<select id="hlSort" style="flex:1">' +
            '<option value="default">\u9ED8\u8BA4\u6392\u5E8F</option>' +
            '<option value="price-desc">\u4EF7\u683C \u2193</option>' +
            '<option value="price-asc">\u4EF7\u683C \u2191</option>' +
            '<option value="area-desc">\u9762\u79EF \u2193</option>' +
            '<option value="area-asc">\u9762\u79EF \u2191</option>' +
            '<option value="score-desc">\u8BC4\u5206 \u2193</option>' +
            '<option value="score-asc">\u8BC4\u5206 \u2191</option>' +
          '</select>' +
        '</div>' +
        '<button id="hlAddBtn" class="hl-add-btn">+ \u6DFB\u52A0\u623F\u6E90</button>' +
        '<div id="hlListWrap"><div id="hlList" class="hl-list"></div></div>' +
        '<div id="hlFormWrap" style="display:none">' +
          '<div style="font-size:.6rem;color:var(--accent);margin-bottom:.15rem"><span id="hlFormTitle">\u6DFB\u52A0\u623F\u6E90</span></div>' +
          '<div class="hl-form">' +
            '<div class="hf-f full"><label>\u540D\u79F0</label><input type="text" id="hfName" placeholder="\u5C0F\u533A\u540D/\u697C\u76D8\u540D"></div>' +
            '<div class="hf-f full"><label>\u5730\u5740</label><input type="text" id="hfAddr" placeholder="\u5730\u5740"></div>' +
            '<div class="hf-f"><label>\u4EF7\u683C\uFF08\u4E07\uFF09</label><input type="number" id="hfPrice" placeholder="0" min="0"></div>' +
            '<div class="hf-f"><label>\u9762\u79EF\uFF08\u33A1\uFF09</label><input type="number" id="hfArea" placeholder="0" min="0" step="0.1"></div>' +
            '<div class="hf-f"><label>\u6237\u578B</label><input type="text" id="hfLayout" placeholder="\u5982 3\u5BA42\u5385"></div>' +
            '<div class="hf-f"><label>\u697C\u5C42</label><input type="text" id="hfFloor" placeholder="\u4E2D\u5C42/10"></div>' +
            '<div class="hf-f"><label>\u671D\u5411</label><input type="text" id="hfOrient" placeholder="\u5357\u5317\u901A\u900F"></div>' +
            '<div class="hf-f"><label>\u5E74\u4EFD</label><input type="number" id="hfYear" placeholder="2020" min="1900" max="2100"></div>' +
            '<div class="hf-f"><label>\u8BC4\u5206</label><select id="hfScore">' +
              '<option value="1">1 \u2605</option>' +
              '<option value="2">2 \u2605\u2605</option>' +
              '<option value="3" selected>3 \u2605\u2605\u2605</option>' +
              '<option value="4">4 \u2605\u2605\u2605\u2605</option>' +
              '<option value="5">5 \u2605\u2605\u2605\u2605\u2605</option>' +
            '</select></div>' +
            '<div class="hf-f"><label>\u72B6\u6001</label><select id="hfStatus">' +
              '<option value="pending">\u5F85\u770B</option>' +
              '<option value="visited">\u5DF2\u770B</option>' +
              '<option value="rejected">\u6392\u9664</option>' +
              '<option value="interested">\u6709\u610F</option>' +
            '</select></div>' +
            '<div class="hf-f full"><label>\u4F18\u70B9</label><textarea id="hfPros" placeholder="\u4F18\u70B9" rows="2"></textarea></div>' +
            '<div class="hf-f full"><label>\u7F3A\u70B9</label><textarea id="hfCons" placeholder="\u7F3A\u70B9" rows="2"></textarea></div>' +
            '<div class="hf-f full" style="display:flex;gap:.2rem;margin-top:.1rem">' +
              '<button id="hlSaveBtn" style="flex:1;padding:.25rem;border:1px solid var(--accent);border-radius:6px;background:rgba(212,165,116,.1);color:var(--accent);cursor:pointer;font-family:var(--font-sans);font-size:.55rem">\u4FDD\u5B58</button>' +
              '<button id="hlCancelBtn" style="flex:1;padding:.25rem;border:1px solid var(--line-2);border-radius:6px;background:transparent;color:var(--muted);cursor:pointer;font-family:var(--font-sans);font-size:.55rem">\u53D6\u6D88</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(div);

  // ===== Wire events =====
  document.getElementById('hlSort').addEventListener('change', renderList);
  document.getElementById('hlAddBtn').addEventListener('click', function() { showForm(null); });
  document.getElementById('hlSaveBtn').addEventListener('click', saveForm);
  document.getElementById('hlCancelBtn').addEventListener('click', hideForm);
  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('hlClose').addEventListener('click', closeModal);

  // ===== Wire bottom bar button =====
  var btn = document.getElementById('houseBtn');
  if (btn) btn.addEventListener('click', openModal);
})();
