---
icon: material/sync
---

# Viewport Sync

**Viewport Sync** keeps your viewport tool settings identical in every scene. Blender stores snap, pivot, proportional edit and friends **per scene**, so in a multi-scene project each scene switch swaps your toolbox out from under you.

With sync on, a setting you change is mirrored to every other scene at once. Switching takes never changes how your tools behave.

## :material-map-marker: Where to Find It

*Preferences → Workflow → Sync → **Viewport Tool Settings***.

One master switch, **Enable Viewport Sync**, sits above the indented setting groups. While it is off, the feature does no work at all.

## :material-format-list-checks: What Gets Synced

Each group has its own toggle, so you mirror exactly the settings you care about:

| Group | Mirrors |
|-------|---------|
| **Transform Orientation + Pivot** | Orientation, pivot point, the Options popover's *Affect Only* (Origins / Locations / Parents) and the edit-mode correctness toggles. |
| **Snap Settings** | The snap toggle, snap base and targets, align rotation, the other popover options, Affect Move/Rotate/Scale and the rotation increments. |
| **Proportional Edit** | The proportional-edit toggles, falloff, size, *Connected* and *Projected*. |
| **Mirror Axes** | Object-mode mirror X / Y / Z, plus topology mirror where available. |
| **Auto-Merge** | Auto-merge, *Split Edges & Faces* and the threshold distance. |
| **Lock Object Mode** | The lock-object-mode toggle. |
| **UV Options** | Live Unwrap and the UV editor's *Sync Selection*. |

## :material-arrow-decision: How It Propagates

Sync is **one-way, outward from the scene you are working in**. Edit a setting there and it is copied to all other scenes immediately.

Enabling a group also backfills at once, so every scene aligns the moment you flip the toggle.

??? info "What it costs"
    The mirroring is live — it listens for the actual property changes rather
    than polling — survives file loads, and only ever writes values that differ.
    With everything already in sync it costs effectively nothing.

??? tip "Why not just set it once per scene?"
    You can — until the next time you toggle snapping mid-task and then switch
    takes. Viewport Sync exists so tool state is something you set **once for the
    file**, not once per scene. If you deliberately want per-scene tool setups
    (say, one scene for UV work with Sync Selection on), leave the matching group
    off and keep the rest synced.
