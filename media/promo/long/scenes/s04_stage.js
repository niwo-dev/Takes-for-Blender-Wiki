// s04 — The stage. The product floats over a turntable. A short statement is read first (stage framed right),
// then it clears and the camera re-frames the stage to centre. As the narrator lists the camera, the world,
// the materials, the animation and the render settings, each appears on the stage (Blender-style camera gizmo,
// world dome, material sheen, motion path, render frame) with a labelled node wired to it.
// Ends on a one-click shot switch that changes all five at once.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE, rgba } from '../engine.js';
import { icon, words, revealMasks, gradify, canvas3d, Cursor, float } from '../ui.js';
import { createWatch, paintWatch, setTime, glowPart, VARIANTS } from '../product3d.js';

const BW = 900, BH = 780;                              // WebGL view size (watch + pedestal only)
const BOX_A = [1360, 590], BOX_B = [960, 552];         // view centre: framed right under the statement, then centred
const TGT = new THREE.Vector3(0, 3.3, 0);              // audience camera target
const WY = 4.75, WS = .74;                             // watch centre height / scale
const DOME = 7.4, ORB = 3.25;                          // world dome radius, motion path radius
const CW = 286, CH = 80;                               // node card size
const GOLD = VARIANTS.gold, SILVER = VARIANTS.silver;
const SHOT_CAM = [new THREE.Vector3(-5.3, 5.5, 4.6), new THREE.Vector3(-3.3, 7.0, 4.3)];   // gizmo per shot

const NODES = [
  { ic: 'camera', name: 'Camera', x: 150, y: 318, side: 'L' },
  { ic: 'world', name: 'World', x: 1484, y: 262, side: 'R' },
  { ic: 'palette', name: 'Materials', x: 1484, y: 506, side: 'R' },
  { ic: 'action', name: 'Animation', x: 150, y: 620, side: 'L' },
  { ic: 'sliders', name: 'Render settings', x: 1484, y: 750, side: 'R' },
];
// word positions inside line 1, as fractions of the line (camera, world, materials, animation, render settings)
const WORD = [.03, .2, .37, .545, .78];

defineScene({
  id: 's04_stage',
  transitionIn: 'zoom',
  camera: { zoom: .03 },
  mood: { a: '#265787', b: '#e87d0d', grid: .06, part: .55, glow: 1.15, ax: .5, ay: .38, bx: .55, by: .98 },
  build(root, ctx) {
    const L1 = ctx.line(1), D1 = ctx.lineEnd(1) - L1;
    const TN = WORD.map(f => L1 + f * D1 - .04);            // node beats
    const tOut = Math.min(ctx.lineEnd(0) + .05, L1 - .45);  // statement clears, stage re-frames to centre
    const TSW = Math.max(ctx.lineEnd(1) + 1.1, ctx.dur - 2.9);   // shot switch click (leaves ~2 s of hold)
    const swK = lt => ease.inOut(prog(lt, TSW + .05, .75));
    const frameK = lt => ease.inOut(prog(lt, tOut, 1.0));

    /* ---------- layers (back to front) ---------- */
    const mk = () => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; c.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px'; return c; };
    const bgC = mk(); root.appendChild(bgC);
    const beam = el(`<div class="abs" style="width:360px;height:440px;background:radial-gradient(ellipse 50% 60% at 50% 100%,rgba(245,166,35,.2),rgba(58,123,200,.06) 60%,transparent 75%)"></div>`);
    root.appendChild(beam);
    const view = canvas3d(root, { x: 0, y: 0, w: BW, h: BH });
    const fgC = mk(); root.appendChild(fgC);
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
    const tk = [];
    for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2, r0 = i % 6 ? 1.8 : 1.62; tk.push(Math.sin(a) * r0, 0, Math.cos(a) * r0, Math.sin(a) * 1.98, 0, Math.cos(a) * 1.98); }
    const tickGeo = new THREE.BufferGeometry(); tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tk, 3));
    const tickMat = new THREE.LineBasicMaterial({ color: '#6aa6ea', toneMapped: false, transparent: true, opacity: .8 });
    const ticks = new THREE.LineSegments(tickGeo, tickMat); ticks.position.y = .54; stage.add(ticks);
    const watch = createWatch(); watch.rotation.x = Math.PI / 2 - .1;
    // steel case back (the gold back would mirror the blue studio strip as green during the turntable spin)
    const back = new THREE.Mesh(new THREE.CircleGeometry(1.62, 64), new THREE.MeshStandardMaterial({ color: '#4a4e58', metalness: .85, roughness: .38 }));
    back.rotation.x = Math.PI / 2; back.position.y = -.33; watch.add(back);
    const spin = new THREE.Group(); spin.add(watch); spin.scale.setScalar(WS); stage.add(spin);
    const cam = R3D.camera(24); cam.aspect = BW / BH;

    /* ---------- projection (world -> stage px) ---------- */
    const V = new THREE.Vector3(), V2 = new THREE.Vector3();
    let bx = 0, by = 0;                                      // current view origin (stage px)
    const P = (x, y, z) => { V.set(x, y, z).project(cam); return [bx + (V.x + 1) * BW / 2, by + (1 - V.y) * BH / 2]; };
    const depth = (x, y, z) => { V.set(x, y, z).applyMatrix4(cam.matrixWorldInverse); return -V.z; };
    const poly = (c, pts) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); };
    const seg = (c, a, b) => { c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); };
    const glowStroke = (c, col, a, w = 1.5) => { c.strokeStyle = rgba(col, a * .22); c.lineWidth = w * 4; c.stroke(); c.strokeStyle = rgba(col, a); c.lineWidth = w; c.stroke(); };

    /* ---------- statement (read first, then clears) ---------- */
    const head = el(`<div class="abs" style="left:120px;top:196px;width:1000px">
      <div class="kicker" style="margin-bottom:24px">Stage management</div>
      <div class="disp" style="font-size:104px;white-space:nowrap;margin-bottom:6px">${words('THE STAGE')}</div>
      <div class="disp gl" style="font-size:104px;white-space:nowrap;display:inline-block;position:relative">${words('BEHIND EVERY SHOT.')}</div></div>`);
    root.appendChild(head);
    gradify(head.querySelector('.gl'));
    const kick = head.children[0], hl1 = head.children[1], hl2 = head.children[2];

    /* ---------- node cards + connectors ---------- */
    const svg = el(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible">
      <defs>${NODES.map((_, i) => `<linearGradient id="s04g${i}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3a7bc8"/><stop offset="1" stop-color="#f5a623"/></linearGradient>`).join('')}</defs>
      <g class="frame" fill="none" stroke="#eef1f6" stroke-width="3" stroke-linecap="round"><rect class="fr" stroke-width="1" stroke="rgba(255,255,255,.3)" stroke-dasharray="6 8"/>${[0, 1, 2, 3].map(() => '<path/>').join('')}</g>
      ${NODES.map((_, i) => `<g class="cn"><path class="base" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="6" stroke-linecap="round"/>
        <path class="line" fill="none" stroke="url(#s04g${i})" stroke-width="2.5" stroke-linecap="round"/>
        <path class="flow" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2.5" stroke-dasharray="2 16" stroke-linecap="round"/>
        <circle class="ring" r="10" fill="none" stroke="#f5a623" stroke-width="2"/><circle class="dot" r="5.5" fill="#f5a623"/></g>`).join('')}
    </svg>`);
    root.appendChild(svg);
    const conns = [...svg.querySelectorAll('.cn')].map((g, i) => ({ g, base: g.querySelector('.base'), line: g.querySelector('.line'), flow: g.querySelector('.flow'), ring: g.querySelector('.ring'), dot: g.querySelector('.dot'), grad: svg.querySelector('#s04g' + i) }));
    const frameG = svg.querySelector('.frame'), corners = [...frameG.querySelectorAll('path')], frRect = frameG.querySelector('.fr');
    const scanClip = el(`<div class="abs" style="overflow:hidden"><div style="position:absolute;left:0;right:0;height:120px;background:linear-gradient(180deg,transparent,rgba(245,166,35,.14) 80%,rgba(255,236,200,.85) 98%,transparent)"></div></div>`);
    root.appendChild(scanClip); const scan = scanClip.firstElementChild;

    const SWA = [GOLD.caseC, GOLD.strap, GOLD.dial], SWB = [SILVER.caseC, SILVER.strap, SILVER.dial];
    const cards = NODES.map((n, i) => {
      const c = el(`<div class="abs" style="left:${n.x}px;top:${n.y}px;width:${CW}px;height:${CH}px;transform-origin:${n.side === 'L' ? '100%' : '0'} 50%">
        <div class="glass abs gl" style="left:0;top:0;right:0;bottom:0;border-radius:10px"></div>
        <div class="abs ic" style="left:14px;top:${(CH - 52) / 2}px;width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#262a34,#121318);border:2px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center">${icon(n.ic, 26, '#eef1f6')}</div>
        <div class="abs disp6" style="left:82px;top:${CH / 2 - 17}px;font-size:27px;line-height:34px;white-space:nowrap">${n.name}</div>
        ${i === 2 ? `<div class="abs sw" style="right:16px;top:${CH / 2 - 7}px;display:flex;gap:6px">${SWA.map(c => `<i style="display:block;width:14px;height:14px;border-radius:50%;background:${c};border:1.5px solid rgba(255,255,255,.3)"></i>`).join('')}</div>` : ''}
        <div class="abs" style="${n.side === 'L' ? 'right:-8px' : 'left:-8px'};top:${CH / 2 - 8}px;width:16px;height:16px;border-radius:50%;background:#0a0a0c;border:3px solid #f5a623;box-shadow:0 0 12px rgba(245,166,35,.6)"></div></div>`);
      root.appendChild(c);
      return { c, glass: c.querySelector('.gl'), ic: c.querySelector('.ic'), sw: c.querySelector('.sw') };
    });
    const swatches = [...cards[2].sw.children];

    /* ---------- shot switch (two view layer tabs) ---------- */
    const tab = name => `<div class="sg disp6" style="position:relative;font-size:23px;padding:0 22px 0 18px;height:46px;line-height:46px;white-space:nowrap">${icon('layer', 20, '#c9d1de').replace('display:block', 'display:inline-block;vertical-align:-3px;margin-right:10px')}${name}</div>`;
    const pill = el(`<div class="abs glass" style="left:0;top:904px;height:58px;border-radius:29px;display:flex;align-items:center;gap:4px;padding:0 6px">
      <div class="thumb abs" style="top:6px;height:46px;border-radius:23px;background:rgba(58,123,200,.55);box-shadow:inset 0 0 0 1px rgba(140,185,240,.45)"></div>${tab('Front 3/4')}${tab('Close-up')}</div>`);
    root.appendChild(pill);
    const pw = pill.offsetWidth, pX = 960 - pw / 2; pill.style.left = pX + 'px';
    const segs = [...pill.querySelectorAll('.sg')], thumb = pill.querySelector('.thumb');
    const segX = segs.map(s => [s.offsetLeft, s.offsetWidth]);
    // click on the tab's icon, low, so the pointer never sits on the label
    const cX = pX + segX[1][0] + 26, cY = 904 + 40;
    const cursor = new Cursor(root, ctx, [
      { t: TSW - 1.0, x: 1330, y: 1100 }, { t: TSW, x: cX, y: cY, click: true }, { t: TSW + 1.15, x: 1330, y: 1110 }], { hideAt: TSW + .85 });

    /* ---------- sound ---------- */
    ctx.cue(.25, 'whoosh', { gain: .3, pitch: -4 });
    ctx.cue(ctx.line(0) - .02, 'shimmer', { gain: .4 });
    ctx.cue(tOut + .05, 'swish', { gain: .45 });
    TN.forEach((t, i) => {
      const pan = NODES[i].side === 'L' ? -.4 : .4, p = [0, 2, 4, 5, 7][i];
      ctx.cue(t, 'pop', { gain: .75, pitch: p, pan }); ctx.cue(t + .46, 'tick', { gain: .28, pitch: 12 + p, pan: pan / 2 });
    });
    ctx.cue(TN[3] + .12, 'whoosh', { gain: .3, pitch: 3 });
    ctx.cue(TN[4] + .14, 'shutter', { gain: .55 });
    ctx.cue(TSW + .06, 'whoosh', { gain: .55 });
    ctx.cue(TSW + .7, 'chime', { gain: .45, pitch: 2 });

    /* ---------- wireframe builders ---------- */
    const GN = 11, GS = 1.4, GE = GN * GS, GSEG = 12, gridSegs = [[], [], [], [], []];
    for (let k = -GN; k <= GN; k++) for (const d of [0, 1]) for (let s = 0; s < GSEG; s++) {
      const u0 = -GE + 2 * GE * s / GSEG, u1 = -GE + 2 * GE * (s + 1) / GSEG, um = (u0 + u1) / 2;
      const f = clamp(1 - Math.hypot(k * GS, um) / GE); if (f < .06) continue;
      gridSegs[Math.min(4, Math.floor(f * 5))].push(d ? [k * GS, u0, k * GS, u1] : [u0, k * GS, u1, k * GS]);
    }
    const drawGrid = a => gridSegs.forEach((segs, b) => {
      bg.beginPath(); for (const [x0, z0, x1, z1] of segs) seg(bg, P(x0, 0, z0), P(x1, 0, z1));
      bg.strokeStyle = rgba('#3a7bc8', a * (b + 1) / 5 * .42); bg.lineWidth = 1.2; bg.stroke();
    });
    const ring = (r, y, a0, a1, n = 96) => { const pts = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push(P(Math.sin(a) * r, y, Math.cos(a) * r)); } return pts; };
    const dp = (th, ph, R = DOME) => [R * Math.cos(ph) * Math.sin(th), R * Math.sin(ph), -R * Math.cos(ph) * Math.cos(th)];   // back half of the dome
    function drawDome(k, warm) {
      if (k <= 0) return;
      const col = warm > .5 ? '#f5a623' : '#6aa6ea', a = .5 * clamp(k * 3), thMax = lerp(-Math.PI / 2, Math.PI / 2, ease.out(k));
      bg.lineWidth = 1;
      for (const ph of [0, .26, .52, .78, 1.04, 1.3]) {
        const pts = []; for (let i = 0; i <= 48; i++) pts.push(P(...dp(lerp(-Math.PI / 2, thMax, i / 48), ph)));
        poly(bg, pts); bg.strokeStyle = rgba(col, a * (ph === 0 ? .9 : .55)); bg.stroke();
      }
      for (let j = 0; j <= 12; j++) {
        const th = -Math.PI / 2 + j * Math.PI / 12; if (th > thMax) break;
        const pts = []; for (let i = 0; i <= 24; i++) pts.push(P(...dp(th, i / 24 * Math.PI / 2)));
        poly(bg, pts); bg.strokeStyle = rgba(col, a * .45); bg.stroke();
      }
    }
    // Blender-style camera: pyramid, frame, filled "up" triangle, and a faint frustum reaching toward the product
    const up = new THREE.Vector3(0, 1, 0), fw = new THREE.Vector3(), rt = new THREE.Vector3(), uu = new THREE.Vector3();
    function drawGizmo(c, pos, k, hot, frac) {
      fw.set(0, WY, 0).sub(pos); const dist = fw.length(); fw.normalize();
      rt.crossVectors(fw, up).normalize(); uu.crossVectors(rt, fw).normalize();
      const at = (d, x, y) => { V2.copy(pos).addScaledVector(fw, d).addScaledVector(rt, x).addScaledVector(uu, y); return P(V2.x, V2.y, V2.z); };
      const d = 1.25 * k, hw = .74 * k, hh = .42 * k, apex = P(pos.x, pos.y, pos.z);
      if (k <= 0) return apex;
      const C = [at(d, -hw, -hh), at(d, hw, -hh), at(d, hw, hh), at(d, -hw, hh)];
      if (frac > 0) {
        const far = dist * .74 * frac, fk = far / 1.25;
        const F = [at(far, -.74 * fk, -.42 * fk), at(far, .74 * fk, -.42 * fk), at(far, .74 * fk, .42 * fk), at(far, -.74 * fk, .42 * fk)];
        c.beginPath(); C.forEach((p, i) => seg(c, p, F[i])); c.setLineDash([4, 7]); c.strokeStyle = rgba('#eef1f6', .26 * k); c.lineWidth = 1; c.stroke(); c.setLineDash([]);
        c.beginPath(); F.forEach((p, i) => seg(c, p, F[(i + 1) % 4])); c.strokeStyle = rgba('#eef1f6', .16 * k); c.stroke();
      }
      c.beginPath(); C.forEach(p => seg(c, apex, p)); C.forEach((p, i) => seg(c, p, C[(i + 1) % 4]));
      glowStroke(c, hot ? '#f5a623' : '#eef1f6', .95 * clamp(k * 2), 1.8);
      poly(c, [at(d, -hw * .55, hh * 1.15), at(d, 0, hh * 1.95), at(d, hw * .55, hh * 1.15)]); c.closePath();
      c.fillStyle = rgba('#f5a623', .95 * clamp(k * 2)); c.fill();
      c.beginPath(); c.arc(apex[0], apex[1], 4.5, 0, Math.PI * 2); c.fillStyle = '#eef1f6'; c.fill();
      return apex;
    }

    const camNow = new THREE.Vector3(), anchors = [];
    return lt => {
      const sw = swK(lt), fk = frameK(lt);
      /* ---- framing: right under the statement, then centred ---- */
      bx = lerp(BOX_A[0], BOX_B[0], fk) - BW / 2; by = lerp(BOX_A[1], BOX_B[1], fk) - BH / 2;
      view.canvas.style.left = bx + 'px'; view.canvas.style.top = by + 'px';
      const az = lerp(-.34, -.2, fk) + ease.sine(clamp(lt / ctx.dur)) * .3, elv = .37, D = lerp(29, 23.6, fk);
      cam.position.set(TGT.x + D * Math.cos(elv) * Math.sin(az), TGT.y + D * Math.sin(elv), TGT.z + D * Math.cos(elv) * Math.cos(az));
      cam.aspect = BW / BH; cam.updateProjectionMatrix(); cam.lookAt(TGT); cam.updateMatrixWorld();

      /* ---- product ---- */
      const rise = ease.out(prog(lt, -.45, 1.7));
      const spinT = ease.inOut(prog(lt, TN[3] + .05, 1.7)) * Math.PI * 2;      // one turntable revolution on "animation"
      const turn = -.42 + Math.sin(lt * .55) * .22 + spinT;
      spin.position.y = WY - (1 - rise) * 1.6; spin.rotation.y = turn;
      ticks.rotation.y = turn; plate.rotation.y = turn;
      paintWatch(watch, 'gold', 'silver', sw);
      setTime(watch, 30 + lt * 8 + sw * sw * 900);                                // Hands_Sweep after the switch
      const matK = Math.max(0, 1 - Math.abs(lt - TN[2] - .35) / .5);             // materials sheen
      glowPart(watch, 'case', matK * .45);
      const worldK = ease.out(prog(lt, TN[1], 1.2));
      scene.environmentIntensity = lerp(.75, 1.15, worldK) - matK * .1;
      LI.key.intensity = 1.35 + matK * 1.5; LI.key.position.set(-4 + matK * 9, 8, 6);
      LI.key.color.set(sw > .5 ? '#ffe0bd' : '#ffffff');
      LI.rimW.intensity = 26 + sw * 60; LI.rimC.intensity = 42 - sw * 22;
      const stageOn = ease.out(prog(lt, ctx.line(0) - .1, .9));
      rimMat.color.set('#f5a623').multiplyScalar(.35 + stageOn * .9 + Math.sin(lt * 3) * .05);
      tickMat.opacity = .25 + stageOn * .6;
      view.draw(scene, cam);
      scene.updateMatrixWorld();
      const base = P(0, 0, 0);
      beam.style.transform = `translate(${base[0] - 180}px,${base[1] - 420}px)`; beam.style.opacity = .35 + stageOn * .65;

      /* ---- wireframes: behind (bg) and in front of (fg) the product ---- */
      bg.clearRect(0, 0, 1920, 1080); fg.clearRect(0, 0, 1920, 1080);
      drawGrid(.55 + stageOn * .45);
      const rk = ease.inOut(prog(lt, ctx.line(0) - .1, 1.3));
      if (rk > 0) {
        poly(bg, ring(3.05, 0, Math.PI, Math.PI + rk * Math.PI * 2)); glowStroke(bg, '#6aa6ea', .7, 1.4);
        poly(bg, ring(3.9, 0, 0, rk * Math.PI * 2)); bg.setLineDash([3, 9]); bg.strokeStyle = rgba('#6aa6ea', .55); bg.lineWidth = 1.5; bg.stroke(); bg.setLineDash([]);
        bg.beginPath();
        for (let i = 0; i < 36 * rk; i++) { const a = i / 36 * Math.PI * 2 + turn * .25, r1 = i % 3 ? 4.75 : 5.0; seg(bg, P(Math.sin(a) * 4.55, 0, Math.cos(a) * 4.55), P(Math.sin(a) * r1, 0, Math.cos(a) * r1)); }
        bg.strokeStyle = rgba('#6aa6ea', .5); bg.lineWidth = 1.5; bg.stroke();
      }
      // world: dome + sun (sun sinks and warms for the second shot)
      const domeK = prog(lt, TN[1] - .02, 1.1);
      drawDome(domeK, sw);
      const sunW = dp(lerp(.9, 1.12, sw), lerp(.72, .44, sw)), sun = P(...sunW);
      anchors[1] = sun;
      if (domeK > 0) {
        const sk = ease.back(prog(lt, TN[1] + .15, .6)), scol = sw > .5 ? '#f5a623' : '#fff3dc';
        const g = bg.createRadialGradient(sun[0], sun[1], 0, sun[0], sun[1], 90 * sk + .1);
        g.addColorStop(0, rgba(scol, .85)); g.addColorStop(.25, rgba(sw > .5 ? '#e87d0d' : '#6aa6ea', .3)); g.addColorStop(1, rgba('#3a7bc8', 0));
        bg.fillStyle = g; bg.beginPath(); bg.arc(sun[0], sun[1], 90 * sk + .1, 0, Math.PI * 2); bg.fill();
        bg.beginPath(); bg.arc(sun[0], sun[1], 13 * sk + .1, 0, Math.PI * 2); bg.fillStyle = scol; bg.fill();
        bg.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + lt * .4; seg(bg, [sun[0] + Math.cos(a) * 22 * sk, sun[1] + Math.sin(a) * 22 * sk], [sun[0] + Math.cos(a) * 31 * sk, sun[1] + Math.sin(a) * 31 * sk]); }
        bg.strokeStyle = rgba(scol, .9); bg.lineWidth = 2.5; bg.lineCap = 'round'; bg.stroke(); bg.lineCap = 'butt';
      }
      // animation: motion path around the product, split behind / in front of it
      const pathK = ease.inOut(prog(lt, TN[3] - .02, .9)), py = spin.position.y - .35, wd = depth(0, spin.position.y, 0);
      const KEYA = [-1.1, .45, 2.0, 3.6];
      anchors[3] = P(Math.sin(KEYA[0]) * ORB, py, Math.cos(KEYA[0]) * ORB);
      if (pathK > 0) {
        const n = 90, a0 = -Math.PI * .35;
        for (let i = 0; i < n * pathK; i += 2) {
          const a = a0 + i / n * Math.PI * 2, b = a0 + (i + 1) / n * Math.PI * 2, pa = [Math.sin(a) * ORB, py, Math.cos(a) * ORB];
          const c = depth(...pa) > wd ? bg : fg;
          c.beginPath(); seg(c, P(...pa), P(Math.sin(b) * ORB, py, Math.cos(b) * ORB)); c.strokeStyle = rgba('#eef1f6', .75 - sw * .4); c.lineWidth = 2; c.stroke();
        }
        KEYA.forEach((a, j) => {
          const kk = ease.back(prog(lt, TN[3] + .15 + j * .1, .45)); if (kk <= 0) return;
          const q = [Math.sin(a) * ORB, py, Math.cos(a) * ORB], c = depth(...q) > wd ? bg : fg, p = P(...q), s = 8 * kk;
          c.beginPath(); c.moveTo(p[0], p[1] - s); c.lineTo(p[0] + s, p[1]); c.lineTo(p[0], p[1] + s); c.lineTo(p[0] - s, p[1]); c.closePath();
          c.fillStyle = '#f5a623'; c.fill(); c.strokeStyle = '#0a0a0c'; c.lineWidth = 1.5; c.stroke();
        });
        const ph = KEYA[0] + spinT, q = [Math.sin(ph) * ORB, py, Math.cos(ph) * ORB], c = depth(...q) > wd ? bg : fg, p = P(...q);
        c.beginPath(); c.arc(p[0], p[1], 6, 0, Math.PI * 2); c.fillStyle = '#ffffff'; c.fill();
      }
      // camera gizmo (flies to the close-up position on the switch)
      const gk = ease.back(prog(lt, TN[0] - .02, .55));
      camNow.copy(SHOT_CAM[0]).lerp(SHOT_CAM[1], sw); camNow.y += Math.sin(sw * Math.PI) * 1.2;
      const hot = Math.max(0, 1 - Math.abs(lt - TN[0] - .3) / .5) + Math.max(0, 1 - Math.abs(lt - TSW - .4) / .5);
      anchors[0] = drawGizmo(fg, camNow, gk, hot > .3, ease.inOut(prog(lt, TN[0] + .15, .7)));
      // materials: the right-most point of the case rim, so the link never crosses the product
      let best = null;
      for (let j = 0; j < 24; j++) { const a = j / 24 * Math.PI * 2; V2.set(Math.cos(a) * 2.02, .05, Math.sin(a) * 2.02); watch.localToWorld(V2); const p = P(V2.x, V2.y, V2.z); if (!best || p[0] > best[0]) best = p; }
      anchors[2] = best;

      /* ---- render frame: 16:9 around the watch head, 1:1 for the close-up ---- */
      const hc = P(0, spin.position.y + .15, 0);
      const fwid = lerp(560, 330, sw), fhei = lerp(315, 330, sw), rkF = ease.expo(prog(lt, TN[4] - .02, .5));
      frameG.style.opacity = clamp(rkF * 2);
      const ex = (1 - rkF) * 40, cl = 34;
      const X0 = hc[0] - fwid / 2 - ex, Y0 = hc[1] - fhei / 2 - ex, X1 = hc[0] + fwid / 2 + ex, Y1 = hc[1] + fhei / 2 + ex;
      corners[0].setAttribute('d', `M${X0} ${Y0 + cl}V${Y0}H${X0 + cl}`); corners[1].setAttribute('d', `M${X1 - cl} ${Y0}H${X1}V${Y0 + cl}`);
      corners[2].setAttribute('d', `M${X1} ${Y1 - cl}V${Y1}H${X1 - cl}`); corners[3].setAttribute('d', `M${X0 + cl} ${Y1}H${X0}V${Y1 - cl}`);
      frRect.setAttribute('x', X0); frRect.setAttribute('y', Y0); frRect.setAttribute('width', X1 - X0); frRect.setAttribute('height', Y1 - Y0);
      anchors[4] = [X1, Y1];
      const sc = prog(lt, TN[4] + .08, .7);
      scanClip.style.left = X0 + 'px'; scanClip.style.top = Y0 + 'px'; scanClip.style.width = (X1 - X0) + 'px'; scanClip.style.height = (Y1 - Y0) + 'px';
      scanClip.style.opacity = sc > 0 && sc < 1 ? 1 : 0; scan.style.top = (ease.inOut(sc) * (Y1 - Y0 + 120) - 120) + 'px';

      /* ---- statement ---- */
      const ho = ease.inOut(prog(lt, tOut, .5));
      head.style.opacity = 1 - ho; head.style.transform = `translateY(${-ho * 50}px)`;
      kick.style.opacity = ease.out(prog(lt, ctx.line(0) - .3, .5));
      revealMasks(hl1, lt, ctx.line(0) - .15, .08, .8); revealMasks(hl2, lt, ctx.line(0) + .1, .08, .8);

      /* ---- node cards + connectors ---- */
      NODES.forEach((n, i) => {
        const cd = cards[i], t = TN[i], k = prog(lt, t, .5), kb = ease.back(k);
        const fl = float(lt, 4, .9, i * 1.3);
        cd.c.style.opacity = clamp(k * 3);
        cd.c.style.transform = `translate(${(1 - kb) * (n.side === 'L' ? -40 : 40)}px,${fl}px) scale(${lerp(.7, 1, kb)})`;
        const hotN = lt >= t ? Math.exp(-(lt - t) * 2.2) : 0, hs = Math.max(hotN, Math.max(0, 1 - Math.abs(lt - TSW - .35 - i * .07) / .45));
        cd.glass.style.boxShadow = `0 40px 90px rgba(0,0,0,.5),0 0 ${hs * 40}px rgba(245,166,35,${hs * .55})`;
        cd.glass.style.borderColor = `rgba(245,166,35,${hs * .8})`;
        cd.ic.style.borderColor = hs > .05 ? `rgba(245,166,35,${.3 + hs * .7})` : 'rgba(255,255,255,.14)';
        const C = conns[i], a = anchors[i];
        if (!a || lt < t) { C.g.style.opacity = 0; return; }
        C.g.style.opacity = 1;
        const sx = n.side === 'L' ? n.x + CW + 8 : n.x - 8, sy = n.y + CH / 2 + fl, dx = a[0] - sx;
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
      const swk = ease.inOut(prog(lt, TSW + .34, .4));
      swatches.forEach((s, j) => { s.style.background = `color-mix(in srgb, ${SWB[j]} ${Math.round(swk * 100)}%, ${SWA[j]})`; });

      /* ---- shot switch + cursor ---- */
      const pk = ease.back(prog(lt, TSW - 1.3, .55));
      pill.style.opacity = clamp(prog(lt, TSW - 1.3, .55) * 3); pill.style.transform = `translateY(${(1 - pk) * 30}px) scale(${lerp(.85, 1, pk)})`;
      thumb.style.left = lerp(segX[0][0], segX[1][0], sw) + 'px'; thumb.style.width = lerp(segX[0][1], segX[1][1], sw) + 'px';
      cursor.update(lt);
    };
  },
});
