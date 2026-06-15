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

## :material-keyboard: Hotkeys

Modifier-clicks on group toggles:

| Shortcut | Action |
|----------|--------|
| ++shift++ + click | Enable all subtopics in the group. |
| ++alt++ + click | Invert subtopic selection. |
