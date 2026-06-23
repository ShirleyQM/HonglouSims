/* ═══════════════════ MONEY / FAMILY FUND (银两·府库) ═══════════════════ */
const MoneySystem = (() => {
  function cfg() {
    return CONFIG.moneyConfig || DEFAULT_CONFIG.moneyConfig || {};
  }

  function initChar(c) {
    if (!c) return;
    if (c.money == null) c.money = cfg().defaultPersonal ?? 0;
    if (!c.pathFlags) c.pathFlags = {};
    if (!c.agents) c.agents = {};
  }

  function initAll() {
    CHARS?.forEach(initChar);
  }

  function getBalance(c) {
    initChar(c);
    return c.money ?? 0;
  }

  function changeMoney(c, delta, reason) {
    if (!c || !delta) return 0;
    initChar(c);
    const old = c.money ?? 0;
    c.money = Math.max(0, Math.round(old + delta));
    EventBus.emit('money:change', { charId: c.id, delta, balance: c.money, reason });
    uiDirty = true;
    return c.money - old;
  }

  function getFamilyFund(familyId) {
    return FamilySystem?.getFund?.(familyId) ?? 0;
  }

  function changeFamilyFund(familyId, delta, reason) {
    delta = Math.round(delta || 0);
    if (!delta) return 0;
    const changed = delta > 0
      ? FamilySystem?.depositFund?.(familyId, delta, reason)
      : -(FamilySystem?.withdrawFund?.(familyId, -delta, reason) || 0);
    EventBus.emit('money:family', {
      familyId, delta: changed || 0, fund: getFamilyFund(familyId), reason,
    });
    return changed || 0;
  }

  function setPathFlag(c, key, delta) {
    if (!c || !key) return;
    initChar(c);
    c.pathFlags[key] = (c.pathFlags[key] || 0) + (delta || 0);
  }

  function getPathFlag(c, key) {
    initChar(c);
    return c.pathFlags[key] || 0;
  }

  function registerAgent(c, agentId, loyalty) {
    if (!c || !agentId) return;
    initChar(c);
    c.agents[agentId] = { loyalty: loyalty ?? 50, sinceDay: typeof gameDay !== 'undefined' ? gameDay : 0 };
    log(`${c.short}收${getChar(agentId)?.short || agentId}为心腹。`, 'social');
  }

  function hasAgent(c, agentId) {
    return !!c?.agents?.[agentId];
  }

  function serializeChar(c) {
    return {
      money: c.money ?? 0,
      pathFlags: Object.assign({}, c.pathFlags || {}),
      agents: Object.assign({}, c.agents || {}),
    };
  }

  function applyChar(c, row) {
    if (!c || !row) return;
    c.money = row.money ?? cfg().defaultPersonal ?? 0;
    c.pathFlags = Object.assign({}, row.pathFlags || {});
    c.agents = Object.assign({}, row.agents || {});
  }

  function init() {
    initAll();
  }

  return {
    cfg, init, initChar, initAll,
    getBalance, changeMoney,
    getFamilyFund, changeFamilyFund,
    setPathFlag, getPathFlag,
    registerAgent, hasAgent,
    serializeChar, applyChar,
  };
})();
window.MoneySystem = MoneySystem;
