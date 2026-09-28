// s01 — the problem: a project folder fills with near-identical saved copies. The FINAL ones pop out,
// a search for "approved" returns conflicting matches, the list glitches and the question lands.
import { defineScene, el, ease, prog, clamp, lerp, rng } from '../engine.js';
import { icon, panel, Cursor, typer } from '../ui.js';

// window geometry (stage px); body coordinates start below the 54 px title bar
const WX = 320, WY = 120, WW = 1280, WH = 790;
const TOOL = 68, COLH = 40, LTOP = TOOL + COLH, RH = 44, VIS = 13, LH = VIS * RH;
const PLY = 926;                           // floating plates (Save As keys, counter) sit below the window
const MODX = 780;                          // Modified column (window x)

// [name, modified, time it is saved (scene-local s)]
const FILES = [
  ['watch_v1.blend', 'Mar 02  10:14', -9],
  ['watch_v2.blend', 'Mar 03  16:52', -9],
  ['watch_v2_client.blend', 'Mar 04  09:31', -9],
  ['watch_v3_FINAL.blend', 'Mar 05  23:48', -9],
  ['watch_v3_FINAL_2.blend', 'Mar 06  01:12', .5],
  ['watch_v4_FINAL_really.blend', 'Mar 06  02:40', 1.05],
  ['watch_v5_gold.blend', 'Mar 09  11:05', 1.36],
  ['watch_v5_gold_NEW.blend', 'Mar 09  18:27', 1.64],
  ['watch_v5_silver_fix.blend', 'Mar 10  08:56', 1.9],
  ['watch_v6_matte_black.blend', 'Mar 11  14:33', 2.13],
  ['watch_v6_approved?.blend', 'Mar 11  19:02', 2.34],
  ['watch_v7_FINAL_FINAL.blend', 'Mar 12  00:47', 2.53],
  ['watch_v7_client_notes.blend', 'Mar 12  10:20', 2.7],
  ['watch_v8_approved_gold.blend', 'Mar 13  17:45', 2.86],
  ['watch_v8_silver_v2.blend', 'Mar 13  22:10', 3.0],
  ['watch_v8_black_OLD.blend', 'Mar 14  01:38', 3.13],
  ['watch_v9_USE_THIS.blend', 'Mar 16  09:02', 3.25],
  ['watch_v9_client_approved.blend', 'Mar 16  15:40', 3.36],
  ['watch_v9_gold_warmer.blend', 'Mar 17  11:11', 3.46],
  ['watch_v10_FINAL_v3.blend', 'Mar 18  23:59', 3.56],
  ['watch_v10_backup.blend', 'Mar 19  00:03', 3.65],
  ['watch_v10_approved_FINAL.blend', 'Mar 19  13:26', 3.74],
  ['watch_v11_DONT_TOUCH.blend', 'Mar 20  08:48', 3.83],
  ['watch_v11_strap_test.blend', 'Mar 20  16:05', 3.92],
  ['watch_v12_approved_v2.blend', 'Mar 23  10:37', 5.62],
  ['watch_v12_really_final.blend', 'Mar 23  21:14', 5.72],
  ['watch_v12_FINAL_FINAL_2.blend', 'Mar 24  02:51', 5.82],
  ['watch_v13_new_strap.blend', 'Mar 25  09:30', 5.92],
];
const POPOUT = [3, 4, 5, 11];              // FINAL files that jump out on "Final. Final, really."
const PRESSES = [.45, 1.0, 1.31, 1.59, 1.85, 2.08];   // Save As presses (each saves one file)

const hash = (a, b) => { let h = (Math.imul(a + 11, 374761393) + Math.imul(b + 7, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const markup = s => s.replace(/(FINAL|final)/g, '<span class="fin">$1</span>').replace(/approved/g, '<span class="apr">approved</span>');
const DOC = (w = 22, ring = '#e87d0d', stroke = '#8a93a6') => `<svg width="${w}" height="${Math.round(w * 26 / 22)}" viewBox="0 0 22 26" style="display:block;flex:none">
  <path d="M3 1h10l6 6v17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#1b1e25" stroke="${stroke}" stroke-width="1.4"/>
  <path d="M13 1v6h6" fill="none" stroke="${stroke}" stroke-width="1.4"/><circle cx="10.5" cy="16.5" r="3.8" fill="none" stroke="${ring}" stroke-width="2"/></svg>`;
const pill = (name, size = 18) => `<div class="abs" style="left:0;top:0;height:${Math.round(size * 2.55)}px;padding:0 ${size}px;display:flex;align-items:center;gap:${Math.round(size * .66)}px;border-radius:9px;white-space:nowrap;opacity:0;
  background:linear-gradient(180deg,rgba(38,58,86,.55),rgba(16,16,22,.8));border:1px solid rgba(255,255,255,.12)">${DOC(Math.round(size * 1.1))}<span class="mono" style="font-size:${size}px;color:#b9c1cf">${name}</span></div>`;

defineScene({
  id: 's01_folder',
  transitionIn: 'cut',
  camera: false,
  mood: { a: '#265787', b: '#3a1e10', glow: .7, grid: .2, part: .45, ax: .16, ay: .2, bx: .84, by: .82 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const T_FIN = [L(1), L(1) + .33, L(1) + .86, L(1) + 1.22];
    const T_FIN_OUT = L(2) - .5;
    const T_CLICK = L(2) - .15, T_TYPE = L(2) + .02, T_FILTER = L(2) + .45, T_ERR = L(2) + .8;
    const T_GLITCH = L(2) + .88, T_Q = L(2) + 1.05, T_CAND = L(2) + 1.85;
    const R = rng(101);
    const sizes = FILES.map(() => 118 + Math.round(R() * 50));

    const bgDim = el('<div class="layer" style="background:#050507;opacity:0"></div>'); root.appendChild(bgDim);
    // the "world" (drifting copies + window) gets the camera move: close on the folder, then pull back
    const world = el('<div class="layer" style="transform-origin:0 0"></div>'); root.appendChild(world);

    /* ---- saved copies drifting behind the window ---- */
    const GR = rng(23);
    const spots = [[30, 110], [40, 400], [20, 700], [120, 960], [1620, 80], [1590, 330], [1640, 600], [1560, 940], [560, 34], [1080, 50], [860, 1000], [360, 1010],
      [200, 250], [1480, 190], [1500, 800], [180, 560]];
    const ghosts = spots.map(([x, y], k) => {
      const g = el(pill(FILES[(k * 7 + 3) % FILES.length][0])); g.style.left = x + 'px'; g.style.top = y + 'px';
      world.appendChild(g);
      return { g, s: .62 + GR() * .34, a: .28 + GR() * .26, t: -1 + k * .4 + GR() * .3, ph: GR() * 6.28, dir: GR() < .5 ? -1 : 1, r0: (GR() - .5) * 8 };
    });

    /* ---- the file browser window ---- */
    const P = panel(world, { x: WX, y: WY, w: WW, h: WH, title: 'Watch_Campaign', icon: 'folderOpen',
      style: 'background:linear-gradient(180deg,rgba(38,70,108,.45),rgba(14,15,20,.88))' });
    const win = P.el, body = P.body;
    win.style.transformOrigin = '50% 50%';
    // toolbar
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
    const typing = typer(sTyped, 'approved', { t0: T_TYPE, cps: 22, ctx });
    // column header
    body.appendChild(el(`<div class="abs mono" style="left:0;right:0;top:${TOOL}px;height:${COLH}px;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.08);font-size:15px;letter-spacing:.16em;color:#6b7385">
      <span class="abs" style="left:70px;top:11px">NAME</span><span class="abs" style="left:${MODX}px;top:11px">MODIFIED</span><span class="abs" style="right:44px;top:11px">SIZE</span></div>`));
    // rows
    const list = el(`<div class="abs" style="left:0;right:0;top:${LTOP}px;height:${LH}px;overflow:hidden"></div>`); body.appendChild(list);
    const rows = FILES.map(([name, mod], i) => {
      const r = el(`<div class="abs" style="left:0;top:0;width:${WW}px;height:${RH}px;opacity:0">
        <div class="abs rbg" style="left:10px;right:10px;top:2px;bottom:2px;border-radius:6px"></div>
        <div class="abs bar" style="left:10px;top:6px;bottom:6px;width:3px;border-radius:2px;background:#e5484d;opacity:0"></div>
        <div class="abs" style="left:30px;top:8px">${DOC(22)}</div>
        <div class="abs mono nm" style="left:70px;top:9px;font-size:20px;white-space:nowrap;color:#dfe3ea">${markup(name)}</div>
        <div class="abs mono" style="left:${MODX}px;top:11px;font-size:18px;color:#838ca0;white-space:nowrap">${mod}</div>
        <div class="abs mono" style="right:44px;top:11px;font-size:18px;color:#838ca0">${sizes[i]} MB</div>
        <div class="abs flag" style="right:12px;top:11px;opacity:0">${icon('alert', 21, '#e5484d')}</div></div>`);
      list.appendChild(r);
      const nm = r.querySelector('.nm');
      return { r, bg: r.querySelector('.rbg'), bar: r.querySelector('.bar'), flag: r.querySelector('.flag'), nm, fin: [...nm.querySelectorAll('.fin')], apr: [...nm.querySelectorAll('.apr')], t: FILES[i][2], match: /approved/.test(name), isFin: /final/i.test(name) };
    });
    let m = 0; rows.forEach(o => { o.mi = o.match ? m++ : -1; });
    const NMATCH = m;

    /* ---- front layer: Save As keycaps + file counter ---- */
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

    /* ---- the FINAL files jump out ---- */
    const finCards = POPOUT.map((fi, k) => {
      const [name, mod] = FILES[fi];
      const c = el(`<div class="abs" style="left:${400 + k * 150}px;top:${300 + k * 118}px;height:96px;padding:0 30px 0 24px;display:flex;align-items:center;gap:20px;border-radius:12px;
        background:linear-gradient(180deg,rgba(40,34,26,.97),rgba(20,18,16,.97));border:2px solid rgba(245,166,35,.75);white-space:nowrap;opacity:0">
        ${DOC(40, '#f5a623', '#c9a46a')}<span class="mono" style="font-size:34px;color:#eef1f6">${name.replace(/(FINAL|really)/g, '<span style="color:#0a0a0c;background:#f5a623;border-radius:5px;padding:0 6px">$1</span>')}</span>
        <span class="mono" style="font-size:19px;color:#9aa3b5;margin-left:8px">${mod.split('  ')[1]}</span></div>`);
      root.appendChild(c); return { c, rot: [-3.5, 2.2, -1.6, 3][k] };
    });
    T_FIN.forEach((t, k) => ctx.cue(t, 'blip', { gain: .75, pitch: [0, 3, 5, 8][k], pan: -.3 + k * .15 }));

    /* ---- the question ---- */
    const dim = el('<div class="layer" style="background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(6,6,9,.74),rgba(6,6,9,.92));opacity:0"></div>'); root.appendChild(dim);
    const redWash = el('<div class="layer" style="background:radial-gradient(ellipse 80% 75% at 50% 50%,rgba(229,72,77,0) 45%,rgba(229,72,77,.32));opacity:0"></div>'); root.appendChild(redWash);
    // copies swirling in front once the search fails (kept to the edges, soft)
    const FR = rng(57);
    const fspots = [[70, 150], [120, 850], [1500, 120], [1560, 880], [40, 480], [1640, 470], [640, 940], [1130, 70], [300, 60], [1180, 960]];
    const front = fspots.map(([x, y], k) => {
      const g = el(pill(FILES[(k * 5 + 8) % FILES.length][0], 20)); g.style.left = x + 'px'; g.style.top = y + 'px'; g.style.filter = 'blur(1.5px)';
      root.appendChild(g);
      return { g, s: .8 + FR() * .35, a: .3 + FR() * .25, t: T_Q + .2 + k * .12, ph: FR() * 6.28, dir: FR() < .5 ? -1 : 1, r0: (FR() - .5) * 16 };
    });
    const q = el(`<div class="abs disp" style="left:0;width:1920px;top:318px;text-align:center;font-size:210px;white-space:nowrap;opacity:0">WHICH ONE<span style="color:#e5484d">?</span></div>`);
    root.appendChild(q);
    const qKick = el(`<div class="abs kicker" style="left:0;width:1920px;top:272px;text-align:center;font-size:22px;color:#e5484d;opacity:0">search “approved” · ${NMATCH} conflicting files</div>`);
    root.appendChild(qKick);
    const candRow = el('<div class="abs" style="left:0;width:1920px;top:604px;display:flex;flex-wrap:wrap;justify-content:center;gap:16px 18px;padding:0 260px"></div>');
    root.appendChild(candRow);
    const cands = rows.filter(o => o.match).map(o => {
      const c = el(`<div style="height:52px;padding:0 20px 0 16px;display:flex;align-items:center;gap:12px;border-radius:9px;border:2px solid rgba(229,72,77,.8);background:rgba(40,12,14,.88);white-space:nowrap;opacity:0">
        ${DOC(20, '#e5484d', '#b98a8d')}<span class="mono" style="font-size:21px;color:#f3d6d7">${FILES[rows.indexOf(o)][0].replace('approved', '<b style="color:#ff7a7e;font-weight:500">approved</b>')}</span></div>`);
      candRow.appendChild(c); return c;
    });

    const cursor = new Cursor(root, ctx, [
      { t: T_CLICK - .8, x: 1760, y: 620 }, { t: T_CLICK, x: WX + 846 + 150, y: WY + 54 + 34, click: true }, { t: T_CLICK + .9, x: WX + 1080, y: WY + 300 }], { hideAt: T_CLICK + .7 });

    /* ---- sound ---- */
    [2.4, 2.72, 3.02, 3.3, 3.58, 3.86].forEach((t, k) => ctx.cue(t, 'pop', { gain: .5 + k * .05, pitch: k * 2, pan: .25 }));
    ctx.cue(L(0) + .05, 'whoosh', { gain: .35 });
    ctx.cue(5.64, 'pop', { gain: .55, pitch: 6, pan: .3 }); ctx.cue(5.86, 'pop', { gain: .6, pitch: 9, pan: .3 });
    ctx.cue(T_FIN_OUT, 'swish', { gain: .5, pan: -.4 });
    ctx.cue(T_FILTER, 'tick', { gain: .5 });
    ctx.cue(T_ERR, 'error', { gain: .8 });
    ctx.cue(T_GLITCH, 'glitch', { gain: .9 });
    ctx.cue(T_Q, 'thud', { gain: 1 });
    ctx.cue(T_CAND, 'error', { gain: .45, pitch: -3 });
    ctx.cue(9.35, 'glitch', { gain: .4, pitch: -4 });

    // glitch intensity: a hard burst when the search fails, then a nervous idle with spikes
    const glitchAt = lt => lt < T_GLITCH ? 0 : Math.exp(-(lt - T_GLITCH) * 5) + .16 + .7 * Math.exp(-Math.pow((lt - 9.35) * 9, 2)) + .5 * Math.exp(-Math.pow((lt - 8.5) * 10, 2));

    return lt => {
      const nSaved = FILES.filter(f => lt >= f[2]).length;
      const fk = ease.inOut(prog(lt, T_FILTER, .5));                     // search filter
      const finK = clamp(prog(lt, T_FIN[0] - .1, .3)) * (1 - clamp(prog(lt, T_FIN_OUT, .4)));   // FINAL focus
      const g = glitchAt(lt), gTick = Math.floor(lt * 30);
      const blurK = ease.inOut(prog(lt, T_GLITCH, .7));

      // camera: close on the folder path, pull back to reveal the whole folder on "knows this folder"
      const pb = ease.inOut(prog(lt, 0, 2.9));
      const s = lerp(1.7, 1, pb) * (1 + .03 * ease.sine(clamp(lt / 10.7)));
      const fx = lerp(790, 960, pb), fy = lerp(350, 515, pb);
      world.style.transform = `translate(${960 - fx * s}px,${540 - fy * s}px) scale(${s})`;

      // window: slow drift in 3D, shake on the glitch
      const sx = g * (hash(1, gTick) - .5) * 26, sy = g * (hash(2, gTick) - .5) * 12;
      const ry = lerp(-3, 2.5, ease.sine(clamp(lt / 10.7))), rx = lerp(3, 1, ease.sine(clamp(lt / 10.7)));
      win.style.transform = `perspective(2600px) translate(${sx}px,${sy}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      win.style.filter = blurK > .01 ? `blur(${blurK * 5}px)` : 'none';
      // "this folder": sweep across the path bar
      const sw = prog(lt, L(0), .9);
      sweep.style.opacity = sw > 0 && sw < 1 ? 1 : 0; sweep.style.transform = `translateX(${lerp(-200, 660, ease.inOut(sw))}px)`;
      const hot = Math.max(0, 1 - Math.abs(lt - L(0) - .45) / .6);
      pname.style.color = hot > 0 ? `rgb(${Math.round(lerp(238, 245, hot))},${Math.round(lerp(241, 166, hot))},${Math.round(lerp(246, 35, hot))})` : '#eef1f6';

      // rows: auto-scroll as the folder fills, then filter to the matches
      let scroll = 0; for (let j = VIS; j < FILES.length; j++) scroll += RH * ease.out(prog(lt, FILES[j][2], .3));
      rows.forEach((o, i) => {
        const age = lt - o.t;
        if (age < 0) { o.r.style.opacity = 0; return; }
        const yAll = i * RH - scroll, yF = 8 + o.mi * RH;
        const y = o.match ? lerp(yAll, yF, fk) : yAll;
        const inK = ease.expo(clamp(age / .35));
        const jx = g * (hash(i, gTick) - .5) * 34 * (o.match ? 1 : .4);
        o.r.style.transform = `translate(${(1 - inK) * -40 + jx}px,${y}px)`;
        let op = clamp(age / .2);
        if (!o.match) op *= 1 - clamp(fk * 1.6);
        if (finK > 0 && !o.isFin) op *= 1 - finK * .6;
        o.r.style.opacity = op;
        const fresh = Math.exp(-age * 3.2);
        const fin = o.isFin ? finK : 0, red = o.match ? fk : 0;
        o.bg.style.background = red > 0 ? `rgba(229,72,77,${.16 * red})` : fin > 0 ? `rgba(245,166,35,${.16 * fin})` : i % 2 ? 'rgba(255,255,255,.025)' : 'transparent';
        o.bg.style.boxShadow = fresh > .02 && red === 0 ? `inset 0 0 0 1px rgba(245,166,35,${fresh * .8}),0 0 ${fresh * 26}px rgba(245,166,35,${fresh * .45})` : 'none';
        o.bar.style.opacity = red; o.flag.style.opacity = red;
        o.fin.forEach(sp => { sp.style.color = fin > .5 ? '#f5a623' : ''; });
        o.apr.forEach(sp => { sp.style.color = red > .5 ? '#ff6b70' : ''; sp.style.textDecoration = red > .5 ? 'underline 2px' : 'none'; });
        o.nm.style.textShadow = g > .05 && o.match ? `${g * 4}px 0 rgba(229,72,77,.75),${-g * 4}px 0 rgba(58,123,200,.75)` : 'none';
      });
      // search field
      const clicked = lt >= T_CLICK;
      sPh.style.opacity = clicked ? 0 : 1;
      search.style.borderColor = clicked ? (fk > .5 ? 'rgba(229,72,77,.9)' : 'rgba(245,166,35,.9)') : 'rgba(255,255,255,.1)';
      search.style.boxShadow = clicked ? `0 0 0 3px ${fk > .5 ? 'rgba(229,72,77,.22)' : 'rgba(245,166,35,.2)'}` : 'none';
      if (clicked) typing(lt); else sTyped.innerHTML = '';
      sRes.style.opacity = ease.out(prog(lt, T_ERR - .1, .3));

      // keycaps: press on every Save As
      let down = false, glow = 0;
      for (const p of PRESSES) { const d = lt - p; if (d > -.02 && d < .13) down = true; glow = Math.max(glow, 1 - Math.abs(d - .04) * 3.2); }
      caps.forEach(c => {
        c.style.transform = `translateY(${down ? 4 : 0}px)`;
        c.style.boxShadow = down ? '0 1px 0 #0c0d10,0 3px 8px rgba(0,0,0,.5)' : `0 4px 0 #0c0d10,0 8px 18px rgba(0,0,0,.5),0 0 ${glow * 26}px rgba(245,166,35,${glow * .7})`;
        c.style.borderColor = glow > .05 ? `rgba(245,166,35,${.3 + glow * .7})` : 'rgba(255,255,255,.16)';
      });
      const kOut = ease.inOut(prog(lt, 2.6, .5));
      keys.style.opacity = 1 - kOut; keys.style.transform = `translateY(${kOut * 24}px)`;

      // counter
      const gb = sizes.slice(0, nSaved).reduce((a, b) => a + b, 0) / 1000;
      cN.textContent = nSaved; cG.textContent = gb.toFixed(1);
      const lastT = FILES[nSaved - 1][2], bump = lt - lastT < .25 && lastT > 0 ? Math.exp(-(lt - lastT) * 12) : 0;
      counter.style.transform = `scale(${1 + bump * .06})`;
      cN.style.color = bump > .1 ? '#f5a623' : '#eef1f6';
      counter.style.opacity = 1 - blurK * .5;

      // FINAL cards
      finCards.forEach(({ c, rot }, k) => {
        const p = prog(lt, T_FIN[k], .45), kk = ease.back(p), out = ease.in(prog(lt, T_FIN_OUT + k * .05, .35));
        c.style.opacity = clamp(p * 4) * (1 - out);
        c.style.transform = `translate(${out * -260}px,${(1 - kk) * 40}px) rotate(${rot * kk}deg) scale(${lerp(.7, 1, kk)})`;
        const hl = Math.exp(-Math.max(0, lt - T_FIN[k]) * 3) * (p > 0 ? 1 : 0);
        c.style.boxShadow = `0 30px 60px rgba(0,0,0,.55),0 0 ${10 + hl * 40}px rgba(245,166,35,${.25 + hl * .5})`;
      });

      // the chaos: copies drift, then swirl harder once the search fails
      const chaos = ease.in(prog(lt, T_GLITCH, 3.2));
      ghosts.forEach((o, k) => {
        const a = ease.out(prog(lt, o.t, .6));
        const dx = Math.sin(lt * .35 + o.ph) * 18 + o.dir * chaos * 140 * Math.sin(lt * .9 + o.ph);
        const dy = -lt * 6 + Math.cos(lt * .3 + o.ph) * 12 + chaos * 90 * Math.cos(lt * .8 + o.ph);
        const jx = g * (hash(k + 40, gTick) - .5) * 20;
        o.g.style.opacity = a * o.a;
        o.g.style.transform = `translate(${dx + jx}px,${dy}px) rotate(${o.r0 + chaos * o.dir * 14}deg) scale(${o.s * (.9 + .1 * a)})`;
      });
      front.forEach((o, k) => {
        const a = ease.out(prog(lt, o.t, .8)), u = lt - o.t;
        const dx = o.dir * (u * 26 + Math.sin(lt * 1.1 + o.ph) * 30), dy = Math.cos(lt * .9 + o.ph) * 26 - u * 10;
        const jx = g * (hash(k + 90, gTick) - .5) * 24;
        o.g.style.opacity = a * o.a;
        o.g.style.transform = `translate(${dx + jx}px,${dy}px) rotate(${o.r0 + o.dir * u * 5}deg) scale(${o.s})`;
      });
      bgDim.style.opacity = blurK * .55;

      // the question
      dim.style.opacity = blurK * .8;
      redWash.style.opacity = Math.max(Math.exp(-Math.max(0, lt - T_ERR) * 2.2) * (lt >= T_ERR ? .9 : 0), blurK * (.35 + .12 * Math.sin(lt * 5)));
      const qp = prog(lt, T_Q, .55), qk = ease.expo(qp);
      const qs = Math.exp(-Math.max(0, lt - T_Q) * 7) * (qp > 0 ? 1 : 0);
      q.style.opacity = clamp(qp * 5);
      q.style.transform = `translate(${(hash(5, gTick) - .5) * qs * 30}px,${(hash(6, gTick) - .5) * qs * 16}px) scale(${lerp(1.45, 1, qk)})`;
      const split = qs * 12 + g * 2.5;
      q.style.textShadow = `${split}px 0 rgba(229,72,77,.65),${-split}px 0 rgba(58,123,200,.65),0 20px 60px rgba(0,0,0,.6)`;
      qKick.style.opacity = ease.out(prog(lt, T_Q + .35, .5));
      qKick.style.letterSpacing = (.22 + (1 - ease.expo(prog(lt, T_Q + .35, .8))) * .2) + 'em';
      cands.forEach((c, k) => {
        const p = prog(lt, T_CAND + k * .09, .45), kk = ease.back(p);
        const jx = g * (hash(k + 80, gTick) - .5) * 10;
        c.style.opacity = clamp(p * 3); c.style.transform = `translate(${jx}px,${(1 - kk) * 26}px) scale(${lerp(.8, 1, kk)})`;
      });
      cursor.update(lt);
    };
  },
});
