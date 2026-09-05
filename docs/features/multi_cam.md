---
icon: material/video-switch
---

# Multi-Cam

**Multi-Cam** lets one take cut between several cameras on the timeline. Each take keeps its own list of cuts — a frame and a camera per cut — and Blender does the switching itself, in the viewport, in playback and in the render.

??? info "Why not Blender's own camera markers?"
    They belong to the scene, not the take. Two takes in one scene cannot each
    keep their own edit. Multi-Cam gives each take its own list and writes it
    onto the timeline only while that take is active.

## :material-map-marker: Where to Find It

- **Tree rows** — open the row's camera popover and switch **Multi-Cam** on. The cut list appears under it.
- **The row badge** — a Multi-Cam take shows a small camera-switch icon on its row. It turns red when a cut has a problem (see below).

## :material-content-cut: Making Cuts

1. Move the playhead to the frame where the cut should start.
2. Make the camera you want the scene's active camera.
3. Click **Cut Here** in the popover.

Each cut runs until the next one starts. Frames before the first cut use the first cut's camera, so the take never shows nothing.

In the list, each row shows the cut's frame and camera. You can edit both in place.

??? info "The buttons"
    | Button | What it does |
    |---|---|
    | **Cut Here** | Adds a cut at the current frame, to the scene's active camera. |
    | :material-play: | Moves the playhead to that cut. |
    | :material-close: | Removes that cut. The one before it runs on. |
    | **Adopt** | Takes the cuts already on the timeline into this take. |
    | **Rewrite** | Puts this take's cuts back on the timeline, dropping edits made there by hand. |

## :material-swap-horizontal: What Happens When You Switch Takes

When a Multi-Cam take becomes active, Takes writes its cuts onto the timeline as camera markers. When you leave, it takes them back out. The timeline always shows the active take's cuts.

Move a marker by hand while the take is active and the change is kept. **Rewrite** throws such hand edits away and puts the list back.

??? info "A take with one camera on a timeline that cuts"
    A take that is *not* Multi-Cam still lives on the scene's timeline. If that
    timeline already carries camera markers, they overrule the take's own
    camera — Blender switches regardless.

    The popover says so, in red, and offers two ways out: **Adopt as Cuts**
    turns those markers into this take's own cut list, or **Clear Cuts**
    removes them so the take keeps its one camera. Plain markers with notes
    are left alone.

## :material-alert: Cuts With a Problem

The row badge and the popover turn red when a cut cannot work.

??? info "The two cases"
    - **A cut points at a camera that is not here.** It was renamed, deleted,
      or is not in this scene. Fix the cut's camera in the list.
    - **A cut camera is hidden from the render.** Blender skips such a cut
      without a word. Click **Show Cut Cameras** to reveal them, and the cuts
      count again.

## :material-camera: Multi-Cam and Isolate

The [Isolate](../workflows/show_one_camera.md) modes know about cuts:

- **Single Camera** shows only the camera under the playhead and follows as you scrub or play. It hides the other cut cameras from the *viewport* only, never from the render, so no cut is lost.
- **Multi Camera** keeps every cut camera on screen.

## :material-movie-open: Rendering

Renders honour the cuts. [Batch Render](batch_render.md) sets up each job's cuts before it starts and puts the timeline back afterwards.

Full reference: [Navigation Panel](../interface/navigation_panel.md)
