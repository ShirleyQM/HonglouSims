/* ═══════════════════ UI ═══════════════════ */
function selectChar(i) {
  const prev = selectedIdx;
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
  if (val < 10) return '#c0392b';
  if (val < 20) return '#e74c3c';
  if (val < 50) return '#c9a227';
  return '#27ae60';
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
  document.getElementById('status-bar').innerHTML = `
    <span class="sb-field${fade}">📍 ${escapeHtml(sceneName)}</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">📅 甲子年·${monthNum}月${month}日</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">${periodIcon} ${getShichenLabel()}·${getPeriodLabel()}</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">${SEASON_ICONS[seasonIdx]} ${getSeasonLabel()}</span>
    <span class="sb-sep">|</span>
    <span class="sb-field">${wIcon} ${gameWeather}</span>`;
}

function buildColCurrentChar() {
  const c = CHARS[selectedIdx];
  if (!c) {
    document.getElementById('col-char').innerHTML = '<div class="col-empty">无人物</div>';
    return;
  }
  const needHtml = getNeedDefs().map(n => {
    const v = Math.round(c.needs[n.key] ?? 50);
    const crit = v < 10 ? ' critical' : '';
    return `<div class="bar-row"><span class="bar-label">${n.label}</span>
      <div class="bar-track"><div class="bar-fill${crit}" style="width:${v}%;background:${needBarColor(v)}"></div></div>
      <span class="bar-val">${v}</span></div>`;
  }).join('');
  const states = (c.activeStates || []).map(s => {
    const cls = getStateTagClass(s.id);
    const sd = CONFIG.stateDefs[s.id];
    const name = sd?.name || s.id;
    const remain = s.remaining >= 999990 ? '' : s.remaining > 0 ? ` ${Math.round(s.remaining)}分` : '';
    return `<span class="tag state ${cls}" title="${escapeHtml((sd?.desc || '') + remain)}">${escapeHtml(name)}</span>`;
  }).join('');
  LifePathSystem?.initChar?.(c);
  const lp = c.lifePath ? LifePathSystem?.getPath?.(c.lifePath) : null;
  const stageTitle = LifePathSystem?.getStageTitle?.(c) || '';
  const repTier = LifePathSystem?.getCharTier?.(c)?.title || '';
  const pathLine = lp
    ? `<div class="char-col-path" style="font-size:10px;color:#a89070;margin-top:2px">${escapeHtml(lp.name)}${stageTitle ? ' · ' + escapeHtml(stageTitle) : ''}</div>`
    : '';
  const repLine = `<div class="char-col-rep" style="font-size:10px;color:#8a7355">声望 ${c.reputation ?? 0}${repTier ? ' · ' + escapeHtml(repTier) : ''}
    <button type="button" id="btn-life-path" style="margin-left:4px;font-size:9px;padding:1px 4px;cursor:pointer;background:#2a1f18;border:1px solid #5c4033;color:#c9a227;font-family:inherit">路径</button></div>`;
  const moneyBal = MoneySystem?.getBalance?.(c) ?? 0;
  const moneyLine = (c.lifePath === 'xifeng_steward' || moneyBal > 0)
    ? `<div style="font-size:10px;color:#c9a227;margin-top:2px">私银 ${moneyBal} 两</div>` : '';
  document.getElementById('col-char').innerHTML = `
    <div class="char-portrait active" style="background:${c.color}" title="${escapeHtml(c.name)}"></div>
    <div class="char-col-name">${escapeHtml(c.short)} ${getMood(c)}</div>
    <div class="char-col-status">${escapeHtml(c.statusText || '闲庭漫步')}</div>
    ${pathLine}${repLine}${moneyLine}
    <div class="need-priority bars">${needHtml}</div>
    <div class="state-tags">${states || '<span class="tag state neutral">无状态</span>'}</div>`;
  document.getElementById('btn-life-path')?.addEventListener('click', () => LifePathSystem?.openPathPanel?.());
}

function buildColFamily() {
  const fam = FamilySystem.getCurrentFamily();
  const el = document.getElementById('col-family');
  if (!fam) { el.innerHTML = '<div class="col-empty">无家庭</div>'; return; }
  const fund = Math.round(FamilySystem.getFund(fam.id));
  const memberIds = FamilySystem.getCurrentMemberIds();
  const avatars = memberIds.map(charId => {
    const i = CHARS.findIndex(c => c.id === charId);
    if (i < 0) return '';
    const c = CHARS[i];
    const role = FamilySystem.getCharRole(charId) || '';
    const debuff = c.activeStates.some(s => getStateTagClass(s.id) === 'debuff');
    return `<div class="member-av${i === selectedIdx ? ' active' : ''}${debuff ? ' has-debuff' : ''}" data-idx="${i}" title="${escapeHtml(c.name)}：${escapeHtml(c.statusText || '')}">
      <span class="av-dot"></span>
      <span class="av48" style="background:${c.color}"></span>
      <div class="av-name">${escapeHtml(c.short)}</div>
      <div class="av-role">${escapeHtml(role)}</div>
    </div>`;
  }).join('');
  el.innerHTML = `
    <div class="fam-row-header">
      <span class="fam-title">${fam.crestIcon || ''} ${escapeHtml(fam.name)}</span>
      <button type="button" id="btn-family-switch-sm" title="快捷键 F">切换家庭</button>
    </div>
    <div class="member-avatars">${avatars || '<span class="col-empty">无成员</span>'}</div>
    <div class="fam-meta-line">${escapeHtml(fam.tag || '')} · ${memberIds.length}口 · 公库 ${fund}两</div>`;
  document.getElementById('btn-family-switch-sm').onclick = () => FamilySystem.openFamilyPanel();
  el.querySelectorAll('.member-av').forEach(av => {
    av.onclick = () => { selectChar(+av.dataset.idx); buildUI(); };
  });
}

function buildColSkills() {
  const c = CHARS[selectedIdx];
  const def = getCharDef(c.id);
  const skills = (def.skills || []).slice(0, 4);
  const cards = skills.map(sid => {
    const lv = getSkillLevel(c, sid);
    const name = CONFIG.skillDefs[sid]?.name || sid;
    const xpPct = Math.min(100, (lv % 1) * 100 + (lv >= 5 ? 100 : lv * 18));
    return `<div class="skill-card">
      <div class="sk-name">${escapeHtml(name)}</div>
      <div class="sk-lv">Lv.${lv}</div>
      <div class="sk-xp"><div class="sk-xp-fill" style="width:${xpPct}%"></div></div>
    </div>`;
  }).join('');
  document.getElementById('col-skill').innerHTML = `
    <div class="col-head"><span>技能</span>
      <button type="button" class="col-expand" id="btn-skill-expand">展开</button></div>
    <div class="skill-cards">${cards || '<div class="col-empty">无技能</div>'}</div>`;
  document.getElementById('btn-skill-expand').onclick = () => openPanel(buildSkillPanel());
}

function buildColQuests() {
  const c = CHARS[selectedIdx];
  const instances = QuestSystem.getInstances?.() || [];
  const active = instances.filter(q =>
    (q.status === QUEST_STATUS.PENDING || q.status === QUEST_STATUS.ACCEPTED));
  const shown = active.filter(q => q.assigneeId === c?.id).slice(0, 4);
  const cards = shown.map(inst => {
    const t = QuestSystem.tpl(inst.templateId);
    const assignee = getChar(inst.assigneeId);
    const pct = questProgressPct(inst);
    const cls = inst.status === QUEST_STATUS.PENDING ? 'pending' : (pct < 30 ? 'urgent' : '');
    const who = inst.assigneeId !== c?.id ? `${assignee?.short || ''}·` : '';
    const meta = inst.status === QUEST_STATUS.PENDING ? `${who}待回应` : `${who}进行中 ${Math.round(pct)}%`;
    return `<div class="quest-card-mini ${cls}" data-qid="${inst.instanceId}">
      <div class="qc-title">${inst.status === QUEST_STATUS.PENDING ? '⚠ ' : ''}${escapeHtml(t?.name || '任务')}</div>
      <div class="qc-meta">${meta}</div>
      <div class="quest-prog"><div class="quest-prog-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');
  document.getElementById('col-quest').innerHTML = `
    <div class="col-head"><span>任务</span>
      <button type="button" class="col-expand" id="btn-quest-expand">展开<span class="quest-badge" id="quest-badge" style="display:none">0</span></button></div>
    <div class="quest-cards">${cards || '<div class="col-empty">暂无任务</div>'}</div>`;
  document.getElementById('btn-quest-expand').onclick = () => QuestSystem.openQuestPanel();
  document.querySelectorAll('.quest-card-mini').forEach(card => {
    card.onclick = () => QuestSystem.openQuestPanel();
  });
}

function buildGroupIssuePanel() {
  const issuer = CHARS[selectedIdx];
  const items = QuestIssueSystem?.getAvailableGroupQuests?.(issuer) || [];
  if (!items.length) {
    return `<h3>传令全府</h3><p style="color:#8a7355">当前身份无可传令的群体任务，或暂无符合条件者。</p>
      <button class="sys-btn" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
  }
  const rows = items.map(({ tpl, preview, count, deadline }, i) => `
    <label class="gi-row" style="display:block;padding:8px;margin-bottom:6px;background:#1a1210;border:1px solid #5c4033;cursor:pointer;border-radius:6px">
      <input type="radio" name="gi-tpl" value="${tpl.id}" ${i === 0 ? 'checked' : ''} style="margin-right:6px">
      <span style="color:#f5e6c8">${escapeHtml(tpl.name)}</span>
      <span style="color:#8a7355;font-size:10px">（${escapeHtml(tpl.category)}${deadline ? ' · ' + deadline : ''}）</span>
      <div style="color:#a89070;font-size:10px;margin-top:4px;margin-left:18px">目标：${escapeHtml(preview)}（${count}人）</div>
    </label>`).join('');
  return `<h3>${issuer.short} · 传令全府</h3>
    <p style="color:#8a7355;font-size:11px;margin-bottom:10px">择一群体差遣，将向符合条件者逐一传令。</p>
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
    <div style="font-size:11px;color:#a89070;line-height:1.6">
      <p><b>操作</b>：点击地面/家具行走或使用；点击其他人物打开互动菜单（含单人「差遣」）；底栏「传令」可群体下发；Shift+点击可插队行动。</p>
      <p><b>快捷键</b>：F 切换家庭；1–9 选择家庭成员；R 关系；M 消息；B 背包；S 设置；H 帮助。</p>
      <p><b>界面</b>：左侧为消息日志（可筛选）；底部四列为当前人物、家庭、技能与任务；顶栏为地点与时令。</p>
      <p>若地图空荡，请在设置→导入导出→恢复默认配置并应用重载。</p>
    </div>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
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

function buildActionQueue() {
  const c = CHARS[selectedIdx];
  const q = c.actionQueue;
  const perPage = 4;
  const maxPage = Math.max(0, Math.ceil(q.length / perPage) - 1);
  queuePage = Math.min(queuePage, maxPage);
  const start = queuePage * perPage;
  const slice = q.slice(start, start + perPage);
  const el = document.getElementById('action-queue');
  document.getElementById('aq-prev').disabled = queuePage <= 0;
  document.getElementById('aq-next').disabled = queuePage >= maxPage;
  if (!q.length) {
    el.innerHTML = '<span class="aq-empty">暂无排队行动，点击家具/地面/人物添加</span>';
    return;
  }
  el.innerHTML = slice.map((item, i) => {
    const idx = start + i;
    return `<div class="aq-item${idx === 0 ? ' current' : ''}">
      <button class="aq-cancel" data-qidx="${idx}">✕</button>
      <div class="aq-title">${item.name}</div>
      <div class="aq-phase">${getQueuePhaseLabel(c, item, idx)}${item.remaining > 0 && idx === 0 ? ` · ${Math.ceil(item.remaining)}s` : ''}</div>
    </div>${i < slice.length - 1 ? '<span style="color:#5c4033">→</span>' : ''}`;
  }).join('');
  document.querySelectorAll('.aq-cancel').forEach(btn => btn.onclick = (e) => {
    e.stopPropagation();
    cancelQueueItem(c, +btn.dataset.qidx);
    buildUI();
  });
}

function relAxisBar(label, val, min, max, color) {
  const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  const valStr = (val >= 0 ? '+' : '') + Math.round(val);
  return `<div class="bar-row" style="margin-bottom:3px">
    <span class="bar-label" style="width:28px;font-size:10px;color:#a89070">${label}</span>
    <div class="bar-track" style="flex:1;height:5px;background:#1a1210;border:1px solid #5c4033">
      <div style="height:100%;width:${pct}%;background:${color}"></div>
    </div>
    <span class="bar-val" style="width:28px;text-align:right;font-size:9px;color:#8a7355">${valStr}</span>
  </div>`;
}

function buildRelationsPanel() {
  const c = CHARS[selectedIdx];
  const others = CHARS.filter(x => x.id !== c.id);
  const configured = others.filter(t => hasConfiguredRelation(c.id, t.id) || getRelationValue(c.id, t.id) !== 0);
  const list = configured.length ? configured : others;
  return `<h3>${c.name} · 关系网络</h3>` +
    list.map(t => {
      const ri = getRelationInfo(c.id, t.id);
      const scorePct = (ri.score + 100) / 2;
      const scoreStr = (ri.score >= 0 ? '+' : '') + ri.score;
      return `<div class="rel-row" style="margin-bottom:10px">
        <div class="rel-head" style="display:flex;justify-content:space-between;color:#a89070;margin-bottom:4px">
          <span style="color:#f5e6c8">${t.short}</span>
          <span style="display:flex;gap:8px;align-items:center">
            <span style="font-size:10px;color:#8a7355">${ri.initType || '—'}</span>
            <span style="font-size:11px;color:#d4a574">${ri.typeLabel}</span>
            <span style="font-size:11px;color:${ri.score>=0?'#c9a227':'#e74c3c'}">${scoreStr}</span>
          </span>
        </div>
        <div style="padding:0 2px">
          ${relAxisBar('好感', ri.affection,  -100, 100, ri.affection  >= 0 ? '#c0392b' : '#7f8c8d')}
          ${relAxisBar('信任', ri.trust,      -100, 100, ri.trust      >= 0 ? '#2980b9' : '#7f8c8d')}
          ${relAxisBar('友谊', ri.friendship,    0, 100, '#27ae60')}
          ${relAxisBar(`服从→${t.short}`, ri.submissionAtoB, 0, 100, '#9b59b6')}
          ${ri.submissionBtoA > 5 ? relAxisBar(`服从→${c.short}`, ri.submissionBtoA, 0, 100, '#8e44ad') : ''}
        </div>
      </div>`;
    }).join('') +
    `<p style="margin-top:8px;font-size:10px;color:#8a7355">好感·信任·友谊三轴构成综合分；服从为方向性轴，由身份差值初始化，不参与综合分。</p>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
}

function buildMessagePanel() {
  const rows = messageLog.slice(0, 40).map(m =>
    `<div style="margin-bottom:6px;font-size:11px;border-bottom:1px solid #3a2f28;padding-bottom:4px">
      <span style="color:#8a7355">[第${m.day}日 ${String(m.hour).padStart(2,'0')}:${String(m.minute).padStart(2,'0')}]</span>
      <span style="color:#a89070;margin-left:4px">${m.type}</span><br>${m.summary}
    </div>`
  ).join('');
  return `<h3>消息中心</h3>
    <p style="font-size:10px;color:#8a7355;margin-bottom:8px">事件总线记录（关系/互动/时间/记忆等），共 ${messageLog.length} 条</p>
    <div style="max-height:320px;overflow-y:auto">${rows || '<p style="color:#8a7355">暂无事件</p>'}</div>
    <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
}

function buildSkillPanel() {
  const c = CHARS[selectedIdx], def = getCharDef(c.id);
  return `<h3>${c.name} · 技能</h3>` +
    def.skills.map(sid => {
      const ok = canUseSkill(c, sid);
      return `<span class="tag" style="${ok ? '' : 'opacity:.4;text-decoration:line-through'}">${CONFIG.skillDefs[sid]?.name || sid}</span>`;
    }).join('') +
    `<div style="margin-top:10px;font-size:11px;color:#8a7355"><b>性格</b><br>${def.personality}</div>
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
  buildColSkills();
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

function handleMapClick(mx, my, shiftKey) {
  const c = CHARS[selectedIdx];
  const wpx = mx + camX, wpy = my + camY;
  const g = pixelToGrid(wpx, wpy);
  const cell = WORLD[g.col]?.[g.row];
  if (!cell) return;

  if (cell.entryFor) {
    enqueueAction(c, makeFurnitureItem(getInstance(cell.entryFor)), shiftKey);
    buildUI();
    return;
  }

  const inst = getInstAt(g.col, g.row);
  if (inst) {
    enqueueAction(c, makeFurnitureItem(inst), shiftKey);
    buildUI();
    return;
  }

  if (cell.walkable) {
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
let imMenuGroups = [];
let imMenuAnchor = { x: 0, y: 0 };
let imMenuCatAngles = {};

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
  const ringSize = Math.min(320, 228 + Math.max(0, n - 6) * 14);
  const radius = Math.min(118, 90 + Math.max(0, n - 5) * 4);
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
    span = 360;
    start = baseAngle - 90;
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

function bindInteractionOptionClicks() {
  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];
  document.querySelectorAll('.im-sector.im-opt-sector:not(.disabled)').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const tpl = getInteractionTemplate(+btn.dataset.iid);
      if (!tpl || !initiator || !target) return;
      enqueueAction(initiator, makeInteractionItem(initiator, target, tpl), imMenuShiftKey);
      closeInteractionMenu();
      buildUI();
    };
  });
}

function renderImCategories() {
  const menu = document.getElementById('interaction-menu');
  const sectors = document.getElementById('im-sectors');
  menu.classList.remove('im-options', 'im-quest');
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
      style="--angle:${angle}deg;--radius:-78px" title="${cat.name}">
      <span class="im-sector-inner">
        <span class="im-sector-icon">${icon}</span>
        <span class="im-sector-label">${cat.name}</span>
      </span>
    </button>`;
  }).join('');

  sectors.querySelectorAll('.im-sector').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      if (btn.dataset.cat === '_quest') renderImQuestOptions();
      else renderImOptions(btn.dataset.cat);
    };
  });
  requestAnimationFrame(() => positionInteractionMenu());
}

function bindQuestOptionClicks() {
  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];
  document.querySelectorAll('.im-sector.im-quest-sector:not(.disabled)').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const qid = +btn.dataset.qid;
      if (!qid || !initiator || !target) return;
      QuestIssueSystem.issueTo(initiator, target, qid);
      closeInteractionMenu();
      buildUI();
    };
  });
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
  const baseAngle = imMenuCatAngles._quest ?? -90;
  const { ringSize, radius, span, start } = imOptionsLayout(n, baseAngle);
  setImRingSize(ringSize);

  sectors.innerHTML = items.map(({ tpl, reason }, i) => {
    const angle = n === 1 ? baseAngle : start + (span / (n - 1)) * i;
    const { px, py } = imSectorCenter(angle, radius, ringSize);
    const hint = reason ? `${tpl.name} · ${reason}` : tpl.name;
    return `<button type="button" class="im-sector im-opt-sector im-quest-sector"
      data-qid="${tpl.id}" style="--px:${px}px;--py:${py}px" title="${hint}">
      <span class="im-sector-inner">
        <span class="im-sector-label">${tpl.name}</span>
        ${reason ? `<span class="im-quest-hint">${reason}</span>` : ''}
      </span>
    </button>`;
  }).join('');

  bindQuestOptionClicks();
  requestAnimationFrame(() => positionInteractionMenu());
}

function renderImOptions(catId) {
  const group = imMenuGroups.find(g => g.cat.id === catId);
  if (!group) return;
  const menu = document.getElementById('interaction-menu');
  const sectors = document.getElementById('im-sectors');
  menu.classList.add('im-options');
  document.getElementById('im-hint').textContent = group.cat.name;

  const items = group.items;
  const n = items.length;
  const baseAngle = imMenuCatAngles[catId] ?? -90;
  const { ringSize, radius, span, start } = imOptionsLayout(n, baseAngle);
  setImRingSize(ringSize);

  const initiator = CHARS[selectedIdx];
  const target = CHARS[menuTargetIdx];

  sectors.innerHTML = items.map(({ tpl, ok, reason, risky, riskHint }, i) => {
    const angle = n === 1 ? baseAngle : start + (span / (n - 1)) * i;
    const { px, py } = imSectorCenter(angle, radius, ringSize);
    const isLow = ok === 'low';
    const disabled = ok === false || ok === 0;
    const hasLlm = !disabled && initiator && target
      && InteractionLlmSystem?.shouldUse?.(initiator, target, tpl);
    const isRisky = !disabled && !!risky;
    const cls = `${disabled ? ' disabled' : isLow ? ' im-warn' : ''}${hasLlm ? ' im-llm-opt' : ''}${isRisky ? ' im-risky' : ''}`;
    let hint = disabled || isLow ? reason : (hasLlm ? `${tpl.name} · 模型生成对白` : tpl.name);
    if (isRisky && riskHint) hint = `${tpl.name} · ⚠ ${riskHint}`;
    return `<button type="button" class="im-sector im-opt-sector${cls}"
      data-iid="${tpl.id}" style="--px:${px}px;--py:${py}px" title="${hint}">
      <span class="im-sector-inner">
        <span class="im-sector-label">${tpl.name}</span>
        ${hasLlm ? '<span class="im-llm-badge" title="模型生成对白">墨</span>' : ''}
        ${isRisky ? '<span class="im-risk-badge" title="逾矩行为">⚠</span>' : ''}
        ${disabled || isLow ? `<span class="im-reason">${reason}</span>` : ''}
      </span>
    </button>`;
  }).join('');

  bindInteractionOptionClicks();
  requestAnimationFrame(() => positionInteractionMenu());
}

function openInteractionMenu(targetIdx, clientX, clientY, shiftKey) {
  const initiator = CHARS[selectedIdx];
  const target = CHARS[targetIdx];
  if (!initiator || !target || initiator.id === target.id) return;
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

function closeInteractionMenu() {
  const menu = document.getElementById('interaction-menu');
  menu.classList.remove('open', 'im-options', 'im-quest');
  resetImRingSize();
  menuTargetIdx = -1;
  imMenuGroups = [];
  imMenuCatAngles = {};
}

document.getElementById('im-close').onclick = (e) => { e.stopPropagation(); closeInteractionMenu(); };
const imBackBtn = document.getElementById('im-back');
if (imBackBtn) {
  imBackBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const menu = document.getElementById('interaction-menu');
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
  handleMapClick(mx, my, e.shiftKey);
});

document.getElementById('aq-prev').onclick = () => { queuePage = Math.max(0, queuePage - 1); buildActionQueue(); };
document.getElementById('aq-next').onclick = () => { queuePage++; buildActionQueue(); };
const btnGroupIssue = document.getElementById('btn-group-issue');
if (btnGroupIssue) btnGroupIssue.onclick = () => openGroupIssuePanel();

document.getElementById('btn-rel').onclick = () => openPanel(buildRelationsPanel());
document.getElementById('btn-msg').onclick = () => openPanel(buildMessagePanel());
document.getElementById('btn-bag').onclick = () => openPanel('<h3>背包</h3><p style="color:#8a7355">暂未开放</p><button class="sys-btn" onclick="document.getElementById(\'panel-overlay\').classList.remove(\'open\')">关闭</button>');
document.getElementById('btn-help').onclick = () => openPanel(buildHelpPanel());
document.getElementById('panel-overlay').onclick = (e) => { if (e.target.id === 'panel-overlay') e.target.classList.remove('open'); };

document.addEventListener('keydown', e => {
  if (document.getElementById('admin-overlay').classList.contains('open')) return;
  const k = e.key.toLowerCase();
  if (k === 'f') { FamilySystem.openFamilyPanel(); return; }
  if (k === 'r') { openPanel(buildRelationsPanel()); return; }
  if (k === 'm') { openPanel(buildMessagePanel()); return; }
  if (k === 'b') {
    openPanel('<h3>背包</h3><p style="color:#8a7355">暂未开放</p><button class="sys-btn" onclick="document.getElementById(\'panel-overlay\').classList.remove(\'open\')">关闭</button>');
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

