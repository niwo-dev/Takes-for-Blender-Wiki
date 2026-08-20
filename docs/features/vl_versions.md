---
icon: material/movie-open
---

# Takes — the Review Loop

A **Take** is one attempt at a View Layer, exactly like a film take.

You build the shot, show it, save a take, work the notes in, and show it again — take 1, take 2, take 3 — until it is approved.

This page covers the Take level only. For the tree above it, see [The Takes System](takes.md).

??? info "Formerly \"View Layer Versions\""
    Earlier releases called this tier *View Layer Versions*. Same data, same
    behavior — the word finally matches what the tier always was: sequential
    review iterations of one layer. Saved `.blend` files load unchanged, and
    the `{version}` token keeps working forever as an alias of `{take}`.

## :material-help-circle-outline: When to Use

Add a take when you keep iterating on the *same* shot. Add a View Layer when the shot itself changes.

??? info "Take or new View Layer?"
    | Use a Take when… | Use a new View Layer when… |
    |------------------------|----------------------------|
    | You're iterating on the same shot between reviews. | You need a fundamentally different shot (different objects rendered, different passes). |
    | You want to A/B compare lighting / lensing on the same shot. | You need different visibility / collection setups. |
    | You want different render-preset variations of one shot. | You need a different animation. |

## :material-plus-circle: Creating a Take

1. Select a View Layer in the Takes Tree.
2. Click **+** → **Add Take**, or press ++ctrl+n++.
3. Override only what you need — the take inherits the rest, and never changes the View Layer itself.

??? tip "How new takes get their names"
    Your **take naming template** names them: **Preferences → Naming → Takes**,
    with `Take_001`-style numbering by default.

## :material-refresh: The Review Loop

The list of takes *is* your review history. Every row shows its slate number, like "Take 3 · NightLighting".

1. Build the shot and show it.
2. Write down what the review asked for in the take's **note** — the :material-text: icon on the row.
3. Click **New Take from Here**. The copy becomes the active take, with a fresh empty note.
4. Work the notes in, show again. Repeat until approved.

Activate an earlier row any time to step back. To settle on one, leave it active.

??? info "Notes and slate numbers"
    **New Take from Here** copies everything: every override, rule, variant and
    preset. Only the note starts empty.

    The note popover also lists the earlier takes' notes, so the whole feedback
    trail reads in one place.

    The slate number is the take's position in the list. Deleting a take
    renumbers the ones after it — names are the stable identity, numbers are
    the running order.

## :material-stairs: Cascade Position

A take sits at the very bottom of the tree, so it beats every level above.

Anything you leave empty falls back to the parent View Layer.

??? info "What a take can override"
    Its own camera, world, action, compositor, preset slots and product variant —
    the same set every other level offers. The rules are the same too, so read
    them once on the [Cascade System](cascade.md#override-tiers) page.

## :material-swap-horizontal: Switching Takes

Click a take row in the tree. Its overrides resolve and the viewport updates. Only one take of a View Layer is live at a time.

## :material-folder-cog: Smart Output

Put `{take}` in your output pattern for the active take's name, or `{take_number}` for its slate number.

??? tip "An example pattern"
    `{viewlayer}` gives you the parent View Layer's name, so a full pattern reads:

    ```
    {scene}{sep}{viewlayer}{sep}{take}{sep}####.{file_format}
    ```

    Every token is listed on [Smart Output](smart_output.md).

## :material-keyboard: Hotkeys

++ctrl+n++ adds a take under the selected View Layer, ++f2++ renames, ++del++ deletes — see [Keyboard Shortcuts](../interface/hotkeys.md).
