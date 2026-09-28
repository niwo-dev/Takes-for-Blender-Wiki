// s05 — One tree. A short statement is read first beside a single glowing root. Then the statement shrinks to a
// compact title, the root flies into place and the tree grows level by level as the narrator names them
// (scene group, scene, view layer group, view layers, takes). Live previews pop in beside each view layer.
// Finally, with the mouse over the tree, Ctrl+N adds a take and F2 renames it.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, words, revealMasks, gradify, canvas3d, Cursor, keycaps } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const X0 = 600, IND = 66, Y0 = 176, SP = 84, RH = 60;     // tree geometry (stage px)
const ICX = 53;                                           // icon centre inside a row (from the row's left edge)
const TX = 1452, TW = 300, THH = 169;                     // preview column
const SEED = [1060, 540];                                 // the root before it takes its place

const ROWS = [
  { d: 0, ic: 'globe', label: 'Global', parent: -1, chev: 1 },
  { d: 1, ic: 'folder', label: 'Interior', parent: 0, chev: 1 },
  { d: 2, ic: 'cube', label: 'Kitchen', parent: 1, chev: 1 },
  { d: 3, ic: 'layers', label: 'Hero Shots', parent: 2, chev: 1 },
  { d: 4, ic: 'layer', label: 'Front 3/4', parent: 3, chev: 1, thumb: 0 },
  { d: 5, ic: 'take', label: 'Take 1', name: 'Blockout', parent: 4, take: 1 },
  { d: 5, ic: 'take', label: 'Take 2', name: 'Warm light', parent: 4, take: 1, live: 1 },
  { d: 5, ic: 'take', label: 'Take 3', parent: 4, take: 1, fresh: 1 },
  { d: 4, ic: 'layer', label: 'Top Down', parent: 3, chev: 1, thumb: 1 },
];
// word positions inside line 1 (scene groups, scenes, view layer groups, view layers, takes) as fractions of the line
const WORD = [.01, .2, .41, .65, .85];

defineScene({
  id: 's05_tree',
  transitionIn: 'iris',
  camera: { zoom: .03 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .22, part: .6, glow: 1.05, ax: .72, ay: .3, bx: .18, by: .85 },
  build(root, ctx) {
    const L1 = ctx.line(1), D1 = ctx.lineEnd(1) - L1, L2 = ctx.line(2), D2 = ctx.lineEnd(2) - L2;
    const T = WORD.map(f => L1 + f * D1 - .03);
    const tMorph = L1 - .5;                                   // statement shrinks, root flies into the tree
    const tTakes = T[4];
    const tThumb = [L2 + .26 * D2, L2 + .26 * D2 + .38];      // "preview"
    const tCtrl = Math.max(ctx.lineEnd(2) + .45, ctx.dur - 3.7), tNew = tCtrl + .05;
    const tF2 = tCtrl + .95, tType = tF2 + .14, NAME = 'Final', CPS = 11, tCommit = tType + NAME.length / CPS + .22;
    const appear = [tMorph + .3, T[0], T[1], T[2], T[3], tTakes, tTakes + .1, tNew, T[3] + .12];

    /* ---------- statement ---------- */
    const head = el(`<div class="abs" style="left:120px;top:356px;transform-origin:0 0">
      <div class="disp" style="font-size:176px;white-space:nowrap;line-height:.95">${words('ONE')}</div>
      <div class="disp gl" style="font-size:176px;white-space:nowrap;line-height:.95;display:inline-block;position:relative">${words('TREE.')}</div></div>`);
    root.appendChild(head);
    gradify(head.querySelector('.gl'));

    /* ---------- the root seed ---------- */
    const seed = el(`<div class="abs" style="left:0;top:0;width:150px;height:150px">
      <div class="abs ring r1" style="left:-30px;top:-30px;width:210px;height:210px;border-radius:50%;border:2px solid rgba(58,123,200,.5)"></div>
      <div class="abs ring r2" style="left:-30px;top:-30px;width:210px;height:210px;border-radius:50%;border:2px solid rgba(245,166,35,.5)"></div>
      <div class="abs core" style="left:0;top:0;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#2a3a52,#0f1117 72%);border:2px solid rgba(245,166,35,.85);display:flex;align-items:center;justify-content:center">${icon('globe', 70, '#eef1f6', 1.6)}</div></div>`);
    root.appendChild(seed);
    const seedCore = seed.querySelector('.core'), rings = [...seed.querySelectorAll('.ring')];

    /* ---------- tree lines ---------- */
    const svg = el(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible">${ROWS.map(() => '<path fill="none" stroke-width="2.5" stroke-linecap="round"/>').join('')}
      ${[0, 1].map(() => '<path class="tl" fill="none" stroke="rgba(245,166,35,.55)" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/>').join('')}</svg>`);
    root.appendChild(svg);
    const lines = [...svg.querySelectorAll('path:not(.tl)')], tlinks = [...svg.querySelectorAll('.tl')];

    /* ---------- rows ---------- */
    const chevSvg = icon('chevR', 18, '#9aa3b5', 2.4);
    const rows = ROWS.map((r, i) => {
      const lead = r.take
        ? `<div class="cb" style="width:18px;height:18px;border-radius:4px;border:2px solid rgba(255,255,255,.28);display:flex;align-items:center;justify-content:center;flex:none">${r.live ? icon('check', 14, '#0a0a0c', 3.4) : ''}</div>`
        : `<div class="chev" style="width:18px;height:18px;flex:none">${chevSvg}</div>`;
      const name = r.name ? `<span style="color:#9aa3b5"> · ${r.name}</span>` : '';
      const fresh = r.fresh ? `<span class="sep" style="color:#9aa3b5;opacity:0"> · </span><span class="box" style="display:inline-block;vertical-align:baseline;line-height:1.15;border-radius:5px;padding:3px 0;border:2px solid rgba(245,166,35,0);color:#eef1f6"><span class="txt"></span><i class="caret" style="display:inline-block;width:3px;height:26px;vertical-align:-5px;background:#f5a623;margin-left:2px;opacity:0"></i></span>` : '';
      const e = el(`<div class="abs" style="left:${X0 + r.d * IND}px;top:0;height:${RH}px;display:flex;align-items:center;gap:10px;padding:0 28px 0 12px;border-radius:10px;
        background:linear-gradient(180deg,rgba(38,87,135,.32),rgba(16,17,23,.78));border:1px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.16);box-shadow:0 18px 40px rgba(0,0,0,.45)">
        ${lead}<div style="width:26px;height:26px;flex:none">${icon(r.ic, 26, i === 0 ? '#f5a623' : '#c9d1de')}</div>
        <div class="disp6 lbl" style="font-size:26px;white-space:nowrap">${r.label}${name}${fresh}</div></div>`);
      root.appendChild(e);
      if (r.live) { const cb = e.querySelector('.cb'); cb.style.background = '#f5a623'; cb.style.borderColor = '#f5a623'; }
      return { e, chev: e.querySelector('.chev'), sep: e.querySelector('.sep'), box: e.querySelector('.box'), txt: e.querySelector('.txt'), caret: e.querySelector('.caret') };
    });
    const R7 = rows[7];

    /* ---------- live previews (small 3D renders beside each view layer) ---------- */
    const tscene = R3D.scene({ key: 1.5 });
    const tw = createWatch(); const tpiv = new THREE.Group(); tpiv.add(tw); tscene.add(tpiv);
    const tcam = R3D.camera(30);
    const VIEWS = [
      { rotX: Math.PI / 2, spin: -.5, pos: [3.1, 1.3, 8.6], up: [0, 1, 0] },          // Front 3/4
      { rotX: 0, spin: Math.PI / 2, pos: [0, 12.6, .001], up: [0, 0, -1] },           // Top Down
    ];
    const thumbs = VIEWS.map(() => {
      const c = el(`<div class="abs" style="left:${TX}px;top:0;width:${TW}px;height:${THH}px;border-radius:9px;overflow:hidden;border:1px solid rgba(255,255,255,.16);
        background:radial-gradient(ellipse at 50% 40%,#252a35,#0e0f13 75%);box-shadow:0 24px 60px rgba(0,0,0,.55)"></div>`);
      root.appendChild(c);
      const cv = canvas3d(c, { x: 0, y: 0, w: TW, h: THH });
      return { c, cv };
    });

    /* ---------- shortcuts ---------- */
    const kN = keycaps(root, ['Ctrl', 'N'], { x: 150, y: 640, t0: tCtrl - .5, press: tCtrl, ctx, scale: 1.12 });
    const kF = keycaps(root, ['F2'], { x: 150, y: 790, t0: tF2 - .45, press: tF2, ctx, scale: 1.12 });
    const hoverX = X0 + 4 * IND + 232, hoverY = Y0 + 4 * SP + 40;
    const cursor = new Cursor(root, ctx, [
      // enters and leaves along the Front 3/4 row level, so it never passes over a label
      { t: tCtrl - 1.25, x: 1990, y: hoverY + 4 }, { t: tCtrl - .45, x: hoverX, y: hoverY }, { t: tF2, x: hoverX + 14, y: hoverY + 6 },
      { t: tCommit + .1, x: hoverX + 8, y: hoverY + 4 }, { t: tCommit + .8, x: 1990, y: hoverY + 8 }], { hideAt: tCommit + .3 });

    /* ---------- sound ---------- */
    ctx.cue(ctx.line(0) + .7, 'chime', { gain: .35, pitch: 5 });
    ctx.cue(tMorph + .02, 'swish', { gain: .45, pan: -.2 });
    [1, 2, 3, 4, 8, 5, 6].forEach((i, k) => ctx.cue(appear[i] + .06, 'tick', { gain: .5, pitch: 2 + k * 2, pan: .15 }));
    tThumb.forEach((t, k) => ctx.cue(t, 'pop', { gain: .7, pitch: 4 + k * 3, pan: .5 }));
    ctx.cue(tNew + .08, 'pop', { gain: .6, pitch: 7, pan: .2 });
    for (let i = 0; i < NAME.length; i += 2) ctx.cue(tType + i / CPS, 'type', { gain: .42, pan: .2 });
    ctx.cue(tCommit, 'chime', { gain: .45, pitch: 7 });

    /* ---------- layout over time ---------- */
    const slotOf = (i, lt) => {
      if (i < 7) return i;
      if (i === 7) return 7;
      return 5 + 2 * ease.inOut(prog(lt, tTakes - .05, .5)) + ease.inOut(prog(lt, tNew, .45));   // Top Down moves down twice
    };
    const rowY = (i, lt) => Y0 + slotOf(i, lt) * SP;
    let typed = -1;

    return lt => {
      /* statement: read first, then shrinks to a compact title */
      revealMasks(head, lt, .3, .12, .85);
      const hk = ease.inOut(prog(lt, tMorph, .6));
      head.style.transform = `translate(0px,${lerp(0, 156 - 356, hk)}px) scale(${lerp(1, .34, hk)})`;

      /* root seed: breathes, pulses on the line, then flies into the Global row */
      const sk = ease.back(prog(lt, -.5, .7)), fk = ease.inOut(prog(lt, tMorph + .05, .6));
      const pulse = Math.max(0, 1 - Math.abs(lt - ctx.line(0) - .75) / .45);
      const tx = X0 + ICX, ty = Y0 + RH / 2;
      const cx = lerp(SEED[0], tx, fk), cy = lerp(SEED[1], ty, fk), sc = lerp(sk * (1 + pulse * .08), 26 / 70, fk);
      seed.style.transform = `translate(${cx - 75}px,${cy - 75}px) scale(${sc})`;
      seed.style.opacity = clamp(prog(lt, -.5, .3) * 3) * (1 - prog(lt, tMorph + .55, .2));
      seedCore.style.boxShadow = `0 0 ${50 + pulse * 50}px rgba(245,166,35,${.3 + pulse * .35}),inset 0 0 30px rgba(58,123,200,.45)`;
      rings.forEach((r, k) => { const q = ((lt * .55 + k * .5) % 1); r.style.transform = `scale(${.72 + q * .75})`; r.style.opacity = (1 - q) * .8 * (1 - fk); });

      /* rows */
      rows.forEach((R, i) => {
        const a = appear[i], y = rowY(i, lt);
        const k = i === 0 ? prog(lt, a, .35) : prog(lt, a + .12, .5);
        const kx = ease.expo(k);
        R.e.style.top = y + 'px';
        R.e.style.opacity = clamp(k * 2.5);
        R.e.style.transform = i === 0 ? `scale(${lerp(.85, 1, ease.back(k))})` : `translateX(${(1 - kx) * -36}px)`;
        R.e.style.transformOrigin = '30px 50%';
        // selection: Front 3/4 once it opens, then the new take
        const sel = (i === 4 && lt >= tTakes - .05 && lt < tNew) || (i === 7 && lt >= tNew);
        const flash = i === 7 ? Math.max(0, 1 - Math.abs(lt - tCommit - .1) / .35) : 0;
        R.e.style.background = sel ? 'linear-gradient(180deg,rgba(58,123,200,.55),rgba(38,87,135,.42))' : 'linear-gradient(180deg,rgba(38,87,135,.32),rgba(16,17,23,.78))';
        R.e.style.borderColor = sel ? 'rgba(140,185,240,.55)' : 'rgba(255,255,255,.1)';
        const born = lt >= a + .12 ? Math.exp(-(lt - a - .12) * 3) : 0;
        R.e.style.boxShadow = `0 18px 40px rgba(0,0,0,.45),0 0 ${(born + flash) * 30}px rgba(245,166,35,${(born + flash) * .5})`;
        if (R.chev) {
          const open = i === 0 ? lt >= T[0] - .1 : i === 4 ? ease.inOut(prog(lt, tTakes - .15, .25)) : i === 8 ? 0 : ease.inOut(prog(lt, appear[i + 1] - .1, .25));
          R.chev.style.transform = `rotate(${(+open) * 90}deg)`;
        }
        // tree line from the parent's icon down and across to this row
        const p = ROWS[i].parent, L = lines[i];
        if (p < 0) { L.style.opacity = 0; return; }
        const px = X0 + ROWS[p].d * IND + ICX, py = rowY(p, lt) + RH / 2 + 17, ry = y + RH / 2, rx = X0 + ROWS[i].d * IND - 2;
        L.setAttribute('d', `M${px} ${py}V${ry - 10}Q${px} ${ry} ${px + 10} ${ry}H${rx}`);
        const dk = ease.inOut(prog(lt, a - .06, .32));
        const len = (ry - py) + (rx - px);
        L.style.strokeDasharray = dk >= 1 ? 'none' : `${len} ${len}`; L.style.strokeDashoffset = len * (1 - dk);
        L.style.opacity = dk > 0 ? 1 : 0;
        const hot = lt >= a ? Math.exp(-(lt - a) * 2.5) : 0;
        L.setAttribute('stroke', `rgba(${Math.round(lerp(255, 245, hot))},${Math.round(lerp(255, 166, hot))},${Math.round(lerp(255, 35, hot))},${.22 + hot * .7})`);
      });

      /* new take: F2 rename with typing */
      const ren = lt >= tF2 && lt < tCommit, done = lt >= tCommit;
      R7.sep.style.opacity = lt >= tF2 ? 1 : 0;
      R7.box.style.borderColor = ren ? 'rgba(245,166,35,.95)' : 'rgba(245,166,35,0)';
      R7.box.style.background = ren ? 'rgba(10,10,12,.55)' : 'transparent';
      R7.box.style.color = done ? '#9aa3b5' : '#eef1f6';
      R7.box.style.padding = `3px ${lt >= tF2 ? 8 * (1 - ease.inOut(prog(lt, tCommit, .25))) : 0}px`;
      const n = lt < tType ? 0 : clamp(Math.floor((lt - tType) * CPS) + 1, 0, NAME.length);
      if (n !== typed) { R7.txt.textContent = NAME.slice(0, n); typed = n; }
      R7.caret.style.opacity = ren && (n < NAME.length || Math.floor(lt * 2.4) % 2 === 0) ? 1 : 0;
      R7.caret.style.display = ren ? 'inline-block' : 'none';

      /* previews */
      thumbs.forEach(({ c, cv }, j) => {
        const i = j === 0 ? 4 : 8, t = tThumb[j], k = prog(lt, t, .55), kb = ease.back(k);
        const y = rowY(i, lt) + RH / 2 - THH / 2;
        c.style.top = y + 'px'; c.style.opacity = clamp(k * 3); c.style.transform = `translateX(${(1 - kb) * 40}px) scale(${lerp(.75, 1, kb)})`;
        const lk = ease.inOut(prog(lt, t - .1, .35)), link = tlinks[j];
        const sx = X0 + 4 * IND + rows[i].e.offsetWidth + 10, ly = rowY(i, lt) + RH / 2;
        link.setAttribute('d', `M${sx} ${ly}H${lerp(sx, TX - 10, lk)}`); link.style.opacity = lk > 0 ? 1 : 0;
        link.style.strokeDashoffset = -lt * 30;
        if (k <= 0) return;
        const V = VIEWS[j];
        paintWatch(tw, 'gold'); setTime(tw, 40 + lt * 8);
        tw.rotation.x = V.rotX; tpiv.rotation.set(0, V.spin + Math.sin(lt * .6 + j * 2) * .3, 0);
        tcam.up.set(...V.up); tcam.position.set(...V.pos); tcam.lookAt(0, 0, 0);
        cv.draw(tscene, tcam);
      });

      kN(lt); kF(lt);
      cursor.update(lt);
    };
  },
});
