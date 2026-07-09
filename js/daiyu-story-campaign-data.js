window.DAIYU_STORY_DATA = {
  "campaignId": "daiyu_first_person_original_flavor",
  "title": "林黛玉入府与玉事三折",
  "version": "0.1.0",
  "perspective": {
    "playerCharacterId": "daiyu",
    "narrationPerson": "second_person",
    "tone": "原书旁白近似，少白话，少现代心理术语",
    "freedom": "limited_branching",
    "canonPolicy": "不改人物本性，不改大事件，只允许误会程度、旁人介入早晚、关系数值和小结局轻微改变"
  },
  "sourceMaterial": {
    "conversationScenes": "/Users/bytedance/Desktop/myCursor/game/hongloumeng_original/selected_chapters_conversations/all_conversation_scenes.json",
    "interactionPatterns": "/Users/bytedance/Desktop/myCursor/game/hongloumeng_original/selected_chapters_conversations/interaction_patterns.json",
    "chapters": [
      "第三回 林黛玉进贾府",
      "第十七回 大观园题额后荷包香袋",
      "第二十九回 清虚观后白认得你"
    ]
  },
  "runtimeSupport": {
    "status": "design_asset",
    "note": "本文件尚未接入现有 JS 运行时。接入时需要 story node / choice effect / skill check / relationship event 解释器。",
    "compatibleConcepts": [
      "relations.affection/trust/friendship/submission",
      "charSpecialtyConfig.profiles.daiyu",
      "jiafu-order skillDefs and personSkillConfig",
      "quest/story node reward shape"
    ]
  },
  "playerInitialState": {
    "skills": {
      "ritual": 90,
      "literacy": 100,
      "insight": 95,
      "eloquence": 80,
      "subtlety": 70,
      "adaptability": 65,
      "poetry": 2,
      "talk": 2,
      "move": 1
    },
    "traits": [
      "mingan",
      "duochou",
      "gupi",
      "gengzhi",
      "xijing",
      "shaochi"
    ],
    "specialties": [
      "solitude_poetry",
      "wind_tear",
      "frail"
    ],
    "traitState": {
      "daiyu_composure": 1,
      "daiyu_wounded_pride": 0,
      "daiyu_hidden_affection": 1,
      "daiyu_fatigue": 1,
      "jade_conflict_heat": 0,
      "baoyu_reassurance": 0,
      "servant_mediation": 0
    },
    "relations": {
      "jiamu": {
        "affection": 58,
        "trust": 46,
        "friendship": 20
      },
      "baoyu": {
        "affection": 30,
        "trust": 18,
        "friendship": 22
      },
      "xifeng": {
        "affection": 12,
        "trust": 8,
        "friendship": 5
      },
      "zijuan": {
        "affection": 50,
        "trust": 62,
        "friendship": 55
      },
      "xiren": {
        "affection": 16,
        "trust": 10,
        "friendship": 8
      },
      "baochai": {
        "affection": 10,
        "trust": 18,
        "friendship": 12
      }
    },
    "globalScores": {
      "order": 50,
      "morale": 50,
      "dignity": 50,
      "affinity": 50
    }
  },
  "effectTypes": {
    "axis": "关系轴变化，targetId + axis + delta",
    "traitState": "素材层临时性格/情绪变量变化",
    "skillXp": "技能经验或关卡内技能倾向变化",
    "globalScore": "法度、人心、体面、情分变化",
    "storyFlag": "分支标记",
    "unlockNode": "解锁后续节点",
    "npcLine": "旁人即时发言或气泡"
  },
  "chapters": [
    {
      "chapterId": "daiyu_ch01_enter_jiafu",
      "title": "步步留心",
      "sourceSceneIds": [
        "ch003_scene_entrance_etiquette",
        "ch003_scene_xifeng_entrance",
        "ch003_scene_baodai_first_meeting",
        "ch003_scene_xiren_comforts_daiyu"
      ],
      "objective": "在荣国府第一次亮相，完成拜见、识人、安顿。",
      "entryNode": "enter_01_gate",
      "nodes": [
        {
          "nodeId": "enter_01_gate",
          "title": "西角门",
          "scene": "荣国府门前",
          "narration": "且说黛玉自那日弃舟登岸时，便有荣府打发轿子并拉行李车辆伺候。这黛玉尝听得母亲说，他外祖母家与别人家不同。他近日所见的这几个三等的仆妇，吃穿用度已是不凡，何况今至其家，都要步步留心，时时在意，不要多说一句话，不可多行一步路，恐被人耻笑了去。自上了轿，进了城，从纱窗中瞧了一瞧，其街市之繁华，人烟之阜盛，自非别处可比。又行了半日，忽见街北蹲着两个大石狮子，三间兽头大门，门前列坐着十来个华冠丽服之人，正门不开，只东西两角门有人出入。正门之上有一匾，匾上大书“敕造宁国府”五个大字。黛玉想道：“这是外祖的长房了。”又往西不远，照样也是三间大门，方是“荣国府”，却不进正门，只由西角门而进。",
          "choices": [
            {
              "choiceId": "observe_rules",
              "label": "隔帘细看门第与仆从规矩",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 70
                }
              ],
              "text": "先看清人如何行走、何处下轿，再随婆子入内。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                }
              ],
              "next": "enter_01b_screen"
            },
            {
              "choiceId": "ask_mama",
              "label": "低声问王嬷嬷：下轿先迈哪只脚？",
              "requires": [
                {
                  "type": "relation",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "gte": 0
                }
              ],
              "text": "这话问得极轻，近乎荒唐，却是真真切切怕错了一步。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "npcLine",
                  "speaker": "王嬷嬷",
                  "text": "姑娘只稳稳扶着我，脚步轻些就是。"
                }
              ],
              "next": "enter_01b_screen"
            },
            {
              "choiceId": "hold_silence",
              "label": "一概不问，只低头随行",
              "requires": [
                {
                  "type": "trait",
                  "id": "xijing"
                }
              ],
              "text": "你宁可少知道些，也不愿此刻显得张皇。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                }
              ],
              "next": "enter_01b_screen"
            },
            {
              "choiceId": "lift_curtain_once",
              "label": "悄悄挑帘一线，看清正门为何不开",
              "requires": [
                {
                  "type": "skill",
                  "id": "subtlety",
                  "gte": 65
                }
              ],
              "text": "帘角一动即落，你记下石狮、角门、仆妇行止，也记下这家门第规矩重。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "peeked_curtain",
                  "value": true
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                }
              ],
              "next": "enter_01b_screen"
            }
          ]
        },
        {
          "nodeId": "enter_01b_screen",
          "title": "垂花门",
          "scene": "贾母正房前",
          "narration": "轿子抬着走了一箭之远，将转弯时便歇了轿，后面的婆子也都下来了，另换了四个眉目秀洁的十七八岁的小厮上来，抬着轿子，众婆子步下跟随。至一垂花门前落下，那小斯俱肃然退出，众婆子上前打起轿帘，扶黛玉下了轿。黛玉扶着婆子的手进了垂花门，两边是超手游廊，正中是穿堂，当地放着一个紫檀架子大理石屏风。转过屏风，小小三间厅房，厅后便是正房大院。正面五间上房，皆是雕梁画栋，两边穿山游廊厢房，挂着各色鹦鹉画眉等雀鸟。台阶上坐着几个穿红着绿的丫头，一见他们来了，都笑迎上来道：“刚才老太太还念诵呢!可巧就来了。”于是三四人争着打帘子。一面听得人说：“林姑娘来了！”",
          "choices": [
            {
              "choiceId": "step_down_with_support",
              "label": "扶着婆子的手下轿，脚步放轻",
              "requires": [],
              "text": "你借着婆子的手落地，既不抢先，也不迟疑。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "move",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                }
              ],
              "next": "enter_02_jiamu"
            },
            {
              "choiceId": "look_at_screen_then_birds",
              "label": "只扫一眼屏风与雀鸟，立刻收回目光",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 80
                }
              ],
              "text": "你把荣府的富贵看在眼里，却不让眼神在富贵上停久。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                }
              ],
              "next": "enter_02_jiamu"
            },
            {
              "choiceId": "freeze_at_lin_guniang",
              "label": "听见“林姑娘来了”，心中一酸",
              "requires": [
                {
                  "type": "trait",
                  "id": "duochou"
                }
              ],
              "text": "从前在父母身边不过是女儿，如今先成了外祖母家口中的“林姑娘”。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "affection",
                  "delta": 1
                }
              ],
              "next": "enter_02_jiamu"
            }
          ]
        },
        {
          "nodeId": "enter_02_jiamu",
          "title": "心肝儿肉",
          "scene": "贾母正房",
          "narration": "黛玉方进房，只见两个人扶着一位鬓发如银的老母迎上来。黛玉知是外祖母了，正欲下拜，早被外祖母抱住，搂入怀中，“心肝儿肉”叫着大哭起来。当下侍立之人无不下泪，黛玉也哭个不休。众人慢慢解劝，那黛玉方拜见了外祖母。贾母方一一指与黛玉道：“这是你大舅母。这是二舅母。这是你先前珠大哥的媳妇珠大嫂子。”黛玉一一拜见。",
          "choices": [
            {
              "choiceId": "cry_and_bow",
              "label": "先随外祖母痛哭，稍定后再补礼",
              "requires": [
                {
                  "type": "trait",
                  "id": "mingan"
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "affection",
                  "delta": 6
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "trust",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": -1
                },
                {
                  "type": "npcLine",
                  "speaker": "贾母",
                  "text": "好孩子，只管在我这里。"
                }
              ],
              "next": "enter_02b_sisters_medicine"
            },
            {
              "choiceId": "complete_ritual_first",
              "label": "忍泪先拜见诸位长辈",
              "requires": [
                {
                  "type": "skill",
                  "id": "ritual",
                  "gte": 85
                }
              ],
              "effects": [
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": 2
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "affection",
                  "delta": 3
                }
              ],
              "next": "enter_02b_sisters_medicine"
            },
            {
              "choiceId": "suppress_too_much",
              "label": "强忍不哭，怕失了体面",
              "requires": [
                {
                  "type": "trait",
                  "id": "gupi"
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "affection",
                  "delta": 1
                }
              ],
              "next": "enter_02b_sisters_medicine"
            }
          ]
        },
        {
          "nodeId": "enter_02b_sisters_medicine",
          "title": "三春与药",
          "scene": "贾母正房",
          "narration": "贾母又叫：“请姑娘们。今日远客来了，可以不必上学去。”众人答应了一声，便去了两个。不一时，只见三个奶妈并五六个丫鬟，拥着三位姑娘来了。第一个肌肤微丰，身材合中，腮凝新荔，鼻腻鹅脂，温柔沉默，观之可亲。第二个削肩细腰，长挑身材，鸭蛋脸儿，俊眼修眉，顾盼神飞，文彩精华，见之忘俗。第三个身量未足，形容尚小。其钗环裙袄，三人皆是一样的妆束。黛玉忙起身迎上来见礼，互相厮认，归了坐位。众人见黛玉年纪虽小，其举止言谈不俗，身体面貌虽弱不胜衣，却有一段风流态度，便知他有不足之症。因问：“常服何药?为何不治好了？”黛玉道：“我自来如此，从会吃饭时便吃药，到如今了，经过多少名医，总未见效。”",
          "choices": [
            {
              "choiceId": "rise_to_sisters",
              "label": "忙起身迎三位姊妹，先把礼做足",
              "requires": [],
              "text": "你见三春妆束一样，气质却各不同，只先以晚来客自处。",
              "effects": [
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": 1
                },
                {
                  "type": "skillXp",
                  "skill": "ritual",
                  "delta": 1
                }
              ],
              "next": "enter_03_xifeng"
            },
            {
              "choiceId": "medicine_plain_answer",
              "label": "照原话说病与人参养荣丸",
              "requires": [
                {
                  "type": "trait",
                  "id": "gengzhi"
                }
              ],
              "text": "你不把病说轻，也不借病求怜，只按实说了。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "trust",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_fatigue",
                  "delta": 1
                }
              ],
              "next": "enter_03_xifeng"
            },
            {
              "choiceId": "medicine_make_light",
              "label": "把病说得轻些，免得众人多问",
              "requires": [
                {
                  "type": "skill",
                  "id": "subtlety",
                  "gte": 70
                }
              ],
              "text": "你笑说不过自幼体弱，省去和尚疯话，只让话题轻轻过去。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "skillXp",
                  "skill": "subtlety",
                  "delta": 1
                }
              ],
              "next": "enter_03_xifeng"
            }
          ]
        },
        {
          "nodeId": "enter_03_xifeng",
          "title": "凤辣子",
          "scene": "贾母正房",
          "narration": "一语未完，只听后院中有笑语声，说：“我来迟了，没得迎接远客！”黛玉思忖道：“这些人个个皆敛声屏气如此，这来者是谁，这样放诞无礼？”心下想时，只见一群媳妇丫鬟拥着一个丽人从后房进来。这个人打扮与姑娘们不同，彩绣辉煌，恍若神妃仙子。黛玉连忙起身接见。贾母笑道：“你不认得他：他是我们这里有名的一个泼辣货，南京所谓‘辣子’，你只叫他‘凤辣子’就是了。”黛玉正不知以何称呼，众姊妹都忙告诉黛玉道：“这是琏二嫂子。”黛玉虽不曾识面，听见他母亲说过：大舅贾赦之子贾琏，娶的就是二舅母王氏的内侄女；自幼假充男儿教养，学名叫做王熙凤。黛玉忙陪笑见礼，以“嫂”呼之。",
          "choices": [
            {
              "choiceId": "receive_warmly",
              "label": "陪笑见礼，顺着众姊妹称琏二嫂子",
              "requires": [
                {
                  "type": "skill",
                  "id": "ritual",
                  "gte": 70
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "xifeng",
                  "axis": "affection",
                  "delta": 4
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "trust",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                }
              ],
              "next": "enter_03b_xifeng_questions"
            },
            {
              "choiceId": "read_the_room",
              "label": "看她如何奉承外祖母，再少言应对",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 85
                }
              ],
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "knows_xifeng_controls_room",
                  "value": true
                }
              ],
              "next": "enter_03b_xifeng_questions"
            },
            {
              "choiceId": "answer_plainly",
              "label": "只按礼答话，不接她的热络",
              "requires": [
                {
                  "type": "trait",
                  "id": "gupi"
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "xifeng",
                  "axis": "affection",
                  "delta": -1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "npcLine",
                  "speaker": "王熙凤",
                  "text": "林妹妹果然是个仔细人。"
                }
              ],
              "next": "enter_03b_xifeng_questions"
            },
            {
              "choiceId": "almost_call_fenglazi",
              "label": "差点真叫“凤辣子”，临出口改成嫂子",
              "requires": [
                {
                  "type": "skill",
                  "id": "adaptability",
                  "gte": 60
                }
              ],
              "text": "你听老祖宗说得亲热，几乎照叫；话到唇边，仍随姊妹称“琏二嫂子”。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "adaptability",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "xifeng",
                  "axis": "affection",
                  "delta": 3
                },
                {
                  "type": "npcLine",
                  "speaker": "王熙凤",
                  "text": "妹妹这样伶俐，怪不得老祖宗疼。"
                }
              ],
              "next": "enter_03b_xifeng_questions"
            }
          ]
        },
        {
          "nodeId": "enter_03b_xifeng_questions",
          "title": "天下真有这样标致人儿",
          "scene": "贾母正房",
          "narration": "这熙凤携着黛玉的手，上下细细打量一回，便仍送至贾母身边坐下，因笑道：“天下真有这样标致人儿!我今日才算看见了!况且这通身的气派竟不像老祖宗的外孙女儿，竟是嫡亲的孙女儿似的，怨不得老祖宗天天嘴里心里放不下。只可怜我这妹妹这么命苦，怎么姑妈偏就去世了呢！”说着便用帕拭泪。贾母笑道：“我才好了，你又来招我。你妹妹远路才来，身子又弱，也才劝住了，快别再提了。”熙凤听了，忙转悲为喜道：“正是呢!我一见了妹妹，一心都在他身上，又是喜欢，又是伤心，竟忘了老祖宗了，该打，该打！”又忙拉着黛玉的手问道：“妹妹几岁了?可也上过学?现吃什么药?在这里别想家，要什么吃的、什么玩的，只管告诉我。丫头老婆们不好，也只管告诉我。”黛玉一一答应。",
          "choices": [
            {
              "choiceId": "answer_xifeng_one_by_one",
              "label": "一一答应，只说要烦嫂子照应",
              "requires": [],
              "text": "凤姐问得密，你答得轻，既不推辞她的好意，也不立刻求什么。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "xifeng",
                  "axis": "trust",
                  "delta": 3
                },
                {
                  "type": "globalScore",
                  "id": "affinity",
                  "delta": 1
                }
              ],
              "next": "enter_03c_rongxitang"
            },
            {
              "choiceId": "ask_for_quiet_room",
              "label": "只说自己身子弱，求一处清静歇息",
              "requires": [
                {
                  "type": "trait",
                  "id": "frail"
                }
              ],
              "text": "你不求吃穿玩物，只求清静。凤姐立刻记下屋子与人手。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "xifeng",
                  "axis": "trust",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_fatigue",
                  "delta": -1
                },
                {
                  "type": "storyFlag",
                  "id": "asks_quiet_room",
                  "value": true
                }
              ],
              "next": "enter_03c_rongxitang"
            },
            {
              "choiceId": "test_xifeng_power",
              "label": "借问丫头婆子规矩，看凤姐如何接话",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 90
                }
              ],
              "text": "你不问自己要什么，反问在府里该如何吩咐人，想探出凤姐管辖的边界。",
              "effects": [
                {
                  "type": "storyFlag",
                  "id": "knows_xifeng_controls_room",
                  "value": true
                },
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "xifeng",
                  "axis": "trust",
                  "delta": 1
                }
              ],
              "next": "enter_03c_rongxitang"
            }
          ]
        },
        {
          "nodeId": "enter_03c_rongxitang",
          "title": "荣禧堂",
          "scene": "王夫人处",
          "narration": "一时黛玉进入荣府，下了车，只见一条大甬路直接出大门来。众嬷嬷引着便往东转弯，走过一座东西穿堂、向南大厅之后，仪门内大院落，上面五间大正房，两边厢房鹿顶，耳门钻山，四通八达，轩昂壮丽，比各处不同。黛玉便知这方是正内室。进入堂屋，抬头迎面先见一个赤金九龙青地大匾，匾上写着斗大三个字，是“荣禧堂”；后有一行小字：“某年月日书赐荣国公贾源”，又有“万几宸翰”之宝。大紫檀雕螭案上设着三尺多高青绿古铜鼎，悬着待漏随朝墨龙大画，一边是錾金彝，一边是玻璃盆。地下两溜十六张楠木圈椅。又有一副对联，乃是乌木联牌镶着錾金字迹，道是：\n座上珠玑昭日月，\n堂前黼黻焕烟霞。",
          "choices": [
            {
              "choiceId": "read_couplet_inwardly",
              "label": "默读对联，不出口评议",
              "requires": [
                {
                  "type": "skill",
                  "id": "literacy",
                  "gte": 85
                }
              ],
              "text": "“座上珠玑昭日月，堂前黼黻焕烟霞。”你只在心里默念。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "literacy",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                }
              ],
              "next": "enter_03d_seat_first"
            },
            {
              "choiceId": "count_chairs",
              "label": "数清两溜十六张楠木圈椅",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 75
                }
              ],
              "text": "你把椅子、脚踏、炕沿都记住，预备下一步不坐错地方。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "noticed_seating_order",
                  "value": true
                }
              ],
              "next": "enter_03d_seat_first"
            },
            {
              "choiceId": "ask_if_this_is_zheng_room",
              "label": "低声问：这可是二舅舅正室？",
              "requires": [
                {
                  "type": "relation",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "gte": 0
                }
              ],
              "text": "你问得极轻，问完便知自己多嘴。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                }
              ],
              "next": "enter_03d_seat_first"
            }
          ]
        },
        {
          "nodeId": "enter_03d_seat_first",
          "title": "东边椅上",
          "scene": "王夫人东耳房",
          "narration": "原来王夫人时常居坐宴息也不在这正室中，只在东边的三间耳房内。于是嬷嬷们引黛玉进东房门来。临窗大炕上铺着猩红洋毯，正面设着大红金钱蟒引枕，秋香色金钱蟒大条褥，两边设一对梅花式洋漆小几，左边几上摆着文王鼎，鼎旁匙箸香盒，右边几上摆着汝窑美人觚，里面插着时鲜花草。地下面西一溜四张大椅，都搭着银红撒花椅搭，底下四副脚踏；两边又有一对高几，几上茗碗瓶花俱备。其馀陈设，不必细说。老嬷嬷让黛玉上炕坐。炕沿上却也有两个锦褥对设。黛玉度其位次，便不上炕，只就东边椅上坐了。",
          "choices": [
            {
              "choiceId": "canon_sit_east_chair",
              "label": "度其位次，只坐东边椅上",
              "requires": [],
              "text": "你不上炕，也不推来推去，只依自己度出的位次坐下。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "ritual",
                  "delta": 2
                },
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                }
              ],
              "next": "enter_03e_seat_second"
            },
            {
              "choiceId": "obey_mama_on_kang",
              "label": "既是老嬷嬷让，上炕沿锦褥坐",
              "requires": [],
              "text": "你依了眼前人的话，却立刻觉得这位次未必妥当。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": -1
                },
                {
                  "type": "npcLine",
                  "speaker": "王嬷嬷",
                  "text": "姑娘才来，依人让座也不算错。"
                }
              ],
              "next": "enter_03e_seat_second"
            },
            {
              "choiceId": "stand_until_tea",
              "label": "迟迟不坐，等茶来了才挨椅边",
              "requires": [
                {
                  "type": "skill",
                  "id": "subtlety",
                  "gte": 75
                }
              ],
              "text": "你把“不敢坐错”做到了极处，连丫鬟捧茶都慢了一拍。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "subtlety",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": -1
                }
              ],
              "next": "enter_03e_seat_second"
            }
          ]
        },
        {
          "nodeId": "enter_03e_seat_second",
          "title": "王夫人再三让",
          "scene": "王夫人小正房",
          "narration": "茶未吃了，只见一个穿红绫袄青绸掐牙背心的一个丫鬟走来笑道：“太太说：请林姑娘到那边坐罢。”老嬷嬷听了，于是又引黛玉出来，到了东南三间小正房内。正面炕上横设一张炕桌，上面堆着书籍茶具，靠东壁面西设着半旧的青缎靠背引枕。王夫人却坐在西边下首，亦是半旧青缎靠背坐褥，见黛玉来了，便往东让。黛玉心中料定这是贾政之位，因见挨炕一溜三张椅子上也搭着半旧的弹花椅袱，黛玉便向椅上坐了。王夫人再三让他上炕，他方挨王夫人坐下。",
          "choices": [
            {
              "choiceId": "canon_chair_then_kang",
              "label": "先向椅上坐，王夫人再三让后方上炕",
              "requires": [],
              "text": "你先避开贾政之位，待王夫人再三相让，才挨着她坐下。",
              "effects": [
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": 2
                },
                {
                  "type": "skillXp",
                  "skill": "ritual",
                  "delta": 2
                }
              ],
              "next": "enter_03f_baoyu_warning"
            },
            {
              "choiceId": "sit_kang_at_once",
              "label": "王夫人一让，便上炕坐下",
              "requires": [],
              "text": "你顺着长辈意思坐下，少了推让，也少了一重试探。",
              "effects": [
                {
                  "type": "globalScore",
                  "id": "affinity",
                  "delta": 1
                },
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": -1
                }
              ],
              "next": "enter_03f_baoyu_warning"
            },
            {
              "choiceId": "ask_if_can_chair",
              "label": "轻声道：侄女坐椅上便好",
              "requires": [
                {
                  "type": "skill",
                  "id": "eloquence",
                  "gte": 75
                }
              ],
              "text": "你把推让说出口，礼更明白，也更显得小心。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "eloquence",
                  "delta": 1
                },
                {
                  "type": "npcLine",
                  "speaker": "王夫人",
                  "text": "你只管过来坐。"
                }
              ],
              "next": "enter_03f_baoyu_warning"
            }
          ]
        },
        {
          "nodeId": "enter_03f_baoyu_warning",
          "title": "混世魔王",
          "scene": "王夫人小正房",
          "narration": "王夫人因说：“你舅舅今日斋戒去了，再见罢。只是有句话嘱咐你：你三个姐妹倒都极好，以后一处念书认字，学针线，或偶一玩笑，却都有个尽让的。我就只一件不放心：我有一个孽根祸胎，是家里的‘混世魔王’，今日因往庙里还愿去，尚未回来，晚上你看见就知道了。你以后总不用理会他，你这些姐姐妹妹都不敢沾惹他的。”黛玉素闻母亲说过，有个内侄乃衔玉而生，顽劣异常，不喜读书，最喜在内帏厮混，外祖母又溺爱，无人敢管。今见王夫人所说，便知是这位表兄，一面陪笑道：“舅母所说，可是衔玉而生的?在家时记得母亲常说，这位哥哥比我大一岁，小名就叫宝玉，性虽憨顽，说待姊妹们却是极好的。况我来了，自然和姊妹们一处，弟兄们是另院别房，岂有沾惹之理？”",
          "choices": [
            {
              "choiceId": "canon_reassure_wang",
              "label": "照原文应对：自然和姊妹们一处",
              "requires": [
                {
                  "type": "skill",
                  "id": "ritual",
                  "gte": 70
                }
              ],
              "text": "你既认出宝玉，又把男女院落分寸先说清。",
              "effects": [
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "heard_baoyu_warning",
                  "value": true
                }
              ],
              "next": "enter_03g_dinner_books"
            },
            {
              "choiceId": "silent_about_baoyu",
              "label": "只一一答应，不接宝玉的话",
              "requires": [
                {
                  "type": "trait",
                  "id": "xijing"
                }
              ],
              "text": "你把宝玉两个字压在心里，只应王夫人的嘱咐。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "trust",
                  "delta": 1
                }
              ],
              "next": "enter_03g_dinner_books"
            },
            {
              "choiceId": "ask_how_not_to_rouse",
              "label": "问一句：怎样才算“不理会他”？",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 85
                }
              ],
              "text": "你把王夫人的话当成一条府内规矩，想问清边界。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 1
                },
                {
                  "type": "npcLine",
                  "speaker": "王夫人",
                  "text": "他嘴里一时甜言蜜语，一时有天没日，疯疯傻傻，只休信他。"
                }
              ],
              "next": "enter_03g_dinner_books"
            }
          ]
        },
        {
          "nodeId": "enter_03g_dinner_books",
          "title": "念何书",
          "scene": "贾母后院",
          "narration": "忽见一个丫鬟来说：“老太太那里传晚饭了。”王夫人忙携了黛玉出后房门，由后廊往西。王夫人笑指向黛玉道：“这是你凤姐姐的屋子。回来你好往这里找他去，少什么东西只管和他说就是了。”于是进入后房门，已有许多人在此伺候，见王夫人来，方安设桌椅。贾珠之妻李氏捧杯，熙凤安箸，王夫人进羹。贾母正面榻上独坐，两旁四张空椅。熙凤忙拉黛玉在左边第一张椅子上坐下，黛玉十分推让。贾母笑道：“你舅母和嫂子们是不在这里吃饭的。你是客，原该这么坐。”黛玉方告了坐，就坐了。\n饭毕，贾母因问黛玉念何书。黛玉道：“刚念了《四书》。”黛玉又问姊妹们读何书，贾母道：“读什么书，不过认几个字罢了。”",
          "choices": [
            {
              "choiceId": "canon_four_books",
              "label": "照实答：刚念了《四书》",
              "requires": [],
              "text": "你说得自然，却随即听出外祖母并不愿姊妹们以读书为重。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "literacy",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "said_four_books_first",
                  "value": true
                }
              ],
              "next": "enter_04_baoyu"
            },
            {
              "choiceId": "modest_after_jiamu",
              "label": "听出贾母口风，补一句“不过认得几个字”",
              "requires": [
                {
                  "type": "skill",
                  "id": "adaptability",
                  "gte": 65
                }
              ],
              "text": "你顺着外祖母的话收住锋芒，才情藏进袖中。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "adaptability",
                  "delta": 1
                },
                {
                  "type": "skillXp",
                  "skill": "subtlety",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                }
              ],
              "next": "enter_04_baoyu"
            },
            {
              "choiceId": "ask_sisters_more",
              "label": "追问姊妹们平日还读诗不读",
              "requires": [
                {
                  "type": "skill",
                  "id": "literacy",
                  "gte": 95
                }
              ],
              "text": "你忍不住问深一层，话一出口便知道自己露了性情。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "poetry",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "trust",
                  "delta": -1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                }
              ],
              "next": "enter_04_baoyu"
            },
            {
              "choiceId": "wild_no_books",
              "label": "离谱一点：笑道若在此处不必读书，倒也省心",
              "requires": [
                {
                  "type": "skill",
                  "id": "eloquence",
                  "gte": 88
                }
              ],
              "text": "这句玩笑轻飘飘落下，贾母听着像撒娇，旁人听着像才气。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "affection",
                  "delta": 2
                },
                {
                  "type": "globalScore",
                  "id": "affinity",
                  "delta": 1
                },
                {
                  "type": "npcLine",
                  "speaker": "贾母",
                  "text": "你这孩子，才来就会说笑了。"
                }
              ],
              "next": "enter_04_baoyu"
            }
          ]
        },
        {
          "nodeId": "enter_04_baoyu",
          "title": "这个妹妹我曾见过",
          "scene": "贾母正房",
          "narration": "一语未了，只听外面一阵脚步响，丫鬟进来报道：“宝玉来了。”黛玉心想，这个宝玉不知是怎样个惫懒人呢。及至进来一看，却是位青年公子：头上戴着束发嵌宝紫金冠，齐眉勒着二龙戏珠金抹额，一件二色金百蝶穿花大红箭袖，束着五彩丝攒花结长穗宫绦，外罩石青起花八团倭缎排穗褂，登着青缎粉底小朝靴。面若中秋之月，色如春晓之花，鬓若刀裁，眉如墨画，鼻如悬胆，睛若秋波。黛玉一见便吃一大惊，心中想道：“好生奇怪，倒像在那里见过的，何等眼熟！”\n宝玉看罢，笑道：“这个妹妹我曾见过的。”贾母笑道：“又胡说了，你何曾见过？”宝玉笑道：“虽没见过，却看着面善，心里倒像是远别重逢的一般。”贾母笑道：“好，好!这么更相和睦了。”",
          "choices": [
            {
              "choiceId": "admit_eye_familiarity",
              "label": "心中承认眼熟，口中仍守礼",
              "requires": [
                {
                  "type": "skill",
                  "id": "subtlety",
                  "gte": 60
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 5
                },
                {
                  "type": "traitState",
                  "id": "daiyu_hidden_affection",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "baodai_first_resonance",
                  "value": true
                }
              ],
              "next": "enter_05_jade_question"
            },
            {
              "choiceId": "slightly_step_back",
              "label": "听他说曾见过，微微退半步",
              "requires": [
                {
                  "type": "trait",
                  "id": "gupi"
                }
              ],
              "text": "他一句话太近，你先守住自己与客位。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -1
                }
              ],
              "next": "enter_05_jade_question"
            },
            {
              "choiceId": "answer_seen_in_dream",
              "label": "离谱一点：低声道梦里许是见过",
              "requires": [
                {
                  "type": "skill",
                  "id": "poetry",
                  "gte": 2
                }
              ],
              "text": "这句太轻，只有近旁听见，像玩笑，也像真话。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 7
                },
                {
                  "type": "traitState",
                  "id": "daiyu_hidden_affection",
                  "delta": 2
                },
                {
                  "type": "npcLine",
                  "speaker": "贾母",
                  "text": "这么更相和睦了。"
                }
              ],
              "next": "enter_05_jade_question"
            },
            {
              "choiceId": "answer_books_modestly",
              "label": "问到读书，只说认得几个字",
              "requires": [
                {
                  "type": "skill",
                  "id": "literacy",
                  "gte": 80
                }
              ],
              "effects": [
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                }
              ],
              "next": "enter_05_jade_question"
            },
            {
              "choiceId": "accept_pinyin_name",
              "label": "听他取字颦颦，只含笑不驳",
              "requires": [
                {
                  "type": "skill",
                  "id": "eloquence",
                  "gte": 70
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 4
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "friendship",
                  "delta": 2
                },
                {
                  "type": "npcLine",
                  "speaker": "探春",
                  "text": "只怕又是杜撰。"
                }
              ],
              "next": "enter_05_jade_question"
            }
          ]
        },
        {
          "nodeId": "enter_05_jade_question",
          "title": "可有玉没有",
          "scene": "贾母正房",
          "narration": "宝玉便走向黛玉身边坐下，又细细打量一番，因问：“妹妹可曾读书？”黛玉道：“不曾读书，只上了一年学，些须认得几个字。”宝玉又道：“妹妹尊名？”黛玉便说了名，宝玉又道：“表字？”黛玉道：“无字。”宝玉笑道：“我送妹妹一字：莫若‘颦颦’二字极妙。”探春便道：“何处出典？”宝玉道：“《古今人物通考》上说：‘西方有石名黛，可代画眉之墨。’况这妹妹眉尖若蹙，取这个字岂不美？”探春笑道：“只怕又是杜撰。”宝玉笑道：“除了《四书》，杜撰的也太多呢。”因又问黛玉：“可有玉没有？”众人都不解。黛玉便忖度着：“因他有玉，所以才问我的。”便答道：“我没有玉。你那玉也是件稀罕物儿，岂能人人皆有？”宝玉听了，登时发作起狂病来，摘下那玉就狠命摔去，骂道：“什么罕物!人的高下不识，还说灵不灵呢!我也不要这劳什子！”",
          "choices": [
            {
              "choiceId": "canon_no_jade",
              "label": "照实说没有，并称他的玉是稀罕物",
              "requires": [],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 3
                },
                {
                  "type": "unlockNode",
                  "nodeId": "enter_06_xiren_night"
                }
              ],
              "next": "enter_06_xiren_night"
            },
            {
              "choiceId": "challenge_pinyin_source",
              "label": "先顺着探春问：果有这书么？",
              "requires": [
                {
                  "type": "skill",
                  "id": "literacy",
                  "gte": 90
                }
              ],
              "text": "你这一问不重，却让宝玉的杜撰无处安放；问玉时，你再把话收回来。",
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "literacy",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "friendship",
                  "delta": 3
                },
                {
                  "type": "traitState",
                  "id": "daiyu_hidden_affection",
                  "delta": 1
                }
              ],
              "next": "enter_06_xiren_night"
            },
            {
              "choiceId": "reject_pinyin",
              "label": "轻轻说：初来不敢受字",
              "requires": [
                {
                  "type": "skill",
                  "id": "ritual",
                  "gte": 85
                }
              ],
              "text": "你把礼法搬出来，挡住他的亲近。",
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": -1
                },
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": 1
                }
              ],
              "next": "enter_06_xiren_night"
            },
            {
              "choiceId": "borrow_jade_to_see",
              "label": "离谱一点：问可否借玉一看",
              "requires": [
                {
                  "type": "skill",
                  "id": "adaptability",
                  "gte": 80
                }
              ],
              "text": "你把危险话题转成看物件，宝玉一怔，倒先把玉托在掌心。",
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 4
                },
                {
                  "type": "storyFlag",
                  "id": "jade_not_smashed_variant",
                  "value": true
                },
                {
                  "type": "npcLine",
                  "speaker": "宝玉",
                  "text": "妹妹若看，这玉倒有些意思。"
                }
              ],
              "next": "enter_06_xiren_night"
            },
            {
              "choiceId": "soften_no_jade",
              "label": "说没有，却先笑道不敢与哥哥的玉相比",
              "requires": [
                {
                  "type": "skill",
                  "id": "subtlety",
                  "gte": 75
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 2
                },
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": 1
                }
              ],
              "next": "enter_06_xiren_night"
            },
            {
              "choiceId": "ask_back",
              "label": "反问玉难道人人该有",
              "requires": [
                {
                  "type": "trait",
                  "id": "gengzhi"
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 3
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 5
                },
                {
                  "type": "axis",
                  "targetId": "jiamu",
                  "axis": "trust",
                  "delta": -1
                }
              ],
              "next": "enter_06_xiren_night"
            }
          ]
        },
        {
          "nodeId": "enter_06_xiren_night",
          "title": "碧纱厨夜话",
          "scene": "碧纱厨",
          "narration": "当下奶娘来问黛玉房舍，贾母便说：“将宝玉挪出来，同我在套间暖阁里，把你林姑娘暂且安置在碧纱厨里。等过了残冬，春天再给他们收拾房屋，另作一番安置罢。”宝玉道：“好祖宗，我就在碧纱厨外的床上很妥当。又何必出来，闹的老祖宗不得安静呢？”贾母想一想说：“也罢了。”每人一个奶娘并一个丫头照管，馀者在外间上夜听唤。一面早有熙凤命人送了一顶藕合色花帐并锦被缎褥之类。黛玉只带了两个人来，一个是自己的奶娘王嬷嬷，一个是十岁的小丫头，名唤雪雁。贾母见雪雁甚小，一团孩气，王嬷嬷又极老，料黛玉皆不遂心，将自己身边一个二等小丫头名唤鹦哥的与了黛玉。\n是晚宝玉李嬷嬷已睡了，他见里面黛玉鹦哥犹未安歇，他自卸了妆，悄悄的进来，笑问：“姑娘怎么还不安歇？”黛玉忙笑让：“姐姐请坐。”袭人在床沿上坐了。鹦哥笑道：“林姑娘在这里伤心，自己淌眼抹泪的，说：‘今儿才来了，就惹出你们哥儿的病来。倘或摔坏了那玉，岂不是因我之过！’所以伤心，我好容易劝好了。”袭人道：“姑娘快别这么着!将来只怕比这更奇怪的笑话儿还有呢。若为他这种行状你多心伤感，只怕你还伤感不了呢。快别多心。”黛玉道：“姐姐们说的，我记着就是了。”又叙了一回，方才安歇。",
          "choices": [
            {
              "choiceId": "accept_comfort",
              "label": "听袭人劝解，说自己记着就是了",
              "requires": [],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "xiren",
                  "axis": "trust",
                  "delta": 6
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": -1
                },
                {
                  "type": "traitState",
                  "id": "servant_mediation",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "settled_in_grace",
                  "value": true
                }
              ],
              "ending": "settled_in_grace"
            },
            {
              "choiceId": "keep_self_blame",
              "label": "嘴上应了，心里仍怪自己初来惹事",
              "requires": [
                {
                  "type": "trait",
                  "id": "duochou"
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "xiren",
                  "axis": "affection",
                  "delta": 2
                },
                {
                  "type": "storyFlag",
                  "id": "future_quarrel_more_sensitive",
                  "value": true
                }
              ],
              "ending": "settled_but_self_wounded"
            },
            {
              "choiceId": "ask_about_yingge",
              "label": "问鹦哥平日如何当差，心里记下这份人情",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 75
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "delta": 4
                },
                {
                  "type": "traitState",
                  "id": "servant_mediation",
                  "delta": 2
                },
                {
                  "type": "storyFlag",
                  "id": "values_capable_maid",
                  "value": true
                },
                {
                  "type": "npcLine",
                  "speaker": "袭人",
                  "text": "鹦哥原是老太太屋里的人，姑娘只管放心使唤。"
                }
              ],
              "ending": "settled_in_grace"
            },
            {
              "choiceId": "request_stronger_maid_future",
              "label": "离谱一点：想若外祖母给个极得力的丫鬟就好了",
              "requires": [
                {
                  "type": "trait",
                  "id": "gupi"
                }
              ],
              "effects": [
                {
                  "type": "storyFlag",
                  "id": "future_grandmother_can_assign_powerful_maid",
                  "value": true
                },
                {
                  "type": "globalScore",
                  "id": "affinity",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "npcLine",
                  "speaker": "旁白",
                  "text": "若有一日从贾母视角重开此局，这一念或许会生出另一条命数。"
                }
              ],
              "ending": "settled_in_grace"
            }
          ]
        }
      ]
    },
    {
      "chapterId": "daiyu_ch02_purse_and_sachet",
      "title": "荷包香袋",
      "sourceSceneIds": [
        "ch017_scene_baodai_purse_quarrel"
      ],
      "objective": "处理私物误会，决定是轻轻收场还是半日冷战。",
      "entryNode": "purse_01_missing_trinkets",
      "nodes": [
        {
          "nodeId": "purse_01_missing_trinkets",
          "title": "佩物一件不存",
          "scene": "贾母院中",
          "narration": "宝玉被他父亲拘了半日，回来时身上佩物都被小厮们解了去。袭人一句玩笑，你才想起自己给他的荷包。",
          "choices": [
            {
              "choiceId": "ask_directly",
              "label": "问他：我给你的那个荷包也给他们了？",
              "requires": [
                {
                  "type": "trait",
                  "id": "gengzhi"
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "baoyu_reassurance",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -1
                }
              ],
              "next": "purse_02_proof"
            },
            {
              "choiceId": "hold_back",
              "label": "先不问，只冷眼看他如何解释",
              "requires": [
                {
                  "type": "skill",
                  "id": "subtlety",
                  "gte": 70
                }
              ],
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "subtlety",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 1
                }
              ],
              "next": "purse_02_proof"
            },
            {
              "choiceId": "cut_sachet",
              "label": "回房拿起未完的香袋就铰",
              "requires": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "gte": 1
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -2
                }
              ],
              "next": "purse_02_proof"
            }
          ]
        },
        {
          "nodeId": "purse_02_proof",
          "title": "贴身藏着",
          "scene": "潇湘馆/贾母院过渡",
          "narration": "宝玉急忙从里面衣襟上解出荷包来递给你。原来他怕人拿去，竟贴身藏着。",
          "choices": [
            {
              "choiceId": "lower_head_silent",
              "label": "低头不语，心下自悔",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 80
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "baoyu_reassurance",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 4
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": -1
                }
              ],
              "next": "purse_03_repair"
            },
            {
              "choiceId": "return_purse_in_pride",
              "label": "说既如此，连这荷包也还他罢",
              "requires": [
                {
                  "type": "trait",
                  "id": "gupi"
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 3
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "baoyu_reassurance",
                  "delta": 1
                }
              ],
              "next": "purse_03_repair"
            },
            {
              "choiceId": "poetic_soften",
              "label": "说香袋未成，倒先误会了人",
              "requires": [
                {
                  "type": "skill",
                  "id": "literacy",
                  "gte": 90
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 5
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 3
                },
                {
                  "type": "skillXp",
                  "skill": "poetry",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": -2
                }
              ],
              "next": "purse_03_repair"
            }
          ]
        },
        {
          "nodeId": "purse_03_repair",
          "title": "嗤的一笑",
          "scene": "出房路上",
          "narration": "宝玉妹妹长妹妹短地赔不是。你若再恼，他也只得跟着；若肯收住，这一场便如风过竹梢。",
          "choices": [
            {
              "choiceId": "laugh_and_allow",
              "label": "嗤的一笑，只说那也瞧我的高兴罢了",
              "requires": [
                {
                  "type": "traitState",
                  "id": "baoyu_reassurance",
                  "gte": 2
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 6
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 3
                },
                {
                  "type": "storyFlag",
                  "id": "purse_laugh_repair",
                  "value": true
                }
              ],
              "ending": "purse_laugh_repair"
            },
            {
              "choiceId": "leave_to_wangfuren",
              "label": "借去王夫人处，暂且把话岔开",
              "requires": [
                {
                  "type": "skill",
                  "id": "ritual",
                  "gte": 80
                }
              ],
              "effects": [
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "friendship",
                  "delta": 2
                },
                {
                  "type": "storyFlag",
                  "id": "quiet_cold_war",
                  "value": true
                }
              ],
              "ending": "quiet_cold_war"
            }
          ]
        }
      ]
    },
    {
      "chapterId": "daiyu_ch03_baorenshi",
      "title": "白认得你",
      "sourceSceneIds": [
        "ch029_scene_zhang_daoshi_proposes_match",
        "ch029_scene_gold_kylin_jealousy",
        "ch029_scene_baorenshi_quarrel",
        "ch029_scene_smash_jade_cut_tassel",
        "ch029_scene_not_enemies_do_not_gather"
      ],
      "objective": "在婚配压力与金玉话题下，决定宝黛争执的烈度和收束方式。",
      "entryNode": "baorenshi_01_kylin",
      "nodes": [
        {
          "nodeId": "baorenshi_01_kylin",
          "title": "金麒麟",
          "scene": "清虚观楼上",
          "narration": "贾母从盘中拈起一个赤金点翠的麒麟。宝钗记得湘云也有一个。你看宝玉听见后忙把那物件揣起，又拿眼瞟人。",
          "choices": [
            {
              "choiceId": "cold_laugh_baochai",
              "label": "冷笑一句：她只在这些人带的东西上留心",
              "requires": [
                {
                  "type": "trait",
                  "id": "mingan"
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baochai",
                  "axis": "affection",
                  "delta": -2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -1
                }
              ],
              "next": "baorenshi_02_sickroom"
            },
            {
              "choiceId": "silence_watch_baoyu",
              "label": "不说宝钗，只看宝玉如何处置",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 85
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 1
                },
                {
                  "type": "skillXp",
                  "skill": "insight",
                  "delta": 1
                }
              ],
              "next": "baorenshi_02_sickroom"
            },
            {
              "choiceId": "accept_kylin_offer",
              "label": "若他说替你拿着，淡淡接过",
              "requires": [
                {
                  "type": "skill",
                  "id": "adaptability",
                  "gte": 65
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 3
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -1
                },
                {
                  "type": "storyFlag",
                  "id": "kylin_defused",
                  "value": true
                }
              ],
              "next": "baorenshi_02_sickroom"
            }
          ]
        },
        {
          "nodeId": "baorenshi_02_sickroom",
          "title": "你只管听你的戏去罢",
          "scene": "潇湘馆",
          "narration": "你中了暑，宝玉一时又一时来问。你明知他因张道士提亲不自在，却偏忍不住拿听戏的话试他。",
          "choices": [
            {
              "choiceId": "canon_tease",
              "label": "说：你只管听你的戏去罢，在家里做什么",
              "requires": [
                {
                  "type": "trait",
                  "id": "duochou"
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_hidden_affection",
                  "delta": 1
                }
              ],
              "next": "baorenshi_03_white_known"
            },
            {
              "choiceId": "soft_ask_stay",
              "label": "只问他：外头热闹，怎么倒还往这里来",
              "requires": [
                {
                  "type": "skill",
                  "id": "adaptability",
                  "gte": 65
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 3
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -1
                },
                {
                  "type": "traitState",
                  "id": "baoyu_reassurance",
                  "delta": 1
                }
              ],
              "next": "baorenshi_03_white_known"
            },
            {
              "choiceId": "straight_gold_jade",
              "label": "直问张道士说亲，你心里究竟如何",
              "requires": [
                {
                  "type": "trait",
                  "id": "gengzhi"
                }
              ],
              "effects": [
                {
                  "type": "globalScore",
                  "id": "dignity",
                  "delta": -1
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 2
                }
              ],
              "next": "baorenshi_03_white_known"
            }
          ]
        },
        {
          "nodeId": "baorenshi_03_white_known",
          "title": "白认得你",
          "scene": "潇湘馆",
          "narration": "宝玉脸色沉下去。你听见他说白认得你了，心中又酸又急。话若再绕，便越绕越紧。",
          "choices": [
            {
              "choiceId": "canon_counter",
              "label": "冷笑回他：我哪里像人家有什么配得上你的",
              "requires": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "gte": 1
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -3
                }
              ],
              "next": "baorenshi_04_vow"
            },
            {
              "choiceId": "pause_before_counter",
              "label": "忍住一息，只问他为何说白认得",
              "requires": [
                {
                  "type": "skill",
                  "id": "subtlety",
                  "gte": 75
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "daiyu_composure",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -1
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 2
                }
              ],
              "next": "baorenshi_04_vow"
            },
            {
              "choiceId": "call_zijuan",
              "label": "唤紫鹃倒茶，借人进来缓一缓",
              "requires": [
                {
                  "type": "relation",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "gte": 60
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "servant_mediation",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -2
                },
                {
                  "type": "npcLine",
                  "speaker": "紫鹃",
                  "text": "姑娘才吃了药，二爷也请略坐一坐。"
                }
              ],
              "next": "baorenshi_05_branch"
            }
          ]
        },
        {
          "nodeId": "baorenshi_04_vow",
          "title": "天诛地灭",
          "scene": "潇湘馆",
          "narration": "宝玉追问你是否安心咒他。你这才想起昨日赌咒的话，心中又急又愧，泪先落了下来。",
          "choices": [
            {
              "choiceId": "canon_vow_back",
              "label": "哭道：我要安心咒你，我也天诛地灭",
              "requires": [
                {
                  "type": "trait",
                  "id": "mingan"
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 6
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -1
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_fatigue",
                  "delta": 1
                }
              ],
              "next": "baorenshi_05_branch"
            },
            {
              "choiceId": "say_you_wronged_me",
              "label": "说他拿你的话煞性子，却不赌咒",
              "requires": [
                {
                  "type": "skill",
                  "id": "eloquence",
                  "gte": 80
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 0
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                }
              ],
              "next": "baorenshi_05_branch"
            }
          ]
        },
        {
          "nodeId": "baorenshi_05_branch",
          "title": "玉事将起",
          "scene": "潇湘馆",
          "narration": "宝玉听见好姻缘三字，越发逆了己意。此时若无人拦，通灵玉便又要替两个人受一场气。",
          "choices": [
            {
              "choiceId": "let_jade_storm",
              "label": "仍说他的好姻缘，任他摘玉",
              "requires": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "gte": 3
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": 3
                },
                {
                  "type": "traitState",
                  "id": "daiyu_fatigue",
                  "delta": 2
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 4
                },
                {
                  "type": "storyFlag",
                  "id": "jade_storm_canon",
                  "value": true
                }
              ],
              "next": "baorenshi_06_jade_storm"
            },
            {
              "choiceId": "ask_about_heart",
              "label": "压着泪问他：你心里究竟重人，还是重玉",
              "requires": [
                {
                  "type": "skill",
                  "id": "insight",
                  "gte": 90
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 5
                },
                {
                  "type": "traitState",
                  "id": "baoyu_reassurance",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -1
                }
              ],
              "next": "baorenshi_07_aftercare"
            },
            {
              "choiceId": "let_zijuan_interrupt",
              "label": "由紫鹃以药和身子为由打断",
              "requires": [
                {
                  "type": "traitState",
                  "id": "servant_mediation",
                  "gte": 1
                }
              ],
              "effects": [
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -3
                },
                {
                  "type": "axis",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "delta": 4
                },
                {
                  "type": "storyFlag",
                  "id": "early_mediation",
                  "value": true
                }
              ],
              "next": "baorenshi_07_aftercare"
            }
          ]
        },
        {
          "nodeId": "baorenshi_06_jade_storm",
          "title": "砸玉剪穗",
          "scene": "潇湘馆",
          "narration": "他狠命摔玉，你哭着说有砸他的，不如来砸你。袭人紫鹃都赶来相劝，你胸中一急，病势也被牵动。",
          "choices": [
            {
              "choiceId": "canon_cut_tassel",
              "label": "听见袭人提玉穗，夺来剪断",
              "requires": [
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "gte": 2
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "affection",
                  "delta": 5
                },
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -4
                },
                {
                  "type": "traitState",
                  "id": "daiyu_fatigue",
                  "delta": 2
                },
                {
                  "type": "globalScore",
                  "id": "order",
                  "delta": -2
                }
              ],
              "ending": "jade_storm_canon"
            },
            {
              "choiceId": "collapse_to_silence",
              "label": "不再剪物，只伏在枕上哭",
              "requires": [
                {
                  "type": "specialty",
                  "id": "frail"
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_fatigue",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "jade_conflict_heat",
                  "delta": -1
                },
                {
                  "type": "npcLine",
                  "speaker": "袭人",
                  "text": "二爷且别说了，姑娘身上要紧。"
                }
              ],
              "ending": "early_mediation"
            }
          ]
        },
        {
          "nodeId": "baorenshi_07_aftercare",
          "title": "不是冤家不聚头",
          "scene": "潇湘馆 / 怡红院",
          "narration": "贾母一句小冤家传到两处。你独坐窗前，忽觉得这话粗俗，却又像把两个人的心事说破了。",
          "choices": [
            {
              "choiceId": "write_unsent_note",
              "label": "写一张不送出的笺，只说今日是自己急了",
              "requires": [
                {
                  "type": "skill",
                  "id": "literacy",
                  "gte": 90
                }
              ],
              "effects": [
                {
                  "type": "skillXp",
                  "skill": "poetry",
                  "delta": 2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": -1
                },
                {
                  "type": "storyFlag",
                  "id": "softened_baodai",
                  "value": true
                }
              ],
              "ending": "softened_baodai"
            },
            {
              "choiceId": "ask_zijuan_to_listen",
              "label": "让紫鹃陪坐，不传话，只听你说几句",
              "requires": [
                {
                  "type": "relation",
                  "targetId": "zijuan",
                  "axis": "trust",
                  "gte": 60
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "zijuan",
                  "axis": "friendship",
                  "delta": 5
                },
                {
                  "type": "traitState",
                  "id": "servant_mediation",
                  "delta": 1
                },
                {
                  "type": "traitState",
                  "id": "daiyu_fatigue",
                  "delta": -1
                }
              ],
              "ending": "early_mediation"
            },
            {
              "choiceId": "hold_cold_war",
              "label": "只把帘子放下，不许人提宝玉",
              "requires": [
                {
                  "type": "trait",
                  "id": "gupi"
                }
              ],
              "effects": [
                {
                  "type": "axis",
                  "targetId": "baoyu",
                  "axis": "trust",
                  "delta": -2
                },
                {
                  "type": "traitState",
                  "id": "daiyu_wounded_pride",
                  "delta": 1
                },
                {
                  "type": "storyFlag",
                  "id": "quiet_cold_war",
                  "value": true
                }
              ],
              "ending": "quiet_cold_war"
            }
          ]
        }
      ]
    }
  ],
  "endings": {
    "settled_in_grace": {
      "title": "暂得安顿",
      "summary": "你在荣国府第一日礼数未乱，贾母怜爱更深，袭人也知你不是轻狂之人。",
      "effects": [
        {
          "type": "axis",
          "targetId": "jiamu",
          "axis": "trust",
          "delta": 3
        },
        {
          "type": "globalScore",
          "id": "dignity",
          "delta": 2
        }
      ]
    },
    "settled_but_self_wounded": {
      "title": "安顿而自伤",
      "summary": "外人看你妥当，你心里却记下了初来便惹玉事的惊惶。",
      "effects": [
        {
          "type": "traitState",
          "id": "daiyu_wounded_pride",
          "delta": 1
        }
      ]
    },
    "purse_laugh_repair": {
      "title": "嗤笑收场",
      "summary": "荷包仍在他贴身处，你一笑收住，香袋虽破，情分反添一层。",
      "effects": [
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "affection",
          "delta": 5
        },
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "trust",
          "delta": 3
        }
      ]
    },
    "quiet_cold_war": {
      "title": "隔帘冷战",
      "summary": "话没有闹大，却也没有说开。两处都安静，安静里反更牵心。",
      "effects": [
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "trust",
          "delta": -2
        },
        {
          "type": "traitState",
          "id": "daiyu_hidden_affection",
          "delta": 1
        }
      ]
    },
    "jade_storm_canon": {
      "title": "玉事大闹",
      "summary": "砸玉、夺玉、剪穗，一屋人都被牵入。真心越急，话越不像真心。",
      "effects": [
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "affection",
          "delta": 6
        },
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "trust",
          "delta": -5
        },
        {
          "type": "globalScore",
          "id": "order",
          "delta": -3
        }
      ]
    },
    "early_mediation": {
      "title": "紫鹃早解",
      "summary": "紫鹃借身子和药拦下一截火气。未必全说开，却少惊动了长辈。",
      "effects": [
        {
          "type": "axis",
          "targetId": "zijuan",
          "axis": "trust",
          "delta": 5
        },
        {
          "type": "globalScore",
          "id": "order",
          "delta": 1
        }
      ]
    },
    "softened_baodai": {
      "title": "稍得相知",
      "summary": "你没有把话递出去，他也未必立刻懂得；但这一夜以后，两个人都少了一分硬碰硬。",
      "effects": [
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "trust",
          "delta": 4
        },
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "friendship",
          "delta": 3
        },
        {
          "type": "traitState",
          "id": "jade_conflict_heat",
          "delta": -2
        }
      ]
    }
  },
  "freeplayEventTemplates": [
    {
      "templateId": "daiyu_token_misread",
      "name": "私物误会",
      "trigger": {
        "any": [
          "baoyu_loses_or_gives_token",
          "daiyu_token_visible_to_others",
          "third_party_mentions_token"
        ]
      },
      "checks": [
        {
          "type": "relation",
          "targetId": "baoyu",
          "axis": "trust",
          "lt": 45,
          "adds": "反话试探"
        },
        {
          "type": "skill",
          "id": "subtlety",
          "gte": 70,
          "adds": "轻讽收场"
        },
        {
          "type": "trait",
          "id": "duochou",
          "adds": "自伤累积"
        }
      ],
      "effects": [
        {
          "type": "traitState",
          "id": "daiyu_wounded_pride",
          "delta": 1
        },
        {
          "type": "axis",
          "targetId": "baoyu",
          "axis": "affection",
          "delta": 1
        }
      ]
    },
    {
      "templateId": "daiyu_gold_jade_pressure",
      "name": "金玉话题",
      "trigger": {
        "any": [
          "baochai_same_scene",
          "xiangyun_token_mentioned",
          "marriage_proposal_mentioned",
          "jade_or_kylin_visible"
        ]
      },
      "checks": [
        {
          "type": "skill",
          "id": "insight",
          "gte": 90,
          "adds": "看出宝玉被刺痛"
        },
        {
          "type": "trait",
          "id": "mingan",
          "adds": "冷笑吃味"
        },
        {
          "type": "relation",
          "targetId": "zijuan",
          "axis": "trust",
          "gte": 60,
          "adds": "紫鹃可打断"
        }
      ],
      "effects": [
        {
          "type": "traitState",
          "id": "jade_conflict_heat",
          "delta": 1
        },
        {
          "type": "traitState",
          "id": "daiyu_hidden_affection",
          "delta": 1
        }
      ]
    },
    {
      "templateId": "daiyu_poetic_deflection",
      "name": "诗性转圜",
      "trigger": {
        "all": [
          "daiyu_in_private_or_garden",
          "conflict_heat_between_1_and_3"
        ]
      },
      "checks": [
        {
          "type": "skill",
          "id": "literacy",
          "gte": 90,
          "adds": "以诗文收束"
        },
        {
          "type": "specialty",
          "id": "solitude_poetry",
          "adds": "独处后形成记忆"
        }
      ],
      "effects": [
        {
          "type": "skillXp",
          "skill": "poetry",
          "delta": 1
        },
        {
          "type": "traitState",
          "id": "daiyu_wounded_pride",
          "delta": -1
        }
      ]
    },
    {
      "templateId": "servant_early_mediation",
      "name": "随侍早解",
      "trigger": {
        "any": [
          "daiyu_fatigue_gte_2",
          "jade_conflict_heat_gte_3",
          "baoyu_chikuang"
        ]
      },
      "checks": [
        {
          "type": "relation",
          "targetId": "zijuan",
          "axis": "trust",
          "gte": 60,
          "adds": "紫鹃优先照看黛玉"
        },
        {
          "type": "relation",
          "targetId": "xiren",
          "axis": "trust",
          "gte": 25,
          "adds": "袭人可规劝宝玉"
        }
      ],
      "effects": [
        {
          "type": "traitState",
          "id": "servant_mediation",
          "delta": 1
        },
        {
          "type": "globalScore",
          "id": "order",
          "delta": 1
        }
      ]
    }
  ]
};
