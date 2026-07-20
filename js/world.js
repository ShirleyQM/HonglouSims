
function getScene(id) { return CONFIG.scenes.find(s => s.id === id); }
function getTemplate(tid) { return CONFIG.furnitureTemplates[tid]; }
function getInstance(iid) { return CONFIG.furnitureInstances.find(f => f.instanceId === iid); }
function getInstAt(col, row) {
  const c = WORLD[col]?.[row];
  return c?.furnitureId ? getInstance(c.furnitureId) : null;
}

function gridToPixel(col, row) {
  return { x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 };
}

function pixelToGrid(px, py) {
  return { col: Math.floor(px / CELL), row: Math.floor(py / CELL) };
}

function syncCharPixel(c) {
  const p = gridToPixel(c.gridCol, c.gridRow);
  c.x = p.x; c.y = p.y;
}

function charsInSceneGlobal(sceneId) {
  return CHARS.filter(c => c.sceneId === sceneId);
}

function sceneAt(col, row) {
  for (const sc of CONFIG.scenes) {
    if (col >= sc.originCol && col < sc.originCol + sc.cols && row >= sc.originRow && row < sc.originRow + sc.rows)
      return sc;
  }
  return null;
}

function isConnection(col, row) {
  return CONFIG.connections.some(c => c.col === col && c.row === row);
}

function sceneWalkMaskChar(sc, col, row) {
  if (!Array.isArray(sc.walkMask)) return null;
  const localRow = row - sc.originRow;
  const localCol = col - sc.originCol;
  const maskRow = sc.walkMask[localRow];
  if (typeof maskRow !== 'string' || localCol < 0 || localCol >= maskRow.length) return null;
  return maskRow[localCol];
}

function walkableFromMask(ch) {
  if (ch == null) return null;
  if (ch === '#' || ch === 'X' || ch === '~' || ch === ' ') return false;
  if (ch === '.' || ch === ',' || ch === 'D' || ch === '=' || ch === 'w') return true;
  return null;
}

function groundFromMask(ch, fallback) {
  if (ch === 'w') return 'wood';
  if (ch === ',' || ch === 'D' || ch === '=') return 'stone_herringbone';
  if (ch === '~') return 'stone_muddy';
  return fallback;
}

function buildWorldGrid() {
  WORLD_COLS = Math.max(...CONFIG.scenes.map(s => s.originCol + s.cols));
  WORLD_ROWS = Math.max(...CONFIG.scenes.map(s => s.originRow + s.rows));
  WORLD = Array.from({ length: WORLD_COLS }, () => Array(WORLD_ROWS).fill(null));
  INST_MAP = {};
  for (const sc of CONFIG.scenes) {
    const road = !!sc.isTransition;
    const openEdge = !!sc.openEdges || sc.id === 3;
    for (let c = sc.originCol; c < sc.originCol + sc.cols; c++)
      for (let r = sc.originRow; r < sc.originRow + sc.rows; r++) {
        const edge = c === sc.originCol || r === sc.originRow || c === sc.originCol + sc.cols - 1 || r === sc.originRow + sc.rows - 1;
        const conn = isConnection(c, r);
        const maskChar = sceneWalkMaskChar(sc, c, r);
        const maskedWalkable = walkableFromMask(maskChar);
        let walkable = road || openEdge || !edge || conn;
        let ground = road || (conn && !openEdge) ? 'corridor' : sc.ground;
        if (maskedWalkable != null) {
          walkable = maskedWalkable || conn;
          ground = groundFromMask(maskChar, ground);
        }
        WORLD[c][r] = {
          walkable,
          ground,
          sceneId: sc.id,
          furnitureId: 0,
          entryFor: 0,
        };
      }
  }
  for (const inst of CONFIG.furnitureInstances) {
    const tpl = getTemplate(inst.templateId);
    if (!tpl) continue;
    const sc = getScene(inst.sceneId);
    const keepOpenEdge = !!sc && (!!sc.openEdges || sc.id === 3);
    INST_MAP[inst.instanceId] = inst;
    if (isEmbeddedFurnitureInst(inst) || inst.hotspot) {
      const entry = furnitureFineEntryGrid(inst);
      const cell = WORLD[entry.col]?.[entry.row];
      if (cell) {
        cell.walkable = true;
        cell.entryFor = inst.instanceId;
        cell.furnitureId = 0;
      }
      continue;
    }
    for (let dx = 0; dx < tpl.gridW; dx++)
      for (let dy = 0; dy < tpl.gridH; dy++) {
        const c = inst.anchorCol + dx, r = inst.anchorRow + dy;
        const isOpenEdge = keepOpenEdge && (c === sc.originCol || r === sc.originRow || c === sc.originCol + sc.cols - 1 || r === sc.originRow + sc.rows - 1);
        if (WORLD[c]?.[r]) { WORLD[c][r].walkable = isOpenEdge; WORLD[c][r].furnitureId = inst.instanceId; }
      }
    const ec = inst.anchorCol + tpl.entryOffset[0], er = inst.anchorRow + tpl.entryOffset[1];
    if (WORLD[ec]?.[er]) { WORLD[ec][er].walkable = true; WORLD[ec][er].entryFor = inst.instanceId; WORLD[ec][er].furnitureId = 0; }
  }
  if (SceneAccessSystem?.resolveAllFurnitureEntries) {
    const badEntries = SceneAccessSystem.resolveAllFurnitureEntries();
    syncFurnitureEntryCells();
    if (badEntries.length && typeof console !== 'undefined')
      console.warn('[world] 家具入口不可达:', badEntries.join(', '));
  } else {
    syncFurnitureEntryCells();
  }
}

function initFurnRuntime() {
  FURN_RT = {};
  for (const inst of CONFIG.furnitureInstances)
    FURN_RT[inst.instanceId] = { users: [], remaining: 0, slots: {} };
}

/** 家具周围可站立的格子（入口 + 外圈邻格） */
function getFurnitureStandCells(inst) {
  const tpl = getTemplate(inst.templateId);
  const entry = getEntryCell(inst);
  const cells = [];
  const seen = new Set();
  const add = (col, row) => {
    const k = `${col},${row}`;
    if (seen.has(k)) return;
    seen.add(k);
    const cell = WORLD[col]?.[row];
    if (!cell?.walkable || cell.sceneId !== inst.sceneId) return;
    const isEntry = cell.entryFor === inst.instanceId || (col === entry.col && row === entry.row);
    cells.push({ col, row, isEntry });
  };
  add(entry.col, entry.row);
  for (let dx = -1; dx <= tpl.gridW; dx++)
    for (let dy = -1; dy <= tpl.gridH; dy++) {
      if (dx >= 0 && dx < tpl.gridW && dy >= 0 && dy < tpl.gridH) continue;
      add(inst.anchorCol + dx, inst.anchorRow + dy);
    }
  const dist = (a) => Math.hypot(a.col - entry.col, a.row - entry.row);
  cells.sort((a, b) => dist(a) - dist(b));
  return cells;
}

function getFurnitureSlotOccupancy(inst, excludeCharId) {
  const rt = FURN_RT[inst.instanceId];
  const occ = new Set();
  for (const ch of CHARS) {
    if (ch.id === excludeCharId) continue;
    const assigned = rt?.slots?.[ch.id];
    if (assigned) {
      occ.add(`${assigned.col},${assigned.row}`);
      continue;
    }
    if (ch.usingInstanceId === inst.instanceId || ch._waitingFurnId === inst.instanceId) {
      occ.add(`${Math.round(ch.gridCol)},${Math.round(ch.gridRow)}`);
    }
  }
  return occ;
}

function releaseFurnitureStandSlot(c, instanceId) {
  const iid = instanceId || c.usingInstanceId || c._waitingFurnId;
  if (!iid) return;
  const rt = FURN_RT[iid];
  if (rt?.slots) delete rt.slots[c.id];
  if (c._waitingFurnId === iid) c._waitingFurnId = 0;
}

/** 为角色分配家具旁站位：forWait=true 时优先非入口格（排队） */
function pickFurnitureStandCell(inst, c, forWait = false) {
  const rt = FURN_RT[inst.instanceId];
  if (!rt.slots) rt.slots = {};

  const existing = rt.slots[c.id];
  if (existing) {
    const occ = getFurnitureSlotOccupancy(inst, c.id);
    if (!occ.has(`${existing.col},${existing.row}`)) return existing;
    delete rt.slots[c.id];
  }

  let cells = getFurnitureStandCells(inst);
  const occ = getFurnitureSlotOccupancy(inst, c.id);
  if (forWait) {
    const nonEntry = cells.filter(cell => !cell.isEntry);
    if (nonEntry.length) cells = nonEntry;
  }

  const sCol = Math.round(c.gridCol), sRow = Math.round(c.gridRow);
  let best = null;
  for (const cell of cells) {
    const k = `${cell.col},${cell.row}`;
    if (occ.has(k)) continue;
    const path = astar(sCol, sRow, cell.col, cell.row, { excludeCharIds: [c.id] });
    if (!path) continue;
    const score = path.length + (forWait && cell.isEntry ? 50 : 0);
    if (!best || score < best.score) {
      best = { col: cell.col, row: cell.row, role: forWait ? 'wait' : 'use', score };
    }
  }
  if (!best) return null;
  rt.slots[c.id] = { col: best.col, row: best.row, role: best.role };
  return rt.slots[c.id];
}

function startPathToFurnitureStand(c, inst, forWait, onArrive) {
  const tryGo = (attempt = 0) => {
    const slot = pickFurnitureStandCell(inst, c, forWait);
    if (!slot) return false;

    const arrived = () => {
      if (!CHAR_PASS_THROUGH && isCellOccupiedByAny(slot.col, slot.row, [c.id])) {
        releaseFurnitureStandSlot(c, inst.instanceId);
        if (attempt < 4) return tryGo(attempt + 1);
        failQueueItem(c, '无法找到空闲站位');
        return false;
      }
      const occ = getFurnitureSlotOccupancy(inst, c.id);
      if (occ.has(`${slot.col},${slot.row}`)) {
        releaseFurnitureStandSlot(c, inst.instanceId);
        if (attempt < 4) return tryGo(attempt + 1);
        failQueueItem(c, '无法占位');
        return false;
      }
      syncCharPixel(c);
      onArrive();
      return true;
    };

    if (Math.round(c.gridCol) === slot.col && Math.round(c.gridRow) === slot.row) {
      return arrived() !== false;
    }
    const ok = startPathTo(c, slot.col, slot.row, () => { arrived(); }, { excludeCharIds: [c.id] });
    if (!ok) releaseFurnitureStandSlot(c, inst.instanceId);
    return ok;
  };
  return tryGo();
}

function getGroundSpeed(col, row) {
  const g = WORLD[col]?.[row]?.ground || 'stone';
  return CONFIG.groundTypes[g]?.speed ?? 1;
}

/** 人物移动是否互相挡路；false = 可穿过彼此 */
const CHAR_PASS_THROUGH = true;

/** 静止角色才挡路；行走/赶路中的角色可被穿行 */
function isCharStationary(c) {
  if (!c) return true;
  if (c._interactionLock && !c._interactionLock.allowMove) return true;
  if (c.action?.type === 'interaction' || c.action?.type === 'talk') return true;
  if (c.action?.type === 'furniture' && c.action.phase === 'use') return true;
  if (c.path?.length > 0) return false;
  if (c.action?.type === 'move') return false;
  if (c.action?.type === 'furniture' && c.action.phase === 'moving') return false;
  return true;
}

function charAtCell(col, row, excludeIds = [], opts = {}) {
  const blockMoving = opts.blockMoving !== false;
  const ex = new Set(excludeIds);
  const gc = Math.round(col), gr = Math.round(row);
  for (const c of CHARS) {
    if (ex.has(c.id)) continue;
    if (blockMoving && !isCharStationary(c)) continue;
    if (Math.round(c.gridCol) === gc && Math.round(c.gridRow) === gr) return c;
  }
  return null;
}

function isCellOccupiedByOther(col, row, selfId, alsoExclude = []) {
  if (CHAR_PASS_THROUGH) return null;
  return charAtCell(col, row, [selfId, ...alsoExclude]);
}

function isCellOccupiedByAny(col, row, selfId, alsoExclude = []) {
  return charAtCell(col, row, [selfId, ...alsoExclude], { blockMoving: false });
}

function getCharOccupancy(excludeIds = [], opts = {}) {
  if (CHAR_PASS_THROUGH && opts.blockMoving !== false) return new Set();
  const blockMoving = opts.blockMoving !== false;
  const occ = new Set();
  const ex = new Set(excludeIds);
  for (const c of CHARS) {
    if (ex.has(c.id)) continue;
    if (blockMoving && !isCharStationary(c)) continue;
    occ.add(`${Math.round(c.gridCol)},${Math.round(c.gridRow)}`);
  }
  return occ;
}

function astar(sCol, sRow, eCol, eRow, opts = {}) {
  if (!WORLD[eCol]?.[eRow]?.walkable) return null;
  const key = (c, r) => c + ',' + r;
  const h = (c, r) => Math.abs(c - eCol) + Math.abs(r - eRow);
  const blockChars = CHAR_PASS_THROUGH ? false : (opts.blockChars !== false);
  const occupancy = blockChars && CHARS?.length
    ? getCharOccupancy(opts.excludeCharIds || [], { blockMoving: opts.blockMoving !== false })
    : null;
  const open = [{ c: sCol, r: sRow, g: 0, f: h(sCol, sRow) }];
  const came = {}, cost = { [key(sCol, sRow)]: 0 };
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const cur = open.shift();
    if (cur.c === eCol && cur.r === eRow) {
      const path = [];
      let k = key(cur.c, cur.r);
      while (k in came) {
        const [c, r] = k.split(',').map(Number);
        path.unshift({ col: c, row: r });
        k = came[k];
      }
      return path;
    }
    for (const [dc, dr] of dirs) {
      const nc = cur.c + dc, nr = cur.r + dr;
      if (!WORLD[nc]?.[nr]?.walkable) continue;
      const nk = key(nc, nr);
      if (occupancy?.has(nk) && !(nc === eCol && nr === eRow)) continue;
      const ng = cur.g + getGroundSpeed(nc, nr);
      if (!(nk in cost) || ng < cost[nk]) {
        cost[nk] = ng; came[nk] = key(cur.c, cur.r);
        open.push({ c: nc, r: nr, g: ng, f: ng + h(nc, nr) });
      }
    }
  }
  return null;
}

/** 将家具入口格同步到 WORLD（含 _entryOverride） */
function syncFurnitureEntryCells() {
  for (const inst of CONFIG.furnitureInstances) {
    const tpl = getTemplate(inst.templateId);
    if (!tpl) continue;
    if (isEmbeddedFurnitureInst(inst) || inst.hotspot) {
      const entry = furnitureFineEntryGrid(inst);
      if (WORLD[entry.col]?.[entry.row]) {
        WORLD[entry.col][entry.row].walkable = true;
        WORLD[entry.col][entry.row].entryFor = inst.instanceId;
        WORLD[entry.col][entry.row].furnitureId = 0;
      }
      continue;
    }
    const off = inst._entryOverride || tpl.entryOffset;
    const ec = inst.anchorCol + off[0], er = inst.anchorRow + off[1];
    const defEc = inst.anchorCol + tpl.entryOffset[0], defEr = inst.anchorRow + tpl.entryOffset[1];
    if (defEc !== ec || defEr !== er) {
      const defCell = WORLD[defEc]?.[defEr];
      if (defCell?.entryFor === inst.instanceId) {
        defCell.entryFor = 0;
        if (!defCell.furnitureId) defCell.walkable = true;
      }
    }
    if (WORLD[ec]?.[er]) {
      WORLD[ec][er].walkable = true;
      WORLD[ec][er].entryFor = inst.instanceId;
      WORLD[ec][er].furnitureId = 0;
    }
  }
}

/** 初始化时把重叠的角色挪到相邻空格 */
function separateOverlappingChars() {
  if (!CHARS?.length) return 0;
  const occupied = new Map();
  let moved = 0;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];
  for (const c of CHARS) {
    const gc = Math.round(c.gridCol), gr = Math.round(c.gridRow);
    const k = `${gc},${gr}`;
    if (!occupied.has(k)) { occupied.set(k, c.id); continue; }
    let placed = false;
    for (let dist = 1; dist <= 6 && !placed; dist++) {
      for (const [dc, dr] of dirs) {
        const nc = gc + dc * dist, nr = gr + dr * dist;
        const nk = `${nc},${nr}`;
        const cell = WORLD[nc]?.[nr];
        if (!cell?.walkable || cell.entryFor || occupied.has(nk)) continue;
        if (isCellOccupiedByAny(nc, nr, c.id)) continue;
        c.gridCol = nc; c.gridRow = nr;
        syncCharPixel(c);
        occupied.set(nk, c.id);
        placed = true;
        moved++;
        break;
      }
    }
    if (!placed) occupied.set(k, c.id);
  }
  return moved;
}

function getEntryCell(inst) {
  if (SceneAccessSystem?.getEntryCellResolved) return SceneAccessSystem.getEntryCellResolved(inst);
  const tpl = getTemplate(inst.templateId);
  return { col: inst.anchorCol + tpl.entryOffset[0], row: inst.anchorRow + tpl.entryOffset[1] };
}

function canUseFurniture(c, inst, urgentNeedKey) {
  const tpl = getTemplate(inst.templateId);
  const action = urgentNeedKey && typeof urgentNeedKey === 'object' ? urgentNeedKey : null;
  const effective = action ? getFurnitureActionRuntime(tpl, action) : tpl;
  const urgentKey = action ? null : urgentNeedKey;
  if (c.sceneId !== inst.sceneId) {
    const access = SceneAccessSystem?.canEnterScene?.(c, inst.sceneId, { noFollow: true });
    if (!(access === true || access?.ok === true)) {
      return `${c.short}无法进入${getScene(inst.sceneId)?.name || '该处'}`;
    }
  }
  const rt = FURN_RT[inst.instanceId];
  const maxUsers = effective.maxUsers ?? tpl.maxUsers;
  if (rt.users.length >= maxUsers && !rt.users.includes(c.id)) return '已满';
  const essential = isEssentialFurniture(tpl);
  const skill = effective.skill || effective.skillReq?.skill;
  const skillLevel = effective.skillLevel || effective.skillReq?.level;
  if (skill && !canUseSkill(c, skill)) {
    return getSkillBlockReason(c, skill) || `需技能${CONFIG.skillDefs[skill]?.name}`;
  }
  if (skill && skillLevel) {
    const level = getSkillLevel(c, skill);
    if (level < skillLevel) {
      const name = CONFIG.skillDefs?.[skill]?.name || skill;
      return `${name}等级不足，需 Lv.${skillLevel}`;
    }
  }
  const economyCheck = EconomySystem?.canUseFurniture?.(c, tpl);
  if (economyCheck !== true) return economyCheck;
  const uk = urgentKey || c.ai?.urgentNeed;
  const urgentCats = uk ? (URGENT_FURN_CATEGORIES[uk] || []) : [];
  const helpsUrgent = uk && (
    effective.needRestores?.some(nr => nr.need === uk) ||
    urgentCats.includes(tpl.category)
  );
  return true;
}

function releaseFurniture(c) {
  if (!c.usingInstanceId) return;
  const iid = c.usingInstanceId;
  const rt = FURN_RT[iid];
  if (rt) rt.users = rt.users.filter(id => id !== c.id);
  c.usingInstanceId = 0;
  releaseFurnitureStandSlot(c, iid);
  EventBus.emit('furniture:released', { instanceId: iid });
  wakeFurnitureWaiters(iid);
}

function wakeFurnitureWaiters(instanceId) {
  for (const c of CHARS) {
    const item = c.actionQueue[0];
    if (item?.type === 'furniture' && item.instanceId === instanceId && item.phase === 'waiting') {
      updateQueueWait(c);
    }
  }
}

function failQueueItem(c, reason) {
  const item = c.actionQueue[0];
  const failInst = item?.instanceId;
  reason = c._lastActionBlockReason || reason || '行动受阻';
  c._lastActionBlockReason = '';
  if (item?.type === 'furniture') releaseFurnitureStandSlot(c, item.instanceId);
  log(`${c.short}行动失败${item ? '「' + item.name + '」' : ''}：${reason}`);
  showActionBlocked(c, reason, item?.type || 'action');
  EventBus.emit('queue:failed', {
    charId: c.id, itemType: item?.type, itemName: item?.name,
    instanceId: item?.instanceId, actionId: item?.actionId,
    sceneId: item?.sceneId || (item?.instanceId ? getInstance(item.instanceId)?.sceneId : 0),
    candidateKey: item?.aiCandidateKey, reason,
  });
  finishCurrentQueueItem(c, true);
  if (c.ai?.urgentNeed) scheduleUrgentRetry(c, failInst);
}

function getFurnitureActionRuntime(tpl, action) {
  const act = action || null;
  const mergedEffects = [
    ...(tpl.extraEffects || []),
    ...((act?.effects || act?.extraEffects || [])),
  ];
  return {
    ...tpl,
    ...(act || {}),
    name: act?.name || tpl.name,
    category: act?.category || tpl.category,
    needRestores: act?.needRestores || tpl.needRestores || [],
    extraEffects: mergedEffects,
    duration: act?.duration ?? tpl.duration,
    maxUsers: act?.maxUsers ?? tpl.maxUsers,
    skill: act?.skill ?? tpl.skill,
    skillLevel: act?.skillLevel ?? tpl.skillLevel,
    skillReq: act?.skillReq ?? tpl.skillReq,
    stopWhenFull: act?.stopWhenFull ?? tpl.stopWhenFull,
    targetNeedValue: act?.targetNeedValue ?? tpl.targetNeedValue,
    minDurationAtTarget: act?.minDurationAtTarget ?? tpl.minDurationAtTarget,
  };
}

function beginFurnitureUse(c, inst, item, onComplete) {
  const tpl = getTemplate(inst.templateId);
  const action = item?.furnitureAction || null;
  const effective = getFurnitureActionRuntime(tpl, action);
  const rt = FURN_RT[inst.instanceId];
  if (!rt.slots) rt.slots = {};
  if (!rt.slots[c.id]) pickFurnitureStandCell(inst, c, false);
  if (rt.slots[c.id]) {
    rt.slots[c.id].role = 'use';
    c.gridCol = rt.slots[c.id].col;
    c.gridRow = rt.slots[c.id].row;
    syncCharPixel(c);
  }
  c._waitingFurnId = 0;
  rt.users.push(c.id);
  c.usingInstanceId = inst.instanceId;
  const duration = NeedAdaptationSystem?.durationFor?.(c, effective, item) ?? effective.duration;
  rt.remaining = duration;
  c.action = {
    type: 'furniture', inst, tpl: effective, baseTpl: tpl, furnitureAction: action, phase: 'use', timer: duration, onComplete,
    needPlan: item?._needPlan || NeedAdaptationSystem?.prepareUse?.(c, effective, item)?.plan,
    playerInitiated: !item?.aiGenerated,
  };
  c.statusText = action?.name ? `${action.name}…` : `使用${tpl.name}…`;
  if (item) { item.phase = 'executing'; item.remaining = duration; }
  const sc = getScene(inst.sceneId);
  log(`${c.short}在${sc?.name || ''}${action?.text ? action.text : '使用' + effective.name}（${duration.toFixed(1)}s）`);
  EventBus.emit('furniture:use_started', {
    charId: c.id, instanceId: inst.instanceId,
    templateId: inst.templateId, category: effective.category, actionId: action?.id || 'default_use',
    activityId: action?.activityId || '',
  });
  uiDirty = true;
}

function tryExecuteFurnitureQueue(c, item) {
  const inst = getInstance(item.instanceId);
  if (!inst) { failQueueItem(c, '家具不存在'); return; }
  const tpl = getTemplate(inst.templateId);
  const pre = canUseFurniture(c, inst);
  if (pre !== true && pre !== '已满') { failQueueItem(c, pre); return; }
  const prepared = NeedAdaptationSystem?.prepareUse?.(c, tpl, item);
  if (prepared && !prepared.ok) { failQueueItem(c, prepared.reason); return; }

  const rt = FURN_RT[inst.instanceId];
  const full = rt.users.length >= tpl.maxUsers && !rt.users.includes(c.id);
  if (full) item.phase = 'waiting';

  const atStand = () => {
    c.action = null;
    c.path = [];
    const chk = canUseFurniture(c, inst);
    if (chk === true) {
      c._waitingFurnId = 0;
      beginFurnitureUse(c, inst, item, () => finishCurrentQueueItem(c));
      return;
    }
    if (chk === '已满') {
      item.phase = 'waiting';
      c._waitingFurnId = inst.instanceId;
      c.statusText = `等待${tpl.name}…`;
      uiDirty = true;
      if (!startPathToFurnitureStand(c, inst, true, () => {})) {
        releaseFurnitureStandSlot(c, inst.instanceId);
        c._waitingFurnId = 0;
      }
      return;
    }
    releaseFurnitureStandSlot(c, inst.instanceId);
    failQueueItem(c, chk);
  };

  if (!startPathToFurnitureStand(c, inst, full, atStand)) {
    failQueueItem(c, full ? '无法排队' : '无法到达');
  }
}

function updateQueueWait(c, dt = 0) {
  if (c.action) return;
  const item = c.actionQueue[0];
  if (!item || item.type !== 'furniture') return;
  if (item.phase === 'waiting') {
    c._queueStallAcc = 0;
    const inst = getInstance(item.instanceId);
    if (!inst) return;
    const tpl = getTemplate(inst.templateId);

    if (canUseFurniture(c, inst) !== true) {
      if (!c._waitingFurnId) c._waitingFurnId = inst.instanceId;
      const slot = pickFurnitureStandCell(inst, c, true);
      if (slot) {
        const atWait = Math.round(c.gridCol) === slot.col && Math.round(c.gridRow) === slot.row;
        if (!atWait) startPathToFurnitureStand(c, inst, true, () => {});
      }
      return;
    }

    const slot = pickFurnitureStandCell(inst, c, false);
    if (!slot) return;
    const atUse = Math.round(c.gridCol) === slot.col && Math.round(c.gridRow) === slot.row;
    if (!atUse) {
      startPathToFurnitureStand(c, inst, false, () => updateQueueWait(c));
      return;
    }
    c._waitingFurnId = 0;
    beginFurnitureUse(c, inst, item, () => finishCurrentQueueItem(c));
    return;
  }
  // 队列已标记 moving 但未出发：隔一段时间重试（例如穿过人物后占位检测误拦）
  if (item.phase === 'moving' && !c.path?.length) {
    c._queueStallAcc = (c._queueStallAcc || 0) + dt;
    if (c._queueStallAcc >= 0.5) {
      c._queueStallAcc = 0;
      tryExecuteFurnitureQueue(c, item);
    }
  } else {
    c._queueStallAcc = 0;
  }
}

function applyFurnEffects(c, tpl, timing) {
  for (const ef of tpl.extraEffects || []) {
    if ((ef.timing || 'end') !== timing) continue;
    const normalized = { ...ef, charId: c.id };
    if (ef.type === 'need') {
      normalized.key = ef.need || ef.key;
      normalized.delta = ef.delta || 0;
    }
    if (ef.type === 'addState') {
      normalized.type = 'state';
      normalized.stateId = ef.param || ef.stateId;
    }
    if (ef.type === 'state') normalized.stateId = ef.param || ef.stateId;
    if (ef.type === 'skillXp') normalized.skill = ef.param || ef.skill;
    if (['need', 'addState', 'state', 'skillXp'].includes(ef.type)) {
      CharacterEffectSystem.apply(normalized, { source: `furniture:${tpl.category}`, reason: tpl.name });
    }
    if (ef.type === 'skillXp') log(`${c.short}「${CONFIG.skillDefs[ef.param || ef.skill]?.name}」经验+${ef.delta || 1}`);
    if (ef.type === 'log' && ef.text) log(ef.text.replace('{A}', c.short), ef.category || 'system');
  }
}

function initRuntime() {
  buildWorldGrid();
  initFurnRuntime();
  CHARS = CONFIG.characters.map(c => {
    const cloned = JSON.parse(JSON.stringify(c));
    const needs = {};
    for (const nd of getNeedDefs()) needs[nd.key] = cloned.needs?.[nd.key] ?? nd.defaultValue ?? 70;
    return {
    ...cloned,
    needs,
    statusText: '闲庭漫步',
    action: null,
    activeStates: [],
    tempNeedMods: [],
    actionQueue: [],
    skillLevels: Object.fromEntries((c.skills || []).map(s => [s, s === 'poetry' ? 3 : 1])),
    memories: [],
    _prevNeeds: { ...needs },
    needMeta: {},
    path: [],
    usingInstanceId: 0,
    _waitingFurnId: 0,
    moveSpeed: 4,
    _lastSceneId: cloned.sceneId,
  };
  });
  CHARS.forEach(syncCharPixel);
  LifePathSystem?.initAllChars?.();
  const separated = separateOverlappingChars();
  if (separated > 0) log(`已校正 ${separated} 名重叠角色位置。`);
  CHARS.forEach(c => initCharAI(c));
  initRelations();
  interactionCooldowns = {};
  interactionOnceUsed = new Set();
  updateCamera(true);
  resizeCanvas();
}
