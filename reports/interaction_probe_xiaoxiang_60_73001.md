# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：73001
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 黛玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 紫鹃 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 16 | 4 | 3 | 0 | 0 | 0 |  08:04 作息完成：晨起梳洗 via=wardrobe； 08:04 开始用家具：梳洗妆台 / tidy_dress； 08:09 完成用家具：梳洗妆台 / tidy_dress； 08:15 行动入队：🤝 对弈·雪雁； 08:15 AI选择：对弈·雪雁 [int:202:xueyan] provider=social routine=breakfast |
| 1 | 紫鹃 | 11 | 2 | 3 | 0 | 0 | 0 |  08:07 开始用家具：浴盆 / default_use； 08:11 完成用家具：浴盆 / default_use； 08:15 行动入队：🤝 拍背·黛玉； 08:15 AI选择：拍背·黛玉 [int:721:daiyu] provider=social routine=followRotation:follow:daiyu:zijuan:day_follow:1:3005； 08:22 关系轴变化：affection 61.99→47.27（-14.72） · 逾矩败露 |
| 1 | 雪雁 | 13 | 2 | 4 | 2 | 0 | 0 |  08:09 作息完成：早餐 via=meal； 08:09 开始用家具：饭桌 / eat_alone； 08:13 完成用家具：饭桌 / eat_alone； 08:30 行动入队：👘 理妆整衣； 08:30 AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |
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
| 黛玉 | 1 | EXECUTING | 翻旧例… | 📚 翻旧例 | 59 | 99 | 44 | 85 | 24 |
| 紫鹃 | 1 | EXECUTING | 挑食抱怨… | 🍚 挑食抱怨 | 74 | 110 | 60 | 85 | 47 |
| 雪雁 | 1 | EXECUTING | 去找黛玉·拍背 | 🤝 拍背·黛玉 | 106 | 100 | 58 | 100 | 78 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:04 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:04 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:07 | 紫鹃 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:09 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:09 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:09 | 雪雁 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 08:11 | 紫鹃 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:13 | 雪雁 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 08:15 | 黛玉 | 行动入队：🤝 对弈·雪雁 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：对弈·雪雁 [int:202:xueyan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:15 | 紫鹃 | 行动入队：🤝 拍背·黛玉 |  | queue:add |
| 第01日 08:15 | 紫鹃 | AI选择：拍背·黛玉 [int:721:daiyu] provider=social routine=followRotation:follow:daiyu:zijuan:day_follow:1:3005 |  | ai:decision |
| 第01日 08:16 | 黛玉 | 行动入队：🪑 静坐复盘 |  | queue:add |
| 第01日 08:16 | 黛玉 | AI选择：石凳·静坐复盘 [furn:3004:rest_and_review] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:22 | 紫鹃 | 关系轴变化：affection 61.99→47.27（-14.72） · 逾矩败露 | interaction-risk:721 | relation:axis_change |
| 第01日 08:22 | 黛玉 | 关系轴变化：affection 61.99→47.27（-14.72） · 逾矩败露 | interaction-risk:721 | relation:axis_change |
| 第01日 08:22 | 紫鹃 | 综合关系变化：52→45（好友/亲密） | interaction-risk:721 | relation:change |
| 第01日 08:22 | 黛玉 | 综合关系变化：52→45（好友/亲密） | interaction-risk:721 | relation:change |
| 第01日 08:22 | 紫鹃 | 关系轴变化：trust 50→38.5（-11.5） · 逾矩败露 | interaction-risk:721 | relation:axis_change |
| 第01日 08:22 | 黛玉 | 关系轴变化：trust 50→38.5（-11.5） · 逾矩败露 | interaction-risk:721 | relation:axis_change |
| 第01日 08:22 | 紫鹃 | 综合关系变化：45→41（好友/亲密） | interaction-risk:721 | relation:change |
| 第01日 08:22 | 黛玉 | 综合关系变化：45→41（好友/亲密） | interaction-risk:721 | relation:change |
| 第01日 08:30 | 雪雁 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:31 | 雪雁 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:31 | 雪雁 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:32 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 08:32 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:35 | 雪雁 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:40 | 黛玉 | 行动入队：📚 翻旧例 |  | queue:add |
| 第01日 08:40 | 黛玉 | AI选择：红木书案·翻旧例 [furn:1002:read_ritual_cases] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:51 | 雪雁 | 被刘姥姥发起互动：「寒暄」 |  | interaction:started |
| 第01日 08:55 | 黛玉 | 开始用家具：红木书案 / read_ritual_cases |  | furniture:use_started |
| 第01日 08:58 | 雪雁 | 关系轴变化：affection 0→2.6（+2.6） | relation | relation:axis_change |
| 第01日 08:58 | 雪雁 | 被刘姥姥完成互动：「寒暄」 |  | interaction:complete |
| 第01日 09:00 | 紫鹃 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 09:00 | 紫鹃 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 09:00 | 紫鹃 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture |  | ai:decision |
| 第01日 09:00 | 雪雁 | 行动入队：🤝 拍背·黛玉 |  | queue:add |
| 第01日 09:00 | 雪雁 | AI选择：拍背·黛玉 [int:721:daiyu] provider=social |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 216 |
| ai:state | 115 |
| quest:candidate | 76 |
| time:tick | 61 |
| character:effect | 51 |
| need:band_changed | 50 |
| state:add | 49 |
| queue:add | 49 |
| ai:decision | 49 |
| furniture:use_started | 30 |
| scene:enter:allowed | 30 |
| scene:entered | 30 |
| furniture:released | 28 |
| ai:routine_completed | 27 |
| furniture:complete | 23 |
| relation:axis_change | 23 |
| quest:progress | 22 |
| state:remove | 19 |
| ai:daily_social_count | 15 |
| interaction:started | 15 |
| interaction:effects | 10 |
| ai:social_target_cooldown | 10 |
| interaction:complete | 10 |
| relation:change | 7 |
| furniture:reaction | 6 |
| quest:blocked | 5 |
| quest:issued | 4 |
| quest:accepted | 4 |
| reputation_domain:change | 3 |
| servant:follow_state | 2 |
| quest:started | 2 |
| interaction:awkward_started | 2 |
| quest:completed | 2 |
| interaction:state | 2 |
| emotion:resisted | 2 |
| lifePath:storyNode | 2 |
| reputation:change | 1 |
| interaction:risky_fail | 1 |
| observer:triggered | 1 |
| observer:executed | 1 |
| need:critical | 1 |
| interaction:awkward_ended | 1 |
| trait:competition | 1 |
| invitation:sent | 1 |
| access:granted | 1 |
| invitation:declined | 1 |
| need:combination_triggered | 1 |
| family:fund_changed | 1 |
| economy:quest_cost | 1 |
| time:hour | 1 |
| money:change | 1 |
