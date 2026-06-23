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
  let dailyIssued = {};
  let candidateTelemetry = {};
  let questPanelFilter = 'mine';
  let followRuntime = {};

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
    if (target === 'issuer_residence') {
      const fam = FamilySystem.findFamilyOfChar(inst.issuerId);
      return fam?.residenceSceneId ?? getChar(inst.issuerId)?.sceneId;
    }
    if (target === 'issuer') return getChar(inst.issuerId)?.sceneId ?? null;
    if (target === 'assignee') return getChar(inst.assigneeId)?.sceneId ?? null;
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

  function hierarchyRelation(issuerId, assigneeId) {
    if (!issuerId || !assigneeId || typeof IdentityProtocolSystem === 'undefined') return '';
    return IdentityProtocolSystem.getHierarchyRelation?.(issuerId, assigneeId) || '';
  }

  function relationSnapshot(issuerId, assigneeId) {
    if (!issuerId || !assigneeId) return {};
    const snap = { relation: getRelationValue(issuerId, assigneeId) };
    if (typeof getRelationAxis === 'function') {
      snap.affection = getRelationAxis(issuerId, assigneeId, 'affection');
      snap.trust = getRelationAxis(issuerId, assigneeId, 'trust');
      snap.friendship = getRelationAxis(issuerId, assigneeId, 'friendship');
      snap.submission = getRelationAxis(assigneeId, issuerId, 'submission');
    }
    if (typeof ServantRelationSystem !== 'undefined') {
      const ctx = ServantRelationSystem.acceptanceContext?.(issuerId, assigneeId, null);
      if (ctx?.contract) {
        snap.servantContractId = ctx.contract.id;
        snap.servantRole = ctx.contract.role;
        snap.servantScope = ctx.contract.scope;
        snap.servantAuthorityLevel = ctx.authorityLevel;
      }
      snap.servantLoad = ctx?.load;
    }
    return snap;
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
    if (t.questType === 'daily' && issuerId) {
      const servantGate = typeof ServantRelationSystem !== 'undefined'
        ? ServantRelationSystem.checkQuestAuthority?.(issuerId, assigneeId, t)
        : null;
      if (!servantGate?.ok) return false;
    }
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

  function sceneReachableForQuest(assignee, sceneId) {
    if (!assignee || !sceneId) return true;
    const check = SceneAccessSystem?.canEnterScene?.(assignee, sceneId);
    return check === true || check?.ok === true;
  }

  function furnitureConditionExecutable(assignee, cond) {
    const accessible = SceneAccessSystem?.getAccessibleSceneIds
      ? new Set(SceneAccessSystem.getAccessibleSceneIds(assignee))
      : null;
    for (const inst of CONFIG.furnitureInstances || []) {
      if (accessible && !accessible.has(inst.sceneId)) continue;
      const ft = getTemplate(inst.templateId);
      if (!ft || !furnitureTargetMatch(ft.category, cond.target)) continue;
      if (canUseFurniture(assignee, inst, null) === true) return true;
      for (const action of getFurnitureActions(ft)) {
        if (canUseFurniture(assignee, inst, action) === true) return true;
      }
    }
    return false;
  }

  function isTemplateExecutableBy(t, issuerId, assigneeId, opts = {}) {
    const assignee = getChar(assigneeId);
    if (!t || !assignee) return false;
    if (opts.aiIssue) {
      if (getActiveForChar(assigneeId).length >= (t.maxActiveForAiAssignee ?? 2)) return false;
      if (assignee.action || assignee.actionQueue?.length) return false;
      if (typeof canUseSkill === 'function' && !canUseSkill(assignee, 'move')) return false;
      const needs = assignee.needs || {};
      if ((needs.energy ?? 100) < 15 || (needs.hunger ?? 100) < 15 || (needs.mood ?? 100) < 10) return false;
    }
    const instLike = { templateId: t.id, issuerId, assigneeId };
    for (const cond of t.completeConditions || []) {
      if (cond.type === 'FOLLOW_CHARACTER' || cond.type === 'INTERACT_WITH' || cond.type === 'INTERACT_WITH_DURATION') {
        const target = getChar(resolveTargetCharId(cond.target, instLike));
        if (!target || !sceneReachableForQuest(assignee, target.sceneId)) return false;
      }
      if (cond.type === 'STAY_IN_SCENE') {
        const sceneId = resolveSceneId(cond.target, instLike);
        if (sceneId && !sceneReachableForQuest(assignee, sceneId)) return false;
      }
      if (cond.type === 'USE_FURNITURE' || cond.type === 'USE_FURNITURE_DURATION') {
        if (!furnitureConditionExecutable(assignee, cond)) return false;
      }
    }
    return true;
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
      blockedReason: '', recommendedAction: '', _activeReason: '',
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
        if (a && b) CharacterEffectSystem.apply({
          type: 'relation', idA: a, idB: b, delta: ef.delta || 0,
        }, {
          source: `quest:${inst.templateId}`,
          reason: tpl(inst.templateId)?.name || '任务效果',
        });
      } else if (ef.type === 'state') {
        const charId = resolveTargetCharId(ef.target || 'assignee', inst);
        if (charId && ef.stateId) CharacterEffectSystem.apply({
          type: 'state', charId, stateId: ef.stateId,
        }, {
          source: `quest:${inst.templateId}`,
          reason: tpl(inst.templateId)?.name || '任务效果',
        });
      } else if (ef.type === 'skillXp') {
        const charId = resolveTargetCharId(ef.target || 'assignee', inst);
        if (charId && ef.skill) CharacterEffectSystem.apply({
          type: 'skillXp', charId, skill: ef.skill, delta: ef.delta || 1,
        }, {
          source: `quest:${inst.templateId}`,
          reason: tpl(inst.templateId)?.name || '任务效果',
        });
      } else if (ef.type === 'need') {
        const charId = resolveTargetCharId(ef.target || 'assignee', inst);
        if (charId && ef.key) CharacterEffectSystem.apply({
          type: 'need', charId, key: ef.key, delta: ef.delta || 0,
        }, {
          source: `quest:${inst.templateId}`,
          reason: tpl(inst.templateId)?.name || '任务效果',
        });
      }
    }
  }

  function primeAcceptedQuestAction(inst, t) {
    if (!t?.interruptOnAccept) return;
    const assignee = getChar(inst.assigneeId);
    if (!assignee?.ai || assignee.ai.completingPlayerQueue) return;
    const cond = (t.completeConditions || []).find(c => c.type === 'FOLLOW_CHARACTER');
    if (!cond) return;
    const target = getChar(resolveTargetCharId(cond.target, inst));
    const near = nearestWalkableAroundChar(assignee, target);
    if (!target || !near || typeof makeMoveItem !== 'function' || typeof enqueueAction !== 'function') return;
    if (typeof cancelAction === 'function') cancelAction(assignee);
    assignee.actionQueue = [];
    const item = makeMoveItem(near.col, near.row);
    item.aiGenerated = true;
    item.questInstanceId = inst.instanceId;
    item.priority = 80;
    enqueueAction(assignee, item, true);
    assignee.statusText = `去找${target.short || '目标'}·${t.name}`;
    assignee.ai.cache.dirty = true;
    EventBus.emit('quest:primed_action', {
      instanceId: inst.instanceId, templateId: inst.templateId,
      assigneeId: inst.assigneeId, issuerId: inst.issuerId,
      targetId: target.id, gridCol: near.col, gridRow: near.row,
    });
  }

  function acceptQuest(inst, silent) {
    const t = tpl(inst.templateId);
    if (!t) return;
    inst.status = QUEST_STATUS.ACCEPTED;
    inst.acceptedTime = getGameTimestamp();
    inst.deadlineTime = calcDeadline(t, inst.acceptedTime);
    inst.progress = {};
    (t.completeConditions || []).forEach(c => { inst.progress[c.id] = 0; });
    EventBus.emit('quest:accepted', {
      instanceId: inst.instanceId, templateId: inst.templateId,
      assigneeId: inst.assigneeId, issuerId: inst.issuerId,
      hierarchyRelation: hierarchyRelation(inst.issuerId, inst.assigneeId),
      acceptChance: inst.acceptChance,
      ...relationSnapshot(inst.issuerId, inst.assigneeId),
    });
    const issueText = fillText(t.texts?.issue, inst);
    if (issueText) showQuestBubble(inst.issuerId || inst.assigneeId, issueText);
    if (!silent) log(`${getChar(inst.assigneeId)?.short}接任务「${t.name}」`);
    primeAcceptedQuestAction(inst, t);
    bumpQuestUi();
  }

  function completeQuest(inst, reason) {
    const t = tpl(inst.templateId);
    const finishedTime = getGameTimestamp();
    const onTime = !inst.deadlineTime || finishedTime <= inst.deadlineTime;
    const quality = ServantRelationSystem?.calculateQuestQuality?.(inst, t, { onTime }) || null;
    const servantQuality = quality ? ServantRelationSystem?.applyQualityEffects?.(inst, quality) : null;
    if (quality) {
      inst.quality = quality;
      inst.servantRuntime = servantQuality?.runtime;
    }
    inst.status = QUEST_STATUS.COMPLETED;
    applyEffects(t?.rewards, inst);
    applyEffects(st().categoryCompletionNeedRewards?.[t?.category], inst);
    setCooldown(inst.templateId, inst.assigneeId, t);
    history.unshift({ ...inst, finishedTime });
    if (history.length > 30) history.pop();
    EventBus.emit('quest:completed', {
      instanceId: inst.instanceId, templateId: inst.templateId,
      assigneeId: inst.assigneeId, issuerId: inst.issuerId,
      deadlineTime: inst.deadlineTime, finishedTime, onTime,
      blockedReason: inst.blockedReason || '',
      recommendedAction: inst.recommendedAction || '',
      qualityScore: quality?.score,
      qualityLabel: quality?.label,
      qualitySkillId: quality?.skillId,
      qualitySkillLevel: quality?.skillLevel,
      servantContractId: servantQuality?.contract?.id || inst.servantContractId,
      servantRole: servantQuality?.contract?.role || inst.servantRole,
      servantLoyalty: servantQuality?.runtime?.loyalty,
      servantGrievance: servantQuality?.runtime?.grievance,
      servantLaborPressure: servantQuality?.runtime?.laborPressure,
    });
    const assignee = getChar(inst.assigneeId);
    if (assignee?.lifePath && LifePathSystem?.questMatchesPath?.(inst.templateId, assignee)) {
      LifePathSystem.applyReputationDelta(assignee, 'pathTask');
    }
    LifePathSystem?.onQuestComplete?.(inst.templateId, inst.assigneeId);
    showQuestBubble(inst.assigneeId, fillText(t?.texts?.complete, inst));
    log(`${getChar(inst.assigneeId)?.short}完成「${t?.name}」${quality ? `（${quality.label}·${quality.score}）` : ''}${reason ? '（' + reason + '）' : ''}`);
    instances = instances.filter(q => q.instanceId !== inst.instanceId);
    bumpQuestUi();
  }

  function failQuest(inst, reason) {
    const t = tpl(inst.templateId);
    const quality = ServantRelationSystem?.calculateQuestQuality?.(inst, t, { onTime: false }) || null;
    if (quality) {
      quality.score = Math.min(quality.score, 29);
      quality.label = '失败';
      inst.quality = quality;
    }
    const servantQuality = quality ? ServantRelationSystem?.applyQualityEffects?.(inst, quality) : null;
    if (servantQuality) inst.servantRuntime = servantQuality.runtime;
    inst.status = QUEST_STATUS.FAILED;
    applyEffects(t?.penalties, inst);
    setCooldown(inst.templateId, inst.assigneeId, t);
    history.unshift({ ...inst, finishedTime: getGameTimestamp(), failReason: reason });
    if (history.length > 30) history.pop();
    EventBus.emit('quest:failed', {
      instanceId: inst.instanceId, templateId: inst.templateId,
      assigneeId: inst.assigneeId, issuerId: inst.issuerId, reason,
      blockedReason: inst.blockedReason || '',
      recommendedAction: inst.recommendedAction || '',
      qualityScore: quality?.score,
      qualityLabel: quality?.label,
      qualitySkillId: quality?.skillId,
      qualitySkillLevel: quality?.skillLevel,
      servantContractId: servantQuality?.contract?.id || inst.servantContractId,
      servantRole: servantQuality?.contract?.role || inst.servantRole,
      servantLoyalty: servantQuality?.runtime?.loyalty,
      servantGrievance: servantQuality?.runtime?.grievance,
      servantLaborPressure: servantQuality?.runtime?.laborPressure,
    });
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
    EventBus.emit('quest:declined', {
      instanceId: inst.instanceId, templateId: inst.templateId,
      assigneeId: inst.assigneeId, issuerId: inst.issuerId,
      hierarchyRelation: hierarchyRelation(inst.issuerId, inst.assigneeId),
      acceptChance: inst.acceptChance,
      ...relationSnapshot(inst.issuerId, inst.assigneeId),
    });
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
      category: t.category || '', questType: t.questType || '',
      hierarchyRelation: hierarchyRelation(issuerId, assigneeId),
    });
    if (t.autoAccept || t.questType === 'daily') {
      acceptQuest(inst, true);
    } else if (assigneeId === CHARS[selectedIdx]?.id) {
      log(`${getChar(issuerId)?.short}向你下发「${t.name}」，请在任务面板回应。`);
    } else {
      const rel = issuerId ? getRelationValue(issuerId, assigneeId) : 50;
      const assignee = getChar(assigneeId);
      const baseChance = Math.min(0.95, 0.65 + rel / 200);
      const servantChance = ServantRelationSystem?.questAcceptanceChance?.(issuerId, assigneeId, t, baseChance) ?? baseChance;
      const acceptChance = TraitEffectSystem?.questAcceptanceChance?.(assignee, servantChance) ?? servantChance;
      inst.acceptChance = acceptChance;
      const servantCtx = ServantRelationSystem?.acceptanceContext?.(issuerId, assigneeId, t);
      if (servantCtx?.contract) {
        inst.servantContractId = servantCtx.contract.id;
        inst.servantRole = servantCtx.contract.role;
        inst.servantInScope = !!servantCtx.inScope;
      }
      EventBus.emit('quest:acceptance_checked', {
        instanceId: inst.instanceId, templateId, assigneeId, issuerId,
        baseChance, servantChance, acceptChance,
        servantContractId: inst.servantContractId,
        servantRole: inst.servantRole,
        servantInScope: inst.servantInScope,
        ...relationSnapshot(issuerId, assigneeId),
      });
      if (Math.random() < acceptChance) acceptQuest(inst, true);
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
    return furnitureTargetMatch(cat, target);
  }

  function furnitureTargetMatch(category, target) {
    if (target === 'desk') return category === 'desk' || category === 'workdesk';
    if (target === 'workdesk') return category === 'workdesk';
    if (target === 'bed') return category === 'bed';
    return category === target;
  }

  function targetLabel(target) {
    const labels = {
      desk: '书桌', workdesk: '书案', bed: '床榻',
      bath: '沐浴家具', clean: '洒扫家具',
    };
    return labels[target] || target || '对应目标';
  }

  function describeCondition(inst, cond) {
    if (cond.type === 'USE_FURNITURE_DURATION' || cond.type === 'USE_FURNITURE') {
      return {
        recommendedAction: `使用${targetLabel(cond.target)}`,
        active: furnitureCategoryMatch(getChar(inst.assigneeId), cond.target),
        blockedReason: `尚未使用${targetLabel(cond.target)}`,
      };
    }
    if (cond.type === 'INTERACT_WITH' || cond.type === 'INTERACT_WITH_DURATION') {
      const tid = resolveTargetCharId(cond.target, inst);
      const target = getChar(tid);
      const assignee = getChar(inst.assigneeId);
      const active = assignee?.action?.type === 'interaction' && assignee.action.target?.id === tid;
      return {
        recommendedAction: `与${target?.short || '目标人物'}互动`,
        active,
        blockedReason: target ? `尚未与${target.short}互动` : '目标人物不存在',
      };
    }
    if (cond.type === 'FOLLOW_CHARACTER') {
      const tid = resolveTargetCharId(cond.target, inst);
      const target = getChar(tid);
      const assignee = getChar(inst.assigneeId);
      const dist = followDistance(assignee, target);
      const maxDist = followRequiredDistance(inst, cond);
      const closeEnough = Number.isFinite(dist) && dist <= maxDist;
      return {
        recommendedAction: `跟随${target?.short || '目标人物'}`,
        active: !!target && closeEnough,
        blockedReason: target
          ? sameScene(inst.assigneeId, tid)
            ? `离${target.short}还不够近`
            : `尚未与${target.short}同处一地`
          : '目标人物不存在',
      };
    }
    if (cond.type === 'STAY_IN_SCENE') {
      const sid = resolveSceneId(cond.target, inst);
      const scene = CONFIG.scenes?.find(s => s.id === sid);
      return {
        recommendedAction: `前往${scene?.name || '指定场景'}`,
        active: getChar(inst.assigneeId)?.sceneId === sid,
        blockedReason: scene ? `尚未到达${scene.name}` : '目标场景不存在',
      };
    }
    return {
      recommendedAction: cond.description || cond.type,
      active: false,
      blockedReason: '等待满足任务条件',
    };
  }

  function updateQuestDiagnostic(inst, t) {
    const cond = (t.completeConditions || []).find(c => (inst.progress[c.id] || 0) < c.targetValue);
    if (!cond) {
      inst.blockedReason = '';
      inst.recommendedAction = '';
      inst._activeReason = '';
      return;
    }
    const diagnostic = describeCondition(inst, cond);
    inst.recommendedAction = diagnostic.recommendedAction;
    const nextBlocked = diagnostic.active ? '' : diagnostic.blockedReason;
    if (nextBlocked !== inst.blockedReason) {
      inst.blockedReason = nextBlocked;
      if (nextBlocked) {
        EventBus.emit('quest:blocked', {
          instanceId: inst.instanceId, templateId: inst.templateId,
          assigneeId: inst.assigneeId, issuerId: inst.issuerId,
          conditionId: cond.id, conditionType: cond.type,
          reason: nextBlocked, recommendedAction: inst.recommendedAction,
        });
      }
    }
    const activeReason = diagnostic.active ? `${cond.type}:${cond.id}` : '';
    if (activeReason && activeReason !== inst._activeReason) {
      EventBus.emit('quest:started', {
        instanceId: inst.instanceId, templateId: inst.templateId,
        assigneeId: inst.assigneeId, issuerId: inst.issuerId,
        conditionId: cond.id, conditionType: cond.type,
        recommendedAction: inst.recommendedAction,
      });
    }
    inst._activeReason = activeReason;
  }

  function sameScene(a, b) {
    const ca = getChar(a), cb = getChar(b);
    return ca && cb && ca.sceneId === cb.sceneId;
  }

  function followDistance(assignee, target) {
    if (!assignee || !target || assignee.sceneId !== target.sceneId) return Infinity;
    return Math.hypot(assignee.gridCol - target.gridCol, assignee.gridRow - target.gridRow);
  }

  function followRequiredDistance(inst, cond) {
    if (cond?.distanceThreshold != null) return cond.distanceThreshold;
    if (inst?.templateId === 1021) return 1.5;
    return 2.5;
  }

  function setFollowRuntimeState(inst, cond) {
    const assignee = getChar(inst.assigneeId);
    const target = getChar(resolveTargetCharId(cond.target, inst));
    if (!assignee || !target) return;
    const dist = followDistance(assignee, target);
    const maxDist = followRequiredDistance(inst, cond);
    let state = 'returning';
    let label = `归队找${target.short}`;
    if (assignee.sceneId === target.sceneId && dist <= maxDist) {
      state = 'following';
      label = `随侍${target.short}`;
    } else if (assignee.sceneId === target.sceneId) {
      state = 'closing';
      label = `靠近${target.short}`;
    }
    const prev = followRuntime[inst.instanceId]?.state || '';
    followRuntime[inst.instanceId] = {
      state,
      targetId: target.id,
      updatedAt: getGameTimestamp(),
    };
    if (!assignee.action || assignee.action.type === 'move' || ['闲庭漫步', '静候'].includes(assignee.statusText)) {
      assignee.statusText = label;
    }
    if (prev !== state) {
      EventBus.emit('servant:follow_state', {
        servantId: inst.assigneeId,
        masterId: target.id,
        instanceId: inst.instanceId,
        templateId: inst.templateId,
        state,
        previousState: prev,
        distance: Number.isFinite(dist) ? Math.round(dist * 10) / 10 : null,
      });
    }
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
      updateQuestDiagnostic(inst, t);
      for (const cond of t.completeConditions || []) {
        if (cond.type === 'USE_FURNITURE_DURATION' && furnitureCategoryMatch(assignee, cond.target))
          updateConditionProgress(inst, cond, 1);
        if (cond.type === 'STAY_IN_SCENE') {
          const sid = resolveSceneId(cond.target, inst);
          if (sid && assignee.sceneId === sid) updateConditionProgress(inst, cond, 1);
        }
        if (cond.type === 'FOLLOW_CHARACTER') {
          const tid = resolveTargetCharId(cond.target, inst);
          if (tid) setFollowRuntimeState(inst, cond);
          const target = getChar(tid);
          if (tid && followDistance(assignee, target) <= followRequiredDistance(inst, cond)) updateConditionProgress(inst, cond, 1);
        }
        if (cond.type === 'INTERACT_WITH_DURATION') {
          const key = inst.instanceId + '|' + cond.id;
          if (interactionTrack[key]) updateConditionProgress(inst, cond, 1);
        }
      }
      const allDone = (t.completeConditions || []).every(c => (inst.progress[c.id] || 0) >= c.targetValue);
      if (allDone) completeQuest(inst);
    }
    for (const id of Object.keys(followRuntime)) {
      if (!instances.some(q => q.instanceId === +id && q.status === QUEST_STATUS.ACCEPTED)) delete followRuntime[id];
    }
    instances.filter(q => q.status === QUEST_STATUS.PENDING).forEach(inst => {
      if (now - inst.issuedTime > (st().pendingExpireGameMin || 180)) {
        inst.status = QUEST_STATUS.EXPIRED;
        EventBus.emit('quest:expired', {
          instanceId: inst.instanceId, templateId: inst.templateId,
          assigneeId: inst.assigneeId, issuerId: inst.issuerId,
          reason: '待回应超时',
        });
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
        if (furnitureTargetMatch(cat, cond.target)) updateConditionProgress(inst, cond, 1);
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

  function tryIssueDailyRoutines() {
    if (!enabled || !st().masterEnabled) return;
    const ts = getGameTimestamp();
    const servantDutyKeys = new Set();
    const rotationSkipKeys = new Set();
    for (const rule of ServantRelationSystem?.followRotations?.() || []) {
      const rotation = ServantRelationSystem.resolveFollowRotation?.(rule, gameDay);
      if (!rotation || !getChar(rotation.charId)) continue;
      rotationSkipKeys.add(`${rule.masterId}|${rule.templateId}|${rule.triggerHour}`);
      servantDutyKeys.add(`${rotation.charId}|${rotation.templateId}|${rotation.triggerHour}`);
      const key = `${gameDay}|${rotation.dailySlotId}`;
      if (dailyIssued[key]) continue;
      const servant = getChar(rotation.charId);
      const early = TraitEffectSystem?.questEarlyPrepareMinutes?.(servant) || 0;
      const scheduled = gameDay * 1440 + rotation.triggerHour * 60;
      if (ts < scheduled - early || ts > scheduled + 59) continue;
      dailyIssued[key] = true;
      const inst = issueQuest(rotation.templateId, rotation.masterId, rotation.charId, rotation.dailySlotId);
      if (inst) {
        inst.servantContractId = rotation.contract.id;
        inst.servantRole = rotation.contract.role;
        inst.servantInScope = true;
        inst.followRotation = true;
        EventBus.emit('servant:follow_rotation_issued', {
          instanceId: inst.instanceId, templateId: rotation.templateId,
          masterId: rotation.masterId, servantId: rotation.charId,
          contractId: rotation.contract.id, role: rotation.contract.role,
          weekday: rotation.weekday, slotId: rotation.dailySlotId,
        });
      }
    }
    for (const rule of ServantRelationSystem?.dutyRoutines?.() || []) {
      const duty = ServantRelationSystem.resolveDutyRoutine?.(rule);
      if (!duty || !getChar(duty.charId)) continue;
      servantDutyKeys.add(`${duty.charId}|${duty.templateId}|${duty.triggerHour}`);
      const key = `${gameDay}|${duty.dailySlotId}`;
      if (dailyIssued[key]) continue;
      const servant = getChar(duty.charId);
      const early = TraitEffectSystem?.questEarlyPrepareMinutes?.(servant) || 0;
      const scheduled = gameDay * 1440 + duty.triggerHour * 60;
      if (ts < scheduled - early || ts > scheduled + 59) continue;
      dailyIssued[key] = true;
      const inst = issueQuest(duty.templateId, duty.masterId, duty.charId, duty.dailySlotId);
      if (inst) {
        inst.servantContractId = duty.contract.id;
        inst.servantRole = duty.contract.role;
        inst.servantInScope = true;
        EventBus.emit('servant:duty_issued', {
          instanceId: inst.instanceId, templateId: duty.templateId,
          masterId: duty.masterId, servantId: duty.charId,
          contractId: duty.contract.id, role: duty.contract.role,
          slotId: duty.dailySlotId,
        });
      }
    }
    for (const slot of st().dailyRoutines || []) {
      if (servantDutyKeys.has(`${slot.charId}|${slot.templateId}|${slot.triggerHour}`)) continue;
      const slotTpl = tpl(slot.templateId);
      const followTarget = (slotTpl?.completeConditions || []).find(c => c.type === 'FOLLOW_CHARACTER')?.target;
      if (rotationSkipKeys.has(`${followTarget}|${slot.templateId}|${slot.triggerHour}`)) continue;
      const c = getChar(slot.charId);
      if (!c) continue;
      const key = `${gameDay}|${slot.slotId}`;
      if (dailyIssued[key]) continue;
      const early = TraitEffectSystem?.questEarlyPrepareMinutes?.(c) || 0;
      const scheduled = gameDay * 1440 + slot.triggerHour * 60;
      if (ts < scheduled - early || ts > scheduled + 59) continue;
      dailyIssued[key] = true;
      issueQuest(slot.templateId, null, slot.charId, slot.slotId);
    }
    for (const key of Object.keys(dailyIssued)) {
      if (+key.split('|')[0] < gameDay - 1) delete dailyIssued[key];
    }
  }

  function tryAiIssue() {
    if (!enabled || !st().masterEnabled) return;
    const templates = Object.values(st().templates || {}).filter(t => t.questType === 'directive' && t.issueBaseChance && t.targetScope !== 'group');
    const canIssueNow = (t, assigneeId) => {
      if (gameHour < 6 || gameHour >= 21) return false;
      if (t.deadlineMode === 'GAME_HOURS' && t.deadlineParam) {
        const dueMinuteOfDay = gameHour * 60 + gameMinute + t.deadlineParam * 60;
        if (dueMinuteOfDay > 22 * 60) return false;
      }
      const active = instances.filter(q =>
        q.assigneeId === assigneeId
        && (q.status === QUEST_STATUS.PENDING || q.status === QUEST_STATUS.ACCEPTED)
        && tpl(q.templateId)?.questType === 'directive');
      if (active.some(q => q.templateId === t.id)) return false;
      return active.length < 1;
    };
    for (const issuer of CHARS) {
      if (!isAIControlled(issuer)) continue;
      for (const assignee of CHARS) {
        if (assignee.id === issuer.id) continue;
        const pool = typeof QuestIssueSystem !== 'undefined'
          ? QuestIssueSystem.filterAiCandidates(issuer.id, assignee.id, templates)
          : templates.filter(t => canAssignTemplate(t, issuer.id, assignee.id));
        for (const t of pool) {
          if (!canIssueNow(t, assignee.id)) continue;
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
    tryIssueDailyRoutines();
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

  function firstIncompleteCondition(inst, type) {
    const t = tpl(inst.templateId);
    return (t?.completeConditions || []).find(cond =>
      (!type || cond.type === type) && (inst.progress?.[cond.id] || 0) < cond.targetValue);
  }

  function getFollowTaskForChar(charId) {
    return instances.find(q =>
      q.assigneeId === charId
      && q.status === QUEST_STATUS.ACCEPTED
      && firstIncompleteCondition(q, 'FOLLOW_CHARACTER'));
  }

  function nearestWalkableAroundChar(c, target) {
    if (!target) return null;
    const baseCol = Math.round(target.gridCol), baseRow = Math.round(target.gridRow);
    const options = [];
    for (let dc = -2; dc <= 2; dc++) {
      for (let dr = -2; dr <= 2; dr++) {
        const col = baseCol + dc, row = baseRow + dr;
        const cell = WORLD[col]?.[row];
        if (!cell?.walkable || cell.entryFor) continue;
        if (charAtCell(col, row, [c.id, target.id])) continue;
        options.push({ col, row, dist: Math.hypot(dc, dr) });
      }
    }
    options.sort((a, b) => a.dist - b.dist);
    return options[0] || null;
  }

  function randomWalkableInScene(sceneId, selfId) {
    const sc = CONFIG.scenes?.find(s => s.id === sceneId);
    if (!sc) return null;
    const options = [];
    for (let col = sc.originCol; col < sc.originCol + sc.cols; col++) {
      for (let row = sc.originRow; row < sc.originRow + sc.rows; row++) {
        const cell = WORLD[col]?.[row];
        if (!cell?.walkable || cell.entryFor || cell.sceneId !== sceneId) continue;
        if (charAtCell(col, row, [selfId])) continue;
        options.push({ col, row });
      }
    }
    if (!options.length) return null;
    return options[Math.floor(Math.random() * options.length)];
  }

  function questDeadlinePressure(inst) {
    if (!inst?.deadlineTime) return { left: Infinity, elapsedRatio: 0, urgent: false, weight: 7 };
    const now = getGameTimestamp();
    const left = inst.deadlineTime - now;
    const start = inst.acceptedTime || inst.issuedTime || now;
    const total = Math.max(1, inst.deadlineTime - start);
    const elapsedRatio = Math.max(0, Math.min(1, (now - start) / total));
    let weight = 7;
    if (left < 45) weight = 18;
    else if (left < 90) weight = 15;
    else if (left < 150) weight = 12;
    else if (elapsedRatio >= 0.55) weight = 11;
    else if (elapsedRatio >= 0.35) weight = 9.5;
    else if (left < 240) weight = 8.5;
    const urgent = left < 120 || elapsedRatio >= 0.45;
    return { left, elapsedRatio, urgent, weight };
  }

  function questDeadlineWeight(inst) {
    return questDeadlinePressure(inst).weight;
  }

  function questInteractionTemplateId(t, cond) {
    if (cond.interactionTemplateId && CONFIG.interactionTemplates?.[cond.interactionTemplateId])
      return cond.interactionTemplateId;
    if (/诗|吟|联句/.test(t?.name || '') && CONFIG.interactionTemplates?.[204]) return 204;
    if (/读|文/.test(t?.name || '') && CONFIG.interactionTemplates?.[203]) return 203;
    if ((t?.category || '') === '陪伴' && CONFIG.interactionTemplates?.[403]) return 403;
    return CONFIG.interactionTemplates?.[101] ? 101 : Number(Object.keys(CONFIG.interactionTemplates || {})[0]);
  }

  function extraCandidates(c, accessible) {
    if (!enabled || !st().masterEnabled || !c) return [];
    const out = [];
    for (const inst of instances.filter(q => q.assigneeId === c.id && q.status === QUEST_STATUS.ACCEPTED)) {
      const t = tpl(inst.templateId);
      const cond = firstIncompleteCondition(inst);
      if (!t || !cond) continue;
      const baseWeight = questDeadlineWeight(inst);
      if (cond.type === 'FOLLOW_CHARACTER') {
        const tid = resolveTargetCharId(cond.target, inst);
        const target = getChar(tid);
        if (!target) continue;
        if (accessible && !accessible.has(target.sceneId)) continue;
        const near = nearestWalkableAroundChar(c, target);
        if (!near) continue;
        const dist = Math.hypot(target.gridCol - c.gridCol, target.gridRow - c.gridRow);
        if (dist <= followRequiredDistance(inst, cond) && c.sceneId === target.sceneId) continue;
        out.push({
          key: `quest-follow:${inst.instanceId}:${tid}`,
          kind: 'seek',
          targetCharId: tid,
          gridCol: near.col,
          gridRow: near.row,
          tags: ['movement', 'task', '跟随'],
          category: '跟随',
          baseWeight,
          label: `跟随${target.short}`,
          questInstanceId: inst.instanceId,
        });
      }
      if (cond.type === 'INTERACT_WITH' || cond.type === 'INTERACT_WITH_DURATION') {
        const tid = resolveTargetCharId(cond.target, inst);
        const target = getChar(tid);
        if (!target) continue;
        if (accessible && !accessible.has(target.sceneId)) continue;
        const near = nearestWalkableAroundChar(c, target);
        if (!near) continue;
        const dist = Math.hypot(target.gridCol - c.gridCol, target.gridRow - c.gridRow);
        if (c.sceneId !== target.sceneId || dist > 2.5) {
          out.push({
            key: `quest-seek-interact:${inst.instanceId}:${tid}`,
            kind: 'seek',
            targetCharId: tid,
            gridCol: near.col,
            gridRow: near.row,
            tags: ['movement', 'task', 'social'],
            category: t.category || '任务',
            baseWeight,
            label: `找${target.short}办${t.name}`,
            questInstanceId: inst.instanceId,
          });
        } else {
          const interactionId = questInteractionTemplateId(t, cond);
          const it = CONFIG.interactionTemplates?.[interactionId];
          out.push({
            key: `quest-interact:${inst.instanceId}:${interactionId}:${tid}`,
            kind: 'interaction',
            interactionId,
            targetCharId: tid,
            tags: [it?.category, 'social', 'task'].filter(Boolean),
            category: it?.category || t.category || '任务',
            baseWeight,
            label: `${t.name}·${target.short}`,
            questInstanceId: inst.instanceId,
          });
        }
      }
      if (cond.type === 'STAY_IN_SCENE') {
        const sid = resolveSceneId(cond.target, inst);
        if (!sid || (accessible && !accessible.has(sid))) continue;
        if (getChar(inst.assigneeId)?.sceneId === sid) continue;
        const cell = randomWalkableInScene(sid, c.id);
        if (!cell) continue;
        out.push({
          key: `quest-scene:${inst.instanceId}:${sid}`,
          kind: 'wander',
          gridCol: cell.col,
          gridRow: cell.row,
          tags: ['movement', 'task'],
          category: t.category || '任务',
          baseWeight,
          label: `前往${CONFIG.scenes?.find(s => s.id === sid)?.name || '任务地点'}`,
          questInstanceId: inst.instanceId,
        });
      }
    }
    return out;
  }

  function getQuestWeightBoost(c, cand) {
    if (!enabled || !st().masterEnabled) return 1;
    let boost = 1;
    let related = false;
    let urgentMatch = false;
    const matchedQuestIds = [];
    const boostVal = st().questWeightBoost || 3;
    for (const inst of instances.filter(q => q.status === QUEST_STATUS.ACCEPTED && q.assigneeId === c.id)) {
      const t = tpl(inst.templateId);
      if (!t) continue;
      const pressure = questDeadlinePressure(inst);
      const urgent = pressure.urgent;
      const progressBoost = 1 + Math.min(0.45, pressure.elapsedRatio * 0.6);
      const mul = boostVal * progressBoost * (urgent ? 1.35 : 1);
      for (const cond of t.completeConditions || []) {
        if (cand.questInstanceId === inst.instanceId) {
          boost = Math.max(boost, mul * 1.2);
          related = true;
          urgentMatch ||= urgent;
          matchedQuestIds.push(inst.instanceId);
          continue;
        }
        if (cond.type === 'USE_FURNITURE_DURATION' && cand.kind === 'furniture') {
          const cat = getTemplate(getInstance(cand.instanceId)?.templateId)?.category;
          if (furnitureTargetMatch(cat, cond.target)) {
            boost = Math.max(boost, mul);
            related = true;
            urgentMatch ||= urgent;
            matchedQuestIds.push(inst.instanceId);
          }
        }
        if (cond.type === 'FOLLOW_CHARACTER' && cand.kind === 'interaction') {
          const tid = resolveTargetCharId(cond.target, inst);
          if (cand.targetCharId === tid) {
            boost = Math.max(boost, mul);
            related = true;
            urgentMatch ||= urgent;
            matchedQuestIds.push(inst.instanceId);
          }
        }
        if (cond.type === 'FOLLOW_CHARACTER' && cand.kind === 'seek') {
          const tid = resolveTargetCharId(cond.target, inst);
          if (cand.targetCharId === tid || cand.questInstanceId === inst.instanceId) {
            boost = Math.max(boost, mul * 1.15);
            related = true;
            urgentMatch ||= urgent;
            matchedQuestIds.push(inst.instanceId);
          }
        }
        if (cond.type === 'INTERACT_WITH' && cand.kind === 'interaction' && cand.targetCharId === resolveTargetCharId(cond.target, inst)) {
          boost = Math.max(boost, mul);
          related = true;
          urgentMatch ||= urgent;
          matchedQuestIds.push(inst.instanceId);
        }
      }
    }
    cand.questRelated = related;
    cand.questUrgent = urgentMatch;
    const finalBoost = boost * (related ? (TraitEffectSystem?.questWeightMultiplier?.(c, urgentMatch) || 1) : 1);
    if (related) {
      const uniqueQuestIds = [...new Set(matchedQuestIds)];
      const telemetryKey = `${c.id}|${cand.key}|${uniqueQuestIds.join(',')}`;
      const previous = candidateTelemetry[telemetryKey];
      const now = getGameTimestamp();
      if (!previous || now - previous.ts >= 30 || previous.urgent !== urgentMatch) {
        candidateTelemetry[telemetryKey] = { ts: now, urgent: urgentMatch };
        if (Object.keys(candidateTelemetry).length > 500) {
          const oldest = Object.entries(candidateTelemetry).sort((a, b) => a[1].ts - b[1].ts).slice(0, 100);
          oldest.forEach(([key]) => delete candidateTelemetry[key]);
        }
        EventBus.emit('quest:candidate', {
          charId: c.id, candidateKey: cand.key, candidateLabel: cand.label,
          candidateKind: cand.kind, candidateCategory: cand.category,
          matchedQuestIds: uniqueQuestIds,
          urgent: urgentMatch, boost: finalBoost,
        });
      }
    }
    return finalBoost;
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

  function statusLabel(status) {
    const labels = {
      [QUEST_STATUS.PENDING]: '待回应',
      [QUEST_STATUS.ACCEPTED]: '进行中',
      [QUEST_STATUS.COMPLETED]: '已完成',
      [QUEST_STATUS.FAILED]: '失败',
      [QUEST_STATUS.DECLINED]: '已拒绝',
      [QUEST_STATUS.REVOKED]: '已撤回',
      [QUEST_STATUS.EXPIRED]: '已过期',
    };
    return labels[status] || status || '未知';
  }

  function taskRelationLabel(inst) {
    if (inst.servantRole) return inst.servantInScope ? `${inst.servantRole}·职责内` : `${inst.servantRole}·职责外`;
    if (inst.issuerId && typeof ServantRelationSystem !== 'undefined') {
      const hint = ServantRelationSystem.describeFor?.(inst.issuerId, inst.assigneeId, tpl(inst.templateId));
      if (hint && !hint.includes('非主仆')) return hint;
    }
    if (!inst.issuerId) return '日常';
    return IdentityProtocolSystem?.hierarchyLabel?.(IdentityProtocolSystem.getHierarchyRelation(inst.issuerId, inst.assigneeId)) || '差遣';
  }

  function questProgressPctForDisplay(inst) {
    if (inst.status === QUEST_STATUS.COMPLETED) return 100;
    if (inst.status === QUEST_STATUS.PENDING) return 0;
    return Math.round(questProgressPctFor(inst));
  }

  function questScopeForChar(inst, charId, familyMemberIds, servantIds) {
    if (inst.assigneeId === charId) return 'mine';
    if (inst.issuerId === charId) return 'issued';
    if (servantIds.has(inst.assigneeId) || servantIds.has(inst.issuerId) || inst.servantContractId) return 'servant';
    if (familyMemberIds.includes(inst.assigneeId) || familyMemberIds.includes(inst.issuerId)) return 'family';
    return 'all';
  }

  function buildQuestPanel() {
    const c = CHARS[selectedIdx];
    const famMembers = FamilySystem.getCurrentMemberIds();
    const contracts = ServantRelationSystem?.contracts?.() || [];
    const servantIds = new Set(contracts
      .filter(row => row.masterId === c.id || row.servantId === c.id)
      .flatMap(row => [row.masterId, row.servantId]));
    const activeStatuses = [QUEST_STATUS.PENDING, QUEST_STATUS.ACCEPTED];
    const activeAll = instances.filter(q => activeStatuses.includes(q.status));
    const pending = activeAll.filter(q => q.assigneeId === c.id && q.status === QUEST_STATUS.PENDING);
    const active = activeAll.filter(q => q.assigneeId === c.id && q.status === QUEST_STATUS.ACCEPTED);
    const issued = activeAll.filter(q => q.issuerId === c.id && !q.batchId);
    const batches = getBatchesForIssuer(c.id);
    const familyDaily = activeAll.filter(q => q.status === QUEST_STATUS.ACCEPTED && famMembers.includes(q.assigneeId) && tpl(q.templateId)?.questType === 'daily' && q.assigneeId !== c.id);
    const blocked = activeAll.filter(q => q.status === QUEST_STATUS.ACCEPTED && q.blockedReason);
    const servantRelated = activeAll.filter(q => questScopeForChar(q, c.id, famMembers, servantIds) === 'servant');
    const filterDefs = [
      { id: 'mine', label: '我的', count: pending.length + active.length },
      { id: 'issued', label: '我下发的', count: issued.length + batches.length },
      { id: 'family', label: '家人日常', count: familyDaily.length },
      { id: 'servant', label: '仆从职责', count: servantRelated.length },
      { id: 'blocked', label: '阻塞', count: blocked.length },
      { id: 'all', label: '全部进行中', count: activeAll.length },
      { id: 'history', label: '近期记录', count: history.length },
    ];
    if (!filterDefs.some(f => f.id === questPanelFilter)) questPanelFilter = 'mine';

    const selectedList = (() => {
      if (questPanelFilter === 'mine') return activeAll.filter(q => q.assigneeId === c.id);
      if (questPanelFilter === 'issued') return activeAll.filter(q => q.issuerId === c.id && !q.batchId);
      if (questPanelFilter === 'family') return activeAll.filter(q => famMembers.includes(q.assigneeId) && q.assigneeId !== c.id);
      if (questPanelFilter === 'servant') return servantRelated;
      if (questPanelFilter === 'blocked') return blocked;
      if (questPanelFilter === 'all') return activeAll;
      return [];
    })().sort((a, b) => {
      if (a.status !== b.status) return a.status === QUEST_STATUS.PENDING ? -1 : 1;
      const ad = a.deadlineTime || Infinity, bd = b.deadlineTime || Infinity;
      return ad - bd || a.issuedTime - b.issuedTime;
    });

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
        : `${issuer} → ${assignee}`;
      const diagnostic = inst.status === QUEST_STATUS.ACCEPTED && (inst.recommendedAction || inst.blockedReason)
        ? `<div class="quest-cond">${inst.blockedReason
          ? `暂未推进：${escapeHtml(inst.blockedReason)}`
          : '正在推进'}${inst.recommendedAction ? ` · 建议：${escapeHtml(inst.recommendedAction)}` : ''}</div>`
        : '';
      const pct = questProgressPctForDisplay(inst);
      return `<div class="quest-card ${opts || ''}${inst.blockedReason ? ' blocked' : ''}">
        <div class="quest-title">${inst.status === QUEST_STATUS.PENDING ? '⚠ ' : '◉ '}${escapeHtml(t.name)}
          <span class="quest-pill">${escapeHtml(statusLabel(inst.status))}</span>
        </div>
        <div class="quest-meta">${escapeHtml(metaExtra)} · ${escapeHtml(formatDeadline(inst))} · ${escapeHtml(t.category || '')} · ${escapeHtml(taskRelationLabel(inst))}</div>
        ${diagnostic}${conds}${pendingBtns}${revokeBtn}
        <div class="quest-prog"><div class="quest-prog-fill" style="width:${pct}%"></div></div>
      </div>`;
    };

    const histRows = history.slice(0, 8).map(h => {
      const t = tpl(h.templateId);
      const icon = h.status === QUEST_STATUS.COMPLETED ? '✓' : '✕';
      const q = h.quality ? ` · ${h.quality.label}${h.quality.score != null ? ' ' + h.quality.score : ''}` : '';
      const servant = h.servantRuntime
        ? ` · 忠${Math.round(h.servantRuntime.loyalty ?? 50)} 怨${Math.round(h.servantRuntime.grievance ?? 0)} 劳${Math.round(h.servantRuntime.laborPressure ?? 0)}`
        : '';
      return `<div class="quest-card done">${icon} ${escapeHtml(t?.name || h.templateId)} (${escapeHtml(getChar(h.assigneeId)?.short || h.assigneeId)})${escapeHtml(q + servant)}</div>`;
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

    const summary = `<div class="quest-dashboard">
      <div><b>${pending.length}</b><span>待回应</span></div>
      <div><b>${active.length}</b><span>我的进行中</span></div>
      <div><b>${issued.length + batches.length}</b><span>我下发</span></div>
      <div><b>${blocked.length}</b><span>阻塞</span></div>
    </div>`;
    const filters = `<div class="quest-filters">${filterDefs.map(f =>
      `<button class="sys-btn ${questPanelFilter === f.id ? 'primary' : ''}" data-qfilter="${f.id}">
        ${escapeHtml(f.label)}<span class="quest-badge" style="${f.count ? '' : 'display:none'}">${f.count}</span>
      </button>`).join('')}</div>`;
    const listHtml = questPanelFilter === 'history'
      ? (histRows || '<p style="color:var(--jn-text-soft)">暂无近期记录。</p>')
      : selectedList.map(i => renderCard(i, i.status === QUEST_STATUS.PENDING ? 'pending' : (i.issuerId === c.id ? 'issued' : ''))).join('');
    const selectedLabel = filterDefs.find(f => f.id === questPanelFilter)?.label || '任务';
    return `<h3>${escapeHtml(c.name)} · 任务管理</h3>
      ${summary}
      ${filters}
      ${questPanelFilter === 'issued' && batches.length ? `<div class="quest-section"><h4>群体传令</h4>${batchCards}</div>` : ''}
      <div class="quest-section"><h4>${escapeHtml(selectedLabel)}</h4>${listHtml || '<p style="color:var(--jn-text-soft)">当前筛选下暂无任务。</p>'}</div>
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
    document.querySelectorAll('[data-qfilter]').forEach(btn => btn.onclick = () => {
      questPanelFilter = btn.dataset.qfilter || 'mine';
      const def = [
        { id: 'mine', label: '我的' },
        { id: 'issued', label: '我下发的' },
        { id: 'family', label: '家人日常' },
        { id: 'servant', label: '仆从职责' },
        { id: 'blocked', label: '阻塞' },
        { id: 'all', label: '全部进行中' },
        { id: 'history', label: '近期记录' },
      ].find(f => f.id === questPanelFilter);
      EventBus.emit('quest:panel_filter', {
        charId: CHARS[selectedIdx]?.id,
        filter: questPanelFilter,
        label: def?.label || questPanelFilter,
      });
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
    return { instances, history, nextId, nextBatchId, cooldowns, issueAcc, groupIssueAcc, dailyIssued, candidateTelemetry };
  }

  function apply(state) {
    instances = state?.instances || [];
    history = state?.history || [];
    nextId = state?.nextId || 1;
    nextBatchId = state?.nextBatchId || 1;
    cooldowns = state?.cooldowns || {};
    issueAcc = state?.issueAcc || 0;
    groupIssueAcc = state?.groupIssueAcc || 0;
    dailyIssued = state?.dailyIssued || {};
    candidateTelemetry = state?.candidateTelemetry || {};
  }

  function init() {
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    if (!st().masterEnabled) { enabled = false; return; }
    enabled = true;
    unsubs.push(EventBus.on('time:tick', onTick));
    unsubs.push(EventBus.on('interaction:complete', onInteractionComplete));
    unsubs.push(EventBus.on('furniture:complete', onFurnitureComplete));
  }

  return {
    init, openQuestPanel, updateBadge, getQuestWeightBoost, getActiveForChar, getAcceptedFor,
    getFollowTaskForChar, extraCandidates,
    tpl, resolveSceneId, resolveTargetCharId,
    acceptQuest: id => { const q = instances.find(x => x.instanceId === id); if (q) acceptQuest(q); },
    declineQuest: id => { const q = instances.find(x => x.instanceId === id); if (q) declineQuest(q); },
    revokeQuest: id => { const q = instances.find(x => x.instanceId === id); if (q) revokeQuest(q); },
    revokeBatch, getBatchesForIssuer, getBatchInstances,
    canIssue, isTemplateExecutableBy, issueOne: issueQuest, issueBatch,
    debugIssue: (templateId, issuerId, assigneeId) => issueQuest(templateId, issuerId, assigneeId),
    serialize, apply, getInstances: () => instances.slice(),
  };
})();
window.QuestSystem = QuestSystem;

function serializeGameState() {
  if (typeof sanitizeInteractionCooldowns === 'function') sanitizeInteractionCooldowns();
  if (typeof sanitizeAISocialCooldowns === 'function') CHARS.forEach(c => sanitizeAISocialCooldowns(c));
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
      needMeta: { ...(c.needMeta || {}) },
      activeStates: c.activeStates.map(s => ({ ...s })),
      tempNeedMods: c.tempNeedMods.map(t => ({ ...t })),
      actionQueue: c.actionQueue.map(q => ({ ...q })),
      memories: c.memories.slice(),
      traitStats: c.traitStats ? JSON.parse(JSON.stringify(c.traitStats)) : undefined,
      skillLevels: { ...c.skillLevels },
      lifePath: c.lifePath ?? null,
      currentStage: c.currentStage ?? null,
      reputation: c.reputation ?? 0,
      ...(ReputationDomainSystem?.serializeChar?.(c) || {}),
      professionHistory: (c.professionHistory || []).slice(),
      _baseSocialRank: c._baseSocialRank,
      ...(MoneySystem?.serializeChar?.(c) || {}),
      ...(HealthSystem?.serializeChar?.(c) || {}),
      ...(DreamProgressStore?.serializeChar?.(c) || {}),
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
    economyState: EconomySystem?.serialize?.() || {},
    questState: QuestSystem.serialize(),
    questIssueState: QuestIssueSystem?.serialize?.() || {},
    servantState: ServantRelationSystem?.serialize?.() || {},
    sceneAccessState: SceneAccessSystem.serialize(),
    behaviorDailyStatsState: BehaviorDailyStats?.serialize?.() || {},
    reputationDomainState: ReputationDomainSystem?.serialize?.() || [],
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
  if (!data || ![1, 2, 3, 4].includes(data.version)) return false;
  const savedVersion = data.version;
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
  trimGameLogs();
  deserializeRelations(data.relations ?? {});
  interactionCooldowns = data.interactionCooldowns ?? {};
  if (typeof sanitizeInteractionCooldowns === 'function') sanitizeInteractionCooldowns();
  interactionOnceUsed = new Set(data.interactionOnceUsed ?? []);
  for (const snap of data.chars || []) {
    const c = CHARS.find(x => x.id === snap.id);
    if (!c) continue;
    const activeStates = (snap.activeStates || []).map(st => ({
      ...st,
      remaining: st.remaining >= 99990 ? -1 : st.remaining,
    }));
    const tempNeedMods = (snap.tempNeedMods || []).map(tm => ({
      ...tm,
      remaining: savedVersion < 3
        ? (tm.remaining || 0) * GAME_MINUTES_PER_REAL_SEC
        : (tm.remaining || 0),
    }));
    Object.assign(c, {
      sceneId: snap.sceneId, gridCol: snap.gridCol, gridRow: snap.gridRow,
      x: snap.x, y: snap.y,
      needs: Object.fromEntries(getNeedDefs().map(nd => [
        nd.key,
        snap.needs?.[nd.key] ?? c.needs?.[nd.key] ?? nd.defaultValue ?? 70,
      ])),
      needMeta: { ...(snap.needMeta || {}) },
      statusText: snap.statusText || '闲庭漫步',
      activeStates,
      tempNeedMods,
      actionQueue: snap.actionQueue || [],
      memories: snap.memories || [],
      traitStats: snap.traitStats || c.traitStats,
      skillLevels: snap.skillLevels || c.skillLevels,
      lifePath: snap.lifePath ?? null,
      currentStage: snap.currentStage ?? null,
      reputation: snap.reputation ?? 0,
      reputationDomains: snap.reputationDomains,
      reputationLog: snap.reputationLog,
      professionHistory: snap.professionHistory || [],
      _baseSocialRank: snap._baseSocialRank ?? c._baseSocialRank,
      usingInstanceId: snap.usingInstanceId || 0,
      action: null, path: [],
    });
    MoneySystem?.applyChar?.(c, snap);
    HealthSystem?.applyChar?.(c, snap);
    DreamProgressStore?.applyChar?.(c, snap);
    ReputationDomainSystem?.applyChar?.(c, snap);
    if (snap.ai) {
      initCharAI(c);
      Object.assign(c.ai, {
        state: snap.ai.state || AI_STATE.IDLE,
        urgentNeed: snap.ai.urgentNeed || null,
        cooldownUntil: snap.ai.cooldownUntil || 0,
        socialCooldowns: snap.ai.socialCooldowns || {},
      });
      if (typeof sanitizeAISocialCooldowns === 'function') sanitizeAISocialCooldowns(c);
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
  EconomySystem?.apply?.(data.economyState);
  QuestSystem.apply(data.questState);
  QuestIssueSystem?.apply?.(data.questIssueState);
  ServantRelationSystem?.apply?.(data.servantState);
  SceneAccessSystem.apply(data.sceneAccessState);
  BehaviorDailyStats?.apply?.(data.behaviorDailyStatsState || {});
  ReputationDomainSystem?.apply?.(data.reputationDomainState || data.chars?.map(s => ({
    id: s.id, reputationDomains: s.reputationDomains, reputationLog: s.reputationLog,
  })) || []);
  LifePathSystem?.apply?.(data.lifePathState || data.chars?.map(s => ({
    id: s.id, lifePath: s.lifePath, currentStage: s.currentStage,
    reputation: s.reputation, reputationDomains: s.reputationDomains, reputationLog: s.reputationLog,
    professionHistory: s.professionHistory, _baseSocialRank: s._baseSocialRank,
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
