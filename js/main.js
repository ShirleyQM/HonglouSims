/* ═══════════════════ LOOP ═══════════════════ */
const SIM_STEP_SEC = 0.05;
const MAX_SIM_STEPS_PER_FRAME = 6;
let lastTime = 0, simBacklog = 0, uiTimer = 0;

function updateSimulation(dt) {
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
  updateCamera(false);
  uiTimer += dt;
}

function loop(ts) {
  if (!lastTime) lastTime = ts;
  const elapsed = Math.max(0, (ts - lastTime) / 1000);
  lastTime = ts;
  if (!document.hidden) simBacklog += elapsed;
  simBacklog = Math.min(simBacklog, SIM_STEP_SEC * MAX_SIM_STEPS_PER_FRAME);
  let steps = 0;
  while (simBacklog >= SIM_STEP_SEC && steps < MAX_SIM_STEPS_PER_FRAME) {
    simBacklog -= SIM_STEP_SEC;
    updateSimulation(SIM_STEP_SEC);
    steps++;
  }
  if (uiDirty || uiTimer > 0.35) { uiTimer = 0; buildUI(); }
  drawWorld();
  drawFurnitureInstances();
  drawPathPreview();
  drawSocialLinks();
  CHARS.forEach((c, i) => drawChar(c, i === selectedIdx));
  drawSpeechBubble();
  NarrativeBubbleSystem.draw();
  if (hoverInst) {
    const inst = getInstance(hoverInst), tpl = getTemplate(inst.templateId);
    const nr = tpl.needRestores.map(r => getNeedDefs().find(n => n.key === r.need)?.label + '+' + r.ratePerGameMin + '/游戏分').join(' ');
    const life = getLifeLineTip(tpl);
    const skillNote = (!isEssentialFurniture(tpl) && tpl.skill) ? ` · 需${CONFIG.skillDefs[tpl.skill]?.name}` : (isEssentialFurniture(tpl) ? ' · 人人可用' : '');
    drawHoverTip(`${tpl.icon} ${tpl.name}${life ? ' [' + life + ']' : ''} ${tpl.duration}s · ${nr}${skillNote}`, mouseX, mouseY);
  } else if (hoverCell?.walkable && !hoverCell.entryFor) {
    const g = pixelToGrid(mouseX + camX, mouseY + camY);
    const sc = sceneAt(g.col, g.row);
    const pc = CHARS[selectedIdx];
    let tip = '点击行走';
    if (sc && pc) {
      const r = SceneAccessSystem.canEnterScene(pc, sc.id);
      const tl = SceneAccessSystem.cfg().sceneTypeLabels?.[sc.sceneType] || '';
      tip = `${sc.name}${tl ? '·' + tl : ''} — ${r.ok === true ? '可进入' : r.ok === 'attempt' ? '擅入会被拦' : '不可进入'}`;
    }
    drawHoverTip(tip, mouseX, mouseY);
  }
  requestAnimationFrame(loop);
}

document.addEventListener('visibilitychange', () => {
  lastTime = performance.now();
  if (document.hidden) simBacklog = 0;
});

CONFIG = loadConfig();
if (!CONFIG?.scenes?.length || !CONFIG?.furnitureInstances?.length) {
  console.warn('CONFIG incomplete, forcing defaults');
  CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  migrateConfig(CONFIG);
  try { localStorage.setItem('dgy_config', JSON.stringify(CONFIG)); } catch (e) {}
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
if (loadGameFromStorage()) log('已读取存档，继续游玩。');
else {
  log('新游戏：F切换家庭，点击人物选互动。若地图空荡，后台「导入导出」→ 恢复默认配置 → 应用并重载。');
  const headIdx = CHARS.findIndex(c => c.id === FamilySystem.getFirstMemberCharId());
  if (headIdx >= 0) selectChar(headIdx);
  setTimeout(() => FamilySystem.showIntroBubbles(FamilySystem.getCurrentFamilyId()), 800);
}
NeedStateSystem?.init?.();
LifePathSystem?.tryIssueStoryQuestsAll?.();
pauseCharAI(CHARS[selectedIdx]);
CHARS.forEach(c => { if (isAIControlled(c) && c.ai.state === AI_STATE.IDLE) slowChannelTick(c); });
initLogSidebar();
buildUI();
AssetSystem.preload();
requestAnimationFrame(loop);
