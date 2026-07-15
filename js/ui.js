/* ═══════════════════ UI ═══════════════════ */
const charDetailScrollById = {};
let llmToggleBusy = false;
let llmToggleMessage = '';
let questRailCollapsed = true;
let routineEditorState = null;
let routineDragState = null;
let routineTemplatePickerState = null;
let routineContextMenuState = null;
let routinePanelDocumentCloseHandler = null;
let hudStateTagsExpanded = false;

const HUD_NEED_ORDER = ['mood', 'energy', 'hunger', 'hygiene', 'social', 'fun'];
const NEED_DISPLAY_FALLBACK = {
  mood: '心绪',
  energy: '精力',
  hunger: '饥饿',
  hygiene: '清洁',
  social: '社交',
  fun: '意趣',
};

function selectChar(i) {
  const prev = selectedIdx;
  const detail = document.querySelector('#col-char .current-char-details');
  if (CHARS[prev] && detail) charDetailScrollById[CHARS[prev].id] = detail.scrollTop;
  if (prev !== i && CHARS[prev]) resumeCharAI(CHARS[prev]);
  selectedIdx = i;
  queuePage = 0;
  pauseCharAI(CHARS[i]);
  uiDirty = true;
  log(`选中${CHARS[i].name}。`);
}

function getStateTagClass(sid) {
  const sd = CONFIG.stateDefs[sid];
  if (!sd) return 'neutral';
  if (sd.polarity === 'positive') return 'buff';
  if (sd.polarity === 'negative') return 'debuff';
  if (sd.polarity === 'mixed') return 'neutral';
  if (sd.blockedSkills?.length) return 'debuff';
  if (Object.values(sd.needMods || {}).some(m => (m.grow || 0) > 1)) return 'buff';
  return 'neutral';
}

function getTopNeeds(c, count = 3) {
  return getNeedDefs()
    .map(n => ({ ...n, val: c.needs[n.key] ?? 50 }))
    .sort((a, b) => a.val - b.val)
    .slice(0, count);
}

function needBarColor(val) {
  if (val > 100) return 'var(--jn-purple-deep)';
  if (val < 10) return 'var(--jn-red-deep)';
  if (val < 20) return 'var(--jn-red-bright)';
  if (val < 50) return 'var(--jn-gold)';
  return 'var(--jn-green-bright)';
}

function getNeedDisplayName(def) {
  return NEED_DISPLAY_FALLBACK[def.key] || def.name || def.label || def.key;
}

function getNeedHudName(def) {
  return def.shortLabel || def.shortName || def.short || def.abbr || def.hudLabel || def.oneChar || getNeedDisplayName(def);
}

function getNeedHudLongName(def) {
  return def.longLabel || def.hudLongLabel || def.twoCharLabel || def.twoChar || def.name || def.label || getNeedDisplayName(def);
}

function getNeedHudShortName(def) {
  return def.shortLabel || def.oneChar || def.shortName || def.short || def.abbr || def.hudShortLabel || getNeedDisplayName(def).slice(0, 1);
}

function getHudNeedDefs() {
  const defs = getNeedDefs();
  const byKey = Object.fromEntries(defs.map(def => [def.key, def]));
  const ordered = HUD_NEED_ORDER.map(key => byKey[key]).filter(Boolean);
  return ordered.concat(defs.filter(def => !HUD_NEED_ORDER.includes(def.key)));
}

function needRiskClass(value) {
  if (value < 20) return 'critical';
  if (value < 50) return 'low';
  return '';
}

function needLiquidDotHtml(c, def, opts = {}) {
  const raw = Number(c?.needs?.[def.key]);
  const value = Number.isFinite(raw) ? Math.round(raw) : 50;
  const pct = Math.max(0, Math.min(100, value));
  const adaptTip = NeedAdaptationSystem?.tooltip?.(c, def.key) || '';
  const title = [
    `${getNeedDisplayName(def)}：${value}/100`,
    def.summary || '',
    adaptTip,
  ].filter(Boolean).join('\n');
  const color = def.color || needBarColor(value);
  const risk = needRiskClass(value);
  const valueHtml = opts.value ? `<span class="need-dot-value">${value}</span>` : '';
  const label = opts.short ? getNeedHudName(def) : getNeedDisplayName(def);
  const labelHtml = opts.responsive
    ? `<span class="need-dot-label need-dot-label-long">${escapeHtml(getNeedHudLongName(def))}</span><span class="need-dot-label need-dot-label-short">${escapeHtml(getNeedHudShortName(def))}</span>`
    : `<span class="need-dot-label">${escapeHtml(label)}</span>`;
  return `<span class="need-dot-item" title="${escapeHtml(title)}">
    <span class="need-liquid-dot ${risk}" style="--fill:${pct}%;--need-color:${escapeHtml(color)}"></span>
    ${labelHtml}${valueHtml}
  </span>`;
}

function charPortraitHtml(c, extraClass = '') {
  const url = typeof AssetSystem !== 'undefined'
    ? (AssetSystem.avatarUrlForChar(c) || AssetSystem.portraitUrlForChar?.(c))
    : null;
  if (url) {
    return `<div class="char-portrait${extraClass}" title="${escapeHtml(c.name)}"><img src="${escapeHtml(url)}" alt="${escapeHtml(c.short)}"></div>`;
  }
  return `<div class="char-portrait${extraClass}" style="background:${c.color}" title="${escapeHtml(c.name)}"></div>`;
}

function currentCharArtHtml(c) {
  const portrait = typeof AssetSystem !== 'undefined'
    ? AssetSystem.portraitUrlForChar?.(c)
    : null;
  return `<div class="current-char-art" title="${escapeHtml(c.name)}">
    ${portrait
      ? `<img src="${escapeHtml(portrait)}" alt="${escapeHtml(c.short)}半身立绘">`
      : `<div class="current-char-art-fallback" style="background:${c.color}"></div>`}
  </div>`;
}

function charAv48Html(c) {
  const url = typeof AssetSystem !== 'undefined'
    ? (AssetSystem.avatarUrlForChar(c) || AssetSystem.portraitUrlForChar?.(c))
    : null;
  if (url) return `<span class="av48"><img src="${escapeHtml(url)}" alt="${escapeHtml(c.short)}"></span>`;
  return `<span class="av48" style="background:${c.color}"></span>`;
}

function questProgressPct(inst) {
  const t = QuestSystem.tpl(inst.templateId);
  const conds = t?.completeConditions || [];
  if (!conds.length) return inst.status === QUEST_STATUS.PENDING ? 0 : 50;
  let sum = 0;
  for (const cond of conds) {
    const cur = inst.progress?.[cond.id] || 0;
    sum += Math.min(100, (cur / Math.max(1, cond.targetValue)) * 100);
  }
  return sum / conds.length;
}

function getLlmUiConfig() {
  return CONFIG.narrativeBubble?.settings?.llm || DEFAULT_CONFIG.narrativeBubble?.settings?.llm || {};
}

function getLlmModelName() {
  return window.InteractionLlmSystem?.modelName?.() || getLlmUiConfig().model || 'qwen2.5:7b-instruct';
}

function isLlmUiEnabled() {
  return window.InteractionLlmSystem?.isEnabled?.() || (!!getLlmUiConfig().enabled && getLlmUiConfig().interactionEnabled !== false);
}

async function onLlmToggleClick(e) {
  e?.stopPropagation?.();
  if (llmToggleBusy) return;
  const currentlyOn = isLlmUiEnabled();
  if (currentlyOn) {
    window.InteractionLlmSystem?.setEnabled?.(false);
    llmToggleMessage = '本地模型对话已关闭';
    log(llmToggleMessage);
    buildStatusBar();
    return;
  }

  llmToggleBusy = true;
  llmToggleMessage = '正在启动本地 Ollama…';
  buildStatusBar();
  try {
    const result = await window.InteractionLlmSystem?.startLocalOllama?.();
    if (result?.ok) {
      window.InteractionLlmSystem?.setEnabled?.(true);
      llmToggleMessage = result.message || `本地模型已开启：${getLlmModelName()}`;
      log(llmToggleMessage);
    } else {
      window.InteractionLlmSystem?.setEnabled?.(false);
      llmToggleMessage = result?.message || '本地模型启动失败';
      log(llmToggleMessage);
    }
  } finally {
    llmToggleBusy = false;
    buildStatusBar();
  }
}

function buildStatusBar() {
  const c = CHARS[selectedIdx];
  const sc = sceneAt(Math.floor(c?.gridCol || 0), Math.floor(c?.gridRow || 0));
  const sceneName = sc?.name || '大观园';
  const fade = sceneName !== lastStatusScene ? ' fade' : '';
  lastStatusScene = sceneName;
  const month = ((gameDay - 1) % 30) + 1;
  const monthNum = Math.floor((gameDay - 1) / 30) + 1;
  const seasonIdx = Math.floor(gameDay / 90) % 4;
  const periodIcon = (gamePeriod === 'night' || gamePeriod === 'dusk') ? '🌙' : '☀️';
  const wIcon = WEATHER_ICONS[gameWeather] || '☀️';
  const llmOn = isLlmUiEnabled();
  const llmStateClass = llmToggleBusy ? 'starting' : llmOn ? 'on' : llmToggleMessage && /失败|无法|不能|请先/.test(llmToggleMessage) ? 'error' : 'off';
  const llmTitle = llmToggleMessage || (llmOn ? '点击关闭本地模型对话' : '点击启动本地 Ollama，并让对话系统调用本地模型');
  const statusBar = document.getElementById('status-bar-fields') || document.getElementById('status-bar');
  statusBar.innerHTML = `
    <span class="sb-field${fade}">📍 ${escapeHtml(sceneName)}</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">📅 甲子年·${monthNum}月${month}日</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">${periodIcon} ${getShichenLabel()}·${getPeriodLabel()}</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">${SEASON_ICONS[seasonIdx]} ${getSeasonLabel()}</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">${wIcon} ${gameWeather}</span>
    <span class="sb-sep">|</span>
    <button id="btn-llm-toggle" class="llm-toggle ${llmStateClass}" title="${escapeHtml(llmTitle)}" ${llmToggleBusy ? 'disabled' : ''}>
      <span class="llm-dot"></span>
      <span>LLM ${llmToggleBusy ? '启动中' : llmOn ? '开' : '关'}</span>
      <span class="llm-model">${escapeHtml(getLlmModelName())}</span>
    </button>`;
  const btn = document.getElementById('btn-llm-toggle');
  if (btn) btn.onclick = onLlmToggleClick;
}

function buildColCurrentChar() {
  const c = CHARS[selectedIdx];
  const container = document.getElementById('col-char');
  if (!c) {
    container.innerHTML = '<div class="col-empty">无人物</div>';
    return;
  }
  const oldDetail = container.querySelector('.current-char-details');
  if (oldDetail) charDetailScrollById[c.id] = oldDetail.scrollTop;
  const needHtml = getHudNeedDefs().map(n => needLiquidDotHtml(c, n, { responsive: true })).join('');
  const activeStates = Array.isArray(c.activeStates) ? c.activeStates : [];
  const states = activeStates.map(s => {
    const cls = getStateTagClass(s.id);
    const sd = CONFIG.stateDefs[s.id];
    const name = sd?.name || s.id;
    const remain = s.remaining === -1 ? '' : s.remaining > 0 ? ` ${Math.round(s.remaining)}分` : '';
    return `<span class="tag state ${cls}" title="${escapeHtml((sd?.desc || '') + remain)}">${escapeHtml(name)}</span>`;
  }).join('');
  LifePathSystem?.initChar?.(c);
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const role = family ? FamilySystem.getCharRole(c.id, family.id) : '';
  const rankLabel = IdentityProtocolSystem?.rankLabel?.(IdentityProtocolSystem?.getCharRank?.(c.id)) || '';
  const rankValue = IdentityProtocolSystem?.getCharRank?.(c.id);
  const moneyBal = MoneySystem?.getBalance?.(c) ?? 0;
  const fund = family ? Math.round(FamilySystem.getFund(family.id)) : 0;
  const roleCanSeePublicFund = !!family
    && role !== '仆从'
    && (['家主', '配偶', '长辈', '子女', '手足'].includes(role) || (Number.isFinite(rankValue) && rankValue <= 3));
  const moneyLine = [
    roleCanSeePublicFund ? `<span title="${escapeAttr(family.name)}公库">公 ${fund}两</span>` : '',
    `<span title="人物私库">私 ${Math.round(moneyBal)}两</span>`,
  ].filter(Boolean).join('');
  const def = getCharDef(c.id);
  const shortComment = def?.shortComment ? `<div class="char-col-comment">${escapeHtml(def.shortComment)}</div>` : '';
  const statusText = c.statusText || '闲庭漫步';
  const statusTip = [rankLabel, role].filter(Boolean).join(' · ');
  container.innerHTML = `
    <div class="current-char-layout">
      ${currentCharArtHtml(c)}
      <div class="current-char-details">
        <div class="char-name-row">
          <div class="char-name-main">
            <div class="char-col-name">${escapeHtml(c.short)} ${getMood(c)}</div>
            <span class="hud-status-chip" title="${escapeAttr(statusTip || '当前状态')}">${escapeHtml(statusText)}</span>
          </div>
          <div class="hud-money-line">${moneyLine}</div>
        </div>
        ${shortComment}
        <div class="need-dots hud-need-dots">${needHtml}</div>
        <div class="hud-state-row${hudStateTagsExpanded ? ' expanded' : ''}" id="hud-state-row" title="点击展开/收起状态标签">
          <div class="state-tags hud-state-tags" id="hud-state-tags">${states || '<span class="tag state neutral">无状态</span>'}</div>
          <button type="button" class="hud-state-more" id="hud-state-more" aria-label="展开状态标签">${hudStateTagsExpanded ? '⌃' : '⌄'}</button>
        </div>
        ${hudSkillSummaryHtml(c)}
      </div>
    </div>`;
  const newDetail = container.querySelector('.current-char-details');
  if (newDetail) newDetail.scrollTop = charDetailScrollById[c.id] || 0;
  const stateTags = container.querySelector('#hud-state-tags');
  const stateRow = container.querySelector('#hud-state-row');
  const stateMore = container.querySelector('#hud-state-more');
  const charArt = container.querySelector('.current-char-art');
  if (charArt) {
    charArt.setAttribute('role', 'button');
    charArt.setAttribute('tabindex', '0');
    charArt.setAttribute('aria-label', `回到${c.short}`);
    charArt.onclick = focusSelectedCharacter;
    charArt.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusSelectedCharacter(); } };
  }
  if (stateTags && stateRow) {
    const updateStateOverflow = () => {
      const overflow = stateTags.scrollHeight > stateTags.clientHeight + 1;
      stateRow.classList.toggle('overflowing', overflow || hudStateTagsExpanded);
    };
    updateStateOverflow();
    requestAnimationFrame(updateStateOverflow);
    stateRow.onclick = () => {
      if (!stateRow.classList.contains('overflowing') && !hudStateTagsExpanded) return;
      hudStateTagsExpanded = !hudStateTagsExpanded;
      buildUI();
    };
    if (stateMore) stateMore.onclick = (e) => {
      e.stopPropagation();
      hudStateTagsExpanded = !hudStateTagsExpanded;
      buildUI();
    };
  }
}

function hudSkillSummaryHtml(c) {
  const fromChar = [...(c.skills || []), ...Object.keys(c.skillLevels || {})];
  const stamp = typeof getGameTimestamp === 'function'
    ? getGameTimestamp()
    : ((typeof gameDay !== 'undefined' ? gameDay : 0) * 1440
      + (typeof gameHour !== 'undefined' ? gameHour : 0) * 60
      + (typeof gameMinute !== 'undefined' ? gameMinute : 0));
  const freshGains = (c.skillRecentGains || []).filter(row => !row.expiresAt || row.expiresAt >= stamp);
  if (c.skillRecentGains?.length !== freshGains.length) c.skillRecentGains = freshGains;
  const gainBySkill = new Map();
  freshGains.forEach(row => {
    if (!row.skill) return;
    const old = gainBySkill.get(row.skill) || { delta: 0, latest: row };
    gainBySkill.set(row.skill, { delta: old.delta + (Number(row.delta) || 0), latest: row });
  });
  const ids = Array.from(new Set([
    ...freshGains.map(row => row.skill).filter(Boolean),
    ...fromChar,
  ])).filter(id => CONFIG.skillDefs?.[id]).slice(0, 5);
  if (!ids.length) return '';
  const deltaText = delta => {
    const fixed = Math.abs(delta) < 1 ? Number(delta).toFixed(2) : Number(delta).toFixed(1);
    return `${delta >= 0 ? '+' : ''}${fixed.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}`;
  };
  const chips = ids.map(id => {
    const def = CONFIG.skillDefs[id] || {};
    const raw = c.skillLevels?.[id] ?? (id === 'poetry' ? 3 : 1);
    const lv = Math.max(0, Math.floor(Number(raw) || 0));
    const gain = gainBySkill.get(id);
    const gainHtml = gain ? `<em>${escapeHtml(deltaText(gain.delta))}</em>` : '';
    return `<span class="hud-skill-chip${gain ? ' gain' : ''}" title="${escapeAttr(def.desc || id)}">
      <b>${escapeHtml(def.name || id)}</b><span>Lv${lv}</span>${gainHtml}
    </span>`;
  }).join('');
  return `<div class="hud-skill-row" title="最近行动带来的技能增长">${chips}</div>`;
}

function buildColFamily() {
  const fam = FamilySystem.getCurrentFamily();
  const el = document.getElementById('col-family');
  if (!fam) { el.innerHTML = '<div class="col-empty">无家庭</div>'; return; }
  const selected = CHARS[selectedIdx];
  const fund = Math.round(FamilySystem.getFund(fam.id));
  const memberIds = FamilySystem.getCurrentMemberIds();
  const dutyByCharId = new Map((ServantRelationSystem?.todayFollowForMaster?.(selected?.id) || [])
    .map(row => [row.charId, row]));
  const avatars = memberIds.map(charId => {
    const i = CHARS.findIndex(c => c.id === charId);
    if (i < 0) return '';
    const c = CHARS[i];
    const role = FamilySystem.getCharRole(charId) || '';
    const debuff = (c.activeStates || []).some(s => getStateTagClass(s.id) === 'debuff');
    const traitHint = (CharSpecialtySystem?.getDisplayTraits?.(c) || [])[0] || '';
    const duty = dutyByCharId.get(charId);
    const dutyTitle = duty ? ` · 当值：${duty.contract.role}，点标记选中人物` : '';
    return `<div class="member-av${i === selectedIdx ? ' active' : ''}${debuff ? ' has-debuff' : ''}${duty ? ' on-duty' : ''}" data-idx="${i}" title="${escapeHtml(c.name)}：${escapeHtml(c.statusText || '')}${traitHint ? ' · ' + traitHint : ''}${escapeHtml(dutyTitle)}">
      <span class="av-dot"></span>
      ${duty ? `<button type="button" class="duty-mark" data-duty-idx="${i}" title="今日当值：${escapeHtml(duty.contract.role)} · 点击打开传令并预选此人">令</button>` : ''}
      ${charAv48Html(c)}
      <div class="av-name">${escapeHtml(c.short)}</div>
      <div class="av-role">${escapeHtml(role)}${traitHint ? ' · ' + escapeHtml(traitHint) : ''}</div>
    </div>`;
  }).join('');
  el.innerHTML = `
    <div class="fam-row-header">
      <span class="fam-title">${fam.crestIcon || ''} ${escapeHtml(fam.name)}</span>
      <button type="button" id="btn-family-switch-sm" title="快捷键 F">切换家庭</button>
    </div>
    <div class="member-avatars">${avatars || '<span class="col-empty">无成员</span>'}</div>
    <div class="fam-meta-line">${escapeHtml(fam.tag || '')} · ${memberIds.length}口 · 公库 ${fund}两</div>`;
  const switchBtn = document.getElementById('btn-family-switch-sm');
  if (switchBtn) switchBtn.onclick = () => FamilySystem.openFamilyPanel();
  el.querySelectorAll('.member-av').forEach(av => {
    av.onclick = () => { selectChar(+av.dataset.idx); buildUI(); };
  });
  el.querySelectorAll('.duty-mark').forEach(mark => {
    mark.onclick = (e) => {
      e.stopPropagation();
      const idx = +mark.dataset.dutyIdx;
      openCommandPanel({ targetIdx: idx });
    };
  });
}

function normalizeSkillProficiency(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  const value = n <= 10 ? n * 10 : n;
  return Math.max(0, Math.min(100, value));
}

function skillProficiencyValue(c, sid) {
  const raw = c.skillValues?.[sid]
    ?? c.skillProficiency?.[sid]
    ?? c.skillLevels?.[sid]
    ?? getSkillLevel(c, sid);
  return normalizeSkillProficiency(raw);
}

function skillLevelDisplayFromProficiency(value) {
  const lv = Math.max(0, Math.min(10, Math.floor((Number(value) || 0) / 10)));
  return `Lv${lv}`;
}

function skillProgressPct(value) {
  const n = Math.max(0, Math.min(100, Number(value) || 0));
  return n % 10 * 10;
}

function skillRowHtml(c, sid) {
  const value = skillProficiencyValue(c, sid);
  const ok = canUseSkill(c, sid);
  const def = CONFIG.skillDefs[sid] || {};
  const name = def.name || sid;
  const title = [def.desc, `熟练度 ${Math.round(value)}/100`, ok ? '' : '当前状态不可用'].filter(Boolean).join(' · ');
  return `<div class="skill-row${ok ? '' : ' blocked'}" title="${escapeHtml(title)}">
    <span class="sk-name">${escapeHtml(name)}</span>
    <span class="sk-lv">${skillLevelDisplayFromProficiency(value)}</span>
    <span class="sk-xp"><span class="sk-xp-fill" style="display:block;width:${skillProgressPct(value)}%"></span></span>
  </div>`;
}

function managementSkillIdsSet() {
  return new Set(OrderBookSystem?.managementSkillIds?.() || []);
}

function managementSkillValue(c, sid) {
  if (OrderBookSystem?.skillValue) return OrderBookSystem.skillValue(c, sid);
  const raw = c.skillValues?.[sid] ?? c.skillProficiency?.[sid] ?? c.skillLevels?.[sid] ?? 0;
  return normalizeSkillProficiency(raw);
}

function managementSkillRowHtml(c, sid) {
  const value = managementSkillValue(c, sid);
  const def = CONFIG.skillDefs[sid] || {};
  const name = OrderBookSystem?.skillName?.(sid) || def.name || sid;
  const title = [name, skillLevelDisplayFromProficiency(value), `熟练度 ${Math.round(value)}/100`, def.desc || '秩序面板人物管理技能'].filter(Boolean).join(' · ');
  return `<div class="skill-row management" title="${escapeHtml(title)}">
    <span class="sk-name">${escapeHtml(name)}</span>
    <span class="sk-lv">${skillLevelDisplayFromProficiency(value)}</span>
    <span class="sk-xp"><span class="sk-xp-fill" style="display:block;width:${skillProgressPct(value)}%"></span></span>
  </div>`;
}

function panelFooterActionsHtml(extra = '', includeDefaultClose = true) {
  return `<div class="panel-footer-actions" style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
    ${extra}
    ${includeDefaultClose ? '<button class="sys-btn" onclick="document.getElementById(\'panel-overlay\').classList.remove(\'open\')">关闭</button>' : ''}
  </div>`;
}

function skillIdsForCharacter(c, options = {}) {
  const def = getCharDef(c.id) || {};
  const management = options.includeManagement
    ? (OrderBookSystem?.managementSkillIds?.() || [])
    : [];
  const ids = options.includeRuntime
    ? [...(def.skills || []), ...(c.skills || []), ...Object.keys(c.skillLevels || {}), ...management]
    : [...(def.skills || []), ...management];
  return Array.from(new Set(ids)).filter(id => CONFIG.skillDefs?.[id]);
}

function buildColSkills() {
  const c = CHARS[selectedIdx];
  const skills = skillIdsForCharacter(c).slice(0, 4);
  const rows = skills.map(sid => skillRowHtml(c, sid)).join('');
  document.getElementById('col-skill').innerHTML = `
    <div class="col-head"><span>技能</span>
      <button type="button" class="col-expand" id="btn-skill-expand">展开</button></div>
    <div class="skill-cards">${rows || '<div class="col-empty">无技能</div>'}</div>`;
  document.getElementById('btn-skill-expand').onclick = () => openPanel(buildSkillPanel());
}

function buildColQuests() {
  const c = CHARS[selectedIdx];
  const instances = QuestSystem.getInstances?.() || [];
  const active = instances.filter(q =>
    (q.status === QUEST_STATUS.PENDING || q.status === QUEST_STATUS.ACCEPTED)
    && q.assigneeId === c?.id);
  const stage = document.getElementById('main-stage');
  if (stage) stage.classList.toggle('quest-collapsed', questRailCollapsed);
  const rail = document.getElementById('quest-rail');
  if (rail) rail.classList.toggle('collapsed', questRailCollapsed);
  const el = document.getElementById('col-quest');
  if (questRailCollapsed) {
    el.innerHTML = `<button type="button" class="quest-rail-tab" id="btn-quest-collapse" title="展开任务栏">
      <span>任务</span><b>J</b><em>${active.length}</em>
    </button>`;
    document.getElementById('btn-quest-collapse').onclick = () => { questRailCollapsed = false; buildColQuests(); };
    return;
  }
  const shown = active.slice().sort((a, b) => {
    const aPending = a.status === QUEST_STATUS.PENDING ? 0 : 1;
    const bPending = b.status === QUEST_STATUS.PENDING ? 0 : 1;
    return aPending - bPending;
  }).slice(0, 7);
  const cards = shown.map(inst => {
    const t = QuestSystem.tpl(inst.templateId);
    const pct = questProgressPct(inst);
    const cls = inst.status === QUEST_STATUS.PENDING ? 'pending' : (pct < 30 ? 'urgent' : '');
    const meta = inst.status === QUEST_STATUS.PENDING
      ? '待回应'
      : inst.blockedReason
        ? inst.blockedReason
        : `进行中 ${Math.round(pct)}%`;
    return `<div class="quest-card-mini ${cls}" data-qid="${inst.instanceId}">
      <div class="qc-title">${inst.status === QUEST_STATUS.PENDING ? '⚠ ' : ''}${escapeHtml(t?.name || '任务')}</div>
      <div class="qc-meta">${escapeHtml(meta)}</div>
      <div class="quest-prog"><div class="quest-prog-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
  el.innerHTML = `
    <div class="col-head"><span>任务 J</span>
      <span>
        <button type="button" class="col-expand" id="btn-quest-collapse">收起</button>
        <button type="button" class="col-expand" id="btn-quest-expand">详情<span class="quest-badge" id="quest-badge" style="display:none">0</span></button>
      </span></div>
    <div class="quest-cards">${cards || '<div class="col-empty">暂无任务</div>'}</div>`;
  document.getElementById('btn-quest-collapse').onclick = () => { questRailCollapsed = true; buildColQuests(); };
  document.getElementById('btn-quest-expand').onclick = () => QuestSystem.openQuestPanel();
  document.querySelectorAll('.quest-card-mini').forEach(card => {
    card.onclick = () => QuestSystem.openQuestPanel();
  });
}

let commandPanelState = {
  targetIds: [],
  singleTemplateId: 0,
  groupTemplateId: 0,
  economyAdjustment: 'none',
  failurePunishment: '',
  failureTrigger: '',
};

function commandPanelSourceLabels(issuer, target) {
  const labels = [];
  const duty = (ServantRelationSystem?.todayFollowForMaster?.(issuer?.id) || [])
    .find(row => row.charId === target?.id);
  const contract = ServantRelationSystem?.getDirectContract?.(issuer?.id, target?.id);
  const rel = IdentityProtocolSystem?.getHierarchyRelation?.(issuer?.id, target?.id);
  if (duty) labels.push(`当值${duty.contract?.role ? '·' + duty.contract.role : ''}`);
  if (contract) labels.push(contract.role || '直属仆从');
  if (!labels.length && rel === 'master_to_servant') labels.push('主仆');
  if (!labels.length && rel === 'parent_to_child') labels.push('长辈');
  if (!labels.length && rel === 'senior_servant_to_junior') labels.push('管事');
  if (!labels.length) labels.push(rel || '可传令');
  return [...new Set(labels)];
}

function commandPanelRelationSignals(issuer, target, load = 0) {
  const rel = IdentityProtocolSystem?.getHierarchyRelation?.(issuer?.id, target?.id) || '';
  const submission = typeof getRelationAxis === 'function'
    ? Math.round(getRelationAxis(target?.id, issuer?.id, 'submission') || 0)
    : 0;
  const trust = typeof getRelationAxis === 'function'
    ? Math.round(getRelationAxis(issuer?.id, target?.id, 'trust') || 0)
    : 0;
  const inDuty = rel === 'master_to_servant' && !!ServantRelationSystem?.getDirectContract?.(issuer?.id, target?.id);
  let accept = '中';
  if (submission >= 65 && trust >= 10 && load <= 1) accept = '高';
  else if (submission < 15 || trust < -35 || load >= 3) accept = '低';
  const tags = [];
  if (rel === 'master_to_servant' || submission !== 0) tags.push(`服从${submission}`);
  if (trust !== 0) tags.push(`信任${trust}`);
  tags.push(`预计${accept}`);
  if (inDuty) tags.push('职责内');
  return { rel, submission, trust, accept, inDuty, tags };
}

function commandPanelFlatQuests(issuer, target) {
  return (QuestIssueSystem?.getAvailableQuests?.(issuer, target) || [])
    .flatMap(group => group.items || []);
}

function commandPanelSingleTargetRows(issuer) {
  if (!issuer) return [];
  return CHARS
    .filter(ch => ch.id !== issuer.id)
    .map(ch => {
      const items = commandPanelFlatQuests(issuer, ch);
      if (!items.length) return null;
      const sources = commandPanelSourceLabels(issuer, ch);
      const load = QuestSystem?.getActiveForChar?.(ch.id)?.length || 0;
      const relationSignals = commandPanelRelationSignals(issuer, ch, load);
      return { char: ch, items, sources, load, relationSignals };
    })
    .filter(Boolean);
}

function commandPanelCommonQuests(issuer, targetIds) {
  const ids = (targetIds || []).filter(Boolean);
  if (!issuer || !ids.length) return [];
  let common = null;
  const byId = new Map();
  for (const id of ids) {
    const target = getChar(id);
    if (!target) continue;
    const items = commandPanelFlatQuests(issuer, target);
    const set = new Set(items.map(item => String(item.tpl.id)));
    items.forEach(item => { if (!byId.has(String(item.tpl.id))) byId.set(String(item.tpl.id), item); });
    common = common ? new Set([...common].filter(tid => set.has(tid))) : set;
  }
  return [...(common || [])].map(id => byId.get(id)).filter(Boolean);
}

function commandPanelEconomyAdjustments() {
  if (typeof EconomySystem === 'undefined') return [];
  return EconomySystem?.questAdjustmentOptions?.() || [];
}

function commandPanelSelectedAdjustment() {
  const opts = commandPanelEconomyAdjustments();
  if (!opts.some(o => o.id === commandPanelState.economyAdjustment)) commandPanelState.economyAdjustment = opts[0]?.id || 'none';
  return commandPanelState.economyAdjustment || 'none';
}

function commandPanelFailurePolicy(issuer, tpl, targetIds = []) {
  if (!QuestSystem?.buildFailurePolicy || !tpl) return null;
  return QuestSystem.buildFailurePolicy(tpl, issuer?.id, targetIds, {
    selectedPunishmentId: commandPanelState.failurePunishment || undefined,
    trigger: commandPanelState.failureTrigger ? { type: commandPanelState.failureTrigger } : undefined,
  });
}

function commandPanelFailureBox(issuer, tpl, targetIds = [], controlPrefix = 'cmd-failure') {
  if (!QuestSystem?.buildFailurePolicy || !tpl) return '';
  const ids = (targetIds || []).filter(Boolean);
  const policy = commandPanelFailurePolicy(issuer, tpl, ids);
  if (!policy) return '';
  const punishments = QuestSystem.punishmentOptionsFor?.(tpl, issuer?.id, ids) || [];
  const triggerOptions = [
    { id: 'onFirstFailure', label: '首次失败' },
    { id: 'onRepeatedFailure', label: '连续2次' },
    { id: 'onMonthlyCount', label: '本月3次' },
    { id: 'onSevereFailure', label: '严重失败' },
    { id: 'manualReview', label: '手动复核' },
  ];
  const punishmentHtml = punishments.map(row => {
    const suffix = row.id === 'fine_allowance' && row.requiresApproval ? ' · 需背书' : '';
    return `<option value="${escapeAttr(row.id)}" ${row.id === policy.selectedPunishmentId ? 'selected' : ''}>${escapeHtml(row.label + suffix)}</option>`;
  }).join('');
  const triggerHtml = triggerOptions.map(row => `<option value="${escapeAttr(row.id)}" ${row.id === policy.trigger?.type ? 'selected' : ''}>${escapeHtml(row.label)}</option>`).join('');
  const selectedPunishment = punishments.find(row => row.id === policy.selectedPunishmentId);
  const moneyHint = policy.selectedPunishmentId === 'fine_allowance'
    ? policy.moneyPenalty?.requiresApproval
      ? `扣月银需背书：${policy.moneyPenalty.reason || '等待管账人处理。'}`
      : `扣月银可执行：预计 ${policy.moneyPenalty.amount || 0} 两。`
    : selectedPunishment?.hint || selectedPunishment?.desc || '失败后按所选处置处理。';
  const conds = (policy.failureConditionsPreview || []).slice(0, 3)
    .map(s => `<span>${escapeHtml(s)}</span>`).join('');
  return `<div class="command-failure-box ${policy.selectedPunishmentId === 'fine_allowance' && policy.moneyPenalty?.requiresApproval ? 'warn' : ''}">
    <div class="command-money-line">
      <b>失败条件</b>
      <span>${conds || '<span>超时 / 质量过低</span>'}</span>
    </div>
    <div class="command-failure-controls">
      <label>失败处置
        <select id="${escapeAttr(controlPrefix)}-punishment" data-command-failure-punishment>${punishmentHtml}</select>
      </label>
      <label>触发
        <select id="${escapeAttr(controlPrefix)}-trigger" data-command-failure-trigger>${triggerHtml}</select>
      </label>
    </div>
    <small>${escapeHtml(moneyHint)}</small>
  </div>`;
}

function commandPanelEconomyBox(issuer, tpl, targetCount = 1, controlId = 'cmd-economy-adjustment') {
  if (typeof EconomySystem === 'undefined' || !issuer || !tpl) return '';
  const adjustment = commandPanelSelectedAdjustment();
  const opts = commandPanelEconomyAdjustments();
  const cost = EconomySystem.questIssueCost?.(tpl, targetCount, adjustment) || 0;
  const check = EconomySystem.canIssueQuestEconomy?.(issuer.id, tpl, targetCount, adjustment);
  const family = FamilySystem?.findFamilyOfChar?.(issuer.id);
  const balance = family ? Math.round(FamilySystem.getFund(family.id)) : 0;
  const optHtml = opts.map(o => `<option value="${escapeAttr(o.id)}" ${o.id === adjustment ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join('');
  const adj = opts.find(o => o.id === adjustment);
  return `<div class="command-money-box ${check && !check.ok ? 'warn' : ''}">
    <div class="command-money-line">
      <b>钱项</b>
      <span>${escapeHtml(family?.name || '无家庭')}公账 ${balance} 两 · 本次预估支出 ${cost} 两${targetCount > 1 ? `（${targetCount}人）` : ''}</span>
    </div>
    <select id="${escapeAttr(controlId)}" data-command-economy-adjustment>${optHtml}</select>
    <small>${escapeHtml(check && !check.ok ? check.reason : (adj?.desc || '按默认任务结算。'))}</small>
  </div>`;
}

function commandPanelAllowanceBox(issuer) {
  if (typeof EconomySystem === 'undefined' || !issuer) return '';
  const plans = EconomySystem.allowancePlansForIssuer?.(issuer.id) || [];
  if (!plans.length) return '';
  const rows = plans.map(row => {
    const fam = FamilySystem?.getFamily?.(row.targetFamilyId);
    return `<div class="command-allowance-row">
      <span>${escapeHtml(fam?.name || '家庭' + row.targetFamilyId)}</span>
      <b>${Math.round(row.amount || 0)} 两</b>
      <small>${escapeHtml(row.note || '月银')}</small>
    </div>`;
  }).join('');
  const sourceFamily = FamilySystem?.findFamilyOfChar?.(issuer.id);
  const balance = sourceFamily ? Math.round(FamilySystem.getFund(sourceFamily.id)) : 0;
  return `<section class="command-account-pane">
    <h4>管账职责 · 月银</h4>
    <p>${escapeHtml(issuer.short)}可发放月银；${escapeHtml(sourceFamily?.name || '本家')}公账 ${balance} 两。</p>
    <div class="command-allowance-list">${rows}</div>
    <button class="sys-btn" id="cmd-pay-allowance">立即发放这些月银</button>
  </section>`;
}

function commandPanelSelectedIds(rows) {
  const valid = new Set(rows.map(row => row.char.id));
  return (commandPanelState.targetIds || []).filter(id => valid.has(id));
}

function buildCommandPanel() {
  const issuer = CHARS[selectedIdx];
  const targetRows = commandPanelSingleTargetRows(issuer);
  let selectedIds = commandPanelSelectedIds(targetRows);
  if (!selectedIds.length && targetRows.length) selectedIds = [targetRows[0].char.id];
  commandPanelState.targetIds = selectedIds;

  const singleItems = commandPanelCommonQuests(issuer, selectedIds);
  if (!singleItems.some(item => String(item.tpl.id) === String(commandPanelState.singleTemplateId))) {
    commandPanelState.singleTemplateId = singleItems[0]?.tpl.id || 0;
  }

  const items = QuestIssueSystem?.getAvailableGroupQuests?.(issuer) || [];
  if (!items.some(item => String(item.tpl.id) === String(commandPanelState.groupTemplateId))) {
    commandPanelState.groupTemplateId = items[0]?.tpl.id || 0;
  }

  const targetHtml = targetRows.length ? targetRows.map(row => {
    const checked = selectedIds.includes(row.char.id) ? 'checked' : '';
    const tags = [...row.sources, ...(row.relationSignals?.tags || [])]
      .map(s => `<span>${escapeHtml(s)}</span>`).join('');
    return `<label class="command-target ${checked ? 'active' : ''}">
      <input type="checkbox" data-command-target="${escapeAttr(row.char.id)}" ${checked}>
      ${charAv48Html(row.char)}
      <b>${escapeHtml(row.char.short)}</b>
      <small>${tags}</small>
      <em>${row.load ? `任务${row.load}` : '空闲'}</em>
    </label>`;
  }).join('') : `<div class="command-empty">当前人物暂无可点名传令对象。</div>`;

  const singleOptions = singleItems.length ? singleItems.map(({ tpl, reason }) => `
    <option value="${tpl.id}" ${String(tpl.id) === String(commandPanelState.singleTemplateId) ? 'selected' : ''}>
      ${escapeHtml(tpl.name)}${selectedIds.length > 1 ? ' · 已选均可用' : reason ? ' · ' + escapeHtml(reason) : ''}
    </option>`).join('') : '';
  const selectedSingleTpl = singleItems.find(item => String(item.tpl.id) === String(commandPanelState.singleTemplateId))?.tpl;

  const groupRows = items.length ? items.map(({ tpl, preview, count, deadline }, i) => `
    <label class="command-group-row">
      <input type="radio" name="gi-tpl" value="${tpl.id}" ${String(tpl.id) === String(commandPanelState.groupTemplateId || items[0]?.tpl.id) ? 'checked' : ''}>
      <span style="color:var(--jn-title)">${escapeHtml(tpl.name)}</span>
      <span style="color:var(--jn-text-soft);font-size:10px">（${escapeHtml(tpl.category)}${deadline ? ' · ' + deadline : ''}）</span>
      <div style="color:var(--jn-text-muted);font-size:10px;margin-top:4px;margin-left:18px">目标：${escapeHtml(preview)}（${count}人）</div>
    </label>`).join('') : `<div class="command-empty">当前身份无可群体传令任务，或暂无符合条件者。</div>`;
  const selectedGroup = items.find(item => String(item.tpl.id) === String(commandPanelState.groupTemplateId || items[0]?.tpl.id));

  return `<h3>${issuer.short} · 传令</h3>
    <p style="color:var(--jn-text-soft);font-size:11px;margin-bottom:10px">左边点名传令给明确对象；右边群体传令给符合条件的一组人。当值只是状态，传令仍走身份和任务权限。</p>
    ${commandPanelAllowanceBox(issuer)}
    <div class="command-panel">
      <section class="command-pane">
        <h4>点名传令</h4>
        <div class="command-targets">${targetHtml}</div>
        <div class="command-form">
          <label>选择任务</label>
          ${singleItems.length
            ? `<select id="cmd-single-template">${singleOptions}</select>`
            : `<div class="command-empty">请先选择有共同可用任务的人物。</div>`}
          ${selectedSingleTpl ? commandPanelEconomyBox(issuer, selectedSingleTpl, Math.max(1, selectedIds.length), 'cmd-single-economy-adjustment') : ''}
          ${selectedSingleTpl ? commandPanelFailureBox(issuer, selectedSingleTpl, selectedIds, 'cmd-single-failure') : ''}
          <button class="sys-btn primary" id="cmd-single-confirm" ${singleItems.length ? '' : 'disabled'}>发布点名传令</button>
        </div>
      </section>
      <section class="command-pane">
        <h4>群体传令</h4>
        <div class="command-groups">${groupRows}</div>
        ${selectedGroup?.tpl ? commandPanelEconomyBox(issuer, selectedGroup.tpl, selectedGroup.count || 1, 'cmd-group-economy-adjustment') : ''}
        ${selectedGroup?.tpl ? commandPanelFailureBox(issuer, selectedGroup.tpl, selectedGroup.targets?.map(c => c.id) || [], 'cmd-group-failure') : ''}
        <button class="sys-btn primary" id="gi-confirm" ${items.length ? '' : 'disabled'}>发布群体传令</button>
      </section>
    </div>
    ${panelFooterActionsHtml('<button class="sys-btn" id="gi-cancel">关闭</button>', false)}`;
}

function bindCommandPanelEvents() {
  const cancel = document.getElementById('gi-cancel');
  const singleConfirm = document.getElementById('cmd-single-confirm');
  const groupConfirm = document.getElementById('gi-confirm');
  const payAllowance = document.getElementById('cmd-pay-allowance');
  if (cancel) cancel.onclick = () => document.getElementById('panel-overlay').classList.remove('open');
  document.querySelectorAll('[data-command-target]').forEach(input => {
    input.onchange = () => {
      commandPanelState.targetIds = [...document.querySelectorAll('[data-command-target]:checked')]
        .map(el => el.dataset.commandTarget);
      openPanel(buildCommandPanel());
      bindCommandPanelEvents();
    };
  });
  const singleSelect = document.getElementById('cmd-single-template');
  if (singleSelect) singleSelect.onchange = () => {
    commandPanelState.singleTemplateId = +singleSelect.value;
    commandPanelState.failurePunishment = '';
    commandPanelState.failureTrigger = '';
    openPanel(buildCommandPanel());
    bindCommandPanelEvents();
  };
  document.querySelectorAll('input[name="gi-tpl"]').forEach(input => {
    input.onchange = () => {
      commandPanelState.groupTemplateId = +input.value;
      commandPanelState.failurePunishment = '';
      commandPanelState.failureTrigger = '';
      openPanel(buildCommandPanel());
      bindCommandPanelEvents();
    };
  });
  document.querySelectorAll('[data-command-economy-adjustment]').forEach(econSelect => {
    econSelect.onchange = () => {
      commandPanelState.economyAdjustment = econSelect.value;
      openPanel(buildCommandPanel());
      bindCommandPanelEvents();
    };
  });
  document.querySelectorAll('[data-command-failure-punishment]').forEach(select => {
    select.onchange = () => {
      commandPanelState.failurePunishment = select.value;
      openPanel(buildCommandPanel());
      bindCommandPanelEvents();
    };
  });
  document.querySelectorAll('[data-command-failure-trigger]').forEach(select => {
    select.onchange = () => {
      commandPanelState.failureTrigger = select.value;
      openPanel(buildCommandPanel());
      bindCommandPanelEvents();
    };
  });
  if (payAllowance) payAllowance.onclick = () => {
    const issuer = CHARS[selectedIdx];
    const paid = EconomySystem?.runAllowanceForIssuer?.(issuer?.id) || 0;
    log(paid ? `${issuer.short}发放月银 ${paid} 笔。` : '月银未能发放，可能公账不足。');
    openPanel(buildCommandPanel());
    bindCommandPanelEvents();
    buildUI();
  };
  if (singleConfirm) singleConfirm.onclick = () => {
    const issuer = CHARS[selectedIdx];
    const tid = +(document.getElementById('cmd-single-template')?.value || 0);
    const targetIds = [...document.querySelectorAll('[data-command-target]:checked')].map(el => el.dataset.commandTarget);
    if (!issuer || !tid || !targetIds.length) return;
    targetIds.forEach(id => {
      const target = getChar(id);
      if (target) QuestIssueSystem.issueTo(issuer, target, tid, {
        economyAdjustment: commandPanelSelectedAdjustment(),
        failurePolicy: commandPanelFailurePolicy(issuer, QuestSystem.tpl?.(tid), [target.id]),
      });
    });
    document.getElementById('panel-overlay').classList.remove('open');
    buildUI();
  };
  if (groupConfirm) groupConfirm.onclick = () => {
    const issuer = CHARS[selectedIdx];
    const picked = document.querySelector('input[name="gi-tpl"]:checked');
    const tid = picked ? +picked.value : 0;
    const groupItem = (QuestIssueSystem?.getAvailableGroupQuests?.(issuer) || [])
      .find(item => String(item.tpl?.id) === String(tid));
    if (issuer && tid) QuestIssueSystem.issueGroupTo(issuer, tid, false, {
      economyAdjustment: commandPanelSelectedAdjustment(),
      failurePolicy: commandPanelFailurePolicy(issuer, QuestSystem.tpl?.(tid), groupItem?.targets?.map(c => c.id) || []),
    });
    document.getElementById('panel-overlay').classList.remove('open');
    buildUI();
  };
}

function openCommandPanel(opts = {}) {
  const target = opts.targetIdx != null ? CHARS[opts.targetIdx] : opts.targetId ? getChar(opts.targetId) : null;
  commandPanelState.targetIds = target ? [target.id] : commandPanelState.targetIds || [];
  commandPanelState.singleTemplateId = 0;
  commandPanelState.failurePunishment = '';
  commandPanelState.failureTrigger = '';
  openPanel(buildCommandPanel());
  bindCommandPanelEvents();
}

function openGroupIssuePanel() {
  const issuer = CHARS[selectedIdx];
  if (!QuestIssueSystem?.canIssueGroupAny?.(issuer) && !commandPanelSingleTargetRows(issuer).length) {
    log('当前身份暂无可传令对象。');
    return;
  }
  openCommandPanel();
}

function updateGroupIssueButton() {
  const btn = document.getElementById('btn-group-issue');
  if (!btn) return;
  const issuer = CHARS[selectedIdx];
  const show = QuestIssueSystem?.canIssueGroupAny?.(issuer) || commandPanelSingleTargetRows(issuer).length;
  btn.style.display = show ? '' : 'none';
}

function buildHelpPanel() {
  return `<h3>帮助</h3>
    <div style="font-size:11px;color:var(--jn-text-muted);line-height:1.6">
      <p><b>操作</b>：点击地面/家具行走或使用；点击其他人物打开互动菜单（含「传令」）；头像上的「令」表示今日当值传令快捷入口，点击会打开传令并预选此人；底栏「传令」可点名或群体下发；Shift+点击可插队行动。</p>
      <p><b>快捷键</b>：F 切换家庭；1–9 选择家庭成员；J 任务；P 人物；Q 起居；R 关系；K 技能；M 日志；Y 秩序；B 背包；S 设置；H 帮助。</p>
      <p><b>界面</b>：顶栏为地点、时令和全局入口；左侧任务 J 可收起；行动队列竖向排列；底部为当前人物 HUD、快捷入口和家庭成员头像。</p>
      <p>若地图空荡，请在设置→导入导出→恢复默认配置并应用重载。</p>
    </div>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
}

function profileMetricCard(label, value, sub = '') {
  return `<div class="profile-card">
    <div class="profile-card-label">${escapeHtml(label)}</div>
    <div class="profile-card-value">${escapeHtml(String(value ?? '—'))}</div>
    ${sub ? `<div class="profile-card-sub">${escapeHtml(sub)}</div>` : ''}
  </div>`;
}

function profileBar(label, value, max = 1000, color = 'var(--jn-gold)') {
  const v = Math.round(Number(value) || 0);
  const pct = Math.max(0, Math.min(100, v / Math.max(1, max) * 100));
  return `<div class="profile-bar">
    <span class="profile-bar-label">${escapeHtml(label)}</span>
    <span class="profile-bar-track">
      <span class="profile-bar-fill" style="width:${pct}%;background:${color}"></span>
    </span>
    <span class="profile-bar-value">${v}</span>
  </div>`;
}

function profilePortraitUrl(c) {
  if (typeof AssetSystem === 'undefined') return '';
  return AssetSystem.fullPortraitUrlForChar?.(c)
    || AssetSystem.portraitUrlForChar?.(c)
    || AssetSystem.avatarUrlForChar?.(c)
    || '';
}

function profileFullBodyPortraitUrl(c) {
  if (typeof AssetSystem === 'undefined') return '';
  return AssetSystem.fullBodyPortraitUrlForChar?.(c)
    || AssetSystem.fullPortraitUrlForChar?.(c)
    || AssetSystem.portraitUrlForChar?.(c)
    || '';
}

function profileNeedCoeffText(cf = {}) {
  const fmt = n => Number.isFinite(+n) ? Number(+n).toFixed(2).replace(/\.00$/, '') : n;
  const bits = [];
  if (cf.decay != null) bits.push(`消耗 x${fmt(cf.decay)}`);
  if (cf.grow != null) bits.push(`恢复 x${fmt(cf.grow)}`);
  if (cf.max != null && Number(cf.max) !== 100) bits.push(`上限 ${fmt(cf.max)}`);
  if (cf.min != null && Number(cf.min) !== 0) bits.push(`下限 ${fmt(cf.min)}`);
  return bits.join(' · ') || '标准节律';
}

function profileTraitGroups(c) {
  const profile = CONFIG.charSpecialtyConfig?.profiles?.[c.id] || {};
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const groups = { '性情': [], '习惯': [], '处世': [], '特殊': [] };
  const pushTrait = id => {
    if (!id) return;
    const row = meta[id] || {};
    const rawCat = row.category || '';
    const cat = rawCat.includes('习') ? '习惯'
      : rawCat.includes('处') || rawCat.includes('社交') ? '处世'
      : rawCat.includes('特殊') || rawCat.includes('专属') ? '特殊'
      : '性情';
    const label = row.label || CONFIG.charSpecialtyConfig?.traitLabels?.[id] || id;
    if (!groups[cat].includes(label)) groups[cat].push(label);
  };
  [...(profile.aiTraits || []), ...(profile.displayTraits || [])].forEach(pushTrait);
  (profile.specialties || []).forEach(spec => {
    const label = spec.label || spec.name || spec.id;
    if (label && !groups['特殊'].includes(label)) groups['特殊'].push(label);
  });
  return groups;
}

function profileNeedDefsInDisplayOrder() {
  const order = ['hunger', 'energy', 'hygiene', 'social', 'fun', 'mood'];
  const defs = typeof getNeedDefs === 'function' ? getNeedDefs() : [];
  return [...defs].sort((a, b) => {
    const ia = order.indexOf(a.key || a.id);
    const ib = order.indexOf(b.key || b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

function profileReputationSummary(c, repExplain) {
  const get = id => Math.round(repExplain?.domains?.find(row => row.id === id)?.value ?? c?.reputationDomains?.[id] ?? 0);
  const face = get('family');
  const word = Math.round((get('outside') + get('servant')) / 2);
  const talent = get('scholarly');
  const official = get('official');
  const overall = Math.round(face * 0.25 + word * 0.2 + talent * 0.15 + official * 0.4);
  return [
    { label: '声望', value: overall, sub: '总体' },
    { label: '面子', value: face, sub: '熟人圈评价' },
    { label: '口碑', value: word, sub: '外界与流言' },
    { label: '才名', value: talent, sub: '技能与作品' },
    { label: '功名', value: official, sub: '仕途与科第' },
  ];
}

function profileDreamInfo(c) {
  const cfg = CONFIG.charSpecialtyConfig || {};
  const profile = cfg.dreamProfiles?.[c.id] || {};
  const type = profile.type || '';
  const meta = type ? cfg.dreamMetadata?.[type] : null;
  const result = type && globalThis.DreamConditionRegistry?.evaluateDream
    ? globalThis.DreamConditionRegistry.evaluateDream(c.id, type)
    : null;
  return {
    type,
    title: profile.title || meta?.label || type || '未设定',
    desc: profile.description || meta?.description || '暂无长期梦想。',
    condition: profile.condition || (result ? `当前进度 ${Math.round(result.progressScore ?? 0)}` : '暂无明确条件'),
    progress: result?.progressScore,
  };
}

function buildProfileOverviewBlock(c, repExplain) {
  const portrait = profilePortraitUrl(c);
  const fullBody = profileFullBodyPortraitUrl(c);
  const baseRank = c._baseSocialRank ?? getCharDef(c.id)?.socialRank ?? c.socialRank ?? 2;
  const effectiveRank = IdentityProtocolSystem?.getCharRank?.(c.id) ?? baseRank;
  const rankLabel = IdentityProtocolSystem?.rankLabel?.(effectiveRank) || `等级${effectiveRank}`;
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const role = family ? FamilySystem.getCharRole(c.id, family.id) : '';
  const path = c.lifePath ? LifePathSystem?.getPath?.(c.lifePath) : null;
  const stage = c.currentStage ? LifePathSystem?.getStage?.(c.currentStage) : null;
  const groups = profileTraitGroups(c);
  const traitRows = Object.entries(groups).map(([cat, vals]) => {
    const tagsHtml = vals.slice(0, 4).map(v => `<i>${escapeHtml(v)}</i>`).join('') || '<em>未配置</em>';
    return `<div class="profile-trait-line"><b>${escapeHtml(cat)}</b><span class="profile-trait-tags">${tagsHtml}</span></div>`;
  }).join('');
  const basicItems = [
    ['性别', c.gender || '未设'],
    ['年龄', c.age == null ? '未设' : `${c.age}岁`],
    ['家庭', family?.name || '未入家庭'],
    ['身份', role || rankLabel],
    ['职业', stage?.title || path?.name || '暂无'],
    ['声望', Math.round(c.reputation || repExplain?.total || 0)],
  ].map(([label, value]) => `<span><b>${escapeHtml(label)}</b><em>${escapeHtml(String(value))}</em></span>`).join('');
  const tags = [
    rankLabel,
    role ? `${family?.name || '家庭'} · ${role}` : family?.name || '未入家庭',
    path?.name || '未择职业',
  ].filter(Boolean).map(t => `<span>${escapeHtml(t)}</span>`).join('');
  return `<section class="profile-cover">
    <button type="button" class="profile-edit-btn" id="profile-edit-character">编辑</button>
    <button type="button" class="profile-cover-art${fullBody ? ' clickable' : ''}" ${fullBody ? `data-profile-full-body="${escapeHtml(c.id)}" title="查看全身图"` : ''}>
      ${portrait ? `<img src="${escapeHtml(portrait)}" alt="${escapeHtml(c.name || '')}" loading="lazy" decoding="async">` : `<div class="profile-cover-fallback" style="background:${escapeHtml(c.color || '#c8d8c0')}">${escapeHtml(c.short || c.name?.slice(0, 1) || '人')}</div>`}
      ${fullBody ? '<span class="profile-cover-art-hint">全身</span>' : ''}
    </button>
    <div class="profile-cover-main">
      <div class="profile-cover-kicker">人物档案</div>
      <div class="profile-cover-name">${escapeHtml(c.name || '未名')}</div>
      <p class="profile-cover-desc">${escapeHtml(c.shortComment || c.personality || '身份、职业、需求与声望会在这里汇总展示。')}</p>
      <div class="profile-basic-mini">${basicItems}</div>
      <div class="profile-cover-tags">${tags}</div>
    </div>
    <div class="profile-trait-panel">
      <div class="profile-trait-title">性格小记</div>
      <div class="profile-trait-list">${traitRows}</div>
    </div>
  </section>`;
}

function buildFullBodyPortraitPanel(c) {
  const fullBody = profileFullBodyPortraitUrl(c);
  const portrait = profilePortraitUrl(c);
  const src = fullBody || portrait;
  return `<div class="profile-fullbody-panel">
    <div class="profile-fullbody-head">
      <div>
        <h3>${escapeHtml(c?.name || '人物')}</h3>
        <p>${escapeHtml(c?.shortComment || c?.personality || '全身立绘')}</p>
      </div>
      <div class="profile-fullbody-actions">
        <button class="sys-btn" id="profile-back-to-dossier">返回档案</button>
        <button class="sys-btn" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>
      </div>
    </div>
    <div class="profile-fullbody-stage">
      ${src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(c?.name || '')}全身图" loading="lazy" decoding="async">` : `<div class="profile-cover-fallback" style="background:${escapeHtml(c?.color || '#c8d8c0')}">${escapeHtml(c?.short || '人')}</div>`}
    </div>
  </div>`;
}

function buildProfileIdentityBlock(c, repExplain) {
  const baseRank = c._baseSocialRank ?? getCharDef(c.id)?.socialRank ?? c.socialRank ?? 2;
  const effectiveRank = IdentityProtocolSystem?.getCharRank?.(c.id) ?? baseRank;
  const rankLabel = IdentityProtocolSystem?.rankLabel?.(effectiveRank) || `等级${effectiveRank}`;
  const baseLabel = IdentityProtocolSystem?.rankLabel?.(baseRank) || `等级${baseRank}`;
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const role = family ? FamilySystem.getCharRole(c.id, family.id) : '';
  const identityRep = repExplain?.identity;
  const identityDomains = (identityRep?.domains || [])
    .map(row => `${row.label}${row.value}`)
    .join(' / ');
  const colors = ['#caa04f', '#83ad72', '#67aeb0', '#c97d83', '#8d78ad'];
  const repBars = (identityRep?.domains || repExplain?.domains || []).slice(0, 5).map((row, i) => {
    const value = Math.round(row.value ?? 0);
    const pct = Math.max(0, Math.min(100, value / 1000 * 100));
    const label = row.label || ReputationDomainSystem?.domainLabel?.(row.domain || row.id) || row.domain || row.id || '声望';
    return `<div class="profile-mini-rep" title="${escapeHtml(label)} ${escapeHtml(value)}">
      <div class="profile-mini-rep-track"><div class="profile-mini-rep-fill" style="height:${pct}%;background:linear-gradient(180deg, ${colors[i % colors.length]}, #b79b62)"></div></div>
      <div class="profile-mini-rep-label">${escapeHtml(label)}</div>
      <div class="profile-mini-rep-value">${escapeHtml(value)}</div>
    </div>`;
  }).join('');
  const rows = [
    profileMetricCard('身份位阶', rankLabel, effectiveRank !== baseRank ? `原位阶：${baseLabel}` : '由身份系统判定'),
    profileMetricCard('家庭身份', role || '未入家庭', family?.name || '无家庭归属'),
    `<div class="profile-card">
      <div class="profile-card-label">身份参考声望</div>
      <div class="profile-card-value">${escapeHtml(identityRep?.value ?? c.reputation ?? 0)}</div>
      <div class="profile-mini-rep-bars">${repBars || '<span class="profile-card-sub">暂无声望域</span>'}</div>
      ${identityDomains ? `<div class="profile-card-sub">${escapeHtml(identityDomains)}</div>` : ''}
    </div>`,
  ].join('');
  return `<section class="profile-section">
    <h4>身份与体面</h4>
    <div class="profile-metrics">${rows}</div>
  </section>`;
}

function buildProfileStatusBlock(c) {
  const needPalette = ['#b99a58', '#cb7f82', '#67b8b2', '#d486a7', '#8f74b3', '#80a96e'];
  const needs = profileNeedDefsInDisplayOrder().map((def, i) => {
    const key = def.key || def.id;
    const value = c.needs?.[key];
    const color = def.color || needPalette[i % needPalette.length];
    return `<span class="profile-need-chip">
      <i style="background:${escapeHtml(color)}"></i>
      <b>${escapeHtml(def.label || def.name || key)}</b>
      <em>${escapeHtml(value == null ? '—' : Math.round(value))}</em>
    </span>`;
  }).join('');
  const states = (c.activeStates || []).map(s => {
    const sd = CONFIG.stateDefs[s.id];
    const cls = getStateTagClass(s.id);
    const remain = s.remaining === -1 ? '常驻' : s.remaining > 0 ? `${Math.round(s.remaining)}分` : '';
    return `<span class="tag state ${cls}" title="${escapeHtml(sd?.desc || '')}">${escapeHtml(sd?.name || s.id)}${remain ? ` · ${escapeHtml(remain)}` : ''}</span>`;
  }).join('');
  const healthValue = HealthSystem?.getHealth?.(c.id);
  const illnessLevel = HealthSystem?.getIllnessLevel?.(c.id);
  const healthLine = healthValue != null
    ? `健康 ${Math.round(healthValue)}${illnessLevel && illnessLevel !== 'none' ? ' · ' + illnessLevel : ''}`
    : '健康系统未记录异常';
  const personal = Math.round(MoneySystem?.getBalance?.(c) ?? 0);
  const healthPct = Math.max(0, Math.min(100, Number(healthValue ?? 100)));
  const moneyPct = Math.max(0, Math.min(100, personal));
  return `<section class="profile-vitals">
    <div class="profile-vertical-bars">
      <div class="profile-vbar-card">
        <div class="profile-vbar-track"><div class="profile-vbar-fill" style="height:${healthPct}%"></div></div>
        <div class="profile-vbar-label">健康</div>
        <div class="profile-vbar-value">${escapeHtml(healthValue == null ? '—' : Math.round(healthValue))}</div>
      </div>
      <div class="profile-vbar-card money">
        <div class="profile-vbar-track"><div class="profile-vbar-fill" style="height:${moneyPct}%"></div></div>
        <div class="profile-vbar-label">私库</div>
        <div class="profile-vbar-value">${escapeHtml(personal)} 两</div>
      </div>
    </div>
    <div class="profile-need-ribbon">
      <div class="profile-need-head"><span>当前状态</span></div>
      <div class="profile-need-line">${needs}</div>
      <div class="profile-status-strip">${states || '<span>无状态</span>'}</div>
    </div>
  </section>`;
}

function buildProfileBasicsBlock(c, repExplain) {
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const role = family ? FamilySystem.getCharRole(c.id, family.id) : '';
  const baseRank = c._baseSocialRank ?? getCharDef(c.id)?.socialRank ?? c.socialRank ?? 2;
  const effectiveRank = IdentityProtocolSystem?.getCharRank?.(c.id) ?? baseRank;
  const rankLabel = IdentityProtocolSystem?.rankLabel?.(effectiveRank) || `等级${effectiveRank}`;
  const path = c.lifePath ? LifePathSystem?.getPath?.(c.lifePath) : null;
  const stage = c.currentStage ? LifePathSystem?.getStage?.(c.currentStage) : null;
  const personal = Math.round(MoneySystem?.getBalance?.(c) ?? 0);
  const basics = [
    profileMetricCard('性别', c.gender || '未设', '人物基础信息'),
    profileMetricCard('年龄', c.age == null ? '未设' : `${c.age}岁`, '人物基础信息'),
    profileMetricCard('家庭', family?.name || '未入家庭', '归属'),
    profileMetricCard('家庭身份', role || '未配置', '家中位置'),
    profileMetricCard('血缘', '暂未开放', '亲缘系统后续接入'),
  ].join('');
  const rows = [
    profileMetricCard('身份', rankLabel, effectiveRank !== baseRank ? `原位阶：${IdentityProtocolSystem?.rankLabel?.(baseRank) || baseRank}` : '当前礼法位置'),
    profileMetricCard('职业', stage?.title || path?.name || '暂无', path?.name ? `路径：${path.name}` : '未进入职业路径'),
    profileMetricCard('私库', `${personal} 两`, '人物当前银两'),
  ].join('');
  return `<section class="profile-section">
    <h4>基础信息</h4>
    <div class="profile-basic-grid">${basics}</div>
    <div class="profile-metrics profile-current-row">${rows}</div>
  </section>`;
}

function buildProfileDreamBlock(c) {
  const dream = profileDreamInfo(c);
  const pct = dream.progress == null ? null : Math.max(0, Math.min(100, Number(dream.progress) || 0));
  return `<section class="profile-section">
    <h4>梦想</h4>
    <div class="profile-dream-card">
      <div>
        <div class="profile-card-label">长期梦想</div>
        <div class="profile-path-title">${escapeHtml(dream.title)}</div>
        <p class="profile-path-desc">${escapeHtml(dream.desc)}</p>
      </div>
      <div>
        <div class="profile-card-label">当前条件</div>
        <div class="profile-card-sub">${escapeHtml(dream.condition)}</div>
        ${pct == null ? '' : `<div class="profile-dream-progress"><span style="width:${pct}%"></span></div>`}
      </div>
    </div>
  </section>`;
}

function buildProfileCareerBlock(c) {
  const path = c.lifePath ? LifePathSystem?.getPath?.(c.lifePath) : null;
  const stage = c.currentStage ? LifePathSystem?.getStage?.(c.currentStage) : null;
  const nextIds = stage?.nextStages || [];
  const nextRows = nextIds.map(id => {
    const ns = LifePathSystem?.getStage?.(id);
    const chk = LifePathSystem?.checkStageRequirements?.(c, id);
    return `<tr>
      <td>${escapeHtml(ns?.title || id)}</td>
      <td>${chk?.ok ? '可晋升' : '未满足'}</td>
      <td>${escapeHtml(chk?.ok ? '条件已满足' : chk?.reason || '—')}</td>
    </tr>`;
  }).join('');
  const historyRows = (c.professionHistory || []).slice(-5).reverse().map(row => `
    <tr>
      <td>${escapeHtml(row.title || row.stageId || '')}</td>
      <td>第${escapeHtml(row.fromDay ?? '?')}日</td>
      <td>${row.toDay ? `第${escapeHtml(row.toDay)}日` : '现在'}</td>
    </tr>`).join('');
  return `<section class="profile-section">
    <h4>职业路径</h4>
    <div class="profile-two-col">
      <div class="profile-path-card">
        <div class="profile-path-title">${escapeHtml(path?.name || '未择路')}</div>
        <div class="profile-path-meta">${escapeHtml(stage?.title || '暂无阶段')}${stage?.rankOverride != null ? ` · 身份位阶 ${stage.rankOverride}` : ''}</div>
        <div class="profile-path-desc">${escapeHtml(path?.description || '尚未进入人生路径。')}</div>
      </div>
      <div class="profile-table-wrap">
        <table class="profile-table">
          <thead><tr><th>下一阶</th><th>状态</th><th>条件</th></tr></thead>
          <tbody>${nextRows || '<tr><td colspan="3" class="profile-empty">暂无下一阶段</td></tr>'}</tbody>
        </table>
      </div>
    </div>
    <div class="profile-table-wrap" style="max-height:130px;margin-top:8px">
      <table class="profile-table">
        <thead><tr><th>经历</th><th>开始</th><th>结束</th></tr></thead>
        <tbody>${historyRows || '<tr><td colspan="3" class="profile-empty">暂无职业经历</td></tr>'}</tbody>
      </table>
    </div>
  </section>`;
}

function buildProfileReputationBlock(c, repExplain) {
  const summary = profileReputationSummary(c, repExplain);
  const overall = summary[0] || { label: '声望', value: Math.round(c.reputation || repExplain?.total || 0), sub: '总体' };
  const dims = summary.slice(1, 5);
  const max = 1000;
  const center = 50;
  const radius = 36;
  const axisPoints = [
    [50, 10],
    [90, 50],
    [50, 90],
    [10, 50],
  ];
  const valuePoints = dims.map((row, i) => {
    const ratio = Math.max(0, Math.min(1, row.value / max));
    const [x, y] = axisPoints[i];
    return [
      center + (x - center) * ratio,
      center + (y - center) * ratio,
    ];
  });
  const polygon = valuePoints.map(p => p.map(n => Number(n).toFixed(1)).join(',')).join(' ');
  const dimHtml = dims.map((row, i) => {
    const pct = Math.max(0, Math.min(100, row.value / max * 100));
    return `<span class="profile-radar-dim" title="${escapeHtml(row.label)}：${escapeHtml(row.value)}｜${escapeHtml(row.sub)}">
      <i style="height:${pct}%"></i><b>${escapeHtml(row.label)}</b><em>${escapeHtml(row.value)}</em>
    </span>`;
  }).join('');
  return `<section class="profile-section">
    <div class="profile-stat-grid">
      <div class="profile-stat-card">
        <h4>声望</h4>
        <div class="profile-radar-card" title="综合声望：${escapeHtml(overall.value)}｜${escapeHtml(overall.sub)}">
          <svg class="profile-radar-svg" viewBox="0 0 100 100" aria-label="声望雷达图">
            <polygon class="profile-radar-grid" points="50,10 90,50 50,90 10,50"></polygon>
            <polygon class="profile-radar-grid inner" points="50,30 70,50 50,70 30,50"></polygon>
            <line x1="50" y1="10" x2="50" y2="90"></line>
            <line x1="10" y1="50" x2="90" y2="50"></line>
            <polygon class="profile-radar-shape" points="${escapeHtml(polygon)}"></polygon>
          </svg>
          <div class="profile-radar-center"><b>${escapeHtml(overall.value)}</b><span>总声望</span></div>
        </div>
        <div class="profile-radar-dims">${dimHtml}</div>
        <button type="button" class="profile-card-full" data-profile-full="reputation">完整版</button>
      </div>
      <div class="profile-stat-card">
        <h4>血缘</h4>
        ${buildProfileTreeIframe(c, 'kinship')}
        <button type="button" class="profile-card-full" data-profile-full="kinship">完整版</button>
      </div>
      <div class="profile-stat-card">
        <h4>身份</h4>
        ${buildProfileTreeIframe(c, 'identity')}
        <button type="button" class="profile-card-full" data-profile-full="identity">完整版</button>
      </div>
    </div>
  </section>`;
}

function buildProfileTreeIframe(c, mode) {
  const params = new URLSearchParams({
    embed: '1',
    mini: '1',
    mode,
    focus: c.id || '',
  });
  return `<iframe class="profile-tree-frame" src="jiafu-order.html?${escapeHtml(params.toString())}" title="${mode === 'identity' ? '身份谱' : '血缘谱'}"></iframe>`;
}

function profileOrderMeta() {
  return window.JIAFU_ORDER_METADATA || {};
}

function profileTreePersonName(id) {
  const ch = CHARS.find(x => x.id === id);
  return ch?.name || profileOrderMeta().sourceGenealogy?.nameMap?.[id] || id;
}

function profileTreeNodeRole(node, mode) {
  if (!node) return '';
  if (mode === 'identity') {
    const label = profileOrderMeta().identityLevelRights?.find(row => row.level === node.rank)?.label || `位阶${node.rank ?? '?'}`;
    return [node.familyRole, label].filter(Boolean).join(' · ');
  }
  return node.level || '';
}

function profileTreePreview(c, mode) {
  const meta = profileOrderMeta();
  const tree = meta.treeDefs?.[mode];
  const nodeMap = tree?.nodes || {};
  const current = nodeMap[c.id];
  if (!tree || !current) {
    return profileRuntimeTreeFallback(c, mode);
  }
  const connected = (tree.edges || []).filter(edge => edge.from === c.id || edge.to === c.id);
  const ids = new Set([c.id]);
  connected.forEach(edge => { ids.add(edge.from); ids.add(edge.to); });
  if (ids.size < 4) {
    Object.values(nodeMap)
      .filter(node => mode === 'identity' ? node.rank === current.rank : node.level === current.level)
      .slice(0, 4)
      .forEach(node => ids.add(node.id));
  }
  const visibleIds = Array.from(ids).slice(0, 8);
  if (!visibleIds.includes(c.id)) visibleIds.unshift(c.id);
  const nodes = visibleIds.map(id => nodeMap[id]).filter(Boolean);
  const edges = (tree.edges || []).filter(edge => visibleIds.includes(edge.from) && visibleIds.includes(edge.to));
  const centers = nodes.map(node => ({ id: node.id, x: node.x + 66, y: node.y + 41 }));
  const minX = Math.min(...centers.map(p => p.x));
  const maxX = Math.max(...centers.map(p => p.x));
  const minY = Math.min(...centers.map(p => p.y));
  const maxY = Math.max(...centers.map(p => p.y));
  const width = 100;
  const height = 100;
  const pad = 12;
  const pointFor = node => {
    const cx = node.x + 66;
    const cy = node.y + 41;
    const x = pad + (maxX === minX ? .5 : (cx - minX) / (maxX - minX)) * (width - pad * 2);
    const y = pad + (maxY === minY ? .5 : (cy - minY) / (maxY - minY)) * (height - pad * 2);
    return { x, y };
  };
  const positions = Object.fromEntries(nodes.map(node => [node.id, pointFor(node)]));
  const edgeHtml = edges.map(edge => {
    const from = positions[edge.from];
    const to = positions[edge.to];
    if (!from || !to) return '';
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const d = `M ${from.x} ${from.y} Q ${midX} ${midY - 7} ${to.x} ${to.y}`;
    const label = mode === 'kinship' && edge.label
      ? `<text x="${midX}" y="${midY - 3}" text-anchor="middle">${escapeHtml(edge.label)}</text>`
      : '';
    return `<path d="${d}"></path>${label}`;
  }).join('');
  const nodeHtml = nodes
    .sort((a, b) => (positions[a.id].y - positions[b.id].y) || (positions[a.id].x - positions[b.id].x))
    .map(node => {
      const p = positions[node.id];
      const active = node.id === c.id ? ' active' : '';
      return `<span class="profile-tree-node${active}" style="left:${p.x}%;top:${p.y}%">
        <b>${escapeHtml(profileTreePersonName(node.id))}</b>
        <em>${escapeHtml(profileTreeNodeRole(node, mode))}</em>
      </span>`;
    }).join('');
  return `<div class="profile-tree-mini ${mode}">
    <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">${edgeHtml}</svg>
    ${nodeHtml}
  </div>`;
}

function profileRuntimeTreeFallback(c, mode) {
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const candidates = mode === 'identity'
    ? [...CHARS].sort((a, b) => (IdentityProtocolSystem?.getCharRank?.(a.id) ?? a.socialRank ?? 9) - (IdentityProtocolSystem?.getCharRank?.(b.id) ?? b.socialRank ?? 9))
    : CHARS.filter(row => family && FamilySystem?.findFamilyOfChar?.(row.id)?.id === family.id);
  const nodes = [c, ...candidates.filter(row => row.id !== c.id)].slice(0, 6);
  if (!nodes.length) {
    const text = mode === 'identity' ? '身份谱暂无此人' : '血缘谱暂无此人';
    return `<div class="profile-tree-empty">${escapeHtml(text)}</div>`;
  }
  const html = nodes.map(row => {
    const rank = IdentityProtocolSystem?.getCharRank?.(row.id) ?? row.socialRank ?? 2;
    const rankLabel = IdentityProtocolSystem?.rankLabel?.(rank) || `位阶${rank}`;
    const rowFamily = FamilySystem?.findFamilyOfChar?.(row.id);
    const role = rowFamily ? FamilySystem.getCharRole(row.id, rowFamily.id) : '';
    const active = row.id === c.id ? ' active' : '';
    return `<span class="profile-tree-fallback-node${active}">
      <b>${escapeHtml(row.name || row.id)}</b>
      <em>${escapeHtml(mode === 'identity' ? [role, rankLabel].filter(Boolean).join(' · ') : role || rowFamily?.name || '未入家庭')}</em>
    </span>`;
  }).join('');
  return `<div class="profile-tree-fallback ${mode}">${html}</div>`;
}

function buildProfileTreePreviewBlock(c) {
  return `<div class="profile-tree-stack">
    <div class="profile-tree-title"><span>血缘谱</span><em>名分关系</em></div>
    ${profileTreePreview(c, 'kinship')}
    <div class="profile-tree-title"><span>身份谱</span><em>位阶与管辖</em></div>
    ${profileTreePreview(c, 'identity')}
  </div>`;
}

function buildJiafuOrderEmbedPanel(options = {}) {
  const params = new URLSearchParams({ embed: '1' });
  if (options.mode) params.set('mode', options.mode);
  if (options.focus) params.set('focus', options.focus);
  const backButton = options.backToProfile
    ? '<button class="sys-btn" id="profile-back-to-dossier">返回人物</button>'
    : '';
  return `<div class="jiafu-order-embed">
    <div class="jiafu-order-embed-head">
      <div>
        <h3>贾府秩序</h3>
        <p>血缘、身份、事务、技能的完整秩序册。</p>
      </div>
    </div>
    <iframe class="jiafu-order-frame" src="jiafu-order.html?${escapeHtml(params.toString())}" title="贾府秩序"></iframe>
    ${panelFooterActionsHtml(backButton)}
  </div>`;
}

function openJiafuOrderPanel(options = {}) {
  openPanel(buildJiafuOrderEmbedPanel(options));
  document.getElementById('panel-content')?.classList.add('jiafu-order-panel-box');
  const back = document.getElementById('profile-back-to-dossier');
  if (back) back.onclick = () => openCharacterProfilePanel();
}

function buildProfileReputationFullPanel(c, repExplain) {
  const logRows = (repExplain?.log || []).map(row => `
    <tr>
      <td>第${escapeHtml(row.day ?? '?')}日</td>
      <td>${escapeHtml(ReputationDomainSystem?.domainLabel?.(row.domain) || row.domain)}</td>
      <td style="color:${row.delta >= 0 ? 'var(--jn-green-deep)' : 'var(--jn-red-bright)'}">${row.delta > 0 ? '+' : ''}${escapeHtml(row.delta || 0)}</td>
      <td>${escapeHtml(row.reason || row.source || '—')}</td>
    </tr>`).join('');
  return `<div class="profile-panel">
    <h3>${escapeHtml(c.name || '人物')} · 声望完整版</h3>
    <section class="profile-section">
      <div class="profile-reputation-grid profile-reputation-bars">${profileReputationSummary(c, repExplain).map((row, i) => {
        const colors = ['#caa04f', '#83ad72', '#67aeb0', '#8d78ad', '#c97d83'];
        const pct = Math.max(0, Math.min(100, row.value / 1000 * 100));
        return `<div class="profile-rep-column">
          <div class="profile-rep-column-track"><span style="height:${pct}%;background:${colors[i % colors.length]}"></span></div>
          <b>${escapeHtml(row.label)}</b><em>${escapeHtml(row.value)}</em><small>${escapeHtml(row.sub)}</small>
        </div>`;
      }).join('')}</div>
    </section>
    <section class="profile-section">
      <h4>近期变化</h4>
      <div class="profile-table-wrap" style="max-height:260px">
        <table class="profile-table">
          <thead><tr><th>日期</th><th>领域</th><th>变化</th><th>原因</th></tr></thead>
          <tbody>${logRows || '<tr><td colspan="4" class="profile-empty">暂无变化记录</td></tr>'}</tbody>
        </table>
      </div>
    </section>
    <div class="profile-actions">
      <button class="sys-btn" id="profile-back-to-dossier">返回人物</button>
      <button class="sys-btn" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>
    </div>
  </div>`;
}

function buildProfileSkillsBlock(c) {
  const ids = skillIdsForCharacter(c, { includeManagement: true });
  const managementSet = managementSkillIdsSet();
  const rows = ids.map(id => {
    const def = CONFIG.skillDefs[id] || {};
    const isManagement = managementSet.has(id);
    const value = isManagement ? managementSkillValue(c, id) : skillProficiencyValue(c, id);
    const ok = isManagement || canUseSkill(c, id);
    const pct = skillProgressPct(value);
    const shown = skillLevelDisplayFromProficiency(value);
    const detail = [
      OrderBookSystem?.skillName?.(id) || def.name || id,
      shown,
      `熟练度 ${Math.round(value)}/100`,
      def.desc || def.description || '',
      ok ? '' : '当前状态不可用',
    ].filter(Boolean).join('｜');
    return `<div class="profile-skill-card${ok ? '' : ' blocked'}" title="${escapeHtml(detail)}">
      <div class="profile-skill-pillar"><i style="height:${pct}%"></i></div>
      <div class="profile-skill-top"><b>${escapeHtml(OrderBookSystem?.skillName?.(id) || def.name || id)}</b><span>${escapeHtml(shown)}</span></div>
    </div>`;
  }).join('');
  return `<section class="profile-section profile-skills-section">
    <h4>技能</h4>
    <div class="profile-skill-row">${rows || '<div class="profile-empty">暂无技能记录</div>'}</div>
    <button type="button" class="profile-card-full profile-skill-full" id="profile-open-skill-full">完整版</button>
  </section>`;
}

function buildProfileFutureBlock(c) {
  const path = c.lifePath ? LifePathSystem?.getPath?.(c.lifePath) : null;
  const stage = c.currentStage ? LifePathSystem?.getStage?.(c.currentStage) : null;
  const dream = profileDreamInfo(c);
  const pct = dream.progress == null ? null : Math.max(0, Math.min(100, Number(dream.progress) || 0));
  return `<section class="profile-section">
    <h4>职业路径 / 梦想</h4>
    <div class="profile-two-col profile-future-row">
      <div class="profile-path-card">
        <div class="profile-card-label">职业路径</div>
        <div class="profile-path-title">${escapeHtml(path?.name || '未择路')}</div>
        <div class="profile-path-meta">${escapeHtml(stage?.title || '暂无阶段')}${stage?.rankOverride != null ? ` · 身份位阶 ${stage.rankOverride}` : ''}</div>
        <div class="profile-path-desc">${escapeHtml(path?.description || '职业系统后续继续接入。')}</div>
      </div>
      <div class="profile-path-card">
        <div class="profile-card-label">梦想</div>
        <div class="profile-path-title">${escapeHtml(dream.title)}</div>
        <div class="profile-path-meta">${escapeHtml(dream.condition)}</div>
        <div class="profile-path-desc">${escapeHtml(dream.desc)}</div>
        ${pct == null ? '' : `<div class="profile-dream-progress"><span style="width:${pct}%"></span></div>`}
      </div>
    </div>
  </section>`;
}

function buildProfileQuickFactsBlock(c, repExplain) {
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const role = family ? FamilySystem.getCharRole(c.id, family.id) : '';
  const baseRank = c._baseSocialRank ?? getCharDef(c.id)?.socialRank ?? c.socialRank ?? 2;
  const effectiveRank = IdentityProtocolSystem?.getCharRank?.(c.id) ?? baseRank;
  const rankLabel = IdentityProtocolSystem?.rankLabel?.(effectiveRank) || `等级${effectiveRank}`;
  const path = c.lifePath ? LifePathSystem?.getPath?.(c.lifePath) : null;
  const stage = c.currentStage ? LifePathSystem?.getStage?.(c.currentStage) : null;
  const domainLine = (repExplain?.domains || [])
    .slice(0, 3)
    .map(row => `${row.label}${row.value}`)
    .join('、');
  const summary = [
    family?.name && role ? `${family.name} · ${role}` : family?.name || '未入家庭',
    rankLabel,
    `综合声望 ${Math.round(c.reputation || repExplain?.total || 0)}`,
    domainLine ? `细节声望 ${domainLine}` : '',
  ].filter(Boolean).join(' · ');
  return `<section class="profile-quickfacts">
    <div class="profile-summary-line">${escapeHtml(summary)}</div>
    <div class="profile-info-cards">
      <div class="profile-info-card"><b>家庭</b><span>${escapeHtml(family?.name || '未入家庭')}</span></div>
      <div class="profile-info-card"><b>身份</b><span>${escapeHtml(role || rankLabel)}</span></div>
      <div class="profile-info-card"><b>职业</b><span>${escapeHtml(stage?.title || path?.name || role || '暂无')}</span></div>
      <div class="profile-info-card"><b>路径</b><span>${escapeHtml(path?.name ? `${path.name}${stage?.title ? ' · ' + stage.title : ''}` : '暂无')}</span></div>
    </div>
  </section>`;
}

function buildCharacterProfilePanel() {
  const c = CHARS[selectedIdx];
  if (!c) return '<h3>人物</h3><p style="color:var(--jn-text-soft)">暂无人物。</p>';
  LifePathSystem?.initChar?.(c);
  ReputationDomainSystem?.initChar?.(c);
  const repExplain = ReputationDomainSystem?.explain?.(c.id);
  return `<div class="profile-panel profile-compact-panel">
    <section class="profile-compact-top">
      <div class="profile-compact-main">
        ${buildProfileOverviewBlock(c, repExplain)}
        ${buildProfileStatusBlock(c)}
      </div>
      ${buildProfileFutureBlock(c)}
    </section>
    <div class="profile-compact-bottom">
      ${buildProfileSkillsBlock(c)}
      ${buildProfileReputationBlock(c, repExplain)}
    </div>
    ${panelFooterActionsHtml()}
  </div>`;
}

function openProfileAdminCharacterEditor() {
  const c = CHARS[selectedIdx];
  if (!c) return;
  document.getElementById('panel-overlay')?.classList.remove('open');
  if (typeof adminSelectCharById === 'function') {
    adminSelectCharById(c.id);
  } else if (typeof adminSelChar !== 'undefined') {
    const idx = CONFIG.characters.findIndex(row => row.id === c.id);
    if (idx >= 0) adminSelChar = idx;
  }
  if (typeof adminMode !== 'undefined') adminMode = 'v2';
  if (typeof adminV2Section !== 'undefined') adminV2Section = 'characterEditor';
  if (typeof adminV2CharacterEditing !== 'undefined') adminV2CharacterEditing = true;
  if (typeof openAdmin === 'function') openAdmin();
}

function openProfileSkillPanel() {
  openPanel(`<div class="profile-panel profile-skill-full-wrapper">
    ${buildSkillPanel({ hideClose: true })}
    ${panelFooterActionsHtml('<button class="sys-btn" id="profile-back-to-dossier">返回人物</button>')}
  </div>`);
  const back = document.getElementById('profile-back-to-dossier');
  if (back) back.onclick = () => openCharacterProfilePanel();
}

function openCharacterProfilePanel() {
  openPanel(buildCharacterProfilePanel());
  const editBtn = document.getElementById('profile-edit-character');
  if (editBtn) editBtn.onclick = openProfileAdminCharacterEditor;
  const skillFullBtn = document.getElementById('profile-open-skill-full');
  if (skillFullBtn) skillFullBtn.onclick = () => openProfileSkillPanel();
  const btn = document.getElementById('profile-open-life-path');
  if (btn) btn.onclick = () => LifePathSystem?.openPathPanel?.();
  const relBtn = document.getElementById('profile-open-relations');
  if (relBtn) relBtn.onclick = () => openPanel(buildRelationsPanel());
  const fullBodyBtn = document.querySelector('[data-profile-full-body]');
  if (fullBodyBtn) fullBodyBtn.onclick = () => {
    const c = CHARS[selectedIdx];
    openPanel(buildFullBodyPortraitPanel(c));
    const back = document.getElementById('profile-back-to-dossier');
    if (back) back.onclick = () => openCharacterProfilePanel();
  };
  document.querySelectorAll('[data-profile-full]').forEach(btn => {
    btn.onclick = () => {
      const c = CHARS[selectedIdx];
      if (btn.dataset.profileFull === 'reputation') {
        const repExplain = ReputationDomainSystem?.explain?.(c.id);
        openPanel(buildProfileReputationFullPanel(c, repExplain));
        const back = document.getElementById('profile-back-to-dossier');
        if (back) back.onclick = () => openCharacterProfilePanel();
        return;
      }
      if (btn.dataset.profileFull === 'kinship' || btn.dataset.profileFull === 'identity') {
        openJiafuOrderPanel({
          mode: btn.dataset.profileFull === 'identity' ? 'identity' : 'kinship',
          focus: c.id,
          backToProfile: true,
        });
      }
    };
  });
}

function initLogSidebar() {
  document.querySelectorAll('#log-filters button').forEach(btn => {
    btn.onclick = () => {
      logFilter = btn.dataset.filter;
      document.querySelectorAll('#log-filters button').forEach(b => b.classList.toggle('active', b === btn));
      renderLogSidebar();
    };
  });
  const list = document.getElementById('log-list');
  if (list) {
    list.addEventListener('scroll', () => { logUserScrolled = list.scrollTop > 12; });
  }
}

function toggleLogDrawer(force) {
  const el = document.getElementById('log-sidebar');
  if (!el) return;
  const open = force == null ? !el.classList.contains('open') : !!force;
  el.classList.toggle('open', open);
  if (open) renderLogSidebar();
}

function buildActionQueue() {
  const c = CHARS[selectedIdx];
  const q = c.actionQueue;
  const passiveItem = getPassiveInteractionQueueItem(c);
  const displayQueue = passiveItem ? [passiveItem, ...q] : q;
  const start = 0;
  const slice = displayQueue;
  const el = document.getElementById('action-queue');
  const panel = document.getElementById('action-queue-panel');
  if (panel) panel.classList.toggle('is-empty', !displayQueue.length);
  if (!displayQueue.length) {
    el.innerHTML = '<span class="aq-empty">暂无排队行动</span>';
    return;
  }
  el.innerHTML = slice.map((item, i) => {
    const idx = start + i;
    const realIdx = passiveItem ? idx - 1 : idx;
    const isPassive = !!item.passiveInteraction;
    const showRemaining = idx === 0 && item.remaining > 0
      && (item.phase === 'executing' || c.action?.type === 'interaction' || isPassive);
    return `<div class="aq-item${idx === 0 ? ' current' : ''}">
      ${isPassive ? '<button class="aq-cancel" disabled title="这是被动互动，不能从队列取消">•</button>' : `<button class="aq-cancel" data-qidx="${realIdx}">✕</button>`}
      <div class="aq-title">${item.name}</div>
      <div class="aq-phase">${getQueuePhaseLabel(c, item, idx)}${showRemaining ? ` · ${Math.ceil(item.remaining)}s` : ''}</div>
    </div>`;
  }).join('');
  document.querySelectorAll('.aq-cancel:not([disabled])').forEach(btn => btn.onclick = (e) => {
    e.stopPropagation();
    cancelQueueItem(c, +btn.dataset.qidx);
    buildUI();
  });
}

function getPassiveInteractionQueueItem(c) {
  const lock = c?._interactionLock;
  if (!lock) return null;
  const partner = getChar(lock.partnerId);
  const act = partner?.action;
  if (!partner || act?.type !== 'interaction' || act.target?.id !== c.id) return null;
  const tpl = act.tpl || getInteractionTemplate?.(act.interactionId);
  const lead = act.autoSocial ? '被主动社交' : '被互动';
  const activeItem = partner.actionQueue?.[0];
  return {
    passiveInteraction: true,
    type: 'passiveInteraction',
    name: `${lead}：${partner.short}·${tpl?.name || '互动'}`,
    phase: activeItem?.phase || 'executing',
    remaining: activeItem?.remaining || tpl?.duration || 0,
    partnerId: partner.id,
    interactionId: tpl?.id,
  };
}

function relAxisBar(label, val, min, max, color) {
  const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  const valStr = (val >= 0 ? '+' : '') + Math.round(val);
  return `<div class="bar-row" style="margin-bottom:3px">
    <span class="bar-label" style="width:28px;font-size:10px;color:var(--jn-text-muted)">${label}</span>
    <div class="bar-track" style="flex:1;height:5px;background:var(--jn-surface-deep);border:1px solid var(--jn-border-2)">
      <div style="height:100%;width:${pct}%;background:${color}"></div>
    </div>
    <span class="bar-val" style="width:28px;text-align:right;font-size:9px;color:var(--jn-text-soft)">${valStr}</span>
  </div>`;
}

function relPolarPoint(cx, cy, r, deg) {
  const rad = deg * Math.PI / 180;
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad),
  };
}

function relSectorPath(cx, cy, innerR, outerR, startDeg, endDeg) {
  const p1 = relPolarPoint(cx, cy, outerR, startDeg);
  const p2 = relPolarPoint(cx, cy, outerR, endDeg);
  const p3 = relPolarPoint(cx, cy, innerR, endDeg);
  const p4 = relPolarPoint(cx, cy, innerR, startDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}
    A ${outerR} ${outerR} 0 ${large} 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}
    L ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}
    A ${innerR} ${innerR} 0 ${large} 0 ${p4.x.toFixed(1)} ${p4.y.toFixed(1)}
    Z`;
}

function relRingArcPath(cx, cy, r, startDeg, endDeg, clockwise = true) {
  if (Math.abs(endDeg - startDeg) < 0.1) return '';
  const p1 = relPolarPoint(cx, cy, r, startDeg);
  const p2 = relPolarPoint(cx, cy, r, endDeg);
  const diff = Math.abs(endDeg - startDeg);
  const large = diff > 180 ? 1 : 0;
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}
    A ${r} ${r} 0 ${large} ${clockwise ? 1 : 0} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

function relationAxisSignedValue(axisKey, ri) {
  if (axisKey === 'affection') return ri.affection || 0;
  if (axisKey === 'trust') return ri.trust || 0;
  if (axisKey === 'friendship') return ri.friendship || 0;
  if (axisKey === 'care') return ri.affection || 0;
  return ri.submissionAtoB || 0;
}

function relationAxisRange(axisKey) {
  if (axisKey === 'empty') return { min: 0, max: 0, zero: 0, signed: false };
  return { min: -100, max: 100, zero: 0, signed: true };
}

function relationPanelConfig() {
  return CONFIG.relationPanelConfig || DEFAULT_CONFIG.relationPanelConfig || {};
}

function getRelationHierarchy(c, t) {
  return IdentityProtocolSystem?.getHierarchyRelation?.(c.id, t.id) || '';
}

function isFilialCareRelation(initType = '') {
  return ['父子', '父女', '母子', '母女', '祖孙'].includes(initType);
}

function isRelationLinealKinship(initType = '') {
  return ['父子', '父女', '母子', '母女', '祖孙'].includes(initType);
}

function relationShouldHideAffectionAxis(ri) {
  if (!ri?.initType) return false;
  const cfg = relationPanelConfig().affectionVisibility || {};
  const hidden = cfg.hiddenInitTypes || ['父子', '父女', '母子', '母女', '祖孙', '兄弟', '兄妹', '姐妹', '姐弟'];
  return hidden.includes(ri.initType);
}

function isYoungerOrLower(c, t) {
  const rankC = CONFIG.characters?.find(x => x.id === c.id)?.socialRank ?? 2;
  const rankT = CONFIG.characters?.find(x => x.id === t.id)?.socialRank ?? 2;
  return rankC > rankT;
}

function relationFourthAxis(ri, c, t) {
  const labels = relationPanelConfig().quadrantLabels || {};
  const hrel = getRelationHierarchy(c, t);
  if (hrel === 'servant_to_master') {
    return {
      key: 'submission',
      label: labels.servantToMaster || '服从',
      stage: ri.axisStages.submissionAtoB,
      color: 'var(--jn-purple)',
      value: ri.submissionAtoB || 0,
      baselineKey: 'submissionAtoB',
      active: true,
    };
  }
  if (hrel === 'master_to_servant') {
    return {
      key: 'care',
      label: labels.masterToServant || '体恤',
      stage: typeof getRelationAxisStage === 'function'
        ? getRelationAxisStage('care', ri.affection)
        : ri.axisStages.affection,
      color: 'var(--jn-purple)',
      value: ri.affection || 0,
      baselineKey: 'affection',
      active: true,
    };
  }
  if (isFilialCareRelation(ri.initType)) {
    if (isYoungerOrLower(c, t)) {
      return {
        key: 'submission',
        label: labels.filialPiety || '孝道',
        stage: typeof getRelationAxisStage === 'function'
          ? getRelationAxisStage('filialPiety', ri.submissionAtoB)
          : ri.axisStages.submissionAtoB,
        color: 'var(--jn-purple)',
        value: ri.submissionAtoB || 0,
        baselineKey: 'submissionAtoB',
        active: true,
      };
    }
    return {
      key: 'care',
      label: labels.parentalCare || '慈爱',
      stage: typeof getRelationAxisStage === 'function'
        ? getRelationAxisStage('parentalCare', ri.affection)
        : ri.axisStages.affection,
      color: 'var(--jn-purple)',
      value: ri.affection || 0,
      baselineKey: 'affection',
      active: true,
    };
  }
  return {
    key: 'empty',
    label: '',
    stage: { label: '' },
    color: 'var(--jn-text-dim)',
    value: 0,
    baselineKey: '',
    active: false,
  };
}

function relationAxisDisplayModel(ri, c, t) {
  const labels = relationPanelConfig().quadrantLabels || {};
  const serviceAxis = relationFourthAxis(ri, c, t);
  const hideAffection = relationShouldHideAffectionAxis(ri);
  return [
    {
      key: 'friendship',
      baselineKey: 'friendship',
      label: labels.friendship || '友谊',
      stage: ri.axisStages.friendship,
      color: 'var(--jn-green-bright)',
      value: ri.friendship || 0,
      start: 270,
      end: 360,
      active: true,
    },
    {
      key: 'affection',
      baselineKey: 'affection',
      label: hideAffection ? '' : (labels.affinity || '姻缘'),
      stage: hideAffection ? { label: '' } : ri.axisStages.affection,
      color: 'var(--jn-red-deep)',
      value: ri.affection || 0,
      start: 0,
      end: 90,
      active: !hideAffection,
      hiddenReason: hideAffection ? '直系亲属默认隐藏姻缘轴' : '',
    },
    {
      key: 'trust',
      baselineKey: 'trust',
      label: labels.trust || '信任',
      stage: ri.axisStages.trust,
      color: 'var(--jn-blue-deep)',
      value: ri.trust || 0,
      start: 180,
      end: 270,
      active: true,
    },
    { ...serviceAxis, start: 90, end: 180 },
  ];
}

function relationStageDisplay(stage) {
  return stage?.label || '';
}

function relationCenterLabel(ri, c, t) {
  const hideAffection = relationShouldHideAffectionAxis(ri);
  const candidates = [
    { priority: 3, value: hideAffection ? -999 : (ri.affection ?? 0), label: hideAffection ? '' : relationStageDisplay(ri.axisStages.affection) },
    { priority: 2, value: ri.friendship ?? 0, label: relationStageDisplay(ri.axisStages.friendship) },
    { priority: 1, value: ri.score ?? 0, label: ri.typeLabel || getRelationTypeLabel?.(ri.score) },
  ].sort((a, b) => (b.value - a.value) || (b.priority - a.priority));
  for (const item of candidates) {
    if (item.label) return item.label;
  }
  return ri.typeLabel;
}

function relationSummaryStageName(stage) {
  return stage?.relationName || stage?.label || '';
}

function relationSummaryText(ri, c, t) {
  const axes = relationAxisDisplayModel(ri, c, t);
  const items = [
    [axes[0].label, relationSummaryStageName(axes[0].stage)],
    [axes[1].label, axes[1].active ? relationSummaryStageName(axes[1].stage) : ''],
    [axes[2].label, relationSummaryStageName(axes[2].stage)],
    [axes[3].label, axes[3].active ? relationSummaryStageName(axes[3].stage) : ''],
    ['综合关系', ri.compositeLabel || ''],
  ];
  return items
    .filter(([name, value]) => name && value)
    .map(([name, value]) => `${name}：${value}`)
    .join(' · ');
}

function relationArcChart(ri, c, t) {
  const cx = 86, cy = 86;
  const axes = relationAxisDisplayModel(ri, c, t);
  const scoreStr = (ri.score >= 0 ? '+' : '') + ri.score;
  const innerR = 25, outerR = 72, progressR = 76;
  const scoreR = innerR - 2;
  const scoreMag = Math.max(0, Math.min(1, Math.abs(ri.score || 0) / 100));
  const scoreFillH = scoreR * scoreMag;
  const scoreFillY = ri.score >= 0 ? cy - scoreFillH : cy;
  const scoreFillColor = ri.score >= 0 ? 'rgba(168,132,58,.34)' : 'rgba(82,122,148,.32)';
  const clipId = `rel-score-clip-${String(c.id || 'c').replace(/[^a-zA-Z0-9_-]/g, '')}-${String(t.id || 't').replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return `<div class="rel-arc-wrap" style="display:flex;flex-direction:column;align-items:center;gap:4px">
    <svg class="rel-arc-svg" viewBox="0 0 172 172" width="100%" height="174" role="img" aria-label="${escapeHtml(t.short)}关系扇形关系图">
      <defs>
        <clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${scoreR}"/></clipPath>
      </defs>
      ${axes.map(a => {
        const mid = (a.start + a.end) / 2;
        const labelPoint = relPolarPoint(cx, cy, 51, mid);
        const range = relationAxisRange(a.key);
        const rawValue = a.value ?? relationAxisSignedValue(a.key, ri);
        const value = Math.max(range.min, Math.min(range.max, rawValue));
        const zeroAngle = range.signed ? mid : a.start;
        const target = range.signed
          ? (value >= range.zero
            ? zeroAngle + (a.end - zeroAngle) * ((value - range.zero) / (range.max - range.zero || 1))
            : zeroAngle - (zeroAngle - a.start) * ((range.zero - value) / (range.zero - range.min || 1)))
          : a.start + (a.end - a.start) * ((value - range.min) / (range.max - range.min || 1));
        const clockwise = !range.signed || value >= range.zero;
        const progress = a.active ? relRingArcPath(cx, cy, progressR, zeroAngle, target, clockwise) : '';
        const progressColor = range.signed && value < range.zero ? 'rgba(107,90,76,.58)' : a.color;
        return `
          <path d="${relSectorPath(cx, cy, innerR, outerR, a.start, a.end)}" fill="${a.active ? 'rgba(255,252,242,.55)' : 'rgba(107,90,76,.06)'}" stroke="rgba(107,90,76,.2)" stroke-width="1"/>
          ${a.active ? `<path d="${relRingArcPath(cx, cy, progressR, a.start, a.end, true)}" fill="none" stroke="rgba(107,90,76,.18)" stroke-width="7" stroke-linecap="round"/>
          <path d="${relRingArcPath(cx, cy, progressR, zeroAngle, zeroAngle + 0.1, true)}" fill="none" stroke="rgba(107,90,76,.45)" stroke-width="9" stroke-linecap="round"/>` : ''}
          ${progress ? `<path d="${progress}" fill="none" stroke="${progressColor}" stroke-width="7" stroke-linecap="round"/>` : ''}
          <text x="${labelPoint.x.toFixed(1)}" y="${(labelPoint.y - 4).toFixed(1)}" text-anchor="middle" fill="${a.active ? 'var(--jn-title)' : 'var(--jn-text-dim)'}" font-size="10" font-weight="700">${escapeHtml(a.label)}</text>
          <text x="${labelPoint.x.toFixed(1)}" y="${(labelPoint.y + 10).toFixed(1)}" text-anchor="middle" fill="var(--jn-text-muted)" font-size="9">${escapeHtml(relationStageDisplay(a.stage))}</text>
        `;
      }).join('')}
      <circle cx="${cx}" cy="${cy}" r="${innerR - 2}" fill="rgba(255,252,242,.9)" stroke="rgba(107,90,76,.28)" stroke-width="1"/>
      <rect x="${cx - scoreR}" y="${scoreFillY.toFixed(1)}" width="${scoreR * 2}" height="${scoreFillH.toFixed(1)}" fill="${scoreFillColor}" clip-path="url(#${clipId})"/>
      <line x1="${cx - scoreR + 3}" y1="${cy}" x2="${cx + scoreR - 3}" y2="${cy}" stroke="rgba(107,90,76,.22)" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="${scoreR}" fill="none" stroke="rgba(107,90,76,.28)" stroke-width="1"/>
      <text x="${cx}" y="${cy - 5}" text-anchor="middle" fill="var(--jn-heading)" font-size="12" font-weight="700">${escapeHtml(relationCenterLabel(ri, c, t))}</text>
      <text x="${cx}" y="${cy + 10}" text-anchor="middle" fill="${ri.score >= 0 ? 'var(--jn-gold)' : 'var(--jn-blue-deep)'}" font-size="10">${scoreStr}</text>
    </svg>
  </div>`;
}

function buildRelationsPanel() {
  const c = CHARS[selectedIdx];
  const others = CHARS.filter(x => x.id !== c.id);
  const configured = others.filter(t => hasConfiguredRelation(c.id, t.id) || getRelationValue(c.id, t.id) !== 0);
  const list = configured.length ? configured : others;
  const hiddenAffinityTypes = relationPanelConfig().affectionVisibility?.hiddenInitTypes || [];
  return `<h3>${c.name} · 关系网络</h3>` +
    `<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin:-2px 0 8px;flex-wrap:wrap">
      <p style="font-size:10px;color:var(--jn-text-soft);margin:0">每张卡展示友谊、姻缘、信任与第四象限；姻缘可见范围由后台【关系标签】-【姻缘 Affinity】配置。当前关闭：${escapeHtml(hiddenAffinityTypes.join('、') || '无')}</p>
    </div>
    <div class="rel-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;align-items:start">` +
    list.map(t => {
      const ri = getRelationInfo(c.id, t.id);
      const scoreStr = (ri.score >= 0 ? '+' : '') + ri.score;
      return `<div class="rel-card" style="border:1px solid var(--jn-border-2);background:rgba(255,252,242,.62);border-radius:12px;padding:9px;box-shadow:0 1px 0 rgba(255,255,255,.55) inset">
        <div class="rel-head" style="display:flex;justify-content:space-between;color:var(--jn-text-muted);margin-bottom:4px">
          <span>
            <span style="display:block;color:var(--jn-title)">${escapeHtml(t.short)}</span>
          </span>
          <span style="display:flex;gap:8px;align-items:center">
            <span style="font-size:11px;color:${ri.score>=0?'var(--jn-gold)':'var(--jn-red-bright)'}">${scoreStr}</span>
          </span>
        </div>
        ${relationArcChart(ri, c, t)}
      </div>`;
    }).join('') +
    `</div>
    <p style="margin-top:8px;font-size:10px;color:var(--jn-text-soft)">好感·信任·友谊三轴构成综合分；服从为方向性轴，由身份差值初始化，不参与综合分。后台关闭的是“姻缘展示语义”，不清空底层好感数值。</p>
    ${panelFooterActionsHtml()}`;
}

function formatFurnitureActionEffects(action) {
  const parts = [];
  for (const nr of action.needRestores || []) {
    const def = getNeedDefs().find(n => n.key === nr.need);
    const rate = nr.ratePerGameMin ?? nr.ratePerSec ?? 0;
    if (def && rate) parts.push(`${def.label}+${rate}/分`);
  }
  for (const ef of action.effects || action.extraEffects || []) {
    if (ef.type === 'addState' || ef.type === 'state') parts.push(`状态:${ef.param || ef.stateId}`);
    if (ef.type === 'skillXp') parts.push(`经验:${CONFIG.skillDefs?.[ef.param || ef.skill]?.name || ef.param || ef.skill}`);
  }
  return parts.join(' · ') || '无直接数值';
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function furnitureActionDetail(tpl, action, chk) {
  const dur = action.duration ?? tpl.duration;
  const text = action.text || '按此家具默认方式使用';
  const effects = formatFurnitureActionEffects(action);
  const blocked = chk !== true && chk !== '已满' ? ` · ${chk}` : '';
  return `${text} · 时长 ${dur ?? '?'}s · ${effects}${blocked}`;
}

function buildFurnitureActionPanel(charId, instanceId, shiftKey = false) {
  const c = getChar(charId);
  const inst = getInstance(instanceId);
  const tpl = inst && getTemplate(inst.templateId);
  if (!c || !inst || !tpl) return '<h3>家具</h3><p>家具不存在</p>';
  const actions = getFurnitureActions(tpl);
  return `<h3>${escapeHtml(tpl.icon || '')} ${escapeHtml(tpl.name)} · 可做之事</h3>
    <div style="display:flex;flex-direction:column;gap:8px;max-height:calc(70vh - 120px);overflow-y:auto;padding-right:4px">
      ${actions.map(action => {
        const chk = canUseFurniture(c, inst, action);
        const ok = chk === true || chk === '已满';
        const dur = action.duration ?? tpl.duration;
        return `<button type="button" class="sys-btn furn-action-btn" data-furn="${inst.instanceId}" data-action="${escapeHtml(action.id || 'default_use')}" data-shift="${shiftKey ? '1' : ''}"
          style="text-align:left;opacity:${ok ? 1 : .45};cursor:${ok ? 'pointer' : 'not-allowed'}" ${ok ? '' : `title="${escapeHtml(chk)}"`}>
          <span style="display:block;color:var(--jn-title);font-size:12px">${escapeHtml(action.name || '使用')}</span>
          <span style="display:block;color:var(--jn-text-soft);font-size:10px;margin-top:2px">${escapeHtml(action.text || '按此家具默认方式使用')}</span>
          <span style="display:block;color:var(--jn-text-muted);font-size:10px;margin-top:3px">时长 ${dur ?? '?'}s · ${escapeHtml(formatFurnitureActionEffects(action))}${ok ? '' : ' · ' + escapeHtml(chk)}</span>
        </button>`;
      }).join('')}
    </div>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
}

function openFurnitureActionPanel(c, inst, shiftKey = false, clientX = 0, clientY = 0) {
  const tpl = getTemplate(inst.templateId);
  const actions = getFurnitureActions(tpl);
  if (actions.length <= 1 && actions[0]?.defaultAction) {
    enqueueAction(c, makeFurnitureItem(inst, actions[0]), shiftKey);
    buildUI();
    return;
  }
  openFurnitureActionMenu(c, inst, clientX, clientY, shiftKey);
}

function buildMessagePanel() {
  const rows = messageLog.slice(0, 40).map(m =>
    `<div style="margin-bottom:6px;font-size:11px;border-bottom:1px solid var(--jn-border-3);padding-bottom:4px">
      <span style="color:var(--jn-text-soft)">[第${m.day}日 ${String(m.hour).padStart(2,'0')}:${String(m.minute).padStart(2,'0')}]</span>
      <span style="color:var(--jn-text-muted);margin-left:4px">${m.type}</span><br>${m.summary}
    </div>`
  ).join('');
  return `<h3>消息中心</h3>
    <p style="font-size:10px;color:var(--jn-text-soft);margin-bottom:8px">事件总线记录（关系/互动/时间/记忆等），共 ${messageLog.length} 条</p>
    <div style="max-height:320px;overflow-y:auto">${rows || '<p style="color:var(--jn-text-soft)">暂无事件</p>'}</div>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
}

function buildSkillPanel(options = {}) {
  const c = CHARS[selectedIdx], def = getCharDef(c.id);
  const baseSkills = skillIdsForCharacter(c);
  const managementSkills = (OrderBookSystem?.managementSkillIds?.() || [])
    .filter(id => CONFIG.skillDefs?.[id]);
  const skills = [...baseSkills, ...managementSkills];
  const rows = skills.map(sid => skillRowHtml(c, sid)).join('');
  const baseRows = baseSkills.map(sid => skillRowHtml(c, sid)).join('');
  const managementRows = managementSkills.map(sid => managementSkillRowHtml(c, sid)).join('');
  return `<h3>${c.name} · 技能</h3>
    <div class="skill-panel-list" style="max-height:calc(70vh - 150px);min-height:0;overflow-y:auto;padding-right:4px">
      ${rows ? `
        <section class="skill-panel-section">
          <h4 style="font-size:12px;color:var(--jn-heading);margin:0 0 6px">人物技能</h4>
          ${baseRows || '<p style="color:var(--jn-text-soft)">暂无人物技能</p>'}
        </section>
        <section class="skill-panel-section" style="margin-top:10px">
          <h4 style="font-size:12px;color:var(--jn-heading);margin:0 0 6px">人物管理技能</h4>
          ${managementRows || '<p style="color:var(--jn-text-soft)">暂无额外管理技能</p>'}
        </section>
      ` : '<p style="color:var(--jn-text-soft)">暂无技能</p>'}
    </div>
    <div style="margin-top:10px;font-size:11px;color:var(--jn-text-soft)"><b>性格</b><br>${escapeHtml(def.personality || '')}</div>
    ${options.hideClose ? '' : panelFooterActionsHtml()}`;
}

function routineClockLabel(minute) {
  const m = ((Math.round(minute) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function routineWindowForAnchor(c, anchor) {
  if (typeof shiftedAnchorWindow === 'function') return shiftedAnchorWindow(c, anchor);
  return { from: Math.round((anchor.from || 0) * 60), to: Math.round((anchor.to || 0) * 60), effects: {} };
}

function routineAxisPct(minute) {
  const start = 3 * 60;
  const shifted = (((Math.round(minute) - start) % 1440) + 1440) % 1440;
  return Math.max(0, Math.min(100, shifted / 1440 * 100));
}

function routineSegHtml(anchor, win) {
  const from = routineAxisPct(win.from);
  const to = routineAxisPct(win.to);
  const color = anchor.id === 'night_sleep' ? 'rgba(82,122,148,.46)'
    : anchor.id?.includes('meal') || ['breakfast', 'lunch', 'dinner'].includes(anchor.id) ? 'rgba(168,132,58,.45)'
    : anchor.id?.includes('hygiene') ? 'rgba(106,143,168,.38)'
    : 'rgba(109,143,114,.38)';
  const title = `${anchor.name || anchor.id} ${routineClockLabel(win.from)}-${routineClockLabel(win.to)}`;
  const block = (left, width) =>
    `<span class="routine-seg" title="${escapeHtml(title)}" style="left:${left}%;width:${Math.max(1.5, width)}%;background:${color}"></span>`;
  if (to > from) return block(from, to - from);
  return block(from, 100 - from) + block(0, to);
}

function routineCompliance(c, anchor) {
  const factor = typeof routineHabitMultiplier === 'function' ? routineHabitMultiplier(c, anchor) : 1;
  if (anchor.id === 'night_sleep' && typeof shouldPrioritizeNightSleep === 'function' && shouldPrioritizeNightSleep(c)) return '自觉';
  if (factor >= 1.08) return '自觉';
  if (factor >= 0.82) return '勉强';
  return '抗拒';
}

function routineInfluenceText(c, anchor, win) {
  const effects = win.effects || {};
  const tags = [];
  if (anchor.habitShift === 'sleep' && effects.sleepShiftMinutes) tags.push(`睡眠偏移${effects.sleepShiftMinutes > 0 ? '+' : ''}${effects.sleepShiftMinutes}分`);
  if (anchor.id === 'morning_hygiene' && effects.hygieneWeightMultiplier !== 1) tags.push('洁净习惯');
  if (anchor.id === 'night_sleep' && effects.sleepWeightMultiplier !== 1) tags.push('睡眠习惯');
  if (anchor.id === 'morning_focus' && effects.morningFocusMultiplier !== 1) tags.push('晨间专注');
  return tags.join(' · ') || '基础作息';
}

function routineTemplateCategoryForRow(rowId) {
  if (rowId === 'skill') return 'skill';
  if (rowId === 'profession') return 'profession';
  return 'common';
}

function routineRowTitle(rowId) {
  if (rowId === 'skill') return '技能';
  if (rowId === 'profession') return '职业';
  return '需求';
}

const ROUTINE_WEEKDAY_LABELS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function routineClone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function routineCurrentWeekdayIndex() {
  const n = Number(gameDay);
  return Number.isFinite(n) ? ((Math.round(n) % 7) + 7) % 7 : 0;
}

function routineMarkDirty() {
  if (routineEditorState) routineEditorState.dirty = true;
}

function routineTraitSummary(c) {
  const ids = typeof getCharTraits === 'function' ? getCharTraits(c) : [];
  const meta = CONFIG.charSpecialtyConfig?.traitMetadata || {};
  const labels = CONFIG.charSpecialtyConfig?.traitLabels || {};
  const grouped = {};
  for (const id of ids) {
    const row = meta[id] || {};
    const category = row.category || '性格';
    const label = row.label || labels[id] || id;
    grouped[category] ||= [];
    if (!grouped[category].includes(label)) grouped[category].push(label);
  }
  const display = CharSpecialtySystem?.getDisplayTraits?.(c) || [];
  if (!Object.keys(grouped).length && display.length) grouped['性格'] = display;
  const out = Object.entries(grouped).map(([category, rows]) => `${category}：${rows.join('、')}`);
  return out.join('；') || getCharDef(c?.id)?.personality || '未设置';
}

function routineSkillSummary(c) {
  const levels = typeof getCharacterSkillLevels === 'function' ? getCharacterSkillLevels(c) : {};
  const ids = Object.keys(levels || {});
  if (!ids.length) return '未设置';
  return ids.map(id => {
    const name = CONFIG.skillDefs?.[id]?.name || id;
    const lv = levels[id];
    return lv ? `${name} Lv.${lv}` : name;
  }).join('、');
}

function routineProfessionSummary(c) {
  const rows = typeof getCharacterProfessionTags === 'function' ? getCharacterProfessionTags(c) : [];
  return rows.length ? rows.join('、') : '未设置';
}

function routineSatisfactionSummary(c, blocks = []) {
  if (!blocks.length) return { score: 100, label: '空白' };
  const scoreByState = { good: 100, warn: 72, bad: 36, locked: 50 };
  const scores = blocks.map(block => {
    const anchor = getRoutineAnchorFromProfileBlock(block);
    const state = getRoutineProfileCompliance(c, anchor)?.state || 'good';
    return scoreByState[state] ?? 80;
  });
  const score = Math.round(scores.reduce((sum, v) => sum + v, 0) / Math.max(1, scores.length));
  const label = score >= 88 ? '舒展' : score >= 70 ? '尚可' : score >= 50 ? '勉强' : '抵触';
  return { score, label };
}

function routineWeekdayOptions(active = 0) {
  return ROUTINE_WEEKDAY_LABELS.map((label, idx) =>
    `<option value="${idx}" ${idx === active ? 'selected' : ''}>${label}</option>`
  ).join('');
}

function routineStoreActiveWeekdayDraft() {
  const state = routineEditorState;
  if (!state) return;
  state.weeklyProfiles ||= {};
  const key = String(state.activeWeekday ?? routineCurrentWeekdayIndex());
  state.weeklyProfiles[key] = routineProfileFromStateProfile(state.profile);
}

function routineSwitchWeekday(nextRaw) {
  const state = routineEditorState;
  if (!state) return;
  const next = routineClamp(Number(nextRaw), 0, 6);
  if (next === state.activeWeekday) return;
  routineStoreActiveWeekdayDraft();
  const draft = state.weeklyProfiles?.[String(next)] || state.weeklyProfiles?.[next];
  state.profile = routineProfileFromStateProfile(draft || state.profile);
  state.activeWeekday = next;
  state.activeBlockIdx = null;
  state.activeRowId = 'need';
  state.templateSearch = '';
  routineRebuildAndBind();
}

function routineProfileForSave(state) {
  routineStoreActiveWeekdayDraft();
  const profile = routineProfileFromStateProfile(state.profile);
  profile.weeklyProfiles = routineClone(state.weeklyProfiles || {});
  return routineStripProjectionProfile(profile);
}

function routineEditorIsProjectionBlock(block = {}) {
  return !!(block.isRoutineProjection || ['dutyQuest', 'followRotation', 'lifePathDaily', 'professionDaily'].includes(block.sourceType));
}

function routineBlockLocked(block = {}) {
  return !!(block.isLocked || block.locked || routineEditorIsProjectionBlock(block));
}

function routineStripProjectionProfile(profile = {}) {
  const stripBlocks = blocks => (Array.isArray(blocks) ? blocks : []).filter(block => !routineEditorIsProjectionBlock(block));
  const clean = {
    ...profile,
    blocks: stripBlocks(profile.blocks),
  };
  if (clean.weeklyProfiles && typeof clean.weeklyProfiles === 'object') {
    clean.weeklyProfiles = Object.entries(clean.weeklyProfiles).reduce((acc, [weekday, row]) => {
      acc[weekday] = {
        ...row,
        blocks: stripBlocks(row?.blocks),
      };
      return acc;
    }, {});
  }
  return clean;
}

function buildRoutinePanel() {
  const c = CHARS[selectedIdx];
  if (!c) return '<h3>起居</h3><p style="color:var(--jn-text-soft)">暂无人物。</p>';
  if (!routineEditorState || routineEditorState.charId !== c.id) {
    const cfg = getRoutineGridConfig();
    const sourceProfile = routineProfileFromStateProfile(getRoutineProfileForCharacter(c));
    const activeWeekday = routineCurrentWeekdayIndex();
    const weeklyProfiles = routineClone(sourceProfile.weeklyProfiles || {});
    const weekdayProfile = weeklyProfiles[String(activeWeekday)] || weeklyProfiles[activeWeekday] || sourceProfile;
    routineEditorState = {
      charId: c.id,
      profiles: getRoutineProfilesConfig(),
      gridConfig: cfg,
      rowDefs: getRoutineRowsDefinition(),
      templates: getRoutineTemplates(),
      profile: routineProfileFromStateProfile(weekdayProfile),
      weeklyProfiles,
      activeWeekday,
      activeTemplateCategory: 'common',
      templateSearch: '',
      activeBlockIdx: null,
      activeRowId: 'need',
      dirty: false,
    };
    routineEditorState.professions = getCharacterProfessionTags(c);
    routineEditorState.skills = getCharacterSkillIds(c);
  }
  const profile = routineProfileFromStateProfile(routineEditorState.profile);
  routineEditorState.profile = profile;
  const rowDefs = (routineEditorState.rowDefs || []).length
    ? routineEditorState.rowDefs
    : [
      { id: 'need', name: '需求', icon: '◇' },
      { id: 'skill', name: '技能', icon: '◇' },
      { id: 'profession', name: '职业', icon: '◇' },
    ];
  const slotCount = routineEditorState.gridConfig?.slotsPerDay || 48;
  const slotMins = routineEditorState.gridConfig?.slotMinutes || 30;
  const axisStart = routineEditorState.gridConfig?.axisStartMinute ?? 0;
  const rowHeight = Math.max(1, 100 / Math.max(1, rowDefs.length || 1));
  const nowMin = currentMinuteOfDay();
  const axisLabels = Array.from({ length: 13 }, (_, i) => {
    const m = (axisStart + i * 4 * slotMins) % 1440;
    return `<span>${routineClockLabel(m)}</span>`;
  }).join('');
  const blocks = profile.blocks || [];
  const rowName = rowDefs.map((row, rowIndex) => `
    <div class="routine-row-bg" data-row-index="${rowIndex}" data-row-id="${escapeHtml(row.id)}" style="top:${rowHeight * rowIndex}%;height:${rowHeight}%;min-height:28px;">
      <span class="routine-row-name">${escapeHtml(row.icon || '')} ${escapeHtml(row.name || row.id)}</span>
    </div>`).join('');
  const rowMap = {};
  for (let i = 0; i < rowDefs.length; i++) rowMap[rowDefs[i].id] = i;
  const activeIdx = Number.isInteger(routineEditorState.activeBlockIdx) && routineEditorState.activeBlockIdx >= 0 && routineEditorState.activeBlockIdx < blocks.length
    ? routineEditorState.activeBlockIdx
    : null;
  const activeBlock = activeIdx == null ? null : blocks[activeIdx];
  const activeRowId = activeBlock?.rowId || routineEditorState.activeRowId || rowDefs[0]?.id || 'need';
  const activeCategory = routineTemplateCategoryForRow(activeRowId);
  const satisfaction = routineSatisfactionSummary(c, blocks);
  const blockHtml = blocks.flatMap((block, idx) => {
    const anchor = getRoutineAnchorFromProfileBlock(block);
    const rowId = anchor.rowId || block.rowId || 'need';
    const rowIndex = rowMap[rowId] ?? 0;
    const rowSpan = 1;
    const startSlot = routineClamp(Number(anchor.startSlot || block.startSlot || 0), 0, slotCount - 1);
    const durationSlots = routineClamp(Number(anchor.durationSlots || block.duration || 1), 1, routineEditorState.gridConfig?.maxSpanSlots || 16);
    const top = rowIndex * rowHeight;
    const height = Math.max(18, rowSpan * rowHeight - 6);
    const tpl = routineGetTemplateById(anchor.sourceTemplateId || block.templateId);
    const name = block.isBlank ? '空白活动' : (block.name || anchor.name || tpl?.name || '活动');
    const locked = routineBlockLocked(block);
    return routineBlockVisualSegments(startSlot, durationSlots, slotCount).map((seg, segIdx, segs) => {
      const left = seg.startSlot / slotCount * 100;
      const width = seg.durationSlots / slotCount * 100;
      return `<div class="routine-block ${idx === activeIdx ? 'active' : ''} ${locked ? 'locked' : ''}" data-routine-block-index="${idx}" data-routine-segment-index="${segIdx}" data-row-id="${escapeHtml(rowId)}" style="left:${left}%;width:${Math.min(100, width)}%;top:${top + 3}%;height:${height}%">
        <div class="routine-block-head">${escapeHtml(name)}</div>
        ${!locked && segIdx === 0 ? '<span class="routine-handle resize-left" data-handle="left"></span>' : ''}
        ${!locked && segIdx === segs.length - 1 ? '<span class="routine-handle resize-right" data-handle="right"></span>' : ''}
      </div>`;
    });
  }).join('');
  const profileOptions = (getRoutineProfilesConfig().defaults || []).map(p =>
    `<option value="${escapeHtml(p.id)}" ${((routineEditorState.profile?.id || '') === p.id ? 'selected' : '')}>${escapeHtml(p.name || p.id)}</option>`
  ).join('');
  const sidePanel = activeBlock ? `
    <aside class="routine-side-panel">
      <div class="rt-head">
        <div>
          <div class="rt-title">${escapeHtml(routineRowTitle(activeRowId))}活动</div>
          <div class="rt-subtitle">${escapeHtml(routineClockLabel((activeBlock.startSlot || 0) * slotMins))} · 30分钟起</div>
        </div>
      </div>
      <input id="rt-template-search" class="rt-search" placeholder="搜索活动">
      <div class="routine-template-list">
        ${(routineTemplateCandidates(routineEditorState, activeCategory, routineEditorState.templateSearch || '').map(row => {
          const tpl = row.tpl;
          const selected = activeBlock.templateId === tpl.id;
          const tag = `${tpl.icon || ''} ${tpl.name || tpl.id}`;
          return `<button type="button" class="routine-template-item ${selected ? 'active' : ''}" data-template-id="${escapeHtml(tpl.id)}"><b>${escapeHtml(tag)}</b>${tpl.tooltip ? `<span>${escapeHtml(tpl.tooltip)}</span>` : ''}</button>`;
        }).join('') || '<p class="profile-empty">无匹配活动</p>')}
      </div>
    </aside>` : `
    <aside class="routine-side-panel idle">
      <div class="rt-title">活动面板</div>
      <p class="profile-empty">点击左侧任意格子创建30分钟活动。</p>
    </aside>`;
  const contextMenu = routineContextMenuState ? `
    <div id="routine-context-menu" class="routine-context-menu" style="left:${routineContextMenuState.x || 0}px;top:${routineContextMenuState.y || 0}px">
      <div class="rc-title">起居块操作</div>
      <button type="button" class="sys-btn" data-context-action="copy-nextday">复制到次日</button>
      <button type="button" class="sys-btn" data-context-action="repeat-week">设为每日重复</button>
      <button type="button" class="sys-btn" data-context-action="detail">查看详情</button>
      <button type="button" class="sys-btn" data-context-action="delete">删除</button>
    </div>` : '';
  return `<div class="routine-panel">
    <div class="routine-main-head">
      <h3>${escapeHtml(c.name)} · 起居</h3>
    </div>
    <div class="routine-summary">
      <div class="routine-card"><b>性格</b><span>${escapeHtml(routineTraitSummary(c))}</span></div>
      <div class="routine-card"><b>职业</b><span>${escapeHtml(routineProfessionSummary(c))}</span></div>
      <div class="routine-card"><b>技能</b><span>${escapeHtml(routineSkillSummary(c))}</span></div>
    </div>
    <div class="routine-satisfaction">作息满意度 <b>${satisfaction.score}%</b><span>${escapeHtml(satisfaction.label)} · 当前刻 ${escapeHtml(routineClockLabel(nowMin))}</span></div>
    <div class="routine-toolbar">
      <div class="routine-toolbar-left">
        <label class="routine-weekday-select"><span>星期日历</span><select id="routine-weekday-select">${routineWeekdayOptions(routineEditorState.activeWeekday ?? 0)}</select></label>
        <button type="button" class="sys-btn" data-routine-action="copy-yesterday">复制昨日</button>
        <button type="button" class="sys-btn" data-routine-action="apply-week">应用到本周</button>
        <select id="routine-profile-select">${profileOptions}</select>
        <button type="button" class="sys-btn" data-routine-action="apply-preset">应用模板</button>
      </div>
      <div class="routine-toolbar-right">
        <button type="button" class="sys-btn primary" data-routine-action="save">保存</button>
        <button type="button" class="sys-btn" data-routine-action="close">关闭</button>
      </div>
    </div>
    <div class="routine-workspace">
      <div class="routine-grid-shell">
        <div class="routine-axis-labels">${axisLabels}</div>
        <div class="routine-grid" id="routine-grid-canvas">
          <div class="routine-grid-rows">${rowName}</div>
          <div class="routine-block-layer">${blockHtml || ''}</div>
        </div>
      </div>
      ${sidePanel}
    </div>
    ${contextMenu}
  </div>`;
}

function openPanel(html) {
  const panel = document.getElementById('panel-content');
  panel.classList.remove('routine-panel-box', 'order-book-panel-box', 'jiafu-order-panel-box');
  panel.innerHTML = html;
  document.getElementById('panel-overlay').classList.add('open');
}

function savePanelEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function getSavePanelSnapshot() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function formatSavePanelTime(value) {
  if (!value) return '暂无存档';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '时间未知';
  return date.toLocaleString('zh-CN', { hour12: false });
}

function closeSavePanelOverlay() {
  document.getElementById('panel-overlay')?.classList.remove('open');
}

function openSavePanel(message = '') {
  const snapshot = getSavePanelSnapshot();
  const savedAt = formatSavePanelTime(snapshot?.savedAt);
  const day = snapshot?.time?.day ? `第 ${snapshot.time.day} 天` : '暂无';
  const hour = Number.isFinite(snapshot?.time?.hour) ? `${String(snapshot.time.hour).padStart(2, '0')}:00` : '暂无';
  const version = snapshot?.version ? `v${snapshot.version}` : '暂无';
  openPanel(`
    <h2>存档</h2>
    <div class="hint">进度保存在当前浏览器本地，不会上传云端；换浏览器或清缓存后需要重新开始。</div>
    ${message ? `<div style="margin:10px 0;padding:10px 12px;border-radius:12px;background:rgba(71,128,92,.13);color:#3f6f50;font-weight:700">${savePanelEscape(message)}</div>` : ''}
    <div class="admin-card">
      <h4>当前存档</h4>
      <div class="meta-grid">
        <span>保存时间</span><b>${savePanelEscape(savedAt)}</b>
        <span>游戏日期</span><b>${savePanelEscape(day)}</b>
        <span>时辰</span><b>${savePanelEscape(hour)}</b>
        <span>版本</span><b>${savePanelEscape(version)}</b>
      </div>
    </div>
    <div class="routine-actions routine-actions-bottom">
      <button class="primary" data-save-panel-action="save">保存当前进度</button>
      <button data-save-panel-action="load" ${snapshot ? '' : 'disabled'}>读取存档</button>
      <button class="danger" data-save-panel-action="clear" ${snapshot ? '' : 'disabled'}>清除存档</button>
      <button data-save-panel-action="close">关闭</button>
    </div>
  `);
  bindSavePanelEvents();
}

function bindSavePanelEvents() {
  document.querySelectorAll('[data-save-panel-action]').forEach(btn => {
    btn.onclick = () => {
      const action = btn.dataset.savePanelAction;
      if (action === 'save') {
        if (saveGameToStorage(false)) openSavePanel('已保存当前进度。');
        return;
      }
      if (action === 'load') {
        if (!confirm('读取存档会覆盖当前未保存进度，确定读取吗？')) return;
        if (loadGameFromStorage()) openSavePanel('已读取存档。');
        else openSavePanel('没有可读取的存档。');
        return;
      }
      if (action === 'clear') {
        if (!confirm('确定清除本浏览器里的存档吗？')) return;
        clearGameSave();
        openSavePanel('存档已清除。');
        return;
      }
      closeSavePanelOverlay();
    };
  });
}

function closeRoutinePanelOverlay(force = false) {
  if (!force && routineEditorState?.dirty && !window.confirm('当前起居尚未保存，确认不保存并关闭吗？')) return false;
  const overlay = document.getElementById('panel-overlay');
  if (overlay) overlay.classList.remove('open');
  document.getElementById('panel-content')?.classList.remove('routine-panel-box');
  if (routinePanelDocumentCloseHandler) {
    document.removeEventListener('click', routinePanelDocumentCloseHandler);
    routinePanelDocumentCloseHandler = null;
  }
  routineEditorState = null;
  routineDragState = null;
  routineTemplatePickerState = null;
  routineContextMenuState = null;
  return true;
}

function closeRoutineTransientPanels() {
  const changed = !!routineContextMenuState || !!routineTemplatePickerState;
  routineContextMenuState = null;
  routineTemplatePickerState = null;
  if (changed) routineRebuildAndBind();
  return changed;
}

function bindRoutinePanelDismissOnDocument() {
  if (routinePanelDocumentCloseHandler) {
    document.removeEventListener('click', routinePanelDocumentCloseHandler);
    routinePanelDocumentCloseHandler = null;
  }
  routinePanelDocumentCloseHandler = (e) => {
    const overlay = document.getElementById('panel-overlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    const panel = document.getElementById('panel-content');
    if (!panel) return;
    if (!panel.contains(e.target)) return;
    const menu = panel.querySelector('#routine-context-menu');
    const picker = panel.querySelector('#routine-template-picker');
    if ((menu && menu.contains(e.target)) || (picker && picker.contains(e.target))) return;
    closeRoutineTransientPanels();
  };
  document.addEventListener('click', routinePanelDocumentCloseHandler);
}

function routineProfileFromStateProfile(profile) {
  const safe = profile || {};
  const blocks = Array.isArray(safe.blocks) ? safe.blocks : [];
  return {
    ...safe,
    id: safe.id || `routine-${safe.name || 'custom'}`,
    name: safe.name || '起居',
    blocks: blocks.map((block, idx) => normalizeRoutineProfileBlock({
      id: block?.id || `routine_block_${idx}`,
      templateId: block?.templateId || 'routine_custom',
      startSlot: block?.startSlot ?? block?.fromSlot ?? 0,
      durationSlots: block?.durationSlots || block?.duration || 1,
      rowId: block?.rowId || block?.row || 'need',
      rowSpan: block?.rowSpan || block?.spanRows || 1,
      ...block,
    })),
    tags: Array.isArray(safe.tags) ? safe.tags : [],
  };
}

function routineClamp(v, min, max) {
  if (!Number.isFinite(v) || !Number.isFinite(min) || !Number.isFinite(max)) return min;
  return Math.max(min, Math.min(max, v));
}

function routineGetTemplateById(tplId) {
  return getRoutineTemplateById(tplId) || {};
}

function routineTemplateSearchMatch(tpl, keyword) {
  if (!keyword) return true;
  const q = keyword.toLowerCase();
  const fields = [tpl.name, tpl.id, tpl.icon, tpl.tooltip, tpl.category, tpl.templateGroup]
    .filter(Boolean)
    .map(v => String(v).toLowerCase());
  return fields.some(v => v.includes(q))
    || (tpl.requiredSkills || []).some(s => String(s).toLowerCase().includes(q))
    || (tpl.requiredProfessions || []).some(s => String(s).toLowerCase().includes(q));
}

function routineTemplateCandidates(state, category = 'common', keyword = '') {
  const templates = Array.isArray(state.templates) ? state.templates : [];
  const matchesCategory = tpl => {
    const cat = tpl.category || tpl.templateGroup || 'common';
    if (category === 'skill') return cat !== 'profession' && (cat === 'skill' || (tpl.requiredSkills || []).length);
    if (category === 'profession') return cat === 'profession';
    if (category === 'common') return cat === 'common' && !(tpl.requiredSkills || []).length;
    return cat === category;
  };
  return templates
    .filter(matchesCategory)
    .filter(tpl => routineTemplateSearchMatch(tpl, keyword))
    .map(tpl => ({ tpl }))
    .sort((a, b) => String(a.tpl.name).localeCompare(String(b.tpl.name)));
}

function routineProfileBlocks() {
  return Array.isArray(routineEditorState?.profile?.blocks) ? routineEditorState.profile.blocks : [];
}

function routineSlotCount() {
  return Math.max(1, routineEditorState?.gridConfig?.slotsPerDay || 48);
}

function routineSlotMod(slot, slotCount = routineSlotCount()) {
  return ((Math.round(Number(slot) || 0) % slotCount) + slotCount) % slotCount;
}

function routineDurationClamp(duration) {
  const slotCount = routineSlotCount();
  const maxSpan = Math.max(1, routineEditorState?.gridConfig?.maxSpanSlots || 16);
  const value = Math.round(Number(duration) || 1);
  return Math.max(1, Math.min(maxSpan, slotCount, value));
}

function routineBlockOccupiedSlots(block, slotCount = routineSlotCount()) {
  const start = routineSlotMod(block?.startSlot || 0, slotCount);
  const duration = routineDurationClamp(block?.durationSlots || block?.duration || 1);
  return Array.from({ length: duration }, (_, i) => (start + i) % slotCount);
}

function routineSlotsAvailable(startSlot, duration, ignoreIdx = -1) {
  const slotCount = routineSlotCount();
  const wanted = new Set(Array.from({ length: routineDurationClamp(duration) }, (_, i) => (routineSlotMod(startSlot, slotCount) + i) % slotCount));
  const blocks = routineProfileBlocks();
  for (let i = 0; i < blocks.length; i++) {
    if (i === ignoreIdx) continue;
    for (const slot of routineBlockOccupiedSlots(blocks[i], slotCount)) {
      if (wanted.has(slot)) return false;
    }
  }
  return true;
}

function routineAvailableDuration(startSlot, desiredDuration, ignoreIdx = -1) {
  const desired = routineDurationClamp(desiredDuration);
  let available = 0;
  for (let duration = 1; duration <= desired; duration++) {
    if (!routineSlotsAvailable(startSlot, duration, ignoreIdx)) break;
    available = duration;
  }
  return available;
}

function routineBlockVisualSegments(startSlot, durationSlots, slotCount = routineSlotCount()) {
  const start = routineSlotMod(startSlot, slotCount);
  const duration = routineDurationClamp(durationSlots);
  const first = Math.min(duration, slotCount - start);
  const rest = duration - first;
  const rows = [{ startSlot: start, durationSlots: first }];
  if (rest > 0) rows.push({ startSlot: 0, durationSlots: rest });
  return rows;
}

function routineSetBlock(idx, patch) {
  const blocks = routineProfileBlocks();
  if (idx < 0 || idx >= blocks.length) return;
  if (routineBlockLocked(blocks[idx])) {
    log('职业日课由职责/任务配置生成，不能在起居里直接修改。');
    return blocks[idx];
  }
  const next = normalizeRoutineProfileBlock({ ...blocks[idx], ...patch });
  blocks[idx] = next;
  routineEditorState.profile = { ...routineEditorState.profile, blocks };
  routineMarkDirty();
  return next;
}

function routineRemoveBlock(idx) {
  const blocks = routineProfileBlocks();
  if (idx < 0 || idx >= blocks.length) return;
  if (routineBlockLocked(blocks[idx])) {
    log('职业日课由职责/任务配置生成，不能在起居里删除。');
    routineContextMenuState = null;
    routineRebuildAndBind();
    return;
  }
  blocks.splice(idx, 1);
  routineEditorState.profile = { ...routineEditorState.profile, blocks };
  routineMarkDirty();
  if (routineEditorState.activeBlockIdx === idx) routineEditorState.activeBlockIdx = null;
  else if (routineEditorState.activeBlockIdx > idx) routineEditorState.activeBlockIdx -= 1;
  routineContextMenuState = null;
  routineRebuildAndBind();
}

function routineCreateBlankBlockAt(rowIndex = 0, startSlot = 0) {
  const state = routineEditorState;
  if (!state) return;
  const rows = state.rowDefs || [];
  const row = rows[routineClamp(rowIndex, 0, Math.max(0, rows.length - 1))] || rows[0] || { id: 'need' };
  const slotCount = state.gridConfig?.slotsPerDay || 48;
  const safeStart = routineSlotMod(startSlot, slotCount);
  const durationSlots = routineAvailableDuration(safeStart, 1, -1);
  if (durationSlots < 1) {
    log('该时段已有作息，无法重叠。');
    return;
  }
  const block = normalizeRoutineProfileBlock({
    id: `routine_blank_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    templateId: 'routine_custom',
    rowId: row.id,
    startSlot: safeStart,
    durationSlots,
    rowSpan: 1,
    isBlank: true,
  });
  const blocks = routineProfileBlocks();
  blocks.push(block);
  state.profile = { ...state.profile, blocks };
  state.activeBlockIdx = blocks.length - 1;
  state.activeRowId = row.id;
  state.templateSearch = '';
  routineMarkDirty();
  routineRebuildAndBind();
}

function routineOpenTemplatePicker(rowIndex = 0, startSlot = 0) {
  const state = routineEditorState;
  if (!state) return;
  const count = Math.max(1, (state.rowDefs || []).length);
  routineTemplatePickerState = {
    open: true,
    rowIndex: routineClamp(rowIndex, 0, count - 1),
    rowId: state.rowDefs?.[routineClamp(rowIndex, 0, count - 1)]?.id || 'need',
    startSlot: routineClamp(startSlot, 0, (state.gridConfig?.slotsPerDay || 48) - 1),
    category: state.activeTemplateCategory || 'common',
    search: state.templateSearch || '',
  };
  routineRebuildAndBind();
}

function routineApplyTemplate(templateId) {
  const state = routineEditorState;
  if (!state || !templateId) return;
  const tpl = routineGetTemplateById(templateId);
  if (!tpl?.id) return;
  const rowDefs = state.rowDefs || [];
  let idx = Number.isInteger(state.activeBlockIdx) ? state.activeBlockIdx : -1;
  const blocks = routineProfileBlocks();
  if (idx < 0 || idx >= blocks.length) {
    const row = rowDefs[stateTemplateSafeRowIdx()];
    const rowId = row?.id || rowDefs[0]?.id || 'need';
    blocks.push(normalizeRoutineProfileBlock({
      templateId: 'routine_custom',
      rowId,
      startSlot: routineTemplatePickerState?.startSlot || 0,
      durationSlots: 1,
      rowSpan: 1,
      isBlank: true,
    }));
    idx = blocks.length - 1;
    state.activeBlockIdx = idx;
  }
  const current = blocks[idx] || {};
  const rowId = current.rowId || rowDefs[stateTemplateSafeRowIdx()]?.id || 'need';
  blocks[idx] = normalizeRoutineProfileBlock({
    ...current,
    templateId: tpl.id,
    rowId,
    durationSlots: current.durationSlots || 1,
    rowSpan: 1,
    isBlank: false,
  });
  state.profile = { ...state.profile, blocks };
  routineTemplatePickerState = null;
  state.activeRowId = rowId;
  routineMarkDirty();
  routineRebuildAndBind();
}

function stateTemplateSafeRowIdx() {
  const state = routineEditorState;
  if (!state?.rowDefs?.length) return 0;
  if (routineTemplatePickerState && Number.isFinite(routineTemplatePickerState.rowIndex)) return routineClamp(routineTemplatePickerState.rowIndex, 0, state.rowDefs.length - 1);
  return 0;
}

function routineOpenContextMenu(idx, x = 0, y = 0) {
  if (!routineEditorState) return;
  routineEditorState.activeBlockIdx = idx;
  const block = routineProfileBlocks()[idx];
  if (block?.rowId) routineEditorState.activeRowId = block.rowId;
  routineContextMenuState = { open: true, idx, x, y };
  routineRebuildAndBind();
}

function routineCloseContextMenu() {
  routineContextMenuState = null;
  if (routineTemplatePickerState || routineDragState) return;
  routineRebuildAndBind();
}

function routineRestoreDefaultProfile() {
  const state = routineEditorState;
  const c = CHARS[selectedIdx];
  if (!state || !c) return;
  const cfg = getRoutineProfilesConfig();
  const defaults = cfg.defaults || [];
  const target = defaults.find(p => p.id === (cfg.defaultProfileId || 'default')) || defaults[0];
  if (!target) return;
  state.profile = routineProfileFromStateProfile(target);
  state.activeBlockIdx = null;
  state.activeRowId = 'need';
  routineMarkDirty();
  routineRebuildAndBind();
}

function routineCopyYesterday() {
  const c = CHARS[selectedIdx];
  if (!c || !routineEditorState) return;
  const last = popRoutineProfileHistory(c);
  if (!last?.profile) {
    log('昨日起居记录不存在。');
    return;
  }
  routineEditorState.profile = routineProfileFromStateProfile(last.profile);
  routineEditorState.activeBlockIdx = null;
  routineEditorState.activeRowId = 'need';
  routineMarkDirty();
  routineRebuildAndBind();
}

function routineApplyToWeek() {
  const c = CHARS[selectedIdx];
  if (!c || !routineEditorState) return;
  routineStoreActiveWeekdayDraft();
  scheduleRoutineProfileForWeek(c, routineEditorState.profile);
  log('已应用到本周。');
}

function routineRepeatTomorrow() {
  const c = CHARS[selectedIdx];
  if (!c || !routineEditorState) return;
  scheduleRoutineProfileForTomorrow(c, routineEditorState.profile);
  log('已复制到次日。');
}

function routineApplyPresetProfile() {
  const state = routineEditorState;
  const sel = document.getElementById('routine-profile-select');
  if (!state || !sel) return;
  const cfg = getRoutineProfilesConfig();
  const p = (cfg.defaults || []).find(v => v.id === sel.value);
  if (!p) return;
  state.profile = routineProfileFromStateProfile(p);
  state.activeBlockIdx = null;
  state.activeRowId = 'need';
  routineMarkDirty();
  routineRebuildAndBind();
}

function routineSaveProfile() {
  const c = CHARS[selectedIdx];
  if (!c || !routineEditorState) return;
  const profile = routineProfileForSave(routineEditorState);
  setRoutineProfileForCharacter(c, profile);
  routineEditorState.profile = routineProfileFromStateProfile(profile);
  routineEditorState.dirty = false;
  log(`已保存 ${c.name} 的起居配置。`);
  buildUI();
  closeRoutinePanelOverlay(true);
}

function routineRenderBlockPosition(blockEl, block) {
  const state = routineEditorState;
  if (!blockEl || !block || !state) return;
  const rows = state.rowDefs || [];
  const rowMap = {};
  for (let i = 0; i < rows.length; i++) rowMap[rows[i].id] = i;
  const slotCount = state.gridConfig?.slotsPerDay || 48;
  const rowHeight = Math.max(1, 100 / Math.max(1, rows.length || 1));
  const rowIndex = rowMap[block.rowId] ?? 0;
  const durationSlots = routineClamp(Number(block.durationSlots || block.duration || 1), 1, state.gridConfig?.maxSpanSlots || 16);
  const idx = Number(blockEl.dataset.routineBlockIndex || -1);
  const panel = document.getElementById('panel-content');
  const els = [...(panel?.querySelectorAll('.routine-block') || [])]
    .filter(el => Number(el.dataset.routineBlockIndex || -1) === idx);
  const segments = routineBlockVisualSegments(block.startSlot || 0, durationSlots, slotCount);
  if (els.length !== segments.length) {
    routineRebuildAndBind();
    return;
  }
  els.forEach((el, i) => {
    const seg = segments[i];
    el.style.left = `${seg.startSlot / slotCount * 100}%`;
    el.style.width = `${Math.min(100, seg.durationSlots / slotCount * 100)}%`;
    el.style.top = `${rowIndex * rowHeight + 3}%`;
    el.style.height = `${Math.max(18, rowHeight - 6)}%`;
  });
}

function routineHandleBlockPointerDown(e) {
  if (!routineEditorState) return;
  const blockEl = e.currentTarget;
  const idx = Number(blockEl.dataset.routineBlockIndex || -1);
  if (idx < 0) return;
  if (e.button === 2) {
    e.preventDefault();
    routineOpenContextMenu(idx, e.clientX, e.clientY);
    return;
  }
  if (e.button !== 0) return;
  const handle = e.target.closest('.routine-handle');
  const mode = handle ? handle.dataset.handle : 'move';
  if (mode !== 'move' && mode !== 'left' && mode !== 'right') return;
  const layer = document.querySelector('.routine-block-layer');
  const rect = layer?.getBoundingClientRect();
  if (!layer || !rect) return;
  const blocks = routineProfileBlocks();
  const block = blocks[idx];
  if (!block) return;
  const rows = routineEditorState.rowDefs || [];
  const rowMap = {};
  for (let i = 0; i < rows.length; i++) rowMap[rows[i].id] = i;
  routineEditorState.activeBlockIdx = idx;
  routineEditorState.activeRowId = block.rowId || rows[0]?.id || 'need';
  panelActiveRoutineBlock(blockEl);
  routineContextMenuState = null;
  if (routineBlockLocked(block)) {
    e.preventDefault();
    return;
  }
  routineDragState = {
    idx,
    mode,
    blockEl,
    startX: e.clientX,
    startY: e.clientY,
    startSlot: Number(block.startSlot || block.fromSlot || 0),
    startDuration: Number(block.durationSlots || block.duration || 1),
    startRowId: block.rowId || rows[0]?.id,
    startRowIndex: routineClamp(rowMap[block.rowId] || 0, 0, Math.max(0, rows.length - 1)),
    startRowSpan: Number(block.rowSpan || block.spanRows || 1),
    slotsPerDay: routineEditorState.gridConfig?.slotsPerDay || 48,
    pxPerSlot: rect.width / (routineEditorState.gridConfig?.slotsPerDay || 48),
    rowHeight: rect.height / Math.max(1, rows.length || 1),
    rowCount: rows.length,
    maxDuration: routineEditorState.gridConfig?.maxSpanSlots || 16,
  };
  e.preventDefault();
  e.stopPropagation();
  const move = evt => routineBlockPointerMove(evt);
  const up = () => {
    routineDragState = null;
    routineRebuildAndBind();
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    document.removeEventListener('pointercancel', up);
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
  document.addEventListener('pointercancel', up);
}

function panelActiveRoutineBlock(activeEl) {
  const panel = document.getElementById('panel-content');
  panel?.querySelectorAll('.routine-block.active').forEach(el => {
    if (el !== activeEl) el.classList.remove('active');
  });
  const idx = activeEl?.dataset?.routineBlockIndex;
  if (idx == null) {
    activeEl?.classList.add('active');
    return;
  }
  panel?.querySelectorAll(`.routine-block[data-routine-block-index="${idx}"]`).forEach(el => el.classList.add('active'));
}

function routineBlockPointerMove(e) {
  if (!routineDragState) return;
  const state = routineEditorState;
  const block = routineProfileBlocks()[routineDragState.idx];
  if (!state || !block) return;
  const slotsDelta = Math.round((e.clientX - routineDragState.startX) / routineDragState.pxPerSlot);
  let nextBlock = null;
  if (routineDragState.mode === 'move') {
    const nextSlot = routineSlotMod(routineDragState.startSlot + slotsDelta, routineDragState.slotsPerDay);
    const nextDuration = routineAvailableDuration(nextSlot, routineDragState.startDuration, routineDragState.idx);
    if (nextDuration >= 1) {
      nextBlock = routineSetBlock(routineDragState.idx, { startSlot: nextSlot, durationSlots: nextDuration, rowId: routineDragState.startRowId, rowSpan: 1 });
    } else {
      nextBlock = routineSetBlock(routineDragState.idx, { startSlot: routineDragState.startSlot, durationSlots: routineDragState.startDuration, rowId: routineDragState.startRowId, rowSpan: 1 });
    }
  } else if (routineDragState.mode === 'left') {
    const desiredDuration = routineClamp(routineDragState.startDuration - slotsDelta, 1, routineDragState.maxDuration);
    const nextStart = routineSlotMod(routineDragState.startSlot + slotsDelta, routineDragState.slotsPerDay);
    const nextDuration = routineAvailableDuration(nextStart, desiredDuration, routineDragState.idx);
    if (nextDuration >= 1) {
      nextBlock = routineSetBlock(routineDragState.idx, { startSlot: nextStart, durationSlots: nextDuration });
    } else {
      nextBlock = routineSetBlock(routineDragState.idx, { startSlot: routineDragState.startSlot, durationSlots: routineDragState.startDuration });
    }
  } else if (routineDragState.mode === 'right') {
    const desiredDuration = routineClamp(routineDragState.startDuration + slotsDelta, 1, routineDragState.maxDuration);
    const nextDuration = routineAvailableDuration(routineDragState.startSlot, desiredDuration, routineDragState.idx);
    if (nextDuration >= 1) {
      nextBlock = routineSetBlock(routineDragState.idx, { durationSlots: nextDuration, rowSpan: 1 });
    } else {
      nextBlock = routineSetBlock(routineDragState.idx, { startSlot: routineDragState.startSlot, durationSlots: routineDragState.startDuration, rowSpan: 1 });
    }
  }
  if (nextBlock) routineRenderBlockPosition(routineDragState.blockEl, nextBlock);
}

function routineHandleToolbar(btn) {
  const action = btn.dataset.routineAction;
  if (action === 'save') {
    routineSaveProfile();
    return;
  }
  if (action === 'restore-default') {
    routineRestoreDefaultProfile();
    return;
  }
  if (action === 'copy-yesterday') {
    routineCopyYesterday();
    return;
  }
  if (action === 'apply-week') {
    routineApplyToWeek();
    return;
  }
  if (action === 'apply-preset') {
    routineApplyPresetProfile();
    return;
  }
  if (action === 'close') {
    closeRoutinePanelOverlay();
  }
}

function routineGridDblClick(e) {
  const row = e.target.closest('.routine-row-bg');
  if (!row) return;
  const state = routineEditorState;
  if (!state) return;
  const layer = document.querySelector('.routine-block-layer');
  const rect = layer?.getBoundingClientRect();
  if (!rect) return;
  const rowIndex = Number(row.dataset.rowIndex || 0);
  const xRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const startSlot = Math.floor(xRatio * (state.gridConfig?.slotsPerDay || 48));
  routineCreateBlankBlockAt(rowIndex, startSlot);
}

function routineHandleContextMenuAction(e) {
  const btn = e.target.closest('button[data-context-action]');
  if (!btn || !routineContextMenuState) return;
  const action = btn.dataset.contextAction;
  const idx = routineContextMenuState.idx;
  if (action === 'copy-nextday') {
    routineRepeatTomorrow();
  } else if (action === 'repeat-week') {
    routineApplyToWeek();
  } else if (action === 'detail') {
    const block = routineProfileBlocks()[idx];
    if (block) {
      const anchor = getRoutineAnchorFromProfileBlock(block);
      const tpl = routineGetTemplateById(block.templateId);
      window.alert(`${tpl?.name || '活动'}\n时间：${routineClockLabel(anchor.from)}-${routineClockLabel(anchor.to)}\n行列：${anchor.rowId}`);
    }
  } else if (action === 'delete') {
    routineRemoveBlock(idx);
  }
  routineContextMenuState = null;
  routineRebuildAndBind();
}

function bindRoutinePanelEvents() {
  const panel = document.getElementById('panel-content');
  if (!panel) return;
  panel.querySelectorAll('button[data-routine-action]').forEach(btn => {
    btn.onclick = () => routineHandleToolbar(btn);
  });
  panel.querySelectorAll('.routine-row-bg').forEach(row => {
    row.onclick = routineGridDblClick;
  });
  panel.querySelectorAll('.routine-block').forEach(block => {
    block.addEventListener('pointerdown', routineHandleBlockPointerDown);
    block.addEventListener('contextmenu', e => {
      e.preventDefault();
      const idx = Number(block.dataset.routineBlockIndex || -1);
      routineOpenContextMenu(idx, e.clientX, e.clientY);
    });
  });
  panel.querySelectorAll('.routine-template-item').forEach(btn => {
    btn.onclick = () => routineApplyTemplate(btn.dataset.templateId);
  });
  panel.querySelectorAll('[data-template-category]').forEach(btn => {
    btn.onclick = () => {
      if (!routineTemplatePickerState) routineTemplatePickerState = { open: true, rowIndex: 0, rowId: 'need', startSlot: 0, search: '' };
      routineTemplatePickerState.category = btn.dataset.templateCategory;
      routineRebuildAndBind();
    };
  });
  const weekday = panel.querySelector('#routine-weekday-select');
  if (weekday) weekday.onchange = () => routineSwitchWeekday(weekday.value);
  const search = panel.querySelector('#rt-template-search');
  if (search) {
    search.value = routineEditorState?.templateSearch || '';
    search.oninput = () => {
      if (!routineEditorState) return;
      routineEditorState.templateSearch = search.value || '';
      routineRebuildAndBind();
    };
  }
  const closePicker = panel.querySelector('#rt-picker-close');
  if (closePicker) closePicker.onclick = () => {
    routineTemplatePickerState = null;
    routineRebuildAndBind();
  };
  const contextMenu = panel.querySelector('#routine-context-menu');
  if (contextMenu) {
    contextMenu.querySelectorAll('button').forEach(btn => {
      btn.onclick = routineHandleContextMenuAction;
    });
  }
  bindRoutinePanelDismissOnDocument();
}

function routineRebuildAndBind() {
  if (!routineEditorState) return;
  const overlay = document.getElementById('panel-overlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  document.getElementById('panel-content').innerHTML = buildRoutinePanel();
  bindRoutinePanelEvents();
}

function openRoutinePanel() {
  const c = CHARS[selectedIdx];
  if (!c) return;
  routineEditorState = null;
  routineTemplatePickerState = null;
  routineContextMenuState = null;
  openPanel(buildRoutinePanel());
  document.getElementById('panel-content')?.classList.add('routine-panel-box');
  bindRoutinePanelEvents();
}

function buildUI() {
  const members = FamilySystem.getCurrentMemberIds();
  const cur = CHARS[selectedIdx];
  if (!cur || !members.includes(cur.id)) {
    const firstId = FamilySystem.getFirstMemberCharId();
    const idx = firstId ? CHARS.findIndex(c => c.id === firstId) : -1;
    if (idx >= 0 && idx !== selectedIdx) {
      selectedIdx = idx;
      queuePage = 0;
      pauseCharAI(CHARS[idx]);
    }
  }
  buildStatusBar();
  buildColCurrentChar();
  buildColFamily();
  buildColQuests();
  buildActionQueue();
  if (QuestSystem.updateBadge) QuestSystem.updateBadge();
  updateGroupIssueButton();
  uiDirty = false;
}

function hitChar(mx, my) {
  const wx = mx + camX, wy = my + camY;
  for (let i = CHARS.length - 1; i >= 0; i--)
    if (Math.hypot(wx - CHARS[i].x, wy - (CHARS[i].y - 12)) < 18) return i;
  return -1;
}

function hitFurnInst(mx, my) {
  const wx = mx + camX, wy = my + camY;
  const g = pixelToGrid(wx, wy);
  const cell = WORLD[g.col]?.[g.row];
  if (cell?.entryFor) return cell.entryFor;
  const inst = getInstAt(g.col, g.row);
  return inst?.instanceId || null;
}

function handleMapClick(mx, my, shiftKey, clientX = 0, clientY = 0) {
  const c = CHARS[selectedIdx];
  const wpx = mx + camX, wpy = my + camY;
  const g = pixelToGrid(wpx, wpy);
  const cell = WORLD[g.col]?.[g.row];
  if (!cell) return;

  if (cell.entryFor) {
    const inst = getInstance(cell.entryFor);
    EventBus.emit('map:click', {
      charId: c.id, targetType: 'furniture', instanceId: inst.instanceId,
      templateId: inst.templateId, gridCol: g.col, gridRow: g.row,
    });
    openFurnitureActionPanel(c, inst, shiftKey, clientX, clientY);
    return;
  }

  const inst = getInstAt(g.col, g.row);
  if (inst) {
    EventBus.emit('map:click', {
      charId: c.id, targetType: 'furniture', instanceId: inst.instanceId,
      templateId: inst.templateId, gridCol: g.col, gridRow: g.row,
    });
    openFurnitureActionPanel(c, inst, shiftKey, clientX, clientY);
    return;
  }

  if (cell.walkable) {
    EventBus.emit('map:click', {
      charId: c.id, targetType: 'ground', gridCol: g.col, gridRow: g.row,
    });
    enqueueAction(c, makeMoveItem(g.col, g.row), shiftKey);
    buildUI();
  }
}

canvas.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouseX = (e.clientX - r.left) * (VIEW_W / r.width);
  mouseY = (e.clientY - r.top) * (VIEW_H / r.height);
  const wx = mouseX + camX, wy = mouseY + camY;
  const g = pixelToGrid(wx, wy);
  hoverCell = WORLD[g.col]?.[g.row] || null;
  hoverInst = hitFurnInst(mouseX, mouseY);
  const c = CHARS[selectedIdx];
  if (hoverCell?.walkable && c) {
    previewPath = astar(Math.round(c.gridCol), Math.round(c.gridRow), g.col, g.row, { excludeCharIds: [c.id] });
  } else previewPath = null;
  canvas.style.cursor = hoverCell?.entryFor || hoverInst ? 'pointer' : hoverCell?.walkable ? 'crosshair' : 'not-allowed';
});

const IM_CAT_ICONS = {
  _quest: '📋',
  weijie: '🤲', xujiu: '💬', lundao: '📜',
  chuanqing: '💗', tiaoxiao: '😄', zhengchi: '⚡',
};
let imMenuShiftKey = false;
let imMenuMode = 'interaction';
let imMenuGroups = [];
let imMenuAnchor = { x: 0, y: 0 };
let imMenuCatAngles = {};
let imFurnitureInstanceId = 0;
let imFurnitureDefaultHint = '';

function imSectorCenter(angleDeg, radiusPx, ringSize) {
  const a = angleDeg * Math.PI / 180;
  const r = Math.abs(radiusPx);
  const cx = ringSize / 2;
  const cy = ringSize / 2;
  return {
    px: cx + Math.sin(a) * r,
    py: cy - Math.cos(a) * r,
  };
}

/** 二级选项环布局：项多时扩环、拉半径，避免扇形按钮重叠 */
function imOptionsLayout(n, baseAngle) {
  const ringSize = Math.min(380, 228 + Math.max(0, n - 6) * 22);
  const radius = Math.min(158, 90 + Math.max(0, n - 5) * 8);
  let span, start;
  if (n <= 1) {
    span = 0;
    start = baseAngle;
  } else if (n <= 5) {
    span = Math.min(130, 36 * (n - 1));
    start = baseAngle - span / 2;
  } else if (n <= 8) {
    span = Math.min(220, 32 * (n - 1));
    start = baseAngle - span / 2;
  } else {
    span = Math.min(320, 30 * (n - 1));
    start = baseAngle - span / 2;
  }
  return { ringSize, radius, span, start };
}

function resetImRingSize() {
  const ringWrap = document.getElementById('im-ring-wrap');
  if (ringWrap) {
    ringWrap.style.width = '';
    ringWrap.style.height = '';
  }
}

function setImRingSize(ringSize) {
  const ringWrap = document.getElementById('im-ring-wrap');
  if (ringWrap) {
    ringWrap.style.width = `${ringSize}px`;
    ringWrap.style.height = `${ringSize}px`;
  }
}

function setImMenuSize(width, height) {
  const ringWrap = document.getElementById('im-ring-wrap');
  if (ringWrap) {
    ringWrap.style.width = `${width}px`;
    ringWrap.style.height = `${height}px`;
  }
}

const IM_CYCLE_VISIBLE_SLOTS = 6;
const IM_CYCLE_SUB_VISIBLE_SLOTS = 6;
const IM_CYCLE_CENTER_SLOT = 2;
const IM_CYCLE_INDEX_MARKS = ['①', '②', '③', '④', '⑤', '⑥', ''];
const IM_CYCLE_CONTAINER = { width: 460, height: 360 };
const IM_CYCLE_ARC_CENTER_X = 230;
const IM_CYCLE_ARC_CENTER_Y = 180;
const IM_CYCLE_L1_RADIUS = 118;
const IM_CYCLE_L2_RADIUS = 112;
const IM_CYCLE_ARC_ANGLE_START = -58;
const IM_CYCLE_ARC_ANGLE_END = 58;
let imMenuCurrentIndex = 1;
let imMenuSubIndex = 0;
let imMenuIsScrolling = false;

const IM_CYCLE_SLOTS = Array.from({ length: IM_CYCLE_VISIBLE_SLOTS }, (_, i) => {
  const t = i / (IM_CYCLE_VISIBLE_SLOTS - 1);
  const angle = IM_CYCLE_ARC_ANGLE_START + t * (IM_CYCLE_ARC_ANGLE_END - IM_CYCLE_ARC_ANGLE_START);
  const rad = angle * Math.PI / 180;
  return {
    x: IM_CYCLE_ARC_CENTER_X + Math.cos(rad) * IM_CYCLE_L1_RADIUS,
    y: IM_CYCLE_ARC_CENTER_Y + Math.sin(rad) * IM_CYCLE_L1_RADIUS,
    angle,
    scale: 1 - Math.abs(t - 0.5) * 0.12,
  };
});

function imWrapIndex(idx, total) {
  if (!total) return 0;
  return (idx + total) % total;
}

function calcImSubPositions(count) {
  const visible = Math.max(1, Math.min(IM_CYCLE_SUB_VISIBLE_SLOTS, count));
  const positions = [];
  const angleStep = 16;
  const startAngle = -angleStep * (visible - 1) / 2;
  for (let i = 0; i < visible; i++) {
    const t = visible <= 1 ? 0.5 : i / (visible - 1);
    const angle = startAngle + angleStep * i;
    const rad = angle * Math.PI / 180;
    positions.push({
      x: Math.cos(rad) * IM_CYCLE_L2_RADIUS,
      y: Math.sin(rad) * IM_CYCLE_L2_RADIUS,
      scale: 1 - Math.abs(t - 0.5) * 0.04,
    });
  }
  return positions;
}

function imSpriteStyle(row, side = 'left', rowHeight = 42) {
  const idx = imWrapIndex(row, 7);
  return `--sprite-x:${side};--sprite-y:${-(idx * rowHeight)}px`;
}

function imSummaryDesire(summary) {
  const score = summary?.score ?? 0.45;
  if (score >= 0.68) return { cls: 'high', text: '急' };
  if (summary?.risky || score < 0.34) return { cls: 'low', text: '可' };
  return { cls: 'medium', text: '愿' };
}

function imDefaultCategoryReason(catId, catName) {
  const map = {
    weijie: '看你心事重重，想宽慰你几句',
    xujiu: '天气正好，不如闲谈片刻',
    lundao: '近来有所悟，想与你论艺',
    chuanqing: '有些话，想当面说与你听',
    tiaoxiao: '心情甚好，想与你玩笑几句',
    zhengchi: '此事我绝不退让',
  };
  return map[catId] || `想与你${catName || '互动'}片刻`;
}

function resolveImAvatarSrc(c) {
  const direct = c?.avatar || c?.avatarUrl || c?.portrait || c?.portraitUrl || c?.headIcon || c?.headImage
    || c?.image || c?.img || c?.sprite || c?.spriteUrl || c?.spriteSrc || c?.avatarPath || c?.portraitPath
    || c?.profile?.avatar || c?.profile?.portrait || c?.profile?.avatarUrl || c?.profile?.portraitUrl || '';
  if (direct) return direct;
  if (typeof document === 'undefined' || !c) return '';
  const extractUrl = (value = '') => {
    const m = String(value).match(/url\(["']?([^"')]+)["']?\)/);
    return m?.[1] || '';
  };
  const cssEscape = (v) => (window.CSS?.escape ? CSS.escape(String(v)) : String(v).replace(/"/g, '\\"'));
  const idSel = c.id ? `[data-char-id="${cssEscape(c.id)}"],[data-cid="${cssEscape(c.id)}"],[data-id="${cssEscape(c.id)}"]` : '';
  const roots = idSel ? [...document.querySelectorAll(idSel)] : [];
  const label = c.short || c.name || '';
  if (!roots.length && label) {
    roots.push(...[...document.querySelectorAll('.char-token,.char-card,.portrait-card,.profile-card,.party-slot,.avatar-wrap')]
      .filter(el => el.textContent?.includes(label)));
  }
  for (const root of roots) {
    const img = root.matches?.('img') ? root : root.querySelector?.('img');
    if (img?.src) return img.src;
    const bg = extractUrl(getComputedStyle(root).backgroundImage);
    if (bg) return bg;
    const childBg = [...root.querySelectorAll?.('*') || []]
      .map(el => extractUrl(getComputedStyle(el).backgroundImage))
      .find(Boolean);
    if (childBg) return childBg;
  }
  return '';
}

function setInteractionMenuAvatar(c) {
  const img = document.getElementById('im-avatar-img');
  const fallback = document.getElementById('im-avatar-fallback');
  if (!img || !fallback) return;
  const src = resolveImAvatarSrc(c);
  const label = c?.short || c?.name || c?.id || '人';
  fallback.textContent = String(label).slice(0, 2);
  if (src) {
    img.hidden = false;
    fallback.hidden = true;
    img.onerror = () => {
      img.hidden = true;
      fallback.hidden = false;
    };
    img.src = src;
  } else {
    img.removeAttribute('src');
    img.hidden = true;
    fallback.hidden = false;
  }
}

const IM_NEGATIVE_STATE_IDS = ['ganshang', 'heartbroken', 'awkward', 'sullenAnger', 'angry', 'offended', 'chikuang'];
const IM_WARM_STATE_IDS = ['joyful', 'elated', 'teaHeart', 'tipsySocial', 'secretCrush'];

function imHasAnyState(c, ids) {
  if (!Array.isArray(c?.activeStates)) return false;
  return c.activeStates.some(s => ids.includes(s.id));
}

function imRelationScore(a, b) {
  return (a && b && typeof getRelationValue === 'function') ? getRelationValue(a.id, b.id) : 0;
}

function imCategoryContextBoost(catId, initiator, target) {
  const rel = imRelationScore(initiator, target);
  const targetNeedsCare = imHasAnyState(target, IM_NEGATIVE_STATE_IDS);
  const targetWarm = imHasAnyState(target, IM_WARM_STATE_IDS);
  const initiatorWarm = imHasAnyState(initiator, IM_WARM_STATE_IDS);
  let score = 0;
  const reasons = [];

  if (catId === 'weijie') {
    if (targetNeedsCare) { score += 0.42; reasons.push('对方状态需要宽慰'); }
    if (rel >= 35) score += 0.12;
    if (targetWarm) score -= 0.08;
  } else if (catId === 'xujiu') {
    score += 0.12;
    if (rel < 20) score += 0.08;
  } else if (catId === 'lundao') {
    if (rel >= 0) score += 0.10;
    if (typeof getSkillLevel === 'function' && getSkillLevel(initiator, 'poetry') >= 2) score += 0.10;
  } else if (catId === 'chuanqing') {
    if (rel >= 70) { score += 0.38; reasons.push('关系亲近'); }
    else if (rel >= 45) score += 0.18;
    if (targetWarm || initiatorWarm || imHasAnyState(target, ['heartbroken', 'secretCrush'])) score += 0.16;
  } else if (catId === 'tiaoxiao') {
    if (rel >= 45) score += 0.26;
    else if (rel >= 20) score += 0.12;
    if (targetNeedsCare) score -= 0.18;
  } else if (catId === 'zhengchi') {
    if (rel < -15) { score += 0.22; reasons.push('关系紧张'); }
    if (imHasAnyState(target, ['angry', 'offended', 'sullenAnger'])) { score += 0.32; reasons.push('对方已有火气'); }
  }
  return { score, reasons };
}

function imCategoryProtocol(cat, initiator, target) {
  if (!cat || !initiator || !target || cat.id === '_quest') return null;
  if (!IdentityProtocolSystem?.evaluateProtocolBehavior) return null;
  return IdentityProtocolSystem.evaluateProtocolBehavior(initiator, target, {
    actionType: 'interaction', category: cat.name, contactType: 'none',
  });
}

function imItemUsable(item) {
  return item && item.ok !== false && item.ok !== 0;
}

function summarizeImCategoryGroup(group, initiator, target, index = 0) {
  const items = group.items || [];
  const usable = items.filter(imItemUsable);
  const dominant = usable.length
    ? [...usable].sort((a, b) => ((b.willingness?.strength ?? 0) - (a.willingness?.strength ?? 0)))[0]
    : null;
  const dominantLow = dominant?.ok === 'low';
  const dominantRisky = !!dominant?.risky;
  const maxWill = items.reduce((best, item) => {
    const w = item.willingness?.strength;
    return Math.max(best, Number.isFinite(w) ? w : 0);
  }, 0.28);
  const context = imCategoryContextBoost(group.cat.id, initiator, target);
  const protocol = imCategoryProtocol(group.cat, initiator, target);
  const behavior = protocol?.behavior || 'allowed';
  const protocolRisk = ['conditional', 'risky', 'forbidden'].includes(behavior);
  let score = (usable.length ? 0.16 : -0.12) + maxWill * 0.62 + context.score;
  if (behavior === 'allowed') score += 0.04;
  if (behavior === 'conditional') score -= 0.04;
  if (behavior === 'risky') score -= 0.10;
  if (behavior === 'forbidden') score -= 0.22;
  score = Math.max(0, Math.min(1.25, score));

  const severeProtocolRisk = ['risky', 'forbidden'].includes(behavior);
  const risky = dominantLow || dominantRisky || severeProtocolRisk || !usable.length;
  const hot = usable.length > 0 && score >= 0.68;
  const reasonParts = [...context.reasons];
  if (severeProtocolRisk && protocol?.reason) reasonParts.push(protocol.reason);
  else if (dominantRisky) reasonParts.push('主选项有逾矩风险');
  else if (dominantLow) reasonParts.push('主选项意愿偏低');
  else if (!usable.length) reasonParts.push('当前不太合适');
  return {
    index,
    score,
    risky,
    hot,
    muted: !usable.length,
    badge: hot && risky ? '荐·险' : hot ? '荐' : risky ? '险' : '',
    reason: reasonParts.join('；'),
  };
}

function sortImCategoryGroups(groups, initiator, target) {
  return groups
    .map((group, index) => ({ ...group, summary: summarizeImCategoryGroup(group, initiator, target, index) }))
    .sort((a, b) => (b.summary.score - a.summary.score) || (a.summary.index - b.summary.index));
}

function positionInteractionMenu() {
  const menu = document.getElementById('interaction-menu');
  const ring = document.getElementById('im-ring-wrap');
  const pad = 8;
  menu.style.visibility = 'hidden';
  const w = ring.offsetWidth;
  const h = ring.offsetHeight;
  let left = imMenuAnchor.x - w / 2;
  let top = imMenuAnchor.y - h / 2;
  left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
  top = Math.max(pad, Math.min(top, window.innerHeight - h - pad));
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.visibility = '';
}

function renderImCategories() {
  const menu = document.getElementById('interaction-menu');
  const sectors = document.getElementById('im-sectors');
  imMenuMode = 'interaction';
  imFurnitureInstanceId = 0;
  menu.classList.remove('im-options', 'im-quest', 'im-furniture');
  imMenuCatAngles = {};
  setImMenuSize(IM_CYCLE_CONTAINER.width, IM_CYCLE_CONTAINER.height);

  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];
  setInteractionMenuAvatar(target);
  const rows = imMenuGroups
    .map((group, index) => ({ ...group, summary: summarizeImCategoryGroup(group, initiator, target, index) }));
  const total = rows.length;
  if (!total) {
    document.getElementById('im-hint').textContent = '暂无可互动';
    sectors.innerHTML = '';
    requestAnimationFrame(() => positionInteractionMenu());
    return;
  }
  imMenuCurrentIndex = imWrapIndex(imMenuCurrentIndex, total);

  let activeReason = '选一类互动';
  sectors.innerHTML = IM_CYCLE_SLOTS.map((slot, slotIdx) => {
    const offset = slotIdx - IM_CYCLE_CENTER_SLOT;
    const dataIdx = imWrapIndex(imMenuCurrentIndex + offset, total);
    const group = rows[dataIdx];
    const { cat } = group;
    const summary = group.summary;
    const active = offset === 0;
    const desire = imSummaryDesire(summary);
    imMenuCatAngles[cat.id] = slot.angle;
    if (active) {
      activeReason = summary?.reason || imDefaultCategoryReason(cat.id, cat.name);
    }
    const cls = `${active ? ' active' : ''}${summary?.muted ? ' im-cat-muted' : ''}`;
    const title = summary?.reason ? `${cat.name} · ${summary.reason}` : cat.name;
    const subTotal = group.items.length;
    const subVisibleCount = Math.min(IM_CYCLE_SUB_VISIBLE_SLOTS, subTotal);
    imMenuSubIndex = imWrapIndex(imMenuSubIndex, Math.max(1, subTotal));
    const subPositions = active ? calcImSubPositions(subVisibleCount) : [];
    const subCenterSlot = Math.floor(subVisibleCount / 2);
    const subMenu = active ? Array.from({ length: subVisibleCount }, (_, slotIdx) => {
      const itemIdx = imWrapIndex(imMenuSubIndex + slotIdx - subCenterSlot, subTotal);
      const { tpl, ok, reason, risky, riskHint, riskMeta } = group.items[itemIdx];
      const disabled = ok === false || ok === 0;
      const hasLlm = !disabled && initiator && target
        && InteractionLlmSystem?.shouldUse?.(initiator, target, tpl);
      const isRisky = !disabled && !!risky;
      const isAxisSafe = !disabled && !!riskMeta?.servantAxisRelief?.ok;
      const pos = subPositions[slotIdx] || { x: IM_CYCLE_L2_RADIUS, y: 0, scale: 1 };
      const isSubActive = slotIdx === subCenterSlot;
      const optCls = `${isSubActive ? ' sub-active' : ''}${disabled ? ' disabled' : ''}${hasLlm ? ' im-llm-opt' : ''}${isAxisSafe ? ' im-axis-safe' : ''}`;
      let hint = disabled ? reason : tpl.name;
      if (!disabled && hasLlm) hint += ' · 模型生成对白';
      if (!disabled && !isRisky && riskHint) hint = `${tpl.name} · ${riskHint}`;
      if (isRisky && riskHint) hint = `${tpl.name} · ⚠ ${riskHint}`;
      return `<button type="button" class="sub-menu-item${optCls}"
        onpointerdown="handleInteractionMenuSectorClick(event)"
        data-iid="${tpl.id}" data-sub-index="${itemIdx}" data-sub-active="${isSubActive ? '1' : '0'}"
        style="left:${pos.x}px;top:${pos.y}px;transform:translate(-50%, -50%) scale(${pos.scale});${imSpriteStyle(itemIdx, 'right', 36)}" title="${escapeAttr(hint)}">
        ${escapeHtml(tpl.name)}
        ${isAxisSafe ? '<span class="im-axis-badge">合礼</span>' : ''}
        ${disabled ? `<span class="im-reason">${escapeHtml(reason || '不可用')}</span>` : ''}
      </button>`;
    }).join('') : '';
    return `<div class="im-sector menu-item${cls}" role="button" tabindex="0" data-cat="${cat.id}" data-cycle-index="${dataIdx}" data-active="${active ? '1' : '0'}"
      onpointerdown="handleInteractionMenuSectorClick(event)"
      style="left:${slot.x}px;top:${slot.y}px;transform:translate(-50%, -50%) scale(${slot.scale});${imSpriteStyle(dataIdx, 'left')};--will:${(summary?.score ?? 0.5).toFixed(2)}" title="${escapeAttr(title)}">
      <div class="im-sector-inner menu-item-inner">
        <span class="item-index">${IM_CYCLE_INDEX_MARKS[dataIdx] || ''}</span>
        <span class="item-name">${escapeHtml(cat.name)}</span>
        <div class="desire-seal ${desire.cls}">${desire.text}</div>
        <div class="sub-menu">${subMenu}</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('im-hint').textContent = activeReason;

  requestAnimationFrame(() => positionInteractionMenu());
}

function handleImCycleWheel(e) {
  if (imMenuMode !== 'interaction' || !imMenuGroups.length) return;
  e.preventDefault();
  if (imMenuIsScrolling) return;
  imMenuIsScrolling = true;
  const dir = e.deltaY > 0 ? 1 : -1;
  const activeGroup = imMenuGroups[imWrapIndex(imMenuCurrentIndex, imMenuGroups.length)];
  if (e.target?.closest?.('.sub-menu, .sub-menu-item') && (activeGroup?.items?.length || 0) > IM_CYCLE_SUB_VISIBLE_SLOTS) {
    imMenuSubIndex = imWrapIndex(imMenuSubIndex + dir, activeGroup.items.length);
  } else {
    imMenuCurrentIndex = imWrapIndex(imMenuCurrentIndex + dir, imMenuGroups.length);
    imMenuSubIndex = 0;
  }
  renderImCategories();
  setTimeout(() => { imMenuIsScrolling = false; }, 150);
}

function setFurnitureMenuHint(text) {
  const hint = document.getElementById('im-hint');
  if (hint) hint.textContent = text || imFurnitureDefaultHint || '选择动作';
}

function renderFurnitureActions(inst) {
  const c = CHARS[selectedIdx];
  const tpl = getTemplate(inst.templateId);
  const actions = getFurnitureActions(tpl);
  const menu = document.getElementById('interaction-menu');
  const sectors = document.getElementById('im-sectors');
  imMenuMode = 'furniture';
  imFurnitureInstanceId = inst.instanceId;
  imFurnitureDefaultHint = '悬停看详情';
  menu.classList.add('im-options', 'im-furniture');
  menu.classList.remove('im-quest');
  document.getElementById('im-target').textContent = `${tpl.icon || ''}${tpl.name}`;
  setFurnitureMenuHint(imFurnitureDefaultHint);

  const n = actions.length;
  const { ringSize, radius, span, start } = imOptionsLayout(n, -90);
  setImRingSize(ringSize);
  sectors.innerHTML = actions.map((action, i) => {
    const chk = canUseFurniture(c, inst, action);
    const ok = chk === true || chk === '已满';
    const angle = n === 1 ? -90 : start + (span / Math.max(1, n - 1)) * i;
    const { px, py } = imSectorCenter(angle, radius, ringSize);
    const detail = furnitureActionDetail(tpl, action, chk);
    const cls = ok ? '' : ' disabled';
    return `<button type="button" class="im-sector im-opt-sector furn-im-sector${cls}"
      onpointerdown="handleInteractionMenuSectorClick(event)"
      onclick="handleInteractionMenuSectorClick(event)"
      onpointerenter="setFurnitureMenuHint(this.dataset.detail)"
      onpointerleave="setFurnitureMenuHint('')"
      onmouseover="setFurnitureMenuHint(this.dataset.detail)"
      onmouseout="setFurnitureMenuHint('')"
      data-furn="${inst.instanceId}"
      data-furn-action="${escapeAttr(action.id || 'default_use')}"
      data-detail="${escapeAttr(detail)}"
      style="--px:${px}px;--py:${py}px;left:${px}px;top:${py}px;transform:translate(-50%, -50%)"
      title="${escapeAttr(detail)}">
      <span class="im-sector-inner">
        <span class="im-sector-label">${escapeHtml(action.name || '使用')}</span>
        ${ok ? '' : `<span class="im-reason">${escapeHtml(chk)}</span>`}
      </span>
    </button>`;
  }).join('');

  requestAnimationFrame(() => positionInteractionMenu());
}

function renderImQuestOptions() {
  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];
  const menu = document.getElementById('interaction-menu');
  const sectors = document.getElementById('im-sectors');
  menu.classList.add('im-options', 'im-quest');
  document.getElementById('im-hint').textContent = '点名传令';

  const items = (QuestIssueSystem?.getAvailableQuests?.(initiator, target) || [])
    .flatMap(g => g.items);
  const n = items.length;
  if (!n) {
    setImRingSize(180);
    document.getElementById('im-hint').textContent = '暂无可传令';
    sectors.innerHTML = `<button type="button" class="im-sector im-opt-sector disabled"
      onpointerdown="handleInteractionMenuSectorClick(event)"
      style="--px:90px;--py:90px;left:90px;top:90px;transform:translate(-50%, -50%)" title="当前没有可下发任务">
      <span class="im-sector-inner">
        <span class="im-sector-label">不可传令</span>
        <span class="im-quest-hint">暂无任务</span>
      </span>
    </button>`;
    requestAnimationFrame(() => positionInteractionMenu());
    return;
  }
  const baseAngle = imMenuCatAngles._quest ?? -90;
  const { ringSize, radius, span, start } = imOptionsLayout(n, baseAngle);
  setImRingSize(ringSize);

  sectors.innerHTML = items.map(({ tpl, reason }, i) => {
    const angle = n === 1 ? baseAngle : start + (span / (n - 1)) * i;
    const { px, py } = imSectorCenter(angle, radius, ringSize);
    const hint = reason ? `${tpl.name} · ${reason}` : tpl.name;
    return `<button type="button" class="im-sector im-opt-sector im-quest-sector"
      onpointerdown="handleInteractionMenuSectorClick(event)"
      data-qid="${tpl.id}" style="--px:${px}px;--py:${py}px;left:${px}px;top:${py}px;transform:translate(-50%, -50%)" title="${hint}">
      <span class="im-sector-inner">
        <span class="im-sector-label">${tpl.name}</span>
        ${reason ? `<span class="im-quest-hint">${reason}</span>` : ''}
      </span>
    </button>`;
  }).join('');

  requestAnimationFrame(() => positionInteractionMenu());
}

function renderImOptions(catId) {
  const idx = imMenuGroups.findIndex(g => g.cat.id === catId);
  if (idx >= 0) {
    imMenuCurrentIndex = idx;
    renderImCategories();
  }
}

function handleInteractionMenuSectorClick(e) {
  const sectors = document.getElementById('im-sectors');
  const btn = e.target.closest('.sub-menu-item') || e.target.closest('.im-sector');
  if (!btn || !sectors.contains(btn)) return;
  if (btn.classList.contains('im-blank') || btn.dataset.cat === '_blank') {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  if (btn.dataset.consumed === '1') {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  if (btn.classList.contains('disabled')) {
    const reason = btn.querySelector('.im-reason')?.textContent?.trim()
      || btn.querySelector('.im-quest-hint')?.textContent?.trim()
      || btn.title
      || '当前不可用';
    showActionBlocked(CHARS[selectedIdx], reason, 'interaction');
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  e.preventDefault();
  e.stopPropagation();

  if (btn.dataset.cat && imMenuMode === 'interaction') {
    const nextIndex = Number(btn.dataset.cycleIndex);
    if (Number.isFinite(nextIndex) && nextIndex !== imMenuCurrentIndex) {
      imMenuCurrentIndex = imWrapIndex(nextIndex, imMenuGroups.length);
      imMenuSubIndex = 0;
      renderImCategories();
    }
    return;
  }

  if (btn.dataset.furnAction) {
    const cur = CHARS[selectedIdx];
    const pickedInst = getInstance(+btn.dataset.furn);
    const tpl = pickedInst && getTemplate(pickedInst.templateId);
    const action = getFurnitureActions(tpl).find(a => String(a.id || 'default_use') === btn.dataset.furnAction);
    if (!cur || !pickedInst || !tpl || !action) {
      closeInteractionMenu();
      return;
    }
    const chk = canUseFurniture(cur, pickedInst, action);
    if (chk !== true && chk !== '已满') {
      showActionBlocked(cur, chk, 'furniture');
      setFurnitureMenuHint(chk);
      return;
    }
    btn.dataset.consumed = '1';
    enqueueAction(cur, makeFurnitureItem(pickedInst, action), imMenuShiftKey);
    closeInteractionMenu();
    buildUI();
    return;
  }

  if (btn.dataset.cat) {
    if (btn.dataset.cat === '_quest') {
      const targetIdx = menuTargetIdx;
      closeInteractionMenu();
      openCommandPanel({ targetIdx });
    }
    else renderImOptions(btn.dataset.cat);
    return;
  }

  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];
  if (!initiator || !target) {
    closeInteractionMenu();
    return;
  }

  const qid = +btn.dataset.qid;
  if (qid) {
    QuestIssueSystem.issueTo(initiator, target, qid);
    closeInteractionMenu();
    buildUI();
    return;
  }

  const tpl = getInteractionTemplate(+btn.dataset.iid) || getInteractionTemplate(btn.dataset.iid);
  if (!tpl) return;
  btn.dataset.consumed = '1';
  btn.classList.add('is-clicked');
  enqueueAction(initiator, makeInteractionItem(initiator, target, tpl), imMenuShiftKey);
  closeInteractionMenu();
  buildUI();
}

function openFurnitureActionMenu(c, inst, clientX, clientY, shiftKey) {
  if (!c || !inst) return;
  imMenuMode = 'furniture';
  imMenuShiftKey = !!shiftKey;
  imMenuAnchor = { x: clientX || window.innerWidth / 2, y: clientY || window.innerHeight / 2 };
  imMenuGroups = [];
  imMenuCatAngles = {};
  imFurnitureInstanceId = inst.instanceId;
  const menu = document.getElementById('interaction-menu');
  menu.onwheel = null;
  menu.classList.add('open');
  renderFurnitureActions(inst);
  requestAnimationFrame(() => positionInteractionMenu());
}

function openInteractionMenu(targetIdx, clientX, clientY, shiftKey) {
  const initiator = CHARS[selectedIdx];
  const target = CHARS[targetIdx];
  if (!initiator || !target || initiator.id === target.id) return;
  imMenuMode = 'interaction';
  menuTargetIdx = targetIdx;
  imMenuShiftKey = !!shiftKey;
  imMenuAnchor = { x: clientX, y: clientY };
  imMenuGroups = getAvailableInteractions(initiator, target);
  imMenuCurrentIndex = Math.min(1, Math.max(0, imMenuGroups.length - 1));
  imMenuSubIndex = 0;
  const canQuest = QuestIssueSystem?.canIssueAny?.(initiator, target);
  if (!imMenuGroups.length && !canQuest) {
    const gate = QuestIssueSystem?.issuerMayIssueTo?.(initiator.id, target.id);
    log(gate?.reason || '礼法不合，无可行互动');
    return;
  }

  document.getElementById('im-target').textContent = target.short;
  setInteractionMenuAvatar(target);

  const menu = document.getElementById('interaction-menu');
  menu.onwheel = handleImCycleWheel;
  menu.classList.add('open');
  renderImCategories();
  requestAnimationFrame(() => positionInteractionMenu());
}

function openQuestIssueMenu(targetIdx, clientX, clientY, shiftKey) {
  const initiator = CHARS[selectedIdx];
  const target = CHARS[targetIdx];
  if (!QuestIssueSystem?.canIssueAny?.(initiator, target)) {
    const gate = QuestIssueSystem?.issuerMayIssueTo?.(initiator?.id, target?.id);
    showActionBlocked(initiator, gate?.reason || '当前不可传令', 'quest');
    return;
  }
  openCommandPanel({ targetIdx });
}

function closeInteractionMenu() {
  const menu = document.getElementById('interaction-menu');
  menu.onwheel = null;
  menu.classList.remove('open', 'im-options', 'im-quest', 'im-furniture');
  resetImRingSize();
  document.getElementById('im-target').textContent = '—';
  document.getElementById('im-hint').textContent = '选一类互动';
  menuTargetIdx = -1;
  imMenuMode = 'interaction';
  imMenuGroups = [];
  imMenuCatAngles = {};
  imMenuSubIndex = 0;
  imMenuIsScrolling = false;
  imFurnitureInstanceId = 0;
  imFurnitureDefaultHint = '';
}

document.getElementById('im-close').onclick = (e) => { e.stopPropagation(); closeInteractionMenu(); };
const imBackBtn = document.getElementById('im-back');
if (imBackBtn) {
  imBackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const menu = document.getElementById('interaction-menu');
    if (imMenuMode === 'furniture' || menu.classList.contains('im-furniture')) {
      closeInteractionMenu();
      return;
    }
    if (menu.classList.contains('im-options')) {
      renderImCategories();
      return;
    }
    closeInteractionMenu();
  });
}
window.addEventListener('resize', () => {
  if (document.getElementById('interaction-menu').classList.contains('open')) positionInteractionMenu();
});
document.addEventListener('click', (e) => {
  const menu = document.getElementById('interaction-menu');
  if (!menu.classList.contains('open')) return;
  if (menu.contains(e.target) || e.target === canvas) return;
  closeInteractionMenu();
});

canvas.addEventListener('click', e => {
  const r = canvas.getBoundingClientRect();
  const mx = (e.clientX - r.left) * (VIEW_W / r.width);
  const my = (e.clientY - r.top) * (VIEW_H / r.height);
  const ci = hitChar(mx, my);
  if (ci >= 0) {
    if (ci !== selectedIdx) openInteractionMenu(ci, e.clientX, e.clientY, e.shiftKey);
    return;
  }
  closeInteractionMenu();
  handleMapClick(mx, my, e.shiftKey, e.clientX, e.clientY);
});

const btnGroupIssue = document.getElementById('btn-group-issue');
if (btnGroupIssue) btnGroupIssue.onclick = () => openGroupIssuePanel();
const btnSavePanel = document.getElementById('btn-save-panel');
if (btnSavePanel) btnSavePanel.onclick = () => openSavePanel();
const btnMore = document.getElementById('btn-more');
const moreShortcuts = document.getElementById('more-shortcuts');
function setMoreShortcutsOpen(open) {
  if (!btnMore || !moreShortcuts) return;
  moreShortcuts.hidden = !open;
  btnMore.classList.toggle('active', open);
}
if (btnMore && moreShortcuts) {
  btnMore.onclick = (e) => {
    e.stopPropagation();
    setMoreShortcutsOpen(moreShortcuts.hidden);
  };
  moreShortcuts.onclick = (e) => e.stopPropagation();
  document.addEventListener('click', () => setMoreShortcutsOpen(false));
}

document.getElementById('btn-rel').onclick = () => openPanel(buildRelationsPanel());
document.getElementById('btn-profile').onclick = () => openCharacterProfilePanel();
document.getElementById('btn-routine').onclick = () => openRoutinePanel();
document.getElementById('btn-msg').onclick = () => toggleLogDrawer();
document.getElementById('btn-order').onclick = () => openJiafuOrderPanel();
document.getElementById('btn-bag').onclick = () => {
  setMoreShortcutsOpen(false);
  openPanel(`<h3>背包</h3><p style="color:var(--jn-text-soft)">暂未开放</p>${panelFooterActionsHtml()}`);
};
document.getElementById('btn-skill-panel').onclick = () => {
  setMoreShortcutsOpen(false);
  openPanel(buildSkillPanel());
};
document.getElementById('btn-help').onclick = () => openPanel(buildHelpPanel());
document.getElementById('btn-family-switch-top').onclick = () => FamilySystem.openFamilyPanel();
document.getElementById('panel-overlay').onclick = (e) => {
  if (e.target.id === 'panel-overlay') closeRoutinePanelOverlay();
};

document.addEventListener('keydown', e => {
  if (document.getElementById('admin-overlay').classList.contains('open')) return;
  const k = e.key.toLowerCase();
  if (k === 'f') { FamilySystem.openFamilyPanel(); return; }
  if (k === 'j') { QuestSystem.openQuestPanel?.(); return; }
  if (k === 'r') { openPanel(buildRelationsPanel()); return; }
  if (k === 'p') { openCharacterProfilePanel(); return; }
  if (k === 'q') { openRoutinePanel(); return; }
  if (k === 'm') { toggleLogDrawer(); return; }
  if (k === 'y') { openJiafuOrderPanel(); return; }
  if (k === 'k') { openPanel(buildSkillPanel()); return; }
  if (k === 'v') { openSavePanel(); return; }
  if (k === 'b') {
    openPanel(`<h3>背包</h3><p style="color:var(--jn-text-soft)">暂未开放</p>${panelFooterActionsHtml()}`);
    return;
  }
  if (k === 'h') { openPanel(buildHelpPanel()); return; }
  if (k === 's' && !e.ctrlKey && !e.metaKey) { openAdmin(); return; }
  const members = FamilySystem.getCurrentMemberIds();
  const n = +e.key;
  if (n >= 1 && n <= members.length) {
    const idx = CHARS.findIndex(c => c.id === members[n - 1]);
    if (idx >= 0) { selectChar(idx); buildUI(); }
  }
});
