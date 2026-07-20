/** 场景背景图家具热区：读取 furnitureFinePlacements，供行走、点击与绘制使用。 */

function getSceneFinePlacement(sceneId, instanceId) {
  const scene = typeof getScene === 'function' ? getScene(sceneId) : CONFIG.scenes?.find(s => s.id === sceneId);
  if (!scene) return null;
  return (scene.furnitureFinePlacements || []).find(row => row.instanceId === instanceId) || null;
}

function isEmbeddedFurnitureInst(inst) {
  return !!(inst?.backgroundEmbedded || inst?.hotspot);
}

function furnitureFineNormRect(inst) {
  const fine = getSceneFinePlacement(inst?.sceneId, inst?.instanceId);
  if (fine && Number.isFinite(fine.x) && Number.isFinite(fine.y)) {
    return {
      x: Math.max(0, Math.min(1, fine.x)),
      y: Math.max(0, Math.min(1, fine.y)),
      w: Math.max(0.01, Math.min(1, fine.w || 0.05)),
      h: Math.max(0.01, Math.min(1, fine.h || 0.05)),
    };
  }
  const scene = typeof getScene === 'function' ? getScene(inst?.sceneId) : null;
  const tpl = typeof getTemplate === 'function' ? getTemplate(inst?.templateId) : null;
  if (!scene || !tpl || inst?.anchorCol == null || inst?.anchorRow == null) return null;
  const localCol = inst.anchorCol - scene.originCol;
  const localRow = inst.anchorRow - scene.originRow;
  return {
    x: localCol / scene.cols,
    y: localRow / scene.rows,
    w: (tpl.gridW || 1) / scene.cols,
    h: (tpl.gridH || 1) / scene.rows,
  };
}

function furnitureFineWorldRect(inst) {
  const scene = typeof getScene === 'function' ? getScene(inst?.sceneId) : null;
  const norm = furnitureFineNormRect(inst);
  if (!scene || !norm) return null;
  const scenePxW = scene.cols * CELL;
  const scenePxH = scene.rows * CELL;
  const x0 = scene.originCol * CELL;
  const y0 = scene.originRow * CELL;
  return {
    x: x0 + norm.x * scenePxW,
    y: y0 + norm.y * scenePxH,
    w: norm.w * scenePxW,
    h: norm.h * scenePxH,
  };
}

function furnitureFineEntryGrid(inst) {
  const rect = furnitureFineWorldRect(inst);
  if (!rect) {
    const tpl = typeof getTemplate === 'function' ? getTemplate(inst?.templateId) : null;
    const off = inst?._entryOverride || tpl?.entryOffset || [0, 0];
    return { col: inst.anchorCol + off[0], row: inst.anchorRow + off[1] };
  }
  return {
    col: Math.floor((rect.x + rect.w / 2) / CELL),
    row: Math.floor((rect.y + rect.h - CELL * 0.2) / CELL),
  };
}

function hitEmbeddedFurnitureInst(wx, wy) {
  if (!Array.isArray(CONFIG?.furnitureInstances)) return null;
  for (let i = CONFIG.furnitureInstances.length - 1; i >= 0; i--) {
    const inst = CONFIG.furnitureInstances[i];
    if (!isEmbeddedFurnitureInst(inst)) continue;
    const rect = furnitureFineWorldRect(inst);
    if (!rect) continue;
    if (wx >= rect.x && wx <= rect.x + rect.w && wy >= rect.y && wy <= rect.y + rect.h) {
      return inst.instanceId;
    }
  }
  return null;
}
