---
icon: material/database
---

# Data Tab

*Where presets, safety copies and the add-on's own settings are stored.*

## :material-folder-multiple: Storage

Two folders you can point anywhere — a personal one and a team one.

| Setting | What it does |
|---------|--------------|
| **Local Presets Folder** | Your personal preset directory. |
| **Shared Presets Folder** | The team preset directory. |
| **Lock Shared Folder** | On by default. Stops the add-on writing into the shared folder. |

## :material-backup-restore: Snapshots & Recovery {: #snapshots }

Your takes, groups, tags, rules and variants ride on a World inside the `.blend`. That keeps them with the file. But delete or purge that World and the whole organisation goes too — the tree rebuilds itself flat.

So Takes keeps a safety copy on disk, refreshed as you work. If the storage goes missing, it puts the copy back on its own and tells you afterwards.

| Setting | What it does |
|---------|--------------|
| **Confirm Before Restoring** | Off by default, so recovery just happens. Turn it on to approve each restore yourself. |
| **Snapshots** | Read-only path to the copies. The folder button beside it runs **{{ op('tks.open_snapshots_folder').bl_label }}**. |

!!! warning "Keep at least one World in the file"
    A script that clears `bpy.data.worlds`, or a purge that removes the last
    World, takes your take organisation with it. Your takes are View Layers and
    survive — it is the grouping you must recover.

??? info "When Takes asks you first"
    Sometimes it cannot decide alone — the conservative single-take case, or when
    **Confirm Before Restoring** is on. Then a block appears at the top of the
    Navigation panel with two buttons. Until you answer, the tree on screen is a
    rebuild, so **organising takes before restoring means your changes get replaced**.

    | Button | What it does |
    | -------- | -------------- |
    | **{{ op('tks.restore_store_snapshot').bl_label }}** | Puts the organisation back from the most recent matching copy, and reports how many stores it recovered. If several copies match this file, the block says so first. |
    | **{{ op('tks.dismiss_store_notice').bl_label }}** | You meant to lose it. Accepts the thinner state as intended, so the safety copy starts tracking that from now on. |

    An AI assistant driving Takes gets the same two choices, and every other
    action refuses while the offer stands — for exactly the reason above.

## :material-palette-swatch: Presets

**Master Default** sets the tier that *new* presets are saved to. Each of the nine preset types can override it.

| Tier | Where it writes |
|------|-----------------|
| **Addon** | The bundled add-on folder. |
| **Project** | Next to the `.blend`. |
| **Shared** | The Shared Presets Folder above. |
| **Local** | The Local Presets Folder above. |

The nine types: Render, Output, File Output, View Layer, Color Management, Camera, World, Material, Bookmark.

## :material-puzzle: Addon

Where the add-on keeps its own settings.

| Setting | What it does |
|---------|--------------|
| **Save Mode** | Which tier the settings file goes to: **Addon**, **Project**, **Shared** or **Local**. |
| **Config File** | Which settings file to load. One picker per tier. |
| **Autosave Preferences** | On. Saves every change the moment you make it. |
| **Auto-Restart Dead Processes** | On. Restarts a background render process if it crashes. |
| **Auto-migrate on File Load** | On. Updates data saved by an older add-on version when you open the file. |
