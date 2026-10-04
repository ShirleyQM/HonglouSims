# Agent 记忆 V1

沿用 TraitBehaviorSystem 的性格概率、强度倍率、每日衰减和 80 条上限。

MemoryEvent 保留 text/tag/with/day/hour/source/strength 等旧字段，新增 version=1、id、charId、sceneId、tags、emotion、valence、createdAt 与可选 eventId/lastReinforcedAt。with 表示记忆主体眼中的对象；双方经历分别保存各自的记忆。旧数据补 ID 后随原存档保存，memory-panel 读取同一 ID。

interaction:complete 写入双方经历；relation:axis_change 的实际变化绝对值达到 5 时写入关系经历；quest 的接受、拒绝、完成、失败写入承接人经历；state:add 写入首次状态经历。持续状态刷新不重复生成。统一 memory effect 的额外属性完整传递给原入口。相同来源、对象、eventId 的重复投递忽略；没有 eventId 的同文本经历在 180 游戏分钟内强化原条目。

关系 memoryIds 引用双方存活的记忆 ID。syncMemories 在初始化、读档、写入和衰减后迁移并维护索引，清理遗忘或容量裁剪产生的悬空引用。

retrieveMemories 限定人物自己的记忆，对对象匹配、场景匹配、标签交集、情绪匹配、新近度、强度和情感显著性评分。检索不改变强度；reinforceMemory 显式强化，强度上限 3。排序稳定，默认最多 5 条。

buildSocialDecisionInput 返回 recentMemories；Utility AI 候选 socialDecisionInput 保存此输入，原 memoryFactor 继续使用标签配置，并结合针对对象的 valence/strength 调整社交或冲突权重，倍率限制在 0.4–1.6。InteractionLlmSystem 使用同一检索入口构造双方对白上下文。

运行 `npm run test:memory`：无外部 LLM 的确定性五日 probe 验证四类事件写入、衰减、显式强化、检索、实际 AI memoryFactor、存档往返、关系索引和遗忘清理。此 probe 不代表真实 LLM 的对白质量或完整浏览器游戏长时间运行结果。
