// Dumps every sound cue the scenes registered (absolute seconds) to build/cues.json for make_music.py.
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import fs from 'node:fs';
const { srv, url } = await serve();
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(url + 'index.html?render');
await p.waitForFunction(() => window.ready === true, null, { timeout: 180000 });
const cues = await p.evaluate(() => window.collectCues());
fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/cues.json', JSON.stringify(cues, null, 0));
const by = {}; for (const c of cues) by[c.name] = (by[c.name] || 0) + 1;
console.log(cues.length, 'cues', JSON.stringify(by));
await b.close(); srv.close();
