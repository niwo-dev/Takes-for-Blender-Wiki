// Variant Switch. Three beats, never text and busy motion at once:
// 1) statement next to the turning product, 2) the variant tree swaps the finish, 3) three shots pick their own state.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, headline, panel, Cursor, pop, slide, canvas3d } from '../ui.js';
import { createWatch, paintWatch, setTime, glowPart, VARIANTS } from '../product3d.js';

const PARTS = [['Case', 'case', 'caseC'], ['Strap', 'strap', 'strap'], ['Dial', 'dial', 'dial']];
const STATES = [['gold', 'Gold'], ['silver', 'Silver'], ['black', 'Matte Black']];

defineScene({
  id: 's08_variants',
  transitionIn: 'zoom',
  camera: { zoom: .025 },
  mood: { a: '#265787', b: '#e87d0d', grid: .25, ax: .15, ay: .3, bx: .75, by: .45, glow: 1.2 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const tHeadOut = L(1) - .45, tPanel = L(1) - .2, tPanelOut = L(2) + .5, tShots = L(2) + .6;
    const H = headline(root, { x: 120, y: 330, w: 760, kicker: 'Variant Switch', lines: ['ONE PRODUCT.', { t: 'EVERY FINISH.', grad: true }], size: 108 });

    // 3D: main product view
    const scene = R3D.scene();
    const watch = createWatch(); const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
    watch.rotation.x = Math.PI / 2;
    const cam = R3D.camera(28);
    const main = canvas3d(root, { x: 780, y: 20, w: 1140, h: 1040 });
    const shadow = el('<div class="abs" style="left:1050px;top:900px;width:600px;height:90px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent)"></div>');
    root.insertBefore(shadow, main.canvas);

    // variant tree panel (beat 2)
    const P = panel(root, { x: 120, y: 250, w: 620, h: 430, title: 'Variant Switch', icon: 'palette' });
    const rowsDef = [
      { d: 0, ic: 'cube', label: 'Watch' },
      ...PARTS.map(([n, key, col]) => ({ d: 1, ic: 'layer', label: n, pool: STATES.map(([v]) => VARIANTS[v][col]), part: key })),
      ...STATES.map(([v, n]) => ({ d: 1, label: n, state: v })),
    ];
    const rows = rowsDef.map((r, i) => {
      const e = el(`<div class="abs" style="left:14px;right:14px;top:${10 + i * 47}px;height:43px;border-radius:6px;display:flex;align-items:center;gap:12px;padding-left:${12 + r.d * 34}px">
        <div class="ico">${r.state ? '<div class="sd"></div>' : icon(r.ic, 22, '#c9d1de')}</div>
        <div class="disp6" style="font-size:24px;white-space:nowrap">${r.label}</div>
        <div style="margin-left:auto;display:flex;gap:8px;padding-right:12px">${r.pool ? r.pool.map(c => `<i style="display:block;width:22px;height:22px;border-radius:50%;background:${c};border:2px solid rgba(255,255,255,.25)"></i>`).join('') : ''}</div></div>`);
      P.body.appendChild(e); return e;
    });

    const tParts = [L(1) + .15, L(1) + .65, L(1) + 1.15];
    const tStates = L(1) + 1.6;
    const tSilver = L(1) + 2.6, tBlack = L(2) + 3.0;
    tParts.forEach((t, k) => ctx.cue(t, 'tick', { gain: .6, pitch: k * 3 }));
    STATES.forEach((_, k) => ctx.cue(tStates + k * .12, 'pop', { gain: .5, pitch: k * 2 }));
    ctx.cue(tSilver + .05, 'shimmer', { gain: .8 }); ctx.cue(tSilver + .1, 'chime', { gain: .6 });
    ctx.cue(tBlack + .05, 'shimmer', { gain: .6 });
    const stateAt = lt => lt < tSilver ? ['gold', 'gold', 0] : lt < tBlack ? ['gold', 'silver', ease.inOut(prog(lt, tSilver, .8))] : ['silver', 'black', ease.inOut(prog(lt, tBlack, .8))];

    const cursor = new Cursor(root, ctx, [
      { t: tSilver - 1.1, x: 900, y: 1040 }, { t: tSilver, x: 330, y: 250 + 54 + 10 + 5 * 47 + 22, click: true }, { t: tSilver + 1.0, x: 60, y: 1060 }], { hideAt: tSilver + .8 });

    // beat 3: three shots, each picking its own state from the same object
    const SH = [['gold', [0, 3, 11.5], .5], ['silver', [-3.2, 2.6, 10.5], .75], ['black', [3.2, 1.4, 5.4], -.4]];
    const CW = 520, GAP = 40, CX0 = (1920 - (3 * CW + 2 * GAP)) / 2;
    const cards = SH.map(([v], k) => {
      const c = el(`<div class="glass abs" style="left:${CX0 + k * (CW + GAP)}px;top:270px;width:${CW}px;height:420px;overflow:hidden">
        <div class="abs" style="left:0;right:0;bottom:18px;text-align:center"><span class="chip" style="font-size:20px;padding:5px 14px;border-color:${VARIANTS[v].accent};color:${VARIANTS[v].accent}">${VARIANTS[v].name}</span></div></div>`);
      root.appendChild(c);
      return { c, cv: canvas3d(c, { x: 0, y: 0, w: CW, h: 340 }) };
    });
    const shotCam = R3D.camera(30);
    const zeroWrap = el(`<div class="abs" style="left:0;right:0;top:756px;text-align:center"><div class="chip" style="border-color:#f5a623;color:#f5a623;font-size:21px;opacity:0">0 DUPLICATES</div></div>`);
    root.appendChild(zeroWrap); const zero = zeroWrap.firstChild;
    const tZero = tShots + 1.6; ctx.cue(tZero, 'pop', { gain: .6, pitch: 5 });

    return lt => {
      // beat 1: statement, then it clears
      H.update(lt, .1);
      const ho = ease.inOut(prog(lt, tHeadOut, .45)); H.el.style.opacity = 1 - ho; H.el.style.transform = `translateX(${-ho * 50}px)`;
      // beat 2: panel
      const pin = ease.expo(prog(lt, tPanel, .8)), pout = ease.inOut(prog(lt, tPanelOut, .5));
      P.el.style.opacity = prog(lt, tPanel, .35) * (1 - pout); P.el.style.transform = `translateY(${(1 - pin) * 60 - pout * 40}px)`;
      rows.forEach((r, i) => slide(r, lt, i < 4 ? tPanel + .2 + i * .07 : tStates + (i - 4) * .12, .5, -30, 0));
      const [a, b, k] = stateAt(lt), activeIdx = STATES.findIndex(s => s[0] === (k < .5 ? a : b));
      rows.forEach((r, i) => {
        const d = rowsDef[i]; let hl = 0;
        if (d.part) { const t = tParts[PARTS.findIndex(p => p[1] === d.part)]; hl = Math.max(0, 1 - Math.abs(lt - t - .3) / .55); }
        if (d.state) {
          const on = STATES[activeIdx][0] === d.state;
          r.querySelector('.sd').style.cssText = on ? 'width:18px;height:18px;border-radius:50%;background:#f5a623;box-shadow:0 0 12px #f5a623' : 'width:15px;height:15px;transform:rotate(45deg);border:2px solid #9aa3b5';
          hl = on ? .55 : 0;
        }
        r.style.background = `rgba(58,123,200,${hl * .45})`;
      });

      // main product
      paintWatch(watch, a, b, k); setTime(watch, lt * 8 + 40);
      PARTS.forEach(([, key], j) => glowPart(watch, key, Math.max(0, 1 - Math.abs(lt - tParts[j] - .3) / .55)));
      const enter = ease.expo(prog(lt, 0, 1.4)), shrink = ease.inOut(prog(lt, tPanelOut, 1.0));
      pivot.rotation.set(-.12 + (1 - enter) * .6, -.55 + Math.sin(lt * .45) * .45 + (1 - enter) * 1.5, 0);
      pivot.position.set(0, lerp(0, 1.55, shrink) - (1 - enter) * 3, 0);
      const sweep = Math.max(0, 1 - Math.abs(lt - tSilver - .4) / .5) + Math.max(0, 1 - Math.abs(lt - tBlack - .4) / .5);
      scene.userData.lights.key.intensity = 1.4 + sweep * 2.2; scene.userData.lights.key.position.set(-4 + sweep * 8, 8, 6);
      cam.position.set(0, .4, lerp(12.5, 18.5, shrink)); cam.lookAt(0, lerp(0, .3, shrink), 0);
      main.canvas.style.opacity = 1 - shrink; main.canvas.style.transform = `scale(${1 + shrink * .15})`;
      if (shrink < 1) main.draw(scene, cam);
      shadow.style.opacity = (1 - shrink) * enter;

      // shots
      cards.forEach(({ c, cv }, j) => {
        const q = prog(lt, tShots + .35 + j * .18, .6), kk = ease.expo(q);
        c.style.opacity = clamp(q * 3); c.style.transform = `translateY(${(1 - kk) * 60}px)`;
        if (q <= 0) return;
        const [v, pos, spin] = SH[j];
        paintWatch(watch, v, v, 0);
        const saved = pivot.rotation.clone(), savedP = pivot.position.clone();
        pivot.rotation.set(0, spin + Math.sin(lt * .5 + j) * .15, 0); pivot.position.set(0, 0, 0);
        shotCam.position.set(...pos); shotCam.lookAt(j === 2 ? 1.2 : 0, j === 2 ? .3 : 0, 0);
        cv.draw(scene, shotCam);
        pivot.rotation.copy(saved); pivot.position.copy(savedP);
      });
      pop(zero, lt, tZero, .5, .7);
      cursor.update(lt);
    };
  },
});
