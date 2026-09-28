// Work fast: a travelling camera builds a triptych, one card per VO clause (six pie menus,
// bookmarks for any animatable property, viewport tool settings mirrored to every scene),
// then pulls back to all three and lands the one headline once everything has settled.
import { defineScene, el, ease, prog, clamp, lerp, keys } from '../engine.js';
import { icon, Cursor, keycaps, pop, fade, float, revealMasks, drawOn } from '../ui.js';

const CW = 540, CH = 600, CY = 320, GAP = 30, FY = CY + CH / 2;   // card geometry (rail coords)
const CX = k => 120 + k * (CW + GAP), CC = k => CX(k) + CW / 2;
const add = (p, html) => { const e = el(html); p.appendChild(e); return e; };
const propIcon = (s, c) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="2" style="display:block;flex:none;color:${c}"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3" fill="${c}" stroke="none"/></svg>`;
const FIELD = 'border-radius:6px;background:#23262e;border:1px solid rgba(255,255,255,.09);text-align:center;color:#eef1f6;overflow:hidden;white-space:nowrap';

function makeCard(rail, k, num, label, ic) {
  const c = add(rail, `<div class="abs" style="left:${CX(k)}px;top:${CY}px;width:${CW}px;height:${CH}px;border-radius:14px;transform-origin:50% 50%;
    background:linear-gradient(180deg,#16263a,#111119 58%);border:1px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.2);
    box-shadow:0 40px 90px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06)"></div>`);
  const inner = add(c, `<div class="abs" style="left:0;top:0;width:${CW}px;height:${CH}px">
    <div class="abs" style="left:30px;top:30px;display:flex;align-items:baseline;gap:14px;white-space:nowrap">
      <span class="mono" style="font-size:18px;letter-spacing:.2em;color:#f5a623">${num}</span>
      <span class="mono" style="font-size:21px;letter-spacing:.2em;color:#eef1f6">${label}</span></div>
    <div class="abs" style="right:26px;top:20px;width:46px;height:46px;border-radius:50%;border:1px solid rgba(245,166,35,.45);background:rgba(245,166,35,.1);display:flex;align-items:center;justify-content:center">${icon(ic, 24, '#f5a623')}</div>
    <div class="abs" style="left:30px;right:30px;top:84px;height:1px;background:rgba(255,255,255,.08)"></div></div>`);
  return { c, inner };
}

defineScene({
  id: 's17_fast',
  transitionIn: 'iris',
  camera: { zoom: .02 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .28, part: .6, glow: 1.1, ax: .5, ay: .42, bx: .86, by: .82 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const T = {
      press: L(0) - .2, kMove: L(0) - .12, bloom: L(0) + .06, hover: L(0) + 1.12, tag: L(0) + 1.1,
      pan1: L(1) - .52, rclick: L(1) + .2, bm: L(1) + 1.0,
      pan2: L(2) - .55, snap: L(2) + .4, prop: L(2) + 1.45,
    };
    T.land = T.bm + .6;
    T.pull = Math.min(L(2) + 2.65, ctx.dur - 2.55); T.head = T.pull + .8;

    // opaque backdrop while the iris opens, so nothing of the chapter card shows around the first card
    const veil = add(root, '<div class="abs" style="left:-40px;top:-40px;width:2000px;height:1160px;background:radial-gradient(ellipse at 50% 46%,#142032,#09090c 72%)"></div>');
    const rail = add(root, '<div class="abs" style="left:0;top:0;width:1920px;height:1080px;transform-origin:0 0"></div>');
    const cards = [makeCard(rail, 0, '01', 'PIE MENUS', 'pie'), makeCard(rail, 1, '02', 'BOOKMARKS', 'bookmark'), makeCard(rail, 2, '03', 'VIEWPORT SYNC', 'sync')];
    const [c1, c2, c3] = cards.map(c => c.inner);

    /* ---------- card 1: Ctrl+Shift+C opens the Navigation Pie ---------- */
    const PC = { x: 270, y: 334 };
    const burst = add(c1, `<div class="abs" style="left:${PC.x - 190}px;top:${PC.y - 190}px;width:380px;height:380px;border-radius:50%;opacity:0;
      background:radial-gradient(closest-side,rgba(245,166,35,.42),rgba(58,123,200,.14) 62%,transparent)"></div>`);
    const a0 = -.52, a1 = .52;
    const pie = add(c1, `<svg class="abs" width="${CW}" height="${CH}" style="left:0;top:0;overflow:visible">
      <circle class="ring" cx="${PC.x}" cy="${PC.y}" r="104" fill="none" stroke="rgba(120,170,230,.22)" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>
      <circle class="hub" cx="${PC.x}" cy="${PC.y}" r="26" fill="rgba(10,10,14,.85)" stroke="rgba(255,255,255,.16)" stroke-width="8"/>
      <path class="dir" d="M${PC.x + 26 * Math.cos(a0)} ${PC.y + 26 * Math.sin(a0)} A26 26 0 0 1 ${PC.x + 26 * Math.cos(a1)} ${PC.y + 26 * Math.sin(a1)}" fill="none" stroke="#6aa6ea" stroke-width="8" stroke-linecap="round"/></svg>`);
    const ring = pie.querySelector('.ring'), hub = pie.querySelector('.hub'), dir = pie.querySelector('.dir');
    [ring, hub].forEach(e => { e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; });
    // the eight slots of the Navigation Pie: [label, icon, dx, dy, align]
    const SLOTS = [['Rules', 'sliders', 0, -128, 'c'], ['Tags', 'tag', 46, -73, 'l'], ['Watchlist', 'eye', 62, 0, 'l'], ['Channels', 'list', 46, 73, 'l'],
      ['Slotted Mode', 'grid', 0, 128, 'c'], ['Batch Render', 'render', -46, 73, 'r'], ['Tree View', 'layers', -62, 0, 'r'], ['Variants', 'palette', -46, -73, 'r']];
    const btns = SLOTS.map(([label, ic, dx, dy, al]) => {
      const b = add(c1, `<div class="abs" style="left:0;top:0;height:40px;display:flex;align-items:center;gap:9px;padding:0 15px 0 12px;border-radius:8px;white-space:nowrap;
        background:#17181f;border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 24px rgba(0,0,0,.45);color:#aeb6c6">${icon(ic, 20, 'currentColor')}<span class="disp6" style="font-size:20px;color:#eef1f6">${label}</span></div>`);
      const w = b.offsetWidth, x = al === 'l' ? PC.x + dx : al === 'r' ? PC.x + dx - w : PC.x + dx - w / 2, y = PC.y + dy - 20;
      b.style.left = x + 'px'; b.style.top = y + 'px';
      return { b, x, dx: PC.x - (x + w / 2), dy: PC.y - (y + 20) };
    });
    // keycaps: centre stage first (what the iris opens on), then up above the pie before it blooms
    const kw = add(c1, '<div class="abs" style="left:0;top:0;transform-origin:0 0"></div>');
    const kUpd = keycaps(kw, ['Ctrl', 'Shift', 'C'], { x: 0, y: 0, t0: -.62, press: T.press, ctx });
    const kEl = kw.firstChild, KW = kEl.offsetWidth, KH = kEl.offsetHeight, KS = .62, kEnd = { x: PC.x, y: 130 };
    const tagWrap = add(c1, `<div class="abs" style="left:0;width:${CW}px;top:512px;display:flex;justify-content:center;opacity:0"></div>`);
    const tag = add(tagWrap, `<div class="chip" style="font-size:19px;letter-spacing:.08em;gap:14px;padding:8px 18px;border-color:rgba(245,166,35,.65);color:#f5a623;background:rgba(245,166,35,.1)">
      <span style="display:flex;gap:6px">${[0, 1, 2, 3, 4, 5].map(j => `<i style="display:block">${icon('pie', 20, j ? '#9aa3b5' : '#f5a623')}</i>`).join('')}</span>6 PIES × 8 SLOTS</div>`);
    const minis = [...tag.querySelectorAll('i')];

    /* ---------- card 2: right-click a property → Bookmark Property → a row in Channels ---------- */
    const pb = add(c2, '<div class="abs" style="left:24px;top:108px;width:492px;height:104px;border-radius:10px;background:rgba(8,8,12,.55);border:1px solid rgba(255,255,255,.07)"></div>');
    const prop = (y, name, inner) => {
      add(pb, `<div class="abs" style="left:0;width:152px;top:${y}px;height:34px;line-height:34px;text-align:right;font-size:19px;color:#9aa3b5">${name}</div>`);
      return add(pb, `<div class="abs mono" style="left:172px;top:${y}px;width:296px;height:34px;line-height:32px;font-size:18px;${FIELD}">${inner}</div>`);
    };
    prop(12, 'Roughness', '<div class="abs" style="left:0;top:0;bottom:0;width:35%;background:rgba(58,123,200,.55)"></div><span style="position:relative">0.35</span>');
    const powerFld = prop(58, 'Power', '1000 W');
    const menu = add(c2, `<div class="abs" style="left:188px;top:226px;width:284px;padding:6px;border-radius:9px;background:#191a21;border:1px solid rgba(255,255,255,.14);
      box-shadow:0 24px 50px rgba(0,0,0,.6);transform-origin:30% 0;visibility:hidden">
      <div style="height:36px;display:flex;align-items:center;gap:10px;padding:0 10px;font-size:18px;color:#c9d1de;white-space:nowrap">${icon('keyframe', 18, '#8790a3')}Insert Keyframe</div>
      <div style="height:1px;margin:4px 6px;background:rgba(255,255,255,.1)"></div>
      <div class="bmi" style="height:36px;display:flex;align-items:center;gap:10px;padding:0 10px;border-radius:6px;font-size:18px;color:#eef1f6;white-space:nowrap">${icon('bookmark', 18, '#f5a623')}Bookmark Property</div></div>`);
    const bmItem = menu.querySelector('.bmi');
    const cb = add(c2, `<div class="abs" style="left:24px;top:350px;width:492px;height:160px;border-radius:10px;background:rgba(8,8,12,.55);border:1px solid rgba(255,255,255,.07)">
      <div class="abs" style="left:14px;top:0;height:46px;display:flex;align-items:center;gap:10px">${icon('bookmark', 20, '#9aa3b5')}<span class="disp6" style="font-size:21px">Channels</span></div>
      <div class="abs" style="left:0;right:0;top:46px;height:1px;background:rgba(255,255,255,.07)"></div></div>`);
    const chRow = (slot, name, val, hot) => add(cb, `<div class="abs" style="left:10px;right:10px;top:${54 + slot * 50}px;height:44px;border-radius:7px;display:flex;align-items:center;gap:12px;padding:0 10px;border:1px solid transparent">
      ${icon('bookmark', 20, hot ? '#f5a623' : '#9aa3b5')}<span class="disp6" style="font-size:20px;white-space:nowrap">${name}</span>
      <div class="mono" style="margin-left:auto;width:132px;height:32px;line-height:30px;font-size:17px;${FIELD}">${val}</div></div>`);
    const oldRow = chRow(0, 'Focal Length', '50 mm');
    const newRow = chRow(0, 'Power', '1000 W', true);
    newRow.style.opacity = 0;
    // the path the bookmark travels: straight down from the Power field into the top Channels row;
    // it stays afterwards as a quiet link between the property and its bookmark
    const route = add(c2, `<svg class="abs" width="${CW}" height="${CH}" style="left:0;top:0;overflow:visible">
      <path class="lk" d="M344 206V402" fill="none" stroke="rgba(245,166,35,.55)" stroke-width="3" stroke-dasharray="4 9" stroke-linecap="round"/>
      <path class="rt" d="M344 206V402" fill="none" stroke="#f5a623" stroke-width="3" stroke-linecap="round"/>
      <circle class="nd" cx="344" cy="206" r="6" fill="#f5a623"/></svg>`);
    const rt = route.querySelector('.rt'), lk = route.querySelector('.lk'), nd = route.querySelector('.nd'), RL = rt.getTotalLength();
    const spark = add(c2, '<div class="abs" style="left:0;top:0;width:22px;height:22px;border-radius:50%;background:#fff3d6;box-shadow:0 0 18px 8px rgba(245,166,35,.85);opacity:0"></div>');

    /* ---------- card 3: Viewport Sync mirrors tool settings to every scene ---------- */
    const RY3 = k => 112 + k * 142, RC3 = k => RY3(k) + 60;
    const trunk = add(c3, `<svg class="abs" width="${CW}" height="${CH}" style="left:0;top:0;overflow:visible">
      <defs><linearGradient id="s17sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f5a623"/><stop offset="1" stop-color="#2fc4b2"/></linearGradient></defs>
      <path d="M38 ${RC3(0)}V${RC3(2)}" stroke="rgba(255,255,255,.1)" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path class="flow" d="M38 ${RC3(0)}V${RC3(2)}" stroke="url(#s17sg)" stroke-width="4" stroke-dasharray="3 11" fill="none" stroke-linecap="round"/>
      <path d="M38 ${RC3(0)}H66" stroke="#f5a623" stroke-width="4" stroke-linecap="round"/>
      ${[1, 2].map(k => `<path class="st${k}" d="M38 ${RC3(k)}H62M55 ${RC3(k) - 7}l8 7-8 7" stroke="rgba(255,255,255,.3)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
      <circle cx="38" cy="${RC3(0)}" r="8" fill="#f5a623"/></svg>`);
    const flow = trunk.querySelector('.flow'), stubs = [null, trunk.querySelector('.st1'), trunk.querySelector('.st2')];
    const pulse = add(c3, '<div class="abs" style="left:26px;top:0;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 0 18px 8px rgba(47,196,178,.85);opacity:0"></div>');
    const tgl = (inner, set) => `<div style="width:50px;height:46px;border-radius:8px;display:flex;align-items:center;justify-content:center;
      border:1px solid ${set ? 'rgba(58,123,200,.7)' : 'rgba(255,255,255,.12)'};background:${set ? 'rgba(58,123,200,.2)' : 'rgba(255,255,255,.05)'};color:${set ? '#9cc3f0' : '#8790a3'}">${inner}</div>`;
    const rows3 = ['Kitchen', 'Studio', 'Outdoor'].map((name, k) => {
      const r = add(c3, `<div class="abs" style="left:70px;top:${RY3(k)}px;width:446px;height:120px;border-radius:10px;background:rgba(8,8,12,.55);border:1px solid rgba(255,255,255,.08)">
        <div class="abs" style="left:20px;top:22px;display:flex;align-items:center;gap:10px">${icon('cube', 24, '#c9d1de')}<span class="disp6" style="font-size:26px">${name}</span></div>
        ${k === 0 ? '<div class="abs mono" style="left:20px;top:70px;font-size:17px;letter-spacing:.14em;color:#f5a623;padding:3px 9px;border:1px solid rgba(245,166,35,.5);border-radius:4px">ACTIVE</div>'
          : `<div class="abs mono syn" style="left:20px;top:73px;font-size:17px;letter-spacing:.14em;color:#2fc4b2;display:flex;align-items:center;gap:7px;opacity:0">${icon('sync', 18, '#2fc4b2')}SYNCED</div>`}
        <div class="abs tb" style="right:18px;top:37px;display:flex;gap:8px">${tgl(icon('magnet', 24, 'currentColor'))}${tgl(icon('target', 24, 'currentColor'), true)}${tgl(propIcon(24, 'currentColor'))}</div></div>`);
      const t = r.querySelectorAll('.tb>div');
      return { r, snap: t[0], pe: t[2], syn: r.querySelector('.syn') };
    });

    /* ---------- the one headline, landing after the pull-back ---------- */
    const head = add(root, `<div class="abs disp" style="left:0;width:1920px;top:148px;text-align:center;font-size:112px;white-space:nowrap">
      <span class="mask"><span>WORK</span></span> <span class="mask"><span class="grad">FAST.</span></span></div>`);

    /* ---------- cursor: lives on the rail so it travels with the camera; never rests on a word ---------- */
    const P = (k, x, y) => [CX(k) + x, CY + y];
    const [pcx, pcy] = P(0, PC.x, PC.y), [pwx, pwy] = P(1, 452, 176), [bmx, bmy] = P(1, 446, 290);
    const [snx, sny] = P(2, 70 + 446 - 18 - 150 - 16 + 25, RC3(0) + 4), [prx, pry] = P(2, 70 + 446 - 18 - 25, RC3(0) + 4);
    const hvx = pcx + 34;
    const cursor = new Cursor(rail, ctx, [
      { t: T.bloom + .45, x: pcx + 4, y: pcy + 2 }, { t: L(0) + .86, x: pcx + 4, y: pcy + 2 }, { t: T.hover - .02, x: hvx, y: pcy - 2 },
      { t: T.pan1 + .1, x: hvx, y: pcy - 2 }, { t: T.rclick - .06, x: pwx, y: pwy }, { t: T.rclick, x: pwx, y: pwy, click: true },
      { t: T.rclick + .3, x: pwx, y: pwy }, { t: T.bm - .14, x: bmx, y: bmy }, { t: T.bm, x: bmx, y: bmy, click: true },
      { t: T.bm + .35, x: CX(1) + 130, y: CY + 300 }, { t: T.pan2 + .15, x: CX(1) + 130, y: CY + 300 },
      { t: T.snap - .06, x: snx, y: sny }, { t: T.snap, x: snx, y: sny, click: true }, { t: T.snap + .45, x: snx, y: sny },
      { t: T.prop - .06, x: prx, y: pry }, { t: T.prop, x: prx, y: pry, click: true }, { t: T.prop + 1.1, x: prx + 60, y: pry + 520 }], { hideAt: T.prop + .6 });

    /* ---------- sound ---------- */
    ctx.cue(T.bloom - .04, 'whoosh', { gain: .75 });
    ctx.cue(T.bloom + .22, 'sparkle', { gain: .4 });
    ctx.cue(T.hover, 'tick', { gain: .5, pan: .2 });
    ctx.cue(T.tag, 'pop', { gain: .7, pitch: 2 });
    ctx.cue(T.pan1, 'swish', { gain: .55, pan: .3 });
    ctx.cue(T.rclick + .04, 'pop', { gain: .45, pitch: -3 });
    ctx.cue(T.bm + .1, 'swish', { gain: .35, pan: .2 });
    ctx.cue(T.land, 'pop', { gain: .7, pitch: 4 });
    ctx.cue(T.land + .08, 'sparkle', { gain: .3 });
    ctx.cue(T.pan2, 'swish', { gain: .55, pan: .3 });
    [[T.snap, 0], [T.prop, 2]].forEach(([t, p]) => { ctx.cue(t + .25, 'blip', { gain: .6, pitch: p, pan: .3 }); ctx.cue(t + .5, 'blip', { gain: .6, pitch: p + 4, pan: .45 }); });
    ctx.cue(T.pull, 'whoosh', { gain: .45 });
    ctx.cue(T.head + .05, 'hit', { gain: .5 });

    const toggle = (e, lt, tOn) => {
      const on = lt >= tOn, g = on ? Math.exp(-(lt - tOn) * 5) : 0;
      e.style.background = on ? '#e87d0d' : 'rgba(255,255,255,.05)';
      e.style.borderColor = on ? '#f5a623' : 'rgba(255,255,255,.12)';
      e.style.color = on ? '#ffffff' : '#8790a3';
      e.style.boxShadow = on ? `0 0 ${12 + g * 30}px rgba(245,166,35,${.35 + g * .55})` : 'none';
      e.style.transform = `scale(${1 + g * .2})`;
    };

    return lt => {
      veil.style.opacity = 1 - ease.inOut(prog(lt, .3, .6));
      /* camera rail: focus card 1 → 2 → 3, then pull back to the triptych */
      const fx = keys(lt, [[T.pan1, CC(0)], [T.pan1 + .55, CC(1)], [T.pan2, CC(1)], [T.pan2 + .55, CC(2)], [T.pull, CC(2)], [T.pull + .75, 960]]);
      const Z = keys(lt, [[-.5, 1.4], [1.6, 1.3, 'out'], [T.pull, 1.3], [T.pull + .75, 1]]);
      const sy = keys(lt, [[T.pull, 545], [T.pull + .75, FY]]);
      rail.style.transform = `translate(${960 - fx * Z}px,${sy - FY * Z}px) scale(${Z})`;
      const ov = ease.inOut(prog(lt, T.pull, .75));
      cards.forEach(({ c, inner }, k) => {
        const w = clamp(1 - Math.abs(fx - CC(k)) / 570), f = Math.max(w, ov), side = CC(k) < fx ? 1 : -1;
        const fy = float(lt, 4 * ov, 1.1, k * 1.7);
        c.style.opacity = lerp(.32, 1, f);
        inner.style.opacity = clamp((f - .45) / .5);
        c.style.transform = f > .999 ? `translateY(${fy}px)` : `perspective(1500px) translateY(${fy}px) rotateY(${(1 - f) * 22 * side}deg) scale(${lerp(.9, 1, f)})`;
      });

      /* card 1 */
      kUpd(lt);
      const km = ease.expo(prog(lt, T.kMove, .55)), ks = lerp(1, KS, km);
      kw.style.transform = `translate(${lerp(PC.x, kEnd.x, km) - KW * ks / 2}px,${lerp(PC.y, kEnd.y, km) - KH * ks / 2}px) scale(${ks})`;
      const bq = prog(lt, T.bloom, .7);
      burst.style.opacity = Math.sin(Math.PI * bq) * .95; burst.style.transform = `scale(${.45 + bq * .9})`;
      hub.style.transform = `scale(${ease.back(prog(lt, T.bloom, .45))})`;
      ring.style.opacity = ease.out(prog(lt, T.bloom + .1, .5));
      ring.style.transform = `scale(${lerp(.55, 1, ease.expo(prog(lt, T.bloom, .9)))})`;
      const hW = clamp((lt - T.hover) / .12) * (1 - clamp((lt - T.pan1 - .05) / .3));
      btns.forEach(({ b, dx, dy }, i) => {
        const q = prog(lt, T.bloom + .05 + i * .035, .5), k = ease.back(q), h = i === 2 ? hW : 0;
        b.style.opacity = clamp(q * 4);
        b.style.transform = `translate(${dx * (1 - k)}px,${dy * (1 - k)}px) scale(${lerp(.35, 1, k)})`;
        if (i === 2) {
          b.style.background = h > .01 ? `rgba(58,123,200,${.3 + h * .6})` : '#17181f';
          b.style.borderColor = h > .01 ? `rgba(150,195,245,${.3 + h * .5})` : 'rgba(255,255,255,.14)';
          b.style.boxShadow = `0 10px 24px rgba(0,0,0,.45),0 0 ${h * 28}px rgba(58,123,200,${h * .85})`;
          b.style.color = h > .5 ? '#ffffff' : '#aeb6c6';
        }
      });
      const [cx, cy] = cursor.pos(lt), ddx = cx - pcx, ddy = cy - pcy;
      dir.setAttribute('transform', `rotate(${Math.atan2(ddy, ddx) * 180 / Math.PI} ${PC.x} ${PC.y})`);
      dir.style.opacity = clamp((Math.hypot(ddx, ddy) - 8) / 20) * (1 - clamp((lt - T.pan1) / .3)) * clamp(prog(lt, T.bloom, .3));
      pop(tagWrap, lt, T.tag, .5, .7, 14);
      minis.forEach((m, j) => pop(m, lt, T.tag + .12 + j * .06, .4, .2));

      /* card 2 */
      const mq = prog(lt, T.rclick + .03, .22), mOut = prog(lt, T.bm + .06, .14);
      menu.style.visibility = mq > 0 && mOut < 1 ? 'visible' : 'hidden';
      menu.style.opacity = clamp(mq * 3) * (1 - mOut);
      menu.style.transform = `translateY(${(1 - ease.out(mq)) * -10}px) scale(${lerp(.9, 1, ease.out(mq))})`;
      const bmH = clamp((lt - (T.bm - .2)) / .1);
      bmItem.style.background = `rgba(245,166,35,${bmH * .24})`; bmItem.style.color = bmH > .5 ? '#f5a623' : '#eef1f6';
      const src = clamp((lt - T.rclick) / .1) * (1 - clamp((lt - T.land) / .3));
      powerFld.style.borderColor = `rgba(245,166,35,${.09 + src * .8})`; powerFld.style.boxShadow = `0 0 ${src * 16}px rgba(245,166,35,.45)`;
      const gq = ease.inOut(prog(lt, T.bm + .08, T.land - T.bm - .08));
      rt.style.strokeDasharray = RL; rt.style.strokeDashoffset = RL * (1 - gq);
      const settle = ease.out(prog(lt, T.land + .1, .6));
      rt.style.opacity = 1 - settle; lk.style.opacity = settle; lk.style.strokeDashoffset = -lt * 26;
      nd.style.opacity = clamp(gq * 8);
      spark.style.transform = `translate(${344 - 11}px,${lerp(206, 402, gq) - 11}px)`;
      spark.style.opacity = gq > 0 && gq < 1 ? 1 : 0;
      oldRow.style.top = (54 + ease.inOut(prog(lt, T.land - .15, .35)) * 50) + 'px';
      pop(newRow, lt, T.land, .45, .8);
      const ng = lt >= T.land ? Math.exp(-(lt - T.land) * 2.2) : 0;
      newRow.style.background = `rgba(245,166,35,${.05 + ng * .16})`; newRow.style.borderColor = `rgba(245,166,35,${.2 + ng * .6})`;

      /* card 3 */
      flow.style.strokeDashoffset = -lt * 40;
      rows3.forEach(({ r, snap, pe, syn }, k) => {
        toggle(snap, lt, T.snap + k * .25); toggle(pe, lt, T.prop + k * .25);
        const g = Math.max(...[T.snap, T.prop].map(t => lt >= t + k * .25 ? Math.exp(-(lt - t - k * .25) * 4) : 0));
        r.style.borderColor = `rgba(${k ? '47,196,178' : '245,166,35'},${.08 + g * .7})`;
        if (syn) fade(syn, lt, T.snap + k * .25, .3);
        if (stubs[k]) stubs[k].style.stroke = lt >= T.snap + k * .25 ? `rgba(47,196,178,${.55 + g * .45})` : 'rgba(255,255,255,.3)';
      });
      let pq = -1;
      for (const t of [T.snap, T.prop]) if (lt >= t && lt < t + .52) pq = (lt - t) / .52;
      if (lt >= T.head + .6) { const u = ((lt - T.head - .6) % 1.7) / .6; if (u < 1) pq = u; }
      pulse.style.opacity = pq >= 0 ? Math.sin(Math.PI * clamp(pq)) * .6 + .4 : 0;
      pulse.style.top = (lerp(RC3(0), RC3(2), ease.inOut(clamp(pq))) - 12) + 'px';

      /* headline lands once the triptych has settled */
      revealMasks(head, lt, T.head, .09, .8);
      head.style.opacity = lt >= T.head ? 1 : 0;

      cursor.update(lt);
    };
  },
});
