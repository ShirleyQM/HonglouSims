import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../js/systems/need-adaptation.js', import.meta.url), 'utf8');
const emitted = [];
const states = [];

const CONFIG = {
  needAdaptationConfig: {
    basicNeeds: ['hunger', 'energy', 'fun', 'hygiene'],
    highUseThreshold: 0.85,
    lowUseThreshold: 0.25,
    exposuresPerMaxStep: 6,
    exposuresPerMinStep: 8,
    maxBonusLimit: 20,
    minBonusLimit: 10,
    step: 1,
  },
  charSpecialtyConfig: {
    traitLabels: { tanzui: '贪嘴', shaochi: '少食' },
  },
};

const context = {
  CONFIG,
  DEFAULT_CONFIG: CONFIG,
  GAME_MINUTES_PER_REAL_SEC: 1.2,
  CHARS: [],
  EventBus: { emit: (type, payload) => emitted.push({ type, payload }) },
  NarrativeBubbleSystem: { showBubble() {} },
  CharacterEffectSystem: {
    apply(effect) {
      states.push(effect.stateId);
    },
  },
  TraitEffectSystem: {
    effectsOf(c) {
      return (c.traits || []).map(id => ({
        id,
        effects: id === 'tanzui'
          ? { furnitureNeeds: { hunger: {
            categories: ['meal'], capMultiplier: 1.2, adaptationMultiplier: 2,
          } } }
          : { furnitureNeeds: { hunger: {
            categories: ['meal'], restoreRange: [1, 10],
            aiRefusalChance: 1, refusalAboveRatio: 0.55, refusalText: '不想吃',
          } } },
      }));
    },
  },
  window: {},
  console,
  Math,
};
context.calcNeedCoeffs = c => {
  const coeffs = {
    hunger: { min: 0, max: 100, grow: 1, decay: 1 },
    energy: { min: 0, max: 100, grow: 1, decay: 1 },
    fun: { min: 0, max: 100, grow: 1, decay: 1 },
    hygiene: { min: 0, max: 100, grow: 1, decay: 1 },
  };
  return context.window.NeedAdaptationSystem?.applyCoeffMods(c, coeffs) || coeffs;
};

vm.createContext(context);
vm.runInContext(source, context);
const system = context.window.NeedAdaptationSystem;

const bedChar = { id: 'bed', needs: { energy: 20 }, traits: [] };
const bed = {
  category: 'bed', duration: 7, targetNeedValue: 80, minDurationAtTarget: 1.5,
  needRestores: [{ need: 'energy', ratePerGameMin: 6 }],
};
assert.equal(Number(system.durationFor(bedChar, bed, {}).toFixed(2)), 8.33);
bedChar.needs.energy = 100;
assert.equal(system.durationFor(bedChar, bed, {}), 1.5);

const eater = { id: 'eater', needs: { hunger: 100 }, traits: ['tanzui'] };
const meal = { category: 'meal', needRestores: [{ need: 'hunger', ratePerGameMin: 12 }] };
const item = {};
const prepared = system.prepareUse(eater, meal, item);
assert.equal(prepared.ok, true);
assert.equal(prepared.plan.needs.hunger.cap, 120);
assert.equal(system.reachedTarget(eater, meal, { needPlan: prepared.plan }), false);
system.applyRestore(eater, meal, meal.needRestores[0], 40, { needPlan: prepared.plan });
assert.equal(eater.needs.hunger, 120);
system.recordAdaptation(eater, meal, { needPlan: prepared.plan, playerInitiated: true });
assert.ok(states.includes('stuffed'));

const lightEater = { id: 'light', needs: { hunger: 10 }, traits: ['shaochi'] };
const lightPlan = system.prepareUse(lightEater, meal, {}).plan;
system.applyRestore(lightEater, meal, meal.needRestores[0], 50, { needPlan: lightPlan });
assert.ok(lightEater.needs.hunger > 10 && lightEater.needs.hunger <= 20);

const npc = { id: 'npc', needs: { hunger: 80 }, traits: ['shaochi'] };
const refused = system.prepareUse(npc, meal, { aiGenerated: true, templateId: 101 });
assert.equal(refused.ok, false);
assert.equal(refused.reason, '不想吃');
assert.ok(emitted.some(row => row.type === 'furniture:refused'));

console.log('need adaptation tests passed');
