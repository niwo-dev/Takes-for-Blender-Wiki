// Parallel, chunked, deterministic renderer.
//   FFMPEG=<full ffmpeg> node render.mjs [--fps=60] [--workers=3] [--chunk=10] [--from=0] [--to=<end>] [--force] [--redo=12,13]
// Renders the timeline in fixed chunks (build/seg/c_<index>.mp4, near-lossless H.264), skipping chunks that exist
// unless --force or listed in --redo (chunk indices), then concatenates them into build/video.mp4.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path';
import { serve } from './serve.mjs';

const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const has = k => process.argv.includes('--' + k);
const FPS = +arg('fps', 60), WORKERS = +arg('workers', 3), CHUNK = +arg('chunk', 10);
const FF = process.env.FFMPEG || 'ffmpeg';
const TL = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
const total = TL.total, nFrames = Math.floor(total * FPS);
const from = +arg('from', 0), to = +arg('to', total);
const redo = new Set((arg('redo', '') || '').split(',').filter(Boolean).map(Number));
const SEG = path.resolve('build/seg'); fs.mkdirSync(SEG, { recursive: true });
const perChunk = CHUNK * FPS, nChunks = Math.ceil(nFrames / perChunk);
const jobs = [];
for (let c = 0; c < nChunks; c++) {
  const f0 = c * perChunk, f1 = Math.min(nFrames, f0 + perChunk);
  if (f1 / FPS <= from || f0 / FPS >= to) continue;
  const file = path.join(SEG, `c_${String(c).padStart(3, '0')}.mp4`);
  if (fs.existsSync(file) && !has('force') && !redo.has(c)) continue;
  jobs.push({ c, f0, f1, file });
}
console.log(`${nFrames} frames @${FPS}fps, ${nChunks} chunks, ${jobs.length} to render with ${WORKERS} workers`);
const { srv, url } = await serve();
const t0 = Date.now(); let done = 0;
async function worker(id) {
  const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log(`[w${id}] PAGEERROR`, e.message));
  await p.goto(url + 'index.html?render');
  await p.waitForFunction(() => window.ready === true, null, { timeout: 300000 });
  while (jobs.length) {
    const j = jobs.shift();
    const tmp = j.file + '.part.mp4';
    const ff = spawn(FF, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', 'pipe:0',
      '-c:v', 'libx264', '-crf', '8', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-g', String(FPS), tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
    ff.stdin.on('error', () => {});
    for (let f = j.f0; f < j.f1; f++) {
      await p.evaluate(t => window.renderAt(t), f / FPS);
      const buf = await p.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    fs.renameSync(tmp, j.file); done++;
    const el = (Date.now() - t0) / 1000;
    console.log(`[w${id}] chunk ${j.c} done (${j.f1 - j.f0} frames) — ${done} chunks in ${el.toFixed(0)}s`);
  }
  await b.close();
}
await Promise.all(Array.from({ length: Math.min(WORKERS, jobs.length) }, (_, i) => worker(i)));
srv.close();
const list = [...Array(nChunks).keys()].map(c => path.join(SEG, `c_${String(c).padStart(3, '0')}.mp4`));
if (list.every(f => fs.existsSync(f))) {
  fs.writeFileSync(path.join(SEG, 'list.txt'), list.map(f => `file '${f}'`).join('\n'));
  execFileSync(FF, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(SEG, 'list.txt'), '-c', 'copy', 'build/video.mp4']);
  console.log('wrote build/video.mp4');
} else console.log('some chunks missing; not concatenating');
