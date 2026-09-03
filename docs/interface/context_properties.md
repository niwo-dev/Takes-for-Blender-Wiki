---
icon: material/tune-vertical
---

# Context Properties

**Location:** *3D Viewport > Sidebar (++n++) > Takes tab > Context*

This panel shows every cascade override for the active View Layer.

## :material-arrow-decision: Cascade Popovers

Click a cascade icon on a tree row to set or clear that override.

### :material-camera: Camera Popover

Pick the camera this View Layer renders with.

The same popover applies a **Camera preset**, and creates or renames a camera without leaving the panel.

??? info "The rest of the popover"
    The dropdown lists only cameras linked to the current scene.

    **Camera preset** applies a saved preset (focal length, sensor size). **New**
    and **Rename** create a camera or rename the assigned one.

    The preset controls stay disabled while the selected object is not the camera
    the cascade resolved. An info line tells you: "Assign a camera in the cascade."

### :material-earth: World Popover

Pick the world environment for this View Layer.

You can also apply a **World preset**, or let a **World rule** choose the world from tags.

??? info "The three World controls"
    | Control | What it does |
    |---|---|
    | **World selector** | Choose any world in the file. |
    | **World preset** | Apply a saved world preset. |
    | **World rule** | Pick the world automatically from tags. See [Rules](../features/rules.md). |

### :material-play-box-multiple: Action Popover

Shows the action the cascade resolved. **Re-apply Cascade** restores it after a manual clear.

### :material-vector-link: Compositor Popover

Assign a compositor node tree to this layer.

### :material-export: Output Popover

Every output preset for this tier. An **Output Rule** fills all five slots at once.

??? info "The five preset slots"
    | Slot | Holds |
    |---|---|
    | **Render preset** | Engine, samples, resolution. |
    | **File Output preset** | Format, colour depth, compression, Smart Output paths. |
    | **Output preset** | Container, dimensions, frame range. |
    | **View Layer preset** | Active passes, light groups, holdouts. |
    | **Color Management preset** | View transform, look, exposure. |

    Each slot can be set on its own. **Output Rule** is a tag-driven
    [Rule](../features/rules.md) that pushes its bundled presets into every slot
    in one click instead.

    Each slot has its own Accept / Revert pair for edits you made outside the preset.

## :material-stairs: Override Resolution

The narrowest tier with a value wins. Global is the last fallback.

A bright icon means set here, a dimmed one inherited.

??? info "The full order, highest priority first"
    ```
    Take → View Layer → View Layer Group → Scene → Scene Group → Global
    ```

    The first non-empty value in that chain is the one you get. See the
    [Cascade System](../features/cascade.md) for the whole picture.

## :material-file-tree: Tree Editing

Add, rename, duplicate, move and delete rows right in the tree. Key bindings live on [Keyboard Shortcuts](hotkeys.md#tree-edits).

### :material-plus-box: Adding & Duplicating

The **+** button adds whatever fits the row you selected.

??? info "Every add and duplicate button"
    | Action | What it does |
    | -------- | -------------- |
    | **{{ op('tks.add_new_context_item').bl_label }}** | The context-aware add behind the tree's smart-add shortcut. On a View Layer (or Take) row it creates a new [Take](#view-layer-versions). On Scene and Group rows it creates whatever *Preferences > Workflow > Pie & Misc > Add Context* is set to — or opens the add menu so you can pick. |
    | **{{ op('tks.duplicate_tree_item').bl_label }}** | Duplicates the selected row. Full copy or linked copy — linked is Scenes only. On a Take row it routes to **Duplicate Take** (see [Takes](#view-layer-versions)). |
    | **{{ op('tks.add_viewlayer').bl_label }}** | Adds a fresh View Layer to the active scene. This is what smart-add falls back to on scene rows when *Add Context* says View Layer. |
    | **{{ op('tks.split_add_viewlayer').bl_label }}** | Same, but adds to the scene selected in the split view rather than the active one. |

### :material-cursor-default-click: Renaming & Switching

Rename a row inline. Click the dot at its left to make it active.

??? info "Rename and switch buttons"
    | Action | What it does |
    | -------- | -------------- |
    | **{{ op('tks.rename_item').bl_label }}** | Inline rename for any tree row. Type the name, ++enter++ to confirm, ++esc++ to cancel. Works in tree and split view. Groups use their own dialog instead — see [Scene & View Layer Groups](#scene-view-layer-groups). |
    | **{{ op('tks.switch_scene').bl_label }}** / **{{ op('tks.switch_viewlayer').bl_label }}** | The selector dot at the left of each row. Clicking it makes that Scene or View Layer active, which triggers the cascade to apply its overrides. |
    | **{{ op('tks.activate_take').bl_label }}** | The same dot on a Take row. Clicking it makes that Take live and applies its cascade overrides. |

### :material-arrow-all: Moving & Retargeting

The arrows reorder rows. Retarget moves one into another group.

??? info "Move and retarget buttons"
    | Action | What it does |
    | -------- | -------------- |
    | **{{ op('tks.move_all_viewlayer_item').bl_label }}** | The up / down arrows in the tree's side column. Moves the selected Scene or View Layer among its siblings. A Scene header travels with all its child View Layers. |
    | **{{ op('tks.move_viewlayer').bl_label }}** | The split-view equivalent. Reorders a View Layer within its group. |
    | **{{ op('tks.move_to_group').bl_label }}** | Moves an item into a group picked from a dropdown. Scenes into Scene Groups, View Layers into View Layer Groups. |
    | **{{ op('tks.retarget_tree_item').bl_label }}** | Does the right thing for the row you selected: a Scene moves to another Scene Group, a View Layer moves to another group in the same scene, and a whole View Layer Group merges into another. |

### :material-delete-outline: Deleting

The minus button removes the highlighted row. Multi-select removes everything checked.

??? info "Every delete button"
    Deleting asks for confirmation by default.

    | Action | What it does |
    | -------- | -------------- |
    | **{{ op('tks.delete_scene').bl_label }}** / **{{ op('tks.delete_viewlayer').bl_label }}** | The split view's minus buttons. Type-specific removal for the Scenes list and the View Layers list. |
    | **{{ op('tks.delete_context_item').bl_label }}** | The tree's minus button, acting on the highlighted row. |
    | **{{ op('tks.delete_selected_context_items').bl_label }}** | Multi-select delete. Removes every checked item in one sweep, whatever the mix of types, honouring the active type filter. The default *Ungrouped* groups are protected. |

#### Deleting a Scene's last View Layer

Blender has no Scene without a View Layer. So deleting a Scene's only View Layer deletes the Scene.

!!! warning "This always asks first"

    The confirmation names the Scene, even with delete confirmations switched off.

??? info "Where this applies"
    It works the same from the tree's minus button, the split view's, the
    ++delete++ / ++x++ shortcut, and multi-select. In multi-select, ticking
    **every** View Layer of a Scene is what triggers it, and the confirmation
    lists each Scene that will go.

    That warning ignores the confirmation toggle under *Preferences → Interface →
    Confirmations*, because this is a bigger step than the click suggests. The
    toggle itself lives on [Keyboard Shortcuts](hotkeys.md#tree-edits), together
    with the Delete shortcut.

    Takes will never empty your file. The last Scene stays and keeps one View
    Layer with it. The confirmation says so under *Kept:* instead of failing quietly.

### :material-camera-iris: Render Toggles

Each View Layer row has a render toggle. Higher tiers get bulk toggles.

??? info "The bulk toggles"
    | Action | Scope |
    | -------- | ------- |
    | **{{ op('tks.toggle_scene_render').bl_label }}** | All View Layers in this Scene at once. |
    | **{{ op('tks.toggle_group_render').bl_label }}** | All members of a group. For a Scene Group that means every View Layer across its member scenes; for a View Layer Group, its member layers. |
    | **{{ op('tks.toggle_global_render').bl_label }}** | The Global root row — every View Layer in every Scene. |

    Modifier-clicks on a row toggle live on [Render Queue](hotkeys.md#render-queue).

### :material-broom: Tree Housekeeping

Expand chevrons and a right-click menu per row.

??? info "Housekeeping controls"
    | Action | What it does |
    | -------- | -------------- |
    | **{{ op('tks.toggle_scene_expand').bl_label }}** | The expand chevron on any hierarchical row. ++ctrl++ + click toggles the row **and all its nested children**. ++shift++ + click expands or collapses **all rows of the same type** at once, like the Outliner. ++alt+shift++ + click toggles **every row in the tree**. |
    | **Right-click menu** | ++ctrl++ + right-click a tree row opens its context menu: a header naming the row, plus **Show Overrides…**, which opens the full cascade-icon popover for that row. |

## :material-group: Scene & View Layer Groups

Group Scenes and View Layers under a name. Each group is its own [tier](#override-resolution).

### :material-folder-plus: Creating Groups

Select two or more rows of one type, then use **Group Selected Scenes** or **Group Selected View Layers**.

??? info "Rules for new groups"
    - A small dialog asks you to name the group.
    - Grouped scenes leave whatever group they were in. The new group is inserted
      right after the first selected scene's old group.
    - All selected View Layers must belong to the **same scene**. Cross-scene
      selections are rejected.
    - The names `Ungrouped` and `Main` are reserved, and names must be unique
      across both Scene Groups and View Layer Groups.
    - These actions read the tree's multi-select list. With nothing multi-selected
      they fall back to the active (or split-view) row, so you can group a lone item.

### :material-plus-box-multiple: Adding Scenes to a Group

**Add Scene** creates a scene inside the selected Scene Group. **Add Scene to Group** targets a group you name.

??? info "Which group, and which scene type"
    **Add Scene** drops the new scene into the group currently selected in the
    split view. **Add Scene to Group** takes the target group explicitly instead
    of reading the active row.

    Both offer Blender's own New Scene types: *New*, *Copy Settings* (or *Empty*),
    *Linked Copy*, and *Full Copy*.

### :material-call-merge: Merging Groups

**Merge Scene Group** empties one Scene Group into another, then deletes the source.

??? info "When it is available, and where members go"
    A confirmation dialog names the group being merged and lets you pick the
    destination in the **To Group** dropdown.

    You need a non-`Ungrouped` Scene Group selected and at least two Scene Groups
    in the file.

    Scenes already in the target group are left untouched, so nothing is
    duplicated. Only scenes missing from the target move across.

### :material-folder-remove: Ungrouping & Managing Groups

Ungroup sends rows back to *Ungrouped*. You can also rename, delete and bulk-select groups.

??? info "Group management buttons"
    | Action | What it does |
    | -------- | -------------- |
    | **{{ op('tks.group_or_ungroup').bl_label }}** | The dispatcher behind the Group / Ungroup shortcuts. Grouping wraps the selected Scenes or View Layers in a new group; ungrouping sends them back to *Ungrouped*. |
    | **{{ op('tks.ungroup_scenes').bl_label }}** / **{{ op('tks.ungroup_vls').bl_label }}** | Move the selected Scenes / View Layers back to *Ungrouped*. Works on the active row or the whole multi-selection. |
    | **{{ op('tks.rename_group').bl_label }}** | Renames a group via a popup dialog. Groups don't use the inline row rename. |
    | **{{ op('tks.delete_group').bl_label }}** | Deletes a group and moves its members to *Ungrouped*. The default group can't be deleted. |
    | **{{ op('tks.toggle_group_select').bl_label }}** | The group row's checkbox in multi-select mode. Checks or unchecks **every member** at once. |

## :material-layers-triple: Takes {: #view-layer-versions }

A View Layer can hold several **Takes** — saved review rounds that beat every other tier.

Click one to activate it, click again to switch it off.

??? info "How takes behave"
    A take stores the layer's camera, world, action, compositor and output rule.
    Only one take in a list is active at a time. Activating one deactivates the
    previous one automatically.

    Every row shows its slate number ("Take 3 · …") and carries a
    [feedback note](../features/vl_versions.md#the-review-loop) for the review
    round it answered.

    Switching off falls back to the View Layer's own overrides. If that View Layer
    is the one active in Blender, the cascade re-applies at once so the viewport
    follows.

### :material-layers-plus: Creating, Duplicating & Deleting Takes {: #creating-duplicating-deleting-versions }

The **+** adds a blank take. **{{ op('tks.new_take_from_here').bl_label }}** starts the next review round.

??? info "All four take buttons"
    | Action | What it does |
    | -------- | -------------- |
    | **{{ op('tks.create_take').bl_label }}** | Adds a blank Take, named by the take naming template. If the layer has no take list yet, one is created on the spot. Reachable from the split view's **+**, the add menu's **Take** entry, and the smart-add shortcut on a View Layer row. |
    | **{{ op('tks.duplicate_take').bl_label }}** | Copies a Take with **all** its fields — overrides, rules, variant, presets and note. The copy is appended at the end with a `.001` suffix. The tree's Duplicate shortcut routes here on a Take row. |
    | **{{ op('tks.new_take_from_here').bl_label }}** | Copies the take completely, names the copy by the take naming template, makes it active, and starts with a fresh empty feedback note. |
    | **{{ op('tks.delete_take').bl_label }}** | Removes a Take. If it was active, the previous take takes over. Deleting the **last** Take clears the take list too, so the View Layer goes back to its own settings. |

## :material-database-clock: View Layer Preload

The first switch to a View Layer can be slow. **Preload View Layers** builds them in the background.

It only runs when you enable preloading in the preferences.

??? info "Preload controls"
    Preloading never changes the layer you are currently on. While it is disabled
    in the preferences, the **Preload View Layers** button stays unavailable.

    | Action | What it does |
    | -------- | -------------- |
    | **Preload View Layers** | Starts pre-building. With no section chosen it preloads **every** layer; given a section it preloads just that scene, Scene Group, or View Layer Group. It reports how many layers are queued. |
    | **Cancel Preload** | Stops a run in progress. Layers already prepared **stay prepared**. |
    | **Toggle Preload Section** | Collapses or expands one section of the preload panel. ++shift++ + click affects **all** sections. |

## :material-rename-box: Preview Thumbnail Renames

Rename a scene or View Layer and its cached [preview thumbnails](../features/vl_preview.md) stop matching.

A warning panel lists each pending rename. **Rename All Previews** fixes them.

??? info "Apply or dismiss, in bulk or one at a time"
    The panel is persistent: it stays until you apply or dismiss the renames.

    | Action | Scope |
    | -------- | ------- |
    | **Rename All Previews** | Renames every cached thumbnail file to match, then closes the panel. |
    | **Dismiss Preview Renames** | Clears **all** pending renames without touching files, and closes the panel. |
    | **Apply Preview Rename** | Renames the thumbnails for **one** listed entry. |
    | **Dismiss Preview Rename** | Drops **one** listed entry without renaming its files. |

    Watch the plural: **Dismiss Preview Renames** clears the whole list, while
    **Dismiss Preview Rename** removes only the row you clicked. Dismissing the
    last entry by either route auto-closes the panel.

## :material-alert-decagram: Naming Template Warnings

A broken [naming template](../features/smart_output.md) raises the **"Naming Templates Need Fixing"** warning.

Fix it right there, or click **Fix Formats** or **Strip Invalid**.

??? info "What counts as broken, and what the buttons do"
    A template breaks when a token is written in the wrong format (`[scene]` with
    the wrong brackets) or isn't valid for that field.

    | Button | What it does |
    | -------- | -------------- |
    | **Fix Formats** | Rewrites wrong-format tokens into correct token syntax everywhere. |
    | **Strip Invalid** | Removes tokens that aren't allowed in their field, everywhere. |

    Each broken template is shown in full, grouped by category exactly as in the
    Preferences Syntax tab, with its editable field right there. This warning has
    no dismiss toggle — it stays until the templates are fixed.

??? note "Names keep generating"
    A broken template never halts naming. It falls back to its **default** pattern
    so names keep generating. Those fallback names won't match your custom scheme,
    which can desync slot and cascade connections — fix the template to get back in sync.

## :material-keyboard: Hotkeys

Cascade icons answer to modifier-clicks — ++alt++-click clears the override at this tier.

Full list: [Keyboard Shortcuts](hotkeys.md)
