---
icon: material/compass
---

# Navigation Panel

**Location:** *3D Viewport > Sidebar (++n++) > Takes tab*

The Navigation Panel is the primary control center for managing your Takes hierarchy. It contains the Takes Tree, cascade override icons, and access to batch rendering.

## :material-page-layout-header: Header Controls

The header has two rows. The top row carries shared toggles, warning indicators, and quick-access buttons; the bottom row is the panel switcher (Context / Inspector / Batch Render / Globals).

**Top row — left side:**

| Control | Description |
|---------|-------------|
| **Autokey** | Toggles Blender's auto-keying across all scenes simultaneously. |
| **Timeline Sync** | Keeps the playhead in sync across scenes. |

**Top row — right side:**

| Control | Description |
|---------|-------------|
| **Warning indicators** | Conditional badges that appear when an issue is detected — preset dirty, missing preset, reference drift, slot mismatch, pending preview rename, cascade drift. Each one toggles its own warning sub-panel below the header. |
| **Save** | Appears in red when there are unsaved preference changes; click to save. |
| **Help** | Opens the documentation (this wiki). |
| **Settings (gear)** | Click — opens the addon's preferences. **Alt+Click** — toggles the hidden diagnostic panel ([Process Monitor / Debug Console / View Layer Switch Profiler](../features/process_monitor.md)). |

**Bottom row (panel switcher):**

| Tab | Shows |
|-----|-------|
| **Globals** (world icon) | Project-wide settings, presets, rules, tags, Variant Switch — see [Globals Panel](../features/globals.md). |
| **Context** | The Takes Tree and per–View Layer cascade. |
| **Inspector** | Watchlist of managed/pinned objects, actions, slots, channels. |
| **Batch Render** | Render queue and modal/background controls. |

Tabs are configured under *Preferences > UI* — disabled tabs are hidden from the switcher.

## :material-file-tree: The Takes Tree

The Takes Tree is a unified hierarchical list showing your entire project structure. The cascade has six tiers — five live in the tree, plus an implicit **Global** root that you edit from the [Globals](../features/globals.md) panel:

```
🌐 Global                       ← edited in the Globals panel
└─ 📁 Scene Group
   └─ 🎬 Scene
      └─ 📂 View Layer Group
         └─ 🔲 View Layer
            └─ 📌 View Layer Version
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

## :material-tune: Tree Display Settings

*Live behind the down-arrow icon (⌄) in the side column next to the tree, not under the header gear.*

Click the **down-arrow** next to the up/down move buttons in the Context tree's right-hand column to open the **Icon Visibility** popover:

| Setting | Description |
|---------|-------------|
| **Refresh Tree** | Force a full rebuild of the Takes Tree. |
| **Collection Visibility** | Copy / paste the collection-visibility set of the active View Layer. |
| **Previews** | Master toggle, viewport-snapshot button, render button, refresh, size, background colour, transparent background. See [View Layer Preview](../features/vl_preview.md). |
| **Cascade Icon Visibility** | Per-icon show/hide toggles (Tag, Variant, Action, Compositor, World, Camera, Output Rule). |
| **Pin** toggles | Force certain icons to always render (skip the overflow `⋯`). |

## :material-alert-outline: Warnings

The Navigation Panel shows warnings when issues are detected:

- **Missing Preset** — A cascade preset reference points to a deleted JSON file.
- **Dangling Action** — An action is about to be lost because Auto-Assign is disabled.

## :material-keyboard: Hotkeys

| Shortcut | Action |
|----------|--------|
| ++ctrl+shift+c++ | Open the [Navigation Pie Menu](../features/pie_menus.md). |
| ++ctrl+n++ | Add a new tree item (smart). |
| ++shift+a++ | Open the full add menu. |
| ++f2++ | Rename the selected item. |
| ++del++ / ++x++ | Delete (with confirmation). |
| ++ctrl+g++ / ++alt+g++ | Group / ungroup the selection. |
| ++ctrl+t++ | Retarget. |
| ++shift+d++ / ++alt+d++ | Duplicate (full / linked). |
| ++ctrl+i++ | Invert multi-selection. |

Cascade icons accept ++alt++-click to clear, ++shift++-click for scene-wide toggle, and ++ctrl+shift++-click for global toggle. The full reference lives at [Keyboard Shortcuts](hotkeys.md).
