/* ═══════════════════════ STATE SYSTEM ═══════════════════════════════════════
 *
 *  依赖：CONFIG.stateDefs, EventBus
 *  可选：STATE_CONFLICT_GROUPS（由 state-defs.js 提供）
 *  可选全局：log(), uiDirty, GAME_MINUTES_PER_REAL_SEC
 *
 *  状态 duration 单位：游戏分钟（-1 = 永久/条件性消除）
 *  updateStates(c, realSecDt) ← dt 为真实秒数，内部自动换算游戏分钟
 *
 *  规则：
 *   1. 每人最多 MAX_ACTIVE_STATES (6) 个状态
 *   2. 冲突组：同 conflictGroup 内只能保留 1 个（后来居上）
 *   3. 超出上限时：优先移除「持续时间最短的非永久状态」
 */

const MAX_ACTIVE_STATES = 6;

function _isNeedIndicator(stateId) {
  const category = CONFIG?.stateDefs?.[stateId]?.category;
  return category === 'needBand' || category === 'needCombo';
}

function _ordinaryStateCount(c) {
  return c.activeStates.filter(st => !_isNeedIndicator(st.id)).length;
}

// 游戏分钟/真实秒 比例（fallback 1.2 = 1440 game-min/day ÷ 1200 real-sec/day）
function _gameMinPerSec() {
  return (typeof GAME_MINUTES_PER_REAL_SEC !== 'undefined') ? GAME_MINUTES_PER_REAL_SEC : 1.2;
}

// 取状态的 conflictGroup（优先取 stateDef 里的）
function _conflictGroup(stateId) {
  const sd = CONFIG?.stateDefs?.[stateId];
  return sd?.conflictGroup || null;
}

// 移除同 conflictGroup 的已有状态，返回移除的 id 列表
function _removeConflicts(c, stateId) {
  const cg = _conflictGroup(stateId);
  if (!cg) return [];
  const removed = [];
  c.activeStates = c.activeStates.filter(s => {
    if (_conflictGroup(s.id) === cg && s.id !== stateId) {
      removed.push(s.id);
      return false;
    }
    return true;
  });
  removed.forEach(id => EventBus.emit('state:remove', { charId: c.id, stateId: id, reason: 'conflict' }));
  return removed;
}

// 容量超限时移除「剩余时间最短的非永久状态」
function _evictIfFull(c) {
  if (_ordinaryStateCount(c) < MAX_ACTIVE_STATES) return null;
  // 找出可驱逐的（非永久，即 remaining > 0 且有限）
  const evictable = c.activeStates.filter(s => s.remaining > 0 && !_isNeedIndicator(s.id));
  if (!evictable.length) return null;
  evictable.sort((a, b) => a.remaining - b.remaining);
  const victim = evictable[0];
  c.activeStates = c.activeStates.filter(s => s.id !== victim.id);
  EventBus.emit('state:remove', { charId: c.id, stateId: victim.id, reason: 'evict' });
  return victim.id;
}

function applyState(c, stateId) {
  const sd = CONFIG?.stateDefs?.[stateId];
  if (!sd) return;
  if (!c.activeStates) c.activeStates = [];
  const traitProbability = TraitEffectSystem?.stateApplyProbability?.(c, stateId) ?? 1;
  const moodMultiplier = CoreNeedSystem?.negativeStateMultiplier?.(c, stateId) ?? 1;
  const applyProbability = Math.min(1, traitProbability * moodMultiplier);
  if (applyProbability < 1 && Math.random() > applyProbability) {
    EventBus.emit('state:resisted', { charId: c.id, stateId, reason: 'trait' });
    return;
  }

  // 1. 已存在 → 刷新剩余时间
  const existing = c.activeStates.find(s => s.id === stateId);
  if (existing) {
    if (sd.duration !== -1) {
      existing.remaining = TraitEffectSystem?.modifyStateDuration?.(c, stateId, sd.duration) ?? sd.duration;
    }
    EventBus.emit('state:refresh', { charId: c.id, stateId, stateName: sd.name, stateDef: sd });
    return;
  }

  // 2. 移除同冲突组的旧状态
  _removeConflicts(c, stateId);

  // 3. 容量检查：超 6 个则驱逐最短的非永久状态
  while (!_isNeedIndicator(stateId) && _ordinaryStateCount(c) >= MAX_ACTIVE_STATES) {
    const evicted = _evictIfFull(c);
    if (!evicted) break; // 全是永久状态，无法再加
  }

  // 仍超限 → 放弃（全是永久状态）
  if (!_isNeedIndicator(stateId) && _ordinaryStateCount(c) >= MAX_ACTIVE_STATES) {
    if (typeof log === 'function') log(`${c.short}状态已满(${MAX_ACTIVE_STATES})，无法获得「${sd.name}」`);
    return;
  }

  // 4. 添加
  const remaining = sd.duration === -1
    ? -1
    : (TraitEffectSystem?.modifyStateDuration?.(c, stateId, sd.duration) ?? sd.duration);
  c.activeStates.push({ id: stateId, remaining });
  if (!_isNeedIndicator(stateId)) {
    if (typeof c.statusText !== 'undefined') c.statusText = sd.name;
    if (typeof log === 'function') log(`${c.short}进入状态「${sd.name}」：${sd.desc}`);
  }
  EventBus.emit('state:add', { charId: c.id, stateId, stateName: sd.name, stateDef: sd });
  if (typeof uiDirty !== 'undefined') uiDirty = true;
}

function updateStates(c, realSecDt) {
  if (!c.activeStates) return;
  const gameDt = realSecDt * _gameMinPerSec();  // 真实秒 → 游戏分钟
  const before = c.activeStates.map(s => s.id);
  c.activeStates = c.activeStates.filter(st => {
    if (st.remaining === -1) return true;
    const recovery = TraitEffectSystem?.stateRecoveryMultiplier?.(c, st.id) || 1;
    st.remaining -= gameDt * recovery;
    return st.remaining > 0;
  });
  const after = c.activeStates.map(s => s.id);
  before.filter(id => !after.includes(id)).forEach(id =>
    EventBus.emit('state:remove', { charId: c.id, stateId: id, reason: 'expired' }));
}
