const SceneAccessSystem = (() => {
  let invitations = [];
  let inviteIdSeq = 1;
  let unsubs = [];

  function cfg() { return CONFIG.sceneAccessConfig || DEFAULT_CONFIG.sceneAccessConfig; }

  function charsInScene(sceneId) {
    return CHARS.filter(c => c.sceneId === sceneId);
  }

  function getPrivilege(role) {
    const privs = cfg().privileges || [];
    return privs.find(p => p.role === role) || privs.find(p => p.role === '门客');
  }

  function getCharRole(c) {
    const fam = FamilySystem.findFamilyOfChar(c.id);
    return FamilySystem.getCharRole(c.id, fam?.id) || c.accessRole || '门客';
  }

  function getCharFamilyId(c) {
    return FamilySystem.findFamilyOfChar(c.id)?.id || 0;
  }

  function getHostFamilyId(c) {
    const hostId = c.hostFamilyId;
    if (hostId) return hostId;
    if (getCharRole(c) !== '门客') return 0;
    return FamilySystem.getCurrentFamilyId?.() || 0;
  }

  function sceneType(sc) { return sc?.sceneType || 'public'; }

  function ownerFamilyName(sc) {
    if (!sc?.ownerFamilyId) return sc?.name || '此处';
    return FamilySystem.getFamily(sc.ownerFamilyId)?.name || sc.name;
  }

  function getQuestGrantedSceneIds(c) {
    const ids = new Set();
    const accepted = QuestSystem.getAcceptedFor?.(c.id) || [];
    for (const inst of accepted) {
      const t = QuestSystem.tpl(inst.templateId);
      if (!t) continue;
      for (const cond of t.completeConditions || []) {
        if (cond.type === 'STAY_IN_SCENE') {
          const sid = QuestSystem.resolveSceneId(cond.target, inst);
          if (sid) ids.add(sid);
        }
        if (cond.type === 'INTERACT_WITH' || cond.type === 'INTERACT_WITH_DURATION') {
          const tid = QuestSystem.resolveTargetCharId(cond.target, inst);
          const target = getChar(tid);
          if (target) ids.add(target.sceneId);
          const tf = FamilySystem.findFamilyOfChar(tid);
          if (tf?.residenceSceneId) ids.add(tf.residenceSceneId);
        }
      }
    }
    return ids;
  }

  function hasInvitation(c, sceneId) {
    const now = getGameTimestamp();
    return invitations.some(i => i.inviteeId === c.id && i.sceneId === sceneId && i.expireAt > now);
  }

  function getFollowLeader(c, noRecurse) {
    const priv = getPrivilege(getCharRole(c));
    if (!noRecurse && priv && !priv.allowFollowEntry) return null;
    const accepted = QuestSystem.getAcceptedFor?.(c.id) || [];
    for (const inst of accepted) {
      const t = QuestSystem.tpl(inst.templateId);
      for (const cond of t?.completeConditions || []) {
        if (cond.type !== 'FOLLOW_CHARACTER') continue;
        const tid = QuestSystem.resolveTargetCharId(cond.target, inst);
        const leader = getChar(tid);
        if (!leader || leader.id === c.id) continue;
        const dist = Math.hypot(leader.gridCol - c.gridCol, leader.gridRow - c.gridRow);
        if (dist <= 18) return leader;
      }
    }
    return null;
  }

  function canEnterScene(c, sceneId, opts = {}) {
    const sc = getScene(sceneId);
    if (!sc || !c) return { ok: false, reason: 'unknown' };
    const type = sceneType(sc);
    if (type === 'public') return { ok: true };
    const fam = FamilySystem.findFamilyOfChar(c.id);
    const famId = fam?.id || 0;
    if (fam?.residenceSceneId === sceneId) return { ok: true };
    if (sc.ownerFamilyId && sc.ownerFamilyId === famId) return { ok: true };
    if (hasInvitation(c, sceneId)) return { ok: true };
    if (getQuestGrantedSceneIds(c).has(sceneId)) return { ok: true };

    if (!opts.noFollow) {
      const leader = getFollowLeader(c);
      if (leader) {
        const lr = canEnterScene(leader, sceneId, { noFollow: true });
        if (lr.ok === true) return { ok: true };
      }
    }

    const priv = getPrivilege(getCharRole(c));
    if (priv?.canEnterAnyPrivate && type === 'private') return { ok: true };
    if (priv?.additionalRules?.includes('host_private') && type === 'private') {
      const host = getHostFamilyId(c);
      if (host && sc.ownerFamilyId === host) return { ok: true };
    }
    if (priv?.additionalRules?.includes('family_private') && type === 'private' && sc.ownerFamilyId === famId)
      return { ok: true };
    if (priv?.additionalRules?.includes('morning_ritual') && type === 'ritual') return { ok: true };

    const needsInvite = priv?.mustBeInvitedFor?.includes(type);
    if (priv?.sceneTypesAllowed?.includes(type) && !needsInvite) return { ok: true };

    if (CHARS.indexOf(c) === selectedIdx) return { ok: 'attempt', reason: 'unauthorized', scene: sc, type };
    return { ok: false, reason: 'denied', scene: sc, type };
  }

  function isSceneAccessible(c, sceneId) {
    const r = canEnterScene(c, sceneId);
    return r.ok === true;
  }

  function getAccessibleSceneIds(c) {
    return CONFIG.scenes.filter(sc => isSceneAccessible(c, sc.id)).map(sc => sc.id);
  }

  function scenesOnPath(path, endCol, endRow) {
    const ids = new Set();
    const startSc = sceneAt(Math.round(path._startCol ?? 0), Math.round(path._startRow ?? 0));
    if (startSc) ids.add(startSc.id);
    for (const p of path) {
      const sc = sceneAt(p.col, p.row);
      if (sc) ids.add(sc.id);
    }
    const endSc = sceneAt(endCol, endRow);
    if (endSc) ids.add(endSc.id);
    return [...ids];
  }

  function checkPathAccess(c, path, endCol, endRow) {
    if (!path) return { ok: false, reason: 'no_path' };
    for (const sid of scenesOnPath(path, endCol, endRow)) {
      // 若角色已身处一个后来变为无权的场景，允许其沿路离开；
      // 否则会出现“越无权越出不来”的软锁。
      if (sid === c.sceneId) continue;
      const r = canEnterScene(c, sid);
      if (r.ok === false) return { ok: false, reason: 'denied', sceneId: sid, scene: getScene(sid) };
      if (r.ok === 'attempt') return { ok: 'attempt', reason: 'unauthorized', sceneId: sid, scene: r.scene, type: r.type };
    }
    return { ok: true };
  }

  function findPathWithAccess(c, sCol, sRow, eCol, eRow, astarOpts = {}) {
    const opts = { excludeCharIds: [c.id, ...(astarOpts.excludeCharIds || [])], blockChars: astarOpts.blockChars };
    const path = astar(sCol, sRow, eCol, eRow, opts);
    if (!path) return null;
    path._startCol = sCol;
    path._startRow = sRow;
    const access = checkPathAccess(c, path, eCol, eRow);
    if (access.ok === false) return null;
    return { path, access };
  }

  function cellKey(c, r) { return c + ',' + r; }

  function getSceneOpenCells(sceneId, ignoreInstanceId) {
    const sc = getScene(sceneId);
    if (!sc) return [];
    const blocked = new Set();
    for (const inst of CONFIG.furnitureInstances) {
      if (inst.sceneId !== sceneId) continue;
      if (ignoreInstanceId && inst.instanceId === ignoreInstanceId) continue;
      const tpl = getTemplate(inst.templateId);
      if (!tpl) continue;
      for (let dx = 0; dx < tpl.gridW; dx++)
        for (let dy = 0; dy < tpl.gridH; dy++)
          blocked.add(cellKey(inst.anchorCol + dx, inst.anchorRow + dy));
    }
    const open = [];
    for (let c = sc.originCol; c < sc.originCol + sc.cols; c++)
      for (let r = sc.originRow; r < sc.originRow + sc.rows; r++) {
        const cell = WORLD[c]?.[r];
        if (!cell || cell.sceneId !== sceneId) continue;
        const edge = c === sc.originCol || r === sc.originRow || c === sc.originCol + sc.cols - 1 || r === sc.originRow + sc.rows - 1;
        if (edge && !isConnection(c, r)) continue;
        if (blocked.has(cellKey(c, r))) continue;
        if (cell.entryFor) { open.push({ col: c, row: r }); continue; }
        if (!cell.furnitureId) open.push({ col: c, row: r });
      }
    return open;
  }

  function floodFrom(sceneId, startCol, startRow, ignoreInstanceId) {
    const open = getSceneOpenCells(sceneId, ignoreInstanceId);
    const openSet = new Set(open.map(p => cellKey(p.col, p.row)));
    const startK = cellKey(startCol, startRow);
    let seed = openSet.has(startK) ? startK : null;
    if (!seed && open.length) seed = cellKey(open[0].col, open[0].row);
    if (!seed) return { connected: open.length === 0, visited: 0, total: open.length, unreachable: open };
    const visited = new Set();
    const stack = [{ col: +seed.split(',')[0], row: +seed.split(',')[1] }];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    while (stack.length) {
      const { col, row } = stack.pop();
      const k = cellKey(col, row);
      if (visited.has(k) || !openSet.has(k)) continue;
      visited.add(k);
      for (const [dc, dr] of dirs) stack.push({ col: col + dc, row: row + dr });
    }
    const unreachable = open.filter(p => !visited.has(cellKey(p.col, p.row)));
    return { connected: unreachable.length === 0, visited: visited.size, total: open.length, unreachable };
  }

  function checkSceneConnectivity(sceneId, ignoreInstanceId) {
    const sc = getScene(sceneId);
    if (!sc) return { ok: false, message: '场景不存在' };
    const midCol = sc.originCol + Math.floor(sc.cols / 2);
    const midRow = sc.originRow + Math.floor(sc.rows / 2);
    const r = floodFrom(sceneId, midCol, midRow, ignoreInstanceId);
    return {
      ok: r.connected,
      sceneId,
      visited: r.visited,
      total: r.total,
      unreachable: r.unreachable.slice(0, 12),
      message: r.connected ? `场景「${sc.name}」通行连通（${r.visited}/${r.total}格）` : `场景「${sc.name}」存在${r.unreachable.length}处被阻断区域`,
    };
  }

  function checkAllScenesConnectivity() {
    return CONFIG.scenes.map(sc => checkSceneConnectivity(sc.id));
  }

  function getScenePathSeed(sceneId, ignoreInstanceId) {
    const sc = getScene(sceneId);
    if (!sc) return null;
    const midCol = sc.originCol + Math.floor(sc.cols / 2);
    const midRow = sc.originRow + Math.floor(sc.rows / 2);
    const mid = WORLD[midCol]?.[midRow];
    if (mid?.walkable && !mid.furnitureId && mid.sceneId === sceneId)
      return { col: midCol, row: midRow };
    const open = getSceneOpenCells(sceneId, ignoreInstanceId);
    return open[0] || null;
  }

  function tryEntryOffset(inst, tpl, ox, oy, seed) {
    const ec = inst.anchorCol + ox, er = inst.anchorRow + oy;
    const cell = WORLD[ec]?.[er];
    if (!cell?.walkable || cell.furnitureId || cell.sceneId !== inst.sceneId) return null;
    if (!seed) return [ox, oy];
    const path = astar(seed.col, seed.row, ec, er, { blockChars: false });
    return path ? [ox, oy] : null;
  }

  function findReachableEntry(inst) {
    const tpl = getTemplate(inst.templateId);
    if (!tpl) return null;
    const seed = getScenePathSeed(inst.sceneId, inst.instanceId);
    const candidates = [];
    const seen = new Set();
    const add = (ox, oy) => {
      const k = ox + ',' + oy;
      if (seen.has(k)) return;
      seen.add(k);
      candidates.push([ox, oy]);
    };
    add(tpl.entryOffset[0], tpl.entryOffset[1]);
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    for (let dist = 1; dist <= 4; dist++)
      for (const [dx, dy] of dirs)
        add(tpl.entryOffset[0] + dx * dist, tpl.entryOffset[1] + dy * dist);
    for (let dx = -1; dx <= tpl.gridW; dx++)
      for (let dy = -1; dy <= tpl.gridH; dy++) {
        if (dx >= 0 && dx < tpl.gridW && dy >= 0 && dy < tpl.gridH) continue;
        add(dx, dy);
      }
    for (const [ox, oy] of candidates) {
      const r = tryEntryOffset(inst, tpl, ox, oy, seed);
      if (r) return r;
    }
    return null;
  }

  function resolveAllFurnitureEntries() {
    const warnings = [];
    for (const inst of CONFIG.furnitureInstances) {
      const tpl = getTemplate(inst.templateId);
      if (!tpl) continue;
      delete inst._entryOverride;
      const resolved = findReachableEntry(inst);
      if (resolved) {
        if (resolved[0] !== tpl.entryOffset[0] || resolved[1] !== tpl.entryOffset[1])
          inst._entryOverride = resolved;
      } else warnings.push(inst.instanceId);
    }
    return warnings;
  }

  function checkAllFurnitureReachable() {
    return CONFIG.furnitureInstances.map(inst => {
      const tpl = getTemplate(inst.templateId);
      const entry = getEntryCellResolved(inst);
      const seed = getScenePathSeed(inst.sceneId, inst.instanceId);
      const cell = WORLD[entry.col]?.[entry.row];
      const walkOk = cell?.walkable && !cell.furnitureId && cell.sceneId === inst.sceneId;
      const pathOk = seed && walkOk && astar(seed.col, seed.row, entry.col, entry.row, { blockChars: false });
      return {
        ok: !!pathOk,
        instanceId: inst.instanceId,
        name: tpl?.name || '?',
        sceneId: inst.sceneId,
        entry,
        message: pathOk
          ? `「${tpl?.name}」(#${inst.instanceId}) 入口可达`
          : `「${tpl?.name}」(#${inst.instanceId}) 入口不可达 (${entry.col},${entry.row})`,
      };
    });
  }

  function getEntryCellResolved(inst) {
    const tpl = getTemplate(inst.templateId);
    const off = inst._entryOverride || tpl.entryOffset;
    return { col: inst.anchorCol + off[0], row: inst.anchorRow + off[1] };
  }

  function grantInvitation(inviter, invitee, sceneId, durationMin) {
    const mins = durationMin ?? cfg().invitationDurationGameMin ?? 120;
    const inv = {
      id: inviteIdSeq++,
      inviterId: inviter.id,
      inviteeId: invitee.id,
      sceneId,
      expireAt: getGameTimestamp() + mins,
      autoAccept: invitee.id === CHARS[selectedIdx]?.id,
    };
    invitations.push(inv);
    EventBus.emit('invitation:sent', inv);
    EventBus.emit('access:granted', { charId: invitee.id, sceneId, source: 'invitation', until: inv.expireAt });
    return inv;
  }

  function acceptInvitation(inv) {
    if (!inv) return;
    EventBus.emit('invitation:accepted', inv);
    log(`${getChar(inv.inviteeId)?.short}应允前往${getScene(inv.sceneId)?.name}。`);
  }

  function declineInvitation(inv, reason) {
    EventBus.emit('invitation:declined', { ...inv, reason });
  }

  function expireInvitations() {
    const now = getGameTimestamp();
    const expired = invitations.filter(i => i.expireAt <= now);
    invitations = invitations.filter(i => i.expireAt > now);
    expired.forEach(i => EventBus.emit('invitation:expired', i));
  }

  function tryAISendInvite(inviter) {
    if (!isAIControlled(inviter) || Math.random() > (cfg().inviteBaseChance || 0.04)) return;
    const inScene = charsInScene(inviter.sceneId);
    if (inScene.length >= 5) return; // 场景已拥挤则不再邀约
    const others = inScene.filter(o => o.id !== inviter.id);
    if (!others.length) return;
    const target = others[Math.floor(Math.random() * others.length)];
    if (getRelationValue(inviter.id, target.id) < 30) return;
    const inv = grantInvitation(inviter, target, inviter.sceneId);
    let acceptChance = 0.5 + getRelationValue(inviter.id, target.id) / 100 * 0.3;
    if (!target.action && !target.actionQueue.length) acceptChance += 0.2;
    acceptChance = TraitEffectSystem?.invitationAcceptanceChance?.(target, acceptChance) ?? acceptChance;
    if (Math.random() < acceptChance) acceptInvitation(inv);
    else declineInvitation(inv, '婉拒');
  }

  function findSceneGuard(sceneId, intruder) {
    const sc = getScene(sceneId);
    if (!sc) return null;
    const inScene = charsInScene(sceneId).filter(c => c.id !== intruder.id);
    if (!inScene.length) return null;
    const ownerFam = sc.ownerFamilyId;
    const guard = inScene.find(c => {
      const fam = FamilySystem.findFamilyOfChar(c.id);
      return fam?.id === ownerFam && ['家主', '配偶', '仆从', '长辈'].includes(getCharRole(c));
    });
    return guard || inScene[0];
  }

  function ejectToScene(c, sceneId) {
    const cells = getSceneOpenCells(sceneId);
    if (!cells.length) return false;
    const cell = cells[Math.floor(Math.random() * cells.length)];
    c.gridCol = cell.col;
    c.gridRow = cell.row;
    const px = gridToPixel(cell.col, cell.row);
    c.x = px.x;
    c.y = px.y;
    c.sceneId = sceneId;
    c._lastSceneId = sceneId;
    c.path = [];
    c.action = null;
    moveCharBucket(c);
    return true;
  }

  function handleUnauthorizedEntry(c, sceneId, oldSceneId) {
    const sc = getScene(sceneId);
    const type = sceneType(sc);
    const intr = cfg().intrusionReactions?.[type] || cfg().intrusionReactions?.private;
    EventBus.emit('scene:enter:unauthorized', { charId: c.id, sceneId, oldSceneId, sceneType: type });
    EventBus.emit('scene:enter:denied', { charId: c.id, sceneId, reason: 'unauthorized' });
    const guard = findSceneGuard(sceneId, c);
    if (guard) {
      MultiInteractSystem.observeAndReact(guard, {
        type: 'scene_enter_unauthorized',
        charId: c.id,
        sceneId,
        sceneType: type,
      });
      if (intr?.relationDelta) CharacterEffectSystem.apply({
        type: 'relation', idA: guard.id, idB: c.id, delta: intr.relationDelta,
      }, { source: 'scene-access:intrusion', reason: `擅入${sc?.name || '受限场景'}` });
    }
    const bubble = (intr?.bubble || '站住！不得擅入。')
      .replace('{owner}', ownerFamilyName(sc))
      .replace('{scene}', sc?.name || '');
    if (guard && NarrativeBubbleSystem?.showBubble)
      NarrativeBubbleSystem.showBubble({ charId: guard.id, text: bubble, style: 'speech', module: 'access', duration: 4 });
    log(`${c.short}擅闯${sc?.name || '禁地'}，被${guard?.short || '人'}拦下。`);
    const back = oldSceneId && isSceneAccessible(c, oldSceneId) ? oldSceneId
      : (FamilySystem.findFamilyOfChar(c.id)?.residenceSceneId || 3);
    ejectToScene(c, back);
    uiDirty = true;
  }

  function onSceneEntered(evt) {
    const c = getChar(evt.charId);
    if (!c || !evt.sceneId || evt.oldSceneId === evt.sceneId) return;
    if (!getScene(evt.sceneId)) return;
    const check = canEnterScene(c, evt.sceneId);
    if (check.ok === true) {
      EventBus.emit('scene:enter:allowed', { charId: c.id, sceneId: evt.sceneId });
      return;
    }
    const back = evt.oldSceneId && isSceneAccessible(c, evt.oldSceneId)
      ? evt.oldSceneId
      : (FamilySystem.findFamilyOfChar(c.id)?.residenceSceneId || 3);
    if (CHARS.indexOf(c) === selectedIdx) {
      handleUnauthorizedEntry(c, evt.sceneId, evt.oldSceneId);
      return;
    }
    ejectToScene(c, back);
    c.statusText = '被阻于门外';
  }

  function repairAllCharacterScenes() {
    let fixed = 0;
    for (const c of CHARS) {
      if (!c) continue;
      const col = Math.round(c.gridCol), row = Math.round(c.gridRow);
      const cell = WORLD[col]?.[row];
      const cellSceneId = cell?.sceneId || sceneAt(col, row)?.id || 0;
      const standingOk = !!(cell?.walkable && cellSceneId && cellSceneId === c.sceneId);
      if (cell?.walkable && cellSceneId && cellSceneId !== c.sceneId && canEnterScene(c, cellSceneId).ok === true) {
        c.sceneId = cellSceneId;
        c._lastSceneId = cellSceneId;
        syncCharPixel(c);
        moveCharBucket(c);
        fixed++;
        continue;
      }
      if (c.sceneId && canEnterScene(c, c.sceneId).ok === true && standingOk) continue;
      const home = FamilySystem.findFamilyOfChar(c.id)?.residenceSceneId || 3;
      const targetSceneId = c.sceneId && canEnterScene(c, c.sceneId).ok === true ? c.sceneId : home;
      if (ejectToScene(c, targetSceneId) || (targetSceneId !== home && ejectToScene(c, home))) fixed++;
    }
    if (fixed) log(`已将 ${fixed} 名角色送回所属院落（权限与位置已校正）。`);
    return fixed;
  }

  function denyMoveLog(c, access, targetName) {
    const sc = access.scene || getScene(access.sceneId);
    const msg = access.ok === 'attempt'
      ? `${c.short}无权擅入${sc?.name || targetName || '该处'}（需邀请或任务通行）`
      : `${c.short}无法进入${sc?.name || targetName || '该处'}`;
    log(msg);
    return msg;
  }

  function init() {
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    unsubs.push(EventBus.on('scene:entered', onSceneEntered));
    unsubs.push(EventBus.on('time:tick', expireInvitations));
  }

  function serialize() {
    return { invitations, inviteIdSeq };
  }

  function apply(data) {
    invitations = data?.invitations || [];
    inviteIdSeq = data?.inviteIdSeq || 1;
  }

  function mergeSceneDefaults(targetCfg) {
    if (!targetCfg.sceneAccessConfig)
      targetCfg.sceneAccessConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.sceneAccessConfig));
    for (const sc of DEFAULT_CONFIG.scenes) {
      const cur = targetCfg.scenes?.find(s => s.id === sc.id);
      if (!cur) continue;
      if (!cur.sceneType) cur.sceneType = sc.sceneType;
      if (cur.ownerFamilyId == null) cur.ownerFamilyId = sc.ownerFamilyId;
      if (cur.ownerCharacterId == null) cur.ownerCharacterId = sc.ownerCharacterId;
      if (cur.isTransition == null) cur.isTransition = sc.isTransition;
    }
  }

  return {
    init, cfg, canEnterScene, isSceneAccessible, getAccessibleSceneIds,
    findPathWithAccess, checkPathAccess, checkSceneConnectivity, checkAllScenesConnectivity,
    resolveAllFurnitureEntries, getEntryCellResolved, checkAllFurnitureReachable,
    grantInvitation, acceptInvitation,
    handleUnauthorizedEntry, denyMoveLog, tryAISendInvite, ejectToScene, repairAllCharacterScenes,
    serialize, apply, mergeSceneDefaults: migrateSceneAccessFields,
  };
})();
window.SceneAccessSystem = SceneAccessSystem;

function migrateSceneAccessFields(cfg) {
  if (!cfg.sceneAccessConfig)
    cfg.sceneAccessConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG.sceneAccessConfig));
  const servantPriv = cfg.sceneAccessConfig.privileges?.find(p => p.role === '仆从');
  if (servantPriv) servantPriv.allowFollowEntry = true;
  if (!cfg.scenes?.length) {
    cfg.scenes = JSON.parse(JSON.stringify(DEFAULT_CONFIG.scenes));
    cfg.connections = JSON.parse(JSON.stringify(DEFAULT_CONFIG.connections));
  } else {
    for (const sc of DEFAULT_CONFIG.scenes) {
      let cur = cfg.scenes.find(s => s.id === sc.id);
      if (!cur) {
        cfg.scenes.push(JSON.parse(JSON.stringify(sc)));
        continue;
      }
      if (!cur.sceneType) cur.sceneType = sc.sceneType;
      if (cur.ownerFamilyId == null) cur.ownerFamilyId = sc.ownerFamilyId;
      if (cur.ownerCharacterId == null) cur.ownerCharacterId = sc.ownerCharacterId;
      if (cur.isTransition == null) cur.isTransition = sc.isTransition;
    }
  }
  if (!cfg.furnitureInstances?.length)
    cfg.furnitureInstances = JSON.parse(JSON.stringify(DEFAULT_CONFIG.furnitureInstances));
}
