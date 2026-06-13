#!/usr/bin/env node
/** 本地静态服务 + Ollama 代理，解决 file:// 与跨域问题 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OLLAMA = 'http://127.0.0.1:11434';
const PORT = 8765;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
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
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`大观园游戏: http://127.0.0.1:${PORT}`);
  console.log(`Ollama 代理:  http://127.0.0.1:${PORT}/ollama/api/chat`);
});
