/* ═══════════════════ REPUTATION DOMAIN SYSTEM (P1：分域声望) ═══════════════════ */
const ReputationDomainSystem = (() => {
  const DEFAULT_DOMAINS = {
    general: { label: '声望', identityWeight: 1, servantWeight: 0.8, masterWeight: 1 },
    family: { label: '面子', identityWeight: 1.2, servantWeight: 1.1, masterWeight: 1.2 },
    servant: { label: '仆从口碑', identityWeight: 0.9, servantWeight: 1.5, masterWeight: 0.7 },
    scholarly: { label: '才名', identityWeight: 0.8, servantWeight: 0.5, masterWeight: 1 },
    official: { label: '功名', identityWeight: 1, servantWeight: 0.4, masterWeight: 1.2 },
    outside: { label: '口碑', identityWeight: 0.9, servantWeight: 0.6, masterWeight: 1.1 },
  };

  const PATH_DOMAIN_MAP = {
    servant_in_house: ['servant', 'family'],
    xiren_concubine: ['servant', 'family'],
    xifeng_steward: ['family', 'servant', 'outside'],
    merchant_path: ['outside', 'family'],
    scholar_path: ['scholarly', 'official'],
    farmer_path: ['outside', 'family'],
    craftsman_path: ['scholarly', 'outside'],
    palace_path: ['official', 'family'],
    concubine_path: ['family', 'servant'],
  };

  const REWARD_DOMAIN_MAP = {
    pathTask: null,
    talentPraise: ['scholarly', 'general'],
    charity: ['family', 'outside', 'general'],
    scandal: ['family', 'outside', 'general'],
    legalTrouble: ['official', 'outside', 'general'],
    quitPath: ['general'],
    storyNode: null,
  };

  let unsubs = [];

  function cfg() {
    const repCfg = CONFIG.reputationDomainConfig || DEFAULT_CONFIG.reputationDomainConfig || {};
    return {
      domains: { ...DEFAULT_DOMAINS, ...(repCfg.domains || {}) },
      pathDomains: { ...PATH_DOMAIN_MAP, ...(repCfg.pathDomains || {}) },
      rewardDomains: { ...REWARD_DOMAIN_MAP, ...(repCfg.rewardDomains || {}) },
      max: repCfg.max ?? CONFIG.lifePathConfig?.settings?.maxReputation ?? 1000,
      min: repCfg.min ?? 0,
      syncGeneralToLegacy: repCfg.syncGeneralToLegacy !== false,
      legacySyncMode: repCfg.legacySyncMode || 'max',
    };
  }

  function domainIds() {
    return Object.keys(cfg().domains || DEFAULT_DOMAINS);
  }

  function clamp(v) {
    const c = cfg();
    return Math.max(c.min, Math.min(c.max, Math.round(Number(v) || 0)));
  }

  function getCharRef(charOrId) {
    if (!charOrId) return null;
    if (typeof charOrId === 'object') return charOrId;
    return typeof getChar === 'function'
      ? getChar(charOrId)
      : CHARS?.find(c => c.id === charOrId);
  }

  function initChar(c) {
    if (!c) return;
    const legacy = clamp(c.reputation ?? 0);
    c.reputationDomains ||= {};
    for (const id of domainIds()) {
      if (c.reputationDomains[id] == null) c.reputationDomains[id] = id === 'general' ? legacy : 0;
      c.reputationDomains[id] = clamp(c.reputationDomains[id]);
    }
    c.reputationLog ||= [];
    if (c.reputation == null) c.reputation = c.reputationDomains.general || legacy;
  }

  function init() {
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    CHARS?.forEach(initChar);
    if (EventBus?.on) {
      unsubs.push(EventBus.on('lifePath:started', evt => {
        const c = getCharRef(evt?.charId);
        if (c) ensurePathDomains(c);
      }));
      unsubs.push(EventBus.on('lifePath:promoted', evt => {
        const c = getCharRef(evt?.charId);
        if (c) ensurePathDomains(c);
      }));
    }
  }

  function get(cOrId, domain = 'general') {
    const c = getCharRef(cOrId);
    if (!c) return 0;
    initChar(c);
    return c.reputationDomains?.[domain] ?? 0;
  }

  function set(cOrId, domain, value, meta = {}) {
    const c = getCharRef(cOrId);
    if (!c || !domain) return 0;
    initChar(c);
    const old = get(c, domain);
    const next = clamp(value);
    c.reputationDomains[domain] = next;
    const actual = next - old;
    if (actual !== 0) recordChange(c, domain, actual, next, meta);
    syncLegacy(c);
    return actual;
  }

  function change(cOrId, domain, delta, reason = '', meta = {}) {
    const c = getCharRef(cOrId);
    if (!c || !domain || !delta) return 0;
    return set(c, domain, get(c, domain) + delta, { ...meta, reason });
  }

  function changeMany(cOrId, domains, delta, reason = '', meta = {}) {
    const c = getCharRef(cOrId);
    if (!c || !delta) return {};
    const ids = normalizeDomains(c, domains, meta);
    const out = {};
    for (const id of ids) out[id] = change(c, id, delta, reason, meta);
    if (!ids.includes('general')) {
      const generalDelta = Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta) * 0.35));
      out.general = change(c, 'general', generalDelta, reason, { ...meta, derived: true });
    }
    return out;
  }

  function normalizeDomains(c, domains, meta = {}) {
    if (Array.isArray(domains) && domains.length) return [...new Set(domains)];
    if (typeof domains === 'string' && domains) return [domains];
    const pathId = meta.pathId || c?.lifePath || '';
    const byReward = meta.rewardKey ? cfg().rewardDomains?.[meta.rewardKey] : null;
    if (Array.isArray(byReward) && byReward.length) return byReward;
    const byPath = pathId ? cfg().pathDomains?.[pathId] : null;
    if (Array.isArray(byPath) && byPath.length) return byPath;
    return ['general'];
  }

  function recordChange(c, domain, delta, value, meta = {}) {
    const entry = {
      day: typeof gameDay !== 'undefined' ? gameDay : 0,
      domain,
      delta,
      value,
      reason: meta.reason || '',
      source: meta.source || meta.rewardKey || '',
      pathId: meta.pathId || c.lifePath || '',
      stageId: meta.stageId || c.currentStage || '',
    };
    c.reputationLog.unshift(entry);
    c.reputationLog = c.reputationLog.slice(0, 30);
    EventBus?.emit?.('reputation_domain:change', {
      charId: c.id, domain, delta, value, reason: entry.reason,
      source: entry.source, pathId: entry.pathId, stageId: entry.stageId,
    });
  }

  function syncLegacy(c) {
    if (!cfg().syncGeneralToLegacy) return;
    const vals = c.reputationDomains || {};
    c.reputation = cfg().legacySyncMode === 'general'
      ? (vals.general || 0)
      : Math.max(vals.general || 0, ...Object.values(vals).map(v => Number(v) || 0));
  }

  function ensurePathDomains(cOrId) {
    const c = getCharRef(cOrId);
    if (!c) return [];
    initChar(c);
    const domains = normalizeDomains(c, null, { pathId: c.lifePath });
    for (const id of domains) {
      if (c.reputationDomains[id] == null) c.reputationDomains[id] = 0;
    }
    syncLegacy(c);
    return domains;
  }

  function getBestDomain(cOrId) {
    const c = getCharRef(cOrId);
    if (!c) return { domain: 'general', value: 0, label: '声望' };
    initChar(c);
    const entries = Object.entries(c.reputationDomains || {});
    const [domain, value] = entries.sort((a, b) => b[1] - a[1])[0] || ['general', 0];
    return { domain, value, label: domainLabel(domain) };
  }

  function domainLabel(domain) {
    return cfg().domains?.[domain]?.label || domain;
  }

  function getCareerDomains(cOrId) {
    const c = getCharRef(cOrId);
    if (!c) return ['general'];
    return normalizeDomains(c, null, { pathId: c.lifePath });
  }

  function getIdentityReputation(cOrId) {
    const c = getCharRef(cOrId);
    if (!c) return { value: 0, domains: [] };
    initChar(c);
    const rank = IdentityProtocolSystem?.getCharRank?.(c.id) ?? c.socialRank ?? 2;
    const servantLike = rank >= 4;
    const preferred = servantLike ? ['servant', 'family', 'general'] : ['family', 'outside', 'official', 'general'];
    const domains = preferred.map(id => ({
      domain: id,
      label: domainLabel(id),
      value: get(c, id),
    }));
    const value = Math.round(domains.reduce((sum, row) => sum + row.value, 0) / Math.max(1, domains.length));
    return { value, domains, rank, servantLike };
  }

  function explain(cOrId) {
    const c = getCharRef(cOrId);
    if (!c) return null;
    initChar(c);
    return {
      charId: c.id,
      domains: domainIds().map(id => ({ id, label: domainLabel(id), value: get(c, id) })),
      careerDomains: getCareerDomains(c),
      best: getBestDomain(c),
      identity: getIdentityReputation(c),
      log: (c.reputationLog || []).slice(0, 10),
    };
  }

  function serializeChar(c) {
    initChar(c);
    return {
      reputationDomains: { ...(c.reputationDomains || {}) },
      reputationLog: (c.reputationLog || []).slice(0, 30),
    };
  }

  function applyChar(c, snap = {}) {
    if (!c) return;
    c.reputationDomains = { ...(snap.reputationDomains || c.reputationDomains || {}) };
    c.reputationLog = (snap.reputationLog || c.reputationLog || []).slice(0, 30);
    initChar(c);
    syncLegacy(c);
  }

  function serialize() {
    return CHARS?.map(c => ({ id: c.id, ...serializeChar(c) })) || [];
  }

  function apply(rows = []) {
    for (const row of rows || []) {
      const c = getCharRef(row.id);
      if (c) applyChar(c, row);
    }
  }

  return {
    cfg, init, initChar, domainIds, domainLabel,
    get, set, change, changeMany, getBestDomain,
    getCareerDomains, getIdentityReputation, ensurePathDomains, explain,
    serializeChar, applyChar, serialize, apply,
  };
})();
window.ReputationDomainSystem = ReputationDomainSystem;
