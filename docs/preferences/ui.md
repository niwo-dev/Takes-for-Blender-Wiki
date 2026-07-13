---
icon: material/view-dashboard
---

# Interface Tab

*Confirmation dialogs, list row heights, column visibility, tree appearance.*

## :material-comment-question: Confirmations

Every confirmation dialog can be disabled. All default to **on**. Categorised:

| Category | Settings |
|----------|----------|
| Context | Delete Selected Item (Tree), Delete Scene, Delete View Layer, Delete Scene Group, Delete View Layer Group, Delete Version. |
| Inspector | Rename Action, Remove from Watchlist, Delete Action, Delete Slot, Clean Empty Slots/Actions, Delete Keyframe. |
| Globals | Delete Tag, Delete Tag/Variant Group, Delete Variant, Delete Bookmark, Delete Custom Token. |
| Batch Render | Start Batch Render, Overwrite Existing Files. |
| System | Orphan Cleanup, Override Persistence, Shortcut Override. |
| Data Integrity | Rest State Protection, Locked Take Protection, Pinned Object Protection, Shared Resource Safety. |

The *Context* through *Batch Render* entries confirm the delete or start action
they are named after. The **System** and **Data Integrity** ones are less
obvious:

| Confirmation | What it guards |
|--------------|----------------|
| **Orphan Cleanup** | Cleaning up unused add-on data. |
| **Override Persistence** | Overriding property-persistence rules — this one also gates deleting a preference config and resetting preferences to defaults. |
| **Shortcut Override** | Resetting the add-on's global hotkeys back to their defaults. |
| **Rest State Protection** | Edits to properties guarded by the Rest State (frame 0). |
| **Locked Take Protection** | Changes to View Layers you have explicitly locked. |
| **Pinned Object Protection** | Changes to objects pinned to a specific Rest State. |
| **Shared Resource Safety** | Edits to shared render presets and other library resources. |

### :material-information-outline: Info Boxes

The same sub-tab ends with two switches for the explanatory boxes drawn
throughout the add-on:

| Setting | Default | Description |
|---------|---------|-------------|
| **Show Tip Boxes** | On | The tip / info boxes that explain a workflow where you meet it. Turn off to declutter once you know the ropes — warnings still appear when there's an actual problem. |
| **Show Warning Details** | On | The explanation paragraphs *inside* warning panels (what a problem means and why it matters). The warning headline and its fix buttons always stay. |

You don't have to come here to switch them off: every tip or warning box
carries a **✕** (`tks.dismiss_info_boxes`) that — after a quick confirmation —
hides that whole category everywhere at once. These two switches are where you
bring the boxes back.

## :material-format-list-bulleted-square: Lists

Master and per-list row-height overrides. Range 5–30. The **Default List Rows** master propagates to every list that hasn't been overridden:

Objects, Actions, Slots, Scenes, View Layers, Takes Tree, Scene Groups, View Layer Groups, View Layer Versions, Tags, Variant Switch Products, Process Monitor, Debug Log, Profiler, Batch Queue, Preferences Setup.

## :material-table-column: Columns

Toggle column visibility:

| Column | List |
|--------|------|
| Action / Slot | Objects |
| Slot Count / Key Count / Fake User | Actions |
| User Count / Key Count / Action | Slots |

All default to **on**.

## :material-file-tree: Tree

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Default Tree Icons** (9) | bool | On | Per-icon visibility — Rest State, Tag, Render, Variant, Action, Compositor, World, Camera, Automation Rule. |
| **Default Tree Pin Icons** (8) | bool | Off | Per-icon pin-toggle visibility for the same set. |
| **Collapse Mode** | enum | DYNAMIC | When the cascade-icon overflow `⋯` appears: DYNAMIC (auto by panel width) or ALWAYS. |
| **Collapse Width** | int | 600 | Pixel threshold for DYNAMIC collapse. Range 200–800. |
| **Show Tag Color** | bool | On | Tints tree connection lines by tag colour. |
| **Tree Line Width** | enum | MEDIUM | THIN / MEDIUM / WIDE. |
| **Tree Line Color** | colour | grey | RGBA colour for connection lines. |
| **Active View Layer Color** | colour | gold | RGBA colour for the active View Layer highlight. |

## :material-monitor-dashboard: Viewport Overlay

A status banner drawn directly in the 3D viewport: one colored pill per
active mode you choose to surface (Autokey, Value Lock, Rest Mode, Still
Mode, Timeline Sync) plus a progress row for each running background task
(View-Layer Preload, Batch Render) — so a mode or a busy pause stays
visible even when the Takes panel is closed.

### :material-map-marker: Placement

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Position** | enum | Off | Corner or edge anchor for the banner; `Off` disables the overlay entirely. |
| **Offset X / Offset Y** | int | 0 | Pixel nudge from the chosen anchor. |
| **Hide While Panel Open** | bool | On | Suppresses the banner while the Takes N-panel is visible — the panel already shows the same state. |

### :material-palette: Appearance

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Opacity** | float | 0.9 | Banner transparency. |
| **Scale** | float | 1.0 | Overall size multiplier for the banner text and pills. |

### :material-toggle-switch: Modes

Pick which mode pills may appear. Each toggle only *allows* its pill — a
pill still shows only while its mode is actually active.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Show Mode Pills** | bool | On | Master switch for the mode-pill row. |
| **Autokey / Value Lock / Rest / Still / Timeline Sync** | bool | On | Per-mode pill visibility. |
| **Hide Modes While Panel Open** | bool | On | Suppresses only the pill row (progress rows stay) while the panel is open. |

### :material-progress-clock: Progress

Background tasks add a labelled progress bar under the pills: the
View-Layer Preload row (total run plus the layer currently building) and
the Batch Render row. Percentages align in a right-hand column. The rows
appear only while their task runs; there is nothing to configure beyond
the overlay master settings above.
