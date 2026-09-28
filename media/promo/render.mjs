// Deterministic frame-by-frame renderer: [FFMPEG=/path/to/full/ffmpeg] node render.mjs [out.mp4|webm] [fps] [startSec] [endSec]
// Needs: playwright (npm i -g playwright). Without FFMPEG it falls back to Playwright's bundled VP8-only ffmpeg.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(here, 'takes_promo.webm');
const fps = Number(process.argv[3] || 30);
const ffmpegBin = process.env.FFMPEG || fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('ffmpeg')).map(d => `/opt/pw-browsers/${d}/ffmpeg-linux`)[0];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(here, 'takes_promo.html') + (process.env.LONG ? '?render&long' : '?render'));
await page.evaluate(() => window.ready);
await page.waitForTimeout(500);
const total = await page.evaluate(() => window.TOTAL);
const t0 = Number(process.argv[4] || 0), t1 = Number(process.argv[5] || total);
const n = Math.round((t1 - t0) * fps);

const h264 = !!process.env.FFMPEG; // full ffmpeg (e.g. imageio-ffmpeg) -> H.264; Playwright's bundled build -> VP8/WebM
const codec = h264 ? ['-c:v', 'libx264', '-crf', '14', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']
                   : ['-c:v', 'libvpx', '-b:v', '12M', '-crf', '6', '-pix_fmt', 'yuv420p', '-auto-alt-ref', '0'];
const ff = spawn(ffmpegBin, ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-vcodec', 'mjpeg', '-i', 'pipe:0', ...codec, out],
  { stdio: ['pipe', 'inherit', 'inherit'] });
ff.stdin.on('error', () => {});
for (let i = 0; i < n; i++) {
  await page.evaluate(t => window.renderAt(t), t0 + i / fps);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 120 === 0) console.log(`frame ${i}/${n}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', out);
