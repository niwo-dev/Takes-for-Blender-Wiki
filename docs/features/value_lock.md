---
icon: material/lock-check
---

# Value Lock

The **Value Lock** protects your scene's unkeyed values while you work. Nudge a
locked value by accident and it snaps straight back to what it was when you
engaged the lock.

## :material-lightbulb-outline: Concept

In a take-based workflow most properties are *not* animated: a lamp's power, a
material's roughness, the world strength. Those static values apply to every
frame of every take, so an accidental drag quietly changes all your renders.

The lock captures a baseline of those values and restores any that drift.
Everything keyframed or driven stays fully editable.

## :material-tune: Controls

| Control | Location | Description |
|---------|----------|-------------|
| **{{ op('tks.value_lock_toggle').bl_label }}** | Navigation header, between the **Still Mode** and **Autokey** buttons. | Engages the lock and captures the unkeyed values of **every object in the scene** as the baseline. That includes their materials, object data, shape keys, the world, and anything else holding a static value. You do not need to select anything. Click again to release. Shift+Click to choose **Hard** or **Soft**. |

## :material-shield-check: What's locked — and what isn't

- **Locked:** unkeyed, undriven values in the whole scene at lock time — object
  transforms, material and node values, light and world settings.
- **Free:** anything with keyframes or drivers. Animated channels are the point
  of the workflow; the lock never touches them.
- **Opting out:** inserting a key on a locked channel takes it out of the lock's
  care — keying is always an intentional act.

## :material-sync-alert: Interplay

- **Autokey** pauses while the lock is on (its button dims) and returns on
  unlock. Autokey would
  keyframe every nudge, which the unkeyed-only lock would then leave free.
- **[Rest State Mode](rest_state.md)** and the lock guard the same values, so
  they take turns: engaging one releases the other.
- **Take switching** keeps working while locked, on any View Layer, with or
  without an action.

## :material-lock-open-variant: Soft mode { #soft-mode }

Soft mode lets an unkeyed change on a locked value stay, so you can look at it first. Shift+Click the lock button and choose **Soft**, or set **Mode** in the **Value Lock** section of the add-on preferences. **Hard** is the default and puts every change straight back.

In Soft mode, the change counts as a *temporary change*. It applies to the selected objects, the same as in Hard mode. It snaps back to the original when you:

- switch the view layer or the take,
- switch to **Hard**,
- turn the lock off,
- or unload the add-on.

**Make Global** (right-click the lock) turns the current values into the new originals.

??? info "Renders and saving"

    - Saving writes the originals into the file. Your temporary changes stay live in the session.
    - Every render uses the originals and gives your temporary changes back afterwards. This covers **F12**, **Ctrl+F12**, **Render Active View Layer**, the Ctrl+Click layer render and the batch render.
    - A Ctrl+Click render of another view layer brings you back to your own layer.
    - Known limit: **Render > Render Image** in the top menu and **Alt+F12** still render the temporary changes.

## :material-alert-outline: Temporary changes { #temporary-changes }

While temporary changes exist, a **Temporary Changes** warning shows how many. Each row shows the original value and the current value. The object also gets a purple outline and fill in the viewport, drawn like the Diff State marks.

Handle a change from the warning:

1. Press **Keep** to add a key in the current view layer. The Rest State keeps the original value.
2. Press **Let Go** to put the original back now.
3. Press **Make Global** to make the current value the new original.

??? info "Settings"

    | Setting | Default | Description |
    |---------|---------|-------------|
    | **Mode** (Value Lock section) | Hard | **Hard** restores a change at once. **Soft** keeps it as a temporary change. |
    | **Temporary Mark Colour** | Purple | Colour of the mark in the viewport. Find it beside the **Colour** of each Diff State, behind the pencil button. |
