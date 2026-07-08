---
icon: material/bug
---

# Debug Tab

*Logging master switch, log file location, per-topic filters.*

## :material-tune: Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Enable Debug Logging** | bool | Off | Master switch for log file output. |
| **Log Directory** | path | *(empty)* | Override the default log location. |
| **Log Filename** | string | `takes_for_blender.log` | Filename (no path). |
| **Print to Console** | bool | On | Echo log lines to Blender's System Console. |
| **Levels: Debug / Info / Warning / Error** | bool | All On | Per-level inclusion in the log file. |

## :material-format-list-checkbox: Topics

Nine collapsible topic groups, each with a master toggle and per-subtopic toggles. All default to **on**:

| Topic | Subtopics |
|-------|-----------|
| **CORE** | Init/Reloads, File Handlers, Addon Prefs, View Layer Switch, Cascade Overrides, Inspector, Lock System, Process Monitor, Rest State, Slot Processing, List Sync, Undo Handlers, Watchlist, Group Processing |
| **UI** | Tree Drawing, Tree Syncing, Context State, Panel Drawing, Popovers Logic, Inspector Logic |
| **DATA** | Schema Migration, Pointer Healing, Undo Protection, Property Scanning |
| **OPS** | General Buttons, Creation Tools, Smart Renaming, Animation/Slots, Groups |
| **FEATURES** | Variant Switch, Rest State, Tag Integration, Scene Groups, Naming Engine, Preset Engine |
| **RENDER** | Batch Execution, Smart Tokens, Render Presets, State Callbacks |
| **BATCH** | Background Process, Path Logic, Write Logic |
| **PRESET** | Cascade, Cascade Sync, Clear Rule, Resolve, Rule Changed, Rule Switch, Tier Write |
| **TAGS** | Group Processing, Move Operations, Tree Sync |

## :material-text-box-search: Debug-Log Monitor

Once **Enable Debug Logging** is on, a live log monitor is available in the add-on's navigation panel. It reads the log file back into a scrollable list so you can watch events without leaving Blender or opening the file by hand. Two toolbar buttons drive it:

| Button | Operator | What it does |
|--------|----------|--------------|
| **Refresh Log** | `tks.dm_refresh` | Re-reads the current log file and reloads the latest entries (capped by the *Show Lines* limit). ++alt++ + click toggles **auto-refresh**, which polls the file on the configured interval. A plain click does nothing while auto-refresh is already on. |
| **Log Files** | `tks.dm_log_files` | Opens a dropdown to pick which log file the monitor displays. ++shift++ + click instead opens the log folder in your system file browser. |

!!! note "Logging must be enabled first"
    **Refresh Log** reports *"Enable debug logging first"* and turns auto-refresh
    off if the master switch is disabled — there is nothing to read until logging
    is on.

## :material-undo-variant: Undo-Redo

The **Undo-Redo** sub-tab lists the add-on's undo/redo recovery strategies,
each individually toggleable. These strategies are what keep take switching,
the cascade, and Rest State consistent across ++ctrl+z++ — for example
suppressing phantom *Takes Auto-Merge* steps so one gesture costs one undo.

The four **Required** core strategies sit behind an unlock toggle (the same
pattern as *Workflow → Naming → Templates*): disabling them causes known bugs
— phantom auto-merge steps on every undo, the cascade clearing actions
mid-undo, or rest-state snaps overwriting Blender's restored transforms — so
they can't be switched off by accident. Leave everything on unless you are
debugging the recovery system itself.

## :material-keyboard: Hotkeys

Modifier-clicks on group toggles:

| Shortcut | Action |
|----------|--------|
| ++shift++ + click | Enable all subtopics in the group. |
| ++alt++ + click | Invert subtopic selection. |

Debug-log monitor buttons:

| Shortcut | Action |
|----------|--------|
| ++alt++ + click on **Refresh Log** | Toggle auto-refresh on/off. |
| ++shift++ + click on **Log Files** | Open the log folder in the system file browser. |
