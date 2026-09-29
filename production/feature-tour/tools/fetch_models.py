"""Downloads the Kokoro voice model (about 330 MB, once) into ./models."""
import os
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import kokoro_dir

BASE = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
FILES = ['kokoro-v1.0.onnx', 'voices-v1.0.bin']

d = kokoro_dir(); os.makedirs(d, exist_ok=True)
for f in FILES:
    dst = os.path.join(d, f)
    if os.path.exists(dst) and os.path.getsize(dst) > 1_000_000:
        print('have', f); continue
    print('downloading', f, '...', flush=True)
    tmp = dst + '.part'
    urllib.request.urlretrieve(BASE + f, tmp)
    os.replace(tmp, dst)
    print('saved', dst)
print('voice model ready in', d)
