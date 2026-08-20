---
icon: material/bug
---

# Developer Tab

*Logging, per-topic filters, and developer utilities.*

## :material-tune: Logging

Everything here starts off. Turn on **Enable Debug Logging** first — the groups below appear only then.

| Setting | What it does |
|---------|--------------|
| **Enable Debug Logging** | The master switch. |
| *File* → **Folder**, **Filename** | Where the log goes. Leave both empty and the panel prints the default path. |
| *Console* → **Print to Console** | Echo the same lines into Blender's System Console. |
| *Console* → **Levels** | Which severities reach the log: **Debug**, **Info**, **Warning**, **Error**. |
| *Tools* → **Export Debug Log**, **Email Dev Support** | Save a copy to send on, or open a support mail. |

## :material-format-list-checkbox: Topics

A **topic** is one debugging session, named after the symptom you would report — take switching, batch render, variant switch. A **subtopic** is one stage inside it.

Turn on only the topics you are chasing. Logging everything buries the lines that matter.

Expand a topic's chevron to reach its subtopics. **All Topics** and **All Subtopics** at the top flip the whole list at once.

??? info "All twelve topics, and the modifier clicks"
    | Topic | Subtopics |
    |-------|-----------|
    | **SWITCH** (Take & Cascade) | Take Switch, Cascade Overrides, Group Processing, List Sync, Preload |
    | **ANIM** (Actions & Slots) | Slot Processing, Action Assignment |
    | **REST** (Rest & Still) | Rest State, Still / Animation Mode |
    | **VARIANT** (Variant Switch) | Variant Switch |
    | **RENDER** (Batch Render) | Background Process, Path Logic, Write Logic, Progress & ETA, Render Versions |
    | **PRESET** (Render Presets) | Cascade, Cascade Sync, Clear Rule, Resolve, Rule Changed, Rule Switch, Tier Write, Color Management, Preset Engine |
    | **NAMING** (Names & Tokens) | Smart Renaming, Datablock Renames, Token Engine |
    | **TAGS** (Tag Library) | Move Operations, Group Processing, Tag Integration |
    | **STORE** (Take Data & Safety Copy) | Safety Copy, Pointer Healing, Bookmarks |
    | **UI** (Interface) | Tree Drawing, Tree Syncing, Panel Drawing, Popovers Logic, Inspector, Hotkeys / Keymaps, Watchlist |
    | **OPS** (Operator Trace) | Operator Runs, Groups |
    | **SYSTEM** (Lifecycle & Background) | Init / Reloads, Addon Prefs, Undo Handlers, Process Monitor, AI Facade, Event Bus, Providers, Cache Registry, Viewport Sync |

    | Shortcut | Action |
    |----------|--------|
    | ++shift++ + click a topic checkbox | Turn on every subtopic in that topic. |
    | ++alt++ + click a topic checkbox | Invert that topic's subtopics. |
    | ++shift++ + click a chevron | Expand or collapse every topic. |

## :material-text-box-search: Debug-Log Monitor

With logging on, a live monitor appears in the navigation panel. It reads the log into a scrollable list, so you can watch events without leaving Blender.

| Button | What it does |
| -------- | -------------- |
| **Refresh Log** | Reloads the latest entries, up to the *Show Lines* limit. ++alt++ + click starts auto-refresh, which re-reads on a timer. With logging off it only reports *"Enable debug logging first"*. |
| **Log Files** | Picks which log file to show. ++shift++ + click opens the log folder in your file browser instead. |

## :material-undo-variant: Undo-Redo

This sub-tab lists the strategies that keep take switching, the cascade and Rest State consistent across ++ctrl+z++.

Each has its own toggle. Leave them on unless you are debugging the recovery system itself.

??? warning "What they do, and why four are locked"
    One example: they suppress phantom *Takes Auto-Merge* steps, so one gesture
    costs one undo.

    The four **Required** core strategies sit behind an unlock toggle, the same
    pattern as *Workflow → Naming → Templates*. Switching them off causes known
    bugs: phantom auto-merge steps on every undo, the cascade clearing actions
    mid-undo, or rest-state snaps overwriting the transforms Blender just restored.

## :material-toy-brick: Utilities

Developer helpers on their own sub-tab — right now, the Icon Sheet.

### :material-emoticon-outline: Icon Sheet

**Open Icon Sheet** shows every built-in Blender icon. Browse by category, or type in the **search** field and matches highlight in place. Click an icon to copy its name. A **Recent** tab keeps your last picks.

??? tip "Binding a shortcut, and the second way in"
    The Icon Sheet ships with **no hotkey assigned**, so it can never collide with
    your keymap out of the box. Bind your own with the rebind widget next to the
    button on this sub-tab.

    The same sheet backs the custom-token **category icon picker**. Opened that
    way it starts on the tab of the icon the category already uses, and its
    *Current* row gets a copy button.
