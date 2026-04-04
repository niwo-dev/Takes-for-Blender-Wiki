---
icon: material/compass
---

# Navigation Panel

**Location:** *Properties Editor > Takes tab*

The Navigation Panel is the primary control center for managing your Takes hierarchy. It contains the Takes Tree, cascade override icons, and access to batch rendering.

## Header Controls

The panel header displays the addon version and provides quick-access buttons:

| Control | Description |
|---------|-------------|
| **Lock** | Locks the panel to prevent accidental state changes. |
| **Autokey** | Toggles Blender's auto-keying across all scenes simultaneously. |
| **Timeline Sync** | Synchronizes playhead position across scenes. |
| **Warnings** | Shows active warnings (missing presets, dangling actions). |
| **Globals** | Opens the global cascade settings. |
| **Help** | Opens the documentation (this wiki). |
| **Settings** | Tree visibility and design options. |

## The Takes Tree

The Takes Tree is a unified hierarchical list showing your entire project structure:

```
📁 Scene Group
  🎬 Scene
    📂 VL Group
      🔲 View Layer
        📌 VL Version
```

### Row Elements

Each View Layer row displays cascade override icons. These icons show at a glance which properties are overridden at that level:

- **Ghost** — Rest State status
- **Tag** — Assigned color tag
- **Variant** — Active variant switch state
- **Action** — Cascade action assignment
- **Compositor** — Node tree override
- **World** — World/environment override
- **Camera** — Camera assignment
- **Output** — Output tag/rule
- **Render** — Render preset

!!! tip "Cascade Icon Overflow"
    When the panel is narrow, cascade icons automatically collapse into an overflow
    **⋯** button. Clicking it opens a popover showing all icons in full.

### Tree Lines

Configurable indent lines show the hierarchy visually. Tag colors can be inherited by tree lines for quick identification.

## Settings Popover

Click the **gear icon** to access tree display settings:

| Setting | Description |
|---------|-------------|
| **Show Tag Color** | Color tree indent lines by tag assignment. |
| **Line Width** | Thin / Medium / Wide indent lines. |
| **Icon Visibility** | Toggle individual cascade icons on/off. |
| **Preview Size** | Thumbnail size for inline VL previews (24/32/40 px). |

## Warnings

The Navigation Panel shows warnings when issues are detected:

- **Missing Preset** — A cascade preset reference points to a deleted JSON file.
- **Dangling Action** — An action is about to be lost because Auto-Assign is disabled.
