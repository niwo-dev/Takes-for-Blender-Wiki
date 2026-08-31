---
icon: material/magnify-scan
---

# Inspector Panel

**Location:** *3D Viewport > Sidebar (++n++) > Takes tab > Inspector*

The Inspector lists the objects the cascade manages, with their actions, slots and sub-data.

## :material-toggle-switch: Watchlist vs. Channels

A header toggle swaps the whole view. **Watchlist** shows managed objects, **Channels** shows one object's animatable properties.

??? info "What each mode gives you"
    Most of this page covers the Watchlist.

    | Mode | What it shows |
    |------|---------------|
    | **Watchlist** (default) | Managed and pinned objects with their actions, slots and sub-data icons. |
    | **Channels** | Every animatable property of the active object, grouped into Transform, Visibility, Modifiers and more. Adds a **Slotted / Channels** sub-mode toggle, a Bookmarks shelf and Timeline Controls — see [Channels Mode](#channels-mode). |

    The mode sticks for the rest of your Blender session.

## :material-pin: Managed vs. Pinned

A **managed** object takes its action from the cascade of the active View Layer.

A **pinned** object keeps its own action instead. Click the **pin icon** on a row to pin it.

??? warning "Unpinning replaces the action"
    Unpinning an object that has an action opens a confirmation dialog, because the
    cascade assignment then replaces that action.

??? tip "Pinning many objects at once"
    - **Pin Selected** pins every selected object on the **current** View Layer. Pinned
      objects are skipped by cascade action and slot assignment and by auto-rename, so
      you manage their actions by hand. Already-pinned objects are left alone.
    - **{{ op('tks.remove_from_watchlist').bl_label }}** does the reverse: it unpins the
      selected objects and hands them back to the cascade. A confirmation guards it,
      toggleable under *Preferences > Interface > Confirmations*.

## :material-eye-outline: Watchlist

The watchlist shows every object relevant to the current View Layer.

Click a name to select it in the viewport. Click a sub-data icon to manage that datablock.

??? info "The columns"
    | Column | Description |
    |--------|-------------|
    | **Pin** | Toggle managed or pinned state. |
    | **Name** | Object name — click to select it in the viewport. |
    | **Sub-data icons** | One compact icon per animated datablock (material, node tree, shape key). |

??? tip "Filters"
    Two header buttons narrow the list: **Pinned filter** shows only pinned objects,
    **Unpinned filter** only managed ones. A filter icon is greyed out when its count
    is zero.

### :material-arrow-collapse: Compact Mode

Compact mode shrinks the sub-data into small icons beside each object.

A **bright** icon has an action, a **dimmed** one has none. Click an icon to open its action and slot popover.

## :material-play-box-multiple: Actions & Slots

Select an object to see its actions and slots in the lower section.

The **Actions** list holds every action referencing it. The **Slots** list holds the slots inside the active action. Double-click a name to rename it.

### :material-plus-box: Creating & Removing Actions

**New Action** makes an empty action, names it from your [Smart Naming](../features/smart_output.md) template and assigns it.

**{{ op('tks.remove_action').bl_label }}** deletes the Action itself.

??? info "Every create and remove button"
    | Button | What it does |
    | -------- | -------------- |
    | **New Action** | Creates a fresh, empty Action with an automatic [Smart Naming](../features/smart_output.md) name — no dialog. It is fake-user protected, so it survives a save before it has any keyframes. Started from an object's popover, it is assigned to that object too. |
    | **New Action** *(datablock)* | The sub-datablock version. Click a sub-data icon (material, node tree, shape key) to open its popover, then create an Action assigned to *that* datablock instead of the object. Auto-named and protected the same way. |
    | **{{ op('tks.remove_action').bl_label }}** | Permanently deletes the selected Action, or every checkbox-selected Action in multi-select mode. It first clears the Action off every object, scene, world, material and node tree that used it, so nothing dangles. |
    | **{{ op('tks.assign_existing_action').bl_label }}** | When a row has no animation yet, its browse button (▾) opens a searchable popup of **existing** Actions and assigns your pick. Nothing new is created. |
    | **{{ op('tks.duplicate_action').bl_label }}** | Copies the selected Action. Sits as **Duplicate Selected** in the Actions list's add menu and in the object and datablock popovers — handy for branching a variant without touching the original. |

??? note "Removal is permanent"
    **{{ op('tks.remove_action').bl_label }}** deletes the datablock, not just its assignment. A confirmation
    dialog appears first; you can switch it off in *Preferences > Interface > Confirmations*.

### :material-magnify: Find Action & Slot

The magnifier in the watchlist's side column runs **{{ op('tks.find_action_slot').bl_label }}**. It jumps the Actions and Slots lists to the match for whatever the watchlist has selected.

??? info "When several datablocks qualify"
    A small menu lets you pick one. ++shift++ + click searches **Scene & World**
    datablocks instead of Object datablocks — see [Hotkeys](#hotkeys). Whatever
    you pick, the watchlist moves to the matching row as well.

### :material-cursor-default-click: Follow Selection

Turn **Follow Selection** on and you stop pressing the magnifier at all. Pick a
row in the watchlist, or an object in the viewport, and the Actions and Slots
lists jump there on their own.

++alt++-click the magnifier to switch it on or off. The button stays highlighted
while it is on, and its tooltip says so.

??? info "Scene, World, and staying out of the way"
    The **Scene** and **World** rows work like any other row. Picking one clears
    the viewport selection, because the scene itself is what you are looking at
    now. Their animation is found wherever it lives — a world animated on its
    nodes is picked up just the same.

    Following stands down while the add-on is applying a take or view-layer
    switch, so it never fights you for the lists.

    To keep it on for every session, tick **Follow Selection** in
    *Preferences ▸ Workflow ▸ Automations ▸ Inspector*.

## :material-playlist-edit: Slot Management

Every datablock binds to a **slot** inside its action.

The slot controls sit inline on each slot field and in the **Slots** list below.

??? info "Buttons on the slot field"
    Some appear only when their situation applies.

    | Button | What it does |
    | -------- | -------------- |
    | **{{ op('tks.add_slot').bl_label }}** | Creates a fresh slot in the row's Action for this datablock. |
    | **{{ op('tks.rename_slot').bl_label }}** | Appears when the slot's name does not match the [naming template](../features/smart_output.md) — the row turns red. Click to rename it to the expected name; ++alt++ + click renames **all** slots with that name across every Action in one sweep. |
    | **{{ op('tks.unassign_slot').bl_label }}** | Drops the slot binding but **keeps** the Action assigned. The datablock stays animated by the Action without targeting a slot. |
    | **{{ op('tks.reassign_slot').bl_label }}** | The undo for that — shown when the datablock has no slot bound and a matching slot still exists. It finds that slot and re-binds it. |

??? info "Buttons on the Slots list"
    | Control | What it does |
    | --------- | -------------- |
    | **Remove** (−) | Permanently deletes the selected slot, or every checkbox-selected slot in multi-select mode, from its Action. A confirmation appears first, toggleable in *Preferences > Interface > Confirmations*. |
    | **{{ op('tks.retarget_slot').bl_label }}** | In the settings menu. Moves a slot **and its keyframes** to another Action. A dialog asks for the target Action and, if a slot of that name is already there, whether to **Move** (keep both, renamed) or **Replace** it. |
    | **{{ op('tks.copy_slot_keys').bl_label }}** | In the settings menu. Copies all keyframes from the selected slot to an internal clipboard. |
    | **{{ op('tks.paste_slot_keys').bl_label }}** | In the settings menu. Pastes those keyframes into the selected slot, **replacing** whatever it held. With Copy, this moves animation between slots without touching the Actions. |

??? info "Assigning a slot by hand"
    Click the slot field on any row or sub-data popover to run **Select Slot**. It opens
    a searchable popup of every slot in the target's current Action, filtered to slots
    that match the datablock's type, and assigns the one you pick. With no Action — or
    no compatible slot — the popup says so and assigns nothing.

??? tip "Fixing many mismatched names at once"
    When several slots drift out of naming-template sync, the
    [Navigation Panel](navigation_panel.md#warnings) raises a slot-mismatch warning.
    Its panel offers **{{ op('tks.rename_slot_mismatches').bl_label }}**, the bulk
    version of the per-row rename button.

### :material-content-duplicate: When you duplicate an object

Blender copies an object's action when you duplicate it, which breaks the one-action-per-take model.

The **On Duplicate** preference (*Preferences > Workflow > Automations > Actions*) decides what happens.

??? info "The three modes"
    | Mode | What happens |
    |------|--------------|
    | **Strip Animation** (default) | The duplicate loses the copied animation and starts clean under cascade management. |
    | **Independent Slot** | The duplicate keeps its keys but gets its **own slot**, so it no longer shares animation with the original. |
    | **Off (Blender Default)** | Takes stays out of it. Blender's native duplicate behaviour applies unchanged. |

    **{{ op('tks.split_duplicate_slot').bl_label }}** is the manual escape hatch: it gives
    one object the *Independent Slot* treatment on demand. It has no button — run it from
    the operator search (++f3++).

## :material-call-merge: Reconciling with the Cascade

A managed object whose action differs from the cascade's gets a warning badge on its row.

**Merge All into Cascade**, in the Objects list's settings menu, fixes every flagged object at once.

??? info "What the merge does"
    The button appears only when at least one object mismatches.

    It merges each flagged object's keyframes into the current View Layer's
    [Cascade Action](../features/cascade.md), writing every object into its matching
    slot. Pinned objects are untouched, and merged objects return to cascade-managed
    state.

??? note "Unpinning does not merge"
    Unpinning a mismatched object does **not** carry its keys over — the cascade
    assignment simply replaces its action. That is what the unpin confirmation warns
    about, see [Managed vs. Pinned](#managed-vs-pinned). Run **Merge All into Cascade**
    first if you want to keep those keyframes.

## :material-broom: Clean Empty

Sessions leave behind slots and actions that hold no animation. Three buttons prune them.

??? info "The three cleanup buttons"
    Each shows a preview of what it will remove first, toggleable in
    *Preferences > Interface > Confirmations*.

    | Button | Scope |
    | -------- | ------- |
    | **Clean Empty Slots** | Removes empty, unbound slots in the current filtered view. Slots still assigned to a datablock are kept. |
    | **Clean Empty Actions** | Removes Actions that have no slots left. Fake-user-protected and cascade-bound Actions are skipped. |
    | **Clean Empty** | The combined sweep: empty slots first, then any Action left with no slots. The one-click tidy-up. |

??? note "Bound data is always safe"
    No cleanup button touches a slot that is still assigned to a datablock, or an Action
    that is fake-user protected or used by a cascade. Only orphaned data goes.

## :material-link-variant-off: Linked Objects Info

Objects linked from another file need a library override before you can edit their actions.

When such objects exist, **Linked Objects Info** appears. It only reports — it changes nothing.

??? info "What the popup tells you"
    It is read-only. It counts how many objects linked from another `.blend` file need an
    override, groups them by source library file, and points you to
    *Object > Library Override > Make*. The entry stays hidden while every linked object
    is already overridden.

## :material-rhombus-outline: Channels Mode

Flip the header toggle (see [Watchlist vs. Channels](#watchlist-vs-channels)) and the Inspector becomes a keyframing surface. It lists every animatable **property** of the active target.

**{{ op('tks.toggle_channel_mode').bl_label }}** switches between the **Slotted** and **Channels** sub-modes.

### :material-format-list-text: What the view is made of

Four bands, top to bottom: frame navigation, target-type rows, search and filter, then the property groups.

??? info "Each band in detail"
    | Element | What it does |
    |---------|--------------|
    | **Frame-navigation bar** | Timeline controls, when enabled — jump between keyframes with Blender's own previous and next arrows, plus the **{{ op('tks.delete_all_inspector_keys').bl_label }}** trash button. |
    | **Target-type rows** | One row per animated datablock type on the active object. The left side switches the view to that target; the right side counts its keys. |
    | **Search & filter** | A search field narrows the property list, the red ✕ clears it. A source filter limits rows to **All / Native / Add-on** properties. |
    | **Property groups** | Collapsible sub-panels — Transform, Delta Transform, Visibility, Viewport Display, Light Settings, Lens & Sensor, Modifiers, General Properties — each row showing its live value. |

    Every property row ends in Blender's native **keyframe decorator** (the diamond), so
    keying works exactly as in the Properties editor. Values driven by a driver or the
    NLA are shown disabled with a badge, so you never fight an animation source unaware.

### :material-delete-sweep: Deleting keys in bulk

The trash button in the frame-navigation bar runs **{{ op('tks.delete_all_inspector_keys').bl_label }}**. Modifier keys widen its reach.

??? info "The modifier matrix"
    | Click | Scope |
    |-------|-------|
    | Click | Keys of the **selected target type** at the **current frame**. |
    | ++alt++ + click | Keys of **all target types** at the current frame. |
    | ++shift++ + click | Keys of the selected target type across the **whole timeline**. |
    | ++shift+alt++ + click | **Everything** — all target types, whole timeline. |

    A confirmation dialog guards it, toggleable in *Preferences > Interface > Confirmations*.

### :material-bookmark-multiple: Bookmarks shelf

The bookmark icon in the Channels header reveals the Bookmarks shelf.

Bookmarked target types stay switchable even with no keyframes, so your favourites never drop out of the list.

## :material-keyboard: Hotkeys

With the Inspector focused, ++f2++ renames and ++del++ deletes. ++shift++-click **Find Action** to search Scene & World datablocks, and ++alt++-click it to turn **Follow Selection** on or off.

Full list: [Keyboard Shortcuts](hotkeys.md)
