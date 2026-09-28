"""Narration for the Takes promo: synthesises each line with Kokoro (offline neural TTS),
places it on the scene timeline, ducks the music/SFX under it and writes the final mix.

Setup:  pip install kokoro-onnx soundfile ; apt-get install espeak-ng
        model files (kokoro-v1.0.onnx, voices-v1.0.bin) from
        https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0  -> $KOKORO_DIR
Usage:  python3 make_voiceover.py music.wav out.wav [--long]      (music.wav from make_audio.py)
"""
import os
import subprocess
import sys
import wave

import numpy as np
from kokoro_onnx import Kokoro

LONG = '--long' in sys.argv
args = [a for a in sys.argv[1:] if not a.startswith('--')]
music_path, out_path = args[0], args[1]
KDIR = os.environ.get('KOKORO_DIR', '.')
VOICE = os.environ.get('VOICE', 'am_michael')
FFMPEG = os.environ.get('FFMPEG', 'ffmpeg')
SR = 44100

# (start second, text, latest end second). Scene boundaries match takes_promo.html.
if LONG:
    LINES = [
        (0.3, "One file. Every look. Zero copies.", 4.3),
        (4.8, "Takes for Blender. Stage management, in five principles.", 8.8),
        (9.4, "Principle one. One tree, for everything. Scenes, layers and shots live in a single hierarchy, right inside Blender.", 16.9),
        (17.4, "Principle two. Set it once, and the deepest level wins. Assign a camera at the top, and every level below inherits it, until one says otherwise.", 26.8),
        (27.4, "Principle three. Variants, not duplicates. One product, one file. Switch materials per shot, and nothing is ever copied.", 35.8),
        (36.4, "Principle four. Nothing drifts. Anything you haven't keyed snaps back to its rest pose, whenever you switch shots.", 43.8),
        (44.4, "Principle five. Render everything. Every shot and every variant, in one click, named automatically by tokens.", 52.8),
        (53.6, "Takes for Blender. One tree. One cascade. Every variant. Every render.", 58.6),
    ]
else:
    LINES = [
        (0.15, "One file. Every look.", 2.15),
        (2.45, "Takes for Blender.", 3.95),
        (4.2, "One tree, for everything.", 6.7),
        (7.0, "Set once. Deepest wins.", 9.85),
        (10.15, "Variants, not duplicates.", 12.7),
        (13.0, "Nothing drifts.", 15.1),
        (15.4, "Render everything.", 17.75),
        (18.25, "Takes for Blender.", 19.6),
    ]

kokoro = Kokoro(os.path.join(KDIR, 'kokoro-v1.0.onnx'), os.path.join(KDIR, 'voices-v1.0.bin'))


def speak(text, max_dur):
    speed = 1.0
    for _ in range(4):
        y, sr = kokoro.create(text, voice=VOICE, speed=speed, lang='en-us')
        y = np.trim_zeros(np.asarray(y, dtype=np.float64), 'fb') if len(y) else y
        dur = len(y) / sr
        if dur <= max_dur or speed >= 1.3:
            return y, sr, speed
        speed = min(1.3, speed * dur / max_dur * 1.02)
    return y, sr, speed


def resample(y, sr):
    tmp = out_path + '.tmp24.wav'
    with wave.open(tmp, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
    tmp2 = out_path + '.tmp44.wav'
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-i', tmp, '-ar', str(SR), '-ac', '1', tmp2], check=True)
    with wave.open(tmp2) as w:
        r = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float64) / 32768
    os.remove(tmp); os.remove(tmp2)
    return r


with wave.open(music_path) as w:
    m = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, 2).astype(np.float64) / 32768
voice = np.zeros(len(m))
for start, text, end in LINES:
    y, sr, speed = speak(text, end - start)
    y = resample(y, sr)
    y = y / (np.sqrt((y ** 2).mean()) + 1e-9) * 0.16          # even loudness per line
    i = int(start * SR)
    n = min(len(y), len(voice) - i)
    fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (SR * .012))
    voice[i:i + n] += y[:n] * fade
    print(f'{start:5.2f}s  {len(y) / SR:4.2f}s  speed {speed:.2f}  {text[:48]}')

# duck music + SFX under the voice (smoothed energy envelope, ~10 dB dip)
env = np.abs(voice)
k = int(.06 * SR)
env = np.convolve(env, np.ones(k) / k, mode='same')
env = np.convolve(np.minimum(1, env / 0.08), np.ones(int(.25 * SR)) / int(.25 * SR), mode='same')
duck = 1 - .68 * np.clip(env, 0, 1)
mix = m * duck[:, None] + voice[:, None] * 1.25
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
mix = mix / np.abs(mix).max() * .89
with wave.open(out_path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out_path)
