---
icon: material/sync
---

# Viewport Sync

**Viewport Sync** keeps your viewport tool settings identical across every scene in the file. Blender stores snap, pivot, proportional-edit and friends **per scene** — so in a multi-scene Takes project, every scene switch silently swaps your toolbox out from under you. With Viewport Sync enabled, changing a tool setting in the scene you're working in mirrors it to all other scenes on the spot, and switching takes never changes how your tools behave.

## :material-map-marker: Where to Find It

*Preferences → Workflow → Sync → **Viewport Tool Settings***. The section has one master switch — **Enable Viewport Sync** — with the individual setting groups indented beneath it. The master switch gates everything: while it is off, the feature does no work at all (no subscriptions, zero overhead).

## :material-format-list-checks: What Gets Synced

Each group has its own toggle, so you can mirror exactly the settings you care about:

| Group | Mirrors |
|-------|---------|
| **Transform Orientation + Pivot** | Transform orientation, pivot point, and the Options popover's *Affect Only* (Origins / Locations / Parents) and edit-mode correctness toggles. |
| **Snap Settings** | The snap toggle, snap base and targets, align-rotation and the other popover options, Affect Move/Rotate/Scale, and the rotation increments. |
| **Proportional Edit** | The proportional-edit toggles, falloff, size, *Connected* and *Projected*. |
| **Mirror Axes** | The object-mode mirror X / Y / Z toggles (and topology mirror where available). |
| **Auto-Merge** | The auto-merge and *Split Edges & Faces* toggles plus the threshold distance. |
| **Lock Object Mode** | The lock-object-mode toggle. |
| **UV Options** | Live Unwrap and the UV editor's *Sync Selection*. |

## :material-arrow-decision: How It Propagates

Sync is **one-way, outward from the scene you're working in**: edit a setting in the active scene and it is copied to all other scenes immediately. Enabling a group also performs an instant backfill, so every scene aligns the moment you flip the toggle — no need to touch a setting first.

The mirroring is live (it listens for the actual property changes rather than polling), survives file loads, and only ever writes values that differ — so with everything in sync it costs effectively nothing.

!!! tip "Why not just set it once per scene?"
    You can — until the next time you toggle snapping mid-task and then switch takes. Viewport Sync exists so tool state is something you set **once for the file**, not once per scene. If you deliberately want per-scene tool setups (say, one scene for UV work with Sync Selection on), leave the matching group off and keep the rest synced.
