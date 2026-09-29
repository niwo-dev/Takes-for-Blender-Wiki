// Sequencer: every scene strip plays with the take it will render. The playhead plays, then is
// scrubbed across three strips; the preview monitor cuts to each strip's take and the Takes sidebar
// names the take this frame renders. When the scrub settles, the monitor slides aside and
// "THE PREVIEW IS THE EDIT." lands in its own clear zone.
// All timing is relative to the VO lines (ctx.line / ctx.lineEnd / ctx.dur).
import { defineScene, el, ease, prog, clamp, lerp, rgba, mixHex, R3D, THREE } from '../engine.js';
import { icon, headline, Cursor, canvas3d, float } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const bump = (lt, t, w) => Math.max(0, 1 - Math.abs(lt - t) / w);

/* ---------- edit: three scene strips, each rendering its own take ---------- */
const STRIPS = [
  { scene: 'Lifestyle', take: 'Take 2', c: '#e87d0d', f0: 0, f1: 100 },
  { scene: 'Studio', take: 'Take 1', c: '#3a7bc8', f0: 100, f1: 220 },
  { scene: 'Outdoor', take: 'Take 3', c: '#2fc4b2', f0: 220, f1: 330 },
];
const LOOKS = [   // one cached render per strip: variant, pose, camera, lights, backdrop
  { v: 'gold', rot: [.14, -.62, 0], cam: [.3, .9, 12.4], at: [0, .15, 0], key: ['#ffd6a8', 2.0], warm: 70, cool: 10,
    bg: 'radial-gradient(ellipse 75% 70% at 45% 40%,#6a3c18,#2a170b 55%,#100906)', th: ['#6a3c18', '#1a0e07'] },
  { v: 'silver', rot: [.28, -.32, 0], cam: [-.4, 2.2, 11.6], at: [0, -.1, 0], key: ['#ffffff', 1.9], warm: 14, cool: 60,
    bg: 'radial-gradient(ellipse 70% 70% at 50% 35%,#34425a,#141b26 60%,#07090d)', th: ['#34425a', '#0b0f16'] },
  { v: 'black', rot: [.05, .75, .08], cam: [1.2, .3, 10.2], at: [.4, 0, 0], key: ['#fff4e0', 3.0], warm: 25, cool: 30,
    bg: 'radial-gradient(ellipse 62% 58% at 50% 40%,rgba(47,196,178,.26),transparent 72%),radial-gradient(ellipse 85% 80% at 50% 42%,#173c46,#0b1b21 55%,#05090b)', th: ['#1d4a52', '#081216'] },
];
/* ---------- layout ---------- */
const MW = 1000, MH = 562;
const MON0 = { x: 460, y: 104 }, MON1 = { x: 120, y: 104 };          // monitor: centred while playing, left for the statement
const SQ = { x: 120, y: 726, w: 1680, h: 226 };                      // sequencer panel
const SIDE_W = 390;                                                   // docked sidebar (Takes tab) at the right
const TX0 = SQ.x + 24, TX1 = SQ.x + SQ.w - SIDE_W - 24;               // track area
const FMAX = 330, X = f => TX0 + f / FMAX * (TX1 - TX0), F = x => (x - TX0) / (TX1 - TX0) * FMAX;
const HEADH = 42, RUL = { y: SQ.y + HEADH + 4, h: 38 }, CH2 = { y: SQ.y + HEADH + 48, h: 64 }, CH1 = { y: SQ.y + HEADH + 122, h: 40 };

defineScene({
  id: 's14_sequencer',
  transitionIn: 'pushUp',
  camera: { zoom: .03 },
  mood: { a: '#3a7bc8', b: '#2fc4b2', grid: .3, part: .8, glow: 1, ax: .25, ay: .2, bx: .8, by: .7 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    /* ---------- timing ---------- */
    const tCross1 = L(0) + .85;                 // playing: Lifestyle -> Studio
    const tGrab = L(0) + 1.5;                   // cursor grabs the playhead
    const tOut = tGrab + .55, tHold = tGrab + .85, tBack = tGrab + 1.35;   // scrub to Outdoor, hold, back to Studio
    const tMove = ctx.lineEnd(0) - .05;         // scrub has settled: monitor slides aside
    const tState = L(1);                        // the statement lands
    const SPEED = 40;                           // frames per second while playing
    const fPlay = lt => Math.max(4, 100 + (lt - tCross1) * SPEED);
    const PARK = 160;

    /* ---------- monitor with three cached looks ---------- */
    const mon = el(`<div class="abs" style="left:0;top:0;width:${MW}px;height:${MH}px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.14);
      background:#07080b;box-shadow:0 40px 100px rgba(0,0,0,.6)"></div>`);
    root.appendChild(mon);
    const scene3 = R3D.scene();
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene3.add(pivot);
    const cam = R3D.camera(30);
    const lights = scene3.userData.lights;
    const looks = LOOKS.map((o, k) => {
      const lay = el(`<div class="abs" style="left:0;top:0;width:${MW}px;height:${MH}px;background:${o.bg};opacity:0;transform-origin:50% 50%"></div>`);
      mon.appendChild(lay);
      lay.appendChild(el(`<div class="abs" style="left:${MW / 2 - 300}px;top:${MH - 120}px;width:600px;height:80px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.5),transparent)"></div>`));
      const cv = canvas3d(lay, { x: 0, y: 0, w: MW, h: MH });
      paintWatch(watch, o.v); setTime(watch, 30 + k * 700);
      pivot.rotation.set(...o.rot);
      lights.key.color.set(o.key[0]); lights.key.intensity = o.key[1]; lights.rimW.intensity = o.warm; lights.rimC.intensity = o.cool;
      cam.position.set(...o.cam); cam.lookAt(...o.at);
      cv.draw(scene3, cam);                                           // rendered once, reused every frame
      return { lay, cv: cv.canvas };
    });
    const colorBar = el(`<div class="abs" style="left:0;right:0;bottom:0;height:5px"></div>`);
    mon.appendChild(colorBar);
    mon.appendChild(el(`<div class="abs" style="inset:0;background:linear-gradient(115deg,rgba(255,255,255,.07),transparent 38%);pointer-events:none"></div>`));
    const flash = el(`<div class="abs" style="inset:0;background:#fff;opacity:0"></div>`);
    mon.appendChild(flash);

    /* ---------- sequencer panel ---------- */
    const sq = el(`<div class="glass abs" style="left:${SQ.x}px;top:${SQ.y}px;width:${SQ.w}px;height:${SQ.h}px;border-radius:12px;overflow:hidden">
      <div class="abs" style="left:20px;top:0;height:${HEADH}px;display:flex;align-items:center;gap:10px">${icon('strip', 20, '#9aa3b5')}<span class="disp6" style="font-size:19px;color:#c9d1de">Video Sequencer</span></div>
      <div class="abs" style="left:0;right:0;top:${HEADH - 1}px;height:1px;background:rgba(255,255,255,.07)"></div>
      <div class="abs" style="right:${SIDE_W}px;top:${HEADH}px;bottom:0;width:1px;background:rgba(255,255,255,.1)"></div></div>`);
    root.appendChild(sq);
    const S = (x, y) => [x - SQ.x, y - SQ.y];                          // stage -> panel coords
    // ruler ticks (no numbers: nothing for the playhead to cross)
    let ticks = '';
    for (let f = 0; f <= FMAX; f += 10) { const [x] = S(X(f), 0); ticks += `<div class="abs" style="left:${x - 1}px;top:${f % 50 ? 24 : 16}px;width:2px;height:${f % 50 ? 8 : 16}px;background:rgba(255,255,255,${f % 50 ? .12 : .25})"></div>`; }
    sq.appendChild(el(`<div class="abs" style="left:0;top:${RUL.y - SQ.y}px;width:${SQ.w}px;height:${RUL.h}px">${ticks}</div>`));
    // channel backgrounds
    for (const ch of [CH2, CH1]) sq.appendChild(el(`<div class="abs" style="left:${S(TX0, 0)[0] - 8}px;top:${ch.y - SQ.y}px;width:${TX1 - TX0 + 16}px;height:${ch.h}px;border-radius:8px;background:rgba(255,255,255,.025)"></div>`));
    // audio strip (waveform only)
    let wave = ''; for (let i = 0; i < 150; i++) { const a = .25 + .75 * Math.abs(Math.sin(i * .37) * Math.cos(i * .11 + 1) * (0.7 + .3 * Math.sin(i * 1.7))); wave += `M${(i * (TX1 - TX0) / 150).toFixed(1)} ${(CH1.h / 2 - a * 15).toFixed(1)}V${(CH1.h / 2 + a * 15).toFixed(1)}`; }
    sq.appendChild(el(`<svg class="abs" width="${TX1 - TX0}" height="${CH1.h}" style="left:${S(TX0, 0)[0]}px;top:${CH1.y - SQ.y}px;border-radius:8px;background:rgba(47,196,178,.12);border:1px solid rgba(47,196,178,.3)"><path d="${wave}" stroke="rgba(47,196,178,.6)" stroke-width="3" stroke-linecap="round"/></svg>`));
    // playhead line sits BEHIND the scene strips so it never crosses a strip label
    const phLine = el(`<div class="abs" style="left:0;top:${RUL.y - SQ.y + 18}px;width:3px;height:${CH1.y + CH1.h - RUL.y - 18}px;margin-left:-1.5px;background:#f5a623;box-shadow:0 0 10px rgba(245,166,35,.8)"></div>`);
    sq.appendChild(phLine);
    const strips = STRIPS.map((s, k) => {
      const [x] = S(X(s.f0), 0), w = X(s.f1) - X(s.f0) - 4;
      const e = el(`<div class="abs" style="left:${x + 2}px;top:${CH2.y - SQ.y}px;width:${w}px;height:${CH2.h}px;border-radius:8px;overflow:hidden;
        background:linear-gradient(180deg,${mixHex(s.c, '#0a0a0c', .05)},${mixHex(s.c, '#0a0a0c', .28)});border:2px solid ${s.c};display:flex;align-items:center;gap:14px;padding-left:6px">
        <canvas width="88" height="50" style="width:88px;height:50px;border-radius:5px;flex:none;box-shadow:0 0 0 1px rgba(0,0,0,.35)"></canvas>
        <span class="disp6" style="font-size:22px;color:#fff;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,.35)">${s.scene} · ${s.take}</span></div>`);
      sq.appendChild(e);
      const th = e.querySelector('canvas').getContext('2d'), L2 = LOOKS[k];
      const gr = th.createLinearGradient(0, 0, 0, 50); gr.addColorStop(0, L2.th[0]); gr.addColorStop(1, L2.th[1]);
      th.fillStyle = gr; th.fillRect(0, 0, 88, 50); th.drawImage(looks[k].cv, 0, 0, 88, 50);
      return e;
    });
    const phHead = el(`<div class="abs" style="left:0;top:${RUL.y - SQ.y + 2}px;width:22px;height:26px;margin-left:-11px;border-radius:6px 6px 11px 11px;background:#f5a623;box-shadow:0 0 14px rgba(245,166,35,.7)"></div>`);
    sq.appendChild(phHead);
    // docked sidebar: the take this frame renders
    const sx = SQ.w - SIDE_W + 26;
    sq.appendChild(el(`<div class="abs" style="left:${sx}px;top:${HEADH + 16}px;display:flex;align-items:center;gap:10px">${icon('take', 20, '#9aa3b5')}<span class="disp6" style="font-size:20px;color:#c9d1de">Takes</span></div>`));
    sq.appendChild(el(`<div class="abs mono" style="left:${sx}px;top:${HEADH + 64}px;font-size:16px;letter-spacing:.18em;color:#6b7385">RENDERS</div>`));
    const bar = el(`<div class="abs" style="left:${sx}px;top:${HEADH + 96}px;width:5px;height:44px;border-radius:3px"></div>`);
    sq.appendChild(bar);
    const valBox = el(`<div class="abs" style="left:${sx + 20}px;top:${HEADH + 92}px;width:${SIDE_W - 60}px;height:54px;overflow:hidden"></div>`);
    sq.appendChild(valBox);
    const vals = STRIPS.map(s => { const v = el(`<div class="abs disp6" style="left:0;top:4px;font-size:32px;color:#fff;white-space:nowrap;opacity:0">${s.scene} · ${s.take}</div>`); valBox.appendChild(v); return v; });

    /* ---------- cursor scrubs the playhead (tip rides in the ruler, never over a label) ---------- */
    const headY = RUL.y + 12;
    const cursor = new Cursor(root, ctx, [
      { t: tGrab - .9, x: 1380, y: 696 },                           // enters through the gap above the panel
      { t: tGrab - .28, x: X(fPlay(tGrab)) + 30, y: 700 },
      { t: tGrab, x: X(fPlay(tGrab)), y: headY, click: true },
      { t: tOut, x: X(285), y: headY },
      { t: tHold, x: X(285), y: headY },
      { t: tBack, x: X(PARK), y: headY },
      { t: tBack + .6, x: X(PARK) + 150, y: 690 },
    ], { hideAt: tBack + .35 });
    const frameAt = lt => lt < tGrab ? fPlay(lt) : lt < tBack ? F(cursor.pos(lt)[0]) : PARK;
    const stripAt = f => f < 100 ? 0 : f < 220 ? 1 : 2;
    // crossings (for cut flashes, ticks and the sidebar roll), sampled from the pure frame function
    const CROSS = [];
    { let prev = stripAt(frameAt(-1)); for (let t = -1; t <= ctx.dur + 1; t += 1 / 240) { const s = stripAt(frameAt(t)); if (s !== prev) { CROSS.push({ t, s, from: prev }); prev = s; } } }
    const lastCross = lt => { let c = null; for (const x of CROSS) if (x.t <= lt) c = x; return c; };

    /* ---------- statement ---------- */
    const Hd = headline(root, { x: 1172, y: 222, w: 640, kicker: 'Sequencer', size: 90, lines: ['THE PREVIEW', { t: 'IS THE EDIT.', grad: true }] });

    /* ---------- sound ---------- */
    CROSS.forEach((c, k) => ctx.cue(c.t, 'tick', { gain: .7, pitch: [0, 4, 7, 4][k % 4], pan: (X(STRIPS[Math.max(c.s, c.from)].f0) / 960 - 1) * .5 }));
    ctx.cue(tGrab + .06, 'swish', { gain: .55, pan: .2 });
    ctx.cue(tHold + .04, 'swish', { gain: .5, pan: -.1 });
    ctx.cue(tMove, 'whoosh', { gain: .4, pan: -.3 });
    ctx.cue(tState + .05, 'hit', { gain: .8 });

    return lt => {
      /* monitor position: centred while the edit plays, then slides aside for the statement */
      const mv = ease.inOut(prog(lt, tMove, .55));
      const mx = lerp(MON0.x, MON1.x, mv), my = lerp(MON0.y, MON1.y, mv);
      mon.style.transform = `translate(${mx}px,${my + float(lt, 3, .7)}px)`;
      const f = frameAt(lt), si = stripAt(f), lc = lastCross(lt);
      looks.forEach((o, k) => {
        o.lay.style.opacity = k === si ? 1 : 0;
        if (k === si) { const since = lc ? lt - lc.t : lt + 1; o.lay.style.transform = `scale(${1.0 + .05 * ease.out(clamp(since / 6))})`; }
      });
      let fl = 0; for (const c of CROSS) fl = Math.max(fl, bump(lt, c.t + .03, .12));
      flash.style.opacity = (fl * .35).toFixed(3);
      colorBar.style.background = STRIPS[si].c;
      mon.style.borderColor = fl > .01 ? rgba(STRIPS[si].c, .4 + .6 * fl) : 'rgba(255,255,255,.14)';

      /* sequencer */
      const sqIn = ease.expo(prog(lt, -.4, .8));
      sq.style.transform = `translateY(${(1 - sqIn) * 40}px)`;
      const px = X(f) - SQ.x;
      phLine.style.left = px + 'px'; phHead.style.left = px + 'px';
      const grabbed = lt >= tGrab && lt < tBack;
      phHead.style.transform = `scale(${grabbed ? 1.15 : 1})`;
      strips.forEach((e, k) => {
        const on = k === si, g = lc && lc.s === k ? bump(lt, lc.t + .08, .35) : 0;
        e.style.borderColor = on ? '#ffffff' : rgba(STRIPS[k].c, 1);
        e.style.boxShadow = on ? `0 0 ${18 + 26 * g}px ${rgba(STRIPS[k].c, .6 + .3 * g)}` : 'none';
        e.style.filter = on ? 'none' : 'saturate(.75) brightness(.8)';
      });
      // sidebar value rolls to the take under the playhead
      const since = lc ? lt - lc.t : 99;
      vals.forEach((v, k) => {
        if (k === si) { const q = ease.expo(clamp(since / .35)); v.style.opacity = clamp(since / .15); v.style.transform = `translateY(${(1 - q) * 40}px)`; }
        else if (lc && k === lc.from && since < .35) { const q = ease.expo(clamp(since / .35)); v.style.opacity = 1 - q; v.style.transform = `translateY(${-q * 40}px)`; }
        else v.style.opacity = 0;
      });
      bar.style.background = STRIPS[si].c; bar.style.boxShadow = `0 0 12px ${STRIPS[si].c}`;

      /* statement */
      Hd.update(lt, tState);
      cursor.update(lt);
    };
  },
});
