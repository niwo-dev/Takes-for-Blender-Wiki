---
icon: material/monitor-dashboard
---

# Process Monitor

The **Process Monitor** is a runtime diagnostics view added in v0.6.6. It shows what the addon's background processes are doing in real time — useful when you're troubleshooting viewport lag, suspicious cascade behaviour, or just want to see which subsystems are active.

## :material-map-marker: Where to Find It

*3D Viewport > Sidebar (++n++) > **Takes** tab > **Navigation** panel header > Monitor switcher.*

The header has a 3-way switcher:

| Tab | Shows |
|-----|-------|
| **Process Monitor** | Live process tree (the focus of this page). |
| **Debug Console** | Recent log lines (filtered by *Preferences > Debug > Topics*). |
| **View Layer Switch Profiler** | Per-step timing for the most recent View Layer switch. |

## :material-file-tree: Process Tree Hierarchy

Processes are grouped into 6 feature buckets. Each bucket has a master toggle and a chevron to expand/collapse:

| Group | Tracks |
|-------|--------|
| **Core** | View Layer Switch, Cascade overrides, Lock System, Slot Processing. |
| **UI Sync** | Tree drawing, list syncing, panel redraws. |
| **Reference State** | Auto-mirror, snap-back, rest cache. |
| **Variant Switch** | Material swap, pool resolution. |
| **Batch Render** | Modal foreground / background subprocess monitoring. |
| **Render Presets** | Cascade resolution, dirty-state checks, sync. |

A row turns red when a process logs an error, amber on warnings, green when idle. Click a row to drill into its log lines in the Debug Console.

## :material-toggle-switch: Master Toggles

Each group has a master switch. Disabling a group **suspends** its handlers (where safe) so you can isolate causes of viewport lag without restarting Blender. Re-enable to restore normal behaviour.

## :material-help-circle-outline: When to Use It

- The viewport is stuttering and you want to see which feature group is firing during scrub.
- A View Layer switch feels slow — open the **View Layer Switch Profiler** tab to see per-step times.
- A bug report asks for a log — flip on *Preferences > Debug > Enable Logging*, reproduce the issue, then copy lines from the Debug Console.

## :material-keyboard: Hotkeys

The Process Monitor list shares the generic list hotkeys:

| Shortcut | Action |
|----------|--------|
| ++ctrl+i++ | Invert multi-selection. |
| ++shift++ + click on a group toggle | Enable all subprocesses in the group. |
| ++alt++ + click on a group toggle | Invert the subprocess selection. |

See [Keyboard Shortcuts](../interface/hotkeys.md).
