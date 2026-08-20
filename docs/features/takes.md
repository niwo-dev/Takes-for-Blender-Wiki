---
icon: material/file-tree
---

# The Takes System

Takes for Blender turns your scenes and View Layers into one organized tree.

Every level of that tree can carry its own camera, world, action, compositor and render setup.

This page is the map of the whole system. The deepest level — the review loop itself — has its own page: **[Takes — the Review Loop](vl_versions.md)**.

## :material-lightbulb-outline: Concept

In film, a *take* is one attempt at a shot, repeated until the director is happy.

The addon builds that idea into Blender. One View Layer holds many saved attempts, and each one remembers the feedback it answered.

## :material-file-tree: Organization

Six levels, from project-wide defaults down to a single take.

A deeper level always beats a wider one. That resolution is the [Cascade System](cascade.md).

You edit the top level in the [Globals](globals.md) panel. The other five all live in the Takes Tree.

??? info "The six levels, widest first"
    | Level | Purpose | Example |
    |-------|---------|---------|
    | **Global** | Project-wide defaults | Default camera, default world |
    | **Scene Group** | Folder-level organization for scenes | "Interior", "Exterior" |
    | **Scene** | A Blender scene | "Kitchen", "Bathroom" |
    | **View Layer Group** | Logical grouping of View Layers | "Hero Shots", "Detail Shots" |
    | **View Layer** | The actual render unit | "Front 3/4", "Top Down" |
    | **Take** | Saved review iterations of one layer | "Take 1 · Blockout", "Take 2 · NightLighting" |

## :material-plus-circle: Building the Tree

### :material-plus-circle: Add a View Layer
1. Click **+** in the tree sidebar.
2. Choose **Add View Layer**.
3. The new View Layer inherits from the active View Layer.

### :material-folder-multiple: Group View Layers
1. Select a View Layer in the tree.
2. Press ++ctrl+g++ to create a View Layer Group containing it.
3. Drag other View Layers into the group.

### :material-movie-open: Takes
Select a View Layer, then click **+** → **Add Take** to save a review iteration of it.

Each take stores its own camera, world, action and preset overrides, plus a feedback note.

The full loop — notes, **New Take from Here**, comparing rounds — is on [Takes — the Review Loop](vl_versions.md).

## :material-keyboard: Hotkeys

Put your mouse over the Takes Tree in the sidebar, then use the tree shortcuts.

++ctrl+n++ adds, ++f2++ renames, ++del++ deletes, ++ctrl+g++ groups the selection.

??? info "Every tree shortcut"
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
