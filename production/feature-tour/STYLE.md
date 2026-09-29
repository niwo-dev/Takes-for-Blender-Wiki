# Takes for Blender — feature tour: scene-building guide

A 1920×1080, 60 fps motion-graphics film. Everything is drawn in code (HTML/CSS/SVG/Canvas/three.js).
**No images, no screenshots, no external assets, no emojis.** Stylised product UI only.
The look must be *energizing and professional*: premium dark UI, confident type, constant but purposeful motion.

## ★ Text rules (client feedback — these override anything else in this guide)
1. **Very little text.** The narrator explains; the screen shows. Per scene: at most ONE short headline
   (1–2 lines, 2–4 words per line, optional small kicker). **No ledes, no sentences, no paragraphs.**
   UI mockups use short labels only (1–3 words), and only as many as the idea needs.
2. **Text and graphics never partially cover each other.** No panel, 3D object, cursor, chip or particle may sit over
   part of a word unless it is a deliberate full overlay where the text stays completely readable. Give text its own
   clear zone with nothing moving behind or over it.
3. **Don't make the viewer read and watch at the same time.** Sequence it: a statement appears, is read (≈1.5–2.5 s),
   then clears or shrinks to a small label *before* the busy motion graphics start — or the graphics come first and a
   short label lands only when they settle. Never run a dense animation next to fresh text for more than ~1 s.
4. English only. No German or other languages anywhere.

## How a scene works

One file per scene: `scenes/<id>.js`. It registers itself:

```js
import { defineScene, el, ease, prog, clamp, lerp, keys, R3D, THREE } from '../engine.js';
import { icon, headline, panel, chip, treeRow, Cursor, keycaps, typer, pop, slide, fade, canvas3d, count, words, revealMasks, gradify, drawOn, float } from '../ui.js';
import { createWatch, paintWatch, setTime, glowPart, VARIANTS } from '../product3d.js';

defineScene({
  id: 's05_tree',
  transitionIn: 'iris',            // how this scene enters (see list below)
  camera: { zoom: .035 },          // slow push-in on the whole scene (default); false = off
  mood: { a:'#3a7bc8', b:'#e87d0d', grid:.35, part:1, glow:1, ax:.2, ay:.25, bx:.85, by:.75 }, // background glows/grid/particles
  build(root, ctx) {               // runs ONCE: build DOM, 3D objects, register sound cues
    // ... create elements inside root (1920x1080 absolute coordinates) ...
    return lt => { /* runs EVERY FRAME with scene-local time lt (can be <0 or >dur during transitions) */ };
  },
});
```

`renderAt(T)` must be a **pure function of time**: never use Date/performance/Math.random, never accumulate state
across frames. Use `rng(seed)` from engine.js for deterministic randomness. Every frame must be computable in any order.

### ctx
- `ctx.dur` scene length (s), `ctx.lines` VO lines `[{t, dur, text}]` (scene-local), `ctx.line(i)` start of line i, `ctx.lineEnd(i)`.
- **Sync the key visual beat of each VO line to `ctx.line(i)`** (a thing appears as the narrator names it).
- `ctx.cue(t, name, {gain, pan, pitch})` registers a sound effect at scene-local time `t` (call it in build, not per frame).
  Names: `click pop tick key type whoosh swish thud hit chime success shimmer snap glitch shutter boing riser blip error sparkle`.
  `Cursor` clicks, `keycaps` presses and `typer` typing register their own cues. Aim for a sound on every visible event,
  but don't machine-gun: ~1–4 cues per second max. `pitch` is semitones (use rising pitch for sequences).

### Transitions (`transitionIn`)
`zoom` (default), `push`, `pushUp`, `iris`, `blinds`, `wipe`, `flash`, `fade`, `cut`. Chapter cards use `slam` automatically.
The engine blends both scenes during the overlap, so your scene is already running at `lt < 0`; make sure the first
~0.4 s is not empty (a frame with nothing on it during a transition looks broken). Scenes don't animate *out*.

## Layout
- Stage 1920×1080. Safe area: x 100–1820, y 100–990. The HUD draws a chapter tag at top-left (x 120, y 58) and a
  progress rail at the bottom (y ≈ 1000–1040) on chapters 2–6: keep that band clear.
- Default composition: headline block left (x 120, w ≈ 700–760), visual right (x ≈ 860–1800). **Vary it**: centred
  statements, full-bleed 3D, split screens, a big number, a diagram across the whole width. No two neighbouring scenes
  should look alike.
- Panels: `panel(root, {x,y,w,h,title,icon})` → `{el, body}` (glass, 54 px header). Radius 8–10, 1 px light border.

## Type
- Display: Outfit 800 (`.disp`), 90–130 px headlines, uppercase short statements (e.g. `SET ONCE.` / `DEEPEST WINS.`),
  second line gradient (`{t:'…', grad:true}` in `headline`). Outfit 600 (`.disp6`) for UI labels 22–30 px.
- Body: Inter 400 — avoid body text on screen (see ★ Text rules). UI labels only.
- Mono: JetBrains Mono 500 (`.mono`, `.kicker`) for labels, tokens, code, uppercase tags with letter-spacing .12–.22em.
- Never below 15 px. Text must never overflow its box or collide with other text — check every frame you preview.
- UI words should match the add-on: Takes Tree, Global / Scene Group / Scene / View Layer Group / View Layer / Take,
  Cascade, Variant Switch, Product / Part / State, Rest State, Diff State, Still Mode, Value Lock, Rest Mode, Autokey,
  Timeline, Variant Live, Multi-Cam, Tags, Rules, Render Presets, Smart Output, Batch Render, Watchlist, Channels.

## Colour (Takes CI)
Void #0a0a0c · surface #121215 · float #1e1e24 · orange #e87d0d · bright orange #f5a623 · blue #265787 · bright blue #3a7bc8
· teal #2fc4b2 (rest / success) · pink #e0569a (parent state) · red #e5484d (errors only) · text #eef1f6 · muted #9aa3b5.
Gradient text: #3a7bc8 → #f5a623. Diff State colours: Take blue #3a7bc8, Parent pink #e0569a, Rest teal #2fc4b2, Drift orange #f5a623.

## Motion
- Entrances: masked word rise (`headline`, `revealMasks`), `pop` (back ease) for chips/buttons, `slide` with 60–90 ms
  stagger for rows, `drawOn` for lines. Expo-out for entrances, inOut for moves.
- Something always moves: the camera push, a flowing connector, a floating card (`float()`), a turning product.
  But hold important text still long enough to read (≥ 2 s).
- Show interaction: `Cursor` with clicks, `keycaps` for hotkeys (Ctrl+N, F2, Shift+Alt+Q…), `typer` for typing.
- Accent glow on the moment that matters (box-shadow/drop-shadow in orange/blue), then let it settle.
- End state of a scene should be a clean, readable composition held for the last 1.5–2 s.

## 3D (three.js via R3D)
```js
const scene = R3D.scene();                    // studio env + key + warm/cool rim lights
const watch = createWatch(); watch.rotation.x = Math.PI/2;   // face toward +Z
const pivot = new THREE.Group(); pivot.add(watch); scene.add(pivot);
const cam = R3D.camera(28);                   // fov
const view = canvas3d(root, {x, y, w, h});    // 2D canvas in the DOM; draw each frame:
// per frame: paintWatch(watch,'gold','silver',k); setTime(watch, lt*8); pivot.rotation.y = …; cam.position.set(0,.4,12.5); cam.lookAt(0,0,0); view.draw(scene, cam);
```
Variants: `gold`, `silver`, `black` (`VARIANTS[v].name/accent/mats`). `glowPart(watch,'case'|'strap'|'dial',k)`.
Any THREE geometry works (boxes, spheres, torus, `THREE.EdgesGeometry` + `LineSegments` for wireframes/outlines).
Rendering is software (SwiftShader): a 1100×1000 view costs ~0.15 s/frame. Keep total 3D pixels per frame under
~1.5 MP, and cache things that do not change (render once into a canvas, then `drawImage`).

## Checking your work
```
cd production/feature-tour
node preview.mjs /tmp/…/pv s05_tree:0.3,1.5,3,5,7.5,10,12.5 --sheet=s05.png      # tiled 640x360 stills
node preview.mjs /tmp/…/pv s05_tree:7.5                                          # one full-size still
```
Look at the sheet with the Read tool. Check: nothing empty at t≈0, no overlapping/clipped text, every VO beat has its
visual, the last frame is a clean composition, PAGEERROR lines are zero. Also check the transition into your scene with
`abs:<start-0.3>,<start>,<start+0.3>` (absolute seconds; starts are in timeline.json).

## Don'ts
No external URLs, images or fonts. No emojis. No lorem ipsum. Don't edit engine.js / ui.js / product3d.js / style.css /
other scenes — put helpers inside your own scene file. Don't claim features the add-on doesn't have (use the facts in
your brief). No text smaller than 15 px. No pure red/green except error/success meaning.
