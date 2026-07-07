---
icon: material/movie-open
---

# Takes

A **Take** is a named group of View Layers that represent a specific configuration of your scene — a camera angle, a lighting setup, a material variant, or an animation state.

## :material-lightbulb-outline: Concept

In film and photography, a "take" is one version of a shot. Takes for Blender extends this concept to Blender's View Layer system, giving you:

- **Independent camera assignments** per View Layer
- **Independent world environments** per View Layer
- **Independent compositor node trees** per View Layer
- **Independent render presets** per View Layer
- **Independent animation actions** per View Layer

## :material-file-tree: Organization

Takes are organized in a six-tier cascade. The **Global** tier is edited in the [Globals](globals.md) panel; the remaining five tiers all live inside the Takes Tree:

| Level | Purpose | Example |
|-------|---------|---------|
| **Global** | Project-wide defaults | Default camera, default world |
| **Scene Group** | Folder-level organization for scenes | "Interior", "Exterior" |
| **Scene** | A Blender scene | "Kitchen", "Bathroom" |
| **View Layer Group** | Logical grouping of View Layers | "Hero Shots", "Detail Shots" |
| **View Layer** | The actual render unit | "Front 3/4", "Top Down" |
| **View Layer Version** | Named snapshots of View Layer settings | "v1 warm", "v2 cool" |

## :material-plus-circle: Creating Takes

### :material-plus-circle: Add a View Layer
1. Click **+** in the tree sidebar.
2. Choose **Add View Layer**.
3. The new View Layer inherits from the active View Layer.

### :material-folder-multiple: Group View Layers
1. Select a View Layer in the tree.
2. Press ++ctrl+g++ to create a View Layer Group containing it.
3. Drag other View Layers into the group.

### :material-source-branch: View Layer Versions
Create named snapshots of a View Layer's cascade settings:

1. Select a View Layer.
2. Click **+** → **Add Version**.
3. Each version stores its own camera, world, action, and preset overrides.

!!! tip "Quick Switching"
    Switch between View Layer Versions to instantly compare different configurations
    without duplicating View Layers.

## :material-keyboard: Hotkeys

When the Takes Tree is focused (mouse over the N-panel sidebar):

| Shortcut | Action |
|----------|--------|
| ++ctrl+n++ | Add (smart — picks the right item type for the current selection) |
| ++shift+a++ | Add menu (full add options) |
| ++f2++ | Rename the selected item |
| ++del++ / ++x++ | Delete (with confirmation) |
| ++ctrl+g++ | Group the selection (Scene Group / View Layer Group) |
| ++alt+g++ | Ungroup |
| ++ctrl+t++ | Retarget — move the selected item under a different parent: a View Layer to another View Layer Group, a Scene to another Scene Group, or merge one group into another. Use it to reorganise the tree without deleting and recreating anything. |
| ++shift+d++ | Duplicate (full copy) |
| ++alt+d++ | Duplicate (linked) |
| ++ctrl+i++ | Invert multi-selection |
| ++shift++ + click a chevron | Expand / collapse every item of that type at once (++ctrl+shift++ + click folds the whole tree; a plain click still toggles just the one group) |

A complete hotkey reference is on the [Keyboard Shortcuts](../interface/hotkeys.md) page.
