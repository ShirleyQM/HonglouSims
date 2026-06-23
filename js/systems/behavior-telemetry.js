/* Character behavior telemetry for balancing AI decisions over multiple game days. */
const BehaviorTelemetry = (() => {
  const STORAGE_KEY = 'dgy_behavior_telemetry_v1';
  const SETTINGS_KEY = 'dgy_behavior_telemetry_settings_v1';
  const MAX_RECORDS = 1200;
  const FLUSH_EVERY = 20;
  let records = [];
  let dirtyCount = 0;
  let initialized = false;
  let watchedCharIds = new Set(['daiyu']);
  let unsubs = [];

  function round(value, digits = 2) {
    if (!Number.isFinite(value)) return value;
    const scale = 10 ** digits;
    return Math.round(value * scale) / scale;
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      records = Array.isArray(saved) ? saved.slice(-MAX_RECORDS) : [];
    } catch (e) {
      console.warn('BehaviorTelemetry records unavailable:', e);
      records = [];
    }
    try {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      if (Array.isArray(settings.watchedCharIds)) watchedCharIds = new Set(settings.watchedCharIds);
    } catch (e) {
      console.warn('BehaviorTelemetry settings unavailable:', e);
    }
    watchedCharIds.add('daiyu');
  }

  function flush() {
    if (!dirtyCount) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      dirtyCount = 0;
    } catch (e) {
      console.warn('BehaviorTelemetry flush failed:', e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ watchedCharIds: [...watchedCharIds] }));
    } catch (e) {
      console.warn('BehaviorTelemetry settings save failed:', e);
    }
  }

  function append(event, charId, data = {}) {
    if (!watchedCharIds.has(charId)) return;
    records.push({
      v: 1,
      event,
      charId,
      ts: getGameTimestamp(),
      day: gameDay,
      hour: gameHour,
      minute: Math.floor(gameMinute),
      ...data,
    });
    if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS);
    dirtyCount++;
    if (dirtyCount >= FLUSH_EVERY) flush();
  }

  function recordEvaluation(c, channel, picked, context = {}) {
    if (!c || !watchedCharIds.has(c.id)) return;
    const cf = calcNeedCoeffs(c);
    const needs = {};
    for (const nd of getNeedDefs()) {
      needs[nd.key] = {
        value: round(c.needs[nd.key], 1),
        ratio: round(c.needs[nd.key] / Math.max(1, cf[nd.key].max), 3),
      };
    }
    const candidates = [...(c.ai?.cache?.candidates || [])]
      .filter(row => row.finalWeight > 0)
      .sort((a, b) => b.finalWeight - a.finalWeight)
      .slice(0, 6)
      .map(row => ({
        key: row.key,
        label: row.label,
        kind: row.kind,
        category: row.category,
        targetCharId: row.targetCharId,
        weight: round(row.finalWeight),
        distance: round(row.distance, 1),
        factors: {
          base: round(row.baseWeight),
          demand: round(row.demandFactor),
          trait: round(row.traitFactor),
          status: round(row.statusFactor),
          time: round(row.timeFactor),
          memory: round(row.memoryFactor),
          specialty: round(row.specialtyFactor),
          distance: round(row.distanceFactor),
          random: round(row.randomFactor),
          drama: round(row.dramaFactor),
          crowd: round(row.crowdFactor),
          furnitureOccupancy: round(row.furnitureOccupancyFactor),
          homeward: round(row.homewardFactor),
          quest: round(row.questFactor),
          needDrive: round(row.needDriveFactor),
          satiation: round(row.satiationFactor),
          failedAction: round(row.failedActionFactor),
          recentAction: round(row.recentActionFactor),
          relation: round(row.relationFactor),
          schedule: round(row.scheduleFactor),
          routine: round(row.routineFactor),
        },
        scheduleWindow: row.scheduleWindow || null,
        routineAnchor: row.routineAnchor || null,
        provider: row.provider || '',
        scoreHints: row.scoreHints || [],
      }));
    append('evaluation', c.id, {
      channel,
      needs,
      state: c.ai?.state,
      statusText: c.statusText,
      busy: !!context.busy,
      replaced: !!context.replaced,
      replaceThreshold: round(context.replaceThreshold),
      currentWeight: round(context.currentWeight),
      picked: picked ? {
        key: picked.key,
        label: picked.label,
        kind: picked.kind,
        category: picked.category,
        targetCharId: picked.targetCharId,
        provider: picked.provider || '',
        weight: round(picked.finalWeight),
        scheduleWindow: picked.scheduleWindow || null,
        routineAnchor: picked.routineAnchor || null,
        scoreHints: picked.scoreHints || [],
      } : null,
      pool: c.ai?.cache?.poolDiagnostics || null,
      top: candidates,
    });
  }

  function bind(type, charIdFromEvent, project) {
    unsubs.push(EventBus.on(type, evt => {
      const charId = charIdFromEvent(evt);
      if (!charId) return;
      append(type, charId, project ? project(evt) : {});
    }));
  }

  function init() {
    if (initialized) return;
    initialized = true;
    load();
    bind('furniture:complete', evt => evt.charId, evt => ({
      instanceId: evt.instanceId,
      templateId: evt.templateId,
      category: evt.category,
      furniture: getTemplate(evt.templateId)?.name || '',
      needs: Object.fromEntries(Object.entries(getChar(evt.charId)?.needs || {})
        .map(([key, value]) => [key, round(value, 1)])),
    }));
    bind('furniture:use_started', evt => evt.charId, evt => ({
      instanceId: evt.instanceId,
      templateId: evt.templateId,
      category: evt.category,
      furniture: getTemplate(evt.templateId)?.name || '',
    }));
    bind('furniture:refused', evt => evt.charId, evt => ({
      templateId: evt.templateId,
      category: evt.category,
      reason: evt.reason,
      traitId: evt.traitId,
    }));
    bind('furniture:reaction', evt => evt.observerId, evt => ({
      reactionId: evt.reactionId,
      reactionName: evt.reactionName,
      actorId: evt.actorId,
      instanceId: evt.instanceId,
      templateId: evt.templateId,
      actionId: evt.actionId,
      shown: evt.shown,
    }));
    bind('need:range_changed', evt => evt.charId, evt => ({
      needKey: evt.needKey,
      field: evt.field,
      oldValue: evt.oldValue,
      newValue: evt.newValue,
    }));
    bind('need:band_changed', evt => evt.charId, evt => ({
      needKey: evt.needKey,
      previousStateId: evt.previousStateId,
      stateId: evt.stateId,
    }));
    bind('need:combination_triggered', evt => evt.charId, evt => ({
      stateId: evt.stateId,
      conditions: evt.conditions,
    }));
    bind('map:click', evt => evt.charId, evt => ({
      targetType: evt.targetType,
      instanceId: evt.instanceId,
      templateId: evt.templateId,
      furniture: evt.templateId ? getTemplate(evt.templateId)?.name || '' : '',
      gridCol: evt.gridCol,
      gridRow: evt.gridRow,
    }));
    bind('queue:add', evt => evt.charId, evt => ({
      itemType: evt.itemType,
      itemName: evt.itemName,
    }));
    bind('queue:failed', evt => evt.charId, evt => ({
      itemType: evt.itemType,
      itemName: evt.itemName,
      instanceId: evt.instanceId,
      actionId: evt.actionId,
      sceneId: evt.sceneId,
      candidateKey: evt.candidateKey,
      reason: evt.reason,
    }));
    bind('ai:candidate_rejected', evt => evt.charId, evt => ({
      candidateKey: evt.key,
      candidateLabel: evt.label,
      candidateKind: evt.kind,
      reason: evt.reason,
    }));
    bind('ai:decision', evt => evt.charId, evt => ({
      channel: evt.channel,
      candidateKey: evt.key,
      action: evt.action,
      kind: evt.kind,
      category: evt.category,
      provider: evt.provider,
      weight: round(evt.weight),
      replaced: evt.replaced,
      scheduleWindow: evt.scheduleWindow || null,
      routineAnchor: evt.routineAnchor || null,
      scoreHints: evt.scoreHints || [],
    }));
    bind('ai:routine_completed', evt => evt.charId, evt => ({
      anchorId: evt.anchorId,
      anchorName: evt.anchorName,
      sourceType: evt.sourceType,
      category: evt.category,
      day: evt.day,
    }));
    bind('ai:social_target_cooldown', evt => evt.charId, evt => ({
      targetCharId: evt.targetCharId,
      interactionId: evt.interactionId,
      minutes: evt.minutes,
      crossedScene: evt.crossedScene,
      until: evt.until,
    }));
    bind('ai:daily_social_count', evt => evt.charId, evt => ({
      targetCharId: evt.targetCharId,
      count: evt.count,
      limit: evt.limit,
      day: evt.day,
    }));
    bind('relation:axis_change', evt => evt.actor || evt.idA, evt => ({
      idA: evt.idA,
      idB: evt.idB,
      actor: evt.actor,
      recipient: evt.recipient,
      axis: evt.axis,
      oldValue: round(evt.old),
      newValue: round(evt.new),
      delta: round(evt.delta),
      oldScore: round(evt.oldScore),
      newScore: round(evt.newScore),
      source: evt.source,
      reason: evt.reason,
      contextType: evt.contextType,
      interactionId: evt.interactionId,
      questTemplateId: evt.questTemplateId,
      eventId: evt.eventId,
    }));
    bind('relation:change', evt => evt.actor || evt.idA, evt => ({
      idA: evt.idA,
      idB: evt.idB,
      actor: evt.actor,
      recipient: evt.recipient,
      axis: evt.axis,
      oldScore: round(evt.old),
      newScore: round(evt.new),
      delta: round(evt.delta),
      typeLabel: evt.typeLabel,
      axisOld: round(evt.axisOld),
      axisNew: round(evt.axisNew),
      source: evt.source,
      reason: evt.reason,
      contextType: evt.contextType,
      interactionId: evt.interactionId,
      questTemplateId: evt.questTemplateId,
      eventId: evt.eventId,
    }));
    bind('action:blocked', evt => evt.charId, evt => ({
      actionType: evt.actionType,
      reason: evt.reason,
    }));
    unsubs.push(EventBus.on('interaction:complete', evt => {
      const common = {
        interactionId: evt.interactionId,
        interactionName: evt.interactionName,
        category: getInteractionTemplate(evt.interactionId)?.category || '',
      };
      append('interaction:complete', evt.initiatorId, {
        ...common,
        role: 'initiator',
        otherCharId: evt.targetId,
      });
      append('interaction:complete', evt.targetId, {
        ...common,
        role: 'target',
        otherCharId: evt.initiatorId,
      });
    }));
    for (const type of [
      'quest:issued', 'quest:accepted', 'quest:completed', 'quest:failed',
      'quest:declined', 'quest:expired', 'quest:started', 'quest:blocked',
      'quest:acceptance_checked',
    ]) {
      bind(type, evt => evt.assigneeId, evt => ({
        templateId: evt.templateId,
        quest: QuestSystem?.tpl?.(evt.templateId)?.name || '',
        issuerId: evt.issuerId,
        reason: evt.reason,
        hierarchyRelation: evt.hierarchyRelation,
        relation: evt.relation,
        affection: evt.affection,
        trust: evt.trust,
        friendship: evt.friendship,
        submission: evt.submission,
        acceptChance: evt.acceptChance,
        baseChance: evt.baseChance,
        servantChance: evt.servantChance,
        servantContractId: evt.servantContractId,
        servantRole: evt.servantRole,
        servantScope: evt.servantScope,
        servantInScope: evt.servantInScope,
        servantAuthorityLevel: evt.servantAuthorityLevel,
        servantLoad: evt.servantLoad,
        conditionId: evt.conditionId,
        conditionType: evt.conditionType,
        recommendedAction: evt.recommendedAction,
        blockedReason: evt.blockedReason,
        deadlineTime: evt.deadlineTime,
        finishedTime: evt.finishedTime,
        onTime: evt.onTime,
        qualityScore: evt.qualityScore,
        qualityLabel: evt.qualityLabel,
        qualitySkillId: evt.qualitySkillId,
        qualitySkillLevel: evt.qualitySkillLevel,
        servantLoyalty: evt.servantLoyalty,
        servantGrievance: evt.servantGrievance,
        servantLaborPressure: evt.servantLaborPressure,
      }));
    }
    bind('servant:relation_changed', evt => evt.servantId, evt => ({
      masterId: evt.masterId,
      contractId: evt.contractId,
      role: evt.role,
      loyalty: evt.loyalty,
      grievance: evt.grievance,
      laborPressure: evt.laborPressure,
      qualityScore: evt.qualityScore,
      qualityLabel: evt.qualityLabel,
    }));
    bind('quest:candidate', evt => evt.charId, evt => ({
      candidateKey: evt.candidateKey,
      candidateLabel: evt.candidateLabel,
      candidateKind: evt.candidateKind,
      candidateCategory: evt.candidateCategory,
      matchedQuestIds: evt.matchedQuestIds,
      urgent: evt.urgent,
      boost: round(evt.boost),
    }));
    bind('servant:duty_issued', evt => evt.servantId, evt => ({
      templateId: evt.templateId,
      quest: QuestSystem?.tpl?.(evt.templateId)?.name || '',
      masterId: evt.masterId,
      contractId: evt.contractId,
      role: evt.role,
      slotId: evt.slotId,
      instanceId: evt.instanceId,
    }));
    bind('servant:follow_rotation_issued', evt => evt.servantId, evt => ({
      templateId: evt.templateId,
      quest: QuestSystem?.tpl?.(evt.templateId)?.name || '',
      masterId: evt.masterId,
      contractId: evt.contractId,
      role: evt.role,
      weekday: evt.weekday,
      slotId: evt.slotId,
      instanceId: evt.instanceId,
    }));
    bind('servant:follow_interrupted', evt => evt.servantId, evt => ({
      masterId: evt.masterId,
      instanceId: evt.instanceId,
      templateId: evt.templateId,
      quest: QuestSystem?.tpl?.(evt.templateId)?.name || '',
      needKey: evt.needKey,
    }));
    bind('servant:follow_state', evt => evt.servantId, evt => ({
      masterId: evt.masterId,
      instanceId: evt.instanceId,
      templateId: evt.templateId,
      quest: QuestSystem?.tpl?.(evt.templateId)?.name || '',
      state: evt.state,
      previousState: evt.previousState,
      distance: evt.distance,
    }));
    bind('quest:panel_filter', evt => evt.charId, evt => ({
      filter: evt.filter,
      label: evt.label,
    }));
    for (const type of ['economy:shift_started', 'economy:shift_ended', 'economy:food_paid', 'economy:allowance_paid']) {
      bind(type, evt => evt.charId, evt => ({
        familyId: evt.familyId,
        fromFamilyId: evt.fromFamilyId,
        targetFamilyId: evt.targetFamilyId,
        amount: evt.amount,
        wage: evt.wage,
        category: evt.category,
        workName: evt.workName,
        note: evt.note,
      }));
    }
    unsubs.push(EventBus.on('time:day', flush));
    window.addEventListener('beforeunload', flush);
  }

  function query(options = {}) {
    const { charId, event, fromTs = -Infinity, toTs = Infinity, limit = 200 } = options;
    return records.filter(row =>
      (!charId || row.charId === charId)
      && (!event || row.event === event)
      && row.ts >= fromTs
      && row.ts <= toTs
    ).slice(-Math.max(1, limit));
  }

  function summarize(charId = 'daiyu', options = {}) {
    const rows = query({ charId, fromTs: options.fromTs, toTs: options.toTs, limit: MAX_RECORDS });
    const result = {
      charId,
      records: rows.length,
      period: rows.length ? { fromTs: rows[0].ts, toTs: rows[rows.length - 1].ts } : null,
      evaluations: 0,
      decisionsReplaced: 0,
      evaluationsWithoutSocialCandidate: 0,
      poolTruncatedSocial: 0,
      selectedKinds: {},
      selectedCategories: {},
      selectedActions: {},
      completedFurniture: {},
      refusedFurniture: {},
      needRangeChanges: {},
      completedInteractions: {},
      rejectedCandidates: {},
      providerAccepted: {},
      quests: {},
    };
    for (const row of rows) {
      if (row.event === 'evaluation') {
        result.evaluations++;
        if (row.replaced) result.decisionsReplaced++;
        if (!(row.pool?.retainedByKind?.interaction > 0)) result.evaluationsWithoutSocialCandidate++;
        if ((row.pool?.rawByKind?.interaction || 0) > (row.pool?.retainedByKind?.interaction || 0))
          result.poolTruncatedSocial++;
        if (row.picked) {
          result.selectedKinds[row.picked.kind] = (result.selectedKinds[row.picked.kind] || 0) + 1;
          result.selectedCategories[row.picked.category] = (result.selectedCategories[row.picked.category] || 0) + 1;
          result.selectedActions[row.picked.label] = (result.selectedActions[row.picked.label] || 0) + 1;
        }
        for (const [provider, stat] of Object.entries(row.pool?.providers || {})) {
          result.providerAccepted[provider] = (result.providerAccepted[provider] || 0) + (stat.accepted || 0);
        }
      } else if (row.event === 'furniture:complete') {
        result.completedFurniture[row.furniture] = (result.completedFurniture[row.furniture] || 0) + 1;
      } else if (row.event === 'furniture:refused') {
        const key = row.category || row.templateId || 'unknown';
        result.refusedFurniture[key] = (result.refusedFurniture[key] || 0) + 1;
      } else if (row.event === 'need:range_changed') {
        const key = `${row.needKey}.${row.field}`;
        result.needRangeChanges[key] = (result.needRangeChanges[key] || 0) + 1;
      } else if (row.event === 'interaction:complete') {
        result.completedInteractions[row.interactionName] = (result.completedInteractions[row.interactionName] || 0) + 1;
      } else if (row.event === 'ai:candidate_rejected') {
        const key = row.reason || row.candidateKind || 'unknown';
        result.rejectedCandidates[key] = (result.rejectedCandidates[key] || 0) + 1;
      } else if (row.event.startsWith('quest:')) {
        result.quests[row.event] = (result.quests[row.event] || 0) + 1;
      }
    }
    return result;
  }

  function download(charId) {
    flush();
    const payload = {
      exportedAt: new Date().toISOString(),
      watchedCharIds: [...watchedCharIds],
      records: charId ? query({ charId, limit: MAX_RECORDS }) : records,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `behavior-telemetry-${charId || 'all'}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function watch(charId, enabled = true) {
    if (enabled) watchedCharIds.add(charId);
    else watchedCharIds.delete(charId);
    saveSettings();
    return [...watchedCharIds];
  }

  function clear(charId) {
    records = charId ? records.filter(row => row.charId !== charId) : [];
    dirtyCount++;
    flush();
  }

  return {
    init,
    recordEvaluation,
    query,
    summarize,
    download,
    watch,
    clear,
    flush,
    getWatchedCharIds: () => [...watchedCharIds],
  };
})();
