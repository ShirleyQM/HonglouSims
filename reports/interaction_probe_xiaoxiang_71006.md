# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：71006
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 雪雁 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 黛玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 紫鹃 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 11 | 4 | 2 | 0 | 0 | 0 |  08:04 作息完成：晨起梳洗 via=wardrobe； 08:04 开始用家具：梳洗妆台 / tidy_dress； 08:09 完成用家具：梳洗妆台 / tidy_dress； 08:15 行动入队：🤝 对弈·紫鹃； 08:15 AI选择：对弈·紫鹃 [int:202:zijuan] provider=social routine=breakfast |
| 1 | 紫鹃 | 2 | 0 | 2 | 0 | 0 | 0 |  08:04 开始用家具：饭桌 / eat_alone； 08:08 完成用家具：饭桌 / eat_alone |
| 1 | 雪雁 | 7 | 2 | 2 | 0 | 0 | 0 |  08:01 行动入队：🍚 独自用膳； 08:01 AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture routine=breakfast； 08:10 作息完成：早餐 via=meal； 08:10 开始用家具：饭桌 / eat_alone； 08:14 完成用家具：饭桌 / eat_alone |
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
| 黛玉 | 1 | EXECUTING | 行走中 | 📚 翻旧例 | 60 | 100 | 47 | 85 | 44 |
| 紫鹃 | 1 | IDLE | 神色尴尬 |  | 99 | 76 | 61 | 85 | 34 |
| 雪雁 | 1 | EXECUTING | 行走中 | 🛁 在浴盆 | 108 | 74 | 59 | 85 | 75 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 雪雁 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第01日 08:01 | 雪雁 | AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:04 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:04 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:04 | 紫鹃 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 08:08 | 紫鹃 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 08:09 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:10 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:10 | 雪雁 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 08:14 | 雪雁 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 08:15 | 黛玉 | 行动入队：🤝 对弈·紫鹃 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：对弈·紫鹃 [int:202:zijuan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:16 | 黛玉 | 行动入队：🪑 静坐复盘 |  | queue:add |
| 第01日 08:16 | 黛玉 | AI选择：石凳·静坐复盘 [furn:3004:rest_and_review] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:24 | 黛玉 | 行动入队：♟ 对弈练习 |  | queue:add |
| 第01日 08:24 | 黛玉 | AI选择：棋桌·对弈练习 [furn:3012:practice_chess] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:29 | 黛玉 | 行动入队：📚 翻旧例 |  | queue:add |
| 第01日 08:29 | 黛玉 | AI选择：红木书案·翻旧例 [furn:1002:read_ritual_cases] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:30 | 雪雁 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 117 |
| ai:state | 44 |
| time:tick | 31 |
| queue:add | 30 |
| ai:decision | 30 |
| character:effect | 26 |
| state:add | 21 |
| quest:candidate | 21 |
| quest:progress | 21 |
| furniture:released | 20 |
| furniture:use_started | 20 |
| need:band_changed | 20 |
| scene:enter:allowed | 18 |
| scene:entered | 18 |
| ai:routine_completed | 17 |
| furniture:complete | 14 |
| furniture:reaction | 9 |
| relation:axis_change | 9 |
| quest:blocked | 6 |
| servant:follow_state | 6 |
| ai:daily_social_count | 4 |
| interaction:started | 4 |
| quest:started | 3 |
| relation:change | 3 |
| interaction:effects | 3 |
| ai:social_target_cooldown | 3 |
| interaction:complete | 3 |
| reputation_domain:change | 3 |
| quest:issued | 1 |
| quest:accepted | 1 |
| interaction:risky_fail | 1 |
| interaction:awkward_started | 1 |
| state:remove | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
