# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 4 日 00:00 前
- 随机种子：71303
- 时间步长：5s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 紫鹃 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 黛玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 雪雁 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 21 | 5 | 3 | 0 | 2 | 0 |  08:24 作息完成：晨起梳洗 via=wardrobe； 08:24 开始用家具：梳洗妆台 / tidy_dress； 08:30 完成用家具：梳洗妆台 / tidy_dress； 08:45 行动入队：🎵 弹错走调； 08:45 AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture routine=breakfast |
| 1 | 紫鹃 | 12 | 2 | 2 | 0 | 2 | 0 |  08:04 行动入队：🛁 在浴盆； 08:04 AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture； 08:36 开始用家具：浴盆 / default_use； 08:42 完成用家具：浴盆 / default_use； 09:00 行动入队：🤝 陪伴·黛玉 |
| 1 | 雪雁 | 8 | 2 | 3 | 0 | 0 | 0 |  08:54 作息完成：早餐 via=meal； 08:54 开始用家具：饭桌 / complain_food； 08:55 行动入队：👘 理妆整衣； 08:55 AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene； 09:00 开始用家具：梳洗妆台 / tidy_dress |
| 2 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 黛玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 紫鹃 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 雪雁 | 0 | 0 | 0 | 0 | 0 | 0 |  |

## 最终状态

| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |
|---|---:|---|---|---|---:|---:|---:|---:|---:|
| 黛玉 | 1 | EXECUTING | 翻旧例… | 📚 翻旧例 | 56 | 99 | 38 | 85 | 34 |
| 紫鹃 | 1 | IDLE | 闲庭漫步 |  | 63 | 110 | 59 | 85 | 47 |
| 雪雁 | 1 | EXECUTING | 去找黛玉·倾诉 | 💬 倾诉·黛玉 | 60 | 100 | 56 | 85 | 75 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:04 | 紫鹃 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:04 | 紫鹃 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture |  | ai:decision |
| 第01日 08:24 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:24 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:30 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:36 | 紫鹃 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:42 | 紫鹃 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:45 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 08:45 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:46 | 黛玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 08:46 | 黛玉 | AI选择：竹榻·使用竹榻 [furn:1009:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:54 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:54 | 雪雁 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:55 | 雪雁 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:55 | 雪雁 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 09:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 09:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture routine=skill-routine_study-18 |  | ai:decision |
| 第01日 09:00 | 紫鹃 | 行动入队：🤝 陪伴·黛玉 |  | queue:add |
| 第01日 09:00 | 紫鹃 | AI选择：陪伴·黛玉 [int:403:daiyu] provider=social |  | ai:decision |
| 第01日 09:00 | 雪雁 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 09:06 | 雪雁 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 09:30 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 09:30 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture routine=skill-routine_study-18 |  | ai:decision |
| 第01日 09:42 | 紫鹃 | 关系轴变化：affection 61.93→47.21（-14.72） · 逾矩败露 | interaction-risk:403 | relation:axis_change |
| 第01日 09:42 | 黛玉 | 关系轴变化：affection 61.93→47.21（-14.72） · 逾矩败露 | interaction-risk:403 | relation:axis_change |
| 第01日 09:42 | 紫鹃 | 综合关系变化：52→45（好友/亲密） | interaction-risk:403 | relation:change |
| 第01日 09:42 | 黛玉 | 综合关系变化：52→45（好友/亲密） | interaction-risk:403 | relation:change |
| 第01日 09:42 | 紫鹃 | 关系轴变化：trust 49.98→38.48（-11.5） · 逾矩败露 | interaction-risk:403 | relation:axis_change |
| 第01日 09:42 | 黛玉 | 关系轴变化：trust 49.98→38.48（-11.5） · 逾矩败露 | interaction-risk:403 | relation:axis_change |
| 第01日 09:42 | 紫鹃 | 综合关系变化：45→41（好友/亲密） | interaction-risk:403 | relation:change |
| 第01日 09:42 | 黛玉 | 综合关系变化：45→41（好友/亲密） | interaction-risk:403 | relation:change |
| 第01日 09:45 | 雪雁 | 行动入队：💬 倾诉·黛玉 |  | queue:add |
| 第01日 09:45 | 雪雁 | AI选择：倾诉·黛玉 [int:405:daiyu] provider=social |  | ai:decision |
| 第01日 09:55 | 黛玉 | 行动入队：📚 翻旧例 |  | queue:add |
| 第01日 09:55 | 黛玉 | AI选择：红木书案·翻旧例 [furn:1002:read_ritual_cases] provider=furniture routine=skill-routine_study-18 |  | ai:decision |
| 第01日 10:00 | 紫鹃 | 任务下发：晨昏定省 | 黛玉 | quest:issued |
| 第01日 10:00 | 黛玉 | 下发任务给紫鹃：晨昏定省 | 黛玉 | quest:issued |
| 第01日 10:00 | 紫鹃 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第01日 10:00 | 黛玉 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第01日 10:00 | 黛玉 | 作息完成：读书 via=desk |  | ai:routine_completed |
| 第01日 10:00 | 黛玉 | 开始用家具：红木书案 / read_ritual_cases |  | furniture:use_started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| quest:candidate | 209 |
| log:add | 178 |
| time:tick | 120 |
| ai:state | 73 |
| queue:add | 51 |
| ai:decision | 51 |
| state:add | 48 |
| character:effect | 44 |
| need:band_changed | 44 |
| state:remove | 32 |
| furniture:use_started | 24 |
| skill:changed | 23 |
| quest:progress | 22 |
| furniture:released | 21 |
| furniture:complete | 15 |
| scene:enter:allowed | 15 |
| scene:entered | 15 |
| relation:axis_change | 15 |
| ai:routine_completed | 11 |
| ai:daily_social_count | 8 |
| interaction:started | 8 |
| furniture:reaction | 6 |
| quest:blocked | 5 |
| interaction:effects | 5 |
| ai:social_target_cooldown | 5 |
| interaction:complete | 5 |
| quest:issued | 3 |
| quest:accepted | 3 |
| quest:started | 3 |
| need:combination_triggered | 3 |
| relation:change | 3 |
| reputation_domain:change | 3 |
| servant:follow_state | 2 |
| family:fund_changed | 2 |
| economy:quest_cost | 2 |
| time:hour | 2 |
| quest:completed | 2 |
| invitation:expired | 2 |
| interaction:risky_fail | 1 |
| interaction:awkward_started | 1 |
| observer:triggered | 1 |
| observer:executed | 1 |
| interaction:awkward_ended | 1 |
| reputation:change | 1 |
| servant:relation_changed | 1 |
| sim:max_steps | 1 |
