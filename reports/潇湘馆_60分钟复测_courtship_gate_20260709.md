# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：70002
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 未发现高频任务失败或行动受阻。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 11 | 1 | 2 | 4 | 0 | 0 |  08:01 被紫鹃发起互动：「照拂」； 08:14 被紫鹃完成互动：「照拂」； 08:15 作息完成：晨起梳洗 via=wardrobe； 08:15 开始用家具：梳洗妆台 / tidy_dress； 08:20 完成用家具：梳洗妆台 / tidy_dress |
| 1 | 紫鹃 | 13 | 3 | 2 | 2 | 0 | 0 |  08:01 AI每日主动社交计数：黛玉 1/10； 08:01 作息完成：随侍黛玉 via=weijie； 08:01 开始互动：与黛玉「照拂」； 08:14 AI目标频控：黛玉 75分钟； 08:14 完成互动：与黛玉「照拂」 |
| 1 | 雪雁 | 14 | 3 | 4 | 2 | 0 | 0 |  08:08 作息完成：早餐 via=meal； 08:08 开始用家具：饭桌 / complain_food； 08:10 完成用家具：饭桌 / complain_food； 08:30 行动入队：💬 问安·黛玉； 08:30 AI选择：问安·黛玉 [int:103:daiyu] provider=social routine=morning_hygiene |
| 2 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |

## 最终状态

| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |
|---|---:|---|---|---|---:|---:|---:|---:|---:|
| 黛玉 | 1 | IDLE | 闲庭漫步 |  | 59 | 100 | 52 | 100 | 97 |
| 紫鹃 | 1 | EXECUTING | 去找雪雁·寒暄 | 💬 寒暄·雪雁 | 65 | 110 | 60 | 100 | 96 |
| 雪雁 | 1 | EXECUTING | 去找紫鹃·闲谈 | 💬 闲谈·紫鹃 | 80 | 100 | 58 | 100 | 83 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 紫鹃 | AI每日主动社交计数：黛玉 1/10 |  | ai:daily_social_count |
| 第01日 08:01 | 紫鹃 | 作息完成：随侍黛玉 via=weijie |  | ai:routine_completed |
| 第01日 08:01 | 紫鹃 | 开始互动：与黛玉「照拂」 |  | interaction:started |
| 第01日 08:01 | 黛玉 | 被紫鹃发起互动：「照拂」 |  | interaction:started |
| 第01日 08:08 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:08 | 雪雁 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:10 | 雪雁 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:14 | 紫鹃 | AI目标频控：黛玉 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:14 | 紫鹃 | 完成互动：与黛玉「照拂」 |  | interaction:complete |
| 第01日 08:14 | 黛玉 | 被紫鹃完成互动：「照拂」 |  | interaction:complete |
| 第01日 08:15 | 紫鹃 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 08:15 | 紫鹃 | AI选择：居家闲步 [w:home:9,40] provider=homeward |  | ai:decision |
| 第01日 08:15 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:15 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:16 | 紫鹃 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:16 | 紫鹃 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture |  | ai:decision |
| 第01日 08:20 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:28 | 紫鹃 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:30 | 雪雁 | 行动入队：💬 问安·黛玉 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI选择：问安·黛玉 [int:103:daiyu] provider=social routine=morning_hygiene |  | ai:decision |
| 第01日 08:31 | 雪雁 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:31 | 雪雁 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:33 | 紫鹃 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:33 | 雪雁 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:33 | 雪雁 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:38 | 雪雁 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:45 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第01日 08:45 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:45 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第01日 08:45 | 黛玉 | 开始互动：与雪雁「评文」 |  | interaction:started |
| 第01日 08:45 | 雪雁 | 被黛玉发起互动：「评文」 |  | interaction:started |
| 第01日 08:52 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:52 | 黛玉 | 完成互动：与雪雁「评文」 |  | interaction:complete |
| 第01日 08:52 | 雪雁 | 被黛玉完成互动：「评文」 |  | interaction:complete |
| 第01日 09:00 | 紫鹃 | 行动入队：💬 寒暄·雪雁 |  | queue:add |
| 第01日 09:00 | 紫鹃 | AI选择：寒暄·雪雁 [int:101:xueyan] provider=social |  | ai:decision |
| 第01日 09:00 | 雪雁 | 行动入队：💬 闲谈·紫鹃 |  | queue:add |
| 第01日 09:00 | 雪雁 | AI选择：闲谈·紫鹃 [int:102:zijuan] provider=social |  | ai:decision |

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
