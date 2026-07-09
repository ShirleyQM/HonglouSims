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
| 1 | 黛玉 | 10 | 2 | 4 | 1 | 0 | 0 |  08:03 作息完成：晨起梳洗 via=wardrobe； 08:03 开始用家具：梳洗妆台 / tidy_dress； 08:08 完成用家具：梳洗妆台 / tidy_dress； 08:15 行动入队：💬 评文·雪雁； 08:15 AI选择：评文·雪雁 [int:203:xueyan] provider=social routine=breakfast |
| 1 | 紫鹃 | 5 | 1 | 2 | 1 | 0 | 0 |  08:10 开始用家具：浴盆 / default_use； 08:15 完成用家具：浴盆 / default_use； 09:00 行动入队：🤝 凝眸·黛玉； 09:00 AI选择：凝眸·黛玉 [int:501:daiyu] provider=social； 09:01 被雪雁发起互动：「比腕」 |
| 1 | 雪雁 | 18 | 4 | 4 | 2 | 0 | 0 |  08:02 行动入队：🍚 挑食抱怨； 08:02 AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=breakfast； 08:09 作息完成：早餐 via=meal； 08:09 开始用家具：饭桌 / complain_food； 08:11 完成用家具：饭桌 / complain_food |
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
| 黛玉 | 1 | IDLE | 闲庭漫步 |  | 59 | 99 | 60 | 85 | 67 |
| 紫鹃 | 1 | PAUSED | 与雪雁·比腕 | 🤝 凝眸·黛玉 | 65 | 110 | 60 | 85 | 78 |
| 雪雁 | 1 | PAUSED | 主动与紫鹃·比腕 | 🤝 比腕·紫鹃 | 80 | 100 | 58 | 85 | 78 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:02 | 雪雁 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:02 | 雪雁 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:03 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:03 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:08 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:09 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:09 | 雪雁 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:10 | 紫鹃 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:11 | 雪雁 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:15 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:15 | 紫鹃 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:30 | 雪雁 | 行动入队：💬 寒暄·黛玉 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI每日主动社交计数：黛玉 1/10 |  | ai:daily_social_count |
| 第01日 08:30 | 雪雁 | 开始互动：与黛玉「寒暄」 |  | interaction:started |
| 第01日 08:30 | 黛玉 | 被雪雁发起互动：「寒暄」 |  | interaction:started |
| 第01日 08:30 | 雪雁 | AI选择：寒暄·黛玉 [int:101:daiyu] provider=social routine=morning_hygiene |  | ai:decision |
| 第01日 08:31 | 雪雁 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:31 | 雪雁 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:41 | 雪雁 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:41 | 雪雁 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:45 | 黛玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 08:45 | 黛玉 | 开始用家具：竹榻 / default_use |  | furniture:use_started |
| 第01日 08:45 | 黛玉 | AI选择：竹榻·使用竹榻 [furn:1009:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:45 | 雪雁 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:47 | 黛玉 | 完成用家具：竹榻 / default_use |  | furniture:complete |
| 第01日 09:00 | 紫鹃 | 行动入队：🤝 凝眸·黛玉 |  | queue:add |
| 第01日 09:00 | 紫鹃 | AI选择：凝眸·黛玉 [int:501:daiyu] provider=social |  | ai:decision |
| 第01日 09:00 | 雪雁 | 行动入队：🤝 比腕·紫鹃 |  | queue:add |
| 第01日 09:00 | 雪雁 | AI选择：比腕·紫鹃 [int:733:zijuan] provider=social |  | ai:decision |
| 第01日 09:01 | 雪雁 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第01日 09:01 | 雪雁 | 开始互动：与紫鹃「比腕」 |  | interaction:started |
| 第01日 09:01 | 紫鹃 | 被雪雁发起互动：「比腕」 |  | interaction:started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 190 |
| ai:state | 96 |
| time:tick | 61 |
| queue:add | 49 |
| ai:decision | 49 |
| state:add | 43 |
| need:band_changed | 43 |
| quest:candidate | 36 |
| character:effect | 34 |
| furniture:use_started | 34 |
| furniture:released | 34 |
| furniture:complete | 27 |
| ai:routine_completed | 25 |
| quest:progress | 21 |
| state:remove | 20 |
| scene:enter:allowed | 16 |
| scene:entered | 16 |
| furniture:reaction | 11 |
| ai:daily_social_count | 11 |
| interaction:started | 11 |
| relation:axis_change | 11 |
| quest:blocked | 5 |
| interaction:effects | 5 |
| ai:social_target_cooldown | 5 |
| interaction:complete | 5 |
| servant:follow_state | 4 |
| quest:started | 4 |
| need:combination_triggered | 4 |
| reputation_domain:change | 3 |
| quest:issued | 2 |
| quest:accepted | 2 |
| relation:change | 2 |
| interaction:awkward_started | 1 |
| interaction:awkward_ended | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
| emotion:contagion | 1 |
| family:fund_changed | 1 |
| economy:quest_cost | 1 |
| time:hour | 1 |
