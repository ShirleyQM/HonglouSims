/* ═══════════════════ DREAM CONDITION REGISTRY (梦想 P0：条件判定) ═══════════════════ */
const DreamConditionRegistry = (() => {
  const COUNTER_KEYS = {
    worksMin: 'works',
    praiseMin: 'praise',
    contestWinMin: 'contestWin',
    studyTasksMin: 'studyTasks',
    managedTasksMin: 'managedTasks',
    protectedEventsMin: 'protectedEvents',
    clearedNegativeSecretsMin: 'clearedNegativeSecrets',
    discoveredSecretsMin: 'discoveredSecrets',
    successfulBargainsMin: 'successfulBargains',
    craftedWorksMin: 'craftedWorks',
    praisedWorksMin: 'praisedWorks',
    workAsClueMin: 'workAsClue',
    helpedEventsMin: 'helpedEvents',
    conflictResolvedMin: 'conflictResolved',
  };
  const COUNTER_MAX_KEYS = {
    misunderstandingMax: 'misunderstanding',
    rumorMax: 'rumor',
    secretLeakMax: 'secretLeak',
    falseEvidenceMax: 'falseEvidence',
    harmfulLeaksMax: 'harmfulLeaks',
  };

  function cfg() {
    return CONFIG.charSpecialtyConfig || {};
  }

  function profileFor(charId) {
    return cfg().dreamProfiles?.[charId] || null;
  }

  function metadataFor(dreamType) {
    return cfg().dreamMetadata?.[dreamType] || null;
  }

  function makeResult(key, label, ok, value, target, source, reason, progress = null) {
    const p = progress == null
      ? (typeof value === 'number' && typeof target === 'number' && target > 0 ? Math.max(0, Math.min(1, value / target)) : (ok ? 1 : 0))
      : progress;
    return { key, label, ok: !!ok, value, target, progress: p, source, reason };
  }

  function normalizeConditions(rawConditions = {}) {
    return Object.entries(rawConditions || {}).map(([key, value]) => ({ key, value }));
  }

  function familyOf(c) {
    return FamilySystem?.findFamilyOfChar?.(c?.id) || null;
  }

  function safeRelationValue(idA, idB) {
    return typeof getRelationValue === 'function' ? getRelationValue(idA, idB) : 0;
  }

  function safeRelationAxis(idA, idB, axis) {
    return typeof getRelationAxis === 'function' ? getRelationAxis(idA, idB, axis) : 0;
  }

  function safeRelationInfo(idA, idB) {
    if (SocialContextSystem?.relationFacet) return SocialContextSystem.relationFacet(idA, idB);
    return typeof getRelationInfo === 'function' ? getRelationInfo(idA, idB) : null;
  }

  function safeRank(charId) {
    if (IdentityProtocolSystem?.getCharRank) return IdentityProtocolSystem.getCharRank(charId);
    return (typeof getCharDef === 'function' ? getCharDef(charId)?.socialRank : null) ?? 2;
  }

  function relationTargets(c, context = {}) {
    const ids = [
      context.targetCharId,
      ...(context.targetCharIds || []),
      ...(profileFor(c.id)?.targetCharIds || []),
      profileFor(c.id)?.targetCharId,
      ...(profileFor(c.id)?.keyRelations || []).map(r => r.targetId),
      ...(profileFor(c.id)?.protectedTargetIds || []),
      ...(profileFor(c.id)?.witnessIds || []),
    ].filter(Boolean);
    return [...new Set(ids)];
  }

  function bestRelationValue(c, axis, targets = []) {
    const ids = targets.length ? targets : (CHARS || []).filter(x => x.id !== c.id).map(x => x.id);
    let best = -100;
    let bestId = '';
    for (const id of ids) {
      const val = axis
        ? safeRelationAxis(c.id, id, axis)
        : safeRelationValue(c.id, id);
      if (val > best) { best = val; bestId = id; }
    }
    return { value: Math.round(best), targetId: bestId };
  }

  function elderIds(c) {
    const out = [];
    for (const other of CHARS || []) {
      if (other.id === c.id) continue;
      const info = safeRelationInfo(c.id, other.id);
      const initType = info?.initType || '';
      const rank = safeRank(other.id);
      const myRank = safeRank(c.id);
      if (/父|母|祖|长辈|婆媳|翁/.test(initType) || rank < myRank) out.push(other.id);
    }
    return [...new Set(out)];
  }

  function simpleAuthority(c) {
    const fam = familyOf(c);
    const role = fam ? FamilySystem.getCharRole(c.id, fam.id) : '';
    const roleBase = { 家主: 55, 配偶: 45, 长辈: 40, 子女: 25, 手足: 25, 仆从: 15, 门客: 12 }[role] ?? 18;
    const rank = safeRank(c.id);
    const rankBonus = Math.max(0, (6 - rank) * 5);
    const managed = Math.min(20, DreamProgressStore?.getCounter?.(c.id, 'managedTasks') * 3 || 0);
    const repRaw = ReputationDomainSystem?.getIdentityReputation?.(c.id)?.value ?? c.reputation ?? 0;
    const rep = Math.max(0, Math.min(15, repRaw / 10));
    return Math.round(Math.max(0, Math.min(100, roleBase + rankBonus + managed + rep)));
  }

  function reputationDomainForDream(c, context = {}) {
    if (context.reputationDomain) return context.reputationDomain;
    const dreamType = profileFor(c.id)?.type;
    const meta = metadataFor(dreamType);
    if (meta?.conditions?.reputationDomain) return meta.conditions.reputationDomain;
    const map = {
      official_merit: 'official',
      poetry_fame: 'scholarly',
      household_power: 'family',
      artisan_mastery: 'scholarly',
      commercial_success: 'outside',
      quiet_reclusion: 'family',
      righteous_protection: 'servant',
    };
    if (map[dreamType]) return map[dreamType];
    const career = ReputationDomainSystem?.getCareerDomains?.(c.id) || [];
    return career[0] || 'general';
  }

  function resentmentScore(c) {
    let score = 0;
    for (const other of CHARS || []) {
      if (other.id === c.id) continue;
      const val = safeRelationValue(c.id, other.id);
      if (val < 0) score += Math.min(20, Math.abs(val) / 3);
    }
    score += (DreamProgressStore?.getCounter?.(c.id, 'rumor') || 0) * 10;
    return Math.round(Math.min(100, score));
  }

  function coreFamilyMemberIds(c) {
    const fam = familyOf(c);
    if (!fam) return [c.id];
    return (fam.coreMemberIds || fam.members?.filter(m => ['家主', '配偶', '长辈', '子女', '手足'].includes(m.role)).map(m => m.charId) || [])
      .filter(id => getChar(id));
  }

  function evaluateCondition(char, condition, context = {}) {
    const c = typeof char === 'string' ? getChar(char) : char;
    if (!c || !condition?.key) return makeResult(condition?.key || '', '未知条件', false, null, condition?.value, 'unknown', '人物或条件不存在', 0);
    const { key, value } = condition;
    if (key === 'moneyMin' || key === 'familyFundMin') {
      const fam = familyOf(c);
      const fund = fam ? FamilySystem.getFund(fam.id) : 0;
      return makeResult(key, `家庭公账不低于 ${value}`, fund >= value, fund, value, 'FamilySystem', `当前公账 ${fund}`);
    }
    if (key === 'personalMoneyMin') {
      const money = MoneySystem?.getBalance?.(c) ?? c.money ?? 0;
      return makeResult(key, `个人银两不低于 ${value}`, money >= value, money, value, 'MoneySystem', `当前个人银两 ${money}`);
    }
    if (key === 'disasterFreeDays') {
      const days = BehaviorDailyStats?.disasterFreeDays?.(value) ?? 0;
      return makeResult(key, `连续 ${value} 日无大祸`, days >= value, days, value, 'BehaviorDailyStats', `已连续 ${days} 日`);
    }
    if (key === 'sickCoreMembersMax') {
      const sick = coreFamilyMemberIds(c).filter(id => HealthSystem?.isSick?.(id)).length;
      return makeResult(key, `核心亲眷生病不超过 ${value} 人`, sick <= value, sick, value, 'HealthSystem', `当前 ${sick} 人`, value === 0 ? (sick === 0 ? 1 : 0) : Math.max(0, 1 - sick / Math.max(1, value)));
    }
    if (COUNTER_KEYS[key]) {
      const counter = DreamProgressStore?.getCounter?.(c.id, COUNTER_KEYS[key]) || 0;
      return makeResult(key, `${COUNTER_KEYS[key]} 不少于 ${value}`, counter >= value, counter, value, 'DreamProgressStore', `当前计数 ${counter}`);
    }
    if (COUNTER_MAX_KEYS[key]) {
      const counter = DreamProgressStore?.getCounter?.(c.id, COUNTER_MAX_KEYS[key]) || 0;
      return makeResult(key, `${COUNTER_MAX_KEYS[key]} 不超过 ${value}`, counter <= value, counter, value, 'DreamProgressStore', `当前计数 ${counter}`, value === 0 ? (counter === 0 ? 1 : 0) : Math.max(0, 1 - counter / Math.max(1, value)));
    }
    if (key === 'relationMin') {
      const axis = context.relationAxis || metadataFor(profileFor(c.id)?.type)?.conditions?.relationAxis;
      const best = bestRelationValue(c, axis, relationTargets(c, context));
      return makeResult(key, `${axis || '综合关系'}不低于 ${value}`, best.value >= value, best.value, value, 'RelationSystem', `最高对象 ${getChar(best.targetId)?.short || best.targetId || '无'}：${best.value}`);
    }
    if (key === 'relationAxis') {
      return makeResult(key, `关系轴 ${value}`, true, value, value, 'DreamConditionRegistry', '轴声明条件');
    }
    if (key === 'elderTrustMin') {
      const best = bestRelationValue(c, 'trust', elderIds(c));
      return makeResult(key, `长辈信任不低于 ${value}`, best.value >= value, best.value, value, 'RelationSystem', `最高长辈 ${getChar(best.targetId)?.short || best.targetId || '无'}：${best.value}`);
    }
    if (key === 'witnessTrustMin') {
      const best = bestRelationValue(c, 'trust', relationTargets(c, context));
      return makeResult(key, `证人信任不低于 ${value}`, best.value >= value, best.value, value, 'RelationSystem', `最高证人信任 ${best.value}`);
    }
    if (key === 'reputationMin') {
      const domain = reputationDomainForDream(c, context);
      const rep = ReputationDomainSystem?.get?.(c.id, domain) ?? c.reputation ?? 0;
      const label = ReputationDomainSystem?.domainLabel?.(domain) || '声望';
      return makeResult(key, `${label}不低于 ${value}`, rep >= value, rep, value, 'ReputationDomainSystem', `当前${label} ${rep}`);
    }
    if (key === 'reputationDomainMin') {
      const domain = condition.domain || context.reputationDomain || 'general';
      const rep = ReputationDomainSystem?.get?.(c.id, domain) ?? c.reputation ?? 0;
      const label = ReputationDomainSystem?.domainLabel?.(domain) || domain;
      return makeResult(key, `${label}不低于 ${value}`, rep >= value, rep, value, 'ReputationDomainSystem', `当前${label} ${rep}`);
    }
    if (key === 'authorityMin') {
      const authority = simpleAuthority(c);
      return makeResult(key, `掌家权不低于 ${value}`, authority >= value, authority, value, 'DreamConditionRegistry', `P0 简化掌家权 ${authority}`);
    }
    if (key === 'moodMin' || key === 'hungerMin' || key === 'energyMin') {
      const needKey = key.replace('Min', '');
      const current = c.needs?.[needKey] ?? 0;
      const dailyMin = BehaviorDailyStats?.getDay?.(c.id, gameDay)?.needMin?.[needKey];
      const actual = Math.round(Math.min(current, dailyMin ?? current));
      return makeResult(key, `${needKey} 不低于 ${value}`, actual >= value, actual, value, 'BehaviorDailyStats', `今日最低 ${actual}`);
    }
    if (key === 'targetMoodMin') {
      const ids = relationTargets(c, context);
      const values = ids.map(id => getChar(id)?.needs?.mood).filter(v => v != null);
      const actual = values.length ? Math.min(...values) : 0;
      return makeResult(key, `守护对象心绪不低于 ${value}`, actual >= value, Math.round(actual), value, 'NeedSystem', `对象最低心绪 ${Math.round(actual)}`);
    }
    if (key === 'solitudeDaysMin') {
      const days = BehaviorDailyStats?.countFlagDays?.(c.id, 'solitudeDay', Math.max(value, 7)) || 0;
      return makeResult(key, `清净独处日不少于 ${value}`, days >= value, days, value, 'BehaviorDailyStats', `近期 ${days} 日`);
    }
    if (key === 'funDaysMin') {
      const days = BehaviorDailyStats?.countFlagDays?.(c.id, 'funSatisfiedDay', Math.max(value, 7)) || 0;
      return makeResult(key, `娱乐达标日不少于 ${value}`, days >= value, days, value, 'BehaviorDailyStats', `近期 ${days} 日`);
    }
    if (key === 'visitedScenesMin') {
      const count = BehaviorDailyStats?.getVisitedSceneCount?.(c.id, 30) || 0;
      return makeResult(key, `参观场景不少于 ${value}`, count >= value, count, value, 'BehaviorDailyStats', `已访问 ${count} 处`);
    }
    if (key === 'healthMin') {
      const h = HealthSystem?.getHealth?.(c.id) ?? 100;
      return makeResult(key, `健康不低于 ${value}`, h >= value, h, value, 'HealthSystem', `当前健康 ${h}`);
    }
    if (key === 'sickDaysMax') {
      const days = HealthSystem?.getSickDays?.(c.id, 30) || 0;
      return makeResult(key, `生病天数不超过 ${value}`, days <= value, days, value, 'HealthSystem', `近 30 日生病 ${days} 天`, value === 0 ? (days === 0 ? 1 : 0) : Math.max(0, 1 - days / Math.max(1, value)));
    }
    if (key === 'debtMax') {
      const debt = c.debt || 0;
      return makeResult(key, `债务不超过 ${value}`, debt <= value, debt, value, 'MoneySystem', `P0 债务 ${debt}`);
    }
    if (key === 'resentmentMax') {
      const score = resentmentScore(c);
      return makeResult(key, `积怨不超过 ${value}`, score <= value, score, value, 'RelationSystem', `P0 积怨 ${score}`);
    }
    return makeResult(key, key, false, null, value, 'unknown', 'P0 尚未实现该条件', 0);
  }

  function evaluateDream(charId, dreamType = profileFor(charId)?.type) {
    const c = getChar(charId);
    const meta = metadataFor(dreamType);
    if (!c || !dreamType || !meta) {
      return { charId, dreamType, ok: false, progressScore: 0, met: [], unmet: [], unknown: [{ key: 'dream', reason: '未配置梦想' }] };
    }
    const context = { relationAxis: meta.conditions?.relationAxis };
    const results = normalizeConditions(meta.conditions || {}).map(cond => evaluateCondition(c, cond, context));
    const met = results.filter(row => row.ok);
    const unmet = results.filter(row => !row.ok && row.source !== 'unknown');
    const unknown = results.filter(row => row.source === 'unknown');
    const progressScore = results.length
      ? Math.round(results.reduce((sum, row) => sum + (row.progress || 0), 0) / results.length * 100) / 100
      : 0;
    return {
      charId, dreamType, label: meta.label || dreamType,
      ok: results.length > 0 && unmet.length === 0 && unknown.length === 0,
      progressScore, met, unmet, unknown,
      results,
    };
  }

  function describeCondition(condition) {
    return `${condition.key}: ${condition.value}`;
  }

  return {
    normalizeConditions,
    evaluateCondition,
    evaluateDream,
    describeCondition,
  };
})();
window.DreamConditionRegistry = DreamConditionRegistry;
