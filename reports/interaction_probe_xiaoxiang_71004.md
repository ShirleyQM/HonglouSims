# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、紫鹃、雪雁
- 模拟范围：第 1 日 08:00 到第 8 日 00:00 前
- 随机种子：71004
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第1日 黛玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 没有单项行为超过 8 次。

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 11 | 4 | 2 | 0 | 0 | 0 |  08:02 行动入队：👘 理妆整衣； 08:02 AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene； 08:07 作息完成：晨起梳洗 via=wardrobe； 08:07 开始用家具：梳洗妆台 / tidy_dress； 08:11 完成用家具：梳洗妆台 / tidy_dress |
| 1 | 紫鹃 | 3 | 0 | 2 | 1 | 0 | 0 |  08:04 开始用家具：饭桌 / complain_food； 08:07 完成用家具：饭桌 / complain_food； 08:30 被雪雁发起互动：「倾听」 |
| 1 | 雪雁 | 15 | 4 | 3 | 1 | 0 | 0 |  08:01 行动入队：🍚 挑食抱怨； 08:01 AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=breakfast； 08:10 作息完成：早餐 via=meal； 08:10 开始用家具：饭桌 / complain_food； 08:12 行动入队：👘 理妆整衣 |
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
| 黛玉 | 1 | EXECUTING | 行走中 | 📚 抄写诗文 | 60 | 100 | 47 | 85 | 44 |
| 紫鹃 | 1 | IDLE | 闲庭漫步 |  | 84 | 76 | 61 | 85 | 34 |
| 雪雁 | 1 | EXECUTING | 行走中 | 🛏️ 在雕花木床 | 73 | 100 | 59 | 85 | 75 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 雪雁 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 08:01 | 雪雁 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:02 | 黛玉 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:02 | 黛玉 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:04 | 紫鹃 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:07 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:07 | 黛玉 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:07 | 紫鹃 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:10 | 雪雁 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:10 | 雪雁 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:11 | 黛玉 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:12 | 雪雁 | 行动入队：👘 理妆整衣 |  | queue:add |
| 第01日 08:12 | 雪雁 | AI选择：梳洗妆台·理妆整衣 [furn:1008:tidy_dress] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第01日 08:13 | 雪雁 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第01日 08:13 | 雪雁 | 开始用家具：梳洗妆台 / tidy_dress |  | furniture:use_started |
| 第01日 08:15 | 黛玉 | 行动入队：🤝 对弈·紫鹃 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：对弈·紫鹃 [int:202:zijuan] provider=social routine=breakfast |  | ai:decision |
| 第01日 08:16 | 黛玉 | 行动入队：🪑 静坐复盘 |  | queue:add |
| 第01日 08:16 | 黛玉 | AI选择：石凳·静坐复盘 [furn:3004:rest_and_review] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:17 | 雪雁 | 完成用家具：梳洗妆台 / tidy_dress |  | furniture:complete |
| 第01日 08:24 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 08:24 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:30 | 雪雁 | 行动入队：💬 倾听·紫鹃 |  | queue:add |
| 第01日 08:30 | 雪雁 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第01日 08:30 | 雪雁 | 开始互动：与紫鹃「倾听」 |  | interaction:started |
| 第01日 08:30 | 紫鹃 | 被雪雁发起互动：「倾听」 |  | interaction:started |
| 第01日 08:30 | 雪雁 | AI选择：倾听·紫鹃 [int:401:zijuan] provider=social |  | ai:decision |
| 第01日 08:31 | 雪雁 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 08:31 | 雪雁 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| log:add | 129 |
| emotion:resisted | 43 |
| quest:candidate | 41 |
| ai:state | 39 |
| queue:add | 37 |
| ai:decision | 37 |
| time:tick | 31 |
| state:add | 29 |
| character:effect | 28 |
| furniture:released | 21 |
| furniture:use_started | 21 |
| ai:routine_completed | 19 |
| need:band_changed | 16 |
| scene:enter:allowed | 14 |
| scene:entered | 14 |
| furniture:complete | 12 |
| emotion:contagion | 9 |
| state:remove | 6 |
| quest:progress | 6 |
| furniture:reaction | 5 |
| ai:daily_social_count | 4 |
| interaction:started | 4 |
| relation:axis_change | 4 |
| quest:blocked | 3 |
| relation:change | 3 |
| servant:follow_state | 2 |
| quest:started | 2 |
| interaction:state | 2 |
| quest:issued | 1 |
| quest:accepted | 1 |
| interaction:risky_fail | 1 |
| interaction:awkward_started | 1 |
| interaction:effects | 1 |
| ai:social_target_cooldown | 1 |
| interaction:complete | 1 |
