---
icon: material/shoe-print
---

# First Steps

This guide walks you through the core workflow in under 5 minutes.

## Understanding the Basics

Takes for Blender organizes your scene into a hierarchy:

```mermaid
graph TD
    G[Global] --> SG[Scene Group]
    SG --> S[Scene]
    S --> VLG[VL Group]
    VLG --> VL[View Layer]
    VL --> VLV[VL Version]
```

Each level in this hierarchy can override properties from the level above — this is the **Cascade** system.

## Your First Take

### 1. Open the Takes Panel

Press ++n++ in the 3D Viewport to open the sidebar, then click the **Takes** tab.

The **Takes Tree** shows all your current scenes and view layers in a unified list.

### 2. Add a View Layer

1. Click the **+** button in the tree sidebar.
2. Select **Add View Layer**.
3. The new View Layer appears in the tree and becomes active.

### 3. Assign a Camera

Each View Layer can have its own camera:

1. Select your new View Layer in the tree.
2. Click the **camera icon** (:material-camera:) on the View Layer row.
3. In the popover, choose a camera from the dropdown.

### 4. Organize with Groups

Group related View Layers together:

1. Select a View Layer in the tree.
2. Press ++ctrl+g++ to create a VL Group.
3. Drag other View Layers into the group.

### 5. Batch Render

Render all your View Layers at once:

1. Click the **Render** button (:material-image:) in the tree sidebar.
2. The batch renderer processes each View Layer with its cascade overrides.
3. Output files are named automatically using the Smart Output token system.

## What's Next?

- Learn about the [Cascade System](../features/cascade.md) to understand how overrides flow
- Set up [Render Presets](../features/render_presets.md) for consistent output settings
- Explore [Variant Switch](../features/variant_switch.md) for material variations
