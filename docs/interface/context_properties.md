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

## :material-layers-triple: View Layer Versions

A View Layer can hold several **Versions** — alternative sets of cascade overrides (camera, world, action, compositor, output rule) that sit at the very top of the resolution order. Only one version in a set is active at a time.

**Activate Version** (`tks.activate_vl_version`) turns a version on and applies its cascade overrides, automatically deactivating whichever version was previously active in the same set. Clicking the already-active version **toggles it off**, falling back to the View Layer's own overrides. If the target View Layer is the one currently active in Blender, the cascade is re-applied immediately so the viewport reflects the change.

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

## :material-keyboard: Hotkeys

Cascade icons in the Context panel respond to modifier-clicks:

| Shortcut | Action |
|----------|--------|
| Click | Open the cascade popover. |
| ++alt++ + click | Clear the override at this tier. |
| ++shift++ + click | Toggle this property across all items of the same type in the active scene. |
| ++ctrl+shift++ + click | Toggle this property globally across every scene and group. |

Datablock pickers (Camera / World / Action / Compositor) accept ++alt++-click to clear. See [Keyboard Shortcuts](hotkeys.md) for the full reference.
