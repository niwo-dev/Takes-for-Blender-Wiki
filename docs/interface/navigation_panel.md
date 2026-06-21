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
| **Warning indicators** | Conditional badges that appear when an issue is detected — preset dirty, missing preset, rest drift, slot mismatch, pending preview rename, cascade drift. Each one toggles its own warning sub-panel below the header. |
| **Save** | Appears in red when there are unsaved preference changes; click to save. |
| **Help** | Opens the documentation (this wiki). |
| **Settings (gear)** | Click — opens the addon's preferences. **Alt+Click** — toggles the hidden diagnostic panel ([Process Monitor / Debug Console / View Layer Switch Profiler](../features/process_monitor.md)). |

**Bottom row (panel switcher):**

Clicking a tab is **exclusive** — it shows that panel and hides the others.

<!-- Tab labels are pulled from the addon's manifest so they auto-update if a
     panel's bl_label changes. -->

| Tab | Shows |
|-----|-------|
| **{{ panel('TKS_PT_Globals').bl_label }}** (world icon, no text label) | Project-wide settings, presets, rules, tags, Variant Switch — see [Globals Panel](../features/globals.md). |
| **{{ panel('TKS_PT_Context').bl_label }}** | The Takes Tree and per–View Layer cascade. |
| **{{ panel('TKS_PT_Inspector').bl_label }}** | Watchlist of managed/pinned objects, actions, slots, channels. |
| **{{ panel('TKS_PT_BatchRender').bl_label }}** | Render queue and modal/background controls. |

A **link toggle** (🔗 / 🔓) sits between Context and Inspector. With it on, clicking either reveals both at once; with it off, the switcher returns to one-at-a-time mode.

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

### :material-format-list-bulleted: Row Elements
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

### :material-vector-line: Tree Lines
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

The Navigation Panel header surfaces conditional warning badges whenever the addon detects an inconsistency. Each badge is a toggle: click it to expand the matching warning sub-panel below the header. Badges only appear when their condition is met — a clean session shows none.

| Badge icon | Trigger | What it surfaces |
|------------|---------|------------------|
| Preset (gear) | One or more render-related presets are **dirty** (edited live, not saved). | Per-tier list of dirty preset types and Accept / Revert controls. |
| Unlinked | One or more cascade preset references point to a JSON file that no longer exists. | Missing-preset list with file paths so you can re-import or re-create. |
| Ghost | The Rest Action is drifting from the current values for one or more managed objects. | Rest-drift list with per-property snap controls. |
| Font-data | A slot rename is pending — a slot's name no longer matches its template. | Slot-mismatch list with rename actions. |
| Image-data | One or more View Layer preview thumbnails have a pending rename after a Scene / VL rename. | Pending-preview-rename list with apply / dismiss controls. |
| Orphan-data | Cascade resolution drifted — a stored cascade value no longer matches the resolver's current output. | Cascade-drift list with re-sync actions. |

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
