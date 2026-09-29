// The Python launcher for this machine: $PYTHON, else python3, python, or the Windows "py -3" launcher.
import { execFileSync } from 'node:child_process';

let cached = null;
export function python() {
  if (cached) return cached;
  const tries = process.env.PYTHON ? [[process.env.PYTHON]] : [['python3'], ['python'], ['py', '-3']];
  for (const t of tries) {
    try { execFileSync(t[0], [...t.slice(1), '--version'], { stdio: 'ignore' }); return (cached = t); } catch {}
  }
  throw new Error('Python 3 not found. Install it from python.org (Windows: tick "Add python.exe to PATH").');
}
