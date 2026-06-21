const CharSpecialtySystem = (() => {
  const FEMALE_IDS = new Set(['daiyu', 'baochai', 'tanchun', 'xiren', 'qingwen', 'sheyue', 'zijuan', 'xueyan', 'yinger', 'wangfuren', 'jiamu']);

  function cfg() { return CONFIG.charSpecialtyConfig || DEFAULT_CONFIG.charSpecialtyConfig || {}; }
  function profile(charId) { return cfg().profiles?.[charId]; }
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function charsInScene(sceneId) {
    return CHARS.filter(c => c.sceneId === sceneId);
  }

  function isFemale(c) {
    if (!c) return false;
    const def = getCharDef(c.id);
    return FEMALE_IDS.has(c.id) || def?.trait === 'female' || def?.trait === 'daiyu' || def?.trait === 'qingwen';
  }

  function traitModTable() {
    return { ...TRAIT_MODS, ...(cfg().traitModifiers || {}) };
  }

  function specialtyMetaKey(charId, specId) {
    const meta = cfg().specialtyMetadata || {};
    const ownerKey = `${charId}.${specId}`;
    if (meta[ownerKey]) return ownerKey;
    return specId;
  }

  function specialtyMeta(charId, spec) {
    const meta = cfg().specialtyMetadata || {};
    return meta[specialtyMetaKey(charId, spec?.id)] || spec || {};
  }

  function getDisplayTraits(c) {
    const p = profile(c.id);
    if (p?.displayTraits?.length) return p.displayTraits;
    return getCharTraits(c).map(t => (cfg().traitLabels || TRAIT_LABELS)[t] || t);
  }

  function sceneHasConflict(sceneId) {
    return charsInScene(sceneId).some(ch => {
      if (ch.action?.type !== 'interaction') return false;
      const tpl = getInteractionTemplate(ch.action.tpl?.id);
      return tpl?.category === 'zhengchi';
    });
  }

  function evalCheck(c, checkId) {
    if (!checkId) return false;
    if (checkId === 'always') return true;
    if (checkId.startsWith('state:')) return c.activeStates.some(s => s.id === checkId.slice(6));
    const p = profile(c.id);
    const scene = c.sceneId;
    const others = charsInScene(scene).filter(x => x.id !== c.id);
    if (checkId === 'sceneFemale') return others.some(isFemale);
    if (checkId === 'aloneDesk') return others.length === 0;
    if (checkId === 'eveningOutdoor') return (gameHour >= 17 && gameHour < 20) && scene === 3;
    if (checkId === 'afternoon') return gameHour >= 14 && gameHour < 17;
    if (checkId === 'morning') return gameHour >= 5 && gameHour < 12;
    if (checkId === 'sceneConflict') return sceneHasConflict(scene);
    if (checkId === 'sceneCrowd3') return others.length >= 2;
    if (checkId === 'sceneTalking') return others.some(o => o.action?.type === 'interaction');
    if (checkId === 'lowFun') {
      const cf = calcNeedCoeffs(c);
      return c.needs.fun / cf.fun.max < 0.4;
    }
    if (checkId === 'questFollow') {
      return QuestSystem.getActiveForChar?.(c.id)?.some(q => {
        const t = (CONFIG.questConfig || DEFAULT_CONFIG.questConfig).templates?.[q.templateId];
        return t?.completeConditions?.some(cond => cond.type === 'FOLLOW_CHARACTER');
      });
    }
    if (checkId === 'xirenAway') {
      return c.id === 'sheyue' && !others.some(x => x.id === 'xiren') && charsInScene(scene).some(x => x.id === 'baoyu');
    }
    if (checkId === 'avoid_wife') {
      return c.id === 'jialian' && others.some(x => x.id === 'xifeng');
    }
    if (checkId === 'cling_feng') {
      return others.some(x => x.id === 'xifeng');
    }
    if (checkId === 'daiyuDistress') {
      const d = getChar('daiyu');
      if (!d || d.sceneId !== scene) return false;
      return d.activeStates.some(s => ['ganshang', 'melancholy', 'chikuang'].includes(s.id)) || d.needs.fun < 25;
    }
    return false;
  }

  function renderHudSpecialties(c) {
    const p = profile(c.id);
    if (!p?.specialties?.length) return '';
    const traitTags = getDisplayTraits(c).map(t => `<span class="tag specialty">${t}</span>`).join('');
    const specTags = p.specialties.map(s => {
      const meta = specialtyMeta(c.id, s);
      const on = evalCheck(c, p.checks?.[s.id]);
      const label = meta.label || s.name || s.id;
      const desc = meta.description || s.desc || '';
      const examples = (meta.effectExamples || []).join('；');
      const systems = (meta.systems || s.systems || []).join('·');
      const title = [desc, examples, systems ? `系统：${systems}` : ''].filter(Boolean).join('｜');
      return `<span class="tag specialty${on ? ' on' : ''}" title="${esc(title)}">${esc(label)}</span>`;
    }).join('');
    return traitTags + specTags;
  }

  function calcFactor(c, cand, tags) {
    const p = profile(c.id);
    if (!p) return MultiInteractSystem.getActionBoost(c, cand, tags);
    let f = MultiInteractSystem.getActionBoost(c, cand, tags);
    if (p.femaleSocialBoost && cand.kind === 'interaction') {
      const tgt = getChar(cand.targetCharId);
      if (isFemale(tgt) && cand.category !== 'zhengchi') {
        f *= Math.min(1.15, Math.max(1, p.femaleSocialBoost));
      }
    }
    if (p.aloneDeskBoost && tags.includes('desk') && charsInScene(c.sceneId).filter(x => x.id !== c.id).length === 0)
      f *= p.aloneDeskBoost;
    if (p.deskBoost && tags.includes('desk')) f *= p.deskBoost;
    if (p.daiyuDistressBoost && cand.kind === 'interaction' && cand.targetCharId === 'daiyu' && evalCheck(c, 'daiyuDistress'))
      f *= p.daiyuDistressBoost;
    if (p.sickZhengchiBoost && c.activeStates.some(s => s.id === 'sickServe') && cand.category === 'zhengchi')
      f *= p.sickZhengchiBoost;
    if (c.activeStates.some(s => s.id === 'rezhen')) {
      if (['xujiu', 'chuanqing', 'tiaoxiao'].includes(cand.category)) f *= 0.15;
      if (tags.includes('solitude') || tags.includes('bath')) f *= 1.5;
    }
    if (evalCheck(c, 'afternoon') && ['tiaoxiao', 'xujiu', 'outdoor'].some(t => tags.includes(t))) f *= 1.4;
    if (evalCheck(c, 'morning') && (tags.includes('solitude') || tags.includes('lundao') || tags.includes('desk'))) f *= 1.3;
    if (evalCheck(c, 'sceneConflict') && cand.category === 'zhengchi' && p.specialties?.some(s => s.id === 'sharp_tongue')) f *= 1.8;
    if (evalCheck(c, 'sceneCrowd3') && ['tiaoxiao', 'xujiu', 'outdoor'].some(t => tags.includes(t))) f *= 1.5;
    if (evalCheck(c, 'cling_feng') && cand.kind === 'interaction' && cand.targetCharId === 'xifeng') f *= 2.2;
    if (evalCheck(c, 'avoid_wife') && cand.kind === 'interaction') f *= 0.25;
    if (evalCheck(c, 'avoid_wife') && (tags.includes('outdoor') || tags.includes('行'))) f *= 1.6;
    if (p.specialties?.some(s => s.id === 'banquet') && (tags.includes('wine') || tags.includes('xujiu') || tags.includes('tiaoxiao'))) f *= 1.5;
    if (p.specialties?.some(s => s.id === 'wander') && (tags.includes('wine') || tags.includes('outdoor') || tags.includes('fun'))) f *= 1.4;
    if (p.specialties?.some(s => s.id === 'errand') && cand.kind === 'wander') f *= 1.3;
    return f;
  }

  function tickAmbient() {
    for (const c of CHARS) {
      const p = profile(c.id);
      for (const amb of p?.ambient || []) {
        if (amb.type === 'crowdBuff' && charsInScene(c.sceneId).length >= (amb.minChars || 4)) {
          if (!c.activeStates.some(s => s.id === amb.stateId)) CharacterEffectSystem.apply({
            type: 'state', charId: c.id, stateId: amb.stateId,
          }, { source: `specialty:${c.id}:ambient`, reason: '人物专长环境效果' });
        }
        if (amb.type === 'sceneState' && c.sceneId === amb.sceneId && !c.activeStates.some(s => s.id === amb.stateId))
          CharacterEffectSystem.apply({
            type: 'state', charId: c.id, stateId: amb.stateId,
          }, { source: `specialty:${c.id}:scene`, reason: '人物专长场景效果' });
      }
      if (c.id === 'daiyu' && evalCheck(c, 'eveningOutdoor') && !c.activeStates.some(s => s.id === 'ganshang') && Math.random() < 0.08)
        CharacterEffectSystem.apply({
          type: 'state', charId: c.id, stateId: 'ganshang',
        }, { source: 'specialty:daiyu:wind-tear', reason: '临风洒泪' });
    }
  }

  function applyNeedMods(c, coeffs) {
    const mods = profile(c.id)?.needMods;
    if (!mods) return;
    for (const [nk, m] of Object.entries(mods)) {
      if (!coeffs[nk]) continue;
      if (m.decayMult) coeffs[nk].decay *= m.decayMult;
      if (m.growMult) coeffs[nk].grow *= m.growMult;
    }
  }

  function init() {
    EventBus.on('time:tick', evt => {
      if ((evt.minutes || 0) >= 1) tickAmbient();
    });
  }

  return {
    init, profile, renderHudSpecialties, calcFactor, tickAmbient,
    applyNeedMods, traitModTable, getDisplayTraits, evalCheck,
    specialtyMeta, specialtyMetaKey,
  };
})();
window.CharSpecialtySystem = CharSpecialtySystem;

const QUEST_STATUS = { PENDING: 'PENDING', ACCEPTED: 'ACCEPTED', COMPLETED: 'COMPLETED', FAILED: 'FAILED', DECLINED: 'DECLINED', EXPIRED: 'EXPIRED' };

