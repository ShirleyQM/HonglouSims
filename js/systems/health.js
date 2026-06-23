/* ═══════════════════ HEALTH SYSTEM (梦想 P0：健康度·生病) ═══════════════════ */
const HealthSystem = (() => {
  const MIN = 0, MAX = 100;
  const SICK_STATE_IDS = new Set(['S703', 'sickServe', 'rezhen']);
  let unsubs = [];

  function clamp(v, min = MIN, max = MAX) {
    return Math.max(min, Math.min(max, Number.isFinite(v) ? v : max));
  }

  function initChar(c) {
    if (!c) return;
    if (c.health == null) c.health = 100;
    c.health = clamp(c.health);
    c.healthMeta ||= {};
    c.healthMeta.sickDays ||= {};
    c.healthMeta.careEvents ||= [];
    c.healthMeta.lastHealthReason ||= '';
  }

  function initAll() {
    (CHARS || []).forEach(initChar);
  }

  function getCharById(charId) {
    return typeof charId === 'string' ? getChar(charId) : charId;
  }

  function getHealth(charId) {
    const c = getCharById(charId);
    initChar(c);
    return c?.health ?? 100;
  }

  function activeSickStates(c) {
    return (c?.activeStates || []).filter(st => SICK_STATE_IDS.has(st.id) || /病|疾|温/.test(CONFIG.stateDefs?.[st.id]?.name || ''));
  }

  function isSick(charId) {
    const c = getCharById(charId);
    if (!c) return false;
    return getHealth(c) < 40 || activeSickStates(c).length > 0;
  }

  function getIllnessLevel(charId) {
    const h = getHealth(charId);
    if (h < 20) return 'critical';
    if (h < 40) return 'severe';
    if (isSick(charId)) return 'sick';
    if (h < 60) return 'light';
    return 'none';
  }

  function changeHealth(charId, delta, reason = '') {
    const c = getCharById(charId);
    if (!c || !delta) return 0;
    initChar(c);
    const old = c.health;
    c.health = clamp(old + delta);
    const actual = c.health - old;
    if (!actual) return 0;
    c.healthMeta.lastHealthReason = reason;
    if (c.health < 40 && !activeSickStates(c).length && typeof applyState === 'function') {
      applyState(c, 'S703');
    }
    EventBus.emit('health:changed', {
      charId: c.id, oldHealth: old, health: c.health, delta: actual,
      reason, illnessLevel: getIllnessLevel(c),
    });
    uiDirty = true;
    return actual;
  }

  function recordSickDay(c, day = gameDay) {
    initChar(c);
    if (!isSick(c)) return;
    c.healthMeta.sickDays[day] = true;
  }

  function getSickDays(charId, windowDays = 30) {
    const c = getCharById(charId);
    initChar(c);
    const start = gameDay - Math.max(1, windowDays) + 1;
    return Object.keys(c.healthMeta.sickDays || {})
      .map(Number)
      .filter(day => day >= start && day <= gameDay)
      .length;
  }

  function recordCareEvent(actorId, targetId, reason = '') {
    const target = getCharById(targetId);
    if (!target) return false;
    initChar(target);
    target.healthMeta.careEvents.unshift({
      actorId: typeof actorId === 'string' ? actorId : actorId?.id,
      targetId: target.id,
      reason,
      day: gameDay,
      ts: getGameTimestamp(),
    });
    target.healthMeta.careEvents = target.healthMeta.careEvents.slice(0, 30);
    changeHealth(target.id, 3, reason || 'care');
    EventBus.emit('health:care', { actorId, targetId: target.id, reason });
    return true;
  }

  function settleDaily(evt = {}) {
    const day = evt.oldDay || gameDay - 1 || gameDay;
    for (const c of CHARS || []) {
      initChar(c);
      const stat = BehaviorDailyStats?.getDay?.(c.id, day);
      const needMin = stat?.needMin || {};
      let delta = 0;
      const reasons = [];
      if ((needMin.hunger ?? c.needs?.hunger ?? 100) < 20) { delta -= 5; reasons.push('饥饿过低'); }
      else if ((needMin.hunger ?? c.needs?.hunger ?? 100) < 35) { delta -= 2; reasons.push('饥饿偏低'); }
      if ((needMin.energy ?? c.needs?.energy ?? 100) < 20) { delta -= 4; reasons.push('精力过低'); }
      else if ((needMin.energy ?? c.needs?.energy ?? 100) < 35) { delta -= 2; reasons.push('精力偏低'); }
      if ((needMin.mood ?? c.needs?.mood ?? 100) < 25) { delta -= 2; reasons.push('心绪低落'); }
      if (activeSickStates(c).length) { delta -= 3; reasons.push('病中'); }
      const careToday = (c.healthMeta.careEvents || []).some(row => row.day === day);
      if (careToday) { delta += 4; reasons.push('有人照顾'); }
      if ((needMin.hunger ?? 0) >= 55 && (needMin.energy ?? 0) >= 55 && !activeSickStates(c).length) {
        delta += 1;
        reasons.push('起居尚稳');
      }
      if (isSick(c)) recordSickDay(c, day);
      if (delta) changeHealth(c.id, delta, `日结：${reasons.join('、')}`);
    }
  }

  function serializeChar(c) {
    initChar(c);
    return {
      health: c.health,
      healthMeta: JSON.parse(JSON.stringify(c.healthMeta || {})),
    };
  }

  function applyChar(c, snap = {}) {
    if (!c) return;
    c.health = clamp(snap.health ?? c.health ?? 100);
    c.healthMeta = JSON.parse(JSON.stringify(snap.healthMeta || c.healthMeta || {}));
    initChar(c);
  }

  function init() {
    unsubs.forEach(fn => fn?.());
    unsubs = [];
    initAll();
    unsubs.push(EventBus.on('time:day', settleDaily));
  }

  return {
    init, initChar, initAll,
    getHealth, changeHealth, isSick, getIllnessLevel, getSickDays, recordCareEvent,
    serializeChar, applyChar,
  };
})();
window.HealthSystem = HealthSystem;
