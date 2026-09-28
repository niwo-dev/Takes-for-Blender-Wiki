// Timeline engine for the long promo: deterministic renderAt(T), overlapping transitions,
// per-scene camera drift, global background, chapter HUD, SFX cue export and a 3D bridge.
import { THREE, makeRenderer, makeStudioScene } from './product3d.js';

export const W = 1920, H = 1080;
export const TL = window.TL;

/* ---------------- math & easing ---------------- */
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const prog = (t, s, d) => clamp((t - s) / Math.max(d, 1e-6));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = x => x * x * (3 - 2 * x);
export const ease = {
  out: x => 1 - Math.pow(1 - x, 3),
  out4: x => 1 - Math.pow(1 - x, 4),
  expo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  back: x => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  inOut: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  in: x => x * x * x,
  sine: x => -(Math.cos(Math.PI * x) - 1) / 2,
  elastic: x => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI) / 3) + 1,
};
// animate a value between keyframes [[t, v, easeName?], ...] (t in scene-local seconds)
export function keys(t, kf) {
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++) {
    if (t <= kf[i][0]) {
      const [t0, v0] = kf[i - 1], [t1, v1, e] = kf[i];
      const k = (ease[e || 'inOut'])((t - t0) / (t1 - t0));
      return Array.isArray(v0) ? v0.map((a, j) => lerp(a, v1[j], k)) : lerp(v0, v1, k);
    }
  }
  return kf[kf.length - 1][1];
}
export const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
export const mixHex = (a, b, k) => { const A = hex2rgb(a), B = hex2rgb(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',') + ')'; };
export const rgba = (h, a) => 'rgba(' + hex2rgb(h).join(',') + ',' + a + ')';
export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const el = html => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

/* ---------------- 3D bridge ---------------- */
// One hidden WebGL renderer; scenes render into their own 2D canvases through it.
export const R3D = {
  _r: null,
  get r() { if (!this._r) this._r = makeRenderer(W, H); return this._r; },
  scene(opts) { return makeStudioScene(this.r, opts); },
  camera(fov = 30, aspect = 16 / 9) { return new THREE.PerspectiveCamera(fov, aspect, .1, 300); },
  draw(canvas, scene, camera) {
    const r = this.r, w = canvas.width, h = canvas.height;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    r.setViewport(0, 0, w, h); r.setScissor(0, 0, w, h); r.setScissorTest(true);
    r.setClearColor(0x000000, 0); r.clear();
    r.render(scene, camera);
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, w, h);
    c.drawImage(r.domElement, 0, H - h, w, h, 0, 0, w, h);
  },
};
export { THREE };

/* ---------------- scene registry & context ---------------- */
const DEFS = {};
export function defineScene(def) { DEFS[def.id] = def; return def; }
export const CUES = [];

class Ctx {
  constructor(entry) { Object.assign(this, { id: entry.id, start: entry.start, dur: entry.dur, lines: entry.lines, chapter: entry.chapter, entry }); }
  line(i) { return this.lines[i] ? this.lines[i].t : this.dur * (i + 1) / (this.lines.length + 1); }
  lineEnd(i) { return this.lines[i] ? this.lines[i].t + this.lines[i].dur : this.dur; }
  cue(t, name, o = {}) { CUES.push({ t: +(this.start + t).toFixed(4), name, gain: o.gain ?? 1, pan: o.pan ?? 0, pitch: o.pitch ?? 0, scene: this.id }); }
}

/* ---------------- transitions ---------------- */
// apply(out, in, p, fx): p runs 0..1 across the overlap; the boundary itself is p = .5
const reset = s => { s.style.opacity = 1; s.style.transform = 'none'; s.style.clipPath = 'none'; s.style.filter = 'none'; s.style.webkitMaskImage = 'none'; s.style.zIndex = 1; };
export const TRANS = {
  cut: { d: 0, apply() {}, cues: () => [] },
  fade: { d: .8, apply(o, i, p) { i.style.opacity = ease.sine(p); i.style.zIndex = 2; }, cues: () => [] },
  zoom: { d: .8, apply(o, i, p) {
      const a = ease.in(clamp(p * 1.25)), b = ease.out(clamp(p * 1.4 - .4));
      o.style.transform = `scale(${1 + a * .28})`; o.style.opacity = 1 - clamp((p - .25) / .45); o.style.filter = `blur(${a * 14}px)`;
      i.style.transform = `scale(${.86 + b * .14})`; i.style.opacity = clamp((p - .3) / .45); i.style.filter = `blur(${(1 - b) * 12}px)`; i.style.zIndex = 2;
    }, cues: (b) => [[b - .45, 'whoosh', { gain: .8 }], [b + .02, 'thud', { gain: .6 }]] },
  push: { d: .75, apply(o, i, p) {
      const e = ease.inOut(p);
      o.style.transform = `translateX(${-e * 1920}px)`; o.style.filter = `blur(${Math.sin(p * Math.PI) * 6}px)`;
      i.style.transform = `translateX(${(1 - e) * 1920}px)`; i.style.filter = `blur(${Math.sin(p * Math.PI) * 6}px)`; i.style.zIndex = 2;
    }, cues: (b) => [[b - .4, 'swish', { gain: .9, pan: .3 }]] },
  pushUp: { d: .75, apply(o, i, p) {
      const e = ease.inOut(p);
      o.style.transform = `translateY(${-e * 1080}px)`; o.style.filter = `blur(${Math.sin(p * Math.PI) * 5}px)`;
      i.style.transform = `translateY(${(1 - e) * 1080}px)`; i.style.filter = `blur(${Math.sin(p * Math.PI) * 5}px)`; i.style.zIndex = 2;
    }, cues: (b) => [[b - .4, 'swish', { gain: .9 }]] },
  iris: { d: .9, apply(o, i, p) {
      const e = ease.inOut(p);
      o.style.transform = `scale(${1 - e * .06})`; o.style.filter = `brightness(${1 - e * .5})`;
      i.style.clipPath = `circle(${e * 1150}px at 50% 50%)`; i.style.zIndex = 2;
    }, cues: (b) => [[b - .5, 'whoosh', { gain: .7 }]] },
  blinds: { d: .9, apply(o, i, p) {
      const e = ease.inOut(p), w = e * 121;
      i.style.webkitMaskImage = `repeating-linear-gradient(100deg,#000 0px,#000 ${w}px,transparent ${w}px,transparent 120px)`; i.style.zIndex = 2;
      o.style.transform = `translateX(${-e * 60}px)`;
    }, cues: (b) => [[b - .45, 'swish', { gain: .7, pan: -.2 }], [b + .1, 'tick', { gain: .5 }]] },
  wipe: { d: 1.0, apply(o, i, p, fx) {
      const bars = fx.bars; const span = 1920 + 2700 + 600;
      bars.forEach((b, k) => { const q = clamp(p * 1.15 - k * .075); b.style.left = (-2700 + ease.inOut(q) * span) + 'px'; });
      o.style.visibility = p < .5 ? 'visible' : 'hidden'; i.style.visibility = p >= .5 ? 'visible' : 'hidden';
    }, cues: (b) => [[b - .5, 'whoosh', { gain: .9 }], [b, 'thud', { gain: .5 }]] },
  flash: { d: .5, apply(o, i, p, fx) {
      fx.flash.style.opacity = Math.pow(Math.sin(p * Math.PI), 1.5);
      o.style.visibility = p < .5 ? 'visible' : 'hidden'; i.style.visibility = p >= .5 ? 'visible' : 'hidden';
      i.style.transform = `scale(${1 + (1 - clamp((p - .5) * 2)) * .05})`;
    }, cues: (b) => [[b - .03, 'hit', { gain: 1 }]] },
  slam: { d: .6, apply(o, i, p, fx) {   // into a chapter card: orange panel slams across
      const bars = fx.bars;
      bars.forEach((b, k) => { const q = clamp(p * 1.1 - k * .05); b.style.left = (-2700 + ease.expo(q) * (2700 + 1920 + 700)) + 'px'; });
      o.style.visibility = p < .45 ? 'visible' : 'hidden'; i.style.visibility = p >= .45 ? 'visible' : 'hidden';
    }, cues: (b) => [[b - .3, 'whoosh', { gain: .8 }], [b, 'hit', { gain: 1 }]] },
};

/* ---------------- background ---------------- */
const MOOD0 = { a: '#3a7bc8', b: '#e87d0d', ax: .22, ay: .2, bx: .82, by: .86, grid: .5, part: 1, glow: 1 };
function buildBackground(root) {
  const bg = el(`<div class="layer" id="bg">
    <div class="abs" id="gA" style="width:1500px;height:1500px;left:-750px;top:-750px"></div>
    <div class="abs" id="gB" style="width:1700px;height:1700px;left:-850px;top:-850px"></div>
    <div class="abs" id="floor" style="left:-600px;top:560px;width:3120px;height:1300px;transform:perspective(900px) rotateX(66deg);transform-origin:50% 0;
      -webkit-mask-image:linear-gradient(to bottom,#000,transparent 85%)"><div id="grid" class="layer" style="background-image:linear-gradient(rgba(58,123,200,.34) 2px,transparent 2px),linear-gradient(90deg,rgba(58,123,200,.34) 2px,transparent 2px);background-size:120px 120px"></div></div>
    <canvas id="parts" width="1920" height="1080" class="abs" style="left:0;top:0"></canvas></div>`);
  root.appendChild(bg);
  const r = rng(7), P = [];
  for (let k = 0; k < 70; k++) P.push({ x: r() * W, y: r() * H, s: 2 + r() * 7, vx: (r() - .5) * 14, vy: -6 - r() * 16, a: .08 + r() * .3, ph: r() * 6.28, hue: r() < .5 ? '#f5a623' : '#6aa6ea' });
  const cv = bg.querySelector('#parts'), cx = cv.getContext('2d');
  const sprites = {};
  for (const hue of ['#f5a623', '#6aa6ea']) {
    const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, rgba(hue, 1)); gr.addColorStop(.4, rgba(hue, .35)); gr.addColorStop(1, rgba(hue, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); sprites[hue] = s;
  }
  const gA = bg.querySelector('#gA'), gB = bg.querySelector('#gB'), grid = bg.querySelector('#grid'), floor = bg.querySelector('#floor');
  return (T, m) => {
    const ax = m.ax * W + Math.sin(T * .31) * 90, ay = m.ay * H + Math.cos(T * .27) * 70;
    const bx = m.bx * W + Math.cos(T * .23) * 110, by = m.by * H + Math.sin(T * .29) * 80;
    gA.style.transform = `translate(${ax}px,${ay}px)`; gB.style.transform = `translate(${bx}px,${by}px)`;
    gA.style.background = `radial-gradient(closest-side,${m.aC.replace('rgb', 'rgba').replace(')', ',' + .30 * m.glow + ')')},transparent)`;
    gB.style.background = `radial-gradient(closest-side,${m.bC.replace('rgb', 'rgba').replace(')', ',' + .24 * m.glow + ')')},transparent)`;
    floor.style.opacity = m.grid; grid.style.backgroundPosition = `0 ${(T * 60) % 120}px`;
    cx.clearRect(0, 0, W, H);
    if (m.part > .01) for (const p of P) {
      const x = ((p.x + p.vx * T) % W + W) % W, y = ((p.y + p.vy * T) % H + H) % H;
      const a = p.a * m.part * (.6 + .4 * Math.sin(T * 1.3 + p.ph));
      cx.globalAlpha = a; const s = p.s * 4; cx.drawImage(sprites[p.hue], x - s / 2, y - s / 2, s, s);
    }
    cx.globalAlpha = 1;
  };
}
function moodOf(def) {
  const m = Object.assign({}, MOOD0, def.mood || {});
  m.aC = mixHex(m.a, m.a, 0); m.bC = mixHex(m.b, m.b, 0);
  return m;
}
function blendMood(A, B, k) {
  const m = {};
  for (const key of ['ax', 'ay', 'bx', 'by', 'grid', 'part', 'glow']) m[key] = lerp(A[key], B[key], k);
  m.aC = mixHex(A.a, B.a, k); m.bC = mixHex(A.b, B.b, k);
  return m;
}

/* ---------------- HUD (chapter tag + progress rail) ---------------- */
function buildHud(root) {
  const hud = el(`<div id="hud"><div id="chapTag"></div><div id="rail">${TL.chapters.map(c => `<div><span>${String(c.n).padStart(2, '0')} ${c.title}</span><i></i></div>`).join('')}</div></div>`);
  root.appendChild(hud);
  const tag = hud.querySelector('#chapTag'), segs = [...hud.querySelectorAll('#rail>div')];
  const chapEnd = TL.chapters.map((c, i) => i + 1 < TL.chapters.length ? TL.chapters[i + 1].start : TL.total);
  return (T, vis) => {
    hud.style.opacity = vis;
    let ci = 0; TL.chapters.forEach((c, i) => { if (T >= c.start) ci = i; });
    const c = TL.chapters[ci];
    tag.innerHTML = `<b>${String(c.n).padStart(2, '0')}</b> &nbsp;/&nbsp; 0${TL.chapters.length} &nbsp;·&nbsp; ${c.title.toUpperCase()}`;
    segs.forEach((s, i) => {
      const f = clamp((T - TL.chapters[i].start) / (chapEnd[i] - TL.chapters[i].start));
      s.querySelector('i').style.width = (f * 100) + '%';
      s.querySelector('span').style.color = i === ci ? 'var(--o2)' : 'var(--dim)';
      s.querySelector('span').style.opacity = i === ci ? 1 : .7;
    });
  };
}

/* ---------------- boot ---------------- */
const S = [];  // runtime scenes
let bgUpdate, hudUpdate, fx;
export async function boot(root) {
  bgUpdate = buildBackground(root);
  const host = el('<div class="layer" id="scenes"></div>'); root.appendChild(host);
  root.appendChild(el('<div id="vignette"></div>'));
  hudUpdate = buildHud(root);
  const fxEl = el(`<div id="fx"><div class="bar" style="background:var(--b2)"></div><div class="bar" style="background:var(--o)"></div><div class="bar" style="background:#0d0d11"></div><div class="flash"></div></div>`);
  root.appendChild(fxEl);
  fx = { el: fxEl, bars: [...fxEl.querySelectorAll('.bar')], flash: fxEl.querySelector('.flash') };
  for (const entry of TL.scenes) {
    const def = DEFS[entry.id] || (entry.card ? DEFS.__card : null);
    if (!def) { console.warn('missing scene', entry.id); continue; }
    const sc = el('<div class="scene"><div class="cam"></div></div>'); host.appendChild(sc);
    const ctx = new Ctx(entry);
    const cam = sc.firstChild;
    let update;
    try { update = await def.build(cam, ctx); }
    catch (e) {
      console.error(`scene ${entry.id} build failed: ${e.message}\n${e.stack}`);
      cam.innerHTML = `<div class="abs mono" style="left:120px;top:160px;font-size:28px;color:#e5484d">${entry.id}: build failed — ${e.message}</div>`;
      update = () => {};
    }
    const safe = update, errs = new Set();
    update = lt => { try { safe(lt); } catch (e) { if (!errs.has(e.message)) { errs.add(e.message); console.error(`scene ${entry.id} update failed at ${lt.toFixed(2)}: ${e.message}\n${e.stack}`); } } };
    S.push({ entry, def, el: sc, cam, ctx, update, mood: moodOf(def), trans: TRANS[def.transitionIn || 'zoom'] ? (def.transitionIn || 'zoom') : 'zoom' });
  }
  S[0].trans = 'cut';
  // transition cues
  S.forEach((s, i) => { if (i === 0) return; for (const [t, name, o] of TRANS[s.trans].cues(s.entry.start)) CUES.push({ t: +t.toFixed(4), name, gain: o?.gain ?? 1, pan: o?.pan ?? 0, pitch: 0, scene: 'transition' }); });
  CUES.sort((a, b) => a.t - b.t);
}

export function renderAt(T) {
  T = clamp(T, 0, TL.total - 1e-4);
  const active = [];
  S.forEach((s, i) => {
    const dIn = i ? TRANS[s.trans].d : 0, dOut = S[i + 1] ? TRANS[S[i + 1].trans].d : 0;
    const from = s.entry.start - dIn / 2, to = s.entry.start + s.entry.dur + dOut / 2;
    if (T >= from && T < to) active.push(i); else s.el.style.visibility = 'hidden';
  });
  for (const i of active) {
    const s = S[i], lt = T - s.entry.start;
    reset(s.el); s.el.style.visibility = 'visible';
    const cam = s.def.camera === false ? null : Object.assign({ zoom: .035, x: 0, y: 0 }, s.def.camera || {});
    if (cam) {
      const k = ease.sine(clamp(lt / s.entry.dur));
      s.cam.style.transform = `translate(${cam.x * k}px,${cam.y * k}px) scale(${1 + cam.zoom * k})`;
    }
    s.update(lt);
  }
  // transitions
  fx.bars.forEach(b => b.style.left = '-2700px'); fx.flash.style.opacity = 0;
  let mood = S[active[0]].mood;
  for (let i = 1; i < S.length; i++) {
    const s = S[i], d = TRANS[s.trans].d, b = s.entry.start;
    if (d > 0 && T >= b - d / 2 && T < b + d / 2) {
      const p = (T - (b - d / 2)) / d;
      TRANS[s.trans].apply(S[i - 1].el, s.el, p, fx);
      mood = blendMood(S[i - 1].mood, s.mood, ease.inOut(p));
    }
  }
  if (active.length === 1) mood = S[active[0]].mood;
  bgUpdate(T, mood);
  const ci = active[active.length - 1], cur = S[ci];
  const lt = T - cur.entry.start, prevOn = ci > 0 && hudOn(S[ci - 1]);
  const vis = hudOn(cur) ? (prevOn ? 1 : clamp((lt - .4) / .6)) : (prevOn ? 1 - clamp(lt / .3) : 0);
  hudUpdate(T, vis);
}
const hudOn = s => !(s.entry.chapter === 1 || s.entry.card || s.entry.id === 's20_outro');

// card scene shared by every chapter start
defineScene({
  id: '__card', transitionIn: 'slam', camera: { zoom: .06 }, mood: { a: '#265787', b: '#e87d0d', grid: .15, part: .6, glow: 1.3, ax: .3, ay: .5, bx: .7, by: .5 },
  build(root, ctx) {
    const n = String(ctx.chapter).padStart(2, '0');
    const card = el(`<div class="layer">
      <div class="abs disp outline" style="left:0;right:0;top:120px;text-align:center;font-size:640px;line-height:1">${n}</div>
      <div class="abs kicker" style="left:0;right:0;top:390px;text-align:center;font-size:28px">Chapter ${n}</div>
      <div class="abs disp" style="left:0;right:0;top:440px;text-align:center;font-size:150px;white-space:nowrap"><span class="mask"><span class="grad">${ctx.entry.title}</span></span></div>
      <div class="abs" style="left:50%;top:660px;height:4px;width:0;transform:translateX(-50%);background:linear-gradient(90deg,var(--b2),var(--o2));border-radius:2px"></div>
    </div>`);
    root.appendChild(card);
    const big = card.children[0], kick = card.children[1], title = card.children[2].querySelector('.mask>span'), rule = card.children[3];
    return lt => {
      big.style.transform = `scale(${1.25 - ease.expo(prog(lt, 0, 1.2)) * .25})`; big.style.opacity = ease.out(prog(lt, 0, .5));
      kick.style.opacity = ease.out(prog(lt, .15, .4)); kick.style.letterSpacing = (.22 + (1 - ease.expo(prog(lt, .15, .8))) * .3) + 'em';
      title.style.transform = `translateY(${(1 - ease.expo(prog(lt, .12, .7))) * 110}%)`;
      rule.style.width = (ease.expo(prog(lt, .35, .9)) * 560) + 'px';
    };
  },
});
