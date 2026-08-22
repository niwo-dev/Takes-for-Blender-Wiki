# Wiki Shot List

Every image the wiki needs, page by page. This is the master list the capture
rig (and later the Shot Studio) works through.

**Conventions**

- Files go to `docs/assets/shots/<name>.png`.
- Names follow `<section>_<page>_<subject>.png` — underscore BETWEEN parts,
  hyphen inside a part, all lowercase. Optional 4th part for a state
  (`_open`, `_dirty`, `_live-on`). No numbers, dates or versions: order
  lives on the page, and a name is never renamed — the wiki link is the
  contract. UI changed? Re-shoot under the same name.
- ✓ marks a shot whose placeholder already sits on the page
  (`<div class="tks-shot">…</div>`). All others still need a placeholder when
  the shot is wired in.
- Every capture runs in a **factory session** (`use_factory_startup=True`) —
  never the author's own scenes, add-ons or recent files.
- Generated pages (Changelog, Roadmap), FAQ, Hotkeys and Comparisons carry no
  shots: they are lists and tables, and pictures would only restate them.

---

## Start Here

### getting_started/installation.md

| # | File | Shows |
|---|------|-------|
| 1 | `getting-started_installation_get-extensions.png` | Preferences > Get Extensions, with Install from Disk open |
| 2 | `getting-started_installation_addon-enabled.png` | Takes for Blender enabled in the add-on list |
| 3 | `getting-started_installation_takes-tab.png` | 3D View sidebar showing the new Takes tab |

### getting_started/first_steps.md

| # | File | Shows |
|---|------|-------|
| 1 | `getting-started_first-steps_open-panel.png` | Sidebar open on the Takes tab (step 1) |
| 2 | `getting-started_first-steps_add-viewlayer.png` | The + add menu with the New View Layer entry (step 2) |
| 3 | `getting-started_first-steps_assign-camera.png` | Camera icon on a tree row with the picker open (step 3) |
| 4 | `getting-started_first-steps_groups.png` | Tree with a Scene Group and a VL Group wrapping rows (step 4) |
| 5 | `getting-started_first-steps_batch-render.png` | Render button and render menu on the tree (step 5) |

### getting_started/first_take.md — placeholders exist ✓

| # | File | Shows |
|---|------|-------|
| 1 | `getting-started_first-take_default-scene.png` ✓ | Fresh default scene with the cube |
| 2 | `getting-started_first-take_takes-panel.png` ✓ | Sidebar open on the Takes tab, tree visible |
| 3 | `getting-started_first-take_first-take-row.png` ✓ | Tree with Take_001 under the View Layer, highlighted active |
| 4 | `getting-started_first-take_camera-menu.png` ✓ | Camera menu on the take row, Camera entry |
| 5 | `getting-started_first-take_two-takes.png` ✓ | Tree with two takes, Take_002 active |
| 6 | `getting-started_first-take_new-angle.png` ✓ | Viewport orbited to a new angle on the cube |
| 7 | `getting-started_first-take_new-camera.png` ✓ | Create New Camera entry in the layer's camera menu |
| 8 | `getting-started_first-take_flip-compare.png` ✓ | Side-by-side of the two framings while flipping takes |

### getting_started/first_batch_render.md — placeholders exist ✓

| # | File | Shows |
|---|------|-------|
| 1 | `getting-started_first-batch-render_save-dialog.png` ✓ | Blender save dialog |
| 2 | `getting-started_first-batch-render_add-menu.png` ✓ | Add menu with the New View Layer options |
| 3 | `getting-started_first-batch-render_second-layer.png` ✓ | Tree with the second layer and its first take |
| 4 | `getting-started_first-batch-render_third-angle.png` ✓ | Viewport orbited to a third angle on the cube |
| 5 | `getting-started_first-batch-render_new-camera.png` ✓ | Create New Camera on the second layer's row |
| 6 | `getting-started_first-batch-render_smart-output.png` ✓ | Smart Output toggle in the Output panel |
| 7 | `getting-started_first-batch-render_name-preview.png` ✓ | Directory and File Name fields with live preview |
| 8 | `getting-started_first-batch-render_render-menu.png` ✓ | Render menu with Render Mode and the This Scene row |

---

## Guides

### workflows/switch_takes.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_switch-takes_tree.png` | Tree with several takes on one layer, one active |
| 2 | `workflows_switch-takes_click-row.png` | Clicking an inactive take row (cursor on it) |
| 3 | `workflows_switch-takes_pie.png` | The Navigation pie as the faster route |

### workflows/keep_an_objects_own_animation.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_keep-an-objects-own-animation_inspector-pin.png` | The object pin in the Inspector |
| 2 | `workflows_keep-an-objects-own-animation_pinned-row.png` | A pinned object row, marked hands-off |

### workflows/lock_a_value.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_lock-a-value_header-button.png` | Value Lock button in the navigation header |
| 2 | `workflows_lock-a-value_locked-state.png` | Lock engaged: button lit, Autokey dimmed |

### workflows/material_variants.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_material-variants_product.png` | New Product in the Variants tree |
| 2 | `workflows_material-variants_parts-pool.png` | A Part with pool slots and materials assigned |
| 3 | `workflows_material-variants_states.png` | States listed, one active (filled circle) |
| 4 | `workflows_material-variants_live-preview.png` | Live on, a State picked, viewport following |

### workflows/animation_variants.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_animation-variants_layers.png` | The View Layers created for the variants |
| 2 | `workflows_animation-variants_cameras.png` | Cameras assigned per layer in the tree |
| 3 | `workflows_animation-variants_render-all.png` | Render menu set to render them all |

### workflows/tag_and_filter.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_tag-and-filter_assign.png` | Tag popover open on a tree row |
| 2 | `workflows_tag-and-filter_library.png` | The tag library with a few tags and a group |
| 3 | `workflows_tag-and-filter_tree-filter.png` | Tree filtered by tag, parents kept |

### workflows/batch_rendering.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_batch-rendering_render-menu.png` | Render menu: scope rows and the two render modes |
| 2 | `workflows_batch-rendering_queue.png` | Queue running, mixed statuses visible |
| 3 | `workflows_batch-rendering_output-files.png` | The rendered files in their output folder |

### workflows/name_output_files.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_name-output-files_fields.png` | Directory and File Name fields with tokens in them |
| 2 | `workflows_name-output-files_preview.png` | The live preview resolving the tokens |
| 3 | `workflows_name-output-files_result.png` | Resulting file names on disk |

### workflows/use_render_presets.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_use-render-presets_picker.png` | Preset picker open on a row |
| 2 | `workflows_use-render-presets_globals.png` | Globals panel, Presets mode, the 8 categories |
| 3 | `workflows_use-render-presets_dirty.png` | Dirty indicator with Accept / Revert |

### workflows/bookmark_a_property.md

| # | File | Shows |
|---|------|-------|
| 1 | `workflows_bookmark-a-property_rightclick.png` | Right-click menu with Bookmark Property |
| 2 | `workflows_bookmark-a-property_channels.png` | Inspector Channels view, bookmark shelf revealed |
| 3 | `workflows_bookmark-a-property_shelf-row.png` | A bookmarked property edited from its shelf row |

---

## How It Works

### features/takes.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_takes_hierarchy.png` | Full tree: Scene Group > Scene > VL Group > View Layer > Take |
| 2 | `features_takes_take-rows.png` | Take rows under one layer, close up |

### features/vl_versions.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_vl-versions_takes.png` | Several takes as review iterations on one layer |
| 2 | `features_vl-versions_switch.png` | Flipping between them, viewport following |

### features/cascade.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_cascade_icons-row.png` | Cascade icon strip on a tree row |
| 2 | `features_cascade_bright-dim.png` | Bright (set here) vs dimmed (inherited) icons |
| 3 | `features_cascade_popover.png` | Shift-click full popover with + and inherited value |
| 4 | `features_cascade_context-props.png` | Context Properties listing every override at once |

### features/rest_state.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_rest-state_picker.png` | Rest Action picker in the Takes tree header |
| 2 | `features_rest-state_drift.png` | Ghost drift warning with snap controls |

---

## Inside Takes — Panels

### interface/navigation_panel.md

| # | File | Shows |
|---|------|-------|
| 1 | `interface_navigation-panel_overview.png` | The whole panel: header, tree, warnings |
| 2 | `interface_navigation-panel_header.png` | Header controls close up |
| 3 | `interface_navigation-panel_row-icons.png` | One row with its icon strip, readable |
| 4 | `interface_navigation-panel_warnings.png` | Warning badges row with one panel open |
| 5 | `interface_navigation-panel_display.png` | The Icon Visibility / display popover |

### interface/inspector_panel.md

| # | File | Shows |
|---|------|-------|
| 1 | `interface_inspector-panel_overview.png` | The panel in Inspector mode |
| 2 | `interface_inspector-panel_watchlist.png` | Watchlist with objects and pins |
| 3 | `interface_inspector-panel_channels.png` | Channels view with keyable rows |

### interface/context_properties.md

| # | File | Shows |
|---|------|-------|
| 1 | `interface_context-properties_overview.png` | The panel with the active layer's overrides |
| 2 | `interface_context-properties_rows.png` | Override rows: value, rule, preset slot |
| 3 | `interface_context-properties_push.png` | Push to Selected during a multi-selection |

### interface/variant_tree.md

| # | File | Shows |
|---|------|-------|
| 1 | `interface_variant-tree_overview.png` | The tree: Products, States, Parts, pools |
| 2 | `interface_variant-tree_row.png` | One Product row: LIVE cell, in-use count, stats |

### features/globals.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_globals_modes.png` | Header with the four mode buttons |
| 2 | `features_globals_presets.png` | Presets mode: the 8 categories |
| 3 | `features_globals_rules.png` | Rules mode |
| 4 | `features_globals_tags.png` | Tags mode |

---

## Inside Takes — Features

### features/variant_switch.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_variant-switch_tree.png` | Product with Parts, pools and States |
| 2 | `features_variant-switch_live.png` | Live armed: LIVE label on one Product, dimmed marker on another |
| 3 | `features_variant-switch_diamond.png` | Diamond vs filled circle on State rows |
| 4 | `features_variant-switch_conflicts.png` | Conflict warning: Collapse and Shared-object entries |

### features/render_presets.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_render-presets_rows.png` | Preset rows: empty, assigned, dirty, missing |
| 2 | `features_render-presets_edit.png` | Edit popover of one preset |
| 3 | `features_render-presets_tiers.png` | The same preset type at two tiers in the tree |

### features/tags.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_tags_library.png` | The library with tags and one group |
| 2 | `features_tags_group.png` | Selected tags becoming a group (+ > Group) |
| 3 | `features_tags_presets.png` | A tag carrying a preset bundle |

### features/rules.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_rules_list.png` | Rules mode with a rule listed |
| 2 | `features_rules_row.png` | One rule: pattern, target, preset |

### features/smart_output.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_smart-output_toggle.png` | Smart Output toggle in the Output panel |
| 2 | `features_smart-output_tokens.png` | The token grid / mega-sheet |
| 3 | `features_smart-output_preview.png` | Pattern with tokens and its live preview |

### features/custom_tokens.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_custom-tokens_editor.png` | The custom token editor in preferences |
| 2 | `features_custom-tokens_in-use.png` | A custom token inside an output pattern |

### features/batch_render.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_batch-render_menu.png` | The render menu: categories, Calibrate, render modes |
| 2 | `features_batch-render_queue.png` | The queue with Pending / Rendering / Post / Done rows |
| 3 | `features_batch-render_jobs.png` | The Render Jobs popover at the pointer |
| 4 | `features_batch-render_eta.png` | ETA and progress during a background batch |

### features/pie_menus.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_pie-menus_navigation.png` | Navigation pie, eight slots |
| 2 | `features_pie-menus_f12.png` | F12 render pie |
| 3 | `features_pie-menus_mode.png` | Mode pie (Shift+Alt+Q) |
| 4 | `features_pie-menus_keyframe.png` | Keyframe pie on I |
| 5 | `features_pie-menus_config.png` | The pie grid configurator in preferences |

### features/bookmarks.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_bookmarks_menu.png` | Right-click Bookmark Property entry |
| 2 | `features_bookmarks_shelf.png` | The bookmark shelf in Channels |

### features/vl_preview.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_vl-preview_thumbs.png` | Thumbnails beside tree rows |
| 2 | `features_vl-preview_settings.png` | Preview controls in the display popover |

### features/viewport_sync.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_viewport-sync_toggle.png` | The sync control and what it aligns |

### features/still_mode.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_still-mode_row-icons.png` | Still / Anim icons on VL and take rows |
| 2 | `features_still-mode_global-menu.png` | Header button open: Still / Animation / Off (per-take) |
| 3 | `features_still-mode_frame-pin.png` | A Still take pinned to its frame |

### features/value_lock.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_value-lock_button.png` | The header button between Still Mode and Autokey |
| 2 | `features_value-lock_engaged.png` | Lock on: Autokey dimmed, values guarded |

### features/sequencer.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_sequencer_strips.png` | VSE with scene strips driven by takes |
| 2 | `features_sequencer_controls.png` | The Takes controls on a strip |

### features/process_monitor.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_process-monitor_overlay.png` | The viewport HUD during a background render |
| 2 | `features_process-monitor_list.png` | The process list with a running job |

### features/ai_assistant.md

| # | File | Shows |
|---|------|-------|
| 1 | `features_ai-assistant_panel.png` | The AI Assistant surface |

---

## Inside Takes — Preferences

### preferences/index.md

| # | File | Shows |
|---|------|-------|
| 1 | `preferences_index_overview.png` | The preferences with their tab row |

### preferences/workflow.md

| # | File | Shows |
|---|------|-------|
| 1 | `preferences_workflow_tab.png` | Workflow tab overview |
| 2 | `preferences_workflow_render.png` | The four Render sections |
| 3 | `preferences_workflow_pies.png` | Pie & Misc with one pie grid open |

### preferences/ui.md

| # | File | Shows |
|---|------|-------|
| 1 | `preferences_ui_tab.png` | Interface tab overview |
| 2 | `preferences_ui_tree.png` | Tree design settings |

### preferences/data.md

| # | File | Shows |
|---|------|-------|
| 1 | `preferences_data_tab.png` | Data tab overview |
| 2 | `preferences_data_snapshots.png` | Snapshots & Recovery section |

### preferences/debug.md

| # | File | Shows |
|---|------|-------|
| 1 | `preferences_debug_tab.png` | Developer tab overview |
| 2 | `preferences_debug_logging.png` | Logging topics section |

### preferences/advanced.md

| # | File | Shows |
|---|------|-------|
| 1 | `preferences_advanced_tab.png` | Advanced tab overview |

---

## Totals

| Section | Shots |
|---------|-------|
| Start Here | 24 |
| Guides | 29 |
| How It Works | 10 |
| Panels | 17 |
| Features | 41 |
| Preferences | 11 |
| **Total** | **132** |

16 of these already have placeholders on their pages; the other 116 need one
when their shot is wired in.
