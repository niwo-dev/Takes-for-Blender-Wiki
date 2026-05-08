---
icon: material/view-dashboard
---

# Interface

The Takes for Blender interface lives in the **3D Viewport sidebar** (press ++n++ in the 3D Viewport, then click the **Takes** tab). It consists of four main panels accessible via the tab bar at the top of the Navigation Panel.

## :material-view-grid: Panel Overview

| Panel | Purpose |
|-------|---------|
| [**Navigation Panel**](navigation_panel.md) | The primary control center — Take/View Layer switching, tree view, cascade icons, and batch render access. |
| [**Inspector Panel**](inspector_panel.md) | Per-object watchlist showing managed/pinned objects, their actions, slots, and sub-data. |
| [**Context Properties**](context_properties.md) | Per-View Layer cascade override properties — cameras, worlds, compositors, actions, and presets. |
| [**Variant Tree**](variant_tree.md) | Product variant management — products, states, parts, and material pools. |

## :material-tab: Navigation Tabs

The Navigation Panel header contains three toggle buttons that switch between Context, Link, and Inspector views:

- **Context** — The Takes Tree and per-View Layer settings
- **Link** — Collection linking and management
- **Inspector** — Object watchlist and action/slot management

!!! tip "Keyboard Shortcuts"
    Many tree operations support keyboard shortcuts:

    - ++ctrl+n++ — Add new item (context-aware)
    - ++shift+d++ — Duplicate (full copy)
    - ++alt+d++ — Duplicate (linked copy)
    - ++ctrl+g++ — Create group
    - ++alt+g++ — Ungroup
    - ++del++ or ++x++ — Delete with confirmation
    - ++f2++ — Rename
