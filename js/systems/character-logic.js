/* ═══════════════════ CHARACTER LOGIC SUMMARY ═══════════════════
 *
 * 人物相关系统的统一读入口。它不拥有玩法规则，只把人物基础配置、
 * 运行时状态、身份、特质、路径、权限、技能封锁等信息合成可解释档案。
 */
const CharacterLogicSystem = (() => {
  function charDef(charId) {
    return CONFIG.characters?.find(c => c.id === charId) || null;
  }

  function runtimeChar(charId) {
    return (typeof CHARS !== 'undefined' ? CHARS : []).find(c => c.id === charId) || null;
  }

  function familyProfile(charId) {
    const fam = FamilySystem?.findFamilyOfChar?.(charId) || null;
    const role = fam ? FamilySystem.getCharRole(charId, fam.id) : '';
    return {
      familyId: fam?.id || 0,
      familyName: fam?.name || '',
      familyTag: fam?.tag || '',
      role: role || '',
    };
  }

  function identityProfile(charId) {
    const rank = IdentityProtocolSystem?.getCharRank?.(charId) ?? charDef(charId)?.socialRank ?? 2;
    return {
      rank,
      rankLabel: IdentityProtocolSystem?.rankLabel?.(rank) || `等级${rank}`,
    };
  }

  function traitProfile(c) {
    if (!c) return { ids: [], labels: [], specialtyProfile: null, specialties: [] };
    const specialtyProfile = CharSpecialtySystem?.profile?.(c.id) || null;
    const ids = typeof getCharTraits === 'function' ? getCharTraits(c) : (specialtyProfile?.aiTraits || []);
    const labels = CharSpecialtySystem?.getDisplayTraits?.(c)
      || ids.map(id => CONFIG.charSpecialtyConfig?.traitLabels?.[id] || id);
    return {
      ids,
      labels,
      specialtyProfile,
      specialties: specialtyProfile?.specialties || [],
    };
  }

  function stateProfile(c) {
    if (!c) return [];
    return (c.activeStates || []).map(st => {
      const sd = CONFIG.stateDefs?.[st.id] || {};
      return {
        id: st.id,
        name: sd.name || st.id,
        desc: sd.desc || '',
        remaining: st.remaining,
        permanent: st.remaining === -1,
        blockedSkills: sd.blockedSkills || [],
        needMods: sd.needMods || {},
      };
    });
  }

  function skillProfile(c) {
    if (!c) return [];
    const states = stateProfile(c);
    const blockedBySkill = {};
    for (const st of states) {
      for (const skill of st.blockedSkills || []) {
        (blockedBySkill[skill] ||= []).push(st.name);
      }
    }
    return (c.skills || []).map(skillId => ({
      id: skillId,
      name: CONFIG.skillDefs?.[skillId]?.name || skillId,
      level: typeof getSkillLevel === 'function' ? getSkillLevel(c, skillId) : 1,
      usable: typeof canUseSkill === 'function' ? canUseSkill(c, skillId) : true,
      blockedBy: blockedBySkill[skillId] || [],
    }));
  }

  function needProfile(c) {
    if (!c) return [];
    const coeffs = typeof calcNeedCoeffs === 'function' ? calcNeedCoeffs(c) : {};
    return getNeedDefs().map(nd => ({
      key: nd.key,
      label: nd.label,
      value: Math.round(c.needs?.[nd.key] ?? 0),
      coeffs: coeffs[nd.key] || {},
    }));
  }

  function pathProfile(c) {
    const rep = ReputationDomainSystem?.explain?.(c?.id);
    if (!c?.lifePath) return {
      pathId: '', pathName: '', stageId: '', stageTitle: '', reputation: c?.reputation ?? 0,
      reputationDomains: rep?.domains || [],
      careerDomains: rep?.careerDomains || [],
    };
    const path = LifePathSystem?.getPath?.(c.lifePath);
    return {
      pathId: c.lifePath,
      pathName: path?.name || c.lifePath,
      stageId: c.currentStage || '',
      stageTitle: LifePathSystem?.getStageTitle?.(c) || c.currentStage || '',
      reputation: c.reputation ?? 0,
      reputationDomains: rep?.domains || [],
      careerDomains: rep?.careerDomains || [],
    };
  }

  function sceneProfile(c) {
    if (!c) return { currentScene: null, accessibleScenes: [] };
    const currentScene = typeof getScene === 'function' ? getScene(c.sceneId) : null;
    const accessibleIds = SceneAccessSystem?.getAccessibleSceneIds?.(c) || [];
    return {
      currentScene: currentScene ? {
        id: currentScene.id,
        name: currentScene.name,
        sceneType: currentScene.sceneType || '',
      } : null,
      accessibleScenes: accessibleIds.map(id => {
        const sc = getScene(id);
        return sc ? { id: sc.id, name: sc.name, sceneType: sc.sceneType || '' } : null;
      }).filter(Boolean),
    };
  }

  function diagnostics(c) {
    if (!c) return [];
    const out = [];
    const def = charDef(c.id);
    const family = familyProfile(c.id);
    const traits = traitProfile(c);
    const states = stateProfile(c);
    const blocked = [...new Set(states.flatMap(st => st.blockedSkills || []))];
    if (blocked.length) out.push(`状态封锁技能：${blocked.join('、')}`);
    const lowNeeds = needProfile(c).filter(n => n.value < 25).map(n => `${n.label}${n.value}`);
    if (lowNeeds.length) out.push(`低需求预警：${lowNeeds.join('、')}`);
    if (c.ai?.state) out.push(`AI状态：${c.ai.state}`);
    if (c.actionQueue?.length) out.push(`行动队列：${c.actionQueue.length}项`);
    if (c._interactionLock) out.push(`互动锁定：${c._interactionLock.label || c._interactionLock.poseId}`);
    if (!family.familyId) out.push('配置提醒：人物未加入任何家庭');
    if (!getScene(c.sceneId)) out.push(`配置错误：场景 ${c.sceneId} 不存在`);
    const unknownSkills = (def?.skills || []).filter(id => !CONFIG.skillDefs?.[id]);
    if (unknownSkills.length) out.push(`配置提醒：技能未定义 ${unknownSkills.join('、')}`);
    const traitLabels = CONFIG.charSpecialtyConfig?.traitLabels || {};
    const traitMods = CONFIG.charSpecialtyConfig?.traitModifiers || {};
    const unknownTraits = traits.ids.filter(id => !traitLabels[id] && !traitMods[id]
      && !(typeof TRAIT_LABELS !== 'undefined' && TRAIT_LABELS[id]));
    if (unknownTraits.length) out.push(`配置提醒：性格标签未定义 ${unknownTraits.join('、')}`);
    const checks = traits.specialtyProfile?.checks || {};
    const badStateChecks = Object.values(checks)
      .filter(v => typeof v === 'string' && v.startsWith('state:'))
      .map(v => v.slice(6))
      .filter(id => !CONFIG.stateDefs?.[id]);
    if (badStateChecks.length) out.push(`配置错误：专长引用未知状态 ${[...new Set(badStateChecks)].join('、')}`);
    const badAmbientStates = (traits.specialtyProfile?.ambient || [])
      .map(row => row.stateId)
      .filter(id => id && !CONFIG.stateDefs?.[id]);
    if (badAmbientStates.length) out.push(`配置错误：环境专长引用未知状态 ${[...new Set(badAmbientStates)].join('、')}`);
    return out;
  }

  function profile(charId) {
    const def = charDef(charId);
    const c = runtimeChar(charId) || def;
    if (!def || !c) return null;
    return {
      id: def.id,
      name: def.name,
      short: def.short,
      comment: def.shortComment || '',
      gender: def.gender || '',
      baseRank: def.socialRank ?? 2,
      homewardness: def.homewardness ?? 50,
      attributes: { ...(def.attributes || {}) },
      personality: def.personality || '',
      memoryPalace: def.memoryPalace || '',
      family: familyProfile(def.id),
      identity: identityProfile(def.id),
      traits: traitProfile(c),
      states: stateProfile(c),
      skills: skillProfile(c),
      needs: needProfile(c),
      path: pathProfile(c),
      scene: sceneProfile(c),
      diagnostics: diagnostics(c),
    };
  }

  function exportManagedConfig(charId) {
    return {
      character: charDef(charId),
      specialtyProfile: CONFIG.charSpecialtyConfig?.profiles?.[charId] || null,
    };
  }

  return {
    profile,
    exportManagedConfig,
    charDef,
    runtimeChar,
  };
})();

window.CharacterLogicSystem = CharacterLogicSystem;
