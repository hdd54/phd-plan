// ===== FEATURE: Unified Housing (Loan + Cost + House List) =====
(function(){
  if(window.__features['housing-all']) return;
  window.__features['housing-all'] = true;

  var OVERLAY_ID = 'housingOverlay';
  var MODAL_ID = 'housingModal';
  var STORAGE_KEY = '_housingAll';
  var LIST_KEY = '_houseList';

  // ===== Shared helpers =====
  function fmtWan(n){ return (n||0).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g,',')+' 万'; }
  function fmtYuan(n){ return (n||0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,',')+' 元'; }
  function fmtYM(n){ return (n||0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,',')+' 元/月'; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]}) }

  // ===== Loan calculation (等额本息) =====
  function calcLoan(amtWan, ratePct, years){
    var P = amtWan * 10000;
    var r = ratePct / 100 / 12;
    var n = years * 12;
    var monthly;
    if(r === 0 || !isFinite(r)){ monthly = P / n; }
    else { monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1); }
    var totalPay = monthly * n;
    var totalInt = totalPay - P;
    return { monthly: monthly, totalPay: totalPay, totalInt: totalInt };
  }

  // ===== Tab switching =====
  var activeTab = 'loan';
  function switchTab(tabId){
    activeTab = tabId;
    document.querySelectorAll('.ha-tab').forEach(function(t){
      t.classList.toggle('active', t.dataset.tab === tabId);
    });
    document.querySelectorAll('.ha-panel').forEach(function(p){
      p.classList.toggle('active', p.id === 'hp-' + tabId);
    });
    // Re-run calculations when switching to certain tabs
    if(tabId === 'loan') calcLoanTab();
    if(tabId === 'cost') calcCostTab();
    if(tabId === 'list') renderHouseList();
  }

  // ===== Tab 1: Loan Plan =====
  function calcLoanTab(){
    var price = parseFloat(document.getElementById('haPrice').value) || 0;
    var downPct = parseInt(document.getElementById('haDownPct').value) || 30;
    var loanYears = parseInt(document.getElementById('haLoanYears').value) || 25;

    var loanTotal = price * (100 - downPct) / 100;
    var downAmt = price - loanTotal;

    document.getElementById('haDownAmt').textContent = fmtWan(downAmt);
    document.getElementById('haLoanTotal').textContent = loanTotal > 0 ? fmtWan(loanTotal) : '—';

    // Fund loan
    var fundAmt = parseFloat(document.getElementById('haFundAmt').value) || 0;
    var fundRate = parseFloat(document.getElementById('haFundRate').value) || 3.1;
    var fundYears = parseInt(document.getElementById('haFundYears').value) || loanYears;

    // Commercial loan
    var comAmt = parseFloat(document.getElementById('haComAmt').value) || 0;
    var comRate = parseFloat(document.getElementById('haComRate').value) || 3.5;
    var comYears = parseInt(document.getElementById('haComYears').value) || loanYears;

    // Show split warning if sum != loan total
    var splitTotal = fundAmt + comAmt;
    var warnEl = document.getElementById('haSplitWarn');
    if(loanTotal > 0 && Math.abs(splitTotal - loanTotal) > 0.01){
      warnEl.style.display = 'block';
      warnEl.textContent = '⚠️ 公积金+' + comAmt.toFixed(1) + ' 商业 ≠ ' + loanTotal.toFixed(1) + ' 万贷款总额，差额 ' + Math.abs(splitTotal - loanTotal).toFixed(1) + ' 万';
    } else {
      warnEl.style.display = 'none';
    }

    // Calcs
    var fR = fundAmt > 0 ? calcLoan(fundAmt, fundRate, fundYears) : { monthly:0, totalPay:0, totalInt:0 };
    var cR = comAmt > 0 ? calcLoan(comAmt, comRate, comYears) : { monthly:0, totalPay:0, totalInt:0 };

    // Fund results
    document.getElementById('haFundMonthly').textContent = fundAmt > 0 ? fmtYM(fR.monthly) : '—';
    document.getElementById('haFundInt').textContent = fundAmt > 0 ? fmtWan(fR.totalInt/10000) : '—';
    document.getElementById('haFundTotal').textContent = fundAmt > 0 ? fmtWan(fR.totalPay/10000) : '—';

    // Commercial results
    document.getElementById('haComMonthly').textContent = comAmt > 0 ? fmtYM(cR.monthly) : '—';
    document.getElementById('haComInt').textContent = comAmt > 0 ? fmtWan(cR.totalInt/10000) : '—';
    document.getElementById('haComTotal').textContent = comAmt > 0 ? fmtWan(cR.totalPay/10000) : '—';

    // Combined
    var totalMonthly = fR.monthly + cR.monthly;
    var totalInt = fR.totalInt + cR.totalInt;
    var totalPay = fR.totalPay + cR.totalPay;
    document.getElementById('haTotalMonthly').textContent = fmtYM(totalMonthly);
    document.getElementById('haTotalInt').textContent = fmtWan(totalInt/10000);
    document.getElementById('haTotalPay').textContent = fmtWan(totalPay/10000);

    // Store for cost tab
    window._haMortgageResult = { monthly: totalMonthly };
  }

  function saveLoanInputs(){
    try {
      var d = {
        price: document.getElementById('haPrice').value,
        downPct: document.getElementById('haDownPct').value,
        loanYears: document.getElementById('haLoanYears').value,
        fundAmt: document.getElementById('haFundAmt').value,
        fundRate: document.getElementById('haFundRate').value,
        fundYears: document.getElementById('haFundYears').value,
        comAmt: document.getElementById('haComAmt').value,
        comRate: document.getElementById('haComRate').value,
        comYears: document.getElementById('haComYears').value
      };
      var full = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      full.loan = d;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch(e){}
  }

  function loadLoanInputs(){
    try {
      var full = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(!full || !full.loan) return;
      var d = full.loan;
      if(d.price !== undefined) document.getElementById('haPrice').value = d.price;
      if(d.downPct) document.getElementById('haDownPct').value = d.downPct;
      if(d.loanYears) document.getElementById('haLoanYears').value = d.loanYears;
      if(d.fundAmt !== undefined) document.getElementById('haFundAmt').value = d.fundAmt;
      if(d.fundRate) document.getElementById('haFundRate').value = d.fundRate;
      if(d.fundYears) document.getElementById('haFundYears').value = d.fundYears;
      if(d.comAmt !== undefined) document.getElementById('haComAmt').value = d.comAmt;
      if(d.comRate) document.getElementById('haComRate').value = d.comRate;
      if(d.comYears) document.getElementById('haComYears').value = d.comYears;
    } catch(e){}
  }

  function wireLoanInputs(){
    var ids = ['haPrice','haDownPct','haLoanYears','haFundAmt','haFundRate','haFundYears','haComAmt','haComRate','haComYears'];
    ids.forEach(function(id){
      var el = document.getElementById(id);
      if(el){
        el.addEventListener('input', function(){ calcLoanTab(); saveLoanInputs(); });
        el.addEventListener('change', function(){ calcLoanTab(); saveLoanInputs(); });
      }
    });
    // Also auto-split slider logic: when price/down changes, auto-set fund+com to match
    document.getElementById('haPrice').addEventListener('input', autoSplitLoan);
    document.getElementById('haDownPct').addEventListener('change', autoSplitLoan);
  }

  function autoSplitLoan(){
    var price = parseFloat(document.getElementById('haPrice').value) || 0;
    var downPct = parseInt(document.getElementById('haDownPct').value) || 30;
    if(price <= 0) return;
    var loanTotal = price * (100 - downPct) / 100;
    // Only auto-fill if both fields are empty or zero
    var curFund = parseFloat(document.getElementById('haFundAmt').value) || 0;
    var curCom = parseFloat(document.getElementById('haComAmt').value) || 0;
    if(curFund === 0 && curCom === 0 && loanTotal > 0){
      // Default: 60%公积金 40%商贷
      document.getElementById('haFundAmt').value = Math.round(loanTotal * 0.6 * 10) / 10;
      document.getElementById('haComAmt').value = Math.round(loanTotal * 0.4 * 10) / 10;
    }
  }

  // ===== Tab 2: Cost Summary =====
  function calcCostTab(){
    var tax = parseFloat(document.getElementById('haTax').value) || 0;
    var renovation = parseFloat(document.getElementById('haRenov').value) || 0;
    var propertyFee = parseFloat(document.getElementById('haPropFee').value) || 0;
    var other = parseFloat(document.getElementById('haOther').value) || 0;
    var price = parseFloat(document.getElementById('haPrice').value) || 0;

    var totalBudget = price + tax + renovation + other;
    var mtgResult = window._haMortgageResult || { monthly: 0 };
    var monthlyTotal = mtgResult.monthly + propertyFee;

    document.getElementById('haTotalBudget').textContent = fmtWan(totalBudget);
    document.getElementById('haMonthlyMtg').textContent = fmtYM(mtgResult.monthly);
    document.getElementById('haMonthlyProp').textContent = fmtYM(propertyFee);
    document.getElementById('haMonthlyTotal').textContent = fmtYM(monthlyTotal);
  }

  function saveCostInputs(){
    try {
      var d = {
        tax: document.getElementById('haTax').value,
        renov: document.getElementById('haRenov').value,
        propFee: document.getElementById('haPropFee').value,
        other: document.getElementById('haOther').value
      };
      var full = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      full.cost = d;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch(e){}
  }

  function loadCostInputs(){
    try {
      var full = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if(!full || !full.cost) return;
      var d = full.cost;
      if(d.tax !== undefined) document.getElementById('haTax').value = d.tax;
      if(d.renov !== undefined) document.getElementById('haRenov').value = d.renov;
      if(d.propFee !== undefined) document.getElementById('haPropFee').value = d.propFee;
      if(d.other !== undefined) document.getElementById('haOther').value = d.other;
    } catch(e){}
  }

  function wireCostInputs(){
    var ids = ['haTax','haRenov','haPropFee','haOther'];
    ids.forEach(function(id){
      var el = document.getElementById(id);
      if(el){
        el.addEventListener('input', function(){ calcCostTab(); saveCostInputs(); });
      }
    });
  }

  // ===== Tab 3: House List (from feature-houselist.js) =====
  var STATUS_KEYS = ['pending','visited','rejected','interested'];
  var STATUS_LABELS = { pending:'待看', visited:'已看', rejected:'排除', interested:'有意' };
  var editingId = null;

  function getList(){
    try { var d = JSON.parse(localStorage.getItem(LIST_KEY)); return Array.isArray(d) ? d : []; }
    catch(e){ return []; }
  }
  function saveList(arr){
    try { localStorage.setItem(LIST_KEY, JSON.stringify(arr)); } catch(e){}
  }
  function renderStars(score){
    var s = '';
    for(var i=0;i<5;i++) s += i < score ? '★' : '☆';
    return s;
  }
  function getStatusIndex(key){
    for(var i=0;i<STATUS_KEYS.length;i++){ if(STATUS_KEYS[i]===key) return i; }
    return 0;
  }

  function renderHouseList(){
    var list = getList();
    var sortBy = document.getElementById('haSort').value;
    var container = document.getElementById('haHouseList');

    var sorted = list.slice();
    if(sortBy==='price-desc') sorted.sort(function(a,b){ return (b.price||0) - (a.price||0); });
    else if(sortBy==='price-asc') sorted.sort(function(a,b){ return (a.price||0) - (b.price||0); });
    else if(sortBy==='area-desc') sorted.sort(function(a,b){ return (b.area||0) - (a.area||0); });
    else if(sortBy==='area-asc') sorted.sort(function(a,b){ return (a.area||0) - (b.area||0); });
    else if(sortBy==='score-desc') sorted.sort(function(a,b){ return (b.score||0) - (a.score||0); });
    else if(sortBy==='score-asc') sorted.sort(function(a,b){ return (a.score||0) - (b.score||0); });

    var html = '';
    sorted.forEach(function(h){
      var si = getStatusIndex(h.status);
      html += '<div class="ha-hcard">' +
        '<div class="hc-hdr"><span class="hc-name">' + esc(h.name) + '</span><span class="hc-status s' + si + '">' + esc(STATUS_LABELS[h.status]||'待看') + '</span></div>' +
        '<div class="hc-info"><span>' + (h.price||0) + '万</span><span>' + (h.area||0) + '㎡</span><span>' + esc(h.layout||'') + '</span><span>' + esc(h.floor||'') + '</span><span>' + esc(h.orientation||'') + '</span></div>' +
        '<div class="hc-stars">' + renderStars(h.score||3) + '</div>' +
        (h.pros ? '<div class="hc-pros">✅ ' + esc(h.pros) + '</div>' : '') +
        (h.cons ? '<div class="hc-cons">⚠️ ' + esc(h.cons) + '</div>' : '') +
        '<div class="hc-actions"><button class="ha-edit-btn" data-id="' + h.id + '">编辑</button><button class="ha-del-btn" data-id="' + h.id + '">删除</button></div>' +
        '</div>';
    });
    if(sorted.length === 0){
      html = '<div style="text-align:center;padding:.8rem;color:var(--muted);font-size:.55rem">暂无房源，点击上方按钮添加</div>';
    }
    container.innerHTML = html;

    // Wire events
    container.querySelectorAll('.ha-edit-btn').forEach(function(btn){
      btn.addEventListener('click', function(){ editHouse(parseInt(this.dataset.id)); });
    });
    container.querySelectorAll('.ha-del-btn').forEach(function(btn){
      btn.addEventListener('click', function(){ deleteHouse(parseInt(this.dataset.id)); });
    });
  }

  function showHouseForm(data){
    document.getElementById('haListWrap').style.display = 'none';
    document.getElementById('haFormWrap').style.display = 'block';
    document.getElementById('haFormTitle').textContent = data ? '编辑房源' : '添加房源';

    if(data){
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
      ['hfName','hfAddr','hfPrice','hfArea','hfLayout','hfFloor','hfOrient','hfYear','hfPros','hfCons'].forEach(function(id){
        document.getElementById(id).value = '';
      });
      document.getElementById('hfScore').value = '3';
      document.getElementById('hfStatus').value = 'pending';
    }
  }

  function hideHouseForm(){
    document.getElementById('haListWrap').style.display = '';
    document.getElementById('haFormWrap').style.display = 'none';
    editingId = null;
    renderHouseList();
  }

  function saveHouseForm(){
    var name = document.getElementById('hfName').value.trim();
    if(!name){ showToast('⚠️ 请输入房源名称'); return; }
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
    if(editingId){
      for(var i=0;i<list.length;i++){ if(list[i].id===editingId){ obj.id=editingId; list[i]=obj; break; } }
      showToast('✅ 已更新');
    } else {
      obj.id = Date.now();
      list.push(obj);
      showToast('✅ 已添加');
    }
    saveList(list);
    hideHouseForm();
  }

  function editHouse(id){
    var list = getList();
    for(var i=0;i<list.length;i++){ if(list[i].id===id){ showHouseForm(list[i]); return; } }
  }
  function deleteHouse(id){
    if(!confirm('确定删除这个房源吗？')) return;
    var list = getList();
    for(var i=0;i<list.length;i++){ if(list[i].id===id){ list.splice(i,1); break; } }
    saveList(list);
    renderHouseList();
    showToast('✅ 已删除');
  }

  function wireHouseEvents(){
    document.getElementById('haSort').addEventListener('change', renderHouseList);
    document.getElementById('haAddBtn').addEventListener('click', function(){ showHouseForm(null); });
    document.getElementById('haSaveBtn').addEventListener('click', saveHouseForm);
    document.getElementById('haCancelBtn').addEventListener('click', hideHouseForm);
  }

  // ===== CSS =====
  var style = document.createElement('style');
  style.textContent = [
    // Tab bar
    '.ha-tabs{display:flex;gap:.15rem;margin-bottom:.3rem;border-bottom:1px solid var(--line);padding-bottom:.1rem}',
    '.ha-tab{padding:.2rem .5rem;border:1px solid transparent;border-radius:6px 6px 0 0;background:transparent;color:var(--muted);font-size:.58rem;font-family:var(--font-sans);cursor:pointer;transition:all .2s;white-space:nowrap}',
    '.ha-tab:hover{color:var(--fg);background:rgba(255,255,255,.03)}',
    '.ha-tab.active{border-color:var(--line);border-bottom-color:var(--bg);color:var(--accent);background:rgba(212,165,116,.06)}',
    '.ha-panel{display:none}',
    '.ha-panel.active{display:block}',

    // Loan tab
    '.ha-lsec{margin:.25rem 0 .15rem;font-size:.6rem;color:var(--accent);font-family:var(--font-serif);letter-spacing:.04em;border-bottom:1px solid var(--line);padding-bottom:.1rem}',
    '.ha-lrow{display:flex;align-items:center;gap:.3rem;margin-bottom:.2rem}',
    '.ha-lrow label{font-size:.5rem;color:var(--fg-dim);min-width:clamp(55px,6vw,72px);flex-shrink:0}',
    '.ha-lrow input,.ha-lrow select{flex:1;padding:.2rem .3rem;border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.03);color:var(--fg);font-size:.55rem;font-family:var(--font-sans);outline:none}',
    '.ha-lrow input:focus,.ha-lrow select:focus{border-color:var(--accent)}',
    '.ha-lrow .hu{font-size:.48rem;color:var(--muted);flex-shrink:0}',

    // Loan results grid
    '.ha-lres{display:grid;grid-template-columns:1fr 1fr;gap:.1rem .35rem;margin:.15rem 0 .25rem}',
    '.ha-lres .lr{display:flex;justify-content:space-between;font-size:.5rem;padding:.06rem .2rem;background:rgba(255,255,255,.02);border-radius:4px}',
    '.ha-lres .lr .lv{color:var(--fg)}',
    '.ha-lres .lr.lh{grid-column:1/-1;background:rgba(212,165,116,.06)}',
    '.ha-lres .lr.lh .lv{color:var(--accent)}',
    '.ha-lres .lr.lt{border-top:1px solid var(--line);margin-top:.05rem;padding-top:.1rem}',

    // Split loan grid (fund + com side by side)
    '.ha-split{display:grid;grid-template-columns:1fr 1fr;gap:.25rem}',
    '.ha-split .ha-sb{padding:.2rem;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02)}',
    '.ha-split .ha-sb h5{font-size:.55rem;color:var(--accent);margin:0 0 .1rem;letter-spacing:.04em}',
    '@media(max-width:550px){.ha-split{grid-template-columns:1fr}}',

    // Split warning
    '.ha-swarn{font-size:.5rem;color:var(--cinnabar);padding:.1rem .2rem;margin:.05rem 0;display:none}',

    // Cost tab
    '.ha-crow{display:flex;align-items:center;gap:.3rem;margin-bottom:.2rem}',
    '.ha-crow label{font-size:.5rem;color:var(--fg-dim);min-width:clamp(55px,6vw,72px);flex-shrink:0}',
    '.ha-crow input{flex:1;padding:.2rem .3rem;border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.03);color:var(--fg);font-size:.55rem;font-family:var(--font-sans);outline:none}',
    '.ha-crow input:focus{border-color:var(--accent)}',
    '.ha-crow .hu{font-size:.48rem;color:var(--muted);flex-shrink:0}',
    '.ha-sum{padding:.3rem;background:rgba(212,165,116,.05);border:1px solid rgba(212,165,116,.12);border-radius:8px;margin-top:.25rem}',
    '.ha-sum .sr{display:flex;justify-content:space-between;padding:.06rem 0;font-size:.55rem}',
    '.ha-sum .sr .sv{color:var(--fg)}',
    '.ha-sum .sr.highlight .sv{color:var(--accent);font-weight:400}',

    // House list tab (reused from original)
    '.ha-hlist{display:flex;flex-direction:column;gap:.25rem}',
    '.ha-hcard{padding:.3rem;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02)}',
    '.ha-hcard .hc-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:.08rem}',
    '.ha-hcard .hc-name{font-size:.6rem;color:var(--fg);font-weight:400}',
    '.ha-hcard .hc-status{font-size:.42rem;padding:.02rem .18rem;border-radius:4px}',
    '.ha-hcard .hc-status.s0{background:rgba(255,255,255,.05);color:var(--muted)}',
    '.ha-hcard .hc-status.s1{background:rgba(212,165,116,.15);color:var(--accent)}',
    '.ha-hcard .hc-status.s2{background:rgba(232,93,47,.12);color:var(--accent-2)}',
    '.ha-hcard .hc-status.s3{background:rgba(74,124,140,.15);color:var(--accent-3)}',
    '.ha-hcard .hc-info{display:flex;gap:.25rem;flex-wrap:wrap;font-size:.48rem;color:var(--fg-dim);margin-bottom:.06rem}',
    '.ha-hcard .hc-info span{white-space:nowrap}',
    '.ha-hcard .hc-pros{font-size:.48rem;color:var(--jade);margin-bottom:.03rem}',
    '.ha-hcard .hc-cons{font-size:.48rem;color:var(--cinnabar)}',
    '.ha-hcard .hc-stars{color:#c9a040;font-size:.48rem}',
    '.ha-hcard .hc-actions{display:flex;gap:.15rem;margin-top:.08rem}',
    '.ha-hcard .hc-actions button{font-size:.42rem;padding:.03rem .18rem;border:1px solid var(--line-2);border-radius:4px;background:transparent;color:var(--muted);cursor:pointer;font-family:var(--font-sans)}',
    '.ha-hcard .hc-actions button:hover{color:var(--accent);border-color:var(--accent)}',

    '.ha-hsort{display:flex;gap:.15rem;align-items:center;margin-bottom:.15rem}',
    '.ha-hsort select{padding:.08rem .18rem;border:1px solid var(--line-2);border-radius:4px;background:transparent;color:var(--fg-dim);font-size:.48rem;font-family:var(--font-sans);outline:none}',
    '.ha-hadd-btn{width:100%;padding:.25rem;border:1px dashed var(--line-2);border-radius:8px;background:transparent;color:var(--muted);font-family:var(--font-sans);font-size:.5rem;cursor:pointer;transition:all .2s}',
    '.ha-hadd-btn:hover{border-color:var(--accent);color:var(--accent)}',

    '.ha-hform{display:grid;grid-template-columns:1fr 1fr;gap:.15rem;margin:.2rem 0;padding:.25rem;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02)}',
    '.ha-hform .hf-f{display:flex;flex-direction:column;gap:.04rem}',
    '.ha-hform .hf-f.full{grid-column:span 2}',
    '.ha-hform label{font-size:.42rem;color:var(--muted)}',
    '.ha-hform input,.ha-hform textarea,.ha-hform select{padding:.15rem .25rem;border:1px solid var(--line-2);border-radius:4px;background:rgba(255,255,255,.03);color:var(--fg);font-size:.5rem;font-family:var(--font-sans);outline:none}',
    '.ha-hform input:focus,.ha-hform textarea:focus{border-color:var(--accent)}',
    '.ha-hform textarea{resize:vertical;min-height:1.8rem}'
  ].join('');
  document.head.appendChild(style);

  // ===== Create Modal HTML =====
  var div = document.createElement('div');
  div.innerHTML =
    '<div class="pomo-overlay" id="' + OVERLAY_ID + '"></div>' +
    '<div class="pomo-modal" id="' + MODAL_ID + '" style="width:clamp(380px,85vw,720px)">' +
      '<button class="pomo-close" id="housingClose">✕</button>' +
      '<div class="pomo-body" style="gap:.1rem">' +
        // Header
        '<div style="font-size:.8rem;margin:0 0 .15rem;font-family:var(--font-serif);letter-spacing:.04em;color:var(--accent)">🏠 购房综合</div>' +

        // Tab bar
        '<div class="ha-tabs">' +
          '<button class="ha-tab active" data-tab="loan">🏦 贷款方案</button>' +
          '<button class="ha-tab" data-tab="cost">📊 购房成本</button>' +
          '<button class="ha-tab" data-tab="list">📋 看房清单</button>' +
        '</div>' +

        // ======== TAB 1: 贷款方案 ========
        '<div class="ha-panel active" id="hp-loan">' +
          // 房屋信息
          '<div class="ha-lsec">房屋信息</div>' +
          '<div class="ha-lrow"><label>房价总额</label><input type="number" id="haPrice" placeholder="200" min="0" step="10"><span class="hu">万元</span></div>' +
          '<div class="ha-lrow"><label>首付比例</label><select id="haDownPct">' +
            '<option value="15">15%（首套）</option>' +
            '<option value="20">20%</option>' +
            '<option value="30" selected>30%</option>' +
            '<option value="40">40%</option>' +
            '<option value="50">50%</option>' +
          '</select></div>' +
          '<div class="ha-lrow"><label>贷款年限</label><select id="haLoanYears">' +
            '<option value="10">10年</option>' +
            '<option value="15">15年</option>' +
            '<option value="20">20年</option>' +
            '<option value="25" selected>25年</option>' +
            '<option value="30">30年</option>' +
          '</select></div>' +
          '<div style="display:flex;gap:.3rem;margin-bottom:.15rem;font-size:.5rem;color:var(--fg-dim)">' +
            '<span>首付：<strong id="haDownAmt" style="color:var(--fg)">0 万</strong></span>' +
            '<span>贷款总额：<strong id="haLoanTotal" style="color:var(--fg)">—</strong></span>' +
          '</div>' +

          // 贷款组合
          '<div class="ha-lsec">贷款组合</div>' +
          '<div class="ha-split">' +
            // 公积金
            '<div class="ha-sb">' +
              '<h5>🏦 公积金贷款</h5>' +
              '<div class="ha-lrow"><label>额度</label><input type="number" id="haFundAmt" placeholder="60" min="0" step="5"><span class="hu">万</span></div>' +
              '<div class="ha-lrow"><label>利率</label><input type="number" id="haFundRate" placeholder="3.1" min="0" max="20" step="0.05" value="3.1"><span class="hu">%</span></div>' +
              '<div class="ha-lrow"><label>年限</label><select id="haFundYears"><option value="10">10年</option><option value="15">15年</option><option value="20">20年</option><option value="25">25年</option><option value="30" selected>30年</option></select></div>' +
            '</div>' +
            // 商业
            '<div class="ha-sb">' +
              '<h5>🏛 商业贷款</h5>' +
              '<div class="ha-lrow"><label>额度</label><input type="number" id="haComAmt" placeholder="100" min="0" step="5"><span class="hu">万</span></div>' +
              '<div class="ha-lrow"><label>利率</label><input type="number" id="haComRate" placeholder="3.5" min="0" max="20" step="0.05" value="3.5"><span class="hu">%</span></div>' +
              '<div class="ha-lrow"><label>年限</label><select id="haComYears"><option value="10">10年</option><option value="15">15年</option><option value="20">20年</option><option value="25">25年</option><option value="30" selected>30年</option></select></div>' +
            '</div>' +
          '</div>' +
          '<div class="ha-swarn" id="haSplitWarn"></div>' +

          // Results
          '<div class="ha-lsec">还款计划</div>' +
          '<div class="ha-lres">' +
            '<div class="lr lh" style="grid-column:1/-1"><span>公积金贷款</span><span></span></div>' +
            '<div class="lr"><span>月供</span><span class="lv" id="haFundMonthly">—</span></div>' +
            '<div class="lr"><span>利息总额</span><span class="lv" id="haFundInt">—</span></div>' +
            '<div class="lr"><span>还款总额</span><span class="lv" id="haFundTotal">—</span></div>' +
            '<div class="lr lh" style="grid-column:1/-1"><span>商业贷款</span><span></span></div>' +
            '<div class="lr"><span>月供</span><span class="lv" id="haComMonthly">—</span></div>' +
            '<div class="lr"><span>利息总额</span><span class="lv" id="haComInt">—</span></div>' +
            '<div class="lr"><span>还款总额</span><span class="lv" id="haComTotal">—</span></div>' +
            '<div class="lr lt lh" style="grid-column:1/-1"><span>📊 合计</span><span></span></div>' +
            '<div class="lr lt"><span>合计月供</span><span class="lv" id="haTotalMonthly">—</span></div>' +
            '<div class="lr lt"><span>合计利息</span><span class="lv" id="haTotalInt">—</span></div>' +
            '<div class="lr lt"><span>合计还款</span><span class="lv" id="haTotalPay">—</span></div>' +
          '</div>' +
          '<div style="font-size:.45rem;color:var(--muted);margin-top:.05rem">基于等额本息，利率为参考值，以银行实际为准</div>' +
        '</div>' +

        // ======== TAB 2: 购房成本 ========
        '<div class="ha-panel" id="hp-cost">' +
          '<div class="ha-lsec">其他成本</div>' +
          '<div class="ha-crow"><label>税费估算</label><input type="number" id="haTax" placeholder="0" min="0" step="0.1"><span class="hu">万元</span></div>' +
          '<div class="ha-crow"><label>装修预算</label><input type="number" id="haRenov" placeholder="0" min="0" step="0.5"><span class="hu">万元</span></div>' +
          '<div class="ha-crow"><label>物业费</label><input type="number" id="haPropFee" placeholder="0" min="0" step="10"><span class="hu">元/月</span></div>' +
          '<div class="ha-crow"><label>其他费用</label><input type="number" id="haOther" placeholder="0" min="0" step="0.5"><span class="hu">万元</span></div>' +

          '<div class="ha-lsec">汇总</div>' +
          '<div class="ha-sum">' +
            '<div class="sr highlight"><span>总预算（含房价+税费+装修等）</span><span class="sv" id="haTotalBudget">0 万</span></div>' +
            '<div class="sr"><span>— 月供（贷款）</span><span class="sv" id="haMonthlyMtg">0 元/月</span></div>' +
            '<div class="sr"><span>— 物业费</span><span class="sv" id="haMonthlyProp">0 元/月</span></div>' +
            '<div class="sr highlight"><span>月固定支出</span><span class="sv" id="haMonthlyTotal">0 元/月</span></div>' +
          '</div>' +
          '<div style="font-size:.45rem;color:var(--muted);margin-top:.1rem">自动引用贷款方案的合计月供数据</div>' +
        '</div>' +

        // ======== TAB 3: 看房清单 ========
        '<div class="ha-panel" id="hp-list">' +
          '<div class="ha-hsort">' +
            '<select id="haSort" style="flex:1">' +
              '<option value="default">默认排序</option>' +
              '<option value="price-desc">价格 ↓</option>' +
              '<option value="price-asc">价格 ↑</option>' +
              '<option value="area-desc">面积 ↓</option>' +
              '<option value="area-asc">面积 ↑</option>' +
              '<option value="score-desc">评分 ↓</option>' +
              '<option value="score-asc">评分 ↑</option>' +
            '</select>' +
          '</div>' +
          '<button id="haAddBtn" class="ha-hadd-btn">+ 添加房源</button>' +
          '<div id="haListWrap"><div id="haHouseList" class="ha-hlist"></div></div>' +
          '<div id="haFormWrap" style="display:none">' +
            '<div style="font-size:.55rem;color:var(--accent);margin-bottom:.1rem"><span id="haFormTitle">添加房源</span></div>' +
            '<div class="ha-hform">' +
              '<div class="hf-f full"><label>名称</label><input type="text" id="hfName" placeholder="小区名/楼盘名"></div>' +
              '<div class="hf-f full"><label>地址</label><input type="text" id="hfAddr" placeholder="地址"></div>' +
              '<div class="hf-f"><label>价格（万）</label><input type="number" id="hfPrice" placeholder="0" min="0"></div>' +
              '<div class="hf-f"><label>面积（㎡）</label><input type="number" id="hfArea" placeholder="0" min="0" step="0.1"></div>' +
              '<div class="hf-f"><label>户型</label><input type="text" id="hfLayout" placeholder="如 3室2厅"></div>' +
              '<div class="hf-f"><label>楼层</label><input type="text" id="hfFloor" placeholder="中层/10"></div>' +
              '<div class="hf-f"><label>朝向</label><input type="text" id="hfOrient" placeholder="南北通透"></div>' +
              '<div class="hf-f"><label>年份</label><input type="number" id="hfYear" placeholder="2020" min="1900" max="2100"></div>' +
              '<div class="hf-f"><label>评分</label><select id="hfScore"><option value="1">1 ★</option><option value="2">2 ★★</option><option value="3" selected>3 ★★★</option><option value="4">4 ★★★★</option><option value="5">5 ★★★★★</option></select></div>' +
              '<div class="hf-f"><label>状态</label><select id="hfStatus"><option value="pending">待看</option><option value="visited">已看</option><option value="rejected">排除</option><option value="interested">有意</option></select></div>' +
              '<div class="hf-f full"><label>优点</label><textarea id="hfPros" placeholder="优点" rows="2"></textarea></div>' +
              '<div class="hf-f full"><label>缺点</label><textarea id="hfCons" placeholder="缺点" rows="2"></textarea></div>' +
              '<div class="hf-f full" style="display:flex;gap:.15rem;margin-top:.08rem">' +
                '<button id="haSaveBtn" style="flex:1;padding:.2rem;border:1px solid var(--accent);border-radius:6px;background:rgba(212,165,116,.1);color:var(--accent);cursor:pointer;font-family:var(--font-sans);font-size:.5rem">保存</button>' +
                '<button id="haCancelBtn" style="flex:1;padding:.2rem;border:1px solid var(--line-2);border-radius:6px;background:transparent;color:var(--muted);cursor:pointer;font-family:var(--font-sans);font-size:.5rem">取消</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(div);

  // ===== Wire tab switching =====
  document.querySelectorAll('.ha-tab').forEach(function(tab){
    tab.addEventListener('click', function(){ switchTab(this.dataset.tab); });
  });

  // ===== Wire loan inputs =====
  wireLoanInputs();

  // ===== Wire cost inputs =====
  wireCostInputs();

  // ===== Wire house list events =====
  wireHouseEvents();

  // ===== Open / Close =====
  function openModal(){
    loadLoanInputs();
    loadCostInputs();
    switchTab('loan'); // default to loan tab
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
    setTimeout(function(){ calcLoanTab(); calcCostTab(); }, 50);
  }

  function closeModal(){
    saveLoanInputs();
    saveCostInputs();
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('housingClose').addEventListener('click', closeModal);

  // ===== Wire sidebar button =====
  var btn = document.getElementById('housingBtn');
  if(btn) btn.addEventListener('click', openModal);
})();
