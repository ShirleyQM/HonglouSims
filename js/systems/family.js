const FamilySystem = (() => {
  let currentFamilyId = 1;
  let funds = {};
  let fundLog = {};
  let enabled = true;
  let unsubs = [];

  function cfg() { return CONFIG.familyConfig || DEFAULT_CONFIG.familyConfig; }
  function families() { return cfg().families || []; }

  function getFamily(id) { return families().find(f => f.id === id); }
  function getCurrentFamily() { return getFamily(currentFamilyId); }
  function getCurrentFamilyId() { return currentFamilyId; }

  function membersSorted(family) {
    return [...(family.members || [])].sort((a, b) =>
      (FAMILY_ROLE_ORDER[a.role] || 99) - (FAMILY_ROLE_ORDER[b.role] || 99));
  }

  function getMemberIds(familyId) {
    const f = getFamily(familyId ?? currentFamilyId);
    if (!f) return [];
    return membersSorted(f).map(m => m.charId).filter(id => getChar(id));
  }

  function getFirstMemberCharId(familyId) {
    const f = getFamily(familyId ?? currentFamilyId);
    if (!f) return null;
    const m = membersSorted(f).find(mem => getChar(mem.charId));
    return m?.charId || null;
  }

  function getCharRole(charId, familyId) {
    const f = getFamily(familyId ?? currentFamilyId);
    return f?.members?.find(m => m.charId === charId)?.role || null;
  }

  function getHeadCharId(familyId) {
    const f = getFamily(familyId ?? currentFamilyId);
    const head = f?.members?.find(m => m.role === '家主' && getChar(m.charId));
    return head?.charId || getFirstMemberCharId(familyId);
  }

  function findFamilyOfChar(charId) {
    return families().find(f => f.members?.some(m => m.charId === charId));
  }

  function sameFamily(idA, idB) {
    for (const f of families()) {
      const ids = f.members.map(m => m.charId);
      if (ids.includes(idA) && ids.includes(idB)) return f;
    }
    return null;
  }

  function getRelationMultiplier(idA, idB, delta) {
    if (!enabled || !delta) return 1;
    const fam = sameFamily(idA, idB);
    if (!fam) return 1;
    const roleA = getCharRole(idA, fam.id);
    const roleB = getCharRole(idB, fam.id);
    const bonus = cfg().relationBonus || {};
    const pos = delta > 0;
    if ((roleA === '家主' && roleB === '配偶') || (roleA === '配偶' && roleB === '家主')) {
      const b = bonus.spouse || { positive: 1.3, negative: 0.8 };
      return pos ? b.positive : b.negative;
    }
    if (((roleA === '家主' || roleA === '长辈') && roleB === '子女') ||
        ((roleB === '家主' || roleB === '长辈') && roleA === '子女')) {
      const b = bonus.parentChild || { positive: 1.2, negative: 1.1 };
      return pos ? b.positive : b.negative;
    }
    if (roleA === '手足' && roleB === '手足') {
      const b = bonus.sibling || { positive: 1.15, negative: 1.0 };
      return pos ? b.positive : b.negative;
    }
    if ((roleA === '家主' && roleB === '仆从') || (roleA === '仆从' && roleB === '家主')) {
      const b = bonus.masterServant || { positiveMaster: 1.1, positiveServant: 1.2, negative: 1.0 };
      if (!pos) return b.negative ?? 1;
      return roleA === '仆从' ? (b.positiveServant ?? 1.2) : (b.positiveMaster ?? 1.1);
    }
    return 1;
  }

  function buildIntroText(member, family) {
    const c = getChar(member.charId);
    const def = getCharDef(member.charId);
    const name = c?.short || member.charId;
    const comment = def?.shortComment || '';
    const role = member.role;
    const fname = family.name;
    if (role === '家主') return `家主·${name} —— ${comment}`;
    if (role === '配偶') return `${name} —— 家主之妻`;
    if (role === '长辈') return `${name} —— 家中长辈`;
    if (role === '手足') return `${name} —— 家主之昆仲`;
    if (role === '子女') return `${name} —— 家主之女`;
    if (role === '门客') return `${name} —— 寄居于此`;
    if (role === '仆从') return `${name} —— ${fname}的丫鬟`;
    return `${name} —— ${comment}`;
  }

  function showFamilyBubbles(familyId) {
    const f = getFamily(familyId);
    if (!f || !NarrativeBubbleSystem?.showBubble) return;
    const sorted = [...(f.members || [])].sort((a, b) =>
      (FAMILY_ROLE_ORDER[a.role] || 99) - (FAMILY_ROLE_ORDER[b.role] || 99));
    const interval = cfg().switchBubbleInterval ?? 0.8;
    const duration = cfg().switchBubbleDuration ?? 3;
    sorted.forEach((m, i) => {
      setTimeout(() => {
        if (!getChar(m.charId)) return;
        NarrativeBubbleSystem.showBubble({
          charId: m.charId,
          text: buildIntroText(m, f),
          style: 'speech',
          module: 'family',
          duration,
        });
      }, i * interval * 1000);
    });
  }

  function panCameraToResidence(familyId) {
    const f = getFamily(familyId);
    if (!f) return;
    const headId = getHeadCharId(familyId);
    const head = getChar(headId);
    if (head) {
      const idx = CHARS.indexOf(head);
      if (idx >= 0) { selectedIdx = idx; updateCamera(true); return; }
    }
    const res = typeof ResidenceSystem !== 'undefined' ? ResidenceSystem.residenceOfFamily?.(f) : null;
    const sc = res?.sceneId ? getScene(res.sceneId) : getScene(f.residenceSceneId);
    if (!sc) return;
    const px = gridToPixel(sc.originCol + sc.cols / 2, sc.originRow + sc.rows / 2);
    const target = typeof clampCameraTarget === 'function'
      ? clampCameraTarget(px.x - VIEW_W / 2, px.y - VIEW_H / 2)
      : {
        x: Math.max(0, Math.min(px.x - VIEW_W / 2, WORLD_COLS * CELL - VIEW_W)),
        y: Math.max(0, Math.min(px.y - VIEW_H / 2, WORLD_ROWS * CELL - VIEW_H)),
      };
    camX = target.x;
    camY = target.y;
  }

  function switchFamily(newFamilyId) {
    if (!getFamily(newFamilyId) || newFamilyId === currentFamilyId) return false;
    const prevFamilyId = currentFamilyId;
    currentFamilyId = newFamilyId;
    const firstId = getFirstMemberCharId(newFamilyId);
    const targetIdx = firstId ? CHARS.findIndex(c => c.id === firstId) : -1;
    if (targetIdx >= 0) selectChar(targetIdx);
    panCameraToResidence(newFamilyId);
    showFamilyBubbles(newFamilyId);
    uiDirty = true;
    buildUI();
    const fam = getFamily(newFamilyId);
    EventBus.emit('family:switched', { familyId: newFamilyId, prevFamilyId, familyName: fam?.name });
    log(`切换至${fam?.name || '家庭'}，操控${getChar(firstId)?.short || '成员'}。`);
    return true;
  }

  function getFund(familyId) { return funds[familyId] ?? getFamily(familyId)?.fund ?? 0; }

  function depositFund(familyId, amount, reason) {
    amount = Math.max(0, Math.round(amount || 0));
    if (!amount) return 0;
    funds[familyId] = getFund(familyId) + amount;
    const row = { amount, reason: reason || '存入', day: gameDay, type: 'in' };
    (fundLog[familyId] = fundLog[familyId] || []).unshift(row);
    if (fundLog[familyId].length > 20) fundLog[familyId].pop();
    EventBus.emit('family:fund_changed', { familyId, amount, reason, balance: funds[familyId] });
    uiDirty = true;
    return amount;
  }

  function withdrawFund(familyId, amount, reason) {
    amount = Math.max(0, Math.round(amount || 0));
    const actual = Math.min(getFund(familyId), amount);
    if (!actual) return 0;
    funds[familyId] = getFund(familyId) - actual;
    const row = { amount: -actual, reason: reason || '支出', day: gameDay, type: 'out' };
    (fundLog[familyId] = fundLog[familyId] || []).unshift(row);
    if (fundLog[familyId].length > 20) fundLog[familyId].pop();
    EventBus.emit('family:fund_changed', { familyId, amount: -actual, reason, balance: funds[familyId] });
    uiDirty = true;
    return actual;
  }

  function transferFund(fromFamilyId, toFamilyId, amount, reason) {
    amount = Math.max(0, Math.round(amount || 0));
    if (!amount || fromFamilyId === toFamilyId || getFund(fromFamilyId) < amount) return false;
    withdrawFund(fromFamilyId, amount, reason || '转出');
    depositFund(toFamilyId, amount, reason || '转入');
    EventBus.emit('family:fund_transferred', {
      fromFamilyId, toFamilyId, amount, reason: reason || '家庭转账',
    });
    return true;
  }

  function getRecentTransactions(familyId, count) {
    return (fundLog[familyId] || []).slice(0, count || 10);
  }

  function getReputation(familyId) {
    return getFamily(familyId)?.reputation ?? 0;
  }

  function getSocialBonusForFamily(familyId) {
    const rep = getReputation(familyId);
    const effects = cfg().reputationEffects || [];
    for (const e of effects) if (rep >= e.min) return e.socialBonus ?? 0;
    return 0;
  }

  function hasTraitConflict(a, b) {
    const ta = getCharTraits(getChar(a)), tb = getCharTraits(getChar(b));
    return (ta.includes('kebo') && tb.includes('fengliu')) || (tb.includes('kebo') && ta.includes('fengliu')) ||
      (ta.includes('qinggao') && tb.includes('lazy')) || (tb.includes('qinggao') && ta.includes('lazy'));
  }

  function applyDailyEvent(family, ev) {
    const ids = family.members.map(m => m.charId);
    for (const ef of ev.effects || []) {
      if (ef.type === 'needAll') {
        ids.forEach(id => {
          CharacterEffectSystem.apply({
            type: 'need', charId: id, key: ef.key, delta: ef.delta || 0,
          }, {
            source: `family:${ev.id}`,
            reason: ev.name,
            familyId: family.id,
          });
        });
      }
      if (ef.type === 'relationAll') {
        for (let i = 0; i < ids.length; i++)
          for (let j = i + 1; j < ids.length; j++)
            if (hasConfiguredRelation(ids[i], ids[j]) || getRelationValue(ids[i], ids[j]) !== 0)
              CharacterEffectSystem.apply({
                type: 'relation', idA: ids[i], idB: ids[j], delta: ef.delta || 0,
              }, {
                source: `family:${ev.id}`,
                reason: ev.name,
                familyId: family.id,
              });
      }
      if (ef.type === 'relationConflict') {
        for (let i = 0; i < ids.length; i++)
          for (let j = i + 1; j < ids.length; j++)
            if (hasTraitConflict(ids[i], ids[j])) {
              CharacterEffectSystem.apply({
                type: 'relation', idA: ids[i], idB: ids[j], delta: ef.delta || 0,
              }, {
                source: `family:${ev.id}`,
                reason: ev.name,
                familyId: family.id,
              });
              break;
            }
      }
      if (ef.type === 'fund') {
        const amt = ef.min + Math.floor(Math.random() * ((ef.max || ef.min) - ef.min + 1));
        CharacterEffectSystem.apply({
          type: 'familyFund', familyId: family.id, delta: amt,
        }, {
          source: `family:${ev.id}`,
          reason: ev.name,
          familyId: family.id,
        });
      }
    }
    const bubble = (ev.bubbleTexts || [])[0];
    if (bubble) {
      const head = getChar(getHeadCharId(family.id));
      if (head) NarrativeBubbleSystem.showBubble({ charId: head.id, text: bubble, style: 'speech', module: 'family', duration: 4 });
    }
  }

  function canTriggerEvent(family, ev) {
    if (ev.needGardenScene) {
      const res = typeof ResidenceSystem !== 'undefined' ? ResidenceSystem.residenceOfFamily?.(family) : null;
      const residenceSceneId = res?.sceneId || family.residenceSceneId;
      const sc = getScene(residenceSceneId);
      if (!sc) return false;
      const hasGarden = CONFIG.furnitureInstances.some(inst =>
        inst.sceneId === residenceSceneId && getTemplate(inst.templateId)?.category === 'garden');
      if (!hasGarden && residenceSceneId !== 3) return false;
    }
    if (ev.needHeadIntellect) {
      const head = getChar(getHeadCharId(family.id));
      if (!head || (head.attributes?.intellect ?? 0) < ev.needHeadIntellect) return false;
    }
    if (ev.needConflictTraits) {
      const ids = family.members.map(m => m.charId);
      let ok = false;
      for (let i = 0; i < ids.length && !ok; i++)
        for (let j = i + 1; j < ids.length; j++)
          if (hasTraitConflict(ids[i], ids[j])) { ok = true; break; }
      if (!ok) return false;
    }
    return true;
  }

  function rollDailyEvents() {
    const baseCost = cfg().fundDailyCostBase ?? 5;
    for (const f of families()) {
      if (getFund(f.id) >= baseCost) withdrawFund(f.id, baseCost, '日常开销');
    }
    const f = getCurrentFamily();
    if (!f) return;
    const events = cfg().dailyEvents || [];
    for (const ev of events) {
      if (Math.random() > (ev.probability ?? 0.5)) continue;
      if (!canTriggerEvent(f, ev)) continue;
      applyDailyEvent(f, ev);
      EventBus.emit('family:event', { familyId: f.id, eventId: ev.id, eventName: ev.name });
      log(`${f.name}：${ev.name}`);
      break;
    }
  }

  function initFunds() {
    funds = {}; fundLog = {};
    for (const f of families()) {
      funds[f.id] = f.fund ?? 100;
      fundLog[f.id] = [];
    }
    currentFamilyId = cfg().defaultFamilyId ?? families()[0]?.id ?? 1;
    if (!getFamily(currentFamilyId)) currentFamilyId = families()[0]?.id ?? 1;
  }

  function serialize() {
    return { currentFamilyId, funds: { ...funds }, fundLog: JSON.parse(JSON.stringify(fundLog)) };
  }

  function apply(state) {
    if (!state) { initFunds(); return; }
    initFunds();
    currentFamilyId = state.currentFamilyId ?? currentFamilyId;
    if (state.funds) funds = { ...funds, ...state.funds };
    if (state.fundLog) fundLog = state.fundLog;
  }

  function openFamilyPanel() {
    const cur = currentFamilyId;
    const current = getFamily(cur) || families()[0];
    const currentHead = current ? getChar(getHeadCharId(current.id)) : null;
    const currentMembers = current?.members?.length || 0;
    const currentFund = current ? Math.round(getFund(current.id)) : 0;
    const currentRep = current ? Math.round(getReputation(current.id)) : 0;
    const residence = typeof ResidenceSystem !== 'undefined'
      ? ResidenceSystem.residenceOfFamily?.(current)
      : null;
    const residenceLabel = residence?.kind === 'offmap'
      ? `${residence.label} · 地图外`
      : residence?.kind === 'nonresidential'
        ? `${residence.label} · 非居住`
        : (residence?.label || getScene(current?.residenceSceneId)?.name || '未设置');
    const activityLabel = current?.activityLabel || (current?.activitySceneId ? getScene(current.activitySceneId)?.name : '');
    const cards = families().map(f => {
      const head = getChar(getHeadCharId(f.id));
      const n = f.members?.length || 0;
      const res = typeof ResidenceSystem !== 'undefined' ? ResidenceSystem.residenceOfFamily?.(f) : null;
      const resText = res?.kind === 'offmap' ? '地图外' : (res?.label || '未设置');
      return `<div class="fam-card${f.id === cur ? ' sel' : ''}" data-fid="${f.id}">
        <div class="fc-crest">${f.crestIcon || '🏠'}</div>
        <div class="fc-name">${f.name}</div>
        <div class="fc-head">家主：${head?.short || '—'} · ${n}口</div>
        <div class="fc-head">${resText} · ${Math.round(getFund(f.id))}两</div>
        <span class="fc-tag">${f.tag || ''}</span>
      </div>`;
    }).join('');
    document.getElementById('panel-content').innerHTML = `
      <h3>选择家庭</h3>
      <div class="fam-current">
        <div class="fam-current-head">
          <div>
            <div class="fam-current-name">${current?.crestIcon || '🏠'} ${current?.name || '当前家庭'}</div>
            <div class="fam-current-sub">家主：${currentHead?.short || '—'}${current?.tag ? ` · ${current.tag}` : ''}</div>
          </div>
          <div class="fam-current-badge">当前家庭</div>
        </div>
        <div class="fam-current-stats">
          <div class="fam-stat"><div class="fam-stat-k">住所</div><div class="fam-stat-v" title="${residenceLabel}">${residenceLabel}</div></div>
          <div class="fam-stat"><div class="fam-stat-k">账面</div><div class="fam-stat-v">公库 ${currentFund} 两</div></div>
          <div class="fam-stat"><div class="fam-stat-k">人口</div><div class="fam-stat-v">${currentMembers} 口 · 声望 ${currentRep}</div></div>
        </div>
        ${activityLabel ? `<div class="fam-current-sub" style="margin-top:7px">常用场所：${activityLabel}</div>` : ''}
      </div>
      <div class="fam-section-title">家庭列表</div>
      <div class="fam-grid">${cards}</div>
      <p style="font-size:10px;color:#8a7355;margin-top:10px">切换后底部人物栏刷新，成员依次自我介绍。快捷键 F。</p>
      <button class="sys-btn" style="margin-top:8px" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>`;
    document.getElementById('panel-overlay').classList.add('open');
    document.querySelectorAll('.fam-card').forEach(el => el.onclick = () => {
      switchFamily(+el.dataset.fid);
      document.getElementById('panel-overlay').classList.remove('open');
    });
  }

  function init() {
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    initFunds();
    unsubs.push(EventBus.on('time:day', rollDailyEvents));
  }

  function setEnabled(on) { enabled = !!on; }

  return {
    init, setEnabled, switchFamily, openFamilyPanel, showIntroBubbles: showFamilyBubbles,
    getCurrentFamily, getCurrentFamilyId, getFamily, getMemberIds,
    getCurrentMemberIds: () => getMemberIds(currentFamilyId),
    getFirstMemberCharId,
    getCharRole, getHeadCharId,
    findFamilyOfChar, sameFamily, getRelationMultiplier, getFund, depositFund, withdrawFund, transferFund,
    getRecentTransactions, getReputation, getSocialBonusForFamily, serialize, apply, reloadConfig: initFunds,
  };
})();
window.FamilySystem = FamilySystem;

