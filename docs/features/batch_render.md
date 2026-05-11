---
icon: material/play-box-multiple
---

# Batch Render

The **Batch Render** system automates rendering across multiple View Layers, applying cascade overrides (cameras, worlds, actions, presets, variants) for each one.

## :material-shape: Render Modes

Takes for Blender supports two render modes:

=== "Foreground"
    Renders inside the current Blender session. You see the render window and progress in real-time, but Blender is locked during rendering.

    - Click the **Foreground Render** button (:material-image:) in the queue sidebar to open the [scope dropdown](#render-scope-dropdowns), or trigger a default-scope batch directly.
    - Progress shows per-View Layer with status indicators.
    - Press ++esc++ to cancel.

=== "Background Batch Render"
    Renders in separate headless Blender subprocesses. Blender stays fully interactive while renders run in the background.

    - Click the **Background Render** button (:material-desktop-classic:) in the queue sidebar — opens the [scope dropdown](#render-scope-dropdowns).
    - Tree view updates progressively as each View Layer completes.
    - A completion sound plays when all tasks finish.
    - While a background batch is running the button becomes an **X** so you can cancel without leaving the sidebar.

=== "Render Active View Layer"
    Renders only the **active** View Layer — useful for quick spot-checks without queueing the full batch.

    - Reached from the [scope dropdown](#render-scope-dropdowns) (**Current View Layer**) or via ++ctrl++-click on a View Layer's render-toggle icon.
    - Requires the `.blend` to be saved.

### :material-menu-down: Render Scope Dropdowns

Both render buttons in the queue sidebar open a dropdown menu listing the available render scopes. Foreground and background share the same 7 scopes (single-VL is foreground-only):

| Action | What it renders |
|--------|-----------------|
| **Current View Layer** *(foreground only)* | Just the active View Layer (`tks.render_active_vl`). |
| **Active VLs (Scene)** | Every render-toggle-enabled VL in the current scene only. |
| **Active VLs (All Scenes)** | Every render-toggle-enabled VL across every scene. |
| **All VLs (Scene, Force)** | Every VL in the current scene, regardless of render-toggle. |
| **All VLs (All Scenes, Force)** | Every VL in every scene, regardless of render-toggle. |
| **Skip Completed** | Active VLs across all scenes, skipping ones that already finished. |
| **Failed Only** | Re-render only VLs whose previous attempt failed or cancelled. |
| **Preview Thumbnails** | Render the queue at preview resolution to refresh thumbnails. |

The same dispatcher (`tks.render_scope_dispatch`) powers the [F12 Render Pie](pie_menus.md#f12-render-pie), so anything you assign to a pie slot maps to one of the rows above.

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
2. Probe-renders every queued View Layer at tiny resolution.
3. Extrapolates each result to the View Layer's real render settings (resolution × samples × engine).
4. Streams the estimates back row-by-row; each View Layer's `Estimated Render Time` column updates as its probe completes.

Re-run it any time scene changes have invalidated previous estimates (geometry rebuilt, engine swapped, samples bumped, etc.). Clicking the operator again while it's running asks for cancellation — same pattern as cancelling a background batch.

!!! note "Why probe instead of measure?"
    A full probe takes seconds per View Layer instead of minutes. The extrapolation is rough — useful for ETA / scheduling, not for hitting precise time budgets.

## :material-checkbox-multiple-marked-outline: What Gets Rendered

The batch renderer processes **every View Layer whose render-toggle icon is enabled**, regardless of which row is active or selected. Active/multi-select state in the tree drives editing, not rendering.

To control the queue, toggle the **render icon** (next to each View Layer row):

- Click → toggle that View Layer's enabled state.
- ++shift++ + click → toggle every View Layer in the same scene at once.
- ++alt++ + click on the batch **Render** / **Desktop** button → force-render every View Layer, even completed ones (otherwise the queue skips already-rendered VLs unless **Skip Completed** is off).

!!! tip "Render Order"
    The batch renderer follows the tree view order (top-to-bottom as displayed),
    not Blender's internal scene/View Layer order.

## :material-restore: Recovery

If a batch render gets stuck:

1. **Alt+Click** the Render button to force-reset.
2. This clears all internal flags and restores suppressed handlers.

## :material-export: Output

Output paths are resolved via the [Smart Output](smart_output.md) token system. Each View Layer's output is named automatically based on the configured pattern.

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
