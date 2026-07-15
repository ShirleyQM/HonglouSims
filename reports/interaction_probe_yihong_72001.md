# 潇湘馆 7 天离线模拟日志

- 模拟对象：宝玉、袭人、晴雯、麝月
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：72001
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
| 1 | 宝玉 | 9 | 1 | 3 | 2 | 0 | 0 |  08:07 作息完成：早餐 via=meal； 08:07 开始用家具：饭桌 / complain_food； 08:08 行动入队：🛁 在浴盆； 08:08 AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene； 08:15 作息完成：晨起梳洗 via=bath |
| 1 | 袭人 | 29 | 1 | 0 | 2 | 22 | 0 |  08:11 开始任务：晨起理妆； 08:15 行动入队：💬 寒暄·宝玉； 08:15 AI选择：寒暄·宝玉 [int:101:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002； 08:15 AI每日主动社交计数：宝玉 1/10； 08:15 作息完成：随侍左右 via=xujiu |
| 1 | 晴雯 | 7 | 1 | 3 | 0 | 0 | 0 |  08:03 作息完成：晨起梳洗 via=bath； 08:03 开始用家具：浴盆 / default_use； 08:04 行动入队：🍚 挑食抱怨； 08:04 AI选择：饭桌·挑食抱怨 [furn:4006:complain_food] provider=furniture routine=breakfast； 08:16 作息完成：早餐 via=meal |
| 1 | 麝月 | 7 | 1 | 3 | 0 | 0 | 0 |  08:08 作息完成：晨起梳洗 via=wardrobe； 08:08 开始用家具：梳洗妆台 / tidy_dress； 08:13 完成用家具：梳洗妆台 / tidy_dress； 08:15 行动入队：🔥 备膳； 08:15 AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |
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
| 宝玉 | 4 | IDLE | 话毕 |  | 66 | 100 | 59 | 100 | 82 |
| 袭人 | 4 | IDLE | 随侍宝玉 |  | 71 | 80 | 67 | 100 | 85 |
| 晴雯 | 4 | IDLE | 闲庭漫步 |  | 80 | 72 | 57 | 85 | 75 |
| 麝月 | 4 | EXECUTING | 备膳… | 🔥 备膳 | 100 | 110 | 65 | 85 | 75 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:03 | 晴雯 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:03 | 晴雯 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:04 | 晴雯 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:04 | 晴雯 | AI选择：饭桌·挑食抱怨 [furn:4006:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:07 | 宝玉 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:07 | 宝玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:08 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:08 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:08 | 麝月 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:08 | 麝月 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:11 | 袭人 | 开始任务：晨起理妆 |  | quest:started |
| 第01日 08:11 | 袭人 | 任务进度：晨起理妆 1/20 |  | quest:progress |
| 第01日 08:12 | 袭人 | 任务进度：晨起理妆 2/20 |  | quest:progress |
| 第01日 08:13 | 袭人 | 任务进度：晨起理妆 3/20 |  | quest:progress |
| 第01日 08:13 | 麝月 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:14 | 袭人 | 任务进度：晨起理妆 4/20 |  | quest:progress |
| 第01日 08:15 | 袭人 | 任务进度：晨起理妆 5/20 |  | quest:progress |
| 第01日 08:15 | 袭人 | 行动入队：💬 寒暄·宝玉 |  | queue:add |
| 第01日 08:15 | 袭人 | AI选择：寒暄·宝玉 [int:101:baoyu] provider=social routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:15 | 麝月 | 行动入队：🔥 备膳 |  | queue:add |
| 第01日 08:15 | 麝月 | AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:15 | 宝玉 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:15 | 宝玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:15 | 袭人 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 08:15 | 袭人 | 作息完成：随侍左右 via=xujiu |  | ai:routine_completed |
| 第01日 08:15 | 袭人 | 开始互动：与宝玉「寒暄」 |  | interaction:started |
| 第01日 08:15 | 宝玉 | 被袭人发起互动：「寒暄」 |  | interaction:started |
| 第01日 08:16 | 袭人 | 任务进度：晨起理妆 6/20 |  | quest:progress |
| 第01日 08:16 | 晴雯 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:16 | 晴雯 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:17 | 袭人 | 任务进度：晨起理妆 7/20 |  | quest:progress |
| 第01日 08:18 | 袭人 | 任务进度：晨起理妆 8/20 |  | quest:progress |
| 第01日 08:19 | 袭人 | 任务进度：晨起理妆 9/20 |  | quest:progress |
| 第01日 08:19 | 宝玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:19 | 晴雯 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:20 | 袭人 | 任务进度：晨起理妆 10/20 |  | quest:progress |
| 第01日 08:21 | 袭人 | 任务进度：晨起理妆 11/20 |  | quest:progress |
| 第01日 08:22 | 袭人 | 任务进度：晨起理妆 12/20 |  | quest:progress |
| 第01日 08:22 | 袭人 | AI目标频控：宝玉 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:22 | 袭人 | 完成互动：与宝玉「寒暄」 |  | interaction:complete |
| 第01日 08:22 | 宝玉 | 被袭人完成互动：「寒暄」 |  | interaction:complete |
| 第01日 08:23 | 袭人 | 任务进度：晨起理妆 13/20 |  | quest:progress |
| 第01日 08:24 | 袭人 | 任务进度：晨起理妆 14/20 |  | quest:progress |
| 第01日 08:25 | 袭人 | 任务进度：晨起理妆 15/20 |  | quest:progress |
| 第01日 08:26 | 袭人 | 任务进度：晨起理妆 16/20 |  | quest:progress |
| 第01日 08:27 | 袭人 | 任务进度：晨起理妆 17/20 |  | quest:progress |
| 第01日 08:27 | 麝月 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:27 | 麝月 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |
| 第01日 08:28 | 袭人 | 任务进度：晨起理妆 18/20 |  | quest:progress |
| 第01日 08:29 | 袭人 | 任务进度：晨起理妆 19/20 |  | quest:progress |
| 第01日 08:30 | 袭人 | 任务进度：晨起理妆 20/20 |  | quest:progress |
| 第01日 08:30 | 袭人 | 完成任务：晨起理妆 |  | quest:completed |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 107 |
| quest:candidate | 39 |
| ai:state | 39 |
| time:tick | 31 |
| queue:add | 26 |
| ai:decision | 26 |
| quest:progress | 21 |
| state:add | 20 |
| character:effect | 20 |
| need:band_changed | 20 |
| furniture:use_started | 18 |
| furniture:released | 18 |
| ai:routine_completed | 17 |
| scene:enter:allowed | 16 |
| scene:entered | 16 |
| furniture:complete | 10 |
| relation:axis_change | 5 |
| furniture:reaction | 4 |
| quest:blocked | 3 |
| ai:daily_social_count | 3 |
| interaction:started | 3 |
| reputation_domain:change | 3 |
| servant:follow_state | 2 |
| interaction:awkward_started | 2 |
| interaction:effects | 2 |
| ai:social_target_cooldown | 2 |
| interaction:complete | 2 |
| interaction:awkward_ended | 2 |
| quest:issued | 1 |
| quest:accepted | 1 |
| quest:started | 1 |
| state:remove | 1 |
| relation:change | 1 |
| quest:completed | 1 |
| reputation:change | 1 |
