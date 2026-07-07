// ===== FEATURE: Housing Cost Total Table =====
(function(){
  if(window.__features['housing']) return;
  window.__features['housing'] = true;

  var OVERLAY_ID = 'costOverlay';
  var MODAL_ID = 'costModal';

  var INPUTS = {
    downPayment: 'cstDownPay',
    loanAmount: 'cstLoanAmt',
    tax: 'cstTax',
    renovation: 'cstRenov',
    propertyFee: 'cstPropFee',
    other: 'cstOther'
  };

  var SUMMARIES = {
    totalBudget: 'cstTotalBudget',
    monthlyMortgage: 'cstMonthlyMtg',
    monthlyProp: 'cstMonthlyProp',
    monthlyTotal: 'cstMonthlyTotal'
  };

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = [
    '.cst-row{display:flex;align-items:center;gap:.3rem;margin-bottom:.25rem}',
    '.cst-row label{font-size:.55rem;color:var(--fg-dim);min-width:clamp(60px,8vw,80px);flex-shrink:0}',
    '.cst-row input{flex:1;padding:.25rem .35rem;border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.03);color:var(--fg);font-size:.6rem;font-family:var(--font-sans);outline:none}',
    '.cst-row input:focus{border-color:var(--accent)}',
    '.cst-summary{padding:.4rem;background:rgba(212,165,116,.05);border:1px solid rgba(212,165,116,.12);border-radius:8px;margin-top:.3rem}',
    '.cst-summary .sr{display:flex;justify-content:space-between;padding:.08rem 0;font-size:.6rem}',
    '.cst-summary .sr .sv{color:var(--fg)}',
    '.cst-summary .sr.highlight .sv{color:var(--accent);font-weight:400}'
  ].join('');
  document.head.appendChild(style);

  // ===== Parse monthly mortgage from mtgMonthly display =====
  function getMonthlyMortgage() {
    var el = document.getElementById('mtgMonthly');
    if (!el) return 0;
    var txt = el.textContent || '';
    var num = txt.replace(/[^0-9.]/g, '');
    return parseFloat(num) || 0;
  }

  // ===== Calculate and display =====
  function calc() {
    var dp = parseFloat(document.getElementById(INPUTS.downPayment).value) || 0;
    var la = parseFloat(document.getElementById(INPUTS.loanAmount).value) || 0;
    var tx = parseFloat(document.getElementById(INPUTS.tax).value) || 0;
    var rn = parseFloat(document.getElementById(INPUTS.renovation).value) || 0;
    var pf = parseFloat(document.getElementById(INPUTS.propertyFee).value) || 0;
    var ot = parseFloat(document.getElementById(INPUTS.other).value) || 0;

    var totalBudget = dp + la + tx + rn + ot;
    var mtgMonth = getMonthlyMortgage();
    var monthlyTotal = mtgMonth + pf;

    var fmtWan = function(n) {
      return n.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 万';
    };
    var fmtYuan = function(n) {
      return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 元/月';
    };

    document.getElementById(SUMMARIES.totalBudget).textContent = fmtWan(totalBudget);
    document.getElementById(SUMMARIES.monthlyMortgage).textContent = fmtYuan(mtgMonth);
    document.getElementById(SUMMARIES.monthlyProp).textContent = fmtYuan(pf);
    document.getElementById(SUMMARIES.monthlyTotal).textContent = fmtYuan(monthlyTotal);
  }

  // ===== Save to localStorage =====
  function save() {
    var data = {};
    for (var key in INPUTS) {
      var el = document.getElementById(INPUTS[key]);
      if (el) data[INPUTS[key]] = el.value;
    }
    try {
      localStorage.setItem('_housingCost', JSON.stringify(data));
    } catch(e) {}
  }

  // ===== Load from localStorage =====
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem('_housingCost'));
      if (!saved) return;
      for (var key in saved) {
        var el = document.getElementById(key);
        if (el) el.value = saved[key];
      }
    } catch(e) {}
  }

  // ===== Create modal HTML =====
  var div = document.createElement('div');
  div.innerHTML =
    '<div class="pomo-overlay" id="' + OVERLAY_ID + '"></div>' +
    '<div class="pomo-modal" id="' + MODAL_ID + '" style="width:clamp(320px,55vw,450px)">' +
      '<button class="pomo-close" id="cstClose">✕</button>' +
      '<div class="pomo-body" style="gap:.2rem">' +
        '<div style="font-size:.85rem;margin:.1rem 0 .25rem;font-family:var(--font-serif);letter-spacing:.04em;color:var(--accent)">\u8D2D\u623F\u6210\u672C\u603B\u89C8</div>' +
        '<div class="cst-row"><label>\u9996\u4ED8</label><input type="number" id="' + INPUTS.downPayment + '" placeholder="0" min="0" step="1"><span style="font-size:.5rem;color:var(--muted)">\u4E07</span></div>' +
        '<div class="cst-row"><label>\u8D37\u6B3E\u603B\u989D</label><input type="number" id="' + INPUTS.loanAmount + '" placeholder="0" min="0" step="1"><span style="font-size:.5rem;color:var(--muted)">\u4E07</span></div>' +
        '<div class="cst-row"><label>\u7A0E\u8D39\u4F30\u7B97</label><input type="number" id="' + INPUTS.tax + '" placeholder="0" min="0" step="0.1"><span style="font-size:.5rem;color:var(--muted)">\u4E07</span></div>' +
        '<div class="cst-row"><label>\u88C5\u4FEE\u9884\u7B97</label><input type="number" id="' + INPUTS.renovation + '" placeholder="0" min="0" step="0.5"><span style="font-size:.5rem;color:var(--muted)">\u4E07</span></div>' +
        '<div class="cst-row"><label>\u7269\u4E1A\u8D39</label><input type="number" id="' + INPUTS.propertyFee + '" placeholder="0" min="0" step="10"><span style="font-size:.5rem;color:var(--muted)">\u5143/\u6708</span></div>' +
        '<div class="cst-row"><label>\u5176\u4ED6\u8D39\u7528</label><input type="number" id="' + INPUTS.other + '" placeholder="0" min="0" step="0.5"><span style="font-size:.5rem;color:var(--muted)">\u4E07</span></div>' +
        '<div class="cst-summary">' +
          '<div class="sr highlight"><span>\u603B\u9884\u7B97</span><span class="sv" id="' + SUMMARIES.totalBudget + '">0 \u4E07</span></div>' +
          '<div class="sr"><span>\u2014 \u6708\u4F9B</span><span class="sv" id="' + SUMMARIES.monthlyMortgage + '">0 \u5143/\u6708</span></div>' +
          '<div class="sr"><span>\u2014 \u7269\u4E1A\u8D39</span><span class="sv" id="' + SUMMARIES.monthlyProp + '">0 \u5143/\u6708</span></div>' +
          '<div class="sr highlight"><span>\u6708\u56FA\u5B9A\u652F\u51FA</span><span class="sv" id="' + SUMMARIES.monthlyTotal + '">0 \u5143/\u6708</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(div);

  // ===== Wire inputs to auto-calc + save =====
  function onInputChange() {
    calc();
    save();
  }

  for (var key in INPUTS) {
    var el = document.getElementById(INPUTS[key]);
    if (el) {
      el.addEventListener('input', onInputChange);
    }
  }

  // ===== Open / Close =====
  function openModal() {
    load();
    calc();
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
  }
  function closeModal() {
    save();
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('cstClose').addEventListener('click', closeModal);

  // ===== Wire bottom bar button =====
  var btn = document.getElementById('costBtn');
  if (btn) btn.addEventListener('click', openModal);
})();
