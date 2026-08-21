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
| **{{ op('tks.value_lock_toggle').bl_label }}** | Navigation header, between the **Still Mode** and **Autokey** buttons. | Engages the lock and captures the unkeyed values of **every object in the scene** as the baseline. That includes their materials, object data, shape keys, the world, and anything else holding a static value. You do not need to select anything. Click again to release. |

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
