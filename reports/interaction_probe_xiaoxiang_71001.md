# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：71001
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 未发现高频任务失败或行动受阻。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 8 | 1 | 2 | 3 | 0 | 0 |  08:01 行动入队：👘 理妆整衣； 08:01 AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene； 08:01 被紫鹃发起互动：「陪伴」； 08:19 被紫鹃完成互动：「陪伴」； 08:22 作息完成：晨起梳洗 via=wardrobe |
| 1 | 紫鹃 | 5 | 0 | 0 | 2 | 0 | 0 |  08:01 AI每日主动社交计数：黛玉 1/10； 08:01 作息完成：随侍黛玉 via=weijie； 08:01 开始互动：与黛玉「陪伴」； 08:19 AI目标频控：黛玉 75分钟； 08:19 完成互动：与黛玉「陪伴」 |
| 1 | 雪雁 | 11 | 2 | 3 | 1 | 0 | 0 |  08:09 作息完成：早餐 via=meal； 08:09 开始用家具：饭桌 / complain_food； 08:11 完成用家具：饭桌 / complain_food； 08:30 行动入队：💬 闲谈·黛玉； 08:30 AI每日主动社交计数：黛玉 1/10 |
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
| 黛玉 | 1 | IDLE | 闲庭漫步 |  | 60 | 100 | 47 | 100 | 87 |
| 紫鹃 | 1 | IDLE | 闲庭漫步 |  | 67 | 76 | 61 | 100 | 87 |
| 雪雁 | 1 | EXECUTING | 理妆整衣… | 👘 理妆整衣 | 81 | 74 | 59 | 85 | 75 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 黛玉 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:01 | 黛玉 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:01 | 紫鹃 | AI每日主动社交计数：黛玉 1/10 |  | ai:daily_social_count |
| 第01日 08:01 | 紫鹃 | 作息完成：随侍黛玉 via=weijie |  | ai:routine_completed |
| 第01日 08:01 | 紫鹃 | 开始互动：与黛玉「陪伴」 |  | interaction:started |
| 第01日 08:01 | 黛玉 | 被紫鹃发起互动：「陪伴」 |  | interaction:started |
| 第01日 08:09 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:09 | 雪雁 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:11 | 雪雁 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:19 | 紫鹃 | AI目标频控：黛玉 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:19 | 紫鹃 | 完成互动：与黛玉「陪伴」 |  | interaction:complete |
| 第01日 08:19 | 黛玉 | 被紫鹃完成互动：「陪伴」 |  | interaction:complete |
| 第01日 08:22 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:22 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:27 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:30 | 雪雁 | 行动入队：💬 闲谈·黛玉 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI每日主动社交计数：黛玉 1/10 |  | ai:daily_social_count |
| 第01日 08:30 | 雪雁 | 开始互动：与黛玉「闲谈」 |  | interaction:started |
| 第01日 08:30 | 黛玉 | 被雪雁发起互动：「闲谈」 |  | interaction:started |
| 第01日 08:30 | 雪雁 | AI选择：闲谈·黛玉 [int:102:daiyu] provider=social routine=morning_hygiene |  | ai:decision |
| 第01日 08:31 | 雪雁 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:31 | 雪雁 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:31 | 雪雁 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:31 | 雪雁 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 123 |
| ai:state | 51 |
| quest:candidate | 33 |
| time:tick | 31 |
| queue:add | 30 |
| ai:decision | 30 |
| state:add | 23 |
| character:effect | 23 |
| ai:routine_completed | 21 |
| furniture:use_started | 21 |
| furniture:released | 20 |
| need:band_changed | 19 |
| scene:enter:allowed | 17 |
| scene:entered | 17 |
| relation:axis_change | 12 |
| furniture:complete | 11 |
| ai:daily_social_count | 7 |
| interaction:started | 7 |
| relation:change | 6 |
| interaction:effects | 5 |
| ai:social_target_cooldown | 5 |
| interaction:complete | 5 |
| quest:blocked | 4 |
| furniture:reaction | 4 |
| state:remove | 4 |
| emotion:resisted | 3 |
| emotion:contagion | 3 |
| observer:triggered | 2 |
| observer:executed | 2 |
| memory:add | 2 |
| quest:issued | 1 |
| quest:accepted | 1 |
| servant:follow_state | 1 |
| quest:started | 1 |
| quest:progress | 1 |
| trait:competition | 1 |
| sulk | 1 |
