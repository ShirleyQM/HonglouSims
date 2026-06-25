import { TestReport } from '../lib/test-harness.mjs';
import { scenarios } from './scenario-registry.mjs';

const report = new TestReport('场景测试注册表');

report.assert(scenarios.length >= 5, '已登记核心耦合场景', { count: scenarios.length });

for (const scenario of scenarios) {
  report.warn(`场景待自动化：${scenario.name}`, {
    id: scenario.id,
    modules: scenario.modules,
    goal: scenario.goal,
    acceptance: scenario.acceptance,
  });
}

report.warn('第一版场景测试仅维护注册表，后续逐个接入可执行多日模拟', {
  next: ['固定随机种子', '固定起始时间', '导出人物时辰/起居/需求报告'],
});

report.print();
const written = await report.write('scenario');
if (!written.data.ok) process.exitCode = 1;
