# 潇湘馆 7 天离线模拟日志

- 模拟对象：黛玉、宝玉
- 模拟范围：第 1 日 08:00 到第 4 日 00:00 前
- 随机种子：61617
- 时间步长：1s，游戏设定 1 日 = 20 真实分钟
- 说明：这是无界面 fresh default config 离线模拟，未读取浏览器当前存档。

## 自动问题摘要

- 第2日 宝玉 出现 4 次受阻/失败，可能有路径、权限或任务条件问题。
- 第3日 宝玉 出现 4 次受阻/失败，可能有路径、权限或任务条件问题。
- 第3日 黛玉 出现 3 次受阻/失败，可能有路径、权限或任务条件问题。

## 高频重复行为

- 黛玉：行动入队：🥟 在点心案 ×137
- 黛玉：AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture ×105
- 黛玉：行动入队：🔥 在厨房灶台 ×81
- 黛玉：AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast ×52
- 黛玉：行动入队：📋 在樟木案几 ×42
- 黛玉：开始用家具：点心案 / default_use ×38
- 黛玉：行动入队：前往潇湘馆 ×33
- 黛玉：开始用家具：樟木案几 / default_use ×32
- 黛玉：行动入队：🛏️ 在雕花木床 ×31
- 宝玉：行动入队：📋 在樟木案几 ×29
- 宝玉：开始用家具：樟木案几 / default_use ×29
- 黛玉：完成用家具：樟木案几 / default_use ×28

## 每人每日汇总

| 天 | 人物 | 总事件 | AI选择 | 家具事件 | 互动事件 | 任务事件 | 失败/受阻 | 当日样例 |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 黛玉 | 226 | 63 | 44 | 20 | 18 | 0 |  08:01 作息完成：晨起梳洗 via=bath； 08:01 开始用家具：浴盆 / default_use； 08:04 完成用家具：浴盆 / default_use； 08:15 行动入队：🎵 抚琴自娱； 08:15 AI选择：琴台·抚琴自娱 [furn:1006:play_music] provider=furniture routine=breakfast |
| 1 | 宝玉 | 213 | 50 | 25 | 46 | 14 | 1 |  08:38 作息完成：早餐 via=meal； 08:38 开始用家具：饭桌 / complain_food； 08:40 完成用家具：饭桌 / complain_food； 08:43 被袭人发起互动：「问安」； 08:50 被袭人完成互动：「问安」 |
| 2 | 黛玉 | 490 | 169 | 72 | 34 | 28 | 1 |  00:00 行动入队：🛏️ 在雕花木床； 00:00 AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep； 00:15 行动入队：📋 在樟木案几； 00:15 AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep； 00:16 开始用家具：樟木案几 / default_use |
| 2 | 宝玉 | 476 | 93 | 32 | 143 | 31 | 4 |  00:00 行动入队：📋 在樟木案几； 00:00 AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep； 00:02 开始用家具：樟木案几 / default_use； 00:03 开始任务：罚抄《四书》； 00:03 完成用家具：樟木案几 / default_use |
| 3 | 黛玉 | 552 | 206 | 66 | 30 | 25 | 3 |  00:00 行动入队：🛏️ 在雕花木床； 00:00 AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture routine=night_sleep； 00:15 行动入队：📋 在樟木案几； 00:15 AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep； 00:16 行动入队：🥟 在点心案 |
| 3 | 宝玉 | 506 | 78 | 16 | 208 | 22 | 4 |  00:00 行动入队：💬 辩理·莺儿； 00:00 AI选择：辩理·莺儿 [int:201:yinger] provider=social routine=night_sleep； 00:01 AI每日主动社交计数：莺儿 1/10； 00:01 开始互动：与莺儿「辩理」； 00:08 AI目标频控：莺儿 75分钟 |

## 最终状态

| 人物 | 场景 | AI | 状态 | 队列 | 饥 | 洁 | 倦 | 交游 | 心绪 |
|---|---:|---|---|---|---:|---:|---:|---:|---:|
| 宝玉 | 2 | PAUSED | 与贾母·倾听 | 🛏️ 在雕花木床 | 76 | 99 | 98 | 100 | 100 |
| 黛玉 | 1 | EXECUTING | 去找紫鹃·联句 | 💬 联句·紫鹃 | 26 | 89 | 83 | 100 | 82 |

## 按时间顺序详细日志

| 时间 | 人物 | 动作 | 下发者 | 事件 |
|---|---|---|---|---|
| 第01日 08:01 | 黛玉 | 作息完成：晨起梳洗 via=bath |  | ai:routine_completed |
| 第01日 08:01 | 黛玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 08:04 | 黛玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 08:15 | 黛玉 | 行动入队：🎵 抚琴自娱 |  | queue:add |
| 第01日 08:15 | 黛玉 | AI选择：琴台·抚琴自娱 [furn:1006:play_music] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 08:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:17 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 08:23 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 08:30 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 08:30 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 08:32 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第01日 08:38 | 宝玉 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第01日 08:38 | 宝玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 08:38 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第01日 08:40 | 宝玉 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 08:43 | 宝玉 | 被袭人发起互动：「问安」 |  | interaction:started |
| 第01日 08:44 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第01日 08:46 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第01日 08:50 | 宝玉 | 被袭人完成互动：「问安」 |  | interaction:complete |
| 第01日 08:57 | 宝玉 | 被麝月发起互动：「问安」 |  | interaction:started |
| 第01日 09:00 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第01日 09:00 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social routine=morning_focus |  | ai:decision |
| 第01日 09:03 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第01日 09:03 | 黛玉 | 作息完成：上午作息 via=lundao |  | ai:routine_completed |
| 第01日 09:03 | 黛玉 | 开始互动：与雪雁「联句」 |  | interaction:started |
| 第01日 09:04 | 宝玉 | 被麝月完成互动：「问安」 |  | interaction:complete |
| 第01日 09:10 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 09:10 | 黛玉 | 完成互动：与雪雁「联句」 |  | interaction:complete |
| 第01日 09:15 | 宝玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 09:15 | 宝玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture routine=morning_focus |  | ai:decision |
| 第01日 09:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 09:15 | 黛玉 | AI选择：居家闲步 [w:home:12,34] provider=homeward routine=breakfast |  | ai:decision |
| 第01日 09:16 | 宝玉 | 行动入队：💬 辩理·黛玉 |  | queue:add |
| 第01日 09:16 | 宝玉 | AI选择：辩理·黛玉 [int:201:daiyu] provider=social routine=morning_focus |  | ai:decision |
| 第01日 09:16 | 黛玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 09:16 | 黛玉 | AI选择：竹榻·使用竹榻 [furn:1009:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第01日 09:19 | 黛玉 | 开始用家具：竹榻 / default_use |  | furniture:use_started |
| 第01日 09:22 | 黛玉 | 完成用家具：竹榻 / default_use |  | furniture:complete |
| 第01日 09:30 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第01日 09:30 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第01日 09:31 | 黛玉 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第01日 09:31 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第01日 09:38 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第01日 09:38 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第01日 09:45 | 黛玉 | 行动入队：🤝 对弈·珍大爷 |  | queue:add |
| 第01日 09:45 | 黛玉 | AI选择：对弈·珍大爷 [int:202:jiazhen] provider=social |  | ai:decision |
| 第01日 09:47 | 黛玉 | 行动入队：💬 辩理·宝玉 |  | queue:add |
| 第01日 09:47 | 黛玉 | AI选择：辩理·宝玉 [int:201:baoyu] provider=social |  | ai:decision |
| 第01日 09:51 | 宝玉 | 行动入队：🤝 品茗·贾母 |  | queue:add |
| 第01日 09:51 | 宝玉 | AI选择：品茗·贾母 [int:104:jiamu] provider=social routine=morning_focus |  | ai:decision |
| 第01日 09:53 | 黛玉 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第01日 09:53 | 黛玉 | 开始互动：与宝玉「辩理」 |  | interaction:started |
| 第01日 09:53 | 宝玉 | 被黛玉发起互动：「辩理」 |  | interaction:started |
| 第01日 10:01 | 黛玉 | AI目标频控：宝玉 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 10:01 | 黛玉 | 完成互动：与宝玉「辩理」 |  | interaction:complete |
| 第01日 10:01 | 宝玉 | 被黛玉完成互动：「辩理」 |  | interaction:complete |
| 第01日 10:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 10:15 | 黛玉 | AI选择：居家闲步 [w:home:10,32] provider=homeward |  | ai:decision |
| 第01日 10:20 | 黛玉 | 行动入队：🤝 对弈·王夫人 |  | queue:add |
| 第01日 10:20 | 黛玉 | AI选择：对弈·王夫人 [int:202:wangfuren] provider=social |  | ai:decision |
| 第01日 10:46 | 黛玉 | AI每日主动社交计数：王夫人 1/10 |  | ai:daily_social_count |
| 第01日 10:46 | 黛玉 | 开始互动：与王夫人「对弈」 |  | interaction:started |
| 第01日 11:04 | 黛玉 | AI目标频控：王夫人 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 11:04 | 黛玉 | 完成互动：与王夫人「对弈」 |  | interaction:complete |
| 第01日 11:08 | 宝玉 | AI每日主动社交计数：贾母 1/10 |  | ai:daily_social_count |
| 第01日 11:08 | 宝玉 | 作息完成：上午作息 via=xujiu |  | ai:routine_completed |
| 第01日 11:08 | 宝玉 | 开始互动：与贾母「品茗」 |  | interaction:started |
| 第01日 11:15 | 黛玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第01日 11:15 | 黛玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social routine=lunch |  | ai:decision |
| 第01日 11:20 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 11:20 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture routine=lunch |  | ai:decision |
| 第01日 11:21 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 11:21 | 宝玉 | 完成互动：与贾母「品茗」 |  | interaction:complete |
| 第01日 11:28 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 11:28 | 黛玉 | AI选择：居家闲步 [w:home:14,29] provider=homeward routine=lunch |  | ai:decision |
| 第01日 11:30 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第01日 11:30 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第01日 11:33 | 宝玉 | 作息完成：午餐 via=kitchen |  | ai:routine_completed |
| 第01日 11:33 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第01日 11:37 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第01日 11:39 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第01日 11:39 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture routine=lunch |  | ai:decision |
| 第01日 11:45 | 宝玉 | 行动入队：🤝 品茗·宝钗 |  | queue:add |
| 第01日 11:45 | 宝玉 | AI选择：品茗·宝钗 [int:104:baochai] provider=social |  | ai:decision |
| 第01日 11:49 | 宝玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第01日 11:49 | 宝玉 | 开始互动：与宝钗「品茗」 |  | interaction:started |
| 第01日 11:49 | 黛玉 | 被袭人发起互动：「对酌」 |  | interaction:started |
| 第01日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第01日 12:02 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第01日 12:02 | 宝玉 | 完成互动：与宝钗「品茗」 |  | interaction:complete |
| 第01日 12:04 | 宝玉 | 被刘姥姥发起互动：「寒暄」 |  | interaction:started |
| 第01日 12:08 | 黛玉 | 被袭人完成互动：「对酌」 |  | interaction:complete |
| 第01日 12:10 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第01日 12:11 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第01日 12:11 | 宝玉 | 被刘姥姥完成互动：「寒暄」 |  | interaction:complete |
| 第01日 12:15 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第01日 12:15 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social |  | ai:decision |
| 第01日 12:15 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第01日 12:15 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=lunch |  | ai:decision |
| 第01日 12:16 | 黛玉 | 作息完成：午餐 via=meal |  | ai:routine_completed |
| 第01日 12:16 | 黛玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第01日 12:19 | 黛玉 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第01日 12:30 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第01日 12:30 | 宝玉 | AI选择：逛园 [w:pub:2,8] provider=homeward |  | ai:decision |
| 第01日 12:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 12:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第01日 12:32 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 12:32 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 12:33 | 黛玉 | 行动入队：💬 评文·凤姐 |  | queue:add |
| 第01日 12:33 | 黛玉 | AI选择：评文·凤姐 [int:203:xifeng] provider=social |  | ai:decision |
| 第01日 12:40 | 黛玉 | 行动入队：💬 联句·宝玉 |  | queue:add |
| 第01日 12:40 | 黛玉 | AI选择：联句·宝玉 [int:204:baoyu] provider=social |  | ai:decision |
| 第01日 12:45 | 宝玉 | 行动入队：前往蘅芜苑 |  | queue:add |
| 第01日 12:45 | 宝玉 | AI选择：闲游 [w:7,4] provider=wander |  | ai:decision |
| 第01日 13:00 | 黛玉 | 下发任务给紫鹃：晨昏定省 | 黛玉 | quest:issued |
| 第01日 13:00 | 黛玉 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第01日 13:00 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第01日 13:00 | 宝玉 | AI每日主动社交计数：刘姥姥 1/10 |  | ai:daily_social_count |
| 第01日 13:00 | 宝玉 | 作息完成：下午作息 via=xujiu |  | ai:routine_completed |
| 第01日 13:00 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第01日 13:00 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social routine=afternoon_life |  | ai:decision |
| 第01日 13:01 | 宝玉 | AI选择：逛园 [w:pub:15,17] provider=homeward |  | ai:decision |
| 第01日 13:02 | 宝玉 | 被大老爷发起互动：「问安」 |  | interaction:started |
| 第01日 13:09 | 宝玉 | 被大老爷完成互动：「问安」 |  | interaction:complete |
| 第01日 13:12 | 黛玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第01日 13:12 | 黛玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social routine=afternoon_life |  | ai:decision |
| 第01日 13:15 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第01日 13:15 | 宝玉 | AI每日主动社交计数：刘姥姥 2/10 |  | ai:daily_social_count |
| 第01日 13:15 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第01日 13:15 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第01日 13:18 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第01日 13:18 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第01日 13:27 | 宝玉 | AI每日主动社交计数：宝钗 2/10 |  | ai:daily_social_count |
| 第01日 13:27 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第01日 13:35 | 宝玉 | 被刘姥姥发起互动：「闲谈」 |  | interaction:started |
| 第01日 13:37 | 宝玉 | 被贾母发起互动：「揭短」 |  | interaction:started |
| 第01日 13:43 | 宝玉 | 被刘姥姥完成互动：「闲谈」 |  | interaction:complete |
| 第01日 13:44 | 宝玉 | 被贾母完成互动：「揭短」 |  | interaction:complete |
| 第01日 13:46 | 宝玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第01日 13:46 | 宝玉 | 完成互动：与宝钗「对酌」 |  | interaction:complete |
| 第01日 14:00 | 黛玉 | 下发任务给紫鹃：陪黛玉读书 | 黛玉 | quest:issued |
| 第01日 14:00 | 黛玉 | 接受任务：陪黛玉读书 | 黛玉 | quest:accepted |
| 第01日 14:00 | 宝玉 | 下发任务给麝月：晨昏定省 | 宝玉 | quest:issued |
| 第01日 14:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 14:00 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第01日 14:00 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第01日 14:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 14:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第01日 14:01 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第01日 14:01 | 宝玉 | AI选择：逛园 [w:pub:25,20] provider=homeward |  | ai:decision |
| 第01日 14:01 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 14:01 | 黛玉 | AI选择：居家闲步 [w:home:10,32] provider=homeward routine=afternoon_life |  | ai:decision |
| 第01日 14:45 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第01日 14:45 | 宝玉 | AI选择：逛园 [w:pub:17,13] provider=homeward |  | ai:decision |
| 第01日 14:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 14:46 | 黛玉 | AI选择：居家闲步 [w:home:14,34] provider=homeward routine=afternoon_life |  | ai:decision |
| 第01日 14:52 | 黛玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第01日 14:52 | 黛玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social routine=afternoon_life |  | ai:decision |
| 第01日 15:00 | 宝玉 | 下发任务给袭人：代掌怡红院 | 宝玉 | quest:issued |
| 第01日 15:00 | 宝玉 | 接受任务：代掌怡红院 | 宝玉 | quest:accepted |
| 第01日 15:15 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第01日 15:15 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第01日 15:20 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第01日 15:20 | 宝玉 | AI选择：逛园 [w:pub:15,20] provider=homeward |  | ai:decision |
| 第01日 15:42 | 黛玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第01日 15:42 | 黛玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social routine=afternoon_life |  | ai:decision |
| 第01日 15:45 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第01日 15:45 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第01日 15:46 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第01日 15:46 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第01日 16:00 | 宝玉 | 下发任务给晴雯：晨昏定省 | 宝玉 | quest:issued |
| 第01日 16:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第01日 16:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 16:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第01日 16:06 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 16:06 | 黛玉 | AI选择：居家闲步 [w:home:14,29] provider=homeward routine=afternoon_life |  | ai:decision |
| 第01日 16:12 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 16:12 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第01日 16:33 | 黛玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第01日 16:33 | 黛玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social routine=afternoon_life |  | ai:decision |
| 第01日 16:43 | 宝玉 | AI每日主动社交计数：宝钗 3/10 |  | ai:daily_social_count |
| 第01日 16:43 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第01日 16:46 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第01日 16:46 | 宝玉 | AI每日主动社交计数：宝钗 4/10 |  | ai:daily_social_count |
| 第01日 16:46 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第01日 16:46 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第01日 16:47 | 宝玉 | 被凤姐发起互动：「寒暄」 |  | interaction:started |
| 第01日 16:53 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 16:53 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第01日 16:55 | 宝玉 | 被凤姐完成互动：「寒暄」 |  | interaction:complete |
| 第01日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第01日 17:04 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第01日 17:04 | 宝玉 | 完成互动：与宝钗「对酌」 |  | interaction:complete |
| 第01日 17:15 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第01日 17:15 | 宝玉 | AI每日主动社交计数：刘姥姥 3/10 |  | ai:daily_social_count |
| 第01日 17:15 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第01日 17:15 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social routine=dinner |  | ai:decision |
| 第01日 17:16 | 宝玉 | AI选择：逛园 [w:pub:9,8] provider=homeward routine=dinner |  | ai:decision |
| 第01日 17:30 | 宝玉 | 行动入队：🧼 在铜面盆 |  | queue:add |
| 第01日 17:30 | 宝玉 | AI选择：铜面盆·使用铜面盆 [furn:2008:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第01日 17:31 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第01日 17:31 | 宝玉 | 作息完成：晚餐 via=kitchen |  | ai:routine_completed |
| 第01日 17:31 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第01日 17:31 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第01日 17:31 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第01日 17:32 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第01日 17:38 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 17:38 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第01日 17:38 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第01日 17:45 | 宝玉 | 行动入队：👘 在梳洗妆台 |  | queue:add |
| 第01日 17:45 | 宝玉 | AI选择：梳洗妆台·使用梳洗妆台 [furn:2007:default_use] provider=furniture |  | ai:decision |
| 第01日 17:46 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第01日 17:46 | 宝玉 | AI选择：逛园 [w:pub:22,15] provider=homeward |  | ai:decision |
| 第01日 17:59 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第01日 18:08 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第01日 18:11 | 黛玉 | 被紫鹃发起互动：「闲谈」 |  | interaction:started |
| 第01日 18:12 | 黛玉 | 开始任务：晨昏定省 | 黛玉 | quest:started |
| 第01日 18:12 | 黛玉 | 开始任务：陪黛玉读书 | 黛玉 | quest:started |
| 第01日 18:14 | 黛玉 | 被雪雁发起互动：「品茗」 |  | interaction:started |
| 第01日 18:17 | 黛玉 | 完成任务：陪黛玉读书 | 黛玉 | quest:completed |
| 第01日 18:19 | 黛玉 | 完成任务：晨昏定省 | 黛玉 | quest:completed |
| 第01日 18:19 | 黛玉 | 被紫鹃完成互动：「闲谈」 |  | interaction:complete |
| 第01日 18:27 | 黛玉 | 被雪雁完成互动：「品茗」 |  | interaction:complete |
| 第01日 18:30 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第01日 18:30 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第01日 18:30 | 黛玉 | 行动入队：🍚 独自用膳 |  | queue:add |
| 第01日 18:30 | 黛玉 | AI选择：饭桌·独自用膳 [furn:1007:eat_alone] provider=furniture routine=dinner |  | ai:decision |
| 第01日 18:41 | 黛玉 | 作息完成：晚餐 via=meal |  | ai:routine_completed |
| 第01日 18:41 | 黛玉 | 开始用家具：饭桌 / eat_alone |  | furniture:use_started |
| 第01日 18:42 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第01日 18:42 | 宝玉 | AI选择：逛园 [w:pub:6,8] provider=homeward |  | ai:decision |
| 第01日 18:45 | 黛玉 | 完成用家具：饭桌 / eat_alone |  | furniture:complete |
| 第01日 19:00 | 黛玉 | 任务下发：罚抄《四书》 | 政老爷 | quest:issued |
| 第01日 19:00 | 黛玉 | 接受任务：罚抄《四书》 | 政老爷 | quest:accepted |
| 第01日 19:00 | 黛玉 | 行动入队：💬 评文·雪雁 |  | queue:add |
| 第01日 19:00 | 黛玉 | AI选择：评文·雪雁 [int:203:xueyan] provider=social routine=evening_social |  | ai:decision |
| 第01日 19:07 | 宝玉 | 被政老爷发起互动：「倾听」 |  | interaction:started |
| 第01日 19:11 | 黛玉 | AI每日主动社交计数：雪雁 2/10 |  | ai:daily_social_count |
| 第01日 19:11 | 黛玉 | 作息完成：晚间作息 via=lundao |  | ai:routine_completed |
| 第01日 19:11 | 黛玉 | 开始互动：与雪雁「评文」 |  | interaction:started |
| 第01日 19:14 | 宝玉 | 被政老爷完成互动：「倾听」 |  | interaction:complete |
| 第01日 19:15 | 宝玉 | 行动入队：🤝 对酌·刘姥姥 |  | queue:add |
| 第01日 19:15 | 宝玉 | AI选择：对酌·刘姥姥 [int:105:liulaolao] provider=social routine=evening_social |  | ai:decision |
| 第01日 19:19 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 19:19 | 黛玉 | 完成互动：与雪雁「评文」 |  | interaction:complete |
| 第01日 19:30 | 宝玉 | 行动入队：💬 闲谈·刘姥姥 |  | queue:add |
| 第01日 19:30 | 宝玉 | AI每日主动社交计数：刘姥姥 4/10 |  | ai:daily_social_count |
| 第01日 19:30 | 宝玉 | 作息完成：晚间作息 via=xujiu |  | ai:routine_completed |
| 第01日 19:30 | 宝玉 | 开始互动：与刘姥姥「闲谈」 |  | interaction:started |
| 第01日 19:30 | 宝玉 | AI选择：闲谈·刘姥姥 [int:102:liulaolao] provider=social routine=evening_social |  | ai:decision |
| 第01日 19:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 19:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 19:31 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 19:32 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 19:33 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 19:37 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第01日 19:37 | 宝玉 | 完成互动：与刘姥姥「闲谈」 |  | interaction:complete |
| 第01日 19:39 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第01日 19:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 19:45 | 黛玉 | AI选择：居家闲步 [w:home:10,28] provider=homeward |  | ai:decision |
| 第01日 19:46 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第01日 20:00 | 宝玉 | 下发任务给袭人：伺候就寝 | 宝玉 | quest:issued |
| 第01日 20:00 | 宝玉 | 接受任务：伺候就寝 | 宝玉 | quest:accepted |
| 第01日 20:00 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第01日 20:00 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第01日 20:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 20:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第01日 20:01 | 黛玉 | 行动入队：前往南游廊 |  | queue:add |
| 第01日 20:01 | 黛玉 | AI选择：闲游 [w:5,25] provider=wander |  | ai:decision |
| 第01日 20:02 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 20:02 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 20:02 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第01日 20:03 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 20:05 | 宝玉 | AI每日主动社交计数：大老爷 1/10 |  | ai:daily_social_count |
| 第01日 20:05 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第01日 20:07 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第01日 20:13 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:13 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第01日 20:15 | 宝玉 | 行动入队：🤝 品茗·麝月 |  | queue:add |
| 第01日 20:15 | 宝玉 | AI选择：品茗·麝月 [int:104:sheyue] provider=social |  | ai:decision |
| 第01日 20:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 20:15 | 黛玉 | AI选择：居家闲步 [w:home:6,34] provider=homeward |  | ai:decision |
| 第01日 20:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 20:16 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 20:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 20:17 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 20:17 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 20:20 | 宝玉 | AI每日主动社交计数：麝月 1/10 |  | ai:daily_social_count |
| 第01日 20:20 | 宝玉 | 开始互动：与麝月「品茗」 |  | interaction:started |
| 第01日 20:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第01日 20:30 | 黛玉 | AI选择：居家闲步 [w:home:8,30] provider=homeward |  | ai:decision |
| 第01日 20:33 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第01日 20:33 | 宝玉 | AI目标频控：麝月 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:33 | 宝玉 | 完成互动：与麝月「品茗」 |  | interaction:complete |
| 第01日 20:34 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第01日 20:34 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social |  | ai:decision |
| 第01日 20:35 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第01日 20:35 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第01日 20:38 | 黛玉 | AI每日主动社交计数：雪雁 3/10 |  | ai:daily_social_count |
| 第01日 20:38 | 黛玉 | 开始互动：与雪雁「联句」 |  | interaction:started |
| 第01日 20:45 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第01日 20:45 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第01日 20:45 | 宝玉 | AI每日主动社交计数：莺儿 1/10 |  | ai:daily_social_count |
| 第01日 20:45 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第01日 20:45 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:45 | 黛玉 | 完成互动：与雪雁「联句」 |  | interaction:complete |
| 第01日 20:52 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 20:52 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第01日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第01日 21:00 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 21:00 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第01日 21:00 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 21:00 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第01日 21:00 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 21:01 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 21:01 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 21:01 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 21:01 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 21:02 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 21:05 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 21:11 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 21:15 | 宝玉 | 行动入队：🛋️ 在竹榻 |  | queue:add |
| 第01日 21:15 | 宝玉 | AI选择：竹榻·使用竹榻 [furn:2009:default_use] provider=furniture |  | ai:decision |
| 第01日 21:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 21:15 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第01日 21:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第01日 21:15 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第01日 21:20 | 宝玉 | 开始用家具：竹榻 / default_use |  | furniture:use_started |
| 第01日 21:23 | 宝玉 | 完成用家具：竹榻 / default_use |  | furniture:complete |
| 第01日 21:30 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第01日 21:30 | 宝玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第01日 21:30 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 21:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第01日 21:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 21:34 | 宝玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第01日 21:43 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第01日 21:44 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第01日 21:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 21:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 21:45 | 黛玉 | 行动入队：💬 评文·贾母 |  | queue:add |
| 第01日 21:45 | 黛玉 | AI选择：评文·贾母 [int:203:jiamu] provider=social routine=night_sleep |  | ai:decision |
| 第01日 21:46 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 21:46 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 21:47 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 21:53 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 21:53 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 21:54 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 21:56 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:00 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:00 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 22:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:15 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:15 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:15 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:15 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:16 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:16 | 宝玉 | 任务下发：罚抄《四书》 | 政老爷 | quest:issued |
| 第01日 22:16 | 宝玉 | 接受任务：罚抄《四书》 | 政老爷 | quest:accepted |
| 第01日 22:17 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:17 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:17 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:17 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:20 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:30 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:30 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:30 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:30 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:30 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:30 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:31 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:31 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 22:31 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:31 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:31 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:31 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:31 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:31 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:31 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:32 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:32 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:32 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:34 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:34 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:34 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:35 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:35 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:35 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:36 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:36 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:36 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:39 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:39 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:39 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:44 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 22:45 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第01日 22:45 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social routine=night_sleep |  | ai:decision |
| 第01日 22:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 22:45 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 22:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 22:45 | 宝玉 | AI每日主动社交计数：大老爷 2/10 |  | ai:daily_social_count |
| 第01日 22:45 | 宝玉 | 开始互动：与大老爷「对弈」 |  | interaction:started |
| 第01日 22:45 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 23:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:00 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 23:01 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:01 | 宝玉 | 任务失败：伺候就寝，超时 | 宝玉 | quest:failed |
| 第01日 23:01 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 23:01 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 23:01 | 黛玉 | 作息完成：夜间睡眠 via=bed |  | ai:routine_completed |
| 第01日 23:01 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第01日 23:03 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第01日 23:03 | 宝玉 | 完成互动：与大老爷「对弈」 |  | interaction:complete |
| 第01日 23:15 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第01日 23:15 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social routine=night_sleep |  | ai:decision |
| 第01日 23:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第01日 23:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第01日 23:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:16 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 23:16 | 宝玉 | AI每日主动社交计数：莺儿 2/10 |  | ai:daily_social_count |
| 第01日 23:16 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第01日 23:16 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 23:30 | 黛玉 | 行动入队：💬 论禅·探春 |  | queue:add |
| 第01日 23:30 | 黛玉 | AI选择：论禅·探春 [int:205:tanchun] provider=social |  | ai:decision |
| 第01日 23:34 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第01日 23:34 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第01日 23:40 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第01日 23:40 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第01日 23:41 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第01日 23:42 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第01日 23:43 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第01日 23:45 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 23:45 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第01日 23:45 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第01日 23:45 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第01日 23:47 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第01日 23:47 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 00:00 | 全局 | 进入第2日 |  | time:day |
| 第02日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第02日 00:00 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:00 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 00:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:02 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:03 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 00:03 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:15 | 宝玉 | 行动入队：💬 联句·凤姐 |  | queue:add |
| 第02日 00:15 | 宝玉 | AI选择：联句·凤姐 [int:204:xifeng] provider=social routine=night_sleep |  | ai:decision |
| 第02日 00:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:15 | 宝玉 | AI每日主动社交计数：凤姐 1/10 |  | ai:daily_social_count |
| 第02日 00:15 | 宝玉 | 开始互动：与凤姐「联句」 |  | interaction:started |
| 第02日 00:16 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:17 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 00:17 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:22 | 宝玉 | AI目标频控：凤姐 75分钟 |  | ai:social_target_cooldown |
| 第02日 00:22 | 宝玉 | 完成互动：与凤姐「联句」 |  | interaction:complete |
| 第02日 00:30 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 00:30 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:30 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 00:30 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:31 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 00:32 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:32 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 00:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:33 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:34 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 00:34 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:45 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:45 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:45 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 00:46 | 宝玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 00:47 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:47 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:47 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:48 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:48 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:48 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:49 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:49 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:49 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:50 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:50 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:50 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:53 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 00:53 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 00:53 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 00:55 | 宝玉 | 完成任务：罚抄《四书》 | 政老爷 | quest:completed |
| 第02日 00:58 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:00 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:00 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:00 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 01:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:01 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:01 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:04 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:04 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:04 | 宝玉 | 作息完成：夜间睡眠 via=bed |  | ai:routine_completed |
| 第02日 01:04 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 01:15 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第02日 01:15 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第02日 01:15 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 01:15 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第02日 01:15 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:16 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 01:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 01:16 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 01:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:16 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 01:17 | 宝玉 | 行动入队：💬 辩理·莺儿 |  | queue:add |
| 第02日 01:17 | 宝玉 | AI每日主动社交计数：莺儿 1/10 |  | ai:daily_social_count |
| 第02日 01:17 | 宝玉 | 开始互动：与莺儿「辩理」 |  | interaction:started |
| 第02日 01:17 | 宝玉 | AI选择：辩理·莺儿 [int:201:yinger] provider=social |  | ai:decision |
| 第02日 01:23 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 01:23 | 宝玉 | 完成互动：与莺儿「辩理」 |  | interaction:complete |
| 第02日 01:30 | 宝玉 | 行动入队：💬 联句·政老爷 |  | queue:add |
| 第02日 01:30 | 宝玉 | AI每日主动社交计数：政老爷 1/10 |  | ai:daily_social_count |
| 第02日 01:30 | 宝玉 | 开始互动：与政老爷「联句」 |  | interaction:started |
| 第02日 01:30 | 宝玉 | AI选择：联句·政老爷 [int:204:jiazheng] provider=social |  | ai:decision |
| 第02日 01:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:37 | 宝玉 | AI目标频控：政老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 01:37 | 宝玉 | 完成互动：与政老爷「联句」 |  | interaction:complete |
| 第02日 01:45 | 宝玉 | 行动入队：💬 辩理·凤姐 |  | queue:add |
| 第02日 01:45 | 宝玉 | AI选择：辩理·凤姐 [int:201:xifeng] provider=social |  | ai:decision |
| 第02日 01:45 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 01:45 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第02日 01:45 | 黛玉 | 作息完成：夜间睡眠 via=bed |  | ai:routine_completed |
| 第02日 01:45 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 01:47 | 宝玉 | AI每日主动社交计数：凤姐 2/10 |  | ai:daily_social_count |
| 第02日 01:47 | 宝玉 | 开始互动：与凤姐「辩理」 |  | interaction:started |
| 第02日 01:55 | 宝玉 | AI目标频控：凤姐 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 01:55 | 宝玉 | 完成互动：与凤姐「辩理」 |  | interaction:complete |
| 第02日 02:00 | 宝玉 | 行动入队：💬 辩理·宝钗 |  | queue:add |
| 第02日 02:00 | 宝玉 | AI选择：辩理·宝钗 [int:201:baochai] provider=social |  | ai:decision |
| 第02日 02:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 02:00 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 02:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 02:01 | 宝玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第02日 02:01 | 宝玉 | 开始互动：与宝钗「辩理」 |  | interaction:started |
| 第02日 02:08 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 02:08 | 宝玉 | 完成互动：与宝钗「辩理」 |  | interaction:complete |
| 第02日 02:15 | 宝玉 | 行动入队：💬 评文·刘姥姥 |  | queue:add |
| 第02日 02:15 | 宝玉 | AI每日主动社交计数：刘姥姥 1/10 |  | ai:daily_social_count |
| 第02日 02:15 | 宝玉 | 开始互动：与刘姥姥「评文」 |  | interaction:started |
| 第02日 02:15 | 宝玉 | AI选择：评文·刘姥姥 [int:203:liulaolao] provider=social |  | ai:decision |
| 第02日 02:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 02:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 02:15 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第02日 02:16 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 02:16 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 02:17 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 02:18 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 02:20 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 02:21 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 02:21 | 宝玉 | 完成互动：与刘姥姥「评文」 |  | interaction:complete |
| 第02日 02:21 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第02日 02:30 | 宝玉 | 行动入队：💬 辩理·珍大爷 |  | queue:add |
| 第02日 02:30 | 宝玉 | AI每日主动社交计数：珍大爷 1/10 |  | ai:daily_social_count |
| 第02日 02:30 | 宝玉 | 开始互动：与珍大爷「辩理」 |  | interaction:started |
| 第02日 02:30 | 宝玉 | AI选择：辩理·珍大爷 [int:201:jiazhen] provider=social |  | ai:decision |
| 第02日 02:30 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 02:30 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 02:31 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 02:31 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 02:33 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 02:34 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 02:34 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 02:34 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第02日 02:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 02:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 02:34 | 宝玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 02:45 | 宝玉 | 行动入队：💬 辩理·莺儿 |  | queue:add |
| 第02日 02:45 | 宝玉 | AI选择：辩理·莺儿 [int:201:yinger] provider=social |  | ai:decision |
| 第02日 02:45 | 宝玉 | AI每日主动社交计数：莺儿 2/10 |  | ai:daily_social_count |
| 第02日 02:45 | 宝玉 | 开始互动：与莺儿「辩理」 |  | interaction:started |
| 第02日 02:49 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 02:50 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 02:52 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 02:52 | 宝玉 | 完成互动：与莺儿「辩理」 |  | interaction:complete |
| 第02日 03:00 | 宝玉 | 行动入队：💬 联句·政老爷 |  | queue:add |
| 第02日 03:00 | 宝玉 | AI选择：联句·政老爷 [int:204:jiazheng] provider=social |  | ai:decision |
| 第02日 03:00 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第02日 03:00 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第02日 03:02 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:02 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 03:04 | 宝玉 | AI每日主动社交计数：政老爷 2/10 |  | ai:daily_social_count |
| 第02日 03:04 | 宝玉 | 开始互动：与政老爷「联句」 |  | interaction:started |
| 第02日 03:09 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:10 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 03:11 | 宝玉 | AI目标频控：政老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 03:11 | 宝玉 | 完成互动：与政老爷「联句」 |  | interaction:complete |
| 第02日 03:11 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 03:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 03:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 03:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 03:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 03:16 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:16 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 03:16 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 03:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 03:17 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 03:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 03:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 03:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 03:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 03:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 03:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 03:22 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 03:23 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 03:30 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第02日 03:30 | 宝玉 | AI每日主动社交计数：宝钗 2/10 |  | ai:daily_social_count |
| 第02日 03:30 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第02日 03:30 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第02日 03:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 03:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 03:32 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第02日 03:37 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 03:37 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第02日 03:39 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第02日 03:45 | 宝玉 | 行动入队：💬 论禅·刘姥姥 |  | queue:add |
| 第02日 03:45 | 宝玉 | AI选择：论禅·刘姥姥 [int:205:liulaolao] provider=social |  | ai:decision |
| 第02日 03:45 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 03:45 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 03:47 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 03:47 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 03:55 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 03:56 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 03:57 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 04:00 | 宝玉 | 下发任务给袭人：晨起伺候 | 宝玉 | quest:issued |
| 第02日 04:00 | 宝玉 | 接受任务：晨起伺候 | 宝玉 | quest:accepted |
| 第02日 04:00 | 黛玉 | 下发任务给紫鹃：晨起伺候黛玉 | 黛玉 | quest:issued |
| 第02日 04:00 | 黛玉 | 接受任务：晨起伺候黛玉 | 黛玉 | quest:accepted |
| 第02日 04:00 | 黛玉 | 开始任务：晨起伺候黛玉 | 黛玉 | quest:started |
| 第02日 04:00 | 宝玉 | 行动入队：💬 论禅·刘姥姥 |  | queue:add |
| 第02日 04:00 | 宝玉 | AI选择：论禅·刘姥姥 [int:205:liulaolao] provider=social |  | ai:decision |
| 第02日 04:00 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第02日 04:00 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第02日 04:01 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:01 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 04:01 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 04:01 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第02日 04:02 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 04:08 | 黛玉 | 开始任务：晨起伺候黛玉 | 黛玉 | quest:started |
| 第02日 04:08 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第02日 04:09 | 黛玉 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第02日 04:09 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第02日 04:15 | 宝玉 | 行动入队：💬 辩理·莺儿 |  | queue:add |
| 第02日 04:15 | 宝玉 | AI选择：辩理·莺儿 [int:201:yinger] provider=social |  | ai:decision |
| 第02日 04:16 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第02日 04:16 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第02日 04:17 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 04:17 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第02日 04:30 | 宝玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第02日 04:30 | 宝玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第02日 04:30 | 黛玉 | 行动入队：🤝 对弈·宝玉 |  | queue:add |
| 第02日 04:30 | 黛玉 | AI选择：对弈·宝玉 [int:202:baoyu] provider=social |  | ai:decision |
| 第02日 04:32 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:32 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 04:32 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 04:32 | 宝玉 | AI每日主动社交计数：莺儿 3/10 |  | ai:daily_social_count |
| 第02日 04:32 | 宝玉 | 开始互动：与莺儿「评文」 |  | interaction:started |
| 第02日 04:32 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 04:34 | 黛玉 | 完成任务：晨起伺候黛玉 | 黛玉 | quest:completed |
| 第02日 04:39 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 04:39 | 宝玉 | 完成互动：与莺儿「评文」 |  | interaction:complete |
| 第02日 04:45 | 宝玉 | 行动入队：🤝 对弈·刘姥姥 |  | queue:add |
| 第02日 04:45 | 宝玉 | AI每日主动社交计数：刘姥姥 2/10 |  | ai:daily_social_count |
| 第02日 04:45 | 宝玉 | 开始互动：与刘姥姥「对弈」 |  | interaction:started |
| 第02日 04:45 | 宝玉 | AI选择：对弈·刘姥姥 [int:202:liulaolao] provider=social |  | ai:decision |
| 第02日 04:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 04:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 04:46 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:46 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 04:46 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 04:46 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第02日 04:46 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 04:47 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 04:50 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 04:50 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 04:51 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 04:52 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 04:52 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 05:00 | 宝玉 | 行动入队：🤝 品茗·宝钗 |  | queue:add |
| 第02日 05:00 | 宝玉 | AI选择：品茗·宝钗 [int:104:baochai] provider=social |  | ai:decision |
| 第02日 05:00 | 黛玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第02日 05:00 | 黛玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第02日 05:00 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第02日 05:01 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:01 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:01 | 宝玉 | AI每日主动社交计数：宝钗 3/10 |  | ai:daily_social_count |
| 第02日 05:01 | 宝玉 | 开始互动：与宝钗「品茗」 |  | interaction:started |
| 第02日 05:02 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:02 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:06 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:06 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:07 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第02日 05:10 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:10 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:11 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:11 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:13 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:14 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 05:14 | 宝玉 | 完成互动：与宝钗「品茗」 |  | interaction:complete |
| 第02日 05:14 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 05:15 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第02日 05:15 | 宝玉 | AI选择：闲游 [w:6,9] provider=wander |  | ai:decision |
| 第02日 05:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:15 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 05:15 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 05:20 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 05:20 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第02日 05:25 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 05:28 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 05:30 | 宝玉 | 行动入队：👘 在梳洗妆台 |  | queue:add |
| 第02日 05:30 | 宝玉 | AI选择：梳洗妆台·使用梳洗妆台 [furn:2007:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 05:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:30 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 05:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 05:31 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 05:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 05:31 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 05:34 | 宝玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第02日 05:34 | 宝玉 | 开始用家具：梳洗妆台 / default_use |  | furniture:use_started |
| 第02日 05:34 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第02日 05:35 | 宝玉 | 完成用家具：梳洗妆台 / default_use |  | furniture:complete |
| 第02日 05:38 | 黛玉 | 被雪雁发起互动：「嬉闹」 |  | interaction:started |
| 第02日 05:41 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第02日 05:45 | 宝玉 | 行动入队：🤝 对酌·大老爷 |  | queue:add |
| 第02日 05:45 | 宝玉 | AI选择：对酌·大老爷 [int:105:jiashe] provider=social |  | ai:decision |
| 第02日 05:53 | 黛玉 | 被雪雁完成互动：「嬉闹」 |  | interaction:complete |
| 第02日 06:00 | 宝玉 | 下发任务给麝月：随侍左右 | 宝玉 | quest:issued |
| 第02日 06:00 | 宝玉 | 接受任务：随侍左右 | 宝玉 | quest:accepted |
| 第02日 06:00 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第02日 06:00 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第02日 06:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 06:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 06:03 | 宝玉 | AI每日主动社交计数：莺儿 4/10 |  | ai:daily_social_count |
| 第02日 06:03 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第02日 06:09 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 06:10 | 黛玉 | 开始任务：罚抄《四书》 | 政老爷 | quest:started |
| 第02日 06:10 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 06:10 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第02日 06:12 | 黛玉 | 完成任务：罚抄《四书》 | 政老爷 | quest:completed |
| 第02日 06:15 | 宝玉 | 行动入队：前往蘅芜苑 |  | queue:add |
| 第02日 06:15 | 宝玉 | AI选择：闲游 [w:3,3] provider=wander |  | ai:decision |
| 第02日 06:15 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 06:17 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第02日 06:17 | 宝玉 | AI选择：逛园 [w:pub:17,13] provider=homeward |  | ai:decision |
| 第02日 06:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 06:30 | 黛玉 | AI选择：居家闲步 [w:home:6,30] provider=homeward routine=morning_hygiene |  | ai:decision |
| 第02日 06:42 | 宝玉 | 开始任务：晨起伺候 | 宝玉 | quest:started |
| 第02日 06:42 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第02日 06:42 | 宝玉 | AI选择：逛园 [w:pub:30,18] provider=homeward |  | ai:decision |
| 第02日 06:45 | 黛玉 | 行动入队：💬 评文·紫鹃 |  | queue:add |
| 第02日 06:45 | 黛玉 | AI选择：评文·紫鹃 [int:203:zijuan] provider=social routine=morning_hygiene |  | ai:decision |
| 第02日 06:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 06:47 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 06:55 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 06:56 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:56 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 06:57 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:57 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 06:58 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:58 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 06:58 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 06:59 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 06:59 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 06:59 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 06:59 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 07:00 | 黛玉 | 下发任务给雪雁：随侍黛玉 | 黛玉 | quest:issued |
| 第02日 07:00 | 黛玉 | 接受任务：随侍黛玉 | 黛玉 | quest:accepted |
| 第02日 07:00 | 宝玉 | 下发任务给麝月：洒扫庭院 | 宝玉 | quest:issued |
| 第02日 07:00 | 宝玉 | 接受任务：洒扫庭院 | 宝玉 | quest:accepted |
| 第02日 07:00 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 07:00 | 黛玉 | 作息完成：早餐 via=meal |  | ai:routine_completed |
| 第02日 07:00 | 黛玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第02日 07:00 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:01 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第02日 07:01 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social routine=morning_hygiene |  | ai:decision |
| 第02日 07:09 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:09 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:10 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:10 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:11 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:11 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:12 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:12 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:13 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:13 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:14 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:14 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:15 | 宝玉 | 行动入队：🤝 对酌·探春 |  | queue:add |
| 第02日 07:15 | 宝玉 | AI选择：对酌·探春 [int:105:tanchun] provider=social routine=breakfast |  | ai:decision |
| 第02日 07:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 07:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 07:15 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 07:16 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 07:18 | 宝玉 | 开始任务：随侍左右 | 宝玉 | quest:started |
| 第02日 07:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 07:30 | 黛玉 | AI选择：居家闲步 [w:home:9,32] provider=homeward routine=morning_hygiene |  | ai:decision |
| 第02日 07:38 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 07:40 | 宝玉 | AI每日主动社交计数：探春 1/10 |  | ai:daily_social_count |
| 第02日 07:40 | 宝玉 | 开始互动：与探春「对酌」 |  | interaction:started |
| 第02日 07:44 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 07:45 | 黛玉 | 行动入队：💬 联句·宝玉 |  | queue:add |
| 第02日 07:45 | 黛玉 | AI选择：联句·宝玉 [int:204:baoyu] provider=social routine=morning_hygiene |  | ai:decision |
| 第02日 07:54 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 07:59 | 宝玉 | AI目标频控：探春 75分钟 |  | ai:social_target_cooldown |
| 第02日 07:59 | 宝玉 | 完成互动：与探春「对酌」 |  | interaction:complete |
| 第02日 08:00 | 全局 | 时段切换：上午 |  | time:period |
| 第02日 08:00 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第02日 08:00 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social routine=breakfast |  | ai:decision |
| 第02日 08:01 | 宝玉 | 任务失败：晨起伺候，超时 | 宝玉 | quest:failed |
| 第02日 08:15 | 黛玉 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第02日 08:15 | 黛玉 | 开始互动：与宝玉「联句」 |  | interaction:started |
| 第02日 08:15 | 宝玉 | 被黛玉发起互动：「联句」 |  | interaction:started |
| 第02日 08:21 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第02日 08:22 | 黛玉 | AI目标频控：宝玉 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 08:22 | 黛玉 | 完成互动：与宝玉「联句」 |  | interaction:complete |
| 第02日 08:22 | 宝玉 | 被黛玉完成互动：「联句」 |  | interaction:complete |
| 第02日 08:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 08:30 | 黛玉 | AI选择：居家闲步 [w:home:3,29] provider=homeward routine=morning_hygiene |  | ai:decision |
| 第02日 08:50 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第02日 08:50 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social routine=breakfast |  | ai:decision |
| 第02日 08:53 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 08:53 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 08:53 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第02日 08:53 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 08:56 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 08:56 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第02日 08:57 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 09:01 | 宝玉 | 任务失败：晨昏定省，超时 | 宝玉 | quest:failed |
| 第02日 09:03 | 宝玉 | AI每日主动社交计数：莺儿 5/10 |  | ai:daily_social_count |
| 第02日 09:03 | 宝玉 | 作息完成：上午作息 via=xujiu |  | ai:routine_completed |
| 第02日 09:03 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第02日 09:04 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 09:05 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 09:05 | 黛玉 | 作息完成：上午作息 via=desk |  | ai:routine_completed |
| 第02日 09:05 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 09:05 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture routine=morning_focus |  | ai:decision |
| 第02日 09:09 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第02日 09:10 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 09:10 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第02日 09:15 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第02日 09:15 | 宝玉 | AI每日主动社交计数：大老爷 1/10 |  | ai:daily_social_count |
| 第02日 09:15 | 宝玉 | 开始互动：与大老爷「品茗」 |  | interaction:started |
| 第02日 09:15 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social routine=breakfast |  | ai:decision |
| 第02日 09:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 09:15 | 黛玉 | AI选择：居家闲步 [w:home:7,33] provider=homeward |  | ai:decision |
| 第02日 09:16 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 09:21 | 黛玉 | 行动入队：🤝 对弈·紫鹃 |  | queue:add |
| 第02日 09:21 | 黛玉 | AI选择：对弈·紫鹃 [int:202:zijuan] provider=social |  | ai:decision |
| 第02日 09:21 | 黛玉 | AI每日主动社交计数：紫鹃 2/10 |  | ai:daily_social_count |
| 第02日 09:21 | 黛玉 | 开始互动：与紫鹃「对弈」 |  | interaction:started |
| 第02日 09:26 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第02日 09:26 | 宝玉 | AI选择：逛园 [w:pub:15,17] provider=homeward routine=breakfast |  | ai:decision |
| 第02日 09:31 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第02日 09:39 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第02日 09:39 | 黛玉 | 完成互动：与紫鹃「对弈」 |  | interaction:complete |
| 第02日 09:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:48 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:48 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:50 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:50 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:51 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第02日 09:51 | 宝玉 | AI选择：逛园 [w:pub:15,19] provider=homeward |  | ai:decision |
| 第02日 09:51 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:51 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:52 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:52 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:53 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:53 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:54 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:54 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:55 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:55 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:56 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:56 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:57 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:57 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:57 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 09:58 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 09:58 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 09:58 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 09:58 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 10:00 | 黛玉 | 下发任务给紫鹃：作诗陪吟 | 黛玉 | quest:issued |
| 第02日 10:00 | 黛玉 | 接受任务：作诗陪吟 | 黛玉 | quest:accepted |
| 第02日 10:00 | 黛玉 | 行动入队：💬 评文·湘云 |  | queue:add |
| 第02日 10:00 | 黛玉 | AI选择：评文·湘云 [int:203:xiangyun] provider=social |  | ai:decision |
| 第02日 10:09 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 10:09 | 黛玉 | 行动入队：💬 辩理·雪雁 |  | queue:add |
| 第02日 10:09 | 黛玉 | AI选择：辩理·雪雁 [int:201:xueyan] provider=social |  | ai:decision |
| 第02日 10:09 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第02日 10:09 | 黛玉 | 开始互动：与雪雁「辩理」 |  | interaction:started |
| 第02日 10:16 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第02日 10:16 | 黛玉 | 完成互动：与雪雁「辩理」 |  | interaction:complete |
| 第02日 10:17 | 黛玉 | 被雪雁发起互动：「调侃」 |  | interaction:started |
| 第02日 10:25 | 黛玉 | 被雪雁完成互动：「调侃」 |  | interaction:complete |
| 第02日 10:29 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第02日 10:30 | 宝玉 | 行动入队：🤝 品茗·大老爷 |  | queue:add |
| 第02日 10:30 | 宝玉 | AI选择：品茗·大老爷 [int:104:jiashe] provider=social |  | ai:decision |
| 第02日 10:30 | 黛玉 | 行动入队：🤝 对弈·探春 |  | queue:add |
| 第02日 10:30 | 黛玉 | AI选择：对弈·探春 [int:202:tanchun] provider=social |  | ai:decision |
| 第02日 10:36 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 10:36 | 宝玉 | AI选择：闲游 [w:15,24] provider=wander |  | ai:decision |
| 第02日 10:38 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 10:38 | 宝玉 | AI选择：逛园 [w:pub:8,24] provider=homeward |  | ai:decision |
| 第02日 10:46 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第02日 11:00 | 宝玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 11:00 | 宝玉 | AI选择：饭桌·挑食抱怨 [furn:2005:complain_food] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:02 | 黛玉 | 被袭人发起互动：「倾听」 |  | interaction:started |
| 第02日 11:03 | 宝玉 | 行动入队：前往大观楼·沁芳庭 |  | queue:add |
| 第02日 11:03 | 宝玉 | AI选择：逛园 [w:pub:31,12] provider=homeward routine=lunch |  | ai:decision |
| 第02日 11:09 | 黛玉 | 被袭人完成互动：「倾听」 |  | interaction:complete |
| 第02日 11:11 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第02日 11:11 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social routine=lunch |  | ai:decision |
| 第02日 11:18 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第02日 11:32 | 宝玉 | 开始任务：洒扫庭院 | 宝玉 | quest:started |
| 第02日 11:34 | 宝玉 | 完成任务：洒扫庭院 | 宝玉 | quest:completed |
| 第02日 11:45 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:45 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:47 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:47 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:48 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:48 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:49 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:49 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:50 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:50 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:52 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:52 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:53 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:53 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:55 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:55 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:56 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:56 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:57 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 11:57 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 11:58 | 黛玉 | 作息完成：午餐 via=kitchen |  | ai:routine_completed |
| 第02日 11:58 | 黛玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 11:59 | 黛玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第02日 12:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 12:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 12:01 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 12:01 | 黛玉 | AI选择：居家闲步 [w:home:12,28] provider=homeward |  | ai:decision |
| 第02日 12:02 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第02日 12:02 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social routine=lunch |  | ai:decision |
| 第02日 12:03 | 黛玉 | 被贾母发起互动：「揭短」 |  | interaction:started |
| 第02日 12:10 | 黛玉 | 被贾母完成互动：「揭短」 |  | interaction:complete |
| 第02日 12:14 | 宝玉 | AI每日主动社交计数：莺儿 6/10 |  | ai:daily_social_count |
| 第02日 12:14 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第02日 12:21 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 12:21 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第02日 12:30 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第02日 12:30 | 宝玉 | AI每日主动社交计数：大老爷 2/10 |  | ai:daily_social_count |
| 第02日 12:30 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第02日 12:30 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social routine=lunch |  | ai:decision |
| 第02日 12:32 | 宝玉 | AI选择：逛园 [w:pub:22,8] provider=homeward routine=lunch |  | ai:decision |
| 第02日 12:45 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 12:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 12:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 12:45 | 宝玉 | 行动入队：🍵 煮水候茶 |  | queue:add |
| 第02日 12:45 | 宝玉 | AI选择：茶案·煮水候茶 [furn:2003:wait_tea] provider=furniture routine=lunch |  | ai:decision |
| 第02日 12:45 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第02日 12:46 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 12:46 | 宝玉 | 作息完成：午餐 via=kitchen |  | ai:routine_completed |
| 第02日 12:46 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 12:46 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第02日 12:47 | 宝玉 | 行动入队：前往北游廊 |  | queue:add |
| 第02日 12:47 | 宝玉 | AI选择：闲游 [w:2,9] provider=wander |  | ai:decision |
| 第02日 12:51 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第02日 12:57 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 12:57 | 宝玉 | AI选择：逛园 [w:pub:14,24] provider=homeward |  | ai:decision |
| 第02日 13:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 13:00 | 黛玉 | AI选择：居家闲步 [w:home:13,28] provider=homeward routine=afternoon_life |  | ai:decision |
| 第02日 13:20 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第02日 13:20 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social routine=afternoon_life |  | ai:decision |
| 第02日 13:21 | 宝玉 | 被贾母发起互动：「嬉闹」 |  | interaction:started |
| 第02日 13:23 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 13:24 | 黛玉 | 开始任务：作诗陪吟 | 黛玉 | quest:started |
| 第02日 13:31 | 黛玉 | 完成任务：作诗陪吟 | 黛玉 | quest:completed |
| 第02日 13:31 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 13:37 | 宝玉 | 被贾母完成互动：「嬉闹」 |  | interaction:complete |
| 第02日 13:39 | 宝玉 | 行动入队：前往东航廊 |  | queue:add |
| 第02日 13:39 | 宝玉 | AI选择：逛园 [w:pub:41,22] provider=homeward routine=afternoon_life |  | ai:decision |
| 第02日 13:45 | 黛玉 | 行动入队：💬 论禅·贾母 |  | queue:add |
| 第02日 13:45 | 黛玉 | AI选择：论禅·贾母 [int:205:jiamu] provider=social routine=afternoon_life |  | ai:decision |
| 第02日 13:47 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 13:47 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第02日 13:47 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 13:50 | 宝玉 | 行动入队：💬 寒暄·贾母 |  | queue:add |
| 第02日 13:50 | 宝玉 | AI选择：寒暄·贾母 [int:101:jiamu] provider=social routine=afternoon_life |  | ai:decision |
| 第02日 13:53 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 14:00 | 宝玉 | 下发任务给晴雯：传话 | 宝玉 | quest:issued |
| 第02日 14:00 | 宝玉 | 接受任务：传话 | 宝玉 | quest:accepted |
| 第02日 14:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 14:00 | 黛玉 | AI选择：居家闲步 [w:home:12,34] provider=homeward routine=afternoon_life |  | ai:decision |
| 第02日 14:15 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第02日 14:15 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social routine=afternoon_life |  | ai:decision |
| 第02日 14:19 | 宝玉 | AI每日主动社交计数：贾母 1/10 |  | ai:daily_social_count |
| 第02日 14:19 | 宝玉 | 作息完成：下午作息 via=xujiu |  | ai:routine_completed |
| 第02日 14:19 | 宝玉 | 开始互动：与贾母「寒暄」 |  | interaction:started |
| 第02日 14:26 | 宝玉 | AI目标频控：贾母 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 14:26 | 宝玉 | 完成互动：与贾母「寒暄」 |  | interaction:complete |
| 第02日 14:30 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第02日 14:30 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第02日 14:33 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 14:33 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第02日 14:39 | 宝玉 | AI每日主动社交计数：莺儿 7/10 |  | ai:daily_social_count |
| 第02日 14:39 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第02日 14:39 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 14:45 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 14:52 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 14:52 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第02日 14:56 | 宝玉 | 被晴雯发起互动：「品茗」 |  | interaction:started |
| 第02日 14:57 | 宝玉 | 开始任务：传话 | 宝玉 | quest:started |
| 第02日 15:00 | 宝玉 | 任务下发：作诗陪吟 | 王夫人 | quest:issued |
| 第02日 15:00 | 宝玉 | 接受任务：作诗陪吟 | 王夫人 | quest:accepted |
| 第02日 15:00 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 15:00 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 15:01 | 黛玉 | 被紫鹃发起互动：「对酌」 |  | interaction:started |
| 第02日 15:08 | 黛玉 | 被雪雁发起互动：「打趣」 |  | interaction:started |
| 第02日 15:09 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第02日 15:09 | 宝玉 | 完成任务：传话 | 宝玉 | quest:completed |
| 第02日 15:09 | 宝玉 | 被晴雯完成互动：「品茗」 |  | interaction:complete |
| 第02日 15:15 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第02日 15:15 | 宝玉 | AI每日主动社交计数：大老爷 3/10 |  | ai:daily_social_count |
| 第02日 15:15 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第02日 15:15 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第02日 15:15 | 宝玉 | 被贾母发起互动：「揭短」 |  | interaction:started |
| 第02日 15:15 | 宝玉 | 被宝钗发起互动：「调侃」 |  | interaction:started |
| 第02日 15:15 | 黛玉 | 被雪雁完成互动：「打趣」 |  | interaction:complete |
| 第02日 15:20 | 黛玉 | 被紫鹃完成互动：「对酌」 |  | interaction:complete |
| 第02日 15:21 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 15:21 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第02日 15:21 | 宝玉 | 被贾母完成互动：「揭短」 |  | interaction:complete |
| 第02日 15:22 | 宝玉 | 被宝钗完成互动：「调侃」 |  | interaction:complete |
| 第02日 15:28 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 15:29 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 15:30 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第02日 15:30 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第02日 15:30 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 15:30 | 黛玉 | AI选择：居家闲步 [w:home:4,34] provider=homeward routine=afternoon_life |  | ai:decision |
| 第02日 15:31 | 宝玉 | AI每日主动社交计数：刘姥姥 3/10 |  | ai:daily_social_count |
| 第02日 15:31 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第02日 15:38 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 15:38 | 宝玉 | 完成互动：与刘姥姥「问安」 |  | interaction:complete |
| 第02日 15:45 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第02日 15:45 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第02日 15:45 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第02日 15:45 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social routine=afternoon_life |  | ai:decision |
| 第02日 15:45 | 宝玉 | 被大老爷发起互动：「闲谈」 |  | interaction:started |
| 第02日 15:50 | 黛玉 | 行动入队：🤝 对弈·宝钗 |  | queue:add |
| 第02日 15:50 | 黛玉 | AI选择：对弈·宝钗 [int:202:baochai] provider=social routine=afternoon_life |  | ai:decision |
| 第02日 15:51 | 宝玉 | AI每日主动社交计数：宝钗 4/10 |  | ai:daily_social_count |
| 第02日 15:51 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第02日 15:51 | 宝玉 | 被大老爷完成互动：「闲谈」 |  | interaction:complete |
| 第02日 16:01 | 宝玉 | 被莺儿发起互动：「寒暄」 |  | interaction:started |
| 第02日 16:04 | 宝玉 | 被刘姥姥发起互动：「品茗」 |  | interaction:started |
| 第02日 16:08 | 宝玉 | 被莺儿完成互动：「寒暄」 |  | interaction:complete |
| 第02日 16:09 | 宝玉 | 行动入队：💬 问安·莺儿 |  | queue:add |
| 第02日 16:09 | 宝玉 | AI每日主动社交计数：莺儿 8/10 |  | ai:daily_social_count |
| 第02日 16:09 | 宝玉 | 开始互动：与莺儿「问安」 |  | interaction:started |
| 第02日 16:09 | 宝玉 | AI选择：问安·莺儿 [int:103:yinger] provider=social |  | ai:decision |
| 第02日 16:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 16:15 | 黛玉 | AI选择：居家闲步 [w:home:14,28] provider=homeward routine=afternoon_life |  | ai:decision |
| 第02日 16:15 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 16:15 | 宝玉 | 完成互动：与莺儿「问安」 |  | interaction:complete |
| 第02日 16:17 | 宝玉 | 被刘姥姥完成互动：「品茗」 |  | interaction:complete |
| 第02日 16:30 | 宝玉 | 行动入队：🤝 品茗·贾母 |  | queue:add |
| 第02日 16:30 | 宝玉 | AI选择：品茗·贾母 [int:104:jiamu] provider=social |  | ai:decision |
| 第02日 16:34 | 宝玉 | AI每日主动社交计数：贾母 2/10 |  | ai:daily_social_count |
| 第02日 16:34 | 宝玉 | 开始互动：与贾母「品茗」 |  | interaction:started |
| 第02日 16:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 16:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第02日 16:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:47 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第02日 16:47 | 宝玉 | 完成互动：与贾母「品茗」 |  | interaction:complete |
| 第02日 16:49 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:49 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:50 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 16:50 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 16:51 | 黛玉 | 行动入队：💬 辩理·宝钗 |  | queue:add |
| 第02日 16:51 | 黛玉 | AI选择：辩理·宝钗 [int:201:baochai] provider=social routine=afternoon_life |  | ai:decision |
| 第02日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第02日 17:00 | 宝玉 | 行动入队：💬 寒暄·大老爷 |  | queue:add |
| 第02日 17:00 | 宝玉 | AI选择：寒暄·大老爷 [int:101:jiashe] provider=social routine=dinner |  | ai:decision |
| 第02日 17:00 | 宝玉 | 被贾母发起互动：「揭短」 |  | interaction:started |
| 第02日 17:07 | 宝玉 | 被贾母完成互动：「揭短」 |  | interaction:complete |
| 第02日 17:08 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 17:08 | 宝玉 | 作息完成：晚餐 via=kitchen |  | ai:routine_completed |
| 第02日 17:08 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第02日 17:08 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 17:10 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第02日 17:15 | 宝玉 | 行动入队：🤝 对酌·大老爷 |  | queue:add |
| 第02日 17:15 | 宝玉 | AI选择：对酌·大老爷 [int:105:jiashe] provider=social |  | ai:decision |
| 第02日 17:15 | 宝玉 | AI每日主动社交计数：大老爷 4/10 |  | ai:daily_social_count |
| 第02日 17:15 | 宝玉 | 开始互动：与大老爷「对酌」 |  | interaction:started |
| 第02日 17:20 | 黛玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第02日 17:20 | 黛玉 | 开始互动：与宝钗「辩理」 |  | interaction:started |
| 第02日 17:22 | 宝玉 | 行动入队：前往南游廊 |  | queue:add |
| 第02日 17:22 | 宝玉 | AI选择：逛园 [w:pub:15,24] provider=homeward |  | ai:decision |
| 第02日 17:27 | 黛玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第02日 17:27 | 黛玉 | 完成互动：与宝钗「辩理」 |  | interaction:complete |
| 第02日 17:30 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第02日 17:30 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social |  | ai:decision |
| 第02日 17:30 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第02日 17:30 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 17:31 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 17:31 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 17:34 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第02日 17:41 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第02日 17:44 | 宝玉 | AI每日主动社交计数：莺儿 9/10 |  | ai:daily_social_count |
| 第02日 17:44 | 宝玉 | 开始互动：与莺儿「对酌」 |  | interaction:started |
| 第02日 17:45 | 宝玉 | 被大老爷发起互动：「问安」 |  | interaction:started |
| 第02日 17:51 | 宝玉 | 被大老爷完成互动：「问安」 |  | interaction:complete |
| 第02日 18:01 | 宝玉 | 任务失败：随侍左右，超时 | 宝玉 | quest:failed |
| 第02日 18:01 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 18:03 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 18:03 | 宝玉 | 完成互动：与莺儿「对酌」 |  | interaction:complete |
| 第02日 18:05 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 18:15 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第02日 18:15 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第02日 18:15 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 18:15 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第02日 18:18 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 18:18 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第02日 18:19 | 宝玉 | AI每日主动社交计数：大老爷 5/10 |  | ai:daily_social_count |
| 第02日 18:19 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第02日 18:20 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 18:20 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第02日 18:22 | 黛玉 | 被紫鹃发起互动：「闲谈」 |  | interaction:started |
| 第02日 18:26 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 18:26 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第02日 18:29 | 黛玉 | 被紫鹃完成互动：「闲谈」 |  | interaction:complete |
| 第02日 18:30 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 18:30 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第02日 18:30 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第02日 18:30 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第02日 18:30 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 18:30 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第02日 18:31 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第02日 18:31 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第02日 18:33 | 宝玉 | AI每日主动社交计数：刘姥姥 4/10 |  | ai:daily_social_count |
| 第02日 18:33 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第02日 18:33 | 黛玉 | 作息完成：晚餐 via=meal |  | ai:routine_completed |
| 第02日 18:33 | 黛玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第02日 18:35 | 黛玉 | 完成用家具：饭桌 / complain_food |  | furniture:complete |
| 第02日 18:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 18:45 | 黛玉 | AI选择：居家闲步 [w:home:11,28] provider=homeward |  | ai:decision |
| 第02日 18:46 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 18:46 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第02日 18:46 | 宝玉 | 被刘姥姥发起互动：「对酌」 |  | interaction:started |
| 第02日 19:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 19:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 19:01 | 黛玉 | 任务失败：随侍黛玉，超时 | 黛玉 | quest:failed |
| 第02日 19:01 | 宝玉 | 任务失败：作诗陪吟，超时 | 王夫人 | quest:failed |
| 第02日 19:01 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第02日 19:01 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:1002:copy_poetry] provider=furniture routine=evening_social |  | ai:decision |
| 第02日 19:03 | 黛玉 | 作息完成：晚间作息 via=desk |  | ai:routine_completed |
| 第02日 19:03 | 黛玉 | 开始用家具：红木书案 / copy_poetry |  | furniture:use_started |
| 第02日 19:05 | 宝玉 | 被刘姥姥完成互动：「对酌」 |  | interaction:complete |
| 第02日 19:08 | 黛玉 | 完成用家具：红木书案 / copy_poetry |  | furniture:complete |
| 第02日 19:11 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第02日 19:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:15 | 黛玉 | AI选择：闲游 [w:11,33] provider=wander |  | ai:decision |
| 第02日 19:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:17 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:17 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:19 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第02日 19:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:24 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:24 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第02日 19:26 | 黛玉 | 行动入队：💬 评文·探春 |  | queue:add |
| 第02日 19:26 | 黛玉 | AI选择：评文·探春 [int:203:tanchun] provider=social |  | ai:decision |
| 第02日 19:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:30 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第02日 19:30 | 宝玉 | AI每日主动社交计数：莺儿 10/10 |  | ai:daily_social_count |
| 第02日 19:30 | 宝玉 | 作息完成：晚间作息 via=xujiu |  | ai:routine_completed |
| 第02日 19:30 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第02日 19:30 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social routine=evening_social |  | ai:decision |
| 第02日 19:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:37 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第02日 19:37 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第02日 19:38 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:38 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 19:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 19:39 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 19:39 | 宝玉 | 被大老爷发起互动：「品茗」 |  | interaction:started |
| 第02日 19:40 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 19:45 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第02日 19:45 | 宝玉 | AI每日主动社交计数：大老爷 6/10 |  | ai:daily_social_count |
| 第02日 19:45 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第02日 19:45 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第02日 19:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 19:45 | 黛玉 | AI选择：居家闲步 [w:home:9,32] provider=homeward |  | ai:decision |
| 第02日 19:45 | 宝玉 | 被宝钗发起互动：「对酌」 |  | interaction:started |
| 第02日 19:50 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 19:50 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 19:51 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 19:51 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第02日 19:52 | 宝玉 | 被大老爷完成互动：「品茗」 |  | interaction:complete |
| 第02日 19:53 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 19:59 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第02日 20:00 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第02日 20:00 | 宝玉 | AI每日主动社交计数：宝钗 5/10 |  | ai:daily_social_count |
| 第02日 20:00 | 宝玉 | 开始互动：与宝钗「问安」 |  | interaction:started |
| 第02日 20:00 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social |  | ai:decision |
| 第02日 20:00 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第02日 20:00 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第02日 20:02 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第02日 20:03 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第02日 20:04 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第02日 20:04 | 宝玉 | 被袭人发起互动：「问安」 |  | interaction:started |
| 第02日 20:05 | 宝玉 | 开始任务：代掌怡红院 | 宝玉 | quest:started |
| 第02日 20:07 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 20:07 | 宝玉 | 完成互动：与宝钗「问安」 |  | interaction:complete |
| 第02日 20:11 | 宝玉 | 完成任务：代掌怡红院 | 宝玉 | quest:completed |
| 第02日 20:11 | 宝玉 | 被袭人完成互动：「问安」 |  | interaction:complete |
| 第02日 20:15 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第02日 20:15 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第02日 20:15 | 黛玉 | 行动入队：💬 论禅·湘云 |  | queue:add |
| 第02日 20:15 | 黛玉 | AI选择：论禅·湘云 [int:205:xiangyun] provider=social |  | ai:decision |
| 第02日 20:15 | 宝玉 | 被宝钗发起互动：「揭短」 |  | interaction:started |
| 第02日 20:15 | 宝玉 | AI每日主动社交计数：刘姥姥 5/10 |  | ai:daily_social_count |
| 第02日 20:15 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第02日 20:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:21 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:21 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:21 | 宝玉 | 被宝钗完成互动：「揭短」 |  | interaction:complete |
| 第02日 20:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:24 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:24 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:27 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:27 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:28 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:28 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:28 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 20:28 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第02日 20:28 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 20:29 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第02日 20:29 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第02日 20:29 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第02日 20:29 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第02日 20:30 | 宝玉 | 行动入队：💬 问安·袭人 |  | queue:add |
| 第02日 20:30 | 宝玉 | AI每日主动社交计数：袭人 1/10 |  | ai:daily_social_count |
| 第02日 20:30 | 宝玉 | 开始互动：与袭人「问安」 |  | interaction:started |
| 第02日 20:30 | 宝玉 | AI选择：问安·袭人 [int:103:xiren] provider=social |  | ai:decision |
| 第02日 20:30 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第02日 20:30 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第02日 20:30 | 宝玉 | 被刘姥姥发起互动：「闲谈」 |  | interaction:started |
| 第02日 20:31 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第02日 20:31 | 黛玉 | AI选择：居家闲步 [w:home:4,31] provider=homeward |  | ai:decision |
| 第02日 20:37 | 宝玉 | AI目标频控：袭人 75分钟 |  | ai:social_target_cooldown |
| 第02日 20:37 | 宝玉 | 完成互动：与袭人「问安」 |  | interaction:complete |
| 第02日 20:37 | 宝玉 | 被刘姥姥完成互动：「闲谈」 |  | interaction:complete |
| 第02日 20:38 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第02日 20:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 20:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 20:45 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第02日 20:46 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第02日 20:46 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第02日 20:46 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第02日 20:47 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第02日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第02日 21:00 | 宝玉 | 行动入队：💬 论禅·琏二爷 |  | queue:add |
| 第02日 21:00 | 宝玉 | AI选择：论禅·琏二爷 [int:205:jialian] provider=social |  | ai:decision |
| 第02日 21:00 | 黛玉 | 行动入队：💬 辩理·蓉哥儿 |  | queue:add |
| 第02日 21:00 | 黛玉 | AI选择：辩理·蓉哥儿 [int:201:jiarong] provider=social |  | ai:decision |
| 第02日 21:02 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 21:02 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 21:02 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 21:02 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第02日 21:03 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第02日 21:10 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第02日 21:15 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第02日 21:15 | 宝玉 | AI每日主动社交计数：大老爷 7/10 |  | ai:daily_social_count |
| 第02日 21:15 | 宝玉 | 开始互动：与大老爷「对弈」 |  | interaction:started |
| 第02日 21:15 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第02日 21:15 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第02日 21:15 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第02日 21:15 | 黛玉 | AI每日主动社交计数：紫鹃 3/10 |  | ai:daily_social_count |
| 第02日 21:15 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第02日 21:15 | 宝玉 | 被贾母发起互动：「倾听」 |  | interaction:started |
| 第02日 21:22 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第02日 21:22 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第02日 21:22 | 宝玉 | 被贾母完成互动：「倾听」 |  | interaction:complete |
| 第02日 21:30 | 黛玉 | 行动入队：🤝 对弈·凤姐 |  | queue:add |
| 第02日 21:30 | 黛玉 | AI选择：对弈·凤姐 [int:202:xifeng] provider=social |  | ai:decision |
| 第02日 21:30 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第02日 21:32 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 21:32 | 宝玉 | 完成互动：与大老爷「对弈」 |  | interaction:complete |
| 第02日 21:37 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第02日 21:39 | 黛玉 | 行动入队：💬 辩理·袭人 |  | queue:add |
| 第02日 21:39 | 黛玉 | AI选择：辩理·袭人 [int:201:xiren] provider=social |  | ai:decision |
| 第02日 21:45 | 宝玉 | 行动入队：💬 联句·刘姥姥 |  | queue:add |
| 第02日 21:45 | 宝玉 | AI每日主动社交计数：刘姥姥 6/10 |  | ai:daily_social_count |
| 第02日 21:45 | 宝玉 | 开始互动：与刘姥姥「联句」 |  | interaction:started |
| 第02日 21:45 | 宝玉 | AI选择：联句·刘姥姥 [int:204:liulaolao] provider=social |  | ai:decision |
| 第02日 21:51 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 21:51 | 宝玉 | 完成互动：与刘姥姥「联句」 |  | interaction:complete |
| 第02日 22:00 | 宝玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第02日 22:00 | 宝玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第02日 22:00 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第02日 22:00 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第02日 22:07 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第02日 22:07 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第02日 22:08 | 宝玉 | AI每日主动社交计数：宝钗 6/10 |  | ai:daily_social_count |
| 第02日 22:08 | 宝玉 | 开始互动：与宝钗「论禅」 |  | interaction:started |
| 第02日 22:15 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 22:15 | 宝玉 | 完成互动：与宝钗「论禅」 |  | interaction:complete |
| 第02日 22:30 | 宝玉 | 行动入队：💬 论禅·贾母 |  | queue:add |
| 第02日 22:30 | 宝玉 | AI选择：论禅·贾母 [int:205:jiamu] provider=social |  | ai:decision |
| 第02日 22:35 | 宝玉 | AI每日主动社交计数：贾母 3/10 |  | ai:daily_social_count |
| 第02日 22:35 | 宝玉 | 开始互动：与贾母「论禅」 |  | interaction:started |
| 第02日 22:38 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:38 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:43 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第02日 22:43 | 宝玉 | 完成互动：与贾母「论禅」 |  | interaction:complete |
| 第02日 22:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 22:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第02日 22:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第02日 22:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第02日 22:45 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第02日 22:47 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 22:47 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture |  | ai:decision |
| 第02日 22:47 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 23:00 | 宝玉 | 行动入队：💬 联句·大老爷 |  | queue:add |
| 第02日 23:00 | 宝玉 | AI选择：联句·大老爷 [int:204:jiashe] provider=social |  | ai:decision |
| 第02日 23:03 | 宝玉 | AI每日主动社交计数：大老爷 8/10 |  | ai:daily_social_count |
| 第02日 23:03 | 宝玉 | 开始互动：与大老爷「联句」 |  | interaction:started |
| 第02日 23:09 | 黛玉 | 行动入队：💬 评文·探春 |  | queue:add |
| 第02日 23:09 | 黛玉 | AI选择：评文·探春 [int:203:tanchun] provider=social |  | ai:decision |
| 第02日 23:10 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第02日 23:10 | 宝玉 | 完成互动：与大老爷「联句」 |  | interaction:complete |
| 第02日 23:10 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第02日 23:17 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第02日 23:17 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第02日 23:17 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第02日 23:22 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第02日 23:30 | 宝玉 | 行动入队：💬 辩理·刘姥姥 |  | queue:add |
| 第02日 23:30 | 宝玉 | AI每日主动社交计数：刘姥姥 7/10 |  | ai:daily_social_count |
| 第02日 23:30 | 宝玉 | 开始互动：与刘姥姥「辩理」 |  | interaction:started |
| 第02日 23:30 | 宝玉 | AI选择：辩理·刘姥姥 [int:201:liulaolao] provider=social |  | ai:decision |
| 第02日 23:32 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第02日 23:37 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第02日 23:37 | 宝玉 | 完成互动：与刘姥姥「辩理」 |  | interaction:complete |
| 第02日 23:39 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第02日 23:45 | 宝玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第02日 23:45 | 宝玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social |  | ai:decision |
| 第02日 23:45 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第02日 23:50 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第02日 23:51 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第02日 23:52 | 宝玉 | AI每日主动社交计数：宝钗 7/10 |  | ai:daily_social_count |
| 第02日 23:52 | 宝玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第02日 23:59 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第02日 23:59 | 宝玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第03日 00:00 | 全局 | 进入第3日 |  | time:day |
| 第03日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第03日 00:00 | 宝玉 | 行动入队：💬 辩理·莺儿 |  | queue:add |
| 第03日 00:00 | 宝玉 | AI选择：辩理·莺儿 [int:201:yinger] provider=social routine=night_sleep |  | ai:decision |
| 第03日 00:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 00:01 | 宝玉 | AI每日主动社交计数：莺儿 1/10 |  | ai:daily_social_count |
| 第03日 00:01 | 宝玉 | 开始互动：与莺儿「辩理」 |  | interaction:started |
| 第03日 00:08 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 00:08 | 宝玉 | 完成互动：与莺儿「辩理」 |  | interaction:complete |
| 第03日 00:15 | 宝玉 | 行动入队：🤝 对弈·贾母 |  | queue:add |
| 第03日 00:15 | 宝玉 | AI选择：对弈·贾母 [int:202:jiamu] provider=social routine=night_sleep |  | ai:decision |
| 第03日 00:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 00:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 00:15 | 宝玉 | AI每日主动社交计数：贾母 1/10 |  | ai:daily_social_count |
| 第03日 00:15 | 宝玉 | 开始互动：与贾母「对弈」 |  | interaction:started |
| 第03日 00:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 00:17 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:17 | 黛玉 | 作息完成：夜间睡眠 via=bed |  | ai:routine_completed |
| 第03日 00:17 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 00:17 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 00:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 00:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 00:33 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 00:33 | 宝玉 | 完成互动：与贾母「对弈」 |  | interaction:complete |
| 第03日 00:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 00:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 00:39 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 00:40 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:40 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 00:40 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 00:40 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 00:45 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 00:45 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 00:45 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第03日 00:45 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social |  | ai:decision |
| 第03日 00:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 00:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 00:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 00:47 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 00:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 00:47 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 01:00 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第03日 01:00 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social routine=night_sleep |  | ai:decision |
| 第03日 01:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 01:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第03日 01:00 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第03日 01:01 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 01:01 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 01:07 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第03日 01:08 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 01:08 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 01:13 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 01:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 01:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 01:16 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 01:19 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 01:22 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 01:26 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 01:26 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 01:30 | 宝玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第03日 01:30 | 宝玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social routine=night_sleep |  | ai:decision |
| 第03日 01:30 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 01:30 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture |  | ai:decision |
| 第03日 01:32 | 宝玉 | AI每日主动社交计数：莺儿 2/10 |  | ai:daily_social_count |
| 第03日 01:32 | 宝玉 | 开始互动：与莺儿「评文」 |  | interaction:started |
| 第03日 01:33 | 黛玉 | 开始用家具：琴台 / wrong_note |  | furniture:use_started |
| 第03日 01:35 | 黛玉 | 完成用家具：琴台 / wrong_note |  | furniture:complete |
| 第03日 01:39 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 01:39 | 宝玉 | 完成互动：与莺儿「评文」 |  | interaction:complete |
| 第03日 01:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 01:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 01:45 | 黛玉 | 行动入队：🤝 对弈·探春 |  | queue:add |
| 第03日 01:45 | 黛玉 | AI选择：对弈·探春 [int:202:tanchun] provider=social |  | ai:decision |
| 第03日 01:45 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 01:46 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 01:46 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:2001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第03日 01:46 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 01:46 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 01:46 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 01:46 | 宝玉 | 作息完成：夜间睡眠 via=bed |  | ai:routine_completed |
| 第03日 01:46 | 宝玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 01:46 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 02:00 | 宝玉 | 行动入队：💬 评文·大老爷 |  | queue:add |
| 第03日 02:00 | 宝玉 | AI每日主动社交计数：大老爷 1/10 |  | ai:daily_social_count |
| 第03日 02:00 | 宝玉 | 开始互动：与大老爷「评文」 |  | interaction:started |
| 第03日 02:00 | 宝玉 | AI选择：评文·大老爷 [int:203:jiashe] provider=social |  | ai:decision |
| 第03日 02:00 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 02:00 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 02:02 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 02:03 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 02:03 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 02:03 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 02:07 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:07 | 宝玉 | 完成互动：与大老爷「评文」 |  | interaction:complete |
| 第03日 02:15 | 宝玉 | 行动入队：💬 评文·刘姥姥 |  | queue:add |
| 第03日 02:15 | 宝玉 | AI每日主动社交计数：刘姥姥 1/10 |  | ai:daily_social_count |
| 第03日 02:15 | 宝玉 | 开始互动：与刘姥姥「评文」 |  | interaction:started |
| 第03日 02:15 | 宝玉 | AI选择：评文·刘姥姥 [int:203:liulaolao] provider=social |  | ai:decision |
| 第03日 02:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:16 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:16 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:18 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:18 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:19 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:19 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:20 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:20 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:21 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:21 | 宝玉 | 完成互动：与刘姥姥「评文」 |  | interaction:complete |
| 第03日 02:21 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:22 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:22 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:22 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:22 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 02:30 | 宝玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第03日 02:30 | 宝玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social |  | ai:decision |
| 第03日 02:30 | 黛玉 | 行动入队：💬 辩理·探春 |  | queue:add |
| 第03日 02:30 | 黛玉 | AI选择：辩理·探春 [int:201:tanchun] provider=social |  | ai:decision |
| 第03日 02:31 | 宝玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第03日 02:31 | 宝玉 | 开始互动：与宝钗「论禅」 |  | interaction:started |
| 第03日 02:31 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第03日 02:32 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 02:32 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 02:38 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 02:38 | 宝玉 | 完成互动：与宝钗「论禅」 |  | interaction:complete |
| 第03日 02:38 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第03日 02:45 | 宝玉 | 行动入队：🤝 对弈·贾母 |  | queue:add |
| 第03日 02:45 | 宝玉 | AI每日主动社交计数：贾母 2/10 |  | ai:daily_social_count |
| 第03日 02:45 | 宝玉 | 开始互动：与贾母「对弈」 |  | interaction:started |
| 第03日 02:45 | 宝玉 | AI选择：对弈·贾母 [int:202:jiamu] provider=social |  | ai:decision |
| 第03日 02:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:45 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 02:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 02:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 02:46 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 02:46 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 02:53 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 03:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 03:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 03:02 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 03:02 | 宝玉 | 完成互动：与贾母「对弈」 |  | interaction:complete |
| 第03日 03:15 | 宝玉 | 行动入队：🤝 对弈·莺儿 |  | queue:add |
| 第03日 03:15 | 宝玉 | AI每日主动社交计数：莺儿 3/10 |  | ai:daily_social_count |
| 第03日 03:15 | 宝玉 | 开始互动：与莺儿「对弈」 |  | interaction:started |
| 第03日 03:15 | 宝玉 | AI选择：对弈·莺儿 [int:202:yinger] provider=social |  | ai:decision |
| 第03日 03:15 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 03:15 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 03:15 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 03:15 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 03:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 03:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 03:32 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 03:32 | 宝玉 | 完成互动：与莺儿「对弈」 |  | interaction:complete |
| 第03日 03:45 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第03日 03:45 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第03日 03:45 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 03:45 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 03:45 | 宝玉 | AI每日主动社交计数：大老爷 2/10 |  | ai:daily_social_count |
| 第03日 03:45 | 宝玉 | 开始互动：与大老爷「对弈」 |  | interaction:started |
| 第03日 03:52 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 03:52 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 03:52 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 03:53 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 03:55 | 宝玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 03:59 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 04:00 | 宝玉 | 行动入队：💬 论禅·大老爷 |  | queue:add |
| 第03日 04:00 | 宝玉 | AI选择：论禅·大老爷 [int:205:jiashe] provider=social |  | ai:decision |
| 第03日 04:00 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 04:00 | 黛玉 | 开始用家具：红木书案 / read_misc |  | furniture:use_started |
| 第03日 04:00 | 黛玉 | AI选择：红木书案·翻闲书 [furn:1002:read_misc] provider=furniture |  | ai:decision |
| 第03日 04:01 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 04:01 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 04:01 | 黛玉 | 完成用家具：红木书案 / read_misc |  | furniture:complete |
| 第03日 04:02 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 04:02 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第03日 04:15 | 宝玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第03日 04:15 | 宝玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第03日 04:15 | 黛玉 | 行动入队：🤝 对弈·大老爷 |  | queue:add |
| 第03日 04:15 | 黛玉 | AI选择：对弈·大老爷 [int:202:jiashe] provider=social |  | ai:decision |
| 第03日 04:17 | 宝玉 | AI每日主动社交计数：大老爷 3/10 |  | ai:daily_social_count |
| 第03日 04:17 | 宝玉 | 开始互动：与大老爷「对弈」 |  | interaction:started |
| 第03日 04:23 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:23 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:25 | 宝玉 | 被刘姥姥发起互动：「倾听」 |  | interaction:started |
| 第03日 04:28 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:28 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:29 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:29 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:31 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:31 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:32 | 宝玉 | 被刘姥姥完成互动：「倾听」 |  | interaction:complete |
| 第03日 04:33 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:33 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:35 | 宝玉 | AI目标频控：大老爷 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 04:35 | 宝玉 | 完成互动：与大老爷「对弈」 |  | interaction:complete |
| 第03日 04:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:37 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:37 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:38 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:38 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:38 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 04:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 04:39 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 04:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 04:39 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 04:45 | 宝玉 | 行动入队：💬 评文·刘姥姥 |  | queue:add |
| 第03日 04:45 | 宝玉 | AI每日主动社交计数：刘姥姥 2/10 |  | ai:daily_social_count |
| 第03日 04:45 | 宝玉 | 开始互动：与刘姥姥「评文」 |  | interaction:started |
| 第03日 04:45 | 宝玉 | AI选择：评文·刘姥姥 [int:203:liulaolao] provider=social |  | ai:decision |
| 第03日 04:45 | 黛玉 | 行动入队：📚 翻闲书 |  | queue:add |
| 第03日 04:45 | 黛玉 | AI选择：红木书案·翻闲书 [furn:7002:read_misc] provider=furniture |  | ai:decision |
| 第03日 04:47 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 04:47 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 04:48 | 黛玉 | 行动入队：💬 评文·宝玉 |  | queue:add |
| 第03日 04:48 | 黛玉 | AI选择：评文·宝玉 [int:203:baoyu] provider=social |  | ai:decision |
| 第03日 04:50 | 宝玉 | 行动入队：💬 评文·莺儿 |  | queue:add |
| 第03日 04:50 | 宝玉 | AI选择：评文·莺儿 [int:203:yinger] provider=social |  | ai:decision |
| 第03日 04:51 | 宝玉 | AI每日主动社交计数：莺儿 4/10 |  | ai:daily_social_count |
| 第03日 04:51 | 宝玉 | 开始互动：与莺儿「评文」 |  | interaction:started |
| 第03日 04:58 | 宝玉 | AI目标频控：莺儿 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 04:58 | 宝玉 | 完成互动：与莺儿「评文」 |  | interaction:complete |
| 第03日 05:00 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第03日 05:00 | 宝玉 | AI每日主动社交计数：刘姥姥 3/10 |  | ai:daily_social_count |
| 第03日 05:00 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第03日 05:00 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第03日 05:00 | 宝玉 | 被莺儿发起互动：「品茗」 |  | interaction:started |
| 第03日 05:07 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 05:07 | 宝玉 | 完成互动：与刘姥姥「问安」 |  | interaction:complete |
| 第03日 05:13 | 宝玉 | 被莺儿完成互动：「品茗」 |  | interaction:complete |
| 第03日 05:15 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第03日 05:15 | 宝玉 | AI每日主动社交计数：宝钗 2/10 |  | ai:daily_social_count |
| 第03日 05:15 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第03日 05:15 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第03日 05:21 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 05:21 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第03日 05:30 | 宝玉 | 行动入队：💬 闲谈·探春 |  | queue:add |
| 第03日 05:30 | 宝玉 | AI选择：闲谈·探春 [int:102:tanchun] provider=social routine=morning_hygiene |  | ai:decision |
| 第03日 06:00 | 黛玉 | 下发任务给紫鹃：随侍黛玉 | 黛玉 | quest:issued |
| 第03日 06:00 | 黛玉 | 接受任务：随侍黛玉 | 黛玉 | quest:accepted |
| 第03日 06:00 | 宝玉 | 下发任务给袭人：晨昏定省 | 宝玉 | quest:issued |
| 第03日 06:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第03日 06:03 | 黛玉 | AI每日主动社交计数：宝玉 1/10 |  | ai:daily_social_count |
| 第03日 06:03 | 黛玉 | 开始互动：与宝玉「评文」 |  | interaction:started |
| 第03日 06:03 | 宝玉 | 被黛玉发起互动：「评文」 |  | interaction:started |
| 第03日 06:10 | 黛玉 | AI目标频控：宝玉 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 06:10 | 黛玉 | 完成互动：与宝玉「评文」 |  | interaction:complete |
| 第03日 06:10 | 宝玉 | 被黛玉完成互动：「评文」 |  | interaction:complete |
| 第03日 06:15 | 黛玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第03日 06:15 | 黛玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第03日 06:22 | 黛玉 | 行动入队：🧼 在铜面盆 |  | queue:add |
| 第03日 06:22 | 黛玉 | AI选择：铜面盆·使用铜面盆 [furn:2008:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第03日 06:33 | 宝玉 | AI每日主动社交计数：探春 1/10 |  | ai:daily_social_count |
| 第03日 06:33 | 宝玉 | 开始互动：与探春「闲谈」 |  | interaction:started |
| 第03日 06:36 | 黛玉 | 行动入队：👘 在梳洗妆台 |  | queue:add |
| 第03日 06:36 | 黛玉 | AI选择：梳洗妆台·使用梳洗妆台 [furn:2007:default_use] provider=furniture routine=morning_hygiene |  | ai:decision |
| 第03日 06:40 | 宝玉 | AI目标频控：探春 75分钟 |  | ai:social_target_cooldown |
| 第03日 06:40 | 宝玉 | 完成互动：与探春「闲谈」 |  | interaction:complete |
| 第03日 06:45 | 宝玉 | 行动入队：💬 闲谈·宝钗 |  | queue:add |
| 第03日 06:45 | 宝玉 | AI选择：闲谈·宝钗 [int:102:baochai] provider=social routine=morning_hygiene |  | ai:decision |
| 第03日 06:51 | 黛玉 | 作息完成：晨起梳洗 via=wardrobe |  | ai:routine_completed |
| 第03日 06:51 | 黛玉 | 开始用家具：梳洗妆台 / default_use |  | furniture:use_started |
| 第03日 06:54 | 宝玉 | 行动入队：前往西游廊 |  | queue:add |
| 第03日 06:54 | 宝玉 | AI选择：逛园 [w:pub:15,18] provider=homeward routine=morning_hygiene |  | ai:decision |
| 第03日 06:56 | 黛玉 | 完成用家具：梳洗妆台 / default_use |  | furniture:complete |
| 第03日 07:00 | 宝玉 | 下发任务给晴雯：随侍左右 | 宝玉 | quest:issued |
| 第03日 07:00 | 宝玉 | 接受任务：随侍左右 | 宝玉 | quest:accepted |
| 第03日 07:00 | 宝玉 | 下发任务给麝月：服侍更衣 | 宝玉 | quest:issued |
| 第03日 07:00 | 宝玉 | 接受任务：服侍更衣 | 宝玉 | quest:accepted |
| 第03日 07:00 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:00 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:00 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:00 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:01 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:01 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:02 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:02 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:03 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:03 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:04 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:04 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:06 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:06 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:10 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:10 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:11 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:11 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:13 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:13 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:15 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:15 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:16 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:16 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:17 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:17 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:19 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:19 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:21 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:21 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:22 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:22 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:23 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:23 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:24 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:24 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:26 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:26 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:35 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:35 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:35 | 宝玉 | 被雪雁发起互动：「问安」 |  | interaction:started |
| 第03日 07:42 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:42 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:43 | 宝玉 | 被雪雁完成互动：「问安」 |  | interaction:complete |
| 第03日 07:46 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:46 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:50 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:50 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:51 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:51 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:54 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:54 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:55 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:55 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:56 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:56 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:57 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:57 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 07:59 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 07:59 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:00 | 黛玉 | 下发任务给紫鹃：备膳 | 黛玉 | quest:issued |
| 第03日 08:00 | 黛玉 | 接受任务：备膳 | 黛玉 | quest:accepted |
| 第03日 08:00 | 全局 | 时段切换：上午 |  | time:period |
| 第03日 08:00 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:00 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:00 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:00 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:01 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:01 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:08 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:08 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:09 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:09 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:10 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:10 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:12 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:12 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:13 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:13 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:15 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:15 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:16 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:16 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:19 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:19 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:20 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:20 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:21 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:21 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:22 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:22 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:24 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:24 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:26 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:26 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:28 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:28 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:29 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:29 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:32 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:32 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:33 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:33 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:34 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:34 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:36 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:36 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:42 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:42 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:43 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 08:43 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=breakfast |  | ai:decision |
| 第03日 08:46 | 黛玉 | 完成任务：备膳 | 黛玉 | quest:completed |
| 第03日 08:47 | 黛玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第03日 08:55 | 黛玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第03日 09:00 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第03日 09:00 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social routine=breakfast |  | ai:decision |
| 第03日 09:01 | 宝玉 | 任务失败：晨昏定省，超时 | 宝玉 | quest:failed |
| 第03日 09:01 | 宝玉 | AI每日主动社交计数：宝钗 3/10 |  | ai:daily_social_count |
| 第03日 09:01 | 宝玉 | 作息完成：上午作息 via=xujiu |  | ai:routine_completed |
| 第03日 09:01 | 宝玉 | 开始互动：与宝钗「问安」 |  | interaction:started |
| 第03日 09:08 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 09:08 | 宝玉 | 完成互动：与宝钗「问安」 |  | interaction:complete |
| 第03日 09:10 | 黛玉 | 被宝钗发起互动：「调侃」 |  | interaction:started |
| 第03日 09:15 | 宝玉 | 行动入队：💬 打趣·莺儿 |  | queue:add |
| 第03日 09:15 | 宝玉 | AI每日主动社交计数：莺儿 5/10 |  | ai:daily_social_count |
| 第03日 09:15 | 宝玉 | 开始互动：与莺儿「打趣」 |  | interaction:started |
| 第03日 09:15 | 宝玉 | AI选择：打趣·莺儿 [int:301:yinger] provider=social routine=breakfast |  | ai:decision |
| 第03日 09:17 | 黛玉 | 被宝钗完成互动：「调侃」 |  | interaction:complete |
| 第03日 09:21 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 09:21 | 宝玉 | 完成互动：与莺儿「打趣」 |  | interaction:complete |
| 第03日 09:30 | 黛玉 | 行动入队：💬 论禅·宝钗 |  | queue:add |
| 第03日 09:30 | 黛玉 | AI选择：论禅·宝钗 [int:205:baochai] provider=social routine=morning_focus |  | ai:decision |
| 第03日 09:30 | 宝玉 | 行动入队：💬 问安·黛玉 |  | queue:add |
| 第03日 09:30 | 宝玉 | AI选择：问安·黛玉 [int:103:daiyu] provider=social |  | ai:decision |
| 第03日 09:30 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第03日 09:37 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第03日 09:39 | 宝玉 | AI每日主动社交计数：黛玉 1/10 |  | ai:daily_social_count |
| 第03日 09:39 | 宝玉 | 开始互动：与黛玉「问安」 |  | interaction:started |
| 第03日 09:39 | 黛玉 | 被宝玉发起互动：「问安」 |  | interaction:started |
| 第03日 09:46 | 宝玉 | AI目标频控：黛玉 75分钟 |  | ai:social_target_cooldown |
| 第03日 09:46 | 宝玉 | 完成互动：与黛玉「问安」 |  | interaction:complete |
| 第03日 09:46 | 黛玉 | 被宝玉完成互动：「问安」 |  | interaction:complete |
| 第03日 10:00 | 宝玉 | 行动入队：💬 问安·凤姐 |  | queue:add |
| 第03日 10:00 | 宝玉 | AI选择：问安·凤姐 [int:103:xifeng] provider=social |  | ai:decision |
| 第03日 10:00 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 10:00 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture routine=morning_focus |  | ai:decision |
| 第03日 10:03 | 宝玉 | AI每日主动社交计数：凤姐 1/10 |  | ai:daily_social_count |
| 第03日 10:03 | 宝玉 | 开始互动：与凤姐「问安」 |  | interaction:started |
| 第03日 10:10 | 宝玉 | AI目标频控：凤姐 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:10 | 宝玉 | 完成互动：与凤姐「问安」 |  | interaction:complete |
| 第03日 10:15 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第03日 10:15 | 宝玉 | AI每日主动社交计数：大老爷 4/10 |  | ai:daily_social_count |
| 第03日 10:15 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第03日 10:15 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第03日 10:20 | 黛玉 | 行动入队：💬 联句·宝钗 |  | queue:add |
| 第03日 10:20 | 黛玉 | AI选择：联句·宝钗 [int:204:baochai] provider=social routine=morning_focus |  | ai:decision |
| 第03日 10:21 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:21 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第03日 10:30 | 宝玉 | 行动入队：💬 问安·宝钗 |  | queue:add |
| 第03日 10:30 | 宝玉 | AI选择：问安·宝钗 [int:103:baochai] provider=social |  | ai:decision |
| 第03日 10:31 | 宝玉 | AI每日主动社交计数：宝钗 4/10 |  | ai:daily_social_count |
| 第03日 10:31 | 宝玉 | 开始互动：与宝钗「问安」 |  | interaction:started |
| 第03日 10:33 | 黛玉 | AI每日主动社交计数：宝钗 1/10 |  | ai:daily_social_count |
| 第03日 10:33 | 黛玉 | 作息完成：上午作息 via=lundao |  | ai:routine_completed |
| 第03日 10:33 | 黛玉 | 开始互动：与宝钗「联句」 |  | interaction:started |
| 第03日 10:38 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:38 | 宝玉 | 完成互动：与宝钗「问安」 |  | interaction:complete |
| 第03日 10:40 | 黛玉 | AI目标频控：宝钗 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 10:40 | 黛玉 | 完成互动：与宝钗「联句」 |  | interaction:complete |
| 第03日 10:45 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第03日 10:45 | 宝玉 | AI每日主动社交计数：莺儿 6/10 |  | ai:daily_social_count |
| 第03日 10:45 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第03日 10:45 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第03日 10:45 | 黛玉 | 行动入队：💬 论禅·莺儿 |  | queue:add |
| 第03日 10:45 | 黛玉 | AI选择：论禅·莺儿 [int:205:yinger] provider=social |  | ai:decision |
| 第03日 10:51 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 10:51 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第03日 11:00 | 宝玉 | 任务下发：晨昏定省 | 政老爷 | quest:issued |
| 第03日 11:00 | 宝玉 | 接受任务：晨昏定省 | 政老爷 | quest:accepted |
| 第03日 11:00 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:00 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:00 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:00 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:01 | 宝玉 | 任务失败：服侍更衣，超时 | 宝玉 | quest:failed |
| 第03日 11:01 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:01 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:02 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:02 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:03 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:03 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:04 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:04 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:06 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:06 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:07 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:07 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:08 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:08 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:09 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:09 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:10 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:10 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:11 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:11 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:12 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:12 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:15 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:15 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:15 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:15 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:16 | 黛玉 | 被紫鹃发起互动：「寒暄」 |  | interaction:started |
| 第03日 11:23 | 黛玉 | 被紫鹃完成互动：「寒暄」 |  | interaction:complete |
| 第03日 11:25 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:25 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:27 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:27 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:30 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:30 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:30 | 宝玉 | 被大老爷发起互动：「调侃」 |  | interaction:started |
| 第03日 11:30 | 宝玉 | 被刘姥姥发起互动：「嬉闹」 |  | interaction:started |
| 第03日 11:32 | 黛玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 11:32 | 黛玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 11:32 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 11:32 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] |  | ai:decision |
| 第03日 11:32 | 黛玉 | 需求危机：hunger |  | need:crisis |
| 第03日 11:37 | 宝玉 | 被大老爷完成互动：「调侃」 |  | interaction:complete |
| 第03日 11:45 | 宝玉 | 被贾母发起互动：「打趣」 |  | interaction:started |
| 第03日 11:45 | 宝玉 | 被刘姥姥完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 11:52 | 宝玉 | 被贾母完成互动：「打趣」 |  | interaction:complete |
| 第03日 12:00 | 全局 | 时段切换：午后 |  | time:period |
| 第03日 12:00 | 宝玉 | 行动入队：💬 寒暄·凤姐 |  | queue:add |
| 第03日 12:00 | 宝玉 | AI选择：寒暄·凤姐 [int:101:xifeng] provider=social routine=lunch |  | ai:decision |
| 第03日 12:02 | 宝玉 | AI每日主动社交计数：凤姐 2/10 |  | ai:daily_social_count |
| 第03日 12:02 | 宝玉 | 开始互动：与凤姐「寒暄」 |  | interaction:started |
| 第03日 12:09 | 宝玉 | AI目标频控：凤姐 75分钟 |  | ai:social_target_cooldown |
| 第03日 12:09 | 宝玉 | 完成互动：与凤姐「寒暄」 |  | interaction:complete |
| 第03日 12:15 | 宝玉 | 行动入队：🤝 对酌·大老爷 |  | queue:add |
| 第03日 12:15 | 宝玉 | AI选择：对酌·大老爷 [int:105:jiashe] provider=social routine=lunch |  | ai:decision |
| 第03日 12:15 | 宝玉 | AI每日主动社交计数：大老爷 5/10 |  | ai:daily_social_count |
| 第03日 12:15 | 宝玉 | 开始互动：与大老爷「对酌」 |  | interaction:started |
| 第03日 12:34 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 12:34 | 宝玉 | 完成互动：与大老爷「对酌」 |  | interaction:complete |
| 第03日 12:45 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 12:45 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social routine=lunch |  | ai:decision |
| 第03日 12:45 | 宝玉 | AI每日主动社交计数：刘姥姥 4/10 |  | ai:daily_social_count |
| 第03日 12:45 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 12:58 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 12:58 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第03日 13:00 | 宝玉 | 行动入队：🤝 对酌·莺儿 |  | queue:add |
| 第03日 13:00 | 宝玉 | AI每日主动社交计数：莺儿 7/10 |  | ai:daily_social_count |
| 第03日 13:00 | 宝玉 | 作息完成：下午作息 via=xujiu |  | ai:routine_completed |
| 第03日 13:00 | 宝玉 | 开始互动：与莺儿「对酌」 |  | interaction:started |
| 第03日 13:00 | 宝玉 | AI选择：对酌·莺儿 [int:105:yinger] provider=social routine=afternoon_life |  | ai:decision |
| 第03日 13:00 | 宝玉 | 被大老爷发起互动：「闲谈」 |  | interaction:started |
| 第03日 13:02 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 13:03 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 13:03 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 13:03 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 13:03 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] routine=lunch |  | ai:decision |
| 第03日 13:04 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 13:04 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 13:04 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 13:04 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] routine=lunch |  | ai:decision |
| 第03日 13:05 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 13:05 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 13:05 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 13:05 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] routine=lunch |  | ai:decision |
| 第03日 13:07 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 13:07 | 宝玉 | 被大老爷完成互动：「闲谈」 |  | interaction:complete |
| 第03日 13:07 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 13:07 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 13:07 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] routine=lunch |  | ai:decision |
| 第03日 13:08 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 13:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 13:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture routine=lunch |  | ai:decision |
| 第03日 13:15 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第03日 13:19 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 13:19 | 宝玉 | 完成互动：与莺儿「对酌」 |  | interaction:complete |
| 第03日 13:21 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第03日 13:23 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 13:29 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 13:29 | 宝玉 | 被贾母发起互动：「打趣」 |  | interaction:started |
| 第03日 13:30 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 13:30 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture routine=afternoon_life |  | ai:decision |
| 第03日 13:31 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 13:31 | 宝玉 | 被刘姥姥发起互动：「对酌」 |  | interaction:started |
| 第03日 13:35 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 13:45 | 黛玉 | 行动入队：💬 评文·来旺 |  | queue:add |
| 第03日 13:45 | 黛玉 | AI选择：评文·来旺 [int:203:laiwang] provider=social routine=afternoon_life |  | ai:decision |
| 第03日 13:45 | 宝玉 | 被贾母发起互动：「对酌」 |  | interaction:started |
| 第03日 13:50 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 13:50 | 宝玉 | 被刘姥姥完成互动：「对酌」 |  | interaction:complete |
| 第03日 13:51 | 黛玉 | 被紫鹃发起互动：「对酌」 |  | interaction:started |
| 第03日 13:53 | 宝玉 | 被贾母发起互动：「调侃」 |  | interaction:started |
| 第03日 13:59 | 宝玉 | 被贾母完成互动：「调侃」 |  | interaction:complete |
| 第03日 14:00 | 黛玉 | 下发任务给紫鹃：陪黛玉读书 | 黛玉 | quest:issued |
| 第03日 14:00 | 黛玉 | 接受任务：陪黛玉读书 | 黛玉 | quest:accepted |
| 第03日 14:00 | 黛玉 | 开始任务：陪黛玉读书 | 黛玉 | quest:started |
| 第03日 14:00 | 宝玉 | 行动入队：🤝 品茗·凤姐 |  | queue:add |
| 第03日 14:00 | 宝玉 | AI每日主动社交计数：凤姐 3/10 |  | ai:daily_social_count |
| 第03日 14:00 | 宝玉 | 开始互动：与凤姐「品茗」 |  | interaction:started |
| 第03日 14:00 | 宝玉 | AI选择：品茗·凤姐 [int:104:xifeng] provider=social |  | ai:decision |
| 第03日 14:05 | 黛玉 | 完成任务：陪黛玉读书 | 黛玉 | quest:completed |
| 第03日 14:10 | 黛玉 | 被紫鹃完成互动：「对酌」 |  | interaction:complete |
| 第03日 14:11 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 14:11 | 黛玉 | AI选择：居家闲步 [w:home:11,28] provider=homeward routine=afternoon_life |  | ai:decision |
| 第03日 14:13 | 宝玉 | AI目标频控：凤姐 75分钟 |  | ai:social_target_cooldown |
| 第03日 14:13 | 宝玉 | 完成互动：与凤姐「品茗」 |  | interaction:complete |
| 第03日 14:15 | 宝玉 | 行动入队：🤝 对酌·大老爷 |  | queue:add |
| 第03日 14:15 | 宝玉 | AI选择：对酌·大老爷 [int:105:jiashe] provider=social |  | ai:decision |
| 第03日 14:15 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 14:15 | 黛玉 | AI选择：居家闲步 [w:home:3,29] provider=homeward routine=afternoon_life |  | ai:decision |
| 第03日 14:16 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 14:16 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 14:16 | 黛玉 | AI选择：闲游 [w:9,32] provider=wander routine=afternoon_life |  | ai:decision |
| 第03日 14:16 | 宝玉 | AI每日主动社交计数：大老爷 6/10 |  | ai:daily_social_count |
| 第03日 14:16 | 宝玉 | 开始互动：与大老爷「对酌」 |  | interaction:started |
| 第03日 14:30 | 黛玉 | 行动入队：💬 联句·紫鹃 |  | queue:add |
| 第03日 14:30 | 黛玉 | AI选择：联句·紫鹃 [int:204:zijuan] provider=social routine=afternoon_life |  | ai:decision |
| 第03日 14:30 | 宝玉 | 被大老爷发起互动：「品茗」 |  | interaction:started |
| 第03日 14:34 | 黛玉 | AI每日主动社交计数：紫鹃 1/10 |  | ai:daily_social_count |
| 第03日 14:34 | 黛玉 | 作息完成：下午作息 via=lundao |  | ai:routine_completed |
| 第03日 14:34 | 黛玉 | 开始互动：与紫鹃「联句」 |  | interaction:started |
| 第03日 14:35 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 14:35 | 宝玉 | 完成互动：与大老爷「对酌」 |  | interaction:complete |
| 第03日 14:41 | 黛玉 | AI目标频控：紫鹃 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 14:41 | 黛玉 | 完成互动：与紫鹃「联句」 |  | interaction:complete |
| 第03日 14:43 | 宝玉 | 被大老爷完成互动：「品茗」 |  | interaction:complete |
| 第03日 14:44 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 14:45 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 14:45 | 宝玉 | AI每日主动社交计数：刘姥姥 5/10 |  | ai:daily_social_count |
| 第03日 14:45 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 14:45 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 14:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 14:45 | 黛玉 | AI选择：闲游 [w:10,34] provider=wander |  | ai:decision |
| 第03日 14:45 | 宝玉 | 被宝钗发起互动：「调侃」 |  | interaction:started |
| 第03日 14:45 | 宝玉 | 被琏二爷发起互动：「品茗」 |  | interaction:started |
| 第03日 14:51 | 宝玉 | 被宝钗完成互动：「调侃」 |  | interaction:complete |
| 第03日 14:57 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 14:57 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第03日 15:00 | 宝玉 | 下发任务给麝月：备膳 | 宝玉 | quest:issued |
| 第03日 15:00 | 宝玉 | 接受任务：备膳 | 宝玉 | quest:accepted |
| 第03日 15:00 | 宝玉 | 行动入队：💬 寒暄·莺儿 |  | queue:add |
| 第03日 15:00 | 宝玉 | AI每日主动社交计数：莺儿 8/10 |  | ai:daily_social_count |
| 第03日 15:00 | 宝玉 | 开始互动：与莺儿「寒暄」 |  | interaction:started |
| 第03日 15:00 | 宝玉 | AI选择：寒暄·莺儿 [int:101:yinger] provider=social |  | ai:decision |
| 第03日 15:00 | 黛玉 | 行动入队：💬 联句·探春 |  | queue:add |
| 第03日 15:00 | 黛玉 | AI选择：联句·探春 [int:204:tanchun] provider=social |  | ai:decision |
| 第03日 15:00 | 宝玉 | 被琏二爷发起互动：「闲谈」 |  | interaction:started |
| 第03日 15:01 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 15:01 | 黛玉 | AI选择：居家闲步 [w:home:9,32] provider=homeward |  | ai:decision |
| 第03日 15:07 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 15:07 | 宝玉 | 完成互动：与莺儿「寒暄」 |  | interaction:complete |
| 第03日 15:15 | 宝玉 | 行动入队：🤝 对酌·宝钗 |  | queue:add |
| 第03日 15:15 | 宝玉 | AI每日主动社交计数：宝钗 5/10 |  | ai:daily_social_count |
| 第03日 15:15 | 宝玉 | 开始互动：与宝钗「对酌」 |  | interaction:started |
| 第03日 15:15 | 宝玉 | AI选择：对酌·宝钗 [int:105:baochai] provider=social |  | ai:decision |
| 第03日 15:15 | 黛玉 | 行动入队：💬 论禅·来旺 |  | queue:add |
| 第03日 15:15 | 黛玉 | AI选择：论禅·来旺 [int:205:laiwang] provider=social |  | ai:decision |
| 第03日 15:15 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第03日 15:15 | 宝玉 | 被刘姥姥发起互动：「调侃」 |  | interaction:started |
| 第03日 15:20 | 黛玉 | 开始任务：随侍黛玉 | 黛玉 | quest:started |
| 第03日 15:21 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第03日 15:21 | 宝玉 | 被刘姥姥完成互动：「调侃」 |  | interaction:complete |
| 第03日 15:30 | 宝玉 | 被贾母发起互动：「对酌」 |  | interaction:started |
| 第03日 15:33 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 15:33 | 宝玉 | 完成互动：与宝钗「对酌」 |  | interaction:complete |
| 第03日 15:45 | 宝玉 | 行动入队：💬 寒暄·凤姐 |  | queue:add |
| 第03日 15:45 | 宝玉 | AI选择：寒暄·凤姐 [int:101:xifeng] provider=social |  | ai:decision |
| 第03日 15:45 | 黛玉 | 行动入队：💬 评文·宝玉 |  | queue:add |
| 第03日 15:45 | 黛玉 | AI选择：评文·宝玉 [int:203:baoyu] provider=social |  | ai:decision |
| 第03日 15:46 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 15:46 | 黛玉 | AI选择：居家闲步 [w:home:11,28] provider=homeward |  | ai:decision |
| 第03日 15:46 | 宝玉 | AI每日主动社交计数：凤姐 4/10 |  | ai:daily_social_count |
| 第03日 15:46 | 宝玉 | 开始互动：与凤姐「寒暄」 |  | interaction:started |
| 第03日 15:49 | 宝玉 | 被贾母完成互动：「对酌」 |  | interaction:complete |
| 第03日 15:53 | 宝玉 | AI目标频控：凤姐 75分钟 |  | ai:social_target_cooldown |
| 第03日 15:53 | 宝玉 | 完成互动：与凤姐「寒暄」 |  | interaction:complete |
| 第03日 15:58 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 15:58 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 16:00 | 黛玉 | 下发任务给紫鹃：晨昏定省 | 黛玉 | quest:issued |
| 第03日 16:00 | 黛玉 | 接受任务：晨昏定省 | 黛玉 | quest:accepted |
| 第03日 16:00 | 宝玉 | 行动入队：💬 闲谈·大老爷 |  | queue:add |
| 第03日 16:00 | 宝玉 | AI每日主动社交计数：大老爷 7/10 |  | ai:daily_social_count |
| 第03日 16:00 | 宝玉 | 开始互动：与大老爷「闲谈」 |  | interaction:started |
| 第03日 16:00 | 宝玉 | AI选择：闲谈·大老爷 [int:102:jiashe] provider=social |  | ai:decision |
| 第03日 16:07 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:07 | 宝玉 | 完成互动：与大老爷「闲谈」 |  | interaction:complete |
| 第03日 16:15 | 宝玉 | 行动入队：💬 问安·刘姥姥 |  | queue:add |
| 第03日 16:15 | 宝玉 | AI选择：问安·刘姥姥 [int:103:liulaolao] provider=social |  | ai:decision |
| 第03日 16:15 | 宝玉 | 被大老爷发起互动：「揭短」 |  | interaction:started |
| 第03日 16:15 | 宝玉 | 被琏二爷发起互动：「问安」 |  | interaction:started |
| 第03日 16:17 | 宝玉 | AI每日主动社交计数：刘姥姥 6/10 |  | ai:daily_social_count |
| 第03日 16:17 | 宝玉 | 开始互动：与刘姥姥「问安」 |  | interaction:started |
| 第03日 16:21 | 宝玉 | 被大老爷完成互动：「揭短」 |  | interaction:complete |
| 第03日 16:23 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 16:25 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:25 | 宝玉 | 完成互动：与刘姥姥「问安」 |  | interaction:complete |
| 第03日 16:25 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 16:30 | 宝玉 | 行动入队：🤝 品茗·莺儿 |  | queue:add |
| 第03日 16:30 | 宝玉 | AI选择：品茗·莺儿 [int:104:yinger] provider=social |  | ai:decision |
| 第03日 16:30 | 黛玉 | 行动入队：💬 评文·探春 |  | queue:add |
| 第03日 16:30 | 黛玉 | AI选择：评文·探春 [int:203:tanchun] provider=social |  | ai:decision |
| 第03日 16:31 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 16:31 | 黛玉 | AI选择：居家闲步 [w:home:4,28] provider=homeward |  | ai:decision |
| 第03日 16:31 | 宝玉 | AI每日主动社交计数：莺儿 9/10 |  | ai:daily_social_count |
| 第03日 16:31 | 宝玉 | 开始互动：与莺儿「品茗」 |  | interaction:started |
| 第03日 16:39 | 宝玉 | 完成任务：备膳 | 宝玉 | quest:completed |
| 第03日 16:44 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 16:44 | 宝玉 | 完成互动：与莺儿「品茗」 |  | interaction:complete |
| 第03日 16:45 | 宝玉 | 行动入队：🤝 对酌·贾母 |  | queue:add |
| 第03日 16:45 | 宝玉 | AI选择：对酌·贾母 [int:105:jiamu] provider=social |  | ai:decision |
| 第03日 16:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 16:45 | 黛玉 | AI选择：闲游 [w:9,32] provider=wander |  | ai:decision |
| 第03日 16:45 | 宝玉 | 被莺儿发起互动：「问安」 |  | interaction:started |
| 第03日 16:45 | 宝玉 | AI每日主动社交计数：贾母 3/10 |  | ai:daily_social_count |
| 第03日 16:45 | 宝玉 | 开始互动：与贾母「对酌」 |  | interaction:started |
| 第03日 16:49 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 16:49 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 16:49 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 16:51 | 宝玉 | 被莺儿完成互动：「问安」 |  | interaction:complete |
| 第03日 16:53 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 17:00 | 黛玉 | 下发任务给雪雁：作诗陪吟 | 黛玉 | quest:issued |
| 第03日 17:00 | 黛玉 | 接受任务：作诗陪吟 | 黛玉 | quest:accepted |
| 第03日 17:00 | 全局 | 时段切换：黄昏 |  | time:period |
| 第03日 17:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 17:00 | 黛玉 | AI选择：居家闲步 [w:home:12,33] provider=homeward routine=dinner |  | ai:decision |
| 第03日 17:00 | 宝玉 | 被刘姥姥发起互动：「闲谈」 |  | interaction:started |
| 第03日 17:01 | 黛玉 | 行动入队：🎵 弹错走调 |  | queue:add |
| 第03日 17:01 | 黛玉 | AI选择：琴台·弹错走调 [furn:1006:wrong_note] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:04 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:04 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:04 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:04 | 宝玉 | 完成互动：与贾母「对酌」 |  | interaction:complete |
| 第03日 17:04 | 黛玉 | 被紫鹃发起互动：「品茗」 |  | interaction:started |
| 第03日 17:05 | 黛玉 | 开始任务：晨昏定省 | 黛玉 | quest:started |
| 第03日 17:08 | 宝玉 | 被贾母发起互动：「嬉闹」 |  | interaction:started |
| 第03日 17:15 | 宝玉 | 被刘姥姥发起互动：「调侃」 |  | interaction:started |
| 第03日 17:17 | 黛玉 | 完成任务：晨昏定省 | 黛玉 | quest:completed |
| 第03日 17:17 | 黛玉 | 被紫鹃完成互动：「品茗」 |  | interaction:complete |
| 第03日 17:18 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:18 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:19 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:19 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:21 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:21 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:21 | 宝玉 | 被刘姥姥完成互动：「调侃」 |  | interaction:complete |
| 第03日 17:22 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:22 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:23 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:23 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:23 | 宝玉 | 被贾母完成互动：「嬉闹」 |  | interaction:complete |
| 第03日 17:24 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:24 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:25 | 黛玉 | 行动入队：🍚 挑食抱怨 |  | queue:add |
| 第03日 17:25 | 黛玉 | AI选择：饭桌·挑食抱怨 [furn:1007:complain_food] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:26 | 黛玉 | 作息完成：晚餐 via=meal |  | ai:routine_completed |
| 第03日 17:26 | 黛玉 | 开始用家具：饭桌 / complain_food |  | furniture:use_started |
| 第03日 17:27 | 黛玉 | 行动入队：💬 论禅·紫鹃 |  | queue:add |
| 第03日 17:27 | 黛玉 | AI选择：论禅·紫鹃 [int:205:zijuan] provider=social |  | ai:decision |
| 第03日 17:30 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 17:30 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture routine=dinner |  | ai:decision |
| 第03日 17:34 | 宝玉 | 作息完成：晚餐 via=kitchen |  | ai:routine_completed |
| 第03日 17:34 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 17:35 | 宝玉 | 行动入队：💬 寒暄·凤姐 |  | queue:add |
| 第03日 17:35 | 宝玉 | AI选择：寒暄·凤姐 [int:101:xifeng] provider=social |  | ai:decision |
| 第03日 17:37 | 宝玉 | AI每日主动社交计数：凤姐 5/10 |  | ai:daily_social_count |
| 第03日 17:37 | 宝玉 | 开始互动：与凤姐「寒暄」 |  | interaction:started |
| 第03日 17:39 | 黛玉 | AI每日主动社交计数：紫鹃 2/10 |  | ai:daily_social_count |
| 第03日 17:39 | 黛玉 | 开始互动：与紫鹃「论禅」 |  | interaction:started |
| 第03日 17:44 | 宝玉 | AI目标频控：凤姐 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:44 | 宝玉 | 完成互动：与凤姐「寒暄」 |  | interaction:complete |
| 第03日 17:45 | 宝玉 | 行动入队：🤝 对酌·大老爷 |  | queue:add |
| 第03日 17:45 | 宝玉 | AI选择：对酌·大老爷 [int:105:jiashe] provider=social |  | ai:decision |
| 第03日 17:45 | 宝玉 | 被凤姐发起互动：「闲谈」 |  | interaction:started |
| 第03日 17:46 | 宝玉 | AI每日主动社交计数：大老爷 8/10 |  | ai:daily_social_count |
| 第03日 17:46 | 宝玉 | 开始互动：与大老爷「对酌」 |  | interaction:started |
| 第03日 17:46 | 黛玉 | AI目标频控：紫鹃 75分钟 |  | ai:social_target_cooldown |
| 第03日 17:46 | 黛玉 | 完成互动：与紫鹃「论禅」 |  | interaction:complete |
| 第03日 18:00 | 宝玉 | 下发任务给晴雯：晨昏定省 | 宝玉 | quest:issued |
| 第03日 18:00 | 宝玉 | 接受任务：晨昏定省 | 宝玉 | quest:accepted |
| 第03日 18:00 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 18:00 | 黛玉 | AI选择：居家闲步 [w:home:14,32] provider=homeward |  | ai:decision |
| 第03日 18:00 | 宝玉 | 被大老爷发起互动：「打趣」 |  | interaction:started |
| 第03日 18:01 | 黛玉 | 任务失败：随侍黛玉，超时 | 黛玉 | quest:failed |
| 第03日 18:04 | 黛玉 | 被雪雁发起互动：「寒暄」 |  | interaction:started |
| 第03日 18:05 | 黛玉 | 开始任务：作诗陪吟 | 黛玉 | quest:started |
| 第03日 18:05 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:05 | 宝玉 | 完成互动：与大老爷「对酌」 |  | interaction:complete |
| 第03日 18:07 | 宝玉 | 被大老爷完成互动：「打趣」 |  | interaction:complete |
| 第03日 18:11 | 黛玉 | 被雪雁完成互动：「寒暄」 |  | interaction:complete |
| 第03日 18:15 | 宝玉 | 行动入队：💬 寒暄·刘姥姥 |  | queue:add |
| 第03日 18:15 | 宝玉 | AI选择：寒暄·刘姥姥 [int:101:liulaolao] provider=social |  | ai:decision |
| 第03日 18:15 | 宝玉 | 被宝钗发起互动：「调侃」 |  | interaction:started |
| 第03日 18:15 | 宝玉 | 被莺儿发起互动：「闲谈」 |  | interaction:started |
| 第03日 18:20 | 黛玉 | 行动入队：💬 联句·雪雁 |  | queue:add |
| 第03日 18:20 | 黛玉 | AI选择：联句·雪雁 [int:204:xueyan] provider=social |  | ai:decision |
| 第03日 18:21 | 宝玉 | 被宝钗完成互动：「调侃」 |  | interaction:complete |
| 第03日 18:21 | 宝玉 | 被莺儿完成互动：「闲谈」 |  | interaction:complete |
| 第03日 18:22 | 宝玉 | AI每日主动社交计数：刘姥姥 7/10 |  | ai:daily_social_count |
| 第03日 18:22 | 宝玉 | 开始互动：与刘姥姥「寒暄」 |  | interaction:started |
| 第03日 18:26 | 黛玉 | AI每日主动社交计数：雪雁 1/10 |  | ai:daily_social_count |
| 第03日 18:26 | 黛玉 | 开始互动：与雪雁「联句」 |  | interaction:started |
| 第03日 18:29 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:29 | 宝玉 | 完成互动：与刘姥姥「寒暄」 |  | interaction:complete |
| 第03日 18:30 | 宝玉 | 行动入队：💬 闲谈·莺儿 |  | queue:add |
| 第03日 18:30 | 宝玉 | AI选择：闲谈·莺儿 [int:102:yinger] provider=social |  | ai:decision |
| 第03日 18:30 | 宝玉 | 被探春发起互动：「品茗」 |  | interaction:started |
| 第03日 18:33 | 黛玉 | AI目标频控：雪雁 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:33 | 黛玉 | 完成互动：与雪雁「联句」 |  | interaction:complete |
| 第03日 18:35 | 宝玉 | AI每日主动社交计数：莺儿 10/10 |  | ai:daily_social_count |
| 第03日 18:35 | 宝玉 | 开始互动：与莺儿「闲谈」 |  | interaction:started |
| 第03日 18:43 | 宝玉 | AI目标频控：莺儿 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:43 | 宝玉 | 完成互动：与莺儿「闲谈」 |  | interaction:complete |
| 第03日 18:45 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第03日 18:45 | 宝玉 | AI每日主动社交计数：宝钗 6/10 |  | ai:daily_social_count |
| 第03日 18:45 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第03日 18:45 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第03日 18:45 | 黛玉 | 行动入队：前往潇湘馆 |  | queue:add |
| 第03日 18:45 | 黛玉 | AI选择：居家闲步 [w:home:7,31] provider=homeward |  | ai:decision |
| 第03日 18:45 | 宝玉 | 被探春发起互动：「问安」 |  | interaction:started |
| 第03日 18:45 | 宝玉 | 被贾母发起互动：「闲谈」 |  | interaction:started |
| 第03日 18:45 | 宝玉 | 被刘姥姥发起互动：「打趣」 |  | interaction:started |
| 第03日 18:51 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 18:51 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第03日 18:52 | 宝玉 | 被贾母完成互动：「闲谈」 |  | interaction:complete |
| 第03日 18:52 | 宝玉 | 被刘姥姥完成互动：「打趣」 |  | interaction:complete |
| 第03日 19:00 | 宝玉 | 行动入队：💬 寒暄·探春 |  | queue:add |
| 第03日 19:00 | 宝玉 | AI每日主动社交计数：探春 2/10 |  | ai:daily_social_count |
| 第03日 19:00 | 宝玉 | 作息完成：晚间作息 via=xujiu |  | ai:routine_completed |
| 第03日 19:00 | 宝玉 | 开始互动：与探春「寒暄」 |  | interaction:started |
| 第03日 19:00 | 宝玉 | AI选择：寒暄·探春 [int:101:tanchun] provider=social routine=evening_social |  | ai:decision |
| 第03日 19:00 | 黛玉 | 行动入队：💬 论禅·麝月 |  | queue:add |
| 第03日 19:00 | 黛玉 | AI选择：论禅·麝月 [int:205:sheyue] provider=social routine=evening_social |  | ai:decision |
| 第03日 19:00 | 黛玉 | 被紫鹃发起互动：「对酌」 |  | interaction:started |
| 第03日 19:01 | 宝玉 | 任务失败：随侍左右，超时 | 宝玉 | quest:failed |
| 第03日 19:07 | 宝玉 | AI目标频控：探春 75分钟 |  | ai:social_target_cooldown |
| 第03日 19:07 | 宝玉 | 完成互动：与探春「寒暄」 |  | interaction:complete |
| 第03日 19:15 | 宝玉 | 行动入队：💬 寒暄·麝月 |  | queue:add |
| 第03日 19:15 | 宝玉 | AI选择：寒暄·麝月 [int:101:sheyue] provider=social |  | ai:decision |
| 第03日 19:15 | 宝玉 | 被探春发起互动：「对弈」 |  | interaction:started |
| 第03日 19:19 | 黛玉 | 被紫鹃完成互动：「对酌」 |  | interaction:complete |
| 第03日 19:20 | 宝玉 | AI每日主动社交计数：麝月 1/10 |  | ai:daily_social_count |
| 第03日 19:20 | 宝玉 | 开始互动：与麝月「寒暄」 |  | interaction:started |
| 第03日 19:21 | 黛玉 | 行动入队：💬 论禅·宝玉 |  | queue:add |
| 第03日 19:21 | 黛玉 | AI选择：论禅·宝玉 [int:205:baoyu] provider=social routine=evening_social |  | ai:decision |
| 第03日 19:27 | 宝玉 | AI目标频控：麝月 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 19:27 | 宝玉 | 完成互动：与麝月「寒暄」 |  | interaction:complete |
| 第03日 19:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:30 | 宝玉 | 行动入队：💬 问安·大老爷 |  | queue:add |
| 第03日 19:30 | 宝玉 | AI选择：问安·大老爷 [int:103:jiashe] provider=social |  | ai:decision |
| 第03日 19:30 | 宝玉 | 被琏二爷发起互动：「问安」 |  | interaction:started |
| 第03日 19:33 | 宝玉 | 被大老爷发起互动：「品茗」 |  | interaction:started |
| 第03日 19:34 | 宝玉 | 被晴雯发起互动：「闲谈」 |  | interaction:started |
| 第03日 19:35 | 宝玉 | 开始任务：晨昏定省 | 宝玉 | quest:started |
| 第03日 19:37 | 宝玉 | 被琏二爷完成互动：「问安」 |  | interaction:complete |
| 第03日 19:40 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 19:40 | 宝玉 | 完成任务：晨昏定省 | 宝玉 | quest:completed |
| 第03日 19:40 | 宝玉 | 被晴雯完成互动：「闲谈」 |  | interaction:complete |
| 第03日 19:41 | 宝玉 | AI每日主动社交计数：大老爷 9/10 |  | ai:daily_social_count |
| 第03日 19:41 | 宝玉 | 开始互动：与大老爷「问安」 |  | interaction:started |
| 第03日 19:42 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:42 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:43 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:43 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:43 | 宝玉 | 被政老爷发起互动：「品茗」 |  | interaction:started |
| 第03日 19:44 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:44 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 19:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 19:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 19:46 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 19:46 | 宝玉 | 被大老爷完成互动：「品茗」 |  | interaction:complete |
| 第03日 19:47 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 19:49 | 宝玉 | AI目标频控：大老爷 75分钟 |  | ai:social_target_cooldown |
| 第03日 19:49 | 宝玉 | 完成互动：与大老爷「问安」 |  | interaction:complete |
| 第03日 19:50 | 宝玉 | 被政老爷发起互动：「倾听」 |  | interaction:started |
| 第03日 19:56 | 宝玉 | 完成任务：晨昏定省 | 政老爷 | quest:completed |
| 第03日 19:56 | 宝玉 | 被政老爷完成互动：「倾听」 |  | interaction:complete |
| 第03日 19:56 | 宝玉 | 被珍大爷发起互动：「闲谈」 |  | interaction:started |
| 第03日 20:00 | 宝玉 | 下发任务给袭人：伺候就寝 | 宝玉 | quest:issued |
| 第03日 20:00 | 宝玉 | 接受任务：伺候就寝 | 宝玉 | quest:accepted |
| 第03日 20:00 | 黛玉 | 任务下发：训诫 | 政老爷 | quest:issued |
| 第03日 20:00 | 黛玉 | 接受任务：训诫 | 政老爷 | quest:accepted |
| 第03日 20:00 | 黛玉 | 行动入队：🤝 对弈·紫鹃 |  | queue:add |
| 第03日 20:00 | 黛玉 | AI选择：对弈·紫鹃 [int:202:zijuan] provider=social routine=evening_social |  | ai:decision |
| 第03日 20:00 | 宝玉 | 被莺儿发起互动：「对酌」 |  | interaction:started |
| 第03日 20:03 | 宝玉 | 被珍大爷完成互动：「闲谈」 |  | interaction:complete |
| 第03日 20:08 | 宝玉 | 被凤姐发起互动：「对酌」 |  | interaction:started |
| 第03日 20:15 | 黛玉 | AI每日主动社交计数：紫鹃 3/10 |  | ai:daily_social_count |
| 第03日 20:15 | 黛玉 | 作息完成：晚间作息 via=lundao |  | ai:routine_completed |
| 第03日 20:15 | 黛玉 | 开始互动：与紫鹃「对弈」 |  | interaction:started |
| 第03日 20:19 | 宝玉 | 被莺儿完成互动：「对酌」 |  | interaction:complete |
| 第03日 20:27 | 宝玉 | 被凤姐完成互动：「对酌」 |  | interaction:complete |
| 第03日 20:30 | 宝玉 | 行动入队：🤝 品茗·刘姥姥 |  | queue:add |
| 第03日 20:30 | 宝玉 | AI选择：品茗·刘姥姥 [int:104:liulaolao] provider=social |  | ai:decision |
| 第03日 20:31 | 宝玉 | AI每日主动社交计数：刘姥姥 8/10 |  | ai:daily_social_count |
| 第03日 20:31 | 宝玉 | 开始互动：与刘姥姥「品茗」 |  | interaction:started |
| 第03日 20:33 | 黛玉 | AI目标频控：紫鹃 120分钟（跨房间） |  | ai:social_target_cooldown |
| 第03日 20:33 | 黛玉 | 完成互动：与紫鹃「对弈」 |  | interaction:complete |
| 第03日 20:37 | 宝玉 | 被王夫人发起互动：「寒暄」 |  | interaction:started |
| 第03日 20:38 | 宝玉 | 被刘姥姥发起互动：「寒暄」 |  | interaction:started |
| 第03日 20:43 | 宝玉 | 被湘云发起互动：「品茗」 |  | interaction:started |
| 第03日 20:44 | 宝玉 | AI目标频控：刘姥姥 75分钟 |  | ai:social_target_cooldown |
| 第03日 20:44 | 宝玉 | 完成互动：与刘姥姥「品茗」 |  | interaction:complete |
| 第03日 20:44 | 宝玉 | 被王夫人完成互动：「寒暄」 |  | interaction:complete |
| 第03日 20:45 | 宝玉 | 行动入队：💬 寒暄·宝钗 |  | queue:add |
| 第03日 20:45 | 宝玉 | AI每日主动社交计数：宝钗 7/10 |  | ai:daily_social_count |
| 第03日 20:45 | 宝玉 | 开始互动：与宝钗「寒暄」 |  | interaction:started |
| 第03日 20:45 | 宝玉 | AI选择：寒暄·宝钗 [int:101:baochai] provider=social |  | ai:decision |
| 第03日 20:45 | 黛玉 | 行动入队：💬 评文·宝玉 |  | queue:add |
| 第03日 20:45 | 黛玉 | AI选择：评文·宝玉 [int:203:baoyu] provider=social |  | ai:decision |
| 第03日 20:45 | 宝玉 | 被刘姥姥完成互动：「寒暄」 |  | interaction:complete |
| 第03日 20:51 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 20:51 | 宝玉 | 完成互动：与宝钗「寒暄」 |  | interaction:complete |
| 第03日 20:56 | 宝玉 | 被湘云完成互动：「品茗」 |  | interaction:complete |
| 第03日 21:00 | 全局 | 时段切换：夜 |  | time:period |
| 第03日 21:00 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 21:00 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 21:00 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 21:00 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 21:00 | 宝玉 | 被贾母发起互动：「倾听」 |  | interaction:started |
| 第03日 21:01 | 黛玉 | 任务失败：作诗陪吟，超时 | 黛玉 | quest:failed |
| 第03日 21:01 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 21:07 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 21:07 | 宝玉 | 被贾母完成互动：「倾听」 |  | interaction:complete |
| 第03日 21:08 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 21:08 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 21:09 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 21:09 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 21:09 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 21:10 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 21:10 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 21:10 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 21:13 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第03日 21:15 | 宝玉 | 行动入队：💬 评文·大老爷 |  | queue:add |
| 第03日 21:15 | 宝玉 | AI每日主动社交计数：大老爷 10/10 |  | ai:daily_social_count |
| 第03日 21:15 | 宝玉 | 开始互动：与大老爷「评文」 |  | interaction:started |
| 第03日 21:15 | 宝玉 | AI选择：评文·大老爷 [int:203:jiashe] provider=social |  | ai:decision |
| 第03日 21:16 | 宝玉 | 行动入队：💬 打趣·贾母 |  | queue:add |
| 第03日 21:16 | 宝玉 | AI选择：打趣·贾母 [int:301:jiamu] provider=social |  | ai:decision |
| 第03日 21:16 | 宝玉 | AI每日主动社交计数：贾母 4/10 |  | ai:daily_social_count |
| 第03日 21:16 | 宝玉 | 开始互动：与贾母「打趣」 |  | interaction:started |
| 第03日 21:20 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 21:23 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 21:23 | 宝玉 | 完成互动：与贾母「打趣」 |  | interaction:complete |
| 第03日 21:23 | 黛玉 | 完成用家具：雕花木床 / default_use |  | furniture:complete |
| 第03日 21:30 | 宝玉 | 行动入队：💬 论禅·珍大爷 |  | queue:add |
| 第03日 21:30 | 宝玉 | AI选择：论禅·珍大爷 [int:205:jiazhen] provider=social |  | ai:decision |
| 第03日 21:30 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:30 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:34 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:34 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:36 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:36 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:39 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:39 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:40 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:40 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:40 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 21:41 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:41 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 21:41 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:41 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 21:41 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第03日 21:45 | 黛玉 | 行动入队：💬 论禅·王夫人 |  | queue:add |
| 第03日 21:45 | 黛玉 | AI选择：论禅·王夫人 [int:205:wangfuren] provider=social |  | ai:decision |
| 第03日 21:45 | 宝玉 | 被大老爷发起互动：「揭短」 |  | interaction:started |
| 第03日 21:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:46 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 21:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 21:47 | 黛玉 | 开始用家具：点心案 / default_use |  | furniture:use_started |
| 第03日 21:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 21:47 | 黛玉 | 完成用家具：点心案 / default_use |  | furniture:complete |
| 第03日 21:49 | 宝玉 | 被莺儿完成互动：「倾听」 |  | interaction:complete |
| 第03日 21:51 | 宝玉 | 被大老爷完成互动：「揭短」 |  | interaction:complete |
| 第03日 21:58 | 黛玉 | 被紫鹃发起互动：「倾听」 |  | interaction:started |
| 第03日 22:00 | 宝玉 | 行动入队：🧼 在铜面盆 |  | queue:add |
| 第03日 22:00 | 宝玉 | AI选择：铜面盆·使用铜面盆 [furn:2008:default_use] provider=furniture |  | ai:decision |
| 第03日 22:01 | 黛玉 | 任务失败：训诫，超时 | 政老爷 | quest:failed |
| 第03日 22:01 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:01 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:05 | 黛玉 | 被紫鹃完成互动：「倾听」 |  | interaction:complete |
| 第03日 22:15 | 宝玉 | 行动入队：🤝 对弈·宝钗 |  | queue:add |
| 第03日 22:15 | 宝玉 | AI选择：对弈·宝钗 [int:202:baochai] provider=social |  | ai:decision |
| 第03日 22:15 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 22:15 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 22:15 | 宝玉 | AI每日主动社交计数：宝钗 8/10 |  | ai:daily_social_count |
| 第03日 22:15 | 宝玉 | 开始互动：与宝钗「对弈」 |  | interaction:started |
| 第03日 22:23 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 22:27 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 22:30 | 黛玉 | 行动入队：💬 辩理·琏二爷 |  | queue:add |
| 第03日 22:30 | 黛玉 | AI选择：辩理·琏二爷 [int:201:jialian] provider=social |  | ai:decision |
| 第03日 22:30 | 宝玉 | 被贾母发起互动：「倾听」 |  | interaction:started |
| 第03日 22:31 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:31 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:31 | 黛玉 | 开始用家具：雕花木床 / default_use |  | furniture:use_started |
| 第03日 22:32 | 宝玉 | 被宝钗发起互动：「倾听」 |  | interaction:started |
| 第03日 22:33 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 22:33 | 宝玉 | 完成互动：与宝钗「对弈」 |  | interaction:complete |
| 第03日 22:37 | 宝玉 | 被政老爷发起互动：「倾听」 |  | interaction:started |
| 第03日 22:37 | 宝玉 | 被贾母完成互动：「倾听」 |  | interaction:complete |
| 第03日 22:38 | 宝玉 | 被宝钗完成互动：「倾听」 |  | interaction:complete |
| 第03日 22:44 | 宝玉 | 被政老爷完成互动：「倾听」 |  | interaction:complete |
| 第03日 22:45 | 宝玉 | 行动入队：💬 评文·贾母 |  | queue:add |
| 第03日 22:45 | 宝玉 | AI每日主动社交计数：贾母 5/10 |  | ai:daily_social_count |
| 第03日 22:45 | 宝玉 | 开始互动：与贾母「评文」 |  | interaction:started |
| 第03日 22:45 | 宝玉 | AI选择：评文·贾母 [int:203:jiamu] provider=social |  | ai:decision |
| 第03日 22:45 | 黛玉 | 行动入队：📚 抄写诗文 |  | queue:add |
| 第03日 22:45 | 黛玉 | AI选择：红木书案·抄写诗文 [furn:7002:copy_poetry] provider=furniture |  | ai:decision |
| 第03日 22:48 | 黛玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 22:48 | 黛玉 | AI选择：雕花木床·使用雕花木床 [furn:1001:default_use] provider=furniture |  | ai:decision |
| 第03日 22:51 | 宝玉 | AI目标频控：贾母 75分钟 |  | ai:social_target_cooldown |
| 第03日 22:51 | 宝玉 | 完成互动：与贾母「评文」 |  | interaction:complete |
| 第03日 23:00 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 23:00 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 23:00 | 黛玉 | 行动入队：🤝 对弈·探春 |  | queue:add |
| 第03日 23:00 | 黛玉 | AI选择：对弈·探春 [int:202:tanchun] provider=social |  | ai:decision |
| 第03日 23:01 | 宝玉 | 任务失败：伺候就寝，超时 | 宝玉 | quest:failed |
| 第03日 23:01 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 23:02 | 宝玉 | 行动入队：🛁 在浴盆 |  | queue:add |
| 第03日 23:02 | 宝玉 | AI选择：浴盆·使用浴盆 [furn:2004:default_use] provider=furniture |  | ai:decision |
| 第03日 23:03 | 宝玉 | 开始用家具：浴盆 / default_use |  | furniture:use_started |
| 第03日 23:05 | 黛玉 | 行动入队：🤝 对弈·宝玉 |  | queue:add |
| 第03日 23:05 | 黛玉 | AI选择：对弈·宝玉 [int:202:baoyu] provider=social |  | ai:decision |
| 第03日 23:05 | 宝玉 | 完成用家具：浴盆 / default_use |  | furniture:complete |
| 第03日 23:15 | 宝玉 | 行动入队：🔥 在厨房灶台 |  | queue:add |
| 第03日 23:15 | 宝玉 | AI选择：厨房灶台·使用厨房灶台 [furn:2006:default_use] provider=furniture |  | ai:decision |
| 第03日 23:15 | 宝玉 | 被大老爷发起互动：「倾听」 |  | interaction:started |
| 第03日 23:17 | 黛玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 23:17 | 黛玉 | AI选择：樟木案几·使用樟木案几 [furn:1012:default_use] provider=furniture |  | ai:decision |
| 第03日 23:22 | 宝玉 | 被大老爷完成互动：「倾听」 |  | interaction:complete |
| 第03日 23:26 | 宝玉 | 开始用家具：厨房灶台 / default_use |  | furniture:use_started |
| 第03日 23:28 | 黛玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 23:29 | 宝玉 | 完成用家具：厨房灶台 / default_use |  | furniture:complete |
| 第03日 23:30 | 宝玉 | 行动入队：💬 辩理·珍大爷 |  | queue:add |
| 第03日 23:30 | 宝玉 | AI选择：辩理·珍大爷 [int:201:jiazhen] provider=social |  | ai:decision |
| 第03日 23:31 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第03日 23:31 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture |  | ai:decision |
| 第03日 23:31 | 黛玉 | 完成用家具：樟木案几 / default_use |  | furniture:complete |
| 第03日 23:45 | 宝玉 | 行动入队：📋 在樟木案几 |  | queue:add |
| 第03日 23:45 | 宝玉 | AI选择：樟木案几·使用樟木案几 [furn:2010:default_use] provider=furniture |  | ai:decision |
| 第03日 23:45 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:45 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:45 | 宝玉 | 开始用家具：樟木案几 / default_use |  | furniture:use_started |
| 第03日 23:46 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:46 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:47 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:47 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:48 | 宝玉 | 行动入队：💬 评文·宝钗 |  | queue:add |
| 第03日 23:48 | 宝玉 | AI选择：评文·宝钗 [int:203:baochai] provider=social |  | ai:decision |
| 第03日 23:48 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:48 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:49 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:49 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:49 | 宝玉 | AI每日主动社交计数：宝钗 9/10 |  | ai:daily_social_count |
| 第03日 23:49 | 宝玉 | 开始互动：与宝钗「评文」 |  | interaction:started |
| 第03日 23:50 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:50 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:52 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:52 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:54 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:54 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:55 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:55 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:56 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:56 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:56 | 宝玉 | AI目标频控：宝钗 75分钟 |  | ai:social_target_cooldown |
| 第03日 23:56 | 宝玉 | 完成互动：与宝钗「评文」 |  | interaction:complete |
| 第03日 23:57 | 黛玉 | 行动入队：🥟 在点心案 |  | queue:add |
| 第03日 23:57 | 黛玉 | AI选择：点心案·使用点心案 [furn:1011:default_use] provider=furniture |  | ai:decision |
| 第03日 23:58 | 黛玉 | 行动入队：💬 联句·紫鹃 |  | queue:add |
| 第03日 23:58 | 黛玉 | AI选择：联句·紫鹃 [int:204:zijuan] provider=social |  | ai:decision |
| 第04日 00:00 | 全局 | 进入第4日 |  | time:day |
| 第04日 00:00 | 全局 | 时段切换：拂晓 |  | time:period |
| 第04日 00:00 | 宝玉 | 行动入队：🛏️ 在雕花木床 |  | queue:add |
| 第04日 00:00 | 宝玉 | AI选择：雕花木床·使用雕花木床 [furn:7001:default_use] provider=furniture routine=night_sleep |  | ai:decision |
| 第04日 00:00 | 宝玉 | 被莺儿发起互动：「倾听」 |  | interaction:started |
| 第04日 00:00 | 宝玉 | 被贾母发起互动：「倾听」 |  | interaction:started |

## 原始事件计数

| 事件 | 次数 |
|---|---:|
| state:add | 18466 |
| state:remove | 18358 |
| need:band_changed | 15318 |
| log:add | 11444 |
| ai:state | 8329 |
| ai:decision | 5093 |
| queue:add | 5081 |
| time:tick | 3841 |
| need:combination_triggered | 2281 |
| character:effect | 2224 |
| scene:entered | 1680 |
| scene:enter:allowed | 1679 |
| relation:axis_change | 1607 |
| emotion:resisted | 1606 |
| furniture:use_started | 1064 |
| furniture:released | 1056 |
| ai:candidate_rejected | 786 |
| quest:progress | 775 |
| ai:daily_social_count | 732 |
| interaction:started | 732 |
| furniture:complete | 682 |
| interaction:effects | 667 |
| ai:social_target_cooldown | 667 |
| interaction:complete | 667 |
| quest:candidate | 602 |
| emotion:contagion | 442 |
| save:done | 407 |
| ai:routine_completed | 381 |
| relation:change | 317 |
| interaction:state | 290 |
| interaction:lowscore | 284 |
| family:fund_changed | 180 |
| quest:blocked | 175 |
| economy:food_paid | 169 |
| furniture:reaction | 103 |
| quest:started | 95 |
| servant:follow_state | 92 |
| observer:triggered | 81 |
| observer:executed | 81 |
| state:refresh | 79 |
| time:hour | 64 |
| quest:issued | 60 |
| quest:accepted | 60 |
| need:critical | 60 |
| trait:competition | 59 |
| quest:completed | 33 |
| quest:failed | 27 |
| servant:relation_changed | 27 |
| relation:threshold | 17 |
| invitation:sent | 16 |
| access:granted | 16 |
| invitation:expired | 16 |
| reputation:change | 15 |
| money:change | 14 |
| trait:spending | 14 |
| time:period | 14 |
| queue:failed | 12 |
| invitation:accepted | 9 |
| economy:shift_started | 8 |
| economy:shift_ended | 8 |
| invitation:declined | 7 |
| quest:acceptance_checked | 7 |
| servant:duty_issued | 6 |
| lifePath:storyNode | 5 |
| servant:follow_rotation_issued | 4 |
| time:day | 3 |
| family:event | 2 |
| court | 2 |
| emotion:chain_end | 1 |
| money:family | 1 |
| quest:primed_action | 1 |
| need:crisis | 1 |
