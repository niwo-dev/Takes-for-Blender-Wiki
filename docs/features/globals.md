---
icon: material/earth
---

# Globals Panel

The **Globals** panel is the project-wide control centre. It holds project settings, the preset library, automation rules, the tag library and the Variant Switch tree — everything not tied to one Scene or View Layer.

## :material-map-marker: Where to Find It

*3D Viewport > Sidebar (++n++) > **Takes** tab > **Globals***.

## :material-shape: Modes

The header has a row of mode buttons. Each switches the panel body to a different view:

| Mode | Icon | Shows |
|------|------|-------|
| **Settings** | gear | Project-wide settings (Rest Action, version warning, …). |
| **Presets** | preset | Overview of 8 preset categories. |
| **Variants** | UV-sync | The [Variant Switch](variant_switch.md) tree. |
| **Rules** | gear (system) | Automation [rules](rules.md). |
| **Tags** | colour mod | The full [tag](tags.md) library. |

## :material-ghost: Settings Mode

The Rest State controls.

| Control | Description |
|---------|-------------|
| **Rest Action** picker | Picks the Action that stores the rest baseline. **+** creates a new one. |
| **Auto-Mirror Keyframes** toggle | Mirrors unkeyed values into the Rest Action whenever you keyframe a property. |

Full detail on [Rest State](rest_state.md).

## :material-palette-swatch: Presets Mode

Eight preset rows, each with its current assignment, dirty indicator and revert button:

Render • Output • File Output • View Layer • Color Management • Camera • World • Material

Click any preset to open its picker. ++alt++-click the icon to clear. See [Render Presets](render_presets.md).

??? note "Where's Bookmark?"
    The ninth preset category, **Bookmark**, is deliberately not part of this
    grid — it is a render-config overview, while bookmark save / revert lives
    in the Channels view.

## :material-swap-horizontal: Variants Mode

Shows the [Variant Switch](variant_switch.md) tree: Products → States → Parts → Material Pools.

## :material-tag-multiple: Rules & Tags

Dedicated panels for the [Rules](rules.md) and [Tags](tags.md) features.

## :material-alert-outline: Version Warning

Blender 5.0 is the minimum for slotted actions. On an older build a banner links you to the upgrade guide, and clears once you upgrade.

## :material-keyboard: Hotkeys

The Globals panel shares the generic tree hotkeys with every other tree panel. Full list on [Keyboard Shortcuts](../interface/hotkeys.md).

??? info "The tree shortcuts"
    | Shortcut | Action |
    |----------|--------|
    | ++ctrl+n++ / ++shift+a++ | Add (smart / full menu). |
    | ++f2++ | Rename. |
    | ++del++ / ++x++ | Delete. |
    | ++ctrl+g++ / ++alt+g++ | Group / ungroup (Tags & Rules). |
    | ++ctrl+t++ | Retarget. |
    | ++ctrl+i++ | Invert multi-selection. |
