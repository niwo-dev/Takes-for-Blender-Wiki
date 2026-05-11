---
icon: material/magnify-scan
---

# Inspector Panel

**Location:** *3D Viewport > Sidebar (++n++) > Takes tab > Inspector*

The Inspector Panel provides a per-object watchlist showing which objects are managed by the cascade system, their assigned actions, slots, and sub-data (materials, node trees, shape keys).

## :material-toggle-switch: Watchlist vs. Channels

The Inspector body has a **top-level mode toggle** that swaps the entire view:

| Mode | What it shows |
|------|---------------|
| **Watchlist** (default) | Managed / pinned objects with their actions, slots, and sub-data icons. The rest of this page covers this mode. |
| **Channels** | A property-centric view — every animatable property the active object exposes, grouped into Transform, Visibility, Modifiers, etc. Includes a **Slotted / Channels** sub-mode toggle, a Bookmarks shelf, and Timeline Controls. Useful for keyframing a specific property without leaving the Inspector. |

The toggle lives in the Inspector header — its state is stored in `wm.tks_inspector_show_channels`, so it persists per Blender session.

## :material-pin: Managed vs. Pinned

Objects in the watchlist have one of two states:

Managed
:   Follows the cascade system. The object's action is automatically assigned by the active View Layer's cascade.

Pinned
:   Exempt from cascade management. The object keeps its own action regardless of View Layer switches. Pin an object by clicking the **pin icon** on its row.

!!! warning "Unpinning"
    Unpinning an object that has an action will show a confirmation dialog,
    because the action will be replaced by the cascade assignment.

## :material-eye-outline: Watchlist

The watchlist shows all objects relevant to the current View Layer:

| Column | Description |
|--------|-------------|
| **Pin** | Toggle managed/pinned state. |
| **Name** | Object name (click to select in viewport). |
| **Sub-data icons** | Compact icons for each animated datablock (material, node tree, etc.). |

### :material-arrow-collapse: Compact Mode
In compact mode, sub-data icons appear as a row of small type-aware icons next to each object:

- **Bright icon** — Datablock has an action assigned
- **Dimmed icon** — No action on this datablock

Click any sub-data icon to open a popover for per-datablock action and slot management.

## :material-filter-variant: Filters

Filter the watchlist using the header buttons:

- **Pinned filter** — Show only pinned objects
- **Unpinned filter** — Show only managed objects

Filter icons are disabled (grayed out) when their count is zero.

## :material-play-box-multiple: Actions & Slots

Select an object in the watchlist to see its action and slot details in the lower section of the Inspector:

- **Actions list** — Shows all actions referencing this object
- **Slots list** — Shows all slots within the active action
- **Inline rename** — Double-click an action or slot name to rename it

## :material-keyboard: Hotkeys

When the Inspector is focused:

| Shortcut | Action |
|----------|--------|
| ++f2++ | Rename the selected action or slot. |
| ++del++ / ++x++ | Delete (action, slot, or watchlist entry — confirmation toggleable in *Preferences > UI > Confirmations*). |
| ++ctrl+i++ | Invert multi-selection. |

Datablock pickers (Action / Camera / World) follow the cascade convention:

| Shortcut | Action |
|----------|--------|
| ++alt++ + click | Clear the assigned datablock. |
| ++alt++ + click on **Find Action** | Show Scene & World datablocks instead of Object datablocks. |

See [Keyboard Shortcuts](hotkeys.md) for the full reference.
