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
| 1 | 黛玉 | 16 | 3 | 4 | 3 | 0 | 0 |  08:03 作息完成：晨起梳洗 via=wardrobe； 08:03 开始用家具：梳洗妆台 / tidy_dress； 08:08 完成用家具：梳洗妆台 / tidy_dress； 08:15 行动入队：💬 辩理·雪雁； 08:15 AI选择：辩理·雪雁 [int:201:xueyan] provider=social routine=breakfast |
| 1 | 紫鹃 | 5 | 1 | 2 | 1 | 0 | 0 |  08:10 开始用家具：浴盆 / default_use； 08:15 完成用家具：浴盆 / default_use； 09:00 行动入队：🤝 赠物·黛玉； 09:00 AI选择：赠物·黛玉 [int:503:daiyu] provider=social； 09:01 被雪雁发起互动：「寒暄」 |
| 1 | 雪雁 | 18 | 3 | 4 | 4 | 0 | 0 |  08:08 作息完成：早餐 via=meal； 08:08 开始用家具：饭桌 / complain_food； 08:10 完成用家具：饭桌 / complain_food； 08:19 被黛玉发起互动：「辩理」； 08:26 被黛玉完成互动：「辩理」 |
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
| 黛玉 | 1 | IDLE | 闲庭漫步 |  | 59 | 99 | 60 | 100 | 86 |
| 紫鹃 | 1 | PAUSED | 与雪雁·寒暄 | 🤝 赠物·黛玉 | 65 | 110 | 60 | 85 | 83 |
| 雪雁 | 1 | PAUSED | 主动与紫鹃·寒暄 | 💬 寒暄·紫鹃 | 80 | 100 | 58 | 100 | 87 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:03 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:03 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:08 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:08 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:08 | 雪雁 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:10 | 紫鹃 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:10 | 雪雁 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:15 | 黛玉 | 行动入队：💬 辩理·雪雁 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：辩理·雪雁 [int:201:xueyan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:15 | 紫鹃 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:19 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第01日 08:19 | 黛玉 | 开始互动：与雪雁「辩理」 |  | interaction:started |
| 第01日 08:19 | 雪雁 | 被黛玉发起互动：「辩理」 |  | interaction:started |
| 第01日 08:26 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:26 | 黛玉 | 完成互动：与雪雁「辩理」 |  | interaction:complete |
| 第01日 08:26 | 雪雁 | 被黛玉完成互动：「辩理」 |  | interaction:complete |
| 第01日 08:30 | 雪雁 | 行动入队：💬 闲谈·黛玉 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI每日主动社交计数：黛玉 1/10 |  | ai:daily_social_count |
| 第01日 08:30 | 雪雁 | 开始互动：与黛玉「闲谈」 |  | interaction:started |
| 第01日 08:30 | 黛玉 | 被雪雁发起互动：「闲谈」 |  | interaction:started |
| 第01日 08:30 | 雪雁 | AI选择：闲谈·黛玉 [int:102:daiyu] provider=social routine=morning_hygiene |  | ai:decision |
| 第01日 08:31 | 雪雁 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:31 | 雪雁 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:40 | 雪雁 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:40 | 雪雁 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:44 | 雪雁 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:45 | 黛玉 | 行动入队：💬 评文·贾母 |  | queue:add |
| 第01日 08:45 | 黛玉 | AI选择：评文·贾母 [int:203:jiamu] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:46 | 黛玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 08:46 | 黛玉 | 开始用家具：竹榻 / default_use |  | furniture:use_started |
| 第01日 08:46 | 黛玉 | AI选择：竹榻·使用竹榻 [furn:1009:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:49 | 黛玉 | 完成用家具：竹榻 / default_use |  | furniture:complete |
| 第01日 09:00 | 紫鹃 | 行动入队：🤝 赠物·黛玉 |  | queue:add |
| 第01日 09:00 | 紫鹃 | AI选择：赠物·黛玉 [int:503:daiyu] provider=social |  | ai:decision |
| 第01日 09:00 | 雪雁 | 行动入队：💬 寒暄·紫鹃 |  | queue:add |
| 第01日 09:00 | 雪雁 | AI选择：寒暄·紫鹃 [int:101:zijuan] provider=social |  | ai:decision |
| 第01日 09:01 | 雪雁 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第01日 09:01 | 雪雁 | 开始互动：与紫鹃「寒暄」 |  | interaction:started |
| 第01日 09:01 | 紫鹃 | 被雪雁发起互动：「寒暄」 |  | interaction:started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 173 |
| ai:state | 79 |
| time:tick | 61 |
| quest:candidate | 51 |
| need:band_changed | 51 |
| state:add | 49 |
| queue:add | 44 |
| ai:decision | 44 |
| character:effect | 34 |
| furniture:released | 30 |
| furniture:use_started | 29 |
| scene:enter:allowed | 27 |
| scene:entered | 27 |
| state:remove | 26 |
| ai:routine_completed | 24 |
| furniture:complete | 23 |
| quest:progress | 21 |
| relation:axis_change | 11 |
| ai:daily_social_count | 10 |
| interaction:started | 10 |
| emotion:resisted | 8 |
| furniture:reaction | 7 |
| interaction:effects | 5 |
| ai:social_target_cooldown | 5 |
| interaction:complete | 5 |
| quest:blocked | 4 |
| relation:change | 3 |
| emotion:contagion | 3 |
| reputation_domain:change | 3 |
| quest:issued | 2 |
| quest:accepted | 2 |
| servant:follow_state | 2 |
| quest:started | 1 |
| observer:triggered | 1 |
| observer:executed | 1 |
| trait:competition | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
| need:combination_triggered | 1 |
| quest:acceptance_checked | 1 |
| time:hour | 1 |
| ai:candidate_rejected | 1 |
