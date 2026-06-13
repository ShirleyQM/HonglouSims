/* ═══════════════════ IDENTITY PROTOCOL (身份礼法) ═══════════════════ */
const IdentityProtocolSystem = (() => {
  function cfg() {
    return CONFIG.identityProtocolConfig || DEFAULT_CONFIG.identityProtocolConfig || {};
  }

  function getCharRank(id) {
    if (LifePathSystem?.getEffectiveSocialRank) {
      return LifePathSystem.getEffectiveSocialRank(id);
    }
    return CONFIG.characters?.find(c => c.id === id)?.socialRank ?? 2;
  }

  function getHierarchyRelation(idA, idB) {
    const rankA = getCharRank(idA);
    const rankB = getCharRank(idB);
    if (rankA === 6 || rankB === 6) return 'outsider';
    if (rankA === 0) return 'grandparent_to_child';
    if (rankA <= 3 && rankB >= 4) return 'master_to_servant';
    if (rankB <= 3 && rankA >= 4) return 'servant_to_master';
    if (rankA === 4 && rankB === 5) return 'senior_servant_to_junior';
    if (rankA === 5 && rankB === 4) return 'junior_to_senior_servant';
    if (rankA === 1 && rankB >= 2) return 'parent_to_child';
    if (rankB === 1 && rankA >= 2) return 'child_to_parent';
    return 'peer';
  }

  function getInteractionCat(tpl) {
    const map = cfg().interactionCatMap || {};
    if (tpl?.id != null && map[tpl.id]) return map[tpl.id];
    const cat = CONFIG.interactionCategories?.find(c => c.id === tpl?.category);
    return cat?.name || tpl?.category || '叙旧';
  }

  function getHierarchyRule(hierarchyRel, cat) {
    return (cfg().rules || []).find(r => r.rel === hierarchyRel && r.cat === cat) || null;
  }

  function hierarchyLabel(rel) {
    return cfg().hierarchyLabels?.[rel] || rel;
  }

  function rankLabel(rank) {
    return cfg().rankLabels?.[rank] ?? `等级${rank}`;
  }

  function resolveAddress(initType, initiator, target) {
    const custom = cfg().addressByInitType?.[initType];
    if (custom?.hint) return custom.hint;
    const rankI = getCharRank(initiator.id);
    const rankT = getCharRank(target.id);
    const i = initiator.short;
    const t = target.short;
    const presets = {
      婆媳: () => (rankI < rankT
        ? `「${i}」为婆（辈分高），称对方「太太」；「${t}」为媳，称发起人「老太太」。勿混称。`
        : `「${i}」为媳，称对方「老太太」；「${t}」为婆，称发起人「太太」。勿混称。`),
      母子: () => (rankI < rankT
        ? `「${i}」为母，可称「${t}」名字；「${t}」称发起人「母亲」或「太太」。`
        : `「${i}」称对方「母亲」或「太太」；「${t}」为母，可训诫直呼名字。`),
      父女: () => (rankI < rankT
        ? `「${i}」为父，称女名字；「${t}」称「父亲」或「老爷」。`
        : `「${i}」称「父亲」或「老爷」；「${t}」为父。`),
      祖孙: () => (rankI < rankT
        ? `「${i}」为祖辈，称孙辈名字或「我的儿」；「${t}」称「老太太」「老祖宗」。`
        : `「${i}」称「老太太」「老祖宗」；「${t}」为祖辈。`),
      夫妻: () => `夫妻相称：可用「老爷」「太太」，或名字，略拘礼数。`,
      主仆: () => (rankI <= rankT
        ? `「${i}」为主子；「${t}」为仆，称发起人「太太」「姑娘」「二爷」等，恭顺守礼。`
        : `「${i}」为仆，称主子「太太」「姑娘」「二爷」；「${t}」为主子。`),
      恋人: () => `私下亲昵，可昵称，含蓄勿现代告白腔。`,
      朋友: () => `平辈朋友，直呼名字或简称。`,
      兄妹: () => `兄妹相称：妹称「哥哥」「二哥哥」；兄称妹名字。`,
      同事: () => `同僚仆婢互称名字或「姐姐」，勿越主仆尊卑。`,
      兄弟: () => `兄弟相称，平辈直呼或「大哥哥」。`,
      叔侄: () => `叔侄有礼，侄称叔「老爷」「大老爷」；叔称侄名字。`,
    };
    if (presets[initType]) return presets[initType]();
    return `二人关系为「${initType}」，相称须合礼法，勿搞错长幼尊卑。`;
  }

  function formatAddressBlock(initiator, target) {
    if (typeof getRelationInfo !== 'function') return '';
    const ri = getRelationInfo(initiator.id, target.id);
    const lines = [];
    const rankI = getCharRank(initiator.id);
    const rankT = getCharRank(target.id);
    lines.push(`发起人身份：${rankLabel(rankI)}（${initiator.short}）`);
    lines.push(`对象身份：${rankLabel(rankT)}（${target.short}）`);
    if (ri.initType) {
      lines.push(`关系名目：${ri.initType}`);
      lines.push(resolveAddress(ri.initType, initiator, target));
    } else if (!ri.configured) {
      lines.push('二人无预设关系，礼数得体、称呼勿错。');
    }
    if (ri.note) lines.push(`旧事注：${ri.note}`);
    const hrel = getHierarchyRelation(initiator.id, target.id);
    lines.push(`身份位阶：${hierarchyLabel(hrel)}`);
    return lines.join('\n');
  }

  function formatInteractionProtocol(initiator, target, tpl) {
    const cat = getInteractionCat(tpl);
    const hrel = getHierarchyRelation(initiator.id, target.id);
    const rule = getHierarchyRule(hrel, cat);
    if (!rule) return '';
    const parts = [`${hierarchyLabel(hrel)}之间「${cat}」：${rule.behavior || 'allowed'}`];
    if (rule.behavior === 'risky') parts.push('逾矩有风险，语气宜试探、留余地');
    if (rule.behavior === 'conditional' && rule.condition?.desc) {
      parts.push(rule.condition.desc);
    }
    if (rule.behavior === 'forbidden') parts.push('礼法所禁，若硬写须体现推拒');
    if (tpl?.contact_type && tpl.contact_type !== 'none') {
      const cr = evaluateContactRisk(initiator, target, tpl);
      if (cr.behavior !== 'allowed' && cr.reason) parts.push(cr.reason);
    }
    return parts.join('；');
  }

  function isRomanticOrSpousal(idA, idB) {
    if (typeof getRelationInfo !== 'function') return false;
    const ri = getRelationInfo(idA, idB);
    return ['恋人', '夫妻'].includes(ri.initType);
  }

  function isOppositeGender(a, b) {
    const gA = a.gender || '', gB = b.gender || '';
    return gA && gB && gA !== gB;
  }

  function isSameGender(a, b) {
    const gA = a.gender || '', gB = b.gender || '';
    return gA && gB && gA === gB;
  }

  /** 按 contact_type + 身份位阶判定身体接触礼法 */
  function evaluateContactRisk(initiator, target, tpl) {
    const contact = tpl?.contact_type || 'none';
    if (!contact || contact === 'none') return { behavior: 'allowed', reason: '' };

    const hrel = getHierarchyRelation(initiator.id, target.id);
    const rules = cfg().contactTypeRules?.[contact] || cfg().contactTypeRules?.default || {};
    let behavior = rules[hrel] ?? rules.default ?? 'allowed';
    const romantic = isRomanticOrSpousal(initiator.id, target.id);
    const opp = isOppositeGender(initiator, target);
    const same = isSameGender(initiator, target);

    if (contact === 'embrace') {
      if (['parent_to_child', 'grandparent_to_child', 'child_to_parent'].includes(hrel))
        return { behavior: 'allowed', reason: '长辈怜爱，不逾矩' };
      if (romantic) return { behavior: 'allowed', reason: '' };
      if (same) return { behavior: 'allowed', reason: '' };
      if (opp && !romantic) return { behavior: 'risky', reason: '异性相拥，恐引人议论' };
    }
    if (contact === 'kiss') {
      if (['parent_to_child', 'grandparent_to_child'].includes(hrel))
        return { behavior: 'allowed', reason: '长辈吻额怜爱' };
      if (romantic) return { behavior: 'conditional', reason: '恋人之间，仍宜避人耳目' };
      if (hrel === 'servant_to_master') return { behavior: 'forbidden', reason: '仆对主不可如此' };
      return { behavior: 'risky', reason: '吻面逾矩，礼法不容' };
    }
    if (contact === 'touch' && hrel === 'servant_to_master')
      return { behavior: 'risky', reason: '仆对主轻触逾矩' };
    if (contact === 'touch' && hrel === 'master_to_servant')
      return { behavior: 'allowed', reason: '' };
    if (contact === 'massage') {
      if (hrel === 'servant_to_master') return { behavior: 'allowed', reason: '服侍按摩' };
      if (hrel === 'master_to_servant') return { behavior: 'risky', reason: '主为仆按摩，自降身份' };
    }

    if (behavior === 'conditional') {
      if (romantic || same || ['parent_to_child', 'grandparent_to_child'].includes(hrel))
        behavior = 'allowed';
      else if (opp) behavior = 'risky';
    }

    const reasonMap = {
      risky: '逾矩有风险',
      forbidden: '礼法所禁',
      conditional: '视情形可能逾矩',
    };
    return { behavior, reason: reasonMap[behavior] || '' };
  }

  return {
    cfg, getCharRank, getHierarchyRelation, getInteractionCat,
    getHierarchyRule, hierarchyLabel, rankLabel,
    formatAddressBlock, formatInteractionProtocol, resolveAddress,
    evaluateContactRisk, isRomanticOrSpousal,
  };
})();
