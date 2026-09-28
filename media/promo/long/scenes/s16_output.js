// Smart Output: the Output panel's Directory / File Name patterns are typed from tokens and resolve live;
// a Custom Token reads the camera's lens; then every render lands in its own folder. The one headline
// lands last, once the graphics have settled. Every beat is placed relative to the narration.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, Cursor, pop, words, revealMasks, gradify, float, drawOn } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const TOK = { scene: '#6aa6ea', lens: '#f5a623', take: '#2fc4b2', variant: '#e0569a' };
const rgbOf = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',');
// typed sequence: phase 1 builds the path, phase 2 adds the custom token once it resolves
const SEQ = [
  { f: 'dir', k: 'lit', s: '//renders/' }, { f: 'dir', k: 'tok', s: 'scene' }, { f: 'dir', k: 'lit', s: '/' },
  { f: 'file', k: 'tok', s: 'take' }, { f: 'file', k: 'lit', s: '_' }, { f: 'file', k: 'tok', s: 'variant' }, { f: 'file', k: 'lit', s: '_####' },
  { f: 'dir', k: 'tok', s: 'lens', ph: 2 }, { f: 'dir', k: 'lit', s: 'mm/', ph: 2 },
];
const typed = p => p.k === 'tok' ? `[${p.s}]` : p.s;
// the four renders: take, lens, variant, row, slot
const FILES = [['Take_3', '50', 'gold', 0, 0], ['Take_3', '50', 'silver', 0, 1], ['Take_4', '85', 'gold', 1, 0], ['Take_4', '85', 'silver', 1, 1]];
const VNAME = { gold: 'Gold', silver: 'Silver' };
const TW = 288, TH = 162;                                   // file thumbnail
const PW = 1020, PH = 290, PY = 290, PX = 120;              // Output panel (final place)
const S0 = 1.28, VX0 = 960 - PW * S0 / 2, VY0 = 520 - PH * S0 / 2; // ...but it opens as the hero, centred and larger
const CX = 1280, CY = 208, CWD = 500, CHT = 372;            // Custom Token card
const ROWY = [618, 800], SLOTX = [960, 1278], ARC = [34, 14]; // file rows / slots / flight arc per row

function renderFiles() {
  const scene = R3D.scene();
  const watch = createWatch(); const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
  watch.rotation.x = Math.PI / 2; setTime(watch, 0);
  const cam = R3D.camera(30);
  const big = document.createElement('canvas'); big.width = TW * 2; big.height = TH * 2;
  return FILES.map(([, lens, v]) => {
    paintWatch(watch, v, v, 0);
    if (lens === '50') { pivot.rotation.set(0, .55, 0); cam.fov = 30; cam.position.set(0, 2.6, 12); cam.lookAt(0, .1, 0); }
    else { pivot.rotation.set(0, -.35, 0); cam.fov = 17; cam.position.set(2.2, 1.8, 12.5); cam.lookAt(.55, .25, 0); }   // 85 mm: tighter
    R3D.draw(big, scene, cam);
    const c = document.createElement('canvas'); c.width = TW; c.height = TH; const g = c.getContext('2d');
    const warm = v === 'gold';
    const lg = g.createLinearGradient(0, 0, 0, TH); lg.addColorStop(0, warm ? '#35291a' : '#1b2837'); lg.addColorStop(1, warm ? '#0d0b09' : '#090b0f');
    g.fillStyle = lg; g.fillRect(0, 0, TW, TH);
    const rg = g.createRadialGradient(TW / 2, TH * .42, 6, TW / 2, TH * .42, TW * .6);
    rg.addColorStop(0, warm ? 'rgba(245,166,35,.3)' : 'rgba(106,166,234,.3)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, TW, TH);
    g.drawImage(big, 0, 0, TW, TH);
    const vg = g.createRadialGradient(TW / 2, TH / 2, TH * .3, TW / 2, TH / 2, TW * .7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)');
    g.fillStyle = vg; g.fillRect(0, 0, TW, TH);
    return c;
  });
}

defineScene({
  id: 's16_output',
  transitionIn: 'push',
  camera: { zoom: .03 },
  mood: { a: '#3a7bc8', b: '#e87d0d', grid: .28, part: .9, glow: 1.1, ax: .75, ay: .25, bx: .2, by: .8 },
  build(root, ctx) {
    const L = i => ctx.line(i), E = i => ctx.lineEnd(i);
    const at = (i, f) => L(i) + f * (E(i) - L(i));

    // ---------------- beats ----------------
    const tToggle = L(0) + .12;
    const p1a = L(0) + .35, p1b = Math.max(p1a + 1.2, at(0, .64));
    const n1 = SEQ.filter(p => !p.ph).reduce((a, p) => a + typed(p).length, 0);
    const cps1 = n1 / (p1b - p1a - .45), cps2 = 22;
    const tCard = Math.max(p1b + .05, at(0, .66)), tShift = tCard - .1;
    const tNow = Math.max(tCard + .35, at(0, .80));
    const p2a = tNow + .22;
    let t = p1a, prevF = 'dir';
    SEQ.forEach(p => {                                   // schedule: t0 typing starts, t1 typed, tc chip lands
      if (p.ph === 2 && t < p2a) t = p2a;
      if (p.f !== prevF) { t += .15; prevF = p.f; }
      p.cps = p.ph === 2 ? cps2 : cps1; const n = typed(p).length;
      p.t0 = t; p.t1 = t + n / p.cps; p.tc = p.k === 'tok' ? p.t1 + .06 : p.t1;
      t = p.tc + (p.k === 'tok' ? .1 : 0);
    });
    const S = s => SEQ.find(p => p.s === s);
    const lensP = S('lens'), mmP = S('mm/');
    const tLink = lensP.tc + .05;
    const tTree = Math.max(mmP.t1 + .15, L(1) - .15);
    const tF = [L(1) + .5, L(1) + .8, L(1) + 1.3, L(1) + 1.6].map(x => Math.max(x, tTree + .6));   // landings
    const tSpawn = tF.map(x => x - .45);
    const tLens85 = tSpawn[2];
    const tHead = Math.max(E(1) + .2, tF[3] + .55);

    // ---------------- sound ----------------
    ctx.cue(tToggle + .05, 'blip', { gain: .5 });
    SEQ.forEach(p => { for (let i = 0; i < typed(p).length; i += 3) ctx.cue(p.t0 + i / p.cps, 'type', { gain: .3, pan: -.2 }); });
    ['scene', 'take', 'variant', 'lens'].forEach((s, k) => ctx.cue(S(s).tc, 'pop', { gain: .6, pitch: [0, 3, 5, 8][k], pan: -.2 + k * .15 }));
    ctx.cue(tCard, 'swish', { gain: .5, pan: .5 });
    ctx.cue(tNow, 'tick', { gain: .6, pitch: 7, pan: .5 });
    ctx.cue(tLink + .05, 'sparkle', { gain: .45, pan: .2 });
    [0, 1, 2].forEach(k => ctx.cue(tTree + k * .18, 'tick', { gain: .4, pitch: k * 2, pan: -.5 + k * .2 }));
    ctx.cue(tSpawn[0], 'whoosh', { gain: .45, pan: .6 });
    tF.forEach((x, k) => ctx.cue(x, 'thud', { gain: .5, pan: .2 + k * .1 }));
    ctx.cue(tLens85 + .05, 'blip', { gain: .45, pitch: 5, pan: .5 });
    ctx.cue(tHead - .08, 'whoosh', { gain: .4, pan: -.4 });

    const wrap = el('<div class="abs" style="left:0;top:0;width:1920px;height:1080px"></div>'); root.appendChild(wrap);

    // ---------------- kicker + headline (the headline lands last, in its own clear zone) ----------------
    const kick = el('<div class="abs kicker" style="left:120px;top:112px">Smart Output</div>');
    const hA = el(`<div class="abs disp" style="left:120px;top:150px;font-size:104px;white-space:nowrap">${words('NAMED.')}</div>`);
    wrap.append(kick, hA);
    const hB = el(`<div class="abs disp" style="left:${120 + hA.offsetWidth + 34}px;top:150px;font-size:104px;white-space:nowrap">${words('FILED.')}</div>`);
    wrap.appendChild(hB); gradify(hB);

    // ---------------- folder tree + flying files (below the panels) ----------------
    const thumbs = renderFiles();
    const tree = el('<div class="abs" style="left:0;top:0;width:1920px;height:1080px"></div>'); wrap.appendChild(tree);
    const node = (x, y, name, lens) => {
      const e = el(`<div class="abs" style="left:${x}px;top:${y}px;height:58px;padding:0 20px 0 16px;border-radius:12px;display:flex;align-items:center;gap:12px;
        background:rgba(18,19,24,.8);border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 40px rgba(0,0,0,.45)">
        ${icon('folder', 28, lens ? '#f5a623' : '#9aa3b5')}<span class="mono" style="font-size:23px;color:#eef1f6;white-space:nowrap">${name}</span></div>`);
      tree.appendChild(e); return e;
    };
    const rowC = r => ROWY[r] + TH / 2, midY = (rowC(0) + rowC(1)) / 2;
    const nRenders = node(120, midY - 29, 'renders'), nKitchen = node(388, midY - 29, 'Kitchen');
    const nLens = [node(664, rowC(0) - 29, '50mm', 1), node(664, rowC(1) - 29, '85mm', 1)];
    const badges = nLens.map(n => { const b = el('<div class="abs mono" style="right:-13px;top:-13px;width:30px;height:30px;border-radius:50%;background:#2fc4b2;color:#05201c;font-size:17px;display:flex;align-items:center;justify-content:center;opacity:0">0</div>'); n.appendChild(b); return b; });
    const W0 = nRenders.offsetWidth, W1 = nKitchen.offsetWidth, WL = nLens[0].offsetWidth;
    const svg = el(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible">
      <path class="c0" d="M${120 + W0} ${midY} H388" fill="none" stroke="rgba(255,255,255,.24)" stroke-width="3" stroke-linecap="round"/>
      ${[0, 1].map(r => `<path class="c1" d="M${388 + W1} ${midY} C${388 + W1 + 50} ${midY} ${664 - 50} ${rowC(r)} 664 ${rowC(r)}" fill="none" stroke="rgba(255,255,255,.24)" stroke-width="3" stroke-linecap="round"/>`).join('')}
      ${[0, 1].map(r => `<path class="c2" d="M${664 + WL + 4} ${rowC(r)} H${SLOTX[0] - 16}" fill="none" stroke="rgba(245,166,35,.55)" stroke-width="3" stroke-dasharray="5 9" stroke-linecap="round"/>`).join('')}</svg>`);
    tree.insertBefore(svg, tree.firstChild);
    const c0 = svg.querySelector('.c0'), c1 = [...svg.querySelectorAll('.c1')], c2 = [...svg.querySelectorAll('.c2')];
    const files = FILES.map((f, k) => {
      const e = el(`<div class="abs" style="left:0;top:0;width:${TW}px;height:${TH}px;border-radius:10px;overflow:hidden;border:2px solid rgba(255,255,255,.18);box-shadow:0 24px 50px rgba(0,0,0,.55);opacity:0"></div>`);
      const c = thumbs[k]; c.style.cssText = 'position:absolute;left:0;top:0'; e.appendChild(c);
      tree.appendChild(e); return e;
    });

    // ---------------- Output panel ----------------
    const P = el(`<div class="glass abs" style="left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px;transform-origin:0 0">
      <div class="panelHead">${icon('folderOpen', 24, '#9aa3b5')}<span>Output</span>
        <span class="disp6" style="margin-left:26px;font-size:20px;color:#9aa3b5">Smart Output</span></div>
      <div class="tg abs" style="left:318px;top:13px;width:54px;height:28px;border-radius:14px;background:#2a2d36;border:1px solid rgba(255,255,255,.18)"><i class="abs" style="left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#9aa3b5"></i></div></div>`);
    wrap.appendChild(P);
    const tg = P.querySelector('.tg'), knob = tg.firstChild;
    P.insertAdjacentHTML('beforeend', [['dir', 'Directory', 22], ['file', 'File Name', 100]].map(([id, label, y]) =>
      `<div class="abs disp6" style="left:24px;top:${54 + y + 16}px;font-size:21px;color:#9aa3b5;white-space:nowrap">${label}</div>
       <div class="abs fld" data-f="${id}" style="left:172px;top:${54 + y}px;width:760px;height:60px;border-radius:9px;background:rgba(8,9,12,.7);border:1px solid rgba(255,255,255,.12);
         display:flex;align-items:center;padding-left:16px;white-space:nowrap;overflow:hidden"></div>
       <div class="abs" style="left:944px;top:${54 + y + 10}px;width:52px;height:40px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center">${icon('chevD', 20, '#9aa3b5')}</div>`).join(''));
    const fld = { dir: P.querySelector('[data-f=dir]'), file: P.querySelector('[data-f=file]') };
    SEQ.forEach(p => {
      if (p.k === 'lit') { p.el = el('<span class="mono" style="font-size:26px;color:#dfe4ec"></span>'); fld[p.f].appendChild(p.el); return; }
      const c = TOK[p.s];
      p.el = el(`<span class="mono" style="font-size:26px;color:${c}"></span>`);
      p.chip = el(`<span class="mono" style="display:none;align-items:center;height:40px;padding:0 10px;margin:0 3px;border-radius:7px;font-size:24px;color:${c};border:2px solid ${c};background:rgba(${rgbOf(c)},.14)">[${p.s}]</span>`);
      fld[p.f].append(p.el, p.chip);
    });
    const caret = el('<span style="display:inline-block;width:3px;height:30px;margin-left:3px;background:#f5a623;border-radius:2px;flex:none;opacity:0"></span>');
    // live preview of the resolved path
    const pv = el(`<div class="abs" style="left:24px;top:${54 + 186}px;height:40px;display:flex;align-items:center;gap:14px;white-space:nowrap">
      ${icon('chevR', 22, '#f5a623', 2.6)}<div class="mono pvt" style="font-size:24px;color:#dfe4ec;display:flex;align-items:baseline"></div></div>`);
    P.appendChild(pv);
    const pvt = pv.querySelector('.pvt'), segs = {};
    ['root', 'scene', 'sl1', 'lens', 'mm', 'take', 'u1', 'variant', 'frame'].forEach(k => {
      const s = el(`<span style="color:${TOK[k] || (k === 'frame' ? '#9aa3b5' : '#dfe4ec')};display:inline-block;transform-origin:50% 80%"></span>`);
      pvt.appendChild(s); segs[k] = s;
    });

    // ---------------- Custom Token card ----------------
    const card = el(`<div class="glass abs" style="left:${CX}px;top:${CY}px;width:${CWD}px;height:${CHT}px">
      <div class="panelHead">${icon('token', 24, '#9aa3b5')}<span>Custom Token</span></div>
      <div class="abs lensChip mono" style="left:26px;top:74px;height:50px;padding:0 16px;border-radius:9px;display:flex;align-items:center;font-size:30px;color:#f5a623;border:2px solid #f5a623;background:rgba(245,166,35,.14)">[lens]</div>
      ${[['Source', 'Camera', 'camera'], ['Reads', 'data.lens'], ['Format', '.0f']].map(([l, v, ic], k) => `
        <div class="abs mono" style="left:26px;top:${150 + k * 52 + 11}px;font-size:16px;letter-spacing:.14em;color:#6b7385;text-transform:uppercase">${l}</div>
        <div class="abs mono" style="left:150px;top:${150 + k * 52}px;width:${CWD - 176}px;height:42px;border-radius:8px;background:rgba(8,9,12,.6);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:10px;padding-left:14px;font-size:21px;color:#dfe4ec">${ic ? icon(ic, 20, '#9aa3b5') : ''}${v}</div>`).join('')}
      <div class="abs nowBox" style="left:26px;top:310px;width:${CWD - 52}px;height:44px;border-radius:9px;border:1px solid rgba(47,196,178,.35);background:rgba(47,196,178,.08)">
        <div class="abs mono" style="left:14px;top:11px;font-size:17px;letter-spacing:.12em;color:#2fc4b2">NOW:</div>
        <div class="abs mono nowV" style="left:90px;top:3px;height:36px;width:120px;overflow:hidden;font-size:28px;color:#eef1f6"></div></div></div>`);
    wrap.appendChild(card);
    const nowBox = card.querySelector('.nowBox'), nowV = card.querySelector('.nowV'), lensChip = card.querySelector('.lensChip');
    const ROLL = ['—', '12', '35', '24', '70', '50'];     // Now: rolls while it resolves, then lands on 50
    nowV.innerHTML = `<div class="abs rl" style="left:0;top:0">${ROLL.map(v => `<div style="height:36px;line-height:36px">${v}</div>`).join('')}</div>
      <div class="abs r85" style="left:0;top:0;height:36px;line-height:36px;opacity:0">85</div>`;
    const rl = nowV.querySelector('.rl'), r85 = nowV.querySelector('.r85');

    // link: the card's [lens] now used in the path
    const link = el('<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible"><path fill="none" stroke="#f5a623" stroke-width="3" stroke-linecap="round" opacity="0"/><circle r="7" fill="#f5a623" opacity="0"/></svg>');
    wrap.appendChild(link);
    const linkP = link.querySelector('path'), linkDot = link.querySelector('circle');

    // cursor: one click on the Smart Output switch (tip on the switch, never on a word)
    const TGX = VX0 + (318 + 40) * S0, TGY = VY0 + 27 * S0;
    const cursor = new Cursor(wrap, ctx, [{ t: tToggle - .6, x: TGX + 220, y: TGY + 190 }, { t: tToggle, x: TGX, y: TGY, click: true },
      { t: tToggle + .75, x: TGX + 300, y: TGY + 260 }], { hideAt: tToggle + .45 });

    return lt => {
      // ---- layout: the panel starts centred, moves left when the card arrives ----
      const mk = ease.inOut(prog(lt, tShift, .8)), sc = lerp(S0, 1, mk), px = PX;
      const ent = (1 - ease.expo(prog(lt, -.5, 1.1))) * 30;
      P.style.transform = `translate(${lerp(VX0 - PX, 0, mk)}px,${lerp(VY0 - PY, 0, mk) + ent}px) scale(${sc})`;
      const ck = ease.expo(prog(lt, tCard, .8));
      card.style.opacity = clamp(prog(lt, tCard, .3)); card.style.transform = `translateX(${(1 - ck) * 260}px) translateY(${float(lt, 4, 1.1)}px)`;
      kick.style.opacity = ease.out(prog(lt, -.4, .5));

      // ---- Smart Output switch ----
      const on = lt >= tToggle;
      tg.style.background = on ? 'linear-gradient(180deg,#f5a623,#e87d0d)' : '#2a2d36';
      knob.style.transform = `translateX(${ease.out(prog(lt, tToggle, .18)) * 26}px)`; knob.style.background = on ? '#fff' : '#9aa3b5';
      const act = .45 + .55 * ease.out(prog(lt, tToggle, .3));
      fld.dir.style.opacity = act; fld.file.style.opacity = act;

      // ---- typing: literals appear letter by letter, "[token]" snaps into a chip ----
      let typing = null;
      SEQ.forEach(p => {
        const txt = typed(p), n = clamp(Math.floor((lt - p.t0) * p.cps), 0, txt.length);
        if (lt >= p.t0 && lt < p.tc + .02) typing = p.f;
        const chipOn = p.k === 'tok' && lt >= p.tc;
        const shown = chipOn ? '' : txt.slice(0, n);
        if (p.el.textContent !== shown) p.el.textContent = shown;
        if (p.chip) {
          p.chip.style.display = chipOn ? 'inline-flex' : 'none';
          if (chipOn) { const q = ease.back(prog(lt, p.tc, .35)); p.chip.style.transform = `scale(${lerp(1.35, 1, q)})`; p.chip.style.boxShadow = `0 0 ${24 * Math.exp(-(lt - p.tc) * 4)}px ${TOK[p.s]}`; }
        }
      });
      const cf = typing || (lt < p1a ? 'dir' : lt < p2a ? 'file' : lt < mmP.t1 + .8 ? 'dir' : null);
      if (cf && lt >= tToggle) {
        if (caret.parentNode !== fld[cf]) fld[cf].appendChild(caret);
        caret.style.opacity = typing || Math.floor(lt * 3.2) % 2 === 0 ? 1 : 0;
      } else caret.style.opacity = 0;

      // ---- preview: resolved values, which change with every render ----
      const fi = tSpawn.reduce((a, x, k) => lt >= x ? k : a, -1);
      const cur = fi >= 0 ? FILES[fi] : FILES[0];
      const n0 = clamp(Math.floor((lt - SEQ[0].t0) * SEQ[0].cps), 0, 10);
      const V = {
        root: SEQ[0].s.slice(0, n0), scene: lt >= S('scene').tc ? 'Kitchen' : '', sl1: lt >= SEQ[2].t1 ? '/' : '',
        lens: lt >= lensP.tc ? cur[1] : '', mm: lt >= mmP.t1 ? 'mm/' : '',
        take: lt >= S('take').tc ? cur[0] : '', u1: lt >= SEQ[4].t1 ? '_' : '', variant: lt >= S('variant').tc ? VNAME[cur[2]] : '',
        frame: lt >= SEQ[6].t1 ? '_0001.png' : '',
      };
      for (const k in V) if (segs[k].textContent !== V[k]) segs[k].textContent = V[k];
      const CH = { scene: [S('scene').tc], lens: [lensP.tc, tSpawn[2]], take: [S('take').tc, tSpawn[2]], variant: [S('variant').tc, tSpawn[1], tSpawn[2], tSpawn[3]], frame: [SEQ[6].t1] };
      for (const k in CH) {
        const b = Math.max(0, ...CH[k].map(x => 1 - Math.abs(lt - x - .08) / .22));
        segs[k].style.transform = b > .01 ? `translateY(${-b * 6}px) scale(${1 + b * .12})` : 'none';
        segs[k].style.textShadow = b > .02 ? `0 0 ${16 * b}px ${TOK[k] || '#ffffff'}` : 'none';
      }

      // ---- Custom Token: Now: rolls and lands on 50, later reads the 85 mm camera ----
      rl.style.transform = `translateY(${-ease.out(prog(lt, tNow - .45, .45)) * (ROLL.length - 1) * 36}px)`;
      const k85 = ease.inOut(prog(lt, tLens85, .3));
      rl.style.opacity = 1 - k85; r85.style.opacity = k85; r85.style.transform = `translateY(${(1 - k85) * 20}px)`;
      const gN = Math.max(lt >= tNow ? Math.exp(-(lt - tNow) * 3) : 0, lt >= tLens85 ? Math.exp(-(lt - tLens85) * 3) : 0);
      nowBox.style.boxShadow = gN > .02 ? `0 0 ${30 * gN}px rgba(47,196,178,${.6 * gN})` : 'none';
      nowBox.style.borderColor = `rgba(47,196,178,${.35 + .6 * gN})`;
      const gL = lt > lensP.t0 - .1 ? Math.exp(-Math.max(0, lt - lensP.tc) * 2) : 0;
      lensChip.style.boxShadow = gL > .02 ? `0 0 ${22 * gL}px rgba(245,166,35,.8)` : 'none';

      // ---- link line: card [lens] → the chip in the path ----
      const lk = ease.inOut(prog(lt, tLink, .45)), lo = lk * (1 - ease.out(prog(lt, tLink + 1.6, .5)));
      if (lo > .01) {
        const x2 = px + 172 + lensP.chip.offsetLeft + lensP.chip.offsetWidth / 2, y2 = PY + 54 + 22 + 6;
        const x1 = CX - 4, y1 = CY + 99 + float(lt, 4, 1.1);
        linkP.setAttribute('d', `M${x1} ${y1} C${x1 - 190} ${y1} ${x2 + 30} ${y2 - 150} ${x2} ${y2}`);
        const Ln = linkP.getTotalLength();
        linkP.setAttribute('stroke-dasharray', `${Ln * lk} ${Ln + 10}`); linkP.setAttribute('opacity', lo);
        const pt = linkP.getPointAtLength(Ln * lk);
        linkDot.setAttribute('cx', pt.x); linkDot.setAttribute('cy', pt.y); linkDot.setAttribute('opacity', lo * (lk < .99 ? 1 : .0));
      } else { linkP.setAttribute('opacity', 0); linkDot.setAttribute('opacity', 0); }

      // ---- folder tree ----
      [nRenders, nKitchen].forEach((n, k) => pop(n, lt, tTree + k * .18, .45, .7));
      nLens.forEach((n, k) => pop(n, lt, tTree + .36 + k * .08, .45, .7));
      drawOn(c0, lt, tTree + .1, .3); c1.forEach((c, k) => drawOn(c, lt, tTree + .25 + k * .08, .35));
      c2.forEach((c, k) => { c.style.opacity = ease.out(prog(lt, tTree + .5 + k * .08, .3)) * .9; c.style.strokeDashoffset = -lt * 24; });

      // ---- each render flies in from the right and drops into its folder row ----
      const cnt = [0, 0];
      files.forEach((e, k) => {
        const [, , , r, s] = FILES[k], land = tF[k];
        const q = prog(lt, tSpawn[k], .45), qe = ease.out(q);
        const x = lerp(1990, SLOTX[s], qe), y = ROWY[r] - Math.sin(Math.PI * q) * ARC[r];
        const sq = lt >= land ? Math.exp(-(lt - land) * 9) * Math.sin((lt - land) * 30) * .05 : 0;
        e.style.opacity = q > 0 ? 1 : 0;
        e.style.transform = `translate(${x}px,${y}px) rotate(${(1 - qe) * 6}deg) scale(${1 + sq},${1 - sq})`;
        const g = lt >= land ? Math.exp(-(lt - land) * 3.5) : 0;
        e.style.borderColor = g > .02 ? `rgba(47,196,178,${.25 + .75 * g})` : 'rgba(255,255,255,.18)';
        e.style.boxShadow = `0 24px 50px rgba(0,0,0,.55)${g > .02 ? `,0 0 ${34 * g}px rgba(47,196,178,${.6 * g})` : ''}`;
        if (lt >= land) cnt[r]++;
      });
      nLens.forEach((n, r) => {
        const last = Math.max(-9, ...tF.filter((x, k) => FILES[k][3] === r && lt >= x));
        const g = Math.exp(-(lt - last) * 4);
        n.style.boxShadow = `0 18px 40px rgba(0,0,0,.45)${g > .02 ? `,0 0 0 2px rgba(47,196,178,${g}),0 0 ${28 * g}px rgba(47,196,178,${.5 * g})` : ''}`;
        if (badges[r].textContent !== String(cnt[r])) badges[r].textContent = cnt[r];
        badges[r].style.opacity = cnt[r] ? 1 : 0; badges[r].style.transform = `scale(${1 + g * .35})`;
      });

      // ---- the statement lands last ----
      revealMasks(hA, lt, tHead, .09, .8); revealMasks(hB, lt, tHead + .14, .09, .8);
      cursor.update(lt);
    };
  },
});
