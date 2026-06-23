/* ═══════════════════════ STATE DEFS ═══════════════════════════════════════
 *  从《状态总表_结构化版.csv》生成
 *  duration 单位：游戏分钟（-1 = 永久/条件性消除）
 *  conflictGroup：同组状态互斥（applyState 时自动移除同组旧状态）
 */

// 冲突组定义（同组内同时最多保留 1 个状态，后来居上）
const STATE_CONFLICT_GROUPS = {
  mood_positive: 'mood_positive',   // 愉悦/平静/兴奋 等正向情绪互斥
  mood_negative: 'mood_negative',   // 忧伤/愤怒/恐惧 等负向情绪互斥
  drunk_state:   'drunk_state',     // 微醺→大醉→宿醉 等级互斥
  social_atmo:   'social_atmo',     // 热络 vs 冷场
  love_reaction: 'love_reaction',   // 心动 vs 被拒
  hunger_state:  'hunger_state',    // 饥饿/腹中空空 vs 饱腹
  energy_state:  'energy_state',    // 精疲力竭/困倦 vs 神清气爽
  temp_state:    'temp_state',      // 风寒/中暑/燥热/畏寒
  protocol_keep: 'protocol_keep',   // 守礼状态互斥
  protocol_break:'protocol_break',  // 逾矩/离经叛道
};

// 注入所有 CSV 状态到 CONFIG.stateDefs（在 config.js 后执行）
(function injectCSVStates() {
  const root = (typeof globalThis !== 'undefined') ? globalThis : window;
  const defaultConfig = root.DEFAULT_CONFIG
    || ((typeof DEFAULT_CONFIG !== 'undefined') ? DEFAULT_CONFIG : null);
  if (!defaultConfig) { console.warn('[state-defs] DEFAULT_CONFIG not ready'); return; }
  root.DEFAULT_CONFIG = defaultConfig;
  const defs = defaultConfig.stateDefs || (defaultConfig.stateDefs = {});
  const csvStates = {
  "S001": {
    "name": "愉悦",
    "duration": 120,
    "desc": "心情轻快，看什么都顺眼",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S002": {
    "name": "忧伤",
    "duration": 180,
    "desc": "心中愁闷，提不起精神",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S003": {
    "name": "愤怒",
    "duration": 90,
    "desc": "怒不可遏，随时可能爆发",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S004": {
    "name": "恐惧",
    "duration": 120,
    "desc": "战战兢兢，如履薄冰",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S005": {
    "name": "惊诧",
    "duration": 10,
    "desc": "一时愕然，不知所措",
    "category": "情绪类",
    "stackable": true
  },
  "S006": {
    "name": "羞赧",
    "duration": 60,
    "desc": "脸红耳热，不好意思",
    "category": "情绪类",
    "stackable": true
  },
  "S007": {
    "name": "平静",
    "duration": 180,
    "desc": "心如止水，波澜不惊",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S008": {
    "name": "焦虑",
    "duration": 120,
    "desc": "心神不宁，坐立不安",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S009": {
    "name": "嫉妒",
    "duration": 120,
    "desc": "见人得意，心中酸涩",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S010": {
    "name": "释然",
    "duration": 60,
    "desc": "放下执念，轻松自在",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S011": {
    "name": "得意",
    "duration": 90,
    "desc": "春风得意，喜形于色",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S012": {
    "name": "失望",
    "duration": 120,
    "desc": "期望落空，心中怅然",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S013": {
    "name": "怀念",
    "duration": 60,
    "desc": "睹物思人，心中感伤",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S014": {
    "name": "愧疚",
    "duration": 180,
    "desc": "良心不安，想要弥补",
    "category": "情绪类",
    "stackable": true
  },
  "S015": {
    "name": "羡慕",
    "duration": 60,
    "desc": "心向往之，但无恶意",
    "category": "情绪类",
    "stackable": true
  },
  "S016": {
    "name": "孤独",
    "duration": 120,
    "desc": "形单影只，心中寂寥",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S017": {
    "name": "自豪",
    "duration": 120,
    "desc": "成就加身，意气风发",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S018": {
    "name": "迷茫",
    "duration": 180,
    "desc": "前路不明，不知何去何从",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S019": {
    "name": "烦躁",
    "duration": 60,
    "desc": "心绪不宁，容易发火",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S020": {
    "name": "感动",
    "duration": 90,
    "desc": "热泪盈眶，心中温暖",
    "category": "情绪类",
    "stackable": true
  },
  "S021": {
    "name": "无聊",
    "duration": 60,
    "desc": "无所事事，百无聊赖",
    "category": "情绪类",
    "stackable": true
  },
  "S022": {
    "name": "欣慰",
    "duration": 60,
    "desc": "看到成果，心中满足",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S023": {
    "name": "无奈",
    "duration": 60,
    "desc": "无力改变，只能接受",
    "category": "情绪类",
    "stackable": true
  },
  "S024": {
    "name": "兴奋",
    "duration": 60,
    "desc": "情绪高涨，充满活力",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S025": {
    "name": "忧郁",
    "duration": 120,
    "desc": "淡淡的愁绪，挥之不去",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S026": {
    "name": "镇定",
    "duration": 60,
    "desc": "临危不乱，从容应对",
    "category": "情绪类",
    "stackable": true
  },
  "S027": {
    "name": "厌烦",
    "duration": 60,
    "desc": "心生反感，不愿接触",
    "category": "情绪类",
    "stackable": true
  },
  "S028": {
    "name": "憧憬",
    "duration": 60,
    "desc": "向往美好，满怀期待",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_positive"
  },
  "S029": {
    "name": "忐忑",
    "duration": 60,
    "desc": "心中七上八下，不安稳",
    "category": "情绪类",
    "stackable": true
  },
  "S030": {
    "name": "麻木",
    "duration": 240,
    "desc": "心如死灰，毫无波澜",
    "category": "情绪类",
    "stackable": true,
    "conflictGroup": "mood_negative"
  },
  "S101": {
    "name": "尴尬",
    "duration": 30,
    "desc": "气氛微妙，不知如何自处",
    "category": "社交状态",
    "stackable": true
  },
  "S102": {
    "name": "热络",
    "duration": 60,
    "desc": "相谈甚欢，距离拉近",
    "category": "社交状态",
    "stackable": true,
    "conflictGroup": "social_atmo"
  },
  "S103": {
    "name": "冷场",
    "duration": 20,
    "desc": "话不投机，气氛凝固",
    "category": "社交状态",
    "stackable": true,
    "conflictGroup": "social_atmo"
  },
  "S104": {
    "name": "心动",
    "duration": 120,
    "desc": "心如鹿撞，意乱情迷",
    "category": "社交状态",
    "stackable": true,
    "conflictGroup": "love_reaction"
  },
  "S105": {
    "name": "被拒",
    "duration": 60,
    "desc": "一片真心付流水",
    "category": "社交状态",
    "stackable": true,
    "conflictGroup": "love_reaction"
  },
  "S106": {
    "name": "受宠若惊",
    "duration": 120,
    "desc": "被主子/长辈特别对待",
    "category": "社交状态",
    "stackable": true
  },
  "S107": {
    "name": "惺惺相惜",
    "duration": 180,
    "desc": "彼此欣赏，相见恨晚",
    "category": "社交状态",
    "stackable": true
  },
  "S108": {
    "name": "敬而远之",
    "duration": 120,
    "desc": "保持距离，不敢亲近",
    "category": "社交状态",
    "stackable": true
  },
  "S109": {
    "name": "言归于好",
    "duration": 120,
    "desc": "冰释前嫌，重修旧好",
    "category": "社交状态",
    "stackable": true
  },
  "S110": {
    "name": "心有灵犀",
    "duration": 60,
    "desc": "默契十足，不需多言",
    "category": "社交状态",
    "stackable": true
  },
  "S111": {
    "name": "敷衍应付",
    "duration": 60,
    "desc": "表面客气，实则无心",
    "category": "社交状态",
    "stackable": true
  },
  "S112": {
    "name": "一见如故",
    "duration": -1,
    "desc": "初次见面便觉投缘",
    "category": "社交状态",
    "stackable": true
  },
  "S113": {
    "name": "针锋相对",
    "duration": 60,
    "desc": "各不相让，言语交锋",
    "category": "社交状态",
    "stackable": true
  },
  "S114": {
    "name": "虚与委蛇",
    "duration": 60,
    "desc": "表面应承，实则敷衍",
    "category": "社交状态",
    "stackable": true
  },
  "S115": {
    "name": "推心置腹",
    "duration": -1,
    "desc": "坦诚相待，倾诉心声",
    "category": "社交状态",
    "stackable": true
  },
  "S116": {
    "name": "貌合神离",
    "duration": 120,
    "desc": "表面和谐，实则疏远",
    "category": "社交状态",
    "stackable": true
  },
  "S117": {
    "name": "相敬如宾",
    "duration": -1,
    "desc": "互相尊重，保持礼节",
    "category": "社交状态",
    "stackable": true
  },
  "S118": {
    "name": "若即若离",
    "duration": 120,
    "desc": "关系暧昧，忽近忽远",
    "category": "社交状态",
    "stackable": true
  },
  "S119": {
    "name": "唇枪舌剑",
    "duration": 60,
    "desc": "言语激烈，互不相让",
    "category": "社交状态",
    "stackable": true
  },
  "S120": {
    "name": "互诉衷肠",
    "duration": -1,
    "desc": "互相倾诉，感情加深",
    "category": "社交状态",
    "stackable": true
  },
  "S121": {
    "name": "阿谀奉承",
    "duration": 60,
    "desc": "刻意讨好，言过其实",
    "category": "社交状态",
    "stackable": true
  },
  "S122": {
    "name": "冷嘲热讽",
    "duration": 60,
    "desc": "言语刻薄，暗含讥讽",
    "category": "社交状态",
    "stackable": true
  },
  "S123": {
    "name": "交浅言深",
    "duration": 60,
    "desc": "关系不深却谈及私密",
    "category": "社交状态",
    "stackable": true
  },
  "S124": {
    "name": "情投意合",
    "duration": 180,
    "desc": "心意相通，彼此爱慕",
    "category": "社交状态",
    "stackable": true
  },
  "S125": {
    "name": "渐行渐远",
    "duration": -1,
    "desc": "关系逐渐疏离",
    "category": "社交状态",
    "stackable": true
  },
  "S126": {
    "name": "反目成仇",
    "duration": -1,
    "desc": "由友变敌，势不两立",
    "category": "社交状态",
    "stackable": true
  },
  "S127": {
    "name": "重修旧好",
    "duration": -1,
    "desc": "破裂关系重新修复",
    "category": "社交状态",
    "stackable": true
  },
  "S128": {
    "name": "一见钟情",
    "duration": 240,
    "desc": "初次见面便生爱慕",
    "category": "社交状态",
    "stackable": true
  },
  "S129": {
    "name": "日久生情",
    "duration": -1,
    "desc": "长期相处产生感情",
    "category": "社交状态",
    "stackable": true
  },
  "S130": {
    "name": "藕断丝连",
    "duration": 120,
    "desc": "关系已断，情丝未绝",
    "category": "社交状态",
    "stackable": true
  },
  "S201": {
    "name": "自降身份",
    "duration": 120,
    "desc": "屈尊俯就，惹人闲话",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S202": {
    "name": "冒犯",
    "duration": 60,
    "desc": "不知天高地厚",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S203": {
    "name": "暗生情愫",
    "duration": 180,
    "desc": "逾越身份的暧昧",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S204": {
    "name": "宠溺",
    "duration": 120,
    "desc": "毫无底线地纵容",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S205": {
    "name": "不孝",
    "duration": 360,
    "desc": "忤逆尊长",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S206": {
    "name": "受责",
    "duration": 240,
    "desc": "被训斥或惩罚",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S207": {
    "name": "姑息",
    "duration": 720,
    "desc": "放任逾矩而不追究",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S208": {
    "name": "僭越",
    "duration": 180,
    "desc": "逾越本分，越级行事",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S209": {
    "name": "恃宠而骄",
    "duration": 240,
    "desc": "仗着宠爱，行为放肆",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S210": {
    "name": "礼崩乐坏",
    "duration": 360,
    "desc": "纲常混乱，上下失序",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S211": {
    "name": "纲常重整",
    "duration": 480,
    "desc": "严厉整顿，恢复秩序",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S212": {
    "name": "私相授受",
    "duration": 120,
    "desc": "私下往来，不合礼法",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S213": {
    "name": "目无尊长",
    "duration": -1,
    "desc": "对长辈毫无敬意",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S214": {
    "name": "以下犯上",
    "duration": 240,
    "desc": "下级冒犯上级",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S215": {
    "name": "尊卑有序",
    "duration": -1,
    "desc": "严格遵守身份等级",
    "category": "逾矩与身份礼法状态",
    "stackable": true,
    "conflictGroup": "protocol_keep"
  },
  "S216": {
    "name": "越俎代庖",
    "duration": 180,
    "desc": "代替他人行使权力",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S217": {
    "name": "恃才傲物",
    "duration": 120,
    "desc": "仗着才华，轻视礼法",
    "category": "逾矩与身份礼法状态",
    "stackable": true,
    "conflictGroup": "protocol_break"
  },
  "S218": {
    "name": "谨守本分",
    "duration": -1,
    "desc": "安分守己，不越雷池",
    "category": "逾矩与身份礼法状态",
    "stackable": true,
    "conflictGroup": "protocol_keep"
  },
  "S219": {
    "name": "同流合污",
    "duration": 240,
    "desc": "共同逾矩，互相包庇",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S220": {
    "name": "揭发检举",
    "duration": -1,
    "desc": "举报他人逾矩行为",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S221": {
    "name": "包庇纵容",
    "duration": 120,
    "desc": "知情不报，暗中掩护",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S222": {
    "name": "以儆效尤",
    "duration": 480,
    "desc": "严惩一人，警示众人",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S223": {
    "name": "法外开恩",
    "duration": -1,
    "desc": "本应惩罚，却予宽恕",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S224": {
    "name": "严刑峻法",
    "duration": 360,
    "desc": "刑罚严苛，毫不留情",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S225": {
    "name": "宽严相济",
    "duration": -1,
    "desc": "恩威并施，张弛有度",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S226": {
    "name": "上行下效",
    "duration": 360,
    "desc": "上梁不正下梁歪",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S227": {
    "name": "正本清源",
    "duration": -1,
    "desc": "整顿风气，回归正轨",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S228": {
    "name": "离经叛道",
    "duration": -1,
    "desc": "彻底背离礼法纲常",
    "category": "逾矩与身份礼法状态",
    "stackable": true,
    "conflictGroup": "protocol_break"
  },
  "S229": {
    "name": "浪子回头",
    "duration": -1,
    "desc": "改过自新，回归正途",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S230": {
    "name": "积重难返",
    "duration": -1,
    "desc": "逾矩成风，难以扭转",
    "category": "逾矩与身份礼法状态",
    "stackable": true
  },
  "S301": {
    "name": "金兰之契",
    "duration": -1,
    "desc": "结义兄弟/姐妹，肝胆相照",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S303": {
    "name": "芥蒂",
    "duration": -1,
    "desc": "心中生隙，难以释怀",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S304": {
    "name": "相看两厌",
    "duration": -1,
    "desc": "彼此生厌，不愿同处",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S305": {
    "name": "主仆同心",
    "duration": -1,
    "desc": "多年主仆，默契十足",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S306": {
    "name": "生死之交",
    "duration": -1,
    "desc": "共历生死，情谊深厚",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S307": {
    "name": "恩断义绝",
    "duration": -1,
    "desc": "彻底断绝关系",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S308": {
    "name": "亦师亦友",
    "duration": -1,
    "desc": "既是师长，又是朋友",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S309": {
    "name": "势同水火",
    "duration": -1,
    "desc": "矛盾激烈，无法共存",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S310": {
    "name": "情同手足",
    "duration": -1,
    "desc": "感情深厚，如同亲兄弟",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S311": {
    "name": "貌合神离",
    "duration": -1,
    "desc": "表面和谐，实则疏远",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S312": {
    "name": "同床异梦",
    "duration": -1,
    "desc": "夫妻/伴侣间心不合",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S313": {
    "name": "肝胆相照",
    "duration": -1,
    "desc": "真心相待，毫无保留",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S314": {
    "name": "忘年之交",
    "duration": -1,
    "desc": "年龄差距大但情谊深",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S315": {
    "name": "红颜知己",
    "duration": -1,
    "desc": "异性知己，心灵相通",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S316": {
    "name": "蓝颜知己",
    "duration": -1,
    "desc": "同性知己，情谊深厚",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S317": {
    "name": "不共戴天",
    "duration": -1,
    "desc": "深仇大恨，誓不两立",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S318": {
    "name": "相濡以沫",
    "duration": -1,
    "desc": "困境中互相扶持",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S319": {
    "name": "分道扬镳",
    "duration": -1,
    "desc": "各自选择不同道路",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S320": {
    "name": "破镜重圆",
    "duration": -1,
    "desc": "破裂关系重新复合",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S321": {
    "name": "青梅竹马",
    "duration": -1,
    "desc": "从小一起长大",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S322": {
    "name": "萍水相逢",
    "duration": -1,
    "desc": "短暂相遇，缘分浅薄",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S323": {
    "name": "莫逆之交",
    "duration": -1,
    "desc": "志同道合，情投意合",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S324": {
    "name": "刎颈之交",
    "duration": -1,
    "desc": "可以为对方牺牲生命",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S325": {
    "name": "点头之交",
    "duration": -1,
    "desc": "仅限见面打招呼",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S326": {
    "name": "患难与共",
    "duration": -1,
    "desc": "共同面对困难",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S327": {
    "name": "反目成仇",
    "duration": -1,
    "desc": "由友变敌",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S328": {
    "name": "一见如故",
    "duration": -1,
    "desc": "初次见面便觉投缘",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S329": {
    "name": "日久生情",
    "duration": -1,
    "desc": "长期相处产生感情",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S330": {
    "name": "藕断丝连",
    "duration": -1,
    "desc": "关系已断，情丝未绝",
    "category": "关系特殊状态",
    "stackable": true
  },
  "S401": {
    "name": "饥肠辘辘",
    "duration": -1,
    "desc": "饿得头昏眼花",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "hunger_state"
  },
  "S402": {
    "name": "精疲力竭",
    "duration": -1,
    "desc": "站着都能睡着",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "energy_state",
    "blockedSkills": [
      "handcraft"
    ]
  },
  "S403": {
    "name": "蓬头垢面",
    "duration": -1,
    "desc": "仪容不整，羞于见人",
    "category": "需求与生理状态",
    "stackable": true,
    "blockedSkills": [
      "charm"
    ]
  },
  "S404": {
    "name": "微醺",
    "duration": 120,
    "desc": "酒意上脸，话变多了",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "drunk_state"
  },
  "S405": {
    "name": "酩酊大醉",
    "duration": 240,
    "desc": "烂醉如泥，胡言乱语",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "drunk_state",
    "blockedSkills": [
      "logic"
    ]
  },
  "S406": {
    "name": "养尊处优",
    "duration": 60,
    "desc": "舒适至极，心满意足",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S407": {
    "name": "神清气爽",
    "duration": 180,
    "desc": "精力充沛，状态极佳",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "energy_state"
  },
  "S408": {
    "name": "口干舌燥",
    "duration": -1,
    "desc": "极度口渴，难以忍受",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S409": {
    "name": "腹中空空",
    "duration": -1,
    "desc": "轻微饥饿，影响状态",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "hunger_state"
  },
  "S410": {
    "name": "困倦",
    "duration": -1,
    "desc": "眼皮沉重，想睡觉",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "energy_state"
  },
  "S411": {
    "name": "风寒",
    "duration": 2880,
    "desc": "受凉感冒，身体不适",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "temp_state"
  },
  "S412": {
    "name": "中暑",
    "duration": 360,
    "desc": "暑热侵袭，头晕目眩",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "temp_state"
  },
  "S413": {
    "name": "腹痛",
    "duration": 180,
    "desc": "肚子疼痛，难以集中",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S414": {
    "name": "头痛",
    "duration": 120,
    "desc": "头部疼痛，思绪混乱",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S415": {
    "name": "腰酸背痛",
    "duration": 240,
    "desc": "身体酸痛，行动不便",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S416": {
    "name": "发热",
    "duration": 4320,
    "desc": "体温升高，身体虚弱",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S417": {
    "name": "腹泻",
    "duration": 1440,
    "desc": "频繁如厕，身体脱水",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S418": {
    "name": "咳嗽",
    "duration": 2880,
    "desc": "频繁咳嗽，影响交流",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S419": {
    "name": "失眠",
    "duration": -1,
    "desc": "难以入睡，精神萎靡",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S420": {
    "name": "噩梦",
    "duration": 480,
    "desc": "睡眠质量差，惊醒",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S421": {
    "name": "宿醉",
    "duration": 360,
    "desc": "酒后不适，头痛恶心",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "drunk_state"
  },
  "S422": {
    "name": "饱腹",
    "duration": 120,
    "desc": "吃得过饱，行动迟缓",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "hunger_state"
  },
  "S423": {
    "name": "燥热",
    "duration": 180,
    "desc": "体内燥热，心烦意乱",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "temp_state"
  },
  "S424": {
    "name": "畏寒",
    "duration": -1,
    "desc": "怕冷，需要保暖",
    "category": "需求与生理状态",
    "stackable": true,
    "conflictGroup": "temp_state"
  },
  "S425": {
    "name": "眩晕",
    "duration": 60,
    "desc": "头晕目眩，站立不稳",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S426": {
    "name": "麻木",
    "duration": 120,
    "desc": "肢体麻木，感觉迟钝",
    "category": "需求与生理状态",
    "stackable": true,
    "blockedSkills": [
      "handcraft"
    ]
  },
  "S427": {
    "name": "气喘",
    "duration": 60,
    "desc": "呼吸急促，体力不支",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S428": {
    "name": "耳鸣",
    "duration": 180,
    "desc": "耳中鸣响，影响听力",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S429": {
    "name": "视力模糊",
    "duration": 240,
    "desc": "看不清楚，影响阅读",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S430": {
    "name": "牙痛",
    "duration": -1,
    "desc": "牙齿疼痛，难以进食",
    "category": "需求与生理状态",
    "stackable": true
  },
  "S501": {
    "name": "功课缠身",
    "duration": -1,
    "desc": "有未完成的功课任务",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S502": {
    "name": "禁足",
    "duration": -1,
    "desc": "不许踏出院子",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S503": {
    "name": "思过",
    "duration": -1,
    "desc": "面壁反省中",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S504": {
    "name": "受命",
    "duration": -1,
    "desc": "领了差事，不敢怠慢",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S505": {
    "name": "待命",
    "duration": -1,
    "desc": "随时准备执行指令",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S506": {
    "name": "巡查",
    "duration": -1,
    "desc": "巡视检查中",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S507": {
    "name": "采购",
    "duration": -1,
    "desc": "外出采买物品",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S508": {
    "name": "传话",
    "duration": -1,
    "desc": "传递消息",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S509": {
    "name": "侍奉",
    "duration": -1,
    "desc": "贴身伺候主子",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S510": {
    "name": "抄经",
    "duration": -1,
    "desc": "抄写经书",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S511": {
    "name": "罚跪",
    "duration": -1,
    "desc": "被罚跪地反省",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S512": {
    "name": "守夜",
    "duration": -1,
    "desc": "夜间值守",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S513": {
    "name": "洒扫",
    "duration": -1,
    "desc": "打扫庭院",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S514": {
    "name": "缝补",
    "duration": -1,
    "desc": "缝补衣物",
    "category": "任务与指令状态",
    "stackable": true,
    "blockedSkills": [
      "handcraft"
    ]
  },
  "S515": {
    "name": "烹茶",
    "duration": -1,
    "desc": "准备茶水",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S516": {
    "name": "诵经",
    "duration": -1,
    "desc": "诵读经文",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S517": {
    "name": "练字",
    "duration": -1,
    "desc": "练习书法",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S518": {
    "name": "抚琴",
    "duration": -1,
    "desc": "弹奏古琴",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S519": {
    "name": "对弈",
    "duration": -1,
    "desc": "下棋对局",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S520": {
    "name": "作诗",
    "duration": -1,
    "desc": "创作诗词",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S521": {
    "name": "绘画",
    "duration": -1,
    "desc": "绘制画作",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S522": {
    "name": "刺绣",
    "duration": -1,
    "desc": "刺绣女红",
    "category": "任务与指令状态",
    "stackable": true,
    "blockedSkills": [
      "handcraft"
    ]
  },
  "S523": {
    "name": "酿酒",
    "duration": -1,
    "desc": "酿造酒水",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S524": {
    "name": "制药",
    "duration": -1,
    "desc": "配制药材",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S525": {
    "name": "驯兽",
    "duration": -1,
    "desc": "训练动物",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S526": {
    "name": "修缮",
    "duration": -1,
    "desc": "修理物品",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S527": {
    "name": "记账",
    "duration": -1,
    "desc": "记录账目",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S528": {
    "name": "待客",
    "duration": -1,
    "desc": "接待客人",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S529": {
    "name": "送信",
    "duration": -1,
    "desc": "送递书信",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S530": {
    "name": "备宴",
    "duration": -1,
    "desc": "准备宴席",
    "category": "任务与指令状态",
    "stackable": true
  },
  "S601": {
    "name": "触景生情",
    "duration": 30,
    "desc": "想起往事，心中感慨",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S602": {
    "name": "感同身受",
    "duration": -1,
    "desc": "目睹他人情绪，深受感染",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S603": {
    "name": "幸灾乐祸",
    "duration": 15,
    "desc": "看人倒霉，心中暗爽",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S604": {
    "name": "围观",
    "duration": -1,
    "desc": "被热闹吸引",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S605": {
    "name": "恍然大悟",
    "duration": 60,
    "desc": "突然明白，茅塞顿开",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S606": {
    "name": "睹物思人",
    "duration": 60,
    "desc": "看到物品想起主人",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S607": {
    "name": "似曾相识",
    "duration": 30,
    "desc": "感觉曾经经历过",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S608": {
    "name": "灵光一现",
    "duration": 15,
    "desc": "突然获得创意灵感",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S609": {
    "name": "记忆闪回",
    "duration": 10,
    "desc": "突然回忆起片段",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S610": {
    "name": "顿悟",
    "duration": -1,
    "desc": "深刻理解，境界提升",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S611": {
    "name": "怀旧",
    "duration": 60,
    "desc": "怀念过去时光",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S612": {
    "name": "预见",
    "duration": 30,
    "desc": "隐约看到未来片段",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S613": {
    "name": "既视感",
    "duration": 20,
    "desc": "强烈感觉发生过",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S615": {
    "name": "灵感枯竭",
    "duration": 180,
    "desc": "缺乏创意，思维僵化",
    "category": "观察与记忆触发状态",
    "stackable": true
  },
  "S701": {
    "name": "痴狂",
    "duration": -1,
    "desc": "宝玉式痴病",
    "category": "特殊状态",
    "stackable": true,
    "blockedSkills": [
      "logic"
    ]
  },
  "S702": {
    "name": "心碎",
    "duration": 2880,
    "desc": "哀莫大于心死",
    "category": "特殊状态",
    "stackable": true
  },
  "S703": {
    "name": "病中",
    "duration": 4320,
    "desc": "身体抱恙",
    "category": "特殊状态",
    "stackable": true
  },
  "S704": {
    "name": "重责",
    "duration": 720,
    "desc": "受到严厉惩罚",
    "category": "特殊状态",
    "stackable": true
  },
  "S705": {
    "name": "顿悟",
    "duration": -1,
    "desc": "突然领悟大道",
    "category": "特殊状态",
    "stackable": true
  },
  "S707": {
    "name": "开窍",
    "duration": -1,
    "desc": "突然开悟，智慧增长",
    "category": "特殊状态",
    "stackable": true
  },
  "S708": {
    "name": "封印",
    "duration": -1,
    "desc": "能力被封印",
    "category": "特殊状态",
    "stackable": true
  },
  "S709": {
    "name": "附身",
    "duration": -1,
    "desc": "被他人/灵体附身",
    "category": "特殊状态",
    "stackable": true
  },
  "S710": {
    "name": "诅咒",
    "duration": -1,
    "desc": "受到恶毒诅咒",
    "category": "特殊状态",
    "stackable": true
  },
  "S711": {
    "name": "祝福",
    "duration": 10080,
    "desc": "获得神灵祝福",
    "category": "特殊状态",
    "stackable": true
  },
  "S712": {
    "name": "天命",
    "duration": -1,
    "desc": "背负特殊命运",
    "category": "特殊状态",
    "stackable": true
  },
  "S713": {
    "name": "劫数",
    "duration": -1,
    "desc": "命中注定劫难",
    "category": "特殊状态",
    "stackable": true
  },
  "S714": {
    "name": "功德",
    "duration": -1,
    "desc": "积累善行功德",
    "category": "特殊状态",
    "stackable": true
  },
  "S715": {
    "name": "业障",
    "duration": -1,
    "desc": "积累恶行业障",
    "category": "特殊状态",
    "stackable": true
  },
  "S716": {
    "name": "轮回",
    "duration": -1,
    "desc": "进入轮回转世",
    "category": "特殊状态",
    "stackable": true
  },
  "S717": {
    "name": "涅槃",
    "duration": -1,
    "desc": "超脱生死，境界升华",
    "category": "特殊状态",
    "stackable": true
  },
  "S721": {
    "name": "破劫",
    "duration": -1,
    "desc": "成功渡过劫难",
    "category": "特殊状态",
    "stackable": true
  },
  "S722": {
    "name": "应运",
    "duration": -1,
    "desc": "顺应天命气运",
    "category": "特殊状态",
    "stackable": true
  },
  "S723": {
    "name": "逆天",
    "duration": -1,
    "desc": "违逆天命规则",
    "category": "特殊状态",
    "stackable": true
  },
  "S724": {
    "name": "合道",
    "duration": -1,
    "desc": "与大道合一",
    "category": "特殊状态",
    "stackable": true
  },
  "S725": {
    "name": "斩尸",
    "duration": -1,
    "desc": "斩去三尸，成就准圣",
    "category": "特殊状态",
    "stackable": true
  },
  "S726": {
    "name": "证道",
    "duration": -1,
    "desc": "证明自身大道",
    "category": "特殊状态",
    "stackable": true
  },
  "S727": {
    "name": "寂灭",
    "duration": -1,
    "desc": "进入不生不灭状态",
    "category": "特殊状态",
    "stackable": true
  },
  "S728": {
    "name": "显圣",
    "duration": 60,
    "desc": "神灵显灵于世",
    "category": "特殊状态",
    "stackable": true
  },
  "S729": {
    "name": "封神",
    "duration": -1,
    "desc": "死后被封为神",
    "category": "特殊状态",
    "stackable": true
  },
  "S730": {
    "name": "应身",
    "duration": 30,
    "desc": "神灵化身降临",
    "category": "特殊状态",
    "stackable": true
  }
};
  // 已存在的同名状态不覆盖（保留 config.js 中有 needMods/aiModifiers 的精细配置）
  for (const [id, def] of Object.entries(csvStates)) {
    if (!defs[id]) defs[id] = def;
  }

  // ── 为 config.js 中已有的 camelCase 状态补充 conflictGroup ────────────────
  const camelConflicts = {
    // 情绪正向
    elated: 'mood_positive', joyful: 'mood_positive', zizai: 'mood_positive', renao: 'mood_positive',
    // 情绪负向
    melancholy: 'mood_negative', baonu: 'mood_negative', ganshang: 'mood_negative',
    // 醉酒
    drunk: 'drunk_state',
    // 温病
    rezhen: 'temp_state', chikuang: 'temp_state',
    // 关系反馈（与 CSV 同概念，不同 id）
    awkward: 'social_awk', selfDemeaning: 'social_awk', offended: 'social_awk',
  };
  for (const [id, cg] of Object.entries(camelConflicts)) {
    if (defs[id] && !defs[id].conflictGroup) defs[id].conflictGroup = cg;
  }
})();
