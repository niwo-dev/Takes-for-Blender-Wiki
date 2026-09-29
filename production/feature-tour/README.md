# Takes for Blender: Feature Tour production

Motion-graphics video for Takes for Blender, made entirely from code: an HTML/three.js animation
engine rendered frame by frame in headless Chromium, a synthesized voice (Kokoro, open source,
runs offline), a synthesized score and sound effects (Python), and ffmpeg for encoding.
Nothing here needs a cloud service once the one-time downloads are done.

## One-time setup

You need **Node.js 20+** and **Python 3.10+**.

| | Windows | macOS | Linux |
|---|---|---|---|
| Node.js | [nodejs.org](https://nodejs.org) installer (LTS) | `brew install node` | your package manager, or nodejs.org |
| Python | [python.org](https://www.python.org) installer, tick **Add python.exe to PATH** | `brew install python` | usually installed |

Then, in this folder:

```
npm install
npm run setup
```

`npm run setup` installs Chromium for Playwright, the Python packages from `requirements.txt`
(including a bundled ffmpeg), and downloads the Kokoro voice model (about 330 MB) into `models/`.

## Making the video

```
npm run all
```

runs every step in order. Each step can also run on its own:

| Step | Command | What it does | Time* |
|---|---|---|---|
| voice | `npm run voice` | Narration and the timeline from `script.json` (lines are cached) | seconds to minutes |
| cues | `npm run cues` | Sound-effect cues exported from the scenes | seconds |
| music | `npm run music` | Score, effects and the final mix (`build/mix.wav`) | 1–2 min |
| render | `npm run render` | Every frame at 1080p60, in parallel 10-second chunks | 30–60 min |
| deliver | `npm run deliver` | Master, 720p copy and chapters into `out/` | 15–25 min |

\*On a 4-core machine; more cores render faster.

Useful render options (after `--`): `npm run render -- --workers=4` sets the number of parallel
browsers, `--redo=3,4` re-renders only chunks 3 and 4 (chunk n = seconds 10n to 10n+10), and
`--force` re-renders everything. Finished chunks are kept, so an interrupted render resumes.

## Changing things

| To change | Edit | Then run |
|---|---|---|
| A narration line | `script.json` | `npm run all` (the timeline may shift) |
| On-screen text or a visual | `scenes/<scene>.js` | `npm run render -- --redo=<chunks>` then `npm run deliver` |
| Music or effects style | `MUSIC_STYLE` / `SFX_STYLE` in `make_music.py` (or set them as environment variables) | `npm run music` then `npm run deliver` |
| Watch materials | `VARIANTS` in `product3d.js` | render and deliver |

Music styles: `cinematic` (default), `electro`, `keynote`, `house`, `synthwave`.
Effect styles: `digital` (default), `clean`, `watch`, `cinematic`.

## Checking before a render

```
npm run preview -- previews s09b_parent:2,8,15 --sheet=sheet.png
```

saves stills of a scene at the given seconds (or `abs:<seconds>` on the whole timeline) as one
contact sheet in `previews/`. To watch the animation itself (without sound), run `npm run live`
and open the address it prints.

## Folder map

| Path | Contents |
|---|---|
| `script.json` | Narration, voice, chapter structure |
| `scenes/` | One file per scene (`defineScene`), `STYLE.md` has the scene rules |
| `engine.js`, `ui.js`, `product3d.js`, `style.css` | Engine, UI kit, the 3D watch, styles |
| `make_vo.py`, `make_music.py`, `render.mjs`, `deliver.py` | The pipeline steps; `pipeline.mjs` runs them |
| `tools/` | Finds Python, ffmpeg and the voice model; setup helpers |
| `vendor/` | three.js and the fonts (bundled, no internet needed at render time) |
| `build/`, `out/`, `models/` | Generated files (not in git) |
