---
icon: material/tune-vertical
---

# Context Properties

**Location:** *3D Viewport > Sidebar (++n++) > Takes tab > Context*

The Context Properties panel shows the cascade override settings for the currently active View Layer. Each property category has its own popover accessible via the cascade icons in the tree.

## :material-arrow-decision: Cascade Popovers

Click any cascade icon on a tree row to open its popover. Each popover allows you to set or clear an override at that specific hierarchy level.

### :material-camera: Camera Popover
Assign a per-View Layer camera:

- **Camera selector** — Dropdown showing only camera objects linked to the current scene.
- **Camera preset** — Apply a saved camera preset (focal length, sensor size, etc.).
- **New / Rename** — Create a new camera or rename the assigned one.

!!! note "Camera Guard"
    The camera preset UI is disabled when the selected object is not the
    cascade-resolved camera. An info message shows "Assign a camera in the cascade."

### :material-earth: World Popover
Assign a per-View Layer world environment:

- **World selector** — Choose from available world datablocks.
- **World preset** — Apply a saved world preset.
- **World rule** — Use a tag-based rule for automatic world selection.

### :material-play-box-multiple: Action Popover
View and manage the cascade action assignment:

- **Current action** — The resolved cascade action for this View Layer.
- **Re-apply Cascade** — Restore the cascade action after manual clearing.

### :material-vector-link: Compositor Popover
Assign a per-View Layer compositor node tree.

### :material-export: Output Popover
Configure every output-side preset for this tier in one place. Five preset slots plus the cascade rule:

- **Output Rule** — Tag-driven [Rule](../features/rules.md) that drives all five slots below in one click.
- **Render preset** — Engine, samples, resolution.
- **File Output preset** — Format, color depth, compression, Smart Output paths.
- **Output preset** — Container, dimensions, frame range.
- **View Layer preset** — Active passes, light groups, holdouts.
- **Color Management preset** — View transform, look, exposure.

Each slot can be set independently, or pre-filled by selecting an Output Rule at the top — the rule pushes its bundled presets into every slot. Per-slot Accept / Revert controls handle dirty-state edits.

## :material-stairs: Override Resolution

Overrides are resolved from the **most specific tier upward**. The first non-empty value wins, so a value set on the View Layer Version overrides everything else; a value set on the View Layer overrides everything except the Version; and so on, with Global as the final fallback.

Resolution priority (highest → lowest):

```
View Layer Version → View Layer → View Layer Group → Scene → Scene Group → Global
```

An icon appears **bright** when a value is set at that level, and **dimmed** when inherited from a higher tier in the hierarchy.

## :material-keyboard: Hotkeys

Cascade icons in the Context panel respond to modifier-clicks:

| Shortcut | Action |
|----------|--------|
| Click | Open the cascade popover. |
| ++alt++ + click | Clear the override at this tier. |
| ++shift++ + click | Toggle this property across all items of the same type in the active scene. |
| ++ctrl+shift++ + click | Toggle this property globally across every scene and group. |

Datablock pickers (Camera / World / Action / Compositor) accept ++alt++-click to clear. See [Keyboard Shortcuts](hotkeys.md) for the full reference.
