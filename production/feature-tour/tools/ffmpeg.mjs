// Finds ffmpeg for the Node scripts: $FFMPEG, else the one tools/paths.py picks (bundled imageio-ffmpeg), else "ffmpeg".
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { python } from './python.mjs';

export function ffmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    const py = python();
    const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'paths.py');
    return execFileSync(py[0], [...py.slice(1), script], { encoding: 'utf8' }).trim();
  } catch { return 'ffmpeg'; }
}
