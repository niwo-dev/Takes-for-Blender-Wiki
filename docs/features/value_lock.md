---
icon: material/lock-check
---

# Value Lock

The **Value Lock** protects your scene's unkeyed values while you work. Nudge
a locked value by accident and it snaps straight back to what it was when you
engaged the lock — guarding against silent global changes that would apply at
every frame.

## :material-lightbulb-outline: Concept

In a take-based workflow most properties are *not* animated: a lamp's power, a
material's roughness, the world strength. Those static values apply to every
frame of every take, so an accidental drag on one of them quietly changes all
your renders. The Value Lock captures a baseline of those values and restores
any that drift — while everything keyframed or driven stays fully editable.

## :material-tune: Controls

| Control | Location | Description |
|---------|----------|-------------|
| **{{ op('tks.value_lock_toggle').bl_label }}** | Navigation header, between the **Still Mode** and **Autokey** buttons. | Engages the lock: the current unkeyed values of your **selected objects** (plus their materials, object data, the world, and everything else that can hold a static value) are captured as the baseline. Click again to release. |

## :material-shield-check: What's locked — and what isn't

- **Locked:** unkeyed, undriven values on the selection captured at lock time
  — object transforms, material and node values, light and world settings.
- **Free:** anything with keyframes or drivers. Animated channels are the
  point of the workflow; the lock never touches them.
- **Opting out:** deliberately inserting a key on a locked channel takes that
  channel out of the lock's care — keying is always an intentional act.

## :material-sync-alert: Interplay

- **Autokey** pauses while the lock is on (its button dims) and returns on
  unlock — autokey would keyframe every nudge, which the unkeyed-only lock
  would then leave free, so the two are contradictory by design.
- **[Rest State Mode](rest_state.md)** and the lock guard the same values, so
  they take turns: engaging one releases the other.
- **Take switching** keeps working while locked, on any View Layer, with or
  without an action.
