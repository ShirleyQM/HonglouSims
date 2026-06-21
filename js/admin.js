/* ═══════════════════ ADMIN ═══════════════════ */
const ADMIN_TABS = [
  { id: 'chars', label: '【人物】总览' },
  { id: 'specialties', label: '【人物】性格配置' },
  { id: 'personalityMeta', label: '【人物】性格系统' },
  { id: 'needs', label: '【人物】需求' },
  { id: 'states', label: '【人物】状态' },
  { id: 'identityProtocol', label: '【人物】身份' },
  { id: 'lifePath', label: '【人物】路径' },
  { id: 'relInit', label: '关系初始化' },
  { id: 'interTpl', label: '互动模板' },
  { id: 'narrative', label: '叙事气泡' },
  { id: 'quests', label: '任务系统' },
  { id: 'multiInteract', label: '多人互动' },
  { id: 'furnTpl', label: '家具模板' },
  { id: 'furnReact', label: '家具反应' },
  { id: 'scenes', label: '场景配置' },
  { id: 'sceneAccess', label: '场景权限' },
  { id: 'io', label: '导入导出' },
];

let adminMode = 'v2';
let adminTab = 'chars', adminSelChar = 0, adminSelRelIdx = 0, adminSelState = 'drunk';
let adminSelTpl = 101, adminSelInter = 101;
let adminV2Section = 'furnitureTemplates', adminV2SelectedTpl = null, adminV2SelectedInst = null, adminV2Search = '', adminV2CharacterFamilyId = null, adminV2CharacterEditing = false, adminV2RelationLabelsEditing = false, adminV2RelationLabelsDraft = null;
let adminV2TraitFocusId = null, adminV2TraitSavedMessage = '';
const adminV2CharacterTraitCollapsed = {};
const adminCrudGroup = {
  specialties: 'profiles',
  personalityMeta: 'traitMetadata',
  states: 'definitions',
  identityProtocol: 'protocolRules',
  lifePath: 'paths',
  needs: 'needDefs',
};
const adminCrudSelected = {};
const adminCrudSearch = {};

function openAdmin() {
  document.getElementById('admin-overlay').classList.add('open');
  renderAdmin();
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
}

function renderAdmin() {
  if (adminMode === 'v2') {
    renderAdminV2();
    return;
  }
  document.getElementById('admin-tabs').innerHTML = ADMIN_TABS.map(t =>
    `<div class="adm-tab${t.id === adminTab ? ' active' : ''}" data-tab="${t.id}">${t.label}</div>`
  ).join('') + `<div class="adm-tab" id="btn-admin-v2-return">后台 v2</div>`;
  document.querySelectorAll('.adm-tab').forEach(el => el.onclick = () => { adminTab = el.dataset.tab; renderAdmin(); });
  document.getElementById('btn-admin-v2-return').onclick = () => { adminMode = 'v2'; renderAdmin(); };

  const body = document.getElementById('admin-body');
  if (adminTab === 'chars') body.innerHTML = renderCharacterAdminV2();
  else if (adminTab === 'specialties') body.innerHTML = renderConfigCrudAdmin('specialties');
  else if (adminTab === 'personalityMeta') body.innerHTML = renderConfigCrudAdmin('personalityMeta');
  else if (adminTab === 'relInit') body.innerHTML = renderRelInitAdmin();
  else if (adminTab === 'states') body.innerHTML = renderConfigCrudAdmin('states');
  else if (adminTab === 'interTpl') body.innerHTML = renderInterTplAdmin();
  else if (adminTab === 'narrative') body.innerHTML = renderNarrativeAdmin();
  else if (adminTab === 'quests') body.innerHTML = renderQuestAdmin();
  else if (adminTab === 'multiInteract') body.innerHTML = renderMultiInteractAdmin();
  else if (adminTab === 'furnTpl') body.innerHTML = renderFurnTplAdmin();
  else if (adminTab === 'furnReact') body.innerHTML = renderFurnitureReactionAdmin();
  else if (adminTab === 'scenes') body.innerHTML = renderSceneAdmin();
  else if (adminTab === 'sceneAccess') body.innerHTML = renderSceneAccessAdmin();
  else if (adminTab === 'identityProtocol') body.innerHTML = renderConfigCrudAdmin('identityProtocol');
  else if (adminTab === 'lifePath') body.innerHTML = renderConfigCrudAdmin('lifePath');
  else if (adminTab === 'needs') body.innerHTML = renderConfigCrudAdmin('needs');
  else body.innerHTML = renderIOAdmin();
  bindAdminEvents();
}

const ADMIN_V2_GROUPS = [
  { id: 'overview', label: '总览', items: [
    { id: 'dashboard', label: '配置总览', status: '占位' },
  ] },
  { id: 'people', label: '人物', items: [
    { id: 'characters', label: '人物总表', status: '部分迁移' },
    { id: 'characterEditor', label: '人物设定', status: '预览' },
    { id: 'personalityMeta', label: '性格系统', status: '已迁移' },
    { id: 'needs', label: '基础需求', status: '待迁移' },
    { id: 'states', label: '状态标签', status: '待迁移' },
  ] },
  { id: 'behavior', label: '行为', items: [
    { id: 'furnitureTemplates', label: '家具模板', status: '已迁移' },
    { id: 'furnitureInstances', label: '家具摆放', status: '已迁移' },
    { id: 'interactions', label: '互动模板', status: '待迁移' },
    { id: 'ai', label: 'AI / Utility', status: '待迁移' },
  ] },
  { id: 'tasks', label: '任务', items: [
    { id: 'questTemplates', label: '任务模板', status: '待迁移' },
    { id: 'servants', label: '仆从职责', status: '待迁移' },
  ] },
  { id: 'relations', label: '关系', items: [
    { id: 'relationInit', label: '初始关系', status: '待迁移' },
    { id: 'relationLabels', label: '关系标签', status: '已迁移' },
  ] },
  { id: 'world', label: '世界', items: [
    { id: 'scenes', label: '场景', status: '待迁移' },
    { id: 'sceneAccess', label: '场景权限', status: '待迁移' },
  ] },
  { id: 'debug', label: '调试', items: [
    { id: 'legacy', label: '旧后台', status: '保留' },
  ] },
];

function adminV2Item(sectionId) {
  for (const group of ADMIN_V2_GROUPS) {
    const found = group.items.find(item => item.id === sectionId);
    if (found) return found;
  }
  return ADMIN_V2_GROUPS[0].items[0];
}

function renderAdminV2() {
  const tabs = document.getElementById('admin-tabs');
  tabs.innerHTML = `
    <div class="adm-tab active">后台 v2</div>
    <div class="adm-tab" id="btn-admin-v2-legacy">旧后台</div>`;

  const body = document.getElementById('admin-body');
  const item = adminV2Item(adminV2Section);
  body.innerHTML = `
    <style>
      .admin-v2 { display:grid;grid-template-columns:180px minmax(0,1fr);gap:12px;min-height:64vh }
      .admin-v2-side { border:1px solid var(--jn-border-2);border-radius:10px;background:rgba(250,248,244,.12);padding:8px;overflow:auto }
      .admin-v2-group { margin-bottom:10px }
      .admin-v2-group-title { color:var(--jn-heading);font-size:11px;letter-spacing:2px;margin:7px 6px 5px }
      .admin-v2-nav { width:100%;text-align:left;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--jn-text-soft);padding:7px 8px;font-family:inherit;cursor:pointer;display:flex;justify-content:space-between;gap:6px;align-items:center }
      .admin-v2-nav:hover,.admin-v2-nav.active { background:rgba(250,248,244,.25);border-color:var(--jn-gold-border);color:var(--jn-heading) }
      .admin-v2-badge { font-size:9px;color:var(--jn-text-dim);white-space:nowrap }
      .admin-v2-main { min-width:0;display:flex;flex-direction:column;gap:10px }
      .admin-v2-head { display:flex;justify-content:space-between;gap:12px;align-items:flex-start;border:1px solid var(--jn-border-2);border-radius:10px;background:rgba(250,248,244,.14);padding:10px }
      .admin-v2-title h3 { color:var(--jn-heading);font-size:16px;font-weight:normal;margin-bottom:4px }
      .admin-v2-title p { color:var(--jn-text-soft);font-size:11px;line-height:1.5 }
      .admin-v2-tools { display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end }
      .admin-v2-tools input { min-width:180px;background:rgba(250,248,244,.22);border:1px solid rgba(107,90,76,.62);border-radius:999px;color:var(--jn-title);font-family:inherit;font-size:11px;padding:6px 10px }
      .admin-v2-tools button,.admin-v2-drawer button { background:linear-gradient(180deg,var(--jn-btn-top),var(--jn-btn-bottom));border:1px solid var(--jn-border);border-radius:999px;color:var(--jn-title);padding:6px 12px;font-family:inherit;cursor:pointer }
      .admin-v2-tools button.primary { border-color:var(--jn-gold);background:linear-gradient(180deg,#f5edcf,#cfba7b) }
      .admin-v2-content { display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:10px;min-height:0 }
      .admin-v2-table-wrap { border:1px solid var(--jn-border-2);border-radius:10px;background:rgba(250,248,244,.08);overflow:auto;max-height:58vh }
      .admin-v2-table { width:100%;min-width:980px;border-collapse:collapse;font-size:11px }
      .admin-v2-table th { position:sticky;top:0;background:var(--jn-surface-deep);z-index:1;color:var(--jn-text-muted);font-weight:normal;text-align:left;padding:7px;border-bottom:1px solid var(--jn-border) }
      .admin-v2-table td { padding:6px 7px;border-bottom:1px solid var(--jn-border-3);color:var(--jn-text-soft);vertical-align:middle }
      .admin-v2-table tr.sel td { background:rgba(191,214,193,.22) }
      .admin-v2-table input,.admin-v2-table select,.admin-v2-drawer input,.admin-v2-drawer select,.admin-v2-drawer textarea { width:100%;background:rgba(250,248,244,.2);border:1px solid rgba(107,90,76,.5);border-radius:6px;color:var(--jn-title);font-family:inherit;font-size:11px;padding:5px 7px }
      .admin-v2-table .mini { width:54px }
      .admin-v2-drawer { border:1px solid var(--jn-border-2);border-radius:10px;background:rgba(250,248,244,.12);padding:10px;overflow:auto;max-height:58vh }
      .admin-v2-drawer h4 { color:var(--jn-heading);font-size:13px;font-weight:normal;margin-bottom:8px }
      .admin-v2-drawer .cfg-field textarea { min-height:130px;font-family:monospace!important;font-size:10px!important }
      .trait-meta-table { min-width:2320px }
      .trait-meta-table th,.trait-meta-table td { padding:4px;border-right:1px solid var(--jn-border-3) }
      .trait-meta-table input,.trait-meta-table select { border-radius:2px;padding:4px 5px;min-width:92px }
      .trait-meta-table .trait-id-cell { min-width:118px;font-family:monospace;font-size:10px }
      .trait-meta-table .trait-opposite-cell { min-width:138px }
      .trait-meta-table .trait-desc-cell { min-width:220px }
      .trait-meta-table .trait-example-cell { min-width:190px }
      .trait-meta-table .trait-json-cell { min-width:130px;font-family:monospace;font-size:10px }
      .trait-meta-table .trait-pair-row td { position:sticky;top:28px;z-index:1;background:rgba(103,81,59,.9);color:#f4ead3;font-size:11px;letter-spacing:.08em }
      .character-builder-page { display:flex;flex-direction:column;gap:10px }
      .character-trait-tags { display:flex;gap:4px;flex-wrap:wrap;max-width:360px }
      .character-trait-tags .meta-tag { margin:0 }
      .character-editor-page { display:flex;flex-direction:column;gap:10px;min-height:0;overflow-x:hidden }
      .character-editor-top { display:grid;grid-template-columns:170px minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid var(--jn-border-2);border-radius:10px;background:rgba(250,248,244,.12);padding:8px }
      .character-editor-top select { width:100%;background:rgba(250,248,244,.22);border:1px solid rgba(107,90,76,.55);border-radius:999px;color:var(--jn-title);font-family:inherit;font-size:11px;padding:6px 10px }
      .character-avatar-strip { display:flex;gap:8px;overflow-x:auto;min-width:0;padding-bottom:2px }
      .character-avatar-btn { flex:0 0 auto;width:58px;border:1px solid var(--jn-border-3);border-radius:10px;background:rgba(250,248,244,.14);padding:4px;cursor:pointer;color:var(--jn-text-soft);font-family:inherit }
      .character-avatar-btn.active { border-color:var(--jn-gold);background:rgba(250,248,244,.3);box-shadow:0 0 0 2px var(--jn-gold-glow) }
      .character-avatar-btn img,.character-avatar-fallback { width:42px;height:42px;border-radius:8px;display:block;margin:0 auto 3px;object-fit:cover;object-position:center 12%;background:var(--jn-surface-active) }
      .character-avatar-btn span { display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;text-align:center }
      .character-editor-main { display:grid;grid-template-columns:minmax(220px,25%) minmax(0,1fr);gap:14px;min-height:58vh;overflow-x:hidden }
      .character-editor-portrait { border:1px solid var(--jn-border-2);border-radius:12px;background:rgba(250,248,244,.14);display:flex;flex-direction:column;min-height:0;overflow:hidden }
      .character-editor-portrait-art { flex:1;min-height:420px;display:flex;align-items:flex-start;justify-content:center;padding:10px;background:linear-gradient(180deg,rgba(250,248,244,.22),rgba(184,202,174,.16)) }
      .character-editor-portrait-art img { width:100%;height:100%;object-fit:contain;object-position:center top;display:block }
      .character-editor-portrait-fallback { width:100%;height:100%;border-radius:10px;display:flex;align-items:center;justify-content:center;color:rgba(61,48,40,.45);font-size:42px }
      .character-editor-summary { border-top:1px solid var(--jn-border-3);padding:9px 10px;color:var(--jn-text-soft);font-size:12px;line-height:1.55;background:rgba(250,248,244,.16) }
      .character-editor-right { display:flex;flex-direction:column;gap:12px;min-width:0;overflow-x:hidden }
      .character-editor-actions { display:flex;justify-content:flex-end;gap:8px;align-items:center;white-space:nowrap }
      .character-editor-actions button { background:linear-gradient(180deg,var(--jn-btn-top),var(--jn-btn-bottom));border:1px solid var(--jn-border);border-radius:999px;color:var(--jn-title);padding:5px 14px;font-family:inherit;cursor:pointer }
      .character-editor-actions button.primary { border-color:var(--jn-gold);background:linear-gradient(180deg,#f5edcf,#cfba7b) }
      .character-result-row { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px }
      .character-result-card { border:1px solid var(--jn-border-3);border-radius:10px;background:rgba(250,248,244,.16);padding:9px 10px;min-width:0;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.24) }
      .character-result-card label { display:block;color:var(--jn-text-dim);font-size:10px;margin-bottom:4px }
      .character-result-card b { color:var(--jn-title);font-size:13px;font-weight:normal }
      .character-result-card small { display:block;color:var(--jn-text-dim);font-size:9px;margin-top:4px }
      .character-result-card select,.character-result-card input { width:100%;background:rgba(250,248,244,.22);border:1px solid rgba(107,90,76,.55);border-radius:6px;color:var(--jn-title);font-family:inherit;font-size:12px;padding:4px 6px }
      .character-trait-columns { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;min-height:0;overflow-x:hidden;padding-top:10px }
      .character-trait-column { position:relative;min-width:0;border:1px solid var(--jn-border-3);border-radius:12px;background:rgba(250,248,244,.1);padding:19px 8px 8px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18);overflow:visible }
      .character-trait-column-head { position:absolute;left:12px;top:-11px;display:flex;align-items:center;justify-content:center;color:var(--jn-heading);z-index:2 }
      .character-trait-column-head h4 { font-size:13px;font-weight:normal;letter-spacing:.14em;cursor:help;border:1px solid rgba(168,128,46,.48);border-radius:999px;background:linear-gradient(180deg,#edf4e4,#dbe8cf);box-shadow:0 2px 8px rgba(78,61,43,.12);padding:3px 10px }
      .character-trait-collapse { position:absolute;right:8px;top:7px;z-index:2;width:24px;height:22px;border:1px solid rgba(107,90,76,.36);border-radius:999px;background:rgba(250,248,244,.42);color:var(--jn-title);font-family:inherit;font-size:12px;line-height:1;cursor:pointer }
      .character-trait-collapse:hover { border-color:rgba(168,128,46,.65);background:rgba(246,235,197,.65) }
      .character-trait-list { display:flex;flex-direction:column;gap:8px;max-height:42vh;overflow-y:auto;overflow-x:hidden;padding-right:2px }
      .character-trait-selected-summary { display:flex;flex-wrap:wrap;gap:6px;align-content:flex-start;min-height:38px;padding:4px 2px 2px }
      .character-trait-selected-summary .meta-tag { margin:0;background:rgba(246,235,197,.55);border-color:rgba(168,128,46,.42);color:var(--jn-title) }
      .character-trait-selected-summary .logic-muted { font-size:11px }
      .character-trait-pair { display:grid;grid-template-columns:16px minmax(2.4em,1fr) 16px minmax(2.4em,1fr);gap:4px;align-items:center;min-height:30px;padding:4px;border:1px solid rgba(107,90,76,.22);border-radius:10px;background:rgba(255,252,245,.18);min-width:0 }
      .character-trait-pair.single { grid-template-columns:16px minmax(2.4em,1fr) 16px minmax(2.4em,1fr) }
      .character-trait-icon { width:16px;height:16px;border:1px dashed rgba(107,90,76,.42);border-radius:5px;background:linear-gradient(180deg,rgba(250,248,244,.34),rgba(220,205,166,.2));box-shadow:inset 0 1px 0 rgba(255,255,255,.4) }
      .character-trait-icon.empty { opacity:.22 }
      .character-trait-name { position:relative;border:1px solid transparent;background:transparent;color:var(--jn-text-soft);font-family:inherit;font-size:12px;text-align:center;padding:5px 4px;border-radius:7px;cursor:help;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:clip }
      .character-trait-name:hover { color:var(--jn-title);background:rgba(250,248,244,.28);border-color:rgba(168,128,46,.28) }
      .character-trait-name.selected { color:var(--jn-title);background:linear-gradient(180deg,rgba(246,235,197,.72),rgba(213,190,128,.36));border-color:rgba(168,128,46,.58);font-weight:600;box-shadow:0 0 0 1px rgba(201,162,39,.1),inset 0 1px 0 rgba(255,255,255,.4) }
      .character-specialty-column textarea { width:100%;resize:vertical;background:rgba(250,248,244,.2);border:1px solid rgba(107,90,76,.5);border-radius:6px;color:var(--jn-title);font-family:monospace;font-size:10px;padding:7px;box-sizing:border-box }
      @media (max-width: 1180px) { .character-trait-columns { grid-template-columns:repeat(2,minmax(0,1fr)) } }
      .character-trait-name.editable { cursor:pointer }
      .character-editor-tooltip { position:relative }
      .character-trait-column-head.character-editor-tooltip { position:absolute }
      .admin-floating-tooltip { position:fixed;left:0;top:0;z-index:2147483647;max-width:280px;white-space:pre-line;text-align:left;line-height:1.55;color:#f6eedc;background:rgba(63,47,34,.97);border:1px solid rgba(218,190,120,.74);border-radius:9px;padding:8px 10px;box-shadow:0 10px 26px rgba(32,22,14,.34);font-size:11px;letter-spacing:0;pointer-events:none;opacity:0;transform:translate3d(-9999px,-9999px,0);transition:opacity .08s ease }
      .admin-floating-tooltip.visible { opacity:1 }
      .admin-v2-trait-json { margin-top:10px;border:1px solid var(--jn-border-2);border-radius:10px;background:rgba(250,248,244,.1);padding:10px }
      .admin-v2-trait-json details { margin-bottom:8px }
      .admin-v2-trait-json summary { cursor:pointer;color:var(--jn-heading);margin-bottom:6px }
      .admin-v2-trait-json textarea { width:100%;min-height:180px;background:rgba(250,248,244,.18);border:1px solid rgba(107,90,76,.5);border-radius:6px;color:var(--jn-title);font-family:monospace;font-size:10px;padding:8px }
      .relation-label-page { display:flex;flex-direction:column;gap:12px;min-width:0 }
      .relation-label-actions { display:flex;justify-content:flex-end;gap:8px }
      .relation-label-actions button { background:linear-gradient(180deg,var(--jn-btn-top),var(--jn-btn-bottom));border:1px solid var(--jn-border);border-radius:999px;color:var(--jn-title);padding:5px 14px;font-family:inherit;cursor:pointer }
      .relation-label-actions button.primary { border-color:var(--jn-gold);background:linear-gradient(180deg,#f5edcf,#cfba7b) }
      .relation-module { border:1px solid var(--jn-border-2);border-radius:12px;background:rgba(250,248,244,.1);padding:10px;min-width:0 }
      .relation-module-head { display:flex;align-items:baseline;gap:10px;margin-bottom:8px }
      .relation-module-head b { color:var(--jn-heading);font-size:18px;letter-spacing:.08em }
      .relation-module-head small { color:var(--jn-text-soft);font-size:11px;line-height:1.45 }
      .relation-label-table { min-width:980px }
      .relation-label-table.compact { min-width:760px }
      .relation-label-table th,.relation-label-table td { padding:4px 5px;height:30px;border-right:1px solid var(--jn-border-3) }
      .relation-label-table input,.relation-label-table select { border-radius:2px;padding:4px 5px;min-height:24px }
      .relation-label-table input:disabled,.relation-label-table select:disabled { opacity:.78;background:rgba(210,218,204,.22);color:var(--jn-text-muted) }
      .relation-axis-title { margin:9px 0 5px;color:var(--jn-heading);font-size:13px }
      .relation-axis-title b { font-size:16px }
      .relation-axis-title small { color:var(--jn-text-soft);font-size:10px;margin-left:8px }
      .admin-v2-empty { border:1px dashed var(--jn-border-3);border-radius:10px;padding:20px;color:var(--jn-text-soft);line-height:1.7;background:rgba(250,248,244,.1) }
      .admin-v2-kpis { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:10px }
      .admin-v2-kpi { border:1px solid var(--jn-border-3);border-radius:10px;background:rgba(250,248,244,.12);padding:10px }
      .admin-v2-kpi b { display:block;color:var(--jn-heading);font-size:18px }
      .admin-v2-kpi span { color:var(--jn-text-soft);font-size:10px }
      @media (max-width:900px) { .admin-v2 { grid-template-columns:1fr } .admin-v2-content { grid-template-columns:1fr } }
    </style>
    <div class="admin-v2">
      <aside class="admin-v2-side">${renderAdminV2Nav()}</aside>
      <main class="admin-v2-main">
        ${renderAdminV2Header(item)}
        ${renderAdminV2Section()}
      </main>
    </div>`;
  bindAdminV2Events();
}

function renderAdminV2Nav() {
  return ADMIN_V2_GROUPS.map(group => `
    <div class="admin-v2-group">
      <div class="admin-v2-group-title">${escapeHtml(group.label)}</div>
      ${group.items.map(item => `
        <button class="admin-v2-nav${item.id === adminV2Section ? ' active' : ''}" data-admin-v2-section="${item.id}">
          <span>${escapeHtml(item.label)}</span><span class="admin-v2-badge">${escapeHtml(item.status)}</span>
        </button>`).join('')}
    </div>`).join('');
}

function renderAdminV2Header(item) {
  const descriptions = {
    furnitureTemplates: '家具能做什么、恢复什么需求、是否基础生存、是否需要技能，都在这里配置。',
    furnitureInstances: '家具摆在哪里、属于哪个场景、坐标是多少，在这里维护。',
    characters: '人物总表是全员汇总，一人一行看身份、家庭、性格和摘要。',
    characterEditor: '人物设定是单个人物的捏人页，先预览家庭切换、头像选人、立绘和性格配置布局。',
    personalityMeta: '性格的分类、描述、对偶关系和运行效果。表格改动会自动保存，并同步到人物设定页。',
    relationLabels: '关系系统配置：面板四象限名称、综合关系标签、各轴阶段标签。关系面板和运行时阶段判断都会读取这里。',
    dashboard: '后续会放配置完整度、引用错误、最近改动和重点风险。',
    legacy: '旧后台完整保留，用来兜底尚未迁移的配置。',
  };
  return `
    <div class="admin-v2-head">
      <div class="admin-v2-title">
        <h3>${escapeHtml(item.label)}</h3>
        <p>${escapeHtml(descriptions[adminV2Section] || '该模块还未迁移到 v2，先保留占位。')}</p>
      </div>
      <div class="admin-v2-tools">
        ${['furnitureTemplates', 'furnitureInstances', 'personalityMeta'].includes(adminV2Section)
             ? `<input id="admin-v2-search" value="${adminAttr(adminV2Search)}" placeholder="搜索名称 / ID / 分类">
               <button class="primary" id="btn-admin-v2-add">${adminV2Section === 'furnitureInstances' ? '新增摆放' : adminV2Section === 'personalityMeta' ? '新增性格' : '新增模板'}</button>
               <button id="btn-admin-v2-validate">校验</button>`
          : ''}
        <button id="btn-admin-v2-open-legacy">旧后台</button>
      </div>
    </div>`;
}

function renderAdminV2Section() {
  if (adminV2Section === 'characters') return renderAdminV2Characters();
  if (adminV2Section === 'characterEditor') return renderAdminV2CharacterEditor();
  if (adminV2Section === 'furnitureTemplates') return renderAdminV2FurnitureTemplates();
  if (adminV2Section === 'furnitureInstances') return renderAdminV2FurnitureInstances();
  if (adminV2Section === 'personalityMeta') return renderAdminV2PersonalityMeta();
  if (adminV2Section === 'relationLabels') return renderAdminV2RelationLabels();
  if (adminV2Section === 'dashboard') return renderAdminV2Dashboard();
  if (adminV2Section === 'legacy') {
    return `<div class="admin-v2-empty">旧后台已完整保留。点击右上角「旧后台」会切回原来的多标签配置面板。</div>`;
  }
  return `<div class="admin-v2-empty">这个模块还没迁移。旧后台仍可用，等家具样板稳定后再按同一套表格/详情结构搬过来。</div>`;
}

function enumTags(items) {
  return items.map(item => `<span class="tag">${escapeHtml(String(item))}</span>`).join('');
}

function relationPanelConfigForAdmin() {
  if (adminV2RelationLabelsEditing && adminV2RelationLabelsDraft) return adminV2RelationLabelsDraft;
  const def = DEFAULT_CONFIG.relationPanelConfig || {};
  const cur = CONFIG.relationPanelConfig || {};
  const cfg = {
    familyRelations: cur.familyRelations?.length ? cur.familyRelations : def.familyRelations || [],
    quadrantLabels: { ...(def.quadrantLabels || {}), ...(cur.quadrantLabels || {}) },
    summaryLabels: { ...(def.summaryLabels || {}), ...(cur.summaryLabels || {}) },
    axisStageLabels: {
      ...(def.axisStageLabels || {}),
      ...(cur.axisStageLabels || {}),
    },
    compositeRelationRules: cur.compositeRelationRules?.length ? cur.compositeRelationRules : def.compositeRelationRules || [],
  };
  cfg.axisStageLabels = Object.fromEntries(
    Object.entries(cfg.axisStageLabels || {}).map(([axis, rows]) => [axis, normalizeRelationStageRowsForAdmin(axis, rows)])
  );
  return cfg;
}

function normalizeRelationStageRowsForAdmin(axis, rows) {
  if (!rows?.length) return rows || [];
  const defaults = DEFAULT_CONFIG.relationPanelConfig?.axisStageLabels?.[axis];
  if (rows.length !== 6 && defaults?.length === 6) return defaults;
  const usesOldZeroToHundred = rows.every(row => (row.min ?? 0) >= 0) && rows[0]?.min === 0;
  if (!usesOldZeroToHundred) return rows;
  if (defaults?.length && defaults[0]?.min === -100) return defaults;
  return rows.map((row, i) => ({
    ...row,
    min: (row.min * 2) - 100,
    max: rows[i + 1]?.min != null ? (rows[i + 1].min * 2) - 100 : 100,
  }));
}

function relationAxisAdminRows() {
  return [
    { key: 'friendship', title: '友谊', en: 'Friendship', range: '实际值 -100～100；阶段开端 -100～100', note: '共同经历积累，极慢衰减；显示在关系图左上' },
    { key: 'affection', title: '姻缘', en: 'Affinity', range: '实际值 -100～100；阶段开端 -100～100', note: '情感倾向，变化快；显示在关系图右上；底层轴名 affection' },
    { key: 'trust', title: '信任', en: 'Trust', range: '实际值 -100～100；阶段开端 -100～100', note: '可靠感，积累慢、崩塌快；显示在关系图左下' },
  ];
}

function relationLabelInputAttrs(editing) {
  return editing ? '' : ' disabled';
}

function relationStageEnd(rows, idx) {
  const next = rows?.[idx + 1]?.min;
  if (Number.isFinite(next)) return next;
  return rows?.[idx]?.max ?? 100;
}

function relationRangeText(rows, idx) {
  const row = rows[idx] || {};
  const end = idx >= (rows?.length || 0) - 1
    ? relationStageEnd(rows, idx)
    : relationStageEnd(rows, idx) - 1;
  return `${row.min ?? 0} ~ ${end}`;
}

function renderRelationModuleHead(title, note) {
  return `<div class="relation-module-head"><b>【${escapeHtml(title)}】</b><small>${escapeHtml(note)}</small></div>`;
}

function renderRelationFamilyModule(cfg, editing) {
  const disabled = relationLabelInputAttrs(editing);
  const rows = cfg.familyRelations?.length ? cfg.familyRelations : DEFAULT_CONFIG.relationPanelConfig.familyRelations || [];
  return `<section class="relation-module">
    ${renderRelationModuleHead('家庭关系', '合并原“人物摘要”和“家庭角色”这两层概念；维护家主、仆从、配偶、长辈、手足、晚辈、子女等基础关系。')}
    <div class="admin-v2-table-wrap" style="max-height:34vh">
      <table class="admin-v2-table relation-label-table compact">
        <thead><tr><th style="width:120px">关系名</th><th>关系描述</th><th>关系效果</th></tr></thead>
        <tbody>
          ${rows.map((row, i) => `<tr>
            <td><input data-rel-family-idx="${i}" data-field="name" value="${adminAttr(row.name || '')}"${disabled}></td>
            <td><input data-rel-family-idx="${i}" data-field="description" value="${adminAttr(row.description || '')}"${disabled}></td>
            <td><input data-rel-family-idx="${i}" data-field="effect" value="${adminAttr(row.effect || '')}"${disabled}></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderRelationQuadrantModule(q, stages, editing) {
  const disabled = relationLabelInputAttrs(editing);
  const quadrantRows = [
    ['friendship', '友谊', q.friendship || '友谊'],
    ['affinity', '姻缘', q.affinity || '姻缘'],
    ['trust', '信任', q.trust || '信任'],
    ['servantToMaster', '服从', q.servantToMaster || '服从'],
    ['masterToServant', '体恤', q.masterToServant || '体恤'],
    ['filialPiety', '孝道', q.filialPiety || '孝道'],
    ['parentalCare', '慈爱', q.parentalCare || '慈爱'],
  ];
  const serviceRows = stages.submission || [];
  const careRows = stages.care || [];
  return `<section class="relation-module">
    ${renderRelationModuleHead('通用关系', '关系面板四象限显示名，以及友谊、姻缘、信任、服从/体恤的阶段标签。')}
    <div class="admin-v2-table-wrap" style="max-height:120px;margin-bottom:8px">
      <table class="admin-v2-table relation-label-table compact">
        <thead><tr>${quadrantRows.map(row => `<th>${escapeHtml(row[1])}</th>`).join('')}</tr></thead>
        <tbody><tr>${quadrantRows.map(([key, label, value]) =>
          `<td><input data-rel-label="${key}" aria-label="${escapeHtml(label)}" value="${adminAttr(value)}"${disabled}></td>`
        ).join('')}</tr></tbody>
      </table>
    </div>

    ${relationAxisAdminRows().map(axis => `<div class="relation-axis-block">
      <div class="relation-axis-title"><b>【${escapeHtml(axis.title)}${escapeHtml(axis.en)}】</b><small>${escapeHtml(axis.range)}，${escapeHtml(axis.note)}</small></div>
      <div class="admin-v2-table-wrap" style="max-height:190px">
        <table class="admin-v2-table relation-label-table compact">
          <thead><tr><th style="width:76px">开端</th><th style="width:86px">区间</th><th style="width:120px">标签名</th><th style="width:120px">关系名</th><th>表现说明</th><th>可用互动示例</th></tr></thead>
          <tbody>${(stages[axis.key] || []).map((row, i) => `<tr>
            <td><input type="number" min="-100" max="100" step="1" data-rel-stage-axis="${axis.key}" data-idx="${i}" data-field="min" value="${row.min}"${disabled}></td>
            <td style="color:var(--jn-text-muted);font-family:monospace">${escapeHtml(relationRangeText(stages[axis.key] || [], i))}</td>
            <td><input data-rel-stage-axis="${axis.key}" data-idx="${i}" data-field="label" value="${adminAttr(row.label || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="${axis.key}" data-idx="${i}" data-field="relationName" value="${adminAttr(row.relationName || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="${axis.key}" data-idx="${i}" data-field="behavior" value="${adminAttr(row.behavior || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="${axis.key}" data-idx="${i}" data-field="examples" value="${adminAttr(row.examples || '')}"${disabled}></td>
            <input type="hidden" data-rel-stage-axis="${axis.key}" data-idx="${i}" data-field="alt" value="${adminAttr(row.alt || '')}">
            <input type="hidden" data-rel-stage-axis="${axis.key}" data-idx="${i}" data-field="plain" value="${adminAttr(row.plain || '')}">
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`).join('')}

    <div class="relation-axis-title"><b>【服从Submission ↔ 体恤Care】</b><small>实际值 -100～100，方向性主仆维度；仆从看主子为服从，主子看仆从为体恤</small></div>
    <div class="admin-v2-table-wrap" style="max-height:220px">
      <table class="admin-v2-table relation-label-table">
        <thead><tr><th style="width:76px">开端</th><th style="width:86px">区间</th><th style="width:120px">服从标签</th><th>服从表现</th><th>服从互动示例</th><th style="width:120px">体恤标签</th><th>体恤表现</th><th>体恤互动示例</th></tr></thead>
        <tbody>${serviceRows.map((row, i) => {
          const care = careRows[i] || {};
          return `<tr>
            <td><input type="number" min="-100" max="100" step="1" data-rel-stage-axis="submission" data-idx="${i}" data-field="min" value="${row.min}"${disabled}></td>
            <td style="color:var(--jn-text-muted);font-family:monospace">${escapeHtml(relationRangeText(serviceRows, i))}</td>
            <input type="hidden" data-rel-stage-axis="care" data-idx="${i}" data-field="min" value="${care.min ?? row.min}">
            <td><input data-rel-stage-axis="submission" data-idx="${i}" data-field="label" value="${adminAttr(row.label || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="submission" data-idx="${i}" data-field="behavior" value="${adminAttr(row.behavior || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="submission" data-idx="${i}" data-field="examples" value="${adminAttr(row.examples || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="care" data-idx="${i}" data-field="label" value="${adminAttr(care.label || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="care" data-idx="${i}" data-field="behavior" value="${adminAttr(care.behavior || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="care" data-idx="${i}" data-field="examples" value="${adminAttr(care.examples || '')}"${disabled}></td>
            <input type="hidden" data-rel-stage-axis="submission" data-idx="${i}" data-field="alt" value="${adminAttr(row.alt || '')}">
            <input type="hidden" data-rel-stage-axis="submission" data-idx="${i}" data-field="plain" value="${adminAttr(row.plain || '')}">
            <input type="hidden" data-rel-stage-axis="care" data-idx="${i}" data-field="alt" value="${adminAttr(care.alt || care.label || '')}">
            <input type="hidden" data-rel-stage-axis="care" data-idx="${i}" data-field="plain" value="${adminAttr(care.plain || care.label || '')}">
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>
    <div class="relation-axis-title"><b>【孝道FilialPiety ↔ 慈爱ParentalCare】</b><small>实际值 -100～100，亲缘第四象限；晚辈看长辈为孝道，长辈看晚辈为慈爱</small></div>
    <div class="admin-v2-table-wrap" style="max-height:220px">
      <table class="admin-v2-table relation-label-table">
        <thead><tr><th style="width:76px">开端</th><th style="width:86px">区间</th><th style="width:120px">孝道标签</th><th>孝道表现</th><th>孝道互动示例</th><th style="width:120px">慈爱标签</th><th>慈爱表现</th><th>慈爱互动示例</th></tr></thead>
        <tbody>${(stages.filialPiety || []).map((row, i) => {
          const care = (stages.parentalCare || [])[i] || {};
          return `<tr>
            <td><input type="number" min="-100" max="100" step="1" data-rel-stage-axis="filialPiety" data-idx="${i}" data-field="min" value="${row.min}"${disabled}></td>
            <td style="color:var(--jn-text-muted);font-family:monospace">${escapeHtml(relationRangeText(stages.filialPiety || [], i))}</td>
            <input type="hidden" data-rel-stage-axis="parentalCare" data-idx="${i}" data-field="min" value="${care.min ?? row.min}">
            <td><input data-rel-stage-axis="filialPiety" data-idx="${i}" data-field="label" value="${adminAttr(row.label || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="filialPiety" data-idx="${i}" data-field="behavior" value="${adminAttr(row.behavior || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="filialPiety" data-idx="${i}" data-field="examples" value="${adminAttr(row.examples || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="parentalCare" data-idx="${i}" data-field="label" value="${adminAttr(care.label || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="parentalCare" data-idx="${i}" data-field="behavior" value="${adminAttr(care.behavior || '')}"${disabled}></td>
            <td><input data-rel-stage-axis="parentalCare" data-idx="${i}" data-field="examples" value="${adminAttr(care.examples || '')}"${disabled}></td>
            <input type="hidden" data-rel-stage-axis="filialPiety" data-idx="${i}" data-field="alt" value="${adminAttr(row.alt || row.label || '')}">
            <input type="hidden" data-rel-stage-axis="filialPiety" data-idx="${i}" data-field="plain" value="${adminAttr(row.plain || row.label || '')}">
            <input type="hidden" data-rel-stage-axis="parentalCare" data-idx="${i}" data-field="alt" value="${adminAttr(care.alt || care.label || '')}">
            <input type="hidden" data-rel-stage-axis="parentalCare" data-idx="${i}" data-field="plain" value="${adminAttr(care.plain || care.label || '')}">
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>
  </section>`;
}

function renderRelationCompositeModule(cfg, editing) {
  const disabled = relationLabelInputAttrs(editing);
  const rules = cfg.compositeRelationRules || [];
  return `<section class="relation-module">
    ${renderRelationModuleHead('综合关系', '把家庭关系与通用关系组合成更有戏剧性的关系标签；已导入默认规则，仍支持新增。')}
    <div class="admin-v2-table-wrap" style="max-height:34vh">
      <table class="admin-v2-table relation-label-table">
        <thead><tr><th style="width:110px">家庭关系</th><th style="width:120px">友谊</th><th style="width:120px">姻缘</th><th style="width:120px">信任</th><th style="width:150px">第四象限</th><th style="width:150px">综合关系标签</th><th>示例</th><th style="width:60px">操作</th></tr></thead>
        <tbody>
          ${rules.length ? rules.map((row, i) => `<tr>
            <td><input data-rel-composite-idx="${i}" data-field="familyRelation" value="${adminAttr(row.familyRelation || '')}"${disabled}></td>
            <td><input data-rel-composite-idx="${i}" data-field="friendship" value="${adminAttr(row.friendship || '')}"${disabled}></td>
            <td><input data-rel-composite-idx="${i}" data-field="affection" value="${adminAttr(row.affection || '')}"${disabled}></td>
            <td><input data-rel-composite-idx="${i}" data-field="trust" value="${adminAttr(row.trust || '')}"${disabled}></td>
            <td><input data-rel-composite-idx="${i}" data-field="service" value="${adminAttr(row.service || '')}"${disabled}></td>
            <td><input data-rel-composite-idx="${i}" data-field="label" value="${adminAttr(row.label || '')}"${disabled}></td>
            <td><input data-rel-composite-idx="${i}" data-field="example" value="${adminAttr(row.example || '')}"${disabled}></td>
            <td><button data-rel-composite-delete="${i}" ${editing ? '' : 'disabled'}>删</button></td>
          </tr>`).join('') : `<tr><td colspan="8" style="color:var(--jn-text-soft);text-align:center;padding:12px">暂无综合关系规则。点击编辑后可新增。</td></tr>`}
        </tbody>
      </table>
    </div>
    <div class="adm-actions" style="margin-top:8px">
      <button id="btn-add-relation-composite" ${editing ? '' : 'disabled'}>+ 新增综合关系规则</button>
    </div>
  </section>`;
}

function renderAdminV2RelationLabels() {
  const cfg = relationPanelConfigForAdmin();
  const q = cfg.quadrantLabels || {};
  const stages = cfg.axisStageLabels || {};
  const editing = adminV2RelationLabelsEditing;
  const actions = editing
    ? `<button id="btn-cancel-relation-labels">取消</button><button class="primary" id="btn-save-relation-labels">保存</button>`
    : `<button class="primary" id="btn-edit-relation-labels">编辑</button>`;
  return `<div class="relation-label-page">
    <div class="relation-label-actions">${actions}</div>
    ${renderRelationFamilyModule(cfg, editing)}
    ${renderRelationQuadrantModule(q, stages, editing)}
    ${renderRelationCompositeModule(cfg, editing)}
    <p style="font-size:10px;color:var(--jn-text-soft);line-height:1.6">
      说明：家庭关系用于统一家庭角色/人物摘要；通用关系控制关系面板四象限和阶段名；综合关系规则用于未来把家庭关系与四轴数值组合成戏剧化标签。
    </p>
  </div>`;
}

function adminAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}

function characterEnumHtml() {
  const ranks = Object.entries(CONFIG.identityProtocolConfig?.rankLabels || {})
    .map(([id, name]) => `${id}=${name}`);
  const roles = [...new Set((CONFIG.familyConfig?.families || []).flatMap(f => (f.members || []).map(m => m.role)))];
  const attrs = [...new Set(CONFIG.characters.flatMap(c => Object.keys(c.attributes || {})))];
  return `
    <div class="cfg-enums">
      <b>当前枚举</b>
      <p>性别：${enumTags(['男', '女'])}</p>
      <p>身份位阶：${enumTags(ranks)}</p>
      <p>家庭角色：${enumTags(roles)}</p>
      <p>基础属性键：${enumTags(attrs)}</p>
      <p>技能 ID：${enumTags(Object.keys(CONFIG.skillDefs || {}))}</p>
    </div>`;
}

function characterFamilyMembership(charId) {
  for (const family of CONFIG.familyConfig?.families || []) {
    const member = family.members?.find(row => row.charId === charId);
    if (member) return { family, member };
  }
  return { family: null, member: null };
}

function renderCharacterAdminV2() {
  const c = CONFIG.characters[adminSelChar] || CONFIG.characters[0];
  const profile = CharacterLogicSystem?.profile?.(c.id);
  const summary = profile ? renderCharacterLogicOverview(profile) : '';
  const specialty = CONFIG.charSpecialtyConfig?.profiles?.[c.id] || {};
  const membership = characterFamilyMembership(c.id);
  const familyOptions = (CONFIG.familyConfig?.families || []).map(f =>
    `<option value="${f.id}"${membership.family?.id === f.id ? ' selected' : ''}>${escapeHtml(f.name)}</option>`
  ).join('');
  const pathOptions = Object.entries(CONFIG.lifePathConfig?.paths || {}).map(([id, path]) =>
    `<option value="${id}"${c.lifePath === id ? ' selected' : ''}>${escapeHtml(path.name || id)}</option>`
  ).join('');
  const needFields = getNeedDefs().map(need =>
    `<div class="cfg-field"><label>${escapeHtml(need.label)} · ${escapeHtml(need.key)}</label>
      <input type="number" min="0" max="100" data-char-need="${escapeHtml(need.key)}" value="${Math.round(c.needs?.[need.key] ?? 50)}">
    </div>`
  ).join('');
  return `
    <style>
      .cfg-enums { background:rgba(250,248,244,.18);border:1px solid rgba(107,90,76,.35);border-radius:8px;padding:8px;margin-bottom:10px;font-size:10px;color:var(--jn-text-soft) }
      .cfg-enums b { color:var(--jn-heading);font-size:11px }
      .cfg-enums p { margin-top:5px;line-height:1.6 }
      .crud-shell { display:grid;grid-template-columns:190px minmax(0,1fr);gap:12px }
      .crud-toolbar { display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 }
      .crud-toolbar button { background:linear-gradient(180deg,var(--jn-btn-top),var(--jn-btn-bottom));border:1px solid var(--jn-border);border-radius:999px;color:var(--jn-title);padding:5px 12px;font-family:inherit;cursor:pointer }
      .crud-toolbar button.primary { border-color:var(--jn-gold);background:linear-gradient(180deg,#f5edcf,#cfba7b) }
      .crud-toolbar button.danger { border-color:var(--jn-red-dark);color:var(--jn-red-deep) }
      .crud-toolbar button:disabled { opacity:.45;cursor:not-allowed }
      .crud-list { max-height:480px }
      .crud-list .cfg-item { display:flex;justify-content:space-between;gap:8px }
      .crud-id { color:var(--jn-text-dim);font-size:9px }
      .crud-json { width:100%;min-height:280px;font-family:monospace;font-size:11px }
      .crud-import { width:100%;min-height:150px;font-family:monospace;font-size:10px }
      .char-logic-panel { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:12px }
      .logic-card { background:rgba(250,248,244,.18);border:1px solid rgba(107,90,76,.38);border-radius:8px;padding:8px;min-width:0 }
      .logic-card h4 { color:var(--jn-heading);font-size:12px;font-weight:normal;margin-bottom:6px }
      .logic-card p { color:var(--jn-text-soft);font-size:11px;line-height:1.45;margin-bottom:3px }
      .logic-card-wide { grid-column:1/-1 }
      .logic-row { display:flex;justify-content:space-between;gap:8px;color:var(--jn-text-soft);font-size:11px;margin-bottom:3px }
      .logic-row b { color:var(--jn-title);font-weight:normal }
      .logic-muted { color:var(--jn-text-dim);font-size:11px }
      .logic-need { display:flex;flex-direction:column;gap:1px;margin-bottom:4px;color:var(--jn-title);font-size:11px }
      .logic-need small { color:var(--jn-text-dim);font-size:9px }
      .logic-card ul { margin-left:16px;color:var(--jn-text-soft);font-size:11px;line-height:1.5 }
      .char-meta-grid { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px }
      .char-meta-grid .wide { grid-column:span 2 }
      .char-advanced summary { cursor:pointer;color:var(--jn-heading);font-size:11px;margin:10px 0 6px }
    </style>
    ${characterEnumHtml()}
    <div class="crud-shell">
      <div>
        <div class="cfg-list crud-list">${CONFIG.characters.map((ch, i) =>
          `<div class="cfg-item${i === adminSelChar ? ' sel' : ''}" data-cidx="${i}">
            <span>${escapeHtml(ch.name)}</span><span class="crud-id">${escapeHtml(ch.id)}</span>
          </div>`).join('')}</div>
        <div class="crud-toolbar">
          <button id="btn-char-add">新增</button>
          <button class="danger" id="btn-char-delete">删除</button>
        </div>
      </div>
      <div>
        <div class="section-title">${escapeHtml(c.name)} · 运行汇总</div>
        ${summary}
        <div class="section-title">人物聚合配置</div>
        <div class="char-meta-grid">
          <div class="cfg-field"><label>姓名</label><input id="char-meta-name" value="${escapeHtml(c.name)}"></div>
          <div class="cfg-field"><label>简称</label><input id="char-meta-short" value="${escapeHtml(c.short)}"></div>
          <div class="cfg-field"><label>性别</label><select id="char-meta-gender">
            <option value="女"${c.gender === '女' ? ' selected' : ''}>女</option>
            <option value="男"${c.gender === '男' ? ' selected' : ''}>男</option>
          </select></div>
          <div class="cfg-field"><label>基础身份位阶</label><input id="char-meta-rank" type="number" min="0" max="6" value="${c.socialRank ?? 5}"></div>
          <div class="cfg-field"><label>所属家庭</label><select id="char-meta-family"><option value="">未加入家庭</option>${familyOptions}</select></div>
          <div class="cfg-field"><label>家庭身份</label><input id="char-meta-role" value="${escapeHtml(membership.member?.role || '')}" placeholder="家主/配偶/晚辈/仆从"></div>
          <div class="cfg-field"><label>人生路径</label><select id="char-meta-path"><option value="">未选择路径</option>${pathOptions}</select></div>
          <div class="cfg-field"><label>归属倾向</label><input id="char-meta-homeward" type="number" min="0" max="100" value="${c.homewardness ?? 50}"></div>
          <div class="cfg-field wide"><label>人物短评</label><input id="char-meta-comment" value="${escapeHtml(c.shortComment || '')}"></div>
          <div class="cfg-field wide"><label>长期性格描述</label><textarea id="char-meta-personality">${escapeHtml(c.personality || '')}</textarea></div>
          <div class="cfg-field wide"><label>性格标签（逗号分隔）</label><input id="char-meta-traits" value="${escapeHtml((specialty.aiTraits || []).join(','))}"></div>
          <div class="cfg-field wide"><label>展示标签（逗号分隔）</label><input id="char-meta-display-traits" value="${escapeHtml((specialty.displayTraits || []).join(','))}"></div>
        </div>
        <div class="section-title">当前需求值</div>
        <div class="char-meta-grid">${needFields}</div>
        <div class="crud-toolbar">
          <button class="primary" id="btn-char-meta-save">保存聚合配置</button>
        </div>
        <details class="char-advanced">
          <summary>高级配置 JSON</summary>
          <textarea id="char-v2-json" class="crud-json">${escapeHtml(JSON.stringify(c, null, 2))}</textarea>
        </details>
        <div class="crud-toolbar">
          <button id="btn-char-v2-save">保存高级 JSON</button>
          <button id="btn-char-export">导出全部人物</button>
          <button id="btn-char-import">导入全部人物</button>
        </div>
        <textarea id="char-v2-import" class="crud-import" placeholder="导出内容或粘贴 characters 数组"></textarea>
      </div>
    </div>`;
}

function syncTraitLabelsFromMetadata() {
  CONFIG.charSpecialtyConfig ||= {};
  CONFIG.charSpecialtyConfig.traitLabels ||= {};
  for (const [id, row] of Object.entries(CONFIG.charSpecialtyConfig.traitMetadata || {})) {
    if (row?.label) CONFIG.charSpecialtyConfig.traitLabels[id] = row.label;
  }
}

function adminSpecialtyMetaKey(charId, specId) {
  const meta = CONFIG.charSpecialtyConfig?.specialtyMetadata || {};
  const ownerKey = `${charId}.${specId}`;
  return meta[ownerKey] ? ownerKey : specId;
}

function adminSpecialtyMeta(charId, spec) {
  const meta = CONFIG.charSpecialtyConfig?.specialtyMetadata || {};
  return meta[adminSpecialtyMetaKey(charId, spec?.id)] || spec || {};
}

function adminSpecialtyDetailTitle(charId, spec) {
  const row = adminSpecialtyMeta(charId, spec);
  const bits = [
    row.description || spec?.desc || '',
    ...(row.effectExamples || []),
    (row.systems || spec?.systems || []).length ? `系统：${(row.systems || spec?.systems || []).join(' / ')}` : '',
  ].filter(Boolean);
  return bits.join('\n');
}

function configCrudSpec(tab) {
  const specialtyChecks = [
    'always', 'sceneFemale', 'aloneDesk', 'eveningOutdoor', 'afternoon', 'morning',
    'sceneConflict', 'sceneCrowd3', 'sceneTalking', 'lowFun', 'questFollow',
    'xirenAway', 'avoid_wife', 'cling_feng', 'daiyuDistress', 'state:<状态ID>',
  ];
  const specs = {
    specialties: {
      title: '人物性格配置',
      wholeGet: () => CONFIG.charSpecialtyConfig.profiles,
      wholeSet: value => { CONFIG.charSpecialtyConfig.profiles = value.profiles || value; },
      enums: () => `
        <p>用途：给每个人物分配性格标签、人物专长和触发条件。</p>
        <p>标准性格：${enumTags(Object.entries(CONFIG.charSpecialtyConfig?.traitMetadata || {}).map(([id, row]) => `${id}=${row.label}`))}</p>
        <p>人物专长条件：${enumTags(specialtyChecks)}</p>
        <p>说明：性格本身的分类、描述和效果示例，请在「【人物】性格系统」中维护。</p>
        <p>影响系统：${enumTags(['AI权重', '状态', '需求', '任务', 'AI观察', '叙事气泡', '时段'])}</p>`,
      groups: {
        profiles: { label: '人物性格与专长', type: 'object', get: () => CONFIG.charSpecialtyConfig.profiles, itemLabel: (v, k) => `${getCharDef(k)?.name || k}` },
      },
      newValue: () => ({ aiTraits: [], displayTraits: [], specialties: [], checks: {} }),
    },
    personalityMeta: {
      title: '性格系统',
      wholeGet: () => ({
        traitMetadata: CONFIG.charSpecialtyConfig.traitMetadata,
        specialtyMetadata: CONFIG.charSpecialtyConfig.specialtyMetadata,
        traitModifiers: CONFIG.charSpecialtyConfig.traitModifiers,
        traitNarratives: CONFIG.charSpecialtyConfig.traitNarratives,
      }),
      wholeSet: value => {
        CONFIG.charSpecialtyConfig.traitMetadata = value.traitMetadata || value;
        if (value.specialtyMetadata) CONFIG.charSpecialtyConfig.specialtyMetadata = value.specialtyMetadata;
        if (value.traitModifiers) CONFIG.charSpecialtyConfig.traitModifiers = value.traitModifiers;
        if (value.traitNarratives) CONFIG.charSpecialtyConfig.traitNarratives = value.traitNarratives;
        syncTraitLabelsFromMetadata();
      },
      enums: () => `
        <p>分类：${enumTags(TRAIT_CATEGORY_OPTIONS)}</p>
        <p>标准标签：共 ${Object.keys(CONFIG.charSpecialtyConfig?.traitMetadata || {}).length} 个，来源为《0615_细化性格.md》。</p>
        <p>人物专属性格：共 ${Object.keys(CONFIG.charSpecialtyConfig?.specialtyMetadata || {}).length} 个，key 可用 specialtyId；重名时使用 人物ID.specialtyId。</p>
        <p>性格系统字段：${enumTags(['label', 'category', 'description', 'effectExamples', 'effects'])}</p>
        <p>运行效果：${enumTags(['actionWeights', 'needCoeffs', 'needThresholds', 'stateChance', 'stateDuration', 'stateRecovery', 'relation', 'social', 'quest', 'movement'])}</p>
        <p>性格气泡事件：${enumTags(['action', 'accept', 'decline', 'memory', 'forget', 'spend', 'win', 'lose', 'fail'])}</p>
        <p>AI 权重字段：${enumTags(['boost', 'cut'])}</p>
        <p>兼容旧标签：${enumTags(Object.entries(CONFIG.charSpecialtyConfig?.traitLabels || {})
          .filter(([id]) => !CONFIG.charSpecialtyConfig?.traitMetadata?.[id])
          .map(([id, label]) => `${id}=${label}`))}</p>`,
      groups: {
        traitMetadata: { label: '性格定义', type: 'object', get: () => CONFIG.charSpecialtyConfig.traitMetadata, itemLabel: (v, k) => `${v.label || k} · ${v.category || '未分类'}` },
        specialtyMetadata: { label: '人物专属性格定义', type: 'object', get: () => CONFIG.charSpecialtyConfig.specialtyMetadata, itemLabel: (v, k) => `${v.label || k} · ${getCharDef(v.ownerId)?.name || v.ownerId || '未绑定'}` },
        traitNarratives: { label: '性格叙事气泡', type: 'object', get: () => CONFIG.charSpecialtyConfig.traitNarratives, itemLabel: (v, k) => `${CONFIG.charSpecialtyConfig.traitLabels?.[k] || k} · ${Object.keys(v || {}).join('/')}` },
        traitModifiers: { label: 'AI 行为权重', type: 'object', get: () => CONFIG.charSpecialtyConfig.traitModifiers, itemLabel: (v, k) => `${CONFIG.charSpecialtyConfig.traitLabels?.[k] || k} · ${k}` },
      },
      newValue: group => group === 'traitMetadata'
        ? { label: '新性格', category: '性情', description: '', effectExamples: [] }
        : group === 'specialtyMetadata'
          ? { ownerId: '', label: '新专属性格', category: '专属性格', description: '', systems: [], effectExamples: [], effects: {} }
        : group === 'traitNarratives'
          ? { action: ['在此填写人物心声。'] }
        : { boost: {}, cut: {} },
    },
    states: {
      title: '状态 Metadata',
      wholeGet: () => CONFIG.stateDefs,
      wholeSet: value => { CONFIG.stateDefs = value; },
      enums: () => `
        <p>状态 ID：左侧列表为完整枚举，共 ${Object.keys(CONFIG.stateDefs || {}).length} 项</p>
        <p>需求键：${enumTags(getNeedDefs().map(n => n.key))}</p>
        <p>技能键：${enumTags(Object.keys(CONFIG.skillDefs || {}))}</p>
        <p>触发运算：${enumTags(['lt', 'gt'])}；持续时间 -1=永久</p>
        <p>常用字段：${enumTags(['name', 'duration', 'desc', 'category', 'polarity', 'blockedSkills', 'needMods', 'aiModifiers', 'traitEffects', 'trigger', 'conflictGroup'])}</p>`,
      groups: {
        definitions: { label: '状态定义', type: 'object', get: () => CONFIG.stateDefs, itemLabel: (v, k) => `${v.name || k} · ${k}` },
      },
      newValue: () => ({ name: '新状态', duration: 30, desc: '', blockedSkills: [], needMods: {} }),
    },
    identityProtocol: {
      title: '身份 Metadata',
      wholeGet: () => ({
        identityProtocolConfig: CONFIG.identityProtocolConfig,
        sceneAccessConfig: CONFIG.sceneAccessConfig,
      }),
      wholeSet: value => {
        if (value.identityProtocolConfig) CONFIG.identityProtocolConfig = value.identityProtocolConfig;
        if (value.sceneAccessConfig) CONFIG.sceneAccessConfig = value.sceneAccessConfig;
      },
      enums: () => `
        <p>身份位阶：${enumTags(Object.entries(CONFIG.identityProtocolConfig?.rankLabels || {}).map(([k, v]) => `${k}=${v}`))}</p>
        <p>位阶关系：${enumTags(Object.keys(CONFIG.identityProtocolConfig?.hierarchyLabels || {}))}</p>
        <p>规则行为：${enumTags(['allowed', 'conditional', 'risky', 'forbidden'])}</p>
        <p>场景类型：${enumTags(Object.keys(CONFIG.sceneAccessConfig?.sceneTypeLabels || {}))}</p>
        <p>身体接触：${enumTags(['none', 'touch', 'embrace', 'kiss', 'massage'])}</p>`,
      groups: {
        protocolRules: { label: '身份礼法规则', type: 'array', get: () => CONFIG.identityProtocolConfig.rules, itemLabel: (v, k) => `${k + 1}. ${v.rel} · ${v.cat} · ${v.behavior}` },
        scenePrivileges: { label: '场景权限', type: 'array', get: () => CONFIG.sceneAccessConfig.privileges, itemLabel: (v, k) => `${k + 1}. ${v.role}` },
        rankLabels: { label: '位阶名称', type: 'object', get: () => CONFIG.identityProtocolConfig.rankLabels, itemLabel: (v, k) => `${k}=${v}` },
        addresses: { label: '关系称呼', type: 'object', get: () => CONFIG.identityProtocolConfig.addressByInitType, itemLabel: (v, k) => k },
      },
      newValue: group => group === 'protocolRules'
        ? { rel: 'peer', cat: '叙旧', behavior: 'allowed' }
        : group === 'scenePrivileges'
          ? { role: '新身份', roleRank: 5, sceneTypesAllowed: ['public'], canEnterAnyPrivate: false, mustBeInvitedFor: [], additionalRules: [] }
          : group === 'rankLabels' ? '新位阶' : { hint: '称呼规则' },
    },
    lifePath: {
      title: '路径 Metadata',
      wholeGet: () => CONFIG.lifePathConfig,
      wholeSet: value => { CONFIG.lifePathConfig = value; },
      enums: () => `
        <p>路径 ID：${enumTags(Object.keys(CONFIG.lifePathConfig?.paths || {}))}</p>
        <p>阶段 ID：${enumTags(Object.keys(CONFIG.lifePathConfig?.stages || {}))}</p>
        <p>性别限制：${enumTags(['any', 'female_only', 'male_only', 'male_female_only'])}</p>
        <p>任务/奖励可用技能：${enumTags(Object.keys(CONFIG.skillDefs || {}))}</p>
        <p>故事节点类型：${enumTags(['event', 'choice', 'quest', 'ending'])}</p>`,
      groups: {
        paths: { label: '路径', type: 'object', get: () => CONFIG.lifePathConfig.paths, itemLabel: (v, k) => `${v.name || k} · ${k}` },
        stages: { label: '阶段', type: 'object', get: () => CONFIG.lifePathConfig.stages, itemLabel: (v, k) => `${v.title || k} · ${k}` },
        storyNodes: { label: '故事节点', type: 'object', get: () => CONFIG.lifePathConfig.storyNodes, itemLabel: (v, k) => `${v.name || k} · ${k}` },
      },
      newValue: group => group === 'paths'
        ? { id: 'new_path', name: '新路径', description: '', requiredInitialRank: [], genderConstraint: 'any', stages: [], defaultSkills: [] }
        : group === 'stages'
          ? { id: 'new_stage', pathId: '', title: '新阶段', rankOverride: 5, requiredReputation: 0, requiredSkills: {}, nextStages: [] }
          : { id: 'new_node', name: '新节点', pathId: '', phase: 1, type: 'event' },
    },
    needs: {
      title: '需求 Metadata',
      wholeGet: () => ({
        needDefs: CONFIG.needDefs,
        needCombinationStates: CONFIG.needCombinationStates,
        attributeRules: CONFIG.attributeRules,
        skillDefs: CONFIG.skillDefs,
      }),
      wholeSet: value => {
        if (value.needDefs) CONFIG.needDefs = value.needDefs;
        if (value.needCombinationStates) CONFIG.needCombinationStates = value.needCombinationStates;
        if (value.attributeRules) CONFIG.attributeRules = value.attributeRules;
        if (value.skillDefs) CONFIG.skillDefs = value.skillDefs;
      },
      enums: () => `
        <p>需求 ID：${enumTags(getNeedDefs().map(n => `${n.key}=${n.label}`))}</p>
        <p>基础属性：${enumTags(Object.keys(CONFIG.attributeRules || {}))}</p>
        <p>系数字段：${enumTags(['min', 'max', 'grow', 'decay'])}</p>
        <p>技能 ID：${enumTags(Object.keys(CONFIG.skillDefs || {}))}</p>
        <p>状态分档：${enumTags(['<20 极低', '20-39 偏低', '40-79 无标签', '80-99 满足', '≥100 超额'])}</p>
        <p>说明：默认增长/衰退是需求级基准；人物最终系数仍会叠加人物、属性、状态、性格和长期习惯。</p>`,
      groups: {
        needDefs: { label: '需求定义', type: 'array', get: () => CONFIG.needDefs, itemLabel: (v, k) => `${v.label} · ${v.key}` },
        combinationStates: { label: '组合满足状态', type: 'array', get: () => CONFIG.needCombinationStates, itemLabel: (v, k) => `${CONFIG.stateDefs?.[v.stateId]?.name || v.stateId} · ${v.all?.length || 0}项` },
        attributeRules: { label: '属性规则', type: 'object', get: () => CONFIG.attributeRules, itemLabel: (v, k) => k },
        skillDefs: { label: '技能定义', type: 'object', get: () => CONFIG.skillDefs, itemLabel: (v, k) => `${v.name || k} · ${k}` },
      },
      newValue: group => group === 'needDefs'
        ? { key: 'new_need', name: '新需求', label: '新', summary: '', color: '#6d8f72', defaultGrow: 1, defaultDecay: 1, stateBands: [] }
        : group === 'combinationStates' ? { stateId: 'new_need_combo', all: [{ need: 'hunger', min: 80 }] }
        : group === 'attributeRules' ? {} : { name: '新技能', desc: '' },
    },
  };
  return specs[tab];
}

function crudEntries(group) {
  const container = group.get() || (group.type === 'array' ? [] : {});
  return group.type === 'array'
    ? container.map((value, index) => ({ key: String(index), value, index }))
    : Object.entries(container).map(([key, value]) => ({ key, value }));
}

function metadataInfo(tab, groupId, entry) {
  const value = entry.value;
  const objectValue = value && typeof value === 'object' ? value : {};
  let name = typeof value === 'string'
    ? value
    : objectValue.name || objectValue.label || objectValue.title || objectValue.role || entry.key;
  if (tab === 'specialties' && groupId === 'profiles') {
    name = getCharDef(entry.key)?.name || name;
  } else if (tab === 'personalityMeta' && groupId === 'traitNarratives') {
    name = CONFIG.charSpecialtyConfig?.traitLabels?.[entry.key] || name;
  }
  const tags = [];
  const add = item => {
    if (item === undefined || item === null || item === '' || typeof item === 'object') return;
    const text = String(item);
    if (!tags.includes(text)) tags.push(text);
  };
  const addList = list => (Array.isArray(list) ? list : []).forEach(item =>
    add(typeof item === 'object' ? item.name || item.id || item.key || item.skill : item)
  );

  ['category', 'type', 'behavior', 'rel', 'cat', 'genderConstraint', 'pathId',
    'phase', 'conflictGroup', 'color'].forEach(key => add(objectValue[key]));
  if (tab === 'specialties' && groupId === 'profiles') {
    addList((objectValue.aiTraits || []).map(id => CONFIG.charSpecialtyConfig?.traitLabels?.[id] || id));
  } else {
    addList(objectValue.aiTraits);
  }
  addList(objectValue.displayTraits);
  addList(objectValue.specialties);
  addList(objectValue.blockedSkills);
  addList(objectValue.sceneTypesAllowed);
  addList(objectValue.defaultSkills);
  if (objectValue.trigger) {
    add(objectValue.trigger.need);
    add(objectValue.trigger.op);
  }

  let summary = objectValue.desc || objectValue.description || objectValue.hint || '';
  if (tab === 'specialties' && groupId === 'profiles') {
    summary = `${objectValue.aiTraits?.length || 0} 个性格标签 · ${objectValue.specialties?.length || 0} 个专长`;
  } else if (tab === 'personalityMeta' && groupId === 'traitMetadata') {
    summary = [objectValue.description, ...(objectValue.effectExamples || [])].filter(Boolean).join(' · ');
  } else if (tab === 'personalityMeta' && groupId === 'traitNarratives') {
    const events = Object.entries(objectValue)
      .filter(([, lines]) => Array.isArray(lines) && lines.length)
      .map(([event, lines]) => `${event} ${lines.length}句`);
    events.forEach(add);
    summary = `${events.length} 类触发 · ${events.join(' · ')}`;
  } else if (tab === 'personalityMeta' && groupId === 'traitModifiers') {
    summary = `加权 ${Object.keys(objectValue.boost || {}).length} 项 · 降权 ${Object.keys(objectValue.cut || {}).length} 项`;
  } else if (tab === 'needs' && groupId === 'needDefs') {
    summary = objectValue.summary || '人物动态需求';
  } else if (tab === 'needs' && groupId === 'attributeRules') {
    summary = `${Object.keys(objectValue).length} 条规则`;
  } else if (tab === 'states') {
    const duration = objectValue.duration === -1 ? '永久' : `${objectValue.duration ?? 0} 分钟`;
    summary = [duration, summary].filter(Boolean).join(' · ');
  } else if (tab === 'lifePath' && groupId === 'paths') {
    summary = summary || `${objectValue.stages?.length || 0} 个阶段`;
  } else if (tab === 'lifePath' && groupId === 'stages') {
    summary = `位阶 ${objectValue.rankOverride ?? '继承'} · 下一阶段 ${objectValue.nextStages?.length || 0} 个`;
  } else if (tab === 'identityProtocol' && groupId === 'scenePrivileges') {
    summary = `位阶 ${objectValue.roleRank ?? '-'} · ${objectValue.canEnterAnyPrivate ? '可进入私域' : '按场景授权'}`;
  }

  return {
    name: String(name),
    tags: tags.slice(0, 8),
    summary: String(summary || '—'),
  };
}

function renderConfigCrudAdmin(tab) {
  const spec = configCrudSpec(tab);
  const groupId = adminCrudGroup[tab] || Object.keys(spec.groups)[0];
  const group = spec.groups[groupId];
  const entries = crudEntries(group);
  let selected = adminCrudSelected[tab];
  if (!entries.some(e => e.key === selected)) selected = entries[0]?.key || '';
  adminCrudSelected[tab] = selected;
  const current = entries.find(e => e.key === selected);
  const search = adminCrudSearch[tab] || '';
  const groupOptions = Object.entries(spec.groups).map(([id, g]) =>
    `<option value="${id}"${id === groupId ? ' selected' : ''}>${g.label}</option>`).join('');
  const defaultMetadataTable = `
    <div class="metadata-table-wrap">
      <table class="metadata-table">
        <thead><tr><th>名称</th><th>ID</th><th>标签</th><th>摘要</th></tr></thead>
        <tbody>${entries.map(e => {
          const meta = metadataInfo(tab, groupId, e);
          const searchText = [meta.name, e.key, ...meta.tags, meta.summary].join(' ').toLowerCase();
          return `<tr class="${e.key === selected ? 'sel' : ''}" data-crud-tab="${tab}" data-crud-key="${escapeHtml(e.key)}" data-meta-search="${escapeHtml(searchText)}">
            <td class="meta-name">${escapeHtml(meta.name)}</td>
            <td class="meta-id">${escapeHtml(e.key)}</td>
            <td><div class="meta-tags">${meta.tags.map(tag => `<span class="meta-tag">${escapeHtml(tag)}</span>`).join('') || '<span class="logic-muted">无标签</span>'}</div></td>
            <td>${escapeHtml(meta.summary)}</td>
          </tr>`;
        }).join('') || '<tr><td colspan="4" class="col-empty">暂无条目</td></tr>'}</tbody>
      </table>
    </div>`;
  const needMetadataTable = tab === 'needs' && groupId === 'needDefs' ? `
    <div class="metadata-table-wrap">
      <table class="metadata-table need-definition-table">
        <thead><tr>
          <th>名称</th><th>ID</th><th>标签</th><th>摘要</th>
          <th>默认增长系数</th><th>默认衰退系数</th>
          <th>状态标签1<br><small>&lt;20</small></th>
          <th>状态标签2<br><small>20-39</small></th>
          <th>状态标签3<br><small>80-99</small></th>
          <th>状态标签4<br><small>≥100</small></th>
        </tr></thead>
        <tbody>${entries.map(e => {
          const nd = e.value || {};
          const labels = (nd.stateBands || []).map(b => CONFIG.stateDefs?.[b.id]?.name || b.id || '—');
          const searchText = [nd.name, nd.key, nd.label, nd.summary, ...labels].join(' ').toLowerCase();
          return `<tr class="${e.key === selected ? 'sel' : ''}" data-crud-tab="${tab}" data-crud-key="${escapeHtml(e.key)}" data-meta-search="${escapeHtml(searchText)}">
            <td class="meta-name">${escapeHtml(nd.name || nd.label || e.key)}</td>
            <td class="meta-id">${escapeHtml(nd.key || e.key)}</td>
            <td><span class="meta-tag">${escapeHtml(nd.label || '—')}</span></td>
            <td>${escapeHtml(nd.summary || '—')}</td>
            <td>${Number(nd.defaultGrow ?? 1).toFixed(2)}</td>
            <td>${Number(nd.defaultDecay ?? 1).toFixed(2)}</td>
            ${[0, 1, 2, 3].map(i => `<td>${escapeHtml(labels[i] || '—')}</td>`).join('')}
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>` : '';
  const stateBandMatrix = tab === 'states' && groupId === 'definitions' ? (() => {
    const bandRows = getNeedDefs().map(nd => {
      const cells = (nd.stateBands || []).map(band => {
        const sd = CONFIG.stateDefs?.[band.id];
        const polarity = { positive: '正面', negative: '负面', mixed: '混合', neutral: '中性' }[sd?.polarity] || '中性';
        return `<td class="${band.id === selected ? 'sel-cell' : ''}" data-crud-tab="states" data-crud-key="${escapeHtml(band.id)}" data-meta-search="${escapeHtml(`${nd.name || nd.label} ${sd?.name || band.id} ${sd?.desc || ''}`.toLowerCase())}">
          <b>${escapeHtml(sd?.name || band.id)}</b><small>${polarity} · ${sd?.duration ?? 30}分</small>
        </td>`;
      }).join('');
      return `<tr><th>${escapeHtml(nd.name || nd.label)}<small>${escapeHtml(nd.key)}</small></th>${cells}</tr>`;
    }).join('');
    const comboRows = (CONFIG.needCombinationStates || []).map(rule => {
      const sd = CONFIG.stateDefs?.[rule.stateId];
      const cond = (rule.all || []).map(x => `${getNeedDefs().find(n => n.key === x.need)?.label || x.need}≥${x.min}`).join(' + ');
      return `<tr data-crud-tab="states" data-crud-key="${escapeHtml(rule.stateId)}" data-meta-search="${escapeHtml(`${sd?.name || rule.stateId} ${cond}`.toLowerCase())}">
        <td class="meta-name">${escapeHtml(sd?.name || rule.stateId)}</td><td class="meta-id">${escapeHtml(rule.stateId)}</td>
        <td>${escapeHtml(cond)}</td><td>${escapeHtml(sd?.desc || '')}</td>
      </tr>`;
    }).join('');
    return `
      <div class="section-title">基础需求状态矩阵 · 每项四档</div>
      <div class="metadata-table-wrap need-band-matrix"><table class="metadata-table">
        <thead><tr><th>需求</th><th>极低 · 负面</th><th>偏低 · 负面</th><th>满足 · 正面</th><th>超额 · 正/混合</th></tr></thead>
        <tbody>${bandRows}</tbody>
      </table></div>
      <div class="section-title" style="margin-top:10px">多项需求组合状态</div>
      <div class="metadata-table-wrap"><table class="metadata-table">
        <thead><tr><th>名称</th><th>ID</th><th>条件</th><th>摘要</th></tr></thead><tbody>${comboRows}</tbody>
      </table></div>
      <div class="section-title" style="margin-top:10px">全部状态</div>
      ${defaultMetadataTable}`;
  })() : '';
  return `
    <style>
      .cfg-enums { background:rgba(250,248,244,.18);border:1px solid rgba(107,90,76,.35);border-radius:8px;padding:8px;margin-bottom:10px;font-size:10px;color:var(--jn-text-soft) }
      .cfg-enums b { color:var(--jn-heading);font-size:11px }
      .cfg-enums p { margin-top:5px;line-height:1.6 }
      .crud-shell { display:flex;flex-direction:column;gap:12px }
      .crud-toolbar { display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 }
      .crud-toolbar button { background:linear-gradient(180deg,var(--jn-btn-top),var(--jn-btn-bottom));border:1px solid var(--jn-border);border-radius:999px;color:var(--jn-title);padding:5px 12px;font-family:inherit;cursor:pointer }
      .crud-toolbar button.primary { border-color:var(--jn-gold);background:linear-gradient(180deg,#f5edcf,#cfba7b) }
      .crud-toolbar button.danger { border-color:var(--jn-red-dark);color:var(--jn-red-deep) }
      .crud-toolbar button:disabled { opacity:.45;cursor:not-allowed }
      .metadata-controls { display:grid;grid-template-columns:220px minmax(220px,1fr);gap:10px;align-items:end }
      .metadata-table-wrap { max-height:330px;overflow:auto;border:1px solid var(--jn-border-2);border-radius:8px }
      .metadata-table { width:100%;border-collapse:collapse;font-size:11px }
      .metadata-table th { position:sticky;top:0;z-index:1;background:var(--jn-surface-deep);color:var(--jn-text-muted);font-weight:normal;text-align:left;padding:7px 8px;border-bottom:1px solid var(--jn-border) }
      .metadata-table td { padding:7px 8px;border-bottom:1px solid var(--jn-border-3);vertical-align:top;color:var(--jn-text-soft) }
      .metadata-table tr[data-crud-key] { cursor:pointer }
      .metadata-table tr[data-crud-key]:hover td { background:rgba(191,214,193,.12) }
      .metadata-table tr.sel td { background:rgba(191,214,193,.22) }
      .metadata-table .meta-name { color:var(--jn-heading);white-space:nowrap }
      .metadata-table .meta-id { color:var(--jn-text-dim);font-family:monospace;font-size:10px }
      .need-definition-table { min-width:1120px }
      .need-definition-table th,.need-definition-table td { white-space:nowrap }
      .need-band-matrix td[data-crud-key] { cursor:pointer }
      .need-band-matrix td[data-crud-key]:hover,.need-band-matrix .sel-cell { background:rgba(191,214,193,.22) }
      .need-band-matrix th small,.need-band-matrix td small { display:block;color:var(--jn-text-dim);font-size:9px;margin-top:2px }
      .meta-tags { display:flex;gap:4px;flex-wrap:wrap }
      .meta-tag { display:inline-block;padding:1px 6px;border:1px solid rgba(91,122,94,.45);border-radius:999px;background:rgba(184,210,187,.16);color:var(--jn-green-light);font-size:9px;white-space:nowrap }
      .crud-detail { border-top:1px solid var(--jn-border-2);padding-top:4px }
      .crud-json { width:100%;min-height:320px;font-family:monospace;font-size:11px }
      .crud-import { width:100%;min-height:160px;font-family:monospace;font-size:10px }
      @media (max-width:760px) { .metadata-controls { grid-template-columns:1fr } }
    </style>
    <div class="cfg-enums"><b>${spec.title} · 当前枚举</b>${spec.enums()}</div>
    <div class="crud-shell">
      <div class="metadata-controls">
        <div class="cfg-field"><label>管理内容</label><select id="crud-group-select" data-crud-tab="${tab}">${groupOptions}</select></div>
        <div class="cfg-field"><label>筛选名称、ID 或标签</label><input id="crud-search" data-crud-tab="${tab}" value="${escapeHtml(search)}" placeholder="输入关键词即时筛选"></div>
      </div>
      ${stateBandMatrix || needMetadataTable || defaultMetadataTable}
      <div>
        <div class="crud-toolbar">
          <button id="btn-crud-add" data-crud-tab="${tab}">新增</button>
          <button class="danger" id="btn-crud-delete" data-crud-tab="${tab}" ${current ? '' : 'disabled'}>删除</button>
        </div>
      </div>
      <div class="crud-detail">
        <div class="section-title">${group.label}${current ? ` · ${escapeHtml(current.key)}` : ''}</div>
        <details ${current ? '' : 'open'}>
          <summary style="cursor:pointer;color:var(--jn-heading);font-size:11px;margin-bottom:6px">高级 Metadata JSON</summary>
          <textarea id="crud-item-json" class="crud-json" ${current ? '' : 'disabled'}>${current ? escapeHtml(JSON.stringify(current.value, null, 2)) : ''}</textarea>
        </details>
        <div class="crud-toolbar">
          <button class="primary" id="btn-crud-save" data-crud-tab="${tab}" ${current ? '' : 'disabled'}>保存当前条目</button>
          <button id="btn-crud-export" data-crud-tab="${tab}">导出整个子系统</button>
          <button id="btn-crud-import" data-crud-tab="${tab}">导入整个子系统</button>
        </div>
        <textarea id="crud-whole-json" class="crud-import" placeholder="导出内容或粘贴整个子系统 JSON"></textarea>
      </div>
    </div>`;
}

function renderCharacterLogicOverview(profile) {
  if (!profile) return '<div class="col-empty">无人物档案</div>';
  const traitTags = profile.traits.labels.map(t => `<span class="tag specialty on">${escapeHtml(t)}</span>`).join('');
  const specTags = profile.traits.specialties.map(s =>
    `<span class="tag specialty" title="${escapeHtml(s.desc || '')}">${escapeHtml(s.name || s.id)}</span>`
  ).join('');
  const stateRows = profile.states.map(st => {
    const remain = st.permanent ? '永久' : `${Math.max(0, Math.round(st.remaining))}分`;
    const blocks = st.blockedSkills?.length ? ` · 封锁 ${st.blockedSkills.join('/')}` : '';
    return `<div class="logic-row"><b>${escapeHtml(st.name)}</b><span>${remain}${escapeHtml(blocks)}</span></div>`;
  }).join('') || '<div class="logic-muted">无状态</div>';
  const skillRows = profile.skills.map(sk =>
    `<span class="tag ${sk.usable ? '' : 'state debuff'}" title="${escapeHtml(sk.blockedBy.join('、'))}">
      ${escapeHtml(sk.name)} Lv.${sk.level}${sk.usable ? '' : ' · 禁用'}
    </span>`
  ).join('');
  const needRows = profile.needs.map(n => {
    const cf = n.coeffs || {};
    return `<div class="logic-need">
      <span>${escapeHtml(n.label)} ${n.value}</span>
      <small>min ${Math.round(cf.min ?? 0)} / max ${Math.round(cf.max ?? 100)} / 衰 ${Number(cf.decay ?? 1).toFixed(2)} / 长 ${Number(cf.grow ?? 1).toFixed(2)}</small>
    </div>`;
  }).join('');
  const access = profile.scene.accessibleScenes.slice(0, 8).map(s => s.name).join('、') || '无';
  const diag = profile.diagnostics.map(d => `<li>${escapeHtml(d)}</li>`).join('') || '<li>暂无异常</li>';
  const runtimeChar = typeof getChar === 'function' ? getChar(profile.id) : null;
  const traitStats = typeof TraitBehaviorSystem !== 'undefined' && runtimeChar
    ? TraitBehaviorSystem.getStats(runtimeChar)
    : null;
  const actionSummary = traitStats
    ? Object.entries(traitStats.actions || {}).sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([key, count]) => `${key} ${count}`).join(' · ')
    : '';
  return `
    <div class="char-logic-panel">
      <div class="logic-card">
        <h4>身份与位置</h4>
        <p>${escapeHtml(profile.identity.rankLabel)} · ${escapeHtml(profile.family.familyName || '无家庭')} ${profile.family.role ? '· ' + escapeHtml(profile.family.role) : ''}</p>
        <p>当前：${escapeHtml(profile.scene.currentScene?.name || '未知')} · 可去：${escapeHtml(access)}</p>
        <p>路径：${escapeHtml(profile.path.pathName || '未择路')}${profile.path.stageTitle ? ' · ' + escapeHtml(profile.path.stageTitle) : ''} · 声望 ${profile.path.reputation}</p>
      </div>
      <div class="logic-card">
        <h4>性格与专长</h4>
        <div>${traitTags || '<span class="logic-muted">无性格标签</span>'}</div>
        <div>${specTags || '<span class="logic-muted">无专长</span>'}</div>
      </div>
      <div class="logic-card">
        <h4>状态与技能</h4>
        ${stateRows}
        <div style="margin-top:6px">${skillRows || '<span class="logic-muted">无技能</span>'}</div>
      </div>
      <div class="logic-card">
        <h4>需求系数</h4>
        ${needRows}
      </div>
      <div class="logic-card logic-card-wide">
        <h4>诊断</h4>
        <ul>${diag}</ul>
      </div>
      <div class="logic-card logic-card-wide">
        <h4>性格行为统计 · 第${traitStats?.sinceDay || 1}日起</h4>
        ${traitStats ? `
          <div class="logic-row"><b>自主决策 / 社交</b><span>${traitStats.decisions || 0} / ${traitStats.socialActions || 0}</span></div>
          <div class="logic-row"><b>记忆生成 / 淡忘</b><span>${traitStats.memoriesCreated || 0} / ${traitStats.memoriesForgotten || 0}</span></div>
          <div class="logic-row"><b>任务接受 / 拒绝 / 完成 / 失败</b><span>${traitStats.questsAccepted || 0} / ${traitStats.questsDeclined || 0} / ${traitStats.questsCompleted || 0} / ${traitStats.questsFailed || 0}</span></div>
          <div class="logic-row"><b>邀约接受 / 拒绝</b><span>${traitStats.invitationsAccepted || 0} / ${traitStats.invitationsDeclined || 0}</span></div>
          <div class="logic-row"><b>自主消费</b><span>${traitStats.spendingCount || 0} 次 · ${traitStats.spent || 0} 两</span></div>
          <div class="logic-row"><b>竞赛胜 / 负</b><span>${traitStats.wins || 0} / ${traitStats.losses || 0}</span></div>
          <p>${escapeHtml(actionSummary || '尚无行动分类记录')}</p>
          <div class="crud-toolbar"><button id="btn-trait-stats-reset" data-char-id="${escapeHtml(profile.id)}">清空行为统计</button></div>
        ` : '<div class="logic-muted">游戏运行后显示统计</div>'}
      </div>
    </div>`;
}

function effectTargetLabel(row) {
  const ef = row.effect || {};
  const result = row.result || {};
  const ids = [result.charId, ef.charId, ef.target, result.idA, ef.idA, ef.from]
    .filter(Boolean);
  const names = [...new Set(ids)].map(id => getChar(id)?.short || id);
  if (result.idB || ef.idB || ef.to) {
    const id = result.idB || ef.idB || ef.to;
    names.push(getChar(id)?.short || id);
  }
  return names.join('↔') || (result.familyId ? `家庭#${result.familyId}` : '—');
}

function effectSummary(row) {
  const ef = row.effect || {};
  const r = row.result || {};
  if (ef.type === 'need') return `${ef.key} ${r.old ?? '?'}→${r.value ?? '?'}`;
  if (ef.type === 'state') return `获得状态 ${CONFIG.stateDefs?.[ef.stateId]?.name || ef.stateId}`;
  if (ef.type === 'memory') return `记忆「${ef.text || ''}」`;
  if (ef.type === 'relation') return `关系 ${r.old ?? '?'}→${r.value ?? '?'}`;
  if (ef.type === 'axis') return `${ef.axis} ${r.old ?? '?'}→${r.value ?? '?'}`;
  if (ef.type === 'skillXp') return `${ef.skill} Lv.${r.old ?? '?'}→${r.value ?? '?'}`;
  if (ef.type === 'reputation') return `声望 ${r.changed > 0 ? '+' : ''}${r.changed || 0}`;
  if (ef.type === 'money') return `私银 ${r.changed > 0 ? '+' : ''}${r.changed || 0}`;
  if (ef.type === 'familyFund') return `公库 ${r.changed > 0 ? '+' : ''}${r.changed || 0}`;
  return ef.type || '未知效果';
}

function renderCharacterEffectLog(charId) {
  const rows = CharacterEffectSystem?.getRecent?.({ charId, limit: 20 }) || [];
  const html = rows.map(row => `
    <tr>
      <td>${row.gameDay}日 ${String(row.gameHour).padStart(2, '0')}:${String(row.gameMinute).padStart(2, '0')}</td>
      <td>${escapeHtml(effectTargetLabel(row))}</td>
      <td>${escapeHtml(effectSummary(row))}</td>
      <td>${escapeHtml(row.source || 'unknown')}</td>
      <td>${escapeHtml(row.reason || '')}</td>
    </tr>`).join('');
  return `
    <div class="section-title">最近人物效果</div>
    <p style="font-size:10px;color:var(--jn-text-dim);margin-bottom:6px">
      记录通过统一效果系统产生的离散变化。自然衰减和家具持续恢复不会逐帧记录。
    </p>
    <table style="width:100%;font-size:10px;border-collapse:collapse">
      <thead><tr style="color:var(--jn-text-muted);border-bottom:1px solid var(--jn-border-2)">
        <th>时间</th><th>对象</th><th>变化</th><th>来源</th><th>原因</th>
      </tr></thead>
      <tbody>${html || '<tr><td colspan="5" class="logic-muted" style="padding:8px">暂无统一效果记录</td></tr>'}</tbody>
    </table>
    <div class="adm-actions">
      <button id="btn-test-character-effect">测试：当前人物“闷”+5</button>
      <button id="btn-clear-effect-log">清空效果日志</button>
    </div>`;
}

function renderCharAdmin() {
  const c = CONFIG.characters[adminSelChar];
  const profile = CharacterLogicSystem?.profile?.(c.id);
  const managed = CharacterLogicSystem?.exportManagedConfig?.(c.id) || { character: c, specialtyProfile: null };
  const specialtyJson = JSON.stringify(managed.specialtyProfile || {}, null, 2);
  const attrFields = Object.entries(c.attributes || {}).map(([k, v]) =>
    `<div class="cfg-field"><label>属性 ${k}</label><input type="number" data-attr="${k}" value="${v}"></div>`
  ).join('');
  const needFields = getNeedDefs().map(nd => {
    const cf = c.baseNeedCoeffs[nd.key] || {};
    return `<div class="section-title">${nd.label}(${nd.key}) 基础系数</div>
      <div class="cfg-grid">
        ${['min','max','grow','decay'].map(k =>
          `<div class="cfg-field"><label>${k}</label><input type="number" step="0.01" data-need="${nd.key}" data-ncoef="${k}" value="${cf[k] ?? (k==='min'?0:k==='max'?100:1)}"></div>`
        ).join('')}
      </div>`;
  }).join('');
  return `
    <style>
      .char-logic-panel { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; margin-bottom:12px; }
      .logic-card { background:rgba(250,248,244,.18); border:1px solid rgba(107,90,76,.38); border-radius:8px; padding:8px; min-width:0; }
      .logic-card h4 { color:var(--jn-heading); font-size:12px; font-weight:normal; margin-bottom:6px; letter-spacing:1px; }
      .logic-card p { color:var(--jn-text-soft); font-size:11px; line-height:1.45; margin-bottom:3px; }
      .logic-card-wide { grid-column:1/-1; }
      .logic-row { display:flex; justify-content:space-between; gap:8px; color:var(--jn-text-soft); font-size:11px; margin-bottom:3px; }
      .logic-row b { color:var(--jn-title); font-weight:normal; }
      .logic-muted { color:var(--jn-text-dim); font-size:11px; }
      .logic-need { display:flex; flex-direction:column; gap:1px; margin-bottom:4px; color:var(--jn-title); font-size:11px; }
      .logic-need small { color:var(--jn-text-dim); font-size:9px; }
      .logic-card ul { margin-left:16px; color:var(--jn-text-soft); font-size:11px; line-height:1.5; }
    </style>
    <div style="display:grid;grid-template-columns:160px 1fr;gap:12px">
      <div class="cfg-list">${CONFIG.characters.map((ch, i) =>
        `<div class="cfg-item${i === adminSelChar ? ' sel' : ''}" data-cidx="${i}">${ch.name}</div>`
      ).join('')}</div>
      <div>
        <div class="section-title">人物逻辑总览</div>
        ${renderCharacterLogicOverview(profile)}
        ${renderCharacterEffectLog(c.id)}
        <div class="cfg-grid">
          <div class="cfg-field"><label>姓名</label><input id="cf-name" value="${c.name}"></div>
          <div class="cfg-field"><label>简称</label><input id="cf-short" value="${c.short}"></div>
          <div class="cfg-field"><label>短评（家庭气泡）</label><input id="cf-comment" value="${c.shortComment || ''}"></div>
          <div class="cfg-field"><label>性别</label><input id="cf-gender" value="${c.gender || ''}"></div>
          <div class="cfg-field"><label>基础身份位阶 socialRank</label><input id="cf-rank" type="number" value="${c.socialRank ?? 2}"></div>
          <div class="cfg-field"><label>思乡/归属 homewardness</label><input id="cf-homewardness" type="number" value="${c.homewardness ?? 50}"></div>
        </div>
        <div class="section-title">属性（固定 → 影响需求系数与上下限）</div>
        <div class="cfg-grid">${attrFields}</div>
        ${needFields}
        <div class="cfg-field"><label>长期性格（文本）</label><textarea id="cf-personality">${c.personality}</textarea></div>
        <div class="cfg-field"><label>记忆宫殿（文本）</label><textarea id="cf-memory">${c.memoryPalace}</textarea></div>
        <div class="cfg-field"><label>技能（逗号分隔 move,talk,poetry,serve）</label><input id="cf-skills" value="${c.skills.join(',')}"></div>
        <div class="section-title">统一管理 JSON</div>
        <p style="font-size:10px;color:var(--jn-text-dim);margin-bottom:6px">
          这里用于集中管理人物基础配置与特质配置。基础配置会覆盖 characters 当前人物；特质配置会写入 charSpecialtyConfig.profiles[人物ID]。
        </p>
        <div class="cfg-grid">
          <div class="cfg-field"><label>character JSON</label><textarea id="cf-json" style="min-height:180px;font-family:monospace;font-size:11px">${escapeHtml(JSON.stringify(managed.character, null, 2))}</textarea></div>
          <div class="cfg-field"><label>specialty profile JSON</label><textarea id="cf-specialty-json" style="min-height:180px;font-family:monospace;font-size:11px">${escapeHtml(specialtyJson)}</textarea></div>
        </div>
        <div class="adm-actions">
          <button class="primary" id="btn-save-char">保存人物配置</button>
          <button id="btn-save-char-json">保存统一 JSON</button>
        </div>
      </div>
    </div>`;
}

function renderRelInitAdmin() {
  const list = (CONFIG.relationInit || []).map((r, i) =>
    `<tr style="border-bottom:1px solid var(--jn-border-3)">
      <td style="padding:4px">${getCharDef(r.a)?.short || r.a}</td>
      <td>${getCharDef(r.b)?.short || r.b}</td>
      <td>${r.initType}</td>
      <td>${r.initValue > 0 ? '+' : ''}${r.initValue}</td>
      <td><button data-reledit="${i}" style="font-size:10px">编辑</button>
          <button data-reldel="${i}" style="font-size:10px;color:var(--jn-red-bright)">删</button></td>
    </tr>`
  ).join('');
  const ri = CONFIG.relationInit[adminSelRelIdx] || { a: 'baoyu', b: 'daiyu', initType: '朋友', initValue: 20, note: '' };
  const opts = CONFIG.characters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  const panelCfg = CONFIG.relationPanelConfig || DEFAULT_CONFIG.relationPanelConfig || {};
  const ql = panelCfg.quadrantLabels || {};
  const sl = panelCfg.summaryLabels || {};
  return `
    <div class="section-title">关系面板显示配置</div>
    <div class="cfg-grid">
      <div class="cfg-field"><label>左上名称</label><input id="rel-ui-friendship" value="${escapeHtml(ql.friendship || '友谊')}"></div>
      <div class="cfg-field"><label>右上名称</label><input id="rel-ui-affinity" value="${escapeHtml(ql.affinity || '姻缘')}"></div>
      <div class="cfg-field"><label>左下名称</label><input id="rel-ui-trust" value="${escapeHtml(ql.trust || '信任')}"></div>
      <div class="cfg-field"><label>仆从看主子</label><input id="rel-ui-servant-master" value="${escapeHtml(ql.servantToMaster || '服从')}"></div>
      <div class="cfg-field"><label>主子看仆从</label><input id="rel-ui-master-servant" value="${escapeHtml(ql.masterToServant || '体恤')}"></div>
      <div class="cfg-field"><label>非主仆右下</label><input id="rel-ui-empty" value="${escapeHtml(ql.empty || '?')}"></div>
      <div class="cfg-field"><label>恋人摘要</label><input id="rel-sum-lover" value="${escapeHtml(sl.lover || '恋人')}"></div>
      <div class="cfg-field"><label>朋友摘要</label><input id="rel-sum-friend" value="${escapeHtml(sl.friend || '朋友')}"></div>
      <div class="cfg-field"><label>父母摘要</label><input id="rel-sum-parent" value="${escapeHtml(sl.parent || '父母')}"></div>
    </div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-rel-ui">保存关系面板配置</button>
    </div>
    <div class="section-title">新增/编辑关系</div>
    <div class="cfg-grid">
      <div class="cfg-field"><label>人物A</label><select id="ri-a">${opts}</select></div>
      <div class="cfg-field"><label>人物B</label><select id="ri-b">${opts}</select></div>
      <div class="cfg-field"><label>初始类型</label><input id="ri-type" value="${ri.initType}" placeholder="恋人/朋友/主仆…"></div>
      <div class="cfg-field"><label>初始关系值 (-100~100)</label><input type="number" id="ri-val" value="${ri.initValue}"></div>
      <div class="cfg-field" style="grid-column:1/-1"><label>备注</label><input id="ri-note" value="${ri.note || ''}"></div>
    </div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-rel-init">保存</button>
      <button id="btn-add-rel-init">+ 新增关系</button>
    </div>
    <div class="section-title">已配置关系列表</div>
    <table style="width:100%;font-size:11px;border-collapse:collapse">
      <tr style="color:var(--jn-text-muted)"><td>A</td><td>B</td><td>类型</td><td>值</td><td>操作</td></tr>
      ${list || '<tr><td colspan="5" style="color:var(--jn-text-soft)">暂无</td></tr>'}
    </table>
    <p style="margin-top:8px;font-size:10px;color:var(--jn-text-soft)">未配置的人物对默认为陌生人(0)。关系值随社交变化，类型按阈值自动切换。</p>`;
}

function renderRelAdmin() { return renderRelInitAdmin(); }

// ── 状态 CSV 帮助函数 ──────────────────────────────────────────────────────────
const STATE_CSV_NEED_KEYS = ['energy', 'fun', 'hunger', 'hygiene', 'social', 'mood'];
const STATE_CSV_HEADER = [
  'id', 'name', 'duration', 'category', 'polarity', 'conflictGroup', 'desc', 'blockedSkills',
  ...STATE_CSV_NEED_KEYS.flatMap(k => [k + '_decay', k + '_grow']),
  'triggerNeed', 'triggerOp', 'triggerValue', 'needBandNeed', 'needBandSlot',
  'aiModifiersJson', 'traitEffectsJson',
];

function _csvEsc(v) {
  const s = String(v ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function _csvParseLine(line) {
  const res = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && !q)              { q = true; continue; }
    if (c === '"' && q && line[i+1] === '"') { cur += '"'; i++; continue; }
    if (c === '"' && q)               { q = false; continue; }
    if (c === ',' && !q)              { res.push(cur); cur = ''; continue; }
    cur += c;
  }
  res.push(cur);
  return res;
}

function exportStateCSV() {
  const rows = [STATE_CSV_HEADER.join(',')];
  for (const [id, sd] of Object.entries(CONFIG.stateDefs)) {
    const m = sd.needMods || {};
    rows.push([
      _csvEsc(id),
      _csvEsc(sd.name),
      sd.duration,
      _csvEsc(sd.category || ''),
      _csvEsc(sd.polarity || ''),
      _csvEsc(sd.conflictGroup || ''),
      _csvEsc(sd.desc || ''),
      _csvEsc((sd.blockedSkills || []).join(';')),
      ...STATE_CSV_NEED_KEYS.flatMap(k => [m[k]?.decay ?? '', m[k]?.grow ?? '']),
      sd.trigger?.need ?? '',
      sd.trigger?.op ?? '',
      sd.trigger?.value ?? '',
      sd.needBand?.need ?? '',
      sd.needBand?.slot ?? '',
      _csvEsc(sd.aiModifiers ? JSON.stringify(sd.aiModifiers) : ''),
      _csvEsc(sd.traitEffects ? JSON.stringify(sd.traitEffects) : ''),
    ].join(','));
  }
  return rows.join('\n');
}

function importStateCSV(csvText) {
  const lines = csvText.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return { error: 'CSV 至少需要标题行和一行数据' };
  const header = _csvParseLine(lines[0]);
  let updated = 0, added = 0, errors = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = _csvParseLine(lines[i]);
    const row = Object.fromEntries(header.map((h, j) => [h.trim(), (vals[j] ?? '').trim()]));
    if (!row.id) continue;

    const needMods = {};
    for (const k of STATE_CSV_NEED_KEYS) {
      const decay = row[k + '_decay'] !== '' ? +row[k + '_decay'] : undefined;
      const grow  = row[k + '_grow']  !== '' ? +row[k + '_grow']  : undefined;
      if (decay !== undefined || grow !== undefined) {
        needMods[k] = {};
        if (decay !== undefined) needMods[k].decay = decay;
        if (grow  !== undefined) needMods[k].grow  = grow;
      }
    }

    const entry = {
      name:          row.name || row.id,
      duration:      +row.duration || 30,
      category:      row.category || undefined,
      polarity:      row.polarity || undefined,
      conflictGroup: row.conflictGroup || undefined,
      desc:          row.desc || '',
      blockedSkills: row.blockedSkills ? row.blockedSkills.split(';').map(s => s.trim()).filter(Boolean) : [],
      needMods,
    };
    if (row.triggerNeed) {
      entry.trigger = { need: row.triggerNeed, op: row.triggerOp || 'lt', value: +row.triggerValue || 0 };
    }
    if (row.needBandNeed) {
      entry.needBand = { need: row.needBandNeed, slot: +row.needBandSlot || 1 };
    }
    try {
      if (row.aiModifiersJson) entry.aiModifiers = JSON.parse(row.aiModifiersJson);
      if (row.traitEffectsJson) entry.traitEffects = JSON.parse(row.traitEffectsJson);
    } catch (e) {
      errors.push(`第 ${i + 1} 行 JSON 字段无效`);
      continue;
    }

    if (CONFIG.stateDefs[row.id]) updated++; else added++;
    CONFIG.stateDefs[row.id] = entry;
  }
  return { updated, added, errors };
}
// ───────────────────────────────────────────────────────────────────────────────

function renderStateAdmin() {
  const sd = CONFIG.stateDefs[adminSelState];
  const mods = Object.entries(sd.needMods || {}).map(([nk, m]) =>
    Object.entries(m).map(([k, v]) =>
      `<div class="cfg-field"><label>${nk}.${k} 倍率</label><input type="number" step="0.1" data-sm-need="${nk}" data-sm-k="${k}" value="${v}"></div>`
    ).join('')
  ).join('');
  return `
    <div style="display:grid;grid-template-columns:140px 1fr;gap:12px">
      <div class="cfg-list">
        ${Object.entries(CONFIG.stateDefs).map(([id, s]) =>
          `<div class="cfg-item${id === adminSelState ? ' sel' : ''}" data-state="${id}">${s.name}</div>`
        ).join('')}
        <div style="margin-top:6px">
          <button class="primary" id="btn-state-add-new" style="width:100%;font-size:10px">＋ 新增状态</button>
        </div>
      </div>
      <div>
        <div class="cfg-grid">
          <div class="cfg-field"><label>状态 ID</label><input id="sf-id" value="${adminSelState}" readonly style="color:var(--jn-text-dim)"></div>
          <div class="cfg-field"><label>状态名</label><input id="sf-name" value="${sd.name}"></div>
          <div class="cfg-field"><label>持续时间（游戏分钟）</label><input type="number" id="sf-dur" value="${sd.duration}"></div>
          <div class="cfg-field" style="grid-column:1/-1"><label>描述</label><input id="sf-desc" value="${sd.desc || ''}"></div>
          <div class="cfg-field" style="grid-column:1/-1"><label>封锁技能（逗号分隔）</label><input id="sf-block" value="${(sd.blockedSkills||[]).join(',')}"></div>
        </div>
        <div class="section-title">需求速度系数修正（留空=不修正）</div>
        <div class="cfg-grid">${mods}</div>
        <p style="color:var(--jn-text-soft);margin-top:8px;font-size:10px">触发：力竭/愁绪/欣悦由需求临界点自动触发；酒醉由🍶酒案触发。</p>
        <div class="adm-actions">
          <button class="primary" id="btn-save-state">保存当前状态</button>
          <button class="danger" id="btn-del-state" style="margin-left:8px">删除此状态</button>
        </div>

        <div class="section-title" style="margin-top:16px">CSV 批量导入／导出</div>
        <p style="font-size:10px;color:var(--jn-text-dim);margin-bottom:6px">
          列：id, name, duration, desc, blockedSkills(;分隔), energy_decay, energy_grow, fun_decay, fun_grow, hunger_decay, hunger_grow, hygiene_decay, hygiene_grow, triggerNeed, triggerOp, triggerValue
        </p>
        <div class="adm-actions" style="margin-bottom:6px">
          <button id="btn-state-csv-export">导出 CSV</button>
          <button class="primary" id="btn-state-csv-import">导入 CSV（覆盖/新增）</button>
        </div>
        <textarea id="state-csv-area" style="width:100%;height:130px;background:var(--jn-surface-deep);border:1px solid var(--jn-border-2);color:var(--jn-title);font-family:monospace;font-size:10px;padding:6px;resize:vertical" placeholder="粘贴 CSV 内容，或点击「导出 CSV」查看当前格式…"></textarea>
      </div>
    </div>`;
}

function renderInterTplAdmin() {
  const tpl = CONFIG.interactionTemplates?.[adminSelInter];
  if (!tpl) return '<p>无互动模板</p>';
  const catOpts = (CONFIG.interactionCategories || []).map(c =>
    `<option value="${c.id}"${c.id === tpl.category ? ' selected' : ''}>${c.name}</option>`
  ).join('');
  const effPreview = JSON.stringify(tpl.effects || [], null, 2);
  const linesText = (tpl.lines || []).join('\n');
  return `<div style="display:grid;grid-template-columns:160px 1fr;gap:12px">
    <div class="cfg-list">${Object.entries(CONFIG.interactionTemplates || {}).map(([id, t]) => {
      const cn = CONFIG.interactionCategories?.find(c => c.id === t.category)?.name || t.category;
      return `<div class="cfg-item${+id === adminSelInter ? ' sel' : ''}" data-inter="${id}">${id} ${t.name} · ${cn}</div>`;
    }).join('')}</div>
    <div>
      <div class="cfg-grid">
        <div class="cfg-field"><label>互动ID</label><input id="it-id" type="number" value="${tpl.id}" readonly></div>
        <div class="cfg-field"><label>名称</label><input id="it-name" value="${tpl.name}"></div>
        <div class="cfg-field"><label>所属类别</label><select id="it-cat">${catOpts}</select></div>
        <div class="cfg-field"><label>类型</label><select id="it-type"><option value="dialogue"${tpl.type==='dialogue'?' selected':''}>对话</option><option value="action"${tpl.type==='action'?' selected':''}>行动</option></select></div>
        <div class="cfg-field"><label>关系下限</label><input id="it-relmin" type="number" value="${tpl.relMin ?? -100}"></div>
        <div class="cfg-field"><label>关系上限</label><input id="it-relmax" type="number" value="${tpl.relMax ?? 100}"></div>
        <div class="cfg-field"><label>技能要求</label><input id="it-skill" value="${tpl.skillReq?.skill || ''}" placeholder="如 poetry"></div>
        <div class="cfg-field"><label>技能等级</label><input id="it-sklv" type="number" value="${tpl.skillReq?.level || ''}" placeholder="留空=无"></div>
        <div class="cfg-field"><label>持续(秒)</label><input id="it-dur" type="number" step="0.1" value="${tpl.duration ?? 5}"></div>
        <div class="cfg-field"><label>冷却(秒)</label><input id="it-cd" type="number" value="${tpl.cooldown ?? 0}"></div>
        <div class="cfg-field"><label>仅一次</label><input id="it-once" type="checkbox" ${tpl.once ? 'checked' : ''}></div>
      </div>
      <div class="section-title">对话文本池（每行一条，{A}{B}占位）</div>
      <div class="cfg-field"><textarea id="it-lines">${linesText}</textarea></div>
      <div class="section-title">扩展字段（预留 LLM / 动画 / 语音）</div>
      <div class="cfg-grid">
        <div class="cfg-field"><label>发起者动画</label><input id="it-anim-a" value="${tpl.animInitiator || ''}"></div>
        <div class="cfg-field"><label>目标动画</label><input id="it-anim-b" value="${tpl.animTarget || ''}"></div>
        <div class="cfg-field"><label>语音</label><input id="it-voice" value="${tpl.voice || ''}"></div>
        <div class="cfg-field"><label>LLM Prompt</label><input id="it-llm" value="${tpl.llmPrompt || ''}"></div>
      </div>
      <div class="section-title">效果列表 (JSON)</div>
      <div class="cfg-field"><textarea id="it-effects" style="min-height:100px;font-family:monospace;font-size:11px">${effPreview}</textarea></div>
      <div class="adm-actions"><button class="primary" id="btn-save-inter">保存互动模板</button></div>
    </div></div>`;
}

function renderNarrativeAdmin() {
  const nb = CONFIG.narrativeBubble || DEFAULT_CONFIG.narrativeBubble;
  const s = nb.settings || {};
  const llm = s.llm || {};
  const active = NarrativeBubbleSystem.getActiveBubbles();
  const activeHint = active.length
    ? active.map(b => `${getChar(b.charId)?.short || b.charId}：${(b.text || '').slice(0, 10)}…`).join('；')
    : '（无）';
  return `
    <p style="color:var(--jn-text-soft);margin-bottom:8px;line-height:1.5">
      可插拔叙事层：仅监听事件总线并绘制气泡，关闭后不影响需求/AI/互动。
      LLM 可选：开启后发出 <code>bubble:llm_request</code>；若填写 API 则 POST JSON
      <code>{ promptTag, system, context, fallbacks }</code>，期望返回 <code>{ text }</code>；
      外部也可调用 <code>NarrativeBubbleSystem.applyLLMResponse(requestId, text)</code>。
    </p>
    <div class="section-title">模块开关</div>
    <div class="cfg-grid">
      <div class="cfg-field"><label>总开关</label><input id="nb-master" type="checkbox" ${s.masterEnabled !== false ? 'checked' : ''}></div>
      <div class="cfg-field"><label>需求气泡</label><input id="nb-demand" type="checkbox" ${s.demandEnabled !== false ? 'checked' : ''}></div>
      <div class="cfg-field"><label>冲突剧场</label><input id="nb-conflict" type="checkbox" ${s.conflictEnabled !== false ? 'checked' : ''}></div>
      <div class="cfg-field"><label>记忆浮现</label><input id="nb-memory" type="checkbox" ${s.memoryEnabled !== false ? 'checked' : ''}></div>
      <div class="cfg-field"><label>同屏上限</label><input id="nb-max" type="number" min="1" max="12" value="${s.maxOnScreen ?? 6}"></div>
    </div>
    <div class="section-title">频率参数（游戏分钟）</div>
    <div class="cfg-grid">
      <div class="cfg-field"><label>需求间隔</label><input id="nb-d-int" type="number" value="${s.demand?.minIntervalGameMin ?? 5}"></div>
      <div class="cfg-field"><label>需求上限/分</label><input id="nb-d-max" type="number" value="${s.demand?.maxPerCharPerGameMin ?? 2}"></div>
      <div class="cfg-field"><label>冲突扫描间隔</label><input id="nb-c-scan" type="number" value="${s.conflict?.scanIntervalGameMin ?? 15}"></div>
      <div class="cfg-field"><label>冲突并发上限</label><input id="nb-c-max" type="number" value="${s.conflict?.maxConcurrent ?? 2}"></div>
    </div>
    <div class="section-title">语言模型（可选后端）</div>
    <div class="cfg-grid">
      <div class="cfg-field"><label>启用 LLM</label><input id="nb-llm-en" type="checkbox" ${llm.enabled ? 'checked' : ''}></div>
      <div class="cfg-field"><label>仅发事件</label><input id="nb-llm-ev" type="checkbox" ${llm.useEventOnly !== false ? 'checked' : ''} title="不填 API 时也发 bubble:llm_request 供外部接管"></div>
      <div class="cfg-field"><label>API URL</label><input id="nb-llm-url" value="${llm.apiUrl || ''}" placeholder="https://…/generate"></div>
      <div class="cfg-field"><label>API Key</label><input id="nb-llm-key" type="password" value="${llm.apiKey || ''}" placeholder="Bearer token"></div>
    </div>
    <div class="cfg-field"><label>System Prompt</label><textarea id="nb-llm-sys">${llm.systemPrompt || ''}</textarea></div>
    <div class="section-title">完整配置 JSON（demandBubbles / conflictTheaters / memorySurfaces）</div>
    <div class="cfg-field"><textarea id="nb-json" style="min-height:180px;font-family:monospace;font-size:11px">${JSON.stringify(nb, null, 2)}</textarea></div>
    <p style="color:var(--jn-text-soft);font-size:11px;margin:6px 0">当前气泡：${activeHint}</p>
    <div class="adm-actions">
      <button class="primary" id="btn-save-narrative">保存叙事配置</button>
      <button id="btn-reload-narrative">热重载（不重载场景）</button>
    </div>`;
}

function renderLifePathAdmin() {
  const lp = CONFIG.lifePathConfig || DEFAULT_CONFIG.lifePathConfig;
  const pathCount = Object.keys(lp.paths || {}).length;
  const stageCount = Object.keys(lp.stages || {}).length;
  const nodeCount = Object.keys(lp.storyNodes || {}).length;

  const runtime = (CHARS || []).filter(c => c.lifePath).map(c => {
    const path = lp.paths?.[c.lifePath];
    const stage = lp.stages?.[c.currentStage];
    return `${escapeHtml(c.short)}: ${escapeHtml(path?.name || c.lifePath)} · ${escapeHtml(stage?.title || c.currentStage || '?')} · 声望${c.reputation ?? 0}`;
  }).join('<br>') || '（无人择路）';

  let storySection = '';
  const pathChars = (CHARS || []).filter(c => c.lifePath && LifePathSystem?.getStoryProgress?.(c)?.length);
  for (const pc of pathChars) {
    const progress = LifePathSystem.getStoryProgress(pc);
    const done = progress.filter(n => n.done).length;
    const total = progress.length;
    const phaseNamesByPath = {
      xiren_concubine: { 1: '根基铺垫', 2: '情愫渐生', 3: '危机考验', 4: '正名确立' },
      xifeng_steward: { 1: '站稳脚跟', 2: '执掌大权', 3: '弄权经营', 4: '盛极而衰' },
    };
    const phaseNames = phaseNamesByPath[pc.lifePath] || {};
    const phaseGroups = {};
    for (const n of progress) {
      const ph = n.phase || 0;
      if (!phaseGroups[ph]) phaseGroups[ph] = [];
      phaseGroups[ph].push(n);
    }
    let rows = '';
    for (const ph of Object.keys(phaseGroups).sort((a, b) => a - b)) {
      const pnodes = phaseGroups[ph];
      const pdone = pnodes.filter(n => n.done).length;
      rows += `<tr><td colspan="3" style="color:var(--jn-heading);padding-top:6px;font-size:10px">第${ph}阶段·${escapeHtml(phaseNames[ph] || '')}（${pdone}/${pnodes.length}）</td></tr>`;
      for (const n of pnodes) {
        const statusColor = n.done ? 'var(--jn-green-light)' : 'var(--jn-text-dim)';
        const statusText = n.done ? `✓ 第${n.day ?? '?'}日` : '—';
        rows += `<tr>
          <td style="color:${statusColor};width:20px">${n.done ? '✓' : '○'}</td>
          <td style="color:var(--jn-heading)">${escapeHtml(n.name)}</td>
          <td style="color:${statusColor};font-size:10px">${statusText}${n.choice ? '·' + escapeHtml(n.choice) : ''}</td>
        </tr>`;
      }
    }
    const money = MoneySystem?.getBalance?.(pc) ?? 0;
    storySection += `
      <div class="section-title">${escapeHtml(pc.short)}故事节点（${done}/${total}）${money ? ` · 私银${money}` : ''}</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px">${rows}</table>`;
  }
  if (pathChars.length) {
    storySection += `<button class="sys-btn" id="btn-manual-node" style="margin-bottom:10px;font-size:11px">↑ 手动推进当前路径角色节点（调试）</button>`;
  }

  return `
    <p style="color:var(--jn-text-soft);margin-bottom:8px;line-height:1.5">
      人生路径与声望框架（0612_06）+ 袭人晋升故事线（0612_06_02）。
      已配置 ${pathCount} 条路径、${stageCount} 个阶段、${nodeCount} 个故事节点。
    </p>
    <p style="color:var(--jn-text-muted);font-size:11px;margin-bottom:10px">${runtime}</p>
    ${storySection}
    <div class="section-title">完整配置 JSON（paths / stages / settings / storyNodes）</div>
    <div class="cfg-field"><textarea id="lp-json" style="min-height:280px;font-family:monospace;font-size:11px">${JSON.stringify(lp, null, 2)}</textarea></div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-life-path">保存路径配置</button>
    </div>`;
}

function renderMultiInteractAdmin() {
  const mc = CONFIG.multiInteractConfig || DEFAULT_CONFIG.multiInteractConfig;
  return `
    <p style="color:var(--jn-text-soft);margin-bottom:8px;line-height:1.5">
      AI 观察-反应 + 情绪传染（见 11_多人互动.md）。保存后点「应用并重载」生效。
      观察反应 ${(mc.observerReactions || []).length} 条，传染规则 ${(mc.emotionContagion || []).length} 条。
    </p>
    <div class="section-title">完整配置 JSON（observerReactions / emotionContagion / statusTags）</div>
    <div class="cfg-field"><textarea id="mi-json" style="min-height:280px;font-family:monospace;font-size:11px">${JSON.stringify(mc, null, 2)}</textarea></div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-multi">保存多人互动配置</button>
      <button id="btn-reload-multi">热重载</button>
      <button id="btn-test-observe">测试：宝钗场景观察</button>
    </div>`;
}

function renderQuestAdmin() {
  const qc = CONFIG.questConfig || DEFAULT_CONFIG.questConfig;
  const tplCount = Object.keys(qc.templates || {}).length;
  const routineCount = (qc.dailyRoutines || []).length;
  const servantCount = (qc.servantConfig?.contracts || []).length;
  const servantRoutineCount = (qc.servantConfig?.dutyRoutines || []).length;
  return `
    <p style="color:var(--jn-text-soft);margin-bottom:8px;line-height:1.5">
      可插拔任务系统：身份分层差遣（issuePermissions + issuerRelationRequired）与日常时辰表。
      玩家点击人物菜单「差遣」下发；进度监听家具/互动/跟随；AI 按权限随机下发。
    </p>
    <div class="cfg-grid">
      <div class="cfg-field"><label>总开关</label><input id="qc-master" type="checkbox" ${qc.masterEnabled !== false ? 'checked' : ''}></div>
      <div class="cfg-field"><label>AI下发间隔(游戏分)</label><input id="qc-issue-int" type="number" value="${qc.aiIssueIntervalGameMin ?? 60}"></div>
      <div class="cfg-field"><label>待回应过期(游戏分)</label><input id="qc-pending-exp" type="number" value="${qc.pendingExpireGameMin ?? 180}"></div>
      <div class="cfg-field"><label>任务行动加权</label><input id="qc-weight" type="number" step="0.1" value="${qc.questWeightBoost ?? 3.5}"></div>
      <div class="cfg-field"><label>显示社交虚线</label><input id="qc-social-links" type="checkbox" ${qc.ui?.showSocialLinks !== false ? 'checked' : ''}></div>
    </div>
    <p style="color:var(--jn-text-soft);font-size:11px">社交虚线图例：金色表示自主寻找或前往社交，蓝灰色表示正在进行普通互动。</p>
    <p style="color:var(--jn-text-soft);font-size:11px">
      已配置 ${tplCount} 个模板、${routineCount} 条旧日常时间表、${servantCount} 条仆从职责契约、${servantRoutineCount} 条契约日课。
      契约日课优先于旧日常表，同一人物/模板/时辰不会重复下发。
    </p>
    <div class="section-title">完整配置 JSON（templates / dailyRoutines）</div>
    <div class="cfg-field"><textarea id="qc-json" style="min-height:220px;font-family:monospace;font-size:11px">${JSON.stringify(qc, null, 2)}</textarea></div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-quest">保存任务配置</button>
      <button id="btn-reload-quest">热重载</button>
      <button id="btn-test-quest">测试：向当前角色下发作诗陪吟</button>
    </div>`;
}

function furnitureNeedSummary(tpl) {
  const rows = tpl.needRestores || [];
  if (!rows.length) return '—';
  return rows.map(r => {
    const label = getNeedDefs().find(n => n.key === r.need)?.label || r.need;
    const rate = r.ratePerGameMin ?? r.ratePerSec ?? 0;
    return `${label}+${rate}/分`;
  }).join(' · ');
}

function furnitureActionSummary(tpl) {
  const actions = tpl.actions || [];
  if (!actions.length) return '默认使用';
  return actions.map(a => a.name || a.id || '未命名').slice(0, 3).join(' / ') + (actions.length > 3 ? ` 等${actions.length}项` : '');
}

function furnitureOptionsHtml(selectedId) {
  return Object.entries(CONFIG.furnitureTemplates || {}).map(([id, tpl]) =>
    `<option value="${id}"${+id === +selectedId ? ' selected' : ''}>${escapeHtml(tpl.icon || '')} ${escapeHtml(tpl.name || id)} · ${id}</option>`
  ).join('');
}

function sceneOptionsHtml(selectedId) {
  return (CONFIG.scenes || []).map(scene =>
    `<option value="${scene.id}"${+scene.id === +selectedId ? ' selected' : ''}>${escapeHtml(scene.name || scene.id)} · ${scene.id}</option>`
  ).join('');
}

function lifeLineOptionsHtml(selected) {
  const labels = getFurnitureConfig().lifeLineLabels || {};
  const keys = [...new Set(['食', '衣', '住', '行', '闲', ...Object.keys(labels)])];
  return keys.map(key =>
    `<option value="${adminAttr(key)}"${key === selected ? ' selected' : ''}>${escapeHtml(labels[key] || key)}</option>`
  ).join('');
}

function essentialOptionsHtml(selected) {
  return [
    ['false', '普通'],
    ['true', '基础'],
  ].map(([value, label]) =>
    `<option value="${value}"${String(!!selected) === value ? ' selected' : ''}>${label}</option>`
  ).join('');
}

function furnitureLifeLineNeedMapHtml() {
  const cfg = getFurnitureConfig();
  const labels = cfg.lifeLineLabels || {};
  const map = cfg.lifeLineNeedMap || {};
  const needLabel = key => getNeedDefs().find(n => n.key === key)?.name || key;
  return Object.entries(labels).map(([key, label]) => {
    const needs = (map[key] || []).map(needLabel).join(' / ') || '无直接对应';
    return `<span class="meta-tag">${escapeHtml(label)} → ${escapeHtml(needs)}</span>`;
  }).join('');
}

function skillOptionsHtml(selected) {
  const rows = [`<option value=""${!selected ? ' selected' : ''}>无</option>`];
  for (const [id, def] of Object.entries(CONFIG.skillDefs || {})) {
    rows.push(`<option value="${adminAttr(id)}"${id === selected ? ' selected' : ''}>${escapeHtml(def.name || id)} · ${escapeHtml(id)}</option>`);
  }
  return rows.join('');
}

function renderFurnTplAdmin() {
  const templateRows = Object.entries(CONFIG.furnitureTemplates || {}).map(([id, tpl]) => {
    const actionValidation = validateFurnitureActions(tpl.actions || []);
    const actionColor = actionValidation.errors.length ? 'var(--jn-red-bright)' : 'var(--jn-green-bright)';
    const entry = tpl.entryOffset || [0, 1];
    return `
      <tr>
        <td class="meta-id">${escapeHtml(id)}</td>
        <td><input class="furn-inline" data-furn-template="${id}" data-field="icon" value="${adminAttr(tpl.icon || '')}"></td>
        <td><input class="furn-inline name" data-furn-template="${id}" data-field="name" value="${adminAttr(tpl.name || '')}"></td>
        <td><input class="furn-inline" data-furn-template="${id}" data-field="category" value="${adminAttr(tpl.category || '')}"></td>
        <td><select class="furn-inline" data-furn-template="${id}" data-field="lifeLine">${lifeLineOptionsHtml(tpl.lifeLine)}</select></td>
        <td><select class="furn-inline small" data-furn-template="${id}" data-field="essential" data-type="bool">${essentialOptionsHtml(tpl.essential)}</select></td>
        <td class="furn-pair"><input type="number" data-furn-template="${id}" data-field="gridW" data-type="number" value="${tpl.gridW ?? 1}"><span>×</span><input type="number" data-furn-template="${id}" data-field="gridH" data-type="number" value="${tpl.gridH ?? 1}"></td>
        <td class="furn-pair"><input type="number" data-furn-template="${id}" data-field="entryOffset.0" data-type="number" value="${entry[0] ?? 0}"><span>,</span><input type="number" data-furn-template="${id}" data-field="entryOffset.1" data-type="number" value="${entry[1] ?? 1}"></td>
        <td><input class="furn-inline small" type="number" step="0.1" data-furn-template="${id}" data-field="duration" data-type="number" value="${tpl.duration ?? 1}"></td>
        <td><input class="furn-inline small" type="number" data-furn-template="${id}" data-field="maxUsers" data-type="number" value="${tpl.maxUsers ?? 1}"></td>
        <td><select class="furn-inline" data-furn-template="${id}" data-field="skill">${skillOptionsHtml(tpl.skill || '')}</select></td>
        <td><input class="furn-inline small" type="number" min="1" data-furn-template="${id}" data-field="skillLevel" data-type="number" value="${tpl.skillLevel || 1}"></td>
        <td><input type="checkbox" data-furn-template="${id}" data-field="stopWhenFull" data-type="bool" ${tpl.stopWhenFull ? 'checked' : ''}></td>
        <td>${escapeHtml(furnitureNeedSummary(tpl))}</td>
        <td title="${adminAttr(furnitureActionSummary(tpl))}">${(tpl.actions || []).length || 0}<span style="color:${actionColor};margin-left:4px">●</span></td>
        <td><button class="mini-btn danger" data-furn-delete-template="${id}">删</button></td>
      </tr>
      <tr class="furn-detail-row">
        <td colspan="16">
          <details>
            <summary>展开编辑：需求恢复 / 多动作 / 额外效果</summary>
            <div class="furn-detail-grid">
              <div class="cfg-field"><label>needRestores JSON（每游戏分钟恢复量）</label>
                <textarea class="furn-json" data-furn-template-json="${id}" data-json-field="needRestores">${escapeHtml(JSON.stringify(tpl.needRestores || [], null, 2))}</textarea>
              </div>
              <div class="cfg-field"><label>actions JSON（点击家具菜单与 hover 描述）</label>
                <textarea class="furn-json" data-furn-template-json="${id}" data-json-field="actions">${escapeHtml(JSON.stringify(tpl.actions || [], null, 2))}</textarea>
              </div>
              <div class="cfg-field"><label>extraEffects JSON</label>
                <textarea class="furn-json small" data-furn-template-json="${id}" data-json-field="extraEffects">${escapeHtml(JSON.stringify(tpl.extraEffects || [], null, 2))}</textarea>
              </div>
              <div class="cfg-field"><label>目标需求值（床默认回到 80 用）</label>
                <input type="number" data-furn-template="${id}" data-field="targetNeedValue" data-type="optionalNumber" value="${tpl.targetNeedValue ?? ''}" placeholder="留空=不用">
              </div>
            </div>
            <div class="adm-actions">
              <button data-furn-add-action="${id}">给此家具新增动作</button>
              <button data-furn-validate-actions="${id}">校验此家具 actions</button>
            </div>
          </details>
        </td>
      </tr>`;
  }).join('');

  const instanceRows = (CONFIG.furnitureInstances || []).map((inst, idx) => {
    const tpl = CONFIG.furnitureTemplates?.[inst.templateId];
    return `<tr>
      <td><input class="furn-inline" type="number" data-furn-instance="${idx}" data-field="instanceId" data-type="number" value="${inst.instanceId}"></td>
      <td><select class="furn-inline" data-furn-instance="${idx}" data-field="sceneId" data-type="number">${sceneOptionsHtml(inst.sceneId)}</select></td>
      <td><select class="furn-inline" data-furn-instance="${idx}" data-field="templateId" data-type="number">${furnitureOptionsHtml(inst.templateId)}</select></td>
      <td class="meta-name">${escapeHtml(tpl?.name || '未知模板')}</td>
      <td><input class="furn-inline small" type="number" data-furn-instance="${idx}" data-field="anchorCol" data-type="number" value="${inst.anchorCol}"></td>
      <td><input class="furn-inline small" type="number" data-furn-instance="${idx}" data-field="anchorRow" data-type="number" value="${inst.anchorRow}"></td>
      <td>${escapeHtml(tpl ? `${tpl.gridW || 1}×${tpl.gridH || 1} / 入${(tpl.entryOffset || []).join(',')}` : '—')}</td>
      <td><button class="mini-btn danger" data-furn-delete-instance="${idx}">删</button></td>
    </tr>`;
  }).join('');

  const furnitureCfg = getFurnitureConfig();
  const lifeLineName = furnitureCfg.lifeLineName || '生活类目';
  const needGroupName = furnitureCfg.needGroupName || '基础需求';
  return `
    <style>
      .furn-admin-note { color:var(--jn-text-soft);font-size:11px;line-height:1.6;margin-bottom:8px }
      .furn-table-wrap { max-height:430px;overflow:auto;border:1px solid var(--jn-border-2);border-radius:8px;background:rgba(250,248,244,.08) }
      .furn-table { min-width:1320px;width:100%;border-collapse:collapse;font-size:11px }
      .furn-table th { position:sticky;top:0;z-index:2;background:var(--jn-surface-deep);color:var(--jn-text-muted);font-weight:normal;text-align:left;padding:6px;border-bottom:1px solid var(--jn-border) }
      .furn-table td { padding:5px 6px;border-bottom:1px solid var(--jn-border-3);vertical-align:middle;color:var(--jn-text-soft) }
      .furn-table input,.furn-table select,.furn-table textarea { background:rgba(250,248,244,.2);border:1px solid rgba(107,90,76,.5);border-radius:5px;color:var(--jn-title);font-family:inherit;font-size:11px;padding:4px 6px }
      .furn-inline { width:100%;min-width:72px }
      .furn-inline.name { min-width:110px }
      .furn-inline.small { min-width:54px }
      .furn-pair { white-space:nowrap }
      .furn-pair input { width:46px }
      .furn-pair span { display:inline-block;margin:0 3px;color:var(--jn-text-dim) }
      .furn-detail-row td { background:rgba(66,82,65,.14);padding:0 8px 8px }
      .furn-detail-row summary { cursor:pointer;color:var(--jn-heading);padding:7px 0 }
      .furn-detail-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px }
      .furn-json { width:100%;min-height:140px;font-family:monospace!important;font-size:10px!important }
      .furn-json.small { min-height:74px }
      .mini-btn { border:1px solid var(--jn-border);border-radius:999px;background:var(--jn-surface-active);color:var(--jn-title);padding:3px 8px;font-family:inherit;cursor:pointer }
      .mini-btn.danger { border-color:var(--jn-red-dark);color:var(--jn-red-bright) }
      @media (max-width:760px) { .furn-detail-grid { grid-template-columns:1fr } }
    </style>
    <p class="furn-admin-note">
      家具模板决定「能做什么」，场景摆放决定「在哪里」。普通字段直接在表格里改，离开单元格即保存并热重载；
      复杂的需求恢复、多动作和额外效果在每行详情里编辑。
      <br>${escapeHtml(lifeLineName)}是家具粗分类，${escapeHtml(needGroupName)}是 NPC 身上的六项数值；真正恢复多少以 needRestores/actions 为准。
    </p>
    <div class="cfg-enums"><b>${escapeHtml(lifeLineName)} → ${escapeHtml(needGroupName)}参考</b><p>${furnitureLifeLineNeedMapHtml()}</p></div>
    <div class="adm-actions">
      <button id="btn-furn-add-template">新增家具模板</button>
      <button id="btn-furn-add-instance">新增场景摆放</button>
      <button id="btn-furn-apply">应用并重载家具</button>
    </div>

    <div class="section-title">家具模板表（${Object.keys(CONFIG.furnitureTemplates || {}).length}项）</div>
    <div class="furn-table-wrap">
      <table class="furn-table">
        <thead><tr>
          <th>ID</th><th>图标</th><th>名称</th><th>分类</th><th>${escapeHtml(lifeLineName)}</th><th>基础</th><th>格宽×高</th><th>入口X,Y</th>
          <th>时长</th><th>人数</th><th>技能</th><th>等级</th><th>满停</th><th>恢复摘要</th><th>动作</th><th>操作</th>
        </tr></thead>
        <tbody>${templateRows || '<tr><td colspan="16" class="logic-muted">暂无家具模板</td></tr>'}</tbody>
      </table>
    </div>

    <div class="section-title">场景摆放表（${(CONFIG.furnitureInstances || []).length}项）</div>
    <div class="furn-table-wrap" style="max-height:330px">
      <table class="furn-table" style="min-width:920px">
        <thead><tr><th>实例ID</th><th>场景</th><th>模板</th><th>模板名</th><th>列</th><th>行</th><th>尺寸/入口</th><th>操作</th></tr></thead>
        <tbody>${instanceRows || '<tr><td colspan="8" class="logic-muted">暂无摆放实例</td></tr>'}</tbody>
      </table>
    </div>`;
}

function adminV2Matches(text) {
  const q = (adminV2Search || '').trim().toLowerCase();
  return !q || String(text || '').toLowerCase().includes(q);
}

function renderAdminV2Dashboard() {
  return `
    <div class="admin-v2-kpis">
      <div class="admin-v2-kpi"><b>${CONFIG.characters?.length || 0}</b><span>人物</span></div>
      <div class="admin-v2-kpi"><b>${Object.keys(CONFIG.furnitureTemplates || {}).length}</b><span>家具模板</span></div>
      <div class="admin-v2-kpi"><b>${(CONFIG.furnitureInstances || []).length}</b><span>家具摆放</span></div>
      <div class="admin-v2-kpi"><b>${Object.keys(CONFIG.questConfig?.templates || {}).length}</b><span>任务模板</span></div>
    </div>
    <div class="admin-v2-empty">
      v2 后台第一版已经搭好壳：左侧分组、顶部工具栏、主表格、右侧详情。
      当前家具模板和家具摆放已迁移，其它模块先保留占位。
    </div>`;
}

function renderAdminV2FurnitureTemplates() {
  const entries = Object.entries(CONFIG.furnitureTemplates || {})
    .filter(([id, tpl]) => adminV2Matches([id, tpl.name, tpl.category, tpl.lifeLine, furnitureNeedSummary(tpl)].join(' ')));
  if (!adminV2SelectedTpl || !CONFIG.furnitureTemplates?.[adminV2SelectedTpl]) adminV2SelectedTpl = entries[0]?.[0] || Object.keys(CONFIG.furnitureTemplates || {})[0] || '';
  const lifeLineName = getFurnitureConfig().lifeLineName || '生活类目';
  const rows = entries.map(([id, tpl]) => {
    const entry = tpl.entryOffset || [0, 1];
    return `<tr class="${String(id) === String(adminV2SelectedTpl) ? 'sel' : ''}" data-admin-v2-select-template="${id}">
      <td class="meta-id">${escapeHtml(id)}</td>
      <td><input data-admin-v2-template="${id}" data-field="name" value="${adminAttr(tpl.name || '')}"></td>
      <td><input data-admin-v2-template="${id}" data-field="category" value="${adminAttr(tpl.category || '')}"></td>
      <td><select data-admin-v2-template="${id}" data-field="lifeLine">${lifeLineOptionsHtml(tpl.lifeLine)}</select></td>
      <td><select data-admin-v2-template="${id}" data-field="essential" data-type="bool">${essentialOptionsHtml(tpl.essential)}</select></td>
      <td><input class="mini" type="number" data-admin-v2-template="${id}" data-field="gridW" data-type="number" value="${tpl.gridW ?? 1}"> × <input class="mini" type="number" data-admin-v2-template="${id}" data-field="gridH" data-type="number" value="${tpl.gridH ?? 1}"></td>
      <td><input class="mini" type="number" data-admin-v2-template="${id}" data-field="entryOffset.0" data-type="number" value="${entry[0] ?? 0}"> , <input class="mini" type="number" data-admin-v2-template="${id}" data-field="entryOffset.1" data-type="number" value="${entry[1] ?? 1}"></td>
      <td><input class="mini" type="number" step="0.1" data-admin-v2-template="${id}" data-field="duration" data-type="number" value="${tpl.duration ?? 1}"></td>
      <td><input class="mini" type="number" data-admin-v2-template="${id}" data-field="maxUsers" data-type="number" value="${tpl.maxUsers ?? 1}"></td>
      <td><select data-admin-v2-template="${id}" data-field="skill">${skillOptionsHtml(tpl.skill || '')}</select></td>
      <td>${escapeHtml(furnitureNeedSummary(tpl))}</td>
      <td>${(tpl.actions || []).length || 0}</td>
      <td><button class="mini-btn danger" data-admin-v2-delete-template="${id}">删</button></td>
    </tr>`;
  }).join('');
  return `
    <div class="admin-v2-content">
      <div class="admin-v2-table-wrap">
        <table class="admin-v2-table">
          <thead><tr><th>ID</th><th>名称</th><th>分类</th><th>${escapeHtml(lifeLineName)}</th><th>基础</th><th>尺寸</th><th>入口</th><th>时长</th><th>人数</th><th>技能</th><th>恢复摘要</th><th>动作</th><th>操作</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="13" class="logic-muted">没有匹配的家具模板</td></tr>'}</tbody>
        </table>
      </div>
      ${renderAdminV2FurnitureTemplateDrawer()}
    </div>`;
}

function renderAdminV2FurnitureTemplateDrawer() {
  const tpl = CONFIG.furnitureTemplates?.[adminV2SelectedTpl];
  if (!tpl) return `<aside class="admin-v2-drawer"><h4>未选中家具</h4></aside>`;
  return `<aside class="admin-v2-drawer">
    <h4>${escapeHtml(tpl.name || adminV2SelectedTpl)} · ${escapeHtml(adminV2SelectedTpl)}</h4>
    <div class="cfg-field"><label>图标</label><input data-admin-v2-template="${adminV2SelectedTpl}" data-field="icon" value="${adminAttr(tpl.icon || '')}"></div>
    <div class="cfg-field"><label>颜色</label><input data-admin-v2-template="${adminV2SelectedTpl}" data-field="color" value="${adminAttr(tpl.color || '')}"></div>
    <div class="cfg-field"><label>目标需求值</label><input type="number" data-admin-v2-template="${adminV2SelectedTpl}" data-field="targetNeedValue" data-type="optionalNumber" value="${tpl.targetNeedValue ?? ''}" placeholder="留空=不用"></div>
    <div class="cfg-field"><label>needRestores JSON</label><textarea data-admin-v2-template-json="${adminV2SelectedTpl}" data-json-field="needRestores">${escapeHtml(JSON.stringify(tpl.needRestores || [], null, 2))}</textarea></div>
    <div class="cfg-field"><label>actions JSON</label><textarea data-admin-v2-template-json="${adminV2SelectedTpl}" data-json-field="actions">${escapeHtml(JSON.stringify(tpl.actions || [], null, 2))}</textarea></div>
    <div class="cfg-field"><label>extraEffects JSON</label><textarea data-admin-v2-template-json="${adminV2SelectedTpl}" data-json-field="extraEffects">${escapeHtml(JSON.stringify(tpl.extraEffects || [], null, 2))}</textarea></div>
    <div class="adm-actions">
      <button data-admin-v2-add-action="${adminV2SelectedTpl}">新增动作</button>
      <button data-admin-v2-validate-actions="${adminV2SelectedTpl}">校验 actions</button>
    </div>
  </aside>`;
}

function renderAdminV2FurnitureInstances() {
  const rows = (CONFIG.furnitureInstances || [])
    .map((inst, idx) => ({ inst, idx, tpl: CONFIG.furnitureTemplates?.[inst.templateId], scene: getScene?.(inst.sceneId) }))
    .filter(row => adminV2Matches([row.inst.instanceId, row.scene?.name, row.inst.sceneId, row.tpl?.name, row.inst.templateId].join(' ')));
  if (adminV2SelectedInst == null || !CONFIG.furnitureInstances?.[adminV2SelectedInst]) adminV2SelectedInst = rows[0]?.idx ?? 0;
  const html = rows.map(({ inst, idx, tpl, scene }) => `<tr class="${idx === adminV2SelectedInst ? 'sel' : ''}" data-admin-v2-select-instance="${idx}">
    <td><input class="mini" type="number" data-admin-v2-instance="${idx}" data-field="instanceId" data-type="number" value="${inst.instanceId}"></td>
    <td><select data-admin-v2-instance="${idx}" data-field="sceneId" data-type="number">${sceneOptionsHtml(inst.sceneId)}</select></td>
    <td><select data-admin-v2-instance="${idx}" data-field="templateId" data-type="number">${furnitureOptionsHtml(inst.templateId)}</select></td>
    <td>${escapeHtml(tpl?.name || '未知模板')}</td>
    <td><input class="mini" type="number" data-admin-v2-instance="${idx}" data-field="anchorCol" data-type="number" value="${inst.anchorCol}"></td>
    <td><input class="mini" type="number" data-admin-v2-instance="${idx}" data-field="anchorRow" data-type="number" value="${inst.anchorRow}"></td>
    <td>${escapeHtml(scene?.name || '未知场景')}</td>
    <td><button class="mini-btn danger" data-admin-v2-delete-instance="${idx}">删</button></td>
  </tr>`).join('');
  return `
    <div class="admin-v2-content">
      <div class="admin-v2-table-wrap">
        <table class="admin-v2-table" style="min-width:860px">
          <thead><tr><th>实例ID</th><th>场景</th><th>家具模板</th><th>模板名</th><th>列</th><th>行</th><th>场景名</th><th>操作</th></tr></thead>
          <tbody>${html || '<tr><td colspan="8" class="logic-muted">没有匹配的摆放实例</td></tr>'}</tbody>
        </table>
      </div>
      ${renderAdminV2FurnitureInstanceDrawer()}
    </div>`;
}

function renderAdminV2FurnitureInstanceDrawer() {
  const inst = CONFIG.furnitureInstances?.[adminV2SelectedInst];
  if (!inst) return `<aside class="admin-v2-drawer"><h4>未选中摆放</h4></aside>`;
  const tpl = CONFIG.furnitureTemplates?.[inst.templateId];
  const scene = getScene?.(inst.sceneId);
  return `<aside class="admin-v2-drawer">
    <h4>摆放 ${escapeHtml(inst.instanceId)}</h4>
    <p style="color:var(--jn-text-soft);font-size:11px;line-height:1.7;margin-bottom:8px">
      ${escapeHtml(scene?.name || '未知场景')} · ${escapeHtml(tpl?.name || '未知模板')}
    </p>
    <div class="cfg-field"><label>模板尺寸 / 入口</label><input readonly value="${adminAttr(tpl ? `${tpl.gridW || 1}×${tpl.gridH || 1} / ${((tpl.entryOffset || []).join(','))}` : '—')}"></div>
    <div class="cfg-field"><label>实例 JSON</label><textarea readonly>${escapeHtml(JSON.stringify(inst, null, 2))}</textarea></div>
    <div class="adm-actions"><button id="btn-admin-v2-check-connectivity">检测连通性</button></div>
  </aside>`;
}

const TRAIT_CATEGORY_OPTIONS = ['性情', '处世', '习惯'];
const TRAIT_CATEGORY_ASSETS = [
  { category: '性情', src: 'assets/UI/Personality/1_Personality.png', desc: '人物底层情绪与反应倾向。' },
  { category: '习惯', src: 'assets/UI/Personality/2_Habits.png', desc: '日常生活偏好与身体习惯。' },
  { category: '处世', src: 'assets/UI/Personality/3_Social.png', desc: '对人、对局面、对关系的处理方式。' },
];

function normalizeTraitCategoryName(category) {
  return ({ 脾性: '性情', 社交: '处世', 习性: '习惯' })[category] || category || '性情';
}

function adminCharAvatarUrl(c) {
  return (typeof AssetSystem !== 'undefined' && (AssetSystem.avatarUrlForChar?.(c) || AssetSystem.portraitUrlForChar?.(c))) || '';
}

function adminCharPortraitUrl(c) {
  return (typeof AssetSystem !== 'undefined' && (AssetSystem.fullPortraitUrlForChar?.(c) || AssetSystem.portraitUrlForChar?.(c) || AssetSystem.avatarUrlForChar?.(c))) || '';
}

function adminIdentityLabel(c) {
  const rank = c?.socialRank ?? '';
  return CONFIG.identityProtocolConfig?.rankLabels?.[rank] || (rank === '' ? '未设' : `阶层 ${rank}`);
}

function adminCurrentEditorFamilyId() {
  const families = CONFIG.familyConfig?.families || [];
  if (!families.length) return null;
  if (adminV2CharacterFamilyId && families.some(f => String(f.id) === String(adminV2CharacterFamilyId))) return adminV2CharacterFamilyId;
  const currentChar = CONFIG.characters[adminSelChar];
  const membership = currentChar ? characterFamilyMembership(currentChar.id) : null;
  const runtimeFamilyId = typeof FamilySystem !== 'undefined' ? FamilySystem.getCurrentFamilyId?.() : null;
  adminV2CharacterFamilyId = membership?.family?.id || runtimeFamilyId || families[0].id;
  return adminV2CharacterFamilyId;
}

function adminSelectCharById(charId) {
  const idx = CONFIG.characters.findIndex(c => c.id === charId);
  if (idx >= 0) adminSelChar = idx;
}

function adminTraitDetailTitle(id, row) {
  const opposite = row?.oppositeTrait ? CONFIG.charSpecialtyConfig?.traitMetadata?.[row.oppositeTrait] : null;
  const parts = [
    `${row?.label || id} · ${normalizeTraitCategoryName(row?.category)}`,
    row?.description || '',
    row?.effectExamples?.length ? `效果：${row.effectExamples.join(' / ')}` : '',
    opposite ? `对偶：${opposite.label || row.oppositeTrait}` : '',
  ].filter(Boolean);
  return parts.join('\n');
}

function adminEnsureFloatingTooltip() {
  let tip = document.getElementById('admin-floating-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'admin-floating-tooltip';
    tip.className = 'admin-floating-tooltip';
    document.body.appendChild(tip);
  }
  return tip;
}

function adminPlaceFloatingTooltip(tip, evt) {
  const gap = 16;
  const rect = tip.getBoundingClientRect();
  let x = evt.clientX + gap;
  let y = evt.clientY + gap;
  const maxX = window.innerWidth - rect.width - 8;
  const maxY = window.innerHeight - rect.height - 8;
  if (x > maxX) x = evt.clientX - rect.width - gap;
  if (y > maxY) y = evt.clientY - rect.height - gap;
  tip.style.transform = `translate3d(${Math.max(8, x)}px,${Math.max(8, y)}px,0)`;
}

function bindAdminFloatingTooltips(root = document) {
  const tip = adminEnsureFloatingTooltip();
  if (document.__adminTooltipMove) document.removeEventListener('mousemove', document.__adminTooltipMove, true);
  if (document.__adminTooltipLeave) document.removeEventListener('mouseleave', document.__adminTooltipLeave, true);
  document.__adminTooltipRoot = root;
  document.__adminTooltipMove = evt => {
    const activeRoot = document.__adminTooltipRoot || document;
    const target = evt.target.closest?.('[data-tooltip]');
    if (!target || !activeRoot.contains(target)) {
      tip.classList.remove('visible');
      tip.style.transform = 'translate3d(-9999px,-9999px,0)';
      return;
    }
    const text = target.dataset.tooltip || '';
    if (!text) return;
    if (tip.textContent !== text) tip.textContent = text;
    tip.classList.add('visible');
    adminPlaceFloatingTooltip(tip, evt);
  };
  document.__adminTooltipLeave = () => {
    tip.classList.remove('visible');
    tip.style.transform = 'translate3d(-9999px,-9999px,0)';
  };
  document.addEventListener('mousemove', document.__adminTooltipMove, true);
  document.addEventListener('mouseleave', document.__adminTooltipLeave, true);
}

function adminOrderedTraitPairs(category) {
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const used = new Set();
  const rows = [];
  const add = id => {
    if (!meta[id] || used.has(id) || normalizeTraitCategoryName(meta[id].category) !== category) return;
    const oppositeId = meta[id].oppositeTrait;
    if (oppositeId && meta[oppositeId] && normalizeTraitCategoryName(meta[oppositeId].category) === category && !used.has(oppositeId)) {
      rows.push([id, oppositeId]);
      used.add(id); used.add(oppositeId);
    } else {
      rows.push([id]);
      used.add(id);
    }
  };
  TRAIT_PAIR_ORDER.flat().forEach(add);
  Object.keys(meta)
    .sort((a, b) => (meta[a]?.label || a).localeCompare(meta[b]?.label || b, 'zh-Hans-CN'))
    .forEach(add);
  return rows;
}

function adminSaveCharacterEditor() {
  const c = CONFIG.characters[adminSelChar];
  if (!c) return;
  const gender = document.getElementById('admin-v2-char-gender')?.value;
  if (gender) c.gender = gender;
  const ageRaw = document.getElementById('admin-v2-char-age')?.value?.trim();
  if (ageRaw) c.age = Math.max(0, +ageRaw || 0);
  else delete c.age;
  const rankRaw = document.getElementById('admin-v2-char-rank')?.value;
  if (rankRaw !== undefined && rankRaw !== '') c.socialRank = +rankRaw;

  const selected = [...document.querySelectorAll('.character-trait-name.selected[data-admin-v2-editor-trait]')]
    .map(btn => btn.dataset.adminV2EditorTrait)
    .filter(Boolean);
  CONFIG.charSpecialtyConfig ||= {};
  CONFIG.charSpecialtyConfig.profiles ||= {};
  const profile = CONFIG.charSpecialtyConfig.profiles[c.id] ||= { aiTraits: [], displayTraits: [], specialties: [], checks: {} };
  profile.aiTraits = selected;
  profile.displayTraits = selected.map(id => CONFIG.charSpecialtyConfig?.traitMetadata?.[id]?.label || CONFIG.charSpecialtyConfig?.traitLabels?.[id] || id);
  const specialtiesRaw = document.getElementById('admin-v2-char-specialties-json')?.value;
  if (specialtiesRaw != null) {
    try { profile.specialties = JSON.parse(specialtiesRaw || '[]'); }
    catch (e) { alert('人物专属性格 JSON 无效'); return; }
  } else {
    profile.specialties ||= [];
  }
  profile.checks ||= {};

  saveConfigToStorage();
  CharSpecialtySystem?.init?.();
  syncTraitLabelsFromMetadata();
  adminV2CharacterEditing = false;
  renderAdmin();
}

function renderAdminV2Characters() {
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const profiles = CONFIG.charSpecialtyConfig?.profiles || {};
  const rows = (CONFIG.characters || []).map(c => {
    const profile = profiles[c.id] || {};
    const membership = characterFamilyMembership(c.id);
    const traits = [...(profile.aiTraits || []), ...(profile.displayTraits || [])]
      .filter((id, index, arr) => id && arr.indexOf(id) === index);
    const tags = traits.map(id => {
      const row = meta[id] || {};
      const category = normalizeTraitCategoryName(row.category);
      const title = `${category} · ${row.description || id}`;
      return `<span class="meta-tag" title="${adminAttr(title)}">${escapeHtml(row.label || CONFIG.charSpecialtyConfig?.traitLabels?.[id] || id)}</span>`;
    }).join('');
    const specTags = (profile.specialties || []).map(spec => {
      const row = adminSpecialtyMeta(c.id, spec);
      const title = adminSpecialtyDetailTitle(c.id, spec);
      return `<span class="meta-tag" title="${adminAttr(title)}">${escapeHtml(row.label || spec.name || spec.id)}</span>`;
    }).join('');
    return `<tr data-admin-v2-char-row="${adminAttr(c.id)}">
      <td class="meta-name">${escapeHtml(c.name || c.id)}</td>
      <td class="meta-id">${escapeHtml(c.id)}</td>
      <td>${escapeHtml(c.gender || '—')}</td>
      <td>${escapeHtml(adminIdentityLabel(c))}</td>
      <td>${escapeHtml(membership.family?.name || '未加入')}</td>
      <td>${escapeHtml(membership.member?.role || '—')}</td>
      <td><div class="character-trait-tags">${tags}${specTags}${tags || specTags ? '' : '<span class="logic-muted">未配置</span>'}</div></td>
      <td>${escapeHtml(c.personality || c.shortComment || '')}</td>
    </tr>`;
  }).join('');
  return `<div class="character-builder-page">
    <div class="admin-v2-table-wrap" style="max-height:36vh">
      <table class="admin-v2-table" style="min-width:1120px">
        <thead><tr><th>人物</th><th>ID</th><th>性别</th><th>身份</th><th>家庭</th><th>家庭身份</th><th>当前性格</th><th>摘要</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="8" class="logic-muted">暂无人物</td></tr>'}</tbody>
      </table>
    </div>
  </div>`;
}

function renderAdminV2CharacterEditor() {
  const families = CONFIG.familyConfig?.families || [];
  const familyId = adminCurrentEditorFamilyId();
  const family = families.find(f => String(f.id) === String(familyId)) || families[0];
  const roleOrder = typeof FAMILY_ROLE_ORDER !== 'undefined' ? FAMILY_ROLE_ORDER : {};
  const memberIds = (family?.members || [])
    .slice()
    .sort((a, b) => (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99))
    .map(m => m.charId)
    .filter(id => CONFIG.characters.some(c => c.id === id));
  if (memberIds.length && !memberIds.includes(CONFIG.characters[adminSelChar]?.id)) adminSelectCharById(memberIds[0]);
  const c = CONFIG.characters[adminSelChar] || CONFIG.characters[0];
  const membership = c ? characterFamilyMembership(c.id) : { family: null, member: null };
  const profile = CONFIG.charSpecialtyConfig?.profiles?.[c?.id] || {};
  const selectedTraits = new Set([...(profile.aiTraits || []), ...(profile.displayTraits || [])]);
  const editing = adminV2CharacterEditing;
  const familyOptions = families.map(f =>
    `<option value="${adminAttr(f.id)}"${String(f.id) === String(family?.id) ? ' selected' : ''}>${escapeHtml(f.name)}</option>`
  ).join('');
  const avatars = memberIds.map(id => {
    const ch = CONFIG.characters.find(row => row.id === id);
    const url = adminCharAvatarUrl(ch);
    return `<button type="button" class="character-avatar-btn${ch?.id === c?.id ? ' active' : ''}" data-admin-v2-pick-char="${adminAttr(id)}" title="${adminAttr(ch?.name || id)}">
      ${url ? `<img src="${adminAttr(url)}" alt="${adminAttr(ch?.short || ch?.name || id)}">` : `<span class="character-avatar-fallback" style="background:${adminAttr(ch?.color || '#c8d8c0')}"></span>`}
      <span>${escapeHtml(ch?.short || ch?.name || id)}</span>
    </button>`;
  }).join('');
  const portrait = adminCharPortraitUrl(c);
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const rankOptions = Object.entries(CONFIG.identityProtocolConfig?.rankLabels || {})
    .map(([id, label]) => `<option value="${adminAttr(id)}"${String(c?.socialRank ?? '') === String(id) ? ' selected' : ''}>${escapeHtml(label)} · ${escapeHtml(id)}</option>`)
    .join('');
  const traitColumns = TRAIT_CATEGORY_ASSETS.map(item => {
    const collapsed = !!adminV2CharacterTraitCollapsed[item.category];
    const categoryPairs = adminOrderedTraitPairs(item.category);
    const selectedInCategory = categoryPairs
      .flat()
      .filter(id => selectedTraits.has(id));
    const selectedSummary = selectedInCategory.map(id => {
      const row = meta[id] || {};
      return `<span class="meta-tag character-editor-tooltip" data-tooltip="${adminAttr(adminTraitDetailTitle(id, row))}">${escapeHtml(row.label || id)}</span>`;
    }).join('');
    const rows = categoryPairs.map(pair => {
      const slots = [pair[0], pair[1] || null].map(id => {
        if (!id) return `<span class="character-trait-icon empty"></span><span></span>`;
        const row = meta[id] || {};
        const selected = selectedTraits.has(id);
        const attrs = editing ? ` data-admin-v2-editor-trait="${adminAttr(id)}"` : '';
        return `<span class="character-trait-icon"></span><button type="button" class="character-trait-name character-editor-tooltip${selected ? ' selected' : ''}${editing ? ' editable' : ''}"${attrs} data-tooltip="${adminAttr(adminTraitDetailTitle(id, row))}">${escapeHtml(row.label || id)}</button>`;
      }).join('');
      return `<div class="character-trait-pair${pair.length === 1 ? ' single' : ''}" data-admin-v2-trait-pair="${adminAttr(pair.join('|'))}">${slots}</div>`;
    }).join('');
    return `<section class="character-trait-column">
      <div class="character-trait-column-head character-editor-tooltip" data-tooltip="${adminAttr(item.desc)}">
        <h4>${escapeHtml(item.category)}</h4>
      </div>
      <button type="button" class="character-trait-collapse" data-admin-v2-trait-collapse="${adminAttr(item.category)}" title="${collapsed ? '展开' : '收起'}">${collapsed ? '▾' : '▴'}</button>
      ${collapsed
        ? `<div class="character-trait-selected-summary">${selectedSummary || '<span class="logic-muted">未选</span>'}</div>`
        : `<div class="character-trait-list">${rows || '<span class="logic-muted">暂无配置</span>'}</div>`}
    </section>`;
  }).join('');
  const specialtyRows = (profile.specialties || []).map(spec => {
    const row = adminSpecialtyMeta(c.id, spec);
    return `<div class="character-trait-pair single">
      <span class="character-trait-icon"></span>
      <button type="button" class="character-trait-name character-editor-tooltip selected" data-tooltip="${adminAttr(adminSpecialtyDetailTitle(c.id, spec))}">${escapeHtml(row.label || spec.name || spec.id)}</button>
    </div>`;
  }).join('');
  const specialtyPanel = `<section class="character-trait-column character-specialty-column">
    <div class="character-trait-column-head character-editor-tooltip" data-tooltip="${adminAttr('角色专属梗、人物执念和个体化行为，不与通用性格互斥。')}">
      <h4>人物专属性格</h4>
    </div>
    <div class="character-trait-list">${specialtyRows || '<span class="logic-muted">暂无专属性格</span>'}</div>
    ${editing ? `<textarea id="admin-v2-char-specialties-json" style="margin-top:8px;min-height:150px">${escapeHtml(JSON.stringify(profile.specialties || [], null, 2))}</textarea>` : ''}
  </section>`;
  const editorActions = editing
    ? `<button id="btn-admin-v2-char-cancel">取消</button><button class="primary" id="btn-admin-v2-char-save">保存</button>`
    : `<button class="primary" id="btn-admin-v2-char-edit">编辑</button>`;
  return `<div class="character-editor-page">
    <div class="character-editor-top">
      <select id="admin-v2-editor-family">${familyOptions}</select>
      <div class="character-avatar-strip">${avatars || '<span class="logic-muted">当前家庭暂无人物</span>'}</div>
      <div class="character-editor-actions">${editorActions}</div>
    </div>
    <div class="character-editor-main">
      <aside class="character-editor-portrait">
        <div class="character-editor-portrait-art">
          ${portrait ? `<img src="${adminAttr(portrait)}" alt="${adminAttr(c?.name || '')}" loading="lazy" decoding="async">` : `<div class="character-editor-portrait-fallback" style="background:${adminAttr(c?.color || '#c8d8c0')}">${escapeHtml(c?.short || '人')}</div>`}
        </div>
        <div class="character-editor-summary">
          <b style="color:var(--jn-title);font-weight:normal">${escapeHtml(c?.name || '未选人物')}</b>
          <div>${escapeHtml(c?.shortComment || c?.personality || '暂无摘要')}</div>
        </div>
      </aside>
      <main class="character-editor-right">
        <div class="character-result-row">
          <div class="character-result-card"><label>性别</label>${editing
            ? `<select id="admin-v2-char-gender"><option value="女"${c?.gender === '女' ? ' selected' : ''}>女</option><option value="男"${c?.gender === '男' ? ' selected' : ''}>男</option></select>`
            : `<b>${escapeHtml(c?.gender || '未设')}</b><small>编辑后可改</small>`}</div>
          <div class="character-result-card"><label>年龄</label>${editing
            ? `<input id="admin-v2-char-age" type="number" min="0" value="${adminAttr(c?.age ?? '')}" placeholder="未设">`
            : `<b>${escapeHtml(c?.age || '未设')}</b><small>配置位预留</small>`}</div>
          <div class="character-result-card"><label>身份</label>${editing
            ? `<select id="admin-v2-char-rank">${rankOptions}</select>`
            : `<b>${escapeHtml(adminIdentityLabel(c))}</b><small>${escapeHtml(membership.family?.name || '未加入家庭')}${membership.member?.role ? ' · ' + escapeHtml(membership.member.role) : ''}</small>`}</div>
        </div>
        <div class="character-trait-columns">${traitColumns}${specialtyPanel}</div>
      </main>
    </div>
  </div>`;
}

function traitCategoryOptionsHtml(selected) {
  const normalized = normalizeTraitCategoryName(selected);
  return TRAIT_CATEGORY_OPTIONS.map(cat =>
    `<option value="${cat}"${cat === normalized ? ' selected' : ''}>${cat}</option>`
  ).join('');
}

const TRAIT_PAIR_ORDER = [
  ['leitian', 'beiguan'],
  ['jizao', 'wenhe'],
  ['mingan', 'chidun'],
  ['duochou', 'haoshuang'],
  ['reluo', 'gupi'],
  ['yuanhua', 'gengzhi'],
  ['duoyi', 'qingxin'],
  ['haosheng', 'qianrang'],
  ['tanzui', 'shaochi'],
  ['aijie', 'lata'],
  ['haodong', 'xijing'],
  ['shoushi', 'tuoyan'],
  ['shishui'],
  ['jianren', 'cuiruo'],
  ['pianzhi', 'yuanrong'],
  ['xurong', 'pushi'],
  ['zhouquan', 'zisi'],
  ['qinmian', 'xiedai'],
  ['congming', 'yudun'],
  ['caihua', 'pingyong'],
  ['kebo', 'houdao'],
  ['yinhuai', 'changliang'],
];

function traitOppositeOptionsHtml(selected, selfId) {
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const entries = Object.entries(meta)
    .filter(([id]) => id !== selfId)
    .sort((a, b) => {
      const ca = a[1]?.category || '';
      const cb = b[1]?.category || '';
      if (ca !== cb) return ca.localeCompare(cb, 'zh-Hans-CN');
      return (a[1]?.label || a[0]).localeCompare(b[1]?.label || b[0], 'zh-Hans-CN');
    });
  return [
    `<option value="">未成对</option>`,
    ...entries.map(([id, row]) => `<option value="${adminAttr(id)}"${id === selected ? ' selected' : ''}>${escapeHtml(row.label || id)} · ${escapeHtml(id)}</option>`),
  ].join('');
}

function orderedTraitEntries(entries) {
  const entryMap = new Map(entries);
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const used = new Set();
  const ordered = [];
  const add = id => {
    if (!entryMap.has(id) || used.has(id)) return;
    ordered.push([id, entryMap.get(id)]);
    used.add(id);
    const oppositeId = meta[id]?.oppositeTrait;
    if (oppositeId && entryMap.has(oppositeId) && !used.has(oppositeId)) {
      ordered.push([oppositeId, entryMap.get(oppositeId)]);
      used.add(oppositeId);
    }
  };
  TRAIT_PAIR_ORDER.flat().forEach(add);
  const rest = entries
    .filter(([id]) => !used.has(id))
    .sort((a, b) => {
      const ca = a[1]?.category || '';
      const cb = b[1]?.category || '';
      if (ca !== cb) return ca.localeCompare(cb, 'zh-Hans-CN');
      return (a[1]?.label || a[0]).localeCompare(b[1]?.label || b[0], 'zh-Hans-CN');
    });
  rest.forEach(([id]) => add(id));
  return ordered;
}

function traitPairGroupKey(id, row) {
  const opposite = row?.oppositeTrait;
  if (opposite) return [id, opposite].sort().join('↔');
  return `single:${id}`;
}

function traitPairGroupLabel(id, row) {
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const oppositeId = row?.oppositeTrait;
  const label = row?.label || id;
  if (oppositeId && meta[oppositeId]) return `${label} ↔ ${meta[oppositeId].label || oppositeId}`;
  if (oppositeId) return `${label} ↔ ${oppositeId}（未找到）`;
  return `${label} · 未成对`;
}

function traitEffectCellValue(row, key) {
  const value = row?.effects?.[key];
  return value == null ? '' : JSON.stringify(value);
}

function adminTraitSaved(msg = '已自动保存') {
  adminV2TraitSavedMessage = `${msg} · ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`;
  const el = document.getElementById('admin-v2-trait-save-status');
  if (el) el.textContent = adminV2TraitSavedMessage;
}

function normalizeTraitIdInput(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function adminRenameTraitId(oldId, rawNewId) {
  const newId = normalizeTraitIdInput(rawNewId);
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  if (!oldId || !meta[oldId]) return { ok: false, message: '原性格不存在' };
  if (!newId) return { ok: false, message: 'ID 不能为空，只支持英文/数字/下划线/短横线' };
  if (newId === oldId) return { ok: true, id: oldId, message: 'ID 未变化' };
  if (meta[newId]) return { ok: false, message: `ID「${newId}」已存在` };

  meta[newId] = meta[oldId];
  delete meta[oldId];
  for (const row of Object.values(meta)) {
    if (row?.oppositeTrait === oldId) row.oppositeTrait = newId;
  }

  const cfg = CONFIG.charSpecialtyConfig || {};
  if (cfg.traitLabels?.[oldId] !== undefined) {
    cfg.traitLabels[newId] = cfg.traitLabels[oldId];
    delete cfg.traitLabels[oldId];
  }
  if (cfg.traitNarratives?.[oldId] !== undefined) {
    cfg.traitNarratives[newId] = cfg.traitNarratives[oldId];
    delete cfg.traitNarratives[oldId];
  }
  if (cfg.traitModifiers?.[oldId] !== undefined) {
    cfg.traitModifiers[newId] = cfg.traitModifiers[oldId];
    delete cfg.traitModifiers[oldId];
  }

  for (const profile of Object.values(cfg.profiles || {})) {
    ['aiTraits', 'traits'].forEach(key => {
      if (Array.isArray(profile[key])) profile[key] = profile[key].map(id => id === oldId ? newId : id);
    });
  }
  syncTraitLabelsFromMetadata();
  CharSpecialtySystem?.init?.();
  saveConfigToStorage();
  adminV2TraitFocusId = newId;
  if (adminV2Search === oldId) adminV2Search = newId;
  adminTraitSaved(`ID 已改为 ${newId}`);
  return { ok: true, id: newId };
}

function adminRenderPreservingTraitScroll(scrollTop = null) {
  const previousScroll = scrollTop ?? document.querySelector('.admin-v2-trait-page .admin-v2-table-wrap')?.scrollTop ?? 0;
  renderAdmin();
  requestAnimationFrame(() => {
    const wrap = document.querySelector('.admin-v2-trait-page .admin-v2-table-wrap');
    if (wrap) wrap.scrollTop = previousScroll;
  });
}

function renderAdminV2PersonalityMeta() {
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const entries = Object.entries(meta)
    .filter(([id, row]) => adminV2Matches([id, row.label, row.category, row.description, ...(row.effectExamples || [])].join(' ')));
  const effectColumns = [
    ['actionWeights', '行动权重'],
    ['needCoeffs', '需求系数'],
    ['needThresholds', '需求阈值'],
    ['stateChance', '状态概率'],
    ['stateDuration', '状态时长'],
    ['stateRecovery', '状态恢复'],
    ['relation', '关系'],
    ['social', '社交'],
    ['quest', '任务'],
    ['movement', '移动'],
    ['money', '金钱'],
    ['memory', '记忆'],
    ['furnitureNeeds', '家具需求'],
    ['competition', '竞赛'],
  ];
  const orderedEntries = orderedTraitEntries(entries);
  let lastPairKey = '';
  const rows = orderedEntries.map(([id, row]) => {
    const pairKey = traitPairGroupKey(id, row);
    const pairHeader = pairKey !== lastPairKey
      ? `<tr class="trait-pair-row"><td colspan="21">${escapeHtml(traitPairGroupLabel(id, row))}</td></tr>`
      : '';
    lastPairKey = pairKey;
    return `${pairHeader}
    <tr data-admin-v2-trait-row="${adminAttr(id)}">
      <td class="meta-id"><input class="trait-id-cell" data-admin-v2-trait-id="${adminAttr(id)}" value="${adminAttr(id)}"></td>
      <td><input data-admin-v2-trait="${id}" data-field="label" value="${adminAttr(row.label || '')}"></td>
      <td><select data-admin-v2-trait="${id}" data-field="category">${traitCategoryOptionsHtml(row.category || '性情')}</select></td>
      <td><select class="trait-opposite-cell" data-admin-v2-trait="${id}" data-field="oppositeTrait">${traitOppositeOptionsHtml(row.oppositeTrait || '', id)}</select></td>
      <td><input class="trait-desc-cell" data-admin-v2-trait="${id}" data-field="description" value="${adminAttr(row.description || '')}"></td>
      <td><input class="trait-example-cell" data-admin-v2-trait="${id}" data-field="effectExamples" value="${adminAttr((row.effectExamples || []).join(' | '))}" placeholder="用 | 分隔"></td>
      ${effectColumns.map(([key]) => `<td><input class="trait-json-cell" data-admin-v2-trait-effect="${id}" data-effect-field="${key}" value="${adminAttr(traitEffectCellValue(row, key))}" placeholder="{}"></td>`).join('')}
      <td><button class="mini-btn danger" data-admin-v2-delete-trait="${id}">删</button></td>
    </tr>`;
  }).join('');
  return `
    <div class="admin-v2-trait-page">
      <div class="cfg-enums"><b>性格系统</b><p>表格改动会自动保存到本地配置，并立即同步到【人物设定】的性格选项。 <span class="meta-tag" id="admin-v2-trait-save-status">${escapeHtml(adminV2TraitSavedMessage || '等待改动')}</span></p></div>
      <div class="admin-v2-table-wrap" style="max-height:48vh">
        <table class="admin-v2-table trait-meta-table">
          <thead><tr>
            <th>ID</th><th>标签</th><th>分类</th><th>对偶</th><th>描述</th><th>效果示例</th>
            ${effectColumns.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join('')}
            <th>操作</th>
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="21" class="logic-muted">没有匹配的性格</td></tr>'}</tbody>
        </table>
      </div>
      <div class="admin-v2-trait-json">
        <details open>
          <summary>高级 JSON：性格叙事气泡 traitNarratives</summary>
          <textarea id="admin-v2-trait-narratives-json">${escapeHtml(JSON.stringify(CONFIG.charSpecialtyConfig?.traitNarratives || {}, null, 2))}</textarea>
        </details>
        <details>
          <summary>高级 JSON：AI 行为权重 traitModifiers</summary>
          <textarea id="admin-v2-trait-modifiers-json">${escapeHtml(JSON.stringify(CONFIG.charSpecialtyConfig?.traitModifiers || {}, null, 2))}</textarea>
        </details>
        <details>
          <summary>高级 JSON：人物专属性格 specialtyMetadata</summary>
          <textarea id="admin-v2-specialty-metadata-json">${escapeHtml(JSON.stringify(CONFIG.charSpecialtyConfig?.specialtyMetadata || {}, null, 2))}</textarea>
        </details>
        <details>
          <summary>高级 JSON：完整 traitMetadata</summary>
          <textarea id="admin-v2-trait-metadata-json">${escapeHtml(JSON.stringify(CONFIG.charSpecialtyConfig?.traitMetadata || {}, null, 2))}</textarea>
        </details>
        <div class="adm-actions">
          <button class="primary" id="btn-admin-v2-save-trait-json">保存下方 JSON</button>
        </div>
      </div>
    </div>`;
}

function renderFurnitureReactionAdmin() {
  const frc = CONFIG.furnitureReactionConfig || (CONFIG.furnitureReactionConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.furnitureReactionConfig || {})));
  const rows = (frc.rules || []).map(row => `
    <tr>
      <td class="meta-name">${escapeHtml(row.name || row.id)}</td>
      <td class="meta-id">${escapeHtml(row.id || '')}</td>
      <td><div class="meta-tags">${[...(row.tags || []), ...(row.actionIds || []), ...(row.observerTraits || [])]
        .map(tag => `<span class="meta-tag">${escapeHtml(tag)}</span>`).join('') || '<span class="logic-muted">无标签</span>'}</div></td>
      <td>${escapeHtml((row.bubbleTexts || row.texts || []).join(' / ') || '—')}</td>
      <td>${escapeHtml(String(row.cooldownGameMin ?? frc.defaultCooldownGameMin ?? 60))}分</td>
    </tr>`).join('');
  return `
    <p style="color:var(--jn-text-soft);font-size:12px;margin-bottom:8px">
      家具反应监听 <code>furniture:use_started</code>。同场景旁观者按 action tags、人物性格、动作 ID 匹配后冒气泡，也会写入埋点。
    </p>
    <div class="cfg-grid">
      <div class="cfg-field"><label>总开关</label><input id="fr-master" type="checkbox" ${frc.masterEnabled !== false ? 'checked' : ''}></div>
      <div class="cfg-field"><label>每次家具动作最多反应数</label><input id="fr-max" type="number" min="0" value="${frc.maxPerEvent ?? 1}"></div>
      <div class="cfg-field"><label>旁观最大距离(格)</label><input id="fr-dist" type="number" min="0" value="${frc.maxDistance ?? 9}"></div>
      <div class="cfg-field"><label>默认冷却(游戏分)</label><input id="fr-cd" type="number" min="0" value="${frc.defaultCooldownGameMin ?? 60}"></div>
    </div>
    <div class="section-title">规则预览</div>
    <div class="metadata-table-wrap" style="max-height:260px;overflow:auto;border:1px solid var(--jn-border-2);border-radius:8px;margin-bottom:8px">
      <table class="metadata-table" style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr><th>名称</th><th>ID</th><th>匹配标签</th><th>气泡</th><th>冷却</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" class="logic-muted" style="padding:8px">暂无规则</td></tr>'}</tbody>
      </table>
    </div>
    <div class="section-title">完整配置 JSON</div>
    <div class="cfg-field"><textarea id="fr-json" style="min-height:360px;font-family:monospace;font-size:11px">${escapeHtml(JSON.stringify(frc, null, 2))}</textarea></div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-furn-react">保存并热重载</button>
      <button id="btn-test-furn-react">测试：当前角色触发一次茶案反应</button>
    </div>`;
}

function validateFurnitureAction(action) {
  const errors = [];
  const needKeys = new Set(getNeedDefs().map(n => n.key));
  if (!action || typeof action !== 'object') return { errors: ['动作必须是对象'] };
  if (!action.id) errors.push('缺 ID');
  if (!action.name) errors.push('缺名称');
  if (action.duration !== undefined && !(+action.duration > 0)) errors.push('时长需>0');
  for (const nr of action.needRestores || []) {
    if (!needKeys.has(nr.need)) errors.push(`未知需求 ${nr.need}`);
    if (!Number.isFinite(+(nr.ratePerGameMin ?? nr.ratePerSec))) errors.push(`${nr.need || '需求'}恢复值无效`);
  }
  for (const ef of action.effects || action.extraEffects || []) {
    const type = ef.type;
    if (type === 'skillXp' && !CONFIG.skillDefs?.[ef.param || ef.skill]) errors.push(`未知技能 ${ef.param || ef.skill}`);
    if ((type === 'state' || type === 'addState') && !CONFIG.stateDefs?.[ef.param || ef.stateId]) errors.push(`未知状态 ${ef.param || ef.stateId}`);
    if (type === 'need' && !needKeys.has(ef.need || ef.key)) errors.push(`未知需求 ${ef.need || ef.key}`);
  }
  return { errors };
}

function validateFurnitureActions(actions) {
  const errors = [];
  if (!Array.isArray(actions)) return { errors: ['actions 必须是数组'] };
  const ids = new Set();
  actions.forEach((action, i) => {
    const res = validateFurnitureAction(action);
    res.errors.forEach(err => errors.push(`第${i + 1}项：${err}`));
    const id = action?.id;
    if (id) {
      if (ids.has(id)) errors.push(`重复 ID：${id}`);
      ids.add(id);
    }
  });
  return { errors };
}

function renderSceneAdmin() {
  const typeLabels = SceneAccessSystem.cfg().sceneTypeLabels || {};
  const rows = CONFIG.scenes.map(sc => {
    const fam = sc.ownerFamilyId ? FamilySystem.getFamily(sc.ownerFamilyId) : null;
    return `<tr><td>${sc.id}</td><td>${sc.name}</td><td>${typeLabels[sc.sceneType] || sc.sceneType || '—'}</td>
      <td>${fam?.name || '—'}</td><td>${sc.isTransition ? '是' : ''}</td></tr>`;
  }).join('');
  const conn = SceneAccessSystem.checkAllScenesConnectivity().map(r =>
    `<li style="color:${r.ok ? 'var(--jn-green-bright)' : 'var(--jn-red-bright)'}">${r.message}</li>`).join('');
  return `<p style="color:var(--jn-text-soft);margin-bottom:8px">场景类型与所属家庭决定活动范围；家具摆放后可用「连通性检测」校验是否挡路。</p>
    <table style="width:100%;font-size:12px;border-collapse:collapse;margin-bottom:12px">
      <thead><tr style="border-bottom:1px solid var(--jn-border-2)"><th>ID</th><th>名称</th><th>类型</th><th>家庭</th><th>通道</th></tr></thead>
      <tbody>${rows}</tbody></table>
    <div class="section-title">连通性</div><ul style="font-size:12px;margin:0 0 12px 20px">${conn}</ul>
    <pre class="cfg-preview">${JSON.stringify(CONFIG.scenes, null, 2)}</pre>
    <div class="section-title">家具实例 (${CONFIG.furnitureInstances.length}个)</div>
    <pre class="cfg-preview">${JSON.stringify(CONFIG.furnitureInstances, null, 2)}</pre>
    <div class="adm-actions">
      <button id="btn-check-connectivity">重新检测连通性</button>
      <button id="btn-edit-scenes">编辑场景(JSON)</button>
      <button id="btn-edit-insts">编辑实例(JSON)</button>
    </div>`;
}

function renderSceneAccessAdmin() {
  const sac = CONFIG.sceneAccessConfig || DEFAULT_CONFIG.sceneAccessConfig;
  const c = CHARS[selectedIdx];
  const accessNames = SceneAccessSystem.getAccessibleSceneIds(c).map(id => getScene(id)?.name).filter(Boolean).join('、') || '无';
  const privRows = (sac.privileges || []).map(p =>
    `<tr><td>${p.role}</td><td>${p.roleRank}</td><td>${(p.sceneTypesAllowed || []).join(' ')}</td>
      <td>${p.canEnterAnyPrivate ? '✓' : ''}</td><td>${(p.mustBeInvitedFor || []).join(' ')}</td>
      <td>${(p.additionalRules || []).join(' ')}</td></tr>`
  ).join('');
  return `<p style="color:var(--jn-text-soft);margin-bottom:8px">当前 <b>${c.short}</b>（${FamilySystem.getCharRole(c.id) || '—'}）可进入：${accessNames}</p>
    <table style="width:100%;font-size:11px;border-collapse:collapse;margin-bottom:12px">
      <thead><tr style="border-bottom:1px solid var(--jn-border-2)"><th>身份</th><th>权</th><th>可进类型</th><th>任意私宅</th><th>需邀请</th><th>额外</th></tr></thead>
      <tbody>${privRows}</tbody></table>
    <div class="section-title">sceneAccessConfig JSON</div>
    <textarea id="sac-json" style="width:100%;min-height:260px;font-family:monospace;font-size:11px;background:var(--jn-surface-deep);color:var(--jn-title);border:1px solid var(--jn-border-2);padding:8px">${JSON.stringify(sac, null, 2)}</textarea>
    <div class="adm-actions">
      <button class="primary" id="btn-save-scene-access">保存场景权限</button>
      <button id="btn-test-invite">测试：邀请同场景一人</button>
    </div>`;
}

function renderIdentityProtocolAdmin() {
  const ipc = CONFIG.identityProtocolConfig || DEFAULT_CONFIG.identityProtocolConfig;
  const c = CHARS[selectedIdx];
  const other = CHARS.find(x => x.id !== c.id);
  let preview = '（需两名角色在场）';
  if (other && typeof IdentityProtocolSystem !== 'undefined') {
    const hrel = IdentityProtocolSystem.getHierarchyRelation(c.id, other.id);
    const ri = typeof getRelationInfo === 'function' ? getRelationInfo(c.id, other.id) : null;
    preview = `${c.short}↔${other.short}：位阶「${IdentityProtocolSystem.hierarchyLabel(hrel)}」`
      + (ri?.initType ? `，名目「${ri.initType}」` : '')
      + (ri?.note ? `（${ri.note}）` : '');
  }
  const ruleRows = (ipc.rules || []).map((r, i) =>
    `<tr><td>${i + 1}</td><td>${r.rel}</td><td>${r.cat}</td><td>${r.behavior}</td>
      <td>${r.condition?.desc || (r.risk?.rate != null ? `风险${Math.round(r.risk.rate * 100)}%` : '—')}</td></tr>`
  ).join('');
  return `<p style="color:var(--jn-text-soft);margin-bottom:8px">
    身份礼法影响互动风险与 LLM 提示词中的称呼、位阶。当前选中：<b>${preview}</b></p>
    <p style="font-size:11px;color:var(--jn-text-soft);margin-bottom:8px">
      <code>addressByInitType</code> 可覆盖默认称呼（如婆媳）；<code>rules</code> 定义「主仆+传情」等组合的行为模式。</p>
    <table style="width:100%;font-size:11px;border-collapse:collapse;margin-bottom:12px">
      <thead><tr style="border-bottom:1px solid var(--jn-border-2)"><th>#</th><th>位阶关系</th><th>互动大类</th><th>行为</th><th>说明</th></tr></thead>
      <tbody>${ruleRows || '<tr><td colspan="5">无规则</td></tr>'}</tbody></table>
    <div class="section-title">identityProtocolConfig JSON</div>
    <textarea id="ipc-json" style="width:100%;min-height:320px;font-family:monospace;font-size:11px;background:var(--jn-surface-deep);color:var(--jn-title);border:1px solid var(--jn-border-2);padding:8px">${JSON.stringify(ipc, null, 2)}</textarea>
    <div class="adm-actions">
      <button class="primary" id="btn-save-identity-protocol">保存身份礼法</button>
      <button id="btn-preview-address">预览当前二人称呼提示</button>
    </div>
    <pre id="ipc-preview" class="cfg-preview" style="margin-top:8px;min-height:60px"></pre>`;
}

function renderNeedAdmin() {
  return `
    <p style="color:var(--jn-text-soft);margin-bottom:10px">属性规则：每属性按 (值-50)/50 乘以规则系数，叠加到人物 baseNeedCoeffs 上。长期性格为叙事文本；运行时由属性+状态共同决定三系数与上下限。</p>
    <pre class="cfg-preview">${JSON.stringify(CONFIG.attributeRules, null, 2)}</pre>
    <div class="adm-actions">
      <button id="btn-edit-attr-rules">编辑属性规则(JSON)</button>
    </div>`;
}

function renderIOAdmin() {
  const hasSave = !!localStorage.getItem(SAVE_KEY);
  return `
    <p style="color:var(--jn-text-soft)"><b>配置</b> localStorage 键 <code>dgy_config</code> · <b>进度</b> 键 <code>${SAVE_KEY}</code>${hasSave ? '（已有存档）' : '（无存档）'}</p>
    <div class="section-title">游戏进度</div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-game">保存进度</button>
      <button id="btn-load-game">读取进度</button>
      <button class="danger" id="btn-clear-save">清除进度</button>
    </div>
    <div class="section-title">配置数据</div>
    <div class="adm-actions">
      <button class="primary" id="btn-export">导出 JSON</button>
      <button id="btn-import">导入 JSON</button>
      <button class="danger" id="btn-reset">恢复默认配置</button>
      <button id="btn-repair-world">修复空地图（合并默认场景/家具）</button>
      <button class="primary" id="btn-apply-game">应用并重载游戏</button>
    </div>
    <textarea id="io-json" style="width:100%;height:200px;margin-top:10px;background:var(--jn-surface-deep);border:1px solid var(--jn-border-2);color:var(--jn-title);font-family:monospace;font-size:11px;padding:8px" placeholder="粘贴 JSON 配置…"></textarea>`;
}

function parseAdminFieldValue(raw, type) {
  if (type === 'bool') return raw === true || raw === 'true' || raw === '1';
  if (type === 'number') return +raw || 0;
  if (type === 'optionalNumber') return String(raw).trim() === '' ? undefined : (+raw || 0);
  return raw;
}

function setAdminPathValue(obj, path, value) {
  const parts = String(path).split('.');
  let target = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    if (target[key] == null) target[key] = /^\d+$/.test(nextKey) ? [] : {};
    target = target[key];
  }
  const last = parts[parts.length - 1];
  if (value === undefined) delete target[last];
  else target[last] = value;
}

function reloadFurnitureAdminRuntime() {
  saveConfigToStorage();
  buildWorldGrid?.();
  initFurnRuntime?.();
  buildUI?.();
}

function nextNumericObjectKey(obj, start = 1000) {
  const used = new Set(Object.keys(obj || {}).map(Number).filter(Number.isFinite));
  let id = start;
  while (used.has(id)) id++;
  return id;
}

function nextFurnitureInstanceId() {
  const used = new Set((CONFIG.furnitureInstances || []).map(row => +row.instanceId).filter(Number.isFinite));
  let id = 9001;
  while (used.has(id)) id++;
  return id;
}

function adminV2SwitchLegacy() {
  adminMode = 'legacy';
  renderAdmin();
}

function adminV2AddTemplate() {
  const id = nextNumericObjectKey(CONFIG.furnitureTemplates, 1000);
  CONFIG.furnitureTemplates[id] = {
    name: '新家具',
    category: 'custom',
    lifeLine: '闲',
    essential: false,
    gridW: 1,
    gridH: 1,
    entryOffset: [0, 1],
    icon: '□',
    color: '#5a5040',
    needRestores: [],
    duration: 2,
    maxUsers: 1,
    stopWhenFull: true,
  };
  adminV2SelectedTpl = String(id);
  reloadFurnitureAdminRuntime();
  renderAdmin();
}

function adminV2AddInstance() {
  const firstScene = CONFIG.scenes?.[0]?.id;
  const firstTpl = +Object.keys(CONFIG.furnitureTemplates || {})[0];
  if (!firstScene || !firstTpl) { alert('需要先有场景和家具模板'); return; }
  CONFIG.furnitureInstances = CONFIG.furnitureInstances || [];
  CONFIG.furnitureInstances.push({
    instanceId: nextFurnitureInstanceId(),
    sceneId: firstScene,
    templateId: firstTpl,
    anchorCol: 1,
    anchorRow: 1,
  });
  adminV2SelectedInst = CONFIG.furnitureInstances.length - 1;
  reloadFurnitureAdminRuntime();
  renderAdmin();
}

function nextTraitId() {
  const rows = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  let id = 'new_trait';
  let n = 1;
  while (rows[id]) id = `new_trait_${++n}`;
  return id;
}

function adminV2AddTrait() {
  CONFIG.charSpecialtyConfig ||= {};
  CONFIG.charSpecialtyConfig.traitMetadata ||= {};
  CONFIG.charSpecialtyConfig.traitLabels ||= {};
  const id = nextTraitId();
  CONFIG.charSpecialtyConfig.traitMetadata[id] = {
    label: '新性格',
    category: '性情',
    description: '',
    effectExamples: [],
    effects: {},
  };
  CONFIG.charSpecialtyConfig.traitLabels[id] = '新性格';
  adminV2Search = id;
  adminV2TraitFocusId = id;
  adminTraitSaved(`已新增 ${id}`);
  saveConfigToStorage();
  CharSpecialtySystem?.init?.();
  renderAdmin();
}

function adminV2ValidateFurniture() {
  const lines = [];
  for (const [id, tpl] of Object.entries(CONFIG.furnitureTemplates || {})) {
    if (!tpl.name) lines.push(`模板 ${id} 缺名称`);
    if (!tpl.category) lines.push(`模板 ${id} 缺分类`);
    if (!Array.isArray(tpl.entryOffset) || tpl.entryOffset.length < 2) lines.push(`模板 ${id} 入口偏移无效`);
    const validation = validateFurnitureActions(tpl.actions || []);
    validation.errors.forEach(err => lines.push(`模板 ${id} actions：${err}`));
  }
  for (const inst of CONFIG.furnitureInstances || []) {
    if (!CONFIG.furnitureTemplates?.[inst.templateId]) lines.push(`摆放 ${inst.instanceId} 引用不存在的模板 ${inst.templateId}`);
    if (!getScene?.(inst.sceneId)) lines.push(`摆放 ${inst.instanceId} 引用不存在的场景 ${inst.sceneId}`);
  }
  alert(lines.length ? lines.join('\n') : '家具配置校验通过。');
}

function adminV2ValidateTraits() {
  const lines = [];
  const rows = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  for (const [id, row] of Object.entries(rows)) {
    if (!row.label) lines.push(`${id} 缺标签`);
    row.category = normalizeTraitCategoryName(row.category);
    if (!TRAIT_CATEGORY_OPTIONS.includes(row.category)) lines.push(`${id} 分类应为 ${TRAIT_CATEGORY_OPTIONS.join('/')}`);
    if (!row.description) lines.push(`${id} 缺描述`);
    if (row.effects && typeof row.effects !== 'object') lines.push(`${id} effects 不是对象`);
  }
    alert(lines.length ? lines.join('\n') : '性格系统校验通过。');
}

function adminStartRelationLabelsEdit() {
  adminV2RelationLabelsDraft = JSON.parse(JSON.stringify(relationPanelConfigForAdmin()));
  adminV2RelationLabelsEditing = true;
  renderAdmin();
}

function adminCollectRelationLabelsFromForm() {
  const draft = adminV2RelationLabelsDraft || relationPanelConfigForAdmin();
  draft.familyRelations = [];
  document.querySelectorAll('[data-rel-family-idx][data-field="name"]').forEach(input => {
    const idx = +input.dataset.relFamilyIdx;
    draft.familyRelations[idx] ||= {};
    draft.familyRelations[idx].name = input.value.trim();
  });
  document.querySelectorAll('[data-rel-family-idx][data-field="description"]').forEach(input => {
    const idx = +input.dataset.relFamilyIdx;
    draft.familyRelations[idx] ||= {};
    draft.familyRelations[idx].description = input.value.trim();
  });
  document.querySelectorAll('[data-rel-family-idx][data-field="effect"]').forEach(input => {
    const idx = +input.dataset.relFamilyIdx;
    draft.familyRelations[idx] ||= {};
    draft.familyRelations[idx].effect = input.value.trim();
  });
  draft.familyRelations = draft.familyRelations.filter(row => row.name);

  draft.quadrantLabels ||= {};
  document.querySelectorAll('[data-rel-label]').forEach(input => {
    draft.quadrantLabels[input.dataset.relLabel] = input.value.trim();
  });

  const stageRows = {};
  document.querySelectorAll('[data-rel-stage-axis]').forEach(input => {
    const axis = input.dataset.relStageAxis;
    const idx = +input.dataset.idx;
    const field = input.dataset.field;
    stageRows[axis] ||= [];
    stageRows[axis][idx] ||= {};
    stageRows[axis][idx][field] = (field === 'min' || field === 'max') ? +input.value : input.value.trim();
  });
  if (stageRows.submission && stageRows.care) {
    stageRows.care.forEach((row, i) => {
      if (stageRows.submission[i]?.min != null) row.min = stageRows.submission[i].min;
    });
  }
  if (stageRows.filialPiety && stageRows.parentalCare) {
    stageRows.parentalCare.forEach((row, i) => {
      if (stageRows.filialPiety[i]?.min != null) row.min = stageRows.filialPiety[i].min;
    });
  }
  draft.axisStageLabels ||= {};
  for (const [axis, rows] of Object.entries(stageRows)) {
    const filtered = rows
      .filter(row => Number.isFinite(row.min))
      .sort((a, b) => a.min - b.min);
    const validation = validateRelationStageStarts(axis, filtered);
    if (!validation.ok) throw new Error(validation.message);
    draft.axisStageLabels[axis] = filtered.map((row, i) => ({
      ...row,
      max: filtered[i + 1]?.min ?? 100,
    }));
  }

  draft.compositeRelationRules = [];
  document.querySelectorAll('[data-rel-composite-idx][data-field="label"]').forEach(input => {
    const idx = +input.dataset.relCompositeIdx;
    draft.compositeRelationRules[idx] ||= {};
  });
  document.querySelectorAll('[data-rel-composite-idx]').forEach(input => {
    const idx = +input.dataset.relCompositeIdx;
    draft.compositeRelationRules[idx] ||= {};
    draft.compositeRelationRules[idx][input.dataset.field] = input.value.trim();
  });
  draft.compositeRelationRules = draft.compositeRelationRules
    .filter(row => Object.values(row).some(Boolean));
  return draft;
}

function validateRelationStageStarts(axis, rows) {
  if (!rows.length) return { ok: false, message: `${axis} 至少需要一行阶段配置` };
  for (let i = 0; i < rows.length; i++) {
    const n = rows[i].min;
    if (!Number.isFinite(n)) return { ok: false, message: `${axis} 第 ${i + 1} 行开端不是数字` };
    if (n < -100 || n > 100) return { ok: false, message: `${axis} 第 ${i + 1} 行开端必须在 -100~100` };
    if (i > 0 && n <= rows[i - 1].min) return { ok: false, message: `${axis} 阶段开端必须严格递增` };
  }
  if (rows[0].min !== -100) return { ok: false, message: `${axis} 第一行开端必须为 -100，保证完整覆盖` };
  return { ok: true };
}

function adminSaveRelationLabels() {
  let draft;
  try { draft = adminCollectRelationLabelsFromForm(); }
  catch (e) { alert(e.message || '关系标签配置无效'); return; }
  CONFIG.relationPanelConfig = JSON.parse(JSON.stringify(draft));
  saveConfigToStorage();
  adminV2RelationLabelsEditing = false;
  adminV2RelationLabelsDraft = null;
  renderAdmin();
}

function adminCancelRelationLabels() {
  adminV2RelationLabelsEditing = false;
  adminV2RelationLabelsDraft = null;
  renderAdmin();
}

function adminAddCompositeRelationRule() {
  if (!adminV2RelationLabelsDraft) adminV2RelationLabelsDraft = JSON.parse(JSON.stringify(relationPanelConfigForAdmin()));
  adminV2RelationLabelsDraft.compositeRelationRules ||= [];
  adminV2RelationLabelsDraft.compositeRelationRules.push({
    familyRelation: '', friendship: '', affection: '', trust: '', service: '', label: '', example: '',
  });
  renderAdmin();
}

function adminDeleteCompositeRelationRule(idx) {
  if (!adminV2RelationLabelsDraft) adminV2RelationLabelsDraft = JSON.parse(JSON.stringify(relationPanelConfigForAdmin()));
  adminV2RelationLabelsDraft.compositeRelationRules ||= [];
  adminV2RelationLabelsDraft.compositeRelationRules.splice(idx, 1);
  renderAdmin();
}

function bindAdminV2Events() {
  bindAdminFloatingTooltips(document.getElementById('admin-body') || document);
  document.getElementById('btn-admin-v2-legacy')?.addEventListener('click', adminV2SwitchLegacy);
  document.getElementById('btn-admin-v2-open-legacy')?.addEventListener('click', adminV2SwitchLegacy);
  document.querySelectorAll('[data-admin-v2-section]').forEach(btn => btn.onclick = () => {
    const next = btn.dataset.adminV2Section;
    if (next === 'legacy') { adminV2SwitchLegacy(); return; }
    adminV2Section = next;
    adminV2Search = '';
    renderAdmin();
  });
  const search = document.getElementById('admin-v2-search');
  if (search) search.oninput = () => { adminV2Search = search.value; renderAdmin(); };
  const add = document.getElementById('btn-admin-v2-add');
  if (add) add.onclick = () => {
    if (adminV2Section === 'furnitureInstances') adminV2AddInstance();
    else if (adminV2Section === 'personalityMeta') adminV2AddTrait();
    else adminV2AddTemplate();
  };
  const validate = document.getElementById('btn-admin-v2-validate');
  if (validate) validate.onclick = () => adminV2Section === 'personalityMeta' ? adminV2ValidateTraits() : adminV2ValidateFurniture();

  document.querySelectorAll('[data-admin-v2-char-row]').forEach(row => row.onclick = () => {
    adminSelectCharById(row.dataset.adminV2CharRow);
    const membership = characterFamilyMembership(CONFIG.characters[adminSelChar]?.id);
    if (membership.family) adminV2CharacterFamilyId = membership.family.id;
    adminV2Section = 'characterEditor';
    renderAdmin();
  });
  document.getElementById('admin-v2-editor-family')?.addEventListener('change', evt => {
    adminV2CharacterFamilyId = evt.target.value;
    const family = (CONFIG.familyConfig?.families || []).find(f => String(f.id) === String(adminV2CharacterFamilyId));
    const first = family?.members?.find(m => CONFIG.characters.some(c => c.id === m.charId));
    if (first) adminSelectCharById(first.charId);
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-pick-char]').forEach(btn => btn.onclick = () => {
    adminSelectCharById(btn.dataset.adminV2PickChar);
    adminV2CharacterEditing = false;
    renderAdmin();
  });
  document.getElementById('btn-admin-v2-char-edit')?.addEventListener('click', () => {
    adminV2CharacterEditing = true;
    renderAdmin();
  });
  document.getElementById('btn-admin-v2-char-cancel')?.addEventListener('click', () => {
    adminV2CharacterEditing = false;
    renderAdmin();
  });
  document.getElementById('btn-admin-v2-char-save')?.addEventListener('click', adminSaveCharacterEditor);
  document.getElementById('btn-edit-relation-labels')?.addEventListener('click', adminStartRelationLabelsEdit);
  document.getElementById('btn-cancel-relation-labels')?.addEventListener('click', adminCancelRelationLabels);
  document.getElementById('btn-save-relation-labels')?.addEventListener('click', adminSaveRelationLabels);
  document.getElementById('btn-add-relation-composite')?.addEventListener('click', adminAddCompositeRelationRule);
  document.querySelectorAll('[data-rel-composite-delete]').forEach(btn => btn.onclick = () => {
    adminDeleteCompositeRelationRule(+btn.dataset.relCompositeDelete);
  });
  document.querySelectorAll('[data-admin-v2-trait-collapse]').forEach(btn => btn.onclick = () => {
    const category = btn.dataset.adminV2TraitCollapse;
    adminV2CharacterTraitCollapsed[category] = !adminV2CharacterTraitCollapsed[category];
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-editor-trait]').forEach(btn => btn.onclick = () => {
    if (!adminV2CharacterEditing) return;
    const wasSelected = btn.classList.contains('selected');
    btn.closest('.character-trait-pair')?.querySelectorAll('[data-admin-v2-editor-trait]').forEach(peer => {
      if (peer !== btn) peer.classList.remove('selected');
    });
    btn.classList.toggle('selected', !wasSelected);
  });

  document.querySelectorAll('[data-admin-v2-select-template]').forEach(row => row.onclick = evt => {
    if (evt.target.closest('input,select,button,textarea')) return;
    adminV2SelectedTpl = row.dataset.adminV2SelectTemplate;
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-select-instance]').forEach(row => row.onclick = evt => {
    if (evt.target.closest('input,select,button,textarea')) return;
    adminV2SelectedInst = +row.dataset.adminV2SelectInstance;
    renderAdmin();
  });

  document.querySelectorAll('[data-admin-v2-template]').forEach(el => el.onchange = () => {
    const tpl = CONFIG.furnitureTemplates?.[el.dataset.adminV2Template];
    if (!tpl) return;
    const raw = el.type === 'checkbox' ? el.checked : el.value;
    let value = parseAdminFieldValue(raw, el.dataset.type || 'string');
    if (el.dataset.field === 'skill') value = value || null;
    setAdminPathValue(tpl, el.dataset.field, value);
    if (tpl.essential) delete tpl.useCondition;
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-instance]').forEach(el => el.onchange = () => {
    const inst = CONFIG.furnitureInstances?.[+el.dataset.adminV2Instance];
    if (!inst) return;
    const raw = el.type === 'checkbox' ? el.checked : el.value;
    setAdminPathValue(inst, el.dataset.field, parseAdminFieldValue(raw, el.dataset.type || 'string'));
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-template-json]').forEach(el => el.onchange = () => {
    const tpl = CONFIG.furnitureTemplates?.[el.dataset.adminV2TemplateJson];
    if (!tpl) return;
    let parsed;
    try { parsed = JSON.parse(el.value || '[]'); }
    catch (e) { alert(`${el.dataset.jsonField} JSON 无效`); return; }
    if (!Array.isArray(parsed)) { alert(`${el.dataset.jsonField} 必须是数组`); return; }
    if (el.dataset.jsonField === 'actions') {
      const validation = validateFurnitureActions(parsed);
      if (validation.errors.length) { alert('actions 校验失败：\n' + validation.errors.join('\n')); return; }
    }
    if (parsed.length) tpl[el.dataset.jsonField] = parsed;
    else delete tpl[el.dataset.jsonField];
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });

  document.querySelectorAll('[data-admin-v2-delete-template]').forEach(btn => btn.onclick = evt => {
    evt.stopPropagation();
    const id = btn.dataset.adminV2DeleteTemplate;
    const tpl = CONFIG.furnitureTemplates?.[id];
    if (!tpl) return;
    const used = (CONFIG.furnitureInstances || []).filter(inst => +inst.templateId === +id).length;
    if (!confirm(used ? `「${tpl.name || id}」还有 ${used} 个摆放。删除模板会一并删除这些摆放，确认吗？` : `确认删除家具模板「${tpl.name || id}」吗？`)) return;
    delete CONFIG.furnitureTemplates[id];
    CONFIG.furnitureInstances = (CONFIG.furnitureInstances || []).filter(inst => +inst.templateId !== +id);
    adminV2SelectedTpl = null;
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-delete-instance]').forEach(btn => btn.onclick = evt => {
    evt.stopPropagation();
    const idx = +btn.dataset.adminV2DeleteInstance;
    const inst = CONFIG.furnitureInstances?.[idx];
    if (!inst || !confirm(`确认删除摆放实例 ${inst.instanceId}？`)) return;
    CONFIG.furnitureInstances.splice(idx, 1);
    adminV2SelectedInst = null;
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-add-action]').forEach(btn => btn.onclick = () => {
    const id = btn.dataset.adminV2AddAction;
    const tpl = CONFIG.furnitureTemplates?.[id];
    if (!tpl) return;
    const actions = Array.isArray(tpl.actions) ? tpl.actions.slice() : [];
    const base = String(tpl.category || 'furniture').replace(/[^a-zA-Z0-9_]/g, '') || 'furniture';
    let n = actions.length + 1;
    let actionId = `${base}_action_${n}`;
    const used = new Set(actions.map(a => a.id));
    while (used.has(actionId)) actionId = `${base}_action_${++n}`;
    actions.push({ id: actionId, name: '新动作', text: '填写 hover 描述', duration: tpl.duration || 3, needRestores: (tpl.needRestores || []).slice(0, 1), effects: [], tags: [tpl.category || 'furniture'] });
    tpl.actions = actions;
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-validate-actions]').forEach(btn => btn.onclick = () => {
    const tpl = CONFIG.furnitureTemplates?.[btn.dataset.adminV2ValidateActions];
    const validation = validateFurnitureActions(tpl?.actions || []);
    alert(validation.errors.length ? `校验失败：\n${validation.errors.join('\n')}` : 'actions 校验通过。');
  });
  document.getElementById('btn-admin-v2-check-connectivity')?.addEventListener('click', () => {
    buildWorldGrid();
    const badScenes = SceneAccessSystem.checkAllScenesConnectivity().filter(r => !r.ok);
    const badFurn = SceneAccessSystem.checkAllFurnitureReachable?.().filter(r => !r.ok) || [];
    const lines = [...badScenes.map(r => r.message), ...badFurn.map(r => r.message)];
    alert(lines.length ? lines.join('\n') : '各场景通行连通，全部家具入口可达。');
  });

  document.querySelectorAll('[data-admin-v2-trait]').forEach(el => el.onchange = () => {
    const id = el.dataset.adminV2Trait;
    const row = CONFIG.charSpecialtyConfig?.traitMetadata?.[id];
    if (!row) return;
    if (el.dataset.field === 'effectExamples') {
      row.effectExamples = el.value.split('|').map(s => s.trim()).filter(Boolean);
    } else if (el.dataset.field === 'oppositeTrait') {
      const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
      const oldOpposite = row.oppositeTrait;
      const newOpposite = el.value || null;
      if (oldOpposite && meta[oldOpposite]?.oppositeTrait === id) meta[oldOpposite].oppositeTrait = null;
      row.oppositeTrait = newOpposite;
      if (newOpposite && meta[newOpposite]) meta[newOpposite].oppositeTrait = id;
    } else {
      row[el.dataset.field] = el.value;
    }
    if (el.dataset.field === 'label') {
      CONFIG.charSpecialtyConfig.traitLabels ||= {};
      CONFIG.charSpecialtyConfig.traitLabels[el.dataset.adminV2Trait] = el.value;
    }
    saveConfigToStorage();
    CharSpecialtySystem?.init?.();
    syncTraitLabelsFromMetadata();
    adminV2TraitFocusId = id;
    adminTraitSaved('已自动保存');
    if (el.dataset.field === 'oppositeTrait') renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-trait-id]').forEach(el => el.onchange = () => {
    const oldId = el.dataset.adminV2TraitId;
    const result = adminRenameTraitId(oldId, el.value);
    if (!result.ok) {
      alert(result.message);
      el.value = oldId;
      return;
    }
    renderAdmin();
  });
  document.querySelectorAll('[data-admin-v2-trait-effect]').forEach(el => el.onchange = () => {
    const row = CONFIG.charSpecialtyConfig?.traitMetadata?.[el.dataset.adminV2TraitEffect];
    if (!row) return;
    row.effects ||= {};
    const raw = el.value.trim();
    if (!raw) {
      delete row.effects[el.dataset.effectField];
    } else {
      try { row.effects[el.dataset.effectField] = JSON.parse(raw); }
      catch (e) { alert(`${row.label || el.dataset.adminV2TraitEffect} 的 ${el.dataset.effectField} JSON 无效`); return; }
    }
    if (!Object.keys(row.effects).length) delete row.effects;
    saveConfigToStorage();
    CharSpecialtySystem?.init?.();
    adminV2TraitFocusId = el.dataset.adminV2TraitEffect;
    adminTraitSaved('已自动保存');
  });
  document.querySelectorAll('[data-admin-v2-delete-trait]').forEach(btn => btn.onclick = () => {
    const scrollTop = document.querySelector('.admin-v2-trait-page .admin-v2-table-wrap')?.scrollTop || 0;
    const id = btn.dataset.adminV2DeleteTrait;
    const label = CONFIG.charSpecialtyConfig?.traitMetadata?.[id]?.label || id;
    if (!confirm(`确认删除性格「${label}」？人物身上的引用不会自动移除。`)) return;
    delete CONFIG.charSpecialtyConfig.traitMetadata[id];
    delete CONFIG.charSpecialtyConfig.traitLabels?.[id];
    delete CONFIG.charSpecialtyConfig.traitNarratives?.[id];
    delete CONFIG.charSpecialtyConfig.traitModifiers?.[id];
    saveConfigToStorage();
    CharSpecialtySystem?.init?.();
    adminTraitSaved(`已删除 ${label}`);
    adminRenderPreservingTraitScroll(scrollTop);
  });
  const saveTraitJson = document.getElementById('btn-admin-v2-save-trait-json');
  if (saveTraitJson) saveTraitJson.onclick = () => {
    let metadata, specialtyMetadata, narratives, modifiers;
    try { metadata = JSON.parse(document.getElementById('admin-v2-trait-metadata-json')?.value || '{}'); }
    catch (e) { alert('traitMetadata JSON 无效'); return; }
    try { specialtyMetadata = JSON.parse(document.getElementById('admin-v2-specialty-metadata-json')?.value || '{}'); }
    catch (e) { alert('specialtyMetadata JSON 无效'); return; }
    try { narratives = JSON.parse(document.getElementById('admin-v2-trait-narratives-json')?.value || '{}'); }
    catch (e) { alert('traitNarratives JSON 无效'); return; }
    try { modifiers = JSON.parse(document.getElementById('admin-v2-trait-modifiers-json')?.value || '{}'); }
    catch (e) { alert('traitModifiers JSON 无效'); return; }
    CONFIG.charSpecialtyConfig.traitMetadata = metadata;
    CONFIG.charSpecialtyConfig.specialtyMetadata = specialtyMetadata;
    CONFIG.charSpecialtyConfig.traitNarratives = narratives;
    CONFIG.charSpecialtyConfig.traitModifiers = modifiers;
    syncTraitLabelsFromMetadata();
    saveConfigToStorage();
    CharSpecialtySystem?.init?.();
    adminTraitSaved('JSON 已保存');
    alert('性格系统 JSON 已保存。');
    renderAdmin();
  };

  if (adminV2Section === 'personalityMeta' && adminV2TraitFocusId) {
    requestAnimationFrame(() => {
      const row = document.querySelector(`[data-admin-v2-trait-row="${CSS.escape(adminV2TraitFocusId)}"]`);
      row?.scrollIntoView?.({ block: 'center', inline: 'nearest' });
      const input = document.querySelector(`[data-admin-v2-trait-id="${CSS.escape(adminV2TraitFocusId)}"]`);
      input?.focus?.();
      input?.select?.();
      adminV2TraitFocusId = null;
    });
  }
}

function bindAdminEvents() {
  document.querySelectorAll('[data-cidx]').forEach(el => el.onclick = () => { adminSelChar = +el.dataset.cidx; renderAdmin(); });
  document.querySelectorAll('[data-crud-key]').forEach(el => el.onclick = () => {
    adminCrudSelected[el.dataset.crudTab] = el.dataset.crudKey;
    renderAdmin();
  });

  const crudSearch = document.getElementById('crud-search');
  if (crudSearch) {
    const applyCrudFilter = () => {
      const query = crudSearch.value.trim().toLowerCase();
      adminCrudSearch[crudSearch.dataset.crudTab] = crudSearch.value;
      document.querySelectorAll('[data-meta-search]').forEach(row => {
        row.hidden = Boolean(query) && !row.dataset.metaSearch.includes(query);
      });
    };
    crudSearch.oninput = applyCrudFilter;
    applyCrudFilter();
  }

  const crudGroupSelect = document.getElementById('crud-group-select');
  if (crudGroupSelect) crudGroupSelect.onchange = () => {
    const tab = crudGroupSelect.dataset.crudTab;
    adminCrudGroup[tab] = crudGroupSelect.value;
    adminCrudSelected[tab] = '';
    renderAdmin();
  };

  const crudSave = document.getElementById('btn-crud-save');
  if (crudSave) crudSave.onclick = () => {
    const tab = crudSave.dataset.crudTab;
    const spec = configCrudSpec(tab);
    const group = spec.groups[adminCrudGroup[tab]];
    const selected = adminCrudSelected[tab];
    let value;
    try { value = JSON.parse(document.getElementById('crud-item-json').value); }
    catch (e) { alert('当前条目 JSON 无效'); return; }
    const container = group.get();
    if (group.type === 'array') container[+selected] = value;
    else container[selected] = value;
    if (tab === 'personalityMeta' && adminCrudGroup[tab] === 'traitMetadata') syncTraitLabelsFromMetadata();
    saveConfigToStorage();
    alert('当前条目已保存。');
    renderAdmin();
  };

  const crudAdd = document.getElementById('btn-crud-add');
  if (crudAdd) crudAdd.onclick = () => {
    const tab = crudAdd.dataset.crudTab;
    const spec = configCrudSpec(tab);
    const groupId = adminCrudGroup[tab];
    const group = spec.groups[groupId];
    const container = group.get();
    const value = spec.newValue(groupId);
    if (group.type === 'array') {
      container.push(value);
      adminCrudSelected[tab] = String(container.length - 1);
    } else {
      const suggested = value?.id || (tab === 'specialties' && groupId === 'profiles' ? 'new_character_id' : 'new_id');
      const key = prompt('输入新条目的唯一 ID：', suggested);
      if (!key) return;
      if (Object.prototype.hasOwnProperty.call(container, key)) { alert('该 ID 已存在'); return; }
      if (value && typeof value === 'object' && !Array.isArray(value) && 'id' in value) value.id = key;
      container[key] = value;
      adminCrudSelected[tab] = key;
    }
    saveConfigToStorage();
    renderAdmin();
  };

  const crudDelete = document.getElementById('btn-crud-delete');
  if (crudDelete) crudDelete.onclick = () => {
    const tab = crudDelete.dataset.crudTab;
    const spec = configCrudSpec(tab);
    const group = spec.groups[adminCrudGroup[tab]];
    const selected = adminCrudSelected[tab];
    if (!selected || !confirm(`删除当前条目「${selected}」？`)) return;
    const container = group.get();
    if (group.type === 'array') container.splice(+selected, 1);
    else {
      delete container[selected];
      if (tab === 'personalityMeta' && adminCrudGroup[tab] === 'traitMetadata') {
        delete CONFIG.charSpecialtyConfig.traitLabels[selected];
      }
    }
    adminCrudSelected[tab] = '';
    saveConfigToStorage();
    renderAdmin();
  };

  const crudExport = document.getElementById('btn-crud-export');
  if (crudExport) crudExport.onclick = () => {
    const spec = configCrudSpec(crudExport.dataset.crudTab);
    document.getElementById('crud-whole-json').value = JSON.stringify(spec.wholeGet(), null, 2);
  };

  const crudImport = document.getElementById('btn-crud-import');
  if (crudImport) crudImport.onclick = () => {
    const tab = crudImport.dataset.crudTab;
    const spec = configCrudSpec(tab);
    let value;
    try { value = JSON.parse(document.getElementById('crud-whole-json').value); }
    catch (e) { alert('整个子系统 JSON 无效'); return; }
    if (!confirm(`导入将覆盖「${spec.title}」当前配置，确认继续？`)) return;
    spec.wholeSet(value);
    adminCrudSelected[tab] = '';
    saveConfigToStorage();
    alert('导入完成，建议点击“应用并重载游戏”。');
    renderAdmin();
  };

  const charMetaSave = document.getElementById('btn-char-meta-save');
  if (charMetaSave) charMetaSave.onclick = () => {
    const c = CONFIG.characters[adminSelChar];
    if (!c) return;
    c.name = document.getElementById('char-meta-name').value.trim() || c.name;
    c.short = document.getElementById('char-meta-short').value.trim() || c.short;
    c.gender = document.getElementById('char-meta-gender').value;
    c.socialRank = +document.getElementById('char-meta-rank').value;
    c.homewardness = +document.getElementById('char-meta-homeward').value;
    c.shortComment = document.getElementById('char-meta-comment').value.trim();
    c.personality = document.getElementById('char-meta-personality').value.trim();
    const lifePath = document.getElementById('char-meta-path').value;
    if (lifePath) c.lifePath = lifePath;
    else delete c.lifePath;

    c.needs ||= {};
    document.querySelectorAll('[data-char-need]').forEach(input => {
      c.needs[input.dataset.charNeed] = Math.max(0, Math.min(100, +input.value || 0));
    });

    CONFIG.charSpecialtyConfig ||= {};
    CONFIG.charSpecialtyConfig.profiles ||= {};
    const specialty = CONFIG.charSpecialtyConfig.profiles[c.id] ||= {
      aiTraits: [], displayTraits: [], specialties: [], checks: {},
    };
    const parseTags = id => document.getElementById(id).value
      .split(/[,，]/).map(item => item.trim()).filter(Boolean);
    specialty.aiTraits = parseTags('char-meta-traits');
    specialty.displayTraits = parseTags('char-meta-display-traits');

    const familyId = document.getElementById('char-meta-family').value;
    const familyRole = document.getElementById('char-meta-role').value.trim() || '成员';
    (CONFIG.familyConfig?.families || []).forEach(family => {
      family.members = (family.members || []).filter(member => member.charId !== c.id);
    });
    if (familyId) {
      const family = CONFIG.familyConfig.families.find(item => String(item.id) === familyId);
      if (family) {
        family.members ||= [];
        family.members.push({ charId: c.id, role: familyRole });
      }
    }

    saveConfigToStorage();
    alert('人物聚合配置已保存，应用并重载后完整生效。');
    renderAdmin();
  };

  const charSaveV2 = document.getElementById('btn-char-v2-save');
  if (charSaveV2) charSaveV2.onclick = () => {
    const old = CONFIG.characters[adminSelChar];
    let value;
    try { value = JSON.parse(document.getElementById('char-v2-json').value); }
    catch (e) { alert('人物 JSON 无效'); return; }
    if (!value?.id) { alert('人物必须包含 id'); return; }
    if (value.id !== old.id) {
      alert('人物 ID 不能在这里修改，因为关系、家庭、任务和剧情都在引用它。');
      return;
    }
    CONFIG.characters[adminSelChar] = value;
    saveConfigToStorage();
    alert('人物已保存，应用并重载后完整生效。');
    renderAdmin();
  };

  const traitStatsReset = document.getElementById('btn-trait-stats-reset');
  if (traitStatsReset) traitStatsReset.onclick = () => {
    const c = getChar(traitStatsReset.dataset.charId);
    if (!c || !confirm(`清空${c.short}的性格行为统计？`)) return;
    TraitBehaviorSystem.resetStats(c);
    renderAdmin();
  };

  const charAdd = document.getElementById('btn-char-add');
  if (charAdd) charAdd.onclick = () => {
    const id = prompt('输入新人物唯一 ID：', 'new_character');
    if (!id) return;
    if (CONFIG.characters.some(c => c.id === id)) { alert('人物 ID 已存在'); return; }
    CONFIG.characters.push({
      id, name: '新人物', short: '新人', shortComment: '', socialRank: 5, gender: '女', homewardness: 50,
      color: '#8fb896', hair: '#333333', skin: '#f0d5b0', trait: 'female',
      sceneId: CONFIG.scenes?.[0]?.id || 1, gridCol: 2, gridRow: 2,
      attributes: { constitution: 50, sensitivity: 50, charm: 50, intellect: 50 },
      personality: '', memoryPalace: '', skills: ['move', 'talk'],
      baseNeedCoeffs: Object.fromEntries(getNeedDefs().map(n => [n.key, { min: 0, max: 100, grow: 1, decay: 1 }])),
      needs: Object.fromEntries(getNeedDefs().map(n => [n.key, 60])),
    });
    adminSelChar = CONFIG.characters.length - 1;
    saveConfigToStorage();
    renderAdmin();
  };

  const charDelete = document.getElementById('btn-char-delete');
  if (charDelete) charDelete.onclick = () => {
    const c = CONFIG.characters[adminSelChar];
    if (!c || !confirm(`删除人物「${c.name}」？相关家庭、关系、任务引用不会自动删除。`)) return;
    CONFIG.characters.splice(adminSelChar, 1);
    adminSelChar = Math.max(0, Math.min(adminSelChar, CONFIG.characters.length - 1));
    saveConfigToStorage();
    renderAdmin();
  };

  const charExport = document.getElementById('btn-char-export');
  if (charExport) charExport.onclick = () => {
    document.getElementById('char-v2-import').value = JSON.stringify(CONFIG.characters, null, 2);
  };

  const charImport = document.getElementById('btn-char-import');
  if (charImport) charImport.onclick = () => {
    let value;
    try { value = JSON.parse(document.getElementById('char-v2-import').value); }
    catch (e) { alert('人物数组 JSON 无效'); return; }
    if (!Array.isArray(value) || value.some(c => !c?.id)) { alert('必须是包含 id 的人物数组'); return; }
    if (!confirm('导入将覆盖全部人物配置，确认继续？')) return;
    CONFIG.characters = value;
    adminSelChar = 0;
    saveConfigToStorage();
    renderAdmin();
  };

  document.querySelectorAll('[data-state]').forEach(el => el.onclick = () => { adminSelState = el.dataset.state; renderAdmin(); });
  document.querySelectorAll('[data-reledit]').forEach(el => el.onclick = () => { adminSelRelIdx = +el.dataset.reledit; renderAdmin(); });
  document.querySelectorAll('[data-reldel]').forEach(el => el.onclick = () => {
    CONFIG.relationInit.splice(+el.dataset.reldel, 1);
    saveConfigToStorage(); renderAdmin();
  });

  const ri = CONFIG.relationInit[adminSelRelIdx];
  if (ri && document.getElementById('ri-a')) {
    document.getElementById('ri-a').value = ri.a;
    document.getElementById('ri-b').value = ri.b;
  }

  const saveRelInit = document.getElementById('btn-save-rel-init');
  if (saveRelInit) saveRelInit.onclick = () => {
    const entry = {
      a: document.getElementById('ri-a').value,
      b: document.getElementById('ri-b').value,
      initType: document.getElementById('ri-type').value,
      initValue: +document.getElementById('ri-val').value,
      note: document.getElementById('ri-note').value,
    };
    if (CONFIG.relationInit[adminSelRelIdx]) CONFIG.relationInit[adminSelRelIdx] = entry;
    else CONFIG.relationInit.push(entry);
    saveConfigToStorage();
    alert('关系配置已保存，请应用并重载。');
  };

  const saveRelUi = document.getElementById('btn-save-rel-ui');
  if (saveRelUi) saveRelUi.onclick = () => {
    CONFIG.relationPanelConfig ||= {};
    CONFIG.relationPanelConfig.quadrantLabels = {
      friendship: document.getElementById('rel-ui-friendship').value || '友谊',
      affinity: document.getElementById('rel-ui-affinity').value || '姻缘',
      trust: document.getElementById('rel-ui-trust').value || '信任',
      servantToMaster: document.getElementById('rel-ui-servant-master').value || '服从',
      masterToServant: document.getElementById('rel-ui-master-servant').value || '体恤',
      empty: document.getElementById('rel-ui-empty').value || '?',
    };
    CONFIG.relationPanelConfig.summaryLabels = {
      lover: document.getElementById('rel-sum-lover').value || '恋人',
      friend: document.getElementById('rel-sum-friend').value || '朋友',
      parent: document.getElementById('rel-sum-parent').value || '父母',
    };
    saveConfigToStorage();
    alert('关系面板配置已保存，请应用并重载。');
  };

  const saveRelationLabels = document.getElementById('btn-save-relation-labels');
  if (saveRelationLabels) saveRelationLabels.onclick = () => {
    CONFIG.relationPanelConfig ||= {};
    CONFIG.relationPanelConfig.quadrantLabels ||= {};
    CONFIG.relationPanelConfig.summaryLabels ||= {};
    CONFIG.relationPanelConfig.axisStageLabels ||= {};

    document.querySelectorAll('[data-rel-label]').forEach(input => {
      CONFIG.relationPanelConfig.quadrantLabels[input.dataset.relLabel] = input.value.trim();
    });
    document.querySelectorAll('[data-rel-summary]').forEach(input => {
      CONFIG.relationPanelConfig.summaryLabels[input.dataset.relSummary] = input.value.trim();
    });

    const thresholds = [];
    document.querySelectorAll('[data-rel-type-idx][data-field="min"]').forEach(input => {
      const idx = +input.dataset.relTypeIdx;
      thresholds[idx] ||= {};
      thresholds[idx].min = +input.value;
    });
    document.querySelectorAll('[data-rel-type-idx][data-field="label"]').forEach(input => {
      const idx = +input.dataset.relTypeIdx;
      thresholds[idx] ||= {};
      thresholds[idx].label = input.value.trim();
    });
    CONFIG.relationTypeThresholds = thresholds
      .filter(row => Number.isFinite(row.min) && row.label)
      .sort((a, b) => b.min - a.min);

    const stageRows = {};
    document.querySelectorAll('[data-rel-stage-axis]').forEach(input => {
      const axis = input.dataset.relStageAxis;
      const idx = +input.dataset.idx;
      const field = input.dataset.field;
      stageRows[axis] ||= [];
      stageRows[axis][idx] ||= {};
      stageRows[axis][idx][field] = (field === 'min' || field === 'max') ? +input.value : input.value.trim();
    });
    for (const [axis, rows] of Object.entries(stageRows)) {
      const filtered = rows
        .filter(row => Number.isFinite(row.min))
        .sort((a, b) => a.min - b.min);
      const validation = validateRelationStageStarts(axis, filtered);
      if (!validation.ok) {
        alert(validation.message);
        return;
      }
      CONFIG.relationPanelConfig.axisStageLabels[axis] = filtered.map((row, i) => ({
        ...row,
        max: filtered[i + 1]?.min ?? 100,
      }));
    }
    saveConfigToStorage();
    renderAdmin();
  };

  const resetRelationLabels = document.getElementById('btn-reset-relation-labels');
  if (resetRelationLabels) resetRelationLabels.onclick = () => {
    if (!confirm('恢复默认关系标签配置？当前关系标签配置会被覆盖。')) return;
    CONFIG.relationPanelConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.relationPanelConfig || {}));
    CONFIG.relationTypeThresholds = JSON.parse(JSON.stringify(DEFAULT_CONFIG.relationTypeThresholds || []));
    saveConfigToStorage();
    renderAdmin();
  };

  const addRelInit = document.getElementById('btn-add-rel-init');
  if (addRelInit) addRelInit.onclick = () => {
    CONFIG.relationInit.push({ a: 'baoyu', b: 'daiyu', initType: '朋友', initValue: 10, note: '' });
    adminSelRelIdx = CONFIG.relationInit.length - 1;
    saveConfigToStorage(); renderAdmin();
  };

  const saveChar = document.getElementById('btn-save-char');
  if (saveChar) saveChar.onclick = () => {
    const c = CONFIG.characters[adminSelChar];
    c.name = document.getElementById('cf-name').value;
    c.short = document.getElementById('cf-short').value;
    c.shortComment = document.getElementById('cf-comment')?.value || '';
    c.gender = document.getElementById('cf-gender')?.value || c.gender || '';
    c.socialRank = +document.getElementById('cf-rank')?.value || 2;
    c.homewardness = +document.getElementById('cf-homewardness')?.value || 50;
    c.personality = document.getElementById('cf-personality').value;
    c.memoryPalace = document.getElementById('cf-memory').value;
    c.skills = document.getElementById('cf-skills').value.split(',').map(s => s.trim()).filter(Boolean);
    c.attributes ||= {};
    document.querySelectorAll('[data-attr]').forEach(inp => { c.attributes[inp.dataset.attr] = +inp.value; });
    document.querySelectorAll('[data-need]').forEach(inp => {
      const nk = inp.dataset.need, k = inp.dataset.ncoef;
      if (!c.baseNeedCoeffs[nk]) c.baseNeedCoeffs[nk] = {};
      c.baseNeedCoeffs[nk][k] = +inp.value;
    });
    saveConfigToStorage();
    alert('人物配置已保存，点击「应用并重载游戏」生效。');
  };

  const saveCharJson = document.getElementById('btn-save-char-json');
  if (saveCharJson) saveCharJson.onclick = () => {
    const old = CONFIG.characters[adminSelChar];
    let parsedChar, parsedSpecialty;
    try {
      parsedChar = JSON.parse(document.getElementById('cf-json').value);
    } catch (e) { alert('character JSON 无效'); return; }
    try {
      const raw = document.getElementById('cf-specialty-json').value.trim();
      parsedSpecialty = raw ? JSON.parse(raw) : null;
    } catch (e) { alert('specialty profile JSON 无效'); return; }
    if (!parsedChar?.id) { alert('character JSON 必须包含 id'); return; }
    if (parsedChar.id !== old.id) {
      alert('暂不支持在这里修改人物 id。若要改 id，需要同时迁移关系、家庭、任务与存档引用。');
      return;
    }
    CONFIG.characters[adminSelChar] = parsedChar;
    CONFIG.charSpecialtyConfig ||= {};
    CONFIG.charSpecialtyConfig.profiles ||= {};
    if (parsedSpecialty && Object.keys(parsedSpecialty).length) CONFIG.charSpecialtyConfig.profiles[parsedChar.id] = parsedSpecialty;
    else delete CONFIG.charSpecialtyConfig.profiles[parsedChar.id];
    saveConfigToStorage();
    CharSpecialtySystem?.init?.();
    alert('人物统一配置已保存，点击「应用并重载游戏」可完整生效。');
    renderAdmin();
  };

  const clearEffectLog = document.getElementById('btn-clear-effect-log');
  if (clearEffectLog) clearEffectLog.onclick = () => {
    CharacterEffectSystem?.clearLog?.();
    renderAdmin();
  };

  const testCharacterEffect = document.getElementById('btn-test-character-effect');
  if (testCharacterEffect) testCharacterEffect.onclick = () => {
    const charId = CONFIG.characters[adminSelChar]?.id;
    CharacterEffectSystem?.apply?.({
      type: 'need', charId, key: 'fun', delta: 5,
    }, {
      source: 'admin:test',
      reason: '人物效果调试',
    });
    renderAdmin();
  };

  const saveState = document.getElementById('btn-save-state');
  if (saveState) saveState.onclick = () => {
    const sd = CONFIG.stateDefs[adminSelState];
    sd.name = document.getElementById('sf-name').value;
    sd.duration = +document.getElementById('sf-dur').value;
    sd.desc = document.getElementById('sf-desc').value;
    sd.blockedSkills = document.getElementById('sf-block').value.split(',').map(s => s.trim()).filter(Boolean);
    document.querySelectorAll('[data-sm-need]').forEach(inp => {
      const nk = inp.dataset.smNeed, k = inp.dataset.smK;
      if (!sd.needMods[nk]) sd.needMods[nk] = {};
      sd.needMods[nk][k] = +inp.value;
    });
    saveConfigToStorage();
    alert('状态已保存。');
  };

  // 删除状态
  const delState = document.getElementById('btn-del-state');
  if (delState) delState.onclick = () => {
    if (!confirm(`确认删除状态「${adminSelState}」？（不可撤销）`)) return;
    delete CONFIG.stateDefs[adminSelState];
    adminSelState = Object.keys(CONFIG.stateDefs)[0] || 'exhausted';
    saveConfigToStorage();
    renderAdmin();
  };

  // 新增状态
  const addNewState = document.getElementById('btn-state-add-new');
  if (addNewState) addNewState.onclick = () => {
    const newId = prompt('输入新状态 ID（英文，如 awkward）：');
    if (!newId || CONFIG.stateDefs[newId]) { alert('ID 已存在或为空'); return; }
    CONFIG.stateDefs[newId] = { name: newId, duration: 30, desc: '', blockedSkills: [], needMods: {} };
    adminSelState = newId;
    saveConfigToStorage();
    renderAdmin();
  };

  // CSV 导出
  const csvExport = document.getElementById('btn-state-csv-export');
  if (csvExport) csvExport.onclick = () => {
    document.getElementById('state-csv-area').value = exportStateCSV();
  };

  // CSV 导入
  const csvImport = document.getElementById('btn-state-csv-import');
  if (csvImport) csvImport.onclick = () => {
    const csv = document.getElementById('state-csv-area').value.trim();
    if (!csv) { alert('请先粘贴 CSV 内容或点「导出 CSV」查看格式。'); return; }
    const result = importStateCSV(csv);
    if (result.error) { alert('导入失败：' + result.error); return; }
    saveConfigToStorage();
    adminSelState = Object.keys(CONFIG.stateDefs)[0];
    renderAdmin();
    alert(`导入完成：新增 ${result.added} 条，更新 ${result.updated} 条。`);
  };

  document.querySelectorAll('[data-tpl]').forEach(el => el.onclick = () => { adminSelTpl = +el.dataset.tpl; renderAdmin(); });
  document.querySelectorAll('[data-inter]').forEach(el => el.onclick = () => { adminSelInter = +el.dataset.inter; renderAdmin(); });

  document.querySelectorAll('[data-furn-template]').forEach(el => el.onchange = () => {
    const tpl = CONFIG.furnitureTemplates?.[el.dataset.furnTemplate];
    if (!tpl) return;
    const raw = el.type === 'checkbox' ? el.checked : el.value;
    let value = parseAdminFieldValue(raw, el.dataset.type || 'string');
    if (el.dataset.field === 'skill') value = value || null;
    setAdminPathValue(tpl, el.dataset.field, value);
    if (tpl.essential) delete tpl.useCondition;
    reloadFurnitureAdminRuntime();
  });

  document.querySelectorAll('[data-furn-template-json]').forEach(el => el.onchange = () => {
    const tpl = CONFIG.furnitureTemplates?.[el.dataset.furnTemplateJson];
    if (!tpl) return;
    let parsed;
    try { parsed = JSON.parse(el.value || '[]'); }
    catch (e) { alert(`${el.dataset.jsonField} JSON 无效`); return; }
    if (!Array.isArray(parsed)) { alert(`${el.dataset.jsonField} 必须是数组`); return; }
    if (el.dataset.jsonField === 'actions') {
      const validation = validateFurnitureActions(parsed);
      if (validation.errors.length) {
        alert('actions 校验失败：\n' + validation.errors.join('\n'));
        return;
      }
    }
    if (parsed.length) tpl[el.dataset.jsonField] = parsed;
    else delete tpl[el.dataset.jsonField];
    reloadFurnitureAdminRuntime();
  });

  document.querySelectorAll('[data-furn-instance]').forEach(el => el.onchange = () => {
    const inst = CONFIG.furnitureInstances?.[+el.dataset.furnInstance];
    if (!inst) return;
    const raw = el.type === 'checkbox' ? el.checked : el.value;
    setAdminPathValue(inst, el.dataset.field, parseAdminFieldValue(raw, el.dataset.type || 'string'));
    reloadFurnitureAdminRuntime();
  });

  document.querySelectorAll('[data-furn-delete-template]').forEach(btn => btn.onclick = () => {
    const id = btn.dataset.furnDeleteTemplate;
    const tpl = CONFIG.furnitureTemplates?.[id];
    if (!tpl) return;
    const used = (CONFIG.furnitureInstances || []).filter(inst => +inst.templateId === +id).length;
    const msg = used
      ? `「${tpl.name || id}」还有 ${used} 个场景摆放。删除模板会一并删除这些摆放，确认吗？`
      : `确认删除家具模板「${tpl.name || id}」吗？`;
    if (!confirm(msg)) return;
    delete CONFIG.furnitureTemplates[id];
    CONFIG.furnitureInstances = (CONFIG.furnitureInstances || []).filter(inst => +inst.templateId !== +id);
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });

  document.querySelectorAll('[data-furn-delete-instance]').forEach(btn => btn.onclick = () => {
    const idx = +btn.dataset.furnDeleteInstance;
    const inst = CONFIG.furnitureInstances?.[idx];
    if (!inst || !confirm(`确认删除摆放实例 ${inst.instanceId}？`)) return;
    CONFIG.furnitureInstances.splice(idx, 1);
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });

  document.querySelectorAll('[data-furn-add-action]').forEach(btn => btn.onclick = () => {
    const id = btn.dataset.furnAddAction;
    const tpl = CONFIG.furnitureTemplates?.[id];
    if (!tpl) return;
    const actions = Array.isArray(tpl.actions) ? tpl.actions.slice() : [];
    const base = String(tpl.category || 'furniture').replace(/[^a-zA-Z0-9_]/g, '') || 'furniture';
    let n = actions.length + 1;
    let actionId = `${base}_action_${n}`;
    const used = new Set(actions.map(a => a.id));
    while (used.has(actionId)) actionId = `${base}_action_${++n}`;
    actions.push({
      id: actionId,
      name: '新动作',
      text: '填写 hover 描述：此动作在做什么、适合什么角色',
      duration: tpl.duration || 3,
      needRestores: (tpl.needRestores || []).slice(0, 1),
      effects: [],
      tags: [tpl.category || 'furniture'],
    });
    tpl.actions = actions;
    reloadFurnitureAdminRuntime();
    renderAdmin();
  });

  document.querySelectorAll('[data-furn-validate-actions]').forEach(btn => btn.onclick = () => {
    const id = btn.dataset.furnValidateActions;
    const textarea = [...document.querySelectorAll('[data-furn-template-json]')]
      .find(el => el.dataset.furnTemplateJson === id && el.dataset.jsonField === 'actions');
    let actions;
    try { actions = JSON.parse(textarea?.value || '[]'); }
    catch (e) { alert('actions JSON 无效'); return; }
    const validation = validateFurnitureActions(actions);
    alert(validation.errors.length ? `校验失败：\n${validation.errors.join('\n')}` : 'actions 校验通过。');
  });

  const addFurnTemplate = document.getElementById('btn-furn-add-template');
  if (addFurnTemplate) addFurnTemplate.onclick = () => {
    const id = nextNumericObjectKey(CONFIG.furnitureTemplates, 1000);
    CONFIG.furnitureTemplates[id] = {
      name: '新家具',
      category: 'custom',
      lifeLine: '闲',
      essential: false,
      gridW: 1,
      gridH: 1,
      entryOffset: [0, 1],
      icon: '□',
      color: '#5a5040',
      needRestores: [],
      duration: 2,
      maxUsers: 1,
      stopWhenFull: true,
    };
    reloadFurnitureAdminRuntime();
    renderAdmin();
  };

  const addFurnInstance = document.getElementById('btn-furn-add-instance');
  if (addFurnInstance) addFurnInstance.onclick = () => {
    const firstScene = CONFIG.scenes?.[0]?.id;
    const firstTpl = +Object.keys(CONFIG.furnitureTemplates || {})[0];
    if (!firstScene || !firstTpl) { alert('需要先有场景和家具模板'); return; }
    CONFIG.furnitureInstances = CONFIG.furnitureInstances || [];
    CONFIG.furnitureInstances.push({
      instanceId: nextFurnitureInstanceId(),
      sceneId: firstScene,
      templateId: firstTpl,
      anchorCol: 1,
      anchorRow: 1,
    });
    reloadFurnitureAdminRuntime();
    renderAdmin();
  };

  const applyFurn = document.getElementById('btn-furn-apply');
  if (applyFurn) applyFurn.onclick = () => {
    reloadFurnitureAdminRuntime();
    alert('家具配置已应用并热重载。');
    renderAdmin();
  };

  const saveNarrative = document.getElementById('btn-save-narrative');
  if (saveNarrative) saveNarrative.onclick = () => {
    try {
      const parsed = JSON.parse(document.getElementById('nb-json').value);
      CONFIG.narrativeBubble = parsed;
    } catch (e) { alert('叙事 JSON 无效'); return; }
    const s = CONFIG.narrativeBubble.settings || (CONFIG.narrativeBubble.settings = {});
    s.masterEnabled = document.getElementById('nb-master').checked;
    s.demandEnabled = document.getElementById('nb-demand').checked;
    s.conflictEnabled = document.getElementById('nb-conflict').checked;
    s.memoryEnabled = document.getElementById('nb-memory').checked;
    s.maxOnScreen = +document.getElementById('nb-max').value || 6;
    s.demand = s.demand || {};
    s.demand.minIntervalGameMin = +document.getElementById('nb-d-int').value || 5;
    s.demand.maxPerCharPerGameMin = +document.getElementById('nb-d-max').value || 2;
    s.conflict = s.conflict || {};
    s.conflict.scanIntervalGameMin = +document.getElementById('nb-c-scan').value || 15;
    s.conflict.maxConcurrent = +document.getElementById('nb-c-max').value || 2;
    s.llm = s.llm || {};
    s.llm.enabled = document.getElementById('nb-llm-en').checked;
    s.llm.manualEnabled = s.llm.enabled;
    s.llm.useEventOnly = document.getElementById('nb-llm-ev').checked;
    s.llm.apiUrl = document.getElementById('nb-llm-url').value.trim();
    s.llm.apiKey = document.getElementById('nb-llm-key').value.trim();
    s.llm.systemPrompt = document.getElementById('nb-llm-sys').value;
    saveConfigToStorage();
    NarrativeBubbleSystem.reloadConfig();
    alert('叙事气泡配置已保存并已热重载。');
    renderAdmin();
  };
  const reloadNarrative = document.getElementById('btn-reload-narrative');
  if (reloadNarrative) reloadNarrative.onclick = () => {
    NarrativeBubbleSystem.reloadConfig();
    log('叙事气泡已热重载。');
  };

  const saveLifePath = document.getElementById('btn-save-life-path');
  if (saveLifePath) saveLifePath.onclick = () => {
    try {
      CONFIG.lifePathConfig = JSON.parse(document.getElementById('lp-json').value);
    } catch (e) { alert('JSON 无效'); return; }
    saveConfigToStorage();
    LifePathSystem?.init?.();
    alert('人生路径配置已保存。');
    renderAdmin();
  };

  const manualNode = document.getElementById('btn-manual-node');
  if (manualNode) manualNode.onclick = () => {
    const targets = (CHARS || []).filter(c => c.lifePath);
    const c = targets.find(x => x.id === 'xifeng') || targets.find(x => x.id === 'xiren') || targets[0];
    if (!c || !LifePathSystem) { alert('找不到路径角色'); return; }
    const progress = LifePathSystem.getStoryProgress(c);
    const next = progress.find(n => !n.done);
    if (!next) { alert(`${c.short}故事节点已全部完成！`); return; }
    LifePathSystem.recordStoryNode(c, next.id, 'debug');
    alert(`已手动推进 ${c.short}：「${next.name}」`);
    renderAdmin();
  };

  const saveMulti = document.getElementById('btn-save-multi');
  if (saveMulti) saveMulti.onclick = () => {
    try {
      CONFIG.multiInteractConfig = JSON.parse(document.getElementById('mi-json').value);
    } catch (e) { alert('JSON 无效'); return; }
    saveConfigToStorage();
    MultiInteractSystem.init();
    alert('多人互动配置已保存并已热重载。');
    renderAdmin();
  };
  const reloadMulti = document.getElementById('btn-reload-multi');
  if (reloadMulti) reloadMulti.onclick = () => { MultiInteractSystem.init(); log('多人互动系统已热重载。'); };
  const testObs = document.getElementById('btn-test-observe');
  if (testObs) testObs.onclick = () => {
    const baochai = getChar('baochai');
    if (baochai) {
      MultiInteractSystem.observeAndReact(baochai, { type: 'tick' });
      log('已对宝钗执行一次观察扫描。');
    }
  };

  const saveQuest = document.getElementById('btn-save-quest');
  if (saveQuest) saveQuest.onclick = () => {
    try {
      CONFIG.questConfig = JSON.parse(document.getElementById('qc-json').value);
    } catch (e) { alert('任务 JSON 无效'); return; }
    const qc = CONFIG.questConfig;
    qc.masterEnabled = document.getElementById('qc-master').checked;
    qc.aiIssueIntervalGameMin = +document.getElementById('qc-issue-int').value || 60;
    qc.pendingExpireGameMin = +document.getElementById('qc-pending-exp').value || 180;
    qc.questWeightBoost = +document.getElementById('qc-weight').value || 3.5;
    qc.ui = qc.ui || {};
    qc.ui.showSocialLinks = document.getElementById('qc-social-links').checked;
    saveConfigToStorage();
    QuestSystem.init();
    CharSpecialtySystem.init();
    MultiInteractSystem.init();
    alert('任务配置已保存并已热重载。');
    renderAdmin();
  };
  const reloadQuest = document.getElementById('btn-reload-quest');
  if (reloadQuest) reloadQuest.onclick = () => {
    QuestSystem.init();
    CharSpecialtySystem.init();
    MultiInteractSystem.init();
    log('任务系统已热重载。');
  };
  const testQuest = document.getElementById('btn-test-quest');
  if (testQuest) testQuest.onclick = () => {
    const c = CHARS[selectedIdx];
    const fam = FamilySystem.findFamilyOfChar(c.id);
    const role = FamilySystem.getCharRole(c.id, fam?.id);
    let templateId, issuerId, assigneeId;
    if (role === '子女' || role === '手足') {
      templateId = 1004;
      issuerId = role === '子女' ? 'jiamu' : 'daiyu';
      assigneeId = c.id;
    } else if (role === '家主' || role === '长辈' || role === '配偶') {
      templateId = 1004;
      issuerId = c.id;
      assigneeId = 'tanchun';
    } else {
      templateId = 2001;
      issuerId = null;
      assigneeId = c.id;
    }
    const inst = QuestSystem.debugIssue(templateId, issuerId, assigneeId);
    if (inst) log(`测试任务：${tplName(templateId)}（${getChar(issuerId)?.short || '日常'} → ${getChar(assigneeId)?.short}）`);
    else log('测试下发失败：角色/关系不满足模板条件，可换人选或改 JSON 配置。');
  };

  const saveFurnReact = document.getElementById('btn-save-furn-react');
  if (saveFurnReact) saveFurnReact.onclick = () => {
    let parsed;
    try { parsed = JSON.parse(document.getElementById('fr-json').value); }
    catch (e) { alert('家具反应 JSON 无效'); return; }
    parsed.masterEnabled = document.getElementById('fr-master').checked;
    parsed.maxPerEvent = +document.getElementById('fr-max').value || 0;
    parsed.maxDistance = +document.getElementById('fr-dist').value || 0;
    parsed.defaultCooldownGameMin = +document.getElementById('fr-cd').value || 60;
    if (!Array.isArray(parsed.rules)) { alert('rules 必须是数组'); return; }
    CONFIG.furnitureReactionConfig = parsed;
    saveConfigToStorage();
    FurnitureReactionSystem?.reload?.();
    alert('家具反应配置已保存并热重载。');
    renderAdmin();
  };

  const testFurnReact = document.getElementById('btn-test-furn-react');
  if (testFurnReact) testFurnReact.onclick = () => {
    const c = CHARS[selectedIdx];
    const inst = CONFIG.furnitureInstances.find(row => row.sceneId === c.sceneId && getTemplate(row.templateId)?.category === 'table')
      || CONFIG.furnitureInstances.find(row => row.sceneId === c.sceneId);
    if (!c || !inst) { alert('当前场景没有可测试家具'); return; }
    EventBus.emit('furniture:use_started', {
      charId: c.id, instanceId: inst.instanceId, templateId: inst.templateId,
      category: getTemplate(inst.templateId)?.category, actionId: 'tea_alone',
    });
    log('已触发一次家具反应测试事件。');
  };

  const saveInter = document.getElementById('btn-save-inter');
  if (saveInter) saveInter.onclick = () => {
    const tpl = CONFIG.interactionTemplates[adminSelInter];
    tpl.name = document.getElementById('it-name').value;
    tpl.category = document.getElementById('it-cat').value;
    tpl.type = document.getElementById('it-type').value;
    tpl.relMin = +document.getElementById('it-relmin').value;
    tpl.relMax = +document.getElementById('it-relmax').value;
    const sk = document.getElementById('it-skill').value.trim();
    const sklv = document.getElementById('it-sklv').value;
    tpl.skillReq = sk ? { skill: sk, level: +sklv || 1 } : undefined;
    if (!sk) delete tpl.skillReq;
    tpl.duration = +document.getElementById('it-dur').value;
    tpl.cooldown = +document.getElementById('it-cd').value;
    tpl.once = document.getElementById('it-once').checked;
    tpl.lines = document.getElementById('it-lines').value.split('\n').map(s => s.trim()).filter(Boolean);
    tpl.animInitiator = document.getElementById('it-anim-a').value || undefined;
    tpl.animTarget = document.getElementById('it-anim-b').value || undefined;
    tpl.voice = document.getElementById('it-voice').value || undefined;
    tpl.llmPrompt = document.getElementById('it-llm').value || undefined;
    try {
      tpl.effects = JSON.parse(document.getElementById('it-effects').value);
    } catch (e) { alert('效果 JSON 无效'); return; }
    saveConfigToStorage();
    alert('互动模板已保存，请应用并重载。');
  };

  const saveTpl = document.getElementById('btn-save-tpl');
  if (saveTpl) saveTpl.onclick = () => {
    const tpl = CONFIG.furnitureTemplates[adminSelTpl];
    let actions;
    try {
      actions = JSON.parse(document.getElementById('ft-actions-json')?.value || '[]');
    } catch (e) { alert('actions JSON 无效'); return; }
    const validation = validateFurnitureActions(actions);
    if (validation.errors.length) {
      alert('actions 校验失败：\n' + validation.errors.join('\n'));
      return;
    }
    tpl.name = document.getElementById('ft-name').value;
    tpl.category = document.getElementById('ft-cat').value;
    tpl.gridW = +document.getElementById('ft-gw').value;
    tpl.gridH = +document.getElementById('ft-gh').value;
    tpl.entryOffset = [+document.getElementById('ft-ex').value, +document.getElementById('ft-ey').value];
    tpl.duration = +document.getElementById('ft-dur').value;
    tpl.maxUsers = +document.getElementById('ft-max').value;
    tpl.stopWhenFull = document.getElementById('ft-stop').checked;
    tpl.lifeLine = document.getElementById('ft-life').value;
    tpl.essential = document.getElementById('ft-essential').checked;
    tpl.skill = document.getElementById('ft-skill').value || null;
    tpl.skillLevel = tpl.skill ? Math.max(1, +document.getElementById('ft-skill-level').value || 1) : undefined;
    if (tpl.essential) delete tpl.useCondition;
    document.querySelectorAll('[data-nr]').forEach(inp => {
      const i = +inp.dataset.nr;
      if (!tpl.needRestores[i]) return;
      tpl.needRestores[i][inp.dataset.nf] = inp.dataset.nf === 'need' ? inp.value : +inp.value;
    });
    if (actions.length) tpl.actions = actions;
    else delete tpl.actions;
    saveConfigToStorage();
    buildWorldGrid?.();
    initFurnRuntime?.();
    buildUI?.();
    alert('家具模板已保存并热重载。');
    renderAdmin();
  };

  const addFurnAction = document.getElementById('btn-add-furn-action');
  if (addFurnAction) addFurnAction.onclick = () => {
    let actions;
    try {
      actions = JSON.parse(document.getElementById('ft-actions-json').value || '[]');
    } catch (e) { alert('actions JSON 无效，无法新增'); return; }
    if (!Array.isArray(actions)) { alert('actions 必须是数组'); return; }
    const tpl = CONFIG.furnitureTemplates[adminSelTpl];
    const base = (tpl.category || 'furniture').replace(/[^a-zA-Z0-9_]/g, '') || 'furniture';
    let n = actions.length + 1;
    let id = `${base}_action_${n}`;
    const used = new Set(actions.map(a => a.id));
    while (used.has(id)) id = `${base}_action_${++n}`;
    actions.push({
      id,
      name: '新动作',
      text: '在这里填写 hover 描述',
      duration: tpl.duration || 3,
      needRestores: (tpl.needRestores || []).slice(0, 1),
      effects: [],
      tags: [tpl.category || 'furniture'],
    });
    document.getElementById('ft-actions-json').value = JSON.stringify(actions, null, 2);
  };

  const validateFurnActions = document.getElementById('btn-validate-furn-actions');
  if (validateFurnActions) validateFurnActions.onclick = () => {
    let actions;
    try {
      actions = JSON.parse(document.getElementById('ft-actions-json').value || '[]');
    } catch (e) { alert('actions JSON 无效'); return; }
    const validation = validateFurnitureActions(actions);
    alert(validation.errors.length ? `校验失败：\n${validation.errors.join('\n')}` : 'actions 校验通过。');
  };

  const editScenes = document.getElementById('btn-edit-scenes');
  if (editScenes) editScenes.onclick = () => {
    const j = prompt('编辑 scenes JSON：', JSON.stringify(CONFIG.scenes));
    if (j) try { CONFIG.scenes = JSON.parse(j); saveConfigToStorage(); renderAdmin(); } catch (e) { alert('JSON 无效'); }
  };
  const editInsts = document.getElementById('btn-edit-insts');
  if (editInsts) editInsts.onclick = () => {
    const j = prompt('编辑 furnitureInstances JSON：', JSON.stringify(CONFIG.furnitureInstances));
    if (j) try { CONFIG.furnitureInstances = JSON.parse(j); saveConfigToStorage(); renderAdmin(); } catch (e) { alert('JSON 无效'); }
  };
  const btnConn = document.getElementById('btn-check-connectivity');
  if (btnConn) btnConn.onclick = () => {
    buildWorldGrid();
    const badScenes = SceneAccessSystem.checkAllScenesConnectivity().filter(r => !r.ok);
    const badFurn = SceneAccessSystem.checkAllFurnitureReachable?.().filter(r => !r.ok) || [];
    const lines = [
      ...badScenes.map(r => r.message),
      ...badFurn.map(r => r.message),
    ];
    alert(lines.length ? lines.join('\n') : '各场景通行连通，全部家具入口可达。');
    renderAdmin();
  };
  const btnIpc = document.getElementById('btn-save-identity-protocol');
  if (btnIpc) btnIpc.onclick = () => {
    try {
      CONFIG.identityProtocolConfig = JSON.parse(document.getElementById('ipc-json').value);
      saveConfigToStorage();
      alert('身份礼法已保存，请应用并重载。');
    } catch (e) { alert('JSON 无效'); }
  };
  const btnIpcPrev = document.getElementById('btn-preview-address');
  if (btnIpcPrev) btnIpcPrev.onclick = () => {
    const c = CHARS[selectedIdx];
    const other = CHARS.find(x => x.id !== c.id);
    const el = document.getElementById('ipc-preview');
    if (!other || !el) return;
    const addr = IdentityProtocolSystem?.formatAddressBlock?.(c, other) || '无';
    const proto = IdentityProtocolSystem?.formatInteractionProtocol?.(c, other, CONFIG.interactionTemplates[301]) || '';
    el.textContent = `${addr}\n\n（若以「打趣」为例）${proto}`;
  };

  const btnSac = document.getElementById('btn-save-scene-access');
  if (btnSac) btnSac.onclick = () => {
    try {
      CONFIG.sceneAccessConfig = JSON.parse(document.getElementById('sac-json').value);
      saveConfigToStorage();
      alert('场景权限已保存，请应用并重载。');
    } catch (e) { alert('JSON 无效'); }
  };
  const btnInv = document.getElementById('btn-test-invite');
  if (btnInv) btnInv.onclick = () => {
    const c = CHARS[selectedIdx];
    const other = charsInSceneGlobal(c.sceneId).find(x => x.id !== c.id);
    if (!other) { alert('当前场景无他人可邀'); return; }
    SceneAccessSystem.grantInvitation(c, other, c.sceneId, 60);
    log(`测试邀请：${c.short} → ${other.short} 来${getScene(c.sceneId)?.name}`);
    renderAdmin();
  };

  const editAttr = document.getElementById('btn-edit-attr-rules');
  if (editAttr) editAttr.onclick = () => {
    const j = prompt('编辑 attributeRules JSON：', JSON.stringify(CONFIG.attributeRules));
    if (j) try { CONFIG.attributeRules = JSON.parse(j); saveConfigToStorage(); renderAdmin(); } catch (e) { alert('JSON 无效'); }
  };

  const btnSaveGame = document.getElementById('btn-save-game');
  if (btnSaveGame) btnSaveGame.onclick = () => { saveGameToStorage(false); renderAdmin(); };
  const btnLoadGame = document.getElementById('btn-load-game');
  if (btnLoadGame) btnLoadGame.onclick = () => {
    if (loadGameFromStorage()) { closeAdmin(); log('进度已读取。'); }
    else alert('无存档或版本不兼容');
  };
  const btnClearSave = document.getElementById('btn-clear-save');
  if (btnClearSave) btnClearSave.onclick = () => {
    if (confirm('清除游玩进度？（配置不受影响）')) { clearGameSave(); renderAdmin(); }
  };

  const btnExport = document.getElementById('btn-export');
  if (btnExport) btnExport.onclick = () => {
    document.getElementById('io-json').value = JSON.stringify(CONFIG, null, 2);
  };
  const btnImport = document.getElementById('btn-import');
  if (btnImport) btnImport.onclick = () => {
    try {
      CONFIG = deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), JSON.parse(document.getElementById('io-json').value));
      migrateConfig(CONFIG);
      saveConfigToStorage();
      alert('导入成功，请应用并重载。');
    } catch (e) { alert('JSON 无效'); }
  };
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) btnReset.onclick = () => {
    if (confirm('恢复默认配置？')) {
      CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      migrateConfig(CONFIG);
      saveConfigToStorage();
      alert('已恢复，请应用并重载。');
    }
  };
  const btnRepairWorld = document.getElementById('btn-repair-world');
  if (btnRepairWorld) btnRepairWorld.onclick = () => {
    migrateConfig(CONFIG);
    saveConfigToStorage();
    CONFIG = loadConfig();
    initRuntime();
    SceneAccessSystem.repairAllCharacterScenes();
    initGridBucket();
    updateCamera(true);
    buildUI();
    log('已合并默认场景与家具，并校正角色位置。');
    alert('修复完成。若仍异常，请再点「应用并重载」。');
  };
  const btnApply = document.getElementById('btn-apply-game');
  if (btnApply) btnApply.onclick = () => {
    saveConfigToStorage();
    CONFIG = loadConfig();
    initRuntime();
    initEventSystem();
    SceneAccessSystem.init();
    NarrativeBubbleSystem.init();
    LifePathSystem?.init?.();
    FamilySystem.init();
    QuestSystem.init();
    CharSpecialtySystem.init();
    MultiInteractSystem.init();
    initAISystem();
    loadGameFromStorage();
    pauseCharAI(CHARS[selectedIdx]);
    buildUI();
    closeAdmin();
    log('配置已应用，游戏重载。');
  };
}

document.getElementById('btn-admin').onclick = openAdmin;
document.getElementById('btn-admin-close').onclick = closeAdmin;
document.getElementById('btn-admin-fullscreen').onclick = () => {
  const panel = document.getElementById('admin-panel');
  panel.classList.toggle('fullscreen');
  document.getElementById('btn-admin-fullscreen').textContent = panel.classList.contains('fullscreen') ? '退出全屏' : '全屏';
};
