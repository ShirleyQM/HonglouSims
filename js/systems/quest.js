const QuestSystem = (() => {
  let enabled = false;
  let unsubs = [];
  let instances = [];
  let history = [];
  let nextId = 1;
  let nextBatchId = 1;
  let cooldowns = {};
  let issueAcc = 0;
  let groupIssueAcc = 0;
  let interactionTrack = {};

  function cfg() { return CONFIG.questConfig || DEFAULT_CONFIG.questConfig; }
  function tpl(id) { return cfg().templates?.[id]; }
  function st() { return cfg(); }

  function getCharFamilyRole(charId) {
    const fam = FamilySystem.findFamilyOfChar(charId);
    return fam ? FamilySystem.getCharRole(charId, fam.id) : null;
  }

  function resolveTargetCharId(target, inst) {
    if (target === 'issuer') return inst.issuerId;
    if (target === 'assignee') return inst.assigneeId;
    return target;
  }

  function resolveSceneId(target, inst) {
    if (target === 'assignee_residence') {
      const fam = FamilySystem.findFamilyOfChar(inst.assigneeId);
      return fam?.residenceSceneId ?? getChar(inst.assigneeId)?.sceneId;
    }
    if (typeof target === 'number') return target;
    return parseInt(target, 10) || null;
  }

  function fillText(text, inst) {
    if (!text) return '';
    const issuer = getChar(inst.issuerId), assignee = getChar(inst.assigneeId);
    return String(text)
      .replace(/\{issuer\}/g, issuer?.short || '某人')
      .replace(/\{assignee\}/g, assignee?.short || '你');
  }

  function cooldownKey(templateId, assigneeId) { return templateId + '|' + assigneeId; }

  function onCooldown(templateId, assigneeId) {
    return getGameTimestamp() < (cooldowns[cooldownKey(templateId, assigneeId)] || 0);
  }

  function setCooldown(templateId, assigneeId, tpl) {
    const mins = tpl?.repeatCooldownGameMin ?? 1440;
    cooldowns[cooldownKey(templateId, assigneeId)] = getGameTimestamp() + mins;
  }

  function calcDeadline(t, acceptedTs) {
    if (!t || t.deadlineMode === 'NO_DEADLINE') return 0;
    const p = t.deadlineParam ?? 0;
    if (t.deadlineMode === 'GAME_HOURS') return acceptedTs + p * 60;
    if (t.deadlineMode === 'GAME_DAYS') return acceptedTs + p * 1440;
    if (t.deadlineMode === 'BY_TIME_OF_DAY') {
      const dayStart = gameDay * 1440;
      let dl = dayStart + p * 60;
      if (dl <= acceptedTs) dl += 1440;
      return dl;
    }
    if (t.deadlineMode === 'BY_PHASE') return acceptedTs + 180;
    if (t.deadlineMode === 'BEFORE_SLEEP') return (gameDay * 1440) + 22 * 60;
    return acceptedTs + 240;
  }

  function roleMatch(roles, charId) {
    if (!roles?.length) return true;
    const r = getCharFamilyRole(charId);
    return roles.includes(r);
  }

  function hasHierarchyFields(t) {
    return !!(t.issuerRelationRequired?.length || t.singleTargetRelations?.length || t.targetScope === 'group');
  }

  function canAssignTemplate(t, issuerId, assigneeId) {
    if (!t || onCooldown(t.id, assigneeId)) return false;
    if (instances.some(q => q.assigneeId === assigneeId && q.templateId === t.id && [QUEST_STATUS.PENDING, QUEST_STATUS.ACCEPTED].includes(q.status)))
      return false;
    if (t.questType === 'daily' && issuerId) return false;
    if (t.questType !== 'daily' && issuerId) {
      if (hasHierarchyFields(t) && typeof QuestIssueSystem !== 'undefined') {
        if (!QuestIssueSystem.templateMatchesHierarchy(t, issuerId, assigneeId)) return false;
        if (!QuestIssueSystem.issuerMayUseCategory(issuerId, assigneeId, t)) return false;
        if (t.issuerRelationMin != null && getRelationValue(issuerId, assigneeId) < t.issuerRelationMin) return false;
      } else {
        if (!roleMatch(t.issuerRoles, issuerId)) return false;
        if (t.issuerRelationMin != null && getRelationValue(issuerId, assigneeId) < t.issuerRelationMin) return false;
        if (!roleMatch(t.assigneeRoles, assigneeId)) return false;
      }
    } else if (!hasHierarchyFields(t) && !roleMatch(t.assigneeRoles, assigneeId)) {
      return false;
    }
    return true;
  }

  function canIssue(templateId, issuerId, assigneeId) {
    const t = tpl(templateId);
    return !!t && canAssignTemplate(t, issuerId, assigneeId);
  }

  function createInstance(templateId, issuerId, assigneeId, dailySlotId, batchId) {
    const t = tpl(templateId);
    if (!t || !getChar(assigneeId)) return null;
    const now = getGameTimestamp();
    return {
      instanceId: nextId++, templateId, issuerId: issuerId || null, assigneeId,
      status: QUEST_STATUS.PENDING, acceptedTime: 0, deadlineTime: 0,
      progress: {}, dailySlotId: dailySlotId || 0, issuedTime: now,
      batchId: batchId || 0,
    };
  }

  function showQuestBubble(charId, text, style) {
    if (!text || !NarrativeBubbleSystem?.showBubble) return;
    NarrativeBubbleSystem.showBubble({ charId, text, style: style || 'speech', module: 'quest', duration: 4 });
  }

  function bumpQuestUi() {
    uiDirty = true;
    updateBadge();
  }

  function applyEffects(effects, inst) {
    for (const ef of effects || []) {
      if (ef.type === 'relation') {
        const a = resolveTargetCharId(ef.from || 'issuer', inst) || inst.issuerId;
        const b = resolveTargetCharId(ef.to || 'assignee', inst) || inst.assigneeId;
        if (a && b) changeRelation(a, b, ef.delta || 0);
      } else if (ef.type === 'state') {
        const who = getChar(resolveTargetCharId(ef.target || 'assignee', inst));
        if (who && ef.stateId) applyState(who, ef.stateId);
      } else if (ef.type === 'skillXp') {
        const who = getChar(resolveTargetCharId(ef.target || 'assignee', inst));
        if (who && ef.skill) {
          who.skillLevels = who.skillLevels || {};
          who.skillLevels[ef.skill] = (who.skillLevels[ef.skill] || 1) + (ef.delta || 1);
        }
      }
    }
  }

  function acceptQuest(inst, silent) {
    const t = tpl(inst.templateId);
    if (!t) return;
    inst.status = QUEST_STATUS.ACCEPTED;
    inst.acceptedTime = getGameTimestamp();
    inst.deadlineTime = calcDeadline(t, inst.acceptedTime);
    inst.progress = {};
    (t.completeConditions || []).forEach(c => { inst.progress[c.id] = 0; });
    EventBus.emit('quest:accepted', { instanceId: inst.instanceId, templateId: inst.templateId, assigneeId: inst.assigneeId });
    const issueText = fillText(t.texts?.issue, inst);
    if (issueText) showQuestBubble(inst.issuerId || inst.assigneeId, issueText);
    if (!silent) log(`${getChar(inst.assigneeId)?.short}接任务「${t.name}」`);
    bumpQuestUi();
  }

  function completeQuest(inst, reason) {
    const t = tpl(inst.templateId);
    inst.status = QUEST_STATUS.COMPLETED;
    applyEffects(t?.rewards, inst);
    setCooldown(inst.templateId, inst.assigneeId, t);
    history.unshift({ ...inst, finishedTime: getGameTimestamp() });
    if (history.length > 30) history.pop();
    EventBus.emit('quest:completed', { instanceId: inst.instanceId, templateId: inst.templateId, assigneeId: inst.assigneeId });
    const assignee = getChar(inst.assigneeId);
    if (assignee?.lifePath && LifePathSystem?.questMatchesPath?.(inst.templateId, assignee)) {
      LifePathSystem.applyReputationDelta(assignee, 'pathTask');
    }
    LifePathSystem?.onQuestComplete?.(inst.templateId, inst.assigneeId);
    showQuestBubble(inst.assigneeId, fillText(t?.texts?.complete, inst));
    log(`${getChar(inst.assigneeId)?.short}完成「${t?.name}」${reason ? '（' + reason + '）' : ''}`);
    instances = instances.filter(q => q.instanceId !== inst.instanceId);
    bumpQuestUi();
  }

  function failQuest(inst, reason) {
    const t = tpl(inst.templateId);
    inst.status = QUEST_STATUS.FAILED;
    applyEffects(t?.penalties, inst);
    setCooldown(inst.templateId, inst.assigneeId, t);
    history.unshift({ ...inst, finishedTime: getGameTimestamp(), failReason: reason });
    if (history.length > 30) history.pop();
    EventBus.emit('quest:failed', { instanceId: inst.instanceId, templateId: inst.templateId, assigneeId: inst.assigneeId, reason });
    showQuestBubble(inst.assigneeId, fillText(t?.texts?.fail, inst) || `任务失败：${t?.name}`);
    log(`${getChar(inst.assigneeId)?.short}未能完成「${t?.name}」：${reason || '失败'}`);
    instances = instances.filter(q => q.instanceId !== inst.instanceId);
    bumpQuestUi();
  }

  function declineQuest(inst) {
    const t = tpl(inst.templateId);
    inst.status = QUEST_STATUS.DECLINED;
    applyEffects(t?.declinePenalties, inst);
    setCooldown(inst.templateId, inst.assigneeId, t);
    EventBus.emit('quest:declined', { instanceId: inst.instanceId, templateId: inst.templateId, assigneeId: inst.assigneeId });
    showQuestBubble(inst.issuerId || inst.assigneeId, fillText(t?.texts?.decline, inst) || '罢了。');
    log(`${getChar(inst.assigneeId)?.short}婉拒「${t?.name}」`);
    instances = instances.filter(q => q.instanceId !== inst.instanceId);
    bumpQuestUi();
  }

  function revokeQuest(inst) {
    if (!inst || inst.status !== QUEST_STATUS.PENDING) return false;
    const t = tpl(inst.templateId);
    EventBus.emit('quest:revoked', {
      instanceId: inst.instanceId, templateId: inst.templateId,
      assigneeId: inst.assigneeId, issuerId: inst.issuerId,
    });
    log(`${getChar(inst.issuerId)?.short || '某人'}收回对${getChar(inst.assigneeId)?.short}的「${t?.name || '差遣'}」`);
    instances = instances.filter(q => q.instanceId !== inst.instanceId);
    bumpQuestUi();
    return true;
  }

  function issueQuest(templateId, issuerId, assigneeId, dailySlotId, batchId) {
    const t = tpl(templateId);
    if (!t || !canAssignTemplate(t, issuerId, assigneeId)) return null;
    const inst = createInstance(templateId, issuerId, assigneeId, dailySlotId, batchId);
    instances.push(inst);
    EventBus.emit('quest:issued', {
      instanceId: inst.instanceId, templateId, assigneeId, issuerId, batchId: inst.batchId || 0,
    });
    if (t.autoAccept || t.questType === 'daily') {
      acceptQuest(inst, true);
    } else if (assigneeId === CHARS[selectedIdx]?.id) {
      log(`${getChar(issuerId)?.short}向你下发「${t.name}」，请在任务面板回应。`);
    } else {
      const rel = issuerId ? getRelationValue(issuerId, assigneeId) : 50;
      if (Math.random() < 0.65 + rel / 200) acceptQuest(inst, true);
      else declineQuest(inst);
    }
    if (inst.status === QUEST_STATUS.PENDING) bumpQuestUi();
    return inst;
  }

  function issueBatch(templateId, issuerId, assigneeIds) {
    const t = tpl(templateId);
    if (!t || !assigneeIds?.length) return { batchId: 0, count: 0, instances: [] };
    const batchId = nextBatchId++;
    const created = [];
    for (const aid of assigneeIds) {
      const inst = issueQuest(templateId, issuerId, aid, 0, batchId);
      if (inst) created.push(inst);
    }
    if (created.length) {
      EventBus.emit('quest:batch_issued', {
        batchId, templateId, issuerId, count: created.length, assigneeIds: created.map(i => i.assigneeId),
      });
    }
    return { batchId, count: created.length, instances: created };
  }

  function getBatchInstances(batchId) {
    return instances.filter(q => q.batchId === batchId);
  }

  function getBatchesForIssuer(issuerId) {
    const byBatch = new Map();
    for (const inst of instances.filter(q => q.issuerId === issuerId && q.batchId > 0)) {
      if (!byBatch.has(inst.batchId)) byBatch.set(inst.batchId, []);
      byBatch.get(inst.batchId).push(inst);
    }
    return [...byBatch.entries()].map(([batchId, list]) => {
      const t = tpl(list[0]?.templateId);
      const done = list.filter(q => q.status === QUEST_STATUS.COMPLETED).length;
      const active = list.filter(q => [QUEST_STATUS.PENDING, QUEST_STATUS.ACCEPTED].includes(q.status));
      const pending = list.filter(q => q.status === QUEST_STATUS.PENDING);
      const accepted = list.filter(q => q.status === QUEST_STATUS.ACCEPTED);
      let progSum = 0;
      for (const q of accepted) progSum += questProgressPctFor(q);
      const progPct = accepted.length ? Math.round(progSum / accepted.length) : 0;
      return {
        batchId, templateId: list[0]?.templateId, name: t?.name || '群体任务',
        category: t?.category, total: list.length, done, active: active.length,
        pending: pending.length, progressPct: progPct, instances: list,
      };
    }).filter(b => b.instances.some(q => [QUEST_STATUS.PENDING, QUEST_STATUS.ACCEPTED].includes(q.status)));
  }

  function questProgressPctFor(inst) {
    const t = tpl(inst.templateId);
    const conds = t?.completeConditions || [];
    if (!conds.length) return inst.status === QUEST_STATUS.PENDING ? 0 : 50;
    let sum = 0;
    for (const cond of conds) {
      const cur = inst.progress?.[cond.id] || 0;
      sum += Math.min(100, (cur / Math.max(1, cond.targetValue)) * 100);
    }
    return sum / conds.length;
  }

  function revokeBatch(batchId) {
    const list = getBatchInstances(batchId).filter(q => q.status === QUEST_STATUS.PENDING);
    if (!list.length) return 0;
    for (const inst of list) revokeQuest(inst);
    return list.length;
  }

  function furnitureCategoryMatch(c, target) {
    if (!c?.action || c.action.type !== 'furniture' || c.action.phase !== 'use') return false;
    const cat = c.action.tpl?.category;
    if (target === 'desk') return cat === 'desk' || cat === 'workdesk';
    if (target === 'workdesk') return cat === 'workdesk';
    if (target === 'bed') return cat === 'bed';
    return cat === target;
  }

  function sameScene(a, b) {
    const ca = getChar(a), cb = getChar(b);
    return ca && cb && ca.sceneId === cb.sceneId;
  }

  function updateConditionProgress(inst, cond, delta) {
    const cur = inst.progress[cond.id] || 0;
    const nv = Math.min(cond.targetValue, cur + delta);
    if (nv !== cur) {
      inst.progress[cond.id] = nv;
      EventBus.emit('quest:progress', { instanceId: inst.instanceId, conditionId: cond.id, progress: nv, target: cond.targetValue });
    }
  }

  function checkFailConditions(inst, t) {
    const assignee = getChar(inst.assigneeId);
    if (!assignee) return false;
    for (const fc of t.failConditions || []) {
      if (fc.type === 'AVOID_SCENE') {
        const sid = resolveSceneId(fc.target, inst);
        if (sid && assignee.sceneId === sid) {
          failQuest(inst, fc.description || '进入禁地');
          return true;
        }
      }
      if (fc.type === 'AVOID_CHARACTER') {
        const tid = resolveTargetCharId(fc.target, inst);
        if (tid && sameScene(inst.assigneeId, tid)) {
          failQuest(inst, fc.description || '违规接触');
          return true;
        }
      }
      if (fc.type === 'ENTER_SCENE') {
        const sid = resolveSceneId(fc.target, inst);
        if (sid && assignee.sceneId === sid) {
          failQuest(inst, fc.description || '擅离禁所');
          return true;
        }
      }
    }
    return false;
  }

  function tickMinute() {
    if (!enabled || !st().masterEnabled) return;
    const now = getGameTimestamp();
    const active = instances.filter(q => q.status === QUEST_STATUS.ACCEPTED);
    for (const inst of active) {
      const t = tpl(inst.templateId);
      if (!t) continue;
      if (inst.deadlineTime > 0 && now > inst.deadlineTime) {
        failQuest(inst, '超时');
        continue;
      }
      if (checkFailConditions(inst, t)) continue;
      const assignee = getChar(inst.assigneeId);
      if (!assignee) continue;
      for (const cond of t.completeConditions || []) {
        if (cond.type === 'USE_FURNITURE_DURATION' && furnitureCategoryMatch(assignee, cond.target))
          updateConditionProgress(inst, cond, 1);
        if (cond.type === 'STAY_IN_SCENE') {
          const sid = resolveSceneId(cond.target, inst);
          if (sid && assignee.sceneId === sid) updateConditionProgress(inst, cond, 1);
        }
        if (cond.type === 'FOLLOW_CHARACTER') {
          const tid = resolveTargetCharId(cond.target, inst);
          if (tid && sameScene(inst.assigneeId, tid)) updateConditionProgress(inst, cond, 1);
        }
        if (cond.type === 'INTERACT_WITH_DURATION') {
          const key = inst.instanceId + '|' + cond.id;
          if (interactionTrack[key]) updateConditionProgress(inst, cond, 1);
        }
      }
      const allDone = (t.completeConditions || []).every(c => (inst.progress[c.id] || 0) >= c.targetValue);
      if (allDone) completeQuest(inst);
    }
    instances.filter(q => q.status === QUEST_STATUS.PENDING).forEach(inst => {
      if (now - inst.issuedTime > (st().pendingExpireGameMin || 180)) {
        inst.status = QUEST_STATUS.EXPIRED;
        EventBus.emit('quest:expired', { instanceId: inst.instanceId });
        instances = instances.filter(q => q.instanceId !== inst.instanceId);
      }
    });
  }

  function onInteractionComplete(evt) {
    if (!enabled) return;
    for (const inst of instances.filter(q => q.status === QUEST_STATUS.ACCEPTED)) {
      const t = tpl(inst.templateId);
      if (!t) continue;
      const a = evt.initiatorId, b = evt.targetId;
      for (const cond of t.completeConditions || []) {
        if (cond.type !== 'INTERACT_WITH') continue;
        const tid = resolveTargetCharId(cond.target, inst);
        const ok = (a === inst.assigneeId && b === tid) || (b === inst.assigneeId && a === tid);
        if (ok) updateConditionProgress(inst, cond, 1);
      }
      const allDone = (t.completeConditions || []).every(c => (inst.progress[c.id] || 0) >= c.targetValue);
      if (allDone) completeQuest(inst);
    }
  }

  function onFurnitureComplete(evt) {
    if (!enabled) return;
    for (const inst of instances.filter(q => q.status === QUEST_STATUS.ACCEPTED)) {
      const t = tpl(inst.templateId);
      if (!t) continue;
      for (const cond of t.completeConditions || []) {
        if (cond.type !== 'USE_FURNITURE') continue;
        const cat = evt.category;
        if (cond.target === cat || (cond.target === 'desk' && (cat === 'desk' || cat === 'workdesk'))) updateConditionProgress(inst, cond, 1);
      }
      const allDone = (t.completeConditions || []).every(c => (inst.progress[c.id] || 0) >= c.targetValue);
      if (allDone) completeQuest(inst);
    }
  }

  function trackInteractions() {
    interactionTrack = {};
    for (const inst of instances.filter(q => q.status === QUEST_STATUS.ACCEPTED)) {
      const assignee = getChar(inst.assigneeId);
      if (!assignee?.action) continue;
      const act = assignee.action;
      if (act.type === 'interaction' || act.type === 'talk') {
        const other = act.target?.id;
        if (!other) continue;
        for (const cond of tpl(inst.templateId)?.completeConditions || []) {
          if (cond.type !== 'INTERACT_WITH_DURATION') continue;
          const tid = resolveTargetCharId(cond.target, inst);
          if (other === tid || (act.target && act.target.id === tid))
            interactionTrack[inst.instanceId + '|' + cond.id] = true;
        }
      }
    }
  }

  function onHour(evt) {
    if (!enabled || !st().masterEnabled) return;
    for (const slot of st().dailyRoutines || []) {
      if (slot.triggerHour !== evt.hour) continue;
      const c = getChar(slot.charId);
      if (!c) continue;
      issueQuest(slot.templateId, null, slot.charId, slot.slotId);
    }
  }

  function tryAiIssue() {
    if (!enabled || !st().masterEnabled) return;
    const templates = Object.values(st().templates || {}).filter(t => t.questType === 'directive' && t.issueBaseChance && t.targetScope !== 'group');
    for (const issuer of CHARS) {
      if (!isAIControlled(issuer)) continue;
      for (const assignee of CHARS) {
        if (assignee.id === issuer.id) continue;
        const pool = typeof QuestIssueSystem !== 'undefined'
          ? QuestIssueSystem.filterAiCandidates(issuer.id, assignee.id, templates)
          : templates.filter(t => canAssignTemplate(t, issuer.id, assignee.id));
        for (const t of pool) {
          if (Math.random() > (t.issueBaseChance || 0.1)) continue;
          issueQuest(t.id, issuer.id, assignee.id);
          return;
        }
      }
    }
  }

  function tryAiGroupIssue() {
    if (!enabled || !st().masterEnabled || typeof QuestIssueSystem === 'undefined') return;
    for (const issuer of CHARS) {
      if (!isAIControlled(issuer)) continue;
      if (!QuestIssueSystem.canIssueGroupAny(issuer)) continue;
      for (const item of QuestIssueSystem.filterAiGroupCandidates(issuer)) {
        const t = item.tpl;
        if (QuestIssueSystem.isGroupOnCooldown(issuer.id, t.id)) continue;
        if (Math.random() > (t.groupIssueBaseChance || 0.04)) continue;
        const batch = QuestIssueSystem.issueGroupTo(issuer, t.id, true);
        if (batch?.count > 0) return;
      }
    }
  }

  function onTick(evt) {
    trackInteractions();
    for (let i = 0; i < (evt.minutes || 1); i++) tickMinute();
    issueAcc += evt.minutes || 1;
    groupIssueAcc += evt.minutes || 1;
    if (issueAcc >= (st().aiIssueIntervalGameMin || 60)) {
      issueAcc = 0;
      tryAiIssue();
    }
    const grpInt = (st().groupQuestCooldownGameMin || 1440) * 2;
    if (groupIssueAcc >= grpInt) {
      groupIssueAcc = 0;
      tryAiGroupIssue();
    }
  }

  function getActiveForChar(charId) {
    return instances.filter(q => q.assigneeId === charId && (q.status === QUEST_STATUS.ACCEPTED || q.status === QUEST_STATUS.PENDING));
  }

  function getAcceptedFor(charId) {
    return instances.filter(q => q.assigneeId === charId && q.status === QUEST_STATUS.ACCEPTED);
  }

  function getQuestWeightBoost(c, cand) {
    if (!enabled || !st().masterEnabled) return 1;
    let boost = 1;
    const boostVal = st().questWeightBoost || 3;
    for (const inst of instances.filter(q => q.status === QUEST_STATUS.ACCEPTED && q.assigneeId === c.id)) {
      const t = tpl(inst.templateId);
      if (!t) continue;
      const urgent = inst.deadlineTime > 0 && inst.deadlineTime - getGameTimestamp() < 120;
      const mul = urgent ? boostVal * 1.3 : boostVal;
      for (const cond of t.completeConditions || []) {
        if (cond.type === 'USE_FURNITURE_DURATION' && cand.kind === 'furniture') {
          const cat = getTemplate(getInstance(cand.instanceId)?.templateId)?.category;
          if (cond.target === cat || (cond.target === 'desk' && cat === 'desk')) boost = Math.max(boost, mul);
        }
        if (cond.type === 'FOLLOW_CHARACTER' && cand.kind === 'interaction') {
          const tid = resolveTargetCharId(cond.target, inst);
          if (cand.targetCharId === tid) boost = Math.max(boost, mul);
        }
        if (cond.type === 'INTERACT_WITH' && cand.kind === 'interaction' && cand.targetCharId === resolveTargetCharId(cond.target, inst))
          boost = Math.max(boost, mul);
      }
    }
    return boost;
  }

  function formatDeadline(inst) {
    if (!inst.deadlineTime) return '无期限';
    const left = inst.deadlineTime - getGameTimestamp();
    if (left <= 0) return '已截止';
    if (left >= 1440) return `剩余${Math.ceil(left / 1440)}天`;
    if (left >= 60) return `剩余${Math.ceil(left / 60)}小时`;
    return `剩余${Math.ceil(left)}分`;
  }

  function formatCondLine(inst, cond) {
    const cur = Math.floor(inst.progress[cond.id] || 0);
    const tgt = cond.targetValue;
    let desc = (cond.description || cond.type).replace('{current}', cur).replace('{target}', tgt);
    desc = desc.replace('{issuer}', getChar(inst.issuerId)?.short || '');
    return desc + (cur >= tgt ? ' ✓' : ` (${cur}/${tgt})`);
  }

  function buildQuestPanel() {
    const c = CHARS[selectedIdx];
    const mine = instances.filter(q => q.assigneeId === c.id);
    const pending = mine.filter(q => q.status === QUEST_STATUS.PENDING);
    const active = mine.filter(q => q.status === QUEST_STATUS.ACCEPTED);
    const issued = instances.filter(q => q.issuerId === c.id && [QUEST_STATUS.PENDING, QUEST_STATUS.ACCEPTED].includes(q.status) && !q.batchId);
    const batches = getBatchesForIssuer(c.id);
    const famMembers = FamilySystem.getCurrentMemberIds();
    const familyDaily = instances.filter(q => q.status === QUEST_STATUS.ACCEPTED && famMembers.includes(q.assigneeId) && tpl(q.templateId)?.questType === 'daily' && q.assigneeId !== c.id);
    const renderCard = (inst, opts) => {
      const t = tpl(inst.templateId);
      if (!t) return '';
      const issuer = inst.issuerId ? getChar(inst.issuerId)?.short : '日常';
      const conds = (t.completeConditions || []).map(cond => {
        const cur = inst.progress[cond.id] || 0;
        const pct = Math.min(100, (cur / cond.targetValue) * 100);
        return `<div class="quest-cond">${formatCondLine(inst, cond)}</div>
          <div class="quest-prog"><div class="quest-prog-fill" style="width:${pct}%"></div></div>`;
      }).join('');
      const pendingBtns = inst.status === QUEST_STATUS.PENDING && inst.assigneeId === c.id ? `
        <div class="quest-actions">
          <button class="sys-btn primary" data-qaccept="${inst.instanceId}">接受</button>
          <button class="sys-btn" data-qdecline="${inst.instanceId}">拒绝</button>
        </div>` : '';
      const revokeBtn = inst.status === QUEST_STATUS.PENDING && inst.issuerId === c.id ? `
        <div class="quest-actions">
          <button class="sys-btn" data-qrevoke="${inst.instanceId}">收回差遣</button>
        </div>` : '';
      const assignee = getChar(inst.assigneeId)?.short || '—';
      const metaExtra = opts === 'issued' ? `差遣${assignee}`
        : opts === 'story' ? `${assignee}的故事线`
        : `${issuer}下发`;
      return `<div class="quest-card ${opts || ''}">
        <div class="quest-title">${inst.status === QUEST_STATUS.PENDING ? '⚠ ' : '◉ '}${t.name}</div>
        <div class="quest-meta">${metaExtra} · ${formatDeadline(inst)} · ${t.category}</div>
        ${conds}${pendingBtns}${revokeBtn}
      </div>`;
    };

    const histRows = history.slice(0, 8).map(h => {
      const t = tpl(h.templateId);
      const icon = h.status === QUEST_STATUS.COMPLETED ? '✓' : '✕';
      return `<div class="quest-card done">${icon} ${t?.name || h.templateId} (${getChar(h.assigneeId)?.short})</div>`;
    }).join('');

    const batchCards = batches.map(b => {
      const revoke = b.pending > 0
        ? `<div class="quest-actions"><button class="sys-btn" data-qrevoke-batch="${b.batchId}">收回未接传令(${b.pending})</button></div>`
        : '';
      return `<div class="quest-card pending">
        <div class="quest-title">📋 ${escapeHtml(b.name)}（传令）</div>
        <div class="quest-meta">${b.done}/${b.total}人完成 · 进行中${b.active - b.pending} · 待接${b.pending} · ${b.category || ''}</div>
        <div class="quest-prog"><div class="quest-prog-fill" style="width:${b.progressPct}%"></div></div>
        <div class="quest-cond">整体进度约 ${b.progressPct}%</div>
        ${revoke}
      </div>`;
    }).join('');

    return `<h3>${c.name} · 任务</h3>
      ${pending.length ? `<div class="quest-section"><h4>待回应</h4>${pending.map(i => renderCard(i, 'pending')).join('')}</div>` : ''}
      ${active.length ? `<div class="quest-section"><h4>进行中</h4>${active.map(i => renderCard(i)).join('')}</div>` : ''}
      ${batches.length ? `<div class="quest-section"><h4>群体传令</h4>${batchCards}</div>` : ''}
      ${issued.length ? `<div class="quest-section"><h4>我下发的</h4>${issued.map(i => renderCard(i, 'issued')).join('')}</div>` : ''}
      ${familyDaily.length ? `<div class="quest-section"><h4>家人日常</h4>${familyDaily.map(i => renderCard(i)).join('')}</div>` : ''}
      ${histRows ? `<div class="quest-section"><h4>近期记录</h4>${histRows}</div>` : ''}
      ${!pending.length && !active.length && !issued.length && !batches.length && !histRows ? '<p style="color:#8a7355">暂无任务。故事线任务会在路径角色满足条件时自动下发；日常在对应时辰派发。</p>' : ''}
      <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
  }

  function openQuestPanel() {
    openPanel(buildQuestPanel());
    document.querySelectorAll('[data-qaccept]').forEach(btn => btn.onclick = () => {
      const inst = instances.find(q => q.instanceId === +btn.dataset.qaccept);
      if (inst) { acceptQuest(inst); openQuestPanel(); }
    });
    document.querySelectorAll('[data-qdecline]').forEach(btn => btn.onclick = () => {
      const inst = instances.find(q => q.instanceId === +btn.dataset.qdecline);
      if (inst) { declineQuest(inst); openQuestPanel(); }
    });
    document.querySelectorAll('[data-qrevoke]').forEach(btn => btn.onclick = () => {
      const inst = instances.find(q => q.instanceId === +btn.dataset.qrevoke);
      if (inst) { revokeQuest(inst); openQuestPanel(); }
    });
    document.querySelectorAll('[data-qrevoke-batch]').forEach(btn => btn.onclick = () => {
      const n = revokeBatch(+btn.dataset.qrevokeBatch);
      if (n) log(`已收回传令中 ${n} 条待回应差遣。`);
      openQuestPanel();
    });
  }

  function updateBadge() {
    const el = document.getElementById('quest-badge');
    if (!el) return;
    const c = CHARS[selectedIdx];
    const n = instances.filter(q => q.assigneeId === c?.id && (q.status === QUEST_STATUS.PENDING || q.status === QUEST_STATUS.ACCEPTED)).length;
    el.textContent = n;
    el.style.display = n > 0 ? 'inline-block' : 'none';
  }

  function serialize() {
    return { instances, history, nextId, nextBatchId, cooldowns, issueAcc, groupIssueAcc };
  }

  function apply(state) {
    instances = state?.instances || [];
    history = state?.history || [];
    nextId = state?.nextId || 1;
    nextBatchId = state?.nextBatchId || 1;
    cooldowns = state?.cooldowns || {};
    issueAcc = state?.issueAcc || 0;
    groupIssueAcc = state?.groupIssueAcc || 0;
  }

  function init() {
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    if (!st().masterEnabled) { enabled = false; return; }
    enabled = true;
    unsubs.push(EventBus.on('time:tick', onTick));
    unsubs.push(EventBus.on('time:hour', onHour));
    unsubs.push(EventBus.on('interaction:complete', onInteractionComplete));
    unsubs.push(EventBus.on('furniture:complete', onFurnitureComplete));
  }

  return {
    init, openQuestPanel, updateBadge, getQuestWeightBoost, getActiveForChar, getAcceptedFor,
    tpl, resolveSceneId, resolveTargetCharId,
    acceptQuest: id => { const q = instances.find(x => x.instanceId === id); if (q) acceptQuest(q); },
    declineQuest: id => { const q = instances.find(x => x.instanceId === id); if (q) declineQuest(q); },
    revokeQuest: id => { const q = instances.find(x => x.instanceId === id); if (q) revokeQuest(q); },
    revokeBatch, getBatchesForIssuer, getBatchInstances,
    canIssue, issueOne: issueQuest, issueBatch,
    debugIssue: (templateId, issuerId, assigneeId) => issueQuest(templateId, issuerId, assigneeId),
    serialize, apply, getInstances: () => instances.slice(),
  };
})();
window.QuestSystem = QuestSystem;

function serializeGameState() {
  return {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    gameHour, gameMinute, gameDay, gamePeriod,
    selectedIdx, actionIdSeq, queuePage,
    logs: logs.slice(0, 200),
    gameLogs: gameLogs.slice(0, 200),
    relations: serializeRelations(),
    interactionCooldowns,
    interactionOnceUsed: [...interactionOnceUsed],
    chars: CHARS.map(c => ({
      id: c.id, sceneId: c.sceneId, gridCol: c.gridCol, gridRow: c.gridRow,
      x: c.x, y: c.y, needs: { ...c.needs }, statusText: c.statusText,
      activeStates: c.activeStates.map(s => ({ ...s })),
      tempNeedMods: c.tempNeedMods.map(t => ({ ...t })),
      actionQueue: c.actionQueue.map(q => ({ ...q })),
      memories: c.memories.slice(),
      skillLevels: { ...c.skillLevels },
      lifePath: c.lifePath ?? null,
      currentStage: c.currentStage ?? null,
      reputation: c.reputation ?? 0,
      professionHistory: (c.professionHistory || []).slice(),
      _baseSocialRank: c._baseSocialRank,
      ...(MoneySystem?.serializeChar?.(c) || {}),
      usingInstanceId: c.usingInstanceId || 0,
      ai: c.ai ? {
        state: c.ai.state, urgentNeed: c.ai.urgentNeed,
        cooldownUntil: c.ai.cooldownUntil,
        socialCooldowns: { ...c.ai.socialCooldowns },
        currentWeight: c.ai.cache?.currentWeight || 0,
      } : undefined,
    })),
    furnRt: Object.fromEntries(Object.entries(FURN_RT).map(([id, rt]) =>
      [id, { remaining: rt.remaining, users: rt.users.slice() }])),
    familyState: FamilySystem.serialize(),
    questState: QuestSystem.serialize(),
    questIssueState: QuestIssueSystem?.serialize?.() || {},
    sceneAccessState: SceneAccessSystem.serialize(),
  };
}

function saveGameToStorage(silent = false) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeGameState()));
    if (!silent) log('进度已存档。');
    EventBus.emit('save:done', { silent });
    return true;
  } catch (e) {
    log('存档失败：' + e.message);
    return false;
  }
}

function applyGameState(data) {
  if (!data || (data.version !== 1 && data.version !== 2)) return false;
  gameHour = data.gameHour ?? 8;
  gameMinute = data.gameMinute ?? 0;
  gameDay = data.gameDay ?? 1;
  gamePeriod = data.gamePeriod ?? getTimePeriod().id;
  selectedIdx = Math.min(data.selectedIdx ?? 0, CHARS.length - 1);
  actionIdSeq = data.actionIdSeq ?? 1;
  queuePage = data.queuePage ?? 0;
  logs = data.logs ?? [];
  gameLogs = data.gameLogs ?? [];
  if (!gameLogs.length && logs.length) migrateLogsToGameLogs(logs);
  deserializeRelations(data.relations ?? {});
  interactionCooldowns = data.interactionCooldowns ?? {};
  interactionOnceUsed = new Set(data.interactionOnceUsed ?? []);
  for (const snap of data.chars || []) {
    const c = CHARS.find(x => x.id === snap.id);
    if (!c) continue;
    Object.assign(c, {
      sceneId: snap.sceneId, gridCol: snap.gridCol, gridRow: snap.gridRow,
      x: snap.x, y: snap.y, needs: { ...snap.needs },
      statusText: snap.statusText || '闲庭漫步',
      activeStates: snap.activeStates || [],
      tempNeedMods: snap.tempNeedMods || [],
      actionQueue: snap.actionQueue || [],
      memories: snap.memories || [],
      skillLevels: snap.skillLevels || c.skillLevels,
      lifePath: snap.lifePath ?? null,
      currentStage: snap.currentStage ?? null,
      reputation: snap.reputation ?? 0,
      professionHistory: snap.professionHistory || [],
      _baseSocialRank: snap._baseSocialRank ?? c._baseSocialRank,
      usingInstanceId: snap.usingInstanceId || 0,
      action: null, path: [],
    });
    MoneySystem?.applyChar?.(c, snap);
    if (snap.ai) {
      initCharAI(c);
      Object.assign(c.ai, {
        state: snap.ai.state || AI_STATE.IDLE,
        urgentNeed: snap.ai.urgentNeed || null,
        cooldownUntil: snap.ai.cooldownUntil || 0,
        socialCooldowns: snap.ai.socialCooldowns || {},
      });
      c.ai.cache.currentWeight = snap.ai.currentWeight || 0;
      c.ai.cache.dirty = true;
    }
    c._prevNeeds = { ...c.needs };
  }
  for (const [id, rt] of Object.entries(data.furnRt || {})) {
    if (FURN_RT[id]) {
      FURN_RT[id].remaining = rt.remaining;
      FURN_RT[id].users = rt.users || [];
      FURN_RT[id].slots = {};
    }
  }
  FamilySystem.apply(data.familyState);
  QuestSystem.apply(data.questState);
  QuestIssueSystem?.apply?.(data.questIssueState);
  SceneAccessSystem.apply(data.sceneAccessState);
  LifePathSystem?.apply?.(data.lifePathState || data.chars?.map(s => ({
    id: s.id, lifePath: s.lifePath, currentStage: s.currentStage,
    reputation: s.reputation, professionHistory: s.professionHistory, _baseSocialRank: s._baseSocialRank,
  })));
  renderLogSidebar();
  initGridBucket();
  if (typeof separateOverlappingChars === 'function') separateOverlappingChars();
  if (SceneAccessSystem?.repairAllCharacterScenes) SceneAccessSystem.repairAllCharacterScenes();
  updateCamera(true);
  buildUI();
  EventBus.emit('save:loaded', {});
  return true;
}

function loadGameFromStorage() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (!s) return false;
    return applyGameState(JSON.parse(s));
  } catch (e) {
    console.warn('load save failed', e);
    return false;
  }
}

function clearGameSave() {
  localStorage.removeItem(SAVE_KEY);
  log('存档已清除。');
}

