# Context Properties

**Location:** *Properties Editor > Takes tab > Context*

The Context Properties panel shows the cascade override settings for the currently active View Layer. Each property category has its own popover accessible via the cascade icons in the tree.

## Cascade Popovers

Click any cascade icon on a tree row to open its popover. Each popover allows you to set or clear an override at that specific hierarchy level.

### Camera Popover

Assign a per-View Layer camera:

- **Camera selector** — Dropdown showing only camera objects linked to the current scene.
- **Camera preset** — Apply a saved camera preset (focal length, sensor size, etc.).
- **New / Rename** — Create a new camera or rename the assigned one.

!!! note "Camera Guard"
    The camera preset UI is disabled when the selected object is not the
    cascade-resolved camera. An info message shows "Assign a camera in the cascade."

### World Popover

Assign a per-View Layer world environment:

- **World selector** — Choose from available world datablocks.
- **World preset** — Apply a saved world preset.
- **World rule** — Use a tag-based rule for automatic world selection.

### Action Popover

View and manage the cascade action assignment:

- **Current action** — The resolved cascade action for this View Layer.
- **Re-apply Cascade** — Restore the cascade action after manual clearing.

### Compositor Popover

Assign a per-View Layer compositor node tree.

### Output Popover

Configure render output settings:

- **Output rule** — Tag-based output path rule.
- **Render preset** — Per-View Layer render settings.

## Override Resolution

Overrides are resolved top-down through the cascade hierarchy. The first non-empty value wins:

```
Global → Scene Group → Scene → VL Group → View Layer → VL Version
```

An icon appears **bright** when a value is set at that level, and **dimmed** when inherited from a parent level.
