/* Independent 3D presentation entry. Keeps the original 2D index untouched. */
const SIM_STEP_SEC_3D = 0.05;
const MAX_SIM_STEPS_PER_FRAME_3D = 20;
let lastTime3D = 0;
let simBacklog3D = 0;
let hudTimer3D = 0;
let paused3D = false;
let threeLayer3D = null;
const feed3D = [];

function show3DError(err) {
  const el = document.getElementById('err-overlay');
  if (!el) return;
  el.style.display = 'block';
  el.textContent = String(err?.stack || err || '3D 表现层启动失败');
}

function buildUI() {
  renderHud3D();
}

function openPanel(html) {
  pushFeed3D(String(html || '').replace(/<[^>]+>/g, '').slice(0, 80));
}

function closeInteractionMenu() {}

function selectChar(i) {
  if (i < 0 || i >= CHARS.length) return;
  const prev = selectedIdx;
  if (prev !== i && CHARS[prev]) resumeCharAI(CHARS[prev]);
  selectedIdx = i;
  pauseCharAI(CHARS[i]);
  uiDirty = true;
  log(`选中${CHARS[i].name}。`);
}

function pushFeed3D(text) {
  if (!text) return;
  feed3D.unshift(text);
  feed3D.length = Math.min(feed3D.length, 8);
  const el = document.getElementById('feed3d');
  if (el) el.innerHTML = feed3D.map(row => `<div class="feed-item">${escapeHtml(row)}</div>`).join('');
}

function renderHud3D() {
  const c = CHARS[selectedIdx];
  const time = `第${gameDay}日 ${String(gameHour).padStart(2, '0')}:${String(Math.floor(gameMinute)).padStart(2, '0')} · ${getPeriodLabel()}`;
  document.getElementById('hud-time').textContent = time;
  document.getElementById('hud-char').textContent = c ? `${c.name}（${getScene(c.sceneId)?.name || ''}）` : '-';
  document.getElementById('hud-status').textContent = c?.statusText || '-';
  document.getElementById('hud-queue').textContent = c?.actionQueue?.map(a => a.name).join(' / ') || '暂无';
  const needs = document.getElementById('hud-needs');
  if (needs && c) {
    needs.innerHTML = getNeedDefs().slice(0, 6).map(nd => {
      const val = Math.round(c.needs?.[nd.key] ?? 0);
      return `<div class="need"><b>${escapeHtml(nd.label || nd.name)}</b><span>${val}</span></div>`;
    }).join('');
  }
}

function init3DEvents() {
  EventBus.on('*', evt => {
    if (['ai:decision', 'interaction:complete', 'quest:issued', 'quest:completed', 'quest:failed', 'state:add', 'need:crisis'].includes(evt.type)) {
      const text = formatEventSummary(evt);
      if (text) pushFeed3D(text);
    }
  });
  document.getElementById('btn-3d-follow').onclick = () => {
    threeLayer3D?.setFollow(true);
    pushFeed3D('镜头跟随选中人物');
  };
  document.getElementById('btn-3d-free').onclick = () => {
    threeLayer3D?.setFollow(false);
    pushFeed3D('自由镜头');
  };
  document.getElementById('btn-3d-xiaoxiang').onclick = () => threeLayer3D?.focusScene(1);
  document.getElementById('btn-3d-pause').onclick = e => {
    paused3D = !paused3D;
    e.currentTarget.textContent = paused3D ? '继续' : '暂停';
    pushFeed3D(paused3D ? '模拟已暂停' : '模拟继续');
  };
}

function enqueueMoveFrom3D(g, event) {
  const c = CHARS[selectedIdx];
  const cell = WORLD[g.col]?.[g.row];
  if (!c || !cell?.walkable) return;
  enqueueAction(c, makeMoveItem(g.col, g.row), !!event?.shiftKey);
  renderHud3D();
}

function selectCharFrom3D(charId) {
  const idx = CHARS.findIndex(c => c.id === charId);
  if (idx >= 0) selectChar(idx);
  renderHud3D();
}

function openFurnitureFrom3D(instanceId) {
  const inst = getInstance(instanceId);
  const tpl = inst ? getTemplate(inst.templateId) : null;
  if (!inst || !tpl) return;
  pushFeed3D(`${CHARS[selectedIdx]?.short || '角色'} 查看 ${tpl.name}`);
}

function updateSimulation3D(dt) {
  tickGameTime(dt);
  CHARS.forEach(c => {
    updateStates(c, dt);
    decayNeeds(c, dt);
    updateAction(c, dt);
    updateQueueWait(c, dt);
    c.animTime = (c.animTime || 0) + dt;
  });
  processUrgentRetries();
  tickRelationDecay(dt);
  NarrativeBubbleSystem.update(dt);
  uiDirty = true;
  hudTimer3D += dt;
}

function loop3D(ts) {
  if (!lastTime3D) lastTime3D = ts;
  const elapsed = Math.max(0, (ts - lastTime3D) / 1000);
  lastTime3D = ts;
  if (!document.hidden && !paused3D) simBacklog3D += elapsed;
  let steps = 0;
  while (simBacklog3D >= SIM_STEP_SEC_3D && steps < MAX_SIM_STEPS_PER_FRAME_3D) {
    simBacklog3D -= SIM_STEP_SEC_3D;
    updateSimulation3D(SIM_STEP_SEC_3D);
    steps++;
  }
  if (uiDirty || hudTimer3D > 0.35) { hudTimer3D = 0; uiDirty = false; renderHud3D(); }
  threeLayer3D?.update(elapsed, CHARS[selectedIdx]?.id);
  threeLayer3D?.render();
  requestAnimationFrame(loop3D);
}

async function start3D() {
  CONFIG = loadConfig();
  if (!CONFIG?.scenes?.length || !CONFIG?.furnitureInstances?.length) {
    CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    migrateConfig(CONFIG);
  }
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
  ReputationDomainSystem?.init?.();
  LifePathSystem?.init?.();
  FortuneSystem?.init?.();
  CharSpecialtySystem.init();
  MultiInteractSystem.init();
  CoreNeedSystem?.init?.();
  NeedAdaptationSystem?.init?.();
  BehaviorDailyStats?.init?.();
  HealthSystem?.init?.();
  DreamProgressStore?.init?.();
  initAISystem();
  FurnitureReactionSystem?.init?.();
  BehaviorTelemetry?.init?.();
  NeedStateSystem?.init?.();
  LifePathSystem?.tryIssueStoryQuestsAll?.();
  const headIdx = CHARS.findIndex(c => c.id === FamilySystem.getFirstMemberCharId());
  if (headIdx >= 0) selectedIdx = headIdx;
  pauseCharAI(CHARS[selectedIdx]);
  CHARS.forEach(c => { if (isAIControlled(c) && c.ai.state === AI_STATE.IDLE) slowChannelTick(c); });
  init3DEvents();

  const mod = await import('./three-ai-renderer.js?v=20260621-1');
  threeLayer3D = mod.createThreeAIRenderer({
    container: document.getElementById('stage3d'),
    config: CONFIG,
    getChars: () => CHARS,
    onGroundClick: enqueueMoveFrom3D,
    onCharClick: selectCharFrom3D,
    onFurnitureClick: openFurnitureFrom3D,
  });
  renderHud3D();
  pushFeed3D('AI 3D 表现层已启动');
  requestAnimationFrame(loop3D);
}

document.addEventListener('visibilitychange', () => {
  lastTime3D = performance.now();
  if (document.hidden) simBacklog3D = 0;
});

start3D().catch(show3DError);
