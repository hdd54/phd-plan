// ===== FEATURE: PDF Report Export (window.print) =====
(function(){
  if(window.__features['pdf']) return;
  window.__features['pdf'] = true;

  var STYLE_ID = 'printStyle';
  var REPORT_ID = 'printReport';

  function injectStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var css = [
      '@media print {',
      '  body * { visibility: hidden; }',
      '  #' + REPORT_ID + ', #' + REPORT_ID + ' * { visibility: visible; }',
      '  #' + REPORT_ID + ' { display: block !important; position: fixed; inset: 0; background: white !important; color: black !important; padding: .8in; overflow-y: auto; z-index: 99999; font-family: sans-serif; }',
      '  .btm-bar, .nav-rail, .pomo-overlay, .pomo-modal, .help-overlay, .help-modal, .ai-fab, .pomo-btn, .pomo-float, .stat-toggle, #pc, .fm-exit, .kbd-hint { display: none !important; }',
      '}',
      '#' + REPORT_ID + ' { display: none; }',
      '#' + REPORT_ID + ' .pr-h1 { font-size: 18pt; margin-bottom: 4pt; font-weight: bold; }',
      '#' + REPORT_ID + ' .pr-date { font-size: 10pt; color: #666; margin-bottom: 12pt; }',
      '#' + REPORT_ID + ' .pr-section { margin-bottom: 10pt; }',
      '#' + REPORT_ID + ' .pr-section h2 { font-size: 13pt; border-bottom: 1px solid #ccc; padding-bottom: 3pt; margin-bottom: 6pt; }',
      '#' + REPORT_ID + ' .pr-row { display: flex; justify-content: space-between; padding: 2pt 0; font-size: 10pt; }',
      '#' + REPORT_ID + ' .pr-table { width: 100%; border-collapse: collapse; font-size: 10pt; }',
      '#' + REPORT_ID + ' .pr-table th, #' + REPORT_ID + ' .pr-table td { border: 1px solid #ddd; padding: 3pt 6pt; text-align: left; }',
      '#' + REPORT_ID + ' .pr-table th { background: #f5f5f5; }'
    ].join('');
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildProgressSummary(agg){
    var html = '<div class="pr-section">';
    html += '<h2>\u8FDB\u5EA6\u603B\u89C8</h2>';
    html += '<div class="pr-row"><span>\u4EFB\u52A1\u603B\u6570</span><span>' + agg.total + '</span></div>';
    html += '<div class="pr-row"><span>\u5DF2\u5B8C\u6210</span><span>' + agg.done + '</span></div>';
    var rate = agg.total > 0 ? (agg.done / agg.total * 100).toFixed(1) : '0.0';
    html += '<div class="pr-row"><span>\u5B8C\u6210\u7387</span><span>' + rate + '%</span></div>';
    var hours = agg.pomoHours ? agg.pomoHours.toFixed(1) : '0.0';
    html += '<div class="pr-row"><span>\u756A\u8304\u949F\u65F6\u957F</span><span>' + hours + ' \u5C0F\u65F6</span></div>';
    html += '</div>';
    return html;
  }

  function buildWeeklyOverview(agg){
    var html = '<div class="pr-section">';
    html += '<h2>\u5468\u5EA6\u8FDB\u5EA6</h2>';
    html += '<table class="pr-table">';
    html += '<thead><tr><th>\u5468\u6B21</th><th>\u5DF2\u5B8C\u6210</th><th>\u603B\u4EFB\u52A1</th></tr></thead>';
    html += '<tbody>';
    var weeks = agg.weeks || [];
    var start = Math.max(0, weeks.length - 8);
    for(var i = start; i < weeks.length; i++){
      var w = weeks[i];
      html += '<tr><td>' + (w.name || '\u5468' + (w.wi + 1)) + '</td><td>' + (w.done || 0) + '</td><td>' + (w.total || 0) + '</td></tr>';
    }
    html += '</tbody></table></div>';
    return html;
  }

  function buildFinancialSummary(){
    var html = '<div class="pr-section">';
    html += '<h2>\u8D2D\u623F\u8D44\u91D1\u6982\u89C8</h2>';
    try {
      var saved = JSON.parse(localStorage.getItem('_housingCost'));
      if(saved){
        var labels = {
          cstDownPay: '\u9996\u4ED8',
          cstLoanAmt: '\u8D37\u6B3E\u603B\u989D',
          cstTax: '\u7A0E\u8D39\u4F30\u7B97',
          cstRenov: '\u88C5\u4FEE\u9884\u7B97',
          cstPropFee: '\u7269\u4E1A\u8D39(\u5143/\u6708)',
          cstOther: '\u5176\u4ED6\u8D39\u7528'
        };
        html += '<table class="pr-table">';
        html += '<thead><tr><th>\u9879\u76EE</th><th>\u91D1\u989D</th></tr></thead>';
        html += '<tbody>';
        for(var key in labels){
          var val = saved[key];
          if(val && parseFloat(val) > 0){
            html += '<tr><td>' + labels[key] + '</td><td>' + val + '</td></tr>';
          }
        }
        html += '</tbody></table>';
      } else {
        html += '<p style="font-size:10pt;color:#999">\u5C1A\u65E0\u8D2D\u623F\u8D44\u91D1\u6570\u636E</p>';
      }
    } catch(e){
      html += '<p style="font-size:10pt;color:#999">\u6570\u636E\u89E3\u6790\u5931\u8D25</p>';
    }
    html += '</div>';
    return html;
  }

  function buildHouseListings(){
    var html = '<div class="pr-section">';
    html += '<h2>\u770B\u623F\u6E05\u5355</h2>';
    try {
      var list = JSON.parse(localStorage.getItem('_houseList'));
      if(list && list.length > 0){
        html += '<table class="pr-table">';
        html += '<thead><tr><th>\u5C0F\u533A</th><th>\u4EF7\u683C(\u4E07)</th><th>\u9762\u79EF(\u33A1)</th><th>\u6237\u578B</th><th>\u72B6\u6001</th><th>\u8BC4\u5206</th></tr></thead>';
        html += '<tbody>';
        var statusLabels = { pending: '\u5F85\u770B', visited: '\u5DF2\u770B', rejected: '\u6392\u9664', interested: '\u6709\u610F' };
        for(var i = 0; i < list.length; i++){
          var h = list[i];
          var st = statusLabels[h.status] || h.status || '-';
          html += '<tr><td>' + (h.name || '-') + '</td><td>' + (h.price || '-') + '</td><td>' + (h.area || '-') + '</td><td>' + (h.layout || '-') + '</td><td>' + st + '</td><td>' + (h.score || '-') + '</td></tr>';
        }
        html += '</tbody></table>';
      } else {
        html += '<p style="font-size:10pt;color:#999">\u5C1A\u65E0\u770B\u623F\u8BB0\u5F55</p>';
      }
    } catch(e){
      html += '<p style="font-size:10pt;color:#999">\u6570\u636E\u89E3\u6790\u5931\u8D25</p>';
    }
    html += '</div>';
    return html;
  }

  function buildReport(){
    var agg = window.aggregateTasks ? window.aggregateTasks() : { total:0, done:0, pomoHours:0, weeks:[] };
    var now = new Date();
    var dateStr = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();

    var html = '<div id="' + REPORT_ID + '">';
    html += '<div class="pr-h1">\u535A\u58EB\u4E70\u623F\u89C4\u5212\u62A5\u544A</div>';
    html += '<div class="pr-date">\u751F\u6210\u65E5\u671F\uFF1A' + dateStr + '</div>';
    html += buildProgressSummary(agg);
    html += buildWeeklyOverview(agg);
    html += buildFinancialSummary();
    html += buildHouseListings();
    html += '</div>';
    return html;
  }

  function removeReport(){
    var el = document.getElementById(REPORT_ID);
    if(el) el.parentNode.removeChild(el);
  }

  function onPrintClick(){
    injectStyle();
    removeReport();

    var div = document.createElement('div');
    div.innerHTML = buildReport();
    var reportEl = div.firstChild;
    document.body.appendChild(reportEl);

    window.print();

    var afterPrint = function(){
      removeReport();
      window.removeEventListener('afterprint', afterPrint);
    };
    window.addEventListener('afterprint', afterPrint);

    setTimeout(function(){
      removeReport();
      window.removeEventListener('afterprint', afterPrint);
    }, 2000);
  }

  var btn = document.getElementById('pdfBtn');
  if(btn) btn.addEventListener('click', onPrintClick);
})();
