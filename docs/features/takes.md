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

Put your mouse over the Takes Tree, then ++ctrl+n++ adds and ++f2++ renames.

Full list: [Keyboard Shortcuts](../interface/hotkeys.md)
