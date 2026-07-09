/* ═══════════════════ INTERACTION LLM (Ollama / 预留接口) ═══════════════════
 * 主控角色发起 dialogue 类互动时，调用本地模型生成双人台词。
 * 全局提示词见 prompts/interaction-global.txt
 */
const InteractionLlmSystem = (() => {
  let session = null;
  let cachedGlobalPrompt = null;
  let cachedTopicHints = null;
  let promptReady = Promise.resolve();
  let resolvedApiBase = null;
  let apiBaseReady = null;

  const RANK_LABEL = {
    0: '府中老祖宗',
    1: '老爷、夫人',
    2: '公子、小姐',
    3: '小姐',
    4: '贴身大丫鬟',
    5: '小丫鬟',
  };

  const SCENE_TYPE_LABEL = {
    public: '公共场所，宜含蓄',
    private: '私宅内室，可掏心腹',
    ritual: '礼仪正厅，宜端庄',
    forbidden: '禁地，宜谨慎',
  };

  const ATTR_LABEL = {
    constitution: '体质',
    sensitivity: '敏慧',
    charm: '魅力',
    intellect: '才智',
  };

  const TRAIT_LABEL = {
    fengliu: '风流', duoqing: '多情', shuchi: '书痴', qinggao: '清高', qingjie: '洁癖',
    haoke: '好客', lazy: '慵懒', kebo: '刻薄', chiwen: '痴顽', duanzheng: '端庄',
  };

  const CATEGORY_TONE = {
    xujiu: '家常闲话、问候礼数，气氛闲适',
    lundao: '论理辩难、评诗谈文，可有机锋',
    tiaoxiao: '打趣调侃，要熟稔，分寸别过',
    weijie: '倾听安抚，语气温软，少教训',
    chuanqing: '试探私语，含蓄暧昧，可羞怯',
    zhengchi: '讥讽争辩，语气渐硬，仍合府中礼法',
  };

  const VOICE_GUIDE = {
    baoyu: '多情絮叨，常用「呢」「罢」，怜香惜玉，厌仕途话',
    daiyu: '敏感尖新，好反问赌气，话里带试探与自怜',
    baochai: '圆融含蓄，劝人守分，少露锋芒',
    tanchun: '爽利有志，言简意劲，带当家气概',
    xiren: '温柔妥帖，先理后情，常劝诫体贴',
    qingwen: '爽利泼辣，嘴硬心软，心气不低',
    sheyue: '老实少言，稳妥周全，不多嘴',
    zijuan: '慧而深虑，为主子忧心，说话透亮',
    xueyan: '年幼怯懦，恭敬胆小，一片忠心',
    yinger: '爽利俏皮，手巧话直，体己亲昵',
    jiazheng: '端严古板，训诫多，少温情',
    wangfuren: '持重念佛，话里有规矩，护短',
    jiamu: '慈爱宽话，爱热闹，疼小辈',
    jiashe: '刻薄贪逸，话少情薄',
  };

  const FALLBACK_SYSTEM = `你是《红楼梦》大观园日常对话编剧。全文中文，禁止中英夹杂。说话人字段写角色简称（宝玉、黛玉），严禁甲乙。每句不超过三十字。只输出 JSON 数组：[{"说话人":"简称","台词":"…"}]`;

  function llmCfg() {
    return CONFIG.narrativeBubble?.settings?.llm || DEFAULT_CONFIG.narrativeBubble?.settings?.llm || {};
  }

  function isEnabled() {
    const l = llmCfg();
    return !!l.enabled && l.interactionEnabled !== false;
  }

  function modelName() {
    return llmCfg().model || 'qwen2.5:7b-instruct';
  }

  function resetApiBase() {
    resolvedApiBase = null;
    apiBaseReady = null;
  }

  function setEnabled(enabled) {
    if (!CONFIG.narrativeBubble) {
      CONFIG.narrativeBubble = JSON.parse(JSON.stringify(DEFAULT_CONFIG.narrativeBubble || { settings: {} }));
    }
    const s = CONFIG.narrativeBubble.settings || (CONFIG.narrativeBubble.settings = {});
    const def = DEFAULT_CONFIG.narrativeBubble?.settings?.llm || {};
    s.llm = { ...def, ...(s.llm || {}) };
    s.llm.enabled = !!enabled;
    s.llm.interactionEnabled = !!enabled;
    s.llm.manualEnabled = !!enabled;
    if (!s.llm.provider) s.llm.provider = 'ollama';
    if (!s.llm.apiBase) s.llm.apiBase = 'http://127.0.0.1:11434';
    if (!s.llm.apiProxy) s.llm.apiProxy = '/ollama';
    if (!s.llm.model) s.llm.model = 'qwen2.5:7b-instruct';
    resetApiBase();
    try { saveConfigToStorage?.(); } catch (_) {}
  }

  function isPlayerInitiated(c) {
    return c && CHARS[selectedIdx]?.id === c.id;
  }

  function shouldUse(c, target, tpl) {
    if (!isEnabled() || !isPlayerInitiated(c)) return false;
    if (tpl.type !== 'dialogue') return false;
    return !!(tpl.llmPrompt || llmCfg().interactionAllDialogues);
  }

  function shouldUseAwkward(c) {
    if (!isEnabled() || !isPlayerInitiated(c)) return false;
    return llmCfg().interactionLowScoreEnabled !== false;
  }

  function awkwardLineCount() {
    let n = llmCfg().interactionLowScoreLines ?? 4;
    if (n % 2 !== 0) n += 1;
    return Math.max(2, Math.min(8, n));
  }

  function formatAwkwardStates(onLow) {
    return (onLow?.effects || [])
      .filter(e => e.system === 'state')
      .map(e => {
        const sd = CONFIG.stateDefs?.[e.stateId];
        const who = e.target === 'target' ? '对象' : e.target === 'initiator' ? '发起人' : '双方';
        return `${who}陷「${sd?.name || e.stateId}」`;
      }).join('；') || '发起人尴尬';
  }

  function buildAwkwardUserPrompt(initiator, target, tpl, ctx) {
    const lineCount = awkwardLineCount();
    const score = ctx.score ?? getRelationValue(initiator.id, target.id);
    const minScore = ctx.minScore ?? InteractionScoreSystem?.getMinScore?.(tpl) ?? tpl.relMin ?? 0;
    const states = formatAwkwardStates(ctx.onLowScore);
    const mode = ctx.mode || 'lowscore';
    const sceneNote = mode === 'risk_fail'
      ? '本次逾矩未成：礼法不容或时机不对，须写出推拒、尴尬、欲言又止，不可写成圆满传情。'
      : `本次互动因情分不足（综合分${Math.round(score)}，宜≥${minScore}）未能正常展开：须写出试探、尴尬、冷淡回绝，不可写成亲热闲聊。`;
    return `请撰写一段大观园「${tpl.name}」试探/尴尬收场对白（恰好 ${lineCount} 句），由发起人「${initiator.short}」先开口，随后严格交替。

${buildCastBlock(initiator, target, [])}

${buildKinshipBlock(initiator, target)}

${buildInteractionContext(tpl, initiator, target)}

${buildWorldContext(initiator, target)}

${buildCharContextBlock(initiator, target.id, '发起人', target.short)}

${buildCharContextBlock(target, initiator.id, '对象', initiator.short)}

【双方关系】
${formatRelationPair(initiator.id, target.id, initiator.short, target.short)}

【尴尬收场·必体现】
${sceneNote}
收场后状态：${states}。
写作要求：话里有话、欲言又止；对方宜冷淡、推拒、打岔或沉默；发起人可羞赧、自悔、强撑。每句≤30字，纯中文。
只输出恰好 ${lineCount} 句的 JSON 数组：[{"说话人":"简称","台词":"……"}]`;
  }

  function buildAwkwardDialogueState(parsed, initiator, target, tpl) {
    const d = buildDialogueState(parsed, initiator, target, tpl);
    d.awkwardMode = true;
    d.maxLlmRounds = 1;
    d.naturalEnd = false;
    return d;
  }

  function getCharDef(id) {
    return CONFIG.characters?.find(ch => ch.id === id);
  }

  function getGender(def) {
    if (!def) return '未知';
    if (def.gender) return def.gender;
    if (def.trait === 'male') return '男';
    return '女';
  }

  function getIdentity(def) {
    if (!def) return '园中人物';
    return RANK_LABEL[def.socialRank] || '园中人物';
  }

  function getSceneDef(sceneId) {
    return CONFIG.scenes?.find(s => s.id === sceneId) || null;
  }

  function getSceneName(sceneId) {
    return getSceneDef(sceneId)?.name || '园中';
  }

  function relTone(score) {
    if (score >= 70) return '十分亲近，可不见外';
    if (score >= 40) return '熟络，说话随意些';
    if (score >= 10) return '平常，礼数仍在';
    if (score >= -20) return '略生疏，宜客气';
    return '疏远或有嫌隙，话里宜带防备';
  }

  function axisHint(val, high, low) {
    if (val >= high) return '高';
    if (val <= low) return '低';
    return '中';
  }

  function needLevel(val) {
    if (val < 15) return '告急';
    if (val < 35) return '偏低';
    if (val < 65) return '尚可';
    return '充裕';
  }

  function formatNeeds(c) {
    return getNeedDefs().map(nd => {
      const v = Math.round(c.needs?.[nd.key] ?? 50);
      return `${nd.label}${v}（${needLevel(v)}）`;
    }).join('、');
  }

  function formatAttributes(def) {
    if (!def?.attributes) return '未详';
    return Object.entries(def.attributes)
      .map(([k, v]) => `${ATTR_LABEL[k] || k}${v}`)
      .join('、');
  }

  function formatSkills(c) {
    const levels = c.skillLevels || {};
    return (c.skills || []).map(sk => {
      const name = CONFIG.skillDefs?.[sk]?.name || sk;
      const lv = levels[sk];
      return lv ? `${name}${lv}级` : name;
    }).join('、') || '无';
  }

  function formatStates(c) {
    if (!c.activeStates?.length) return '无';
    return c.activeStates.map(st => {
      const sd = CONFIG.stateDefs?.[st.id];
      const name = sd?.name || st.id;
      const desc = sd?.desc ? `：${sd.desc}` : '';
      const time = st.remaining === -1 ? '（长久）'
        : st.remaining > 0 ? `（约剩${Math.round(st.remaining)}分）` : '';
      return `${name}${time}${desc}`;
    }).join('；');
  }

  function formatMemories(c, otherId) {
    const all = c.memories || [];
    if (!all.length) return '无';
    const withOther = all.filter(m => m.with === otherId);
    const pool = [...withOther.slice(-4), ...all.filter(m => m.with !== otherId).slice(-3)];
    const seen = new Set();
    const picked = [];
    for (let i = pool.length - 1; i >= 0 && picked.length < 5; i--) {
      const m = pool[i];
      const key = m.text + (m.with || '');
      if (seen.has(key)) continue;
      seen.add(key);
      picked.unshift(m);
    }
    return picked.map(m => {
      const who = m.with ? (getChar(m.with)?.short || '') : '';
      const tag = m.tag ? `·${m.tag}` : '';
      const when = m.day != null ? `（第${m.day}日` + (m.hour != null ? `${m.hour}时` : '') + '）' : '';
      return `${m.text}${who ? `〔与${who}〕` : ''}${tag}${when}`;
    }).join('；');
  }

  function formatTraits(c) {
    const raw = typeof getCharTraits === 'function' ? getCharTraits(c) : [];
    const labels = raw.map(t => TRAIT_LABEL[t] || t);
    const display = CharSpecialtySystem?.getDisplayTraits?.(c) || [];
    const merged = [...new Set([...display, ...labels])];
    return merged.length ? merged.join('、') : '无';
  }

  function formatSpecialties(c) {
    const prof = CharSpecialtySystem?.profile?.(c.id);
    const specs = (prof?.specialties || []).map(s => s.name).filter(Boolean);
    const active = [];
    if (prof?.checks && CharSpecialtySystem?.evalCheck) {
      for (const [key, checkId] of Object.entries(prof.checks)) {
        if (checkId === 'always') continue;
        try {
          if (CharSpecialtySystem.evalCheck(c, checkId)) {
            const sp = prof.specialties?.find(s => s.id === key);
            if (sp?.name) active.push(sp.name);
          }
        } catch (_) { /* ignore */ }
      }
    }
    const parts = [];
    if (specs.length) parts.push(`专长：${specs.join('、')}`);
    if (active.length) parts.push(`此刻触动：${active.join('、')}`);
    return parts.join('；') || '无';
  }

  function formatDominantEmotion(c) {
    if (!c.activeStates?.length) return '平静';
    for (const st of c.activeStates) {
      const sd = CONFIG.stateDefs?.[st.id];
      if (!sd) continue;
      if (sd.conflictGroup === 'emotion' || /情绪|心境/.test(sd.desc || '') || sd.aiModifiers) {
        return sd.name;
      }
    }
    const first = CONFIG.stateDefs?.[c.activeStates[0].id];
    return first?.name || '心绪纷纭';
  }

  function formatBlockedSkills(c) {
    const blocked = new Set();
    for (const st of c.activeStates || []) {
      const sd = CONFIG.stateDefs?.[st.id];
      (sd?.blockedSkills || []).forEach(sk => blocked.add(CONFIG.skillDefs?.[sk]?.name || sk));
    }
    return blocked.size ? [...blocked].join('、') : '无';
  }

  function formatAction(c) {
    const a = c.action;
    if (!a) return c.statusText || '闲庭漫步';
    if (a.type === 'interaction' && a.target) {
      return `正与${a.target.short}进行「${a.tpl?.name || '互动'}」`;
    }
    if (a.type === 'talk' && a.target) return `正与${a.target.short}交谈`;
    if (a.type === 'furniture') {
      const inst = typeof getInstance === 'function' ? getInstance(a.instanceId) : null;
      const tpl = inst ? CONFIG.furnitureTemplates?.[inst.templateId] : null;
      return tpl ? `正使用${tpl.name}` : '正使用家具';
    }
    if (a.type === 'move') return '行走中';
    return c.statusText || '忙碌中';
  }

  function formatMood(c) {
    const stableMood = c.needs?.mood;
    const vals = getNeedDefs().map(n => c.needs?.[n.key] ?? 50);
    const avg = stableMood ?? (vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length));
    const low = getNeedDefs()
      .map(n => ({ label: n.label, val: c.needs?.[n.key] ?? 50 }))
      .filter(n => n.val < 30)
      .map(n => n.label + '不足');
    if (avg >= 80 && !low.length) return '心绪安宁';
    if (low.length) return '心绪受扰（' + low.join('、') + '）';
    if (avg < 40) return '心绪低落';
    return '平平常常';
  }

  function formatRelationToOther(selfId, otherId, otherLabel) {
    const info = typeof getRelationInfo === 'function'
      ? getRelationInfo(selfId, otherId)
      : { score: getRelationValue(selfId, otherId) };
    const sub = typeof getRelationAxis === 'function'
      ? getRelationAxis(selfId, otherId, 'submission') : 0;
    const aff = info.affection ?? 0;
    const trust = info.trust ?? 0;
    const parts = [relTone(info.score ?? 0)];
    if (aff >= 50) parts.push('心怀亲近');
    if (aff <= -10) parts.push('心有隔阂');
    if (trust >= 40) parts.push('肯信对方');
    if (trust <= -10) parts.push('心存戒备');
    if (sub >= 40) parts.push('言语恭顺');
    if (sub <= -20) parts.push('不服对方');
    return `对${otherLabel}：${parts.join('，')}`;
  }

  function formatRelationPair(idA, idB, labelA, labelB) {
    const info = typeof getRelationInfo === 'function'
      ? getRelationInfo(idA, idB)
      : { score: getRelationValue(idA, idB) };
    const lines = [
      `综合${info.score ?? 0}·${info.typeLabel || '路人'}·${relTone(info.score ?? 0)}`,
      info.initType ? `初识名目：${info.initType}` : '',
      `友爱${info.affection ?? 0}（${axisHint(info.affection ?? 0, 40, -10)}）、信任${info.trust ?? 0}（${axisHint(info.trust ?? 0, 35, -10)}）、情谊${info.friendship ?? 0}（${axisHint(info.friendship ?? 0, 35, -10)}）`,
      `${labelA}服${labelB}：${info.submissionAtoB ?? 0}；${labelB}服${labelA}：${info.submissionBtoA ?? 0}`,
      formatRelationToOther(idA, idB, labelB),
      formatRelationToOther(idB, idA, labelA),
    ];
    if (info.note) lines.push(`旧事注：${info.note}`);
    return lines.filter(Boolean).join('\n  ');
  }

  function formatQuests(c) {
    const list = QuestSystem?.getAcceptedFor?.(c.id) || [];
    if (!list.length) return '无';
    return list.slice(0, 3).map(inst => {
      const t = QuestSystem.tpl(inst.templateId);
      return t?.name || '任务';
    }).join('；');
  }

  function formatQueue(c) {
    const q = c.actionQueue || [];
    if (!q.length) return '无';
    return q.slice(0, 3).map(item => {
      if (item.type === 'furniture') {
        const inst = typeof getInstance === 'function' ? getInstance(item.instanceId) : null;
        const tpl = inst ? CONFIG.furnitureTemplates?.[inst.templateId] : null;
        return tpl ? `去${tpl.name}` : '去用家具';
      }
      if (item.type === 'interaction') {
        const t = typeof getInteractionTemplate === 'function' ? getInteractionTemplate(item.tplId) : null;
        const tgt = item.targetCharId ? getChar(item.targetCharId)?.short : '';
        return t ? `欲与${tgt}${t.name}` : '欲互动';
      }
      if (item.type === 'move') return '欲行走';
      return item.label || '待办';
    }).join('；');
  }

  function formatOthersInScene(sceneId, excludeIds) {
    const others = CHARS.filter(ch => ch.sceneId === sceneId && !excludeIds.includes(ch.id));
    if (!others.length) return '无旁人，仅二人';
    return others.slice(0, 4).map(ch => {
      const act = ch.action?.type === 'interaction' && ch.action.target
        ? `正与${ch.action.target.short}${ch.action.tpl?.name || '说话'}`
        : (ch.statusText || '闲逛');
      return `${ch.short}（${act}）`;
    }).join('、');
  }

  function getTopicHint(tpl, catName) {
    const text = cachedTopicHints || '';
    const keys = [tpl.name, catName, tpl.llmPrompt].filter(Boolean);
    for (const key of keys) {
      const re = new RegExp(`【${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}】\\s*([\\s\\S]*?)(?=\\n【|$)`);
      const m = text.match(re);
      if (m?.[1]?.trim()) return m[1].trim();
    }
    return CATEGORY_TONE[tpl.category] || '家常对话';
  }

  function flattenTplLineReferences(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.flatMap(item => Array.isArray(item) ? item : [item]).filter(Boolean);
    if (typeof value === 'object') return Object.values(value).flatMap(flattenTplLineReferences);
    return [value];
  }

  function formatTplReference(tpl, initiator, target) {
    const refs = flattenTplLineReferences(tpl.lineVariants).slice(0, 8);
    const lines = refs.length ? refs : (tpl.lines || []);
    if (!lines.length) return '';
    return lines.map(ln => String(ln)
      .replace(/\{A\}/g, initiator.short)
      .replace(/\{B\}/g, target.short)
    ).join(' / ');
  }

  function buildCharContextBlock(c, otherId, roleTag, otherLabel) {
    const def = getCharDef(c.id) || c;
    const scene = getSceneName(c.sceneId);
    const family = FamilySystem?.getCurrentFamily?.();
    const familyRole = typeof FamilySystem?.getCharRole === 'function'
      ? FamilySystem.getCharRole(c.id) : '';
    const lines = [
      `【${roleTag}·${c.short}】`,
      `姓名：${def.name || c.name}（${c.short}）·${getGender(def)}·${getIdentity(def)}${familyRole ? `·${familyRole}` : ''}`,
      family?.name ? `所属：${family.name}` : '',
      def.shortComment ? `评语：${def.shortComment}` : '',
      `此刻：${formatAction(c)}｜所在：${scene}`,
      `心绪：${formatMood(c)}｜主导情绪：${formatDominantEmotion(c)}`,
      `性格：${def.personality || '未详'}`,
      VOICE_GUIDE[c.id] ? `口吻：${VOICE_GUIDE[c.id]}` : '',
      `性情：${formatTraits(c)}`,
      def.memoryPalace ? `记忆宫殿：${def.memoryPalace}` : '',
      formatSpecialties(c),
      `属性：${formatAttributes(def)}`,
      `技能：${formatSkills(c)}`,
      `暂禁技能：${formatBlockedSkills(c)}`,
      `需求：${formatNeeds(c)}`,
      `状态：${formatStates(c)}`,
      formatRelationToOther(c.id, otherId, otherLabel),
      `近年记忆：${formatMemories(c, otherId)}`,
      `进行中任务：${formatQuests(c)}`,
      `后续打算：${formatQueue(c)}`,
    ];
    if (c.ai?.urgentNeed) {
      const nd = getNeedDefs().find(n => n.key === c.ai.urgentNeed);
      if (nd) lines.push(`当下执念：${nd.label}告急`);
    }
    if (c.ai?.state && c.ai.state !== 'IDLE') {
      const aiLabel = {
        EXECUTING: '忙着行事', SLEEPING: '歇息中', URGENT: '需求告急',
        PAUSED: '伫立待令', COOLDOWN: '略事歇息',
      }[c.ai.state] || '心绪不宁';
      lines.push(`心神：${aiLabel}`);
    }
    return lines.filter(Boolean).join('\n');
  }

  function buildWorldContext(initiator, target) {
    const sceneDef = getSceneDef(initiator.sceneId);
    const scene = sceneDef?.name || '园中';
    const season = typeof getSeasonLabel === 'function' ? getSeasonLabel() : '';
    const shichen = typeof getShichenLabel === 'function' ? getShichenLabel() : '';
    const period = typeof getPeriodLabel === 'function' ? getPeriodLabel() : '';
    const weather = typeof gameWeather !== 'undefined' ? gameWeather : '';
    const day = typeof gameDay !== 'undefined' ? `第${gameDay}日` : '';
    const sceneType = SCENE_TYPE_LABEL[sceneDef?.sceneType] || '';
    const dist = Math.round(Math.hypot(
      (initiator.gridCol || 0) - (target.gridCol || 0),
      (initiator.gridRow || 0) - (target.gridRow || 0),
    ));
    const proximity = dist <= 2 ? '咫尺相对' : dist <= 5 ? '近旁说话' : '隔了几步';
    return [
      '【场景实况】',
      `地点：${scene}${sceneType ? `（${sceneType}）` : ''}`,
      `时节：${day}·${season}·${shichen}·${period}·${weather}`,
      `距离：${proximity}`,
      `在场他人：${formatOthersInScene(initiator.sceneId, [initiator.id, target.id])}`,
    ].join('\n');
  }

  function formatExpectedEffects(tpl) {
    const parts = [];
    for (const ef of tpl.effects || []) {
      if (ef.system !== 'state' || !ef.stateId) continue;
      const sd = CONFIG.stateDefs?.[ef.stateId];
      const who = ef.target === 'target' ? '对象' : ef.target === 'initiator' ? '发起人' : '双方';
      const prob = ef.prob != null && ef.prob < 1 ? `（${Math.round(ef.prob * 100)}%）` : '';
      parts.push(`${who}或得「${sd?.name || ef.stateId}」${prob}`);
    }
    for (const ef of tpl.onLowScore?.effects || []) {
      if (ef.system !== 'state' || !ef.stateId) continue;
      const sd = CONFIG.stateDefs?.[ef.stateId];
      const who = ef.target === 'target' ? '对象' : ef.target === 'initiator' ? '发起人' : '双方';
      parts.push(`情分不足时${who}或陷「${sd?.name || ef.stateId}」`);
    }
    return parts.length ? parts.join('；') : '无特别状态';
  }

  function buildCastBlock(initiator, target, prior) {
    const a = getCharDef(initiator.id);
    const b = getCharDef(target.id);
    const nextId = prior?.length
      ? (prior[prior.length - 1].speakerId === initiator.id ? target.id : initiator.id)
      : initiator.id;
    const next = nextId === initiator.id ? initiator : target;
    const lines = [
      '【角色指派·切忌弄反】',
      `发起人：${a?.name || initiator.name}（简称「${initiator.short}」，${getGender(a)}）`,
      `对话对象：${b?.name || target.name}（简称「${target.short}」，${getGender(b)}）`,
      `输出时「说话人」只能写「${initiator.short}」或「${target.short}」，严禁写甲、乙、A、B。`,
    ];
    if (prior?.length) {
      lines.push(`续写第一句由「${next.short}」接话（紧接上文，勿重开话题）。`);
    } else {
      lines.push(`第一句由发起人「${initiator.short}」开口，随后严格交替。`);
    }
    return lines.join('\n');
  }

  function buildContinuationBlock(prior, initiator, target) {
    if (!prior?.length) return '';
    const lines = prior.map(ln => {
      const sp = ln.speakerId === initiator.id ? initiator.short : target.short;
      return `${sp}：${ln.text}`;
    });
    const last = prior[prior.length - 1];
    const lastSp = getChar(last.speakerId)?.short || '';
    return [
      '',
      '【已有对话·续写必须衔接】',
      ...lines,
      '---',
      `末句是${lastSp}说的。续写须自然接话，延续情绪与话题，不可重复已说内容，不可另起炉灶。`,
    ].join('\n');
  }

  function buildTopicShiftBlock(fromTpl, toTpl) {
    if (!fromTpl || !toTpl || fromTpl.id === toTpl.id) return '';
    const fromCat = CONFIG.interactionCategories?.find(x => x.id === fromTpl.category)?.name || fromTpl.category;
    const toCat = CONFIG.interactionCategories?.find(x => x.id === toTpl.category)?.name || toTpl.category;
    return [
      '',
      '【话题转折·须沉静过渡】',
      `二人方才还在「${fromTpl.name}」（${fromCat}），现在意犹未尽地转向「${toTpl.name}」（${toCat}）。`,
      '这是同一场面谈里的自然转圜，不是重新见面。',
      '续写第一句宜有一两句承上启下，语气勿突兀，情绪可延续亦可微微一变。',
    ].join('\n');
  }

  function buildKinshipBlock(initiator, target) {
    const addr = IdentityProtocolSystem?.formatAddressBlock?.(initiator, target);
    if (!addr) return '';
    return `【称呼与礼法·必守】\n${addr}`;
  }

  function buildInteractionContext(tpl, initiator, target) {
    const cat = CONFIG.interactionCategories?.find(x => x.id === tpl.category)?.name || tpl.category;
    const topic = getTopicHint(tpl, cat);
    const ref = formatTplReference(tpl, initiator, target);
    const protocol = IdentityProtocolSystem?.formatInteractionProtocol?.(initiator, target, tpl) || '';
    const lines = [
      '【本次互动类型·全文须体现】',
      `玩家选择的是「${tpl.name}」（${cat}类），不是普通闲谈。`,
      `写作重点：${topic}`,
      `类别基调：${CATEGORY_TONE[tpl.category] || '家常'}`,
      `发起者心绪：${CoreNeedSystem?.socialToneHint?.(initiator) || '平常'}`,
      `对方心绪：${CoreNeedSystem?.socialToneHint?.(target) || '平常'}`,
      `听众须一听便知是在「${tpl.name}」，勿写成寒暄或无关话题。`,
      protocol ? `礼法提示：${protocol}` : '',
      `对话后可能状态：${formatExpectedEffects(tpl)}`,
    ];
    if (ref) lines.push(`模板参考（勿照抄，仅借鉴语气）：${ref}`);
    return lines.join('\n');
  }

  function loadPrompts() {
    const cfg = llmCfg();
    const globalPath = cfg.promptGlobalPath || 'prompts/interaction-global.txt';
    const topicsPath = cfg.promptTopicsPath || 'prompts/interaction-topics.txt';
    if (window.location.protocol === 'file:') {
      promptReady = Promise.resolve();
      return promptReady;
    }
    promptReady = Promise.all([
      fetch(globalPath).then(r => (r.ok ? r.text() : '')).catch(() => ''),
      fetch(topicsPath).then(r => (r.ok ? r.text() : '')).catch(() => ''),
    ]).then(([global, topics]) => {
      cachedGlobalPrompt = (global || '').trim() || null;
      cachedTopicHints = (topics || '').trim() || null;
    });
    return promptReady;
  }

  function buildSystemPrompt() {
    const cfgText = (llmCfg().systemPrompt || '').trim();
    if (cfgText) return cfgText;
    return cachedGlobalPrompt || FALLBACK_SYSTEM;
  }

  function getSegmentLineCount(segmentRound) {
    const cfg = llmCfg();
    const min = cfg.interactionLinesMin ?? 4;
    const max = cfg.interactionLinesMax ?? 10;
    const growth = cfg.interactionLinesGrowth ?? 2;
    let n = Math.min(max, min + Math.max(0, segmentRound - 1) * growth);
    if (n % 2 !== 0) n += 1;
    return Math.max(min, Math.min(max, n));
  }

  function getDepthHint(segmentRound, isContinue) {
    if (!isContinue) {
      return '本段起笔：点题或寒暄，可及眼前景致、府中近况，为后文议论人事埋伏笔。';
    }
    if (segmentRound <= 2) {
      return '本段承上：须议论具体的人或旧事（亲戚、丫鬟、旧闻），言之有物，比上段深一层。';
    }
    return '本段再进：触及其心思、隐情或彼此关系，情绪可有起伏，止于有余味的一句。';
  }

  function buildUserPrompt(initiator, target, tpl, prior, segmentRound, shiftFromTpl) {
    const round = segmentRound || 1;
    const lineCount = getSegmentLineCount(round);
    const isContinue = prior?.length > 0;
    const isShift = !!(shiftFromTpl && shiftFromTpl.id !== tpl.id);
    const task = isShift
      ? `请在同一场面谈中自然转折，续写一段对白（${lineCount} 句），紧接【已有对话】后转向「${tpl.name}」，由指定角色先开口，随后严格交替。`
      : isContinue
        ? `请续写一段连续对白（${lineCount} 句），紧接【已有对话】，由指定角色先开口，随后「${initiator.short}」「${target.short}」严格交替。`
        : `请撰写一段大观园互动对白（${lineCount} 句），由发起人「${initiator.short}」先开口，随后严格交替。`;

    return `${task}

${buildCastBlock(initiator, target, prior)}

${buildKinshipBlock(initiator, target)}

${buildInteractionContext(tpl, initiator, target)}

${buildWorldContext(initiator, target)}

${buildCharContextBlock(initiator, target.id, '发起人', target.short)}

${buildCharContextBlock(target, initiator.id, '对象', initiator.short)}

【双方关系】
  ${formatRelationPair(initiator.id, target.id, initiator.short, target.short)}${buildContinuationBlock(prior, initiator, target)}${buildTopicShiftBlock(shiftFromTpl, tpl)}

【本段节奏·第 ${round} 段】
${isShift ? '本段是话题转折：先轻轻收住上文，再渐入新互动，忌像重新开场。' : getDepthHint(round, isContinue)}

写作要求：
1. 说话人只写「${initiator.short}」或「${target.short}」，勿弄反。
2. 本段 ${lineCount} 句，层层递进，议论人事、心事，忌空泛客套。
3. ${isShift ? `须体现由「${shiftFromTpl.name}」转向「${tpl.name}」，过渡要沉静自然。` : isContinue ? '紧承上文，勿重开话题。' : `全文须体现「${tpl.name}」互动，勿写成普通闲谈。`}
4. 严守【称呼与礼法】中的关系名目与相称，婆媳、主仆、祖孙等不可弄反。
5. 每句不超过三十字，纯中文；告辞、要去忙只写在台词里，勿加额外 JSON 字段。
只输出恰好 ${lineCount} 句的 JSON 数组：[{"说话人":"简称","台词":"……"}]`;
  }

  function describeFetchError(err) {
    const cfg = llmCfg();
    const base = getApiBase();
    if (window.location.protocol === 'file:') {
      return '游戏通过本地文件打开，浏览器无法访问模型。请运行 node serve.mjs 后打开 http://127.0.0.1:8765';
    }
    const msg = err?.message || String(err);
    if (err?.name === 'AbortError' || /超时|timeout/i.test(msg)) {
      return `模型请求超时。上下文较长时请稍候重试，或换用更小模型。`;
    }
    if (err instanceof TypeError && /fetch|network|Failed to fetch/i.test(msg)) {
      return `无法连接本地模型（${base}）。请确认 ollama serve 已运行，且已拉取 ${cfg.model || 'qwen2.5:7b-instruct'}`;
    }
    return msg;
  }

  function getApiBase() {
    if (resolvedApiBase) return resolvedApiBase;
    const cfg = llmCfg();
    return (cfg.apiBase || 'http://127.0.0.1:11434').replace(/\/$/, '');
  }

  function resolveApiBase() {
    if (apiBaseReady) return apiBaseReady;
    apiBaseReady = (async () => {
      const cfg = llmCfg();
      if (window.location.protocol === 'file:') {
        resolvedApiBase = (cfg.apiBase || 'http://127.0.0.1:11434').replace(/\/$/, '');
        return resolvedApiBase;
      }
      const candidates = [];
      if (cfg.apiProxy) {
        candidates.push(`${window.location.origin}${cfg.apiProxy}`.replace(/\/$/, ''));
      }
      if (window.location.port === '8765') {
        candidates.push(`${window.location.origin}/ollama`);
      }
      candidates.push((cfg.apiBase || 'http://127.0.0.1:11434').replace(/\/$/, ''));
      const seen = new Set();
      for (const base of candidates) {
        if (!base || seen.has(base)) continue;
        seen.add(base);
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 5000);
          const r = await fetch(`${base}/api/tags`, { method: 'GET', signal: ctrl.signal });
          clearTimeout(timer);
          if (r.ok) {
            resolvedApiBase = base;
            console.log('[InteractionLlm] 使用模型地址', base);
            return base;
          }
        } catch (_) { /* try next */ }
      }
      resolvedApiBase = (cfg.apiBase || 'http://127.0.0.1:11434').replace(/\/$/, '');
      console.warn('[InteractionLlm] 未能探测到可用代理，直连', resolvedApiBase);
      return resolvedApiBase;
    })();
    return apiBaseReady;
  }

  async function startLocalOllama() {
    if (window.location.protocol === 'file:') {
      return { ok: false, message: '请先运行 node serve.mjs 后从 http://127.0.0.1:8765 打开游戏，浏览器文件模式不能拉起 Ollama。' };
    }
    resetApiBase();
    const startUrl = `${window.location.origin}/ollama/start`;
    try {
      const r = await fetch(startUrl, { method: 'POST' });
      if (r.ok) {
        await resolveApiBase();
        return { ok: true, message: `本地模型已就绪：${modelName()}` };
      }
      let detail = '';
      try {
        const data = await r.json();
        detail = data.error || data.message || '';
      } catch (_) {
        detail = await r.text().catch(() => '');
      }
      const ready = await probeOllama();
      if (ready) return { ok: true, message: `本地模型已就绪：${modelName()}` };
      return { ok: false, message: detail || `无法启动 Ollama。请确认本机已安装 ollama，并可运行 ollama serve。` };
    } catch (err) {
      const ready = await probeOllama();
      if (ready) return { ok: true, message: `本地模型已就绪：${modelName()}` };
      return { ok: false, message: describeFetchError(err) };
    }
  }

  function charNames(c) {
    const def = getCharDef(c.id);
    return [c.short, def?.name].filter(Boolean);
  }

  function matchCharId(spRaw, initiator, target) {
    const s = String(spRaw || '').trim();
    if (!s) return null;
    if (/^甲|发起|^a$/i.test(s)) return initiator.id;
    if (/^乙|对象|^b$/i.test(s)) return target.id;
    if (charNames(initiator).some(n => s === n)) return initiator.id;
    if (charNames(target).some(n => s === n)) return target.id;
    return null;
  }

  function firstSpeakerId(prior, initiator, target) {
    if (!prior?.length) return initiator.id;
    const last = prior[prior.length - 1];
    return last.speakerId === initiator.id ? target.id : initiator.id;
  }

  function cleanLineText(t, initiator, target) {
    let s = String(t).trim();
    for (const n of [...charNames(initiator), ...charNames(target)]) {
      s = s.replace(new RegExp(`^${n}[：:]\\s*`), '');
    }
    return s.replace(/^[^：:]+[：:]\s*/, '').replace(/^[「『"']/, '').replace(/[」』"']$/, '');
  }

  function pushParsedLine(lines, speakers, item, initiator, target, expectId) {
    const lineText = item?.台词 ?? item?.text ?? item?.line ?? item?.content;
    if (!lineText) return expectId;
    const t = cleanLineText(lineText, initiator, target);
    const spRaw = item?.说话人 ?? item?.speaker ?? item?.角色 ?? '';
    let speakerId = matchCharId(spRaw, initiator, target);
    if (speakerId !== initiator.id && speakerId !== target.id) speakerId = expectId;
    if (speakerId !== expectId) speakerId = expectId;
    speakers.push(speakerId);
    lines.push(t);
    return speakerId === initiator.id ? target.id : initiator.id;
  }

  function buildParsedResult(lines, speakers) {
    return lines.length ? { lines, speakers } : null;
  }

  function parseLinesFromArray(arr, initiator, target, prior) {
    const lines = [];
    const speakers = [];
    let expectId = firstSpeakerId(prior, initiator, target);
    for (const item of arr) {
      expectId = pushParsedLine(lines, speakers, item, initiator, target, expectId);
    }
    return buildParsedResult(lines, speakers);
  }

  function parseLinesByRegex(text, initiator, target, prior) {
    const lines = [];
    const speakers = [];
    let expectId = firstSpeakerId(prior, initiator, target);
    const re = /["']?(?:说话人|speaker|角色)["']?\s*[:：]\s*["']([^"']+)["'][\s\S]*?["']?(?:台词|text|line|content)["']?\s*[:：]\s*["']((?:\\.|[^"\\])*)["']/gi;
    let m;
    while ((m = re.exec(text)) !== null) {
      const item = {
        说话人: m[1],
        台词: m[2].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
      };
      expectId = pushParsedLine(lines, speakers, item, initiator, target, expectId);
    }
    return buildParsedResult(lines, speakers);
  }

  function parseLines(raw, initiator, target, prior) {
    if (!raw) return null;
    let text = String(raw).trim();
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
    const m = text.match(/\[[\s\S]*\]/);
    if (m) {
      let jsonText = m[0];
      try {
        return parseLinesFromArray(JSON.parse(jsonText), initiator, target, prior);
      } catch (e) {
        jsonText = jsonText.replace(/,\s*([}\]])/g, '$1');
        try {
          return parseLinesFromArray(JSON.parse(jsonText), initiator, target, prior);
        } catch (e2) {
          console.warn('[InteractionLlm] JSON 解析失败，尝试正则提取', e2);
        }
      }
    }
    const regexResult = parseLinesByRegex(text, initiator, target, prior);
    if (regexResult) return regexResult;
    console.warn('[InteractionLlm] 无法解析模型输出', text.slice(0, 240));
    return null;
  }

  async function callOllama(userPrompt) {
    if (window.location.protocol === 'file:') {
      throw new Error(describeFetchError(new TypeError('Failed to fetch')));
    }
    await Promise.all([promptReady, resolveApiBase()]);
    const cfg = llmCfg();
    const base = getApiBase();
    const model = cfg.model || 'qwen2.5:7b-instruct';
    const url = cfg.provider === 'ollama' || !cfg.apiUrl
      ? `${base}/api/chat`
      : cfg.apiUrl;

    const payload = cfg.provider === 'ollama' || url.includes('/api/chat')
      ? {
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
        options: { temperature: 0.88, num_predict: 1536 },
      }
      : {
        system: buildSystemPrompt(),
        prompt: userPrompt,
        context: { source: 'interaction' },
      };

    const timeoutMs = cfg.requestTimeoutMs || 180000;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', ...(cfg.apiKey ? { Authorization: 'Bearer ' + cfg.apiKey } : {}) },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      throw new Error(describeFetchError(err));
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`模型返回 ${res.status}${detail ? '：' + detail.slice(0, 120) : ''}`);
    }
    const data = await res.json();
    return data.message?.content || data.text || data.content || data.message || '';
  }

  function overlayEl() { return document.getElementById('llm-dialogue-overlay'); }

  function captureRelBaseline(idA, idB) {
    const ri = getRelationInfo(idA, idB);
    return {
      score: ri.score,
      affection: ri.affection,
      trust: ri.trust,
      friendship: ri.friendship,
      submissionAtoB: ri.submissionAtoB,
      submissionBtoA: ri.submissionBtoA,
    };
  }

  function relAxisBaseValue(axis, base) {
    return base?.[axis?.baselineKey || axis?.key] ?? 0;
  }

  function relStageText(stage) {
    return typeof relationStageDisplay === 'function'
      ? relationStageDisplay(stage)
      : (stage?.label || '');
  }

  function renderHudRelBar(axis, base) {
    if (!axis?.active) return '';
    const range = typeof relationAxisRange === 'function'
      ? relationAxisRange(axis.key)
      : { min: -100, max: 100 };
    const min = range.min;
    const max = range.max;
    const val = axis.value ?? 0;
    const color = axis.color || 'var(--jn-text-muted)';
    const baseVal = relAxisBaseValue(axis, base);
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    const d = Math.round(val - baseVal);
    const delta = d ? `<span class="ldo-delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${d}</span>` : '';
    const valStr = (min < 0 && val >= 0 ? '+' : '') + Math.round(val);
    const changeClass = d > 0 ? ' rising' : d < 0 ? ' falling' : '';
    const stage = relStageText(axis.stage);
    const title = `${axis.label}${stage ? ` · ${stage}` : ''}：${valStr}${d ? `（${d > 0 ? '+' : ''}${d}）` : ''}`;
    return `<div class="ldo-bar-row${changeClass}" title="${escapeHtml(title)}">
      <span class="ldo-bar-label">${escapeHtml(axis.label)}</span>
      <div class="ldo-bar-track"><div class="ldo-bar-fill" style="width:${pct}%;background:${color}"></div></div>
      <span class="ldo-bar-val">${valStr}${delta}</span>
    </div>`;
  }

  function renderHudScoreBar(score, base, label) {
    const pct = Math.max(0, Math.min(100, (score + 100) / 2));
    const d = Math.round(score - base);
    const delta = d ? `<span class="ldo-delta ${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${d}</span>` : '';
    const scoreStr = (score >= 0 ? '+' : '') + score;
    const changeClass = d > 0 ? ' rising' : d < 0 ? ' falling' : '';
    const text = label || '萍水相逢';
    return `<div class="ldo-bar-row ldo-bar-score${changeClass}" title="${escapeHtml(text)}：${scoreStr}${d ? `（${d > 0 ? '+' : ''}${d}）` : ''}">
      <span class="ldo-bar-label">${escapeHtml(text)}</span>
      <div class="ldo-bar-track"><div class="ldo-bar-fill" style="width:${pct}%;background:var(--jn-gold)"></div></div>
      <span class="ldo-bar-val">${scoreStr}${delta}</span>
    </div>`;
  }

  function renderCharStates(c) {
    if (!c?.activeStates?.length) {
      return '<span class="ldo-state-tag neutral">无状态</span>';
    }
    return c.activeStates.slice(0, 4).map(st => {
      const sd = CONFIG.stateDefs?.[st.id];
      const name = sd?.name || st.id;
      let cls = 'neutral';
      if (typeof getStateTagClass === 'function') cls = getStateTagClass(st.id);
      return `<span class="ldo-state-tag ${cls}" title="${escapeHtml(sd?.desc || '')}">${escapeHtml(name)}</span>`;
    }).join('');
  }

  function renderDialogueAvatar(c) {
    const src = typeof AssetSystem !== 'undefined'
      ? (AssetSystem.avatarUrlForChar?.(c) || AssetSystem.portraitUrlForChar?.(c))
      : null;
    if (src) {
      return `<div class="ldo-av"><img src="${escapeHtml(src)}" alt="${escapeHtml(c.short)}"></div>`;
    }
    return `<div class="ldo-av ldo-av-fallback" style="background:${c.color}" aria-label="${escapeHtml(c.short)}"></div>`;
  }

  function getSpeakingCharId() {
    const act = getActiveAction();
    const d = act?.dialogue;
    if (!d || d.waitUser || d.phase === 'llm_generating') return null;
    return d.speakers?.[d.lineIdx] || null;
  }

  function renderParticipantsHud() {
    const el = document.getElementById('ldo-participants');
    if (!el || !session) return;
    const initId = session.initiatorId || session.c?.id;
    const tgtId = session.targetId || session.target?.id;
    if (!initId || !tgtId) {
      el.innerHTML = '';
      return;
    }
    const a = getChar(initId);
    const b = getChar(tgtId);
    if (!a || !b) return;

    const ri = getRelationInfo(initId, tgtId);
    const base = session.relBaseline || captureRelBaseline(initId, tgtId);
    const speakingId = getSpeakingCharId();

    const axes = typeof relationAxisDisplayModel === 'function'
      ? relationAxisDisplayModel(ri, a, b)
      : [
        { key: 'friendship', baselineKey: 'friendship', label: '友谊', value: ri.friendship, stage: ri.axisStages.friendship, color: 'var(--jn-green-bright)', active: true },
        { key: 'affection', baselineKey: 'affection', label: '姻缘', value: ri.affection, stage: ri.axisStages.affection, color: 'var(--jn-red-deep)', active: true },
        { key: 'trust', baselineKey: 'trust', label: '信任', value: ri.trust, stage: ri.axisStages.trust, color: 'var(--jn-blue-deep)', active: true },
        { key: 'submission', baselineKey: 'submissionAtoB', label: '体恤', value: ri.submissionAtoB, stage: ri.axisStages.submissionAtoB, color: 'var(--jn-purple)', active: true },
      ];
    const axisHtml = axes.map(axis => renderHudRelBar(axis, base)).join('');
    const scoreLabel = typeof relationCenterLabel === 'function' ? relationCenterLabel(ri) : (ri.typeLabel || '萍水相逢');

    el.innerHTML = `
      <div class="ldo-char${speakingId === a.id ? ' speaking' : ''}">
        ${renderDialogueAvatar(a)}
        <div class="ldo-char-name">${escapeHtml(a.short)}</div>
        <div class="ldo-char-act">${escapeHtml(a.statusText || '')}</div>
        <div class="ldo-char-states">${renderCharStates(a)}</div>
      </div>
      <div class="ldo-rel-center">
        ${renderHudScoreBar(ri.score, base.score, scoreLabel)}
        <div class="ldo-rel-bars">${axisHtml}</div>
      </div>
      <div class="ldo-char${speakingId === b.id ? ' speaking' : ''}">
        ${renderDialogueAvatar(b)}
        <div class="ldo-char-name">${escapeHtml(b.short)}</div>
        <div class="ldo-char-act">${escapeHtml(b.statusText || '')}</div>
        <div class="ldo-char-states">${renderCharStates(b)}</div>
      </div>`;
  }

  function bindHudListeners() {
    unbindHudListeners();
    const refresh = () => renderParticipantsHud();
    session.hudUnsubs = [
      EventBus.on('relation:change', refresh),
      EventBus.on('relation:axis_change', refresh),
      EventBus.on('state:add', refresh),
      EventBus.on('state:remove', refresh),
      EventBus.on('state:refresh', refresh),
      EventBus.on('interaction:state', refresh),
      EventBus.on('interaction:effects', refresh),
    ];
  }

  function unbindHudListeners() {
    session?.hudUnsubs?.forEach(fn => { if (typeof fn === 'function') fn(); });
    if (session) session.hudUnsubs = [];
  }

  function initParticipantsHud(initiator, target) {
    if (!session) return;
    session.initiatorId = initiator.id;
    session.targetId = target.id;
    session.relBaseline = captureRelBaseline(initiator.id, target.id);
    bindHudListeners();
    renderParticipantsHud();
  }

  function closeShiftPanel() {
    const wrap = document.getElementById('ldo-shift-wrap');
    const btnShift = document.getElementById('ldo-shift');
    if (wrap) wrap.hidden = true;
    if (btnShift) btnShift.classList.remove('active');
  }

  function getSwitchableItems() {
    const c = session?.c;
    const act = getActiveAction();
    if (!c || !act?.target) return [];
    const curId = act.tpl?.id;
    const out = [];
    for (const group of getAvailableInteractions(c, act.target)) {
      for (const { tpl, ok, reason } of group.items) {
        if (tpl.type !== 'dialogue' || tpl.id === curId) continue;
        if (ok === false || ok === 0) continue;
        out.push({ tpl, cat: group.cat, ok, reason, llm: shouldUse(c, act.target, tpl) });
      }
    }
    return out;
  }

  function renderShiftPanel() {
    const list = document.getElementById('ldo-shift-list');
    if (!list) return;
    const items = getSwitchableItems();
    if (!items.length) {
      list.innerHTML = '<span class="ldo-shift-empty">暂无其他可用对话互动</span>';
      return;
    }
    list.innerHTML = items.map(({ tpl, cat, llm, ok }) => {
      const low = ok === 'low';
      return `<button type="button" class="ldo-shift-opt${low ? ' ldo-warn' : ''}" data-iid="${tpl.id}" title="${escapeHtml(cat.name)}${low ? ' · 情分略不足' : ''}">
        <span class="ldo-shift-name">${escapeHtml(tpl.name)}</span>
        ${llm ? '<span class="ldo-shift-llm" title="模型生成对白">墨</span>' : ''}
      </button>`;
    }).join('');
    list.querySelectorAll('.ldo-shift-opt').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const tpl = getInteractionTemplate(+btn.dataset.iid);
        if (tpl) requestSwitchInteraction(tpl);
      };
    });
  }

  function pauseForShift() {
    const act = getActiveAction();
    const d = act?.dialogue;
    if (!d?.llmMode) return;
    d.waitUser = true;
    const speaker = getChar(d.speakers?.[d.lineIdx]);
    const line = d.lines?.[d.lineIdx];
    const preview = speaker && line ? `${speaker.short}：「${line}」` : '谈话暂歇，可择新互动';
    setOverlay('paused', {
      preview,
      meta: `${act.tpl?.name || '互动'} · 话脉将承继`,
    });
  }

  function toggleShiftPanel() {
    const wrap = document.getElementById('ldo-shift-wrap');
    const btnShift = document.getElementById('ldo-shift');
    if (!wrap || !btnShift) return;
    const act = getActiveAction();
    if (!act?.dialogue?.llmMode || act.dialogue.phase === 'llm_generating') return;
    if (!wrap.hidden) {
      closeShiftPanel();
      if (act.dialogue.waitUser) {
        setOverlay('waiting', {
          preview: overlayEl()?.querySelector('.ldo-preview')?.textContent || '…',
          meta: `${session?.c?.short}与${act.target?.short} · ${act.tpl?.name}`,
        });
      }
      return;
    }
    pauseForShift();
    renderShiftPanel();
    wrap.hidden = false;
    btnShift.classList.add('active');
  }

  function buildSpokenPrior(d) {
    return [...(d.history || [])];
  }

  function requestSwitchInteraction(newTpl) {
    const c = session?.c;
    const act = getActiveAction();
    const d = act?.dialogue;
    if (!c || !act || !d?.llmMode || d.phase === 'llm_generating') return;
    const target = act.target;
    const oldTpl = act.tpl;
    if (oldTpl.id === newTpl.id) { closeShiftPanel(); return; }

    const chk = checkInteractionAvailable(c, target, newTpl);
    if (chk.ok === false || chk.ok === 0) {
      setOverlay('paused', { preview: `「${newTpl.name}」不可用：${chk.reason}` });
      return;
    }

    closeShiftPanel();
    d.waitUser = true;
    if (d.lineIdx > 0) finishSegmentRelation(c, act);

    const prior = buildSpokenPrior(d);
    const nextRound = (d.llmRound || 1) + 1;
    if (prior.length && nextRound > d.maxLlmRounds) {
      setOverlay('paused', { preview: '话已够多，不宜再转话题。可继续播完或终止。' });
      return;
    }

    act.tpl = newTpl;
    session.tpl = newTpl;
    c.statusText = `与${target.short}·${newTpl.name}`;
    target.statusText = `与${c.short}·${newTpl.name}`;
    if (c.actionQueue[0]?.type === 'interaction') c.actionQueue[0].interactionId = newTpl.id;

    d.prefetch = null;
    speechBubble = null;

    if (!shouldUse(c, target, newTpl)) {
      const dialogue = buildInteractionDialogue(c, target, newTpl);
      Object.assign(d, dialogue, { llmMode: false, waitUser: true });
      setOverlay('waiting', {
        preview: `已转为「${newTpl.name}」（模板台词）`,
        meta: `${c.short}与${target.short}`,
      });
      uiDirty = true;
      return;
    }

    d.phase = 'llm_generating';
    setOverlay('generating', {
      preview: '话题缓缓转了一转…',
      meta: `由「${oldTpl.name}」转向「${newTpl.name}」`,
    });

    fetchLines(c, target, newTpl, prior, nextRound, oldTpl).then(parsed => {
      if (!getActiveAction() || session?.c !== c || act.tpl?.id !== newTpl.id) return;
      if (!parsed) {
        act.tpl = oldTpl;
        session.tpl = oldTpl;
        c.statusText = `与${target.short}·${oldTpl.name}`;
        target.statusText = `与${c.short}·${oldTpl.name}`;
        if (c.actionQueue[0]?.type === 'interaction') c.actionQueue[0].interactionId = oldTpl.id;
        setOverlay('paused', { preview: '转折续写失败，保持原话题' });
        return;
      }
      applyParsedSegment(d, parsed, nextRound);
      d.waitUser = true;
      setOverlay('waiting', {
        preview: `已承上文转向「${newTpl.name}」，共 ${parsed.lines.length} 句`,
        meta: `${c.short}与${target.short} · 点「开始播放」`,
      });
      uiDirty = true;
    }).catch(() => {
      act.tpl = oldTpl;
      session.tpl = oldTpl;
      c.statusText = `与${target.short}·${oldTpl.name}`;
      target.statusText = `与${c.short}·${oldTpl.name}`;
      if (c.actionQueue[0]?.type === 'interaction') c.actionQueue[0].interactionId = oldTpl.id;
      setOverlay('error', { preview: '转折续写失败' });
    });
  }

  function setOverlay(state, opts = {}) {
    const el = overlayEl();
    if (!el) return;
    el.classList.add('visible');
    el.dataset.state = state;
    const status = el.querySelector('.ldo-status');
    const preview = el.querySelector('.ldo-preview');
    const meta = el.querySelector('.ldo-meta');
    const btnGo = el.querySelector('#ldo-continue');
    const btnStop = el.querySelector('#ldo-stop');
    const btnShift = el.querySelector('#ldo-shift');
    if (status) {
      const map = {
        generating: '生成中…',
        replying: '播放中',
        waiting: '待开始',
        paused: '暂歇',
        error: '生成失败，已用模板台词',
      };
      status.textContent = map[state] || state;
    }
    if (preview) preview.textContent = opts.preview || '';
    if (meta) meta.textContent = opts.meta || '';
    const busy = state === 'generating';
    const playing = state === 'replying';
    const llmActive = !!session?.c?.action?.dialogue?.llmMode;
    if (btnGo) {
      btnGo.disabled = busy || playing;
      btnGo.style.display = playing ? 'none' : '';
    }
    if (btnStop) btnStop.disabled = busy;
    if (btnShift) {
      btnShift.disabled = busy;
      btnShift.style.display = llmActive ? '' : 'none';
      if (busy) btnShift.classList.remove('active');
    }
    if (busy) closeShiftPanel();
    renderParticipantsHud();
  }

  function hideOverlay() {
    unbindHudListeners();
    closeShiftPanel();
    const el = overlayEl();
    if (el) {
      el.classList.remove('visible');
      const btnGo = el.querySelector('#ldo-continue');
      if (btnGo) {
        btnGo.disabled = false;
        btnGo.style.display = '';
      }
      const btnShift = el.querySelector('#ldo-shift');
      if (btnShift) {
        btnShift.disabled = false;
        btnShift.style.display = '';
        btnShift.classList.remove('active');
      }
      const hud = document.getElementById('ldo-participants');
      if (hud) hud.innerHTML = '';
    }
    session = null;
  }

  function buildDialogueState(parsed, initiator, target, tpl) {
    return {
      lines: parsed.lines,
      speakers: parsed.speakers,
      lineIdx: 0,
      phase: 'lines',
      lineTimer: 2.8,
      actTimer: tpl.type === 'action' ? (tpl.duration || 5) : 0,
      llmMode: true,
      waitUser: true,
      history: [],
      maxLlmRounds: llmCfg().interactionMaxRounds || 3,
      llmRound: 1,
      prefetch: null,
      segmentsRelationApplied: 0,
      segmentRelationLog: [],
      mood: '平平',
      naturalEnd: false,
    };
  }

  function applyParsedSegment(d, parsed, round) {
    d.lines = parsed.lines;
    d.speakers = parsed.speakers;
    d.lineIdx = 0;
    d.llmRound = round;
    d.prefetch = null;
    d.phase = 'lines';
    d.waitUser = false;
  }

  function finishSegmentRelation(c, act) {
    const d = act.dialogue;
    const mood = d.mood || '平平';
    const applied = applySegmentRelationEffects(c, act.target, act.tpl, d.llmRound, d.maxLlmRounds, mood);
    if (applied?.length) {
      d.segmentRelationLog = d.segmentRelationLog || [];
      d.segmentRelationLog.push(applied);
    }
    d.segmentsRelationApplied = (d.segmentsRelationApplied || 0) + 1;
    d.mood = mood;
    renderParticipantsHud();
  }

  function buildPriorForPrefetch(d) {
    const prior = [...(d.history || [])];
    for (let i = 0; i < (d.lines?.length || 0); i++) {
      prior.push({ speakerId: d.speakers[i], text: d.lines[i] });
    }
    return prior;
  }

  const PARSE_RETRY_SUFFIX = '\n\n上次输出格式有误。只输出合法 JSON 数组，如 [{"说话人":"宝玉","台词":"……"}]，不要代码块、不要前后说明、不要多余字段。';

  async function fetchLines(initiator, target, tpl, prior, segmentRound, shiftFromTpl) {
    const prompt = buildUserPrompt(initiator, target, tpl, prior, segmentRound, shiftFromTpl);
    let raw = await callOllama(prompt);
    EventBus.emit('interaction:llm_raw', { initiatorId: initiator.id, targetId: target.id, raw, segmentRound });
    let parsed = parseLines(raw, initiator, target, prior);
    if (!parsed) {
      console.warn('[InteractionLlm] 解析失败，重试一次');
      raw = await callOllama(prompt + PARSE_RETRY_SUFFIX);
      EventBus.emit('interaction:llm_raw', { initiatorId: initiator.id, targetId: target.id, raw, segmentRound, retry: true });
      parsed = parseLines(raw, initiator, target, prior);
    }
    return parsed;
  }

  function prefetchEnabled() {
    return llmCfg().interactionPrefetch !== false;
  }

  function startPrefetch(c, act) {
    if (!prefetchEnabled()) return;
    const d = act.dialogue;
    const nextRound = d.llmRound + 1;
    if (nextRound > d.maxLlmRounds) return;
    if (d.prefetch && (d.prefetch.status === 'pending' || d.prefetch.status === 'done') && d.prefetch.round === nextRound) {
      return;
    }
    const prior = buildPriorForPrefetch(d);
    const promise = fetchLines(c, act.target, act.tpl, prior, nextRound)
      .then(parsed => {
        if (c.action?.dialogue !== d) return parsed;
        if (!parsed) {
          d.prefetch = { status: 'error', round: nextRound, promise };
          return null;
        }
        d.prefetch = { status: 'done', round: nextRound, parsed, promise };
        if (d.phase === 'llm_generating') tryApplyPrefetched(c, act);
        return parsed;
      })
      .catch(() => {
        if (c.action?.dialogue === d) d.prefetch = { status: 'error', round: nextRound, promise };
        return null;
      });
    d.prefetch = { status: 'pending', round: nextRound, promise };
  }

  function applyPrefetchedSegment(c, act, pf) {
    applyParsedSegment(act.dialogue, pf.parsed, pf.round);
    startAutoPlay(c);
  }

  function tryApplyPrefetched(c, act) {
    const d = act.dialogue;
    const pf = d.prefetch;
    if (pf?.status === 'done' && pf.parsed && pf.round === d.llmRound + 1) {
      applyPrefetchedSegment(c, act, pf);
      return true;
    }
    return false;
  }

  function waitForNextSegment(c, act) {
    const d = act.dialogue;
    d.phase = 'llm_generating';
    d.waitUser = false;
    setOverlay('generating', {
      preview: '下一段撰写中…',
      meta: `${c.short}与${act.target.short} · 第 ${d.llmRound + 1} 段`,
    });
    const pf = d.prefetch;
    if (pf?.status === 'done' && pf.parsed) {
      tryApplyPrefetched(c, act);
      return;
    }
    if (pf?.status === 'pending' && pf.promise) {
      pf.promise.then(() => {
        if (!c.action?.dialogue?.llmMode) return;
        if (!tryApplyPrefetched(c, act)) requestMoreLinesSync(c, act);
      });
      return;
    }
    requestMoreLinesSync(c, act);
  }

  function requestMoreLinesSync(c, act) {
    const d = act.dialogue;
    const nextRound = d.llmRound + 1;
    d.phase = 'llm_generating';
    d.waitUser = false;
    setOverlay('generating', { meta: `${c.short}与${act.target.short} · ${act.tpl.name}`, preview: '续写对白中…' });
    fetchLines(c, act.target, act.tpl, d.history, nextRound).then(parsed => {
      if (!getActiveAction() || session?.c !== c) return;
      if (!parsed) {
        d.naturalEnd = (d.segmentsRelationApplied > 0 || d.history?.length > 0);
        finishInteractionAction(c);
        return;
      }
      applyParsedSegment(d, parsed, nextRound);
      startAutoPlay(c);
    }).catch(() => {
      setOverlay('error', { preview: '续写失败，结束对话' });
      d.naturalEnd = true;
      finishInteractionAction(c);
      hideOverlay();
    });
  }

  function getActiveAction() {
    return session?.c?.action?.type === 'interaction' ? session.c.action : null;
  }

  function isPending(c) {
    return !!(session?.pending && session?.c === c);
  }

  function showCurrentLine(c) {
    const act = c?.action || getActiveAction();
    if (!act?.dialogue?.llmMode) return;
    const d = act.dialogue;
    const speaker = getChar(d.speakers[d.lineIdx]);
    const line = d.lines[d.lineIdx];
    if (!speaker || !line) return;
    speechBubble = { char: speaker, text: line };
    const prefetchHint = d.prefetch?.status === 'pending' ? ' · 下一段撰写中' : '';
    setOverlay('replying', {
      preview: `${speaker.short}：「${line}」`,
      meta: `第 ${d.lineIdx + 1}/${d.lines.length} 句 · 第 ${d.llmRound} 段${prefetchHint}`,
    });
    renderParticipantsHud();
    uiDirty = true;
  }

  function startAutoPlay(c) {
    const act = c.action;
    const d = act.dialogue;
    d.waitUser = false;
    d.lineTimer = 2.8;
    showCurrentLine(c);
    if (!d.awkwardMode) startPrefetch(c, act);
  }

  function updateDialogue(c, dt) {
    const act = c.action;
    if (!act?.dialogue?.llmMode) return;
    const d = act.dialogue;
    if (d.waitUser) return;
    if (d.phase === 'llm_generating') {
      tryApplyPrefetched(c, act);
      return;
    }

    d.lineTimer -= dt;
    if (d.phase !== 'lines') return;
    if (d.lineTimer > 0) return;

    d.history.push({ speakerId: d.speakers[d.lineIdx], text: d.lines[d.lineIdx] });
    d.lineIdx++;

    if (d.lineIdx >= d.lines.length) {
      if (d.awkwardMode) {
        d.naturalEnd = true;
        finishInteractionAction(c);
        hideOverlay();
        return;
      }
      finishSegmentRelation(c, act);
      if (d.llmRound >= d.maxLlmRounds) {
        d.naturalEnd = true;
        finishInteractionAction(c);
        hideOverlay();
        return;
      }
      if (tryApplyPrefetched(c, act)) return;
      waitForNextSegment(c, act);
      return;
    }

    d.lineTimer = 2.8;
    showCurrentLine(c);
  }

  function onContinue() {
    const c = session?.c;
    const act = getActiveAction();
    if (!act?.dialogue?.llmMode || act.dialogue.phase === 'llm_generating') return;
    const d = act.dialogue;
    if (!d.waitUser) return;
    closeShiftPanel();
    startAutoPlay(c);
  }

  function onStop() {
    const c = session?.c;
    if (c?.action?.type === 'interaction') {
      abortInteractionAction(c, '对话中止');
    } else {
      hideOverlay();
    }
  }

  async function fetchAwkwardLines(initiator, target, tpl, ctx) {
    const prompt = buildAwkwardUserPrompt(initiator, target, tpl, ctx);
    let raw = await callOllama(prompt);
    let parsed = parseLines(raw, initiator, target, []);
    if (!parsed) {
      raw = await callOllama(prompt + PARSE_RETRY_SUFFIX);
      parsed = parseLines(raw, initiator, target, []);
    }
    return parsed;
  }

  function tryBeginAwkward(initiator, target, tpl, ctx, onReady) {
    if (!shouldUseAwkward(initiator)) return false;

    session = { c: initiator, target, tpl, onReady, pending: true, hudUnsubs: [], awkward: true };
    if (initiator.actionQueue[0]?.type === 'interaction') {
      initiator.actionQueue[0].phase = ctx.mode === 'risk_fail' ? 'executing' : 'lowscore';
    }
    initParticipantsHud(initiator, target);
    setOverlay('generating', {
      meta: `${initiator.short}与${target.short} · ${tpl.name}（尴尬收场）`,
      preview: '撰写试探性对白…',
    });

    promptReady.then(() => fetchAwkwardLines(initiator, target, tpl, ctx)).then(parsed => {
      if (!session?.pending) return;
      session.pending = false;
      if (!parsed) {
        setOverlay('error', { preview: '模型解析失败，改用固定台词' });
        setTimeout(hideOverlay, 1500);
        onReady(buildInteractionDialogue(initiator, target, tpl));
        return;
      }
      const dialogue = buildAwkwardDialogueState(parsed, initiator, target, tpl);
      setOverlay('waiting', {
        preview: `尴尬收场 ${parsed.lines.length} 句，点「开始播放」`,
        meta: `${initiator.short}与${target.short} · 试探未果`,
      });
      onReady(dialogue);
    }).catch(err => {
      const msg = describeFetchError(err);
      console.warn('[InteractionLlm] awkward', msg, err);
      if (!session?.pending) return;
      session.pending = false;
      setOverlay('error', { preview: msg });
      setTimeout(hideOverlay, 2500);
      onReady(buildInteractionDialogue(initiator, target, tpl));
    });

    return true;
  }

  function tryBegin(initiator, target, tpl, onReady) {
    if (!shouldUse(initiator, target, tpl)) return false;

    session = { c: initiator, target, tpl, onReady, pending: true, hudUnsubs: [] };
    if (initiator.actionQueue[0]?.type === 'interaction') {
      initiator.actionQueue[0].phase = 'generating';
    }
    initParticipantsHud(initiator, target);
    setOverlay('generating', {
      meta: `${initiator.short}与${target.short} · ${tpl.name}`,
      preview: '正在生成对白…',
    });

    promptReady.then(() => fetchLines(initiator, target, tpl, [], 1)).then(parsed => {
      if (!session?.pending) return;
      session.pending = false;
      if (!parsed) {
        setOverlay('error', { preview: '模型返回无法解析，已改用模板台词' });
        setTimeout(hideOverlay, 2000);
        onReady(buildInteractionDialogue(initiator, target, tpl));
        return;
      }
      const dialogue = buildDialogueState(parsed, initiator, target, tpl);
      setOverlay('waiting', {
        preview: `已写好 ${parsed.lines.length} 句（第 1 段），点「开始播放」`,
        meta: `${initiator.short}与${target.short} · 播放时将预写下一段`,
      });
      onReady(dialogue);
    }).catch(err => {
      const msg = describeFetchError(err);
      console.warn('[InteractionLlm]', msg, err);
      if (!session?.pending) return;
      session.pending = false;
      setOverlay('error', { preview: msg });
      setTimeout(hideOverlay, 3500);
      onReady(buildInteractionDialogue(initiator, target, tpl));
    });

    return true;
  }

  function attachSession(c) {
    if (!session) return;
    session.c = c;
    if (!session.initiatorId) session.initiatorId = c.id;
    if (!session.targetId && session.target) session.targetId = session.target.id;
    if (!session.relBaseline && session.target) {
      session.relBaseline = captureRelBaseline(c.id, session.target.id);
    }
    if (!session.hudUnsubs?.length) bindHudListeners();
    renderParticipantsHud();
  }

  async function probeOllama() {
    if (window.location.protocol === 'file:') {
      console.warn('[InteractionLlm] 本地文件模式无法直连模型，请运行 node serve.mjs');
      return false;
    }
    try {
      await resolveApiBase();
      const res = await fetch(`${getApiBase()}/api/tags`, { method: 'GET' });
      if (!res.ok) console.warn('[InteractionLlm] 模型服务探测失败', res.status, getApiBase());
      return res.ok;
    } catch (err) {
      console.warn('[InteractionLlm] 模型未就绪:', describeFetchError(err));
      return false;
    }
  }

  function init() {
    loadPrompts();
    if (isEnabled()) resolveApiBase();
    const btnGo = document.getElementById('ldo-continue');
    const btnStop = document.getElementById('ldo-stop');
    const btnShift = document.getElementById('ldo-shift');
    if (btnGo) btnGo.onclick = (e) => { e.stopPropagation(); onContinue(); };
    if (btnStop) btnStop.onclick = (e) => { e.stopPropagation(); onStop(); };
    if (btnShift) btnShift.onclick = (e) => { e.stopPropagation(); toggleShiftPanel(); };
    if (isEnabled()) probeOllama();
  }

  return {
    init, tryBegin, tryBeginAwkward, attachSession, onContinue, onStop, hideOverlay, updateDialogue,
    shouldUse, shouldUseAwkward, isEnabled, modelName, setEnabled, resetApiBase, startLocalOllama,
    loadPrompts, isPending, requestSwitchInteraction,
  };
})();
window.InteractionLlmSystem = InteractionLlmSystem;
