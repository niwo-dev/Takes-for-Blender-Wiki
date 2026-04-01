# Batch Render

The **Batch Render** system automates rendering across multiple View Layers, applying cascade overrides (cameras, worlds, actions, presets, variants) for each one.

## Render Modes

Takes for Blender supports two render modes:

=== "Foreground"
    Renders inside the current Blender session. You see the render window and progress in real-time, but Blender is locked during rendering.

    - Click the **Render** button (:material-image:) in the tree sidebar.
    - Progress shows per-VL with status indicators.
    - Press ++esc++ to cancel.

=== "Background"
    Renders in separate headless Blender subprocesses. Blender stays fully interactive while renders run in the background.

    - Click the **Desktop** button (:material-desktop-classic:) in the sidebar.
    - Tree view updates progressively as each VL completes.
    - A completion sound plays when all tasks finish.

## Render Queue

The render queue shows the status of each View Layer:

| Status | Description |
|--------|-------------|
| **Pending** | Waiting to be rendered. |
| **Rendering** | Currently being processed. |
| **Saving** | Writing output file to disk. |
| **Done** | Successfully completed. |
| **Failed** | Error occurred (hover for details). |
| **Cancelled** | Skipped due to batch cancellation. |

## Selection Modes

- **Single View Layer** — Renders only the active View Layer (default).
- **Multi-select** — When multi-select is enabled, renders all selected View Layers.

!!! tip "Render Order"
    The batch renderer follows the tree view order (top-to-bottom as displayed),
    not Blender's internal scene/VL order.

## Recovery

If a batch render gets stuck:

1. **Alt+Click** the Render button to force-reset.
2. This clears all internal flags and restores suppressed handlers.

## Output

Output paths are resolved via the [Smart Output](smart_output.md) token system. Each View Layer's output is named automatically based on the configured pattern.
