import { runBrowserSmoke } from '../lib/test-harness.mjs';

await runBrowserSmoke('前台页面冒烟', 'smoke-ui', async ({ page, report }) => {
  const state = await page.evaluate(() => ({
    title: document.title,
    hasCanvas: !!document.querySelector('#game'),
    commandText: document.querySelector('#btn-group-issue')?.textContent?.trim() || '',
    routineText: document.querySelector('#btn-routine')?.textContent?.trim() || '',
    profileText: document.querySelector('#btn-profile')?.textContent?.trim() || '',
    saveText: document.querySelector('#btn-save-panel')?.textContent?.trim() || '',
    bottomPanel: !!document.querySelector('#bottom-info-panel'),
    selectedName: document.querySelector('.char-col-name')?.textContent?.trim() || '',
  }));

  report.assert(state.title.includes('大观园'), '页面标题正确', { title: state.title });
  report.assert(state.hasCanvas, '游戏画布存在');
  report.assert(state.bottomPanel, '底部 HUD 存在');
  report.assert(state.commandText.includes('传令'), '底栏传令入口存在', { text: state.commandText });
  report.assert(state.routineText.includes('起居'), '底栏起居入口存在', { text: state.routineText });
  report.assert(state.profileText.includes('人物'), '底栏人物入口存在', { text: state.profileText });
  report.assert(state.saveText.includes('存档'), '底栏存档入口存在', { text: state.saveText });
  report.assert(!!state.selectedName, '当前人物信息已渲染', { selectedName: state.selectedName });
});
