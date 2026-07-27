---
icon: material/movie-open
---

# Takes — the Review Loop

A **Take** is one attempt at a layer — exactly like a film take. You build the shot, show it, collect feedback, save a take, work the notes in, and show it again: take 1, take 2, take 3 … until it's approved. Takes live at the deepest tier of the cascade, so every take can carry its own camera, world, action, compositor, presets and variant — while the layer itself stays untouched.

Each take also carries a short **feedback note** — what the review asked for that round — so the whole conversation stays attached to the takes it produced.

!!! info "Formerly \"View Layer Versions\""
    Earlier releases called this tier *View Layer Versions*. Same data, same
    behavior — the word finally matches what the tier always was: sequential
    review iterations of one layer. Saved `.blend` files load unchanged, and
    the `{version}` token keeps working forever as an alias of `{take}`.

## :material-help-circle-outline: When to Use

*A new take vs. a fresh view layer.*

| Use a Take when… | Use a new View Layer when… |
|------------------------|----------------------------|
| You're iterating on the same shot between reviews. | You need a fundamentally different shot (different objects rendered, different passes). |
| You want to A/B compare lighting / lensing on the same shot. | You need different visibility / collection setups. |
| You want different render-preset variations of one shot. | You need a different animation. |

## :material-plus-circle: Creating a Take

1. Select a View Layer in the Takes Tree.
2. Click **+** → **Add Take**, or press ++ctrl+n++ on the View Layer.
3. The take inherits every cascade value from its parent. Override only what you need.

New takes are named by your **take naming template** (Preferences → Naming → Takes, default `Take_001`-style numbering).

## :material-refresh: The Review Loop

The list of takes *is* the review history — every row shows its slate number ("Take 3 · NightLighting"):

1. Build the shot and show it.
2. Get feedback → open the take's **note** (the :material-text: icon on the row) and write down what was asked.
3. Click **New Take from Here** — the current take is copied completely (every override, rule, variant and preset), becomes the new active take, and starts with a fresh empty note.
4. Work the notes in, show again. Repeat until approved.

Step back through past takes any time by activating an earlier row — or circle an earlier one as the keeper and simply leave it active. The note popover also lists the earlier takes' notes, so the whole feedback trail reads in one place.

!!! tip "Numbers are positions"
    The slate number is the take's position in the list. Deleting a take
    renumbers the ones after it — names are the stable identity, numbers are
    the running order.

## :material-stairs: Cascade Position

Takes sit at the bottom of the cascade hierarchy:

```
Global → Scene Group → Scene → View Layer Group → View Layer → Take
```

A value set on a take overrides every parent tier. Values left empty fall back to the parent View Layer.

## :material-swap-horizontal: Switching Takes

Click a take row in the tree. The cascade re-resolves and the viewport updates to reflect the take's overrides. The active take's name appears in `[take]` for Smart Output naming.

## :material-folder-cog: Smart Output

Three tokens identify the active take:

- `[take]` — the active take's own (custom) name (the old spelling `[version]` keeps working forever).
- `[take_number]` — the running slate number: the take's position in its list, padded explicitly like `[take_number:02d]`.
- `[viewlayer]` — the parent View Layer's name.

Combine them in your output pattern, e.g.:

```
[scene][sep][viewlayer][sep][take][sep]####.[file_format]
```

## :material-keyboard: Hotkeys

Takes share the generic tree hotkeys:

| Shortcut | Action |
|----------|--------|
| ++ctrl+n++ | Add a Take under the selected View Layer. |
| ++f2++ | Rename. |
| ++del++ / ++x++ | Delete. |
| ++shift+d++ / ++alt+d++ | Duplicate (full / linked). |

See [Keyboard Shortcuts](../interface/hotkeys.md).
