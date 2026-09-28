// Multi-Cam: a cut is a timeline marker with a camera on it. Playback hard-cuts the preview exactly where the
// playhead crosses a marker; the cut list mirrors the timeline; every take keeps its own edit.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, headline, panel, Cursor, pop, slide, canvas3d } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const CAMS = {
  A: { c: '#3a7bc8', name: 'Cam_Wide' },     // far, whole watch
  B: { c: '#f5a623', name: 'Cam_Macro' },    // tight on the dial
  C: { c: '#2fc4b2', name: 'Cam_Hero' },     // low three-quarter angle
};
const EDITS = [
  { take: 'Take 2', cuts: [[0, 'A'], [48, 'B'], [96, 'C']] },
  { take: 'Take 3', cuts: [[0, 'B'], [30, 'C'], [70, 'A'], [112, 'B']] },
];
const RANGE = 144, FPS = 60;                                   // timeline frames, playback speed (frames / s)
const PV = { x: 120, y: 124, w: 980, h: 551 };                 // preview (16:9)
const RC = { x: 1148, w: 652 };                                // right column
const TLP = { x: 120, y: 708, w: 1680, h: 264, head: 48 };     // timeline panel
const FX0 = 150, FX1 = 1640;                                   // frame 0 / RANGE inside the timeline panel
const fx = f => FX0 + f / RANGE * (FX1 - FX0);
const camAtFrame = (cuts, f) => { let c = cuts[0][1]; for (const [fr, k] of cuts) if (f >= fr) c = k; return c; };
const cutIdx = (cuts, f) => { let r = 0; cuts.forEach(([fr], i) => { if (f >= fr) r = i; }); return r; };

defineScene({
  id: 's12_multicam',
  transitionIn: 'flash',
  camera: { zoom: .025 },
  mood: { a: '#265787', b: '#e87d0d', grid: .22, part: .45, ax: .3, ay: .35, bx: .8, by: .7, glow: 1 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const tMk = L(0);                                          // markers + Multi-Cam light up as it is named
    const tShrink = L(0) + 1.2, tUI = tShrink + .55;
    const tSwitch = L(1) + .32;
    const PASS = RANGE / FPS;
    // pass 1 plays Take 2 and stops at the end; the switch re-cuts the preview; pass 2 plays Take 3's edit, then holds
    const tPlay = Math.min(tShrink + .25, tSwitch - PASS - .15), tPlay2 = tSwitch + .75;
    const frameAt = lt => lt < tPlay ? 0 : lt < tPlay + PASS ? (lt - tPlay) * FPS : lt < tPlay2 ? RANGE : Math.min(RANGE, (lt - tPlay2) * FPS);
    const tStop = tPlay2 + PASS;
    const editAt = lt => lt < tSwitch ? 0 : 1;
    const camAt = lt => camAtFrame(EDITS[editAt(lt)].cuts, frameAt(lt));
    // every hard cut (for flashes, highlights and sound): sample the pure functions once
    const CUTS = []; { let prev = camAt(0); for (let t = 0; t <= ctx.dur; t += 1 / 240) { const c = camAt(t); if (c !== prev) { CUTS.push([t, c]); prev = c; } } }
    const lastCut = lt => { let r = null; for (const c of CUTS) if (c[0] <= lt) r = c; return r; };

    // ---------- preview (3D, no text inside) ----------
    const pv = el(`<div class="abs" style="left:${PV.x}px;top:${PV.y}px;width:${PV.w}px;height:${PV.h}px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 90px rgba(0,0,0,.55);background:radial-gradient(ellipse 70% 80% at 50% 45%,#232a38,#0e1016 72%)"></div>`);
    root.appendChild(pv);
    const floorGlow = el(`<div class="abs" style="left:0;right:0;bottom:0;height:45%;background:linear-gradient(180deg,transparent,rgba(58,123,200,.08))"></div>`);
    pv.appendChild(floorGlow);
    const view = canvas3d(pv, { x: 0, y: 0, w: PV.w, h: PV.h });
    const corners = el(`<svg class="abs" width="${PV.w}" height="${PV.h}" style="left:0;top:0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5">
      <path d="M28 64V28h36M${PV.w - 64} 28h36v36M28 ${PV.h - 64}v36h36M${PV.w - 64} ${PV.h - 28}h36v-36"/></svg>`);
    pv.appendChild(corners);
    const camBar = el(`<div class="abs" style="left:0;right:0;bottom:0;height:5px"></div>`); pv.appendChild(camBar);
    const cutFlash = el(`<div class="abs" style="inset:0;background:#fff;opacity:0"></div>`); pv.appendChild(cutFlash);

    const scene = R3D.scene({ key: 1.5 });
    const watch = createWatch(); paintWatch(watch, 'silver'); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
    const cam = R3D.camera(30);
    const SHOT = {
      A: t => { cam.fov = 30; cam.position.set(-4.2 + t * .1, 1.4, 16.4); cam.lookAt(0, .1, 0); },
      B: t => { cam.fov = 24; cam.position.set(.8, .62, 6.5 - t * .035); cam.lookAt(.05, .26, 0); },
      C: t => { const a = .5 + t * .03; cam.fov = 26; cam.position.set(Math.sin(a) * 7.0, -.6, Math.cos(a) * 7.0); cam.lookAt(1.1, .1, 0); },
    };

    // ---------- headline: read first, then shrinks to a small title ----------
    const HY = 262;
    const H = headline(root, { x: RC.x, y: HY, w: RC.w, lines: ['ONE TAKE.', { t: 'EVERY ANGLE.', grad: true }], size: 90 });
    H.el.style.transformOrigin = '0 0';
    const HS = .44, HTY = 128 - HY;

    // ---------- camera field + cut list (right column) ----------
    const cf = el(`<div class="abs" style="left:${RC.x}px;top:236px;width:${RC.w}px;height:62px;display:flex;align-items:center;gap:18px;opacity:0">
      <span class="disp6" style="font-size:24px;color:#9aa3b5;white-space:nowrap">Camera</span>
      <div class="fld" style="position:relative;flex:1;height:58px;border-radius:9px;background:rgba(10,10,14,.72);border:1px solid rgba(255,255,255,.16);overflow:hidden"></div></div>`);
    root.appendChild(cf);
    const fld = cf.querySelector('.fld');
    const fVals = {};
    for (const k of 'ABC') {
      const v = el(`<div class="abs" style="left:18px;top:0;height:58px;display:flex;align-items:center;gap:12px">${icon('camera', 26, CAMS[k].c)}<span class="mono" style="font-size:24px;color:${CAMS[k].c}">${CAMS[k].name}</span></div>`);
      fld.appendChild(v); fVals[k] = v;
    }
    const P = panel(root, { x: RC.x, y: 334, w: RC.w, h: 338, title: 'Cuts', icon: 'list' });
    const takeChip = el(`<div class="abs" style="right:66px;top:10px;width:150px;height:34px"></div>`);
    P.el.appendChild(takeChip);
    const tcs = EDITS.map(e => { const d = el(`<div class="abs chip" style="right:0;top:0;font-size:18px;padding:3px 12px;gap:8px;border-color:rgba(255,255,255,.25);color:#eef1f6">${icon('take', 18, '#c9d1de')}${e.take}</div>`); takeChip.appendChild(d); return d; });
    const listRows = EDITS.map(e => e.cuts.map(([f, k], i) => {
      const c = CAMS[k].c;
      const r = el(`<div class="abs" style="left:16px;right:16px;top:${12 + i * 66}px;height:56px;border-radius:8px;background:rgba(10,10,14,.42);border:1px solid rgba(255,255,255,.06);display:flex;align-items:center;gap:14px;padding:0 18px;opacity:0">
        ${icon('marker', 22, c)}<span class="mono" style="font-size:22px;color:#eef1f6;width:84px">F${f}</span>
        <span style="margin-left:auto;display:flex;align-items:center;gap:10px">${icon('camera', 22, c)}<span class="mono" style="font-size:22px;color:${c}">${CAMS[k].name}</span></span></div>`);
      P.body.appendChild(r); return r;
    }));

    // ---------- timeline ----------
    const tl = el(`<div class="glass abs" style="left:${TLP.x}px;top:${TLP.y}px;width:${TLP.w}px;height:${TLP.h}px;overflow:hidden"></div>`);
    root.appendChild(tl);
    const head = el(`<div class="abs" style="left:0;right:0;top:0;height:${TLP.head}px;border-bottom:1px solid rgba(255,255,255,.08)"></div>`);
    tl.appendChild(head);
    const TAB = [{ x: 16, w: 128 }, { x: 150, w: 128 }];
    const tabHL = el(`<div class="abs" style="top:7px;height:34px;border-radius:7px;background:rgba(58,123,200,.34);box-shadow:inset 0 0 0 1px rgba(120,170,230,.45)"></div>`);
    head.appendChild(tabHL);
    const tabs = EDITS.map((e, i) => { const d = el(`<div class="abs disp6" style="left:${TAB[i].x}px;top:7px;width:${TAB[i].w}px;height:34px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:20px;color:#c9d1de">${icon('take', 18, '#9aa3b5')}${e.take}</div>`); head.appendChild(d); return d; });
    const mc = el(`<div class="abs" style="right:14px;top:7px;height:34px;display:flex;align-items:center;gap:10px;padding:0 12px;border-radius:7px;border:1px solid rgba(255,255,255,.16)">
      ${icon('camera', 20, '#9aa3b5')}<span class="disp6" style="font-size:20px;color:#c9d1de">Multi-Cam</span>
      <span class="tog" style="position:relative;width:40px;height:22px;border-radius:11px;background:rgba(255,255,255,.12)"><i style="position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#9aa3b5"></i></span></div>`);
    head.appendChild(mc);
    const tog = mc.querySelector('.tog'), togK = tog.querySelector('i'), mcLbl = mc.querySelector('span');
    // ruler
    const RY = TLP.head;
    let ticks = '';
    for (let f = 0; f <= RANGE; f += 6) ticks += `<path d="M${fx(f)} ${f % 24 ? 30 : 20}V40" stroke="rgba(255,255,255,${f % 24 ? .14 : .3})" stroke-width="1.5"/>`;
    const ruler = el(`<svg class="abs" width="${TLP.w}" height="44" style="left:0;top:${RY}px;overflow:visible">${ticks}
      ${[0, 48, 96, 144].map(f => `<text x="${fx(f) + 6}" y="17" font-family="JetBrains Mono" font-size="16" fill="#8790a3">${f}</text>`).join('')}</svg>`);
    tl.appendChild(ruler);
    const rNums = [...ruler.querySelectorAll('text')].map(t => ({ t, c: parseFloat(t.getAttribute('x')) + t.getComputedTextLength() / 2, w: t.getComputedTextLength() }));
    // range bar
    tl.appendChild(el(`<div class="abs" style="left:${FX0}px;width:${FX1 - FX0}px;top:${RY + 42}px;height:2px;background:rgba(255,255,255,.1)"></div>`));
    // camera segments lane + marker flags
    const LANE_Y = RY + 100, LANE_H = 40, FLAG_Y = RY + 52;
    const segs = [0, 1, 2, 3].map(() => { const s = el(`<div class="abs" style="top:${LANE_Y}px;height:${LANE_H}px;border-radius:6px;opacity:0"></div>`); tl.appendChild(s); return s; });
    const flags = [0, 1, 2, 3].map(() => {
      // one prebuilt icon + name per camera; the visible one follows the marker's camera
      const f = el(`<div class="abs" style="top:${FLAG_Y}px;height:40px;opacity:0">${'ABC'.split('').map(k => `<div class="abs v${k}" style="left:-4px;top:4px;height:32px;display:flex;align-items:center;gap:8px;padding:0 10px 0 4px;border-radius:6px;background:rgba(12,14,20,.92)">${icon('marker', 24, CAMS[k].c)}<span class="mono" style="font-size:18px;white-space:nowrap;color:${CAMS[k].c}">${CAMS[k].name}</span></div>`).join('')}</div>`);
      tl.appendChild(f); return { f, v: { A: f.querySelector('.vA'), B: f.querySelector('.vB'), C: f.querySelector('.vC') } };
    });
    // playhead
    const ph = el(`<div class="abs" style="top:${RY - 2}px;width:0;height:${TLP.h - RY - 14}px">
      <div class="abs" style="left:-1.5px;top:22px;width:3px;bottom:0;background:#f5a623;box-shadow:0 0 12px rgba(245,166,35,.7)"></div>
      <div class="abs mono phn" style="left:-26px;top:0;width:52px;height:24px;border-radius:5px;background:#f5a623;color:#0a0a0c;font-size:16px;display:flex;align-items:center;justify-content:center"></div></div>`);
    tl.appendChild(ph);
    const phn = ph.querySelector('.phn');
    flags.forEach(fl => tl.appendChild(fl.f));                  // labels sit above the playhead line: it passes behind them

    // ---------- cursor: switch to Take 3 ----------
    const tabX = TLP.x + TAB[1].x + TAB[1].w - 10, tabY = TLP.y + 7 + 20;
    // enters and leaves straight up/down through the gap between the first two flag labels (never over words)
    const cursor = new Cursor(root, ctx, [{ t: tSwitch - 1.0, x: tabX + 14, y: 1090 }, { t: tSwitch, x: tabX, y: tabY, click: true }, { t: tSwitch + .9, x: tabX + 16, y: 1095 }], { hideAt: tSwitch + .55 });

    // ---------- sound ----------
    ctx.cue(tMk, 'pop', { gain: .6, pan: .6 });
    [0, 1, 2].forEach(i => ctx.cue(tMk + .12 + i * .14, 'tick', { gain: .55, pitch: i * 3, pan: -.5 + i * .4 }));
    ctx.cue(tShrink + .05, 'swish', { gain: .45, pan: .5 });
    CUTS.forEach(([t], i) => ctx.cue(t, 'shutter', { gain: .75, pitch: (i % 3) - 1, pan: -.2 }));
    ctx.cue(tSwitch + .05, 'swish', { gain: .7, pan: 0 });
    ctx.cue(tPlay + PASS, 'tick', { gain: .5, pan: .3 });
    if (tStop < ctx.dur) ctx.cue(tStop, 'thud', { gain: .45 });

    // marker positions over time: Take 2's markers slide to Take 3's frames (a 4th one pops in)
    const SL = .55;
    const markerAt = (i, lt) => {
      const a = EDITS[0].cuts[i], b = EDITS[1].cuts[i];
      if (!a) return b ? { f: b[0], k: b[1], a: ease.back(prog(lt, tSwitch + .3, .45)), q: 1 } : null;
      if (!b) return { f: a[0], k: a[1], a: 1, q: 0 };
      const q = ease.inOut(prog(lt, tSwitch + i * .06, SL));
      return { f: lerp(a[0], b[0], q), k: q < .5 ? a[1] : b[1], a: 1, q };
    };

    return lt => {
      // ---- headline, then hand-off ----
      H.update(lt, -.1);
      const hs = ease.inOut(prog(lt, tShrink, .7));
      H.el.style.transform = `translateY(${HTY * hs}px) scale(${lerp(1, HS, hs)})`;
      const ui = ease.expo(prog(lt, tUI, .8));
      cf.style.opacity = clamp((lt - tUI) / .3); cf.style.transform = `translateX(${(1 - ui) * 60}px)`;
      P.el.style.opacity = clamp((lt - tUI - .1) / .3); P.el.style.transform = `translateX(${(1 - ease.expo(prog(lt, tUI + .1, .8))) * 60}px)`;

      // ---- state ----
      const f = frameAt(lt), ei = editAt(lt), k = camAt(lt), lc = lastCut(lt);
      const since = lc ? lt - lc[0] : 99;

      // ---- preview ----
      const t = lt;
      SHOT[k](t); cam.aspect = PV.w / PV.h; cam.updateProjectionMatrix();
      watch.userData.M.glass.visible = k !== 'B';   // the crystal is invisible full-frame but costly in software rendering
      pivot.rotation.set(0, -.32 + Math.sin(lt * .35) * .08, 0);
      setTime(watch, lt * 5 + 50);
      view.draw(scene, cam);
      camBar.style.background = CAMS[k].c; camBar.style.boxShadow = `0 0 18px ${CAMS[k].c}`;
      cutFlash.style.opacity = Math.max(0, .28 - since * 2.2);
      pv.style.borderColor = since < .3 ? `rgba(255,255,255,${.14 + (.3 - since) * 2.4})` : 'rgba(255,255,255,.14)';

      // ---- camera field ----
      for (const key of 'ABC') {
        const v = fVals[key];
        if (key === k) { const q = lc && lc[1] === key ? ease.out(clamp(since / .22)) : 1; v.style.opacity = q; v.style.transform = `translateY(${(1 - q) * 30}px)`; }
        else { const was = lc && CUTS.indexOf(lc) > 0 ? CUTS[CUTS.indexOf(lc) - 1][1] : 'A'; const q = key === was ? 1 - ease.out(clamp(since / .22)) : 0; v.style.opacity = q; v.style.transform = `translateY(${-(1 - q) * 30}px)`; }
      }
      fld.style.borderColor = CAMS[k].c + (since < .4 ? 'ff' : '88');
      fld.style.boxShadow = since < .4 ? `0 0 ${(.4 - since) * 50}px ${CAMS[k].c}88` : 'none';

      // ---- cut list (mirrors the timeline) ----
      const sw = clamp((lt - tSwitch) / .3);
      EDITS.forEach((e, j) => {
        tcs[j].style.opacity = j ? sw : 1 - sw;
        e.cuts.forEach(([fr, key], i) => {
          const r = listRows[j][i];
          const vis = j === 0 ? 1 - sw : ease.out(prog(lt, tSwitch + .15 + i * .08, .4));
          const inn = ease.out(prog(lt, tUI + .25 + i * .08, .5));
          r.style.opacity = vis * inn; r.style.transform = `translateX(${(1 - (j === 0 ? inn : vis)) * 40}px)`;
          const active = ei === j && cutIdx(e.cuts, f) === i && lt >= tPlay - .01;
          const glow = active ? Math.max(0, 1 - since / .5) : 0;
          r.style.background = active ? `${CAMS[key].c}2e` : 'rgba(10,10,14,.42)';
          r.style.borderColor = active ? CAMS[key].c : 'rgba(255,255,255,.06)';
          r.style.boxShadow = active ? `0 0 ${8 + glow * 26}px ${CAMS[key].c}66` : 'none';
        });
      });

      // ---- timeline ----
      const tq = ease.inOut(prog(lt, tSwitch, .35));
      tabHL.style.left = lerp(TAB[0].x, TAB[1].x, tq) + 'px'; tabHL.style.width = TAB[0].w + 'px';
      tabs.forEach((d, i) => { d.style.color = (i === 1 ? tq > .5 : tq <= .5) ? '#ffffff' : '#8790a3'; });
      const mOn = clamp((lt - tMk) / .25);
      tog.style.background = mOn > .5 ? '#f5a623' : 'rgba(255,255,255,.12)'; togK.style.left = lerp(3, 21, ease.out(mOn)) + 'px'; togK.style.background = mOn > .5 ? '#ffffff' : '#9aa3b5';
      mc.style.borderColor = mOn > .5 ? 'rgba(245,166,35,.7)' : 'rgba(255,255,255,.16)';
      mc.style.boxShadow = `0 0 ${Math.max(0, 1 - Math.abs(lt - tMk - .2) / .5) * 26}px rgba(245,166,35,.6)`;
      mcLbl.style.color = mOn > .5 ? '#ffffff' : '#c9d1de';

      const ms = [0, 1, 2, 3].map(i => markerAt(i, lt));
      ms.forEach((m, i) => {
        const fl = flags[i];
        if (!m) { fl.f.style.opacity = 0; return; }
        for (const key of 'ABC') fl.v[key].style.display = key === m.k ? 'flex' : 'none';
        const popIn = i < 3 ? ease.back(prog(lt, tMk + .12 + i * .14, .4)) : m.a;
        fl.f.style.left = (fx(m.f) - 5) + 'px';
        fl.f.style.opacity = clamp(popIn * 3) * (m.q > .35 && m.q < .65 ? .35 : 1);
        const hit = lc && lc[1] === m.k && Math.abs(fx(frameAt(lc[0])) - fx(m.f)) < 3 ? Math.max(0, 1 - since / .45) : 0;
        fl.f.style.transform = `translateY(${(1 - popIn) * -14}px) scale(${1 + hit * .12})`;
        fl.f.style.filter = hit ? `drop-shadow(0 0 ${hit * 12}px ${CAMS[m.k].c})` : 'none';
        // segment from this marker to the next one
        const nxt = ms.slice(i + 1).find(n => n && n.a > .001);
        const x0 = fx(m.f), x1 = nxt ? lerp(FX1, fx(nxt.f), clamp(nxt.a)) : FX1;
        const sg = segs[i];
        sg.style.left = x0 + 'px'; sg.style.width = Math.max(0, x1 - x0 - 4) + 'px';
        sg.style.background = `linear-gradient(180deg,${CAMS[m.k].c}55,${CAMS[m.k].c}22)`;
        sg.style.boxShadow = `inset 0 2px 0 ${CAMS[m.k].c}`;
        sg.style.opacity = clamp(popIn * 2);
      });
      ph.style.left = fx(f) + 'px';
      phn.textContent = Math.floor(f);
      // ruler numbers step aside while the playhead's frame box covers them
      rNums.forEach(n => { n.t.style.opacity = clamp((Math.abs(fx(f) - n.c) - 26 - n.w / 2) / 12); });

      cursor.update(lt);
    };
  },
});
