/* ═══════════════════ ADMIN ═══════════════════ */
const ADMIN_TABS = [
  { id: 'chars', label: '人物系统' },
  { id: 'relInit', label: '关系初始化' },
  { id: 'states', label: '状态定义' },
  { id: 'interTpl', label: '互动模板' },
  { id: 'narrative', label: '叙事气泡' },
  { id: 'quests', label: '任务系统' },
  { id: 'multiInteract', label: '多人互动' },
  { id: 'furnTpl', label: '家具模板' },
  { id: 'scenes', label: '场景配置' },
  { id: 'sceneAccess', label: '场景权限' },
  { id: 'identityProtocol', label: '身份礼法' },
  { id: 'lifePath', label: '人生路径' },
  { id: 'needs', label: '需求/属性' },
  { id: 'io', label: '导入导出' },
];

let adminTab = 'chars', adminSelChar = 0, adminSelRelIdx = 0, adminSelState = 'drunk';
let adminSelTpl = 101, adminSelInter = 101;

function openAdmin() {
  document.getElementById('admin-overlay').classList.add('open');
  renderAdmin();
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
}

function renderAdmin() {
  document.getElementById('admin-tabs').innerHTML = ADMIN_TABS.map(t =>
    `<div class="adm-tab${t.id === adminTab ? ' active' : ''}" data-tab="${t.id}">${t.label}</div>`
  ).join('');
  document.querySelectorAll('.adm-tab').forEach(el => el.onclick = () => { adminTab = el.dataset.tab; renderAdmin(); });

  const body = document.getElementById('admin-body');
  if (adminTab === 'chars') body.innerHTML = renderCharAdmin();
  else if (adminTab === 'relInit') body.innerHTML = renderRelInitAdmin();
  else if (adminTab === 'states') body.innerHTML = renderStateAdmin();
  else if (adminTab === 'interTpl') body.innerHTML = renderInterTplAdmin();
  else if (adminTab === 'narrative') body.innerHTML = renderNarrativeAdmin();
  else if (adminTab === 'quests') body.innerHTML = renderQuestAdmin();
  else if (adminTab === 'multiInteract') body.innerHTML = renderMultiInteractAdmin();
  else if (adminTab === 'furnTpl') body.innerHTML = renderFurnTplAdmin();
  else if (adminTab === 'scenes') body.innerHTML = renderSceneAdmin();
  else if (adminTab === 'sceneAccess') body.innerHTML = renderSceneAccessAdmin();
  else if (adminTab === 'identityProtocol') body.innerHTML = renderIdentityProtocolAdmin();
  else if (adminTab === 'lifePath') body.innerHTML = renderLifePathAdmin();
  else if (adminTab === 'needs') body.innerHTML = renderNeedAdmin();
  else body.innerHTML = renderIOAdmin();
  bindAdminEvents();
}

function renderCharAdmin() {
  const c = CONFIG.characters[adminSelChar];
  const attrFields = Object.entries(c.attributes || {}).map(([k, v]) =>
    `<div class="cfg-field"><label>属性 ${k}</label><input type="number" data-attr="${k}" value="${v}"></div>`
  ).join('');
  const needFields = getNeedDefs().map(nd => {
    const cf = c.baseNeedCoeffs[nd.key] || {};
    return `<div class="section-title">${nd.label}(${nd.key}) 基础系数</div>
      <div class="cfg-grid">
        ${['min','max','grow','decay','timeDecay'].map(k =>
          `<div class="cfg-field"><label>${k}</label><input type="number" step="0.01" data-need="${nd.key}" data-ncoef="${k}" value="${cf[k] ?? (k==='min'?0:k==='max'?100:1)}"></div>`
        ).join('')}
      </div>`;
  }).join('');
  return `
    <div style="display:grid;grid-template-columns:160px 1fr;gap:12px">
      <div class="cfg-list">${CONFIG.characters.map((ch, i) =>
        `<div class="cfg-item${i === adminSelChar ? ' sel' : ''}" data-cidx="${i}">${ch.name}</div>`
      ).join('')}</div>
      <div>
        <div class="cfg-grid">
          <div class="cfg-field"><label>姓名</label><input id="cf-name" value="${c.name}"></div>
          <div class="cfg-field"><label>简称</label><input id="cf-short" value="${c.short}"></div>
          <div class="cfg-field"><label>短评（家庭气泡）</label><input id="cf-comment" value="${c.shortComment || ''}"></div>
        </div>
        <div class="section-title">属性（固定 → 影响需求系数与上下限）</div>
        <div class="cfg-grid">${attrFields}</div>
        ${needFields}
        <div class="cfg-field"><label>长期性格（文本）</label><textarea id="cf-personality">${c.personality}</textarea></div>
        <div class="cfg-field"><label>记忆宫殿（文本）</label><textarea id="cf-memory">${c.memoryPalace}</textarea></div>
        <div class="cfg-field"><label>技能（逗号分隔 move,talk,poetry,serve）</label><input id="cf-skills" value="${c.skills.join(',')}"></div>
        <div class="adm-actions">
          <button class="primary" id="btn-save-char">保存人物配置</button>
        </div>
      </div>
    </div>`;
}

function renderRelInitAdmin() {
  const list = (CONFIG.relationInit || []).map((r, i) =>
    `<tr style="border-bottom:1px solid #3a2f28">
      <td style="padding:4px">${getCharDef(r.a)?.short || r.a}</td>
      <td>${getCharDef(r.b)?.short || r.b}</td>
      <td>${r.initType}</td>
      <td>${r.initValue > 0 ? '+' : ''}${r.initValue}</td>
      <td><button data-reledit="${i}" style="font-size:10px">编辑</button>
          <button data-reldel="${i}" style="font-size:10px;color:#e74c3c">删</button></td>
    </tr>`
  ).join('');
  const ri = CONFIG.relationInit[adminSelRelIdx] || { a: 'baoyu', b: 'daiyu', initType: '朋友', initValue: 20, note: '' };
  const opts = CONFIG.characters.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  return `
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
      <tr style="color:#a89070"><td>A</td><td>B</td><td>类型</td><td>值</td><td>操作</td></tr>
      ${list || '<tr><td colspan="5" style="color:#8a7355">暂无</td></tr>'}
    </table>
    <p style="margin-top:8px;font-size:10px;color:#8a7355">未配置的人物对默认为陌生人(0)。关系值随社交变化，类型按阈值自动切换。</p>`;
}

function renderRelAdmin() { return renderRelInitAdmin(); }

// ── 状态 CSV 帮助函数 ──────────────────────────────────────────────────────────
const STATE_CSV_NEED_KEYS = ['energy', 'fun', 'hunger', 'hygiene'];
const STATE_CSV_HEADER = [
  'id', 'name', 'duration', 'desc', 'blockedSkills',
  ...STATE_CSV_NEED_KEYS.flatMap(k => [k + '_decay', k + '_grow']),
  'triggerNeed', 'triggerOp', 'triggerValue',
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
      _csvEsc(sd.desc || ''),
      _csvEsc((sd.blockedSkills || []).join(';')),
      ...STATE_CSV_NEED_KEYS.flatMap(k => [m[k]?.decay ?? '', m[k]?.grow ?? '']),
      sd.trigger?.need ?? '',
      sd.trigger?.op ?? '',
      sd.trigger?.value ?? '',
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
      desc:          row.desc || '',
      blockedSkills: row.blockedSkills ? row.blockedSkills.split(';').map(s => s.trim()).filter(Boolean) : [],
      needMods,
    };
    if (row.triggerNeed) {
      entry.trigger = { need: row.triggerNeed, op: row.triggerOp || 'lt', value: +row.triggerValue || 0 };
    }

    if (CONFIG.stateDefs[row.id]) updated++; else added++;
    CONFIG.stateDefs[row.id] = entry;
  }
  return { updated, added };
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
          <div class="cfg-field"><label>状态 ID</label><input id="sf-id" value="${adminSelState}" readonly style="color:#6a5a48"></div>
          <div class="cfg-field"><label>状态名</label><input id="sf-name" value="${sd.name}"></div>
          <div class="cfg-field"><label>持续时间（游戏分钟）</label><input type="number" id="sf-dur" value="${sd.duration}"></div>
          <div class="cfg-field" style="grid-column:1/-1"><label>描述</label><input id="sf-desc" value="${sd.desc || ''}"></div>
          <div class="cfg-field" style="grid-column:1/-1"><label>封锁技能（逗号分隔）</label><input id="sf-block" value="${(sd.blockedSkills||[]).join(',')}"></div>
        </div>
        <div class="section-title">需求速度系数修正（留空=不修正）</div>
        <div class="cfg-grid">${mods}</div>
        <p style="color:#8a7355;margin-top:8px;font-size:10px">触发：力竭/愁绪/欣悦由需求临界点自动触发；酒醉由🍶酒案触发。</p>
        <div class="adm-actions">
          <button class="primary" id="btn-save-state">保存当前状态</button>
          <button class="danger" id="btn-del-state" style="margin-left:8px">删除此状态</button>
        </div>

        <div class="section-title" style="margin-top:16px">CSV 批量导入／导出</div>
        <p style="font-size:10px;color:#6a5a48;margin-bottom:6px">
          列：id, name, duration, desc, blockedSkills(;分隔), energy_decay, energy_grow, fun_decay, fun_grow, hunger_decay, hunger_grow, hygiene_decay, hygiene_grow, triggerNeed, triggerOp, triggerValue
        </p>
        <div class="adm-actions" style="margin-bottom:6px">
          <button id="btn-state-csv-export">导出 CSV</button>
          <button class="primary" id="btn-state-csv-import">导入 CSV（覆盖/新增）</button>
        </div>
        <textarea id="state-csv-area" style="width:100%;height:130px;background:#1a1210;border:1px solid #5c4033;color:#f5e6c8;font-family:monospace;font-size:10px;padding:6px;resize:vertical" placeholder="粘贴 CSV 内容，或点击「导出 CSV」查看当前格式…"></textarea>
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
    <p style="color:#8a7355;margin-bottom:8px;line-height:1.5">
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
    <p style="color:#8a7355;font-size:11px;margin:6px 0">当前气泡：${activeHint}</p>
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
      rows += `<tr><td colspan="3" style="color:#d4a574;padding-top:6px;font-size:10px">第${ph}阶段·${escapeHtml(phaseNames[ph] || '')}（${pdone}/${pnodes.length}）</td></tr>`;
      for (const n of pnodes) {
        const statusColor = n.done ? '#7ab87a' : '#5a4a3a';
        const statusText = n.done ? `✓ 第${n.day ?? '?'}日` : '—';
        rows += `<tr>
          <td style="color:${statusColor};width:20px">${n.done ? '✓' : '○'}</td>
          <td style="color:#c8b88a">${escapeHtml(n.name)}</td>
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
    <p style="color:#8a7355;margin-bottom:8px;line-height:1.5">
      人生路径与声望框架（0612_06）+ 袭人晋升故事线（0612_06_02）。
      已配置 ${pathCount} 条路径、${stageCount} 个阶段、${nodeCount} 个故事节点。
    </p>
    <p style="color:#a89070;font-size:11px;margin-bottom:10px">${runtime}</p>
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
    <p style="color:#8a7355;margin-bottom:8px;line-height:1.5">
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
  return `
    <p style="color:#8a7355;margin-bottom:8px;line-height:1.5">
      可插拔任务系统：身份分层差遣（issuePermissions + issuerRelationRequired）与日常时辰表。
      玩家点击人物菜单「差遣」下发；进度监听家具/互动/跟随；AI 按权限随机下发。
    </p>
    <div class="cfg-grid">
      <div class="cfg-field"><label>总开关</label><input id="qc-master" type="checkbox" ${qc.masterEnabled !== false ? 'checked' : ''}></div>
      <div class="cfg-field"><label>AI下发间隔(游戏分)</label><input id="qc-issue-int" type="number" value="${qc.aiIssueIntervalGameMin ?? 60}"></div>
      <div class="cfg-field"><label>待回应过期(游戏分)</label><input id="qc-pending-exp" type="number" value="${qc.pendingExpireGameMin ?? 180}"></div>
      <div class="cfg-field"><label>任务行动加权</label><input id="qc-weight" type="number" step="0.1" value="${qc.questWeightBoost ?? 3.5}"></div>
    </div>
    <p style="color:#8a7355;font-size:11px">已配置 ${tplCount} 个模板、${routineCount} 条日常时间表</p>
    <div class="section-title">完整配置 JSON（templates / dailyRoutines）</div>
    <div class="cfg-field"><textarea id="qc-json" style="min-height:220px;font-family:monospace;font-size:11px">${JSON.stringify(qc, null, 2)}</textarea></div>
    <div class="adm-actions">
      <button class="primary" id="btn-save-quest">保存任务配置</button>
      <button id="btn-reload-quest">热重载</button>
      <button id="btn-test-quest">测试：向当前角色下发作诗陪吟</button>
    </div>`;
}

function renderFurnTplAdmin() {
  const tpl = CONFIG.furnitureTemplates[adminSelTpl];
  if (!tpl) return '<p>无模板</p>';
  const nr = (tpl.needRestores || []).map((r, i) =>
    `<div class="cfg-grid"><div class="cfg-field"><label>需求${i+1}</label>
      <select data-nr="${i}" data-nf="need">${getNeedDefs().map(n => `<option value="${n.key}"${n.key===r.need?' selected':''}>${n.label}</option>`).join('')}</select></div>
      <div class="cfg-field"><label>恢复/秒</label><input type="number" step="0.1" data-nr="${i}" data-nf="ratePerSec" value="${r.ratePerSec}"></div></div>`
  ).join('');
  const lifeOpts = ['食', '衣', '住', '行', '闲'].map(l =>
    `<option value="${l}"${tpl.lifeLine === l ? ' selected' : ''}>${getFurnitureConfig().lifeLineLabels[l] || l}</option>`
  ).join('');
  return `<div style="display:grid;grid-template-columns:140px 1fr;gap:12px">
    <div class="cfg-list">${Object.entries(CONFIG.furnitureTemplates).map(([id, t]) =>
      `<div class="cfg-item${+id === adminSelTpl ? ' sel' : ''}" data-tpl="${id}">${t.icon} ${t.name}${t.lifeLine ? ' [' + t.lifeLine + ']' : ''}</div>`
    ).join('')}</div>
    <div>
      <p style="color:#8a7355;font-size:12px;margin-bottom:8px">衣食住行：标「基础」的家具不卡技能与使用条件，保障生存。</p>
      <div class="cfg-grid">
        <div class="cfg-field"><label>名称</label><input id="ft-name" value="${tpl.name}"></div>
        <div class="cfg-field"><label>分类</label><input id="ft-cat" value="${tpl.category}"></div>
        <div class="cfg-field"><label>衣食住行</label><select id="ft-life">${lifeOpts}</select></div>
        <div class="cfg-field"><label>基础生存</label><input id="ft-essential" type="checkbox" ${tpl.essential || isEssentialFurniture(tpl) ? 'checked' : ''}></div>
        <div class="cfg-field"><label>宽×高(格)</label><input id="ft-gw" type="number" value="${tpl.gridW}" style="width:45%"> × <input id="ft-gh" type="number" value="${tpl.gridH}" style="width:45%"></div>
        <div class="cfg-field"><label>入口偏移 X,Y</label><input id="ft-ex" type="number" value="${tpl.entryOffset[0]}" style="width:45%"> , <input id="ft-ey" type="number" value="${tpl.entryOffset[1]}" style="width:45%"></div>
        <div class="cfg-field"><label>固定时长(秒)</label><input id="ft-dur" type="number" step="0.1" value="${tpl.duration}"></div>
        <div class="cfg-field"><label>最大使用者</label><input id="ft-max" type="number" value="${tpl.maxUsers}"></div>
        <div class="cfg-field"><label>满则中断</label><input id="ft-stop" type="checkbox" ${tpl.stopWhenFull ? 'checked' : ''}></div>
        <div class="cfg-field"><label>技能要求</label><input id="ft-skill" value="${tpl.skill || ''}" placeholder="留空=无；基础生存勿填"></div>
      </div>
      <div class="section-title">需求恢复配置（每秒恢复量）</div>${nr}
      <div class="adm-actions"><button class="primary" id="btn-save-tpl">保存家具模板</button></div>
    </div></div>`;
}

function renderSceneAdmin() {
  const typeLabels = SceneAccessSystem.cfg().sceneTypeLabels || {};
  const rows = CONFIG.scenes.map(sc => {
    const fam = sc.ownerFamilyId ? FamilySystem.getFamily(sc.ownerFamilyId) : null;
    return `<tr><td>${sc.id}</td><td>${sc.name}</td><td>${typeLabels[sc.sceneType] || sc.sceneType || '—'}</td>
      <td>${fam?.name || '—'}</td><td>${sc.isTransition ? '是' : ''}</td></tr>`;
  }).join('');
  const conn = SceneAccessSystem.checkAllScenesConnectivity().map(r =>
    `<li style="color:${r.ok ? '#6a8f6a' : '#c66'}">${r.message}</li>`).join('');
  return `<p style="color:#8a7355;margin-bottom:8px">场景类型与所属家庭决定活动范围；家具摆放后可用「连通性检测」校验是否挡路。</p>
    <table style="width:100%;font-size:12px;border-collapse:collapse;margin-bottom:12px">
      <thead><tr style="border-bottom:1px solid #5c4033"><th>ID</th><th>名称</th><th>类型</th><th>家庭</th><th>通道</th></tr></thead>
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
  return `<p style="color:#8a7355;margin-bottom:8px">当前 <b>${c.short}</b>（${FamilySystem.getCharRole(c.id) || '—'}）可进入：${accessNames}</p>
    <table style="width:100%;font-size:11px;border-collapse:collapse;margin-bottom:12px">
      <thead><tr style="border-bottom:1px solid #5c4033"><th>身份</th><th>权</th><th>可进类型</th><th>任意私宅</th><th>需邀请</th><th>额外</th></tr></thead>
      <tbody>${privRows}</tbody></table>
    <div class="section-title">sceneAccessConfig JSON</div>
    <textarea id="sac-json" style="width:100%;min-height:260px;font-family:monospace;font-size:11px;background:#1a1210;color:#f5e6c8;border:1px solid #5c4033;padding:8px">${JSON.stringify(sac, null, 2)}</textarea>
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
  return `<p style="color:#8a7355;margin-bottom:8px">
    身份礼法影响互动风险与 LLM 提示词中的称呼、位阶。当前选中：<b>${preview}</b></p>
    <p style="font-size:11px;color:#8a7355;margin-bottom:8px">
      <code>addressByInitType</code> 可覆盖默认称呼（如婆媳）；<code>rules</code> 定义「主仆+传情」等组合的行为模式。</p>
    <table style="width:100%;font-size:11px;border-collapse:collapse;margin-bottom:12px">
      <thead><tr style="border-bottom:1px solid #5c4033"><th>#</th><th>位阶关系</th><th>互动大类</th><th>行为</th><th>说明</th></tr></thead>
      <tbody>${ruleRows || '<tr><td colspan="5">无规则</td></tr>'}</tbody></table>
    <div class="section-title">identityProtocolConfig JSON</div>
    <textarea id="ipc-json" style="width:100%;min-height:320px;font-family:monospace;font-size:11px;background:#1a1210;color:#f5e6c8;border:1px solid #5c4033;padding:8px">${JSON.stringify(ipc, null, 2)}</textarea>
    <div class="adm-actions">
      <button class="primary" id="btn-save-identity-protocol">保存身份礼法</button>
      <button id="btn-preview-address">预览当前二人称呼提示</button>
    </div>
    <pre id="ipc-preview" class="cfg-preview" style="margin-top:8px;min-height:60px"></pre>`;
}

function renderNeedAdmin() {
  return `
    <p style="color:#8a7355;margin-bottom:10px">属性规则：每属性按 (值-50)/50 乘以规则系数，叠加到人物 baseNeedCoeffs 上。长期性格为叙事文本；运行时由属性+状态共同决定三系数与上下限。</p>
    <pre class="cfg-preview">${JSON.stringify(CONFIG.attributeRules, null, 2)}</pre>
    <div class="adm-actions">
      <button id="btn-edit-attr-rules">编辑属性规则(JSON)</button>
    </div>`;
}

function renderIOAdmin() {
  const hasSave = !!localStorage.getItem(SAVE_KEY);
  return `
    <p style="color:#8a7355"><b>配置</b> localStorage 键 <code>dgy_config</code> · <b>进度</b> 键 <code>${SAVE_KEY}</code>${hasSave ? '（已有存档）' : '（无存档）'}</p>
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
    <textarea id="io-json" style="width:100%;height:200px;margin-top:10px;background:#1a1210;border:1px solid #5c4033;color:#f5e6c8;font-family:monospace;font-size:11px;padding:8px" placeholder="粘贴 JSON 配置…"></textarea>`;
}

function bindAdminEvents() {
  document.querySelectorAll('[data-cidx]').forEach(el => el.onclick = () => { adminSelChar = +el.dataset.cidx; renderAdmin(); });
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
    c.personality = document.getElementById('cf-personality').value;
    c.memoryPalace = document.getElementById('cf-memory').value;
    c.skills = document.getElementById('cf-skills').value.split(',').map(s => s.trim()).filter(Boolean);
    document.querySelectorAll('[data-attr]').forEach(inp => { c.attributes[inp.dataset.attr] = +inp.value; });
    document.querySelectorAll('[data-need]').forEach(inp => {
      const nk = inp.dataset.need, k = inp.dataset.ncoef;
      if (!c.baseNeedCoeffs[nk]) c.baseNeedCoeffs[nk] = {};
      c.baseNeedCoeffs[nk][k] = +inp.value;
    });
    saveConfigToStorage();
    alert('人物配置已保存，点击「应用并重载游戏」生效。');
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
    if (tpl.essential) delete tpl.useCondition;
    document.querySelectorAll('[data-nr]').forEach(inp => {
      const i = +inp.dataset.nr;
      if (!tpl.needRestores[i]) return;
      tpl.needRestores[i][inp.dataset.nf] = inp.dataset.nf === 'need' ? inp.value : +inp.value;
    });
    saveConfigToStorage();
    alert('家具模板已保存，请应用并重载。');
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

