---
icon: material/movie-open-check
---

# Switch Between Takes

When you want to compare review rounds of the same shot, or go back to an earlier one.

1. Open the **Takes** tab in the 3D Viewport sidebar (++n++).
2. Click the dot at the left of a View Layer row to make that layer active.
3. Click the expand chevron on the row to show its takes.
4. Click a take row to activate it. The viewport updates at once.
5. Click the same row again to switch the take off.

You now have that take live. Its camera, world, action, compositor and presets apply on top of the View Layer.

??? info "Details and edge cases"
    Only one take of a View Layer is live at a time. Activating one deactivates
    the previous one for you.

    Switching a take off falls back to the View Layer's own settings. Anything
    the take leaves empty falls back there too.

    Every row shows its slate number, like "Take 3 · NightLighting". Numbers are
    the running order — names are the stable identity.

    Need a fresh round instead of an old one? **{{ op('tks.new_take_from_here').bl_label }}**
    copies the current take, makes the copy active, and starts it with an empty
    feedback note. ++ctrl+n++ adds a blank take under the selected View Layer.

Full reference: [Takes — the Review Loop](../features/vl_versions.md) and [Context Properties](../interface/context_properties.md)
