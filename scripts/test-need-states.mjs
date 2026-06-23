import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../js/systems/need-state.js', import.meta.url), 'utf8');
const applied = [];
const emitted = [];

const needDefs = [
  {
    key: 'hunger',
    stateBands: [
      { id: 'h1', maxExclusive: 20 },
      { id: 'h2', minInclusive: 20, maxExclusive: 40 },
      { id: 'h3', minInclusive: 80, maxExclusive: 100 },
      { id: 'h4', minInclusive: 100 },
    ],
  },
  {
    key: 'hygiene',
    stateBands: [
      { id: 'g1', maxExclusive: 20 },
      { id: 'g2', minInclusive: 20, maxExclusive: 40 },
      { id: 'g3', minInclusive: 80, maxExclusive: 100 },
      { id: 'g4', minInclusive: 100 },
    ],
  },
];

const char = {
  id: 'daiyu',
  needs: { hunger: 19, hygiene: 85, energy: 85, fun: 85, social: 85, mood: 85 },
  activeStates: [],
  needMeta: {},
  traits: ['aijie'],
};

const context = {
  CONFIG: {
    needCombinationStates: [
      { stateId: 'combo2', all: [{ need: 'hunger', min: 80 }, { need: 'fun', min: 80 }] },
      { stateId: 'combo4', all: [
        { need: 'hunger', min: 80 }, { need: 'energy', min: 80 },
        { need: 'fun', min: 80 }, { need: 'hygiene', min: 80 },
      ] },
    ],
  },
  CHARS: [char],
  getNeedDefs: () => needDefs,
  getCharTraits: c => c.traits,
  applyState(c, id) {
    applied.push(id);
    c.activeStates = c.activeStates.filter(st => !st.id.startsWith(id[0]));
    c.activeStates.push({ id, remaining: 30 });
  },
  EventBus: { emit: (type, payload) => emitted.push({ type, payload }) },
  window: {},
};

vm.createContext(context);
vm.runInContext(source, context);
const system = context.window.NeedStateSystem;

const hunger = needDefs[0];
assert.equal(system.currentBand(hunger, 19).id, 'h1');
assert.equal(system.currentBand(hunger, 20).id, 'h2');
assert.equal(system.currentBand(hunger, 39.99).id, 'h2');
assert.equal(system.currentBand(hunger, 40), null);
assert.equal(system.currentBand(hunger, 79.99), null);
assert.equal(system.currentBand(hunger, 80).id, 'h3');
assert.equal(system.currentBand(hunger, 99.99).id, 'h3');
assert.equal(system.currentBand(hunger, 100).id, 'h4');

system.init();
assert.ok(applied.includes('h1'));
assert.ok(applied.includes('g3'));

char.needs.hunger = 85;
system.sync(char);
assert.ok(applied.includes('h3'));
assert.equal(applied.at(-1), 'combo4');

const effects = system.traitStateEffects(char, {
  traitEffects: { aijie: { needMods: { mood: { decay: 0.8 } } } },
});
assert.equal(effects.length, 1);
assert.equal(effects[0].needMods.mood.decay, 0.8);
assert.ok(emitted.some(row => row.type === 'need:band_changed'));
assert.ok(emitted.some(row => row.type === 'need:combination_triggered'));

console.log('need state tests passed');
