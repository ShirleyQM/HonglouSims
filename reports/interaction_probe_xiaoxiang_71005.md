# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：71005
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 黛玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 紫鹃 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 雪雁 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 5 | 1 | 2 | 0 | 0 | 0 |  08:04 作息完成：晨起梳洗 via=wardrobe； 08:04 开始用家具：梳洗妆台 / tidy_dress； 08:09 完成用家具：梳洗妆台 / tidy_dress； 08:15 行动入队：💬 辩理·雪雁； 08:15 AI选择：辩理·雪雁 [int:201:xueyan] provider=social routine=breakfast |
| 1 | 紫鹃 | 6 | 1 | 4 | 0 | 0 | 0 |  08:07 开始用家具：浴盆 / default_use； 08:11 完成用家具：浴盆 / default_use； 08:15 行动入队：🍚 挑食抱怨； 08:15 AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture； 08:19 开始用家具：饭桌 / complain_food |
| 1 | 雪雁 | 11 | 3 | 3 | 0 | 0 | 0 |  08:10 行动入队：👘 理妆整衣； 08:10 AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene； 08:11 作息完成：晨起梳洗 via=wardrobe； 08:11 开始用家具：梳洗妆台 / tidy_dress； 08:16 完成用家具：梳洗妆台 / tidy_dress |
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
| 黛玉 | 1 | IDLE | 闲庭漫步 |  | 60 | 100 | 47 | 85 | 65 |
| 紫鹃 | 1 | IDLE | 闲庭漫步 |  | 84 | 110 | 61 | 85 | 78 |
| 雪雁 | 1 | EXECUTING | 行走中 | 🛏️ 在雕花木床 | 64 | 100 | 59 | 85 | 75 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:04 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:04 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:07 | 紫鹃 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:09 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:10 | 雪雁 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:10 | 雪雁 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:11 | 紫鹃 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:11 | 雪雁 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:11 | 雪雁 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:15 | 黛玉 | 行动入队：💬 辩理·雪雁 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：辩理·雪雁 [int:201:xueyan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:15 | 紫鹃 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:15 | 紫鹃 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture |  | ai:decision |
| 第01日 08:16 | 雪雁 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:19 | 紫鹃 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:21 | 紫鹃 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:30 | 雪雁 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:30 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:30 | 雪雁 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:30 | 雪雁 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:31 | 雪雁 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 08:31 | 雪雁 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 110 |
| quest:candidate | 53 |
| ai:state | 37 |
| time:tick | 31 |
| queue:add | 28 |
| ai:decision | 28 |
| furniture:use_started | 23 |
| furniture:released | 22 |
| ai:routine_completed | 21 |
| quest:progress | 20 |
| need:band_changed | 19 |
| character:effect | 18 |
| state:add | 16 |
| scene:enter:allowed | 16 |
| scene:entered | 16 |
| furniture:complete | 14 |
| furniture:reaction | 9 |
| quest:blocked | 3 |
| relation:axis_change | 3 |
| reputation_domain:change | 3 |
| servant:follow_state | 2 |
| ai:daily_social_count | 2 |
| interaction:started | 2 |
| quest:issued | 1 |
| quest:accepted | 1 |
| quest:started | 1 |
| interaction:awkward_started | 1 |
| state:remove | 1 |
| relation:change | 1 |
| interaction:effects | 1 |
| ai:social_target_cooldown | 1 |
| interaction:complete | 1 |
| interaction:awkward_ended | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
