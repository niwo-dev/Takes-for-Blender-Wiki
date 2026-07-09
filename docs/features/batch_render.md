---
icon: material/play-box-multiple
---

# Batch Render

The **Batch Render** system automates rendering across multiple View Layers, applying cascade overrides (cameras, worlds, actions, presets, variants) for each one.

## :material-shape: Render Modes

Takes for Blender supports three render modes:

=== "Foreground"
    Renders inside the current Blender session. You see the render window and progress in real-time, but Blender is locked during rendering.

    - Open the [render menu](#the-render-menu) from the queue sidebar with **Foreground** mode selected — every scope row then runs **{{ op('tks.batch_render').bl_label }}**.
    - Progress shows per-View Layer with status indicators.
    - Press ++esc++ to cancel.

=== "Background Batch Render"
    Renders headlessly while Blender stays fully interactive. Selecting **Background** mode in the [render menu](#the-render-menu) dispatches `tks.batch_render_bg_fast`: the `.blend` is saved once, a single queue file is written, and **one** persistent headless Blender process works through every queued View Layer — no per-task startup cost, so large queues finish quicker. The [F12 Render Pie](pie_menus.md#f12-render-pie) background scopes route the same way.

    - Tree view updates progressively as each View Layer completes.
    - A completion sound plays when all tasks finish.
    - While a background batch is running the sidebar button becomes an **X** so you can cancel without leaving the sidebar.
    - ++alt++-click force-renders every View Layer even if it already completed.

=== "Render Active View Layer"
    Renders only the **active** View Layer — useful for quick spot-checks without queueing the full batch.

    - Reached from the [render menu](#the-render-menu) (**Active Layer Only**, under *Other*) or via ++ctrl++-click on a View Layer's render-toggle icon.
    - Requires the `.blend` to be saved.

### :material-menu-down: The Render Menu

The queue sidebar carries a single render button (:material-play: in Foreground mode, :material-menu-right: in Background mode) that opens the render menu. A **Render Mode** toggle at the top switches between **Foreground** and **Background**; every scope row below dispatches in whichever mode is selected. The scopes are grouped into three categories:

| Category | Row | What it renders |
|----------|-----|-----------------|
| **Selected Takes** | **This Scene** | Every render-toggle-enabled VL in the current scene only. |
| | **All Scenes** | Every render-toggle-enabled VL across every scene. |
| | **Pick Scene** | Choose a specific scene (with a *Search scenes…* option) to render its enabled VLs. |
| **All Takes** | **This Scene** | Every VL in the current scene, regardless of render-toggle. |
| | **All Scenes** | Every VL in every scene, regardless of render-toggle. |
| | **Pick Scene** | Choose a specific scene and force-render all of its VLs. |
| **Other** | **Active Layer Only** | Just the active View Layer. |
| | **Resume — Skip Done** | Enabled VLs across all scenes, skipping ones that already finished. |
| | **Retry Failed** | Re-render only VLs whose previous attempt failed or cancelled. |
| | **{{ op('tks.calibrate_render_times').bl_label }}** | Probe-render the queue to seed the [time estimates](#calibrate-render-times). |

The same dispatcher (`tks.render_scope_dispatch`) powers the [F12 Render Pie](pie_menus.md#f12-render-pie), so anything you assign to a pie slot maps to one of the scope rows above. While a render or calibration is running, the sidebar button turns into its cancel button.

## :material-format-list-checkbox: Render Queue

The render queue shows the status of each View Layer:

| Status | Description |
|--------|-------------|
| **Pending** | Waiting to be rendered. |
| **Rendering** | Currently being processed. |
| **Saving** | Writing output file to disk. |
| **Done** | Successfully completed. |
| **Failed** | Error occurred (hover for details). |
| **Cancelled** | Skipped due to batch cancellation. |

### :material-view-column: Queue Columns

Click the **gear icon** in the queue header to open the **Queue Columns** popover. It controls which info columns are visible alongside each row, with three sub-controls:

- **Icons** — toggle individual columns on or off. At least two visible columns must remain so the overflow indicator is meaningful.
- **Pin Outside Collapse** — pin specific icons so they always render, even when the queue auto-collapses on narrow panels.
- **Collapse** — switch between *Dynamic* (auto-collapses when the panel is narrower than the **Min Width** value) and *Always* (always collapse).

## :material-timer-cog: Calibrate Render Times

Click **Calibrate Render Times** in the queue toolbar to estimate per–View Layer runtime *before* you commit to a real batch. The operator:

1. Spawns a headless Blender subprocess in the background — your foreground stays interactive.
2. Probe-renders each queued View Layer at **two reduced resolutions**, with every other setting left real — samples, adaptive sampling, denoising and compositing are untouched.
3. Fits a line through the two probe timings and extrapolates along the pixel axis alone to the View Layer's full output resolution. Extrapolating only pixels is what keeps adaptive-sampling scenes honest — a pixels-times-samples model assumes the nominal sample cap is reached, which adaptive sampling rarely does.
4. Streams the estimates back row-by-row; each View Layer's `Estimated Render Time` column updates as its probe completes. View Layers that share a scene's render settings share one probe, so calibration finishes faster on typical multi-take scenes.

Re-run it any time scene changes have invalidated previous estimates (geometry rebuilt, engine swapped, samples bumped, etc.). Clicking the operator again while it's running asks for cancellation — same pattern as cancelling a background batch.

!!! note "Why probe instead of measure?"
    A probe takes seconds per View Layer instead of minutes, so the initial estimate is necessarily approximate — but it doesn't stay that way. The ETA corrects itself while a batch runs: once the first take finishes, the remaining time reflects how this run is actually performing. Background renders additionally show the render engine's own remaining-time prediction for the take in flight. And the queue remembers each take's recent render times together with the settings they were measured at, rescaling those estimates when resolution or samples change.

## :material-checkbox-multiple-marked-outline: What Gets Rendered

The batch renderer processes **every View Layer whose render-toggle icon is enabled**, regardless of which row is active or selected. Active/multi-select state in the tree drives editing, not rendering.

To control the queue, toggle the **render icon** (next to each View Layer row):

- Click → toggle that View Layer's enabled state.
- ++shift++ + click → toggle every View Layer in the same scene at once.
- ++alt++ + click on a render-menu scope row (or the sidebar render control) → force-render every View Layer, even completed ones (otherwise the queue skips already-rendered VLs unless **Skip Completed** is off).

!!! tip "Render Order"
    The batch renderer follows the tree view order (top-to-bottom as displayed),
    not Blender's internal scene/View Layer order.

## :material-restore: Recovery

If a batch render gets stuck:

1. **Alt+Click** the Render button to force-reset.
2. This clears all internal flags and restores suppressed handlers.

## :material-export: Output

Output paths are resolved via the [Smart Output](smart_output.md) token system. Each View Layer's output is named automatically based on the configured pattern.

### :material-file-refresh: Detect Version From Disk

When your output pattern includes a `{rev}` version token — either in a folder segment or in the file name — the Smart Output section shows a **Version** field with a refresh button (:material-file-refresh:) beside it. **Detect Version From Disk** scans the resolved output folder for files and folders that already match the versioned pattern, finds the highest number present, and sets the **Version** field to *highest + 1* so your next batch continues the sequence instead of overwriting earlier renders.

- Click the refresh button next to **Version** to run the scan (operator `tks.detect_render_version`).
- It checks both versioned folder names and versioned file names, picking the highest across both.
- If nothing on disk matches the pattern, it leaves the value untouched and reports *No existing versions found on disk*; otherwise it reports the version it is continuing from and the highest it saw.

!!! tip "When to use it"
    Reach for this after copying a project, pulling renders from a render farm, or otherwise picking up work where the in-file version counter has drifted from what is actually on disk. It only reads the folder — it never deletes or moves existing renders.

## :material-keyboard: Hotkeys

The render-toggle icon next to each View Layer accepts modifier-clicks:

| Shortcut | Action |
|----------|--------|
| Click | Toggle the View Layer's enabled state in the queue. |
| ++alt++ + click | **Preview Render** — open the View Layer's most recently rendered image into Blender's Render Result. Requires a finished render to exist; fails silently otherwise. |
| ++ctrl++ + click | **Render & save** the View Layer through the queue. |
| ++shift++ + click | Toggle **all** View Layers in the current scene. |

While a batch render is running:

| Shortcut | Action |
|----------|--------|
| ++esc++ | Cancel the batch render. The status line shows `(ESC to cancel)` while running. |
| ++alt++ + click on the **Render** button | Force-reset a stuck render state. |

See [Keyboard Shortcuts](../interface/hotkeys.md) for the full reference.
