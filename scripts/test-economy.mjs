import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const events = [];
const listeners = {};
const chars = {
  jiazheng: { id: 'jiazheng', short: '政老爷', actionQueue: [], ai: { cache: {} } },
  wangfuren: { id: 'wangfuren', short: '王夫人', actionQueue: [], ai: { cache: {} } },
  xifeng: { id: 'xifeng', short: '凤姐', actionQueue: [], ai: { cache: {} } },
};
const familyByChar = { jiazheng: 4, wangfuren: 4, xifeng: 7 };
const funds = { 1: 10, 4: 100, 7: 50 };

const context = {
  console,
  window: {},
  gameDay: 1,
  gameHour: 7,
  CONFIG: {
    moneyConfig: {
      economy: {
        foodCosts: { meal: 3 },
        workers: [
          { charId: 'jiazheng', startHour: 7, endHour: 17, dailyWage: 30, workplaceSceneId: 5, workplaceInstanceId: 5009, workName: '衙署当值' },
        ],
        monthlyAllowanceDay: 1,
        monthlyAllowances: [
          { issuerId: 'wangfuren', targetFamilyId: 1, amount: 20, note: '月银' },
        ],
      },
    },
  },
  DEFAULT_CONFIG: { moneyConfig: {} },
  EventBus: {
    on(type, fn) {
      (listeners[type] ||= []).push(fn);
      return () => {};
    },
    emit(type, payload) {
      events.push({ type, ...payload });
      for (const fn of listeners[type] || []) fn(payload);
    },
  },
  FamilySystem: {
    findFamilyOfChar(charId) {
      const id = familyByChar[charId];
      return id ? { id, name: `家庭${id}`, residenceSceneId: id === 4 ? 5 : 6 } : null;
    },
    getFund(id) { return funds[id] || 0; },
    getFamily(id) { return funds[id] == null ? null : { id }; },
    depositFund(id, amount) { funds[id] = (funds[id] || 0) + amount; return amount; },
    withdrawFund(id, amount) {
      const paid = Math.min(funds[id] || 0, amount);
      funds[id] = (funds[id] || 0) - paid;
      return paid;
    },
    transferFund(fromId, toId, amount) {
      if ((funds[fromId] || 0) < amount) return false;
      funds[fromId] -= amount;
      funds[toId] = (funds[toId] || 0) + amount;
      return true;
    },
  },
  getChar: id => chars[id],
  getInstance: id => id === 5009 ? { instanceId: 5009, sceneId: 5, templateId: 113 } : null,
  makeFurnitureItem: inst => ({ type: 'furniture', instanceId: inst.instanceId }),
  makeMoveItem: (col, row) => ({ type: 'move', gridCol: col, gridRow: row }),
  enqueueAction: (c, item, atFront) => {
    if (atFront) c.actionQueue.unshift(item);
    else c.actionQueue.push(item);
    return true;
  },
  getScene: () => ({ originCol: 0, originRow: 0, cols: 4, rows: 4 }),
  WORLD: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ walkable: true }))),
  charAtCell: () => null,
  log: () => {},
};

vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../js/systems/economy.js', import.meta.url), 'utf8'), context);
const economy = context.window.EconomySystem;

assert.equal(economy.canUseFurniture(chars.jiazheng, { category: 'meal' }), true);
funds[4] = 2;
assert.match(economy.canUseFurniture(chars.jiazheng, { category: 'meal' }), /不足/);
funds[4] = 100;

economy.init();
assert.equal(economy.startShift(economy.cfg().workers[0], 1), true);
assert.equal(economy.startShift(economy.cfg().workers[0], 1), false);
assert.equal(economy.endShift(economy.cfg().workers[0], 1), true);
assert.equal(funds[4], 130);
assert.equal(economy.endShift(economy.cfg().workers[0], 1), false);
assert.equal(funds[4], 130);

context.EventBus.emit('furniture:complete', {
  charId: 'jiazheng', category: 'meal', templateId: 301,
});
assert.equal(funds[4], 127);

context.CONFIG.moneyConfig.economy.foodChargesEnabled = false;
funds[4] = 0;
assert.equal(economy.canUseFurniture(chars.jiazheng, { category: 'meal' }), true);
const foodPaidCount = events.filter(row => row.type === 'economy:food_paid').length;
context.EventBus.emit('furniture:complete', {
  charId: 'jiazheng', category: 'meal', templateId: 301,
});
assert.equal(funds[4], 0);
assert.equal(events.filter(row => row.type === 'economy:food_paid').length, foodPaidCount);
funds[4] = 127;

assert.equal(economy.runMonthlyAllowances(1), 1);
assert.equal(funds[4], 107);
assert.equal(funds[1], 30);
assert.equal(economy.runMonthlyAllowances(1), 0);
assert.equal(funds[4], 107);

assert.ok(events.some(row => row.type === 'economy:shift_started'));
assert.ok(events.some(row => row.type === 'economy:shift_ended'));
assert.ok(events.some(row => row.type === 'economy:food_paid'));
assert.ok(events.some(row => row.type === 'economy:allowance_paid'));

console.log('economy tests passed');
