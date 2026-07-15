# 潇湘馆 7 天离线模拟日志

- 模拟对象：宝玉、袭人、晴雯、麝月
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：74001
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 袭人 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 晴雯 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 宝玉 | 21 | 2 | 3 | 3 | 2 | 0 |  08:03 作息完成：晨起梳洗 via=bath； 08:03 开始用家具：浴盆 / default_use； 08:04 行动入队：🔥 备膳； 08:04 AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast； 08:16 作息完成：早餐 via=kitchen |
| 1 | 袭人 | 33 | 3 | 0 | 0 | 25 | 0 |  08:03 开始任务：晨起理妆； 08:15 行动入队：🤝 品茗·宝玉； 08:15 AI选择：品茗·宝玉 [int:104:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002； 08:20 行动入队：前往怡红院； 08:20 AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |
| 1 | 晴雯 | 12 | 3 | 4 | 0 | 0 | 0 |  08:04 行动入队：🛁 在浴盆； 08:04 作息完成：晨起梳洗 via=bath； 08:04 开始用家具：浴盆 / default_use； 08:04 AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene； 08:05 行动入队：🍚 挑食抱怨 |
| 1 | 麝月 | 19 | 3 | 4 | 3 | 0 | 0 |  08:05 行动入队：🛁 在浴盆； 08:05 AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene； 08:08 作息完成：晨起梳洗 via=bath； 08:08 开始用家具：浴盆 / default_use； 08:13 完成用家具：浴盆 / default_use |
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
| 宝玉 | 4 | PAUSED | 闲庭漫步 |  | 97 | 69 | 58 | 100 | 81 |
| 袭人 | 4 | EXECUTING | 去找宝玉·寒暄 | 💬 寒暄·宝玉 | 69 | 80 | 67 | 85 | 81 |
| 晴雯 | 4 | EXECUTING | 使用酒案… | 🍶 在酒案 | 79 | 82 | 56 | 85 | 75 |
| 麝月 | 4 | EXECUTING | 去找宝玉·闲谈 | 💬 闲谈·宝玉 | 99 | 110 | 65 | 100 | 84 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:03 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:03 | 袭人 | 任务进度：晨起理妆 1/20 |  | quest:progress |
| 第01日 08:03 | 宝玉 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:03 | 宝玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:04 | 袭人 | 任务进度：晨起理妆 2/20 |  | quest:progress |
| 第01日 08:04 | 宝玉 | 行动入队：🔥 备膳 |  | queue:add |
| 第01日 08:04 | 宝玉 | AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:04 | 晴雯 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:04 | 晴雯 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:04 | 晴雯 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:04 | 晴雯 | AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:05 | 袭人 | 任务进度：晨起理妆 3/20 |  | quest:progress |
| 第01日 08:05 | 晴雯 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:05 | 晴雯 | AI选择：饭桌·挑食抱怨 [furn:4006:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:05 | 麝月 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:05 | 麝月 | AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:06 | 袭人 | 任务进度：晨起理妆 4/20 |  | quest:progress |
| 第01日 08:07 | 袭人 | 任务进度：晨起理妆 5/20 |  | quest:progress |
| 第01日 08:08 | 袭人 | 任务进度：晨起理妆 6/20 |  | quest:progress |
| 第01日 08:08 | 麝月 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:08 | 麝月 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:09 | 袭人 | 任务进度：晨起理妆 7/20 |  | quest:progress |
| 第01日 08:13 | 麝月 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:15 | 袭人 | 行动入队：🤝 品茗·宝玉 |  | queue:add |
| 第01日 08:15 | 袭人 | AI选择：品茗·宝玉 [int:104:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:15 | 麝月 | 行动入队：🔥 备膳 |  | queue:add |
| 第01日 08:15 | 麝月 | AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:16 | 宝玉 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:16 | 宝玉 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |
| 第01日 08:16 | 晴雯 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:16 | 晴雯 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:19 | 晴雯 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:20 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:20 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:21 | 宝玉 | 完成用家具：厨房灶台 / prepare_meal |  | furniture:complete |
| 第01日 08:23 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:23 | 袭人 | 任务进度：晨起理妆 8/20 |  | quest:progress |
| 第01日 08:24 | 袭人 | 任务进度：晨起理妆 9/20 |  | quest:progress |
| 第01日 08:25 | 袭人 | 任务进度：晨起理妆 10/20 |  | quest:progress |
| 第01日 08:26 | 袭人 | 任务进度：晨起理妆 11/20 |  | quest:progress |
| 第01日 08:27 | 袭人 | 任务进度：晨起理妆 12/20 |  | quest:progress |
| 第01日 08:28 | 袭人 | 任务进度：晨起理妆 13/20 |  | quest:progress |
| 第01日 08:28 | 麝月 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:28 | 麝月 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |
| 第01日 08:29 | 袭人 | 任务进度：晨起理妆 14/20 |  | quest:progress |
| 第01日 08:30 | 袭人 | 任务进度：晨起理妆 15/20 |  | quest:progress |
| 第01日 08:31 | 袭人 | 任务进度：晨起理妆 16/20 |  | quest:progress |
| 第01日 08:32 | 袭人 | 任务进度：晨起理妆 17/20 |  | quest:progress |
| 第01日 08:33 | 袭人 | 任务进度：晨起理妆 18/20 |  | quest:progress |
| 第01日 08:33 | 麝月 | 完成用家具：厨房灶台 / prepare_meal |  | furniture:complete |
| 第01日 08:34 | 袭人 | 任务进度：晨起理妆 19/20 |  | quest:progress |
| 第01日 08:35 | 袭人 | 任务进度：晨起理妆 20/20 |  | quest:progress |
| 第01日 08:35 | 袭人 | 关系轴变化：affection 51.98→53.69（+1.71） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:35 | 宝玉 | 关系轴变化：affection 51.98→53.69（+1.71） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:35 | 袭人 | 关系轴变化：friendship 26→26.51（+0.51） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:35 | 宝玉 | 关系轴变化：friendship 26→26.51（+0.51） · 晨起理妆 | quest:4001 | relation:axis_change |
| 第01日 08:35 | 袭人 | 完成任务：晨起理妆 |  | quest:completed |
| 第01日 08:45 | 宝玉 | 行动入队：💬 调侃·麝月 |  | queue:add |
| 第01日 08:45 | 宝玉 | AI选择：调侃·麝月 [int:302:sheyue] provider=social |  | ai:decision |
| 第01日 08:47 | 宝玉 | AI每日主动社交计数：麝月 1/10 |  | ai:daily_social_count |
| 第01日 08:47 | 宝玉 | 开始互动：与麝月「调侃」 |  | interaction:started |
| 第01日 08:47 | 麝月 | 被宝玉发起互动：「调侃」 |  | interaction:started |
| 第01日 08:55 | 宝玉 | 关系轴变化：affection 43.96→49.57（+5.61） | relation | relation:axis_change |
| 第01日 08:55 | 麝月 | 关系轴变化：affection 43.96→49.57（+5.61） | relation | relation:axis_change |
| 第01日 08:55 | 宝玉 | 综合关系变化：36→39（朋友/友好） | relation | relation:change |
| 第01日 08:55 | 麝月 | 综合关系变化：36→39（朋友/友好） | relation | relation:change |
| 第01日 08:55 | 宝玉 | 关系轴变化：friendship 22→23.4（+1.4） | relation | relation:axis_change |
| 第01日 08:55 | 麝月 | 关系轴变化：friendship 22→23.4（+1.4） | relation | relation:axis_change |
| 第01日 08:55 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:55 | 宝玉 | 完成互动：与麝月「调侃」 |  | interaction:complete |
| 第01日 08:55 | 麝月 | 被宝玉完成互动：「调侃」 |  | interaction:complete |
| 第01日 09:00 | 袭人 | 任务下发：晨昏定省 | 宝玉 | quest:issued |
| 第01日 09:00 | 宝玉 | 下发任务给袭人：晨昏定省 | 宝玉 | quest:issued |
| 第01日 09:00 | 袭人 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 09:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 09:00 | 袭人 | 行动入队：💬 寒暄·宝玉 |  | queue:add |
| 第01日 09:00 | 袭人 | AI选择：晨昏定省·宝玉 [quest-interact:5:101:baoyu] provider=quest |  | ai:decision |
| 第01日 09:00 | 晴雯 | 行动入队：🍶 在酒案 |  | queue:add |
| 第01日 09:00 | 晴雯 | AI选择：酒案·使用酒案 [furn:4004:default_use] provider=furniture routine=skill-routine_study-18 |  | ai:decision |
| 第01日 09:00 | 麝月 | 行动入队：💬 闲谈·宝玉 |  | queue:add |
| 第01日 09:00 | 麝月 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 09:00 | 麝月 | 开始互动：与宝玉「闲谈」 |  | interaction:started |
| 第01日 09:00 | 宝玉 | 被麝月发起互动：「闲谈」 |  | interaction:started |
| 第01日 09:00 | 麝月 | AI选择：闲谈·宝玉 [int:102:baoyu] provider=social |  | ai:decision |
| 第01日 09:01 | 晴雯 | 开始用家具：酒案 / default_use |  | furniture:use_started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 190 |
| ai:state | 99 |
| quest:candidate | 82 |
| time:tick | 61 |
| queue:add | 48 |
| ai:decision | 48 |
| need:band_changed | 46 |
| state:add | 45 |
| character:effect | 41 |
| furniture:released | 31 |
| furniture:use_started | 31 |
| ai:routine_completed | 25 |
| furniture:complete | 23 |
| scene:enter:allowed | 22 |
| scene:entered | 22 |
| quest:progress | 21 |
| relation:axis_change | 19 |
| state:remove | 18 |
| ai:daily_social_count | 12 |
| interaction:started | 12 |
| furniture:reaction | 8 |
| interaction:effects | 8 |
| ai:social_target_cooldown | 8 |
| interaction:complete | 8 |
| quest:blocked | 6 |
| relation:change | 6 |
| emotion:resisted | 6 |
| servant:follow_state | 4 |
| quest:issued | 3 |
| quest:accepted | 3 |
| reputation_domain:change | 3 |
| quest:started | 2 |
| need:combination_triggered | 2 |
| observer:triggered | 1 |
| observer:executed | 1 |
| emotion:contagion | 1 |
| trait:competition | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
| state:refresh | 1 |
| lifePath:storyNode | 1 |
| family:fund_changed | 1 |
| economy:quest_cost | 1 |
| time:hour | 1 |
