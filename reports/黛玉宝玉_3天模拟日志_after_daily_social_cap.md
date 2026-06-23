# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、宝玉
- 模拟范围：第 1 日 08:00 到第 4 日 00:00 前
- 随机种子：61617
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第2日 黛玉 出现 3 次受阻/失败，可能有路径、权限或任务条件问题。
- 第3日 宝玉 出现 6 次受阻/失败，可能有路径、权限或任务条件问题。
- 第4日 黛玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 黛玉：行动入队：🥟 在点心案 ×204
- 黛玉：AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture ×204
- 黛玉：行动入队：📋 在樟木案几 ×52
- 黛玉：AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture ×50
- 黛玉：开始用家具：点心案 / default_use ×45
- 黛玉：行动入队：前往潇湘馆 ×44
- 黛玉：行动入队：🛏️ 在雕花木床 ×33
- 黛玉：AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture ×33
- 黛玉：开始用家具：樟木案几 / default_use ×31
- 黛玉：完成用家具：樟木案几 / default_use ×27
- 宝玉：行动入队：📋 在樟木案几 ×27
- 宝玉：AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture ×27

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 247 | 79 | 36 | 27 | 20 | 0 |  08:01 行动入队：🛁 在浴盆； 08:01 AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture； 08:01 开始用家具：浴盆 / default_use； 08:04 完成用家具：浴盆 / default_use； 08:15 行动入队：📚 翻闲书 |
| 1 | 宝玉 | 261 | 53 | 16 | 92 | 29 | 2 |  08:02 被袭人发起互动：「问安」； 08:09 被袭人完成互动：「问安」； 08:45 开始用家具：饭桌 / complain_food； 08:47 完成用家具：饭桌 / complain_food； 08:49 被晴雯发起互动：「寒暄」 |
| 2 | 黛玉 | 515 | 179 | 84 | 30 | 38 | 3 |  00:00 行动入队：📚 抄写诗文； 00:00 AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture； 00:01 行动入队：🛏️ 在雕花木床； 00:01 AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture； 00:15 行动入队：🥟 在点心案 |
| 2 | 宝玉 | 393 | 79 | 27 | 142 | 26 | 2 |  00:00 行动入队：💬 联句·刘姥姥； 00:00 AI选择：联句·刘姥姥 [int:204:liulaolao] provider=social； 00:15 行动入队：🔥 在厨房灶台； 00:15 AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture； 00:17 行动入队：📋 在樟木案几 |
| 3 | 黛玉 | 527 | 191 | 79 | 24 | 36 | 2 |  00:00 行动入队：🛏️ 在雕花木床； 00:00 AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture； 00:15 行动入队：🛏️ 在雕花木床； 00:15 AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture； 00:30 行动入队：📋 在樟木案几 |
| 3 | 宝玉 | 449 | 89 | 13 | 181 | 28 | 6 |  00:00 行动入队：💬 论禅·大老爷； 00:00 AI选择：论禅·大老爷 [int:205:jiashe] provider=social； 00:00 被刘姥姥发起互动：「倾听」； 00:07 被刘姥姥完成互动：「倾听」； 00:08 行动入队：🛏️ 在雕花木床 |

## 最终状态

| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |
|---|---:|---|---|---|---:|---:|---:|---:|---:|
| 宝玉 | 2 | PAUSED | 主动与宝钗·评文 | 💬 评文·宝钗 | 75 | 99 | 86 | 100 | 100 |
| 黛玉 | 1 | EXECUTING | 行走中 | 🥟 在点心案 | 26 | 75 | 84 | 100 | 100 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 黛玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 08:01 | 黛玉 | AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture |  | ai:decision |
| 第01日 08:01 | 黛玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:02 | 宝玉 | 被袭人发起互动：「问安」 |  | interaction:started |
| 第01日 08:04 | 黛玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:09 | 宝玉 | 被袭人完成互动：「问安」 |  | interaction:complete |
| 第01日 08:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第01日 08:17 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 08:17 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 08:17 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 08:22 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 08:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 08:30 | 黛玉 | AI选择：居家闲步 [w:home:12,28] provider=homeward |  | ai:decision |
| 第01日 08:31 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 08:31 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第01日 08:32 | 黛玉 | 被雪雁发起互动：「调侃」 |  | interaction:started |
| 第01日 08:39 | 黛玉 | 被雪雁完成互动：「调侃」 |  | interaction:complete |
| 第01日 08:43 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第01日 08:45 | 宝玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:45 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第01日 08:47 | 宝玉 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:49 | 宝玉 | 被晴雯发起互动：「寒暄」 |  | interaction:started |
| 第01日 08:53 | 宝玉 | 被麝月发起互动：「品茗」 |  | interaction:started |
| 第01日 08:56 | 宝玉 | 被晴雯完成互动：「寒暄」 |  | interaction:complete |
| 第01日 09:00 | 宝玉 | 下发任务给晴雯：晨昏定省 | 宝玉 | quest:issued |
| 第01日 09:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 09:00 | 宝玉 | 行动入队：前往怡红院 |  | queue:add |
| 第01日 09:00 | 宝玉 | AI选择：居家闲步 [w:home:48,33] provider=homeward |  | ai:decision |
| 第01日 09:00 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第01日 09:00 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第01日 09:01 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第01日 09:01 | 宝玉 | AI选择：闲游 [w:23,19] provider=wander |  | ai:decision |
| 第01日 09:03 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第01日 09:07 | 宝玉 | 被麝月完成互动：「品茗」 |  | interaction:complete |
| 第01日 09:10 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第01日 09:10 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第01日 09:15 | 宝玉 | 行动入队：🤝 对酌·贾母 |  | queue:add |
| 第01日 09:15 | 宝玉 | AI选择：对酌·贾母 [int:105:jiamu] provider=social |  | ai:decision |
| 第01日 09:15 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第01日 09:15 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social |  | ai:decision |
| 第01日 09:15 | 黛玉 | 开始互动：与雪雁「评文」 |  | interaction:started |
| 第01日 09:22 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 09:22 | 黛玉 | 完成互动：与雪雁「评文」 |  | interaction:complete |
| 第01日 09:30 | 黛玉 | 行动入队：💬 评文·珍大爷 |  | queue:add |
| 第01日 09:30 | 黛玉 | AI选择：评文·珍大爷 [int:203:jiazhen] provider=social |  | ai:decision |
| 第01日 09:39 | 黛玉 | 行动入队：💬 辩理·贾母 |  | queue:add |
| 第01日 09:39 | 黛玉 | AI选择：辩理·贾母 [int:201:jiamu] provider=social |  | ai:decision |
| 第01日 09:56 | 宝玉 | 开始互动：与贾母「对酌」 |  | interaction:started |
| 第01日 10:06 | 宝玉 | 行动入队：🤝 对酌·贾母 |  | queue:add |
| 第01日 10:06 | 宝玉 | 开始互动：与贾母「对酌」 |  | interaction:started |
| 第01日 10:06 | 宝玉 | AI选择：对酌·贾母 [int:105:jiamu] provider=social |  | ai:decision |
| 第01日 10:09 | 宝玉 | 被袭人发起互动：「闲谈」 |  | interaction:started |
| 第01日 10:16 | 宝玉 | 被袭人完成互动：「闲谈」 |  | interaction:complete |
| 第01日 10:25 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 10:25 | 宝玉 | 完成互动：与贾母「对酌」 |  | interaction:complete |
| 第01日 10:30 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第01日 10:30 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第01日 10:30 | 宝玉 | 被莺儿发起互动：「对酌」 |  | interaction:started |
| 第01日 10:32 | 宝玉 | AI选择：逛园 [w:pub:4,25] provider=homeward |  | ai:decision |
| 第01日 10:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 10:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 10:46 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 10:47 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第01日 10:47 | 宝玉 | AI选择：闲游 [w:6,9] provider=wander |  | ai:decision |
| 第01日 10:47 | 黛玉 | 开始互动：与贾母「辩理」 |  | interaction:started |
| 第01日 10:49 | 宝玉 | 被莺儿完成互动：「对酌」 |  | interaction:complete |
| 第01日 10:55 | 黛玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 10:55 | 黛玉 | 完成互动：与贾母「辩理」 |  | interaction:complete |
| 第01日 11:00 | 宝玉 | 下发任务给麝月：晨昏定省 | 宝玉 | quest:issued |
| 第01日 11:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 11:00 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第01日 11:00 | 宝玉 | AI选择：逛园 [w:pub:18,17] provider=homeward |  | ai:decision |
| 第01日 11:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 11:00 | 黛玉 | AI选择：居家闲步 [w:home:8,30] provider=homeward |  | ai:decision |
| 第01日 11:05 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 11:05 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 11:25 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第01日 11:25 | 宝玉 | AI选择：逛园 [w:pub:41,25] provider=homeward |  | ai:decision |
| 第01日 11:27 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第01日 11:27 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第01日 11:29 | 黛玉 | 行动入队：💬 辩理·宝钗 |  | queue:add |
| 第01日 11:29 | 黛玉 | AI选择：辩理·宝钗 [int:201:baochai] provider=social |  | ai:decision |
| 第01日 11:49 | 宝玉 | 被晴雯发起互动：「闲谈」 |  | interaction:started |
| 第01日 11:50 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第01日 11:56 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第01日 11:56 | 宝玉 | 被晴雯完成互动：「闲谈」 |  | interaction:complete |
| 第01日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第01日 12:05 | 黛玉 | 开始互动：与宝钗「辩理」 |  | interaction:started |
| 第01日 12:08 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第01日 12:13 | 黛玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 12:13 | 黛玉 | 完成互动：与宝钗「辩理」 |  | interaction:complete |
| 第01日 12:15 | 黛玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第01日 12:15 | 黛玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第01日 12:15 | 黛玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第01日 12:15 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 12:15 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第01日 12:16 | 黛玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 12:16 | 黛玉 | AI选择：竹榻·使用竹榻 [furn:2009:default_use] provider=furniture |  | ai:decision |
| 第01日 12:25 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 12:25 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 12:25 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 12:30 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第01日 12:30 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第01日 12:31 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第01日 12:31 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 12:44 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 12:44 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第01日 12:45 | 宝玉 | 行动入队：🤝 品茗·黛玉 |  | queue:add |
| 第01日 12:45 | 宝玉 | AI选择：品茗·黛玉 [int:104:daiyu] provider=social |  | ai:decision |
| 第01日 12:45 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 12:45 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 12:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 12:46 | 黛玉 | AI选择：居家闲步 [w:home:10,28] provider=homeward |  | ai:decision |
| 第01日 12:47 | 黛玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第01日 12:50 | 宝玉 | 开始互动：与黛玉「品茗」 |  | interaction:started |
| 第01日 12:50 | 黛玉 | 被宝玉发起互动：「品茗」 |  | interaction:started |
| 第01日 12:55 | 黛玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第01日 13:00 | 宝玉 | 下发任务给袭人：晨昏定省 | 宝玉 | quest:issued |
| 第01日 13:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 13:03 | 宝玉 | AI目标频控：黛玉 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 13:03 | 宝玉 | 完成互动：与黛玉「品茗」 |  | interaction:complete |
| 第01日 13:03 | 黛玉 | 被宝玉完成互动：「品茗」 |  | interaction:complete |
| 第01日 13:08 | 宝玉 | 被莺儿发起互动：「品茗」 |  | interaction:started |
| 第01日 13:10 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 13:10 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 13:15 | 宝玉 | 被麝月发起互动：「打趣」 |  | interaction:started |
| 第01日 13:16 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第01日 13:21 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第01日 13:21 | 宝玉 | 被麝月完成互动：「打趣」 |  | interaction:complete |
| 第01日 13:21 | 宝玉 | 被莺儿完成互动：「品茗」 |  | interaction:complete |
| 第01日 13:30 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第01日 13:30 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第01日 13:30 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第01日 13:39 | 黛玉 | 行动入队：🤝 对弈·紫鹃 |  | queue:add |
| 第01日 13:39 | 黛玉 | AI选择：对弈·紫鹃 [int:202:zijuan] provider=social |  | ai:decision |
| 第01日 13:47 | 宝玉 | 被大老爷发起互动：「寒暄」 |  | interaction:started |
| 第01日 13:49 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第01日 13:49 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第01日 14:00 | 黛玉 | 下发任务给紫鹃：陪黛玉读书 | 黛玉 | quest:issued |
| 第01日 14:00 | 黛玉 | 接受任务：陪黛玉读书 | 黛玉 | quest:accepted |
| 第01日 14:00 | 宝玉 | 下发任务给麝月：洒扫庭院 | 宝玉 | quest:issued |
| 第01日 14:00 | 宝玉 | 接受任务：洒扫庭院 | 宝玉 | quest:accepted |
| 第01日 14:00 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第01日 14:00 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social |  | ai:decision |
| 第01日 14:01 | 宝玉 | 被宝钗发起互动：「问安」 |  | interaction:started |
| 第01日 14:08 | 宝玉 | 被宝钗完成互动：「问安」 |  | interaction:complete |
| 第01日 14:09 | 宝玉 | 开始互动：与莺儿「对酌」 |  | interaction:started |
| 第01日 14:10 | 黛玉 | 开始互动：与紫鹃「对弈」 |  | interaction:started |
| 第01日 14:16 | 宝玉 | 行动入队：💬 闲谈·宝钗 |  | queue:add |
| 第01日 14:16 | 宝玉 | AI选择：闲谈·宝钗 [int:102:baochai] provider=social |  | ai:decision |
| 第01日 14:20 | 宝玉 | 被大老爷发起互动：「品茗」 |  | interaction:started |
| 第01日 14:28 | 黛玉 | AI目标频控：紫鹃 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 14:28 | 黛玉 | 完成互动：与紫鹃「对弈」 |  | interaction:complete |
| 第01日 14:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 14:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 14:30 | 宝玉 | 被贾母发起互动：「打趣」 |  | interaction:started |
| 第01日 14:32 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 14:35 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 14:35 | 黛玉 | AI选择：居家闲步 [w:home:10,30] provider=homeward |  | ai:decision |
| 第01日 14:37 | 宝玉 | 被贾母完成互动：「打趣」 |  | interaction:complete |
| 第01日 14:38 | 宝玉 | 开始互动：与宝钗「闲谈」 |  | interaction:started |
| 第01日 14:45 | 黛玉 | 行动入队：💬 辩理·宝玉 |  | queue:add |
| 第01日 14:45 | 黛玉 | AI选择：辩理·宝玉 [int:201:baoyu] provider=social |  | ai:decision |
| 第01日 14:45 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第01日 14:45 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 14:45 | 宝玉 | 完成互动：与宝钗「闲谈」 |  | interaction:complete |
| 第01日 14:45 | 宝玉 | 被刘姥姥发起互动：「问安」 |  | interaction:started |
| 第01日 14:48 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 14:48 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 14:51 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第01日 14:51 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第01日 14:52 | 宝玉 | 被刘姥姥发起互动：「闲谈」 |  | interaction:started |
| 第01日 14:56 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第01日 14:58 | 宝玉 | 被刘姥姥完成互动：「闲谈」 |  | interaction:complete |
| 第01日 15:00 | 黛玉 | 下发任务给紫鹃：作诗陪吟 | 黛玉 | quest:issued |
| 第01日 15:00 | 黛玉 | 接受任务：作诗陪吟 | 黛玉 | quest:accepted |
| 第01日 15:00 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第01日 15:00 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第01日 15:00 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第01日 15:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 15:00 | 黛玉 | AI选择：居家闲步 [w:home:14,29] provider=homeward |  | ai:decision |
| 第01日 15:02 | 宝玉 | 被麝月发起互动：「问安」 |  | interaction:started |
| 第01日 15:05 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 15:05 | 黛玉 | AI选择：闲游 [w:14,31] provider=wander |  | ai:decision |
| 第01日 15:09 | 宝玉 | 被麝月完成互动：「问安」 |  | interaction:complete |
| 第01日 15:10 | 黛玉 | 被紫鹃发起互动：「寒暄」 |  | interaction:started |
| 第01日 15:11 | 黛玉 | 开始任务：陪黛玉读书 | 黛玉 | quest:started |
| 第01日 15:11 | 黛玉 | 开始任务：作诗陪吟 | 黛玉 | quest:started |
| 第01日 15:13 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 15:13 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第01日 15:15 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第01日 15:15 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第01日 15:15 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第01日 15:15 | 宝玉 | 被大老爷发起互动：「问安」 |  | interaction:started |
| 第01日 15:16 | 黛玉 | 完成任务：陪黛玉读书 | 黛玉 | quest:completed |
| 第01日 15:17 | 黛玉 | 被紫鹃完成互动：「寒暄」 |  | interaction:complete |
| 第01日 15:21 | 宝玉 | 被大老爷完成互动：「问安」 |  | interaction:complete |
| 第01日 15:27 | 宝玉 | 被袭人发起互动：「寒暄」 |  | interaction:started |
| 第01日 15:28 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第01日 15:30 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 15:30 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture |  | ai:decision |
| 第01日 15:30 | 宝玉 | 被琏二爷发起互动：「问安」 |  | interaction:started |
| 第01日 15:33 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第01日 15:33 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第01日 15:34 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第01日 15:34 | 宝玉 | 被袭人完成互动：「寒暄」 |  | interaction:complete |
| 第01日 15:37 | 宝玉 | 被琏二爷完成互动：「问安」 |  | interaction:complete |
| 第01日 15:40 | 黛玉 | 行动入队：💬 辩理·探春 |  | queue:add |
| 第01日 15:40 | 黛玉 | AI选择：辩理·探春 [int:201:tanchun] provider=social |  | ai:decision |
| 第01日 15:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 15:45 | 黛玉 | AI选择：居家闲步 [w:home:10,28] provider=homeward |  | ai:decision |
| 第01日 15:45 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第01日 15:45 | 宝玉 | AI选择：逛园 [w:pub:22,24] provider=homeward |  | ai:decision |
| 第01日 16:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 16:00 | 黛玉 | AI选择：闲游 [w:9,33] provider=wander |  | ai:decision |
| 第01日 16:15 | 黛玉 | 行动入队：💬 评文·湘云 |  | queue:add |
| 第01日 16:15 | 黛玉 | AI选择：评文·湘云 [int:203:xiangyun] provider=social |  | ai:decision |
| 第01日 16:29 | 黛玉 | 开始互动：与湘云「评文」 |  | interaction:started |
| 第01日 16:30 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第01日 16:30 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第01日 16:37 | 黛玉 | AI目标频控：湘云 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 16:37 | 黛玉 | 完成互动：与湘云「评文」 |  | interaction:complete |
| 第01日 16:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 16:45 | 黛玉 | AI选择：居家闲步 [w:home:6,34] provider=homeward |  | ai:decision |
| 第01日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第01日 17:14 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第01日 17:15 | 黛玉 | 行动入队：💬 论禅·探春 |  | queue:add |
| 第01日 17:15 | 黛玉 | AI选择：论禅·探春 [int:205:tanchun] provider=social |  | ai:decision |
| 第01日 17:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 17:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 17:20 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 17:26 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 17:27 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 17:27 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第01日 17:30 | 宝玉 | 行动入队：🤝 品茗·宝钗 |  | queue:add |
| 第01日 17:30 | 宝玉 | AI选择：品茗·宝钗 [int:104:baochai] provider=social |  | ai:decision |
| 第01日 17:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 17:30 | 黛玉 | AI选择：居家闲步 [w:home:14,32] provider=homeward |  | ai:decision |
| 第01日 17:34 | 宝玉 | 开始互动：与宝钗「品茗」 |  | interaction:started |
| 第01日 17:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 17:45 | 黛玉 | AI选择：闲游 [w:14,30] provider=wander |  | ai:decision |
| 第01日 17:47 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第01日 17:47 | 宝玉 | 完成互动：与宝钗「品茗」 |  | interaction:complete |
| 第01日 18:00 | 宝玉 | 任务下发：训诫 | 政老爷 | quest:issued |
| 第01日 18:00 | 宝玉 | 接受任务：训诫 | 政老爷 | quest:accepted |
| 第01日 18:00 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第01日 18:00 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第01日 18:00 | 黛玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第01日 18:00 | 黛玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第01日 18:02 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 18:02 | 黛玉 | AI选择：居家闲步 [w:home:6,31] provider=homeward |  | ai:decision |
| 第01日 18:03 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 18:03 | 黛玉 | AI选择：居家闲步 [w:home:13,30] provider=homeward |  | ai:decision |
| 第01日 18:03 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第01日 18:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 18:15 | 黛玉 | AI选择：居家闲步 [w:home:13,30] provider=homeward |  | ai:decision |
| 第01日 18:16 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 18:16 | 黛玉 | AI选择：闲游 [w:8,33] provider=wander |  | ai:decision |
| 第01日 18:22 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 18:22 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第01日 18:30 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第01日 18:30 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第01日 18:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 18:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 18:31 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第01日 18:31 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第01日 18:32 | 黛玉 | 被紫鹃发起互动：「问安」 |  | interaction:started |
| 第01日 18:33 | 黛玉 | 开始任务：作诗陪吟 | 黛玉 | quest:started |
| 第01日 18:33 | 黛玉 | 完成任务：作诗陪吟 | 黛玉 | quest:completed |
| 第01日 18:34 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第01日 18:35 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第01日 18:38 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第01日 18:39 | 黛玉 | 被紫鹃完成互动：「问安」 |  | interaction:complete |
| 第01日 18:41 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第01日 18:44 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第01日 18:45 | 宝玉 | 行动入队：👘 在梳洗妆台 |  | queue:add |
| 第01日 18:45 | 宝玉 | AI选择：梳洗妆台·使用梳洗妆台 [furn:2007:default_use] provider=furniture |  | ai:decision |
| 第01日 18:45 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第01日 18:46 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第01日 18:46 | 宝玉 | AI选择：逛园 [w:pub:3,9] provider=homeward |  | ai:decision |
| 第01日 18:49 | 宝玉 | 被刘姥姥发起互动：「问安」 |  | interaction:started |
| 第01日 18:56 | 宝玉 | 被刘姥姥完成互动：「问安」 |  | interaction:complete |
| 第01日 19:00 | 黛玉 | 任务下发：罚抄《四书》 | 政老爷 | quest:issued |
| 第01日 19:00 | 黛玉 | 接受任务：罚抄《四书》 | 政老爷 | quest:accepted |
| 第01日 19:00 | 黛玉 | 行动入队：💬 论禅·探春 |  | queue:add |
| 第01日 19:00 | 黛玉 | AI选择：论禅·探春 [int:205:tanchun] provider=social |  | ai:decision |
| 第01日 19:01 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 19:01 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 19:02 | 宝玉 | 行动入队：🤝 品茗·宝钗 |  | queue:add |
| 第01日 19:02 | 宝玉 | AI选择：品茗·宝钗 [int:104:baochai] provider=social |  | ai:decision |
| 第01日 19:03 | 宝玉 | 开始互动：与宝钗「品茗」 |  | interaction:started |
| 第01日 19:05 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 19:05 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第01日 19:08 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第01日 19:09 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 19:09 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第01日 19:15 | 黛玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第01日 19:15 | 黛玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第01日 19:15 | 宝玉 | 被大老爷发起互动：「品茗」 |  | interaction:started |
| 第01日 19:16 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 19:16 | 宝玉 | 完成互动：与宝钗「品茗」 |  | interaction:complete |
| 第01日 19:28 | 宝玉 | 被大老爷完成互动：「品茗」 |  | interaction:complete |
| 第01日 19:30 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第01日 19:30 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第01日 19:30 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第01日 19:32 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第01日 19:37 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 19:37 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第01日 19:45 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第01日 19:45 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第01日 19:45 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第01日 19:50 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第01日 19:50 | 黛玉 | 被晴雯发起互动：「问安」 |  | interaction:started |
| 第01日 19:57 | 宝玉 | 完成任务：洒扫庭院 | 宝玉 | quest:completed |
| 第01日 19:57 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第01日 19:57 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第01日 19:57 | 黛玉 | 被晴雯完成互动：「问安」 |  | interaction:complete |
| 第01日 19:58 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 19:58 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 20:00 | 宝玉 | 下发任务给袭人：伺候就寝 | 宝玉 | quest:issued |
| 第01日 20:00 | 宝玉 | 接受任务：伺候就寝 | 宝玉 | quest:accepted |
| 第01日 20:00 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第01日 20:00 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第01日 20:00 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第01日 20:00 | 宝玉 | 被莺儿发起互动：「品茗」 |  | interaction:started |
| 第01日 20:01 | 宝玉 | 任务失败：训诫，超时 | 政老爷 | quest:failed |
| 第01日 20:02 | 宝玉 | AI选择：逛园 [w:pub:24,24] provider=homeward |  | ai:decision |
| 第01日 20:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:08 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:08 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:09 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:09 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:10 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:10 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:11 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:11 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:13 | 宝玉 | 被莺儿完成互动：「品茗」 |  | interaction:complete |
| 第01日 20:15 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第01日 20:15 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第01日 20:15 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第01日 20:15 | 宝玉 | 被贾母发起互动：「品茗」 |  | interaction:started |
| 第01日 20:21 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 20:21 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第01日 20:27 | 宝玉 | 被贾母完成互动：「品茗」 |  | interaction:complete |
| 第01日 20:30 | 宝玉 | 行动入队：💬 问安·贾母 |  | queue:add |
| 第01日 20:30 | 宝玉 | 开始互动：与贾母「问安」 |  | interaction:started |
| 第01日 20:30 | 宝玉 | AI选择：问安·贾母 [int:103:jiamu] provider=social |  | ai:decision |
| 第01日 20:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:37 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:37 | 宝玉 | 完成互动：与贾母「问安」 |  | interaction:complete |
| 第01日 20:38 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:38 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:39 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第01日 20:40 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:40 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第01日 20:40 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:40 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第01日 20:45 | 宝玉 | 行动入队：💬 闲谈·雪雁 |  | queue:add |
| 第01日 20:45 | 宝玉 | AI选择：闲谈·雪雁 [int:102:xueyan] provider=social |  | ai:decision |
| 第01日 20:45 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 20:45 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 20:45 | 宝玉 | 开始互动：与雪雁「闲谈」 |  | interaction:started |
| 第01日 20:46 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 20:46 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 20:52 | 宝玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:52 | 宝玉 | 完成互动：与雪雁「闲谈」 |  | interaction:complete |
| 第01日 20:53 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 20:54 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 20:59 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第01日 21:00 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 21:00 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture |  | ai:decision |
| 第01日 21:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 21:00 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第01日 21:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第01日 21:01 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 21:01 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第01日 21:04 | 宝玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 21:09 | 宝玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 21:15 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第01日 21:15 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第01日 21:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 21:15 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 21:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 21:16 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 21:16 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第01日 21:17 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 21:30 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 21:30 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 21:30 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第01日 21:34 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 21:34 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第01日 21:37 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第01日 21:45 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 21:45 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第01日 21:45 | 宝玉 | 行动入队：💬 联句·大老爷 |  | queue:add |
| 第01日 21:45 | 宝玉 | AI选择：联句·大老爷 [int:204:jiashe] provider=social |  | ai:decision |
| 第01日 21:46 | 宝玉 | 被贾母发起互动：「打趣」 |  | interaction:started |
| 第01日 21:52 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第01日 21:53 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 21:53 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第01日 21:53 | 宝玉 | 被贾母完成互动：「打趣」 |  | interaction:complete |
| 第01日 22:00 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:00 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第01日 22:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:00 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 22:01 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:02 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第01日 22:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第01日 22:15 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:15 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 22:15 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第01日 22:15 | 宝玉 | 任务下发：罚抄《四书》 | 政老爷 | quest:issued |
| 第01日 22:15 | 宝玉 | 接受任务：罚抄《四书》 | 政老爷 | quest:accepted |
| 第01日 22:16 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:16 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:24 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:24 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:25 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:25 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:26 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:26 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:27 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:28 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:28 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:28 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:28 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:29 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:30 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 22:31 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:35 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:45 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第01日 22:45 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第01日 22:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:45 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 22:46 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:46 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:50 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:50 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:52 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:52 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:53 | 宝玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第01日 22:53 | 宝玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第01日 23:00 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 23:00 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 23:01 | 宝玉 | 任务失败：伺候就寝，超时 | 宝玉 | quest:failed |
| 第01日 23:01 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 23:01 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第01日 23:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 23:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 23:03 | 宝玉 | 开始互动：与莺儿「联句」 |  | interaction:started |
| 第01日 23:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 23:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 23:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 23:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 23:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 23:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 23:09 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第01日 23:10 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 23:10 | 宝玉 | 完成互动：与莺儿「联句」 |  | interaction:complete |
| 第01日 23:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:16 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:16 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第01日 23:17 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:17 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 23:18 | 黛玉 | 行动入队：💬 论禅·贾母 |  | queue:add |
| 第01日 23:18 | 黛玉 | AI选择：论禅·贾母 [int:205:jiamu] provider=social |  | ai:decision |
| 第01日 23:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 23:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:30 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:31 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:31 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 23:31 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第01日 23:34 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:35 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:37 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 23:45 | 宝玉 | 行动入队：💬 评文·大老爷 |  | queue:add |
| 第01日 23:45 | 宝玉 | AI选择：评文·大老爷 [int:203:jiashe] provider=social |  | ai:decision |
| 第01日 23:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 23:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 23:45 | 宝玉 | 开始互动：与大老爷「评文」 |  | interaction:started |
| 第01日 23:46 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 23:46 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第01日 23:50 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:50 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 23:51 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:52 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:52 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第01日 23:52 | 宝玉 | 完成互动：与大老爷「评文」 |  | interaction:complete |
| 第01日 23:52 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:00 | 全局 | 进入第2日 |  | time:day |
| 第02日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第02日 00:00 | 宝玉 | 行动入队：💬 联句·刘姥姥 |  | queue:add |
| 第02日 00:00 | 宝玉 | AI选择：联句·刘姥姥 [int:204:liulaolao] provider=social |  | ai:decision |
| 第02日 00:00 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 00:00 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 00:01 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 00:01 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 00:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 00:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 00:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:17 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:17 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 00:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:19 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:20 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 00:20 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:25 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:25 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:26 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 00:27 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:27 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 00:27 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:27 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 00:30 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第02日 00:30 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第02日 00:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:30 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 00:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:31 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第02日 00:31 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 00:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 00:49 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 00:49 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第02日 00:53 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:54 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 00:56 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:00 | 宝玉 | 行动入队：💬 论禅·刘姥姥 |  | queue:add |
| 第02日 01:00 | 宝玉 | AI选择：论禅·刘姥姥 [int:205:liulaolao] provider=social |  | ai:decision |
| 第02日 01:00 | 黛玉 | 行动入队：💬 论禅·雪雁 |  | queue:add |
| 第02日 01:00 | 黛玉 | AI选择：论禅·雪雁 [int:205:xueyan] provider=social |  | ai:decision |
| 第02日 01:01 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:01 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第02日 01:02 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 01:02 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 01:15 | 宝玉 | 行动入队：💬 评文·大老爷 |  | queue:add |
| 第02日 01:15 | 宝玉 | 开始互动：与大老爷「评文」 |  | interaction:started |
| 第02日 01:15 | 宝玉 | AI选择：评文·大老爷 [int:203:jiashe] provider=social |  | ai:decision |
| 第02日 01:16 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:16 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:16 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:17 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:17 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:17 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:17 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:18 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:18 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:20 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:20 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:22 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:22 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:25 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:26 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:26 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:30 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 01:31 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:35 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:45 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 01:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 01:46 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 01:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 01:47 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:47 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:47 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:48 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 01:48 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 01:52 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:54 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:54 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:55 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:55 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:56 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:57 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:57 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 02:00 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:00 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:00 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 02:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:00 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 02:01 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 02:01 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 02:01 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 02:01 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 02:02 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:02 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:02 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 02:03 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:03 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:03 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 02:05 | 宝玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第02日 02:05 | 宝玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第02日 02:07 | 宝玉 | 开始互动：与莺儿「评文」 |  | interaction:started |
| 第02日 02:09 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:09 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:14 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 02:14 | 宝玉 | 完成互动：与莺儿「评文」 |  | interaction:complete |
| 第02日 02:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 02:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 02:16 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 02:20 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 02:22 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:22 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:23 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:23 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:24 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:24 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:26 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:26 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:29 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:29 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 02:30 | 宝玉 | 行动入队：💬 辩理·大老爷 |  | queue:add |
| 第02日 02:30 | 宝玉 | AI选择：辩理·大老爷 [int:201:jiashe] provider=social |  | ai:decision |
| 第02日 02:31 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 02:31 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第02日 02:34 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:34 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 02:35 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:35 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 02:36 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:36 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:37 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:37 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:39 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:39 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:41 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:41 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:42 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:42 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:43 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:43 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:43 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第02日 02:44 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 02:44 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第02日 02:45 | 宝玉 | 行动入队：💬 联句·大老爷 |  | queue:add |
| 第02日 02:45 | 宝玉 | 开始互动：与大老爷「联句」 |  | interaction:started |
| 第02日 02:45 | 宝玉 | AI选择：联句·大老爷 [int:204:jiashe] provider=social |  | ai:decision |
| 第02日 02:45 | 黛玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第02日 02:45 | 黛玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第02日 02:46 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 02:46 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 02:46 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 02:47 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 02:47 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 02:47 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 02:48 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:48 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 03:03 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:04 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 03:04 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:04 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:04 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:04 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 03:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:15 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:16 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 03:16 | 宝玉 | 完成任务：罚抄《四书》 | 政老爷 | quest:completed |
| 第02日 03:20 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 03:28 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:29 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 03:30 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第02日 03:30 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第02日 03:32 | 黛玉 | 完成任务：罚抄《四书》 | 政老爷 | quest:completed |
| 第02日 03:33 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 03:41 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第02日 03:45 | 黛玉 | 行动入队：💬 联句·大老爷 |  | queue:add |
| 第02日 03:45 | 黛玉 | AI选择：联句·大老爷 [int:204:jiashe] provider=social |  | ai:decision |
| 第02日 03:46 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 03:46 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 03:59 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 03:59 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第02日 04:00 | 宝玉 | 下发任务给袭人：晨起伺候 | 宝玉 | quest:issued |
| 第02日 04:00 | 宝玉 | 接受任务：晨起伺候 | 宝玉 | quest:accepted |
| 第02日 04:00 | 黛玉 | 下发任务给紫鹃：晨起伺候黛玉 | 黛玉 | quest:issued |
| 第02日 04:00 | 黛玉 | 接受任务：晨起伺候黛玉 | 黛玉 | quest:accepted |
| 第02日 04:00 | 黛玉 | 开始任务：晨起伺候黛玉 | 黛玉 | quest:started |
| 第02日 04:00 | 宝玉 | 行动入队：💬 联句·大老爷 |  | queue:add |
| 第02日 04:00 | 宝玉 | AI选择：联句·大老爷 [int:204:jiashe] provider=social |  | ai:decision |
| 第02日 04:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 04:01 | 宝玉 | 开始互动：与大老爷「联句」 |  | interaction:started |
| 第02日 04:01 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 04:02 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 04:08 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 04:08 | 宝玉 | 完成互动：与大老爷「联句」 |  | interaction:complete |
| 第02日 04:15 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 04:15 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第02日 04:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:25 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:25 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:26 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:26 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:27 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:27 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:27 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 04:28 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:28 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 04:28 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:28 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 04:30 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第02日 04:30 | 宝玉 | 开始互动：与刘姥姥「对弈」 |  | interaction:started |
| 第02日 04:30 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第02日 04:30 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第02日 04:30 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social |  | ai:decision |
| 第02日 04:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:31 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 04:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:31 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 04:33 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:33 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 04:34 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 04:35 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 04:45 | 宝玉 | 行动入队：💬 联句·刘姥姥 |  | queue:add |
| 第02日 04:45 | 宝玉 | AI选择：联句·刘姥姥 [int:204:liulaolao] provider=social |  | ai:decision |
| 第02日 04:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 04:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 05:00 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第02日 05:00 | 宝玉 | AI选择：闲游 [w:9,9] provider=wander |  | ai:decision |
| 第02日 05:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:01 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:02 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:02 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 05:15 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第02日 05:15 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第02日 05:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 05:15 | 黛玉 | AI选择：居家闲步 [w:home:14,33] provider=homeward |  | ai:decision |
| 第02日 05:20 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第02日 05:20 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第02日 05:20 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第02日 05:28 | 黛玉 | 开始互动：与雪雁「联句」 |  | interaction:started |
| 第02日 05:33 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 05:33 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第02日 05:35 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 05:35 | 黛玉 | 完成互动：与雪雁「联句」 |  | interaction:complete |
| 第02日 05:45 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第02日 05:45 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第02日 05:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 05:45 | 黛玉 | AI选择：闲游 [w:6,34] provider=wander |  | ai:decision |
| 第02日 05:45 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第02日 05:46 | 黛玉 | 行动入队：🤝 对弈·宝玉 |  | queue:add |
| 第02日 05:46 | 黛玉 | AI选择：对弈·宝玉 [int:202:baoyu] provider=social |  | ai:decision |
| 第02日 05:49 | 宝玉 | 被袭人发起互动：「倾听」 |  | interaction:started |
| 第02日 05:52 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 05:52 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第02日 05:56 | 宝玉 | 被袭人完成互动：「倾听」 |  | interaction:complete |
| 第02日 06:00 | 宝玉 | 下发任务给麝月：随侍左右 | 宝玉 | quest:issued |
| 第02日 06:00 | 宝玉 | 接受任务：随侍左右 | 宝玉 | quest:accepted |
| 第02日 06:00 | 黛玉 | 下发任务给雪雁：传话 | 黛玉 | quest:issued |
| 第02日 06:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第02日 06:00 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第02日 06:00 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第02日 06:00 | 宝玉 | 被莺儿发起互动：「寒暄」 |  | interaction:started |
| 第02日 06:00 | 宝玉 | 被大老爷发起互动：「闲谈」 |  | interaction:started |
| 第02日 06:00 | 宝玉 | 被刘姥姥发起互动：「寒暄」 |  | interaction:started |
| 第02日 06:07 | 宝玉 | 被莺儿完成互动：「寒暄」 |  | interaction:complete |
| 第02日 06:07 | 宝玉 | 被大老爷完成互动：「闲谈」 |  | interaction:complete |
| 第02日 06:07 | 宝玉 | 被刘姥姥完成互动：「寒暄」 |  | interaction:complete |
| 第02日 06:15 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第02日 06:15 | 宝玉 | AI选择：逛园 [w:pub:15,20] provider=homeward |  | ai:decision |
| 第02日 06:22 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第02日 06:22 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第02日 06:29 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第02日 06:37 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 06:37 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第02日 06:45 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第02日 06:45 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第02日 06:45 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第02日 06:52 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 06:52 | 宝玉 | 完成互动：与刘姥姥「问安」 |  | interaction:complete |
| 第02日 06:55 | 黛玉 | 开始互动：与宝玉「对弈」 |  | interaction:started |
| 第02日 06:55 | 宝玉 | 被黛玉发起互动：「对弈」 |  | interaction:started |
| 第02日 07:00 | 黛玉 | 下发任务给雪雁：随侍黛玉 | 黛玉 | quest:issued |
| 第02日 07:00 | 黛玉 | 接受任务：随侍黛玉 | 黛玉 | quest:accepted |
| 第02日 07:13 | 黛玉 | AI目标频控：宝玉 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 07:13 | 黛玉 | 完成互动：与宝玉「对弈」 |  | interaction:complete |
| 第02日 07:13 | 宝玉 | 被黛玉完成互动：「对弈」 |  | interaction:complete |
| 第02日 07:15 | 宝玉 | 行动入队：💬 寒暄·黛玉 |  | queue:add |
| 第02日 07:15 | 宝玉 | 开始互动：与黛玉「寒暄」 |  | interaction:started |
| 第02日 07:15 | 黛玉 | 被宝玉发起互动：「寒暄」 |  | interaction:started |
| 第02日 07:15 | 宝玉 | AI选择：寒暄·黛玉 [int:101:daiyu] provider=social |  | ai:decision |
| 第02日 07:21 | 宝玉 | AI目标频控：黛玉 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 07:21 | 宝玉 | 完成互动：与黛玉「寒暄」 |  | interaction:complete |
| 第02日 07:21 | 黛玉 | 被宝玉完成互动：「寒暄」 |  | interaction:complete |
| 第02日 07:29 | 黛玉 | 被蓉哥儿发起互动：「问安」 |  | interaction:started |
| 第02日 07:30 | 宝玉 | 行动入队：💬 寒暄·探春 |  | queue:add |
| 第02日 07:30 | 宝玉 | AI选择：寒暄·探春 [int:101:tanchun] provider=social |  | ai:decision |
| 第02日 07:31 | 宝玉 | 被刘姥姥发起互动：「闲谈」 |  | interaction:started |
| 第02日 07:32 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 07:37 | 黛玉 | 被蓉哥儿完成互动：「问安」 |  | interaction:complete |
| 第02日 07:38 | 宝玉 | 被刘姥姥完成互动：「闲谈」 |  | interaction:complete |
| 第02日 07:44 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 07:45 | 黛玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第02日 07:45 | 黛玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture |  | ai:decision |
| 第02日 07:45 | 黛玉 | 被刘姥姥发起互动：「品茗」 |  | interaction:started |
| 第02日 07:47 | 黛玉 | 行动入队：🧼 在铜面盆 |  | queue:add |
| 第02日 07:47 | 黛玉 | AI选择：铜面盆·使用铜面盆 [furn:2008:default_use] provider=furniture |  | ai:decision |
| 第02日 07:53 | 黛玉 | 开始用家具：铜面盆 / default_use |  | furniture:use_started |
| 第02日 07:56 | 黛玉 | 完成用家具：铜面盆 / default_use |  | furniture:complete |
| 第02日 08:00 | 宝玉 | 下发任务给麝月：传话 | 宝玉 | quest:issued |
| 第02日 08:00 | 宝玉 | 接受任务：传话 | 宝玉 | quest:accepted |
| 第02日 08:00 | 全局 | 时段切换：上午 |  | time:period |
| 第02日 08:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 08:00 | 黛玉 | AI选择：居家闲步 [w:home:11,28] provider=homeward |  | ai:decision |
| 第02日 08:01 | 宝玉 | 任务失败：晨起伺候，超时 | 宝玉 | quest:failed |
| 第02日 08:01 | 黛玉 | 任务失败：晨起伺候黛玉，超时 | 黛玉 | quest:failed |
| 第02日 08:02 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:02 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:04 | 黛玉 | 被雪雁发起互动：「揭短」 |  | interaction:started |
| 第02日 08:05 | 黛玉 | 开始任务：传话 | 黛玉 | quest:started |
| 第02日 08:11 | 黛玉 | 完成任务：传话 | 黛玉 | quest:completed |
| 第02日 08:11 | 黛玉 | 被雪雁完成互动：「揭短」 |  | interaction:complete |
| 第02日 08:16 | 黛玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 08:17 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:17 | 黛玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 08:17 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:17 | 黛玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 08:30 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:30 | 黛玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 08:30 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:31 | 黛玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 08:34 | 宝玉 | 开始互动：与探春「寒暄」 |  | interaction:started |
| 第02日 08:34 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 08:41 | 宝玉 | AI目标频控：探春 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 08:41 | 宝玉 | 完成互动：与探春「寒暄」 |  | interaction:complete |
| 第02日 08:41 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 08:45 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第02日 08:45 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第02日 08:45 | 黛玉 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第02日 08:45 | 黛玉 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第02日 08:45 | 黛玉 | AI选择：饭桌·独自用膳 [furn:2005:eat_alone] provider=furniture |  | ai:decision |
| 第02日 08:46 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:46 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 08:46 | 黛玉 | AI选择：居家闲步 [w:home:9,28] provider=homeward |  | ai:decision |
| 第02日 08:53 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 09:11 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 09:11 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 09:23 | 宝玉 | 被贾母发起互动：「揭短」 |  | interaction:started |
| 第02日 09:30 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第02日 09:30 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social |  | ai:decision |
| 第02日 09:31 | 宝玉 | 被贾母完成互动：「揭短」 |  | interaction:complete |
| 第02日 09:46 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 09:53 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 09:57 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 10:00 | 黛玉 | 下发任务给雪雁：晨昏定省 | 黛玉 | quest:issued |
| 第02日 10:00 | 黛玉 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第02日 10:00 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第02日 10:00 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第02日 10:02 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 10:02 | 黛玉 | 开始互动：与雪雁「评文」 |  | interaction:started |
| 第02日 10:04 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第02日 10:09 | 黛玉 | 完成任务：晨昏定省 | 黛玉 | quest:completed |
| 第02日 10:09 | 黛玉 | AI目标频控：雪雁 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 10:09 | 黛玉 | 完成互动：与雪雁「评文」 |  | interaction:complete |
| 第02日 10:11 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 10:11 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 10:11 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第02日 10:15 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第02日 10:15 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social |  | ai:decision |
| 第02日 10:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 10:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 10:23 | 宝玉 | 开始互动：与莺儿「对酌」 |  | interaction:started |
| 第02日 10:34 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 10:43 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 10:43 | 宝玉 | 完成互动：与莺儿「对酌」 |  | interaction:complete |
| 第02日 10:45 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第02日 10:45 | 宝玉 | 开始互动：与大老爷「寒暄」 |  | interaction:started |
| 第02日 10:45 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social |  | ai:decision |
| 第02日 10:51 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 10:51 | 宝玉 | 完成互动：与大老爷「寒暄」 |  | interaction:complete |
| 第02日 11:00 | 宝玉 | 任务下发：晨昏定省 | 政老爷 | quest:issued |
| 第02日 11:00 | 宝玉 | 接受任务：晨昏定省 | 政老爷 | quest:accepted |
| 第02日 11:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 11:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 11:00 | 宝玉 | 行动入队：🤝 品茗·麝月 |  | queue:add |
| 第02日 11:00 | 宝玉 | AI选择：品茗·麝月 [int:104:sheyue] provider=social |  | ai:decision |
| 第02日 11:01 | 宝玉 | 任务失败：传话，超时 | 宝玉 | quest:failed |
| 第02日 11:01 | 宝玉 | 开始互动：与麝月「品茗」 |  | interaction:started |
| 第02日 11:14 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第02日 11:14 | 宝玉 | 完成互动：与麝月「品茗」 |  | interaction:complete |
| 第02日 11:15 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第02日 11:15 | 宝玉 | AI选择：逛园 [w:pub:22,8] provider=homeward |  | ai:decision |
| 第02日 11:16 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 11:16 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 11:22 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 11:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:41 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:41 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:42 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:42 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:43 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:43 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:44 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:44 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:44 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 11:45 | 宝玉 | 行动入队：💬 闲谈·刘姥姥 |  | queue:add |
| 第02日 11:45 | 宝玉 | AI选择：闲谈·刘姥姥 [int:102:liulaolao] provider=social |  | ai:decision |
| 第02日 11:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:45 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 11:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:45 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 11:46 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第02日 11:46 | 宝玉 | AI选择：逛园 [w:pub:28,15] provider=homeward |  | ai:decision |
| 第02日 11:50 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 11:50 | 黛玉 | 被雪雁发起互动：「调侃」 |  | interaction:started |
| 第02日 11:57 | 黛玉 | 被雪雁完成互动：「调侃」 |  | interaction:complete |
| 第02日 12:00 | 黛玉 | 下发任务给紫鹃：传话 | 黛玉 | quest:issued |
| 第02日 12:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第02日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第02日 12:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 12:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 12:09 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 12:15 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第02日 12:15 | 宝玉 | AI选择：闲游 [w:30,17] provider=wander |  | ai:decision |
| 第02日 12:15 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 12:24 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 12:30 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 12:30 | 宝玉 | AI选择：逛园 [w:pub:23,25] provider=homeward |  | ai:decision |
| 第02日 12:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:38 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:38 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:38 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 12:39 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 12:41 | 宝玉 | 被晴雯发起互动：「调侃」 |  | interaction:started |
| 第02日 12:45 | 黛玉 | 行动入队：💬 评文·紫鹃 |  | queue:add |
| 第02日 12:45 | 黛玉 | AI选择：评文·紫鹃 [int:203:zijuan] provider=social |  | ai:decision |
| 第02日 12:46 | 黛玉 | 开始互动：与紫鹃「评文」 |  | interaction:started |
| 第02日 12:49 | 宝玉 | 被晴雯完成互动：「调侃」 |  | interaction:complete |
| 第02日 12:53 | 黛玉 | 完成任务：传话 | 黛玉 | quest:completed |
| 第02日 12:53 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第02日 12:53 | 黛玉 | 完成互动：与紫鹃「评文」 |  | interaction:complete |
| 第02日 13:00 | 黛玉 | 任务下发：晨昏定省 | 政老爷 | quest:issued |
| 第02日 13:00 | 黛玉 | 接受任务：晨昏定省 | 政老爷 | quest:accepted |
| 第02日 13:00 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第02日 13:00 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第02日 13:00 | 黛玉 | 行动入队：💬 辩理·湘云 |  | queue:add |
| 第02日 13:00 | 黛玉 | AI选择：辩理·湘云 [int:201:xiangyun] provider=social |  | ai:decision |
| 第02日 13:00 | 黛玉 | 被紫鹃发起互动：「嬉闹」 |  | interaction:started |
| 第02日 13:15 | 黛玉 | 被紫鹃完成互动：「嬉闹」 |  | interaction:complete |
| 第02日 13:16 | 黛玉 | 行动入队：前往荣禧堂 |  | queue:add |
| 第02日 13:16 | 黛玉 | AI选择：找政老爷办晨昏定省 [quest-seek-interact:32:jiazheng] provider=quest |  | ai:decision |
| 第02日 13:46 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第02日 13:53 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 13:53 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第02日 14:00 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第02日 14:00 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第02日 14:00 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第02日 14:13 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 14:13 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第02日 14:15 | 宝玉 | 行动入队：💬 问安·蓉哥儿 |  | queue:add |
| 第02日 14:15 | 宝玉 | AI选择：问安·蓉哥儿 [int:103:jiarong] provider=social |  | ai:decision |
| 第02日 14:15 | 宝玉 | 开始互动：与蓉哥儿「问安」 |  | interaction:started |
| 第02日 14:16 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 14:22 | 宝玉 | AI目标频控：蓉哥儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 14:22 | 宝玉 | 完成互动：与蓉哥儿「问安」 |  | interaction:complete |
| 第02日 14:30 | 宝玉 | 行动入队：💬 闲谈·贾母 |  | queue:add |
| 第02日 14:30 | 宝玉 | AI选择：闲谈·贾母 [int:102:jiamu] provider=social |  | ai:decision |
| 第02日 14:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 14:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 14:31 | 宝玉 | 开始互动：与贾母「闲谈」 |  | interaction:started |
| 第02日 14:34 | 黛玉 | 被袭人发起互动：「对酌」 |  | interaction:started |
| 第02日 14:37 | 黛玉 | 被晴雯发起互动：「问安」 |  | interaction:started |
| 第02日 14:38 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第02日 14:38 | 宝玉 | 完成互动：与贾母「闲谈」 |  | interaction:complete |
| 第02日 14:44 | 黛玉 | 被晴雯完成互动：「问安」 |  | interaction:complete |
| 第02日 14:45 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 14:45 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 14:45 | 宝玉 | 行动入队：🤝 对酌·大老爷 |  | queue:add |
| 第02日 14:45 | 宝玉 | 开始互动：与大老爷「对酌」 |  | interaction:started |
| 第02日 14:45 | 宝玉 | AI选择：对酌·大老爷 [int:105:jiashe] provider=social |  | ai:decision |
| 第02日 14:47 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 14:47 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 14:49 | 宝玉 | 完成任务：随侍左右 | 宝玉 | quest:completed |
| 第02日 14:49 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 14:49 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 14:50 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 14:50 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 14:53 | 黛玉 | 被袭人完成互动：「对酌」 |  | interaction:complete |
| 第02日 14:55 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 14:55 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 15:00 | 黛玉 | 下发任务给紫鹃：晨昏定省 | 黛玉 | quest:issued |
| 第02日 15:00 | 黛玉 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第02日 15:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 15:00 | 黛玉 | AI选择：居家闲步 [w:home:6,30] provider=homeward |  | ai:decision |
| 第02日 15:03 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 15:03 | 宝玉 | 完成互动：与大老爷「对酌」 |  | interaction:complete |
| 第02日 15:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 15:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 15:15 | 宝玉 | 行动入队：💬 闲谈·雪雁 |  | queue:add |
| 第02日 15:15 | 宝玉 | AI选择：闲谈·雪雁 [int:102:xueyan] provider=social |  | ai:decision |
| 第02日 15:15 | 宝玉 | 开始互动：与雪雁「闲谈」 |  | interaction:started |
| 第02日 15:22 | 宝玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 15:22 | 宝玉 | 完成互动：与雪雁「闲谈」 |  | interaction:complete |
| 第02日 15:27 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 15:27 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 15:30 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第02日 15:30 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第02日 15:31 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第02日 15:42 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:42 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:44 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:44 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:48 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:48 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:49 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:49 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:49 | 宝玉 | 被麝月发起互动：「问安」 |  | interaction:started |
| 第02日 15:50 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:50 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:50 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第02日 15:50 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第02日 15:51 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:51 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:52 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:52 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:56 | 宝玉 | 被麝月完成互动：「问安」 |  | interaction:complete |
| 第02日 16:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:00 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第02日 16:00 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第02日 16:01 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第02日 16:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:08 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:08 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:08 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 16:08 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第02日 16:09 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:09 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:12 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 16:12 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 16:14 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 16:15 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第02日 16:15 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第02日 16:21 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 16:22 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第02日 16:29 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 16:29 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第02日 16:30 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第02日 16:30 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social |  | ai:decision |
| 第02日 16:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:31 | 宝玉 | 开始互动：与大老爷「寒暄」 |  | interaction:started |
| 第02日 16:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:33 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 16:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:34 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 16:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:34 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 16:38 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 16:38 | 宝玉 | 完成互动：与大老爷「寒暄」 |  | interaction:complete |
| 第02日 16:45 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第02日 16:45 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第02日 16:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 16:45 | 黛玉 | AI选择：居家闲步 [w:home:8,28] provider=homeward |  | ai:decision |
| 第02日 16:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 16:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:47 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 16:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:47 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 16:50 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第02日 16:57 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 16:57 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第02日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第02日 17:00 | 宝玉 | 行动入队：💬 闲谈·袭人 |  | queue:add |
| 第02日 17:00 | 宝玉 | AI选择：闲谈·袭人 [int:102:xiren] provider=social |  | ai:decision |
| 第02日 17:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:00 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 17:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:01 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 17:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:01 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 17:10 | 宝玉 | 开始互动：与袭人「闲谈」 |  | interaction:started |
| 第02日 17:14 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 17:15 | 黛玉 | 开始任务：晨昏定省 | 黛玉 | quest:started |
| 第02日 17:17 | 宝玉 | AI目标频控：袭人 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 17:17 | 宝玉 | 完成互动：与袭人「闲谈」 |  | interaction:complete |
| 第02日 17:21 | 黛玉 | 完成任务：晨昏定省 | 黛玉 | quest:completed |
| 第02日 17:21 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 17:30 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第02日 17:30 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第02日 17:30 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第02日 17:30 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第02日 17:30 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第02日 17:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:31 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 17:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:31 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 17:39 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第02日 17:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:45 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 17:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:45 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 17:46 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 17:46 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第02日 18:00 | 黛玉 | 下发任务给雪雁：传话 | 黛玉 | quest:issued |
| 第02日 18:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第02日 18:00 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第02日 18:00 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第02日 18:00 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第02日 18:00 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第02日 18:00 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第02日 18:01 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:01 | 黛玉 | AI选择：居家闲步 [w:home:10,33] provider=homeward |  | ai:decision |
| 第02日 18:09 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第02日 18:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 18:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 18:17 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 18:22 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:22 | 黛玉 | AI选择：闲游 [w:9,33] provider=wander |  | ai:decision |
| 第02日 18:28 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 18:28 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第02日 18:30 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第02日 18:30 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第02日 18:30 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第02日 18:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:30 | 黛玉 | AI选择：居家闲步 [w:home:10,31] provider=homeward |  | ai:decision |
| 第02日 18:30 | 宝玉 | 被雪雁发起互动：「品茗」 |  | interaction:started |
| 第02日 18:37 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 18:37 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第02日 18:43 | 宝玉 | 被雪雁完成互动：「品茗」 |  | interaction:complete |
| 第02日 18:45 | 宝玉 | 行动入队：💬 问安·雪雁 |  | queue:add |
| 第02日 18:45 | 宝玉 | 开始互动：与雪雁「问安」 |  | interaction:started |
| 第02日 18:45 | 宝玉 | AI选择：问安·雪雁 [int:103:xueyan] provider=social |  | ai:decision |
| 第02日 18:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:45 | 黛玉 | AI选择：居家闲步 [w:home:7,33] provider=homeward |  | ai:decision |
| 第02日 18:45 | 宝玉 | 被麝月发起互动：「揭短」 |  | interaction:started |
| 第02日 18:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:46 | 黛玉 | AI选择：居家闲步 [w:home:11,32] provider=homeward |  | ai:decision |
| 第02日 18:51 | 宝玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 18:51 | 宝玉 | 完成互动：与雪雁「问安」 |  | interaction:complete |
| 第02日 18:51 | 宝玉 | 被麝月完成互动：「揭短」 |  | interaction:complete |
| 第02日 19:00 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第02日 19:00 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第02日 19:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 19:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 19:00 | 宝玉 | 被刘姥姥发起互动：「寒暄」 |  | interaction:started |
| 第02日 19:01 | 黛玉 | 任务失败：随侍黛玉，超时 | 黛玉 | quest:failed |
| 第02日 19:01 | 宝玉 | 被莺儿发起互动：「对酌」 |  | interaction:started |
| 第02日 19:02 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第02日 19:03 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 19:07 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 19:07 | 宝玉 | 被刘姥姥完成互动：「寒暄」 |  | interaction:complete |
| 第02日 19:09 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 19:09 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第02日 19:15 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第02日 19:15 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social |  | ai:decision |
| 第02日 19:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:15 | 黛玉 | AI选择：居家闲步 [w:home:11,32] provider=homeward |  | ai:decision |
| 第02日 19:15 | 宝玉 | 被大老爷发起互动：「闲谈」 |  | interaction:started |
| 第02日 19:16 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第02日 19:16 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第02日 19:20 | 宝玉 | 被莺儿完成互动：「对酌」 |  | interaction:complete |
| 第02日 19:21 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第02日 19:22 | 宝玉 | 被大老爷完成互动：「闲谈」 |  | interaction:complete |
| 第02日 19:23 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第02日 19:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:30 | 黛玉 | AI选择：居家闲步 [w:home:8,34] provider=homeward |  | ai:decision |
| 第02日 19:33 | 宝玉 | 开始互动：与宝钗「问安」 |  | interaction:started |
| 第02日 19:40 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 19:40 | 宝玉 | 完成互动：与宝钗「问安」 |  | interaction:complete |
| 第02日 19:45 | 宝玉 | 行动入队：🤝 对酌·王夫人 |  | queue:add |
| 第02日 19:45 | 宝玉 | AI选择：对酌·王夫人 [int:105:wangfuren] provider=social |  | ai:decision |
| 第02日 19:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:45 | 黛玉 | AI选择：闲游 [w:8,33] provider=wander |  | ai:decision |
| 第02日 19:47 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第02日 19:47 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第02日 19:57 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第02日 20:00 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 20:00 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 20:00 | 宝玉 | 被雪雁发起互动：「问安」 |  | interaction:started |
| 第02日 20:01 | 宝玉 | 被宝钗发起互动：「调侃」 |  | interaction:started |
| 第02日 20:03 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 20:04 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 20:04 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第02日 20:07 | 宝玉 | 被雪雁完成互动：「问安」 |  | interaction:complete |
| 第02日 20:08 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第02日 20:08 | 宝玉 | 被宝钗完成互动：「调侃」 |  | interaction:complete |
| 第02日 20:15 | 宝玉 | 行动入队：💬 寒暄·雪雁 |  | queue:add |
| 第02日 20:15 | 宝玉 | 开始互动：与雪雁「寒暄」 |  | interaction:started |
| 第02日 20:15 | 宝玉 | AI选择：寒暄·雪雁 [int:101:xueyan] provider=social |  | ai:decision |
| 第02日 20:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:15 | 宝玉 | 被麝月发起互动：「对酌」 |  | interaction:started |
| 第02日 20:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:21 | 宝玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 20:21 | 宝玉 | 完成互动：与雪雁「寒暄」 |  | interaction:complete |
| 第02日 20:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:23 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 20:24 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:24 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 20:24 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:25 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:25 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 20:25 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:25 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 20:30 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第02日 20:30 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第02日 20:30 | 黛玉 | 行动入队：🤝 对弈·探春 |  | queue:add |
| 第02日 20:30 | 黛玉 | AI选择：对弈·探春 [int:202:tanchun] provider=social |  | ai:decision |
| 第02日 20:30 | 宝玉 | 被刘姥姥发起互动：「问安」 |  | interaction:started |
| 第02日 20:31 | 宝玉 | 被袭人发起互动：「问安」 |  | interaction:started |
| 第02日 20:31 | 宝玉 | 被贾母发起互动：「闲谈」 |  | interaction:started |
| 第02日 20:31 | 宝玉 | 被蓉哥儿发起互动：「闲谈」 |  | interaction:started |
| 第02日 20:33 | 宝玉 | 被麝月完成互动：「对酌」 |  | interaction:complete |
| 第02日 20:34 | 黛玉 | 行动入队：💬 联句·宝玉 |  | queue:add |
| 第02日 20:34 | 黛玉 | AI选择：联句·宝玉 [int:204:baoyu] provider=social |  | ai:decision |
| 第02日 20:37 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第02日 20:37 | 宝玉 | 被刘姥姥完成互动：「问安」 |  | interaction:complete |
| 第02日 20:38 | 宝玉 | 被袭人完成互动：「问安」 |  | interaction:complete |
| 第02日 20:38 | 宝玉 | 被贾母完成互动：「闲谈」 |  | interaction:complete |
| 第02日 20:38 | 宝玉 | 被蓉哥儿完成互动：「闲谈」 |  | interaction:complete |
| 第02日 20:44 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 20:44 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第02日 20:45 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第02日 20:45 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第02日 20:45 | 宝玉 | 被莺儿发起互动：「寒暄」 |  | interaction:started |
| 第02日 20:49 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第02日 20:52 | 宝玉 | 被莺儿完成互动：「寒暄」 |  | interaction:complete |
| 第02日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第02日 21:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 21:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 21:01 | 黛玉 | 任务失败：传话，超时 | 黛玉 | quest:failed |
| 第02日 21:01 | 宝玉 | 被王夫人发起互动：「倾听」 |  | interaction:started |
| 第02日 21:07 | 宝玉 | 被王夫人完成互动：「倾听」 |  | interaction:complete |
| 第02日 21:08 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 21:08 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第02日 21:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 21:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 21:17 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 21:20 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 21:21 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 21:25 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 21:30 | 宝玉 | 行动入队：💬 评文·宝钗 |  | queue:add |
| 第02日 21:30 | 宝玉 | AI选择：评文·宝钗 [int:203:baochai] provider=social |  | ai:decision |
| 第02日 21:30 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 21:30 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 21:30 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 21:31 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第02日 21:31 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第02日 21:31 | 宝玉 | 开始互动：与宝钗「评文」 |  | interaction:started |
| 第02日 21:38 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 21:38 | 宝玉 | 完成互动：与宝钗「评文」 |  | interaction:complete |
| 第02日 21:38 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第02日 21:38 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第02日 21:38 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第02日 21:39 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第02日 21:39 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第02日 21:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 21:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 21:45 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第02日 21:46 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第02日 21:51 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 21:52 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 22:00 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 22:00 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 22:00 | 黛玉 | 行动入队：💬 辩理·探春 |  | queue:add |
| 第02日 22:00 | 黛玉 | AI选择：辩理·探春 [int:201:tanchun] provider=social |  | ai:decision |
| 第02日 22:01 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 22:02 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:02 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:05 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 22:15 | 宝玉 | 行动入队：💬 论禅·莺儿 |  | queue:add |
| 第02日 22:15 | 宝玉 | AI选择：论禅·莺儿 [int:205:yinger] provider=social |  | ai:decision |
| 第02日 22:15 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:15 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:15 | 宝玉 | 开始互动：与莺儿「论禅」 |  | interaction:started |
| 第02日 22:15 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 22:22 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 22:22 | 宝玉 | 完成互动：与莺儿「论禅」 |  | interaction:complete |
| 第02日 22:30 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:30 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 22:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 22:31 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 22:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:32 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 22:40 | 宝玉 | 被王夫人发起互动：「倾听」 |  | interaction:started |
| 第02日 22:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:45 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 22:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:45 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 22:47 | 宝玉 | 被王夫人完成互动：「倾听」 |  | interaction:complete |
| 第02日 22:55 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第02日 23:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 23:00 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 23:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 23:02 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第02日 23:02 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第02日 23:09 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第02日 23:15 | 宝玉 | 行动入队：💬 评文·宝钗 |  | queue:add |
| 第02日 23:15 | 宝玉 | 开始互动：与宝钗「评文」 |  | interaction:started |
| 第02日 23:15 | 宝玉 | AI选择：评文·宝钗 [int:203:baochai] provider=social |  | ai:decision |
| 第02日 23:15 | 黛玉 | 行动入队：💬 联句·贾母 |  | queue:add |
| 第02日 23:15 | 黛玉 | AI选择：联句·贾母 [int:204:jiamu] provider=social |  | ai:decision |
| 第02日 23:21 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 23:21 | 宝玉 | 完成互动：与宝钗「评文」 |  | interaction:complete |
| 第02日 23:30 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第02日 23:30 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第02日 23:31 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第02日 23:38 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第02日 23:39 | 宝玉 | 行动入队：💬 论禅·莺儿 |  | queue:add |
| 第02日 23:39 | 宝玉 | AI选择：论禅·莺儿 [int:205:yinger] provider=social |  | ai:decision |
| 第02日 23:39 | 宝玉 | 开始互动：与莺儿「论禅」 |  | interaction:started |
| 第02日 23:46 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 23:46 | 宝玉 | 完成互动：与莺儿「论禅」 |  | interaction:complete |
| 第02日 23:52 | 黛玉 | 开始互动：与贾母「联句」 |  | interaction:started |
| 第02日 23:59 | 黛玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 23:59 | 黛玉 | 完成互动：与贾母「联句」 |  | interaction:complete |
| 第03日 00:00 | 全局 | 进入第3日 |  | time:day |
| 第03日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第03日 00:00 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第03日 00:00 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第03日 00:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 00:00 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 00:07 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 00:08 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:08 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第03日 00:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 00:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 00:15 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:15 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 00:16 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 00:19 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 00:20 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第03日 00:26 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第03日 00:30 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第03日 00:30 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第03日 00:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 00:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 00:31 | 宝玉 | 开始互动：与大老爷「论禅」 |  | interaction:started |
| 第03日 00:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 00:38 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 00:38 | 宝玉 | 完成互动：与大老爷「论禅」 |  | interaction:complete |
| 第03日 00:45 | 宝玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第03日 00:45 | 宝玉 | 开始互动：与宝钗「论禅」 |  | interaction:started |
| 第03日 00:45 | 宝玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第03日 00:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 00:45 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第03日 00:51 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 00:51 | 宝玉 | 完成互动：与宝钗「论禅」 |  | interaction:complete |
| 第03日 00:51 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第03日 01:00 | 宝玉 | 行动入队：🤝 对弈·王夫人 |  | queue:add |
| 第03日 01:00 | 宝玉 | 开始互动：与王夫人「对弈」 |  | interaction:started |
| 第03日 01:00 | 宝玉 | AI选择：对弈·王夫人 [int:202:wangfuren] provider=social |  | ai:decision |
| 第03日 01:03 | 宝玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第03日 01:03 | 宝玉 | 开始互动：与莺儿「评文」 |  | interaction:started |
| 第03日 01:03 | 宝玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第03日 01:09 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 01:09 | 宝玉 | 完成互动：与莺儿「评文」 |  | interaction:complete |
| 第03日 01:14 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 01:15 | 宝玉 | 行动入队：💬 评文·王夫人 |  | queue:add |
| 第03日 01:15 | 宝玉 | 开始互动：与王夫人「评文」 |  | interaction:started |
| 第03日 01:15 | 宝玉 | AI选择：评文·王夫人 [int:203:wangfuren] provider=social |  | ai:decision |
| 第03日 01:15 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 01:21 | 宝玉 | AI目标频控：王夫人 75分钟 |  | ai:social_target_cooldown |
| 第03日 01:21 | 宝玉 | 完成互动：与王夫人「评文」 |  | interaction:complete |
| 第03日 01:22 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 01:30 | 宝玉 | 行动入队：💬 论禅·珍大爷 |  | queue:add |
| 第03日 01:30 | 宝玉 | AI选择：论禅·珍大爷 [int:205:jiazhen] provider=social |  | ai:decision |
| 第03日 01:30 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 01:30 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 01:30 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 01:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 01:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 01:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 01:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 01:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 01:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 01:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 01:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 01:35 | 黛玉 | 行动入队：💬 联句·政老爷 |  | queue:add |
| 第03日 01:35 | 黛玉 | AI选择：联句·政老爷 [int:204:jiazheng] provider=social |  | ai:decision |
| 第03日 01:36 | 黛玉 | 行动入队：💬 联句·政老爷 |  | queue:add |
| 第03日 01:36 | 黛玉 | AI选择：联句·政老爷 [int:204:jiazheng] provider=social |  | ai:decision |
| 第03日 01:37 | 黛玉 | 行动入队：💬 评文·政老爷 |  | queue:add |
| 第03日 01:37 | 黛玉 | AI选择：评文·政老爷 [int:203:jiazheng] provider=social |  | ai:decision |
| 第03日 01:38 | 黛玉 | 行动入队：🤝 对弈·政老爷 |  | queue:add |
| 第03日 01:38 | 黛玉 | AI选择：对弈·政老爷 [int:202:jiazheng] provider=social |  | ai:decision |
| 第03日 01:39 | 黛玉 | 开始互动：与政老爷「对弈」 |  | interaction:started |
| 第03日 01:40 | 黛玉 | 开始任务：晨昏定省 | 政老爷 | quest:started |
| 第03日 01:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 01:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 01:45 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 01:46 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 01:46 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 01:53 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 01:57 | 黛玉 | 完成任务：晨昏定省 | 政老爷 | quest:completed |
| 第03日 01:57 | 黛玉 | AI目标频控：政老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 01:57 | 黛玉 | 完成互动：与政老爷「对弈」 |  | interaction:complete |
| 第03日 02:00 | 宝玉 | 行动入队：💬 评文·大老爷 |  | queue:add |
| 第03日 02:00 | 宝玉 | AI选择：评文·大老爷 [int:203:jiashe] provider=social |  | ai:decision |
| 第03日 02:00 | 黛玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第03日 02:00 | 黛玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第03日 02:00 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第03日 02:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:01 | 宝玉 | 开始互动：与大老爷「评文」 |  | interaction:started |
| 第03日 02:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:06 | 黛玉 | 行动入队：💬 评文·贾母 |  | queue:add |
| 第03日 02:06 | 黛玉 | AI选择：评文·贾母 [int:203:jiamu] provider=social |  | ai:decision |
| 第03日 02:07 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第03日 02:08 | 宝玉 | 行动入队：💬 辩理·宝钗 |  | queue:add |
| 第03日 02:08 | 宝玉 | 开始互动：与宝钗「辩理」 |  | interaction:started |
| 第03日 02:08 | 宝玉 | AI选择：辩理·宝钗 [int:201:baochai] provider=social |  | ai:decision |
| 第03日 02:14 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:14 | 宝玉 | 完成互动：与宝钗「辩理」 |  | interaction:complete |
| 第03日 02:15 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 02:15 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 02:15 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 02:15 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第03日 02:15 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 02:15 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第03日 02:16 | 宝玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 02:16 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 02:22 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第03日 02:30 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第03日 02:30 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第03日 02:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:31 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第03日 02:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:40 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:41 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:41 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:41 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:41 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 02:45 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第03日 02:45 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第03日 02:45 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 02:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:47 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:47 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 02:49 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:49 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第03日 02:51 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 03:00 | 宝玉 | 行动入队：💬 辩理·大老爷 |  | queue:add |
| 第03日 03:00 | 宝玉 | AI选择：辩理·大老爷 [int:201:jiashe] provider=social |  | ai:decision |
| 第03日 03:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 03:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 03:02 | 宝玉 | 开始互动：与大老爷「辩理」 |  | interaction:started |
| 第03日 03:07 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 03:07 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 03:07 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 03:07 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 03:09 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 03:09 | 宝玉 | 完成互动：与大老爷「辩理」 |  | interaction:complete |
| 第03日 03:15 | 宝玉 | 行动入队：💬 辩理·王夫人 |  | queue:add |
| 第03日 03:15 | 宝玉 | AI选择：辩理·王夫人 [int:201:wangfuren] provider=social |  | ai:decision |
| 第03日 03:15 | 黛玉 | 行动入队：💬 论禅·政老爷 |  | queue:add |
| 第03日 03:15 | 黛玉 | AI选择：论禅·政老爷 [int:205:jiazheng] provider=social |  | ai:decision |
| 第03日 03:15 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 03:16 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 03:16 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 03:16 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 03:16 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 03:22 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 03:23 | 宝玉 | 开始互动：与王夫人「辩理」 |  | interaction:started |
| 第03日 03:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:31 | 宝玉 | AI目标频控：王夫人 75分钟 |  | ai:social_target_cooldown |
| 第03日 03:31 | 宝玉 | 完成互动：与王夫人「辩理」 |  | interaction:complete |
| 第03日 03:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:35 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 03:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:36 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 03:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:37 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 03:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:37 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 03:45 | 宝玉 | 行动入队：💬 评文·宝钗 |  | queue:add |
| 第03日 03:45 | 宝玉 | 开始互动：与宝钗「评文」 |  | interaction:started |
| 第03日 03:45 | 宝玉 | AI选择：评文·宝钗 [int:203:baochai] provider=social |  | ai:decision |
| 第03日 03:45 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第03日 03:45 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第03日 03:45 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第03日 03:46 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第03日 03:47 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 03:47 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 03:51 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 03:51 | 宝玉 | 完成互动：与宝钗「评文」 |  | interaction:complete |
| 第03日 03:52 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第03日 03:52 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第03日 03:55 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 03:57 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 04:00 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:00 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:00 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第03日 04:00 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第03日 04:03 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:03 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 04:03 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:15 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第03日 04:15 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第03日 04:15 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第03日 04:15 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第03日 04:15 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第03日 04:15 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 04:18 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:18 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 04:18 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:21 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 04:30 | 黛玉 | 行动入队：💬 论禅·雪雁 |  | queue:add |
| 第03日 04:30 | 黛玉 | AI选择：论禅·雪雁 [int:205:xueyan] provider=social |  | ai:decision |
| 第03日 04:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:32 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 04:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:32 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 04:32 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第03日 04:32 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 04:45 | 宝玉 | 行动入队：💬 辩理·大老爷 |  | queue:add |
| 第03日 04:45 | 宝玉 | 开始互动：与大老爷「辩理」 |  | interaction:started |
| 第03日 04:45 | 宝玉 | AI选择：辩理·大老爷 [int:201:jiashe] provider=social |  | ai:decision |
| 第03日 04:45 | 黛玉 | 行动入队：💬 论禅·贾母 |  | queue:add |
| 第03日 04:45 | 黛玉 | AI选择：论禅·贾母 [int:205:jiamu] provider=social |  | ai:decision |
| 第03日 04:45 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 04:46 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:46 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 04:46 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:46 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 04:51 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 04:51 | 宝玉 | 完成互动：与大老爷「辩理」 |  | interaction:complete |
| 第03日 04:52 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 05:00 | 宝玉 | 行动入队：🤝 品茗·王夫人 |  | queue:add |
| 第03日 05:00 | 宝玉 | AI选择：品茗·王夫人 [int:104:wangfuren] provider=social |  | ai:decision |
| 第03日 05:00 | 黛玉 | 行动入队：💬 联句·宝玉 |  | queue:add |
| 第03日 05:00 | 黛玉 | AI选择：联句·宝玉 [int:204:baoyu] provider=social |  | ai:decision |
| 第03日 05:01 | 宝玉 | 开始互动：与王夫人「品茗」 |  | interaction:started |
| 第03日 05:03 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 05:03 | 黛玉 | AI选择：居家闲步 [w:home:9,31] provider=homeward |  | ai:decision |
| 第03日 05:14 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:14 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:14 | 宝玉 | AI目标频控：王夫人 75分钟 |  | ai:social_target_cooldown |
| 第03日 05:14 | 宝玉 | 完成互动：与王夫人「品茗」 |  | interaction:complete |
| 第03日 05:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:15 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第03日 05:15 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第03日 05:15 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第03日 05:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:17 | 宝玉 | 被大老爷发起互动：「打趣」 |  | interaction:started |
| 第03日 05:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:22 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 05:22 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第03日 05:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:23 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 05:25 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:25 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 05:25 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:25 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 05:25 | 宝玉 | 被大老爷完成互动：「打趣」 |  | interaction:complete |
| 第03日 05:30 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第03日 05:30 | 宝玉 | AI选择：逛园 [w:pub:11,8] provider=homeward |  | ai:decision |
| 第03日 05:30 | 黛玉 | 行动入队：💬 联句·紫鹃 |  | queue:add |
| 第03日 05:30 | 黛玉 | AI选择：联句·紫鹃 [int:204:zijuan] provider=social |  | ai:decision |
| 第03日 05:45 | 宝玉 | 行动入队：💬 问安·珍大爷 |  | queue:add |
| 第03日 05:45 | 宝玉 | AI选择：问安·珍大爷 [int:103:jiazhen] provider=social |  | ai:decision |
| 第03日 05:46 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第03日 05:46 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture |  | ai:decision |
| 第03日 05:46 | 黛玉 | 开始互动：与紫鹃「联句」 |  | interaction:started |
| 第03日 05:47 | 宝玉 | 行动入队：💬 打趣·莺儿 |  | queue:add |
| 第03日 05:47 | 宝玉 | AI选择：打趣·莺儿 [int:301:yinger] provider=social |  | ai:decision |
| 第03日 05:51 | 宝玉 | 开始互动：与莺儿「打趣」 |  | interaction:started |
| 第03日 05:53 | 黛玉 | AI目标频控：紫鹃 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 05:53 | 黛玉 | 完成互动：与紫鹃「联句」 |  | interaction:complete |
| 第03日 05:58 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 05:58 | 宝玉 | 完成互动：与莺儿「打趣」 |  | interaction:complete |
| 第03日 06:00 | 黛玉 | 下发任务给紫鹃：随侍黛玉 | 黛玉 | quest:issued |
| 第03日 06:00 | 黛玉 | 接受任务：随侍黛玉 | 黛玉 | quest:accepted |
| 第03日 06:00 | 宝玉 | 下发任务给麝月：洒扫庭院 | 宝玉 | quest:issued |
| 第03日 06:00 | 宝玉 | 接受任务：洒扫庭院 | 宝玉 | quest:accepted |
| 第03日 06:00 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第03日 06:00 | 宝玉 | AI选择：闲游 [w:6,9] provider=wander |  | ai:decision |
| 第03日 06:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 06:00 | 黛玉 | AI选择：居家闲步 [w:home:3,30] provider=homeward |  | ai:decision |
| 第03日 06:02 | 黛玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第03日 06:02 | 黛玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第03日 06:05 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第03日 06:05 | 宝玉 | AI选择：逛园 [w:pub:7,8] provider=homeward |  | ai:decision |
| 第03日 06:15 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第03日 06:15 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第03日 06:15 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第03日 06:22 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 06:22 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第03日 06:30 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第03日 06:30 | 宝玉 | AI选择：闲游 [w:2,7] provider=wander |  | ai:decision |
| 第03日 06:31 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第03日 06:31 | 宝玉 | AI选择：逛园 [w:pub:15,13] provider=homeward |  | ai:decision |
| 第03日 06:33 | 黛玉 | 被雪雁发起互动：「揭短」 |  | interaction:started |
| 第03日 06:40 | 黛玉 | 被雪雁完成互动：「揭短」 |  | interaction:complete |
| 第03日 06:49 | 宝玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 06:56 | 宝玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 07:00 | 宝玉 | 下发任务给晴雯：随侍左右 | 宝玉 | quest:issued |
| 第03日 07:00 | 宝玉 | 接受任务：随侍左右 | 宝玉 | quest:accepted |
| 第03日 07:00 | 黛玉 | 下发任务给紫鹃：传话 | 黛玉 | quest:issued |
| 第03日 07:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第03日 07:11 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 07:30 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 07:30 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 07:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 07:30 | 黛玉 | AI选择：居家闲步 [w:home:4,28] provider=homeward |  | ai:decision |
| 第03日 07:40 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第03日 07:40 | 宝玉 | AI选择：逛园 [w:pub:26,17] provider=homeward |  | ai:decision |
| 第03日 07:54 | 黛玉 | 行动入队：🧼 在铜面盆 |  | queue:add |
| 第03日 07:54 | 黛玉 | AI选择：铜面盆·使用铜面盆 [furn:2008:default_use] provider=furniture |  | ai:decision |
| 第03日 08:00 | 宝玉 | 下发任务给袭人：备膳 | 宝玉 | quest:issued |
| 第03日 08:00 | 宝玉 | 接受任务：备膳 | 宝玉 | quest:accepted |
| 第03日 08:00 | 全局 | 时段切换：上午 |  | time:period |
| 第03日 08:00 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第03日 08:00 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第03日 08:09 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第03日 08:13 | 黛玉 | 被晴雯发起互动：「问安」 |  | interaction:started |
| 第03日 08:18 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第03日 08:20 | 黛玉 | 被晴雯完成互动：「问安」 |  | interaction:complete |
| 第03日 08:29 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:29 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 08:35 | 黛玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 08:37 | 黛玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第03日 08:38 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第03日 08:45 | 黛玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第03日 08:45 | 黛玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第03日 08:45 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 08:45 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第03日 08:47 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 08:47 | 黛玉 | AI选择：居家闲步 [w:home:13,28] provider=homeward |  | ai:decision |
| 第03日 09:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 09:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 09:00 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第03日 09:00 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第03日 09:00 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第03日 09:01 | 宝玉 | 任务失败：晨昏定省，超时 | 政老爷 | quest:failed |
| 第03日 09:01 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第03日 09:01 | 宝玉 | 行动受阻：正在交谈，不便走开 scene=2 cand=int:104:jiashe |  | queue:failed |
| 第03日 09:01 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第03日 09:01 | 宝玉 | 被刘姥姥发起互动：「寒暄」 |  | interaction:started |
| 第03日 09:08 | 宝玉 | 被刘姥姥完成互动：「寒暄」 |  | interaction:complete |
| 第03日 09:15 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第03日 09:15 | 宝玉 | AI选择：逛园 [w:pub:8,25] provider=homeward |  | ai:decision |
| 第03日 09:15 | 宝玉 | 被大老爷发起互动：「揭短」 |  | interaction:started |
| 第03日 09:16 | 宝玉 | 完成任务：备膳 | 宝玉 | quest:completed |
| 第03日 09:17 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 09:21 | 宝玉 | 被大老爷完成互动：「揭短」 |  | interaction:complete |
| 第03日 09:34 | 黛玉 | 行动入队：💬 评文·紫鹃 |  | queue:add |
| 第03日 09:34 | 黛玉 | AI选择：评文·紫鹃 [int:203:zijuan] provider=social |  | ai:decision |
| 第03日 09:35 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 09:36 | 黛玉 | 开始任务：传话 | 黛玉 | quest:started |
| 第03日 09:43 | 黛玉 | 完成任务：传话 | 黛玉 | quest:completed |
| 第03日 09:43 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 09:51 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第03日 09:51 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第03日 09:51 | 宝玉 | 被莺儿发起互动：「调侃」 |  | interaction:started |
| 第03日 09:52 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第03日 09:58 | 宝玉 | 被莺儿完成互动：「调侃」 |  | interaction:complete |
| 第03日 10:00 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 10:00 | 宝玉 | 下发任务给袭人：服侍更衣 | 宝玉 | quest:issued |
| 第03日 10:00 | 宝玉 | 接受任务：服侍更衣 | 宝玉 | quest:accepted |
| 第03日 10:01 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第03日 10:06 | 宝玉 | 完成任务：洒扫庭院 | 宝玉 | quest:completed |
| 第03日 10:08 | 黛玉 | 被雪雁发起互动：「打趣」 |  | interaction:started |
| 第03日 10:15 | 黛玉 | 被雪雁完成互动：「打趣」 |  | interaction:complete |
| 第03日 10:17 | 黛玉 | 开始互动：与紫鹃「评文」 |  | interaction:started |
| 第03日 10:25 | 黛玉 | AI目标频控：紫鹃 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 10:25 | 黛玉 | 完成互动：与紫鹃「评文」 |  | interaction:complete |
| 第03日 10:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 10:30 | 黛玉 | AI选择：居家闲步 [w:home:4,31] provider=homeward |  | ai:decision |
| 第03日 10:31 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 10:31 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 10:31 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第03日 10:38 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 10:38 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第03日 10:45 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第03日 10:45 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第03日 10:49 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第03日 10:50 | 宝玉 | 被刘姥姥发起互动：「揭短」 |  | interaction:started |
| 第03日 10:56 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:56 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第03日 11:00 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第03日 11:00 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第03日 11:01 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第03日 11:01 | 宝玉 | 被大老爷发起互动：「嬉闹」 |  | interaction:started |
| 第03日 11:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:08 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:08 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:08 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 11:08 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第03日 11:10 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:10 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:11 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:11 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:12 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:12 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:13 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:13 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:15 | 宝玉 | 行动入队：🤝 品茗·麝月 |  | queue:add |
| 第03日 11:15 | 宝玉 | AI选择：品茗·麝月 [int:104:sheyue] provider=social |  | ai:decision |
| 第03日 11:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:16 | 宝玉 | 开始互动：与麝月「品茗」 |  | interaction:started |
| 第03日 11:16 | 宝玉 | 被大老爷完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 11:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:29 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 11:29 | 宝玉 | 完成互动：与麝月「品茗」 |  | interaction:complete |
| 第03日 11:30 | 宝玉 | 行动入队：💬 寒暄·蓉哥儿 |  | queue:add |
| 第03日 11:30 | 宝玉 | AI选择：寒暄·蓉哥儿 [int:101:jiarong] provider=social |  | ai:decision |
| 第03日 11:31 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:31 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 11:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:34 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 11:38 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第03日 11:39 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 11:40 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:40 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:40 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 11:41 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:41 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 11:41 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 11:41 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 11:45 | 宝玉 | 行动入队：💬 问安·蓉哥儿 |  | queue:add |
| 第03日 11:45 | 宝玉 | AI选择：问安·蓉哥儿 [int:103:jiarong] provider=social |  | ai:decision |
| 第03日 11:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 11:45 | 黛玉 | AI选择：居家闲步 [w:home:12,33] provider=homeward |  | ai:decision |
| 第03日 11:46 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第03日 11:46 | 宝玉 | AI选择：闲游 [w:1,10] provider=wander |  | ai:decision |
| 第03日 11:46 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 11:46 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 11:46 | 宝玉 | 被贾母发起互动：「揭短」 |  | interaction:started |
| 第03日 11:53 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 11:53 | 宝玉 | 被贾母完成互动：「揭短」 |  | interaction:complete |
| 第03日 11:55 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第03日 11:55 | 宝玉 | AI选择：逛园 [w:pub:31,8] provider=homeward |  | ai:decision |
| 第03日 11:58 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第03日 11:59 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 12:00 | 宝玉 | 下发任务给麝月：传话 | 宝玉 | quest:issued |
| 第03日 12:00 | 宝玉 | 接受任务：传话 | 宝玉 | quest:accepted |
| 第03日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第03日 12:00 | 黛玉 | 行动入队：前往南游廊 |  | queue:add |
| 第03日 12:00 | 黛玉 | AI选择：闲游 [w:2,24] provider=wander |  | ai:decision |
| 第03日 12:00 | 宝玉 | 被莺儿发起互动：「嬉闹」 |  | interaction:started |
| 第03日 12:01 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 12:01 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 12:01 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 12:04 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 12:06 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 12:11 | 宝玉 | 行动入队：💬 打趣·莺儿 |  | queue:add |
| 第03日 12:11 | 宝玉 | AI选择：打趣·莺儿 [int:301:yinger] provider=social |  | ai:decision |
| 第03日 12:15 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第03日 12:15 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 12:15 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第03日 12:15 | 宝玉 | 被莺儿完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 12:16 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第03日 12:17 | 宝玉 | 开始互动：与莺儿「打趣」 |  | interaction:started |
| 第03日 12:17 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第03日 12:25 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 12:25 | 宝玉 | 完成互动：与莺儿「打趣」 |  | interaction:complete |
| 第03日 12:30 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 12:30 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 12:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:31 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 12:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:34 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 12:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:35 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 12:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:35 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 12:41 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第03日 12:41 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第03日 12:41 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第03日 12:45 | 黛玉 | 行动入队：💬 辩理·雪雁 |  | queue:add |
| 第03日 12:45 | 黛玉 | AI选择：辩理·雪雁 [int:201:xueyan] provider=social |  | ai:decision |
| 第03日 12:53 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 12:53 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第03日 13:00 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 13:00 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 13:00 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 13:03 | 黛玉 | 开始互动：与雪雁「辩理」 |  | interaction:started |
| 第03日 13:09 | 黛玉 | 被紫鹃发起互动：「嬉闹」 |  | interaction:started |
| 第03日 13:10 | 黛玉 | AI目标频控：雪雁 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 13:10 | 黛玉 | 完成互动：与雪雁「辩理」 |  | interaction:complete |
| 第03日 13:13 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 13:13 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第03日 13:15 | 宝玉 | 行动入队：🤝 品茗·蓉哥儿 |  | queue:add |
| 第03日 13:15 | 宝玉 | 开始互动：与蓉哥儿「品茗」 |  | interaction:started |
| 第03日 13:15 | 宝玉 | AI选择：品茗·蓉哥儿 [int:104:jiarong] provider=social |  | ai:decision |
| 第03日 13:15 | 黛玉 | 行动入队：前往南游廊 |  | queue:add |
| 第03日 13:15 | 黛玉 | AI选择：闲游 [w:3,25] provider=wander |  | ai:decision |
| 第03日 13:16 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 13:16 | 黛玉 | AI选择：居家闲步 [w:home:6,28] provider=homeward |  | ai:decision |
| 第03日 13:18 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 13:25 | 黛玉 | 被紫鹃完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 13:26 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第03日 13:26 | 宝玉 | AI选择：逛园 [w:pub:15,18] provider=homeward |  | ai:decision |
| 第03日 13:29 | 宝玉 | 行动入队：💬 打趣·麝月 |  | queue:add |
| 第03日 13:29 | 宝玉 | AI选择：打趣·麝月 [int:301:sheyue] provider=social |  | ai:decision |
| 第03日 13:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 13:30 | 黛玉 | AI选择：居家闲步 [w:home:4,28] provider=homeward |  | ai:decision |
| 第03日 13:31 | 宝玉 | 开始互动：与麝月「打趣」 |  | interaction:started |
| 第03日 13:32 | 黛玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第03日 13:32 | 黛玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第03日 13:33 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 13:38 | 宝玉 | 完成任务：传话 | 宝玉 | quest:completed |
| 第03日 13:38 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第03日 13:38 | 宝玉 | 完成互动：与麝月「打趣」 |  | interaction:complete |
| 第03日 13:45 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第03日 13:45 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第03日 13:58 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 13:58 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 13:58 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第03日 13:59 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 13:59 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:00 | 黛玉 | 下发任务给紫鹃：陪黛玉读书 | 黛玉 | quest:issued |
| 第03日 14:00 | 黛玉 | 接受任务：陪黛玉读书 | 黛玉 | quest:accepted |
| 第03日 14:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:01 | 宝玉 | 任务失败：服侍更衣，超时 | 宝玉 | quest:failed |
| 第03日 14:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:11 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 14:11 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 14:11 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第03日 14:15 | 宝玉 | 行动入队：💬 闲谈·宝钗 |  | queue:add |
| 第03日 14:15 | 宝玉 | AI选择：闲谈·宝钗 [int:102:baochai] provider=social |  | ai:decision |
| 第03日 14:21 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 14:23 | 宝玉 | 开始互动：与宝钗「闲谈」 |  | interaction:started |
| 第03日 14:29 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:29 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:31 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 14:31 | 宝玉 | 完成互动：与宝钗「闲谈」 |  | interaction:complete |
| 第03日 14:31 | 宝玉 | 被贾母发起互动：「寒暄」 |  | interaction:started |
| 第03日 14:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:33 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 14:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:34 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 14:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:34 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 14:38 | 宝玉 | 被贾母完成互动：「寒暄」 |  | interaction:complete |
| 第03日 14:45 | 宝玉 | 行动入队：💬 打趣·贾母 |  | queue:add |
| 第03日 14:45 | 宝玉 | 开始互动：与贾母「打趣」 |  | interaction:started |
| 第03日 14:45 | 宝玉 | AI选择：打趣·贾母 [int:301:jiamu] provider=social |  | ai:decision |
| 第03日 14:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 14:45 | 黛玉 | AI选择：居家闲步 [w:home:7,34] provider=homeward |  | ai:decision |
| 第03日 14:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 14:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 14:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 14:46 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 14:51 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 14:51 | 宝玉 | 完成互动：与贾母「打趣」 |  | interaction:complete |
| 第03日 15:00 | 黛玉 | 任务下发：抄写经文 | 王夫人 | quest:issued |
| 第03日 15:00 | 黛玉 | 接受任务：抄写经文 | 王夫人 | quest:accepted |
| 第03日 15:00 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第03日 15:00 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第03日 15:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 15:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 15:05 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第03日 15:08 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 15:09 | 黛玉 | 开始任务：抄写经文 | 王夫人 | quest:started |
| 第03日 15:14 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 15:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 15:15 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 15:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 15:15 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 15:19 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 15:19 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第03日 15:27 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 15:30 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第03日 15:30 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第03日 15:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 15:30 | 黛玉 | AI选择：闲游 [w:6,34] provider=wander |  | ai:decision |
| 第03日 15:31 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 15:31 | 黛玉 | AI选择：居家闲步 [w:home:10,33] provider=homeward |  | ai:decision |
| 第03日 15:35 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第03日 15:43 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 15:43 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第03日 15:45 | 宝玉 | 行动入队：🤝 对酌·雪雁 |  | queue:add |
| 第03日 15:45 | 宝玉 | AI选择：对酌·雪雁 [int:105:xueyan] provider=social |  | ai:decision |
| 第03日 15:45 | 黛玉 | 行动入队：💬 辩理·琏二爷 |  | queue:add |
| 第03日 15:45 | 黛玉 | AI选择：辩理·琏二爷 [int:201:jialian] provider=social |  | ai:decision |
| 第03日 15:46 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 15:46 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 15:46 | 宝玉 | 开始互动：与雪雁「对酌」 |  | interaction:started |
| 第03日 15:46 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第03日 15:47 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 15:48 | 黛玉 | 开始任务：抄写经文 | 王夫人 | quest:started |
| 第03日 15:52 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第03日 15:52 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第03日 15:53 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 15:53 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第03日 15:56 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第03日 16:00 | 黛玉 | 下发任务给雪雁：作诗陪吟 | 黛玉 | quest:issued |
| 第03日 16:00 | 黛玉 | 接受任务：作诗陪吟 | 黛玉 | quest:accepted |
| 第03日 16:00 | 黛玉 | 行动入队：💬 辩理·雪雁 |  | queue:add |
| 第03日 16:00 | 黛玉 | AI选择：辩理·雪雁 [int:201:xueyan] provider=social |  | ai:decision |
| 第03日 16:03 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 16:03 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第03日 16:04 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 16:15 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第03日 16:15 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第03日 16:15 | 宝玉 | 被大老爷发起互动：「嬉闹」 |  | interaction:started |
| 第03日 16:22 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第03日 16:29 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:29 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第03日 16:29 | 宝玉 | 被大老爷完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 16:30 | 宝玉 | 行动入队：💬 寒暄·贾母 |  | queue:add |
| 第03日 16:30 | 宝玉 | AI选择：寒暄·贾母 [int:101:jiamu] provider=social |  | ai:decision |
| 第03日 16:33 | 宝玉 | 开始互动：与贾母「寒暄」 |  | interaction:started |
| 第03日 16:40 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:40 | 宝玉 | 完成互动：与贾母「寒暄」 |  | interaction:complete |
| 第03日 16:45 | 宝玉 | 行动入队：💬 打趣·大老爷 |  | queue:add |
| 第03日 16:45 | 宝玉 | 开始互动：与大老爷「打趣」 |  | interaction:started |
| 第03日 16:45 | 宝玉 | AI选择：打趣·大老爷 [int:301:jiashe] provider=social |  | ai:decision |
| 第03日 16:51 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:51 | 宝玉 | 完成互动：与大老爷「打趣」 |  | interaction:complete |
| 第03日 17:00 | 宝玉 | 任务下发：作诗陪吟 | 政老爷 | quest:issued |
| 第03日 17:00 | 宝玉 | 接受任务：作诗陪吟 | 政老爷 | quest:accepted |
| 第03日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第03日 17:00 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第03日 17:00 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第03日 17:00 | 宝玉 | 被贾母发起互动：「闲谈」 |  | interaction:started |
| 第03日 17:01 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第03日 17:05 | 黛玉 | 开始互动：与雪雁「辩理」 |  | interaction:started |
| 第03日 17:07 | 宝玉 | 被贾母完成互动：「闲谈」 |  | interaction:complete |
| 第03日 17:08 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:08 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第03日 17:13 | 黛玉 | AI目标频控：雪雁 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 17:13 | 黛玉 | 完成互动：与雪雁「辩理」 |  | interaction:complete |
| 第03日 17:15 | 宝玉 | 行动入队：💬 闲谈·雪雁 |  | queue:add |
| 第03日 17:15 | 宝玉 | AI选择：闲谈·雪雁 [int:102:xueyan] provider=social |  | ai:decision |
| 第03日 17:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 17:15 | 黛玉 | AI选择：居家闲步 [w:home:7,28] provider=homeward |  | ai:decision |
| 第03日 17:17 | 宝玉 | 开始互动：与雪雁「闲谈」 |  | interaction:started |
| 第03日 17:22 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 17:22 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 17:25 | 宝玉 | AI目标频控：雪雁 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 17:25 | 宝玉 | 完成互动：与雪雁「闲谈」 |  | interaction:complete |
| 第03日 17:30 | 宝玉 | 行动入队：💬 闲谈·蓉哥儿 |  | queue:add |
| 第03日 17:30 | 宝玉 | 开始互动：与蓉哥儿「闲谈」 |  | interaction:started |
| 第03日 17:30 | 宝玉 | AI选择：闲谈·蓉哥儿 [int:102:jiarong] provider=social |  | ai:decision |
| 第03日 17:37 | 宝玉 | AI目标频控：蓉哥儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:37 | 宝玉 | 完成互动：与蓉哥儿「闲谈」 |  | interaction:complete |
| 第03日 17:45 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第03日 17:45 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第03日 17:45 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第03日 17:46 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:46 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture |  | ai:decision |
| 第03日 17:51 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 17:52 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:52 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第03日 17:53 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 17:53 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 17:54 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 17:54 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 17:56 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 17:56 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 17:59 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 17:59 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:00 | 宝玉 | 行动入队：💬 打趣·贾母 |  | queue:add |
| 第03日 18:00 | 宝玉 | AI选择：打趣·贾母 [int:301:jiamu] provider=social |  | ai:decision |
| 第03日 18:01 | 黛玉 | 任务失败：随侍黛玉，超时 | 黛玉 | quest:failed |
| 第03日 18:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:01 | 宝玉 | 开始互动：与贾母「打趣」 |  | interaction:started |
| 第03日 18:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:08 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:08 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:08 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:08 | 宝玉 | 完成互动：与贾母「打趣」 |  | interaction:complete |
| 第03日 18:09 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:09 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:10 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:10 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:12 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:12 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:14 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:14 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:15 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第03日 18:15 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第03日 18:16 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第03日 18:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:23 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 18:23 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第03日 18:23 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 18:24 | 黛玉 | 开始任务：陪黛玉读书 | 黛玉 | quest:started |
| 第03日 18:29 | 黛玉 | 完成任务：陪黛玉读书 | 黛玉 | quest:completed |
| 第03日 18:29 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第03日 18:30 | 宝玉 | 被大老爷发起互动：「打趣」 |  | interaction:started |
| 第03日 18:30 | 宝玉 | 被刘姥姥发起互动：「嬉闹」 |  | interaction:started |
| 第03日 18:31 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 18:31 | 宝玉 | 被琏二爷发起互动：「闲谈」 |  | interaction:started |
| 第03日 18:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:37 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第03日 18:37 | 宝玉 | 被大老爷完成互动：「打趣」 |  | interaction:complete |
| 第03日 18:38 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 18:38 | 宝玉 | 被琏二爷完成互动：「闲谈」 |  | interaction:complete |
| 第03日 18:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:39 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 18:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:39 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 18:45 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 18:45 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 18:45 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 18:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 18:45 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 18:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 18:45 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 18:45 | 宝玉 | 被刘姥姥完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 18:57 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 18:57 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第03日 19:00 | 宝玉 | 行动入队：💬 闲谈·宝钗 |  | queue:add |
| 第03日 19:00 | 宝玉 | AI选择：闲谈·宝钗 [int:102:baochai] provider=social |  | ai:decision |
| 第03日 19:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 19:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 19:01 | 宝玉 | 任务失败：随侍左右，超时 | 宝玉 | quest:failed |
| 第03日 19:09 | 宝玉 | 开始互动：与宝钗「闲谈」 |  | interaction:started |
| 第03日 19:09 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 19:10 | 黛玉 | 开始任务：抄写经文 | 王夫人 | quest:started |
| 第03日 19:15 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 19:16 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 19:16 | 宝玉 | 完成互动：与宝钗「闲谈」 |  | interaction:complete |
| 第03日 19:30 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第03日 19:30 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第03日 19:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 19:30 | 黛玉 | AI选择：居家闲步 [w:home:13,30] provider=homeward |  | ai:decision |
| 第03日 19:31 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 19:31 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 19:31 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 19:31 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 19:38 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第03日 19:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 19:45 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 19:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 19:46 | 黛玉 | 开始任务：抄写经文 | 王夫人 | quest:started |
| 第03日 19:49 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 19:51 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 19:51 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第03日 20:00 | 宝玉 | 下发任务给袭人：伺候就寝 | 宝玉 | quest:issued |
| 第03日 20:00 | 宝玉 | 接受任务：伺候就寝 | 宝玉 | quest:accepted |
| 第03日 20:00 | 宝玉 | 行动入队：🤝 对酌·琏二爷 |  | queue:add |
| 第03日 20:00 | 宝玉 | AI选择：对酌·琏二爷 [int:105:jialian] provider=social |  | ai:decision |
| 第03日 20:00 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 20:00 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第03日 20:00 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 20:01 | 黛玉 | 开始任务：抄写经文 | 王夫人 | quest:started |
| 第03日 20:01 | 黛玉 | 任务失败：作诗陪吟，超时 | 黛玉 | quest:failed |
| 第03日 20:01 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 20:02 | 黛玉 | 完成任务：抄写经文 | 王夫人 | quest:completed |
| 第03日 20:04 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第03日 20:08 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 20:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 20:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 20:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 20:15 | 黛玉 | AI选择：居家闲步 [w:home:12,34] provider=homeward |  | ai:decision |
| 第03日 20:21 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 20:22 | 黛玉 | 行动入队：💬 联句·紫鹃 |  | queue:add |
| 第03日 20:22 | 黛玉 | AI选择：联句·紫鹃 [int:204:zijuan] provider=social |  | ai:decision |
| 第03日 20:24 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第03日 20:24 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第03日 20:29 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第03日 20:34 | 黛玉 | 开始互动：与紫鹃「联句」 |  | interaction:started |
| 第03日 20:37 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 20:37 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第03日 20:41 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第03日 20:41 | 黛玉 | 完成互动：与紫鹃「联句」 |  | interaction:complete |
| 第03日 20:45 | 宝玉 | 行动入队：🤝 对酌·琏二爷 |  | queue:add |
| 第03日 20:45 | 宝玉 | AI选择：对酌·琏二爷 [int:105:jialian] provider=social |  | ai:decision |
| 第03日 20:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 20:45 | 黛玉 | AI选择：居家闲步 [w:home:3,33] provider=homeward |  | ai:decision |
| 第03日 20:45 | 宝玉 | 被琏二爷发起互动：「寒暄」 |  | interaction:started |
| 第03日 20:51 | 宝玉 | 被琏二爷完成互动：「寒暄」 |  | interaction:complete |
| 第03日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第03日 21:00 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第03日 21:00 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第03日 21:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 21:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 21:01 | 宝玉 | 任务失败：作诗陪吟，超时 | 政老爷 | quest:failed |
| 第03日 21:01 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第03日 21:01 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture |  | ai:decision |
| 第03日 21:02 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第03日 21:02 | 宝玉 | 被贾母发起互动：「嬉闹」 |  | interaction:started |
| 第03日 21:08 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 21:08 | 宝玉 | 被大老爷发起互动：「调侃」 |  | interaction:started |
| 第03日 21:09 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第03日 21:10 | 宝玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第03日 21:11 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 21:14 | 宝玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第03日 21:15 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第03日 21:15 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第03日 21:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 21:15 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 21:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 21:15 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 21:15 | 宝玉 | 被大老爷完成互动：「调侃」 |  | interaction:complete |
| 第03日 21:17 | 宝玉 | 被贾母完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 21:18 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 21:18 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 21:21 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 21:27 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 21:30 | 宝玉 | 行动入队：💬 辩理·刘姥姥 |  | queue:add |
| 第03日 21:30 | 宝玉 | AI选择：辩理·刘姥姥 [int:201:liulaolao] provider=social |  | ai:decision |
| 第03日 21:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:33 | 宝玉 | 行动入队：💬 评文·刘姥姥 |  | queue:add |
| 第03日 21:33 | 宝玉 | AI选择：评文·刘姥姥 [int:203:liulaolao] provider=social |  | ai:decision |
| 第03日 21:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:34 | 宝玉 | 开始互动：与刘姥姥「评文」 |  | interaction:started |
| 第03日 21:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:38 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 21:39 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 21:41 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 21:41 | 宝玉 | 完成互动：与刘姥姥「评文」 |  | interaction:complete |
| 第03日 21:45 | 宝玉 | 行动入队：💬 论禅·琏二爷 |  | queue:add |
| 第03日 21:45 | 宝玉 | AI选择：论禅·琏二爷 [int:205:jialian] provider=social |  | ai:decision |
| 第03日 21:45 | 黛玉 | 行动入队：💬 评文·凤姐 |  | queue:add |
| 第03日 21:45 | 黛玉 | AI选择：评文·凤姐 [int:203:xifeng] provider=social |  | ai:decision |
| 第03日 21:45 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 21:51 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 22:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:00 | 宝玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第03日 22:00 | 宝玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第03日 22:01 | 宝玉 | 开始互动：与莺儿「联句」 |  | interaction:started |
| 第03日 22:08 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 22:08 | 宝玉 | 完成互动：与莺儿「联句」 |  | interaction:complete |
| 第03日 22:08 | 宝玉 | 被袭人发起互动：「倾听」 |  | interaction:started |
| 第03日 22:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 22:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 22:15 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 22:15 | 宝玉 | 被袭人完成互动：「倾听」 |  | interaction:complete |
| 第03日 22:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 22:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 22:18 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:18 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:21 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 22:28 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 22:30 | 宝玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第03日 22:30 | 宝玉 | 开始互动：与宝钗「论禅」 |  | interaction:started |
| 第03日 22:30 | 宝玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第03日 22:30 | 黛玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第03日 22:30 | 黛玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第03日 22:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:37 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 22:37 | 宝玉 | 完成互动：与宝钗「论禅」 |  | interaction:complete |
| 第03日 22:45 | 宝玉 | 行动入队：💬 辩理·王夫人 |  | queue:add |
| 第03日 22:45 | 宝玉 | AI选择：辩理·王夫人 [int:201:wangfuren] provider=social |  | ai:decision |
| 第03日 22:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:49 | 宝玉 | 开始互动：与王夫人「辩理」 |  | interaction:started |
| 第03日 22:56 | 宝玉 | AI目标频控：王夫人 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 22:56 | 宝玉 | 完成互动：与王夫人「辩理」 |  | interaction:complete |
| 第03日 23:00 | 宝玉 | 行动入队：💬 联句·政老爷 |  | queue:add |
| 第03日 23:00 | 宝玉 | 开始互动：与政老爷「联句」 |  | interaction:started |
| 第03日 23:00 | 宝玉 | AI选择：联句·政老爷 [int:204:jiazheng] provider=social |  | ai:decision |
| 第03日 23:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 23:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 23:01 | 宝玉 | 任务失败：伺候就寝，超时 | 宝玉 | quest:failed |
| 第03日 23:02 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 23:03 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 23:03 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第03日 23:14 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 23:15 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 23:15 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 23:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 23:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 23:16 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 23:17 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 23:21 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 23:28 | 宝玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第03日 23:28 | 宝玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第03日 23:30 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 23:30 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 23:30 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 23:31 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 23:45 | 黛玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第03日 23:45 | 黛玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第03日 23:45 | 宝玉 | 开始互动：与莺儿「联句」 |  | interaction:started |
| 第03日 23:47 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 23:47 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 23:47 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 23:49 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 23:52 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 23:52 | 宝玉 | 完成互动：与莺儿「联句」 |  | interaction:complete |
| 第04日 00:00 | 全局 | 进入第4日 |  | time:day |
| 第04日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第04日 00:00 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第04日 00:00 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第04日 00:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第04日 00:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第04日 00:01 | 宝玉 | 行动入队：💬 评文·宝钗 |  | queue:add |
| 第04日 00:01 | 宝玉 | AI选择：评文·宝钗 [int:203:baochai] provider=social |  | ai:decision |
| 第04日 00:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第04日 00:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第04日 00:01 | 宝玉 | 开始互动：与宝钗「评文」 |  | interaction:started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| state:add | 17797 |
| state:remove | 17694 |
| need:band_changed | 14938 |
| log:add | 12217 |
| ai:state | 8684 |
| ai:decision | 5460 |
| queue:add | 5453 |
| time:tick | 3841 |
| character:effect | 2380 |
| need:combination_triggered | 2053 |
| scene:enter:allowed | 1801 |
| scene:entered | 1801 |
| relation:axis_change | 1717 |
| emotion:resisted | 1690 |
| furniture:use_started | 1066 |
| furniture:released | 1054 |
| interaction:started | 802 |
| interaction:effects | 717 |
| ai:social_target_cooldown | 717 |
| interaction:complete | 717 |
| quest:candidate | 710 |
| furniture:complete | 677 |
| quest:progress | 638 |
| ai:candidate_rejected | 543 |
| save:done | 431 |
| emotion:contagion | 409 |
| interaction:lowscore | 363 |
| interaction:state | 318 |
| relation:change | 312 |
| observer:triggered | 248 |
| observer:executed | 248 |
| quest:blocked | 222 |
| family:fund_changed | 149 |
| economy:food_paid | 140 |
| quest:started | 135 |
| servant:follow_state | 130 |
| state:refresh | 104 |
| time:hour | 64 |
| quest:issued | 63 |
| quest:accepted | 62 |
| furniture:reaction | 55 |
| trait:competition | 47 |
| need:critical | 38 |
| quest:completed | 36 |
| servant:relation_changed | 33 |
| quest:failed | 25 |
| invitation:sent | 22 |
| access:granted | 22 |
| invitation:expired | 22 |
| relation:threshold | 16 |
| money:change | 16 |
| invitation:accepted | 15 |
| trait:spending | 15 |
| time:period | 14 |
| reputation:change | 14 |
| economy:shift_started | 8 |
| economy:shift_ended | 8 |
| invitation:declined | 7 |
| servant:duty_issued | 6 |
| quest:acceptance_checked | 6 |
| lifePath:storyNode | 5 |
| queue:failed | 4 |
| servant:follow_rotation_issued | 4 |
| time:day | 3 |
| quest:primed_action | 2 |
| court | 2 |
| family:event | 2 |
| quest:declined | 1 |
