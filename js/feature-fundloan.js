// ===== FEATURE: Provident Fund + Combo Loan Calculator =====
(function(){
  if(window.__features['fundloan']) return;
  window.__features['fundloan'] = true;

  var OVERLAY_ID = 'fundOverlay';
  var MODAL_ID = 'fundModal';

  // Inject CSS
  var style = document.createElement('style');
  style.textContent =
    '.fnd-section{margin-bottom:.4rem}' +
    '.fnd-section h4{font-size:.6rem;color:var(--accent);margin-bottom:.2rem;letter-spacing:.08em}' +
    '.fnd-row{display:flex;align-items:center;gap:.3rem;margin-bottom:.2rem}' +
    '.fnd-row label{font-size:.55rem;color:var(--fg-dim);min-width:clamp(60px,8vw,80px);flex-shrink:0}' +
    '.fnd-row input{flex:1;padding:.25rem .35rem;border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.03);color:var(--fg);font-size:.6rem;font-family:var(--font-sans);outline:none}' +
    '.fnd-row input:focus{border-color:var(--accent)}' +
    '.fnd-calc-btn{width:100%;padding:.35rem;border:1px solid var(--accent);border-radius:100px;background:rgba(212,165,116,.06);color:var(--accent);font-family:var(--font-sans);font-size:.6rem;cursor:pointer;transition:all .2s}' +
    '.fnd-calc-btn:hover{background:rgba(212,165,116,.12)}' +
    '.fnd-result{padding:.3rem;background:rgba(212,165,116,.05);border:1px solid rgba(212,165,116,.12);border-radius:8px;margin-top:.3rem}' +
    '.fnd-result .fr{display:flex;justify-content:space-between;padding:.06rem 0;font-size:.58rem}' +
    '.fnd-result .fr .fv{color:var(--fg)}' +
    '.fnd-result .fr.highlight .fv{color:var(--accent);font-weight:400}' +
    '.fnd-result .fr.total{border-top:1px solid var(--line);margin-top:.1rem;padding-top:.1rem}' +
    '.fnd-wrap{display:grid;grid-template-columns:1fr 1fr;gap:.4rem}' +
    '@media(max-width:600px){.fnd-wrap{grid-template-columns:1fr}}';
  document.head.appendChild(style);

  // Create modal HTML
  var div = document.createElement('div');
  div.innerHTML =
    '<div class="pomo-overlay" id="' + OVERLAY_ID + '"></div>' +
    '<div class="pomo-modal" id="' + MODAL_ID + '" style="width:clamp(340px,65vw,560px)">' +
      '<button class="pomo-close" id="fundClose">✕</button>' +
      '<div class="pomo-body" style="gap:.4rem">' +
        '<div style="font-size:.9rem;color:var(--accent);text-align:center;letter-spacing:.1em">🏦 公积金组合贷计算</div>' +
        '<div class="fnd-wrap">' +
          '<div class="fnd-section">' +
            '<h4>公积金贷款</h4>' +
            '<div class="fnd-row"><label>贷款额度</label><input type="number" id="fundAmt" placeholder="60" min="0" step="5"><span style="font-size:.5rem;color:var(--muted)">万</span></div>' +
            '<div class="fnd-row"><label>利率</label><input type="number" id="fundRate" placeholder="3.1" min="0" max="20" step="0.05" value="3.1"><span style="font-size:.5rem;color:var(--muted)">%</span></div>' +
            '<div class="fnd-row"><label>年限</label><input type="number" id="fundYears" placeholder="30" min="1" max="30" step="1" value="30"><span style="font-size:.5rem;color:var(--muted)">年</span></div>' +
          '</div>' +
          '<div class="fnd-section">' +
            '<h4>商业贷款</h4>' +
            '<div class="fnd-row"><label>贷款额度</label><input type="number" id="comAmt" placeholder="100" min="0" step="5"><span style="font-size:.5rem;color:var(--muted)">万</span></div>' +
            '<div class="fnd-row"><label>利率</label><input type="number" id="comRate" placeholder="3.5" min="0" max="20" step="0.05" value="3.5"><span style="font-size:.5rem;color:var(--muted)">%</span></div>' +
            '<div class="fnd-row"><label>年限</label><input type="number" id="comYears" placeholder="30" min="1" max="30" step="1" value="30"><span style="font-size:.5rem;color:var(--muted)">年</span></div>' +
          '</div>' +
        '</div>' +
        '<button class="fnd-calc-btn" id="fundCalcBtn">计算</button>' +
        '<div class="fnd-result" id="fundResult" style="display:none">' +
          '<div style="font-size:.55rem;color:var(--accent);margin-bottom:.1rem">公积金贷款</div>' +
          '<div class="fr"><span>月供</span><span class="fv" id="fundMonthly">—</span></div>' +
          '<div class="fr"><span>利息总额</span><span class="fv" id="fundInt">—</span></div>' +
          '<div class="fr highlight"><span>还款总额</span><span class="fv" id="fundTotal">—</span></div>' +
          '<div style="font-size:.55rem;color:var(--accent);margin:.15rem 0 .1rem 0">商业贷款</div>' +
          '<div class="fr"><span>月供</span><span class="fv" id="comMonthly">—</span></div>' +
          '<div class="fr"><span>利息总额</span><span class="fv" id="comInt">—</span></div>' +
          '<div class="fr highlight"><span>还款总额</span><span class="fv" id="comTotal">—</span></div>' +
          '<div class="fr total highlight"><span>合计月供</span><span class="fv" id="totalMonthly">—</span></div>' +
          '<div class="fr total"><span>合计利息</span><span class="fv" id="totalInt">—</span></div>' +
          '<div class="fr total"><span>合计还款</span><span class="fv" id="totalPay">—</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(div);

  function openModal(){
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
    // Load last saved values
    var last = localStorage._fundLoan;
    if(last){
      try {
        var l = JSON.parse(last);
        if(l.fundAmt) document.getElementById('fundAmt').value = l.fundAmt;
        if(l.fundRate) document.getElementById('fundRate').value = l.fundRate;
        if(l.fundYears) document.getElementById('fundYears').value = l.fundYears;
        if(l.comAmt) document.getElementById('comAmt').value = l.comAmt;
        if(l.comRate) document.getElementById('comRate').value = l.comRate;
        if(l.comYears) document.getElementById('comYears').value = l.comYears;
      } catch(e){}
    }
  }

  function closeModal(){
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  function calcLoan(amtWan, ratePct, years){
    var P = amtWan * 10000;
    var r = ratePct / 100 / 12;
    var n = years * 12;
    var monthly;
    if(r === 0 || !isFinite(r)){
      monthly = P / n;
    } else {
      monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }
    var totalPay = monthly * n;
    var totalInt = totalPay - P;
    return { monthly: monthly, totalPay: totalPay, totalInt: totalInt };
  }

  function fmtYuan(v){
    return v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 元';
  }

  function calc(){
    var fundAmt = parseFloat(document.getElementById('fundAmt').value) || 0;
    var fundRate = parseFloat(document.getElementById('fundRate').value) || 3.1;
    var fundYears = parseInt(document.getElementById('fundYears').value) || 30;
    var comAmt = parseFloat(document.getElementById('comAmt').value) || 0;
    var comRate = parseFloat(document.getElementById('comRate').value) || 3.5;
    var comYears = parseInt(document.getElementById('comYears').value) || 30;

    if(fundAmt <= 0 && comAmt <= 0){
      showToast('⚠️ 请输入至少一项贷款额度');
      return;
    }

    // Auto-save to localStorage
    localStorage._fundLoan = JSON.stringify({
      fundAmt: fundAmt, fundRate: fundRate, fundYears: fundYears,
      comAmt: comAmt, comRate: comRate, comYears: comYears
    });

    var fR = fundAmt > 0 ? calcLoan(fundAmt, fundRate, fundYears) : { monthly: 0, totalPay: 0, totalInt: 0 };
    var cR = comAmt > 0 ? calcLoan(comAmt, comRate, comYears) : { monthly: 0, totalPay: 0, totalInt: 0 };

    document.getElementById('fundMonthly').textContent = fundAmt > 0 ? fmtYuan(fR.monthly) : '—';
    document.getElementById('fundInt').textContent = fundAmt > 0 ? fmtYuan(fR.totalInt) : '—';
    document.getElementById('fundTotal').textContent = fundAmt > 0 ? fmtYuan(fR.totalPay) : '—';
    document.getElementById('comMonthly').textContent = comAmt > 0 ? fmtYuan(cR.monthly) : '—';
    document.getElementById('comInt').textContent = comAmt > 0 ? fmtYuan(cR.totalInt) : '—';
    document.getElementById('comTotal').textContent = comAmt > 0 ? fmtYuan(cR.totalPay) : '—';
    document.getElementById('totalMonthly').textContent = fmtYuan(fR.monthly + cR.monthly);
    document.getElementById('totalInt').textContent = fmtYuan(fR.totalInt + cR.totalInt);
    document.getElementById('totalPay').textContent = fmtYuan(fR.totalPay + cR.totalPay);
    document.getElementById('fundResult').style.display = 'block';
  }

  // Wire events
  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('fundClose').addEventListener('click', closeModal);
  document.getElementById('fundCalcBtn').addEventListener('click', calc);
  var btn = document.getElementById('fundBtn');
  if(btn) btn.addEventListener('click', openModal);
})();
