/* ═══════════════════ 归巢性（栖居偏好）AI ═══════════════════
 * homewardness 0~100：高 → 偏居家、在家解决需求、回自家睡；
 * 低 → 偏外向、爱逛公共场所、社交权重更高。
 */
const AiHomeward = (() => {
  const TRAIT_MOD = {
    haoke: -14, fengliu: -12, duoqing: -10,
    lazy: 12, shuchi: 8, qingjie: 10, kebo: -6,
  };

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function getHomeSceneId(c) {
    if (!c) return 3;
    if (typeof ResidenceSystem !== 'undefined') return ResidenceSystem.getHomeSceneId(c, c.sceneId || 3);
    const fam = FamilySystem?.findFamilyOfChar?.(c.id);
    return fam?.residenceSceneId ?? c.sceneId ?? 3;
  }

  function getHomewardness(c) {
    if (!c) return 50;
    const def = typeof getCharDef === 'function' ? getCharDef(c.id) : null;
    let v = def?.homewardness ?? 50;
    try {
      for (const tr of getCharTraits(c)) {
        if (TRAIT_MOD[tr] != null) v += TRAIT_MOD[tr];
      }
    } catch (e) {}
    if (c.activeStates?.some(s => ['melancholy', 'ganshang', 'exhausted'].includes(s.id))) v += 8;
    if (c.activeStates?.some(s => ['elated', 'joyful', 'tipsySocial', 'renao'].includes(s.id))) v -= 6;
    return clamp(Math.round(v), 0, 100);
  }

  function homewardLabel(v) {
    if (v >= 75) return '深居';
    if (v >= 58) return '恋巢';
    if (v >= 42) return '寻常';
    if (v >= 25) return '好游';
    return '外向';
  }

  function sceneTypeOf(sceneId) {
    return getScene(sceneId)?.sceneType || 'public';
  }

  function isPublicScene(sceneId) {
    const sc = getScene(sceneId);
    if (!sc) return false;
    return sc.sceneType === 'public' || sc.isTransition === true;
  }

  function candSceneId(c, cand) {
    if (cand.kind === 'furniture') return getInstance(cand.instanceId)?.sceneId;
    if (cand.kind === 'interaction') return getChar(cand.targetCharId)?.sceneId;
    if (cand.kind === 'wander' || cand.kind === 'seek') return sceneAt(cand.gridCol, cand.gridRow)?.id;
    return c.sceneId;
  }

  function homewardFactor(c, cand) {
    const hw = getHomewardness(c) / 100;
    const outgoing = 1 - hw;
    const homeId = getHomeSceneId(c);
    const sid = candSceneId(c, cand);
    if (!sid) return 1;
    const atHome = sid === homeId;
    const isPublic = isPublicScene(sid);
    const socialCats = ['xujiu', 'tiaoxiao', 'chuanqing', 'weijie', 'lundao', 'zhengchi'];

    if (cand.kind === 'furniture') {
      const tpl = getTemplate(getInstance(cand.instanceId)?.templateId);
      const cat = tpl?.category || cand.category;
      const isBed = cat === 'bed' || cand.tags?.includes('sleep');
      const isRest = ['bed', 'rest', 'bath'].includes(cat);
      if (isBed) {
        if (atHome) return 1 + hw * 5;
        return Math.max(0.04, 0.15 + outgoing * 0.25);
      }
      if (isRest || ['meal', 'snack', 'kitchen', 'table', 'wash', 'wardrobe'].includes(cat)) {
        if (atHome) return 1 + hw * 2;
        return Math.max(0.25, 1 - hw * 0.65);
      }
      if (atHome) return 1 + hw * 0.6;
      return Math.max(0.4, 1 - hw * 0.35);
    }

    if (cand.kind === 'interaction') {
      if (!socialCats.includes(cand.category)) return 1;
      if (isPublic || !atHome) return 1 + outgoing * 0.85;
      return Math.max(0.5, 1 + outgoing * 0.35 - hw * 0.25);
    }

    if (cand.kind === 'wander' || cand.kind === 'seek') {
      if (atHome) return 1 + hw * 1.2;
      if (isPublic) return 1 + outgoing * 0.9;
      return Math.max(0.5, 1 - hw * 0.2);
    }
    return 1;
  }

  /** 紧急寻床/歇息：优先自家 */
  function urgentFurnitureScore(c, inst, tpl, needKey, dist) {
    const hw = getHomewardness(c) / 100;
    const homeId = getHomeSceneId(c);
    let score = dist;
    const sleepNeed = needKey === 'energy' || needKey === 'sleep';
    if (sleepNeed && tpl.category === 'bed') {
      if (inst.sceneId === homeId) score -= 40 * hw;
      else score += 35 * hw;
    } else if (inst.sceneId === homeId) {
      score -= 12 * hw;
    } else {
      score += 8 * hw;
    }
    return score;
  }

  function randomCellInScene(sceneId, selfId, accessible) {
    const sc = getScene(sceneId);
    if (!sc) return null;
    for (let t = 0; t < 12; t++) {
      const col = sc.originCol + 1 + Math.floor(Math.random() * Math.max(1, sc.cols - 2));
      const row = sc.originRow + 1 + Math.floor(Math.random() * Math.max(1, sc.rows - 2));
      const cell = WORLD[col]?.[row];
      if (!cell?.walkable || cell.entryFor) continue;
      if (accessible && !accessible.has(sceneId)) continue;
      return { col, row };
    }
    return null;
  }

  function randomPublicCell(selfId, accessible) {
    const publicScenes = CONFIG.scenes.filter(s =>
      s.sceneType === 'public' && (!accessible || accessible.has(s.id)));
    if (!publicScenes.length) return null;
    const sc = publicScenes[Math.floor(Math.random() * publicScenes.length)];
    return randomCellInScene(sc.id, selfId, accessible);
  }

  function extraWanderCandidates(c, accessible) {
    const hw = getHomewardness(c) / 100;
    const outgoing = 1 - hw;
    const homeId = getHomeSceneId(c);
    const out = [];
    const homeN = Math.round(1 + hw * 3);
    if (getScene(homeId)) {
      for (let i = 0; i < homeN; i++) {
        const cell = randomCellInScene(homeId, c.id, accessible);
        if (!cell) continue;
        out.push({
          key: `w:home:${cell.col},${cell.row}`, kind: 'wander',
          gridCol: cell.col, gridRow: cell.row,
          tags: ['outdoor'], baseWeight: 0.35 + hw * 0.4,
          label: '居家闲步',
        });
      }
    }
    const pubN = Math.round(1 + outgoing * 2);
    for (let i = 0; i < pubN; i++) {
      const cell = randomPublicCell(c.id, accessible);
      if (!cell) continue;
      out.push({
        key: `w:pub:${cell.col},${cell.row}`, kind: 'wander',
        gridCol: cell.col, gridRow: cell.row,
        tags: ['outdoor', 'xujiu'], baseWeight: 0.25 + outgoing * 0.45,
        label: '逛园',
      });
    }
    return out;
  }

  return {
    getHomewardness, getHomeSceneId, homewardFactor, homewardLabel,
    urgentFurnitureScore, extraWanderCandidates, isPublicScene,
  };
})();
