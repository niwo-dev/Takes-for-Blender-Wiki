// Renders review stills (JPEG) for the style board: node styleboard.mjs <out_dir>
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import fs from 'node:fs'; import path from 'node:path';
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const SHOTS = JSON.parse(fs.readFileSync(path.join(out, 'shots.json'), 'utf8'));
const { srv, url } = await serve();
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(url + 'index.html?render');
await p.waitForFunction(() => window.ready === true, null, { timeout: 180000 });
for (const s of SHOTS) {
  await p.evaluate(([id, t]) => new Promise(r => { renderScene(id, t); requestAnimationFrame(() => r()); }), [s.id, s.t]);
  const f = path.join(out, `${s.id}_${s.t.toFixed(2)}.jpg`);
  await p.screenshot({ path: f, type: 'jpeg', quality: 88 });
}
console.log('rendered', SHOTS.length);
await b.close(); srv.close();
