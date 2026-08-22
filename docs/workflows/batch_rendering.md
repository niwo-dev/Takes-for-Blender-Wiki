---
icon: material/play-box-multiple
---

# Workflow: Batch Rendering

When you want one click to render every View Layer, each with its own camera, world and preset.

## :material-clipboard-check-outline: Prerequisites

- A scene with several View Layers
- Cascade overrides assigned (cameras, worlds, presets)
- Smart Output patterns defined

## :material-folder-cog: Setup Smart Output

### 1. Define Output Pattern
1. Go to **Properties > Output**.
2. Enable **Smart Output**.
3. Set the Directory:

    ```
    //renders/[scene]/[view_layer]/
    ```

4. Set the File Name:

    ```
    [view_layer]_[camera]_####.[file_format]
    ```

### 2. Assign Render Presets
1. Configure your render settings — engine, samples, resolution.
2. Save them as a render preset in the cascade popover.
3. Assign the preset at **Global** level, or per View Layer Group for different quality tiers.

## :material-play-circle: Running the Batch

### :material-play-circle: Render in Blender
1. Open the Takes Tree sidebar.
2. Click the render button to open the [render menu](../features/batch_render.md#the-render-menu).
3. Set **Render Mode** to *In Blender — you wait*.
4. Pick a scope row, for example *Selected Layers → This Scene*.

Blender works through the queue in tree order and saves each result to its Smart Output path.

??? info "What the queue does for each View Layer"
    - Switches the scene and View Layer context
    - Applies the cascade overrides (camera, world, action, variants)
    - Applies the render preset
    - Renders and saves to the Smart Output path

    Progress shows per View Layer in the render queue list.

### :material-cog-clockwise: Render in the Background
1. Open the same render menu.
2. Switch **Render Mode** to *In Background — keep working*.
3. Pick a scope row.

Blender stays interactive while the renders run. Tree thumbnails update as each View Layer finishes.

## :material-progress-clock: Monitoring Progress

The render queue sidebar shows a progress bar per View Layer. Each row carries a status: Pending, Rendering, Saving, Done, Failed or Cancelled. Hover a failed item for the reason.

Time estimates self-correct while a batch runs. Once the first take finishes, the remaining time reflects how this run is really performing.

??? tip "Better estimates before you start"
    **{{ op('tks.calibrate_render_times').bl_label }}** learns per-take render
    times ahead of a run, so the first estimate is close from the start.

## :material-file-tree: Output Structure

With the patterns above, you get one folder per scene and View Layer.

??? info "What the folders look like"
    ```
    renders/
    ├── Kitchen/
    │   ├── Front_3-4/
    │   │   ├── Front_3-4_CamHero_0001.png
    │   │   └── Front_3-4_CamHero_0250.png
    │   └── Top_Down/
    │       ├── Top_Down_CamTop_0001.png
    │       └── Top_Down_CamTop_0250.png
    └── Bathroom/
        └── ...
    ```

## :material-lightbulb-on: Tips

??? tip "Completion Sound"
    Set a notification sound in **Preferences > Workflow > Render** to be alerted
    when background renders finish. Comes with bundled sounds, or point the
    Sound Folder at your own `.wav` files.

??? tip "Preview Before Render"
    ++alt++-click the render toggle at the far right of a View Layer's row in the
    Takes Tree — the camera icon that enables or disables the layer for
    rendering. It shows that layer's last rendered output without re-rendering.

!!! warning "Save First"
    Background renders require the `.blend` file to be saved.
    Foreground renders work from the current memory state.
