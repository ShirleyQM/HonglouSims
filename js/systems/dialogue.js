/* ═════════════════════════════════════════════════════════════════════════════
 *  DIALOGUE & GROUP CHAT SYSTEM
 *  对话与群聊系统 - 支持双人可变轮次对话 + 多人群聊
 *  
 *  依赖：CONFIG, EventBus, applyState, changeAxis, NarrativeBubbleSystem
 *  复用：关系系统(四轴微调)、状态系统(情绪累积)、叙事气泡(UI)
 *  ═════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // 配置常量
  // ═══════════════════════════════════════════════════════════════════════════
  
  const DIALOGUE_CONFIG = {
    // 互动类别基础轮次范围
    baseRounds: {
      '寒暄': [2, 4],
      '叙旧': [3, 6],
      '论道': [4, 8],
      '慰藉': [3, 6],
      '传情': [4, 8],
      '争执': [2, 6],
      '调笑': [3, 5],
    },
    // 群聊额外轮次
    groupBonus: [2, 4],
    // 群聊上限
    maxGroupRounds: 12,
    privateModeRounds: 3, // 连续私语轮次触发私语化
    // 观察意愿判定参数
    observation: {
      baseProb: 0.2,
      relationBonusPer20: 0.1,
      traitBonus: { 'haoke': 0.3, 'letian': 0.3, 'fengliu': 0.3, 'yinshi': -0.2, 'qinggao': -0.2 },
      statusBonus: { '愉悦': 0.2, '微醺': 0.2, '忧伤': -0.1, '愤怒': -0.1 },
      distancePenaltyPerGrid: 0.05,
      threshold: 0.5,
    },
    // 距离阈值
    maxJoinDistance: 8,
    // 微效果配置
    microEffects: {
      'positive': { axis: 'affection', delta: 1 },
      'negative': { axis: 'affection', delta: -1 },
      'trust_up': { axis: 'trust', delta: 1 },
      'friend_up': { axis: 'friendship', delta: 1 },
      'fun_restore': { need: 'fun', delta: 3 },
      'energy_cost': { need: 'energy', delta: -1 },
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 话题库（简化版，可扩展）
  // ═══════════════════════════════════════════════════════════════════════════

  const TOPIC_LIBRARY = {
    '闲聊': {
      templates: ['今日天气倒好。', '园里花开得正好。', '听说东府近日有事。'],
      groupSuitable: true,
      tone: 'neutral',
      microEffect: 'fun_restore',
    },
    '趣事': {
      templates: ['前儿听见一件趣事...', '你猜我方才看见什么了？'],
      groupSuitable: true,
      tone: 'positive',
      microEffect: 'friend_up',
    },
    '议论': {
      templates: ['此事你觉得如何？', '依我说未必如此。'],
      groupSuitable: true,
      tone: 'neutral',
      microEffect: 'trust_up',
    },
    '私密': {
      templates: ['有句话不知当讲不当讲...', '我近日心中烦闷...'],
      groupSuitable: false,
      tone: 'intimate',
      microEffect: 'positive',
    },
    '争执': {
      templates: ['此话差矣！', '我不这么认为。'],
      groupSuitable: true,
      tone: 'negative',
      microEffect: 'negative',
    },
    '问候': {
      templates: ['近日可好？', '托福，还算安好。'],
      groupSuitable: true,
      tone: 'neutral',
      microEffect: 'trust_up',
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 对话实例管理
  // ═══════════════════════════════════════════════════════════════════════════

  const activeDialogues = new Map(); // dialogueId -> DialogueInstance
  let dialogueIdCounter = 1;

  // ═══════════════════════════════════════════════════════════════════════════
  // 工具函数
  // ═══════════════════════════════════════════════════════════════════════════

  function getChar(id) {
    if (typeof CHARS !== 'undefined') return CHARS.find(c => c.id === id);
    if (window.CHARACTERS) return window.CHARACTERS.find(c => c.id === id);
    return null;
  }

  function getRelationScore(idA, idB) {
    if (typeof getRelationValue === 'function') return getRelationValue(idA, idB);
    return 0;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 轮次计算
  // ═══════════════════════════════════════════════════════════════════════════

  function calculateRounds(initiator, target, interactionType, isGroupChat = false, scene = null) {
    const cfg = DIALOGUE_CONFIG.baseRounds;
    const [baseMin, baseMax] = cfg[interactionType] || cfg['叙旧'];
    let base = randInt(baseMin, baseMax);
    let modifier = 0;

    // 综合分修正：每30分+1轮
    const relScore = getRelationScore(initiator.id, target.id);
    modifier += Math.floor(Math.max(0, relScore) / 30);

    // 场景私密性
    if (scene?.privacy === 'high') modifier += 1;

    // 情绪匹配度
    const initStatus = getDominantEmotion(initiator);
    const targetStatus = getDominantEmotion(target);
    if (initStatus && targetStatus) {
      const bothPositive = isPositiveEmotion(initStatus) && isPositiveEmotion(targetStatus);
      const bothNegative = isNegativeEmotion(initStatus) && isNegativeEmotion(targetStatus);
      if (bothPositive) modifier += 1;
      else if (!bothPositive && !bothNegative) modifier -= 1;
    }

    // 近期美好记忆（简化检查）
    if (hasRecentPositiveMemory(initiator, target)) modifier += 1;

    // 群聊额外轮次
    if (isGroupChat) {
      const [bonusMin, bonusMax] = DIALOGUE_CONFIG.groupBonus;
      modifier += randInt(bonusMin, bonusMax);
    }

    return clamp(base + modifier, 2, DIALOGUE_CONFIG.maxGroupRounds);
  }

  function getDominantEmotion(char) {
    if (!char.activeStates) return null;
    // 返回第一个情绪类状态
    const emotionStates = ['S001', 'S002', 'S003', 'S004', 'S005', 'S006', 'S007', 'S008'];
    for (const state of char.activeStates) {
      if (emotionStates.includes(state.id)) {
        const def = CONFIG?.stateDefs?.[state.id];
        return def?.name || state.id;
      }
    }
    return null;
  }

  function isPositiveEmotion(name) {
    return ['愉悦', '平静', '释然', '自豪', '得意', '兴奋', '憧憬', '欣慰'].includes(name);
  }

  function isNegativeEmotion(name) {
    return ['忧伤', '愤怒', '恐惧', '焦虑', '烦躁', '忧郁', '孤独', '失望'].includes(name);
  }

  function hasRecentPositiveMemory(char, target) {
    if (!char.memories) return false;
    const recent = char.memories.slice(-3);
    return recent.some(m => m.charId === target.id && m.valence > 0);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 观察意愿判定（群聊加入概率）
  // ═══════════════════════════════════════════════════════════════════════════

  function calculateJoinProbability(observer, primaryA, primaryB, distance) {
    const obs = DIALOGUE_CONFIG.observation;
    let p = obs.baseProb;

    // 关系加成：与任一方的综合分每20分+0.1
    const relA = getRelationScore(observer.id, primaryA.id);
    const relB = getRelationScore(observer.id, primaryB.id);
    p += Math.max(relA, relB) / 20 * obs.relationBonusPer20;

    // 性格加成
    const traits = getCharTraits(observer);
    for (const trait of traits) {
      const bonus = obs.traitBonus[trait];
      if (bonus) p += bonus;
    }

    // 状态加成
    const emotion = getDominantEmotion(observer);
    const statusBonus = obs.statusBonus[emotion];
    if (statusBonus) p += statusBonus;

    // 距离惩罚
    if (distance > 5) {
      p -= (distance - 5) * obs.distancePenaltyPerGrid;
    }

    p *= TraitEffectSystem?.socialJoinMultiplier?.(observer) || 1;
    return clamp(p, 0, 1);
  }

  function getCharTraits(char) {
    return TraitEffectSystem?.traitsOf?.(char)
      || (typeof CHAR_DEFAULT_TRAITS !== 'undefined' ? CHAR_DEFAULT_TRAITS[char.id] || [] : []);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 双人对话实例
  // ═══════════════════════════════════════════════════════════════════════════

  class DialogueInstance {
    constructor(initiator, target, interactionType, scene = null, groupChatId = null) {
      this.id = `dlg_${dialogueIdCounter++}`;
      this.type = 'pair'; // 'pair' or 'group'
      this.groupChatId = groupChatId;
      
      this.initiator = initiator;
      this.target = target;
      this.interactionType = interactionType;
      this.scene = scene;
      
      this.participants = [initiator, target];
      this.speakerQueue = [initiator, target]; // 轮流发言
      this.currentSpeakerIdx = 0;
      
      this.round = 0;
      this.maxRounds = calculateRounds(initiator, target, interactionType, !!groupChatId, scene);
      this.topic = this.selectTopic();
      this.history = [];
      
      this.phase = 'opening'; // 'opening', 'body', 'closing'
      this.isActive = true;
      this.privateMode = false;
      
      // 统计
      this.effectsAccumulated = { affection: 0, trust: 0, friendship: 0 };
      
      // 注册
      activeDialogues.set(this.id, this);
      
      // 事件通知
      EventBus?.emit('dialogue:start', {
        dialogueId: this.id,
        type: this.type,
        participants: this.participants.map(p => p.id),
        topic: this.topic,
        maxRounds: this.maxRounds,
      });
    }

    selectTopic() {
      const topics = Object.entries(TOPIC_LIBRARY)
        .filter(([k, v]) => this.groupChatId ? v.groupSuitable : true);
      if (topics.length === 0) return TOPIC_LIBRARY['闲聊'];
      const [name, topic] = topics[Math.floor(Math.random() * topics.length)];
      return { name, ...topic };
    }

    getCurrentSpeaker() {
      return this.speakerQueue[this.currentSpeakerIdx % this.speakerQueue.length];
    }

    getCurrentListener() {
      const speaker = this.getCurrentSpeaker();
      // 群聊 3+ 人时：取发言人之后下一位，实现循环轮听
      const others = this.participants.filter(p => p.id !== speaker.id);
      if (others.length === 1) return others[0];
      // 用 currentSpeakerIdx 偏移决定听者，使不同轮次指向不同人
      return others[(this.currentSpeakerIdx >> 1) % others.length];
    }

    generateLine() {
      const speaker = this.getCurrentSpeaker();
      const listener = this.getCurrentListener();
      
      // 根据阶段选择模板
      let template;
      if (this.phase === 'opening') {
        template = this.getOpeningLine(speaker, listener);
      } else if (this.phase === 'closing') {
        template = this.getClosingLine(speaker, listener);
      } else {
        template = this.getBodyLine(speaker, listener);
      }
      
      // 替换变量
      const line = template
        .replace(/{A}/g, speaker.short || speaker.name)
        .replace(/{B}/g, listener.short || listener.name);
      
      return { speaker: speaker.id, text: line, round: this.round };
    }

    getOpeningLine(speaker, listener) {
      const openings = [
        '{B}，近日可好？',
        '见着{B}，心中欢喜。',
        '{B}来得正好，我正想找人说说话。',
      ];
      return openings[Math.floor(Math.random() * openings.length)];
    }

    getClosingLine(speaker, listener) {
      const closings = [
        '今日与{B}相谈甚欢，改日再叙。',
        '时候不早，{B}也该去忙了。',
        '改日再与{B}细说。',
      ];
      return closings[Math.floor(Math.random() * closings.length)];
    }

    getBodyLine(speaker, listener) {
      // 使用话题模板
      const templates = this.topic?.templates || TOPIC_LIBRARY['闲聊'].templates;
      let line = templates[Math.floor(Math.random() * templates.length)];
      
      // 根据关系调整语气
      const rel = getRelationScore(speaker.id, listener.id);
      if (rel < -20 && this.topic.tone !== 'negative') {
        line = line.replace('。', '，只是...'); // 冷淡处理
      }
      
      return line;
    }

    applyMicroEffect(speaker, listener) {
      const effectKey = this.topic?.microEffect || 'fun_restore';
      const effect = DIALOGUE_CONFIG.microEffects[effectKey];
      
      if (!effect) return;
      
      // 累积效果
      if (effect.axis && typeof changeAxis === 'function') {
        changeAxis(speaker.id, listener.id, effect.axis, effect.delta);
        this.effectsAccumulated[effect.axis] += effect.delta;
      }
      
      // 状态累积（简化版）
      if (effectKey === 'positive' && this.round > 2) {
        // 多轮正向对话可能触发愉悦状态
        if (Math.random() < 0.3 && typeof applyState === 'function') {
          applyState(speaker, 'S001'); // 愉悦
        }
      }
    }

    advance() {
      if (!this.isActive) return null;
      
      this.round++;
      
      // 阶段转换
      if (this.phase === 'opening') {
        this.phase = 'body';
      } else if (this.round >= this.maxRounds - 1) {
        this.phase = 'closing';
      }
      
      // 生成对话行
      const line = this.generateLine();
      this.history.push(line);
      
      const speaker = this.getCurrentSpeaker();
      const listener = this.getCurrentListener();
      
      // 应用微效果
      this.applyMicroEffect(speaker, listener);
      
      // 显示气泡
      this.showBubble(speaker, line.text);
      
      // 事件
      EventBus?.emit('dialogue:line', {
        dialogueId: this.id,
        round: this.round,
        speaker: speaker.id,
        text: line.text,
        topic: this.topic?.name,
      });
      
      // 切换发言人
      this.currentSpeakerIdx++;
      
      // 检查结束
      if (this.round >= this.maxRounds) {
        this.end();
      }
      
      return line;
    }

    showBubble(char, text) {
      // 复用 NarrativeBubbleSystem（兼容主游戏 show() 与测试页 showBubble()）
      if (typeof NarrativeBubbleSystem !== 'undefined') {
        if (typeof NarrativeBubbleSystem.show === 'function') {
          NarrativeBubbleSystem.show(char.id, text, { duration: 3000, priority: 2 });
        } else if (typeof NarrativeBubbleSystem.showBubble === 'function') {
          NarrativeBubbleSystem.showBubble({ charId: char.id, text });
        }
      }
      // 日志
      if (typeof log === 'function') {
        const prefix = this.groupChatId ? '【群聊】' : '';
        log(`${prefix}${char.short}：${text}`);
      }
    }

    end() {
      this.isActive = false;
      
      // 群聊结束处理
      if (this.groupChatId) {
        const groupChat = activeDialogues.get(this.groupChatId);
        if (groupChat) groupChat.removeSubDialogue(this.id);
      }
      
      // 生成记忆
      this.createMemory();
      
      EventBus?.emit('dialogue:end', {
        dialogueId: this.id,
        participants: this.participants.map(p => p.id),
        totalRounds: this.round,
        finalTopic: this.topic?.name,
      });
      
      activeDialogues.delete(this.id);
    }

    createMemory() {
      // 简化记忆生成
      const memoryTag = this.topic?.name || '闲聊';
      const valence = this.topic?.tone === 'positive' ? 1 : 
                      this.topic?.tone === 'negative' ? -1 : 0;
      
      for (const char of this.participants) {
        const memory = {
          type: 'dialogue',
          tag: memoryTag,
          participants: this.participants.map(p => p.id).filter(id => id !== char.id),
          valence,
          timestamp: typeof getGameTimestamp === 'function' ? getGameTimestamp() : Date.now(),
        };
        if (typeof TraitBehaviorSystem !== 'undefined') {
          TraitBehaviorSystem.addMemory(char, memory, { baseChance: 0.8 });
          continue;
        }
        if (!char.memories) char.memories = [];
        char.memories.push(memory);
      }
    }

    // 群聊扩展：添加参与者
    addParticipant(char) {
      if (!this.participants.find(p => p.id === char.id)) {
        this.participants.push(char);
        this.speakerQueue.push(char);
        
        // 重新分配发言权顺序
        this.shuffleSpeakerQueue();
        
        EventBus?.emit('dialogue:join', {
          dialogueId: this.id,
          charId: char.id,
          totalParticipants: this.participants.length,
        });
      }
    }

    shuffleSpeakerQueue() {
      // 保持当前发言人，打乱后续
      const current = this.speakerQueue[this.currentSpeakerIdx % this.speakerQueue.length];
      const rest = this.participants.filter(p => p.id !== current.id);
      // Fisher-Yates shuffle
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      this.speakerQueue = [current, ...rest];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 群聊实例
  // ═══════════════════════════════════════════════════════════════════════════

  class GroupChatInstance {
    constructor(initiator, target, scene, nearbyChars) {
      this.id = `grp_${dialogueIdCounter++}`;
      this.type = 'group';
      
      this.scene = scene;
      this.primaryDialogue = null; // 主双人对话
      this.subDialogues = new Map(); // 分裂出的私语对话
      
      this.participants = [initiator, target];
      this.joinQueue = []; // 等待加入的角色
      
      this.round = 0;
      this.maxRounds = 12;
      
      this.topic = null;
      this.subTopics = [];
      this.topicHistory = [];
      
      this.isActive = true;
      this.privateMode = false; // 私语化模式
      this.privatePair = null; // 私语中的两人
      
      // 检测旁观者加入意愿
      this.checkObservers(initiator, target, nearbyChars);
      
      // 创建主对话（双人）
      this.primaryDialogue = new DialogueInstance(
        initiator, target, 
        '叙旧', // 默认为闲聊类型
        scene, 
        this.id
      );
      this.topic = this.primaryDialogue.topic;
      
      // 延长轮次上限
      this.primaryDialogue.maxRounds = Math.min(
        this.primaryDialogue.maxRounds + randInt(2, 4),
        DIALOGUE_CONFIG.maxGroupRounds
      );
      
      // 注册
      activeDialogues.set(this.id, this);
      
      EventBus?.emit('groupchat:start', {
        groupId: this.id,
        initiator: initiator.id,
        target: target.id,
        initialParticipants: this.participants.map(p => p.id),
        topic: this.topic?.name,
      });
    }

    checkObservers(initiator, target, nearbyChars) {
      for (const observer of nearbyChars) {
        if (observer.id === initiator.id || observer.id === target.id) continue;

        // 计算距离（若角色无格坐标则视为近距离 = 3）
        const iCol = initiator.gridCol ?? 0, iRow = initiator.gridRow ?? 0;
        const oCol = observer.gridCol ?? 0,  oRow = observer.gridRow ?? 0;
        const dist = (iCol === 0 && iRow === 0 && oCol === 0 && oRow === 0)
          ? 3  // 测试环境无格坐标，默认近距离
          : Math.hypot(oCol - iCol, oRow - iRow);

        if (dist > DIALOGUE_CONFIG.maxJoinDistance) continue;

        const prob = calculateJoinProbability(observer, initiator, target, dist);

        if (prob > DIALOGUE_CONFIG.observation.threshold) {
          this.joinQueue.push({ char: observer, probability: prob });
          if (typeof log === 'function') {
            log(`${observer.short}被对话吸引（P=${(prob*100).toFixed(0)}%），准备加入...`);
          }
        }
      }
    }

    processJoinQueue() {
      // 每轮检查是否有新成员加入
      for (const entry of this.joinQueue.splice(0)) {
        this.addParticipant(entry.char);
      }
    }

    addParticipant(char) {
      if (this.participants.find(p => p.id === char.id)) return;
      
      this.participants.push(char);
      
      // 通知主对话添加参与者
      if (this.primaryDialogue) {
        this.primaryDialogue.addParticipant(char);
      }
      
      // 应用社交恢复
      if (char.needs) {
        char.needs.fun = Math.min(100, (char.needs.fun || 0) + 5);
      }
      
      if (typeof log === 'function') {
        log(`${char.short}加入了群聊`);
      }
      
      EventBus?.emit('groupchat:join', {
        groupId: this.id,
        charId: char.id,
        totalParticipants: this.participants.length,
      });
    }

    advance() {
      if (!this.isActive) return null;
      
      this.round++;
      
      // 处理新加入者
      this.processJoinQueue();
      
      // 检查私语化
      this.checkPrivateMode();
      
      // 推进主对话
      const line = this.primaryDialogue.advance();
      
      // 情绪传染
      this.spreadEmotion();
      
      // 检查结束
      if (!this.primaryDialogue.isActive || this.round >= this.maxRounds) {
        this.end();
      }
      
      return line;
    }

    checkPrivateMode() {
      // 检查是否有两人连续私语
      if (this.round < 3) return;
      
      // 简化：随机触发私语化（后续可根据实际对话内容判断）
      if (!this.privateMode && this.participants.length >= 3) {
        // 当两人连续互动多轮，可能形成私语
        const lastThree = this.primaryDialogue.history.slice(-3);
        const speakers = lastThree.map(l => l.speaker);
        
        // 如果只有两人在说话
        const uniqueSpeakers = [...new Set(speakers)];
        if (uniqueSpeakers.length === 2 && Math.random() < 0.2) {
          this.enterPrivateMode(uniqueSpeakers);
        }
      }
    }

    enterPrivateMode(pairIds) {
      this.privateMode = true;
      this.privatePair = pairIds;
      
      if (typeof log === 'function') {
        const names = pairIds.map(id => getChar(id)?.short || id).join('和');
        log(`${names}开始私语...`);
      }
      
      EventBus?.emit('groupchat:private', {
        groupId: this.id,
        pair: pairIds,
      });
    }

    spreadEmotion() {
      // 情绪传染：发言者的情绪影响聆听者
      const speaker = this.primaryDialogue.getCurrentSpeaker();
      const speakerEmotion = getDominantEmotion(speaker);
      
      if (!speakerEmotion) return;
      
      for (const participant of this.participants) {
        if (participant.id === speaker.id) continue;
        
        // 简化：聆听者有概率获得同情绪状态
        if (isPositiveEmotion(speakerEmotion) && Math.random() < 0.15) {
          if (typeof applyState === 'function') {
            applyState(participant, 'S001'); // 愉悦
          }
        } else if (isNegativeEmotion(speakerEmotion) && Math.random() < 0.1) {
          if (typeof applyState === 'function') {
            applyState(participant, 'S002'); // 忧伤
          }
        }
      }
    }

    end() {
      this.isActive = false;
      
      // 结束所有子对话
      for (const [id, dlg] of this.subDialogues) {
        if (dlg.isActive) dlg.end();
      }
      
      // 生成集体记忆
      this.createGroupMemory();
      
      EventBus?.emit('groupchat:end', {
        groupId: this.id,
        participants: this.participants.map(p => p.id),
        totalRounds: this.round,
        finalTopic: this.topic?.name,
      });
      
      activeDialogues.delete(this.id);
    }

    createGroupMemory() {
      const memoryTag = this.topic?.name || '群聊';
      
      for (const char of this.participants) {
        const memory = {
          type: 'groupchat',
          tag: memoryTag,
          participants: this.participants.map(p => p.id).filter(id => id !== char.id),
          valence: 1,
          timestamp: typeof getGameTimestamp === 'function' ? getGameTimestamp() : Date.now(),
          scene: this.scene?.name,
        };
        if (typeof TraitBehaviorSystem !== 'undefined') {
          TraitBehaviorSystem.addMemory(char, memory, { baseChance: 0.7 });
          continue;
        }
        if (!char.memories) char.memories = [];
        char.memories.push(memory);
      }
    }

    removeSubDialogue(dlgId) {
      this.subDialogues.delete(dlgId);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 公开API
  // ═══════════════════════════════════════════════════════════════════════════

  window.DialogueSystem = {
    // 启动双人对话
    startPairDialogue(initiator, target, interactionType, scene) {
      const dlg = new DialogueInstance(initiator, target, interactionType, scene);
      return dlg.id;
    },

    // 启动群聊（自动检测旁观者）
    startGroupChat(initiator, target, scene, nearbyChars = []) {
      const group = new GroupChatInstance(initiator, target, scene, nearbyChars);
      return group.id;
    },

    // 推进指定对话一轮
    advance(dialogueId) {
      const dlg = activeDialogues.get(dialogueId);
      if (dlg) return dlg.advance();
      return null;
    },

    // 获取对话实例
    get(dialogueId) {
      return activeDialogues.get(dialogueId);
    },

    // 获取所有活动对话
    getAllActive() {
      return Array.from(activeDialogues.values());
    },

    // 强制结束对话
    end(dialogueId) {
      const dlg = activeDialogues.get(dialogueId);
      if (dlg) dlg.end();
    },

    // 配置访问
    get config() { return DIALOGUE_CONFIG; },
    get topics() { return TOPIC_LIBRARY; },

    // 计算观察意愿（供测试页使用）
    calculateObservationProb(observer, primaryA, primaryB, distance) {
      return calculateJoinProbability(observer, primaryA, primaryB, distance);
    },

    // 计算轮次（供测试页使用）
    calculateRounds: calculateRounds,
  };

})();
