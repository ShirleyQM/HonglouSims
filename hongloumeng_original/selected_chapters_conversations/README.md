# 三回 conversation 抽取说明

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
