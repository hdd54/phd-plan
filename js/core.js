// ===== Core Shared Utilities =====
// Loads before all feature modules

// ===== Tag Color System (13 colors) =====
window.TAG_COLORS = {
  '':   { cls: 'n',  label: '无标签', bg: 'var(--line-2)' },
  'r':  { cls: 'r',  label: '实验',   bg: '#e74c3c' },
  'g':  { cls: 'g',  label: '写作',   bg: '#2ecc71' },
  'y':  { cls: 'y',  label: '备考',   bg: '#c9a040' },
  'b':  { cls: 'b',  label: '杂务',   bg: '#4a7c8c' },
  'p':  { cls: 'p',  label: '阅读',   bg: '#8b5cf6' },
  'o':  { cls: 'o',  label: '其他',   bg: '#d4a574' },
  'k':  { cls: 'k',  label: '论文',   bg: '#e91e63' },
  't':  { cls: 't',  label: '代码',   bg: '#00bcd4' },
  's':  { cls: 's',  label: '会议',   bg: '#64b5f6' },
  'l':  { cls: 'l',  label: '健身',   bg: '#8bc34a' },
  'w':  { cls: 'w',  label: '理财',   bg: '#795548' },
  'v':  { cls: 'v',  label: '杂项',   bg: '#9e9e9e' },
};
window.TAG_KEYS = ['','r','g','y','b','p','o','k','t','s','l','w','v'];

// ===== Tag Utility Functions =====
window.tagLabel = function(key){ return TAG_COLORS[key] ? TAG_COLORS[key].label : '无标签'; };
window.tagBg = function(key){ return TAG_COLORS[key] ? TAG_COLORS[key].bg : 'var(--line-2)'; };
window.tagCls = function(key){ return TAG_COLORS[key] ? TAG_COLORS[key].cls : 'n'; };

// ===== Modal Helper =====
// Feature modal pattern: overlay + modal with close button
// Each feature manages its own HTML; this just provides the open/close pattern

// ===== Feature Registration =====
// Features register themselves for lazy init
window.__features = window.__features || {};

// ===== Data Export (raw JSON) =====
window.exportJSON = function(){
  var obj = {};
  for(var i=0; i<localStorage.length; i++){
    var k = localStorage.key(i);
    if(k.startsWith('data.') || k.startsWith('_')) obj[k] = JSON.parse(localStorage.getItem(k));
  }
  var blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'phd-plan-backup-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ===== Data Import (raw JSON) =====
window.importJSON = function(file){
  var reader = new FileReader();
  reader.onload = function(e){
    try {
      var obj = JSON.parse(e.target.result);
      var count = 0;
      Object.keys(obj).forEach(function(k){
        if(k.startsWith('data.') || k.startsWith('_')){
          localStorage.setItem(k, JSON.stringify(obj[k]));
          count++;
        }
      });
      showToast('✅ 已恢复 ' + count + ' 项数据，请刷新页面');
      setTimeout(function(){ location.reload(); }, 1500);
    } catch(err){
      showToast('❌ 备份文件格式错误');
    }
  };
  reader.readAsText(file);
};

// ===== Aggregation Helpers =====
// Collect all tasks across all cards/weeks
window.aggregateTasks = function(){
  var result = {
    total: 0, done: 0,
    byTag: {},
    weeks: [],
    pomoHours: 0
  };
  // Initialize tag counters
  TAG_KEYS.forEach(function(k){ result.byTag[k] = 0; });

  Object.keys(data).forEach(function(cid){
    if(cid.startsWith('_')) return;
    var weeks = data[cid];
    if(!Array.isArray(weeks)) return;
    weeks.forEach(function(week, wi){
      if(!week || !week.d) return;
      var weekDone = 0, weekTotal = 0;
      week.d.forEach(function(t){
        weekTotal++;
        if(typeof t === 'object'){
          if(t.done) { weekDone++; result.done++; }
          var tag = t.tag || '';
          result.byTag[tag] = (result.byTag[tag] || 0) + 1;
        } else {
          result.byTag[''] = (result.byTag[''] || 0) + 1;
        }
        result.total++;
      });
      result.weeks.push({ wi: wi, total: weekTotal, done: weekDone, name: week.w || ('周'+(wi+1)) });
    });
  });

  // Pomo hours
  if(data._pomoLog){
    result.pomoHours = data._pomoLog.reduce(function(sum, r){ return sum + (r.duration||0)/60; }, 0);
  }

  return result;
};
