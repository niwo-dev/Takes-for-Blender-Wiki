---
icon: material/play-box-multiple
---

# Workflow: Batch Rendering

This workflow covers setting up and running a full batch render across multiple View Layers with cascade overrides and Smart Output.

## Prerequisites

- Scene with multiple View Layers configured
- Cascade overrides assigned (cameras, worlds, presets)
- Smart Output patterns defined

## Setup Smart Output

### 1. Define Output Pattern

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

### 2. Assign Render Presets

For consistent quality across all VLs:

1. Configure your render settings (engine, samples, resolution).
2. Save as a render preset via the cascade popover.
3. Assign it at the **Global** level for all VLs, or per VL Group for different quality tiers.

## Running the Batch

### Foreground Mode

1. Open the Takes Tree sidebar.
2. Click the **Render** button.
3. The queue processes each VL in tree order:
    - Switches scene/VL context
    - Applies cascade overrides (camera, world, action, variants)
    - Applies render preset
    - Renders and saves to the Smart Output path
4. Progress shows per-VL in the render queue list.

### Background Mode

1. Click the **Desktop** button instead.
2. Blender stays interactive while renders run in background processes.
3. Tree view thumbnails update as each VL completes.

## Monitoring Progress

The render queue sidebar shows:

- Per-VL progress bar
- Status indicator (Pending, Rendering, Saving, Done, Failed, Cancelled)
- Failed items show a tooltip with the error reason

## Output Structure

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

## Tips

!!! tip "Completion Sound"
    Set a notification sound in **Preferences > Features** to be alerted
    when background renders finish. Supports system beeps and custom `.wav` files.

!!! tip "Preview Before Render"
    Use ++alt++-click on the render icon next to any VL to preview
    its last rendered output without re-rendering.

!!! warning "Save First"
    Background renders require the `.blend` file to be saved.
    Foreground renders work from the current memory state.
