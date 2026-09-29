"""Shared locations for the Python steps: ffmpeg and the Kokoro voice model.

ffmpeg:  $FFMPEG, else ffmpeg on the PATH, else the copy bundled with the imageio-ffmpeg package.
Kokoro:  $KOKORO_DIR, else ./models (filled by tools/fetch_models.py).
"""
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ffmpeg():
    if os.environ.get('FFMPEG'):
        return os.environ['FFMPEG']
    try:                                    # prefer the bundled full build: it always has libx264
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        pass
    found = shutil.which('ffmpeg')
    if found:
        return found
    raise SystemExit('ffmpeg not found: run "pip install -r requirements.txt" or set FFMPEG to an ffmpeg with libx264.')


def kokoro_dir():
    return os.environ.get('KOKORO_DIR') or os.path.join(ROOT, 'models')


if __name__ == '__main__':                  # used by the Node scripts to find the same ffmpeg
    print(ffmpeg())
