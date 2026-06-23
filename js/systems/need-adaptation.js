/* ═══════════════════ NEED ADAPTATION (需求范围·性格化家具) ═══════════════════ */
const NeedAdaptationSystem = (() => {
  function cfg() {
    return CONFIG.needAdaptationConfig || DEFAULT_CONFIG.needAdaptationConfig || {};
  }

  function ensureChar(c) {
    if (!c) return;
    c.needMeta ||= {};
    c.needMeta.adaptation ||= {};
    for (const key of cfg().basicNeeds || []) {
      c.needMeta.adaptation[key] ||= {
        maxBonus: 0, minBonus: 0, highExposure: 0, lowExposure: 0,
      };
    }
  }

  function adaptation(c, key) {
    ensureChar(c);
    return c.needMeta.adaptation[key] || {
      maxBonus: 0, minBonus: 0, highExposure: 0, lowExposure: 0,
    };
  }

  function applyCoeffMods(c, coeffs) {
    ensureChar(c);
    for (const key of cfg().basicNeeds || []) {
      if (!coeffs[key]) continue;
      const row = adaptation(c, key);
      coeffs[key].max = Math.max(1, (coeffs[key].max ?? 100) + (row.maxBonus || 0));
      coeffs[key].min = Math.min(coeffs[key].max - 1, (coeffs[key].min ?? 0) + (row.minBonus || 0));
    }
    return coeffs;
  }

  function traitRules(c, needKey, category) {
    const out = [];
    for (const row of TraitEffectSystem?.effectsOf?.(c) || []) {
      const rule = row.effects.furnitureNeeds?.[needKey];
      if (!rule) continue;
      if (category && rule.categories?.length && !rule.categories.includes(category)) continue;
      out.push({ traitId: row.id, ...rule });
    }
    return out;
  }

  function makePlan(c, tpl, item) {
    if (item?._needPlan) return item._needPlan;
    const coeffs = calcNeedCoeffs(c);
    const plan = { needs: {}, rejected: false };
    for (const nr of tpl.needRestores || []) {
      const key = nr.need;
      const current = c.needs[key] ?? 0;
      const max = coeffs[key]?.max ?? 100;
      const rules = traitRules(c, key, tpl.category);
      let capMultiplier = 1;
      let restoreMultiplier = 1;
      let adaptationMultiplier = 1;
      let restoreRange = null;
      for (const rule of rules) {
        capMultiplier = Math.max(capMultiplier, rule.capMultiplier || 1);
        restoreMultiplier *= rule.restoreMultiplier || 1;
        adaptationMultiplier *= rule.adaptationMultiplier || 1;
        if (rule.restoreRange) restoreRange = rule.restoreRange;
        const ratio = current / Math.max(1, max);
        const aiUse = !!item?.aiGenerated;
        if (aiUse && rule.aiRefusalChance && ratio >= (rule.refusalAboveRatio ?? 0.7)
            && Math.random() < rule.aiRefusalChance) {
          plan.rejected = true;
          plan.reason = rule.refusalText || '现在不想用这个';
          plan.traitId = rule.traitId;
        }
      }
      const restoreLimit = restoreRange
        ? restoreRange[0] + Math.random() * Math.max(0, restoreRange[1] - restoreRange[0])
        : Infinity;
      plan.needs[key] = {
        start: current,
        baseMax: max,
        cap: max * capMultiplier,
        capMultiplier,
        restoreMultiplier,
        restoreLimit,
        restored: 0,
        adaptationMultiplier,
      };
    }
    if (item) item._needPlan = plan;
    return plan;
  }

  function prepareUse(c, tpl, item) {
    const plan = makePlan(c, tpl, item);
    if (!plan.rejected) return { ok: true, plan };
    NarrativeBubbleSystem?.showBubble?.({
      charId: c.id, text: plan.reason, style: 'exclaim', icon: '!',
      module: 'need-refusal', duration: 3, bypassLimits: true,
    });
    EventBus.emit('furniture:refused', {
      charId: c.id, templateId: item?.templateId, category: tpl.category,
      reason: plan.reason, traitId: plan.traitId,
    });
    return { ok: false, reason: plan.reason, plan };
  }

  function wouldAiRefuse(c, tpl, action) {
    if (!c || !tpl) return false;
    const effective = (typeof getFurnitureActionRuntime === 'function')
      ? getFurnitureActionRuntime(tpl, action)
      : { ...tpl, ...(action || {}), needRestores: action?.needRestores || tpl.needRestores || [] };
    const coeffs = calcNeedCoeffs(c);
    for (const nr of effective.needRestores || []) {
      const key = nr.need;
      const current = c.needs[key] ?? 0;
      const max = coeffs[key]?.max ?? 100;
      const ratio = current / Math.max(1, max);
      for (const rule of traitRules(c, key, effective.category || tpl.category)) {
        if (!rule.aiRefusalChance) continue;
        if (ratio < (rule.refusalAboveRatio ?? 0.7)) continue;
        if (rule.aiRefusalChance >= 0.5) return rule.refusalText || true;
      }
    }
    return false;
  }

  function durationFor(c, tpl, item) {
    const target = tpl.targetNeedValue;
    if (target == null || !tpl.needRestores?.length) return tpl.duration;
    const nr = tpl.needRestores[0];
    const coeff = calcNeedCoeffs(c)[nr.need] || { grow: 1 };
    const current = c.needs[nr.need] ?? 0;
    if (current >= target) return tpl.minDurationAtTarget ?? 1.5;
    const rate = (nr.ratePerGameMin ?? nr.ratePerSec ?? 0) * (coeff.grow || 1);
    if (rate <= 0) return tpl.duration;
    const seconds = (target - current) / rate / GAME_MINUTES_PER_REAL_SEC;
    return Math.max(tpl.minDurationAtTarget ?? 1.5, seconds);
  }

  function applyRestore(c, tpl, nr, rawDelta, action) {
    const plan = action?.needPlan?.needs?.[nr.need];
    if (!plan) return 0;
    const remaining = Math.max(0, plan.restoreLimit - plan.restored);
    const delta = Math.min(rawDelta * plan.restoreMultiplier, remaining);
    const old = c.needs[nr.need] ?? 0;
    c.needs[nr.need] = Math.min(plan.cap, old + delta);
    const actual = c.needs[nr.need] - old;
    plan.restored += actual;
    return actual;
  }

  function reachedTarget(c, tpl, action) {
    return (tpl.needRestores || []).every(nr => {
      const plan = action?.needPlan?.needs?.[nr.need];
      if (!plan) return false;
      if (plan.start >= plan.cap - 0.5) return false;
      return c.needs[nr.need] >= plan.cap - 0.5 || plan.restored >= plan.restoreLimit - 0.01;
    });
  }

  function recordAdaptation(c, tpl, action) {
    if (!action?.playerInitiated) return;
    ensureChar(c);
    for (const nr of tpl.needRestores || []) {
      const plan = action.needPlan?.needs?.[nr.need];
      if (!plan) continue;
      const row = adaptation(c, nr.need);
      const startRatio = plan.start / Math.max(1, plan.baseMax);
      if (startRatio >= (cfg().highUseThreshold ?? 0.85) || c.needs[nr.need] > plan.baseMax) {
        row.highExposure += plan.adaptationMultiplier || 1;
        const steps = Math.floor(row.highExposure / (cfg().exposuresPerMaxStep || 6));
        if (steps > 0) {
          const old = row.maxBonus;
          row.maxBonus = Math.min(cfg().maxBonusLimit || 20, row.maxBonus + steps * (cfg().step || 1));
          row.highExposure -= steps * (cfg().exposuresPerMaxStep || 6);
          if (row.maxBonus !== old) EventBus.emit('need:range_changed', {
            charId: c.id, needKey: nr.need, field: 'max', oldValue: old, newValue: row.maxBonus,
          });
        }
      }
      if (startRatio <= (cfg().lowUseThreshold ?? 0.25) && plan.restored > 0) {
        row.lowExposure += 1;
        const steps = Math.floor(row.lowExposure / (cfg().exposuresPerMinStep || 8));
        if (steps > 0) {
          const old = row.minBonus;
          row.minBonus = Math.min(cfg().minBonusLimit || 10, row.minBonus + steps * (cfg().step || 1));
          row.lowExposure -= steps * (cfg().exposuresPerMinStep || 8);
          if (row.minBonus !== old) EventBus.emit('need:range_changed', {
            charId: c.id, needKey: nr.need, field: 'min', oldValue: old, newValue: row.minBonus,
          });
        }
      }
      if (nr.need === 'hunger' && c.needs.hunger > plan.baseMax + 0.5) {
        CharacterEffectSystem?.apply?.({
          type: 'state', charId: c.id, stateId: 'stuffed',
        }, { source: `furniture:${tpl.category}`, reason: '吃得过饱' });
      }
    }
  }

  function tooltip(c, key) {
    const coeff = calcNeedCoeffs(c)[key] || { min: 0, max: 100 };
    const row = adaptation(c, key);
    const traits = traitRules(c, key, '')
      .map(rule => CONFIG.charSpecialtyConfig?.traitLabels?.[rule.traitId] || rule.traitId);
    const learned = row.maxBonus || row.minBonus
      ? `长期习惯：下限+${row.minBonus || 0}，上限+${row.maxBonus || 0}`
      : '长期习惯尚未改变范围';
    return `当前范围 ${Math.round(coeff.min)}-${Math.round(coeff.max)}；${learned}${traits.length ? `；性格影响：${traits.join('、')}` : ''}`;
  }

  function init() {
    CHARS.forEach(ensureChar);
  }

  return {
    init, cfg, ensureChar, applyCoeffMods, prepareUse, durationFor,
    applyRestore, reachedTarget, recordAdaptation, tooltip, traitRules, wouldAiRefuse,
  };
})();
window.NeedAdaptationSystem = NeedAdaptationSystem;
