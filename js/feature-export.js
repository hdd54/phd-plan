// ===== FEATURE: Data Export/Backup =====
(function(){
  if(window.__features['export']) return;
  window.__features['export'] = true;

  var OVERLAY_ID = 'bkpOverlay';
  var MODAL_ID = 'bkpModal';

  // Create modal HTML
  var div = document.createElement('div');
  div.innerHTML = `
    <div class="pomo-overlay" id="${OVERLAY_ID}"></div>
    <div class="pomo-modal" id="${MODAL_ID}" style="width:clamp(320px,50vw,400px);max-height:auto">
      <button class="pomo-close" id="bkpClose">✕</button>
      <div class="pomo-body" style="gap:.5rem;text-align:center">
        <div style="font-size:1.2rem;margin:.3rem 0">💾 数据备份</div>
        <p style="font-size:.6rem;color:var(--fg-dim);line-height:1.5">
          导出所有数据为 JSON 文件，可在其他设备导入恢复。
        </p>
        <div style="display:flex;gap:.3rem;margin-top:.4rem">
          <button id="bkpExportBtn" class="bb x" style="flex:1;justify-content:center;letter-spacing:0">
            📥 下载备份
          </button>
          <button id="bkpImportBtn" class="bb" style="flex:1;justify-content:center;letter-spacing:0">
            📤 恢复备份
          </button>
        </div>
        <input type="file" id="bkpFileInput" accept=".json" style="display:none">
        <div style="font-size:.5rem;color:var(--muted);margin-top:.3rem">
          备份文件包含：周计划数据 / 番茄钟记录 / 存款目标 / 房贷信息 / 设置
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  function openModal(){
    document.getElementById(OVERLAY_ID).classList.add('s');
    document.getElementById(MODAL_ID).classList.add('s');
  }
  function closeModal(){
    document.getElementById(OVERLAY_ID).classList.remove('s');
    document.getElementById(MODAL_ID).classList.remove('s');
  }

  // Event listeners
  document.getElementById(OVERLAY_ID).addEventListener('click', closeModal);
  document.getElementById('bkpClose').addEventListener('click', closeModal);

  document.getElementById('bkpExportBtn').addEventListener('click', function(){
    window.exportJSON();
    showToast('✅ 备份已下载');
  });

  document.getElementById('bkpImportBtn').addEventListener('click', function(){
    document.getElementById('bkpFileInput').click();
  });
  document.getElementById('bkpFileInput').addEventListener('change', function(e){
    if(e.target.files && e.target.files[0]){
      window.importJSON(e.target.files[0]);
    }
  });

  // Wire bottom bar button
  var btn = document.getElementById('bkpBtn');
  if(btn) btn.addEventListener('click', openModal);
})();
