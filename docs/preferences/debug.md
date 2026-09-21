---
icon: material/bug
---

# Developer Tab

*Logging, per-topic filters, and developer utilities.*

<!-- Alias anchor. Ten Developer-tab controls in the add-on wire their
     right-click Online Manual at `preferences/debug/#settings`, but this
     section is called Logging, which is the better name and stays. The
     alias makes those ten links land here instead of the page top. Remove
     it once wire_assignments.json points at #logging. -->
<a id="settings"></a>

## :material-tune: Logging

Everything here starts off. Turn on **Enable Debug Logging** first — the groups below appear only then.

| Setting | What it does |
|---------|--------------|
| **Enable Debug Logging** | The master switch. |
| *File* → **Log Folder**, **Log File Name** | Where the log goes. Leave both empty and the panel prints the default path. |
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
    | **STORE** (Take Data & Snapshots) | Snapshot, Pointer Healing, Bookmarks |
    | **UI** (Interface) | Tree Drawing, Tree Syncing, Panel Drawing, Popovers Logic, Inspector, Hotkeys / Keymaps, Watchlist |
    | **OPS** (Operator Trace) | Operator Runs, Groups |
    | **SYSTEM** (Lifecycle & Background) | Init / Reloads, Add-on Preferences, Undo Handlers, Process Monitor, AI Facade, Event Bus, Providers, Cache Registry, Viewport Sync |

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
| **{{ op('tks.dm_copy').bl_label }}** | Copies the shown log lines to the clipboard, including the ones the panel is too short to show. |

## :material-undo-variant: Undo-Redo

This sub-tab lists the strategies that keep take switching, the cascade and Rest State consistent across undo and redo.

Each has its own toggle. Leave them on unless you are debugging the recovery system itself.

??? warning "What they do, and why four are locked"
    One example: they suppress phantom *Takes Auto-Merge* steps, so one gesture
    costs one undo.

    The four **Required** core strategies sit behind an unlock toggle, the same
    pattern as *Workflow → Naming → Templates*. Switching them off causes known
    bugs: phantom auto-merge steps on every undo, the cascade clearing actions
    mid-undo, or rest-state snaps overwriting the transforms Blender just restored.

Each strategy row carries an **[i]** icon. Hover it and the tooltip, **{{ op('tks.pref_help').bl_label }}**, shows that setting's own description.

??? info "Undo Monitor"
    The Undo Monitor lists one ++ctrl+z++ press as a tape of steps, so a press can
    be read instead of guessed at. Turn it on under **Show Undo Monitor** in the
    navigation panel's monitor switches.

    | Button | What it does |
    |---|---|
    | **{{ op('tks.undo_monitor_record').bl_label }}** | Starts recording. Every step goes to a tape file on disk, so a recording survives a restart. |
    | **{{ op('tks.undo_monitor_copy').bl_label }}** | Copies the whole tape to the clipboard, including the steps the panel is too short to show. |
    | **{{ op('tks.um_log_files').bl_label }}** | Picks which tape file to show. |

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

## :material-format-list-checks: Every Developer Switch

Everything on the Developer tab, in one place. These are diagnostic switches: leave them alone unless you are chasing a problem.

??? info "Every developer switch"
    | Setting | What it does |
    | --- | --- |
    | **ANIM (Actions & Slots)** | Actions and slots: what gets assigned, and to whom |
    | **Cascade-Token Boundary Refire** | Re-fire the unified View Layer switch snap path when undo/redo crosses a forward cascade boundary (tracked via `scene[{scenegroup}]`). Disabling this leaves the state after an undo that crosses view layers at stale rest-cache values |
    | **Data-block Renames** | Only the renames: which data-block was renamed, and to what |
    | **Mutation Queue Recovery Windows** | Gate `bpy.ops.ed.undo_push('Takes Auto-Merge')` from the mutation queue during post-undo, View Layer switch, and autokey settling periods. Disabling this re-introduces phantom 'Takes Auto-Merge' undo steps — every Ctrl+Z forces 5–8 extra presses to walk past the cascade chain reactions |
    | **NAMING (Names & Tokens)** | Smart names and the tokens they resolve from |
    | **One Keyframe, One Ctrl+Z** | Run the take's share of a keyframe inside your own G and I, so one keyframe costs one Ctrl+Z. Off: the add-on does its part a moment later in a step of its own, and a keyframe can cost two presses. Switch off if another add-on needs G or I for itself |
    | **OPS (Operator Trace)** | A trace line for each operator as it runs |
    | **PRESET (Render Presets)** | Render presets: which tier answered, and what it wrote |
    | **REST (Rest & Still)** | Rest State and Still Mode |
    | **Rest-State Snap Suppression** | Block rest-state snap-back during the 1 s post-undo grace window. Disabling this lets the snap path overwrite Blender's restored unkeyed transforms during the cascade settling period |
    | **Skip ACTION in Post-Undo Cascade** | Pass `skip_action=True` to `apply_overrides` in the post-undo deferred cascade. Disabling this lets the cascade read the empty cascade tier at Blender's intermediate snapshot and clear the action that was just restored — the watched object loses its action on every Ctrl+Z |
    | **Skip Compositor Clear After Undo** | Pass `skip_compositor_clear=True` to `apply_overrides` in the post-undo deferred cascade. Without it, undoing back to a state where no compositor is assigned in the cascade tree wipes the scene's node group — even if the user had assigned it outside the tree. Independent of `compositor_unassigned_mode`, which governs normal (non-undo) cascade runs |
    | **STORE (Take Data & Snapshots)** | Take data, snapshots and bookmarks |
    | **SWITCH (Take & Cascade)** | Take switching and the cascade that follows it |
    | **SYSTEM (Lifecycle & Background)** | Startup, preferences, undo handlers and background work |
    | **TAGS (Tag Library)** | The tag library: grouping and moves |
    | **Unlock Advanced Undo Overrides** | Unlock the four required core strategies for editing. Disabling any of them causes known bugs (phantom undo steps, cascade tier loss, snap overwriting undo). Use only for diagnosing conflicts with other add-ons or recovering from an undo-related crash |
    | **VARIANT (Variant Switch)** | Variant switching and material swaps |
