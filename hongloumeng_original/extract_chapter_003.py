from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WORKSPACE = ROOT.parent
SOURCE = WORKSPACE / "hongloumeng-txt" / "output" / "《红楼梦》 第三回 托内兄如海荐西宾　接外孙贾母惜孤女.txt"
OUT = ROOT / "chapter_003_lindaiyu_enters_jiafu"


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return re.sub(r"\n{3,}", "\n\n", text).strip() + "\n"


def compact(text: str) -> str:
    return re.sub(r"\s+", "", text)


def find_speaker(pre: str, post: str) -> tuple[str, str]:
    # The first pass intentionally stays conservative; uncertain items are
    # preserved for manual review instead of being silently forced.
    before_patterns = [
        (r"(林如海|如海)(?:又)?(?:笑)?(?:说|道)[:：]?$", "林如海"),
        (r"(贾雨村|雨村).*?(?:问|道)[:：]?$", "贾雨村"),
        (r"(林黛玉|黛玉)(?:忙)?(?:笑)?(?:回|答|道|让)[:：]?$", "林黛玉"),
        (r"(贾母)(?:忙)?(?:笑)?(?:说|道|叫|命)[:：]?$", "贾母"),
        (r"(王熙凤|熙凤)(?:听了，忙转悲为喜)?(?:又忙拉着黛玉的手问|又问人|道|因笑道)[:：]?$", "王熙凤"),
        (r"(王夫人)(?:笑指向黛玉)?(?:因又说|再三让他上炕，他方挨王夫人坐下。王夫人因说|笑道|道)[:：]?$", "王夫人"),
        (r"(邢夫人|邢氏)(?:忙起身笑回|道)[:：]?$", "邢夫人"),
        (r"(贾赦|老爷)说[:：]?$", "贾赦"),
        (r"(贾宝玉|宝玉)(?:满面泪痕哭|听了，登时发作起狂病来，摘下那玉就狠命摔去，骂|看罢，笑|笑|又|便走向黛玉身边坐下，又细细打量一番，因问|道)[:：]?$", "贾宝玉"),
        (r"(探春)(?:笑)?(?:道)[:：]?$", "探春"),
        (r"(袭人)(?:道|.*?笑问)[:：]?$", "袭人"),
        (r"(鹦哥)(?:笑道)[:：]?$", "鹦哥"),
        (r"(丫鬟)(?:进来报道|来说)[:：]?$", "丫鬟"),
        (r"(众姊妹).*?(?:告诉黛玉道)[:：]?$", "众姊妹"),
        (r"(人).*?(?:说)[:：]?$", "未名仆从"),
        (r"(丫头).*?(?:笑迎上来道)[:：]?$", "丫头们"),
    ]
    tail = pre[-90:]
    for pattern, speaker in before_patterns:
        if re.search(pattern, tail):
            return speaker, "rule:pre_speaker"
    if re.search(r"(想道|心想|思忖道|忖度着)[:：]?$", tail):
        if "黛玉" in tail:
            return "林黛玉", "rule:inner_thought"
    if post.startswith("叫着大哭"):
        return "贾母", "rule:action_after_quote"
    if "匾上大书" in tail or "写着" in tail or "有一副对联" in tail:
        return "题匾/陈设文字", "rule:inscription"
    return "未判定", "needs_review"


def classify_quote(text: str, speaker: str, pre: str) -> str:
    if speaker == "题匾/陈设文字":
        return "inscription"
    if "想道" in pre[-30:] or "心想" in pre[-30:] or "思忖道" in pre[-30:] or "忖度着" in pre[-30:]:
        return "inner_thought"
    return "dialogue"


def extract_quotes(text: str) -> list[dict[str, object]]:
    one_line = compact(text)
    items: list[dict[str, object]] = []
    overrides = {
        12: ("贾母", "dialogue"),
        13: ("贾母", "dialogue"),
        14: ("贾母", "dialogue"),
        15: ("众人", "dialogue"),
        18: ("王熙凤", "dialogue"),
        21: ("众姊妹", "dialogue"),
        22: ("林黛玉", "address"),
        23: ("王熙凤", "dialogue"),
        26: ("王熙凤", "dialogue"),
        28: ("王夫人", "dialogue"),
        31: ("王夫人", "dialogue"),
        33: ("邢夫人", "dialogue"),
        35: ("贾赦", "indirect_dialogue"),
        36: ("林黛玉", "dialogue"),
        42: ("丫鬟", "indirect_dialogue"),
        44: ("林黛玉", "dialogue"),
        47: ("王夫人", "dialogue"),
        54: ("贾母", "dialogue"),
        55: ("贾母", "dialogue"),
        56: ("贾宝玉", "dialogue"),
        58: ("贾宝玉", "dialogue"),
        62: ("贾宝玉", "dialogue"),
        63: ("贾宝玉", "dialogue"),
        65: ("贾宝玉", "dialogue"),
        66: ("探春", "dialogue"),
        69: ("贾宝玉", "dialogue"),
        70: ("贾宝玉", "dialogue"),
        72: ("林黛玉", "dialogue"),
        73: ("贾宝玉", "dialogue"),
        74: ("贾母", "dialogue"),
        75: ("贾宝玉", "dialogue"),
        76: ("贾母", "dialogue"),
        77: ("贾母", "dialogue"),
        79: ("贾母", "dialogue"),
        80: ("诗句典故", "allusion"),
        81: ("袭人", "dialogue"),
    }
    for idx, match in enumerate(re.finditer(r"“([^”]+)”", one_line), 1):
        quote = match.group(1)
        pre = one_line[max(0, match.start() - 120) : match.start()]
        post = one_line[match.end() : match.end() + 80]
        speaker, confidence = find_speaker(pre, post)
        item_type = classify_quote(quote, speaker, pre)
        if idx in overrides:
            speaker, item_type = overrides[idx]
            confidence = "manual:chapter_003_trial"
        items.append(
            {
                "id": f"ch003_q{idx:03d}",
                "type": item_type,
                "speaker": speaker,
                "text": quote,
                "confidence": confidence,
                "context_before": pre[-70:],
                "context_after": post[:70],
            }
        )
    return items


APPEARANCES = [
    {
        "character": "林黛玉",
        "source_label": "众人初见黛玉",
        "text": "年纪虽小，举止言谈不俗；身体面貌虽弱不胜衣，却有一段风流态度，带有不足之症。",
        "prompt_notes": ["体弱多病", "仪态有教养", "敏感克制", "寄人篱下后格外谨慎"],
    },
    {
        "character": "林黛玉",
        "source_label": "宝玉细看黛玉",
        "text": "两弯似蹙非蹙笼烟眉，一双似喜非喜含情目；态生两靥之愁，娇袭一身之病；泪光点点，娇喘微微；闲静似娇花照水，行动如弱柳扶风。",
        "prompt_notes": ["病弱清灵", "眉眼含愁", "有宿命感", "外柔内慧"],
    },
    {
        "character": "贾母",
        "source_label": "黛玉进房初见",
        "text": "由两个人扶着迎上来，鬓发如银，见黛玉即抱住痛哭。",
        "prompt_notes": ["家族最高长辈", "情感外露", "对黛玉有强烈怜爱"],
    },
    {
        "character": "贾迎春",
        "source_label": "三春出场",
        "text": "肌肤微丰，身材合中，腮凝新荔，鼻腻鹅脂，温柔沉默，观之可亲。",
        "prompt_notes": ["温柔沉默", "亲和", "低冲突"],
    },
    {
        "character": "贾探春",
        "source_label": "三春出场",
        "text": "削肩细腰，长挑身材，鸭蛋脸儿，俊眼修眉，顾盼神飞，文彩精华，见之忘俗。",
        "prompt_notes": ["精明爽利", "有文采", "神采飞扬"],
    },
    {
        "character": "贾惜春",
        "source_label": "三春出场",
        "text": "身量未足，形容尚小；与迎春、探春钗环裙袄一样妆束。",
        "prompt_notes": ["年幼", "尚未展开性格锋芒"],
    },
    {
        "character": "王熙凤",
        "source_label": "凤姐出场",
        "text": "彩绣辉煌，恍若神妃仙子；金丝八宝攒珠髻、朝阳五凤挂珠钗、赤金盘螭缨络圈、五彩刻丝石青银鼠褂、翡翠撒花洋绉裙；丹凤三角眼、柳叶掉梢眉，身量苗条，体格风骚，粉面含春威不露，丹唇未启笑先闻。",
        "prompt_notes": ["华贵强势", "笑语先声夺人", "会奉承也会控场", "管家权力感强"],
    },
    {
        "character": "贾宝玉",
        "source_label": "宝玉初入",
        "text": "青年公子，束发嵌宝紫金冠，二龙戏珠金抹额，大红箭袖，五彩丝宫绦，石青起花八团倭缎排穗褂，青缎粉底小朝靴；面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画，鼻如悬胆，睛若秋波，项上金螭缨络并系美玉。",
        "prompt_notes": ["贵公子", "天真任性", "情感反应强", "与黛玉有似曾相识感"],
    },
    {
        "character": "贾宝玉",
        "source_label": "宝玉换常服",
        "text": "短发结小辫，顶中胎发总编大辫，黑亮如漆；银红撒花半旧大袄，项圈、宝玉、寄名锁、护身符，松绿撒花绫裤，厚底大红鞋；面如傅粉，唇若施脂，转盼多情，语言若笑。",
        "prompt_notes": ["美而多情", "孩子气", "被长辈娇养"],
    },
    {
        "character": "袭人",
        "source_label": "袭人背景",
        "text": "原为贾母之婢，本名蕊珠，心地纯良；跟随宝玉后心中只有宝玉，常规谏宝玉，因其不听而忧郁。",
        "prompt_notes": ["忠诚稳重", "照料型", "温和劝慰", "了解宝玉怪癖"],
    },
]


ENVIRONMENTS = [
    {
        "name": "宁国府门前",
        "text": "街北两个大石狮子，三间兽头大门，门前列坐十来个华冠丽服之人；正门不开，只东西角门有人出入，匾书“敕造宁国府”。",
        "use": "展示贾府门第、礼制和权势压迫感。",
    },
    {
        "name": "荣国府入门路径",
        "text": "由西角门进入，轿行一箭之远，转弯歇轿，换眉目秀洁的小厮抬至垂花门；婆子扶黛玉下轿。",
        "use": "体现内外有别、等级分工、黛玉步步留心。",
    },
    {
        "name": "贾母正房大院",
        "text": "垂花门内，两边超手游廊，正中穿堂，紫檀架子大理石屏风；转过屏风为三间厅房，厅后正房大院；正面五间上房雕梁画栋，两边游廊厢房，挂鹦鹉画眉等鸟。",
        "use": "贾母生活核心空间，热闹、华贵、规矩森严。",
    },
    {
        "name": "贾赦处院落",
        "text": "从黑油漆大门入，过仪门至院中；正房、厢房、游廊小巧别致，不似贾母处轩峻壮丽，院中树木山石皆好。",
        "use": "与荣府正院对比，偏独立、精致但权威感稍弱。",
    },
    {
        "name": "荣禧堂",
        "text": "大甬路直通大门，仪门内大院五间正房，轩昂壮丽；堂内赤金九龙青地大匾写“荣禧堂”，紫檀雕螭案、青绿古铜鼎、墨龙大画、錾金彝、玻璃盆、楠木圈椅、乌木联牌錾金字。",
        "use": "贾政/王夫人一脉的正统权力空间，适合做家族威仪背景。",
    },
    {
        "name": "王夫人东耳房",
        "text": "临窗大炕铺猩红洋毯，设大红金钱蟒引枕、秋香色金钱蟒条褥、梅花式洋漆小几、文王鼎、汝窑美人觚与时鲜花草；椅搭、脚踏、茗碗瓶花俱备。",
        "use": "内宅日常议事处，陈设华贵但较生活化。",
    },
    {
        "name": "贾母晚饭场景",
        "text": "贾母正面榻上独坐，黛玉按客位左首就坐，三春依序坐定；李纨捧杯，熙凤安箸，王夫人进羹；外间仆妇丫鬟虽多，连咳嗽声也无。",
        "use": "饭桌礼法、沉默服务、黛玉初学贾府规矩。",
    },
    {
        "name": "碧纱厨与暖阁",
        "text": "贾母安排黛玉暂住碧纱厨，宝玉在外面床上；每人奶娘丫头照管，外间上夜听唤，熙凤送来藕合色花帐、锦被缎褥。",
        "use": "宝黛初入同一生活圈，亲密但仍有礼制隔断。",
    },
]


PROMPT_SEEDS = {
    "林黛玉": {
        "identity": "姑苏林如海之女，母亲贾敏亡故后被送入荣国府依傍外祖母。",
        "appearance": "病弱清灵，眉眼含愁，举止言谈不俗，闲静如娇花照水，行动如弱柳扶风。",
        "temperament": "敏感、聪慧、自尊而谨慎；初入贾府时步步留心，时时在意，怕多言多行惹人耻笑。",
        "speech_style": "礼貌克制，常以谦辞回应；在陌生环境中少说话，回答会主动降格以避锋芒。",
        "relationships": ["贾母外孙女", "贾宝玉表妹", "王嬷嬷与雪雁随行", "后得鹦哥照应"],
        "game_prompt": "你是初入荣国府的林黛玉，身世孤清、聪敏多病。你说话要含蓄有礼，先观察规矩再回应；对怜爱会感动，对冒犯会记在心里但不轻易发作。你的核心张力是寄人篱下的谨慎与内心极高的灵性自尊。",
    },
    "贾宝玉": {
        "identity": "贾府受宠公子，衔玉而生，常在内帏姊妹中娇养。",
        "appearance": "贵公子装束华丽，面如中秋之月、色如春晓之花；常服后更显多情稚气。",
        "temperament": "天真、任性、重情，厌俗务读书，情绪来得快且激烈。",
        "speech_style": "亲昵直接，爱即兴命名和杜撰典故；遇到价值不合会突然激烈。",
        "relationships": ["贾母溺爱", "王夫人担忧", "初见黛玉即觉面善", "袭人贴身照料"],
        "game_prompt": "你是贾宝玉，荣国府里被宠坏却真情丰沛的少年。你对女儿世界天然亲近，对功名礼教抗拒；说话可以忽然诗意、忽然孩子气。遇到黛玉时，你会表现出似曾相识的亲密和强烈的共情。",
    },
    "王熙凤": {
        "identity": "贾琏之妻，王夫人内侄女，荣国府内宅实际管事者之一。",
        "appearance": "彩绣辉煌，华贵夺目，丹凤三角眼、柳叶掉梢眉，未启笑先闻。",
        "temperament": "外放、机敏、会控场，擅长奉承长辈和调度仆从，情绪转换极快。",
        "speech_style": "笑语连珠，先热络后安排事务；在长辈面前会把奉承、怜惜、能干揉在一起。",
        "relationships": ["贾母称其凤辣子", "王夫人信任其管事", "初见黛玉即以妹妹相待"],
        "game_prompt": "你是王熙凤，荣国府内宅明艳强势的管家型人物。你出场要有声势，说话热络、漂亮、带掌控感；你会迅速判断场面，既讨长辈欢心，也把仆从事务安排下去。",
    },
    "贾母": {
        "identity": "荣国府最高长辈，黛玉外祖母，宝玉祖母。",
        "appearance": "鬓发如银，由人扶持，却仍是内宅秩序中心。",
        "temperament": "慈爱、权威、重亲情；对黛玉之母贾敏亡故极伤心，对宝玉极溺爱。",
        "speech_style": "长辈口吻，亲热中带命令；能用家族权威迅速安置人事。",
        "relationships": ["怜惜黛玉", "溺爱宝玉", "能调动王夫人、凤姐、三春及众仆"],
        "game_prompt": "你是贾母，荣国府内宅的最高权威。你对晚辈亲热慈爱，却不需要解释自己的决定；你的话能立即改变座次、住处和人事安排。",
    },
    "王夫人": {
        "identity": "贾政之妻，宝玉之母，黛玉二舅母。",
        "appearance": "文本重在其居处和持家位置，未作细致外貌描写。",
        "temperament": "稳重、克制、守礼，担忧宝玉顽劣，提醒黛玉不要招惹。",
        "speech_style": "低调直接，吩咐事务时不夸张；对黛玉温和但保持长辈距离。",
        "relationships": ["凤姐向其回管家事务", "宝玉之母", "黛玉二舅母"],
        "game_prompt": "你是王夫人，荣国府里稳重克制的长辈。你说话不多，但话语有分量；对宝玉既爱又忧，对新来的黛玉会提醒规矩和风险。",
    },
    "贾探春": {
        "identity": "贾府三春之一。",
        "appearance": "削肩细腰，俊眼修眉，顾盼神飞，文彩精华。",
        "temperament": "机敏有才气，敢接宝玉的话追问出典。",
        "speech_style": "爽利、带一点辨伪的锋芒。",
        "relationships": ["黛玉表姊妹", "与迎春惜春同出场"],
        "game_prompt": "你是贾探春，贾府姊妹中神采飞扬、聪敏有锋芒的一位。你说话不拖泥带水，遇到杜撰或空泛说法会追问出处。",
    },
    "袭人": {
        "identity": "宝玉大丫鬟，原名蕊珠，原为贾母之婢。",
        "appearance": "本回没有细写外貌，重在心性和照料职责。",
        "temperament": "心地纯良，忠于所服侍之人，温和但会规劝。",
        "speech_style": "劝慰式、照料式，能把宝玉怪异行为解释成日后还会常见的事。",
        "relationships": ["贴身照料宝玉", "夜间安慰黛玉", "与鹦哥共同在碧纱厨照看"],
        "game_prompt": "你是袭人，宝玉身边稳妥细致的大丫鬟。你说话温柔实际，优先安抚情绪、维持秩序，并会用熟悉宝玉的经验劝别人不要过分惊慌。",
    },
}


EVENTS = [
    {"id": "e01", "title": "贾雨村借林如海荐书入都", "characters": ["贾雨村", "林如海", "贾政"]},
    {"id": "e02", "title": "林黛玉拜别父亲入京", "characters": ["林黛玉", "林如海", "王嬷嬷", "雪雁"]},
    {"id": "e03", "title": "黛玉从西角门进入荣国府", "characters": ["林黛玉", "仆妇", "小厮"]},
    {"id": "e04", "title": "黛玉拜见贾母和三春", "characters": ["林黛玉", "贾母", "王夫人", "邢夫人", "李纨", "迎春", "探春", "惜春"]},
    {"id": "e05", "title": "王熙凤声势夺人地出场", "characters": ["王熙凤", "林黛玉", "贾母", "王夫人"]},
    {"id": "e06", "title": "黛玉往贾赦处未见贾赦", "characters": ["林黛玉", "邢夫人", "贾赦"]},
    {"id": "e07", "title": "黛玉见王夫人并听宝玉禁忌", "characters": ["林黛玉", "王夫人", "贾宝玉"]},
    {"id": "e08", "title": "贾母处晚饭与内宅礼法", "characters": ["贾母", "林黛玉", "王夫人", "李纨", "王熙凤", "迎春", "探春", "惜春"]},
    {"id": "e09", "title": "宝黛初见与摔玉", "characters": ["林黛玉", "贾宝玉", "贾母", "探春"]},
    {"id": "e10", "title": "黛玉安置碧纱厨，袭人夜慰", "characters": ["林黛玉", "贾宝玉", "贾母", "袭人", "鹦哥", "王嬷嬷", "雪雁"]},
]


PLAN = """# 红楼梦素材提取方案

目标：把原文拆成游戏可用的角色背景 prompt 素材，包括台词、外貌描写、环境描写、关系、礼法和事件上下文。

## 1. 文本准备

- 保留原始章节文件，不直接覆盖。
- 建立章节级 `raw_chapter.txt`，统一换行、编码和章节标题。
- 对已知乱码保留原文，同时在 `notes` 中标记，后续可用多来源校勘修复。

## 2. 结构化切分

- 章节先切为事件段：入京、进府、拜见、出场、用饭、初见、安置等。
- 每段再抽三类素材：
  - `dialogue`：直接引语和间接转述。
  - `appearance`：衣着、眉眼、身量、神态、病弱/气质。
  - `environment`：门第、院落、房间、陈设、礼法和仆从秩序。

## 3. 人物归属

- 建人物别名表：如 `林黛玉/黛玉/林姑娘/妹妹`，`王熙凤/熙凤/凤姐/琏二嫂子/凤辣子`。
- 台词归属先用规则判断：`X道/笑道/问道/回道/骂道/哭道/命/叫/报道`。
- 找不到说话人的条目不丢弃，标为 `未判定` 或 `needs_review`。

## 4. prompt 组装

每个角色生成这些字段：

- `identity`：身份、入场位置、家族关系。
- `appearance`：可视化外貌和服饰。
- `temperament`：性格、欲望、禁忌、情绪触发点。
- `speech_style`：常用语气、称呼、长短句风格。
- `relationships`：与主角和其他 NPC 的关系边。
- `game_prompt`：可直接喂给 NPC 的背景 prompt seed。

## 5. 质量控制

- 每条素材保留来源章节和片段 id。
- 自动抽取只做第一稿；关键 NPC prompt 必须人工审一遍，避免把旁白、匾额、内心独白误当台词。
- 后续可把 120 回批处理成 `character_id -> evidence -> prompt_seed` 的数据集，再接入你游戏里的人物配置。
"""


def write_markdown_grouped_dialogues(quotes: list[dict[str, object]]) -> str:
    grouped: dict[str, list[dict[str, object]]] = defaultdict(list)
    for item in quotes:
        grouped[str(item["speaker"])].append(item)
    lines = ["# 第三回台词/引语试切", "", "> 这是规则抽取第一稿；`needs_review` 表示需要人工校对说话人。", ""]
    for speaker in sorted(grouped):
        lines.append(f"## {speaker}")
        for item in grouped[speaker]:
            type_label = item["type"]
            confidence = item["confidence"]
            lines.append(f"- `{item['id']}` `{type_label}` `{confidence}`：{item['text']}")
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def write_appearances() -> str:
    lines = ["# 第三回外貌/人物描写试切", ""]
    for item in APPEARANCES:
        lines.append(f"## {item['character']}｜{item['source_label']}")
        lines.append(item["text"])
        lines.append("")
        lines.append("prompt notes: " + "；".join(item["prompt_notes"]))
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def write_environments() -> str:
    lines = ["# 第三回环境/礼法描写试切", ""]
    for item in ENVIRONMENTS:
        lines.append(f"## {item['name']}")
        lines.append(item["text"])
        lines.append("")
        lines.append("game use: " + item["use"])
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def write_prompt_seeds() -> str:
    lines = ["# 第三回角色 prompt seeds", "", "> 这些是从本回证据归纳的背景种子稿，适合再合并后续章节证据。", ""]
    for name, data in PROMPT_SEEDS.items():
        lines.append(f"## {name}")
        lines.append(f"- identity: {data['identity']}")
        lines.append(f"- appearance: {data['appearance']}")
        lines.append(f"- temperament: {data['temperament']}")
        lines.append(f"- speech_style: {data['speech_style']}")
        lines.append("- relationships: " + "；".join(data["relationships"]))
        lines.append("")
        lines.append("game_prompt:")
        lines.append("")
        lines.append(data["game_prompt"])
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    text = normalize_text(SOURCE.read_text(encoding="utf-8"))
    quotes = extract_quotes(text)

    (ROOT / "extraction_plan.md").write_text(PLAN, encoding="utf-8")
    (OUT / "raw_chapter_003.txt").write_text(text, encoding="utf-8")
    (OUT / "events.json").write_text(json.dumps(EVENTS, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "quotes.jsonl").write_text(
        "\n".join(json.dumps(item, ensure_ascii=False) for item in quotes) + "\n",
        encoding="utf-8",
    )
    (OUT / "dialogues_by_character.md").write_text(write_markdown_grouped_dialogues(quotes), encoding="utf-8")
    (OUT / "appearances.md").write_text(write_appearances(), encoding="utf-8")
    (OUT / "appearances.json").write_text(json.dumps(APPEARANCES, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "environments.md").write_text(write_environments(), encoding="utf-8")
    (OUT / "environments.json").write_text(json.dumps(ENVIRONMENTS, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "prompt_seeds.md").write_text(write_prompt_seeds(), encoding="utf-8")
    (OUT / "prompt_seeds.json").write_text(json.dumps(PROMPT_SEEDS, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {
        "chapter": "第三回 托内兄如海荐西宾　接外孙贾母惜孤女",
        "source": str(SOURCE),
        "quote_items": len(quotes),
        "appearance_items": len(APPEARANCES),
        "environment_items": len(ENVIRONMENTS),
        "event_items": len(EVENTS),
        "note": "台词归属为规则抽取第一稿；重点 NPC prompt seed 已人工归纳。",
    }
    (OUT / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
