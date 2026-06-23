/* ═══════════════════ NARRATIVE BUBBLE (PLUGGABLE) ═══════════════════ */
const NarrativeBubbleSystem = (() => {
  let enabled = false;
  let unsubs = [];
  let active = [];
  let demandLog = {};
  let conflictCd = {};
  let conflictScanAcc = 0;
  let theater = null;
  let theaterCount = 0;
  let memoryEnterLog = {};
  let ruleLog = {};
  let stateBubbleLog = {};
  let memoryBubbleLog = {};
  let llmPending = {};
  let recentTextLog = [];
  let burstByModule = {};

  function cfg() { return CONFIG.narrativeBubble || DEFAULT_CONFIG.narrativeBubble; }
  function st() { return cfg().settings || {}; }

  function normalizeBubbleText(text) {
    return String(text || '')
      .replace(/\{[^}]+\}/g, '·')
      .replace(/[…。！？，、；：\s]+/g, '')
      .trim();
  }

  function isRecentDuplicate(text, module) {
    if (st().dedupeText === false) return false;
    const norm = normalizeBubbleText(text);
    if (!norm) return true;
    const now = performance.now();
    const windowMs = (st().dedupeTextWindowSec ?? 8) * 1000;
    recentTextLog = recentTextLog.filter(r => now - r.t < windowMs);
    if (recentTextLog.some(r => r.norm === norm)) return true;
    recentTextLog.push({ norm, module: module || '', t: now });
    if (recentTextLog.length > 40) recentTextLog.shift();
    return false;
  }

  function isBurstLimited(module) {
    const limits = st().burstLimits || { observe: 1, contagion: 1, interaction: 2, default: 2 };
    const mod = module || 'default';
    const limit = limits[mod] ?? limits.default ?? 2;
    const windowMs = (st().burstWindowSec ?? 4) * 1000;
    const now = performance.now();
    const log = burstByModule[mod] || { t: now, n: 0 };
    if (now - log.t >= windowMs) { log.t = now; log.n = 0; }
    if (log.n >= limit) return true;
    log.n++;
    burstByModule[mod] = log;
    return false;
  }

  const TRAIT_LABELS = {
    fengliu: '风流', duoqing: '多情', shuchi: '书痴', qinggao: '清高', qingjie: '洁癖',
    haoke: '好客', lazy: '慵懒', kebo: '刻薄',
  };

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function charTraits(c) {
    try { return typeof getCharTraits === 'function' ? getCharTraits(c) : []; }
    catch (e) { return []; }
  }

  function traitLabel(id) {
    return CONFIG.charSpecialtyConfig?.traitMetadata?.[id]?.label
      || CONFIG.charSpecialtyConfig?.traitLabels?.[id]
      || TRAIT_LABELS[id]
      || id
      || '';
  }

  function specialtyProfile(c) {
    return CONFIG.charSpecialtyConfig?.profiles?.[c?.id] || {};
  }

  function charSpecialties(c) {
    return (specialtyProfile(c).specialties || []).map(s => typeof s === 'string' ? s : s?.id).filter(Boolean);
  }

  function specialtyLabel(charId, id) {
    const meta = CONFIG.charSpecialtyConfig?.specialtyMetadata || {};
    return meta[`${charId}.${id}`]?.label || meta[id]?.label
      || (CONFIG.charSpecialtyConfig?.profiles?.[charId]?.specialties || [])
        .find(s => (typeof s === 'string' ? s : s?.id) === id)?.name
      || id
      || '';
  }

  function needInfo(c) {
    const out = {};
    for (const nd of getNeedDefs()) {
      const value = c.needs?.[nd.key] ?? nd.defaultValue ?? 70;
      const stateId = c.needMeta?.needBandIds?.[nd.key] || '';
      const sd = stateId ? CONFIG.stateDefs?.[stateId] : null;
      out[nd.key] = {
        key: nd.key,
        name: nd.name || nd.label || nd.key,
        label: nd.label || nd.name || nd.key,
        value,
        ratio: value / 100,
        stateId,
        bandName: sd?.name || '',
        bandSlot: sd?.needBand?.slot || null,
        polarity: sd?.polarity || '',
        severity: sd?.severity || 0,
      };
    }
    return out;
  }

  function stateInfo(c) {
    return (c.activeStates || []).map(stRow => {
      const sd = CONFIG.stateDefs?.[stRow.id] || {};
      return {
        id: stRow.id,
        name: sd.name || stRow.id,
        desc: sd.desc || '',
        category: sd.category || '',
        polarity: sd.polarity || '',
        severity: sd.severity || 0,
        remaining: stRow.remaining,
        needKey: sd.needBand?.need || null,
      };
    });
  }

  function memoryId(mem, idx) {
    return mem.id || mem.memoryId || `${mem.createdAt || mem.timestamp || mem.day || 'm'}_${idx}`;
  }

  function memoryInfo(c, scene, targetId) {
    return (c.memories || []).map((mem, idx) => {
      const withId = mem.with || mem.targetId || mem.otherId || mem.participants?.[0] || '';
      const sceneName = mem.scene || mem.sceneName || '';
      const sceneId = mem.sceneId || '';
      const sameScene = !!scene && (sceneId === scene.id || sceneName === scene.name);
      return {
        ...mem,
        id: memoryId(mem, idx),
        text: mem.text || mem.title || mem.tag || '旧事',
        tag: mem.tag || '',
        with: withId,
        sceneId,
        sceneName,
        sameScene,
        sameTarget: !!targetId && (withId === targetId || (mem.participants || []).includes(targetId)),
        strength: mem.strength ?? 1,
        idx,
      };
    }).sort((a, b) => (b.strength || 1) - (a.strength || 1) || (b.timestamp || b.createdAt || 0) - (a.timestamp || a.createdAt || 0));
  }

  function buildBubbleContext(c, evt = {}) {
    const scene = sceneAt(Math.floor(c.gridCol), Math.floor(c.gridRow)) || CONFIG.scenes.find(s => s.id === c.sceneId) || null;
    const targetId = evt.otherId || evt.targetId || evt.targetCharId || evt.observedId || evt.with || '';
    const target = targetId ? getChar(targetId) : null;
    const traits = charTraits(c);
    const specialties = charSpecialties(c);
    const states = stateInfo(c);
    const needs = needInfo(c);
    const primaryNeed = Object.values(needs).sort((a, b) => a.value - b.value)[0] || null;
    const action = c.action || c.actionQueue?.[0] || null;
    return {
      charId: c.id,
      name: c.short || c.name || c.id,
      traits,
      traitLabels: traits.map(traitLabel),
      specialties,
      specialtyLabels: specialties.map(id => specialtyLabel(c.id, id)),
      needs,
      primaryNeed,
      states,
      stateIds: states.map(s => s.id),
      stateCategories: states.map(s => s.category).filter(Boolean),
      statePolarities: states.map(s => s.polarity).filter(Boolean),
      scene,
      sceneId: scene?.id || c.sceneId || '',
      sceneName: scene?.name || '',
      targetId,
      target,
      targetName: target?.short || '',
      relationValue: target ? getRelationValue(c.id, target.id) : null,
      relationLabel: target ? (typeof getRelationTypeLabel === 'function' ? getRelationTypeLabel(getRelationValue(c.id, target.id)) : '') : '',
      action,
      actionName: action?.itemName || action?.label || action?.type || '',
      actionTags: action?.tags || action?.actionTags || [],
      memories: memoryInfo(c, scene, targetId),
      event: evt,
      timePeriod: evt.period || gamePeriod,
      timePeriodLabel: getPeriodLabel(evt.period || gamePeriod),
      timestamp: getGameTimestamp(),
    };
  }

  function fillPlaceholders(text, ctx) {
    return String(text)
      .replace(/\{name\}/g, ctx.name || '')
      .replace(/\{need_name\}/g, ctx.needName || '')
      .replace(/\{need_value\}/g, ctx.needValue != null ? Math.round(ctx.needValue) : '')
      .replace(/\{scene\}/g, ctx.scene || '')
      .replace(/\{target\}/g, ctx.target || '')
      .replace(/\{other_name\}/g, ctx.otherName || '')
      .replace(/\{name_a\}/g, ctx.nameA || '')
      .replace(/\{name_b\}/g, ctx.nameB || '')
      .replace(/\{memory_title\}/g, ctx.memoryTitle || '')
      .replace(/\{time_ago\}/g, ctx.timeAgo || '')
      .replace(/\{emotion\}/g, ctx.emotion || '')
      .replace(/\{trait\}/g, ctx.traitLabel || '')
      .replace(/\{trait_label\}/g, ctx.traitLabel || '')
      .replace(/\{specialty\}/g, ctx.specialtyLabel || '')
      .replace(/\{specialty_label\}/g, ctx.specialtyLabel || '')
      .replace(/\{state_name\}/g, ctx.stateName || '')
      .replace(/\{state_desc\}/g, ctx.stateDesc || '')
      .replace(/\{need_band\}/g, ctx.needBand || '')
      .replace(/\{action\}/g, ctx.action || '')
      .replace(/\{time_period\}/g, ctx.timePeriodLabel || '')
      .replace(/\{relation_label\}/g, ctx.relationLabel || '')
      .replace(/\{interaction\}/g, ctx.interaction || '');
  }

  function resolveText(source, texts, ctx) {
    const llm = st().llm;
    if (llm?.enabled && (llm.apiUrl || llm.useEventOnly)) {
      const requestId = 'nb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      EventBus.emit('bubble:llm_request', {
        requestId, source, promptTag: ctx.promptTag || llm.promptTemplates?.[source],
        systemPrompt: llm.systemPrompt, context: ctx, fallbackTexts: texts,
      });
      llmPending[requestId] = { charId: ctx.charId, style: ctx.style, icon: ctx.icon, module: ctx.module };
      if (llm.apiUrl) fetchLLMText(requestId, source, ctx, texts);
    }
    const raw = texts[Math.floor(Math.random() * texts.length)] || '……';
    return fillPlaceholders(raw, ctx);
  }

  async function fetchLLMText(requestId, source, ctx, fallbacks) {
    const llm = st().llm;
    try {
      const body = {
        promptTag: ctx.promptTag || llm.promptTemplates?.[source],
        system: llm.systemPrompt,
        context: ctx,
        fallbacks,
      };
      const res = await fetch(llm.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(llm.apiKey ? { Authorization: 'Bearer ' + llm.apiKey } : {}) },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.text || data.content || data.message;
        if (text) applyLLMResponse(requestId, text);
      }
    } catch (e) { /* 失败则保留模板文案 */ }
  }

  function showBubble(data) {
    if ((!enabled || !st().masterEnabled) && !data.bypassLimits) return false;
    const c = getChar(data.charId);
    if (!c || !data.text) return false;
    if (speechBubble?.char?.id === c.id) return false;
    const module = data.module || '';
    if (!data.bypassLimits && isRecentDuplicate(data.text, module)) return false;
    if (!data.bypassLimits && isBurstLimited(module)) return false;
    active = active.filter(b => b.charId !== data.charId);
    const max = st().maxOnScreen || 3;
    while (active.length >= max) active.shift();
    const dur = data.duration || Math.min(8, Math.max(4, (data.text?.length || 6) * 0.18));
    active.push({
      charId: data.charId, char: c, text: data.text,
      style: data.style || 'thought', icon: data.icon || '',
      born: performance.now(), duration: dur, fadeIn: 0.3, fadeOut: 0.5,
      module,
    });
    EventBus.emit('bubble:show', {
      charId: data.charId, text: data.text, style: data.style, module: data.module,
      ruleId: data.ruleId || '', drivers: data.drivers || null, memoryId: data.memoryId || '',
    });
    return true;
  }

  function arrayHasAny(haystack, needles) {
    if (!needles?.length) return true;
    return needles.some(n => haystack.includes(n));
  }

  function arrayHasAll(haystack, needles) {
    if (!needles?.length) return true;
    return needles.every(n => haystack.includes(n));
  }

  function arrayHasNone(haystack, needles) {
    if (!needles?.length) return true;
    return needles.every(n => !haystack.includes(n));
  }

  function compareValue(value, cond) {
    if (!cond) return true;
    const op = cond.op || (cond.min != null || cond.max != null ? 'between' : '<=');
    if (op === '<') return value < cond.value;
    if (op === '<=') return value <= cond.value;
    if (op === '>') return value > cond.value;
    if (op === '>=') return value >= cond.value;
    if (op === 'between') {
      if (cond.min != null && value < cond.min) return false;
      if (cond.max != null && value > cond.max) return false;
      return true;
    }
    return true;
  }

  function matchRuleTrigger(rule, evt) {
    const trigger = rule.trigger || {};
    const type = trigger.type || 'event';
    if (type === 'event') return !trigger.event || trigger.event === evt.type;
    if (type === 'need_band') return evt.type === 'need:band_changed' || evt.type === 'need:critical' || evt.type === 'need:crisis';
    if (type === 'state_add') return evt.type === 'state:add';
    if (type === 'state_refresh') return evt.type === 'state:refresh';
    if (type === 'interaction') return String(evt.type || '').startsWith('interaction');
    if (type === 'furniture') return String(evt.type || '').startsWith('furniture:');
    if (type === 'scan' || type === 'idle') return evt.type === 'time:tick' || evt.type === 'scan';
    return true;
  }

  function matchNeedConditions(ctx, cond) {
    for (const needCond of cond.needs || []) {
      const n = ctx.needs[needCond.key || needCond.needKey || needCond.need];
      if (!n || !compareValue(n.value, needCond)) return false;
    }
    return true;
  }

  function selectMemoryForRule(ctx, cond = {}) {
    let pool = ctx.memories || [];
    if (cond.memoryTagsAny?.length) pool = pool.filter(m => cond.memoryTagsAny.includes(m.tag));
    if (cond.memoryScene) pool = pool.filter(m => m.sameScene || !m.sceneName && !m.sceneId);
    if (cond.memoryTarget) pool = pool.filter(m => m.sameTarget);
    return pool[0] || null;
  }

  function matchDrivenRule(rule, ctx, evt) {
    if (!matchRuleTrigger(rule, evt)) return false;
    const cond = rule.conditions || {};
    if (!arrayHasAny(ctx.traits, cond.traitsAny || cond.traitAny)) return false;
    if (!arrayHasAll(ctx.traits, cond.traitsAll || cond.traitAll)) return false;
    if (!arrayHasNone(ctx.traits, cond.traitsNot || cond.traitNot)) return false;
    if (!arrayHasAny(ctx.specialties, cond.specialtiesAny || cond.specialtyAny)) return false;
    if (!arrayHasAll(ctx.specialties, cond.specialtiesAll || cond.specialtyAll)) return false;
    if (!arrayHasNone(ctx.specialties, cond.specialtiesNot || cond.specialtyNot)) return false;
    if (!matchNeedConditions(ctx, cond)) return false;
    if (!arrayHasAny(ctx.stateIds, cond.statesAny || cond.stateAny)) return false;
    if (!arrayHasAll(ctx.stateIds, cond.statesAll || cond.stateAll)) return false;
    if (!arrayHasNone(ctx.stateIds, cond.statesNot || cond.stateNot)) return false;
    if (cond.stateCategory && !ctx.stateCategories.includes(cond.stateCategory)) return false;
    if (cond.statePolarity && !ctx.statePolarities.includes(cond.statePolarity)) return false;
    if (cond.sceneIds?.length && !cond.sceneIds.includes(ctx.sceneId)) return false;
    if (cond.sceneTypes?.length && !cond.sceneTypes.some(t => ctx.scene?.tags?.includes?.(t) || ctx.scene?.type === t)) return false;
    if (cond.actionTagsAny?.length && !arrayHasAny(ctx.actionTags, cond.actionTagsAny)) return false;
    if (cond.timeWindows?.length && !cond.timeWindows.includes(ctx.timePeriod)) return false;
    if ((cond.memoryTagsAny?.length || cond.memoryScene || cond.memoryTarget) && !selectMemoryForRule(ctx, cond)) return false;
    const trigger = rule.trigger || {};
    if (trigger.needKey && evt.needKey && trigger.needKey !== evt.needKey) return false;
    if (trigger.stateId && evt.stateId && trigger.stateId !== evt.stateId) return false;
    return true;
  }

  function ruleTextContext(ctx, cand = {}) {
    const need = cand.needKey ? ctx.needs[cand.needKey] : ctx.primaryNeed;
    const state = cand.stateId ? ctx.states.find(s => s.id === cand.stateId) : ctx.states[0];
    const traitId = cand.traitId || cand.drivers?.traitIds?.[0] || ctx.traits[0];
    const specialtyId = cand.specialtyId || cand.drivers?.specialtyIds?.[0] || ctx.specialties[0];
    const mem = cand.memory || null;
    return {
      charId: ctx.charId,
      name: ctx.name,
      needName: need?.name || '',
      needValue: need?.value,
      needBand: need?.bandName || '',
      stateName: state?.name || '',
      stateDesc: state?.desc || '',
      scene: ctx.sceneName,
      target: ctx.targetName,
      otherName: ctx.targetName,
      memoryTitle: mem?.text || '',
      timeAgo: mem ? formatTimeAgo(mem) : '',
      emotion: mem?.tag || '',
      traitLabel: traitLabel(traitId),
      specialtyLabel: specialtyLabel(ctx.charId, specialtyId),
      interaction: ctx.event?.interactionName || '',
      action: ctx.actionName,
      timePeriodLabel: ctx.timePeriodLabel,
      relationLabel: ctx.relationLabel,
      style: cand.style,
      icon: cand.icon,
      module: cand.module,
      promptTag: cand.promptTag,
    };
  }

  function driverInfo(ctx, cand) {
    return {
      traitIds: cand.drivers?.traitIds || (cand.traitId ? [cand.traitId] : []),
      specialtyIds: cand.drivers?.specialtyIds || (cand.specialtyId ? [cand.specialtyId] : []),
      needKeys: cand.drivers?.needKeys || (cand.needKey ? [cand.needKey] : []),
      stateIds: cand.drivers?.stateIds || (cand.stateId ? [cand.stateId] : []),
      memoryId: cand.memory?.id || cand.memoryId || '',
      sourceEvent: ctx.event?.type || '',
    };
  }

  function candidateScore(ctx, cand) {
    let score = cand.baseScore ?? cand.score?.base ?? 40;
    if (cand.needKey && ctx.needs[cand.needKey]) {
      const value = ctx.needs[cand.needKey].value;
      score *= 1 + clamp((50 - value) / 100, 0, 0.7) * (cand.score?.needWeight || 1);
    }
    const stateIds = cand.stateId ? [cand.stateId] : (cand.drivers?.stateIds || []);
    const stateBoost = stateIds.reduce((sum, id) => {
      const srow = ctx.states.find(s => s.id === id);
      return sum + (srow ? (srow.severity || 1) * (srow.polarity === 'negative' ? 0.12 : 0.06) : 0);
    }, 0);
    score *= 1 + stateBoost * (cand.score?.stateWeight || 1);
    const traitIds = cand.drivers?.traitIds || (cand.traitId ? [cand.traitId] : []);
    if (traitIds.length && traitIds.some(t => ctx.traits.includes(t))) score *= cand.score?.traitWeight || 1.12;
    if (cand.memory) score *= clamp(0.85 + (cand.memory.strength || 1) * 0.18, 0.85, 1.35);
    if (cand.triggerStrength != null) score *= cand.triggerStrength;
    return score;
  }

  function cooldownKey(c, cand) {
    return `${c.id}|${cand.ruleId || cand.id || cand.module}|${cand.stateId || ''}|${cand.memory?.id || ''}`;
  }

  function cooldownOk(c, cand) {
    const now = getGameTimestamp();
    const key = cooldownKey(c, cand);
    const cd = cand.cooldownGameMin ?? cand.score?.cooldownGameMin ?? st()[cand.module]?.cooldownGameMin ?? 0;
    if (ruleLog[key] && now - ruleLog[key].t < cd) return false;
    const dailyMax = cand.dailyMaxPerChar ?? cand.score?.dailyMaxPerChar;
    if (dailyMax != null) {
      const log = ruleLog[key] || { t: 0, n: 0, day: gameDay };
      if (log.day === gameDay && log.n >= dailyMax) return false;
    }
    if (cand.stateId) {
      const sk = `${c.id}|${cand.stateId}`;
      const stateCd = cand.stateCooldownGameMin ?? 30;
      if (stateBubbleLog[sk] && now - stateBubbleLog[sk] < stateCd) return false;
    }
    if (cand.memory) {
      const mk = `${c.id}|${cand.memory.id}`;
      const memoryCd = cand.memoryCooldownGameMin ?? st().memory?.memoryCooldownGameMin ?? 240;
      if (memoryBubbleLog[mk] && now - memoryBubbleLog[mk] < memoryCd) return false;
    }
    return true;
  }

  function markCooldown(c, cand) {
    const now = getGameTimestamp();
    const key = cooldownKey(c, cand);
    const log = ruleLog[key] || { t: 0, n: 0, day: gameDay };
    if (log.day !== gameDay) { log.n = 0; log.day = gameDay; }
    log.t = now;
    log.n++;
    ruleLog[key] = log;
    if (cand.stateId) stateBubbleLog[`${c.id}|${cand.stateId}`] = now;
    if (cand.memory) memoryBubbleLog[`${c.id}|${cand.memory.id}`] = now;
  }

  function rejectCandidate(cand, ctx, reason) {
    EventBus.emit('bubble:rejected', {
      ruleId: cand.ruleId || cand.id || '',
      charId: ctx.charId,
      reason,
      score: cand._score || 0,
      module: cand.module || '',
    });
  }

  function runBubblePipeline(c, evt, candidates) {
    if (!candidates?.length) return false;
    const ctx = buildBubbleContext(c, evt);
    const enriched = candidates.map(cand => {
      const next = { ...cand };
      next.drivers = driverInfo(ctx, next);
      next._score = candidateScore(ctx, next);
      EventBus.emit('bubble:candidate', {
        ruleId: next.ruleId || next.id || '',
        charId: ctx.charId,
        score: next._score,
        module: next.module || '',
        traitIds: next.drivers.traitIds,
        specialtyIds: next.drivers.specialtyIds,
        needKeys: next.drivers.needKeys,
        stateIds: next.drivers.stateIds,
        memoryId: next.drivers.memoryId,
        sourceEvent: evt.type,
      });
      return next;
    }).sort((a, b) => (a.priority ?? a.score?.priority ?? 50) - (b.priority ?? b.score?.priority ?? 50) || b._score - a._score);

    for (const cand of enriched) {
      if (!cooldownOk(c, cand)) { rejectCandidate(cand, ctx, 'cooldown'); continue; }
      const texts = cand.texts || (cand.text ? [cand.text] : []);
      if (!texts.length) { rejectCandidate(cand, ctx, 'no_text'); continue; }
      const textCtx = ruleTextContext(ctx, cand);
      const text = cand.resolveText ? cand.resolveText(textCtx) : resolveText(cand.source || cand.module || 'driven', texts, textCtx);
      const ok = showBubble({
        charId: ctx.charId,
        text,
        style: cand.style || 'thought',
        icon: cand.icon || '',
        module: cand.module || 'driven',
        ruleId: cand.ruleId || cand.id || '',
        drivers: cand.drivers,
        memoryId: cand.memory?.id || '',
      });
      if (!ok) { rejectCandidate(cand, ctx, 'display_limited'); continue; }
      markCooldown(c, cand);
      if (cand.walkEffect === 'pause' && c.ai) c.ai.walkPauseUntil = performance.now() / 1000 + 1.5;
      return true;
    }
    return false;
  }

  function collectDrivenRules(ctx, evt) {
    return (cfg().drivenRules || []).filter(rule => rule.enabled !== false && matchDrivenRule(rule, ctx, evt)).map(rule => {
      const cond = rule.conditions || {};
      const mem = selectMemoryForRule(ctx, cond);
      const firstNeed = cond.needs?.[0]?.key || cond.needs?.[0]?.needKey || cond.needs?.[0]?.need || rule.trigger?.needKey || evt.needKey || '';
      const firstState = cond.statesAny?.[0] || cond.statesAll?.[0] || rule.trigger?.stateId || evt.stateId || '';
      return {
        ruleId: rule.id,
        module: rule.module || 'driven',
        source: rule.module || 'driven',
        needKey: firstNeed,
        stateId: firstState,
        memory: mem,
        texts: rule.texts || [],
        style: rule.style || 'thought',
        icon: rule.icon || '',
        priority: rule.score?.priority ?? rule.priority ?? 40,
        score: rule.score || {},
        cooldownGameMin: rule.score?.cooldownGameMin ?? rule.cooldownGameMin,
        dailyMaxPerChar: rule.score?.dailyMaxPerChar ?? rule.dailyMaxPerChar,
        drivers: {
          traitIds: [...(cond.traitsAny || []), ...(cond.traitsAll || [])].filter(t => ctx.traits.includes(t)),
          specialtyIds: [...(cond.specialtiesAny || []), ...(cond.specialtiesAll || [])].filter(sid => ctx.specialties.includes(sid)),
          needKeys: firstNeed ? [firstNeed] : [],
          stateIds: firstState ? [firstState] : [],
        },
      };
    });
  }

  function traitsMatch(c, cond) {
    if (!cond || !cond.trait) return true;
    return getCharTraits(c).includes(cond.trait);
  }

  function canShowDemand(c) {
    const s = st().demand || {};
    const ts = getGameTimestamp();
    const log = demandLog[c.id] || { t: 0, n: 0, w: ts };
    if (ts - log.w >= 60) { log.n = 0; log.w = ts; }
    if (log.n >= (s.maxPerCharPerGameMin || 2)) return false;
    if (ts - log.t < (s.minIntervalGameMin || 5)) return false;
    return true;
  }

  function markDemand(c) {
    const ts = getGameTimestamp();
    const log = demandLog[c.id] || { t: 0, n: 0, w: ts };
    if (ts - log.w >= 60) { log.n = 0; log.w = ts; }
    log.t = ts; log.n++;
    demandLog[c.id] = log;
  }

  function onNeedCritical(evt) {
    if (!enabled || !st().demandEnabled) return;
    const c = getChar(evt.charId);
    if (!c) return;
    const ratio = evt.ratio ?? ((c.needs?.[evt.needKey] ?? 100) / 100);
    const ctx = buildBubbleContext(c, evt);
    const rows = (cfg().demandBubbles || []).filter(r =>
      r.needKey === evt.needKey && ratio <= r.threshold && traitsMatch(c, r.condition)
    );
    const driven = collectDrivenRules(ctx, evt);
    if (!rows.length && !driven.length) return;
    if (!canShowDemand(c)) return;
    const nd = getNeedDefs().find(n => n.key === evt.needKey);
    const oldCandidates = rows.map(row => ({
      ruleId: `legacy:demand:${row.id}`,
      module: 'demand',
      source: 'demand',
      needKey: evt.needKey,
      traitId: row.condition?.trait || '',
      texts: row.texts || [],
      style: row.style,
      icon: row.icon,
      priority: row.priority ?? 99,
      baseScore: 80 - (row.priority ?? 20),
      triggerStrength: 1 + clamp((row.threshold - ratio) * 1.5, 0, 0.6),
      cooldownGameMin: st().demand?.minIntervalGameMin || 5,
      drivers: {
        traitIds: row.condition?.trait ? [row.condition.trait] : [],
        needKeys: [evt.needKey],
        stateIds: ctx.needs[evt.needKey]?.stateId ? [ctx.needs[evt.needKey].stateId] : [],
      },
      promptTag: st().llm?.promptTemplates?.demand,
      resolveText: textCtx => resolveText('demand', row.texts || [], {
        ...textCtx,
        needName: nd?.label || evt.needKey,
        needValue: ratio * 100,
        traitLabel: traitLabel(row.condition?.trait),
        promptTag: st().llm?.promptTemplates?.demand,
      }),
    }));
    markDemand(c);
    runBubblePipeline(c, evt, [...oldCandidates, ...driven]);
  }

  function charsInScene(sceneId) {
    return CHARS.filter(c => c.sceneId === sceneId);
  }

  function pairKey(a, b, cfgId) { return [a, b].sort().join('|') + ':' + cfgId; }

  function conflictCdOk(a, b, row) {
    const k = pairKey(a, b, row.id);
    return getGameTimestamp() >= (conflictCd[k] || 0);
  }

  function markConflictCd(a, b, row) {
    conflictCd[pairKey(a, b, row.id)] = getGameTimestamp() + (row.cooldownGameMin || 30);
  }

  function matchConflictRow(row, a, b) {
    if (row.charATrait && row.charATrait !== '0' && !getCharTraits(a).includes(row.charATrait)) return false;
    if (row.charBTrait && row.charBTrait !== '0' && !getCharTraits(b).includes(row.charBTrait)) return false;
    const rel = getRelationValue(a, b);
    const [lo, hi] = row.relationRange || [-100, 100];
    if (rel < lo || rel > hi) return false;
    return conflictCdOk(a, b, row);
  }

  function pickBystander(sceneId, trait) {
    const pool = charsInScene(sceneId).filter(c => !trait || trait === '0' || getCharTraits(c).includes(trait));
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function applyLineEffect(effect, a, b) {
    if (!effect) return;
    if (effect.type === 'relation') CharacterEffectSystem.apply({
      type: 'relation', idA: a, idB: b, delta: effect.delta || 0,
    }, { source: 'narrative:theater', reason: '叙事剧场' });
    if (effect.type === 'state' && effect.stateId) {
      const who = effect.target === 'char_b' ? getChar(b) : effect.target === 'char_a' ? getChar(a) : null;
      const targets = who ? [who] : [getChar(a), getChar(b)];
      targets.filter(Boolean).forEach(c => CharacterEffectSystem.apply({
        type: 'state', charId: c.id, stateId: effect.stateId,
      }, { source: 'narrative:theater', reason: '叙事剧场' }));
    }
  }

  function executeTheater(row, charA, charB) {
    if (theater || theaterCount >= (st().conflict?.maxConcurrent || 2)) return;
    theaterCount++;
    markConflictCd(charA, charB, row);
    EventBus.emit('conflict:theater_start', { configId: row.id, charA, charB, name: row.name });
    theater = { row, charA, charB, idx: 0, timer: 0 };
    playTheaterLine();
  }

  function playTheaterLine() {
    if (!theater) return;
    const { row, charA, charB, idx } = theater;
    if (idx >= row.lines.length) {
      EventBus.emit('conflict:theater_end', { configId: row.id, charA, charB });
      theater = null;
      theaterCount = Math.max(0, theaterCount - 1);
      return;
    }
    const line = row.lines[idx];
    const sc = sceneAt(Math.floor(getChar(charA).gridCol), Math.floor(getChar(charA).gridRow));
    let speakerId = charA;
    if (line.speaker === 'char_b') speakerId = charB;
    else if (line.speaker === 'bystander') {
      const by = pickBystander(sc?.id || getChar(charA).sceneId, line.bystanderTrait);
      speakerId = by?.id || charA;
    }
    const sp = getChar(speakerId);
    const ctx = {
      charId: speakerId, name: sp?.short, nameA: getChar(charA).short, nameB: getChar(charB).short,
      scene: sc?.name, promptTag: st().llm?.promptTemplates?.conflict,
      style: line.style, icon: '', module: 'conflict',
    };
    showBubble({
      charId: speakerId,
      text: resolveText('conflict', [line.text], ctx),
      style: line.style || 'speech', module: 'conflict',
    });
    applyLineEffect(line.effect, charA, charB);
    theater.idx++;
    theater.timer = line.delay ?? 2;
  }

  function scanConflictTheater() {
    if (!enabled || !st().conflictEnabled || theater) return;
    for (const sc of CONFIG.scenes) {
      const chars = charsInScene(sc.id);
      for (let i = 0; i < chars.length; i++)
        for (let j = i + 1; j < chars.length; j++) {
          const a = chars[i].id, b = chars[j].id;
          const rows = (cfg().conflictTheaters || []).filter(r =>
            r.triggerType === 'timed' && matchConflictRow(r, a, b)
          );
          for (const row of rows) {
            if (Math.random() < (row.probability ?? 0.3)) {
              executeTheater(row, a, b);
              return;
            }
          }
        }
    }
  }

  function onConflictEvent(evt) {
    if (!enabled || !st().conflictEnabled) return;
    const rows = (cfg().conflictTheaters || []).filter(r =>
      r.triggerType === 'event' && r.triggerEvent === evt.type
    );
    for (const row of rows) {
      if (row.needKey && evt.needKey && row.needKey !== evt.needKey) continue;
      const c = getChar(evt.charId);
      if (!c) continue;
      if (row.charATrait && row.charATrait !== '0' && !getCharTraits(c).includes(row.charATrait)) continue;
      if (Math.random() > (row.probability ?? 0.5)) continue;
      if (!conflictCdOk(c.id, c.id, row)) continue;
      executeTheater(row, c.id, c.id);
      break;
    }
  }

  function formatTimeAgo(mem) {
    const now = getGameTimestamp();
    const then = (mem.day || gameDay) * 1440 + (mem.hour || 0) * 60;
    const diff = Math.max(0, now - then);
    if (diff < 120) return '方才';
    if (diff < 1440) return '今日';
    if (diff < 4320) return '数日前';
    return '半月前';
  }

  function onSceneEntered(evt) {
    if (!enabled || !st().memoryEnabled || !st().memory?.triggerOnSceneEnter) return;
    const c = getChar(evt.charId);
    if (!c) return;
    const key = c.id + '|' + evt.sceneId;
    const now = getGameTimestamp();
    const sceneCd = st().memory?.sceneCooldownGameMin ?? 180;
    if (memoryEnterLog[key] && now - memoryEnterLog[key] < sceneCd) return;
    const sc = CONFIG.scenes.find(s => s.id === evt.sceneId);
    const ctx = buildBubbleContext(c, evt);
    const mems = (ctx.memories || []).filter(m => m.day != null || m.timestamp != null || m.createdAt != null);
    if (!mems.length) return;
    const mem = mems.find(m => m.sameScene) || mems[0];
    const oldCandidates = (cfg().memorySurfaces || []).filter(r => !r.memoryTag || r.memoryTag === mem.tag).map(row => ({
      ruleId: `legacy:memory:${row.id}`,
      module: 'memory',
      source: 'memory',
      memory: mem,
      memoryId: mem.id,
      texts: [row.template],
      style: row.style || 'thought',
      icon: row.icon || '',
      priority: 45,
      baseScore: 50,
      triggerStrength: row.probability ?? 0.4,
      memoryCooldownGameMin: st().memory?.memoryCooldownGameMin ?? 240,
      walkEffect: row.walkEffect,
      drivers: {
        stateIds: ctx.stateIds.filter(id => CONFIG.stateDefs?.[id]?.polarity === 'negative').slice(0, 2),
      },
      resolveText: textCtx => fillPlaceholders(row.template, {
        ...textCtx,
        name: c.short,
        scene: sc?.name || '',
        otherName: getChar(mem.with)?.short || '某人',
        memoryTitle: mem.text,
        timeAgo: formatTimeAgo(mem),
        emotion: mem.tag || '',
      }),
    })).filter(cand => Math.random() < (cand.triggerStrength || 1));
    const driven = collectDrivenRules(ctx, evt);
    const ok = runBubblePipeline(c, evt, [...oldCandidates, ...driven]);
    if (ok) memoryEnterLog[key] = now;
  }

  function onGameMinute(evt) {
    if (!enabled) return;
    conflictScanAcc += evt?.minutes || 1;
    if (conflictScanAcc >= (st().conflict?.scanIntervalGameMin || 15)) {
      conflictScanAcc = 0;
      scanConflictTheater();
      const scanLimit = st().driven?.scanMaxChars || 2;
      let shown = 0;
      for (const c of CHARS) {
        if (shown >= scanLimit) break;
        const ctx = buildBubbleContext(c, { ...evt, type: 'scan' });
        const candidates = collectDrivenRules(ctx, { ...evt, type: 'scan' });
        if (runBubblePipeline(c, { ...evt, type: 'scan' }, candidates)) shown++;
      }
    }
  }

  function onStateChanged(evt) {
    if (!enabled) return;
    const c = getChar(evt.charId);
    if (!c) return;
    const ctx = buildBubbleContext(c, evt);
    const candidates = collectDrivenRules(ctx, evt);
    if (candidates.length) runBubblePipeline(c, evt, candidates);
  }

  function onInteractionState(evt) {
    if (!enabled || st().interactionEnabled === false) return;
    const c = getChar(evt.charId);
    if (!c) return;
    const ctx = buildBubbleContext(c, evt);
    const rows = (cfg().interactionStateBubbles || []).filter(r => r.stateId === evt.stateId);
    const driven = collectDrivenRules(ctx, evt);
    const oldCandidates = rows.map((row, idx) => ({
      ruleId: `legacy:interaction-state:${row.stateId}:${idx}`,
      module: 'interaction',
      source: 'interaction',
      stateId: evt.stateId,
      texts: row.texts || [],
      style: row.style || 'thought',
      icon: row.icon || '',
      priority: 30,
      baseScore: 70,
      stateCooldownGameMin: 20,
      drivers: { stateIds: [evt.stateId] },
    }));
    runBubblePipeline(c, evt, [...oldCandidates, ...driven]);
  }

  function update(dt) {
    if (theater && theater.timer != null) {
      theater.timer -= dt;
      if (theater.timer <= 0) playTheaterLine();
    }
    const now = performance.now();
    active = active.filter(b => now - b.born < (b.duration + b.fadeOut) * 1000);
  }

  function drawBubbleBox(bx, by, bw, bh, style, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = style === 'thought' ? 'rgba(248,245,255,.94)' : style === 'exclaim' ? 'rgba(255,242,230,.96)' : 'rgba(255,250,240,.95)';
    ctx.strokeStyle = style === 'exclaim' ? '#8b4513' : '#5c4033';
    ctx.lineWidth = style === 'exclaim' ? 2 : 1;
    if (style === 'thought') {
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.beginPath(); ctx.arc(bx + bw * 0.3, by + bh + 4, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);
      if (style === 'speech') {
        ctx.beginPath();
        ctx.moveTo(bx + bw * 0.4, by + bh);
        ctx.lineTo(bx + bw * 0.45, by + bh + 6);
        ctx.lineTo(bx + bw * 0.55, by + bh);
        ctx.fill(); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function draw() {
    if (!active.length) return;
    const now = performance.now();
    const stackAt = {};
    const sorted = [...active].sort((a, b) => a.born - b.born);
    for (const b of sorted) {
      const c = b.char;
      if (!c) continue;
      if (speechBubble?.char?.id === c.id) continue;
      const age = (now - b.born) / 1000;
      let alpha = 1;
      if (age < b.fadeIn) alpha = age / b.fadeIn;
      else if (age > b.duration) alpha = Math.max(0, 1 - (age - b.duration) / b.fadeOut);
      const x = Math.round(toScreenX(c.x)), y = Math.round(toScreenY(c.y)) - 48;
      ctx.font = (b.style === 'exclaim' ? 'bold ' : '') + '12px "Microsoft YaHei", "PingFang SC", sans-serif';
      const maxW = 150;
      const lines = wrapText((b.icon ? b.icon + ' ' : '') + b.text, maxW);
      const bw = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width), 40)) + 14;
      const bh = lines.length * 14 + 10;
      const bx = Math.max(8, Math.min(x - bw / 2, VIEW_W - bw - 8));
      const stackKey = `${Math.floor(bx / 48)},${Math.floor(y / 48)}`;
      const stackIdx = stackAt[stackKey] || 0;
      stackAt[stackKey] = stackIdx + 1;
      const stackGap = st().stackOffsetPx ?? 10;
      const by = Math.max(8, y - bh - (b.style === 'speech' ? 6 : 0) - stackIdx * (bh + stackGap));
      drawBubbleBox(bx, by, bw, bh, b.style, alpha);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#2a1f18';
      ctx.textAlign = 'left';
      lines.forEach((ln, i) => ctx.fillText(ln, bx + 7, by + 14 + i * 14));
      ctx.restore();
    }
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    const s = st();
    if (s.masterEnabled === false) { enabled = false; return; }
    unsubs.push(EventBus.on('need:critical', onNeedCritical));
    unsubs.push(EventBus.on('need:band_changed', onNeedCritical));
    unsubs.push(EventBus.on('need:crisis', onConflictEvent));
    unsubs.push(EventBus.on('scene:entered', onSceneEntered));
    unsubs.push(EventBus.on('time:tick', onGameMinute));
    unsubs.push(EventBus.on('interaction:state', onInteractionState));
    unsubs.push(EventBus.on('state:add', onStateChanged));
    unsubs.push(EventBus.on('state:refresh', onStateChanged));
  }

  function disable() {
    enabled = false;
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    active = [];
    recentTextLog = [];
    burstByModule = {};
    ruleLog = {};
    stateBubbleLog = {};
    memoryBubbleLog = {};
    theater = null;
    theaterCount = 0;
  }

  function init() {
    disable();
    if (st().masterEnabled !== false) enable();
  }

  function reloadConfig() { const was = enabled; disable(); if (was && st().masterEnabled !== false) enable(); }

  function applyLLMResponse(requestId, text) {
    const p = llmPending[requestId];
    if (!p || !text) return;
    delete llmPending[requestId];
    showBubble({ charId: p.charId, text, style: p.style, icon: p.icon, module: p.module || 'llm' });
  }

  return {
    init, enable, disable, reloadConfig, update, draw, showBubble, applyLLMResponse,
    getActiveBubbles: () => active.slice(),
    getConflictCooldowns: () => ({ ...conflictCd }),
    setMasterEnabled(on) { st().masterEnabled = !!on; on ? enable() : disable(); },
    setModuleEnabled(mod, on) {
      if (mod === 'demand') st().demandEnabled = !!on;
      if (mod === 'conflict') st().conflictEnabled = !!on;
      if (mod === 'memory') st().memoryEnabled = !!on;
    },
  };
})();
window.NarrativeBubbleSystem = NarrativeBubbleSystem;

const FAMILY_ROLE_ORDER = { '家主': 1, '配偶': 2, '长辈': 3, '手足': 4, '子女': 5, '门客': 6, '仆从': 7 };
