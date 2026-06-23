/* ═══════════════════ SERVANT RELATIONS (仆从职责契约) ═══════════════════ */
const ServantRelationSystem = (() => {
  let runtime = {};

  function cfg() {
    return CONFIG.questConfig?.servantConfig || DEFAULT_CONFIG.questConfig?.servantConfig || {};
  }

  function enabled() {
    return cfg().enabled !== false;
  }

  function contracts() {
    return enabled() ? (cfg().contracts || []) : [];
  }

  function getContract(id) {
    return contracts().find(c => c.id === id) || null;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ensureRuntime(contractId) {
    if (!contractId) return null;
    runtime[contractId] ||= { loyalty: 50, grievance: 0, laborPressure: 0, completed: 0, failed: 0 };
    return runtime[contractId];
  }

  function getContractsForServant(servantId) {
    return contracts().filter(c => c.servantId === servantId);
  }

  function getContractsForMaster(masterId) {
    return contracts().filter(c => c.masterId === masterId);
  }

  function getDirectContract(masterId, servantId) {
    return contracts().find(c => c.masterId === masterId && c.servantId === servantId) || null;
  }

  function dutyRoutines() {
    return enabled() ? (cfg().dutyRoutines || []) : [];
  }

  function followRotations() {
    return enabled() ? (cfg().followRotations || []) : [];
  }

  function weekdayForDay(day) {
    return (((day || 1) - 1) % 7) + 1;
  }

  function resolveFollowRotation(rule, day = gameDay) {
    const weekday = weekdayForDay(day);
    const row = (rule.rotation || []).find(item => item.weekday === weekday);
    if (!row) return null;
    const servantId = row.servantId || row.character_id || row.charId;
    const contract = getDirectContract(rule.masterId, servantId);
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

  function todayFollowForMaster(masterId, day = gameDay) {
    return followRotations()
      .filter(rule => rule.masterId === masterId)
      .map(rule => resolveFollowRotation(rule, day))
      .filter(Boolean);
  }

  function resolveDutyRoutine(rule) {
    const contract = getContract(rule.contractId);
    if (!contract) return null;
    return {
      ...rule,
      contract,
      masterId: contract.masterId,
      charId: contract.servantId,
      dailySlotId: `servant:${contract.id}:${rule.slotId || rule.templateId}`,
    };
  }

  function categoryInScope(contract, category) {
    if (!contract) return false;
    const duties = contract.dutyCategories || [];
    return !duties.length || duties.includes(category);
  }

  function isHouseholdAuthority(issuerId, servantId) {
    const issuerRank = IdentityProtocolSystem?.getCharRank?.(issuerId) ?? 5;
    if (issuerRank <= 1) return true;
    const fam = FamilySystem?.sameFamily?.(issuerId, servantId);
    return !!fam && FamilySystem.getHeadCharId?.(fam.id) === issuerId;
  }

  function checkQuestAuthority(issuerId, servantId, tpl) {
    if (!enabled() || !issuerId || !servantId) return { ok: true, reason: '身份权限' };
    const rel = IdentityProtocolSystem?.getHierarchyRelation?.(issuerId, servantId);
    if (rel !== 'master_to_servant') return { ok: true, reason: '非主仆差遣' };

    const direct = getDirectContract(issuerId, servantId);
    if (direct) {
      if (!tpl?.category) {
        return { ok: true, reason: direct.role, contract: direct, inScope: true, authorityLevel: direct.authorityLevel };
      }
      if (!categoryInScope(direct, tpl?.category)) {
        return { ok: false, reason: `不属${direct.role}职责` };
      }
      return { ok: true, reason: direct.role, contract: direct, inScope: true, authorityLevel: direct.authorityLevel };
    }

    const assigned = getContractsForServant(servantId);
    if (!assigned.length && cfg().noContractPolicy !== 'deny') {
      return { ok: true, reason: '未配置直属职责，按身份权限处理', inScope: false, authorityLevel: cfg().defaultAuthorityLevel || 45 };
    }

    const household = assigned.find(c => c.scope === 'household'
      && isHouseholdAuthority(issuerId, servantId)
      && (!tpl?.category || categoryInScope(c, tpl.category)));
    if (household) {
      return { ok: true, reason: `${household.role}·家内调度`, contract: household, inScope: true, authorityLevel: household.authorityLevel };
    }

    return { ok: false, reason: '非直属仆从，不便越房差遣' };
  }

  function activeTaskLoad(servantId) {
    const list = QuestSystem?.getActiveForChar?.(servantId) || [];
    return list.filter(q => q.status === QUEST_STATUS.ACCEPTED || q.status === QUEST_STATUS.PENDING).length;
  }

  function acceptanceContext(issuerId, servantId, tpl) {
    const authority = checkQuestAuthority(issuerId, servantId, tpl);
    const submission = typeof getRelationAxis === 'function'
      ? getRelationAxis(servantId, issuerId, 'submission')
      : 0;
    const trust = typeof getRelationAxis === 'function'
      ? getRelationAxis(issuerId, servantId, 'trust')
      : 0;
    const affection = typeof getRelationAxis === 'function'
      ? getRelationAxis(issuerId, servantId, 'affection')
      : 0;
    const load = activeTaskLoad(servantId);
    const rt = authority.contract ? ensureRuntime(authority.contract.id) : null;
    return { ...authority, submission, trust, affection, load, servantRuntime: rt };
  }

  function questAcceptanceChance(issuerId, servantId, tpl, baseChance) {
    if (!enabled() || !issuerId || !servantId) return baseChance;
    const rel = IdentityProtocolSystem?.getHierarchyRelation?.(issuerId, servantId);
    if (rel !== 'master_to_servant') return baseChance;
    const ctx = acceptanceContext(issuerId, servantId, tpl);
    if (!ctx.ok) return Math.min(baseChance, 0.18);

    const authority = (ctx.authorityLevel ?? cfg().defaultAuthorityLevel ?? 45) / 100;
    const submission = (ctx.submission || 0) / 100;
    const trust = Math.max(-1, Math.min(1, (ctx.trust || 0) / 100));
    const affection = Math.max(-1, Math.min(1, (ctx.affection || 0) / 100));
    const dutyBonus = ctx.inScope ? (cfg().directContractBonus ?? 0.16) : 0;
    const outOfScopePenalty = ctx.inScope ? 0 : (cfg().outOfScopePenalty ?? 0.18);
    const overloadPenalty = Math.max(0, ctx.load - 1) * (cfg().overloadPenaltyPerTask ?? 0.04);
    const chance = baseChance * 0.55
      + authority * 0.22
      + submission * 0.2
      + trust * 0.08
      + affection * 0.04
      + dutyBonus
      - outOfScopePenalty
      - overloadPenalty;
    return Math.max(0.05, Math.min(0.98, chance));
  }

  function describeFor(issuerId, servantId, tpl) {
    const ctx = acceptanceContext(issuerId, servantId, tpl);
    if (!ctx.ok) return ctx.reason;
    const parts = [ctx.reason || '身份权限'];
    if (ctx.inScope) parts.push('职责内');
    if (ctx.submission != null) parts.push(`服从${Math.round(ctx.submission)}`);
    if (ctx.load > 1) parts.push(`负担${ctx.load}件`);
    if (ctx.servantRuntime?.grievance > 40) parts.push(`积怨${Math.round(ctx.servantRuntime.grievance)}`);
    if (ctx.servantRuntime?.laborPressure > 50) parts.push(`劳役${Math.round(ctx.servantRuntime.laborPressure)}`);
    return parts.join(' · ');
  }

  function requiredSkillForQuest(tpl) {
    if (tpl?.qualityRules?.requiredSkill) return tpl.qualityRules.requiredSkill;
    if ((tpl?.category || '').includes('女红')) return 'craft';
    if ((tpl?.category || '').includes('采办')) return 'trade';
    if ((tpl?.category || '').includes('功课') || (tpl?.category || '').includes('陪伴')) return 'poetry';
    if ((tpl?.category || '').includes('侍奉') || (tpl?.category || '').includes('照看')) return 'serve';
    if ((tpl?.category || '').includes('跑腿') || (tpl?.category || '').includes('传话')) return 'move';
    if ((tpl?.category || '').includes('洒扫')) return 'serve';
    return '';
  }

  function qualityBand(score) {
    const effects = cfg().qualityEffects || {};
    return Object.values(effects).sort((a, b) => b.min - a.min).find(row => score >= row.min)
      || { label: '合格', min: 0 };
  }

  function calculateQuestQuality(inst, tpl, context = {}) {
    const assignee = getChar(inst.assigneeId);
    const rules = { ...(cfg().qualityRules || {}), ...(tpl?.qualityRules || {}) };
    const skillId = requiredSkillForQuest(tpl);
    const skillLevel = skillId && typeof getSkillLevel === 'function' ? getSkillLevel(assignee, skillId) : 1;
    const submission = inst.issuerId && typeof getRelationAxis === 'function'
      ? getRelationAxis(inst.assigneeId, inst.issuerId, 'submission')
      : 0;
    const mood = assignee?.needs?.mood ?? 50;
    const energy = assignee?.needs?.energy ?? 50;
    const onTime = context.onTime !== false;
    let score = rules.base ?? 55;
    score += Math.min(5, skillLevel || 0) * (rules.skillWeight ?? 8);
    score += onTime ? (rules.punctualityBonus ?? 10) : -(rules.latePenalty ?? 25);
    score += (mood - 50) * (rules.moodWeight ?? 0.08);
    score += (energy - 50) * (rules.energyWeight ?? 0.08);
    score += (submission - 50) * (rules.submissionWeight ?? 0.16);
    if (inst.blockedReason) score -= rules.blockedPenalty ?? 10;
    score = Math.round(clamp(score, 0, 100));
    const band = qualityBand(score);
    return {
      score,
      label: band.label || '合格',
      bandMin: band.min ?? 0,
      skillId,
      skillLevel,
      mood,
      energy,
      submission,
      onTime,
    };
  }

  function applyQualityEffects(inst, quality) {
    if (!inst?.issuerId || !inst.assigneeId) return null;
    const ctx = acceptanceContext(inst.issuerId, inst.assigneeId, QuestSystem?.tpl?.(inst.templateId));
    if (!ctx.contract) return null;
    const rt = ensureRuntime(ctx.contract.id);
    const effect = qualityBand(quality.score);
    const source = `quest-quality:${inst.templateId}`;
    if (effect.trust) CharacterEffectSystem?.apply?.({
      type: 'axis', idA: inst.issuerId, idB: inst.assigneeId, axis: 'trust', delta: effect.trust,
    }, { source, reason: `任务质量：${quality.label}` });
    if (effect.affection) CharacterEffectSystem?.apply?.({
      type: 'axis', idA: inst.issuerId, idB: inst.assigneeId, axis: 'affection', delta: effect.affection,
    }, { source, reason: `任务质量：${quality.label}` });
    if (effect.submission) CharacterEffectSystem?.apply?.({
      type: 'axis', idA: inst.assigneeId, idB: inst.issuerId, axis: 'submission', delta: effect.submission,
    }, { source, reason: `任务质量：${quality.label}` });
    rt.loyalty = clamp((rt.loyalty ?? 50) + (effect.loyalty || 0), 0, 100);
    rt.grievance = clamp((rt.grievance ?? 0) + (effect.grievance || 0), 0, 100);
    rt.laborPressure = clamp((rt.laborPressure ?? 0) + (effect.laborPressure || 0), 0, 100);
    rt.completed = (rt.completed || 0) + (quality.score >= 30 ? 1 : 0);
    rt.failed = (rt.failed || 0) + (quality.score < 30 ? 1 : 0);
    EventBus.emit('servant:relation_changed', {
      contractId: ctx.contract.id,
      masterId: ctx.contract.masterId,
      servantId: ctx.contract.servantId,
      role: ctx.contract.role,
      loyalty: rt.loyalty,
      grievance: rt.grievance,
      laborPressure: rt.laborPressure,
      qualityScore: quality.score,
      qualityLabel: quality.label,
    });
    return { contract: ctx.contract, runtime: { ...rt }, effect };
  }

  function tickDay() {
    for (const rt of Object.values(runtime)) {
      rt.laborPressure = clamp((rt.laborPressure || 0) - 8, 0, 100);
      rt.grievance = clamp((rt.grievance || 0) - 1, 0, 100);
    }
  }

  function serialize() {
    return { runtime: JSON.parse(JSON.stringify(runtime)) };
  }

  function apply(state) {
    runtime = state?.runtime || {};
  }

  function init() {
    EventBus?.on?.('time:day', tickDay);
  }

  return {
    cfg, contracts, getContract, getContractsForServant, getContractsForMaster,
    getDirectContract, dutyRoutines, followRotations, resolveDutyRoutine, resolveFollowRotation,
    todayFollowForMaster,
    checkQuestAuthority, acceptanceContext,
    questAcceptanceChance, describeFor, calculateQuestQuality, applyQualityEffects,
    ensureRuntime, serialize, apply, init,
  };
})();
window.ServantRelationSystem = ServantRelationSystem;
