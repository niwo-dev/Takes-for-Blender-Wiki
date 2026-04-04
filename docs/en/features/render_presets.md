---
icon: material/palette-swatch
---

# Render Presets

**Render Presets** are JSON-based snapshots of Blender's render settings that can be assigned per View Layer through the cascade system.

## Preset Types

| Type | What It Captures |
|------|-----------------|
| **Render** | Engine, samples, resolution, color management, film settings. |
| **Camera** | Focal length, sensor size, DOF, clip distances. |
| **World** | Environment lighting, background color, AO settings. |
| **File Output** | Output format, color depth, compression, Smart Output paths. |

## Creating Presets

1. Configure your render settings as desired in Blender's Properties Editor.
2. Open the preset popover (gear icon on the cascade row).
3. Click **Save as Preset** and name it.
4. The preset is saved as a JSON file in your user presets directory.

## Assigning Presets

Presets are assigned through the cascade — they can be set at any tier:

- **Global** — Default render settings for the entire project
- **Scene Group** — Shared settings for a group of scenes
- **View Layer** — Per-shot render configuration
- **VL Version** — Version-specific tweaks

## Dirty State

When you modify render settings after applying a preset, a **dirty indicator** appears:

- **Accept** — Save the changes to the preset
- **Revert** — Discard changes and restore the preset values
- **Accept & Sync** (++alt++-click Accept) — Save and propagate to all tiers using this preset

!!! note "Tier Indicators"
    Preset dropdowns show a `[Tier]` suffix (e.g., `[Addon]`, `[User]`)
    to distinguish built-in from user-created presets.
