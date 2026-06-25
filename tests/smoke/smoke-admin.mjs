import { runBrowserSmoke } from '../lib/test-harness.mjs';

await runBrowserSmoke('后台 v2 冒烟', 'smoke-admin', async ({ page, report }) => {
  const state = await page.evaluate(async () => {
    if (typeof openAdmin === 'function') openAdmin();
    await new Promise(resolve => setTimeout(resolve, 100));
    const groupTitles = [...document.querySelectorAll('.admin-v2-group-title')].map(el => el.textContent.trim());
    const buttons = [...document.querySelectorAll('[data-admin-v2-section]')];
    const clicked = [];
    for (const button of buttons) {
      button.click();
      await new Promise(resolve => setTimeout(resolve, 25));
      clicked.push({
        section: button.dataset.adminV2Section,
        label: button.textContent.trim(),
        hasMain: !!document.querySelector('.admin-v2-main')
          || (button.dataset.adminV2Section === 'legacy' && !!document.querySelector('#admin-body')),
      });
    }
    return {
      overlayOpen: document.querySelector('#admin-overlay')?.classList.contains('open') || false,
      groupTitles,
      navCount: buttons.length,
      clicked,
    };
  });

  report.assert(state.overlayOpen, '后台 overlay 已打开');
  for (const title of ['人物配置', '关系与身份', '任务与传令', '行为规则', '世界配置', 'AI 与调试']) {
    report.assert(state.groupTitles.includes(title), `后台分组存在：${title}`, { groupTitles: state.groupTitles });
  }
  report.assert(state.navCount >= 20, '后台 v2 导航项已补齐', { navCount: state.navCount });
  const broken = state.clicked.filter(row => !row.hasMain);
  report.assert(broken.length === 0, '后台 v2 导航点击后主区域存在', { broken });
});
