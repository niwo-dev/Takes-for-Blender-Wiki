---
icon: material/incognito
---

# Advanced

*Hidden / side-effect settings, and how to reset preferences back to defaults.*

## :material-eye-off: Hidden Settings

A handful of preferences only surface as side-effects of other operations:

| Setting | Where | Purpose |
|---------|-------|---------|
| **Default Folder** (Smart Output) | Used when a fresh render preset is created. | Default starting path (`//`). |
| **Default File Name** (Smart Output) | Same. | Default file name pattern (`[view_layer]_####.[file_format]`). |
| Override flags (~25) | Internal state | Track which row heights and preset storage tiers you overrode. Auto-managed. |
| Expansion flags (~50) | Internal state | Remember which collapsibles were left open. |

??? note "No longer hidden: Smart Output Bracket Style"
    The token bracket style used to surface only when a new preset was created.
    It is now a regular, visible preference in the *Render Output* section of
    the [*Workflow* tab](workflow.md#render).

## :material-restore: Resetting Preferences

The fastest way back to defaults: in *Preferences > Data > Add-on*, switch *Save Mode* to **ADDON**, then re-enable the add-on. Your custom config files in PROJECT / SHARED / LOCAL remain untouched.

??? note "Where preferences live on disk"
    Preferences are stored as JSON in the directory chosen by *Save Mode*.
    By default that's the addon's own folder. The active save mode is shown
    at the top of the [*Data > Add-on*](data.md#add-on) sub-tab.

## :material-cached: Rebuild Cache { #rebuild-cache }

Does the takes tree, a preset or the rest state look stale? **{{ op('tks.rebuild_cache').bl_label }}** clears everything and starts fresh in one step.

Use it after the add-on warns that a file was last touched by a different version.

??? info "When the panels are held"
    A file saved by an older version can lock the panels until you rebuild, so
    nothing shows you state from stale caches. The lock card carries two ways
    out: **{{ op('tks.rebuild_cache').bl_label }}**, or
    **{{ op('tks.cache_unlock').bl_label }}**, which unlocks without rebuilding.
    The file stays marked, so the warning returns next time you open it.
    Nothing in your file changes either way.

It is always available and safe. It only touches the add-on's own caches and the version stamp in the open file — your scene data is never rewritten.

??? info "What it does, step by step"
    1. Clears every in-memory cache the add-on owns: rest-state, preset files,
       the preset engine, navigation warnings.
    2. Re-stamps the active scene with the current add-on version, so the next
       launch sees a clean stamp.
    3. Disables and re-enables the add-on, rebuilding all per-scene runtime
       state from scratch.

    This is the heavier counterpart to the developer-focused
    [Reload Add-on](index.md#support-developer). A plain reload refreshes the
    code; **{{ op('tks.rebuild_cache').bl_label }}** also flushes cached data and
    re-stamps the file.

!!! warning "Reloads the add-on"
    Because this disables and re-enables the add-on, any unsaved add-on UI state
    (expanded panels, transient selections) resets. Your `.blend` data and saved
    preferences are untouched.
