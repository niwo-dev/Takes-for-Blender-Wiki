// s03 — the title drop: the mark (three stacked takes) assembles, the wordmark rises letter by letter,
// then the tagline and the version pill; afterwards a confident, calm hold.
// Every time is relative to the VO lines (ctx.line / lineEnd / dur).
import { defineScene, el, ease, prog, clamp, lerp } from '../engine.js';
import { letters, gradify } from '../ui.js';

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

defineScene({
  id: 's03_title',
  transitionIn: 'flash',
  camera: { zoom: .035 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .3, part: .5, glow: 1.15, ax: .25, ay: .3, bx: .75, by: .7 },
  build(root, ctx) {
    const L = i => ctx.line(i), LE = i => ctx.lineEnd(i), D = ctx.dur;
    const T_LAND = [.18, .34, .52], T_DONE = T_LAND[2] + .04;          // slabs land (bottom, middle, top)
    const T_SLIDE = Math.max(T_DONE + .12, L(0) - .28);                  // mark makes room for the wordmark
    const T_TAKES = T_SLIDE + .26, T_FB = T_TAKES + .42;
    const T_TAG = L(1), T_PILL = L(1) + .85, T_SHEEN = lerp(LE(1), D, .35);

    // light behind the lockup
    const halo = el(`<div class="abs" style="left:160px;top:40px;width:1600px;height:800px;border-radius:50%;opacity:0;
      background:radial-gradient(ellipse at 50% 50%,rgba(245,166,35,.2),rgba(58,123,200,.12) 40%,transparent 68%)"></div>`);
    root.appendChild(halo);
    const burst = el(`<div class="abs" style="left:0;top:0;width:560px;height:560px;border-radius:50%;opacity:0;background:radial-gradient(circle,rgba(255,236,200,.85),rgba(245,166,35,.35) 30%,transparent 65%)"></div>`);
    root.appendChild(burst);
    const ring = el('<div class="abs" style="left:0;top:0;border-radius:50%;border:3px solid #f5a623;opacity:0"></div>');
    root.appendChild(ring);

    const LK = buildLockup(root, 's03m', { cx: 960, cy: 432, F: 232 });
    const markCX = LK.x0 + LK.mW / 2, markCY = 432;
    burst.style.left = (markCX - 280) + 'px'; burst.style.top = (markCY - 280) + 'px';
    const letterEls = [...LK.takes.querySelectorAll('.mask>span')];
    // tagline (small kicker) and version pill, centred under the lockup
    const tag = el(`<div class="abs mono" style="left:0;width:1920px;top:${432 + 170}px;text-align:center;font-size:24px;letter-spacing:.26em;color:#aeb7c8;white-space:nowrap;opacity:0">STAGE MANAGEMENT FOR PRODUCT VISUALIZATION</div>`);
    root.appendChild(tag);
    const pill = el(`<div class="abs" style="left:0;width:1920px;top:${432 + 236}px;display:flex;justify-content:center;opacity:0">
      <div class="mono" style="display:flex;align-items:center;gap:12px;height:50px;padding:0 24px;border-radius:25px;font-size:21px;letter-spacing:.1em;color:#f5a623;
        border:1.5px solid rgba(245,166,35,.7);background:rgba(245,166,35,.1);box-shadow:0 0 24px rgba(245,166,35,.18)"><i style="width:9px;height:9px;border-radius:50%;background:#f5a623;box-shadow:0 0 10px #f5a623"></i>Blender 5.0+</div></div>`);
    root.appendChild(pill);

    /* ---- sound ---- */
    T_LAND.forEach((t, k) => ctx.cue(t, 'tick', { gain: .55 + k * .1, pitch: k * 4 }));
    ctx.cue(T_DONE, 'sparkle', { gain: .8 }); ctx.cue(T_DONE + .03, 'chime', { gain: .7 });
    [0, 4].forEach((i, k) => ctx.cue(T_TAKES + i * .065, 'pop', { gain: .38, pitch: 2 + k * 4, pan: -.1 + k * .2 }));
    ctx.cue(T_FB, 'swish', { gain: .3, pan: .3 });
    ctx.cue(T_TAG, 'shimmer', { gain: .6 });
    ctx.cue(T_PILL, 'pop', { gain: .6, pitch: 5 });
    ctx.cue(T_SHEEN, 'shimmer', { gain: .3, pitch: 3 });

    return lt => {
      // mark: slabs drop and stack, then the mark slides left to make room for the wordmark
      LK.slabs.forEach((g, k) => {
        const p = prog(lt, T_LAND[k] - .3, .3), kk = ease.out(p);
        const bounce = Math.exp(-Math.max(0, lt - T_LAND[k]) * 9) * Math.sin(Math.max(0, lt - T_LAND[k]) * 34) * 7 * (lt > T_LAND[k] ? 1 : 0);
        const breathe = Math.sin(lt * 1.3 + k * .9) * 2.2 * clamp(prog(lt, T_FB + .8, 1.2)) * (k - 1);
        g.setAttribute('transform', `translate(0 ${(1 - kk) * -260 - bounce + breathe})`);
        g.style.opacity = clamp(p * 3);
      });
      const sk = ease.expo(prog(lt, T_SLIDE, .55));
      LK.mark.style.transform = `translateX(${(1 - sk) * LK.homeDX}px)`;
      const glow = Math.exp(-Math.max(0, lt - T_DONE) * 2.5) * (lt >= T_DONE ? 1 : 0);
      LK.mark.style.filter = `drop-shadow(0 0 ${14 + glow * 40}px rgba(245,166,35,${.22 + glow * .5})) drop-shadow(0 22px 30px rgba(0,0,0,.45))`;
      const bx = (1 - sk) * LK.homeDX;
      burst.style.transform = `translateX(${bx}px) scale(${.4 + glow * .8})`; burst.style.opacity = glow * .9;
      const rq = prog(lt, T_DONE, .8), rs = ease.out(rq) * 700;
      ring.style.opacity = rq > 0 && rq < 1 ? (1 - rq) * .8 : 0;
      ring.style.width = ring.style.height = rs + 'px'; ring.style.left = (markCX + bx - rs / 2) + 'px'; ring.style.top = (markCY - rs / 2) + 'px';
      halo.style.opacity = .55 + .45 * ease.out(prog(lt, T_DONE, 1)) + Math.sin(lt * .9) * .08;

      // wordmark
      letterEls.forEach((s, i) => { const p = ease.expo(prog(lt, T_TAKES + i * .065, .75)); s.style.transform = `translateY(${(1 - p) * 105}%)`; });
      const fp = prog(lt, T_FB, .9);
      LK.fb.style.opacity = ease.out(fp);
      LK.fb.style.letterSpacing = (LK.ls + (1 - ease.expo(fp)) * 26) + 'px';
      LK.fb.style.transform = `translateX(${(1 - ease.expo(fp)) * -130}px)`;
      // a slow light sweep across the wordmark during the hold
      const sp = prog(lt, T_SHEEN, 1.4);
      LK.takes.style.filter = sp > 0 && sp < 1 ? `brightness(${1 + Math.sin(sp * Math.PI) * .25})` : 'none';

      // tagline + pill
      const tp = prog(lt, T_TAG, 1.1);
      tag.style.opacity = ease.out(tp); tag.style.letterSpacing = (.26 + (1 - ease.expo(tp)) * .22) + 'em';
      const pp = prog(lt, T_PILL, .5), pk = ease.back(pp);
      pill.style.opacity = clamp(pp * 3); pill.style.transform = `translateY(${(1 - pk) * 18}px) scale(${lerp(.7, 1, pk)})`;
    };
  },
});
