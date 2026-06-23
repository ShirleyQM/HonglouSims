/* ═══════════════════ BEHAVIOR DAILY STATS (梦想 P0：每日统计) ═══════════════════ */
const BehaviorDailyStats = (() => {
  const MAX_DAYS = 30;
  let stats = {};
  let worldEvents = {};
  let unsubs = [];

  function ensureCharDay(charId, day = gameDay) {
    if (!charId) return null;
    const byChar = (stats[charId] ||= {});
    const row = (byChar[day] ||= {
      day,
      needMin: {},
      actionTagMinutes: {},
      visitedSceneIds: [],
      flags: {},
    });
    return row;
  }

  function trimChar(charId) {
    const byChar = stats[charId];
    if (!byChar) return;
    const keepFrom = gameDay - MAX_DAYS + 1;
    for (const day of Object.keys(byChar)) {
      if (+day < keepFrom) delete byChar[day];
    }
  }

  function recordNeedSnapshot(char) {
    if (!char?.id) return;
    const row = ensureCharDay(char.id);
    for (const [key, value] of Object.entries(char.needs || {})) {
      const rounded = Math.round((value || 0) * 10) / 10;
      row.needMin[key] = row.needMin[key] == null ? rounded : Math.min(row.needMin[key], rounded);
    }
    trimChar(char.id);
  }

  function addMinutes(bucket, key, minutes) {
    if (!key || !minutes) return;
    bucket[key] = Math.round(((bucket[key] || 0) + minutes) * 10) / 10;
  }

  function recordAction(charId, tags = [], durationGameMin = 0) {
    const row = ensureCharDay(charId);
    if (!row) return;
    const mins = Math.max(0, Number(durationGameMin) || 0);
    for (const tag of tags.filter(Boolean)) addMinutes(row.actionTagMinutes, tag, mins);
    const socialMin = (row.actionTagMinutes.social || 0) + (row.actionTagMinutes.xujiu || 0)
      + (row.actionTagMinutes.tiaoxiao || 0) + (row.actionTagMinutes.chuanqing || 0);
    const funMin = (row.actionTagMinutes.fun || 0) + (row.actionTagMinutes.lively || 0)
      + (row.actionTagMinutes.wine || 0) + (row.actionTagMinutes.outdoor || 0);
    row.flags.funSatisfiedDay = funMin >= 30 || (row.needMin.fun ?? 0) >= 55;
    row.flags.solitudeDay = (row.actionTagMinutes.solitude || 0) >= 60 || socialMin <= 10;
    EventBus.emit('daily_stats:action', { charId, tags, durationGameMin: mins, day: row.day });
  }

  function recordSceneVisit(charId, sceneId) {
    const row = ensureCharDay(charId);
    if (!row || !sceneId) return;
    if (!row.visitedSceneIds.includes(sceneId)) row.visitedSceneIds.push(sceneId);
  }

  function recordWorldEvent(tags = [], context = {}) {
    const row = (worldEvents[gameDay] ||= { day: gameDay, tags: [], events: [] });
    row.tags.push(...tags.filter(Boolean));
    row.tags = [...new Set(row.tags)];
    row.events.unshift({ tags: tags.slice(), context, ts: getGameTimestamp() });
  }

  function getDay(charId, day = gameDay) {
    return stats[charId]?.[day] || null;
  }

  function getWindow(charId, days = 7) {
    const start = gameDay - Math.max(1, days) + 1;
    return Object.values(stats[charId] || {})
      .filter(row => row.day >= start && row.day <= gameDay)
      .sort((a, b) => a.day - b.day);
  }

  function countFlagDays(charId, flag, days = 7) {
    return getWindow(charId, days).filter(row => !!row.flags?.[flag]).length;
  }

  function getVisitedSceneCount(charId, days = 30) {
    const ids = new Set();
    getWindow(charId, days).forEach(row => (row.visitedSceneIds || []).forEach(id => ids.add(id)));
    return ids.size;
  }

  function disasterFreeDays(days = 7) {
    let free = 0;
    for (let day = gameDay; day > Math.max(0, gameDay - days); day--) {
      const tags = worldEvents[day]?.tags || [];
      if (tags.includes('disaster') || tags.includes('major')) break;
      free++;
    }
    return free;
  }

  function onTick() {
    (CHARS || []).forEach(recordNeedSnapshot);
  }

  function onFurnitureComplete(evt) {
    const tpl = getTemplate(evt.templateId);
    const action = (tpl?.actions || []).find(a => a.id === evt.actionId);
    const tags = [
      tpl?.category,
      ...(tpl?.tags || []),
      ...(action?.tags || []),
    ].filter(Boolean);
    const duration = action?.duration ?? tpl?.duration ?? 0;
    recordAction(evt.charId, tags, duration * GAME_MINUTES_PER_REAL_SEC);
  }

  function onInteractionComplete(evt) {
    recordAction(evt.initiatorId, ['social', evt.category], 8);
    recordAction(evt.targetId, ['social', evt.category], 8);
  }

  function serialize() {
    return { stats: JSON.parse(JSON.stringify(stats)), worldEvents: JSON.parse(JSON.stringify(worldEvents)) };
  }

  function apply(state = {}) {
    stats = JSON.parse(JSON.stringify(state.stats || {}));
    worldEvents = JSON.parse(JSON.stringify(state.worldEvents || {}));
  }

  function init() {
    unsubs.forEach(fn => fn?.());
    unsubs = [];
    (CHARS || []).forEach(c => {
      recordNeedSnapshot(c);
      recordSceneVisit(c.id, c.sceneId);
    });
    unsubs.push(EventBus.on('time:tick', onTick));
    unsubs.push(EventBus.on('scene:entered', evt => recordSceneVisit(evt.charId, evt.sceneId)));
    unsubs.push(EventBus.on('furniture:complete', onFurnitureComplete));
    unsubs.push(EventBus.on('interaction:complete', onInteractionComplete));
  }

  return {
    init, recordNeedSnapshot, recordAction, recordSceneVisit, recordWorldEvent,
    getDay, getWindow, countFlagDays, getVisitedSceneCount, disasterFreeDays,
    serialize, apply,
  };
})();
window.BehaviorDailyStats = BehaviorDailyStats;
