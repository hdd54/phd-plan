// ===== FEATURE: Mortgage Scheme Comparison =====
(function(){
  if(window.__features['mortgage-compare']) return;
  window.__features['mortgage-compare'] = true;

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = `
    .mc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998;display:none}
    .mc-overlay.s{display:block}
    .mc-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(95vw,760px);max-height:88vh;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);z-index:9999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6)}
    .mc-modal.s{display:flex}
    .mc-header{display:flex;align-items:center;justify-content:space-between;padding:clamp(.5rem,.8vw,.7rem) clamp(.6rem,1vw,.9rem);border-bottom:1px solid var(--line)}
    .mc-header h3{font-family:var(--font-serif);font-size:clamp(.75rem,1.2vw,.95rem);font-weight:600;color:var(--fg)}
    .mc-close{background:none;border:none;color:var(--muted);font-size:clamp(.8rem,1.1vw,1rem);cursor:pointer;padding:.1rem .25rem}
    .mc-close:hover{color:var(--accent)}
    .mc-body{padding:clamp(.4rem,.7vw,.7rem);overflow-y:auto;flex:1}
    .mc-toolbar{margin-bottom:.5rem}
    .mc-add-btn{background:rgba(212,165,116,.12);border:1px dashed var(--accent);color:var(--accent);padding:clamp(.25rem,.4vw,.35rem) clamp(.4rem,.6vw,.6rem);border-radius:var(--rs);cursor:pointer;font-family:var(--font-sans);font-size:clamp(.5rem,.8vw,.6rem);transition:all .2s}
    .mc-add-btn:hover{background:rgba(212,165,116,.2)}

    /* Scenario card */
    .mc-scenario{background:var(--card);border:1px solid var(--line);border-radius:var(--rs);margin-bottom:.5rem;padding:clamp(.35rem,.55vw,.5rem)}
    .mc-scenario-header{display:flex;align-items:center;justify-content:space-between;gap:.3rem;margin-bottom:.35rem}
    .mc-scenario-title{flex:1;font-family:var(--font-sans);font-size:clamp(.6rem,.9vw,.7rem);font-weight:600;color:var(--fg);background:none;border:none;outline:none;padding:0;width:100%}
    .mc-scenario-title:focus{color:var(--accent)}
    .mc-scenario-actions{display:flex;gap:.15rem;flex-shrink:0}
    .mc-scenario-actions button{background:none;border:none;color:var(--muted);cursor:pointer;font-size:clamp(.45rem,.7vw,.5rem);padding:.05rem .12rem;font-family:var(--font-sans)}
    .mc-scenario-actions button:hover{color:var(--accent-2)}

    .mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(.25rem,.4vw,.35rem)}
    .mc-field{display:flex;flex-direction:column;gap:.05rem}
    .mc-field.full{grid-column:1/-1}
    .mc-field label{font-size:clamp(.38rem,.6vw,.45rem);color:var(--muted);font-family:var(--font-sans);letter-spacing:.02em}
    .mc-field input,.mc-field select{background:var(--bg3);border:1px solid var(--line);border-radius:4px;padding:clamp(.12rem,.2vw,.18rem) clamp(.15rem,.25vw,.22rem);color:var(--fg);font-family:var(--font-sans);font-size:clamp(.45rem,.7vw,.52rem);outline:none}
    .mc-field input:focus,.mc-field select:focus{border-color:var(--accent)}

    /* Results */
    .mc-results{margin-top:.35rem;background:var(--bg3);border-radius:var(--rs);padding:clamp(.3rem,.5vw,.4rem)}
    .mc-result-row{display:flex;justify-content:space-between;padding:.05rem 0;font-size:clamp(.45rem,.7vw,.5rem);font-family:var(--font-sans)}
    .mc-result-row .label{color:var(--muted)}
    .mc-result-row .value{color:var(--fg);font-weight:500}
    .mc-result-row .value.accent{color:var(--accent)}

    /* Comparison table */
    .mc-compare{margin-top:.6rem;display:none}
    .mc-compare.s{display:block}
    .mc-compare h4{font-family:var(--font-serif);font-size:clamp(.65rem,1vw,.75rem);color:var(--fg);margin-bottom:.3rem;font-weight:500}
    .mc-compare-table{width:100%;border-collapse:collapse;font-family:var(--font-sans);font-size:clamp(.42rem,.65vw,.48rem)}
    .mc-compare-table th,.mc-compare-table td{border:1px solid var(--line);padding:clamp(.15rem,.25vw,.2rem) clamp(.2rem,.3vw,.25rem);text-align:center}
    .mc-compare-table th{background:var(--bg3);color:var(--muted);font-weight:500}
    .mc-compare-table td{color:var(--fg)}
    .mc-compare-table .best{background:rgba(212,165,116,.08);color:var(--accent);font-weight:600}

    .mc-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:clamp(.55rem,.85vw,.6rem);font-family:var(--font-sans)}
    .mc-empty-icon{font-size:2rem;margin-bottom:.5rem;opacity:.5}
  `;
  document.head.appendChild(style);

  // ===== Data =====
  function getData(){
    var d = window.data || {};
    if(!d._mortgage) d._mortgage = [];
    return d._mortgage;
  }
  function save(){ window.save(); }
  function genId(){ return 'mc' + Date.now() + Math.random().toString(36).slice(2,6); }

  // ===== Mortgage calculations =====
  function calcEqualPayment(principal, annualRate, months){
    // 等额本息
    var mr = annualRate / 12 / 100;
    var factor = Math.pow(1 + mr, months);
    var monthly = principal * mr * factor / (factor - 1);
    var total = monthly * months;
    return { monthly: Math.round(monthly), total: Math.round(total), interest: Math.round(total - principal) };
  }

  function calcEqualPrincipal(principal, annualRate, months){
    // 等额本金
    var mr = annualRate / 12 / 100;
    var monthlyPrincipal = principal / months;
    var total = 0;
    var firstMonth = 0;
    for(var i=0; i<months; i++){
      var remaining = principal - monthlyPrincipal * i;
      var payment = monthlyPrincipal + remaining * mr;
      total += payment;
      if(i === 0) firstMonth = payment;
    }
    return { monthly: Math.round(monthlyPrincipal + principal * mr), // first month
             monthlyEnd: Math.round(monthlyPrincipal + (principal - monthlyPrincipal*(months-1))*mr), // last month
             total: Math.round(total), interest: Math.round(total - principal),
             firstMonth: Math.round(firstMonth) };
  }

  // ===== Render scenario =====
  function renderScenario(s, idx){
    var div = document.createElement('div');
    div.className = 'mc-scenario';
    div.dataset.idx = idx;

    // Header
    var header = document.createElement('div');
    header.className = 'mc-scenario-header';
    var titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'mc-scenario-title';
    titleInput.placeholder = '方案名称（如：组合贷70%公积金）';
    titleInput.value = s.title || '';
    titleInput.addEventListener('input', function(){ getData()[idx].title = titleInput.value; save(); });
    header.appendChild(titleInput);
    var actions = document.createElement('div');
    actions.className = 'mc-scenario-actions';
    var delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.title = '删除方案';
    delBtn.addEventListener('click', function(){
      if(!confirm('确认删除此方案？')) return;
      getData().splice(idx,1); save(); renderAll();
    });
    actions.appendChild(delBtn);
    var copyBtn = document.createElement('button');
    copyBtn.textContent = '📋';
    copyBtn.title = '复制方案';
    copyBtn.addEventListener('click', function(){
      var data = getData();
      var copy = JSON.parse(JSON.stringify(s));
      copy.id = genId();
      copy.title = (s.title || '未命名') + ' (复制)';
      data.push(copy); save(); renderAll();
    });
    actions.appendChild(copyBtn);
    header.appendChild(actions);
    div.appendChild(header);

    // Fields grid
    var grid = document.createElement('div');
    grid.className = 'mc-grid';

    // Fields: total price, down payment ratio, loan type, rate, term, repayment method
    var fields = [
      { label:'房屋总价 (万元)', key:'total', val:s.total || '', type:'number', full:false },
      { label:'首付比例 (%)', key:'downRate', val:s.downRate || '30', type:'number', full:false },
      { label:'贷款类型', key:'loanType', val:s.loanType || '商业贷', type:'select',
        opts:['商业贷','公积金贷','组合贷'], full:false },
      { label:'年利率 (%)', key:'rate', val:s.rate || '3.25', type:'number', full:false },
      { label:'二次利率 (%)', key:'rate2', val:s.rate2 || '3.85', type:'number', full:false,
        note:'组合贷时公积金部分利率', showIf: function(){ return getData()[idx].loanType === '组合贷'; } },
      { label:'二次比例 (%)', key:'rate2Ratio', val:s.rate2Ratio || '50', type:'number', full:false,
        note:'组合贷中公积金占总贷款比例', showIf: function(){ return getData()[idx].loanType === '组合贷'; } },
      { label:'贷款期限 (年)', key:'term', val:s.term || '30', type:'number', full:false },
      { label:'还款方式', key:'method', val:s.method || '等额本息', type:'select',
        opts:['等额本息','等额本金'], full:false }
    ];

    var self = this;
    fields.forEach(function(f){
      var field = document.createElement('div');
      field.className = 'mc-field' + (f.full ? ' full' : '');
      if(f.showIf) field.style.display = f.showIf() ? 'flex' : 'none';
      field.dataset.key = f.key;

      var label = document.createElement('label');
      label.textContent = f.label;
      field.appendChild(label);

      var input;
      if(f.type === 'select'){
        input = document.createElement('select');
        f.opts.forEach(function(o){
          var opt = document.createElement('option');
          opt.value = o; opt.textContent = o;
          if(o === f.val) opt.selected = true;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement('input');
        input.type = f.type;
        input.value = f.val;
        input.step = 'any';
      }
      input.addEventListener('change', function(){ updateField(idx, f.key, input.value); });
      input.addEventListener('input', function(){ 
        if(f.type === 'number'){ updateField(idx, f.key, input.value); }
      });
      field.appendChild(input);

      if(f.note){
        var note = document.createElement('div');
        note.style.cssText = 'font-size:clamp(.35rem,.55vw,.4rem);color:var(--muted);margin-top:.02rem';
        note.textContent = f.note;
        field.appendChild(note);
      }
      grid.appendChild(field);
    });
    div.appendChild(grid);

    // Results
    div.appendChild(renderResults(s));

    return div;
  }

  function updateField(idx, key, val){
    var d = getData();
    if(typeof d[idx] !== 'object') return;
    d[idx][key] = val;
    // If loanType changed to/from 组合贷, refresh to show/hide fields
    save();
    renderAll();
  }

  function renderResults(s){
    var div = document.createElement('div');
    div.className = 'mc-results';
    if(!s.total || !s.rate || !s.term) {
      div.innerHTML = '<div style="color:var(--muted);font-size:clamp(.45rem,.7vw,.5rem);text-align:center;padding:.2rem">填写参数后自动计算</div>';
      return div;
    }

    var totalWan = parseFloat(s.total) || 0;
    var downRate = parseFloat(s.downRate) || 30;
    var downPay = totalWan * downRate / 100;
    var principal = totalWan - downPay; // 万元
    var rate = parseFloat(s.rate) || 3.25;
    var termYears = parseInt(s.term) || 30;
    var months = termYears * 12;
    var method = s.method || '等额本息';
    var loanType = s.loanType || '商业贷';

    var rows = [];

    if(loanType === '组合贷' && s.rate2 && s.rate2Ratio){
      var rate2 = parseFloat(s.rate2) || 3.85;
      var rate2Ratio = parseFloat(s.rate2Ratio) || 50;
      var p1 = principal * rate2Ratio / 100; // 公积金部分
      var p2 = principal - p1; // 商业贷部分
      var r1 = method === '等额本息' ? calcEqualPayment(p1, rate, months) : calcEqualPrincipal(p1, rate, months);
      var r2 = method === '等额本息' ? calcEqualPayment(p2, rate2, months) : calcEqualPrincipal(p2, rate2, months);
      var monthly = (r1.monthly || r1.firstMonth || 0) + (r2.monthly || r2.firstMonth || 0);
      var total = (r1.total || 0) + (r2.total || 0);
      var interest = (r1.interest || 0) + (r2.interest || 0);
      rows.push({ label:'贷款总额', val: formatWan(principal) + ' 万' });
      rows.push({ label:'公积金贷款', val: formatWan(p1) + ' 万' });
      rows.push({ label:'商业贷款', val: formatWan(p2) + ' 万' });
      rows.push({ label:'首付', val: formatWan(downPay) + ' 万' });
      rows.push({ label:'月供', val: formatYuan(monthly * 10000) + ' 元/月', accent:true });
      rows.push({ label:'利息总额', val: formatYuan(interest * 10000) + ' 元' });
      rows.push({ label:'还款总额', val: formatYuan(total * 10000) + ' 元' });
    } else {
      var result = method === '等额本息' ? calcEqualPayment(principal, rate, months) : calcEqualPrincipal(principal, rate, months);
      rows.push({ label:'贷款总额', val: formatWan(principal) + ' 万' });
      rows.push({ label:'首付', val: formatWan(downPay) + ' 万' });
      if(method === '等额本息'){
        rows.push({ label:'月供', val: formatYuan(result.monthly * 10000) + ' 元', accent:true });
      } else {
        rows.push({ label:'首月月供', val: formatYuan((result.firstMonth || 0) * 10000) + ' 元', accent:true });
        rows.push({ label:'末月月供', val: formatYuan((result.monthlyEnd || 0) * 10000) + ' 元' });
      }
      rows.push({ label:'利息总额', val: formatYuan(result.interest * 10000) + ' 元' });
      rows.push({ label:'还款总额', val: formatYuan(result.total * 10000) + ' 元' });
    }

    rows.forEach(function(r){
      var row = document.createElement('div');
      row.className = 'mc-result-row';
      row.innerHTML = '<span class="label">' + r.label + '</span><span class="value' + (r.accent ? ' accent' : '') + '">' + r.val + '</span>';
      div.appendChild(row);
    });

    return div;
  }

  function formatWan(n){ return (Math.round(n * 100) / 100).toFixed(2); }
  function formatYuan(n){ return Math.round(n).toLocaleString(); }

  // ===== Comparison table =====
  function renderCompare(){
    var container = document.getElementById('mcCompare');
    if(!container) return;
    var data = getData();
    if(data.length < 2){
      container.classList.remove('s');
      return;
    }
    container.classList.add('s');

    var html = '<h4>📊 方案对比</h4><table class="mc-compare-table"><thead><tr><th>指标</th>';
    data.forEach(function(s){ html += '<th>' + (s.title || '方案' + (data.indexOf(s)+1)) + '</th>'; });
    html += '</tr></thead><tbody>';

    // Compute for each
    var results = data.map(function(s){
      var totalWan = parseFloat(s.total) || 0;
      var downRate = parseFloat(s.downRate) || 30;
      var downPay = totalWan * downRate / 100;
      var principal = totalWan - downPay;
      var rate = parseFloat(s.rate) || 3.25;
      var termYears = parseInt(s.term) || 30;
      var months = termYears * 12;
      var method = s.method || '等额本息';
      var loanType = s.loanType || '商业贷';

      var r;
      if(loanType === '组合贷' && s.rate2 && s.rate2Ratio){
        var rate2 = parseFloat(s.rate2) || 3.85;
        var rate2Ratio = parseFloat(s.rate2Ratio) || 50;
        var p1 = principal * rate2Ratio / 100;
        var p2 = principal - p1;
        var r1 = method === '等额本息' ? calcEqualPayment(p1, rate, months) : calcEqualPrincipal(p1, rate, months);
        var r2 = method === '等额本息' ? calcEqualPayment(p2, rate2, months) : calcEqualPrincipal(p2, rate2, months);
        var monthly = (r1.monthly || r1.firstMonth || 0) + (r2.monthly || r2.firstMonth || 0);
        var total = (r1.total || 0) + (r2.total || 0);
        var interest = (r1.interest || 0) + (r2.interest || 0);
        r = { monthly: monthly, total: total, interest: interest, principal: principal, downPay: downPay };
      } else {
        var result = method === '等额本息' ? calcEqualPayment(principal, rate, months) : calcEqualPrincipal(principal, rate, months);
        r = { monthly: result.monthly || result.firstMonth || 0, total: result.total, interest: result.interest, principal: principal, downPay: downPay };
      }
      return r;
    });

    var metrics = [
      { label:'贷款总额', key:'principal', fmt: function(v){ return formatYuan(v*10000) + ' 元'; } },
      { label:'首付', key:'downPay', fmt: function(v){ return formatYuan(v*10000) + ' 元'; } },
      { label:'月供', key:'monthly', fmt: function(v){ return formatYuan(v*10000) + ' 元'; } },
      { label:'利息总额', key:'interest', fmt: function(v){ return formatYuan(v*10000) + ' 元'; } },
      { label:'还款总额', key:'total', fmt: function(v){ return formatYuan(v*10000) + ' 元'; } }
    ];

    metrics.forEach(function(m){
      html += '<tr><td>' + m.label + '</td>';
      var vals = results.map(function(r){ return r[m.key]; });
      var best = Math.min.apply(null, vals); // lower is better for cost
      results.forEach(function(r){
        var v = r[m.key];
        var isBest = (v === best);
        html += '<td' + (isBest ? ' class="best"' : '') + '>' + m.fmt(v) + (isBest ? ' ✓' : '') + '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // ===== Add scenario =====
  function addScenario(){
    var d = getData();
    d.push({ id: genId(), title: '', total: '', downRate: '30', loanType: '商业贷',
             rate: '3.25', rate2: '3.85', rate2Ratio: '50', term: '30', method: '等额本息' });
    save();
    renderAll();
  }

  // ===== Render all =====
  function renderAll(){
    var container = document.getElementById('mcScenarios');
    if(!container) return;
    var data = getData();
    container.innerHTML = '';
    if(data.length === 0){
      container.innerHTML = '<div class="mc-empty"><div class="mc-empty-icon">🏦</div>还没有方案，添加方案后自动计算对比</div>';
      document.getElementById('mcCompare').classList.remove('s');
      return;
    }
    data.forEach(function(s, idx){
      container.appendChild(renderScenario(s, idx));
    });
    renderCompare();
  }

  // ===== Modal =====
  function show(){
    document.getElementById('mcOverlay').classList.add('s');
    document.getElementById('mcModal').classList.add('s');
    renderAll();
  }
  function hide(){
    document.getElementById('mcOverlay').classList.remove('s');
    document.getElementById('mcModal').classList.remove('s');
  }
  function toggle(){
    var m = document.getElementById('mcModal');
    if(m.classList.contains('s')) hide(); else show();
  }

  // ===== Init =====
  function init(){
    document.getElementById('mortBtn').addEventListener('click', toggle);
    document.getElementById('mcClose').addEventListener('click', hide);
    document.getElementById('mcOverlay').addEventListener('click', hide);
    document.getElementById('mcAddBtn').addEventListener('click', addScenario);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  console.log('feature-mortgage-compare: loaded');
})();
