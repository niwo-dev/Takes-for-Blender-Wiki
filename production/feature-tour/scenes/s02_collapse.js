// s02 — the chaos resolves: the cloud of saved copies is pulled into the centre and merges into ONE file;
// three looks (Gold / Silver / Matte Black) fan out of it; then the statement lands once everything settles.
// Every time is relative to the VO line (ctx.line / lineEnd / dur).
import { defineScene, el, ease, prog, clamp, lerp, rng, R3D, THREE } from '../engine.js';
import { words, revealMasks, gradify, canvas3d, drawOn } from '../ui.js';
import { createWatch, paintWatch, setTime, VARIANTS } from '../product3d.js';

const CX = 960, CY = 352;                                  // where everything merges (the file card centre)
const CARD_W = 250, CARD_H = 300;
const LOOKS = [['gold', 560, 742], ['silver', 960, 772], ['black', 1360, 742]];   // variant, centre x, centre y
const LR = 124;                                            // look radius

const DOC = (w = 22, ring = '#e87d0d', stroke = '#8a93a6', fill = '#1b1e25', sw = 1.4) => `<svg width="${w}" height="${Math.round(w * 26 / 22)}" viewBox="0 0 22 26" style="display:block;flex:none;overflow:visible">
  <path d="M3 1h10l6 6v17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
  <path d="M13 1v6h6" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="10.5" cy="16.5" r="3.8" fill="none" stroke="${ring}" stroke-width="2"/></svg>`;
// the same textless file tile the folder scene ends with
const TILE = (w, ring, border = 'rgba(255,255,255,.14)', bg = 'linear-gradient(180deg,rgba(40,62,92,.6),rgba(16,16,22,.85))') => `<div class="abs" style="left:0;top:0;width:${w}px;height:${Math.round(w * 1.22)}px;border-radius:${Math.round(w * .1)}px;
  background:${bg};border:1px solid ${border};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(w * .09)}px">
  ${DOC(Math.round(w * .42), ring)}<i style="display:block;width:${Math.round(w * .56)}px;height:${Math.max(3, Math.round(w * .05))}px;border-radius:3px;background:rgba(255,255,255,.16)"></i>
  <i style="display:block;width:${Math.round(w * .36)}px;height:${Math.max(3, Math.round(w * .05))}px;border-radius:3px;background:rgba(255,255,255,.1)"></i></div>`;

defineScene({
  id: 's02_collapse',
  transitionIn: 'zoom',
  camera: { zoom: .03 },
  mood: { a: '#265787', b: '#3a1e10', glow: .75, grid: .22, part: .35, ax: .2, ay: .25, bx: .8, by: .8 },
  build(root, ctx) {
    const L = i => ctx.line(i), LE = i => ctx.lineEnd(i), D = ctx.dur;
    const T_PULL = L(0), T_MERGE = LE(0) - .3;              // the hit lands on "...one file"
    const PULL = T_MERGE - T_PULL;
    const T_LOOK = [.55, .75, .95].map(k => T_MERGE + k);   // the looks fan out
    const T_LINES = T_MERGE + .45;
    const T_H1 = T_LOOK[2] + .75, T_H2 = T_H1 + .5;         // the statement lands once the looks settle

    /* ---- warm light that arrives with the merge (the mood goes from cool to brand-warm) ---- */
    const warm = el(`<div class="layer" style="opacity:0;background:radial-gradient(ellipse 55% 50% at 50% 38%,rgba(232,125,13,.26),transparent 70%),
      radial-gradient(ellipse 45% 40% at 18% 20%,rgba(58,123,200,.24),transparent 70%),radial-gradient(ellipse 50% 45% at 85% 85%,rgba(232,125,13,.16),transparent 70%)"></div>`);
    root.appendChild(warm);

    /* ---- the cloud of saved copies (the red "?" files from the folder scene lead the way) ---- */
    const R = rng(77);
    const tiles = [];
    const addTile = (x0, y0, w, ring, border, bg, o) => {
      const t = el(TILE(w, ring, border, bg)); root.appendChild(t);
      tiles.push(Object.assign({ t, w, h: Math.round(w * 1.22), x0, y0, a0: Math.atan2(y0 - CY, x0 - CX), r0: Math.hypot(x0 - CX, y0 - CY), rot: (R() - .5) * 30,
        spin: (R() < .5 ? -1 : 1) * (80 + R() * 160), ph: R() * 6.28 }, o));
      return t;
    };
    const cells = [];
    for (let gy = 0; gy < 5; gy++) for (let gx = 0; gx < 8; gx++) {
      const x = 60 + (gx + .15 + R() * .7) * 225, y = 30 + (gy + .15 + R() * .7) * 205;
      if (Math.hypot((x - CX) / 1.3, y - 470) < 250) continue;
      cells.push([x, y, R()]);
    }
    cells.sort((a, b) => a[2] - b[2]);                     // depth order: far tiles first
    cells.forEach(([x, y, z]) => {
      const far = z < .4, near = z > .82, kind = R();
      const w = Math.round(far ? 54 + R() * 22 : near ? 132 + R() * 40 : 84 + R() * 30);
      const t = addTile(x, y, w, kind < .14 ? '#e5484d' : kind < .3 ? '#f5a623' : kind < .62 ? '#e87d0d' : '#3a7bc8', kind < .14 ? 'rgba(229,72,77,.6)' : undefined, undefined,
        { d: .12 + R() * .3, op: far ? .3 + R() * .15 : near ? .85 : .55 + R() * .25 });
      if (near) t.style.filter = 'blur(1.5px)';
    });
    const CW = 118, CGAP = 58;
    for (let k = 0; k < 5; k++) {
      const t = addTile(960 - (5 * CW + 4 * CGAP) / 2 + k * (CW + CGAP) + CW / 2, 610 + CW * .61, CW, '#e5484d', 'rgba(229,72,77,.85)', 'linear-gradient(180deg,rgba(70,18,22,.92),rgba(26,10,12,.94))', { d: k * .04, op: 1 });
      t.appendChild(el('<div class="abs disp" style="right:-14px;top:-16px;width:44px;height:44px;border-radius:50%;background:#e5484d;color:#fff;font-size:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(229,72,77,.6)">?</div>'));
      tiles[tiles.length - 1].rot = [-7, 4, -3, 6, -5][k];
    }

    /* ---- the core that gathers, the flash, the rings, the burst ---- */
    const core = el(`<div class="abs" style="left:${CX - 160}px;top:${CY - 160}px;width:320px;height:320px;border-radius:50%;opacity:0;
      background:radial-gradient(circle,rgba(255,236,200,.95) 0%,rgba(245,166,35,.75) 18%,rgba(232,125,13,.28) 42%,rgba(58,123,200,.12) 60%,transparent 72%)"></div>`);
    root.appendChild(core);
    const swirl = el(`<div class="abs" style="left:${CX - 190}px;top:${CY - 190}px;width:380px;height:380px;border-radius:50%;opacity:0;
      background:conic-gradient(from 0deg,transparent 0deg,rgba(58,123,200,.55) 60deg,transparent 130deg,rgba(245,166,35,.6) 200deg,transparent 280deg,rgba(58,123,200,.4) 330deg,transparent 360deg);
      -webkit-mask-image:radial-gradient(circle,transparent 38%,#000 42%,#000 60%,transparent 70%)"></div>`);
    root.appendChild(swirl);
    const rings = [0, 1].map(k => { const r = el(`<div class="abs" style="left:0;top:0;border-radius:50%;border:${k ? 3 : 5}px solid ${k ? '#3a7bc8' : '#f5a623'};opacity:0"></div>`); root.appendChild(r); return r; });
    const flash = el(`<div class="layer" style="opacity:0;background:radial-gradient(circle at 50% ${CY / 10.8}%,rgba(255,244,228,.95),rgba(245,166,35,.45) 30%,transparent 62%)"></div>`);
    const BR = rng(9);
    const sparks = Array.from({ length: 26 }, () => {
      const s = el(`<div class="abs" style="left:${CX - 4}px;top:${CY - 4}px;width:8px;height:8px;border-radius:50%;opacity:0;background:${BR() < .6 ? '#f5a623' : '#6aa6ea'};box-shadow:0 0 12px 3px currentColor"></div>`);
      root.appendChild(s); return { s, a: BR() * Math.PI * 2, v: 380 + BR() * 520, sz: .6 + BR() * 1.2 };
    });

    /* ---- connectors from the file to its looks ---- */
    const svg = el(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible">
      <defs><linearGradient id="s02lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f5a623"/><stop offset="1" stop-color="#3a7bc8"/></linearGradient></defs>
      ${LOOKS.map(([, x, y]) => { const y0 = CY + CARD_H / 2 + 6, y1 = y - LR - 10; const my = (y0 + y1) / 2;
        return `<path class="base" d="M${CX} ${y0} C${CX} ${my},${x} ${my},${x} ${y1}" fill="none" stroke="url(#s02lg)" stroke-width="3" stroke-linecap="round" opacity=".55"/>
                <path class="flow" d="M${CX} ${y0} C${CX} ${my},${x} ${my},${x} ${y1}" fill="none" stroke="#ffd48a" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 22" opacity="0"/>`; }).join('')}</svg>`);
    root.appendChild(svg);
    const bases = [...svg.querySelectorAll('.base')], flows = [...svg.querySelectorAll('.flow')];

    /* ---- the three looks: live 3D renders in round lenses ---- */
    const scene = R3D.scene({ key: 1.6 });
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
    const cam3 = R3D.camera(30);
    const looks = LOOKS.map(([v, x, y]) => {
      const acc = VARIANTS[v].accent;
      const wrap = el(`<div class="abs" style="left:${x - LR}px;top:${y - LR}px;width:${LR * 2}px;height:${LR * 2}px;opacity:0">
        <div class="abs" style="inset:0;border-radius:50%;background:radial-gradient(circle at 50% 38%,#26303f,#0c0d11 70%);box-shadow:0 30px 60px rgba(0,0,0,.55)"></div></div>`);
      root.appendChild(wrap);
      const cv = canvas3d(wrap, { x: 0, y: 0, w: LR * 2, h: LR * 2, style: 'border-radius:50%' });
      const ring = el(`<div class="abs" style="inset:-7px;border-radius:50%;border:3px solid ${acc};box-shadow:0 0 26px ${acc}66,inset 0 0 18px ${acc}33"></div>`);
      wrap.appendChild(ring);
      const lab = el(`<div class="abs mono" style="left:${x - 150}px;width:300px;top:${y + LR + 18}px;text-align:center;font-size:19px;letter-spacing:.2em;color:${acc};opacity:0">${VARIANTS[v].name.toUpperCase()}</div>`);
      root.appendChild(lab);
      return { wrap, cv, ring, lab, v };
    });

    /* ---- the ONE file ---- */
    const card = el(`<div class="abs" style="left:${CX - CARD_W / 2}px;top:${CY - CARD_H / 2}px;width:${CARD_W}px;height:${CARD_H}px;border-radius:18px;opacity:0;overflow:hidden;
      background:linear-gradient(180deg,rgba(60,44,26,.96),rgba(22,18,16,.97));border:2px solid rgba(245,166,35,.85)">
      <div class="abs" style="left:0;right:0;top:34px;display:flex;justify-content:center">${DOC(118, '#f5a623', '#f5c77a', 'rgba(245,166,35,.1)', 1.1)}</div>
      <div class="abs disp6" style="left:0;right:0;top:214px;text-align:center;font-size:32px;color:#eef1f6">watch.blend</div>
      <div class="abs shine" style="left:-160px;top:-40px;width:110px;height:400px;transform:rotate(18deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)"></div></div>`);
    root.appendChild(card);
    root.appendChild(flash);
    const shine = card.querySelector('.shine');
    const bloom = el(`<div class="abs" style="left:${CX - 300}px;top:${CY - 300}px;width:600px;height:600px;border-radius:50%;opacity:0;background:radial-gradient(circle,rgba(245,166,35,.34),rgba(232,125,13,.1) 45%,transparent 70%)"></div>`);
    root.insertBefore(bloom, card);

    /* ---- the statement, flanking the file ---- */
    const h1 = el(`<div class="abs disp" style="right:${1920 - (CX - CARD_W / 2 - 50)}px;top:${CY - 52}px;font-size:100px;white-space:nowrap;text-align:right">${words('ONE FILE.')}</div>`);
    const h2 = el(`<div class="abs disp" style="left:${CX + CARD_W / 2 + 50}px;top:${CY - 52}px;font-size:100px;white-space:nowrap">${words('EVERY LOOK.')}</div>`);
    root.appendChild(h1); root.appendChild(h2);
    // keep both inside the safe area (the right one is the longer)
    const w2 = h2.getBoundingClientRect().width, maxW = 1790 - (CX + CARD_W / 2 + 50);
    if (w2 > maxW) { const f = 100 * maxW / w2; h1.style.fontSize = h2.style.fontSize = f + 'px'; h1.style.top = h2.style.top = (CY - f * .52) + 'px'; }
    gradify(h2);

    /* ---- sound ---- */
    ctx.cue(T_PULL + .05, 'riser', { gain: .8 });
    ctx.cue(T_MERGE - .45, 'whoosh', { gain: .7 });
    ctx.cue(T_MERGE, 'hit', { gain: 1 });
    ctx.cue(T_MERGE + .08, 'shimmer', { gain: .7 });
    T_LOOK.forEach((t, k) => ctx.cue(t, 'pop', { gain: .75, pitch: [0, 3, 7][k], pan: [-.5, 0, .5][k] }));
    ctx.cue(T_H1, 'swish', { gain: .45, pan: -.3 });
    ctx.cue(T_H2, 'sparkle', { gain: .6, pan: .3 });

    return lt => {
      const u = lt - T_MERGE;
      // cloud: drift, then spiral into the core
      tiles.forEach((o, i) => {
        const q = prog(lt, T_PULL + o.d, PULL - o.d), k = ease.in(q);
        const drift = 1 - k;
        const ang = o.a0 + k * 2.1 + Math.sin(lt * .4 + o.ph) * .03 * drift;
        const r = o.r0 * (1 - k);
        const x = CX + Math.cos(ang) * r + Math.sin(lt * .5 + o.ph) * 14 * drift, y = CY + Math.sin(ang) * r * .92 + Math.cos(lt * .45 + o.ph) * 12 * drift - lt * 6 * drift;
        const sc = lerp(1, .12, k);
        o.t.style.transform = `translate(${x - o.w / 2}px,${y - o.h / 2}px) rotate(${o.rot + k * o.spin}deg) scale(${sc})`;
        o.t.style.opacity = o.op * (1 - clamp((q - .82) / .18));
      });
      // core gathers during the pull, bursts at the merge
      const g = ease.in(prog(lt, T_PULL + PULL * .2, PULL * .8));
      core.style.opacity = u < 0 ? g * .9 : Math.max(0, 1 - u * 2.5);
      core.style.transform = `scale(${u < 0 ? lerp(.15, 1, g) : 1 + u * 2})`;
      swirl.style.opacity = u < 0 ? g * .85 : Math.max(0, .85 - u * 3);
      swirl.style.transform = `rotate(${lt * 260 + g * 400}deg) scale(${u < 0 ? lerp(.4, 1, g) : 1 + u * 1.5})`;
      flash.style.opacity = u >= 0 ? Math.exp(-u * 5) : g * .15;
      rings.forEach((r, k) => {
        const q = prog(u, k * .1, .9), s = ease.out(q) * (k ? 1500 : 1900);
        r.style.opacity = q > 0 && q < 1 ? (1 - q) * .9 : 0;
        r.style.width = r.style.height = s + 'px'; r.style.left = (CX - s / 2) + 'px'; r.style.top = (CY - s / 2) + 'px';
      });
      sparks.forEach(({ s, a, v, sz }) => {
        const q = prog(u, 0, 1.1), d = ease.out(q) * v * .9;
        s.style.opacity = q > 0 && q < 1 ? 1 - q : 0;
        s.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d * .8}px) scale(${sz * (1 - q * .6)})`;
      });
      warm.style.opacity = ease.inOut(prog(u, -.2, 1.2));

      // the file card
      const cp = prog(u, 0, .55), ck = ease.back(cp);
      card.style.opacity = clamp(cp * 4);
      card.style.transform = `translateY(${Math.sin(lt * 1.2) * 5 * clamp(u)}px) scale(${lerp(.3, 1, ck)})`;
      const hot = Math.exp(-Math.max(0, u) * 2.2) * (u >= 0 ? 1 : 0);
      card.style.boxShadow = `0 40px 90px rgba(0,0,0,.55),0 0 ${40 + hot * 80}px rgba(245,166,35,${.35 + hot * .5})`;
      bloom.style.opacity = u >= 0 ? .75 + .25 * Math.sin(lt * 2) : 0;
      shine.style.transform = `translateX(${lerp(0, 520, ease.inOut(prog(u, .35, .8)))}px) rotate(18deg)`;

      // connectors + looks
      bases.forEach((p, k) => drawOn(p, lt, T_LINES + k * .1, .45));
      flows.forEach((p, k) => { p.style.opacity = clamp(prog(lt, T_LINES + .5, .4)) * .8; p.style.strokeDashoffset = -lt * 50 - k * 9; });
      looks.forEach((o, k) => {
        const p = prog(lt, T_LOOK[k], .6), kk = ease.back(p);
        o.wrap.style.opacity = clamp(p * 4);
        o.wrap.style.transform = `translateY(${(1 - kk) * -60 + Math.sin(lt * 1.1 + k * 1.7) * 5 * clamp(p)}px) scale(${lerp(.4, 1, kk)})`;
        o.lab.style.opacity = ease.out(prog(lt, T_LOOK[k] + .3, .4));
        const flare = Math.exp(-Math.max(0, lt - T_LOOK[k]) * 3) * (p > 0 ? 1 : 0);
        o.ring.style.opacity = .75 + flare * .25;
        if (p <= 0) return;
        paintWatch(watch, o.v, o.v, 0); setTime(watch, lt * 6 + 30 + k * 20);
        pivot.rotation.set(-.08, Math.sin(lt * .6 + k * 1.3) * .38 + (1 - kk) * 1.2, 0);
        cam3.position.set(0, .15, 9.2); cam3.lookAt(0, 0, 0);
        o.cv.draw(scene, cam3);
      });

      // statement
      revealMasks(h1, lt, T_H1, .08, .75);
      revealMasks(h2, lt, T_H2, .08, .75);
    };
  },
});
