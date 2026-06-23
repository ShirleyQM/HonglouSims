/* ═══════════════════ CHARACTER EFFECT SYSTEM ═══════════════════
 *
 * 跨系统修改人物数据的统一入口。持续性的模拟循环（需求自然衰减、
 * 家具每帧恢复）仍由原系统负责，离散效果统一从这里进入并记录来源。
 */
const CharacterEffectSystem = (() => {
  const recent = [];
  const MAX_LOG = 200;

  function resolveChar(ref) {
    if (!ref) return null;
    if (typeof ref === 'string') return getChar(ref);
    return ref;
  }

  function record(effect, result, context) {
    const row = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      gameDay: typeof gameDay !== 'undefined' ? gameDay : 0,
      gameHour: typeof gameHour !== 'undefined' ? gameHour : 0,
      gameMinute: typeof gameMinute !== 'undefined' ? Math.floor(gameMinute) : 0,
      source: context.source || effect.source || 'unknown',
      reason: context.reason || effect.reason || '',
      effect: { ...effect },
      result,
    };
    recent.unshift(row);
    if (recent.length > MAX_LOG) recent.pop();
    EventBus.emit('character:effect', row);
    return row;
  }

  function changeNeed(c, key, delta, context = {}) {
    if (!c?.needs || !key || !delta) return { changed: 0 };
    const cf = calcNeedCoeffs(c)[key] || { min: 0, max: 100 };
    const old = c.needs[key] ?? 0;
    const lower = cf.min ?? 0;
    const upper = Math.max(cf.max ?? 100, old);
    const next = Math.max(lower, delta > 0 ? Math.min(upper, old + delta) : old + delta);
    c.needs[key] = next;
    CoreNeedSystem?.onNeedChanged?.(c, key, old, next, context.source);
    if (typeof checkNeedTriggers === 'function') checkNeedTriggers(c);
    return { charId: c.id, key, old, value: next, changed: next - old };
  }

  function addMemory(c, effect, context) {
    if (!c || !effect.text) return { changed: 0 };
    if (typeof TraitBehaviorSystem !== 'undefined') {
      return TraitBehaviorSystem.addMemory(c, {
        text: effect.text,
        tag: effect.tag || '',
        with: effect.with || context.otherId || '',
        hour: typeof gameHour !== 'undefined' ? gameHour : 0,
        day: typeof gameDay !== 'undefined' ? gameDay : 0,
        source: context.source || effect.source || '',
        valence: effect.valence || 0,
      }, {
        baseChance: effect.memoryChance ?? 0.9,
        force: !!effect.forceMemory,
      });
    }
    c.memories ||= [];
    const row = {
      text: effect.text,
      tag: effect.tag || '',
      with: effect.with || context.otherId || '',
      hour: typeof gameHour !== 'undefined' ? gameHour : 0,
      day: typeof gameDay !== 'undefined' ? gameDay : 0,
      source: context.source || effect.source || '',
    };
    c.memories.push(row);
    EventBus.emit('memory:add', { charId: c.id, text: row.text, tag: row.tag, with: row.with });
    return { charId: c.id, memory: row, changed: 1 };
  }

  function changeSkillXp(c, effect) {
    if (!c || !effect.skill) return { changed: 0 };
    c.skillLevels ||= {};
    const old = c.skillLevels[effect.skill] || 1;
    const next = Math.max(0, old + (effect.delta || 0));
    c.skillLevels[effect.skill] = next;
    return { charId: c.id, skill: effect.skill, old, value: next, changed: next - old };
  }

  function apply(effect, context = {}) {
    if (!effect?.type) return null;
    if (effect.prob !== undefined && Math.random() > effect.prob) {
      return record(effect, { skipped: true, reason: 'probability' }, context);
    }

    let result = null;
    const c = resolveChar(effect.char || effect.charId || effect.target);
    if (effect.type === 'need') {
      result = changeNeed(c, effect.key, effect.delta || 0, context);
    } else if (effect.type === 'state') {
      if (c && effect.stateId) {
        const existed = c.activeStates?.some(s => s.id === effect.stateId);
        applyState(c, effect.stateId);
        result = { charId: c.id, stateId: effect.stateId, changed: existed ? 0 : 1 };
      }
    } else if (effect.type === 'memory') {
      result = addMemory(c, effect, context);
    } else if (effect.type === 'relation') {
      const idA = effect.idA || effect.from;
      const idB = effect.idB || effect.to;
      if (idA && idB) {
        const old = getRelationValue(idA, idB);
        changeRelation(idA, idB, effect.delta || 0, {
          ...context,
          actor: context.actor || effect.actor || idA,
          recipient: context.recipient || effect.recipient || idB,
        });
        const value = getRelationValue(idA, idB);
        result = {
          idA, idB,
          actor: context.actor || effect.actor || idA,
          recipient: context.recipient || effect.recipient || idB,
          old, value, changed: value - old,
        };
      }
    } else if (effect.type === 'axis') {
      const idA = effect.idA || effect.from;
      const idB = effect.idB || effect.to;
      if (idA && idB && effect.axis) {
        const before = getRelationInfo(idA, idB)?.[effect.axis] ?? 0;
        changeAxis(idA, idB, effect.axis, effect.delta || 0, {
          ...context,
          actor: context.actor || effect.actor || idA,
          recipient: context.recipient || effect.recipient || idB,
        });
        const value = getRelationInfo(idA, idB)?.[effect.axis] ?? before;
        result = {
          idA, idB, axis: effect.axis,
          actor: context.actor || effect.actor || idA,
          recipient: context.recipient || effect.recipient || idB,
          old: before, value, changed: value - before,
        };
      }
    } else if (effect.type === 'reputation') {
      result = { charId: c?.id, changed: LifePathSystem?.changeReputation?.(c, effect.delta || 0, context.reason || effect.reason) || 0 };
    } else if (effect.type === 'money') {
      result = { charId: c?.id, changed: MoneySystem?.changeMoney?.(c, effect.delta || 0, context.reason || effect.reason) || 0 };
    } else if (effect.type === 'familyFund') {
      const familyId = effect.familyId || context.familyId;
      const delta = effect.delta || 0;
      if (delta >= 0) FamilySystem?.depositFund?.(familyId, delta, context.reason || effect.reason);
      else FamilySystem?.withdrawFund?.(familyId, Math.abs(delta), context.reason || effect.reason);
      result = { familyId, changed: delta };
    } else if (effect.type === 'skillXp') {
      result = changeSkillXp(c, effect);
    }

    if (!result) result = { skipped: true, reason: 'unsupported_or_missing_target' };
    if (typeof uiDirty !== 'undefined') uiDirty = true;
    record(effect, result, context);
    return result;
  }

  function applyMany(effects, context = {}) {
    return (effects || []).map(effect => apply(effect, context)).filter(Boolean);
  }

  function getRecent(filter = {}) {
    return recent.filter(row => {
      if (filter.charId) {
        const e = row.effect || {};
        const r = row.result || {};
        const ids = [e.charId, e.target, e.idA, e.idB, e.from, e.to, r.charId, r.idA, r.idB];
        if (!ids.includes(filter.charId)) return false;
      }
      if (filter.source && row.source !== filter.source) return false;
      return true;
    }).slice(0, filter.limit || 50);
  }

  function clearLog() {
    recent.length = 0;
  }

  return { apply, applyMany, getRecent, clearLog };
})();

window.CharacterEffectSystem = CharacterEffectSystem;
