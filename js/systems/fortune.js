/* ═══════════════════ FORTUNE EVENTS (奇遇·报恩) ═══════════════════ */
const FortuneSystem = (() => {
  let cooldowns = {};

  function cfg() {
    return CONFIG.fortuneConfig || DEFAULT_CONFIG.fortuneConfig || {};
  }

  function canTrigger(ev, c) {
    if (!ev || !c) return false;
    const cdKey = `${c.id}|${ev.id}`;
    if (cooldowns[cdKey] > getGameTimestamp()) return false;
    if (ev.pathId && c.lifePath !== ev.pathId) return false;
    if (ev.requiredStoryNode && !LifePathSystem?.isNodeDone?.(c, ev.requiredStoryNode)) return false;
    if (ev.minPathFlag) {
      for (const [k, min] of Object.entries(ev.minPathFlag)) {
        if ((MoneySystem?.getPathFlag?.(c, k) || 0) < min) return false;
      }
    }
    if (ev.maxPathFlag) {
      for (const [k, max] of Object.entries(ev.maxPathFlag)) {
        if ((MoneySystem?.getPathFlag?.(c, k) || 0) > max) return false;
      }
    }
    if (ev.minReputation != null && (c.reputation ?? 0) < ev.minReputation) return false;
    return true;
  }

  function applyEffects(c, effects) {
    for (const ef of effects || []) {
      if (ef.type === 'reputation') LifePathSystem?.changeReputation?.(c, ef.delta, 'fortune');
      else if (ef.type === 'money') MoneySystem?.changeMoney?.(c, ef.delta, 'fortune');
      else if (ef.type === 'pathFlag') MoneySystem?.setPathFlag?.(c, ef.key, ef.delta);
      else if (ef.type === 'state') applyState(c, ef.stateId);
      else if (ef.type === 'familyFund') {
        const fam = FamilySystem?.findFamilyOfChar?.(c.id);
        if (fam) MoneySystem?.changeFamilyFund?.(fam.id, ef.delta, 'fortune');
      } else if (ef.type === 'axis' && typeof changeRelationAxis === 'function') {
        changeRelationAxis(c.id, ef.targetId, ef.axis, ef.delta);
      }
    }
  }

  function triggerEvent(ev, c) {
    if (!canTrigger(ev, c)) return false;
    applyEffects(c, ev.effects);
    const cdMin = ev.cooldownGameMin ?? 4320;
    cooldowns[`${c.id}|${ev.id}`] = getGameTimestamp() + cdMin;
    log(`${c.short}·奇遇「${ev.name}」`, 'social');
    if (ev.bubble) {
      NarrativeBubbleSystem?.showBubble?.({ charId: c.id, text: ev.bubble, style: 'thought', module: 'fortune' });
    }
    EventBus.emit('fortune:triggered', { charId: c.id, eventId: ev.id, name: ev.name });
    uiDirty = true;
    return true;
  }

  function onStoryNode(evt) {
    const c = getChar(evt?.charId);
    if (!c) return;
    for (const ev of cfg().events || []) {
      if (ev.triggerStoryNode !== evt.nodeId) continue;
      triggerEvent(ev, c);
    }
  }

  function checkGreedCrisis(c) {
    const greed = MoneySystem?.getPathFlag?.(c, 'greedCount') || 0;
    const threshold = cfg().greedCrisisThreshold ?? 3;
    if (greed < threshold) return;
    const ev = (cfg().events || []).find(e => e.id === 'greed_crisis');
    if (ev && canTrigger(ev, c)) triggerEvent(ev, c);
  }

  function init() {
    EventBus.on('lifePath:storyNode', onStoryNode);
  }

  function serialize() {
    return { cooldowns: Object.assign({}, cooldowns) };
  }

  function apply(snap) {
    cooldowns = Object.assign({}, snap?.cooldowns || {});
  }

  return { cfg, init, triggerEvent, checkGreedCrisis, serialize, apply };
})();
window.FortuneSystem = FortuneSystem;
