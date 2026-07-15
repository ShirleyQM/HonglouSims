/* ═══════════════════ TRAIT BEHAVIOR SYSTEM ═══════════════════
 * 第三、四阶段：记忆生命周期、任务/社交统计、自主消费与竞赛结算。
 */
const TraitBehaviorSystem = (() => {
  let unsubs = [];
  let bubbleCooldowns = {};

  function now() {
    return typeof getGameTimestamp === 'function' ? getGameTimestamp() : 0;
  }

  function stats(c) {
    if (!c) return {};
    c.traitStats ||= {
      sinceDay: typeof gameDay !== 'undefined' ? gameDay : 1,
      decisions: 0, socialActions: 0,
      memoriesCreated: 0, memoriesForgotten: 0,
      questsAccepted: 0, questsDeclined: 0, questsCompleted: 0, questsFailed: 0, questsOnTime: 0,
      invitationsAccepted: 0, invitationsDeclined: 0,
      spendingCount: 0, spent: 0,
      competitions: 0, wins: 0, losses: 0,
      actions: {},
    };
    c.traitStats.actions ||= {};
    return c.traitStats;
  }

  function bump(charId, key, amount = 1) {
    const c = getChar(charId);
    if (!c) return;
    stats(c)[key] = (stats(c)[key] || 0) + amount;
  }

  function bubbleConfig(traitId) {
    return CONFIG.charSpecialtyConfig?.traitNarratives?.[traitId] || {};
  }

  function fillBubble(text, context = {}) {
    return String(text || '')
      .replace(/\{action\}/g, context.action || '')
      .replace(/\{target\}/g, context.target || '')
      .replace(/\{quest\}/g, context.quest || '')
      .replace(/\{memory\}/g, context.memory || '')
      .replace(/\{trait\}/g, context.trait || '');
  }

  function showTraitBubble(c, event, context = {}, preferredTraits = []) {
    if (!c || !NarrativeBubbleSystem?.showBubble) return false;
    const key = `${c.id}|${event}`;
    if (now() < (bubbleCooldowns[key] || 0)) return false;
    const traits = [...new Set([...preferredTraits, ...TraitEffectSystem.traitsOf(c)])];
    const preferredCandidates = preferredTraits.filter(id =>
      TraitEffectSystem.has(c, id) && Array.isArray(bubbleConfig(id)[event]) && bubbleConfig(id)[event].length
    );
    const candidates = preferredCandidates.length
      ? preferredCandidates
      : traits.filter(id => Array.isArray(bubbleConfig(id)[event]) && bubbleConfig(id)[event].length);
    if (!candidates.length) return false;
    const chance = context.chance ?? (event === 'action' ? 0.24 : 0.72);
    if (Math.random() > chance) return false;
    const traitId = candidates[Math.floor(Math.random() * candidates.length)];
    const lines = bubbleConfig(traitId)[event];
    const raw = lines[Math.floor(Math.random() * lines.length)];
    const shown = NarrativeBubbleSystem.showBubble({
      charId: c.id,
      text: fillBubble(raw, {
        ...context,
        trait: TraitEffectSystem.metadata(traitId)?.label || traitId,
      }),
      style: context.style || (['accept', 'decline', 'win', 'lose'].includes(event) ? 'speech' : 'thought'),
      icon: context.icon || '',
      module: 'trait',
      drivers: { traitIds: [traitId], sourceEvent: context.sourceEvent || `trait:${event}` },
      duration: context.duration || 4,
    });
    if (shown) bubbleCooldowns[key] = now() + (context.cooldownGameMin || 75);
    return shown;
  }

  function normalizeMemory(c, row) {
    const createdAt = row.createdAt ?? row.timestamp ?? ((row.day || gameDay || 1) * 1440 + (row.hour || 0) * 60);
    return {
      ...row,
      createdAt,
      strength: row.strength ?? 1,
      decayPerDay: row.decayPerDay ?? 0.12,
      permanent: !!row.permanent,
    };
  }

  function addMemory(c, data, context = {}) {
    if (!c || (!data.text && !data.tag)) return { changed: 0 };
    const baseChance = context.force ? 1 : (context.baseChance ?? 0.85);
    const chance = Math.min(1, baseChance * TraitEffectSystem.memoryChanceMultiplier(c));
    if (!context.force && Math.random() > chance) return { charId: c.id, changed: 0 };
    const valence = data.valence || 0;
    const row = normalizeMemory(c, {
      ...data,
      createdAt: now(),
      timestamp: data.timestamp ?? now(),
      strength: (data.strength ?? 1) * TraitEffectSystem.memoryStrengthMultiplier(c, valence),
    });
    c.memories ||= [];
    c.memories.push(row);
    if (c.memories.length > 80) c.memories.splice(0, c.memories.length - 80);
    bump(c.id, 'memoriesCreated');
    EventBus.emit('memory:add', {
      charId: c.id, text: row.text || row.tag, tag: row.tag || '', with: row.with || '',
      strength: row.strength,
    });
    return { charId: c.id, memory: row, changed: 1 };
  }

  function decayMemories() {
    for (const c of CHARS) {
      c.memories = (c.memories || []).map(row => normalizeMemory(c, row)).filter(row => {
        if (row.permanent) return true;
        row.strength -= row.decayPerDay * TraitEffectSystem.memoryDecayMultiplier(c);
        if (row.strength > 0.12) return true;
        bump(c.id, 'memoriesForgotten');
        EventBus.emit('memory:forgotten', { charId: c.id, tag: row.tag || row.text || '往事' });
        return false;
      });
    }
  }

  function trySpending(evt) {
    for (const c of CHARS) {
      if (!isAIControlled(c) || c.action?.type === 'interaction' || c.action?.type === 'talk') continue;
      const profile = TraitEffectSystem.spendingProfile(c);
      if (!profile.chance || Math.random() > profile.chance) continue;
      if (now() - (c._lastTraitSpendTs || -9999) < 360) continue;
      const balance = MoneySystem.getBalance(c);
      const amount = Math.max(1, Math.round((2 + Math.random() * 5) * profile.amountMultiplier));
      if (balance < amount + 3) continue;
      const label = profile.labels[Math.floor(Math.random() * profile.labels.length)] || '买了些随身小物';
      MoneySystem.changeMoney(c, -amount, label);
      c._lastTraitSpendTs = now();
      if (c.needs?.fun != null) c.needs.fun = Math.min(100, c.needs.fun + 4);
      if (TraitEffectSystem.has(c, 'tanzui') && c.needs?.hunger != null) c.needs.hunger = Math.min(100, c.needs.hunger + 5);
      bump(c.id, 'spendingCount');
      bump(c.id, 'spent', amount);
      log(`${c.short}${label}，花了${amount}两。`, 'social');
      showTraitBubble(c, 'spend', { chance: 1, cooldownGameMin: 240, icon: '◈' });
      EventBus.emit('trait:spending', { charId: c.id, amount, label, hour: evt?.hour });
    }
  }

  function competitionSkill(c, category) {
    if (category === 'lundao') return (getSkillLevel(c, 'poetry') || 0) * 6;
    return (c.socialRank ? (7 - c.socialRank) * 2 : 0) + ((c.needs?.social || 50) - 50) / 10;
  }

  function settleCompetition(evt) {
    const tpl = getInteractionTemplate(evt.interactionId);
    const category = tpl?.category;
    if (!['lundao', 'zhengchi'].includes(category)) return;
    const a = getChar(evt.initiatorId), b = getChar(evt.targetId);
    if (!a || !b) return;
    if (category === 'zhengchi' && !TraitEffectSystem.has(a, 'haosheng') && !TraitEffectSystem.has(b, 'haosheng')) return;
    const scoreA = competitionSkill(a, category) + TraitEffectSystem.competitionBonus(a, category) + Math.random() * 20;
    const scoreB = competitionSkill(b, category) + TraitEffectSystem.competitionBonus(b, category) + Math.random() * 20;
    const winner = scoreA >= scoreB ? a : b;
    const loser = winner === a ? b : a;
    [a, b].forEach(c => bump(c.id, 'competitions'));
    bump(winner.id, 'wins');
    bump(loser.id, 'losses');
    CharacterEffectSystem.apply({ type: 'state', charId: winner.id, stateId: 'elated' }, { source: 'trait:competition' });
    if (TraitEffectSystem.has(loser, 'haosheng')) {
      CharacterEffectSystem.apply({ type: 'state', charId: loser.id, stateId: 'angry' }, { source: 'trait:competition' });
    }
    const title = category === 'lundao' ? '论道' : '争执';
    log(`${winner.short}在与${loser.short}的${title}中占了上风。`, 'social');
    showTraitBubble(winner, 'win', { chance: 1, action: title, target: loser.short, cooldownGameMin: 90 });
    showTraitBubble(loser, 'lose', { chance: 0.85, action: title, target: winner.short, cooldownGameMin: 90 });
    EventBus.emit('trait:competition', { category, winnerId: winner.id, loserId: loser.id, scoreA, scoreB });
  }

  function bindStats() {
    unsubs.push(EventBus.on('ai:decision', evt => {
      bump(evt.charId, 'decisions');
      const c = getChar(evt.charId);
      if (c && evt.category) stats(c).actions[evt.category] = (stats(c).actions[evt.category] || 0) + 1;
      const preferred = (evt.traitEffects || [])
        .filter(row => row.multiplier > 1.12)
        .sort((a, b) => b.multiplier - a.multiplier)
        .map(row => row.trait);
      if (preferred.length) showTraitBubble(c, 'action', {
        action: evt.action, chance: 0.3, cooldownGameMin: 90,
      }, preferred);
    }));
    unsubs.push(EventBus.on('interaction:complete', evt => {
      bump(evt.initiatorId, 'socialActions');
      settleCompetition(evt);
    }));
    unsubs.push(EventBus.on('quest:accepted', evt => {
      bump(evt.assigneeId, 'questsAccepted');
      const c = getChar(evt.assigneeId);
      showTraitBubble(c, 'accept', {
        quest: QuestSystem?.tpl?.(evt.templateId)?.name || '这件差事',
        chance: 0.58,
      }, ['shoushi', 'qingxin', 'tuoyan', 'duoyi']);
    }));
    unsubs.push(EventBus.on('quest:declined', evt => {
      bump(evt.assigneeId, 'questsDeclined');
      const c = getChar(evt.assigneeId);
      showTraitBubble(c, 'decline', {
        quest: QuestSystem?.tpl?.(evt.templateId)?.name || '这件差事',
        chance: 0.82,
      }, ['duoyi', 'gupi', 'yuanhua', 'jizao', 'wenhe']);
    }));
    unsubs.push(EventBus.on('quest:completed', evt => {
      bump(evt.assigneeId, 'questsCompleted');
      if (evt.onTime) bump(evt.assigneeId, 'questsOnTime');
    }));
    unsubs.push(EventBus.on('quest:failed', evt => {
      bump(evt.assigneeId, 'questsFailed');
      showTraitBubble(getChar(evt.assigneeId), 'fail', {
        quest: QuestSystem?.tpl?.(evt.templateId)?.name || '这件差事',
        chance: 0.85,
      }, ['tuoyan']);
    }));
    unsubs.push(EventBus.on('invitation:accepted', evt => {
      bump(evt.inviteeId, 'invitationsAccepted');
      showTraitBubble(getChar(evt.inviteeId), 'accept', {
        target: getChar(evt.inviterId)?.short || '对方',
        chance: 0.75,
      }, ['qingxin', 'reluo', 'duoyi']);
    }));
    unsubs.push(EventBus.on('invitation:declined', evt => {
      bump(evt.inviteeId, 'invitationsDeclined');
      showTraitBubble(getChar(evt.inviteeId), 'decline', {
        target: getChar(evt.inviterId)?.short || '对方',
        chance: 0.85,
      }, ['duoyi', 'gupi', 'yuanhua', 'jizao', 'wenhe']);
    }));
    unsubs.push(EventBus.on('memory:add', evt => {
      showTraitBubble(getChar(evt.charId), 'memory', {
        memory: evt.text || evt.tag || '这件事',
        chance: 0.5,
        cooldownGameMin: 180,
      }, ['mingan', 'duochou', 'leitian', 'beiguan']);
    }));
    unsubs.push(EventBus.on('memory:forgotten', evt => {
      showTraitBubble(getChar(evt.charId), 'forget', {
        memory: evt.tag || '那件旧事',
        chance: 0.65,
        cooldownGameMin: 360,
      }, ['chidun', 'mingan']);
    }));
  }

  function resetStats(c) {
    if (c) delete c.traitStats;
    return stats(c);
  }

  function init() {
    unsubs.forEach(fn => fn?.());
    unsubs = [];
    bubbleCooldowns = {};
    CHARS.forEach(c => {
      c.memories = (c.memories || []).map(row => normalizeMemory(c, row));
      stats(c);
    });
    unsubs.push(EventBus.on('time:day', decayMemories));
    unsubs.push(EventBus.on('time:hour', trySpending));
    bindStats();
  }

  return { init, addMemory, decayMemories, getStats: stats, resetStats, showTraitBubble };
})();
window.TraitBehaviorSystem = TraitBehaviorSystem;
