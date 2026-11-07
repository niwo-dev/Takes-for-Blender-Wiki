---
icon: material/monitor-dashboard
---

# Process Monitor

The **Process Monitor** shows what the addon's background processes are doing, live.

Open it when the viewport stutters, a switch feels slow, or a bug report asks for a log.

## :material-map-marker: Where to Find It

The panel is hidden by default. ++alt++-click the **gear** icon in the Navigation panel header to show it.

A plain click on the gear opens addon preferences instead. ++alt++-click it again to hide the panel.

Its header carries a four-button switcher for choosing which view you see.

??? info "The four views"
    | View | Icon | Shows |
    |------|------|-------|
    | **Process Monitor** | F-curve | The live process tree — this page. |
    | **Debug Console** | Console | Recent log lines, filtered by *Preferences > Developer > Topics*. |
    | **View Layer Switch Profiler** | Time | Per-step timing for the most recent View Layer switch. |
    | **Undo Monitor** | Recover | Every step the add-on takes around a Ctrl+Z, in order. See [Undo-Redo](../preferences/debug.md#undo-redo). |

    The gear shows the **Process Monitor** and **Debug Console** — they are the same
    panel in two modes. The **View Layer Switch Profiler** and the **Undo Monitor** are
    separate panels, reached from the switcher. The switcher is mirrored in their
    headers, so you can hop between all four once any one of them is open.

    **Which one you want.** Viewport stuttering during scrub: the Process Monitor.
    A slow View Layer switch: the Profiler. A log for a bug report: turn on
    *Preferences > Developer > Enable Debug Logging*, reproduce the problem, then copy lines
    from the Debug Console.

## :material-file-tree: Process Tree Hierarchy

Processes sit in twelve feature groups. Each group has a master toggle and a chevron to expand it.

The status dot tells you the state: green alive, amber slow, red overheating, grey dead, blue idle. A switched-off process is dimmed.

Click a row to switch that one process off. Disabled rows stop firing until you switch them back on.

??? info "What each group tracks"
    | Group | Tracks |
    |-------|--------|
    | **Core** | View Layer switch, load, undo and redo handlers, cache checks, viewport tool sync. |
    | **UI Sync** | Tree drawing, list syncing, panel redraws. |
    | **Rest State** | View Layer switch hook, autokey mirror, action restore, rest cache. |
    | **Still Mode** | The Still frame lock. |
    | **Cameras** | Camera playhead follow and reset. |
    | **Diff State** | Geometry watch, frame watch, load reset. |
    | **Variant Switch** | Variant defaults, View Layer switch hook. |
    | **Value Lock** | The Value Lock process. |
    | **Batch Render** | Foreground and background render monitoring. |
    | **Render Presets** | Nothing yet: no process runs in this group. |
    | **Sequencer** | Sequencer frame follow. |
    | **Parent Borrow** | Forgetting borrowed parent state on file load. |

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

**{{ op('tks.clear_monitor_filters').bl_label }}** switches a monitor's bucket filter and search off. The sidebar next to the list has a trash button, **{{ op('tks.clear_pycache').bl_label }}**, that deletes the add-on's cached bytecode folders.

??? tip "Bisecting viewport lag"
    Switch groups off one at a time, scrub the timeline after each, and watch the
    heartbeat and exec-time columns. When the stutter disappears, the group you just
    switched off is the culprit. Then click single rows to find the exact process.

## :material-cog: Process Monitor Settings { #process-monitor-settings }

Click the small arrow button in the sidebar next to the list. A popup opens with the display options.

**Show Columns** has four checkboxes: **Category**, **Kind**, **Heartbeat** and **Exec Time**. Tick one to show that column.

Select a timer row and the popup adds its name and an **Interval (s)** field. It sets how often the process should tick, from 0 to 60 seconds. The Heartbeat column judges the row's last beat against it. Select a group row and the popup shows the group's name and process count.

## :material-restart: Restart Processes

If a row that should be ticking shows no heartbeat, click **Restart Processes**.

It brings every dead process back in one pass and tells you how many it revived. While some are dead, a red **Restart N Dead** button also appears under the list.

++alt++-click the same button to toggle the **Auto-Restart Watchdog**. While it is on, dead processes come back on their own and a plain click does nothing. Click again for manual restarts.

## :material-restore: Undo Monitor

The **Undo Monitor** writes down everything the add-on does around one Ctrl+Z, in order, so you can read a press instead of guessing at it.

Open it with the last button of the monitor switcher, press **{{ op('tks.undo_monitor_record').bl_label }}**, then do the undo you want to look at. The header counts the steps on the tape.

??? info "The step kinds"
    Each row has an icon for its kind. Click the icon, or a button in the bar above the list, to show only that kind. Click it again to show everything.

    | Kind | What the row says |
    |------|-------------------|
    | **Press** | Your keypress reached the add-on. |
    | **Step** | An undo or redo really went out. |
    | **Handler** | A Blender event fired. |
    | **Write** | The add-on changed data. |
    | **Seal** | The add-on closed, or refused to close, an undo step. A refused one is drawn in red. |
    | **Orphan** | A change that never made it into an undo step, so no Ctrl+Z can take it back. Drawn in red. |
    | **State** | A snapshot of what you can see. |

    Writes that still wait for their step are counted in a note beside the bar. The **Detail** column holds the reason behind a step: hover its info icon.

??? info "Buttons beside the list"
    | Button | What it does |
    |--------|--------------|
    | **Undo Monitor Settings** | Sets how many steps to show (25, 50, 75, 100 or all) and whether the Timestamp and Detail columns appear. |
    | **{{ op('tks.undo_monitor_record').bl_label }}** | Starts or stops recording. ++alt++ + click forgets the steps held in memory; the tape file keeps them. |
    | **{{ op('tks.undo_monitor_copy').bl_label }}** | Copies the steps of the open tape to the clipboard, ready for a bug report. |
    | **{{ op('tks.um_log_files').bl_label }}** | Picks the tape file and the session. ++shift++ + click opens the folder. |

    Every step goes into a tape file on disk, so a recording survives a restart. A new recording is added below the last one.
