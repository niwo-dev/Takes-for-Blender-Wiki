---
icon: material/palette-swatch
---

# Render Presets

A **preset** is a saved snapshot of render settings.

You assign it through the [cascade](cascade.md), so a whole scene or a single shot renders the way you set it up once.

Nine kinds of settings can be saved this way, from **Render** to **Camera** to **World**.

??? info "What each preset type captures"
    | Type | What it captures |
    |------|-----------------|
    | **Render** | Engine, samples, resolution, color management, film settings. |
    | **Output** | Output container, dimensions, frame range, FPS. |
    | **File Output** | Output format, color depth, compression, Smart Output paths. |
    | **View Layer** | Active passes, light groups, holdouts, layer overrides. |
    | **Color Management** | View transform, look, exposure, gamma. |
    | **Camera** | Focal length, sensor size, depth of field, clip distances. |
    | **World** | Environment lighting, background color, ambient occlusion. |
    | **Material** | Per-material shader values, used by [Variant Switch](variant_switch.md). |
    | **Bookmark** | Saved sets of bookmarked properties. |

    Every type cascades on its own, so a Scene-level Render preset can win while a
    View Layer Color Management preset overrides it. Tag-driven [Rules](rules.md)
    can pick one for you. The same list appears under *Globals > Presets mode*.

## :material-plus-circle: Creating Presets

1. Set up your render settings in Blender's Properties editor.
2. Open the preset popover — the gear icon on the cascade row.
3. Click **New Preset** and name it.

Your preset is saved to disk, ready to assign anywhere.

??? tip "Starting from an existing preset"
    **Duplicate Current** starts from the selected preset instead of your live
    settings. Handy when you want a small variation of a studio standard.

## :material-link-variant: Assigning Presets

Presets ride the cascade. Set one at any of the six tiers, from **Global** down to **Take**.

A deeper tier always beats a wider one.

??? info "What each tier is good for"
    - **Global** — default render settings for the whole project.
    - **Scene Group** — shared settings for a group of scenes.
    - **Scene** — settings for every View Layer in one scene.
    - **View Layer Group** — shared settings for a group of View Layers.
    - **View Layer** — per-shot render configuration.
    - **Take** — take-specific tweaks.

    Full explanation on [Cascade System](cascade.md#override-tiers).

## :material-magnify: Managing Presets

Everything day-to-day happens on the preset row itself.

Click the field to search and assign. The **X** clears it. The **pencil** renames or moves it.

??? info "Every button on the preset row"
    | Task | How |
    |------|-----|
    | **Find & assign** | The preset field is itself a button — clicking it runs **{{ op('tks.search_render_preset').bl_label }}**, a type-ahead search across every storage tier. You can also browse the popover's filtered list; each entry assigns via **{{ op('tks.select_preset').bl_label }}**. |
    | **Clear** | The **X** next to the field clears the assignment. The preset file stays on disk. |
    | **Edit (rename / move)** | The pencil icon runs **{{ op('tks.edit_render_preset').bl_label }}**. It renames the preset, previews the filename it will save under, and can move the file to another storage tier. |
    | **Update (overwrite)** | The save icon on a dirty row runs **{{ op('tks.update_render_preset').bl_label }}** — it captures the current settings back into the preset, behind a confirmation. ++alt++-click to also sync, see [Dirty State](#dirty-state). |
    | **Delete** | **{{ op('tks.delete_render_preset').bl_label }}** removes the file after a confirmation and clears the assignment if the preset was in use. Quick route: ++alt++-click the clear **X**. |
    | **Apply once, no assignment** | **{{ op('tks.apply_render_preset').bl_label }}** stamps a preset's stored values onto the current scene, View Layer, camera or world one time, without assigning anything. It has no panel button — run it from Blender's operator search. |

??? tip "The same row inside Blender's Properties editor"
    Three collapsed standalone panels put the preset row right where the settings
    live: **TKS Output Presets** and **TKS File Output Presets** on the Output tab,
    **TKS View Layer Presets** on the View Layer tab. Handy while you are already
    tweaking the underlying settings.

## :material-pencil-circle: Dirty State

Change a setting after a preset is applied and the preset goes **dirty** — the live value no longer matches the stored one.

**Accept** saves your change into the preset. **Revert** puts the stored value back. ++alt++-click **Accept** to also push the result to every other scene using that preset.

Every pending change also collects in the Navigation panel's **Preset Changes** warning.

??? info "Resolving changes at three levels of detail"
    1. **Everything at once.** The top row's **Accept**
       (**{{ op('tks.save_all_dirty_presets').bl_label }}**) writes every dirty
       preset back to disk in one confirmation-gated click. **Revert**
       (**{{ op('tks.revert_all_presets').bl_label }}**) restores every stored value
       instead. ++alt++-clicking either one also re-applies the result to every
       other scene using the same presets.
    2. **One preset type.** Each dirty type gets its own box with a ✓ / ↩ pair in
       the header. ✓ saves just that preset (++alt++-click =
       **{{ op('tks.accept_sync_preset_type').bl_label }}**, which saves *and*
       re-applies it everywhere it is shared). ↩ reverts it
       (**{{ op('tks.revert_to_preset').bl_label }}**).
    3. **One property.** Expand a type's box to list every changed value as
       *stored → current*, with the current side still editable. Each row has its
       own ✓ **{{ op('tks.accept_preset_property').bl_label }}** and ↩
       **{{ op('tks.revert_preset_property').bl_label }}**. ++alt++-click either to
       also sync that single value across scenes
       (**{{ op('tks.accept_sync_preset_property').bl_label }}**).

    The practical workflow: tweak freely, then walk the list top-down. Accept the
    properties you meant to change, revert the strays, and only use the
    all-at-once row when the whole session was intentional.

??? warning "Locked Shared presets"
    If a dirty preset lives in the locked **Shared** tier, its Accept button becomes
    a lock icon and the panel notes that changes cannot be saved. Revert still
    works, per property too. See **Lock Shared Folder** under
    [Storage Tiers](#storage-tiers).

??? note "Tier indicators"
    Preset dropdowns show the storage tier as a suffix, so you can tell a built-in
    preset from one you made yourself.

## :material-folder-multiple: Storage Tiers

Every preset file lives in one of four places: **Add-on**, **Project**, **Shared** or **Local**.

Choose one per preset type in *Preferences > Data > Presets*. **Lock Shared Folder** (on by default) stops the addon overwriting team presets.

??? info "Which tier to use"
    | Tier | Location | When to use |
    |------|----------|-------------|
    | **Add-on** | Bundled with the add-on. | Defaults — read-only by convention. |
    | **Project** | Saved next to the `.blend`. | Per-project presets that travel with the file. |
    | **Shared** | Team folder, path in *Preferences > Data > Storage*. | Studio-wide standards. |
    | **Local** | Your personal user folder. | Your own work-in-progress presets. |

    **Lock Shared Folder** also lives in *Preferences > Data > Storage*.

??? tip "Opening a tier folder"
    To inspect or back up the raw files, jump straight to a folder in your file
    explorer. **Open Add-on Folder** opens the bundled read-only defaults.
    **Open Project Folder** opens the folder next to the current `.blend`.

    **Open Project Folder** only works once the `.blend` is saved — an unsaved file
    has no project folder yet.

## :material-stethoscope: Preset Health

When a preset a tier points at has gone missing, a **broken-link badge** appears in the Navigation panel's warning row.

Click the badge to list every reference that no longer resolves, with its tier and file path. The panel repairs them too.

??? info "The repair buttons"
    - **X** on an entry runs **{{ op('tks.clear_missing_preset').bl_label }}** and
      empties the stale reference to that one preset. A type row's **Empty all**
      clears every stale reference of that type at once.
    - The **preset icon** next to an entry reopens the search popup, so you can
      point the slot at an existing preset instead of clearing it.
    - **Clear All** at the top runs
      **{{ op('tks.clear_all_missing_presets').bl_label }}** and empties every stale
      reference in the file in one click.

    Clearing only empties the stored references — no preset files are touched. The
    cascade re-syncs afterwards so child tiers inherit correct values again, and the
    badge disappears once everything resolves.

## :material-broom: Manage Orphaned Settings

Old presets can carry values the addon no longer reads, usually after an update.

**Manage Orphaned Settings** inspects a preset and lists those leftovers so you can prune them.

??? info "How the cleanup works"
    Pick a category — Render, Output, Camera, World and so on — in the dialog. Each
    orphaned entry shows its name and the value stored in the file.

    Removing entries is undoable. Save the preset afterwards to make the cleanup
    stick.

    This is a maintenance hatch. You will rarely need it unless you are tidying a
    long-lived preset library.

## :material-wrench-clock: Clean Up Incompatible Presets

A preset saved by a much older or newer version can stop loading, because its layout no longer matches what the addon reads.

**Clean Up Incompatible Presets** scans every tier and resolves them in one pass.

??? info "Migrated or quarantined"
    Files that can be upgraded are migrated to the current format in place. Files
    that cannot are moved into a `_quarantine` subfolder, instead of being left to
    break the preset list.

    The confirmation dialog tells you how many files fall in each group before you
    commit.

    **Nothing is deleted.** Quarantined files stay on disk, so you can inspect or
    restore them by hand. If the scan finds nothing incompatible, the addon says so
    and does nothing.

## :material-keyboard: Hotkeys

++alt++-click a preset icon to clear the assignment at that tier.

Full list: [Keyboard Shortcuts](../interface/hotkeys.md)
