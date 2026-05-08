---
icon: material/earth
---

# Globals Panel

The **Globals** panel is the project-wide control centre. It collects everything that's not tied to a specific Scene or View Layer: project settings, the preset library, automation rules, the tag library, and the Variant Switch tree.

## :material-map-marker: Where to Find It

*3D Viewport > Sidebar (++n++) > **Takes** tab > **Globals***.

## :material-shape: Modes

The header has a row of mode buttons. Each switches the panel body to a different view:

| Mode | Icon | Shows |
|------|------|-------|
| **Settings** | gear | Project-wide settings (Reference Action, version warning, …). |
| **Presets** | preset | Overview of all 9 preset categories in one place. |
| **Variants** | UV-sync | The Variant Switch tree (Products / States / Parts / Pools). See [Variant Switch](variant_switch.md). |
| **Rules** | gear (system) | Automation rules — see [Rules](rules.md). |
| **Tags** | colour mod | The full tag library — see [Tags](tags.md). |

## :material-ghost: Settings Mode

*Reference State controls.*

| Control | Description |
|---------|-------------|
| **Reference Action** picker | Selects which Action stores the rest baseline. The **+** button creates a new one on the fly. |
| **Auto-Mirror Keyframes** toggle | When on, the addon mirrors unkeyed values into the Reference Action whenever you keyframe a property. |

See [Rest State](rest_state.md) for the full feature description.

## :material-palette-swatch: Presets Mode

*Overview of all preset categories with their assignments and dirty state.*

A 2×4 grid showing every preset category with its current assignment, dirty indicator, and revert button:

| Row 1 | Row 2 |
|-------|-------|
| Render • Output • File Output • View Layer | Color Management • Camera • World • Material |

Click any preset to open its picker. ++alt++-click on the icon to clear. See [Render Presets](render_presets.md).

## :material-swap-horizontal: Variants Mode

Delegates to the [Variant Switch](variant_switch.md) tree (Products → States → Parts → Material Pools).

## :material-tag-multiple: Rules & Tags

Dedicated panels for the [Rules](rules.md) and [Tags](tags.md) features.

## :material-alert-outline: Version Warning

If your Blender build is below 5.0 (the minimum for slotted actions), the Globals panel surfaces a banner with a link to the upgrade guide. The banner disappears once you're on a supported build.

## :material-keyboard: Hotkeys

The Globals panel shares the generic tree hotkeys with every other tree-based panel:

| Shortcut | Action |
|----------|--------|
| ++ctrl+n++ / ++shift+a++ | Add (smart / full menu). |
| ++f2++ | Rename. |
| ++del++ / ++x++ | Delete. |
| ++ctrl+g++ / ++alt+g++ | Group / ungroup (Tags & Rules). |
| ++ctrl+t++ | Retarget. |
| ++ctrl+i++ | Invert multi-selection. |

See [Keyboard Shortcuts](../interface/hotkeys.md) for the complete reference.
