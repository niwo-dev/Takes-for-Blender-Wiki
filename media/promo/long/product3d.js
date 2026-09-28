// Procedural 3D product (a watch) + studio lighting for the promo. Pure geometry, no image textures.
import * as THREE from './vendor/three.module.min.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

export { THREE };

export const VARIANTS = {
  gold:   { name: 'Gold',        caseC: '#d9a54e', caseR: .20, caseM: 1,  dial: '#121216', dialR: .38, index: '#e8c47a', strap: '#6e4526', strapR: .58, accent: '#e87d0d', hand: '#f1dfb4',
            mats: ['Brushed Gold', 'Tan Leather', 'Onyx'] },
  silver: { name: 'Silver',      caseC: '#d5dbe4', caseR: .13, caseM: 1,  dial: '#e8ecf1', dialR: .42, index: '#23272f', strap: '#2b3d62', strapR: .62, accent: '#3a7bc8', hand: '#1d2230',
            mats: ['Polished Steel', 'Navy Leather', 'Pearl'] },
  black:  { name: 'Matte Black', caseC: '#2b2b30', caseR: .52, caseM: .7, dial: '#0c0c0f', dialR: .5,  index: '#dfe3ea', strap: '#17171a', strapR: .82, accent: '#f5a623', hand: '#e6e9ef',
            mats: ['Black Anodized', 'Rubber', 'Carbon'] },
};
export const VARIANT_KEYS = ['gold', 'silver', 'black'];

// Studio environment: dark room, soft top box, brand-coloured strip lights for reflections.
function studioEnv(renderer, warm = '#f5a623', cool = '#3a7bc8') {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#050507');
  const box = (w, h, d, x, y, z, color, intensity) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) }));
    m.position.set(x, y, z); scene.add(m); return m;
  };
  box(14, .3, 8, 0, 9, 0, '#ffffff', 3.2);        // top softbox
  box(.3, 10, 3, -10, 1, 2, warm, 4.5);           // warm strip left
  box(.3, 10, 3, 10, 1, -1, cool, 5.0);           // cool strip right
  box(8, 5, .3, 0, 2, 10, '#ffffff', 1.2);        // front fill
  box(6, .3, 6, 0, -8, 0, '#223044', 1.0);        // floor bounce
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(scene, 0.02);
  pmrem.dispose();
  return rt.texture;
}

function bentStrap(width, thick, length, R, dir, mat) {
  const g = new THREE.BoxGeometry(width, thick, length, 1, 1, 48);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), yl = p.getY(i), s = p.getZ(i) + length / 2; // s: 0..L along the strap
    const th = s / R;
    const z = (R + yl) * Math.sin(th), y = -R + (R + yl) * Math.cos(th);
    p.setXYZ(i, x, y, dir * z);
  }
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

// ---- procedural textures (drawn once, shared by every watch) ----
let _tex = null;
function textures() {
  if (_tex) return _tex;
  const mk = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const dial = mk(1024, 1024, (g, w) => {
    const cx = w / 2;
    const gr = g.createRadialGradient(cx * .8, cx * .7, 20, cx, cx, cx); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.6, '#e9e9e9'); gr.addColorStop(1, '#cfcfcf');
    g.fillStyle = gr; g.fillRect(0, 0, w, w);
    g.translate(cx, cx);
    for (let k = 0; k < 720; k++) { g.rotate(Math.PI * 2 / 720); g.strokeStyle = `rgba(${k % 2 ? 255 : 0},${k % 2 ? 255 : 0},${k % 2 ? 255 : 0},.05)`; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, 40); g.lineTo(0, cx); g.stroke(); }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 6; g.beginPath(); g.arc(cx, cx, cx * .93, 0, Math.PI * 2); g.stroke();
  });
  const text = mk(512, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.textAlign = 'center';
    g.font = '800 92px Outfit, sans-serif'; g.fillText('TAKES', w / 2, 118);
    g.font = '500 34px "JetBrains Mono", monospace'; g.fillText('FOR BLENDER', w / 2, 184);
  });
  const strap = mk(256, 1024, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    const r = (a => () => (a = (a * 16807) % 2147483647) / 2147483647)(7);
    for (let k = 0; k < 9000; k++) { const v = 200 + r() * 55; g.fillStyle = `rgba(${v},${v},${v},.35)`; g.fillRect(r() * w, r() * h, 2, 2); }
    for (const x of [w * .1, w * .9]) for (let y = 6; y < h; y += 22) {
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x - 2, y, 4, 4); g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(x - 1.5, y + 5, 3, 12);
    }
  });
  strap.wrapS = strap.wrapT = THREE.RepeatWrapping;
  return (_tex = { dial, text, strap });
}

export function createWatch() {
  const g = new THREE.Group();
  const M = {
    case: new THREE.MeshStandardMaterial({ metalness: 1, roughness: .2 }),
    dial: new THREE.MeshStandardMaterial({ metalness: .2, roughness: .4, map: textures().dial }),
    text: new THREE.MeshStandardMaterial({ metalness: .6, roughness: .35, map: textures().text, transparent: true, depthWrite: false }),
    index: new THREE.MeshStandardMaterial({ metalness: .9, roughness: .25 }),
    hand: new THREE.MeshStandardMaterial({ metalness: .8, roughness: .3 }),
    accent: new THREE.MeshStandardMaterial({ metalness: .3, roughness: .35 }),
    strap: new THREE.MeshStandardMaterial({ metalness: 0, roughness: .6, map: textures().strap }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0, transparent: true, opacity: .12, envMapIntensity: 2.5, clearcoat: 1 }),
  };
  // case: lathe profile revolved around Y, dial faces +Y
  const prof = [[0, -.32], [1.55, -.32], [1.9, -.28], [2.06, -.14], [2.1, .02], [2.04, .18], [1.93, .3], [1.78, .34], [1.74, .26], [1.72, .2]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const caseMesh = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), M.case);
  g.add(caseMesh);
  const dial = new THREE.Mesh(new THREE.CircleGeometry(1.73, 96), M.dial); dial.rotation.x = -Math.PI / 2; dial.position.y = .2; g.add(dial);
  // indices
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * Math.PI * 2, big = k % 3 === 0;
    const m = new THREE.Mesh(new THREE.BoxGeometry(big ? .11 : .06, .04, big ? .36 : .22), M.index);
    const r = big ? 1.42 : 1.48;
    m.position.set(Math.sin(a) * r, .225, -Math.cos(a) * r); m.rotation.y = -a; g.add(m);
  }
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(.9, .45), M.text); logo.rotation.x = -Math.PI / 2; logo.position.set(0, .208, -.72); g.add(logo);
  // minute track ring
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.62, 1.64, 96), M.index); ring.rotation.x = -Math.PI / 2; ring.position.y = .205; g.add(ring);
  const mkHand = (w, l, y, mat, tail = .2) => {
    const pivot = new THREE.Group(); pivot.position.y = y;
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, .03, l + tail, 2, Math.min(w, .03) / 2.2), mat);
    m.position.z = -(l - tail) / 2; pivot.add(m); g.add(pivot); return pivot;
  };
  const hh = mkHand(.12, .95, .25, M.hand), mh = mkHand(.08, 1.35, .28, M.hand), sh = mkHand(.03, 1.5, .31, M.accent, .4);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .06, 32), M.accent); cap.position.y = .32; g.add(cap);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(1.76, 96), M.glass); glass.rotation.x = -Math.PI / 2; glass.position.y = .345; g.add(glass);
  // crown
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .34, 32), M.case); crown.rotation.z = Math.PI / 2; crown.position.set(2.22, 0, 0); g.add(crown);
  const crownCap = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .36, 24), M.index); crownCap.rotation.z = Math.PI / 2; crownCap.position.set(2.24, 0, 0); g.add(crownCap);
  // lugs
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const lug = new THREE.Mesh(new RoundedBoxGeometry(.32, .36, 1.0, 3, .1), M.case);
    lug.position.set(sx * .78, -.06, sz * 1.95); g.add(lug);
  }
  // straps bending back around the wrist
  const s1 = bentStrap(1.34, .2, 5.2, 3.0, 1, M.strap); s1.position.set(0, -.08, 2.2); g.add(s1);
  const s2 = bentStrap(1.34, .2, 5.2, 3.0, -1, M.strap); s2.position.set(0, -.08, -2.2); g.add(s2);
  // keep proportions friendly for camera work
  g.userData = { M, hh, mh, sh };
  return g;
}

const _c1 = new THREE.Color(), _c2 = new THREE.Color();
function lerpColor(mat, a, b, k) { mat.color.copy(_c1.set(a)).lerp(_c2.set(b), k); }

export function paintWatch(w, a, b, k = 0) {
  const A = VARIANTS[a], B = VARIANTS[b || a], M = w.userData.M, L = (x, y) => x + (y - x) * k;
  lerpColor(M.case, A.caseC, B.caseC, k); M.case.roughness = L(A.caseR, B.caseR); M.case.metalness = L(A.caseM, B.caseM);
  lerpColor(M.dial, A.dial, B.dial, k); M.dial.roughness = L(A.dialR, B.dialR);
  lerpColor(M.index, A.index, B.index, k);
  lerpColor(M.text, A.index, B.index, k);
  lerpColor(M.hand, A.hand, B.hand, k);
  lerpColor(M.accent, A.accent, B.accent, k);
  lerpColor(M.strap, A.strap, B.strap, k); M.strap.roughness = L(A.strapR, B.strapR);
}

// emissive pulse on one part ('case' | 'strap' | 'dial' | 'index' | 'hand' | 'accent')
export function glowPart(w, part, k, color = '#6aa6ea') {
  const m = w.userData.M[part]; if (!m) return;
  m.emissive.set(color); m.emissiveIntensity = k * .16;
}

export function setTime(w, seconds) {
  const { hh, mh, sh } = w.userData;
  const h = 10 + seconds / 3600 * 60, m = 8 + seconds / 60 * 12;     // sped-up clock for motion
  hh.rotation.y = -(h / 12) * Math.PI * 2;
  mh.rotation.y = -(m / 60) * Math.PI * 2;
  sh.rotation.y = -((seconds * 2) % 60) / 60 * Math.PI * 2;
}

// Renderer + studio scene factory used by the engine's R3D bridge.
export function makeRenderer(w, h) {
  const canvas = document.createElement('canvas');
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  r.setPixelRatio(1); r.setSize(w, h, false);
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.userData = { env: studioEnv(r) };
  return r;
}
export function makeStudioScene(r, o = {}) {
  const scene = new THREE.Scene();
  scene.environment = r.userData.env;
  if ('envIntensity' in o) scene.environmentIntensity = o.envIntensity;
  const key = new THREE.DirectionalLight('#ffffff', o.key ?? 1.4); key.position.set(-4, 8, 6); scene.add(key);
  const rimW = new THREE.PointLight('#f5a623', o.warm ?? 30, 30); rimW.position.set(-6, 2, -4); scene.add(rimW);
  const rimC = new THREE.PointLight('#3a7bc8', o.cool ?? 36, 30); rimC.position.set(6, 1, -3); scene.add(rimC);
  scene.userData.lights = { key, rimW, rimC };
  return scene;
}
