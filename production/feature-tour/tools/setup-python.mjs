// npm run setup, Python half: installs requirements.txt and fetches the voice model.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { python } from './python.mjs';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [cmd, ...pre] = python();
for (const a of [['-m', 'pip', 'install', '-r', 'requirements.txt'], ['tools/fetch_models.py']]) {
  const r = spawnSync(cmd, [...pre, ...a], { stdio: 'inherit', cwd: ROOT });
  if (r.status !== 0) process.exit(r.status || 1);
}
