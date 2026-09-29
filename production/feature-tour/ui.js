// UI kit for the promo scenes: icons, text reveals, panels, tree rows, cursor, keycaps, typing, 3D canvases.
import { el, ease, prog, clamp, lerp, R3D } from './engine.js';

/* ---------------- icons (24px grid, stroke) ---------------- */
const P = {
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.2 3.2 14.8 0 18M12 3c-3.2 3.2-3.2 14.8 0 18"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  folderOpen: '<path d="M3 18V7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v1"/><path d="M3 19l2.6-7.6A2 2 0 0 1 7.5 10H22l-3 9z"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 16.5l9 5 9-5"/>',
  layer: '<path d="M12 4l9 5-9 5-9-5z"/><path d="M3 14l9 5 9-5" opacity=".45"/>',
  take: '<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3.5 9L5 4.5h15.5L19 9"/><path d="M9 4.5L7.5 9M14 4.5L12.5 9M19 4.5L17.5 9"/>',
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  world: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  action: '<path d="M3 17c3 0 4-10 9-10s6 10 9 10"/><circle cx="3" cy="17" r="1.3"/><circle cx="21" cy="17" r="1.3"/><circle cx="12" cy="7" r="1.3"/>',
  nodes: '<rect x="2.5" y="4" width="7" height="6" rx="1.5"/><rect x="14.5" y="14" width="7" height="6" rx="1.5"/><path d="M9.5 7c5 0 0 10 5 10"/>',
  gear: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  note: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M8 11h8M8 15h8M8 19h5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pin: '<path d="M9 3h6l-1 6 4 4H6l4-4z"/><path d="M12 13v8"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  still: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M7 3v2M17 3v2"/>',
  timeline: '<path d="M3 18h18M6 18v-3M10 18v-2M14 18v-3M18 18v-2"/><path d="M12 4v14"/><path d="M9.5 4h5L12 7z"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2.5-1.5H18a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  live: '<circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4"/>',
  diff: '<rect x="3" y="3" width="12" height="12" rx="2"/><rect x="9" y="9" width="12" height="12" rx="2"/>',
  pie: '<circle cx="12" cy="12" r="9"/><path d="M12 3v9l6.4 6.4M12 12L3.4 9.2"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/>',
  robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/>',
  translate: '<path d="M3 5h10M8 3v2M5 5c.5 3 3 6 6 7M11 5c-.5 3-3 6-6 7"/><path d="M13 21l4-10 4 10M14.5 17.5h5"/>',
  file: '<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 9"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
  pause: '<path d="M7 4v16M17 4v16"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7L20 9M20 4v5h-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  marker: '<path d="M5 21V4h11l-2 4 2 4H5"/>',
  strip: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  token: '<path d="M8 4H5v16h3M16 4h3v16h-3"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  grid: '<path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.5M3.5 12h.5M3.5 18h.5"/>',
  chevR: '<path d="M9 5l7 7-7 7"/>',
  chevD: '<path d="M5 9l7 7 7-7"/>',
  dot: '<circle cx="12" cy="12" r="4" fill="currentColor"/>',
  team: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.8"/><path d="M15.5 14.3A5 5 0 0 1 21.5 19"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  magnet: '<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  render: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  hourglass: '<path d="M6 3h12M6 21h12M7 3c0 6 10 5 10 9s-10 3-10 9M17 3c0 6-10 5-10 9s10 3 10 9"/>',
  keyframe: '<path d="M12 3l9 9-9 9-9-9z"/>',
  inherit: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2v4.3M12 11.5H5v5.3M12 11.5h7v5.3"/>',
  mirror: '<path d="M12 3v18" stroke-dasharray="2 3"/><path d="M9 7L4 17h5zM15 7l5 10h-5z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
};
export function icon(name, size = 28, color = 'currentColor', sw = 2) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="color:${color};flex:none;display:block">${P[name] || P.dot}</svg>`;
}
export const ICONS = Object.keys(P);

/* ---------------- small animation helpers ---------------- */
export function pop(e, lt, t0, dur = .5, from = .6, y = 0) {
  const p = prog(lt, t0, dur), k = ease.back(p);
  e.style.opacity = clamp(p * 3); e.style.transform = `translateY(${(1 - k) * y}px) scale(${lerp(from, 1, k)})`;
}
export function slide(e, lt, t0, dur = .6, dx = 0, dy = 40) {
  const k = ease.expo(prog(lt, t0, dur));
  e.style.opacity = clamp(prog(lt, t0, dur) * 2.5); e.style.transform = `translate(${(1 - k) * dx}px,${(1 - k) * dy}px)`;
}
export function fade(e, lt, t0, dur = .5, to = 1) { e.style.opacity = ease.out(prog(lt, t0, dur)) * to; }
export function fadeOut(e, lt, t0, dur = .4) { e.style.opacity = 1 - ease.out(prog(lt, t0, dur)); }
export const float = (lt, amp = 6, spd = 1, ph = 0) => Math.sin(lt * spd + ph) * amp;
export const px = v => Math.round(v * 10) / 10 + 'px';

/* ---------------- text ---------------- */
export function words(text, cls = '') {
  return text.split(' ').map(w => `<span class="mask"><span class="${cls}">${w}</span></span>`).join(' ');
}
export function letters(text, cls = '') {
  return [...text].map(c => c === ' ' ? ' ' : `<span class="mask"><span class="${cls}">${c}</span></span>`).join('');
}
// one continuous gradient across a line that is split into masked words/letters
export function gradify(line, from = '#3a7bc8', to = '#f5a623') {
  // measure against the line's own box, so it works for positioned and flow/flex lines alike
  const box = line.getBoundingClientRect(), W = box.width || line.offsetWidth;
  line.querySelectorAll('.mask>span').forEach(s => {
    const x = s.parentElement.getBoundingClientRect().left - box.left;
    s.style.backgroundImage = `linear-gradient(90deg,${from},${to})`; s.style.backgroundSize = `${W}px 100%`;
    s.style.backgroundPosition = `${-x}px 0`; s.style.webkitBackgroundClip = 'text'; s.style.backgroundClip = 'text'; s.style.color = 'transparent';
  });
}
export function revealMasks(root, lt, t0, stagger = .06, dur = .7, from = 110) {
  root.querySelectorAll('.mask>span').forEach((s, i) => {
    const p = ease.expo(prog(lt, t0 + i * stagger, dur)); s.style.transform = `translateY(${(1 - p) * from}%)`;
  });
}
// Standard feature header: kicker, 1-3 display lines (masked word reveal), optional lede.
export function headline(root, o) {
  const size = o.size || 104;
  const wrap = el(`<div class="abs" style="left:${o.x ?? 120}px;top:${o.y ?? 150}px;width:${o.w || 900}px;text-align:${o.align || 'left'}"></div>`);
  if (o.kicker) wrap.appendChild(el(`<div class="kicker" style="margin-bottom:22px">${o.kicker}</div>`));
  const lines = (o.lines || []).map(L => {
    const t = typeof L === 'string' ? { t: L } : L;
    const d = el(`<div class="disp" style="font-size:${t.size || size}px;white-space:nowrap;margin-bottom:${size * .06}px">${words(t.t)}</div>`);
    d._grad = t.grad; wrap.appendChild(d); return d;
  });
  let lede = null;
  if (o.lede) { lede = el(`<div class="lede" style="margin-top:30px;max-width:${o.ledeW || 700}px;font-size:${o.ledeSize || 34}px">${o.lede}</div>`); wrap.appendChild(lede); }
  root.appendChild(wrap);
  lines.forEach(d => { if (d._grad) gradify(d); });
  const kick = o.kicker ? wrap.firstChild : null;
  return {
    el: wrap, lines, lede,
    update(lt, t0 = 0, ledeT = t0 + .8) {
      if (kick) { kick.style.opacity = ease.out(prog(lt, t0, .4)); kick.style.transform = `translateX(${(1 - ease.expo(prog(lt, t0, .7))) * -30}px)`; }
      lines.forEach((d, i) => revealMasks(d, lt, t0 + .1 + i * .14, .07, .75));
      if (lede) { const k = ease.out(prog(lt, ledeT, .6)); lede.style.opacity = k; lede.style.transform = `translateY(${(1 - k) * 20}px)`; }
    },
  };
}

/* ---------------- surfaces ---------------- */
export function panel(root, { x, y, w, h, title, icon: ic, dots = true, style = '' }) {
  const p = el(`<div class="glass abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden;${style}">
    ${title ? `<div class="panelHead">${ic ? icon(ic, 24, '#9aa3b5') : ''}<span>${title}</span>${dots ? '<div class="dots"><i></i><i></i><i></i></div>' : ''}</div>` : ''}
    <div class="pbody" style="position:absolute;left:0;right:0;top:${title ? 54 : 0}px;bottom:0"></div></div>`);
  root.appendChild(p);
  return { el: p, body: p.querySelector('.pbody') };
}
export function chip(text, color = '#9aa3b5', o = {}) {
  return `<div class="chip" style="border-color:${color};color:${o.filled ? '#fff' : color};background:${o.filled ? color : 'rgba(10,10,12,.35)'};${o.style || ''}">${o.icon ? icon(o.icon, 22, o.filled ? '#fff' : color) : ''}${text}</div>`;
}
export function treeRow(parent, { y, depth = 0, icon: ic, iconColor, label, sub, right = '', h = 58, indent = 42, style = '' }) {
  const r = el(`<div class="row" style="top:${y}px;height:${h}px;padding-left:${16 + depth * indent}px;${style}">
    <div class="ico">${icon(ic || 'dot', 26, iconColor || '#c9d1de')}</div><div class="lbl">${label}</div>${sub ? `<div class="sub">${sub}</div>` : ''}<div class="right">${right}</div></div>`);
  parent.appendChild(r); return r;
}

/* ---------------- cursor with clicks ---------------- */
export class Cursor {
  // path: [{t, x, y, click?}] in scene-local seconds and stage pixels
  constructor(root, ctx, path, o = {}) {
    this.path = path; this.hideAt = o.hideAt ?? Infinity; this.rippleSize = o.ripple ?? 70;
    this.el = el(`<div class="cursor"><svg viewBox="0 0 24 24" width="44" height="44"><path d="M5 2.5l14 8.2-6.2 1.6L9.6 18.5z" fill="#ffffff" stroke="#0a0a0c" stroke-width="1.3" stroke-linejoin="round"/></svg></div>`);
    root.appendChild(this.el);
    this.clicks = path.filter(p => p.click).map(p => { const r = el('<div class="ripple"></div>'); root.appendChild(r); ctx && ctx.cue(p.t, 'click', { gain: .9, pan: (p.x / 960 - 1) * .6 }); return { p, r }; });
  }
  pos(lt) {
    const P = this.path;
    if (lt <= P[0].t) return [P[0].x, P[0].y];
    for (let i = 1; i < P.length; i++) if (lt <= P[i].t) {
      const a = P[i - 1], b = P[i], k = ease.inOut(prog(lt, a.t, b.t - a.t));
      return [lerp(a.x, b.x, k), lerp(a.y, b.y, k)];
    }
    const L = P[P.length - 1]; return [L.x, L.y];
  }
  update(lt) {
    const [x, y] = this.pos(lt);
    const vis = clamp((lt - this.path[0].t + .35) / .3) * (1 - clamp((lt - this.hideAt) / .3));
    let press = 0; for (const c of this.clicks) { const d = lt - c.p.t; if (d > -.08 && d < .16) press = 1; }
    this.el.style.opacity = vis;
    this.el.style.transform = `translate(${x - 8}px,${y - 4}px) scale(${press ? .86 : 1})`;
    for (const c of this.clicks) {
      const q = prog(lt, c.p.t, .55);
      c.r.style.opacity = q > 0 && q < 1 ? (1 - q) * vis : 0;
      const s = 10 + ease.out(q) * this.rippleSize;
      c.r.style.left = (c.p.x - s / 2) + 'px'; c.r.style.top = (c.p.y - s / 2) + 'px'; c.r.style.width = c.r.style.height = s + 'px';
    }
  }
}

/* ---------------- keycaps ---------------- */
export function keycaps(root, keysArr, { x, y, t0, press, ctx, scale = 1 }) {
  const k = el(`<div class="keys abs" style="left:${x}px;top:${y}px;transform-origin:0 50%">${keysArr.map(s => `<div class="key">${s}</div>`).join('<span class="plus">+</span>')}</div>`);
  root.appendChild(k);
  if (ctx && press != null) ctx.cue(press, 'key', { gain: .9 });
  const caps = [...k.querySelectorAll('.key')];
  return lt => {
    const p = prog(lt, t0, .45), kk = ease.back(p);
    k.style.opacity = clamp(p * 3); k.style.transform = `scale(${scale * lerp(.7, 1, kk)})`;
    const d = press == null ? 1 : lt - press, down = d > -.02 && d < .18;
    const glow = press == null ? 0 : Math.max(0, 1 - Math.abs(d - .05) * 2.5);
    caps.forEach(c => {
      c.style.transform = `translateY(${down ? 5 : 0}px)`;
      c.style.boxShadow = down ? '0 1px 0 #0c0d10,0 4px 10px rgba(0,0,0,.5)' : `0 6px 0 #0c0d10,0 10px 24px rgba(0,0,0,.5),0 0 ${glow * 34}px rgba(245,166,35,${glow * .8})`;
      c.style.borderColor = glow > .05 ? `rgba(245,166,35,${.3 + glow * .7})` : 'rgba(255,255,255,.16)';
    });
  };
}

/* ---------------- typing ---------------- */
export function typer(target, text, { t0, cps = 20, ctx, caret = true, cls = '', cueEvery = .12 }) {
  // cue a soft key sound about every cueEvery seconds while typing; touch the DOM only when the visible state changes
  const n = text.length, dur = n / cps;
  if (ctx) for (let t = 0, k = 0; t < dur; t += cueEvery, k++) ctx.cue(t0 + t, 'type', { gain: .35 + (k % 3) * .06, pan: .2 });
  let last = '';
  return lt => {
    const k = clamp(Math.floor((lt - t0) * cps), 0, n);
    const on = caret && lt >= t0 - .3 && (k < n || Math.floor(lt * 2.2) % 2 === 0);
    const key = k + (on ? '|' : '');
    if (key === last) return; last = key;
    target.innerHTML = `<span class="${cls}">${text.slice(0, k).replace(/</g, '&lt;')}</span>${on ? '<span style="display:inline-block;width:.55em;height:1em;vertical-align:-.12em;background:#f5a623;margin-left:2px"></span>' : ''}`;
  };
}

/* ---------------- numbers ---------------- */
export function count(lt, t0, dur, from, to) { return Math.round(lerp(from, to, ease.out(prog(lt, t0, dur)))); }

/* ---------------- 3D canvases ---------------- */
export function canvas3d(root, { x, y, w, h, style = '' }) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}`;
  root.appendChild(c);
  return { canvas: c, draw: (scene, cam) => R3D.draw(c, scene, cam) };
}

/* ---------------- svg line draw ---------------- */
export function drawOn(path, lt, t0, dur, len) {
  const L = len || path.getTotalLength();
  path.style.strokeDasharray = L; path.style.strokeDashoffset = L * (1 - ease.inOut(prog(lt, t0, dur)));
}
