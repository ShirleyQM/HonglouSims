/* ═══════════════════ QUEST ISSUE (身份分层任务下发) ═══════════════════
 * 点名传令 + 群体传令。配置：issuePermissions、targetScope、groupFilter
 */
const QuestIssueSystem = (() => {
  const BLOCKED_RELS = new Set([
    'outsider', 'servant_to_master', 'child_to_parent', 'junior_to_senior_servant',
  ]);

  let groupCooldowns = {};

  function qc() {
    return CONFIG.questConfig || DEFAULT_CONFIG.questConfig || {};
  }

  function issuePerms() {
    return qc().issuePermissions || DEFAULT_CONFIG.questConfig?.issuePermissions || [];
  }

  function getIssuerPermission(issuerId) {
    const rank = IdentityProtocolSystem.getCharRank(issuerId);
    return issuePerms().find(p => p.issuerRank === rank) || null;
  }

  function getHierarchyRel(issuerId, targetId) {
    return IdentityProtocolSystem.getHierarchyRelation(issuerId, targetId);
  }

  function isGroupTemplate(tpl) {
    return tpl?.targetScope === 'group';
  }

  function issuerMayIssueGroup(issuerId) {
    const perm = getIssuerPermission(issuerId);
    return !!(perm?.allowGroupQuests && perm.allowedCategories?.length);
  }

  function issuerMayIssueTo(issuerId, targetId) {
    if (issuerId === targetId) return { ok: false, reason: '不能传令给自己' };
    const perm = getIssuerPermission(issuerId);
    if (!perm?.targetRelations?.length) {
      return { ok: false, reason: '你的身份无法传令他人' };
    }
    const rel = getHierarchyRel(issuerId, targetId);
    if (BLOCKED_RELS.has(rel)) return { ok: false, reason: '礼法不合' };
    if (!perm.targetRelations.includes(rel)) {
      return { ok: false, reason: '你的身份无法传令此人' };
    }
    if (rel === 'master_to_servant' && typeof ServantRelationSystem !== 'undefined') {
      const gate = ServantRelationSystem.checkQuestAuthority(issuerId, targetId, null);
      if (!gate.ok) return { ok: false, reason: gate.reason };
    }
    return { ok: true, rel, perm };
  }

  function issuerMayUseCategory(issuerId, targetId, tpl) {
    const perm = getIssuerPermission(issuerId);
    if (!perm?.allowedCategories?.includes(tpl.category)) return false;
    if (tpl.isSpecial && tpl.specialQuestKey) {
      if (!perm.specialQuests?.includes(tpl.specialQuestKey)) return false;
    }
    if (targetId != null) {
      const gate = issuerMayIssueTo(issuerId, targetId);
      if (!gate.ok) return false;
      if (typeof ServantRelationSystem !== 'undefined') {
        const servantGate = ServantRelationSystem.checkQuestAuthority(issuerId, targetId, tpl);
        if (!servantGate.ok) return false;
      }
    }
    return true;
  }

  function templateMatchesHierarchy(tpl, issuerId, assigneeId) {
    const rels = tpl.singleTargetRelations?.length
      ? tpl.singleTargetRelations
      : tpl.issuerRelationRequired;
    if (!rels?.length) return true;
    const rel = getHierarchyRel(issuerId, assigneeId);
    if (!rels.includes(rel)) return false;
    const range = tpl.targetRankRange || normalizeRankRange(tpl.groupFilter?.rankRange);
    if (range) {
      const rank = IdentityProtocolSystem.getCharRank(assigneeId);
      if (range.min != null && rank < range.min) return false;
      if (range.max != null && rank > range.max) return false;
    }
    return true;
  }

  function normalizeRankRange(rr) {
    if (!rr) return null;
    if (Array.isArray(rr)) return { min: rr[0], max: rr[1] };
    return rr;
  }

  function getCharGender(charId) {
    const def = CONFIG.characters?.find(c => c.id === charId);
    if (def?.gender) return def.gender;
    if (def?.trait === 'male') return '男';
    return '女';
  }

  function genderMatches(filterGender, charId) {
    if (!filterGender || filterGender === 'any') return true;
    const g = getCharGender(charId);
    if (filterGender === 'female') return g === '女';
    if (filterGender === 'male') return g === '男';
    return true;
  }

  function matchesGroupFilter(char, issuer, tpl) {
    const gf = tpl.groupFilter;
    if (!gf) return false;
    const rank = IdentityProtocolSystem.getCharRank(char.id);
    const rr = normalizeRankRange(gf.rankRange);
    if (rr) {
      if (rr.min != null && rank < rr.min) return false;
      if (rr.max != null && rank > rr.max) return false;
    }
    if ((gf.excludeRanks || []).includes(rank)) return false;
    if (!genderMatches(gf.gender, char.id)) return false;
    if (gf.familyId && gf.familyId !== 0) {
      const fam = FamilySystem.findFamilyOfChar(char.id);
      if (!fam || fam.id !== gf.familyId) return false;
    }
    if (gf.sceneId && gf.sceneId !== 0) {
      const wantScene = gf.sceneId === 'issuer' ? issuer.sceneId : gf.sceneId;
      if (char.sceneId !== wantScene) return false;
    }
    return true;
  }

  function targetRelationAllowed(issuerId, targetId, tpl) {
    const rels = tpl.singleTargetRelations || tpl.issuerRelationRequired || [];
    if (!rels.length) return issuerMayIssueTo(issuerId, targetId).ok;
    const rel = getHierarchyRel(issuerId, targetId);
    if (BLOCKED_RELS.has(rel)) return false;
    return rels.includes(rel);
  }

  function resolveGroupTargets(issuer, tpl) {
    if (!issuer || !tpl) return [];
    const out = [];
    for (const ch of CHARS) {
      if (ch.id === issuer.id) continue;
      if (!matchesGroupFilter(ch, issuer, tpl)) continue;
      if (!targetRelationAllowed(issuer.id, ch.id, tpl)) continue;
      if (!templateMatchesHierarchy(tpl, issuer.id, ch.id)) continue;
      if (QuestSystem?.canIssue && !QuestSystem.canIssue(tpl.id, issuer.id, ch.id)) continue;
      if (tpl.issuerRelationMin != null && typeof getRelationValue === 'function') {
        if (getRelationValue(issuer.id, ch.id) < tpl.issuerRelationMin) continue;
      }
      out.push(ch);
    }
    const max = tpl.groupFilter?.maxTargets;
    if (max > 0 && out.length > max) return out.slice(0, max);
    return out;
  }

  function formatDeadlineHint(tpl) {
    if (!tpl || tpl.deadlineMode === 'NO_DEADLINE') return '';
    const p = tpl.deadlineParam ?? 0;
    if (tpl.deadlineMode === 'GAME_DAYS') return `${p}日内`;
    if (tpl.deadlineMode === 'GAME_HOURS') return `${p}时辰内`;
    if (tpl.deadlineMode === 'BY_TIME_OF_DAY') return '辰时前';
    return '';
  }

  function formatTargetPreview(targets, maxNames = 4) {
    if (!targets.length) return '无符合条件者';
    const names = targets.map(c => c.short);
    if (names.length <= maxNames) return names.join('、');
    return `${names.slice(0, maxNames).join('、')}… (${targets.length}人)`;
  }

  function checkQuestIssueable(issuer, target, tpl) {
    if (!issuer || !target || !tpl) return { ok: false, reason: '无效对象' };
    if (tpl.questType !== 'directive') return { ok: false, reason: '非指令任务' };
    if (isGroupTemplate(tpl)) return { ok: false, reason: '请用传令面板' };
    const gate = issuerMayIssueTo(issuer.id, target.id);
    if (!gate.ok) return gate;
    if (!issuerMayUseCategory(issuer.id, target.id, tpl)) {
      const servantGate = typeof ServantRelationSystem !== 'undefined'
        ? ServantRelationSystem.checkQuestAuthority(issuer.id, target.id, tpl)
        : null;
      return { ok: false, reason: servantGate && !servantGate.ok ? servantGate.reason : '此类传令不在权限内' };
    }
    if (!templateMatchesHierarchy(tpl, issuer.id, target.id)) {
      return { ok: false, reason: '此任务不合双方身份' };
    }
    if (QuestSystem?.canIssue && !QuestSystem.canIssue(tpl.id, issuer.id, target.id)) {
      return { ok: false, reason: '冷却中或已有同类传令' };
    }
    if (tpl.issuerRelationMin != null && typeof getRelationValue === 'function') {
      const score = getRelationValue(issuer.id, target.id);
      if (score < tpl.issuerRelationMin) {
        return { ok: false, reason: `情分不足（需≥${tpl.issuerRelationMin}）` };
      }
    }
    const servantHint = typeof ServantRelationSystem !== 'undefined'
      ? ServantRelationSystem.describeFor(issuer.id, target.id, tpl)
      : '';
    return { ok: true, reason: servantHint || formatDeadlineHint(tpl) || '可下发' };
  }

  function checkGroupQuestIssueable(issuer, tpl) {
    if (!issuer || !tpl) return { ok: false, reason: '无效' };
    if (!isGroupTemplate(tpl)) return { ok: false, reason: '非群体任务' };
    if (!qc().masterEnabled) return { ok: false, reason: '任务系统未启用' };
    if (!issuerMayIssueGroup(issuer.id)) {
      return { ok: false, reason: '你的身份不可群体传令' };
    }
    if (!issuerMayUseCategory(issuer.id, null, tpl)) {
      return { ok: false, reason: '此类传令不在权限内' };
    }
    if (isGroupOnCooldown(issuer.id, tpl.id)) {
      return { ok: false, reason: '此类传令尚在冷却' };
    }
    const targets = resolveGroupTargets(issuer, tpl);
    if (!targets.length) return { ok: false, reason: '暂无符合条件者' };
    return { ok: true, reason: formatTargetPreview(targets), targets };
  }

  function getDirectiveTemplates() {
    return Object.values(qc().templates || {}).filter(t => t.questType === 'directive');
  }

  function getAvailableQuests(issuer, target) {
    const groups = new Map();
    for (const tpl of getDirectiveTemplates()) {
      if (isGroupTemplate(tpl)) continue;
      const chk = checkQuestIssueable(issuer, target, tpl);
      if (!chk.ok) continue;
      const cat = tpl.category || '其他';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push({ tpl, ok: true, reason: chk.reason });
    }
    const order = qc().categories || [];
    return [...groups.entries()]
      .sort((a, b) => {
        const ia = order.indexOf(a[0]);
        const ib = order.indexOf(b[0]);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      })
      .map(([cat, items]) => ({ cat: { id: cat, name: cat }, items }));
  }

  function getAvailableGroupQuests(issuer) {
    const out = [];
    for (const tpl of getDirectiveTemplates()) {
      if (!isGroupTemplate(tpl)) continue;
      const chk = checkGroupQuestIssueable(issuer, tpl);
      if (!chk.ok) continue;
      out.push({
        tpl,
        preview: chk.reason,
        targets: chk.targets,
        count: chk.targets?.length || 0,
        deadline: formatDeadlineHint(tpl),
      });
    }
    return out;
  }

  function canIssueAny(issuer, target) {
    if (!qc().masterEnabled) return false;
    return getAvailableQuests(issuer, target).some(g => g.items.length > 0);
  }

  function canIssueGroupAny(issuer) {
    if (!qc().masterEnabled) return false;
    return issuerMayIssueGroup(issuer?.id) && getAvailableGroupQuests(issuer).length > 0;
  }

  function groupCooldownKey(issuerId, templateId) {
    return `grp|${issuerId}|${templateId}`;
  }

  function isGroupOnCooldown(issuerId, templateId) {
    return getGameTimestamp() < (groupCooldowns[groupCooldownKey(issuerId, templateId)] || 0);
  }

  function setGroupCooldown(issuerId, templateId, tpl) {
    const mins = tpl?.groupRepeatCooldownGameMin ?? qc().groupQuestCooldownGameMin ?? 1440;
    groupCooldowns[groupCooldownKey(issuerId, templateId)] = getGameTimestamp() + mins;
  }

  function issueTo(issuer, target, templateId) {
    const tpl = qc().templates?.[templateId];
    const chk = checkQuestIssueable(issuer, target, tpl);
    if (!chk.ok) {
      log(`⚠ ${chk.reason}`);
      return null;
    }
    const inst = QuestSystem?.issueOne?.(templateId, issuer.id, target.id);
    if (inst) {
      log(`${issuer.short}传令${target.short}：「${tpl.name}」`);
      if (NarrativeBubbleSystem?.showBubble) {
        const away = issuer.sceneId !== target.sceneId;
        const line = tpl.id === 1021 || away ? '这就来。' : '这就去办。';
        NarrativeBubbleSystem.showBubble({
          charId: target.id,
          text: line,
          style: 'speech',
          module: 'quest',
          duration: 3,
        });
      }
      uiDirty = true;
    }
    return inst;
  }

  function issueGroupTo(issuer, templateId, silent) {
    const tpl = qc().templates?.[templateId];
    const chk = checkGroupQuestIssueable(issuer, tpl);
    if (!chk.ok) {
      if (!silent) log(`⚠ ${chk.reason}`);
      return null;
    }
    const ids = chk.targets.map(c => c.id);
    const batch = QuestSystem?.issueBatch?.(templateId, issuer.id, ids);
    if (batch?.count > 0) {
      setGroupCooldown(issuer.id, templateId, tpl);
      const names = formatTargetPreview(chk.targets);
      log(`${issuer.short}传令「${tpl.name}」→ ${names}（${batch.count}人）`);
      if (NarrativeBubbleSystem?.showBubble) {
        NarrativeBubbleSystem.showBubble({
          charId: issuer.id,
          text: tpl.texts?.issue?.replace(/\{issuer\}/g, issuer.short).replace(/\{assignee\}/g, '众人') || `传令：${tpl.name}`,
          style: 'speech', module: 'quest', duration: 4,
        });
      }
      uiDirty = true;
    } else if (!silent) {
      log('传令未能下发（目标忙或冷却中）');
    }
    return batch;
  }

  function filterAiCandidates(issuerId, assigneeId, templates) {
    const issuer = getChar(issuerId);
    const assignee = getChar(assigneeId);
    if (!issuer || !assignee) return [];
    return templates.filter(t =>
      !isGroupTemplate(t)
      && checkQuestIssueable(issuer, assignee, t).ok
      && QuestSystem?.isTemplateExecutableBy?.(t, issuer.id, assignee.id, { aiIssue: true }));
  }

  function filterAiGroupCandidates(issuer) {
    return getAvailableGroupQuests(issuer);
  }

  function serialize() {
    return { groupCooldowns };
  }

  function apply(state) {
    groupCooldowns = state?.groupCooldowns || {};
  }

  return {
    issuerMayIssueTo, issuerMayIssueGroup, issuerMayUseCategory,
    templateMatchesHierarchy, checkQuestIssueable, checkGroupQuestIssueable,
    getAvailableQuests, getAvailableGroupQuests, resolveGroupTargets,
    canIssueAny, canIssueGroupAny, isGroupTemplate, isGroupOnCooldown,
    issueTo, issueGroupTo, filterAiCandidates, filterAiGroupCandidates,
    formatDeadlineHint, formatTargetPreview, serialize, apply,
  };
})();
window.QuestIssueSystem = QuestIssueSystem;
