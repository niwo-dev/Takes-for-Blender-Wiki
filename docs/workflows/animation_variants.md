---
icon: material/animation-play
---

# Workflow: Animation Variants

When every animation needs its own View Layer and camera. For example: a product that spins, tilts and explodes.

## :material-cog-outline: Setup

### 1. Create View Layers
Create one View Layer per animation state:

1. Open the Takes Tree.
2. Click **+** → **Add View Layer** for each animation.
3. Name them descriptively: "Spin", "Tilt", "Explode".

### 2. Group Them
1. Select the first View Layer.
2. Press ++ctrl+g++ to create a group called "Animations".
3. Move the other View Layers into this group.

### 3. Assign Cameras
Each animation usually needs its own angle:

1. Click the camera icon on a View Layer row.
2. Pick the camera for that animation.
3. Repeat for the other View Layers.

## :material-animation: Animating

### 4. Animate Per View Layer
1. Click "Spin" in the tree to switch to it.
2. Animate your objects. The cascade gives this View Layer its own action, and your keyframes go into it.
3. Switch to "Tilt". The objects snap back to their Rest State.
4. Animate a different motion here.

??? tip "Rest State"
    Rest State returns objects to their default pose when you switch away from
    an animated View Layer. It happens on its own — nothing to set up.

### 5. Render All Animations
1. Enable **{{ op('tks.multiselect').bl_label }}** in the tree's statistics row. It puts a checkbox on every row.
2. Tick all animation View Layers.
3. Click the Render button.

Smart Output names each file after its View Layer.

## :material-check-circle: Result

Each View Layer has:

- Its own camera angle
- Its own animation action
- Its own output file name
- All managed from one unified tree
