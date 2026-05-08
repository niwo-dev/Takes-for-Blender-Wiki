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

## :material-format-list-bulleted: Preset Types — In Detail

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

## :material-folder-multiple: Preset Storage Tiers

Presets live in one of four storage tiers, configurable per type in *Preferences > Data > Presets*:

| Tier | Location | When to use |
|------|----------|-------------|
| **Addon** | Bundled with the addon. | Defaults — read-only by convention. |
| **Project** | Saved next to the `.blend`. | Per-project presets that travel with the file. |
| **Shared** | Team folder (path in *Preferences > Data > Storage*). | Studio-wide standards. |
| **Local** | Personal user folder. | Your own work-in-progress presets. |

`Lock Shared Folder` (default **on**) prevents the addon from overwriting team presets — toggle in *Preferences > Data > Storage*.

## :material-stethoscope: Preset Health

Open the **Preset Health** view from *Globals > Presets mode* to scan for stale or missing preset references across every cascade tier (View Layer, Scene, Global, Scene Group, View Layer Group, and Rule Tags). Missing presets are surfaced with file paths so you can re-import or re-create them.

## :material-keyboard: Hotkeys

Preset selectors and dirty-state controls follow the cascade convention:

| Shortcut | Action |
|----------|--------|
| Click on a preset selector | Open the preset picker. |
| ++alt++ + click on the preset icon | Clear the preset assignment at this tier. |
| ++alt++ + click **Accept** | Save changes to the preset and propagate to all tiers using it (Sync). |

See [Keyboard Shortcuts](../interface/hotkeys.md) for the complete reference.
