"""Final encodes: the full master (H.264 + AAC) and phone chapters that each fit the 20 MB page limit.
Usage: python deliver.py   (writes to ./out; ffmpeg is found by tools/paths.py)
Reads build/video.mp4 (from render.mjs) and build/mix.wav (from make_music.py).
"""
import json, os, subprocess
import sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools'))
from paths import ffmpeg  # noqa: E402
FF = ffmpeg()
HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, 'build')
TL = json.load(open(os.path.join(HERE, 'timeline.json')))
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)
MAX_BYTES = 19.3 * 1024 * 1024
TRIM_DB = -0.8                                            # mix peaks at -0.4 dBTP; keep AAC below -1 dBTP

def run(args): subprocess.run([FF, '-y', '-loglevel', 'error'] + args, check=True)

# master: one file, high quality
master = os.path.join(OUT, 'takes_for_blender_feature_tour.mp4')
run(['-i', os.path.join(B, 'video.mp4'), '-i', os.path.join(B, 'mix.wav'), '-map', '0:v', '-map', '1:a',
     '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
     '-af', f'volume={TRIM_DB}dB', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', master])
print('master', master, os.path.getsize(master) // 1024 // 1024, 'MB')

# the master as byte-exact parts under the page's per-file limit; the page joins them back into one download
PART = int(19.5 * 1024 * 1024)
pdir = os.path.join(B, 'parts'); os.makedirs(pdir, exist_ok=True)
for f in os.listdir(pdir): os.remove(os.path.join(pdir, f))
with open(master, 'rb') as fh:
    k = 0
    while True:
        chunk = fh.read(PART)
        if not chunk: break
        k += 1; open(os.path.join(pdir, f'tour_part{k:02d}.mp4'), 'wb').write(chunk)
print('parts', k)

# small copy for sharing: 720p30, 2-pass to about 28 MB (fits the 30 MB chat limit and most messengers)
small = os.path.join(OUT, 'takes_for_blender_feature_tour_720p.mp4')
SMALL_BYTES = 27.8 * 1024 * 1024; a_k = 112
v_k = int(SMALL_BYTES * 8 / TL['total'] / 1000 * .985) - a_k
sm = ['-i', os.path.join(B, 'video.mp4'), '-i', os.path.join(B, 'mix.wav'), '-map', '0:v', '-map', '1:a',
      '-vf', 'scale=1280:720:flags=lanczos,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation',
      '-b:v', f'{v_k}k', '-maxrate', f'{int(v_k * 1.8)}k', '-bufsize', f'{v_k * 4}k', '-pix_fmt', 'yuv420p', '-profile:v', 'high']
slog = os.path.join(B, 'small_pass')
run(sm + ['-pass', '1', '-passlogfile', slog, '-an', '-f', 'mp4', os.devnull])
run(sm + ['-pass', '2', '-passlogfile', slog, '-af', f'volume={TRIM_DB}dB', '-c:a', 'aac', '-b:a', f'{a_k}k', '-movflags', '+faststart', '-shortest', small])
print('small', small, round(os.path.getsize(small) / 1048576, 1), 'MiB', f'({v_k} kbps video)')
sdir = os.path.join(B, 'parts720'); os.makedirs(sdir, exist_ok=True)
for f in os.listdir(sdir): os.remove(os.path.join(sdir, f))
with open(small, 'rb') as fh:
    k = 0
    while True:
        chunk = fh.read(PART)
        if not chunk: break
        k += 1; open(os.path.join(sdir, f'tour720_part{k:02d}.mp4'), 'wb').write(chunk)
print('720p parts', k)

# phone chapters: cut at chapter starts (the score stops there); quality-based encode capped so each file
# stays under the page's per-file limit (maxrate x duration + buffer < budget)
starts = [c['start'] for c in TL['chapters']] + [TL['total']]
os.makedirs(os.path.join(B, 'chapters'), exist_ok=True)
for i in range(len(starts) - 1):
    a, b = starts[i], starts[i + 1]; dur = b - a
    # worst case: (cap + audio) * dur + a full 2*cap buffer must fit the budget, with 3 % for the container
    cap = min(6000, int((MAX_BYTES * 8 / 1000 * .97 - 128 * dur) / (dur + 2)))
    out = os.path.join(B, 'chapters', f'ch{i + 1}.mp4')
    fades = f'volume={TRIM_DB}dB,afade=t=in:d=0.005,afade=t=out:st={dur - .005:.3f}:d=0.005'   # no clicks at chapter joins
    run(['-ss', f'{a:.3f}', '-t', f'{dur:.3f}', '-i', os.path.join(B, 'video.mp4'), '-ss', f'{a:.3f}', '-t', f'{dur:.3f}', '-i', os.path.join(B, 'mix.wav'),
         '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '19',
         '-maxrate', f'{cap}k', '-bufsize', f'{cap * 2}k', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
         '-af', fades, '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out])
    size = os.path.getsize(out)
    assert size <= 20 * 1024 * 1024, f'chapter {i + 1} too large: {size}'
    print(f'chapter {i + 1}: {a:.1f}-{b:.1f}s cap {cap}kbps -> {size / 1048576:.1f} MiB')
