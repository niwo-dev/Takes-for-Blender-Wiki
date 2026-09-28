"""Final encodes: the full master (H.264 + AAC) and phone chapters that each fit the 20 MB page limit.
Usage: FFMPEG=<ffmpeg> python3 deliver.py
Reads build/video.mp4 (from render.mjs) and build/mix.wav (from make_music.py).
"""
import json, os, subprocess
FF = os.environ.get('FFMPEG', 'ffmpeg')
HERE = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(HERE, 'build')
TL = json.load(open(os.path.join(HERE, 'timeline.json')))
OUT = os.path.join(HERE, '..')
MAX_BYTES = 19.3 * 1024 * 1024

def run(args): subprocess.run([FF, '-y', '-loglevel', 'error'] + args, check=True)

# master: one file, high quality
master = os.path.join(OUT, 'takes_for_blender_feature_tour.mp4')
run(['-i', os.path.join(B, 'video.mp4'), '-i', os.path.join(B, 'mix.wav'), '-map', '0:v', '-map', '1:a',
     '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
     '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', master])
print('master', master, os.path.getsize(master) // 1024 // 1024, 'MB')

# phone chapters: cut at chapter starts (the score stops there), 2-pass to a size budget
starts = [c['start'] for c in TL['chapters']] + [TL['total']]
os.makedirs(os.path.join(B, 'chapters'), exist_ok=True)
for i in range(len(starts) - 1):
    a, b = starts[i], starts[i + 1]; dur = b - a
    kbps = int(MAX_BYTES * 8 / dur / 1000) - 160          # leave room for 128k audio + container
    out = os.path.join(B, 'chapters', f'ch{i + 1}.mp4')
    common = ['-ss', f'{a:.3f}', '-t', f'{dur:.3f}', '-i', os.path.join(B, 'video.mp4'), '-ss', f'{a:.3f}', '-t', f'{dur:.3f}', '-i', os.path.join(B, 'mix.wav'),
              '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-b:v', f'{kbps}k', '-maxrate', f'{int(kbps * 1.6)}k', '-bufsize', f'{kbps * 3}k', '-pix_fmt', 'yuv420p']
    log = os.path.join(B, 'chapters', f'p{i}')
    run(common + ['-pass', '1', '-passlogfile', log, '-an', '-f', 'mp4', os.devnull])
    run(common + ['-pass', '2', '-passlogfile', log, '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out])
    print(f'chapter {i + 1}: {a:.1f}-{b:.1f}s {kbps}kbps -> {os.path.getsize(out) / 1048576:.1f} MB')
