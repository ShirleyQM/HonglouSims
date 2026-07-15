# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：73002
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 紫鹃 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 21 | 3 | 2 | 2 | 0 | 0 |  08:01 关系轴变化：affection 62→47.28（-14.72） · 逾矩败露； 08:01 综合关系变化：52→45（好友/亲密）； 08:01 关系轴变化：trust 50→38.5（-11.5） · 逾矩败露； 08:01 综合关系变化：45→41（好友/亲密）； 08:15 行动入队：👘 理妆整衣 |
| 1 | 紫鹃 | 12 | 3 | 2 | 0 | 0 | 0 |  08:01 关系轴变化：affection 62→47.28（-14.72） · 逾矩败露； 08:01 综合关系变化：52→45（好友/亲密）； 08:01 关系轴变化：trust 50→38.5（-11.5） · 逾矩败露； 08:01 综合关系变化：45→41（好友/亲密）； 08:15 行动入队：👘 理妆整衣 |
| 1 | 雪雁 | 21 | 3 | 3 | 2 | 0 | 0 |  08:11 作息完成：晨起梳洗 via=wardrobe； 08:11 开始用家具：梳洗妆台 / tidy_dress； 08:12 行动入队：🍚 独自用膳； 08:12 作息完成：早餐 via=meal； 08:12 开始用家具：饭桌 / eat_alone |
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
| 黛玉 | 1 | EXECUTING | 行走中 | 🛋️ 在竹榻 | 59 | 100 | 44 | 100 | 48 |
| 紫鹃 | 1 | EXECUTING | 去找黛玉·陪伴 | 🤝 陪伴·黛玉 | 65 | 110 | 60 | 85 | 47 |
| 雪雁 | 1 | EXECUTING | 去找紫鹃·调侃 | 💬 调侃·紫鹃 | 106 | 74 | 58 | 100 | 89 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 紫鹃 | 关系轴变化：affection 62→47.28（-14.72） · 逾矩败露 | interaction-risk:501 | relation:axis_change |
| 第01日 08:01 | 黛玉 | 关系轴变化：affection 62→47.28（-14.72） · 逾矩败露 | interaction-risk:501 | relation:axis_change |
| 第01日 08:01 | 紫鹃 | 综合关系变化：52→45（好友/亲密） | interaction-risk:501 | relation:change |
| 第01日 08:01 | 黛玉 | 综合关系变化：52→45（好友/亲密） | interaction-risk:501 | relation:change |
| 第01日 08:01 | 紫鹃 | 关系轴变化：trust 50→38.5（-11.5） · 逾矩败露 | interaction-risk:501 | relation:axis_change |
| 第01日 08:01 | 黛玉 | 关系轴变化：trust 50→38.5（-11.5） · 逾矩败露 | interaction-risk:501 | relation:axis_change |
| 第01日 08:01 | 紫鹃 | 综合关系变化：45→41（好友/亲密） | interaction-risk:501 | relation:change |
| 第01日 08:01 | 黛玉 | 综合关系变化：45→41（好友/亲密） | interaction-risk:501 | relation:change |
| 第01日 08:11 | 雪雁 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:11 | 雪雁 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:12 | 雪雁 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第01日 08:12 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:12 | 雪雁 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 08:12 | 雪雁 | AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:15 | 黛玉 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:15 | 紫鹃 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:15 | 紫鹃 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture |  | ai:decision |
| 第01日 08:15 | 雪雁 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 08:16 | 紫鹃 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:16 | 紫鹃 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture |  | ai:decision |
| 第01日 08:23 | 紫鹃 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:26 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:26 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:28 | 紫鹃 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:30 | 雪雁 | 行动入队：💬 安慰·黛玉 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI选择：安慰·黛玉 [int:402:daiyu] provider=social |  | ai:decision |
| 第01日 08:31 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:31 | 雪雁 | 关系轴变化：trust 36.99→33.74（-3.25） · 旁人目击 | interaction-risk:402 | relation:axis_change |
| 第01日 08:31 | 黛玉 | 关系轴变化：trust 36.99→33.74（-3.25） · 旁人目击 | interaction-risk:402 | relation:axis_change |
| 第01日 08:31 | 雪雁 | AI每日主动社交计数：黛玉 1/10 |  | ai:daily_social_count |
| 第01日 08:31 | 雪雁 | 开始互动：与黛玉「安慰」 |  | interaction:started |
| 第01日 08:31 | 黛玉 | 被雪雁发起互动：「安慰」 |  | interaction:started |
| 第01日 08:38 | 雪雁 | 关系轴变化：affection 45.97→49.18（+3.21） | relation | relation:axis_change |
| 第01日 08:38 | 黛玉 | 关系轴变化：affection 45.97→49.18（+3.21） | relation | relation:axis_change |
| 第01日 08:38 | 雪雁 | 综合关系变化：37→39（朋友/友好） | relation | relation:change |
| 第01日 08:38 | 黛玉 | 综合关系变化：37→39（朋友/友好） | relation | relation:change |
| 第01日 08:38 | 雪雁 | 关系轴变化：trust 33.74→40.91（+7.17） | relation | relation:axis_change |
| 第01日 08:38 | 黛玉 | 关系轴变化：trust 33.74→40.91（+7.17） | relation | relation:axis_change |
| 第01日 08:38 | 雪雁 | 综合关系变化：39→41（好友/亲密） | relation | relation:change |
| 第01日 08:38 | 黛玉 | 综合关系变化：39→41（好友/亲密） | relation | relation:change |
| 第01日 08:38 | 雪雁 | 关系轴变化：submission 60→57.09（-2.91） | relation | relation:axis_change |
| 第01日 08:38 | 黛玉 | 关系轴变化：submission 60→57.09（-2.91） | relation | relation:axis_change |
| 第01日 08:38 | 雪雁 | AI目标频控：黛玉 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:38 | 雪雁 | 完成互动：与黛玉「安慰」 |  | interaction:complete |
| 第01日 08:38 | 黛玉 | 被雪雁完成互动：「安慰」 |  | interaction:complete |
| 第01日 08:45 | 黛玉 | 行动入队：🪑 静坐复盘 |  | queue:add |
| 第01日 08:45 | 黛玉 | AI选择：石凳·静坐复盘 [furn:3005:rest_and_review] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:58 | 黛玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 08:58 | 黛玉 | AI选择：竹榻·使用竹榻 [furn:1009:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 09:00 | 紫鹃 | 行动入队：🤝 陪伴·黛玉 |  | queue:add |
| 第01日 09:00 | 紫鹃 | AI选择：陪伴·黛玉 [int:403:daiyu] provider=social |  | ai:decision |
| 第01日 09:00 | 雪雁 | 行动入队：💬 调侃·紫鹃 |  | queue:add |
| 第01日 09:00 | 雪雁 | AI选择：调侃·紫鹃 [int:302:zijuan] provider=social |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 177 |
| quest:candidate | 85 |
| ai:state | 84 |
| time:tick | 61 |
| queue:add | 49 |
| ai:decision | 49 |
| need:band_changed | 48 |
| state:add | 45 |
| character:effect | 34 |
| furniture:use_started | 28 |
| furniture:released | 28 |
| scene:enter:allowed | 23 |
| scene:entered | 23 |
| furniture:complete | 22 |
| quest:progress | 21 |
| ai:routine_completed | 20 |
| state:remove | 20 |
| relation:axis_change | 16 |
| furniture:reaction | 8 |
| ai:daily_social_count | 8 |
| interaction:started | 8 |
| relation:change | 5 |
| interaction:effects | 5 |
| ai:social_target_cooldown | 5 |
| interaction:complete | 5 |
| quest:blocked | 4 |
| servant:follow_state | 4 |
| quest:started | 3 |
| reputation_domain:change | 3 |
| quest:issued | 2 |
| quest:accepted | 2 |
| need:combination_triggered | 2 |
| interaction:risky_fail | 1 |
| interaction:awkward_started | 1 |
| interaction:awkward_ended | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
| family:fund_changed | 1 |
| economy:quest_cost | 1 |
| time:hour | 1 |
