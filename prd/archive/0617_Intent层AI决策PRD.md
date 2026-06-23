# Intent 层 AI 决策 PRD

更新时间：2026-06-17

## 0. 2026-06-17 评审修订：Intent 不是窗口期，而是人格驱动层

上一版 Intent 容易被理解成“Utility AI 上面加一个稳定窗口”。这个定义太浅，只能解决 NPC 行动频繁跳变，不能解决“黛玉为什么像黛玉、湘云为什么像湘云、探春为什么像探春”。

本版重新定义：

> **Utility AI 负责在当前候选动作里选最合适的一件事；Intent 层负责决定这个人此刻把注意力投向哪一种生活动机。**

也就是说，Intent 不是单纯的短时锁定，而是把基础需求、身份职责、脾性、社交风格、生活习性、爱好和人生追求合成一个“人格化动机”。

### 0.1 与现有 Utility 的边界

| 层级 | 负责的问题 | 例子 |
|---|---|---|
| 基础需求 | 身体/心理缺什么 | 饿了、倦了、洁净低、交游低、心绪低 |
| 人格驱动 Intent | 这个人会如何解释和处理这些压力 | 黛玉心绪低时更可能独处写诗/找紫鹃倾诉；湘云更可能找人玩笑吃酒 |
| Candidate Provider | 当前意图下有什么可做 | 找人、去书案、用饭桌、执行任务、离开禁入场景 |
| Utility Scoring | 在这些候选里哪一个最划算 | 最近的家具、关系最合适的人、耗时最少的路径 |
| HTN/Task Planner | 多步动作怎么展开 | 找到主子 → 走近 → 服侍 → 复命 |

所以 Intent 层应该产出的是“人格化动机”，不是“泛用分类”：

```js
{
  id: 'emotion:poetic_solitude',
  label: '借诗排遣',
  category: 'emotion',
  source: 'temperament',
  reason: '心绪低；敏感+多愁；偏好安静；附近有书案',
  tags: ['emotion', 'solitude', 'poetry', 'desk'],
  targetId: null,
  priority: 76,
  durationMin: 90,
  lockLevel: 'soft',
}
```

而不是只产出：

```js
{ id: 'emotion:comfort_self', label: '自我排解' }
```

### 0.2 脾性 + 社交 + 习性是否兼容现有 Utility

兼容，而且现在已经部分接入：

- `TraitEffectSystem.modifyActionWeight()`：对动作标签做微观权重修正。
- `modifyNeedCoeffs / needAttentionMultiplier()`：影响需求衰退、恢复和关注阈值。
- `stateApplyProbability / modifyStateDuration / stateRecoveryMultiplier()`：影响状态触发、持续、恢复。
- `modifyRelationDelta()`：影响关系变化。
- `questWeightMultiplier / questAcceptanceChance / questEarlyPrepareMinutes()`：影响任务接受、守时和紧迫度。
- `socialJoinMultiplier / crowdPenaltyMultiplier / invitationAcceptanceChance()`：影响群聊、人群、邀约。

但这些目前多是 **Utility 微调项**，回答的是：

> “同样一组候选动作里，这个人更偏哪一个？”

Intent 层要回答的是：

> “同样遇到饥饿、心绪低、有人邀约、任务临近，这个人会把它理解成什么人生处境，并先处理哪一种？”

因此不是把现有 `TraitEffectSystem` 推翻，而是给它增加一组宏观字段，让同一套性格配置既能影响动作权重，也能影响意图生成。

### 0.3 三类性格进入 Intent 的分工

| 类型 | 在 Utility 中的作用 | 在 Intent 中的作用 |
|---|---|---|
| 脾性 | 修正情绪、冲突、独处、安慰等动作权重 | 决定压力来临时的第一反应：忍、哭、怒、躲、说开、赌气、求慰藉 |
| 社交 | 修正主动社交、群聊、邀约、关系变化 | 决定人际策略：亲近、回避、维持体面、试探、直言、竞争、服从 |
| 习性 | 修正吃饭、睡觉、洁净、漫游、守时等行为 | 决定默认生活节奏：爱收拾、爱睡、爱吃、坐不住、守时、拖延 |
| 爱好 | 修正具体家具/活动偏好 | 决定空闲和排解时优先把时间投到什么事：诗、琴、棋、书、花木、针线、饮宴 |
| 人生追求 | 修正相关任务/剧情权重 | 提供长期方向：管家、求仕、修身、争宠、守护某人、求自由、求名声 |

### 0.4 推荐数据模型：同一性格同时有微观效果和意图效果

现有 `traitMetadata.effects` 可以拓展：

```js
mingan: {
  label: '敏感',
  category: '脾性',
  effects: {
    actionWeights: {
      comfort: 1.2,
      solitude: 1.15,
    },
    relation: {
      positiveMultiplier: 1.25,
      negativeMultiplier: 1.6,
    },
    intent: {
      base: {
        'emotion:seek_comfort': 1.25,
        'emotion:sulk': 1.15,
        'social:avoid_risk': 1.15,
      },
      triggers: {
        onNegativeRelationDelta: {
          add: ['emotion:sulk', 'emotion:seek_comfort'],
          pressureMultiplier: 1.5,
        },
      },
      targetBias: {
        trusted: 1.35,
        hostile: 0.55,
        crowd: 0.75,
      },
      stabilityMultiplier: 1.2,
    },
  },
}
```

解释：

- `actionWeights` 仍给 Utility 使用。
- `intent.base` 给 Intent Candidate 加权。
- `intent.triggers` 把事件转成意图压力。
- `targetBias` 决定同一个意图找谁、避谁、亲近谁。
- `stabilityMultiplier` 让某些人更容易纠结、坚持、拖延或快速转换。

### 0.5 人物差异如何涌现

同样是“心绪低 + 下午无任务 + 周围有人”：

| 人物/配置 | Intent 倾向 | 下层候选 |
|---|---|---|
| 黛玉：敏感、多愁、孤僻、喜静、少食 | 借诗排遣 / 找可信对象倾诉 / 避开热闹 | 书案、窗边、紫鹃、潇湘馆内安静家具 |
| 湘云：乐天、豪爽、热络、好胜、贪嘴 | 找人热闹 / 饮宴玩笑 / 比试说笑 | 饭桌、群聊、园中漫步、论道 |
| 探春：温和、耿直、好胜、守时、好动 | 整理事务 / 主动管事 / 赴约守时 | 任务、下发安排、巡视、找仆从 |
| 宝钗：温和、圆滑、多疑、守时、喜静 | 维持体面 / 按时行事 / 安抚关系 | 请安、读书、社交维护、避免冲突 |

这就是 Intent 层的价值：同一套需求压力，不同人格先生成不同生活动机，再让 Utility 去找具体动作。

## 1. 背景

当前 NPC 日常 AI 已经以 Utility AI 为底盘：

- 候选动作由家具、社交、漫步、任务、经济、核心需求、戏剧等系统提供。
- Utility AI 对候选做多因子乘法评分，再从 Top 候选中加权随机选择。
- 任务系统已能提供部分任务候选，但任务链条仍主要依赖权重牵引。

问题是：Utility AI 很适合“在一堆可做动作里选哪个更划算”，但不擅长回答更高层的问题：

- 这个人此刻到底是在“当差”，还是“找人”，还是“照顾自己”？
- 饥饿、心绪、任务、身份礼法、作息冲突时，哪个先管？
- 角色为什么连续切换目标，看起来没有主心骨？
- 后续 DLC 里的礼佛、请安、赴宴、看病、女红、管家、祭祀等多步生活链，应该由谁组织？

因此需要新增 **Intent 层**，放在 Utility AI 之上、HTN Planner 之前。它不是把动作锁住一段时间，而是把角色的“人格、关系、身份和追求”转成可解释的当前动机。

## 2. 目标

Intent 层负责选择“当前意图”，即角色接下来一段时间的行为方向。这个方向必须带有人格来源：是需求逼迫、身份职责、脾性反应、社交策略、习性惯性、爱好吸引，还是人生追求牵引。

它不直接生成最终行动，而是约束和引导下层系统：

```text
Needs / Schedule / Task / Emotion / Relationship / Identity
Traits / Hobbies / Life Pursuit
        ↓
Intent Selector
        ↓
Candidate Provider / HTN Planner
        ↓
Utility Scoring
        ↓
Action Queue
```

核心目标：

- 让 NPC 行为从“动作级随机”提升为“意图级稳定”。
- 让角色差异不只体现在权重小数上，而体现在“先想做什么、为什么这么想”。
- 让 Utility AI 只在当前意图范围里做细选。
- 给 HTN 留出入口：复杂意图可展开为多步计划。
- 给调试面板一个清楚答案：此人现在为什么这么做。

## 3. 非目标

本阶段不做：

- 不重写 Utility AI。
- 不把所有性格/状态做硬编码特殊规则。
- 不做完整 GOAP 搜索。
- 不让 LLM 参与底层行动选择。
- 不要求所有任务立刻 HTN 化。
- 不把某个角色写成大量硬编码特例。黛玉、湘云、宝钗等差异应主要由配置组合涌现，少量名场面可走剧情/人生追求节点。

## 4. 核心概念

### 4.1 Intent

Intent 是角色短时间内的行动方向。

建议结构：

```js
{
  id: 'serve_task',
  label: '当差',
  category: 'task',
  priority: 80,
  targetId: 'daiyu',
  questInstanceId: 123,
  reason: '已接受任务：服侍更衣',
  tags: ['task', 'serve', 'follow'],
  startedAt: 12345,
  until: 12435,
  lockLevel: 'soft',
  planner: 'htn',
}
```

字段说明：

| 字段 | 说明 |
|---|---|
| `id` | 意图类型。 |
| `label` | 调试面板显示名。 |
| `category` | 大类：need/task/social/schedule/emotion/safety/idle/hobby/pursuit。 |
| `priority` | 意图优先级，先用于仲裁，不等同于动作权重。 |
| `targetId` | 人物目标，可为空。 |
| `questInstanceId` | 任务目标，可为空。 |
| `reason` | 可解释原因。 |
| `tags` | 下层 Provider / Utility 可用标签。 |
| `startedAt / until` | 意图稳定窗口。 |
| `lockLevel` | 抢占强度：none/soft/hard。 |
| `planner` | 下层执行方式：utility/htn/direct。 |
| `source` | 来源：need/temperament/socialStyle/habit/hobby/lifePath/role/event。 |
| `personalityTrace` | 参与本次意图加权的性格、爱好、人生追求。 |

### 4.2 Intent Candidate

Intent Candidate 是“可能的意图”，由多个系统提供。

例子：

- `need:hunger`：饥饿过低，寻找食物。
- `task:serve`：已接任务，去服侍主子。
- `schedule:sleep`：夜深，应就寝。
- `social:seek_company`：交游低，主动找人说话。
- `emotion:comfort`：心绪低，找人倾诉或独处排解。
- `hobby:practice_qin`：爱好琴艺，空闲时主动练习。
- `pursuit:stewardship`：人生追求偏管事，主动巡视/安排事务。
- `identity:avoid_intrusion`：不该久留某处，离开受限场景。

## 5. 第一版 Intent 类型

第一版不要只按系统模块分成 `need/task/social`。那会重新滑回 Utility 的分类。建议按“动机来源”分层，每层都可以产出 Intent Candidate，再由选择器仲裁。

### 5.1 生理需求 `need:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `need:eat` | 饥低于阈值 | 找饭桌、点心、厨房。 |
| `need:sleep` | 倦低于阈值或夜深 | 找床、榻、座椅休息。 |
| `need:clean` | 洁低于阈值 | 找浴盆、梳洗、衣柜。 |
| `need:relax` | 闷低于阈值 | 读书、抚琴、游园、社交。 |

特点：

- 低于危机阈值时 `hard` 抢占。
- 普通低值时 `soft`，可被高优先任务压过。
- 性格只改变“多早注意到”和“怎么满足”：贪嘴更早觅食，少食更容易拒绝继续吃，爱洁更早梳洗，邋遢更能忍。

### 5.2 任务 `task:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `task:execute` | 有已接受任务 | 交给 HTN 或任务 Provider。 |
| `task:report` | 任务需复命 | 找下发者互动。 |
| `task:prepare` | 日程任务快到点 | 提前去地点或目标身边。 |

特点：

- 截止越近 priority 越高。
- 日常职责不一定 hard；主子直接差遣可更高。
- 任务 Intent 应阻止普通闲逛频繁抢占。

### 5.3 作息 `schedule:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `schedule:wake` | 清晨 | 起身、梳洗、请安。 |
| `schedule:meal` | 三餐窗口 | 用餐或备膳。 |
| `schedule:sleep` | 夜深 | 就寝、伺候就寝。 |
| `schedule:work` | 当值时辰 | 去工作场景。 |

特点：

- 作息是古代生活 DLC 的主入口。
- 作息 Intent 不等于强制行动，应允许人物因事件偏离。

### 5.4 社交 `social:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `social:seek_company` | 交游低 | 找亲近或同场人聊天。 |
| `social:maintain_relation` | 关系需维护 | 寒暄、问安、陪伴。 |
| `social:avoid` | 关系差或礼法风险 | 避开某人或离场。 |

特点：

- 社交 Intent 只决定“找人/避人/维持关系”，不决定具体互动模板。
- 具体互动仍由 Utility 和关系/礼法系统选。

### 5.5 情绪 `emotion:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `emotion:comfort_self` | 心绪低 | 独坐、读书、抚琴、回房。 |
| `emotion:seek_comfort` | 心绪低且信任对象可达 | 找人倾诉/安慰。 |
| `emotion:confront` | 被冒犯/争执后 | 找目标争执或质问。 |
| `emotion:sulk` | 赌气 | 独处、避人、降低社交。 |

特点：

- 现有 `AiDrama.intent` 可迁移为 emotion/social Intent 的一部分。
- 情绪 Intent 应有过期时间，避免永久卡住。
- 情绪 Intent 必须读取脾性。否则“心绪低”只会变成泛用找安慰，缺少人物差异。

脾性映射建议：

| 脾性 | 更容易生成的 Intent | 表现 |
|---|---|---|
| 乐天 | `emotion:shake_off` / `social:seek_lively` | 去热闹处、找人说笑，负面意图短。 |
| 悲观 | `emotion:worry` / `emotion:seek_safety` | 预想坏结果，回避风险。 |
| 急躁 | `emotion:confront` / `task:finish_quickly` | 不耐等待，容易质问或打断。 |
| 温和 | `emotion:mediate` / `social:comfort_other` | 先缓和关系，少冲突。 |
| 敏感 | `emotion:sulk` / `emotion:seek_comfort` | 对关系波动反应强，偏找可信对象。 |
| 迟钝 | `idle:continue` / `emotion:ignore_slight` | 不容易被小事打断。 |
| 多愁 | `emotion:poetic_solitude` / `emotion:melancholy_dwell` | 独处、诗文、美景触发感伤。 |
| 豪爽 | `social:seek_lively` / `emotion:spend_to_cheer` | 用饮宴、赏人、玩笑排解。 |

### 5.6 安全/礼法 `safety:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `safety:leave_forbidden_scene` | 当前场景无权久留 | 离开。 |
| `safety:stop_when_blocked` | 酒醉、力竭、被锁定 | 停止移动，转休息/等待。 |
| `safety:respect_protocol` | 礼法风险过高 | 降低逾矩行为。 |

特点：

- 这类意图多为 hard 或强过滤。
- 不做成大量特例，而是把世界规则暴露给 Intent 选择。

### 5.7 空闲 `idle:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `idle:home` | 无强意图 | 居家闲步、附近家具。 |
| `idle:wander` | 闲适、外向 | 游园。 |
| `idle:observe` | 场景热闹 | 围观、旁听、反应。 |

### 5.8 爱好 `hobby:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `hobby:practice_art` | 空闲、心绪平稳或需要排解 | 琴、棋、诗、书、画等。 |
| `hobby:tend_flowers` | 爱好花木且场景可达 | 花圃、浇花、赏花。 |
| `hobby:study` | 求学/才艺/修身倾向 | 读书、论道、请教。 |
| `hobby:feast` | 饮宴/吃食偏好 | 饭桌、点心、厨房、邀请同伴。 |

特点：

- 爱好是“没被需求逼迫时仍愿意花时间做”的来源。
- 爱好也可以作为情绪排解方式。黛玉不是泛用“休闲”，而是“借诗/独坐/品茗排遣”。
- 家具多交互可以通过 `hobby` 标签提供更细候选。

### 5.9 人生追求 `pursuit:*`

| Intent | 触发 | 下层行为 |
|---|---|---|
| `pursuit:advance_path` | 人生路径有当前阶段目标 | 做阶段任务、找关键人物、积累声望。 |
| `pursuit:protect_person` | 追求绑定某人 | 跟随、安慰、照料、挡事。 |
| `pursuit:gain_status` | 求名/求权/求体面 | 管事、请安、展示能力、维持关系。 |
| `pursuit:seek_freedom` | 厌倦拘束或身份压迫 | 独处、出门、拒绝安排、寻找机会。 |

特点：

- 人生追求是长线剧情和 DLC 的入口。
- 它不应每分钟都压过基础需求，但应该长期改变“空闲时做什么、冲突时偏向哪边、任务怎么取舍”。
- 现有 `LifePathSystem` 可以先作为数据源，后续增加 `LifePursuitIntentProvider`。

### 5.10 人格组合生成“签名意图”

单个标签不要直接写死角色，但多个标签组合可以形成强特征：

| 条件组合 | 生成/加权意图 |
|---|---|
| `敏感 + 多愁 + 喜静` 且心绪低 | `emotion:poetic_solitude` |
| `热络 + 豪爽 + 贪嘴` 且交游低/饭点 | `social:feast_with_company` |
| `守时 + 好胜` 且任务临近 | `task:prepare_early` |
| `孤僻 + 多疑` 且人群密度高 | `social:avoid_crowd` |
| `爱洁` 且洁净高于 80 | `habit:maintain_cleanliness`，可触发洁净正面标签 |
| `拖延` 且任务未到紧急窗口 | `task:postpone`，不一定是不做，而是寻找低成本替代 |

这些组合应通过配置或 provider 规则表达，不写在主 AI 核心里。

## 6. Intent 仲裁

第一版使用规则评分，不做机器学习。

```js
intentScore = basePressure
            * personalityFit
            * habitFit
            * hobbyFit
            * pursuitFit
            * relationshipFit
            * contextFit
            * hysteresis
            + hardRuleBonus
```

字段含义：

| 因子 | 含义 |
|---|---|
| `basePressure` | 需求、任务、作息、事件本身的压力。 |
| `personalityFit` | 脾性/社交风格是否支持这个意图。 |
| `habitFit` | 习性是否支持这个生活节奏。 |
| `hobbyFit` | 爱好是否让该意图更自然。 |
| `pursuitFit` | 人生追求/身份目标是否支持。 |
| `relationshipFit` | 目标人物是否合适。 |
| `contextFit` | 场景、时间、礼法、家具、路径是否合适。 |
| `hysteresis` | 当前意图稳定性，不是核心价值，只是防抖。 |
| `hardRuleBonus` | 危机、安全、强制任务等硬规则。 |

### 6.1 稳定性 hysteresis

已有意图在未过期前获得稳定加成，避免每分钟跳来跳去。

规则建议：

- 同类意图持续 30-90 游戏分钟。
- 新意图必须高出当前意图一定差值才能抢占。
- hard 意图可直接抢占。

### 6.2 抢占等级

| lockLevel | 含义 |
|---|---|
| `none` | 空闲意图，随时可换。 |
| `soft` | 普通意图，需要明显更高优先级才能换。 |
| `hard` | 危机/安全/强任务，只有同级或完成后换。 |

## 7. 与 Utility AI 的关系

Intent 选出后，不直接执行动作，而是影响候选：

1. Provider 可读取 `context.intent`，只提供相关候选或提高相关候选质量。
2. Utility 的 `intentFactor` 对匹配标签加权，对无关候选压权。
3. Telemetry 记录每次决策时的 intent。

示例：

```js
context.intent = { id: 'task:execute', tags: ['task', 'follow'] };
```

则：

- QuestProvider 产出跟随/找人/复命候选。
- FurnitureProvider 仍可产出，但受任务压力压权。
- NeedProvider 如果是硬危机，允许抢占。

## 8. 与 HTN 的关系

HTN 不负责“为什么要做”，只负责“怎么做”。

Intent 决定：

```text
我要服侍更衣
```

HTN 分解：

```text
找到主子 → 走到 1.8 格内 → 保持 10 分钟 → 完成/复命
```

第一版 HTN 可只服务 `task:*` 和 `schedule:*`，不必覆盖所有日常行为。

## 9. 与 GOAP 的关系

GOAP 暂不做。

原因：

- 当前游戏更需要“古代生活节奏”和“戏剧稳定性”，不是全局最优搜索。
- Utility + Intent + HTN 已能覆盖大部分生活模拟。
- GOAP 后续可作为复杂任务的局部 planner，而不是主脑。

## 10. 配置建议

新增：

```js
aiIntentConfig: {
  enabled: true,
  switchMargin: 12,
  defaultDurationMin: 60,
  hardNeedThreshold: 0.12,
  softNeedThreshold: 0.35,
  taskDeadlineUrgentMin: 120,
  scheduleLookaheadMin: 90,
  nightSleepHour: 22,
}
```

每类 Intent 可配置：

```js
{
  id: 'task:execute',
  basePriority: 50,
  durationMin: 60,
  lockLevel: 'soft',
  providers: ['quest'],
  tags: ['task'],
}
```

性格配置新增可选 `effects.intent`：

```js
effects: {
  intent: {
    base: {
      'social:seek_company': 1.35,
      'emotion:comfort_self': 0.8,
    },
    sourcePressure: {
      lowSocial: 1.2,
      lowMood: 0.9,
      taskDeadline: 1.0,
    },
    targetBias: {
      trusted: 1.25,
      kin: 1.1,
      crowd: 0.75,
      hostile: 0.4,
    },
    stabilityMultiplier: 1.1,
  },
}
```

人物配置建议扩展：

```js
profiles: {
  daiyu: {
    aiTraits: ['mingan', 'duochou', 'gupi', 'gengzhi', 'xijing', 'shaochi'],
    hobbies: ['poetry', 'reading', 'quiet_tea'],
    lifePursuits: [
      { id: 'preserve_self', priority: 80 },
      { id: 'seek_true_feeling', priority: 75 },
    ],
  },
}
```

第一版可以不马上实现完整 `hobbies/lifePursuits` UI，但 PRD 和配置结构先留口。

## 11. 埋点

新增事件：

| 事件 | 说明 |
|---|---|
| `ai:intent_candidates` | 本轮所有意图候选及分数。 |
| `ai:intent_changed` | 意图切换。 |
| `ai:intent_kept` | 因稳定性保持当前意图。 |
| `ai:intent_completed` | 意图自然完成。 |
| `ai:intent_interrupted` | 被高优先级抢占。 |

每次 `ai:decision` 追加：

```js
intentId,
intentLabel,
intentReason,
intentScore
```

## 12. 调试面板

人物 AI 调试面板显示：

- 当前 Intent
- Intent 剩余时间
- 切换原因
- Top 5 Intent Candidates
- 当前 Candidate Provider 列表
- Utility Top 候选及评分因子
- 被拒绝候选原因

## 13. 第一阶段实施拆分

### Phase 1：Candidate Provider 接口

目标：把候选来源从 `buildCandidatePool()` 中抽出。

交付：

- `AiCandidateProviderSystem.register(provider)`
- `provide(c, context, out)`
- provider 诊断统一化
- 原行为不变

状态：已完成基础接口抽取。后续 provider 可逐步拆分，不必一次搬完。

### Phase 2：人格化 Intent 数据结构与选择器

目标：每个 AI 都有当前 Intent。

交付：

- `AiIntentSystem`
- `IntentCandidateProvider` 接口
- intent candidate 评分，包含 `personalityFit / habitFit / hobbyFit / pursuitFit`
- hysteresis
- `ai:intent_changed`
- `ai:decision` 追加 intent 信息
- `personalityTrace`：记录哪些性格、爱好、追求影响了本次意图

### Phase 3：基础 Intent Provider

目标：先不改行为结果，只把意图时间线跑出来。

交付：

- `NeedIntentProvider`
- `TraitIntentProvider`
- `SocialIntentProvider`
- `TaskIntentProvider`
- `ScheduleIntentProvider`
- `SafetyIntentProvider`
- `LifePursuitIntentProvider` 的空壳或最小实现

验收：

- 7 天模拟可导出“每人每天 Intent 时间线”。
- 黛玉、湘云、探春在同样低心绪/空闲时生成不同 Top Intent。

### Phase 4：Provider 读取 Intent

目标：候选提供与当前意图对齐。

交付：

- `context.intent`
- provider tags / allowedProviders
- Utility `intentFactor`

### Phase 5：任务 Intent 接 HTN

目标：任务从“权重加成”升级为“多步计划”。

交付：

- `TaskPlanner`
- `FOLLOW_CHARACTER`
- `INTERACT_WITH`
- `USE_FURNITURE_DURATION`
- `STAY_IN_SCENE`

## 14. 验收标准

最小验收：

- 任意角色可解释“当前为什么做这件事”。
- 当前 Intent 在 telemetry 中可查。
- 日常行为不会每分钟频繁换大方向。
- 已接任务时，任务 Intent 明确存在。
- 饥饿/力竭等危机可抢占任务 Intent。
- 无 Intent 时仍能回落到现有 Utility AI。

中期验收：

- 7 天模拟中，任务失败能区分为“计划失败/条件失败/时间不够/被更高 Intent 抢占”。
- 可在后台看到每个 NPC 一天的 Intent 时间线。
- 新 DLC 只需新增 Intent Provider / HTN 模板，不需要改 Utility 核心。
