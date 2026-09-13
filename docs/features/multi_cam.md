---
icon: material/video-switch
---

# Multi-Cam

**Multi-Cam** lets one take cut between several cameras. Each take keeps its own list of cuts, and Blender does the switching — in the viewport, in playback and in the render.

A cut is a timeline marker with a camera on it. The list and the timeline are the same thing, seen twice.

??? info "Why not use Blender's camera markers directly?"
    They belong to the scene, not the take. Two takes in one scene cannot each
    keep their own edit. Multi-Cam gives every take its own list and writes it
    onto the timeline only while that take is active.

## :material-map-marker: Turn It On

1. Open a take's camera popover from its tree row.
2. Click the camera-switch button beside the camera field.

The cut list appears, opened with the camera you were already looking at.

While Multi-Cam is on, the camera field becomes a read-out. It shows the camera playing at the current frame and does not take input — a take that cuts has no single camera, but it always has one right now.

## :material-content-cut: Add a Cut

1. Type the frame you want in the **Marker** row.
2. Click **Add**.
3. Pick the camera on the new row.

The frame field then steps to the next free frame, so a run of cuts is a run of clicks.

Only the first marker of a take gets a camera by itself. Every one after it arrives empty and waits for your answer — and **Add** stays off until you give it one. One open question at a time.

Each cut runs until the next one starts.

??? info "What the rows hold"
    | Control | What it does |
    |---|---|
    | The row name | The marker's own name. Rename it with the pencil. |
    | Camera field | The camera this cut shows. Cameras in this scene only. |
    | Frame | Where the cut starts. Typing here moves the marker too. |
    | :material-pencil: | Renames the camera and its marker together. |
    | :material-plus: | On a row with no camera: makes one and binds it. |
    | **Select (n)** | Markers with no camera yet. Take one in, or delete it. |

??? info "Two things never share a frame"
    Add a marker on a frame that already has one and it steps forward to the
    next free frame. A message says where it landed; you can switch that
    message off under **Preferences ▸ Interface ▸ Confirmations ▸ Context**.

    The one exception is a take's **first** camera. It takes the frame you
    asked for, and a marker of your own already there simply moves to the
    **Select** list. Your marker is never renamed, moved or used.

## :material-swap-horizontal: Switching Takes

The active take's cuts go onto the timeline. Leave, and they come back off.

Move a marker by hand while the take is active and the change is kept — the timeline is the editor. Open the popover again and the list already agrees with it.

A take left holding fewer than two cuts is not cutting, so Multi-Cam switches itself off when you leave it.

## :material-pause: Turning It Off

The list stays. It is drawn greyed so you can still read it, and one click brings it back.

If you are finished with it, **Discard List** throws it away after saying how many cuts go. Your cameras are untouched.

## :material-image-filter-frames: Still Takes

Multi-Cam needs a take that animates. A take pinned to a single frame has no time to cut across.

Press Multi-Cam there and it switches the take to Animation for you. Setting a take back to Still parks its Multi-Cam.

??? info "Managing the two yourself"
    Switch **Multi-Cam Follows Animation Mode** off under
    **Preferences ▸ Workflow ▸ Automations ▸ Cameras** and neither mode touches
    the other. A take holding cuts it cannot play then turns its row badge red
    and appears in the warnings panel, with a button to set it animating.

## :material-alert: Cuts With a Problem

The row badge and the popover turn red when a cut cannot work. The warnings panel lists every one.

??? info "The four cases"
    - **Two cameras share a frame.** Blender picks one and the list keeps the
      other, so nobody can say which renders. **Separate** moves one aside.
    - **A marker of yours shares a frame with a cut.** Harmless for the render
      — only camera markers decide the camera — but only the top one shows in
      the timeline. **Separate** moves yours.
    - **A cut points at a camera that is not here.** Renamed, deleted, or not
      in this scene. Fix the camera on the row.
    - **A cut camera is hidden from the render.** Blender skips it without a
      word. **Show Cut Cameras** reveals them.

## :material-camera: Multi-Cam and Isolate

The [Isolate](../workflows/show_one_camera.md) modes know about cuts:

- **Single Camera** shows only the camera under the playhead and follows as you scrub or play. It hides the others from the *viewport* only, never from the render.
- **Multi Camera** keeps every cut camera on screen.

## :material-movie-open: Rendering

Renders honour the cuts. [Batch Render](batch_render.md) sets each job's cuts up before it starts and puts the timeline back afterwards.

A take with any of the four problems above is skipped, and the queue says so before you press Render. A render that only looks finished is worse than one that did not run.

Full reference: [Navigation Panel](../interface/navigation_panel.md)
