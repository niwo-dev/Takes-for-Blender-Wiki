// s04 — The stage: the product on a turntable. As the narrator lists the camera, the world, the materials,
// the animation and the render settings, each one appears on the stage (wireframe gizmo, world dome, material
// sheen, motion path, render frame) with a labelled node wired to it. Ends on a one-click shot switch that
// changes all five at once.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE, rgba } from '../engine.js';
import { icon, words, revealMasks, gradify, canvas3d, Cursor, float } from '../ui.js';
import { createWatch, paintWatch, setTime, glowPart, VARIANTS } from '../product3d.js';

const BX = 520, BY = 220, BW = 880, BH = 700;         // WebGL view (stage px) — watch + pedestal
const LX = 150, LY = 150, LW = 1620, LH = 840;        // 2D wireframe layers
const TGT = new THREE.Vector3(0, 3.3, 0);             // audience camera target
const WY = 4.75, WS = .74;                            // watch centre height / scale
const DOME = 7.4, ORB = 3.25;                         // world dome radius, motion path radius
const CW = 322, CH = 92;                              // node card size
const GOLD = VARIANTS.gold;

// shot camera (the wireframe gizmo) for the two shots
const SHOT_CAM = [new THREE.Vector3(-5.3, 5.5, 4.6), new THREE.Vector3(-3.0, 3.35, 4.9)];

const NODES = [
  { ic: 'camera', name: 'Camera', v: ['Cam_Front · 50 mm', 'Cam_Close · 100 mm'], x: 120, y: 300, side: 'L' },
  { ic: 'world', name: 'World', v: ['Studio_Soft', 'Sunset_Warm'], x: 1478, y: 268, side: 'R' },
  { ic: 'palette', name: 'Materials', v: ['Brushed Gold', 'Polished Steel'], x: 1478, y: 500, side: 'R' },
  { ic: 'action', name: 'Animation', v: ['Turntable', 'Hands_Sweep'], x: 120, y: 612, side: 'L' },
  { ic: 'sliders', name: 'Render settings', v: ['Cycles · 3840 × 2160', 'Eevee · 1080 × 1080'], x: 1478, y: 740, side: 'R' },
];

defineScene({
  id: 's04_stage',
  transitionIn: 'zoom',
  camera: { zoom: .03 },
  mood: { a: '#265787', b: '#e87d0d', grid: .08, part: .8, glow: 1.15, ax: .5, ay: .38, bx: .5, by: .98 },
  build(root, ctx) {
    const L1 = ctx.line(1);
    // node beats, synced to the words in line 1: camera, world, materials, animation, render settings
    const TN = [L1 + .1, L1 + .84, L1 + 1.56, L1 + 2.28, L1 + 3.36];
    const TSW = 9.2;                                   // shot switch click
    const swK = lt => ease.inOut(prog(lt, TSW + .05, .75));

    /* ---------- layers ---------- */
    const mk = (w, h, x, y) => { const c = document.createElement('canvas'); c.width = w; c.height = h; c.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px`; return c; };
    const bgC = mk(LW, LH, LX, LY); root.appendChild(bgC);
    const beam = el(`<div class="abs" style="left:${960 - 170}px;top:${420}px;width:340px;height:420px;background:radial-gradient(ellipse 50% 60% at 50% 100%,rgba(245,166,35,.22),rgba(58,123,200,.06) 60%,transparent 75%);opacity:0"></div>`);
    root.appendChild(beam);
    const view = canvas3d(root, { x: BX, y: BY, w: BW, h: BH });
    const fgC = mk(LW, LH, LX, LY); root.appendChild(fgC);
    const bg = bgC.getContext('2d'), fg = fgC.getContext('2d');

    /* ---------- 3D: pedestal + watch ---------- */
    const scene = R3D.scene({ key: 1.4, warm: 30, cool: 40 });
    const LI = scene.userData.lights;
    const stage = new THREE.Group(); scene.add(stage);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.42, .5, 96, 1), new THREE.MeshStandardMaterial({ color: '#1a1b22', metalness: .8, roughness: .3 }));
    ped.position.y = .25; stage.add(ped);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.06, 2.06, .05, 96), new THREE.MeshStandardMaterial({ color: '#0d0e12', metalness: .5, roughness: .5 }));
    plate.position.y = .51; stage.add(plate);
    const rimMat = new THREE.MeshBasicMaterial({ color: '#f5a623', toneMapped: false });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.3, .032, 8, 160), rimMat); rim.rotation.x = Math.PI / 2; rim.position.y = .5; stage.add(rim);
    const rimB = new THREE.Mesh(new THREE.TorusGeometry(2.42, .028, 8, 160), new THREE.MeshBasicMaterial({ color: '#3a7bc8', toneMapped: false })); rimB.rotation.x = Math.PI / 2; rimB.position.y = .02; stage.add(rimB);
    // turntable ticks on the plate
    const tk = [];
    for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2, r0 = i % 6 ? 1.8 : 1.62; tk.push(Math.sin(a) * r0, 0, Math.cos(a) * r0, Math.sin(a) * 1.98, 0, Math.cos(a) * 1.98); }
    const tickGeo = new THREE.BufferGeometry(); tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tk, 3));
    const tickMat = new THREE.LineBasicMaterial({ color: '#6aa6ea', toneMapped: false, transparent: true, opacity: .8 });
    const ticks = new THREE.LineSegments(tickGeo, tickMat); ticks.position.y = .54; stage.add(ticks);
    const watch = createWatch(); watch.rotation.x = Math.PI / 2 - .1;
    const spin = new THREE.Group(); spin.add(watch); spin.scale.setScalar(WS); stage.add(spin);
    const cam = R3D.camera(24); cam.aspect = BW / BH;

    /* ---------- projection helpers (world -> 2D layer px) ---------- */
    const V = new THREE.Vector3(), V2 = new THREE.Vector3();
    const P = (x, y, z) => { V.set(x, y, z).project(cam); return [BX - LX + (V.x + 1) * BW / 2, BY - LY + (1 - V.y) * BH / 2]; };
    const S = (x, y, z) => { const p = P(x, y, z); return [p[0] + LX, p[1] + LY]; };      // stage px
    const depth = (x, y, z) => { V.set(x, y, z).applyMatrix4(cam.matrixWorldInverse); return -V.z; };
    const poly = (c, pts) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); };

    /* ---------- headline (centred, one line) ---------- */
    const head = el(`<div class="abs" style="left:0;width:1920px;top:112px;text-align:center">
      <div class="kicker" style="font-size:22px;margin-bottom:16px">Stage management</div>
      <div class="disp" style="font-size:86px;white-space:nowrap">${words('THE STAGE BEHIND')} <span class="gl" style="display:inline-block;position:relative">${words('EVERY SHOT.')}</span></div></div>`);
    root.appendChild(head);
    gradify(head.querySelector('.gl'));
    const kick = head.firstElementChild, hline = head.lastElementChild;

    /* ---------- nodes + connectors ---------- */
    const svg = el(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible">
      <defs>${NODES.map((_, i) => `<linearGradient id="s04g${i}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a7bc8"/><stop offset="1" stop-color="#f5a623"/></linearGradient>`).join('')}</defs>
      ${NODES.map((_, i) => `<g class="cn"><path class="base" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="5" stroke-linecap="round"/>
        <path class="line" fill="none" stroke="url(#s04g${i})" stroke-width="2.5" stroke-linecap="round"/>
        <path class="flow" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2.5" stroke-dasharray="2 16" stroke-linecap="round"/>
        <circle class="ring" r="10" fill="none" stroke="#f5a623" stroke-width="2"/><circle class="dot" r="5.5" fill="#f5a623"/></g>`).join('')}
      <g class="frame" fill="none" stroke="#eef1f6" stroke-width="3" stroke-linecap="round">${[0, 1, 2, 3].map(() => '<path/>').join('')}<rect class="fr" stroke-width="1" stroke="rgba(255,255,255,.28)" stroke-dasharray="6 8"/></g>
    </svg>`);
    root.appendChild(svg);
    const conns = [...svg.querySelectorAll('.cn')].map((g, i) => ({ g, base: g.querySelector('.base'), line: g.querySelector('.line'), flow: g.querySelector('.flow'), ring: g.querySelector('.ring'), dot: g.querySelector('.dot'), grad: svg.querySelector('#s04g' + i) }));
    const frameG = svg.querySelector('.frame'), corners = [...frameG.querySelectorAll('path')], frRect = frameG.querySelector('.fr');
    const frLbl = el(`<div class="abs mono" style="font-size:16px;letter-spacing:.14em;color:#eef1f6;white-space:nowrap;height:20px;overflow:hidden"><div class="a">3840 × 2160</div><div class="b">1080 × 1080</div></div>`);
    root.appendChild(frLbl);
    const frA = frLbl.querySelector('.a'), frB = frLbl.querySelector('.b');
    const scanClip = el(`<div class="abs" style="overflow:hidden"><div style="position:absolute;left:0;right:0;height:120px;background:linear-gradient(180deg,transparent,rgba(245,166,35,.16) 80%,rgba(255,236,200,.9) 98%,transparent)"></div></div>`);
    root.appendChild(scanClip); const scan = scanClip.firstElementChild;

    const cards = NODES.map((n, i) => {
      const c = el(`<div class="abs" style="left:${n.x}px;top:${n.y}px;width:${CW}px;height:${CH}px;transform-origin:${n.side === 'L' ? '100%' : '0'} 50%">
        <div class="glass abs gl" style="left:0;top:0;right:0;bottom:0;border-radius:10px"></div>
        <div class="abs ic" style="left:16px;top:${(CH - 56) / 2}px;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#23262f,#121318);border:2px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center">${icon(n.ic, 28, '#eef1f6')}</div>
        <div class="abs disp6" style="left:88px;top:14px;font-size:27px;white-space:nowrap">${n.name}</div>
        <div class="abs mono" style="left:88px;top:52px;height:24px;width:${CW - 100}px;overflow:hidden;font-size:17px;color:#9aa3b5;white-space:nowrap"><div class="va">${n.v[0]}</div><div class="vb" style="color:#f5a623">${n.v[1]}</div></div>
        ${i === 2 ? `<div class="abs sw" style="right:14px;top:14px;display:flex;gap:5px">${[['caseC', 'silver'], ['strap', 'silver'], ['dial', 'silver']].map(([k]) => `<i style="display:block;width:14px;height:14px;border-radius:50%;background:${GOLD[k]};border:1.5px solid rgba(255,255,255,.3)"></i>`).join('')}</div>` : ''}
        <div class="abs" style="${n.side === 'L' ? 'right:-8px' : 'left:-8px'};top:${CH / 2 - 8}px;width:16px;height:16px;border-radius:50%;background:#0a0a0c;border:3px solid #f5a623;box-shadow:0 0 12px rgba(245,166,35,.6)"></div></div>`);
      root.appendChild(c);
      return { c, glass: c.querySelector('.gl'), ic: c.querySelector('.ic'), va: c.querySelector('.va'), vb: c.querySelector('.vb'), sw: c.querySelector('.sw') };
    });
    const swatches = cards[2].sw ? [...cards[2].sw.children] : [];
    const SW_B = [VARIANTS.silver.caseC, VARIANTS.silver.strap, VARIANTS.silver.dial];

    /* ---------- shot switch pill ---------- */
    const pill = el(`<div class="abs glass" style="left:0;top:902px;height:58px;border-radius:29px;display:flex;align-items:center;gap:6px;padding:0 6px 0 22px">
      <span class="mono" style="font-size:16px;letter-spacing:.2em;color:#9aa3b5;margin-right:10px">SHOT</span>
      <div class="thumb abs" style="top:6px;height:46px;border-radius:23px;background:rgba(58,123,200,.55);box-shadow:inset 0 0 0 1px rgba(140,185,240,.45)"></div>
      <div class="sg disp6" style="position:relative;font-size:23px;padding:0 20px;height:46px;line-height:46px;white-space:nowrap">${icon('layer', 20, '#c9d1de').replace('display:block', 'display:inline-block;vertical-align:-3px;margin-right:8px')}Front 3/4</div>
      <div class="sg disp6" style="position:relative;font-size:23px;padding:0 20px;height:46px;line-height:46px;white-space:nowrap">${icon('layer', 20, '#c9d1de').replace('display:block', 'display:inline-block;vertical-align:-3px;margin-right:8px')}Close-up</div></div>`);
    root.appendChild(pill);
    const pw = pill.offsetWidth; pill.style.left = (960 - pw / 2) + 'px';
    const segs = [...pill.querySelectorAll('.sg')], thumb = pill.querySelector('.thumb');
    const segX = segs.map(s => [s.offsetLeft, s.offsetWidth]);
    const clickX = 960 - pw / 2 + segX[1][0] + segX[1][1] / 2, clickY = 902 + 29;
    const cursor = new Cursor(root, ctx, [
      { t: TSW - 1.05, x: 1330, y: 1090 }, { t: TSW, x: clickX + 6, y: clickY + 4, click: true }, { t: TSW + 1.2, x: 1360, y: 1110 }], { hideAt: TSW + .95 });

    /* ---------- sound ---------- */
    ctx.cue(.3, 'whoosh', { gain: .3, pitch: -4 });
    ctx.cue(ctx.line(0) - .02, 'shimmer', { gain: .45 });
    TN.forEach((t, i) => { ctx.cue(t, 'pop', { gain: .75, pitch: [0, 2, 4, 5, 7][i], pan: NODES[i].side === 'L' ? -.4 : .4 }); ctx.cue(t + .45, 'tick', { gain: .3, pitch: 12 + [0, 2, 4, 5, 7][i], pan: NODES[i].side === 'L' ? -.2 : .2 }); });
    ctx.cue(TN[3] + .12, 'swish', { gain: .4 });
    ctx.cue(TN[4] + .14, 'shutter', { gain: .55 });
    ctx.cue(TSW + .06, 'whoosh', { gain: .55 });
    ctx.cue(TSW + .7, 'chime', { gain: .45, pitch: 2 });

    /* ---------- per-frame helpers ---------- */
    const lineTo2 = (c, a, b) => { c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); };
    const glowStroke = (c, col, a, w = 1.5) => { c.strokeStyle = rgba(col, a * .22); c.lineWidth = w * 4; c.stroke(); c.strokeStyle = rgba(col, a); c.lineWidth = w; c.stroke(); };

    // floor grid: segments bucketed by fade so each bucket is one stroke
    const GN = 11, GS = 1.4, GE = GN * GS, GSEG = 12;
    const gridSegs = [[], [], [], [], []];
    for (let k = -GN; k <= GN; k++) for (const d of [0, 1]) for (let s = 0; s < GSEG; s++) {
      const u0 = -GE + 2 * GE * s / GSEG, u1 = -GE + 2 * GE * (s + 1) / GSEG, um = (u0 + u1) / 2;
      const f = clamp(1 - Math.hypot(k * GS, um) / GE); if (f < .06) continue;
      gridSegs[Math.min(4, Math.floor(f * 5))].push(d ? [k * GS, u0, k * GS, u1] : [u0, k * GS, u1, k * GS]);
    }
    function drawGrid(a) {
      gridSegs.forEach((segs, b) => {
        bg.beginPath(); for (const [x0, z0, x1, z1] of segs) lineTo2(bg, P(x0, 0, z0), P(x1, 0, z1));
        bg.strokeStyle = rgba('#3a7bc8', a * (b + 1) / 5 * .42); bg.lineWidth = 1.2; bg.stroke();
      });
    }
    function ring(c, r, y, a0, a1, n = 96) { const pts = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push(P(Math.sin(a) * r, y, Math.cos(a) * r)); } return pts; }
    // dome point: th = azimuth (0 = straight back), ph = elevation
    const dp = (th, ph, R = DOME) => [R * Math.cos(ph) * Math.sin(th), R * Math.sin(ph), -R * Math.cos(ph) * Math.cos(th)];
    function drawDome(k, warm) {
      if (k <= 0) return;
      const col = warm > .5 ? '#f5a623' : '#6aa6ea';
      const a = .5 * clamp(k * 3), thMax = lerp(-Math.PI / 2, Math.PI / 2, ease.out(k));
      bg.lineWidth = 1;
      for (const ph of [0, .26, .52, .78, 1.04, 1.3]) {
        const pts = []; for (let i = 0; i <= 48; i++) { const th = lerp(-Math.PI / 2, thMax, i / 48); pts.push(P(...dp(th, ph))); }
        poly(bg, pts); bg.strokeStyle = rgba(col, a * (ph === 0 ? .9 : .55)); bg.stroke();
      }
      for (let j = 0; j <= 12; j++) {
        const th = -Math.PI / 2 + j * Math.PI / 12; if (th > thMax) break;
        const pts = []; for (let i = 0; i <= 24; i++) pts.push(P(...dp(th, i / 24 * Math.PI / 2)));
        poly(bg, pts); bg.strokeStyle = rgba(col, a * .45); bg.stroke();
      }
    }
    // Blender-style camera gizmo: pyramid, frame, filled "up" triangle, faint frustum toward the product
    const up = new THREE.Vector3(0, 1, 0), fw = new THREE.Vector3(), rt = new THREE.Vector3(), uu = new THREE.Vector3();
    function drawGizmo(c, pos, k, hot, frac) {
      if (k <= 0) return;
      fw.set(0, WY, 0).sub(pos); const dist = fw.length(); fw.normalize();
      rt.crossVectors(fw, up).normalize(); uu.crossVectors(rt, fw).normalize();
      const at = (d, x, y) => { V2.copy(pos).addScaledVector(fw, d).addScaledVector(rt, x).addScaledVector(uu, y); return P(V2.x, V2.y, V2.z); };
      const d = 1.25 * k, hw = .74 * k, hh = .42 * k;
      const apex = P(pos.x, pos.y, pos.z), C = [at(d, -hw, -hh), at(d, hw, -hh), at(d, hw, hh), at(d, -hw, hh)];
      // frustum reaching toward the product
      const far = dist * .74 * frac, fk = far / 1.25;
      if (frac > 0) {
        const F = [at(far, -.74 * fk, -.42 * fk), at(far, .74 * fk, -.42 * fk), at(far, .74 * fk, .42 * fk), at(far, -.74 * fk, .42 * fk)];
        c.beginPath(); C.forEach((p, i) => lineTo2(c, p, F[i])); c.setLineDash([4, 7]); c.strokeStyle = rgba('#eef1f6', .28 * k); c.lineWidth = 1; c.stroke(); c.setLineDash([]);
        c.beginPath(); F.forEach((p, i) => lineTo2(c, p, F[(i + 1) % 4])); c.strokeStyle = rgba('#eef1f6', .18 * k); c.stroke();
      }
      c.beginPath(); C.forEach(p => lineTo2(c, apex, p)); C.forEach((p, i) => lineTo2(c, p, C[(i + 1) % 4]));
      glowStroke(c, hot > 0 ? '#f5a623' : '#eef1f6', .95 * clamp(k * 2), 1.8);
      const T = [at(d, -hw * .55, hh * 1.15), at(d, 0, hh * 1.95), at(d, hw * .55, hh * 1.15)];
      poly(c, T); c.closePath(); c.fillStyle = rgba('#f5a623', .95 * clamp(k * 2)); c.fill();
      c.beginPath(); c.arc(apex[0], apex[1], 4.5, 0, Math.PI * 2); c.fillStyle = '#eef1f6'; c.fill();
      return apex;
    }

    let camNow = new THREE.Vector3();
    return lt => {
      const sw = swK(lt);
      /* ---- audience camera: slow orbit drift ---- */
      const az = lerp(-.2, .1, ease.sine(clamp(lt / ctx.dur))), elv = .37, D = 25.5;
      cam.position.set(TGT.x + D * Math.cos(elv) * Math.sin(az), TGT.y + D * Math.sin(elv), TGT.z + D * Math.cos(elv) * Math.cos(az));
      cam.aspect = BW / BH; cam.updateProjectionMatrix(); cam.lookAt(TGT); cam.updateMatrixWorld();

      /* ---- product ---- */
      const rise = ease.out(prog(lt, -.45, 1.7));
      const spinT = ease.inOut(prog(lt, TN[3] + .05, 1.7)) * Math.PI * 2;        // one turntable revolution on "animation"
      const turn = -.42 + Math.sin(lt * .55) * .22 + spinT;
      spin.position.y = WY - (1 - rise) * 1.6; spin.rotation.y = turn;
      ticks.rotation.y = turn; plate.rotation.y = turn;
      paintWatch(watch, 'gold', 'silver', sw);
      setTime(watch, 30 + lt * 8 + sw * sw * 900);                                  // Hands_Sweep after the switch
      const matK = Math.max(0, 1 - Math.abs(lt - TN[2] - .35) / .5);               // materials sheen
      glowPart(watch, 'case', matK * .9); glowPart(watch, 'strap', matK * .5);
      const worldK = ease.out(prog(lt, TN[1], 1.2));
      scene.environmentIntensity = lerp(.75, 1.15, worldK) - matK * .1;
      LI.key.intensity = 1.35 + matK * 2.4; LI.key.position.set(-4 + matK * 9, 8, 6);
      LI.key.color.set(sw > .5 ? '#ffe0bd' : '#ffffff');
      LI.rimW.intensity = 26 + sw * 60; LI.rimC.intensity = 42 - sw * 22;
      const stageOn = ease.out(prog(lt, ctx.line(0) - .1, .9));
      rimMat.color.set('#f5a623').multiplyScalar(.35 + stageOn * .9 + Math.sin(lt * 3) * .05);
      tickMat.opacity = .25 + stageOn * .6;
      view.draw(scene, cam);
      beam.style.opacity = .35 + stageOn * .65;

      /* ---- 2D wireframes behind the product ---- */
      bg.clearRect(0, 0, LW, LH); fg.clearRect(0, 0, LW, LH);
      drawGrid(.55 + stageOn * .45);
      // floor rings (draw on with the stage lights)
      const rk = ease.inOut(prog(lt, ctx.line(0) - .1, 1.3));
      if (rk > 0) {
        bg.lineWidth = 1.5; poly(bg, ring(bg, 3.05, 0, Math.PI, Math.PI + rk * Math.PI * 2)); glowStroke(bg, '#6aa6ea', .7, 1.4);
        poly(bg, ring(bg, 3.9, 0, 0, rk * Math.PI * 2)); bg.setLineDash([3, 9]); bg.strokeStyle = rgba('#6aa6ea', .55); bg.lineWidth = 1.5; bg.stroke(); bg.setLineDash([]);
        bg.beginPath();
        for (let i = 0; i < 36 * rk; i++) { const a = i / 36 * Math.PI * 2 + turn * .25; lineTo2(bg, P(Math.sin(a) * 4.55, 0, Math.cos(a) * 4.55), P(Math.sin(a) * (i % 3 ? 4.75 : 5.0), 0, Math.cos(a) * (i % 3 ? 4.75 : 5.0))); }
        bg.strokeStyle = rgba('#6aa6ea', .5); bg.lineWidth = 1.5; bg.stroke();
      }
      // world dome + sun
      const domeK = prog(lt, TN[1] - .02, 1.1);
      drawDome(domeK, sw);
      if (domeK > 0) {
        const sp = S(...dp(lerp(.9, 1.05, sw), lerp(.72, .2, sw)));
        const sun = P(...dp(lerp(.9, 1.05, sw), lerp(.72, .2, sw))), sk = ease.back(prog(lt, TN[1] + .15, .6));
        const scol = sw > .5 ? '#f5a623' : '#fff3dc';
        const g = bg.createRadialGradient(sun[0], sun[1], 0, sun[0], sun[1], 90 * sk);
        g.addColorStop(0, rgba(scol, .85)); g.addColorStop(.25, rgba(sw > .5 ? '#e87d0d' : '#6aa6ea', .3)); g.addColorStop(1, rgba('#3a7bc8', 0));
        bg.fillStyle = g; bg.beginPath(); bg.arc(sun[0], sun[1], 90 * sk, 0, Math.PI * 2); bg.fill();
        bg.beginPath(); bg.arc(sun[0], sun[1], 13 * sk, 0, Math.PI * 2); bg.fillStyle = scol; bg.fill();
        bg.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + lt * .4; lineTo2(bg, [sun[0] + Math.cos(a) * 22 * sk, sun[1] + Math.sin(a) * 22 * sk], [sun[0] + Math.cos(a) * 31 * sk, sun[1] + Math.sin(a) * 31 * sk]); }
        bg.strokeStyle = rgba(scol, .9); bg.lineWidth = 2.5; bg.lineCap = 'round'; bg.stroke(); bg.lineCap = 'butt';
        NODES[1].anchor = sp;
      }
      // motion path around the watch (split behind / in front of the product)
      const pathK = ease.inOut(prog(lt, TN[3] - .02, .9));
      const wd = depth(0, spin.position.y, 0);
      if (pathK > 0) {
        const n = 90, a0 = -Math.PI * .35;
        for (let i = 0; i < n * pathK; i += 2) {
          const a = a0 + i / n * Math.PI * 2, b = a0 + (i + 1) / n * Math.PI * 2;
          const pa = [Math.sin(a) * ORB, spin.position.y - .35, Math.cos(a) * ORB];
          const c = depth(...pa) > wd ? bg : fg;
          c.beginPath(); lineTo2(c, P(...pa), P(Math.sin(b) * ORB, spin.position.y - .35, Math.cos(b) * ORB));
          c.strokeStyle = rgba('#eef1f6', .75 * (1 - sw * .6)); c.lineWidth = 2; c.stroke();
        }
        // keyframes + playhead
        [-1.1, .45, 2.0, 3.6].forEach((a, j) => {
          const kk = ease.back(prog(lt, TN[3] + .15 + j * .1, .45)); if (kk <= 0) return;
          const q = [Math.sin(a) * ORB, spin.position.y - .35, Math.cos(a) * ORB], c = depth(...q) > wd ? bg : fg, p = P(...q), s = 8 * kk;
          c.beginPath(); c.moveTo(p[0], p[1] - s); c.lineTo(p[0] + s, p[1]); c.lineTo(p[0], p[1] + s); c.lineTo(p[0] - s, p[1]); c.closePath();
          c.fillStyle = '#f5a623'; c.fill(); c.strokeStyle = '#0a0a0c'; c.lineWidth = 1.5; c.stroke();
          if (j === 0) NODES[3].anchor = [p[0] + LX, p[1] + LY];
        });
        const ph = -1.1 + spinT;
        const q = [Math.sin(ph) * ORB, spin.position.y - .35, Math.cos(ph) * ORB], c = depth(...q) > wd ? bg : fg, p = P(...q);
        c.beginPath(); c.arc(p[0], p[1], 6, 0, Math.PI * 2); c.fillStyle = '#ffffff'; c.fill();
      }
      // camera gizmo (moves for the second shot)
      const gk = ease.back(prog(lt, TN[0] - .02, .55));
      camNow.copy(SHOT_CAM[0]).lerp(SHOT_CAM[1], sw); camNow.y += Math.sin(sw * Math.PI) * 1.2;
      const hot = Math.max(0, 1 - Math.abs(lt - TN[0] - .3) / .5) + Math.max(0, 1 - Math.abs(lt - TSW - .4) / .5);
      const apex = drawGizmo(fg, camNow, gk, hot > .3 ? 1 : 0, ease.inOut(prog(lt, TN[0] + .15, .7)));
      if (apex) NODES[0].anchor = [apex[0] + LX, apex[1] + LY];
      // materials anchor: a point on the case rim
      watch.updateMatrixWorld(true);
      V2.set(1.55, .2, .95); watch.localToWorld(V2); NODES[2].anchor = S(V2.x, V2.y, V2.z);

      /* ---- render frame (16:9 around the watch head -> 1:1 close-up) ---- */
      const hc = S(0, spin.position.y + .15, 0);
      const fw16 = 560, fh16 = 315, fsq = 330;
      const fwid = lerp(fw16, fsq, sw), fhei = lerp(fh16, fsq, sw);
      const fx = hc[0] - fwid / 2, fy = hc[1] - fhei / 2, rkF = ease.expo(prog(lt, TN[4] - .02, .5));
      frameG.style.opacity = clamp(rkF * 2);
      const ex = (1 - rkF) * 40, cl = 34;
      const X0 = fx - ex, Y0 = fy - ex, X1 = fx + fwid + ex, Y1 = fy + fhei + ex;
      corners[0].setAttribute('d', `M${X0} ${Y0 + cl}V${Y0}H${X0 + cl}`); corners[1].setAttribute('d', `M${X1 - cl} ${Y0}H${X1}V${Y0 + cl}`);
      corners[2].setAttribute('d', `M${X1} ${Y1 - cl}V${Y1}H${X1 - cl}`); corners[3].setAttribute('d', `M${X0 + cl} ${Y1}H${X0}V${Y1 - cl}`);
      frRect.setAttribute('x', X0); frRect.setAttribute('y', Y0); frRect.setAttribute('width', X1 - X0); frRect.setAttribute('height', Y1 - Y0);
      frLbl.style.left = X0 + 'px'; frLbl.style.top = (Y0 - 30) + 'px'; frLbl.style.opacity = clamp(rkF * 2);
      frA.style.transform = frB.style.transform = `translateY(${-ease.inOut(prog(lt, TSW + .3, .35)) * 20}px)`;
      NODES[4].anchor = [X1, Y1];
      const sc = prog(lt, TN[4] + .08, .7);
      scanClip.style.left = X0 + 'px'; scanClip.style.top = Y0 + 'px'; scanClip.style.width = (X1 - X0) + 'px'; scanClip.style.height = (Y1 - Y0) + 'px';
      scanClip.style.opacity = sc > 0 && sc < 1 ? 1 : 0; scan.style.top = (ease.inOut(sc) * (Y1 - Y0 + 120) - 120) + 'px';

      /* ---- headline ---- */
      kick.style.opacity = ease.out(prog(lt, .35, .5));
      kick.style.letterSpacing = (.22 + (1 - ease.expo(prog(lt, .35, .9))) * .2) + 'em';
      revealMasks(hline, lt, .5, .08, .8);

      /* ---- nodes + connectors ---- */
      NODES.forEach((n, i) => {
        const cd = cards[i], t = TN[i], k = prog(lt, t, .5), kb = ease.back(k);
        cd.c.style.opacity = clamp(k * 3);
        const fl = float(lt, 4, .9, i * 1.3);
        cd.c.style.transform = `translate(${(1 - kb) * (n.side === 'L' ? -40 : 40)}px,${fl}px) scale(${lerp(.7, 1, kb)})`;
        const hotN = Math.exp(-Math.max(0, lt - t) * 2.2) * (lt >= t ? 1 : 0), hs = Math.max(hotN, Math.max(0, 1 - Math.abs(lt - TSW - .35 - i * .07) / .45));
        cd.glass.style.boxShadow = `0 40px 90px rgba(0,0,0,.5),0 0 ${hs * 40}px rgba(245,166,35,${hs * .55})`;
        cd.glass.style.borderColor = `rgba(245,166,35,${hs * .8})`;
        cd.ic.style.borderColor = hs > .05 ? `rgba(245,166,35,${.3 + hs * .7})` : 'rgba(255,255,255,.14)';
        const vk = ease.inOut(prog(lt, TSW + .2 + i * .07, .4));
        cd.va.style.transform = cd.vb.style.transform = `translateY(${-vk * 24}px)`;
        // connector
        const C = conns[i];
        const sx = n.side === 'L' ? n.x + CW + 8 : n.x - 8, sy = n.y + CH / 2 + fl;
        const a = n.anchor;
        if (!a || lt < t) { C.g.style.opacity = 0; return; }
        C.g.style.opacity = 1;
        const dx = a[0] - sx;
        const d = `M${sx.toFixed(1)} ${sy.toFixed(1)}C${(sx + dx * .45).toFixed(1)} ${sy.toFixed(1)} ${(a[0] - dx * .35).toFixed(1)} ${a[1].toFixed(1)} ${a[0].toFixed(1)} ${a[1].toFixed(1)}`;
        C.base.setAttribute('d', d); C.line.setAttribute('d', d); C.flow.setAttribute('d', d);
        C.grad.setAttribute('x1', sx); C.grad.setAttribute('y1', sy); C.grad.setAttribute('x2', a[0]); C.grad.setAttribute('y2', a[1]);
        const len = C.line.getTotalLength(), dk = ease.inOut(prog(lt, t + .05, .42));
        C.line.style.strokeDasharray = len; C.line.style.strokeDashoffset = len * (1 - dk);
        C.base.style.opacity = dk;
        C.flow.style.opacity = prog(lt, t + .45, .4) * .9; C.flow.style.strokeDashoffset = -lt * 46;
        const land = prog(lt, t + .42, .5);
        C.dot.setAttribute('cx', a[0]); C.dot.setAttribute('cy', a[1]); C.dot.style.opacity = dk >= 1 ? 1 : 0;
        C.ring.setAttribute('cx', a[0]); C.ring.setAttribute('cy', a[1]);
        C.ring.setAttribute('r', 6 + ease.out(land) * 22); C.ring.style.opacity = land > 0 && land < 1 ? 1 - land : 0;
      });
      swatches.forEach((s, j) => { s.style.background = sw > 0 ? `color-mix(in srgb, ${SW_B[j]} ${Math.round(sw * 100)}%, ${[GOLD.caseC, GOLD.strap, GOLD.dial][j]})` : [GOLD.caseC, GOLD.strap, GOLD.dial][j]; });

      /* ---- shot pill + cursor ---- */
      const pk = ease.back(prog(lt, TSW - 1.25, .55));
      pill.style.opacity = clamp(prog(lt, TSW - 1.25, .55) * 3); pill.style.transform = `translateY(${(1 - pk) * 30}px) scale(${lerp(.85, 1, pk)})`;
      const tx = lerp(segX[0][0], segX[1][0], sw), tw = lerp(segX[0][1], segX[1][1], sw);
      thumb.style.left = tx + 'px'; thumb.style.width = tw + 'px';
      cursor.update(lt);
    };
  },
});
