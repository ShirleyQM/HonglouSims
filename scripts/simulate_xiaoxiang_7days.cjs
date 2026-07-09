#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'reports');
const OUT_FILE = process.env.SIM_OUT_FILE
  ? path.resolve(ROOT, process.env.SIM_OUT_FILE)
  : path.join(OUT_DIR, '潇湘馆_7天模拟日志.md');
const JSON_OUT_FILE = process.env.SIM_JSON_OUT_FILE
  ? path.resolve(ROOT, process.env.SIM_JSON_OUT_FILE)
  : OUT_FILE.replace(/\.md$/i, '.json');
const TARGET_IDS = (process.env.SIM_TARGET_IDS || 'daiyu,zijuan,xueyan')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const TARGET_SET = new Set(TARGET_IDS);
const SEED = Number(process.env.SIM_SEED || 61617);
const STEP_SEC = Number(process.env.SIM_STEP_SEC || 1);
const DAYS = Number(process.env.SIM_DAYS || 7);
const GAME_MINUTES_LIMIT = Number(process.env.SIM_GAME_MINUTES || 0);
const MAX_STEPS = Number(process.env.SIM_MAX_STEPS || 0);
const PROGRESS_EVERY_GAME_MIN = Number(process.env.SIM_PROGRESS_EVERY_GAME_MIN || 720);

function makeRandom(seed) {
  let s = seed >>> 0;
  return function random() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function createElement(id = '') {
  const el = {
    id,
    tagName: String(id || 'div').toUpperCase(),
    style: {},
    dataset: {},
    children: [],
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; },
    },
    appendChild(child) { this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter(x => x !== child); },
    remove() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; },
    setAttribute(name, value) { this[name] = value; },
    getAttribute(name) { return this[name]; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    scrollIntoView() {},
    focus() {},
    blur() {},
    click() {},
    getBoundingClientRect() {
      return { left: 0, top: 0, right: 960, bottom: 504, width: 960, height: 504 };
    },
    getContext() { return ctxStub; },
    innerHTML: '',
    textContent: '',
    value: '',
    checked: false,
    disabled: false,
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  };
  return el;
}

const ctxStub = new Proxy({ imageSmoothingEnabled: false }, {
  get(target, prop) {
    if (prop in target) return target[prop];
    return () => {};
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
});

let perfNowMs = 0;
let timerSeq = 1;
const timers = [];
function runTimers() {
  const due = timers.filter(t => !t.cancelled && t.at <= perfNowMs);
  for (const t of due) t.cancelled = true;
  for (const t of due) {
    try { t.fn(); } catch (e) { console.warn('[timer]', e); }
  }
}

const elements = {};
const documentStub = {
  hidden: false,
  body: createElement('body'),
  documentElement: createElement('html'),
  getElementById(id) {
    if (!elements[id]) elements[id] = createElement(id);
    return elements[id];
  },
  createElement(tag) { return createElement(tag); },
  createTextNode(text) { return { textContent: String(text) }; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  addEventListener() {},
  removeEventListener() {},
};

const storage = new Map();
const localStorageStub = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); },
  clear() { storage.clear(); },
};

class ImageStub {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.width = 0;
    this.height = 0;
  }
  set src(value) {
    this._src = value;
    const cb = this.onload;
    if (cb) setTimeout(cb, 0);
  }
  get src() { return this._src; }
}

const seededMath = Object.create(Math);
seededMath.random = makeRandom(SEED);

const QUIET = process.env.SIM_QUIET !== '0';
const simConsole = QUIET
  ? {
      error: (...args) => console.error(...args),
      info: (...args) => console.info(...args),
      log(...args) {
        if (String(args[0] || '').startsWith('[interaction-risk]')) return;
        console.log(...args);
      },
      warn(...args) {
        if (String(args[0] || '').startsWith('[interaction-risk]')) return;
        console.warn(...args);
      },
      debug(...args) {
        if (String(args[0] || '').startsWith('[interaction-risk]')) return;
        console.debug(...args);
      },
    }
  : console;

const context = {
  console: simConsole,
  Math: seededMath,
  JSON,
  Date,
  Map,
  Set,
  WeakMap,
  WeakSet,
  Object,
  Array,
  Number,
  String,
  Boolean,
  RegExp,
  Error,
  TypeError,
  Promise,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  encodeURIComponent,
  decodeURIComponent,
  document: documentStub,
  localStorage: localStorageStub,
  performance: { now: () => perfNowMs },
  requestAnimationFrame() { return 0; },
  cancelAnimationFrame() {},
  setTimeout(fn, ms = 0) {
    const id = timerSeq++;
    timers.push({ id, at: perfNowMs + ms, fn, cancelled: false });
    return id;
  },
  clearTimeout(id) {
    const t = timers.find(x => x.id === id);
    if (t) t.cancelled = true;
  },
  setInterval() { return 0; },
  clearInterval() {},
  fetch: async () => ({ ok: false, status: 0, json: async () => ({}), text: async () => '' }),
  Image: ImageStub,
  Audio: function Audio() { return { play() {}, pause() {} }; },
  navigator: { userAgent: 'node-sim' },
  location: { href: 'http://127.0.0.1:8765/' },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() { return true; },
};
context.window = context;
context.globalThis = context;

const vmContext = vm.createContext(context);

function runScript(relPath) {
  const abs = path.join(ROOT, relPath);
  const code = fs.readFileSync(abs, 'utf8');
  vm.runInContext(code, vmContext, { filename: relPath });
}

const scripts = [
  'js/config.js',
  'js/runtime.js',
  'js/systems/trait-effects.js',
  'js/systems/need-adaptation.js',
  'js/systems/trait-behavior.js',
  'js/systems/narrative.js',
  'js/systems/interaction-llm.js',
  'js/systems/family.js',
  'js/systems/scene-access.js',
  'js/systems/multi-interact.js',
  'js/systems/specialty.js',
  'js/systems/quest.js',
  'js/systems/relation.js',
  'js/systems/money.js',
  'js/systems/economy.js',
  'js/systems/reputation-domain.js',
  'js/systems/life-path.js',
  'js/systems/fortune.js',
  'js/systems/identity-protocol.js',
  'js/systems/servant-relations.js',
  'js/systems/interaction-score.js',
  'js/systems/interaction-social.js',
  'js/systems/quest-issue.js',
  'js/systems/state.js',
  'js/systems/state-defs.js',
  'js/systems/core-needs.js',
  'js/systems/need-state.js',
  'js/systems/ai-candidate-provider.js',
  'js/ai.js',
  'js/systems/ai-homeward.js',
  'js/systems/ai-drama.js',
  'js/systems/behavior-telemetry.js',
  'js/systems/furniture-reaction.js',
  'js/world.js',
  'js/action-queue.js',
  'js/systems/character-effects.js',
  'js/systems/character-logic.js',
];

for (const script of scripts) {
  runScript(script);
  if (script === 'js/config.js') {
    vm.runInContext('window.DEFAULT_CONFIG = DEFAULT_CONFIG;', vmContext);
  }
}

vm.runInContext(`
  CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  migrateConfig(CONFIG);
  window.CONFIG = CONFIG;
  if (CONFIG.narrativeBubble?.settings?.llm) {
    CONFIG.narrativeBubble.settings.llm.enabled = false;
    CONFIG.narrativeBubble.settings.llm.interactionEnabled = false;
    CONFIG.narrativeBubble.settings.llm.useEventOnly = false;
  }
  if (CONFIG.narrativeBubble?.settings) CONFIG.narrativeBubble.settings.masterEnabled = false;
  window.buildUI = window.buildUI || function(){};
  window.drawWorld = window.drawWorld || function(){};
  window.drawFurnitureInstances = window.drawFurnitureInstances || function(){};
  window.drawPathPreview = window.drawPathPreview || function(){};
  window.drawSocialLinks = window.drawSocialLinks || function(){};
  window.drawChar = window.drawChar || function(){};
  window.drawSpeechBubble = window.drawSpeechBubble || function(){};
  window.initLogSidebar = window.initLogSidebar || function(){};
  window.AssetSystem = window.AssetSystem || { preload(){} };
`, vmContext);

function evalInContext(code) {
  return vm.runInContext(code, vmContext);
}

evalInContext(`
  initRuntime();
  if (SceneAccessSystem?.repairAllCharacterScenes) SceneAccessSystem.repairAllCharacterScenes();
  initEventSystem();
  SceneAccessSystem.init();
  NarrativeBubbleSystem.init();
  InteractionLlmSystem.init();
  FamilySystem.init();
  QuestSystem.init();
  ServantRelationSystem?.init?.();
  MoneySystem?.init?.();
  EconomySystem?.init?.();
  TraitBehaviorSystem?.init?.();
  LifePathSystem?.init?.();
  FortuneSystem?.init?.();
  CharSpecialtySystem.init();
  MultiInteractSystem.init();
  CoreNeedSystem?.init?.();
  NeedAdaptationSystem?.init?.();
  initAISystem();
  FurnitureReactionSystem?.init?.();
  BehaviorTelemetry?.init?.();
  NeedStateSystem?.init?.();
  if (${JSON.stringify(process.env.SIM_DISABLE_RISK === '1')}) {
    const origEvaluate = InteractionSocialSystem?.evaluate;
    if (origEvaluate) {
      InteractionSocialSystem.evaluate = function(initiator, target, tpl) {
        const res = origEvaluate(initiator, target, tpl) || {};
        return {
          ...res,
          risky: false,
          riskHint: '',
          successRate: 1,
          riskMeta: { ...(res.riskMeta || {}), isRisky: false, forbidden: false, successRate: 1, riskHint: '' },
        };
      };
    }
    if (InteractionSocialSystem?.applyRiskOutcome) InteractionSocialSystem.applyRiskOutcome = () => true;
  }
  LifePathSystem?.tryIssueStoryQuestsAll?.();
  selectedIdx = -1;
  resumeCharAI = function(c) {
    if (!c?.ai) return;
    if (c.action || c.actionQueue.length) setAIState(c, AI_STATE.EXECUTING);
    else setAIState(c, AI_STATE.IDLE);
  };
  CHARS.forEach(c => { if (isAIControlled(c) && c.ai.state === AI_STATE.IDLE) slowChannelTick(c); });
`);

function snapshotChars() {
  return evalInContext(`CHARS.map(c => ({
    id: c.id, name: c.name, short: c.short, sceneId: c.sceneId,
    statusText: c.statusText, actionType: c.action?.type || '',
    queue: c.actionQueue?.map(i => i.itemName || i.name || i.type) || [],
    needs: c.needs, aiState: c.ai?.state || '',
  }))`);
}

function getCharName(id) {
  if (!id) return '';
  return evalInContext(`(getChar(${JSON.stringify(id)})?.short || getChar(${JSON.stringify(id)})?.name || ${JSON.stringify(id)})`);
}

function getTplName(templateId) {
  if (!templateId) return '';
  return evalInContext(`(CONFIG.questConfig?.templates?.[${JSON.stringify(templateId)}]?.name || CONFIG.furnitureTemplates?.[${JSON.stringify(templateId)}]?.name || '')`);
}

function getFurnitureName(templateId) {
  if (!templateId) return '家具';
  return evalInContext(`(getTemplate(${JSON.stringify(templateId)})?.name || ${JSON.stringify(templateId)})`);
}

function hhmm(evt) {
  return `第${String(evt.gameDay).padStart(2, '0')}日 ${String(evt.gameHour).padStart(2, '0')}:${String(evt.gameMinute).padStart(2, '0')}`;
}

function involvedIds(evt) {
  return [
    evt.charId, evt.assigneeId, evt.issuerId, evt.initiatorId, evt.targetId,
    evt.servantId, evt.masterId, evt.observerId, evt.actorId, evt.idA, evt.idB,
  ].filter(Boolean);
}

function isTargetEvent(evt) {
  if (evt.type === 'time:day' || evt.type === 'time:period') return true;
  return involvedIds(evt).some(id => TARGET_SET.has(id));
}

function personsForEvent(evt) {
  const ids = [];
  for (const id of involvedIds(evt)) {
    if (TARGET_SET.has(id) && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

function formatEvent(evt, perspectiveId = null) {
  const perspectiveName = perspectiveId ? getCharName(perspectiveId) : '';
  switch (evt.type) {
    case 'time:day':
      return { person: '全局', action: `进入第${evt.day}日`, issuer: '' };
    case 'time:period':
      return { person: '全局', action: `时段切换：${evt.label || evt.period}`, issuer: '' };
    case 'ai:decision':
      return { person: getCharName(evt.charId), action: `AI选择：${evt.action || evt.label || evt.key}${evt.key ? ` [${evt.key}]` : ''}${evt.provider ? ` provider=${evt.provider}` : ''}${evt.routineAnchor?.id ? ` routine=${evt.routineAnchor.id}` : ''}`, issuer: '' };
    case 'ai:routine_completed':
      return {
        person: getCharName(evt.charId),
        action: `作息完成：${evt.anchorName || evt.anchorId}${evt.category ? ` via=${evt.category}` : ''}`,
        issuer: '',
      };
    case 'ai:social_target_cooldown':
      return {
        person: getCharName(evt.charId),
        action: `AI目标频控：${getCharName(evt.targetCharId)} ${evt.minutes || ''}分钟${evt.crossedScene ? '（跨房间）' : ''}`,
        issuer: '',
      };
    case 'ai:daily_social_count':
      return {
        person: getCharName(evt.charId),
        action: `AI每日主动社交计数：${getCharName(evt.targetCharId)} ${evt.count}/${evt.limit}`,
        issuer: '',
      };
    case 'queue:add':
      return { person: getCharName(evt.charId), action: `行动入队：${evt.itemName || evt.name || evt.actionType || evt.type}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'queue:failed':
    case 'action:blocked':
      return { person: getCharName(evt.charId), action: `行动受阻：${evt.reason || evt.message || evt.type}${evt.instanceId ? ` inst=${evt.instanceId}` : ''}${evt.sceneId ? ` scene=${evt.sceneId}` : ''}${evt.candidateKey ? ` cand=${evt.candidateKey}` : ''}`, issuer: '' };
    case 'furniture:use_started':
    case 'furniture:started':
      return { person: getCharName(evt.charId), action: `开始用家具：${getFurnitureName(evt.templateId)}${evt.actionId ? ` / ${evt.actionId}` : ''}`, issuer: '' };
    case 'furniture:complete':
      return { person: getCharName(evt.charId), action: `完成用家具：${getFurnitureName(evt.templateId)}${evt.actionId ? ` / ${evt.actionId}` : ''}`, issuer: '' };
    case 'furniture:refused':
      return { person: getCharName(evt.charId), action: `拒绝用家具：${getFurnitureName(evt.templateId)}，${evt.reason || ''}`, issuer: '' };
    case 'interaction:started':
      if (perspectiveId && perspectiveId === evt.targetId && evt.initiatorId !== evt.targetId)
        return { person: perspectiveName, action: `被${getCharName(evt.initiatorId)}发起互动：「${evt.interactionName || evt.templateId || ''}」`, issuer: '' };
      return { person: getCharName(evt.initiatorId), action: `开始互动：与${getCharName(evt.targetId)}「${evt.interactionName || evt.templateId || ''}」`, issuer: '' };
    case 'interaction:complete':
      if (perspectiveId && perspectiveId === evt.targetId && evt.initiatorId !== evt.targetId)
        return { person: perspectiveName, action: `被${getCharName(evt.initiatorId)}完成互动：「${evt.interactionName || evt.templateId || ''}」`, issuer: '' };
      return { person: getCharName(evt.initiatorId), action: `完成互动：与${getCharName(evt.targetId)}「${evt.interactionName || evt.templateId || ''}」`, issuer: '' };
    case 'quest:issued':
      if (perspectiveId && perspectiveId === evt.issuerId && evt.assigneeId !== evt.issuerId) {
        return {
          person: perspectiveName,
          action: `下发任务给${getCharName(evt.assigneeId)}：${getTplName(evt.templateId) || evt.templateId || ''}`,
          issuer: perspectiveName,
        };
      }
      return {
        person: getCharName(evt.assigneeId),
        action: `任务下发：${getTplName(evt.templateId) || evt.templateId || ''}`,
        issuer: evt.issuerId ? getCharName(evt.issuerId) : '系统/日课',
      };
    case 'quest:accepted':
      return { person: getCharName(evt.assigneeId), action: `接受任务：${getTplName(evt.templateId) || evt.templateId || ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'quest:started':
      return { person: getCharName(evt.assigneeId || evt.charId), action: `开始任务：${getTplName(evt.templateId) || evt.templateId || ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'quest:completed':
      return { person: getCharName(evt.assigneeId), action: `完成任务：${getTplName(evt.templateId) || evt.templateId || ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'quest:failed':
      return { person: getCharName(evt.assigneeId), action: `任务失败：${getTplName(evt.templateId) || evt.templateId || ''}，${evt.reason || ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'quest:declined':
      return { person: getCharName(evt.assigneeId), action: `拒绝任务：${getTplName(evt.templateId) || evt.templateId || ''}，${evt.reason || ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'quest:expired':
      return { person: getCharName(evt.assigneeId || evt.charId), action: `任务过期：${getTplName(evt.templateId) || evt.templateId || ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'quest:progress':
      return { person: getCharName(evt.assigneeId || evt.charId), action: `任务进度：${getTplName(evt.templateId) || evt.templateId || ''} ${evt.progress ?? ''}/${evt.target ?? ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    case 'need:crisis':
      return { person: getCharName(evt.charId), action: `需求危机：${evt.needKey}`, issuer: '' };
    case 'servant:follow_interrupted':
      return { person: getCharName(evt.servantId), action: `随侍中断：${evt.needKey || '需求处理'}`, issuer: evt.masterId ? getCharName(evt.masterId) : '' };
    default: {
      const ids = personsForEvent(evt);
      return { person: ids.map(getCharName).join('、') || '全局', action: `${evt.type}${evt.reason ? `：${evt.reason}` : ''}${evt.message ? `：${evt.message}` : ''}`, issuer: evt.issuerId ? getCharName(evt.issuerId) : '' };
    }
  }
}

const interestingTypes = new Set([
  'time:day',
  'time:period',
  'ai:decision',
  'ai:routine_completed',
  'ai:social_target_cooldown',
  'ai:daily_social_count',
  'queue:add',
  'queue:failed',
  'action:blocked',
  'furniture:use_started',
  'furniture:started',
  'furniture:complete',
  'furniture:refused',
  'interaction:started',
  'interaction:complete',
  'quest:issued',
  'quest:accepted',
  'quest:started',
  'quest:completed',
  'quest:failed',
  'quest:declined',
  'quest:expired',
  'quest:progress',
  'need:crisis',
  'servant:follow_interrupted',
]);

const rows = [];
const rawCounts = {};
evalInContext(`
  EventBus.on('*', evt => {
    if (typeof __recordEvent === 'function') __recordEvent(evt);
  });
`);
context.__recordEvent = evt => {
  rawCounts[evt.type] = (rawCounts[evt.type] || 0) + 1;
  if (!interestingTypes.has(evt.type) || !isTargetEvent(evt)) return;
  if (evt.type === 'time:day' || evt.type === 'time:period') {
    const formatted = formatEvent(evt);
    rows.push({
      time: hhmm(evt),
      day: evt.gameDay,
      hour: evt.gameHour,
      minute: evt.gameMinute,
      type: evt.type,
      person: formatted.person,
      action: formatted.action,
      issuer: formatted.issuer || '',
    });
    return;
  }
  for (const targetId of personsForEvent(evt)) {
    const formatted = formatEvent(evt, targetId);
    if (!formatted.person || !TARGET_SET.has(targetId)) continue;
    rows.push({
      time: hhmm(evt),
      day: evt.gameDay,
      hour: evt.gameHour,
      minute: evt.gameMinute,
      type: evt.type,
      person: getCharName(targetId),
      action: formatted.action,
      issuer: formatted.issuer || '',
    });
  }
};

const startDay = evalInContext('gameDay');
const endBeforeDay = startDay + DAYS;
const startHour = evalInContext('gameHour');
const startMinute = evalInContext('gameMinute');
const startGameAbsMin = startDay * 1440 + startHour * 60 + startMinute;
const endGameAbsMin = GAME_MINUTES_LIMIT > 0
  ? startGameAbsMin + GAME_MINUTES_LIMIT
  : endBeforeDay * 1440;
const totalGameMin = Math.max(1, endGameAbsMin - startGameAbsMin);
const startedAtMs = Date.now();
let lastProgressGameMin = -Infinity;

function printProgress(force = false) {
  const nowTime = evalInContext('({ day: gameDay, hour: gameHour, minute: gameMinute })');
  const day = nowTime.day;
  const hour = nowTime.hour;
  const minute = Math.floor(nowTime.minute || 0);
  const nowGameAbsMin = day * 1440 + hour * 60 + minute;
  const doneGameMin = Math.max(0, Math.min(totalGameMin, nowGameAbsMin - startGameAbsMin));
  if (!Number.isFinite(doneGameMin)) return;
  if (!force && doneGameMin - lastProgressGameMin < PROGRESS_EVERY_GAME_MIN) return;
  lastProgressGameMin = doneGameMin;
  const pct = Math.min(100, (doneGameMin / totalGameMin) * 100);
  const elapsedSec = (Date.now() - startedAtMs) / 1000;
  const etaSec = doneGameMin > 0 ? elapsedSec * (totalGameMin - doneGameMin) / doneGameMin : 0;
  console.error(`[sim] ${pct.toFixed(1).padStart(5)}% 第${String(day).padStart(2, '0')}日 ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} rows=${rows.length} elapsed=${elapsedSec.toFixed(1)}s eta=${etaSec.toFixed(1)}s`);
}

context.__endBeforeDay = endBeforeDay;
context.__endGameAbsMin = endGameAbsMin;
context.__stepSec = STEP_SEC;
context.__maxSteps = MAX_STEPS;
context.__steps = 0;
context.__hostAfterStep = () => {
  perfNowMs += STEP_SEC * 1000;
  runTimers();
  printProgress(false);
};
printProgress(true);
evalInContext(`
  while ((gameDay * 1440 + gameHour * 60 + gameMinute) < window.__endGameAbsMin) {
    if (window.__maxSteps > 0 && window.__steps++ >= window.__maxSteps) {
      EventBus.emit('sim:max_steps', { steps: window.__steps, reason: 'max_steps' });
      break;
    }
    window.__hostAfterStep();
    tickGameTime(window.__stepSec);
    CHARS.forEach(c => {
      updateStates(c, window.__stepSec);
      decayNeeds(c, window.__stepSec);
      updateAction(c, window.__stepSec);
      updateQueueWait(c, window.__stepSec);
      c.animTime = (c.animTime || 0) + window.__stepSec;
    });
    processUrgentRetries();
    tickRelationDecay(window.__stepSec);
    NarrativeBubbleSystem.update(window.__stepSec);
    CHARS.forEach(c => {
      if (c.ai?.state === AI_STATE.PAUSED && !isInteractionLockActive(c)) resumeCharAI(c);
    });
  }
`);
printProgress(true);

const finalChars = snapshotChars().filter(c => TARGET_SET.has(c.id));
const finalFamilies = evalInContext(`(CONFIG.familyConfig?.families || []).map(f => ({
  id: f.id,
  name: f.name,
  fund: FamilySystem?.getFamilyFund?.(f.id) ?? f.fund ?? 0,
  memberIds: (f.members || []).map(m => m.charId),
}))`);

function escapeMd(s) {
  return String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

const perPersonDay = {};
const actionCounts = {};
const problems = [];
for (const r of rows) {
  if (r.person === '全局') continue;
  const people = r.person.split('、');
  for (const p of people) {
    const key = `${r.day}|${p}`;
    perPersonDay[key] ||= { total: 0, tasks: 0, furniture: 0, interactions: 0, blocked: 0, decisions: 0, samples: [] };
    const d = perPersonDay[key];
    d.total++;
    if (r.type.startsWith('quest:')) d.tasks++;
    if (r.type.startsWith('furniture:')) d.furniture++;
    if (r.type.startsWith('interaction:')) d.interactions++;
    if (r.type === 'queue:failed' || r.type === 'action:blocked' || r.type === 'quest:failed') d.blocked++;
    if (r.type === 'ai:decision') d.decisions++;
    if (d.samples.length < 5 && !r.type.includes('progress')) d.samples.push(`${r.time.slice(4)} ${r.action}`);
  }
  const actionKey = `${r.person}|${r.action}`;
  actionCounts[actionKey] = (actionCounts[actionKey] || 0) + 1;
}

for (const [key, data] of Object.entries(perPersonDay)) {
  if (data.blocked >= 3) {
    const [day, person] = key.split('|');
    problems.push(`第${day}日 ${person} 出现 ${data.blocked} 次受阻/失败，可能有路径、权限或任务条件问题。`);
  }
  if (data.interactions === 0 && data.tasks + data.furniture + data.decisions > 0) {
    const [day, person] = key.split('|');
    problems.push(`第${day}日 ${person} 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。`);
  }
}

const repeated = Object.entries(actionCounts)
  .filter(([, n]) => n >= 8)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .map(([k, n]) => {
    const [person, action] = k.split('|');
    return `${person}：${action} ×${n}`;
  });

const md = [];
md.push('# 潇湘馆 7 天离线模拟日志');
md.push('');
md.push(`- 模拟对象：${TARGET_IDS.map(getCharName).join('、')}`);
md.push(`- 模拟范围：第 ${startDay} 日 08:00 到第 ${endBeforeDay} 日 00:00 前`);
md.push(`- 随机种子：${SEED}`);
md.push(`- 时间步长：${STEP_SEC}s，游戏设定 1 日 = 20 真实分钟`);
md.push(`- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。`);
md.push('');
md.push('## 自动问题摘要');
md.push('');
if (problems.length) {
  for (const p of [...new Set(problems)].slice(0, 40)) md.push(`- ${p}`);
} else {
  md.push('- 未发现高频任务失败或行动受阻。');
}
md.push('');
md.push('## 高频重复行为');
md.push('');
if (repeated.length) {
  for (const r of repeated) md.push(`- ${r}`);
} else {
  md.push('- 没有单项行为超过 8 次。');
}
md.push('');
md.push('## 每人每日汇总');
md.push('');
md.push('| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |');
md.push('|---:|---|---:|---:|---:|---:|---:|---:|---|');
for (let day = startDay; day < endBeforeDay; day++) {
  for (const id of TARGET_IDS) {
    const person = getCharName(id);
    const d = perPersonDay[`${day}|${person}`] || { total: 0, tasks: 0, furniture: 0, interactions: 0, blocked: 0, decisions: 0, samples: [] };
    md.push(`| ${day} | ${escapeMd(person)} | ${d.total} | ${d.decisions} | ${d.furniture} | ${d.interactions} | ${d.tasks} | ${d.blocked} | ${escapeMd(d.samples.join('；'))} |`);
  }
}
md.push('');
md.push('## 最终状态');
md.push('');
md.push('| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |');
md.push('|---|---:|---|---|---|---:|---:|---:|---:|---:|');
for (const c of finalChars) {
  md.push(`| ${escapeMd(c.short || c.name)} | ${c.sceneId} | ${escapeMd(c.aiState)} | ${escapeMd(c.statusText)} | ${escapeMd(c.queue.join('、'))} | ${Math.round(c.needs.hunger ?? 0)} | ${Math.round(c.needs.hygiene ?? 0)} | ${Math.round(c.needs.energy ?? 0)} | ${Math.round(c.needs.social ?? 0)} | ${Math.round(c.needs.mood ?? 0)} |`);
}
md.push('');
md.push('## 按时间顺序详细日志');
md.push('');
md.push('| 时间 | 人物 | 动作 | 下发者 | 事件 |');
md.push('|---|---|---|---|---|');
for (const r of rows) {
  md.push(`| ${escapeMd(r.time)} | ${escapeMd(r.person)} | ${escapeMd(r.action)} | ${escapeMd(r.issuer)} | ${escapeMd(r.type)} |`);
}
md.push('');
md.push('## 原始事件计数');
md.push('');
md.push('| 事件 | 次数 |');
md.push('|---|---:|');
for (const [type, count] of Object.entries(rawCounts).sort((a, b) => b[1] - a[1])) {
  md.push(`| ${escapeMd(type)} | ${count} |`);
}
md.push('');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, md.join('\n'), 'utf8');
fs.writeFileSync(JSON_OUT_FILE, JSON.stringify({
  outFile: OUT_FILE,
  jsonOutFile: JSON_OUT_FILE,
  targetIds: TARGET_IDS,
  targetNames: TARGET_IDS.map(getCharName),
  startDay,
  endBeforeDay,
  seed: SEED,
  rows,
  perPersonDay,
  actionCounts,
  rawCounts,
  problems: [...new Set(problems)],
  repeated,
  finalChars,
  finalFamilies,
}, null, 2), 'utf8');
const elapsedSec = (Date.now() - startedAtMs) / 1000;

console.log(JSON.stringify({
  outFile: OUT_FILE,
  jsonOutFile: JSON_OUT_FILE,
  rows: rows.length,
  elapsedSec,
  problems: [...new Set(problems)].slice(0, 12),
  repeated,
  finalChars,
}, null, 2));
