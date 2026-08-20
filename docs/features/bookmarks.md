---
icon: material/bookmark-multiple
---

# Bookmarks

**Bookmarks** are quick-access pointers to animatable properties scattered across Blender's UI. Bookmark one and it appears as an editable row in the Inspector's Channels view, wherever the original control lives.

## :material-format-list-bulleted: What Gets Bookmarked

Any animatable property qualifies — anywhere a right-click menu offers *"Bookmark Property"*.

??? info "Examples"
    - Object transforms: location, rotation, scale.
    - Modifier values.
    - Material and shader-node inputs.
    - World shader properties.
    - Custom properties.
    - Shape keys, particle settings and more.

## :material-bookmark-plus: Adding a Bookmark

1. Right-click an animatable property in any panel.
2. Choose **{{ op('tks.bookmark_property').bl_label }}**.
3. The bookmark appears in the Inspector's **Channels** view, grouped by target type.

## :material-bookmark-remove: Removing a Bookmark

Right-click a property that is already bookmarked. The menu entry flips to **{{ op('tks.unbookmark_property').bl_label }}**.

It works on the original control and on the Channels row alike, because those rows are the real properties. Bookmark rows carry no separate remove button.

## :material-database: Where Bookmarks Live

- **Scope:** one set per Scene.
- **Persistence:** saved with the .blend file.
- **Visibility:** shown whenever the target object, material or world is active.

## :material-palette-swatch: Bookmark Presets

Save a bookmark set as a **Bookmark preset**, one of the 9 preset categories (see [Render Presets](render_presets.md)). It shares a curated channel layout across scenes or with collaborators.

Click the bookmark icon in the Channels header to show the preset row, then save or revert like any other preset.

## :material-swap-horizontal: Import / Export

Three housekeeping operators move bookmark sets between files. None is drawn in a panel — reach them through Blender's operator search (++f3++).

- **{{ op('tks.export_bookmarks').bl_label }}** — writes the scene's bookmarks to a JSON file for sharing.
- **{{ op('tks.import_bookmarks').bl_label }}** — reads such a file back in. Already-bookmarked properties are skipped, not duplicated.
- **{{ op('tks.clear_bookmarks').bl_label }}** — removes every bookmark from the scene, behind a confirmation dialog (toggleable in *Preferences > Interface > Confirmations*).

## :material-keyboard: Hotkeys

Bookmarks have no dedicated hotkey — add and remove them from the right-click menu on any property.
