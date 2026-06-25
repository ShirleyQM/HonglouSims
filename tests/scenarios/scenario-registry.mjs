export const scenarios = [
  {
    id: 'routine-follow-baoyu',
    name: '袭人早上随侍宝玉',
    status: 'planned',
    modules: ['起居', '随侍', '传令', '关系服从', 'Utility AI', '任务'],
    goal: '验证随侍轮值能投影到起居，并通过任务/AI 让仆从靠近主子。',
    acceptance: [
      '传令面板显示袭人及服从/预计接受。',
      '起居中存在随侍投影。',
      'Utility AI 倾向跟随或靠近宝玉。',
      '需求危机时可请辞并在解决后归队。',
    ],
  },
  {
    id: 'routine-skill-daiyu',
    name: '黛玉午后读书',
    status: 'planned',
    modules: ['起居', '技能', '家具', 'Utility AI'],
    goal: '验证技能/职业作息能提升读书、书桌等候选权重。',
    acceptance: [
      '当前时段读取到技能/职业锚点。',
      '读书相关家具候选获得 routineFactor 加权。',
      '行动后技能或需求变化可解释。',
    ],
  },
  {
    id: 'command-group-cleaning',
    name: '群体传令洒扫',
    status: 'planned',
    modules: ['传令', '身份权限', '任务', '仆从职责'],
    goal: '验证群体传令按身份和职责筛选目标，并生成批次任务。',
    acceptance: [
      '右侧群体传令显示命中人数。',
      '不符合条件者被排除。',
      '下发后生成 batchId。',
    ],
  },
  {
    id: 'need-crisis-interrupt',
    name: '需求危机打断任务',
    status: 'planned',
    modules: ['需求', '任务', '随侍', 'Utility AI', '家具'],
    goal: '验证严重需求危机高于普通作息和普通任务。',
    acceptance: [
      '危机需求触发更高权重。',
      '人物解决需求后回归未完成任务。',
      '日志或埋点可解释打断原因。',
    ],
  },
  {
    id: 'map-edge-protection',
    name: '地图边缘保护',
    status: 'planned',
    modules: ['场景', '寻路', '社交', '跟随'],
    goal: '验证多人社交、跟随或寻路不会把人物推到空白地图。',
    acceptance: [
      '人物不会落入无场景格。',
      '目标不可达时有兜底点。',
      '长时间模拟无卡死。',
    ],
  },
];
