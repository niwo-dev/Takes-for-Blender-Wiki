// Diff State: a view helper that colours every object in the viewport by where its value comes from:
// this take (blue), a parent tier (pink), the rest pose (teal) or drift (orange, live value no longer matches).
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, headline, Cursor, pop } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';
import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';

const ST = {
  take: { c: '#3a7bc8', name: 'Take State' },
  parent: { c: '#e0569a', name: 'Parent State' },
  rest: { c: '#2fc4b2', name: 'Rest State' },
  drift: { c: '#f5a623', name: 'Drift State' },
};
const ORDER = ['take', 'parent', 'rest', 'drift'];
const VP = { x: 120, y: 348, w: 1680, h: 548, head: 46 };     // viewport panel (stage px)
const CW = VP.w - 2, CH = VP.h - VP.head - 2;                  // 3D canvas inside it
const MR = { x: 1296, y: 212, w: 504, h: 78 };                 // mode row strip
const DRIFT_DX = 1.25;                                          // how far the cone is nudged (world units)

// faint floor grid that fades with distance (additive vertex colours, so black = invisible)
function makeGrid(half = 22, fadeR = 14) {
  const pos = [], col = [];
  const f = (x, z) => { const d = Math.hypot(x - .6, z); return Math.pow(clamp(1 - d / fadeR), 1.6); };
  for (let i = -half; i <= half; i++) {
    const major = i % 5 === 0, b = major ? .5 : .26;
    for (let s = -half; s < half; s += .5) {
      for (const [x1, z1, x2, z2] of [[i, s, i, s + .5], [s, i, s + .5, i]]) {
        pos.push(x1, 0, z1, x2, 0, z2);
        const a = f(x1, z1) * b, c = f(x2, z2) * b;
        col.push(.23 * a, .45 * a, .78 * a, .23 * c, .45 * c, .78 * c);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
}
// thick wireframe box (12 thin bars) + faint additive fill: the Box mark
function boxMark(size, color) {
  const g = new THREE.Group(), [sx, sy, sz] = size, t = .03;
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
  const bar = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); g.add(m); };
  for (const y of [-sy / 2, sy / 2]) for (const z of [-sz / 2, sz / 2]) bar(sx + t, t, t, 0, y, z);
  for (const x of [-sx / 2, sx / 2]) for (const z of [-sz / 2, sz / 2]) bar(t, sy + t, t, x, 0, z);
  for (const x of [-sx / 2, sx / 2]) for (const y of [-sy / 2, sy / 2]) bar(t, t, sz + t, x, y, 0);
  const fillMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), fillMat));
  return { g, mat, fillMat };
}
function shadowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.6)'); gr.addColorStop(.55, 'rgba(0,0,0,.28)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t;
}

defineScene({
  id: 's10_diff',
  transitionIn: 'iris',
  camera: { zoom: .025 },
  mood: { a: '#3a7bc8', b: '#e0569a', grid: .18, part: .45, ax: .2, ay: .3, bx: .82, by: .8, glow: .9 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const tClick = L(0) + 1.5;                                  // headline is read first, then Diff State goes on
    const tPill = ORDER.map((_, k) => L(1) + k * .7);           // legend lights as the narrator names each state
    const tDrift = tPill[3];
    const tPress = tDrift - .32, tRelease = tDrift + .28;

    // ---------- headline (own zone, top-left) ----------
    const H = headline(root, { x: 120, y: 124, w: 1000, lines: ['SEE WHERE', { t: 'IT COMES FROM.', grad: true }], size: 82 });

    // ---------- mode row (top-right): icon buttons + the Diff State button ----------
    const mr = el(`<div class="glass abs" style="left:${MR.x}px;top:${MR.y}px;width:${MR.w}px;height:${MR.h}px;display:flex;align-items:center;gap:10px;padding:0 11px"></div>`);
    for (const ic of ['still', 'lock', 'live', 'timeline']) mr.appendChild(el(`<div style="width:56px;height:56px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center">${icon(ic, 26, '#7d8699')}</div>`));
    const dBtn = el(`<div style="margin-left:6px;height:56px;padding:0 14px 0 18px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.16);display:flex;align-items:center;gap:12px">
      <span class="disp6" style="font-size:24px;white-space:nowrap;color:#c9d1de">Diff State</span><span class="dico">${icon('diff', 28, '#c9d1de')}</span></div>`);
    mr.appendChild(dBtn); root.appendChild(mr);
    const dLbl = dBtn.querySelector('span'), dIco = dBtn.querySelector('.dico svg');

    // ---------- viewport panel ----------
    const vp = el(`<div class="glass abs" style="left:${VP.x}px;top:${VP.y}px;width:${VP.w}px;height:${VP.h}px;overflow:hidden;background:linear-gradient(180deg,rgba(20,24,34,.92),rgba(11,12,17,.94))">
      <div class="abs" style="left:0;right:0;top:0;height:${VP.head}px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px;padding:0 18px">
        ${icon('cube', 20, '#9aa3b5')}<span class="disp6" style="font-size:20px;color:#c9d1de">Viewport</span>
        <div style="margin-left:auto;display:flex;gap:7px"><i style="width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.14)"></i><i style="width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.14)"></i><i style="width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.14)"></i></div></div>
      <div class="abs vb" style="left:0;top:${VP.head}px;width:${CW}px;height:${CH}px"></div></div>`);
    root.appendChild(vp);
    const vb = vp.querySelector('.vb');
    const horizon = el(`<div class="abs" style="left:0;right:0;top:0;height:${CH}px;background:radial-gradient(ellipse 60% 55% at 50% 38%,rgba(58,123,200,.16),transparent 70%)"></div>`);
    vb.appendChild(horizon);
    const cv = document.createElement('canvas'); cv.width = CW; cv.height = CH;
    cv.style.cssText = `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px`; vb.appendChild(cv);

    // ---------- 3D scene ----------
    const scene = R3D.scene({ key: 1.6, warm: 22, cool: 26 });
    scene.add(makeGrid());
    const clay = c => new THREE.MeshStandardMaterial({ color: c, roughness: .55, metalness: .05 });
    const shT = shadowTex();
    const shadow = (x, z, r) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: shT, transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(x, .005, z); scene.add(m); return m; };

    const objs = [];
    const add = (mesh, state, mats) => { scene.add(mesh); objs.push({ mesh, state, mats }); return mesh; };
    // pedestal with the watch standing above it (the product is what this take keys)
    const pedMat = clay('#7e8594');
    const ped = add(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.08, .56, 64), pedMat), 'rest', [pedMat]); ped.position.set(-.9, .28, -.3);
    const watch = createWatch(); paintWatch(watch, 'gold'); watch.scale.setScalar(.265); watch.rotation.x = Math.PI / 2;
    const wg = new THREE.Group(); wg.add(watch); wg.position.set(-.9, 2.2, -.3); wg.rotation.y = .5;
    const WM = watch.userData.M; add(wg, 'take', [WM.case, WM.strap, WM.dial]);
    // props
    const sphMat = clay('#8b92a1'), boxMat = clay('#858c9b'), coneMat = clay('#8e95a3');
    const sph = add(new THREE.Mesh(new THREE.SphereGeometry(.95, 48, 32), sphMat), 'parent', [sphMat]); sph.position.set(-4.3, .95, .6);
    const box = add(new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.5, 1.5, 4, .1), boxMat), 'parent', [boxMat]); box.position.set(2.1, .75, .5); box.rotation.y = .55;
    const cone = add(new THREE.Mesh(new THREE.ConeGeometry(.8, 1.9, 48), coneMat), 'rest', [coneMat]); cone.position.set(4.7, .95, -.3);
    const CONE_X = cone.position.x;
    shadow(-.9, -.3, 1.7); shadow(-4.3, .6, 1.45); shadow(2.1, .5, 1.65);
    const coneShadow = shadow(CONE_X, -.3, 1.35);

    // Box marks from each object's bounds (computed once; objects are static except the nudged cone)
    const tmp = new THREE.Box3(), cen = new THREE.Vector3(), size = new THREE.Vector3();
    objs.forEach(o => {
      o.mesh.updateMatrixWorld(true);
      tmp.setFromObject(o.mesh); tmp.getCenter(cen); tmp.getSize(size);
      const m = boxMark([size.x * 1.08 + .08, size.y * 1.06 + .08, size.z * 1.08 + .08], ST[o.state].c);
      m.g.position.copy(cen); scene.add(m.g); o.mark = m; o.center = cen.clone();
    });
    const coneO = objs[objs.length - 1];
    // drift: an orange mark that follows the nudged cone; the teal one stays where the value should be
    tmp.setFromObject(cone); tmp.getSize(size);
    const dMark = boxMark([size.x * 1.08 + .08, size.y * 1.06 + .08, size.z * 1.08 + .08], ST.drift.c);
    scene.add(dMark.g);
    const trailMat = new THREE.MeshBasicMaterial({ color: ST.drift.c, transparent: true, opacity: 0, depthWrite: false });
    const trail = new THREE.Mesh(new THREE.BoxGeometry(1, .025, .025), trailMat); scene.add(trail);

    const cam = R3D.camera(24);
    const camAt = t => {
      const a = -.26 + t * .04, r = 11.6 - t * .06;
      cam.position.set(.6 + Math.sin(a) * r, 4.2, Math.cos(a) * r);
      cam.lookAt(.6, 1.42, 0);
      cam.aspect = CW / CH; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    };
    const v3 = new THREE.Vector3();
    const toStage = (p, t) => { camAt(t); v3.copy(p).project(cam); return [VP.x + 1 + (v3.x + 1) / 2 * CW, VP.y + VP.head + 1 + (1 - v3.y) / 2 * CH]; };
    const coneTop = x => new THREE.Vector3(x, 1.2, -.3);
    const dragX = t => CONE_X + DRIFT_DX * ease.inOut(prog(t, tPress + .02, tRelease - tPress - .02));

    // ---------- legend row ----------
    const LG_W = 240, LG_G = 26, LG_X = 960 - (4 * LG_W + 3 * LG_G) / 2, LG_Y = 916;
    const pills = ORDER.map((k, i) => {
      const c = ST[k].c;
      const p = el(`<div class="abs" style="left:${LG_X + i * (LG_W + LG_G)}px;top:${LG_Y}px;width:${LG_W}px;height:56px;border-radius:10px;border:2px solid ${c};background:rgba(10,10,14,.72);display:flex;align-items:center;justify-content:center;gap:12px;opacity:0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.4"><rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><rect x="3.5" y="3.5" width="17" height="17" rx="1.5" fill="${c}" fill-opacity=".22" stroke="none"/></svg>
        <span class="disp6" style="font-size:24px;white-space:nowrap;color:#eef1f6">${ST[k].name}</span></div>`);
      root.appendChild(p); return p;
    });

    // ---------- cursor: click Diff State, later nudge the cone by hand ----------
    const btnR = { x: MR.x + MR.w - 11 - 0, y: MR.y + 11 };             // Diff State button's right edge / top
    const icoX = btnR.x - 14 - 14, icoY = btnR.y + 28;                  // tip on the icon (arrow falls outside the label)
    const path = [{ t: tClick - 1.1, x: 1560, y: 520 }, { t: tClick, x: icoX, y: icoY, click: true }, { t: tClick + .9, x: 1640, y: 470 }];
    const [gx0, gy0] = toStage(coneTop(CONE_X), tPress - .55);
    path.push({ t: tPress - .55, x: gx0 + 40, y: gy0 - 60 });
    for (let k = 0; k <= 6; k++) {
      const t = lerp(tPress, tRelease, k / 6), [sx, sy] = toStage(coneTop(dragX(t)), t);
      path.push({ t, x: sx, y: sy, click: k === 0 });
    }
    path.push({ t: tRelease + .9, x: 1840, y: 1060 });
    const cursor = new Cursor(root, ctx, path, { hideAt: tRelease + .6 });

    // ---------- sound ----------
    ctx.cue(tClick + .1, 'sparkle', { gain: .8, pan: .1 });
    ctx.cue(tClick + .35, 'shimmer', { gain: .4, pan: -.1 });
    tPill.forEach((t, k) => ctx.cue(t, k < 3 ? 'tick' : 'blip', { gain: k < 3 ? .6 : .85, pitch: k * 2, pan: -.45 + k * .3 }));
    ctx.cue(tPress + .05, 'swish', { gain: .45, pan: .6 });

    // a scan beam sweeps the viewport; each mark lands as the beam passes its object
    const tScan = tClick + .08, SCAN = .75;
    const scan = el(`<div class="abs" style="left:0;top:0;width:8px;height:${CH}px;background:linear-gradient(180deg,rgba(58,123,200,0),#6aa6ea 30%,#f5a623 70%,rgba(245,166,35,0));box-shadow:0 0 28px 8px rgba(106,166,234,.45);opacity:0"></div>`);
    vb.appendChild(scan);
    objs.forEach(o => { const [sx] = toStage(o.center, tScan + SCAN / 2); o.tIn = tScan + clamp((sx - VP.x) / CW) * SCAN; });
    const markIn = o => o.tIn;
    const tint = new THREE.Color(), base = new THREE.Color();
    return lt => {
      H.update(lt, -.3);
      const mrk = ease.expo(prog(lt, -.2, .8)); mr.style.opacity = clamp((lt + .3) / .4); mr.style.transform = `translateY(${(1 - mrk) * -30}px)`;
      const vk = ease.expo(prog(lt, -.45, 1.0)); vp.style.opacity = clamp((lt + .45) / .3); vp.style.transform = `scale(${.94 + vk * .06})`;

      // Diff State button
      const on = clamp((lt - tClick) / .15);
      const flash = Math.max(0, 1 - (lt - tClick) / .8) * on;
      dBtn.style.background = on ? `rgba(58,123,200,${.34 + flash * .3})` : 'rgba(255,255,255,.05)';
      dBtn.style.borderColor = on ? '#6aa6ea' : 'rgba(255,255,255,.16)';
      dBtn.style.boxShadow = on ? `0 0 ${14 + flash * 30}px rgba(58,123,200,${.45 + flash * .4})` : 'none';
      dLbl.style.color = on ? '#ffffff' : '#c9d1de'; dIco.style.stroke = on ? '#ffffff' : '#c9d1de';

      const sq = prog(lt, tScan, SCAN);
      scan.style.opacity = sq > 0 && sq < 1 ? Math.min(1, Math.sin(sq * Math.PI) * 2.2) : 0;
      scan.style.transform = `translateX(${sq * CW}px)`;
      // cone nudge (Drift)
      const cx = dragX(lt);
      cone.position.x = cx; coneShadow.position.x = cx;
      const drifted = clamp((lt - tDrift) / .22);

      // marks + tints
      objs.forEach((o, i) => {
        const a = ease.out(prog(lt, markIn(o), .45));
        const kPulse = ORDER.indexOf(o.state), pulse = Math.max(0, 1 - Math.abs(lt - tPill[kPulse] - .25) / .45);
        let op = a * (.85 + pulse * .15);
        if (o === coneO) op *= 1 - drifted * .7;                       // the rest mark stays behind, faint
        o.mark.mat.opacity = op; o.mark.fillMat.opacity = a * (.05 + pulse * .08);
        o.mark.g.scale.setScalar(lerp(1.12, 1, ease.out(prog(lt, markIn(o), .5))) * (1 + pulse * .04));
        const col = o === coneO && drifted > 0 ? tint.set(ST.rest.c).lerp(base.set(ST.drift.c), drifted) : tint.set(ST[o.state].c);
        for (const m of o.mats) { m.emissive.copy(col); m.emissiveIntensity = a * (o.mesh === wg ? .12 : .32) + pulse * .25; }
      });
      const dm = ease.out(prog(lt, tDrift - .05, .3));
      dMark.mat.opacity = dm * .95; dMark.fillMat.opacity = dm * .09;
      dMark.g.position.set(cx, coneO.center.y, coneO.center.z);
      dMark.g.scale.setScalar(1 + Math.max(0, 1 - Math.abs(lt - tDrift - .2) / .35) * .06);
      trailMat.opacity = dm * .7;
      trail.scale.x = Math.max(.001, cx - CONE_X); trail.position.set((cx + CONE_X) / 2, .03, -.3);

      setTime(watch, lt * 4 + 20);
      camAt(lt);
      R3D.draw(cv, scene, cam);

      // legend pills pop in as they are named
      pills.forEach((p, k) => {
        pop(p, lt, tPill[k], .5, .7, 14);
        const g = Math.max(0, 1 - Math.abs(lt - tPill[k] - .2) / .5);
        p.style.boxShadow = `0 0 ${6 + g * 30}px ${ST[ORDER[k]].c}${g > .05 ? '99' : '33'}`;
      });
      cursor.update(lt);
    };
  },
});
