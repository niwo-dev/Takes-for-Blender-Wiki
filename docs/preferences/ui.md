---
icon: material/view-dashboard
---

# UI Tab

*Confirmation dialogs, list row heights, column visibility, tree appearance.*

## :material-comment-question: Confirmations

Every confirmation dialog can be disabled. All default to **on**. Categorised:

| Category | Settings |
|----------|----------|
| Tree | Delete Selected Item, Delete Scene, Delete View Layer, Delete Scene Group, Delete View Layer Group, Delete Version. |
| Inspector | Rename Action, Remove from Watchlist, Delete Action, Delete Slot, Delete Keyframe. |
| Globals | Delete Tag, Delete Tag/Variant Group, Delete Variant, Delete Bookmark. |
| Batch Render | Start Batch Render, Overwrite Existing Files. |
| System | Orphan Cleanup, Override Persistence, Shortcut Override. |
| Data Integrity | Rest State Protection, Locked Take Protection, Pinned Object Protection, Shared Resource Safety. |

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
