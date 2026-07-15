/* ═══════════════════ ACTIVITY PACK SYSTEM ═══════════════════
 *
 * 主题玩法包的薄适配层。
 *
 * Activity Pack 不直接替代家具、互动、状态或技能系统；它只负责把
 * “饮酒 / 写诗 / 戏乐”这类跨系统玩法声明成统一配置，并把其中的
 * furnitureActions 挂到现有家具 actions 链路。
 */
const ActivityPackSystem = (() => {
  function packs() {
    return CONFIG?.activityPacks || {};
  }

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function list() {
    return Object.entries(packs()).map(([id, pack]) => ({ id, ...pack }));
  }

  function packMatchesFurniture(pack, tpl) {
    if (!pack || !tpl) return false;
    const categories = pack.furnitureCategories || [];
    const templateIds = pack.furnitureTemplateIds || [];
    const tags = pack.furnitureTags || [];
    return categories.includes(tpl.category)
      || templateIds.includes(tpl.id)
      || tags.some(tag => (tpl.tags || []).includes(tag));
  }

  function actionMatchesFurniture(pack, action, tpl) {
    const hasActionScope = action?.furnitureCategories?.length
      || action?.furnitureTemplateIds?.length
      || action?.furnitureTags?.length;
    if (!hasActionScope) return packMatchesFurniture(pack, tpl);
    const categories = action.furnitureCategories || [];
    const templateIds = action.furnitureTemplateIds || [];
    const tags = action.furnitureTags || [];
    return categories.includes(tpl.category)
      || templateIds.includes(tpl.id)
      || tags.some(tag => (tpl.tags || []).includes(tag));
  }

  function normalizeFurnitureAction(packId, pack, action) {
    const raw = clone(action) || {};
    raw.id = raw.id || `${packId}_action`;
    raw.name = raw.name || raw.label || raw.id;
    raw.activityId = raw.activityId || packId;
    raw.activityName = raw.activityName || pack.name || packId;
    raw.tags = Array.from(new Set([...(pack.tags || []), ...(raw.tags || [])]));
    raw.effects = (raw.effects || raw.extraEffects || []).map(ef => ({ ...ef }));
    delete raw.extraEffects;
    return raw;
  }

  function furnitureActionsFor(tpl) {
    const out = [];
    for (const [packId, pack] of Object.entries(packs())) {
      if (!packMatchesFurniture(pack, tpl)) continue;
      for (const action of pack.furnitureActions || []) {
        if (!actionMatchesFurniture(pack, action, tpl)) continue;
        out.push(normalizeFurnitureAction(packId, pack, action));
      }
    }
    return out;
  }

  function defaultFurnitureAction(tpl) {
    return {
      id: 'default_use',
      name: `使用${tpl?.name || '家具'}`,
      text: '',
      duration: tpl?.duration,
      needRestores: tpl?.needRestores || [],
      effects: tpl?.extraEffects || [],
      tags: [tpl?.category].filter(Boolean),
      defaultAction: true,
    };
  }

  function getFurnitureActions(tpl) {
    const explicit = (tpl?.actions || []).map(action => ({ ...action, tags: [...(action.tags || [])] }));
    const fromPacks = furnitureActionsFor(tpl);
    const merged = [];
    const used = new Set();
    for (const action of [...explicit, ...fromPacks]) {
      const id = String(action.id || 'default_use');
      if (used.has(id)) continue;
      used.add(id);
      merged.push(action);
    }
    return merged.length ? merged : [defaultFurnitureAction(tpl)];
  }

  function isAiAllowed(action) {
    if (!action) return true;
    if (action.aiAutonomous === false) return false;
    if (action.ai?.allowAutonomous === false) return false;
    return true;
  }

  function validate() {
    const errors = [];
    for (const [packId, pack] of Object.entries(packs())) {
      if (!pack.name) errors.push(`${packId}: 缺 name`);
      const seen = new Set();
      for (const action of pack.furnitureActions || []) {
        if (!action.id) errors.push(`${packId}: furnitureAction 缺 id`);
        if (!action.name) errors.push(`${packId}.${action.id || '?'}: 缺 name`);
        if (action.id && seen.has(action.id)) errors.push(`${packId}: 重复 action id ${action.id}`);
        if (action.id) seen.add(action.id);
        for (const ef of action.effects || action.extraEffects || []) {
          if (ef.type === 'skillXp' && !CONFIG.skillDefs?.[ef.skill || ef.param]) {
            errors.push(`${packId}.${action.id}: 未知技能 ${ef.skill || ef.param}`);
          }
          if ((ef.type === 'state' || ef.type === 'addState') && !CONFIG.stateDefs?.[ef.stateId || ef.param]) {
            errors.push(`${packId}.${action.id}: 未知状态 ${ef.stateId || ef.param}`);
          }
        }
      }
    }
    return { ok: errors.length === 0, errors };
  }

  return { list, getFurnitureActions, furnitureActionsFor, isAiAllowed, validate };
})();

window.ActivityPackSystem = ActivityPackSystem;
