// AI assistant: calls arrive over MCP, Takes reacts, and every change lands in Undo History as one
// labelled step; Ctrl+Z takes back exactly one. The headline lands once the undo has settled.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, headline, keycaps, pop, slide, fade, canvas3d } from '../ui.js';
import { createWatch, paintWatch, setTime, glowPart } from '../product3d.js';

const add = (p, html) => { const e = el(html); p.appendChild(e); return e; };
const PY = 330, PH = 610;                                        // panel row (stage px)
const TX = 120, TW = 740, TH = 610;                              // terminal
const KX = 900, KW = 500;                                        // Takes panel
const UX = 1440, UW = 360;                                       // Undo History
const HEAD = 54;
// syntax-coloured calls: [text, colour] runs
const CALLS = [
  [['api', '#6aa6ea'], ['.create_take(', '#eef1f6'], ['"Take_004"', '#2fc4b2'], [')', '#eef1f6']],
  [['api', '#6aa6ea'], ['.switch_variant(', '#eef1f6'], ['"Watch"', '#2fc4b2'], [', ', '#eef1f6'], ['"Silver"', '#2fc4b2'], [')', '#eef1f6']],
];

defineScene({
  id: 's19_ai',
  transitionIn: 'push',
  camera: { zoom: .025 },
  mood: { a: '#3a7bc8', b: '#f5a623', grid: .2, part: .5, glow: 1.05, ax: .2, ay: .3, bx: .82, by: .7 },
  build(root, ctx) {
    const L = i => ctx.line(i), D = ctx.lineEnd(0) - L(0);
    // call i types from c[i].t for c[i].d seconds, then runs at c[i].run
    const cps = [36, 40];
    const c = [{ t: L(0) + .15 }, { t: L(0) + D * .32 }];
    CALLS.forEach((runs, i) => { const n = runs.reduce((a, r) => a + r[0].length, 0); c[i].n = n; c[i].d = n / cps[i]; c[i].run = c[i].t + c[i].d + .12; });
    const T = { keys: L(0) + D * .66, undo: L(0) + D * .76 };
    T.head = Math.min(T.undo + .8, ctx.dur - 2.4);

    const H = headline(root, { x: 120, y: 118, w: 1500, kicker: 'AI assistant · MCP', lines: ['ONE CHANGE. ONE UNDO.'], size: 92 });
    // one continuous gradient across the second statement only ("ONE UNDO.")
    const ws = [...H.lines[0].querySelectorAll('.mask>span')].slice(2);
    const gx0 = ws[0].parentElement.offsetLeft, gw = ws[1].parentElement.offsetLeft + ws[1].parentElement.offsetWidth - gx0;
    ws.forEach(sp => { Object.assign(sp.style, { backgroundImage: 'linear-gradient(90deg,#3a7bc8,#f5a623)', backgroundSize: gw + 'px 100%',
      backgroundPosition: (gx0 - sp.parentElement.offsetLeft) + 'px 0', webkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }); });

    /* ---------------- terminal ---------------- */
    const term = add(root, `<div class="abs" style="left:${TX}px;top:${PY}px;width:${TW}px;height:${TH}px;border-radius:12px;overflow:hidden;
      background:linear-gradient(180deg,#141b26,#0c0d12 60%);border:1px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.2);box-shadow:0 40px 90px rgba(0,0,0,.55)">
      <div class="abs" style="left:0;right:0;top:0;height:${HEAD}px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:12px;padding:0 20px">
        ${icon('robot', 26, '#f5a623')}<span class="disp6" style="font-size:23px">Assistant</span>
        <span class="mono" style="margin-left:auto;display:flex;align-items:center;gap:9px;font-size:17px;color:#9aa3b5;padding:4px 12px;border-radius:6px;border:1px solid rgba(47,196,178,.4)">
        <i style="width:9px;height:9px;border-radius:50%;background:#2fc4b2;box-shadow:0 0 8px #2fc4b2"></i>blender_mcp</span></div></div>`);
    const lines = CALLS.map((runs, i) => {
      const y = HEAD + 50 + i * 92;
      const row = add(term, `<div class="abs mono" style="left:30px;top:${y}px;height:36px;font-size:26px;line-height:36px;white-space:nowrap">` +
        `<span style="color:#f5a623;white-space:pre">&gt; </span><span class="clip" style="display:inline-block;vertical-align:top;overflow:hidden;white-space:pre">` +
        `<span class="full">${runs.map(([t, col]) => `<span style="color:${col}">${t}</span>`).join('')}</span></span>` +
        `<span class="caret abs" style="top:5px;width:14px;height:26px;background:#f5a623"></span>` +
        `<span class="ok abs" style="top:1px;width:34px;height:34px;border-radius:50%;background:#2fc4b2;display:flex;align-items:center;justify-content:center;opacity:0">${icon('check', 20, '#0a0a0c', 3)}</span></div>`);
      const clip = row.querySelector('.clip'), full = row.querySelector('.full'), caret = row.querySelector('.caret'), ok = row.querySelector('.ok');
      const x0 = clip.offsetLeft, W = full.offsetWidth, cw = W / c[i].n;
      ok.style.left = (x0 + W + 18) + 'px';
      return { row, clip, caret, ok, x0, W, cw };
    });
    // after the second call the assistant's session idles on a fresh prompt
    const idle = add(term, `<div class="abs mono" style="left:30px;top:${HEAD + 50 + 2 * 92}px;height:36px;font-size:26px;line-height:36px;white-space:pre;color:#f5a623;opacity:0">&gt; <span class="abs" style="left:40px;top:5px;width:14px;height:26px;background:#f5a623"></span></div>`);
    const idleCaret = idle.querySelector('span');

    /* ---------------- Takes panel: rows + variant preview ---------------- */
    const kp = add(root, `<div class="abs" style="left:${KX}px;top:${PY}px;width:${KW}px;height:${PH}px;border-radius:12px;overflow:hidden;
      background:linear-gradient(180deg,#172537,#0f1016 60%);border:1px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.2);box-shadow:0 40px 90px rgba(0,0,0,.55)">
      <div class="abs" style="left:0;right:0;top:0;height:${HEAD}px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:12px;padding:0 20px">
        ${icon('take', 24, '#9aa3b5')}<span class="disp6" style="font-size:23px">Takes</span></div></div>`);
    const takeRow = (i, name) => add(kp, `<div class="abs" style="left:16px;right:16px;top:${HEAD + 14 + i * 50}px;height:44px;border-radius:7px;display:flex;align-items:center;gap:12px;padding:0 14px">
      ${icon('take', 22, '#c9d1de')}<span class="disp6" style="font-size:22px;white-space:nowrap">${name}</span></div>`);
    const oldTakes = ['Take_001', 'Take_002', 'Take_003'].map((n, i) => takeRow(i, n));
    const newTake = takeRow(3, 'Take_004');
    newTake.style.opacity = 0;
    const stage3 = add(kp, `<div class="abs" style="left:16px;right:16px;top:${HEAD + 226}px;height:${PH - HEAD - 226 - 16}px;border-radius:10px;
      background:radial-gradient(ellipse at 50% 60%,rgba(58,123,200,.16),rgba(8,8,12,.6) 70%);border:1px solid rgba(255,255,255,.07)"></div>`);
    const VW = KW - 32, VH = PH - HEAD - 226 - 16;                  // 468 x 314
    const view = canvas3d(stage3, { x: 0, y: 0, w: VW, h: VH - 56, style: '-webkit-mask-image:linear-gradient(to bottom,transparent,#000 16%,#000 84%,transparent)' });
    const sw = add(stage3, `<div class="abs" style="left:0;right:0;bottom:16px;display:flex;justify-content:center;gap:16px">${['#d9a54e', '#d5dbe4', '#2b2b30'].map(col =>
      `<i style="display:block;width:26px;height:26px;border-radius:50%;background:${col};border:2px solid rgba(255,255,255,.25)"></i>`).join('')}</div>`);
    const swRing = add(stage3, '<div class="abs" style="bottom:10px;left:0;width:38px;height:38px;border-radius:50%;border:3px solid #f5a623;box-shadow:0 0 12px rgba(245,166,35,.6)"></div>');
    const swX = j => VW / 2 - 21 + (j - 1) * 42;                     // ring left for swatch j (26 + 16 gap = 42)

    const scene = R3D.scene();
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
    const cam = R3D.camera(24);

    /* ---------------- Undo History ---------------- */
    const up = add(root, `<div class="abs" style="left:${UX}px;top:${PY}px;width:${UW}px;height:${PH}px;border-radius:12px;overflow:hidden;
      background:linear-gradient(180deg,#172537,#0f1016 60%);border:1px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.2);box-shadow:0 40px 90px rgba(0,0,0,.55)">
      <div class="abs" style="left:0;right:0;top:0;height:${HEAD}px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:12px;padding:0 20px">
        ${icon('undo', 24, '#9aa3b5')}<span class="disp6" style="font-size:23px">Undo History</span></div></div>`);
    const entry = (i, name, muted) => add(up, `<div class="abs" style="left:14px;right:14px;top:${HEAD + 16 + i * 60}px;height:50px;border-radius:8px;display:flex;align-items:center;gap:12px;padding:0 14px;border:1px solid transparent">
      <i style="display:block;width:10px;height:10px;transform:rotate(45deg);background:${muted ? '#6b7385' : '#f5a623'}"></i><span class="disp6" style="font-size:22px;white-space:nowrap;color:${muted ? '#8790a3' : '#eef1f6'}">${name}</span></div>`);
    const eOrig = entry(0, 'Original', true), eTake = entry(1, 'Create Take'), eVar = entry(2, 'Switch Variant');
    const kUpd = keycaps(up, ['Ctrl', 'Z'], { x: 0, y: PH - 120, t0: T.keys, press: T.undo, ctx, scale: .9 });
    const kEl = up.lastChild; kEl.style.left = ((UW - kEl.offsetWidth * .9) / 2) + 'px';

    /* ---------------- sound ---------------- */
    // typing clicks (<= 4/s); each call's check mark and the UI's reaction share one cue
    c.forEach(k => { for (let t = k.t; t < k.t + k.d; t += .3) ctx.cue(t, 'type', { gain: .45, pan: -.4 }); });
    ctx.cue(c[0].run + .05, 'pop', { gain: .65, pitch: 2 });
    ctx.cue(c[1].run + .1, 'shimmer', { gain: .7 });
    ctx.cue(c[0].run + .25, 'blip', { gain: .5, pan: .5 });
    ctx.cue(c[1].run + .3, 'blip', { gain: .5, pan: .5, pitch: 3 });
    ctx.cue(T.undo + .05, 'swish', { gain: .55, pan: .5 });
    ctx.cue(T.head, 'hit', { gain: .5 });

    return lt => {
      H.update(lt, T.head);
      // the kicker labels the scene from the start; the statement lands after the undo settles
      H.el.firstChild.style.opacity = 1; H.el.firstChild.style.transform = 'none';

      /* terminal typing (no DOM churn: a clip reveals the pre-built line) */
      const active = lt >= c[0].run + .1 ? 1 : 0;                     // the line whose prompt currently holds the caret
      lines.forEach((ln, i) => {
        const k = c[i], n = clamp(Math.floor((lt - k.t) * cps[i]), 0, k.n);
        ln.row.style.opacity = i === 0 || lt >= c[i - 1].run + .1 ? 1 : 0;
        ln.clip.style.width = (n * ln.cw) + 'px';
        const blink = n < k.n || Math.floor(lt * 2.4) % 2 === 0;
        ln.caret.style.left = (ln.x0 + n * ln.cw + 2) + 'px';
        ln.caret.style.opacity = i === active && lt < k.run && blink ? 1 : 0;
        pop(ln.ok, lt, k.run, .4, .4);
      });
      idle.style.opacity = lt >= c[1].run + .25 ? 1 : 0;
      idleCaret.style.opacity = Math.floor(lt * 2.4) % 2 === 0 ? 1 : 0;

      /* Takes panel reacts */
      const a = c[0].run + .1;
      pop(newTake, lt, a, .45, .85);
      const sel = lt >= a ? 1 : 0, g = lt >= a ? Math.exp(-(lt - a) * 2.5) : 0;
      newTake.style.background = `rgba(58,123,200,${sel * .42})`; newTake.style.boxShadow = sel ? `inset 0 0 0 1px rgba(120,170,230,.35),0 0 ${g * 26}px rgba(58,123,200,${g * .8})` : 'none';
      const toS = ease.inOut(prog(lt, c[1].run + .12, .7)), back = ease.inOut(prog(lt, T.undo + .05, .7));
      const k = toS * (1 - back);
      paintWatch(watch, 'gold', 'silver', k);
      glowPart(watch, 'case', Math.max(0, Math.sin(Math.PI * clamp(prog(lt, c[1].run + .12, .7)))) + Math.max(0, Math.sin(Math.PI * clamp(prog(lt, T.undo + .05, .7)))) * .7, k > .5 ? '#6aa6ea' : '#f5a623');
      setTime(watch, lt * 8 + 20);
      pivot.rotation.set(-.1, -.5 + Math.sin(lt * .6) * .35, 0);
      cam.position.set(0, .3, 12.6); cam.lookAt(0, 0, 0);
      view.draw(scene, cam);
      swRing.style.left = lerp(swX(0), swX(1), k) + 'px';

      /* Undo History */
      slide(eTake, lt, c[0].run + .25, .5, 40, 0);
      slide(eVar, lt, c[1].run + .3, .5, 40, 0);
      const off = ease.in(prog(lt, T.undo + .05, .35));
      if (lt >= T.undo + .05) { eVar.style.opacity = 1 - off; eVar.style.transform = `translateX(${off * 120}px)`; }
      const cur = lt >= T.undo + .05 ? 1 : lt >= c[1].run + .3 ? 2 : lt >= c[0].run + .25 ? 1 : 0;
      [eOrig, eTake, eVar].forEach((e, i) => {
        const on = i === cur;
        e.style.background = on ? 'rgba(58,123,200,.42)' : 'transparent';
        e.style.borderColor = on ? 'rgba(120,170,230,.4)' : 'transparent';
      });
      kUpd(lt);
    };
  },
});
