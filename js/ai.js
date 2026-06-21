/* ═══════════════════ RESIDENT AI ═══════════════════ */
const AI_STATE = { IDLE: 'IDLE', EXECUTING: 'EXECUTING', SLEEPING: 'SLEEPING', URGENT: 'URGENT', PAUSED: 'PAUSED', COOLDOWN: 'COOLDOWN' };

const FURN_AI_TAGS = {
  meal: ['hunger', '食'], snack: ['hunger', '食'], kitchen: ['hunger', '食'],
  table: ['xujiu', 'fun', 'mood'],
  bed: ['sleep', 'energy', '住'], rest: ['energy', '住'],
  bath: ['hygiene', '衣'], wash: ['hygiene', '衣'], wardrobe: ['hygiene', '衣'],
  travel_rest: ['energy', '行'], seat: ['energy', '行', 'solitude'],
  desk: ['lundao', 'fun'], wine: ['xujiu', 'fun'], instrument: ['lundao', 'fun'],
  garden: ['fun', 'outdoor'], pavilion: ['fun', 'outdoor', 'xujiu', '行'],
};

const URGENT_FURN_CATEGORIES = {
  energy: ['bed', 'rest', 'travel_rest', 'seat'],
  hygiene: ['bath', 'wash', 'wardrobe'],
  hunger: ['meal', 'snack', 'kitchen'],
};

const TRAIT_LABELS = {
  fengliu: '风流', duoqing: '多情', shuchi: '书痴', qinggao: '清高', qingjie: '洁癖',
  haoke: '好客', lazy: '慵懒', kebo: '刻薄', zhongcheng: '忠诚', chiwen: '痴顽',
  duanzheng: '端庄', leitian: '乐天', xinfu: '心腹',
};

const TRAIT_MODS = {
  fengliu: { boost: { chuanqing: 1.8, xujiu: 1.5 }, cut: { solitude: 0.4, desk: 0.5 } },
  duoqing: { boost: { chuanqing: 1.9, weijie: 1.3 }, cut: { zhengchi: 0.2 } },
  shuchi: { boost: { lundao: 2.0, desk: 1.5 }, cut: { tiaoxiao: 0.25 } },
  qinggao: { boost: { lundao: 1.7, solitude: 1.4 }, cut: { tiaoxiao: 0.2, xujiu: 0.45 } },
  qingjie: { boost: { hygiene: 2.2, bath: 1.8 }, cut: { outdoor: 0.5 } },
  haoke: { boost: { xujiu: 1.7, tiaoxiao: 1.3 }, cut: { solitude: 0.35 } },
  lazy: { boost: { sleep: 1.8, energy: 1.5, seat: 1.4 }, cut: { outdoor: 0.2, desk: 0.4 } },
  kebo: { boost: { zhengchi: 2.0 }, cut: { weijie: 0.15, chuanqing: 0.4 } },
  zhongcheng: { boost: { weijie: 1.6, xujiu: 1.2 }, cut: { zhengchi: 0.5 } },
  chiwen: { boost: { chuanqing: 1.5, xujiu: 1.3 }, cut: { lundao: 0.3, desk: 0.3 } },
  duanzheng: { boost: { weijie: 1.8 }, cut: { zhengchi: 0.5, tiaoxiao: 0.6 } },
  leitian: { boost: { tiaoxiao: 1.6, xujiu: 1.4 }, cut: {} },
  xinfu: { boost: { weijie: 1.7, chuanqing: 1.2 }, cut: {} },
};

const STATE_AI_MODS = {
  exhausted: { boost: { sleep: 3, energy: 3 }, cut: { outdoor: 0.3, tiaoxiao: 0.3 } },
  melancholy: { boost: { solitude: 1.5 }, cut: { xujiu: 0.5, tiaoxiao: 0.5 } },
  drunk: { cut: { lundao: 0, outdoor: 0.2 } },
  tipsySocial: { boost: { tiaoxiao: 1.4, xujiu: 1.3 }, cut: { lundao: 0.6 } },
  angry: { cut: { chuanqing: 0, weijie: 0.2 } },
  brokenBond: { cut: { xujiu: 0.1, chuanqing: 0 } },
  elated: { boost: { tiaoxiao: 1.3, fun: 1.2 } },
  joyful: { boost: { tiaoxiao: 1.2, fun: 1.2 } },
  heartFlutter: { boost: { chuanqing: 1.3 } },
};

const MEMORY_TAG_MODS = {
  '温情': { boost: { weijie: 1.5, xujiu: 1.3 } },
  '传情': { boost: { chuanqing: 1.5 } },
  '创伤': { cut: { zhengchi: 0.1, chuanqing: 0.2 } },
};

const CHAR_DEFAULT_TRAITS = {
  baoyu: ['fengliu', 'duoqing'], daiyu: ['shuchi', 'qinggao'],
  baochai: ['qingjie', 'haoke'], tanchun: ['shuchi', 'qinggao'],
  xiren: ['haoke', 'lazy'], qingwen: ['kebo', 'fengliu'],
  sheyue: ['qingjie', 'haoke'], zijuan: ['haoke', 'duoqing'],
  xueyan: ['lazy', 'duoqing'], yinger: ['haoke', 'lazy'],
  jiazheng: ['qinggao', 'shuchi'], wangfuren: ['kebo', 'qinggao'],
  jiamu: ['haoke', 'duoqing'], jiashe: ['fengliu', 'lazy'],
  xifeng: ['kebo', 'haoke'], jiazhen: ['haoke', 'fengliu'],
  jiarong: ['fengliu', 'lazy'], laiwang: ['zhongcheng', 'haoke'],
  liulaolao: ['haoke', 'lazy'], jialian: ['fengliu', 'lazy'],
};

let GridBucket = { map: {}, size: 10 };
let aiSlowMinuteAcc = 0;

function getAIConfig() { return CONFIG.aiConfig || DEFAULT_CONFIG.aiConfig; }

function bucketKey(col, row) {
  const s = GridBucket.size;
  return `${Math.floor(col / s)},${Math.floor(row / s)}`;
}

function getBucket(col, row) {
  const k = bucketKey(col, row);
  if (!GridBucket.map[k]) GridBucket.map[k] = { furn: new Set(), chars: new Set() };
  return GridBucket.map[k];
}

function initGridBucket() {
  GridBucket.size = getAIConfig().bucketGridSize;
  GridBucket.map = {};
  for (const inst of CONFIG.furnitureInstances) addFurnToBucket(inst.instanceId);
  CHARS.forEach(c => addCharToBucket(c));
}

function addFurnToBucket(instanceId) {
  const inst = getInstance(instanceId);
  if (!inst) return;
  const tpl = getTemplate(inst.templateId);
  const ec = inst.anchorCol + tpl.entryOffset[0], er = inst.anchorRow + tpl.entryOffset[1];
  getBucket(ec, er).furn.add(instanceId);
}

function addCharToBucket(c) {
  c._bucketKey = bucketKey(c.gridCol, c.gridRow);
  getBucket(c.gridCol, c.gridRow).chars.add(c.id);
}

function moveCharBucket(c) {
  const nk = bucketKey(c.gridCol, c.gridRow);
  if (c._bucketKey === nk) return;
  if (c._bucketKey && GridBucket.map[c._bucketKey]) GridBucket.map[c._bucketKey].chars.delete(c.id);
  c._bucketKey = nk;
  getBucket(c.gridCol, c.gridRow).chars.add(c.id);
  markAIDirty(c);
}

function queryNearby(col, row, maxDist) {
  const s = GridBucket.size;
  const radius = Math.ceil(maxDist / s) + 1;
  const bc = Math.floor(col / s), br = Math.floor(row / s);
  const furn = new Set(), chars = new Set();
  for (let dx = -radius; dx <= radius; dx++)
    for (let dy = -radius; dy <= radius; dy++) {
      const b = GridBucket.map[`${bc + dx},${br + dy}`];
      if (!b) continue;
      b.furn.forEach(id => furn.add(id));
      b.chars.forEach(id => chars.add(id));
    }
  const inRange = (gc, gr) => Math.hypot(gc - col, gr - row) <= maxDist;
  return {
    furniture: [...furn].filter(id => { const inst = getInstance(id); const e = getEntryCell(inst); return inRange(e.col, e.row); }),
    chars: [...chars].filter(id => { const ch = getChar(id); return ch && inRange(ch.gridCol, ch.gridRow); }),
  };
}

function initCharAI(c) {
  c.ai = {
    state: AI_STATE.IDLE,
    cache: { candidates: [], dirty: true, currentWeight: 0, lastRebuild: 0, poolDiagnostics: null },
    cooldownUntil: 0,
    socialCooldowns: {},
    urgentNeed: null,
    urgentFailIds: [],
    urgentRetryPending: false,
    urgentRetryAt: 0,
    failedActionCooldowns: {},
    failedSceneCooldowns: {},
    recentActionCooldowns: {},
    dailySocialCounts: { day: gameDay, targets: {} },
    needAlertCooldowns: {},
    completingPlayerQueue: false,
    decisionLog: [],
    aiLog: false,
  };
}

function sanitizeAISocialCooldowns(c) {
  if (!c?.ai?.socialCooldowns) return {};
  const now = getGameTimestamp();
  const maxCooldown = Math.max(
    10,
    getAIConfig().aiCrossSceneSocialTargetCooldownMinutes || 120,
    getAIConfig().aiSocialTargetCooldownMinutes || 75,
  );
  const next = {};
  for (const [targetId, until] of Object.entries(c.ai.socialCooldowns || {})) {
    if (!Number.isFinite(until) || until <= now) continue;
    next[targetId] = Math.min(until, now + maxCooldown);
  }
  c.ai.socialCooldowns = next;
  return next;
}

function getCharTraits(c) {
  const prof = CharSpecialtySystem.profile(c.id);
  if (prof?.aiTraits?.length) return [...new Set([...prof.aiTraits, ...(prof.legacyTraits || [])])];
  const def = getCharDef(c.id);
  return def?.aiTraits || CHAR_DEFAULT_TRAITS[c.id] || [];
}

function setAIState(c, state) {
  if (!c?.ai || c.ai.state === state) return;
  const before = c.ai.state;
  c.ai.state = state;
  EventBus.emit('ai:state', { charId: c.id, before, after: state });
}

function isAIControlled(c) {
  return c && CHARS.indexOf(c) !== selectedIdx && c.ai?.state !== AI_STATE.PAUSED;
}

/** 玩家切走后，原角色仍执行玩家队列；此期间 AI 不得抢占 */
function isCompletingPlayerQueue(c) {
  return !!(c?.ai?.completingPlayerQueue && (c.action || c.actionQueue.length));
}

function clearPlayerQueueHandoff(c) {
  if (!c?.ai) return;
  c.ai.completingPlayerQueue = false;
  if (isAIControlled(c) && !c.action && !c.actionQueue.length) setAIState(c, AI_STATE.IDLE);
}

function markAIDirty(c) {
  if (c?.ai) c.ai.cache.dirty = true;
}

function ensureDailySocialCounts(c) {
  if (!c?.ai) return { day: gameDay, targets: {} };
  if (!c.ai.dailySocialCounts || c.ai.dailySocialCounts.day !== gameDay) {
    c.ai.dailySocialCounts = { day: gameDay, targets: {} };
  }
  return c.ai.dailySocialCounts;
}

function aiDailySocialCount(c, targetId) {
  const store = ensureDailySocialCounts(c);
  return store.targets?.[targetId] || 0;
}

function aiDailySocialLimitReached(c, targetId) {
  const limit = getAIConfig().aiDailySocialTargetLimit ?? 10;
  if (!limit || limit <= 0) return false;
  return aiDailySocialCount(c, targetId) >= limit;
}

function recordAIActiveSocialStart(evt) {
  if (!evt?.autoSocial || !evt.initiatorId || !evt.targetId) return;
  const c = getChar(evt.initiatorId);
  if (!c?.ai || CHARS.indexOf(c) === selectedIdx) return;
  const store = ensureDailySocialCounts(c);
  store.targets[evt.targetId] = (store.targets[evt.targetId] || 0) + 1;
  EventBus.emit('ai:daily_social_count', {
    charId: c.id,
    targetCharId: evt.targetId,
    count: store.targets[evt.targetId],
    limit: getAIConfig().aiDailySocialTargetLimit ?? 10,
    day: store.day,
  });
  markAIDirty(c);
}

function applyAISocialTargetCooldown(evt) {
  if (!evt?.autoSocial || !evt.initiatorId || !evt.targetId) return;
  const c = getChar(evt.initiatorId);
  if (!c?.ai || CHARS.indexOf(c) === selectedIdx) return;
  const cfg = getAIConfig();
  const crossedScene = evt.originSceneId != null
    && evt.targetSceneId != null
    && evt.originSceneId !== evt.targetSceneId;
  const minutes = crossedScene
    ? (cfg.aiCrossSceneSocialTargetCooldownMinutes || 120)
    : (cfg.aiSocialTargetCooldownMinutes || 75);
  c.ai.socialCooldowns ||= {};
  c.ai.socialCooldowns[evt.targetId] = Math.max(
    c.ai.socialCooldowns[evt.targetId] || 0,
    getGameTimestamp() + minutes,
  );
  markAIDirty(c);
  EventBus.emit('ai:social_target_cooldown', {
    charId: c.id,
    targetCharId: evt.targetId,
    interactionId: evt.interactionId,
    minutes,
    crossedScene,
    until: c.ai.socialCooldowns[evt.targetId],
  });
}

function needUrgency(value, max) {
  const ratio = value / Math.max(1, max);
  if (ratio <= 0.1) return 5.0;
  if (ratio <= 0.3) return 3.0;
  if (ratio <= 0.5) return 1.5;
  if (ratio <= 0.8) return 0.8;
  return 0.1;
}

function actionRelatesToNeed(cand, needKey) {
  if (cand.primaryNeed === needKey) return true;
  if (needKey === 'fun' && (cand.tags?.includes('fun') || ['tiaoxiao', 'xujiu'].includes(cand.category))) return true;
  if (needKey === 'social' && (cand.kind === 'interaction' || cand.kind === 'seek' || cand.tags?.includes('social'))) return true;
  if (needKey === 'mood' && (
    cand.category === 'weijie'
    || cand.tags?.some(tag => ['mood', 'solitude', 'desk', 'instrument', 'garden', 'sleep'].includes(tag))
  )) return true;
  if (needKey === 'hunger' && cand.tags?.includes('hunger')) return true;
  if (needKey === 'hygiene' && cand.tags?.includes('hygiene')) return true;
  if (needKey === 'energy' && (cand.tags?.includes('energy') || cand.tags?.includes('sleep'))) return true;
  return false;
}

function calcDemandFactor(c, cand, fastOnly) {
  const cfg = getAIConfig();
  const weights = cfg.demandBaseWeights;
  const needKeys = fastOnly ? cfg.fastChannelNeeds : Object.keys(weights);
  let factor = 1;
  const cf = calcNeedCoeffs(c);
  for (const nk of needKeys) {
    if (!weights[nk] || !actionRelatesToNeed(cand, nk)) continue;
    const ratio = c.needs[nk] / Math.max(1, cf[nk].max);
    const traitAttention = TraitEffectSystem?.needAttentionMultiplier?.(c, nk, ratio) || 1;
    factor += needUrgency(c.needs[nk], cf[nk].max) * weights[nk] * traitAttention;
  }
  return factor;
}

function applyTagMods(factor, tags, mods) {
  if (!mods) return factor;
  let f = factor;
  for (const t of tags) {
    if (mods.boost?.[t]) f *= mods.boost[t];
    if (mods.cut?.[t] !== undefined) f *= mods.cut[t];
  }
  return f;
}

function calcTraitFactor(c, tags) {
  let f = 1;
  const table = CharSpecialtySystem.traitModTable();
  for (const tr of getCharTraits(c)) f = applyTagMods(f, tags, table[tr]);
  return f;
}

function calcStatusFactor(c, tags) {
  let f = 1;
  for (const st of c.activeStates) {
    f = applyTagMods(f, tags, STATE_AI_MODS[st.id]);
    const sd = CONFIG.stateDefs[st.id];
    if (sd?.aiModifiers) f = applyTagMods(f, tags, sd.aiModifiers);
    for (const effect of NeedStateSystem?.traitStateEffects?.(c, sd) || []) {
      if (effect.aiModifiers) f = applyTagMods(f, tags, effect.aiModifiers);
    }
  }
  return f;
}

function getTimeSlotMods(hour) {
  if (hour >= 22 || hour < 5) return { boost: { sleep: 10, energy: 8 }, cut: { outdoor: 0, xujiu: 0, tiaoxiao: 0 } };
  if (hour >= 5 && hour < 9) return { boost: { hunger: 2, hygiene: 2 }, cut: { fun: 0.4 } };
  if (hour >= 9 && hour < 12) return { boost: { lundao: 1.4 }, cut: { sleep: 0.1 } };
  if (hour >= 12 && hour < 18) return { boost: { xujiu: 1.3, outdoor: 1.3, tiaoxiao: 1.2 } };
  if (hour >= 18 && hour < 21) return { boost: { hunger: 1.5, xujiu: 1.2 }, cut: { lundao: 0.5 } };
  return { boost: { sleep: 3 }, cut: { outdoor: 0.2, xujiu: 0.2 } };
}

function calcTimeFactor(tags) {
  return applyTagMods(1, tags, getTimeSlotMods(gameHour));
}

function hourInScheduleWindow(hour, from, to) {
  if (from == null || to == null) return false;
  if (from <= to) return hour >= from && hour < to;
  return hour >= from || hour < to;
}

function currentAIScheduleWindow(hour = gameHour) {
  const rows = getAIConfig().scheduleWindows || [];
  return rows.find(row => hourInScheduleWindow(hour, row.from, row.to)) || null;
}

function calcScheduleFactor(c, raw, tags) {
  const win = currentAIScheduleWindow();
  if (!win) return { factor: 1, window: null };
  let factor = applyTagMods(1, tags, win);
  const cat = raw.category || '';
  if (raw.kind === 'furniture') {
    const inst = getInstance(raw.instanceId);
    const tpl = inst ? getTemplate(inst.templateId) : null;
    if (tpl?.category) factor = applyTagMods(factor, [tpl.category], win);
  }
  if (raw.kind === 'interaction' || raw.kind === 'seek') {
    factor = applyTagMods(factor, ['social', cat], win);
  }
  if (raw.questRelated || raw.questUrgent) factor = applyTagMods(factor, ['quest'], win);
  return {
    factor: Math.max(0.05, Math.min(4.5, factor)),
    window: { id: win.id, name: win.name },
  };
}

function calcMemoryFactor(c, tags) {
  let f = 1;
  for (const mem of c.memories.slice(-5)) {
    f = applyTagMods(f, tags, MEMORY_TAG_MODS[mem.tag]);
    if (mem.tag === '创伤') f = applyTagMods(f, tags, { cut: { [tags[0]]: 0.1 } });
  }
  return f;
}

function crowdFactor(c, cand) {
  let sceneId = c.sceneId;
  if (cand.kind === 'furniture') {
    const inst = getInstance(cand.instanceId);
    sceneId = inst?.sceneId ?? sceneId;
  } else if (cand.kind === 'interaction') {
    sceneId = getChar(cand.targetCharId)?.sceneId ?? sceneId;
  } else if (cand.kind === 'wander' || cand.kind === 'seek') {
    sceneId = sceneAt(cand.gridCol, cand.gridRow)?.id ?? sceneId;
  }
  if (!sceneId) return 1;
  const count = CHARS.filter(ch => ch.sceneId === sceneId).length;
  if (count <= 3) return 1;
  const base = count <= 5 ? 0.65 : 0.35;
  const personality = TraitEffectSystem?.crowdPenaltyMultiplier?.(c) || 1;
  return Math.max(0.15, Math.min(1.2, 1 - (1 - base) * personality));
}

function furnitureOccupancyFactor(c, cand) {
  if (cand.kind !== 'furniture') return 1;
  const pressure = furnitureOccupancyPressure(c, cand.instanceId);
  if (pressure <= 0) return 1;
  if (pressure === 1) return 0.45;
  if (pressure === 2) return 0.22;
  return 0.1;
}

function furnitureOccupancyPressure(c, instanceId) {
  const rt = FURN_RT?.[instanceId];
  const users = (rt?.users || []).filter(id => id !== c.id).length;
  const queued = CHARS.filter(ch =>
    ch.id !== c.id
    && ch.actionQueue?.[0]?.type === 'furniture'
    && ch.actionQueue[0].instanceId === instanceId
  ).length;
  const assigned = Object.keys(rt?.slots || {}).filter(id => id !== c.id).length;
  return Math.max(users + queued, assigned);
}

function furnitureActionTags(tpl, action) {
  const restores = new Set((action?.needRestores || tpl.needRestores || []).map(nr => nr.need).filter(Boolean));
  const base = (FURN_AI_TAGS[tpl.category] || ['fun'])
    .filter(tag => !['hunger', 'energy', 'hygiene'].includes(tag) || restores.has(tag));
  return [...new Set([
    ...base,
    ...restores,
    tpl.category,
    ...(action?.tags || []),
  ].filter(Boolean))];
}

function aiCanUseScene(c, sceneId) {
  if (!sceneId || c.sceneId === sceneId) return true;
  const sceneCooldown = c.ai?.failedSceneCooldowns?.[sceneId] || 0;
  if (sceneCooldown > getGameTimestamp() && !c.ai?.urgentNeed) return false;
  if (sceneCooldown) delete c.ai.failedSceneCooldowns[sceneId];
  const check = SceneAccessSystem?.canEnterScene?.(c, sceneId, { noFollow: true });
  return check === true || check?.ok === true;
}

function aiMoveBlockReason(c) {
  if (typeof canUseSkill === 'function' && !canUseSkill(c, 'move')) {
    return getSkillBlockReason?.(c, 'move') || '当前无法行走';
  }
  return '';
}

function aiReachableCell(c, col, row) {
  if (col == null || row == null) return false;
  const sCol = Math.round(c.gridCol), sRow = Math.round(c.gridRow);
  if (sCol === col && sRow === row) return true;
  if (aiMoveBlockReason(c)) return false;
  const routed = SceneAccessSystem?.findPathWithAccess
    ? SceneAccessSystem.findPathWithAccess(c, sCol, sRow, col, row, { excludeCharIds: [c.id] })
    : null;
  if (routed) return routed.access?.ok !== 'attempt';
  const path = astar(sCol, sRow, col, row, { excludeCharIds: [c.id] });
  if (!path) return false;
  if (SceneAccessSystem?.checkPathAccess) {
    path._startCol = sCol;
    path._startRow = sRow;
    const access = SceneAccessSystem.checkPathAccess(c, path, col, row);
    if (access.ok === false || access.ok === 'attempt') return false;
  }
  return true;
}

function walkableNearCharacter(c, target, radius = 2) {
  if (!target) return null;
  const baseCol = Math.round(target.gridCol);
  const baseRow = Math.round(target.gridRow);
  const options = [];
  for (let dc = -radius; dc <= radius; dc++) {
    for (let dr = -radius; dr <= radius; dr++) {
      const col = baseCol + dc;
      const row = baseRow + dr;
      const cell = WORLD[col]?.[row];
      if (!cell?.walkable || cell.entryFor) continue;
      if (charAtCell(col, row, [c.id, target.id])) continue;
      options.push({ col, row, dist: Math.hypot(dc, dr) });
    }
  }
  options.sort((a, b) => a.dist - b.dist);
  return options.find(pos => aiReachableCell(c, pos.col, pos.row)) || null;
}

function candidateNeedsMovement(c, cand) {
  if (!cand) return false;
  if (cand.kind === 'wander' || cand.kind === 'seek') {
    return Math.round(c.gridCol) !== cand.gridCol || Math.round(c.gridRow) !== cand.gridRow;
  }
  if (cand.kind === 'furniture') {
    const inst = getInstance(cand.instanceId);
    if (!inst) return false;
    const e = getEntryCell(inst);
    return Math.round(c.gridCol) !== e.col || Math.round(c.gridRow) !== e.row;
  }
  if (cand.kind === 'interaction') {
    const target = getChar(cand.targetCharId);
    if (!target) return false;
    return Math.hypot(target.gridCol - c.gridCol, target.gridRow - c.gridRow) > 1.5;
  }
  return false;
}

function failedActionFactor(c, raw) {
  const until = c.ai?.failedActionCooldowns?.[raw.key] || 0;
  if (!until) return 1;
  const now = getGameTimestamp();
  if (now >= until) {
    delete c.ai.failedActionCooldowns[raw.key];
    return 1;
  }
  return raw.questUrgent || c.ai?.urgentNeed ? 0.02 : 0.01;
}

function candidateDiversityKey(raw) {
  if (!raw) return '';
  if (raw.diversityKey) return raw.diversityKey;
  if (raw.kind === 'furniture') {
    const inst = getInstance(raw.instanceId);
    const tpl = inst ? getTemplate(inst.templateId) : null;
    return `furniture:${tpl?.category || raw.category || 'unknown'}:${raw.actionId || 'default_use'}`;
  }
  if (raw.kind === 'interaction') return `interaction:${raw.interactionId}:${raw.targetCharId}`;
  if (raw.kind === 'seek') return `seek:${raw.targetCharId || raw.label || 'target'}`;
  if (raw.kind === 'wander') return `wander:${raw.label || raw.key || 'idle'}`;
  return raw.key || `${raw.kind}:${raw.category || ''}`;
}

function candidateDiversityKeys(raw) {
  const keys = [raw?.key, candidateDiversityKey(raw)].filter(Boolean);
  if (raw?.kind === 'furniture') {
    const cat = raw.category || getTemplate(getInstance(raw.instanceId)?.templateId)?.category || '';
    if (['meal', 'snack', 'kitchen'].includes(cat)) keys.push('furniture:food');
    if (['bed', 'rest', 'travel_rest'].includes(cat)) keys.push('furniture:rest');
  }
  if (raw?.kind === 'interaction' && raw.targetCharId) keys.push(`social-target:${raw.targetCharId}`);
  if (raw?.kind === 'seek' && raw.targetCharId) keys.push(`seek-target:${raw.targetCharId}`);
  return [...new Set(keys)];
}

function recentActionFactor(c, raw) {
  if (!c?.ai || raw.questUrgent || c.ai.urgentNeed) return 1;
  const now = getGameTimestamp();
  const store = c.ai.recentActionCooldowns || {};
  const keys = candidateDiversityKeys(raw);
  let active = false;
  for (const key of keys) {
    const until = store[key] || 0;
    if (!until) continue;
    if (now >= until) delete store[key];
    else active = true;
  }
  if (!active) return 1;
  if (raw.kind === 'wander') return 0.22;
  if (raw.kind === 'furniture') {
    const cat = raw.category || getTemplate(getInstance(raw.instanceId)?.templateId)?.category || '';
    if (['meal', 'snack', 'kitchen'].includes(cat)) {
      const cf = calcNeedCoeffs(c);
      const hungerRatio = (c.needs.hunger ?? 0) / Math.max(1, cf.hunger?.max ?? 100);
      if (hungerRatio < 0.15) return 1;
      if (hungerRatio < 0.3) return 0.18;
      return getCharTraits(c).includes('shaochi') ? 0.015 : 0.04;
    }
    if (cat === 'table') return 0.04;
    if (['bed', 'rest', 'travel_rest'].includes(cat)) return 0.04;
  }
  return 0.16;
}

function recentCooldownMinutes(c, cand) {
  if (!cand) return 30;
  if (cand.kind === 'wander') return cand.label === '居家闲步' ? 45 : 25;
  if (cand.kind === 'interaction') return 50;
  if (cand.kind === 'seek') return 45;
  if (cand.kind !== 'furniture') return 30;
  const cat = cand.category || getTemplate(getInstance(cand.instanceId)?.templateId)?.category || '';
  if (['snack', 'meal', 'kitchen'].includes(cat)) {
    return getCharTraits(c).includes('shaochi') ? 180 : 120;
  }
  if (cat === 'table') return 120;
  if (['bed', 'rest', 'travel_rest'].includes(cat)) {
    const cf = calcNeedCoeffs(c);
    const ratio = (c.needs.energy ?? 0) / Math.max(1, cf.energy?.max ?? 100);
    return ratio >= 0.75 ? 90 : 45;
  }
  if (['bath', 'wash', 'wardrobe'].includes(cat)) return 75;
  return 45;
}

function markRecentAICandidate(c, cand) {
  if (!c?.ai || !cand || cand.questUrgent || c.ai.urgentNeed) return;
  c.ai.recentActionCooldowns ||= {};
  const until = getGameTimestamp() + recentCooldownMinutes(c, cand);
  for (const key of candidateDiversityKeys(cand)) {
    c.ai.recentActionCooldowns[key] = Math.max(c.ai.recentActionCooldowns[key] || 0, until);
  }
}

function furnitureNeedSatiationFactor(c, raw) {
  if (raw.kind !== 'furniture') return 1;
  const inst = getInstance(raw.instanceId);
  const tpl = getTemplate(inst.templateId);
  const action = raw.furnitureAction || null;
  const effective = getFurnitureActionRuntime(tpl, action);
  const category = effective.category || tpl.category;
  const restores = effective.needRestores || [];
  if (!restores.length) return 1;
  const coeffs = calcNeedCoeffs(c);
  let factor = 1;
  const traits = getCharTraits(c);
  for (const nr of restores) {
    const key = nr.need;
    const max = coeffs[key]?.max ?? 100;
    const ratio = (c.needs[key] ?? 0) / Math.max(1, max);
    if (key === 'hunger' && ['meal', 'snack', 'kitchen'].includes(category)) {
      const inMealWindow = (gameHour >= 6 && gameHour < 9)
        || (gameHour >= 11 && gameHour < 13)
        || (gameHour >= 17 && gameHour < 20);
      if (category === 'snack' && !traits.includes('tanzui') && !c.ai?.urgentNeed) {
        if (ratio >= 0.45) factor = Math.min(factor, 0.12);
      }
      if (traits.includes('shaochi')) {
        if (!inMealWindow && ratio >= 0.3) factor = Math.min(factor, 0.04);
        if (ratio >= 0.55) factor = Math.min(factor, 0.025);
        else if (ratio >= 0.4) factor = Math.min(factor, 0.08);
        else if (ratio >= 0.3) factor = Math.min(factor, 0.24);
      } else if (category === 'snack') {
        if (ratio >= 0.65) factor = Math.min(factor, 0.05);
        else if (ratio >= 0.5) factor = Math.min(factor, 0.16);
      }
    }
    if (ratio >= 0.98) factor = Math.min(factor, 0.03);
    else if (ratio >= 0.85) factor = Math.min(factor, 0.12);
    else if (ratio >= 0.7) factor = Math.min(factor, 0.35);
  }
  if (['bed', 'rest'].includes(category)) {
    const energyMax = coeffs.energy?.max ?? 100;
    const energyRatio = (c.needs.energy ?? 0) / Math.max(1, energyMax);
    const night = gameHour >= 22 || gameHour < 6;
    if (energyRatio >= 0.82) factor = Math.min(factor, 0.008);
    else if (energyRatio >= 0.75) factor = Math.min(factor, 0.025);
    else if (!night && energyRatio >= 0.7) factor = Math.min(factor, 0.08);
    else if (!night && energyRatio >= 0.55) factor = Math.min(factor, 0.25);
  }
  return factor;
}

function activeQuestPressureFactor(c, raw) {
  if (!c || !raw || raw.questRelated || raw.questUrgent || c.ai?.urgentNeed) return 1;
  const quests = QuestSystem?.getAcceptedFor?.(c.id) || [];
  if (!quests.length) return 1;
  const now = getGameTimestamp();
  let minLeft = Infinity;
  let maxElapsedRatio = 0;
  for (const inst of quests) {
    if (!inst.deadlineTime) continue;
    const left = inst.deadlineTime - now;
    const start = inst.acceptedTime || inst.issuedTime || now;
    const total = Math.max(1, inst.deadlineTime - start);
    minLeft = Math.min(minLeft, left);
    maxElapsedRatio = Math.max(maxElapsedRatio, Math.max(0, Math.min(1, (now - start) / total)));
  }
  if (minLeft < 45) return 0.03;
  if (minLeft < 120) return 0.08;
  if (minLeft < 240 || maxElapsedRatio >= 0.45) return 0.2;
  if (maxElapsedRatio >= 0.25) return 0.32;
  return 0.45;
}

function roundedFactor(value) {
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : value;
}

function candidateScoreFactors(raw) {
  return {
    base: roundedFactor(raw.baseWeight),
    demand: roundedFactor(raw.demandFactor),
    trait: roundedFactor(raw.traitFactor),
    status: roundedFactor(raw.statusFactor),
    time: roundedFactor(raw.timeFactor),
    memory: roundedFactor(raw.memoryFactor),
    specialty: roundedFactor(raw.specialtyFactor),
    distance: roundedFactor(raw.distanceFactor),
    random: roundedFactor(raw.randomFactor),
    drama: roundedFactor(raw.dramaFactor),
    crowd: roundedFactor(raw.crowdFactor),
    furnitureOccupancy: roundedFactor(raw.furnitureOccupancyFactor),
    homeward: roundedFactor(raw.homewardFactor),
    quest: roundedFactor(raw.questFactor),
    needDrive: roundedFactor(raw.needDriveFactor),
    satiation: roundedFactor(raw.satiationFactor),
    failedAction: roundedFactor(raw.failedActionFactor),
    recentAction: roundedFactor(raw.recentActionFactor),
    questPressure: roundedFactor(raw.questPressureFactor),
    relation: roundedFactor(raw.relationFactor),
    schedule: roundedFactor(raw.scheduleFactor),
    dailySocial: roundedFactor(raw.dailySocialFactor),
  };
}

function candidateScoreHints(raw) {
  const factors = candidateScoreFactors(raw);
  const rows = Object.entries(factors)
    .filter(([key, value]) => key !== 'base' && Number.isFinite(value) && Math.abs(value - 1) >= 0.15)
    .sort((a, b) => Math.abs(b[1] - 1) - Math.abs(a[1] - 1))
    .slice(0, 4)
    .map(([key, value]) => ({ key, value }));
  return rows;
}

function relationCategoryFactor(c, other, tpl) {
  const info = getRelationInfo?.(c.id, other.id);
  if (!info) return { factor: 1, hints: [] };
  const cat = tpl.category || '';
  const score = info.score || 0;
  const affection = info.affection || 0;
  const trust = info.trust || 0;
  const friendship = info.friendship || 0;
  const submission = info.submissionAtoB || 0;
  let factor = 1;
  const hints = [];
  const push = (text) => { if (text) hints.push({ key: 'relation', value: text }); };
  if (['xujiu', 'lundao', 'tiaoxiao'].includes(cat)) {
    factor *= Math.max(0.35, Math.min(2.05, 0.45 + Math.max(-30, Math.min(85, score)) / 55));
  } else if (cat === 'weijie') {
    factor *= Math.max(0.4, Math.min(2.0, 0.55 + Math.max(-20, Math.min(80, trust + friendship * 0.5)) / 65));
  } else if (cat === 'chuanqing') {
    factor *= Math.max(0.25, Math.min(2.2, 0.35 + Math.max(-30, Math.min(90, affection + trust * 0.4)) / 55));
  } else if (cat === 'zhengchi') {
    factor *= score < 10 ? 1 + Math.min(70, Math.abs(score - 10)) / 90 : Math.max(0.25, 1 - score / 70);
  }
  if (submission > 35 && ['xujiu', 'weijie'].includes(cat)) factor *= 1.18;
  if (trust < -25 && cat !== 'zhengchi') factor *= 0.55;
  if (factor >= 1.25) push(`${other.short}:${info.typeLabel || '关系'}促成`);
  else if (factor <= 0.75) push(`${other.short}:${info.typeLabel || '关系'}压低`);
  return { factor: Math.max(0.18, Math.min(2.2, factor)), hints };
}

function relationSeekCandidates(c, accessible) {
  const rows = [];
  const now = getGameTimestamp();
  for (const other of CHARS || []) {
    if (!other || other.id === c.id) continue;
    if (aiDailySocialLimitReached(c, other.id)) continue;
    if (c.ai?.socialCooldowns?.[other.id] > now) continue;
    if (accessible && other.sceneId != null && !accessible.has(other.sceneId)) continue;
    if (!aiCanUseScene(c, other.sceneId)) continue;
    const dist = Math.hypot(other.gridCol - c.gridCol, other.gridRow - c.gridRow);
    if (dist <= 3) continue;
    const info = getRelationInfo?.(c.id, other.id);
    if (!info) continue;
    const pull = Math.max(
      Math.max(0, info.score || 0),
      Math.max(0, info.affection || 0) * 0.9,
      Math.max(0, info.trust || 0) * 0.7,
      Math.abs(Math.min(0, info.score || 0)) * 0.65,
      Math.max(0, info.submissionAtoB || 0) * 0.75,
    );
    if (pull < 28) continue;
    const spot = walkableNearCharacter(c, other);
    if (!spot) continue;
    const hostile = (info.score || 0) < -20;
    const tags = hostile ? ['social', 'zhengchi'] : ['social', 'relation', 'xujiu'];
    const baseWeight = Math.max(0.45, Math.min(1.8, 0.45 + pull / 70));
    rows.push({
      key: `relseek:${other.id}`,
      kind: 'seek',
      targetCharId: other.id,
      gridCol: spot.col,
      gridRow: spot.row,
      tags,
      category: hostile ? 'zhengchi' : 'social',
      baseWeight,
      relationFactor: hostile ? 1.05 : 1.15,
      label: hostile ? `寻${other.short}理论` : `寻${other.short}`,
      scoreHints: [{ key: 'relation', value: `${other.short}:${info.typeLabel || '关系牵引'}` }],
    });
  }
  return rows.sort((a, b) => b.baseWeight - a.baseWeight).slice(0, 3);
}

function finalizeCandidate(c, raw, fastOnly) {
  const cfg = getAIConfig();
  const tags = raw.tags || [];
  if (raw.kind === 'seek') {
    raw.distance = 0; // 追人候选绕过距离裁剪
  } else if (raw.kind === 'furniture') {
    const inst = getInstance(raw.instanceId);
    const e = getEntryCell(inst);
    raw.distance = Math.hypot(e.col - c.gridCol, e.row - c.gridRow);
  } else if (raw.kind === 'interaction') {
    const t = getChar(raw.targetCharId);
    raw.distance = t ? Math.hypot(t.gridCol - c.gridCol, t.gridRow - c.gridRow) : 99;
  } else {
    raw.distance = Math.hypot(raw.gridCol - c.gridCol, raw.gridRow - c.gridRow);
  }
  if (raw.distance > cfg.maxCandidateDistance) { raw.distanceFactor = 0; raw.finalWeight = 0; return raw; }
  const distanceFactor = 1 / (1 + raw.distance * cfg.distanceDecayFactor);
  const randomFactor = cfg.randomPerturbMin + Math.random() * (cfg.randomPerturbMax - cfg.randomPerturbMin);
  raw.randomFactor = randomFactor;
  raw.demandFactor = calcDemandFactor(c, raw, !!fastOnly);
  raw.questFactor = QuestSystem.getQuestWeightBoost?.(c, raw) || 1;
  raw.traitFactor = TraitEffectSystem?.modifyActionWeight?.(c, raw, calcTraitFactor(c, tags))
    || calcTraitFactor(c, tags);
  raw.statusFactor = calcStatusFactor(c, tags);
  raw.timeFactor = calcTimeFactor(tags);
  const schedule = calcScheduleFactor(c, raw, tags);
  raw.scheduleFactor = schedule.factor;
  raw.scheduleWindow = schedule.window;
  raw.memoryFactor = calcMemoryFactor(c, tags);
  raw.distanceFactor = distanceFactor;
  raw.specialtyFactor = CharSpecialtySystem.calcFactor(c, raw, tags);
  raw.dramaFactor = (typeof AiDrama !== 'undefined') ? AiDrama.dramaFactor(c, raw) : 1;
  raw.crowdFactor = crowdFactor(c, raw);
  raw.furnitureOccupancyFactor = furnitureOccupancyFactor(c, raw);
  raw.homewardFactor = (typeof AiHomeward !== 'undefined') ? AiHomeward.homewardFactor(c, raw) : 1;
  raw.needDriveFactor = CoreNeedSystem?.actionFactor?.(c, raw) ?? 1;
  raw.satiationFactor = furnitureNeedSatiationFactor(c, raw);
  raw.failedActionFactor = failedActionFactor(c, raw);
  raw.relationFactor = raw.relationFactor ?? 1;
  raw.dailySocialFactor = (
    (raw.kind === 'interaction' || raw.kind === 'seek')
    && raw.targetCharId
    && aiDailySocialLimitReached(c, raw.targetCharId)
  ) ? 0 : 1;
  raw.diversityKey = candidateDiversityKey(raw);
  raw.recentActionFactor = recentActionFactor(c, raw);
  raw.questPressureFactor = activeQuestPressureFactor(c, raw);
  raw.finalWeight = raw.baseWeight * raw.demandFactor * raw.traitFactor * raw.statusFactor
    * raw.timeFactor * raw.memoryFactor * raw.specialtyFactor * distanceFactor * randomFactor
    * raw.dramaFactor * raw.crowdFactor * raw.furnitureOccupancyFactor
    * raw.homewardFactor * raw.questFactor * raw.needDriveFactor
    * raw.satiationFactor * raw.failedActionFactor * raw.recentActionFactor
    * raw.questPressureFactor * raw.relationFactor * raw.scheduleFactor
    * raw.dailySocialFactor;
  raw.scoreFactors = candidateScoreFactors(raw);
  raw.scoreHints = [...(raw.scoreHints || []), ...candidateScoreHints(raw)].slice(0, 6);
  return raw;
}

let builtinCandidateProvidersRegistered = false;

function ensureBuiltinCandidateProviders() {
  if (builtinCandidateProvidersRegistered || typeof AiCandidateProviderSystem === 'undefined') return;
  builtinCandidateProvidersRegistered = true;
  AiCandidateProviderSystem.clear();
  AiCandidateProviderSystem.register({
    id: 'furniture',
    order: 10,
    provide(c, ctx, pool) {
      for (const fid of ctx.near.furniture) {
        ctx.check('furniture');
        const inst = getInstance(fid);
        if (ctx.accessible && !ctx.accessible.has(inst.sceneId)) { ctx.reject('furniture', 'scene_inaccessible'); continue; }
        if (!aiCanUseScene(c, inst.sceneId)) { ctx.reject('furniture', 'scene_cooldown_or_forbidden'); continue; }
        const tpl = getTemplate(inst.templateId);
        for (const action of getFurnitureActions(tpl)) {
          ctx.check('furniture');
          const chk = canUseFurniture(c, inst, action);
          if (chk !== true && chk !== '已满') { ctx.reject('furniture', String(chk || 'unusable')); continue; }
          if (NeedAdaptationSystem?.wouldAiRefuse?.(c, tpl, action)) { ctx.reject('furniture', 'trait_refuse_predicted'); continue; }
          const actionId = action.id || 'default_use';
          const tags = furnitureActionTags(tpl, action);
          const primaryNeed = action.needRestores?.[0]?.need || tpl.needRestores?.[0]?.need;
          const timeWeight = tpl.category === 'bed' && (gameHour >= 22 || gameHour < 6) ? 2.5 : 1;
          ctx.accept('furniture', {
            key: `furn:${fid}:${actionId}`, kind: 'furniture', instanceId: fid,
            actionId, furnitureAction: action,
            tags, category: action.category || tpl.category, primaryNeed,
            baseWeight: (action.aiWeight ?? tpl.aiWeight ?? 1) * timeWeight,
            label: `${tpl.name}·${action.name || '使用'}`,
          }, pool);
        }
      }
    },
  });
  AiCandidateProviderSystem.register({
    id: 'social',
    order: 20,
    provide(c, ctx, pool) {
      const social = ctx.diagnostics.social;
      for (const oid of ctx.near.chars) {
        ctx.check('social');
        if (oid === c.id) continue;
        social.nearbyOthers++;
        const other = getChar(oid);
        if (aiDailySocialLimitReached(c, oid)) {
          social.dailyCapBlocked++;
          ctx.reject('social', 'daily_target_cap');
          continue;
        }
        if (c.ai.socialCooldowns[oid] > getGameTimestamp()) {
          social.cooldownBlocked++;
          ctx.reject('social', 'cooldown');
          continue;
        }
        for (const tpl of Object.values(CONFIG.interactionTemplates || {})) {
          ctx.check('social');
          social.templatesChecked++;
          if (!checkInteractionAvailable(c, other, tpl, { ignoreCooldown: true }).ok) {
            social.availabilityBlocked++;
            ctx.reject('social', 'unavailable');
            continue;
          }
          const rel = relationCategoryFactor(c, other, tpl);
          ctx.accept('social', {
            key: `int:${tpl.id}:${oid}`, kind: 'interaction',
            interactionId: tpl.id, targetCharId: oid,
            tags: [tpl.category, 'social'], category: tpl.category,
            baseWeight: 1.05, relationFactor: rel.factor,
            label: `${tpl.name}·${other.short}`,
            scoreHints: rel.hints,
          }, pool);
          social.candidates++;
        }
      }
    },
  });
  AiCandidateProviderSystem.register({
    id: 'relation',
    order: 25,
    provide(c, ctx, pool) {
      for (const row of relationSeekCandidates(c, ctx.accessible)) {
        ctx.check('relation');
        ctx.accept('relation', row, pool);
      }
    },
  });
  AiCandidateProviderSystem.register({
    id: 'wander',
    order: 30,
    provide(c, ctx, pool) {
      for (let i = 0; i < 2; i++) {
        ctx.check('wander');
        const dc = Math.round(c.gridCol) + (Math.floor(Math.random() * 13) - 6);
        const dr = Math.round(c.gridRow) + (Math.floor(Math.random() * 13) - 6);
        if (!WORLD[dc]?.[dr]?.walkable || WORLD[dc][dr].entryFor) { ctx.reject('wander', 'not_walkable'); continue; }
        if (charAtCell(dc, dr, [c.id])) { ctx.reject('wander', 'occupied'); continue; }
        const wSc = sceneAt(dc, dr);
        if (ctx.accessible && wSc && !ctx.accessible.has(wSc.id)) { ctx.reject('wander', 'scene_inaccessible'); continue; }
        if (!aiReachableCell(c, dc, dr)) { ctx.reject('wander', 'unreachable'); continue; }
        ctx.accept('wander', { key: `w:${dc},${dr}`, kind: 'wander', gridCol: dc, gridRow: dr, tags: ['outdoor'], baseWeight: 0.3, label: '闲游' }, pool);
      }
    },
  });
  const external = [
    ['homeward', 40, () => (typeof AiHomeward !== 'undefined') ? AiHomeward.extraWanderCandidates : null],
    ['economy', 50, () => (typeof EconomySystem !== 'undefined') ? EconomySystem.extraCandidates : null],
    ['coreNeed', 60, () => (typeof CoreNeedSystem !== 'undefined') ? CoreNeedSystem.extraCandidates : null],
    ['quest', 70, () => (typeof QuestSystem !== 'undefined') ? QuestSystem.extraCandidates : null],
    ['drama', 80, () => (typeof AiDrama !== 'undefined') ? AiDrama.extraCandidates : null],
  ];
  for (const [id, order, getter] of external) {
    AiCandidateProviderSystem.register({
      id,
      order,
      provide(c, ctx, pool) {
        const fn = getter();
        if (!fn) return;
        for (const row of fn(c, ctx.accessible) || []) {
          ctx.check(id);
          ctx.accept(id, row, pool);
        }
      },
    });
  }
}

function buildCandidatePool(c) {
  const cfg = getAIConfig();
  const maxD = cfg.maxCandidateDistance;
  const accessible = SceneAccessSystem?.getAccessibleSceneIds
    ? new Set(SceneAccessSystem.getAccessibleSceneIds(c))
    : null;
  const near = queryNearby(c.gridCol, c.gridRow, maxD);
  const socialDiagnostics = {
    nearbyOthers: 0,
    cooldownBlocked: 0,
    dailyCapBlocked: 0,
    templatesChecked: 0,
    availabilityBlocked: 0,
    candidates: 0,
  };
  ensureBuiltinCandidateProviders();
  const collected = (typeof AiCandidateProviderSystem !== 'undefined')
    ? AiCandidateProviderSystem.collect(c, { accessible, near, diagnostics: { social: socialDiagnostics } })
    : { rows: [], ctx: { stats: {} } };
  const pool = collected.rows;
  const providerStats = collected.ctx.stats;
  const maxSize = cfg.cacheMaxSize;
  const socialPool = pool.filter(row => row.kind === 'interaction' || row.kind === 'seek');
  const furniturePool = pool.filter(row => row.kind === 'furniture');
  const otherPool = pool.filter(row => !socialPool.includes(row) && !furniturePool.includes(row));
  const retained = [];
  const addRows = (rows, count) => {
    for (const row of rows.slice(0, count)) if (!retained.includes(row)) retained.push(row);
  };
  addRows(socialPool, Math.min(10, Math.ceil(maxSize * 0.4)));
  addRows(furniturePool, Math.min(16, Math.ceil(maxSize * 0.55)));
  addRows(otherPool, Math.max(2, maxSize - retained.length));
  addRows(pool.filter(row => !retained.includes(row)), maxSize - retained.length);
  const countKinds = rows => rows.reduce((out, row) => {
    out[row.kind] = (out[row.kind] || 0) + 1;
    return out;
  }, {});
  c.ai.cache.poolDiagnostics = {
    nearbyCharacters: near.chars.length,
    rawTotal: pool.length,
    retainedTotal: Math.min(retained.length, maxSize),
    truncated: Math.max(0, pool.length - retained.length),
    rawByKind: countKinds(pool),
    retainedByKind: countKinds(retained.slice(0, maxSize)),
    providers: providerStats,
    social: socialDiagnostics,
  };
  c.ai.cache.candidates = retained.slice(0, maxSize).map(p => finalizeCandidate(c, p, false));
  c.ai.cache.dirty = false;
  c.ai.cache.lastRebuild = getGameTimestamp();
  return c.ai.cache.candidates;
}

function refreshCandidateWeights(c, fastOnly) {
  if (c.ai.cache.dirty || !c.ai.cache.candidates.length) buildCandidatePool(c);
  else c.ai.cache.candidates.forEach(cand => finalizeCandidate(c, cand, fastOnly));
}

function selectFromPool(pool) {
  const cfg = getAIConfig();
  const sorted = [...pool].filter(p => p.finalWeight > 0).sort((a, b) => b.finalWeight - a.finalWeight);
  const top = sorted.slice(0, cfg.candidatePoolSize);
  if (!top.length) return null;
  const total = top.reduce((s, x) => s + x.finalWeight, 0);
  let r = Math.random() * total;
  for (const item of top) { r -= item.finalWeight; if (r <= 0) return item; }
  return top[top.length - 1];
}

function candidateInterruptThreshold(c, cand, channel) {
  const cfg = getAIConfig();
  let threshold = channel === 'fast' ? cfg.weightReplaceThresholdFast : cfg.weightReplaceThresholdSlow;
  if (!cand) return threshold;
  if (cand.questUrgent) return Math.min(threshold, 0.75);
  if (cand.questRelated) return Math.min(threshold, 0.95);
  if (cand.kind === 'furniture' && ['meal', 'snack', 'kitchen'].includes(cand.category || '')) {
    const cf = calcNeedCoeffs(c);
    const ratio = (c.needs.hunger ?? 0) / Math.max(1, cf.hunger?.max ?? 100);
    if (ratio <= 0.35) threshold = Math.min(threshold, 0.9);
  }
  if (cand.kind === 'furniture' && ['bed', 'rest', 'travel_rest'].includes(cand.category || '')) {
    const cf = calcNeedCoeffs(c);
    const ratio = (c.needs.energy ?? 0) / Math.max(1, cf.energy?.max ?? 100);
    if (ratio <= 0.3 || gameHour >= 22 || gameHour < 5) threshold = Math.min(threshold, 0.9);
  }
  if (cand.kind === 'interaction' || cand.kind === 'seek') threshold = Math.max(threshold, 1.15);
  return threshold;
}

function candToQueueItem(c, cand) {
  if (cand.kind === 'furniture') return makeFurnitureItem(getInstance(cand.instanceId), cand.furnitureAction || null);
  if (cand.kind === 'interaction') return makeInteractionItem(c, getChar(cand.targetCharId), getInteractionTemplate(cand.interactionId));
  if (cand.kind === 'wander' || cand.kind === 'seek') return makeMoveItem(cand.gridCol, cand.gridRow);
  return null;
}

function rejectAICandidate(c, cand, reason, minutes = 180) {
  if (!c?.ai || !cand?.key) return;
  c.ai.failedActionCooldowns ||= {};
  c.ai.failedActionCooldowns[cand.key] = getGameTimestamp() + minutes;
  c.ai.cache.dirty = true;
  EventBus.emit('ai:candidate_rejected', {
    charId: c.id, key: cand.key, label: cand.label, kind: cand.kind, reason,
  });
}

function validateCandidateBeforeQueue(c, cand) {
  if (!c || !cand) return { ok: false, reason: '无效行动' };
  if (candidateNeedsMovement(c, cand)) {
    const blocked = aiMoveBlockReason(c);
    if (blocked) return { ok: false, reason: blocked };
  }
  if (cand.kind === 'furniture') {
    const inst = getInstance(cand.instanceId);
    if (!inst) return { ok: false, reason: '家具不存在' };
    const chk = canUseFurniture(c, inst, cand.furnitureAction || null);
    if (chk !== true && chk !== '已满') return { ok: false, reason: chk || '不可使用家具' };
  }
  if (cand.kind === 'interaction') {
    const target = getChar(cand.targetCharId);
    const tpl = getInteractionTemplate(cand.interactionId);
    if (!target || !tpl) return { ok: false, reason: '互动对象无效' };
    if (!aiCanUseScene(c, target.sceneId)) return { ok: false, reason: `${c.short}无法进入${getScene(target.sceneId)?.name || '该处'}` };
    const chk = checkInteractionAvailable(c, target, tpl, { ignoreCooldown: true });
    if (!chk.ok) return { ok: false, reason: chk.reason || '不可互动' };
  }
  if ((cand.kind === 'wander' || cand.kind === 'seek') && cand.gridCol != null) {
    const sid = sceneAt(cand.gridCol, cand.gridRow)?.id;
    if (sid && !aiCanUseScene(c, sid)) return { ok: false, reason: `${c.short}无法进入${getScene(sid)?.name || '该处'}` };
    if (!aiReachableCell(c, cand.gridCol, cand.gridRow)) return { ok: false, reason: '这条路走不通' };
  }
  return { ok: true };
}

function getCurrentActionWeight(c) { return c.ai?.cache?.currentWeight || 0; }

function personalityFlavorNote(c, cand) {
  const tf = cand.traitFactor || 1, sf = cand.specialtyFactor || 1;
  if (tf < 1.3 && sf < 1.3) return '';
  const p = CharSpecialtySystem?.profile?.(c.id);
  if (p?.specialties?.length) {
    const active = p.specialties.find(s => CharSpecialtySystem.evalCheck(c, p.checks?.[s.id]));
    if (active) return `·${active.name}`;
  }
  const traits = CharSpecialtySystem?.getDisplayTraits?.(c) || [];
  return traits.length ? `·${traits[0]}` : '';
}

function logAIDecision(c, channel, cand, replaced) {
  c.ai.decisionLog.unshift({
    channel, selected: cand.label, key: cand.key, kind: cand.kind, category: cand.category || cand.kind,
    provider: cand.provider || '',
    weight: cand.finalWeight, replaced,
    scoreFactors: cand.scoreFactors || candidateScoreFactors(cand),
    scoreHints: cand.scoreHints || candidateScoreHints(cand),
    traitEffects: TraitEffectSystem?.decisionTrace?.(cand) || [],
    scheduleWindow: cand.scheduleWindow || null,
    ts: getGameTimestamp(),
  });
  if (c.ai.decisionLog.length > 12) c.ai.decisionLog.pop();
  if (c.ai.aiLog) log(`[AI/${c.short}] ${channel}→${cand.label}(${cand.finalWeight.toFixed(2)})`);
  const flavor = personalityFlavorNote(c, cand);
  if (flavor && (cand.traitFactor >= 1.4 || cand.specialtyFactor >= 1.4) && Math.random() < 0.35) {
    log(`${c.short}${flavor} → ${cand.label}`);
  }
  EventBus.emit('ai:decision', {
    charId: c.id, channel, action: cand.label, category: cand.category || cand.kind,
    key: cand.key, kind: cand.kind, provider: cand.provider || '',
    weight: cand.finalWeight, replaced,
    scoreFactors: cand.scoreFactors || candidateScoreFactors(cand),
    scoreHints: cand.scoreHints || candidateScoreHints(cand),
    traitEffects: TraitEffectSystem?.decisionTrace?.(cand) || [],
    scheduleWindow: cand.scheduleWindow || null,
  });
}

function aiReplaceQueue(c, cand, channel) {
  if (isCompletingPlayerQueue(c)) return;
  if (c.ai?.urgentNeed) {
    if (channel !== 'event') return;
    if (cand.kind !== 'furniture') return;
  }
  const valid = validateCandidateBeforeQueue(c, cand);
  if (!valid.ok) {
    rejectAICandidate(c, cand, valid.reason, /无法进入|无权|不可使用|不存在/.test(valid.reason || '') ? 240 : 60);
    if (c.ai?.urgentNeed) scheduleUrgentRetry(c, cand.instanceId);
    return;
  }
  const item = candToQueueItem(c, cand);
  if (!item) return;
  item.aiGenerated = true;
  item.urgent = !!c.ai?.urgentNeed;
  item.aiCandidateKey = cand.key;
  markRecentAICandidate(c, cand);
  cancelAction(c);
  c.actionQueue = [];
  let socialIntentName = '';
  if (cand.kind === 'interaction') {
    socialIntentName = getInteractionTemplate(cand.interactionId)?.name || '交谈';
    c._autoSocialIntent = {
      targetId: cand.targetCharId,
      name: socialIntentName,
      startedAt: getGameTimestamp(),
    };
  } else {
    c._autoSocialIntent = null;
  }
  enqueueAction(c, item);
  if (cand.kind === 'interaction') {
    const target = getChar(cand.targetCharId);
    c.statusText = `去找${target?.short || '人'}·${socialIntentName}`;
  }
  c.ai.cache.currentWeight = cand.finalWeight;
  if (!c.ai.urgentNeed) {
    const inst = cand.kind === 'furniture' ? getInstance(cand.instanceId) : null;
    const fCat = inst ? getTemplate(inst.templateId)?.category || '' : '';
    const isBed = ['bed', 'rest'].includes(fCat);
    setAIState(c, isBed && (gameHour >= 22 || gameHour < 6) ? AI_STATE.SLEEPING : AI_STATE.EXECUTING);
  }
  logAIDecision(c, channel, cand, true);
}

function findUrgentCandidate(c, needKey) {
  const cfg = getAIConfig();
  const excluded = new Set(c.ai?.urgentFailIds || []);
  let best = null;

  const accessible = SceneAccessSystem?.getAccessibleSceneIds
    ? new Set(SceneAccessSystem.getAccessibleSceneIds(c))
    : null;
  const evalInst = (inst) => {
    if (excluded.has(inst.instanceId)) return;
    if (accessible && !accessible.has(inst.sceneId)) return;
    if (!aiCanUseScene(c, inst.sceneId)) return;
    const tpl = getTemplate(inst.templateId);
    for (const action of getFurnitureActions(tpl)) {
      const restoresNeed = (action.needRestores || tpl.needRestores || []).some(nr => nr.need === needKey);
      const actionTags = action.tags || [];
      const catMatch = (URGENT_FURN_CATEGORIES[needKey] || []).includes(action.category || tpl.category)
        || actionTags.includes(needKey);
      if (!restoresNeed && !catMatch) continue;
      const chk = canUseFurniture(c, inst, action);
      if (chk !== true && chk !== '已满') continue;
      if (NeedAdaptationSystem?.wouldAiRefuse?.(c, tpl, action)) continue;
      const e = getEntryCell(inst);
      const dist = Math.hypot(e.col - c.gridCol, e.row - c.gridRow);
      const homewardScore = (typeof AiHomeward !== 'undefined')
        ? AiHomeward.urgentFurnitureScore(c, inst, tpl, needKey, dist)
        : dist;
      const occupancyPenalty = furnitureOccupancyPressure(c, inst.instanceId) * 80;
      const actionWeight = Math.max(0.1, action.aiWeight ?? 1);
      const score = (homewardScore + occupancyPenalty) / actionWeight;
      const actionId = action.id || 'default_use';
      if (!best || score < best.score) {
        best = {
          key: `furn:${inst.instanceId}:${actionId}`, kind: 'furniture', instanceId: inst.instanceId,
          actionId, furnitureAction: action,
          tags: furnitureActionTags(tpl, action),
          category: action.category || tpl.category, primaryNeed: needKey,
          baseWeight: 10 * actionWeight, label: `${tpl.name}·${action.name || '使用'}`, distance: dist, score,
        };
      }
    }
  };

  const near = queryNearby(c.gridCol, c.gridRow, cfg.maxCandidateDistance * 2);
  near.furniture.forEach(fid => evalInst(getInstance(fid)));
  if (!best) CONFIG.furnitureInstances.forEach(evalInst);

  if (best) finalizeCandidate(c, best, true);
  return best;
}

function scheduleUrgentRetry(c, failedInstanceId) {
  if (!c.ai?.urgentNeed) return;
  if (failedInstanceId && !c.ai.urgentFailIds.includes(failedInstanceId))
    c.ai.urgentFailIds.push(failedInstanceId);
  c.ai.urgentRetryPending = true;
  c.ai.urgentRetryAt = performance.now() / 1000 + 0.4;
}

function processUrgentRetries() {
  const now = performance.now() / 1000;
  for (const c of CHARS) {
    if (!c.ai?.urgentRetryPending || !c.ai.urgentNeed) continue;
    if (c.action || c.actionQueue.length) { c.ai.urgentRetryPending = false; continue; }
    if (now < c.ai.urgentRetryAt) continue;
    c.ai.urgentRetryPending = false;
    retryUrgentAction(c);
  }
}

function retryUrgentAction(c) {
  if (!c.ai?.urgentNeed || c.action || c.actionQueue.length) return;
  if (performance.now() / 1000 < c.ai.urgentRetryAt) return;
  const cfg = getAIConfig();
  const cf = calcNeedCoeffs(c);
  const k = c.ai.urgentNeed;
  if (c.needs[k] / cf[k].max >= cfg.urgentRecoveryThreshold) {
    checkUrgentRecovery(c);
    return;
  }
  const cand = findUrgentCandidate(c, k);
  if (cand) {
    c.ai.urgentFailIds = [];
    aiReplaceQueue(c, cand, 'event');
  } else if ((c.ai.urgentFailIds?.length || 0) >= 3) {
    log(`${c.short}暂无可用家具，稍后再寻。`);
    c.ai.urgentFailIds = [];
    c.ai.urgentRetryAt = performance.now() / 1000 + 3;
    c.ai.urgentRetryPending = true;
    c.statusText = '需求告急，暂无可用家具';
  } else {
    c.statusText = '需求告急，搜寻家具…';
    scheduleUrgentRetry(c, null);
  }
}

function checkUrgentRecovery(c) {
  const cfg = getAIConfig();
  const k = c.ai.urgentNeed;
  if (!k) { setAIState(c, AI_STATE.IDLE); return; }
  const cf = calcNeedCoeffs(c);
  if (c.needs[k] / cf[k].max >= cfg.urgentRecoveryThreshold) {
    c.ai.urgentNeed = null;
    c.ai.urgentFailIds = [];
    c.ai.urgentRetryPending = false;
    setAIState(c, AI_STATE.IDLE);
    markAIDirty(c);
  }
}

function onNeedCrisis(c, needKey) {
  if (!c.ai || !isAIControlled(c)) return;
  const followTask = QuestSystem?.getFollowTaskForChar?.(c.id);
  if (followTask && NarrativeBubbleSystem?.showBubble) {
    const master = getChar(followTask.issuerId)
      || getChar(QuestSystem.resolveTargetCharId?.(
        (QuestSystem.tpl?.(followTask.templateId)?.completeConditions || []).find(cond => cond.type === 'FOLLOW_CHARACTER')?.target,
        followTask,
      ));
    const text = master ? `${master.short}，我去去就来。` : '我去去就来。';
    if (!c._followLeaveBubbleTs || getGameTimestamp() - c._followLeaveBubbleTs > 120) {
      c._followLeaveBubbleTs = getGameTimestamp();
      NarrativeBubbleSystem.showBubble({ charId: c.id, text, style: 'speech', module: 'follow', duration: 4 });
      EventBus.emit('servant:follow_interrupted', {
        servantId: c.id,
        masterId: master?.id || followTask.issuerId,
        instanceId: followTask.instanceId,
        templateId: followTask.templateId,
        needKey,
      });
    }
  }
  setAIState(c, AI_STATE.URGENT);
  c.ai.urgentNeed = needKey;
  c.ai.urgentFailIds = [];
  cancelAction(c);
  c.actionQueue = [];
  const urgent = findUrgentCandidate(c, needKey);
  if (urgent) aiReplaceQueue(c, urgent, 'event');
  EventBus.emit('need:crisis', { charId: c.id, needKey });
  log(`${c.short}需求告急，赶往${urgent?.label || '可用家具'}。`);
}

function followNeedCrisisThreshold(c, needKey) {
  if (!['hunger', 'hygiene', 'energy'].includes(needKey)) return 0.1;
  const followTask = QuestSystem?.getFollowTaskForChar?.(c.id);
  if (!followTask) return 0.1;
  const masterId = followTask.issuerId
    || QuestSystem.resolveTargetCharId?.(
      (QuestSystem.tpl?.(followTask.templateId)?.completeConditions || []).find(cond => cond.type === 'FOLLOW_CHARACTER')?.target,
      followTask,
    );
  const submission = masterId && typeof getRelationAxis === 'function'
    ? getRelationAxis(c.id, masterId, 'submission')
    : 0;
  const trust = masterId && typeof getRelationAxis === 'function'
    ? getRelationAxis(masterId, c.id, 'trust')
    : 0;
  if (submission >= 80) return 0.1;
  if (trust >= 70) return 0.25;
  return 0.2;
}

function mostUrgentBasicNeed(c) {
  if (!c?.ai) return null;
  const cf = calcNeedCoeffs(c);
  let best = null;
  for (const nd of getNeedDefs()) {
    const key = nd.key;
    if (key === 'social' || key === 'mood') continue;
    const max = Math.max(1, cf[key]?.max ?? 100);
    const ratio = (c.needs[key] ?? 0) / max;
    const threshold = followNeedCrisisThreshold(c, key);
    if (ratio > threshold) continue;
    const score = ratio / Math.max(0.01, threshold);
    if (!best || score < best.score) best = { needKey: key, ratio, threshold, score };
  }
  return best;
}

function urgentNeedPriority(needKey) {
  if (needKey === 'hunger') return 0;
  if (needKey === 'energy') return 1;
  if (needKey === 'hygiene') return 2;
  return 9;
}

function emitNeedAlert(c, type, needKey, ratio, cooldownMinutes) {
  if (!c?.ai) return;
  c.ai.needAlertCooldowns ||= {};
  const key = `${type}:${needKey}`;
  const now = getGameTimestamp();
  if ((c.ai.needAlertCooldowns[key] || 0) > now) return;
  c.ai.needAlertCooldowns[key] = now + cooldownMinutes;
  EventBus.emit(type, { charId: c.id, needKey, ratio });
}

function checkAINeedEvents(c) {
  if (!c.ai) return;
  const cf = calcNeedCoeffs(c);
  const urgent = mostUrgentBasicNeed(c);
  if (urgent) {
    const cur = c.ai.urgentNeed;
    const curRatio = cur ? (c.needs[cur] ?? 0) / Math.max(1, cf[cur]?.max ?? 100) : Infinity;
    const curThreshold = cur ? followNeedCrisisThreshold(c, cur) : 1;
    const curScore = cur ? curRatio / Math.max(0.01, curThreshold) : Infinity;
    const shouldSwitch = urgent.needKey !== cur && (
      urgent.score < curScore - 0.05
      || (urgent.score <= curScore + 0.01 && urgentNeedPriority(urgent.needKey) < urgentNeedPriority(cur))
    );
    if (c.ai.state !== AI_STATE.URGENT || !cur || shouldSwitch) {
      onNeedCrisis(c, urgent.needKey);
      return;
    }
  }
  for (const nd of getNeedDefs()) {
    const k = nd.key, ratio = c.needs[k] / cf[k].max;
    if (k === 'social' || k === 'mood') {
      if (ratio <= 0.1) emitNeedAlert(c, 'need:crisis', k, ratio, 45);
      if (ratio <= 0.3) emitNeedAlert(c, 'need:critical', k, ratio, 90);
      continue;
    }
    if (ratio <= 0.3) emitNeedAlert(c, 'need:critical', k, ratio, 60);
  }
}

function tryWakeFromSleep(c) {
  if (c.ai?.state !== AI_STATE.SLEEPING) return;
  const cfg = getAIConfig();
  const cf = calcNeedCoeffs(c);
  if (c.needs.energy / cf.energy.max >= cfg.sleepWakeEnergyRatio || (gameHour >= 8 && gameHour < 22)) {
    cancelAction(c);
    c.actionQueue = [];
    setAIState(c, AI_STATE.IDLE);
    markAIDirty(c);
  }
}

function fastChannelTick(c) {
  if (!c.ai || !isAIControlled(c)) return;
  if (c.ai.state === AI_STATE.PAUSED) return;
  if (isCompletingPlayerQueue(c)) return;
  if (c.ai.state === AI_STATE.COOLDOWN) {
    if (getGameTimestamp() >= c.ai.cooldownUntil) setAIState(c, AI_STATE.IDLE);
    return;
  }
  tryWakeFromSleep(c);
  if (c.ai.state === AI_STATE.SLEEPING) return;
  if (c.ai.urgentNeed || c.ai.state === AI_STATE.URGENT) {
    checkUrgentRecovery(c);
    if (!c.action && !c.actionQueue.length) {
      c.ai.urgentRetryPending = true;
      if (performance.now() / 1000 >= c.ai.urgentRetryAt) c.ai.urgentRetryAt = performance.now() / 1000;
    }
    return;
  }
  if (c.ai.state === AI_STATE.IDLE) return;
  if (c.ai.state !== AI_STATE.EXECUTING) return;
  refreshCandidateWeights(c, true);
  const cfg = getAIConfig();
  const top = [...c.ai.cache.candidates].sort((a, b) => b.finalWeight - a.finalWeight).slice(0, 3);
  const curW = getCurrentActionWeight(c) || 0.01;
  const threshold = candidateInterruptThreshold(c, top[0], 'fast');
  const replaced = !!(top[0] && top[0].finalWeight > curW * threshold);
  if (replaced && typeof BehaviorTelemetry !== 'undefined')
    BehaviorTelemetry.recordEvaluation(c, 'fast', top[0], {
      busy: true,
      replaced,
      replaceThreshold: threshold,
      currentWeight: curW,
    });
  if (replaced)
    aiReplaceQueue(c, top[0], 'fast');
}

function slowChannelTick(c) {
  if (!c.ai || !isAIControlled(c)) return;
  if ([AI_STATE.PAUSED, AI_STATE.COOLDOWN, AI_STATE.SLEEPING].includes(c.ai.state)) return;
  if (isCompletingPlayerQueue(c)) return;
  MultiInteractSystem.observeAndReact(c, { type: 'tick' });
  if (!c.action && !c.actionQueue.length) SceneAccessSystem.tryAISendInvite(c);
  if (c.ai.urgentNeed || c.ai.state === AI_STATE.URGENT) {
    checkUrgentRecovery(c);
    if (!c.action && !c.actionQueue.length) {
      c.ai.urgentRetryPending = true;
      if (performance.now() / 1000 >= c.ai.urgentRetryAt) c.ai.urgentRetryAt = performance.now() / 1000;
    }
    return;
  }
  c.ai.cache.dirty = true;
  buildCandidatePool(c);
  const picked = selectFromPool(c.ai.cache.candidates);
  if (!picked) {
    if (typeof BehaviorTelemetry !== 'undefined') BehaviorTelemetry.recordEvaluation(c, 'slow', null, {
      busy: !!(c.action || c.actionQueue.length),
      replaced: false,
      replaceThreshold: getAIConfig().weightReplaceThresholdSlow,
      currentWeight: getCurrentActionWeight(c),
    });
    return;
  }
  const cfg = getAIConfig();
  const curW = getCurrentActionWeight(c);
  const busy = c.action || c.actionQueue.length;
  const threshold = candidateInterruptThreshold(c, picked, 'slow');
  const replaced = !busy || picked.finalWeight > curW * threshold;
  if (typeof BehaviorTelemetry !== 'undefined') BehaviorTelemetry.recordEvaluation(c, 'slow', picked, {
    busy: !!busy,
    replaced,
    replaceThreshold: threshold,
    currentWeight: curW,
  });
  if (replaced)
    aiReplaceQueue(c, picked, 'slow');
}

function onAITimeAdvanced(minutes) {
  for (let i = 0; i < minutes; i++) {
    CHARS.forEach(c => fastChannelTick(c));
    aiSlowMinuteAcc++;
    if (aiSlowMinuteAcc >= 15) {
      aiSlowMinuteAcc = 0;
      CHARS.forEach(c => slowChannelTick(c));
    }
  }
}

function pauseCharAI(c) {
  if (!c) return;
  if (!c.ai) initCharAI(c);
  c.ai.completingPlayerQueue = false;
  setAIState(c, AI_STATE.PAUSED);
}

function resumeCharAI(c) {
  if (!c?.ai) return;
  if (c.action || c.actionQueue.length) {
    c.ai.completingPlayerQueue = true;
    setAIState(c, AI_STATE.EXECUTING);
  } else {
    c.ai.completingPlayerQueue = false;
    setAIState(c, AI_STATE.IDLE);
  }
}

function initAISystem() {
  GridBucket.size = getAIConfig().bucketGridSize;
  initGridBucket();
  CHARS.forEach(c => { if (!c.ai) initCharAI(c); });
  if (typeof AiDrama !== 'undefined') AiDrama.init();
  EventBus.on('need:critical', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('state:add', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('state:remove', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('time:period', () => CHARS.forEach(c => markAIDirty(c)));
  EventBus.on('time:day', () => CHARS.forEach(c => {
    if (c.ai) c.ai.dailySocialCounts = { day: gameDay, targets: {} };
    markAIDirty(c);
  }));
  EventBus.on('memory:add', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('interaction:started', recordAIActiveSocialStart);
  EventBus.on('interaction:complete', applyAISocialTargetCooldown);
  EventBus.on('queue:failed', e => {
    const c = getChar(e.charId);
    if (!c?.ai) return;
    const severe = /无法进入|尚未掌握|等级不足|醉得|不想再吃|没什么胃口/.test(e.reason || '');
    if (e.candidateKey) {
      c.ai.failedActionCooldowns ||= {};
      c.ai.failedActionCooldowns[e.candidateKey] = getGameTimestamp() + (severe ? 180 : 45);
    }
    if (e.sceneId && /无法进入|无权|擅入/.test(e.reason || '')) {
      c.ai.failedSceneCooldowns ||= {};
      c.ai.failedSceneCooldowns[e.sceneId] = getGameTimestamp() + 240;
    }
    if (c.ai.urgentNeed && e.instanceId && !c.ai.urgentFailIds.includes(e.instanceId)) {
      c.ai.urgentFailIds.push(e.instanceId);
      c.ai.urgentRetryPending = true;
      c.ai.urgentRetryAt = performance.now() / 1000 + 0.4;
    }
    markAIDirty(c);
  });
  window.ResidentAI = {
    AI_STATE,
    getAIState: id => getChar(id)?.ai?.state,
    getCandidatePool: id => getChar(id)?.ai?.cache?.candidates,
    getCurrentWeight: id => getCurrentActionWeight(getChar(id)),
    forceRebuildCache: id => { const c = getChar(id); if (c) { c.ai.cache.dirty = true; buildCandidatePool(c); } },
    forceAction: (id, key) => {
      const c = getChar(id);
      if (!c) return;
      if (!c.ai.cache.candidates.length) buildCandidatePool(c);
      const cand = c.ai.cache.candidates.find(x => x.key === key);
      if (cand) aiReplaceQueue(c, cand, 'debug');
    },
    getRecentDecisions: id => getChar(id)?.ai?.decisionLog || [],
    enableAILog: (id, on) => { const c = getChar(id); if (c) c.ai.aiLog = !!on; },
    getMood: id => { const c = getChar(id); return c && typeof AiDrama !== 'undefined' ? AiDrama.mood(c) : 0; },
    getIntent: id => { const c = getChar(id); return c && typeof AiDrama !== 'undefined' ? AiDrama.getIntent(c) : null; },
    setIntent: (id, type, targetId) => { const c = getChar(id); if (c && typeof AiDrama !== 'undefined') AiDrama.setIntent(c, type, targetId); },
    getScheduleWindow: () => currentAIScheduleWindow(),
  };
}


function loadConfig() {
  try {
    const s = localStorage.getItem('dgy_config');
    if (s) {
      const merged = deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONFIG)), JSON.parse(s));
      migrateConfig(merged);
      return merged;
    }
  } catch (e) { console.warn('loadConfig failed, using defaults:', e); }
  const cfg = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  migrateConfig(cfg);
  return cfg;
}

function migrateConfig(cfg) {
  const mergeLegacyTimeDecay = mods => {
    if (!mods || mods.timeDecay == null) return;
    mods.decay = mods.decay == null ? mods.timeDecay : mods.decay * mods.timeDecay;
    delete mods.timeDecay;
  };
  const needWorld = !cfg.scenes?.length || !cfg.furnitureTemplates
    || !Object.keys(cfg.furnitureTemplates || {}).length
    || !cfg.furnitureInstances?.length;
  if (needWorld) {
    if (cfg.furniture) delete cfg.furniture;
    Object.assign(cfg, {
      groundTypes: DEFAULT_CONFIG.groundTypes,
      scenes: JSON.parse(JSON.stringify(DEFAULT_CONFIG.scenes)),
      connections: JSON.parse(JSON.stringify(DEFAULT_CONFIG.connections)),
      furnitureTemplates: JSON.parse(JSON.stringify(DEFAULT_CONFIG.furnitureTemplates)),
      furnitureInstances: JSON.parse(JSON.stringify(DEFAULT_CONFIG.furnitureInstances)),
    });
  }
  cfg.needDefs = cfg.needDefs || [];
  for (const def of DEFAULT_CONFIG.needDefs || []) {
    const current = cfg.needDefs.find(row => row.key === def.key);
    if (!current) cfg.needDefs.push(JSON.parse(JSON.stringify(def)));
    else Object.assign(current, { ...def, ...current });
  }
  cfg.needDecayPerGameDay = {
    ...DEFAULT_CONFIG.needDecayPerGameDay,
    ...(cfg.needDecayPerGameDay || {}),
  };
  cfg.needCombinationStates = cfg.needCombinationStates?.length
    ? cfg.needCombinationStates
    : JSON.parse(JSON.stringify(DEFAULT_CONFIG.needCombinationStates || []));
  cfg.aiConfig = {
    ...DEFAULT_CONFIG.aiConfig,
    ...(cfg.aiConfig || {}),
    demandBaseWeights: {
      ...DEFAULT_CONFIG.aiConfig.demandBaseWeights,
      ...(cfg.aiConfig?.demandBaseWeights || {}),
    },
  };
  cfg.moneyConfig = deepMerge(
    JSON.parse(JSON.stringify(DEFAULT_CONFIG.moneyConfig || {})),
    cfg.moneyConfig || {},
  );
  if (cfg.familyConfig) cfg.familyConfig.fundDailyCostBase = 0;
  for (const inst of DEFAULT_CONFIG.furnitureInstances || []) {
    if (inst.instanceId === 6009 && !cfg.furnitureInstances.some(row => row.instanceId === inst.instanceId)) {
      cfg.furnitureInstances.push(JSON.parse(JSON.stringify(inst)));
    }
  }
  for (const furniture of Object.values(cfg.furnitureTemplates || {})) {
    for (const restore of furniture.needRestores || []) {
      if (restore.ratePerGameMin == null && restore.ratePerSec != null) {
        restore.ratePerGameMin = restore.ratePerSec;
      }
      delete restore.ratePerSec;
    }
  }
  for (const c of cfg.characters || []) {
    for (const coeff of Object.values(c.baseNeedCoeffs || {})) mergeLegacyTimeDecay(coeff);
  }
  for (const attrRules of Object.values(cfg.attributeRules || {})) {
    for (const mods of Object.values(attrRules || {})) {
      if (mods?.timeDecay != null) {
        mods.decay = (mods.decay || 0) + mods.timeDecay;
        delete mods.timeDecay;
      }
    }
  }
  for (const state of Object.values(cfg.stateDefs || {})) {
    if (state.duration >= 99990) state.duration = -1;
    for (const mods of Object.values(state.needMods || {})) mergeLegacyTimeDecay(mods);
  }
  for (const trait of Object.values(cfg.charSpecialtyConfig?.traitMetadata || {})) {
    if (trait.category === '脾性') trait.category = '性情';
    if (trait.category === '社交') trait.category = '处世';
    if (trait.category === '习性') trait.category = '习惯';
    for (const mods of Object.values(trait.effects?.needCoeffs || {})) mergeLegacyTimeDecay(mods);
  }
  if (!cfg.relationInit) {
    delete cfg.relationTypes;
    delete cfg.pairRelations;
    cfg.relationInit = DEFAULT_CONFIG.relationInit;
    cfg.relationDecayPerDay = DEFAULT_CONFIG.relationDecayPerDay;
    cfg.relationTypeThresholds = DEFAULT_CONFIG.relationTypeThresholds;
  }
  if (!cfg.relationTypeThresholds?.length) {
    cfg.relationTypeThresholds = JSON.parse(JSON.stringify(DEFAULT_CONFIG.relationTypeThresholds || []));
  }
  if (!cfg.relationPanelConfig) {
    cfg.relationPanelConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.relationPanelConfig || {}));
  } else if (DEFAULT_CONFIG.relationPanelConfig) {
    cfg.relationPanelConfig = deepMerge(
      JSON.parse(JSON.stringify(DEFAULT_CONFIG.relationPanelConfig)),
      cfg.relationPanelConfig
    );
  }
  migrateRelationStageLabelColumns(cfg);
  if (!cfg.interactionTemplates) {
    cfg.interactionCategories = DEFAULT_CONFIG.interactionCategories;
    cfg.interactionTemplates = DEFAULT_CONFIG.interactionTemplates;
  } else {
    for (const [id, tpl] of Object.entries(DEFAULT_CONFIG.interactionTemplates || {})) {
      if (!cfg.interactionTemplates[id])
        cfg.interactionTemplates[id] = JSON.parse(JSON.stringify(tpl));
    }
  }
  if (!cfg.interactionSocialConfig) {
    cfg.interactionSocialConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.interactionSocialConfig || {}));
  } else {
    const iscDef = DEFAULT_CONFIG.interactionSocialConfig || {};
    const isc = cfg.interactionSocialConfig;
    if (!isc.categoryMinScore) isc.categoryMinScore = { ...iscDef.categoryMinScore };
    if (!isc.categoryOnLowScore) isc.categoryOnLowScore = JSON.parse(JSON.stringify(iscDef.categoryOnLowScore || {}));
    if (!isc.hierarchyOnLowScore) isc.hierarchyOnLowScore = { ...iscDef.hierarchyOnLowScore };
    if (isc.showLockedInteractions == null) isc.showLockedInteractions = iscDef.showLockedInteractions ?? true;
  }
  if (!cfg.identityProtocolConfig?.contactTypeRules && DEFAULT_CONFIG.identityProtocolConfig?.contactTypeRules) {
    cfg.identityProtocolConfig = cfg.identityProtocolConfig || {};
    cfg.identityProtocolConfig.contactTypeRules = JSON.parse(JSON.stringify(DEFAULT_CONFIG.identityProtocolConfig.contactTypeRules));
    cfg.identityProtocolConfig.riskyDefaults = JSON.parse(JSON.stringify(DEFAULT_CONFIG.identityProtocolConfig.riskyDefaults));
  }
  for (const [sid, def] of Object.entries(DEFAULT_CONFIG.stateDefs || {})) {
    if (!cfg.stateDefs[sid]) cfg.stateDefs[sid] = JSON.parse(JSON.stringify(def));
  }
  for (const sid of ['exhausted', 'melancholy', 'elated']) {
    const trigger = cfg.stateDefs?.[sid]?.trigger;
    if (trigger?.need) delete cfg.stateDefs[sid].trigger;
  }
  if (!cfg.aiConfig) cfg.aiConfig = DEFAULT_CONFIG.aiConfig;
  if (!cfg.narrativeBubble) cfg.narrativeBubble = JSON.parse(JSON.stringify(DEFAULT_CONFIG.narrativeBubble));
  else {
    const defNb = DEFAULT_CONFIG.narrativeBubble || {};
    const defLlm = defNb.settings?.llm || {};
    const s = cfg.narrativeBubble.settings || (cfg.narrativeBubble.settings = {});
    s.llm = { ...defLlm, ...s.llm };
    if (s.llm.interactionLinesMin == null) s.llm.interactionLinesMin = defLlm.interactionLinesMin;
    if (s.llm.interactionLinesMax == null) s.llm.interactionLinesMax = defLlm.interactionLinesMax;
    if (s.llm.interactionLinesGrowth == null) s.llm.interactionLinesGrowth = defLlm.interactionLinesGrowth;
    if (s.llm.interactionPrefetch == null) s.llm.interactionPrefetch = defLlm.interactionPrefetch !== false;
    if (s.llm.interactionLowScoreEnabled == null) s.llm.interactionLowScoreEnabled = defLlm.interactionLowScoreEnabled !== false;
    if (s.llm.interactionLowScoreLines == null) s.llm.interactionLowScoreLines = defLlm.interactionLowScoreLines ?? 4;
    if (s.llm.apiProxy == null && defLlm.apiProxy) s.llm.apiProxy = defLlm.apiProxy;
    if (s.llm.provider === 'ollama') {
      if (s.llm.manualEnabled !== true) {
        s.llm.enabled = false;
        s.llm.interactionEnabled = false;
      }
      if (s.llm.apiUrl && !/localhost|127\.0\.0\.1|\/ollama/i.test(s.llm.apiUrl)) {
        s.llm.apiUrl = '';
      }
    }
    if (s.interactionEnabled == null) s.interactionEnabled = defNb.settings?.interactionEnabled !== false;
    if (s.dedupeText == null) s.dedupeText = defNb.settings?.dedupeText !== false;
    if (s.dedupeTextWindowSec == null) s.dedupeTextWindowSec = defNb.settings?.dedupeTextWindowSec ?? 8;
    if (s.burstWindowSec == null) s.burstWindowSec = defNb.settings?.burstWindowSec ?? 4;
    if (!s.burstLimits && defNb.settings?.burstLimits) {
      s.burstLimits = { ...defNb.settings.burstLimits };
    }
    if (s.stackOffsetPx == null) s.stackOffsetPx = defNb.settings?.stackOffsetPx ?? 10;
    if (!cfg.narrativeBubble.interactionStateBubbles?.length && defNb.interactionStateBubbles?.length) {
      cfg.narrativeBubble.interactionStateBubbles = JSON.parse(JSON.stringify(defNb.interactionStateBubbles));
    }
  }
  if (!cfg.multiInteractConfig) {
    cfg.multiInteractConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.multiInteractConfig || {}));
  } else if (cfg.multiInteractConfig.maxObserverBubblesPerEvent == null) {
    cfg.multiInteractConfig.maxObserverBubblesPerEvent = DEFAULT_CONFIG.multiInteractConfig?.maxObserverBubblesPerEvent ?? 1;
  }
  if (!cfg.lifePathConfig) {
    cfg.lifePathConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.lifePathConfig || {}));
  } else {
    const def = DEFAULT_CONFIG.lifePathConfig || {};
    if (!cfg.lifePathConfig.settings?.reputationTiers?.length) {
      cfg.lifePathConfig.settings = { ...def.settings, ...cfg.lifePathConfig.settings };
    }
    cfg.lifePathConfig.paths = { ...def.paths, ...cfg.lifePathConfig.paths };
    cfg.lifePathConfig.stages = { ...def.stages, ...cfg.lifePathConfig.stages };
    cfg.lifePathConfig.storyNodes = { ...def.storyNodes, ...cfg.lifePathConfig.storyNodes };
    cfg.lifePathConfig.autoStartChars = { ...def.autoStartChars, ...cfg.lifePathConfig.autoStartChars };
  }
  if (!cfg.moneyConfig) cfg.moneyConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.moneyConfig || {}));
  if (!cfg.fortuneConfig) cfg.fortuneConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.fortuneConfig || {}));
  if (!cfg.skillDefs?.trade) {
    cfg.skillDefs = { ...DEFAULT_CONFIG.skillDefs, ...cfg.skillDefs };
  }
  if (!cfg.familyConfig) cfg.familyConfig = DEFAULT_CONFIG.familyConfig;
  else {
    const defFc = DEFAULT_CONFIG.familyConfig || {};
    cfg.familyConfig.families = cfg.familyConfig.families || [];
    for (const df of defFc.families || []) {
      if (!cfg.familyConfig.families.some(f => f.id === df.id)) {
        cfg.familyConfig.families.push(JSON.parse(JSON.stringify(df)));
      }
    }
  }
  for (const dc of DEFAULT_CONFIG.characters || []) {
    const cur = cfg.characters?.find(ch => ch.id === dc.id);
    if (!cur) continue;
    if (cur.homewardness == null && dc.homewardness != null) cur.homewardness = dc.homewardness;
    if (!cur.shortComment && dc.shortComment) cur.shortComment = dc.shortComment;
  }
  if (!cfg.questConfig) cfg.questConfig = DEFAULT_CONFIG.questConfig;
  else {
    cfg.questConfig.ui = {
      ...(DEFAULT_CONFIG.questConfig.ui || {}),
      ...(cfg.questConfig.ui || {}),
    };
    cfg.questConfig.servantConfig = {
      ...(DEFAULT_CONFIG.questConfig.servantConfig || {}),
      ...(cfg.questConfig.servantConfig || {}),
      contracts: cfg.questConfig.servantConfig?.contracts?.length
        ? cfg.questConfig.servantConfig.contracts
        : JSON.parse(JSON.stringify(DEFAULT_CONFIG.questConfig.servantConfig?.contracts || [])),
      dutyRoutines: cfg.questConfig.servantConfig?.dutyRoutines?.length
        ? cfg.questConfig.servantConfig.dutyRoutines
        : JSON.parse(JSON.stringify(DEFAULT_CONFIG.questConfig.servantConfig?.dutyRoutines || [])),
      followRotations: cfg.questConfig.servantConfig?.followRotations?.length
        ? cfg.questConfig.servantConfig.followRotations
        : JSON.parse(JSON.stringify(DEFAULT_CONFIG.questConfig.servantConfig?.followRotations || [])),
    };
    cfg.questConfig.categories = [
      ...new Set([...(DEFAULT_CONFIG.questConfig.categories || []), ...(cfg.questConfig.categories || [])])
    ];
    cfg.questConfig.templates = cfg.questConfig.templates || {};
    for (const [id, tpl] of Object.entries(DEFAULT_CONFIG.questConfig.templates || {})) {
      if (!cfg.questConfig.templates[id]) cfg.questConfig.templates[id] = JSON.parse(JSON.stringify(tpl));
    }
    const defContracts = DEFAULT_CONFIG.questConfig.servantConfig?.contracts || [];
    for (const defContract of defContracts) {
      const curContract = cfg.questConfig.servantConfig.contracts
        ?.find(contract => contract.id === defContract.id);
      if (!curContract) continue;
      curContract.dutyCategories = [
        ...new Set([...(curContract.dutyCategories || []), ...(defContract.dutyCategories || [])])
      ];
      if (curContract.authorityLevel == null) curContract.authorityLevel = defContract.authorityLevel;
      if (curContract.salaryPerMonth == null) curContract.salaryPerMonth = defContract.salaryPerMonth;
      if (!curContract.role && defContract.role) curContract.role = defContract.role;
      if (!curContract.sceneIds?.length && defContract.sceneIds?.length) {
        curContract.sceneIds = JSON.parse(JSON.stringify(defContract.sceneIds));
      }
    }
    if (!cfg.questConfig.issuePermissions?.length) {
      cfg.questConfig.issuePermissions = JSON.parse(JSON.stringify(DEFAULT_CONFIG.questConfig.issuePermissions));
    } else {
      const defPerms = DEFAULT_CONFIG.questConfig.issuePermissions || [];
      for (const dp of defPerms) {
        const cur = cfg.questConfig.issuePermissions.find(p => p.issuerRank === dp.issuerRank);
        if (!cur) continue;
        if (cur.allowGroupQuests == null) cur.allowGroupQuests = dp.allowGroupQuests;
        cur.targetRelations = [
          ...new Set([...(cur.targetRelations || []), ...(dp.targetRelations || [])])
        ];
        cur.allowedCategories = [
          ...new Set([...(cur.allowedCategories || []), ...(dp.allowedCategories || [])])
        ];
        cur.specialQuests = [
          ...new Set([...(cur.specialQuests || []), ...(dp.specialQuests || [])])
        ];
      }
    }
    if (cfg.questConfig.groupQuestCooldownGameMin == null) {
      cfg.questConfig.groupQuestCooldownGameMin = DEFAULT_CONFIG.questConfig.groupQuestCooldownGameMin;
    }
  }
  if (!cfg.charSpecialtyConfig) {
    cfg.charSpecialtyConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.charSpecialtyConfig));
  } else {
    const defCsc = DEFAULT_CONFIG.charSpecialtyConfig || {};
    const csc = cfg.charSpecialtyConfig;
    csc.traitLabels = { ...defCsc.traitLabels, ...csc.traitLabels };
    csc.traitMetadata = csc.traitMetadata || {};
    for (const [id, defMeta] of Object.entries(defCsc.traitMetadata || {})) {
      const current = csc.traitMetadata[id] || {};
      csc.traitMetadata[id] = {
        ...defMeta,
        ...current,
        effects: {
          ...(defMeta.effects || {}),
          ...(current.effects || {}),
          actionWeights: {
            ...(defMeta.effects?.actionWeights || {}),
            ...(current.effects?.actionWeights || {}),
          },
          needCoeffs: {
            ...(defMeta.effects?.needCoeffs || {}),
            ...(current.effects?.needCoeffs || {}),
          },
          needThresholds: {
            ...(defMeta.effects?.needThresholds || {}),
            ...(current.effects?.needThresholds || {}),
          },
          stateChance: {
            ...(defMeta.effects?.stateChance || {}),
            ...(current.effects?.stateChance || {}),
          },
          stateDuration: {
            ...(defMeta.effects?.stateDuration || {}),
            ...(current.effects?.stateDuration || {}),
          },
          stateRecovery: {
            ...(defMeta.effects?.stateRecovery || {}),
            ...(current.effects?.stateRecovery || {}),
          },
          relation: {
            ...(defMeta.effects?.relation || {}),
            ...(current.effects?.relation || {}),
          },
          social: {
            ...(defMeta.effects?.social || {}),
            ...(current.effects?.social || {}),
          },
          quest: {
            ...(defMeta.effects?.quest || {}),
            ...(current.effects?.quest || {}),
          },
          memory: {
            ...(defMeta.effects?.memory || {}),
            ...(current.effects?.memory || {}),
          },
          money: {
            ...(defMeta.effects?.money || {}),
            ...(current.effects?.money || {}),
          },
          competition: {
            ...(defMeta.effects?.competition || {}),
            ...(current.effects?.competition || {}),
          },
          movement: {
            ...(defMeta.effects?.movement || {}),
            ...(current.effects?.movement || {}),
          },
          furnitureNeeds: Object.fromEntries(
            Array.from(new Set([
              ...Object.keys(defMeta.effects?.furnitureNeeds || {}),
              ...Object.keys(current.effects?.furnitureNeeds || {}),
            ])).map(key => [key, {
              ...(defMeta.effects?.furnitureNeeds?.[key] || {}),
              ...(current.effects?.furnitureNeeds?.[key] || {}),
            }])
          ),
        },
      };
    }
    csc.specialtyMetadata = csc.specialtyMetadata || {};
    for (const [id, defMeta] of Object.entries(defCsc.specialtyMetadata || {})) {
      const current = csc.specialtyMetadata[id] || {};
      csc.specialtyMetadata[id] = {
        ...defMeta,
        ...current,
        systems: current.systems || defMeta.systems || [],
        effectExamples: current.effectExamples || defMeta.effectExamples || [],
        effects: {
          ...(defMeta.effects || {}),
          ...(current.effects || {}),
          actionWeights: {
            ...(defMeta.effects?.actionWeights || {}),
            ...(current.effects?.actionWeights || {}),
          },
          needCoeffs: {
            ...(defMeta.effects?.needCoeffs || {}),
            ...(current.effects?.needCoeffs || {}),
          },
          stateChance: {
            ...(defMeta.effects?.stateChance || {}),
            ...(current.effects?.stateChance || {}),
          },
          stateDuration: {
            ...(defMeta.effects?.stateDuration || {}),
            ...(current.effects?.stateDuration || {}),
          },
          stateRecovery: {
            ...(defMeta.effects?.stateRecovery || {}),
            ...(current.effects?.stateRecovery || {}),
          },
          relation: {
            ...(defMeta.effects?.relation || {}),
            ...(current.effects?.relation || {}),
          },
          social: {
            ...(defMeta.effects?.social || {}),
            ...(current.effects?.social || {}),
          },
          quest: {
            ...(defMeta.effects?.quest || {}),
            ...(current.effects?.quest || {}),
          },
          memory: {
            ...(defMeta.effects?.memory || {}),
            ...(current.effects?.memory || {}),
          },
          money: {
            ...(defMeta.effects?.money || {}),
            ...(current.effects?.money || {}),
          },
          competition: {
            ...(defMeta.effects?.competition || {}),
            ...(current.effects?.competition || {}),
          },
          movement: {
            ...(defMeta.effects?.movement || {}),
            ...(current.effects?.movement || {}),
          },
        },
      };
    }
    csc.traitNarratives = {
      ...(defCsc.traitNarratives || {}),
      ...(csc.traitNarratives || {}),
    };
    csc.traitModifiers = { ...defCsc.traitModifiers, ...csc.traitModifiers };
    csc.profiles = csc.profiles || {};
    for (const [id, prof] of Object.entries(defCsc.profiles || {})) {
      if (!csc.profiles[id]) {
        csc.profiles[id] = JSON.parse(JSON.stringify(prof));
        continue;
      }
      const current = csc.profiles[id];
      const oldTraits = prof.legacyTraits || [];
      const isOldDefault = oldTraits.length === (current.aiTraits || []).length
        && oldTraits.every((trait, index) => current.aiTraits[index] === trait);
      if (isOldDefault) {
        current.aiTraits = [...prof.aiTraits];
        current.displayTraits = [...prof.displayTraits];
      }
      if (!current.legacyTraits?.length && prof.legacyTraits?.length) {
        current.legacyTraits = [...prof.legacyTraits];
      }
    }
  }
  cfg.needAdaptationConfig = {
    ...(DEFAULT_CONFIG.needAdaptationConfig || {}),
    ...(cfg.needAdaptationConfig || {}),
  };
  if (!cfg.multiInteractConfig) cfg.multiInteractConfig = DEFAULT_CONFIG.multiInteractConfig;
  if (!cfg.furnitureConfig) cfg.furnitureConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.furnitureConfig));
  migrateFurnitureConfig(cfg);
  mergeFurnitureDefaults(cfg);
  if (!cfg.sceneAccessConfig) cfg.sceneAccessConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.sceneAccessConfig));
  if (!cfg.identityProtocolConfig) {
    cfg.identityProtocolConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.identityProtocolConfig));
  }
  migrateSceneAccessFields(cfg);
  if (!cfg.characters?.length) cfg.characters = JSON.parse(JSON.stringify(DEFAULT_CONFIG.characters));
}

function migrateFurnitureConfig(cfg) {
  const cur = cfg.furnitureConfig || (cfg.furnitureConfig = {});
  const def = DEFAULT_CONFIG.furnitureConfig || {};
  cur.lifeLineName = cur.lifeLineName || def.lifeLineName || '生活类目';
  cur.needGroupName = cur.needGroupName || def.needGroupName || '基础需求';
  cur.lifeLineNeedMap = { ...(def.lifeLineNeedMap || {}), ...(cur.lifeLineNeedMap || {}) };
  const oldDefaultLabels = {
    '食': '食·温饱',
    '衣': '衣·整洁',
    '住': '住·歇息',
    '行': '行·歇脚',
    '闲': '闲·雅趣',
  };
  cur.lifeLineLabels = cur.lifeLineLabels || {};
  for (const [key, label] of Object.entries(def.lifeLineLabels || {})) {
    if (!cur.lifeLineLabels[key] || cur.lifeLineLabels[key] === oldDefaultLabels[key]) {
      cur.lifeLineLabels[key] = label;
    }
  }
  cur.essentialCategories = cur.essentialCategories || def.essentialCategories || [];
}

function mergeFurnitureDefaults(cfg) {
  if (!cfg.furnitureTemplates) cfg.furnitureTemplates = {};
  for (const [id, tpl] of Object.entries(DEFAULT_CONFIG.furnitureTemplates)) {
    if (!cfg.furnitureTemplates[id]) {
      cfg.furnitureTemplates[id] = JSON.parse(JSON.stringify(tpl));
      continue;
    }
    const cur = cfg.furnitureTemplates[id];
    if (tpl.lifeLine && cur.lifeLine == null) cur.lifeLine = tpl.lifeLine;
    if (tpl.essential != null && cur.essential == null) cur.essential = tpl.essential;
    if (tpl.essential && cur.useCondition) delete cur.useCondition;
    if (tpl.essential && tpl.lifeLine === '食' && cur.skill === 'serve') cur.skill = null;
    if (id === '501' && cur.category === 'table') cur.category = 'wine';
  }
  const have = new Set((cfg.furnitureInstances || []).map(i => i.instanceId));
  const defaultById = Object.fromEntries(DEFAULT_CONFIG.furnitureInstances.map(i => [i.instanceId, i]));
  cfg.furnitureInstances = cfg.furnitureInstances || [];
  for (const inst of cfg.furnitureInstances) {
    const d = defaultById[inst.instanceId];
    if (d) {
      inst.sceneId = d.sceneId;
      inst.templateId = d.templateId;
      inst.anchorCol = d.anchorCol;
      inst.anchorRow = d.anchorRow;
    }
  }
  for (const inst of DEFAULT_CONFIG.furnitureInstances) {
    if (!have.has(inst.instanceId)) {
      cfg.furnitureInstances.push(JSON.parse(JSON.stringify(inst)));
    }
  }
}

function migrateRelationStageLabelColumns(cfg) {
  const axes = cfg.relationPanelConfig?.axisStageLabels || {};
  const defaults = DEFAULT_CONFIG.relationPanelConfig?.axisStageLabels || {};
  const wrongLabelSequences = {
    affection: ['反目成仇', '貌合神离', '', '怦然心动', '情根深种', '生死相许'],
    friendship: ['形同陌路', '话不投机', '萍水相逢', '泛泛之交', '意气相投', '莫逆之交'],
    submission: ['公然抗命', '消极怠工', '', '安分随时', '恭顺守礼', '唯命是从'],
    care: ['厌弃欲逐', '苛责刁难', '颐指气使', '公事公办', '善待宽厚', '宠信有加'],
  };
  for (const [axis, wrongLabels] of Object.entries(wrongLabelSequences)) {
    const rows = axes[axis];
    const defRows = defaults[axis];
    if (!rows?.length || rows.length !== wrongLabels.length || defRows?.length !== rows.length) continue;
    const looksLikeWrongImport = rows.every((row, i) => (row.label || '') === wrongLabels[i]);
    const usesRelationNameAsLabel = rows.some(row => row.relationName && row.label === row.relationName);
    if (!looksLikeWrongImport && !usesRelationNameAsLabel) continue;
    rows.forEach((row, i) => {
      row.label = defRows[i].label || '';
      row.alt = defRows[i].alt || '';
      row.plain = defRows[i].plain || '';
    });
  }
}

function getFurnitureConfig() {
  return CONFIG.furnitureConfig || DEFAULT_CONFIG.furnitureConfig;
}

function isEssentialFurniture(tpl) {
  if (!tpl) return false;
  if (typeof tpl.essential === 'boolean') return tpl.essential;
  const ess = getFurnitureConfig().essentialCategories || [];
  return ess.includes(tpl.category);
}

function getLifeLineTip(tpl) {
  if (!tpl?.lifeLine) return '';
  const labels = getFurnitureConfig().lifeLineLabels || {};
  const tag = labels[tpl.lifeLine] || tpl.lifeLine;
  return isEssentialFurniture(tpl) ? `${tag}·基础` : tag;
}

function saveConfigToStorage() {
  localStorage.setItem('dgy_config', JSON.stringify(CONFIG));
}

function deepMerge(base, patch) {
  for (const k of Object.keys(patch)) {
    if (patch[k] && typeof patch[k] === 'object' && !Array.isArray(patch[k]))
      base[k] = deepMerge(base[k] || {}, patch[k]);
    else base[k] = patch[k];
  }
  return base;
}
