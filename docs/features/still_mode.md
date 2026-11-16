---
icon: material/camera
---

# Still Mode

**Still Mode** pins a take's timeline to frame 0 — the *still frame* — so product stills always render from one stable frame while animated takes keep their full range.

It is a cascade state like any other override: set it once at the top, then let individual takes opt back into animation.

## :material-map-marker: Where to Find It

- **Navigation header** — the **{{ op('tks.still_global_toggle').bl_label }}** button (still-camera icon). Click it to lock the whole project to one kind. While the lock is on, every tree row shows as locked, Global included. ++shift++ + click picks **Still** or **Animation**. Off means each take decides for itself, and the tree's **Global row** is only the default the tiers below inherit. Switched back on, it comes back in the kind you last used, unless you fixed one in the **Still Mode Click** preference.
- **Tree rows** — every cascade level carries a Still popover: pick **Still** or **Animate**, or **(Clear)** to fall back to the parent tier. Each choice runs **{{ op('tks.still_set').bl_label }}** on that tier. The timeline icon sits right after the tag column.

??? info "Setting it per tier"
    Every level takes a value: Global, Scene Group, Scene, View Layer Group,
    View Layer and Take. The **Global row** sets the project default — every take
    inherits it until a lower tier overrides.

    ++alt++ + click the icon clears straight back to Inherit, matching the other
    cascade icons.

## :material-stairs: How It Resolves

Still follows the same inherit-down rules as the rest of the [cascade](cascade.md). A tier without its own value inherits from above, and the nearest explicit **Still** or **Animate** wins.

A typical setup: Global on Still for a product-shot project, with one "turntable" View Layer on Animate.

??? tip "Start every new file in Still"
    Set the **Global row** to **Still** in an empty file. Then choose **File › Defaults › Save Startup File**.
    Every new file now starts with Global on Still, its timeline pinned to frame 0.
    Files you saved before keep their own setting.

While a scene resolves to Still, its frame range is clamped to the still frame — start, end and playhead all pinned to frame 0. Switching back to Animate restores the range and playhead it had before.

## :material-key-chain-variant: Scattered Keys { #scattered-keys }

A Still take only shows frame 0, so keys on other frames no longer count and can make the viewport show the wrong state. When a take turns Still and still holds such keys, the **Objects** warning family opens its **Scattered Keys** warning. It lists every object with keys off frame 0.

- **Object rows** — click the arrow to open an object and see its properties. The count reads like "5 keys · 3 frames".
- **{{ op('tks.still_gather_all').bl_label }}** — moves every listed key of this take onto frame 0 after one confirm. The latest key of each property stays; the other keys are removed.
- **Gather** (the arrow icon at the right of a row) — does the same for that one object or property, with no question.

Each gather is one undo step. If the take shares its animation with an Animation take, or Rest State Mode is on, the buttons grey out and the tooltip says why.

??? info "Keep an older key: {{ op('tks.still_scatter_pick').bl_label }}"
    By default the latest key wins. To keep another value, click the frame text on a property row. The menu lists the frames that hold a key, newest first. Choose one with **{{ op('tks.still_scatter_pick').bl_label }}**, then press **Gather** on that row (or **{{ op('tks.still_gather_all').bl_label }}**). The picked frame's value lands on frame 0.

## :material-swap-horizontal: Interactions

- **Frame Sync** stands down while a take resolves Still, because syncing the playhead across scenes would fight the frame pin. Only that one mode is held off. The [Timeline](../interface/navigation_panel.md) button greys out on a Still take, but stays clickable while **Scene Follow** or **Viewport Preview** is on, so you can switch them off.
- The viewport mode pills show an active Still Mode alongside Autokey, Value Lock and Rest Mode, so you always see why the timeline will not move.

??? tip "Why frame 0?"
    Keyed *rest* values and still-product states live at frame 0 by convention in
    Takes (see [Rest State](rest_state.md)). Pinning stills to that frame means a
    still take renders exactly the state your rest baseline describes.
