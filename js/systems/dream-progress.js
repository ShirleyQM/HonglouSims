/* ═══════════════════ DREAM PROGRESS STORE (梦想 P0：计数与里程碑) ═══════════════════ */
const DreamProgressStore = (() => {
  let unsubs = [];

  function cfg() {
    return CONFIG.charSpecialtyConfig || {};
  }

  function dreamTypeFor(charId) {
    return cfg().dreamProfiles?.[charId]?.type || '';
  }

  function ensure(charId, dreamType = dreamTypeFor(charId)) {
    const c = getChar(charId);
    if (!c || !dreamType) return null;
    c.dreamProgress ||= {};
    const row = (c.dreamProgress[dreamType] ||= {
      counters: {},
      milestones: {},
      lastTouchedAt: 0,
      lastReasons: [],
    });
    row.counters ||= {};
    row.milestones ||= {};
    row.lastReasons ||= [];
    return row;
  }

  function touch(charId, dreamType, reason) {
    const row = ensure(charId, dreamType);
    if (!row) return;
    row.lastTouchedAt = getGameTimestamp();
    if (reason) {
      row.lastReasons.unshift({
        text: typeof reason === 'string' ? reason : reason.reason || reason.source || 'progress',
        source: typeof reason === 'object' ? reason.source : '',
        ts: getGameTimestamp(),
        day: gameDay,
      });
      row.lastReasons = row.lastReasons.slice(0, 8);
    }
  }

  function addCounter(charId, key, delta = 1, source = {}) {
    const row = ensure(charId);
    if (!row || !key || !delta) return 0;
    const old = row.counters[key] || 0;
    row.counters[key] = Math.max(0, old + delta);
    touch(charId, dreamTypeFor(charId), source);
    EventBus.emit('dream:progress', {
      charId, dreamType: dreamTypeFor(charId), key,
      before: old, after: row.counters[key], delta, source,
    });
    uiDirty = true;
    return row.counters[key] - old;
  }

  function setCounter(charId, key, value = 0, source = {}) {
    const row = ensure(charId);
    if (!row || !key) return 0;
    const old = row.counters[key] || 0;
    row.counters[key] = Math.max(0, Number(value) || 0);
    touch(charId, dreamTypeFor(charId), source);
    EventBus.emit('dream:progress', {
      charId, dreamType: dreamTypeFor(charId), key,
      before: old, after: row.counters[key], delta: row.counters[key] - old, source,
    });
    uiDirty = true;
    return row.counters[key];
  }

  function getCounter(charId, key) {
    const row = ensure(charId);
    return row?.counters?.[key] || 0;
  }

  function markMilestone(charId, key, value = true, source = {}) {
    const row = ensure(charId);
    if (!row || !key) return false;
    row.milestones[key] = value;
    touch(charId, dreamTypeFor(charId), source);
    EventBus.emit('dream:milestone', { charId, dreamType: dreamTypeFor(charId), key, value, source });
    return true;
  }

  function recordReason(charId, dreamType, reason) {
    touch(charId, dreamType || dreamTypeFor(charId), reason);
  }

  function serializeChar(c) {
    return { dreamProgress: JSON.parse(JSON.stringify(c?.dreamProgress || {})) };
  }

  function applyChar(c, snap = {}) {
    if (!c) return;
    c.dreamProgress = JSON.parse(JSON.stringify(snap.dreamProgress || c.dreamProgress || {}));
  }

  function onQuestCompleted(evt) {
    const tpl = QuestSystem?.tpl?.(evt.templateId);
    const cat = tpl?.category || '';
    if (/功课|文墨|课业/.test(cat)) addCounter(evt.assigneeId, 'studyTasks', 1, { source: 'quest', reason: cat });
    if (/家务|洒扫|侍奉|理事|采办|传话/.test(cat)) {
      addCounter(evt.assigneeId, 'managedTasks', 1, { source: 'quest', reason: cat });
      if (evt.issuerId) addCounter(evt.issuerId, 'managedTasks', 1, { source: 'quest_issuer', reason: cat });
    }
    if (/陪伴|侍奉|照看|传话/.test(cat)) addCounter(evt.assigneeId, 'protectedEvents', 1, { source: 'quest', reason: cat });
    if (/修福|照拂|侍奉/.test(cat)) addCounter(evt.assigneeId, 'helpedEvents', 1, { source: 'quest', reason: cat });
  }

  function onInteractionComplete(evt) {
    if (/weijie|安慰|照拂|陪伴/.test(evt.category || evt.interactionName || '')) {
      addCounter(evt.initiatorId, 'protectedEvents', 1, { source: 'interaction', reason: evt.interactionName });
      HealthSystem?.recordCareEvent?.(evt.initiatorId, evt.targetId, evt.interactionName);
    }
    if (/zhengchi|争执/.test(evt.category || evt.interactionName || '')) {
      addCounter(evt.initiatorId, 'conflictResolved', 0, { source: 'interaction', reason: '争执发生' });
    }
  }

  function initAllChars() {
    (CHARS || []).forEach(c => ensure(c.id));
  }

  function init() {
    unsubs.forEach(fn => fn?.());
    unsubs = [];
    initAllChars();
    unsubs.push(EventBus.on('quest:completed', onQuestCompleted));
    unsubs.push(EventBus.on('interaction:complete', onInteractionComplete));
  }

  return {
    init, initAllChars, ensure,
    addCounter, setCounter, getCounter, markMilestone, recordReason,
    serializeChar, applyChar,
  };
})();
window.DreamProgressStore = DreamProgressStore;
