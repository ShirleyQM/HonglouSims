/* ═══════════════════ RELATION SYSTEM (四轴：好感·信任·友谊·服从) ═══════════════════
 *
 *  三轴对称（双向共享）：
 *    affection  好感   ±100  情感倾向，变化快
 *    trust      信任   ±100  可靠感，积累慢、崩塌快
 *    friendship 友谊   ±100 共同经历积累，替代 intimacy，极慢衰减
 *
 *  一轴方向性（per-person）：
 *    submission 服从   ±100 A 对 B 的服从/顺从程度，随身份差异初始化
 *
 *  综合分：affection×0.45 + trust×0.35 + friendship×0.20
 *  服从不进综合分，只影响互动规则与身份判定。
 */

// ── 轴权重（对称轴，计算综合分用）──
const REL_AXIS_WEIGHTS = { affection: 0.45, trust: 0.35, friendship: 0.20 };

// ── 默认 changeRelation 的轴分配比例（向后兼容旧调用）──
const REL_DEFAULT_AXIS_SPLIT = { affection: 0.45, trust: 0.35, friendship: 0.20 };

// ── 各轴衰减倍率（相对 relationDecayPerDay）──
const REL_AXIS_DECAY_MULT = {
  affection:  1.0,   // 正常衰减
  trust:      0.3,   // 慢，信任难忘
  friendship: 0.1,   // 极慢，岁月沉淀
  submission: 0.05,  // 极极慢，自然回归基线
};

const REL_AFFECTION_MAX  = 100, REL_AFFECTION_MIN  = -100;
const REL_TRUST_MAX      = 100, REL_TRUST_MIN      = -100;
const REL_FRIENDSHIP_MAX = 100, REL_FRIENDSHIP_MIN = -100;
const REL_SUBMISSION_MAX = 100, REL_SUBMISSION_MIN = -100;

const REL_AXIS_STAGE_DEFS = {
  affection: [
    { min: -100, max: -60, label: '嫌恶', alt: '憎厌', plain: '烦你' },
    { min: -60,  max: -20, label: '冷淡', alt: '疏离', plain: '不熟' },
    { min: -20,  max: 20,  label: '平常', alt: '泛泛', plain: '还行' },
    { min: 20,   max: 60,  label: '亲善', alt: '和悦', plain: '挺亲' },
    { min: 60,   max: 100, label: '喜爱', alt: '钟爱', plain: '稀罕' },
  ],
  trust: [
    { min: -100, max: -60, label: '提防', alt: '疑忌' },
    { min: -60,  max: -20, label: '观望', alt: '审慎' },
    { min: -20,  max: 20,  label: '平信', alt: '寻常' },
    { min: 20,   max: 60,  label: '倚重', alt: '倚赖' },
    { min: 60,   max: 100, label: '心腹', alt: '肱股' },
  ],
  friendship: [
    { min: -100, max: -60, label: '仇隙', alt: '交恶' },
    { min: -60,  max: -20, label: '疏离', alt: '生分' },
    { min: -20,  max: 20,  label: '陌路', alt: '萍水' },
    { min: 20,   max: 60,  label: '谈笑', alt: '言笑' },
    { min: 60,   max: 100, label: '知己', alt: '莫逆' },
  ],
  submission: [
    { min: -100, max: -60, label: '违逆', alt: '悖逆' },
    { min: -60,  max: -20, label: '抗命', alt: '顶撞' },
    { min: -20,  max: 20,  label: '敷衍', alt: '怠慢' },
    { min: 20,   max: 60,  label: '遵行', alt: '循规' },
    { min: 60,   max: 100, label: '效忠', alt: '效死' },
  ],
  care: [
    { min: -100, max: -60, label: '厌弃', alt: '厌薄' },
    { min: -60,  max: -20, label: '苛责', alt: '严苛' },
    { min: -20,  max: 20,  label: '平淡', alt: '寻常' },
    { min: 20,   max: 60,  label: '恩恤', alt: '照拂' },
    { min: 60,   max: 100, label: '宠信', alt: '偏宠' },
  ],
};

function getRelationAxisStageDefs(axis) {
  const cfg = CONFIG.relationPanelConfig?.axisStageLabels || {};
  const key = axis === 'submissionAtoB' || axis === 'submissionBtoA' ? 'submission' : axis;
  const defs = (cfg[key]?.length ? cfg[key] : REL_AXIS_STAGE_DEFS[key]) || REL_AXIS_STAGE_DEFS.affection;
  return normalizeRelationStageDefs(defs, key);
}

function normalizeRelationStageDefs(defs, axis) {
  if (!defs?.length) return defs;
  const defaults = DEFAULT_CONFIG?.relationPanelConfig?.axisStageLabels?.[axis];
  if (defs.length !== 6 && defaults?.length === 6) return defaults;
  const usesOldZeroToHundred = defs.every(row => (row.min ?? 0) >= 0) && defs[0]?.min === 0;
  if (!usesOldZeroToHundred) return defs;
  if (defaults?.length === 6) return defaults;
  if (REL_AXIS_STAGE_DEFS[axis]) return REL_AXIS_STAGE_DEFS[axis];
  return defs.map((row, i) => ({
    ...row,
    min: (row.min * 2) - 100,
    max: defs[i + 1]?.min != null ? (defs[i + 1].min * 2) - 100 : 100,
  }));
}

const REL_KINSHIP_TYPES = [
  { type: '直系血亲', initTypes: ['父子', '父女', '母子', '母女', '祖孙'] },
  { type: '旁系血亲', initTypes: ['兄妹', '兄弟', '姐妹', '姐弟', '叔侄', '姑侄', '舅甥', '姨甥'] },
  { type: '姻亲', initTypes: ['夫妻', '婆媳', '翁媳', '叔嫂', '妯娌', '连襟'] },
];

// ─── relKey：始终按字母序排序，保证对称 ────────────────────────────────────────
function relKey(a, b) { return [a, b].sort().join('|'); }

// ─── 根据 socialRank 差值计算服从初始值 ────────────────────────────────────────
// getSubmissionBase(A, B) = A 对 B 的服从度
// rankA 越高（数字越大）说明 A 层级越低，服从度越高
function getSubmissionBase(idA, idB) {
  const rankA = CONFIG.characters?.find(c => c.id === idA)?.socialRank ?? 2;
  const rankB = CONFIG.characters?.find(c => c.id === idB)?.socialRank ?? 2;
  const diff = rankA - rankB; // 正值 = A 比 B 低级
  return Math.max(REL_SUBMISSION_MIN, Math.min(REL_SUBMISSION_MAX, diff * 20));
}

// ─── 存档迁移：旧格式 → 新四轴格式 ────────────────────────────────────────────
function migrateRelationEntry(r, idA, idB) {
  if (r.friendship !== undefined) {
    // 已是新格式，确保 submission 字段存在
    if (!r.submission) r.submission = {};
    return r;
  }
  if (r.affection !== undefined) {
    // 三轴旧格式（intimacy 存在），迁移为四轴
    const intimacyVal = r.intimacy ?? 0;
    delete r.intimacy;
    r.friendship = Math.max(REL_FRIENDSHIP_MIN, Math.min(REL_FRIENDSHIP_MAX, intimacyVal));
    if (!r.submission) r.submission = {};
    return r;
  }
  // 最旧格式（只有 value）
  const v = r.value ?? 0;
  return {
    ...r,
    affection:  v,
    trust:      Math.round(v * 0.8),
    friendship: Math.round(v * 0.5),
    submission: {},
    thresholdEvents: [],
  };
}

// ─── 初始化 ─────────────────────────────────────────────────────────────────
function initRelations() {
  relations = {};
  for (const r of CONFIG.relationInit || []) {
    const k = relKey(r.a, r.b);
    const v = r.initValue;
    // 服从：按 socialRank 差值初始化双向
    const subA = getSubmissionBase(r.a, r.b);
    const subB = getSubmissionBase(r.b, r.a);
    relations[k] = {
      affection:  v,
      trust:      Math.round(v * 0.8),
      friendship: Math.round(v * 0.5),
      submission: { [r.a]: subA, [r.b]: subB },
      initType:   r.initType,
      note:       r.note || '',
      lastInteract:    getGameTimestamp(),
      memoryIds:       [],
      thresholdEvents: [],
    };
  }
}

// ─── 综合分（只含三个对称轴）──────────────────────────────────────────────────
function computeRelScore(r) {
  if (!r) return 0;
  return Math.round(
    (r.affection  ?? 0) * REL_AXIS_WEIGHTS.affection  +
    (r.trust      ?? 0) * REL_AXIS_WEIGHTS.trust      +
    (r.friendship ?? 0) * REL_AXIS_WEIGHTS.friendship
  );
}

// ─── 读取接口 ─────────────────────────────────────────────────────────────────

/** 向后兼容：综合分 */
function getRelationValue(idA, idB) {
  if (idA === idB) return 100;
  const r = relations[relKey(idA, idB)];
  return r ? computeRelScore(r) : 0;
}

/** 读取单轴值
 *  submission 是方向性的：getRelationAxis(A,B,'submission') = A 对 B 的服从度 */
function getRelationAxis(idA, idB, axis) {
  const r = relations[relKey(idA, idB)];
  if (!r) return 0;
  if (axis === 'submission') return r.submission?.[idA] ?? 0;
  return r[axis] ?? 0;
}

function hasConfiguredRelation(idA, idB) {
  return !!relations[relKey(idA, idB)];
}

function normalizeRelationAxis(axis, value) {
  const v = Number.isFinite(value) ? value : 0;
  return Math.max(-100, Math.min(100, v));
}

function relationChangeContext(idA, idB, axis, delta, context = {}) {
  return {
    actor: context.actor || context.actorId || context.sourceCharId || idA,
    recipient: context.recipient || context.recipientId || context.targetCharId || idB,
    idA, idB, axis,
    delta,
    source: context.source || 'relation',
    reason: context.reason || '',
    contextType: context.contextType || context.type || '',
    interactionId: context.interactionId,
    questTemplateId: context.questTemplateId || context.templateId,
    eventId: context.eventId,
  };
}

function getRelationAxisStage(axis, value) {
  const key = axis === 'submissionAtoB' || axis === 'submissionBtoA' ? 'submission' : axis;
  const defs = getRelationAxisStageDefs(key);
  const normalized = normalizeRelationAxis(key, value);
  const stage = defs.find((d, i) => {
    const max = defs[i + 1]?.min ?? d.max ?? 100;
    return normalized >= d.min && (normalized < max || (i === defs.length - 1 && normalized <= max));
  }) || defs[defs.length - 1];
  return {
    axis: key,
    value: Math.round(value || 0),
    normalized: Math.round(normalized),
    pct: (normalized + 100) / 200,
    label: stage.label,
    relationName: stage.relationName || '',
    alt: stage.alt || stage.label,
    plain: stage.plain || stage.label,
    examples: stage.examples || '',
    range: `${stage.min}-${stage.max}`,
    tier: defs.indexOf(stage) + 1,
  };
}

function getKinshipType(initType = '') {
  for (const row of REL_KINSHIP_TYPES) {
    if (row.initTypes.includes(initType)) return row.type;
  }
  return initType === '主仆' || initType === '朋友' || initType === '同事' || initType === '陌生人'
    ? '无血缘'
    : (initType ? '无血缘' : '');
}

function buildRelationTags(info) {
  const tags = [];
  if (info.compositeLabel) tags.push(info.compositeLabel);
  if (info.typeLabel) tags.push(info.typeLabel);
  if (info.kinshipType && info.kinshipType !== '无血缘') tags.push(info.kinshipType);
  if (info.initType && info.initType !== info.kinshipType) tags.push(info.initType);
  tags.push(info.axisStages.affection.label, info.axisStages.trust.label, info.axisStages.friendship.label);
  if (info.submissionAtoB > 5) tags.push(`服从:${info.axisStages.submissionAtoB.label}`);
  return [...new Set(tags)].slice(0, 6);
}

function getRelationInfo(idA, idB) {
  const k = relKey(idA, idB);
  const r = relations[k];
  const score = r ? computeRelScore(r) : 0;
  const info = {
    score,
    value:       score,
    typeLabel:   getRelationTypeLabel(score),
    configured:  !!r,
    initType:    r?.initType,
    kinshipType: getKinshipType(r?.initType),
    note:        r?.note || '',
    affection:   r?.affection  ?? 0,
    trust:       r?.trust      ?? 0,
    friendship:  r?.friendship ?? 0,
    // submission 是方向性的，返回双向
    submissionAtoB: r?.submission?.[idA] ?? 0,
    submissionBtoA: r?.submission?.[idB] ?? 0,
  };
  info.axisStages = {
    affection:      getRelationAxisStage('affection', info.affection),
    trust:          getRelationAxisStage('trust', info.trust),
    friendship:     getRelationAxisStage('friendship', info.friendship),
    submissionAtoB: getRelationAxisStage('submission', info.submissionAtoB),
    submissionBtoA: getRelationAxisStage('submission', info.submissionBtoA),
  };
  info.compositeLabel = getCompositeRelationLabel(info);
  info.tags = buildRelationTags(info);
  return info;
}

function getRelationTypeLabel(score) {
  const thresholds = CONFIG.relationTypeThresholds || DEFAULT_CONFIG.relationTypeThresholds;
  for (const t of thresholds) if (score >= t.min) return t.label;
  return '陌生人';
}

function relationRuleAppliesToFamily(ruleFamily, info) {
  if (!ruleFamily || ruleFamily === '任意') return true;
  if (ruleFamily === info.initType || ruleFamily === info.kinshipType) return true;
  if (ruleFamily === '无血缘' && info.kinshipType === '无血缘') return true;
  return false;
}

function relationConditionPass(value, condition) {
  const text = String(condition || '').trim();
  if (!text || text === '—' || text === '-') return true;
  const m = text.match(/(≥|<=|≤|>=|>|<|=)\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return true;
  const target = Number(m[2]);
  if (!Number.isFinite(target)) return true;
  if (m[1] === '≥' || m[1] === '>=') return value >= target;
  if (m[1] === '≤' || m[1] === '<=') return value <= target;
  if (m[1] === '>') return value > target;
  if (m[1] === '<') return value < target;
  return value === target;
}

function relationFourthValueForRule(part, info) {
  const text = String(part || '');
  if (text.includes('服从') || text.includes('孝道')) {
    return Math.max(info.submissionAtoB ?? 0, info.submissionBtoA ?? 0);
  }
  if (text.includes('意气')) return info.friendship ?? 0;
  if (text.includes('恩恤') || text.includes('体恤') || text.includes('慈爱') || text.includes('情分')) {
    return info.affection ?? 0;
  }
  return info.affection ?? 0;
}

function relationServiceConditionPass(condition, info) {
  const text = String(condition || '').trim();
  if (!text || text === '—' || text === '-') return true;
  return text.split('+').every(part => relationConditionPass(relationFourthValueForRule(part, info), part));
}

function getCompositeRelationLabel(info) {
  const configured = CONFIG.relationPanelConfig?.compositeRelationRules || [];
  const rules = configured.length ? configured : DEFAULT_CONFIG.relationPanelConfig?.compositeRelationRules || [];
  for (const rule of rules) {
    if (!rule?.label) continue;
    if (!relationRuleAppliesToFamily(rule.familyRelation, info)) continue;
    if (!relationConditionPass(info.friendship ?? 0, rule.friendship)) continue;
    if (!relationConditionPass(info.affection ?? 0, rule.affection)) continue;
    if (!relationConditionPass(info.trust ?? 0, rule.trust)) continue;
    if (!relationServiceConditionPass(rule.service, info)) continue;
    return rule.label;
  }
  return '';
}

// ─── 修改：单轴 ──────────────────────────────────────────────────────────────
/** changeAxis(idA, idB, axis, delta)
 *  - 对称轴（affection/trust/friendship）：修改共享值
 *  - 服从轴（submission）：修改 idA 对 idB 的服从度（方向性） */
function changeAxis(idA, idB, axis, rawDelta, context = {}) {
  if (!rawDelta || Math.abs(rawDelta) < 0.05) return;
  const relCtx = relationChangeContext(idA, idB, axis, rawDelta, context);
  const k = relKey(idA, idB);
  if (!relations[k]) {
    const subA = getSubmissionBase(idA, idB);
    const subB = getSubmissionBase(idB, idA);
    relations[k] = {
      affection: 0, trust: 0, friendship: 0,
      submission: { [idA]: subA, [idB]: subB },
      initType: '陌生人', note: '', lastInteract: 0,
      memoryIds: [], thresholdEvents: [],
    };
  }
  const r = relations[k];

  // 服从轴：方向性修改
  if (axis === 'submission') {
    const traitDelta = TraitEffectSystem?.modifyRelationDelta?.(idA, idB, axis, rawDelta, relCtx) ?? rawDelta;
    const mult = FamilySystem.getRelationMultiplier(idA, idB, traitDelta);
    const delta = traitDelta * mult;
    const old = r.submission?.[idA] ?? 0;
    r.submission = r.submission || {};
    r.submission[idA] = Math.max(REL_SUBMISSION_MIN, Math.min(REL_SUBMISSION_MAX, old + delta));
    r.lastInteract = getGameTimestamp();
    EventBus.emit('relation:axis_change', {
      ...relCtx, axis: 'submission',
      old, new: r.submission[idA], delta,
      oldScore: computeRelScore(r), newScore: computeRelScore(r),
    });
    return;
  }

  // 对称轴
  const traitDelta = TraitEffectSystem?.modifyRelationDelta?.(idA, idB, axis, rawDelta, relCtx) ?? rawDelta;
  const mult = FamilySystem.getRelationMultiplier(idA, idB, traitDelta);
  const delta = traitDelta * mult;
  const oldVal = r[axis] ?? 0;

  let min, max;
  if (axis === 'affection')  { min = REL_AFFECTION_MIN;  max = REL_AFFECTION_MAX;  }
  else if (axis === 'trust') { min = REL_TRUST_MIN;      max = REL_TRUST_MAX;      }
  else                       { min = REL_FRIENDSHIP_MIN; max = REL_FRIENDSHIP_MAX; }

  r[axis] = Math.max(min, Math.min(max, oldVal + delta));
  r.lastInteract = getGameTimestamp();

  const oldScore = computeRelScore({ ...r, [axis]: oldVal });
  const newScore = computeRelScore(r);

  EventBus.emit('relation:axis_change', {
    ...relCtx,
    old: oldVal, new: r[axis], delta,
    oldScore, newScore,
  });

  if (Math.abs(newScore - oldScore) >= 2) {
    const typeLabel = getRelationTypeLabel(newScore);
    log(`关系变化：${getChar(idA)?.short}↔${getChar(idB)?.short} ${oldScore}→${newScore}（${typeLabel}）`);
    EventBus.emit('relation:change', {
      ...relCtx,
      old: oldScore, new: newScore, delta, typeLabel, axis,
      axisOld: oldVal, axisNew: r[axis],
    });
  }

  checkRelationThresholds(k, idA, idB, axis, oldVal, r[axis]);
}

// ─── 修改：向后兼容旧调用 changeRelation(a,b,delta) ───────────────────────────
function changeRelation(idA, idB, delta, context = {}) {
  if (!delta || Math.abs(delta) < 0.05) return;
  changeAxis(idA, idB, 'affection',  delta * REL_DEFAULT_AXIS_SPLIT.affection  / REL_AXIS_WEIGHTS.affection, context);
  if (Math.abs(delta) >= 3)
    changeAxis(idA, idB, 'trust',    delta * REL_DEFAULT_AXIS_SPLIT.trust      / REL_AXIS_WEIGHTS.trust * 0.5, context);
  if (delta > 0)
    changeAxis(idA, idB, 'friendship', delta * REL_DEFAULT_AXIS_SPLIT.friendship / REL_AXIS_WEIGHTS.friendship * 0.3, context);
}

// ─── 检查互动轴条件 ───────────────────────────────────────────────────────────
function checkAxisReq(idA, idB, axisReq) {
  if (!axisReq) return { ok: true, missing: [] };
  const r = relations[relKey(idA, idB)] || { affection: 0, trust: 0, friendship: 0 };
  const missing = [];
  for (const [axis, cond] of Object.entries(axisReq)) {
    const val = axis === 'submission'
      ? (r.submission?.[idA] ?? 0)
      : (r[axis] ?? 0);
    if (cond.min !== undefined && val < cond.min)
      missing.push({ axis, need: cond.min, have: Math.round(val) });
    if (cond.max !== undefined && val > cond.max)
      missing.push({ axis, need: '≤' + cond.max, have: Math.round(val) });
  }
  return { ok: missing.length === 0, missing };
}

// ─── 阈值事件 ─────────────────────────────────────────────────────────────────
function checkRelationThresholds(key, idA, idB, axis, oldVal, newVal) {
  const events = CONFIG.relationThresholdEvents || DEFAULT_CONFIG.relationThresholdEvents || [];
  const r = relations[key];
  if (!r) return;
  for (const ev of events) {
    if (ev.axis !== axis) continue;
    if (r.thresholdEvents?.includes(ev.id)) continue;
    if (ev.requireInitType?.length && !ev.requireInitType.includes(r.initType)) continue;
    const crossed =
      (ev.direction === 'up'   && oldVal < ev.threshold && newVal >= ev.threshold) ||
      (ev.direction === 'down' && oldVal > ev.threshold && newVal <= ev.threshold);
    if (!crossed) continue;

    r.thresholdEvents = r.thresholdEvents || [];
    r.thresholdEvents.push(ev.id);

    for (const ef of ev.effects || []) {
      if (ef.system === 'relation')
        CharacterEffectSystem.apply({
          type: 'axis', idA, idB, axis: ef.axis || 'friendship', delta: ef.delta || 0,
        }, { source: `relation-threshold:${ev.id}`, reason: ev.name || '关系阈值事件' });
      else if (ef.system === 'state') {
        const targets = ef.target === 'both' ? [idA, idB] : ef.target === 'a' ? [idA] : [idB];
        for (const tid of targets) {
          CharacterEffectSystem.apply({
            type: 'state', charId: tid, stateId: ef.stateId,
          }, { source: `relation-threshold:${ev.id}`, reason: ev.name || '关系阈值事件' });
        }
      }
    }

    const cA = getChar(idA), cB = getChar(idB);
    if (ev.bubble?.a && cA)
      NarrativeBubbleSystem?.showBubble?.({ charId: idA, text: ev.bubble.a, style: 'thought', module: 'relation' });
    if (ev.bubble?.b && cB)
      setTimeout(() => NarrativeBubbleSystem?.showBubble?.({ charId: idB, text: ev.bubble.b, style: 'thought', module: 'relation' }), 1500);

    const logText = (ev.log || '')
      .replace(/\{A\}/g, cA?.short || idA)
      .replace(/\{B\}/g, cB?.short || idB);
    if (logText) log(logText, 'social');

    EventBus.emit('relation:threshold', { id: ev.id, axis, threshold: ev.threshold, idA, idB });
  }
}

// ─── 每帧衰减 ─────────────────────────────────────────────────────────────────
function tickRelationDecay(dt) {
  const gdm = getGameMinuteDelta(dt);
  const baseDecay = (CONFIG.relationDecayPerDay || 1) / 1440;
  for (const k of Object.keys(relations)) {
    const r = relations[k];
    // 好感
    if (r.affection > 0) r.affection = Math.max(0, r.affection - baseDecay * REL_AXIS_DECAY_MULT.affection * gdm);
    else if (r.affection < 0) r.affection = Math.min(0, r.affection + baseDecay * REL_AXIS_DECAY_MULT.affection * gdm * 0.5);
    // 信任
    if (r.trust > 0) r.trust = Math.max(0, r.trust - baseDecay * REL_AXIS_DECAY_MULT.trust * gdm);
    else if (r.trust < 0) r.trust = Math.min(0, r.trust + baseDecay * REL_AXIS_DECAY_MULT.trust * gdm * 0.5);
    // 友谊
    if (r.friendship > 0) r.friendship = Math.max(0, r.friendship - baseDecay * REL_AXIS_DECAY_MULT.friendship * gdm);
    else if (r.friendship < 0) r.friendship = Math.min(0, r.friendship + baseDecay * REL_AXIS_DECAY_MULT.friendship * gdm * 0.5);
    // 服从：向自然基线缓慢回归（需要知道角色 id 才能算基线）
    if (r.submission) {
      const [idA, idB] = k.split('|');
      for (const id of [idA, idB]) {
        const other = id === idA ? idB : idA;
        const base = getSubmissionBase(id, other);
        const cur  = r.submission[id] ?? base;
        const diff = base - cur;
        // 每次轻微回归基线（decay_mult 极小）
        if (Math.abs(diff) > 0.1)
          r.submission[id] = cur + diff * baseDecay * REL_AXIS_DECAY_MULT.submission * gdm;
      }
    }
  }
}

// ─── 存档序列化 ───────────────────────────────────────────────────────────────
function serializeRelations() {
  return JSON.parse(JSON.stringify(relations));
}

function deserializeRelations(saved) {
  relations = {};
  for (const [k, r] of Object.entries(saved || {})) {
    const [idA, idB] = k.split('|');
    relations[k] = migrateRelationEntry(r, idA, idB);
  }
}
