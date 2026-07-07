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
| **Watchlist** (default) | Managed / pinned objects with their actions, slots, and sub-data icons. Most of this page covers this mode. |
| **Channels** | A property-centric view — every animatable property the active object exposes, grouped into Transform, Visibility, Modifiers, etc. Includes a **Slotted / Channels** sub-mode toggle, a Bookmarks shelf, and Timeline Controls. Useful for keyframing a specific property without leaving the Inspector — see [Channels Mode](#channels-mode). |

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

### :material-plus-box: Creating & Removing Actions

The Actions list and the per-datablock popovers share a small set of CRUD operators:

| Button | Operator | What it does |
|--------|----------|--------------|
| **New Action** | `tks.new_action` | Creates a fresh, empty Action and gives it a [Smart Naming](../features/smart_output.md) name automatically — no naming dialog. The Action is created with a fake user so it survives a save even before any keyframes exist. When triggered from an object's popover it is also assigned to that object straight away. |
| **New Action** *(datablock)* | `tks.datablock_new_action` | The sub-datablock equivalent. Click a sub-data icon (material, node tree, shape key, …) to open its popover, then create a new Action that is assigned directly to *that* datablock rather than the object. Auto-named and fake-user-protected the same way. |
| **Remove Action** | `tks.remove_action` | Permanently deletes the selected Action (or every checkbox-selected Action in multi-select mode). Before removal it clears the Action off every object, scene, world, material and node tree that referenced it, so no dangling links remain. |
| **{{ op('tks.assign_existing_action').bl_label }}** | `tks.assign_existing_action` | The counterpart to creating: when a row has no animation data yet, its browse button (▾) opens a searchable popup of **existing** Actions and assigns your pick to that target — no new datablock is created. |
| **{{ op('tks.duplicate_action').bl_label }}** | `tks.duplicate_action` | Copies the selected Action. Reachable as **Duplicate Selected** in the Actions list's add menu and from the object / datablock action popovers — handy for branching a variant without touching the original. |

!!! note "Removal is permanent"
    **Remove Action** deletes the datablock itself, not just its assignment.
    A confirmation dialog appears first; you can disable it in
    *Preferences > Interface > Confirmations*.

### :material-format-list-bulleted: Select Slot

Click the slot field on any row (or sub-data popover) to run **Select Slot** (`tks.open_slot_menu`). It opens a searchable popup listing every slot in the target's current Action, filtered to slots that match the datablock's ID type, and assigns the chosen slot to that datablock. If the target has no Action — or no compatible slots — the popup says so instead of assigning anything.

### :material-magnify: Find Action & Slot

The magnifier button in the watchlist's side column runs **{{ op('tks.find_action_slot').bl_label }}** (`tks.find_action_slot`). It looks up the active object's animated datablocks and jumps the Actions and Slots lists straight to the match — if several datablocks qualify, a small menu lets you pick one. ++alt++ + click searches **Scene & World** datablocks instead of Object datablocks, following the same convention as the other pickers (see [Hotkeys](#hotkeys)).

## :material-playlist-edit: Slot Management

With slotted Actions, every datablock binds to a **slot** inside its Action — and the Inspector surfaces the whole slot lifecycle. The controls live in two places: inline on each slot field (rows and sub-data popovers), and on the **Slots** list in the lower section.

### :material-gesture-tap-button: On the slot field

These buttons appear next to the slot field; some only show up when their situation applies:

| Button | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.add_slot').bl_label }}** | `tks.add_slot` | Creates a fresh slot in the row's Action for this datablock. |
| **{{ op('tks.rename_slot').bl_label }}** | `tks.rename_slot` | Only appears when the slot's name doesn't match the name the [naming template](../features/smart_output.md) expects — the row turns red to flag it. Click to rename the slot to its expected name; ++alt++ + click renames **all** slots with the same name across all Actions in one sweep. |
| **{{ op('tks.unassign_slot').bl_label }}** | `tks.unassign_slot` | Drops the slot binding while **keeping** the Action assigned. The datablock stays animated by the Action but no longer targets a slot. |
| **{{ op('tks.reassign_slot').bl_label }}** | `tks.reassign_slot` | The undo for the above — only appears when the datablock has no slot bound **and** a matching slot still exists in the Action. Finds that slot and re-binds it. |

### :material-format-list-checks: On the Slots list

| Control | Operator | What it does |
|---------|----------|--------------|
| **Remove** (−) | `tks.delete_slot` | Permanently deletes the selected slot — or every checkbox-selected slot in multi-select mode — from its Action. A confirmation dialog appears first (toggleable in *Preferences > Interface > Confirmations*). |
| **{{ op('tks.retarget_slot').bl_label }}** | `tks.retarget_slot` | In the Slots list's settings menu. Moves a slot **and its keyframes** to another Action: a dialog asks for the target Action and, if it already contains a slot with the same name, whether to **Move** (keep both, renamed) or **Replace** it. |
| **{{ op('tks.copy_slot_keys').bl_label }}** | `tks.copy_slot_keys` | In the settings menu. Copies all keyframes from the selected slot to an internal clipboard. |
| **{{ op('tks.paste_slot_keys').bl_label }}** | `tks.paste_slot_keys` | In the settings menu. Pastes the copied keyframes into the selected slot, **replacing** whatever keys it held. Together with Copy this moves animation between slots without touching the Actions themselves. |

!!! tip "Fixing many mismatched names at once"
    When several slots drift out of naming-template sync, the [Navigation Panel](navigation_panel.md#warnings)
    raises a slot-mismatch warning badge whose panel offers
    **{{ op('tks.rename_slot_mismatches').bl_label }}** (`tks.rename_slot_mismatches`) —
    the bulk version of the per-row rename button above.

### :material-content-duplicate: When you duplicate an object

Duplicating an animated object makes Blender copy its Action too — which silently breaks the "one cascade Action per take" model. The **On Duplicate** preference (*Preferences > Workflow > Automations > Actions*) decides how Takes handles that copy:

| Mode | What happens |
|------|--------------|
| **Strip Animation** (default) | The duplicate loses the copied animation and starts clean under cascade management. |
| **Independent Slot** | The duplicate keeps its keys but gets its **own slot**, so it no longer shares animation with the original. |
| **Off (Blender Default)** | Takes stays out of it — Blender's native duplicate behavior applies unchanged. |

The manual escape hatch is **{{ op('tks.split_duplicate_slot').bl_label }}** (`tks.split_duplicate_slot`): it performs the *Independent Slot* treatment on demand for a single object. It has no button — run it from the operator search (++f3++).

## :material-pin-outline: Pinning from the Viewport

Beyond the per-row pin icon, you can pin straight from your viewport selection:

- **Pin Selected** (`tks.add_to_watchlist`) — pins every selected object on the **current** View Layer in one click. Pinned objects are excluded from cascade action/slot assignment and from auto-rename, so you manage their actions by hand. Objects that are already pinned are skipped.

This is the bulk counterpart to clicking the pin icon on a single row — see [Managed vs. Pinned](#managed-vs-pinned).

## :material-call-merge: Reconciling with the Cascade

When a managed object carries an action that doesn't match what the cascade would assign, its watchlist row shows a warning badge:

- **Merge All into Cascade** (`tks.bulk_merge_into_cascade`) — sweeps every flagged (warning) object in the watchlist and merges its action's keyframes into the current View Layer's [Cascade Action](../features/cascade.md), writing each object into its matching slot. Pinned objects are left untouched, and once merged the object returns to cascade-managed state. It lives in the Objects list's settings menu and only appears when at least one object has a mismatch.

!!! note "Unpinning without merging"
    Unpinning a mismatched object does **not** merge its keys — the cascade
    assignment simply replaces its current action (that's what the unpin
    confirmation dialog warns about, see [Managed vs. Pinned](#managed-vs-pinned)).
    Run **Merge All into Cascade** first if you want those keyframes carried over.

## :material-broom: Clean Empty

Over a session you can accumulate slots and actions that no longer hold any animation. The cleanup operators prune them safely, always preserving slots that are still assigned to a datablock and actions that are fake-user-protected or bound by the cascade. Each one shows a preview dialog of exactly what will be removed (toggleable via *Preferences > Interface > Confirmations*).

| Button | Operator | Scope |
|--------|----------|-------|
| **Clean Empty Slots** | `tks.clean_empty_slots` | Removes empty, unbound slots within the current filtered view. Slots currently assigned to a datablock are kept. |
| **Clean Empty Actions** | `tks.clean_empty_actions` | Removes Actions that have no slots left. Fake-user-protected and cascade-bound Actions are skipped. |
| **Clean Empty** | `tks.clean_empty` | The combined sweep — removes empty slots first, then any Action that is left with no slots. The one-click "tidy everything" option. |

!!! note "Bound data is always safe"
    None of the cleanup operators touch a slot that is still assigned to a
    datablock or an Action that is fake-user-protected or referenced by a
    cascade. Only genuinely orphaned data is removed.

## :material-link-variant-off: Linked Objects Info

Objects linked from another `.blend` cannot have their actions edited until you make a library override. When such objects are present, the Inspector surfaces a **Linked Objects Info** entry (`tks.convert_to_override`). It opens a read-only popup that counts how many objects need an override, groups them by source library file, and points you to *Object > Library Override > Make*. It does not change anything itself — it only reports, and it stays hidden when there are no un-overridden linked objects.

## :material-rhombus-outline: Channels Mode

Flip the header toggle (see [Watchlist vs. Channels](#watchlist-vs-channels)) and the Inspector becomes a keyframing surface: instead of objects, it lists every animatable **property** of the active target. The header button **{{ op('tks.toggle_channel_mode').bl_label }}** (`tks.toggle_channel_mode`) switches between the **Slotted** and **Channels** sub-modes.

### :material-format-list-text: What the view is made of

Top to bottom:

| Element | What it does |
|---------|--------------|
| **Frame-navigation bar** | Timeline controls (shown when enabled) — jump between keyframes with Blender's native previous/next arrows, plus the **{{ op('tks.delete_all_inspector_keys').bl_label }}** trash button (below). |
| **Target-type rows** | One row per animated datablock type on the active object (object, material, node tree, …). The left side switches the view to that target (`tks.select_inspector_target`); the right side shows a key counter (current frame, or current/total). |
| **Search & filter** | A search field narrows the property list; the red ✕ (`tks.clear_inspector_search`) clears it. A source filter limits rows to **All / Native / Addon** properties. |
| **Property groups** | Collapsible sub-panels — Transform, Delta Transform, Visibility, Viewport Display, Light Settings, Lens & Sensor, Modifiers, General Properties — each row showing the property with its live value. |

Each property row ends in Blender's **native keyframe decorator** (the diamond), so inserting or removing a key on that property works exactly as it does in the Properties editor. Values driven by a driver or the NLA are shown disabled with a badge, so you can't fight an animation source without noticing.

### :material-delete-sweep: Deleting keys in bulk

The trash button in the frame-navigation bar runs **{{ op('tks.delete_all_inspector_keys').bl_label }}** (`tks.delete_all_inspector_keys`) with a modifier matrix:

| Click | Scope |
|-------|-------|
| Click | Keys of the **selected target type** at the **current frame**. |
| ++alt++ + click | Keys of **all target types** at the current frame. |
| ++shift++ + click | Keys of the selected target type across the **whole timeline**. |
| ++shift+alt++ + click | **Everything** — all target types, whole timeline. |

A confirmation dialog guards the operation (toggleable in *Preferences > Interface > Confirmations*).

### :material-bookmark-multiple: Bookmarks shelf

The bookmark icon in the Channels header (`wm.tks_show_bookmarks`) reveals the Bookmarks shelf — the same preset-row widget used elsewhere in the addon. Bookmarked target types stay switchable even when they currently hold zero keyframes, so your go-to targets never vanish from the list.

## :material-keyboard: Hotkeys

When the Inspector is focused:

| Shortcut | Action |
|----------|--------|
| ++f2++ | Rename the selected action or slot. |
| ++del++ / ++x++ | Delete (action, slot, or watchlist entry — confirmation toggleable in *Preferences > Interface > Confirmations*). |
| ++ctrl+i++ | Invert multi-selection. |

Datablock pickers (Action / Camera / World) follow the cascade convention:

| Shortcut | Action |
|----------|--------|
| ++alt++ + click | Clear the assigned datablock. |
| ++alt++ + click on **Find Action** | Show Scene & World datablocks instead of Object datablocks. |

See [Keyboard Shortcuts](hotkeys.md) for the full reference.
