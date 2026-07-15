# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：71003
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 雪雁 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 11 | 2 | 2 | 2 | 0 | 0 |  08:01 行动入队：👘 理妆整衣； 08:01 AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene； 08:04 作息完成：晨起梳洗 via=wardrobe； 08:04 开始用家具：梳洗妆台 / tidy_dress； 08:09 完成用家具：梳洗妆台 / tidy_dress |
| 1 | 紫鹃 | 4 | 0 | 2 | 2 | 0 | 0 |  08:04 开始用家具：饭桌 / eat_alone； 08:08 完成用家具：饭桌 / eat_alone； 08:15 被黛玉发起互动：「论禅」； 08:21 被黛玉完成互动：「论禅」 |
| 1 | 雪雁 | 9 | 2 | 3 | 0 | 0 | 0 |  08:09 作息完成：晨起梳洗 via=bath； 08:09 开始用家具：浴盆 / default_use； 08:10 行动入队：🍚 独自用膳； 08:10 AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture routine=breakfast； 08:14 作息完成：早餐 via=meal |
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
| 黛玉 | 1 | IDLE | 闲庭漫步 |  | 60 | 100 | 47 | 100 | 81 |
| 紫鹃 | 1 | IDLE | 话毕 |  | 99 | 76 | 61 | 100 | 81 |
| 雪雁 | 1 | EXECUTING | 去找黛玉·寒暄 | 💬 寒暄·黛玉 | 108 | 74 | 59 | 85 | 80 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 黛玉 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:01 | 黛玉 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:04 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:04 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:04 | 紫鹃 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 08:08 | 紫鹃 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 08:09 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:09 | 雪雁 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:09 | 雪雁 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:10 | 雪雁 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第01日 08:10 | 雪雁 | AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:14 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:14 | 雪雁 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 08:15 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第01日 08:15 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第01日 08:15 | 紫鹃 | 被黛玉发起互动：「论禅」 |  | interaction:started |
| 第01日 08:15 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:17 | 雪雁 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 08:21 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:21 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第01日 08:21 | 紫鹃 | 被黛玉完成互动：「论禅」 |  | interaction:complete |
| 第01日 08:30 | 雪雁 | 行动入队：💬 寒暄·黛玉 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI选择：寒暄·黛玉 [int:101:daiyu] provider=social |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 117 |
| ai:state | 43 |
| quest:candidate | 37 |
| time:tick | 31 |
| queue:add | 26 |
| ai:decision | 26 |
| need:band_changed | 26 |
| furniture:use_started | 25 |
| state:add | 24 |
| character:effect | 24 |
| ai:routine_completed | 22 |
| furniture:released | 22 |
| quest:progress | 17 |
| furniture:complete | 15 |
| scene:enter:allowed | 14 |
| scene:entered | 14 |
| furniture:reaction | 6 |
| relation:axis_change | 6 |
| emotion:resisted | 5 |
| quest:blocked | 4 |
| servant:follow_state | 4 |
| ai:daily_social_count | 4 |
| interaction:started | 4 |
| interaction:effects | 3 |
| ai:social_target_cooldown | 3 |
| interaction:complete | 3 |
| state:remove | 3 |
| quest:started | 2 |
| relation:change | 2 |
| emotion:contagion | 2 |
| quest:issued | 1 |
| quest:accepted | 1 |
| observer:triggered | 1 |
| observer:executed | 1 |
| trait:competition | 1 |
