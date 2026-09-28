// Modes: seven switches at the top of the Takes panel. Still Mode pins the timeline to frame 0,
// Value Lock snaps a nudged value back (Autokey pauses), and every active mode shows as a pill
// in the viewport, readable with the sidebar closed; Shift+Alt+Q opens the same switches as a pie.
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

/* ---------- layout ---------- */
const BX = 210, BY = 108, BW = 200, BH = 116, BG = 12, BP = 14, BHEAD = 40;
const BAR_W = BP * 2 + 7 * BW + 6 * BG, BAR_H = BHEAD + 10 + BH + BP;      // 1500 x 180
const btnC = i => [BX + BP + i * (BW + BG) + BW / 2, BY + BHEAD + 10 + BH / 2];
const V2 = { x: 880, y: 318, w: 920, h: 632 };      // viewport while the sidebar is open
const V3 = { x: 120, y: 120, w: 1680, h: 830 };     // viewport with the sidebar closed
const VHEAD = 38, CW = 1000, CH = 800;              // viewport header, 3D canvas size
const GZ = [800, 150];                              // light gizmo inside the 3D canvas
const PIE = [1345, 530], PRX = 185, PRY = 168, PIW = 214, PIH = 58;
const DIR = { E: 0, SE: 45, S: 90, SW: 135, W: 180, NW: 225, N: 270, NE: 315 };
const PIE_ITEMS = [['rest', 'W'], ['lock', 'E'], ['time', 'S'], ['still', 'N'], ['auto', 'NW'], ['live', 'NE'], ['diff', 'SW']];

defineScene({
  id: 's11_modes',
  transitionIn: 'push',
  camera: { zoom: .025 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .2, part: .8, glow: 1, ax: .12, ay: .3, bx: .85, by: .75 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    /* ---------- timing (scene-local seconds) ---------- */
    const tSweep = L(0) + .2;                 // light runs across the seven switches
    const tSwap = 2.72;                       // headline out, work cards in
    const tStill = L(1) - .05;                // click Still Mode
    const tRew = tStill + .08, dRew = .62;    // playhead slides home to frame 0
    const tPin = tRew + dRew;                 // pinned: STILL · F0
    const tTurn = L(1) + 1.75;                // turntable layer opts back in
    const tLock = L(2) - .08;                 // click Value Lock (Autokey pauses)
    const tGrab = tLock + .85, tRel = tGrab + .85;   // drag Power to 1800 W, release -> snaps back
    const tClose = L(3) - .6;                 // sidebar closes, viewport takes the stage
    const tPill = [L(3) + .1, L(3) + .35];    // pills land in the viewport corner
    const tKeys = L(3) + 1.3, tPress = L(3) + 1.65, tPie = tPress + .08, tHover = L(3) + 2.75;

    /* ---------- sound ---------- */
    ctx.cue(tSweep, 'shimmer', { gain: .55 });
    ctx.cue(tSwap + .05, 'swish', { gain: .45, pan: -.3 });
    ctx.cue(tRew + .02, 'whoosh', { gain: .45, pan: -.2 });
    ctx.cue(tPin, 'thud', { gain: .6 }); ctx.cue(tPin + .04, 'blip', { gain: .6, pitch: 7 });
    ctx.cue(tPin + .35, 'tick', { gain: .45, pitch: -3 });
    ctx.cue(tTurn, 'pop', { gain: .35, pitch: 2, pan: -.3 });
    ctx.cue(tLock + .1, 'blip', { gain: .55, pitch: -5, pan: .1 });
    ctx.cue(tGrab - .15, 'riser', { gain: .35 });
    ctx.cue(tRel + .01, 'snap', { gain: 1 }); ctx.cue(tRel + .08, 'thud', { gain: .35 });
    ctx.cue(tClose, 'whoosh', { gain: .6 });
    tPill.forEach((t, k) => ctx.cue(t, 'pop', { gain: .8, pitch: k * 3, pan: -.6 }));
    ctx.cue(tPie - .04, 'whoosh', { gain: .55, pan: .3 }); ctx.cue(tPie + .08, 'pop', { gain: .5, pitch: 5, pan: .3 });
    ctx.cue(tHover + .02, 'tick', { gain: .5, pan: .2 });

    /* ---------- headline (phase 1, left column) ---------- */
    const H = headline(root, { x: 120, y: 408, w: 720, kicker: 'Modes', size: 84,
      lines: ['SWITCH ON.', 'WORK.', { t: 'SWITCH OFF.', grad: true }],
      lede: 'Seven modes change how the file behaves.', ledeW: 700, ledeSize: 30 });
    const hSpans = [...H.el.querySelectorAll('.mask>span')];

    /* ---------- viewport (built before the bar so the bar floats above it) ---------- */
    const vp = el(`<div class="abs" style="left:0;top:0;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.1);
      background:radial-gradient(ellipse 70% 60% at 42% 45%,#2a2e37,#16171c 70%,#111215);box-shadow:0 40px 90px rgba(0,0,0,.55)"></div>`);
    root.appendChild(vp);
    const floor = el(`<div class="abs" style="left:-60%;width:220%;top:52%;height:110%;transform:perspective(520px) rotateX(74deg);transform-origin:50% 0;
      background-image:linear-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(255,255,255,.07) 1.5px,transparent 1.5px);background-size:90px 90px;background-position:center 0;
      -webkit-mask-image:linear-gradient(to bottom,#000 0%,transparent 70%)"><div class="abs" style="left:0;right:0;top:0;height:3px;background:rgba(224,86,154,.4)"></div></div>`);
    vp.appendChild(floor);
    const vw = el(`<div class="abs" style="left:0;top:0;width:${CW}px;height:${CH}px;transform-origin:50% 50%"></div>`);
    vp.appendChild(vw);
    vw.appendChild(el(`<div class="abs" style="left:${CW / 2 - 260}px;top:${CH / 2 + 250}px;width:520px;height:70px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent)"></div>`));
    const warm = el(`<div class="abs" style="left:${GZ[0] - 300}px;top:${GZ[1] - 260}px;width:600px;height:600px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,214,150,.55),rgba(245,166,35,.12) 55%,transparent);opacity:0"></div>`);
    vw.appendChild(warm);
    const view = canvas3d(vw, { x: 0, y: 0, w: CW, h: CH });
    // light gizmo (rays grow with Power)
    const giz = el(`<svg class="abs" width="160" height="160" viewBox="-80 -80 160 160" style="left:${GZ[0] - 80}px;top:${GZ[1] - 80}px;overflow:visible">
      <circle r="11" fill="rgba(255,236,200,.9)"/><circle r="19" fill="none" stroke="rgba(255,236,200,.7)" stroke-width="2.5" stroke-dasharray="4 5"/>
      ${Array.from({ length: 8 }, (_, k) => `<line class="ray" x1="${Math.cos(k * Math.PI / 4) * 26}" y1="${Math.sin(k * Math.PI / 4) * 26}" x2="${Math.cos(k * Math.PI / 4) * 40}" y2="${Math.sin(k * Math.PI / 4) * 40}" stroke="rgba(255,236,200,.75)" stroke-width="3" stroke-linecap="round"/>`).join('')}
      <line x1="0" y1="0" x2="0" y2="120" stroke="rgba(255,236,200,.35)" stroke-width="2" stroke-dasharray="3 6"/></svg>`);
    vw.appendChild(giz);
    const rays = [...giz.querySelectorAll('.ray')];
    // chrome
    const vhead = el(`<div class="abs" style="left:0;right:0;top:0;height:${VHEAD}px;background:rgba(8,8,11,.6);border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px;padding:0 16px">
      ${icon('cube', 18, '#9aa3b5')}<span class="disp6" style="font-size:17px;color:#c9d1de">3D Viewport</span>
      <div style="margin-left:auto;display:flex;gap:8px">${['#6b7385', '#9aa3b5', '#e87d0d', '#6b7385'].map(c => `<i style="display:block;width:14px;height:14px;border-radius:50%;border:2px solid ${c}"></i>`).join('')}</div></div>`);
    vp.appendChild(vhead);
    const vtxt = el(`<div class="abs" style="left:18px;top:${VHEAD + 12}px;font-size:17px;color:#c9d1de;line-height:1.4;white-space:nowrap"><div>User Perspective</div><div class="fr">(20) Kitchen · Take 2 | Watch</div></div>`);
    vp.appendChild(vtxt);
    const vfr = vtxt.querySelector('.fr');
    const gizmo = el(`<svg class="abs" width="96" height="96" viewBox="-48 -48 96 96" style="right:14px;top:${VHEAD + 10}px">
      <circle r="44" fill="rgba(255,255,255,.04)"/>
      <line x1="0" y1="0" x2="30" y2="10" stroke="#e0569a" stroke-width="3"/><line x1="0" y1="0" x2="-14" y2="22" stroke="#2fc4b2" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-32" stroke="#3a7bc8" stroke-width="3"/>
      <circle cx="30" cy="10" r="9" fill="#e0569a"/><circle cx="-14" cy="22" r="9" fill="#2fc4b2"/><circle cx="0" cy="-32" r="9" fill="#3a7bc8"/></svg>`);
    vp.appendChild(gizmo);

    // 3D watch
    const scene3 = R3D.scene();
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene3.add(pivot);
    paintWatch(watch, 'gold');
    const cam = R3D.camera(28);
    let vKey = '';
    const frameAt = lt => lt < tRew ? 20 + (lt + .4) * 24 : lerp(20 + (tRew + .4) * 24, 0, ease.inOut(prog(lt, tRew, dRew)));
    const renderWatch = f => {
      const key = f.toFixed(2);
      if (key === vKey) return;
      vKey = key;
      const a = f / 120 * Math.PI * 2;
      pivot.rotation.set(.1 + .08 * Math.sin(a + 1), -.45 + .5 * Math.sin(a), 0);
      pivot.position.set(0, .12 * Math.sin(a * 2), 0);
      setTime(watch, 40 + f / 24 * 6);
      cam.position.set(0, .5, 13.2); cam.lookAt(0, .05, 0);
      view.draw(scene3, cam);
    };

    /* ---------- mode bar (hero) ---------- */
    const bar = el(`<div class="glass abs" style="left:${BX}px;top:${BY}px;width:${BAR_W}px;height:${BAR_H}px;border-radius:14px">
      <div class="abs" style="left:20px;top:0;height:${BHEAD}px;display:flex;align-items:center;gap:10px">${icon('take', 20, '#9aa3b5')}<span class="disp6" style="font-size:19px;color:#c9d1de">Takes</span>
        <span class="mono" style="font-size:15px;letter-spacing:.18em;color:#6b7385;margin-left:8px">MODES</span></div>
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

    /* ---------- Still Mode card: timeline ---------- */
    const TC = panel(root, { x: 120, y: 318, w: 720, h: 290, title: 'Timeline', icon: 'timeline' });
    const FX = f => 44 + f / 120 * 632;
    let rul = '';
    for (let f = 0; f <= 120; f += 10) {
      rul += `<div class="abs" style="left:${FX(f) - 1}px;top:${f % 20 ? 34 : 30}px;width:2px;height:${f % 20 ? 8 : 12}px;background:rgba(255,255,255,${f % 20 ? .12 : .26})"></div>`;
      if (f % 20 === 0) rul += `<div class="abs mono" style="left:${FX(f) - 30}px;width:60px;text-align:center;top:6px;font-size:16px;color:#6b7385">${f}</div>`;
    }
    TC.body.appendChild(el(`<div class="abs" style="left:0;top:0;right:0;height:50px">${rul}</div>`));
    const track = el(`<div class="abs" style="left:${FX(0)}px;width:${FX(120) - FX(0)}px;top:52px;height:62px;border-radius:6px;background:rgba(255,255,255,.035)"></div>`);
    TC.body.appendChild(track);
    const band = el(`<div class="abs" style="left:${FX(0)}px;top:52px;height:62px;border-radius:6px;background:linear-gradient(180deg,rgba(58,123,200,.26),rgba(58,123,200,.12));border-left:3px solid #3a7bc8;border-right:3px solid #3a7bc8"></div>`);
    TC.body.appendChild(band);
    [0, 30, 60, 90, 120].forEach(f => TC.body.appendChild(el(`<div class="abs" style="left:${FX(f) - 8}px;top:75px;width:16px;height:16px;transform:rotate(45deg);background:#e8c47a;border:2px solid #0c0d10;border-radius:2px"></div>`)));
    const ph = el(`<div class="abs" style="left:0;top:0;width:0;height:0">
      <div class="abs" style="left:-1.5px;top:20px;width:3px;height:98px;background:#f5a623;box-shadow:0 0 10px rgba(245,166,35,.7)"></div>
      <div class="phbox abs mono" style="left:-30px;top:-4px;width:60px;height:28px;border-radius:6px;background:#f5a623;color:#0a0a0c;font-size:17px;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap">20</div></div>`);
    TC.body.appendChild(ph);
    const phLine = ph.children[0], phBox = ph.querySelector('.phbox');
    const lockRing = el(`<div class="abs" style="left:${FX(0) - 40}px;top:-6px;width:80px;height:80px;border-radius:50%;border:3px solid #5b9be0;opacity:0"></div>`);
    TC.body.appendChild(lockRing);
    const field = (x, label, id) => `<div class="abs" style="left:${x}px;top:132px;width:190px;height:46px;border-radius:7px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:12px;padding:0 14px">
      <span class="mono" style="font-size:15px;letter-spacing:.14em;color:#6b7385">${label}</span><span class="mono ${id}" style="font-size:22px;color:#eef1f6;margin-left:auto">0</span></div>`;
    TC.body.appendChild(el(`<div class="abs" style="left:0;top:0;right:0;height:190px">${field(44, 'START', 'fs')}${field(250, 'END', 'fe')}</div>`));
    const fEnd = TC.body.querySelector('.fe');
    const stillTag = el(`<div class="abs mono" style="left:462px;top:136px;height:38px;display:flex;align-items:center;gap:8px;padding:0 14px;border-radius:19px;font-size:17px;letter-spacing:.12em;color:#fff;background:rgba(91,155,224,.2);border:1.5px solid #5b9be0;white-space:nowrap;opacity:0">${icon('lock', 18, '#5b9be0')}PINNED TO F0</div>`);
    TC.body.appendChild(stillTag);
    const turn = el(`<div class="abs" style="left:44px;top:192px;height:36px;display:flex;align-items:center;gap:12px;white-space:nowrap;opacity:0">
      ${icon('layer', 20, '#9aa3b5')}<span class="disp6" style="font-size:20px;color:#c9d1de">turntable</span>
      <span class="mono" style="font-size:15px;letter-spacing:.12em;padding:3px 10px;border-radius:5px;border:1.5px solid #2fc4b2;color:#2fc4b2;display:inline-flex;align-items:center;gap:6px">${icon('play', 12, '#2fc4b2')}ANIMATE</span>
      <span style="font-size:18px;color:#8790a3">opts back in and keeps playing</span></div>`);
    TC.body.appendChild(turn);

    /* ---------- Value Lock card: a light's Power ---------- */
    const LC = panel(root, { x: 120, y: 638, w: 720, h: 312, title: 'Light  ·  Properties', icon: 'world' });
    const FL = { x: 30, y: 22, w: 600, h: 62 }, PMAX = 2000;
    const fld = el(`<div class="abs" style="left:${FL.x}px;top:${FL.y}px;width:${FL.w}px;height:${FL.h}px;border-radius:9px;background:#23262e;border:1.5px solid rgba(255,255,255,.1);overflow:hidden">
      <div class="fill abs" style="left:0;top:0;bottom:0;width:300px;background:linear-gradient(90deg,rgba(38,87,135,.9),rgba(58,123,200,.95))"></div>
      <div class="ghost abs" style="left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,rgba(245,166,35,.12),rgba(245,166,35,.45));border-right:2px dashed rgba(245,166,35,.8);opacity:0"></div>
      <div class="abs" style="left:18px;top:0;bottom:0;display:flex;align-items:center;font-size:22px;color:#dfe5ee">Power</div>
      <div class="val abs mono" style="right:18px;top:0;bottom:0;display:flex;align-items:center;font-size:27px;color:#fff">1000 W</div></div>`);
    LC.body.appendChild(fld);
    const fill = fld.querySelector('.fill'), ghost = fld.querySelector('.ghost'), val = fld.querySelector('.val');
    const lockIc = (y, s = 26) => { const e = el(`<div class="abs" style="left:${FL.x + FL.w + 22}px;top:${y}px;opacity:0">${icon('lock', s, '#f5a623')}</div>`); LC.body.appendChild(e); return e; };
    const lock1 = lockIc(FL.y + FL.h / 2 - 15, 30);
    const row = (y, label, inner) => { const r = el(`<div class="abs" style="left:${FL.x}px;top:${y}px;width:${FL.w}px;height:46px;display:flex;align-items:center;gap:16px">
      <span style="font-size:20px;color:#9aa3b5;width:130px">${label}</span>${inner}</div>`); LC.body.appendChild(r); return r; };
    row(106, 'Color', '<div style="flex:1;height:36px;border-radius:7px;background:linear-gradient(90deg,#fff1dc,#ffe2b8);border:1.5px solid rgba(255,255,255,.12)"></div>');
    const lock2 = lockIc(113, 26);
    row(166, 'Rotation Z', `<div style="flex:1;height:36px;border-radius:7px;background:rgba(232,196,122,.2);border:1.5px solid rgba(232,196,122,.45);display:flex;align-items:center;padding:0 14px;gap:10px">
      ${icon('keyframe', 18, '#e8c47a')}<span class="mono" style="font-size:20px;color:#f1dfb4;margin-left:auto">35°</span></div>`);
    const freeTag = el(`<div class="abs mono" style="left:${FL.x + 150}px;top:222px;font-size:15px;letter-spacing:.12em;color:#2fc4b2;white-space:nowrap;opacity:0">KEYED &amp; DRIVEN CHANNELS STAY FREE</div>`);
    LC.body.appendChild(freeTag);
    const lockChip = el(`<div class="abs mono" style="right:74px;top:11px;height:32px;display:flex;align-items:center;gap:7px;padding:0 12px;border-radius:16px;font-size:15px;letter-spacing:.12em;color:#fff;background:rgba(245,166,35,.2);border:1.5px solid #f5a623;opacity:0">${icon('lock', 16, '#f5a623')}VALUE LOCK</div>`);
    LC.el.appendChild(lockChip);
    const snapTag = el(`<div class="abs mono" style="right:${720 - FL.x - FL.w}px;top:-1px;font-size:15px;letter-spacing:.12em;color:#f5a623;white-space:nowrap;opacity:0">SNAPPED BACK</div>`);
    LC.body.appendChild(snapTag);
    const powerAt = lt => {
      if (lt < tGrab) return 1000;
      if (lt < tRel) return lerp(1000, 1800, ease.inOut(prog(lt, tGrab, tRel - .06 - tGrab)));
      return 1800 - 800 * ease.elastic(prog(lt, tRel, .75));
    };
    const pxOf = P => FL.w * P / PMAX;
    const grab = [120 + FL.x + pxOf(1000) + 2, 638 + 54 + FL.y + FL.h / 2 + 4], drop = [120 + FL.x + pxOf(1800) + 2, grab[1]];

    /* ---------- pills + pie + keys (phase 3) ---------- */
    const pills = ['still', 'lock'].map((id, k) => {
      const m = MODES[MI(id)];
      const p = el(`<div class="abs mono" style="left:0;top:0;height:40px;display:flex;align-items:center;gap:10px;padding:0 18px 0 13px;border-radius:20px;font-size:18px;letter-spacing:.12em;color:#fff;
        background:${rgba(m.c, .22)};border:1.5px solid ${m.c};box-shadow:0 0 22px ${rgba(m.c, .35)};white-space:nowrap;opacity:0;transform-origin:0 50%">${ico(m.ic, 20, m.c)}${m.pill}</div>`);
      root.appendChild(p); return { p, m, i: MI(id), w: 0 };
    });
    pills.forEach(o => { o.w = o.p.offsetWidth; });
    const pillTo = k => [V3.x + 18, V3.y + VHEAD + 70 + k * 52];

    const pie = el(`<div class="abs" style="left:${PIE[0]}px;top:${PIE[1]}px;width:0;height:0"></div>`);
    root.appendChild(pie);
    const pieDisc = el(`<div class="abs" style="left:-470px;top:-400px;width:940px;height:800px;border-radius:50%;background:radial-gradient(closest-side,rgba(6,7,10,.72),rgba(6,7,10,.45) 60%,transparent)"></div>`);
    pie.appendChild(pieDisc);
    const pieRing = el(`<svg class="abs" width="120" height="120" viewBox="-60 -60 120 120" style="left:-60px;top:-60px;overflow:visible">
      <circle r="30" fill="rgba(10,10,14,.7)" stroke="rgba(255,255,255,.22)" stroke-width="3"/>
      <path class="arc" d="M 0 -30 A 30 30 0 0 1 21.2 -21.2" fill="none" stroke="#f5a623" stroke-width="6" stroke-linecap="round"/></svg>`);
    pie.appendChild(pieRing);
    const arc = pieRing.querySelector('.arc');
    const pieTitle = el(`<div class="abs disp6" style="left:-100px;width:200px;top:44px;text-align:center;font-size:20px;color:#9aa3b5">Mode Pie</div>`);
    pie.appendChild(pieTitle);
    const pieItems = PIE_ITEMS.map(([id, d], k) => {
      const m = MODES[MI(id)], a = DIR[d] * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      const px = PRX * c, py = PRY * s, x = px - PIW * (1 - c) / 2, y = py - PIH * (1 - s) / 2;
      const on = id === 'still' || id === 'lock', dim = id === 'auto';
      const it = el(`<div class="abs" style="left:${x}px;top:${y}px;width:${PIW}px;height:${PIH}px;border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 16px;
        background:${on ? rgba(m.c, .24) : 'rgba(16,17,22,.92)'};border:1.5px solid ${on ? m.c : 'rgba(255,255,255,.14)'};box-shadow:0 14px 34px rgba(0,0,0,.5)${on ? ',0 0 20px ' + rgba(m.c, .35) : ''};opacity:0;${dim ? 'filter:grayscale(1);' : ''}">
        ${ico(m.ic, 26, on ? m.c : '#c9d1de', 1.9)}<span class="disp6" style="font-size:22px;color:${on ? '#fff' : '#dfe5ee'};white-space:nowrap">${m.name}</span>
        ${on ? `<i style="margin-left:auto;display:block;width:10px;height:10px;border-radius:50%;background:${m.c};box-shadow:0 0 10px ${m.c}"></i>` : ''}${dim ? '<span class="mono" style="margin-left:auto;font-size:15px;color:#6b7385">PAUSED</span>' : ''}</div>`);
      pie.appendChild(it);
      return { it, dx: c, dy: s, id, base: it.style.background, dim };
    });
    const hoverIdx = pieItems.findIndex(p => p.id === 'rest');
    const keysUp = keycaps(root, ['Shift', 'Alt', 'Q'], { x: PIE[0] - 190, y: PIE[1] + 282, t0: tKeys, press: tPress, ctx, scale: .9 });

    /* ---------- cursor ---------- */
    const [sx, sy] = btnC(MI('still')), [lx, ly] = btnC(MI('lock'));
    const cursor = new Cursor(root, ctx, [
      { t: tStill - .9, x: 1000, y: 760 },
      { t: tStill, x: sx + 12, y: sy + 6, click: true },
      { t: tStill + .75, x: sx + 70, y: sy + 190 },
      { t: tLock - .8, x: sx + 90, y: sy + 180 },
      { t: tLock, x: lx + 12, y: ly + 6, click: true },
      { t: tGrab, x: grab[0], y: grab[1], click: true },
      { t: tRel - .06, x: drop[0], y: drop[1] },
      { t: tRel + .55, x: drop[0] + 60, y: drop[1] + 70 },
      { t: tClose + .5, x: drop[0] + 260, y: drop[1] - 40 },
      { t: tKeys - .15, x: PIE[0] + 6, y: PIE[1] + 4 },
      { t: tHover - .32, x: PIE[0] + 6, y: PIE[1] + 4 },
      { t: tHover, x: PIE[0] - 64, y: PIE[1] + 10 },
    ]);

    return lt => {
      /* phase 1 headline in, then out */
      H.update(lt, .22, .95);
      if (lt > tSwap) {
        hSpans.forEach((s, i) => { const p = ease.in(prog(lt, tSwap + i * .03, .38)); s.style.transform = `translateY(${-p * 115}%)`; });
        const k = prog(lt, tSwap, .3);
        H.el.firstChild.style.opacity = 1 - k; H.lede.style.opacity = 1 - k;
      }

      /* bar + switches */
      const close = ease.inOut(prog(lt, tClose + .22, .42));
      bar.style.opacity = 1 - close;
      bar.style.transform = `translateY(${-close * 40}px) scale(${1 - close * .03})`;
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
      const vin = ease.expo(prog(lt, -.4, .9));
      vp.style.opacity = clamp((lt + .45) / .3);
      vp.style.transform = `translateX(${(1 - vin) * 80}px)`;
      // watch placement (stage coords -> viewport coords)
      const sc = lerp(.72, 1, g);
      const x3 = lerp(930, 600, ease.inOut(prog(lt, tKeys - .45, .8)));      // pans left to make room for the pie
      const cx = lerp(V2.x + V2.w / 2, x3, g), cy = lerp(V2.y + VHEAD + (V2.h - VHEAD) / 2 + 6, 548, g);
      vw.style.transform = `translate(${cx - vx - CW / 2}px,${cy - vy - CH / 2 + float(lt, 4, .9)}px) scale(${sc})`;
      const f = frameAt(lt);
      renderWatch(f);
      const fi = Math.round(f);
      const ftxt = `(${fi}) Kitchen · Take 2 | Watch`;
      if (vfr.textContent !== ftxt) vfr.textContent = ftxt;
      vfr.style.color = lt > tPin ? '#8fbcf0' : '#c9d1de';
      // light power -> viewport brightness, gizmo rays
      const P = powerAt(lt), pk = clamp((P - 1000) / 800, -.4, 1.2);
      view.canvas.style.filter = Math.abs(pk) > .005 ? `brightness(${1 + .55 * pk}) saturate(${1 + .15 * pk})` : 'none';
      warm.style.opacity = clamp(pk) * .9;
      rays.forEach((r, k) => { const a = k * Math.PI / 4, R2 = 40 + 26 * pk; r.setAttribute('x2', (Math.cos(a) * R2).toFixed(1)); r.setAttribute('y2', (Math.sin(a) * R2).toFixed(1)); });

      /* timeline card (Still Mode) */
      const cIn = k => ease.expo(prog(lt, tSwap + .2 + k * .12, .7));
      const cOut = k => ease.in(prog(lt, tClose + k * .07, .45));
      [TC.el, LC.el].forEach((c, k) => {
        const a = cIn(k), o = cOut(k);
        c.style.opacity = clamp(prog(lt, tSwap + .2 + k * .12, .7) * 2.5) * (1 - o) * (k === 1 ? lerp(.55, 1, ease.out(prog(lt, tLock - .3, .4))) : 1);
        c.style.transform = `translateX(${(1 - a) * -90 - o * 160}px)`;
      });
      ph.style.left = FX(f) + 'px';
      const pinned = lt >= tPin;
      const pinK = ease.back(prog(lt, tPin, .35));
      if (pinned) {
        phBox.style.left = '-16px'; phBox.style.width = '150px'; phBox.style.background = '#5b9be0';
        if (phBox.dataset.s !== 'p') { phBox.dataset.s = 'p'; phBox.innerHTML = `${icon('lock', 16, '#0a0a0c')}STILL · F0`; }
        phBox.style.transform = `scale(${lerp(.6, 1, pinK)})`; phBox.style.transformOrigin = '16px 50%';
        phLine.style.background = '#5b9be0'; phLine.style.boxShadow = '0 0 12px rgba(91,155,224,.8)';
      } else {
        phBox.style.left = '-30px'; phBox.style.width = '60px'; phBox.style.background = '#f5a623'; phBox.style.transform = 'none';
        if (phBox.dataset.s !== String(fi)) { phBox.dataset.s = String(fi); phBox.textContent = String(fi); }
        phLine.style.background = '#f5a623'; phLine.style.boxShadow = '0 0 10px rgba(245,166,35,.7)';
      }
      const rq = prog(lt, tPin + .3, .35), rk = ease.out(rq);
      lockRing.style.opacity = rq > 0 && rq < 1 ? (1 - rq) : 0; lockRing.style.transform = `scale(${.3 + rk * 1.2})`;
      const endV = lt < tRew + .15 ? 120 : Math.round(lerp(120, 0, ease.inOut(prog(lt, tRew + .15, .6))));
      fEnd.textContent = endV; fEnd.style.color = lt > tRew + .15 ? '#8fbcf0' : '#eef1f6';
      band.style.width = (FX(endV) - FX(0)) + 'px';
      band.style.borderColor = lt > tPin ? '#5b9be0' : '#3a7bc8';
      pop(stillTag, lt, tPin + .15, .45, .6);
      pop(turn, lt, tTurn, .5, .9, 10);

      /* Value Lock card */
      const lockOn = ease.out(prog(lt, tLock + .05, .3));
      fade(lockChip, lt, tLock + .05, .3);
      [lock1, lock2].forEach((e, k) => { const q = prog(lt, tLock + .15 + k * .1, .4); e.style.opacity = clamp(q * 3); e.style.transform = `scale(${lerp(.4, 1, ease.back(q))})`; });
      fade(freeTag, lt, tLock + .45, .4);
      fill.style.width = pxOf(P) + 'px';
      val.textContent = Math.round(P / 10) * 10 + ' W';
      const dragging = lt >= tGrab && lt < tRel, snapF = bump(lt, tRel + .12, .45);
      val.style.color = dragging ? '#ffd9a0' : '#fff';
      fld.style.borderColor = snapF > .01 ? rgba('#f5a623', .3 + .7 * snapF) : dragging ? 'rgba(120,170,230,.7)' : 'rgba(255,255,255,.1)';
      fld.style.boxShadow = snapF > .01 ? `0 0 ${34 * snapF}px rgba(245,166,35,${.7 * snapF})` : 'none';
      lock1.style.filter = snapF > .01 ? `drop-shadow(0 0 ${14 * snapF}px #f5a623)` : 'none';
      if (snapF > .01) lock1.style.transform = `scale(${1 + .35 * snapF})`;
      ghost.style.left = pxOf(Math.min(P, 1800)) + 'px'; ghost.style.width = Math.max(0, pxOf(1800) - pxOf(Math.min(P, 1800))) + 'px';
      ghost.style.opacity = lt > tRel ? 1 - prog(lt, tRel + .25, .8) : 0;
      const sq = prog(lt, tRel + .1, .4); snapTag.style.opacity = clamp(sq * 3) * (1 - prog(lt, tRel + 1.1, .4));
      snapTag.style.transform = `translateY(${(1 - ease.out(sq)) * 8}px)`;
      void lockOn;

      /* pills fly from the switches into the viewport corner */
      pills.forEach((o, k) => {
        const t1 = tPill[k], t0 = tClose + .02 + k * .2, q = prog(lt, t0, t1 - t0), e = ease.inOut(q);
        const [bx, by] = btnC(o.i), [tx, ty] = pillTo(k);
        const x0 = bx - o.w / 2, y0 = by - 20;
        const x = lerp(x0, tx, e), y = lerp(y0, ty, e) - Math.sin(Math.PI * e) * 70;
        const land = bump(lt, t1 + .08, .3);
        o.p.style.opacity = lt < t0 ? 0 : clamp(q * 4);
        o.p.style.transform = `translate(${x}px,${y}px) scale(${lerp(.72, 1, e) + .08 * land})`;
        o.p.style.boxShadow = `0 0 ${22 + 30 * land}px ${rgba(o.m.c, .35 + .4 * land)}`;
      });

      /* keys + pie */
      keysUp(lt);
      const pq = prog(lt, tPie, .5);
      pie.style.opacity = lt < tPie ? 0 : 1;
      pieDisc.style.opacity = ease.out(prog(lt, tPie, .45)); pieDisc.style.transform = `scale(${lerp(.7, 1, ease.expo(prog(lt, tPie, .6)))})`;
      pieRing.style.transform = `scale(${lerp(.3, 1, ease.back(clamp(pq * 1.4)))})`;
      pieRing.style.opacity = clamp(pq * 4);
      fade(pieTitle, lt, tPie + .15, .4);
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
