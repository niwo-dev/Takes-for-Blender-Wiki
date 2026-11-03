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
    World, takes your take organisation with it. Your view layers
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
| **Add-on** | The bundled add-on folder. |
| **Project** | Next to the `.blend`. |
| **Shared** | The Shared Presets Folder above. |
| **Local** | The Local Presets Folder above. |

The nine types: Render, Output, File Output, View Layer, Color Management, Camera, World, Material, Bookmark.

??? info "The storage buttons"
    **{{ op('tks.toggle_preset_override').bl_label }}** gives one preset type its own tier. **{{ op('tks.reset_preset_field').bl_label }}** sends it back to the Master Default, **{{ op('tks.reset_all_preset_fields').bl_label }}** does that for all nine. **{{ op('tks.apply_preset_storage_defaults').bl_label }}** applies the storage defaults to every open scene.

## :material-star-outline: Default Presets

A default preset is the one a file starts with when it has not picked one of its own. Under **Presets**, the **Default Presets** section has a **Tokens** row and one row for each of the seven cascade kinds, from **Render** to **World**. See [Render Presets](../features/render_presets.md#default-presets).

??? info "How a default applies"
    The file's own choice always wins. The seven kinds apply when you switch to a View Layer that has no preset set anywhere. **Tokens** applies when a file opens. A default whose preset has gone missing shows in red and applies nothing. The **X** beside a row clears it.

## :material-broom: Tools

The **Tools** sub-tab cleans a file of the add-on's data. **Clear Add-on Data (tks_*)** removes every Takes property from the file, so use it before you uninstall. **Clear All Custom Properties** and **Clear by Pattern...** do the same for custom properties. The **Property Scanner** lists the patterns it finds, and **Clear** removes the ones you select. All of these reach every kind of data in the file.

## :material-puzzle: Add-on

Where the add-on keeps its own settings.

| Setting | What it does |
|---------|--------------|
| **Save Mode** | Which tier the settings file goes to: **Add-on**, **Project**, **Shared** or **Local**. |
| **Configuration File** | Which settings file to load. One picker per tier. |
| **Autosave Preferences** | On. Saves every change the moment you make it. |
| **Auto-Restart Dead Processes** | On. Restarts a background render process if it crashes. |
| **Auto-migrate on File Load** | On. Updates data saved by an older add-on version when you open the file. |

## :material-format-list-checks: Every Storage Setting

Where each kind of preset is saved when you make a new one. Each row can be overridden per preset as you save it.

??? info "Every storage setting"
    | Setting | What it does |
    | --- | --- |
    | **Bookmark Preset Storage** | Where a new bookmark preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **Camera Preset Storage** | Where a new camera preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **Color Management Preset Storage** | Where a new color management preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **File Output Preset Storage** | Where a new file output preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **Material Preset Storage** | Where a new material preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **Output Preset Storage** | Where a new output preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **Render Preset Storage** | Where a new render preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **View Layer Preset Storage** | Where a new view layer preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
    | **World Preset Storage** | Where a new world preset is saved unless you pick another tier: the add-on, this project, a shared folder, or local |
