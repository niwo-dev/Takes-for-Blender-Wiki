---
icon: material/camera
---

# Still Mode

**Still Mode** pins a take's timeline to frame 0 — the *still frame* — so product stills always render from one known, stable frame while animated takes keep their full frame range. It is a cascade state like any other override: set it once at the top and every take inherits it, then let individual takes opt back into animation.

## :material-map-marker: Where to Find It

- **Navigation header** — the **{{ op('tks.still_global_toggle').bl_label }}** button (still-camera icon) flips the whole project between Still and Animate at the Global tier.
- **Tree rows** — every cascade level (Scene Group, Scene, View Layer Group, View Layer, Version) carries a Still popover (`tks.still_popover`): pick **Still** or **Animate** (`tks.still_set`), or **Clear (Inherit)** to fall back to the parent tier. ++alt++ + click the icon clears straight to Inherit, matching the other cascade icons.

## :material-stairs: How It Resolves

Still follows the same inherit-down rules as the rest of the [cascade](cascade.md): a tier without its own value inherits from above, and the nearest explicit **Still** or **Animate** wins. Typical setup — Global set to Still for a product-shot project, with one "turntable" View Layer set to Animate.

While a scene resolves to Still, its frame range is clamped to the still frame (start, end and playhead all pinned to frame 0); switching it back to Animate restores the frame range and playhead it had before.

## :material-swap-horizontal: Interactions

- **Timeline Sync** is mutually exclusive with Still Mode — syncing the playhead across scenes would fight the frame pin. Turning Still on remembers Timeline Sync's state and parks it (button grayed); turning Still off restores it.
- The viewport mode pills show an active Still Mode alongside Autokey / Value Lock / Rest Mode, so you always see why the timeline won't move.

!!! tip "Why frame 0?"
    Keyed *rest* values and still-product states live at frame 0 by convention in Takes (see [Rest State](rest_state.md)). Pinning stills to that frame means a still take renders exactly the state your rest baseline describes.
