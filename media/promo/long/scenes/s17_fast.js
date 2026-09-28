// Work fast: a travelling camera builds a triptych, one card per VO clause (six pie menus,
// bookmarks for any animatable property, viewport tool settings mirrored to every scene),
// then pulls back to show all three side by side.
import { defineScene, el, ease, prog, clamp, lerp, keys } from '../engine.js';
import { icon, Cursor, keycaps, pop, fade, float } from '../ui.js';

const CW = 540, CH = 720, CY = 190, GAP = 30, MIDY = 545;        // card geometry (rail coords)
const CX = k => 120 + k * (CW + GAP), CC = k => CX(k) + CW / 2;
const add = (p, html) => { const e = el(html); p.appendChild(e); return e; };
const propIcon = (s, c) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="2" style="display:block;flex:none;color:${c}"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3" fill="${c}" stroke="none"/></svg>`;
const FIELD = 'border-radius:6px;background:#23262e;border:1px solid rgba(255,255,255,.09);text-align:center;color:#eef1f6;overflow:hidden;white-space:nowrap';

function makeCard(rail, k, num, title, ic) {
  return add(rail, `<div class="abs" style="left:${CX(k)}px;top:${CY}px;width:${CW}px;height:${CH}px;border-radius:14px;transform-origin:50% 50%;
    background:linear-gradient(180deg,rgba(38,87,135,.34),rgba(15,15,21,.84) 52%);border:1px solid rgba(255,255,255,.09);border-top-color:rgba(255,255,255,.18);
    box-shadow:0 40px 90px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06)">
    <div class="abs mono" style="left:32px;top:32px;font-size:18px;letter-spacing:.22em;color:#f5a623">${num}</div>
    <div class="abs disp" style="left:30px;top:58px;font-size:46px;white-space:nowrap">${title}</div>
    <div class="abs" style="right:28px;top:40px;width:52px;height:52px;border-radius:50%;border:1px solid rgba(245,166,35,.45);background:rgba(245,166,35,.1);display:flex;align-items:center;justify-content:center">${icon(ic, 26, '#f5a623')}</div>
    <div class="abs" style="left:30px;right:30px;top:124px;height:1px;background:rgba(255,255,255,.08)"></div></div>`);
}

defineScene({
  id: 's17_fast',
  transitionIn: 'iris',
  camera: { zoom: .02 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .28, part: 1, glow: 1.1, ax: .5, ay: .42, bx: .86, by: .82 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const T = {
      press: L(0) - .18, kMove: L(0) - .06, bloom: L(0), hover: L(0) + 1.12, tag: L(0) + 1.1, cap: L(0) + 1.55,
      pan1: L(1) - .52, rclick: L(1) + .17, bm: L(1) + .95,
      pan2: L(2) - .55, snap: L(2) + .4, prop: L(2) + 1.45, pull: L(2) + 2.65,
    };
    T.land = T.bm + .55; T.drag = T.land + .38;

    const rail = add(root, '<div class="abs" style="left:0;top:0;width:1920px;height:1080px;transform-origin:0 0"></div>');
    const cards = [makeCard(rail, 0, '01', 'PIE MENUS', 'pie'), makeCard(rail, 1, '02', 'BOOKMARKS', 'bookmark'), makeCard(rail, 2, '03', 'VIEWPORT SYNC', 'sync')];
    const [c1, c2, c3] = cards;

    /* ---------- card 1: the Navigation Pie ---------- */
    const PC = { x: 270, y: 412 };
    const burst = add(c1, `<div class="abs" style="left:${PC.x - 190}px;top:${PC.y - 190}px;width:380px;height:380px;border-radius:50%;opacity:0;
      background:radial-gradient(closest-side,rgba(245,166,35,.42),rgba(58,123,200,.14) 62%,transparent)"></div>`);
    const a0 = -.52, a1 = .52;
    const pie = add(c1, `<svg class="abs" width="${CW}" height="${CH}" style="left:0;top:0;overflow:visible">
      <circle class="ring" cx="${PC.x}" cy="${PC.y}" r="104" fill="none" stroke="rgba(120,170,230,.28)" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>
      <circle class="hub" cx="${PC.x}" cy="${PC.y}" r="26" fill="rgba(10,10,14,.8)" stroke="rgba(255,255,255,.16)" stroke-width="8"/>
      <path class="dir" d="M${PC.x + 26 * Math.cos(a0)} ${PC.y + 26 * Math.sin(a0)} A26 26 0 0 1 ${PC.x + 26 * Math.cos(a1)} ${PC.y + 26 * Math.sin(a1)}" fill="none" stroke="#6aa6ea" stroke-width="8" stroke-linecap="round"/></svg>`);
    const ring = pie.querySelector('.ring'), hub = pie.querySelector('.hub'), dir = pie.querySelector('.dir');
    [ring, hub].forEach(e => { e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; });

    // eight slots of the Navigation Pie: [label, icon, dx, dy, align]
    const SLOTS = [['Rules', 'sliders', 0, -126, 'c'], ['Tags', 'tag', 46, -72, 'l'], ['Watchlist', 'eye', 60, 0, 'l'], ['Channels', 'list', 46, 72, 'l'],
      ['Slotted Mode', 'grid', 0, 126, 'c'], ['Batch Render', 'render', -46, 72, 'r'], ['Tree View', 'layers', -60, 0, 'r'], ['Variants', 'palette', -46, -72, 'r']];
    const btns = SLOTS.map(([label, ic, dx, dy, al]) => {
      const b = add(c1, `<div class="abs" style="left:0;top:0;height:40px;display:flex;align-items:center;gap:9px;padding:0 15px 0 12px;border-radius:8px;white-space:nowrap;
        background:rgba(22,23,30,.95);border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 24px rgba(0,0,0,.45);color:#aeb6c6">${icon(ic, 20, 'currentColor')}<span class="disp6" style="font-size:20px;color:#eef1f6">${label}</span></div>`);
      const w = b.offsetWidth, x = al === 'l' ? PC.x + dx : al === 'r' ? PC.x + dx - w : PC.x + dx - w / 2, y = PC.y + dy - 20;
      b.style.left = x + 'px'; b.style.top = y + 'px';
      return { b, dx: PC.x - (x + w / 2), dy: PC.y - (y + 20) };
    });

    // keycaps: centre stage first (visible through the iris), then up into the label row
    const klabel = add(c1, '<div class="abs mono" style="left:0;top:0;font-size:16px;letter-spacing:.16em;color:#9aa3b5;white-space:nowrap;opacity:0">NAVIGATION PIE</div>');
    const kw = add(c1, '<div class="abs" style="left:0;top:0;transform-origin:0 0"></div>');
    const kUpd = keycaps(kw, ['Ctrl', 'Shift', 'C'], { x: 0, y: 0, t0: -.62, press: T.press, ctx });
    const kEl = kw.firstChild, KW = kEl.offsetWidth, KH = kEl.offsetHeight, KS = .58;
    const lw = klabel.offsetWidth, rx = (CW - (lw + 18 + KW * KS)) / 2;
    klabel.style.left = rx + 'px'; klabel.style.top = (170 - 11) + 'px';
    const kEnd = { x: rx + lw + 18 + KW * KS / 2, y: 170 };

    const tagWrap = add(c1, `<div class="abs" style="left:0;width:${CW}px;top:594px;display:flex;justify-content:center;opacity:0"></div>`);
    const tag = add(tagWrap, `<div class="chip" style="font-size:19px;letter-spacing:.06em;gap:14px;padding:8px 18px;border-color:rgba(245,166,35,.65);color:#f5a623;background:rgba(245,166,35,.1)">
      <span style="display:flex;gap:6px">${[0, 1, 2, 3, 4, 5].map(j => `<i style="display:block">${icon('pie', 20, j ? '#9aa3b5' : '#f5a623')}</i>`).join('')}</span>6 PIES · 8 SLOTS EACH</div>`);
    const minis = [...tag.querySelectorAll('i')];
    const cap1 = add(c1, `<div class="abs" style="left:0;width:${CW}px;top:660px;text-align:center;font-size:19px;color:#9aa3b5;opacity:0">Every slot is yours to fill</div>`);

    /* ---------- card 2: bookmark a property into the Inspector's Channels ---------- */
    const pb = add(c2, '<div class="abs" style="left:24px;top:140px;width:492px;height:252px;border-radius:10px;background:rgba(8,8,12,.5);border:1px solid rgba(255,255,255,.07)"></div>');
    const group = (y, ic, name, owner) => add(pb, `<div class="abs" style="left:14px;right:16px;top:${y}px;height:38px;display:flex;align-items:center;gap:10px">
      ${icon(ic, 20, '#f5a623')}<span class="disp6" style="font-size:20px">${name}</span><span class="mono" style="margin-left:auto;font-size:15px;letter-spacing:.1em;color:#6b7385">${owner}</span></div>`);
    const prop = (y, name, inner) => {
      add(pb, `<div class="abs" style="left:0;width:152px;top:${y}px;height:34px;line-height:34px;text-align:right;font-size:18px;color:#9aa3b5">${name}</div>`);
      return add(pb, `<div class="abs mono" style="left:172px;top:${y}px;width:296px;height:34px;line-height:32px;font-size:18px;${FIELD}">${inner}</div>`);
    };
    const bar = (f, v) => `<div class="abs" style="left:0;top:0;bottom:0;width:${f * 100}%;background:rgba(58,123,200,.55)"></div><span style="position:relative">${v}</span>`;
    group(2, 'world', 'Light', 'KEY_AREA');
    prop(42, 'Color', '<div class="abs" style="left:4px;right:4px;top:4px;bottom:4px;border-radius:4px;background:linear-gradient(90deg,#ffe3bd,#ffd7a1)"></div>');
    const powerFld = prop(82, 'Power', '<span class="v">1000 W</span>');
    const powerVal = powerFld.querySelector('.v');
    group(124, 'palette', 'Material', 'BRUSHED GOLD');
    prop(166, 'Roughness', bar(.35, '0.35'));
    prop(208, 'Metallic', bar(1, '1.00'));

    const menu = add(c2, `<div class="abs" style="left:196px;top:262px;width:300px;padding:6px;border-radius:9px;background:rgba(24,25,32,.97);border:1px solid rgba(255,255,255,.14);
      box-shadow:0 24px 50px rgba(0,0,0,.6);transform-origin:20% 0;visibility:hidden">
      ${[['keyframe', 'Insert Keyframe'], ['refresh', 'Reset to Default Value'], ['code', 'Copy Data Path']].map(([ic, t]) =>
        `<div style="height:34px;display:flex;align-items:center;gap:10px;padding:0 10px;font-size:18px;color:#c9d1de;white-space:nowrap">${icon(ic, 18, '#8790a3')}${t}</div>`).join('')}
      <div style="height:1px;margin:5px 6px;background:rgba(255,255,255,.1)"></div>
      <div class="bmi" style="height:34px;display:flex;align-items:center;gap:10px;padding:0 10px;border-radius:6px;font-size:18px;color:#eef1f6;white-space:nowrap">${icon('bookmark', 18, '#f5a623')}Bookmark Property</div></div>`);
    const bmItem = menu.querySelector('.bmi');

    const cb = add(c2, `<div class="abs" style="left:24px;top:440px;width:492px;height:210px;border-radius:10px;background:rgba(8,8,12,.5);border:1px solid rgba(255,255,255,.07);overflow:hidden">
      <div class="abs" style="left:14px;top:0;height:44px;display:flex;align-items:center;gap:10px">${icon('list', 20, '#9aa3b5')}<span class="disp6" style="font-size:20px">Inspector</span>
      <span class="mono" style="font-size:15px;letter-spacing:.14em;color:#f5a623">· CHANNELS</span></div>
      <div class="abs" style="left:0;right:0;top:44px;height:1px;background:rgba(255,255,255,.07)"></div></div>`);
    const chRow = (name, owner, val, hot) => add(cb, `<div class="abs" style="left:10px;right:10px;top:52px;height:44px;border-radius:7px;display:flex;align-items:center;gap:10px;padding:0 10px;border:1px solid transparent">
      ${icon('bookmark', 20, hot ? '#f5a623' : '#9aa3b5')}<span class="disp6" style="font-size:19px;white-space:nowrap">${name}</span>
      <span style="font-size:15px;color:#6b7385;white-space:nowrap">${owner}</span>
      <div class="mono fld" style="margin-left:auto;width:132px;height:32px;line-height:30px;font-size:17px;${FIELD}">${val}</div></div>`);
    const oldRows = [chRow('Focal Length', 'Cam_Hero', '50 mm'), chRow('Roughness', 'Brushed Gold', '0.35')];
    const newRow = chRow('Power', 'Key_Area', '1000 W', true);
    const newVal = newRow.querySelector('.fld');
    newRow.style.opacity = 0;

    const ghost = add(c2, `<div class="abs chip" style="left:0;top:0;font-size:18px;padding:6px 14px;border-color:#f5a623;color:#f5a623;background:rgba(30,22,10,.94);
      box-shadow:0 0 26px rgba(245,166,35,.55);opacity:0">${icon('bookmark', 18, '#f5a623')}Power · 1000 W</div>`);
    const GW = ghost.offsetWidth, GH = ghost.offsetHeight, G0 = { x: 344, y: 239 }, G1 = { x: 270, y: 514 };

    /* ---------- card 3: Viewport Sync across three scenes ---------- */
    const trunk = add(c3, `<svg class="abs" width="${CW}" height="${CH}" style="left:0;top:0;overflow:visible">
      <defs><linearGradient id="s17sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f5a623"/><stop offset="1" stop-color="#2fc4b2"/></linearGradient></defs>
      <path d="M38 196V460" stroke="rgba(255,255,255,.1)" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path class="flow" d="M38 196V460" stroke="url(#s17sg)" stroke-width="4" stroke-dasharray="3 11" fill="none" stroke-linecap="round"/>
      <path d="M38 196H66" stroke="#f5a623" stroke-width="4" stroke-linecap="round"/>
      <path class="st1" d="M38 328H62M55 321l8 7-8 7" stroke="rgba(255,255,255,.3)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="st2" d="M38 460H62M55 453l8 7-8 7" stroke="rgba(255,255,255,.3)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="38" cy="196" r="8" fill="#f5a623"/></svg>`);
    const flow = trunk.querySelector('.flow'), stubs = [null, trunk.querySelector('.st1'), trunk.querySelector('.st2')];
    const pulse = add(c3, '<div class="abs" style="left:26px;top:0;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 0 18px 8px rgba(47,196,178,.85);opacity:0"></div>');
    const tgl = (inner, set) => `<div style="width:48px;height:44px;border-radius:8px;display:flex;align-items:center;justify-content:center;
      border:1px solid ${set ? 'rgba(58,123,200,.7)' : 'rgba(255,255,255,.12)'};background:${set ? 'rgba(58,123,200,.2)' : 'rgba(255,255,255,.05)'};color:${set ? '#9cc3f0' : '#8790a3'}">${inner}</div>`;
    const rows3 = ['Kitchen', 'Studio', 'Outdoor'].map((name, k) => {
      const r = add(c3, `<div class="abs" style="left:70px;top:${140 + k * 132}px;width:446px;height:112px;border-radius:10px;background:rgba(8,8,12,.5);border:1px solid rgba(255,255,255,.08)">
        <div class="abs" style="left:18px;top:18px;display:flex;align-items:center;gap:10px">${icon('cube', 22, '#c9d1de')}<span class="disp6" style="font-size:25px">${name}</span></div>
        ${k === 0 ? '<div class="abs mono" style="left:18px;top:64px;font-size:15px;letter-spacing:.14em;color:#f5a623;padding:3px 9px;border:1px solid rgba(245,166,35,.5);border-radius:4px">ACTIVE</div>'
          : `<div class="abs mono syn" style="left:18px;top:67px;font-size:15px;letter-spacing:.14em;color:#2fc4b2;display:flex;align-items:center;gap:7px;opacity:0">${icon('sync', 17, '#2fc4b2')}SYNCED</div>`}
        <div class="abs tb" style="right:16px;top:34px;display:flex;gap:8px">${tgl(icon('magnet', 24, 'currentColor'))}${tgl(icon('target', 24, 'currentColor'), true)}${tgl(propIcon(24, 'currentColor'))}</div></div>`);
      const t = r.querySelectorAll('.tb>div');
      return { r, snap: t[0], prop: t[2], syn: r.querySelector('.syn') };
    });
    const legend = add(c3, `<div class="abs mono" style="left:70px;top:552px;display:flex;gap:22px;font-size:15px;letter-spacing:.1em;color:#9aa3b5;white-space:nowrap;opacity:0">
      <span style="display:flex;align-items:center;gap:7px">${icon('magnet', 18, '#9aa3b5')}SNAP</span><span style="display:flex;align-items:center;gap:7px">${icon('target', 18, '#9aa3b5')}PIVOT</span>
      <span style="display:flex;align-items:center;gap:7px">${propIcon(18, '#9aa3b5')}PROPORTIONAL EDIT</span></div>`);
    const cap3 = add(c3, '<div class="abs" style="left:70px;width:446px;top:596px;font-size:19px;line-height:1.4;color:#9aa3b5;opacity:0">Mirrored one way, outward from the scene you work in.</div>');

    /* ---------- cursor (lives on the rail, so it travels with the camera) ---------- */
    const P = (k, x, y) => [CX(k) + x, CY + y];
    const [pcx, pcy] = P(0, PC.x, PC.y), [pwx, pwy] = P(1, 330, 240), [bmx, bmy] = P(1, 330, 398), [nfx, nfy] = P(1, 420, 514);
    const [snx, sny] = P(2, 364, 196), [prx, pry] = P(2, 476, 196);
    const cursor = new Cursor(rail, ctx, [
      { t: T.bloom + .42, x: pcx, y: pcy }, { t: L(0) + .88, x: pcx, y: pcy }, { t: L(0) + 1.22, x: pcx + 118, y: pcy - 4 },
      { t: T.pan1 + .1, x: pcx + 118, y: pcy - 4 }, { t: T.rclick - .06, x: pwx, y: pwy }, { t: T.rclick, x: pwx, y: pwy, click: true },
      { t: T.rclick + .26, x: pwx, y: pwy }, { t: T.bm - .12, x: bmx, y: bmy }, { t: T.bm, x: bmx, y: bmy, click: true },
      { t: T.land + .3, x: nfx, y: nfy }, { t: T.drag, x: nfx, y: nfy }, { t: T.drag + .55, x: nfx + 64, y: nfy },
      { t: T.pan2 + .15, x: nfx + 64, y: nfy }, { t: T.snap - .06, x: snx, y: sny }, { t: T.snap, x: snx, y: sny, click: true },
      { t: T.snap + .45, x: snx, y: sny }, { t: T.prop - .06, x: prx, y: pry }, { t: T.prop, x: prx, y: pry, click: true },
      { t: T.prop + 1.1, x: prx + 90, y: pry + 330 }], { hideAt: T.prop + .7 });

    /* ---------- sound ---------- */
    ctx.cue(T.bloom - .04, 'whoosh', { gain: .75 });
    ctx.cue(T.bloom + .22, 'sparkle', { gain: .4 });
    ctx.cue(T.hover, 'tick', { gain: .5, pan: .2 });
    ctx.cue(T.tag, 'pop', { gain: .7, pitch: 2 });
    ctx.cue(T.pan1, 'swish', { gain: .55, pan: .3 });
    ctx.cue(T.rclick + .04, 'pop', { gain: .45, pitch: -3 });
    ctx.cue(T.bm + .08, 'swish', { gain: .35, pan: -.1 });
    ctx.cue(T.land, 'pop', { gain: .7, pitch: 4 });
    [0, 1, 2].forEach(j => ctx.cue(T.drag + .1 + j * .2, 'tick', { gain: .4, pitch: j * 3 }));
    ctx.cue(T.pan2, 'swish', { gain: .55, pan: .3 });
    [[T.snap, 0], [T.prop, 2]].forEach(([t, p]) => { ctx.cue(t + .25, 'blip', { gain: .6, pitch: p, pan: .3 }); ctx.cue(t + .5, 'blip', { gain: .6, pitch: p + 4, pan: .45 }); });
    ctx.cue(T.pull, 'whoosh', { gain: .45 });
    ctx.cue(T.pull + .7, 'shimmer', { gain: .4 });

    const toggle = (e, lt, tOn) => {
      const on = lt >= tOn, g = on ? Math.exp(-(lt - tOn) * 5) : 0;
      e.style.background = on ? '#e87d0d' : 'rgba(255,255,255,.05)';
      e.style.borderColor = on ? '#f5a623' : 'rgba(255,255,255,.12)';
      e.style.color = on ? '#ffffff' : '#8790a3';
      e.style.boxShadow = on ? `0 0 ${12 + g * 30}px rgba(245,166,35,${.35 + g * .55})` : 'none';
      e.style.transform = `scale(${1 + g * .2})`;
    };

    return lt => {
      /* camera rail: focus card 1 → 2 → 3, then pull back to the triptych */
      const fx = keys(lt, [[T.pan1, CC(0)], [T.pan1 + .55, CC(1)], [T.pan2, CC(1)], [T.pan2 + .55, CC(2)], [T.pull, CC(2)], [T.pull + .75, 960]]);
      const Z = keys(lt, [[-.5, 1.27], [1.6, 1.18, 'out'], [T.pull, 1.18], [T.pull + .75, 1]]);
      rail.style.transform = `translate(${960 - fx * Z}px,${MIDY - (CY + CH / 2) * Z}px) scale(${Z})`;
      const ov = ease.inOut(prog(lt, T.pull, .75));
      cards.forEach((c, k) => {
        const f = Math.max(clamp(1 - Math.abs(fx - CC(k)) / 570), ov), side = CC(k) < fx ? 1 : -1;
        const fy = float(lt, 5 * ov, 1.1, k * 1.7);
        c.style.opacity = lerp(.26, 1, f);
        c.style.transform = f > .999 ? `translateY(${fy}px)` : `perspective(1500px) translateY(${fy}px) rotateY(${(1 - f) * 20 * side}deg) scale(${lerp(.9, 1, f)})`;
      });

      /* card 1 */
      kUpd(lt);
      const km = ease.inOut(prog(lt, T.kMove, .5)), ks = lerp(1, KS, km);
      kw.style.transform = `translate(${lerp(PC.x, kEnd.x, km) - KW * ks / 2}px,${lerp(PC.y, kEnd.y, km) - KH * ks / 2}px) scale(${ks})`;
      fade(klabel, lt, T.kMove + .38, .4);
      const bq = prog(lt, T.bloom, .7);
      burst.style.opacity = Math.sin(Math.PI * bq) * .95; burst.style.transform = `scale(${.45 + bq * .9})`;
      hub.style.transform = `scale(${ease.back(prog(lt, T.bloom, .45))})`;
      ring.style.opacity = ease.out(prog(lt, T.bloom + .1, .5));
      ring.style.transform = `rotate(${lt * 14}deg) scale(${lerp(.55, 1, ease.expo(prog(lt, T.bloom, .9)))})`;
      const hW = clamp((lt - T.hover) / .12) * (1 - clamp((lt - T.pan1 - .05) / .3));
      btns.forEach(({ b, dx, dy }, i) => {
        const q = prog(lt, T.bloom + .05 + i * .035, .5), k = ease.back(q), h = i === 2 ? hW : 0;
        b.style.opacity = clamp(q * 4);
        b.style.transform = `translate(${dx * (1 - k)}px,${dy * (1 - k)}px) scale(${lerp(.35, 1, k) * (1 + h * .06)})`;
        if (i === 2) {
          b.style.background = h > .01 ? `rgba(58,123,200,${.3 + h * .6})` : 'rgba(22,23,30,.95)';
          b.style.borderColor = h > .01 ? `rgba(150,195,245,${.3 + h * .5})` : 'rgba(255,255,255,.14)';
          b.style.boxShadow = `0 10px 24px rgba(0,0,0,.45),0 0 ${h * 28}px rgba(58,123,200,${h * .85})`;
          b.style.color = h > .5 ? '#ffffff' : '#aeb6c6';
        }
      });
      const [cx, cy] = cursor.pos(lt), ddx = cx - pcx, ddy = cy - pcy;
      dir.setAttribute('transform', `rotate(${Math.atan2(ddy, ddx) * 180 / Math.PI} ${PC.x} ${PC.y})`);
      dir.style.opacity = clamp((Math.hypot(ddx, ddy) - 10) / 40) * (1 - clamp((lt - T.pan1) / .3)) * clamp(prog(lt, T.bloom, .3));
      pop(tagWrap, lt, T.tag, .5, .7, 14);
      minis.forEach((m, j) => pop(m, lt, T.tag + .12 + j * .06, .4, .2));
      fade(cap1, lt, T.cap, .5);

      /* card 2 */
      const mq = prog(lt, T.rclick + .03, .22), mOut = prog(lt, T.bm + .06, .14);
      menu.style.visibility = mq > 0 && mOut < 1 ? 'visible' : 'hidden';
      menu.style.opacity = clamp(mq * 3) * (1 - mOut);
      menu.style.transform = `translateY(${(1 - ease.out(mq)) * -10}px) scale(${lerp(.9, 1, ease.out(mq))})`;
      const bmH = clamp((lt - (T.bm - .2)) / .1);
      bmItem.style.background = `rgba(245,166,35,${bmH * .24})`; bmItem.style.color = bmH > .5 ? '#f5a623' : '#eef1f6';
      const src = clamp((lt - T.rclick) / .1) * (1 - clamp((lt - T.land) / .3));
      const dragGlow = clamp((lt - T.drag) / .1) * (1 - clamp((lt - T.drag - .75) / .4));
      powerFld.style.borderColor = `rgba(245,166,35,${.09 + Math.max(src, dragGlow) * .8})`;
      powerFld.style.boxShadow = `0 0 ${Math.max(src, dragGlow) * 16}px rgba(245,166,35,.45)`;
      const gq = prog(lt, T.bm + .06, T.land - T.bm - .06), ge = ease.inOut(gq);
      ghost.style.opacity = gq > 0 && gq < 1 ? 1 : 0;
      ghost.style.transform = `translate(${lerp(G0.x, G1.x, ge) + Math.sin(Math.PI * ge) * 80 - GW / 2}px,${lerp(G0.y, G1.y, ge) - GH / 2}px) scale(${1 + Math.sin(Math.PI * ge) * .12})`;
      const sh = ease.inOut(prog(lt, T.land - .12, .35));
      oldRows.forEach((r, j) => { r.style.top = (52 + (j + sh) * 50) + 'px'; });
      pop(newRow, lt, T.land, .45, .8);
      const ng = lt >= T.land ? Math.exp(-(lt - T.land) * 2.2) : 0;
      newRow.style.background = `rgba(245,166,35,${.05 + ng * .16})`; newRow.style.borderColor = `rgba(245,166,35,${.2 + ng * .6})`;
      newVal.style.borderColor = `rgba(245,166,35,${.09 + dragGlow * .8})`;
      const v = Math.round(lerp(1000, 1250, ease.inOut(prog(lt, T.drag, .55))) / 10) * 10 + ' W';
      if (newVal.textContent !== v) { newVal.textContent = v; powerVal.textContent = v; }

      /* card 3 */
      flow.style.strokeDashoffset = -lt * 40;
      rows3.forEach(({ r, snap, prop: pe, syn }, k) => {
        toggle(snap, lt, T.snap + k * .25); toggle(pe, lt, T.prop + k * .25);
        const g = Math.max(...[T.snap, T.prop].map(t => lt >= t + k * .25 ? Math.exp(-(lt - t - k * .25) * 4) : 0));
        r.style.borderColor = `rgba(${k ? '47,196,178' : '245,166,35'},${.08 + g * .7})`;
        if (syn) fade(syn, lt, T.snap + k * .25, .3);
        if (stubs[k]) stubs[k].style.stroke = lt >= T.snap + k * .25 ? `rgba(47,196,178,${.55 + g * .45})` : 'rgba(255,255,255,.3)';
      });
      let pq = -1;
      for (const t of [T.snap, T.prop]) if (lt >= t && lt < t + .52) pq = (lt - t) / .52;
      if (lt >= T.pull + .8) { const u = ((lt - T.pull - .8) % 1.7) / .6; if (u < 1) pq = u; }
      pulse.style.opacity = pq >= 0 ? Math.sin(Math.PI * clamp(pq)) * .6 + .4 : 0;
      pulse.style.top = (lerp(196, 460, ease.inOut(clamp(pq))) - 12) + 'px';
      fade(legend, lt, L(2) - .1, .5);
      fade(cap3, lt, T.snap + .7, .6);

      cursor.update(lt);
    };
  },
});
