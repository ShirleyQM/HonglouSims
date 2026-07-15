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
let aiSlowCursor = 0;
const AI_SLOW_BATCH_SIZE = 8;

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
    dailyRoutine: { day: gameDay, completed: {} },
    currentRoutineAnchor: null,
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

function ensureDailyRoutine(c) {
  if (!c?.ai) return { day: gameDay, completed: {} };
  if (!c.ai.dailyRoutine || c.ai.dailyRoutine.day !== gameDay) {
    c.ai.dailyRoutine = { day: gameDay, completed: {} };
  }
  c.ai.dailyRoutine.completed ||= {};
  return c.ai.dailyRoutine;
}

function aiRoutineCompleted(c, anchorId) {
  return !!ensureDailyRoutine(c).completed?.[anchorId];
}

function markAIRoutineCompleted(c, anchorId, source = {}) {
  if (!c?.ai || !anchorId || aiRoutineCompleted(c, anchorId)) return;
  const store = ensureDailyRoutine(c);
  store.completed[anchorId] = {
    ts: getGameTimestamp(),
    hour: gameHour,
    minute: Math.floor(gameMinute || 0),
    ...source,
  };
  markAIDirty(c);
  EventBus.emit('ai:routine_completed', {
    charId: c.id,
    anchorId,
    anchorName: source.anchorName || anchorId,
    sourceType: source.sourceType || '',
    category: source.category || '',
    day: store.day,
  });
  if (c.ai.currentRoutineAnchor?.id === anchorId) c.ai.currentRoutineAnchor = null;
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
  completeRoutineAnchorsForAction(c, {
    kind: 'interaction',
    category: evt.category,
    tags: ['social', evt.category].filter(Boolean),
    sourceType: 'interaction',
    actionId: evt.interactionId,
  });
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

function getRoutineGridConfig() {
  return {
    ...DEFAULT_CONFIG.aiConfig.routineGridConfig,
    ...(getAIConfig().routineGridConfig || {}),
  };
}

function getRoutineTemplates() {
  const templates = getAIConfig().routineTemplates;
  return Array.isArray(templates) ? templates : [];
}

function getRoutineTemplateById(id) {
  return getRoutineTemplates().find(t => t.id === id) || {};
}

function getRoutineProfilesConfig() {
  return getAIConfig().routineProfiles || {};
}

function getRoutineRowsDefinition() {
  const fallback = [
    { id: 'need', name: '需求', icon: '◇' },
    { id: 'skill', name: '技能', icon: '◇' },
    { id: 'profession', name: '职业', icon: '◇' },
  ];
  const rows = getRoutineGridConfig().rowDefs || [];
  const ids = rows.map(row => row?.id);
  if (ids.includes('need') && ids.includes('skill') && ids.includes('profession')) {
    return ['need', 'skill', 'profession'].map(id => rows.find(row => row?.id === id)).filter(Boolean);
  }
  return fallback;
}

function normalizeRoutineRowId(rowId, template = {}) {
  const rows = getRoutineRowsDefinition();
  const valid = new Set(rows.map(row => row.id));
  const id = String(rowId || '').trim();
  if (valid.has(id)) return id;
  const category = String(template.category || template.templateGroup || '').trim();
  if (category === 'profession') return 'profession';
  if (category === 'skill' || (template.requiredSkills || []).length) return 'skill';
  return 'need';
}

function getRoutineTemplateByCategory(category) {
  const c = String(category || '').trim();
  return getRoutineTemplates().filter(tpl => String(tpl.category || 'common') === c);
}

function resolveRoutineAnchorExecutionProfile(tpl = {}, block = {}) {
  const completeBy = {
    categories: [...new Set([...(tpl.completeBy?.categories || []), ...(block.completeBy?.categories || []), ...(block.categories || [])].filter(Boolean))],
    tags: [...new Set([...(tpl.completeBy?.tags || []), ...(block.completeBy?.tags || []), ...(block.tags || [])].filter(Boolean))],
  };
  const req = collectActionRequirementProfile({
    requiredProfessions: [...new Set([...(tpl.requiredProfessions || []), ...(block.requiredProfessions || []), ...(tpl.professionTags || [])].filter(Boolean))],
    requiredSkills: [...new Set([...(tpl.requiredSkills || []), ...(block.requiredSkills || [])].filter(Boolean))],
    requiredFurniture: [...new Set([...(tpl.requiredFurniture || []), ...(block.requiredFurniture || [])].filter(Boolean))],
    requiredProfessionTags: [...new Set([...(tpl.requiredProfessionTags || []), ...(block.requiredProfessionTags || [])].filter(Boolean))],
    skill: tpl.skill || block.skill,
    skills: [
      ...(tpl.skills || []),
      ...(block.skills || []),
      ...(tpl.skillTags || []),
      ...(block.skillTags || []),
    ].filter(Boolean),
    skillReq: tpl.skillReq || block.skillReq,
  });
  return {
    requirementProfile: req,
    requiredProfessions: req.requiredProfessions,
    requiredSkills: req.requiredSkills,
    requiredSkillsDetail: req.requiredSkillsDetail,
    requiredSkillMap: req.requiredSkillMap,
    requiredFurniture: req.requiredFurniture,
    completeBy,
    socialTags: [...new Set([...(tpl.socialTags || []), ...(block.socialTags || [])].filter(Boolean))],
    furnitureTags: [...new Set([...(tpl.furnitureTags || []), ...(block.furnitureTags || [])].filter(Boolean))],
  };
}

function getRoutineGridSlotMinutes() {
  const cfg = getRoutineGridConfig();
  return Math.max(1, Math.round((cfg.slotMinutes || 30)));
}

function normalizeRoutineSlot(raw, fallback = 0) {
  const cfg = getRoutineGridConfig();
  const slotCount = Math.max(1, Math.round(cfg.slotsPerDay || 48));
  const v = Number(raw);
  if (!Number.isFinite(v)) return fallback;
  const daySlots = 24 * 60 / Math.max(1, Math.round(cfg.slotMinutes || 30));
  if (Math.abs(v) <= slotCount * 2) {
    const maybe = Math.round(v * (slotCount / 24));
    return ((maybe % slotCount) + slotCount) % slotCount;
  }
  return ((Math.round(v) % daySlots) + daySlots) % daySlots;
}

function normalizeRoutineDuration(raw, { from = 0, to } = {}) {
  const cfg = getRoutineGridConfig();
  const slotCount = Math.max(1, cfg.slotsPerDay || 48);
  const maxSpan = Math.max(1, cfg.maxSpanSlots || 16);
  let duration = Number(raw);
  if (!Number.isFinite(duration) || duration <= 0) {
    let fromSlot = normalizeRoutineSlot(from, 0);
    let toSlot = normalizeRoutineSlot(to, fromSlot + 1);
    if (toSlot <= fromSlot) toSlot += slotCount;
    duration = Math.max(1, toSlot - fromSlot);
  }
  duration = Math.max(1, Math.round(duration));
  return Math.max(1, Math.min(maxSpan, duration));
}

function getCharacterProfessionTags(c) {
  const def = getCharDef(c?.id) || {};
  const identity = c?.identity || {};
  const raw = [
    def.profession,
    def.professions,
    def.career,
    def.careerPath,
    identity.profession,
    identity.professions,
    identity.career,
    def.identity?.profession,
    def.identity?.careers,
    c?.profession,
    c?.career,
  ];
  const out = [];
  for (const row of raw) {
    if (!row) continue;
    if (Array.isArray(row)) out.push(...row);
    else out.push(row);
  }
  return [...new Set(out.filter(Boolean).map(v => String(v).trim()).filter(Boolean))];
}

function normalizeTextList(raw) {
  const out = [];
  const push = value => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    const text = String(value).trim();
    if (text) out.push(text);
  };
  if (typeof raw === 'string') {
    push(raw);
  } else if (Array.isArray(raw)) {
    raw.forEach(push);
  } else if (raw && typeof raw === 'object') {
    // 部分旧数据把关键词用对象存储，兜底时取键名，便于扩展
    for (const key of Object.keys(raw)) push(key);
  }
  return [...new Set(out.filter(Boolean))];
}

function normalizeSkillRequirementEntries(raw) {
  const map = new Map();
  const add = (skill, level = 0) => {
    const s = String(skill).trim();
    if (!s) return;
    const lv = Number(level);
    const next = Number.isFinite(lv) ? Math.max(0, Math.round(lv)) : 0;
    const prev = map.get(s);
    map.set(s, typeof prev === 'number' ? Math.max(prev, next) : next);
  };
  const addOne = value => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach(addOne);
      return;
    }
    if (typeof value === 'string') {
      add(value, 0);
      return;
    }
    if (typeof value === 'object') {
      if (value.skill) {
        add(value.skill, value.level);
        return;
      }
      for (const [sid, lv] of Object.entries(value)) {
        if (Array.isArray(lv) || typeof lv === 'object' && lv?.skill) {
          addOne(lv);
          continue;
        }
        if (typeof lv === 'number' || typeof lv === 'string') {
          add(sid, lv);
          continue;
        }
        if (typeof lv === 'boolean') {
          if (lv) add(sid, 0);
          continue;
        }
      }
    }
  };
  addOne(raw);
  return [...map.entries()].map(([skill, level]) => ({ skill, level }));
}

function normalizeSkillRequirementMap(raw) {
  return normalizeSkillRequirementEntries(raw).reduce((acc, row) => {
    acc[row.skill] = row.level;
    return acc;
  }, {});
}

function collectActionRequirementProfile(raw = {}) {
  const requiredProfessions = [
    ...(normalizeTextList(raw.requiredProfessionTags)),
    ...(normalizeTextList(raw.professionTags)),
    ...(normalizeTextList(raw.requiredProfessions)),
  ];
  const requiredSkillsList = [
    ...normalizeSkillRequirementEntries(raw.requiredSkills),
    ...normalizeSkillRequirementEntries(raw.skills),
    ...normalizeSkillRequirementEntries(raw.skillTags),
    ...normalizeSkillRequirementEntries(raw.skillReq),
    ...normalizeSkillRequirementEntries(raw.requiredSkill),
  ];
  const requiredSkillsDetail = requiredSkillsList.reduce((acc, row) => {
    const existing = acc.find(item => item.skill === row.skill);
    if (existing) existing.level = Math.max(existing.level, row.level);
    else acc.push(row);
    return acc;
  }, []);
  const requiredSkillMap = requiredSkillsDetail.reduce((acc, row) => {
    acc[row.skill] = row.level;
    return acc;
  }, {});
  const requiredFurniture = [
    ...(normalizeTextList(raw.requiredFurniture)),
    ...(normalizeTextList(raw.furnitureTags)),
    ...(normalizeTextList(raw.furnitureTag)),
  ];
  return {
    requiredProfessions: [...new Set(requiredProfessions.filter(Boolean))],
    requiredSkillsDetail,
    requiredSkills: [...new Set(requiredSkillsDetail.map(r => r.skill).filter(Boolean))],
    requiredSkillMap,
    requiredFurniture: [...new Set(requiredFurniture.filter(Boolean))],
  };
}

function getCharacterSkillLevels(c) {
  const def = getCharDef(c?.id) || {};
  const out = {};
  const add = (id, level = 1) => {
    const key = String(id).trim();
    if (!key) return;
    const lv = Number(level);
    const next = Number.isFinite(lv) ? Math.max(0, Math.round(lv)) : 1;
    if (!out[key]) out[key] = Math.max(out[key], next);
    else out[key] = Math.max(out[key], next);
  };
  const addList = value => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(skill => add(skill, 1));
      return;
    }
    if (typeof value !== 'object') {
      add(value, 1);
      return;
    }
    for (const [skill, lv] of Object.entries(value)) {
      if (Array.isArray(lv) || typeof lv === 'object') continue;
      add(skill, lv || 1);
    }
  };
  addList(c?.skills);
  addList(c?.skillLevels);
  addList(def.skills);
  addList(def.skillLevels);
  return out;
}

function getCharacterSkillIds(c) {
  return [...new Set(Object.keys(getCharacterSkillLevels(c)))];
}

function matchActionRequirementState(c, reqProfile = {}) {
  const actorSkills = getCharacterSkillLevels(c);
  const actorProfessions = getCharacterProfessionTags(c);
  const reqProfessions = reqProfile.requiredProfessions || [];
  const reqSkills = reqProfile.requiredSkillsDetail || [];
  const professionMatch = !reqProfessions.length || reqProfessions.some(id => actorProfessions.includes(id));
  const skillMatch = !reqSkills.length || reqSkills.some(row => (actorSkills[row.skill] || 0) >= row.level);
  const reasons = [];
  if (reqProfessions.length && !professionMatch) {
    const missing = reqProfessions.filter(p => !actorProfessions.includes(p));
    reasons.push(`职业标签不足：${missing.join('、')}`);
  }
  if (reqSkills.length && !skillMatch) {
    const missing = reqSkills.map(row => `${row.skill}${row.level ? ` Lv.${row.level}` : ''}`);
    reasons.push(`技能标签不足：${missing.join('、')}`);
  }
  return { actorProfessions, actorSkills, professionMatch, skillMatch, reasons };
}

function normalizeRoutineProfileBlock(block = {}) {
  const cfg = getRoutineGridConfig();
  const slotCount = Math.max(1, Math.round(cfg.slotsPerDay || 48));
  const directSlotRaw = block.startSlot ?? block.fromSlot;
  const directSlot = Number(directSlotRaw);
  const normalizedFrom = Number.isFinite(directSlot)
    ? ((Math.round(directSlot) % slotCount) + slotCount) % slotCount
    : normalizeRoutineSlot(block.from, 0);
  const normalizedDuration = normalizeRoutineDuration(block.durationSlots || block.duration, {
    from: normalizedFrom,
    to: block.toSlot != null ? block.toSlot : block.to,
  });
  const rowDefs = getRoutineRowsDefinition();
  const template = getRoutineTemplateById(block.templateId);
  const rowId = normalizeRoutineRowId(block.rowId || block.row || template.defaultRow || rowDefs[0]?.id || 'need', template);
  const maxSpan = Math.max(1, Math.min((cfg.maxRowSpan || 2), rowDefs.length || 1));
  const rowSpan = Math.max(1, Math.min(maxSpan, Number(block.rowSpan) || Number(block.spanRows) || 1));
  return {
    ...block,
    id: block.id || `${rowId}-${template.id || 'block'}-${normalizedFrom}`,
    startSlot: ((normalizedFrom % slotCount) + slotCount) % slotCount,
    durationSlots: normalizedDuration,
    duration: normalizedDuration,
    rowId,
    rowSpan,
  };
}

function routineProjectionSourceTypes() {
  return ['dutyQuest', 'followRotation', 'lifePathDaily', 'professionDaily'];
}

function isRoutineProjectionBlock(block = {}) {
  return !!(block.isRoutineProjection || routineProjectionSourceTypes().includes(block.sourceType));
}

function getQuestTemplateForRoutineProjection(templateId) {
  if (templateId == null) return null;
  if (typeof QuestSystem !== 'undefined' && QuestSystem?.tpl) {
    const tpl = QuestSystem.tpl(templateId);
    if (tpl) return tpl;
  }
  return CONFIG.questConfig?.templates?.[templateId]
    || DEFAULT_CONFIG.questConfig?.templates?.[templateId]
    || null;
}

function getServantContractForRoutineProjection(contractId) {
  if (!contractId) return null;
  if (typeof ServantRelationSystem !== 'undefined' && ServantRelationSystem?.getContract) {
    const contract = ServantRelationSystem.getContract(contractId);
    if (contract) return contract;
  }
  return (CONFIG.questConfig?.servantConfig?.contracts || []).find(row => row.id === contractId) || null;
}

function resolveDutyRoutineProjection(rule = {}) {
  if (typeof ServantRelationSystem !== 'undefined' && ServantRelationSystem?.resolveDutyRoutine) {
    return ServantRelationSystem.resolveDutyRoutine(rule);
  }
  const contract = getServantContractForRoutineProjection(rule.contractId);
  if (!contract) return null;
  return {
    ...rule,
    contract,
    masterId: contract.masterId,
    charId: contract.servantId,
    dailySlotId: `servant:${contract.id}:${rule.slotId || rule.templateId}`,
  };
}

function resolveFollowRotationProjection(rule = {}) {
  if (typeof ServantRelationSystem !== 'undefined' && ServantRelationSystem?.resolveFollowRotation) {
    return ServantRelationSystem.resolveFollowRotation(rule);
  }
  const day = typeof gameDay !== 'undefined' ? gameDay : 1;
  const weekday = (((day || 1) - 1) % 7) + 1;
  const row = (rule.rotation || []).find(item => item.weekday === weekday);
  if (!row) return null;
  const servantId = row.servantId || row.character_id || row.charId;
  const contract = (CONFIG.questConfig?.servantConfig?.contracts || [])
    .find(item => item.masterId === rule.masterId && item.servantId === servantId);
  if (!contract) return null;
  return {
    ...rule,
    weekday,
    contract,
    masterId: rule.masterId,
    charId: servantId,
    dailySlotId: `follow:${rule.masterId}:${servantId}:${rule.slotId || rule.templateId}:${weekday}`,
  };
}

function routineQuestProjectionDurationSlots(tpl = {}) {
  const cfg = getRoutineGridConfig();
  const slotMinutes = Math.max(1, cfg.slotMinutes || 30);
  const maxSpan = Math.max(1, cfg.maxSpanSlots || 16);
  const target = Math.max(0, ...(tpl.completeConditions || []).map(cond => Number(cond.targetValue) || 0));
  if (target > 0) return Math.max(1, Math.min(maxSpan, Math.ceil(target / slotMinutes)));
  if (tpl.deadlineMode === 'GAME_HOURS' && tpl.deadlineParam) {
    return Math.max(1, Math.min(maxSpan, Math.ceil(Number(tpl.deadlineParam) * 2)));
  }
  return 2;
}

function routineProjectionStartSlot(triggerHour = 8) {
  const cfg = getRoutineGridConfig();
  const slotMinutes = Math.max(1, cfg.slotMinutes || 30);
  const slotCount = Math.max(1, cfg.slotsPerDay || 48);
  const raw = Number(triggerHour);
  const minutes = Number.isFinite(raw) ? (raw <= 24 ? raw * 60 : raw) : 8 * 60;
  return ((Math.round(minutes / slotMinutes) % slotCount) + slotCount) % slotCount;
}

function routineProjectionNeedsForQuest(tpl = {}) {
  const category = tpl.category || '';
  if (category === '洒扫') return ['hygiene', 'mood'];
  if (category === '跟随' || category === '陪伴' || category === '侍奉') return ['social', 'mood'];
  if (category === '传话') return ['social'];
  if (category === '采办' || category === '跑腿') return ['fun', 'mood'];
  return ['mood'];
}

function routineProjectionMatchProfileForQuest(tpl = {}) {
  const categories = new Set();
  const tags = new Set(['quest', 'task', 'profession']);
  if (tpl.category) {
    categories.add(tpl.category);
    tags.add(tpl.category);
  }
  for (const cond of tpl.completeConditions || []) {
    const type = cond.type || '';
    const target = cond.target;
    if (type === 'FOLLOW_CHARACTER') {
      categories.add('social');
      categories.add('xujiu');
      tags.add('social');
      tags.add('movement');
      tags.add('follow');
      tags.add('跟随');
    } else if (type === 'INTERACT_WITH' || type === 'INTERACT_WITH_DURATION') {
      ['social', 'xujiu', 'weijie', 'chuanqing', 'lundao'].forEach(v => categories.add(v));
      tags.add('social');
      tags.add('陪伴');
    } else if (type === 'USE_FURNITURE' || type === 'USE_FURNITURE_DURATION') {
      if (target) categories.add(String(target));
      if (target === 'desk') categories.add('workdesk');
      if (target === 'workdesk') categories.add('desk');
      tags.add('furniture');
    } else if (type === 'STAY_IN_SCENE') {
      tags.add('movement');
      tags.add('scene');
      tags.add('stay');
    }
  }
  const boost = {};
  [...categories, ...tags].filter(Boolean).forEach(key => {
    boost[key] = Math.max(boost[key] || 1, key === 'movement' || key === 'follow' || key === '跟随' ? 1.8 : 1.35);
  });
  boost.quest = Math.max(boost.quest || 1, 1.45);
  boost.task = Math.max(boost.task || 1, 1.35);
  return {
    completeBy: { categories: [...categories], tags: [...tags] },
    boost,
  };
}

function routineProjectionBlockFromQuest(c, source = {}, sourceType = 'dutyQuest') {
  const tpl = getQuestTemplateForRoutineProjection(source.templateId);
  if (!c?.id || !tpl) return null;
  const contract = source.contract || getServantContractForRoutineProjection(source.contractId);
  const match = routineProjectionMatchProfileForQuest(tpl);
  const completeType = tpl.completeConditions?.[0]?.type || '';
  return normalizeRoutineProfileBlock({
    id: `${sourceType}:${source.dailySlotId || source.contractId || source.masterId || c.id}:${source.templateId}`,
    name: tpl.name || source.slotId || '职业日课',
    templateId: 'routine_custom',
    rowId: 'profession',
    rowSpan: 1,
    startSlot: routineProjectionStartSlot(source.triggerHour),
    durationSlots: routineQuestProjectionDurationSlots(tpl),
    sourceType,
    isRoutineProjection: true,
    isLocked: true,
    locked: true,
    questTemplateId: source.templateId,
    contractId: contract?.id || source.contractId || '',
    masterId: source.masterId || contract?.masterId || '',
    role: contract?.role || '',
    priority: sourceType === 'followRotation' ? 'followDuty' : 'duty',
    priorityWeight: sourceType === 'followRotation' ? 90 : 80,
    completeConditionType: completeType,
    requiredProfessions: [contract?.role, ...(contract?.dutyCategories || [])].filter(Boolean),
    needs: routineProjectionNeedsForQuest(tpl),
    completeBy: match.completeBy,
    boost: match.boost,
    cut: { fun: 0.8 },
    completeCut: { quest: 0.55, task: 0.55 },
  });
}

function routineProjectionBlocksForCharacter(c) {
  if (!c?.id) return [];
  const servantCfg = CONFIG.questConfig?.servantConfig || {};
  const dutyRules = typeof ServantRelationSystem !== 'undefined' && ServantRelationSystem?.dutyRoutines
    ? ServantRelationSystem.dutyRoutines()
    : (servantCfg.dutyRoutines || []);
  const followRules = typeof ServantRelationSystem !== 'undefined' && ServantRelationSystem?.followRotations
    ? ServantRelationSystem.followRotations()
    : (servantCfg.followRotations || []);
  const rows = [];
  for (const rule of dutyRules) {
    const resolved = resolveDutyRoutineProjection(rule);
    if (resolved?.charId !== c.id) continue;
    const block = routineProjectionBlockFromQuest(c, resolved, 'dutyQuest');
    if (block) rows.push(block);
  }
  for (const rule of followRules) {
    const resolved = resolveFollowRotationProjection(rule);
    if (resolved?.charId !== c.id) continue;
    const block = routineProjectionBlockFromQuest(c, resolved, 'followRotation');
    if (block) rows.push(block);
  }
  return rows;
}

function routineMergeSlots(block = {}) {
  const cfg = getRoutineGridConfig();
  const slotCount = Math.max(1, cfg.slotsPerDay || 48);
  const normalized = normalizeRoutineProfileBlock(block);
  return Array.from({ length: normalized.durationSlots || 1 }, (_, i) => (normalized.startSlot + i) % slotCount);
}

function routineAvailableMergeDuration(block = {}, occupied = new Set()) {
  const cfg = getRoutineGridConfig();
  const slotCount = Math.max(1, cfg.slotsPerDay || 48);
  const normalized = normalizeRoutineProfileBlock(block);
  let available = 0;
  for (let i = 0; i < normalized.durationSlots; i++) {
    const slot = (normalized.startSlot + i) % slotCount;
    if (occupied.has(slot)) break;
    available++;
  }
  return available;
}

function routineOccupyMergeSlots(block = {}, occupied = new Set()) {
  for (const slot of routineMergeSlots(block)) occupied.add(slot);
}

function mergeRoutineProjectionBlocks(c, profile = {}) {
  const projections = routineProjectionBlocksForCharacter(c)
    .sort((a, b) => (b.priorityWeight || 0) - (a.priorityWeight || 0) || a.startSlot - b.startSlot);
  const baseBlocks = (Array.isArray(profile.blocks) ? profile.blocks : [])
    .filter(block => !isRoutineProjectionBlock(block))
    .map(block => normalizeRoutineProfileBlock(block));
  if (!projections.length) return { ...profile, blocks: baseBlocks };
  const occupied = new Set();
  const acceptedProjections = [];
  for (const block of projections) {
    const available = routineAvailableMergeDuration(block, occupied);
    if (available < 1) continue;
    const next = normalizeRoutineProfileBlock({ ...block, durationSlots: available, duration: available });
    acceptedProjections.push(next);
    routineOccupyMergeSlots(next, occupied);
  }
  const acceptedBase = [];
  for (const block of baseBlocks) {
    const available = routineAvailableMergeDuration(block, occupied);
    if (available < 1) continue;
    const next = normalizeRoutineProfileBlock({ ...block, durationSlots: available, duration: available });
    acceptedBase.push(next);
    routineOccupyMergeSlots(next, occupied);
  }
  return {
    ...profile,
    blocks: [...acceptedBase, ...acceptedProjections].sort((a, b) => a.startSlot - b.startSlot || (a.rowId || '').localeCompare(b.rowId || '')),
  };
}

function getBaseRoutineProfileForCharacter(c) {
  const cfg = getRoutineProfilesConfig();
  const defaults = Array.isArray(cfg.defaults) ? cfg.defaults : [];
  const byCharacter = cfg.byCharacter || {};
  const byId = id => defaults.find(p => p?.id === id);
  const charDef = c ? byCharacter[c.id] : null;
  if (typeof charDef === 'string' && charDef) {
    const p = byId(charDef);
    if (p) return JSON.parse(JSON.stringify(p));
  }
  if (charDef && Array.isArray(charDef.blocks)) {
    return {
      ...charDef,
      blocks: JSON.parse(JSON.stringify(charDef.blocks.map(row => normalizeRoutineProfileBlock(row)))),
    };
  }
  if (charDef && Array.isArray(charDef)) {
    return {
      id: `${c.id}_legacy`,
      name: `${c.name} · 起居注`,
      blocks: JSON.parse(JSON.stringify(charDef.map(row => normalizeRoutineProfileBlock(row)))),
    };
  }
  const defaultId = cfg.defaultProfileId || 'default';
  return JSON.parse(JSON.stringify(byId(defaultId) || defaults[0] || {
    id: 'legacy_default',
    name: '默认作息',
    blocks: [],
  }));
}

function getRoutineProfileForCharacter(c) {
  return mergeRoutineProjectionBlocks(c, getBaseRoutineProfileForCharacter(c));
}

function setRoutineProfileForCharacter(c, profile) {
  const cfg = getRoutineProfilesConfig();
  if (!cfg.byCharacter) cfg.byCharacter = {};
  if (!c?.id) return null;
  const defaults = Array.isArray(cfg.defaults) ? cfg.defaults : [];
  if (typeof profile === 'string') {
    const byId = defaults.find(p => p?.id === profile);
    cfg.byCharacter[c.id] = JSON.parse(JSON.stringify(byId || defaults[0] || { id: 'custom', name: '默认作息', blocks: [] }));
    return cfg.byCharacter[c.id];
  }
  const copy = JSON.parse(JSON.stringify(profile || {}));
  const safe = {
    id: copy?.id || `${c.id}_custom`,
    name: copy?.name || `${c.short || c.name || '人物'} · 起居注`,
    blocks: (Array.isArray(copy?.blocks) ? copy.blocks : [])
      .filter(b => !isRoutineProjectionBlock(b))
      .map(b => normalizeRoutineProfileBlock(b)),
    tags: Array.isArray(copy?.tags) ? copy.tags : [],
  };
  if (copy.weeklyProfiles && typeof copy.weeklyProfiles === 'object') {
    safe.weeklyProfiles = Object.entries(copy.weeklyProfiles).reduce((acc, [weekday, row]) => {
      const blocks = Array.isArray(row?.blocks) ? row.blocks : [];
      acc[weekday] = {
        ...row,
        blocks: blocks.filter(b => !isRoutineProjectionBlock(b)).map(b => normalizeRoutineProfileBlock(b)),
      };
      return acc;
    }, {});
  }
  cfg.byCharacter[c.id] = safe;
  return safe;
}

function getRoutineProfileCompliance(c, anchor) {
  if (!c || !anchor) return {
    icon: '😊',
    state: 'good',
    detail: '与当前设定匹配良好',
    reasons: [],
    badge: '可执行',
  };
  if (anchor.isLocked) {
    return {
      icon: '🔒',
      state: 'locked',
      detail: '该时段已锁定',
      reasons: ['该时段锁定，不推荐修改'],
      badge: '锁',
    };
  }
  const cap = resolveRoutineExecutionCapabilityForCharacter(c, anchor);
  const req = cap.requirementMatch || { professionMatch: true, skillMatch: true, reasons: [] };
  const identity = getRoutineIdentityMatch(c, anchor);
  const detail = req.reasons?.length
    ? `尚有冲突：${req.reasons.join('；')}`
    : identity >= 0.9
      ? '角色倾向与此作息贴近'
      : identity >= 0.7
        ? '该时段与角色身份有一定冲突，可能偶有变动'
        : '与性格/身份冲突较大，较可能不遵守';
  const icon = req.professionMatch && req.skillMatch
    ? (identity >= 0.9 ? '😊' : '😐')
    : '😣';
  const state = req.professionMatch && req.skillMatch
    ? (identity >= 0.9 ? 'good' : 'warn')
    : 'bad';
  return {
    icon,
    state,
    detail,
    reasons: req.reasons || [],
    badge: `${cap.requiredProfessions.length ? '职业' : ''}${cap.requiredProfessions.length && cap.requiredSkills.length ? '/' : ''}${cap.requiredSkills.length ? '技能' : ''}匹配`,
  };
}

function getRoutineScheduledProfilesMeta() {
  const cfg = getRoutineProfilesConfig();
  if (!cfg.meta) cfg.meta = {};
  return cfg.meta;
}

function scheduleRoutineProfileForTomorrow(c, profile) {
  if (!c?.id) return;
  const meta = getRoutineScheduledProfilesMeta();
  meta.nextDay = meta.nextDay || {};
  meta.nextDay[c.id] = {
    day: gameDay + 1,
    profile: JSON.parse(JSON.stringify(profile || getRoutineProfileForCharacter(c))),
  };
}

function scheduleRoutineProfileForWeek(c, profile) {
  if (!c?.id) return;
  const meta = getRoutineScheduledProfilesMeta();
  meta.week = meta.week || {};
  meta.week[c.id] = {
    dayStart: gameDay,
    dayEnd: gameDay + 6,
    profile: JSON.parse(JSON.stringify(profile || getRoutineProfileForCharacter(c))),
  };
}

function popRoutineProfileHistory(c) {
  if (!c?.id) return null;
  const meta = getRoutineProfilesConfig().meta || {};
  const list = Array.isArray(meta.history?.[c.id]) ? [...meta.history[c.id]] : [];
  const targetDay = gameDay - 1;
  const exact = list.find(row => row.day === targetDay);
  if (exact) return exact;
  list.sort((a, b) => b.day - a.day);
  return list[0] || null;
}

function saveRoutineProfileHistory(c, profile) {
  if (!c?.id) return;
  const meta = getRoutineProfilesConfig();
  meta.meta ||= {};
  meta.meta.history ||= {};
  const target = meta.meta.history[c.id] || [];
  const entry = {
    day: gameDay,
    profile: JSON.parse(JSON.stringify(profile || getRoutineProfileForCharacter(c))),
  };
  target.push(entry);
  meta.meta.history[c.id] = target.filter((row, i, arr) => arr.findIndex(r => r.day === row.day) === i).slice(-12);
}

function resolveRoutineProfileScheduleRules(c) {
  const cfg = getRoutineProfilesConfig().meta || {};
  if (!c?.id) return;
  const metaNext = cfg.nextDay?.[c.id];
  if (metaNext && metaNext.day === gameDay) {
    setRoutineProfileForCharacter(c, metaNext.profile || {});
    delete cfg.nextDay[c.id];
    return true;
  }
  const w = cfg.week?.[c.id];
  if (w && w.dayStart != null && w.dayEnd != null && w.dayStart <= gameDay && gameDay <= w.dayEnd) {
    setRoutineProfileForCharacter(c, w.profile || {});
    return true;
  }
  if (w && w.dayEnd != null && gameDay > w.dayEnd) {
    delete cfg.week[c.id];
  }
  return false;
}

function getRoutineAnchorFromProfileBlock(block = {}, opts = {}) {
  const cfg = getRoutineGridConfig();
  const slotMinutes = cfg.slotMinutes || 30;
  const slotCount = cfg.slotsPerDay || 48;
  const rowDefs = getRoutineRowsDefinition();
  const rowTotal = Math.max(1, rowDefs.length || 1);
  const rowMap = {};
  for (let i = 0; i < rowDefs.length; i++) rowMap[rowDefs[i].id] = i;
  const tpl = getRoutineTemplateById(block.templateId);
  const executionProfile = resolveRoutineAnchorExecutionProfile(tpl, block);
  const normalized = normalizeRoutineProfileBlock(block);
  const fromSlot = normalized.startSlot;
  const durationSlots = normalized.durationSlots;
  const rowId = normalized.rowId || block.rowId || block.row || tpl.defaultRow || tpl.rows?.[0] || rowDefs[0].id;
  const rowSpan = Math.max(1, Math.min(Math.max(1, cfg.maxRowSpan || rowTotal || 1), normalized.rowSpan || 1));
  const rowIndex = rowMap[rowId] ?? 0;
  const completeBy = executionProfile.completeBy;
  return {
    id: block.id || `${rowId}-${block.templateId || 'block'}-${fromSlot}`,
    name: block.name || tpl.name || block.templateId || '活动',
    from: fromSlot * slotMinutes,
    to: (fromSlot + durationSlots) * slotMinutes,
    needs: [...new Set([...(tpl.needs || []), ...(block.needs || [])])],
    completeBy,
    boost: block.boost || tpl.boost || {},
    cut: block.cut || tpl.cut || {},
    completeCut: block.completeCut || tpl.completeCut || {},
    habitShift: block.habitShift || tpl.habitShift,
    professionTags: executionProfile.requiredProfessions,
    requiredSkills: executionProfile.requiredSkills,
    requiredFurniture: executionProfile.requiredFurniture,
    executionProfile,
    requiredProfessions: [...new Set([...(tpl.requiredProfessions || []), ...(block.requiredProfessions || [])].filter(Boolean))],
    rowId,
    rowIndex,
    rowSpan,
    isLocked: !!(block.isLocked || block.locked),
    sourceTemplateId: block.templateId,
    sourceBlock: block,
  };
}

function getRoutineProfileAnchorsForCharacter(c) {
  const profile = getRoutineProfileForCharacter(c);
  return (profile.blocks || []).map((b, i) => {
    const anchor = getRoutineAnchorFromProfileBlock(b);
    if (!anchor.id) anchor.id = `routine_block_${i}`;
    return anchor;
  }).filter(Boolean);
}

function getLegacyRoutineAnchorRows() {
  return (getAIConfig().routineAnchors || []).map(row => ({
    ...row,
    from: hourToMinutes(row.from),
    to: hourToMinutes(row.to),
    rowIndex: 0,
    rowSpan: 1,
    rowId: 'need',
    isFallback: true,
    fallbackType: 'routineAnchor',
    fallbackSource: 'legacyRoutineAnchors',
  }));
}

function scheduleWindowToRoutineAnchor(win = {}) {
  const tags = [
    ...Object.keys(win.boost || {}),
    ...Object.keys(win.cut || {}),
  ].filter(Boolean);
  const keys = [...new Set(tags)];
  return {
    id: `schedule_${win.id || 'window'}`,
    name: win.name || win.id || '日程兜底',
    from: hourToMinutes(win.from),
    to: hourToMinutes(win.to),
    needs: [],
    completeBy: win.completeBy || { categories: keys, tags: keys },
    boost: win.boost || {},
    cut: win.cut || {},
    completeCut: win.completeCut || {},
    rowIndex: 0,
    rowSpan: 1,
    rowId: 'need',
    isFallback: true,
    fallbackType: 'scheduleWindow',
    fallbackSource: 'legacyScheduleWindows',
    isCompletable: false,
    sourceWindow: win,
  };
}

function getScheduleWindowRoutineAnchors() {
  return (getAIConfig().scheduleWindows || []).map(scheduleWindowToRoutineAnchor);
}

function activeRoutineAnchorsFromRows(c, rows = []) {
  const now = currentMinuteOfDay();
  return rows.filter(anchor => {
    const win = shiftedAnchorWindow(c, anchor);
    return minuteInWindow(now, win.from, win.to);
  });
}

function getRoutineAnchorsForCharacter(c) {
  const profileAnchors = getRoutineProfileAnchorsForCharacter(c);
  if (profileAnchors.length) return profileAnchors;
  return [
    ...getLegacyRoutineAnchorRows(),
    ...getScheduleWindowRoutineAnchors(),
  ];
}

function hourToMinutes(hour) {
  const h = Number(hour);
  if (!Number.isFinite(h)) return 0;
  if (h > 24) return Math.round(h);
  if (h < 0) return (((h % 24) + 24) % 24) * 60;
  if (Number.isInteger(h)) return Math.round(h * 60);
  return Math.round(h * 60);
}

function currentMinuteOfDay() {
  return (gameHour % 24) * 60 + Math.floor(gameMinute || 0);
}

function wrapDayMinute(minute) {
  return ((Math.round(minute) % 1440) + 1440) % 1440;
}

function minuteInWindow(minute, from, to) {
  const m = wrapDayMinute(minute);
  const a = wrapDayMinute(from);
  const b = wrapDayMinute(to);
  if (a <= b) return m >= a && m < b;
  return m >= a || m < b;
}

function scheduleEffects(c) {
  const out = {
    sleepShiftMinutes: 0,
    earlyMinutes: 0,
    deadlineRamp: 1,
    earlySuppression: 1,
    hygieneWeightMultiplier: 1,
    sleepWeightMultiplier: 1,
    morningFocusMultiplier: 1,
    wakeEnergyRatioBonus: 0,
  };
  for (const row of TraitEffectSystem?.effectsOf?.(c) || []) {
    const schedule = row.effects?.schedule || {};
    out.sleepShiftMinutes += schedule.sleepShiftMinutes || 0;
    out.earlyMinutes = Math.max(out.earlyMinutes, schedule.earlyMinutes || 0);
    out.deadlineRamp *= schedule.deadlineRamp || 1;
    out.earlySuppression *= schedule.earlySuppression || 1;
    out.hygieneWeightMultiplier *= schedule.hygieneWeightMultiplier || 1;
    out.sleepWeightMultiplier *= schedule.sleepWeightMultiplier || 1;
    out.morningFocusMultiplier *= schedule.morningFocusMultiplier || 1;
    out.wakeEnergyRatioBonus += schedule.wakeEnergyRatioBonus || 0;
  }
  return out;
}

function shiftedAnchorWindow(c, anchor) {
  const effects = scheduleEffects(c);
  let shift = 0;
  if (anchor.habitShift === 'sleep') shift += effects.sleepShiftMinutes;
  const early = effects.earlyMinutes || 0;
  return {
    from: hourToMinutes(anchor.from) + shift - early,
    to: hourToMinutes(anchor.to) + shift,
    effects,
  };
}

function currentRoutineAnchors(c) {
  const profileAnchors = activeRoutineAnchorsFromRows(c, getRoutineProfileAnchorsForCharacter(c));
  if (profileAnchors.length) return profileAnchors;
  const fallbackAnchors = activeRoutineAnchorsFromRows(c, getLegacyRoutineAnchorRows());
  if (fallbackAnchors.length) return fallbackAnchors;
  return activeRoutineAnchorsFromRows(c, getScheduleWindowRoutineAnchors());
}

function routineAnchorProgress(c, anchor) {
  const win = shiftedAnchorWindow(c, anchor);
  const now = currentMinuteOfDay();
  const from = wrapDayMinute(win.from);
  const to = wrapDayMinute(win.to);
  const span = from <= to ? Math.max(1, to - from) : Math.max(1, 1440 - from + to);
  const elapsed = from <= to
    ? Math.max(0, now - from)
    : (now >= from ? now - from : 1440 - from + now);
  return Math.max(0, Math.min(1, elapsed / span));
}

function getRoutineIdentityMatch(c, anchor) {
  const profile = resolveRoutineExecutionCapabilityForCharacter(c, anchor);
  const reqProf = profile.requiredProfessions || [];
  const reqSkills = profile.requiredSkills || [];
  if (!reqProf.length && !reqSkills.length) return 1;
  const hasReqProf = profile.matchesProfession;
  const hasReqSkill = profile.matchesSkills;
  const base = 1;
  return base * (hasReqProf ? 1 : 0.78) * (hasReqSkill ? 1 : 0.84);
}

function resolveRoutineExecutionCapabilityForCharacter(c, anchor = {}) {
  const actorProfessions = getCharacterProfessionTags(c);
  const actorSkillLevels = getCharacterSkillLevels(c);
  const reqProfile = anchor?.requirementProfile || collectActionRequirementProfile({
    requiredProfessions: [
      ...new Set([
        ...(anchor.requiredProfessions || []),
        ...(anchor.professionTags || []),
        ...(anchor.requiredProfessionTags || []),
      ].filter(Boolean)),
    ],
    requiredSkills: [
      ...(anchor.requiredSkills || []),
      ...(anchor.skills || []),
      ...(anchor.skillTags || []),
    ],
    requiredFurniture: anchor.requiredFurniture || [],
    skillReq: anchor.skillReq || null,
    skill: anchor.skill || null,
    requiredSkill: anchor.requiredSkillMap ? Object.entries(anchor.requiredSkillMap).reduce((acc, row) => {
      if (!row[0] || row[1] <= 1) return acc;
      acc[row[0]] = row[1];
      return acc;
    }, {}) : null,
  });
  const req = matchActionRequirementState(c, reqProfile);
  return {
    actorProfessions,
    actorSkillLevels,
    actorSkillIds: Object.keys(actorSkillLevels || {}),
    requiredProfessions: reqProfile.requiredProfessions || [],
    requiredSkills: reqProfile.requiredSkills || [],
    requiredSkillsDetail: reqProfile.requiredSkillsDetail || [],
    requiredSkillMap: reqProfile.requiredSkillMap || {},
    requiredFurniture: reqProfile.requiredFurniture || [],
    requirementProfile: reqProfile,
    matchesProfession: req.professionMatch,
    matchesSkills: req.skillMatch,
    requirementMatch: req,
  };
}

function resolveRoutineActionRuntimeContext(c, raw = {}) {
  const kind = String(raw.kind || raw.type || '').toLowerCase();
  const tags = new Set(Array.isArray(raw.tags) ? raw.tags : []);
  if (kind === 'interaction' || kind === 'seek') {
    tags.add('social');
    if (raw.category) tags.add(raw.category);
  }
  if (kind === 'furniture') {
    tags.add('furniture');
    if (raw.category) tags.add(raw.category);
  }
  if (raw.questRelated || raw.questUrgent) tags.add('quest');
  const actorProfessions = getCharacterProfessionTags(c);
  const actorSkills = getCharacterSkillIds(c);
  return {
    actionKind: kind,
    category: raw.category || '',
    tags: [...tags].filter(Boolean),
    actor: { actorProfessions, actorSkills },
    requirementProfile: raw.requirementProfile || null,
    // 预留：未来可根据技能/家具/社交系统把此上下文继续下沉到同一评分链
    runtimeIntent: kind === 'interaction' || kind === 'seek'
      ? 'social'
      : (kind === 'furniture' ? 'furniture' : 'general'),
  };
}

function resolveRoutineExecutionInterface(c, action = {}, anchor = null) {
  const actionCtx = resolveRoutineActionRuntimeContext(c, action);
  const capability = resolveRoutineExecutionCapabilityForCharacter(c, anchor || {});
  const requirementMatch = action.requirementMatch || capability.requirementMatch || {};
  return {
    actionKind: actionCtx.runtimeIntent,
    actionCategory: actionCtx.category,
    actionTags: actionCtx.tags,
    anchorId: anchor?.id,
    requirementProfile: actionCtx.requirementProfile || capability.requirementProfile || null,
    requirementMatch,
    actorProfessions: capability.actorProfessions,
    actorSkills: capability.actorSkills,
    anchorRequirements: {
      professions: capability.requiredProfessions,
      skills: capability.requiredSkills,
    },
    matchState: {
      professionMatch: capability.matchesProfession,
      skillMatch: capability.matchesSkills,
    },
    requirementSatisfied: requirementMatch?.professionMatch && requirementMatch?.skillMatch,
    requirements: requirementMatch?.reasons || [],
    // 未来：可直接消费该结果把家具/社交互动的能力匹配接入同一条起居评分链
  };
}

function candMatchesRoutineAnchor(cand, anchor, c, overrideCtx = null) {
  if (!cand || !anchor) return false;
  const policy = getRoutineIdentityMatch(c, anchor);
  if (policy <= 0.4) return false;
  const completeBy = anchor.completeBy || {};
  const iface = overrideCtx || resolveRoutineExecutionInterface(c, cand, anchor);
  const tags = new Set(iface.actionTags || []);
  if (cand.kind === 'furniture' && cand.category) tags.add(cand.category);
  if (cand.questRelated || cand.questUrgent) tags.add('quest');
  const categories = completeBy.categories || [];
  const expectedTags = completeBy.tags || [];
  if (categories.includes(cand.category)) return true;
  for (const tag of expectedTags) if (tags.has(tag)) return true;
  return false;
}

function routineNeedPressure(c, anchor) {
  const coeffs = calcNeedCoeffs(c);
  let pressure = 1;
  for (const key of anchor.needs || []) {
    const max = Math.max(1, coeffs[key]?.max ?? 100);
    const ratio = (c.needs[key] ?? 0) / max;
    if (key === 'hunger') pressure = Math.max(pressure, ratio <= 0.35 ? 1.45 : ratio <= 0.55 ? 1.25 : 1);
    if (key === 'energy') pressure = Math.max(pressure, ratio <= 0.35 ? 1.35 : ratio <= 0.55 ? 1.15 : 1);
    if (key === 'hygiene') pressure = Math.max(pressure, ratio <= 0.45 ? 1.35 : ratio <= 0.7 ? 1.12 : 1);
    if (key === 'social') pressure = Math.max(pressure, ratio <= 0.4 ? 1.2 : 1);
    if (key === 'fun') pressure = Math.max(pressure, ratio <= 0.4 ? 1.15 : 1);
    if (key === 'mood') pressure = Math.max(pressure, ratio <= 0.35 ? 1.2 : 1);
  }
  return pressure;
}

function routineHabitMultiplier(c, anchor) {
  const effects = scheduleEffects(c);
  let factor = 1;
  if (isMorningHygieneRoutine(anchor)) factor *= effects.hygieneWeightMultiplier;
  if (isNightSleepRoutine(anchor)) factor *= effects.sleepWeightMultiplier;
  if (anchor.id === 'morning_focus') factor *= effects.morningFocusMultiplier;
  if (effects.deadlineRamp !== 1 || effects.earlySuppression !== 1) {
    const progress = routineAnchorProgress(c, anchor);
    if (progress < 0.45) factor *= effects.earlySuppression;
    factor *= 1 + (effects.deadlineRamp - 1) * progress;
  }
  return Math.max(0.25, Math.min(2, factor));
}

function routineAnchorTemplateId(anchor) {
  return anchor?.sourceTemplateId || anchor?.sourceBlock?.templateId || anchor?.templateId || '';
}

function isMorningHygieneRoutine(anchor) {
  return anchor?.id === 'morning_hygiene' || routineAnchorTemplateId(anchor) === 'routine_hygiene';
}

function isNightSleepRoutine(anchor) {
  return anchor?.id === 'night_sleep' || routineAnchorTemplateId(anchor) === 'routine_sleep_night';
}

function isMealRoutine(anchor) {
  return ['breakfast', 'lunch', 'dinner'].includes(anchor?.id)
    || ['routine_meal_breakfast', 'routine_meal_noon', 'routine_meal_dinner'].includes(routineAnchorTemplateId(anchor));
}

function isPrimaryNeedRoutine(anchor) {
  return isMealRoutine(anchor) || isMorningHygieneRoutine(anchor) || isNightSleepRoutine(anchor);
}

function activeNightSleepAnchor(c) {
  return currentRoutineAnchors(c).find(isNightSleepRoutine) || null;
}

function shouldPrioritizeNightSleep(c) {
  const anchor = activeNightSleepAnchor(c);
  return !!(anchor && !aiRoutineCompleted(c, anchor.id));
}

function isSleepFurnitureCategory(category) {
  return ['bed', 'rest'].includes(category || '');
}

function calcRoutineFactor(c, raw, tags) {
  const anchors = currentRoutineAnchors(c);
  if (!anchors.length) return { factor: 1, anchor: null };
  let factor = 1;
  let best = null;
  for (const anchor of anchors) {
    const completed = aiRoutineCompleted(c, anchor.id);
    const iface = resolveRoutineExecutionInterface(c, raw, anchor);
    const req = iface.requirementMatch || {};
    const localTags = new Set(tags);
    (iface.actionTags || []).forEach(tag => localTags.add(tag));
    let local = applyTagMods(1, [...localTags], completed ? { cut: anchor.completeCut || {} } : anchor);
    if (raw.kind === 'furniture') local = applyTagMods(local, [raw.category || ''], completed ? { cut: anchor.completeCut || {} } : anchor);
    if (!completed && isMealRoutine(anchor) && raw.category === 'snack' && !c.ai?.urgentNeed) {
      const coeffs = calcNeedCoeffs(c);
      const hungerRatio = (c.needs.hunger ?? 0) / Math.max(1, coeffs.hunger?.max ?? 100);
      local *= hungerRatio <= 0.25 ? 0.75 : 0.18;
    }
    if (!completed && candMatchesRoutineAnchor(raw, anchor, c)) {
      local *= req.professionMatch === false ? 0.78 : 1;
      local *= req.skillMatch === false ? 0.84 : 1;
      local *= routineNeedPressure(c, anchor);
      local *= routineHabitMultiplier(c, anchor);
      local *= getRoutineIdentityMatch(c, anchor);
    } else if (!completed && isPrimaryNeedRoutine(anchor)) {
      if (raw.kind === 'interaction' || raw.kind === 'seek' || raw.kind === 'wander') local *= 0.25;
      else if (raw.kind === 'furniture') local *= 0.55;
    }
    local = Math.max(0.04, Math.min(5.5, local));
    factor *= local;
    if (!best || Math.abs(local - 1) > Math.abs(best.factor - 1)) {
      best = { id: anchor.id, name: anchor.name, factor: local, completed };
    }
  }
  return {
    factor: Math.max(0.03, Math.min(6, factor)),
    anchor: best && Math.abs(best.factor - 1) >= 0.08 ? best : null,
  };
}

function completeRoutineAnchorsForAction(c, action = {}) {
  if (!c?.ai) return;
  const overrideProfile = action.requirementProfile || null;
  const overrideMatch = action.requirementMatch || null;
  for (const anchor of currentRoutineAnchors(c)) {
    if (anchor.isCompletable === false) continue;
    if (aiRoutineCompleted(c, anchor.id)) continue;
    const iface = overrideProfile || overrideMatch
      ? resolveRoutineExecutionInterface(c, {
        requirementProfile: overrideProfile,
        requirementMatch: overrideMatch,
      }, anchor)
      : null;
    if (!candMatchesRoutineAnchor(action, anchor, c, iface)) continue;
    if (isNightSleepRoutine(anchor) && action.sourceType === 'furniture_start') continue;
    markAIRoutineCompleted(c, anchor.id, {
      anchorName: anchor.name,
      sourceType: action.sourceType || action.kind || '',
      category: action.category || '',
      actionId: action.actionId || '',
    });
  }
}

function calcScheduleFactor(c, raw, tags) {
  const profileAnchors = activeRoutineAnchorsFromRows(c, getRoutineProfileAnchorsForCharacter(c));
  if (profileAnchors.length) return { factor: 1, window: null };
  const routineAnchors = activeRoutineAnchorsFromRows(c, getLegacyRoutineAnchorRows());
  if (routineAnchors.length) return { factor: 1, window: null };
  const scheduleAnchors = activeRoutineAnchorsFromRows(c, getScheduleWindowRoutineAnchors());
  if (!scheduleAnchors.length) return { factor: 1, window: null };
  const win = scheduleAnchors[0];
  return {
    factor: 1,
    window: {
      id: win.sourceWindow?.id || win.id,
      name: win.name,
      factor: 1,
      source: 'routineFallback',
      fallbackType: 'scheduleWindow',
    },
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

function charIntentPosition(ch) {
  if (!ch) return null;
  if (ch.action?.type === 'move' && ch.action.destCol != null) {
    return { col: ch.action.destCol, row: ch.action.destRow };
  }
  const queuedMove = (ch.actionQueue || []).find(item => item?.type === 'move' && item.gridCol != null);
  if (queuedMove) return { col: queuedMove.gridCol, row: queuedMove.gridRow };
  const activeSeek = ch.action?.type === 'move' && ch.path?.length ? ch.path[ch.path.length - 1] : null;
  if (activeSeek) return { col: activeSeek.col, row: activeSeek.row };
  return { col: Math.round(ch.gridCol), row: Math.round(ch.gridRow) };
}

function crowdNearCell(col, row, excludeIds = [], radius = 2.4) {
  const ex = new Set(excludeIds);
  let count = 0;
  for (const ch of CHARS || []) {
    if (!ch || ex.has(ch.id)) continue;
    const p = charIntentPosition(ch);
    if (!p) continue;
    if (Math.hypot(p.col - col, p.row - row) <= radius) count++;
  }
  return count;
}

function intendedCellTaken(col, row, excludeIds = []) {
  const ex = new Set(excludeIds);
  for (const ch of CHARS || []) {
    if (!ch || ex.has(ch.id)) continue;
    const p = charIntentPosition(ch);
    if (p && Math.round(p.col) === col && Math.round(p.row) === row) return true;
  }
  return false;
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
      if (intendedCellTaken(col, row, [c.id, target.id])) continue;
      const dist = Math.hypot(dc, dr);
      const crowd = crowdNearCell(col, row, [c.id, target.id], 2.2);
      options.push({ col, row, dist, crowd, score: dist + crowd * 1.65 + Math.random() * 0.25 });
    }
  }
  options.sort((a, b) => a.score - b.score);
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
    if (['bed', 'rest', 'travel_rest'].includes(cat)) {
      if (shouldPrioritizeNightSleep(c) && isSleepFurnitureCategory(cat)) return 1;
      return 0.04;
    }
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
    return shouldPrioritizeNightSleep(c) && isSleepFurnitureCategory(cat) ? 10 : (ratio >= 0.75 ? 90 : 45);
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
    if (shouldPrioritizeNightSleep(c)) {
      if (energyRatio >= 0.98) factor = Math.min(factor, 0.55);
      else if (energyRatio >= 0.9) factor = Math.min(factor, 0.85);
    } else if (energyRatio >= 0.82) factor = Math.min(factor, 0.008);
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
    routine: roundedFactor(raw.routineFactor),
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

function interactionWillingnessFactor(c, other, tpl) {
  const info = getRelationInfo?.(c.id, other.id);
  const willingness = InteractionScoreSystem?.socialWillingness?.(c, other, tpl);
  const factor = willingness?.factor ?? 1;
  const hints = [];
  const push = (text) => { if (text) hints.push({ key: 'relation', value: text }); };
  const label = willingness?.label || '平';
  if (factor >= 1.25) push(`${other.short}:${info?.typeLabel || '关系'}促成·${label}`);
  else if (factor <= 0.75) push(`${other.short}:${info?.typeLabel || '关系'}压低·${label}`);
  const pf = willingness?.protocolFactor;
  if (pf?.behavior && pf.behavior !== 'allowed') {
    const behaviorLabel = { conditional: '需分寸', risky: '逾矩', forbidden: '犯忌' }[pf.behavior] || pf.behavior;
    push(`${behaviorLabel}·礼法压力${Math.round((pf.pressure || 0) * 100)}`);
  }
  return { factor, hints, willingness, info };
}

function hasPendingSameInteraction(c, targetId, interactionId) {
  const same = item => item?.type === 'interaction'
    && item.targetCharId === targetId
    && String(item.interactionId) === String(interactionId);
  return same(c?.action) || (c?.actionQueue || []).some(same);
}

function aiAutonomousInteractionAllowed(c, tpl, rel) {
  const rule = tpl?.aiAutonomy || {};
  if (rule.enabled === false) return false;
  if (Array.isArray(rule.requiredTraitsAny) && rule.requiredTraitsAny.length) {
    const traits = new Set(TraitEffectSystem?.traitsOf?.(c) || []);
    const specs = new Set(TraitEffectSystem?.specialtiesOf?.(c) || []);
    const ok = rule.requiredTraitsAny.some(id => traits.has(id) || specs.has(id));
    if (!ok) return false;
  }
  const pf = rel?.willingness?.protocolFactor;
  const behavior = pf?.behavior || 'allowed';
  if (behavior === 'forbidden') return false;
  if (behavior === 'risky' && (rel?.factor ?? 1) < 0.75) return false;
  if (behavior === 'conditional' && (rel?.factor ?? 1) < 0.35) return false;
  const isCourtship = tpl?.category === 'chuanqing';
  if (isCourtship || rule.minScore != null || rule.minAffection != null || rule.minTrust != null || rule.minFriendship != null) {
    const info = rel?.info || {};
    const unlock = tpl?.unlock_conditions || {};
    const score = info.score ?? 0;
    const affection = info.affection ?? 0;
    const trust = info.trust ?? 0;
    const friendship = info.friendship ?? 0;
    const minScore = rule.minScore ?? tpl.relMin ?? unlock.min_score ?? (isCourtship ? 30 : -100);
    const minAffection = rule.minAffection ?? unlock.min_affection ?? (isCourtship ? Math.max(20, minScore - 10) : -100);
    const minTrust = rule.minTrust ?? unlock.min_trust ?? -100;
    const minFriendship = rule.minFriendship ?? unlock.min_friendship ?? unlock.min_intimacy ?? -100;
    const minWillingness = rule.minWillingness ?? (isCourtship ? 0.8 : 0);
    if (score < minScore) return false;
    if (affection < minAffection) return false;
    if (trust < minTrust) return false;
    if (friendship < minFriendship) return false;
    if ((rel?.factor ?? 1) < minWillingness) return false;
  }
  if (rule.maxWitnesses != null && (pf?.witnessCount ?? 0) > rule.maxWitnesses) return false;
  return true;
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
    const targetCrowd = crowdNearCell(other.gridCol, other.gridRow, [c.id, other.id], 3.2);
    if (targetCrowd >= 5) continue;
    const hostile = (info.score || 0) < -20;
    const tags = hostile ? ['social', 'zhengchi'] : ['social', 'relation', 'xujiu'];
    const crowdDamp = 1 / (1 + targetCrowd * 0.45 + (spot.crowd || 0) * 0.35);
    const baseWeight = Math.max(0.2, Math.min(1.8, 0.45 + pull / 70) * crowdDamp);
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
      scoreHints: [
        { key: 'relation', value: `${other.short}:${info.typeLabel || '关系牵引'}` },
        ...(targetCrowd ? [{ key: 'crowd', value: `周边拥挤-${targetCrowd}` }] : []),
      ],
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
  if (raw.distance > cfg.maxCandidateDistance && !raw.ignoreDistanceLimit) { raw.distanceFactor = 0; raw.finalWeight = 0; return raw; }
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
  const routine = calcRoutineFactor(c, raw, tags);
  raw.routineFactor = routine.factor;
  raw.routineAnchor = routine.anchor;
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
    * raw.routineFactor * raw.dailySocialFactor;
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
      const furnitureIds = new Set(ctx.near.furniture);
      if (shouldPrioritizeNightSleep(c)) {
        const homeId = (typeof AiHomeward !== 'undefined') ? AiHomeward.getHomeSceneId(c) : c.sceneId;
        for (const inst of CONFIG.furnitureInstances || []) {
          const tpl = getTemplate(inst.templateId);
          if (inst.sceneId === homeId && isSleepFurnitureCategory(tpl?.category)) furnitureIds.add(inst.instanceId);
        }
      }
      for (const fid of furnitureIds) {
        ctx.check('furniture');
        const inst = getInstance(fid);
        if (ctx.accessible && !ctx.accessible.has(inst.sceneId)) { ctx.reject('furniture', 'scene_inaccessible'); continue; }
        if (!aiCanUseScene(c, inst.sceneId)) { ctx.reject('furniture', 'scene_cooldown_or_forbidden'); continue; }
        const tpl = getTemplate(inst.templateId);
        const nightHomeSleep = shouldPrioritizeNightSleep(c)
          && isSleepFurnitureCategory(tpl?.category)
          && inst.sceneId === ((typeof AiHomeward !== 'undefined') ? AiHomeward.getHomeSceneId(c) : c.sceneId);
        for (const action of getFurnitureActions(tpl)) {
          ctx.check('furniture');
          if (typeof ActivityPackSystem !== 'undefined' && !ActivityPackSystem.isAiAllowed(action)) {
            ctx.reject('furniture', 'activity_ai_disabled');
            continue;
          }
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
            baseWeight: (action.aiWeight ?? tpl.aiWeight ?? 1) * timeWeight * (nightHomeSleep ? 2.5 : 1),
            label: `${tpl.name}·${action.name || '使用'}`,
            ignoreDistanceLimit: nightHomeSleep,
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
          if (hasPendingSameInteraction(c, oid, tpl.id)) {
            ctx.reject('social', 'duplicate_pending_interaction');
            continue;
          }
          if (!checkInteractionAvailable(c, other, tpl, { ignoreCooldown: true }).ok) {
            social.availabilityBlocked++;
            ctx.reject('social', 'unavailable');
            continue;
          }
          const rel = interactionWillingnessFactor(c, other, tpl);
          if (!aiAutonomousInteractionAllowed(c, tpl, rel)) {
            ctx.reject('social', 'protocol_autonomy_low');
            continue;
          }
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
  const pool = collected.rows.map(row => finalizeCandidate(c, row, false));
  const providerStats = collected.ctx.stats;
  const maxSize = cfg.cacheMaxSize;
  const socialPool = pool.filter(row => row.kind === 'interaction' || row.kind === 'seek');
  const furniturePool = pool.filter(row => row.kind === 'furniture');
  const otherPool = pool.filter(row => !socialPool.includes(row) && !furniturePool.includes(row));
  const retained = [];
  const addRows = (rows, count) => {
    for (const row of rows.slice(0, count)) if (!retained.includes(row)) retained.push(row);
  };
  const byWeight = rows => [...rows].sort((a, b) => b.finalWeight - a.finalWeight);
  addRows(byWeight(socialPool), Math.min(10, Math.ceil(maxSize * 0.4)));
  addRows(byWeight(furniturePool), Math.min(16, Math.ceil(maxSize * 0.55)));
  addRows(byWeight(otherPool), Math.max(2, maxSize - retained.length));
  addRows(byWeight(pool.filter(row => !retained.includes(row))), maxSize - retained.length);
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
  c.ai.cache.candidates = retained.slice(0, maxSize);
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
    if (typeof ActivityPackSystem !== 'undefined' && !ActivityPackSystem.isAiAllowed(cand.furnitureAction)) {
      return { ok: false, reason: '该活动不允许自主执行' };
    }
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

function findCrowdReliefCell(c) {
  if (!c || c.action || c.actionQueue?.length) return null;
  const baseCol = Math.round(c.gridCol), baseRow = Math.round(c.gridRow);
  const hereCrowd = crowdNearCell(baseCol, baseRow, [c.id], 2.1);
  if (hereCrowd < 3) return null;
  const options = [];
  for (let dc = -4; dc <= 4; dc++) {
    for (let dr = -4; dr <= 4; dr++) {
      if (!dc && !dr) continue;
      const col = baseCol + dc, row = baseRow + dr;
      const cell = WORLD[col]?.[row];
      if (!cell?.walkable || cell.entryFor) continue;
      if (sceneAt(col, row)?.id !== c.sceneId) continue;
      if (charAtCell(col, row, [c.id])) continue;
      if (intendedCellTaken(col, row, [c.id])) continue;
      const crowd = crowdNearCell(col, row, [c.id], 2.1);
      if (crowd >= hereCrowd) continue;
      const dist = Math.hypot(dc, dr);
      options.push({ col, row, score: crowd * 2 + dist * 0.35 + Math.random() * 0.2 });
    }
  }
  options.sort((a, b) => a.score - b.score);
  return options.find(pos => aiReachableCell(c, pos.col, pos.row)) || null;
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
    routineAnchor: cand.routineAnchor || null,
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
    routineAnchor: cand.routineAnchor || null,
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
  c.ai.currentRoutineAnchor = cand.routineAnchor?.id ? cand.routineAnchor : null;
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
      if (typeof ActivityPackSystem !== 'undefined' && !ActivityPackSystem.isAiAllowed(action)) continue;
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
  const wakeRatio = Math.min(1.08, (cfg.sleepWakeEnergyRatio || 0.9) + (scheduleEffects(c).wakeEnergyRatioBonus || 0));
  if (c.needs.energy / cf.energy.max >= wakeRatio || (gameHour >= 8 && gameHour < 22)) {
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
  let threshold = candidateInterruptThreshold(c, top[0], 'fast');
  const activeRoutine = c.ai.currentRoutineAnchor;
  if (activeRoutine?.id && !aiRoutineCompleted(c, activeRoutine.id) && top[0]?.routineAnchor?.id !== activeRoutine.id) {
    threshold = Math.max(threshold, 2.4);
  }
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
  if (!c.action && !c.actionQueue.length) {
    const relief = findCrowdReliefCell(c);
    if (relief && startPathTo(c, relief.col, relief.row, () => {}, { excludeCharIds: [c.id] })) {
      c.statusText = '让开些';
      return;
    }
  }
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
  let threshold = candidateInterruptThreshold(c, picked, 'slow');
  const activeRoutine = c.ai.currentRoutineAnchor;
  if (busy && activeRoutine?.id && !aiRoutineCompleted(c, activeRoutine.id) && picked?.routineAnchor?.id !== activeRoutine.id) {
    threshold = Math.max(threshold, 2.4);
  }
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
      const count = Math.min(AI_SLOW_BATCH_SIZE, CHARS.length);
      for (let j = 0; j < count; j++) {
        const c = CHARS[aiSlowCursor % CHARS.length];
        aiSlowCursor = (aiSlowCursor + 1) % Math.max(1, CHARS.length);
        slowChannelTick(c);
      }
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
    if (c.ai) {
      saveRoutineProfileHistory(c, getRoutineProfileForCharacter(c));
      resolveRoutineProfileScheduleRules(c);
      c.ai.dailySocialCounts = { day: gameDay, targets: {} };
      c.ai.dailyRoutine = { day: gameDay, completed: {} };
      c.ai.currentRoutineAnchor = null;
    }
    markAIDirty(c);
  }));
  EventBus.on('memory:add', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('interaction:started', recordAIActiveSocialStart);
  EventBus.on('interaction:complete', applyAISocialTargetCooldown);
  EventBus.on('interaction:complete', e => {
    const c = getChar(e.initiatorId);
    if (!c?.ai || CHARS.indexOf(c) === selectedIdx) return;
    completeRoutineAnchorsForAction(c, {
      kind: 'interaction',
      category: e.category,
      tags: ['social', e.category || ''],
      sourceType: 'interaction',
      actionId: e.interactionId,
    });
  });
  const recordFurnitureRoutine = e => {
    const c = getChar(e.charId);
    if (!c?.ai || CHARS.indexOf(c) === selectedIdx) return;
    const sourceType = e.type === 'furniture:use_started' ? 'furniture_start' : 'furniture';
    completeRoutineAnchorsForAction(c, {
      kind: 'furniture',
      category: e.category,
      tags: [e.category, e.category === 'bed' ? 'sleep' : '', ['meal', 'snack', 'kitchen', 'table'].includes(e.category) ? 'hunger' : '', ['bath', 'wash', 'wardrobe'].includes(e.category) ? 'hygiene' : ''].filter(Boolean),
      sourceType,
      actionId: e.actionId,
    });
  };
  EventBus.on('furniture:use_started', recordFurnitureRoutine);
  EventBus.on('furniture:complete', recordFurnitureRoutine);
  EventBus.on('queue:failed', e => {
    const c = getChar(e.charId);
    if (!c?.ai) return;
    const severe = /无法进入|尚未掌握|等级不足|醉得|不想再吃|没什么胃口/.test(e.reason || '');
    if (e.candidateKey) {
      c.ai.failedActionCooldowns ||= {};
      c.ai.failedActionCooldowns[e.candidateKey] = getGameTimestamp() + (severe ? 180 : 45);
    }
    c.ai.currentRoutineAnchor = null;
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
  const cfg = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  const localPatch = globalThis.LOCAL_CONFIG_PATCH;
  if (localPatch && typeof localPatch === 'object') {
    deepMerge(cfg, JSON.parse(JSON.stringify(localPatch)));
  }
  try {
    const s = localStorage.getItem('dgy_config');
    if (s) {
      deepMerge(cfg, JSON.parse(s));
      migrateConfig(cfg);
      return cfg;
    }
  } catch (e) { console.warn('loadConfig failed, using defaults:', e); }
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
  for (const defScene of DEFAULT_CONFIG.scenes || []) {
    if (defScene.hidePlaque == null && defScene.hideTitle == null) continue;
    const scene = (cfg.scenes || []).find(row => row.id === defScene.id);
    if (!scene) continue;
    if (defScene.hidePlaque != null && scene.hidePlaque == null) scene.hidePlaque = defScene.hidePlaque;
    if (defScene.hideTitle != null && scene.hideTitle == null) scene.hideTitle = defScene.hideTitle;
  }
  cfg.scenes = (cfg.scenes || []).filter(scene => scene.id !== 6 && scene.name !== '稻香村');
  cfg.furnitureInstances = (cfg.furnitureInstances || []).filter(inst => inst.sceneId !== 6 && !(inst.instanceId >= 6000 && inst.instanceId < 7000));
  cfg.needDefs = cfg.needDefs || [];
  const legacyNeedLabels = {
    hunger: { labels: ['饥'], names: ['饥饿'] },
    energy: { labels: ['倦'], names: ['精力'] },
    fun: { labels: ['闷'], names: ['意趣'] },
    hygiene: { labels: ['洁'], names: ['洁净'] },
    social: { labels: ['交游'], names: ['交游'] },
  };
  for (const def of DEFAULT_CONFIG.needDefs || []) {
    const current = cfg.needDefs.find(row => row.key === def.key);
    if (!current) cfg.needDefs.push(JSON.parse(JSON.stringify(def)));
    else {
      Object.assign(current, { ...def, ...current });
      const legacy = legacyNeedLabels[def.key];
      if (legacy?.labels.includes(current.label)) current.label = def.label;
      if (legacy?.names.includes(current.name) && current.name !== def.name) current.name = def.name;
    }
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
  cfg.aiConfig.routineGridConfig = {
    ...DEFAULT_CONFIG.aiConfig.routineGridConfig,
    ...(cfg.aiConfig?.routineGridConfig || {}),
    rowDefs: cfg.aiConfig?.routineGridConfig?.rowDefs?.length
      ? cfg.aiConfig.routineGridConfig.rowDefs
      : DEFAULT_CONFIG.aiConfig.routineGridConfig.rowDefs,
  };
  cfg.aiConfig.routineTemplates = cfg.aiConfig?.routineTemplates?.length
    ? cfg.aiConfig.routineTemplates
    : JSON.parse(JSON.stringify(DEFAULT_CONFIG.aiConfig.routineTemplates || []));
  cfg.aiConfig.routineProfiles = {
    defaultProfileId: cfg.aiConfig?.routineProfiles?.defaultProfileId || DEFAULT_CONFIG.aiConfig.routineProfiles.defaultProfileId || 'default',
    defaults: cfg.aiConfig?.routineProfiles?.defaults?.length
      ? cfg.aiConfig.routineProfiles.defaults
      : JSON.parse(JSON.stringify(DEFAULT_CONFIG.aiConfig.routineProfiles?.defaults || [])),
    byCharacter: {
      ...(cfg.aiConfig?.routineProfiles?.byCharacter || {}),
    },
    meta: {
      ...(DEFAULT_CONFIG.aiConfig.routineProfiles?.meta || {}),
      ...(cfg.aiConfig?.routineProfiles?.meta || {}),
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
      if (!cfg.interactionTemplates[id]) {
        cfg.interactionTemplates[id] = JSON.parse(JSON.stringify(tpl));
        continue;
      }
      const cur = cfg.interactionTemplates[id];
      if (tpl.lineVariants && !cur.lineVariants) {
        cur.lineVariants = JSON.parse(JSON.stringify(tpl.lineVariants));
      }
      if (tpl.risky_details) {
        cur.risky_details = cur.risky_details || {};
        for (const key of ['fail_lines', 'repeat_fail_lines', 'witnessed_fail_lines']) {
          if (tpl.risky_details[key] && !cur.risky_details[key]) {
            cur.risky_details[key] = JSON.parse(JSON.stringify(tpl.risky_details[key]));
          }
        }
        if (tpl.risky_details.identity_fail_lines) {
          cur.risky_details.identity_fail_lines = deepMerge(
            JSON.parse(JSON.stringify(tpl.risky_details.identity_fail_lines)),
            cur.risky_details.identity_fail_lines || {},
          );
        }
      }
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
  if (!cfg.reputationDomainConfig) {
    cfg.reputationDomainConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.reputationDomainConfig || {}));
  } else {
    const defRep = DEFAULT_CONFIG.reputationDomainConfig || {};
    cfg.reputationDomainConfig.domains = { ...defRep.domains, ...cfg.reputationDomainConfig.domains };
    cfg.reputationDomainConfig.pathDomains = { ...defRep.pathDomains, ...cfg.reputationDomainConfig.pathDomains };
    cfg.reputationDomainConfig.rewardDomains = { ...defRep.rewardDomains, ...cfg.reputationDomainConfig.rewardDomains };
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
    for (const df of defFc.families || []) {
      const cur = cfg.familyConfig.families.find(f => f.id === df.id);
      if (!cur) continue;
      if (df.residenceKind) cur.residenceKind = df.residenceKind;
      if ('residenceSceneId' in df) cur.residenceSceneId = df.residenceSceneId;
      if (df.residenceLabel) cur.residenceLabel = df.residenceLabel;
      if (df.activitySceneId != null) cur.activitySceneId = df.activitySceneId;
      if (df.activityLabel) cur.activityLabel = df.activityLabel;
    }
  }
  for (const dc of DEFAULT_CONFIG.characters || []) {
    const cur = cfg.characters?.find(ch => ch.id === dc.id);
    if (!cur) continue;
    if (cur.homewardness == null && dc.homewardness != null) cur.homewardness = dc.homewardness;
    if (!cur.shortComment && dc.shortComment) cur.shortComment = dc.shortComment;
    if (cur.sceneId === 6 || !cfg.scenes?.some(scene => scene.id === cur.sceneId)) {
      cur.sceneId = dc.sceneId;
      cur.gridCol = dc.gridCol;
      cur.gridRow = dc.gridRow;
    }
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
