# Activity Pack 主题玩法包 PRD

> 日期：2026-07-10  
> 文档定位：玩法包长期总 PRD。为饮酒、写诗、戏乐、品茶、赏花、下棋等“小功能但跨多系统”的玩法提供低成本扩展协议。  
> 当前实现：第一版薄底座已落地，支持从 `CONFIG.activityPacks` 声明家具动作，并自动并入现有家具 actions / AI 候选 / 玩家菜单链路。

## 0. 长期维护口径

从 2026-07-10 起，`持续更新_30_ActivityPack主题玩法包.md` 固定作为 Activity Pack 总纲，不再写单个玩法的完整细节。

具体玩法包独立成相邻文档：

| 序号 | 文档 | 玩法包 | 状态 |
|---|---|---|---|
| 31 | [持续更新_31_酒桌与饮酒系统.md](持续更新_31_酒桌与饮酒系统.md) | `drinking` | 已有第一版配置样板，仍缺 AlcoholSystem。 |
| 32 | [持续更新_32_写诗玩法包.md](持续更新_32_写诗玩法包.md) | `poetryWriting` | P0 已接配置，未做作品系统。 |

本总纲只维护：

- Activity Pack 的通用配置协议。
- 代码入口、解释边界和后台规划。
- 新玩法包必须遵守的字段、命名、AI 边界、埋点格式。
- 已登记玩法包索引和下一步底座能力。

## 1. 为什么需要 Activity Pack

新增一个古代生活玩法通常会同时牵到：

- 家具动作
- 技能成长
- 状态触发
- 性格偏好
- AI 选择
- 玩家菜单
- 埋点
- 后台配置
- PRD 维护

如果每次都手动散改，会很快失控。Activity Pack 的目标是把这类主题玩法收束成一个声明式配置包：

```text
主题玩法包
= 动作
+ 关联家具
+ 关联技能
+ 关联性格
+ 关联状态
+ AI 边界
+ 效果结算
+ 埋点口径
```

## 2. 当前代码入口

| 文件 | 作用 |
|---|---|
| `js/systems/activity-pack.js` | Activity Pack 解释器，负责读取 `CONFIG.activityPacks` 并生成家具 actions。 |
| `js/config.js` | 配置 `activityPacks`，当前已有 `drinking` 样板包。 |
| `js/action-queue.js` | `getFurnitureActions(tpl)` 优先读取 Activity Pack 合并后的动作。 |
| `js/world.js` | 家具动作运行时合并模板效果和 action 效果，并保留 `prob` 等字段。 |
| `js/ai.js` | AI 候选会读取 Activity Pack 动作；`ai.allowAutonomous:false` 的动作不进入自主 AI。 |

当前是“薄底座”：

- 已支持：家具动作声明、菜单展示、AI 候选、AI 禁自主标记、动作效果结算。
- 未支持：统一 condition 解释器、activity 专属后台表单、activity 级埋点聚合、自动生成社交互动。

## 3. 配置协议

```js
activityPacks: {
  drinking: {
    name: '饮酒',
    summary: '酒案、宴饮、独酌、行酒令等饮酒活动的主题玩法包。',
    tags: ['wine', 'banquet', 'social', 'mood'],
    skills: ['jiuliang'],
    traits: ['haoyin', 'shenyin'],
    states: ['tipsySocial', 'drunk'],
    furnitureCategories: ['wine'],
    telemetryPrefix: 'activity:drinking',
    furnitureActions: [
      {
        id: 'wine_sip',
        name: '小酌',
        text: '斟了半盏，浅浅尝过',
        duration: 2.5,
        dose: 0.15,
        aiWeight: 0.45,
        needRestores: [
          { need: 'fun', ratePerGameMin: 5 },
          { need: 'mood', ratePerGameMin: 2 }
        ],
        effects: [
          { timing: 'end', type: 'skillXp', skill: 'jiuliang', delta: 0.15 }
        ],
        tags: ['wine', 'mild', 'fun', 'mood']
      }
    ]
  }
}
```

## 4. Pack 字段

| 字段 | 含义 |
|---|---|
| `name` | 玩法包展示名。 |
| `summary` | 策划说明。 |
| `tags` | 玩法级标签，会并入动作标签。 |
| `skills` | 关联技能，只做声明和后台提示。 |
| `traits` | 关联性格，只做声明和后台提示。 |
| `states` | 关联状态，只做声明和后台提示。 |
| `furnitureCategories` | 自动挂载到哪些家具类别，例如 `wine`、`instrument`、`desk`。 |
| `furnitureTemplateIds` | 可选，精确挂载到某些家具模板。 |
| `furnitureTags` | 可选，按家具标签挂载。 |
| `telemetryPrefix` | 后续埋点前缀。 |
| `furnitureActions` | 玩法提供的家具动作列表。 |

## 5. furnitureActions 字段

Activity Pack 动作复用现有家具 action 协议，并新增少量主题元数据。

| 字段 | 含义 |
|---|---|
| `id` | 动作 ID，在玩法包内唯一。 |
| `name` | 菜单展示名。 |
| `text` | 开始动作时日志文案。 |
| `duration` | 动作耗时，沿用现有家具单位。 |
| `needRestores` | 持续恢复/消耗需求。 |
| `effects` | 结束或开始时结算的离散效果。 |
| `tags` | 动作标签，用于 AI、性格、旁观反应。 |
| `aiWeight` | AI 基础权重。 |
| `ai.allowAutonomous` | `false` 时玩家可点，但普通自主 AI 不会选择。 |
| `dose` | 主题自定义元数据，例如饮酒剂量；当前只记录，不自动解释。 |

效果当前支持现有 `CharacterEffectSystem`：

- `need`
- `state` / `addState`
- `skillXp`
- `log`

## 6. 合并规则

`ActivityPackSystem.getFurnitureActions(tpl)` 的顺序：

1. 读取家具模板自身 `tpl.actions`。
2. 读取所有匹配该家具的 Activity Pack `furnitureActions`。
3. 按 `id` 去重，模板自身动作优先。
4. 如果两边都没有动作，回退旧的 `default_use`。

这样旧家具不需要一次性迁移，新玩法也可以逐步挂载。

## 7. AI 规则

第一版只做一个必要边界：

```js
ai: { allowAutonomous: false }
```

用途：

- “酩酊大醉”“登台献丑”“写绝命诗”等高戏剧动作可以出现在玩家菜单里。
- 普通自主 AI 不会无缘无故乱选。
- 后续由 Intent / Drama / 事件系统在特定条件下显式启用。

后续扩展：

```js
conditions: [
  { type: 'needBelow', need: 'mood', value: 40 },
  { type: 'stateAny', states: ['ganshang', 'melancholy'] },
  { type: 'sceneTag', tag: 'banquet' }
]
```

目前 `conditions` 只作为设计字段，尚未统一解释。

## 8. 新增玩法模板

以后新增玩法，先按这个表写：

| 模块 | 内容 |
|---|---|
| 玩法名 | 如饮酒、写诗、戏乐。 |
| 文化定位 | 为什么这件事在红楼/古代生活中重要。 |
| 家具入口 | 挂到哪些家具 category/template。 |
| 动作列表 | 低风险日常、高风险戏剧、多人/场景动作。 |
| 技能 | 关联技能和成长来源。 |
| 性格 | 偏好对偶和行动权重。 |
| 状态 | 行动后状态和长期状态。 |
| AI 边界 | 哪些可自主，哪些只能玩家/事件触发。 |
| 效果 | 需求、技能、状态、关系、健康、秩序等。 |
| 埋点 | activity 前缀和关键字段。 |
| 验收 | 玩家菜单、AI 行为、模拟日志。 |

## 9. 已登记玩法包

| Pack ID | 名称 | 文档 | 代码状态 | 备注 |
|---|---|---|---|---|
| `drinking` | 饮酒 | [持续更新_31_酒桌与饮酒系统.md](持续更新_31_酒桌与饮酒系统.md) | 已接 `CONFIG.activityPacks.drinking` | 酒案 5 个动作已挂载，重度醉酒禁止自主 AI。 |
| `poetryWriting` | 写诗 | [持续更新_32_写诗玩法包.md](持续更新_32_写诗玩法包.md) | 已接 `CONFIG.activityPacks.poetryWriting` | 书案/花圃 4 个日常动作已挂载，作品系统和诗社未做。 |

登记标准：

- 每个 Pack 必须有独立 PRD。
- 每个 Pack 必须声明 `skills / traits / states / furnitureCategories / telemetryPrefix`。
- 高戏剧、高风险或强叙事动作必须显式写 `ai.allowAutonomous:false`，直到条件解释器能稳定控制。
- 不能在 Pack 里写“看似会生效但解释器未支持”的效果；暂时只能作为 `metadata` 或 PRD 待办。

## 10. 下一步

P0：

- 给后台新增【主题玩法包】只读/JSON 编辑入口。
- 给 Activity Pack 增加基础校验展示。
- 给 `activity:*` 埋点补统一事件。

P1：

- 实现通用 `conditions` 解释器。
- 实现 `effects` 扩展：关系、秩序、健康、activity 自定义负荷。
- 写诗作为第二个样板包接入代码，验证非酒类玩法能复用协议。

P2：

- 戏乐作为第三个样板包，验证多人、场景、身份礼法和旁观反应。
