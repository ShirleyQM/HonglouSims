import { TestReport, extractScriptSrcs, fileExists, orderedBefore, readText } from '../lib/test-harness.mjs';

const report = new TestReport('配置体检');

const requiredFiles = [
  'index.html',
  'package.json',
  'js/config.js',
  'js/ui.js',
  'js/ai.js',
  'js/systems/quest.js',
  'js/systems/quest-issue.js',
  'js/systems/servant-relations.js',
  'js/systems/relation.js',
  'prd/系统架构依赖图.md',
  'prd/持续更新_03任务.md',
  'prd/持续更新_25传令与上下级管理面板.md',
  'prd/持续更新_22人物作息.md',
];

for (const file of requiredFiles) {
  report.assert(await fileExists(file), `关键文件存在：${file}`);
}

const indexHtml = await readText('index.html');
const scripts = extractScriptSrcs(indexHtml);
report.assert(scripts.length > 8, 'index.html 注册了前台脚本', { count: scripts.length });
report.assert(orderedBefore(scripts, 'js/config.js', 'js/systems/quest.js'), 'config.js 在 quest.js 之前加载');
report.assert(orderedBefore(scripts, 'js/systems/quest.js', 'js/systems/quest-issue.js'), 'quest.js 在 quest-issue.js 之前加载');
report.assert(orderedBefore(scripts, 'js/systems/servant-relations.js', 'js/ai.js'), 'servant-relations.js 在 ai.js 之前加载');
report.assert(orderedBefore(scripts, 'js/ai.js', 'js/ui.js'), 'ai.js 在 ui.js 之前加载');

const configText = await readText('js/config.js');
const configMarkers = [
  'characters',
  'scenes',
  'templates',
  'questConfig',
  'servantConfig',
  'followRotations',
  'dutyRoutines',
  'relationPanelConfig',
  'needDefs',
];
for (const marker of configMarkers) {
  report.assert(configText.includes(marker), `config.js 包含配置标记：${marker}`);
}

const uiText = await readText('js/ui.js');
const uiMarkers = [
  'buildCommandPanel',
  'openCommandPanel',
  'commandPanelRelationSignals',
  'routineProfileForSave',
  'routineEditorIsProjectionBlock',
];
for (const marker of uiMarkers) {
  report.assert(uiText.includes(marker), `ui.js 包含 UI 标记：${marker}`);
}

const aiText = await readText('js/ai.js');
const aiMarkers = [
  'getRoutineProfileForCharacter',
  'mergeRoutineProjectionBlocks',
  'calcRoutineFactor',
  'calcScheduleFactor',
  'routineProjectionBlocksForCharacter',
];
for (const marker of aiMarkers) {
  report.assert(aiText.includes(marker), `ai.js 包含 AI/起居标记：${marker}`);
}

const questIssueText = await readText('js/systems/quest-issue.js');
const questIssueMarkers = [
  'QuestIssueSystem',
  'checkQuestIssueable',
  'checkGroupQuestIssueable',
  'issueTo',
  'issueGroupTo',
];
for (const marker of questIssueMarkers) {
  report.assert(questIssueText.includes(marker), `quest-issue.js 包含传令标记：${marker}`);
}

const relationText = await readText('js/systems/relation.js');
report.assert(relationText.includes('getRelationAxis'), '关系系统暴露 getRelationAxis');
report.assert(relationText.includes('submission'), '关系系统包含服从 submission 方向性轴');

const archText = await readText('prd/系统架构依赖图.md');
for (const marker of ['传令', '服从', '起居', 'QuestSystem', 'Utility AI']) {
  report.assert(archText.includes(marker), `架构图包含：${marker}`);
}

const packageText = await readText('package.json');
const pkg = JSON.parse(packageText);
for (const script of ['test:config', 'test:smoke', 'test:admin', 'test:command', 'test:scenario', 'test:release']) {
  report.assert(!!pkg.scripts?.[script], `package.json 包含脚本：${script}`);
}

report.print();
const written = await report.write('config');
if (!written.data.ok) process.exitCode = 1;
