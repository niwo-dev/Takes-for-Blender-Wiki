---
icon: material/play-box-multiple
---

# Batch Render

Render many takes in one go. Each take brings its own camera, world, action, presets and variant from the [cascade](cascade.md).

## :material-shape: Render Modes

Pick **Render Mode** at the bottom of the [render menu](#the-render-menu).

**In Blender — you wait** locks Blender while it renders. **In Background — keep working** renders headlessly. **Active Layer Only** does just the active View Layer.

??? info "What each mode does"
    **In Blender (Foreground).** You see the render window and live progress, but
    Blender is locked. Every scope row runs
    **{{ op('tks.batch_render').bl_label }}**. Progress shows per View Layer with
    status indicators. Press ++esc++ to cancel.

    **In Background.** The .blend is saved once, one queue file is written, and a
    single headless Blender works through every queued View Layer. There is no
    per-take startup cost, so large queues finish quicker. The
    [F12 Render Pie](pie_menus.md#f12-render-pie) background scopes route the same way.

    - The tree updates as each View Layer completes.
    - A sound plays when all tasks finish.
    - The sidebar button becomes an **X** so you can cancel without leaving the sidebar.
    - ++alt++-click force-renders every View Layer, even completed ones.

    **Active Layer Only.** Good for a quick spot-check. Reached from the render
    menu under *Other*, or by ++ctrl++-clicking a View Layer's render-toggle icon.
    The file must be saved first.

### :material-menu-down: The Render Menu

The queue sidebar carries one render button (:material-export:). It opens a menu of scopes — *what* to render — under **Selected Layers**, **All Layers** and **Other**.

Every scope row runs in the selected mode. While a render runs, the button becomes its cancel button.

??? info "Every scope row"
    | Category | Row | What it renders |
    |----------|-----|-----------------|
    | **Selected Layers** | **This Scene** | Every render-toggle-enabled View Layer in the current scene. |
    | | **All Scenes** | Every render-toggle-enabled View Layer across every scene. |
    | | **Pick Scene** | Choose a scene (with a *Search scenes…* option) and render its enabled View Layers. |
    | | **Pick Tag** | Choose a [tag](tags.md) and render only the View Layers carrying it. Each entry shows how many layers it would render. |
    | **All Layers** | **This Scene** | Every View Layer in the current scene, whatever its render-toggle. |
    | | **All Scenes** | Every View Layer in every scene, whatever its render-toggle. |
    | | **Pick Scene** | Choose a scene and force-render all of its View Layers. |
    | | **Pick Tag** | Force-render every View Layer carrying the chosen tag. |
    | **Other** | **Active Layer Only** | Just the active View Layer. |
    | | **Resume — Skip Done** | Enabled View Layers across all scenes, skipping ones that already finished. |
    | | **Retry Failed** | Only View Layers whose last attempt failed or was cancelled. |
    | | **{{ op('tks.calibrate_render_times').bl_label }}** | Probe-render the queue to seed the [time estimates](#calibrate-render-times). |

    The same dispatcher powers the [F12 Render Pie](pie_menus.md#f12-render-pie),
    so anything you assign to a pie slot maps to one of these rows.

## :material-format-list-checkbox: Render Queue

The queue lists every View Layer with a status: **Pending**, **Rendering**, **Saving**, **Done**, **Failed** or **Cancelled**.

Above the list it reports how many takes it will **skip for a missing camera**. Fix those from the [Camera needed](cascade.md#needed-rows) row first.

??? info "What each status means"
    | Status | Meaning |
    |--------|---------|
    | **Pending** | Waiting to be rendered. |
    | **Rendering** | Being processed right now. |
    | **Saving** | Writing the output file to disk. |
    | **Done** | Finished successfully. |
    | **Failed** | Something went wrong — hover for details. |
    | **Cancelled** | Skipped because the batch was cancelled. |

    A take with no camera anywhere in its cascade cannot render. Finding that out
    after a long queue has run is the failure the skip warning heads off.

### :material-view-column: Queue Columns

Click the **gear icon** in the queue header to choose which info columns show beside each row.

??? info "The three sub-controls"
    - **Icons** — turn individual columns on or off. At least two must stay
      visible, so the overflow indicator still means something.
    - **Pin Outside Collapse** — pin icons so they always draw, even when the
      queue auto-collapses on a narrow panel.
    - **Collapse** — *Dynamic* collapses below the **Min Width** value,
      *Always* collapses all the time.

### :material-briefcase-outline: Render Jobs

The **Render Jobs** popover tracks render jobs on disk. **Rescan Disk** re-checks for frames that arrived from elsewhere — a render farm, another machine, a resumed batch.

??? tip "Resizing the popover"
    Blender popups cannot resize while open. So drag the **corner grip** at the
    bottom right, which runs
    **{{ op('tks.render_jobs_drag_resize').bl_label }}**: drag left or right and
    the candidate width appears in the status bar, click to apply and reopen at
    that size, right-click or ++esc++ to cancel. The width is saved in the
    preferences and used every time you open it again.

## :material-timer-cog: Calibrate Render Times

Click **Calibrate Render Times** in the queue toolbar to estimate how long each take needs, before you commit to a real batch.

It probe-renders in the background, so you keep working. Re-run it whenever the scene changes. Click it again to cancel.

??? info "How the estimate is made"
    1. A headless Blender starts in the background — your session stays interactive.
    2. Each queued View Layer is probe-rendered at **two reduced resolutions**.
       Everything else stays real: samples, adaptive sampling, denoising, compositing.
    3. A line is fitted through the two timings and stretched along the pixel axis
       alone to the full output resolution. Extrapolating only pixels is what keeps
       adaptive-sampling scenes honest — a pixels-times-samples model assumes the
       sample cap is reached, which adaptive sampling rarely does.
    4. Estimates stream back row by row. Each **Estimated Render Time** column
       updates as its probe finishes. View Layers sharing a scene's render settings
       share one probe, so calibration is quicker on multi-take scenes.

    Re-run it after geometry rebuilds, an engine swap, a samples bump, and so on.

??? note "Why probe instead of measure?"
    A probe takes seconds per View Layer instead of minutes, so the first estimate
    is approximate — but it does not stay that way. The remaining time corrects
    itself once the first take finishes and shows how this run really performs.
    Background renders also show the render engine's own remaining-time prediction
    for the take in flight. And the queue remembers each take's recent render
    times along with the settings they were measured at, rescaling them when
    resolution or samples change.

## :material-checkbox-multiple-marked-outline: What Gets Rendered

Every View Layer whose **render-toggle** icon is on. Which row is active or selected does not matter — that drives editing, not rendering.

Click the render icon next to a View Layer row to toggle it.

??? tip "Modifier clicks and render order"
    - ++shift++ + click — toggle every View Layer in the same scene at once.
    - ++alt++ + click on a render-menu scope row, or on the sidebar render
      control — force-render every View Layer, even completed ones. Without it the
      queue skips finished ones, unless **Skip Completed** is off.

    **Render order.** The batch follows the tree order you see, top to bottom —
    not Blender's own scene and View Layer order.

## :material-export: Output

Output paths come from the [Smart Output](smart_output.md) token system, so every take names its own file.

The **Directory** and **File Name** rows carry the same ▾ dropdown as the Properties Output panel: **Build Syntax**, an **Insert Token** quick-pick, and **{{ op('tks.field_clear').bl_label }}** for the last token or the whole field.

### :material-file-refresh: Detect Version From Disk

If your path uses a `{rev}` version token, a **Version** field appears with a refresh button (:material-file-refresh:).

Click it to scan the output folder and set **Version** one past the highest found. Your next batch continues the sequence instead of overwriting older renders.

??? info "What the scan looks at"
    It checks versioned folder names *and* versioned file names, and picks the
    highest across both. The token can sit in either place.

    If nothing matches, it leaves the value alone and reports *No existing
    versions found on disk*. Otherwise it reports which version it continues from
    and the highest it saw.

??? tip "When to use it"
    Reach for this after copying a project, pulling renders off a render farm, or
    picking up work where the counter in the file has drifted from what is on
    disk. It only reads the folder — it never deletes or moves renders.

### :material-counter: Versions, Sub-versions & Notes

**Version** and **Sub-version** are the counters your version tokens resolve. Bumping **Version** resets **Sub-version** to zero.

Add a **Note** to record what changed, browse past ones in **Version History**, and **Lock Version as Final** to protect one.

??? info "The whole version block"
    - **Version / Sub-version** — compose them freely, for example
      `v{rev:03d}.{subrev:02d}` resolves to `v002.03`. Whether the counters live
      per scene or per View Layer is a preference.
    - **Note** — a short line about what changed. Click **Add Version Note** to
      start one; it then edits inline beside the Version rows. Notes are saved in
      the .blend.
    - **Version History** (:material-history:) — every noted version, newest
      first, each note editable in place, each with a lock toggle.
    - **Lock Version as Final** (:material-lock:) — **Detect Version From Disk**
      never lands on a locked version; it continues past it.
    - **Open Newest Version Folder** (:material-folder:) — opens the highest
      version folder on disk in your file browser.
    - **Archive Other Versions** (in the history popover) — sweeps every version
      on disk except the current one and any locked ones into an `archive/` folder
      beside them. Files are moved, never deleted. A confirmation lists exactly
      what stays and what moves, and nothing already archived is overwritten.

??? info "Preferences"
    **Workflow ▸ Render Output** holds the master **Render Versioning** switch
    (it hides the whole block when off — tokens in existing paths keep resolving),
    the **Render Version Scope** (one counter per scene, or one per View Layer),
    and the **Render Version Padding** a bare version token pads to
    (v001 / v01 / v1).

## :material-keyboard: Hotkeys

The render-toggle icon beside each View Layer takes modifier-clicks. ++esc++ cancels a running batch.

Full list: [Keyboard Shortcuts](../interface/hotkeys.md)
