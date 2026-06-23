const MultiInteractSystem = (() => {
  let unsubs = [];
  let observerBubbleBudget = 1;
  const INTERACTION_ACTION_TAGS = {
    xujiu: '社交', lundao: '功课', tiaoxiao: '娱乐', weijie: '社交', chuanqing: '社交', zhengchi: '争执',
  };
  const FURN_ACTION_TAGS = {
    desk: '功课', bed: '休息', table: '娱乐', bath: '独处', garden: '娱乐', pavilion: '娱乐', seat: '休息',
  };

  function cfg() { return CONFIG.multiInteractConfig || DEFAULT_CONFIG.multiInteractConfig || {}; }
  function enabled() { return cfg().masterEnabled !== false; }

  function beginObserveWave() {
    observerBubbleBudget = cfg().maxObserverBubblesPerEvent ?? 1;
  }

  function tryObserveBubble(data) {
    if (!NarrativeBubbleSystem?.showBubble || observerBubbleBudget <= 0) return false;
    const shown = NarrativeBubbleSystem.showBubble(data);
    if (shown) observerBubbleBudget--;
    return shown;
  }

  function charsInScene(sceneId) {
    return CHARS.filter(c => c.sceneId === sceneId);
  }

  function gridDist(a, b) {
    return Math.hypot(a.gridCol - b.gridCol, a.gridRow - b.gridRow);
  }

  function resolveStatusId(tagOrId) {
    if (!tagOrId) return null;
    const tags = cfg().statusTags || {};
    if (CONFIG.stateDefs[tagOrId]) return tagOrId;
    return tags[tagOrId] || tagOrId;
  }

  function normalizeRow(row) {
    if (row.reactionType) return row;
    return {
      ...row,
      reactionType: row.reaction === 'boost_category' ? 'boost_action' : row.reaction,
      triggerSignal: row.observedCategory ? 'interaction' : row.observedStateId ? 'status_tag' : row.observedFurnitureCategory ? 'action_tag' : 'action_tag',
      triggerInteractionCategory: row.observedCategory,
      triggerStatus: row.observedStateId,
      triggerActionTag: row.observedFurnitureCategory === 'table' ? '娱乐' : row.observedFurnitureCategory === 'desk' ? '功课' : undefined,
      reactionParams: {
        ...(row.params || {}),
        actionTag: row.params?.category,
        weightMultiplier: row.params?.multiplier,
        questTemplateId: row.params?.templateId,
        text: row.params?.text,
        bubbleStyle: row.params?.style,
        statusId: row.params?.stateId,
        target: row.params?.target,
      },
      bubbleTexts: row.params?.text ? [row.params.text] : row.bubbleTexts,
    };
  }

  function allReactions() {
    const legacy = (CONFIG.charSpecialtyConfig?.observerReactions || []).map(normalizeRow);
    return [...(cfg().observerReactions || []), ...legacy]
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  }

  function fillText(template, observer, observed, extra) {
    const tgt = extra?.target || (observed?.action?.type === 'interaction' ? observed.action.target : null);
    return String(template)
      .replace(/\{observer\.name\}/g, observer?.short || '')
      .replace(/\{observed\.name\}/g, observed?.short || '')
      .replace(/\{observer\}/g, observer?.short || '')
      .replace(/\{observed\}/g, observed?.short || '')
      .replace(/\{target\.name\}/g, tgt?.short || '')
      .replace(/\{source\.name\}/g, extra?.source?.short || observed?.short || '');
  }

  function pickBubbleText(row, observer, observed, extra) {
    const pool = row.bubbleTexts?.length ? row.bubbleTexts
      : row.llmConfig?.fallbackTexts?.length ? row.llmConfig.fallbackTexts
      : row.reactionParams?.bubbleTexts || [];
    if (!pool.length) return '';
    const tpl = pool[Math.floor(Math.random() * pool.length)];
    return fillText(tpl, observer, observed, extra);
  }

  function cdKey(kind, rowId, a, b) {
    return `${kind}|${rowId}|${a}|${b}`;
  }

  function onCooldown(c, key, mins) {
    c._miCooldowns = c._miCooldowns || {};
    return c._miCooldowns[key] > getGameTimestamp();
  }

  function setCooldown(c, key, mins) {
    c._miCooldowns = c._miCooldowns || {};
    c._miCooldowns[key] = getGameTimestamp() + (mins || 30);
  }

  function matchObserver(row, observer) {
    if (row.observerCharId && row.observerCharId !== observer.id) return false;
    if (row.observerTraits?.length && !row.observerTraits.some(t => getCharTraits(observer).includes(t))) return false;
    if (row.observerRole) {
      const fam = FamilySystem.findFamilyOfChar(observer.id);
      if (FamilySystem.getCharRole(observer.id, fam?.id) !== row.observerRole) return false;
    }
    if (row.observerExcludeStatus) {
      const sid = resolveStatusId(row.observerExcludeStatus);
      if (sid && observer.activeStates.some(s => s.id === sid)) return false;
    }
    if (row.observerStatus) {
      const sid = resolveStatusId(row.observerStatus);
      if (sid && !observer.activeStates.some(s => s.id === sid)) return false;
    }
    return true;
  }

  function matchObserved(row, observer, observed) {
    if (row.observedCharId && row.observedCharId !== observed.id) return false;
    if (row.observedTraits?.length && !row.observedTraits.some(t => getCharTraits(observed).includes(t))) return false;
    if (row.observedRole) {
      const fam = FamilySystem.findFamilyOfChar(observed.id);
      if (FamilySystem.getCharRole(observed.id, fam?.id) !== row.observedRole) return false;
    }
    const rel = getRelationValue(observer.id, observed.id);
    if (row.observedRelationMin != null && rel < row.observedRelationMin) return false;
    if (row.observedRelationMax != null && rel > row.observedRelationMax) return false;
    return true;
  }

  function getActionTags(c) {
    const tags = new Set();
    if (!c.action && !c.actionQueue.length && c.ai?.state === AI_STATE.IDLE) tags.add('idle');
    if (c.action?.type === 'furniture') {
      const cat = c.action.tpl?.category;
      if (cat) tags.add(FURN_ACTION_TAGS[cat] || '娱乐');
      tags.add(cat);
    }
    if (c.action?.type === 'interaction' && c.action.tpl) {
      tags.add(INTERACTION_ACTION_TAGS[c.action.tpl.category] || '社交');
      tags.add(c.action.tpl.category);
    }
    if (c.action?.type === 'move' || (c.actionQueue[0]?.type === 'move')) tags.add('行走');
    const near = charsInScene(c.sceneId).filter(x => x.id !== c.id);
    if (near.some(x => x.id === 'baoyu') && ['xiren', 'sheyue', 'qingwen'].includes(c.id))
      tags.add('跟随');
    return [...tags];
  }

  function matchSignal(row, observer, observed, signalCtx) {
    const sig = row.triggerSignal;
    if (sig === 'scene_enter') return signalCtx?.type === 'scene_enter' && signalCtx.charId === observed.id;
    if (sig === 'scene_enter_unauthorized') {
      return signalCtx?.type === 'scene_enter_unauthorized' && signalCtx.charId === observed.id
        && (!row.triggerSceneType || signalCtx.sceneType === row.triggerSceneType);
    }
    if (sig === 'status_gained') {
      return signalCtx?.type === 'status_gained' && signalCtx.charId === observed.id
        && (!row.triggerStatus || signalCtx.stateId === resolveStatusId(row.triggerStatus));
    }
    if (sig === 'interaction_started' || sig === 'interaction') {
      if (signalCtx?.type === 'interaction' && signalCtx.initiatorId === observed.id) {
        const cat = signalCtx.category;
        if (row.triggerInteractionCategory && cat !== row.triggerInteractionCategory) return false;
        if (row.triggerTargetRole) {
          const partner = getChar(signalCtx.targetId);
          const fam = FamilySystem.findFamilyOfChar(partner?.id);
          const role = partner ? FamilySystem.getCharRole(partner.id, fam?.id) : null;
          if (role !== row.triggerTargetRole) return false;
        }
        return true;
      }
      if (observed.action?.type === 'interaction') {
        const cat = observed.action.tpl?.category;
        if (row.triggerInteractionCategory && cat !== row.triggerInteractionCategory) return false;
        if (row.triggerTargetRole) {
          const partner = observed.action.target;
          const fam = FamilySystem.findFamilyOfChar(partner?.id);
          const role = partner ? FamilySystem.getCharRole(partner.id, fam?.id) : null;
          if (role !== row.triggerTargetRole) return false;
        }
        return true;
      }
      return false;
    }
    if (sig === 'status_tag') {
      const sid = resolveStatusId(row.triggerStatus || row.observedStatusTag);
      return sid && observed.activeStates.some(s => s.id === sid);
    }
    if (sig === 'action_tag') {
      const tags = getActionTags(observed);
      const want = row.triggerActionTag;
      return want && tags.includes(want);
    }
    if (sig === 'idle') {
      return !observed.action && !observed.actionQueue.length;
    }
    if (sig === 'need_critical') {
      return signalCtx?.type === 'need_critical' && signalCtx.charId === observed.id
        && (!row.triggerNeedKey || signalCtx.needKey === row.triggerNeedKey);
    }
    if (sig === 'absent_near_baoyu') {
      return observed.id === 'xiren' && observer.id === 'sheyue'
        && !charsInScene(observer.sceneId).some(x => x.id === 'xiren')
        && charsInScene(observer.sceneId).some(x => x.id === 'baoyu');
    }
    return false;
  }

  function removeStatus(c, stateId) {
    const sid = resolveStatusId(stateId);
    if (!sid || !c) return;
    const had = c.activeStates.some(s => s.id === sid);
    c.activeStates = c.activeStates.filter(s => s.id !== sid);
    if (had) {
      log(`${c.short}状态「${CONFIG.stateDefs[sid]?.name || sid}」解除。`);
      EventBus.emit('state:remove', { charId: c.id, stateId: sid });
      uiDirty = true;
    }
  }

  function applyAdditional(observer, observed, effects) {
    for (const ef of effects || []) {
      if (ef.type === 'remove_status' && Math.random() <= (ef.probability ?? 1)) {
        const who = ef.target === 'observer' ? observer : observed;
        removeStatus(who, ef.statusId || ef.statusTag);
      }
      if (ef.type === 'relation_shift') {
        CharacterEffectSystem.apply({
          type: 'relation', idA: observer.id, idB: observed.id, delta: ef.amount || 0,
        }, { source: 'multi-interact:additional', reason: '观察附加效果' });
      }
    }
  }

  function executeReaction(observer, observed, row, signalCtx) {
    const p = row.reactionParams || {};
    const rt = row.reactionType;

    if (rt === 'boost_action' || rt === 'boost_category') {
      const tag = p.actionTag || p.category;
      observer._miActionBoost = {
        tag, category: p.category,
        multiplier: p.weightMultiplier || p.multiplier || 2,
        until: getGameTimestamp() + (p.durationGameMin || 10),
      };
      markAIDirty(observer);
    } else if (rt === 'issue_quest') {
      const tid = p.questTemplateId || p.templateId;
      if (tid && QuestSystem.debugIssue) QuestSystem.debugIssue(tid, observer.id, observed.id);
    } else if (rt === 'force_interaction') {
      const tplId = p.interactionTemplateId || p.interaction_template_id;
      const tpl = getInteractionTemplate(tplId);
      if (!tpl) return;
      const target = observed;
      if (p.interruptionBehavior === 'interrupt_current') {
        cancelAction(observer);
        observer.actionQueue = [];
      }
      const item = makeInteractionItem(observer, target, tpl);
      item.aiGenerated = true;
      const run = () => {
        enqueueAction(observer, item, p.interruptionBehavior === 'queue_next');
        setAIState(observer, AI_STATE.EXECUTING);
      };
      if (observer.sceneId === target.sceneId && Math.hypot(observer.gridCol - target.gridCol, observer.gridRow - target.gridRow) < 2.5)
        run();
      else walkToCharAdjacent(observer, target, run);
    } else if (rt === 'add_status') {
      const who = p.target === 'observer' ? observer : p.target === 'both' ? null : observed;
      const sid = resolveStatusId(p.statusId);
      if (sid) {
        const targets = who ? [who] : [observer, observed];
        targets.forEach(c => CharacterEffectSystem.apply({
          type: 'state', charId: c.id, stateId: sid,
        }, { source: `observer:${row.id || 'reaction'}`, reason: row.name || '观察反应' }));
      }
    } else if (rt === 'send_bubble') {
      const text = pickBubbleText(row, observer, observed, { target: observed.action?.target });
      if (text) {
        tryObserveBubble({
          charId: observer.id, text,
          style: p.bubbleStyle || row.reactionParams?.style || 'speech',
          module: 'observe', duration: 4,
        });
      }
    } else if (rt === 'take_over_task') {
      const srcId = p.sourceCharId || observed.id;
      const qc = CONFIG.questConfig || DEFAULT_CONFIG.questConfig;
      const ids = p.templateIds || (qc.dailyRoutines || []).filter(s => s.charId === srcId).map(s => s.templateId);
      for (const tid of ids) {
        if (QuestSystem.debugIssue) QuestSystem.debugIssue(tid, null, observer.id);
      }
      log(`${observer.short}代${getChar(srcId)?.short || srcId}领差。`);
    } else if (rt === 'flee_scene') {
      const sc = CONFIG.scenes.find(s => s.id !== observer.sceneId);
      if (sc) {
        const col = sc.originCol + 2, row = sc.originRow + 2;
        enqueueAction(observer, makeMoveItem(col, row), true);
      }
    } else if (rt === 'relation_shift') {
      CharacterEffectSystem.apply({
        type: 'relation', idA: observer.id, idB: observed.id, delta: p.amount || p.delta || 0,
      }, { source: `observer:${row.id || 'reaction'}`, reason: row.name || '观察反应' });
    }

    applyAdditional(observer, observed, row.additionalEffects);
    const bubble = pickBubbleText(row, observer, observed, { target: observed.action?.target });
    if (bubble && rt !== 'send_bubble') {
      tryObserveBubble({ charId: observer.id, text: bubble, style: 'speech', module: 'observe', duration: 3 });
    }

    EventBus.emit('observer:executed', {
      reactionId: row.id, reactionName: row.name,
      observerId: observer.id, observedId: observed.id, reactionType: rt,
    });
    if (row.storyNodeId && row.storyCharId) {
      const storyChar = getChar(row.storyCharId);
      if (storyChar) LifePathSystem?.recordStoryNode?.(storyChar, row.storyNodeId);
    }
    log(`[观察] ${observer.short} → ${observed.short}：${row.name}`);
    uiDirty = true;
  }

  function observeAndReact(observer, signalCtx) {
    if (!enabled() || !isAIControlled(observer)) return;
    for (const raw of allReactions()) {
      const row = normalizeRow(raw);
      if (!matchObserver(row, observer)) continue;
      for (const other of charsInScene(observer.sceneId)) {
        if (other.id === observer.id) continue;
        if (!matchObserved(row, observer, other)) continue;
        if (!matchSignal(row, observer, other, signalCtx)) continue;
        const key = cdKey('obs', row.id, observer.id, other.id);
        if (onCooldown(observer, key, row.cooldownGameMin)) continue;
        setCooldown(observer, key, row.cooldownGameMin);
        EventBus.emit('observer:triggered', {
          reactionId: row.id, observerId: observer.id, observedId: other.id,
        });
        executeReaction(observer, other, row, signalCtx);
        return;
      }
    }
  }

  function getActionBoost(c, cand, tags) {
    const b = c._miActionBoost;
    if (!b || b.until <= getGameTimestamp()) return 1;
    if (cand.kind === 'interaction' && (cand.category === b.tag || cand.category === b.category)) return b.multiplier;
    if (tags?.includes(b.tag)) return b.multiplier;
    return 1;
  }

  function contagionCd(source, target) {
    return `cont|${source.id}|${target.id}`;
  }

  function contagionCheck(source, stateId, chainDepth) {
    if (!enabled() || !source) return;
    const sid = resolveStatusId(stateId);
    for (const row of cfg().emotionContagion || []) {
      const srcMatch = row.sourceStatusId === sid
        || resolveStatusId(row.sourceStatusTag) === sid;
      if (!srcMatch) continue;

      for (const target of charsInScene(source.sceneId)) {
        if (target.id === source.id) continue;
        const resultId = resolveStatusId(row.resultStatusId);
        if (!resultId || target.activeStates.some(s => s.id === resultId)) continue;

        if ((row.traitImmune || row.trait_immune || []).some(im => getCharTraits(target).includes(im))) {
          EventBus.emit('emotion:resisted', { sourceId: source.id, targetId: target.id, reason: 'immune' });
          continue;
        }

        const ckey = contagionCd(source, target);
        if (onCooldown(target, ckey, cfg().contagionCooldownGameMin || 5)) continue;

        let prob = row.baseProbability ?? row.probability ?? 0.3;
        const rel = getRelationValue(source.id, target.id);
        if (rel < (row.relationMin ?? row.targetRelationMin ?? -100)) {
          EventBus.emit('emotion:resisted', { sourceId: source.id, targetId: target.id, reason: 'relation' });
          continue;
        }
        prob += rel * (row.relationFactor ?? 0.003);
        const dist = gridDist(source, target);
        if (row.maxDistance && dist > row.maxDistance) continue;
        prob *= 1 / (1 + dist * (row.distanceDecay ?? 0.05));
        for (const [tr, delta] of Object.entries(row.traitModifiers || {})) {
          if (getCharTraits(target).includes(tr)) prob += delta;
        }
        prob = Math.max(0, Math.min(1, prob));

        if (Math.random() >= prob) {
          EventBus.emit('emotion:resisted', { sourceId: source.id, targetId: target.id, reason: 'roll' });
          continue;
        }

        setCooldown(target, ckey, cfg().contagionCooldownGameMin || 5);
        applyState(target, resultId);
        const st = target.activeStates.find(s => s.id === resultId);
        const sd = CONFIG.stateDefs[resultId];
        if (st && sd) {
          const pct = row.durationPercent ?? 50;
          st.remaining = Math.max(5, sd.duration * (pct / 100));
        }
        EventBus.emit('emotion:contagion', {
          sourceId: source.id, targetId: target.id, sourceStateId: sid, resultStateId: resultId, chainDepth,
        });
        if (row.showBubble && chainDepth === 0) {
          const text = pickBubbleText(row, target, source, { source });
          if (text) {
            NarrativeBubbleSystem?.showBubble?.({
              charId: target.id, text, style: 'thought', module: 'contagion', duration: 4,
            });
          }
        }
        const maxChain = row.maxContagionChain ?? 0;
        if (maxChain > 0 && chainDepth < maxChain) {
          contagionCheck(target, resultId, chainDepth + 1);
        } else if (chainDepth >= maxChain && maxChain > 0) {
          EventBus.emit('emotion:chain_end', { chainDepth, targetId: target.id });
        }
      }
    }
  }

  function onSceneEntered(enterer, oldSceneId) {
    if (!enabled()) return;
    beginObserveWave();
    for (const obs of charsInScene(enterer.sceneId)) {
      if (obs.id === enterer.id) continue;
      observeAndReact(obs, { type: 'scene_enter', charId: enterer.id });
    }
  }

  function observeScene(signalCtx, sceneId, excludeId) {
    beginObserveWave();
    for (const obs of charsInScene(sceneId)) {
      if (obs.id === excludeId) continue;
      observeAndReact(obs, signalCtx);
    }
  }

  function init() {
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    unsubs.push(EventBus.on('state:add', evt => {
      const src = getChar(evt.charId);
      if (!src) return;
      contagionCheck(src, evt.stateId, 0);
      observeScene({ type: 'status_gained', charId: src.id, stateId: evt.stateId }, src.sceneId, src.id);
    }));
    unsubs.push(EventBus.on('interaction:started', evt => {
      const initiator = getChar(evt.initiatorId);
      if (!initiator) return;
      observeScene({
        type: 'interaction', initiatorId: evt.initiatorId, targetId: evt.targetId, category: evt.category,
      }, initiator.sceneId, initiator.id);
    }));
    unsubs.push(EventBus.on('need:critical', evt => {
      const who = getChar(evt.charId);
      if (!who) return;
      observeScene({ type: 'need_critical', charId: who.id, needKey: evt.needKey }, who.sceneId, who.id);
    }));
    unsubs.push(EventBus.on('scene:entered', evt => {
      const ch = getChar(evt.charId);
      if (ch) onSceneEntered(ch, evt.oldSceneId);
    }));
  }

  return {
    init, observeAndReact, contagionCheck, getActionBoost, onSceneEntered, enabled, cfg,
  };
})();
window.MultiInteractSystem = MultiInteractSystem;
