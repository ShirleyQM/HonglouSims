/* ═══════════════════ DRAW ═══════════════════ */
function toScreenX(x) { return x - camX; }
function toScreenY(y) { return y - camY; }

function drawWorld() {
  ctx.fillStyle = '#1a1210';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  for (const sc of CONFIG.scenes) {
    const x0 = sc.originCol * CELL, y0 = sc.originRow * CELL;
    const sx = toScreenX(x0), sy = toScreenY(y0), sw = sc.cols * CELL, sh = sc.rows * CELL;
    if (sx + sw < 0 || sy + sh < 0 || sx > VIEW_W || sy > VIEW_H) continue;
    for (let r = 0; r < sc.rows; r++)
      for (let c = 0; c < sc.cols; c++) {
        const gc = sc.originCol + c, gr = sc.originRow + r;
        const cell = WORLD[gc]?.[gr];
        if (!cell) continue;
        const px = toScreenX(gc * CELL), py = toScreenY(gr * CELL);
        if (px + CELL < 0 || py + CELL < 0 || px > VIEW_W || py > VIEW_H) continue;
        const gt = cell.ground;
        if (gt === 'grass') ctx.fillStyle = ((gc + gr) % 2 === 0) ? '#3a4a32' : '#334028';
        else if (gt === 'corridor') ctx.fillStyle = '#4a4038';
        else if (gt === 'stone') ctx.fillStyle = ((gc + gr) % 2 === 0) ? '#2f3a2f' : '#283528';
        else ctx.fillStyle = ((gc + gr) % 2 === 0) ? sc.bg : sc.bgAlt;
        ctx.fillRect(px, py, CELL, CELL);
      }
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(toScreenX(x0 + sw / 2 - 60), toScreenY(y0 + 4), 120, 20);
    ctx.fillStyle = '#ffd700';
    ctx.font = '14px SimSun, serif';
    ctx.textAlign = 'center';
    ctx.fillText(sc.name, toScreenX(x0 + sw / 2), toScreenY(y0 + 18));
  }
}

function drawFurnitureInstances() {
  for (const inst of CONFIG.furnitureInstances) {
    const tpl = getTemplate(inst.templateId);
    if (!tpl) continue;
    const x = toScreenX(inst.anchorCol * CELL), y = toScreenY(inst.anchorRow * CELL);
    const w = tpl.gridW * CELL, h = tpl.gridH * CELL;
    if (x + w < 0 || y + h < 0 || x > VIEW_W || y > VIEW_H) continue;
    const rt = FURN_RT[inst.instanceId];
    const occupied = rt.users.length > 0;
    const hover = hoverInst === inst.instanceId;
    ctx.fillStyle = tpl.color;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = hover ? '#ffd700' : occupied ? '#c0392b' : '#2a1f18';
    ctx.lineWidth = hover ? 2 : 1;
    ctx.strokeRect(x, y, w, h);
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText(tpl.icon, x + w / 2, y + h / 2 + 7);
    ctx.fillStyle = '#f5e6c8';
    ctx.font = '10px SimSun, serif';
    ctx.fillText(`${tpl.name} ${tpl.duration}s`, x + w / 2, y + h + 12);
  }
}

function drawPathPreview() {
  if (!previewPath?.length) return;
  ctx.strokeStyle = 'rgba(201,162,39,.5)';
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
  ctx.fillStyle = c.color;
  ctx.fillRect(x - 6, y - 18, 12, 14);
  ctx.fillStyle = c.skin;
  ctx.fillRect(x - 5, y - 28, 10, 10);
  ctx.fillStyle = c.hair;
  ctx.fillRect(x - 6, y - 32, 12, 5);
  if (c.trait === 'daiyu') { ctx.fillRect(x - 7, y - 28, 3, 8); ctx.fillRect(x + 4, y - 28, 3, 8); }
  if (c.trait === 'qingwen') { ctx.fillStyle = '#ffd700'; ctx.fillRect(x - 1, y - 30, 3, 3); }
  if (sel) { ctx.strokeStyle = '#ffd700'; ctx.strokeRect(x - 10, y - 34, 20, 36); }
  if (c.activeStates.length) {
    ctx.fillStyle = '#e74c3c';
    ctx.font = '9px SimSun, serif';
    ctx.textAlign = 'center';
    ctx.fillText(CONFIG.stateDefs[c.activeStates[0].id]?.name?.slice(0, 2) || '态', x, y - 36);
  }
  if (c.action) { ctx.fillStyle = '#ffd700'; ctx.font = '10px serif'; ctx.fillText('…', x, y - 38); }
  if (!sel && c.ai && c.ai.state !== AI_STATE.IDLE && c.ai.state !== AI_STATE.PAUSED) {
    ctx.fillStyle = '#8a7355';
    ctx.font = '8px SimSun, serif';
    ctx.fillText(c.ai.state.slice(0, 3), x, y - 40);
  }
  ctx.fillStyle = sel ? '#ffd700' : '#f5e6c8';
  ctx.font = '11px SimSun, serif';
  ctx.fillText(c.short, x, y + 14);
}

function drawSpeechBubble() {
  if (!speechBubble) return;
  const c = speechBubble.char;
  const x = Math.round(toScreenX(c.x)), y = Math.round(toScreenY(c.y)) - 44;
  ctx.font = '12px SimSun, serif';
  const maxW = 140;
  const lines = wrapText(speechBubble.text, maxW);
  const bw = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width))) + 12;
  const bh = lines.length * 14 + 10;
  const bx = Math.max(8, Math.min(x - bw / 2, VIEW_W - bw - 8));
  const by = Math.max(8, y - bh);
  ctx.fillStyle = 'rgba(255,250,240,.95)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#5c4033';
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = '#2a1f18';
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
  ctx.font = '11px SimSun, serif';
  const tw = ctx.measureText(text).width + 10;
  const tx = Math.min(mx + 10, VIEW_W - tw - 4), ty = Math.max(my - 22, 8);
  ctx.fillStyle = 'rgba(42,31,24,.92)';
  ctx.fillRect(tx, ty - 12, tw, 18);
  ctx.strokeStyle = '#c9a227';
  ctx.strokeRect(tx, ty - 12, tw, 18);
  ctx.fillStyle = '#f5e6c8';
  ctx.textAlign = 'left';
  ctx.fillText(text, tx + 5, ty + 2);
}

