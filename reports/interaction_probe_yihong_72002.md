# 潇湘馆 7 天离线模拟日志

- 模拟对象：宝玉、袭人、晴雯、麝月
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：72002
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 袭人 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 麝月 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 晴雯 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。
- 第1日 宝玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 宝玉 | 4 | 1 | 1 | 0 | 0 | 0 |  08:11 作息完成：早餐 via=kitchen； 08:11 开始用家具：厨房灶台 / prepare_meal； 08:13 行动入队：🛁 在浴盆； 08:13 AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture routine=morning_hygiene |
| 1 | 袭人 | 10 | 5 | 0 | 0 | 0 | 0 |  08:01 行动入队：前往怡红院； 08:01 AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002； 08:15 行动入队：前往怡红院； 08:15 AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002； 08:16 行动入队：前往怡红院 |
| 1 | 晴雯 | 7 | 1 | 3 | 0 | 0 | 0 |  08:05 作息完成：晨起梳洗 via=wardrobe； 08:05 开始用家具：梳洗妆台 / tidy_dress； 08:06 行动入队：🍚 挑食抱怨； 08:06 AI选择：饭桌·挑食抱怨 [furn:4006:complain_food] provider=furniture routine=breakfast； 08:15 作息完成：早餐 via=meal |
| 1 | 麝月 | 9 | 2 | 3 | 0 | 0 | 0 |  08:01 行动入队：🛁 在浴盆； 08:01 AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene； 08:08 作息完成：晨起梳洗 via=bath； 08:08 开始用家具：浴盆 / default_use； 08:13 完成用家具：浴盆 / default_use |
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
| 宝玉 | 11 | EXECUTING | 行走中 | 🛁 在浴盆 | 66 | 70 | 59 | 85 | 75 |
| 袭人 | 4 | IDLE | 靠近宝玉 |  | 71 | 80 | 67 | 85 | 75 |
| 晴雯 | 4 | IDLE | 闲庭漫步 |  | 80 | 72 | 57 | 85 | 75 |
| 麝月 | 4 | EXECUTING | 备膳… | 🔥 备膳 | 100 | 110 | 65 | 85 | 78 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:01 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:01 | 麝月 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:01 | 麝月 | AI选择：浴盆·使用浴盆 [furn:4005:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:05 | 晴雯 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:05 | 晴雯 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:06 | 晴雯 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:06 | 晴雯 | AI选择：饭桌·挑食抱怨 [furn:4006:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:08 | 麝月 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:08 | 麝月 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:11 | 宝玉 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:11 | 宝玉 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |
| 第01日 08:13 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:13 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:13 | 麝月 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:15 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:15 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:15 | 麝月 | 行动入队：🔥 备膳 |  | queue:add |
| 第01日 08:15 | 麝月 | AI选择：厨房灶台·备膳 [furn:4009:prepare_meal] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:15 | 晴雯 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:15 | 晴雯 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:16 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:16 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:17 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:17 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:17 | 晴雯 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:20 | 袭人 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 08:20 | 袭人 | AI选择：跟随宝玉 [quest-follow:1:baoyu] provider=quest routine=followRotation:follow:baoyu:xiren:day_follow:1:2002 |  | ai:decision |
| 第01日 08:27 | 麝月 | 作息完成：早餐 via=kitchen |  | ai:routine_completed |
| 第01日 08:27 | 麝月 | 开始用家具：厨房灶台 / prepare_meal |  | furniture:use_started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 92 |
| quest:candidate | 40 |
| ai:state | 33 |
| time:tick | 31 |
| queue:add | 24 |
| ai:decision | 24 |
| furniture:use_started | 19 |
| scene:enter:allowed | 19 |
| scene:entered | 19 |
| state:add | 17 |
| character:effect | 17 |
| furniture:released | 17 |
| ai:routine_completed | 16 |
| need:band_changed | 16 |
| furniture:complete | 12 |
| furniture:reaction | 6 |
| relation:axis_change | 4 |
| quest:blocked | 3 |
| relation:change | 2 |
| ai:daily_social_count | 2 |
| interaction:started | 2 |
| quest:issued | 1 |
| quest:accepted | 1 |
| servant:follow_state | 1 |
| interaction:risky_fail | 1 |
| interaction:awkward_started | 1 |
| interaction:awkward_ended | 1 |
| state:remove | 1 |
| interaction:effects | 1 |
| quest:progress | 1 |
| ai:social_target_cooldown | 1 |
| interaction:complete | 1 |
