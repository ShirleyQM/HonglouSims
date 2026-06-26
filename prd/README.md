# 大观园 PRD 索引

> 更新时间：2026-06-25
> 文档定位：`/prd` 是后续需求更新的主目录；根目录日期文档作为历史来源保留。

## 当前项目基线

- 当前版本定位：v0.1-alpha，面向朋友和早期玩家的静态网页试玩。
- 前台核心体验：观察人物、点家具/人物、编辑起居、传令、查看人物档案、保存本地进度。
- 后台核心定位：开发/策划配置，不作为普通玩家主要入口。
- 当前系统底座：六需求、起居、Utility AI、任务、传令、家具、社交、职业日课、故事路径、关系、存档已形成第一版闭环。
- 下一步先定项目目标，再决定是优先稳定公开试玩、扩内容，还是做玩家自定义配置。


## 维护规则

- 新需求优先更新本目录对应的“持续更新”文档。
- 根目录 `06xx_*.md` 只作为历史来源，不再作为唯一入口。
- 改代码时，如果改变了系统规则、配置字段、UI 入口或调试方式，同步更新对应 PRD 的“实施状态”和“代码入口”。
- 新增大系统时，按 `持续更新_序号主题.md` 命名；短期 UI 小稿可放 `UI_*.md`。

## 当前文档地图

| 系统 | 主文档 | 主要代码入口 |
|---|---|---|
| 性格 | `持续更新_01性格.md` | `js/systems/trait-effects.js`、`js/systems/trait-behavior.js`、`js/systems/specialty.js` |
| 关系 | `持续更新_02关系.md` | `js/systems/relation.js` |
| 任务 / 仆从 / 跟随 | `持续更新_03任务.md` | `js/systems/quest.js`、`js/systems/quest-issue.js`、`js/systems/servant-relations.js` |
| 家具 | `持续更新_04家具.md` | `js/config.js`、`js/action-queue.js`、`js/systems/furniture-reaction.js` |
| 人物 AI / Utility | `持续更新_05人物AI_Utility.md` | `js/ai.js`、`js/systems/ai-candidate-provider.js` |
| AI 与梦想系统联动 | `持续更新_19_AI与梦想系统联动.md` | `js/ai.js`、`js/systems/ai-candidate-provider.js`、`js/systems/ai-drama.js`、`js/config.js`、`js/admin.js` |
| AI 与梦想系统 P0 条件底座 | `持续更新_19_p0_AI梦想条件底座.md` | `js/systems/dream-condition.js`、`js/systems/dream-progress.js`、`js/systems/behavior-daily-stats.js`、`js/systems/health.js` |
| AI 与梦想系统 P1 实体系统 | `持续更新_19_p1_AI梦想实体系统.md` | `js/systems/social-issue.js`、`js/systems/secret.js`、`js/systems/inventory.js`、`js/systems/authority.js`、`js/systems/reputation-domain.js` |
| 基础需求 / 状态 | `持续更新_06基础需求与状态.md` | `js/systems/core-needs.js`、`js/systems/need-state.js`、`js/systems/state.js` |
| 社交互动 / 对话 / LLM | `持续更新_07社交互动与对话.md` | `js/systems/interaction-social.js`、`js/systems/dialogue.js`、`js/systems/interaction-llm.js` |
| 身份礼法 / 场景权限 | `持续更新_08身份礼法与场景权限.md` | `js/systems/identity-protocol.js`、`js/systems/scene-access.js` |
| 人生路径 / 故事节点 | `持续更新_09人生路径与故事节点.md` | `js/systems/life-path.js`、`js/systems/fortune.js` |
| 家族 / 公账 | `持续更新_10家族与公账.md` | `js/systems/family.js`、`js/systems/economy.js`、`js/systems/money.js` |
| 叙事气泡 / 多人物反应 | `持续更新_11叙事气泡与多人物反应.md` | `js/systems/narrative.js`、`js/systems/multi-interact.js` |
| 行为埋点 / 调试 | `持续更新_12行为埋点与调试.md` | `js/systems/behavior-telemetry.js`、`reports/`、`scripts/` |
| 资产 / 立绘 / 精灵 | `持续更新_13资产与精灵生图.md` | `js/assets.js`、`assets/manifest.json`、`scripts/process_portraits.py`、`scripts/sprite_workflow.py` |
| 配置生产 / 导入 | `持续更新_14配置生产与导入.md` | `js/config.js`、`js/admin.js`、`prompts/batch-gen/` |
| 后台 / 人物配置 | `持续更新_15后台与人物配置.md` | `js/admin.js`、`js/config.js` |
| 运行时 / 行动队列 / 存档 | `持续更新_16运行时行动队列与存档.md` | `js/runtime.js`、`js/action-queue.js`、`js/systems/quest.js`、`serve.mjs` |
| UI 总览 | `持续更新_17_UI总览.md` | `index.html`、`js/ui.js`、`js/draw.js`、`js/admin.js` |
| 新手引导 | `持续更新_24新手引导.md` | `js/ui.js`、`js/systems/quest.js`、后续 tutorial system |
| 场景优化 | `持续更新_21场景优化.md` | `js/config.js`、`js/world.js`、`js/draw.js`、`js/assets.js`、`assets/manifest.json` |
| 经济 | `持续更新_经济系统.md` | `js/systems/economy.js`、`js/systems/money.js` |
| 职业 | `持续更新_职业系统.md` | `js/systems/life-path.js`、`js/systems/specialty.js` |
| 地图 | `大观园地图.md` | `js/world.js`、`js/systems/scene-access.js` |
| 环形互动菜单 | `UI_环形互动菜单.md` | `js/ui.js` |
| 项目目标 | `项目目标.md` | 项目阶段目标、发版边界、讨论草案 |
| 开发日志 | `开发日志.md` | 项目整体 |

## 历史来源对照

| 历史文件 | 已归档到 |
|---|---|
| `archive/0609_01_互动引入身份.md`、`archive/0612_02_身份系统大纲.md` | `持续更新_08身份礼法与场景权限.md` |
| `archive/0609_02_对话引起状态变化.md`、`archive/0609_03_对话轮次和群聊.md`、`archive/0612_05_新增社交互动.md` | `持续更新_07社交互动与对话.md`、`持续更新_11叙事气泡与多人物反应.md` |
| `archive/0615_游戏时间与需求衰退管理.md`、`archive/0616_基础需求状态标签.md` | `持续更新_06基础需求与状态.md` |
| `archive/0612_06_02_袭人晋升故事线.md`、`archive/0612_06_03_王熙凤晋升故事线和新系统框架.md` | `持续更新_09人生路径与故事节点.md`、`持续更新_职业系统.md` |
| `archive/0618_AI精灵生图工作流.md` | `持续更新_13资产与精灵生图.md` |
| `archive/配置表批量生成指南.md`、`prompts/batch-gen/*` | `持续更新_14配置生产与导入.md` |

完整历史稿清单见 `archive/README.md`。
