/* ═══════════════════ UI ═══════════════════ */
const charDetailScrollById = {};
let llmToggleBusy = false;
let llmToggleMessage = '';
let questRailCollapsed = true;

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
  return `<span class="need-dot-item" title="${escapeHtml(title)}">
    <span class="need-liquid-dot ${risk}" style="--fill:${pct}%;--need-color:${escapeHtml(color)}"></span>
    <span class="need-dot-label">${escapeHtml(getNeedDisplayName(def))}</span>${valueHtml}
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
  const needHtml = getHudNeedDefs().map(n => needLiquidDotHtml(c, n)).join('');
  const states = (c.activeStates || []).map(s => {
    const cls = getStateTagClass(s.id);
    const sd = CONFIG.stateDefs[s.id];
    const name = sd?.name || s.id;
    const remain = s.remaining === -1 ? '' : s.remaining > 0 ? ` ${Math.round(s.remaining)}分` : '';
    return `<span class="tag state ${cls}" title="${escapeHtml((sd?.desc || '') + remain)}">${escapeHtml(name)}</span>`;
  }).join('');
  LifePathSystem?.initChar?.(c);
  const repTier = LifePathSystem?.getCharTier?.(c)?.title || '';
  const bestRep = ReputationDomainSystem?.getBestDomain?.(c.id);
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const role = family ? FamilySystem.getCharRole(c.id, family.id) : '';
  const rankLabel = IdentityProtocolSystem?.rankLabel?.(IdentityProtocolSystem?.getCharRank?.(c.id)) || '';
  const identityLine = [rankLabel, role, repTier].filter(Boolean).join(' · ');
  const repLine = bestRep
    ? `${bestRep.label} ${bestRep.value}`
    : `声望 ${c.reputation ?? 0}`;
  const moneyBal = MoneySystem?.getBalance?.(c) ?? 0;
  const fund = family ? Math.round(FamilySystem.getFund(family.id)) : 0;
  const moneyLine = `公库 ${fund}两 · 私库 ${Math.round(moneyBal)}两`;
  const def = getCharDef(c.id);
  const shortComment = def?.shortComment ? `<div class="char-col-comment" style="font-size:10px;color:var(--jn-text-soft);margin-top:1px">${escapeHtml(def.shortComment)}</div>` : '';
  container.innerHTML = `
    <div class="current-char-layout">
      ${currentCharArtHtml(c)}
      <div class="current-char-details">
        <div class="char-col-name">${escapeHtml(c.short)} ${getMood(c)}</div>
        ${shortComment}
        <div class="char-col-status">${escapeHtml(c.statusText || '闲庭漫步')}</div>
        <div class="hud-summary-line"><strong>${escapeHtml(identityLine || '园中人物')}</strong><span>${escapeHtml(repLine)}</span><span>${escapeHtml(moneyLine)}</span></div>
        <div class="need-dots">${needHtml}</div>
        <div class="state-tags">${states || '<span class="tag state neutral">无状态</span>'}</div>
      </div>
    </div>`;
  const newDetail = container.querySelector('.current-char-details');
  if (newDetail) newDetail.scrollTop = charDetailScrollById[c.id] || 0;
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
    const debuff = c.activeStates.some(s => getStateTagClass(s.id) === 'debuff');
    const traitHint = (CharSpecialtySystem?.getDisplayTraits?.(c) || [])[0] || '';
    const duty = dutyByCharId.get(charId);
    const dutyTitle = duty ? ` · 当值：${duty.contract.role}，点标记派任务` : '';
    return `<div class="member-av${i === selectedIdx ? ' active' : ''}${debuff ? ' has-debuff' : ''}${duty ? ' on-duty' : ''}" data-idx="${i}" title="${escapeHtml(c.name)}：${escapeHtml(c.statusText || '')}${traitHint ? ' · ' + traitHint : ''}${escapeHtml(dutyTitle)}">
      <span class="av-dot"></span>
      ${duty ? `<button type="button" class="duty-mark" data-duty-idx="${i}" title="当值：${escapeHtml(duty.contract.role)} · 点击派任务">△</button>` : ''}
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
      const rect = mark.getBoundingClientRect();
      openQuestIssueMenu(idx, rect.left + rect.width / 2, rect.top + rect.height / 2, e.shiftKey);
    };
  });
}

function skillLevelDisplay(lv) {
  const n = Number.isFinite(lv) ? lv : 0;
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, '');
}

function skillProgressPct(lv) {
  const n = Number.isFinite(lv) ? lv : 0;
  return Math.max(0, Math.min(100, (n / 5) * 100));
}

function skillRowHtml(c, sid) {
  const lv = getSkillLevel(c, sid);
  const ok = canUseSkill(c, sid);
  const def = CONFIG.skillDefs[sid] || {};
  const name = def.name || sid;
  const title = [def.desc, ok ? '' : '当前状态不可用'].filter(Boolean).join(' · ');
  return `<div class="skill-row${ok ? '' : ' blocked'}" title="${escapeHtml(title)}">
    <span class="sk-name">${escapeHtml(name)}</span>
    <span class="sk-lv">lv${skillLevelDisplay(lv)}</span>
    <span class="sk-xp"><span class="sk-xp-fill" style="display:block;width:${skillProgressPct(lv)}%"></span></span>
  </div>`;
}

function buildColSkills() {
  const c = CHARS[selectedIdx];
  const def = getCharDef(c.id);
  const skills = (def.skills || []).slice(0, 4);
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

function buildGroupIssuePanel() {
  const issuer = CHARS[selectedIdx];
  const items = QuestIssueSystem?.getAvailableGroupQuests?.(issuer) || [];
  if (!items.length) {
    return `<h3>传令全府</h3><p style="color:var(--jn-text-soft)">当前身份无可传令的群体任务，或暂无符合条件者。</p>
      <button class="sys-btn" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
  }
  const rows = items.map(({ tpl, preview, count, deadline }, i) => `
    <label class="gi-row" style="display:block;padding:8px;margin-bottom:6px;background:var(--jn-surface-deep);border:1px solid var(--jn-border-2);cursor:pointer;border-radius:6px">
      <input type="radio" name="gi-tpl" value="${tpl.id}" ${i === 0 ? 'checked' : ''} style="margin-right:6px">
      <span style="color:var(--jn-title)">${escapeHtml(tpl.name)}</span>
      <span style="color:var(--jn-text-soft);font-size:10px">（${escapeHtml(tpl.category)}${deadline ? ' · ' + deadline : ''}）</span>
      <div style="color:var(--jn-text-muted);font-size:10px;margin-top:4px;margin-left:18px">目标：${escapeHtml(preview)}（${count}人）</div>
    </label>`).join('');
  return `<h3>${issuer.short} · 传令全府</h3>
    <p style="color:var(--jn-text-soft);font-size:11px;margin-bottom:10px">择一群体差遣，将向符合条件者逐一传令。</p>
    <div class="gi-list">${rows}</div>
    <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
      <button class="sys-btn" id="gi-cancel">取消</button>
      <button class="sys-btn primary" id="gi-confirm">传令</button>
    </div>`;
}

function openGroupIssuePanel() {
  const issuer = CHARS[selectedIdx];
  if (!QuestIssueSystem?.canIssueGroupAny?.(issuer)) {
    log('你的身份不可传令全府。');
    return;
  }
  openPanel(buildGroupIssuePanel());
  const cancel = document.getElementById('gi-cancel');
  const confirm = document.getElementById('gi-confirm');
  if (cancel) cancel.onclick = () => document.getElementById('panel-overlay').classList.remove('open');
  if (confirm) confirm.onclick = () => {
    const picked = document.querySelector('input[name="gi-tpl"]:checked');
    const tid = picked ? +picked.value : 0;
    if (tid) QuestIssueSystem.issueGroupTo(issuer, tid);
    document.getElementById('panel-overlay').classList.remove('open');
    buildUI();
  };
}

function updateGroupIssueButton() {
  const btn = document.getElementById('btn-group-issue');
  if (!btn) return;
  const issuer = CHARS[selectedIdx];
  const show = QuestIssueSystem?.canIssueGroupAny?.(issuer);
  btn.style.display = show ? '' : 'none';
}

function buildHelpPanel() {
  return `<h3>帮助</h3>
    <div style="font-size:11px;color:var(--jn-text-muted);line-height:1.6">
      <p><b>操作</b>：点击地面/家具行走或使用；点击其他人物打开互动菜单（含单人「差遣」）；底栏「传令」可群体下发；Shift+点击可插队行动。</p>
      <p><b>快捷键</b>：F 切换家庭；1–9 选择家庭成员；J 任务；R 关系；P 人物；K 技能；M 日志；B 背包；S 设置；H 帮助。</p>
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
  const rows = [
    profileMetricCard('身份位阶', rankLabel, effectiveRank !== baseRank ? `原位阶：${baseLabel}` : '由身份系统判定'),
    profileMetricCard('家庭身份', role || '未入家庭', family?.name || '无家庭归属'),
    profileMetricCard('身份参考声望', identityRep?.value ?? c.reputation ?? 0, identityDomains || '按身份类型读取声望域'),
  ].join('');
  return `<section class="profile-section">
    <h4>身份与体面</h4>
    <div class="profile-metrics">${rows}</div>
  </section>`;
}

function buildProfileStatusBlock(c) {
  const needs = getHudNeedDefs().map(def => needLiquidDotHtml(c, def, { value: true })).join('');
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
  return `<section class="profile-section">
    <h4>状态与需求</h4>
    <div class="profile-path-card">
      <div class="profile-path-meta">当前：${escapeHtml(c.statusText || '闲庭漫步')} · ${escapeHtml(healthLine)}</div>
      <div class="need-dots profile-need-dots">${needs}</div>
      <div class="state-tags">${states || '<span class="tag state neutral">无状态</span>'}</div>
    </div>
  </section>`;
}

function buildProfileMoneyBlock(c) {
  const family = FamilySystem?.findFamilyOfChar?.(c.id);
  const fund = family ? Math.round(FamilySystem.getFund(family.id)) : 0;
  const personal = Math.round(MoneySystem?.getBalance?.(c) ?? 0);
  const rows = [
    profileMetricCard('公库', `${fund} 两`, family?.name || '无家庭归属'),
    profileMetricCard('私库', `${personal} 两`, '人物个人银两'),
    profileMetricCard('资源读取', '任务 / 梦想 / 职业', '背包完成后接物品与信物'),
  ].join('');
  return `<section class="profile-section">
    <h4>财产与资源</h4>
    <div class="profile-metrics">${rows}</div>
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
  const colors = ['var(--jn-gold)', 'var(--jn-green-bright)', 'var(--jn-blue-deep)', 'var(--jn-red-deep)', 'var(--jn-purple-deep)', 'var(--jn-brown)'];
  const domainRows = (repExplain?.domains || []).map((row, i) => {
    const tags = [
      (repExplain?.careerDomains || []).includes(row.id) ? '职业' : '',
      (repExplain?.identity?.domains || []).some(d => d.domain === row.id) ? '身份' : '',
    ].filter(Boolean).join(' / ');
    return `<div title="${escapeHtml(tags || '普通声望域')}">${profileBar(`${row.label}${tags ? ' · ' + tags : ''}`, row.value, 1000, colors[i % colors.length])}</div>`;
  }).join('');
  const logRows = (repExplain?.log || []).map(row => `
    <tr>
      <td>第${escapeHtml(row.day ?? '?')}日</td>
      <td>${escapeHtml(ReputationDomainSystem?.domainLabel?.(row.domain) || row.domain)}</td>
      <td style="color:${row.delta >= 0 ? 'var(--jn-green-deep)' : 'var(--jn-red-bright)'}">${row.delta > 0 ? '+' : ''}${escapeHtml(row.delta || 0)}</td>
      <td>${escapeHtml(row.reason || row.source || '—')}</td>
    </tr>`).join('');
  return `<section class="profile-section">
    <h4>分域声望</h4>
    <div class="profile-two-col">
      <div class="profile-rep-box">
        ${domainRows || '<p class="profile-empty">暂无声望域数据</p>'}
      </div>
      <div class="profile-table-wrap" style="max-height:190px">
        <table class="profile-table">
          <thead><tr><th>日期</th><th>领域</th><th>变化</th><th>原因</th></tr></thead>
          <tbody>${logRows || '<tr><td colspan="4" class="profile-empty">暂无变化记录</td></tr>'}</tbody>
        </table>
      </div>
    </div>
  </section>`;
}

function buildCharacterProfilePanel() {
  const c = CHARS[selectedIdx];
  if (!c) return '<h3>人物</h3><p style="color:var(--jn-text-soft)">暂无人物。</p>';
  LifePathSystem?.initChar?.(c);
  ReputationDomainSystem?.initChar?.(c);
  const repExplain = ReputationDomainSystem?.explain?.(c.id);
  const titleLine = [
    LifePathSystem?.getDisplayTitle?.(c),
    repExplain?.best ? `${repExplain.best.label}${repExplain.best.value}` : '',
  ].filter(Boolean).join(' · ');
  return `<div class="profile-panel">
    <div>
      <h3>${escapeHtml(c.name)} · 人物档案</h3>
      <p class="profile-subtitle">${escapeHtml(titleLine || '身份、职业与声望')}</p>
    </div>
    ${buildProfileStatusBlock(c)}
    ${buildProfileIdentityBlock(c, repExplain)}
    ${buildProfileCareerBlock(c)}
    ${buildProfileMoneyBlock(c)}
    ${buildProfileReputationBlock(c, repExplain)}
    <div class="profile-actions">
      <button class="sys-btn" id="profile-open-relations">关系网络</button>
      <button class="sys-btn" id="profile-open-life-path">路径详情</button>
      <button class="sys-btn" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>
    </div>
  </div>`;
}

function openCharacterProfilePanel() {
  openPanel(buildCharacterProfilePanel());
  const btn = document.getElementById('profile-open-life-path');
  if (btn) btn.onclick = () => LifePathSystem?.openPathPanel?.();
  const relBtn = document.getElementById('profile-open-relations');
  if (relBtn) relBtn.onclick = () => openPanel(buildRelationsPanel());
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
    el.innerHTML = '<span class="aq-empty">暂无排队行动，点击家具/地面/人物添加</span>';
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
      label: labels.affinity || '姻缘',
      stage: ri.axisStages.affection,
      color: 'var(--jn-red-deep)',
      value: ri.affection || 0,
      start: 0,
      end: 90,
      active: true,
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

function relationCenterLabel(ri) {
  const candidates = [
    { priority: 3, value: ri.affection ?? 0, label: relationStageDisplay(ri.axisStages.affection) },
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
    [axes[1].label, relationSummaryStageName(axes[1].stage)],
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
        return `
          <path d="${relSectorPath(cx, cy, innerR, outerR, a.start, a.end)}" fill="${a.active ? 'rgba(255,252,242,.55)' : 'rgba(107,90,76,.06)'}" stroke="rgba(107,90,76,.2)" stroke-width="1"/>
          ${a.active ? `<path d="${relRingArcPath(cx, cy, progressR, a.start, a.end, true)}" fill="none" stroke="rgba(107,90,76,.18)" stroke-width="7" stroke-linecap="round"/>
          <path d="${relRingArcPath(cx, cy, progressR, zeroAngle, zeroAngle + 0.1, true)}" fill="none" stroke="rgba(107,90,76,.45)" stroke-width="9" stroke-linecap="round"/>` : ''}
          ${progress ? `<path d="${progress}" fill="none" stroke="${a.color}" stroke-width="7" stroke-linecap="round"/>` : ''}
          <text x="${labelPoint.x.toFixed(1)}" y="${(labelPoint.y - 4).toFixed(1)}" text-anchor="middle" fill="${a.active ? 'var(--jn-title)' : 'var(--jn-text-dim)'}" font-size="10" font-weight="700">${escapeHtml(a.label)}</text>
          <text x="${labelPoint.x.toFixed(1)}" y="${(labelPoint.y + 10).toFixed(1)}" text-anchor="middle" fill="var(--jn-text-muted)" font-size="9">${escapeHtml(relationStageDisplay(a.stage))}</text>
        `;
      }).join('')}
      <circle cx="${cx}" cy="${cy}" r="${innerR - 2}" fill="rgba(255,252,242,.9)" stroke="rgba(107,90,76,.28)" stroke-width="1"/>
      <rect x="${cx - scoreR}" y="${scoreFillY.toFixed(1)}" width="${scoreR * 2}" height="${scoreFillH.toFixed(1)}" fill="${scoreFillColor}" clip-path="url(#${clipId})"/>
      <line x1="${cx - scoreR + 3}" y1="${cy}" x2="${cx + scoreR - 3}" y2="${cy}" stroke="rgba(107,90,76,.22)" stroke-width="1"/>
      <circle cx="${cx}" cy="${cy}" r="${scoreR}" fill="none" stroke="rgba(107,90,76,.28)" stroke-width="1"/>
      <text x="${cx}" y="${cy - 5}" text-anchor="middle" fill="var(--jn-heading)" font-size="12" font-weight="700">${escapeHtml(relationCenterLabel(ri))}</text>
      <text x="${cx}" y="${cy + 10}" text-anchor="middle" fill="${ri.score >= 0 ? 'var(--jn-gold)' : 'var(--jn-blue-deep)'}" font-size="10">${scoreStr}</text>
    </svg>
  </div>`;
}

function buildRelationsPanel() {
  const c = CHARS[selectedIdx];
  const others = CHARS.filter(x => x.id !== c.id);
  const configured = others.filter(t => hasConfiguredRelation(c.id, t.id) || getRelationValue(c.id, t.id) !== 0);
  const list = configured.length ? configured : others;
  return `<h3>${c.name} · 关系网络</h3>` +
    `<p style="font-size:10px;color:var(--jn-text-soft);margin:-2px 0 8px">每张卡展示友谊、姻缘、信任与第四象限；主仆显示服从/体恤，亲缘显示孝道/慈爱，其他先空着。</p>
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
    <p style="margin-top:8px;font-size:10px;color:var(--jn-text-soft)">好感·信任·友谊三轴构成综合分；服从为方向性轴，由身份差值初始化，不参与综合分。</p>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
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

function buildSkillPanel() {
  const c = CHARS[selectedIdx], def = getCharDef(c.id);
  const skills = def.skills || [];
  const rows = skills.map(sid => skillRowHtml(c, sid)).join('');
  return `<h3>${c.name} · 技能</h3>
    <div class="skill-panel-list" style="max-height:calc(70vh - 150px);min-height:0;overflow-y:auto;padding-right:4px">
      ${rows || '<p style="color:var(--jn-text-soft)">暂无技能</p>'}
    </div>
    <div style="margin-top:10px;font-size:11px;color:var(--jn-text-soft)"><b>性格</b><br>${escapeHtml(def.personality || '')}</div>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
}

function openPanel(html) {
  document.getElementById('panel-content').innerHTML = html;
  document.getElementById('panel-overlay').classList.add('open');
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
  xujiu: '🍵', lundao: '📜', tiaoxiao: '😄',
  weijie: '🤝', chuanqing: '💗', zhengchi: '⚡',
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
  document.getElementById('im-hint').textContent = '选一类互动';
  imMenuCatAngles = {};
  resetImRingSize();

  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];
  const displayGroups = imMenuGroups.slice();
  if (QuestIssueSystem?.canIssueAny?.(initiator, target)) {
    displayGroups.unshift({ cat: { id: '_quest', name: '差遣' }, items: [] });
  }

  const n = displayGroups.length;
  sectors.innerHTML = displayGroups.map(({ cat }, i) => {
    const angle = n ? (360 / n) * i - 90 : 0;
    imMenuCatAngles[cat.id] = angle;
    const icon = IM_CAT_ICONS[cat.id] || '◆';
    return `<button type="button" class="im-sector" data-cat="${cat.id}"
      onpointerdown="handleInteractionMenuSectorClick(event)"
      style="--angle:${angle}deg;--radius:-78px" title="${cat.name}">
      <span class="im-sector-inner">
        <span class="im-sector-icon">${icon}</span>
        <span class="im-sector-label">${cat.name}</span>
      </span>
    </button>`;
  }).join('');

  requestAnimationFrame(() => positionInteractionMenu());
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
      style="--px:${px}px;--py:${py}px"
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
  document.getElementById('im-hint').textContent = '吩咐';

  const items = (QuestIssueSystem?.getAvailableQuests?.(initiator, target) || [])
    .flatMap(g => g.items);
  const n = items.length;
  if (!n) {
    setImRingSize(180);
    document.getElementById('im-hint').textContent = '暂无可吩咐';
    sectors.innerHTML = `<button type="button" class="im-sector im-opt-sector disabled"
      onpointerdown="handleInteractionMenuSectorClick(event)"
      style="--px:90px;--py:90px" title="当前没有可下发任务">
      <span class="im-sector-inner">
        <span class="im-sector-label">不可差遣</span>
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
      data-qid="${tpl.id}" style="--px:${px}px;--py:${py}px" title="${hint}">
      <span class="im-sector-inner">
        <span class="im-sector-label">${tpl.name}</span>
        ${reason ? `<span class="im-quest-hint">${reason}</span>` : ''}
      </span>
    </button>`;
  }).join('');

  requestAnimationFrame(() => positionInteractionMenu());
}

function renderImOptions(catId) {
  const group = imMenuGroups.find(g => g.cat.id === catId);
  if (!group) return;
  const menu = document.getElementById('interaction-menu');
  const sectors = document.getElementById('im-sectors');
  menu.classList.add('im-options');

  const items = group.items;
  const enabledCount = items.filter(item => item.ok !== false && item.ok !== 0).length;
  document.getElementById('im-hint').textContent = enabledCount
    ? group.cat.name
    : `${group.cat.name} · 当前状态下暂无可用选项`;
  const n = items.length;
  const baseAngle = imMenuCatAngles[catId] ?? -90;
  const { ringSize, radius, span, start } = imOptionsLayout(n, baseAngle);
  setImRingSize(ringSize);

  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];

  sectors.innerHTML = items.map(({ tpl, ok, reason, risky, riskHint, willingness }, i) => {
    const angle = n === 1 ? baseAngle : start + (span / (n - 1)) * i;
    const { px, py } = imSectorCenter(angle, radius, ringSize);
    const isLow = ok === 'low';
    const disabled = ok === false || ok === 0;
    const hasLlm = !disabled && initiator && target
      && InteractionLlmSystem?.shouldUse?.(initiator, target, tpl);
    const isRisky = !disabled && !!risky;
    const will = willingness || (initiator && target && InteractionScoreSystem?.socialWillingness?.(initiator, target, tpl));
    const willStrength = Math.max(0.08, Math.min(1, will?.strength ?? 0.5));
    const isHot = !disabled && !isLow && willStrength >= 0.78;
    const cls = `${disabled ? ' disabled' : isLow ? ' im-warn' : isHot ? ' im-hot' : ''}${hasLlm ? ' im-llm-opt' : ''}${isRisky ? ' im-risky' : ''}`;
    let hint = disabled ? reason : tpl.name;
    if (!disabled && hasLlm) hint += ' · 模型生成对白';
    if (isRisky && riskHint) hint = `${tpl.name} · ⚠ ${riskHint}`;
    return `<button type="button" class="im-sector im-opt-sector${cls}"
      onpointerdown="handleInteractionMenuSectorClick(event)"
      data-iid="${tpl.id}" style="--px:${px}px;--py:${py}px;--will:${willStrength.toFixed(2)}" title="${escapeAttr(hint)}">
      <span class="im-sector-inner">
        <span class="im-sector-label">${tpl.name}</span>
        ${hasLlm ? '<span class="im-llm-badge" title="模型生成对白">墨</span>' : ''}
        ${isRisky ? '<span class="im-risk-badge" title="逾矩行为">⚠</span>' : ''}
        ${disabled ? `<span class="im-reason">${reason}</span>` : ''}
      </span>
    </button>`;
  }).join('');

  requestAnimationFrame(() => positionInteractionMenu());
}

function handleInteractionMenuSectorClick(e) {
  const btn = e.target.closest('.im-sector');
  const sectors = document.getElementById('im-sectors');
  if (!btn || !sectors.contains(btn)) return;
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
    if (btn.dataset.cat === '_quest') renderImQuestOptions();
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

  const tpl = getInteractionTemplate(+btn.dataset.iid);
  if (!tpl) return;
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
  const canQuest = QuestIssueSystem?.canIssueAny?.(initiator, target);
  if (!imMenuGroups.length && !canQuest) {
    const gate = QuestIssueSystem?.issuerMayIssueTo?.(initiator.id, target.id);
    log(gate?.reason || '礼法不合，无可行互动');
    return;
  }

  document.getElementById('im-target').textContent = target.short;

  const menu = document.getElementById('interaction-menu');
  menu.classList.add('open');
  renderImCategories();
  requestAnimationFrame(() => positionInteractionMenu());
}

function openQuestIssueMenu(targetIdx, clientX, clientY, shiftKey) {
  const initiator = CHARS[selectedIdx];
  const target = CHARS[targetIdx];
  openInteractionMenu(targetIdx, clientX, clientY, shiftKey);
  if (!QuestIssueSystem?.canIssueAny?.(initiator, target)) {
    const gate = QuestIssueSystem?.issuerMayIssueTo?.(initiator?.id, target?.id);
    showActionBlocked(initiator, gate?.reason || '当前不可差遣', 'quest');
    return;
  }
  renderImQuestOptions();
}

function closeInteractionMenu() {
  const menu = document.getElementById('interaction-menu');
  menu.classList.remove('open', 'im-options', 'im-quest', 'im-furniture');
  resetImRingSize();
  document.getElementById('im-target').textContent = '—';
  document.getElementById('im-hint').textContent = '选一类互动';
  menuTargetIdx = -1;
  imMenuMode = 'interaction';
  imMenuGroups = [];
  imMenuCatAngles = {};
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

document.getElementById('btn-rel').onclick = () => openPanel(buildRelationsPanel());
document.getElementById('btn-profile').onclick = () => openCharacterProfilePanel();
document.getElementById('btn-msg').onclick = () => toggleLogDrawer();
document.getElementById('btn-bag').onclick = () => openPanel('<h3>背包</h3><p style="color:var(--jn-text-soft)">暂未开放</p><button class="sys-btn" onclick="document.getElementById(\'panel-overlay\').classList.remove(\'open\')">关闭</button>');
document.getElementById('btn-skill-panel').onclick = () => openPanel(buildSkillPanel());
document.getElementById('btn-help').onclick = () => openPanel(buildHelpPanel());
document.getElementById('btn-family-switch-top').onclick = () => FamilySystem.openFamilyPanel();
document.getElementById('panel-overlay').onclick = (e) => { if (e.target.id === 'panel-overlay') e.target.classList.remove('open'); };

document.addEventListener('keydown', e => {
  if (document.getElementById('admin-overlay').classList.contains('open')) return;
  const k = e.key.toLowerCase();
  if (k === 'f') { FamilySystem.openFamilyPanel(); return; }
  if (k === 'j') { QuestSystem.openQuestPanel?.(); return; }
  if (k === 'r') { openPanel(buildRelationsPanel()); return; }
  if (k === 'p') { openCharacterProfilePanel(); return; }
  if (k === 'm') { toggleLogDrawer(); return; }
  if (k === 'k') { openPanel(buildSkillPanel()); return; }
  if (k === 'b') {
    openPanel('<h3>背包</h3><p style="color:var(--jn-text-soft)">暂未开放</p><button class="sys-btn" onclick="document.getElementById(\'panel-overlay\').classList.remove(\'open\')">关闭</button>');
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
