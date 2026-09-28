// Tags & Rules: colour tags fly into the Takes Tree; an OUTPUT rule assembles from five preset
// chips; every tier offers a rule slot, one click on the View Layer Group "Hero Shots" applies it,
// and the three view layers inside pick up every preset through the cascade. One short headline
// lands only after the motion has settled. All timing is relative to the VO (ctx.line / lineEnd).
import { defineScene, el, ease, prog, clamp, lerp, rgba } from '../engine.js';
import { icon, headline, panel, Cursor, pop, fade, float } from '../ui.js';

const CUSTOM = {
  output: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M7 9h3M7 9v3M17 15h-3M17 15v-3"/>',
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
  { label: 'Studio', ic: 'cube', d: 0 },
  { label: 'Hero Shots', ic: 'layers', d: 1, target: true },
  { label: 'Front 3/4', ic: 'layer', d: 2, vl: true },
  { label: 'Top Down', ic: 'layer', d: 2, vl: true },
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
const RSW = 96, RSH = 44;                                     // rule slot on each tier row

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
    const tRS = L(1) + 1.9;                                   // every tier shows a rule slot
    const tClick = L(1) + 2.75;                               // one click on Hero Shots
    const tLand = tClick + .7;                                // the rule lands in the row
    const tRip = tLand + .12, tVL = [0, 1, 2].map(j => tRip + .12 + j * .16);
    const tBadge = tRip + .75;
    const tHead = Math.max(ctx.lineEnd(1) + .05, tBadge + .45);

    /* ---------- sound ---------- */
    ctx.cue(.42, 'shimmer', { gain: .35, pan: .5 });
    tTag.forEach((t, i) => ctx.cue(t + FLY * .8, 'pop', { gain: .75, pitch: i * 2, pan: -.2 }));
    ctx.cue(tCard, 'whoosh', { gain: .45, pan: .5 });
    [0, 2, 4].forEach((k, j) => ctx.cue(tSlot[k] + .1, 'tick', { gain: .6, pitch: j * 3, pan: .5 }));
    ctx.cue(tDone, 'shimmer', { gain: .5, pan: .5 });
    ctx.cue(tRS + .1, 'blip', { gain: .5, pitch: 5, pan: -.3 });
    ctx.cue(tClick + .08, 'swish', { gain: .55, pan: .2 });
    ctx.cue(tLand, 'thud', { gain: .8, pan: -.3 });
    [0, 2].forEach(j => ctx.cue(tVL[j], 'tick', { gain: .6, pitch: 4 + j * 3, pan: -.35 }));
    ctx.cue(tBadge, 'success', { gain: .6, pan: -.3 });
    ctx.cue(tHead, 'swish', { gain: .35, pan: .4 });

    /* ---------- Takes Tree panel ---------- */
    const P = panel(root, { x: PX, y: PY, w: PW, h: PH, title: 'Takes Tree', icon: 'layers' });
    const gx = 16 + 1 * 38 + 13;                                // cascade path under the Hero Shots icon
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
          <div class="dots abs" style="right:20px;top:${RH / 2 - 8}px;display:flex;gap:8px">${SLOTS.map(() => '<i style="display:block;width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.18)"></i>').join('')}</div>` : ''}</div>`);
      P.body.appendChild(e);
      return { e, dots: r.vl ? [...e.querySelectorAll('.dots i')] : [], bolt: e.querySelector('.bolt'), r };
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
    tagEls.forEach((o, i) => {
      const sameRow = i > 0 && TAGS[i - 1].row === o.g.row;
      o.sx = sameRow ? tagEls[i - 1].sx + tagEls[i - 1].w + 12 : TAGX;           // slot in the row
      o.px = sameRow ? tagEls[i - 1].px + tagEls[i - 1].w * PAL + 26 : 1200;     // waiting position (right side)
      o.y = rowMid(o.g.row) - 20;
    });

    /* ---------- rule slots: any tier can take a rule (icon-only, placed in each row's free space) ---------- */
    const rowEnd = [0, 1, 2, 3, 4].map(i => { let x = TAGX; tagEls.forEach(o => { if (o.g.row === i) x = Math.max(x, o.sx + o.w + 16); }); return x; });
    const rslots = ROWS.map((r, i) => {
      const x = r.target ? TAGX : rowEnd[i];
      const e = el(`<div class="abs" style="left:${x}px;top:${rowMid(i) - RSH / 2}px;width:${RSW}px;height:${RSH}px;border-radius:12px;border:2px dashed rgba(245,166,35,.75);background:rgba(245,166,35,.07);
        display:flex;align-items:center;justify-content:center;gap:6px;opacity:0">${icon('bolt', 20, '#f5a623', 2)}${icon('plus', 18, '#f5a623', 2.4)}</div>`);
      root.appendChild(e); return { e, x, i, target: r.target };
    });
    const hero = rslots.find(s => s.target);

    /* ---------- rule card ---------- */
    const card = el(`<div class="glass abs" style="left:${CX}px;top:${CY}px;width:${CWD}px;height:${CHT}px;border-radius:14px;transform-origin:220px 52px;opacity:0">
      <div class="abs" style="left:28px;top:24px;width:56px;height:56px;border-radius:12px;background:rgba(245,166,35,.18);border:1.5px solid #f5a623;display:flex;align-items:center;justify-content:center">${icon('bolt', 30, '#f5a623', 2)}</div>
      <div class="abs disp6" style="left:102px;top:18px;font-size:34px;color:#fff;white-space:nowrap">FullHD_Cycles</div>
      <div class="abs mono" style="left:104px;top:62px;font-size:16px;letter-spacing:.2em;color:#f5a623;white-space:nowrap">OUTPUT RULE</div>
      <div class="abs" style="left:24px;right:24px;top:104px;height:1px;background:rgba(255,255,255,.08)"></div></div>`);
    root.appendChild(card);
    const slotEls = SLOTS.map((s, k) => {
      const e = el(`<div class="abs" style="left:28px;right:28px;top:${124 + k * 82}px;height:66px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:18px;padding:0 22px;opacity:0">
        ${ico(s.ic, 30, s.c, 2)}<span class="disp6" style="font-size:28px;color:#eef1f6;white-space:nowrap">${s.v}</span>
        <i style="margin-left:auto;display:block;width:16px;height:16px;border-radius:50%;background:${s.c};box-shadow:0 0 12px ${rgba(s.c, .7)}"></i></div>`);
      card.appendChild(e); return e;
    });
    // compact rule chip: the card collapses into it; it flies to the clicked tier along the row's empty lane
    const mini = el(`<div class="abs" style="left:0;top:0;height:46px;display:flex;align-items:center;gap:10px;padding:0 18px 0 12px;border-radius:12px;background:rgba(245,166,35,.2);border:1.5px solid #f5a623;
      box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 22px rgba(245,166,35,.35);white-space:nowrap;opacity:0">${icon('bolt', 22, '#f5a623', 2)}<span class="disp6" style="font-size:22px;color:#fff">FullHD_Cycles</span></div>`);
    root.appendChild(mini);
    const miniW = mini.offsetWidth, rowY = rowMid(1);
    const tEmit = tClick + .2;                                  // chip appears once the card has collapsed
    const route = [[tEmit, CX + 250, CY + 52], [tEmit + .24, 1010, rowY], [tLand, TAGX + miniW / 2, rowY]];
    const miniPos = lt => {
      if (lt <= route[0][0]) return route[0].slice(1);
      for (let k = 1; k < route.length; k++) if (lt <= route[k][0]) {
        const [t0, x0, y0] = route[k - 1], [t1, x1, y1] = route[k], e = k === 1 ? ease.in(prog(lt, t0, t1 - t0)) : ease.out(prog(lt, t0, t1 - t0));
        return [lerp(x0, x1, e), lerp(y0, y1, e)];
      }
      return route[route.length - 1].slice(1);
    };

    /* ---------- headline: lands only after everything has settled ---------- */
    const Hd = headline(root, { x: 1010, y: 380, w: 800, kicker: 'Tags & Rules', size: 100, lines: ['ONE CLICK.', { t: 'WHOLE SETUP.', grad: true }] });

    /* ---------- cursor: comes up the gap between tree and card, along the empty Hero Shots lane ---------- */
    const clickPt = [hero.x + RSW / 2 - 4, rowY + 2];
    const cursor = new Cursor(root, ctx, [
      { t: tClick - 1.15, x: 1250, y: 935 },
      { t: tClick - .78, x: 985, y: 905 },
      { t: tClick - .42, x: 985, y: rowY + 2 },
      { t: tClick, x: clickPt[0], y: clickPt[1], click: true },
    ], { hideAt: tClick + .1 });

    return lt => {
      /* panel */
      const pk = ease.expo(prog(lt, -.45, .9));
      P.el.style.opacity = clamp((lt + .5) / .3);
      P.el.style.transform = `translateX(${(1 - pk) * -60}px)`;
      flow.style.strokeDashoffset = -lt * 50;

      /* tags */
      tagEls.forEach((o, i) => {
        const t0 = tTag[i], q = prog(lt, t0, FLY), e = ease.out4(q);
        const tIn = Math.min(.4 + i * .06, t0 - .3), inP = ease.back(prog(lt, tIn, .45));
        const x = lerp(o.px, o.sx, e), s = lerp(PAL, 1, e) + .1 * bump(lt, t0 + FLY + .05, .22);
        const fl = q <= 0 ? float(lt, 5, 1.4, i * 1.3) : 0;
        o.e.style.opacity = clamp((lt - tIn) / .2);
        o.e.style.transform = `translate(${x}px,${o.y + fl}px) scale(${q <= 0 ? PAL * lerp(.6, 1, inP) : s})`;
        o.e.style.boxShadow = `0 0 ${16 + 26 * bump(lt, t0 + FLY, .4)}px ${rgba(o.g.c, .28 + .4 * bump(lt, t0 + FLY, .4))}`;
      });

      /* rule slots on every tier; the clicked one takes the rule, the others fade */
      rslots.forEach((s, k) => {
        const q = prog(lt, tRS + k * .06, .4);
        const out = s.target ? prog(lt, tLand - .05, .1) : prog(lt, tClick + .1, .35);
        const hot = s.target ? bump(lt, tClick + .02, .3) : 0;
        s.e.style.opacity = clamp(q * 3) * (1 - out);
        s.e.style.transform = `scale(${lerp(.6, 1, ease.back(q)) + .12 * hot})`;
        s.e.style.boxShadow = hot > .01 ? `0 0 ${26 * hot}px rgba(245,166,35,${.7 * hot})` : 'none';
      });

      /* rows: tag flash, target glow, cascade to the view layers */
      rows.forEach((o, i) => {
        let fl = 0; TAGS.forEach((g, k) => { if (g.row === i) fl = Math.max(fl, bump(lt, tTag[k] + FLY + .05, .35)); });
        const own = TAGS.map((g, k) => g.row === i && lt >= tTag[k] + FLY ? g.c : null).filter(Boolean).pop();
        let bc = fl > .01 && own ? rgba(own, .3 + .6 * fl) : 'rgba(255,255,255,.06)';
        if (o.r.target) {
          const on = lt >= tLand, g = bump(lt, tLand + .1, .5);
          if (on) bc = `rgba(245,166,35,${.5 + .5 * g})`;
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
      const rq = prog(lt, tRip, tVL[2] - tRip);
      drop.style.opacity = rq > 0 && rq < 1 ? 1 : 0;
      drop.style.top = (lerp(RY(1) + RH, RY(4) + RH / 2, ease.inOut(rq)) - 8) + 'px';
      flow.setAttribute('opacity', (ease.out(prog(lt, tRip, .4)) * .9).toFixed(3));
      pop(badge, lt, tBadge, .5, .6);

      /* rule card: frame, five preset chips slide in, then it collapses into the rule chip on the click */
      const ck = ease.expo(prog(lt, tCard, .7));
      const col = ease.out(prog(lt, tClick + .02, .18));
      card.style.opacity = clamp(prog(lt, tCard, .4) * 2.5) * (1 - col);
      card.style.transform = `translate(${(1 - ck) * 70}px,${float(lt, 4, .8)}px) scale(${lerp(1, .12, col)})`;
      const glow = bump(lt, tDone + .1, .5);
      card.style.boxShadow = `0 40px 90px rgba(0,0,0,.5),0 0 ${50 * glow}px rgba(245,166,35,${.45 * glow})`;
      card.style.borderColor = glow > .01 ? `rgba(245,166,35,${.2 + .6 * glow})` : '';
      slotEls.forEach((e, k) => {
        const q = prog(lt, tSlot[k], .55), k2 = ease.expo(q);
        e.style.opacity = clamp(q * 2.5); e.style.transform = `translateX(${(1 - k2) * 120}px)`;
      });
      const [mx, my] = miniPos(lt), mq = prog(lt, tEmit, .2), land = bump(lt, tLand + .05, .25);
      mini.style.opacity = lt < tEmit ? 0 : clamp(mq * 3);
      mini.style.transform = `translate(${mx - miniW / 2}px,${my - 23}px) scale(${lerp(.6, 1, ease.back(mq)) + .08 * land})`;
      mini.style.boxShadow = `0 10px 30px rgba(0,0,0,.5),0 0 ${22 + 30 * land}px rgba(245,166,35,${.35 + .4 * land})`;

      /* headline */
      Hd.update(lt, tHead);
      cursor.update(lt);
    };
  },
});
