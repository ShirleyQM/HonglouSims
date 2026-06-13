/* ═══════════════════ RUNTIME ═══════════════════ */
let CONFIG = null;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
let VIEW_W = 960, VIEW_H = 504, CELL = 32;
let WORLD_COLS = 40, WORLD_ROWS = 25;

let CHARS = [], relations = {};
let WORLD = [], FURN_RT = {}, INST_MAP = {};
let camX = 0, camY = 0;
let selectedIdx = 0, gameHour = 8, gameMinute = 0, timeAcc = 0, gameDay = 1;
/** 1 游戏日 = 20 真实分钟；需求/关系按游戏分钟结算 */
const GAME_DAY_REAL_MIN = 20;
const GAME_MINUTES_PER_REAL_SEC = 1440 / (GAME_DAY_REAL_MIN * 60);
const NEED_DECAY_PER_GAME_MIN = 0.11;
const NEED_RESTORE_PER_GAME_MIN = 0.28;
let logs = [], hoverCell = null, hoverInst = null, mouseX = 0, mouseY = 0;
let speechBubble = null, uiDirty = true, previewPath = null;
let queuePage = 0, actionIdSeq = 1;
let interactionCooldowns = {};
let interactionOnceUsed = new Set();
let menuTargetIdx = -1;
let messageLog = [];
let gameLogs = [];
let logFilter = 'all';
let logUserScrolled = false;
let gameWeather = '晴';
let lastStatusScene = '';
let gamePeriod = 'morning';
const SHICHEN_NAMES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SEASON_LABELS = ['春','夏','秋','冬'];
const SEASON_ICONS = ['🌸','☀️','🍂','❄️'];
const WEATHER_ICONS = { '晴': '☀️', '阴': '🌫', '小雨': '🌧', '微风': '🌬', '雪': '❄️', '雾': '🌫' };
const SAVE_KEY = 'dgy_save';
const SAVE_VERSION = 2;
const TIME_PERIODS = [
  { id: 'dawn', label: '拂晓', minHour: 5 },
  { id: 'morning', label: '上午', minHour: 8 },
  { id: 'noon', label: '午后', minHour: 12 },
  { id: 'dusk', label: '黄昏', minHour: 17 },
  { id: 'night', label: '夜', minHour: 21 },
];

const EventBus = (() => {
  const listeners = {};
  return {
    on(type, fn) {
      (listeners[type] ||= []).push(fn);
      return () => EventBus.off(type, fn);
    },
    off(type, fn) {
      const arr = listeners[type];
      if (!arr) return;
      const i = arr.indexOf(fn);
      if (i >= 0) arr.splice(i, 1);
    },
    emit(type, payload = {}) {
      const evt = { type, ...payload, gameDay, gameHour, gameMinute, gamePeriod };
      (listeners[type] || []).slice().forEach(fn => { try { fn(evt); } catch (e) { console.warn(e); } });
      (listeners['*'] || []).slice().forEach(fn => { try { fn(evt); } catch (e) { console.warn(e); } });
    },
  };
})();

function getGameTimestamp() { return gameDay * 1440 + gameHour * 60 + gameMinute; }

function getTimePeriod(h = gameHour) {
  let p = TIME_PERIODS[0];
  for (const tp of TIME_PERIODS) if (h >= tp.minHour) p = tp;
  return p;
}

function getPeriodLabel(id = gamePeriod) {
  return TIME_PERIODS.find(p => p.id === id)?.label || id;
}

function tplName(templateId) {
  return (CONFIG.questConfig || DEFAULT_CONFIG.questConfig).templates?.[templateId]?.name || ('任务' + templateId);
}

function getGameMinuteDelta(realDt) { return realDt * GAME_MINUTES_PER_REAL_SEC; }

function advanceGameTime(minutes) {
  const oldHour = gameHour, oldDay = gameDay, oldPeriod = gamePeriod;
  gameMinute += minutes;
  while (gameMinute >= 60) {
    gameMinute -= 60;
    gameHour++;
    if (gameHour >= 24) { gameHour = 0; gameDay++; }
  }
  gamePeriod = getTimePeriod().id;
  EventBus.emit('time:tick', { minutes, hour: gameHour, minute: gameMinute, day: gameDay, period: gamePeriod });
  if (gameHour !== oldHour)
    EventBus.emit('time:hour', { hour: gameHour, day: gameDay, period: gamePeriod, oldHour });
  if (gameDay !== oldDay) {
    EventBus.emit('time:day', { day: gameDay, oldDay });
    onNewDay();
  }
  if (gamePeriod !== oldPeriod)
    EventBus.emit('time:period', { period: gamePeriod, label: getPeriodLabel(), oldPeriod });
  onAITimeAdvanced(minutes);
}

function getShichenLabel(h = gameHour) {
  const idx = Math.floor(((h + 1) % 24) / 2) % 12;
  return SHICHEN_NAMES[idx] + '时';
}

function getSeasonLabel() {
  return SEASON_LABELS[Math.floor(gameDay / 90) % 4];
}

function rollWeather() {
  const opts = ['晴', '阴', '小雨', '微风'];
  gameWeather = opts[Math.floor(Math.random() * opts.length)];
}

function onNewDay() {
  rollWeather();
  log(`第${gameDay}日，大观园又一日。`);
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function eventCategory(type) {
  if (!type) return 'system';
  if (type.startsWith('quest:')) return 'task';
  if (type.startsWith('interaction') || type.startsWith('relation') || type.startsWith('emotion')
    || type.startsWith('observer') || type.startsWith('bubble') || type.startsWith('family:')) return 'social';
  return 'system';
}

function formatLogTimeLabel() {
  return getShichenLabel() + ' · ' + getPeriodLabel();
}

function appendGameLog(entry) {
  gameLogs.unshift(entry);
  if (gameLogs.length > 200) gameLogs.pop();
  renderLogSidebar();
}

function renderLogSidebar() {
  const el = document.getElementById('log-list');
  if (!el) return;
  const atTop = el.scrollTop < 8;
  const filtered = gameLogs.filter(e => logFilter === 'all' || e.category === logFilter);
  el.innerHTML = filtered.map(e => {
    const warn = e.category === 'system' && /状态|危机|擅|拦|失败|无法/.test(e.text) ? ' warn' : '';
    return `<div class="log-entry cat-${e.category}">
      <div class="log-time">[${escapeHtml(e.timeLabel)}]</div>
      <div class="log-text${warn}">${escapeHtml(e.text)}</div></div>`;
  }).join('') || '<div class="col-empty" style="padding:8px">暂无消息</div>';
  if (!logUserScrolled && atTop) el.scrollTop = 0;
}

function migrateLogsToGameLogs(lines) {
  gameLogs = (lines || []).slice(0, 200).map(line => {
    const m = String(line).match(/^\[([^\]]+)\]\s*(.*)$/);
    const body = m ? m[2] : line;
    let category = 'system';
    if (/任务|⚠/.test(body)) category = 'task';
    else if (/💬|互动|关系|交谈/.test(body)) category = 'social';
    return { text: body, category, timeLabel: m ? m[1].slice(-8) : formatLogTimeLabel(), day: gameDay, hour: gameHour, minute: gameMinute };
  });
}

function tickGameTime(dt) {
  timeAcc += getGameMinuteDelta(dt);
  let steps = 0;
  while (timeAcc >= 1 && steps < 20) {
    timeAcc -= 1;
    advanceGameTime(1);
    steps++;
  }
}

function formatEventSummary(evt) {
  switch (evt.type) {
    case 'relation:change':
      return `关系 ${getChar(evt.idA)?.short}↔${getChar(evt.idB)?.short} ${evt.old}→${evt.new}`;
    case 'state:add':
      return `${getChar(evt.charId)?.short} 进入「${evt.stateName}」`;
    case 'interaction:complete':
      return `${getChar(evt.initiatorId)?.short}与${getChar(evt.targetId)?.short}「${evt.interactionName}」`;
    case 'memory:add':
      return `${getChar(evt.charId)?.short} 记忆「${evt.text}」`;
    case 'queue:add':
      return `${getChar(evt.charId)?.short} 队列+ ${evt.itemName}`;
    case 'time:day':
      return `进入第${evt.day}日`;
    case 'time:period':
      return `时辰：${evt.label}`;
    case 'save:done':
      return '进度已自动存档';
    case 'save:loaded':
      return '读取存档成功';
    case 'ai:decision':
      return `${getChar(evt.charId)?.short} AI→${evt.action}`;
    case 'need:crisis':
      return `${getChar(evt.charId)?.short} 需求危机(${evt.needKey})`;
    case 'bubble:show':
      return `${getChar(evt.charId)?.short}：${(evt.text || '').slice(0, 12)}…`;
    case 'family:switched':
      return `切换家庭 → ${evt.familyName || evt.familyId}`;
    case 'family:fund_changed':
      return `公库 ${evt.amount > 0 ? '+' : ''}${evt.amount}（${evt.reason}）余${Math.round(evt.balance)}`;
    case 'family:event':
      return `${FamilySystem.getFamily(evt.familyId)?.name || ''} 触发「${evt.eventName}」`;
    case 'observer:triggered':
      return `${getChar(evt.observerId)?.short} 察觉 ${getChar(evt.observedId)?.short}（反应#${evt.reactionId}）`;
    case 'observer:executed':
      return `${getChar(evt.observerId)?.short} 做出反应 #${evt.reactionId}`;
    case 'emotion:contagion':
      return `${getChar(evt.sourceId)?.short} 的情绪传给了 ${getChar(evt.targetId)?.short}`;
    case 'emotion:resisted':
      return `情绪未传染：${getChar(evt.sourceId)?.short}→${getChar(evt.targetId)?.short}`;
    case 'interaction:started':
      return `${getChar(evt.initiatorId)?.short} 开始「${evt.interactionName}」对 ${getChar(evt.targetId)?.short}`;
    case 'quest:issued':
      return `任务下发：${tplName(evt.templateId)} → ${getChar(evt.assigneeId)?.short || evt.assigneeId}`;
    case 'quest:accepted':
      return `${getChar(evt.assigneeId)?.short} 接受「${tplName(evt.templateId)}」`;
    case 'quest:completed':
      return `${getChar(evt.assigneeId)?.short} 完成「${tplName(evt.templateId)}」`;
    case 'quest:failed':
      return `${getChar(evt.assigneeId)?.short} 失败「${tplName(evt.templateId)}」${evt.reason ? '：' + evt.reason : ''}`;
    case 'quest:declined':
      return `${getChar(evt.assigneeId)?.short} 拒绝「${tplName(evt.templateId)}」`;
    case 'quest:expired':
      return `任务待回应过期（#${evt.instanceId}）`;
    case 'quest:progress':
      return `任务进度 #${evt.instanceId}：${evt.progress}/${evt.target}`;
    default:
      return evt.message || evt.type;
  }
}

function initEventSystem() {
  messageLog = [];
  if (!gameLogs.length) {
    appendGameLog({
      text: '点击人物选互动；点击场景行走/用家具。Shift+点击插队。',
      category: 'system', timeLabel: formatLogTimeLabel(), day: gameDay, hour: gameHour, minute: gameMinute,
    });
  }
  EventBus.on('*', evt => {
    if (evt.type === 'log:add' || evt.type === 'time:tick') return;
    const summary = formatEventSummary(evt);
    messageLog.unshift({
      type: evt.type,
      summary,
      day: evt.gameDay,
      hour: evt.gameHour,
      minute: evt.gameMinute,
    });
    if (messageLog.length > 200) messageLog.pop();
    const cat = eventCategory(evt.type);
    let text = summary;
    if (cat === 'task') text = '⚠ ' + text;
    else if (evt.type === 'bubble:show') text = '💬 ' + text;
    appendGameLog({
      text, category: cat, timeLabel: formatLogTimeLabel(),
      day: evt.gameDay, hour: evt.gameHour, minute: evt.gameMinute,
    });
  });
  let saveTimer = null;
  const scheduleAutoSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveGameToStorage(true), 2500);
  };
  ['relation:change', 'interaction:complete', 'time:day', 'memory:add',
    'quest:issued', 'quest:accepted', 'quest:completed', 'quest:failed', 'quest:declined'].forEach(t =>
    EventBus.on(t, scheduleAutoSave));
}


function getNeedDefs() { return CONFIG.needDefs; }

function updateCamera(instant) {
  const c = CHARS[selectedIdx];
  if (!c) return;
  const tx = Math.max(0, Math.min(c.x - VIEW_W / 2, WORLD_COLS * CELL - VIEW_W));
  const ty = Math.max(0, Math.min(c.y - VIEW_H / 2, WORLD_ROWS * CELL - VIEW_H));
  if (instant) { camX = tx; camY = ty; }
  else { camX += (tx - camX) * 0.08; camY += (ty - camY) * 0.08; }
  const sc = sceneAt(Math.floor(c.gridCol), Math.floor(c.gridRow));
  if (sc) {
    const el = document.getElementById('scene-label');
    if (el) el.textContent = sc.name;
  }
}

function resizeCanvas() {
  const view = document.getElementById('main-view');
  if (!view) return;
  VIEW_W = Math.max(640, view.clientWidth);
  VIEW_H = Math.max(360, view.clientHeight);
  canvas.width = VIEW_W;
  canvas.height = VIEW_H;
  ctx.imageSmoothingEnabled = false;
}

window.addEventListener('resize', () => { resizeCanvas(); updateCamera(true); });

