import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createThreeAIRenderer(options) {
  const { container, config, getChars, onGroundClick, onCharClick, onFurnitureClick } = options;
  const worldCols = Math.max(...config.scenes.map(s => s.originCol + s.cols));
  const worldRows = Math.max(...config.scenes.map(s => s.originRow + s.rows));
  const worldCenter = new THREE.Vector3(worldCols / 2, 0, worldRows / 2);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x171913);
  scene.fog = new THREE.Fog(0x171913, 48, 108);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 240);
  camera.position.set(18, 48, 52);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.minDistance = 15;
  controls.maxDistance = 104;

  scene.add(new THREE.HemisphereLight(0xfff2d2, 0x263829, 1.55));
  const sun = new THREE.DirectionalLight(0xffdfae, 2.25);
  sun.position.set(-24, 45, 18);
  sun.castShadow = true;
  sun.shadow.camera.left = -56;
  sun.shadow.camera.right = 56;
  sun.shadow.camera.top = 56;
  sun.shadow.camera.bottom = -56;
  scene.add(sun);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const groundPickMeshes = [];
  const clickables = [];
  const charGroups = new Map();
  const charLabels = new Map();
  const bubbleLabels = new Map();
  const linkGroup = new THREE.Group();
  scene.add(linkGroup);
  let followSelected = true;
  let selectedId = '';

  const mats = {
    grass: new THREE.MeshStandardMaterial({ color: 0x607c4f, roughness: .9 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x5b3826, roughness: .78 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x747465, roughness: .88 }),
    corridor: new THREE.MeshStandardMaterial({ color: 0x766653, roughness: .85 }),
    wall: new THREE.MeshStandardMaterial({ color: 0x7b4c34, roughness: .75 }),
    gate: new THREE.MeshStandardMaterial({ color: 0xd7ae65, roughness: .45, metalness: .05 }),
    link: new THREE.LineBasicMaterial({ color: 0xf0d28a, transparent: true, opacity: .7 }),
  };

  function gridToWorld(col, row, y = 0) {
    return new THREE.Vector3(col - worldCenter.x, y, row - worldCenter.z);
  }

  function worldToGrid(pos) {
    return { col: Math.floor(pos.x + worldCenter.x), row: Math.floor(pos.z + worldCenter.z) };
  }

  function cssColorToHex(color, fallback = 0x8a6a48) {
    if (!color || !/^#?[0-9a-f]{6}$/i.test(color)) return fallback;
    return parseInt(color.replace('#', ''), 16);
  }

  function makeLabel(text, opts = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 2;
    canvas.width = 256 * scale;
    canvas.height = 64 * scale;
    ctx.scale(scale, scale);
    ctx.font = `${opts.bold ? 700 : 500} ${opts.size || 22}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const w = Math.min(236, ctx.measureText(text).width + 28);
    ctx.fillStyle = opts.bg || 'rgba(35, 25, 17, .78)';
    ctx.strokeStyle = opts.border || 'rgba(235, 196, 123, .7)';
    ctx.lineWidth = 1;
    ctx.fillRect(128 - w / 2, 15, w, 34);
    ctx.strokeRect(128 - w / 2 + .5, 15.5, w - 1, 33);
    ctx.fillStyle = opts.color || '#f5e4be';
    ctx.fillText(text, 128, 32);
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  }

  function addLabel(text, pos, opts = {}) {
    const sprite = makeLabel(text, opts);
    sprite.position.copy(pos);
    sprite.scale.set(opts.width || 6, opts.height || 1.5, 1);
    scene.add(sprite);
    return sprite;
  }

  function setLabel(sprite, text, opts = {}) {
    if (!sprite || sprite.userData.text === text) return;
    sprite.userData.text = text;
    const replacement = makeLabel(text, opts);
    sprite.material.map?.dispose?.();
    sprite.material.map = replacement.material.map;
    sprite.material.needsUpdate = true;
  }

  function addBox(w, h, d, pos, mat, name) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.copy(pos);
    mesh.name = name || '';
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function addScene(sc) {
    const mat = mats[sc.ground] || mats.grass;
    const center = gridToWorld(sc.originCol + sc.cols / 2, sc.originRow + sc.rows / 2, -0.03);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(sc.cols, 0.08, sc.rows), mat);
    floor.position.copy(center);
    floor.receiveShadow = true;
    floor.userData = { type: 'ground', sceneId: sc.id };
    scene.add(floor);
    groundPickMeshes.push(floor);

    const isCorridor = !!sc.isTransition;
    const wallH = isCorridor ? 0.12 : 0.72;
    const wallT = isCorridor ? 0.05 : 0.16;
    const wallMat = isCorridor ? mats.corridor : mats.wall;
    const x0 = sc.originCol, x1 = sc.originCol + sc.cols;
    const z0 = sc.originRow, z1 = sc.originRow + sc.rows;
    addBox(sc.cols, wallH, wallT, gridToWorld(sc.originCol + sc.cols / 2, z0, wallH / 2), wallMat);
    addBox(sc.cols, wallH, wallT, gridToWorld(sc.originCol + sc.cols / 2, z1, wallH / 2), wallMat);
    addBox(wallT, wallH, sc.rows, gridToWorld(x0, sc.originRow + sc.rows / 2, wallH / 2), wallMat);
    addBox(wallT, wallH, sc.rows, gridToWorld(x1, sc.originRow + sc.rows / 2, wallH / 2), wallMat);
    addLabel(sc.name, gridToWorld(sc.originCol + sc.cols / 2, sc.originRow + .8, 1.2), {
      size: 18, width: Math.min(7.5, Math.max(4.8, sc.name.length * .9)), height: 1.25, bold: true,
      bg: isCorridor ? 'rgba(45, 39, 31, .72)' : 'rgba(76, 42, 31, .8)',
    });
  }

  function addFurniture(inst) {
    const tpl = config.furnitureTemplates[inst.templateId];
    if (!tpl) return;
    const hByCat = { bed: .42, bath: .55, kitchen: .72, pavilion: 1.55, garden: .36, seat: .42, desk: .62, workdesk: .58, table: .54, meal: .54, wardrobe: .8, instrument: .5 };
    const h = hByCat[tpl.category] || .5;
    const mat = new THREE.MeshStandardMaterial({ color: cssColorToHex(tpl.color), roughness: .72, metalness: ['wash', 'bath'].includes(tpl.category) ? .12 : .02 });
    const pos = gridToWorld(inst.anchorCol + tpl.gridW / 2, inst.anchorRow + tpl.gridH / 2, h / 2);
    const mesh = addBox(tpl.gridW * .88, h, tpl.gridH * .88, pos, mat, tpl.name);
    mesh.userData = { type: 'furniture', instanceId: inst.instanceId, name: tpl.name };
    clickables.push(mesh);
    addLabel(tpl.icon || tpl.name.slice(0, 1), pos.clone().add(new THREE.Vector3(0, h * .95 + .35, 0)), {
      size: 24, width: 1.45, height: .72, bg: 'rgba(30, 24, 18, .62)', border: 'rgba(255,230,170,.42)',
    });
  }

  function addCharacter(c, index) {
    const group = new THREE.Group();
    group.userData = { type: 'character', id: c.id, name: c.name };
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(.28, .36, 1.12, 16),
      new THREE.MeshStandardMaterial({ color: cssColorToHex(c.color, 0xb55f56), roughness: .66 })
    );
    body.position.y = .7;
    body.castShadow = true;
    group.add(body);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(.28, 20, 16),
      new THREE.MeshStandardMaterial({ color: cssColorToHex(c.skin, 0xf1c8a0), roughness: .5 })
    );
    head.position.y = 1.42;
    head.castShadow = true;
    group.add(head);
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(.295, 20, 10, 0, Math.PI * 2, 0, Math.PI * .55),
      new THREE.MeshStandardMaterial({ color: cssColorToHex(c.hair, 0x16110d), roughness: .8 })
    );
    hair.position.y = 1.52;
    group.add(hair);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(.42, .035, 8, 36),
      new THREE.MeshBasicMaterial({ color: index === 0 ? 0x9fb8ff : 0x6c7568 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .04;
    ring.name = 'selection-ring';
    group.add(ring);
    scene.add(group);
    charGroups.set(c.id, group);
    clickables.push(group);
    const label = addLabel(c.short || c.name, new THREE.Vector3(), {
      size: 19, width: Math.max(2.1, (c.short || c.name).length * .7), height: .9,
      bg: 'rgba(20, 16, 13, .72)', border: 'rgba(245,211,144,.72)', bold: true,
    });
    charLabels.set(c.id, label);
    const bubble = addLabel('', new THREE.Vector3(), {
      size: 17, width: 4.2, height: .9, bg: 'rgba(245,238,219,.88)', border: 'rgba(83,62,44,.65)', color: '#34271d',
    });
    bubble.visible = false;
    bubbleLabels.set(c.id, bubble);
    updateCharacter(c);
  }

  function addConnections() {
    for (const conn of config.connections || []) {
      addBox(.76, .08, .76, gridToWorld(conn.col + .5, conn.row + .5, .08), mats.gate, 'gate');
    }
  }

  function addGardenDetails() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3925, roughness: .9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x395f36, roughness: .9 });
    for (const [col, row] of [[21, 15], [24, 21], [31, 17], [36, 20], [18, 18], [52, 5], [7, 16], [22, 33]]) {
      const base = gridToWorld(col, row, 0);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.08, .13, .65, 8), trunkMat);
      trunk.position.copy(base.clone().add(new THREE.Vector3(0, .32, 0)));
      trunk.castShadow = true;
      scene.add(trunk);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(.45, 12, 10), leafMat);
      crown.position.copy(base.clone().add(new THREE.Vector3(0, .88, 0)));
      crown.castShadow = true;
      scene.add(crown);
    }
  }

  function updateCharacter(c) {
    const group = charGroups.get(c.id);
    if (!group) return;
    const p = gridToWorld(c.gridCol, c.gridRow, 0);
    group.position.copy(p);
    const ring = group.getObjectByName('selection-ring');
    if (ring) {
      ring.material.color.set(c.id === selectedId ? 0xf4d27a : 0x6c7568);
      ring.visible = c.id === selectedId || c.action || c.actionQueue?.length;
    }
    const label = charLabels.get(c.id);
    if (label) label.position.copy(p.clone().add(new THREE.Vector3(0, 2.05, 0)));
    const bubble = bubbleLabels.get(c.id);
    if (bubble) {
      const text = c.statusText && c.statusText !== '闲庭漫步' ? c.statusText : '';
      bubble.visible = !!text;
      if (text) {
        setLabel(bubble, text.slice(0, 12), { size: 17, width: Math.min(5.2, Math.max(2.4, text.length * .38)), height: .9, bg: 'rgba(245,238,219,.88)', border: 'rgba(83,62,44,.65)', color: '#34271d' });
        bubble.position.copy(p.clone().add(new THREE.Vector3(0, 2.92, 0)));
      }
    }
  }

  function updateLinks(chars) {
    linkGroup.clear();
    for (const c of chars) {
      const target = c.action?.type === 'interaction' ? c.action.target : (c._autoSocialIntent ? chars.find(x => x.id === c._autoSocialIntent.targetId) : null);
      if (!target) continue;
      const a = gridToWorld(c.gridCol, c.gridRow, 1.15);
      const b = gridToWorld(target.gridCol, target.gridRow, 1.15);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), mats.link);
      linkGroup.add(line);
    }
  }

  function handlePointerClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hitObj = raycaster.intersectObjects(clickables, true)[0]?.object;
    if (hitObj) {
      let root = hitObj;
      while (root.parent && !root.userData?.type) root = root.parent;
      if (root.userData?.type === 'character') { onCharClick?.(root.userData.id, event); return; }
      if (root.userData?.type === 'furniture') { onFurnitureClick?.(root.userData.instanceId, event); return; }
    }
    const hitGround = raycaster.intersectObjects(groundPickMeshes, false)[0];
    if (hitGround) {
      const g = worldToGrid(hitGround.point);
      onGroundClick?.(g, event);
    }
  }

  config.scenes.forEach(addScene);
  addConnections();
  addGardenDetails();
  config.furnitureInstances.forEach(addFurniture);
  getChars().forEach(addCharacter);
  renderer.domElement.addEventListener('click', handlePointerClick);

  function setCamera(pos, target = new THREE.Vector3(0, 0, 0)) {
    camera.position.copy(pos);
    controls.target.copy(target);
    controls.update();
  }

  function focusScene(sceneId) {
    const sc = config.scenes.find(s => s.id === sceneId) || config.scenes[0];
    const x = sc.originCol + sc.cols / 2 - worldCenter.x;
    const z = sc.originRow + sc.rows / 2 - worldCenter.z;
    setCamera(new THREE.Vector3(x + 7, 18, z + 13), new THREE.Vector3(x, 0, z));
  }

  function update(dt, selectedCharId) {
    selectedId = selectedCharId || selectedId;
    const chars = getChars();
    chars.forEach(updateCharacter);
    updateLinks(chars);
    if (followSelected && selectedId) {
      const c = chars.find(ch => ch.id === selectedId);
      if (c) {
        const p = gridToWorld(c.gridCol, c.gridRow, 0);
        controls.target.lerp(p, Math.min(1, dt * 2.5));
      }
    }
  }

  function render() {
    controls.update();
    renderer.render(scene, camera);
  }

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', resize);

  return {
    update, render, focusScene,
    setTop: () => setCamera(new THREE.Vector3(0, 78, .1)),
    setTilt: () => setCamera(new THREE.Vector3(18, 48, 52)),
    setFollow: value => { followSelected = !!value; },
    dispose: () => {
      window.removeEventListener('resize', resize);
      renderer.domElement.removeEventListener('click', handlePointerClick);
      renderer.dispose();
    },
  };
}
