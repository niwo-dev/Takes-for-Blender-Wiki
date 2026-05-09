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
