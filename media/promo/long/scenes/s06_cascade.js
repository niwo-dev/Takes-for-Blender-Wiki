// The cascade: values set on a tier flow down to every tier below; the deepest tier wins;
// then a matrix shows each preset slot resolving on its own.
import { defineScene, el, ease, prog, clamp, lerp } from '../engine.js';
import { icon, headline, panel, chip, Cursor, pop, slide, fade } from '../ui.js';

const TIERS = [
  ['GLOBAL', 'globe', 'Project defaults'], ['SCENE GROUP', 'folder', 'Interior'], ['SCENE', 'cube', 'Kitchen'],
  ['VIEW LAYER GROUP', 'layers', 'Hero Shots'], ['VIEW LAYER', 'layer', 'Front 3/4'], ['TAKE', 'take', 'Take 3'],
];
const PX = 500, PY = 130, PW = 920, PH = 800, BODY = 54;   // panel geometry (stage px)
const RY = i => 22 + i * 92, RH = 74;                       // row y inside the panel body
const CAMX = 470, WLDX = 690;                               // chip columns inside the panel

defineScene({
  id: 's06_cascade',
  transitionIn: 'push',
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .35, ax: .2, ay: .25, bx: .85, by: .75 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const H = headline(root, { x: 0, y: 330, w: 1920, align: 'center', kicker: 'The cascade', lines: ['SET ONCE.', { t: 'DEEPEST WINS.', grad: true }], size: 132 });
    const tOut = L(1) - .35;                                  // statement is read first, then clears for the demo
    const P = panel(root, { x: PX, y: PY, w: PW, h: PH, title: 'Takes Tree  ·  Cascade', icon: 'layers' });
    const body = P.body;

    // flowing connector
    const svg = el(`<svg class="abs" width="${PW}" height="${PH}" style="left:0;top:0;overflow:visible">
      <line x1="44" y1="${RY(0) + RH / 2}" x2="44" y2="${RY(5) + RH / 2}" stroke="rgba(255,255,255,.08)" stroke-width="4" stroke-linecap="round"/>
      <line class="flow" x1="44" y1="${RY(0) + RH / 2}" x2="44" y2="${RY(5) + RH / 2}" stroke="url(#cg)" stroke-width="4" stroke-dasharray="6 14" stroke-linecap="round"/>
      <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a7bc8"/><stop offset="1" stop-color="#f5a623"/></linearGradient></defs></svg>`);
    body.appendChild(svg);
    const flow = svg.querySelector('.flow');

    // rows
    const rows = TIERS.map(([name, ic, sub], i) => {
      const r = el(`<div class="abs" style="left:18px;right:18px;top:${RY(i)}px;height:${RH}px;border-radius:8px;background:rgba(10,10,14,.45);border:1px solid rgba(255,255,255,.06)">
        <div class="abs" style="left:10px;top:${RH / 2 - 19}px;width:38px;height:38px;border-radius:50%;background:#16161b;border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center">${icon(ic, 22, '#c9d1de')}</div>
        <div class="abs mono tname" style="left:66px;top:${RH / 2 - 13}px;font-size:22px;letter-spacing:.08em;color:#eef1f6;white-space:nowrap">${name}</div>
        <div class="abs cam" style="left:${CAMX - 18}px;top:${RH / 2 - 22}px"></div>
        <div class="abs wld" style="left:${WLDX - 18}px;top:${RH / 2 - 22}px"></div>
        <div class="abs tag mono" style="right:14px;top:${RH / 2 - 12}px;font-size:15px;letter-spacing:.14em"></div></div>`);
      body.appendChild(r); return r;
    });

    // values flowing down: [tier, slot, name, colour, t]
    const tA = L(1) + 1.0, tB = L(1) + 2.9, tC = L(2) + .35;
    const EV = [
      { tier: 0, slot: 'cam', name: 'Cam_Wide', c: '#3a7bc8', ic: 'camera', t: tA },
      { tier: 2, slot: 'wld', name: 'Studio_Soft', c: '#2fc4b2', ic: 'world', t: tB },
      { tier: 4, slot: 'cam', name: 'Cam_Hero', c: '#f5a623', ic: 'camera', t: tC },
    ];
    const STEP = .22;
    EV.forEach(e => { ctx.cue(e.t, 'pop', { gain: .9, pan: .4 }); for (let j = e.tier + 1; j < 6; j++) ctx.cue(e.t + (j - e.tier) * STEP + .05, 'tick', { gain: .45, pitch: j - e.tier, pan: .4 }); });
    ctx.cue(tC + (5 - 4) * STEP + .45, 'chime', { gain: .7 });

    // droplets (one per event) travelling down the connector
    const drops = EV.map(e => { const d = el(`<div class="abs" style="width:18px;height:18px;border-radius:50%;background:${e.c};box-shadow:0 0 22px 6px ${e.c};left:${44 - 9}px;opacity:0"></div>`); body.appendChild(d); return d; });

    // winner badge
    const badge = el(`<div class="abs chip" style="left:${PW - 250}px;top:${RY(5) + RH + 18}px;border-color:#f5a623;color:#0a0a0c;background:#f5a623;font-size:19px;opacity:0">${icon('star', 20, '#0a0a0c')}DEEPEST WINS</div>`);
    body.appendChild(badge);

    // matrix phase: each preset slot resolves on its own
    const tD = L(3) - .2;
    const SLOTS = ['RENDER', 'OUTPUT', 'FILE', 'LAYER', 'COLOR'];
    const SET = [[0, 2], [0], [0, 3], [4], [2, 5]];           // tiers that set each slot; the deepest wins
    const RES = ['Cycles', '4K', 'EXR', 'AO+Mist', 'AgX'];
    const MX = 364, MW = 108;
    const mat = el(`<div class="abs" style="left:0;top:0;right:0;bottom:0;opacity:0"></div>`); body.appendChild(mat);
    const beams = [], dots = [], resCells = [];
    SLOTS.forEach((s, j) => {
      const x = MX + j * MW + MW / 2;
      const beam = el(`<div class="abs" style="left:${x - 2}px;width:4px;border-radius:2px;background:linear-gradient(#3a7bc8,#f5a623);box-shadow:0 0 16px rgba(245,166,35,.6);top:0;height:0"></div>`);
      mat.appendChild(beam); beams.push(beam);
      SET[j].forEach(tier => {
        const win = tier === Math.max(...SET[j]);
        const d = el(`<div class="abs" style="left:${x - 13}px;top:${RY(tier) + RH / 2 - 13}px;width:26px;height:26px;border-radius:50%;
          ${win ? 'background:#f5a623;box-shadow:0 0 18px rgba(245,166,35,.8)' : 'border:3px solid rgba(255,255,255,.35)'}"></div>`);
        mat.appendChild(d); dots.push({ d, j, win, tier });
      });
      const cell = el(`<div class="abs" style="left:${MX + j * MW + 4}px;width:${MW - 8}px;top:${RY(6) + 14}px;height:84px;border-radius:8px;border:1px solid rgba(245,166,35,.45);background:rgba(245,166,35,.1);text-align:center">
        <div class="mono" style="font-size:13px;letter-spacing:.1em;color:#9aa3b5;margin-top:14px">${s}</div><div class="mono" style="font-size:20px;color:#f5a623;margin-top:8px">${RES[j]}</div></div>`);
      mat.appendChild(cell); resCells.push(cell);
      ctx.cue(tD + .9 + j * .28, 'tick', { gain: .55, pitch: j * 2, pan: -.2 + j * .15 });
    });
    const resLbl = el(`<div class="abs mono" style="left:66px;top:${RY(6) + 44}px;font-size:19px;letter-spacing:.12em;color:#f5a623">RESOLVES</div>`); mat.appendChild(resLbl);
    ctx.cue(tD + .9 + 5 * .28 + .1, 'success', { gain: .6 });

    const cursor = new Cursor(root, ctx, [
      { t: tA - 1.0, x: 1700, y: 1000 }, { t: tA, x: PX + CAMX + 14, y: PY + BODY + RY(0) + RH / 2 + 4, click: true },
      { t: tB, x: PX + WLDX + 14, y: PY + BODY + RY(2) + RH / 2 + 4, click: true },
      { t: tC, x: PX + CAMX + 14, y: PY + BODY + RY(4) + RH / 2 + 4, click: true },
      { t: tC + 1.2, x: 1780, y: 1040 }], { hideAt: tC + 1.0 });

    return lt => {
      H.update(lt, 0);
      const ho = ease.inOut(prog(lt, tOut, .5));
      H.el.style.opacity = 1 - ho; H.el.style.transform = `translateY(${-ho * 60}px) scale(${1 - ho * .06})`;
      const pk = ease.expo(prog(lt, tOut + .15, .8));
      P.el.style.opacity = prog(lt, tOut + .15, .4); P.el.style.transform = `translateY(${(1 - pk) * 160}px)`;
      flow.style.strokeDashoffset = -lt * 60;
      rows.forEach((r, i) => slide(r, lt, tOut + .35 + i * .08, .6, 60, 0));

      // resolve each row's camera / world at time lt
      rows.forEach((r, j) => {
        for (const slot of ['cam', 'wld']) {
          let win = null, arrive = 0;
          for (const e of EV) if (e.slot === slot && e.tier <= j) { const a = e.t + (j - e.tier) * STEP; if (lt >= a && (!win || e.tier >= win.tier)) { win = e; arrive = a; } }
          const box = r.querySelector('.' + slot);
          const key = win ? win.name + (win.tier === j ? '*' : '') : '';
          if (box.dataset.k !== key) { box.dataset.k = key; box.innerHTML = win ? chip((win.tier === j ? '' : '↳ ') + win.name, win.c, { icon: win.ic, filled: win.tier === j, style: 'font-size:19px;padding:6px 12px' }) : ''; }
          if (win) { const f = Math.exp(-(lt - arrive) * 5); box.style.transform = `scale(${1 + f * .14})`; box.style.filter = `drop-shadow(0 0 ${f * 18}px ${win.c})`; }
        }
        const own = EV.filter(e => e.tier === j && lt >= e.t).pop();
        const tag = r.querySelector('.tag'); tag.textContent = own ? 'SET HERE' : ''; tag.style.color = own ? own.c : '';
        r.style.borderColor = own ? own.c : 'rgba(255,255,255,.06)';
      });
      EV.forEach((e, k) => {
        const q = prog(lt, e.t, (5 - e.tier) * STEP + .05);
        drops[k].style.opacity = q > 0 && q < 1 ? 1 : 0;
        drops[k].style.top = (lerp(RY(e.tier), RY(5), q) + RH / 2 - 9) + 'px';
      });
      pop(badge, lt, tC + STEP + .45, .5, .7);

      // matrix phase
      const m = ease.inOut(prog(lt, tD, .7));
      mat.style.opacity = m;
      rows.forEach(r => { r.querySelector('.cam').style.opacity = 1 - m; r.querySelector('.wld').style.opacity = 1 - m; r.querySelector('.tag').style.opacity = 1 - m; if (m > 0) r.style.borderColor = `rgba(255,255,255,${.06 * m})`; });
      badge.style.opacity = Math.min(+badge.style.opacity, 1 - m);
      dots.forEach(({ d, j, win }) => pop(d, lt, tD + .3 + j * .06, .45, .3));
      beams.forEach((b, j) => {
        const top = Math.max(...SET[j]); const q = ease.out(prog(lt, tD + .7 + j * .28, .35));
        b.style.top = (RY(top) + RH / 2) + 'px'; b.style.height = (q * (RY(6) + 14 - RY(top) - RH / 2)) + 'px';
      });
      resCells.forEach((c, j) => pop(c, lt, tD + .9 + j * .28, .45, .6, 20));
      fade(resLbl, lt, tD + .8, .5);
      cursor.update(lt);
    };
  },
});
