---
icon: material/camera
---

# Still Mode

**Still Mode** pins a take's timeline to frame 0 — the *still frame* — so product stills always render from one stable frame while animated takes keep their full range.

It is a cascade state like any other override: set it once at the top, then let individual takes opt back into animation.

## :material-map-marker: Where to Find It

- **Navigation header** — the **{{ op('tks.still_global_toggle').bl_label }}** button (still-camera icon) flips the whole project between Still and Animate at the Global tier.
- **Tree rows** — every cascade level carries a Still popover: pick **Still**, **Animate**, or **Clear (Inherit)** to fall back to the parent tier. The timeline icon sits right after the tag column.

??? info "Setting it per tier"
    Every level takes a value: Global, Scene Group, Scene, View Layer Group,
    View Layer and Take. The **Global row** sets the project default — every take
    inherits it until a lower tier overrides.

    ++alt++ + click the icon clears straight back to Inherit, matching the other
    cascade icons.

## :material-stairs: How It Resolves

Still follows the same inherit-down rules as the rest of the [cascade](cascade.md). A tier without its own value inherits from above, and the nearest explicit **Still** or **Animate** wins.

A typical setup: Global on Still for a product-shot project, with one "turntable" View Layer on Animate.

While a scene resolves to Still, its frame range is clamped to the still frame — start, end and playhead all pinned to frame 0. Switching back to Animate restores the range and playhead it had before.

## :material-swap-horizontal: Interactions

- **Timeline Sync** is mutually exclusive with Still Mode, because syncing the playhead across scenes would fight the frame pin. Turning Still on parks Timeline Sync (button grayed) and remembers its state; turning Still off restores it.
- The viewport mode pills show an active Still Mode alongside Autokey, Value Lock and Rest Mode, so you always see why the timeline will not move.

??? tip "Why frame 0?"
    Keyed *rest* values and still-product states live at frame 0 by convention in
    Takes (see [Rest State](rest_state.md)). Pinning stills to that frame means a
    still take renders exactly the state your rest baseline describes.
