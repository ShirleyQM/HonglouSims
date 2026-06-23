const FurnitureReactionSystem = (() => {
  let unsubs = [];
  let initialized = false;
  const cooldowns = {};

  function cfg() {
    return CONFIG.furnitureReactionConfig || DEFAULT_CONFIG.furnitureReactionConfig || {};
  }

  function enabled() {
    return cfg().masterEnabled !== false;
  }

  function now() {
    return typeof getGameTimestamp === 'function' ? getGameTimestamp() : 0;
  }

  function sameSceneObservers(actor, maxDistance) {
    return CHARS.filter(c => c.id !== actor.id && c.sceneId === actor.sceneId)
      .filter(c => maxDistance == null || Math.hypot(c.gridCol - actor.gridCol, c.gridRow - actor.gridRow) <= maxDistance);
  }

  function cdKey(row, observer, actor) {
    return `${row.id || row.name}|${observer.id}|${actor.id}`;
  }

  function onCooldown(row, observer, actor) {
    return (cooldowns[cdKey(row, observer, actor)] || 0) > now();
  }

  function markCooldown(row, observer, actor) {
    cooldowns[cdKey(row, observer, actor)] = now() + (row.cooldownGameMin || cfg().defaultCooldownGameMin || 60);
  }

  function actionTags(tpl, action, evt) {
    return [
      tpl.category,
      tpl.lifeLine,
      evt.category,
      evt.actionId,
      ...(action?.tags || []),
    ].filter(Boolean).map(String);
  }

  function hasAny(haystack, needles) {
    if (!needles?.length) return true;
    const set = new Set(haystack);
    return needles.some(n => set.has(String(n)));
  }

  function charHasAnyTrait(c, traits) {
    if (!traits?.length) return true;
    const own = new Set(getCharTraits(c));
    return traits.some(t => own.has(t));
  }

  function charHasAnyState(c, stateIds) {
    if (!stateIds?.length) return true;
    const own = new Set((c.activeStates || []).map(s => s.id));
    return stateIds.some(id => own.has(id));
  }

  function relationOk(row, observer, actor) {
    if (!row.relationRange) return true;
    const [lo, hi] = row.relationRange;
    const val = getRelationValue?.(observer.id, actor.id) ?? 0;
    return val >= lo && val <= hi;
  }

  function matches(row, observer, actor, tpl, action, tags, evt) {
    if (row.observerCharId && row.observerCharId !== observer.id) return false;
    if (row.actorCharId && row.actorCharId !== actor.id) return false;
    if (row.templateIds?.length && !row.templateIds.includes(evt.templateId)) return false;
    if (row.categories?.length && !row.categories.includes(tpl.category)) return false;
    if (row.actionIds?.length && !row.actionIds.includes(evt.actionId)) return false;
    if (!hasAny(tags, row.tags)) return false;
    if (!charHasAnyTrait(observer, row.observerTraits)) return false;
    if (!charHasAnyTrait(actor, row.actorTraits)) return false;
    if (!charHasAnyState(observer, row.observerStates)) return false;
    if (!charHasAnyState(actor, row.actorStates)) return false;
    if (!relationOk(row, observer, actor)) return false;
    if (onCooldown(row, observer, actor)) return false;
    return true;
  }

  function fillText(text, ctx) {
    return String(text || '')
      .replace(/\{observer\.name\}/g, ctx.observer?.short || '')
      .replace(/\{actor\.name\}/g, ctx.actor?.short || '')
      .replace(/\{furniture\.name\}/g, ctx.tpl?.name || '')
      .replace(/\{action\.name\}/g, ctx.action?.name || '使用')
      .replace(/\{scene\.name\}/g, ctx.scene?.name || '')
      .replace(/\{observer\}/g, ctx.observer?.short || '')
      .replace(/\{actor\}/g, ctx.actor?.short || '')
      .replace(/\{furniture\}/g, ctx.tpl?.name || '')
      .replace(/\{action\}/g, ctx.action?.name || '使用');
  }

  function pickText(row, ctx) {
    const pool = row.bubbleTexts || row.texts || [];
    if (!pool.length) return '';
    return fillText(pool[Math.floor(Math.random() * pool.length)], ctx);
  }

  function applyEffects(row, observer, actor, ctx) {
    for (const ef of row.effects || []) {
      const target = ef.target === 'actor' ? actor : ef.target === 'both' ? null : observer;
      const targets = target ? [target] : [observer, actor];
      for (const c of targets) {
        if (ef.type === 'need') CharacterEffectSystem?.apply?.({
          type: 'need', charId: c.id, key: ef.need || ef.key, delta: ef.delta || 0,
        }, { source: `furnitureReaction:${row.id || 'rule'}`, reason: row.name || ctx.action?.name || '家具旁观' });
        if (ef.type === 'state') CharacterEffectSystem?.apply?.({
          type: 'state', charId: c.id, stateId: ef.stateId || ef.param,
        }, { source: `furnitureReaction:${row.id || 'rule'}`, reason: row.name || ctx.action?.name || '家具旁观' });
      }
      if (ef.type === 'relation') CharacterEffectSystem?.apply?.({
        type: 'relation', idA: observer.id, idB: actor.id, delta: ef.delta || 0,
      }, { source: `furnitureReaction:${row.id || 'rule'}`, reason: row.name || ctx.action?.name || '家具旁观' });
    }
  }

  function execute(row, observer, actor, ctx) {
    markCooldown(row, observer, actor);
    const text = pickText(row, ctx);
    let shown = false;
    if (text && NarrativeBubbleSystem?.showBubble) {
      shown = NarrativeBubbleSystem.showBubble({
        charId: observer.id,
        text,
        style: row.style || 'speech',
        module: 'furnitureReaction',
        duration: row.duration || 4,
      });
    }
    applyEffects(row, observer, actor, ctx);
    EventBus.emit('furniture:reaction', {
      reactionId: row.id,
      reactionName: row.name,
      observerId: observer.id,
      actorId: actor.id,
      instanceId: ctx.evt.instanceId,
      templateId: ctx.evt.templateId,
      actionId: ctx.evt.actionId,
      shown,
    });
    if (row.log !== false) log(`[家具旁观] ${observer.short}看见${actor.short}${ctx.action?.name || '使用' + ctx.tpl.name}：${row.name}`);
  }

  function onFurnitureUseStarted(evt) {
    if (!enabled()) return;
    const actor = getChar(evt.charId);
    const inst = getInstance(evt.instanceId);
    const tpl = evt.templateId ? getTemplate(evt.templateId) : inst && getTemplate(inst.templateId);
    if (!actor || !inst || !tpl) return;
    const action = getFurnitureActions(tpl).find(a => String(a.id || 'default_use') === String(evt.actionId || 'default_use'));
    const tags = actionTags(tpl, action, evt);
    const scene = getScene?.(inst.sceneId) || sceneAt?.(actor.gridCol, actor.gridRow);
    const ctx = { evt, actor, inst, tpl, action, tags, scene };
    const observers = sameSceneObservers(actor, cfg().maxDistance);
    if (!observers.length) return;
    const rows = (cfg().rules || []).slice().sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
    let emitted = 0;
    const max = cfg().maxPerEvent ?? 1;
    for (const row of rows) {
      for (const observer of observers) {
        if (emitted >= max) return;
        if (!matches(row, observer, actor, tpl, action, tags, evt)) continue;
        execute(row, observer, actor, ctx);
        emitted++;
        break;
      }
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;
    unsubs.forEach(fn => fn?.());
    unsubs = [EventBus.on('furniture:use_started', onFurnitureUseStarted)];
  }

  function reload() {
    initialized = false;
    init();
  }

  return { init, reload };
})();

window.FurnitureReactionSystem = FurnitureReactionSystem;
