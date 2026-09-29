// Batch Render, the payoff of the film. "DELIVER." renders itself in and settles as the header; the render
// menu switches to In Background; shots x variants render into a wall of thumbnails; the batch is stopped,
// Calibrate Render Times fills the estimates, Resume — Skip Done carries on, one render fails, Retry Failed
// re-renders only that one, and a chime lands with "All renders finished".
// Every beat is placed relative to the narration (ctx.line / ctx.lineEnd / ctx.dur).
import { defineScene, el, ease, prog, clamp, lerp, rng, R3D, THREE } from '../engine.js';
import { icon, panel, Cursor, pop, slide, fade, float } from '../ui.js';
import { createWatch, paintWatch, setTime, VARIANTS } from '../product3d.js';

const VK = ['gold', 'silver', 'black'];
const SHOTS = [
  { name: 'Front 3/4', rx: Math.PI / 2, ry: .5, cam: [0, 3, 11.5], look: [0, 0, 0] },
  { name: 'Top Down', rx: 0, ry: Math.PI / 2 - .45, cam: [0, 13.5, .001], look: [0, 0, 0], up: [0, 0, -1] },
];
const ROWS = SHOTS.flatMap((s, i) => VK.map((v, j) => ({ i, j, v, shot: s })));   // queue order = tree order
const EST = ['0:42', '0:44', '0:47', '0:31', '0:33', '0:36'], TOTAL = '3:53';
const FAIL = 4, PF = .62;                                 // Top Down · Silver fails at 62 %
const CW = 323, CH = 214;                                 // thumbnail size
const QX = 120, QY = 339, QW = 620, QH = 522;             // queue panel
const GX = 780, GY = 381, GAP = 18;                       // render wall
const MX = 752, MY = 347, MW = 520, MH = 394;             // render menu (opens beside the render button)
const HX = 120, HY = 120, HSIZE = 96, BIG = 300;         // header target / intro size
const TEAL = '#2fc4b2', ORANGE = '#f5a623', RED = '#e5484d';

const TINT = { gold: ['#35291a', '#0d0b09', '245,166,35'], silver: ['#1b2837', '#090b0f', '106,166,234'], black: ['#27231f', '#0b0b0c', '232,125,13'] };
const VGLOW = { gold: '217,165,78', silver: '200,212,228', black: '150,156,170' };   // swatch glow per variant

// status icons (26 px) — prebuilt, toggled per frame
const SIC = {
  pending: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="none" stroke="#6b7385" stroke-width="2" stroke-dasharray="3.2 3.1"/></svg>',
  render: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="none" stroke="rgba(245,166,35,.22)" stroke-width="3"/><path d="M13 3a10 10 0 0 1 10 10" fill="none" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/></svg>',
  done: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="12" fill="#2fc4b2"/><path d="M7.6 13.4l3.6 3.6 7.3-7.5" fill="none" stroke="#062520" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  failed: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="12" fill="#e5484d"/><path d="M9 9l8 8M17 9l-8 8" stroke="#fff" stroke-width="2.7" stroke-linecap="round"/></svg>',
  cancelled: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="none" stroke="#6b7385" stroke-width="2"/><path d="M8.5 13h9" stroke="#9aa3b5" stroke-width="2.4" stroke-linecap="round"/></svg>',
};
const STATES = Object.keys(SIC);
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

// ---------- thumbnails: every shot x variant rendered ONCE (2x supersampled), then only drawImage ----------
function renderThumbs() {
  const scene = R3D.scene();
  const watch = createWatch(); const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
  const cam = R3D.camera(30); setTime(watch, 0);
  const big = cv(CW * 2, CH * 2);
  return ROWS.map(r => {
    paintWatch(watch, r.v, r.v, 0);
    watch.rotation.set(r.shot.rx, 0, 0); pivot.rotation.set(0, r.shot.ry, 0);
    cam.up.set(...(r.shot.up || [0, 1, 0])); cam.position.set(...r.shot.cam); cam.lookAt(...r.shot.look);
    R3D.draw(big, scene, cam);
    const c = cv(CW, CH), g = c.getContext('2d');
    const [a, b, rgb] = TINT[r.v];
    const lg = g.createLinearGradient(0, 0, 0, CH); lg.addColorStop(0, a); lg.addColorStop(1, b); g.fillStyle = lg; g.fillRect(0, 0, CW, CH);
    const rg = g.createRadialGradient(CW * .5, CH * .42, 8, CW * .5, CH * .42, CW * .62); rg.addColorStop(0, `rgba(${rgb},.30)`); rg.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = rg; g.fillRect(0, 0, CW, CH);
    g.save(); g.translate(CW * .5, r.i === 0 ? CH * .9 : CH * .56); g.scale(1, r.i === 0 ? .16 : .62);
    const sg = g.createRadialGradient(0, 0, 0, 0, 0, CW * .34); sg.addColorStop(0, 'rgba(0,0,0,.6)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sg; g.fillRect(-CW, -CW, CW * 2, CW * 2); g.restore();
    g.drawImage(big, 0, 0, CW, CH);
    const vg = g.createRadialGradient(CW / 2, CH / 2, CH * .35, CW / 2, CH / 2, CW * .7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)');
    g.fillStyle = vg; g.fillRect(0, 0, CW, CH);
    return c;
  });
}
function mosaic(src, px) {
  const sw = Math.max(1, Math.round(CW / px)), sh = Math.max(1, Math.round(CH / px));
  const s = cv(sw, sh); s.getContext('2d').drawImage(src, 0, 0, sw, sh);
  const c = cv(CW, CH), g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(s, 0, 0, CW, CH); return c;
}
const LVLS = [24, 12, 6, 3];
const lvl = p => p < .3 ? 0 : p < .55 ? 1 : p < .76 ? 2 : p < .93 ? 3 : 4;

defineScene({
  id: 's15_batch',
  transitionIn: 'zoom',
  camera: { zoom: .03 },
  mood: { a: '#265787', b: '#e87d0d', grid: .3, part: 1, glow: 1.25, ax: .2, ay: .28, bx: .82, by: .72 },
  build(root, ctx) {
    const L = i => ctx.line(i), E = i => ctx.lineEnd(i);
    const at = (i, f) => L(i) + f * (E(i) - L(i));

    // ---------------- beats (relative to the narration) ----------------
    const fill0 = L(0) + .05, fill1 = Math.max(fill0 + .45, Math.min(E(0) - .15, L(0) + .72));
    const shrink0 = Math.max(fill1 + .45, L(1) - .45), shrink1 = shrink0 + .62;
    const qIn = shrink0 + .3, wIn = qIn + .15;
    const shotsT = Math.max(wIn + .75, at(1, .13)), varsT = Math.max(shotsT + .55, at(1, .30));   // "every shot", "every variant"
    const btn1 = Math.max(varsT + .75, at(1, .42)), fg = Math.max(btn1 + .5, at(1, .52)), bg = Math.max(fg + .9, at(1, .745)), all = bg + .5;
    const run1 = all + .25, cancel = Math.max(run1 + 1.2, L(2) - .15), d1 = (cancel - run1) / 3.35;
    const cal = Math.max(cancel + .8, at(2, .14)), btn2 = cal - .4, est0 = cal + .15, estStep = .12, estEnd = est0 + 6 * estStep + .1;
    const resume = Math.max(estEnd - .05, at(2, .37)), btn3 = resume - .4;
    const run2 = resume + .12, d2 = .3;
    const R2 = { 3: [run2, run2 + d2], 4: [run2 + d2, run2 + 1.75 * d2], 5: [run2 + 1.85 * d2, run2 + 2.85 * d2] };
    const retry = Math.max(R2[5][1] + .7, at(2, .70)), btn4 = retry - .4;
    const retry0 = retry + .1, retry1 = Math.max(retry0 + .7, E(2) - .05);
    const done = Math.max(retry1 + .08, E(2) + .05);      // the chime lands after the last word
    const MENUS = [[btn1, all], [btn2, cal], [btn3, resume], [btn4, retry]];

    function rowAt(k, lt) {
      if (k < 3) {
        const a = run1 + k * d1, b = a + d1;
        return lt < a ? { s: 'pending', p: 0 } : lt < b ? { s: 'render', p: (lt - a) / d1 } : { s: 'done', p: 1, t: b };
      }
      const a1 = run1 + 3 * d1;
      if (lt < cancel) return k === 3 && lt >= a1 ? { s: 'render', p: (lt - a1) / d1 } : { s: 'pending', p: 0 };
      if (lt < resume) return { s: 'cancelled', p: k === 3 ? (cancel - a1) / d1 : 0, t: cancel };
      const [a, b] = R2[k];
      if (lt < a) return { s: 'pending', p: 0 };
      if (k === FAIL) {
        if (lt < b) return { s: 'render', p: PF * (lt - a) / (b - a) };
        if (lt < retry0) return { s: 'failed', p: PF, t: b };
        if (lt < retry1) return { s: 'render', p: (lt - retry0) / (retry1 - retry0) };
        return { s: 'done', p: 1, t: retry1 };
      }
      return lt < b ? { s: 'render', p: (lt - a) / (b - a) } : { s: 'done', p: 1, t: b };
    }
    const running = lt => (lt >= run1 && lt < cancel) || (lt >= run2 && lt < R2[5][1]) || (lt >= retry0 && lt < retry1);
    const doneTimes = [run1 + d1, run1 + 2 * d1, run1 + 3 * d1, R2[3][1], R2[5][1], retry1];

    // ---------------- sound ----------------
    ctx.cue(fill0 - .05, 'whoosh', { gain: .45 });
    ctx.cue(fill1, 'hit', { gain: .95 });
    ctx.cue(shrink0, 'swish', { gain: .55 });
    ctx.cue(qIn, 'whoosh', { gain: .4, pan: -.3 });
    [0, 1].forEach(n => ctx.cue(qIn + .3 + n * .3, 'tick', { gain: .35, pitch: n * 3, pan: -.4 }));
    [0, 1].forEach(n => ctx.cue(shotsT + n * .3, 'blip', { gain: .4, pitch: n * 3, pan: -.2 }));
    [0, 1, 2].forEach(n => ctx.cue(varsT + n * .22, 'pop', { gain: .55, pitch: 2 + n * 3, pan: .1 + n * .3 }));
    ctx.cue(fg + .1, 'thud', { gain: .45 });
    ctx.cue(bg + .05, 'shimmer', { gain: .55, pan: .3 });
    ctx.cue(run1, 'blip', { gain: .45 });
    doneTimes.forEach((t, n) => ctx.cue(t, 'tick', { gain: .75, pitch: n * 2, pan: .2 + (n % 3) * .2 }));
    ctx.cue(est0, 'shimmer', { gain: .45, pan: -.3 });
    ctx.cue(R2[4][1], 'error', { gain: .85, pan: .3 });
    ctx.cue(retry1 - 1.0, 'riser', { gain: .55 });
    ctx.cue(done, 'success', { gain: .95 }); ctx.cue(done + .12, 'sparkle', { gain: .5, pan: .5 });

    const wrap = el('<div class="abs" style="left:0;top:0;width:1920px;height:1080px"></div>'); root.appendChild(wrap);

    // ---------------- intro: DELIVER. renders itself in ----------------
    const burst = el('<div class="abs" style="left:0;top:0;width:1200px;height:1200px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,236,210,.85),rgba(245,166,35,.35) 38%,rgba(232,125,13,0) 72%);opacity:0"></div>');
    const ring = el('<div class="abs" style="left:0;top:0;width:600px;height:600px;border-radius:50%;border:3px solid rgba(245,166,35,.9);opacity:0"></div>');
    wrap.append(burst, ring);
    const word = el('<div class="abs" style="left:0;top:0;transform-origin:0 0;white-space:nowrap"></div>');
    const wOut = el(`<div class="disp" style="font-size:${BIG}px;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.3)">DELIVER.</div>`);
    const edge = el('<div class="abs" style="top:4%;height:92%;width:6px;border-radius:3px;background:#fff7ea;box-shadow:0 0 26px 8px rgba(245,166,35,.85),0 0 90px 34px rgba(232,125,13,.4);opacity:0"></div>');
    const wFill = el(`<div class="abs disp" style="left:0;top:0;font-size:${BIG}px;color:#fff">DELIVER.</div>`);
    word.append(edge, wOut, wFill); wrap.appendChild(word);
    const WW = wOut.offsetWidth, WH = wOut.offsetHeight;
    const X0 = Math.round((1920 - WW) / 2), Y0 = Math.round(540 - WH / 2 - 16), HS = HSIZE / BIG;
    const kick = el(`<div class="abs kicker" style="left:0;width:1920px;top:${Y0 - 34}px;text-align:center;font-size:26px">Batch Render</div>`);
    const rail = el(`<div class="abs" style="left:${X0}px;top:${Y0 + WH + 30}px;width:${WW}px;height:6px;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden"><i style="display:block;height:100%;width:0;border-radius:3px;background:linear-gradient(90deg,#3a7bc8,#f5a623)"></i></div>`);
    wrap.append(kick, rail);
    const railFill = rail.firstChild;
    const cx0 = X0 + WW / 2, cy0 = Y0 + WH / 2;

    // ---------------- queue panel ----------------
    const Q = panel(wrap, { x: QX, y: QY, w: QW, h: QH, title: 'Batch Render', icon: 'list', dots: false });
    const btn = el(`<div class="abs" style="left:${QW - 76}px;top:8px;width:60px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center">
      <div class="abs bR" style="left:0;top:0;width:60px;height:38px;border-radius:9px;background:linear-gradient(180deg,#f5a623,#e87d0d);box-shadow:0 6px 20px rgba(232,125,13,.45);display:flex;align-items:center;justify-content:center">${icon('render', 24, '#1c1004', 2.4)}</div>
      <div class="abs bX" style="left:0;top:0;width:60px;height:38px;border-radius:9px;background:#2a2d36;border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;opacity:0">${icon('x', 22, '#eef1f6', 2.6)}</div></div>`);
    Q.el.appendChild(btn);
    const bR = btn.querySelector('.bR'), bX = btn.querySelector('.bX');
    const BTN = [QX + QW - 46, QY + 27];

    const rows = ROWS.map((r, k) => {
      const e = el(`<div class="abs" style="left:14px;right:14px;top:${14 + k * 64}px;height:58px;border-radius:8px">
        <div class="abs sic" style="left:12px;top:16px;width:26px;height:26px">${STATES.map(s => `<div class="abs" data-s="${s}" style="left:0;top:0;display:none">${SIC[s]}</div>`).join('')}</div>
        <i class="abs" style="left:54px;top:14px;width:15px;height:15px;border-radius:50%;background:${VARIANTS[r.v].caseC};box-shadow:0 0 0 2px rgba(255,255,255,.2)"></i>
        <div class="abs disp6" style="left:80px;top:7px;font-size:23px;white-space:nowrap;color:#eef1f6">${r.shot.name}</div>
        <div class="abs" style="left:80px;top:42px;width:390px;height:5px;border-radius:3px;background:rgba(255,255,255,.07);overflow:hidden"><div class="pf" style="height:100%;width:0;border-radius:3px"></div></div>
        <div class="abs mono est" style="right:14px;top:16px;font-size:21px;color:#6b7385;transform-origin:100% 50%">—</div></div>`);
      Q.body.appendChild(e);
      return { el: e, ic: [...e.querySelectorAll('.sic>div')], sw: e.querySelector('i'), pf: e.querySelector('.pf'), est: e.querySelector('.est'), key: '' };
    });
    const foot = el(`<div class="abs" style="left:14px;right:14px;top:${14 + 6 * 64 + 8}px;height:52px;border-top:1px solid rgba(255,255,255,.08)">
      <div class="abs" style="left:12px;top:24px;width:360px;height:6px;border-radius:3px;background:rgba(255,255,255,.07);overflow:hidden"><div class="tot" style="height:100%;width:0;background:linear-gradient(90deg,#3a7bc8,#2fc4b2)"></div></div>
      <div class="abs" style="right:14px;top:14px;display:flex;align-items:center;gap:10px">${icon('clock', 22, '#9aa3b5')}<span class="mono ttl" style="font-size:21px;color:#6b7385;display:inline-block;transform-origin:100% 50%">—</span></div></div>`);
    Q.body.appendChild(foot);
    const totBar = foot.querySelector('.tot'), ttl = foot.querySelector('.ttl');

    // ---------------- render wall: one cached thumbnail per row ----------------
    const TH = renderThumbs();
    const MOS = TH.map(t => LVLS.map(px => mosaic(t, px)));
    const NOISE = [0, 1, 2].map(n => {
      const c = cv(CW, CH), g = c.getContext('2d'), id = g.createImageData(CW, CH), r = rng(301 + n);
      for (let i = 0; i < CW * CH; i++) { const v = 90 + r() * 165; id.data[i * 4] = v; id.data[i * 4 + 1] = v * .92; id.data[i * 4 + 2] = v * .82; id.data[i * 4 + 3] = r() < .55 ? r() * 255 : 0; }
      g.putImageData(id, 0, 0); return c;
    });
    const wallOuter = el(`<div class="abs" style="left:${GX}px;top:${GY}px;width:${3 * CW + 2 * GAP}px;height:${2 * CH + GAP}px;perspective:2400px"></div>`);
    const wall = el('<div class="abs" style="left:0;top:0;width:100%;height:100%;transform-style:preserve-3d;transform-origin:50% 50%"></div>');
    wallOuter.appendChild(wall); wrap.appendChild(wallOuter);
    const cells = ROWS.map((r, k) => {
      const e = el(`<div class="abs" style="left:${r.j * (CW + GAP)}px;top:${r.i * (CH + GAP)}px;width:${CW}px;height:${CH}px;border-radius:10px;overflow:hidden;background:#0d0e12;border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 50px rgba(0,0,0,.5)">
        <div class="abs ph" style="left:8px;top:8px;right:8px;bottom:8px;border-radius:6px;border:2px dashed rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center">${icon('image', 40, 'rgba(255,255,255,.13)', 1.6)}</div>
        <canvas class="abs main" width="${CW}" height="${CH}" style="left:0;top:0"></canvas>
        <canvas class="abs probe" width="${CW}" height="${CH}" style="left:0;top:0;opacity:0"></canvas>
        <div class="abs fl" style="left:0;top:0;right:0;bottom:0;background:#fff;opacity:0"></div>
        <div class="abs sw" style="top:-30%;height:160%;width:90px;left:-140px;transform:skewX(-18deg);background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.34),rgba(255,255,255,0));opacity:0"></div>
        <div class="abs pb" style="left:0;bottom:0;height:4px;width:0;background:linear-gradient(90deg,#e87d0d,#f5a623)"></div>
        <div class="abs bd" style="right:12px;top:12px;width:30px;height:30px">${STATES.map(s => `<div class="abs" data-s="${s}" style="left:0;top:0;display:none;transform:scale(1.154);transform-origin:0 0">${SIC[s]}</div>`).join('')}</div></div>`);
      wall.appendChild(e);
      const main = e.querySelector('.main');
      e.querySelector('.probe').getContext('2d').drawImage(MOS[k][0], 0, 0);
      return { el: e, g: main.getContext('2d'), ph: e.querySelector('.ph'), probe: e.querySelector('.probe'), fl: e.querySelector('.fl'), sw: e.querySelector('.sw'), pb: e.querySelector('.pb'), bd: [...e.querySelectorAll('.bd>div')], key: '', bkey: '' };
    });
    function paintCell(k, c, st, lt) {
      let key;
      if (st.s === 'pending') key = 'p';
      else if (st.s === 'done') key = 'd';
      else if (st.s === 'render') key = 'r' + lvl(st.p) + '|' + (Math.floor(lt * 24) % 3);
      else if (st.s === 'failed') key = 'f' + (lt - st.t < .34 ? Math.floor(lt * 30) : 'x');
      else key = 'c' + lvl(st.p);
      if (c.key === key) return; c.key = key;
      const g = c.g; g.clearRect(0, 0, CW, CH);
      if (st.s === 'pending') return;
      const L4 = lvl(st.p), src = L4 === 4 ? TH[k] : MOS[k][L4];
      if (st.s === 'done') { g.drawImage(TH[k], 0, 0); return; }
      if (st.s === 'render') {
        g.drawImage(src, 0, 0);
        if (L4 < 4) { g.globalAlpha = .38 * (1 - st.p); g.drawImage(NOISE[Math.floor(lt * 24) % 3], 0, 0); g.globalAlpha = 1; }
        return;
      }
      if (st.s === 'cancelled') { if (st.p > 0) { g.filter = 'grayscale(1) brightness(.45)'; g.drawImage(src, 0, 0); g.filter = 'none'; } return; }
      // failed: glitch for a moment, then a red, dimmed frame
      if (lt - st.t < .34) {
        const r = rng(Math.floor(lt * 30) * 13 + 7);
        for (let s = 0; s < 9; s++) { const y = Math.floor(s * CH / 9), h = Math.ceil(CH / 9); g.drawImage(src, 0, y, CW, h, (r() - .5) * 46, y, CW, h); }
      } else { g.filter = 'grayscale(.7) brightness(.55)'; g.drawImage(src, 0, 0); g.filter = 'none'; }
      g.fillStyle = 'rgba(229,72,77,.34)'; g.fillRect(0, 0, CW, CH);
    }

    // ---------------- veil (Blender is locked while you wait) ----------------
    const veil = el('<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:rgba(4,5,8,.62);opacity:0"></div>');
    wrap.appendChild(veil);

    // ---------------- render menu ----------------
    const menu = el(`<div class="abs" style="left:${MX}px;top:${MY}px;width:${MW}px;height:${MH}px;border-radius:12px;background:linear-gradient(180deg,#1e212a,#15161b);border:1px solid rgba(255,255,255,.15);box-shadow:0 50px 110px rgba(0,0,0,.75),0 0 0 1px rgba(0,0,0,.5);transform-origin:0 20px;opacity:0">
      <div class="abs" style="left:-8px;top:12px;width:15px;height:15px;transform:rotate(45deg);background:#1e212a;border-left:1px solid rgba(255,255,255,.15);border-bottom:1px solid rgba(255,255,255,.15)"></div></div>`);
    wrap.appendChild(menu);
    const ITEMS = [
      { id: 'all', label: 'All Scenes', ic: 'layers', y: 14 },
      { id: 'cal', label: 'Calibrate Render Times', ic: 'clock', y: 80 },
      { id: 'res', label: 'Resume — Skip Done', ic: 'play', y: 130 },
      { id: 'ret', label: 'Retry Failed', ic: 'refresh', y: 180 },
    ].map(it => {
      const e = el(`<div class="abs" style="left:14px;width:${MW - 28}px;top:${it.y}px;height:44px;border-radius:8px;display:flex;align-items:center;gap:14px;padding-left:16px">
        ${icon(it.ic, 22, '#9aa3b5')}<span class="disp6" style="font-size:22px;white-space:nowrap;color:#e3e7ee">${it.label}</span></div>`);
      menu.appendChild(e);
      return Object.assign(it, { el: e, rect: [MX + 14, MY + it.y, MW - 28, 44] });
    });
    menu.appendChild(el('<div class="abs" style="left:14px;right:14px;top:68px;height:1px;background:rgba(255,255,255,.09)"></div>'));
    menu.appendChild(el('<div class="abs" style="left:14px;right:14px;top:234px;height:1px;background:rgba(255,255,255,.09)"></div>'));
    const MODES = [['fg', 'In Blender', '— you wait', 'lock', '#3a7bc8'], ['bg', 'In Background', '— keep working', 'unlock', ORANGE]].map(([id, l1, l2, ic, col], n) => {
      const x = 14 + n * 252;
      const e = el(`<div class="abs" style="left:${x}px;top:246px;width:240px;height:134px;border-radius:10px;background:rgba(255,255,255,.035);border:2px solid rgba(255,255,255,.08)">
        <div class="abs mic" style="left:16px;top:14px">${icon(ic, 30, col)}</div>
        <div class="abs rad" style="left:206px;top:18px;width:22px;height:22px;border-radius:50%;border:2px solid rgba(255,255,255,.3)"></div>
        <div class="abs disp6" style="left:18px;top:58px;font-size:24px;white-space:nowrap;color:#eef1f6">${l1}</div>
        <div class="abs disp6 l2" style="left:18px;top:88px;font-size:24px;white-space:nowrap;color:#9aa3b5">${l2}</div></div>`);
      menu.appendChild(e);
      return { id, col, el: e, rad: e.querySelector('.rad'), mic: e.querySelector('.mic'), l2: e.querySelector('.l2'), rect: [MX + x, MY + 246, 240, 134] };
    });
    const clickOn = { all, cal, res: resume, ret: retry, bg };

    // ---------------- toast ----------------
    const toast = el(`<div class="glass abs" style="left:1316px;top:128px;width:484px;height:92px;border-radius:14px;display:flex;align-items:center;gap:18px;padding:0 22px;opacity:0;border-color:rgba(47,196,178,.5)">
      <div style="width:48px;height:48px;flex:none;border-radius:50%;background:#2fc4b2;display:flex;align-items:center;justify-content:center;box-shadow:0 0 26px rgba(47,196,178,.6)">${icon('check', 30, '#05201c', 3)}</div>
      <div class="disp6" style="font-size:28px;white-space:nowrap">All renders finished</div>
      <svg style="margin-left:auto;flex:none" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#2fc4b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="w1" d="M15.5 9.5a3.6 3.6 0 0 1 0 5"/><path class="w2" d="M18.3 6.8a7.4 7.4 0 0 1 0 10.4"/></svg></div>`);
    wrap.appendChild(toast);
    const w1 = toast.querySelector('.w1'), w2 = toast.querySelector('.w2');

    // ---------------- cursor (tips rest on empty parts of controls, never on words) ----------------
    const hot = id => { const it = ITEMS.find(x => x.id === id); return [MX + MW - 150, it.rect[1] + 23]; };
    const radio = n => [MX + 14 + n * 252 + 217, MY + 246 + 29];
    const ARC = [1250, 170];      // button → menu item: arc over the menu and down its empty right side, never across labels
    const cursor = new Cursor(wrap, ctx, [
      { t: btn1 - .75, x: 1520, y: 950 },
      { t: btn1, x: BTN[0], y: BTN[1], click: true },
      { t: fg, x: radio(0)[0], y: radio(0)[1], c: ARC },
      { t: bg - .35, x: radio(0)[0] + 18, y: radio(0)[1] + 4 },
      { t: bg, x: radio(1)[0], y: radio(1)[1], click: true },
      { t: all, x: hot('all')[0], y: hot('all')[1], click: true },
      { t: all + .7, x: 1560, y: 900 },
      { t: cancel - .5, x: 1400, y: 880 },
      { t: cancel, x: BTN[0], y: BTN[1], click: true },
      { t: btn2, x: BTN[0] + 1, y: BTN[1] + 1, click: true },
      { t: cal, x: hot('cal')[0], y: hot('cal')[1], click: true, c: ARC },
      { t: cal + .45, x: 1420, y: 890 },
      { t: btn3, x: BTN[0], y: BTN[1], click: true },
      { t: resume, x: hot('res')[0], y: hot('res')[1], click: true, c: ARC },
      { t: resume + .55, x: 1560, y: 920 },
      { t: btn4, x: BTN[0], y: BTN[1], click: true },
      { t: retry, x: hot('ret')[0], y: hot('ret')[1], click: true, c: ARC },
      { t: retry + .6, x: 1330, y: 1070 }], { hideAt: retry + .35 });
    cursor.pos = function (lt) {   // like the kit's, plus an optional quadratic control point per segment
      const P = this.path;
      if (lt <= P[0].t) return [P[0].x, P[0].y];
      for (let i = 1; i < P.length; i++) if (lt <= P[i].t) {
        const a = P[i - 1], b = P[i], k = ease.inOut(prog(lt, a.t, b.t - a.t));
        if (!b.c) return [lerp(a.x, b.x, k), lerp(a.y, b.y, k)];
        const u = 1 - k; return [u * u * a.x + 2 * u * k * b.c[0] + k * k * b.x, u * u * a.y + 2 * u * k * b.c[1] + k * k * b.y];
      }
      const Z = P[P.length - 1]; return [Z.x, Z.y];
    };

    const menuState = lt => {
      for (const [a, b] of MENUS) if (lt >= a - .01 && lt <= b + .3) {
        const o = ease.out(prog(lt, a + .02, .2)), c = ease.out(prog(lt, b + .06, .16));
        return { o: o * (1 - c), s: lerp(.93, 1, o) - c * .03 };
      }
      return { o: 0, s: .93 };
    };
    const inR = (p, r) => p[0] >= r[0] && p[0] <= r[0] + r[2] && p[1] >= r[1] && p[1] <= r[1] + r[3];

    return lt => {
      // punch after the hit
      const sh = lt >= fill1 ? 9 * Math.exp(-(lt - fill1) * 9) : 0;
      wrap.style.transform = sh > .05 ? `translate(${Math.sin(lt * 83) * sh}px,${Math.cos(lt * 71) * sh}px)` : 'none';

      // ---- intro word → header ----
      const pf = ease.inOut(prog(lt, fill0, fill1 - fill0));
      wFill.style.clipPath = pf >= 1 ? 'none' : `inset(-30px ${(1 - pf) * 100}% -50px -30px)`;
      edge.style.left = (pf * WW - 3) + 'px'; edge.style.opacity = pf > 0 && pf < 1 ? 1 : 0;
      const k = ease.inOut(prog(lt, shrink0, shrink1 - shrink0));
      const settle = 1 + (1 - ease.out(prog(lt, -.6, 1.4))) * .04;
      const punch = lt >= fill1 ? 1 + .045 * Math.exp(-(lt - fill1) * 8) : 1;
      const ws = lerp(1, HS, k) * settle * punch;   // scale about the centre while big, land top-left as the header
      word.style.transform = `translate(${lerp(cx0 - WW * ws / 2, HX, k)}px,${lerp(cy0 - WH * ws / 2, HY, k)}px) scale(${ws})`;
      wOut.style.opacity = 1 - k;
      word.style.opacity = 1 - ease.out(prog(lt, shrink1 + 1.4, .5));   // client rule: the header clears once the render graphics take over
      const glow = Math.exp(-Math.abs(lt - fill1) * 5) * (1 - k);
      wFill.style.textShadow = glow > .02 ? `0 0 ${40 * glow}px rgba(245,166,35,${.8 * glow})` : 'none';
      kick.style.opacity = ease.out(prog(lt, .25, .35)) * (1 - ease.out(prog(lt, shrink0 - .1, .3)));   // after the zoom-in, so it never blends with the card's kicker
      rail.style.opacity = 1 - ease.out(prog(lt, shrink0 - .1, .3));
      railFill.style.width = (pf * 100) + '%';
      const bq = prog(lt, fill1, .7);
      burst.style.opacity = bq > 0 && bq < 1 ? (1 - bq) * .9 : 0;
      burst.style.transform = `translate(${cx0 - 600}px,${cy0 - 600}px) scale(${.35 + ease.out(bq) * 1.1})`;
      const rq = prog(lt, fill1, .6);
      ring.style.opacity = rq > 0 && rq < 1 ? 1 - rq : 0;
      ring.style.transform = `translate(${cx0 - 300}px,${cy0 - 300}px) scale(${.3 + ease.out(rq) * 2.2})`;

      // ---- panels in ----
      const qk = ease.expo(prog(lt, qIn, .8));
      Q.el.style.opacity = clamp(prog(lt, qIn, .35)); Q.el.style.transform = `translateX(${(1 - qk) * -90}px)`;
      rows.forEach((r, i) => slide(r.el, lt, qIn + .2 + i * .07, .5, -30, 0));
      fade(foot, lt, qIn + .65, .4);
      const wk = ease.expo(prog(lt, wIn, 1.1));
      wall.style.transform = `rotateY(${-7 - (1 - wk) * 14 + float(lt, .8, .5)}deg) rotateX(${3 + float(lt, .5, .4, 1)}deg) translateX(${(1 - wk) * 160}px)`;
      cells.forEach((c, i) => pop(c.el, lt, wIn + .12 + i * .06, .5, .8));

      // ---- queue + wall state ----
      let doneCount = 0;
      const run = running(lt);
      rows.forEach((r, i) => {
        const st = rowAt(i, lt), c = cells[i];
        if (st.s === 'done') doneCount++;
        if (r.key !== st.s) { r.key = st.s; r.ic.forEach(d => d.style.display = d.dataset.s === st.s ? 'block' : 'none'); }
        if (st.s === 'render') r.ic[1].firstChild.style.transform = `rotate(${lt * 540}deg)`;
        const col = st.s === 'done' ? TEAL : st.s === 'failed' ? RED : st.s === 'cancelled' ? '#5b6272' : ORANGE;
        r.pf.style.width = (st.p * 100) + '%'; r.pf.style.background = col;
        const dp = st.s === 'done' ? Math.exp(-(lt - st.t) * 5) : 0;
        const skip = i < 3 ? Math.max(0, 1 - Math.abs(lt - resume - .15 - i * .08) / .25) : 0;
        const { i: si, j: sj, v } = ROWS[i];
        const sb = Math.max(0, 1 - Math.abs(lt - shotsT - si * .3 - .12) / .4);     // "every shot": rows pulse per shot
        const vb = Math.max(0, 1 - Math.abs(lt - varsT - sj * .22 - .12) / .4);     // "every variant": columns light up
        const tint = st.s === 'render' ? `rgba(245,166,35,.11)` : st.s === 'failed' ? `rgba(229,72,77,${.14 + .1 * Math.exp(-(lt - st.t) * 4)})` :
          sb > .01 ? `rgba(58,123,200,${sb * .3})` : `rgba(47,196,178,${dp * .22 + skip * .2})`;
        r.el.style.background = tint;
        r.ic.forEach(d => { if (d.style.display === 'block') d.style.transform = `scale(${1 + dp * .35 + skip * .25})`; });
        r.sw.style.transform = `scale(${1 + vb * .5})`;
        r.sw.style.boxShadow = `0 0 0 2px rgba(255,255,255,.2)${vb > .01 ? `,0 0 ${10 * vb}px rgba(${VGLOW[v]},${vb * .9})` : ''}`;
        // estimates stream in (Calibrate Render Times)
        const te = est0 + i * estStep, q = prog(lt, te, .35);
        const ek = lt >= te ? 'v' : '-';
        if (r.est.dataset.k !== ek) { r.est.dataset.k = ek; r.est.textContent = ek === 'v' ? EST[i] : '—'; r.est.style.color = ek === 'v' ? '#eef1f6' : '#6b7385'; }
        r.est.style.transform = `scale(${1 + (q > 0 && q < 1 ? (1 - q) * .35 : 0)})`;
        // wall cell
        paintCell(i, c, st, lt);
        c.ph.style.opacity = st.s === 'pending' || (st.s === 'cancelled' && st.p === 0) ? 1 : 0;
        const bkey = st.s === 'pending' ? '' : st.s;
        if (c.bkey !== bkey) { c.bkey = bkey; c.bd.forEach(d => d.style.display = d.dataset.s === bkey ? 'block' : 'none'); }
        if (st.s === 'render') c.bd[1].firstChild.style.transform = `rotate(${lt * 540}deg)`;
        const bpop = st.t != null ? ease.back(prog(lt, st.t, .35)) : 1;
        const fin = done + .12 + sj * .1 + si * .06;                                  // finishing wave across the wall
        const bp = Math.max(0, 1 - Math.abs(lt - fin - .12) / .22);
        c.bd.forEach(d => { if (d.style.display === 'block') d.style.transform = `scale(${1.154 * (st.t != null ? lerp(.3, 1, bpop) : 1) * (1 + bp * .35)})`; });
        c.fl.style.opacity = st.s === 'done' ? .7 * Math.exp(-(lt - st.t) * 7) : 0;
        const sq = prog(lt, fin, .6);
        c.sw.style.opacity = sq > 0 && sq < 1 ? 1 : 0; c.sw.style.left = lerp(-140, CW + 50, ease.inOut(sq)) + 'px';
        c.pb.style.width = st.s === 'render' ? (st.p * 100) + '%' : '0';
        const pr = prog(lt, te, .45); c.probe.style.opacity = pr > 0 && pr < 1 ? .8 * (1 - pr) : 0;
        const tg = Math.min(1, dp + skip + bp * .8);
        const b = st.s === 'render' ? `0 0 0 2px rgba(245,166,35,.75),0 0 30px rgba(245,166,35,.45)` :
          st.s === 'failed' ? `0 0 0 2px rgba(229,72,77,.85),0 0 30px rgba(229,72,77,.35)` :
          tg > .03 ? `0 0 0 2px rgba(47,196,178,${tg * .9}),0 0 ${30 * tg}px rgba(47,196,178,.45)` :
          vb > .01 ? `0 0 0 2px rgba(${VGLOW[v]},${vb * .9}),0 0 ${34 * vb}px rgba(${VGLOW[v]},${vb * .5})` : '';
        c.el.style.boxShadow = (b ? b + ',' : '') + '0 24px 50px rgba(0,0,0,.5)';
        c.ph.style.borderColor = vb > .01 ? `rgba(${VGLOW[v]},${.08 + vb * .6})` : 'rgba(255,255,255,.08)';
        // the retried frame steps forward; after the finish every frame breathes gently
        const lift = i === FAIL ? Math.sin(Math.PI * clamp(prog(lt, retry0 - .1, retry1 - retry0 + .5))) : 0;
        const breathe = lt > done ? ease.inOut(prog(lt, done + .4, 1)) * Math.sin((lt - done) * 2.4 - (si + sj) * .8) * 7 : 0;
        const z = lift * 60 + breathe + sb * 16;
        c.el.style.zIndex = lift > .01 ? 2 : 0;
        if (Math.abs(z) > .05) c.el.style.transform = `${c.el.style.transform} translateZ(${z}px)`;
      });
      totBar.style.width = (doneCount / 6 * 100) + '%';
      const tk = lt >= estEnd ? 'v' : '-';
      if (ttl.dataset.k !== tk) { ttl.dataset.k = tk; ttl.textContent = tk === 'v' ? TOTAL : '—'; ttl.style.color = tk === 'v' ? '#eef1f6' : '#6b7385'; }
      const tq = prog(lt, estEnd, .4); ttl.style.transform = `scale(${1 + (tq > 0 && tq < 1 ? (1 - tq) * .4 : 0)})`;

      // render button ↔ cancel while a batch runs
      const xk = run ? 1 : 0;
      bX.style.opacity = xk; bR.style.opacity = 1 - xk;

      // ---- menu ----
      const ms = menuState(lt);
      menu.style.opacity = ms.o; menu.style.transform = `scale(${ms.s})`;
      menu.style.visibility = ms.o > .002 ? '' : 'hidden';
      const cp = cursor.pos(lt), open = ms.o > .6;
      ITEMS.forEach(it => {
        const hov = open && inR(cp, it.rect) ? 1 : 0;
        const dc = lt - clickOn[it.id], fl = dc >= 0 ? Math.max(0, 1 - dc / .3) : 0;   // flash starts on the click
        it.el.style.background = fl > .01 ? `rgba(245,166,35,${.2 + fl * .3})` : hov ? 'rgba(58,123,200,.3)' : 'transparent';
      });
      const selBg = lt >= bg;
      MODES.forEach((m, n) => {
        const sel = (n === 1) === selBg, hov = open && inR(cp, m.rect);
        const fl = n === 1 && lt >= bg ? Math.max(0, 1 - (lt - bg) / .35) : 0;
        m.el.style.borderColor = sel ? m.col : 'rgba(255,255,255,.08)';
        m.el.style.background = fl > .01 ? `rgba(245,166,35,${.12 + fl * .2})` : hov ? 'rgba(58,123,200,.2)' : sel ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.035)';
        m.el.style.boxShadow = sel ? `0 0 26px ${n ? 'rgba(245,166,35,.35)' : 'rgba(58,123,200,.3)'}` : 'none';
        m.rad.style.background = sel ? m.col : 'transparent'; m.rad.style.borderColor = sel ? m.col : 'rgba(255,255,255,.3)';
        m.rad.style.boxShadow = sel ? `inset 0 0 0 4px #1b1d24` : 'none';
        m.l2.style.color = sel ? m.col : '#9aa3b5';
      });
      // "you wait": everything but the menu dims while the cursor rests on In Blender
      const vk = ease.out(prog(lt, fg + .05, .35)) * (1 - ease.out(prog(lt, bg, .3)));
      veil.style.opacity = vk;
      MODES[0].mic.style.transform = `scale(${1 + vk * .18}) rotate(${Math.sin(lt * 18) * vk * 4}deg)`;

      // ---- toast ----
      const tp = ease.back(prog(lt, done, .5));
      toast.style.opacity = clamp(prog(lt, done, .2));
      toast.style.transform = `translateY(${(1 - tp) * -30 + float(lt, 3, 1.4)}px) scale(${lerp(.85, 1, tp)})`;
      const glowT = Math.exp(-Math.max(0, lt - done) * 2.2);
      toast.style.boxShadow = `0 40px 90px rgba(0,0,0,.5),0 0 ${50 * glowT}px rgba(47,196,178,${.55 * glowT})`;
      w1.style.opacity = lt > done ? .45 + .55 * Math.max(0, Math.sin((lt - done) * 7)) : 0;
      w2.style.opacity = lt > done ? .45 + .55 * Math.max(0, Math.sin((lt - done) * 7 - 1.2)) : 0;

      cursor.update(lt);
    };
  },
});
