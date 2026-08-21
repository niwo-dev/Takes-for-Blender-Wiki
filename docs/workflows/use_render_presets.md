---
icon: material/content-save-cog
---

# Use Render Presets

When several shots should render with the same settings, saved once and reused.

1. Dial in your render settings in Blender's Properties editor.
2. Open the preset popover — the gear icon on the cascade row.
3. Click **New Preset** and give it a name.
4. Go to the row you want it on — Scene, View Layer or Take — and open its preset popover.
5. Click the preset field and pick your preset from **{{ op('tks.search_render_preset').bl_label }}**.

You now have one saved look on that tier. Every row below inherits it, unless it sets its own.

??? info "Details and edge cases"
    Presets ride the cascade, so set one at any tier from **Global** down to
    **Take**. A deeper tier always beats a wider one. The **X** beside the field
    clears the assignment; the preset file stays on disk.

    Nine kinds of settings save this way — **Render**, **Output**, **Camera**,
    **World** and more — and each one cascades on its own.

    Change a setting afterwards and the preset goes *dirty*. **Accept** saves
    your change into the preset, **Revert** puts the stored value back. Pending
    changes also collect in the Navigation panel's **Preset Changes** warning.

Full reference: [Render Presets](../features/render_presets.md)
