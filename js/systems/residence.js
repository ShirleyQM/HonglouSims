const ResidenceSystem = (() => {
  const KIND_ONSCENE = 'onscene';
  const KIND_OFFMAP = 'offmap';
  const KIND_NONRESIDENTIAL = 'nonresidential';

  function familyOfChar(charId) {
    return FamilySystem?.findFamilyOfChar?.(charId) || null;
  }

  function kindOf(family) {
    if (!family) return KIND_OFFMAP;
    if (family.residenceKind) return family.residenceKind;
    return family.residenceSceneId ? KIND_ONSCENE : KIND_OFFMAP;
  }

  function residenceOfFamily(familyOrId) {
    const family = typeof familyOrId === 'object'
      ? familyOrId
      : FamilySystem?.getFamily?.(familyOrId);
    if (!family) {
      return { kind: KIND_OFFMAP, sceneId: null, label: '地图外居所', canNavigate: false, canSleepHere: false };
    }
    const kind = kindOf(family);
    const sceneId = kind === KIND_ONSCENE ? (family.residenceSceneId || null) : null;
    const scene = sceneId ? getScene?.(sceneId) : null;
    return {
      familyId: family.id,
      kind,
      sceneId: scene?.id || null,
      label: family.residenceLabel || scene?.name || family.name || '地图外居所',
      canNavigate: !!scene && kind === KIND_ONSCENE,
      canSleepHere: !!scene && kind === KIND_ONSCENE && family.residenceRole !== 'workplace',
      rawSceneId: family.residenceSceneId || null,
    };
  }

  function residenceOfChar(charId) {
    return residenceOfFamily(familyOfChar(charId));
  }

  function getHomeSceneId(charOrId, fallbackSceneId = null) {
    const charId = typeof charOrId === 'string' ? charOrId : charOrId?.id;
    const res = residenceOfChar(charId);
    return res.sceneId || fallbackSceneId || (typeof charOrId === 'object' ? charOrId.sceneId : null) || 3;
  }

  function hasOnMapHome(charOrId) {
    const charId = typeof charOrId === 'string' ? charOrId : charOrId?.id;
    return !!residenceOfChar(charId).sceneId;
  }

  function resolveSceneTarget(target, inst) {
    if (target === 'assignee_residence') {
      const res = residenceOfChar(inst?.assigneeId);
      return res.sceneId || getChar?.(inst?.assigneeId)?.sceneId || null;
    }
    if (target === 'issuer_residence') {
      const res = residenceOfChar(inst?.issuerId);
      return res.sceneId || getChar?.(inst?.issuerId)?.sceneId || null;
    }
    return null;
  }

  function describeCharHome(charId) {
    const res = residenceOfChar(charId);
    if (res.kind === KIND_OFFMAP) return `${res.label}（地图外）`;
    if (res.kind === KIND_NONRESIDENTIAL) return `${res.label}（非居住场所）`;
    return res.label;
  }

  return {
    KIND_ONSCENE,
    KIND_OFFMAP,
    KIND_NONRESIDENTIAL,
    residenceOfFamily,
    residenceOfChar,
    getHomeSceneId,
    hasOnMapHome,
    resolveSceneTarget,
    describeCharHome,
  };
})();
