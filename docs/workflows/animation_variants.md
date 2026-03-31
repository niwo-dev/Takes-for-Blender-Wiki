---
icon: material/animation-play
---

# Workflow: Animation Variants

This workflow shows how to set up different animation takes per View Layer — for example, a product spinning, tilting, and exploding, each on its own View Layer with independent cameras.

## Setup

### 1. Create View Layers

Create one View Layer per animation state:

1. Open the Takes Tree.
2. Click **+** → **Add View Layer** for each animation.
3. Name them descriptively: "Spin", "Tilt", "Explode".

### 2. Group Them

1. Select the first VL.
2. Press ++ctrl+g++ to create a group called "Animations".
3. Move the other VLs into this group.

### 3. Assign Cameras

Each animation likely needs its own camera angle:

1. Click the camera icon on each VL row.
2. Assign the appropriate camera.

## Animating

### 4. Animate Per View Layer

1. Switch to "Spin" View Layer by clicking it in the tree.
2. The cascade automatically assigns a dedicated action for this VL.
3. Animate your objects. Keyframes are stored in the VL-specific action.
4. Switch to "Tilt" — the objects snap back to their Rest State.
5. Create a different animation on this VL.

!!! tip "Rest State"
    The Rest State system ensures objects return to their default pose
    when switching away from an animated VL. This happens automatically.

### 5. Render All Animations

1. Enable multi-select in the tree sidebar.
2. Select all animation View Layers.
3. Click the Render button.
4. Smart Output names each output file using the VL name automatically.

## Result

Each View Layer has:

- Its own camera angle
- Its own animation action
- Its own output file name
- All managed from one unified tree
