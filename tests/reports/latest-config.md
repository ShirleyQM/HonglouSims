# 配置体检

- Started: 2026-07-08T12:35:05.331Z
- Finished: 2026-07-08T12:35:05.348Z
- Result: PASS
- Counts: PASS 55 / WARN 0 / FAIL 0

| Status | Check | Details |
| --- | --- | --- |
| PASS | 关键文件存在：index.html | {} |
| PASS | 关键文件存在：package.json | {} |
| PASS | 关键文件存在：js/config.js | {} |
| PASS | 关键文件存在：js/ui.js | {} |
| PASS | 关键文件存在：js/ai.js | {} |
| PASS | 关键文件存在：js/systems/quest.js | {} |
| PASS | 关键文件存在：js/systems/quest-issue.js | {} |
| PASS | 关键文件存在：js/systems/servant-relations.js | {} |
| PASS | 关键文件存在：js/systems/relation.js | {} |
| PASS | 关键文件存在：prd/系统架构依赖图.md | {} |
| PASS | 关键文件存在：prd/持续更新_03任务.md | {} |
| PASS | 关键文件存在：prd/持续更新_23传令与上下级管理面板.md | {} |
| PASS | 关键文件存在：prd/持续更新_22人物作息.md | {} |
| PASS | index.html 注册了前台脚本 | {"count":48} |
| PASS | config.js 在 quest.js 之前加载 | {} |
| PASS | quest.js 在 quest-issue.js 之前加载 | {} |
| PASS | servant-relations.js 在 ai.js 之前加载 | {} |
| PASS | ai.js 在 ui.js 之前加载 | {} |
| PASS | config.js 包含配置标记：characters | {} |
| PASS | config.js 包含配置标记：scenes | {} |
| PASS | config.js 包含配置标记：templates | {} |
| PASS | config.js 包含配置标记：questConfig | {} |
| PASS | config.js 包含配置标记：servantConfig | {} |
| PASS | config.js 包含配置标记：followRotations | {} |
| PASS | config.js 包含配置标记：dutyRoutines | {} |
| PASS | config.js 包含配置标记：relationPanelConfig | {} |
| PASS | config.js 包含配置标记：needDefs | {} |
| PASS | ui.js 包含 UI 标记：buildCommandPanel | {} |
| PASS | ui.js 包含 UI 标记：openCommandPanel | {} |
| PASS | ui.js 包含 UI 标记：commandPanelRelationSignals | {} |
| PASS | ui.js 包含 UI 标记：routineProfileForSave | {} |
| PASS | ui.js 包含 UI 标记：routineEditorIsProjectionBlock | {} |
| PASS | ai.js 包含 AI/起居标记：getRoutineProfileForCharacter | {} |
| PASS | ai.js 包含 AI/起居标记：mergeRoutineProjectionBlocks | {} |
| PASS | ai.js 包含 AI/起居标记：calcRoutineFactor | {} |
| PASS | ai.js 包含 AI/起居标记：calcScheduleFactor | {} |
| PASS | ai.js 包含 AI/起居标记：routineProjectionBlocksForCharacter | {} |
| PASS | quest-issue.js 包含传令标记：QuestIssueSystem | {} |
| PASS | quest-issue.js 包含传令标记：checkQuestIssueable | {} |
| PASS | quest-issue.js 包含传令标记：checkGroupQuestIssueable | {} |
| PASS | quest-issue.js 包含传令标记：issueTo | {} |
| PASS | quest-issue.js 包含传令标记：issueGroupTo | {} |
| PASS | 关系系统暴露 getRelationAxis | {} |
| PASS | 关系系统包含服从 submission 方向性轴 | {} |
| PASS | 架构图包含：传令 | {} |
| PASS | 架构图包含：服从 | {} |
| PASS | 架构图包含：起居 | {} |
| PASS | 架构图包含：QuestSystem | {} |
| PASS | 架构图包含：Utility AI | {} |
| PASS | package.json 包含脚本：test:config | {} |
| PASS | package.json 包含脚本：test:smoke | {} |
| PASS | package.json 包含脚本：test:admin | {} |
| PASS | package.json 包含脚本：test:command | {} |
| PASS | package.json 包含脚本：test:scenario | {} |
| PASS | package.json 包含脚本：test:release | {} |
