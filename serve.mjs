#!/usr/bin/env node
/** 游戏静态服务 + Ollama 代理；支持局域网/远程访问 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 8765;
const HOST = process.env.BIND_LOCAL ? '127.0.0.1' : (process.env.HOST || '0.0.0.0');
const OLLAMA = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b-instruct';
let ollamaProcess = null;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function lanAddresses() {
  const addrs = [];
  for (const ifs of Object.values(os.networkInterfaces())) {
    for (const i of ifs) {
      if (i.family === 'IPv4' && !i.internal) addrs.push(i.address);
    }
  }
  return addrs;
}

function writeJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

async function checkOllama() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch(`${OLLAMA}/api/tags`, { method: 'GET', signal: ctrl.signal });
    clearTimeout(timer);
    return r.ok;
  } catch (_) {
    return false;
  }
}

async function waitForOllama(timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await checkOllama()) return true;
    await new Promise(resolve => setTimeout(resolve, 350));
  }
  return false;
}

async function startOllama(res) {
  if (await checkOllama()) {
    return writeJson(res, 200, { ok: true, running: true, started: false, url: OLLAMA, model: OLLAMA_MODEL });
  }
  if (!ollamaProcess || ollamaProcess.exitCode != null) {
    try {
      ollamaProcess = spawn('ollama', ['serve'], {
        detached: true,
        stdio: 'ignore',
      });
      ollamaProcess.once('error', e => {
        console.warn('[Ollama] 启动失败:', e.message);
      });
      ollamaProcess.unref();
    } catch (e) {
      return writeJson(res, 500, { ok: false, running: false, started: false, url: OLLAMA, model: OLLAMA_MODEL, error: e.message });
    }
  }
  const ready = await waitForOllama();
  return writeJson(res, ready ? 200 : 504, {
    ok: ready,
    running: ready,
    started: true,
    url: OLLAMA,
    model: OLLAMA_MODEL,
    error: ready ? '' : '已尝试启动 ollama serve，但服务暂未就绪',
  });
}

async function proxyOllama(req, res, targetPath) {
  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req);
  try {
    const r = await fetch(`${OLLAMA}${targetPath}`, {
      method: req.method,
      headers: req.method !== 'GET' ? { 'Content-Type': req.headers['content-type'] || 'application/json' } : {},
      body,
    });
    const text = await r.text();
    res.writeHead(r.status, {
      'Content-Type': r.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(text);
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Ollama 代理失败: ${e.message}\n请确认已运行 ollama serve`);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: true, service: 'dayuan-game' }));
  }
  if (req.url === '/ollama/start') {
    return startOllama(res);
  }
  if (req.url.startsWith('/ollama/')) {
    return proxyOllama(req, res, req.url.replace('/ollama', ''));
  }
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const file = path.normalize(path.join(ROOT, decodeURIComponent(urlPath)));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║     大观园 · 像素人生  已启动        ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  console.log(`  本机访问:   http://127.0.0.1:${PORT}`);
  if (HOST === '0.0.0.0') {
    const ips = lanAddresses();
    if (ips.length) {
      console.log('  局域网分享（同一 WiFi/内网的朋友）:');
      for (const ip of ips) console.log(`    → http://${ip}:${PORT}`);
    }
    console.log('');
    console.log('  远程外网分享（不在同一网络的朋友）:');
    console.log('    1. 保持本服务运行');
    console.log('    2. 另开终端执行: npm run tunnel');
    console.log('    3. 把 cloudflared 给出的 https 链接发给朋友');
  } else {
    console.log('  （仅本机模式，局域网不可用）');
  }
  console.log('');
  console.log(`  Ollama 代理: ${OLLAMA} → /ollama/`);
  console.log('  朋友无需安装，浏览器打开链接即可玩（存档在各自浏览器里）');
  console.log('');
});
