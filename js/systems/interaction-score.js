/* ═══════════════════ INTERACTION SCORE (综合分软锁) ═══════════════════
 * 统一 0609_02：不硬锁互动，综合分/轴/解锁不足 → onLowScore 状态反馈
 */
const InteractionScoreSystem = (() => {
  function cfg() {
    return CONFIG.interactionSocialConfig || DEFAULT_CONFIG.interactionSocialConfig || {};
  }

  function getMinScore(tpl) {
    if (tpl.minScore != null) return tpl.minScore;
    if (tpl.relMin != null) return tpl.relMin;
    const defs = cfg().categoryMinScore || {};
    if (tpl.category && defs[tpl.category] != null) return defs[tpl.category];
    return -100;
  }

  function getHierarchy(initiator, target) {
    return IdentityProtocolSystem?.getHierarchyRelation?.(initiator.id, target.id) || 'peer';
  }

  function categoryDefaultOnLowScore(category, hrel) {
    const defs = cfg().categoryOnLowScore || {};
    const base = defs[category];
    if (!base) return null;
    const overrides = cfg().hierarchyOnLowScore || {};
    const key = `${hrel}|${category}`;
    const ov = overrides[key];
    if (!ov) return base;
    return {
      effects: ov.effects || base.effects,
      axisEffects: ov.axisEffects || base.axisEffects,
    };
  }

  function resolveOnLowScore(tpl, initiator, target) {
    if (tpl.onLowScore) return tpl.onLowScore;
    const hrel = getHierarchy(initiator, target);
    if (hrel === 'servant_to_master' && tpl.category === 'zhengchi') {
      const sub = getRelationAxis(initiator.id, target.id, 'submission');
      if (sub < -50) {
        return {
          effects: [
            { system: 'state', stateId: 'punished', target: 'initiator' },
            { system: 'state', stateId: 'offended', target: 'target' },
          ],
          axisEffects: [{ axis: 'trust', delta: -5 }],
        };
      }
    }
    if (hrel === 'master_to_servant' && tpl.category === 'weijie') {
      const score = getRelationValue(initiator.id, target.id);
      if (score < 20) {
        return {
          effects: [{ system: 'state', stateId: 'selfDemeaning', target: 'target' }],
          axisEffects: [{ axis: 'submission', delta: -10, who: 'target' }],
        };
      }
    }
    return categoryDefaultOnLowScore(tpl.category, hrel);
  }

  function checkSoftLock(initiator, target, tpl) {
    const score = getRelationValue(initiator.id, target.id);
    const minScore = getMinScore(tpl);
    if (score < minScore) {
      return { soft: true, score, minScore, reason: 'score' };
    }
    const maxScore = tpl.relMax;
    if (maxScore != null && score > maxScore) {
      return { soft: true, score, minScore, maxScore, reason: 'score_high' };
    }
    if (tpl.axisReq) {
      const axisChk = checkAxisReq(initiator.id, target.id, tpl.axisReq);
      if (!axisChk.ok) {
        return { soft: true, score, minScore, reason: 'axis', axisMissing: axisChk.missing };
      }
    }
    const unlock = InteractionSocialSystem?.checkUnlockConditions?.(initiator, target, tpl);
    if (unlock && !unlock.ok) {
      return { soft: true, score, minScore, reason: 'unlock', unlockReason: unlock.reason };
    }
    return null;
  }

  function relationThresholdFactor(value, min, max) {
    if (min != null) return Math.max(0.15, Math.min(1.8, 1 + (value - min) / 50));
    if (max != null) return Math.max(0.15, Math.min(1.8, 1 + (max - value) / 50));
    return 1;
  }

  function axisValue(initiator, target, axis) {
    if (axis === 'score') return getRelationValue(initiator.id, target.id);
    if (axis === 'intimacy') return getRelationAxis(initiator.id, target.id, 'friendship');
    return getRelationAxis(initiator.id, target.id, axis);
  }

  function relationConditionFactor(initiator, target, tpl) {
    const factors = [];
    const score = axisValue(initiator, target, 'score');
    if (tpl.minScore != null) factors.push(relationThresholdFactor(score, tpl.minScore, null));
    else if (tpl.relMin != null) factors.push(relationThresholdFactor(score, tpl.relMin, null));
    if (tpl.relMax != null) factors.push(relationThresholdFactor(score, null, tpl.relMax));
    const uc = tpl.unlock_conditions || {};
    const pairs = [
      ['min_score', 'score'],
      ['min_affection', 'affection'],
      ['min_trust', 'trust'],
      ['min_friendship', 'friendship'],
      ['min_intimacy', 'intimacy'],
    ];
    for (const [key, axis] of pairs) {
      if (uc[key] == null) continue;
      factors.push(relationThresholdFactor(axisValue(initiator, target, axis), uc[key], null));
    }
    for (const [axis, cond] of Object.entries(tpl.axisReq || {})) {
      if (!cond) continue;
      factors.push(relationThresholdFactor(axisValue(initiator, target, axis), cond.min, cond.max));
    }
    if (!factors.length) return 1;
    return factors.reduce((acc, v) => acc * v, 1);
  }

  function protocolWillingness(initiator, target, tpl) {
    if (!IdentityProtocolSystem?.evaluateProtocolBehavior) {
      return { factor: 1, behavior: 'allowed', pressure: 0, witnessCount: 0 };
    }
    const protocol = IdentityProtocolSystem.evaluateProtocolBehavior(initiator, target, tpl);
    const behavior = protocol?.behavior || 'allowed';
    const basePressure = {
      allowed: 0,
      conditional: 0.24,
      risky: 0.52,
      forbidden: 0.95,
    }[behavior] ?? 0;
    const witnesses = InteractionSocialSystem?.countWitnesses?.(initiator, target) || [];
    const sc = typeof sceneAt === 'function'
      ? sceneAt(Math.round(initiator.gridCol), Math.round(initiator.gridRow))
      : null;
    const context = {
      behavior,
      category: protocol?.category || IdentityProtocolSystem.getInteractionCat?.(tpl) || tpl.category,
      relation: protocol?.rel || getHierarchy(initiator, target),
      contactType: protocol?.contactType || tpl.contact_type || 'none',
      witnessCount: witnesses.length,
      sceneType: sc?.sceneType || '',
      templateId: tpl.id,
    };
    const pressureMult = TraitEffectSystem?.protocolPressureMultiplier?.(initiator, context) || 1;
    const impulseMult = TraitEffectSystem?.protocolImpulseMultiplier?.(initiator, context) || 1;
    const witnessMult = TraitEffectSystem?.protocolWitnessMultiplier?.(initiator, context) || 1;
    const witnessPressure = Math.min(0.34, witnesses.length * 0.07 * witnessMult)
      + (sc?.sceneType === 'public' ? 0.08 * witnessMult : 0);
    const impulseRelief = Math.max(0, impulseMult - 1) * 0.26;
    const pressure = Math.max(0, basePressure * pressureMult + witnessPressure - impulseRelief);
    let factor = Math.max(0.08, Math.min(1.12, 1 - pressure));
    if (behavior === 'forbidden') factor = Math.min(factor, 0.22);
    if (behavior === 'risky') factor = Math.min(factor, 0.62);
    if (behavior === 'conditional') factor = Math.min(factor, 0.88);
    return {
      factor,
      behavior,
      pressure,
      witnessCount: witnesses.length,
      pressureMult,
      impulseMult,
      witnessMult,
      reason: protocol?.reason || '',
    };
  }

  function socialWillingness(initiator, target, tpl) {
    const categoryFactor = (typeof AiDrama !== 'undefined' && AiDrama?.socialFactor)
      ? AiDrama.socialFactor(initiator, {
      kind: 'interaction',
      category: tpl.category,
      targetCharId: target.id,
      tags: tpl.tags || [],
    }) : 1;
    const thresholdFactor = relationConditionFactor(initiator, target, tpl);
    const protocolFactor = protocolWillingness(initiator, target, tpl);
    const raw = categoryFactor * thresholdFactor * protocolFactor.factor;
    const strength = Math.max(0, Math.min(1, raw / 3));
    const factor = Math.max(0.18, Math.min(2.2, raw));
    let label = '平';
    if (strength >= 0.78) label = '高';
    else if (strength >= 0.42) label = '中';
    else if (strength >= 0.18) label = '低';
    else label = '冷';
    return { raw, strength, factor, label, categoryFactor, thresholdFactor, protocolFactor };
  }

  function lowScoreHint(tpl, initiator, target) {
    const onLow = resolveOnLowScore(tpl, initiator, target);
    const lowState = onLow?.effects?.find(e => e.system === 'state')?.stateId;
    return lowState ? (CONFIG.stateDefs[lowState]?.name || lowState) : '尴尬';
  }

  function resolveRiskSuccessState(initiator, target, tpl) {
    const rd = tpl.risky_details || {};
    if (rd.success_status) return rd.success_status;
    const hrel = getHierarchy(initiator, target);
    const cat = tpl.category;
    if (['grandparent_to_child', 'parent_to_child'].includes(hrel) && (cat === 'chuanqing' || cat === 'tiaoxiao')) {
      return 'doted';
    }
    if (cat === 'chuanqing') return 'secretCrush';
    return null;
  }

  function resolveRiskFailState(initiator, target, tpl, riskMeta) {
    const rd = tpl.risky_details || {};
    const base = riskMeta?.failStatus || rd.fail_status || cfg().riskyDefaults?.fail_status || 'awkward';
    const hrel = getHierarchy(initiator, target);
    const cat = IdentityProtocolSystem?.getInteractionCat?.(tpl) || tpl.category;
    if ((cat === '争执' || tpl.category === 'zhengchi') && ['child_to_parent', 'grandparent_to_child'].includes(hrel)) {
      return 'unfilial';
    }
    if (hrel === 'servant_to_master' && (cat === '争执' || tpl.category === 'zhengchi')) {
      return 'punished';
    }
    return base;
  }

  return {
    cfg, getMinScore, resolveOnLowScore, checkSoftLock, lowScoreHint, socialWillingness,
    resolveRiskSuccessState, resolveRiskFailState,
  };
})();
