# 潇湘馆 7 天离线模拟日志

- 模拟对象：宝玉、袭人、晴雯、麝月
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：70002
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 袭人 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 麝月 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 宝玉 | 15 | 2 | 3 | 2 | 2 | 0 |  08:03 作息完成：晨起梳洗 via=wardrobe； 08:03 开始用家具：梳洗妆台 / tidy_dress； 08:04 行动入队：🔥 备膳； 08:04 AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast； 08:16 作息完成：早餐 via=kitchen |
| 1 | 袭人 | 37 | 6 | 0 | 0 | 25 | 0 |  08:01 行动入队：前往怡红院； 08:01 AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002； 08:03 开始任务：晨起理妆； 08:15 行动入队：前往怡红院； 08:15 AI选择：寻宝玉 [relseek:baoyu] provider=relation routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |
| 1 | 晴雯 | 5 | 0 | 2 | 2 | 0 | 0 |  08:15 作息完成：早餐 via=meal； 08:15 开始用家具：饭桌 / complain_food； 08:17 完成用家具：饭桌 / complain_food； 08:50 被宝玉发起互动：「调侃」； 08:57 被宝玉完成互动：「调侃」 |
| 1 | 麝月 | 12 | 3 | 4 | 0 | 0 | 0 |  08:01 行动入队：🛁 在浴盆； 08:01 AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene； 08:08 作息完成：晨起梳洗 via=bath； 08:08 开始用家具：浴盆 / default_use； 08:13 完成用家具：浴盆 / default_use |
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
| 宝玉 | 4 | IDLE | 闲庭漫步 |  | 97 | 69 | 58 | 100 | 81 |
| 袭人 | 4 | EXECUTING | 去找宝玉·按摩 | 🤝 按摩·宝玉 | 69 | 80 | 67 | 85 | 81 |
| 晴雯 | 4 | IDLE | 让开些 |  | 79 | 72 | 56 | 100 | 81 |
| 麝月 | 4 | EXECUTING | 行走中 | 🍶 在酒案 | 99 | 110 | 65 | 85 | 78 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:01 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:01 | 麝月 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:01 | 麝月 | AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:03 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:03 | 袭人 | 任务进度：晨起理妆 1/20 |  | quest:progress |
| 第01日 08:03 | 宝玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:03 | 宝玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:04 | 袭人 | 任务进度：晨起理妆 2/20 |  | quest:progress |
| 第01日 08:04 | 宝玉 | 行动入队：🔥 备膳 |  | queue:add |
| 第01日 08:04 | 宝玉 | AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:05 | 袭人 | 任务进度：晨起理妆 3/20 |  | quest:progress |
| 第01日 08:06 | 袭人 | 任务进度：晨起理妆 4/20 |  | quest:progress |
| 第01日 08:07 | 袭人 | 任务进度：晨起理妆 5/20 |  | quest:progress |
| 第01日 08:08 | 袭人 | 任务进度：晨起理妆 6/20 |  | quest:progress |
| 第01日 08:08 | 麝月 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:08 | 麝月 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:09 | 袭人 | 任务进度：晨起理妆 7/20 |  | quest:progress |
| 第01日 08:13 | 麝月 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:15 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:15 | 袭人 | AI选择：寻宝玉 [relseek:baoyu] provider=relation routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:15 | 麝月 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第01日 08:15 | 麝月 | AI选择：饭桌·独自用膳 [furn:4006:eat_alone] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:15 | 晴雯 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:15 | 晴雯 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:16 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:16 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:16 | 宝玉 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:16 | 宝玉 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |
| 第01日 08:17 | 晴雯 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:18 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:18 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:21 | 宝玉 | 完成用家具：厨房灶台 / prepare_meal |  | furniture:complete |
| 第01日 08:23 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:23 | 袭人 | 任务进度：晨起理妆 8/20 |  | quest:progress |
| 第01日 08:23 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:23 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:23 | 麝月 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:23 | 麝月 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 08:24 | 袭人 | 任务进度：晨起理妆 9/20 |  | quest:progress |
| 第01日 08:25 | 袭人 | 任务进度：晨起理妆 10/20 |  | quest:progress |
| 第01日 08:26 | 袭人 | 任务进度：晨起理妆 11/20 |  | quest:progress |
| 第01日 08:27 | 袭人 | 任务进度：晨起理妆 12/20 |  | quest:progress |
| 第01日 08:27 | 麝月 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 08:28 | 袭人 | 任务进度：晨起理妆 13/20 |  | quest:progress |
| 第01日 08:29 | 袭人 | 任务进度：晨起理妆 14/20 |  | quest:progress |
| 第01日 08:30 | 袭人 | 任务进度：晨起理妆 15/20 |  | quest:progress |
| 第01日 08:31 | 袭人 | 任务进度：晨起理妆 16/20 |  | quest:progress |
| 第01日 08:32 | 袭人 | 任务进度：晨起理妆 17/20 |  | quest:progress |
| 第01日 08:33 | 袭人 | 任务进度：晨起理妆 18/20 |  | quest:progress |
| 第01日 08:34 | 袭人 | 任务进度：晨起理妆 19/20 |  | quest:progress |
| 第01日 08:35 | 袭人 | 任务进度：晨起理妆 20/20 |  | quest:progress |
| 第01日 08:35 | 袭人 | 完成任务：晨起理妆 |  | quest:completed |
| 第01日 08:45 | 宝玉 | 行动入队：💬 调侃·晴雯 |  | queue:add |
| 第01日 08:45 | 宝玉 | AI选择：调侃·晴雯 [int:302:qingwen] provider=social |  | ai:decision |
| 第01日 08:50 | 宝玉 | AI每日主动社交计数：晴雯 1/10 |  | ai:daily_social_count |
| 第01日 08:50 | 宝玉 | 开始互动：与晴雯「调侃」 |  | interaction:started |
| 第01日 08:50 | 晴雯 | 被宝玉发起互动：「调侃」 |  | interaction:started |
| 第01日 08:57 | 宝玉 | AI目标频控：晴雯 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:57 | 宝玉 | 完成互动：与晴雯「调侃」 |  | interaction:complete |
| 第01日 08:57 | 晴雯 | 被宝玉完成互动：「调侃」 |  | interaction:complete |
| 第01日 09:00 | 袭人 | 任务下发：备膳 | 宝玉 | quest:issued |
| 第01日 09:00 | 宝玉 | 下发任务给袭人：备膳 | 宝玉 | quest:issued |
| 第01日 09:00 | 袭人 | 接受任务：备膳 | 宝玉 | quest:accepted |
| 第01日 09:00 | 宝玉 | 接受任务：备膳 | 宝玉 | quest:accepted |
| 第01日 09:00 | 袭人 | 行动入队：🤝 按摩·宝玉 |  | queue:add |
| 第01日 09:00 | 袭人 | AI选择：按摩·宝玉 [int:704:baoyu] provider=social |  | ai:decision |
| 第01日 09:00 | 麝月 | 行动入队：🍶 在酒案 |  | queue:add |
| 第01日 09:00 | 麝月 | AI选择：酒案·使用酒案 [furn:4004:default_use] provider=furniture routine=skill-routine_study-18 |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 193 |
| ai:state | 92 |
| time:tick | 61 |
| queue:add | 51 |
| ai:decision | 51 |
| state:add | 50 |
| need:band_changed | 49 |
| quest:candidate | 44 |
| character:effect | 39 |
| furniture:use_started | 29 |
| furniture:released | 29 |
| ai:routine_completed | 25 |
| furniture:complete | 24 |
| state:remove | 23 |
| quest:progress | 22 |
| relation:axis_change | 21 |
| scene:enter:allowed | 20 |
| scene:entered | 20 |
| reputation_domain:change | 11 |
| ai:daily_social_count | 9 |
| interaction:started | 9 |
| furniture:reaction | 9 |
| interaction:effects | 8 |
| ai:social_target_cooldown | 8 |
| interaction:complete | 8 |
| quest:blocked | 5 |
| relation:change | 5 |
| emotion:resisted | 5 |
| servant:follow_state | 4 |
| quest:started | 3 |
| reputation:change | 3 |
| need:combination_triggered | 3 |
| quest:issued | 2 |
| quest:accepted | 2 |
| observer:triggered | 2 |
| observer:executed | 2 |
| quest:completed | 2 |
| emotion:contagion | 2 |
| lifePath:storyNode | 1 |
| trait:competition | 1 |
| family:fund_changed | 1 |
| economy:quest_cost | 1 |
| time:hour | 1 |
