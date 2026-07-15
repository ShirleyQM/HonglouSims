const OrderBookSystem = (() => {
  const AFFAIR_SKILL_WEIGHTS = {
    ritual: { ritual: 0.34, eloquence: 0.18, insight: 0.18, literacy: 0.16, subtlety: 0.14 },
    study: { literacy: 0.34, ritual: 0.22, diligence: 0.22, eloquence: 0.12, insight: 0.1 },
    routine: { insight: 0.28, affairs: 0.24, diligence: 0.24, subtlety: 0.16, ritual: 0.08 },
    account: { affairs: 0.3, literacy: 0.24, scheming: 0.2, subtlety: 0.14, eloquence: 0.12 },
    cleaning: { diligence: 0.36, affairs: 0.3, ritual: 0.14, eloquence: 0.1, subtlety: 0.1 },
    message: { insight: 0.3, ritual: 0.24, eloquence: 0.24, subtlety: 0.16, affairs: 0.06 },
  };

  const AFFAIR_LABEL_FALLBACK = {
    ritual: '请安礼法',
    study: '功课训诫',
    routine: '起居随侍',
    account: '账房采买',
    cleaning: '洒扫差役',
    message: '通传门禁',
  };

  const QUEST_CATEGORY_TO_AFFAIR = {
    study: 'study',
    ritual: 'ritual',
    etiquette: 'ritual',
    serve: 'routine',
    personal_service: 'routine',
    routine: 'routine',
    account: 'account',
    money: 'account',
    cleaning: 'cleaning',
    chore: 'cleaning',
    message: 'message',
    errand: 'message',
  };

  function md() {
    return window.JIAFU_ORDER_METADATA || {};
  }

  function chars() {
    if (typeof CHARS !== 'undefined' && Array.isArray(CHARS)) return CHARS;
    return Array.isArray(window.CHARS) ? window.CHARS : [];
  }

  function charById(id) {
    return chars().find(c => c.id === id) || null;
  }

  function charName(id) {
    const c = charById(id);
    const source = md().sourceGenealogy?.nameMap?.[id] || md().sourceGenealogy?.people?.[id]?.sourceName;
    return c?.short || c?.name || source || id || '未配置';
  }

  function posOf(charId) {
    const key = md().peoplePositions?.[charId];
    return key ? md().positionDefs?.[key] || null : null;
  }

  function rankOf(charId) {
    const c = charById(charId);
    if (!c) return 6;
    return IdentityProtocolSystem?.getCharRank?.(charId) ?? c.socialRank ?? 6;
  }

  function rankLabel(charId) {
    const rank = rankOf(charId);
    return IdentityProtocolSystem?.rankLabel?.(rank) || `等级${rank}`;
  }

  function skillValue(c, skillId) {
    if (!c || !skillId) return 0;
    const raw = c.skillValues?.[skillId]
      ?? c.skillProficiency?.[skillId]
      ?? c.skillLevels?.[skillId]
      ?? 0;
    const n = Number(raw) || 0;
    return Math.max(0, Math.min(100, n <= 10 ? n * 10 : n));
  }

  function positionAffairs(charId) {
    return posOf(charId)?.controls?.affairs || [];
  }

  function getAffairControllers(affairId) {
    return chars()
      .map(c => {
        const pos = posOf(c.id);
        if (!pos?.controls?.affairs?.includes(affairId)) return null;
        return { id: c.id, char: c, pos, score: (pos.tier || 0) + Math.max(0, 12 - rankOf(c.id) * 2) };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || rankOf(a.id) - rankOf(b.id));
  }

  function getAffairAssignee(affairId) {
    return getAffairControllers(affairId)[0]?.id || null;
  }

  function estimateAffairFit(charId, affairId) {
    const c = charById(charId);
    const weights = AFFAIR_SKILL_WEIGHTS[affairId] || {};
    const pos = posOf(charId);
    const skillScore = Object.entries(weights)
      .reduce((sum, [skill, weight]) => sum + skillValue(c, skill) * weight, 0);
    const rankScore = Math.max(0, 28 - rankOf(charId) * 4);
    const positionBonus = pos?.controls?.affairs?.includes(affairId) ? 14 : 0;
    const rightBonus = (md().affairDefs?.[affairId]?.rights || [])
      .some(r => pos?.rights?.includes(r)) ? 8 : 0;
    const score = Math.round(Math.max(0, Math.min(100, skillScore * 0.62 + rankScore + positionBonus + rightBonus)));
    const topSkills = Object.keys(weights)
      .sort((a, b) => (weights[b] || 0) - (weights[a] || 0))
      .slice(0, 3)
      .map(skill => `${skillName(skill)} ${Math.round(skillValue(c, skill))}`)
      .join(' / ');
    const reasons = [
      pos ? pos.label : '未配置职位',
      positionBonus ? '归口内' : '非归口',
      topSkills || '暂无技能数据',
    ];
    return { charId, affairId, score, skillScore: Math.round(skillScore), rankScore, positionBonus, rightBonus, reasons };
  }

  function skillName(skillId) {
    return CONFIG?.skillDefs?.[skillId]?.name || {
      ritual: '礼法',
      literacy: '文书',
      insight: '察言',
      affairs: '事务',
      scheming: '谋算',
      eloquence: '辞令',
      diligence: '勤勉',
      subtlety: '分寸',
      adaptability: '机变',
    }[skillId] || skillId;
  }

  function managementSkillIds() {
    return Array.from(new Set(
      Object.values(AFFAIR_SKILL_WEIGHTS)
        .flatMap(weights => Object.keys(weights || {}))
    ));
  }

  function affairLabel(affairId) {
    return md().affairDefs?.[affairId]?.label || AFFAIR_LABEL_FALLBACK[affairId] || affairId;
  }

  function affairIds() {
    const fromMd = Object.keys(md().affairDefs || {});
    return fromMd.length ? fromMd : Object.keys(AFFAIR_LABEL_FALLBACK);
  }

  function inferAffairFromTemplate(tpl = {}) {
    if (tpl.affairId) return tpl.affairId;
    const keys = [tpl.orderAffair, tpl.category, tpl.type, ...(tpl.tags || [])]
      .filter(Boolean)
      .map(v => String(v).toLowerCase());
    for (const key of keys) {
      if (AFFAIR_LABEL_FALLBACK[key]) return key;
      if (QUEST_CATEGORY_TO_AFFAIR[key]) return QUEST_CATEGORY_TO_AFFAIR[key];
    }
    return 'routine';
  }

  function describeOrderFit(issuerId, targetId, templateId) {
    const tpl = resolveTemplate(templateId);
    const affairId = inferAffairFromTemplate(tpl);
    const ownerId = getAffairAssignee(affairId);
    const targetFit = estimateAffairFit(targetId, affairId);
    const issuerPos = posOf(issuerId);
    const issuerOwnsAffair = issuerPos?.controls?.affairs?.includes(affairId) || false;
    const hierarchy = IdentityProtocolSystem?.getHierarchyRelation?.(issuerId, targetId) || 'peer';
    return {
      affairId,
      affairLabel: affairLabel(affairId),
      ownerId,
      ownerName: charName(ownerId),
      issuerOwnsAffair,
      hierarchy,
      targetFit,
      note: issuerOwnsAffair
        ? '传令人在事务归口内，名分顺。'
        : `建议由${charName(ownerId)}归口传令，当前传令可能需要背书。`,
    };
  }

  function orderMetrics() {
    const configured = chars().filter(c => posOf(c.id)).length;
    const total = Math.max(1, chars().length);
    const coverage = configured / total;
    const activeQuests = QuestSystem?.state?.()?.instances?.filter(q => q.status === 'active')?.length || 0;
    return [
      { key: 'ritual', label: '礼法清晰', value: Math.round(48 + coverage * 42), desc: '角色有身份和职位归口时，传令更容易判断是否顺名分。' },
      { key: 'command', label: '差事流转', value: Math.max(35, Math.min(92, 62 + activeQuests * 2)), desc: `当前进行中任务 ${activeQuests} 件。` },
      { key: 'skill', label: '人岗适配', value: Math.round(averageTopFit()), desc: '按事务所需技能、身份位阶和职位归口估算。' },
      { key: 'risk', label: '越权风险', value: Math.round(100 - coverage * 36), desc: '数值越高，表示仍有角色缺职位/归口配置。' },
    ];
  }

  function metricsSnapshot() {
    return Object.fromEntries(orderMetrics().map(m => [m.key, Math.round(m.value || 0)]));
  }

  function averageTopFit() {
    const ids = affairIds();
    if (!ids.length || !chars().length) return 50;
    const total = ids.reduce((sum, id) => {
      const best = chars().map(c => estimateAffairFit(c.id, id).score).sort((a, b) => b - a)[0] || 0;
      return sum + best;
    }, 0);
    return total / ids.length;
  }

  function buildMetricCard(m) {
    const value = Math.max(0, Math.min(100, Math.round(m.value || 0)));
    return `<div class="order-metric">
      <div class="order-metric-head"><b>${escapeHtml(m.label)}</b><span>${value}</span></div>
      <div class="order-meter"><i style="width:${value}%"></i></div>
      <p>${escapeHtml(m.desc || '')}</p>
    </div>`;
  }

  function buildAffairRows() {
    return affairIds().map(id => {
      const affair = md().affairDefs?.[id] || {};
      const ownerId = getAffairAssignee(id);
      const ownerFit = ownerId ? estimateAffairFit(ownerId, id) : null;
      const controllers = getAffairControllers(id).slice(0, 3).map(c => `${charName(c.id)}·${c.pos.label}`).join('、') || '暂无归口人';
      const rights = (affair.rights || []).map(r => md().rightDefs?.[r]?.label || r).join('、') || '未配置';
      return `<tr>
        <td><b>${escapeHtml(affairLabel(id))}</b><small>${escapeHtml(id)}</small></td>
        <td>${escapeHtml(charName(ownerId))}<small>${escapeHtml(posOf(ownerId)?.label || '未配置职位')}</small></td>
        <td>${ownerFit ? `<span class="order-fit">${ownerFit.score}</span>` : '—'}<small>${escapeHtml(ownerFit?.reasons?.join('；') || '')}</small></td>
        <td>${escapeHtml(rights)}<small>${escapeHtml(controllers)}</small></td>
        <td><button class="sys-btn order-command-btn" data-order-command-affair="${escapeHtml(id)}" data-order-owner="${escapeHtml(ownerId || '')}">去传令</button></td>
      </tr>`;
    }).join('');
  }

  function buildPositionRows() {
    return chars()
      .filter(c => md().peoplePositions?.[c.id])
      .sort((a, b) => rankOf(a.id) - rankOf(b.id) || ((posOf(b.id)?.tier || 0) - (posOf(a.id)?.tier || 0)))
      .map(c => {
        const pos = posOf(c.id);
        const affairs = (pos?.controls?.affairs || []).map(affairLabel).join('、') || '未配置';
        const rights = (pos?.rights || []).map(r => md().rightDefs?.[r]?.label || r).join('、') || '未配置';
        return `<tr>
          <td><b>${escapeHtml(charName(c.id))}</b><small>${escapeHtml(c.id)}</small></td>
          <td>${escapeHtml(rankLabel(c.id))}<small>${escapeHtml(pos?.lane || '')}</small></td>
          <td>${escapeHtml(pos?.label || '未配置职位')}<small>${escapeHtml(pos?.authorityScope || '')}</small></td>
          <td>${escapeHtml(affairs)}<small>${escapeHtml(rights)}</small></td>
        </tr>`;
      }).join('');
  }

  function fourthAxisLabel(fromId, toId) {
    const rel = IdentityProtocolSystem?.getHierarchyRelation?.(fromId, toId) || 'peer';
    if (rel === 'master_to_servant') return '体恤';
    if (rel === 'servant_to_master') return '服从';
    const edgeLabel = findSourceEdge(fromId, toId)?.label || '';
    if (/父|母|祖|长辈/.test(edgeLabel)) return '慈爱';
    if (/子|女|孙|晚辈/.test(edgeLabel)) return '孝道';
    return '';
  }

  function findSourceEdge(fromId, toId) {
    return (md().sourceGenealogy?.relationEdges || [])
      .find(e => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)) || null;
  }

  function axisStage(axis, value) {
    if (typeof getRelationAxisStage === 'function') return getRelationAxisStage(axis, value);
    return { label: value > 30 ? '高' : value < -30 ? '低' : '平', relationName: '', value: Math.round(value || 0) };
  }

  function buildFourthRows() {
    const edges = (md().sourceGenealogy?.relationEdges || [])
      .filter(e => charById(e.from) && charById(e.to))
      .slice(0, 14);
    if (!edges.length) return `<tr><td colspan="4" class="order-empty">暂无运行时人物匹配。</td></tr>`;
    return edges.map(e => {
      const aLabel = fourthAxisLabel(e.from, e.to);
      const bLabel = fourthAxisLabel(e.to, e.from);
      const aValue = typeof getRelationAxis === 'function' ? Math.round(getRelationAxis(e.from, e.to, 'submission') || 0) : 0;
      const bValue = typeof getRelationAxis === 'function' ? Math.round(getRelationAxis(e.to, e.from, 'submission') || 0) : 0;
      const friendship = typeof getRelationAxis === 'function' ? Math.round(getRelationAxis(e.from, e.to, 'friendship') || 0) : 0;
      const trust = typeof getRelationAxis === 'function' ? Math.round(getRelationAxis(e.from, e.to, 'trust') || 0) : 0;
      const fourth = [
        aLabel ? `${aLabel} ${axisStage('submission', aValue).label} ${aValue}` : '',
        bLabel ? `${bLabel} ${axisStage('submission', bValue).label} ${bValue}` : '',
      ].filter(Boolean).join(' / ') || '无第四轴';
      return `<tr>
        <td><b>${escapeHtml(charName(e.from))} ↔ ${escapeHtml(charName(e.to))}</b><small>${escapeHtml(e.label || '')}</small></td>
        <td>${escapeHtml(fourth)}</td>
        <td>${escapeHtml(axisStage('friendship', friendship).label)} ${friendship}</td>
        <td>${escapeHtml(axisStage('trust', trust).label)} ${trust}</td>
      </tr>`;
    }).join('');
  }

  function buildBestFitRows() {
    return affairIds().map(id => {
      const fits = chars()
        .map(c => estimateAffairFit(c.id, id))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
      return `<div class="order-fit-card">
        <b>${escapeHtml(affairLabel(id))}</b>
        ${fits.map(f => `<span><em>${escapeHtml(charName(f.charId))}</em><i>${f.score}</i></span>`).join('')}
      </div>`;
    }).join('');
  }

  function buildPanel() {
    const scene = md().scene || { name: '贾府' };
    return `<div class="order-book-panel">
      <div class="order-head">
        <div>
          <h3>${escapeHtml(scene.name || '贾府')}秩序</h3>
          <p>身份礼法、职业职责、事务归口、第四轴关系与技能适配的统一入口。当前版本只读展示，不直接改 AI 结算。</p>
        </div>
      </div>
      <div class="order-metrics">${orderMetrics().map(buildMetricCard).join('')}</div>
      <div class="order-grid">
        <section class="order-section order-wide">
          <h4>事务归口</h4>
          <div class="order-table-wrap">
            <table class="order-table">
              <thead><tr><th>事务</th><th>建议归口</th><th>适配</th><th>权柄/备选</th><th>操作</th></tr></thead>
              <tbody>${buildAffairRows()}</tbody>
            </table>
          </div>
        </section>
        <section class="order-section">
          <h4>人物管理技能</h4>
          <div class="order-fit-grid">${buildBestFitRows()}</div>
        </section>
        <section class="order-section order-wide">
          <h4>身份与职位</h4>
          <div class="order-table-wrap">
            <table class="order-table">
              <thead><tr><th>人物</th><th>位阶</th><th>职位</th><th>归口事务/权柄</th></tr></thead>
              <tbody>${buildPositionRows()}</tbody>
            </table>
          </div>
        </section>
        <section class="order-section order-wide">
          <h4>第四轴观察</h4>
          <div class="order-table-wrap small">
            <table class="order-table">
              <thead><tr><th>关系</th><th>第四轴</th><th>友谊</th><th>信任</th></tr></thead>
              <tbody>${buildFourthRows()}</tbody>
            </table>
          </div>
        </section>
      </div>
      <div class="panel-footer-actions" style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
        <button class="sys-btn" onclick="document.getElementById('panel-overlay').classList.remove('open')">关闭</button>
      </div>
    </div>`;
  }

  function resolveTemplate(templateOrId) {
    if (templateOrId && typeof templateOrId === 'object') return templateOrId;
    const tables = [
      (typeof CONFIG !== 'undefined' ? CONFIG?.questConfig?.templates : null),
      (typeof DEFAULT_CONFIG !== 'undefined' ? DEFAULT_CONFIG?.questConfig?.templates : null),
    ].filter(Boolean);
    for (const table of tables) {
      if (Array.isArray(table)) {
        const found = table.find(t => String(t.id) === String(templateOrId));
        if (found) return found;
      } else if (table?.[templateOrId]) {
        return table[templateOrId];
      }
    }
    return {};
  }

  function estimateQuestOrderDelta(templateOrId, issuerId, assigneeId, outcome = {}) {
    const t = resolveTemplate(templateOrId);
    const ctx = describeOrderFit(issuerId, assigneeId, t.id || templateOrId);
    const affairId = ctx.affairId || inferAffairFromTemplate(t);
    const status = outcome.status || '';
    const completed = status === 'completed' || outcome.completed === true;
    const failed = status === 'failed' || status === 'declined' || status === 'expired' || outcome.failed === true;
    const quality = Number.isFinite(+outcome.qualityScore) ? +outcome.qualityScore : (completed ? 60 : 35);
    const fit = ctx.targetFit?.score ?? 50;
    const delta = { ritual: 0, command: 0, skill: 0, risk: 0, order: 0, morale: 0, dignity: 0, corruption: 0 };

    if (completed) {
      delta.command += 1;
      delta.skill += fit >= 55 ? 1 : 0;
      if (quality >= 75) { delta.order += 2; delta.morale += 1; delta.dignity += 1; }
      else if (quality >= 50) { delta.order += 1; }
      else { delta.order -= 1; delta.morale -= 1; delta.risk += 1; }
    } else if (failed) {
      delta.command -= 1;
      delta.order -= 2;
      delta.morale -= 1;
      delta.dignity -= 1;
      delta.risk += 2;
    }

    if (!ctx.issuerOwnsAffair && issuerId) {
      delta.order -= 1;
      delta.dignity -= 1;
      delta.risk += 1;
    }
    if (fit < 40) {
      delta.order -= 1;
      delta.morale -= 1;
      delta.risk += 1;
    } else if (fit >= 70 && completed) {
      delta.order += 1;
      delta.skill += 1;
    }

    if (affairId === 'ritual' || affairId === 'study') {
      if (completed) { delta.ritual += 2; delta.dignity += 1; }
    } else if (affairId === 'account') {
      if (completed && quality >= 70) delta.corruption -= 1;
      if (completed && quality < 50) delta.corruption += 2;
    } else if (affairId === 'cleaning') {
      if (completed) delta.order += 1;
    } else if (affairId === 'message') {
      if (completed) { delta.command += 1; delta.dignity += 1; }
    } else if (affairId === 'routine') {
      if (completed) delta.morale += 1;
    }

    return Object.fromEntries(Object.entries(delta).filter(([, v]) => v));
  }

  function isManagementAffair(affairId, t, issuerId) {
    if (!affairId) return false;
    if (issuerId) return true;
    if (affairId !== 'routine') return true;
    return ['daily', 'command', 'managed'].includes(t?.questType) || !!t?.orderAffair || !!t?.affairId;
  }

  function buildQuestOrderContext(templateOrId, issuerId, assigneeId, outcome = {}) {
    const t = resolveTemplate(templateOrId);
    const templateId = t.id || templateOrId;
    const ctx = describeOrderFit(issuerId, assigneeId, templateId);
    const metrics = metricsSnapshot();
    const orderDelta = estimateQuestOrderDelta(t, issuerId, assigneeId, outcome);
    return {
      orderAffairId: ctx.affairId,
      orderAffairLabel: ctx.affairLabel,
      orderOwnerId: ctx.ownerId,
      orderOwnerName: ctx.ownerName,
      orderIssuerOwnsAffair: !!ctx.issuerOwnsAffair,
      orderIsManagementTask: isManagementAffair(ctx.affairId, t, issuerId),
      orderHierarchy: ctx.hierarchy,
      orderTargetFitScore: ctx.targetFit?.score,
      orderTargetFitReasons: ctx.targetFit?.reasons || [],
      orderNote: ctx.note,
      orderMetrics: metrics,
      orderDelta,
    };
  }

  function bindPanel() {
    document.querySelectorAll('[data-order-command-affair]').forEach(btn => {
      btn.onclick = () => {
        const ownerId = btn.dataset.orderOwner;
        if (ownerId) {
          const idx = chars().findIndex(c => c.id === ownerId);
          if (idx >= 0) {
            window.selectedIdx = idx;
            window.uiDirty = true;
            if (typeof buildUI === 'function') buildUI();
          }
        }
        if (typeof openCommandPanel === 'function') openCommandPanel();
        else if (typeof log === 'function') log('传令面板暂不可用。');
      };
    });
  }

  function openOrderPanel() {
    if (typeof openPanel !== 'function') return;
    openPanel(buildPanel());
    document.getElementById('panel-content')?.classList.add('order-book-panel-box');
    bindPanel();
  }

  return {
    metadata: md,
    openPanel: openOrderPanel,
    buildPanel,
    bindPanel,
    getAffairAssignee,
    getAffairControllers,
    managementSkillIds,
    skillName,
    skillValue,
    estimateAffairFit,
    describeOrderFit,
    inferAffairFromTemplate,
    getOrderMetrics: orderMetrics,
    getOrderMetricSnapshot: metricsSnapshot,
    estimateQuestOrderDelta,
    buildQuestOrderContext,
  };
})();

window.OrderBookSystem = OrderBookSystem;
