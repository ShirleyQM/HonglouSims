import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

export const TESTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT_DIR = path.resolve(TESTS_DIR, '..');
export const REPORTS_DIR = path.join(TESTS_DIR, 'reports');

const require = createRequire(import.meta.url);

export function rootPath(...parts) {
  return path.join(ROOT_DIR, ...parts);
}

export function relPath(absPath) {
  return path.relative(ROOT_DIR, absPath).replaceAll(path.sep, '/');
}

export async function readText(...parts) {
  return fsp.readFile(rootPath(...parts), 'utf8');
}

export async function fileExists(...parts) {
  try {
    await fsp.access(rootPath(...parts));
    return true;
  } catch {
    return false;
  }
}

export async function ensureReportsDir() {
  await fsp.mkdir(REPORTS_DIR, { recursive: true });
}

export class TestReport {
  constructor(name) {
    this.name = name;
    this.startedAt = new Date().toISOString();
    this.checks = [];
  }

  pass(message, details = {}) {
    this.checks.push({ status: 'PASS', message, details });
  }

  warn(message, details = {}) {
    this.checks.push({ status: 'WARN', message, details });
  }

  fail(message, details = {}) {
    this.checks.push({ status: 'FAIL', message, details });
  }

  assert(condition, message, details = {}) {
    if (condition) this.pass(message, details);
    else this.fail(message, details);
  }

  summary() {
    const counts = { PASS: 0, WARN: 0, FAIL: 0 };
    for (const check of this.checks) counts[check.status] += 1;
    return {
      name: this.name,
      startedAt: this.startedAt,
      finishedAt: new Date().toISOString(),
      counts,
      ok: counts.FAIL === 0,
      checks: this.checks,
    };
  }

  async write(slug) {
    await ensureReportsDir();
    const data = this.summary();
    const jsonPath = path.join(REPORTS_DIR, `latest-${slug}.json`);
    const mdPath = path.join(REPORTS_DIR, `latest-${slug}.md`);
    await fsp.writeFile(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
    await fsp.writeFile(mdPath, renderMarkdownReport(data));
    return { jsonPath, mdPath, data };
  }

  print() {
    const data = this.summary();
    console.log(`[${data.ok ? 'PASS' : 'FAIL'}] ${data.name}`);
    console.log(`PASS ${data.counts.PASS} / WARN ${data.counts.WARN} / FAIL ${data.counts.FAIL}`);
    for (const check of this.checks) {
      const mark = check.status === 'PASS' ? '✓' : check.status === 'WARN' ? '!' : '✗';
      console.log(`${mark} ${check.status} ${check.message}`);
    }
  }
}

function renderMarkdownReport(data) {
  const rows = data.checks
    .map(check => `| ${check.status} | ${escapeMd(check.message)} | ${escapeMd(JSON.stringify(check.details || {}))} |`)
    .join('\n');
  return `# ${data.name}\n\n`
    + `- Started: ${data.startedAt}\n`
    + `- Finished: ${data.finishedAt}\n`
    + `- Result: ${data.ok ? 'PASS' : 'FAIL'}\n`
    + `- Counts: PASS ${data.counts.PASS} / WARN ${data.counts.WARN} / FAIL ${data.counts.FAIL}\n\n`
    + `| Status | Check | Details |\n`
    + `| --- | --- | --- |\n`
    + `${rows}\n`;
}

function escapeMd(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function extractScriptSrcs(indexHtml) {
  const out = [];
  const re = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = re.exec(indexHtml))) out.push(match[1].split('?')[0]);
  return out;
}

export function orderedBefore(list, before, after) {
  const a = list.findIndex(item => item.endsWith(before));
  const b = list.findIndex(item => item.endsWith(after));
  return a >= 0 && b >= 0 && a < b;
}

export async function requireHttpOk(url, report) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    report.assert(res.ok, `服务可访问：${url}`, { status: res.status });
    return res.ok;
  } catch (err) {
    report.fail(`服务不可访问：${url}`, { error: err.message, hint: '先运行 npm run start:local' });
    return false;
  }
}

export async function loadPlaywright(report) {
  try {
    return require('playwright');
  } catch (err) {
    const fallbackDirs = [
      rootPath('node_modules'),
      ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean),
      path.join(process.env.HOME || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'),
    ];
    for (const dir of fallbackDirs) {
      try {
        if (!dir || !fs.existsSync(path.join(dir, 'playwright'))) continue;
        const fallbackRequire = createRequire(path.join(dir, '__playwright_loader__.cjs'));
        report.pass('Playwright 使用备用依赖路径加载', { dir: relPath(dir) });
        return fallbackRequire('playwright');
      } catch {}
    }
    report.fail('未找到 Playwright，无法运行浏览器冒烟测试', {
      hint: '在 Codex 环境通常已内置；本机可安装 playwright，或设置 NODE_PATH 指向包含 playwright 的 node_modules',
      error: err.message,
    });
    return null;
  }
}

export function chromeLaunchOptions() {
  const explicit = process.env.CHROME_EXECUTABLE_PATH;
  const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = explicit || (fs.existsSync(macChrome) ? macChrome : '');
  return {
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  };
}

export async function runBrowserSmoke(name, slug, callback) {
  const report = new TestReport(name);
  const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:8765/';
  const ok = await requireHttpOk(baseUrl, report);
  const playwright = ok ? await loadPlaywright(report) : null;
  if (!playwright) {
    report.print();
    const written = await report.write(slug);
    process.exitCode = 1;
    return written.data;
  }
  const { chromium } = playwright;
  let browser;
  const pageErrors = [];
  const consoleIssues = [];
  try {
    browser = await chromium.launch(chromeLaunchOptions());
    const page = await browser.newPage({ viewport: { width: 1365, height: 768 } });
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', msg => {
      if (['error', 'warning'].includes(msg.type())) {
        consoleIssues.push({ type: msg.type(), text: msg.text() });
      }
    });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    await callback({ page, report, baseUrl });
    report.assert(pageErrors.length === 0, '页面无致命 JS pageerror', { pageErrors });
    if (consoleIssues.length) report.warn('浏览器控制台存在 warning/error', { consoleIssues: consoleIssues.slice(0, 12) });
  } catch (err) {
    report.fail('浏览器冒烟脚本执行失败', { error: err.message });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
  report.print();
  const written = await report.write(slug);
  if (!written.data.ok) process.exitCode = 1;
  return written.data;
}
