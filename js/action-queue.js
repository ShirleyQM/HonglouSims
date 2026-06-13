/* ═══════════════════ ACTION QUEUE ═══════════════════ */

/** 互动姿态：控制交谈时站位与可移动范围。未来可启用 sit / lie 对坐、同卧等。 */
const INTERACTION_POSE = {
  stand: { radius: 2.5, allowMove: false, label: '立着交谈' },
  sit: { radius: 1.5, allowMove: false, label: '对坐', future: true },
  lie: { radius: 1, allowMove: false, label: '同卧', future: true },
};

function setInteractionLock(a, b, poseId = 'stand') {
  const pose = INTERACTION_POSE[poseId] || INTERACTION_POSE.stand;
  for (const c of [a, b]) {
    const partner = c.id === a.id ? b : a;
    c._interactionLock = {
      partnerId: partner.id,
      anchorCol: c.gridCol,
      anchorRow: c.gridRow,
      radius: pose.radius,
      poseId,
      allowMove: pose.allowMove,
      label: pose.label,
    };
    c.path = [];
  }
}

function clearInteractionLock(c) {
  if (c) delete c._interactionLock;
}

function enforceInteractionPosition(c) {
  const lock = c?._interactionLock;
  if (!lock || lock.allowMove) return;
  const dc = c.gridCol - lock.anchorCol;
  const dr = c.gridRow - lock.anchorRow;
  const dist = Math.hypot(dc, dr);
  if (dist > lock.radius) {
    const scale = lock.radius / dist;
    c.gridCol = lock.anchorCol + dc * scale;
    c.gridRow = lock.anchorRow + dr * scale;
    const tp = gridToPixel(c.gridCol, c.gridRow);
    c.x = tp.x;
    c.y = tp.y;
  }
}

function lockParticipantsForDialogue(initiator, target, tpl) {
  const poseId = tpl?.poseId || 'stand';
  setInteractionLock(initiator, target, poseId);
  for (const ch of [initiator, target]) {
    if (CHARS.indexOf(ch) !== selectedIdx) pauseCharAI(ch);
    ch.path = [];
  }
}

function unlockParticipantsForDialogue(initiator, target) {
  clearInteractionLock(initiator);
  clearInteractionLock(target);
  for (const ch of [initiator, target]) {
    if (CHARS.indexOf(ch) !== selectedIdx) resumeCharAI(ch);
  }
}

function moodRelationMult(mood) {
  if (mood === '开心') return 1.2;
  if (mood === '不欢' || mood === '不开心') return 0.75;
  return 1;
}

function applySegmentRelationEffects(initiator, target, tpl, segmentRound, maxRounds, mood) {
  const axes = tpl?.axisEffects;
  if (!axes?.length || !maxRounds) return [];
  const share = 1 / maxRounds;
  const mult = moodRelationMult(mood);
  const applied = [];
  for (const ae of axes) {
    if (ae.prob !== undefined && Math.random() > ae.prob) continue;
    const delta = Math.round((ae.delta || 0) * share * mult);
    if (!delta) continue;
    if (ae.axis === 'submission') {
      if (ae.who === 'target') changeAxis(target.id, initiator.id, 'submission', delta);
      else changeAxis(initiator.id, target.id, 'submission', delta);
    } else {
      changeAxis(initiator.id, target.id, ae.axis, delta);
    }
    applied.push({ ae, delta });
  }
  if (applied.length) {
    EventBus.emit('interaction:effects', {
      initiatorId: initiator.id, targetId: target.id,
      interactionId: tpl.id, interactionName: tpl.name, segment: segmentRound,
    });
    uiDirty = true;
  }
  return applied;
}

function revertSegmentRelationEffects(initiator, target, log) {
  for (const { ae, delta } of log || []) {
    if (!delta) continue;
    if (ae.axis === 'submission') {
      if (ae.who === 'target') changeAxis(target.id, initiator.id, 'submission', -delta);
      else changeAxis(initiator.id, target.id, 'submission', -delta);
    } else {
      changeAxis(initiator.id, target.id, ae.axis, -delta);
    }
  }
}

function applyRemainingRelationEffects(initiator, target, tpl, segmentsApplied, maxRounds, mood) {
  const axes = tpl?.axisEffects;
  if (!axes?.length || !maxRounds) return;
  const remainingShare = 1 - segmentsApplied / maxRounds;
  if (remainingShare <= 0.001) return;
  const mult = moodRelationMult(mood);
  for (const ae of axes) {
    if (ae.prob !== undefined && Math.random() > ae.prob) continue;
    const delta = Math.round((ae.delta || 0) * remainingShare * mult);
    if (!delta) continue;
    if (ae.axis === 'submission') {
      if (ae.who === 'target') changeAxis(target.id, initiator.id, 'submission', delta);
      else changeAxis(initiator.id, target.id, 'submission', delta);
    } else {
      changeAxis(initiator.id, target.id, ae.axis, delta);
    }
  }
}

function sameQueueTarget(a, b) {
  if (!a || !b || a.type !== b.type) return false;
  if (a.type === 'move') return a.gridCol === b.gridCol && a.gridRow === b.gridRow;
  if (a.type === 'furniture') return a.instanceId === b.instanceId;
  if (a.type === 'talk') return a.targetCharId === b.targetCharId;
  if (a.type === 'interaction') return a.targetCharId === b.targetCharId && a.interactionId === b.interactionId;
  return false;
}

function enqueueAction(c, item, atFront = false) {
  if (c._interactionLock && !c._interactionLock.allowMove && item.type === 'move') {
    log(`${c.short}正与人交谈，不便走开。`);
    return false;
  }
  item.id = actionIdSeq++;
  item.phase = 'waiting';
  item.priority = item.priority ?? 0;
  const last = c.actionQueue[c.actionQueue.length - 1];
  if (!atFront && last && sameQueueTarget(last, item)) return false;
  if (atFront) c.actionQueue.unshift(item);
  else c.actionQueue.push(item);
  log(`${c.short}队列+：${item.name}`);
  EventBus.emit('queue:add', { charId: c.id, itemName: item.name, itemType: item.type });
  processQueue(c);
  uiDirty = true;
  return true;
}

function cancelQueueItem(c, idx) {
  if (idx < 0 || idx >= c.actionQueue.length) return;
  const releasing = c.actionQueue[idx];
  if (idx === 0 && c.action) {
    cancelAction(c);
    if (releasing?.type === 'furniture') releaseFurnitureStandSlot(c, releasing.instanceId);
    c.actionQueue.shift();
    processQueue(c);
  } else {
    if (releasing?.type === 'furniture') releaseFurnitureStandSlot(c, releasing.instanceId);
    c.actionQueue.splice(idx, 1);
  }
  if (c.ai && isAIControlled(c)) {
    const cfg = getAIConfig();
    c.ai.cooldownUntil = getGameTimestamp() + cfg.playerInterruptCooldownMinutes;
    setAIState(c, AI_STATE.COOLDOWN);
  }
  uiDirty = true;
}

function finishCurrentQueueItem(c, deferUrgentRetry) {
  if (c.actionQueue.length) c.actionQueue.shift();
  c.action = null;
  c.path = [];
  processQueue(c);
  if (c.ai?.completingPlayerQueue && !c.action && !c.actionQueue.length) {
    clearPlayerQueueHandoff(c);
  }
  if (c.ai && isAIControlled(c) && !c.action && !c.actionQueue.length) {
    if (c.ai.urgentNeed) {
      if (!deferUrgentRetry) {
        c.ai.urgentRetryPending = true;
        c.ai.urgentRetryAt = performance.now() / 1000;
      }
    } else setAIState(c, AI_STATE.IDLE);
  }
  uiDirty = true;
}

function processQueue(c) {
  if (c.action) return;
  if (!c.actionQueue.length) {
    if (['行走', '使用', '与'].every(k => !c.statusText.includes(k))) c.statusText = '闲庭漫步';
    return;
  }
  const item = c.actionQueue[0];
  item.phase = 'moving';
  executeQueueItem(c, item);
}

function executeQueueItem(c, item) {
  if (item.type === 'move') {
    if (!startPathTo(c, item.gridCol, item.gridRow, () => finishCurrentQueueItem(c)))
      failQueueItem(c, '无法到达');
  } else if (item.type === 'furniture') {
    tryExecuteFurnitureQueue(c, item);
  } else if (item.type === 'talk') {
    if (!startTalk(c, getChar(item.targetCharId), () => finishCurrentQueueItem(c)))
      failQueueItem(c, '无法交谈');
  } else if (item.type === 'interaction') {
    const tpl = getInteractionTemplate(item.interactionId);
    const target = getChar(item.targetCharId);
    if (!tpl || !target) failQueueItem(c, '互动无效');
    else if (!startInteraction(c, target, tpl, () => finishCurrentQueueItem(c)))
      failQueueItem(c, '无法互动');
  }
}

function makeMoveItem(col, row) {
  const sc = sceneAt(col, row);
  return {
    type: 'move', name: `前往${sc?.name || '目标'}`, targetName: sc?.name || '',
    sceneId: sc?.id || 0, gridCol: col, gridRow: row, remaining: 0,
  };
}

function makeFurnitureItem(inst) {
  const tpl = getTemplate(inst.templateId);
  const sc = getScene(inst.sceneId);
  const entry = getEntryCell(inst);
  return {
    type: 'furniture', name: `${tpl.icon} 在${tpl.name}`, targetName: tpl.name,
    sceneId: inst.sceneId, gridCol: entry.col, gridRow: entry.row,
    instanceId: inst.instanceId, remaining: tpl.duration,
  };
}

function makeTalkItem(target) {
  return makeInteractionItem(CHARS[selectedIdx], target, CONFIG.interactionTemplates[101]);
}

function getInteractionTemplate(id) {
  return CONFIG.interactionTemplates?.[id];
}

function getSkillLevel(c, skillId) {
  if (!c.skills?.includes(skillId)) return 0;
  return c.skillLevels?.[skillId] ?? (skillId === 'poetry' ? 2 : 1);
}

function interactionCooldownKey(initId, targetId, tplId) {
  return `${initId}|${targetId}|${tplId}`;
}

function formatInteractionLine(line, a, b) {
  return line.replace(/\{A\}/g, a.short).replace(/\{B\}/g, b.short);
}

function getTalkBlockReason(c) {
  for (const st of c.activeStates || []) {
    const sd = CONFIG.stateDefs[st.id];
    if (sd?.blockedSkills?.includes('talk')) return `「${sd.name}」难言`;
  }
  return '';
}

function checkInteractionAvailable(initiator, target, tpl) {
  if (!initiator || !target || initiator.id === target.id) return { ok: false, reason: '无效' };
  const talkBlock = getTalkBlockReason(initiator);
  if (talkBlock) return { ok: false, reason: talkBlock };
  if (!canUseSkill(initiator, 'talk')) return { ok: false, reason: '无法交谈' };
  const rel = getRelationValue(initiator.id, target.id);
  if (rel > (tpl.relMax ?? 100)) return { ok: false, reason: '关系过高' };
  const soft = InteractionScoreSystem?.checkSoftLock?.(initiator, target, tpl);
  if (soft) {
    const onLowScore = InteractionScoreSystem?.resolveOnLowScore?.(initiator, target, tpl);
    const stateHint = InteractionScoreSystem?.lowScoreHint?.(tpl, initiator, target) || '尴尬';
    const reason = soft.reason === 'axis' ? `情分未达·或${stateHint}`
      : soft.reason === 'unlock' ? `条件未足·或${stateHint}`
      : `情分欠·或${stateHint}`;
    return { ok: 'low', reason, score: soft.score, minScore: soft.minScore, onLowScore, softReason: soft.reason };
  }
  if (tpl.skillReq) {
    const lv = getSkillLevel(initiator, tpl.skillReq.skill);
    if (lv < tpl.skillReq.level) return { ok: false, reason: '技能未达' };
  }
  if (tpl.once && interactionOnceUsed.has(interactionCooldownKey(initiator.id, target.id, tpl.id)))
    return { ok: false, reason: '仅一次' };
  const cdEnd = interactionCooldowns[interactionCooldownKey(initiator.id, target.id, tpl.id)] || 0;
  const now = performance.now() / 1000;
  if (cdEnd > now) return { ok: false, reason: `冷却${Math.ceil(cdEnd - now)}s` };

  if (InteractionSocialSystem?.evaluate) {
    const social = InteractionSocialSystem.evaluate(initiator, target, tpl);
    if (!social.ok) return social;
    return {
      ok: true, reason: '',
      risky: !!social.risky,
      riskHint: social.riskHint || '',
      successRate: social.successRate,
      riskMeta: social.riskMeta,
    };
  }
  return { ok: true, reason: '' };
}

function getAvailableInteractions(initiator, target) {
  const showLocked = InteractionSocialSystem?.cfg?.()?.showLockedInteractions;
  const groups = [];
  for (const cat of CONFIG.interactionCategories || []) {
    const items = [];
    for (const tpl of Object.values(CONFIG.interactionTemplates || {})) {
      if (tpl.category !== cat.id) continue;
      const chk = checkInteractionAvailable(initiator, target, tpl);
      if (chk.locked && !showLocked) continue;
      items.push({ tpl, ...chk });
    }
    if (items.length) {
      items.sort((a, b) => InteractionSocialSystem?.sortTemplates?.(a, b) ?? 0);
      groups.push({ cat, items });
    }
  }
  return groups;
}

function resolveLowScoreStatus(tpl, onLow) {
  const low = onLow || tpl.onLowScore;
  const lowState = low?.effects?.find(e => e.system === 'state')?.stateId;
  return CONFIG.stateDefs[lowState]?.name || '尴尬收场';
}

// 关系不足时的软锁反馈：不执行正常效果，改触发 onLowScore
function applyLowScoreEffects(initiator, target, tpl, score, onLowOverride) {
  const onLow = onLowOverride || InteractionScoreSystem?.resolveOnLowScore?.(initiator, target, tpl);
  const minScore = InteractionScoreSystem?.getMinScore?.(tpl) ?? tpl.relMin ?? -100;
  const label = onLow ? resolveLowScoreStatus(tpl, onLow) : '关系不足';
  log(`⚠ ${initiator.short}对${target.short}「${tpl.name}」— ${label}（综合分${score}<${minScore}）`);
  EventBus.emit('interaction:lowscore', {
    initiatorId: initiator.id, targetId: target.id, interactionId: tpl.id,
    score, minScore,
  });
  if (!onLow) return;
  // 应用 onLowScore 中的状态效果
  for (const ef of onLow.effects || []) {
    if (ef.system !== 'state' || !ef.stateId) continue;
    const targets = ef.target === 'both' ? [initiator, target]
                  : ef.target === 'target' ? [target] : [initiator];
    for (const tgt of targets) {
      applyState(tgt, ef.stateId);
      emitInteractionState(tgt, ef.stateId, initiator, target, tpl, 'lowscore');
    }
  }
  // 应用 onLowScore 中的轴效果（惩罚）
  for (const ae of onLow.axisEffects || []) {
    if (ae.axis === 'submission') {
      if (ae.who === 'target') changeAxis(target.id, initiator.id, 'submission', ae.delta || 0);
      else changeAxis(initiator.id, target.id, 'submission', ae.delta || 0);
    } else {
      changeAxis(initiator.id, target.id, ae.axis, ae.delta || 0);
    }
  }
}

function runAwkwardDialogue(c, target, tpl, onComplete, ctx) {
  const begin = (dialogue) => {
    lockParticipantsForDialogue(c, target, tpl);
    c.action = {
      type: 'interaction', target, tpl, dialogue,
      effectsApplied: true, onComplete, lowScoreMode: true,
    };
    c.statusText = `与${target.short}·${tpl.name}`;
    target.statusText = ctx.targetStatus || '话不投机';
    const item = c.actionQueue[0];
    if (item?.type === 'interaction') {
      item.phase = ctx.mode === 'risk_fail' ? 'executing' : 'lowscore';
      item.statusReason = ctx.statusReason || '尴尬收场';
      if (dialogue.llmMode) item.phase = 'executing';
    }
    EventBus.emit('interaction:awkward_started', {
      initiatorId: c.id, targetId: target.id, interactionId: tpl.id,
      mode: ctx.mode || 'lowscore', score: ctx.score,
    });
    if (dialogue.llmMode) {
      InteractionLlmSystem?.attachSession?.(c);
      speechBubble = null;
    } else {
      const sp = dialogue.speakers?.[0] ? getChar(dialogue.speakers[0]) : c;
      speechBubble = { char: sp || c, text: dialogue.lines?.[0] || ctx.fallbackText };
    }
    uiDirty = true;
  };

  const awkwardCtx = {
    mode: ctx.mode || 'lowscore',
    score: ctx.score ?? getRelationValue(c.id, target.id),
    minScore: ctx.minScore ?? InteractionScoreSystem?.getMinScore?.(tpl),
    onLowScore: ctx.onLowOverride,
  };
  if (InteractionLlmSystem?.tryBeginAwkward?.(c, target, tpl, awkwardCtx, begin)) return;

  speechBubble = { char: target, text: ctx.fallbackText || '……（神色淡淡，不接这话）' };
  setTimeout(() => { speechBubble = null; if (onComplete) onComplete(); }, 2200);
  uiDirty = true;
}

function runLowScoreInteraction(c, target, tpl, score, onComplete, onLowOverride) {
  applyLowScoreEffects(c, target, tpl, score, onLowOverride);
  const status = resolveLowScoreStatus(tpl, onLowOverride);
  c.statusText = status;
  target.statusText = '话不投机';
  runAwkwardDialogue(c, target, tpl, onComplete, {
    mode: 'lowscore', score, onLowOverride,
    statusReason: `情分不足·${status}`,
    fallbackText: '……（神色淡淡，不接这话）',
  });
}

function emitInteractionState(who, stateId, initiator, target, tpl, source) {
  EventBus.emit('interaction:state', {
    charId: who.id, stateId, otherId: who.id === initiator.id ? target.id : initiator.id,
    interactionId: tpl.id, interactionName: tpl.name, source: source || 'effect',
  });
}

function applyInteractionEffects(initiator, target, tpl, opts = {}) {
  const skipAxis = !!opts.skipAxis;
  for (const ef of tpl.effects || []) {
    if (ef.prob !== undefined && Math.random() > ef.prob) continue;
    const whoList = ef.target === 'both' ? [initiator, target]
      : ef.target === 'initiator' ? [initiator]
      : ef.target === 'target' ? [target] : [];
    for (const who of whoList) {
      if (ef.system === 'need' && ef.key) {
        const cf = calcNeedCoeffs(who);
        who.needs[ef.key] = Math.max(cf[ef.key].min, Math.min(cf[ef.key].max, who.needs[ef.key] + (ef.delta || 0)));
      }
      if (ef.system === 'state' && ef.stateId) {
        applyState(who, ef.stateId);
        emitInteractionState(who, ef.stateId, initiator, target, tpl, 'effect');
      }
      if (ef.system === 'memory' && ef.text) {
        const other = who.id === initiator.id ? target : initiator;
        who.memories.push({ text: ef.text, tag: ef.tag || '', with: other.id, hour: gameHour, day: gameDay });
        log(`${who.short}记入「${ef.text}」`);
        EventBus.emit('memory:add', { charId: who.id, text: ef.text, tag: ef.tag, with: other.id });
      }
    }
      if (ef.system === 'relation') {
        if (ef.setValue !== undefined) {
          // 直接设置好感轴（兼容旧 setValue）
          const k = relKey(initiator.id, target.id);
          if (!relations[k]) relations[k] = { affection: 0, trust: 0, friendship: 0, submission: {}, initType: '陌生人', note: '', lastInteract: 0, memoryIds: [], thresholdEvents: [] };
          const old = computeRelScore(relations[k]);
          relations[k].affection = Math.max(-100, Math.min(100, ef.setValue));
          relations[k].trust = Math.max(-100, Math.min(100, Math.round(ef.setValue * 0.8)));
          relations[k].lastInteract = getGameTimestamp();
          const newVal = computeRelScore(relations[k]);
          const typeLabel = getRelationTypeLabel(newVal);
          log(`关系变化：${initiator.short}↔${target.short} ${old}→${newVal}（${typeLabel}）`);
          EventBus.emit('relation:change', { idA: initiator.id, idB: target.id, old, new: newVal, delta: newVal - old, typeLabel });
        } else if (ef.delta && !(tpl.axisEffects?.length > 0)) {
          // 旧格式兜底：只在模板没有 axisEffects 时才用，避免与 axisEffects 双重叠加
          changeRelation(initiator.id, target.id, ef.delta);
        }
      }
  }
  // 应用精准轴效果（axisEffects 字段）
  if (skipAxis) {
    checkNeedTriggers(initiator);
    checkNeedTriggers(target);
    EventBus.emit('interaction:effects', { initiatorId: initiator.id, targetId: target.id, interactionId: tpl.id, interactionName: tpl.name });
    uiDirty = true;
    return;
  }
  for (const ae of tpl.axisEffects || []) {
    if (ae.prob !== undefined && Math.random() > ae.prob) continue;
    if (ae.axis === 'submission') {
      // 服从轴是方向性的：who:'target' 表示 target 对 initiator 的服从度变化
      if (ae.who === 'target') {
        changeAxis(target.id, initiator.id, 'submission', ae.delta || 0);
      } else {
        // 默认 who:'initiator'：initiator 对 target 的服从度变化
        changeAxis(initiator.id, target.id, 'submission', ae.delta || 0);
      }
    } else {
      changeAxis(initiator.id, target.id, ae.axis, ae.delta || 0);
    }
  }
  checkNeedTriggers(initiator);
  checkNeedTriggers(target);
  EventBus.emit('interaction:effects', { initiatorId: initiator.id, targetId: target.id, interactionId: tpl.id, interactionName: tpl.name });
  uiDirty = true;
}

function setInteractionCooldown(initiator, target, tpl) {
  const key = interactionCooldownKey(initiator.id, target.id, tpl.id);
  interactionCooldowns[key] = performance.now() / 1000 + (tpl.cooldown || 0);
  if (tpl.once) interactionOnceUsed.add(key);
}

function makeInteractionItem(initiator, target, tpl) {
  return {
    type: 'interaction',
    name: `${tpl.type === 'dialogue' ? '💬' : '🤝'} ${tpl.name}·${target.short}`,
    targetName: target.short,
    interactionId: tpl.id,
    targetCharId: target.id,
    sceneId: target.sceneId,
    gridCol: Math.round(target.gridCol),
    gridRow: Math.round(target.gridRow),
    remaining: tpl.duration || 5,
  };
}

function buildInteractionDialogue(c, target, tpl) {
  const raw = tpl.lines?.length ? tpl.lines : ['{A}与{B}相视无言。'];
  return {
    lines: raw.map(l => formatInteractionLine(l, c, target)),
    lineIdx: 0,
    phase: 'lines',
    lineTimer: 2.5,
    actTimer: tpl.type === 'action' ? (tpl.duration || 5) : 0,
  };
}

function walkToCharAdjacent(c, target, onArrive) {
  if (!canUseSkill(c, 'move')) { log(`${c.short}无法行走。`); return false; }
  const tCol = Math.round(target.gridCol), tRow = Math.round(target.gridRow);
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
  let best = null;
  for (const [dc, dr] of dirs) {
    const nc = tCol + dc, nr = tRow + dr;
    const cell = WORLD[nc]?.[nr];
    if (!cell?.walkable || cell.entryFor) continue;
    if (isCellOccupiedByOther(nc, nr, c.id, [target.id])) continue;
    const p = astar(Math.round(c.gridCol), Math.round(c.gridRow), nc, nr, { excludeCharIds: [c.id, target.id] });
    if (p && (!best || p.length < best.path.length)) best = { col: nc, row: nr, path: p };
  }
  if (!best) { log(`${c.short}无法靠近${target.short}。`); return false; }
  return startPathTo(c, best.col, best.row, onArrive, { excludeCharIds: [c.id, target.id] });
}

function startInteraction(c, target, tpl, onComplete) {
  if (!canUseSkill(c, 'talk')) { log(`${c.short}当前无法互动。`); return false; }
  const chk = checkInteractionAvailable(c, target, tpl);
  if (!chk.ok && chk.ok !== 'low') { log(`${tpl.name}不可用：${chk.reason}`); return false; }
  // 软锁（关系不足）：走近后触发 onLowScore，并正常结束队列项
  if (chk.ok === 'low') {
    const finish = () => runLowScoreInteraction(c, target, tpl, chk.score, onComplete, chk.onLowScore);
    if (!walkToCharAdjacent(c, target, finish)) finish();
    return true;
  }
  return walkToCharAdjacent(c, target, () => {
    const riskMeta = chk.riskMeta || InteractionSocialSystem?.resolveRisk?.(c, target, tpl);
    if (riskMeta?.isRisky) {
      const roll = Math.random();
      const ok = roll <= (chk.successRate ?? riskMeta.successRate ?? 0.5);
      const passed = InteractionSocialSystem?.applyRiskOutcome?.(c, target, tpl, ok, riskMeta);
      if (!passed) {
        c.statusText = '逾矩未成';
        target.statusText = '神色尴尬';
        runAwkwardDialogue(c, target, tpl, onComplete, {
          mode: 'risk_fail',
          score: getRelationValue(c.id, target.id),
          statusReason: '逾矩未成',
          targetStatus: '神色尴尬',
          fallbackText: '……（退后半步，不语）',
        });
        return;
      }
    }
    const begin = (dialogue) => {
      lockParticipantsForDialogue(c, target, tpl);
      c.action = { type: 'interaction', target, tpl, dialogue, effectsApplied: false, onComplete };
      c.statusText = `与${target.short}·${tpl.name}`;
      target.statusText = `与${c.short}·${tpl.name}`;
      EventBus.emit('interaction:started', {
        initiatorId: c.id, targetId: target.id, interactionId: tpl.id,
        interactionName: tpl.name, category: tpl.category,
      });
      if (c.actionQueue[0]) {
        c.actionQueue[0].phase = 'executing';
        c.actionQueue[0].remaining = tpl.duration || 5;
      }
      if (dialogue.llmMode) {
        InteractionLlmSystem?.attachSession?.(c);
        speechBubble = null;
      } else {
        const sp = dialogue.speakers?.[0] ? getChar(dialogue.speakers[0]) : c;
        speechBubble = { char: sp || c, text: dialogue.lines[0] };
      }
      uiDirty = true;
    };
    if (InteractionLlmSystem?.tryBegin?.(c, target, tpl, begin)) return;
    begin(buildInteractionDialogue(c, target, tpl));
  });
}

function finishInteractionAction(c, opts = {}) {
  const act = c.action;
  if (!act || act.type !== 'interaction') return;
  const t = act.target;
  const tpl = act.tpl;
  const d = act.dialogue;
  if (d?.llmMode) InteractionLlmSystem?.hideOverlay?.();

  const applyFx = act.lowScoreMode ? false
    : (opts.applyEffects !== undefined
      ? opts.applyEffects
      : (!d?.llmMode || !!d?.naturalEnd));

  unlockParticipantsForDialogue(c, t);

  if (!act.effectsApplied && applyFx) {
    if (d?.segmentsRelationApplied > 0) {
      applyRemainingRelationEffects(c, t, tpl, d.segmentsRelationApplied, d.maxLlmRounds, d.mood);
      applyInteractionEffects(c, t, tpl, { skipAxis: true });
    } else {
      applyInteractionEffects(c, t, tpl);
    }
    setInteractionCooldown(c, t, tpl);
    log(`${c.short}与${t.short}完成「${tpl.name}」（关系${getRelationValue(c.id, t.id)}）`);
    EventBus.emit('interaction:complete', { initiatorId: c.id, targetId: t.id, interactionId: tpl.id, interactionName: tpl.name });
    act.effectsApplied = true;
  } else if (!applyFx && !act.lowScoreMode) {
    if (d?.segmentRelationLog?.length) {
      revertSegmentRelationEffects(c, t, d.segmentRelationLog.flat());
    }
    log(`${c.short}与${t.short}中止「${tpl.name}」`);
    EventBus.emit('interaction:aborted', { initiatorId: c.id, targetId: t.id, interactionId: tpl.id, interactionName: tpl.name });
  } else if (act.lowScoreMode && (d?.naturalEnd || d?.awkwardMode)) {
    log(`${c.short}对${t.short}「${tpl.name}」话不投机，尴尬收场。`);
    EventBus.emit('interaction:awkward_ended', { initiatorId: c.id, targetId: t.id, interactionId: tpl.id });
  }

  const cb = act.onComplete;
  c.action = null;
  if (!act.lowScoreMode) {
    const endStatus = applyFx ? '话毕' : (opts.statusText || '话被打断');
    t.statusText = endStatus;
    c.statusText = endStatus;
  }
  speechBubble = null;
  if (cb) cb();
  uiDirty = true;
}

function abortInteractionAction(c, reason) {
  if (!c?.action || c.action.type !== 'interaction') return;
  finishInteractionAction(c, { applyEffects: false, statusText: reason || '话被打断' });
}

function getQueuePhaseLabel(c, item, idx) {
  if (item.statusReason) return item.statusReason;
  if (item.phase === 'lowscore') return item.statusReason || '情分不足';
  if (item.phase === 'generating') return '撰写对白中…';
  if (item.phase === 'waiting') {
    if (item.type === 'furniture') return '排队等家具…';
    return '排队中…';
  }
  if (idx === 0 && c.action) {
    if (c.action.type === 'move') return '移动中…';
    if (c.action.type === 'furniture') return `执行中 ${Math.ceil(c.action.timer || 0)}s`;
    if (c.action.type === 'talk') return '交谈中…';
    if (c.action.type === 'interaction') {
      const d = c.action.dialogue;
      if (d?.phase === 'llm_generating') return '撰写对白中…';
      if (d?.waitUser) return '待播放';
      return `${c.action.tpl?.name || '互动'}中…`;
    }
  }
  if (idx === 0 && !c.action) {
    if (InteractionLlmSystem?.isPending?.(c)) return '撰写对白中…';
    if (item.type === 'interaction') return '前往互动…';
    return '准备中…';
  }
  return '等待中';
}
function relKey(a, b) { return [a, b].sort().join('|'); }
function getChar(id) { return CHARS.find(c => c.id === id); }
function getCharDef(id) { return CONFIG.characters.find(c => c.id === id); }

function calcNeedCoeffs(c) {
  const def = getCharDef(c.id);
  const needCoeffs = def?.baseNeedCoeffs || c.baseNeedCoeffs || {};
  const coeffs = {};
  for (const nd of getNeedDefs()) {
    const base = { ...(needCoeffs[nd.key] || { min: 0, max: 100, grow: 1, decay: 1, timeDecay: 1 }) };
    for (const [attr, val] of Object.entries(def?.attributes || c.attributes || {})) {
      const rules = CONFIG.attributeRules[attr]?.[nd.key];
      if (!rules) continue;
      const d = (val - 50) / 50;
      for (const [k, coef] of Object.entries(rules))
        base[k] = (base[k] || (k === 'min' || k === 'max' ? (k === 'max' ? 100 : 0) : 1)) + coef * d * 50;
    }
    coeffs[nd.key] = base;
  }
  for (const st of c.activeStates) {
    const sd = CONFIG.stateDefs[st.id];
    if (!sd?.needMods) continue;
    for (const [nk, mods] of Object.entries(sd.needMods)) {
      if (!coeffs[nk]) continue;
      for (const [k, v] of Object.entries(mods)) coeffs[nk][k] = (coeffs[nk][k] || 1) * v;
    }
  }
  for (const tm of c.tempNeedMods) {
    if (tm.remaining <= 0) continue;
    for (const [nk, mods] of Object.entries(tm.mods)) {
      if (!coeffs[nk]) continue;
      for (const [k, v] of Object.entries(mods)) coeffs[nk][k] = (coeffs[nk][k] || 1) * v;
    }
  }
  CharSpecialtySystem.applyNeedMods(c, coeffs);
  return coeffs;
}

function canUseSkill(c, skillId) {
  if (skillId === 'move' && c.ai?.urgentNeed) return c.skills.includes('move');
  if (!c.skills.includes(skillId)) return false;
  for (const st of c.activeStates) {
    const sd = CONFIG.stateDefs[st.id];
    if (sd?.blockedSkills?.includes(skillId)) return false;
  }
  return true;
}

// applyState 已提取至 js/systems/state.js

// updateStates 扩展：在 state.js 核心逻辑之上追加 tempNeedMods 处理
{
  const _updateStatesCore = updateStates;
  updateStates = function(c, dt) {
    _updateStatesCore(c, dt);
    if (c.tempNeedMods) c.tempNeedMods = c.tempNeedMods.filter(tm => { tm.remaining -= dt; return tm.remaining > 0; });
  };
}

function checkNeedTriggers(c) {
  const prev = c._prevNeeds;
  for (const nd of getNeedDefs()) {
    const k = nd.key, v = c.needs[k], pv = prev[k];
    for (const [sid, sd] of Object.entries(CONFIG.stateDefs)) {
      const tr = sd.trigger;
      if (!tr || tr.action || c.activeStates.some(s => s.id === sid)) continue;
      if (tr.need !== k) continue;
      const hit = tr.op === 'lt' ? (pv >= tr.value && v < tr.value) :
                  tr.op === 'gt' ? (pv <= tr.value && v > tr.value) : false;
      if (hit) applyState(c, sid);
    }
    prev[k] = v;
  }
}

function decayNeeds(c, dt) {
  const using = c.action?.type === 'furniture' && c.action.phase === 'use';
  const coeffs = calcNeedCoeffs(c);
  const gdm = getGameMinuteDelta(dt);
  for (const nd of getNeedDefs()) {
    const k = nd.key, cf = coeffs[k];
    if (using) {
      const tpl = c.action?.tpl;
      const restoring = tpl?.needRestores?.some(nr => nr.need === k);
      if (restoring) continue;
    }
    const decay = cf.decay * cf.timeDecay * gdm * NEED_DECAY_PER_GAME_MIN;
    c.needs[k] = Math.max(cf.min, Math.min(cf.max, c.needs[k] - decay));
  }
  checkNeedTriggers(c);
  checkAINeedEvents(c);
}

function log(msg, category = 'system') {
  const t = `第${gameDay}日 ${String(Math.floor(gameHour)).padStart(2,'0')}:${String(gameMinute).padStart(2,'0')}`;
  const line = `[${t}] ${msg}`;
  logs.unshift(line);
  if (logs.length > 200) logs.pop();
  let text = msg;
  if (category === 'task' && !text.startsWith('⚠')) text = '⚠ ' + text;
  if (category === 'social' && !text.startsWith('💬') && /：|说|道/.test(text)) text = '💬 ' + text;
  appendGameLog({ text, category, timeLabel: formatLogTimeLabel(), day: gameDay, hour: gameHour, minute: gameMinute });
  EventBus.emit('log:add', { message: msg, line, category });
}

function getMood(c) {
  const vals = getNeedDefs().map(n => c.needs[n.key]);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  if (avg >= 70) return '😊';
  if (avg >= 40) return '😐';
  return '😢';
}

function isBusy(c) { return c.action && c.action.type !== 'idle'; }

function cancelAction(c, reason) {
  if (c.action?.type === 'furniture') releaseFurniture(c);
  else if (c.actionQueue[0]?.type === 'furniture') releaseFurnitureStandSlot(c, c.actionQueue[0].instanceId);
  if (c.action?.type === 'talk' || c.action?.type === 'interaction') speechBubble = null;
  c.action = null;
  c.path = [];
  if (reason) c.statusText = reason;
  uiDirty = true;
}

function startPathTo(c, eCol, eRow, onArrive, opts = {}) {
  if (!canUseSkill(c, 'move')) { log(`${c.short}当前无法行走。`); return false; }
  if (c._interactionLock && !c._interactionLock.allowMove) return false;
  const sCol = Math.round(c.gridCol), sRow = Math.round(c.gridRow);
  const excludeCharIds = [c.id, ...(opts.excludeCharIds || [])];
  if (isCellOccupiedByOther(eCol, eRow, c.id, opts.excludeCharIds || [])) {
    log(`${c.short}目标格已被占用。`);
    return false;
  }
  const astarOpts = { excludeCharIds };
  const routed = SceneAccessSystem?.findPathWithAccess
    ? SceneAccessSystem.findPathWithAccess(c, sCol, sRow, eCol, eRow, astarOpts)
    : null;
  let path = routed?.path;
  if (!path) {
    path = astar(sCol, sRow, eCol, eRow, astarOpts);
    if (path && SceneAccessSystem?.checkPathAccess) {
      path._startCol = sCol;
      path._startRow = sRow;
      const access = SceneAccessSystem.checkPathAccess(c, path, eCol, eRow);
      if (access.ok === false || access.ok === 'attempt') {
        SceneAccessSystem.denyMoveLog(c, access, getScene(sceneAt(eCol, eRow)?.id)?.name);
        return false;
      }
    }
  } else if (routed.access?.ok === 'attempt') {
    SceneAccessSystem.denyMoveLog(c, routed.access, getScene(sceneAt(eCol, eRow)?.id)?.name);
    return false;
  }
  if (!path) { log(`${c.short}无法到达该处。`); return false; }
  if (path.length === 0) { if (onArrive) onArrive(); return true; }
  if (c.action?.type === 'furniture') releaseFurniture(c);
  c.action = { type: 'move', onArrive, targetInst: null };
  c.path = path;
  c.statusText = '行走中';
  if (c.actionQueue[0]) c.actionQueue[0].phase = 'moving';
  uiDirty = true;
  return true;
}

function startFurniture(c, inst, onComplete) {
  const item = { type: 'furniture', instanceId: inst.instanceId, phase: 'moving' };
  tryExecuteFurnitureQueue(c, item);
  if (!c.action && c.actionQueue[0]?.phase !== 'waiting') return false;
  return true;
}

function resolveChar(ref, fb) {
  if (!ref) return getChar(fb);
  return CHARS.find(x => x.id === ref || x.short === ref || x.name.includes(ref)) || getChar(fb);
}

function pickDialogue(a, b) {
  const pool = CONFIG.dialogues[relKey(a, b)] || DEFAULT_DIALOGUE;
  const aff = getRelationValue(a, b);
  const tier = aff >= 40 ? 'high' : aff >= 10 ? 'mid' : 'low';
  let lines = pool[tier];
  if (!lines?.length) lines = DEFAULT_DIALOGUE.mid;
  const line = lines[Math.floor(Math.random() * lines.length)];
  const sp = resolveChar(line.s, a), rp = resolveChar(line.r, sp.id === b ? a : b);
  return { speakerId: sp.id, replyId: rp.id, text: line.t, reply: line.reply, affDelta: line.aff ?? 2, phase: 'line1', timer: 2.5 };
}

function startTalk(c, target, onComplete) {
  if (!canUseSkill(c, 'talk')) { log(`${c.short}当前无法交谈。`); return false; }
  return walkToCharAdjacent(c, target, () => {
    c.action = { type: 'talk', target, phase: 'talk', dialogue: pickDialogue(c.id, target.id), affApplied: false, onComplete };
    c.statusText = `与${target.short}交谈`;
    target.statusText = `与${c.short}说话`;
    if (c.actionQueue[0]) c.actionQueue[0].phase = 'executing';
    speechBubble = { char: getChar(c.action.dialogue.speakerId), text: c.action.dialogue.text };
  });
}

function tryRepathAroundBlock(c) {
  if (!c.path?.length) return false;
  const dest = c.path[c.path.length - 1];
  const sCol = Math.round(c.gridCol), sRow = Math.round(c.gridRow);
  const newPath = astar(sCol, sRow, dest.col, dest.row, { excludeCharIds: [c.id] });
  if (!newPath?.length) return false;
  c.path = newPath;
  c._moveBlockAcc = 0;
  return true;
}

function updateMovement(c, dt) {
  if (c._interactionLock && !c._interactionLock.allowMove) {
    c.path = [];
    enforceInteractionPosition(c);
    return false;
  }
  if (!c.path.length) return false;
  const next = c.path[0];
  if (isCellOccupiedByOther(next.col, next.row, c.id)) {
    c._moveBlockAcc = (c._moveBlockAcc || 0) + dt;
    if (c._moveBlockAcc > 0.6) tryRepathAroundBlock(c);
    return false;
  }
  c._moveBlockAcc = 0;
  const tp = gridToPixel(next.col, next.row);
  const dx = tp.x - c.x, dy = tp.y - c.y;
  const dist = Math.hypot(dx, dy);
  const speed = 120 / getGroundSpeed(Math.floor(c.gridCol), Math.floor(c.gridRow)) * dt;
  if (dist <= speed) {
    if (isCellOccupiedByOther(next.col, next.row, c.id)) {
      c._moveBlockAcc = (c._moveBlockAcc || 0) + dt;
      if (c._moveBlockAcc > 0.6) tryRepathAroundBlock(c);
      return false;
    }
    c.gridCol = next.col; c.gridRow = next.row;
    c.x = tp.x; c.y = tp.y;
    c.path.shift();
    moveCharBucket(c);
    const sc = sceneAt(next.col, next.row);
    if (sc) {
      if (c._lastSceneId !== undefined && c._lastSceneId !== sc.id)
        EventBus.emit('scene:entered', { charId: c.id, sceneId: sc.id, oldSceneId: c._lastSceneId });
      c.sceneId = sc.id;
      c._lastSceneId = sc.id;
    }
    return c.path.length === 0;
  }
  c.x += (dx / dist) * speed;
  c.y += (dy / dist) * speed;
  c.gridCol += (dx / dist) * speed / CELL * 0.15;
  c.gridRow += (dy / dist) * speed / CELL * 0.15;
  return false;
}

function updateAction(c, dt) {
  if (!c.action) {
    if (['行走', '前往', '正在', '去找', '与', '使用'].some(k => c.statusText.includes(k))) c.statusText = '闲庭漫步';
    if (c.statusText === '闲庭漫步' && Math.random() < dt * 0.01) {
      c.statusText = (IDLE[c.id] || ['静候'])[Math.floor(Math.random() * (IDLE[c.id]?.length || 1))];
    }
    return;
  }

  if (c.action.type === 'move') {
    if (updateMovement(c, dt)) {
      const cb = c.action.onArrive;
      c.action = null;
      c.path = [];
      if (cb) cb();
    }
    return;
  }

  if (c.action.type === 'furniture' && c.action.phase === 'use') {
    const { inst, tpl } = c.action;
    c.action.timer -= dt;
    FURN_RT[inst.instanceId].remaining = c.action.timer;
    if (c.actionQueue[0]) c.actionQueue[0].remaining = c.action.timer;
    const cf = calcNeedCoeffs(c);
    const gdm = getGameMinuteDelta(dt);
    for (const nr of tpl.needRestores || []) {
      c.needs[nr.need] = Math.min(cf[nr.need].max,
        c.needs[nr.need] + nr.ratePerSec * cf[nr.need].grow * gdm * NEED_RESTORE_PER_GAME_MIN);
    }
    checkNeedTriggers(c);
    if (tpl.stopWhenFull && needsFullFromFurn(c, tpl)) {
      log(`${c.short}需求已满，提前结束${tpl.name}。`);
      applyFurnEffects(c, tpl, 'end');
      EventBus.emit('furniture:complete', { charId: c.id, instanceId: inst.instanceId, category: tpl.category, templateId: inst.templateId });
      releaseFurniture(c);
      const cb = c.action.onComplete;
      c.action = null;
      c.statusText = '心满意足';
      if (c.ai?.urgentNeed) checkUrgentRecovery(c);
      if (cb) cb();
      uiDirty = true;
      return;
    }
    if (c.action.timer <= 0) {
      log(`${c.short}完成${tpl.name}。`);
      applyFurnEffects(c, tpl, 'end');
      EventBus.emit('furniture:complete', { charId: c.id, instanceId: inst.instanceId, category: tpl.category, templateId: inst.templateId });
      releaseFurniture(c);
      const cb = c.action.onComplete;
      c.action = null;
      c.statusText = '心满意足';
      if (c.ai?.urgentNeed) checkUrgentRecovery(c);
      if (cb) cb();
      uiDirty = true;
    }
    return;
  }

  if (c.action.type === 'talk') {
    const t = c.action.target;
    const d = c.action.dialogue;
    d.timer -= dt;
    if (d.phase === 'line1' && d.timer <= 0) {
      d.phase = 'line2'; d.timer = 2.5;
      speechBubble = { char: getChar(d.replyId), text: d.reply };
    } else if (d.phase === 'line2' && d.timer <= 0) {
      if (!c.action.affApplied) {
        changeRelation(c.id, t.id, d.affDelta);
        log(`${c.short}与${t.short}友好交谈（关系${d.affDelta >= 0 ? '+' : ''}${d.affDelta}，现${getRelationValue(c.id, t.id)}）`);
        c.action.affApplied = true;
      }
      const cb = c.action.onComplete;
      c.action = null; t.statusText = '话毕'; c.statusText = '话毕';
      speechBubble = null;
      if (cb) cb();
      uiDirty = true;
    }
    return;
  }

  if (c.action.type === 'interaction') {
    const t = c.action.target;
    const tpl = c.action.tpl;
    const d = c.action.dialogue;
    enforceInteractionPosition(c);
    if (t) enforceInteractionPosition(t);
    if (d.llmMode) {
      InteractionLlmSystem?.updateDialogue?.(c, dt);
      return;
    }
    d.lineTimer -= dt;
    if (d.phase === 'lines') {
      if (d.lineTimer <= 0) {
        d.lineIdx++;
        if (d.lineIdx >= d.lines.length) {
          if (tpl.type === 'action' && d.actTimer > 0) {
            d.phase = 'acting';
            speechBubble = null;
            c.statusText = `${tpl.name}中…`;
          } else finishInteractionAction(c);
        } else {
          d.lineTimer = 2.5;
          const speakerId = d.speakers?.[d.lineIdx];
          const speaker = speakerId ? getChar(speakerId) : (d.lineIdx % 2 === 0 ? c : t);
          speechBubble = { char: speaker, text: d.lines[d.lineIdx] };
        }
      }
    } else if (d.phase === 'acting') {
      d.actTimer -= dt;
      if (c.actionQueue[0]) c.actionQueue[0].remaining = Math.max(0, d.actTimer);
      if (d.actTimer <= 0) finishInteractionAction(c);
    }
  }
}

