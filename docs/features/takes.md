---
icon: material/movie-open
---

# Takes

A **Take** is a named group of View Layers that represent a specific configuration of your scene — a camera angle, a lighting setup, a material variant, or an animation state.

## Concept

In film and photography, a "take" is one version of a shot. Takes for Blender extends this concept to Blender's View Layer system, giving you:

- **Independent camera assignments** per View Layer
- **Independent world environments** per View Layer
- **Independent compositor node trees** per View Layer
- **Independent render presets** per View Layer
- **Independent animation actions** per View Layer

## Organization

Takes are organized in a hierarchy within the Takes Tree:

| Level | Purpose | Example |
|-------|---------|---------|
| **Scene Group** | Top-level organization | "Interior", "Exterior" |
| **Scene** | Blender scene | "Kitchen", "Bathroom" |
| **VL Group** | Logical grouping of VLs | "Hero Shots", "Detail Shots" |
| **View Layer** | The actual render unit | "Front 3/4", "Top Down" |
| **VL Version** | Named snapshots of VL settings | "v1 warm", "v2 cool" |

## Creating Takes

### Add a View Layer

1. Click **+** in the tree sidebar.
2. Choose **Add View Layer**.
3. The new VL inherits from the active View Layer.

### Group View Layers

1. Select a View Layer in the tree.
2. Press ++ctrl+g++ to create a VL Group containing it.
3. Drag other View Layers into the group.

### VL Versions

Create named snapshots of a View Layer's cascade settings:

1. Select a View Layer.
2. Click **+** → **Add Version**.
3. Each version stores its own camera, world, action, and preset overrides.

!!! tip "Quick Switching"
    Switch between VL Versions to instantly compare different configurations
    without duplicating View Layers.
