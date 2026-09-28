// Review stills.
//   node preview.mjs <out_dir> <scene_id>:<t1>,<t2>,... [abs:<T>,...] [--sheet=name.png] [--cols=3]
// t = scene-local seconds ("abs" = absolute timeline seconds).
// Without --sheet every frame is saved at 1920x1080; with --sheet all frames are tiled (640x360 each) into one image.
// Page errors and console errors are printed.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import fs from 'node:fs'; import path from 'node:path';

const args = process.argv.slice(2);
const opt = k => (args.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const sheet = opt('sheet'), cols = +(opt('cols') || 3);
const out = args[0]; fs.mkdirSync(out, { recursive: true });
const { srv, url } = await serve();
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
p.on('console', m => { if (['error', 'warning'].includes(m.type()) && !/GPU stall|GL Driver|Failed to load resource/.test(m.text())) console.log('console.' + m.type(), m.text()); });
await p.goto(url + 'index.html?render');
await p.waitForFunction(() => window.ready === true, null, { timeout: 180000 });
const shots = [];
for (const spec of args.slice(1).filter(a => !a.startsWith('--'))) {
  const [id, ts] = spec.split(':');
  for (const t of ts.split(',').map(Number)) {
    if (id === 'abs') await p.evaluate(T => renderAt(T), t); else await p.evaluate(([id, t]) => renderScene(id, t), [id, t]);
    const label = `${id} @ ${t.toFixed(2)}s`;
    if (sheet) shots.push({ label, buf: await p.screenshot({ type: 'jpeg', quality: 85 }) });
    else { const f = path.join(out, `${id}_${t.toFixed(2)}.png`); await p.screenshot({ path: f }); console.log(f); }
  }
}
if (sheet) {
  const q = await b.newPage({ viewport: { width: cols * 640, height: 360 } });
  await q.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},640px);gap:0">${shots.map(s =>
    `<div style="position:relative;width:640px;height:360px"><img src="data:image/jpeg;base64,${s.buf.toString('base64')}" style="width:640px;height:360px;display:block">
     <div style="position:absolute;left:6px;top:4px;font:12px monospace;color:#fff;background:rgba(0,0,0,.6);padding:2px 5px">${s.label}</div></div>`).join('')}</body>`);
  const f = path.join(out, sheet); await q.screenshot({ path: f, fullPage: true }); console.log(f);
}
await b.close(); srv.close();
