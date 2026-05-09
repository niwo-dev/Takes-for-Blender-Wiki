---
icon: material/view-dashboard
---

# Interface

The Takes for Blender interface lives in the **3D Viewport sidebar** (press ++n++ in the 3D Viewport, then click the **Takes** tab). The Navigation Panel sits at the top with a switcher row that picks which body panel is shown below it.

## :material-view-grid: Panel Overview

| Panel | Purpose |
|-------|---------|
| [**Navigation Panel**](navigation_panel.md) | Persistent header with shared toggles, warning indicators, and the panel switcher. |
| [**Context Properties**](context_properties.md) | The Takes Tree and per–View Layer cascade overrides — cameras, worlds, compositors, actions, presets. |
| [**Inspector Panel**](inspector_panel.md) | Watchlist of managed / pinned objects with their actions, slots, channels, and sub-data. |
| **Batch Render** | Render queue and modal / background render controls. See [Batch Render](../features/batch_render.md). |
| [**Globals Panel**](../features/globals.md) | Project-wide settings, presets, automation rules, tags, and the [Variant Tree](variant_tree.md). |

## :material-tab: Panel Switcher

The Navigation Panel's bottom row is a switcher of buttons — clicking one is **exclusive**: it shows that panel and hides the others.

| Tab | Icon | Shows |
|-----|------|-------|
| **Globals** | world (icon-only, no text label) | Project-wide settings, presets, automation rules, tags, Variant Switch. |
| **Context** | scene | Takes Tree and per–View Layer cascade properties. |
| **Inspector** | preset | Watchlist, channels, actions, slots. |
| **Batch Render** | render-still | Render queue and modal / background controls. |

A **link toggle** (🔗 / 🔓) sits between Context and Inspector. Switch it on to keep both panels open at once — clicking Context will also reveal Inspector and vice versa. Switch it off and the switcher returns to one-at-a-time mode.

Tree, list, and cascade-icon shortcuts work consistently across these panels — see [Keyboard Shortcuts](hotkeys.md) for the full reference.

