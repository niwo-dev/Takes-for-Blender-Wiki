// s07 — The review loop. A slate claps "TAKE 1" in front of the product while a short statement is read.
// Then the statement clears, the slate flies into the take list, the client's note is written in the note
// popover, New Take from Here makes Take 2 (the preview warms), then Take 3 (hero angle). Earlier rounds stay
// one click away: Take 1 flips the preview back, Take 3 brings it home, and it is approved.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, words, revealMasks, gradify, canvas3d, Cursor } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const PV = { x: 120, y: 140, w: 890, h: 820 };                 // product preview (left)
const LX = 1090, LW = 710, LY = 270, HEAD = 54;                 // take list (right)
const RY0 = LY + HEAD + 14, RSP = 74, RRH = 64;                 // take rows
const rowC = i => RY0 + i * RSP + RRH / 2;
const PO = { x: LX, y: 604, w: LW, h: 330 };                    // note popover
const NOTE1 = 'Warmer light, please.', NOTE2 = 'Hero angle.';

// looks per take: key colour/intensity, warm + cool rims, env, camera, product yaw/pitch, backdrop glow
const LOOKS = [
  { key: '#dde7ff', ki: 1.3, rw: 0, rc: 52, env: 1.0, cam: [.5, .5, 13.4], at: [0, 0, 0], yaw: -.32, pitch: 0, glow: [58, 123, 200, .34] },
  { key: '#ffbf78', ki: 2.3, rw: 115, rc: 0, env: .7, cam: [.5, .5, 13.4], at: [0, 0, 0], yaw: -.32, pitch: 0, glow: [232, 125, 13, .42] },
  { key: '#ffe0bc', ki: 1.8, rw: 72, rc: 40, env: .95, cam: [3.6, -2.0, 10.9], at: [0, .45, 0], yaw: -.18, pitch: .12, glow: [245, 166, 35, .32] },
];

defineScene({
  id: 's07_review',
  transitionIn: 'blinds',
  camera: { zoom: .025 },
  mood: { a: '#265787', b: '#e87d0d', grid: .18, part: .5, glow: 1.0, ax: .25, ay: .45, bx: .8, by: .85 },
  build(root, ctx) {
    const L0 = ctx.line(0), D0 = ctx.lineEnd(0) - L0, L1 = ctx.line(1), D1 = ctx.lineEnd(1) - L1, L2 = ctx.line(2), D2 = ctx.lineEnd(2) - L2;
    const tClap = L0 + .17 * D0 - .03;                    // "take"
    const tOut = L1 - .55;                                 // statement clears, slate flies into the list
    const tRow1 = tOut + .38;
    const tNoteClick = L1 + .1, tPop = tNoteClick + .05, tType1 = tPop + .22, CPS1 = 22;
    const tNew1 = L1 + .45 * D1 - .02;                     // "click New Take from Here"
    const tWarm = L1 + .8 * D1;                            // "work it in"
    const tType2 = tWarm + .7, CPS2 = 26, tNew2 = Math.max(tType2 + NOTE2.length / CPS2 + .3, L2 + .1);
    const tHero = tNew2 + .15, tClose = tNew2 + .78;
    const tBack = L2 + .69 * D2 - .02;                     // "one click away"
    const tFwd = tBack + 1.3, tApp = tFwd + .75;
    // active take over time: [time, take index]
    const ACT = [[-99, 0], [tNew1 + .06, 1], [tNew2 + .06, 2], [tBack, 0], [tFwd, 2]];
    const activeAt = lt => { let a = 0; for (const [t, i] of ACT) if (lt >= t) a = i; return a; };
    // look transitions: [start, from, to, dur]
    const LT = [[tWarm, 0, 1, .8], [tHero, 1, 2, .8], [tBack + .04, 2, 0, .6], [tFwd + .04, 0, 2, .6]];

    /* ---------- product preview ---------- */
    const pv = el(`<div class="abs" style="left:${PV.x}px;top:${PV.y}px;width:${PV.w}px;height:${PV.h}px;border-radius:14px;overflow:hidden;
      border:1px solid rgba(255,255,255,.12);background:radial-gradient(ellipse at 50% 45%,#161a22,#08090c 78%);box-shadow:0 40px 90px rgba(0,0,0,.55)">
      <div class="abs glow" style="left:-10%;top:-5%;width:120%;height:110%"></div></div>`);
    root.appendChild(pv);
    const glow = pv.querySelector('.glow');
    const VW = 700;                                              // the product never needs more width; keeps the software render cheap
    const view = canvas3d(pv, { x: (PV.w - VW) / 2, y: 0, w: VW, h: PV.h });
    const marks = el(`<svg class="abs" width="${PV.w}" height="${PV.h}" style="left:0;top:0" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5" stroke-linecap="round">
      <path d="M28 70V28H70M${PV.w - 70} 28H${PV.w - 28}V70M${PV.w - 28} ${PV.h - 70}V${PV.h - 28}H${PV.w - 70}M70 ${PV.h - 28}H28V${PV.h - 70}"/></svg>`);
    pv.appendChild(marks);
    const scene = R3D.scene({ key: 1.3 });
    const LI = scene.userData.lights;
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const back = new THREE.Mesh(new THREE.CircleGeometry(1.62, 64), new THREE.MeshStandardMaterial({ color: '#4a4e58', metalness: .85, roughness: .38 }));
    back.rotation.x = Math.PI / 2; back.position.y = -.33; watch.add(back);
    const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
    const cam = R3D.camera(28);
    const cA = new THREE.Color(), cB = new THREE.Color();

    /* ---------- approved stamp ---------- */
    const stamp = el(`<div class="abs" style="left:${PV.x + PV.w / 2 - 250}px;top:${PV.y + PV.h - 162}px;width:500px;height:112px;border:5px solid #2fc4b2;border-radius:14px;
      display:flex;align-items:center;justify-content:center;gap:14px;background:rgba(10,12,14,.78);box-shadow:0 0 50px rgba(47,196,178,.35);opacity:0">
      ${icon('check', 46, '#2fc4b2', 3.4)}<span class="disp" style="font-size:60px;color:#2fc4b2;letter-spacing:.01em;white-space:nowrap">APPROVED</span></div>`);
    root.appendChild(stamp);

    /* ---------- slate (clapperboard) ---------- */
    const stripes = 'repeating-linear-gradient(115deg,#eef1f6 0 34px,#0c0d10 34px 68px)';
    const slate = el(`<div class="abs" style="left:${PV.x + PV.w / 2 - 280}px;top:${PV.y + PV.h / 2 - 190}px;width:560px;height:400px;transform-origin:50% 50%">
      <div class="abs bar" style="left:0;top:0;width:560px;height:66px;border-radius:10px 10px 4px 4px;background:${stripes};border:3px solid #0c0d10;transform-origin:10px 62px;box-shadow:0 10px 26px rgba(0,0,0,.5)"></div>
      <div class="abs" style="left:0;top:70px;width:560px;height:330px;border-radius:6px 6px 14px 14px;background:linear-gradient(180deg,#17191f,#0d0e12);border:3px solid rgba(238,241,246,.9);box-shadow:0 40px 80px rgba(0,0,0,.6);overflow:hidden">
        <div class="abs" style="left:0;top:0;right:0;height:46px;background:${stripes};opacity:.95"></div>
        <div class="abs mono" style="left:34px;top:92px;font-size:30px;letter-spacing:.3em;color:#9aa3b5">TAKE</div>
        <div class="abs disp gradO" style="right:40px;top:58px;font-size:230px;line-height:1">1</div>
        <div class="abs" style="left:34px;top:150px;width:210px;height:3px;background:rgba(238,241,246,.25)"></div>
        <div class="abs" style="left:34px;top:196px;width:150px;height:3px;background:rgba(238,241,246,.15)"></div></div>
      <div class="abs flash" style="left:-40px;top:20px;width:640px;height:120px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,244,220,.9),rgba(245,166,35,.35),transparent);opacity:0"></div></div>`);
    root.appendChild(slate);
    const bar = slate.querySelector('.bar'), sflash = slate.querySelector('.flash');

    /* ---------- statement (read first, clears before the demo) ---------- */
    const head = el(`<div class="abs" style="left:${LX + 20}px;top:382px">
      <div class="disp" style="font-size:104px;white-space:nowrap;margin-bottom:8px">${words('EVERY TAKE.')}</div>
      <div class="disp gl" style="font-size:104px;white-space:nowrap;display:inline-block;position:relative">${words('ONE ROUND.')}</div></div>`);
    root.appendChild(head);
    gradify(head.querySelector('.gl'));
    // the same statement lands again once everything has settled (bookend under the list)
    const tEnd = tApp + .75;
    const endH = el(`<div class="abs" style="left:${LX + 20}px;top:640px">
      <div class="disp" style="font-size:86px;white-space:nowrap;margin-bottom:6px">${words('EVERY TAKE.')}</div>
      <div class="disp gl" style="font-size:86px;white-space:nowrap;display:inline-block;position:relative">${words('ONE ROUND.')}</div></div>`);
    root.appendChild(endH);
    gradify(endH.querySelector('.gl'));

    /* ---------- take list ---------- */
    const list = el(`<div class="glass abs" style="left:${LX}px;top:${LY}px;width:${LW}px;height:${HEAD + 14 + 3 * RSP + 6}px">
      <div class="panelHead">${icon('layer', 24, '#9aa3b5')}<span>Front 3/4</span><div class="dots"><i></i><i></i><i></i></div></div></div>`);
    root.appendChild(list);
    const TAKES = [['Take 1', 'Blockout'], ['Take 2', 'Warm light'], ['Take 3', 'Final']];
    const rows = TAKES.map(([slateNo, name], i) => {
      const r = el(`<div class="abs" style="left:14px;right:14px;top:${HEAD + 14 + i * RSP}px;height:${RRH}px;border-radius:8px;display:flex;align-items:center;gap:14px;padding:0 18px">
        <div class="cb" style="width:22px;height:22px;border-radius:5px;border:2px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;flex:none">${icon('check', 16, '#0a0a0c', 3.4)}</div>
        ${icon('take', 26, '#c9d1de')}
        <div class="disp6" style="font-size:27px;white-space:nowrap">${slateNo}<span style="color:#9aa3b5"> · ${name}</span></div>
        <div class="ok" style="margin-left:auto;width:30px;height:30px;border-radius:50%;background:#2fc4b2;display:flex;align-items:center;justify-content:center;opacity:0">${icon('check', 18, '#0a0a0c', 3.4)}</div>
        <div class="nt" style="width:34px;height:34px;border-radius:7px;display:flex;align-items:center;justify-content:center">${icon('note', 24, '#c9d1de')}</div></div>`);
      list.appendChild(r);
      return { r, cb: r.querySelector('.cb'), ok: r.querySelector('.ok'), nt: r.querySelector('.nt') };
    });

    /* ---------- note popover ---------- */
    const pop = el(`<div class="glass abs" style="left:${PO.x}px;top:${PO.y}px;width:${PO.w}px;height:${PO.h}px;overflow:visible;transform-origin:92% 0">
      <div class="abs caret" style="top:-11px;width:22px;height:22px;transform:rotate(45deg);background:#1a2432;border-left:1px solid rgba(255,255,255,.16);border-top:1px solid rgba(255,255,255,.16)"></div>
      <div class="abs" style="left:24px;top:18px;display:flex;align-items:center;gap:12px">${icon('note', 24, '#f5a623')}<span class="disp6" style="font-size:24px">Note</span>
        <span class="mono tag" style="font-size:17px;letter-spacing:.16em;color:#f5a623;margin-left:8px">TAKE 1</span></div>
      <div class="abs field" style="left:24px;right:24px;top:66px;height:62px;border-radius:8px;background:rgba(6,7,9,.6);border:1.5px solid rgba(255,255,255,.14);padding:0 18px;display:flex;align-items:center">
        <span class="txt" style="font-size:27px;color:#eef1f6;white-space:nowrap"></span><i class="caret2" style="display:inline-block;width:3px;height:30px;background:#f5a623;margin-left:3px"></i></div>
      <div class="abs btn" style="left:24px;right:24px;top:144px;height:58px;border-radius:8px;border:2px solid rgba(245,166,35,.8);background:rgba(232,125,13,.14);display:flex;align-items:center;gap:12px;padding-left:18px">
        ${icon('plus', 24, '#f5a623', 2.6)}<span class="disp6" style="font-size:25px;color:#f5a623">New Take from Here</span></div>
      <div class="abs trail" style="left:24px;right:24px;top:222px">
        ${[[1, NOTE1], [2, NOTE2]].map(([n, t]) => `<div class="ti" style="display:flex;align-items:center;gap:14px;height:44px;opacity:0">
          <span class="mono" style="font-size:16px;letter-spacing:.14em;color:#9aa3b5;border:1px solid rgba(255,255,255,.2);border-radius:4px;padding:3px 9px">TAKE ${n}</span>
          <span style="font-size:22px;color:#c9d1de;white-space:nowrap">${t}</span></div>`).join('')}</div></div>`);
    root.appendChild(pop);
    const pTag = pop.querySelector('.tag'), pTxt = pop.querySelector('.txt'), pCaret = pop.querySelector('.caret2'), pBtn = pop.querySelector('.btn');
    const pArrow = pop.querySelector('.caret'), trail = [...pop.querySelectorAll('.ti')];
    const noteX = LX + LW - 14 - 18 - 17;                        // note icon centre (stage px)
    pArrow.style.left = (noteX - LX - 11) + 'px';
    const btnX = LX + LW - 120, btnY = PO.y + 144 + 40;           // the button's empty right side (never on the label)

    /* ---------- cursor ---------- */
    const clickX = LX + LW - 150;
    const cursor = new Cursor(root, ctx, [
      { t: tOut + .2, x: 1990, y: 760 },
      { t: tNoteClick, x: noteX - 2, y: rowC(0) + 6, click: true },
      { t: tType1 + .5, x: LX + LW - 60, y: PO.y + 96 },
      { t: tNew1, x: btnX, y: btnY, click: true },
      { t: tNew1 + .7, x: LX + LW - 60, y: PO.y + 250 },
      { t: tNew2 - .6, x: LX + LW - 60, y: PO.y + 250 },
      { t: tNew2, x: btnX, y: btnY, click: true },
      { t: tBack, x: clickX, y: rowC(0) + 8, click: true },
      { t: tFwd, x: clickX, y: rowC(2) + 8, click: true },
      { t: tApp + .9, x: 1990, y: 980 }], { hideAt: tApp + .45 });

    /* ---------- sound ---------- */
    ctx.cue(.42, 'whoosh', { gain: .45, pitch: -2, pan: -.3 });
    ctx.cue(tClap, 'snap', { gain: 1, pan: -.3 }); ctx.cue(tClap + .01, 'hit', { gain: .7, pan: -.3 });
    ctx.cue(tOut + .05, 'swish', { gain: .55 });
    ctx.cue(tRow1, 'pop', { gain: .6, pitch: 0, pan: .4 });
    ctx.cue(tPop + .02, 'blip', { gain: .45, pan: .5 });
    for (let i = 0; i < NOTE1.length; i += 3) ctx.cue(tType1 + i / CPS1, 'type', { gain: .36 + (i % 2) * .05, pan: .4 });
    ctx.cue(tNew1 + .08, 'pop', { gain: .7, pitch: 3, pan: .4 });
    ctx.cue(tWarm + .05, 'whoosh', { gain: .5, pitch: 2 });
    for (let i = 0; i < NOTE2.length; i += 3) ctx.cue(tType2 + i / CPS2, 'type', { gain: .36, pan: .4 });
    ctx.cue(tNew2 + .08, 'pop', { gain: .7, pitch: 6, pan: .4 });
    ctx.cue(tHero + .05, 'whoosh', { gain: .5, pitch: 4 });
    ctx.cue(tBack + .06, 'swish', { gain: .5, pitch: -2 });
    ctx.cue(tFwd + .06, 'swish', { gain: .5, pitch: 2 });
    ctx.cue(tApp, 'hit', { gain: .8 }); ctx.cue(tApp + .08, 'success', { gain: .75 });

    let txtKey = '', tagKey = '';
    return lt => {
      /* ---- look (lighting / angle) of the active take ---- */
      let A = LOOKS[0], B = LOOKS[0], k = 0;
      for (const [t, f, to, d] of LT) if (lt >= t) { A = LOOKS[f]; B = LOOKS[to]; k = ease.inOut(prog(lt, t, d)); }
      const m = (a, b) => lerp(a, b, k);
      LI.key.color.copy(cA.set(A.key)).lerp(cB.set(B.key), k); LI.key.intensity = m(A.ki, B.ki);
      LI.rimW.intensity = m(A.rw, B.rw); LI.rimC.intensity = m(A.rc, B.rc); scene.environmentIntensity = m(A.env, B.env);
      const g = A.glow.map((v, i) => m(v, B.glow[i]));
      glow.style.background = `radial-gradient(closest-side at 50% 52%,rgba(${g[0] | 0},${g[1] | 0},${g[2] | 0},${g[3]}),transparent)`;
      paintWatch(watch, 'gold'); setTime(watch, 40 + lt * 8);
      pivot.rotation.set(m(A.pitch, B.pitch), m(A.yaw, B.yaw) + Math.sin(lt * .5) * .12, 0);
      cam.position.set(m(A.cam[0], B.cam[0]), m(A.cam[1], B.cam[1]), m(A.cam[2], B.cam[2]) - ease.sine(clamp(lt / ctx.dur)) * .35);
      cam.lookAt(m(A.at[0], B.at[0]), m(A.at[1], B.at[1]), m(A.at[2], B.at[2]));
      view.draw(scene, cam);
      const pk = ease.out(prog(lt, -.5, .6));
      pv.style.opacity = pk;

      /* ---- slate: slides in, claps on "take", then flies into the list as Take 1 ---- */
      const sIn = ease.back(prog(lt, .25, .6)), fly = ease.inOut(prog(lt, tOut, .5));
      const open = lt < tClap ? ease.out(prog(lt, .35, .4)) : 1 - ease.in(prog(lt, tClap - .06, .06));
      bar.style.transform = `rotate(${-24 * open}deg)`;
      const kick = lt >= tClap ? Math.exp(-(lt - tClap) * 9) : 0;
      const tx = lerp(0, LX + 150 - (PV.x + PV.w / 2), fly), ty = lerp((1 - sIn) * 520, rowC(0) - (PV.y + PV.h / 2), fly);
      slate.style.transform = `translate(${tx}px,${ty + kick * 10}px) rotate(${(1 - sIn) * -8 + kick * 1.5}deg) scale(${lerp(1, .09, fly)})`;
      slate.style.opacity = clamp(prog(lt, .25, .2) * 3) * (1 - prog(lt, tOut + .38, .12));
      sflash.style.opacity = kick * .9;
      pv.style.filter = `brightness(${1 - (1 - fly) * sIn * .35})`;

      /* ---- statement ---- */
      revealMasks(head, lt, .5, .1, .85);
      const ho = ease.inOut(prog(lt, tOut - .28, .36));
      head.style.opacity = 1 - ho; head.style.transform = `translateY(${-ho * 50}px)`;

      /* ---- take list ---- */
      const lk = ease.expo(prog(lt, tOut + .1, .7));
      list.style.opacity = clamp(prog(lt, tOut + .1, .4) * 2.5); list.style.transform = `translateX(${(1 - lk) * 60}px)`;
      const act = activeAt(lt);
      const born = [tRow1, tNew1 + .06, tNew2 + .06];
      const earlier = Math.max(0, 1 - Math.abs(lt - L2 - .45) / .45) * (lt < tBack ? 1 : 0);
      rows.forEach((R, i) => {
        const b = born[i], q = prog(lt, b, .45), qe = ease.expo(q);
        R.r.style.opacity = clamp(q * 3); R.r.style.transform = `translateY(${(1 - qe) * -26}px)`;
        const on = act === i && lt >= b;
        const hot = lt >= b ? Math.exp(-(lt - b) * 3) : 0, e = i < 2 ? earlier : 0;
        R.r.style.background = on ? 'rgba(58,123,200,.42)' : `rgba(58,123,200,${e * .22})`;
        R.r.style.boxShadow = on ? `inset 0 0 0 1px rgba(120,170,230,.4),0 0 ${hot * 34}px rgba(245,166,35,${hot * .6})` : `0 0 ${e * 26}px rgba(58,123,200,${e * .5})`;
        R.cb.style.background = on ? '#f5a623' : 'transparent'; R.cb.style.borderColor = on ? '#f5a623' : 'rgba(255,255,255,.3)';
        R.cb.firstElementChild.style.opacity = on ? 1 : 0;
        const isOpen = lt >= tPop && lt < tClose && on;
        R.nt.style.background = isOpen ? 'rgba(245,166,35,.22)' : 'transparent';
        R.ok.style.opacity = i === 2 ? ease.back(prog(lt, tApp + .1, .4)) : 0;
        R.ok.style.transform = `scale(${i === 2 ? lerp(.4, 1, ease.back(prog(lt, tApp + .1, .4))) : 1})`;
      });

      /* ---- note popover ---- */
      const po = ease.back(prog(lt, tPop, .4)), pc = ease.in(prog(lt, tClose, .25));
      pop.style.opacity = clamp(prog(lt, tPop, .4) * 3) * (1 - pc);
      pop.style.transform = `translateY(${(1 - po) * -16 + pc * -10}px) scale(${lerp(.9, 1, po) - pc * .05})`;
      const noteOf = lt >= tNew2 + .06 ? 2 : lt >= tNew1 + .06 ? 1 : 0;
      const tag = 'TAKE ' + (noteOf + 1);
      if (tag !== tagKey) { pTag.textContent = tag; tagKey = tag; }
      let txt = '';
      if (noteOf === 0) txt = NOTE1.slice(0, clamp(Math.floor((lt - tType1) * CPS1) + 1, 0, NOTE1.length));
      else if (noteOf === 1) txt = NOTE2.slice(0, clamp(Math.floor((lt - tType2) * CPS2) + 1, 0, NOTE2.length));
      if (lt < tType1) txt = '';
      if (txt !== txtKey) { pTxt.textContent = txt; txtKey = txt; }
      const typingNow = (lt >= tType1 && lt < tType1 + NOTE1.length / CPS1) || (lt >= tType2 && lt < tType2 + NOTE2.length / CPS2);
      pCaret.style.opacity = lt >= tPop && lt < tClose && (typingNow || Math.floor(lt * 2.4) % 2 === 0) ? 1 : 0;
      const pressed = [tNew1, tNew2].some(t => lt > t - .06 && lt < t + .16);
      const bh = [tNew1, tNew2].reduce((s, t) => Math.max(s, lt >= t ? Math.exp(-(lt - t) * 4) : 0), 0);
      pBtn.style.transform = `scale(${pressed ? .97 : 1})`;
      pBtn.style.boxShadow = `0 0 ${bh * 36}px rgba(245,166,35,${bh * .7})`;
      pBtn.style.background = `rgba(232,125,13,${.14 + bh * .3})`;
      trail.forEach((t, j) => {
        const q = ease.expo(prog(lt, (j === 0 ? tNew1 : tNew2) + .12, .5));
        t.style.opacity = q; t.style.transform = `translateX(${(1 - q) * 30}px)`;
      });

      revealMasks(endH, lt, tEnd, .1, .85);

      /* ---- approved ---- */
      const sk = prog(lt, tApp, .35), sb = ease.back(sk);
      stamp.style.opacity = clamp(sk * 4);
      stamp.style.transform = `rotate(${lerp(-14, -7, sb)}deg) scale(${lerp(1.9, 1, ease.out(sk))})`;

      cursor.update(lt);
    };
  },
});
