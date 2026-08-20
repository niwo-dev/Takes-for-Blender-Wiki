---
icon: material/monitor-dashboard
---

# Process Monitor

The **Process Monitor** shows what the addon's background processes are doing, live.

Open it when the viewport stutters, a switch feels slow, or a bug report asks for a log.

## :material-map-marker: Where to Find It

The panel is hidden by default. ++alt++-click the **gear** icon in the Navigation panel header to show it.

A plain click on the gear opens addon preferences instead. ++alt++-click it again to hide the panel.

Its header carries a 3-way switcher for choosing which view you see.

??? info "The three views"
    | View | Icon | Shows |
    |------|------|-------|
    | **Process Monitor** | F-curve | The live process tree — this page. |
    | **Debug Console** | Console | Recent log lines, filtered by *Preferences > Developer > Topics*. |
    | **View Layer Switch Profiler** | Time | Per-step timing for the most recent View Layer switch. |

    The gear shows the **Process Monitor** and **Debug Console** — they are the same
    panel in two modes. The **View Layer Switch Profiler** is a separate panel, reached
    from the switcher. The switcher is mirrored in the Profiler header, so you can hop
    between all three once any one of them is open.

    **Which one you want.** Viewport stuttering during scrub: the Process Monitor.
    A slow View Layer switch: the Profiler. A log for a bug report: turn on
    *Preferences > Developer > Enable Logging*, reproduce the problem, then copy lines
    from the Debug Console.

## :material-file-tree: Process Tree Hierarchy

Processes sit in six feature groups. Each group has a master toggle and a chevron to expand it.

The row colour tells you the state: red after an error, amber on a warning, green when idle.

Click a row to switch that one process off. Disabled rows stop firing until you switch them back on.

??? info "What each group tracks"
    | Group | Tracks |
    |-------|--------|
    | **Core** | View Layer Switch, cascade overrides, Lock System, slot processing. |
    | **UI Sync** | Tree drawing, list syncing, panel redraws. |
    | **Rest State** | Auto-mirror, snap-back, rest cache. |
    | **Variant Switch** | Material swap, pool resolution. |
    | **Batch Render** | Foreground and background render monitoring. |
    | **Render Presets** | Cascade resolution, dirty-state checks, sync. |

## :material-toggle-switch: Master Toggles

Each group has one master switch. It suspends every process in that group at once, where that is safe.

Use it to silence a whole subsystem without restarting Blender. Switch it back on to restore normal behaviour.

## :material-gesture-tap-button: Row & Group Actions

Every click flips live state — no restart needed.

Click a single row for one process, a group's master switch for the whole bucket, or a chevron to fold a group.

??? tip "Modifier clicks"
    | Shortcut | Action |
    |----------|--------|
    | Click a process row | Toggle that one process on or off. |
    | ++shift++ + click a row | Range-toggle, from the last row you clicked down to this one. |
    | ++alt++ + click a row | Invert all — every row flips its state. |
    | Click a group master switch | Flip every process in that group together. |
    | ++shift++ + click a chevron | Expand or collapse **all** groups at once. |
    | ++ctrl+i++ | Invert the multi-selection (generic list shortcut). |

    Full list on [Keyboard Shortcuts](../interface/hotkeys.md).

??? tip "Bisecting viewport lag"
    Switch groups off one at a time, scrub the timeline after each, and watch the
    heartbeat and exec-time columns. When the stutter disappears, the group you just
    switched off is the culprit. Then click single rows to find the exact process.

## :material-restart: Restart Processes

If a row that should be ticking shows no heartbeat, click **Restart Processes**.

It brings every dead process back in one pass and tells you how many it revived.

++alt++-click the same button to toggle the **Auto-Restart Watchdog**. While it is on, dead processes come back on their own and a plain click does nothing. Click again for manual restarts.
