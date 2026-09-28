// Modes: seven switches at the top of the Takes panel. Still Mode pins the timeline to frame 0,
// Value Lock snaps a nudged value back (Autokey pauses), and every active mode shows as a pill
// in the viewport, readable with the sidebar closed; Shift+Alt+Q opens the same switches as a pie.
// All timing is relative to the VO lines (ctx.line / ctx.lineEnd / ctx.dur).
import { defineScene, el, ease, prog, clamp, lerp, rgba, hex2rgb, R3D, THREE } from '../engine.js';
import { icon, headline, panel, Cursor, keycaps, pop, fade, canvas3d, float } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

/* ---------- local helpers ---------- */
const CUSTOM = {
  home: '<path d="M4 11.5L12 4.5l8 7"/><path d="M6.5 10v10h11V10"/><path d="M10 20v-5h4v5"/>',
  rec: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4" fill="currentColor"/>',
};
const ico = (n, s, c, sw = 2) => CUSTOM[n]
  ? `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="color:${c};flex:none;display:block">${CUSTOM[n]}</svg>`
  : icon(n, s, c, sw);
const hexMix = (a, b, k) => '#' + hex2rgb(a).map((v, i) => Math.round(lerp(v, hex2rgb(b)[i], k)).toString(16).padStart(2, '0')).join('');
const bump = (lt, t, w) => Math.max(0, 1 - Math.abs(lt - t) / w);

const MODES = [
  { id: 'rest', name: 'Rest Mode', ic: 'home', c: '#2fc4b2' },
  { id: 'still', name: 'Still Mode', ic: 'still', c: '#5b9be0', pill: 'STILL' },
  { id: 'lock', name: 'Value Lock', ic: 'lock', c: '#f5a623', pill: 'VALUE LOCK' },
  { id: 'auto', name: 'Autokey', ic: 'rec', c: '#e0569a' },
  { id: 'time', name: 'Timeline', ic: 'timeline', c: '#3a7bc8' },
  { id: 'live', name: 'Variant Live', ic: 'live', c: '#e87d0d' },
  { id: 'diff', name: 'Diff State', ic: 'diff', c: '#9aa3b5' },
];
const MI = id => MODES.findIndex(m => m.id === id);

/* ---------- layout (stage px) ---------- */
const BX = 210, BY = 108, BW = 200, BH = 116, BG = 12, BP = 14, BHEAD = 40;
const BAR_W = BP * 2 + 7 * BW + 6 * BG, BAR_H = BHEAD + 10 + BH + BP;      // 1500 x 180
const BTN_T = BY + BHEAD + 10;                                              // top of the buttons
const btnX = i => BX + BP + i * (BW + BG) + BW / 2;                        // button centre x
const V2 = { x: 880, y: 318, w: 920, h: 632 };      // viewport while the sidebar is open
const V3 = { x: 120, y: 120, w: 1680, h: 830 };     // viewport with the sidebar closed
const VHEAD = 38, CW = 1000, CH = 800;              // viewport header, 3D canvas size
const GZ = [800, 150];                              // light gizmo inside the 3D canvas
const TCR = { x: 120, y: 318, w: 720, h: 262 };     // Timeline card
const LCR = { x: 120, y: 610, w: 720, h: 340 };     // Light card
const PIE = [1345, 520], PRX = 185, PRY = 168, PIW = 214, PIH = 58;
const DIR = { E: 0, SE: 45, S: 90, SW: 135, W: 180, NW: 225, N: 270, NE: 315 };
const PIE_ITEMS = [['rest', 'W'], ['lock', 'E'], ['time', 'S'], ['still', 'N'], ['auto', 'NW'], ['live', 'NE'], ['diff', 'SW']];

defineScene({
  id: 's11_modes',
  transitionIn: 'push',
  camera: { zoom: .025 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .2, part: .8, glow: 1, ax: .12, ay: .3, bx: .85, by: .75 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    /* ---------- timing (all relative to the VO) ---------- */
    const tSweep = L(0) + .25;                // light runs across the seven switches
    const tStill = L(1) - .05;                // click Still Mode
    const tSwap = tStill - .8;                // headline clears, work cards come in
    const tRew = tStill + .08, dRew = .62;    // playhead slides home to frame 0
    const tPin = tRew + dRew;                 // pinned: STILL · F0
    const tLock = L(2) - .08;                 // click Value Lock (Autokey pauses)
    const tGrab = tLock + 1.0, tRel = tGrab + .8;    // drag Power to 1800 W, release -> snaps back
    const tClose = L(3) - .6;                 // sidebar closes, viewport takes the stage
    const tPill = [L(3) + .12, L(3) + .42];   // pills pop in the viewport corner
    const tKeys = L(3) + 1.3, tPress = tKeys + .35, tPie = tPress + .08;
    const tHover = Math.min(tPie + 1.1, ctx.dur - 2);

    /* ---------- sound ---------- */
    ctx.cue(tSweep, 'shimmer', { gain: .55 });
    ctx.cue(tSwap + .05, 'swish', { gain: .45, pan: -.3 });
    ctx.cue(tRew + .02, 'whoosh', { gain: .45, pan: -.2 });
    ctx.cue(tPin, 'thud', { gain: .6 }); ctx.cue(tPin + .04, 'blip', { gain: .6, pitch: 7 });
    ctx.cue(tLock + .1, 'blip', { gain: .55, pitch: -5, pan: .1 });
    ctx.cue(tGrab - .15, 'riser', { gain: .35 });
    ctx.cue(tRel + .01, 'snap', { gain: 1 }); ctx.cue(tRel + .08, 'thud', { gain: .35 });
    ctx.cue(tClose, 'whoosh', { gain: .6 });
    tPill.forEach((t, k) => ctx.cue(t, 'pop', { gain: .8, pitch: k * 3, pan: -.6 }));
    ctx.cue(tPie - .04, 'whoosh', { gain: .55, pan: .3 }); ctx.cue(tPie + .08, 'pop', { gain: .5, pitch: 5, pan: .3 });
    ctx.cue(tHover + .02, 'tick', { gain: .5, pan: .2 });

    /* ---------- headline (phase 1, left column) ---------- */
    const H = headline(root, { x: 120, y: 468, w: 720, kicker: 'Modes', size: 104,
      lines: ['SWITCH ON.', { t: 'SWITCH OFF.', grad: true }] });
    const hSpans = [...H.el.querySelectorAll('.mask>span')];

    /* ---------- viewport (built before the bar so the bar floats above it) ---------- */
    const vp = el(`<div class="abs" style="left:0;top:0;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.1);
      background:radial-gradient(ellipse 70% 60% at 42% 45%,#2a2e37,#16171c 70%,#111215);box-shadow:0 40px 90px rgba(0,0,0,.55)"></div>`);
    root.appendChild(vp);
    vp.appendChild(el(`<div class="abs" style="left:-60%;width:220%;top:52%;height:110%;transform:perspective(520px) rotateX(74deg);transform-origin:50% 0;
      background-image:linear-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,.07) 1.5px,transparent 1.5px);background-size:90px 90px;background-position:center 0;
      -webkit-mask-image:linear-gradient(to bottom,#000 0%,transparent 70%)"><div class="abs" style="left:0;right:0;top:0;height:3px;background:rgba(224,86,154,.4)"></div></div>`));
    const vw = el(`<div class="abs" style="left:0;top:0;width:${CW}px;height:${CH}px;transform-origin:50% 50%"></div>`);
    vp.appendChild(vw);
    vw.appendChild(el(`<div class="abs" style="left:${CW / 2 - 260}px;top:${CH / 2 + 250}px;width:520px;height:70px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent)"></div>`));
    const warm = el(`<div class="abs" style="left:${GZ[0] - 300}px;top:${GZ[1] - 260}px;width:600px;height:600px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,214,150,.55),rgba(245,166,35,.12) 55%,transparent);opacity:0"></div>`);
    vw.appendChild(warm);
    // live phase renders at the on-screen size (72%); the full-size canvas is rendered once, when the viewport grows
    const viewS = canvas3d(vw, { x: 0, y: 0, w: Math.round(CW * .72), h: Math.round(CH * .72), style: `width:${CW}px;height:${CH}px` });
    const viewB = canvas3d(vw, { x: 0, y: 0, w: CW, h: CH });
    const giz = el(`<svg class="abs" width="160" height="160" viewBox="-80 -80 160 160" style="left:${GZ[0] - 80}px;top:${GZ[1] - 80}px;overflow:visible">
      <circle r="11" fill="rgba(255,236,200,.9)"/><circle r="19" fill="none" stroke="rgba(255,236,200,.7)" stroke-width="2.5" stroke-dasharray="4 5"/>
      ${Array.from({ length: 8 }, (_, k) => `<line class="ray" x1="${Math.cos(k * Math.PI / 4) * 26}" y1="${Math.sin(k * Math.PI / 4) * 26}" x2="${Math.cos(k * Math.PI / 4) * 40}" y2="${Math.sin(k * Math.PI / 4) * 40}" stroke="rgba(255,236,200,.75)" stroke-width="3" stroke-linecap="round"/>`).join('')}
      <line x1="0" y1="0" x2="0" y2="120" stroke="rgba(255,236,200,.35)" stroke-width="2" stroke-dasharray="3 6"/></svg>`);
    vw.appendChild(giz);
    const rays = [...giz.querySelectorAll('.ray')];
    vp.appendChild(el(`<div class="abs" style="left:0;right:0;top:0;height:${VHEAD}px;background:rgba(8,8,11,.6);border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px;padding:0 16px">
      ${icon('cube', 18, '#9aa3b5')}<span class="disp6" style="font-size:17px;color:#c9d1de">3D Viewport</span>
      <div style="margin-left:auto;display:flex;gap:8px">${['#6b7385', '#9aa3b5', '#e87d0d', '#6b7385'].map(c => `<i style="display:block;width:14px;height:14px;border-radius:50%;border:2px solid ${c}"></i>`).join('')}</div></div>`));
    const vfr = el(`<div class="abs mono" style="left:20px;top:${VHEAD + 14}px;font-size:18px;color:#c9d1de;white-space:nowrap">(20) Watch</div>`);
    vp.appendChild(vfr);
    vp.appendChild(el(`<svg class="abs" width="96" height="96" viewBox="-48 -48 96 96" style="right:14px;top:${VHEAD + 10}px">
      <circle r="44" fill="rgba(255,255,255,.04)"/>
      <line x1="0" y1="0" x2="30" y2="10" stroke="#e0569a" stroke-width="3"/><line x1="0" y1="0" x2="-14" y2="22" stroke="#2fc4b2" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-32" stroke="#3a7bc8" stroke-width="3"/>
      <circle cx="30" cy="10" r="9" fill="#e0569a"/><circle cx="-14" cy="22" r="9" fill="#2fc4b2"/><circle cx="0" cy="-32" r="9" fill="#3a7bc8"/></svg>`));

    // 3D watch: plays a gentle swing until Still Mode pins it to frame 0 (then the render is cached)
    const scene3 = R3D.scene();
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene3.add(pivot);
    paintWatch(watch, 'gold');
    const cam = R3D.camera(28);
    const vKey = { s: '', b: '' };
    const fAtRew = 112;
    const frameAt = lt => lt < tRew ? (((fAtRew - (tRew - lt) * 24) % 120) + 120) % 120 : lerp(fAtRew, 0, ease.inOut(prog(lt, tRew, dRew)));
    const renderWatch = (f, big) => {
      const key = f.toFixed(2), slot = big ? 'b' : 's';
      if (key === vKey[slot]) return;
      vKey[slot] = key;
      const a = f / 120 * Math.PI * 2;
      pivot.rotation.set(.1 + .08 * Math.sin(a + 1), -.45 + .5 * Math.sin(a), 0);
      pivot.position.set(0, .12 * Math.sin(a * 2), 0);
      setTime(watch, 40 + f / 24 * 6);
      cam.position.set(0, .5, 13.2); cam.lookAt(0, .05, 0);
      (big ? viewB : viewS).draw(scene3, cam);
    };

    /* ---------- mode bar (hero) ---------- */
    const bar = el(`<div class="glass abs" style="left:${BX}px;top:${BY}px;width:${BAR_W}px;height:${BAR_H}px;border-radius:14px">
      <div class="abs" style="left:20px;top:0;height:${BHEAD}px;display:flex;align-items:center;gap:10px">${icon('take', 20, '#9aa3b5')}<span class="disp6" style="font-size:19px;color:#c9d1de">Takes</span></div>
      <div class="abs" style="left:14px;right:14px;top:${BHEAD - 1}px;height:1px;background:rgba(255,255,255,.07)"></div></div>`);
    root.appendChild(bar);
    const sweepC = MODES.map((_, i) => hexMix('#3a7bc8', '#f5a623', i / 6));
    const btns = MODES.map((m, i) => {
      const b = el(`<div class="abs" style="left:${BP + i * (BW + BG)}px;top:${BHEAD + 10}px;width:${BW}px;height:${BH}px;border-radius:10px;background:rgba(12,12,16,.55);border:1px solid rgba(255,255,255,.08);color:#c9d1de">
        <div class="abs" style="left:${BW / 2 - 20}px;top:15px">${ico(m.ic, 40, 'currentColor', 1.8)}</div>
        <div class="abs disp6" style="left:0;right:0;top:64px;text-align:center;font-size:21px;white-space:nowrap">${m.name}</div>
        <div class="led abs" style="left:${BW / 2 - 22}px;top:${BH - 12}px;width:44px;height:4px;border-radius:2px;background:rgba(255,255,255,.1)"></div>
        ${m.id === 'auto' ? '<div class="paused abs mono" style="right:9px;top:8px;font-size:15px;letter-spacing:.08em;color:#9aa3b5;opacity:0">PAUSED</div>' : ''}</div>`);
      bar.appendChild(b);
      return { b, led: b.querySelector('.led'), paused: b.querySelector('.paused') };
    });

    /* ---------- Still Mode card: timeline (no numbers on the ruler: the playhead carries the frame) ---------- */
    const TC = panel(root, { ...TCR, title: 'Timeline', icon: 'timeline' });
    const FX = f => 46 + f / 120 * 628;
    let rul = '';
    for (let f = 0; f <= 120; f += 10) rul += `<div class="abs" style="left:${FX(f) - 1}px;top:${f % 20 ? 44 : 38}px;width:2px;height:${f % 20 ? 8 : 14}px;background:rgba(255,255,255,${f % 20 ? .12 : .26})"></div>`;
    TC.body.appendChild(el(`<div class="abs" style="left:0;top:0;right:0;height:60px">${rul}</div>`));
    TC.body.appendChild(el(`<div class="abs" style="left:${FX(0)}px;width:${FX(120) - FX(0)}px;top:60px;height:58px;border-radius:6px;background:rgba(255,255,255,.035)"></div>`));
    const band = el(`<div class="abs" style="left:${FX(0)}px;top:60px;height:58px;border-radius:6px;background:linear-gradient(180deg,rgba(58,123,200,.26),rgba(58,123,200,.12));border-left:3px solid #3a7bc8;border-right:3px solid #3a7bc8"></div>`);
    TC.body.appendChild(band);
    [0, 30, 60, 90, 120].forEach(f => TC.body.appendChild(el(`<div class="abs" style="left:${FX(f) - 8}px;top:81px;width:16px;height:16px;transform:rotate(45deg);background:#e8c47a;border:2px solid #0c0d10;border-radius:2px"></div>`)));
    const ph = el(`<div class="abs" style="left:0;top:0;width:0;height:0">
      <div class="abs" style="left:-1.5px;top:30px;width:3px;height:92px;background:#f5a623;box-shadow:0 0 10px rgba(245,166,35,.7)"></div>
      <div class="phbox abs mono" style="left:-32px;top:4px;width:64px;height:30px;border-radius:6px;background:#f5a623;color:#0a0a0c;font-size:18px;display:flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap">20</div></div>`);
    TC.body.appendChild(ph);
    const phLine = ph.children[0], phBox = ph.querySelector('.phbox');
    const lockRing = el(`<div class="abs" style="left:${FX(0) - 44}px;top:-25px;width:88px;height:88px;border-radius:50%;border:3px solid #5b9be0;opacity:0"></div>`);
    TC.body.appendChild(lockRing);
    const field = (x, label, id) => `<div class="abs" style="left:${x}px;top:140px;width:200px;height:46px;border-radius:7px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:12px;padding:0 16px">
      <span class="mono" style="font-size:15px;letter-spacing:.14em;color:#6b7385">${label}</span><span class="mono ${id}" style="font-size:22px;color:#eef1f6;margin-left:auto">0</span></div>`;
    TC.body.appendChild(el(`<div class="abs" style="left:0;top:0;right:0;height:190px">${field(46, 'START', 'fs')}${field(262, 'END', 'fe')}</div>`));
    const fEnd = TC.body.querySelector('.fe');

    /* ---------- Value Lock card: a light's Power (readout above, track below: the cursor never covers text) ---------- */
    const LC = panel(root, { ...LCR, title: 'Light', icon: 'world' });
    const TR = { x: 46, y: 176, w: 628, h: 22 }, PMAX = 2000;
    LC.body.appendChild(el(`<div class="abs disp6" style="left:${TR.x}px;top:52px;font-size:28px;color:#c9d1de">Power</div>`));
    const val = el(`<div class="abs mono" style="right:${LCR.w - TR.x - TR.w}px;top:36px;font-size:54px;line-height:1;color:#fff;white-space:nowrap">1000 W</div>`);
    LC.body.appendChild(val);
    const lock1 = el(`<div class="abs" style="left:${TR.x + 132}px;top:50px;opacity:0">${icon('lock', 34, '#f5a623', 2.2)}</div>`);
    LC.body.appendChild(lock1);
    const trk = el(`<div class="abs" style="left:${TR.x}px;top:${TR.y}px;width:${TR.w}px;height:${TR.h}px;border-radius:${TR.h / 2}px;background:#23262e;border:1px solid rgba(255,255,255,.1)">
      <div class="ghost abs" style="left:0;top:0;bottom:0;width:0;border-radius:${TR.h / 2}px;background:linear-gradient(90deg,rgba(245,166,35,.1),rgba(245,166,35,.5));opacity:0"></div>
      <div class="fill abs" style="left:0;top:0;bottom:0;width:0;border-radius:${TR.h / 2}px;background:linear-gradient(90deg,#265787,#3a7bc8)"></div></div>`);
    LC.body.appendChild(trk);
    const fill = trk.querySelector('.fill'), ghost = trk.querySelector('.ghost');
    const knob = el(`<div class="abs" style="left:0;top:${TR.y + TR.h / 2 - 19}px;width:38px;height:38px;margin-left:-19px;border-radius:50%;background:#f2f4f8;box-shadow:0 4px 14px rgba(0,0,0,.5)"></div>`);
    LC.body.appendChild(knob);
    const knobRing = el(`<div class="abs" style="left:0;top:${TR.y + TR.h / 2 - 40}px;width:80px;height:80px;margin-left:-40px;border-radius:50%;border:3px solid #f5a623;opacity:0"></div>`);
    LC.body.appendChild(knobRing);
    const lockChip = el(`<div class="abs mono" style="right:74px;top:11px;height:32px;display:flex;align-items:center;gap:7px;padding:0 12px;border-radius:16px;font-size:15px;letter-spacing:.12em;color:#fff;background:rgba(245,166,35,.2);border:1.5px solid #f5a623;opacity:0">${icon('lock', 16, '#f5a623')}VALUE LOCK</div>`);
    LC.el.appendChild(lockChip);
    const powerAt = lt => {
      if (lt < tGrab) return 1000;
      if (lt < tRel) return lerp(1000, 1800, ease.inOut(prog(lt, tGrab, tRel - .06 - tGrab)));
      return 1800 - 800 * ease.elastic(prog(lt, tRel, .75));
    };
    const pxOf = P => TR.w * clamp(P / PMAX, 0, 1);
    const knobStageY = LCR.y + 54 + TR.y + TR.h / 2;
    const grab = [LCR.x + TR.x + pxOf(1000) + 2, knobStageY + 2], drop = [LCR.x + TR.x + pxOf(1800) + 2, knobStageY + 2];

    /* ---------- pills + pie + keys (phase 3) ---------- */
    const pills = ['still', 'lock'].map((id, k) => {
      const m = MODES[MI(id)];
      const p = el(`<div class="abs mono" style="left:${V3.x + 20}px;top:${V3.y + VHEAD + 58 + k * 58}px;height:44px;display:flex;align-items:center;gap:10px;padding:0 20px 0 14px;border-radius:22px;font-size:19px;letter-spacing:.12em;color:#fff;
        background:${rgba(m.c, .22)};border:1.5px solid ${m.c};box-shadow:0 0 22px ${rgba(m.c, .35)};white-space:nowrap;opacity:0;transform-origin:0 50%">${ico(m.ic, 21, m.c)}${m.pill}</div>`);
      root.appendChild(p);
      const ring = el(`<div class="abs" style="left:${V3.x + 20}px;top:${V3.y + VHEAD + 58 + k * 58}px;height:44px;border-radius:22px;border:2px solid ${m.c};opacity:0;transform-origin:50% 50%"></div>`);
      root.appendChild(ring);
      return { p, ring, m };
    });
    pills.forEach(o => { o.ring.style.width = o.p.offsetWidth + 'px'; });

    const pie = el(`<div class="abs" style="left:${PIE[0]}px;top:${PIE[1]}px;width:0;height:0"></div>`);
    root.appendChild(pie);
    const pieDisc = el(`<div class="abs" style="left:-470px;top:-400px;width:940px;height:800px;border-radius:50%;background:radial-gradient(closest-side,rgba(6,7,10,.72),rgba(6,7,10,.45) 60%,transparent)"></div>`);
    pie.appendChild(pieDisc);
    const pieRing = el(`<svg class="abs" width="120" height="120" viewBox="-60 -60 120 120" style="left:-60px;top:-60px;overflow:visible">
      <circle r="30" fill="rgba(10,10,14,.7)" stroke="rgba(255,255,255,.22)" stroke-width="3"/>
      <path class="arc" d="M 0 -30 A 30 30 0 0 1 21.2 -21.2" fill="none" stroke="#f5a623" stroke-width="6" stroke-linecap="round"/></svg>`);
    pie.appendChild(pieRing);
    const arc = pieRing.querySelector('.arc');
    const pieItems = PIE_ITEMS.map(([id, d]) => {
      const m = MODES[MI(id)], a = DIR[d] * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      const x = PRX * c - PIW * (1 - c) / 2, y = PRY * s - PIH * (1 - s) / 2;
      const on = id === 'still' || id === 'lock', dim = id === 'auto';
      const it = el(`<div class="abs" style="left:${x}px;top:${y}px;width:${PIW}px;height:${PIH}px;border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 16px;
        background:${on ? rgba(m.c, .24) : 'rgba(16,17,22,.92)'};border:1.5px solid ${on ? m.c : 'rgba(255,255,255,.14)'};box-shadow:0 14px 34px rgba(0,0,0,.5)${on ? ',0 0 20px ' + rgba(m.c, .35) : ''};opacity:0;${dim ? 'filter:grayscale(1) brightness(.7);' : ''}">
        ${ico(m.ic, 26, on ? m.c : '#c9d1de', 1.9)}<span class="disp6" style="font-size:22px;color:${on ? '#fff' : '#dfe5ee'};white-space:nowrap">${m.name}</span>
        ${on ? `<i style="margin-left:auto;display:block;width:10px;height:10px;border-radius:50%;background:${m.c};box-shadow:0 0 10px ${m.c}"></i>` : ''}</div>`);
      pie.appendChild(it);
      return { it, dx: c, dy: s, id, base: it.style.background };
    });
    const hoverIdx = pieItems.findIndex(p => p.id === 'rest');
    const keysUp = keycaps(root, ['Shift', 'Alt', 'Q'], { x: PIE[0] - 190, y: PIE[1] + 292, t0: tKeys, press: tPress, ctx, scale: .9 });

    /* ---------- cursor (tips rest on icons / tracks, never on a word) ---------- */
    const iconY = BTN_T + 26;                                    // tip on the icon; the arrow ends above the label
    const laneX = btnX(MI('lock')) + 67;                          // right margin of the Value Lock button / card edges: no text
    const cursor = new Cursor(root, ctx, [
      { t: tStill - .9, x: 900, y: 92 },
      { t: tStill, x: btnX(MI('still')) + 4, y: iconY, click: true },
      { t: tStill + .5, x: 700, y: 128 },                         // rests in the empty header strip
      { t: tLock - .45, x: 702, y: 129 },
      { t: tLock, x: btnX(MI('lock')) + 4, y: iconY, click: true },
      { t: tLock + .15, x: laneX, y: iconY + 4 },
      { t: tLock + .6, x: laneX, y: grab[1] },
      { t: tGrab, x: grab[0], y: grab[1], click: true },
      { t: tRel - .06, x: drop[0], y: drop[1] },
      { t: tRel + .6, x: drop[0] + 36, y: drop[1] + 64 },
      { t: tClose + .5, x: 1500, y: 800 },
      { t: tKeys - .15, x: PIE[0] + 4, y: PIE[1] + 2 },
      { t: tHover - .32, x: PIE[0] + 4, y: PIE[1] + 2 },
      { t: tHover, x: PIE[0] - 62, y: PIE[1] + 8 },
    ]);

    return lt => {
      /* phase 1: headline in, then cleared before the work starts */
      H.update(lt, .25);
      if (lt > tSwap) {
        hSpans.forEach((s, i) => { const p = ease.in(prog(lt, tSwap + i * .03, .28)); s.style.transform = `translateY(${-p * 115}%)`; });
        H.el.firstChild.style.opacity = 1 - prog(lt, tSwap, .25);
      }

      /* bar + switches */
      const close = ease.inOut(prog(lt, tClose, .45));
      bar.style.opacity = 1 - close;
      bar.style.transform = `translateY(${-close * 50}px) scale(${1 - close * .03})`;
      MODES.forEach((m, i) => {
        const { b, led, paused } = btns[i];
        let on = 0, dim = 0, flash = 0;
        if (m.id === 'still') { on = ease.out(prog(lt, tStill, .18)); flash = bump(lt, tStill + .12, .45); }
        if (m.id === 'lock') { on = ease.out(prog(lt, tLock, .18)); flash = bump(lt, tLock + .12, .45); }
        if (m.id === 'auto') { dim = ease.out(prog(lt, tLock + .1, .35)); on = 1 - dim; }
        const gl = bump(lt, tSweep + i * .11, .3), gc = sweepC[i];
        const glow = Math.max(on * .55, gl, flash);
        b.style.background = on > .01 ? `linear-gradient(180deg,${rgba(m.c, .3 * on)},${rgba(m.c, .08 * on)}),rgba(12,12,16,.55)` : 'rgba(12,12,16,.55)';
        b.style.borderColor = on > .01 ? rgba(m.c, .3 + .6 * on) : gl > .01 ? rgba(gc, .2 + .7 * gl) : 'rgba(255,255,255,.08)';
        b.style.boxShadow = glow > .01 ? `0 0 ${10 + 30 * glow}px ${rgba(on > .01 ? m.c : gc, .55 * glow)}` : 'none';
        b.style.color = on > .5 ? '#ffffff' : gl > .05 ? hexMix('#c9d1de', gc, gl) : '#c9d1de';
        led.style.background = on > .01 ? m.c : 'rgba(255,255,255,.1)';
        led.style.boxShadow = on > .01 ? `0 0 ${12 * on}px ${m.c}` : 'none';
        b.style.opacity = 1 - .5 * dim; b.style.filter = dim > .01 ? `grayscale(${dim})` : 'none';
        if (paused) paused.style.opacity = dim;
        b.style.transform = `translateY(${-gl * 4}px) scale(${1 + .05 * flash})`;
      });

      /* viewport frame: grows to take the stage when the sidebar closes */
      const g = ease.inOut(prog(lt, tClose, .7));
      const vx = lerp(V2.x, V3.x, g), vy = lerp(V2.y, V3.y, g), vW = lerp(V2.w, V3.w, g), vH = lerp(V2.h, V3.h, g);
      vp.style.left = vx + 'px'; vp.style.top = vy + 'px'; vp.style.width = vW + 'px'; vp.style.height = vH + 'px';
      vp.style.opacity = clamp((lt + .45) / .3);
      vp.style.transform = `translateX(${(1 - ease.expo(prog(lt, -.4, .9))) * 80}px)`;
      const x3 = lerp(930, 600, ease.inOut(prog(lt, tKeys - .45, .8)));      // pans left to make room for the pie
      const cx = lerp(V2.x + V2.w / 2, x3, g), cy = lerp(V2.y + VHEAD + (V2.h - VHEAD) / 2 + 6, 548, g);
      vw.style.transform = `translate(${cx - vx - CW / 2}px,${cy - vy - CH / 2 + float(lt, 4, .9)}px) scale(${lerp(.72, 1, g)})`;
      const f = frameAt(lt), big = g > .001;
      renderWatch(f, big);
      viewS.canvas.style.visibility = big ? 'hidden' : 'visible'; viewB.canvas.style.visibility = big ? 'visible' : 'hidden';
      const fi = Math.round(f), ftxt = `(${fi}) Watch`;
      if (vfr.textContent !== ftxt) vfr.textContent = ftxt;
      vfr.style.color = lt > tPin ? '#8fbcf0' : '#c9d1de';
      const P = powerAt(lt), pk = clamp((P - 1000) / 800, -.4, 1.2);
      const flt = Math.abs(pk) > .005 ? `brightness(${1 + .55 * pk}) saturate(${1 + .15 * pk})` : 'none';
      viewS.canvas.style.filter = flt; viewB.canvas.style.filter = flt;
      warm.style.opacity = clamp(pk) * .9;
      rays.forEach((r, k) => { const a = k * Math.PI / 4, R2 = 40 + 26 * pk; r.setAttribute('x2', (Math.cos(a) * R2).toFixed(1)); r.setAttribute('y2', (Math.sin(a) * R2).toFixed(1)); });

      /* work cards */
      [TC.el, LC.el].forEach((c, k) => {
        const t0 = tSwap + .4 + k * .1, a = ease.expo(prog(lt, t0, .7)), o = ease.in(prog(lt, tClose + k * .07, .45));
        c.style.opacity = clamp(prog(lt, t0, .7) * 2.5) * (1 - o) * (k === 1 ? lerp(.5, 1, ease.out(prog(lt, tLock - .3, .4))) : 1);
        c.style.transform = `translateX(${(1 - a) * -90 - o * 160}px)`;
      });

      /* Still Mode: playhead home to frame 0, range collapses, pinned */
      ph.style.left = FX(f) + 'px';
      if (lt >= tPin) {
        phBox.style.left = '-18px'; phBox.style.width = '156px'; phBox.style.background = '#5b9be0';
        if (phBox.dataset.s !== 'p') { phBox.dataset.s = 'p'; phBox.innerHTML = `${icon('lock', 17, '#0a0a0c')}STILL · F0`; }
        phBox.style.transform = `scale(${lerp(.6, 1, ease.back(prog(lt, tPin, .35)))})`; phBox.style.transformOrigin = '18px 50%';
        phLine.style.background = '#5b9be0'; phLine.style.boxShadow = '0 0 12px rgba(91,155,224,.8)';
      } else {
        phBox.style.left = '-32px'; phBox.style.width = '64px'; phBox.style.background = '#f5a623'; phBox.style.transform = 'none';
        if (phBox.dataset.s !== String(fi)) { phBox.dataset.s = String(fi); phBox.textContent = String(fi); }
        phLine.style.background = '#f5a623'; phLine.style.boxShadow = '0 0 10px rgba(245,166,35,.7)';
      }
      const rq = prog(lt, tPin + .05, .45);
      lockRing.style.opacity = rq > 0 && rq < 1 ? (1 - rq) * .9 : 0; lockRing.style.transform = `scale(${.3 + ease.out(rq) * 1.1})`;
      const endV = lt < tRew + .15 ? 120 : Math.round(lerp(120, 0, ease.inOut(prog(lt, tRew + .15, .6))));
      if (fEnd.textContent !== String(endV)) fEnd.textContent = endV;
      fEnd.style.color = lt > tRew + .15 ? '#8fbcf0' : '#eef1f6';
      band.style.width = (FX(endV) - FX(0)) + 'px';
      band.style.borderColor = lt > tPin ? '#5b9be0' : '#3a7bc8';

      /* Value Lock: nudge Power, release, it snaps back */
      fade(lockChip, lt, tLock + .05, .3);
      { const q = prog(lt, tLock + .15, .4); lock1.style.opacity = clamp(q * 3); lock1.style.transform = `scale(${lerp(.4, 1, ease.back(q))})`; }
      const kx = pxOf(P);
      fill.style.width = kx + 'px'; knob.style.left = (TR.x + kx) + 'px';
      const vtxt = Math.round(P / 10) * 10 + ' W';
      if (val.textContent !== vtxt) val.textContent = vtxt;
      const dragging = lt >= tGrab && lt < tRel, snapF = bump(lt, tRel + .12, .45);
      val.style.color = dragging ? '#ffd9a0' : snapF > .05 ? '#f5a623' : '#fff';
      knob.style.background = snapF > .05 ? '#f5a623' : '#f2f4f8';
      knob.style.boxShadow = `0 4px 14px rgba(0,0,0,.5)${snapF > .01 ? `,0 0 ${30 * snapF}px rgba(245,166,35,${.8 * snapF})` : ''}`;
      lock1.style.filter = snapF > .01 ? `drop-shadow(0 0 ${14 * snapF}px #f5a623)` : 'none';
      if (snapF > .01) lock1.style.transform = `scale(${1 + .3 * snapF})`;
      const kr = prog(lt, tRel + .08, .5);
      knobRing.style.left = (TR.x + kx) + 'px'; knobRing.style.opacity = kr > 0 && kr < 1 ? 1 - kr : 0; knobRing.style.transform = `scale(${.4 + ease.out(kr)})`;
      ghost.style.left = pxOf(Math.min(P, 1800)) + 'px'; ghost.style.width = Math.max(0, pxOf(1800) - pxOf(Math.min(P, 1800))) + 'px';
      ghost.style.opacity = lt > tRel ? 1 - prog(lt, tRel + .25, .8) : 0;

      /* pills pop into the viewport corner */
      pills.forEach((o, k) => {
        pop(o.p, lt, tPill[k], .5, .5);
        const r = prog(lt, tPill[k] + .1, .6);
        o.ring.style.opacity = r > 0 && r < 1 ? (1 - r) * .9 : 0; o.ring.style.transform = `scale(${1 + ease.out(r) * .35})`;
      });

      /* keys + pie */
      keysUp(lt);
      const pq = prog(lt, tPie, .5);
      pie.style.opacity = lt < tPie ? 0 : 1;
      pieDisc.style.opacity = ease.out(prog(lt, tPie, .45)); pieDisc.style.transform = `scale(${lerp(.7, 1, ease.expo(prog(lt, tPie, .6)))})`;
      pieRing.style.transform = `scale(${lerp(.3, 1, ease.back(clamp(pq * 1.4)))})`;
      pieRing.style.opacity = clamp(pq * 4);
      const [cxp, cyp] = cursor.pos(lt);
      const ang = Math.atan2(cyp - PIE[1], cxp - PIE[0]);
      arc.setAttribute('transform', `rotate(${(ang * 180 / Math.PI + 90 - 22.5).toFixed(1)})`);
      const hv = ease.out(prog(lt, tHover - .1, .25));
      pieItems.forEach((p, k) => {
        const q = prog(lt, tPie + .04 + k * .035, .42), e = ease.back(q);
        p.it.style.opacity = clamp(q * 3);
        p.it.style.transform = `translate(${(1 - e) * -p.dx * PRX * .6}px,${(1 - e) * -p.dy * PRY * .6}px) scale(${lerp(.6, 1, e)})`;
        if (k === hoverIdx) {
          p.it.style.background = hv > .01 ? `rgba(58,123,200,${.35 + .3 * hv})` : p.base;
          p.it.style.borderColor = hv > .01 ? `rgba(140,190,240,${.3 + .6 * hv})` : 'rgba(255,255,255,.14)';
        }
      });
      cursor.update(lt);
      if (lt >= tGrab && lt < tRel) cursor.el.style.transform += ' scale(.9)';
    };
  },
});
