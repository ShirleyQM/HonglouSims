/* ═══════════════════ RESIDENT AI ═══════════════════ */
const AI_STATE = { IDLE: 'IDLE', EXECUTING: 'EXECUTING', SLEEPING: 'SLEEPING', URGENT: 'URGENT', PAUSED: 'PAUSED', COOLDOWN: 'COOLDOWN' };

const FURN_AI_TAGS = {
  meal: ['hunger', '食'], snack: ['hunger', '食'], kitchen: ['hunger', '食'],
  table: ['hunger', 'xujiu', '食'],
  bed: ['sleep', 'energy', '住'], rest: ['energy', '住'],
  bath: ['hygiene', '衣'], wash: ['hygiene', '衣'], wardrobe: ['hygiene', '衣'],
  travel_rest: ['energy', '行'], seat: ['energy', '行', 'solitude'],
  desk: ['lundao', 'fun'], wine: ['xujiu', 'fun'], instrument: ['lundao', 'fun'],
  garden: ['fun', 'outdoor'], pavilion: ['fun', 'outdoor', 'xujiu', '行'],
};

const URGENT_FURN_CATEGORIES = {
  energy: ['bed', 'rest', 'travel_rest', 'seat'],
  hygiene: ['bath', 'wash', 'wardrobe'],
  hunger: ['meal', 'snack', 'kitchen', 'table'],
};

const TRAIT_MODS = {
  fengliu: { boost: { chuanqing: 1.4, xujiu: 1.2 }, cut: { solitude: 0.6 } },
  duoqing: { boost: { chuanqing: 1.5 }, cut: { zhengchi: 0.3 } },
  shuchi: { boost: { lundao: 1.6 }, cut: { tiaoxiao: 0.4 } },
  qinggao: { boost: { lundao: 1.4 }, cut: { tiaoxiao: 0.4 } },
  qingjie: { boost: { hygiene: 1.8, bath: 1.5 }, cut: {} },
  haoke: { boost: { xujiu: 1.4 }, cut: { solitude: 0.5 } },
  lazy: { boost: { sleep: 1.5, energy: 1.3 }, cut: { outdoor: 0.3 } },
  kebo: { boost: { zhengchi: 1.6 }, cut: { weijie: 0.2 } },
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
    cache: { candidates: [], dirty: true, currentWeight: 0, lastRebuild: 0 },
    cooldownUntil: 0,
    socialCooldowns: {},
    urgentNeed: null,
    urgentFailIds: [],
    urgentRetryPending: false,
    urgentRetryAt: 0,
    completingPlayerQueue: false,
    decisionLog: [],
    aiLog: false,
  };
}

function getCharTraits(c) {
  const prof = CharSpecialtySystem.profile(c.id);
  if (prof?.aiTraits?.length) return prof.aiTraits;
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
  if (needKey === 'fun' && cand.category) return true;
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
    factor += needUrgency(c.needs[nk], cf[nk].max) * weights[nk];
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

function calcMemoryFactor(c, tags) {
  let f = 1;
  for (const mem of c.memories.slice(-5)) {
    f = applyTagMods(f, tags, MEMORY_TAG_MODS[mem.tag]);
    if (mem.tag === '创伤') f = applyTagMods(f, tags, { cut: { [tags[0]]: 0.1 } });
  }
  return f;
}

function finalizeCandidate(c, raw, fastOnly) {
  const cfg = getAIConfig();
  const tags = raw.tags || [];
  if (raw.kind === 'furniture') {
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
  raw.demandFactor = calcDemandFactor(c, raw, !!fastOnly);
  raw.traitFactor = calcTraitFactor(c, tags);
  raw.statusFactor = calcStatusFactor(c, tags);
  raw.timeFactor = calcTimeFactor(tags);
  raw.memoryFactor = calcMemoryFactor(c, tags);
  raw.distanceFactor = distanceFactor;
  raw.specialtyFactor = CharSpecialtySystem.calcFactor(c, raw, tags);
  raw.finalWeight = raw.baseWeight * raw.demandFactor * raw.traitFactor * raw.statusFactor
    * raw.timeFactor * raw.memoryFactor * raw.specialtyFactor * distanceFactor * randomFactor
    * (QuestSystem.getQuestWeightBoost?.(c, raw) || 1);
  return raw;
}

function buildCandidatePool(c) {
  const cfg = getAIConfig();
  const maxD = cfg.maxCandidateDistance;
  const pool = [];
  const accessible = SceneAccessSystem?.getAccessibleSceneIds
    ? new Set(SceneAccessSystem.getAccessibleSceneIds(c))
    : null;
  const near = queryNearby(c.gridCol, c.gridRow, maxD);
  for (const fid of near.furniture) {
    const inst = getInstance(fid);
    if (accessible && !accessible.has(inst.sceneId)) continue;
    const tpl = getTemplate(inst.templateId);
    const chk = canUseFurniture(c, inst);
    if (chk !== true && chk !== '已满') continue;
    const tags = [...(FURN_AI_TAGS[tpl.category] || ['fun']), tpl.category];
    pool.push({
      key: `furn:${fid}`, kind: 'furniture', instanceId: fid,
      tags, category: tpl.category, primaryNeed: tpl.needRestores?.[0]?.need,
      baseWeight: tpl.category === 'bed' && (gameHour >= 22 || gameHour < 6) ? 2.5 : 1,
      label: tpl.name,
    });
  }
  for (const oid of near.chars) {
    if (oid === c.id) continue;
    const other = getChar(oid);
    if (c.ai.socialCooldowns[oid] > getGameTimestamp()) continue;
    for (const tpl of Object.values(CONFIG.interactionTemplates || {})) {
      if (!checkInteractionAvailable(c, other, tpl).ok) continue;
      pool.push({
        key: `int:${tpl.id}:${oid}`, kind: 'interaction',
        interactionId: tpl.id, targetCharId: oid,
        tags: [tpl.category], category: tpl.category,
        baseWeight: 0.85, label: `${tpl.name}·${other.short}`,
      });
    }
  }
  for (let i = 0; i < 4; i++) {
    const dc = Math.round(c.gridCol) + (Math.floor(Math.random() * 13) - 6);
    const dr = Math.round(c.gridRow) + (Math.floor(Math.random() * 13) - 6);
    if (!WORLD[dc]?.[dr]?.walkable || WORLD[dc][dr].entryFor) continue;
    if (charAtCell(dc, dr, [c.id])) continue;
    const wSc = sceneAt(dc, dr);
    if (accessible && wSc && !accessible.has(wSc.id)) continue;
    pool.push({ key: `w:${dc},${dr}`, kind: 'wander', gridCol: dc, gridRow: dr, tags: ['outdoor'], baseWeight: 0.3, label: '闲游' });
  }
  c.ai.cache.candidates = pool.slice(0, cfg.cacheMaxSize).map(p => finalizeCandidate(c, p, false));
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

function candToQueueItem(c, cand) {
  if (cand.kind === 'furniture') return makeFurnitureItem(getInstance(cand.instanceId));
  if (cand.kind === 'interaction') return makeInteractionItem(c, getChar(cand.targetCharId), getInteractionTemplate(cand.interactionId));
  if (cand.kind === 'wander') return makeMoveItem(cand.gridCol, cand.gridRow);
  return null;
}

function getCurrentActionWeight(c) { return c.ai?.cache?.currentWeight || 0; }

function logAIDecision(c, channel, cand, replaced) {
  c.ai.decisionLog.unshift({ channel, selected: cand.label, weight: cand.finalWeight, replaced, ts: getGameTimestamp() });
  if (c.ai.decisionLog.length > 12) c.ai.decisionLog.pop();
  if (c.ai.aiLog) log(`[AI/${c.short}] ${channel}→${cand.label}(${cand.finalWeight.toFixed(2)})`);
  EventBus.emit('ai:decision', { charId: c.id, channel, action: cand.label, weight: cand.finalWeight, replaced });
}

function aiReplaceQueue(c, cand, channel) {
  if (isCompletingPlayerQueue(c)) return;
  if (c.ai?.urgentNeed) {
    if (channel !== 'event') return;
    if (cand.kind !== 'furniture') return;
  }
  const item = candToQueueItem(c, cand);
  if (!item) return;
  item.aiGenerated = true;
  item.urgent = !!c.ai?.urgentNeed;
  cancelAction(c);
  c.actionQueue = [];
  enqueueAction(c, item);
  c.ai.cache.currentWeight = cand.finalWeight;
  if (!c.ai.urgentNeed) {
    const fCat = cand.kind === 'furniture' ? getTemplate(getInstance(cand.instanceId).templateId).category : '';
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
    const tpl = getTemplate(inst.templateId);
    const restoresNeed = tpl.needRestores?.some(nr => nr.need === needKey);
    const catMatch = (URGENT_FURN_CATEGORIES[needKey] || []).includes(tpl.category);
    if (!restoresNeed && !catMatch) return;
    const chk = canUseFurniture(c, inst, needKey);
    if (chk !== true && chk !== '已满') return;
    const e = getEntryCell(inst);
    const dist = Math.hypot(e.col - c.gridCol, e.row - c.gridRow);
    if (!best || dist < best.distance) {
      best = {
        key: `furn:${inst.instanceId}`, kind: 'furniture', instanceId: inst.instanceId,
        tags: [...(FURN_AI_TAGS[tpl.category] || ['fun']), tpl.category],
        category: tpl.category, primaryNeed: needKey,
        baseWeight: 10, label: tpl.name, distance: dist,
      };
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

function checkAINeedEvents(c) {
  if (!c.ai) return;
  const cf = calcNeedCoeffs(c);
  for (const nd of getNeedDefs()) {
    const k = nd.key, ratio = c.needs[k] / cf[k].max;
    if (ratio <= 0.1 && c.ai.state !== AI_STATE.URGENT) { onNeedCrisis(c, k); return; }
    if (ratio <= 0.3) EventBus.emit('need:critical', { charId: c.id, needKey: k, ratio });
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
  if (top[0] && top[0].finalWeight > curW * cfg.weightReplaceThresholdFast)
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
  if (!picked) return;
  const cfg = getAIConfig();
  const curW = getCurrentActionWeight(c);
  const busy = c.action || c.actionQueue.length;
  if (!busy) { aiReplaceQueue(c, picked, 'slow'); return; }
  if (picked.finalWeight > curW * cfg.weightReplaceThresholdSlow)
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
  EventBus.on('need:critical', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('state:add', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('state:remove', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
  EventBus.on('time:period', () => CHARS.forEach(c => markAIDirty(c)));
  EventBus.on('memory:add', e => { const c = getChar(e.charId); if (c) markAIDirty(c); });
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
  if (!cfg.relationInit) {
    delete cfg.relationTypes;
    delete cfg.pairRelations;
    cfg.relationInit = DEFAULT_CONFIG.relationInit;
    cfg.relationDecayPerDay = DEFAULT_CONFIG.relationDecayPerDay;
    cfg.relationTypeThresholds = DEFAULT_CONFIG.relationTypeThresholds;
  }
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
      if (s.llm.interactionEnabled !== false) s.llm.enabled = true;
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
  if (!cfg.questConfig) cfg.questConfig = DEFAULT_CONFIG.questConfig;
  else {
    if (!cfg.questConfig.issuePermissions?.length) {
      cfg.questConfig.issuePermissions = JSON.parse(JSON.stringify(DEFAULT_CONFIG.questConfig.issuePermissions));
    } else {
      const defPerms = DEFAULT_CONFIG.questConfig.issuePermissions || [];
      for (const dp of defPerms) {
        const cur = cfg.questConfig.issuePermissions.find(p => p.issuerRank === dp.issuerRank);
        if (cur && cur.allowGroupQuests == null) cur.allowGroupQuests = dp.allowGroupQuests;
      }
    }
    if (cfg.questConfig.groupQuestCooldownGameMin == null) {
      cfg.questConfig.groupQuestCooldownGameMin = DEFAULT_CONFIG.questConfig.groupQuestCooldownGameMin;
    }
  }
  if (!cfg.charSpecialtyConfig) cfg.charSpecialtyConfig = DEFAULT_CONFIG.charSpecialtyConfig;
  if (!cfg.multiInteractConfig) cfg.multiInteractConfig = DEFAULT_CONFIG.multiInteractConfig;
  if (!cfg.furnitureConfig) cfg.furnitureConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.furnitureConfig));
  mergeFurnitureDefaults(cfg);
  if (!cfg.sceneAccessConfig) cfg.sceneAccessConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.sceneAccessConfig));
  if (!cfg.identityProtocolConfig) {
    cfg.identityProtocolConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.identityProtocolConfig));
  }
  migrateSceneAccessFields(cfg);
  if (!cfg.characters?.length) cfg.characters = JSON.parse(JSON.stringify(DEFAULT_CONFIG.characters));
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

function getFurnitureConfig() {
  return CONFIG.furnitureConfig || DEFAULT_CONFIG.furnitureConfig;
}

function isEssentialFurniture(tpl) {
  if (!tpl) return false;
  if (tpl.essential === true) return true;
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
