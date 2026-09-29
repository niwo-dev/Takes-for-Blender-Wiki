// s20 — recap and end card: a fast wall of the features shown in the film converges into the mark,
// the wordmark returns, the three promises land in rhythm, then a quiet CTA and a calm held end card.
// Every time is relative to the VO lines (ctx.line / lineEnd / dur).
import { defineScene, el, ease, prog, clamp, lerp, rng } from '../engine.js';
import { icon, letters, words, gradify, revealMasks } from '../ui.js';

/* ============ Takes mark + lockup — shared verbatim with s20_outro.js (keep both copies identical) ============ */
// Three stacked isometric slabs, deep blue / bright blue / orange; the top one carries an inset frame (the take).
const MARK_SLABS = [   // bottom → top: [top face light, top face dark, left side, right side]
  ['#3570ad', '#1f4a78', '#18395c', '#102943'],
  ['#58a0f0', '#3574c2', '#2a5d9a', '#1d4677'],
  ['#ffbd52', '#ec8010', '#bf630b', '#8f4806'],
];
const MARK_VB = [-104, -110, 208, 234];
function markSVG(id, h) {
  const a = 100, b = a * Math.tan(Math.PI / 6), t = 17, gap = 47;
  const slab = (k, c) => {
    const y = (1 - k) * gap;
    return `<g class="slab">
      <path d="M${-a} ${y}L0 ${y + b}L0 ${y + b + t}L${-a} ${y + t}Z" fill="${c[2]}"/>
      <path d="M0 ${y + b}L${a} ${y}L${a} ${y + t}L0 ${y + b + t}Z" fill="${c[3]}"/>
      <path d="M0 ${y - b}L${a} ${y}L0 ${y + b}L${-a} ${y}Z" fill="url(#${id}g${k})"/>
      <path d="M${-a + 1} ${y}L0 ${y - b + .6}L${a - 1} ${y}" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="1.6" stroke-linejoin="round"/>
      ${k === 2 ? `<path d="M0 ${y - b * .52}L${a * .52} ${y}L0 ${y + b * .52}L${-a * .52} ${y}Z" fill="rgba(255,232,190,.16)" stroke="rgba(255,238,210,.85)" stroke-width="3.2" stroke-linejoin="round"/>` : ''}
    </g>`;
  };
  return `<svg viewBox="${MARK_VB.join(' ')}" width="${h * MARK_VB[2] / MARK_VB[3]}" height="${h}" style="display:block;overflow:visible">
    <defs>${MARK_SLABS.map((c, k) => `<linearGradient id="${id}g${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`).join('')}</defs>
    ${MARK_SLABS.map((c, k) => slab(k, c)).join('')}</svg>`;
}
// Lockup: [mark]  TAKES / FOR BLENDER, centred on (cx, cy). F = size of "TAKES" in px.
function buildLockup(root, id, { cx, cy, F }) {
  const mH = F * 1.06, gapX = F * .2;
  const mark = el(`<div class="abs" style="left:0;top:0">${markSVG(id, mH)}</div>`);
  const takes = el(`<div class="abs disp" style="left:0;top:0;font-size:${F}px;white-space:nowrap;line-height:.95">${letters('TAKES')}</div>`);
  const fb = el(`<div class="abs disp6" style="left:0;top:0;font-size:${F * .2}px;white-space:nowrap;line-height:1;color:#eef1f6">FOR BLENDER</div>`);
  root.appendChild(mark); root.appendChild(takes); root.appendChild(fb);
  const tW = takes.getBoundingClientRect().width, fW = fb.getBoundingClientRect().width;
  const ls = (tW - fW) / 10;                               // track "FOR BLENDER" to the width of "TAKES"
  fb.style.letterSpacing = ls + 'px';
  const mW = mH * MARK_VB[2] / MARK_VB[3], total = mW + gapX + tW;
  const x0 = cx - total / 2, tx = x0 + mW + gapX;
  const capsTop = -.145 * F, blockH = .7 * F + F * .13 + .7 * F * .2;   // TAKES caps + gap + FOR BLENDER caps
  const T0 = cy - blockH / 2 + capsTop;                     // top of the TAKES line box
  takes.style.left = tx + 'px'; takes.style.top = T0 + 'px';
  fb.style.left = tx + 'px'; fb.style.top = (T0 + .845 * F + F * .13 - .17 * F * .2) + 'px';
  mark.style.left = x0 + 'px'; mark.style.top = (cy - mH / 2) + 'px';
  gradify(takes);
  return { mark, takes, fb, slabs: [...mark.querySelectorAll('.slab')], ls, mW, mH, x0, tx, tW, homeDX: cx - mW / 2 - x0 };
}
/* ============ end of shared mark code ============ */

// the recap wall: fewer, larger words (English only)
const WALL = [['Takes Tree', 'take'], ['Cascade', 'layers'], ['Review Loop', 'refresh'], ['Variant Switch', 'palette'],
  ['Rest State', 'undo'], ['Diff State', 'diff'], ['Multi-Cam', 'camera'], ['Sequencer', 'strip'],
  ['Batch Render', 'render'], ['Smart Output', 'folder'], ['Parent State', 'inherit'], ['AI Assistant', 'robot']];
const COLS = 3, TW = 520, TH = 118, GX = 30, GY = 26;
const LCY = 372, LF = 200;                                    // lockup centre y, size of "TAKES"

defineScene({
  id: 's20_outro',
  transitionIn: 'flash',
  camera: { zoom: .03 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .28, part: .45, glow: 1.2, ax: .22, ay: .3, bx: .78, by: .72 },
  build(root, ctx) {
    const L = i => ctx.line(i), LE = i => ctx.lineEnd(i), D = ctx.dur;
    const T_MARK = L(0) - .12;                                 // the wall has converged into the mark
    const T_CONV = T_MARK - .34;                               // wall starts to converge
    const T_TAKES = L(0) + .02, T_FB = T_TAKES + .4;
    const T_PH = [0, .75, 1.5].map(k => L(1) + k);             // One file. / Every look. / Every render.
    const T_CHIME = Math.max(T_PH[2] + .9, LE(1) + .25), T_CTA = T_CHIME + .25;

    // light
    const halo = el(`<div class="abs" style="left:160px;top:-40px;width:1600px;height:840px;border-radius:50%;opacity:0;
      background:radial-gradient(ellipse at 50% 50%,rgba(245,166,35,.2),rgba(58,123,200,.12) 40%,transparent 68%)"></div>`);
    root.appendChild(halo);

    /* ---- the mark returns, the wordmark follows ---- */
    const burst = el(`<div class="abs" style="left:0;top:0;width:620px;height:620px;border-radius:50%;opacity:0;background:radial-gradient(circle,rgba(255,236,200,.9),rgba(245,166,35,.38) 30%,transparent 65%)"></div>`);
    root.appendChild(burst);
    const ringEls = [0, 1].map(k => { const r = el(`<div class="abs" style="left:0;top:0;border-radius:50%;border:${k ? 2 : 3}px solid ${k ? '#3a7bc8' : '#f5a623'};opacity:0"></div>`); root.appendChild(r); return r; });
    const LK = buildLockup(root, 's20m', { cx: 960, cy: LCY, F: LF });
    const markCX = LK.x0 + LK.mW / 2;
    const letterEls = [...LK.takes.querySelectorAll('.mask>span')];

    /* ---- the recap wall ---- */
    const rows = Math.ceil(WALL.length / COLS), gw = COLS * TW + (COLS - 1) * GX, gh = rows * TH + (rows - 1) * GY;
    const gx0 = 960 - gw / 2, gy0 = 540 - gh / 2;
    const R = rng(31);
    const tiles = WALL.map(([name, ic], i) => {
      const c = i % COLS, r = Math.floor(i / COLS);
      const x = gx0 + c * (TW + GX), y = gy0 + r * (TH + GY);
      const col = i % 2 ? '#6aa6ea' : '#f5a623';
      const t = el(`<div class="abs" style="left:${x}px;top:${y}px;width:${TW}px;height:${TH}px;border-radius:14px;display:flex;align-items:center;gap:26px;padding-left:34px;opacity:0;
        background:linear-gradient(180deg,rgba(38,58,86,.72),rgba(16,16,22,.9));border:1px solid rgba(255,255,255,.14);box-shadow:0 26px 60px rgba(0,0,0,.45)">
        <span class="wl" style="display:flex;align-items:center;gap:26px">${icon(ic, 46, col, 2.2)}<span class="disp" style="font-size:46px;white-space:nowrap;letter-spacing:-.01em">${name.toUpperCase()}</span></span></div>`);
      root.appendChild(t);
      const dx = x + TW / 2 - 960, dy = y + TH / 2 - 540;
      return { t, lab: t.querySelector('.wl'), dx: x + TW / 2 - markCX, dy: y + TH / 2 - LCY, d: Math.hypot(dx, dy), inT: -.22 + (c * .12 + r * .08) + R() * .04 };
    });

    /* ---- the three promises ---- */
    const PH = ['ONE FILE.', 'EVERY LOOK.', 'EVERY RENDER.'];
    const phRow = el(`<div class="abs" style="left:0;width:1920px;top:${LCY + 196}px;display:flex;justify-content:center;gap:64px"></div>`);
    root.appendChild(phRow);
    const phEls = PH.map((p, k) => { const d = el(`<div class="disp" style="position:relative;font-size:68px;white-space:nowrap">${words(p)}</div>`); phRow.appendChild(d); return d; });
    gradify(phEls[2]);
    const dots = [0, 1].map(k => { const d = el('<i class="abs" style="width:10px;height:10px;border-radius:50%;background:#f5a623;box-shadow:0 0 12px #f5a623;opacity:0"></i>'); root.appendChild(d); return d; });
    // centre the separators between the phrases
    const phR = phEls.map(e => e.getBoundingClientRect());
    dots.forEach((d, k) => { d.style.left = ((phR[k].right + phR[k + 1].left) / 2 - 5) + 'px'; d.style.top = (LCY + 196 + 68 * .48) + 'px'; });

    /* ---- quiet CTA ---- */
    const cta = el(`<div class="abs mono" style="left:0;width:1920px;top:${LCY + 330}px;text-align:center;font-size:22px;letter-spacing:.2em;color:#9aa3b5;white-space:nowrap;opacity:0">
      <span style="color:#f5a623">BLENDER 5.0+</span>&nbsp;&nbsp;·&nbsp;&nbsp;COURSE &amp; MANUAL ON THE WIKI</div>`);
    root.appendChild(cta);

    /* ---- end-card sparkles: kept to the mark and the lower band (never over text) ---- */
    const SR = rng(5);
    const sparks = Array.from({ length: 26 }, (_, k) => {
      const nearMark = k < 10;
      const x = nearMark ? markCX - 160 + SR() * 240 : 180 + SR() * 1560, y = nearMark ? LCY + (SR() - .5) * 280 : 820 + SR() * 200;
      const s = el(`<i class="abs" style="left:${x}px;top:${y}px;width:6px;height:6px;border-radius:50%;background:${SR() < .6 ? '#f5a623' : '#8fbcf0'};box-shadow:0 0 10px 2px currentColor;opacity:0"></i>`);
      root.appendChild(s); return { s, ph: SR() * 6.28, sp: .5 + SR() * .8, rise: 8 + SR() * 18, near: nearMark, sz: .6 + SR() * .9 };
    });

    /* ---- sound ---- */
    [.05, .3, .55].forEach((t, k) => ctx.cue(t, 'tick', { gain: .5, pitch: k * 3, pan: -.4 + k * .4 }));
    ctx.cue(T_CONV - .1, 'whoosh', { gain: .7 });
    ctx.cue(T_MARK, 'sparkle', { gain: .9 }); ctx.cue(T_MARK + .02, 'hit', { gain: .55 });
    ctx.cue(T_FB, 'shimmer', { gain: .45 });
    T_PH.forEach((t, k) => ctx.cue(t, 'hit', { gain: .42 + k * .06, pitch: k * 2 }));
    ctx.cue(T_CHIME, 'chime', { gain: 1 }); ctx.cue(T_CHIME + .05, 'shimmer', { gain: .5 });

    return lt => {
      // wall: tiles fly in from depth, hold for a beat, then converge into the mark
      tiles.forEach(o => {
        const p = prog(lt, o.inT, .45), k = ease.out(p);
        const c = prog(lt, T_CONV + (o.d / 1100) * .06, .34), ck = ease.in(c);
        o.t.style.opacity = clamp(p * 2.5) * (1 - clamp((c - .55) / .45));
        o.lab.style.opacity = 1 - clamp(c / .3);               // words clear before the tiles collapse
        o.t.style.transform = `translate(${-o.dx * ck}px,${(1 - k) * 18 - o.dy * ck}px) scale(${lerp(.82, 1, k) * lerp(1, .06, ck)})`;
      });

      // mark: appears where the wall collapsed, then slides left to make room for the wordmark
      const mp = prog(lt, T_MARK - .06, .5), mk = ease.back(mp);
      const slideX = 0;
      LK.mark.style.opacity = clamp(mp * 4);
      LK.mark.style.transform = `translateX(${slideX}px) scale(${lerp(.3, 1, mk)})`;
      LK.slabs.forEach((g, k) => { const br = Math.sin(lt * 1.3 + k * .9) * 2.2 * clamp(prog(lt, T_FB + .8, 1.2)) * (k - 1); g.setAttribute('transform', `translate(0 ${br})`); });
      const hitK = Math.exp(-Math.max(0, lt - T_MARK) * 2.5) * (lt >= T_MARK ? 1 : 0), chK = Math.exp(-Math.max(0, lt - T_CHIME) * 1.6) * (lt >= T_CHIME ? 1 : 0);
      const gl = Math.max(hitK, chK * .8);
      LK.mark.style.filter = `drop-shadow(0 0 ${14 + gl * 40}px rgba(245,166,35,${.22 + gl * .5})) drop-shadow(0 22px 30px rgba(0,0,0,.45))`;
      burst.style.left = (markCX + slideX - 310) + 'px'; burst.style.top = (LCY - 310) + 'px';
      burst.style.opacity = Math.max(hitK * .95, chK * .5); burst.style.transform = `scale(${.4 + Math.max(hitK, chK) * .8})`;
      ringEls.forEach((r, k) => {
        const q = prog(lt, T_MARK + k * .1, .9), s = ease.out(q) * (k ? 900 : 1200);
        r.style.opacity = q > 0 && q < 1 ? (1 - q) * .8 : 0;
        r.style.width = r.style.height = s + 'px'; r.style.left = (markCX + slideX - s / 2) + 'px'; r.style.top = (LCY - s / 2) + 'px';
      });
      halo.style.opacity = .5 * ease.out(prog(lt, T_MARK, .8)) + .35 * chK + .12 * Math.sin(lt * .8) * clamp(lt - T_CHIME);

      // wordmark
      letterEls.forEach((s, i) => { const p = ease.expo(prog(lt, T_TAKES + i * .065, .75)); s.style.transform = `translateY(${(1 - p) * 105}%)`; });
      const fp = prog(lt, T_FB, .9);
      LK.fb.style.opacity = ease.out(fp);
      LK.fb.style.letterSpacing = (LK.ls + (1 - ease.expo(fp)) * 22) + 'px';
      LK.fb.style.transform = `translateX(${(1 - ease.expo(fp)) * -110}px)`;

      // the three promises, one per beat
      phEls.forEach((e, k) => {
        revealMasks(e, lt, T_PH[k], .07, .7);
        const hk = Math.exp(-Math.max(0, lt - T_PH[k] - .15) * 4) * (lt >= T_PH[k] ? 1 : 0);
        e.style.transform = `scale(${1 + hk * .04})`;
      });
      dots.forEach((d, k) => { const p = prog(lt, T_PH[k + 1] - .12, .3); d.style.opacity = ease.out(p); d.style.transform = `scale(${lerp(.2, 1, ease.back(p))})`; });

      // CTA
      const cp = prog(lt, T_CTA, 1);
      cta.style.opacity = ease.out(cp) * .95; cta.style.letterSpacing = (.2 + (1 - ease.expo(cp)) * .16) + 'em';

      // sparkles on the end card
      const on = clamp(prog(lt, T_FB, 1.5));
      sparks.forEach(o => {
        const tw = .5 + .5 * Math.sin(lt * o.sp * 3 + o.ph);
        o.s.style.opacity = on * tw * (o.near ? .55 : .4);
        o.s.style.transform = `translateY(${-((lt * o.rise) % 60)}px) scale(${o.sz})`;
      });
    };
  },
});
