---
icon: material/play-box-multiple
---

# Workflow: Batch Rendering

This workflow covers setting up and running a full batch render across multiple View Layers with cascade overrides and Smart Output.

## :material-clipboard-check-outline: Prerequisites

- Scene with multiple View Layers configured
- Cascade overrides assigned (cameras, worlds, presets)
- Smart Output patterns defined

## :material-folder-cog: Setup Smart Output

### :material-numeric-1-circle: 1. Define Output Pattern
1. Go to **Properties > Output**.
2. Enable **Smart Output**.
3. Set the Directory Pattern:

    ```
    //renders/[scene]/[view_layer]/
    ```

4. Set the File Name Pattern:

    ```
    [view_layer]_[camera]_####.[file_format]
    ```

### :material-numeric-2-circle: 2. Assign Render Presets
For consistent quality across all View Layers:

1. Configure your render settings (engine, samples, resolution).
2. Save as a render preset via the cascade popover.
3. Assign it at the **Global** level for all View Layers, or per View Layer Group for different quality tiers.

## :material-play-circle: Running the Batch

### :material-play-circle: Foreground Mode
1. Open the Takes Tree sidebar.
2. Click the **Render** button.
3. The queue processes each View Layer in tree order:
    - Switches scene/View Layer context
    - Applies cascade overrides (camera, world, action, variants)
    - Applies render preset
    - Renders and saves to the Smart Output path
4. Progress shows per-View Layer in the render queue list.

### :material-cog-clockwise: Background Mode
1. Click the **Desktop** button instead.
2. Blender stays interactive while renders run in background processes.
3. Tree view thumbnails update as each View Layer completes.

## :material-progress-clock: Monitoring Progress

The render queue sidebar shows:

- Per-View Layer progress bar
- Status indicator (Pending, Rendering, Saving, Done, Failed, Cancelled)
- Failed items show a tooltip with the error reason

## :material-file-tree: Output Structure

With the patterns above, your output folder looks like:

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

!!! tip "Completion Sound"
    Set a notification sound in **Preferences > Features** to be alerted
    when background renders finish. Supports system beeps and custom `.wav` files.

!!! tip "Preview Before Render"
    Use ++alt++-click on the render icon next to any View Layer to preview
    its last rendered output without re-rendering.

!!! warning "Save First"
    Background renders require the `.blend` file to be saved.
    Foreground renders work from the current memory state.
