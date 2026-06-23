/* ═══════════════════ TRAIT EFFECT SYSTEM ═══════════════════
 * 将性格 Metadata 中的结构化效果统一接入行动、需求、状态和关系系统。
 */
const TraitEffectSystem = (() => {
  const LIMITS = {
    action: [0.2, 3],
    relation: [0.25, 2.5],
    need: [0.4, 2.2],
    state: [0.35, 2.5],
    movement: [0.75, 1.25],
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function traitsOf(c) {
    return CONFIG.charSpecialtyConfig?.profiles?.[c?.id]?.aiTraits || [];
  }

  function metadata(id) {
    return CONFIG.charSpecialtyConfig?.traitMetadata?.[id] || {};
  }

  function effectsOf(c) {
    return traitsOf(c).map(id => ({ id, effects: metadata(id).effects || {} }));
  }

  function has(c, traitId) {
    return traitsOf(c).includes(traitId);
  }

  function actionTags(cand) {
    const tags = new Set(cand.tags || []);
    if (cand.kind === 'interaction') tags.add('social');
    if (cand.kind === 'wander' || cand.kind === 'seek') tags.add('movement');
    if (cand.kind === 'furniture') tags.add('indoor');
    if (cand.category === 'zhengchi') tags.add('conflict');
    if (cand.category === 'weijie') tags.add('comfort');
    if (cand.category === 'tiaoxiao' || cand.category === 'xujiu') tags.add('lively');
    if (cand.questUrgent) tags.add('taskUrgent');
    else if (cand.questRelated) tags.add('task');
    return [...tags];
  }

  function modifyActionWeight(c, cand, base = 1) {
    let factor = base;
    const tags = actionTags(cand);
    const trace = [];
    for (const row of effectsOf(c)) {
      const weights = row.effects.actionWeights || {};
      for (const tag of tags) {
        if (weights[tag] == null) continue;
        factor *= weights[tag];
        trace.push({ trait: row.id, key: tag, multiplier: weights[tag] });
      }
    }
    cand.traitEffectTrace = trace;
    return clamp(factor, LIMITS.action[0], LIMITS.action[1]);
  }

  function modifyNeedCoeffs(c, coeffs) {
    for (const row of effectsOf(c)) {
      for (const [needKey, mods] of Object.entries(row.effects.needCoeffs || {})) {
        if (!coeffs[needKey]) continue;
        for (const [key, value] of Object.entries(mods)) {
          if (['decay', 'grow'].includes(key)) {
            coeffs[needKey][key] = (coeffs[needKey][key] ?? 1) * value;
          } else {
            coeffs[needKey][key] = (coeffs[needKey][key] ?? 0) + value;
          }
        }
      }
    }
    return coeffs;
  }

  function needAttentionMultiplier(c, needKey, ratio) {
    let factor = 1;
    for (const row of effectsOf(c)) {
      const threshold = row.effects.needThresholds?.[needKey];
      if (threshold != null && ratio <= threshold) {
        factor *= 1 + clamp((threshold - ratio) / Math.max(0.1, threshold), 0, 1);
      }
    }
    return clamp(factor, LIMITS.need[0], LIMITS.need[1]);
  }

  function modifyStateDuration(c, stateId, duration) {
    if (duration < 0) return duration;
    let factor = 1;
    for (const row of effectsOf(c)) {
      const table = row.effects.stateDuration || {};
      factor *= table[stateId] ?? table['*'] ?? 1;
    }
    return Math.max(1, duration * clamp(factor, LIMITS.state[0], LIMITS.state[1]));
  }

  function stateApplyProbability(c, stateId) {
    let factor = 1;
    for (const row of effectsOf(c)) {
      const table = row.effects.stateChance || {};
      factor *= table[stateId] ?? table['*'] ?? 1;
    }
    return clamp(factor, 0.1, 1);
  }

  function stateRecoveryMultiplier(c, stateId) {
    let factor = 1;
    for (const row of effectsOf(c)) {
      const table = row.effects.stateRecovery || {};
      factor *= table[stateId] ?? table['*'] ?? 1;
    }
    return clamp(factor, LIMITS.state[0], LIMITS.state[1]);
  }

  function modifyRelationDelta(idA, idB, axis, delta, context = {}) {
    if (!delta) return delta;
    const chars = [getChar(idA), getChar(idB)].filter(Boolean);
    let factor = 1;
    for (const c of chars) {
      for (const row of effectsOf(c)) {
        const rel = row.effects.relation || {};
        let local = delta > 0
          ? (rel.positiveMultiplier ?? 1)
          : (rel.negativeMultiplier ?? 1);
        if (rel.axes?.[axis] != null) local *= rel.axes[axis];
        if (context.reason === '逾矩败露' && rel.betrayalMultiplier != null)
          local *= rel.betrayalMultiplier;
        factor *= Math.sqrt(local);
      }
    }
    return delta * clamp(factor, LIMITS.relation[0], LIMITS.relation[1]);
  }

  function movementMultiplier(c) {
    let factor = 1;
    for (const row of effectsOf(c)) {
      factor *= row.effects.movement?.speedMultiplier ?? 1;
    }
    return clamp(factor, LIMITS.movement[0], LIMITS.movement[1]);
  }

  function socialJoinMultiplier(c) {
    let factor = 1;
    for (const row of effectsOf(c)) {
      factor *= row.effects.social?.groupJoinMultiplier ?? 1;
    }
    factor *= CoreNeedSystem?.groupJoinMultiplier?.(c) ?? 1;
    return clamp(factor, 0.2, 4);
  }

  function crowdPenaltyMultiplier(c) {
    let factor = 1;
    for (const row of effectsOf(c)) {
      factor *= row.effects.social?.crowdPenaltyMultiplier ?? 1;
    }
    return clamp(factor, 0.5, 2.5);
  }

  function questWeightMultiplier(c, urgent) {
    let factor = 1;
    for (const row of effectsOf(c)) {
      const quest = row.effects.quest || {};
      factor *= urgent
        ? (quest.urgentWeightMultiplier ?? 1)
        : (quest.normalWeightMultiplier ?? quest.weightMultiplier ?? 1);
    }
    return clamp(factor, 0.35, 2.5);
  }

  function combinedMultiplier(c, group, key, min = 0.25, max = 3) {
    let factor = 1;
    for (const row of effectsOf(c)) factor *= row.effects[group]?.[key] ?? 1;
    return clamp(factor, min, max);
  }

  function memoryChanceMultiplier(c) {
    return combinedMultiplier(c, 'memory', 'chanceMultiplier', 0.25, 2);
  }

  function memoryStrengthMultiplier(c, valence = 0) {
    let factor = combinedMultiplier(c, 'memory', 'strengthMultiplier', 0.4, 2.5);
    if (valence < 0) factor *= combinedMultiplier(c, 'memory', 'negativeStrengthMultiplier', 0.5, 2);
    return clamp(factor, 0.35, 3);
  }

  function memoryDecayMultiplier(c) {
    return combinedMultiplier(c, 'memory', 'decayMultiplier', 0.4, 2.5);
  }

  function questAcceptanceChance(c, base) {
    return clamp(base * combinedMultiplier(c, 'quest', 'acceptMultiplier', 0.4, 1.8), 0.05, 0.98);
  }

  function questEarlyPrepareMinutes(c) {
    let minutes = 0;
    for (const row of effectsOf(c)) minutes = Math.max(minutes, row.effects.quest?.earlyPrepareMinutes || 0);
    return minutes;
  }

  function invitationAcceptanceChance(c, base) {
    return clamp(base * combinedMultiplier(c, 'social', 'invitationAcceptMultiplier', 0.4, 1.8), 0.05, 0.98);
  }

  function spendingProfile(c) {
    let chance = 0;
    let amountMultiplier = 1;
    const labels = [];
    for (const row of effectsOf(c)) {
      const money = row.effects.money;
      if (!money) continue;
      chance += money.spendChance || 0;
      amountMultiplier *= money.amountMultiplier || 1;
      if (money.label) labels.push(money.label);
    }
    return {
      chance: clamp(chance, 0, 0.35),
      amountMultiplier: clamp(amountMultiplier, 0.5, 2.5),
      labels,
    };
  }

  function competitionBonus(c, category) {
    let bonus = 0;
    for (const row of effectsOf(c)) {
      const competition = row.effects.competition || {};
      bonus += competition.bonus || 0;
      bonus += competition.categories?.[category] || 0;
    }
    return clamp(bonus, -30, 30);
  }

  function decisionTrace(cand) {
    return cand?.traitEffectTrace || [];
  }

  return {
    has, traitsOf, metadata, effectsOf, modifyActionWeight, modifyNeedCoeffs,
    needAttentionMultiplier, stateApplyProbability, modifyStateDuration, stateRecoveryMultiplier,
    modifyRelationDelta, movementMultiplier, socialJoinMultiplier,
    crowdPenaltyMultiplier, questWeightMultiplier, questAcceptanceChance, questEarlyPrepareMinutes,
    invitationAcceptanceChance, memoryChanceMultiplier, memoryStrengthMultiplier,
    memoryDecayMultiplier, spendingProfile, competitionBonus, decisionTrace,
  };
})();
window.TraitEffectSystem = TraitEffectSystem;
