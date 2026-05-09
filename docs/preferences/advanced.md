---
icon: material/incognito
---

# Advanced

*Hidden / side-effect settings, and how to reset preferences back to defaults.*

## :material-eye-off: Hidden Settings

A handful of preferences only surface as side-effects of other operations:

| Setting | Where | Purpose |
|---------|-------|---------|
| **Smart Output Default Directory** | Used when a fresh render preset is created. | Default starting path (`//`). |
| **Smart Output Default Filename** | Same. | Default filename pattern (`[view_layer]_####.[file_format]`). |
| **Smart Output Bracket Style** | Same. | Default delimiter style for new presets (SQUARE / CURLY / ANGLE / PARENS / PERCENT / DOLLAR / HASH). |
| Override flags (~25) | Internal state | Track which list-row-heights / preset-storage-tiers are user-overridden vs. master-synced. Auto-managed. |
| Expansion flags (~50) | Internal state | Remember which collapsibles were left open. |

## :material-restore: Resetting Preferences

The fastest way back to defaults: in *Preferences > Data > Addon*, switch *Save Mode* to **ADDON** then re-enable the addon. Your custom config files in PROJECT / SHARED / LOCAL remain untouched.

!!! note "Where preferences live on disk"
    Preferences are stored as JSON in the directory chosen by *Save Mode*.
    By default that's the addon's own folder. The active save mode is shown
    at the top of the [*Data > Addon*](data.md#addon) sub-tab.
