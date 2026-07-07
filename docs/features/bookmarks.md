---
icon: material/bookmark-multiple
---

# Bookmarks

**Bookmarks** are quick-access pointers to animatable properties scattered across Blender's UI. Bookmark a property once and it shows up as an editable row inside the Inspector's Channels view, no matter where the original control lives.

## :material-format-list-bulleted: What Gets Bookmarked

Any animatable property — anywhere a right-click menu offers *"Bookmark Property"*:

- Object transforms (`location`, `rotation_euler`, `scale`).
- Modifier values.
- Material / shader-node inputs.
- World shader properties.
- Custom properties (`["MyProperty"]`).
- Shape keys, particle settings, and other RNA paths.

## :material-bookmark-plus: Adding a Bookmark

1. Right-click any animatable property in any panel (Properties, N-panel, Geometry Nodes, etc.).
2. Choose **{{ op('tks.bookmark_property').bl_label }}**.
3. The bookmark appears in the Inspector's **Channels** view, grouped by target type.

## :material-bookmark-remove: Removing a Bookmark

Removal goes through the same right-click menu as adding: on a property that is already bookmarked, the menu entry flips to **{{ op('tks.unbookmark_property').bl_label }}**. That works on the property's original control and on its row inside the Channels view alike — the rows are the real properties, so they carry the same menu. There is no dedicated remove button on the bookmark row itself.

## :material-database: Where Bookmarks Live

- **Scope:** per-Scene (stored as `scene.tks_bookmarked_properties`).
- **Persistence:** saved with the `.blend`.
- **Visibility:** shown wherever the target object / material / world is currently active.

## :material-palette-swatch: Bookmark Presets

Bookmark sets can be saved as a **Bookmark preset** (one of the 9 preset categories — see [Render Presets](render_presets.md)). Use this to share a curated channel layout across scenes or with collaborators. The preset row lives in the Channels view itself: click the bookmark icon in the Channels header to show it, then save or revert the current bookmark set like any other preset.

## :material-swap-horizontal: Import / Export

Three housekeeping operators exist for moving bookmark sets between files, but they are not drawn in any panel — reach them through Blender's operator search (++f3++):

- **{{ op('tks.export_bookmarks').bl_label }}** — writes the scene's bookmarks to a JSON file for sharing.
- **{{ op('tks.import_bookmarks').bl_label }}** — reads such a file back in, merging with what's there (already-bookmarked properties are skipped, not duplicated).
- **{{ op('tks.clear_bookmarks').bl_label }}** — removes every bookmark from the scene, behind a confirmation dialog (toggleable in *Preferences > Interface > Confirmations*).

## :material-keyboard: Hotkeys

Bookmarks have no dedicated hotkey — they're added and removed via the right-click menu on any property.
