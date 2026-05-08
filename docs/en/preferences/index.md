---
icon: material/cog
---

# Preferences

**Location:** *Edit > Preferences > Add-ons > Takes for Blender*.

The preferences are organised into four top-level tabs — **Workflow**, **UI**, **Data**, **Debug** — each with sub-tabs. Most settings auto-save via the *Autosave Preferences* mechanism (see [Save Mode](#addon)).

---

## Workflow Tab

### Render

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Apply to F12 / Native Renders** | bool | Off | Intercepts Blender's native F12 / `bpy.ops.render.render()` and applies Smart Output tokens to the path. |
| **Enable Render Sounds** | bool | On | Plays a notification sound when a batch render completes. |
| **Sound Folder** | path | *(empty)* | Custom directory of `.wav` files. Empty falls back to the bundled defaults. |
| **Success Sound** | enum | *(scanned)* | File played on successful render. |
| **Failed Sound** | enum | *(scanned)* | File played on render failure / cancellation. |

### Automations

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Auto-create Reference Action** | bool | On | Creates the *Reference State* action when a new scene is created. |
| **Auto-mirror Keyframes to Reference** | bool | On | Mirrors unkeyed values into the Reference Action on keyframe insert. |
| **Auto-assign VL Actions** | bool | On | Creates and assigns View Layer actions automatically when a VL is added. |
| **Auto-rename Actions on Hierarchy Change** | bool | Off | Regenerates action names from the naming templates when scenes / VLs are renamed. |
| **Auto-rename Slots on Target Rename** | bool | On | Keeps slot names in sync with their target object/data. |
| **Auto-rename Thumbnails on Name Change** | bool | On | Renames preview PNGs alongside their source. |
| **Auto Fake User on Actions** | bool | On | Sets Fake User on actions to protect them from auto-purge. |
| **Auto-snap on Keyframe Clear** | bool | On | Snaps the VL action selection to the nearest keyframe when one is cleared. |
| **Preset Changes** | enum | MANUAL | Policy when render/output/camera presets are edited live: **MANUAL** (warn), **DROP_REAPPLY** (discard), **ALWAYS_SYNC** (write back to preset). |

### Naming

The naming sub-tab holds editable templates for every named entity the addon creates — actions, slots, takes, variants, presets. Templates use [Smart Output tokens](../features/smart_output.md).

#### Separator

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Separator** | string (≤3 chars) | `_` | The character(s) emitted by `{sep}` everywhere. |
| **Unlock Naming Templates** | bool | Off | Safety latch — must be on before any template is editable. Changing templates can break existing slot links. |
| **Token Filter** | enum | ALL | Limits which tokens the picker shows: ALL / SCENE_ACTION / VL_ACTION / SLOT / TAKE / VARIANT. |

#### Action Templates

| Slot | Default Template |
|------|------------------|
| Scene | `{scenegroup}{sep}{scene}` |
| View Layer | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}` |
| VL Version | `{scenegroup}{sep}{scene}{sep}{vlgroup}{sep}{viewlayer}{sep}{version}` |
| Scene Group | `{scenegroup}` |
| VL Group | `{scenegroup}{sep}{scene}{sep}{vlgroup}` |

#### Camera & Compositor Templates

| Slot | Default Template |
|------|------------------|
| Scene Camera | `{scene}{sep}Cam` |
| Scene Compositor | `{scene}{sep}Comp` |
| VL Camera | `{scene}{sep}{viewlayer}{sep}Cam` |
| VL Compositor | `{scene}{sep}{viewlayer}{sep}Comp` |
| Global Action | `Global{sep}Action` |
| Global Camera | `Global{sep}Cam` |
| Global Compositor | `Global{sep}Comp` |

#### Slot Type Templates

| Type | Default Template |
|------|------------------|
| Reference Action | `Reference{sep}State` |
| Scene / World / Object | `{scene}` / `{world}` / `{object}{sep}{type}` |
| Mesh / Armature / Light / Camera | `{object}{sep}Mesh` / `Rig` / `Light` / `Cam` |
| Curve / Lattice / Metaball / Font | `{object}{sep}Curve` / `Lattice` / `Meta` / `Text` |
| Grease Pencil / Speaker / Empty / Particles | `{object}{sep}GP` / `Audio` / `{object}` / `{object}{sep}Particles` |
| Shape Key | `{object}{sep}Keys` |
| Material / Node Tree | `{material}` / `{parent}{sep}Nodes` |
| Generic fallback | `{object}` |

#### Take / Variant / Preset Templates

| Slot | Default Template |
|------|------------------|
| Take Name | `Take_{index:03d}` |
| Variant Group | `{collection}_Variants` |
| Variant Name | `{material}` |
| Render / Output / File Output Preset | `{scene}{sep}Render` / `Output` / `FileOutput` |
| View Layer / Color Mgmt Preset | `{scene}{sep}ViewLayer` / `Color` |
| Camera / World / Material Preset | `{camera}` / `{world}` / `{material}` |

### Pie Menu

Eight enum dropdowns — one per pie direction — each accepting: *None*, *Tree View*, *Watchlist*, *Slotted Mode*, *Rules*, *Variants*, *Tags*, *Batch Render*, *Channels*. Defaults documented on the [Pie Menus](../features/pie_menus.md) page. Reassigning a slot auto-deduplicates the previous holder.

### Hotkeys

A read-only summary of the addon's registered keymaps. To edit a binding, use *Edit > Preferences > Keymap* and search for the operator id (`tks.global_*` or `wm.call_menu_pie`). The full inventory is on the [Keyboard Shortcuts](../interface/hotkeys.md) page.

---

## UI Tab

### Confirmations

Every confirmation dialog can be disabled. All default to **on**. Categorised:

| Category | Settings |
|----------|----------|
| Tree | Delete Selected Item, Delete Scene, Delete View Layer, Delete Scene Group, Delete VL Group, Delete Version. |
| Inspector | Rename Action, Remove from Watchlist, Delete Action, Delete Slot, Delete Keyframe. |
| Globals | Delete Tag, Delete Tag/Variant Group, Delete Variant, Delete Bookmark. |
| Batch Render | Start Batch Render, Overwrite Existing Files. |
| System | Orphan Cleanup, Override Persistence, Shortcut Override. |
| Data Integrity | Reference State Protection, Locked Take Protection, Pinned Object Protection, Shared Resource Safety. |

### Lists

Master and per-list row-height overrides. Range 5–30. The **Default List Rows** master propagates to every list that hasn't been overridden:

Objects, Actions, Slots, Scenes, View Layers, Takes Tree, Scene Groups, VL Groups, VL Versions, Tags, VSW Products, Process Monitor, Debug Log, Profiler, Batch Queue, Preferences Setup.

### Columns

Toggle column visibility:

| Column | List |
|--------|------|
| Action / Slot | Objects |
| Slot Count / Key Count / Fake User | Actions |
| User Count / Key Count / Action | Slots |

All default to **on**.

### Tree

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Default Tree Icons** (9) | bool | On | Per-icon visibility — Reference State, Tag, Render, Variant, Action, Compositor, World, Camera, Automation Rule. |
| **Default Tree Pin Icons** (8) | bool | Off | Per-icon pin-toggle visibility for the same set. |
| **Collapse Mode** | enum | DYNAMIC | When the cascade-icon overflow `⋯` appears: DYNAMIC (auto by panel width) or ALWAYS. |
| **Collapse Width** | int | 600 | Pixel threshold for DYNAMIC collapse. Range 200–800. |
| **Show Tag Color** | bool | On | Tints tree connection lines by tag colour. |
| **Tree Line Width** | enum | MEDIUM | THIN / MEDIUM / WIDE. |
| **Tree Line Color** | colour | grey | RGBA colour for connection lines. |
| **Active VL Color** | colour | gold | RGBA colour for the active View Layer highlight. |

---

## Data Tab

### Storage

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Local Presets Folder** | path | *(empty)* | Personal preset directory. |
| **Shared Presets Folder** | path | *(empty)* | Team preset directory. |
| **Lock Shared Folder** | bool | On | Prevents the addon from writing into the Shared folder. |

### Presets

A master *Master Default* enum sets the default storage tier for **new** presets, and per-type overrides exist for each of the 9 categories:

| Tier | Where it writes |
|------|-----------------|
| **ADDON** | Bundled folder. |
| **PROJECT** | Next to the `.blend`. |
| **SHARED** | Shared folder. |
| **LOCAL** | Local folder. |

Per-type overrides: Render, Output, File Output, View Layer, Color Management, Camera, World, Material, Bookmark.

### Addon

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Save Mode** | enum | ADDON | Where the preferences JSON is written: ADDON / PROJECT / SHARED / LOCAL. |
| **Config File (Shared / Local / Project)** | enum | `user_preferences.json` | Which config file to load from each storage tier. |
| **Autosave Preferences** | bool | On | Persist any change immediately. |
| **Auto-Restart Dead Processes** | bool | On | Restart background render processes if they crash. |
| **Auto-migrate on File Load** | bool | On | Run schema migration when opening a file from an older version. |

---

## Debug Tab

### Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Enable Debug Logging** | bool | Off | Master switch for log file output. |
| **Log Directory** | path | *(empty)* | Override the default log location. |
| **Log Filename** | string | `takes_for_blender.log` | Filename (no path). |
| **Print to Console** | bool | On | Echo log lines to Blender's System Console. |
| **Levels: Debug / Info / Warning / Error** | bool | All On | Per-level inclusion in the log file. |

### Topics

Nine collapsible topic groups, each with a master toggle and per-subtopic toggles. All default to **on**:

| Topic | Subtopics |
|-------|-----------|
| **CORE** | Init/Reloads, File Handlers, Addon Prefs, VL Switch, Cascade Overrides, Inspector, Lock System, Process Monitor, Reference State, Slot Processing, List Sync, Undo Handlers, Watchlist, Group Processing |
| **UI** | Tree Drawing, Tree Syncing, Context State, Panel Drawing, Popovers Logic, Inspector Logic |
| **DATA** | Schema Migration, Pointer Healing, Undo Protection, Property Scanning |
| **OPS** | General Buttons, Creation Tools, Smart Renaming, Animation/Slots, Groups |
| **FEATURES** | Variant Switch, Reference State, Tag Integration, Scene Groups, Naming Engine, Preset Engine |
| **RENDER** | Batch Execution, Smart Tokens, Render Presets, State Callbacks |
| **BATCH** | Background Process, Path Logic, Write Logic |
| **PRESET** | Cascade, Cascade Sync, Clear Rule, Resolve, Rule Changed, Rule Switch, Tier Write |
| **TAGS** | Group Processing, Move Operations, Tree Sync |

Modifier-clicks on group toggles:

| Shortcut | Action |
|----------|--------|
| ++shift++ + click | Enable all subtopics in the group. |
| ++alt++ + click | Invert subtopic selection. |

---

## Hidden / Advanced

A handful of preferences only surface as side-effects:

| Setting | Where | Purpose |
|---------|-------|---------|
| **Smart Output Default Directory** | Used when a fresh render preset is created. | Default starting path (`//`). |
| **Smart Output Default Filename** | Same. | Default filename pattern (`[view_layer]_####.[file_format]`). |
| **Smart Output Bracket Style** | Same. | Default delimiter style for new presets (SQUARE / CURLY / ANGLE / PARENS / PERCENT / DOLLAR / HASH). |
| Override flags (~25) | Internal state | Track which list-row-heights / preset-storage-tiers are user-overridden vs. master-synced. Auto-managed. |
| Expansion flags (~50) | Internal state | Remember which collapsibles were left open. |

---

## Resetting Preferences

The fastest way back to defaults: in *Preferences > Data > Addon*, switch *Save Mode* to **ADDON** then re-enable the addon. Your custom config files in PROJECT / SHARED / LOCAL remain untouched.

!!! note "Where preferences live on disk"
    Preferences are stored as JSON in the directory chosen by *Save Mode*.
    By default that's the addon's own folder. The active save mode is shown
    at the top of the *Data > Addon* sub-tab.
