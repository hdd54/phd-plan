// ===== FEATURE: Task Deadline Reminders =====
(function(){
  if(window.__features['reminder']) return;
  window.__features['reminder'] = true;

  // CSS
  var style = document.createElement('style');
  style.textContent = `
    .rm-indicator{display:inline-flex;align-items:center;gap:2px;flex-shrink:0;cursor:pointer;font-size:.45rem;color:var(--muted);transition:color .2s;margin:0 2px}
    .rm-indicator:hover{color:var(--accent)}
    .rm-indicator.has{color:#c9a040}
    .rm-indicator.overdue{color:var(--accent-2)}
    .rm-picker{display:none;position:absolute;z-index:60;background:var(--bg3);border:1px solid var(--line);border-radius:8px;padding:6px;box-shadow:0 8px 32px rgba(0,0,0,.5)}
    .rm-picker.s{display:block}
    .rm-picker input{display:block;padding:4px 8px;border:1px solid var(--line-2);border-radius:4px;background:rgba(255,255,255,.04);color:var(--fg);font-size:.55rem;font-family:var(--font-sans);outline:none;width:100%}
    .rm-picker input:focus{border-color:var(--accent)}
    .rm-picker .rm-actions{display:flex;gap:4px;margin-top:4px}
    .rm-picker .rm-actions button{flex:1;padding:3px 6px;border:1px solid var(--line-2);border-radius:4px;background:transparent;color:var(--muted);font-size:.5rem;font-family:var(--font-sans);cursor:pointer;transition:all .15s}
    .rm-picker .rm-actions button:hover{color:var(--accent);border-color:var(--accent)}
    .rm-picker .rm-actions button.del{color:var(--accent-2)}
    .rm-picker .rm-actions button.del:hover{border-color:var(--accent-2)}
    /* Overdue task row */
    .dr.overdue .di{color:var(--accent-2)}
  `;
  document.head.appendChild(style);

  // ===== Get reminder for a task =====
  function getReminder(cid, wi, di){
    if(!data._reminders) data._reminders = [];
    for(var i=0; i<data._reminders.length; i++){
      var r = data._reminders[i];
      if(r.cardId === cid && r.wi === wi && r.di === di) return r;
    }
    return null;
  }

  function setReminder(cid, wi, di, deadline){
    if(!data._reminders) data._reminders = [];
    // Remove existing
    data._reminders = data._reminders.filter(function(r){ return !(r.cardId === cid && r.wi === wi && r.di === di); });
    if(deadline){
      var text = '';
      try { var td = data[cid][wi].d[di]; text = typeof td === 'object' ? td.text : td; } catch(e){}
      data._reminders.push({ cardId: cid, wi: wi, di: di, text: text, deadline: deadline, notified: false });
    }
    save();
  }

  function removeReminder(cid, wi, di){
    setReminder(cid, wi, di, null);
  }

  // ===== Check due reminders =====
  function checkReminders(){
    if(!data._reminders) return;
    var now = new Date();
    data._reminders.forEach(function(r){
      if(r.notified) return;
      var due = new Date(r.deadline);
      var diff = due - now;
      // Notify if within 1 hour of deadline OR past deadline
      if(diff < 3600000 && diff > -86400000){
        r.notified = true;
        save();
        if('Notification' in window && Notification.permission === 'granted'){
          var label = r.text ? '「' + r.text.substring(0, 20) + '」' : '任务';
          var msg = diff > 0 ? '距截止还有 ' + Math.round(diff/60000) + ' 分钟' : '已过截止时间！';
          try { new Notification('⏰ ' + label, { body: msg }); } catch(e){}
        }
        showToast('⏰ 任务' + (diff > 0 ? '即将' : '已') + '截止');
      }
    });
    // Clean up old notifications (>7 days past)
    data._reminders = data._reminders.filter(function(r){
      var due = new Date(r.deadline);
      return (now - due) < 604800000; // 7 days
    });
  }

  // ===== Enhance a row with reminder indicator =====
  function enhanceRow(row){
    if(row.querySelector('.rm-indicator')) return;
    var textarea = row.querySelector('.di');
    if(!textarea) return;
    var cid = textarea.dataset.c, wi = parseInt(textarea.dataset.wi), di = parseInt(textarea.dataset.di);
    if(isNaN(wi) || isNaN(di)) return;

    var rem = getReminder(cid, wi, di);
    var ind = document.createElement('span');
    ind.className = 'rm-indicator';
    if(rem){
      var due = new Date(rem.deadline);
      var isOverdue = due < new Date();
      ind.textContent = isOverdue ? '⏰' : '🕐';
      ind.classList.add(isOverdue ? 'overdue' : 'has');
      if(isOverdue) row.classList.add('overdue');
    } else {
      ind.textContent = '🕐';
    }
    ind.title = rem ? ('截止: ' + new Date(rem.deadline).toLocaleString('zh-CN')) : '设置截止时间';

    // Click to open picker
    ind.addEventListener('click', function(e){
      e.stopPropagation();
      // Remove other open pickers
      document.querySelectorAll('.rm-picker.s').forEach(function(p){ p.classList.remove('s'); });

      var existing = document.querySelector('.rm-picker[data-cid="'+cid+'"][data-wi="'+wi+'"][data-di="'+di+'"]');
      if(existing) { existing.classList.toggle('s'); return; }

      var picker = document.createElement('div');
      picker.className = 'rm-picker s';
      picker.dataset.cid = cid;
      picker.dataset.wi = wi;
      picker.dataset.di = di;
      picker.style.position = 'absolute';

      var input = document.createElement('input');
      input.type = 'datetime-local';
      if(rem) input.value = rem.deadline.slice(0, 16);
      picker.appendChild(input);

      var actions = document.createElement('div');
      actions.className = 'rm-actions';

      var setBtn = document.createElement('button');
      setBtn.textContent = '设置';
      setBtn.addEventListener('click', function(){
        if(!input.value) return;
        var d = new Date(input.value);
        if(isNaN(d.getTime())) return;
        setReminder(cid, wi, di, d.toISOString());
        ind.textContent = '🕐';
        ind.classList.add('has'); ind.classList.remove('overdue');
        ind.title = '截止: ' + d.toLocaleString('zh-CN');
        row.classList.remove('overdue');
        picker.classList.remove('s');
        showToast('⏰ 截止时间已设置');
      });
      actions.appendChild(setBtn);

      if(rem){
        var delBtn = document.createElement('button');
        delBtn.className = 'del';
        delBtn.textContent = '删除';
        delBtn.addEventListener('click', function(){
          removeReminder(cid, wi, di);
          ind.textContent = '🕐';
          ind.classList.remove('has', 'overdue');
          ind.title = '设置截止时间';
          row.classList.remove('overdue');
          picker.classList.remove('s');
          showToast('⏰ 提醒已删除');
        });
        actions.appendChild(delBtn);
      }

      picker.appendChild(actions);
      ind.parentNode.appendChild(picker);

      // Close on outside click
      setTimeout(function(){
        document.addEventListener('click', function cls(e){
          if(!picker.contains(e.target) && e.target !== ind){
            picker.classList.remove('s');
            document.removeEventListener('click', cls);
          }
        });
      }, 10);
    });

    // Insert after tag-wrap (which is now before .dl)
    var tg = row.querySelector('.tg-wrap');
    if(tg && tg.nextSibling) row.insertBefore(ind, tg.nextSibling);
    else if(tg) row.appendChild(ind);
    else {
      var cb = row.querySelector('.dc');
      if(cb) row.insertBefore(ind, cb);
      else row.appendChild(ind);
    }
  }

  // ===== Enhance all rows =====
  function enhanceAll(){
    document.querySelectorAll('.weeks-wrap .dr').forEach(enhanceRow);
  }

  // ===== Patch renderWeeks =====
  var origRender = window.renderWeeks;
  window.renderWeeks = function(cid){
    origRender.call(this, cid);
    // Wait for tag feature to also run
    setTimeout(enhanceAll, 100);
  };

  // ===== Periodic check (every 60s) =====
  setInterval(checkReminders, 60000);

  // ===== Initial run =====
  setTimeout(function(){ enhanceAll(); checkReminders(); }, 1500);
})();
