/* ═══════════════════ DRAW ═══════════════════ */
function toScreenX(x) { return x - camX; }
function toScreenY(y) { return y - camY; }

const ROOM_BG_CACHE = new Map();
let MINIMAP_BASE_CACHE = null;
let MINIMAP_BASE_KEY = '';
let PAPER_TEXTURE_CACHE = null;
let PAPER_TEXTURE_KEY = '';

function drawMinimap() {
  const mini = document.getElementById('minimap');
  if (!mini || !CONFIG) return;
  const mctx = mini.getContext('2d');
  const worldW = Math.max(1, WORLD_COLS * CELL), worldH = Math.max(1, WORLD_ROWS * CELL);
  const sx = mini.width / worldW, sy = mini.height / worldH;
  const roomsKey = typeof AssetSystem !== 'undefined'
    ? Object.keys(AssetSystem.manifest?.roomBackgrounds || {}).join(',')
    : '';
  const baseKey = `${mini.width}x${mini.height}:${WORLD_COLS}x${WORLD_ROWS}:${roomsKey}`;
  if (!MINIMAP_BASE_CACHE || MINIMAP_BASE_KEY !== baseKey) {
    MINIMAP_BASE_KEY = baseKey;
    MINIMAP_BASE_CACHE = document.createElement('canvas');
    MINIMAP_BASE_CACHE.width = mini.width;
    MINIMAP_BASE_CACHE.height = mini.height;
    const bctx = MINIMAP_BASE_CACHE.getContext('2d');
    bctx.fillStyle = '#aebfa4';
    bctx.fillRect(0, 0, mini.width, mini.height);
    for (const sc of CONFIG.scenes) {
      const x = sc.originCol * CELL * sx, y = sc.originRow * CELL * sy;
      const w = sc.cols * CELL * sx, h = sc.rows * CELL * sy;
      const bg = AssetSystem?.roomBackgroundForScene?.(sc.id);
      if (bg) bctx.drawImage(bg, x, y, w, h);
      else {
        bctx.fillStyle = sc.isTransition ? '#a8947d'
          : sc.ground?.startsWith?.('grass') ? '#718c62'
          : sc.ground === 'wood' ? '#80583a'
          : '#cbbb91';
        bctx.fillRect(x, y, w, h);
      }
      bctx.strokeStyle = 'rgba(68,55,43,.65)';
      bctx.lineWidth = 1;
      bctx.strokeRect(x, y, w, h);
    }
  }
  mctx.clearRect(0, 0, mini.width, mini.height);
  mctx.drawImage(MINIMAP_BASE_CACHE, 0, 0);
  CHARS.forEach((c, i) => {
    mctx.beginPath();
    mctx.arc(c.x * sx, c.y * sy, i === selectedIdx ? 4 : 2, 0, Math.PI * 2);
    mctx.fillStyle = i === selectedIdx ? '#ffe58a' : '#7b3131';
    mctx.fill();
    if (i === selectedIdx) { mctx.strokeStyle = '#5a3824'; mctx.stroke(); }
  });
  const vx = Math.max(0, camX) * sx, vy = Math.max(0, camY) * sy;
  const vw = Math.min(VIEW_W, worldW) * sx, vh = Math.min(VIEW_H, worldH) * sy;
  mctx.fillStyle = 'rgba(255,240,151,.12)';
  mctx.fillRect(vx, vy, vw, vh);
  mctx.strokeStyle = '#fff2a8';
  mctx.lineWidth = 4;
  mctx.strokeRect(vx, vy, vw, vh);
  mctx.strokeStyle = '#5b392a';
  mctx.lineWidth = 1.5;
  mctx.strokeRect(vx, vy, vw, vh);
}

function drawWorld() {
  drawPaperWorldBackground();
  for (const sc of CONFIG.scenes) {
    const x0 = sc.originCol * CELL, y0 = sc.originRow * CELL;
    const sx = toScreenX(x0), sy = toScreenY(y0), sw = sc.cols * CELL, sh = sc.rows * CELL;
    if (sx + sw < 0 || sy + sh < 0 || sx > VIEW_W || sy > VIEW_H) continue;
    const hasRoomBg = drawRoomBackground(sc, sx, sy, sw, sh);
    if (!hasRoomBg) {
      for (let r = 0; r < sc.rows; r++)
        for (let c = 0; c < sc.cols; c++) {
          const gc = sc.originCol + c, gr = sc.originRow + r;
          const cell = WORLD[gc]?.[gr];
          if (!cell) continue;
          const px = toScreenX(gc * CELL), py = toScreenY(gr * CELL);
          if (px + CELL < 0 || py + CELL < 0 || px > VIEW_W || py > VIEW_H) continue;
          const gt = cell.ground;
          const tile = typeof AssetSystem !== 'undefined' ? AssetSystem.getGroundTile(gt, sc) : null;
          if (tile) {
            ctx.drawImage(tile, px, py);
            if ((gc + gr) % 2) { ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fillRect(px, py, CELL, CELL); }
          } else {
            if (gt === 'corridor') ctx.fillStyle = '#a89888';
            else ctx.fillStyle = '#eadfba';
            ctx.fillRect(px, py, CELL, CELL);
          }
        }
    }
    drawSceneInkFade(sx, sy, sw, sh);
  }
}

function drawPaperWorldBackground() {
  const key = `${VIEW_W}x${VIEW_H}`;
  if (!PAPER_TEXTURE_CACHE || PAPER_TEXTURE_KEY !== key) {
    PAPER_TEXTURE_KEY = key;
    PAPER_TEXTURE_CACHE = document.createElement('canvas');
    PAPER_TEXTURE_CACHE.width = VIEW_W;
    PAPER_TEXTURE_CACHE.height = VIEW_H;
    const pctx = PAPER_TEXTURE_CACHE.getContext('2d');
    const base = pctx.createLinearGradient(0, 0, VIEW_W, VIEW_H);
    base.addColorStop(0, '#f3ead0');
    base.addColorStop(0.45, '#e5d4aa');
    base.addColorStop(1, '#f7f0dd');
    pctx.fillStyle = base;
    pctx.fillRect(0, 0, VIEW_W, VIEW_H);
    drawPaperInkWash(pctx);
    const flecks = Math.max(260, Math.floor((VIEW_W * VIEW_H) / 1500));
    for (let i = 0; i < flecks; i++) {
      const x = Math.random() * VIEW_W;
      const y = Math.random() * VIEW_H;
      const a = 0.025 + Math.random() * 0.07;
      const r = Math.random() < 0.82 ? 1 : 1.8;
      pctx.fillStyle = Math.random() < 0.62
        ? `rgba(109,82,48,${a})`
        : `rgba(255,252,238,${a + 0.02})`;
      pctx.fillRect(x, y, r, r);
    }
    for (let i = 0; i < 24; i++) {
      const y = Math.random() * VIEW_H;
      const grad = pctx.createLinearGradient(0, y, VIEW_W, y + 18);
      grad.addColorStop(0, 'rgba(120,88,52,0)');
      grad.addColorStop(0.5, 'rgba(120,88,52,0.015)');
      grad.addColorStop(1, 'rgba(120,88,52,0)');
      pctx.fillStyle = grad;
      pctx.fillRect(0, y, VIEW_W, 18);
    }
    drawPaperBorderVignette(pctx);
  }
  ctx.drawImage(PAPER_TEXTURE_CACHE, 0, 0);
}

function drawPaperInkWash(pctx) {
  const patches = [
    { x: 0.08, y: 0.22, r: 0.34, color: '92,106,78', a: 0.16 },
    { x: 0.23, y: 0.82, r: 0.30, color: '96,83,58', a: 0.12 },
    { x: 0.72, y: 0.12, r: 0.28, color: '85,104,86', a: 0.12 },
    { x: 0.86, y: 0.74, r: 0.24, color: '86,76,58', a: 0.09 },
  ];
  for (const p of patches) {
    const cx = p.x * VIEW_W, cy = p.y * VIEW_H;
    const radius = p.r * Math.max(VIEW_W, VIEW_H);
    const g = pctx.createRadialGradient(cx, cy, radius * 0.08, cx, cy, radius);
    g.addColorStop(0, `rgba(${p.color},${p.a})`);
    g.addColorStop(0.46, `rgba(${p.color},${p.a * 0.42})`);
    g.addColorStop(1, `rgba(${p.color},0)`);
    pctx.fillStyle = g;
    pctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }
  drawPaperCloudBand(pctx, VIEW_W * 0.02, VIEW_H * 0.52, VIEW_W * 0.32, 0.72);
  drawPaperCloudBand(pctx, VIEW_W * 0.58, VIEW_H * 0.22, VIEW_W * 0.34, 0.44);
  drawPaperMountainStroke(pctx, VIEW_W * 0.02, VIEW_H * 0.60, VIEW_W * 0.40, 0.72);
  drawPaperMountainStroke(pctx, VIEW_W * 0.55, VIEW_H * 0.34, VIEW_W * 0.42, 0.52);
  drawPaperBambooShadow(pctx, VIEW_W * 0.03, VIEW_H * 0.16, 1, 1.25);
  drawPaperBambooShadow(pctx, VIEW_W * 0.95, VIEW_H * 0.18, -1, 0.9);
}

function drawPaperMountainStroke(pctx, x, y, w, alpha) {
  pctx.save();
  pctx.strokeStyle = `rgba(82,76,58,${0.055 * alpha})`;
  pctx.lineWidth = 2;
  pctx.beginPath();
  pctx.moveTo(x, y);
  const steps = 7;
  for (let i = 1; i <= steps; i++) {
    const px = x + (w * i) / steps;
    const py = y - Math.sin(i * 1.3) * 26 * alpha - (i % 2 ? 12 : -3) * alpha;
    pctx.lineTo(px, py);
  }
  pctx.stroke();
  pctx.strokeStyle = `rgba(82,76,58,${0.028 * alpha})`;
  pctx.lineWidth = 8;
  pctx.stroke();
  pctx.restore();
}

function drawPaperCloudBand(pctx, x, y, w, alpha) {
  pctx.save();
  pctx.lineCap = 'round';
  pctx.lineJoin = 'round';
  for (let i = 0; i < 3; i++) {
    pctx.strokeStyle = `rgba(92,82,63,${0.045 * alpha / (i + 1)})`;
    pctx.lineWidth = 14 - i * 3;
    pctx.beginPath();
    pctx.moveTo(x, y + i * 10);
    pctx.bezierCurveTo(x + w * 0.14, y - 18 - i * 4, x + w * 0.28, y + 18, x + w * 0.42, y);
    pctx.bezierCurveTo(x + w * 0.58, y - 24, x + w * 0.72, y + 12, x + w, y - 5 + i * 6);
    pctx.stroke();
  }
  pctx.restore();
}

function drawPaperBambooShadow(pctx, x, y, dir, opacity = 1) {
  pctx.save();
  pctx.strokeStyle = `rgba(57,78,50,${0.07 * opacity})`;
  pctx.fillStyle = `rgba(57,78,50,${0.052 * opacity})`;
  pctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const bx = x + dir * i * 9;
    pctx.beginPath();
    pctx.moveTo(bx, y + 160);
    pctx.quadraticCurveTo(bx + dir * 22, y + 70, bx + dir * 10, y);
    pctx.stroke();
    for (let j = 0; j < 5; j++) {
      const ly = y + 28 + j * 24 + i * 4;
      pctx.beginPath();
      pctx.ellipse(bx + dir * (16 + j * 3), ly, 4, 17, dir * 0.95, 0, Math.PI * 2);
      pctx.fill();
    }
  }
  pctx.restore();
}

function drawPaperBorderVignette(pctx) {
  const g = pctx.createRadialGradient(VIEW_W * 0.5, VIEW_H * 0.48, Math.min(VIEW_W, VIEW_H) * 0.22, VIEW_W * 0.5, VIEW_H * 0.5, Math.max(VIEW_W, VIEW_H) * 0.78);
  g.addColorStop(0, 'rgba(255,255,245,0)');
  g.addColorStop(0.72, 'rgba(100,72,44,0.035)');
  g.addColorStop(1, 'rgba(76,50,33,0.16)');
  pctx.fillStyle = g;
  pctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function drawSceneInkFade(sx, sy, sw, sh) {
  const fade = Math.max(18, Math.min(46, CELL * 1.25));
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  const sides = [
    [sx, sy, fade, sh, sx, sy, sx + fade, sy, 'left'],
    [sx + sw - fade, sy, fade, sh, sx + sw, sy, sx + sw - fade, sy, 'right'],
    [sx, sy, sw, fade, sx, sy, sx, sy + fade, 'top'],
    [sx, sy + sh - fade, sw, fade, sx, sy + sh, sx, sy + sh - fade, 'bottom'],
  ];
  for (const [x, y, w, h, x1, y1, x2, y2, side] of sides) {
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, 'rgba(64,54,42,.26)');
    g.addColorStop(0.58, 'rgba(83,72,56,.09)');
    g.addColorStop(1, 'rgba(83,72,56,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    if (side === 'top' || side === 'bottom') {
      ctx.fillStyle = side === 'top' ? 'rgba(255,250,232,.055)' : 'rgba(56,46,36,.035)';
      ctx.fillRect(x, y, w, Math.max(1, h * 0.18));
    }
  }
  ctx.restore();
}

function drawScenePlaques() {
  if (!CONFIG?.scenes) return;
  for (const sc of CONFIG.scenes) {
    const x0 = sc.originCol * CELL, y0 = sc.originRow * CELL;
    const sx = toScreenX(x0), sy = toScreenY(y0), sw = sc.cols * CELL, sh = sc.rows * CELL;
    if (sx + sw < 0 || sy + sh < 0 || sx > VIEW_W || sy > VIEW_H) continue;
    drawScenePlaque(sc, x0, sw, y0);
  }
}

function drawScenePlaque(sc, x0, sw, y0) {
  if (sc.hidePlaque || sc.hideTitle) return;
  const plaqueX = toScreenX(x0 + sw / 2 - 60);
  const plaqueY = toScreenY(y0 + 4);
  const plaqueGrad = ctx.createLinearGradient(plaqueX, plaqueY, plaqueX, plaqueY + 20);
  plaqueGrad.addColorStop(0, '#8e5043');
  plaqueGrad.addColorStop(1, '#6f382f');
  ctx.fillStyle = plaqueGrad;
  ctx.fillRect(plaqueX, plaqueY, 120, 20);
  ctx.strokeStyle = '#d4b896';
  ctx.lineWidth = 1;
  ctx.strokeRect(plaqueX + 1, plaqueY + 1, 118, 18);
  ctx.fillStyle = '#e5c579';
  ctx.font = '14px "Microsoft YaHei", "PingFang SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(sc.name, toScreenX(x0 + sw / 2), toScreenY(y0 + 18));
}

function drawRoomBackground(sc, sx, sy, sw, sh) {
  if (typeof AssetSystem === 'undefined') return false;
  const img = AssetSystem.roomBackgroundForScene?.(sc.id);
  if (!img) return false;
  const def = AssetSystem.roomBackgroundDef?.(sc.id) || {};
  const cw = Math.max(1, Math.round(sw));
  const ch = Math.max(1, Math.round(sh));
  const fit = def.fit || 'contain';
  const key = `${sc.id}:${img.src}:${img.naturalWidth || img.width}x${img.naturalHeight || img.height}:${cw}x${ch}:${fit}:${def.dim || 0}`;
  let cached = ROOM_BG_CACHE.get(key);
  if (!cached) {
    cached = document.createElement('canvas');
    cached.width = cw;
    cached.height = ch;
    const cctx = cached.getContext('2d');
    cctx.imageSmoothingEnabled = true;
    cctx.imageSmoothingQuality = 'high';
    drawRoomBackgroundTileFill(cctx, sc, cw, ch, def);
    const scale = fit === 'cover'
      ? Math.max(cw / img.width, ch / img.height)
      : Math.min(cw / img.width, ch / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    cctx.drawImage(img, dx, dy, dw, dh);
    if (def.dim) {
      cctx.fillStyle = `rgba(0,0,0,${def.dim})`;
      cctx.fillRect(0, 0, cw, ch);
    }
    cctx.strokeStyle = 'rgba(212,184,150,.55)';
    cctx.lineWidth = 2;
    cctx.strokeRect(1, 1, cw - 2, ch - 2);
    ROOM_BG_CACHE.set(key, cached);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(sx, sy, sw, sh);
  ctx.clip();
  ctx.drawImage(cached, sx, sy, sw, sh);
  ctx.restore();
  return true;
}

function drawRoomBackgroundTileFill(targetCtx, sc, cw, ch, def = {}) {
  targetCtx.fillStyle = def.fill || sc.bgAlt || sc.bg || '#eadfba';
  targetCtx.fillRect(0, 0, cw, ch);
  const tile = typeof AssetSystem !== 'undefined' ? AssetSystem.getGroundTile?.(sc.ground, sc) : null;
  if (!tile) return;
  for (let y = 0; y < ch; y += CELL) {
    for (let x = 0; x < cw; x += CELL) {
      targetCtx.drawImage(tile, x, y);
      const gc = sc.originCol + Math.floor(x / CELL);
      const gr = sc.originRow + Math.floor(y / CELL);
      if ((gc + gr) % 2) {
        targetCtx.fillStyle = 'rgba(0,0,0,.045)';
        targetCtx.fillRect(x, y, CELL, CELL);
      }
    }
  }
}

function drawFurnitureInstances() {
  for (const inst of CONFIG.furnitureInstances) {
    const tpl = getTemplate(inst.templateId);
    if (!tpl) continue;
    const x = toScreenX(inst.anchorCol * CELL), y = toScreenY(inst.anchorRow * CELL);
    const w = tpl.gridW * CELL, h = tpl.gridH * CELL;
    if (x + w < 0 || y + h < 0 || x > VIEW_W || y > VIEW_H) continue;
    const roomMode = !!(typeof AssetSystem !== 'undefined' && AssetSystem.roomBackgroundForScene?.(inst.sceneId));
    if (inst.backgroundEmbedded) {
      drawFurnitureHotspot(inst, tpl, x, y, w, h);
      continue;
    }
    const spriteImg = (typeof AssetSystem !== 'undefined' && AssetSystem.furnitureImageForTemplate)
      ? AssetSystem.furnitureImageForTemplate(inst.templateId) : null;
    if (spriteImg) {
      const spriteDef = AssetSystem.furnitureSpriteDef?.(inst.templateId) || {};
      drawFurnitureSprite(inst, tpl, x, y, w, h, spriteImg, spriteDef, roomMode);
      continue;
    }
    if (roomMode) {
      drawFurnitureHotspot(inst, tpl, x, y, w, h);
      continue;
    }
    const rt = FURN_RT[inst.instanceId];
    const occupied = rt.users.length > 0;
    const hover = hoverInst === inst.instanceId;
    ctx.fillStyle = tpl.color;
    ctx.fillRect(x, y, w, h);
    // 顶/底明暗，做出立体感（有资源管线时取 manifest 参数，否则用默认值）
    const fs = (typeof AssetSystem !== 'undefined' && AssetSystem.furnitureShade)
      ? AssetSystem.furnitureShade() : { topShade: 0.18, bottomShade: -0.22 };
    const shadeFn = (typeof AssetSystem !== 'undefined' && AssetSystem.shade)
      ? AssetSystem.shade : null;
    if (shadeFn) {
      const topH = Math.max(2, Math.round(h * 0.22));
      ctx.fillStyle = shadeFn(tpl.color, fs.topShade);
      ctx.fillRect(x, y, w, topH);
      ctx.fillStyle = shadeFn(tpl.color, fs.bottomShade);
      ctx.fillRect(x, y + h - topH, w, topH);
    }
    ctx.strokeStyle = hover ? '#a8843a' : occupied ? '#a65d5d' : '#6b5a4c';
    ctx.lineWidth = hover ? 2 : 1;
    ctx.strokeRect(x, y, w, h);
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText(tpl.icon, x + w / 2, y + h / 2 + 7);
    ctx.fillStyle = '#3d3028';
    ctx.font = '10px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText(`${tpl.name} ${tpl.duration}s`, x + w / 2, y + h + 12);
  }
}

function drawFurnitureSprite(inst, tpl, x, y, w, h, img, def, roomMode) {
  const rt = FURN_RT[inst.instanceId];
  const occupied = rt?.users?.length > 0;
  const hover = hoverInst === inst.instanceId;
  const minW = Math.max(w, CELL * 2);
  const minH = Math.max(h, CELL * 2);
  const maxW = minW * (def.scaleW || def.scale || 1);
  const maxH = minH * (def.scaleH || def.scale || 1);
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const dw = Math.max(1, img.width * scale);
  const dh = Math.max(1, img.height * scale);
  const dx = Math.round(x + w / 2 - dw / 2 + (def.offsetX || 0));
  const dy = Math.round(y + h - dh + (def.offsetY || 0));
  const cx = x + w / 2;
  const footY = y + h - 2;

  ctx.save();
  ctx.fillStyle = roomMode ? 'rgba(0,0,0,.26)' : 'rgba(0,0,0,.18)';
  ctx.beginPath();
  ctx.ellipse(cx, footY, Math.max(10, w * 0.44), Math.max(3, h * 0.12), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, dx, dy, dw, dh);

  if (hover || occupied) {
    ctx.strokeStyle = hover ? '#a8843a' : '#a65d5d';
    ctx.lineWidth = hover ? 2 : 1.5;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
  if (hover) {
    ctx.font = '11px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const label = tpl.name;
    const tw = ctx.measureText(label).width + 12;
    const lx = Math.max(2, Math.min(VIEW_W - tw - 2, cx - tw / 2));
    const ly = Math.min(VIEW_H - 22, Math.max(2, y + h + 5));
    ctx.fillStyle = 'rgba(250,248,244,.94)';
    ctx.strokeStyle = 'rgba(92,64,51,.72)';
    ctx.lineWidth = 1;
    ctx.fillRect(lx, ly, tw, 18);
    ctx.strokeRect(lx, ly, tw, 18);
    ctx.fillStyle = '#3d3028';
    ctx.fillText(label, lx + tw / 2, ly + 13);
  }
  ctx.restore();
}

function drawFurnitureHotspot(inst, tpl, x, y, w, h) {
  const fineRect = furnitureFineWorldRect(inst);
  if (fineRect) {
    x = toScreenX(fineRect.x);
    y = toScreenY(fineRect.y);
    w = fineRect.w;
    h = fineRect.h;
  }
  const rt = FURN_RT[inst.instanceId];
  const occupied = rt?.users?.length > 0;
  const hover = hoverInst === inst.instanceId;
  const lineY = y + h - 2;
  const t = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
  const pulse = hover ? 1 : 0.72 + Math.sin(t * 3.2) * 0.12;
  ctx.save();
  ctx.shadowColor = hover
    ? 'rgba(255, 228, 150, 0.98)'
    : occupied ? 'rgba(232, 150, 130, 0.75)' : 'rgba(255, 210, 120, 0.72)';
  ctx.shadowBlur = hover ? 16 : 10 * pulse;
  ctx.strokeStyle = hover ? '#fff0c0' : occupied ? '#e8a090' : `rgba(255, 224, 150, ${0.55 + pulse * 0.35})`;
  ctx.lineWidth = hover ? 3 : 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.06, lineY);
  ctx.lineTo(x + w * 0.94, lineY);
  ctx.stroke();
  ctx.shadowBlur = 0;
  const glow = ctx.createLinearGradient(x, lineY - 8, x, lineY + 4);
  glow.addColorStop(0, 'rgba(255, 240, 190, 0)');
  glow.addColorStop(1, hover ? 'rgba(255, 220, 130, 0.28)' : 'rgba(255, 210, 120, 0.16)');
  ctx.fillStyle = glow;
  ctx.fillRect(x + w * 0.06, lineY - 8, w * 0.88, 10);
  if (hover) {
    ctx.font = '11px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const label = tpl.name || '';
    const tw = ctx.measureText(label).width + 12;
    const lx = Math.max(2, Math.min(VIEW_W - tw - 2, x + w / 2 - tw / 2));
    const ly = Math.min(VIEW_H - 22, Math.max(2, y - 6));
    ctx.fillStyle = 'rgba(250,248,244,.94)';
    ctx.strokeStyle = 'rgba(92,64,51,.72)';
    ctx.lineWidth = 1;
    ctx.fillRect(lx, ly - 14, tw, 18);
    ctx.strokeRect(lx, ly - 14, tw, 18);
    ctx.fillStyle = '#3d3028';
    ctx.fillText(label, lx + tw / 2, ly);
  }
  ctx.restore();
}

function drawPathPreview() {
  if (!previewPath?.length) return;
  ctx.strokeStyle = 'rgba(168,132,58,.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  previewPath.forEach((p, i) => {
    const px = toScreenX(p.col * CELL + CELL / 2), py = toScreenY(p.row * CELL + CELL / 2);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.stroke();
}

function drawChar(c, sel) {
  const x = Math.round(toScreenX(c.x)), y = Math.round(toScreenY(c.y));
  if (x < -20 || y < -40 || x > VIEW_W + 20 || y > VIEW_H + 20) return;
  ctx.fillStyle = 'rgba(0,0,0,.3)';
  ctx.beginPath();
  ctx.ellipse(x, y + 3, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // 有精灵图则逐帧动画，否则回退色块
  let topY;
  if (typeof AssetSystem !== 'undefined' && AssetSystem.ready && drawCharSprite(c, x, y)) {
    topY = y - (AssetSystem.manifest.draw.h * AssetSystem.manifest.draw.footFrac);
  } else {
    drawCharBlocks(c, x, y);
    topY = y - 32;
  }
  drawCharOverlays(c, x, y, sel, topY);
}

function activeSocialActionFor(c) {
  if (c.action?.type === 'interaction') return { initiator: c, target: c.action.target, action: c.action };
  if (c._autoSocialIntent) {
    return {
      initiator: c,
      target: getChar(c._autoSocialIntent.targetId),
      action: { autoSocial: true, pending: true },
    };
  }
  return CHARS.map(ch => {
    if (ch.action?.type === 'interaction')
      return { initiator: ch, target: ch.action.target, action: ch.action };
    if (ch._autoSocialIntent?.targetId === c.id)
      return { initiator: ch, target: c, action: { autoSocial: true, pending: true } };
    return null;
  }).find(row => row?.target?.id === c.id) || null;
}

function drawSocialLinks() {
  if (CONFIG.questConfig?.ui?.showSocialLinks === false) return;
  for (const c of CHARS) {
    const act = c.action;
    const pending = !act || act.type !== 'interaction';
    const target = act?.type === 'interaction'
      ? act.target
      : (c._autoSocialIntent ? getChar(c._autoSocialIntent.targetId) : null);
    if (!target) continue;
    const x1 = toScreenX(c.x), y1 = toScreenY(c.y - 16);
    const x2 = toScreenX(target.x), y2 = toScreenY(target.y - 16);
    if (x1 < -40 || y1 < -40 || x1 > VIEW_W + 40 || y1 > VIEW_H + 40) continue;
    ctx.save();
    const autoSocial = pending || act.autoSocial;
    ctx.strokeStyle = autoSocial ? 'rgba(168,132,58,.82)' : 'rgba(106,143,168,.72)';
    ctx.lineWidth = autoSocial ? 2 : 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, Math.min(y1, y2) - 18, x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 12;
    const actionName = pending
      ? (c._autoSocialIntent?.name || '交谈')
      : (act.tpl?.name || '交谈');
    const label = pending
      ? `前往社交 · ${actionName}`
      : autoSocial ? `自主社交 · ${actionName}` : actionName;
    ctx.font = '10px "Microsoft YaHei", "PingFang SC", sans-serif';
    const width = ctx.measureText(label).width + 14;
    ctx.fillStyle = 'rgba(238,246,234,.94)';
    ctx.fillRect(midX - width / 2, midY - 12, width, 18);
    ctx.strokeStyle = autoSocial ? '#a8843a' : '#6a8fa8';
    ctx.strokeRect(midX - width / 2, midY - 12, width, 18);
    ctx.fillStyle = '#5c4033';
    ctx.textAlign = 'center';
    ctx.fillText(label, midX, midY + 1);
    ctx.restore();
  }
}

function furnitureFacing(c) {
  const a = c.action;
  if (!a || !a.inst || !a.tpl) return null;
  const fc = gridToPixel(a.inst.anchorCol + (a.tpl.gridW - 1) / 2, a.inst.anchorRow + (a.tpl.gridH - 1) / 2);
  const dx = fc.x - c.x, dy = fc.y - c.y;
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return null;
  return Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 'up' : 'down') : (dx < 0 ? 'left' : 'right');
}

function drawCharSprite(c, x, y) {
  const m = AssetSystem.manifest;
  const charSheetKey = AssetSystem.sheetKeyForChar(c);
  let renderKey = charSheetKey;
  let sheet = AssetSystem.getSheet(renderKey);
  if (!sheet && renderKey !== 'male' && renderKey !== 'female') {
    renderKey = c.gender === '男' ? 'male' : 'female';
    sheet = AssetSystem.getSheet(renderKey);
  }
  if (!sheet) return false;
  const sheetDef = AssetSystem.getSheetDef(charSheetKey);
  const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const moving = (now - (c._lastMoveTs || 0)) < 150;
  const usingFurn = !moving && c.action && c.action.type === 'furniture' && c.action.phase === 'use';

  let clipName = 'idle', facing = c.facing || 'down';
  if (moving) {
    clipName = 'walk';
  } else if (usingFurn) {
    clipName = AssetSystem.furnitureClip(c.action.tpl?.category);
    facing = furnitureFacing(c) || facing;
  }
  const anims = sheetDef?.animations || m.animations;
  const anim = anims[clipName] || anims.idle || m.animations.idle;
  const row = anim.rows[facing] ?? anim.rows.down;
  const frames = anim.frames;
  const frameIdx = frames.length > 1
    ? frames[Math.floor((c.animTime || 0) * (anim.fps || 1)) % frames.length]
    : frames[0];
  const bob = anim.bob ? Math.sin((c.animTime || 0) * 3) * anim.bob : 0;

  const fw = sheetDef?.frameW || m.frameW;
  const fh = sheetDef?.frameH || m.frameH;
  const ox = sheetDef?.offsetX || 0;
  const oy = sheetDef?.offsetY || 0;
  const dw = m.draw.w, dh = m.draw.h;
  ctx.drawImage(sheet, ox + frameIdx * fw, oy + row * fh, fw, fh,
    Math.round(x - dw / 2), Math.round(y - dh * m.draw.footFrac + bob), dw, dh);
  return true;
}

function drawCharBlocks(c, x, y) {
  ctx.fillStyle = c.color;
  ctx.fillRect(x - 6, y - 18, 12, 14);
  ctx.fillStyle = c.skin;
  ctx.fillRect(x - 5, y - 28, 10, 10);
  ctx.fillStyle = c.hair;
  ctx.fillRect(x - 6, y - 32, 12, 5);
  if (c.trait === 'daiyu') { ctx.fillRect(x - 7, y - 28, 3, 8); ctx.fillRect(x + 4, y - 28, 3, 8); }
  if (c.trait === 'qingwen') { ctx.fillStyle = '#a8843a'; ctx.fillRect(x - 1, y - 30, 3, 3); }
}

function getDrawStateTagClass(sid) {
  if (typeof getStateTagClass === 'function') return getStateTagClass(sid);
  const sd = CONFIG.stateDefs?.[sid];
  if (!sd) return 'neutral';
  if (sd.polarity === 'positive') return 'buff';
  if (sd.polarity === 'negative') return 'debuff';
  if (sd.polarity === 'mixed') return 'neutral';
  if (sd.blockedSkills?.length) return 'debuff';
  if (Object.values(sd.needMods || {}).some(m => (m.grow || 0) > 1)) return 'buff';
  return 'neutral';
}

function getDrawStateColor(sid) {
  const cls = getDrawStateTagClass(sid);
  if (cls === 'buff') return '#8fb896';
  if (cls === 'debuff') return '#c45a5a';
  return '#8a7d72';
}

function drawCharOverlays(c, x, y, sel, topY) {
  if (sel) {
    ctx.strokeStyle = '#a8843a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 12, topY - 2, 24, (y - topY) + 4);
  }
  ctx.textAlign = 'center';
  if (c.action && c.action.type === 'furniture' && c.action.phase === 'use' && c.action.tpl?.category === 'bed') {
    ctx.font = '12px serif';
    ctx.fillText('💤', x + 10, topY + 2 + Math.sin((c.animTime || 0) * 2) * 2);
  }
  if (c.activeStates.length) {
    ctx.fillStyle = getDrawStateColor(c.activeStates[0].id);
    ctx.font = '9px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText(CONFIG.stateDefs[c.activeStates[0].id]?.name?.slice(0, 2) || '态', x, topY - 4);
  }
  if (c.action) { ctx.fillStyle = '#a8843a'; ctx.font = '10px serif'; ctx.fillText('…', x, topY - 14); }
  const social = activeSocialActionFor(c);
  if (social) {
    ctx.font = '12px serif';
    ctx.fillText(social.action.autoSocial ? '💬' : '◌', x + 11, topY - 5);
  }
  ctx.font = '11px "Microsoft YaHei", "PingFang SC", sans-serif';
  if (sel) {
    ctx.fillStyle = '#a8843a';
  } else {
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(61,48,40,.72)';
    ctx.strokeText(c.short, x, y + 14);
    ctx.fillStyle = '#d8d8d8';
  }
  ctx.fillText(c.short, x, y + 14);
  drawSkillLevelBubbles(c, x, y + 28);
}

function drawSkillLevelBubbles(c, x, baseY) {
  if (!Array.isArray(c.skillLevelBubbles) || !c.skillLevelBubbles.length) return;
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  c.skillLevelBubbles = c.skillLevelBubbles.filter(b => now - (b.startedAt || now) < (b.durationMs || 2600));
  if (!c.skillLevelBubbles.length) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '10px "Microsoft YaHei", "PingFang SC", sans-serif';
  c.skillLevelBubbles.forEach((b, i) => {
    const duration = b.durationMs || 2600;
    const t = Math.max(0, Math.min(1, (now - (b.startedAt || now)) / duration));
    const alpha = 1 - t;
    const text = b.text || '';
    const tw = ctx.measureText(text).width;
    const bw = Math.min(96, tw + 12);
    const bx = Math.max(6, Math.min(VIEW_W - bw - 6, x - bw / 2));
    const by = baseY + i * 16 - t * 18;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = 'rgba(255,248,218,.94)';
    ctx.fillRect(bx, by - 11, bw, 16);
    ctx.strokeStyle = 'rgba(168,132,58,.82)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by - 11, bw, 16);
    ctx.fillStyle = '#8a5c1e';
    ctx.fillText(text, x, by + 1);
  });
  ctx.restore();
}

function drawSpeechBubble() {
  if (!speechBubble) return;
  const c = speechBubble.char;
  const x = Math.round(toScreenX(c.x)), y = Math.round(toScreenY(c.y)) - 44;
  ctx.font = '12px "Microsoft YaHei", "PingFang SC", sans-serif';
  const maxW = 140;
  const lines = wrapText(speechBubble.text, maxW);
  const bw = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width))) + 12;
  const bh = lines.length * 14 + 10;
  const bx = Math.max(8, Math.min(x - bw / 2, VIEW_W - bw - 8));
  const by = Math.max(8, y - bh);
  ctx.fillStyle = 'rgba(255,250,240,.95)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#6b5a4c';
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = '#6b5a4c';
  ctx.textAlign = 'left';
  lines.forEach((ln, i) => ctx.fillText(ln, bx + 6, by + 14 + i * 14));
}

function wrapText(text, maxW) {
  const lines = []; let cur = '';
  for (const ch of text) {
    const t = cur + ch;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = ch; }
    else cur = t;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

function drawHoverTip(text, mx, my) {
  if (!text) return;
  ctx.font = '11px "Microsoft YaHei", "PingFang SC", sans-serif';
  const tw = ctx.measureText(text).width + 10;
  const tx = Math.min(mx + 10, VIEW_W - tw - 4), ty = Math.max(my - 22, 8);
  ctx.fillStyle = 'rgba(228,240,222,.96)';
  ctx.fillRect(tx, ty - 12, tw, 18);
  ctx.strokeStyle = '#6b5a4c';
  ctx.strokeRect(tx, ty - 12, tw, 18);
  ctx.fillStyle = '#3d3028';
  ctx.textAlign = 'left';
  ctx.fillText(text, tx + 5, ty + 2);
}
