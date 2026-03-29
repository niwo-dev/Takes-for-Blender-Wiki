# Preferences

**Location:** *Edit > Preferences > Add-ons > Takes for Blender*

Or click the **gear icon** in the Navigation Panel header and select **Open Preferences**.

## General

| Setting | Default | Description |
|---------|---------|-------------|
| **Autosave Preferences** | On | Persist settings to JSON between sessions. |
| **Debug Logging** | Off | Enable per-topic logging to daily log files. |

## Features

| Setting | Default | Description |
|---------|---------|-------------|
| **Auto-Assign VL Actions** | On | Automatically assign cascade actions per View Layer. |
| **Auto-Create Reference Action** | On | Mirror keyframes to the Reference State automatically. |
| **Auto-Rename Actions** | On | Rename actions to match the cascade naming convention. |
| **Preset Automation Mode** | Manual | How preset changes are handled (auto-accept, sync, manual). |
| **Batch Render Sound** | None | Notification sound on batch render completion. |

## Behavior

| Setting | Default | Description |
|---------|---------|-------------|
| **Syntax Brackets** | Square `[]` | Token delimiter style for Smart Output. |
| **Separator Characters** | `sep1`=`_` | Up to 5 configurable separator tokens. |

## Debug Logging

When enabled, debug logging writes to daily log files with granular topic filtering:

| Topic | Subtopics |
|-------|-----------|
| **Core** | VL Switch, Cascade |
| **UI** | Inspector |
| **Ops** | Animation |
| **Features** | Reference State, Variant Switch |
| **Render** | Batch Render |

Per-level toggle buttons (Debug, Info, Warning, Error) filter messages before any string formatting occurs.

!!! note "Log Location"
    Logs are saved as `takes_for_blender_YYYY-MM-DD.log` in the
    configured log directory. Files older than 7 days are auto-deleted.
