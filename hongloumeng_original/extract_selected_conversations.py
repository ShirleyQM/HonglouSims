from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WORKSPACE = ROOT.parent
SOURCE_DIR = WORKSPACE / "hongloumeng-txt" / "output"
OUT = ROOT / "selected_chapters_conversations"


CHAPTERS = {
    "ch003_lindaiyu_enters_jiafu": {
        "chapter_no": 3,
        "title": "第三回 托内兄如海荐西宾　接外孙贾母惜孤女",
        "file": "《红楼梦》 第三回 托内兄如海荐西宾　接外孙贾母惜孤女.txt",
    },
    "ch017_grand_view_garden_inscriptions": {
        "chapter_no": 17,
        "title": "第十七回 大观园试才题对额　荣国府归省庆元宵",
        "file": "《红楼梦》 第十七回 大观园试才题对额　荣国府归省庆元宵.txt",
    },
    "ch029_qingxu_temple_baodai_quarrel": {
        "chapter_no": 29,
        "title": "第二十九回 享福人福深还祷福　多情女情重愈斟情",
        "file": "《红楼梦》 第二十九回 享福人福深还祷福　多情女情重愈斟情.txt",
    },
}


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"


def compact(text: str) -> str:
    return re.sub(r"\s+", "", text)


def infer_speaker(pre: str) -> tuple[str, str]:
    tail = pre[-120:]
    aliases = [
        ("林如海", ["林如海", "如海"]),
        ("贾雨村", ["贾雨村", "雨村"]),
        ("林黛玉", ["林黛玉", "黛玉"]),
        ("贾宝玉", ["贾宝玉", "宝玉"]),
        ("贾母", ["贾母", "老太太"]),
        ("王熙凤", ["王熙凤", "熙凤", "凤姐", "凤姐儿"]),
        ("王夫人", ["王夫人"]),
        ("薛宝钗", ["薛宝钗", "宝钗"]),
        ("贾政", ["贾政"]),
        ("贾珍", ["贾珍"]),
        ("贾琏", ["贾琏"]),
        ("贾蓉", ["贾蓉"]),
        ("张道士", ["张道士", "张法官"]),
        ("袭人", ["袭人"]),
        ("紫鹃", ["紫鹃"]),
        ("邢夫人", ["邢夫人", "邢氏"]),
        ("探春", ["探春"]),
        ("众清客", ["众清客", "众客", "众人", "诸人"]),
        ("丫鬟/仆从", ["丫鬟", "小厮", "人", "家人", "婆子", "媳妇"]),
    ]
    verbs = r"(道|说道|笑道|问道|回道|答道|骂道|哭道|冷笑道|喝道|命|叫|说道|说)"
    candidates: list[tuple[int, str]] = []
    for speaker, names in aliases:
        for name in names:
            match = list(re.finditer(re.escape(name) + r".{0,30}?" + verbs + r"[:：]?$", tail))
            if match:
                candidates.append((match[-1].start(), speaker))
    if candidates:
        candidates.sort()
        return candidates[-1][1], "rule:nearest_speaker"
    if re.search(r"(心想|想道|思忖道|忖度着)[:：]?$", tail):
        if "黛玉" in tail:
            return "林黛玉", "rule:inner_thought"
        if "宝玉" in tail:
            return "贾宝玉", "rule:inner_thought"
    if re.search(r"(匾上|大书|题以|写着|对联|诗云|古人说|词曰)[:：]?$", tail):
        return "题额/诗文/典故", "rule:inscription_or_quote"
    return "未判定", "needs_review"


def classify_quote(speaker: str, pre: str) -> str:
    if speaker == "题额/诗文/典故":
        return "inscription_or_allusion"
    if re.search(r"(心想|想道|思忖道|忖度着)[:：]?$", pre[-40:]):
        return "inner_thought"
    return "dialogue"


def extract_quotes(text: str, chapter_id: str) -> list[dict[str, object]]:
    one_line = compact(text)
    items: list[dict[str, object]] = []
    manual_overrides: dict[tuple[str, int], tuple[str, str]] = {
        ("ch017_grand_view_garden_inscriptions", 64): ("贾宝玉", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 67): ("贾政", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 148): ("小厮们", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 151): ("小厮们", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 152): ("袭人", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 153): ("林黛玉", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 154): ("贾宝玉", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 161): ("贾母", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 162): ("林黛玉", "dialogue"),
        ("ch017_grand_view_garden_inscriptions", 165): ("拟声/动作", "sound"),
        ("ch029_qingxu_temple_baodai_quarrel", 1): ("贾宝玉", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 3): ("薛宝钗", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 14): ("王熙凤", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 17): ("贾母", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 48): ("张道士", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 64): ("贾母", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 82): ("贾宝玉", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 90): ("贾宝玉", "quoted_report"),
        ("ch029_qingxu_temple_baodai_quarrel", 92): ("贾宝玉", "inner_thought"),
        ("ch029_qingxu_temple_baodai_quarrel", 93): ("贾宝玉", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 97): ("林黛玉", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 98): ("旁白", "narration"),
        ("ch029_qingxu_temple_baodai_quarrel", 99): ("贾宝玉", "inner_thought"),
        ("ch029_qingxu_temple_baodai_quarrel", 100): ("林黛玉", "inner_thought"),
        ("ch029_qingxu_temple_baodai_quarrel", 101): ("贾宝玉", "inner_thought"),
        ("ch029_qingxu_temple_baodai_quarrel", 102): ("林黛玉", "inner_thought"),
        ("ch029_qingxu_temple_baodai_quarrel", 104): ("贾宝玉", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 107): ("袭人", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 108): ("林黛玉", "sound"),
        ("ch029_qingxu_temple_baodai_quarrel", 110): ("贾宝玉", "inner_thought"),
        ("ch029_qingxu_temple_baodai_quarrel", 111): ("袭人", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 114): ("贾宝玉", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 116): ("贾母/王夫人", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 117): ("林黛玉", "inner_thought"),
        ("ch029_qingxu_temple_baodai_quarrel", 118): ("贾母", "dialogue"),
        ("ch029_qingxu_temple_baodai_quarrel", 119): ("俗语", "allusion"),
        ("ch029_qingxu_temple_baodai_quarrel", 120): ("旁白/诗句", "narration"),
        ("ch029_qingxu_temple_baodai_quarrel", 121): ("袭人", "dialogue"),
    }
    for idx, match in enumerate(re.finditer(r"“([^”]+)”", one_line), 1):
        pre = one_line[max(0, match.start() - 140) : match.start()]
        post = one_line[match.end() : match.end() + 90]
        speaker, confidence = infer_speaker(pre)
        quote_type = classify_quote(speaker, pre)
        if (chapter_id, idx) in manual_overrides:
            speaker, quote_type = manual_overrides[(chapter_id, idx)]
            confidence = "manual:key_scene_review"
        items.append(
            {
                "id": f"{chapter_id}_q{idx:03d}",
                "chapter_id": chapter_id,
                "speaker": speaker,
                "type": quote_type,
                "text": match.group(1),
                "confidence": confidence,
                "context_before": pre[-80:],
                "context_after": post[:80],
            }
        )
    return items


def write_dialogue_md(quotes: list[dict[str, object]]) -> str:
    grouped: dict[str, list[dict[str, object]]] = defaultdict(list)
    for quote in quotes:
        grouped[str(quote["speaker"])].append(quote)
    lines = ["# 台词/引语抽取", "", "> `needs_review` 是机器归属不稳的条目，conversation scene 已另行人工归纳。", ""]
    for speaker in sorted(grouped):
        lines.append(f"## {speaker}")
        for quote in grouped[speaker]:
            lines.append(f"- `{quote['id']}` `{quote['type']}` `{quote['confidence']}`：{quote['text']}")
        lines.append("")
    return "\n".join(lines).strip() + "\n"


CONVERSATION_SCENES = {
    "ch003_lindaiyu_enters_jiafu": [
        {
            "scene_id": "ch003_scene_entrance_etiquette",
            "title": "黛玉进荣国府：以观察学习礼法",
            "scene_type": "arrival_etiquette",
            "canon_mode": "剧情必经",
            "participants": ["林黛玉", "贾母", "邢夫人", "王夫人", "李纨", "迎春", "探春", "惜春", "众仆从"],
            "player_role_options": ["林黛玉", "旁观者/随侍"],
            "surface_event": "黛玉从西角门入荣国府，拜见贾母和内宅女眷。",
            "hidden_intents": {
                "林黛玉": "确认自己在贾府的位置，少说少错，避免被耻笑。",
                "贾母": "用公开怜爱确认黛玉的家族身份。",
                "众仆从": "通过迎接、打帘、座次展示贾府秩序。",
            },
            "emotional_arc": ["谨慎入场", "亲情爆发", "礼法确认", "暂时安置"],
            "beats": [
                "黛玉在轿中观察门第和仆从规格。",
                "贾母抱住黛玉痛哭，亲情压过礼法。",
                "贾母逐一介绍舅母、嫂子和三春。",
                "黛玉以少言、见礼、答问完成第一次身份落位。",
            ],
            "player_choice_strategies": ["谨慎行礼", "主动亲近", "沉默观察", "多问规矩"],
            "state_effects": {"林黛玉.谨慎": "+", "贾母.怜爱": "+", "贾府.礼法压力": "+"},
            "freeplay_hooks": ["新客入府", "长辈公开偏爱", "随侍提醒礼法", "座次试探"],
        },
        {
            "scene_id": "ch003_scene_xifeng_entrance",
            "title": "王熙凤出场：热络奉承与管家控场",
            "scene_type": "social_control",
            "canon_mode": "剧情必经",
            "participants": ["王熙凤", "林黛玉", "贾母", "王夫人", "众姊妹", "丫鬟婆子"],
            "player_role_options": ["林黛玉", "王熙凤", "旁观者"],
            "surface_event": "凤姐笑语未到先闻，夸黛玉、哄贾母，同时安排房间和物件。",
            "hidden_intents": {
                "王熙凤": "在贾母面前表演亲热能干，确认自己内宅调度权。",
                "林黛玉": "判断凤姐身份和危险程度。",
                "贾母": "借玩笑认可凤姐的泼辣和亲密地位。",
            },
            "emotional_arc": ["声势入场", "奉承拉近", "借哭试情", "转悲为喜", "事务落地"],
            "beats": [
                "凤姐先以笑声打破满室敛声屏气。",
                "外貌与服饰压出强烈权力信号。",
                "凤姐夸黛玉像嫡亲孙女，顺手安抚贾母。",
                "凤姐询问行李人数并命人打扫屋子。",
            ],
            "player_choice_strategies": ["顺势陪笑", "礼貌疏离", "观察不接话", "请求照应"],
            "state_effects": {"王熙凤.控场": "+", "林黛玉.警觉": "+", "贾母.满意": "+"},
            "freeplay_hooks": ["管家型 NPC 首次接触", "公开奉承", "长辈前控场", "分配房舍/物资"],
        },
        {
            "scene_id": "ch003_scene_baodai_first_meeting",
            "title": "宝黛初见：似曾相识与摔玉",
            "scene_type": "fated_intimacy_conflict",
            "canon_mode": "剧情必经",
            "participants": ["贾宝玉", "林黛玉", "贾母", "探春", "众人"],
            "player_role_options": ["贾宝玉", "林黛玉", "旁观者"],
            "surface_event": "宝玉与黛玉互觉眼熟，宝玉问玉，听黛玉无玉后摔通灵玉。",
            "hidden_intents": {
                "贾宝玉": "用玉确认亲密同类，拒绝被特殊物件隔开。",
                "林黛玉": "谨慎回答，不愿夸张或越礼。",
                "贾母": "立刻用谎言圆场，保护宝玉和黛玉的情绪。",
            },
            "emotional_arc": ["惊异", "亲近", "试探", "失控", "长辈圆场"],
            "beats": [
                "黛玉觉得宝玉眼熟，宝玉也说曾见过这个妹妹。",
                "宝玉给黛玉取字颦颦，显示亲密越界。",
                "宝玉问黛玉有没有玉。",
                "黛玉说没有，宝玉摔玉，贾母哄回。",
            ],
            "player_choice_strategies": ["亲昵称赞", "守礼后退", "追问玉", "安抚失控", "请长辈介入"],
            "state_effects": {"宝黛.宿命感": "++", "宝玉.情绪失控": "+", "黛玉.歉疚": "+", "贾母.保护欲": "+"},
            "freeplay_hooks": ["信物触发争执", "第一次亲密越礼", "长辈替晚辈圆谎", "同类确认失败"],
        },
        {
            "scene_id": "ch003_scene_xiren_comforts_daiyu",
            "title": "袭人夜慰黛玉：解释宝玉的怪癖",
            "scene_type": "servant_mediation",
            "canon_mode": "剧情可播放",
            "participants": ["袭人", "林黛玉", "鹦哥", "贾宝玉"],
            "player_role_options": ["袭人", "林黛玉", "随侍"],
            "surface_event": "黛玉因宝玉摔玉自责，袭人夜间劝慰她别多心。",
            "hidden_intents": {
                "袭人": "安抚新来的林姑娘，也维护宝玉。",
                "林黛玉": "害怕自己刚来就惹祸。",
                "鹦哥": "替黛玉说出不便直说的自责。",
            },
            "emotional_arc": ["自责", "解释", "规劝", "暂时安歇"],
            "beats": ["袭人问黛玉为何不睡。", "鹦哥代述黛玉伤心原因。", "袭人说明宝玉将来怪事还多。", "黛玉接受劝告。"],
            "player_choice_strategies": ["温和解释", "替主子担责", "劝别多心", "留出体面"],
            "state_effects": {"林黛玉.自责": "-", "袭人.信任": "+", "宝玉.怪癖认知": "+"},
            "freeplay_hooks": ["丫鬟解释主子失礼", "夜间私谈", "新客情绪安抚"],
        },
    ],
    "ch017_grand_view_garden_inscriptions": [
        {
            "scene_id": "ch017_scene_jiazheng_tests_baoyu",
            "title": "贾政试才：大观园题额",
            "scene_type": "public_evaluation",
            "canon_mode": "剧情必经",
            "participants": ["贾政", "贾宝玉", "众清客", "贾珍"],
            "player_role_options": ["贾宝玉", "贾政", "清客"],
            "surface_event": "贾政带清客游园，借题额对联试宝玉才情。",
            "hidden_intents": {
                "贾政": "试儿子才学，同时维护父权威严。",
                "贾宝玉": "既怕父亲又忍不住讲审美真话。",
                "众清客": "迎合贾政，暗中捧宝玉。",
            },
            "emotional_arc": ["被迫随行", "试探出题", "才情显露", "父亲压制", "清客调和"],
            "beats": [
                "贾政听闻宝玉会对对，命他随入园。",
                "众清客故意出俗题，引宝玉发挥。",
                "宝玉提出曲径通幽、沁芳、有凤来仪、稻香村等题名。",
                "贾政一边点头一边斥骂，维持父亲威严。",
            ],
            "player_choice_strategies": ["谦退不言", "据景直言", "引用古句", "迎合父亲", "反驳俗套"],
            "state_effects": {"宝玉.才情曝光": "+", "贾政.复杂满意": "+", "宝玉.父权压力": "++"},
            "freeplay_hooks": ["长辈考校才艺", "清客捧场", "审美争论", "题名改变场景资产"],
        },
        {
            "scene_id": "ch017_scene_qinfang_bridge",
            "title": "沁芳亭：述古还是编新",
            "scene_type": "aesthetic_argument",
            "canon_mode": "剧情可播放",
            "participants": ["贾政", "贾宝玉", "众清客"],
            "player_role_options": ["贾宝玉", "清客"],
            "surface_event": "众人围绕桥亭题名，从翼然、泻玉到沁芳。",
            "hidden_intents": {
                "贾宝玉": "用更含蓄新雅的词替代粗直的水字。",
                "贾政": "借追问逼宝玉解释审美原则。",
                "众清客": "察言观色，称赞能让贾政接受的答案。",
            },
            "emotional_arc": ["众议", "质疑", "新题", "小胜"],
            "beats": ["众人提翼然。", "贾政偏向泻玉。", "宝玉批评泻字粗陋。", "宝玉提出沁芳并作七言联。"],
            "player_choice_strategies": ["述古", "编新", "含蓄命名", "作对联"],
            "state_effects": {"场景.沁芳亭": "named", "宝玉.审美权威": "+"},
            "freeplay_hooks": ["玩家参与命名", "题名影响场景氛围", "清客投票"],
        },
        {
            "scene_id": "ch017_scene_daoxiang_village_argument",
            "title": "稻香村争名：自然与人造",
            "scene_type": "philosophical_dispute",
            "canon_mode": "剧情可播放",
            "participants": ["贾政", "贾宝玉", "众清客", "贾珍"],
            "player_role_options": ["贾宝玉", "贾政"],
            "surface_event": "田舍景观引发杏花村、杏帘在望、稻香村与天然图画之争。",
            "hidden_intents": {
                "贾宝玉": "指出人造田庄不能假装天然，审美上要合地脉。",
                "贾政": "认同田园意趣，却不能容忍宝玉当众顶撞。",
                "众清客": "既怕宝玉得罪父亲，又欣赏他的歪才。",
            },
            "emotional_arc": ["田园惊喜", "命名得彩", "宝玉越说越真", "父亲震怒", "被迫作联"],
            "beats": [
                "众人提杏花村，宝玉改为杏帘在望、稻香村。",
                "宝玉批评田庄景致不够天然。",
                "贾政喝令宝玉出去又叫回来。",
                "宝玉战兢兢作联。",
            ],
            "player_choice_strategies": ["点到即止", "坚持审美原则", "顺父亲意", "引用古诗"],
            "state_effects": {"宝玉.被责骂": "+", "贾政.怒气": "+", "场景.稻香村": "named"},
            "freeplay_hooks": ["场景真实性争论", "父子公开冲突", "才艺检查失败风险"],
        },
        {
            "scene_id": "ch017_scene_baodai_purse_quarrel",
            "title": "荷包与香袋：礼物误会",
            "scene_type": "intimate_object_conflict",
            "canon_mode": "剧情可播放",
            "participants": ["贾宝玉", "林黛玉", "袭人", "贾母", "众小厮"],
            "player_role_options": ["贾宝玉", "林黛玉"],
            "surface_event": "宝玉被小厮抢走佩物，黛玉误以为自己的荷包也被送人，气剪香袋。",
            "hidden_intents": {
                "林黛玉": "用礼物珍惜程度确认自己在宝玉心里的位置。",
                "贾宝玉": "证明自己把黛玉的东西贴身珍藏。",
                "袭人": "用玩笑点破小厮抢物，推动误会浮出水面。",
            },
            "emotional_arc": ["得彩", "被抢佩物", "误会", "证明珍藏", "撒娇赔不是", "缓和"],
            "beats": [
                "小厮们以讨赏为名解走宝玉佩物。",
                "袭人说东西必被没脸的人解走。",
                "黛玉误会荷包也被给人，剪未完香袋。",
                "宝玉解出贴身荷包证明珍重。",
                "两人拌嘴后又一同往王夫人处去。",
            ],
            "player_choice_strategies": ["立刻解释", "赌气奉还", "撒娇求饶", "冷笑试探", "转移场景"],
            "state_effects": {"宝黛.亲密": "+", "黛玉.委屈": "+", "宝玉.慌张": "+", "误会": "resolved"},
            "freeplay_hooks": ["私人物件误会", "礼物珍藏检查", "丫鬟旁观调停", "亲密关系小争执"],
        },
    ],
    "ch029_qingxu_temple_baodai_quarrel": [
        {
            "scene_id": "ch029_scene_qingxu_temple_procession",
            "title": "清虚观出行：贾府女眷公共仪仗",
            "scene_type": "public_ritual_etiquette",
            "canon_mode": "剧情背景",
            "participants": ["贾母", "王熙凤", "薛宝钗", "林黛玉", "众丫鬟", "贾珍", "张道士"],
            "player_role_options": ["随侍", "王熙凤", "贾宝玉"],
            "surface_event": "贾母带女眷清虚观打醮看戏，车辆人马浩荡，外人围观。",
            "hidden_intents": {
                "贾母": "借节令和贵妃名义出游祈福。",
                "王熙凤": "安排封闭场地，保证女眷空间安全。",
                "仆从": "维持内外隔离和传话秩序。",
            },
            "emotional_arc": ["邀约", "准备", "出行", "公共注视", "场地封控"],
            "beats": ["凤姐提议去清虚观。", "贾母决定同去。", "荣国府门前车辆纷纷。", "清虚观按等级迎接。"],
            "player_choice_strategies": ["劝去", "推辞", "安排封场", "维持队列"],
            "state_effects": {"场景.公共风险": "+", "贾府.声势": "++"},
            "freeplay_hooks": ["集体出游", "外人围观", "女眷安全封控", "节日仪式"],
        },
        {
            "scene_id": "ch029_scene_zhang_daoshi_proposes_match",
            "title": "张道士提亲：金玉压力的前置触发",
            "scene_type": "marriage_pressure",
            "canon_mode": "剧情必经",
            "participants": ["张道士", "贾母", "贾宝玉", "王熙凤"],
            "player_role_options": ["贾宝玉", "贾母", "旁观者"],
            "surface_event": "张道士借请安提起一位小姐可与宝玉议亲，贾母以不早娶挡回。",
            "hidden_intents": {
                "张道士": "试探贾母对宝玉婚事的口风。",
                "贾母": "保留选择权，强调模样性格难得。",
                "贾宝玉": "被婚配话题刺痛，为后续宝黛争执埋火。",
            },
            "emotional_arc": ["寒暄", "奉承宝玉", "试探提亲", "贾母挡回", "宝玉不自在"],
            "beats": ["张道士称宝玉像国公爷。", "张道士提小姐可配宝玉。", "贾母说命里不该早娶。", "宝玉回家后因说亲生气。"],
            "player_choice_strategies": ["婉拒", "追问人选", "沉默忍受", "转移到祈福"],
            "state_effects": {"宝玉.婚配压力": "++", "宝黛.金玉敏感": "+", "贾母.婚事控制": "+"},
            "freeplay_hooks": ["外人提亲", "长辈挡婚", "主角听闻后情绪积压"],
        },
        {
            "scene_id": "ch029_scene_gold_kylin_jealousy",
            "title": "金麒麟：物件触发的吃味",
            "scene_type": "jealousy_token_trigger",
            "canon_mode": "剧情可播放",
            "participants": ["贾宝玉", "林黛玉", "薛宝钗", "探春", "贾母"],
            "player_role_options": ["贾宝玉", "林黛玉", "薛宝钗"],
            "surface_event": "贾母看见金麒麟，宝钗记得湘云也有，黛玉冷笑宝钗留心人的配饰。",
            "hidden_intents": {
                "林黛玉": "借金麒麟讽刺宝钗和金玉之说，观察宝玉反应。",
                "贾宝玉": "想留金麒麟又怕黛玉看出自己在意湘云。",
                "薛宝钗": "装作没听见，避免卷入锋芒。",
            },
            "emotional_arc": ["发现物件", "宝钗补充", "黛玉冷刺", "宝玉心虚", "试图转送黛玉"],
            "beats": [
                "贾母拿起赤金点翠麒麟。",
                "宝钗说湘云也有一个。",
                "黛玉冷笑宝钗只在这些东西上留心。",
                "宝玉想把麒麟给黛玉，黛玉说不稀罕。",
            ],
            "player_choice_strategies": ["装没听见", "解释物件无意", "转送对方", "冷刺试探"],
            "state_effects": {"黛玉.吃味": "+", "宝玉.心虚": "+", "宝钗.避锋": "+", "金玉话题.热度": "+"},
            "freeplay_hooks": ["信物撞款", "旁人提及第三者", "冷笑吃味", "试图转赠补救"],
        },
        {
            "scene_id": "ch029_scene_baorenshi_quarrel",
            "title": "白认得你：宝黛互试真心",
            "scene_type": "intimate_quarrel",
            "canon_mode": "剧情必经",
            "participants": ["贾宝玉", "林黛玉"],
            "player_role_options": ["贾宝玉", "林黛玉"],
            "surface_event": "黛玉因中暑在家，宝玉探望；黛玉一句听戏触发宝玉说“我白认得你了”。",
            "hidden_intents": {
                "贾宝玉": "希望黛玉理解自己被提亲刺痛，确认她知道自己心里只有她。",
                "林黛玉": "用金玉/好姻缘试探宝玉是否真重自己，不重外在婚配说法。",
            },
            "emotional_arc": ["关心探病", "反话试探", "误解升级", "赌咒互伤", "真心藏在气话里"],
            "beats": [
                "宝玉放心不下黛玉，饭也懒得吃。",
                "黛玉说你只管听戏去，宝玉觉其奚落。",
                "宝玉沉脸说我白认得你了。",
                "黛玉用人家配得上你反刺金玉。",
                "宝玉追问是否安心咒他天诛地灭。",
                "黛玉哭着说自己若安心咒他也天诛地灭。",
            ],
            "player_choice_strategies": ["直说担心", "反话试探", "赌咒表心", "冷笑回刺", "暂停争执"],
            "state_effects": {"宝黛.亲密": "+", "宝黛.误解": "++", "黛玉.委屈": "++", "宝玉.烦恼": "++"},
            "freeplay_hooks": ["探病反被刺痛", "婚配压力外溢", "双方真心都不直说", "以反话索取确认"],
        },
        {
            "scene_id": "ch029_scene_smash_jade_cut_tassel",
            "title": "砸玉剪穗：物件承载关系危机",
            "scene_type": "object_crisis_mediation",
            "canon_mode": "剧情必经",
            "participants": ["贾宝玉", "林黛玉", "袭人", "紫鹃", "雪雁", "贾母", "王夫人"],
            "player_role_options": ["贾宝玉", "林黛玉", "袭人", "紫鹃"],
            "surface_event": "宝玉砸玉，黛玉病中大哭大吐；袭人紫鹃劝解，黛玉剪玉穗。",
            "hidden_intents": {
                "贾宝玉": "用毁掉通灵玉表示不接受金玉和外物隔阂。",
                "林黛玉": "觉得自己不如丫鬟懂宝玉，越发伤心。",
                "袭人/紫鹃": "各自维护主子，又必须阻止失控升级。",
            },
            "emotional_arc": ["怒摔", "夺玉", "劝解", "病弱崩溃", "无言对泣", "长辈介入"],
            "beats": [
                "宝玉摘玉狠摔并找东西砸。",
                "黛玉说有砸他的不如来砸我。",
                "袭人夺玉并劝宝玉顾黛玉脸面。",
                "黛玉吐药，紫鹃劝她保重。",
                "四人无言对泣，黛玉剪玉穗。",
                "婆子惊动贾母王夫人，事情被压下。",
            ],
            "player_choice_strategies": ["抢夺信物", "劝顾体面", "陪哭沉默", "转移到身体安危", "报告长辈"],
            "state_effects": {"宝黛.危机": "++", "黛玉.病弱": "++", "宝玉.后悔": "+", "丫鬟.调停压力": "++"},
            "freeplay_hooks": ["信物破坏", "病弱角色情绪崩溃", "丫鬟双边调停", "长辈问责随侍"],
        },
        {
            "scene_id": "ch029_scene_not_enemies_do_not_gather",
            "title": "不是冤家不聚头：隔空和解种子",
            "scene_type": "aftercare_reflection",
            "canon_mode": "剧情可播放",
            "participants": ["贾母", "贾宝玉", "林黛玉", "袭人"],
            "player_role_options": ["贾宝玉", "林黛玉", "袭人"],
            "surface_event": "贾母抱怨两个小冤家，宝黛各自听到后隔空落泪，袭人劝宝玉赔不是。",
            "hidden_intents": {
                "贾母": "用抱怨表达操心，也给二人关系命名。",
                "贾宝玉/林黛玉": "从冤家一词里意识到彼此牵缠。",
                "袭人": "推动宝玉低头，恢复节日秩序。",
            },
            "emotional_arc": ["冷战", "长辈命名", "各自领悟", "隔空同心", "劝低头"],
            "beats": [
                "薛蟠生日二人都不去看戏。",
                "贾母哭骂不是冤家不聚头。",
                "宝黛听闻后各自在潇湘馆、怡红院落泪。",
                "袭人劝宝玉下气赔不是。",
            ],
            "player_choice_strategies": ["主动赔不是", "继续冷战", "托人传话", "借节日缓和"],
            "state_effects": {"宝黛.牵缠认知": "++", "冷战": "+", "和解机会": "+"},
            "freeplay_hooks": ["长辈一句话改变关系解释", "隔空同步情绪", "丫鬟推动和解"],
        },
    ],
}


INTERACTION_PATTERNS = [
    {
        "pattern_id": "intimate_quarrel_by_indirect_test",
        "name": "亲密关系中的反话试探",
        "source_scenes": ["ch029_scene_baorenshi_quarrel", "ch017_scene_baodai_purse_quarrel"],
        "category": "zhengchi",
        "freeplay_use": "适合宝黛、亲密好友、暧昧关系。角色不直接索爱，而用反话、冷笑、礼物、第三人话题试探对方。",
        "surface_actions": ["冷笑", "反问", "提第三人", "赌气归还礼物", "不肯直说真实委屈"],
        "hidden_intents": ["确认我是否最重要", "确认对方是否懂我", "逼对方主动解释"],
        "risks": ["误会升级", "信物被毁", "病弱角色状态恶化", "长辈/丫鬟介入"],
        "effects": {"亲密": "+", "委屈": "+", "误解": "+", "和解后信任": "+"},
    },
    {
        "pattern_id": "object_token_as_relationship_proof",
        "name": "信物证明关系",
        "source_scenes": ["ch017_scene_baodai_purse_quarrel", "ch029_scene_gold_kylin_jealousy", "ch029_scene_smash_jade_cut_tassel"],
        "category": "chuanqing",
        "freeplay_use": "把荷包、香袋、玉、金麒麟、穗子等物件作为关系证据，驱动误会、吃味、修复和任务。",
        "surface_actions": ["贴身藏物", "转赠", "剪毁", "摔砸", "索回"],
        "hidden_intents": ["证明珍重", "拒绝被外物规定婚配", "确认自己不是可替代的"],
        "risks": ["物件损坏", "旁人误读", "礼法风险", "关系危机"],
        "effects": {"亲密": "++ on repair", "心碎": "+ on destruction", "记忆": "create"},
    },
    {
        "pattern_id": "public_elder_examines_junior_talent",
        "name": "长辈公开考校才艺",
        "source_scenes": ["ch017_scene_jiazheng_tests_baoyu", "ch017_scene_qinfang_bridge", "ch017_scene_daoxiang_village_argument"],
        "category": "lundao",
        "freeplay_use": "用于诗词、题额、琴棋书画、管家判断等公共才艺挑战。清客/旁观者会迎合权威。",
        "surface_actions": ["出题", "命名", "作联", "点评", "斥责", "捧场"],
        "hidden_intents": ["长辈维持权威", "晚辈争取审美表达", "旁观者保全场面"],
        "risks": ["顶撞长辈", "公开失分", "被要求重作", "才名上升带来更多压力"],
        "effects": {"才名": "+", "父权压力": "+", "场景命名": "unlock"},
    },
    {
        "pattern_id": "servant_mediation_after_elite_conflict",
        "name": "丫鬟调停主子冲突",
        "source_scenes": ["ch003_scene_xiren_comforts_daiyu", "ch029_scene_smash_jade_cut_tassel", "ch029_scene_not_enemies_do_not_gather"],
        "category": "weijie",
        "freeplay_use": "主子冲突升级后，袭人/紫鹃/鹦哥等以照料身体、维护体面、传话赔不是来降温。",
        "surface_actions": ["劝别多心", "夺下危险物", "照顾病弱", "替主子说心事", "劝赔不是"],
        "hidden_intents": ["保护主子", "避免长辈问责", "修复关系但不越身份"],
        "risks": ["两边不讨好", "被长辈迁怒", "越权传话"],
        "effects": {"冲突热度": "-", "随侍压力": "+", "和解机会": "+"},
    },
    {
        "pattern_id": "etiquette_locked_public_ritual",
        "name": "礼法锁定的公共活动",
        "source_scenes": ["ch003_scene_entrance_etiquette", "ch029_scene_qingxu_temple_procession"],
        "category": "xujiu",
        "freeplay_use": "入府、出游、祭祀、宴席等场景中，角色自由度受座次、男女内外、随侍、封场规则限制。",
        "surface_actions": ["打帘", "让座", "封场", "传话", "队列出行", "公开迎接"],
        "hidden_intents": ["展示身份", "保护女眷", "维持内外有别", "让新角色学习规则"],
        "risks": ["失礼", "被外人看见", "仆从被责罚", "公共声望变化"],
        "effects": {"礼法压力": "+", "场景权限": "gated", "外部关注": "+"},
    },
]


DESIGN_NOTE = """# 三回 conversation 抽取说明

这批不是只抽“谁说了什么”，而是把对话做成游戏可用的 `conversation_scene`。

每个 scene 包含：

- `surface_event`：明面发生了什么。
- `hidden_intents`：每个人真正想确认、遮掩或争取什么。
- `emotional_arc`：情绪从哪里起、怎样升级、怎样落点。
- `beats`：剧情模式可播放的节点。
- `player_choice_strategies`：玩家选的不是固定句子，而是说话策略。
- `state_effects`：自由模式里可写入关系/状态/记忆。
- `freeplay_hooks`：这段原文能泛化出的自然事件模板。

用法建议：

1. 剧情模式：按 `beats` 播放，玩家在关键节点选 strategy。
2. 半自由模式：保留 `surface_event`，允许不同 strategy 改变 `state_effects`。
3. 高自由模式：不用原文台词，调用 `interaction_patterns`，让 NPC 根据关系、状态、场景礼法生成新事件。
"""


def write_scene_md(scenes: list[dict[str, object]]) -> str:
    lines = ["# Conversation Scenes", ""]
    for scene in scenes:
        lines.append(f"## {scene['title']}")
        lines.append(f"- id: `{scene['scene_id']}`")
        lines.append(f"- type: `{scene['scene_type']}`")
        lines.append(f"- canon_mode: {scene['canon_mode']}")
        lines.append("- participants: " + "、".join(scene["participants"]))
        lines.append("")
        lines.append("surface_event: " + scene["surface_event"])
        lines.append("")
        lines.append("hidden_intents:")
        for who, intent in scene["hidden_intents"].items():
            lines.append(f"- {who}: {intent}")
        lines.append("")
        lines.append("beats:")
        for beat in scene["beats"]:
            lines.append(f"- {beat}")
        lines.append("")
        lines.append("player_choice_strategies: " + " / ".join(scene["player_choice_strategies"]))
        lines.append("")
        lines.append("freeplay_hooks: " + " / ".join(scene["freeplay_hooks"]))
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def write_patterns_md(patterns: list[dict[str, object]]) -> str:
    lines = ["# Interaction Patterns", ""]
    for pattern in patterns:
        lines.append(f"## {pattern['name']}")
        lines.append(f"- id: `{pattern['pattern_id']}`")
        lines.append(f"- category: `{pattern['category']}`")
        lines.append("- source_scenes: " + "、".join(pattern["source_scenes"]))
        lines.append("")
        lines.append(pattern["freeplay_use"])
        lines.append("")
        lines.append("surface_actions: " + " / ".join(pattern["surface_actions"]))
        lines.append("")
        lines.append("hidden_intents: " + " / ".join(pattern["hidden_intents"]))
        lines.append("")
        lines.append("risks: " + " / ".join(pattern["risks"]))
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "README.md").write_text(DESIGN_NOTE, encoding="utf-8")
    all_quotes: list[dict[str, object]] = []
    all_scenes: list[dict[str, object]] = []

    for chapter_id, meta in CHAPTERS.items():
        chapter_out = OUT / chapter_id
        chapter_out.mkdir(parents=True, exist_ok=True)
        source = SOURCE_DIR / meta["file"]
        text = normalize_text(source.read_text(encoding="utf-8"))
        quotes = extract_quotes(text, chapter_id)
        scenes = CONVERSATION_SCENES[chapter_id]

        (chapter_out / "raw_chapter.txt").write_text(text, encoding="utf-8")
        (chapter_out / "quotes.jsonl").write_text(
            "\n".join(json.dumps(item, ensure_ascii=False) for item in quotes) + "\n",
            encoding="utf-8",
        )
        (chapter_out / "dialogues_by_character.md").write_text(write_dialogue_md(quotes), encoding="utf-8")
        (chapter_out / "conversation_scenes.json").write_text(
            json.dumps(scenes, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        (chapter_out / "conversation_scenes.md").write_text(write_scene_md(scenes), encoding="utf-8")
        summary = {
            "chapter_id": chapter_id,
            "chapter_no": meta["chapter_no"],
            "title": meta["title"],
            "source": str(source),
            "quote_items": len(quotes),
            "conversation_scenes": len(scenes),
        }
        (chapter_out / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        all_quotes.extend(quotes)
        all_scenes.extend(scenes)

    (OUT / "all_quotes.jsonl").write_text(
        "\n".join(json.dumps(item, ensure_ascii=False) for item in all_quotes) + "\n",
        encoding="utf-8",
    )
    (OUT / "all_conversation_scenes.json").write_text(
        json.dumps(all_scenes, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (OUT / "interaction_patterns.json").write_text(
        json.dumps(INTERACTION_PATTERNS, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (OUT / "interaction_patterns.md").write_text(write_patterns_md(INTERACTION_PATTERNS), encoding="utf-8")
    overview = {
        "chapters": list(CHAPTERS),
        "quote_items": len(all_quotes),
        "conversation_scenes": len(all_scenes),
        "interaction_patterns": len(INTERACTION_PATTERNS),
        "runtime_note": "素材资产，尚未直接接入现有 JS 运行时；若接入，需要新增 scene/pattern interpreter。",
    }
    (OUT / "overview.json").write_text(json.dumps(overview, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
