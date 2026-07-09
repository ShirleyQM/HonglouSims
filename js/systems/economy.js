/* ═══════════════════ SIMPLE ECONOMY (当值·月银·饭钱) ═══════════════════ */
const EconomySystem = (() => {
  const FOOD_CATEGORIES = new Set(['meal', 'snack', 'kitchen', 'table']);
  let shifts = {};
  let processedAllowanceMonths = {};
  let unsubs = [];

  function cfg() {
    return CONFIG.moneyConfig?.economy || DEFAULT_CONFIG.moneyConfig?.economy || {};
  }

  function worker(charId) {
    return (cfg().workers || []).find(row => row.charId === charId);
  }

  function familyOf(charId) {
    return FamilySystem?.findFamilyOfChar?.(charId) || null;
  }

  function foodChargesEnabled() {
    return cfg().foodChargesEnabled !== false;
  }

  function foodPersonalSpendingEnabled() {
    return cfg().foodPersonalSpendingEnabled !== false;
  }

  function foodCost(category) {
    if (!foodChargesEnabled()) return 0;
    if (!FOOD_CATEGORIES.has(category)) return 0;
    return Math.max(0, Math.round(cfg().foodCosts?.[category] || 0));
  }

  function questEconomyCfg() {
    return cfg().questEconomy || {};
  }

  function questCategoryCost(tpl) {
    const costs = questEconomyCfg().categoryIssueCosts || {};
    return Math.max(0, Math.round(tpl?.issueCost ?? costs[tpl?.category] ?? 0));
  }

  function questAdjustmentOptions() {
    const defaults = [
      { id: 'none', label: '不赏不罚', issueDelta: 0, reward: 0, fine: 0, desc: '只按任务本身结算关系和状态。' },
      { id: 'reward_small', label: '小赏', issueDelta: 0, reward: 5, fine: 0, desc: '完成后从下发者公账赏给执行者家庭。' },
      { id: 'reward_large', label: '重赏', issueDelta: 0, reward: 15, fine: 0, desc: '完成后重赏，适合紧急或体面差事。' },
      { id: 'fine_on_fail', label: '失败扣罚', issueDelta: 0, reward: 0, fine: 6, desc: '失败/超时时从执行者家庭扣给下发者家庭。' },
    ];
    const byId = new Map(defaults.map(row => [row.id, row]));
    for (const row of questEconomyCfg().adjustmentOptions || []) {
      if (!row?.id) continue;
      byId.set(row.id, { ...(byId.get(row.id) || {}), ...row });
    }
    return [...byId.values()];
  }

  function normalizeAdjustment(adjustment) {
    if (!adjustment) return questAdjustmentOptions()[0];
    if (typeof adjustment === 'string') return questAdjustmentOptions().find(o => o.id === adjustment) || questAdjustmentOptions()[0];
    return questAdjustmentOptions().find(o => o.id === adjustment.id) || { ...questAdjustmentOptions()[0], ...adjustment };
  }

  function questIssueCost(tpl, targetCount = 1, adjustment = 'none') {
    const base = questCategoryCost(tpl) * Math.max(1, targetCount || 1);
    const adj = normalizeAdjustment(adjustment);
    return Math.max(0, Math.round(base + (adj.issueDelta || 0) * Math.max(1, targetCount || 1)));
  }

  function canIssueQuestEconomy(issuerId, tpl, targetCount = 1, adjustment = 'none') {
    const cost = questIssueCost(tpl, targetCount, adjustment);
    if (!cost) return { ok: true, cost: 0 };
    const family = familyOf(issuerId);
    if (!family) return { ok: false, cost, reason: '下发者未归入家庭，无法支取公账' };
    const balance = FamilySystem.getFund(family.id);
    if (balance < cost) return { ok: false, cost, familyId: family.id, balance, reason: `公账不足（需${cost}两，现有${balance}两）` };
    return { ok: true, cost, familyId: family.id, balance };
  }

  function applyQuestIssueCost({ issuerId, templateId, targetCount = 1, adjustment = 'none' } = {}) {
    const tpl = (CONFIG.questConfig || DEFAULT_CONFIG.questConfig)?.templates?.[templateId];
    const check = canIssueQuestEconomy(issuerId, tpl, targetCount, adjustment);
    if (!check.ok || !check.cost) return check.ok ? { ok: true, cost: 0 } : check;
    const issuer = getChar(issuerId);
    const paid = FamilySystem.withdrawFund(check.familyId, check.cost, `${issuer?.short || '某人'}下发「${tpl?.name || templateId}」`);
    EventBus.emit('economy:quest_cost', {
      charId: issuerId, issuerId, familyId: check.familyId,
      templateId, quest: tpl?.name || '', category: tpl?.category || '',
      targetCount, adjustmentId: normalizeAdjustment(adjustment).id,
      amount: paid,
    });
    return { ok: !!paid || !check.cost, cost: paid, familyId: check.familyId };
  }

  function transferBetweenFamilies(fromFamilyId, toFamilyId, amount, reason) {
    amount = Math.max(0, Math.round(amount || 0));
    if (!amount || !fromFamilyId || !toFamilyId || fromFamilyId === toFamilyId) return 0;
    if (FamilySystem.transferFund(fromFamilyId, toFamilyId, amount, reason)) return amount;
    const actual = FamilySystem.withdrawFund(fromFamilyId, amount, reason);
    if (actual) FamilySystem.depositFund(toFamilyId, actual, reason);
    return actual;
  }

  function applyQuestCompletionEconomy(inst, tpl, outcome = {}) {
    const adj = normalizeAdjustment(inst?.economyAdjustment || 'none');
    const issuerFamily = familyOf(inst?.issuerId);
    const assigneeFamily = familyOf(inst?.assigneeId);
    if (!issuerFamily || !assigneeFamily) return null;
    const status = outcome.status || inst?.status || '';
    const completed = status === 'completed';
    const failed = ['failed', 'expired'].includes(status);
    if (completed && adj.reward > 0) {
      const amount = transferBetweenFamilies(issuerFamily.id, assigneeFamily.id, adj.reward, `${tpl?.name || '任务'}赏钱`);
      if (amount) {
        EventBus.emit('economy:quest_reward', {
          charId: inst.assigneeId, issuerId: inst.issuerId, assigneeId: inst.assigneeId,
          fromFamilyId: issuerFamily.id, targetFamilyId: assigneeFamily.id,
          templateId: inst.templateId, quest: tpl?.name || '', adjustmentId: adj.id,
          amount,
        });
      }
      return amount;
    }
    if (failed && adj.fine > 0) {
      const amount = transferBetweenFamilies(assigneeFamily.id, issuerFamily.id, adj.fine, `${tpl?.name || '任务'}扣罚`);
      if (amount) {
        EventBus.emit('economy:quest_fine', {
          charId: inst.assigneeId, issuerId: inst.issuerId, assigneeId: inst.assigneeId,
          fromFamilyId: assigneeFamily.id, targetFamilyId: issuerFamily.id,
          templateId: inst.templateId, quest: tpl?.name || '', adjustmentId: adj.id,
          amount,
        });
      }
      return amount;
    }
    return null;
  }

  function canUseFurniture(c, tpl) {
    const cost = foodCost(tpl?.category);
    if (!cost) return true;
    const family = familyOf(c?.id);
    if (!family) return '未归入家庭，无法记饭钱';
    if (c?.ai?.urgentNeed === 'hunger') return true;
    if (FamilySystem.getFund(family.id) < cost) return `公中银两不足（需${cost}两）`;
    return true;
  }

  function chargeFood(evt) {
    const cost = foodCost(evt.category);
    if (!cost) return;
    const c = getChar(evt.charId);
    const family = familyOf(evt.charId);
    if (!c || !family) return;
    const paid = FamilySystem.withdrawFund(family.id, cost, `${c.short}饮食`);
    if (!paid) return;
    EventBus.emit('economy:food_paid', {
      charId: c.id, familyId: family.id, amount: paid,
      category: evt.category, templateId: evt.templateId,
    });
  }

  function enqueueWork(c, row) {
    const inst = getInstance(row.workplaceInstanceId);
    if (!inst || c.actionQueue?.some(item => item.instanceId === inst.instanceId)) return;
    const item = makeFurnitureItem(inst);
    item.economyWork = true;
    item.priority = 20;
    enqueueAction(c, item, !c.action);
  }

  function findHomeCell(c) {
    const family = familyOf(c.id);
    const sc = getScene(family?.residenceSceneId);
    if (!sc) return null;
    const centerCol = Math.round(sc.originCol + sc.cols / 2);
    const centerRow = Math.round(sc.originRow + sc.rows / 2);
    for (let radius = 0; radius < Math.max(sc.cols, sc.rows); radius++) {
      for (let dc = -radius; dc <= radius; dc++) {
        for (let dr = -radius; dr <= radius; dr++) {
          const col = centerCol + dc, row = centerRow + dr;
          if (col < sc.originCol || col >= sc.originCol + sc.cols) continue;
          if (row < sc.originRow || row >= sc.originRow + sc.rows) continue;
          const cell = WORLD[col]?.[row];
          if (cell?.walkable && !cell.entryFor && !charAtCell(col, row, [c.id])) return { col, row };
        }
      }
    }
    return null;
  }

  function startShift(row, day = gameDay) {
    const c = getChar(row.charId);
    if (!c || shifts[c.id]?.startedDay === day) return false;
    shifts[c.id] = { working: true, startedDay: day, paidDay: shifts[c.id]?.paidDay || 0 };
    c.statusText = `上班·${row.workName || '当值'}`;
    if (c.ai?.cache) c.ai.cache.dirty = true;
    enqueueWork(c, row);
    EventBus.emit('economy:shift_started', {
      charId: c.id, familyId: familyOf(c.id)?.id, wage: row.dailyWage,
      workplaceSceneId: row.workplaceSceneId, workName: row.workName,
    });
    log(`${c.short}${row.startHour}时上班，去${row.workName || '当值'}。`);
    return true;
  }

  function endShift(row, day = gameDay) {
    const c = getChar(row.charId);
    const shift = shifts[row.charId];
    if (!c || !shift?.working || shift.startedDay !== day) return false;
    shift.working = false;
    const family = familyOf(c.id);
    const wage = Math.max(0, Math.round(row.dailyWage || 0));
    if (family && wage && shift.paidDay !== day) {
      FamilySystem.depositFund(family.id, wage, `${c.short}当日工钱`);
      shift.paidDay = day;
    }
    c.statusText = '下班归家';
    const home = findHomeCell(c);
    if (home) enqueueAction(c, makeMoveItem(home.col, home.row), !c.action);
    if (c.ai?.cache) c.ai.cache.dirty = true;
    EventBus.emit('economy:shift_ended', {
      charId: c.id, familyId: family?.id, wage, workName: row.workName,
    });
    log(`${c.short}${row.endHour}时下班，${family?.name || '家中'}入账${wage}两。`);
    return true;
  }

  function onHour(evt) {
    for (const row of cfg().workers || []) {
      if (evt.hour === row.startHour) startShift(row, evt.day);
      if (evt.hour === row.endHour) endShift(row, evt.day);
    }
  }

  function distributeAllowance(issuerId, targetFamilyId, amount, note = '发放月银') {
    const issuer = getChar(issuerId);
    if (!issuer || !['wangfuren', 'xifeng'].includes(issuerId)) return false;
    const fromFamily = familyOf(issuerId);
    if (!fromFamily || !FamilySystem.getFamily(targetFamilyId)) return false;
    amount = Math.max(0, Math.round(amount || 0));
    if (!FamilySystem.transferFund(fromFamily.id, targetFamilyId, amount, note)) return false;
    EventBus.emit('economy:allowance_paid', {
      charId: issuerId, issuerId, fromFamilyId: fromFamily.id,
      targetFamilyId, amount, note,
    });
    return true;
  }

  function allowancePlansForIssuer(issuerId) {
    return (cfg().monthlyAllowances || []).filter(row => row.issuerId === issuerId);
  }

  function runAllowanceForIssuer(issuerId) {
    let paid = 0;
    for (const row of allowancePlansForIssuer(issuerId)) {
      if (distributeAllowance(row.issuerId, row.targetFamilyId, row.amount, row.note)) paid++;
    }
    if (paid) log(`${getChar(issuerId)?.short || '管账人'}发放月银，共${paid}笔。`);
    return paid;
  }

  function runMonthlyAllowances(day = gameDay) {
    const month = Math.floor((day - 1) / 30) + 1;
    const dayOfMonth = ((day - 1) % 30) + 1;
    if (dayOfMonth !== (cfg().monthlyAllowanceDay || 1) || processedAllowanceMonths[month]) return 0;
    let paid = 0;
    for (const row of cfg().monthlyAllowances || []) {
      if (distributeAllowance(row.issuerId, row.targetFamilyId, row.amount, row.note)) paid++;
    }
    processedAllowanceMonths[month] = true;
    if (paid) log(`本月月银已发放，共${paid}笔。`);
    return paid;
  }

  function extraCandidates(c, accessible) {
    const row = worker(c?.id);
    const shift = shifts[c?.id];
    if (!row || !shift?.working) return [];
    const inst = getInstance(row.workplaceInstanceId);
    if (!inst || (accessible && !accessible.has(inst.sceneId))) return [];
    return [{
      key: `economy:work:${c.id}`, kind: 'furniture', instanceId: inst.instanceId,
      tags: ['work', 'manage'], category: 'workdesk', baseWeight: 30,
      label: row.workName || '当值办公',
    }];
  }

  function serialize() {
    return {
      shifts: JSON.parse(JSON.stringify(shifts)),
      processedAllowanceMonths: { ...processedAllowanceMonths },
    };
  }

  function apply(state) {
    shifts = JSON.parse(JSON.stringify(state?.shifts || {}));
    processedAllowanceMonths = { ...(state?.processedAllowanceMonths || {}) };
  }

  function init() {
    unsubs.forEach(fn => fn?.());
    unsubs = [];
    shifts = {};
    processedAllowanceMonths = {};
    unsubs.push(EventBus.on('time:hour', onHour));
    unsubs.push(EventBus.on('time:day', evt => runMonthlyAllowances(evt.day)));
    unsubs.push(EventBus.on('furniture:complete', chargeFood));
  }

  return {
    init, cfg, foodCost, foodChargesEnabled, foodPersonalSpendingEnabled,
    canUseFurniture, extraCandidates,
    questAdjustmentOptions, questIssueCost, canIssueQuestEconomy,
    applyQuestIssueCost, applyQuestCompletionEconomy,
    startShift, endShift, distributeAllowance, runMonthlyAllowances,
    allowancePlansForIssuer, runAllowanceForIssuer,
    serialize, apply,
  };
})();
window.EconomySystem = EconomySystem;
