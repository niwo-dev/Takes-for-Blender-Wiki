---
icon: material/earth
---

# Globals Panel

The **Globals** panel is the project-wide control centre. It holds the preset library, automation rules, the tag library and the Variant Switch tree — everything not tied to one Scene or View Layer.

## :material-map-marker: Where to Find It

*3D Viewport > Sidebar (++n++) > **Takes** tab > **Globals***.

## :material-shape: Modes

The header has a row of mode buttons. Each switches the panel body to a different view:

| Mode | Icon | Shows |
|------|------|-------|
| **Presets** | preset | Overview of 8 preset categories. |
| **Variants** | UV-sync | The [Variant Switch](variant_switch.md) tree. |
| **Rules** | gear (system) | Automation [rules](rules.md). |
| **Tags** | colour mod | The full [tag](tags.md) library. |

??? question "Looking for the Rest Action?"
    It is not in this panel. The **Rest Action** picker sits in the header of the
    Takes tree, and **Auto-Mirror Keyframes** lives in
    *Preferences > Workflow*. Full detail on [Rest State](rest_state.md).

## :material-palette-swatch: Presets Mode

Eight preset rows, each with its current assignment, dirty indicator and revert button:

Render • Output • File Output • View Layer • Color Management • Camera • World • Material

Click any preset to open its picker. Click the **X** at the end of a row to clear it. See [Render Presets](render_presets.md).

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

The Globals panel shares the generic tree hotkeys with every other tree panel.

Full list: [Keyboard Shortcuts](../interface/hotkeys.md)
