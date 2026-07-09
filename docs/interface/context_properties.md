---
icon: material/tune-vertical
---

# Context Properties

**Location:** *3D Viewport > Sidebar (++n++) > Takes tab > Context*

The Context Properties panel shows the cascade override settings for the currently active View Layer. Each property category has its own popover accessible via the cascade icons in the tree.

## :material-arrow-decision: Cascade Popovers

Click any cascade icon on a tree row to open its popover. Each popover allows you to set or clear an override at that specific hierarchy level.

### :material-camera: Camera Popover
Assign a per-View Layer camera:

- **Camera selector** — Dropdown showing only camera objects linked to the current scene.
- **Camera preset** — Apply a saved camera preset (focal length, sensor size, etc.).
- **New / Rename** — Create a new camera or rename the assigned one.

!!! note "Camera Guard"
    The camera preset UI is disabled when the selected object is not the
    cascade-resolved camera. An info message shows "Assign a camera in the cascade."

### :material-earth: World Popover
Assign a per-View Layer world environment:

- **World selector** — Choose from available world datablocks.
- **World preset** — Apply a saved world preset.
- **World rule** — Use a tag-based rule for automatic world selection.

### :material-play-box-multiple: Action Popover
View and manage the cascade action assignment:

- **Current action** — The resolved cascade action for this View Layer.
- **Re-apply Cascade** — Restore the cascade action after manual clearing.

### :material-vector-link: Compositor Popover
Assign a per-View Layer compositor node tree.

### :material-export: Output Popover
Configure every output-side preset for this tier in one place. Five preset slots plus the cascade rule:

- **Output Rule** — Tag-driven [Rule](../features/rules.md) that drives all five slots below in one click.
- **Render preset** — Engine, samples, resolution.
- **File Output preset** — Format, color depth, compression, Smart Output paths.
- **Output preset** — Container, dimensions, frame range.
- **View Layer preset** — Active passes, light groups, holdouts.
- **Color Management preset** — View transform, look, exposure.

Each slot can be set independently, or pre-filled by selecting an Output Rule at the top — the rule pushes its bundled presets into every slot. Per-slot Accept / Revert controls handle dirty-state edits.

## :material-stairs: Override Resolution

Overrides are resolved from the **most specific tier upward**. The first non-empty value wins, so a value set on the View Layer Version overrides everything else; a value set on the View Layer overrides everything except the Version; and so on, with Global as the final fallback.

Resolution priority (highest → lowest):

```
View Layer Version → View Layer → View Layer Group → Scene → Scene Group → Global
```

An icon appears **bright** when a value is set at that level, and **dimmed** when inherited from a higher tier in the hierarchy.

## :material-file-tree: Tree Editing

The Takes Tree is edited entirely in place — every row can be added to, renamed, duplicated, moved, and deleted without leaving the panel. The operators are grouped by task below; their key bindings are documented once on [Keyboard Shortcuts](hotkeys.md#tree-edits) rather than repeated here.

### :material-plus-box: Adding & Duplicating

| Action | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.add_new_context_item').bl_label }}** | `tks.add_new_context_item` | The context-aware "add" behind the tree's smart-add shortcut. On a View Layer (or Version) row it instantly creates a new [Version](#view-layer-versions); on Scene and Group rows it creates whatever *Preferences > Workflow > Pie & Misc > Add Context* is set to — or opens the add menu so you can pick. |
| **{{ op('tks.duplicate_tree_item').bl_label }}** | `tks.duplicate_tree_item` | Duplicates the selected row. Two flavours: full copy and linked copy (Scenes only — View Layers have no linked concept). On a Version row it routes to **Duplicate Version** (see [View Layer Versions](#view-layer-versions)). |
| **{{ op('tks.add_viewlayer').bl_label }}** | `tks.add_viewlayer` | Adds a fresh View Layer to the active scene — the direct add the smart-add falls back to on scene rows when *Add Context* says View Layer. |
| **{{ op('tks.split_add_viewlayer').bl_label }}** | `tks.split_add_viewlayer` | Split-view counterpart: adds a View Layer to the scene selected in the split view rather than the active one. |

### :material-cursor-default-click: Renaming & Switching

| Action | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.rename_item').bl_label }}** | `tks.rename_item` | Inline rename for any tree row — type the new name, ++enter++ to confirm, ++esc++ to cancel. Works in both tree and split view. Groups have their own dialog-based rename (see [Scene & View Layer Groups](#scene-view-layer-groups)). |
| **{{ op('tks.switch_scene').bl_label }}** / **{{ op('tks.switch_viewlayer').bl_label }}** | `tks.switch_scene` / `tks.switch_viewlayer` | The selector dot at the left of each row — clicking it makes that Scene or View Layer the active one, which is what triggers the cascade to apply its overrides. |

### :material-arrow-all: Moving & Retargeting

| Action | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.move_all_viewlayer_item').bl_label }}** | `tks.move_all_viewlayer_item` | The up / down arrows in the tree's side column. Moves the selected Scene or View Layer within its siblings — a Scene header travels together with all its child View Layers. |
| **{{ op('tks.move_viewlayer').bl_label }}** | `tks.move_viewlayer` | The split-view equivalent — reorders a View Layer up or down within its group. |
| **{{ op('tks.move_to_group').bl_label }}** | `tks.move_to_group` | Moves an item into a different group picked from a dropdown — Scenes into Scene Groups, View Layers into View Layer Groups. |
| **{{ op('tks.retarget_tree_item').bl_label }}** | `tks.retarget_tree_item` | The retarget dispatcher behind the Retarget shortcut. It hands the selected row to the matching typed operator: `tks.retarget_scene` (Scene → another Scene Group), `tks.retarget_viewlayer` (View Layer → another group in the same scene), or `tks.retarget_vl_group` (merge a whole View Layer Group into another). |

### :material-delete-outline: Deleting

| Action | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.delete_scene').bl_label }}** / **{{ op('tks.delete_viewlayer').bl_label }}** | `tks.delete_scene` / `tks.delete_viewlayer` | Type-specific removal for Scene and View Layer rows. |
| **{{ op('tks.delete_context_item').bl_label }}** | `tks.delete_context_item` | Delete for the split view's right-hand list. |
| **{{ op('tks.delete_selected_context_items').bl_label }}** | `tks.delete_selected_context_items` | Multi-select delete — removes every checked item in one sweep, whatever the mix of types, honouring the active type filter. The default *Ungrouped* groups are protected. |

Deletion asks for confirmation by default — the toggle and the shared Delete shortcut are covered under [Keyboard Shortcuts](hotkeys.md#tree-edits).

### :material-camera-iris: Render Toggles

Each View Layer row carries its own render toggle (see [Render Queue](hotkeys.md#render-queue) for its modifier-clicks); the higher tiers get bulk versions:

| Action | Operator | Scope |
|--------|----------|-------|
| **{{ op('tks.toggle_scene_render').bl_label }}** | `tks.toggle_scene_render` | All View Layers in this Scene at once. |
| **{{ op('tks.toggle_group_render').bl_label }}** | `tks.toggle_group_render` | All members of a group — for a Scene Group that means every View Layer across its member scenes; for a View Layer Group, its member layers. |
| **{{ op('tks.toggle_global_render').bl_label }}** | `tks.toggle_global_render` | The Global root row — every View Layer in every Scene. |

### :material-broom: Tree Housekeeping

| Action | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.toggle_scene_expand').bl_label }}** | `tks.toggle_scene_expand` | The expand chevron on any hierarchical row. ++shift++ + click expands / collapses **all rows of the same type** at once (like the Outliner); ++ctrl++ + click toggles the row **and all its nested children**. |
| **{{ op('tks.refresh_tree').bl_label }}** | `tks.refresh_tree` | Forces a full rebuild of the tree when a structural change hasn't shown up yet. Also available in the [Tree Display Settings](navigation_panel.md#tree-display-settings) popover. |
| **Right-click menu** | `tks.open_tree_context_menu` | ++ctrl++ + right-click a tree row opens its context menu — a header identifying the row, plus **Show Overrides…**, which opens the full cascade-icon popover for that row. |

## :material-group: Scene & View Layer Groups

Scenes and View Layers can be organised into named **groups**, which become cascade tiers in their own right (see [Override Resolution](#override-resolution)). Grouping is driven from the tree's multi-select state or the active row.

### :material-folder-plus: Creating Groups

Select two or more rows of the same type, then create a group around them:

| Action | Operator | What it does |
|--------|----------|--------------|
| **Group Selected Scenes** | `tks.group_scenes` | Bundles the selected scenes into a new **Scene Group**, removing them from whatever group they were in. The new group is inserted right after the first selected scene's old group. |
| **Group Selected ViewLayers** | `tks.group_vls` | Bundles the selected View Layers into a new **View Layer Group**. All selected View Layers must belong to the **same scene** — cross-scene selections are rejected. |

Both operators open a small dialog to name the group. The names `Ungrouped` and `Main` are reserved, and group names are kept unique across both Scene Groups and View Layer Groups.

!!! tip "Multi-select first"
    These actions read the tree's multi-select list. If nothing is multi-selected they fall back to the single active (or split-view) row, so you can also group a lone item.

### :material-plus-box-multiple: Adding Scenes to a Group

When working in the grouped tree you can spawn a brand-new scene straight into a group:

- **Add Scene** (`tks.split_add_scene`) — creates a scene and drops it into the **currently selected** Scene Group in the split view. The scene **Type** can be *New*, *Copy Settings*, *Linked Copy*, or *Full Copy*, matching Blender's own New Scene options.
- **Add Scene to Group** (`tks.add_scene_to_group`) — creates a scene and adds it to a **named** Scene Group (the target group is passed explicitly rather than read from the active row). It offers the same *New* / *Empty* / *Linked Copy* / *Full Copy* types.

### :material-call-merge: Merging Groups

**Merge Scene Group** (`tks.merge_scene_group`) moves **every** member scene out of one Scene Group and into another, then deletes the now-empty source group. It is available when a non-`Ungrouped` Scene Group is selected and at least two Scene Groups exist. A confirmation dialog shows which group is being merged and lets you pick the destination via the **Into Group** dropdown.

!!! note "Where members go"
    Scenes already present in the target group are left untouched (no duplicates); only scenes missing from the target are moved across.

### :material-folder-remove: Ungrouping & Managing Groups

| Action | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.group_or_ungroup').bl_label }}** | `tks.group_or_ungroup` | The dispatcher behind the Group / Ungroup shortcuts: grouping wraps the selected Scenes or View Layers in a new group, ungrouping sends them back to *Ungrouped*. |
| **{{ op('tks.ungroup_scenes').bl_label }}** / **{{ op('tks.ungroup_vls').bl_label }}** | `tks.ungroup_scenes` / `tks.ungroup_vls` | Move the selected Scenes / View Layers back to the default *Ungrouped* group — works on the active row or the whole multi-selection. |
| **{{ op('tks.rename_group').bl_label }}** | `tks.rename_group` | Renames a group via a popup dialog (groups don't use the inline row rename). |
| **{{ op('tks.delete_group').bl_label }}** | `tks.delete_group` | Deletes a group and moves its members to *Ungrouped*. The default group itself cannot be deleted. |
| **{{ op('tks.toggle_group_select').bl_label }}** | `tks.toggle_group_select` | The group row's checkbox in multi-select mode — checks or unchecks **every member** of the group in one click. |

## :material-layers-triple: View Layer Versions

A View Layer can hold several **Versions** — alternative sets of cascade overrides (camera, world, action, compositor, output rule) that sit at the very top of the resolution order. Only one version in a set is active at a time.

**Activate Version** (`tks.activate_vl_version`) turns a version on and applies its cascade overrides, automatically deactivating whichever version was previously active in the same set. Clicking the already-active version **toggles it off**, falling back to the View Layer's own overrides. If the target View Layer is the one currently active in Blender, the cascade is re-applied immediately so the viewport reflects the change.

### :material-layers-plus: Creating, Duplicating & Deleting Versions

| Action | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.create_vl_version').bl_label }}** | `tks.create_vl_version` | Adds a blank Version to a View Layer — if the layer has no version set yet, one is created on the spot. Reachable from the split view's **+** button, the add menu's **VL Version** entry, and the smart-add shortcut on a View Layer row. |
| **{{ op('tks.duplicate_vl_version').bl_label }}** | `tks.duplicate_vl_version` | Copies a Version together with **all** its cascade overrides. The copy is appended at the end of the set with a `.001` suffix — the quickest way to branch a variation from a known-good setup. The tree's Duplicate shortcut routes here on a Version row. |
| **{{ op('tks.delete_vl_version').bl_label }}** | `tks.delete_vl_version` | Removes a Version. If it was the active one, the previous version in the set takes over. The **last remaining** Version can't be deleted — remove the whole version set instead. |

## :material-database-clock: View Layer Preload

Switching to a View Layer for the first time can be slow while Blender builds it. The **Preload** workflow pre-builds layers ahead of time so the first switch to each take is instant. It runs quietly in the background and never changes the layer you are currently on.

| Action | Operator | What it does |
|--------|----------|--------------|
| **Preload View Layers** | `tks.preload_viewlayers` | Starts pre-building layers. With no section it preloads **every** layer; given a section it preloads just that scene, Scene Group, or View Layer Group. Reports how many layers are queued. |
| **Cancel Preload** | `tks.cancel_preload_viewlayers` | Stops an in-progress preload run. Layers that were already prepared **stay prepared**. |
| **Toggle Preload Section** | `tks.preload_toggle_section` | Collapses or expands one section of the preload panel. ++shift++ + click collapses or expands **all** sections at once. |

!!! note "Opt-in"
    Preloading only runs when it is enabled in the add-on preferences; the **Preload View Layers** button is otherwise unavailable.

## :material-rename-box: Preview Thumbnail Renames

When you rename a scene or View Layer that already has [preview thumbnails](../features/index.md), the add-on detects that the cached image files no longer match and surfaces a persistent warning panel listing each pending rename. From there you can apply or dismiss the renames in bulk or one at a time:

| Action | Operator | Scope |
|--------|----------|-------|
| **Rename All Previews** | `tks.rename_all_previews` | Renames every cached thumbnail file to match, then closes the panel. |
| **Dismiss Preview Renames** | `tks.dismiss_preview_renames` | Clears **all** pending renames without touching any files, and closes the panel. |
| **Apply Preview Rename** | `tks.apply_single_preview_rename` | Renames the thumbnails for **one** listed entry. |
| **Dismiss Preview Rename** | `tks.dismiss_single_preview_rename` | Drops **one** listed entry without renaming its files. |

!!! tip "Bulk vs single"
    **Dismiss Preview Renames** (plural) clears the whole list at once, whereas **Dismiss Preview Rename** (singular) removes only the row you clicked. Dismissing the last remaining entry — by either route — auto-closes the warning panel.

## :material-alert-decagram: Naming Template Warnings

When a [naming template](../features/smart_output.md) contains a wrong-format token (e.g. `[scene]` written with the wrong brackets) or a token that isn't valid for that field, the panel raises a **"Naming Templates Need Fixing"** warning. Unlike the badge-driven warning panels it has no dismiss toggle — it stays open until the templates are actually fixed.

Each broken template is shown in full, grouped by category exactly as in the Preferences Syntax tab, with its editable field right there — so you can read, correct, and confirm without opening Preferences. Two fix-all buttons handle the common cases in one click:

| Button | Operator | What it does |
|--------|----------|--------------|
| **Fix Formats** | `tks.fix_token_format` | Rewrites wrong-format tokens into the correct token syntax across every affected template. |
| **Strip Invalid** | `tks.strip_invalid_tokens` | Removes tokens that aren't allowed in their field across every affected template. |

!!! note "Names keep generating"
    A broken template never halts naming — it falls back to its **default**
    pattern so names keep generating. But those fallback names won't match your
    custom scheme, which can desync slot and cascade connections; fix the
    template to get back in sync.

## :material-keyboard: Hotkeys

Cascade icons in the Context panel respond to modifier-clicks:

| Shortcut | Action |
|----------|--------|
| Click | Open the cascade popover. |
| ++alt++ + click | Clear the override at this tier. |
| ++shift++ + click | Toggle this property across all items of the same type in the active scene. |
| ++ctrl+shift++ + click | Toggle this property globally across every scene and group. |

Datablock pickers (Camera / World / Action / Compositor) accept ++alt++-click to clear. See [Keyboard Shortcuts](hotkeys.md) for the full reference.
