import * as THREE from "./vendor/three.module.js";
// 写真の外形を参考にした部品別の簡易モデル。寸法は実測値ではありません。
export function mountViewer({ canvas, stage, journey, onProgress = () => {} }) {
  const controller = new AbortController();
  const listen = (target, event, fn) =>
    target.addEventListener(event, fn, { signal: controller.signal });
  let stopped = false,
    raf = 0;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
  } catch (e) {
    throw new Error("WebGL을 지원하는 브라우저에서 3D 화면을 열어 주세요.", {
      cause: e,
    });
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
  camera.position.set(0, 1.1, 15);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x71838b, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.8);
  key.position.set(-5, 8, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -10;
  key.shadow.camera.right = 10;
  key.shadow.camera.top = 10;
  key.shadow.camera.bottom = -10;
  key.shadow.normalBias = 0.04;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd2e9ff, 2);
  fill.position.set(6, 3, -5);
  scene.add(fill);
  const root = new THREE.Group();
  root.rotation.set(0.08, -0.55, 0);
  scene.add(root);
  const white = new THREE.MeshStandardMaterial({
      color: 0xededeb,
      metalness: 0.2,
      roughness: 0.34,
    }),
    silver = new THREE.MeshStandardMaterial({
      color: 0xa3adb0,
      metalness: 0.65,
      roughness: 0.32,
    }),
    dark = new THREE.MeshStandardMaterial({
      color: 0x27343a,
      metalness: 0.2,
      roughness: 0.6,
    }),
    inside = new THREE.MeshStandardMaterial({
      color: 0xd2d9d8,
      metalness: 0.25,
      roughness: 0.55,
    }),
    teal = new THREE.MeshStandardMaterial({
      color: 0x006a7a,
      metalness: 0.3,
      roughness: 0.4,
    }),
    glass = new THREE.MeshPhysicalMaterial({
      color: 0x9eafb3,
      transparent: true,
      opacity: 0.32,
      metalness: 0.1,
      roughness: 0.15,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  function box(w, h, d, mat = white, r = 0.07) {
    r = Math.min(r, w / 3, h / 3, d / 3);
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: d - 2 * r,
      bevelEnabled: true,
      bevelSize: r,
      bevelThickness: r,
      bevelSegments: 3,
      steps: 1,
      curveSegments: 8,
    });
    g.translate(0, 0, -d / 2 + r);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
  function add(g, w, h, d, x, y, z, mat, r) {
    const m = box(w, h, d, mat, r);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  }
  const parts = [];
  function part(name, pos, delta) {
    const g = new THREE.Group();
    g.position.fromArray(pos);
    root.add(g);
    parts.push({
      name,
      g,
      base: new THREE.Vector3(...pos),
      delta: new THREE.Vector3(...delta),
    });
    return g;
  }
  // 中央フレーム: 奥が透けないよう内部背面・床・天井を別々に置く。
  const body = part("본체 프레임", [0, 0, 0], [0, 0, 0]);
  add(body, 3.35, 0.16, 2.25, 0, -1.35, 0, inside);
  add(body, 3.35, 0.14, 2.25, 0, 1.43, 0, white);
  add(body, 2.98, 2.58, 0.09, 0, 0, -1.02, inside);
  add(body, 0.1, 2.64, 2.2, -1.62, 0, 0, inside);
  add(body, 0.1, 2.64, 2.2, 1.62, 0, 0, inside);
  for (const x of [-1.38, 1.38])
    add(body, 0.36, 0.23, 0.46, x, -1.57, 0.5, dark);
  const top = part("디스플레이 / 버튼", [0, 1.2, 1.18], [0, 1.05, 0.15]);
  add(top, 3.2, 0.43, 0.22, 0, 0, 0, white);
  add(top, 1.25, 0.18, 0.025, 0.2, 0, 0.125, dark, 0.02);
  for (let i = 0; i < 4; i++)
    add(top, 0.09, 0.06, 0.02, -0.23 + i * 0.24, 0, 0.147, teal, 0.01);
  const door = part("전면 도어", [0, -0.02, 1.25], [0, 0.15, 2.35]);
  add(door, 3.22, 0.16, 0.16, 0, 1.01, 0);
  add(door, 3.22, 0.16, 0.16, 0, -1.01, 0);
  add(door, 0.16, 2.0, 0.16, -1.53, 0, 0);
  add(door, 0.16, 2.0, 0.16, 1.53, 0, 0);
  add(door, 2.91, 1.83, 0.04, 0, 0, 0, glass, 0.01);
  add(door, 2.18, 0.075, 0.1, 0, -0.84, 0.14, silver, 0.02);
  const tank = part("저수조", [0, -1.24, 1.23], [0, -0.65, 1.85]);
  add(tank, 3.16, 0.36, 0.45, 0, 0, 0);
  add(tank, 1.04, 0.055, 0.03, 0, 0, 0.25, silver, 0.01);
  const base = part("포트 베이스", [0, -1.13, 0.25], [0, -1.3, 0.45]);
  add(base, 2.76, 0.12, 1.3, 0, 0, 0, inside);
  for (const x of [-0.72, 0.72]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.045, 12, 48),
      silver,
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.09, 0);
    base.add(ring);
  }
  const back = part("뒷면 커버", [0, 0, -1.2], [0, 0.15, -2.05]);
  add(back, 3.3, 2.94, 0.2, 0, 0, 0);
  add(back, 2.36, 1.96, 0.2, 0, -0.14, -0.19, white);
  const filter = part("먼지 필터", [0, -0.04, -1.58], [0, 0.1, -3.05]);
  add(filter, 1.05, 1.03, 0.12, 0, 0, 0, inside);
  for (const x of [-0.49, 0.49])
    add(filter, 0.07, 1.02, 0.08, x, 0, -0.08, white);
  for (let i = 0; i < 17; i++)
    add(filter, 0.86, 0.021, 0.06, 0, -0.43 + i * 0.054, -0.08, silver, 0.006);
  add(filter, 0.06, 0.94, 0.08, 0, 0, -0.1, white, 0.01);
  for (const side of [-1, 1]) {
    const panel = part(
      side < 0 ? "왼쪽 패널" : "오른쪽 패널 / 환풍구",
      [side * 1.76, 0, 0],
      [side * 1.75, 0, 0],
    );
    add(panel, 0.2, 2.96, 2.34, 0, 0, 0, white);
    for (let row = 0; row < 30; row++) {
      for (let col = 0; col < 8; col++) {
        add(
          panel,
          0.035,
          0.025,
          0.14,
          side * 0.12,
          -1.12 + row * 0.067,
          -0.84 + col * 0.245,
          dark,
          0.005,
        );
      }
    }
    const handle = part(
      side < 0 ? "왼쪽 손잡이" : "손잡이",
      [side * 1.88, 1.12, -0.03],
      [side * 2.35, 0.42, 0],
    );
    add(handle, 0.09, 0.27, 0.72, 0, 0, 0, dark);
    add(handle, 0.05, 0.1, 0.58, side * 0.04, 0.07, 0, silver, 0.02);
  }
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.ShadowMaterial({ opacity: 0.12 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -3;
  floor.receiveShadow = true;
  scene.add(floor);
  let amount = 0,
    targetAmount = 0,
    zoom = 15,
    drag = false,
    lastX = 0,
    lastY = 0,
    angleX = 0.08,
    angleY = -0.55;
  // Keep the supplied model driven by the host page's scroll rather than an iframe.
  function updateScroll() {
    const rect = journey.getBoundingClientRect();
    targetAmount = THREE.MathUtils.clamp(
      -rect.top / Math.max(1, rect.height - innerHeight),
      0,
      1,
    );
    onProgress(targetAmount);
  }
  listen(window, "scroll", updateScroll);
  listen(window, "resize", updateScroll);
  updateScroll();
  listen(canvas, "pointerdown", (e) => {
    drag = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("dragging");
  });
  listen(canvas, "pointermove", (e) => {
    if (!drag) return;
    angleY += (e.clientX - lastX) * 0.008;
    angleX = Math.max(
      -0.6,
      Math.min(0.65, angleX + (e.clientY - lastY) * 0.004),
    );
    lastX = e.clientX;
    lastY = e.clientY;
    root.rotation.set(angleX, angleY, 0);
  });
  function release() {
    drag = false;
    canvas.classList.remove("dragging");
  }
  listen(canvas, "pointerup", release);
  listen(canvas, "pointercancel", release);
  listen(canvas, "keydown", (e) => {
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "+",
        "-",
        "=",
      ].includes(e.key)
    ) {
      e.preventDefault();
      if (e.key === "ArrowLeft") angleY -= 0.15;
      if (e.key === "ArrowRight") angleY += 0.15;
      if (e.key === "ArrowUp") angleX -= 0.1;
      if (e.key === "ArrowDown") angleX += 0.1;
      if (e.key === "+" || e.key === "=") zoom = Math.max(10, zoom - 1);
      if (e.key === "-") zoom = Math.min(24, zoom + 1);
      angleX = THREE.MathUtils.clamp(angleX, -0.6, 0.65);
      root.rotation.set(angleX, angleY, 0);
      resize();
    }
  });
  function resize() {
    const w = stage.clientWidth,
      h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 600 ? zoom * 1.5 : zoom;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();
  let last = performance.now();
  function frame(now) {
    if (stopped) return;
    raf = requestAnimationFrame(frame);
    const rect = stage.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) {
      last = now;
      return;
    }
    const dt = Math.min(0.06, (now - last) / 1000);
    last = now;
    amount += (targetAmount - amount) * (1 - Math.exp(-dt * 7));
    if (Math.abs(targetAmount - amount) < 0.0001) amount = targetAmount;
    const delayed = THREE.MathUtils.clamp((amount - 0.03) / (1 - 0.03), 0, 1);
    for (const p of parts) {
      p.g.position.copy(p.base).addScaledVector(p.delta, delayed);
    }
    camera.position.z =
      stage.clientWidth < 600
        ? zoom * (1.5 + delayed * 0.65)
        : zoom * (1 + delayed * 0.15);
    renderer.render(scene, camera);
    canvas.dataset.progress = amount.toFixed(3);
    canvas.dataset.rotation = `${angleX.toFixed(3)},${angleY.toFixed(3)}`;
    canvas.dataset.ready = "true";
  }
  raf = requestAnimationFrame(frame);
  return {
    setProgress(value) {
      targetAmount = THREE.MathUtils.clamp(value, 0, 1);
      onProgress(targetAmount);
    },
    setView(view) {
      angleX = 0.08;
      angleY =
        { front: 0, back: Math.PI, side: -Math.PI / 2, all: -0.55 }[view] ??
        -0.55;
      root.rotation.set(angleX, angleY, 0);
    },
    reset() {
      targetAmount = 0;
      angleX = 0.08;
      angleY = -0.55;
      zoom = 15;
      root.rotation.set(angleX, angleY, 0);
      onProgress(0);
      resize();
    },
    dispose() {
      stopped = true;
      cancelAnimationFrame(raf);
      controller.abort();
      resizeObserver.disconnect();
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material)
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            materials.add(m),
          );
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
