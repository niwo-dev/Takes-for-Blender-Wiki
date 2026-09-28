// Actions: every view layer wears its own action. Switching layers swaps the motion on the objects,
// unkeyed objects go home to the Rest State, and a Pinned object keeps its own action in every shot.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, headline, panel, Cursor, pop, slide, fade, canvas3d, drawOn } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const COL = { spin: '#3a7bc8', float: '#e0569a', rest: '#2fc4b2', pin: '#f5a623' };
const LAYERS = [
  { name: 'Front 3/4', act: 'Hero_Spin', kind: 'spin' },
  { name: 'Top Down', act: 'Float_Loop', kind: 'float' },
  { name: 'Detail', act: null, kind: 'rest' },
];
const TAU = Math.PI * 2;

// stage geometry
const CV = { x: 20, y: 0, w: 1060, h: 1080 };          // 3D canvas (left stage)
const PX = 1110, PY = 392, PW = 690, PH = 584, HEAD = 54;
const LR = i => 40 + i * 104, LH = 94;                 // layer rows (panel-body coords)
const OR = j => 398 + j * 62, OH = 54;                 // object rows
const TW = 578;                                        // mini timeline width

const COIN_SVG = (c, s = 24) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" style="display:block;flex:none"><circle cx="12" cy="12" r="9"/><path d="M8.3 8.6h7.4M12 8.6v7.6"/></svg>`;

// ---- motion (pure functions of time) ----
const REST_W = { x: 0, y: 0, rx: 0, ry: -0.42, rz: 0 };
const SPIN = 1.7;                                      // rad/s for Hero_Spin
const floatW = t => ({ x: 0, y: .3 + Math.sin(t * 2.3) * .5, rx: Math.sin(t * 2.3 + 1.1) * .2 - .06, ry: REST_W.ry + .25 + Math.sin(t * 1.15) * .42, rz: Math.sin(t * 1.6) * .1 });
const floatC = t => ({ y: Math.sin(t * 2.3 + 1.9) * .32, rx: Math.sin(t * 2.3 + 2.8) * .25, ry: .3 + Math.sin(t * 1.15 + 1) * .45 });
const mix = (a, b, k) => { const o = {}; for (const key in b) o[key] = lerp(a[key] ?? b[key], b[key], k); return o; };

function createCoin() {
  const g = new THREE.Group();
  const polish = new THREE.MeshStandardMaterial({ color: '#f0a43c', metalness: 1, roughness: .22 });
  const satin = new THREE.MeshStandardMaterial({ color: '#c9731a', metalness: 1, roughness: .5 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .16, 72), [polish, satin, satin]);
  disc.rotation.x = Math.PI / 2; g.add(disc);
  g.add(new THREE.Mesh(new THREE.TorusGeometry(1, .075, 12, 72), polish));
  for (const s of [1, -1]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.74, .035, 8, 64), polish); ring.position.z = s * .085; g.add(ring);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(.78, .15, .06), polish); bar.position.set(0, .2, s * .09); g.add(bar);
    const stem = new THREE.Mesh(new THREE.BoxGeometry(.15, .6, .06), polish); stem.position.set(0, -.12, s * .09); g.add(stem);
  }
  return g;
}

// engraved caseback so the Hero_Spin shows a finished back
function addCaseback(watch) {
  const steel = new THREE.MeshStandardMaterial({ color: '#c3cad6', metalness: 1, roughness: .38 });
  const dark = new THREE.MeshStandardMaterial({ color: '#8d96a6', metalness: 1, roughness: .5 });
  const back = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.56, .08, 72), steel); back.position.y = -.36; watch.add(back);
  for (const [r, w] of [[1.28, .03], [.98, .02], [.5, .025]]) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(r, w, 6, 72), dark); t.rotation.x = Math.PI / 2; t.position.y = -.405; watch.add(t);
  }
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU, s = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .05, 16), dark);
    s.position.set(Math.cos(a) * 1.13, -.41, Math.sin(a) * 1.13); watch.add(s);
  }
}

// teal hologram of the watch (edges + faint additive fill), built from the watch's own meshes
function createGhost(src, color) {
  const inner = new THREE.Group();
  const line = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
  const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  for (const ch of src.children) {
    if (!ch.isMesh || ch.material === src.userData.M.glass) continue;
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(ch.geometry, 28), line);
    const f = new THREE.Mesh(ch.geometry, fill);
    for (const m of [e, f]) { m.position.copy(ch.position); m.rotation.copy(ch.rotation); m.scale.copy(ch.scale); inner.add(m); }
  }
  inner.scale.setScalar(1.025);
  return { inner, line, fill };
}

defineScene({
  id: 's09_actions',
  transitionIn: 'pushUp',
  camera: { zoom: .03 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .28, part: .8, ax: .25, ay: .45, bx: .8, by: .8, glow: 1.1 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    // timing: layer switches (cursor clicks) and the pin
    const tA = L(1) + .3, tB = L(1) + 2.2, tC = L(2) + .25, tD = L(3) + .4, tE = L(3) + 1.75, tF = L(3) + 3.3;
    const SW = [[-99, 0], [tA, 1], [tB, 0], [tC, 2], [tE, 0], [tF, 1]];
    const swIdx = lt => { let k = 0; for (let i = 1; i < SW.length; i++) if (lt >= SW[i][0]) k = i; return k; };
    const kindAt = k => LAYERS[SW[k][1]].kind;
    const tLand = tC + .8;

    // settled pose of schedule entry k; a spin picks up from wherever the object was when it started
    function wPoseK(k, t) {
      const kind = kindAt(k);
      if (kind === 'spin') { const ts = k ? SW[k][0] : .3, a0 = k ? wPoseK(k - 1, ts).ry : REST_W.ry; return { x: 0, y: .3, rx: -.22, ry: a0 + SPIN * (t - ts), rz: .05 }; }
      return kind === 'float' ? floatW(t) : { ...REST_W };
    }
    function cPoseK(k, t) {
      const kind = kindAt(k);
      if (kind === 'spin') { const ts = k ? SW[k][0] : .3, a0 = k ? cPoseK(k - 1, ts).ry : .9; return { y: 0, rx: 0, ry: a0 + SPIN * (t - ts) }; }
      return kind === 'float' ? floatC(t) : { y: 0, rx: 0, ry: 0 };
    }
    function blended(fn, lt) {
      const k = swIdx(lt), cur = fn(k, lt);
      if (!k) return cur;
      const ts = SW[k][0], toRest = kindAt(k) === 'rest', p = prog(lt, ts, toRest ? .8 : .8);
      if (p >= 1) return cur;
      const from = fn(k - 1, lt);
      from.ry -= TAU * Math.round((fn(k - 1, ts).ry - fn(k, ts).ry) / TAU);
      return mix(from, cur, toRest ? ease.back(p) : ease.inOut(p));
    }

    // ---------- backdrop halos (colour of the action the watch wears) ----------
    const halos = ['spin', 'float', 'rest'].map(k => {
      const h = el(`<div class="abs" style="left:0;top:0;width:1040px;height:1040px;border-radius:50%;background:radial-gradient(closest-side,${COL[k]}55,${COL[k]}18 55%,transparent);opacity:0"></div>`);
      root.appendChild(h); return h;
    });
    const coinHalo = el(`<div class="abs" style="left:0;top:0;width:460px;height:460px;border-radius:50%;background:radial-gradient(closest-side,rgba(245,166,35,.42),rgba(245,166,35,.1) 60%,transparent);opacity:0"></div>`);
    root.appendChild(coinHalo);

    // ---------- 3D ----------
    const scene = R3D.scene({ key: 1.5 });
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const wPivot = new THREE.Group(); wPivot.add(watch); scene.add(wPivot);
    paintWatch(watch, 'silver');
    const ghost = createGhost(watch, COL.rest);
    addCaseback(watch);
    ghost.inner.rotation.x = Math.PI / 2;
    const gPivot = new THREE.Group(); gPivot.add(ghost.inner); scene.add(gPivot);
    gPivot.rotation.set(REST_W.rx, REST_W.ry, REST_W.rz);
    const coin = createCoin(); coin.scale.setScalar(.72);
    const cPivot = new THREE.Group(); cPivot.add(coin); scene.add(cPivot);
    const COIN_P = new THREE.Vector3(3.15, 2.2, -.6);
    // Hero_Spin motion ring: a thin glowing orbit with a travelling marker
    const orbitMat = new THREE.MeshBasicMaterial({ color: COL.spin, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const orbit = new THREE.Group();
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(3.1, .014, 6, 160), orbitMat); orbitRing.rotation.x = Math.PI / 2; orbit.add(orbitRing);
    const orbitDot = new THREE.Mesh(new THREE.SphereGeometry(.09, 16, 12), orbitMat); orbit.add(orbitDot);
    scene.add(orbit);
    const cam = R3D.camera(30);
    const view = canvas3d(root, { ...CV, style: '-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 190px,#000 850px,transparent 1060px)' });

    // shockwave rings (DOM) for the snap home and the pin
    const ring = (c) => { const r = el(`<div class="abs" style="border-radius:50%;border:3px solid ${c};opacity:0;pointer-events:none"></div>`); root.appendChild(r); return r; };
    const homeRing = ring(COL.rest), pinRing = ring(COL.pin);

    // ---------- headline (right column) ----------
    const H = headline(root, { x: PX, y: 118, w: PW, kicker: 'Actions', lines: ['EVERY SHOT.', { t: 'ITS OWN MOVE.', grad: true }], size: 88 });

    // ---------- panel: view layers + objects ----------
    const P = panel(root, { x: PX, y: PY, w: PW, h: PH, title: 'View Layers &nbsp;·&nbsp; Actions', icon: 'action' });
    const secLbl = (txt, y) => { const d = el(`<div class="abs mono" style="left:20px;top:${y}px;font-size:15px;letter-spacing:.18em;color:#6b7385">${txt}</div>`); P.body.appendChild(d); return d; };
    const sec1 = secLbl('VIEW LAYERS', 12), sec2 = secLbl('OBJECTS', OR(0) - 30);
    const selBox = el(`<div class="abs" style="left:18px;right:18px;height:${LH}px;border-radius:8px;background:rgba(58,123,200,.30);box-shadow:inset 0 0 0 1px rgba(120,170,230,.45),0 0 30px rgba(58,123,200,.25)"></div>`);
    P.body.appendChild(selBox);

    const CURVE = {
      spin: { d: 'M10 24 C100 24 190 15 289 15 S478 6 568 6', k: [[10, 24], [289, 15], [568, 6]] },
      float: { d: 'M10 22 C70 22 90 8 149.5 8 S229 22 289 22 S369 8 428.5 8 S508 22 568 22', k: [[10, 22], [149.5, 8], [289, 22], [428.5, 8], [568, 22]] },
    };
    const rows = LAYERS.map((Ly, i) => {
      const c = COL[Ly.kind], cv = CURVE[Ly.kind];
      const chipHtml = Ly.act
        ? `<div class="chip" style="font-size:19px;padding:5px 12px;gap:8px;border-color:${c};color:${c};background:rgba(10,10,12,.45)">${icon('action', 20, c)}${Ly.act}</div>`
        : `<div class="chip" style="font-size:19px;padding:5px 12px;border-style:dashed;border-color:#6b7385;color:#9aa3b5;background:rgba(10,10,12,.45)">no keys</div>`;
      const svg = `<svg class="abs" width="${TW}" height="30" style="left:60px;top:54px;overflow:visible">
        <rect x="0" y="0" width="${TW}" height="30" rx="5" fill="rgba(255,255,255,.035)"/>
        <path d="${[...Array(13)].map((_, j) => `M${10 + j * 46.5} 26v4`).join('')}" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>
        ${cv ? `<path class="crv" d="${cv.d}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
          ${cv.k.map(([x, y]) => `<rect class="kd" x="${x - 5.5}" y="${y - 5.5}" width="11" height="11" fill="${c}" stroke="#0a0a0c" stroke-width="1.5" transform="rotate(45 ${x} ${y})" style="transform-box:fill-box;transform-origin:center"/>`).join('')}`
          : `<path class="crv" d="M10 15 L568 15" fill="none" stroke="#6b7385" stroke-width="2" stroke-dasharray="6 7"/>`}
        <line class="ph" x1="0" y1="-5" x2="0" y2="35" stroke="#f5a623" stroke-width="2.5" opacity="0"/></svg>`;
      const r = el(`<div class="abs" style="left:18px;right:18px;top:${LR(i)}px;height:${LH}px;border-radius:8px;background:rgba(10,10,14,.42);border:1px solid rgba(255,255,255,.06)">
        <div class="abs" style="left:12px;top:10px;width:36px;height:36px;border-radius:50%;background:#16161b;border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center">${icon('layer', 20, '#c9d1de')}</div>
        <div class="abs disp6" style="left:60px;top:11px;font-size:26px;white-space:nowrap">${Ly.name}</div>
        <div class="abs achip" style="right:14px;top:8px">${chipHtml}</div>${svg}</div>`);
      P.body.appendChild(r);
      return { r, chip: r.querySelector('.achip'), crv: r.querySelector('.crv'), kd: [...r.querySelectorAll('.kd')], ph: r.querySelector('.ph'), dot: r.firstElementChild };
    });

    const objRow = (j, ic, name, right) => {
      const r = el(`<div class="abs" style="left:18px;right:18px;top:${OR(j)}px;height:${OH}px;border-radius:8px;background:rgba(10,10,14,.42);border:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:14px;padding:0 12px 0 16px">
        ${ic}<div class="disp6" style="font-size:24px;white-space:nowrap">${name}</div><div style="margin-left:auto;display:flex;align-items:center;gap:10px">${right}</div></div>`);
      P.body.appendChild(r); return r;
    };
    const pillM = `<div class="pill" style="font-size:16px;padding:5px 12px;border-color:rgba(58,123,200,.6);color:#8fb6e6">Managed</div>`;
    const oWatch = objRow(0, icon('clock', 24, '#c9d1de'), 'Watch', pillM);
    const oLogo = objRow(1, COIN_SVG('#c9d1de'), 'Logo', `
      <div class="lspin chip" style="font-size:17px;padding:3px 10px;gap:6px;border-color:${COL.pin};color:${COL.pin};background:rgba(10,10,12,.45);opacity:0">${icon('action', 18, COL.pin)}Logo_Spin</div>
      <div class="pinbtn" style="width:40px;height:40px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center">${icon('pin', 22, '#9aa3b5')}</div>
      <div class="pstack" style="position:relative;width:150px;height:34px">
        <div class="pill pm" style="position:absolute;right:0;top:0;font-size:16px;padding:5px 12px;border-color:rgba(58,123,200,.6);color:#8fb6e6">Managed</div>
        <div class="pill pp" style="position:absolute;right:0;top:0;font-size:16px;padding:5px 12px;border-color:${COL.pin};background:${COL.pin};color:#0a0a0c;display:flex;gap:6px;align-items:center;opacity:0">${icon('pin', 16, '#0a0a0c', 2.4)}Pinned</div></div>`);
    const lspin = oLogo.querySelector('.lspin'), pinBtn = oLogo.querySelector('.pinbtn'), pinBtnIco = pinBtn.querySelector('svg');
    const pm = oLogo.querySelector('.pm'), pp = oLogo.querySelector('.pp');

    // ---------- 3D-anchored labels ----------
    const mkChip = (name, c, ic) => `<div class="chip" style="position:absolute;left:0;top:0;font-size:20px;padding:6px 14px;gap:9px;border-color:${c};color:${c};background:rgba(10,10,14,.72)">${ic}${name}</div>`;
    const ACTS = { Hero_Spin: [COL.spin, icon('action', 20, COL.spin)], Float_Loop: [COL.float, icon('action', 20, COL.float)],
      'Rest State': [COL.rest, icon('target', 20, COL.rest)], Logo_Spin: [COL.pin, icon('action', 20, COL.pin)] };
    function swapper(host, names) {
      const box = el(`<div class="abs" style="left:0;top:34px;width:320px;height:46px;overflow:hidden"></div>`);
      const items = {};
      for (const n of names) { const d = el(mkChip(n, ...ACTS[n])); box.appendChild(d); items[n] = d; }
      host.appendChild(box);
      return (lt, sched) => {
        let k = 0; for (let i = 1; i < sched.length; i++) if (lt >= sched[i][0]) k = i;
        const q = k ? ease.out(prog(lt, sched[k][0], .38)) : 1;
        for (const n of names) items[n].style.opacity = 0;
        const cur = items[sched[k][1]]; cur.style.opacity = q; cur.style.transform = `translateY(${(1 - q) * 30}px)`;
        if (k && q < 1) { const pv = items[sched[k - 1][1]]; if (pv !== cur) { pv.style.opacity = 1 - q; pv.style.transform = `translateY(${-q * 30}px)`; } }
      };
    }
    const capHtml = (ic, name, st) => `<div class="mono" style="display:flex;gap:10px;align-items:center;font-size:16px;letter-spacing:.16em;color:#c9d1de;white-space:nowrap">${ic}${name}<span style="color:#6b7385">·</span>${st}</div>`;
    const wLbl = el(`<div class="abs" style="left:118px;top:872px;width:330px;height:84px"></div>`);
    wLbl.appendChild(el(capHtml(icon('clock', 20, '#9aa3b5'), 'WATCH', '<span style="color:#8fb6e6">MANAGED</span>')));
    root.appendChild(wLbl);
    const wSwap = swapper(wLbl, ['Hero_Spin', 'Float_Loop', 'Rest State']);
    const W_SCHED = [[-99, 'Hero_Spin'], [tA, 'Float_Loop'], [tB, 'Hero_Spin'], [tC, 'Rest State'], [tE, 'Hero_Spin'], [tF, 'Float_Loop']];

    const cLbl = el(`<div class="abs" style="left:0;top:0;width:300px;height:84px"></div>`);
    const cCap = el(`<div style="position:relative;height:26px"></div>`);
    const capM = el(`<div class="abs" style="left:0;top:0">${capHtml(COIN_SVG('#9aa3b5', 20), 'LOGO', '<span style="color:#8fb6e6">MANAGED</span>')}</div>`);
    const capP = el(`<div class="abs" style="left:0;top:0;opacity:0">${capHtml(COIN_SVG(COL.pin, 20), 'LOGO', `<span style="color:${COL.pin};display:flex;gap:6px;align-items:center">${icon('pin', 18, COL.pin, 2.4)}PINNED</span>`)}</div>`);
    cCap.appendChild(capM); cCap.appendChild(capP); cLbl.appendChild(cCap);
    root.appendChild(cLbl);
    const cSwap = swapper(cLbl, ['Hero_Spin', 'Float_Loop', 'Rest State', 'Logo_Spin']);
    const C_SCHED = [[-99, 'Hero_Spin'], [tA, 'Float_Loop'], [tB, 'Hero_Spin'], [tC, 'Rest State'], [tD, 'Logo_Spin']];
    // pin badge that lands on the coin
    const badge = el(`<div class="abs" style="left:0;top:0;width:46px;height:46px;border-radius:50%;background:${COL.pin};display:flex;align-items:center;justify-content:center;box-shadow:0 0 24px rgba(245,166,35,.7),0 6px 14px rgba(0,0,0,.5);opacity:0">${icon('pin', 26, '#0a0a0c', 2.4)}</div>`);
    root.appendChild(badge);

    // rest label with a leader line to the ghost
    const restLbl = el(`<div class="abs" style="left:112px;top:190px;opacity:0">
      <div class="chip" style="font-size:19px;padding:6px 14px;gap:9px;border-color:${COL.rest};color:${COL.rest};background:rgba(10,10,14,.72)">${icon('target', 20, COL.rest)}REST STATE · frame 0</div></div>`);
    root.appendChild(restLbl);
    const restSvg = el(`<svg class="abs" width="10" height="10" style="left:0;top:0;overflow:visible;opacity:0"><path fill="none" stroke="${COL.rest}" stroke-width="2" stroke-dasharray="4 5"/><circle r="5" fill="${COL.rest}"/></svg>`);
    root.appendChild(restSvg);
    const restPath = restSvg.querySelector('path'), restDot = restSvg.querySelector('circle');

    // ---------- cursor ----------
    const LX = PX + 18 + 240, rowY = i => PY + HEAD + LR(i) + 30;
    const pinX = PX + PW - 18 - 12 - 150 - 10 - 20, pinY = PY + HEAD + OR(1) + OH / 2;
    const cursor = new Cursor(root, ctx, [
      { t: tA - 1.2, x: 1500, y: 1070 }, { t: tA, x: LX, y: rowY(1), click: true },
      { t: tB, x: LX - 30, y: rowY(0), click: true },
      { t: tC, x: LX, y: rowY(2), click: true },
      { t: tC + 1.4, x: LX + 150, y: rowY(2) + 120 }, { t: tD - .9, x: pinX + 60, y: pinY + 60 },
      { t: tD, x: pinX, y: pinY, click: true },
      { t: tE, x: LX + 20, y: rowY(0), click: true },
      { t: tF, x: LX, y: rowY(1), click: true },
      { t: tF + 1.1, x: 1860, y: 1080 }], { hideAt: tF + .85 });

    // ---------- sound ----------
    [0, 1, 2].forEach(i => ctx.cue(L(0) + .1 + i * .16, 'tick', { gain: .55, pitch: i * 3, pan: .5 }));
    ctx.cue(L(0) + .75, 'pop', { gain: .45, pan: -.3 });
    [tA, tB, tE, tF].forEach((t, i) => ctx.cue(t + .04, 'whoosh', { gain: .55, pitch: i % 2 ? 2 : -1, pan: -.3 }));
    ctx.cue(tC + .04, 'swish', { gain: .6, pan: -.3 });
    ctx.cue(tC + .15, 'shimmer', { gain: .4, pan: -.4 });
    ctx.cue(tLand, 'snap', { gain: .8, pan: -.3 });
    ctx.cue(tD + .04, 'pop', { gain: 1, pan: -.1 });
    ctx.cue(tD + .12, 'whoosh', { gain: .35, pitch: 5, pan: -.1 });

    const v3 = new THREE.Vector3();
    const toStage = v => { v.project(cam); return [CV.x + (v.x + 1) / 2 * CV.w, CV.y + (1 - v.y) / 2 * CV.h]; };
    const place = (e, x, y, w, h) => { e.style.left = (x - w / 2) + 'px'; e.style.top = (y - h / 2) + 'px'; e.style.width = w + 'px'; e.style.height = h + 'px'; };
    return lt => {
      // ---- layout reveal ----
      H.update(lt, 0);
      const pk = ease.expo(prog(lt, -.35, .9));
      P.el.style.opacity = clamp((lt + .4) / .35); P.el.style.transform = `translateX(${(1 - pk) * 120}px)`;
      fade(sec1, lt, .1, .4); fade(sec2, lt, .6, .4);
      rows.forEach((r, i) => slide(r.r, lt, -.1 + i * .08, .6, 50, 0));
      [oWatch, oLogo].forEach((r, j) => slide(r, lt, .5 + j * .08, .6, 50, 0));

      // action chips + f-curves arrive on line 0
      rows.forEach((r, i) => {
        const t0 = L(0) + .1 + i * .16;
        pop(r.chip, lt, t0, .45, .6);
        drawOn(r.crv, lt, t0, .7);
        r.kd.forEach((d, j) => { const q = ease.back(prog(lt, t0 + .2 + j * .07, .35)); d.style.opacity = clamp(q * 2); d.style.transform = `scale(${q})`; });
      });

      // ---- active layer ----
      const k = swIdx(lt), li = SW[k][1], prevLi = k ? SW[k - 1][1] : li;
      const sq = k ? ease.inOut(prog(lt, SW[k][0], .35)) : 1;
      selBox.style.top = lerp(LR(prevLi), LR(li), sq) + 'px';
      selBox.style.opacity = clamp((lt - .2) / .4);
      rows.forEach((r, i) => {
        const on = i === li ? sq : i === prevLi ? 1 - sq : 0;
        r.dot.style.borderColor = on > .5 ? '#f5a623' : 'rgba(255,255,255,.12)';
        r.dot.style.boxShadow = on > .5 ? '0 0 16px rgba(245,166,35,.55)' : 'none';
        const Ly = LAYERS[i];
        if (Ly.act) {
          const per = Ly.kind === 'spin' ? TAU / SPIN : 2 * TAU / 2.3;
          const ph = ((lt / per) % 1 + 1) % 1;
          r.ph.setAttribute('x1', 10 + ph * 558); r.ph.setAttribute('x2', 10 + ph * 558);
          r.ph.setAttribute('opacity', on * clamp((lt - L(0) - .6) / .4));
        }
      });

      // ---- watch ----
      const pose = blended(wPoseK, lt);
      const enter = ease.expo(prog(lt, -.4, 1.2));
      wPivot.position.set(pose.x, pose.y - (1 - enter) * 1.5, 0);
      wPivot.rotation.set(pose.rx, pose.ry - (1 - enter) * .8, pose.rz);
      setTime(watch, lt * 6 + 30);

      // ---- coin: Managed (follows the layer) until pinned, then its own action ----
      let cp;
      if (lt < tD) cp = blended(cPoseK, lt);
      else {
        const q = ease.inOut(prog(lt, tD, .7));
        cp = mix(cPoseK(swIdx(lt), lt), { y: 0, rx: 0, ry: 0 }, q);
        cp.ry = (lt - tD) * 3.1 * q;
      }
      cPivot.position.set(COIN_P.x, COIN_P.y + cp.y - (1 - enter) * 1.2, COIN_P.z);
      cPivot.rotation.set(cp.rx, cp.ry, 0);

      // ---- spin orbit (visible while Hero_Spin drives the watch) ----
      const spinW = kindAt(k) === 'spin' ? sq : (k && kindAt(k - 1) === 'spin' ? 1 - sq : 0);
      orbitMat.opacity = spinW * .55 * clamp((lt - .2) / .5);
      orbit.visible = orbitMat.opacity > .01;
      orbit.position.set(0, pose.y - .2, 0); orbit.rotation.set(pose.rx, 0, pose.rz);
      const oa = pose.ry + 1.2; orbitDot.position.set(Math.cos(oa) * 3.1, 0, -Math.sin(oa) * 3.1);

      // ---- rest ghost ----
      const gOn = clamp((lt - tC) / .3) * (1 - clamp((lt - tE) / .45));
      const landed = clamp((lt - tLand) / .6);
      ghost.line.opacity = gOn * (1 - landed * .5 + Math.max(0, 1 - Math.abs(lt - tLand) / .25) * .2);
      ghost.fill.opacity = gOn * (.1 - landed * .05);
      gPivot.visible = gOn > .001;

      // ---- camera ----
      cam.position.set(.7 + Math.sin(lt * .22) * .45, .95, 15.6);
      cam.lookAt(.75, .35, 0);
      view.draw(scene, cam);

      // ---- screen anchors ----
      const [wx, wy] = toStage(v3.set(0, pose.y, 0));
      const [cx, cy] = toStage(v3.copy(COIN_P).setY(COIN_P.y + cp.y));
      const [rx, ry] = toStage(v3.set(-1.62, 1.28, .3).applyAxisAngle(new THREE.Vector3(0, 1, 0), REST_W.ry));

      // ---- halos follow the action colour ----
      const wt = { spin: 0, float: 0, rest: 0 };
      if (k) { wt[kindAt(k)] += sq; wt[kindAt(k - 1)] += 1 - sq; } else wt[kindAt(0)] = 1;
      ['spin', 'float', 'rest'].forEach((kk, i) => { halos[i].style.opacity = wt[kk] * .9 * clamp((lt + .3) / .6); halos[i].style.transform = `translate(${wx - 520}px,${wy - 520}px)`; });
      coinHalo.style.opacity = clamp((lt - tD) / .4) * (.75 + Math.sin(lt * 3) * .12);
      coinHalo.style.transform = `translate(${cx - 230}px,${cy - 230}px)`;

      // ---- rings ----
      const hq = prog(lt, tLand, .8), hs = 300 + ease.out(hq) * 380;
      homeRing.style.opacity = hq > 0 && hq < 1 ? (1 - hq) * .9 : 0; place(homeRing, wx, wy, hs, hs);
      const pq = prog(lt, tD, .7), ps = 110 + ease.out(pq) * 220;
      pinRing.style.opacity = pq > 0 && pq < 1 ? (1 - pq) : 0; place(pinRing, cx, cy, ps, ps);

      // ---- labels ----
      const lblIn = clamp((lt - L(0) - .5) / .4);
      wLbl.style.opacity = lblIn; cLbl.style.opacity = lblIn;
      cLbl.style.left = (cx - 108) + 'px'; cLbl.style.top = (cy + 104) + 'px';
      wSwap(lt, W_SCHED); cSwap(lt, C_SCHED);
      const pinned = clamp((lt - tD) / .25);
      capM.style.opacity = 1 - pinned; capP.style.opacity = pinned;
      pop(badge, lt, tD + .05, .45, .2, -30);
      badge.style.left = (cx + 44) + 'px'; badge.style.top = (cy - 96) + 'px';
      const rq = clamp((lt - tC - .15) / .4) * (1 - clamp((lt - tE) / .4));
      restLbl.style.opacity = rq; restSvg.style.opacity = rq;
      restLbl.style.transform = `translateY(${(1 - ease.out(clamp((lt - tC - .15) / .5))) * 14}px)`;
      restPath.setAttribute('d', `M${232} ${236} L${lerp(232, rx, .45)} ${ry - 18} L${rx} ${ry}`);
      restDot.setAttribute('cx', rx); restDot.setAttribute('cy', ry);

      // ---- pin UI ----
      pm.style.opacity = 1 - pinned; pop(pp, lt, tD, .45, .6);
      lspin.style.opacity = ease.out(prog(lt, tD + .1, .4));
      lspin.style.transform = `translateX(${(1 - ease.expo(prog(lt, tD + .1, .6))) * 20}px)`;
      pinBtn.style.background = pinned > .5 ? 'rgba(245,166,35,.2)' : 'rgba(255,255,255,.04)';
      pinBtn.style.borderColor = pinned > .5 ? COL.pin : 'rgba(255,255,255,.18)';
      pinBtn.style.boxShadow = pinned > .5 ? `0 0 ${10 + Math.max(0, 1 - (lt - tD)) * 20}px rgba(245,166,35,.6)` : 'none';
      pinBtnIco.style.stroke = pinned > .5 ? COL.pin : '#9aa3b5';
      oLogo.style.borderColor = pinned > .5 ? 'rgba(245,166,35,.55)' : 'rgba(255,255,255,.06)';
      // when layers switch after the pin, the pinned label glows: it stays put while the watch changes
      const steady = [tE, tF].reduce((a, t) => Math.max(a, Math.max(0, 1 - Math.abs(lt - t - .25) / .35)), 0);
      capP.style.filter = `drop-shadow(0 0 ${steady * 12}px rgba(245,166,35,.9))`;

      cursor.update(lt);
    };
  },
});
