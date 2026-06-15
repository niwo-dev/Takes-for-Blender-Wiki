---
icon: material/monitor-dashboard
---

# Process Monitor

The **Process Monitor** is a runtime diagnostics view added in v0.6.6. It shows what the addon's background processes are doing in real time — useful when you're troubleshooting viewport lag, suspicious cascade behaviour, or just want to see which subsystems are active.

## :material-map-marker: Where to Find It

The diagnostic panel is hidden by default. To reveal it, **Alt+Click the Settings gear icon** in the Navigation panel header (a regular click on the gear opens addon preferences).

!!! note "What the gear actually toggles"
    Alt+Click on the gear flips a single internal flag — `tks_show_process_monitor`. That covers the **Process Monitor** and **Debug Console** views (which are the same panel in different modes). The **View Layer Switch Profiler** is a separate panel reached from the in-panel switcher described below, not from the gear directly.

Once the diagnostic UI is visible, its header carries a 3-way switcher for picking the active view:

| Mode | Icon | Shows |
|------|------|-------|
| **Process Monitor** | F-curve | Live process tree (the focus of this page). |
| **Debug Console** | Console | Recent log lines (filtered by *Preferences > Debug > Topics*). |
| **View Layer Switch Profiler** | Time | Per-step timing for the most recent View Layer switch. |

The same 3-way switcher is mirrored in the Profiler header, so you can hop between any of the three views once at least one of them is open. Alt+Click the gear again to dismiss the Process Monitor / Debug Console pair.

## :material-file-tree: Process Tree Hierarchy

Processes are grouped into 6 feature buckets. Each bucket has a master toggle and a chevron to expand/collapse:

| Group | Tracks |
|-------|--------|
| **Core** | View Layer Switch, Cascade overrides, Lock System, Slot Processing. |
| **UI Sync** | Tree drawing, list syncing, panel redraws. |
| **Rest State** | Auto-mirror, snap-back, rest cache. |
| **Variant Switch** | Material swap, pool resolution. |
| **Batch Render** | Modal foreground / background subprocess monitoring. |
| **Render Presets** | Cascade resolution, dirty-state checks, sync. |

A row turns red when a process logs an error, amber on warnings, green when idle. Clicking a row toggles that handler/timer's **enabled** state — disabled rows stop firing until re-enabled, which is the main way you isolate viewport-lag causes without restarting Blender.

## :material-toggle-switch: Master Toggles

Each group has a master switch. Disabling a group **suspends** its handlers (where safe) so you can isolate causes of viewport lag without restarting Blender. Re-enable to restore normal behaviour.

## :material-help-circle-outline: When to Use It

- The viewport is stuttering and you want to see which feature group is firing during scrub.
- A View Layer switch feels slow — open the **View Layer Switch Profiler** tab to see per-step times.
- A bug report asks for a log — flip on *Preferences > Debug > Enable Logging*, reproduce the issue, then copy lines from the Debug Console.

## :material-keyboard: Hotkeys

The Process Monitor list shares the generic list hotkeys plus row-click modifiers:

| Shortcut | Action |
|----------|--------|
| Click on a process row | Toggle that single process on / off. |
| ++shift++ + click on a process row | **Range-toggle** from the last-toggled row down to this one. |
| ++alt++ + click on a process row | **Invert all** processes (every row flips its enabled state). |
| Click on a group master toggle | Flip every process in that group together. |
| ++ctrl+i++ | Invert multi-selection (generic list shortcut). |

See [Keyboard Shortcuts](../interface/hotkeys.md).
