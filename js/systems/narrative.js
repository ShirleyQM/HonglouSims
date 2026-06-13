/* ═══════════════════ NARRATIVE BUBBLE (PLUGGABLE) ═══════════════════ */
const NarrativeBubbleSystem = (() => {
  let enabled = false;
  let unsubs = [];
  let active = [];
  let demandLog = {};
  let conflictCd = {};
  let conflictScanAcc = 0;
  let theater = null;
  let theaterCount = 0;
  let memoryEnterLog = {};
  let llmPending = {};
  let recentTextLog = [];
  let burstByModule = {};

  function cfg() { return CONFIG.narrativeBubble || DEFAULT_CONFIG.narrativeBubble; }
  function st() { return cfg().settings || {}; }

  function normalizeBubbleText(text) {
    return String(text || '')
      .replace(/\{[^}]+\}/g, '·')
      .replace(/[…。！？，、；：\s]+/g, '')
      .trim();
  }

  function isRecentDuplicate(text, module) {
    if (st().dedupeText === false) return false;
    const norm = normalizeBubbleText(text);
    if (!norm) return true;
    const now = performance.now();
    const windowMs = (st().dedupeTextWindowSec ?? 8) * 1000;
    recentTextLog = recentTextLog.filter(r => now - r.t < windowMs);
    if (recentTextLog.some(r => r.norm === norm)) return true;
    recentTextLog.push({ norm, module: module || '', t: now });
    if (recentTextLog.length > 40) recentTextLog.shift();
    return false;
  }

  function isBurstLimited(module) {
    const limits = st().burstLimits || { observe: 1, contagion: 1, interaction: 2, default: 2 };
    const mod = module || 'default';
    const limit = limits[mod] ?? limits.default ?? 2;
    const windowMs = (st().burstWindowSec ?? 4) * 1000;
    const now = performance.now();
    const log = burstByModule[mod] || { t: now, n: 0 };
    if (now - log.t >= windowMs) { log.t = now; log.n = 0; }
    if (log.n >= limit) return true;
    log.n++;
    burstByModule[mod] = log;
    return false;
  }

  const TRAIT_LABELS = {
    fengliu: '风流', duoqing: '多情', shuchi: '书痴', qinggao: '清高', qingjie: '洁癖',
    haoke: '好客', lazy: '慵懒', kebo: '刻薄',
  };

  function fillPlaceholders(text, ctx) {
    return String(text)
      .replace(/\{name\}/g, ctx.name || '')
      .replace(/\{need_name\}/g, ctx.needName || '')
      .replace(/\{need_value\}/g, ctx.needValue != null ? Math.round(ctx.needValue) : '')
      .replace(/\{scene\}/g, ctx.scene || '')
      .replace(/\{target\}/g, ctx.target || '')
      .replace(/\{other_name\}/g, ctx.otherName || '')
      .replace(/\{name_a\}/g, ctx.nameA || '')
      .replace(/\{name_b\}/g, ctx.nameB || '')
      .replace(/\{memory_title\}/g, ctx.memoryTitle || '')
      .replace(/\{time_ago\}/g, ctx.timeAgo || '')
      .replace(/\{emotion\}/g, ctx.emotion || '')
      .replace(/\{trait\}/g, ctx.traitLabel || '')
      .replace(/\{interaction\}/g, ctx.interaction || '');
  }

  function resolveText(source, texts, ctx) {
    const llm = st().llm;
    if (llm?.enabled && (llm.apiUrl || llm.useEventOnly)) {
      const requestId = 'nb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      EventBus.emit('bubble:llm_request', {
        requestId, source, promptTag: ctx.promptTag || llm.promptTemplates?.[source],
        systemPrompt: llm.systemPrompt, context: ctx, fallbackTexts: texts,
      });
      llmPending[requestId] = { charId: ctx.charId, style: ctx.style, icon: ctx.icon, module: ctx.module };
      if (llm.apiUrl) fetchLLMText(requestId, source, ctx, texts);
    }
    const raw = texts[Math.floor(Math.random() * texts.length)] || '……';
    return fillPlaceholders(raw, ctx);
  }

  async function fetchLLMText(requestId, source, ctx, fallbacks) {
    const llm = st().llm;
    try {
      const body = {
        promptTag: ctx.promptTag || llm.promptTemplates?.[source],
        system: llm.systemPrompt,
        context: ctx,
        fallbacks,
      };
      const res = await fetch(llm.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(llm.apiKey ? { Authorization: 'Bearer ' + llm.apiKey } : {}) },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.text || data.content || data.message;
        if (text) applyLLMResponse(requestId, text);
      }
    } catch (e) { /* 失败则保留模板文案 */ }
  }

  function showBubble(data) {
    if (!enabled || !st().masterEnabled) return false;
    const c = getChar(data.charId);
    if (!c || !data.text) return false;
    if (speechBubble?.char?.id === c.id) return false;
    const module = data.module || '';
    if (isRecentDuplicate(data.text, module)) return false;
    if (isBurstLimited(module)) return false;
    active = active.filter(b => b.charId !== data.charId);
    const max = st().maxOnScreen || 3;
    while (active.length >= max) active.shift();
    const dur = data.duration || Math.min(8, Math.max(4, (data.text?.length || 6) * 0.18));
    active.push({
      charId: data.charId, char: c, text: data.text,
      style: data.style || 'thought', icon: data.icon || '',
      born: performance.now(), duration: dur, fadeIn: 0.3, fadeOut: 0.5,
      module,
    });
    EventBus.emit('bubble:show', { charId: data.charId, text: data.text, style: data.style, module: data.module });
    return true;
  }

  function traitsMatch(c, cond) {
    if (!cond || !cond.trait) return true;
    return getCharTraits(c).includes(cond.trait);
  }

  function canShowDemand(c) {
    const s = st().demand || {};
    const ts = getGameTimestamp();
    const log = demandLog[c.id] || { t: 0, n: 0, w: ts };
    if (ts - log.w >= 60) { log.n = 0; log.w = ts; }
    if (log.n >= (s.maxPerCharPerGameMin || 2)) return false;
    if (ts - log.t < (s.minIntervalGameMin || 5)) return false;
    return true;
  }

  function markDemand(c) {
    const ts = getGameTimestamp();
    const log = demandLog[c.id] || { t: 0, n: 0, w: ts };
    if (ts - log.w >= 60) { log.n = 0; log.w = ts; }
    log.t = ts; log.n++;
    demandLog[c.id] = log;
  }

  function onNeedCritical(evt) {
    if (!enabled || !st().demandEnabled) return;
    const c = getChar(evt.charId);
    if (!c) return;
    const rows = (cfg().demandBubbles || []).filter(r =>
      r.needKey === evt.needKey && evt.ratio <= r.threshold && traitsMatch(c, r.condition)
    );
    if (!rows.length || !canShowDemand(c)) return;
    const pri = Math.min(...rows.map(r => r.priority ?? 99));
    const pool = rows.filter(r => (r.priority ?? 99) === pri);
    const row = pool[Math.floor(Math.random() * pool.length)];
    const nd = getNeedDefs().find(n => n.key === evt.needKey);
    const sc = sceneAt(Math.floor(c.gridCol), Math.floor(c.gridRow));
    markDemand(c);
    showBubble({
      charId: c.id,
      text: resolveText('demand', row.texts, {
        charId: c.id, name: c.short, needName: nd?.label || evt.needKey,
        needValue: evt.ratio * 100, scene: sc?.name || '',
        traitLabel: TRAIT_LABELS[row.condition?.trait] || '',
        promptTag: st().llm?.promptTemplates?.demand,
        style: row.style, icon: row.icon, module: 'demand',
      }),
      style: row.style, icon: row.icon, module: 'demand',
    });
  }

  function charsInScene(sceneId) {
    return CHARS.filter(c => c.sceneId === sceneId);
  }

  function pairKey(a, b, cfgId) { return [a, b].sort().join('|') + ':' + cfgId; }

  function conflictCdOk(a, b, row) {
    const k = pairKey(a, b, row.id);
    return getGameTimestamp() >= (conflictCd[k] || 0);
  }

  function markConflictCd(a, b, row) {
    conflictCd[pairKey(a, b, row.id)] = getGameTimestamp() + (row.cooldownGameMin || 30);
  }

  function matchConflictRow(row, a, b) {
    if (row.charATrait && row.charATrait !== '0' && !getCharTraits(a).includes(row.charATrait)) return false;
    if (row.charBTrait && row.charBTrait !== '0' && !getCharTraits(b).includes(row.charBTrait)) return false;
    const rel = getRelationValue(a, b);
    const [lo, hi] = row.relationRange || [-100, 100];
    if (rel < lo || rel > hi) return false;
    return conflictCdOk(a, b, row);
  }

  function pickBystander(sceneId, trait) {
    const pool = charsInScene(sceneId).filter(c => !trait || trait === '0' || getCharTraits(c).includes(trait));
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function applyLineEffect(effect, a, b) {
    if (!effect) return;
    if (effect.type === 'relation') changeRelation(a, b, effect.delta || 0);
    if (effect.type === 'state' && effect.stateId) {
      const who = effect.target === 'char_b' ? getChar(b) : effect.target === 'char_a' ? getChar(a) : null;
      if (who) applyState(who, effect.stateId);
      else { applyState(getChar(a), effect.stateId); applyState(getChar(b), effect.stateId); }
    }
  }

  function executeTheater(row, charA, charB) {
    if (theater || theaterCount >= (st().conflict?.maxConcurrent || 2)) return;
    theaterCount++;
    markConflictCd(charA, charB, row);
    EventBus.emit('conflict:theater_start', { configId: row.id, charA, charB, name: row.name });
    theater = { row, charA, charB, idx: 0, timer: 0 };
    playTheaterLine();
  }

  function playTheaterLine() {
    if (!theater) return;
    const { row, charA, charB, idx } = theater;
    if (idx >= row.lines.length) {
      EventBus.emit('conflict:theater_end', { configId: row.id, charA, charB });
      theater = null;
      theaterCount = Math.max(0, theaterCount - 1);
      return;
    }
    const line = row.lines[idx];
    const sc = sceneAt(Math.floor(getChar(charA).gridCol), Math.floor(getChar(charA).gridRow));
    let speakerId = charA;
    if (line.speaker === 'char_b') speakerId = charB;
    else if (line.speaker === 'bystander') {
      const by = pickBystander(sc?.id || getChar(charA).sceneId, line.bystanderTrait);
      speakerId = by?.id || charA;
    }
    const sp = getChar(speakerId);
    const ctx = {
      charId: speakerId, name: sp?.short, nameA: getChar(charA).short, nameB: getChar(charB).short,
      scene: sc?.name, promptTag: st().llm?.promptTemplates?.conflict,
      style: line.style, icon: '', module: 'conflict',
    };
    showBubble({
      charId: speakerId,
      text: resolveText('conflict', [line.text], ctx),
      style: line.style || 'speech', module: 'conflict',
    });
    applyLineEffect(line.effect, charA, charB);
    theater.idx++;
    theater.timer = line.delay ?? 2;
  }

  function scanConflictTheater() {
    if (!enabled || !st().conflictEnabled || theater) return;
    for (const sc of CONFIG.scenes) {
      const chars = charsInScene(sc.id);
      for (let i = 0; i < chars.length; i++)
        for (let j = i + 1; j < chars.length; j++) {
          const a = chars[i].id, b = chars[j].id;
          const rows = (cfg().conflictTheaters || []).filter(r =>
            r.triggerType === 'timed' && matchConflictRow(r, a, b)
          );
          for (const row of rows) {
            if (Math.random() < (row.probability ?? 0.3)) {
              executeTheater(row, a, b);
              return;
            }
          }
        }
    }
  }

  function onConflictEvent(evt) {
    if (!enabled || !st().conflictEnabled) return;
    const rows = (cfg().conflictTheaters || []).filter(r =>
      r.triggerType === 'event' && r.triggerEvent === evt.type
    );
    for (const row of rows) {
      if (row.needKey && evt.needKey && row.needKey !== evt.needKey) continue;
      const c = getChar(evt.charId);
      if (!c) continue;
      if (row.charATrait && row.charATrait !== '0' && !getCharTraits(c).includes(row.charATrait)) continue;
      if (Math.random() > (row.probability ?? 0.5)) continue;
      if (!conflictCdOk(c.id, c.id, row)) continue;
      executeTheater(row, c.id, c.id);
      break;
    }
  }

  function formatTimeAgo(mem) {
    const now = getGameTimestamp();
    const then = (mem.day || gameDay) * 1440 + (mem.hour || 0) * 60;
    const diff = Math.max(0, now - then);
    if (diff < 120) return '方才';
    if (diff < 1440) return '今日';
    if (diff < 4320) return '数日前';
    return '半月前';
  }

  function onSceneEntered(evt) {
    if (!enabled || !st().memoryEnabled || !st().memory?.triggerOnSceneEnter) return;
    const c = getChar(evt.charId);
    if (!c) return;
    const key = c.id + '|' + evt.sceneId;
    if (memoryEnterLog[key]) return;
    memoryEnterLog[key] = true;
    const sc = CONFIG.scenes.find(s => s.id === evt.sceneId);
    const mems = (c.memories || []).filter(m => m.day != null);
    if (!mems.length) return;
    const mem = mems[mems.length - 1];
    const rows = (cfg().memorySurfaces || []).filter(r =>
      (!r.memoryTag || r.memoryTag === mem.tag) && Math.random() < (r.probability ?? 0.4)
    );
    if (!rows.length) return;
    const row = rows[0];
    const other = getChar(mem.with);
    showBubble({
      charId: c.id,
      text: fillPlaceholders(row.template, {
        name: c.short, scene: sc?.name || '',
        otherName: other?.short || '某人', memoryTitle: mem.text,
        timeAgo: formatTimeAgo(mem), emotion: mem.tag || '',
      }),
      style: row.style, icon: row.icon || '', module: 'memory',
    });
    if (row.walkEffect === 'pause' && c.ai) c.ai.walkPauseUntil = performance.now() / 1000 + 1.5;
  }

  function onGameMinute(evt) {
    if (!enabled) return;
    conflictScanAcc += evt?.minutes || 1;
    if (conflictScanAcc >= (st().conflict?.scanIntervalGameMin || 15)) {
      conflictScanAcc = 0;
      scanConflictTheater();
    }
  }

  function onInteractionState(evt) {
    if (!enabled || st().interactionEnabled === false) return;
    const c = getChar(evt.charId);
    if (!c) return;
    const rows = (cfg().interactionStateBubbles || []).filter(r => r.stateId === evt.stateId);
    if (!rows.length) return;
    const row = rows[Math.floor(Math.random() * rows.length)];
    const other = getChar(evt.otherId);
    const pool = row.texts || [];
    if (!pool.length) return;
    const raw = pool[Math.floor(Math.random() * pool.length)];
    showBubble({
      charId: c.id,
      text: fillPlaceholders(raw, {
        name: c.short, target: other?.short || '', other_name: other?.short || '',
        interaction: evt.interactionName || '',
      }),
      style: row.style || 'thought', icon: row.icon || '', module: 'interaction',
    });
  }

  function update(dt) {
    if (theater && theater.timer != null) {
      theater.timer -= dt;
      if (theater.timer <= 0) playTheaterLine();
    }
    const now = performance.now();
    active = active.filter(b => now - b.born < (b.duration + b.fadeOut) * 1000);
  }

  function drawBubbleBox(bx, by, bw, bh, style, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = style === 'thought' ? 'rgba(248,245,255,.94)' : style === 'exclaim' ? 'rgba(255,242,230,.96)' : 'rgba(255,250,240,.95)';
    ctx.strokeStyle = style === 'exclaim' ? '#8b4513' : '#5c4033';
    ctx.lineWidth = style === 'exclaim' ? 2 : 1;
    if (style === 'thought') {
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.beginPath(); ctx.arc(bx + bw * 0.3, by + bh + 4, 3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else {
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);
      if (style === 'speech') {
        ctx.beginPath();
        ctx.moveTo(bx + bw * 0.4, by + bh);
        ctx.lineTo(bx + bw * 0.45, by + bh + 6);
        ctx.lineTo(bx + bw * 0.55, by + bh);
        ctx.fill(); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function draw() {
    if (!enabled || !active.length) return;
    const now = performance.now();
    const stackAt = {};
    const sorted = [...active].sort((a, b) => a.born - b.born);
    for (const b of sorted) {
      const c = b.char;
      if (!c) continue;
      if (speechBubble?.char?.id === c.id) continue;
      const age = (now - b.born) / 1000;
      let alpha = 1;
      if (age < b.fadeIn) alpha = age / b.fadeIn;
      else if (age > b.duration) alpha = Math.max(0, 1 - (age - b.duration) / b.fadeOut);
      const x = Math.round(toScreenX(c.x)), y = Math.round(toScreenY(c.y)) - 48;
      ctx.font = (b.style === 'exclaim' ? 'bold ' : '') + '12px SimSun, serif';
      const maxW = 150;
      const lines = wrapText((b.icon ? b.icon + ' ' : '') + b.text, maxW);
      const bw = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width), 40)) + 14;
      const bh = lines.length * 14 + 10;
      const bx = Math.max(8, Math.min(x - bw / 2, VIEW_W - bw - 8));
      const stackKey = `${Math.floor(bx / 48)},${Math.floor(y / 48)}`;
      const stackIdx = stackAt[stackKey] || 0;
      stackAt[stackKey] = stackIdx + 1;
      const stackGap = st().stackOffsetPx ?? 10;
      const by = Math.max(8, y - bh - (b.style === 'speech' ? 6 : 0) - stackIdx * (bh + stackGap));
      drawBubbleBox(bx, by, bw, bh, b.style, alpha);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#2a1f18';
      ctx.textAlign = 'left';
      lines.forEach((ln, i) => ctx.fillText(ln, bx + 7, by + 14 + i * 14));
      ctx.restore();
    }
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    const s = st();
    if (s.masterEnabled === false) { enabled = false; return; }
    unsubs.push(EventBus.on('need:critical', onNeedCritical));
    unsubs.push(EventBus.on('need:crisis', onConflictEvent));
    unsubs.push(EventBus.on('scene:entered', onSceneEntered));
    unsubs.push(EventBus.on('time:tick', onGameMinute));
    unsubs.push(EventBus.on('interaction:state', onInteractionState));
  }

  function disable() {
    enabled = false;
    unsubs.forEach(fn => { if (typeof fn === 'function') fn(); });
    unsubs = [];
    active = [];
    recentTextLog = [];
    burstByModule = {};
    theater = null;
    theaterCount = 0;
  }

  function init() {
    disable();
    if (st().masterEnabled !== false) enable();
  }

  function reloadConfig() { const was = enabled; disable(); if (was && st().masterEnabled !== false) enable(); }

  function applyLLMResponse(requestId, text) {
    const p = llmPending[requestId];
    if (!p || !text) return;
    delete llmPending[requestId];
    showBubble({ charId: p.charId, text, style: p.style, icon: p.icon, module: p.module || 'llm' });
  }

  return {
    init, enable, disable, reloadConfig, update, draw, showBubble, applyLLMResponse,
    getActiveBubbles: () => active.slice(),
    getConflictCooldowns: () => ({ ...conflictCd }),
    setMasterEnabled(on) { st().masterEnabled = !!on; on ? enable() : disable(); },
    setModuleEnabled(mod, on) {
      if (mod === 'demand') st().demandEnabled = !!on;
      if (mod === 'conflict') st().conflictEnabled = !!on;
      if (mod === 'memory') st().memoryEnabled = !!on;
    },
  };
})();
window.NarrativeBubbleSystem = NarrativeBubbleSystem;

const FAMILY_ROLE_ORDER = { '家主': 1, '配偶': 2, '长辈': 3, '手足': 4, '子女': 5, '门客': 6, '仆从': 7 };

