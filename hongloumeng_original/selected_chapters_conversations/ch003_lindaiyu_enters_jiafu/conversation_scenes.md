# Conversation Scenes

## 黛玉进荣国府：以观察学习礼法
- id: `ch003_scene_entrance_etiquette`
- type: `arrival_etiquette`
- canon_mode: 剧情必经
- participants: 林黛玉、贾母、邢夫人、王夫人、李纨、迎春、探春、惜春、众仆从

surface_event: 黛玉从西角门入荣国府，拜见贾母和内宅女眷。

hidden_intents:
- 林黛玉: 确认自己在贾府的位置，少说少错，避免被耻笑。
- 贾母: 用公开怜爱确认黛玉的家族身份。
- 众仆从: 通过迎接、打帘、座次展示贾府秩序。

beats:
- 黛玉在轿中观察门第和仆从规格。
- 贾母抱住黛玉痛哭，亲情压过礼法。
- 贾母逐一介绍舅母、嫂子和三春。
- 黛玉以少言、见礼、答问完成第一次身份落位。

player_choice_strategies: 谨慎行礼 / 主动亲近 / 沉默观察 / 多问规矩

freeplay_hooks: 新客入府 / 长辈公开偏爱 / 随侍提醒礼法 / 座次试探

## 王熙凤出场：热络奉承与管家控场
- id: `ch003_scene_xifeng_entrance`
- type: `social_control`
- canon_mode: 剧情必经
- participants: 王熙凤、林黛玉、贾母、王夫人、众姊妹、丫鬟婆子

surface_event: 凤姐笑语未到先闻，夸黛玉、哄贾母，同时安排房间和物件。

hidden_intents:
- 王熙凤: 在贾母面前表演亲热能干，确认自己内宅调度权。
- 林黛玉: 判断凤姐身份和危险程度。
- 贾母: 借玩笑认可凤姐的泼辣和亲密地位。

beats:
- 凤姐先以笑声打破满室敛声屏气。
- 外貌与服饰压出强烈权力信号。
- 凤姐夸黛玉像嫡亲孙女，顺手安抚贾母。
- 凤姐询问行李人数并命人打扫屋子。

player_choice_strategies: 顺势陪笑 / 礼貌疏离 / 观察不接话 / 请求照应

freeplay_hooks: 管家型 NPC 首次接触 / 公开奉承 / 长辈前控场 / 分配房舍/物资

## 宝黛初见：似曾相识与摔玉
- id: `ch003_scene_baodai_first_meeting`
- type: `fated_intimacy_conflict`
- canon_mode: 剧情必经
- participants: 贾宝玉、林黛玉、贾母、探春、众人

surface_event: 宝玉与黛玉互觉眼熟，宝玉问玉，听黛玉无玉后摔通灵玉。

hidden_intents:
- 贾宝玉: 用玉确认亲密同类，拒绝被特殊物件隔开。
- 林黛玉: 谨慎回答，不愿夸张或越礼。
- 贾母: 立刻用谎言圆场，保护宝玉和黛玉的情绪。

beats:
- 黛玉觉得宝玉眼熟，宝玉也说曾见过这个妹妹。
- 宝玉给黛玉取字颦颦，显示亲密越界。
- 宝玉问黛玉有没有玉。
- 黛玉说没有，宝玉摔玉，贾母哄回。

player_choice_strategies: 亲昵称赞 / 守礼后退 / 追问玉 / 安抚失控 / 请长辈介入

freeplay_hooks: 信物触发争执 / 第一次亲密越礼 / 长辈替晚辈圆谎 / 同类确认失败

## 袭人夜慰黛玉：解释宝玉的怪癖
- id: `ch003_scene_xiren_comforts_daiyu`
- type: `servant_mediation`
- canon_mode: 剧情可播放
- participants: 袭人、林黛玉、鹦哥、贾宝玉

surface_event: 黛玉因宝玉摔玉自责，袭人夜间劝慰她别多心。

hidden_intents:
- 袭人: 安抚新来的林姑娘，也维护宝玉。
- 林黛玉: 害怕自己刚来就惹祸。
- 鹦哥: 替黛玉说出不便直说的自责。

beats:
- 袭人问黛玉为何不睡。
- 鹦哥代述黛玉伤心原因。
- 袭人说明宝玉将来怪事还多。
- 黛玉接受劝告。

player_choice_strategies: 温和解释 / 替主子担责 / 劝别多心 / 留出体面

freeplay_hooks: 丫鬟解释主子失礼 / 夜间私谈 / 新客情绪安抚
