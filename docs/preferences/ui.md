---
icon: material/view-dashboard
---

# Interface Tab

*Confirmation dialogs, list row heights, column visibility, tree appearance.*

## :material-comment-question: Confirmations

Every confirmation dialog can be switched off here. All default to **on**.

??? info "Every confirmation, by group"
    | Group | Settings |
    |----------|----------|
    | Context | Delete Tree Item, Delete Scene, Delete View Layer, Delete Scene Group, Delete View Layer Group, Delete Take. |
    | Inspector | Rename Action, Remove from Watchlist, Delete Action, Delete Slot, Clean Empty Slots/Actions, Delete Keyframe. |
    | Globals | Delete Tag, Delete Tag/Variant Group, Delete Variant, Delete Bookmark, Delete Custom Token. |
    | Batch Render | Start Batch Render, Overwrite Existing Files. |
    | System | Orphan Cleanup, Override Persistence, Shortcut Override. |
    | Data Integrity | Rest State Protection, Locked Take Protection, Pinned Object Protection, Shared Resource Safety. |

    *Context* through *Batch Render* confirm the delete or start they are named
    after. The last two groups are less obvious:

    | Confirmation | What it guards |
    |--------------|----------------|
    | **Orphan Cleanup** | Cleaning up unused add-on data. |
    | **Override Persistence** | Property-persistence rules. It also gates deleting a preference config and resetting preferences to defaults. |
    | **Shortcut Override** | Resetting the add-on's global hotkeys back to their defaults. |
    | **Rest State Protection** | Edits to properties guarded by the Rest State (frame 0). |
    | **Locked Take Protection** | Changes to View Layers you have explicitly locked. |
    | **Pinned Object Protection** | Changes to objects pinned to a specific Rest State. |
    | **Shared Resource Safety** | Edits to shared render presets and other library resources. |

### :material-information-outline: Info Boxes

Two switches for the explanatory boxes drawn throughout the add-on.

| Setting | Default | Description |
|---------|---------|-------------|
| **Show Tip Boxes** | On | The tip boxes that explain a workflow where you meet it. |
| **Show Warning Details** | On | The explanation paragraphs inside warning panels. |

Every box also carries a **✕** that hides its whole category everywhere at once. These two switches bring the boxes back.

??? note "What stays after you turn them off"
    Warnings still appear whenever there is an actual problem. A warning keeps its
    headline and its fix buttons — only the explanation paragraph goes.

    The **✕** asks for a quick confirmation first.

## :material-format-list-bulleted-square: Lists

Row heights for the add-on's lists, from 5 to 30 rows.

**Default List Rows** is the master. It applies to every list you have not given its own height.

??? info "Lists you can override one by one"
    Objects, Actions, Slots, Scenes, View Layers, Takes Tree, Scene Groups,
    View Layer Groups, Takes, Tags, VSW Products, Process Monitor, Debug Log,
    Profiler, Batch Queue, Preferences Setup.

## :material-table-column: Columns

Extra columns on the Inspector lists. All default to **on**.

| List | Columns |
|--------|------|
| Objects | Action, Slot |
| Actions | Slot Count, Key Count, Fake User |
| Slots | User Count, Key Count, Action |

## :material-file-tree: Tree

How the Takes tree looks, and which icons its rows show.

| Setting | Default | Description |
|---------|---------|-------------|
| **Icons** | On | Per-icon visibility for the nine cascade icons. Each toggle carries the icon's own name — Tag, Variant, Action, Compositor and so on. |
| **Collapse Mode** | Dynamic | When the overflow `⋯` replaces the icons: Dynamic (by panel width), Always, or Never. |
| **Show Tag Color** | On | Tints the tree connection lines by tag colour. |

??? info "The rest of the tree settings"
    | Setting | Default | Description |
    |---------|---------|-------------|
    | **Pin Outside Collapse** | Off | Which icons stay visible when the overflow `⋯` takes over, for eight of the same icons. |
    | **Collapse Width** | 600 | Panel width in pixels at which Dynamic collapses. Range 200–800. |
    | **Tree Line Width** | Medium | Thin, Medium or Wide connection lines. |
    | **Tree Line Color** | grey | Colour of the connection lines. |
    | **Active View Layer Color** | gold | Highlight colour for the active View Layer. |

    The nine icons are Rest State, Tag, Render, Variant, Action, Compositor,
    World, Camera and Automation Rule.

## :material-monitor-dashboard: Viewport Overlay

A status banner drawn directly in the 3D viewport. One coloured pill per active mode, plus a progress row for each running background task.

It keeps a mode — or a busy pause — visible even when the Takes panel is closed.

The tab has three topics. **Banner** holds **Placement** and **Content**. **Diff State** holds its own marks and colours, described on the [Diff State](../features/diff_state.md) page. **Mode Row** stands alone at the bottom.

### :material-map-marker: Placement

Where the banner sits and how it reads. Inside **Banner**.

| Setting | Default | Description |
|---------|---------|-------------|
| **Anchor** | Off | Which corner or edge the banner sits in. **Off** disables the overlay. |
| **Offset X / Offset Y** | 0 | Pixel nudge from the anchor. |
| **Opacity** | 0.9 | Banner transparency. |
| **Scale** | 1.0 | Size of the banner text and pills. |

### :material-toggle-switch: Content { #modes }

What the banner shows. Inside **Banner**.

A mode toggle only *allows* its pill — the pill shows only while that mode is actually active.

| Setting | Default | Description |
|---------|---------|-------------|
| **Hide when Takes Panel Open** (Progress Bars) | On | Hides the progress rows while the Takes panel is visible. |
| **Show Mode Badges** | On | Master switch for the mode-badge row. |
| **Autokey / Value Lock / Rest Mode / Still Mode / Frame Sync / Scene Follow / Variant Live / Diff State** | On | Per-mode pill visibility, one switch each. |
| **Hide when Takes Panel Open** (Mode Badges) | On | Hides only the badge row while the panel is open. Progress rows stay. |

??? info "Which tasks get a progress row"
    Background tasks add a labelled progress bar under the pills. There is nothing to configure per task.

    The **View-Layer Preload** row shows the total run plus the layer currently
    building. The **Batch Render** row shows the queue.

    Percentages align in a right-hand column, and each row appears only while its
    task is running.

### :material-gesture-tap-button: Mode Row

The seven mode buttons at the top of the Takes panel: which ones you see, and what a plain click does.

| Setting | Default | Description |
|---------|---------|-------------|
| **Icons** | All on | One toggle per button, in the row's order. A hidden button stays in the [Mode Pie](../features/pie_menus.md#mode-pie). |
| **Still Mode** (click) | Last Used | What a plain click switches on: the kind it was in when you switched it off, or always **Still** or **Animation**. |
| **Timeline** (click) | Last Used | Same for the Timeline: last used, or always **Frame Sync** or **Scene Follow**. |
| **Diff State** (click) | Last Used | Same for Diff State: last used, or always **Take State**, **Drift State** or **All**. |

++shift++ + click on any of the three buttons picks the kind instead.

## :material-help-circle-outline: Tooltips

What a tooltip shows when you hover a button.

| Setting | What it does |
|---|---|
| **Show Explanation in Tooltips** | Off hides the long text and keeps the one-line purpose |
| **Show Shortcuts in Tooltips** | Off hides the key list under the text |
| **Value Style** | **Value First** puts what is set at the top, purpose underneath; **Plain** keeps the purpose first |

## :material-translate: Language

Which technical terms stay in English while the rest of the interface is translated. The interface language itself follows Blender's own setting.

| Control | What it does |
|---|---|
| **Keep Technical Terms in English** | The master switch for the whole list below |
| Term list | Tick a term to print it in English, untick to print the translation |
| **Add Term** | Adds a word of your own: the translated spelling and the English word to print instead |
| **Remove Term** | Removes one of your own terms |
| **Reset Terms** | Puts every shipped term back to its default for the current language |

??? info "What the list can and cannot do"
    A shipped term follows grammar (cases and compounds). A term you add is a
    plain text swap, so pick one that reads right wherever it appears.

## :material-format-list-checks: Every Interface Setting

Everything on the Interface tab, in one place.

??? info "Every interface setting"
    | Setting | What it does |
    | --- | --- |
    | **Batch Operations** | Confirm before starting a Batch Render. Found in: Batch Render tab |
    | **Default Folder** | Default folder pattern for Smart Output reset button |
    | **Delete Group** | Confirm before deleting a Group from the Split View lists. Found in: Context tab (Tree) |
    | **Diff State Click** | Which kind a plain click on the Diff State button switches on |
    | **F12 / Ctrl+F12 (Native)** | Play sound after Blender's built-in F12 / Ctrl+F12 render finishes (any render not started by Takes operators) |
    | **Frame Budget** | How much time Auto may spend rebuilding outlines in a single frame. One frame at 60 frames per second is about 17 milliseconds, so half of that leaves the other half for Blender's own drawing |
    | **Mark Shared Actions** | Mark the View Layers that share the active View Layer's action |
    | **Marker Moved to a Free Frame** | Confirm when a new camera marker has to land on a later frame because the one asked for is taken. Found in: Camera popover, Multi-Cam |
    | **Pin Automation Rule** | Start new files with the Automation Rule column pinned open |
    | **Pin Camera** | Start new files with the Camera column pinned open |
    | **Pin Compositor** | Start new files with the Compositor column pinned open |
    | **Pin Render** | Start new files with the Render column pinned open |
    | **Pin Still** | Start new files with the Still column pinned open |
    | **Pin Tag** | Start new files with the Tag column pinned open |
    | **Pin World** | Start new files with the World column pinned open |
    | **Shape Refresh** | How eagerly a marked outline follows a shape that is being deformed, by a shape key or anything else. Auto measures what each object costs and lets the cheap ones keep up while the heavy ones wait for playback to stop |
    | **Shared Action Color** | Color of the bar marking View Layers that share the active action |
    | **Show In Mode Row** | Show the Diff State switch in the Takes mode row |
    | **Show In Overlays Menu** | Show the Diff State switch in Blender's own Overlays menu |
    | **Show Tree Lines** | Draw the tree indent lines by default (tag colors have their own switch) |
    | **Still Mode Click** | Which kind a plain click on the Still Mode button switches on |
    | **Swap Materials List** | How many rows the Swap List shows for materials |
    | **Tag** | Show the Tag column in the tree. On in new files |
    | **Timeline Click** | Which kind a plain click on the Timeline button switches on |
    | **Tree Icon Pie Menu** | Enable the Ctrl+Shift+F pie menu for opening a cascade property on the highlighted tree row. Each slice opens that property's full editor, rules and presets included, without hunting for its icon. A property the row cannot hold is left out of the pie. Off by default |
