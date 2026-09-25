---
icon: material/lifebuoy
---

# Troubleshooting

Find your symptom below. Each row names the one thing to check first.

## :material-movie-open: Takes and animation

| What you see | Check this |
|---|---|
| An object snapped to a different pose when I switched | Working as intended — it has no keys on this layer, so it went to its [Rest State](features/rest_state.md) |
| Autokey is on but records nothing | *Only Insert Available* — see [Autokey Is Being Blocked](interface/navigation_panel.md#autokey-is-being-blocked) |
| One object should keep its own animation | [Pin it](workflows/keep_an_objects_own_animation.md) |
| I duplicated an object and its animation came too | The **On Duplicate** mode — see [Inspector](interface/inspector_panel.md) |
| A row in the watchlist is red | A slot name drifted from its template. The row's rename button fixes it |
| A value I set keeps moving | Turn on [Value Lock](features/value_lock.md) |
| The timeline will not move | [Still Mode](features/still_mode.md) is pinning it to frame 0 |

## :material-arrow-decision: The cascade

| What you see | Check this |
|---|---|
| A cascade icon is dimmed | The value is inherited from a tier above. Bright means set here |
| My camera changed by itself | A tier above assigned one. Open [Context Properties](interface/context_properties.md) to see which |
| A mode button is greyed out | Another mode is holding it — see [The Modes](features/modes.md) |
| The variant swapped the wrong material | A pool conflict. The **Variants** warning names the object and slot |

## :material-image-multiple: Rendering

| What you see | Check this |
|---|---|
| A layer did not render | Its **render toggle** is off. Selection does not decide — see [Batch Render](features/batch_render.md) |
| Nothing rendered at all | Save the `.blend` first. Background mode needs a saved file |
| A take was skipped | It has no camera. The queue says so before it starts |
| I cannot find my renders | The pattern is in *Properties ▸ Output* — see [Smart Output](features/smart_output.md) |

## :material-alert-outline: The panel itself

| What you see | Check this |
|---|---|
| The whole panel is locked | It is asking a question, or wants a rebuild — see [Recover Your Take Organisation](workflows/recover_take_organisation.md) |
| My tree went flat | Same page. Your organisation has a safety copy |
| Warning icons I do not recognise | Hover one to see what is inside, then click it. Each family opens a panel with its own fixes — see [Navigation Panel](interface/navigation_panel.md#warnings) |
| Switching layers is slow | Turn on **Preload View Layers** — see [View Layer Preload](interface/context_properties.md#view-layer-preload) |

## :material-puzzle: Installing

??? info "Three install problems"
    | What you see | Check this |
    |---|---|
    | The add-on does not appear | Install the `.zip` without extracting it |
    | Crashes when switching layers | Another add-on's handler. Disable others to find it, then report it below |
    | My own shortcuts vanished | Fixed in the current build. Update, then set them again |

??? info "Why the shortcuts vanished"
    An older build wrote its shortcuts into the same place Blender keeps
    yours. Blender rebuilds that place on every restart, and it dropped your
    shortcuts along with the add-on's.

    The current build keeps its own shortcuts separate, so the rebuild leaves
    yours alone. Blender keeps no backup of them, so any that were already
    lost have to be set again.

## :material-bug: Still stuck — send a log

??? info "Five steps to a log a developer can read"
    1. Open *Preferences ▸ Developer* and turn on **Enable Debug Logging**.
    2. Under **Levels**, switch on the severities you want. They all start off.
    3. Open **Topics** and tick only the topic named after your symptom.
    4. Reproduce the problem.
    5. Click **Export Debug Log**, then **Email Dev Support**.

??? tip "Pick the right topic"
    A topic is named after the symptom you would report. **SWITCH** for take and
    layer switching, **RENDER** for batch render, **VARIANT** for material
    swaps, **REST** for poses, **STORE** for missing organisation.

    Ticking everything buries the lines that matter. Full list on
    [Developer](preferences/debug.md).

??? tip "If it is slow rather than broken"
    The **View Layer Switch Profiler** times each step of one switch. The
    **Process Monitor** shows what is running while the viewport stutters.
    Both open by ++alt++-clicking the gear — see [Process Monitor](features/process_monitor.md).
