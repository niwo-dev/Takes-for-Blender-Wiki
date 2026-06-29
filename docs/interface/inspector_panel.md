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
| **Watchlist** (default) | Managed / pinned objects with their actions, slots, and sub-data icons. The rest of this page covers this mode. |
| **Channels** | A property-centric view — every animatable property the active object exposes, grouped into Transform, Visibility, Modifiers, etc. Includes a **Slotted / Channels** sub-mode toggle, a Bookmarks shelf, and Timeline Controls. Useful for keyframing a specific property without leaving the Inspector. |

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

!!! note "Removal is permanent"
    **Remove Action** deletes the datablock itself, not just its assignment.
    A confirmation dialog appears first; you can disable it in
    *Preferences > UI > Confirmations*.

### :material-format-list-bulleted: Select Slot

Click the slot field on any row (or sub-data popover) to run **Select Slot** (`tks.open_slot_menu`). It opens a searchable popup listing every slot in the target's current Action, filtered to slots that match the datablock's ID type, and assigns the chosen slot to that datablock. If the target has no Action — or no compatible slots — the popup says so instead of assigning anything.

## :material-pin-outline: Pinning from the Viewport

Beyond the per-row pin icon, you can pin straight from your viewport selection:

- **Pin Selected** (`tks.add_to_watchlist`) — pins every selected object on the **current** View Layer in one click. Pinned objects are excluded from cascade action/slot assignment and from auto-rename, so you manage their actions by hand. Objects that are already pinned are skipped.

This is the bulk counterpart to clicking the pin icon on a single row — see [Managed vs. Pinned](#managed-vs-pinned).

## :material-call-merge: Reconciling with the Cascade

When a managed object carries an action that doesn't match what the cascade would assign, its watchlist row shows a warning badge. Two operators help you resolve those mismatches:

- **Merge All into Cascade** (`tks.bulk_merge_into_cascade`) — sweeps every flagged (warning) object in the watchlist and merges its action's keyframes into the current View Layer's [Cascade Action](../features/cascade.md), writing each object into its matching slot. Pinned objects are left untouched, and once merged the object returns to cascade-managed state. The button only appears when at least one object has a mismatch.

!!! tip "Per-object merge"
    To merge a single object instead of the whole watchlist, unpin it and choose
    **Merge Keys** in the unpin dialog (see [Managed vs. Pinned](#managed-vs-pinned)).
    **Merge All into Cascade** is the batch version of that decision.

## :material-broom: Clean Empty

Over a session you can accumulate slots and actions that no longer hold any animation. The cleanup operators prune them safely, always preserving slots that are still assigned to a datablock and actions that are fake-user-protected or bound by the cascade. Each one shows a preview dialog of exactly what will be removed (toggleable via *Preferences > UI > Confirmations*).

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

## :material-keyboard: Hotkeys

When the Inspector is focused:

| Shortcut | Action |
|----------|--------|
| ++f2++ | Rename the selected action or slot. |
| ++del++ / ++x++ | Delete (action, slot, or watchlist entry — confirmation toggleable in *Preferences > UI > Confirmations*). |
| ++ctrl+i++ | Invert multi-selection. |

Datablock pickers (Action / Camera / World) follow the cascade convention:

| Shortcut | Action |
|----------|--------|
| ++alt++ + click | Clear the assigned datablock. |
| ++alt++ + click on **Find Action** | Show Scene & World datablocks instead of Object datablocks. |

See [Keyboard Shortcuts](hotkeys.md) for the full reference.
