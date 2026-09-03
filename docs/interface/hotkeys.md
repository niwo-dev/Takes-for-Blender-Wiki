---
icon: material/keyboard
---

# Keyboard Shortcuts

Every Takes shortcut works inside the **3D Viewport sidebar** only. Press ++n++ to open it.

Keys shared by several lists are focus-aware: only the active list reacts.

---

## :material-dots-circle: Pie Menu

| Shortcut | Action |
|----------|--------|
| {{ keys('wm.call_menu_pie') }} | **Open Navigation Pie Menu** — eight slots, all reassignable. |
| ++f12++ | **F12 Render Pie** — pick a render scope before rendering. Off by default. |
| ++i++ | **Keyframe Pie** — replaces Blender's native insert menu. Off by default. |
| ++alt+i++ | **Clear Pie** — a pie of keyframe-clearing actions. Off by default. |
| ++shift+alt+q++ | **[Mode Pie](../features/pie_menus.md#mode-pie)** — the Navigation Panel's mode toggles at your cursor. Off by default. |

??? info "Default slots, and how to change them"
    West **Tree View**, East **Watchlist**, South **Slotted Mode**, North **Rules**,
    NW **Variants**, NE **Tags**, SW **Batch Render**, SE **Channels**.

    Reassign any slot in *Preferences > Workflow > Pie & Misc*. The four
    optional pies have their master toggles there too.

---

## :material-file-tree: Tree Edits

*These keys hit the list that has focus: Takes Tree, Tag Library, or Variant Tree.*

<!-- The shortcut column is generated from the addon's keymap manifest.
     If a binding changes in the addon source, this table updates on the
     next deploy. -->

| Shortcut | Action | Notes |
|----------|--------|-------|
| {{ keys('tks.global_delete') }} | **Delete** | Asks first. Removes the whole multi-selection. |
| {{ keys('tks.global_rename') }} | **Rename** | Opens the rename dialog. |
| {{ keys('tks.global_new') }} | **New (smart)** | Adds what fits the selected row. On a View Layer: a Take. |
| {{ keys('tks.global_new_menu') }} | **New (menu)** | Always opens the add menu instead. Takes Tree only. |
| {{ keys('tks.global_add_menu') }} | **Add Menu** | Opens the full add menu. |
| {{ keys('tks.global_group') }} | **Group** | Wraps the selection in a group. |
| {{ keys('tks.global_ungroup') }} | **Ungroup** | Takes the selection out of its group. |
| {{ keys('tks.global_retarget') }} | **Retarget** | Moves the selected item to another parent. |
| {{ keys('tks.global_duplicate') }} | **Duplicate** | Two bindings: full copy and linked copy. |

*The expand chevron on Scene, Group and View Layer rows answers to modifiers. Take rows are the end of a branch, so they carry no chevron.*

| Shortcut | Reach |
|----------|-------|
| Click | Just this row. |
| ++ctrl++ + click | This row **and all its nested children**. |
| ++shift++ + click | **All rows of the same type**, like Blender's Outliner. |
| ++alt+shift++ + click | **Every row in the tree**, whatever its type. |

??? info "Delete and New, in detail"
    Switch the delete confirmation off in *Preferences > Interface > Confirmations*.

    Deleting a Scene's only View Layer deletes the Scene as well — see
    [Deleting a Scene's last View Layer](context_properties.md#deleting-a-scenes-last-view-layer).

    On Scene and Group rows, **New (smart)** either creates straight away or opens
    a menu. You pick which in *Preferences > Workflow > Pie & Misc > Add Context*.

---

## :material-camera: Cameras

| Shortcut | Action | Notes |
|----------|--------|-------|
| ++shift+alt+h++ | **Isolate** | Shows this take's camera and puts the others away. Works whatever **Apply When** is set to. |

*The same button sits at the foot of the Takes Tree row menu. It is greyed out
while **Camera Visibility** is switched off. See
[Show One Camera at a Time](../workflows/show_one_camera.md).*

---

## :material-checkbox-multiple-marked-outline: Multi-Select

*Turn it on with the **☐** icon in a list's stats row.*

| Shortcut | Action |
|----------|--------|
| ++shift++ + click the toggle | **Select All** visible items. Active type filters still apply. |
| ++alt++ + click the toggle | **Invert** the selection. |
| ++ctrl+i++ | **Invert** — the same, from the keyboard. |
| Click a stat icon | **Type Filter**: show only that type. Click again to clear. |

---

## :material-magnify-scan: Inspector

*With the Inspector focused.*

| Shortcut | Action |
|----------|--------|
| ++f2++ | **Rename** the selected action or slot. |
| ++del++ / ++x++ | **Delete** an action, slot or watchlist entry. Asks first. |
| ++ctrl+i++ | **Invert** the multi-selection. |

*The trash button in the Channels frame-navigation bar widens with modifiers.*

| Shortcut | Scope |
|----------|-------|
| Click | Keys of the **selected target type** at the **current frame**. |
| ++alt++ + click | Keys of **all target types** at the current frame. |
| ++shift++ + click | Keys of the selected target type across the **whole timeline**. |
| ++shift+alt++ + click | **Everything** — all target types, whole timeline. |

---

## :material-swap-horizontal: Variant Tree

The Variant Tree takes the same [Tree Edits](#tree-edits) keys. **Delete** always keeps one State and one Part per Product.

*On the variant cascade icons in the **Takes tree**:*

| Shortcut | Action |
|----------|--------|
| Click | Open the variant popover. |
| ++alt++ + click | Clear the variant override at this tier. |
| ++alt+shift++ + click | Clear it here **and** on every tier beneath it. |

*On **State** and **Part** rows in the Variant Tree:*

| Shortcut | Action |
|----------|--------|
| Click | Open the row's popover. |
| ++alt++ + click | Clear this row's collection. |

---

## :material-arrow-decision: Cascade Icons

*Modifier-clicks on the cascade icons beside a tree row.*

| Shortcut | Action |
|----------|--------|
| Click | Open the quick list and pick a value. |
| ++shift++ + click | Open the full popover, with **+**, rename and inherited value. |
| ++alt++ + click | Clear the override at this tier, so it inherits again. |
| ++shift+alt++ + click | Clear this tier **and** every tier below it. |
| ++ctrl+shift+alt++ + click | Delete the datablock from the file. |

---

## :material-image-multiple: Render Queue

*Modifier-clicks on the render toggle beside a View Layer.*

| Shortcut | Action |
|----------|--------|
| Click | Turn this View Layer on or off in the queue. |
| ++alt++ + click | **Preview Render** — open its newest rendered image in the Render Result. Needs a finished render. |
| ++ctrl++ + click | **Render & save** it through the queue. |
| ++shift++ + click | Toggle every View Layer in this scene. |
| Click **Render All Previews** | Preview the selected View Layers. |
| ++alt++ + click **Render All Previews** | Preview every View Layer in every scene. |

---

## :material-progress-clock: Batch Render

| Shortcut | Action |
|----------|--------|
| {{ keys('tks.render_jobs_popover') }} | **Render Jobs** — the overview of every job the batch would render. |
| ++esc++ | Cancel the running batch render. |
| ++alt++ + click a render scope row | Force-render every View Layer, even completed ones. |
| ++alt++ + click the **Render** button | Force-reset a stuck render. |

---

## :material-database-eye: Datablock Pickers

*Action, Camera, World and Compositor pickers.*

| Shortcut | Action |
|----------|--------|
| Click | Open the picker. |
| ++alt++ + click | Clear the assigned datablock at this tier. |
| ++shift++ + click **Find Action** | Show Scene and World datablocks instead of Object ones. |
| ++alt++ + click **Find Action** | Turn **Follow Selection** on or off. |

---

## :material-palette-swatch: Preset Rows

*Preset selectors on cascade rows and in the Globals panel.*

| Shortcut | Action |
|----------|--------|
| Click the preset field | Search and assign a preset. |
| ++alt++ + click the preset icon | Clear the assignment at this tier. |
| ++alt++ + click **Accept** | Save the dirty preset **and** push it to every scene using it. |
| ++alt++ + click the clear **X** | Delete the preset file, after a confirmation. |

---

## :material-bug: Logging Topics

*Modifier-clicks in Preferences > Developer > Topics.*

| Shortcut | Action |
|----------|--------|
| Click | Toggle the parent topic. |
| ++shift++ + click | Enable every subtopic in this category. |
| ++alt++ + click | Invert the subtopic selection. |

---

## :material-rename-box: Rename Dialogs

*Blender's standard text entry.*

| Shortcut | Action |
|----------|--------|
| ++enter++ | Confirm the rename. |
| ++esc++ | Cancel. |
| ++tab++ | Jump to the next field. |

---

## :material-link-variant: Blender-Native Keys

*Blender's own keys that Takes reacts to, without binding them.*

| Shortcut | What it does |
|----------|--------------|
| ++i++ | Insert keyframe. Rest State mirrors the unkeyed value for you. |
| ++alt+i++ | Delete keyframe. The property snaps back to its Rest value. |
| ++n++ | Toggle the sidebar, where the **Takes** tab lives. |
| ++f3++ | Operator search. A few housekeeping tools live only there. |

??? info "Changing a shortcut"
    Every binding here is a normal Blender keymap entry. To change a key,
    open *Edit > Preferences > Keymap*, search for the operator id (e.g.
    `tks.global_rename`), and edit it like any other shortcut.
