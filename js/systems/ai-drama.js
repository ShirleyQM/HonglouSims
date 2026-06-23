/* ═══════════════════ AI 戏剧化层 ═══════════════════
 * 在不改动核心效用机的前提下，为 NPC 社交决策注入：
 *   1) 情绪标量 mood(c) ∈ [-1,1]
 *   2) 关系/类别驱动的社交因子 socialFactor
 *   3) 短时戏剧意图 intent（求爱/安慰/对峙/赌气/和解）
 *   4) 跨距离追人候选 seek
 * 全部经 dramaFactor 注入 finalizeCandidate，缺省返回 1，向后兼容。
 */
const AiDrama = (() => {
  const cfg = {
    intentDurationMin: 90,      // 意图存活（游戏分钟）
    jealousyAffinityMin: 55,    // 第三方嫉妒触发的好感阈值
    seekMinDistance: 6,         // 目标超过此距离才生成 seek
    courtAffectionMin: 60,
  };

  // 情绪类状态价值（用于 mood 合成）
  const STATE_VALENCE = {
    elated: 0.6, joyful: 0.5, heartFlutter: 0.6, warmCozy: 0.5, doted: 0.5,
    teaHeart: 0.3, tipsySocial: 0.3, secretCrush: 0.3, renao: 0.3, zizai: 0.2,
    melancholy: -0.6, ganshang: -0.6, angry: -0.5, baonu: -0.7, offended: -0.5,
    brokenBond: -0.8, awkward: -0.3, punished: -0.6, unfilial: -0.7,
    chikuang: -0.4, selfDemeaning: -0.3, exhausted: -0.3,
  };

  // 意图类型 → 关注的互动类别 + 优先级
  const INTENT_DEF = {
    court:     { cat: 'chuanqing', prio: 3 },
    confront:  { cat: 'zhengchi',  prio: 4 },
    comfort:   { cat: 'weijie',    prio: 2 },
    reconcile: { cat: 'weijie',    prio: 2 },
    sulk:      { cat: null,        prio: 1 },
  };

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function hasTrait(c, t) {
    try { return getCharTraits(c).includes(t); } catch (e) { return false; }
  }

  /** 情绪标量 [-1,1]：需求均值 + 情绪状态价值 */
  function mood(c) {
    if (!c) return 0;
    let m = 0;
    try {
      const stableMood = c.needs?.mood;
      if (stableMood != null) {
        m = (stableMood - 50) / 50 * 0.7;
      } else {
        const needs = getNeedDefs().map(n => c.needs[n.key]);
        const avg = needs.reduce((a, b) => a + b, 0) / Math.max(1, needs.length);
        m = (avg - 50) / 50 * 0.6;
      }
    } catch (e) {}
    for (const st of c.activeStates || []) {
      if (STATE_VALENCE[st.id] != null) m += STATE_VALENCE[st.id];
    }
    return clamp(m, -1, 1);
  }

  /** 社交因子：关系四轴 × 互动类别（仅 interaction 候选）*/
  function socialFactor(c, cand) {
    if (cand.kind !== 'interaction') return 1;
    const target = getChar(cand.targetCharId);
    if (!target) return 1;
    const info = (typeof getRelationInfo === 'function')
      ? getRelationInfo(c.id, target.id)
      : { affection: 0, trust: 0, friendship: 0, score: 0 };
    const aff = info.affection ?? 0, tru = info.trust ?? 0;
    const fr = info.friendship ?? 0, score = info.score ?? 0;
    const sub = (typeof getRelationAxis === 'function')
      ? getRelationAxis(c.id, target.id, 'submission') : 0;
    const myMood = mood(c), tMood = mood(target);
    let f = 1;
    switch (cand.category) {
      case 'chuanqing':
        f *= clamp(0.15 + aff / 50, 0.05, 3.0);
        if (hasTrait(c, 'duoqing') || hasTrait(c, 'fengliu')) f *= 1.2;
        break;
      case 'weijie': {
        const care = clamp((aff + fr) / 120, 0, 1.5);
        const need = tMood < -0.15 ? (1.2 + (-tMood) * 1.8) : 0.7;
        f *= clamp(care * need + 0.3, 0.2, 3.0);
        break;
      }
      case 'tiaoxiao':
        f *= clamp(0.3 + (aff + fr) / 120, 0.2, 2.0);
        if (myMood > 0.2 && tMood > 0) f *= 1.2;
        break;
      case 'xujiu':
        f *= clamp(0.5 + score / 120, 0.3, 1.8);
        break;
      case 'lundao':
        f *= clamp(0.4 + tru / 100, 0.3, 1.8);
        if (hasTrait(c, 'shuchi') || hasTrait(c, 'qinggao')) f *= 1.2;
        break;
      case 'zhengchi': {
        const hostility = clamp((-score) / 60, 0, 1.5);
        const aggressive = (myMood < -0.2 ? 0.8 : 0) + (hasTrait(c, 'kebo') ? 0.8 : 0);
        f *= clamp(0.15 + hostility + aggressive, 0.05, 3.0);
        if (sub > 50 && myMood > -0.4) f *= 0.3; // 对长辈/上位者除非盛怒不顶撞
        break;
      }
      default:
        break;
    }
    return f;
  }

  /* ── 意图 ── */
  function getIntent(c) {
    const it = c.ai?.intent;
    if (!it) return null;
    if (getGameTimestamp() > it.until) { c.ai.intent = null; return null; }
    return it;
  }

  function setIntent(c, type, targetId) {
    if (!c?.ai) return;
    const def = INTENT_DEF[type];
    if (!def) return;
    const cur = getIntent(c);
    if (cur && (INTENT_DEF[cur.type]?.prio || 0) >= def.prio) return; // 不被低优先级覆盖
    c.ai.intent = {
      type, targetId: targetId || null, cat: def.cat,
      until: getGameTimestamp() + cfg.intentDurationMin,
    };
    EventBus.emit('ai:intent', { charId: c.id, type, targetId });
  }

  /** 意图因子：匹配意图的候选大幅加权；赌气压社交、抬独处 */
  function intentFactor(c, cand) {
    const it = getIntent(c);
    if (!it) return 1;
    if (it.type === 'sulk') {
      if (cand.kind === 'interaction') return 0.3;
      if (cand.tags?.includes('solitude')) return 2.0;
      return 1;
    }
    if (cand.kind === 'interaction' && it.cat) {
      const catMatch = cand.category === it.cat;
      const targetMatch = !it.targetId || cand.targetCharId === it.targetId;
      if (catMatch && targetMatch) return 2.6;
      if (it.targetId && cand.targetCharId === it.targetId) return 1.4;
      return 0.7; // 有明确意图时，无关社交略降以聚焦
    }
    return 1;
  }

  function dramaFactor(c, cand) {
    return socialFactor(c, cand) * intentFactor(c, cand);
  }

  /* ── 跨距离追人：朝意图目标生成 seek 候选 ── */
  function walkableNear(col, row) {
    const offsets = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    for (const [dc, dr] of offsets) {
      const nc = col + dc, nr = row + dr;
      if (WORLD[nc]?.[nr]?.walkable && !WORLD[nc][nr].entryFor && !charAtCell(nc, nr, [])) return { col: nc, row: nr };
    }
    return null;
  }

  function extraCandidates(c, accessible) {
    const it = getIntent(c);
    if (!it || !it.targetId) return [];
    const target = getChar(it.targetId);
    if (!target) return [];
    const dist = Math.hypot(target.gridCol - c.gridCol, target.gridRow - c.gridRow);
    if (dist <= cfg.seekMinDistance) return []; // 已在身边，交给社交因子
    if (accessible && target.sceneId != null && !accessible.has(target.sceneId)) return []; // 进不去
    const spot = walkableNear(Math.round(target.gridCol), Math.round(target.gridRow));
    if (!spot) return [];
    const tag = it.type === 'confront' ? 'zhengchi' : it.type === 'court' ? 'chuanqing' : 'weijie';
    return [{
      key: `seek:${it.targetId}`, kind: 'seek',
      gridCol: spot.col, gridRow: spot.row,
      tags: [tag], baseWeight: 1.6, label: `寻${target.short}`,
    }];
  }

  /* ── 事件钩子：涌现意图 ── */
  function interactionCategory(id) {
    return CONFIG.interactionTemplates?.[id]?.category || '';
  }

  function onInteractionComplete(evt) {
    const initiator = getChar(evt.initiatorId);
    const target = getChar(evt.targetId);
    if (!initiator || !target) return;
    const cat = interactionCategory(evt.interactionId);

    // 达成意图 → 清除
    const it = initiator.ai && getIntent(initiator);
    if (it && it.cat === cat && (!it.targetId || it.targetId === target.id)) {
      initiator.ai.intent = null;
    }

    // 争执：败方（被发起方）赌气或反击
    if (cat === 'zhengchi' && isAIControlled(target)) {
      if (hasTrait(target, 'kebo')) setIntent(target, 'confront', initiator.id);
      else setIntent(target, 'sulk', null);
    }

    // 传情：第三方嫉妒
    if (cat === 'chuanqing') {
      for (const c3 of CHARS) {
        if (c3.id === initiator.id || c3.id === target.id) continue;
        if (!isAIControlled(c3)) continue;
        const aff = (typeof getRelationAxis === 'function')
          ? getRelationAxis(c3.id, target.id, 'affection') : 0;
        if (aff >= cfg.jealousyAffinityMin) {
          if (hasTrait(c3, 'kebo') || mood(c3) < -0.2) setIntent(c3, 'confront', initiator.id);
          else setIntent(c3, 'sulk', null);
        }
      }
    }
  }

  function onRelationThreshold(evt) {
    if (evt.axis !== 'affection' || evt.threshold < cfg.courtAffectionMin) return;
    for (const [self, other] of [[evt.idA, evt.idB], [evt.idB, evt.idA]]) {
      const c = getChar(self);
      if (!c || !isAIControlled(c)) continue;
      if (hasTrait(c, 'duoqing') || hasTrait(c, 'fengliu')) setIntent(c, 'court', other);
    }
  }

  function onInteractionState(evt) {
    // 决裂/受伤：与旧友闹崩后，多情者萌生和解意图
    if (evt.stateId !== 'brokenBond' && evt.stateId !== 'ganshang') return;
    const c = getChar(evt.charId);
    const other = getChar(evt.otherId);
    if (c && other && isAIControlled(c) && hasTrait(c, 'duoqing')) {
      const fr = (typeof getRelationAxis === 'function')
        ? getRelationAxis(c.id, other.id, 'friendship') : 0;
      if (fr >= 30) setIntent(c, 'reconcile', other.id);
    }
  }

  function init() {
    EventBus.on('interaction:complete', onInteractionComplete);
    EventBus.on('relation:threshold', onRelationThreshold);
    EventBus.on('interaction:state', onInteractionState);
  }

  return {
    cfg, init, mood, socialFactor, intentFactor, dramaFactor,
    extraCandidates, getIntent, setIntent,
  };
})();
