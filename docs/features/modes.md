---
icon: material/toggle-switch
---

# The Modes

Seven buttons sit at the top of the Takes panel. Each one changes how the file behaves while it is on.

They are not settings you set once. You switch one on, work in it, and switch it off.

## :material-format-list-bulleted: What each one is for

| Mode | While it is on |
|---|---|
| **Rest Mode** | Every layer shows its neutral baseline, so you can compare or adjust it — see [Rest State](rest_state.md) |
| **Still Mode** | Takes are pinned to frame 0, so a product still cannot scrub — see [Still Mode](still_mode.md) |
| **Value Lock** | Unkeyed values snap back if you nudge them — see [Value Lock](value_lock.md) |
| **Autokey** | Blender keys what you move, across every scene |
| **Timeline** | *Frame Sync* keeps every take on the same frame; *Scene Follow* moves the window with your mouse |
| **Variant Live** | The viewport follows the finish you are editing — see [Variant Switch](variant_switch.md) |
| **Diff State** | Objects are coloured by where their values come from — see [Diff State](diff_state.md) |

## :material-swap-horizontal: Some modes take turns

Four pairs cannot both be on. This is on purpose, not a bug — each pair wants the same thing to behave in opposite ways.

| These two | Why only one |
|---|---|
| **Value Lock** and **Autokey** | The lock holds unkeyed values still. Autokey would key every nudge, and a keyed value leaves the lock's care. |
| **Value Lock** and **Rest Mode** | Both guard the same unkeyed values. Switching one on releases the other. |
| **Variant Live** and **Autokey** | A material swap is not something you want keyed. Arming Live switches Autokey off, and gives it back after. |
| **Still Mode** and **Frame Sync** | Still pins the playhead. Frame Sync moves it. Still wins, and Frame Sync waits. |

So a greyed-out mode button is usually another mode holding it, not a fault.

## :material-eye: Seeing which are on

Each active mode draws a coloured pill in the viewport, so you can read the file's state with the sidebar closed.

??? tip "Hiding them, and reaching them without the panel"
    Hide any pill, or any button in the row, under *Preferences ▸ Interface ▸
    Viewport Overlay*.

    ++shift+alt+q++ opens the [Mode Pie](pie_menus.md#mode-pie) at your cursor
    with the same switches. A button you hide from the panel stays in the pie.
