/* ═══════════════════ NEED BAND & COMBINATION STATES ═══════════════════ */
const NeedStateSystem = (() => {
  function ensureChar(c) {
    if (!c) return;
    c.needMeta ||= {};
    c.needMeta.needBandIds ||= {};
    c.needMeta.needCombinationActive ||= {};
  }

  function matchesBand(value, band) {
    if (band.minInclusive != null && value < band.minInclusive) return false;
    if (band.maxExclusive != null && value >= band.maxExclusive) return false;
    return true;
  }

  function currentBand(needDef, value) {
    return (needDef.stateBands || []).find(band => matchesBand(value, band)) || null;
  }

  function syncBands(c) {
    for (const needDef of getNeedDefs()) {
      const band = currentBand(needDef, c.needs?.[needDef.key] ?? needDef.defaultValue ?? 70);
      const nextId = band?.id || '';
      const previousId = c.needMeta.needBandIds[needDef.key] || '';
      const stateStillActive = nextId && c.activeStates?.some(st => st.id === nextId);
      if (nextId === previousId && (!nextId || stateStillActive)) continue;
      c.needMeta.needBandIds[needDef.key] = nextId;
      if (nextId) applyState(c, nextId);
      EventBus.emit('need:band_changed', {
        charId: c.id,
        needKey: needDef.key,
        previousStateId: previousId || null,
        stateId: nextId || null,
      });
    }
  }

  function ruleSatisfied(c, rule) {
    return (rule.all || []).every(cond => {
      const value = c.needs?.[cond.need] ?? 0;
      if (cond.min != null && value < cond.min) return false;
      if (cond.max != null && value > cond.max) return false;
      return true;
    });
  }

  function syncCombinations(c) {
    const matched = (CONFIG.needCombinationStates || [])
      .filter(rule => ruleSatisfied(c, rule))
      .sort((a, b) => (b.all?.length || 0) - (a.all?.length || 0))[0];
    const nextId = matched?.stateId || '';
    const previousId = c.needMeta.needCombinationStateId || '';
    const stateStillActive = nextId && c.activeStates?.some(st => st.id === nextId);
    if (nextId === previousId && (!nextId || stateStillActive)) return;
    c.needMeta.needCombinationStateId = nextId;
    if (!nextId) return;
    applyState(c, nextId);
    EventBus.emit('need:combination_triggered', {
      charId: c.id,
      stateId: nextId,
      conditions: matched.all,
    });
  }

  function sync(c) {
    if (!c?.needs) return;
    ensureChar(c);
    syncBands(c);
    syncCombinations(c);
  }

  function init() {
    CHARS.forEach(c => {
      ensureChar(c);
      const savedIndicator = Object.values(CONFIG.stateDefs || {})
        .some(sd => (sd.category === 'needBand' || sd.category === 'needCombo') && sd.name === c.statusText);
      if (savedIndicator) c.statusText = '闲庭漫步';
      // 首帧根据当前值生成标签；不预填 band，确保新局和读档都能补齐。
      c.needMeta.needBandIds = {};
      c.needMeta.needCombinationStateId = '';
      sync(c);
    });
  }

  function traitStateEffects(c, stateDef) {
    const out = [];
    const traits = typeof getCharTraits === 'function' ? getCharTraits(c) : [];
    for (const traitId of traits) {
      const effect = stateDef?.traitEffects?.[traitId];
      if (effect) out.push(effect);
    }
    return out;
  }

  return { init, sync, currentBand, traitStateEffects };
})();

window.NeedStateSystem = NeedStateSystem;
