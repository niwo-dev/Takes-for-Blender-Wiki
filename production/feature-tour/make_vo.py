"""Voiceover + master timeline for the long promo.

Reads script.json, synthesises every line with Kokoro (offline neural TTS, cached per line),
lays the lines out scene by scene and writes:
  timeline.json / timeline.js  - scene starts, durations, VO line times (the HTML and the music read these)
  build/voice.wav              - the processed narration track (mono, 44.1 kHz)

Setup: pip install -r requirements.txt, then python tools/fetch_models.py (voice model into ./models,
       or point KOKORO_DIR at a folder holding kokoro-v1.0.onnx and voices-v1.0.bin)
"""
import hashlib
import json
import math
import os
import sys
import wave

import numpy as np
from scipy.signal import butter, resample_poly, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, 'build')
CACHE = os.path.join(BUILD, 'vo_cache')
os.makedirs(CACHE, exist_ok=True)
SR = 44100

S = json.load(open(os.path.join(HERE, 'script.json')))
VOICE, SPEED = S['voice'], S['speed']
BAR = 4 * 60 / S['bpm']
BEAT = 60 / S['bpm']
D = S['defaults']

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools'))
from paths import kokoro_dir  # noqa: E402

_kokoro = None


def kokoro():
    global _kokoro
    if _kokoro is None:
        from kokoro_onnx import Kokoro
        kd = kokoro_dir()
        _kokoro = Kokoro(os.path.join(kd, 'kokoro-v1.0.onnx'), os.path.join(kd, 'voices-v1.0.bin'))
    return _kokoro


def synth(text):
    key = hashlib.sha1(f'{VOICE}|{SPEED}|{text}'.encode()).hexdigest()[:16]
    path = os.path.join(CACHE, key + '.npy')
    if os.path.exists(path):
        return np.load(path)
    y, sr = kokoro().create(text, voice=VOICE, speed=SPEED, lang='en-us')
    y = resample_poly(np.asarray(y, dtype=np.float64), 147, 80) if sr == 24000 else np.asarray(y, np.float64)
    # trim leading/trailing silence by threshold, keep 40 ms of air
    idx = np.where(np.abs(y) > 0.01)[0]
    if len(idx):
        a, b = max(0, idx[0] - int(.04 * SR)), min(len(y), idx[-1] + int(.08 * SR))
        y = y[a:b]
    np.save(path, y)
    return y


def process(y):
    y = sosfilt(butter(2, 75, 'hp', fs=SR, output='sos'), y)
    y = sosfilt(butter(1, 9500, 'lp', fs=SR, output='sos'), y)
    y = y / (np.sqrt(np.mean(y ** 2)) + 1e-9) * 0.14            # even loudness per line
    # gentle compression: smooth envelope, 3:1 above threshold
    env = np.sqrt(np.convolve(y ** 2, np.ones(441) / 441, mode='same')) + 1e-9
    thr = 0.16
    gain = np.where(env > thr, (thr + (env - thr) / 3) / env, 1.0)
    y = y * gain
    fade = np.minimum(1, np.minimum(np.arange(len(y)), len(y) - np.arange(len(y))) / (SR * .01))
    return y * fade


timeline = {'fps': S['fps'], 'bpm': S['bpm'], 'bar': BAR, 'chapters': [], 'scenes': []}
chap_titles = {c['n']: c['title'] for c in S['chapters']}
t = 0.0
placed = []
for sc in S['scenes']:
    if sc.get('card'):
        snap = math.ceil(t / BEAT - 1e-6) * BEAT         # cards (chapter starts) land on a beat; the score restarts its bar grid there
        if timeline['scenes'] and snap > t:
            timeline['scenes'][-1]['dur'] = round(timeline['scenes'][-1]['dur'] + snap - t, 3)
        t = snap
        timeline['chapters'].append({'n': sc['chapter'], 'title': chap_titles[sc['chapter']], 'start': round(t, 3)})
        timeline['scenes'].append({'id': sc['id'], 'chapter': sc['chapter'], 'card': True, 'title': chap_titles[sc['chapter']],
                                   'start': round(t, 3), 'dur': sc['dur'], 'lines': []})
        t += sc['dur']
        continue
    if not timeline['chapters']:
        timeline['chapters'].append({'n': sc['chapter'], 'title': chap_titles[sc['chapter']], 'start': 0.0})
    lead, gap, tail = sc.get('lead', D['lead']), sc.get('gap', D['gap']), sc.get('tail', D['tail'])
    lt = lead
    lines = []
    for text in sc['lines']:
        y = synth(text)
        dur = len(y) / SR
        lines.append({'t': round(lt, 3), 'dur': round(dur, 3), 'text': text})
        placed.append((t + lt, y))
        lt += dur + gap
    dur = max(sc.get('minDur', 0), lt - gap + tail)
    timeline['scenes'].append({'id': sc['id'], 'chapter': sc['chapter'], 'start': round(t, 3), 'dur': round(dur, 3), 'lines': lines})
    t += dur

timeline['total'] = round(t, 3)
json.dump(timeline, open(os.path.join(HERE, 'timeline.json'), 'w'), indent=1)
open(os.path.join(HERE, 'timeline.js'), 'w').write('window.TL = ' + json.dumps(timeline) + ';\n')

voice = np.zeros(int((t + 1) * SR))
for start, y in placed:
    y = process(y)
    i = int(start * SR)
    voice[i:i + len(y)] += y[:len(voice) - i]
with wave.open(os.path.join(BUILD, 'voice.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(voice, -1, 1) * 32767).astype('<i2').tobytes())

for s in timeline['scenes']:
    print(f"{s['start']:7.2f}  {s['dur']:5.2f}  {s['id']:<14} {'CARD ' + s['title'] if s.get('card') else ' | '.join(f'{l[chr(116)]:.1f}+{l[chr(100)+chr(117)+chr(114)]:.1f}' for l in s['lines'])}")
print(f'total {t:.2f}s = {int(t // 60)}:{t % 60:04.1f}')
