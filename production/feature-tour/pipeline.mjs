// One command for the whole production, on Windows, macOS or Linux.
//   node pipeline.mjs              all steps: voice -> cues -> music -> render -> deliver
//   node pipeline.mjs music deliver    only these steps, in this order
// Extra "--key=value" arguments are passed to the render step (e.g. --workers=4, --redo=3,4).
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { python } from './tools/python.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));   // every step runs from the project folder

const STEPS = {
  voice:   ['py', 'make_vo.py'],        // narration + timeline from script.json
  cues:    ['node', 'export_cues.mjs'], // sound-effect cues from the scenes
  music:   ['py', 'make_music.py'],     // score, effects and the final mix
  render:  ['node', 'render.mjs'],      // every frame, in parallel chunks
  deliver: ['py', 'deliver.py'],        // master, 720p copy and chapters into ./out
};
const args = process.argv.slice(2);
const want = args.filter(a => !a.startsWith('--'));
const extra = args.filter(a => a.startsWith('--'));
const run = want.length ? want : Object.keys(STEPS);
for (const s of run) if (!STEPS[s]) { console.error(`unknown step "${s}"; steps: ${Object.keys(STEPS).join(', ')}`); process.exit(1); }

for (const s of run) {
  const [kind, file] = STEPS[s];
  const [cmd, ...pre] = kind === 'py' ? python() : [process.execPath];
  const t0 = Date.now();
  console.log(`\n== ${s} ==`);
  const r = spawnSync(cmd, [...pre, file, ...(s === 'render' ? extra : [])], { stdio: 'inherit', cwd: HERE });
  if (r.status !== 0) { console.error(`step "${s}" failed (exit ${r.status})`); process.exit(r.status || 1); }
  console.log(`== ${s} done in ${((Date.now() - t0) / 1000).toFixed(0)} s ==`);
}
