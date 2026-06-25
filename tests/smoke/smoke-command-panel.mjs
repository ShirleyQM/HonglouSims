import { runBrowserSmoke } from '../lib/test-harness.mjs';

await runBrowserSmoke('传令面板冒烟', 'smoke-command', async ({ page, report }) => {
  await page.click('#btn-group-issue');
  await page.waitForTimeout(300);
  const commandState = await page.evaluate(() => ({
    overlayOpen: document.querySelector('#panel-overlay')?.classList.contains('open') || false,
    hasCommandPanel: !!document.querySelector('.command-panel'),
    paneTitles: [...document.querySelectorAll('.command-pane h4')].map(el => el.textContent.trim()),
    targetCount: document.querySelectorAll('[data-command-target]').length,
    groupCount: document.querySelectorAll('input[name="gi-tpl"]').length,
    selectedTargets: [...document.querySelectorAll('[data-command-target]:checked')].map(el => el.dataset.commandTarget),
    targetText: [...document.querySelectorAll('.command-target')].map(el => el.textContent.trim()).join(' | '),
  }));

  report.assert(commandState.overlayOpen, '传令面板 overlay 已打开');
  report.assert(commandState.hasCommandPanel, '传令面板存在');
  report.assert(commandState.paneTitles.includes('点名传令'), '点名传令栏存在', { paneTitles: commandState.paneTitles });
  report.assert(commandState.paneTitles.includes('群体传令'), '群体传令栏存在', { paneTitles: commandState.paneTitles });
  report.assert(commandState.targetCount > 0, '点名传令存在可选对象', { targetCount: commandState.targetCount });
  report.assert(/服从|预计|信任/.test(commandState.targetText), '候选卡展示关系/接受信号', { targetText: commandState.targetText.slice(0, 240) });
  if (commandState.groupCount === 0) report.warn('当前角色没有可用群体传令项', { groupCount: commandState.groupCount });

  await page.evaluate(() => document.querySelector('#panel-overlay')?.classList.remove('open'));
  const dutyExists = await page.locator('.duty-mark').count();
  if (dutyExists > 0) {
    await page.click('.duty-mark');
    await page.waitForTimeout(300);
    const dutyState = await page.evaluate(() => ({
      hasCommandPanel: !!document.querySelector('.command-panel'),
      checkedTargets: [...document.querySelectorAll('[data-command-target]:checked')].map(el => el.dataset.commandTarget),
      activeNames: [...document.querySelectorAll('.command-target.active b')].map(el => el.textContent.trim()),
    }));
    report.assert(dutyState.hasCommandPanel, '当值令角标能打开传令面板');
    report.assert(dutyState.checkedTargets.length > 0, '当值令角标会预选人物', dutyState);
  } else {
    report.warn('当前页面没有当值令角标，跳过当值快捷入口检查');
  }
});
