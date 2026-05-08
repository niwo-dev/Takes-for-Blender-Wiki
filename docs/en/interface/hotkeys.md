---
icon: material/keyboard
---

# Keyboard Shortcuts

All Takes-for-Blender shortcuts are scoped to the **3D Viewport sidebar** (press ++n++ to toggle the sidebar), so they never collide with Blender's native shortcuts elsewhere.

Hotkeys that share a key across lists are **focus-aware** — only the visible/active list responds.

---

## :material-dots-circle: Pie Menu

| Shortcut | Action | Notes |
|----------|--------|-------|
| ++ctrl+shift+c++ | **Open Navigation Pie Menu** | 8 configurable slots — defaults: West Tree View, East Watchlist, South Slotted Mode, North Rules, NW Variants, NE Tags, SW Batch Render, SE Channels. Reassign each slot in *Preferences > Workflow > Pie Menu*. |

---

## :material-file-tree: Tree, Tags, Variants — Generic Edit Shortcuts

These run against the **active list** (Takes Tree, Tag Library, or Variant Tree, depending on what currently has focus).

| Shortcut | Action | Notes |
|----------|--------|-------|
| ++del++ / ++x++ | **Delete** | Confirmation dialog by default (toggleable in *Preferences > UI > Confirmations*). In multi-select, deletes all selected items at once. |
| ++f2++ | **Rename** | Opens the rename dialog. |
| ++ctrl+n++ | **New (smart)** | Adds a new item appropriate to the current selection. |
| ++shift+a++ | **Add Menu** | Opens the full add menu. |
| ++ctrl+g++ | **Group** | Wraps the selection in a Scene Group, View Layer Group, or Tag Group. |
| ++alt+g++ | **Ungroup** | Removes the selection from its group. |
| ++ctrl+t++ | **Retarget** | Move the selected item to another parent. |
| ++shift+d++ | **Duplicate (full copy)** | Independent copy. |
| ++alt+d++ | **Duplicate (linked)** | Shared reference. |

---

## :material-checkbox-multiple-marked-outline: Multi-Select Mode

Multi-select is activated by clicking the **☐** icon in the stats row of any list. While active:

| Shortcut | Action | Notes |
|----------|--------|-------|
| ++shift++ + click toggle | **Select All** | Selects every visible item. Respects active type filters. |
| ++alt++ + click toggle | **Invert** | Inverts the selection. |
| ++ctrl+i++ | **Invert** | Keyboard equivalent of Alt+Click invert. |
| Click stat icon | **Type Filter** | Filters checkboxes to a specific type (e.g. only Scenes). Click again to clear. |

---

## :material-arrow-decision: Cascade Icons (Tree Rows)

Each cascade icon on a tree row supports modifier-clicks:

| Shortcut | Action |
|----------|--------|
| Click | Open the cascade popover for this property. |
| ++alt++ + click | Clear the override at this tier (revert to inherited value). |
| ++shift++ + click | Toggle the same property across **all items of the same type** in the active scene. |
| ++ctrl+shift++ + click | Toggle the same property **globally** across all scenes and groups. |

---

## :material-image-multiple: Render Queue / View Layer Render Toggle

The render-toggle icon next to each View Layer accepts modifiers:

| Shortcut | Action |
|----------|--------|
| Click | Toggle the View Layer's enabled state in the queue. |
| ++alt++ + click | **Preview** the View Layer immediately (single-frame snapshot). |
| ++ctrl++ + click | **Render & save** the View Layer through the queue. |
| ++shift++ + click | Toggle **all** View Layers in the current scene. |

The "Render All Previews" button:

| Shortcut | Action |
|----------|--------|
| Click | Render previews for the selected / multi-selected View Layers. |
| ++alt++ + click | Render previews for **every** View Layer across all scenes. |

---

## :material-progress-clock: Batch Render Modal

While a batch render is running:

| Shortcut | Action |
|----------|--------|
| ++esc++ | Cancel the batch render. The status line shows `(ESC to cancel)` while running. |
| ++alt++ + click on the Render button | Force-reset a stuck render state. |

---

## :material-database-eye: Datablock Pickers (Action / Camera / World / Compositor)

| Shortcut | Action |
|----------|--------|
| Click | Open the picker dialog. |
| ++alt++ + click | Clear the assigned datablock at this tier. |
| ++alt++ + click on **Find Action** | Show Scene & World datablocks instead of Object datablocks. |

---

## :material-bug: Logging Topics (Preferences)

In *Preferences > Debug > Topics*:

| Shortcut | Action |
|----------|--------|
| Click | Toggle the parent topic. |
| ++shift++ + click | Enable **all** subtopics in this category. |
| ++alt++ + click | Invert subtopic selection. |

---

## :material-rename-box: Rename Dialogs

Rename dialogs use Blender's standard text-entry behavior:

| Shortcut | Action |
|----------|--------|
| ++enter++ | Confirm rename. |
| ++esc++ | Cancel. |
| ++tab++ | Move to next field. |

---

## :material-link-variant: Native Blender Shortcuts the Addon Reacts To

Some Blender shortcuts trigger Takes behavior even though the addon doesn't bind them:

| Shortcut | What it does | Why it matters |
|----------|--------------|----------------|
| ++i++ | Insert keyframe (Blender native) | Triggers Reference State auto-mirror so the unkeyed value is preserved. |
| ++alt+i++ | Delete keyframe (Blender native) | The deleted property snaps back to its Reference value automatically. |
| ++n++ | Toggle 3D Viewport sidebar (Blender native) | Shows / hides the **Takes** tab. |

!!! note "Customizing Hotkeys"
    Each binding above is a normal Blender keymap entry. To change a key,
    open *Edit > Preferences > Keymap*, search for the operator id (e.g.
    `tks.global_rename`), and edit it like any other shortcut.
