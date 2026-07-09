# 潇湘馆 7 天离线模拟日志

- 模拟对象：宝玉、袭人、晴雯、麝月
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：70002
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 晴雯 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 麝月 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 宝玉 | 18 | 2 | 3 | 4 | 3 | 0 |  08:03 作息完成：晨起梳洗 via=wardrobe； 08:03 开始用家具：梳洗妆台 / tidy_dress； 08:04 行动入队：🔥 备膳； 08:04 AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast； 08:16 作息完成：早餐 via=kitchen |
| 1 | 袭人 | 44 | 6 | 0 | 4 | 26 | 0 |  08:03 开始任务：晨起理妆； 08:15 行动入队：💬 闲谈·宝玉； 08:15 AI选择：闲谈·宝玉 [int:102:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002； 08:17 行动入队：前往怡红院； 08:17 AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |
| 1 | 晴雯 | 11 | 3 | 3 | 0 | 0 | 0 |  08:01 行动入队：🛁 在浴盆； 08:01 AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene； 08:03 作息完成：晨起梳洗 via=bath； 08:03 开始用家具：浴盆 / default_use； 08:08 行动入队：🍚 挑食抱怨 |
| 1 | 麝月 | 7 | 2 | 2 | 0 | 0 | 0 |  08:10 行动入队：👘 理妆整衣； 08:10 AI选择：梳洗妆台·理妆整衣 [furn:4007:tidy_dress] provider=furniture routine=morning_hygiene； 08:15 作息完成：晨起梳洗 via=wardrobe； 08:15 开始用家具：梳洗妆台 / tidy_dress； 08:20 完成用家具：梳洗妆台 / tidy_dress |
| 2 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 2 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 3 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 4 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 5 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 6 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 宝玉 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 袭人 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 晴雯 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| 7 | 麝月 | 0 | 0 | 0 | 0 | 0 | 0 |  |

## 最终状态

| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |
|---|---:|---|---|---|---:|---:|---:|---:|---:|
| 宝玉 | 4 | PAUSED | 闲庭漫步 |  | 97 | 69 | 58 | 100 | 81 |
| 袭人 | 4 | EXECUTING | 去找宝玉·寒暄 | 💬 寒暄·宝玉 | 69 | 80 | 67 | 100 | 87 |
| 晴雯 | 4 | EXECUTING | 行走中 | 🍶 在酒案 | 79 | 103 | 56 | 85 | 75 |
| 麝月 | 4 | EXECUTING | 去找宝玉·对酌 | 🤝 对酌·宝玉 | 68 | 110 | 65 | 85 | 75 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 晴雯 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:01 | 晴雯 | AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:03 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:03 | 袭人 | 任务进度：晨起理妆 1/20 |  | quest:progress |
| 第01日 08:03 | 宝玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:03 | 宝玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:03 | 晴雯 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:03 | 晴雯 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:04 | 袭人 | 任务进度：晨起理妆 2/20 |  | quest:progress |
| 第01日 08:04 | 宝玉 | 行动入队：🔥 备膳 |  | queue:add |
| 第01日 08:04 | 宝玉 | AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:05 | 袭人 | 任务进度：晨起理妆 3/20 |  | quest:progress |
| 第01日 08:06 | 袭人 | 任务进度：晨起理妆 4/20 |  | quest:progress |
| 第01日 08:07 | 袭人 | 任务进度：晨起理妆 5/20 |  | quest:progress |
| 第01日 08:08 | 袭人 | 任务进度：晨起理妆 6/20 |  | quest:progress |
| 第01日 08:08 | 晴雯 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:08 | 晴雯 | AI选择：饭桌·挑食抱怨 [furn:4006:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:09 | 袭人 | 任务进度：晨起理妆 7/20 |  | quest:progress |
| 第01日 08:10 | 麝月 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:10 | 麝月 | AI选择：梳洗妆台·理妆整衣 [furn:4007:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:15 | 袭人 | 行动入队：💬 闲谈·宝玉 |  | queue:add |
| 第01日 08:15 | 袭人 | AI选择：闲谈·宝玉 [int:102:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:15 | 麝月 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:15 | 麝月 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:16 | 宝玉 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:16 | 宝玉 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |
| 第01日 08:17 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:17 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:18 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:18 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:20 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:20 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:20 | 晴雯 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:20 | 晴雯 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:20 | 麝月 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:21 | 宝玉 | 完成用家具：厨房灶台 / prepare_meal |  | furniture:complete |
| 第01日 08:22 | 晴雯 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:23 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:23 | 袭人 | 任务进度：晨起理妆 8/20 |  | quest:progress |
| 第01日 08:24 | 袭人 | 任务进度：晨起理妆 9/20 |  | quest:progress |
| 第01日 08:25 | 袭人 | 任务进度：晨起理妆 10/20 |  | quest:progress |
| 第01日 08:26 | 袭人 | 任务进度：晨起理妆 11/20 |  | quest:progress |
| 第01日 08:27 | 袭人 | 任务进度：晨起理妆 12/20 |  | quest:progress |
| 第01日 08:28 | 袭人 | 任务进度：晨起理妆 13/20 |  | quest:progress |
| 第01日 08:29 | 袭人 | 任务进度：晨起理妆 14/20 |  | quest:progress |
| 第01日 08:30 | 袭人 | 任务进度：晨起理妆 15/20 |  | quest:progress |
| 第01日 08:31 | 袭人 | 任务进度：晨起理妆 16/20 |  | quest:progress |
| 第01日 08:32 | 袭人 | 任务进度：晨起理妆 17/20 |  | quest:progress |
| 第01日 08:33 | 袭人 | 任务进度：晨起理妆 18/20 |  | quest:progress |
| 第01日 08:34 | 袭人 | 任务进度：晨起理妆 19/20 |  | quest:progress |
| 第01日 08:35 | 袭人 | 任务进度：晨起理妆 20/20 |  | quest:progress |
| 第01日 08:35 | 袭人 | 完成任务：晨起理妆 |  | quest:completed |
| 第01日 08:45 | 宝玉 | 行动入队：💬 揭短·袭人 |  | queue:add |
| 第01日 08:45 | 宝玉 | AI选择：揭短·袭人 [int:303:xiren] provider=social |  | ai:decision |
| 第01日 08:45 | 宝玉 | AI每日主动社交计数：袭人 1/10 |  | ai:daily_social_count |
| 第01日 08:45 | 宝玉 | 开始互动：与袭人「揭短」 |  | interaction:started |
| 第01日 08:45 | 袭人 | 被宝玉发起互动：「揭短」 |  | interaction:started |
| 第01日 08:52 | 宝玉 | AI目标频控：袭人 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:52 | 宝玉 | 完成互动：与袭人「揭短」 |  | interaction:complete |
| 第01日 08:52 | 袭人 | 被宝玉完成互动：「揭短」 |  | interaction:complete |
| 第01日 09:00 | 袭人 | 任务下发：晨昏定省 | 宝玉 | quest:issued |
| 第01日 09:00 | 宝玉 | 下发任务给袭人：晨昏定省 | 宝玉 | quest:issued |
| 第01日 09:00 | 袭人 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 09:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 09:00 | 袭人 | 行动入队：💬 闲谈·宝玉 |  | queue:add |
| 第01日 09:00 | 袭人 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 09:00 | 袭人 | 开始互动：与宝玉「闲谈」 |  | interaction:started |
| 第01日 09:00 | 宝玉 | 被袭人发起互动：「闲谈」 |  | interaction:started |
| 第01日 09:00 | 袭人 | AI选择：闲谈·宝玉 [int:102:baoyu] provider=social |  | ai:decision |
| 第01日 09:00 | 晴雯 | 行动入队：🍶 在酒案 |  | queue:add |
| 第01日 09:00 | 晴雯 | AI选择：酒案·使用酒案 [furn:4004:default_use] provider=furniture routine=skill-routine_study-18 |  | ai:decision |
| 第01日 09:00 | 麝月 | 行动入队：🤝 对酌·宝玉 |  | queue:add |
| 第01日 09:00 | 麝月 | AI选择：对酌·宝玉 [int:105:baoyu] provider=social |  | ai:decision |
| 第01日 09:01 | 袭人 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第01日 09:01 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第01日 09:01 | 袭人 | 行动入队：💬 寒暄·宝玉 |  | queue:add |
| 第01日 09:01 | 袭人 | AI每日主动社交计数：宝玉 2/10 |  | ai:daily_social_count |
| 第01日 09:01 | 袭人 | 开始互动：与宝玉「寒暄」 |  | interaction:started |
| 第01日 09:01 | 宝玉 | 被袭人发起互动：「寒暄」 |  | interaction:started |
| 第01日 09:01 | 袭人 | AI选择：晨昏定省·宝玉 [quest-interact:4:101:baoyu] provider=quest |  | ai:decision |

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
