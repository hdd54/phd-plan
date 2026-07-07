// ===== FEATURE: Housing Cost + Mortgage Calculator (merged) =====
(function(){
  if(window.__features['housing']) return;
  window.__features['housing'] = true;

  var OVERLAY_ID = 'costOverlay';
  var MODAL_ID = 'costModal';

  // ===== Mortgage inputs =====
  var MID = {
    price: 'cstPrice',
    downPct: 'cstDownPct',
    years: 'cstYears',
    rate: 'cstRate',
    // results
    downAmt: 'cstDownAmt',
    loanAmt: 'cstLoanAmt',
    monthly: 'cstMonthlyVal',
    totalInt: 'cstTotalInt',
    totalPay: 'cstTotalPay'
  };

  // ===== Cost inputs (kept from before) =====
  var CID = {
    tax: 'cstTax',
    renovation: 'cstRenov',
    propertyFee: 'cstPropFee',
    other: 'cstOther'
  };

  // ===== Summaries =====
  var SID = {
    totalBudget: 'cstTotalBudget',
    monthlyHousing: 'cstMonthlyHousing',
    monthlyProp: 'cstMonthlyProp',
    monthlyTotal: 'cstMonthlyTotal'
  };

  // ===== Inject CSS =====
  var style = document.createElement('style');
  style.textContent = [
    // Cost input rows
    '.cst-row{display:flex;align-items:center;gap:.3rem;margin-bottom:.25rem}',
    '.cst-row label{font-size:.55rem;color:var(--fg-dim);min-width:clamp(60px,8vw,80px);flex-shrink:0}',
    '.cst-row input{flex:1;padding:.25rem .35rem;border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.03);color:var(--fg);font-size:.6rem;font-family:var(--font-sans);outline:none}',
    '.cst-row input:focus{border-color:var(--accent)}',
    // Summary box
    '.cst-summary{padding:.4rem;background:rgba(212,165,116,.05);border:1px solid rgba(212,165,116,.12);border-radius:8px;margin-top:.3rem}',
    '.cst-summary .sr{display:flex;justify-content:space-between;padding:.08rem 0;font-size:.6rem}',
    '.cst-summary .sr .sv{color:var(--fg)}',
    '.cst-summary .sr.highlight .sv{color:var(--accent);font-weight:400}',
    // Section divider
    '.cst-sec{margin:.3rem 0 .2rem;font-size:.65rem;color:var(--accent);font-family:var(--font-serif);letter-spacing:.04em;border-bottom:1px solid var(--line);padding-bottom:.15rem}',
    // Mortgage result grid inside modal
    '.cst-mtg-res{display:grid;grid-template-columns:1fr 1fr;gap:.15rem .4rem;margin:.2rem 0 .35rem}',
    '.cst-mtg-res .mr{display:flex;justify-content:space-between;font-size:.55rem;padding:.08rem .25rem;background:rgba(255,255,255,.02);border-radius:4px}',
    '.cst-mtg-res .mr .mv{color:var(--fg)}',
    '.cst-mtg-res .mr.mh{grid-column:1/-1;background:rgba(212,165,116,.06)}',
    '.cst-mtg-res .mr.mh .mv{color:var(--accent)}',
    // Override for mortgage rows inside pomo body
    '.pomo-body .mtg-row{margin-bottom:.2rem}',
    '.pomo-body .mtg-row label{min-width:clamp(55px,7vw,72px)}',
    '.pomo-body .mtg-row select{padding:.2rem .3rem}',
    '.pomo-body .mtg-row input{padding:.2rem .3rem}'
  ].join('');
  document.head.appendChild(style);

  // ===== Mortgage calculation =====
  function calcMortgage() {
    var price = parseFloat(document.getElementById(MID.price).value) || 0;
    var downPct = parseInt(document.getElementById(MID.downPct).value) || 30;
    var years = parseInt(document.getElementById(MID.years).value) || 25;
    var rate = parseFloat(document.getElementById(MID.rate).value) || 0;

    var loan = price * (100 - downPct) / 100;
    var downAmt = price - loan;
    var monthly = 0, totalPay = 0, totalInt = 0;

    if (loan > 0 && rate > 0 && years > 0) {
      var monthlyRate = rate / 100 / 12;
      var months = years * 12;
      monthly = loan * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      if (!isFinite(monthly)) monthly = loan / months;
      totalPay = monthly * months;
      totalInt = totalPay - loan;
    }

    var fmtWan = function(n) {
      return n.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 万';
    };
    var fmtYuan = function(n) {
      return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 元/月';
    };

    document.getElementById(MID.loanAmt).textContent = fmtWan(loan);
    document.getElementById(MID.downAmt).textContent = fmtWan(downAmt);
    document.getElementById(MID.monthly).textContent = fmtYuan(monthly * 10000);
    document.getElementById(MID.totalInt).textContent = fmtWan(totalInt);
    document.getElementById(MID.totalPay).textContent = fmtWan(totalPay);

    return { loan: loan, monthly: monthly * 10000 };
  }

  // ===== Cost calculation =====
  function calcCosts(mtgResult) {
    var tax = parseFloat(document.getElementById(CID.tax).value) || 0;
    var renovation = parseFloat(document.getElementById(CID.renovation).value) || 0;
    var propertyFee = parseFloat(document.getElementById(CID.propertyFee).value) || 0;
    var other = parseFloat(document.getElementById(CID.other).value) || 0;

    var price = parseFloat(document.getElementById(MID.price).value) || 0;
    var totalBudget = price + tax + renovation + other;
    var mtgMonth = mtgResult ? mtgResult.monthly : 0;
    var monthlyTotal = mtgMonth + propertyFee;

    var fmtWan = function(n) {
      return n.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 万';
    };
    var fmtYuan = function(n) {
      return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 元/月';
    };

    document.getElementById(SID.totalBudget).textContent = fmtWan(totalBudget);
    document.getElementById(SID.monthlyHousing).textContent = fmtYuan(mtgMonth);
    document.getElementById(SID.monthlyProp).textContent = fmtYuan(propertyFee);
    document.getElementById(SID.monthlyTotal).textContent = fmtYuan(monthlyTotal);
  }

  // ===== Full calculation =====
  function calcAll() {
    var r = calcMortgage();
    calcCosts(r);
  }

  // ===== Save to localStorage =====
  function save() {
    var data = {};
    // mortgage inputs
    data[MID.price] = document.getElementById(MID.price).value;
    data[MID.downPct] = document.getElementById(MID.downPct).value;
    data[MID.years] = document.getElementById(MID.years).value;
    data[MID.rate] = document.getElementById(MID.rate).value;
    // cost inputs
    for (var key in CID) {
      var el = document.getElementById(CID[key]);
      if (el) data[CID[key]] = el.value;
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
    '<div class="pomo-modal" id="' + MODAL_ID + '" style="width:clamp(360px,60vw,520px)">' +
      '<button class="pomo-close" id="cstClose">✕</button>' +
      '<div class="pomo-body" style="gap:.15rem">' +
        // --- Header ---
        '<div style="font-size:.8rem;margin:0 0 .2rem;font-family:var(--font-serif);letter-spacing:.04em;color:var(--accent)">\uD83C\uDFE0 \u8D2D\u623F\u8BA1\u7B97\u5668</div>' +

        // --- Section 1: 贷款计算 ---
        '<div class="cst-sec">\u8D37\u6B3E\u8BA1\u7B97</div>' +
        '<div class="mtg-row"><label>\u623F\u4EF7\u603B\u989D</label><input type="number" id="' + MID.price + '" placeholder="200" min="0" step="10"><span class="mtg-unit">\u4E07\u5143</span></div>' +
        '<div class="mtg-row"><label>\u9996\u4ED8\u6BD4\u4F8B</label><select id="' + MID.downPct + '">' +
          '<option value="15">15%（\u9996\u5957）</option>' +
          '<option value="20">20%</option>' +
          '<option value="30" selected>30%</option>' +
          '<option value="40">40%</option>' +
          '<option value="50">50%</option>' +
        '</select></div>' +
        '<div class="mtg-row"><label>\u8D37\u6B3E\u5E74\u9650</label><select id="' + MID.years + '">' +
          '<option value="10">10\u5E74</option>' +
          '<option value="15">15\u5E74</option>' +
          '<option value="20">20\u5E74</option>' +
          '<option value="25" selected>25\u5E74</option>' +
          '<option value="30">30\u5E74</option>' +
        '</select></div>' +
        '<div class="mtg-row"><label>\u5229\u7387</label><input type="number" id="' + MID.rate + '" placeholder="3.0" min="0" max="20" step="0.05" value="3.0"><span class="mtg-unit">%</span></div>' +

        // Mortgage results
        '<div class="cst-mtg-res">' +
          '<div class="mr"><span>\u9996\u4ED8\u91D1\u989D</span><span class="mv" id="' + MID.downAmt + '">—</span></div>' +
          '<div class="mr"><span>\u8D37\u6B3E\u603B\u989D</span><span class="mv" id="' + MID.loanAmt + '">—</span></div>' +
          '<div class="mr mh"><span>\u6708\u4F9B</span><span class="mv" id="' + MID.monthly + '">—</span></div>' +
          '<div class="mr"><span>\u5229\u606F\u603B\u989D</span><span class="mv" id="' + MID.totalInt + '">—</span></div>' +
          '<div class="mr"><span>\u8FD8\u6B3E\u603B\u989D</span><span class="mv" id="' + MID.totalPay + '">—</span></div>' +
        '</div>' +

        // --- Section 2: 其他成本 ---
        '<div class="cst-sec">\u5176\u4ED6\u6210\u672C</div>' +
        '<div class="cst-row"><label>\u7A0E\u8D39\u4F30\u7B97</label><input type="number" id="' + CID.tax + '" placeholder="0" min="0" step="0.1"><span style="font-size:.5rem;color:var(--muted)">\u4E07\u5143</span></div>' +
        '<div class="cst-row"><label>\u88C5\u4FEE\u9884\u7B97</label><input type="number" id="' + CID.renovation + '" placeholder="0" min="0" step="0.5"><span style="font-size:.5rem;color:var(--muted)">\u4E07\u5143</span></div>' +
        '<div class="cst-row"><label>\u7269\u4E1A\u8D39</label><input type="number" id="' + CID.propertyFee + '" placeholder="0" min="0" step="10"><span style="font-size:.5rem;color:var(--muted)">\u5143/\u6708</span></div>' +
        '<div class="cst-row"><label>\u5176\u4ED6\u8D39\u7528</label><input type="number" id="' + CID.other + '" placeholder="0" min="0" step="0.5"><span style="font-size:.5rem;color:var(--muted)">\u4E07\u5143</span></div>' +

        // --- Summary ---
        '<div class="cst-summary">' +
          '<div class="sr highlight"><span>\u603B\u9884\u7B97\uFF08\u542B\u623F\u4EF7+\u7A0E\u8D39+\u88C5\u4FEE\u7B49\uFF09</span><span class="sv" id="' + SID.totalBudget + '">0 \u4E07</span></div>' +
          '<div class="sr"><span>\u2014 \u6708\u4F9B</span><span class="sv" id="' + SID.monthlyHousing + '">0 \u5143/\u6708</span></div>' +
          '<div class="sr"><span>\u2014 \u7269\u4E1A\u8D39</span><span class="sv" id="' + SID.monthlyProp + '">0 \u5143/\u6708</span></div>' +
          '<div class="sr highlight"><span>\u6708\u56FA\u5B9A\u652F\u51FA</span><span class="sv" id="' + SID.monthlyTotal + '">0 \u5143/\u6708</span></div>' +
        '</div>' +
        '<div style="font-size:.5rem;color:var(--muted);margin-top:.1rem">\u57FA\u4E8E\u7B49\u989D\u672C\u606F\uFF0C\u5546\u4E1A\u8D37\u6B3E\u3002\u8F93\u5165\u81EA\u52A8\u8BA1\u7B97\uFF0C\u81EA\u52A8\u4FDD\u5B58\u3002</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(div);

  // ===== Wire input events: auto-calc + save =====
  var allInputs = [];
  // Mortgage inputs
  [MID.price, MID.downPct, MID.years, MID.rate].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) allInputs.push(el);
  });
  // Cost inputs
  for (var key in CID) {
    var el = document.getElementById(CID[key]);
    if (el) allInputs.push(el);
  }

  function onChange() {
    calcAll();
    save();
  }

  allInputs.forEach(function(el) {
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', onChange);
    } else {
      el.addEventListener('input', onChange);
    }
  });

  // ===== Open / Close =====
  function openModal() {
    load();
    calcAll();
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
