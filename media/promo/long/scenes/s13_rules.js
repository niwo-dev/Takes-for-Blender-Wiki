// Tags & Rules: colour tags fly into the Takes Tree; an OUTPUT rule assembles from five preset
// chips, is dragged onto the View Layer Group "Hero Shots", and the three view layers inside pick up
// every preset through the cascade. One short headline lands only after the motion has settled.
// All timing is relative to the VO lines (ctx.line / ctx.lineEnd / ctx.dur).
import { defineScene, el, ease, prog, clamp, lerp, rgba } from '../engine.js';
import { icon, headline, panel, Cursor, pop, fade, float } from '../ui.js';

const CUSTOM = {
  output: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M7 9h3M7 9v3M17 15h-3M17 15v-3"/>',
  grip: '<circle cx="9" cy="6" r="1.4" fill="currentColor"/><circle cx="15" cy="6" r="1.4" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/><circle cx="9" cy="18" r="1.4" fill="currentColor"/><circle cx="15" cy="18" r="1.4" fill="currentColor"/>',
};
const ico = (n, s, c, sw = 2) => CUSTOM[n]
  ? `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="color:${c};flex:none;display:block">${CUSTOM[n]}</svg>`
  : icon(n, s, c, sw);
const bump = (lt, t, w) => Math.max(0, 1 - Math.abs(lt - t) / w);

/* ---------- tree ---------- */
const PX = 120, PY = 250, PW = 760, PH = 560, HEAD = 54;
const RY = i => 22 + i * 84, RH = 70;                        // row top inside the panel body
const rowMid = i => PY + HEAD + RY(i) + RH / 2;              // stage y of a row centre
const TAGX = PX + 18 + 330;                                  // stage x of the tag column
const ROWS = [
  { label: 'Kitchen', ic: 'cube', d: 0 },
  { label: 'Hero Shots', ic: 'layers', d: 1, target: true },
  { label: 'Front 3/4', ic: 'layer', d: 2, vl: true },
  { label: 'Top', ic: 'layer', d: 2, vl: true },
  { label: 'Detail', ic: 'layer', d: 2, vl: true },
];
const TAGS = [                                                // in flight order
  { t: 'Client A', c: '#3a7bc8', row: 0 },
  { t: 'Spring 26', c: '#e0569a', row: 0 },
  { t: 'Hero', c: '#f5a623', row: 2 },
  { t: 'Print', c: '#2fc4b2', row: 3 },
  { t: 'Draft', c: '#8d96a8', row: 4 },
];
/* ---------- rule card ---------- */
const CX = 1040, CY = 250, CWD = 680, CHT = 560;
const SLOTS = [
  { ic: 'sparkle', v: 'Cycles · 512 spp', c: '#f5a623' },
  { ic: 'output', v: '1920×1080', c: '#5b9be0' },
  { ic: 'file', v: 'PNG 16-bit', c: '#2fc4b2' },
  { ic: 'layers', v: 'Beauty + AO', c: '#e0569a' },
  { ic: 'palette', v: 'AgX', c: '#eef1f6' },
];
const GRIP = [CX + CWD - 58, CY + 44];                          // stage position of the drag handle

defineScene({
  id: 's13_rules',
  transitionIn: 'blinds',
  mood: { a: '#265787', b: '#e0569a', grid: .28, part: .9, glow: 1.05, ax: .2, ay: .3, bx: .82, by: .7 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    /* ---------- timing ---------- */
    const tTag = TAGS.map((_, i) => L(0) + .05 + i * .32), FLY = .5;
    const tCard = L(1) - .05;
    const tSlot = SLOTS.map((_, k) => tCard + .35 + k * .17);
    const tDone = tCard + 1.35;
    const tGrab = L(1) + 1.95, tLift = tGrab + .28, tDrop = tGrab + .95;
    const tRip = tDrop + .12, tVL = [0, 1, 2].map(j => tRip + .12 + j * .16);
    const tBadge = tRip + .75;
    const tHead = Math.max(ctx.lineEnd(1) + .05, tBadge + .45);

    /* ---------- sound ---------- */
    ctx.cue(-.05, 'shimmer', { gain: .35, pan: .5 });
    tTag.forEach((t, i) => ctx.cue(t + FLY * .8, 'pop', { gain: .75, pitch: i * 2, pan: -.2 }));
    ctx.cue(tCard, 'whoosh', { gain: .45, pan: .5 });
    [0, 2, 4].forEach((k, j) => ctx.cue(tSlot[k] + .1, 'tick', { gain: .6, pitch: j * 3, pan: .5 }));
    ctx.cue(tDone, 'shimmer', { gain: .5, pan: .5 });
    ctx.cue(tLift, 'swish', { gain: .55, pan: .1 });
    ctx.cue(tDrop, 'thud', { gain: .75, pan: -.3 }); ctx.cue(tDrop + .02, 'click', { gain: .5, pan: -.3 });
    tVL.forEach((t, j) => ctx.cue(t, 'tick', { gain: .55, pitch: 4 + j * 3, pan: -.35 }));
    ctx.cue(tBadge, 'success', { gain: .6, pan: -.3 });
    ctx.cue(tHead, 'swish', { gain: .35, pan: .4 });

    /* ---------- Takes Tree panel ---------- */
    const P = panel(root, { x: PX, y: PY, w: PW, h: PH, title: 'Takes Tree', icon: 'layers' });
    // connector from Hero Shots down to its view layers (the cascade path)
    const gx = 16 + 1 * 38 + 13;                                // under the Hero Shots icon (row coords)
    const svg = el(`<svg class="abs" width="${PW}" height="${PH}" style="left:0;top:0;overflow:visible">
      <path d="M${18 + gx} ${RY(1) + RH} V${RY(4) + RH / 2}" stroke="rgba(255,255,255,.1)" stroke-width="3" fill="none"/>
      ${[2, 3, 4].map(i => `<path d="M${18 + gx} ${RY(i) + RH / 2} H${18 + 16 + 2 * 38 - 6}" stroke="rgba(255,255,255,.1)" stroke-width="3" fill="none"/>`).join('')}
      <path class="flow" d="M${18 + gx} ${RY(1) + RH} V${RY(4) + RH / 2}" stroke="#f5a623" stroke-width="3" stroke-dasharray="6 12" fill="none" stroke-linecap="round" opacity="0"/></svg>`);
    P.body.appendChild(svg);
    const flow = svg.querySelector('.flow');
    const drop = el(`<div class="abs" style="left:${18 + gx - 8}px;top:0;width:16px;height:16px;border-radius:50%;background:#f5a623;box-shadow:0 0 18px 6px rgba(245,166,35,.8);opacity:0"></div>`);
    P.body.appendChild(drop);
    const rows = ROWS.map((r, i) => {
      const e = el(`<div class="abs" style="left:18px;right:18px;top:${RY(i)}px;height:${RH}px;border-radius:9px;background:rgba(10,10,14,.45);border:1.5px solid rgba(255,255,255,.06)">
        <div class="abs" style="left:${16 + r.d * 38}px;top:${RH / 2 - 14}px">${icon(r.ic, 28, r.target ? '#f5a623' : '#c9d1de', 1.9)}</div>
        <div class="abs disp6" style="left:${16 + r.d * 38 + 42}px;top:0;height:${RH}px;display:flex;align-items:center;font-size:27px;color:#eef1f6;white-space:nowrap">${r.label}</div>
        ${r.vl ? `<div class="bolt abs" style="right:${20 + 5 * 24 + 12}px;top:${RH / 2 - 11}px;opacity:0">${icon('bolt', 22, '#f5a623', 2)}</div>
          <div class="dots abs" style="right:20px;top:${RH / 2 - 8}px;display:flex;gap:8px">${SLOTS.map(() => '<i style="display:block;width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.18)"></i>').join('')}</div>` : ''}
        <div class="ol abs" style="inset:-5px;border-radius:12px;border:2px dashed rgba(245,166,35,.8);opacity:0"></div></div>`);
      P.body.appendChild(e);
      return { e, dots: r.vl ? [...e.querySelectorAll('.dots i')] : [], bolt: e.querySelector('.bolt'), ol: e.querySelector('.ol'), r };
    });
    const badge = el(`<div class="abs" style="right:18px;top:${RY(5) - 2}px;height:44px;display:flex;align-items:center;gap:10px;padding:0 18px;border-radius:22px;background:rgba(47,196,178,.16);border:1.5px solid #2fc4b2;opacity:0">
      ${icon('check', 22, '#2fc4b2', 2.6)}<span class="mono" style="font-size:19px;letter-spacing:.14em;color:#eef1f6">3 SHOTS</span></div>`);
    P.body.appendChild(badge);

    /* ---------- tags: wait on the right at their row's height, then fly home along that row ---------- */
    const tagEls = TAGS.map(g => {
      const e = el(`<div class="abs" style="left:0;top:0;height:40px;display:flex;align-items:center;gap:8px;padding:0 16px 0 12px;border-radius:20px;background:${rgba(g.c, .2)};border:1.5px solid ${g.c};
        box-shadow:0 0 16px ${rgba(g.c, .28)};white-space:nowrap;transform-origin:0 50%;opacity:0">${icon('tag', 18, g.c, 2)}<span class="disp6" style="font-size:21px;color:#fff">${g.t}</span></div>`);
      root.appendChild(e); return { e, g, w: 0 };
    });
    tagEls.forEach(o => { o.w = o.e.offsetWidth; });
    const PAL = 1.4;
    let px0 = 1200;
    tagEls.forEach((o, i) => {
      const sameRow = i > 0 && TAGS[i - 1].row === o.g.row;
      o.sx = sameRow ? tagEls[i - 1].sx + tagEls[i - 1].w + 12 : TAGX;           // slot in the row
      o.px = sameRow ? tagEls[i - 1].px + tagEls[i - 1].w * PAL + 26 : px0;      // waiting position (right side)
      o.y = rowMid(o.g.row) - 20;
    });

    /* ---------- rule card ---------- */
    const card = el(`<div class="glass abs" style="left:${CX}px;top:${CY}px;width:${CWD}px;height:${CHT}px;border-radius:14px;transform-origin:${GRIP[0] - CX}px ${GRIP[1] - CY}px;opacity:0">
      <div class="abs" style="left:28px;top:24px;width:56px;height:56px;border-radius:12px;background:rgba(245,166,35,.18);border:1.5px solid #f5a623;display:flex;align-items:center;justify-content:center">${icon('bolt', 30, '#f5a623', 2)}</div>
      <div class="ttl abs disp6" style="left:102px;top:18px;font-size:34px;color:#fff;white-space:nowrap">FullHD_Cycles</div>
      <div class="abs mono" style="left:104px;top:62px;font-size:16px;letter-spacing:.2em;color:#f5a623;white-space:nowrap">OUTPUT RULE</div>
      <div class="abs" style="left:${GRIP[0] - CX - 14}px;top:${GRIP[1] - CY - 14}px">${ico('grip', 28, '#6b7385')}</div>
      <div class="abs" style="left:24px;right:24px;top:104px;height:1px;background:rgba(255,255,255,.08)"></div></div>`);
    root.appendChild(card);
    const slotEls = SLOTS.map((s, k) => {
      const e = el(`<div class="abs" style="left:28px;right:28px;top:${124 + k * 82}px;height:66px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:18px;padding:0 22px;opacity:0">
        ${ico(s.ic, 30, s.c, 2)}<span class="disp6" style="font-size:28px;color:#eef1f6;white-space:nowrap">${s.v}</span>
        <i style="margin-left:auto;display:block;width:16px;height:16px;border-radius:50%;background:${s.c};box-shadow:0 0 12px ${rgba(s.c, .7)}"></i></div>`);
      card.appendChild(e); return e;
    });
    // compact rule chip that the card collapses into, carried to the tier row
    const mini = el(`<div class="abs" style="left:0;top:0;height:46px;display:flex;align-items:center;gap:10px;padding:0 18px 0 12px;border-radius:12px;background:rgba(245,166,35,.2);border:1.5px solid #f5a623;
      box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 22px rgba(245,166,35,.35);white-space:nowrap;opacity:0">${icon('bolt', 22, '#f5a623', 2)}<span class="disp6" style="font-size:22px;color:#fff">FullHD_Cycles</span></div>`);
    root.appendChild(mini);
    const miniW = mini.offsetWidth;
    const rowY = rowMid(1);
    const dropTip = [TAGX + miniW + 12, rowY];

    /* ---------- headline: lands only after everything has settled ---------- */
    const Hd = headline(root, { x: 1010, y: 380, w: 800, kicker: 'Tags & Rules', size: 100, lines: ['ONE CLICK.', { t: 'WHOLE SETUP.', grad: true }] });

    /* ---------- cursor ---------- */
    const cursor = new Cursor(root, ctx, [
      { t: tGrab - .9, x: 1760, y: 700 },
      { t: tGrab, x: GRIP[0], y: GRIP[1], click: true },
      { t: tLift, x: GRIP[0], y: GRIP[1] },
      { t: tGrab + .72, x: 1000, y: rowY },
      { t: tDrop, x: dropTip[0], y: dropTip[1] },
      { t: tDrop + .7, x: dropTip[0] + 150, y: dropTip[1] + 250 },
    ], { hideAt: tDrop + .45 });

    return lt => {
      /* panel */
      const pk = ease.expo(prog(lt, -.45, .9));
      P.el.style.opacity = clamp((lt + .5) / .3);
      P.el.style.transform = `translateX(${(1 - pk) * -60}px)`;
      flow.style.strokeDashoffset = -lt * 50;

      /* tags */
      tagEls.forEach((o, i) => {
        const t0 = tTag[i], q = prog(lt, t0, FLY), e = ease.out4(q);
        const inP = ease.back(prog(lt, -.3 + i * .08, .5));
        const x = lerp(o.px, o.sx, e), s = lerp(PAL, 1, e) + .1 * bump(lt, t0 + FLY + .05, .22);
        const fl = q <= 0 ? float(lt, 5, 1.4, i * 1.3) : 0;
        o.e.style.opacity = clamp((lt + .3 - i * .08) / .25);
        o.e.style.transform = `translate(${x}px,${o.y + fl}px) scale(${q <= 0 ? PAL * lerp(.6, 1, inP) : s})`;
        o.e.style.boxShadow = `0 0 ${16 + 26 * bump(lt, t0 + FLY, .4)}px ${rgba(o.g.c, .28 + .4 * bump(lt, t0 + FLY, .4))}`;
      });
      rows.forEach((o, i) => {
        let fl = 0; TAGS.forEach((g, k) => { if (g.row === i) fl = Math.max(fl, bump(lt, tTag[k] + FLY + .05, .35)); });
        const own = TAGS.map((g, k) => g.row === i && lt >= tTag[k] + FLY ? g.c : null).filter(Boolean).pop();
        let bc = fl > .01 && own ? rgba(own, .3 + .6 * fl) : 'rgba(255,255,255,.06)';
        // drop targets while the rule is carried: any tier accepts it
        const carry = prog(lt, tLift, .25) * (1 - prog(lt, tDrop - .05, .2));
        const near = o.r.target ? clamp(prog(lt, tGrab + .5, tDrop - tGrab - .5)) : 0;
        o.ol.style.opacity = carry * (o.r.target ? .55 + .45 * near : .45);
        if (o.r.target) {
          const on = lt >= tDrop;
          const g = bump(lt, tDrop + .1, .5);
          bc = on ? `rgba(245,166,35,${.5 + .5 * g})` : bc;
          o.e.style.background = on ? `rgba(245,166,35,${.08 + .12 * g})` : 'rgba(10,10,14,.45)';
          o.e.style.boxShadow = g > .01 ? `0 0 ${30 * g}px rgba(245,166,35,${.5 * g})` : 'none';
        }
        if (o.r.vl) {
          const j = i - 2, t = tVL[j], g = bump(lt, t + .1, .45), lit = lt >= t;
          if (lit) bc = `rgba(91,155,224,${.35 + .55 * g})`;
          o.e.style.background = lit ? `rgba(58,123,200,${.08 + .14 * g})` : 'rgba(10,10,14,.45)';
          o.dots.forEach((d, k) => {
            const q = prog(lt, t + k * .045, .3), c = SLOTS[k].c;
            d.style.background = q > 0 ? c : 'transparent'; d.style.borderColor = q > 0 ? c : 'rgba(255,255,255,.18)';
            d.style.boxShadow = q > 0 ? `0 0 ${10 + 12 * bump(lt, t + k * .045 + .15, .3)}px ${rgba(c, .7)}` : 'none';
            d.style.transform = `scale(${q > 0 ? lerp(.4, 1, ease.back(q)) : 1})`;
          });
          { const q = prog(lt, t, .35); o.bolt.style.opacity = clamp(q * 3); o.bolt.style.transform = `scale(${lerp(.5, 1, ease.back(q))})`; }
        }
        o.e.style.borderColor = bc;
      });
      // the cascade ripple: a droplet runs down from Hero Shots to its view layers
      const rq = prog(lt, tRip, tVL[2] - tRip);
      drop.style.opacity = rq > 0 && rq < 1 ? 1 : 0;
      drop.style.top = (lerp(RY(1) + RH, RY(4) + RH / 2, ease.inOut(rq)) - 8) + 'px';
      flow.setAttribute('opacity', (ease.out(prog(lt, tRip, .4)) * .9).toFixed(3));
      pop(badge, lt, tBadge, .5, .6);

      /* rule card: frame, then five preset chips slide in */
      const ck = ease.expo(prog(lt, tCard, .7));
      const col = ease.inOut(prog(lt, tGrab + .02, .26));
      card.style.opacity = clamp(prog(lt, tCard, .4) * 2.5) * (1 - col);
      card.style.transform = `translate(${(1 - ck) * 70}px,${float(lt, 4, .8)}px) scale(${lerp(1, .12, col)})`;
      const glow = bump(lt, tDone + .1, .5);
      card.style.boxShadow = `0 40px 90px rgba(0,0,0,.5),0 0 ${50 * glow}px rgba(245,166,35,${.45 * glow})`;
      card.style.borderColor = glow > .01 ? `rgba(245,166,35,${.2 + .6 * glow})` : '';
      slotEls.forEach((e, k) => {
        const q = prog(lt, tSlot[k], .55), k2 = ease.expo(q);
        e.style.opacity = clamp(q * 2.5); e.style.transform = `translateX(${(1 - k2) * 120}px)`;
      });

      /* compact rule chip: appears as the card collapses, rides left of the cursor tip, drops on the row */
      const [cx, cy] = cursor.pos(Math.min(lt, tDrop));
      const mq = prog(lt, tGrab + .12, .2);
      mini.style.opacity = lt < tGrab + .12 ? 0 : clamp(mq * 3);
      const land = bump(lt, tDrop + .06, .25);
      mini.style.transform = `translate(${cx - 12 - miniW}px,${cy - 23}px) scale(${lerp(.6, 1, ease.back(mq)) + .08 * land})`;
      mini.style.boxShadow = `0 10px 30px rgba(0,0,0,.5),0 0 ${22 + 30 * land}px rgba(245,166,35,${.35 + .4 * land})`;

      /* headline */
      Hd.update(lt, tHead);
      cursor.update(lt);
    };
  },
});
