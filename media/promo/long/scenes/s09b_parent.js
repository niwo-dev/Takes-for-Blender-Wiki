// Parent State — the cascade passes animation (and material state) down to the lowest take:
//  1) an action set on the Scene flows down; every take turns with it (pink = inherited)
//  2) takes add their own keys on top (blue), so simple actions combine into complex motion
//  3) a look set once on the View Layer flows down; every child take follows
// Text rules: short chips only while things move; one headline lands at the end in the empty top band.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, headline, panel, Cursor, pop, slide, canvas3d } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const PINK = '#e0569a', BLUE = '#3a7bc8', GOLD = '#d9a54e';
const PX = 100, PY = 250, PW = 640, PH = 620, BODY = 54;
const ROW = i => 20 + i * 100, RH = 84;
const SLOT = 318, SLOT0 = 232;                      // chip slot x inside a row (the Scene row has room further left)
const CW = 330, CH = 620, CX = [780, 1135, 1490], CY = 250;

const ROWS = [
  { name: 'Kitchen', ic: 'cube', d: 0 }, { name: 'Hero Shots', ic: 'layer', d: 1 },
  { name: 'Take 1', ic: 'take', d: 2 }, { name: 'Take 2', ic: 'take', d: 2 }, { name: 'Take 3', ic: 'take', d: 2 }];

defineScene({
  id: 's09b_parent',
  transitionIn: 'zoom',
  camera: { zoom: .025 },
  mood: { a: '#3a7bc8', b: PINK, grid: .28, ax: .2, ay: .3, bx: .82, by: .72, glow: 1.1 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const tAct = L(0) + 1.0, tPass = L(0) + 1.7;                       // Turntable on Kitchen, then Pass Down
    const arrive = [tPass + .25, tPass + .5, tPass + .7, tPass + .9];  // rows 1..4 receive the parent's action
    const tFloat = L(1) + .7, tTilt = L(1) + 1.7;
    const tMat = L(2) + 1.2, matArrive = [tMat + .35, tMat + .55, tMat + .75];
    const tHead = ctx.lineEnd(2) + .35;

    const kick = el('<div class="abs kicker" style="left:120px;top:128px">Parent State</div>'); root.appendChild(kick);

    // ---------- tree panel ----------
    const P = panel(root, { x: PX, y: PY, w: PW, h: PH, title: 'Takes Tree', icon: 'layers' });
    const spine = el(`<svg class="abs" width="${PW}" height="${PH - BODY}" style="left:0;top:0;overflow:visible">
      <path d="M 44 ${ROW(0) + RH / 2} V ${ROW(4) + RH / 2}" stroke="rgba(255,255,255,.1)" stroke-width="3" fill="none"/>
      <path class="flow" d="M 44 ${ROW(0) + RH / 2} V ${ROW(4) + RH / 2}" stroke="${PINK}" stroke-width="3" stroke-dasharray="7 11" fill="none" opacity="0"/>
      <path class="flowG" d="M 70 ${ROW(1) + RH / 2} V ${ROW(4) + RH / 2}" stroke="${GOLD}" stroke-width="3" stroke-dasharray="7 11" fill="none" opacity="0"/></svg>`);
    P.body.appendChild(spine);
    const flow = spine.querySelector('.flow'), flowG = spine.querySelector('.flowG');
    const rows = ROWS.map((r, i) => {
      const e = el(`<div class="abs" style="left:16px;right:16px;top:${ROW(i)}px;height:${RH}px;border-radius:8px;border:1px solid rgba(255,255,255,.06);background:rgba(10,10,14,.45)">
        <div class="abs bar" style="left:0;top:10px;bottom:10px;width:4px;border-radius:2px;background:${PINK};opacity:0"></div>
        <div class="abs" style="left:${56 + r.d * 26}px;top:${RH / 2 - 14}px">${icon(r.ic, 26, '#c9d1de')}</div>
        <div class="abs disp6" style="left:${94 + r.d * 26}px;top:${RH / 2 - 17}px;font-size:26px;white-space:nowrap">${r.name}</div>
        <div class="abs slot" style="left:${i === 0 ? SLOT0 : SLOT}px;top:${RH / 2 - 19}px;display:flex;gap:8px"></div></div>`);
      P.body.appendChild(e); return { e, bar: e.querySelector('.bar'), slot: e.querySelector('.slot') };
    });
    const mk = (txt, c, ic, filled) => el(`<div class="chip" style="font-size:18px;padding:4px 11px;border-color:${c};color:${filled ? '#0d0d11' : c};background:${filled ? c : 'rgba(10,10,14,.5)'};opacity:0">${ic ? icon(ic, 18, filled ? '#0d0d11' : c) : ''}${txt}</div>`);
    const chipTurn = mk('Turntable', PINK, 'action', true); rows[0].slot.appendChild(chipTurn);
    const chipPass = mk('Pass Down', PINK, 'chevD', false); rows[0].slot.appendChild(chipPass);
    const chipGold = mk('Gold', GOLD, 'palette', true); rows[1].slot.appendChild(chipGold);
    const chipFloat = mk('Float', BLUE, 'action', true); rows[2].slot.appendChild(chipFloat);
    const chipTilt = mk('Tilt', BLUE, 'action', true); rows[3].slot.appendChild(chipTilt);
    const inh = [1, 2, 3, 4].map(i => { const c = mk('↳ Turntable', PINK, null, false); rows[i].slot.insertBefore(c, rows[i].slot.firstChild); return c; });
    // legend
    const legend = el(`<div class="abs" style="left:24px;top:${ROW(5) + 8}px;display:flex;gap:26px;align-items:center;opacity:0">
      <span style="display:flex;gap:9px;align-items:center;color:#c9d1de;font-size:19px"><i style="width:14px;height:14px;border-radius:3px;background:${PINK};display:block"></i>From parent</span>
      <span style="display:flex;gap:9px;align-items:center;color:#c9d1de;font-size:19px"><i style="width:14px;height:14px;border-radius:3px;background:${BLUE};display:block"></i>Own keys</span></div>`);
    P.body.appendChild(legend);

    // ---------- three take previews ----------
    const scene = R3D.scene();
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
    const cam = R3D.camera(30);
    const cards = CX.map((x, k) => {
      const c = el(`<div class="glass abs" style="left:${x}px;top:${CY}px;width:${CW}px;height:${CH}px;overflow:hidden">
        <div class="abs disp6" style="left:18px;bottom:66px;font-size:24px">Take ${k + 1}</div>
        <div class="abs chips" style="left:18px;bottom:20px;display:flex;gap:7px"></div></div>`);
      root.appendChild(c);
      const view = canvas3d(c, { x: 0, y: 10, w: CW, h: 470 });
      const chips = c.querySelector('.chips');
      const cT = mk('Turntable', PINK, null, false); cT.style.fontSize = '15px'; chips.appendChild(cT);
      const own = k === 0 ? mk('Float', BLUE, null, false) : k === 1 ? mk('Tilt', BLUE, null, false) : null;
      if (own) { own.style.fontSize = '15px'; chips.appendChild(own); }
      return { c, view, cT, own };
    });

    const H = headline(root, { x: 780, y: 76, w: 1060, lines: ['ANIMATE ONCE.', { t: 'EVERY TAKE INHERITS.', grad: true }], size: 72 });

    // cursor: set the action, pass it down, later set the look
    const at = (row, dx) => [PX + 16 + SLOT + dx, PY + BODY + ROW(row) + RH / 2 + 6];
    const [ax, ay] = at(0, 20 - (SLOT - SLOT0)), [px, py] = at(0, 172 - (SLOT - SLOT0)), [gx, gy] = at(1, 18);
    const cursor = new Cursor(root, ctx, [
      { t: tAct - 1.0, x: 60, y: 1040 }, { t: tAct, x: ax, y: ay, click: true }, { t: tPass, x: px, y: py, click: true },
      { t: tPass + .9, x: 770, y: 980 }, { t: tMat - .9, x: 760, y: 900 }, { t: tMat, x: gx, y: gy, click: true }, { t: tMat + .9, x: 60, y: 1050 }],
      { hideAt: tMat + .7, ripple: 44 });

    ctx.cue(tPass + .05, 'shimmer', { gain: .7 });
    arrive.forEach((t, k) => ctx.cue(t, 'tick', { gain: .5, pitch: 3 + k * 2, pan: -.3 }));
    ctx.cue(tFloat, 'pop', { gain: .6, pitch: 4 }); ctx.cue(tTilt, 'pop', { gain: .6, pitch: 7 });
    matArrive.forEach((t, k) => ctx.cue(t, 'sparkle', { gain: .35, pitch: k * 2, pan: -.2 + k * .3 }));
    ctx.cue(tHead, 'chime', { gain: .5 });

    const ramp = (lt, t0, d = .6) => ease.out(clamp((lt - t0) / d));

    return lt => {
      // intro
      const pin = ease.expo(prog(lt, -.35, .8));
      P.el.style.opacity = prog(lt, -.35, .3) * (1 - .6 * ease.inOut(prog(lt, tHead - .2, .6))); P.el.style.transform = `translateX(${(1 - pin) * -80}px)`;
      rows.forEach((r, i) => slide(r.e, lt, -.2 + i * .06, .5, -30, 0));
      cards.forEach((o, k) => slide(o.c, lt, -.25 + k * .08, .6, 0, 50));
      kick.style.opacity = ease.out(prog(lt, .2, .4)) * (1 - ease.out(prog(lt, tHead - .3, .4)));
      legend.style.opacity = ease.out(prog(lt, tPass + 1.1, .5));

      // 1) the parent's action flows down
      pop(chipTurn, lt, tAct, .45, .6); pop(chipPass, lt, tPass, .45, .6);
      const passOn = lt >= tPass;
      chipPass.style.background = passOn ? 'rgba(224,86,154,.18)' : 'rgba(10,10,14,.5)';
      flow.style.opacity = passOn ? .4 + .6 * ease.out(prog(lt, tPass, .5)) : 0; flow.style.strokeDashoffset = -lt * 45;
      rows.forEach((r, i) => {
        const a = i === 0 ? tAct : arrive[i - 1];
        const k = lt >= a ? 1 : 0, fl = lt >= a ? Math.exp(-(lt - a) * 4) : 0;
        r.bar.style.opacity = k * (.55 + .45 * fl);
        r.e.style.boxShadow = fl > .03 ? `0 0 ${26 * fl}px rgba(224,86,154,${.55 * fl})` : 'none';
      });
      inh.forEach((c, k) => pop(c, lt, arrive[k], .4, .6));

      // 2) own keys on top
      pop(chipFloat, lt, tFloat, .45, .6); pop(chipTilt, lt, tTilt, .45, .6);
      rows[2].e.style.borderColor = lt >= tFloat ? 'rgba(58,123,200,.6)' : 'rgba(255,255,255,.06)';
      rows[3].e.style.borderColor = lt >= tTilt ? 'rgba(58,123,200,.6)' : 'rgba(255,255,255,.06)';

      // 3) a look set once on the View Layer flows to every child take
      pop(chipGold, lt, tMat, .45, .6);
      flowG.style.opacity = lt >= tMat ? .4 + .6 * ease.out(prog(lt, tMat, .5)) : 0; flowG.style.strokeDashoffset = -lt * 45;

      // previews
      cards.forEach((o, k) => {
        pop(o.cT, lt, arrive[k + 1], .4, .6);
        if (o.own) pop(o.own, lt, k === 0 ? tFloat : tTilt, .4, .6);
        const tIn = arrive[k + 1];
        const turn = ramp(lt, tIn) * .8 * Math.sin((lt - tIn) * 1.5);
        const fl = k === 0 ? ramp(lt, tFloat) * .38 * Math.sin((lt - tFloat) * 3.3) : 0;
        const tl = k === 1 ? ramp(lt, tTilt) * .34 * Math.sin((lt - tTilt) * 2.6) : 0;
        const g = ease.inOut(prog(lt, matArrive[k], .7));
        paintWatch(watch, 'silver', 'gold', g);
        pivot.rotation.set(-.1 + tl, -.25 + turn, 0);
        pivot.position.set(0, fl, 0);
        setTime(watch, lt * 6 + 20 + k * 7);
        cam.position.set(0, .6, 15.5); cam.lookAt(0, .15, 0);
        o.view.draw(scene, cam);
        const glowK = Math.max(lt >= tIn ? Math.exp(-(lt - tIn) * 3) : 0, lt >= matArrive[k] ? Math.exp(-(lt - matArrive[k]) * 3) * .8 : 0);
        o.c.style.boxShadow = glowK > .03 ? `0 40px 90px rgba(0,0,0,.5),0 0 ${40 * glowK}px rgba(${lt >= matArrive[k] ? '217,165,78' : '224,86,154'},${.6 * glowK})` : '';
      });

      H.update(lt, tHead);
      cursor.update(lt);
    };
  },
});
