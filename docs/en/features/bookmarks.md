---
icon: material/bookmark-multiple
---

# Bookmarks

**Bookmarks** are quick-access pointers to animatable properties scattered across Blender's UI. Bookmark a property once and it shows up as an editable row inside the Inspector's Channels view, no matter where the original control lives.

## What Gets Bookmarked

Any animatable property — anywhere a right-click menu offers *"Bookmark Property"*:

- Object transforms (`location`, `rotation_euler`, `scale`).
- Modifier values.
- Material / shader-node inputs.
- World shader properties.
- Custom properties (`["MyProperty"]`).
- Shape keys, particle settings, and other RNA paths.

## Adding a Bookmark

1. Right-click any animatable property in any panel (Properties, N-panel, Geometry Nodes, etc.).
2. Choose **Bookmark Property**.
3. The bookmark appears in the Inspector's **Channels** view, grouped by target type.

## Removing a Bookmark

In the Inspector Channels view, click the **×** / Remove button on the bookmark row.

## Where Bookmarks Live

- **Scope:** per-Scene (stored as `scene.tks_bookmarked_properties`).
- **Persistence:** saved with the `.blend`.
- **Visibility:** shown wherever the target object / material / world is currently active.

## Bookmark Presets

Bookmark sets can be saved as a **Bookmark preset** (one of the 9 preset categories — see [Render Presets](render_presets.md)). Use this to share a curated channel layout across scenes or with collaborators.

## Hotkeys

| Shortcut | Action |
|----------|--------|
| ++del++ / ++x++ | Delete bookmark (confirmation toggleable in *Preferences > UI > Confirmations*). |

Bookmarks otherwise have no dedicated hotkey — they're added via the right-click menu on any property.
