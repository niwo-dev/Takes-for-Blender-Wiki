// Entry: loads every scene module named in the timeline, boots the engine, exposes the render API.
import { boot, renderAt, TL, CUES, defineScene, el } from './engine.js';

const FONTS = ['800 40px Outfit', '600 40px Outfit', '400 20px Inter', '500 20px Inter', '500 20px "JetBrains Mono"'];

function placeholder(id) {
  return defineScene({ id, build(root, ctx) {
    root.appendChild(el(`<div class="abs" style="left:120px;top:160px;width:1680px"><div class="kicker">${id}</div>
      <div class="lede" style="margin-top:30px;color:#eef1f6">${ctx.lines.map(l => `<p style="margin-bottom:14px"><span class="mono" style="color:#f5a623">${l.t.toFixed(1)}s</span> ${l.text}</p>`).join('')}</div></div>`));
    return () => {};
  } });
}

const ids = TL.scenes.filter(s => !s.card).map(s => s.id);
await Promise.all(ids.map(id => import(`./scenes/${id}.js`).catch(e => {
  if (!/Failed to fetch|404/.test(e.message)) console.error('scene ' + id + ' failed: ' + e.message);
  placeholder(id);
})));
await Promise.all(FONTS.map(f => document.fonts.load(f)));
await boot(document.getElementById('stage'));

window.renderAt = renderAt;
window.TOTAL = TL.total;
window.collectCues = () => CUES;
window.renderScene = (id, lt) => { const s = TL.scenes.find(x => x.id === id); renderAt(s.start + lt); };
window.ready = true;

if (!new URLSearchParams(location.search).has('render')) {
  const st = document.getElementById('stage');
  const fit = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); st.style.transform = `scale(${s})`; st.style.left = (innerWidth - 1920 * s) / 2 + 'px'; st.style.top = (innerHeight - 1080 * s) / 2 + 'px'; };
  fit(); addEventListener('resize', fit);
  const t0 = performance.now() - (parseFloat(location.hash.slice(1)) || 0) * 1000;
  (function loop() { renderAt(((performance.now() - t0) / 1000) % TL.total); requestAnimationFrame(loop); })();
}
