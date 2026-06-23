/* ═══════════════════ DRAW ═══════════════════ */
function toScreenX(x) { return x - camX; }
function toScreenY(y) { return y - camY; }

function drawWorld() {
  ctx.fillStyle = '#d8e8d0';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  for (const sc of CONFIG.scenes) {
    const x0 = sc.originCol * CELL, y0 = sc.originRow * CELL;
    const sx = toScreenX(x0), sy = toScreenY(y0), sw = sc.cols * CELL, sh = sc.rows * CELL;
    if (sx + sw < 0 || sy + sh < 0 || sx > VIEW_W || sy > VIEW_H) continue;
    if (drawRoomBackground(sc, sx, sy, sw, sh)) {
      drawScenePlaque(sc, x0, sw, y0);
      continue;
    }
    for (let r = 0; r < sc.rows; r++)
      for (let c = 0; c < sc.cols; c++) {
        const gc = sc.originCol + c, gr = sc.originRow + r;
        const cell = WORLD[gc]?.[gr];
        if (!cell) continue;
        const px = toScreenX(gc * CELL), py = toScreenY(gr * CELL);
        if (px + CELL < 0 || py + CELL < 0 || px > VIEW_W || py > VIEW_H) continue;
        const gt = cell.ground;
        const tile = (typeof AssetSystem !== 'undefined') ? AssetSystem.getGroundTile(gt, sc) : null;
        if (tile) {
          ctx.drawImage(tile, px, py);
          if ((gc + gr) % 2) { ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fillRect(px, py, CELL, CELL); }
        } else {
          if (gt === 'grass') ctx.fillStyle = ((gc + gr) % 2 === 0) ? '#7aab72' : '#6a9a66';
          else if (gt === 'corridor') ctx.fillStyle = '#a89888';
          else if (gt === 'stone') ctx.fillStyle = ((gc + gr) % 2 === 0) ? '#8ab088' : '#7aa076';
          else ctx.fillStyle = ((gc + gr) % 2 === 0) ? sc.bg : sc.bgAlt;
          ctx.fillRect(px, py, CELL, CELL);
        }
      }
    drawScenePlaque(sc, x0, sw, y0);
  }
}

function drawScenePlaque(sc, x0, sw, y0) {
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
  ctx.save();
  ctx.fillStyle = '#0c0b0a';
  ctx.fillRect(sx, sy, sw, sh);
  const fit = def.fit || 'contain';
  const scale = fit === 'cover'
    ? Math.max(sw / img.width, sh / img.height)
    : Math.min(sw / img.width, sh / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = sx + (sw - dw) / 2;
  const dy = sy + (sh - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  if (def.dim) {
    ctx.fillStyle = `rgba(0,0,0,${def.dim})`;
    ctx.fillRect(sx, sy, sw, sh);
  }
  ctx.strokeStyle = 'rgba(212,184,150,.55)';
  ctx.lineWidth = 2;
  ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);
  ctx.restore();
  return true;
}

function drawFurnitureInstances() {
  for (const inst of CONFIG.furnitureInstances) {
    const tpl = getTemplate(inst.templateId);
    if (!tpl) continue;
    const x = toScreenX(inst.anchorCol * CELL), y = toScreenY(inst.anchorRow * CELL);
    const w = tpl.gridW * CELL, h = tpl.gridH * CELL;
    if (x + w < 0 || y + h < 0 || x > VIEW_W || y > VIEW_H) continue;
    const roomMode = !!(typeof AssetSystem !== 'undefined' && AssetSystem.roomBackgroundForScene?.(inst.sceneId));
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

function drawFurnitureHotspot(inst, tpl, x, y, w, h) {
  const rt = FURN_RT[inst.instanceId];
  const occupied = rt?.users?.length > 0;
  const hover = hoverInst === inst.instanceId;
  const cx = x + w / 2;
  const cy = y + h / 2;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.55)';
  ctx.shadowBlur = hover ? 8 : 4;
  ctx.fillStyle = hover ? '#f4d27a' : occupied ? '#d98f8a' : '#f6e7b8';
  ctx.strokeStyle = hover ? '#5c4033' : '#8b7768';
  ctx.lineWidth = hover ? 2 : 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, hover ? 8 : 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#3d3028';
  ctx.font = '12px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tpl.icon || '•', cx, cy + 0.5);
  if (hover) {
    ctx.font = '11px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.textBaseline = 'alphabetic';
    const label = tpl.name;
    const tw = ctx.measureText(label).width + 12;
    ctx.fillStyle = 'rgba(250,248,244,.92)';
    ctx.strokeStyle = 'rgba(92,64,51,.75)';
    ctx.lineWidth = 1;
    ctx.fillRect(cx - tw / 2, cy + 12, tw, 18);
    ctx.strokeRect(cx - tw / 2, cy + 12, tw, 18);
    ctx.fillStyle = '#3d3028';
    ctx.fillText(label, cx, cy + 25);
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
  if (!sel && c.ai && c.ai.state !== AI_STATE.IDLE && c.ai.state !== AI_STATE.PAUSED) {
    ctx.fillStyle = '#7a6b5c';
    ctx.font = '8px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.fillText(c.ai.state.slice(0, 3), x, topY - 16);
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
