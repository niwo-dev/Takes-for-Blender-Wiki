---
icon: material/animation-play
---

# Workflow: Animation Variants

This workflow shows how to set up different animation takes per View Layer — for example, a product spinning, tilting, and exploding, each on its own View Layer with independent cameras.

## :material-cog-outline: Setup

### :material-numeric-1-circle: 1. Create View Layers
Create one View Layer per animation state:

1. Open the Takes Tree.
2. Click **+** → **Add View Layer** for each animation.
3. Name them descriptively: "Spin", "Tilt", "Explode".

### :material-numeric-2-circle: 2. Group Them
1. Select the first View Layer.
2. Press ++ctrl+g++ to create a group called "Animations".
3. Move the other View Layers into this group.

### :material-numeric-3-circle: 3. Assign Cameras
Each animation likely needs its own camera angle:

1. Click the camera icon on each View Layer row.
2. Assign the appropriate camera.

## :material-animation: Animating

### :material-numeric-4-circle: 4. Animate Per View Layer
1. Switch to "Spin" View Layer by clicking it in the tree.
2. The cascade automatically assigns a dedicated action for this View Layer.
3. Animate your objects. Keyframes are stored in the View Layer-specific action.
4. Switch to "Tilt" — the objects snap back to their Rest State.
5. Create a different animation on this View Layer.

!!! tip "Rest State"
    The Rest State system ensures objects return to their default pose
    when switching away from an animated View Layer. This happens automatically.

### :material-numeric-5-circle: 5. Render All Animations
1. Enable multi-select in the tree sidebar — the **{{ op('tks.multiselect').bl_label }}** toggle in the tree's statistics row, which adds a checkbox to every row.
2. Select all animation View Layers.
3. Click the Render button.
4. Smart Output names each output file using the View Layer name automatically.

## :material-check-circle: Result

Each View Layer has:

- Its own camera angle
- Its own animation action
- Its own output file name
- All managed from one unified tree
