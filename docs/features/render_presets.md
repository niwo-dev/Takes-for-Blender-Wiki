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
3. Click **Save as Preset** and name it.
4. The preset is saved as a JSON file in your user presets directory.

## :material-link-variant: Assigning Presets

Presets are assigned through the cascade — they can be set at any tier:

- **Global** — Default render settings for the entire project
- **Scene Group** — Shared settings for a group of scenes
- **View Layer** — Per-shot render configuration
- **View Layer Version** — Version-specific tweaks

## :material-pencil-circle: Dirty State

When you modify render settings after applying a preset, a **dirty indicator** appears:

- **Accept** — Save the changes to the preset
- **Revert** — Discard changes and restore the preset values
- **Accept & Sync** (++alt++-click Accept) — Save and propagate to all tiers using this preset

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

The badge disappears as soon as every reference resolves again.

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
