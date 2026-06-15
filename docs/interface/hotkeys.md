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
| {{ keys('wm.call_menu_pie') }} | **Open Navigation Pie Menu** | 8 configurable slots — defaults: West Tree View, East Watchlist, South Slotted Mode, North Rules, NW Variants, NE Tags, SW Batch Render, SE Channels. Reassign each slot in *Preferences > Workflow > Pie Menu*. |

---

## :material-file-tree: Tree Edits

*Generic create / rename / delete shortcuts. They target the active list — Takes Tree, Tag Library, or Variant Tree — depending on what has focus.*

<!-- The shortcut column is generated from the addon's keymap manifest.
     If a binding changes in the addon source, this table updates on the
     next deploy. -->

| Shortcut | Action | Notes |
|----------|--------|-------|
| {{ keys('tks.global_delete') }} | **Delete** | Confirmation dialog by default (toggleable in *Preferences > UI > Confirmations*). In multi-select, deletes all selected items at once. |
| {{ keys('tks.global_rename') }} | **Rename** | Opens the rename dialog. |
| {{ keys('tks.global_new') }} | **New (smart)** | Adds a new item appropriate to the current selection. |
| {{ keys('tks.global_add_menu') }} | **Add Menu** | Opens the full add menu. |
| {{ keys('tks.global_group') }} | **Group** | Wraps the selection in a Scene Group, View Layer Group, or Tag Group. |
| {{ keys('tks.global_ungroup') }} | **Ungroup** | Removes the selection from its group. |
| {{ keys('tks.global_retarget') }} | **Retarget** | Move the selected item to another parent. |
| {{ keys('tks.global_duplicate') }} | **Duplicate** | Two bindings: full copy and linked copy. |

---

## :material-checkbox-multiple-marked-outline: Multi-Select

*Activated by clicking the **☐** icon in the stats row of any list.*

| Shortcut | Action | Notes |
|----------|--------|-------|
| ++shift++ + click toggle | **Select All** | Selects every visible item. Respects active type filters. |
| ++alt++ + click toggle | **Invert** | Inverts the selection. |
| ++ctrl+i++ | **Invert** | Keyboard equivalent of Alt+Click invert. |
| Click stat icon | **Type Filter** | Filters checkboxes to a specific type (e.g. only Scenes). Click again to clear. |

---

## :material-arrow-decision: Cascade Icons

*Modifier-clicks on the cascade icons next to each tree row.*

| Shortcut | Action |
|----------|--------|
| Click | Open the cascade popover for this property. |
| ++alt++ + click | Clear the override at this tier (revert to inherited value). |
| ++shift++ + click | Toggle the same property across **all items of the same type** in the active scene. |
| ++ctrl+shift++ + click | Toggle the same property **globally** across all scenes and groups. |

---

## :material-image-multiple: Render Queue

*Modifier-clicks on the render-toggle icon next to each View Layer.*

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

## :material-progress-clock: Batch Render

*While a batch render is running.*

| Shortcut | Action |
|----------|--------|
| ++esc++ | Cancel the batch render. The status line shows `(ESC to cancel)` while running. |
| ++alt++ + click on the Render button | Force-reset a stuck render state. |

---

## :material-database-eye: Datablock Pickers

*Action, Camera, World, and Compositor pickers.*

| Shortcut | Action |
|----------|--------|
| Click | Open the picker dialog. |
| ++alt++ + click | Clear the assigned datablock at this tier. |
| ++alt++ + click on **Find Action** | Show Scene & World datablocks instead of Object datablocks. |

---

## :material-bug: Logging Topics

*Modifier-clicks in *Preferences > Debug > Topics*.*

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

## :material-link-variant: Blender-Native Keys

*Standard Blender shortcuts that trigger Takes behaviour even though the addon doesn't bind them.*

| Shortcut | What it does | Why it matters |
|----------|--------------|----------------|
| ++i++ | Insert keyframe (Blender native) | Triggers Rest State auto-mirror so the unkeyed value is preserved. |
| ++alt+i++ | Delete keyframe (Blender native) | The deleted property snaps back to its Rest value automatically. |
| ++n++ | Toggle 3D Viewport sidebar (Blender native) | Shows / hides the **Takes** tab. |

!!! note "Customizing Hotkeys"
    Each binding above is a normal Blender keymap entry. To change a key,
    open *Edit > Preferences > Keymap*, search for the operator id (e.g.
    `tks.global_rename`), and edit it like any other shortcut.
