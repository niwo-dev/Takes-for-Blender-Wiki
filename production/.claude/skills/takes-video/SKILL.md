---
name: takes-video
description: House style and workflow for Takes for Blender videos made with the code-driven motion-graphics pipeline in feature-tour/ (scenes, voice, music, render, delivery). Use whenever creating, changing, previewing, rendering or delivering a Takes video, scene, story clip, narration line, music or sound-effect style, or when the user asks about the video's look.
---

# Takes for Blender videos

Every video here is made from code: HTML/CSS/SVG/three.js scenes rendered frame by frame in headless
Chromium, a Kokoro voice (offline), a synthesized score and sound effects (Python), ffmpeg for encoding.
No images, screenshots, stock footage, external assets or cloud services.

Project: `feature-tour/` (see its `README.md` for setup and commands). Scene-building details, layout,
colours, type, motion and 3D API: **read `feature-tour/STYLE.md` before writing or changing any scene.**

## How the client works (always follow)

1. **Approval before rendering.** Never start a render before the client approved the look.
   For new or changed scenes, first show stills (`npm run preview -- <dir> <scene>:t1,t2,... --sheet=x.png`,
   or `npm run styleboard -- <dir>` with a `shots.json`): at least three stills per new style or scene.
2. **Script before build.** For new narration or new segments, propose the lines first and wait for changes.
3. **Changes are cheap before a render:** say so, and offer them.
4. Report time estimates for long steps (render ≈ 0.25 s per frame per worker; a 30 s clip at 60 fps ≈ 1,800 frames).

## Non-negotiable style rules

- **Very little text.** The narrator explains, the screen shows. At most one short headline per scene
  (1–2 lines, 2–4 words each). UI labels 1–3 words. No sentences on screen.
- **Text and graphics never partly overlap.** Text gets its own clear zone.
- **Read, then watch.** A statement is read (1.5–2.5 s) and clears before busy motion starts, or lands
  after the motion settles. Dim other graphics when a closing headline appears.
- **English only.** Voice: female, Kokoro `af_heart` (American), speed as in `script.json`.
- **Soft backgrounds.** Dark studio gradients (radial, soft glows). No bright backdrops, no hard horizon
  line between floor and sky.
- Takes CI colours, Outfit / Inter / JetBrains Mono, dark premium UI (details in STYLE.md).

## One consistent story world

Everything on screen belongs to one product campaign for the **watch** (the 3D product, branded
"TAKES" on the dial, gold / silver / matte black finishes). Names must fit it:

| Thing | Names |
|---|---|
| Project folder / file | `Watch_Campaign/`, `watch.blend`, messy versions like `watch_v12_really_final.blend` |
| Scene group > scene | Watch Launch > Studio (other scenes: Lifestyle, Outdoor) |
| View layer group > view layers | Hero Shots > Front 3/4, Top Down, Detail |
| Takes | Take 1 · Blockout, Take 2 · Warm light, Take 3 · Final (plain "Take N" elsewhere) |
| Cameras | Cam_Wide (whole watch), Cam_Hero (low 3/4), Cam_Macro (dial close-up); names must match the framing |
| World / light | Studio_Soft, STUDIO_HDRI, key light 1000 W |
| Materials | Brushed Gold, Tan Leather, Onyx; Polished Steel, Navy Leather, Pearl; Black Anodized, Rubber, Carbon |

Never introduce names from other domains (no kitchens, interiors, cars). Before delivering, extract all
on-screen text and check it against this table.

## Sound

- Default mix: `MUSIC_STYLE=cinematic` (ticking clock, taiko, strings, braams) with `SFX_STYLE=digital`.
  Other styles exist in `make_music.py` (electro, keynote, house, synthwave; clean, watch, cinematic SFX).
- Voice about 10–12 dB above the music bed under speech; integrated loudness about −16 LUFS, peaks below −1 dBTP.
- Every visible event gets a sound cue (`ctx.cue`), about 1–4 per second, never machine-gunned.

## Deliverables

- Full film: `npm run deliver` → `out/` (1080p60 master, 720p30 sharing copy, chapters).
- For editing in **DaVinci Resolve** the client wants separate story clips: per clip a **silent 1080p60
  H.264 picture** plus **voice, music and effects as separate WAV stems**, clean cuts with about 1 s of
  handles, no baked transitions. Name files by story number and feature, e.g. `05_variant-switch_picture.mp4`,
  `05_variant-switch_voice.wav`.

## Checks before handing anything over

- Stills: nothing empty at the first frames, no clipped or overlapping text, the last frame is a clean composition,
  zero `PAGEERROR` lines.
- Video: correct length and frame rate, no black or frozen stretches (ffmpeg `blackdetect`, `freezedetect`),
  a contact sheet of the whole piece looked at.
- Audio: loudness and peak as above; listen points at chapter joins and the ending.
