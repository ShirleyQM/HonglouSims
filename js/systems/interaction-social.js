/* ═══════════════════ SOCIAL INTERACTION UNLOCK & RISK ═══════════════════ */
const InteractionSocialSystem = (() => {
  const AXIS_LABELS = {
    affection: '好感', trust: '信任', friendship: '亲密', intimacy: '亲密',
    submission: '服从', score: '综合分',
  };

  function cfg() {
    return CONFIG.interactionSocialConfig || DEFAULT_CONFIG.interactionSocialConfig || {};
  }

  function relInfo(idA, idB) {
    return typeof getRelationInfo === 'function' ? getRelationInfo(idA, idB) : { score: 0, affection: 0, trust: 0, friendship: 0, initType: '' };
  }

  function axisVal(idA, idB, axis) {
    if (axis === 'score') return relInfo(idA, idB).score;
    if (axis === 'intimacy') return getRelationAxis(idA, idB, 'friendship');
    return getRelationAxis(idA, idB, axis);
  }

  function hasStatus(ch, stateId, who) {
    if (!ch?.activeStates?.length || !stateId) return false;
    return ch.activeStates.some(s => s.id === stateId);
  }

  function checkGender(initiator, target, constraint) {
    if (!constraint || constraint === 'any') return { ok: true };
    const gA = initiator.gender || '', gB = target.gender || '';
    if (constraint === 'male_female_only') {
      if (!gA || !gB) return { ok: true };
      return gA !== gB ? { ok: true } : { ok: false, reason: '需异性' };
    }
    if (constraint === 'same_gender_only') {
      if (!gA || !gB) return { ok: true };
      return gA === gB ? { ok: true } : { ok: false, reason: '需同性' };
    }
    return { ok: true };
  }

  function checkAgeRelation(initiator, target, constraint) {
    if (!constraint || constraint === 'any') return { ok: true };
    const hrel = IdentityProtocolSystem?.getHierarchyRelation?.(initiator.id, target.id) || 'peer';
    if (constraint === 'peer_only') {
      return hrel === 'peer'
        ? { ok: true }
        : { ok: false, reason: '仅平辈可用' };
    }
    if (constraint === 'senior_junior_only') {
      const seniorJunior = ['parent_to_child', 'child_to_parent', 'grandparent_to_child',
        'master_to_servant', 'servant_to_master', 'senior_servant_to_junior', 'junior_to_senior_servant'];
      return seniorJunior.includes(hrel)
        ? { ok: true }
        : { ok: false, reason: '需长幼/尊卑关系' };
    }
    return { ok: true };
  }

  function charsAdjacentToFurnitureCategory(ch, categories) {
    if (!categories?.length || !ch) return false;
    const gc = Math.round(ch.gridCol), gr = Math.round(ch.gridRow);
    const dirs = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dc, dr] of dirs) {
      const inst = typeof getInstAt === 'function' ? getInstAt(gc + dc, gr + dr) : null;
      if (!inst) continue;
      const tpl = typeof getTemplate === 'function' ? getTemplate(inst.templateId) : null;
      if (tpl && categories.includes(tpl.category)) return true;
    }
    return false;
  }

  function checkFurnitureReq(initiator, target, tpl) {
    const cats = tpl.requireFurniture || tpl.furnitureReq;
    if (!cats?.length) return { ok: true };
    const ok = charsAdjacentToFurnitureCategory(initiator, cats)
      || charsAdjacentToFurnitureCategory(target, cats);
    return ok ? { ok: true } : { ok: false, reason: `需近${cats.map(c => ({ seat: '座椅', rest: '榻', bed: '床', wardrobe: '妆台', bath: '浴具' }[c] || c)).join('/')}）` };
  }

  function checkUnlockConditions(initiator, target, tpl) {
    const uc = tpl.unlock_conditions;
    if (!uc) return { ok: true };
    const missing = [];
    const pairs = [
      ['min_score', 'score'], ['min_affection', 'affection'], ['min_trust', 'trust'],
      ['min_intimacy', 'intimacy'], ['min_friendship', 'friendship'],
    ];
    for (const [key, axis] of pairs) {
      if (uc[key] === undefined) continue;
      const have = axisVal(initiator.id, target.id, axis);
      if (have < uc[key]) missing.push({ axis, need: uc[key], have: Math.round(have) });
    }
    if (uc.require_status) {
      const st = uc.require_status;
      const on = uc.statusOn || 'target';
      const who = on === 'initiator' ? initiator : on === 'both' ? null : target;
      const ok = on === 'both'
        ? (hasStatus(initiator, st) || hasStatus(target, st))
        : hasStatus(who, st);
      if (!ok) missing.push({ axis: 'status', need: CONFIG.stateDefs[st]?.name || st, have: '无' });
    }
    if (missing.length) {
      const hint = missing.map(m => {
        if (m.axis === 'status') return `需「${m.need}」`;
        return `需${AXIS_LABELS[m.axis] || m.axis}≥${m.need}`;
      }).join('，');
      return { ok: false, reason: hint };
    }
    return { ok: true };
  }

  function countWitnesses(initiator, target, radius = 5) {
    const r = radius ?? cfg().witnessRadius ?? 5;
    return CHARS.filter(ch => {
      if (ch.id === initiator.id || ch.id === target.id) return false;
      if (ch.sceneId !== initiator.sceneId) return false;
      return Math.hypot(ch.gridCol - initiator.gridCol, ch.gridRow - initiator.gridRow) <= r;
    });
  }

  function isRomanticBond(idA, idB) {
    const ri = relInfo(idA, idB);
    return ['恋人', '夫妻'].includes(ri.initType) || ri.score >= 80;
  }

  function resolveRisk(initiator, target, tpl) {
    const riskyDefaults = IdentityProtocolSystem?.cfg?.()?.riskyDefaults
      || DEFAULT_CONFIG.identityProtocolConfig?.riskyDefaults || {};
    const rd = tpl.risky_details || {};
    let isRisky = !!tpl.is_risky;
    let behavior = 'allowed';
    let riskHint = '';

    if (tpl.contact_type && tpl.contact_type !== 'none' && IdentityProtocolSystem?.evaluateContactRisk) {
      const cr = IdentityProtocolSystem.evaluateContactRisk(initiator, target, tpl);
      behavior = cr.behavior;
      if (cr.behavior === 'forbidden') {
        return { isRisky: true, forbidden: true, reason: cr.reason || '礼法所禁', successRate: 0 };
      }
      if (cr.behavior === 'risky' || cr.behavior === 'conditional') {
        isRisky = true;
        riskHint = cr.reason || '逾矩有风险';
      }
    }

    if (!isRisky) return { isRisky: false, successRate: 1, riskHint: '' };

    let rate = rd.base_success_rate ?? riskyDefaults.base_success_rate ?? 0.55;
    if (isRomanticBond(initiator.id, target.id) && tpl.contact_type === 'kiss') rate += 0.25;

    const witnesses = countWitnesses(initiator, target);
    const penalty = rd.witness_penalty ?? riskyDefaults.witness_penalty ?? 0.15;
    rate -= witnesses.length * penalty;

    const sc = sceneAt(Math.round(initiator.gridCol), Math.round(initiator.gridRow));
    if (sc?.sceneType === 'public') rate -= 0.1;

    rate = Math.max(0.05, Math.min(0.95, rate));
    return {
      isRisky: true, forbidden: false, successRate: rate, riskHint,
      witnessCount: witnesses.length, witnesses, behavior,
      failStatus: rd.fail_status || riskyDefaults.fail_status || 'awkward',
      successStatus: rd.success_status || null,
    };
  }

  function evaluate(initiator, target, tpl) {
    const unlock = checkUnlockConditions(initiator, target, tpl);
    if (!unlock.ok) return unlock;

    const gender = checkGender(initiator, target, tpl.gender_constraint);
    if (!gender.ok) return { ok: false, reason: gender.reason, locked: true };

    const age = checkAgeRelation(initiator, target, tpl.age_constraint);
    if (!age.ok) return { ok: false, reason: age.reason, locked: true };

    const furn = checkFurnitureReq(initiator, target, tpl);
    if (!furn.ok) return { ok: false, reason: furn.reason };

    const risk = resolveRisk(initiator, target, tpl);
    if (risk.forbidden) return { ok: false, reason: risk.reason };

    return {
      ok: true,
      risky: risk.isRisky,
      riskHint: risk.riskHint,
      successRate: risk.successRate,
      riskMeta: risk,
    };
  }

  function emitRiskState(who, stateId, initiator, target, tpl, source) {
    if (!who || !stateId) return;
    applyState(who, stateId);
    EventBus.emit('interaction:state', {
      charId: who.id, stateId,
      otherId: who.id === initiator.id ? target.id : initiator.id,
      interactionId: tpl.id, interactionName: tpl.name, source: source || 'risk',
    });
  }

  function applyRiskOutcome(initiator, target, tpl, success, riskMeta) {
    const rd = tpl.risky_details || {};
    if (success) {
      const succSt = riskMeta?.successStatus || rd.success_status
        || InteractionScoreSystem?.resolveRiskSuccessState?.(initiator, target, tpl);
      if (succSt) emitRiskState(initiator, succSt, initiator, target, tpl, 'risk_success');
      if (riskMeta?.witnessCount > 0) {
        log(`⚠ 虽成功，仍有${riskMeta.witnessCount}人在旁，恐生闲话。`, 'social');
        changeAxis(initiator.id, target.id, 'trust', -2);
      }
      return true;
    }
    const failSt = InteractionScoreSystem?.resolveRiskFailState?.(initiator, target, tpl, riskMeta)
      || riskMeta?.failStatus || rd.fail_status || 'awkward';
    emitRiskState(initiator, failSt, initiator, target, tpl, 'risk_fail');
    if (riskMeta?.witnessCount > 0) {
      emitRiskState(target, 'offended', initiator, target, tpl, 'risk_witness');
      changeAxis(initiator.id, target.id, 'affection', -8);
      changeAxis(initiator.id, target.id, 'trust', -5);
      log(`⚠ ${initiator.short}对${target.short}「${tpl.name}」逾矩败露，旁人哗然！`, 'social');
      EventBus.emit('interaction:risky_fail', {
        initiatorId: initiator.id, targetId: target.id,
        interactionId: tpl.id, witnesses: riskMeta.witnesses?.map(w => w.id),
      });
    } else {
      log(`⚠ ${initiator.short}对${target.short}「${tpl.name}」逾矩，${CONFIG.stateDefs[failSt]?.name || '未果'}。`, 'social');
    }
    return false;
  }

  function sortTemplates(a, b) {
    const ra = a.risky ? 1 : 0, rb = b.risky ? 1 : 0;
    if (ra !== rb) return ra - rb;
    return (a.tpl.name || '').localeCompare(b.tpl.name || '', 'zh');
  }

  return {
    cfg, evaluate, resolveRisk, applyRiskOutcome, countWitnesses,
    checkUnlockConditions, sortTemplates, AXIS_LABELS,
  };
})();
