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
| Override flags (~25) | Internal state | Track which list-row-heights / preset-storage-tiers are user-overridden vs. master-synced. Auto-managed. |
| Expansion flags (~50) | Internal state | Remember which collapsibles were left open. |

!!! note "No longer hidden: Smart Output Bracket Style"
    The token bracket style used to surface only when a new preset was created.
    It is now a regular, visible preference in the *Render Output* section of
    the [*Workflow* tab](workflow.md#render).

## :material-restore: Resetting Preferences

The fastest way back to defaults: in *Preferences > Data > Addon*, switch *Save Mode* to **ADDON** then re-enable the addon. Your custom config files in PROJECT / SHARED / LOCAL remain untouched.

!!! note "Where preferences live on disk"
    Preferences are stored as JSON in the directory chosen by *Save Mode*.
    By default that's the addon's own folder. The active save mode is shown
    at the top of the [*Data > Addon*](data.md#addon) sub-tab.

## :material-cached: Rebuild Cache { #rebuild-cache }

If the takes tree, presets, or rest-state ever look stale or out of sync — for example after the add-on warns that a file was last touched by a different version — the **Rebuild Cache & Reload Addon** button (`tks.rebuild_cache`) clears everything and starts fresh in one step. It:

1. Clears every in-memory cache the add-on owns (rest-state, preset files, the preset engine, navigation warnings).
2. Re-stamps the active scene with the current add-on version so the next launch sees a clean stamp.
3. Disables and re-enables the add-on, rebuilding all per-scene runtime state from scratch.

This is the heavier counterpart to the developer-focused [Reload Addon](index.md#support-developer): a plain reload refreshes the code, whereas **Rebuild Cache & Reload Addon** also flushes cached data and re-stamps the file. It is always available and only touches the add-on's own in-memory state plus the active `.blend`'s version stamp — it never rewrites your scene data.

!!! warning "Reloads the add-on"
    Because this disables and re-enables the add-on, any unsaved add-on UI state
    (expanded panels, transient selections) resets. Your `.blend` data and saved
    preferences are untouched.
