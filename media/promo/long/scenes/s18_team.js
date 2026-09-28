// Team: a file made without Takes opens with everything it had (one question, asked in the middle
// of the viewport); then project presets travel with the .blend to every teammate who opens it.
import { defineScene, el, ease, prog, clamp, lerp } from '../engine.js';
import { icon, headline, Cursor, pop, slide, fade, float, drawOn } from '../ui.js';

const add = (p, html) => { const e = el(html); p.appendChild(e); return e; };
const doc = (w, h, accent = '#f5a623') => `<svg viewBox="0 0 100 124" width="${w}" height="${h}" style="display:block;overflow:visible">
  <path d="M12 2H68L98 32V112Q98 122 88 122H12Q2 122 2 112V12Q2 2 12 2Z" fill="#1b2638" stroke="rgba(255,255,255,.38)" stroke-width="2.5"/>
  <path d="M68 2V24Q68 32 76 32H98" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="2.5"/>
  <rect x="18" y="56" width="58" height="7" rx="3.5" fill="rgba(255,255,255,.2)"/><rect x="18" y="73" width="66" height="7" rx="3.5" fill="rgba(255,255,255,.13)"/>
  <rect x="18" y="90" width="44" height="7" rx="3.5" fill="rgba(255,255,255,.13)"/><circle cx="27" cy="28" r="10" fill="none" stroke="${accent}" stroke-width="4.5"/></svg>`;
const folder = (w, h, c = '#f5a623') => `<svg viewBox="0 0 110 86" width="${w}" height="${h}" style="display:block;overflow:visible">
  <path d="M4 14Q4 4 14 4H40L50 14H96Q106 14 106 24V72Q106 82 96 82H14Q4 82 4 72Z" fill="rgba(245,166,35,.12)" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M4 28H106" stroke="${c}" stroke-width="3" opacity=".45"/></svg>`;

// window + dialog geometry (stage px)
const WX = 200, WY = 130, WW = 1520, WH = 820, BODY = 54;
const DW = 720, DH = 456, DX = 960 - DW / 2, DY = WY + BODY + (WH - BODY) / 2 - DH / 2;
const DOC = { x: 960, y: 452, w: 180, h: 223 }, DS = 1.14;         // DS: dialog display scale
const TILES = [['action', 'Animation', '14 OBJECTS'], ['camera', 'Cameras', '3 · MULTI-CAM'], ['world', 'World', 'STUDIO_HDRI'], ['nodes', 'Compositor', 'GLARE_GRADE']];
const PRESETS = [['sliders', 'Render', '#f5a623'], ['download', 'Output', '#6aa6ea'], ['palette', 'Color', '#2fc4b2']];
const MATES = [['A', 'Ana', '#3a7bc8', '#265787'], ['B', 'Ben', '#2fc4b2', '#1d7a6f'], ['C', 'Chloé', '#e0569a', '#8d2f5e']];
const BX = 120, BY = 470, BW = 620, BH = 260;                     // project bundle card
const MX = 1060, MW = 740, MH = 190, MY = k => 170 + k * 240;     // teammate cards

defineScene({
  id: 's18_team',
  transitionIn: 'blinds',
  camera: { zoom: .025 },
  mood: { a: '#265787', b: '#2fc4b2', grid: .25, part: .5, glow: 1.1, ax: .28, ay: .35, bx: .8, by: .72 },
  build(root, ctx) {
    const L = i => ctx.line(i), D0 = ctx.lineEnd(0) - L(0), P2 = L(1);
    const T = { drop: -.46, land: .04, dbl: L(0) + .1, open: L(0) + .32, dlg: L(0) + .74, keep: L(0) + D0 * .4,
      ticks: [.5, .66, .8, .9].map(f => L(0) + D0 * f), done: L(0) + D0 * .97, out: P2 - .5 };
    const U = { bundle: P2 - .2, file: P2 + .05, pre: P2 + .35, chips: P2 + .62, links: P2 + 1.2, mates: P2 + 1.45, travel: P2 + 1.62, checks: P2 + 3.3, head: P2 + 3.55 };
    const arrive = k => U.travel + k * .22 + .5;

    // opaque backdrop while the blinds open, so the previous scene never shows through behind our content
    const veil = add(root, '<div class="abs" style="left:-40px;top:-40px;width:2000px;height:1160px;background:radial-gradient(ellipse at 50% 42%,#13202f,#09090c 72%)"></div>');

    /* ---------------- part 1: the first-open dialog ---------------- */
    const g1 = add(root, '<div class="abs" style="left:0;top:0;width:1920px;height:1080px"></div>');
    const win = add(g1, `<div class="abs" style="left:${WX}px;top:${WY}px;width:${WW}px;height:${WH}px;border-radius:12px;overflow:hidden;
      background:linear-gradient(180deg,#172537,#0f1016 60%);border:1px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.2);box-shadow:0 40px 90px rgba(0,0,0,.55)">
      <div class="abs" style="left:0;right:0;top:0;height:${BODY}px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02)">
        <div class="abs" style="left:24px;top:15px">${icon('file', 24, '#9aa3b5')}</div>
        <div class="abs" style="right:22px;top:22px;display:flex;gap:8px"><i style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.16)"></i><i style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.16)"></i><i style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.16)"></i></div></div>
      <svg class="abs" width="${WW}" height="${WH - BODY}" style="left:0;top:${BODY}px">${(() => {
        const vx = WW / 2, hy = 250, lines = [];
        for (let i = -12; i <= 12; i++) lines.push(`<line x1="${vx + i * 26}" y1="${hy}" x2="${vx + i * 190}" y2="${WH}" />`);
        for (let j = 1; j <= 9; j++) { const y = hy + Math.pow(j / 9, 2.2) * (WH - hy); lines.push(`<line x1="0" y1="${y}" x2="${WW}" y2="${y}" />`); }
        return `<g stroke="rgba(58,123,200,.22)" stroke-width="1.5">${lines.join('')}</g><rect x="0" y="0" width="${WW}" height="${hy + 40}" fill="url(#s18sky)"/>
          <defs><linearGradient id="s18sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0f1016"/><stop offset=".8" stop-color="#0f1016" stop-opacity=".7"/><stop offset="1" stop-color="#0f1016" stop-opacity="0"/></linearGradient></defs>`;
      })()}</svg>
      <div class="abs scrim" style="left:0;right:0;top:${BODY}px;bottom:0;background:rgba(5,6,9,.62);opacity:0"></div></div>`);
    const scrim = win.querySelector('.scrim');
    const dlg = add(g1, `<div class="abs" style="left:${DX}px;top:${DY}px;width:${DW}px;height:${DH}px;border-radius:14px;transform-origin:50% 50%;opacity:0;
      background:linear-gradient(180deg,#1d2a3c,#15161d 55%);border:1px solid rgba(255,255,255,.14);border-top-color:rgba(255,255,255,.24);box-shadow:0 50px 110px rgba(0,0,0,.7)">
      <div class="abs" style="left:32px;top:28px;width:52px;height:52px;border-radius:50%;border:2px solid rgba(245,166,35,.6);background:rgba(245,166,35,.12);display:flex;align-items:center;justify-content:center">${icon('take', 26, '#f5a623')}</div>
      <div class="abs disp6" style="left:102px;top:34px;font-size:32px;white-space:nowrap">Made without Takes</div></div>`);
    const tiles = TILES.map(([ic, name, val], i) => {
      const x = 32 + (i % 2) * 338, y = 108 + Math.floor(i / 2) * 124;
      const t = add(dlg, `<div class="abs" style="left:${x}px;top:${y}px;width:318px;height:108px;border-radius:10px;background:rgba(8,9,13,.55);border:1px solid rgba(255,255,255,.08)">
        <div class="abs ib" style="left:18px;top:26px;width:56px;height:56px;border-radius:10px;background:rgba(58,123,200,.16);border:1px solid rgba(58,123,200,.4);display:flex;align-items:center;justify-content:center">${icon(ic, 30, '#9cc3f0')}</div>
        <div class="abs disp6" style="left:92px;top:22px;font-size:26px;white-space:nowrap">${name}</div>
        <div class="abs mono" style="left:92px;top:62px;font-size:16px;letter-spacing:.12em;white-space:nowrap;color:${i === 1 ? '#f5a623' : '#8790a3'}">${val}</div>
        <div class="abs ck" style="left:270px;top:14px;width:32px;height:32px;border-radius:50%;background:#2fc4b2;display:flex;align-items:center;justify-content:center;opacity:0">${icon('check', 20, '#0a0a0c', 3)}</div></div>`);
      return { t, ck: t.querySelector('.ck'), ib: t.querySelector('.ib') };
    });
    const bKeep = add(dlg, `<div class="abs disp6" style="left:100px;top:368px;width:250px;height:56px;border-radius:9px;background:#e87d0d;border:1px solid #f5a623;color:#fff;font-size:23px;
      display:flex;align-items:center;justify-content:center;white-space:nowrap;box-shadow:0 10px 26px rgba(232,125,13,.35)">Keep them all</div>`);
    const bPanel = add(dlg, `<div class="abs disp6" style="left:370px;top:368px;width:250px;height:56px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.2);color:#c9d1de;font-size:23px;
      display:flex;align-items:center;justify-content:center;white-space:nowrap">Open Takes panel</div>`);

    // the file that drops in, and its name that becomes the window title
    const docEl = add(root, `<div class="abs" style="left:${DOC.x - DOC.w / 2}px;top:${DOC.y - DOC.h / 2}px;width:${DOC.w}px;height:${DOC.h}px;transform-origin:50% 100%;filter:drop-shadow(0 26px 40px rgba(0,0,0,.6))">${doc(DOC.w, DOC.h)}</div>`);
    const nameEl = add(root, '<div class="abs mono" style="left:0;top:0;font-size:28px;color:#eef1f6;white-space:nowrap;transform-origin:0 50%">watch_v12_really_final.blend</div>');
    const NW = nameEl.offsetWidth, NH = nameEl.offsetHeight, N0 = { x: 960 - NW / 2, y: 612 - NH / 2 }, N1 = { x: WX + 62, y: WY + BODY / 2 - NH * .72 / 2 }, NS = .72;

    /* ---------------- part 2: project presets travel with the file ---------------- */
    const H = headline(root, { x: 120, y: 140, w: 820, kicker: 'Project presets', lines: ['SAME SETUP.', { t: 'FOR EVERYONE.', grad: true }], size: 88 });
    const bundle = add(root, `<div class="abs" style="left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;opacity:0">
      <div class="abs" style="left:0;top:-18px;width:150px;height:30px;border-radius:10px 10px 0 0;background:#172335;border:1px solid rgba(255,255,255,.12);border-bottom:none"></div>
      <div class="abs" style="left:0;top:0;width:${BW}px;height:${BH}px;border-radius:0 12px 12px 12px;background:linear-gradient(180deg,#172335,#101117 70%);border:1px solid rgba(255,255,255,.12);box-shadow:0 40px 90px rgba(0,0,0,.5)"></div></div>`);
    const fileT = add(bundle, `<div class="abs" style="left:20px;top:44px;width:160px;display:flex;flex-direction:column;align-items:center;gap:16px">${doc(86, 107, '#3a7bc8')}
      <div class="mono" style="font-size:21px;color:#eef1f6;white-space:nowrap">watch.blend</div></div>`);
    const preT = add(bundle, `<div class="abs" style="left:206px;top:56px;width:160px;display:flex;flex-direction:column;align-items:center;gap:22px">${folder(110, 86)}
      <div class="mono" style="font-size:21px;color:#f5a623;white-space:nowrap">presets/</div></div>`);
    // the presets folder holds three presets; a bracket ties the chips (centres y 62/138/214) to the folder
    const bracket = add(bundle, `<svg class="abs" width="${BW}" height="${BH}" style="left:0;top:0;overflow:visible">
      <path d="M346 100H362Q372 100 372 90V72Q372 62 382 62H398M372 100V128Q372 138 382 138H398M372 138V204Q372 214 382 214H398"
      fill="none" stroke="rgba(245,166,35,.6)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`).querySelector('path');
    const pchips = PRESETS.map(([ic, name, c], j) => add(bundle, `<div class="abs" style="left:404px;top:${38 + j * 76}px;height:48px;display:flex;align-items:center;gap:10px;padding:0 16px 0 12px;
      border-radius:8px;border:2px solid ${c};background:rgba(10,10,14,.6);white-space:nowrap;opacity:0">${icon(ic, 22, c)}<span class="disp6" style="font-size:21px;color:#eef1f6">${name}</span></div>`));

    const links = add(root, `<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible">${MATES.map((_, k) => {
      const y1 = BY + BH / 2, y2 = MY(k) + MH / 2, d = `M${BX + BW} ${y1}C${BX + BW + 170} ${y1} ${MX - 170} ${y2} ${MX} ${y2}`;
      return `<path class="b" d="${d}" fill="none" stroke="rgba(47,196,178,.35)" stroke-width="3" stroke-linecap="round"/><path class="f" d="${d}" fill="none" stroke="#2fc4b2" stroke-width="3" stroke-dasharray="5 12" stroke-linecap="round" opacity="0"/>`;
    }).join('')}</svg>`);
    const bases = [...links.querySelectorAll('.b')], flows = [...links.querySelectorAll('.f')], blen = bases.map(b => b.getTotalLength());
    const travellers = MATES.map(() => add(root, `<div class="abs" style="left:0;top:0;width:48px;height:48px;border-radius:50%;background:#12202c;border:2px solid #2fc4b2;
      box-shadow:0 0 22px rgba(47,196,178,.7);display:flex;align-items:center;justify-content:center;opacity:0">${icon('file', 24, '#2fc4b2')}</div>`));
    const mates = MATES.map(([ini, name, c1, c2], k) => {
      const m = add(root, `<div class="abs" style="left:${MX}px;top:${MY(k)}px;width:${MW}px;height:${MH}px;border-radius:14px;opacity:0;
        background:linear-gradient(180deg,#182536,#111118 70%);border:1px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.18);box-shadow:0 30px 70px rgba(0,0,0,.5)">
        <div class="abs disp" style="left:28px;top:53px;width:84px;height:84px;border-radius:50%;background:linear-gradient(145deg,${c1},${c2});box-shadow:0 0 0 4px rgba(255,255,255,.08);
          display:flex;align-items:center;justify-content:center;font-size:38px;color:#fff">${ini}</div>
        <div class="abs disp6" style="left:134px;top:72px;font-size:34px;white-space:nowrap">${name}</div>
        <div class="abs fdoc" style="left:282px;top:66px;opacity:0">${doc(46, 57, c1)}</div>
        ${PRESETS.map(([ic, , c], j) => `<div class="abs pc" style="left:${366 + j * 78}px;top:69px;width:64px;height:52px;border-radius:9px;border:2px solid ${c};background:rgba(10,10,14,.6);
          display:flex;align-items:center;justify-content:center;opacity:0">${icon(ic, 26, c)}</div>`).join('')}
        <div class="abs ck" style="left:642px;top:67px;width:56px;height:56px;border-radius:50%;background:#2fc4b2;display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 0 24px rgba(47,196,178,.6)">${icon('check', 32, '#0a0a0c', 3)}</div></div>`);
      return { m, fdoc: m.querySelector('.fdoc'), pcs: [...m.querySelectorAll('.pc')], ck: m.querySelector('.ck') };
    });

    /* ---------------- cursor (part 1): never rests on a word ---------------- */
    const keepTip = [960 + (100 + 226 - DW / 2) * DS, DY + DH / 2 + (368 + 30 - DH / 2) * DS];
    const cursor = new Cursor(root, ctx, [
      { t: .3, x: 1480, y: 930 }, { t: T.dbl - .06, x: 1004, y: 470 }, { t: T.dbl, x: 1004, y: 470, click: true }, { t: T.dbl + .16, x: 1004, y: 470, click: true },
      { t: T.open + .5, x: 1420, y: 880 }, { t: T.keep - .55, x: 1420, y: 880 }, { t: T.keep, x: keepTip[0], y: keepTip[1], click: true },
      { t: T.keep + .5, x: 1180, y: 880 }], { hideAt: T.keep + .7 });

    /* ---------------- sound ---------------- */
    ctx.cue(T.land, 'thud', { gain: .7 });
    ctx.cue(T.open - .02, 'whoosh', { gain: .7 });
    ctx.cue(T.dlg, 'pop', { gain: .7 });
    T.ticks.forEach((t, i) => ctx.cue(t, 'tick', { gain: .65, pitch: [0, 2, 4, 7][i] }));
    ctx.cue(T.done, 'chime', { gain: .5 });
    ctx.cue(T.out, 'swish', { gain: .5 });
    ctx.cue(U.file, 'pop', { gain: .6 });
    ctx.cue(U.pre, 'pop', { gain: .6, pitch: 3 });
    ctx.cue(U.chips + .1, 'sparkle', { gain: .45 });
    ctx.cue(U.links, 'whoosh', { gain: .45 });
    ctx.cue(U.mates, 'swish', { gain: .35, pan: .4 });
    MATES.forEach((_, k) => ctx.cue(arrive(k), 'pop', { gain: .6, pitch: 2 + k * 2, pan: .4 }));
    ctx.cue(U.checks, 'success', { gain: .7 });

    return lt => {
      veil.style.opacity = 1 - ease.inOut(prog(lt, .4, .6));

      /* part 1 — drop, open, dialog, keep, ticks */
      const fall = prog(lt, T.drop, T.land - T.drop);
      const bounce = lt > T.land ? -Math.exp(-(lt - T.land) * 8) * Math.sin((lt - T.land) * 20) * 22 : 0;
      const squash = lt > T.land ? Math.exp(-(lt - T.land) * 14) * .08 : 0;
      const op = ease.out(prog(lt, T.open, .24));
      docEl.style.transform = `translateY(${-360 * (1 - fall * fall) + bounce}px) scale(${(1 + squash * .6) * (1 + op * .45)},${(1 - squash) * (1 + op * .45)})`;
      docEl.style.opacity = 1 - op;
      const nm = ease.inOut(prog(lt, T.open, .55));
      const wo = ease.expo(prog(lt, T.open + .04, .6));
      const it = lerp(DOC.y - DOC.h / 2 - WY, 0, wo), ib = lerp(WY + WH - (DOC.y + DOC.h / 2), 0, wo), il = lerp(DOC.x - DOC.w / 2 - WX, 0, wo), ir = lerp(WX + WW - (DOC.x + DOC.w / 2), 0, wo);
      win.style.clipPath = wo < 1 ? `inset(${it}px ${ir}px ${ib}px ${il}px round 12px)` : 'none';
      win.style.opacity = clamp(prog(lt, T.open, .12) * 1.2);
      scrim.style.opacity = ease.out(prog(lt, T.dlg - .1, .4));
      const dq = prog(lt, T.dlg, .5);
      dlg.style.opacity = clamp(dq * 3);
      dlg.style.transform = `translateY(${(1 - ease.expo(dq)) * 24}px) scale(${DS * lerp(.9, 1, ease.back(dq))})`;
      tiles.forEach(({ t, ck, ib: box }, i) => {
        slide(t, lt, T.dlg + .12 + i * .07, .5, 0, 18);
        pop(ck, lt, T.ticks[i], .4, .3);
        const g = lt >= T.ticks[i] ? Math.exp(-(lt - T.ticks[i]) * 3) : 0, on = lt >= T.ticks[i];
        t.style.borderColor = on ? `rgba(47,196,178,${.35 + g * .6})` : 'rgba(255,255,255,.08)';
        t.style.boxShadow = on ? `0 0 ${g * 26}px rgba(47,196,178,${g * .5})` : 'none';
        box.style.borderColor = on ? 'rgba(47,196,178,.6)' : 'rgba(58,123,200,.4)';
        box.style.background = on ? 'rgba(47,196,178,.14)' : 'rgba(58,123,200,.16)';
      });
      pop(bKeep, lt, T.dlg + .38, .45, .8); pop(bPanel, lt, T.dlg + .44, .45, .8);
      const kg = lt >= T.keep ? Math.exp(-(lt - T.keep) * 3.5) : 0;
      bKeep.style.boxShadow = `0 10px 26px rgba(232,125,13,.35),0 0 ${kg * 40}px rgba(245,166,35,${kg * .9})`;
      if (lt >= T.keep && lt < T.keep + .12) bKeep.style.transform = 'scale(.96)';
      bPanel.style.opacity = +bPanel.style.opacity * (1 - .55 * clamp((lt - T.keep) / .3));
      const dg = lt >= T.done ? Math.exp(-(lt - T.done) * 2.5) : 0;
      dlg.style.boxShadow = `0 50px 110px rgba(0,0,0,.7),0 0 ${dg * 50}px rgba(47,196,178,${dg * .45})`;
      const o1 = ease.in(prog(lt, T.out, .45));
      g1.style.opacity = 1 - o1; g1.style.transform = `translateY(${-70 * o1}px) scale(${1 - .04 * o1})`;
      nameEl.style.opacity = ease.out(prog(lt, T.land + .08, .3)) * (1 - o1);
      nameEl.style.transform = `translate(${lerp(N0.x, N1.x, nm)}px,${lerp(N0.y, N1.y, nm) - 70 * o1}px) scale(${lerp(1, NS, nm)})`;
      g1.style.visibility = o1 >= 1 ? 'hidden' : '';

      /* part 2 — bundle, links, teammates, checks, headline */
      slide(bundle, lt, U.bundle, .7, -90, 0);
      pop(fileT, lt, U.file, .5, .6, 20); pop(preT, lt, U.pre, .5, .6, 20);
      drawOn(bracket, lt, U.chips - .12, .4);
      pchips.forEach((c, j) => slide(c, lt, U.chips + j * .1, .5, -24, 0));
      MATES.forEach((_, k) => {
        const s0 = U.links + k * .08;
        drawOn(bases[k], lt, s0, .6, blen[k]);
        flows[k].style.opacity = ease.out(prog(lt, s0 + .6, .4)); flows[k].style.strokeDashoffset = -lt * 36;
        const q = prog(lt, U.travel + k * .22, .5), e = ease.inOut(q), tr = travellers[k];
        const p = bases[k].getPointAtLength(blen[k] * e);
        tr.style.opacity = q > 0 && q < 1 ? clamp(q * 6) * clamp((1 - q) * 6) : 0;
        tr.style.transform = `translate(${p.x - 24}px,${p.y - 24}px) scale(${1 + Math.sin(Math.PI * q) * .15})`;
        const { m, fdoc, pcs, ck } = mates[k];
        slide(m, lt, U.mates + k * .22, .6, 90, 0);
        const a = arrive(k);
        pop(fdoc, lt, a, .45, .4);
        pcs.forEach((c, j) => pop(c, lt, a + .14 + j * .08, .4, .5));
        pop(ck, lt, U.checks + k * .08, .5, .3);
        const g = lt >= a ? Math.exp(-(lt - a) * 3) : 0;
        m.style.borderColor = `rgba(47,196,178,${.1 + g * .6})`;
        m.style.transform += ` translateY(${float(lt, 3 * clamp((lt - U.checks) / .6), 1, k * 1.9)}px)`;
      });
      H.update(lt, U.head);

      cursor.update(lt);
    };
  },
});
