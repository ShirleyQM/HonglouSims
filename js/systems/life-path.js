/* ═══════════════════ LIFE PATH / REPUTATION (人生路径·声望) ═══════════════════ */
const LifePathSystem = (() => {
  let unsubs = [];
  let idleDecayAcc = 0;

  function cfg() {
    return CONFIG.lifePathConfig || DEFAULT_CONFIG.lifePathConfig || {};
  }
  function st() { return cfg().settings || {}; }

  function getPath(pathId) {
    return pathId ? cfg().paths?.[pathId] : null;
  }

  function getStage(stageId) {
    return stageId ? cfg().stages?.[stageId] : null;
  }

  function getCharDefRank(charId) {
    return CONFIG.characters?.find(c => c.id === charId)?.socialRank ?? 2;
  }

  function initChar(c) {
    if (!c) return;
    if (c.reputation == null) c.reputation = 0;
    if (!c.professionHistory) c.professionHistory = [];
    if (c.lifePath === undefined) c.lifePath = null;
    if (c.currentStage === undefined) c.currentStage = null;
    if (c._baseSocialRank == null) c._baseSocialRank = getCharDefRank(c.id);
    if (!c.storyNodes) c.storyNodes = {};
    if (!c.storyStreaks) c.storyStreaks = {};
    MoneySystem?.initChar?.(c);
  }

  function initAllChars() {
    CHARS?.forEach(initChar);
  }

  function clampRep(v) {
    return Math.max(0, Math.min(st().maxReputation ?? 1000, Math.round(v)));
  }

  function getReputation(c) {
    initChar(c);
    return c.reputation ?? 0;
  }

  function getReputationTier(rep) {
    const tiers = [...(st().reputationTiers || [])].sort((a, b) => b.min - a.min);
    for (const t of tiers) {
      if (rep >= (t.min ?? 0)) return t;
    }
    return tiers[tiers.length - 1] || { min: 0, title: '默默无闻', socialBonus: 0 };
  }

  function getCharTier(c) {
    return getReputationTier(getReputation(c));
  }

  function changeReputation(c, delta, reason) {
    if (!c || !delta) return 0;
    initChar(c);
    const old = c.reputation;
    c.reputation = clampRep(old + delta);
    const actual = c.reputation - old;
    if (actual !== 0) {
      const tier = getReputationTier(c.reputation);
      log(`声望：${c.short} ${old}→${c.reputation}（${tier.title}）${reason ? ' · ' + reason : ''}`, 'social');
      EventBus.emit('reputation:change', {
        charId: c.id, old, new: c.reputation, delta: actual, reason, tier: tier.title,
      });
      tryPromote(c);
      uiDirty = true;
    }
    return actual;
  }

  function applyReputationDelta(c, key) {
    const spec = st().reputationDeltas?.[key];
    if (spec == null) return 0;
    if (typeof spec === 'number') return changeReputation(c, spec, key);
    const delta = spec.min + Math.floor(Math.random() * (spec.max - spec.min + 1));
    return changeReputation(c, delta, key);
  }

  /** 路径阶段覆盖的 SocialRank；无路径时返回配置原值 */
  function getEffectiveSocialRank(charId) {
    const c = typeof charId === 'object' ? charId : getChar(charId);
    if (!c) return getCharDefRank(typeof charId === 'string' ? charId : charId?.id);
    initChar(c);
    if (c.lifePath && c.currentStage) {
      const stage = getStage(c.currentStage);
      if (stage?.rankOverride != null) return stage.rankOverride;
    }
    return c._baseSocialRank ?? getCharDefRank(c.id);
  }

  function getStageTitle(c) {
    if (!c?.currentStage) return '';
    return getStage(c.currentStage)?.title || '';
  }

  function getDisplayTitle(c) {
    const stageTitle = getStageTitle(c);
    if (stageTitle) return stageTitle;
    const rank = getEffectiveSocialRank(c);
    const labels = CONFIG.identityProtocolConfig?.rankLabels || {};
    return labels[rank] || `等级${rank}`;
  }

  function checkGender(path, c) {
    const g = path.genderConstraint;
    if (!g || g === 'any') return { ok: true };
    const cg = c.gender || '';
    if (g === 'female_only') return cg === '女' ? { ok: true } : { ok: false, reason: '仅限女子' };
    if (g === 'male_only') return cg === '男' ? { ok: true } : { ok: false, reason: '仅限男子' };
    return { ok: true };
  }

  function canStartPath(c, pathId) {
    const path = getPath(pathId);
    if (!path || !c) return { ok: false, reason: '路径无效' };
    if (c.lifePath === pathId) return { ok: false, reason: '已在该路径' };
    const rank = c._baseSocialRank ?? getCharDefRank(c.id);
    const allowed = path.requiredInitialRank;
    if (allowed?.length && !allowed.includes(rank)) {
      return { ok: false, reason: `需身份等级${allowed.join('/')}（当前${rank}）` };
    }
    const gender = checkGender(path, c);
    if (!gender.ok) return gender;
    return { ok: true };
  }

  function getAvailablePaths(c) {
    return Object.values(cfg().paths || {})
      .map(p => ({ path: p, ...canStartPath(c, p.id) }))
      .filter(x => x.ok || c.lifePath === x.path.id);
  }

  function pushHistory(c, stageId, end = false) {
    const stage = getStage(stageId);
    if (!stage) return;
    const entry = {
      pathId: c.lifePath,
      stageId,
      title: stage.title,
      fromDay: gameDay,
      toDay: end ? gameDay : null,
    };
    const prev = c.professionHistory[c.professionHistory.length - 1];
    if (prev && !prev.toDay) prev.toDay = gameDay;
    c.professionHistory.push(entry);
  }

  function startPath(c, pathId) {
    const chk = canStartPath(c, pathId);
    if (!chk.ok) return chk;
    const path = getPath(pathId);
    const firstStage = path.stages?.[0];
    if (!firstStage) return { ok: false, reason: '路径无阶段' };

    if (c.lifePath && c.lifePath !== pathId) quitPath(c, { silent: true });

    initChar(c);
    c._baseSocialRank = c._baseSocialRank ?? getCharDefRank(c.id);
    c.lifePath = pathId;
    c.currentStage = firstStage;
    pushHistory(c, firstStage);

    for (const sk of path.defaultSkills || []) {
      if (!c.skills) c.skills = [];
      if (!c.skills.includes(sk)) c.skills.push(sk);
      if (!c.skillLevels) c.skillLevels = {};
      if (c.skillLevels[sk] == null) c.skillLevels[sk] = 1;
    }

    log(`${c.short}踏上「${path.name}」之路（${getStage(firstStage)?.title || firstStage}）。`, 'social');
    EventBus.emit('lifePath:started', { charId: c.id, pathId, stageId: firstStage });
    uiDirty = true;
    return { ok: true };
  }

  function quitPath(c, opts = {}) {
    if (!c?.lifePath) return { ok: false, reason: '未在路径中' };
    const path = getPath(c.lifePath);
    const penalty = path?.quittingPenalty ?? st().quittingPenaltyDefault ?? -50;
    const oldPath = c.lifePath;
    const oldStage = c.currentStage;

    if (c.professionHistory.length) {
      const last = c.professionHistory[c.professionHistory.length - 1];
      if (last && !last.toDay) last.toDay = gameDay;
    }

    c.lifePath = null;
    c.currentStage = null;

    if (!opts.silent && penalty) {
      changeReputation(c, penalty, '半途而废');
    }

    if (!opts.silent) {
      log(`${c.short}退出「${path?.name || oldPath}」之路。`, 'social');
      EventBus.emit('lifePath:quit', { charId: c.id, pathId: oldPath, stageId: oldStage, penalty });
    }
    uiDirty = true;
    return { ok: true };
  }

  function readSkillLevel(c, skillId) {
    return c.skillLevels?.[skillId] ?? 0;
  }

  function checkStageRequirements(c, stageId) {
    const stage = getStage(stageId);
    if (!stage) return { ok: false, reason: '阶段无效', missing: [] };

    const missing = [];
    const rep = getReputation(c);
    if (stage.requiredReputation != null && rep < stage.requiredReputation) {
      missing.push({ type: 'reputation', need: stage.requiredReputation, have: rep });
    }

    for (const [sk, lv] of Object.entries(stage.requiredSkills || {})) {
      const have = readSkillLevel(c, sk);
      if (have < lv) {
        const name = CONFIG.skillDefs?.[sk]?.name || sk;
        missing.push({ type: 'skill', skill: sk, name, need: lv, have });
      }
    }

    for (const [relId, minScore] of Object.entries(stage.requiredRelations || {})) {
      const have = typeof getRelationValue === 'function' ? getRelationValue(c.id, relId) : 0;
      if (have < minScore) {
        const other = getChar(relId);
        missing.push({ type: 'relation', targetId: relId, name: other?.short || relId, need: minScore, have });
      }
    }

    for (const nodeId of stage.requiredStoryNodes || []) {
      if (!isNodeDone(c, nodeId)) {
        const nodeCfg = cfg().storyNodes?.[nodeId];
        missing.push({ type: 'storyNode', nodeId, name: nodeCfg?.name || nodeId });
      }
    }

      if (missing.length) {
      const hint = missing.map(m => {
        if (m.type === 'reputation') return `声望≥${m.need}`;
        if (m.type === 'skill') return `${m.name}≥${m.need}`;
        if (m.type === 'relation') return `与${m.name}情分≥${m.need}`;
        if (m.type === 'storyNode') return `须完成「${m.name}」`;
        return '';
      }).filter(Boolean).join('，');
      return { ok: false, reason: `需${hint}`, missing };
    }
    return { ok: true };
  }

  function promoteToStage(c, stageId) {
    const stage = getStage(stageId);
    if (!stage || stage.pathId !== c.lifePath) return { ok: false, reason: '阶段不匹配' };
    const chk = checkStageRequirements(c, stageId);
    if (!chk.ok) return chk;

    const oldStage = c.currentStage;
    c.currentStage = stageId;
    pushHistory(c, stageId);

    log(`${c.short}晋升「${stage.title}」！`, 'social');
    EventBus.emit('lifePath:promoted', {
      charId: c.id, pathId: c.lifePath, oldStageId: oldStage, stageId, title: stage.title,
    });
    uiDirty = true;
    return { ok: true, stage };
  }

  function tryPromote(c) {
    if (!c?.lifePath || !c.currentStage) return null;
    const stage = getStage(c.currentStage);
    const nextIds = stage?.nextStages || [];
    for (const nid of nextIds) {
      const chk = checkStageRequirements(c, nid);
      if (chk.ok) return promoteToStage(c, nid);
    }
    return null;
  }

  function getUnlockedScenePermissions(c) {
    if (!c?.currentStage) return [];
    const stage = getStage(c.currentStage);
    return stage?.scenePermissions || [];
  }

  function hasScenePermission(c, perm) {
    return getUnlockedScenePermissions(c).includes(perm);
  }

  function getDailyTaskIds(c) {
    if (!c?.currentStage) return [];
    return getStage(c.currentStage)?.dailyTasks || [];
  }

  function getSpecialActionIds(c) {
    if (!c?.currentStage) return [];
    return getStage(c.currentStage)?.specialActions || [];
  }

  function questMatchesPath(templateId, c) {
    if (!c?.lifePath) return true;
    const pool = getDailyTaskIds(c);
    if (!pool.length) return true;
    return pool.includes(templateId);
  }

  /* ─── Story Node System ─────────────────────────────────────────────── */

  function isNodeDone(c, nodeId) {
    return !!c?.storyNodes?.[nodeId]?.done;
  }

  function recordStoryNode(c, nodeId, choice) {
    if (!c) return;
    initChar(c);
    if (c.storyNodes[nodeId]?.done) return;
    c.storyNodes[nodeId] = { done: true, choice: choice || null, day: typeof gameDay !== 'undefined' ? gameDay : 0 };
    const nodeCfg = cfg().storyNodes?.[nodeId];
    const rewards = (choice && nodeCfg?.choiceRewards?.[choice])
      ? nodeCfg.choiceRewards[choice]
      : (nodeCfg?.rewards || []);

    for (const rew of rewards) {
      try {
        if (rew.type === 'state') {
          const target = rew.charId ? getChar(rew.charId) : c;
          if (target && typeof applyState === 'function') applyState(target, rew.stateId);
        } else if (rew.type === 'reputation') {
          changeReputation(c, rew.delta, nodeId);
        } else if (rew.type === 'axis') {
          if (typeof changeRelationAxis === 'function') changeRelationAxis(c.id, rew.targetId, rew.axis, rew.delta);
        } else if (rew.type === 'skill_xp') {
          if (!c.skillLevels) c.skillLevels = {};
          c.skillLevels[rew.skill] = (c.skillLevels[rew.skill] || 0) + rew.delta;
        } else if (rew.type === 'money') {
          MoneySystem?.changeMoney?.(c, rew.delta, nodeId);
        } else if (rew.type === 'pathFlag') {
          MoneySystem?.setPathFlag?.(c, rew.key, rew.delta ?? 1);
        } else if (rew.type === 'agent') {
          MoneySystem?.registerAgent?.(c, rew.agentId, rew.loyalty);
        } else if (rew.type === 'familyFund') {
          const fam = FamilySystem?.findFamilyOfChar?.(c.id);
          if (fam) MoneySystem?.changeFamilyFund?.(fam.id, rew.delta, nodeId);
        }
      } catch (e) { /* reward application is best-effort */ }
    }

    if (nodeCfg?.pathFlagOnComplete) {
      for (const [k, v] of Object.entries(nodeCfg.pathFlagOnComplete)) {
        MoneySystem?.setPathFlag?.(c, k, v);
      }
    }
    if (nodeCfg?.greedOnComplete) MoneySystem?.setPathFlag?.(c, 'greedCount', nodeCfg.greedOnComplete);
    if ((MoneySystem?.getPathFlag?.(c, 'greedCount') || 0) >= (FortuneSystem?.cfg?.()?.greedCrisisThreshold ?? 3)) {
      FortuneSystem?.checkGreedCrisis?.(c);
    }

    const phase = nodeCfg?.phase ? `第${nodeCfg.phase}阶段` : '';
    log(`${c.short}·${phase}「${nodeCfg?.name || nodeId}」完成${choice ? '（' + choice + '）' : ''}`, 'social');
    EventBus.emit('lifePath:storyNode', { charId: c.id, nodeId, choice, phase: nodeCfg?.phase });
    if (nodeCfg?.bubble) {
      try { NarrativeBubbleSystem?.showBubble?.({ charId: c.id, text: nodeCfg.bubble, style: 'thought', module: 'storyNode' }); } catch (_) {}
    }
    tryPromote(c);
    tryIssueStoryQuests(c);
    uiDirty = true;

    // auto-trigger chained nodes
    const autoNodes = Object.entries(cfg().storyNodes || {})
      .filter(([id, n]) => n.autoTrigger && n.triggerAfterNode === nodeId && n.pathId === c.lifePath);
    for (const [autoId, n] of autoNodes) {
      if (n.minPathFlag) {
        let ok = true;
        for (const [k, min] of Object.entries(n.minPathFlag)) {
          if ((MoneySystem?.getPathFlag?.(c, k) || 0) < min) { ok = false; break; }
        }
        if (!ok) continue;
      }
      if (!isNodeDone(c, autoId)) {
        setTimeout(() => recordStoryNode(c, autoId, 'auto'), 2000);
      }
    }
  }

  function getStoryProgress(c) {
    if (!c) return [];
    const nodes = cfg().storyNodes || {};
    return Object.entries(nodes)
      .filter(([, n]) => !n.pathId || n.pathId === c.lifePath)
      .map(([id, n]) => ({
        id, name: n.name, phase: n.phase || 0, order: n.order || 0,
        desc: n.desc || '', done: isNodeDone(c, id),
        choice: c.storyNodes?.[id]?.choice,
        day: c.storyNodes?.[id]?.day,
      }))
      .sort((a, b) => (a.phase - b.phase) || (a.order - b.order));
  }

  function onQuestComplete(templateId, assigneeId) {
    const c = getChar(assigneeId);
    if (!c) return;
    const nodes = cfg().storyNodes || {};
    for (const [nodeId, n] of Object.entries(nodes)) {
      if (n.questId !== templateId) continue;
      if (n.pathId && n.pathId !== c.lifePath) continue;
      if (n.streakDays) {
        if (!c.storyStreaks) c.storyStreaks = {};
        const sk = c.storyStreaks[nodeId] || { count: 0, lastDay: -99 };
        const today = typeof gameDay !== 'undefined' ? gameDay : 0;
        if (today === sk.lastDay) continue;
        sk.count = (today === sk.lastDay + 1) ? sk.count + 1 : 1;
        sk.lastDay = today;
        c.storyStreaks[nodeId] = sk;
        if (!isNodeDone(c, nodeId) && sk.count >= n.streakDays) {
          recordStoryNode(c, nodeId, 'streak');
        }
      } else {
        if (!isNodeDone(c, nodeId)) recordStoryNode(c, nodeId);
      }
    }
  }

  function autoStartChars() {
    const autoMap = cfg().autoStartChars || {};
    for (const [charId, pathId] of Object.entries(autoMap)) {
      const c = getChar(charId);
      if (!c || c.lifePath) continue;
      const res = startPath(c, pathId);
      if (res.ok) {
        log(`${c.short}默认起于「${getPath(pathId)?.name}」路径。`, 'social');
        tryIssueStoryQuests(c);
      }
    }
  }

  /* ────────────────────────────────────────────────────────────────────── */

  function getRelationBonuses(c) {
    const tier = getCharTier(c);
    return {
      affectionBonus: tier.socialBonus || 0,
      submissionBonus: tier.submissionBonus || 0,
      tierTitle: tier.title,
    };
  }

  function onGameDay() {
    const decay = st().idleDecayPerDay ?? 0;
    if (!decay) return;
    for (const c of CHARS || []) {
      if (!c.lifePath) continue;
      changeReputation(c, -decay, '久无建树');
    }
  }

  function serialize() {
    return CHARS?.map(c => ({
      id: c.id,
      lifePath: c.lifePath ?? null,
      currentStage: c.currentStage ?? null,
      reputation: c.reputation ?? 0,
      professionHistory: (c.professionHistory || []).slice(),
      _baseSocialRank: c._baseSocialRank,
      storyNodes: Object.assign({}, c.storyNodes || {}),
      storyStreaks: Object.assign({}, c.storyStreaks || {}),
      ...(MoneySystem?.serializeChar?.(c) || {}),
    })) || [];
  }

  function apply(snap) {
    if (!snap?.length) return;
    for (const row of snap) {
      const c = CHARS?.find(x => x.id === row.id);
      if (!c) continue;
      c.lifePath = row.lifePath ?? null;
      c.currentStage = row.currentStage ?? null;
      c.reputation = row.reputation ?? 0;
      c.professionHistory = row.professionHistory || [];
      c._baseSocialRank = row._baseSocialRank ?? getCharDefRank(c.id);
      c.storyNodes = Object.assign({}, row.storyNodes || {});
      c.storyStreaks = Object.assign({}, row.storyStreaks || {});
      MoneySystem?.applyChar?.(c, row);
    }
  }

  function openPathPanel() {
    const c = CHARS[selectedIdx];
    if (!c) return;
    initChar(c);
    const tier = getCharTier(c);
    const current = c.lifePath ? getPath(c.lifePath) : null;
    const stage = c.currentStage ? getStage(c.currentStage) : null;
    const next = stage?.nextStages?.[0];
    const nextChk = next ? checkStageRequirements(c, next) : null;

    let body = `<h3>${escapeHtml(c.short)} · 人生路径</h3>`;
    body += `<p style="color:#a89070;font-size:11px;margin-bottom:10px">声望 <b style="color:#d4a574">${c.reputation}</b> · ${escapeHtml(tier.title)}</p>`;

    if (current && stage) {
      body += `<div style="padding:8px;margin-bottom:10px;background:#1a1210;border:1px solid #5c4033;border-radius:6px">
        <div style="color:#f5e6c8">当前：${escapeHtml(current.name)} · ${escapeHtml(stage.title)}</div>
        <div style="color:#8a7355;font-size:10px;margin-top:4px">有效身份等级 ${getEffectiveSocialRank(c)}（原${c._baseSocialRank}）</div>`;
      if (next) {
        const ns = getStage(next);
        body += `<div style="color:#8a7355;font-size:10px;margin-top:4px">下一阶：${escapeHtml(ns?.title || next)}${nextChk?.ok ? '' : `（${escapeHtml(nextChk?.reason || '')}）`}</div>`;
      }
      body += `<button class="sys-btn" id="lp-quit" style="margin-top:8px">退出路径</button></div>`;
    } else {
      body += `<p style="color:#8a7355;font-size:11px;margin-bottom:8px">尚未择定人生路径。</p>`;
    }

    const paths = Object.values(cfg().paths || {});
    body += `<div style="font-size:11px;color:#d4a574;margin-bottom:6px">可择路径</div>`;
    body += paths.map(p => {
      const chk = canStartPath(c, p.id);
      const disabled = !chk.ok && c.lifePath !== p.id;
      return `<button class="sys-btn lp-pick${disabled ? ' disabled' : ''}" data-pid="${p.id}"
        style="display:block;width:100%;text-align:left;margin-bottom:6px;${disabled ? 'opacity:.45' : ''}"
        ${disabled ? 'disabled' : ''} title="${escapeHtml(chk.reason || p.description || '')}">
        ${escapeHtml(p.name)}<span style="color:#8a7355;font-size:10px"> — ${escapeHtml(p.description || '')}</span>
      </button>`;
    }).join('');

    const progress = getStoryProgress(c);
    if (progress.length) {
      const phases = [...new Set(progress.map(n => n.phase))].sort((a, b) => a - b);
      const phaseNamesByPath = {
        xiren_concubine: { 1: '第一阶段·根基铺垫', 2: '第二阶段·情愫渐生', 3: '第三阶段·危机考验', 4: '第四阶段·正名确立' },
        xifeng_steward: { 1: '第一阶段·站稳脚跟', 2: '第二阶段·执掌大权', 3: '第三阶段·弄权经营', 4: '第四阶段·盛极而衰' },
      };
      const phaseNames = phaseNamesByPath[c.lifePath] || { 1: '第一阶段', 2: '第二阶段', 3: '第三阶段', 4: '第四阶段' };
      body += `<div style="font-size:11px;color:#d4a574;margin:8px 0 4px">故事节点进度</div>`;
      for (const ph of phases) {
        const pnodes = progress.filter(n => n.phase === ph);
        const done = pnodes.filter(n => n.done).length;
        body += `<div style="margin-bottom:6px;padding:6px 8px;background:#12100e;border-radius:4px;border:1px solid #3a2a1a">
          <div style="color:#a89070;font-size:10px;margin-bottom:4px">${escapeHtml(phaseNames[ph] || `阶段${ph}`)}（${done}/${pnodes.length}）</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px">`;
        for (const n of pnodes) {
          const color = n.done ? '#7ab87a' : '#5a4a3a';
          const title = n.done ? `已完成（第${n.day ?? '?'}日${n.choice ? '·' + n.choice : ''}）` : n.desc || '待触发';
          body += `<span style="color:${color};font-size:10px;padding:1px 5px;border:1px solid ${color};border-radius:3px" title="${escapeHtml(title)}">${n.done ? '✓' : '○'} ${escapeHtml(n.name)}</span>`;
        }
        body += `</div></div>`;
      }
    }

    body += `<button class="sys-btn" id="lp-close" style="margin-top:12px">关闭</button>`;
    openPanel(body);

    document.getElementById('lp-close')?.addEventListener('click', () => {
      document.getElementById('panel-overlay')?.classList.remove('open');
    });
    document.getElementById('lp-quit')?.addEventListener('click', () => {
      quitPath(c);
      document.getElementById('panel-overlay')?.classList.remove('open');
      buildUI();
    });
    document.querySelectorAll('.lp-pick:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = startPath(c, btn.dataset.pid);
        if (!r.ok) log(r.reason || '无法开启路径');
        document.getElementById('panel-overlay')?.classList.remove('open');
        buildUI();
      });
    });
  }

  /* ─── Story Quest Issuing ────────────────────────────────────────────── */

  function isQuestActive(charId, questId) {
    return (QuestSystem?.getActiveForChar?.(charId) || QuestSystem?.getAcceptedFor?.(charId) || [])
      .some(q => q.templateId === questId);
  }

  function canIssueStoryQuest(c, nodeId, n) {
    if (!n.questId) return false;
    if (isNodeDone(c, nodeId)) return false;
    if (isQuestActive(c.id, n.questId)) return false;
    if (n.prevNode && !isNodeDone(c, n.prevNode)) return false;
    if (n.minReputation != null && getReputation(c) < n.minReputation) return false;
    if (n.minSkill) {
      for (const [sk, lv] of Object.entries(n.minSkill)) {
        if ((c.skillLevels?.[sk] ?? 0) < lv) return false;
      }
    }
    if (n.minPathFlag) {
      for (const [k, min] of Object.entries(n.minPathFlag)) {
        if ((MoneySystem?.getPathFlag?.(c, k) || 0) < min) return false;
      }
    }
    if (n.maxPathFlag) {
      for (const [k, max] of Object.entries(n.maxPathFlag)) {
        if ((MoneySystem?.getPathFlag?.(c, k) || 0) > max) return false;
      }
    }
    return true;
  }

  function tryIssueStoryQuests(c) {
    if (!c?.lifePath) return;
    const nodes = cfg().storyNodes || {};
    for (const [nodeId, n] of Object.entries(nodes)) {
      if (n.pathId !== c.lifePath) continue;
      if (!canIssueStoryQuest(c, nodeId, n)) continue;
      const inst = QuestSystem?.issueOne?.(n.questId, null, c.id);
      if (inst) log(`[故事] ${c.short}·「${n.name}」任务已下发`, 'social');
    }
  }

  function tryIssueStoryQuestsAll() {
    for (const c of CHARS || []) {
      if (c.lifePath) tryIssueStoryQuests(c);
    }
  }

  /* ────────────────────────────────────────────────────────────────────── */

  function onInteractionCompleted(evt) {
    const { initiatorId, targetId, interactionId } = evt || {};
    if (!initiatorId || !interactionId) return;
    const tpl = getInteractionTemplate ? getInteractionTemplate(interactionId) : null;
    const catMap = CONFIG.identityProtocolConfig?.interactionCatMap || {};
    const category = tpl?.category || catMap[interactionId] || null;

    const nodes = cfg().storyNodes || {};
    for (const [nodeId, n] of Object.entries(nodes)) {
      if (!n.interactionCat && !n.interactionTemplateId) continue;
      const catMatch = n.interactionCat && category === n.interactionCat;
      const tplMatch = n.interactionTemplateId && interactionId === n.interactionTemplateId;
      if (!catMatch && !tplMatch) continue;
      const targetOk = !n.targetId || targetId === n.targetId || initiatorId === n.targetId;
      if (!targetOk) continue;
      // derive which char "owns" this node (not the target, but the participant on the path)
      const charId = n.targetId
        ? (targetId === n.targetId ? initiatorId : targetId)
        : initiatorId;
      const c = getChar(charId);
      if (!c) continue;
      if (n.pathId && c.lifePath !== n.pathId) continue;
      if (!isNodeDone(c, nodeId)) recordStoryNode(c, nodeId);
    }
  }

  function init() {
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    unsubs.push(EventBus.on('time:period', evt => {
      if (evt?.period === 'dawn' || evt?.hour === 0) onGameDay();
    }));
    unsubs.push(EventBus.on('interaction:complete', onInteractionCompleted));
    unsubs.push(EventBus.on('lifePath:storyNode', evt => {
      const c = getChar(evt?.charId);
      if (c) tryIssueStoryQuests(c);
    }));
    unsubs.push(EventBus.on('lifePath:promoted', evt => {
      const c = getChar(evt?.charId);
      if (c) tryIssueStoryQuests(c);
    }));
    unsubs.push(EventBus.on('lifePath:started', evt => {
      const c = getChar(evt?.charId);
      if (c) tryIssueStoryQuests(c);
    }));
    // Check every in-game hour for condition-gated quests (e.g., minReputation threshold)
    unsubs.push(EventBus.on('time:hour', () => tryIssueStoryQuestsAll()));
    initAllChars();
    autoStartChars();
  }

  return {
    cfg, st, init, initChar, initAllChars,
    getPath, getStage, getReputation, getReputationTier, getCharTier,
    changeReputation, applyReputationDelta,
    getEffectiveSocialRank, getDisplayTitle, getStageTitle,
    canStartPath, getAvailablePaths, startPath, quitPath,
    checkStageRequirements, promoteToStage, tryPromote,
    getUnlockedScenePermissions, hasScenePermission,
    getDailyTaskIds, getSpecialActionIds, questMatchesPath,
    getRelationBonuses,
    isNodeDone, recordStoryNode, getStoryProgress, onQuestComplete,
    tryIssueStoryQuests, tryIssueStoryQuestsAll,
    serialize, apply, openPathPanel,
  };
})();
window.LifePathSystem = LifePathSystem;
