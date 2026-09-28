// Parent State: a take inherits its parent's keys per value. The take keys only the float (blue, its own);
// the parent View Layer's action spins the watch (pink, inherited). Flipping Inherit Parent Keys on adds the spin.
// Text rules: labels only in the panel; one headline lands at the end in its own zone.
import { defineScene, el, ease, prog, clamp, lerp, R3D, THREE } from '../engine.js';
import { icon, headline, panel, Cursor, pop, slide, canvas3d } from '../ui.js';
import { createWatch, paintWatch, setTime } from '../product3d.js';

const PINK = '#e0569a', BLUE = '#3a7bc8';
const PX = 1010, PY = 360, PW = 810, PH = 410, BODY = 54;

function lane(color, kind) {
  // a mini f-curve lane: 'spin' = linear ramp per loop, 'float' = sine
  const W = 520, H = 40, pts = [];
  for (let k = 0; k <= 60; k++) {
    const x = k / 60 * W;
    const y = H / 2 - Math.sin(k / 60 * Math.PI * (kind === 'turn' ? 2 : 4)) * (H / 2 - 6);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const keysX = kind === 'turn' ? [0, 130, 260, 390, 520] : [0, 65, 130, 195, 260, 325, 390, 455, 520];
  return `<svg width="${W}" height="${H}" style="overflow:visible;display:block">
    <line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}" stroke="rgba(255,255,255,.06)" stroke-width="2"/>
    <polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" opacity=".9"/>
    ${keysX.map(x => `<rect x="${x - 6}" y="${H / 2 - 6}" width="12" height="12" transform="rotate(45 ${x} ${H / 2})" fill="#0f1016" stroke="${color}" stroke-width="2.5"/>`).join('')}
    <line class="ph" x1="0" y1="-4" x2="0" y2="${H + 4}" stroke="#eef1f6" stroke-width="2" opacity=".75"/></svg>`;
}

defineScene({
  id: 's09b_parent',
  transitionIn: 'zoom',
  camera: { zoom: .03 },
  mood: { a: '#3a7bc8', b: PINK, grid: .3, ax: .2, ay: .35, bx: .8, by: .7, glow: 1.1 },
  build(root, ctx) {
    const L = i => ctx.line(i);
    const tToggle = L(0) + 1.7, tOwn = L(1) + .15, tInh = L(1) + 1.55, tHead = ctx.lineEnd(1) + .35;

    // 3D watch, left half
    const scene = R3D.scene();
    const watch = createWatch(); watch.rotation.x = Math.PI / 2;
    const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
    paintWatch(watch, 'silver', 'silver', 0);
    const cam = R3D.camera(28);
    const view = canvas3d(root, { x: 60, y: 60, w: 900, h: 960 });

    // spin ring (inherited, pink) and float arrow (own keys, blue) around the product
    const ov = el(`<svg class="abs" width="900" height="960" style="left:60px;top:60px;overflow:visible">
      <ellipse class="ring" cx="450" cy="470" rx="330" ry="70" fill="none" stroke="${PINK}" stroke-width="4" stroke-dasharray="26 18" opacity="0"/>
      <path class="ringHead" d="M 772 455 l 18 22 l -26 6 z" fill="${PINK}" opacity="0"/>
      <g class="arrow" opacity="0"><line x1="835" y1="330" x2="835" y2="610" stroke="${BLUE}" stroke-width="4" stroke-linecap="round"/>
        <path d="M 835 312 l -14 22 h 28 z M 835 628 l -14 -22 h 28 z" fill="${BLUE}"/></g></svg>`);
    root.appendChild(ov);
    const ring = ov.querySelector('.ring'), ringHead = ov.querySelector('.ringHead'), arrow = ov.querySelector('.arrow');

    // tier panel, right
    const P = panel(root, { x: PX, y: PY, w: PW, h: PH, title: 'Parent State', icon: 'layers' });
    const rowA = el(`<div class="abs" style="left:16px;right:16px;top:16px;height:104px;border-radius:8px;border:1px solid rgba(255,255,255,.06);background:rgba(10,10,14,.4)">
      <div class="abs" style="left:14px;top:14px">${icon('layer', 26, '#c9d1de')}</div>
      <div class="abs disp6" style="left:52px;top:12px;font-size:26px">Front 3/4</div>
      <div class="abs chip" style="right:14px;top:10px;font-size:19px;padding:4px 12px;border-color:${PINK};color:${PINK}">${icon('action', 20, PINK)}Hero_Turn</div>
      <div class="abs laneA" style="left:52px;top:56px">${lane(PINK, 'turn')}</div></div>`);
    const rowB = el(`<div class="abs" style="left:56px;right:16px;top:136px;height:104px;border-radius:8px;border:1px solid rgba(255,255,255,.06);background:rgba(10,10,14,.4)">
      <div class="abs" style="left:14px;top:14px">${icon('take', 26, '#c9d1de')}</div>
      <div class="abs disp6" style="left:52px;top:12px;font-size:26px">Take 2</div>
      <div class="abs chip" style="right:14px;top:10px;font-size:19px;padding:4px 12px;border-color:${BLUE};color:${BLUE}">${icon('action', 20, BLUE)}Float</div>
      <div class="abs laneB" style="left:52px;top:56px">${lane(BLUE, 'float')}</div></div>`);
    const link = el(`<svg class="abs" width="60" height="140" style="left:0;top:60px;overflow:visible">
      <path class="lk" d="M 34 10 C 34 70, 34 90, 56 124" fill="none" stroke="${PINK}" stroke-width="3" stroke-dasharray="7 9" opacity=".15"/></svg>`);
    const tog = el(`<div class="abs" style="left:16px;right:16px;top:262px;height:62px;display:flex;align-items:center;gap:16px;padding:0 14px">
      <div style="font-size:23px;color:#c9d1de;white-space:nowrap">Inherit Parent Keys</div>
      <div style="margin-left:auto;display:flex;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.14)">
        ${['Off', 'Auto', 'On'].map(s => `<div class="seg" data-s="${s}" style="font-family:var(--mono);font-size:19px;padding:9px 18px;color:#9aa3b5">${s}</div>`).join('')}</div></div>`);
    P.body.append(link, rowA, rowB, tog);
    const segs = [...tog.querySelectorAll('.seg')], lk = link.querySelector('.lk');
    const phA = rowA.querySelector('.ph'), phB = rowB.querySelector('.ph');
    const ON_X = PX + PW - 16 - 14 - 34, ON_Y = PY + BODY + 262 + 31;   // centre of the "On" segment (stage px)

    const H = headline(root, { x: PX, y: 150, w: PW, lines: ['INHERIT.', { t: "DON'T COPY.", grad: true }], size: 88 });
    const cursor = new Cursor(root, ctx, [
      { t: tToggle - 1.1, x: 1500, y: 1010 }, { t: tToggle, x: ON_X, y: ON_Y + 6, click: true }, { t: tToggle + 1.0, x: 1860, y: 1030 }],
      { hideAt: tToggle + .8, ripple: 46 });

    ctx.cue(.25, 'pop', { gain: .5 });
    ctx.cue(tToggle + .15, 'shimmer', { gain: .7 });
    ctx.cue(tOwn, 'tick', { gain: .55, pitch: 2 });
    ctx.cue(tInh, 'tick', { gain: .55, pitch: 7 });
    ctx.cue(tHead, 'chime', { gain: .5 });

    const spinAngle = lt => {           // inherited turntable swing fades in after the toggle; never shows the caseback
      const d = lt - tToggle;
      if (d <= 0) return 0;
      return .85 * ease.out(clamp(d / .8)) * Math.sin(d * 1.6);
    };

    return lt => {
      // panel + rows in
      const pin = ease.expo(prog(lt, .05, .8));
      P.el.style.opacity = prog(lt, .05, .3); P.el.style.transform = `translateX(${(1 - pin) * 90}px)`;
      slide(rowA, lt, .25, .55, 40, 0); slide(rowB, lt, .38, .55, 40, 0); slide(tog, lt, .5, .55, 40, 0);

      // toggle state
      const on = lt >= tToggle;
      segs.forEach((s, k) => {
        const active = on ? k === 2 : k === 0;
        s.style.background = active ? (on ? PINK : 'rgba(255,255,255,.12)') : 'transparent';
        s.style.color = active ? '#fff' : '#9aa3b5';
      });
      const flash = on ? Math.exp(-(lt - tToggle) * 4) : 0;
      tog.style.boxShadow = flash > .02 ? `0 0 ${30 * flash}px rgba(224,86,154,${.6 * flash})` : 'none';
      lk.style.opacity = on ? .35 + .65 * ease.out(prog(lt, tToggle, .5)) : .15;
      lk.style.strokeDashoffset = -lt * 40;

      // highlights synced to "its own" / "the tier above"
      const hB = Math.max(0, 1 - Math.abs(lt - tOwn - .35) / .6), hA = Math.max(0, 1 - Math.abs(lt - tInh - .35) / .6);
      rowB.style.background = `rgba(58,123,200,${.08 + hB * .32})`; rowB.style.borderColor = hB > .05 ? BLUE : 'rgba(255,255,255,.06)';
      rowA.style.background = `rgba(224,86,154,${(on ? .06 : 0) + hA * .3})`; rowA.style.borderColor = hA > .05 ? PINK : 'rgba(255,255,255,.06)';

      // playheads loop over the lanes
      const x = ((lt / 3.2) % 1) * 520;
      phB.setAttribute('x1', x); phB.setAttribute('x2', x);
      phA.setAttribute('x1', on ? x : 0); phA.setAttribute('x2', on ? x : 0); phA.style.opacity = on ? .75 : .2;

      // the product: floats from its own keys, spins only when inheriting
      const fl = Math.sin(lt / 3.2 * Math.PI * 4) * .32;
      pivot.position.set(0, fl, 0);
      pivot.rotation.set(-.12, -.35 + spinAngle(lt), 0);
      setTime(watch, lt * 6 + 30);
      cam.position.set(0, .5, 14.5); cam.lookAt(0, .1, 0);
      view.draw(scene, cam);

      // overlays
      const ringK = on ? ease.out(prog(lt, tToggle, .6)) : 0;
      ring.style.opacity = ringK * (.55 + hA * .45); ringHead.style.opacity = ringK * (.7 + hA * .3);
      ring.style.strokeDashoffset = -lt * 70;
      arrow.style.opacity = ease.out(prog(lt, .6, .5)) * (.55 + hB * .45);
      arrow.setAttribute('transform', `translate(0 ${-fl * 55})`);

      // closing statement once everything has settled
      H.update(lt, tHead);
      cursor.update(lt);
    };
  },
});
