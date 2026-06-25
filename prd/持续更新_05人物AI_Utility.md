# NPC AI 架构与戏剧化

> AI 与梦想系统的统一分层方案见 `持续更新_19_AI与梦想系统联动.md`。本文继续作为 Utility、作息、候选评分和 AI 行为质量的专项文档。

## 2026-06-25 置顶补充：起居覆盖层与 Utility AI 兜底合并

起居系统已经并入 Utility AI 的候选评分链，不再作为独立脚本执行层。当前口径如下：

- 新起居 profile block 是当前时段的显式覆盖层；当前时段存在新起居块时，只返回新起居锚点。
- 当前时段没有新起居块时，旧 `routineAnchors` 作为第一层兜底。
- 当前时段没有新起居块且没有旧 `routineAnchors` 命中时，旧 `scheduleWindows` 转换为宽泛起居锚点作为第二层兜底。
- `calcScheduleFactor` 不再独立乘入最终权重，固定返回 `factor=1`；`scheduleWindow` 仅保留兜底来源诊断。
- 起居、旧基础作息、旧日程窗口最终都只通过统一的 `routineFactor` 影响候选，避免新起居、旧作息、旧日程三套权重重复叠乘。

### 起居锚点与候选匹配

每个起居活动最终会转换为同一种 routine anchor。需求、技能、职业活动都使用统一字段接入：

| 字段 | Utility AI 用途 |
|---|---|
| `completeBy.categories` | 匹配家具候选的 `category`、家具模板类别，以及社交互动候选的 `category`。 |
| `completeBy.tags` | 匹配候选 `tags`、需求恢复标签、社交标签。 |
| `needs` | 参与需求压力计算，低需求会放大未完成锚点。 |
| `boost/cut/completeCut` | 进入 `calcRoutineFactor` 的乘法加权与完成后抑制。 |
| `requiredProfessions` | 职业身份接入口；不满足时降低匹配收益。 |
| `requiredSkills` | 技能系统接入口；不满足时降低匹配收益。 |
| `requiredFurniture` | 家具互动接入口；用于约束或强调指定家具类型。 |

实际候选来源保持不变：家具 provider 继续产出 `furniture` 候选，社交 provider 继续产出 `interaction/seek` 候选。起居层只在 `finalizeCandidate` 阶段根据当前锚点调用 `candMatchesRoutineAnchor` 和 `calcRoutineFactor` 调整权重。

### 需求活动验收结果

本轮已用本地运行时验证以下链路：

| 起居活动 | 实际候选 | 匹配口径 | 验证结果 |
|---|---|---|---|
| 早餐 `routine_meal_breakfast` | 家具候选 `category=meal`、`tags=hunger` | `completeBy.categories=meal/kitchen`，`completeBy.tags=hunger` | `routineFactor=5.5`，`scheduleFactor=1`。 |
| 梳洗 `routine_hygiene` | 家具候选 `category=bath`、`tags=hygiene` | `completeBy.categories=bath/wash/wardrobe`，`completeBy.tags=hygiene` | `routineFactor≈3.84`，`scheduleFactor=1`。 |
| 请安 `routine_visit` | 社交互动候选 `category=xujiu`、`tags=social` | `completeBy.categories=xujiu/weijie/chuanqing`，`completeBy.tags=social` | `routineFactor=1.6`，`scheduleFactor=1`。 |
| 就寝 `routine_sleep_night` | 家具候选 `category=bed`、`tags=sleep/energy` | `completeBy.categories=bed/rest`，`completeBy.tags=sleep/energy` | 跨日 `22:00-06:00` 命中，`routineFactor=5.5`。 |

兜底链路也已验证：

- 新起居就寝时段命中 `routine_sleep_night`，`fallbackType=null`，旧日程不再额外叠乘。
- 空白 profile 下旧 `routineAnchors` 命中 `morning_hygiene/breakfast`，`fallbackType=routineAnchor`。
- 临时清空旧 `routineAnchors` 后，旧 `scheduleWindows` 可转为 `schedule_night_rest`，`fallbackType=scheduleWindow`，并标记 `isCompletable=false`，不参与活动完成结算。

## 2026-06-21 置顶补充：基础作息 PRD

本节定义“AI 日常作息层”的严格口径。它是框架型优化，不为宝玉、黛玉等单个人物写死剧本；人物差异来自通用性格、人物专属性格、身份任务、关系和需求系数。该层只影响 AI 自主行为的候选权重、解释日志和模拟评估，不限制玩家手动操作。

### 目标

- AI 在无人干预下形成可读的一日循环：早餐、晨起梳洗、上午做事或读书或社交、午餐、下午活动、晚餐、晚上社交或独处、夜间睡觉。
- 六项基础需求都进入作息层：饥饿、精力、洁净、意趣、交游、心绪。
- 作息是柔性锚点，不是硬脚本：需求告急、任务截止、身份差事和玩家队列仍可抢占。
- 人物习惯可以偏移作息，如夜猫子晚睡晚起、嗜睡睡更久、爱洁更重视晨起梳洗、孤僻降低社交锚点但不取消交游需求。
- 后续模拟报告必须能看出“某行为是哪个作息锚点推高的”。

### 日作息锚点

| 锚点 | 默认时间 | 覆盖需求 | 推荐行为 | 完成口径 | 未完成时 AI 加权 | 完成后抑制 |
|---|---:|---|---|---|---|---|
| `morning_hygiene` 晨起梳洗 | 05:30-09:00 | 洁净、心绪 | 梳洗、沐浴、更衣、侍奉梳洗 | 使用 `bath/wash/wardrobe` 类家具或等价动作 1 次 | 洁净类 x2.1，爱洁再放大；睡眠/争执压低 | 同窗口内洁净类降到 0.35，避免反复洗 |
| `breakfast` 早餐 | 07:00-09:30 | 饥饿、心绪 | 正餐、厨房、饭桌；点心只作兜底 | 使用 `meal/kitchen/table/snack` 中任一进食动作 1 次，正餐优先 | 进食类 x2.5；若饥饿低于 55% 继续放大 | 同窗口内点心强抑制，正餐低抑制 |
| `morning_focus` 上午作息 | 09:00-11:30 | 意趣、交游、心绪 | 读书、写字、任务、请安、低强度社交 | 使用 `desk/instrument/garden`、任务或互动 1 次 | 读书/任务/论道/温和社交 x1.4 | 已完成后回归 Utility |
| `lunch` 午餐 | 11:00-13:30 | 饥饿、交游、心绪 | 饭桌、厨房、正餐，可与同场社交共存 | 进食动作 1 次 | 进食类 x2.7，饭桌/正餐优先 | 点心和连续进食压低 |
| `afternoon_life` 下午作息 | 13:00-17:00 | 意趣、交游、心绪、精力 | 串门、园中走动、读书、做任务、短休 | 互动、读书/园景/任务/休息任一 1 次 | 社交/户外/读书/任务 x1.35，低精力时休息放大 | 已完成后回归 Utility |
| `dinner` 晚餐 | 17:00-19:30 | 饥饿、交游、心绪 | 饭桌、厨房、正餐 | 进食动作 1 次 | 进食类 x2.4，饭桌/正餐优先 | 点心和连续进食压低 |
| `evening_social` 晚间作息 | 19:00-21:30 | 交游、意趣、心绪 | 夜话、安慰、品茗、独处读书 | 互动或安静类家具 1 次 | 社交/慰藉/叙旧 x1.35；孤僻可转向独处 | 已完成后回归 Utility |
| `night_sleep` 夜间睡眠 | 21:30-05:30 | 精力、心绪 | 上床睡觉、休息 | 使用 `bed/rest/travel_rest`；精力恢复到起床阈值 | 睡眠/床 x4.5，夜深继续放大 | 精力足够或过 08:00 自动起床 |

### 基础需求规则

- 饥饿：每天目标 3 次正餐。正餐窗口未完成时，进食类候选强加权；完成后同窗口内压低点心，避免全天吃点心。
- 精力：夜间睡眠是唯一强锚点；白天低精力可短休，但不能替代夜间睡眠。夜猫子只把夜间睡眠窗口后移，不取消睡觉。
- 洁净：默认每天晨起至少 1 次梳洗；爱洁更早、更高权重，邋遢可降低但不完全跳过。
- 意趣：上午/下午/晚上各有轻锚点，由读书、园景、乐器、闲谈、任务等满足，不要求固定动作。
- 交游：下午和晚上是自然社交窗口；孤僻、清高可把部分社交权重转向独处/读书，但低交游仍会触发核心需求。
- 心绪：不设单独“补心情”硬动作，而由梳洗、进食、睡眠、安慰、独处、读书、园景等行为共同维持。

### 人物习惯偏移

| 习惯/性格 | 作息影响 |
|---|---|
| 夜猫子 `nightOwl` | 睡眠窗口整体后移 90 分钟，夜间社交/读书窗口延长；早餐和晨起梳洗允许迟到但仍需完成。 |
| 嗜睡 `shishui` | 睡眠/休息权重提高，起床阈值更高，白天短休更容易出现。 |
| 懈怠/慵懒 `xiedai/lazy` | 上午做事权重降低，休息/坐卧权重提高，但三餐和洁净仍保底。 |
| 守时 `shoushi` | 锚点提前 20-30 分钟开始加权。 |
| 拖延 `tuoyan` | 锚点前半段加权较弱，窗口临近结束再提高。 |
| 爱洁 `aijie/qingjie` | 晨起梳洗和低洁净修复权重提高，洁净低时心绪更受影响。 |
| 邋遢 `lata` | 洁净锚点权重降低，只有洁净较低时才强推。 |
| 贪嘴/少食 `tanzui/shaochi` | 影响食物类型和饱足阈值，不改变三餐锚点数量。 |
| 热络/孤僻 `reluo/gupi` | 热络更常完成社交锚点，孤僻可用独处读书等满足晚间心绪，但交游低时仍会找人。 |
| 喜静/好动 `xijing/haodong` | 喜静偏室内读书/独处，好动偏园中走动。 |

### 验收标准

- 连续 3 日模拟，非玩家控制人物不饿死，资金不因吃饭异常耗尽。
- 每个主要人物在完整自然日内：早餐、午餐、晚餐各至少 1 次或有明确失败原因；夜间至少 1 段睡眠；晨起洁净至少 1 次或洁净值始终高于 75%。
- 一天内点心类不应成为正餐主来源；同一餐窗反复点心不超过 2 次。
- 宝玉、黛玉只是样例验证对象，不能为他们写死专属关系或专属日程。
- AI 调试和报告中能展示 `routineAnchor`、`routineFactor`、完成/未完成状态。

## 2026-06-21 置顶补充：AI 行为质量下一阶段

当前 3D 表现层已经验证：现有 AI / 任务 / 关系 / 需求系统可以被外部表现层直接消费，因此下一阶段人物 AI 的重点不在“换画面”，而在提升日常行为质量，让 NPC 的选择更像有生活惯性、关系牵引和短期目标的人。

### 2026-06-21 补充：主动社交目标选择修正

三日模拟中暴露出一类框架问题：AI 容易被“最近的可互动目标”锁住，即使该目标不是最高关系对象。该问题不应通过写死具体人物关系解决，而应在通用社交候选层修正。

本轮原则：

- 区分主动互动与被动互动：只有 AI 主动发起互动才进入 AI 目标频控；被别人互动不惩罚目标方。
- 区分 AI 与玩家：AI 频控只影响 AI 候选生成和权重；玩家操作不因 AI 冷却被隐藏或禁止。
- 综合关系优先：高综合关系目标应更容易成为主动互动、跨房间寻人的候选。
- 性格轻修饰：类似 `female_charm` 只给“女性社交大类”轻量加成，不能压过关系锚点。
- 跨房间找人频控：非玩家控制角色主动跨房间找同一目标后，该目标进入一段 AI-only 冷却，避免反复追同一个最近目标。
- 每日主动社交上限：同一个 AI 对同一个目标每日主动发起互动不超过 10 次；达到上限后只影响 AI 候选，不影响玩家手动互动。

### 核心目标

- 减少重复行为：压低连续使用同类家具、反复回同一场景、短时间重复找同一目标等“机器味”。
- 提升行为可解释性：每次关键 AI 选择都能回答“为什么现在做这个，而不是别的”。
- 增强生活节奏：一日内形成更自然的吃饭、休息、梳洗、社交、任务、闲逛节律。
- 强化社会动机：关系、身份、近期互动和情绪应成为行动选择的重要牵引，而不是只靠需求数值。
- 保持系统可调：新增逻辑必须继续进入行为埋点和模拟报告，方便长模拟调参。

### 优先需求

| 优先级 | 需求 | 说明 | 验收方式 |
|---|---|---|---|
| P0 | 行为去重与冷却 | 对家具类别、目标人物、目标场景、归巢行为建立更统一的近期冷却和效用衰减。 | 3 日模拟中同一人物同类重复 Top 项明显下降。 |
| P0 | 候选解释面板/日志 | AI 决策保留 Top 候选、最终选择、主要加权因子、拒绝原因。 | 单个人物一天行为可回放，可定位“为什么不社交/为什么卡任务”。 |
| P1 | 日程节律层 | 在 Utility AI 前增加轻量日程/意图窗口，如晨起、午食、黄昏社交、夜间休息。 | 同一日内行为分布更接近生活节奏，不再全天均匀随机。 |
| P1 | 关系驱动候选 | 把“想见谁 / 避开谁 / 照顾谁 / 找谁争执”作为社交候选来源。 | 高关系人物更常自然靠近，低关系人物更少无意义亲近。 |
| P1 | 任务与生活仲裁 | 任务、需求、社交、睡眠之间使用明确抢占规则，避免短任务被普通行为拖死。 | 服侍、传话、晨昏定省等短任务超时率下降。 |
| P2 | 人物个性日常模板 | 每类性格/身份可以有偏好的生活流：读书、饮茶、管事、串门、独处等。 | 不同人物一天行为统计能看出差异。 |

### 设计原则

1. Utility AI 继续作为动作选择底盘，不重写为硬剧本。
2. 新增 Intent / 日程层只负责“缩小候选空间、调整权重”，不直接写死动作。
3. 所有候选必须带 `provider`、`key`、`reason/scoreHints`，并能被 `BehaviorTelemetry` 记录。
4. 行为质量问题优先通过长模拟报告发现，再回到权重、冷却和候选来源调整。
5. 表现层只消费结果，不反向污染 AI 内核。

## 2026-06-17 补充：Utility AI 可解释化

当前人物 AI 明确采用 **Utility AI 作为日常行为底盘**：

- 日常自由行为：继续由候选动作评分、Top-N 加权随机决定。
- 任务/差事流程：后续逐步接 HTN/轻量行为树，不直接塞进日常权重汤。
- 场景权限、身份、礼法：作为世界规则和候选校验，不成为 AI 主脑。
- LLM：只用于对白/旁白/总结，不参与底层行动选择。

本轮补齐了 Utility AI 的调试边界：

| 项 | 说明 |
|----|------|
| 候选来源 provider | `furniture / social / wander / homeward / economy / coreNeed / quest / drama` |
| provider 诊断 | 记录 checked / accepted / rejected，便于判断“为什么没有社交候选” |
| 评分拆解 | 每个候选挂 `scoreFactors`，记录各乘法因子 |
| 评分提示 | 每个候选挂 `scoreHints`，只列最影响结果的 4 个因子 |
| 拒绝闭环 | `ai:candidate_rejected` 和 `queue:failed` 进入 telemetry |
| 失败冷却 | 队列失败后冷却候选；场景失败即使没有 candidateKey 也会进入场景冷却 |

后续 Utility AI 优先做三件事：

1. 增加轻量 `intent` 层：先选意图，再由 Utility AI 选动作。
2. 做 AI 调试面板：显示当前意图、Top 候选、评分因子、拒绝原因。
3. 把任务链条接入 HTN Planner：任务负责分解步骤，Utility 负责动作细选。

## 2026-06-17 补充：Candidate Provider 接口

候选来源已抽出第一版注册接口：

```js
AiCandidateProviderSystem.register({
  id: 'quest',
  order: 70,
  provide(character, context, out) {
    // push candidate rows into out
  },
});
```

当前 `buildCandidatePool()` 不再直接关心“哪个系统产出候选”，而是：

1. 构建 `context`：可达场景、附近家具/人物、诊断对象。
2. 调用 `AiCandidateProviderSystem.collect(c, context)`。
3. 对收集到的候选统一裁剪、评分、缓存。

已接入的 provider：

| provider | 职责 |
|---|---|
| `furniture` | 附近家具动作。 |
| `social` | 附近人物互动。 |
| `wander` | 随机漫步。 |
| `homeward` | 归巢/居家/逛园。 |
| `economy` | 上班、回家等经济行为。 |
| `coreNeed` | 交游、心绪等核心需求行为。 |
| `quest` | 任务专用候选。 |
| `drama` | 戏剧意图追人。 |

这一步的意义是：后续 Intent 层只需要把 `context.intent` 注入 provider 上下文，不必再改 Utility AI 核心。

## 一、现有架构（效用机 utility AI）

### 引擎类型
多因子**乘法效用机** + 双通道时钟调度 + 紧急需求抢占。所有决策来自"候选 × 权重 → 加权选择"，无显式状态机剧本（除观察反应/故事线）。

### 状态机（`AI_STATE`）
`IDLE` 待机 · `EXECUTING` 执行 · `SLEEPING` 睡眠 · `URGENT` 紧急 · `PAUSED` 玩家操控 · `COOLDOWN` 冷却。

### 双通道（`onAITimeAdvanced`，按游戏分钟推进）
| 通道 | 频率 | 职责 |
|------|------|------|
| `fastChannelTick` | 每游戏分钟 | 仅在 EXECUTING：重算**缓存候选**权重；Top 候选 > 当前×`weightReplaceThresholdFast`(1.3) 则切换 |
| `slowChannelTick` | 每 15 游戏分钟 | 重建完整候选池、跑观察反应、场景邀约；`selectFromPool` 加权随机；空闲或 > 当前×1.2 则切换 |
| 紧急 `onNeedCrisis` | 需求 ≤10% 即时 | 进 URGENT，直奔最近可恢复该需求的家具，失败重试 |

### 效用公式（`finalizeCandidate`）
```
finalWeight = baseWeight
            × demandFactor    // 需求紧迫度 × demandBaseWeights，仅对相关需求
            × traitFactor     // 性格 → 标签 boost/cut（TRAIT_MODS / 专长表）
            × statusFactor    // 当前状态 → 标签（STATE_AI_MODS + stateDefs.aiModifiers）
            × timeFactor      // 时段 → 标签（getTimeSlotMods）
            × memoryFactor    // 近 5 条记忆 tag → 标签
            × specialtyFactor // 专长系统
            × distanceFactor  // 1/(1+距离×decay)
            × randomFactor    // 0.8~1.2 扰动
            × questBoost      // 任务加权
            × dramaFactor     // 【新增】关系/情绪/意图驱动，见下
            × crowdFactor     // 场景拥挤惩罚
            × furnitureOccupancyFactor // 家具占用惩罚
            × homewardFactor  // 归家/本场景偏好
            × needDriveFactor // 交游/心绪等核心需求牵引
            × satiationFactor // 需求已满足时压低继续使用家具
            × failedActionFactor // 失败候选短期冷却
            × scheduleFactor  // 当前固定为 1，仅保留旧日程兜底诊断
            × routineFactor   // 新起居/旧基础作息/旧日程兜底统一加权
```

### 候选类型（`buildCandidatePool`）
- `furniture`：附近可用家具（tags 来自 `FURN_AI_TAGS`）
- `interaction`：附近角色 × 可用互动模板
- `wander`：随机游走
- `seek`【新增】：朝意图目标移动（跨距离追人）
- 扩展 provider：`AiHomeward`、`EconomySystem`、`CoreNeedSystem`、`QuestSystem`、`AiDrama`

---

## 二、戏剧化层（`js/systems/ai-drama.js`）

### 设计目标
在**不改动核心引擎**的前提下，新增两类乘法因子，让社交行为由关系与情绪驱动，并涌现剧情。全部以 `dramaFactor = socialFactor × intentFactor` 注入效用公式，缺省返回 1，向后兼容。

### 1. 情绪标量 `mood(c)` ∈ [-1, 1]
由四维需求均值（0~100 映射）+ 情绪类状态价值（elated/joyful/heartFlutter… 为正，melancholy/angry/baonu/offended/ganshang/brokenBond/awkward… 为负）合成并钳制。

### 2. 社交因子 `socialFactor(c, cand)`（仅互动候选）
按**关系四轴 × 互动类别**给牵引力：

| 类别 | 牵引逻辑 |
|------|----------|
| 传情 chuanqing | 随好感升高急剧放大（求偶向心力）；负好感趋近 0 |
| 慰藉 weijie | **对象情绪越低 + 自己越在乎（好感/友谊）** → 越想去安慰 |
| 调笑 tiaoxiao | 需正向好感/友谊；双方心情好时再加成 |
| 叙旧 xujiu | 综合分驱动，温和 |
| 论道 lundao | 信任驱动 |
| 争执 zhengchi | **对象关系越差越想吵**；自己心情差或 `kebo`(刻薄)性格再放大；对长辈/家人除非盛怒则压制 |

### 2.1 关系不解锁互动，只影响“互动意愿”

互动菜单的单个选项不再因关系高低而硬解锁/硬隐藏。关系数值只计算 **A 对 B 发起该互动的意愿强度**：

```js
interactionWillingness(A, B, tpl)
  = categorySocialFactor(A, B, tpl.category)
  × relationConditionFactor(A, B, tpl)
```

其中：

```js
relationConditionFactor = Π thresholdFactor(axisValue, min, max)

thresholdFactor(value, min, null) = clamp(1 + (value - min) / 50, 0.15, 1.8)
thresholdFactor(value, null, max) = clamp(1 + (max - value) / 50, 0.15, 1.8)
```

解释：
- `value == min` 时，该条件贡献 `1.0`，表示“刚好合适”。
- 比要求低 50 点时，压到 `0.15`，表示极低意愿，但仍可尝试。
- 比要求高 40 点左右时，接近上限 `1.8`，表示很愿意。
- 多个条件相乘，表示“初吻”这类互动需要好感、信任、友谊都接近合适才会自然。

`categorySocialFactor` 沿用当前 `ai-drama` 里的类别牵引：

| 类别 | 当前公式语义 |
|------|-------------|
| 传情 `chuanqing` | `clamp(0.15 + affection / 50, 0.05, 3.0)`，好感越高越强，负好感几乎不愿意 |
| 慰藉 `weijie` | `clamp(((affection + friendship) / 120) × targetMoodNeed + 0.3, 0.2, 3.0)`，在乎对方且对方低落时更愿意安慰 |
| 调笑 `tiaoxiao` | `clamp(0.3 + (affection + friendship) / 120, 0.2, 2.0)`，双方心情好时再加成 |
| 叙旧 `xujiu` | `clamp(0.5 + score / 120, 0.3, 1.8)`，综合关系越好越自然 |
| 论道 `lundao` | `clamp(0.4 + trust / 100, 0.3, 1.8)`，信任越高越愿意深谈 |
| 争执 `zhengchi` | `clamp(0.15 + max(-score / 60, 0) + aggressive, 0.05, 3.0)`，关系差、心情差、刻薄时更容易争执 |

菜单展示：
- 所有通过硬规则的互动都显示。
- 用颜色深浅表示意愿：`strength = clamp(interactionWillingness / 3, 0, 1)`。
- 文案显示为“意愿高 / 中 / 低 / 冷”。
- 关系不足不禁用，点击后可能进入“被拒绝 / 尴尬 / 难过”等结果链。

仍然会硬拦的内容：
- 无效对象、不能说话、技能不足、冷却、一次性互动已用。
- 礼法/身份强禁忌、性别年龄硬约束、家具/场景硬条件。
- 这些是世界规则，不是关系意愿。

暂不接入：
- 第四象限（服从/体恤/孝道/慈爱）暂不进入通用 `ai-drama`。
- “离心父子 / 莫逆之交 / 心腹忠仆”等展示标签暂不影响行为，避免策划改名导致 AI 逻辑漂移。
- 后续家庭互动、主仆互动单独开互动类别和候选 Provider。

### 3. 意图层 `intent`（戏剧引擎）
每个 NPC 可持有一个短时意图 `c.ai.intent = { type, targetId, tag, until }`（默认 90 游戏分钟过期）。`intentFactor` 让匹配意图的候选大幅加权、无关社交略降；`sulk` 赌气则压制社交、抬升独处。

意图由事件涌现：

| 事件 | 触发意图 |
|------|----------|
| 好感跨过 60↑（恋人/朋友，且 `duoqing`/`fengliu`） | `court` 求爱 → 寻对方传情 |
| 争执完成，败方 | `kebo` → `confront` 反击；否则 `sulk` 赌气独处 |
| 传情完成，**第三方**对被传情者好感≥55 | 嫉妒：`kebo`→`confront` 对发起者；否则 `sulk` |
| （达成后）匹配意图的互动完成 | 清除意图 |

### 3.1 调研：模拟人生式“动作链条”如何产生

参考《模拟人生》系列的公开资料，它不是把“试探 → 初吻 → 被拒绝 → 尴尬 → 大哭”写成一条固定剧本，而是更像：

1. 人物有持续变量：需求、情绪、关系、性格、技能、年龄/身份等。
2. 物体和人物互动提供可选动作，动作有条件、吸引力、风险、收益。
3. 自动行为系统会按当前变量选择动作；玩家也可强制排队。
4. 动作执行后产生结果：成功/失败、关系变化、buff/moodlet/状态、记忆。
5. 新状态会改变后续动作权重，于是下一轮 Utility/Autonomy 选出“哭”“躲”“发火”“找人安慰”等动作。

因此链条不是手写死流程，而是由 **动作结果 → 状态/关系变化 → 新一轮候选权重变化** 生产出来。

落到本项目，建议拆成三层：

| 层 | 职责 | 示例 |
|----|------|------|
| 动作层 Action | 玩家/NPC 发起一个具体互动 | 试探、初吻、斥责、安慰 |
| 结果层 Outcome | 根据关系意愿、风险、礼法、性格判定结果 | 接受、拒绝、逾矩败露、话不投机 |
| 状态层 State | 给双方加状态并改变关系/记忆 | 尴尬、难过、心动、恼怒、犯痴 |

再由 Utility AI 读取状态：

```js
被拒绝 -> initiator: awkward/sad + relation trust/affection down
awkward/sad -> comfort/solitude/cry/flee 权重升高
target offended -> zhengchi/refuse/avoid 权重升高
```

短期内意图层先不改。先把“互动结果会产生状态，状态再影响下一步候选”这条闭环做稳定。

### 4. 跨距离追人 `seek`
意图有目标且目标较远时，`extraCandidates` 生成一个朝目标走的 `seek` 候选（绕过距离裁剪），让 NPC**主动走向想见/想吵的人**，到场后社交因子接管 → 涌现追求、对峙、安慰等桥段。

---

## 三、接线点
- `ai.js · finalizeCandidate`：末尾乘 `dramaFactor`
- `ai.js · buildCandidatePool`：并入 `AiDrama.extraCandidates`
- `ai.js · finalizeCandidate / candToQueueItem`：新增 `seek` 类型处理
- `ai.js · initAISystem`：调用 `AiDrama.init()` 注册事件监听
- `index.html`：在 `ai.js` 后引入 `js/systems/ai-drama.js`

## 四、调参入口
`AiDrama.cfg`（模块内）：意图时长、各类别牵引系数、嫉妒好感阈值、seek 触发距离。后续可外移到 `config.js` 的 `aiConfig.drama`。

## 五、后续可扩展（未做）
- 日程/作息表（按身份的 routine）替代纯时段因子
- 多步规划（先洗漱再赴宴）
- 群体情绪场（宴席气氛传染已有 emotionContagion，可接入 mood）
- 意图外移到配置、可视化调试面板
