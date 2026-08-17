---
icon: material/database
---

# Data Tab

*Preset storage tiers, shared / project / local folder paths, and where the addon's own preferences JSON lives.*

## :material-folder-multiple: Storage

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Local Presets Folder** | path | *(empty)* | Personal preset directory. |
| **Shared Presets Folder** | path | *(empty)* | Team preset directory. |
| **Lock Shared Folder** | bool | On | Prevents the addon from writing into the Shared folder. |

## :material-backup-restore: Snapshots & Recovery {: #snapshots }

Takes stores your takes, groups, tags, rules and variants on a **World datablock** inside the `.blend`. That makes them travel with the file — but it also means that if the World carrying them is ever deleted, purged as unused, or removed by a script, the whole organisation goes with it and the tree rebuilds itself flat.

So Takes keeps a **safety copy** on disk, refreshed as you work, and puts it back automatically if it notices the storage has gone. Recovery normally needs no action at all: it happens and then tells you what it did.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Confirm Restore** | bool | Off | Ask before restoring. Off by default — recovery runs on its own and only reports afterwards. Turn it on if you would rather approve each restore. |
| **Snapshots** | path *(read-only)* | — | Where the copies live. The folder button beside it runs **{{ op('tks.open_snapshots_folder').bl_label }}** (`tks.open_snapshots_folder`) and opens that directory in your file browser. |

### When a restore is offered

If the storage is lost and Takes cannot resolve it automatically — the conservative single-take case, or when **Confirm Restore** is on — a block appears at the top of the Navigation panel explaining that the tree rebuilt itself flat and that a safety copy is available. It carries two buttons, and until you answer one of them the tree on screen is a rebuild, so **organising takes before restoring means your changes get replaced**:

| Button | Operator | What it does |
|--------|----------|--------------|
| **{{ op('tks.restore_store_snapshot').bl_label }}** | `tks.restore_store_snapshot` | Puts the organisation back from the most recent matching copy, and reports how many stores it recovered. When several copies match this file the block says so first. |
| **{{ op('tks.dismiss_store_notice').bl_label }}** | `tks.dismiss_store_notice` | You meant to lose it. Accepts the current, thinner state as intended, so the safety copy starts tracking it from now on instead of holding the old one back. |

!!! warning "Keep at least one World in the file"
    The store rides on a World datablock. A script that clears `bpy.data.worlds`, or an Outliner purge that removes the last one, takes the take organisation with it. The takes themselves are View Layers and survive — it is the grouping that has to be recovered.

An AI assistant driving Takes meets the same two choices as `api.restore_takes()` and `api.keep_current_takes()`; every other verb refuses while the offer stands, for exactly the reason above.

## :material-palette-swatch: Presets

A master *Master Default* enum sets the default storage tier for **new** presets, and per-type overrides exist for each of the 9 categories:

| Tier | Where it writes |
|------|-----------------|
| **ADDON** | Bundled folder. |
| **PROJECT** | Next to the `.blend`. |
| **SHARED** | Shared folder. |
| **LOCAL** | Local folder. |

Per-type overrides: Render, Output, File Output, View Layer, Color Management, Camera, World, Material, Bookmark.

## :material-puzzle: Addon

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Save Mode** | enum | ADDON | Where the preferences JSON is written: ADDON / PROJECT / SHARED / LOCAL. |
| **Config File (Shared / Local / Project)** | enum | `user_preferences.json` | Which config file to load from each storage tier. |
| **Autosave Preferences** | bool | On | Persist any change immediately. |
| **Auto-Restart Dead Processes** | bool | On | Restart background render processes if they crash. |
| **Auto-migrate on File Load** | bool | On | Run schema migration when opening a file from an older version. |
