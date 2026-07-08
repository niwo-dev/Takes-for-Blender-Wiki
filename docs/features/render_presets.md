---
icon: material/palette-swatch
---

# Render Presets

**Render Presets** are JSON-based snapshots of Blender's render settings that can be assigned per View Layer through the cascade system.

## :material-shape: Preset Types

| Type | What It Captures |
|------|-----------------|
| **Render** | Engine, samples, resolution, color management, film settings. |
| **Camera** | Focal length, sensor size, DOF, clip distances. |
| **World** | Environment lighting, background color, AO settings. |
| **File Output** | Output format, color depth, compression, Smart Output paths. |

## :material-plus-circle: Creating Presets

1. Configure your render settings as desired in Blender's Properties Editor.
2. Open the preset popover (gear icon on the cascade row).
3. Click **New Preset** (`tks.create_render_preset`) and name it — or **Duplicate Current** to start from the selected preset instead of the live settings.
4. The preset is saved as a JSON file in your user presets directory.

## :material-link-variant: Assigning Presets

Presets are assigned through the cascade — they can be set at any of the six tiers:

- **Global** — Default render settings for the entire project
- **Scene Group** — Shared settings for a group of scenes
- **Scene** — Settings for every View Layer in one scene
- **View Layer Group** — Shared settings for a group of View Layers
- **View Layer** — Per-shot render configuration
- **View Layer Version** — Version-specific tweaks

## :material-magnify: Managing Presets

The day-to-day handling all happens on the preset row itself:

| Task | How |
|------|-----|
| **Find & assign** | The preset field is itself a button — clicking it runs **{{ op('tks.search_render_preset').bl_label }}** (`tks.search_render_preset`), a type-ahead search popup across every storage tier. Alternatively, browse the preset popover's filtered list; each entry assigns via **{{ op('tks.select_preset').bl_label }}** (`tks.select_preset`). |
| **Clear** | The **X** next to the field clears the assignment (`tks.select_preset` with an empty value). The preset file stays on disk. |
| **Edit (rename / move)** | The pencil icon runs **{{ op('tks.edit_render_preset').bl_label }}** (`tks.edit_render_preset`) — a dialog that renames the preset (previewing the sanitized filename it will save under) and can move the file to another storage tier (Project / Shared / Local). |
| **Update (overwrite)** | The save icon that appears on a dirty preset row runs **{{ op('tks.update_render_preset').bl_label }}** (`tks.update_render_preset`) — captures the current settings back into the preset file, behind a confirmation. ++alt++-click to also sync (see [Dirty State](#dirty-state)). |
| **Delete** | **{{ op('tks.delete_render_preset').bl_label }}** (`tks.delete_render_preset`) removes the JSON file after a confirmation and clears the assignment if the preset was in use. Quick route: ++alt++-click the clear **X** to delete the currently selected preset. |
| **Apply once, no assignment** | **{{ op('tks.apply_render_preset').bl_label }}** (`tks.apply_render_preset`) stamps a preset's stored values onto the current scene / View Layer / camera / world one time, without assigning anything. It has no panel button — run it from Blender's operator search when you want a one-shot apply. |

### :material-dock-window: Preset panels in the Properties editor

Besides the cascade rows, three collapsed standalone panels put the same preset
row directly where the settings live in Blender's Properties editor:
**TKS Output Presets** (Output tab), **TKS View Layer Presets** (View Layer
tab) and **TKS File Output Presets** (Output tab) — handy while you are
already tweaking the underlying settings.

## :material-pencil-circle: Dirty State

When you modify render settings after applying a preset, a **dirty indicator** appears:

- **Accept** — Save the changes to the preset
- **Revert** — Discard changes and restore the preset values
- **Accept & Sync** (++alt++-click Accept) — Save and propagate to all scenes using this preset

Besides the save icon on the preset row itself, every pending change surfaces in the Navigation panel's **Preset Changes** warning, which lets you resolve things at three levels of granularity:

1. **Everything at once** — the top row's **Accept** (**{{ op('tks.save_all_dirty_presets').bl_label }}**, `tks.save_all_dirty_presets`) writes every dirty preset back to disk in one confirmation-gated click; **Revert** (**{{ op('tks.revert_all_presets').bl_label }}**, `tks.revert_all_presets`) restores every dirty preset's stored values instead. ++alt++-clicking either one adds a **sync** — the resulting values are re-applied to every other scene that uses the same presets.
2. **One preset type** — each dirty type (Render, Output, Camera, …) gets its own collapsible box with a ✓ / ↩ pair in the header: ✓ saves just that preset (`tks.update_render_preset`; ++alt++-click = **{{ op('tks.accept_sync_preset_type').bl_label }}**, `tks.accept_sync_preset_type`, which saves *and* re-applies it to every scene sharing it), ↩ reverts it (**{{ op('tks.revert_to_preset').bl_label }}**, `tks.revert_to_preset`).
3. **One property** — expand a type's box and every changed value is listed as `stored -> current` (the current side stays editable in place). Each row has its own ✓ **{{ op('tks.accept_preset_property').bl_label }}** (`tks.accept_preset_property`) and ↩ **{{ op('tks.revert_preset_property').bl_label }}** (`tks.revert_preset_property`) — cherry-pick the changes that belong in the preset and throw the rest back. ++alt++-click either button to also sync that single value across scenes (**{{ op('tks.accept_sync_preset_property').bl_label }}**, `tks.accept_sync_preset_property`).

The practical workflow: tweak freely, then walk the Preset Changes list top-down — accept the properties you meant to change, revert the strays, and only reach for the all-at-once row when the whole session was intentional.

!!! note "Locked Shared presets"
    If a dirty preset lives in the locked **Shared** tier, its Accept button is replaced by a lock icon and the panel notes that changes cannot be saved — Revert (and per-property reverting) still works. See `Lock Shared Folder` under [Storage Tiers](#storage-tiers).

!!! note "Tier Indicators"
    Preset dropdowns show a `[Tier]` suffix (e.g., `[Addon]`, `[User]`)
    to distinguish built-in from user-created presets.

## :material-format-list-bulleted: All Categories

The full set of preset categories accessible from *Globals > Presets mode* is broader than the four above:

| Type | What It Captures |
|------|-----------------|
| **Render** | Engine, samples, resolution, color management, film settings. |
| **Output** | Output container, dimensions, frame range, FPS. |
| **File Output** | Output format, color depth, compression, Smart Output paths. |
| **View Layer** | Active passes, light groups, holdouts, layer overrides. |
| **Color Management** | View transform, look, exposure, gamma. |
| **Camera** | Focal length, sensor size, DOF, clip distances. |
| **World** | Environment lighting, background color, AO settings. |
| **Material** | Per-material shader values (used by Variant Switch). |
| **Bookmark** | Saved sets of bookmarked properties. |

Each category can be assigned independently through the cascade (Global → Scene Group → Scene → View Layer Group → View Layer → View Layer Version) and via Tag-driven Rules (see [Rules](rules.md)).

## :material-folder-multiple: Storage Tiers

Presets live in one of four storage tiers, configurable per type in *Preferences > Data > Presets*:

| Tier | Location | When to use |
|------|----------|-------------|
| **Addon** | Bundled with the addon. | Defaults — read-only by convention. |
| **Project** | Saved next to the `.blend`. | Per-project presets that travel with the file. |
| **Shared** | Team folder (path in *Preferences > Data > Storage*). | Studio-wide standards. |
| **Local** | Personal user folder. | Your own work-in-progress presets. |

`Lock Shared Folder` (default **on**) prevents the addon from overwriting team presets — toggle in *Preferences > Data > Storage*.

### :material-folder-open: Opening a Tier Folder

To inspect, back up, or hand-edit the raw JSON, jump straight to a tier's folder in your OS file explorer:

| Button | Operator | Opens |
|--------|----------|-------|
| **Open Addon Folder** | `tks.open_addon_presets_folder` | The bundled **Addon** presets directory (the read-only defaults). |
| **Open Project Folder** | `tks.open_project_presets_folder` | The **Project** presets directory that lives next to the current `.blend`. |

!!! note "Save first for the Project folder"
    **Open Project Folder** is only available once the `.blend` is saved — the Project tier is resolved relative to the file on disk, so an unsaved file has no project folder yet.

## :material-stethoscope: Preset Health

When the addon detects stale or missing preset references — a JSON file that no longer exists, a stored key that points nowhere — a **broken-link badge** (UNLINKED icon) appears in the Navigation panel's warning row. Click the badge to expand the warning sub-panel; it lists every missing preset with its tier (View Layer, Scene, Global, Scene Group, View Layer Group, or Rule Tag) and file path so you can re-import or re-create them.

The panel doesn't just report — it repairs:

- **X** on an entry runs **{{ op('tks.clear_missing_preset').bl_label }}** (`tks.clear_missing_preset`), emptying the stale reference(s) to that one preset; a type row's **Empty all** button clears every stale reference of that preset type at once.
- The **preset icon** next to an entry reopens the search popup (`tks.search_render_preset`) so you can point the slot at an existing preset instead of clearing it.
- **Clear All** at the top runs **{{ op('tks.clear_all_missing_presets').bl_label }}** (`tks.clear_all_missing_presets`), emptying every stale reference in the file in one click.

Clearing only empties the stored references — no preset files are touched — and the cascade re-syncs afterwards so child tiers re-inherit correct values. The badge disappears as soon as every reference resolves again.

## :material-broom: Manage Orphaned Settings

Old presets sometimes contain keys for properties the addon no longer reads — typically after a refactor or when a preset was authored against an older schema. The **Manage Orphaned Settings** operator inspects a preset and lists those leftover keys so you can prune them.

- Available per preset type — pick a category (Render, Output, Camera, World, etc.) in the dialog.
- Each orphaned key shows its name and the value stored in the JSON.
- Removing keys is undoable. Save the preset afterward to make the cleanup persistent.

This is mostly a maintenance hatch; you'll rarely need it unless you're cleaning up a long-lived addon-managed preset library.

## :material-wrench-clock: Clean Up Incompatible Presets

A preset file can become *incompatible* when it was written by a much older addon version, by a newer one, or by a different tool entirely — its schema no longer matches what the current addon reads. **Clean Up Incompatible Presets** (`tks.cleanup_incompatible_presets`) scans every tier for these files and resolves them in one pass:

- Files that **can** be upgraded are **migrated** to the current format in place (re-stamped with the current schema version and preset type).
- Files that **cannot** be upgraded are **quarantined** — moved into a `_quarantine` subfolder rather than left to break the preset list.

The confirmation dialog tells you exactly how many files will be migrated versus quarantined before you commit.

!!! warning "Nothing is deleted"
    Quarantined files stay on disk inside the `_quarantine` folder, so you can always inspect or restore them by hand. If the scan finds no incompatible files, the operator reports *No incompatible presets found* and does nothing.

## :material-keyboard: Hotkeys

Preset selectors and dirty-state controls follow the cascade convention:

| Shortcut | Action |
|----------|--------|
| Click on a preset selector | Open the preset picker. |
| ++alt++ + click on the preset icon | Clear the preset assignment at this tier. |
| ++alt++ + click **Accept** | Save changes to the preset and propagate to all tiers using it (Sync). |

See [Keyboard Shortcuts](../interface/hotkeys.md) for the complete reference.
