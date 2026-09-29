// s01 — the problem: a project folder fills with near-identical saved copies. The FINAL ones light up,
// a search for "approved" returns conflicting matches, the folder falls apart and the question lands.
// Every time is relative to the VO lines (ctx.line / lineEnd / dur).
import { defineScene, el, ease, prog, clamp, lerp, rng } from '../engine.js';
import { icon, Cursor, typer } from '../ui.js';

// window geometry (stage px); body coordinates start below the 46 px title bar
const WX = 320, WY = 120, WW = 1280, WH = 790, HEAD = 46;
const TOOL = 68, COLH = 40, LTOP = TOOL + COLH, RH = 44, VIS = 13, LH = VIS * RH;
const PLY = 926;                           // floating plates (Save As keys, counter) sit below the window
const MODX = 780;                          // Modified column (window x)

// [name, modified]; 0-3 exist at t=0, 4-9 come from Save As presses, 10-15 flood in before "Final",
// 16-26 avalanche in after it (so rows 3-15 are on screen when the FINAL files light up)
const FILES = [
  ['watch_v1.blend', 'Mar 02  10:14'], ['watch_v2.blend', 'Mar 03  16:52'], ['watch_v2_client.blend', 'Mar 04  09:31'],
  ['watch_v3_FINAL.blend', 'Mar 05  23:48'], ['watch_v3_FINAL_2.blend', 'Mar 06  01:12'], ['watch_v4_FINAL_really.blend', 'Mar 06  02:40'],
  ['watch_v5_gold.blend', 'Mar 09  11:05'], ['watch_v5_gold_NEW.blend', 'Mar 09  18:27'], ['watch_v5_silver_fix.blend', 'Mar 10  08:56'],
  ['watch_v6_matte_black.blend', 'Mar 11  14:33'], ['watch_v6_approved?.blend', 'Mar 11  19:02'], ['watch_v7_FINAL_FINAL.blend', 'Mar 12  00:47'],
  ['watch_v7_client_notes.blend', 'Mar 12  10:20'], ['watch_v8_approved_gold.blend', 'Mar 13  17:45'], ['watch_v8_silver_v2.blend', 'Mar 13  22:10'],
  ['watch_v8_black_OLD.blend', 'Mar 14  01:38'], ['watch_v9_USE_THIS.blend', 'Mar 16  09:02'], ['watch_v9_client_approved.blend', 'Mar 16  15:40'],
  ['watch_v9_gold_warmer.blend', 'Mar 17  11:11'], ['watch_v10_FINAL_v3.blend', 'Mar 18  23:59'], ['watch_v10_backup.blend', 'Mar 19  00:03'],
  ['watch_v10_approved_FINAL.blend', 'Mar 19  13:26'], ['watch_v11_DONT_TOUCH.blend', 'Mar 20  08:48'], ['watch_v11_strap_test.blend', 'Mar 20  16:05'],
  ['watch_v12_approved_v2.blend', 'Mar 23  10:37'], ['watch_v12_really_final.blend', 'Mar 23  21:14'], ['watch_v12_FINAL_FINAL_2.blend', 'Mar 24  02:51'],
];
const HILITE = [3, 4, 5, 11];              // FINAL rows that light up on "Final. Final, really."

const hash = (a, b) => { let h = (Math.imul(a + 11, 374761393) + Math.imul(b + 7, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const markup = s => s.replace(/(FINAL|final)/g, '<span class="fin">$1</span>').replace(/approved/g, '<span class="apr">approved</span>');
const DOC = (w = 22, ring = '#e87d0d', stroke = '#8a93a6', fill = '#1b1e25') => `<svg width="${w}" height="${Math.round(w * 26 / 22)}" viewBox="0 0 22 26" style="display:block;flex:none">
  <path d="M3 1h10l6 6v17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>
  <path d="M13 1v6h6" fill="none" stroke="${stroke}" stroke-width="1.4"/><circle cx="10.5" cy="16.5" r="3.8" fill="none" stroke="${ring}" stroke-width="2"/></svg>`;
// a saved copy as a pure graphic: a file tile with no text
const TILE = (w, ring, border = 'rgba(255,255,255,.14)', bg = 'linear-gradient(180deg,rgba(40,62,92,.6),rgba(16,16,22,.85))') => `<div class="abs" style="left:0;top:0;width:${w}px;height:${Math.round(w * 1.22)}px;border-radius:${Math.round(w * .1)}px;opacity:0;
  background:${bg};border:1px solid ${border};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(w * .09)}px">
  ${DOC(Math.round(w * .42), ring)}<i style="display:block;width:${Math.round(w * .56)}px;height:${Math.max(3, Math.round(w * .05))}px;border-radius:3px;background:rgba(255,255,255,.16)"></i>
  <i style="display:block;width:${Math.round(w * .36)}px;height:${Math.max(3, Math.round(w * .05))}px;border-radius:3px;background:rgba(255,255,255,.1)"></i></div>`;

defineScene({
  id: 's01_folder',
  transitionIn: 'cut',
  camera: false,
  mood: { a: '#265787', b: '#3a1e10', glow: .7, grid: .2, part: .35, ax: .16, ay: .2, bx: .84, by: .82 },
  build(root, ctx) {
    const L = i => ctx.line(i), LE = i => ctx.lineEnd(i), D = ctx.dur;
    const d1 = LE(1) - L(1), d2 = LE(2) - L(2);
    // --- timing, all derived from the VO ---
    const addT = FILES.map((_, i) => {
      if (i < 4) return -99;
      if (i < 10) return lerp(.45, L(0) + .9, Math.pow((i - 4) / 5, .85));          // Save As presses
      if (i < 16) return lerp(L(0) + 1.15, L(1) - .25, Math.pow((i - 10) / 5, .8));   // flood
      return lerp(L(1) + d1 * .9, L(2) - .22, (i - 16) / 10);                        // avalanche
    });
    const PRESSES = addT.slice(4, 10).map(t => t - .05);
    const T_FIN = [0, .22, .58, .82].map(k => L(1) + d1 * k);
    const T_CLICK = L(2) - .15, T_TYPE = L(2) + .02, T_FILTER = L(2) + .45, T_ERR = L(2) + .8;
    const T_GLITCH = L(2) + .9, T_BREAK = L(2) + .95, T_Q = T_BREAK + .32, T_APPROVED = L(2) + d2 * .68;
    const R = rng(101);
    const sizes = FILES.map(() => 121 + Math.round(R() * 46));

    // camera: close on the folder, pull back to the whole folder, lean in on the FINAL rows (world → stage)
    const finFocus = lt => clamp(prog(lt, T_FIN[0] - .12, .3)) * (1 - clamp(prog(lt, L(1) + d1 * .92, .35)));
    const camAt = lt => {
      const pb = ease.inOut(prog(lt, 0, L(0) + 1.7)), fk = ease.inOut(finFocus(lt)), bk = ease.inOut(prog(lt, T_BREAK, .35));
      return { s: lerp(1.7, 1, pb) * (1 + .1 * fk - .03 * bk), fx: lerp(790, 960, pb) - 110 * fk, fy: lerp(350, 515, pb) - 10 * fk };
    };
    const toStage = (x, y, lt) => { const c = camAt(lt); return [960 + (x - c.fx) * c.s, 540 + (y - c.fy) * c.s]; };

    const bgDim = el('<div class="layer" style="background:#050507;opacity:0"></div>'); root.appendChild(bgDim);
    // the "world" (drifting copies + window) carries the camera: close on the folder, pull back, push on "Final"
    const world = el('<div class="layer" style="transform-origin:0 0"></div>'); root.appendChild(world);

    /* ---- saved copies drifting behind the window (no text: they are graphics) ---- */
    const GR = rng(23);
    const spots = [[40, 90], [120, 380], [30, 640], [150, 860], [1660, 60], [1720, 330], [1640, 600], [1740, 840], [520, 10], [980, 0], [1320, 20], [760, 960],
      [1180, 980], [360, 960], [230, 200], [1560, 420]];
    const ghosts = spots.map(([x, y], k) => {
      const w = 84 + Math.round(GR() * 50);
      const g = el(TILE(w, GR() < .7 ? '#e87d0d' : '#3a7bc8')); g.style.left = x + 'px'; g.style.top = y + 'px';
      world.appendChild(g);
      return { g, a: .3 + GR() * .3, t: -1 + k * .32 * (L(1) / 4) + GR() * .3, ph: GR() * 6.28, dir: GR() < .5 ? -1 : 1, r0: (GR() - .5) * 16 };
    });

    /* ---- the file browser window ---- */
    const win = el(`<div class="glass abs" style="left:${WX}px;top:${WY}px;width:${WW}px;height:${WH}px;overflow:hidden;transform-origin:50% 50%;
      background:linear-gradient(180deg,rgba(38,70,108,.45),rgba(14,15,20,.9))">
      <div class="abs" style="left:0;right:0;top:0;height:${HEAD}px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:9px;padding-left:20px">
        <i style="width:13px;height:13px;border-radius:50%;background:#e5484d;opacity:.8"></i><i style="width:13px;height:13px;border-radius:50%;background:#f5a623;opacity:.8"></i><i style="width:13px;height:13px;border-radius:50%;background:#2fc4b2;opacity:.8"></i></div>
      <div class="abs body" style="left:0;right:0;top:${HEAD}px;bottom:0"></div></div>`);
    world.appendChild(win);
    const body = win.querySelector('.body');
    body.appendChild(el(`<div class="abs" style="left:20px;top:16px;display:flex;gap:10px">
      <div style="width:38px;height:36px;border-radius:7px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;transform:scaleX(-1)">${icon('chevR', 20, '#6b7385')}</div>
      <div style="width:38px;height:36px;border-radius:7px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center">${icon('chevR', 20, '#6b7385')}</div></div>`));
    const pathBar = el(`<div class="abs" style="left:116px;top:13px;width:640px;height:42px;border-radius:8px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.08);overflow:hidden">
      <div class="abs sweep" style="left:0;top:0;width:180px;height:100%;background:linear-gradient(90deg,transparent,rgba(245,166,35,.35),transparent);opacity:0"></div>
      <div class="abs" style="left:14px;top:9px;display:flex;align-items:center;gap:12px">${icon('folder', 22, '#f5a623')}
      <span class="mono" style="font-size:20px;white-space:nowrap"><span style="color:#7d8699">~/Projects/</span><span class="pname" style="color:#eef1f6">Watch_Campaign/</span></span></div></div>`);
    body.appendChild(pathBar);
    const sweep = pathBar.querySelector('.sweep'), pname = pathBar.querySelector('.pname');
    const search = el(`<div class="abs" style="left:846px;top:13px;width:410px;height:42px;border-radius:8px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1)">
      <div class="abs" style="left:12px;top:9px">${icon('search', 22, '#7d8699')}</div>
      <div class="abs mono ph" style="left:46px;top:9px;font-size:20px;color:#5a6273">Search</div>
      <div class="abs mono typed" style="left:46px;top:9px;font-size:20px;color:#eef1f6;white-space:nowrap"></div>
      <div class="abs mono res" style="right:12px;top:11px;font-size:16px;letter-spacing:.08em;color:#e5484d;opacity:0">5 RESULTS</div></div>`);
    body.appendChild(search);
    const sPh = search.querySelector('.ph'), sTyped = search.querySelector('.typed'), sRes = search.querySelector('.res');
    const typing = typer(sTyped, 'approved', { t0: T_TYPE, cps: 22 });   // typing sound: two cues below, not one per key pair
    body.appendChild(el(`<div class="abs mono" style="left:0;right:0;top:${TOOL}px;height:${COLH}px;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.08);font-size:15px;letter-spacing:.16em;color:#6b7385">
      <span class="abs" style="left:70px;top:11px">NAME</span><span class="abs" style="left:${MODX}px;top:11px">MODIFIED</span><span class="abs" style="right:44px;top:11px">SIZE</span></div>`));
    const list = el(`<div class="abs" style="left:0;right:0;top:${LTOP}px;height:${LH}px;overflow:hidden"></div>`); body.appendChild(list);
    // storage bar under the list: fills up as the copies pile up (a graphic, no text)
    const disk = el(`<div class="abs" style="left:24px;right:24px;top:${LTOP + LH + 26}px;height:10px;border-radius:5px;background:rgba(255,255,255,.07);overflow:hidden">
      <div class="abs" style="left:0;top:0;bottom:0;width:100%;border-radius:5px;transform-origin:0 50%;background:linear-gradient(90deg,#e87d0d,#f5a623 55%,#e5484d)"></div></div>`);
    body.appendChild(disk);
    const diskFill = disk.firstElementChild;
    const rows = FILES.map(([name, mod], i) => {
      const r = el(`<div class="abs" style="left:0;top:0;width:${WW}px;height:${RH}px;opacity:0;transform-origin:30% 50%">
        <div class="abs rbg" style="left:10px;right:10px;top:2px;bottom:2px;border-radius:6px"></div>
        <div class="abs bar" style="left:10px;top:6px;bottom:6px;width:4px;border-radius:2px;opacity:0"></div>
        <div class="abs" style="left:30px;top:8px">${DOC(22)}</div>
        <div class="abs mono nm" style="left:70px;top:9px;font-size:20px;white-space:nowrap;color:#dfe3ea">${markup(name)}</div>
        <div class="abs mono" style="left:${MODX}px;top:11px;font-size:18px;color:#838ca0;white-space:nowrap">${mod}</div>
        <div class="abs mono" style="right:44px;top:11px;font-size:18px;color:#838ca0">${sizes[i]} MB</div>
        <div class="abs flag" style="right:12px;top:11px;opacity:0">${icon('alert', 21, '#e5484d')}</div></div>`);
      list.appendChild(r);
      const nm = r.querySelector('.nm');
      return { r, bg: r.querySelector('.rbg'), bar: r.querySelector('.bar'), flag: r.querySelector('.flag'), nm, fin: [...nm.querySelectorAll('.fin')], apr: [...nm.querySelectorAll('.apr')],
        t: addT[i], match: /approved/.test(name), hi: HILITE.indexOf(i) };
    });
    let m = 0; rows.forEach(o => { o.mi = o.match ? m++ : -1; });
    const NMATCH = m;

    /* ---- floating plates below the window: Save As keys + file counter ---- */
    const keys = el(`<div class="abs" style="left:${WX}px;top:${PLY}px;height:64px;display:flex;align-items:center;gap:18px;padding:0 24px 0 12px;border-radius:12px;
      background:linear-gradient(180deg,#1d1d24,#111116);border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 50px rgba(0,0,0,.5)">
      <div class="keys" style="gap:8px">${['Ctrl', 'Shift', 'S'].map(s => `<div class="key" style="height:44px;min-width:44px;padding:0 12px;font-size:20px;border-radius:8px">${s}</div>`).join('<span class="plus" style="font-size:20px">+</span>')}</div>
      <div class="mono" style="font-size:19px;letter-spacing:.18em;color:#f5a623;white-space:nowrap">SAVE AS…</div></div>`);
    root.appendChild(keys);
    const caps = [...keys.querySelectorAll('.key')];
    PRESSES.forEach((t, k) => ctx.cue(t, 'key', { gain: .55 + (k % 2) * .1, pan: -.4 }));
    const counter = el(`<div class="abs" style="right:${1920 - WX - WW}px;top:${PLY}px;height:64px;padding:0 24px;display:flex;align-items:center;gap:13px;border-radius:12px;transform-origin:100% 50%;
      background:linear-gradient(180deg,#1d1d24,#111116);border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 50px rgba(0,0,0,.5);white-space:nowrap">
      ${icon('file', 24, '#f5a623')}<span class="mono cN" style="font-size:28px;color:#eef1f6">3</span><span class="mono" style="font-size:21px;color:#9aa3b5">files</span>
      <span style="width:6px;height:6px;border-radius:50%;background:#6b7385"></span><span class="mono cG" style="font-size:28px;color:#eef1f6">0.4</span><span class="mono" style="font-size:21px;color:#9aa3b5">GB</span></div>`);
    root.appendChild(counter);
    const cN = counter.querySelector('.cN'), cG = counter.querySelector('.cG');

    /* ---- the question: a clean stage once the folder falls apart ---- */
    const dim = el('<div class="layer" style="background:radial-gradient(ellipse 70% 60% at 50% 48%,rgba(6,6,9,.55),rgba(6,6,9,.9));opacity:0"></div>'); root.appendChild(dim);
    const redWash = el('<div class="layer" style="background:radial-gradient(ellipse 80% 75% at 50% 50%,rgba(229,72,77,0) 45%,rgba(229,72,77,.3));opacity:0"></div>'); root.appendChild(redWash);
    // copies swirling at the edges once the search fails (no text)
    const FR = rng(57);
    const fspots = [[60, 110], [90, 800], [1640, 90], [1680, 760], [30, 450], [1760, 430], [420, 880], [1360, 900], [330, 60], [1200, 40]];
    const front = fspots.map(([x, y], k) => {
      const w = 90 + Math.round(FR() * 50);
      const g = el(TILE(w, '#e87d0d')); g.style.left = x + 'px'; g.style.top = y + 'px'; g.style.filter = 'blur(2px)';
      root.appendChild(g);
      return { g, a: .35 + FR() * .25, t: T_Q + .15 + k * .1, ph: FR() * 6.28, dir: FR() < .5 ? -1 : 1, r0: (FR() - .5) * 20 };
    });
    const q = el(`<div class="abs disp" style="left:0;width:1920px;top:300px;text-align:center;font-size:210px;white-space:nowrap;opacity:0">WHICH ONE<span style="color:#e5484d">?</span></div>`);
    root.appendChild(q);
    // the conflicting matches become five red files under the question
    const CW = 118, CGAP = 58, CY = 610, CX0 = 960 - (NMATCH * CW + (NMATCH - 1) * CGAP) / 2;
    const cands = rows.filter(o => o.match).map((_, k) => {
      const c = el(TILE(CW, '#e5484d', 'rgba(229,72,77,.85)', 'linear-gradient(180deg,rgba(70,18,22,.92),rgba(26,10,12,.94))'));
      c.appendChild(el(`<div class="abs disp" style="right:-14px;top:-16px;width:44px;height:44px;border-radius:50%;background:#e5484d;color:#fff;font-size:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(229,72,77,.6)">?</div>`));
      root.appendChild(c); return { c, x: CX0 + k * (CW + CGAP), rot: [-7, 4, -3, 6, -5][k] };
    });

    const [clx, cly] = toStage(WX + 846 + 250, WY + HEAD + 34, T_CLICK);   // empty part of the search field
    const cursor = new Cursor(root, ctx, [
      { t: T_CLICK - .7, x: 1880, y: 330 }, { t: T_CLICK, x: clx, y: cly, click: true }, { t: T_CLICK + .9, x: clx + 300, y: cly - 170 }], { hideAt: T_CLICK + .45 });

    /* ---- sound ---- */
    for (let i = 10; i < 16; i += 2) ctx.cue(addT[i], 'pop', { gain: .5 + (i - 10) * .03, pitch: (i - 10) * 1.5, pan: .25 });
    ctx.cue(L(0) + .05, 'whoosh', { gain: .3 });
    T_FIN.forEach((t, k) => ctx.cue(t, 'blip', { gain: .75, pitch: [0, 3, 5, 8][k], pan: -.3 + k * .15 }));
    ctx.cue(addT[16], 'riser', { gain: .35 });
    ctx.cue(addT[20], 'pop', { gain: .55, pitch: 8, pan: .3 });
    ctx.cue(T_TYPE, 'type', { gain: .5, pan: .2 }); ctx.cue(T_TYPE + .2, 'type', { gain: .45, pan: .2 });
    ctx.cue(T_FILTER, 'tick', { gain: .5 });
    ctx.cue(T_ERR, 'error', { gain: .8 });
    ctx.cue(T_GLITCH, 'glitch', { gain: .9 });
    ctx.cue(T_Q, 'thud', { gain: 1 });
    ctx.cue(T_APPROVED, 'error', { gain: .45, pitch: -3 });
    ctx.cue(lerp(T_APPROVED, D, .5), 'glitch', { gain: .35, pitch: -4 });

    const glitchAt = lt => lt < T_GLITCH ? 0 : Math.exp(-(lt - T_GLITCH) * 5) + .12 + .6 * Math.exp(-Math.pow((lt - lerp(T_APPROVED, D, .5)) * 9, 2));

    return lt => {
      const nSaved = addT.filter(t => lt >= t).length;
      const fk = ease.inOut(prog(lt, T_FILTER, .5));                           // search filter
      const finK = finFocus(lt);                                                // FINAL focus
      const g = glitchAt(lt), gTick = Math.floor(lt * 30);
      const brk = ease.inOut(prog(lt, T_BREAK, .35));                          // the folder falls apart
      const endK = ease.inOut(prog(lt, T_GLITCH, .8));

      const { s, fx, fy } = camAt(lt);
      world.style.transform = `translate(${960 - fx * s}px,${540 - fy * s}px) scale(${s})`;

      const sx = g * (hash(1, gTick) - .5) * 26, sy = g * (hash(2, gTick) - .5) * 12;
      const tl = clamp(lt / D);
      win.style.transform = `perspective(2600px) translate(${sx}px,${sy + brk * 60}px) rotateX(${lerp(3, 1, tl) + brk * 8}deg) rotateY(${lerp(-3, 2.5, tl)}deg) scale(${1 - brk * .12})`;
      win.style.opacity = 1 - brk;
      win.style.filter = brk > .01 ? `blur(${brk * 10}px)` : 'none';
      const sw = prog(lt, L(0), .9);
      sweep.style.opacity = sw > 0 && sw < 1 ? 1 : 0; sweep.style.transform = `translateX(${lerp(-200, 660, ease.inOut(sw))}px)`;
      const hot = Math.max(0, 1 - Math.abs(lt - L(0) - .45) / .6);
      pname.style.color = hot > 0 ? `rgb(${Math.round(lerp(238, 245, hot))},${Math.round(lerp(241, 166, hot))},${Math.round(lerp(246, 35, hot))})` : '#eef1f6';

      // rows: auto-scroll as the folder fills, then filter to the matches
      let scroll = 0; for (let j = VIS; j < FILES.length; j++) scroll += RH * ease.out(prog(lt, addT[j], .28));
      rows.forEach((o, i) => {
        const age = lt - o.t;
        if (age < 0) { o.r.style.opacity = 0; return; }
        const yAll = i * RH - scroll, yF = 8 + o.mi * RH;
        const y = o.match ? lerp(yAll, yF, fk) : yAll;
        const inK = ease.expo(clamp(age / .35));
        const jx = g * (hash(i, gTick) - .5) * 30 * (o.match ? 1 : .4);
        const hk = o.hi >= 0 ? ease.back(prog(lt, T_FIN[o.hi], .4)) * finK : 0;
        o.r.style.transform = `translate(${(1 - inK) * -40 + jx}px,${y}px) scale(${1 + hk * .045})`;
        let op = clamp(age / .2);
        if (!o.match) op *= 1 - clamp(fk * 1.6);
        if (finK > 0 && o.hi < 0) op *= 1 - finK * .65;
        o.r.style.opacity = op;
        const fresh = Math.exp(-age * 3.2), red = o.match ? fk : 0;
        o.bg.style.background = red > 0 ? `rgba(229,72,77,${.16 * red})` : hk > .01 ? `rgba(245,166,35,${.2 * clamp(hk)})` : i % 2 ? 'rgba(255,255,255,.025)' : 'transparent';
        o.bg.style.boxShadow = hk > .01 ? `inset 0 0 0 1px rgba(245,166,35,${.6 * clamp(hk)}),0 0 30px rgba(245,166,35,${.3 * clamp(hk)})`
          : fresh > .02 && red === 0 ? `inset 0 0 0 1px rgba(245,166,35,${fresh * .8}),0 0 ${fresh * 26}px rgba(245,166,35,${fresh * .45})` : 'none';
        o.bar.style.opacity = Math.max(red, clamp(hk)); o.bar.style.background = red > 0 ? '#e5484d' : '#f5a623';
        o.flag.style.opacity = red;
        o.fin.forEach(sp => { sp.style.color = hk > .3 ? '#f5a623' : ''; });
        o.apr.forEach(sp => { sp.style.color = red > .5 ? '#ff6b70' : ''; sp.style.textDecoration = red > .5 ? 'underline 2px' : 'none'; });
        o.nm.style.textShadow = g > .05 && o.match ? `${g * 4}px 0 rgba(229,72,77,.75),${-g * 4}px 0 rgba(58,123,200,.75)` : 'none';
      });
      const clicked = lt >= T_CLICK;
      sPh.style.opacity = clicked ? 0 : 1;
      search.style.borderColor = clicked ? (fk > .5 ? 'rgba(229,72,77,.9)' : 'rgba(245,166,35,.9)') : 'rgba(255,255,255,.1)';
      search.style.boxShadow = clicked ? `0 0 0 3px ${fk > .5 ? 'rgba(229,72,77,.22)' : 'rgba(245,166,35,.2)'}` : 'none';
      if (clicked) typing(lt); else sTyped.innerHTML = '';
      sRes.style.opacity = ease.out(prog(lt, T_ERR - .1, .3));

      // Save As keys
      let down = false, glow = 0;
      for (const p of PRESSES) { const d = lt - p; if (d > -.02 && d < .13) down = true; glow = Math.max(glow, 1 - Math.abs(d - .04) * 3.2); }
      caps.forEach(c => {
        c.style.transform = `translateY(${down ? 4 : 0}px)`;
        c.style.boxShadow = down ? '0 1px 0 #0c0d10,0 3px 8px rgba(0,0,0,.5)' : `0 4px 0 #0c0d10,0 8px 18px rgba(0,0,0,.5),0 0 ${glow * 26}px rgba(245,166,35,${glow * .7})`;
        c.style.borderColor = glow > .05 ? `rgba(245,166,35,${.3 + glow * .7})` : 'rgba(255,255,255,.16)';
      });
      const kOut = ease.inOut(prog(lt, PRESSES[PRESSES.length - 1] + .5, .5));
      keys.style.opacity = 1 - kOut; keys.style.transform = `translateY(${kOut * 24}px)`;

      // counter
      const gb = sizes.slice(0, nSaved).reduce((a, b) => a + b, 0) / 1000;
      cN.textContent = nSaved; cG.textContent = gb.toFixed(1);
      let gbS = 0; addT.forEach((t, i) => { gbS += sizes[i] * ease.out(prog(lt, t, .3)); });
      diskFill.style.transform = `scaleX(${clamp(gbS / 4400)})`;
      const lastT = addT[nSaved - 1], bump = lt - lastT < .25 && lastT > 0 ? Math.exp(-(lt - lastT) * 12) : 0;
      counter.style.transform = `translate(0,${brk * 30}px) scale(${1 + bump * .06})`;
      cN.style.color = bump > .1 ? '#f5a623' : '#eef1f6';
      counter.style.opacity = 1 - brk;

      // copies drifting behind, swirling once the search fails
      const chaos = ease.in(prog(lt, T_GLITCH, 3));
      ghosts.forEach((o, k) => {
        const a = ease.out(prog(lt, o.t, .6));
        const dx = Math.sin(lt * .35 + o.ph) * 18 + o.dir * chaos * 120 * Math.sin(lt * .9 + o.ph);
        const dy = -lt * 5 + Math.cos(lt * .3 + o.ph) * 12 + chaos * 80 * Math.cos(lt * .8 + o.ph);
        o.g.style.opacity = a * o.a;
        o.g.style.transform = `translate(${dx}px,${dy}px) rotate(${o.r0 + chaos * o.dir * 30}deg)`;
      });
      front.forEach((o, k) => {
        const a = ease.out(prog(lt, o.t, .8)), u = Math.max(0, lt - o.t);
        const dx = o.dir * (u * 22 + Math.sin(lt * 1.1 + o.ph) * 26), dy = Math.cos(lt * .9 + o.ph) * 22 - u * 8;
        o.g.style.opacity = a * o.a;
        o.g.style.transform = `translate(${dx}px,${dy}px) rotate(${o.r0 + o.dir * u * 9}deg)`;
      });
      bgDim.style.opacity = endK * .5;

      // the question
      dim.style.opacity = endK;
      redWash.style.opacity = Math.max(Math.exp(-Math.max(0, lt - T_ERR) * 2.2) * (lt >= T_ERR ? .9 : 0), endK * (.3 + .1 * Math.sin(lt * 5)));
      const qp = prog(lt, T_Q, .55), qk = ease.expo(qp);
      const qs = Math.exp(-Math.max(0, lt - T_Q) * 7) * (qp > 0 ? 1 : 0);
      q.style.opacity = clamp(qp * 5);
      q.style.transform = `translate(${(hash(5, gTick) - .5) * qs * 30}px,${(hash(6, gTick) - .5) * qs * 16}px) scale(${lerp(1.45, 1, qk)})`;
      const split = qs * 12 + g * 2;
      q.style.textShadow = `${split}px 0 rgba(229,72,77,.65),${-split}px 0 rgba(58,123,200,.65),0 20px 60px rgba(0,0,0,.6)`;
      // the five matches reappear as red files under the question (once the folder has dissolved)
      cands.forEach(({ c, x, rot }, k) => {
        const p = prog(lt, T_BREAK + .2 + k * .06, .45), kk = ease.back(p);
        const pulse = Math.exp(-Math.max(0, lt - T_APPROVED - k * .05) * 4) * (lt >= T_APPROVED ? 1 : 0);
        const jx = g * (hash(k + 80, gTick) - .5) * 12, jy = g * (hash(k + 90, gTick) - .5) * 8;
        const bob = Math.sin(lt * 1.4 + k) * 6 * clamp(p);
        c.style.left = x + jx + 'px'; c.style.top = CY + (1 - kk) * 40 + jy + bob + 'px';
        c.style.opacity = clamp(p * 4);
        c.style.transform = `rotate(${rot * kk}deg) scale(${lerp(.5, 1, kk) * (1 + pulse * .1)})`;
        c.style.boxShadow = `0 24px 50px rgba(0,0,0,.5),0 0 ${20 + pulse * 40}px rgba(229,72,77,${.3 + pulse * .5})`;
      });
      cursor.update(lt);
    };
  },
});
