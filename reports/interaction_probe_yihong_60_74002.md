# 潇湘馆 7 天离线模拟日志

- 模拟对象：宝玉、袭人、晴雯、麝月
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：74002
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 未发现高频任务失败或行动受阻。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 宝玉 | 31 | 2 | 2 | 8 | 0 | 0 |  08:03 作息完成：晨起梳洗 via=wardrobe； 08:03 开始用家具：梳洗妆台 / tidy_dress； 08:08 完成用家具：梳洗妆台 / tidy_dress； 08:15 行动入队：💬 调侃·袭人； 08:15 AI选择：调侃·袭人 [int:302:xiren] provider=social routine=breakfast |
| 1 | 袭人 | 44 | 2 | 0 | 4 | 24 | 0 |  08:03 开始任务：晨起理妆； 08:15 行动入队：🤝 品茗·宝玉； 08:15 AI选择：品茗·宝玉 [int:104:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002； 08:15 被宝玉发起互动：「调侃」； 08:16 AI每日主动社交计数：宝玉 1/10 |
| 1 | 晴雯 | 15 | 2 | 2 | 3 | 2 | 0 |  08:15 作息完成：早餐 via=meal； 08:15 开始用家具：饭桌 / complain_food； 08:17 完成用家具：饭桌 / complain_food； 08:51 被宝玉发起互动：「打趣」； 08:58 关系轴变化：affection 41.96→50.18（+8.22） |
| 1 | 麝月 | 16 | 4 | 4 | 1 | 0 | 0 |  08:08 作息完成：晨起梳洗 via=bath； 08:08 开始用家具：浴盆 / default_use； 08:13 完成用家具：浴盆 / default_use； 08:15 行动入队：💬 问安·宝玉； 08:15 AI选择：问安·宝玉 [int:103:baoyu] provider=social routine=breakfast |
| 2 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |

## 最终状态

| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |
|---|---:|---|---|---|---:|---:|---:|---:|---:|
| 宝玉 | 4 | IDLE | 闲庭漫步 |  | 65 | 100 | 66 | 100 | 97 |
| 袭人 | 4 | EXECUTING | 去找麝月·寒暄 | 💬 寒暄·麝月 | 69 | 80 | 75 | 100 | 97 |
| 晴雯 | 4 | EXECUTING | 闲庭漫步 |  | 79 | 72 | 56 | 100 | 81 |
| 麝月 | 4 | EXECUTING | 行走中 | 🍶 在酒案 | 99 | 110 | 65 | 85 | 78 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:03 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:03 | 袭人 | 任务进度：晨起理妆 1/20 |  | quest:progress |
| 第01日 08:03 | 宝玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:03 | 宝玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:04 | 袭人 | 任务进度：晨起理妆 2/20 |  | quest:progress |
| 第01日 08:05 | 袭人 | 任务进度：晨起理妆 3/20 |  | quest:progress |
| 第01日 08:06 | 袭人 | 任务进度：晨起理妆 4/20 |  | quest:progress |
| 第01日 08:07 | 袭人 | 任务进度：晨起理妆 5/20 |  | quest:progress |
| 第01日 08:08 | 袭人 | 任务进度：晨起理妆 6/20 |  | quest:progress |
| 第01日 08:08 | 宝玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:08 | 麝月 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:08 | 麝月 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:09 | 袭人 | 任务进度：晨起理妆 7/20 |  | quest:progress |
| 第01日 08:10 | 袭人 | 任务进度：晨起理妆 8/20 |  | quest:progress |
| 第01日 08:11 | 袭人 | 任务进度：晨起理妆 9/20 |  | quest:progress |
| 第01日 08:12 | 袭人 | 任务进度：晨起理妆 10/20 |  | quest:progress |
| 第01日 08:13 | 袭人 | 任务进度：晨起理妆 11/20 |  | quest:progress |
| 第01日 08:13 | 麝月 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:14 | 袭人 | 任务进度：晨起理妆 12/20 |  | quest:progress |
| 第01日 08:15 | 袭人 | 任务进度：晨起理妆 13/20 |  | quest:progress |
| 第01日 08:15 | 宝玉 | 行动入队：💬 调侃·袭人 |  | queue:add |
| 第01日 08:15 | 宝玉 | AI选择：调侃·袭人 [int:302:xiren] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:15 | 袭人 | 行动入队：🤝 品茗·宝玉 |  | queue:add |
| 第01日 08:15 | 袭人 | AI选择：品茗·宝玉 [int:104:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:15 | 麝月 | 行动入队：💬 问安·宝玉 |  | queue:add |
| 第01日 08:15 | 麝月 | AI选择：问安·宝玉 [int:103:baoyu] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:15 | 宝玉 | AI每日主动社交计数：袭人 1/10 |  | ai:daily_social_count |
| 第01日 08:15 | 宝玉 | 开始互动：与袭人「调侃」 |  | interaction:started |
| 第01日 08:15 | 袭人 | 被宝玉发起互动：「调侃」 |  | interaction:started |
| 第01日 08:15 | 晴雯 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:15 | 晴雯 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:15 | 麝月 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 08:15 | 麝月 | 开始互动：与宝玉「问安」 |  | interaction:started |
| 第01日 08:15 | 宝玉 | 被麝月发起互动：「问安」 |  | interaction:started |
| 第01日 08:16 | 袭人 | 任务进度：晨起理妆 14/20 |  | quest:progress |
| 第01日 08:16 | 袭人 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 08:16 | 袭人 | 作息完成：随侍左右 via=xujiu |  | ai:routine_completed |
| 第01日 08:16 | 袭人 | 开始互动：与宝玉「品茗」 |  | interaction:started |
| 第01日 08:16 | 宝玉 | 被袭人发起互动：「品茗」 |  | interaction:started |
| 第01日 08:17 | 袭人 | 任务进度：晨起理妆 15/20 |  | quest:progress |
| 第01日 08:17 | 麝月 | 行动入队：🔥 备膳 |  | queue:add |
| 第01日 08:17 | 麝月 | AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:17 | 晴雯 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:18 | 袭人 | 任务进度：晨起理妆 16/20 |  | quest:progress |
| 第01日 08:19 | 袭人 | 任务进度：晨起理妆 17/20 |  | quest:progress |
| 第01日 08:20 | 袭人 | 任务进度：晨起理妆 18/20 |  | quest:progress |
| 第01日 08:21 | 袭人 | 任务进度：晨起理妆 19/20 |  | quest:progress |
| 第01日 08:22 | 袭人 | 任务进度：晨起理妆 20/20 |  | quest:progress |
| 第01日 08:22 | 袭人 | 关系轴变化：affection 51.99→53.7（+1.71） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:22 | 宝玉 | 关系轴变化：affection 51.99→53.7（+1.71） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:22 | 袭人 | 关系轴变化：friendship 26→26.51（+0.51） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:22 | 宝玉 | 关系轴变化：friendship 26→26.51（+0.51） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:22 | 袭人 | 完成任务：晨起理妆 |  | quest:completed |
| 第01日 08:22 | 宝玉 | 关系轴变化：affection 53.7→59.97（+6.27） | relation | relation:axis_change |
| 第01日 08:22 | 袭人 | 关系轴变化：affection 53.7→59.97（+6.27） | relation | relation:axis_change |
| 第01日 08:22 | 宝玉 | 综合关系变化：44→47（好友/亲密） | relation | relation:change |
| 第01日 08:22 | 袭人 | 综合关系变化：44→47（好友/亲密） | relation | relation:change |
| 第01日 08:22 | 宝玉 | 关系轴变化：friendship 26.51→28.08（+1.57） | relation | relation:axis_change |
| 第01日 08:22 | 袭人 | 关系轴变化：friendship 26.51→28.08（+1.57） | relation | relation:axis_change |
| 第01日 08:22 | 宝玉 | AI目标频控：袭人 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:22 | 宝玉 | 完成互动：与袭人「调侃」 |  | interaction:complete |
| 第01日 08:22 | 袭人 | 被宝玉完成互动：「调侃」 |  | interaction:complete |
| 第01日 08:29 | 袭人 | 关系轴变化：affection 59.96→63.38（+3.42） | relation | relation:axis_change |
| 第01日 08:29 | 宝玉 | 关系轴变化：affection 59.96→63.38（+3.42） | relation | relation:axis_change |
| 第01日 08:29 | 袭人 | 综合关系变化：47→49（好友/亲密） | relation | relation:change |
| 第01日 08:29 | 宝玉 | 综合关系变化：47→49（好友/亲密） | relation | relation:change |
| 第01日 08:29 | 袭人 | 关系轴变化：trust 41.99→45.41（+3.42） | relation | relation:axis_change |
| 第01日 08:29 | 宝玉 | 关系轴变化：trust 41.99→45.41（+3.42） | relation | relation:axis_change |
| 第01日 08:29 | 袭人 | 关系轴变化：friendship 28.08→31.5（+3.42） | relation | relation:axis_change |
| 第01日 08:29 | 宝玉 | 关系轴变化：friendship 28.08→31.5（+3.42） | relation | relation:axis_change |
| 第01日 08:29 | 袭人 | AI目标频控：宝玉 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:29 | 袭人 | 完成互动：与宝玉「品茗」 |  | interaction:complete |
| 第01日 08:29 | 宝玉 | 被袭人完成互动：「品茗」 |  | interaction:complete |
| 第01日 08:29 | 麝月 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:29 | 麝月 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |
| 第01日 08:34 | 麝月 | 完成用家具：厨房灶台 / prepare_meal |  | furniture:complete |
| 第01日 08:45 | 宝玉 | 行动入队：💬 打趣·晴雯 |  | queue:add |
| 第01日 08:45 | 宝玉 | AI选择：打趣·晴雯 [int:301:qingwen] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:51 | 宝玉 | AI每日主动社交计数：晴雯 1/10 |  | ai:daily_social_count |
| 第01日 08:51 | 宝玉 | 开始互动：与晴雯「打趣」 |  | interaction:started |
| 第01日 08:51 | 晴雯 | 被宝玉发起互动：「打趣」 |  | interaction:started |
| 第01日 08:58 | 宝玉 | 关系轴变化：affection 41.96→50.18（+8.22） | relation | relation:axis_change |
| 第01日 08:58 | 晴雯 | 关系轴变化：affection 41.96→50.18（+8.22） | relation | relation:axis_change |
| 第01日 08:58 | 宝玉 | 综合关系变化：35→39（朋友/友好） | relation | relation:change |
| 第01日 08:58 | 晴雯 | 综合关系变化：35→39（朋友/友好） | relation | relation:change |
| 第01日 08:58 | 宝玉 | 关系轴变化：friendship 21→22.64（+1.64） | relation | relation:axis_change |
| 第01日 08:58 | 晴雯 | 关系轴变化：friendship 21→22.64（+1.64） | relation | relation:axis_change |
| 第01日 08:58 | 宝玉 | AI目标频控：晴雯 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:58 | 宝玉 | 完成互动：与晴雯「打趣」 |  | interaction:complete |
| 第01日 08:58 | 晴雯 | 被宝玉完成互动：「打趣」 |  | interaction:complete |
| 第01日 09:00 | 晴雯 | 任务下发：跑腿买办 | 袭人 | quest:issued |
| 第01日 09:00 | 袭人 | 下发任务给晴雯：跑腿买办 | 袭人 | quest:issued |
| 第01日 09:00 | 晴雯 | 接受任务：跑腿买办 | 袭人 | quest:accepted |
| 第01日 09:00 | 袭人 | 接受任务：跑腿买办 | 袭人 | quest:accepted |
| 第01日 09:00 | 袭人 | 行动入队：💬 寒暄·麝月 |  | queue:add |
| 第01日 09:00 | 袭人 | AI选择：寒暄·麝月 [int:101:sheyue] provider=social |  | ai:decision |
| 第01日 09:00 | 晴雯 | 行动入队：💬 闲谈·宝玉 |  | queue:add |
| 第01日 09:00 | 晴雯 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 09:00 | 晴雯 | 开始互动：与宝玉「闲谈」 |  | interaction:started |
| 第01日 09:00 | 宝玉 | 被晴雯发起互动：「闲谈」 |  | interaction:started |
| 第01日 09:00 | 晴雯 | AI选择：闲谈·宝玉 [int:102:baoyu] provider=social |  | ai:decision |
| 第01日 09:00 | 麝月 | 行动入队：🤝 品茗·晴雯 |  | queue:add |
| 第01日 09:00 | 麝月 | AI选择：品茗·晴雯 [int:104:qingwen] provider=social |  | ai:decision |
| 第01日 09:01 | 晴雯 | AI选择：前往大观楼·沁芳庭 [quest-scene:4:3] provider=quest |  | ai:decision |
| 第01日 09:01 | 麝月 | 行动入队：🍶 在酒案 |  | queue:add |
| 第01日 09:01 | 麝月 | AI选择：酒案·使用酒案 [furn:4004:default_use] provider=furniture routine=skill-routine_study-18 |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 173 |
| ai:state | 88 |
| quest:candidate | 66 |
| time:tick | 61 |
| ai:decision | 47 |
| queue:add | 46 |
| character:effect | 43 |
| need:band_changed | 42 |
| state:add | 40 |
| furniture:released | 29 |
| furniture:use_started | 27 |
| scene:enter:allowed | 23 |
| scene:entered | 23 |
| ai:routine_completed | 22 |
| furniture:complete | 21 |
| quest:progress | 21 |
| state:remove | 18 |
| relation:axis_change | 15 |
| ai:daily_social_count | 11 |
| interaction:started | 11 |
| interaction:effects | 6 |
| ai:social_target_cooldown | 6 |
| interaction:complete | 6 |
| quest:blocked | 5 |
| furniture:reaction | 4 |
| relation:change | 4 |
| reputation_domain:change | 3 |
| quest:issued | 2 |
| quest:accepted | 2 |
| servant:follow_state | 2 |
| emotion:resisted | 2 |
| interaction:state | 2 |
| quest:started | 1 |
| invitation:sent | 1 |
| access:granted | 1 |
| invitation:accepted | 1 |
| observer:triggered | 1 |
| observer:executed | 1 |
| trait:competition | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
| need:combination_triggered | 1 |
| family:fund_changed | 1 |
| economy:quest_cost | 1 |
| time:hour | 1 |
