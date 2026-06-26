/* ═══════════════════ INTERACTION FAILURE DEPTH ═══════════════════
 * 低分/逾矩失败不再只是重复冷场：
 * - 同一发起人对同一对象、同类互动失败会积累 heat。
 * - heat/次数提高后，文案升级、状态加重、关系下降，并可能由对象主动回怼/争执。
 * - 成功互动会消减失败热度。
 */
const InteractionDepthSystem = (() => {
  const FALLBACK_CONFIG = {
    enabled: true,
    decayGameMin: 240,
    escalationCooldownGameMin: 45,
    heat: {
      low_score: 18,
      risk_fail: 28,
      witnessedBonus: 10,
      publicBonus: 8,
      successReduce: 0.45,
    },
    statusHeatModifiers: {
      target: {
        angry: 16,
        offended: 14,
        awkward: 6,
        heartbroken: 8,
        sullenAnger: 14,
        ganshang: 8,
        chikuang: 12,
        selfDemeaning: 8,
        joyful: -6,
        elated: -8,
        teaHeart: -6,
        tipsySocial: -4,
        secretCrush: -4,
      },
      initiator: {
        angry: 8,
        awkward: 4,
        heartbroken: 6,
        sullenAnger: 8,
        ganshang: 4,
        chikuang: 10,
        tipsySocial: 5,
      },
    },
    levels: [
      {
        id: 'mild',
        label: '冷场',
        minCount: 1,
        minHeat: 0,
        states: [{ target: 'initiator', stateId: 'awkward', prob: 0.35 }],
        lines: {
          low_score: [
            '{B}只淡淡一笑，并不接这话。',
            '{B}低头理了理袖口，像没听见。',
            '{B}道：「这话先不必说了。」',
          ],
          risk_fail: [
            '{B}微微避开，场面顿时有些尴尬。',
            '{B}退了半步，没有接下这份亲近。',
            '{B}神色一冷，叫{A}一时说不出话。',
          ],
        },
      },
      {
        id: 'annoyed',
        label: '不悦',
        minCount: 2,
        minHeat: 30,
        states: [
          { target: 'target', stateId: 'offended', prob: 0.35 },
          { target: 'target', stateId: 'sullenAnger', prob: 0.3 },
          { target: 'initiator', stateId: 'heartbroken', prob: 0.25, categories: ['chuanqing'] },
        ],
        axisEffects: [{ axis: 'affection', delta: -1 }],
        lines: {
          low_score: [
            '{B}皱眉道：「怎么又说这个？」',
            '{B}脸上的笑淡了：「你今日有些没分寸。」',
            '{B}把话截住：「够了，不必再试探我。」',
          ],
          risk_fail: [
            '{B}脸色沉了下来：「这不是你该做的。」',
            '{B}避开得更明显了，语气也冷了几分。',
            '{B}低声道：「再这样，旁人瞧见像什么？」',
          ],
        },
      },
      {
        id: 'retort',
        label: '回怼',
        minCount: 3,
        minHeat: 54,
        states: [
          { target: 'target', stateId: 'sullenAnger', prob: 0.55 },
          { target: 'target', stateId: 'angry', prob: 0.25 },
          { target: 'initiator', stateId: 'heartbroken', prob: 0.35, categories: ['chuanqing'] },
        ],
        axisEffects: [
          { axis: 'affection', delta: -2 },
          { axis: 'trust', delta: -1 },
        ],
        escalation: {
          type: 'force_interaction',
          templateIds: [601],
          probability: 0.45,
          cooldownGameMin: 45,
          onlyAiTarget: true,
        },
        lines: {
          low_score: [
            '{B}冷笑一声：「你倒会自说自话。」',
            '{B}抬眼看向{A}：「你是真不懂，还是故意的？」',
            '{B}不再忍让：「这话我不爱听。」',
          ],
          risk_fail: [
            '{B}立刻甩开，压着火道：「放尊重些。」',
            '{B}眼神一厉：「你再试试？」',
            '{B}退开一步：「你若再这样，我可不客气了。」',
          ],
        },
      },
      {
        id: 'public_heat',
        label: '被人瞧见',
        minCount: 3,
        minHeat: 68,
        witnessedOnly: true,
        states: [
          { target: 'initiator', stateId: 'awkward', prob: 0.65 },
          { target: 'target', stateId: 'sullenAnger', prob: 0.55 },
          { target: 'target', stateId: 'offended', prob: 0.5 },
        ],
        axisEffects: [
          { axis: 'affection', delta: -3 },
          { axis: 'trust', delta: -2 },
        ],
        lines: {
          low_score: [
            '{B}看了一眼旁人，语气更冷：「别在这里说这些。」',
            '旁人似乎也听见了，{B}的脸色顿时难看起来。',
          ],
          risk_fail: [
            '旁人目光扫来，{B}立刻退开：「你疯了吗？」',
            '{B}又羞又恼，低声斥道：「这么多人看着！」',
          ],
        },
      },
      {
        id: 'severe',
        label: '冲突',
        minCount: 5,
        minHeat: 92,
        states: [
          { target: 'target', stateId: 'sullenAnger', prob: 0.8 },
          { target: 'target', stateId: 'angry', prob: 0.75 },
          { target: 'initiator', stateId: 'awkward', prob: 0.5 },
          { target: 'initiator', stateId: 'heartbroken', prob: 0.55, categories: ['chuanqing'] },
        ],
        axisEffects: [
          { axis: 'affection', delta: -5 },
          { axis: 'trust', delta: -3 },
        ],
        escalation: {
          type: 'force_interaction',
          templateIds: [604, 603, 601],
          probability: 0.55,
          cooldownGameMin: 60,
          onlyAiTarget: true,
        },
        lines: {
          low_score: [
            '{B}终于动了真火：「你还要纠缠到什么时候？」',
            '{B}忍无可忍：「再说一句，我便真翻脸了。」',
          ],
          risk_fail: [
            '{B}气得发抖：「你欺人太甚！」',
            '{B}再不退让，径直顶了回去。',
          ],
        },
      },
    ],
  };

  const records = new Map();

  function cfg() {
    const src = (typeof CONFIG !== 'undefined' && CONFIG.interactionDepthConfig)
      || (typeof DEFAULT_CONFIG !== 'undefined' && DEFAULT_CONFIG.interactionDepthConfig)
      || {};
    return {
      ...FALLBACK_CONFIG,
      ...src,
      heat: { ...FALLBACK_CONFIG.heat, ...(src.heat || {}) },
      statusHeatModifiers: {
        target: {
          ...FALLBACK_CONFIG.statusHeatModifiers.target,
          ...(src.statusHeatModifiers?.target || {}),
        },
        initiator: {
          ...FALLBACK_CONFIG.statusHeatModifiers.initiator,
          ...(src.statusHeatModifiers?.initiator || {}),
        },
      },
      levels: Array.isArray(src.levels) && src.levels.length ? src.levels : FALLBACK_CONFIG.levels,
    };
  }

  function nowGameMin() {
    if (typeof getGameTimestamp === 'function') return getGameTimestamp();
    return Math.floor(Date.now() / 60000);
  }

  function keyFor(initiator, target, tpl) {
    const group = tpl?.category || tpl?.id || 'unknown';
    return `${initiator?.id || 'unknown'}|${target?.id || 'unknown'}|${group}`;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function decayRecord(rec, conf, now) {
    const elapsed = Math.max(0, now - (rec.lastAt || now));
    if (!elapsed) return;
    if (elapsed >= (conf.decayGameMin || 240)) {
      rec.count = 0;
      rec.heat = 0;
      return;
    }
    rec.heat = Math.max(0, rec.heat - elapsed / (conf.decayGameMin || 240) * 24);
  }

  function resolveLevel(rec, conf, context) {
    let picked = conf.levels[0] || FALLBACK_CONFIG.levels[0];
    for (const level of conf.levels || []) {
      if (level.witnessedOnly && !context.witnessed) continue;
      const minCount = level.minCount ?? 1;
      const minHeat = level.minHeat ?? 0;
      if (rec.count >= minCount || rec.heat >= minHeat) picked = level;
    }
    return picked;
  }

  function pick(pool) {
    if (!Array.isArray(pool) || !pool.length) return '';
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function formatLine(text, initiator, target, tpl, rec) {
    return String(text || '')
      .replace(/\{A\}/g, initiator?.short || initiator?.name || '')
      .replace(/\{B\}/g, target?.short || target?.name || '')
      .replace(/\{interaction\}/g, tpl?.name || '')
      .replace(/\{category\}/g, tpl?.category || '')
      .replace(/\{count\}/g, String(rec?.count || 0));
  }

  function templateLinePools(tpl, mode, rec, context) {
    const pools = [];
    if (mode === 'risk_fail') {
      const rd = tpl?.risky_details || {};
      if (context.witnessed && rd.witnessed_fail_lines) pools.push(rd.witnessed_fail_lines);
      if ((rec?.count || 0) > 1 && rd.repeat_fail_lines) pools.push(rd.repeat_fail_lines);
      if (rd.fail_lines) pools.push(rd.fail_lines);
    } else {
      const low = tpl?.onLowScore || {};
      if ((rec?.count || 0) > 1 && low.repeatLines) pools.push(low.repeatLines);
      if (low.lines) pools.push(low.lines);
    }
    return pools;
  }

  function activeStateIds(c) {
    return Array.isArray(c?.activeStates) ? c.activeStates.map(s => s?.id).filter(Boolean) : [];
  }

  function stateName(stateId) {
    return (typeof CONFIG !== 'undefined' && CONFIG.stateDefs?.[stateId]?.name) || stateId;
  }

  function statusHeatFor(c, role, conf) {
    const table = conf.statusHeatModifiers?.[role] || {};
    const matched = [];
    let delta = 0;
    for (const stateId of activeStateIds(c)) {
      if (table[stateId] == null) continue;
      const v = Number(table[stateId]) || 0;
      delta += v;
      matched.push({ stateId, name: stateName(stateId), delta: v });
    }
    return { delta: clamp(delta, -24, 36), matched };
  }

  function lineFor(initiator, target, tpl, context = {}) {
    const conf = cfg();
    const key = keyFor(initiator, target, tpl);
    const rec = records.get(key) || { count: 1, heat: 0 };
    const level = context.level || resolveLevel(rec, conf, context);
    const mode = context.mode || 'low_score';
    const pools = [
      ...templateLinePools(tpl, mode, rec, context),
      level?.lines?.[mode],
      level?.lines?.default,
    ];
    for (const pool of pools) {
      const text = pick(pool);
      if (text) return formatLine(text, initiator, target, tpl, rec);
    }
    return '';
  }

  function resolveWho(effect, initiator, target) {
    if (effect.target === 'initiator') return initiator;
    if (effect.target === 'both') return null;
    return target;
  }

  function applyDepthState(who, stateId, initiator, target, tpl, level) {
    if (!who || !stateId) return;
    const ctx = {
      source: `interaction-depth:${tpl?.id || 'unknown'}`,
      reason: level?.label || '互动失败升级',
      otherId: who.id === initiator.id ? target.id : initiator.id,
    };
    if (typeof CharacterEffectSystem === 'object' && CharacterEffectSystem?.apply) {
      CharacterEffectSystem.apply({ type: 'state', charId: who.id, stateId }, ctx);
    } else if (typeof applyState === 'function') {
      applyState(who, stateId);
    }
  }

  function applyDepthAxis(ae, initiator, target, tpl, level) {
    if (!ae?.axis || !ae.delta) return;
    let idA = initiator.id;
    let idB = target.id;
    if (ae.axis === 'submission' && ae.who === 'target') {
      idA = target.id;
      idB = initiator.id;
    }
    const ctx = { source: `interaction-depth:${tpl?.id || 'unknown'}`, reason: level?.label || '互动失败升级' };
    if (typeof CharacterEffectSystem === 'object' && CharacterEffectSystem?.apply) {
      CharacterEffectSystem.apply({ type: 'axis', idA, idB, axis: ae.axis, delta: ae.delta }, ctx);
    } else if (typeof changeAxis === 'function') {
      changeAxis(idA, idB, ae.axis, ae.delta, ctx);
    }
  }

  function effectMatches(effect, tpl, context) {
    if (effect.modes?.length && !effect.modes.includes(context.mode)) return false;
    if (effect.categories?.length && !effect.categories.includes(tpl?.category)) return false;
    if (effect.minHeat != null && (context.heat || 0) < effect.minHeat) return false;
    if (effect.minCount != null && (context.count || 0) < effect.minCount) return false;
    if (effect.witnessedOnly && !context.witnessed) return false;
    if (effect.publicOnly && !context.publicScene) return false;
    return true;
  }

  function applyLevelEffects(level, initiator, target, tpl, context = {}) {
    for (const st of level?.states || []) {
      if (!effectMatches(st, tpl, context)) continue;
      if (Math.random() > (st.prob ?? 1)) continue;
      const who = resolveWho(st, initiator, target);
      const targets = who ? [who] : [initiator, target];
      for (const c of targets) applyDepthState(c, st.stateId, initiator, target, tpl, level);
    }
    for (const ae of level?.axisEffects || []) {
      if (!effectMatches(ae, tpl, context)) continue;
      if (Math.random() > (ae.prob ?? 1)) continue;
      applyDepthAxis(ae, initiator, target, tpl, level);
    }
  }

  function existingTemplate(ids) {
    for (const id of ids || []) {
      const tpl = (typeof getInteractionTemplate === 'function')
        ? getInteractionTemplate(id)
        : (typeof CONFIG !== 'undefined' ? CONFIG.interactionTemplates?.[id] : null);
      if (tpl) return tpl;
    }
    return null;
  }

  function maybeEscalate(level, rec, initiator, target, tpl, conf, now) {
    const esc = level?.escalation;
    if (!esc || esc.type !== 'force_interaction') return null;
    if (Math.random() > (esc.probability ?? 1)) return null;
    const cooldown = esc.cooldownGameMin ?? conf.escalationCooldownGameMin ?? 45;
    if (rec.lastEscalationAt && now - rec.lastEscalationAt < cooldown) return null;
    if (esc.onlyAiTarget && typeof isAIControlled === 'function' && !isAIControlled(target)) return null;
    if (!initiator || !target || initiator.sceneId !== target.sceneId) return null;
    const forceTpl = existingTemplate(esc.templateIds || [esc.templateId || esc.interactionTemplateId]);
    if (!forceTpl) return null;

    rec.lastEscalationAt = now;
    setTimeout(() => {
      if (typeof makeInteractionItem !== 'function' || typeof enqueueAction !== 'function') return;
      if (!target || !initiator || target.sceneId !== initiator.sceneId) return;
      const item = makeInteractionItem(target, initiator, forceTpl);
      item.aiGenerated = true;
      item.depthEscalation = true;
      enqueueAction(target, item, true);
      if (typeof setAIState === 'function' && typeof AI_STATE !== 'undefined') {
        setAIState(target, AI_STATE.EXECUTING);
      }
      if (typeof log === 'function') log(`${target.short}被反复冒犯，主动发起「${forceTpl.name}」。`, 'social');
      if (typeof uiDirty !== 'undefined') uiDirty = true;
      if (typeof EventBus !== 'undefined' && EventBus?.emit) {
        EventBus.emit('interaction:failure_escalated', {
          initiatorId: initiator.id,
          targetId: target.id,
          responderId: target.id,
          interactionId: tpl?.id,
          escalationInteractionId: forceTpl.id,
          levelId: level.id,
        });
      }
    }, esc.delayMs ?? 650);

    return { type: 'force_interaction', templateId: forceTpl.id, responderId: target.id };
  }

  function isPublicScene(initiator) {
    if (typeof sceneAt !== 'function' || !initiator) return false;
    const sc = sceneAt(Math.round(initiator.gridCol || 0), Math.round(initiator.gridRow || 0));
    return sc?.sceneType === 'public';
  }

  function recordFailure(initiator, target, tpl, context = {}) {
    const conf = cfg();
    if (conf.enabled === false || !initiator || !target || !tpl) return null;
    const now = nowGameMin();
    const key = keyFor(initiator, target, tpl);
    const rec = records.get(key) || {
      key,
      initiatorId: initiator.id,
      targetId: target.id,
      category: tpl.category || '',
      count: 0,
      heat: 0,
      templateCounts: {},
      lastAt: now,
    };
    decayRecord(rec, conf, now);

    const mode = context.mode || 'low_score';
    const witnessed = !!(context.witnessed || context.witnessCount > 0);
    const publicScene = context.publicScene ?? isPublicScene(initiator);
    const initiatorStatus = statusHeatFor(initiator, 'initiator', conf);
    const targetStatus = statusHeatFor(target, 'target', conf);
    const statusHeat = clamp(initiatorStatus.delta + targetStatus.delta, -28, 42);
    let addHeat = conf.heat?.[mode] ?? conf.heat?.low_score ?? 18;
    if (witnessed) addHeat += conf.heat?.witnessedBonus ?? 0;
    if (publicScene) addHeat += conf.heat?.publicBonus ?? 0;
    addHeat = Math.max(4, addHeat + statusHeat);

    rec.count += 1;
    rec.heat = clamp((rec.heat || 0) + addHeat, 0, 120);
    rec.lastAt = now;
    rec.lastTemplateId = tpl.id;
    rec.lastMode = mode;
    rec.templateCounts[tpl.id] = (rec.templateCounts[tpl.id] || 0) + 1;
    records.set(key, rec);

    const statusContext = {
      heatDelta: statusHeat,
      initiator: initiatorStatus.matched,
      target: targetStatus.matched,
    };
    const depthContext = {
      ...context,
      witnessed,
      publicScene,
      mode,
      statusContext,
      count: rec.count,
      heat: rec.heat,
    };
    const level = resolveLevel(rec, conf, depthContext);
    const line = lineFor(initiator, target, tpl, { ...depthContext, level });
    applyLevelEffects(level, initiator, target, tpl, { ...depthContext, level });
    const escalation = maybeEscalate(level, rec, initiator, target, tpl, conf, now);

    const outcome = {
      key,
      mode,
      count: rec.count,
      heat: Math.round(rec.heat),
      levelId: level?.id || 'mild',
      label: level?.label || '冷场',
      line,
      witnessed,
      publicScene,
      statusHeat: statusContext,
      escalation,
    };

    if (typeof EventBus !== 'undefined' && EventBus?.emit) {
      EventBus.emit('interaction:failure_depth', {
        initiatorId: initiator.id,
        targetId: target.id,
        interactionId: tpl.id,
        category: tpl.category,
        ...outcome,
      });
    }
    return outcome;
  }

  function recordSuccess(initiator, target, tpl) {
    const conf = cfg();
    if (conf.enabled === false || !initiator || !target || !tpl) return null;
    const key = keyFor(initiator, target, tpl);
    const rec = records.get(key);
    if (!rec) return null;
    rec.count = Math.max(0, (rec.count || 0) - 1);
    rec.heat = Math.max(0, (rec.heat || 0) * (conf.heat?.successReduce ?? 0.45));
    rec.lastAt = nowGameMin();
    if (rec.count <= 0 && rec.heat < 4) records.delete(key);
    else records.set(key, rec);
    return { key, count: rec.count, heat: Math.round(rec.heat) };
  }

  function snapshot() {
    return [...records.values()].map(r => ({ ...r, templateCounts: { ...(r.templateCounts || {}) } }));
  }

  function reset() {
    records.clear();
  }

  return {
    cfg,
    recordFailure,
    recordSuccess,
    lineFor,
    snapshot,
    reset,
  };
})();

window.InteractionDepthSystem = InteractionDepthSystem;
