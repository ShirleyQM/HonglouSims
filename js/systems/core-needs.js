/* Long-cycle drives: social contact and emotional stability. */
const CoreNeedSystem = (() => {
  const SOCIAL_GRACE_MINUTES = 1440;
  const SOCIAL_RESTORE = {
    xujiu: 24, lundao: 20, tiaoxiao: 24, weijie: 28, chuanqing: 30, zhengchi: 8,
  };
  const MOOD_RESTORE = {
    xujiu: 3, lundao: 3, tiaoxiao: 5, weijie: 12, chuanqing: 7, zhengchi: -12,
  };
  const FURNITURE_MOOD = {
    desk: 4, instrument: 5, garden: 5, pavilion: 4, bed: 2, rest: 2, bath: 3, wash: 1,
  };
  const NEGATIVE_STATE_IMPACT = {
    brokenBond: -50, unfilial: -35, punished: -22, offended: -20, shameAnger: -18,
    melancholy: -16, ganshang: -18, angry: -12, baonu: -24, awkward: -10,
    selfDemeaning: -14, exhausted: -8, chikuang: -20,
    S002: -14, S003: -12, S004: -16, S008: -12, S009: -10, S012: -15,
    S016: -18, S019: -10,
  };
  const POSITIVE_STATE_IMPACT = {
    elated: 5, joyful: 8, teaHeart: 6, heartFlutter: 6, warmCozy: 10, doted: 7,
    zizai: 5, renao: 6, S001: 6, S007: 5, S010: 7, S017: 8, S020: 9,
  };
  let initialized = false;
  const unsubs = [];

  function clamp(v, min = 0, max = 100) {
    return Math.max(min, Math.min(max, v));
  }

  function ensureChar(c) {
    if (!c) return;
    c.needs ||= {};
    c.needMeta ||= {};
    if (c.needs.social == null) c.needs.social = 85;
    if (c.needs.mood == null) c.needs.mood = 75;
    if (c.needMeta.lastSocialAt == null) c.needMeta.lastSocialAt = getGameTimestamp();
    c._prevNeeds ||= {};
    if (c._prevNeeds.social == null) c._prevNeeds.social = c.needs.social;
    if (c._prevNeeds.mood == null) c._prevNeeds.mood = c.needs.mood;
  }

  function changeNeed(c, key, delta, source) {
    if (!c || !delta) return 0;
    ensureChar(c);
    const old = c.needs[key] ?? 0;
    c.needs[key] = clamp(old + delta);
    onNeedChanged(c, key, old, c.needs[key], source);
    return c.needs[key] - old;
  }

  function markSocial(c) {
    ensureChar(c);
    c.needMeta.lastSocialAt = getGameTimestamp();
  }

  function decayMultiplier(c, needKey) {
    ensureChar(c);
    if (needKey !== 'social') return 1;
    return getGameTimestamp() - c.needMeta.lastSocialAt < SOCIAL_GRACE_MINUTES ? 0 : 1;
  }

  function socialBand(value) {
    if (value >= 80) return 'satisfied';
    if (value >= 40) return 'plain';
    if (value >= 20) return 'lonely';
    if (value >= 5) return 'desperate';
    return 'isolated';
  }

  function moodBand(value) {
    if (value >= 80) return 'peaceful';
    if (value >= 40) return 'normal';
    if (value >= 20) return 'disturbed';
    if (value >= 5) return 'knotted';
    return 'collapsed';
  }

  function collapseState(c, needKey) {
    const traits = TraitEffectSystem?.traitsOf?.(c) || [];
    if (needKey === 'social') {
      if (c.id === 'baoyu') return 'chikuang';
      if (c.id === 'daiyu') return 'ganshang';
      if ((getCharDef(c.id)?.socialRank ?? 2) >= 4) return 'socialPanic';
      return 'utterLoneliness';
    }
    if (c.id === 'daiyu' || traits.includes('duochou') || traits.includes('beiguan')) return 'despairPoem';
    if (traits.includes('jizao') || traits.includes('kebo') || traits.includes('gengzhi')) return 'baonu';
    if (c.id === 'baoyu') return 'chikuang';
    return 'emotionalCollapse';
  }

  function onNeedChanged(c, key, oldValue, newValue, source) {
    if (!['social', 'mood'].includes(key)) return;
    ensureChar(c);
    const band = key === 'social' ? socialBand(newValue) : moodBand(newValue);
    const metaKey = key === 'social' ? 'socialBand' : 'moodBand';
    const previousBand = c.needMeta[metaKey];
    if (previousBand != null && Math.abs((newValue ?? 0) - (oldValue ?? 0)) < 0.0001) return;
    c.needMeta[metaKey] = band;
    if ((band === 'isolated' || band === 'collapsed') && previousBand !== band) {
      const stateId = collapseState(c, key);
      CharacterEffectSystem?.apply?.({ type: 'state', charId: c.id, stateId }, {
        source: `need:${key}`,
        reason: key === 'social' ? '形单影只' : '心绪崩溃',
      });
      EventBus.emit('need:collapse', { charId: c.id, needKey: key, stateId, source });
    }
    if (previousBand !== band) markAIDirty(c);
  }

  function socialDriveFactor(c, cand) {
    if (!c || !cand) return 1;
    ensureChar(c);
    const isSocial = cand.kind === 'interaction' || cand.kind === 'seek' || cand.tags?.includes('social');
    if (!isSocial) return 1;
    const value = c.needs.social;
    let factor = value >= 80 ? 0.45 : value >= 40 ? 1 : value >= 20 ? 3 : value >= 5 ? 6 : 9;
    if (value < 20 && cand.kind === 'interaction') {
      if (cand.category === 'xujiu' || cand.category === 'weijie') factor *= 1.35;
      if (cand.category === 'chuanqing' || cand.category === 'tiaoxiao') factor *= 1.2;
    }
    return factor;
  }

  function moodDriveFactor(c, cand) {
    if (!c || !cand) return 1;
    ensureChar(c);
    const value = c.needs.mood;
    if (value >= 40) return 1;
    const soothing = cand.category === 'weijie'
      || cand.tags?.some(tag => ['solitude', 'desk', 'instrument', 'garden', 'sleep'].includes(tag));
    const conflict = cand.category === 'zhengchi' || cand.tags?.includes('conflict');
    if (conflict) return value < 5 ? 1.8 : value < 20 ? 1.35 : 1.15;
    if (!soothing) return value < 20 ? 0.7 : 0.85;
    return value < 5 ? 4.5 : value < 20 ? 3 : 1.8;
  }

  function actionFactor(c, cand) {
    return socialDriveFactor(c, cand) * moodDriveFactor(c, cand);
  }

  function groupJoinMultiplier(c) {
    ensureChar(c);
    const v = c.needs.social;
    return v >= 80 ? 0.75 : v >= 40 ? 1 : v >= 20 ? 1.8 : v >= 5 ? 3 : 4;
  }

  function findWalkableNear(target) {
    const offsets = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    for (const [dc, dr] of offsets) {
      const col = Math.round(target.gridCol) + dc;
      const row = Math.round(target.gridRow) + dr;
      if (WORLD[col]?.[row]?.walkable && !WORLD[col][row].entryFor) return { col, row };
    }
    return null;
  }

  function extraCandidates(c, accessible) {
    ensureChar(c);
    if (c.needs.social >= 40) return [];
    const now = getGameTimestamp();
    const targets = CHARS.filter(other =>
      other.id !== c.id
      && (!accessible || accessible.has(other.sceneId))
      && (c.ai?.socialCooldowns?.[other.id] || 0) <= now
    ).sort((a, b) => {
      const relationDiff = getRelationValue(c.id, b.id) - getRelationValue(c.id, a.id);
      if (relationDiff) return relationDiff;
      return Math.hypot(a.gridCol - c.gridCol, a.gridRow - c.gridRow)
        - Math.hypot(b.gridCol - c.gridCol, b.gridRow - c.gridRow);
    });
    const target = targets[0];
    if (!target) return [];
    const spot = findWalkableNear(target);
    if (!spot) return [];
    return [{
      key: `social-seek:${target.id}`,
      kind: 'seek',
      targetCharId: target.id,
      gridCol: spot.col,
      gridRow: spot.row,
      tags: ['social', 'movement', 'xujiu'],
      category: 'xujiu',
      baseWeight: c.needs.social < 20 ? 3 : 1.8,
      label: `寻${target.short}说话`,
    }];
  }

  function workEfficiency(c) {
    ensureChar(c);
    const v = c.needs.mood;
    if (v >= 80) return 1.2;
    if (v >= 40) return 1;
    if (v >= 20) return 0.8;
    if (v >= 5) return 0.6;
    return 0.35;
  }

  function actionSpeed(c, tpl) {
    if (!tpl || !['desk', 'workdesk'].includes(tpl.category)) return 1;
    return workEfficiency(c);
  }

  function socialToneHint(c) {
    ensureChar(c);
    const v = c.needs.mood;
    if (v >= 80) return '心绪安宁，语气温和从容，较少尖刻。';
    if (v >= 40) return '心绪平常，照常应对。';
    if (v >= 20) return '心绪烦乱，言语容易失去耐心，专注不足。';
    if (v >= 5) return '心有郁结，话里带着压抑，倾向寻求理解或回避刺激。';
    return '心绪已近崩溃，言行明显失控，表现须符合人物性格。';
  }

  function negativeStateMultiplier(c, stateId) {
    ensureChar(c);
    if (NEGATIVE_STATE_IMPACT[stateId] == null) return 1;
    const v = c.needs.mood;
    if (v >= 40) return 1;
    if (v >= 20) return 1.25;
    if (v >= 5) return 1.5;
    return 1.8;
  }

  function applyInteraction(evt) {
    const category = getInteractionTemplate(evt.interactionId)?.category || 'xujiu';
    for (const id of [evt.initiatorId, evt.targetId]) {
      const c = getChar(id);
      if (!c) continue;
      markSocial(c);
      changeNeed(c, 'social', SOCIAL_RESTORE[category] ?? 20, `interaction:${category}`);
      changeNeed(c, 'mood', MOOD_RESTORE[category] ?? 2, `interaction:${category}`);
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;
    CHARS.forEach(ensureChar);
    unsubs.push(EventBus.on('interaction:complete', applyInteraction));
    unsubs.push(EventBus.on('talk:complete', evt => {
      for (const id of [evt.initiatorId, evt.targetId]) {
        const c = getChar(id);
        if (!c) continue;
        markSocial(c);
        changeNeed(c, 'social', 18, 'talk');
        changeNeed(c, 'mood', 2, 'talk');
      }
    }));
    unsubs.push(EventBus.on('groupchat:join', evt => {
      const c = getChar(evt.charId);
      if (!c) return;
      markSocial(c);
      changeNeed(c, 'social', 18, 'groupchat');
      changeNeed(c, 'mood', 4, 'groupchat');
    }));
    unsubs.push(EventBus.on('furniture:complete', evt => {
      const delta = FURNITURE_MOOD[evt.category] || 0;
      if (delta) changeNeed(getChar(evt.charId), 'mood', delta, `furniture:${evt.category}`);
    }));
    unsubs.push(EventBus.on('state:add', evt => {
      const delta = NEGATIVE_STATE_IMPACT[evt.stateId] ?? POSITIVE_STATE_IMPACT[evt.stateId] ?? 0;
      if (delta) changeNeed(getChar(evt.charId), 'mood', delta, `state:${evt.stateId}`);
    }));
    unsubs.push(EventBus.on('quest:failed', evt =>
      changeNeed(getChar(evt.assigneeId), 'mood', -18, 'quest:failed')));
    unsubs.push(EventBus.on('quest:completed', evt =>
      changeNeed(getChar(evt.assigneeId), 'mood', 6, 'quest:completed')));
    unsubs.push(EventBus.on('relation:change', evt => {
      const delta = evt.delta || 0;
      if (!delta) return;
      const moodDelta = delta < 0 ? Math.max(-20, delta * 0.8) : Math.min(6, delta * 0.2);
      changeNeed(getChar(evt.idA), 'mood', moodDelta, 'relation');
      changeNeed(getChar(evt.idB), 'mood', moodDelta, 'relation');
    }));
    unsubs.push(EventBus.on('family:event', evt => {
      const family = FamilySystem?.getFamily?.(evt.familyId);
      const members = family?.members || [];
      const delta = evt.eventId === 1 ? 8 : evt.eventId === 2 ? -15 : evt.eventId === 3 ? 6 : 0;
      if (delta) members.forEach(row =>
        changeNeed(getChar(row.charId), 'mood', delta, `family:${evt.eventId}`));
    }));
  }

  return {
    init,
    ensureChar,
    changeNeed,
    onNeedChanged,
    decayMultiplier,
    actionFactor,
    extraCandidates,
    groupJoinMultiplier,
    workEfficiency,
    actionSpeed,
    socialToneHint,
    negativeStateMultiplier,
    socialBand,
    moodBand,
  };
})();

window.CoreNeedSystem = CoreNeedSystem;
