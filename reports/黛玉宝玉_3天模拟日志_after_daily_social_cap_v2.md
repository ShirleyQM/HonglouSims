# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、宝玉
- 模拟范围：第 1 日 08:00 到第 4 日 00:00 前
- 随机种子：61617
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第2日 宝玉 出现 6 次受阻/失败，可能有路径、权限或任务条件问题。
- 第2日 黛玉 出现 3 次受阻/失败，可能有路径、权限或任务条件问题。
- 第3日 宝玉 出现 3 次受阻/失败，可能有路径、权限或任务条件问题。
- 第3日 黛玉 出现 3 次受阻/失败，可能有路径、权限或任务条件问题。
- 第4日 黛玉 没有记录到社交完成事件，日常仍偏“自己找家具/任务”。

## 高频重复行为

- 黛玉：行动入队：🥟 在点心案 ×169
- 黛玉：AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture ×169
- 黛玉：行动入队：前往潇湘馆 ×57
- 黛玉：开始用家具：点心案 / default_use ×39
- 黛玉：行动入队：📋 在樟木案几 ×37
- 黛玉：AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture ×37
- 黛玉：行动入队：🛏️ 在雕花木床 ×37
- 黛玉：AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture ×37
- 黛玉：开始用家具：樟木案几 / default_use ×31
- 黛玉：完成用家具：樟木案几 / default_use ×27
- 宝玉：行动入队：📋 在樟木案几 ×25
- 宝玉：AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture ×25

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 215 | 63 | 29 | 26 | 16 | 2 |  08:01 行动入队：🛁 在浴盆； 08:01 AI选择：浴盆·使用浴盆 [furn:1003:default_use] provider=furniture； 08:01 开始用家具：浴盆 / default_use； 08:04 完成用家具：浴盆 / default_use； 08:15 行动入队：📚 翻闲书 |
| 1 | 宝玉 | 235 | 44 | 18 | 65 | 29 | 2 |  08:02 被袭人发起互动：「问安」； 08:09 被袭人完成互动：「问安」； 08:45 开始用家具：饭桌 / complain_food； 08:47 完成用家具：饭桌 / complain_food； 08:49 被晴雯发起互动：「寒暄」 |
| 2 | 黛玉 | 553 | 200 | 72 | 40 | 23 | 3 |  00:00 行动入队：📋 在樟木案几； 00:00 AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture； 00:01 开始用家具：樟木案几 / default_use； 00:03 完成用家具：樟木案几 / default_use； 00:05 被紫鹃发起互动：「倾听」 |
| 2 | 宝玉 | 383 | 84 | 28 | 89 | 40 | 6 |  00:00 行动入队：💬 论禅·大老爷； 00:00 AI选择：论禅·大老爷 [int:205:jiashe] provider=social； 00:15 行动入队：📋 在樟木案几； 00:15 AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture； 00:15 开始用家具：樟木案几 / default_use |
| 3 | 黛玉 | 451 | 147 | 76 | 25 | 45 | 3 |  00:00 行动入队：🛏️ 在雕花木床； 00:00 AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture； 00:15 行动入队：🛏️ 在雕花木床； 00:15 AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture； 00:30 行动入队：📋 在樟木案几 |
| 3 | 宝玉 | 514 | 78 | 13 | 216 | 16 | 3 |  00:00 行动入队：💬 论禅·莺儿； 00:00 AI选择：论禅·莺儿 [int:205:yinger] provider=social； 00:01 AI每日主动社交计数：莺儿 1/10； 00:01 开始互动：与莺儿「论禅」； 00:08 AI目标频控：莺儿 75分钟 |

## 最终状态

| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |
|---|---:|---|---|---|---:|---:|---:|---:|---:|
| 宝玉 | 2 | EXECUTING | 去找大老爷·论禅 | 💬 论禅·大老爷 | 75 | 90 | 94 | 100 | 100 |
| 黛玉 | 1 | IDLE | 闲庭漫步 |  | 31 | 60 | 84 | 100 | 100 |

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
| 第01日 08:30 | 黛玉 | 行动入队：🎵 抚琴自娱 |  | queue:add |
| 第01日 08:30 | 黛玉 | AI选择：琴台·抚琴自娱 [furn:1006:play_music] provider=furniture |  | ai:decision |
| 第01日 08:31 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 08:31 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第01日 08:35 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第01日 08:38 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第01日 08:45 | 黛玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 08:45 | 黛玉 | AI选择：竹榻·使用竹榻 [furn:1009:default_use] provider=furniture |  | ai:decision |
| 第01日 08:45 | 宝玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:47 | 宝玉 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:49 | 宝玉 | 被晴雯发起互动：「寒暄」 |  | interaction:started |
| 第01日 08:50 | 黛玉 | 行动入队：💬 论禅·雪雁 |  | queue:add |
| 第01日 08:50 | 黛玉 | AI选择：论禅·雪雁 [int:205:xueyan] provider=social |  | ai:decision |
| 第01日 08:50 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第01日 08:50 | 黛玉 | 开始互动：与雪雁「论禅」 |  | interaction:started |
| 第01日 08:53 | 宝玉 | 被麝月发起互动：「寒暄」 |  | interaction:started |
| 第01日 08:56 | 宝玉 | 被晴雯完成互动：「寒暄」 |  | interaction:complete |
| 第01日 08:57 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 08:57 | 黛玉 | 完成互动：与雪雁「论禅」 |  | interaction:complete |
| 第01日 08:58 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第01日 09:00 | 宝玉 | 下发任务给袭人：晨昏定省 | 宝玉 | quest:issued |
| 第01日 09:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 09:00 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第01日 09:00 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social |  | ai:decision |
| 第01日 09:00 | 黛玉 | 行动入队：🤝 对弈·紫鹃 |  | queue:add |
| 第01日 09:00 | 黛玉 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第01日 09:00 | 黛玉 | 开始互动：与紫鹃「对弈」 |  | interaction:started |
| 第01日 09:00 | 黛玉 | AI选择：对弈·紫鹃 [int:202:zijuan] provider=social |  | ai:decision |
| 第01日 09:01 | 宝玉 | 被麝月完成互动：「寒暄」 |  | interaction:complete |
| 第01日 09:04 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第01日 09:14 | 宝玉 | 行动入队：💬 问安·贾母 |  | queue:add |
| 第01日 09:14 | 宝玉 | AI选择：问安·贾母 [int:103:jiamu] provider=social |  | ai:decision |
| 第01日 09:17 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第01日 09:17 | 黛玉 | 完成互动：与紫鹃「对弈」 |  | interaction:complete |
| 第01日 09:30 | 黛玉 | 行动入队：💬 评文·琏二爷 |  | queue:add |
| 第01日 09:30 | 黛玉 | AI选择：评文·琏二爷 [int:203:jialian] provider=social |  | ai:decision |
| 第01日 09:34 | 黛玉 | 行动入队：💬 评文·宝玉 |  | queue:add |
| 第01日 09:34 | 黛玉 | AI选择：评文·宝玉 [int:203:baoyu] provider=social |  | ai:decision |
| 第01日 09:39 | 宝玉 | AI每日主动社交计数：贾母 1/10 |  | ai:daily_social_count |
| 第01日 09:39 | 宝玉 | 开始互动：与贾母「问安」 |  | interaction:started |
| 第01日 09:46 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 09:46 | 宝玉 | 完成互动：与贾母「问安」 |  | interaction:complete |
| 第01日 10:00 | 宝玉 | 下发任务给麝月：洒扫庭院 | 宝玉 | quest:issued |
| 第01日 10:00 | 宝玉 | 接受任务：洒扫庭院 | 宝玉 | quest:accepted |
| 第01日 10:00 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第01日 10:00 | 宝玉 | AI选择：逛园 [w:pub:15,13] provider=homeward |  | ai:decision |
| 第01日 10:02 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第01日 10:35 | 黛玉 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 10:35 | 黛玉 | 开始互动：与宝玉「评文」 |  | interaction:started |
| 第01日 10:35 | 宝玉 | 被黛玉发起互动：「评文」 |  | interaction:started |
| 第01日 10:43 | 黛玉 | AI目标频控：宝玉 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 10:43 | 黛玉 | 完成互动：与宝玉「评文」 |  | interaction:complete |
| 第01日 10:43 | 宝玉 | 被黛玉完成互动：「评文」 |  | interaction:complete |
| 第01日 10:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 10:45 | 黛玉 | AI选择：居家闲步 [w:home:3,30] provider=homeward |  | ai:decision |
| 第01日 10:47 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 10:47 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 11:00 | 黛玉 | 下发任务给紫鹃：备膳 | 黛玉 | quest:issued |
| 第01日 11:00 | 黛玉 | 接受任务：备膳 | 黛玉 | quest:accepted |
| 第01日 11:00 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第01日 11:00 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第01日 11:03 | 黛玉 | 完成任务：备膳 | 黛玉 | quest:completed |
| 第01日 11:18 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第01日 11:18 | 宝玉 | AI选择：逛园 [w:pub:32,19] provider=homeward |  | ai:decision |
| 第01日 11:21 | 宝玉 | 被袭人发起互动：「品茗」 |  | interaction:started |
| 第01日 11:22 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第01日 11:32 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 11:32 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 11:34 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第01日 11:34 | 宝玉 | 被袭人完成互动：「品茗」 |  | interaction:complete |
| 第01日 11:35 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第01日 11:38 | 宝玉 | 完成任务：洒扫庭院 | 宝玉 | quest:completed |
| 第01日 11:43 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 11:45 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第01日 11:45 | 宝玉 | AI选择：逛园 [w:pub:15,16] provider=homeward |  | ai:decision |
| 第01日 11:49 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 12:00 | 宝玉 | 下发任务给晴雯：晨昏定省 | 宝玉 | quest:issued |
| 第01日 12:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第01日 12:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 12:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 12:03 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第01日 12:08 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第01日 12:15 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第01日 12:15 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第01日 12:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 12:15 | 黛玉 | AI选择：居家闲步 [w:home:3,30] provider=homeward |  | ai:decision |
| 第01日 12:17 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第01日 12:17 | 宝玉 | AI选择：逛园 [w:pub:13,9] provider=homeward |  | ai:decision |
| 第01日 12:27 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第01日 12:34 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第01日 12:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 12:45 | 黛玉 | AI选择：居家闲步 [w:home:3,30] provider=homeward |  | ai:decision |
| 第01日 12:45 | 宝玉 | 被晴雯发起互动：「问安」 |  | interaction:started |
| 第01日 12:46 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第01日 12:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 12:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 12:50 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第01日 12:51 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第01日 12:52 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第01日 12:52 | 宝玉 | 被晴雯完成互动：「问安」 |  | interaction:complete |
| 第01日 12:53 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第01日 12:53 | 宝玉 | AI选择：逛园 [w:pub:15,24] provider=homeward |  | ai:decision |
| 第01日 13:00 | 黛玉 | 下发任务给紫鹃：传话 | 黛玉 | quest:issued |
| 第01日 13:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第01日 13:00 | 黛玉 | 行动入队：💬 论禅·凤姐 |  | queue:add |
| 第01日 13:00 | 黛玉 | AI选择：论禅·凤姐 [int:205:xifeng] provider=social |  | ai:decision |
| 第01日 13:07 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第01日 13:07 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social |  | ai:decision |
| 第01日 13:26 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第01日 13:26 | 宝玉 | AI选择：逛园 [w:pub:15,17] provider=homeward |  | ai:decision |
| 第01日 13:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 13:30 | 黛玉 | AI选择：居家闲步 [w:home:10,34] provider=homeward |  | ai:decision |
| 第01日 13:45 | 黛玉 | 行动入队：💬 评文·探春 |  | queue:add |
| 第01日 13:45 | 黛玉 | AI选择：评文·探春 [int:203:tanchun] provider=social |  | ai:decision |
| 第01日 14:00 | 黛玉 | 下发任务给紫鹃：陪黛玉读书 | 黛玉 | quest:issued |
| 第01日 14:00 | 黛玉 | 接受任务：陪黛玉读书 | 黛玉 | quest:accepted |
| 第01日 14:00 | 宝玉 | 下发任务给麝月：备膳 | 宝玉 | quest:issued |
| 第01日 14:00 | 宝玉 | 接受任务：备膳 | 宝玉 | quest:accepted |
| 第01日 14:00 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第01日 14:00 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第01日 14:14 | 黛玉 | AI每日主动社交计数：探春 1/10 |  | ai:daily_social_count |
| 第01日 14:14 | 黛玉 | 开始互动：与探春「评文」 |  | interaction:started |
| 第01日 14:21 | 黛玉 | AI目标频控：探春 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 14:21 | 黛玉 | 完成互动：与探春「评文」 |  | interaction:complete |
| 第01日 14:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 14:30 | 黛玉 | AI选择：居家闲步 [w:home:10,33] provider=homeward |  | ai:decision |
| 第01日 14:41 | 宝玉 | AI每日主动社交计数：莺儿 1/10 |  | ai:daily_social_count |
| 第01日 14:41 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第01日 14:49 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 14:49 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第01日 15:00 | 宝玉 | 任务下发：晨昏定省 | 政老爷 | quest:issued |
| 第01日 15:00 | 宝玉 | 接受任务：晨昏定省 | 政老爷 | quest:accepted |
| 第01日 15:00 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第01日 15:00 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第01日 15:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 15:00 | 黛玉 | AI选择：居家闲步 [w:home:10,32] provider=homeward |  | ai:decision |
| 第01日 15:01 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 15:01 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 15:03 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 15:09 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 15:15 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 15:15 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第01日 15:16 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 15:16 | 黛玉 | AI选择：闲游 [w:7,34] provider=wander |  | ai:decision |
| 第01日 15:16 | 宝玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第01日 15:16 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第01日 15:21 | 黛玉 | 行动入队：💬 辩理·来旺 |  | queue:add |
| 第01日 15:21 | 黛玉 | AI选择：辩理·来旺 [int:201:laiwang] provider=social |  | ai:decision |
| 第01日 15:35 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 15:35 | 宝玉 | 完成互动：与宝钗「对酌」 |  | interaction:complete |
| 第01日 15:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 15:45 | 黛玉 | AI选择：居家闲步 [w:home:7,34] provider=homeward |  | ai:decision |
| 第01日 15:45 | 宝玉 | 行动入队：💬 闲谈·刘姥姥 |  | queue:add |
| 第01日 15:45 | 宝玉 | AI选择：闲谈·刘姥姥 [int:102:liulaolao] provider=social |  | ai:decision |
| 第01日 15:46 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第01日 15:46 | 宝玉 | AI选择：逛园 [w:pub:9,25] provider=homeward |  | ai:decision |
| 第01日 16:00 | 宝玉 | 下发任务给袭人：作诗陪吟 | 宝玉 | quest:issued |
| 第01日 16:00 | 宝玉 | 接受任务：作诗陪吟 | 宝玉 | quest:accepted |
| 第01日 16:01 | 黛玉 | 任务失败：传话，超时 | 黛玉 | quest:failed |
| 第01日 16:09 | 黛玉 | 行动入队：💬 评文·紫鹃 |  | queue:add |
| 第01日 16:09 | 黛玉 | AI选择：评文·紫鹃 [int:203:zijuan] provider=social |  | ai:decision |
| 第01日 16:15 | 黛玉 | AI每日主动社交计数：紫鹃 2/10 |  | ai:daily_social_count |
| 第01日 16:15 | 黛玉 | 开始互动：与紫鹃「评文」 |  | interaction:started |
| 第01日 16:22 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第01日 16:22 | 黛玉 | 完成互动：与紫鹃「评文」 |  | interaction:complete |
| 第01日 16:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 16:30 | 黛玉 | AI选择：居家闲步 [w:home:8,33] provider=homeward |  | ai:decision |
| 第01日 16:36 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第01日 16:36 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social |  | ai:decision |
| 第01日 16:43 | 黛玉 | AI每日主动社交计数：雪雁 2/10 |  | ai:daily_social_count |
| 第01日 16:43 | 黛玉 | 开始互动：与雪雁「评文」 |  | interaction:started |
| 第01日 16:45 | 宝玉 | 行动入队：🤝 品茗·麝月 |  | queue:add |
| 第01日 16:45 | 宝玉 | AI选择：品茗·麝月 [int:104:sheyue] provider=social |  | ai:decision |
| 第01日 16:50 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 16:50 | 黛玉 | 完成互动：与雪雁「评文」 |  | interaction:complete |
| 第01日 17:00 | 黛玉 | 下发任务给紫鹃：晨昏定省 | 黛玉 | quest:issued |
| 第01日 17:00 | 黛玉 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第01日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第01日 17:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 17:00 | 黛玉 | AI选择：闲游 [w:10,34] provider=wander |  | ai:decision |
| 第01日 17:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 17:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 17:05 | 宝玉 | 完成任务：备膳 | 宝玉 | quest:completed |
| 第01日 17:14 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第01日 17:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 17:15 | 黛玉 | AI选择：居家闲步 [w:home:6,33] provider=homeward |  | ai:decision |
| 第01日 17:25 | 宝玉 | AI每日主动社交计数：麝月 1/10 |  | ai:daily_social_count |
| 第01日 17:25 | 宝玉 | 开始互动：与麝月「品茗」 |  | interaction:started |
| 第01日 17:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 17:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 17:34 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 17:38 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 17:38 | 宝玉 | 完成互动：与麝月「品茗」 |  | interaction:complete |
| 第01日 17:40 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 17:45 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第01日 17:45 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第01日 17:45 | 黛玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第01日 17:45 | 黛玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第01日 17:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 17:46 | 黛玉 | AI选择：闲游 [w:7,33] provider=wander |  | ai:decision |
| 第01日 17:46 | 宝玉 | AI每日主动社交计数：莺儿 2/10 |  | ai:daily_social_count |
| 第01日 17:46 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第01日 17:59 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 17:59 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第01日 18:00 | 黛玉 | 下发任务给雪雁：服侍更衣 | 黛玉 | quest:issued |
| 第01日 18:00 | 黛玉 | 接受任务：服侍更衣 | 黛玉 | quest:accepted |
| 第01日 18:00 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第01日 18:00 | 宝玉 | AI每日主动社交计数：大老爷 1/10 |  | ai:daily_social_count |
| 第01日 18:00 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第01日 18:00 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第01日 18:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 18:00 | 黛玉 | AI选择：居家闲步 [w:home:9,31] provider=homeward |  | ai:decision |
| 第01日 18:00 | 黛玉 | 被雪雁发起互动：「问安」 |  | interaction:started |
| 第01日 18:01 | 黛玉 | 开始任务：服侍更衣 | 黛玉 | quest:started |
| 第01日 18:01 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第01日 18:01 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第01日 18:02 | 宝玉 | 被莺儿发起互动：「寒暄」 |  | interaction:started |
| 第01日 18:05 | 黛玉 | 完成任务：服侍更衣 | 黛玉 | quest:completed |
| 第01日 18:07 | 黛玉 | 被雪雁完成互动：「问安」 |  | interaction:complete |
| 第01日 18:09 | 宝玉 | 被莺儿完成互动：「寒暄」 |  | interaction:complete |
| 第01日 18:11 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第01日 18:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 18:15 | 黛玉 | AI选择：闲游 [w:9,33] provider=wander |  | ai:decision |
| 第01日 18:15 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第01日 18:30 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第01日 18:30 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第01日 18:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 18:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 18:32 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 18:32 | 黛玉 | AI选择：居家闲步 [w:home:10,31] provider=homeward |  | ai:decision |
| 第01日 18:33 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第01日 18:39 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第01日 18:43 | 宝玉 | AI每日主动社交计数：宝钗 2/10 |  | ai:daily_social_count |
| 第01日 18:43 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第01日 18:45 | 黛玉 | 行动入队：💬 辩理·雪雁 |  | queue:add |
| 第01日 18:45 | 黛玉 | AI选择：辩理·雪雁 [int:201:xueyan] provider=social |  | ai:decision |
| 第01日 18:49 | 黛玉 | AI每日主动社交计数：雪雁 3/10 |  | ai:daily_social_count |
| 第01日 18:49 | 黛玉 | 开始互动：与雪雁「辩理」 |  | interaction:started |
| 第01日 18:56 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 18:56 | 黛玉 | 完成互动：与雪雁「辩理」 |  | interaction:complete |
| 第01日 18:58 | 宝玉 | 被大老爷发起互动：「问安」 |  | interaction:started |
| 第01日 19:00 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第01日 19:00 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social |  | ai:decision |
| 第01日 19:02 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第01日 19:02 | 宝玉 | 完成互动：与宝钗「对酌」 |  | interaction:complete |
| 第01日 19:05 | 宝玉 | 被大老爷完成互动：「问安」 |  | interaction:complete |
| 第01日 19:15 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第01日 19:15 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第01日 19:15 | 宝玉 | AI每日主动社交计数：大老爷 2/10 |  | ai:daily_social_count |
| 第01日 19:15 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第01日 19:22 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第01日 19:22 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第01日 19:30 | 宝玉 | 行动入队：💬 闲谈·刘姥姥 |  | queue:add |
| 第01日 19:30 | 宝玉 | AI每日主动社交计数：刘姥姥 1/10 |  | ai:daily_social_count |
| 第01日 19:30 | 宝玉 | 开始互动：与刘姥姥「闲谈」 |  | interaction:started |
| 第01日 19:30 | 宝玉 | AI选择：闲谈·刘姥姥 [int:102:liulaolao] provider=social |  | ai:decision |
| 第01日 19:33 | 宝玉 | 被刘姥姥发起互动：「品茗」 |  | interaction:started |
| 第01日 19:37 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第01日 19:37 | 宝玉 | 完成互动：与刘姥姥「闲谈」 |  | interaction:complete |
| 第01日 19:45 | 宝玉 | 行动入队：🤝 品茗·琏二爷 |  | queue:add |
| 第01日 19:45 | 宝玉 | AI选择：品茗·琏二爷 [int:104:jialian] provider=social |  | ai:decision |
| 第01日 19:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 19:45 | 黛玉 | AI选择：居家闲步 [w:home:6,31] provider=homeward |  | ai:decision |
| 第01日 19:46 | 宝玉 | 被刘姥姥完成互动：「品茗」 |  | interaction:complete |
| 第01日 19:50 | 宝玉 | AI每日主动社交计数：琏二爷 1/10 |  | ai:daily_social_count |
| 第01日 19:50 | 宝玉 | 开始互动：与琏二爷「品茗」 |  | interaction:started |
| 第01日 19:58 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第01日 19:58 | 宝玉 | 被琏二爷发起互动：「品茗」 |  | interaction:started |
| 第01日 20:00 | 宝玉 | 下发任务给袭人：伺候就寝 | 宝玉 | quest:issued |
| 第01日 20:00 | 宝玉 | 接受任务：伺候就寝 | 宝玉 | quest:accepted |
| 第01日 20:00 | 宝玉 | 被宝钗发起互动：「品茗」 |  | interaction:started |
| 第01日 20:01 | 黛玉 | 任务失败：陪黛玉读书，超时 | 黛玉 | quest:failed |
| 第01日 20:01 | 宝玉 | 任务失败：作诗陪吟，超时 | 宝玉 | quest:failed |
| 第01日 20:03 | 宝玉 | AI目标频控：琏二爷 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:03 | 宝玉 | 完成互动：与琏二爷「品茗」 |  | interaction:complete |
| 第01日 20:05 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第01日 20:11 | 宝玉 | 被琏二爷完成互动：「品茗」 |  | interaction:complete |
| 第01日 20:13 | 宝玉 | 被宝钗完成互动：「品茗」 |  | interaction:complete |
| 第01日 20:14 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 20:14 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 20:14 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 20:15 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第01日 20:15 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第01日 20:19 | 宝玉 | AI每日主动社交计数：莺儿 3/10 |  | ai:daily_social_count |
| 第01日 20:19 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第01日 20:20 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 20:26 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:26 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第01日 20:30 | 宝玉 | 行动入队：💬 闲谈·宝钗 |  | queue:add |
| 第01日 20:30 | 宝玉 | AI选择：闲谈·宝钗 [int:102:baochai] provider=social |  | ai:decision |
| 第01日 20:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 20:30 | 黛玉 | AI选择：居家闲步 [w:home:4,28] provider=homeward |  | ai:decision |
| 第01日 20:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 20:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第01日 20:34 | 宝玉 | AI每日主动社交计数：宝钗 3/10 |  | ai:daily_social_count |
| 第01日 20:34 | 宝玉 | 开始互动：与宝钗「闲谈」 |  | interaction:started |
| 第01日 20:41 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:41 | 宝玉 | 完成互动：与宝钗「闲谈」 |  | interaction:complete |
| 第01日 20:44 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第01日 20:45 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第01日 20:45 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第01日 20:45 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第01日 20:47 | 宝玉 | AI每日主动社交计数：大老爷 3/10 |  | ai:daily_social_count |
| 第01日 20:47 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第01日 20:55 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:55 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第01日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第01日 21:00 | 宝玉 | 行动入队：🧼 在铜面盆 |  | queue:add |
| 第01日 21:00 | 宝玉 | AI选择：铜面盆·使用铜面盆 [furn:2008:default_use] provider=furniture |  | ai:decision |
| 第01日 21:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 21:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 21:00 | 宝玉 | 被贾母发起互动：「倾听」 |  | interaction:started |
| 第01日 21:03 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第01日 21:03 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第01日 21:04 | 黛玉 | AI每日主动社交计数：紫鹃 3/10 |  | ai:daily_social_count |
| 第01日 21:04 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第01日 21:07 | 宝玉 | 被贾母完成互动：「倾听」 |  | interaction:complete |
| 第01日 21:11 | 黛玉 | 完成任务：晨昏定省 | 黛玉 | quest:completed |
| 第01日 21:11 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第01日 21:11 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第01日 21:11 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第01日 21:13 | 宝玉 | 行动入队：👘 在梳洗妆台 |  | queue:add |
| 第01日 21:13 | 宝玉 | AI选择：梳洗妆台·使用梳洗妆台 [furn:2007:default_use] provider=furniture |  | ai:decision |
| 第01日 21:14 | 宝玉 | 开始用家具：梳洗妆台 / default_use |  | furniture:use_started |
| 第01日 21:19 | 宝玉 | 完成用家具：梳洗妆台 / default_use |  | furniture:complete |
| 第01日 21:19 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第01日 21:22 | 宝玉 | 被王夫人发起互动：「寒暄」 |  | interaction:started |
| 第01日 21:29 | 宝玉 | 被王夫人完成互动：「寒暄」 |  | interaction:complete |
| 第01日 21:30 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第01日 21:30 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第01日 21:30 | 黛玉 | 行动入队：🤝 对弈·探春 |  | queue:add |
| 第01日 21:30 | 黛玉 | AI选择：对弈·探春 [int:202:tanchun] provider=social |  | ai:decision |
| 第01日 21:33 | 宝玉 | AI每日主动社交计数：刘姥姥 2/10 |  | ai:daily_social_count |
| 第01日 21:33 | 宝玉 | 开始互动：与刘姥姥「对弈」 |  | interaction:started |
| 第01日 21:40 | 黛玉 | AI每日主动社交计数：探春 2/10 |  | ai:daily_social_count |
| 第01日 21:40 | 黛玉 | 开始互动：与探春「对弈」 |  | interaction:started |
| 第01日 21:51 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第01日 21:51 | 宝玉 | 完成互动：与刘姥姥「对弈」 |  | interaction:complete |
| 第01日 21:58 | 黛玉 | AI目标频控：探春 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 21:58 | 黛玉 | 完成互动：与探春「对弈」 |  | interaction:complete |
| 第01日 22:00 | 宝玉 | 行动入队：💬 论禅·莺儿 |  | queue:add |
| 第01日 22:00 | 宝玉 | AI每日主动社交计数：莺儿 4/10 |  | ai:daily_social_count |
| 第01日 22:00 | 宝玉 | 开始互动：与莺儿「论禅」 |  | interaction:started |
| 第01日 22:00 | 宝玉 | AI选择：论禅·莺儿 [int:205:yinger] provider=social |  | ai:decision |
| 第01日 22:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 22:04 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第01日 22:07 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 22:07 | 宝玉 | 完成互动：与莺儿「论禅」 |  | interaction:complete |
| 第01日 22:15 | 宝玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第01日 22:15 | 宝玉 | AI每日主动社交计数：宝钗 4/10 |  | ai:daily_social_count |
| 第01日 22:15 | 宝玉 | 开始互动：与宝钗「论禅」 |  | interaction:started |
| 第01日 22:15 | 宝玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第01日 22:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 22:15 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:17 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:21 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第01日 22:21 | 宝玉 | 完成互动：与宝钗「论禅」 |  | interaction:complete |
| 第01日 22:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 22:30 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 22:30 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第01日 22:30 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 22:31 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 22:31 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第01日 22:31 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:31 | 宝玉 | 任务下发：罚抄《四书》 | 政老爷 | quest:issued |
| 第01日 22:31 | 宝玉 | 接受任务：罚抄《四书》 | 政老爷 | quest:accepted |
| 第01日 22:32 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:32 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第01日 22:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 22:32 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第01日 22:37 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:45 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第01日 22:45 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第01日 22:45 | 黛玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第01日 22:45 | 黛玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第01日 22:46 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:46 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第01日 22:46 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 22:46 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第01日 22:46 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第01日 22:47 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:47 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 23:00 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:00 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:00 | 黛玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第01日 23:00 | 黛玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第01日 23:01 | 宝玉 | 任务失败：伺候就寝，超时 | 宝玉 | quest:failed |
| 第01日 23:02 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:02 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:02 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:03 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:03 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:03 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:03 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:04 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:04 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:04 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:04 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 23:04 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 23:04 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 23:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:15 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 23:15 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:16 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:17 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:17 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:17 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:17 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 23:21 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:21 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:21 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 23:22 | 宝玉 | 行动入队：💬 辩理·莺儿 |  | queue:add |
| 第01日 23:22 | 宝玉 | AI选择：辩理·莺儿 [int:201:yinger] provider=social |  | ai:decision |
| 第01日 23:22 | 宝玉 | AI每日主动社交计数：莺儿 5/10 |  | ai:daily_social_count |
| 第01日 23:22 | 宝玉 | 开始互动：与莺儿「辩理」 |  | interaction:started |
| 第01日 23:29 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 23:29 | 宝玉 | 完成互动：与莺儿「辩理」 |  | interaction:complete |
| 第01日 23:30 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第01日 23:30 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第01日 23:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 23:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 23:31 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第01日 23:34 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第01日 23:45 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第01日 23:45 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第01日 23:45 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 23:45 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第01日 23:45 | 宝玉 | AI每日主动社交计数：宝钗 5/10 |  | ai:daily_social_count |
| 第01日 23:45 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第01日 23:47 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 23:47 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 23:52 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第01日 23:52 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第02日 00:00 | 全局 | 进入第2日 |  | time:day |
| 第02日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第02日 00:00 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第02日 00:00 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第02日 00:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 00:01 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:03 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:05 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 00:13 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 00:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 00:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 00:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 00:15 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:16 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 00:16 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:27 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 00:28 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 00:30 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 00:30 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第02日 00:30 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第02日 00:30 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第02日 00:38 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第02日 00:38 | 黛玉 | 开始互动：与雪雁「联句」 |  | interaction:started |
| 第02日 00:45 | 宝玉 | 行动入队：💬 辩理·莺儿 |  | queue:add |
| 第02日 00:45 | 宝玉 | AI选择：辩理·莺儿 [int:201:yinger] provider=social |  | ai:decision |
| 第02日 00:45 | 宝玉 | AI每日主动社交计数：莺儿 1/10 |  | ai:daily_social_count |
| 第02日 00:45 | 宝玉 | 开始互动：与莺儿「辩理」 |  | interaction:started |
| 第02日 00:45 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 00:45 | 黛玉 | 完成互动：与雪雁「联句」 |  | interaction:complete |
| 第02日 00:52 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 00:52 | 宝玉 | 完成互动：与莺儿「辩理」 |  | interaction:complete |
| 第02日 01:00 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第02日 01:00 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第02日 01:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:00 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 01:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 01:01 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:01 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:03 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:04 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:04 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:15 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第02日 01:15 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第02日 01:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 01:17 | 宝玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第02日 01:17 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第02日 01:17 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:21 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:25 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 01:25 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第02日 01:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:30 | 黛玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第02日 01:30 | 黛玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第02日 01:31 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:32 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:32 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:33 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:33 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 01:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:45 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 01:46 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:47 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:47 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:47 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:48 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:48 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:48 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 01:53 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 02:00 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 02:00 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第02日 02:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:00 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 02:02 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 02:15 | 宝玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第02日 02:15 | 宝玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第02日 02:15 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 02:15 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 02:15 | 宝玉 | AI每日主动社交计数：莺儿 2/10 |  | ai:daily_social_count |
| 第02日 02:15 | 宝玉 | 开始互动：与莺儿「评文」 |  | interaction:started |
| 第02日 02:16 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:16 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:18 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 02:18 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 02:22 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 02:22 | 宝玉 | 完成互动：与莺儿「评文」 |  | interaction:complete |
| 第02日 02:30 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第02日 02:30 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第02日 02:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 02:32 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:33 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:33 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 02:33 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:33 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 02:45 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第02日 02:45 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第02日 02:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 02:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 02:45 | 宝玉 | AI每日主动社交计数：宝钗 2/10 |  | ai:daily_social_count |
| 第02日 02:45 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第02日 02:49 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 02:49 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 02:52 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 02:52 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第02日 02:57 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 02:57 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 02:57 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 02:58 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 02:58 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 02:58 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 02:58 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 03:00 | 宝玉 | 行动入队：💬 评文·大老爷 |  | queue:add |
| 第02日 03:00 | 宝玉 | AI每日主动社交计数：大老爷 1/10 |  | ai:daily_social_count |
| 第02日 03:00 | 宝玉 | 开始互动：与大老爷「评文」 |  | interaction:started |
| 第02日 03:00 | 宝玉 | AI选择：评文·大老爷 [int:203:jiashe] provider=social |  | ai:decision |
| 第02日 03:00 | 黛玉 | 行动入队：🤝 对弈·雪雁 |  | queue:add |
| 第02日 03:00 | 黛玉 | AI选择：对弈·雪雁 [int:202:xueyan] provider=social |  | ai:decision |
| 第02日 03:01 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:01 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:01 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:02 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 03:02 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:02 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:02 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:02 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 03:05 | 黛玉 | AI每日主动社交计数：雪雁 2/10 |  | ai:daily_social_count |
| 第02日 03:05 | 黛玉 | 开始互动：与雪雁「对弈」 |  | interaction:started |
| 第02日 03:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:15 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:16 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 03:16 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:16 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:16 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:18 | 宝玉 | 完成任务：罚抄《四书》 | 政老爷 | quest:completed |
| 第02日 03:21 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 03:23 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 03:23 | 黛玉 | 完成互动：与雪雁「对弈」 |  | interaction:complete |
| 第02日 03:30 | 宝玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第02日 03:30 | 宝玉 | AI选择：竹榻·使用竹榻 [furn:2009:default_use] provider=furniture |  | ai:decision |
| 第02日 03:30 | 黛玉 | 行动入队：💬 评文·王夫人 |  | queue:add |
| 第02日 03:30 | 黛玉 | AI选择：评文·王夫人 [int:203:wangfuren] provider=social |  | ai:decision |
| 第02日 03:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 03:32 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 03:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 03:32 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 03:45 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第02日 03:45 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第02日 03:45 | 黛玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第02日 03:45 | 黛玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第02日 03:45 | 宝玉 | AI每日主动社交计数：莺儿 3/10 |  | ai:daily_social_count |
| 第02日 03:45 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第02日 03:46 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 03:46 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 03:46 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 03:46 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 04:00 | 宝玉 | 下发任务给袭人：晨起伺候 | 宝玉 | quest:issued |
| 第02日 04:00 | 宝玉 | 接受任务：晨起伺候 | 宝玉 | quest:accepted |
| 第02日 04:00 | 黛玉 | 下发任务给紫鹃：晨起伺候黛玉 | 黛玉 | quest:issued |
| 第02日 04:00 | 黛玉 | 接受任务：晨起伺候黛玉 | 黛玉 | quest:accepted |
| 第02日 04:00 | 黛玉 | 开始任务：晨起伺候黛玉 | 黛玉 | quest:started |
| 第02日 04:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 04:03 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 04:03 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 04:03 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 04:03 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 04:03 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第02日 04:03 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 04:15 | 宝玉 | 行动入队：🤝 对弈·宝钗 |  | queue:add |
| 第02日 04:15 | 宝玉 | AI选择：对弈·宝钗 [int:202:baochai] provider=social |  | ai:decision |
| 第02日 04:15 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 04:15 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 04:15 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 04:15 | 宝玉 | AI每日主动社交计数：宝钗 3/10 |  | ai:daily_social_count |
| 第02日 04:15 | 宝玉 | 开始互动：与宝钗「对弈」 |  | interaction:started |
| 第02日 04:15 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 04:29 | 黛玉 | 完成任务：晨起伺候黛玉 | 黛玉 | quest:completed |
| 第02日 04:30 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 04:30 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 04:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:33 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 04:33 | 宝玉 | 完成互动：与宝钗「对弈」 |  | interaction:complete |
| 第02日 04:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:36 | 黛玉 | 行动入队：💬 联句·紫鹃 |  | queue:add |
| 第02日 04:36 | 黛玉 | AI选择：联句·紫鹃 [int:204:zijuan] provider=social |  | ai:decision |
| 第02日 04:40 | 黛玉 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第02日 04:40 | 黛玉 | 开始互动：与紫鹃「联句」 |  | interaction:started |
| 第02日 04:45 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第02日 04:45 | 宝玉 | AI每日主动社交计数：大老爷 2/10 |  | ai:daily_social_count |
| 第02日 04:45 | 宝玉 | 开始互动：与大老爷「对弈」 |  | interaction:started |
| 第02日 04:45 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第02日 04:47 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第02日 04:47 | 黛玉 | 完成互动：与紫鹃「联句」 |  | interaction:complete |
| 第02日 04:50 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:50 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 04:51 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 04:53 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 05:00 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第02日 05:00 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第02日 05:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 05:00 | 黛玉 | AI选择：居家闲步 [w:home:6,31] provider=homeward |  | ai:decision |
| 第02日 05:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:01 | 宝玉 | AI每日主动社交计数：大老爷 3/10 |  | ai:daily_social_count |
| 第02日 05:01 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第02日 05:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:09 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:09 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:09 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:10 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:10 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:10 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:10 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 05:14 | 宝玉 | AI选择：逛园 [w:pub:29,8] provider=homeward |  | ai:decision |
| 第02日 05:15 | 宝玉 | AI选择：闲游 [w:1,7] provider=wander |  | ai:decision |
| 第02日 05:15 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第02日 05:15 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social |  | ai:decision |
| 第02日 05:16 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 05:20 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第02日 05:20 | 宝玉 | AI每日主动社交计数：莺儿 4/10 |  | ai:daily_social_count |
| 第02日 05:20 | 宝玉 | 开始互动：与莺儿「对酌」 |  | interaction:started |
| 第02日 05:20 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social |  | ai:decision |
| 第02日 05:23 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 05:35 | 黛玉 | AI每日主动社交计数：雪雁 3/10 |  | ai:daily_social_count |
| 第02日 05:35 | 黛玉 | 开始互动：与雪雁「评文」 |  | interaction:started |
| 第02日 05:38 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 05:38 | 宝玉 | 完成互动：与莺儿「对酌」 |  | interaction:complete |
| 第02日 05:43 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 05:43 | 黛玉 | 完成互动：与雪雁「评文」 |  | interaction:complete |
| 第02日 05:45 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第02日 05:45 | 宝玉 | AI选择：闲游 [w:5,10] provider=wander |  | ai:decision |
| 第02日 05:45 | 黛玉 | 行动入队：🤝 对弈·琏二爷 |  | queue:add |
| 第02日 05:45 | 黛玉 | AI选择：对弈·琏二爷 [int:202:jialian] provider=social |  | ai:decision |
| 第02日 05:45 | 宝玉 | 被莺儿发起互动：「对酌」 |  | interaction:started |
| 第02日 05:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 05:46 | 黛玉 | AI选择：居家闲步 [w:home:10,28] provider=homeward |  | ai:decision |
| 第02日 06:00 | 宝玉 | 下发任务给麝月：随侍左右 | 宝玉 | quest:issued |
| 第02日 06:00 | 宝玉 | 接受任务：随侍左右 | 宝玉 | quest:accepted |
| 第02日 06:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 06:00 | 黛玉 | AI选择：居家闲步 [w:home:8,30] provider=homeward |  | ai:decision |
| 第02日 06:02 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第02日 06:02 | 宝玉 | AI选择：逛园 [w:pub:15,18] provider=homeward |  | ai:decision |
| 第02日 06:02 | 黛玉 | 行动入队：💬 联句·紫鹃 |  | queue:add |
| 第02日 06:02 | 黛玉 | AI选择：联句·紫鹃 [int:204:zijuan] provider=social |  | ai:decision |
| 第02日 06:03 | 宝玉 | 被莺儿完成互动：「对酌」 |  | interaction:complete |
| 第02日 06:04 | 黛玉 | AI每日主动社交计数：紫鹃 2/10 |  | ai:daily_social_count |
| 第02日 06:04 | 黛玉 | 开始互动：与紫鹃「联句」 |  | interaction:started |
| 第02日 06:11 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第02日 06:11 | 黛玉 | 完成互动：与紫鹃「联句」 |  | interaction:complete |
| 第02日 06:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:23 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 06:24 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:24 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 06:24 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:25 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:25 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 06:25 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 06:25 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 06:30 | 黛玉 | 行动入队：💬 评文·珍大爷 |  | queue:add |
| 第02日 06:30 | 黛玉 | AI选择：评文·珍大爷 [int:203:jiazhen] provider=social |  | ai:decision |
| 第02日 06:47 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 06:47 | 黛玉 | AI选择：居家闲步 [w:home:13,29] provider=homeward |  | ai:decision |
| 第02日 07:00 | 黛玉 | 下发任务给雪雁：随侍黛玉 | 黛玉 | quest:issued |
| 第02日 07:00 | 黛玉 | 接受任务：随侍黛玉 | 黛玉 | quest:accepted |
| 第02日 07:00 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 07:00 | 宝玉 | 下发任务给麝月：晨昏定省 | 宝玉 | quest:issued |
| 第02日 07:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第02日 07:00 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第02日 07:00 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social |  | ai:decision |
| 第02日 07:00 | 黛玉 | 行动入队：💬 辩理·贾母 |  | queue:add |
| 第02日 07:00 | 黛玉 | AI选择：辩理·贾母 [int:201:jiamu] provider=social |  | ai:decision |
| 第02日 07:02 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 07:02 | 宝玉 | AI选择：逛园 [w:pub:10,25] provider=homeward |  | ai:decision |
| 第02日 07:11 | 宝玉 | 被袭人发起互动：「调侃」 |  | interaction:started |
| 第02日 07:19 | 宝玉 | 被袭人完成互动：「调侃」 |  | interaction:complete |
| 第02日 07:30 | 宝玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 07:30 | 宝玉 | AI选择：闲游 [w:7,28] provider=wander |  | ai:decision |
| 第02日 07:45 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第02日 07:45 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第02日 07:46 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 07:46 | 宝玉 | AI选择：闲游 [w:8,24] provider=wander |  | ai:decision |
| 第02日 07:48 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 07:48 | 宝玉 | AI选择：闲游 [w:8,24] provider=wander |  | ai:decision |
| 第02日 08:00 | 宝玉 | 下发任务给袭人：备膳 | 宝玉 | quest:issued |
| 第02日 08:00 | 宝玉 | 接受任务：备膳 | 宝玉 | quest:accepted |
| 第02日 08:00 | 全局 | 时段切换：上午 |  | time:period |
| 第02日 08:00 | 宝玉 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第02日 08:00 | 宝玉 | AI选择：饭桌·独自用膳 [furn:2005:eat_alone] provider=furniture |  | ai:decision |
| 第02日 08:01 | 宝玉 | 任务失败：晨起伺候，超时 | 宝玉 | quest:failed |
| 第02日 08:01 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 08:01 | 宝玉 | AI选择：闲游 [w:8,24] provider=wander |  | ai:decision |
| 第02日 08:03 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第02日 08:03 | 宝玉 | AI选择：逛园 [w:pub:15,18] provider=homeward |  | ai:decision |
| 第02日 08:05 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:05 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:06 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:06 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:08 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:08 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:09 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:09 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:10 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:10 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:11 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:11 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:12 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:12 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:13 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 08:13 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 08:17 | 黛玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第02日 08:19 | 黛玉 | 被刘姥姥发起互动：「品茗」 |  | interaction:started |
| 第02日 08:25 | 黛玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第02日 08:27 | 黛玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 08:28 | 黛玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 08:28 | 宝玉 | 完成任务：备膳 | 宝玉 | quest:completed |
| 第02日 08:30 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第02日 08:30 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第02日 08:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 08:30 | 黛玉 | AI选择：居家闲步 [w:home:4,28] provider=homeward |  | ai:decision |
| 第02日 08:32 | 黛玉 | 被刘姥姥完成互动：「品茗」 |  | interaction:complete |
| 第02日 08:35 | 宝玉 | 行动入队：前往东航廊 |  | queue:add |
| 第02日 08:35 | 宝玉 | AI选择：逛园 [w:pub:41,15] provider=homeward |  | ai:decision |
| 第02日 08:52 | 宝玉 | 行动入队：💬 问安·袭人 |  | queue:add |
| 第02日 08:52 | 宝玉 | AI选择：问安·袭人 [int:103:xiren] provider=social |  | ai:decision |
| 第02日 09:00 | 宝玉 | 下发任务给袭人：传话 | 宝玉 | quest:issued |
| 第02日 09:00 | 宝玉 | 接受任务：传话 | 宝玉 | quest:accepted |
| 第02日 09:01 | 宝玉 | 任务失败：晨昏定省，超时 | 政老爷 | quest:failed |
| 第02日 09:01 | 宝玉 | 任务失败：晨昏定省，超时 | 宝玉 | quest:failed |
| 第02日 09:01 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 09:01 | 宝玉 | AI选择：逛园 [w:pub:41,25] provider=homeward |  | ai:decision |
| 第02日 09:09 | 宝玉 | 行动入队：🤝 对酌·贾母 |  | queue:add |
| 第02日 09:09 | 宝玉 | AI选择：对酌·贾母 [int:105:jiamu] provider=social |  | ai:decision |
| 第02日 09:20 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 09:20 | 黛玉 | AI选择：居家闲步 [w:home:8,30] provider=homeward |  | ai:decision |
| 第02日 09:26 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:26 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:27 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:27 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:28 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:28 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:32 | 宝玉 | AI每日主动社交计数：贾母 1/10 |  | ai:daily_social_count |
| 第02日 09:32 | 宝玉 | 开始互动：与贾母「对酌」 |  | interaction:started |
| 第02日 09:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:51 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 09:51 | 宝玉 | 完成互动：与贾母「对酌」 |  | interaction:complete |
| 第02日 09:52 | 宝玉 | 被晴雯发起互动：「闲谈」 |  | interaction:started |
| 第02日 09:54 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:54 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:55 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:55 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:56 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:56 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:57 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 09:59 | 宝玉 | 被晴雯完成互动：「闲谈」 |  | interaction:complete |
| 第02日 10:00 | 宝玉 | 下发任务给麝月：服侍更衣 | 宝玉 | quest:issued |
| 第02日 10:00 | 宝玉 | 接受任务：服侍更衣 | 宝玉 | quest:accepted |
| 第02日 10:00 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第02日 10:00 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第02日 10:04 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 10:05 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 10:05 | 宝玉 | AI选择：逛园 [w:pub:45,25] provider=homeward |  | ai:decision |
| 第02日 10:05 | 黛玉 | 行动入队：💬 联句·紫鹃 |  | queue:add |
| 第02日 10:05 | 黛玉 | AI选择：联句·紫鹃 [int:204:zijuan] provider=social |  | ai:decision |
| 第02日 10:16 | 黛玉 | AI每日主动社交计数：紫鹃 3/10 |  | ai:daily_social_count |
| 第02日 10:16 | 黛玉 | 开始互动：与紫鹃「联句」 |  | interaction:started |
| 第02日 10:17 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第02日 10:17 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social |  | ai:decision |
| 第02日 10:23 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第02日 10:23 | 黛玉 | 完成互动：与紫鹃「联句」 |  | interaction:complete |
| 第02日 10:28 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 10:28 | 宝玉 | 开始任务：服侍更衣 | 宝玉 | quest:started |
| 第02日 10:30 | 黛玉 | 行动入队：💬 辩理·刘姥姥 |  | queue:add |
| 第02日 10:30 | 黛玉 | AI选择：辩理·刘姥姥 [int:201:liulaolao] provider=social |  | ai:decision |
| 第02日 10:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:40 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:40 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:41 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:41 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:43 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:43 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:43 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 10:44 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 10:44 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 10:44 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 10:44 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 10:45 | 黛玉 | 行动入队：💬 评文·探春 |  | queue:add |
| 第02日 10:45 | 黛玉 | AI选择：评文·探春 [int:203:tanchun] provider=social |  | ai:decision |
| 第02日 10:56 | 宝玉 | AI每日主动社交计数：莺儿 5/10 |  | ai:daily_social_count |
| 第02日 10:56 | 宝玉 | 开始互动：与莺儿「对酌」 |  | interaction:started |
| 第02日 11:00 | 宝玉 | 被刘姥姥发起互动：「品茗」 |  | interaction:started |
| 第02日 11:13 | 宝玉 | 被刘姥姥完成互动：「品茗」 |  | interaction:complete |
| 第02日 11:14 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:14 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 11:19 | 黛玉 | AI每日主动社交计数：探春 1/10 |  | ai:daily_social_count |
| 第02日 11:19 | 黛玉 | 开始互动：与探春「评文」 |  | interaction:started |
| 第02日 11:20 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第02日 11:20 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第02日 11:20 | 宝玉 | AI每日主动社交计数：莺儿 6/10 |  | ai:daily_social_count |
| 第02日 11:20 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第02日 11:21 | 宝玉 | 被大老爷发起互动：「品茗」 |  | interaction:started |
| 第02日 11:26 | 黛玉 | AI目标频控：探春 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 11:26 | 黛玉 | 完成互动：与探春「评文」 |  | interaction:complete |
| 第02日 11:27 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 11:27 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第02日 11:30 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第02日 11:30 | 宝玉 | AI每日主动社交计数：大老爷 4/10 |  | ai:daily_social_count |
| 第02日 11:30 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第02日 11:30 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第02日 11:30 | 黛玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第02日 11:30 | 黛玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第02日 11:31 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 11:31 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 11:40 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 11:43 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 11:43 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第02日 11:45 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第02日 11:45 | 宝玉 | AI每日主动社交计数：宝钗 4/10 |  | ai:daily_social_count |
| 第02日 11:45 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第02日 11:45 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第02日 11:45 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第02日 11:50 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 11:50 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 11:51 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 11:51 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第02日 11:51 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第02日 11:52 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 11:52 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 11:52 | 黛玉 | 被雪雁发起互动：「打趣」 |  | interaction:started |
| 第02日 11:59 | 黛玉 | 被雪雁完成互动：「打趣」 |  | interaction:complete |
| 第02日 12:00 | 黛玉 | 下发任务给雪雁：传话 | 黛玉 | quest:issued |
| 第02日 12:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第02日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第02日 12:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:00 | 宝玉 | 行动入队：💬 闲谈·黛玉 |  | queue:add |
| 第02日 12:00 | 宝玉 | AI选择：闲谈·黛玉 [int:102:daiyu] provider=social |  | ai:decision |
| 第02日 12:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:00 | 宝玉 | 被大老爷发起互动：「品茗」 |  | interaction:started |
| 第02日 12:01 | 宝玉 | 任务失败：传话，超时 | 宝玉 | quest:failed |
| 第02日 12:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:03 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 12:10 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 12:12 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:12 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:13 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:13 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:20 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 12:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 12:21 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 12:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 12:21 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 12:30 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第02日 12:30 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social |  | ai:decision |
| 第02日 12:41 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 12:42 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第02日 12:42 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第02日 12:47 | 黛玉 | AI每日主动社交计数：紫鹃 4/10 |  | ai:daily_social_count |
| 第02日 12:47 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第02日 12:48 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 12:48 | 宝玉 | 开始任务：服侍更衣 | 宝玉 | quest:started |
| 第02日 12:50 | 宝玉 | 完成任务：服侍更衣 | 宝玉 | quest:completed |
| 第02日 12:55 | 黛玉 | AI目标频控：紫鹃 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 12:55 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第02日 13:00 | 宝玉 | 下发任务给晴雯：晨昏定省 | 宝玉 | quest:issued |
| 第02日 13:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第02日 13:00 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第02日 13:00 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第02日 13:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 13:00 | 黛玉 | AI选择：居家闲步 [w:home:11,28] provider=homeward |  | ai:decision |
| 第02日 13:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 13:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 13:15 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 13:21 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 13:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 13:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 13:34 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 13:38 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 13:39 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 13:40 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 13:41 | 宝玉 | AI每日主动社交计数：莺儿 7/10 |  | ai:daily_social_count |
| 第02日 13:41 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第02日 13:46 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 13:49 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 13:49 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第02日 13:57 | 宝玉 | 被晴雯发起互动：「闲谈」 |  | interaction:started |
| 第02日 13:58 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第02日 14:00 | 黛玉 | 下发任务给紫鹃：服侍更衣 | 黛玉 | quest:issued |
| 第02日 14:00 | 黛玉 | 接受任务：服侍更衣 | 黛玉 | quest:accepted |
| 第02日 14:00 | 黛玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第02日 14:00 | 黛玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第02日 14:01 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 14:01 | 黛玉 | AI选择：居家闲步 [w:home:3,29] provider=homeward |  | ai:decision |
| 第02日 14:04 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第02日 14:04 | 宝玉 | 被晴雯完成互动：「闲谈」 |  | interaction:complete |
| 第02日 14:05 | 宝玉 | 被贾母发起互动：「嬉闹」 |  | interaction:started |
| 第02日 14:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 14:15 | 黛玉 | AI选择：居家闲步 [w:home:13,30] provider=homeward |  | ai:decision |
| 第02日 14:16 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 14:16 | 黛玉 | AI选择：居家闲步 [w:home:6,28] provider=homeward |  | ai:decision |
| 第02日 14:21 | 宝玉 | 被贾母完成互动：「嬉闹」 |  | interaction:complete |
| 第02日 14:30 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第02日 14:30 | 宝玉 | AI每日主动社交计数：大老爷 5/10 |  | ai:daily_social_count |
| 第02日 14:30 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第02日 14:30 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第02日 14:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 14:30 | 黛玉 | AI选择：闲游 [w:4,32] provider=wander |  | ai:decision |
| 第02日 14:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:38 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:38 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:40 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:40 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:40 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 14:41 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:41 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 14:41 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:41 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 14:43 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 14:43 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第02日 14:45 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第02日 14:45 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第02日 14:45 | 黛玉 | 行动入队：💬 评文·探春 |  | queue:add |
| 第02日 14:45 | 黛玉 | AI选择：评文·探春 [int:203:tanchun] provider=social |  | ai:decision |
| 第02日 14:45 | 宝玉 | 被琏二爷发起互动：「问安」 |  | interaction:started |
| 第02日 14:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 14:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 14:47 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 14:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 14:47 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 14:51 | 宝玉 | 被琏二爷完成互动：「问安」 |  | interaction:complete |
| 第02日 14:52 | 宝玉 | AI每日主动社交计数：刘姥姥 1/10 |  | ai:daily_social_count |
| 第02日 14:52 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第02日 14:59 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 14:59 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第02日 15:00 | 宝玉 | 行动入队：💬 闲谈·琏二爷 |  | queue:add |
| 第02日 15:00 | 宝玉 | AI每日主动社交计数：琏二爷 1/10 |  | ai:daily_social_count |
| 第02日 15:00 | 宝玉 | 开始互动：与琏二爷「闲谈」 |  | interaction:started |
| 第02日 15:00 | 宝玉 | AI选择：闲谈·琏二爷 [int:102:jialian] provider=social |  | ai:decision |
| 第02日 15:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 15:00 | 黛玉 | AI选择：居家闲步 [w:home:7,32] provider=homeward |  | ai:decision |
| 第02日 15:01 | 黛玉 | 任务失败：传话，超时 | 黛玉 | quest:failed |
| 第02日 15:02 | 宝玉 | 被刘姥姥发起互动：「闲谈」 |  | interaction:started |
| 第02日 15:07 | 宝玉 | AI目标频控：琏二爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 15:07 | 宝玉 | 完成互动：与琏二爷「闲谈」 |  | interaction:complete |
| 第02日 15:15 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第02日 15:15 | 宝玉 | AI每日主动社交计数：宝钗 5/10 |  | ai:daily_social_count |
| 第02日 15:15 | 宝玉 | 开始互动：与宝钗「问安」 |  | interaction:started |
| 第02日 15:15 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social |  | ai:decision |
| 第02日 15:15 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 15:15 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 15:16 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 15:18 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 15:18 | 黛玉 | AI选择：闲游 [w:8,32] provider=wander |  | ai:decision |
| 第02日 15:21 | 黛玉 | 开始任务：服侍更衣 | 黛玉 | quest:started |
| 第02日 15:21 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 15:21 | 宝玉 | 完成互动：与宝钗「问安」 |  | interaction:complete |
| 第02日 15:22 | 黛玉 | 被紫鹃发起互动：「对酌」 |  | interaction:started |
| 第02日 15:25 | 黛玉 | 完成任务：服侍更衣 | 黛玉 | quest:completed |
| 第02日 15:30 | 宝玉 | 行动入队：💬 寒暄·雪雁 |  | queue:add |
| 第02日 15:30 | 宝玉 | AI选择：寒暄·雪雁 [int:101:xueyan] provider=social |  | ai:decision |
| 第02日 15:30 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第02日 15:30 | 宝玉 | 被刘姥姥发起互动：「品茗」 |  | interaction:started |
| 第02日 15:32 | 宝玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第02日 15:32 | 宝玉 | 开始互动：与雪雁「寒暄」 |  | interaction:started |
| 第02日 15:37 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第02日 15:38 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 15:38 | 宝玉 | AI选择：逛园 [w:pub:15,24] provider=homeward |  | ai:decision |
| 第02日 15:41 | 黛玉 | 被紫鹃完成互动：「对酌」 |  | interaction:complete |
| 第02日 15:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 15:45 | 黛玉 | AI选择：闲游 [w:13,29] provider=wander |  | ai:decision |
| 第02日 15:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 15:46 | 黛玉 | AI选择：居家闲步 [w:home:14,33] provider=homeward |  | ai:decision |
| 第02日 15:48 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 15:52 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第02日 15:52 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第02日 16:00 | 黛玉 | 下发任务给雪雁：作诗陪吟 | 黛玉 | quest:issued |
| 第02日 16:00 | 黛玉 | 接受任务：作诗陪吟 | 黛玉 | quest:accepted |
| 第02日 16:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 16:00 | 黛玉 | AI选择：闲游 [w:13,30] provider=wander |  | ai:decision |
| 第02日 16:01 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 16:01 | 黛玉 | AI选择：居家闲步 [w:home:12,32] provider=homeward |  | ai:decision |
| 第02日 16:03 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 16:04 | 宝玉 | AI每日主动社交计数：莺儿 8/10 |  | ai:daily_social_count |
| 第02日 16:04 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第02日 16:11 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 16:11 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第02日 16:14 | 宝玉 | 被袭人发起互动：「问安」 |  | interaction:started |
| 第02日 16:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 16:15 | 黛玉 | AI选择：居家闲步 [w:home:12,33] provider=homeward |  | ai:decision |
| 第02日 16:21 | 宝玉 | 被袭人完成互动：「问安」 |  | interaction:complete |
| 第02日 16:30 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第02日 16:30 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social |  | ai:decision |
| 第02日 16:30 | 黛玉 | 行动入队：🤝 对弈·宝玉 |  | queue:add |
| 第02日 16:30 | 黛玉 | AI选择：对弈·宝玉 [int:202:baoyu] provider=social |  | ai:decision |
| 第02日 16:33 | 宝玉 | AI每日主动社交计数：大老爷 6/10 |  | ai:daily_social_count |
| 第02日 16:33 | 宝玉 | 开始互动：与大老爷「寒暄」 |  | interaction:started |
| 第02日 16:40 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 16:40 | 宝玉 | 完成互动：与大老爷「寒暄」 |  | interaction:complete |
| 第02日 16:45 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第02日 16:45 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第02日 16:45 | 宝玉 | 被刘姥姥发起互动：「品茗」 |  | interaction:started |
| 第02日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第02日 17:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 17:00 | 黛玉 | AI选择：居家闲步 [w:home:14,31] provider=homeward |  | ai:decision |
| 第02日 17:11 | 宝玉 | AI每日主动社交计数：宝钗 6/10 |  | ai:daily_social_count |
| 第02日 17:11 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第02日 17:11 | 黛玉 | 被贾母发起互动：「打趣」 |  | interaction:started |
| 第02日 17:19 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 17:19 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第02日 17:19 | 黛玉 | 被贾母完成互动：「打趣」 |  | interaction:complete |
| 第02日 17:19 | 宝玉 | 被刘姥姥发起互动：「问安」 |  | interaction:started |
| 第02日 17:26 | 宝玉 | 被刘姥姥完成互动：「问安」 |  | interaction:complete |
| 第02日 17:30 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第02日 17:30 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第02日 17:34 | 宝玉 | AI每日主动社交计数：莺儿 9/10 |  | ai:daily_social_count |
| 第02日 17:34 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第02日 17:35 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第02日 17:35 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第02日 17:38 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:38 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:40 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:40 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:41 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 17:41 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第02日 17:41 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第02日 17:44 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:44 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:48 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:48 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:49 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:49 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:49 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第02日 17:51 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:51 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:52 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:52 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:53 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:53 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:54 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:54 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:55 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 17:55 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 17:55 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 17:56 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 18:00 | 黛玉 | 任务下发：晨昏定省 | 政老爷 | quest:issued |
| 第02日 18:00 | 黛玉 | 接受任务：晨昏定省 | 政老爷 | quest:accepted |
| 第02日 18:00 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第02日 18:00 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第02日 18:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 18:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 18:01 | 宝玉 | 任务失败：随侍左右，超时 | 宝玉 | quest:failed |
| 第02日 18:01 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 18:01 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 18:01 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 18:02 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 18:05 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 18:08 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 18:11 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 18:15 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 18:15 | 宝玉 | AI选择：逛园 [w:pub:12,25] provider=homeward |  | ai:decision |
| 第02日 18:15 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 18:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 18:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 18:31 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:31 | 黛玉 | AI选择：居家闲步 [w:home:10,34] provider=homeward |  | ai:decision |
| 第02日 18:44 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 18:44 | 宝玉 | AI选择：逛园 [w:pub:28,24] provider=homeward |  | ai:decision |
| 第02日 18:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:45 | 黛玉 | AI选择：闲游 [w:10,31] provider=wander |  | ai:decision |
| 第02日 18:58 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第02日 18:58 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第02日 19:00 | 宝玉 | 下发任务给麝月：传话 | 宝玉 | quest:issued |
| 第02日 19:00 | 宝玉 | 接受任务：传话 | 宝玉 | quest:accepted |
| 第02日 19:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 19:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第02日 19:01 | 黛玉 | 任务失败：随侍黛玉，超时 | 黛玉 | quest:failed |
| 第02日 19:01 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 19:01 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 19:03 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 19:08 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第02日 19:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:15 | 黛玉 | AI选择：居家闲步 [w:home:6,30] provider=homeward |  | ai:decision |
| 第02日 19:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 19:16 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 19:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 19:19 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 19:28 | 宝玉 | AI每日主动社交计数：莺儿 10/10 |  | ai:daily_social_count |
| 第02日 19:28 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第02日 19:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:30 | 黛玉 | AI选择：闲游 [w:12,32] provider=wander |  | ai:decision |
| 第02日 19:35 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 19:35 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第02日 19:45 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第02日 19:45 | 宝玉 | AI每日主动社交计数：大老爷 7/10 |  | ai:daily_social_count |
| 第02日 19:45 | 宝玉 | 开始互动：与大老爷「寒暄」 |  | interaction:started |
| 第02日 19:45 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social |  | ai:decision |
| 第02日 19:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:45 | 黛玉 | AI选择：居家闲步 [w:home:8,31] provider=homeward |  | ai:decision |
| 第02日 19:48 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 19:48 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第02日 19:51 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 19:51 | 宝玉 | 完成互动：与大老爷「寒暄」 |  | interaction:complete |
| 第02日 19:51 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 19:56 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第02日 20:00 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第02日 20:00 | 宝玉 | AI每日主动社交计数：刘姥姥 2/10 |  | ai:daily_social_count |
| 第02日 20:00 | 宝玉 | 开始互动：与刘姥姥「对酌」 |  | interaction:started |
| 第02日 20:00 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第02日 20:00 | 黛玉 | 行动入队：💬 辩理·莺儿 |  | queue:add |
| 第02日 20:00 | 黛玉 | AI选择：辩理·莺儿 [int:201:yinger] provider=social |  | ai:decision |
| 第02日 20:01 | 黛玉 | 任务失败：作诗陪吟，超时 | 黛玉 | quest:failed |
| 第02日 20:03 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 20:03 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 20:03 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 20:04 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 20:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:19 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 20:19 | 宝玉 | 完成互动：与刘姥姥「对酌」 |  | interaction:complete |
| 第02日 20:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:25 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:25 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:26 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:26 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:26 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 20:27 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 20:30 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第02日 20:30 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第02日 20:30 | 黛玉 | 行动入队：💬 评文·凤姐 |  | queue:add |
| 第02日 20:30 | 黛玉 | AI选择：评文·凤姐 [int:203:xifeng] provider=social |  | ai:decision |
| 第02日 20:46 | 宝玉 | AI每日主动社交计数：宝钗 7/10 |  | ai:daily_social_count |
| 第02日 20:46 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第02日 20:50 | 黛玉 | AI每日主动社交计数：凤姐 1/10 |  | ai:daily_social_count |
| 第02日 20:50 | 黛玉 | 开始互动：与凤姐「评文」 |  | interaction:started |
| 第02日 20:57 | 黛玉 | AI目标频控：凤姐 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 20:57 | 黛玉 | 完成互动：与凤姐「评文」 |  | interaction:complete |
| 第02日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第02日 21:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 21:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 21:01 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 21:01 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 21:05 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 21:05 | 宝玉 | 完成互动：与宝钗「对酌」 |  | interaction:complete |
| 第02日 21:08 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 21:09 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 21:15 | 宝玉 | 行动入队：💬 评文·大老爷 |  | queue:add |
| 第02日 21:15 | 宝玉 | AI选择：评文·大老爷 [int:203:jiashe] provider=social |  | ai:decision |
| 第02日 21:15 | 黛玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第02日 21:15 | 黛玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第02日 21:16 | 黛玉 | 行动入队：🎵 抚琴自娱 |  | queue:add |
| 第02日 21:16 | 黛玉 | AI选择：琴台·抚琴自娱 [furn:1006:play_music] provider=furniture |  | ai:decision |
| 第02日 21:17 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 21:17 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 21:19 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 21:22 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 21:25 | 黛玉 | 开始用家具：琴台 / play_music |  | furniture:use_started |
| 第02日 21:26 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第02日 21:26 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social |  | ai:decision |
| 第02日 21:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 21:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 21:35 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 21:41 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 21:45 | 宝玉 | 行动入队：💬 辩理·大老爷 |  | queue:add |
| 第02日 21:45 | 宝玉 | AI选择：辩理·大老爷 [int:201:jiashe] provider=social |  | ai:decision |
| 第02日 21:45 | 宝玉 | AI每日主动社交计数：大老爷 8/10 |  | ai:daily_social_count |
| 第02日 21:45 | 宝玉 | 开始互动：与大老爷「辩理」 |  | interaction:started |
| 第02日 21:52 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 21:52 | 宝玉 | 完成互动：与大老爷「辩理」 |  | interaction:complete |
| 第02日 22:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 22:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 22:00 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:00 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:01 | 宝玉 | 任务失败：传话，超时 | 宝玉 | quest:failed |
| 第02日 22:15 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第02日 22:15 | 宝玉 | AI每日主动社交计数：刘姥姥 3/10 |  | ai:daily_social_count |
| 第02日 22:15 | 宝玉 | 开始互动：与刘姥姥「对弈」 |  | interaction:started |
| 第02日 22:15 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第02日 22:16 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 22:16 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 22:16 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 22:21 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:21 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:21 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 22:30 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第02日 22:30 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第02日 22:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:31 | 宝玉 | AI每日主动社交计数：刘姥姥 4/10 |  | ai:daily_social_count |
| 第02日 22:31 | 宝玉 | 开始互动：与刘姥姥「对弈」 |  | interaction:started |
| 第02日 22:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:49 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 22:49 | 宝玉 | 完成互动：与刘姥姥「对弈」 |  | interaction:complete |
| 第02日 23:00 | 宝玉 | 行动入队：💬 联句·琏二爷 |  | queue:add |
| 第02日 23:00 | 宝玉 | AI选择：联句·琏二爷 [int:204:jialian] provider=social |  | ai:decision |
| 第02日 23:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 23:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 23:01 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 23:01 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 23:01 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 23:03 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 23:03 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 23:15 | 宝玉 | 行动入队：🤝 对弈·宝钗 |  | queue:add |
| 第02日 23:15 | 宝玉 | AI每日主动社交计数：宝钗 8/10 |  | ai:daily_social_count |
| 第02日 23:15 | 宝玉 | 开始互动：与宝钗「对弈」 |  | interaction:started |
| 第02日 23:15 | 宝玉 | AI选择：对弈·宝钗 [int:202:baochai] provider=social |  | ai:decision |
| 第02日 23:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:24 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:24 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:26 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:26 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:26 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 23:27 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 23:27 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 23:27 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 23:27 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 23:30 | 黛玉 | 行动入队：💬 辩理·大老爷 |  | queue:add |
| 第02日 23:30 | 黛玉 | AI选择：辩理·大老爷 [int:201:jiashe] provider=social |  | ai:decision |
| 第02日 23:32 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 23:32 | 宝玉 | 完成互动：与宝钗「对弈」 |  | interaction:complete |
| 第02日 23:36 | 黛玉 | 行动入队：💬 评文·探春 |  | queue:add |
| 第02日 23:36 | 黛玉 | AI选择：评文·探春 [int:203:tanchun] provider=social |  | ai:decision |
| 第02日 23:45 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 23:45 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第02日 23:45 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 23:46 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 23:46 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 23:47 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 23:53 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 00:00 | 全局 | 进入第3日 |  | time:day |
| 第03日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第03日 00:00 | 宝玉 | 行动入队：💬 论禅·莺儿 |  | queue:add |
| 第03日 00:00 | 宝玉 | AI选择：论禅·莺儿 [int:205:yinger] provider=social |  | ai:decision |
| 第03日 00:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 00:01 | 宝玉 | AI每日主动社交计数：莺儿 1/10 |  | ai:daily_social_count |
| 第03日 00:01 | 宝玉 | 开始互动：与莺儿「论禅」 |  | interaction:started |
| 第03日 00:08 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 00:08 | 宝玉 | 完成互动：与莺儿「论禅」 |  | interaction:complete |
| 第03日 00:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 00:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 00:15 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:15 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 00:15 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 00:17 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 00:30 | 宝玉 | 行动入队：💬 联句·刘姥姥 |  | queue:add |
| 第03日 00:30 | 宝玉 | AI选择：联句·刘姥姥 [int:204:liulaolao] provider=social |  | ai:decision |
| 第03日 00:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 00:30 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 00:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 00:31 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 00:31 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第03日 00:31 | 宝玉 | AI每日主动社交计数：刘姥姥 1/10 |  | ai:daily_social_count |
| 第03日 00:31 | 宝玉 | 开始互动：与刘姥姥「联句」 |  | interaction:started |
| 第03日 00:32 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 00:32 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第03日 00:38 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 00:38 | 宝玉 | 完成互动：与刘姥姥「联句」 |  | interaction:complete |
| 第03日 00:45 | 宝玉 | 行动入队：💬 联句·琏二爷 |  | queue:add |
| 第03日 00:45 | 宝玉 | AI选择：联句·琏二爷 [int:204:jialian] provider=social |  | ai:decision |
| 第03日 01:00 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第03日 01:00 | 宝玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第03日 01:00 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第03日 01:00 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第03日 01:03 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 01:03 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 01:07 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 01:07 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第03日 01:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 01:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 01:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 01:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 01:15 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 01:16 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 01:16 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第03日 01:16 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 01:30 | 宝玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第03日 01:30 | 宝玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第03日 01:31 | 宝玉 | AI每日主动社交计数：莺儿 2/10 |  | ai:daily_social_count |
| 第03日 01:31 | 宝玉 | 开始互动：与莺儿「评文」 |  | interaction:started |
| 第03日 01:38 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 01:38 | 宝玉 | 完成互动：与莺儿「评文」 |  | interaction:complete |
| 第03日 01:40 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 01:45 | 宝玉 | 行动入队：💬 联句·琏二爷 |  | queue:add |
| 第03日 01:45 | 宝玉 | AI选择：联句·琏二爷 [int:204:jialian] provider=social |  | ai:decision |
| 第03日 01:45 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 02:00 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第03日 02:00 | 宝玉 | AI每日主动社交计数：刘姥姥 2/10 |  | ai:daily_social_count |
| 第03日 02:00 | 宝玉 | 开始互动：与刘姥姥「对弈」 |  | interaction:started |
| 第03日 02:00 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第03日 02:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 02:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 02:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:08 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 02:08 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 02:11 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 02:13 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 02:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:17 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:17 | 宝玉 | 完成互动：与刘姥姥「对弈」 |  | interaction:complete |
| 第03日 02:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:22 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第03日 02:22 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第03日 02:26 | 黛玉 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第03日 02:26 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第03日 02:30 | 宝玉 | 行动入队：💬 评文·宝钗 |  | queue:add |
| 第03日 02:30 | 宝玉 | AI每日主动社交计数：宝钗 2/10 |  | ai:daily_social_count |
| 第03日 02:30 | 宝玉 | 开始互动：与宝钗「评文」 |  | interaction:started |
| 第03日 02:30 | 宝玉 | AI选择：评文·宝钗 [int:203:baochai] provider=social |  | ai:decision |
| 第03日 02:33 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:33 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第03日 02:37 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:37 | 宝玉 | 完成互动：与宝钗「评文」 |  | interaction:complete |
| 第03日 02:45 | 宝玉 | 行动入队：🤝 对弈·琏二爷 |  | queue:add |
| 第03日 02:45 | 宝玉 | AI每日主动社交计数：琏二爷 1/10 |  | ai:daily_social_count |
| 第03日 02:45 | 宝玉 | 开始互动：与琏二爷「对弈」 |  | interaction:started |
| 第03日 02:45 | 宝玉 | AI选择：对弈·琏二爷 [int:202:jialian] provider=social |  | ai:decision |
| 第03日 02:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 02:45 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 02:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 02:45 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 02:46 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 02:46 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第03日 02:46 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 03:00 | 宝玉 | 行动入队：💬 论禅·莺儿 |  | queue:add |
| 第03日 03:00 | 宝玉 | AI选择：论禅·莺儿 [int:205:yinger] provider=social |  | ai:decision |
| 第03日 03:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:01 | 宝玉 | AI每日主动社交计数：莺儿 3/10 |  | ai:daily_social_count |
| 第03日 03:01 | 宝玉 | 开始互动：与莺儿「论禅」 |  | interaction:started |
| 第03日 03:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:08 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 03:08 | 宝玉 | 完成互动：与莺儿「论禅」 |  | interaction:complete |
| 第03日 03:09 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 03:10 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 03:15 | 宝玉 | 行动入队：👘 在梳洗妆台 |  | queue:add |
| 第03日 03:15 | 宝玉 | AI选择：梳洗妆台·使用梳洗妆台 [furn:2007:default_use] provider=furniture |  | ai:decision |
| 第03日 03:15 | 黛玉 | 行动入队：🤝 对弈·雪雁 |  | queue:add |
| 第03日 03:15 | 黛玉 | AI选择：对弈·雪雁 [int:202:xueyan] provider=social |  | ai:decision |
| 第03日 03:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 03:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 03:17 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第03日 03:17 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture |  | ai:decision |
| 第03日 03:19 | 宝玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第03日 03:21 | 宝玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第03日 03:23 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 03:26 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 03:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 03:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 03:30 | 黛玉 | 行动入队：💬 论禅·雪雁 |  | queue:add |
| 第03日 03:30 | 黛玉 | AI选择：论禅·雪雁 [int:205:xueyan] provider=social |  | ai:decision |
| 第03日 03:31 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 03:31 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第03日 03:31 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 03:34 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 03:35 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 03:35 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 03:45 | 宝玉 | 行动入队：💬 论禅·刘姥姥 |  | queue:add |
| 第03日 03:45 | 宝玉 | AI选择：论禅·刘姥姥 [int:205:liulaolao] provider=social |  | ai:decision |
| 第03日 03:45 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 03:45 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第03日 03:45 | 宝玉 | AI每日主动社交计数：刘姥姥 3/10 |  | ai:daily_social_count |
| 第03日 03:45 | 宝玉 | 开始互动：与刘姥姥「论禅」 |  | interaction:started |
| 第03日 03:48 | 黛玉 | 行动入队：💬 评文·紫鹃 |  | queue:add |
| 第03日 03:48 | 黛玉 | AI选择：评文·紫鹃 [int:203:zijuan] provider=social |  | ai:decision |
| 第03日 03:52 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 03:52 | 宝玉 | 完成互动：与刘姥姥「论禅」 |  | interaction:complete |
| 第03日 03:57 | 黛玉 | AI每日主动社交计数：紫鹃 2/10 |  | ai:daily_social_count |
| 第03日 03:57 | 黛玉 | 开始互动：与紫鹃「评文」 |  | interaction:started |
| 第03日 04:00 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第03日 04:00 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第03日 04:02 | 宝玉 | AI每日主动社交计数：宝钗 3/10 |  | ai:daily_social_count |
| 第03日 04:02 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第03日 04:04 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第03日 04:04 | 黛玉 | 完成互动：与紫鹃「评文」 |  | interaction:complete |
| 第03日 04:09 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 04:09 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第03日 04:15 | 宝玉 | 行动入队：💬 联句·琏二爷 |  | queue:add |
| 第03日 04:15 | 宝玉 | AI选择：联句·琏二爷 [int:204:jialian] provider=social |  | ai:decision |
| 第03日 04:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 04:15 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 04:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 04:16 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:16 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:16 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 04:30 | 宝玉 | 行动入队：💬 联句·莺儿 |  | queue:add |
| 第03日 04:30 | 宝玉 | AI选择：联句·莺儿 [int:204:yinger] provider=social |  | ai:decision |
| 第03日 04:30 | 黛玉 | 行动入队：💬 论禅·莺儿 |  | queue:add |
| 第03日 04:30 | 黛玉 | AI选择：论禅·莺儿 [int:205:yinger] provider=social |  | ai:decision |
| 第03日 04:31 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:31 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:31 | 宝玉 | AI每日主动社交计数：莺儿 4/10 |  | ai:daily_social_count |
| 第03日 04:31 | 宝玉 | 开始互动：与莺儿「联句」 |  | interaction:started |
| 第03日 04:31 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 04:38 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 04:38 | 宝玉 | 完成互动：与莺儿「联句」 |  | interaction:complete |
| 第03日 04:45 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 04:45 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 04:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:45 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 04:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:45 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 04:45 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 04:47 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第03日 05:00 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第03日 05:00 | 宝玉 | AI选择：逛园 [w:pub:24,8] provider=homeward |  | ai:decision |
| 第03日 05:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 05:00 | 黛玉 | AI选择：居家闲步 [w:home:13,28] provider=homeward |  | ai:decision |
| 第03日 05:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:08 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:08 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:09 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:09 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:10 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第03日 05:10 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第03日 05:10 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 05:11 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:11 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 05:11 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 05:11 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 05:15 | 黛玉 | 行动入队：💬 论禅·王夫人 |  | queue:add |
| 第03日 05:15 | 黛玉 | AI选择：论禅·王夫人 [int:205:wangfuren] provider=social |  | ai:decision |
| 第03日 05:17 | 宝玉 | AI每日主动社交计数：刘姥姥 4/10 |  | ai:daily_social_count |
| 第03日 05:17 | 宝玉 | 开始互动：与刘姥姥「对酌」 |  | interaction:started |
| 第03日 05:37 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 05:37 | 宝玉 | 完成互动：与刘姥姥「对酌」 |  | interaction:complete |
| 第03日 05:45 | 宝玉 | 行动入队：💬 寒暄·琏二爷 |  | queue:add |
| 第03日 05:45 | 宝玉 | AI每日主动社交计数：琏二爷 2/10 |  | ai:daily_social_count |
| 第03日 05:45 | 宝玉 | 开始互动：与琏二爷「寒暄」 |  | interaction:started |
| 第03日 05:45 | 宝玉 | AI选择：寒暄·琏二爷 [int:101:jialian] provider=social |  | ai:decision |
| 第03日 05:45 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 05:45 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第03日 05:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 05:46 | 黛玉 | AI选择：居家闲步 [w:home:4,31] provider=homeward |  | ai:decision |
| 第03日 05:47 | 宝玉 | 被刘姥姥发起互动：「调侃」 |  | interaction:started |
| 第03日 05:51 | 宝玉 | AI目标频控：琏二爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 05:51 | 宝玉 | 完成互动：与琏二爷「寒暄」 |  | interaction:complete |
| 第03日 05:55 | 宝玉 | 被刘姥姥完成互动：「调侃」 |  | interaction:complete |
| 第03日 05:57 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 05:57 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 06:00 | 黛玉 | 下发任务给紫鹃：随侍黛玉 | 黛玉 | quest:issued |
| 第03日 06:00 | 黛玉 | 接受任务：随侍黛玉 | 黛玉 | quest:accepted |
| 第03日 06:00 | 黛玉 | 下发任务给紫鹃：传话 | 黛玉 | quest:issued |
| 第03日 06:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第03日 06:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 06:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 06:00 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第03日 06:00 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第03日 06:00 | 宝玉 | 被大老爷发起互动：「寒暄」 |  | interaction:started |
| 第03日 06:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 06:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 06:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 06:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 06:02 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 06:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 06:03 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 06:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 06:03 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 06:09 | 宝玉 | AI每日主动社交计数：莺儿 5/10 |  | ai:daily_social_count |
| 第03日 06:09 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第03日 06:15 | 黛玉 | 行动入队：💬 论禅·探春 |  | queue:add |
| 第03日 06:15 | 黛玉 | AI选择：论禅·探春 [int:205:tanchun] provider=social |  | ai:decision |
| 第03日 06:15 | 宝玉 | 被莺儿发起互动：「调侃」 |  | interaction:started |
| 第03日 06:16 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 06:16 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第03日 06:21 | 宝玉 | 被莺儿完成互动：「调侃」 |  | interaction:complete |
| 第03日 06:30 | 宝玉 | 行动入队：💬 闲谈·宝钗 |  | queue:add |
| 第03日 06:30 | 宝玉 | AI选择：闲谈·宝钗 [int:102:baochai] provider=social |  | ai:decision |
| 第03日 06:31 | 宝玉 | AI每日主动社交计数：宝钗 4/10 |  | ai:daily_social_count |
| 第03日 06:31 | 宝玉 | 开始互动：与宝钗「闲谈」 |  | interaction:started |
| 第03日 06:33 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 06:34 | 黛玉 | 开始任务：传话 | 黛玉 | quest:started |
| 第03日 06:38 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 06:38 | 宝玉 | 完成互动：与宝钗「闲谈」 |  | interaction:complete |
| 第03日 06:38 | 宝玉 | 被宝钗发起互动：「调侃」 |  | interaction:started |
| 第03日 06:40 | 黛玉 | 完成任务：传话 | 黛玉 | quest:completed |
| 第03日 06:40 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 06:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 06:45 | 黛玉 | AI选择：居家闲步 [w:home:6,30] provider=homeward |  | ai:decision |
| 第03日 06:45 | 宝玉 | 被宝钗完成互动：「调侃」 |  | interaction:complete |
| 第03日 07:00 | 宝玉 | 下发任务给晴雯：随侍左右 | 宝玉 | quest:issued |
| 第03日 07:00 | 宝玉 | 接受任务：随侍左右 | 宝玉 | quest:accepted |
| 第03日 07:00 | 黛玉 | 下发任务给雪雁：备膳 | 黛玉 | quest:issued |
| 第03日 07:00 | 黛玉 | 接受任务：备膳 | 黛玉 | quest:accepted |
| 第03日 07:00 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第03日 07:00 | 宝玉 | AI每日主动社交计数：大老爷 1/10 |  | ai:daily_social_count |
| 第03日 07:00 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第03日 07:00 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第03日 07:13 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 07:13 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第03日 07:15 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 07:15 | 宝玉 | AI每日主动社交计数：刘姥姥 5/10 |  | ai:daily_social_count |
| 第03日 07:15 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 07:15 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 07:15 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 07:15 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第03日 07:15 | 宝玉 | 被大老爷发起互动：「调侃」 |  | interaction:started |
| 第03日 07:16 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 07:16 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 07:16 | 黛玉 | AI选择：闲游 [w:8,28] provider=wander |  | ai:decision |
| 第03日 07:21 | 宝玉 | 被大老爷完成互动：「调侃」 |  | interaction:complete |
| 第03日 07:27 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 07:27 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第03日 07:30 | 宝玉 | 行动入队：🤝 品茗·雪雁 |  | queue:add |
| 第03日 07:30 | 宝玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第03日 07:30 | 宝玉 | 开始互动：与雪雁「品茗」 |  | interaction:started |
| 第03日 07:30 | 宝玉 | AI选择：品茗·雪雁 [int:104:xueyan] provider=social |  | ai:decision |
| 第03日 07:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 07:30 | 黛玉 | AI选择：居家闲步 [w:home:14,34] provider=homeward |  | ai:decision |
| 第03日 07:31 | 宝玉 | AI选择：逛园 [w:pub:15,25] provider=homeward |  | ai:decision |
| 第03日 07:44 | 黛玉 | 行动入队：💬 论禅·探春 |  | queue:add |
| 第03日 07:44 | 黛玉 | AI选择：论禅·探春 [int:205:tanchun] provider=social |  | ai:decision |
| 第03日 07:45 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第03日 07:45 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture |  | ai:decision |
| 第03日 07:45 | 宝玉 | 被麝月发起互动：「寒暄」 |  | interaction:started |
| 第03日 07:45 | 黛玉 | 完成任务：备膳 | 黛玉 | quest:completed |
| 第03日 07:46 | 宝玉 | 被蓉哥儿发起互动：「问安」 |  | interaction:started |
| 第03日 07:51 | 宝玉 | 被麝月完成互动：「寒暄」 |  | interaction:complete |
| 第03日 07:51 | 宝玉 | 被莺儿发起互动：「寒暄」 |  | interaction:started |
| 第03日 07:52 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 07:53 | 宝玉 | 被蓉哥儿完成互动：「问安」 |  | interaction:complete |
| 第03日 07:54 | 宝玉 | 行动入队：💬 闲谈·麝月 |  | queue:add |
| 第03日 07:54 | 宝玉 | AI每日主动社交计数：麝月 1/10 |  | ai:daily_social_count |
| 第03日 07:54 | 宝玉 | 开始互动：与麝月「闲谈」 |  | interaction:started |
| 第03日 07:54 | 宝玉 | AI选择：闲谈·麝月 [int:102:sheyue] provider=social |  | ai:decision |
| 第03日 07:58 | 宝玉 | 被莺儿完成互动：「寒暄」 |  | interaction:complete |
| 第03日 08:00 | 黛玉 | 下发任务给雪雁：传话 | 黛玉 | quest:issued |
| 第03日 08:00 | 黛玉 | 接受任务：传话 | 黛玉 | quest:accepted |
| 第03日 08:00 | 黛玉 | 任务下发：晨昏定省（全员） | 大老爷 | quest:issued |
| 第03日 08:00 | 黛玉 | 接受任务：晨昏定省（全员） | 大老爷 | quest:accepted |
| 第03日 08:00 | 全局 | 时段切换：上午 |  | time:period |
| 第03日 08:00 | 宝玉 | 被刘姥姥发起互动：「闲谈」 |  | interaction:started |
| 第03日 08:01 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第03日 08:01 | 宝玉 | 完成互动：与麝月「闲谈」 |  | interaction:complete |
| 第03日 08:07 | 宝玉 | 被刘姥姥完成互动：「闲谈」 |  | interaction:complete |
| 第03日 08:10 | 宝玉 | 被贾母发起互动：「嬉闹」 |  | interaction:started |
| 第03日 08:19 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 08:26 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 08:26 | 宝玉 | 被贾母完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 08:30 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第03日 08:30 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第03日 08:30 | 黛玉 | 行动入队：💬 论禅·宝玉 |  | queue:add |
| 第03日 08:30 | 黛玉 | AI选择：论禅·宝玉 [int:205:baoyu] provider=social |  | ai:decision |
| 第03日 08:37 | 宝玉 | AI每日主动社交计数：大老爷 2/10 |  | ai:daily_social_count |
| 第03日 08:37 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第03日 08:39 | 宝玉 | 被晴雯发起互动：「寒暄」 |  | interaction:started |
| 第03日 08:44 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 08:44 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第03日 08:45 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第03日 08:45 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第03日 08:46 | 宝玉 | 被晴雯完成互动：「寒暄」 |  | interaction:complete |
| 第03日 08:47 | 宝玉 | AI每日主动社交计数：刘姥姥 6/10 |  | ai:daily_social_count |
| 第03日 08:47 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第03日 08:55 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 08:55 | 宝玉 | 完成互动：与刘姥姥「问安」 |  | interaction:complete |
| 第03日 09:00 | 宝玉 | 行动入队：💬 闲谈·宝钗 |  | queue:add |
| 第03日 09:00 | 宝玉 | AI选择：闲谈·宝钗 [int:102:baochai] provider=social |  | ai:decision |
| 第03日 09:01 | 黛玉 | 任务失败：晨昏定省，超时 | 政老爷 | quest:failed |
| 第03日 09:01 | 黛玉 | 任务失败：晨昏定省（全员），超时 | 大老爷 | quest:failed |
| 第03日 09:01 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 09:01 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 09:01 | 宝玉 | AI每日主动社交计数：宝钗 5/10 |  | ai:daily_social_count |
| 第03日 09:01 | 宝玉 | 开始互动：与宝钗「闲谈」 |  | interaction:started |
| 第03日 09:02 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第03日 09:08 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 09:08 | 宝玉 | 完成互动：与宝钗「闲谈」 |  | interaction:complete |
| 第03日 09:15 | 宝玉 | 行动入队：💬 问安·贾母 |  | queue:add |
| 第03日 09:15 | 宝玉 | AI每日主动社交计数：贾母 1/10 |  | ai:daily_social_count |
| 第03日 09:15 | 宝玉 | 开始互动：与贾母「问安」 |  | interaction:started |
| 第03日 09:15 | 宝玉 | AI选择：问安·贾母 [int:103:jiamu] provider=social |  | ai:decision |
| 第03日 09:15 | 宝玉 | 被麝月发起互动：「嬉闹」 |  | interaction:started |
| 第03日 09:15 | 宝玉 | 被大老爷发起互动：「调侃」 |  | interaction:started |
| 第03日 09:17 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 09:17 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第03日 09:21 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 09:21 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 09:21 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 09:21 | 宝玉 | 完成互动：与贾母「问安」 |  | interaction:complete |
| 第03日 09:22 | 宝玉 | 被大老爷完成互动：「调侃」 |  | interaction:complete |
| 第03日 09:25 | 宝玉 | 被袭人发起互动：「品茗」 |  | interaction:started |
| 第03日 09:30 | 宝玉 | 被刘姥姥发起互动：「打趣」 |  | interaction:started |
| 第03日 09:31 | 宝玉 | 被麝月完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 09:35 | 宝玉 | 被蓉哥儿发起互动：「问安」 |  | interaction:started |
| 第03日 09:37 | 宝玉 | 被刘姥姥完成互动：「打趣」 |  | interaction:complete |
| 第03日 09:38 | 宝玉 | 被袭人完成互动：「品茗」 |  | interaction:complete |
| 第03日 09:40 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 09:43 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 09:43 | 宝玉 | 被蓉哥儿完成互动：「问安」 |  | interaction:complete |
| 第03日 09:45 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第03日 09:45 | 宝玉 | AI每日主动社交计数：麝月 2/10 |  | ai:daily_social_count |
| 第03日 09:45 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第03日 09:45 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第03日 09:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 09:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 09:47 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 09:53 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 09:56 | 宝玉 | 被贾母发起互动：「嬉闹」 |  | interaction:started |
| 第03日 09:57 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 09:58 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 10:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 10:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 10:01 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第03日 10:03 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:03 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第03日 10:08 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第03日 10:09 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 10:11 | 宝玉 | 被贾母完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 10:15 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 10:15 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture |  | ai:decision |
| 第03日 10:15 | 宝玉 | 行动入队：🤝 对酌·大老爷 |  | queue:add |
| 第03日 10:15 | 宝玉 | AI选择：对酌·大老爷 [int:105:jiashe] provider=social |  | ai:decision |
| 第03日 10:15 | 宝玉 | AI每日主动社交计数：大老爷 3/10 |  | ai:daily_social_count |
| 第03日 10:15 | 宝玉 | 开始互动：与大老爷「对酌」 |  | interaction:started |
| 第03日 10:16 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 10:16 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture |  | ai:decision |
| 第03日 10:18 | 黛玉 | 行动入队：🤝 对弈·紫鹃 |  | queue:add |
| 第03日 10:18 | 黛玉 | AI选择：对弈·紫鹃 [int:202:zijuan] provider=social |  | ai:decision |
| 第03日 10:21 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 10:22 | 黛玉 | AI每日主动社交计数：紫鹃 3/10 |  | ai:daily_social_count |
| 第03日 10:22 | 黛玉 | 开始互动：与紫鹃「对弈」 |  | interaction:started |
| 第03日 10:34 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:34 | 宝玉 | 完成互动：与大老爷「对酌」 |  | interaction:complete |
| 第03日 10:37 | 宝玉 | 被宝钗发起互动：「揭短」 |  | interaction:started |
| 第03日 10:40 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:40 | 黛玉 | 完成互动：与紫鹃「对弈」 |  | interaction:complete |
| 第03日 10:41 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 10:44 | 宝玉 | 被宝钗完成互动：「揭短」 |  | interaction:complete |
| 第03日 10:45 | 宝玉 | 行动入队：🤝 对酌·贾母 |  | queue:add |
| 第03日 10:45 | 宝玉 | AI选择：对酌·贾母 [int:105:jiamu] provider=social |  | ai:decision |
| 第03日 10:45 | 宝玉 | AI每日主动社交计数：贾母 2/10 |  | ai:daily_social_count |
| 第03日 10:45 | 宝玉 | 开始互动：与贾母「对酌」 |  | interaction:started |
| 第03日 10:49 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 10:55 | 宝玉 | 被探春发起互动：「对弈」 |  | interaction:started |
| 第03日 11:00 | 黛玉 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第03日 11:00 | 黛玉 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第03日 11:00 | 黛玉 | AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture |  | ai:decision |
| 第03日 11:00 | 宝玉 | 被麝月发起互动：「揭短」 |  | interaction:started |
| 第03日 11:01 | 黛玉 | 任务失败：传话，超时 | 黛玉 | quest:failed |
| 第03日 11:01 | 黛玉 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第03日 11:01 | 黛玉 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第03日 11:01 | 黛玉 | AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture |  | ai:decision |
| 第03日 11:03 | 黛玉 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第03日 11:04 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 11:04 | 宝玉 | 完成互动：与贾母「对酌」 |  | interaction:complete |
| 第03日 11:07 | 宝玉 | 被麝月完成互动：「揭短」 |  | interaction:complete |
| 第03日 11:13 | 宝玉 | 被探春完成互动：「对弈」 |  | interaction:complete |
| 第03日 11:15 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 11:15 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 11:15 | 黛玉 | 行动入队：🤝 对弈·琏二爷 |  | queue:add |
| 第03日 11:15 | 黛玉 | AI选择：对弈·琏二爷 [int:202:jialian] provider=social |  | ai:decision |
| 第03日 11:16 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 11:16 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 11:16 | 黛玉 | AI选择：居家闲步 [w:home:6,31] provider=homeward |  | ai:decision |
| 第03日 11:19 | 宝玉 | AI每日主动社交计数：刘姥姥 7/10 |  | ai:daily_social_count |
| 第03日 11:19 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 11:20 | 宝玉 | 被晴雯发起互动：「寒暄」 |  | interaction:started |
| 第03日 11:27 | 宝玉 | 被晴雯完成互动：「寒暄」 |  | interaction:complete |
| 第03日 11:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 11:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 11:31 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第03日 11:32 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 11:32 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第03日 11:32 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 11:38 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 11:38 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第03日 11:45 | 宝玉 | 行动入队：💬 闲谈·麝月 |  | queue:add |
| 第03日 11:45 | 宝玉 | AI选择：闲谈·麝月 [int:102:sheyue] provider=social |  | ai:decision |
| 第03日 11:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 11:45 | 黛玉 | AI选择：闲游 [w:8,33] provider=wander |  | ai:decision |
| 第03日 11:45 | 宝玉 | 被大老爷发起互动：「调侃」 |  | interaction:started |
| 第03日 11:46 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 11:46 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 11:46 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第03日 11:47 | 黛玉 | 被雪雁发起互动：「嬉闹」 |  | interaction:started |
| 第03日 11:49 | 宝玉 | AI每日主动社交计数：麝月 3/10 |  | ai:daily_social_count |
| 第03日 11:49 | 宝玉 | 开始互动：与麝月「闲谈」 |  | interaction:started |
| 第03日 11:51 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第03日 11:52 | 宝玉 | 被大老爷完成互动：「调侃」 |  | interaction:complete |
| 第03日 11:56 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 11:56 | 宝玉 | 完成互动：与麝月「闲谈」 |  | interaction:complete |
| 第03日 12:00 | 宝玉 | 任务下发：作诗陪吟 | 政老爷 | quest:issued |
| 第03日 12:00 | 宝玉 | 接受任务：作诗陪吟 | 政老爷 | quest:accepted |
| 第03日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第03日 12:00 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第03日 12:00 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第03日 12:00 | 宝玉 | 被蓉哥儿发起互动：「问安」 |  | interaction:started |
| 第03日 12:03 | 黛玉 | 被雪雁完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 12:04 | 宝玉 | 被刘姥姥发起互动：「打趣」 |  | interaction:started |
| 第03日 12:07 | 宝玉 | 被蓉哥儿完成互动：「问安」 |  | interaction:complete |
| 第03日 12:09 | 宝玉 | AI每日主动社交计数：大老爷 4/10 |  | ai:daily_social_count |
| 第03日 12:09 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第03日 12:11 | 宝玉 | 被刘姥姥完成互动：「打趣」 |  | interaction:complete |
| 第03日 12:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 12:15 | 黛玉 | AI选择：居家闲步 [w:home:7,32] provider=homeward |  | ai:decision |
| 第03日 12:16 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 12:16 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第03日 12:21 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 12:21 | 黛玉 | 完成任务：随侍黛玉 | 黛玉 | quest:completed |
| 第03日 12:30 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第03日 12:30 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social |  | ai:decision |
| 第03日 12:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 12:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 12:32 | 宝玉 | AI每日主动社交计数：莺儿 6/10 |  | ai:daily_social_count |
| 第03日 12:32 | 宝玉 | 开始互动：与莺儿「对酌」 |  | interaction:started |
| 第03日 12:32 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 12:38 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 12:45 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 12:45 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第03日 12:45 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 12:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 12:46 | 黛玉 | AI选择：闲游 [w:12,34] provider=wander |  | ai:decision |
| 第03日 12:47 | 宝玉 | 被贾母发起互动：「嬉闹」 |  | interaction:started |
| 第03日 12:51 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:51 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:51 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 12:51 | 宝玉 | 完成互动：与莺儿「对酌」 |  | interaction:complete |
| 第03日 12:52 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:52 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:53 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:53 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:53 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 12:54 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:54 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 12:54 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:55 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 12:55 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 12:55 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 12:55 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 13:00 | 黛玉 | 下发任务给紫鹃：服侍更衣 | 黛玉 | quest:issued |
| 第03日 13:00 | 黛玉 | 接受任务：服侍更衣 | 黛玉 | quest:accepted |
| 第03日 13:00 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第03日 13:00 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social |  | ai:decision |
| 第03日 13:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 13:00 | 黛玉 | AI选择：居家闲步 [w:home:11,33] provider=homeward |  | ai:decision |
| 第03日 13:01 | 宝玉 | 被莺儿发起互动：「品茗」 |  | interaction:started |
| 第03日 13:03 | 宝玉 | 被贾母完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 13:04 | 宝玉 | 行动入队：💬 打趣·贾母 |  | queue:add |
| 第03日 13:04 | 宝玉 | AI选择：打趣·贾母 [int:301:jiamu] provider=social |  | ai:decision |
| 第03日 13:04 | 宝玉 | 被宝钗发起互动：「打趣」 |  | interaction:started |
| 第03日 13:07 | 宝玉 | 被探春发起互动：「联句」 |  | interaction:started |
| 第03日 13:08 | 黛玉 | 开始任务：服侍更衣 | 黛玉 | quest:started |
| 第03日 13:11 | 宝玉 | 被宝钗完成互动：「打趣」 |  | interaction:complete |
| 第03日 13:14 | 宝玉 | AI每日主动社交计数：贾母 3/10 |  | ai:daily_social_count |
| 第03日 13:14 | 宝玉 | 开始互动：与贾母「打趣」 |  | interaction:started |
| 第03日 13:14 | 宝玉 | 被莺儿完成互动：「品茗」 |  | interaction:complete |
| 第03日 13:15 | 黛玉 | 行动入队：🤝 对弈·雪雁 |  | queue:add |
| 第03日 13:15 | 黛玉 | AI选择：对弈·雪雁 [int:202:xueyan] provider=social |  | ai:decision |
| 第03日 13:16 | 宝玉 | 被琏二爷发起互动：「调侃」 |  | interaction:started |
| 第03日 13:21 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 13:21 | 宝玉 | 完成互动：与贾母「打趣」 |  | interaction:complete |
| 第03日 13:23 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第03日 13:23 | 黛玉 | 开始互动：与雪雁「对弈」 |  | interaction:started |
| 第03日 13:23 | 宝玉 | 被琏二爷完成互动：「调侃」 |  | interaction:complete |
| 第03日 13:30 | 宝玉 | 行动入队：💬 打趣·宝钗 |  | queue:add |
| 第03日 13:30 | 宝玉 | AI选择：打趣·宝钗 [int:301:baochai] provider=social |  | ai:decision |
| 第03日 13:30 | 宝玉 | 被刘姥姥发起互动：「打趣」 |  | interaction:started |
| 第03日 13:37 | 宝玉 | 被刘姥姥完成互动：「打趣」 |  | interaction:complete |
| 第03日 13:39 | 宝玉 | AI每日主动社交计数：宝钗 6/10 |  | ai:daily_social_count |
| 第03日 13:39 | 宝玉 | 开始互动：与宝钗「打趣」 |  | interaction:started |
| 第03日 13:41 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第03日 13:41 | 黛玉 | 完成互动：与雪雁「对弈」 |  | interaction:complete |
| 第03日 13:44 | 黛玉 | 开始任务：服侍更衣 | 黛玉 | quest:started |
| 第03日 13:44 | 黛玉 | 完成任务：服侍更衣 | 黛玉 | quest:completed |
| 第03日 13:44 | 黛玉 | 被紫鹃发起互动：「对酌」 |  | interaction:started |
| 第03日 13:46 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 13:46 | 宝玉 | 完成互动：与宝钗「打趣」 |  | interaction:complete |
| 第03日 14:00 | 黛玉 | 下发任务给紫鹃：陪黛玉读书 | 黛玉 | quest:issued |
| 第03日 14:00 | 黛玉 | 接受任务：陪黛玉读书 | 黛玉 | quest:accepted |
| 第03日 14:00 | 黛玉 | 开始任务：陪黛玉读书 | 黛玉 | quest:started |
| 第03日 14:00 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第03日 14:00 | 宝玉 | AI每日主动社交计数：大老爷 5/10 |  | ai:daily_social_count |
| 第03日 14:00 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第03日 14:00 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第03日 14:03 | 黛玉 | 被紫鹃完成互动：「对酌」 |  | interaction:complete |
| 第03日 14:07 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 14:07 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第03日 14:15 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第03日 14:15 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第03日 14:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 14:15 | 黛玉 | AI选择：居家闲步 [w:home:8,34] provider=homeward |  | ai:decision |
| 第03日 14:15 | 宝玉 | 被大老爷发起互动：「寒暄」 |  | interaction:started |
| 第03日 14:21 | 宝玉 | 被大老爷完成互动：「寒暄」 |  | interaction:complete |
| 第03日 14:23 | 宝玉 | AI每日主动社交计数：刘姥姥 8/10 |  | ai:daily_social_count |
| 第03日 14:23 | 宝玉 | 开始互动：与刘姥姥「对酌」 |  | interaction:started |
| 第03日 14:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 14:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 14:30 | 宝玉 | 被莺儿发起互动：「对酌」 |  | interaction:started |
| 第03日 14:31 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 14:31 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 14:32 | 宝玉 | 被王夫人发起互动：「调侃」 |  | interaction:started |
| 第03日 14:34 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 14:37 | 宝玉 | 被宝钗发起互动：「调侃」 |  | interaction:started |
| 第03日 14:40 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 14:43 | 宝玉 | AI目标频控：刘姥姥 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 14:43 | 宝玉 | 完成互动：与刘姥姥「对酌」 |  | interaction:complete |
| 第03日 14:44 | 宝玉 | 被宝钗完成互动：「调侃」 |  | interaction:complete |
| 第03日 14:45 | 宝玉 | 行动入队：🤝 对酌·麝月 |  | queue:add |
| 第03日 14:45 | 宝玉 | AI选择：对酌·麝月 [int:105:sheyue] provider=social |  | ai:decision |
| 第03日 14:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 14:45 | 黛玉 | AI选择：闲游 [w:8,34] provider=wander |  | ai:decision |
| 第03日 14:46 | 宝玉 | AI每日主动社交计数：麝月 4/10 |  | ai:daily_social_count |
| 第03日 14:46 | 宝玉 | 开始互动：与麝月「对酌」 |  | interaction:started |
| 第03日 14:49 | 宝玉 | 被莺儿完成互动：「对酌」 |  | interaction:complete |
| 第03日 15:00 | 黛玉 | 下发任务给紫鹃：晨昏定省 | 黛玉 | quest:issued |
| 第03日 15:00 | 黛玉 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第03日 15:00 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第03日 15:00 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第03日 15:00 | 宝玉 | 被麝月发起互动：「对酌」 |  | interaction:started |
| 第03日 15:05 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 15:05 | 宝玉 | 完成互动：与麝月「对酌」 |  | interaction:complete |
| 第03日 15:10 | 黛玉 | AI每日主动社交计数：紫鹃 4/10 |  | ai:daily_social_count |
| 第03日 15:10 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第03日 15:15 | 宝玉 | 行动入队：💬 打趣·莺儿 |  | queue:add |
| 第03日 15:15 | 宝玉 | AI选择：打趣·莺儿 [int:301:yinger] provider=social |  | ai:decision |
| 第03日 15:15 | 宝玉 | AI每日主动社交计数：莺儿 7/10 |  | ai:daily_social_count |
| 第03日 15:15 | 宝玉 | 开始互动：与莺儿「打趣」 |  | interaction:started |
| 第03日 15:15 | 宝玉 | 被刘姥姥发起互动：「调侃」 |  | interaction:started |
| 第03日 15:17 | 黛玉 | 完成任务：晨昏定省 | 黛玉 | quest:completed |
| 第03日 15:17 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第03日 15:17 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第03日 15:19 | 宝玉 | 被麝月完成互动：「对酌」 |  | interaction:complete |
| 第03日 15:22 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 15:22 | 宝玉 | 完成互动：与莺儿「打趣」 |  | interaction:complete |
| 第03日 15:22 | 宝玉 | 被刘姥姥完成互动：「调侃」 |  | interaction:complete |
| 第03日 15:26 | 宝玉 | 被琏二爷发起互动：「对酌」 |  | interaction:started |
| 第03日 15:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 15:30 | 黛玉 | AI选择：居家闲步 [w:home:6,31] provider=homeward |  | ai:decision |
| 第03日 15:31 | 宝玉 | 被贾母发起互动：「对酌」 |  | interaction:started |
| 第03日 15:32 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第03日 15:32 | 宝玉 | 被晴雯发起互动：「品茗」 |  | interaction:started |
| 第03日 15:45 | 黛玉 | 行动入队：🤝 对弈·宝玉 |  | queue:add |
| 第03日 15:45 | 黛玉 | AI选择：对弈·宝玉 [int:202:baoyu] provider=social |  | ai:decision |
| 第03日 15:45 | 宝玉 | 被大老爷发起互动：「调侃」 |  | interaction:started |
| 第03日 15:45 | 宝玉 | 被晴雯完成互动：「品茗」 |  | interaction:complete |
| 第03日 15:45 | 宝玉 | 被琏二爷完成互动：「对酌」 |  | interaction:complete |
| 第03日 15:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 15:48 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:48 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 15:49 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:49 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 15:50 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:50 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 15:50 | 宝玉 | 被贾母完成互动：「对酌」 |  | interaction:complete |
| 第03日 15:51 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:51 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 15:51 | 宝玉 | 被大老爷完成互动：「调侃」 |  | interaction:complete |
| 第03日 15:52 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:52 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 15:52 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 15:53 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:53 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 15:53 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 15:53 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 16:00 | 宝玉 | 下发任务给晴雯：晨昏定省 | 宝玉 | quest:issued |
| 第03日 16:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第03日 16:00 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第03日 16:00 | 宝玉 | AI每日主动社交计数：大老爷 6/10 |  | ai:daily_social_count |
| 第03日 16:00 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第03日 16:00 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第03日 16:00 | 黛玉 | 行动入队：🤝 对弈·珍大爷 |  | queue:add |
| 第03日 16:00 | 黛玉 | AI选择：对弈·珍大爷 [int:202:jiazhen] provider=social |  | ai:decision |
| 第03日 16:01 | 宝玉 | 任务失败：作诗陪吟，超时 | 政老爷 | quest:failed |
| 第03日 16:01 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第03日 16:01 | 宝玉 | AI每日主动社交计数：大老爷 7/10 |  | ai:daily_social_count |
| 第03日 16:01 | 宝玉 | 开始互动：与大老爷「寒暄」 |  | interaction:started |
| 第03日 16:01 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social |  | ai:decision |
| 第03日 16:01 | 宝玉 | 被宝钗发起互动：「揭短」 |  | interaction:started |
| 第03日 16:07 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:07 | 宝玉 | 完成互动：与大老爷「寒暄」 |  | interaction:complete |
| 第03日 16:08 | 宝玉 | 被宝钗完成互动：「揭短」 |  | interaction:complete |
| 第03日 16:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 16:15 | 黛玉 | AI选择：居家闲步 [w:home:5,28] provider=homeward |  | ai:decision |
| 第03日 16:15 | 宝玉 | 行动入队：💬 打趣·贾母 |  | queue:add |
| 第03日 16:15 | 宝玉 | AI每日主动社交计数：贾母 4/10 |  | ai:daily_social_count |
| 第03日 16:15 | 宝玉 | 开始互动：与贾母「打趣」 |  | interaction:started |
| 第03日 16:15 | 宝玉 | AI选择：打趣·贾母 [int:301:jiamu] provider=social |  | ai:decision |
| 第03日 16:19 | 宝玉 | 被蓉哥儿发起互动：「寒暄」 |  | interaction:started |
| 第03日 16:21 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:21 | 宝玉 | 完成互动：与贾母「打趣」 |  | interaction:complete |
| 第03日 16:21 | 黛玉 | 被紫鹃发起互动：「问安」 |  | interaction:started |
| 第03日 16:22 | 黛玉 | 开始任务：陪黛玉读书 | 黛玉 | quest:started |
| 第03日 16:23 | 黛玉 | 完成任务：陪黛玉读书 | 黛玉 | quest:completed |
| 第03日 16:26 | 宝玉 | 被蓉哥儿完成互动：「寒暄」 |  | interaction:complete |
| 第03日 16:28 | 黛玉 | 被紫鹃完成互动：「问安」 |  | interaction:complete |
| 第03日 16:30 | 宝玉 | 行动入队：🤝 品茗·琏二爷 |  | queue:add |
| 第03日 16:30 | 宝玉 | AI每日主动社交计数：琏二爷 3/10 |  | ai:daily_social_count |
| 第03日 16:30 | 宝玉 | 开始互动：与琏二爷「品茗」 |  | interaction:started |
| 第03日 16:30 | 宝玉 | AI选择：品茗·琏二爷 [int:104:jialian] provider=social |  | ai:decision |
| 第03日 16:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 16:30 | 黛玉 | AI选择：居家闲步 [w:home:5,32] provider=homeward |  | ai:decision |
| 第03日 16:33 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 16:33 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 16:35 | 黛玉 | 行动入队：🤝 对弈·宝玉 |  | queue:add |
| 第03日 16:35 | 黛玉 | AI选择：对弈·宝玉 [int:202:baoyu] provider=social |  | ai:decision |
| 第03日 16:41 | 宝玉 | 行动入队：💬 打趣·莺儿 |  | queue:add |
| 第03日 16:41 | 宝玉 | AI选择：打趣·莺儿 [int:301:yinger] provider=social |  | ai:decision |
| 第03日 16:41 | 宝玉 | AI每日主动社交计数：莺儿 8/10 |  | ai:daily_social_count |
| 第03日 16:41 | 宝玉 | 开始互动：与莺儿「打趣」 |  | interaction:started |
| 第03日 16:45 | 宝玉 | 被麝月发起互动：「揭短」 |  | interaction:started |
| 第03日 16:49 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:49 | 宝玉 | 完成互动：与莺儿「打趣」 |  | interaction:complete |
| 第03日 16:52 | 宝玉 | 被麝月完成互动：「揭短」 |  | interaction:complete |
| 第03日 17:00 | 宝玉 | 下发任务给麝月：晨昏定省 | 宝玉 | quest:issued |
| 第03日 17:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第03日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第03日 17:00 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第03日 17:00 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第03日 17:00 | 宝玉 | 被莺儿发起互动：「对酌」 |  | interaction:started |
| 第03日 17:02 | 宝玉 | AI每日主动社交计数：刘姥姥 9/10 |  | ai:daily_social_count |
| 第03日 17:02 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第03日 17:09 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:09 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第03日 17:15 | 宝玉 | 行动入队：💬 打趣·宝钗 |  | queue:add |
| 第03日 17:15 | 宝玉 | AI选择：打趣·宝钗 [int:301:baochai] provider=social |  | ai:decision |
| 第03日 17:19 | 宝玉 | 被莺儿完成互动：「对酌」 |  | interaction:complete |
| 第03日 17:22 | 宝玉 | AI每日主动社交计数：宝钗 7/10 |  | ai:daily_social_count |
| 第03日 17:22 | 宝玉 | 开始互动：与宝钗「打趣」 |  | interaction:started |
| 第03日 17:29 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 17:29 | 宝玉 | 完成互动：与宝钗「打趣」 |  | interaction:complete |
| 第03日 17:30 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第03日 17:30 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第03日 17:32 | 宝玉 | 被刘姥姥发起互动：「问安」 |  | interaction:started |
| 第03日 17:39 | 宝玉 | 被刘姥姥完成互动：「问安」 |  | interaction:complete |
| 第03日 17:40 | 宝玉 | AI每日主动社交计数：大老爷 8/10 |  | ai:daily_social_count |
| 第03日 17:40 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第03日 17:43 | 黛玉 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第03日 17:43 | 黛玉 | 开始互动：与宝玉「对弈」 |  | interaction:started |
| 第03日 17:43 | 宝玉 | 被黛玉发起互动：「对弈」 |  | interaction:started |
| 第03日 17:53 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:53 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第03日 17:54 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 17:54 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 18:00 | 宝玉 | 行动入队：💬 寒暄·贾母 |  | queue:add |
| 第03日 18:00 | 宝玉 | AI选择：寒暄·贾母 [int:101:jiamu] provider=social |  | ai:decision |
| 第03日 18:01 | 宝玉 | AI每日主动社交计数：贾母 5/10 |  | ai:daily_social_count |
| 第03日 18:01 | 宝玉 | 开始互动：与贾母「寒暄」 |  | interaction:started |
| 第03日 18:08 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:08 | 宝玉 | 完成互动：与贾母「寒暄」 |  | interaction:complete |
| 第03日 18:08 | 宝玉 | 被贾母发起互动：「打趣」 |  | interaction:started |
| 第03日 18:15 | 宝玉 | 被贾母完成互动：「打趣」 |  | interaction:complete |
| 第03日 18:30 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第03日 18:30 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第03日 18:31 | 宝玉 | AI每日主动社交计数：刘姥姥 10/10 |  | ai:daily_social_count |
| 第03日 18:31 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第03日 18:38 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:38 | 宝玉 | 完成互动：与刘姥姥「问安」 |  | interaction:complete |
| 第03日 18:41 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 18:41 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 18:45 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第03日 18:45 | 宝玉 | AI每日主动社交计数：莺儿 9/10 |  | ai:daily_social_count |
| 第03日 18:45 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第03日 18:45 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第03日 18:51 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:51 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第03日 19:00 | 宝玉 | 行动入队：🤝 品茗·麝月 |  | queue:add |
| 第03日 19:00 | 宝玉 | AI每日主动社交计数：麝月 5/10 |  | ai:daily_social_count |
| 第03日 19:00 | 宝玉 | 开始互动：与麝月「品茗」 |  | interaction:started |
| 第03日 19:00 | 宝玉 | AI选择：品茗·麝月 [int:104:sheyue] provider=social |  | ai:decision |
| 第03日 19:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:01 | 宝玉 | 任务失败：随侍左右，超时 | 宝玉 | quest:failed |
| 第03日 19:07 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 19:13 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第03日 19:13 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 19:13 | 宝玉 | 完成互动：与麝月「品茗」 |  | interaction:complete |
| 第03日 19:14 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 19:15 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第03日 19:15 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social |  | ai:decision |
| 第03日 19:15 | 宝玉 | AI每日主动社交计数：大老爷 9/10 |  | ai:daily_social_count |
| 第03日 19:15 | 宝玉 | 开始互动：与大老爷「寒暄」 |  | interaction:started |
| 第03日 19:19 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 19:20 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 19:22 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 19:22 | 宝玉 | 完成互动：与大老爷「寒暄」 |  | interaction:complete |
| 第03日 19:30 | 宝玉 | 行动入队：💬 寒暄·贾母 |  | queue:add |
| 第03日 19:30 | 宝玉 | AI每日主动社交计数：贾母 6/10 |  | ai:daily_social_count |
| 第03日 19:30 | 宝玉 | 开始互动：与贾母「寒暄」 |  | interaction:started |
| 第03日 19:30 | 宝玉 | AI选择：寒暄·贾母 [int:101:jiamu] provider=social |  | ai:decision |
| 第03日 19:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 19:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 19:30 | 宝玉 | 被莺儿发起互动：「对酌」 |  | interaction:started |
| 第03日 19:33 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 19:37 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 19:37 | 宝玉 | 完成互动：与贾母「寒暄」 |  | interaction:complete |
| 第03日 19:39 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 19:45 | 宝玉 | 行动入队：🤝 品茗·蓉哥儿 |  | queue:add |
| 第03日 19:45 | 宝玉 | AI每日主动社交计数：蓉哥儿 1/10 |  | ai:daily_social_count |
| 第03日 19:45 | 宝玉 | 开始互动：与蓉哥儿「品茗」 |  | interaction:started |
| 第03日 19:45 | 宝玉 | AI选择：品茗·蓉哥儿 [int:104:jiarong] provider=social |  | ai:decision |
| 第03日 19:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 19:45 | 黛玉 | AI选择：居家闲步 [w:home:6,30] provider=homeward |  | ai:decision |
| 第03日 19:45 | 宝玉 | 被贾母发起互动：「打趣」 |  | interaction:started |
| 第03日 19:49 | 宝玉 | 被莺儿完成互动：「对酌」 |  | interaction:complete |
| 第03日 19:51 | 宝玉 | 被贾母完成互动：「打趣」 |  | interaction:complete |
| 第03日 19:57 | 宝玉 | AI目标频控：蓉哥儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 19:57 | 宝玉 | 完成互动：与蓉哥儿「品茗」 |  | interaction:complete |
| 第03日 20:00 | 宝玉 | 下发任务给袭人：伺候就寝 | 宝玉 | quest:issued |
| 第03日 20:00 | 宝玉 | 接受任务：伺候就寝 | 宝玉 | quest:accepted |
| 第03日 20:00 | 黛玉 | 任务下发：抄写经文 | 政老爷 | quest:issued |
| 第03日 20:00 | 黛玉 | 接受任务：抄写经文 | 政老爷 | quest:accepted |
| 第03日 20:00 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第03日 20:00 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social |  | ai:decision |
| 第03日 20:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 20:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第03日 20:01 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 20:01 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第03日 20:01 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 20:01 | 宝玉 | AI每日主动社交计数：宝钗 8/10 |  | ai:daily_social_count |
| 第03日 20:01 | 宝玉 | 开始互动：与宝钗「问安」 |  | interaction:started |
| 第03日 20:02 | 黛玉 | 开始任务：抄写经文 | 政老爷 | quest:started |
| 第03日 20:02 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 20:02 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 20:02 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 20:03 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 20:08 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 20:08 | 宝玉 | 完成互动：与宝钗「问安」 |  | interaction:complete |
| 第03日 20:15 | 宝玉 | 行动入队：💬 打趣·莺儿 |  | queue:add |
| 第03日 20:15 | 宝玉 | AI每日主动社交计数：莺儿 10/10 |  | ai:daily_social_count |
| 第03日 20:15 | 宝玉 | 开始互动：与莺儿「打趣」 |  | interaction:started |
| 第03日 20:15 | 宝玉 | AI选择：打趣·莺儿 [int:301:yinger] provider=social |  | ai:decision |
| 第03日 20:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:21 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 20:21 | 宝玉 | 完成互动：与莺儿「打趣」 |  | interaction:complete |
| 第03日 20:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 20:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 20:22 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 20:23 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 20:30 | 宝玉 | 行动入队：💬 问安·琏二爷 |  | queue:add |
| 第03日 20:30 | 宝玉 | AI每日主动社交计数：琏二爷 4/10 |  | ai:daily_social_count |
| 第03日 20:30 | 宝玉 | 开始互动：与琏二爷「问安」 |  | interaction:started |
| 第03日 20:30 | 宝玉 | AI选择：问安·琏二爷 [int:103:jialian] provider=social |  | ai:decision |
| 第03日 20:30 | 黛玉 | 行动入队：💬 论禅·凤姐 |  | queue:add |
| 第03日 20:30 | 黛玉 | AI选择：论禅·凤姐 [int:205:xifeng] provider=social |  | ai:decision |
| 第03日 20:37 | 宝玉 | AI目标频控：琏二爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 20:37 | 宝玉 | 完成互动：与琏二爷「问安」 |  | interaction:complete |
| 第03日 20:45 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第03日 20:45 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第03日 20:45 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 20:45 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 20:45 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 20:45 | 宝玉 | AI每日主动社交计数：大老爷 10/10 |  | ai:daily_social_count |
| 第03日 20:45 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第03日 20:45 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 20:58 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 20:58 | 宝玉 | 完成互动：与大老爷「品茗」 |  | interaction:complete |
| 第03日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第03日 21:00 | 宝玉 | 行动入队：💬 辩理·政老爷 |  | queue:add |
| 第03日 21:00 | 宝玉 | AI选择：辩理·政老爷 [int:201:jiazheng] provider=social |  | ai:decision |
| 第03日 21:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 21:00 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 21:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 21:01 | 黛玉 | 开始任务：抄写经文 | 政老爷 | quest:started |
| 第03日 21:01 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 21:02 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 21:08 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 21:09 | 宝玉 | 行动入队：💬 评文·黛玉 |  | queue:add |
| 第03日 21:09 | 宝玉 | AI选择：评文·黛玉 [int:203:daiyu] provider=social |  | ai:decision |
| 第03日 21:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 21:15 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 21:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 21:15 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 21:29 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 21:37 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 21:45 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 21:45 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第03日 21:45 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 21:46 | 黛玉 | 开始任务：抄写经文 | 政老爷 | quest:started |
| 第03日 21:48 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:48 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:50 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:50 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:51 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:51 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:54 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:54 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:55 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:55 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:56 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:56 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:59 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:59 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 22:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:03 | 宝玉 | 行动入队：💬 论禅·贾母 |  | queue:add |
| 第03日 22:03 | 宝玉 | AI选择：论禅·贾母 [int:205:jiamu] provider=social |  | ai:decision |
| 第03日 22:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 22:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 22:22 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 22:23 | 黛玉 | 开始任务：抄写经文 | 政老爷 | quest:started |
| 第03日 22:26 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 22:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 22:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 22:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 22:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 22:35 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 22:35 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 22:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 22:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 22:38 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 22:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 22:39 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 22:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 22:39 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 22:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 22:45 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 22:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 22:45 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 22:51 | 宝玉 | AI每日主动社交计数：贾母 7/10 |  | ai:daily_social_count |
| 第03日 22:51 | 宝玉 | 开始互动：与贾母「论禅」 |  | interaction:started |
| 第03日 22:58 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 22:58 | 宝玉 | 完成互动：与贾母「论禅」 |  | interaction:complete |
| 第03日 23:00 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第03日 23:00 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第03日 23:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 23:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 23:01 | 宝玉 | 任务失败：伺候就寝，超时 | 宝玉 | quest:failed |
| 第03日 23:07 | 宝玉 | AI每日主动社交计数：宝钗 9/10 |  | ai:daily_social_count |
| 第03日 23:07 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第03日 23:14 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 23:14 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第03日 23:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 23:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 23:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 23:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 23:16 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 23:20 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第03日 23:22 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 23:23 | 黛玉 | 开始任务：抄写经文 | 政老爷 | quest:started |
| 第03日 23:25 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 23:30 | 宝玉 | 行动入队：💬 辩理·琏二爷 |  | queue:add |
| 第03日 23:30 | 宝玉 | AI选择：辩理·琏二爷 [int:201:jialian] provider=social |  | ai:decision |
| 第03日 23:30 | 黛玉 | 行动入队：💬 联句·刘姥姥 |  | queue:add |
| 第03日 23:30 | 黛玉 | AI选择：联句·刘姥姥 [int:204:liulaolao] provider=social |  | ai:decision |
| 第03日 23:31 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 23:31 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 23:31 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 23:31 | 宝玉 | AI每日主动社交计数：琏二爷 5/10 |  | ai:daily_social_count |
| 第03日 23:31 | 宝玉 | 开始互动：与琏二爷「辩理」 |  | interaction:started |
| 第03日 23:31 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 23:38 | 宝玉 | AI目标频控：琏二爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 23:38 | 宝玉 | 完成互动：与琏二爷「辩理」 |  | interaction:complete |
| 第03日 23:45 | 宝玉 | 行动入队：💬 辩理·政老爷 |  | queue:add |
| 第03日 23:45 | 宝玉 | AI每日主动社交计数：政老爷 1/10 |  | ai:daily_social_count |
| 第03日 23:45 | 宝玉 | 开始互动：与政老爷「辩理」 |  | interaction:started |
| 第03日 23:45 | 宝玉 | AI选择：辩理·政老爷 [int:201:jiazheng] provider=social |  | ai:decision |
| 第03日 23:45 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 23:45 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第03日 23:45 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 23:46 | 黛玉 | 开始任务：抄写经文 | 政老爷 | quest:started |
| 第03日 23:47 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 23:47 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 23:47 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 23:47 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 23:51 | 宝玉 | AI目标频控：政老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 23:51 | 宝玉 | 完成互动：与政老爷「辩理」 |  | interaction:complete |
| 第04日 00:00 | 全局 | 进入第4日 |  | time:day |
| 第04日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第04日 00:00 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第04日 00:00 | 宝玉 | AI每日主动社交计数：大老爷 1/10 |  | ai:daily_social_count |
| 第04日 00:00 | 宝玉 | 开始互动：与大老爷「论禅」 |  | interaction:started |
| 第04日 00:00 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第04日 00:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第04日 00:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| state:add | 17868 |
| state:remove | 17765 |
| need:band_changed | 14845 |
| log:add | 11853 |
| ai:state | 8570 |
| queue:add | 5227 |
| ai:decision | 5221 |
| time:tick | 3841 |
| character:effect | 2285 |
| emotion:resisted | 2177 |
| need:combination_triggered | 2111 |
| scene:entered | 1822 |
| scene:enter:allowed | 1821 |
| relation:axis_change | 1649 |
| furniture:use_started | 1019 |
| furniture:released | 1011 |
| ai:daily_social_count | 735 |
| interaction:started | 735 |
| furniture:complete | 679 |
| interaction:effects | 672 |
| ai:social_target_cooldown | 672 |
| interaction:complete | 672 |
| ai:candidate_rejected | 615 |
| quest:progress | 611 |
| emotion:contagion | 504 |
| quest:candidate | 485 |
| save:done | 414 |
| interaction:lowscore | 400 |
| interaction:state | 308 |
| relation:change | 291 |
| observer:triggered | 226 |
| observer:executed | 226 |
| quest:blocked | 176 |
| family:fund_changed | 159 |
| economy:food_paid | 150 |
| servant:follow_state | 111 |
| state:refresh | 106 |
| quest:started | 76 |
| quest:issued | 65 |
| quest:accepted | 64 |
| time:hour | 64 |
| trait:competition | 55 |
| furniture:reaction | 47 |
| need:critical | 37 |
| servant:relation_changed | 36 |
| quest:completed | 31 |
| quest:failed | 29 |
| invitation:sent | 26 |
| access:granted | 26 |
| invitation:expired | 25 |
| invitation:accepted | 19 |
| relation:threshold | 15 |
| money:change | 14 |
| trait:spending | 14 |
| time:period | 14 |
| reputation:change | 13 |
| economy:shift_started | 8 |
| economy:shift_ended | 8 |
| invitation:declined | 7 |
| servant:duty_issued | 6 |
| quest:acceptance_checked | 6 |
| quest:primed_action | 4 |
| servant:follow_rotation_issued | 4 |
| queue:failed | 3 |
| lifePath:storyNode | 3 |
| time:day | 3 |
| court | 2 |
| quest:declined | 1 |
| money:family | 1 |
| family:event | 1 |
| quest:batch_issued | 1 |
