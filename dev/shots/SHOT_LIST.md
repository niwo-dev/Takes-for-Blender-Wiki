# Wiki Shot List

Every image the wiki needs, page by page. This is the master list the capture
rig (and later the Shot Studio) works through.

**Conventions**

- Files go to `docs/assets/shots/<name>.png`.
- Names follow `<page>_<nn>_<slug>.png`, numbered in reading order.
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
| 1 | `installation_01_get_extensions.png` | Preferences > Get Extensions, with Install from Disk open |
| 2 | `installation_02_addon_enabled.png` | Takes for Blender enabled in the add-on list |
| 3 | `installation_03_takes_tab.png` | 3D View sidebar showing the new Takes tab |

### getting_started/first_steps.md

| # | File | Shows |
|---|------|-------|
| 1 | `first_steps_01_open_panel.png` | Sidebar open on the Takes tab (step 1) |
| 2 | `first_steps_02_add_viewlayer.png` | The + add menu with the New View Layer entry (step 2) |
| 3 | `first_steps_03_assign_camera.png` | Camera icon on a tree row with the picker open (step 3) |
| 4 | `first_steps_04_groups.png` | Tree with a Scene Group and a VL Group wrapping rows (step 4) |
| 5 | `first_steps_05_batch_render.png` | Render button and render menu on the tree (step 5) |

### getting_started/first_take.md — placeholders exist ✓

| # | File | Shows |
|---|------|-------|
| 1 | `first_take_01_default_scene.png` ✓ | Fresh default scene with the cube |
| 2 | `first_take_02_takes_panel.png` ✓ | Sidebar open on the Takes tab, tree visible |
| 3 | `first_take_03_first_take_row.png` ✓ | Tree with Take_001 under the View Layer, highlighted active |
| 4 | `first_take_04_camera_menu.png` ✓ | Camera menu on the take row, Camera entry |
| 5 | `first_take_05_two_takes.png` ✓ | Tree with two takes, Take_002 active |
| 6 | `first_take_06_new_angle.png` ✓ | Viewport orbited to a new angle on the cube |
| 7 | `first_take_07_new_camera.png` ✓ | Create New Camera entry in the layer's camera menu |
| 8 | `first_take_08_flip_compare.png` ✓ | Side-by-side of the two framings while flipping takes |

### getting_started/first_batch_render.md — placeholders exist ✓

| # | File | Shows |
|---|------|-------|
| 1 | `first_batch_01_save_dialog.png` ✓ | Blender save dialog |
| 2 | `first_batch_02_add_menu.png` ✓ | Add menu with the New View Layer options |
| 3 | `first_batch_03_second_layer.png` ✓ | Tree with the second layer and its first take |
| 4 | `first_batch_04_third_angle.png` ✓ | Viewport orbited to a third angle on the cube |
| 5 | `first_batch_05_new_camera.png` ✓ | Create New Camera on the second layer's row |
| 6 | `first_batch_06_smart_output.png` ✓ | Smart Output toggle in the Output panel |
| 7 | `first_batch_07_name_preview.png` ✓ | Directory and File Name fields with live preview |
| 8 | `first_batch_08_render_menu.png` ✓ | Render menu with Render Mode and the This Scene row |

---

## Guides

### workflows/switch_takes.md

| # | File | Shows |
|---|------|-------|
| 1 | `switch_takes_01_tree.png` | Tree with several takes on one layer, one active |
| 2 | `switch_takes_02_click_row.png` | Clicking an inactive take row (cursor on it) |
| 3 | `switch_takes_03_pie.png` | The Navigation pie as the faster route |

### workflows/keep_an_objects_own_animation.md

| # | File | Shows |
|---|------|-------|
| 1 | `keep_anim_01_inspector_pin.png` | The object pin in the Inspector |
| 2 | `keep_anim_02_pinned_row.png` | A pinned object row, marked hands-off |

### workflows/lock_a_value.md

| # | File | Shows |
|---|------|-------|
| 1 | `lock_value_01_header_button.png` | Value Lock button in the navigation header |
| 2 | `lock_value_02_locked_state.png` | Lock engaged: button lit, Autokey dimmed |

### workflows/material_variants.md

| # | File | Shows |
|---|------|-------|
| 1 | `mat_variants_01_product.png` | New Product in the Variants tree |
| 2 | `mat_variants_02_parts_pool.png` | A Part with pool slots and materials assigned |
| 3 | `mat_variants_03_states.png` | States listed, one active (filled circle) |
| 4 | `mat_variants_04_live_preview.png` | Live on, a State picked, viewport following |

### workflows/animation_variants.md

| # | File | Shows |
|---|------|-------|
| 1 | `anim_variants_01_layers.png` | The View Layers created for the variants |
| 2 | `anim_variants_02_cameras.png` | Cameras assigned per layer in the tree |
| 3 | `anim_variants_03_render_all.png` | Render menu set to render them all |

### workflows/tag_and_filter.md

| # | File | Shows |
|---|------|-------|
| 1 | `tag_filter_01_assign.png` | Tag popover open on a tree row |
| 2 | `tag_filter_02_library.png` | The tag library with a few tags and a group |
| 3 | `tag_filter_03_tree_filter.png` | Tree filtered by tag, parents kept |

### workflows/batch_rendering.md

| # | File | Shows |
|---|------|-------|
| 1 | `batch_guide_01_render_menu.png` | Render menu: scope rows and the two render modes |
| 2 | `batch_guide_02_queue.png` | Queue running, mixed statuses visible |
| 3 | `batch_guide_03_output_files.png` | The rendered files in their output folder |

### workflows/name_output_files.md

| # | File | Shows |
|---|------|-------|
| 1 | `name_output_01_fields.png` | Directory and File Name fields with tokens in them |
| 2 | `name_output_02_preview.png` | The live preview resolving the tokens |
| 3 | `name_output_03_result.png` | Resulting file names on disk |

### workflows/use_render_presets.md

| # | File | Shows |
|---|------|-------|
| 1 | `use_presets_01_picker.png` | Preset picker open on a row |
| 2 | `use_presets_02_globals.png` | Globals panel, Presets mode, the 8 categories |
| 3 | `use_presets_03_dirty.png` | Dirty indicator with Accept / Revert |

### workflows/bookmark_a_property.md

| # | File | Shows |
|---|------|-------|
| 1 | `bookmark_01_rightclick.png` | Right-click menu with Bookmark Property |
| 2 | `bookmark_02_channels.png` | Inspector Channels view, bookmark shelf revealed |
| 3 | `bookmark_03_shelf_row.png` | A bookmarked property edited from its shelf row |

---

## How It Works

### features/takes.md

| # | File | Shows |
|---|------|-------|
| 1 | `takes_01_hierarchy.png` | Full tree: Scene Group > Scene > VL Group > View Layer > Take |
| 2 | `takes_02_take_rows.png` | Take rows under one layer, close up |

### features/vl_versions.md

| # | File | Shows |
|---|------|-------|
| 1 | `review_loop_01_takes.png` | Several takes as review iterations on one layer |
| 2 | `review_loop_02_switch.png` | Flipping between them, viewport following |

### features/cascade.md

| # | File | Shows |
|---|------|-------|
| 1 | `cascade_01_icons_row.png` | Cascade icon strip on a tree row |
| 2 | `cascade_02_bright_dim.png` | Bright (set here) vs dimmed (inherited) icons |
| 3 | `cascade_03_popover.png` | Shift-click full popover with + and inherited value |
| 4 | `cascade_04_context_props.png` | Context Properties listing every override at once |

### features/rest_state.md

| # | File | Shows |
|---|------|-------|
| 1 | `rest_state_01_picker.png` | Rest Action picker in the Takes tree header |
| 2 | `rest_state_02_drift.png` | Ghost drift warning with snap controls |

---

## Inside Takes — Panels

### interface/navigation_panel.md

| # | File | Shows |
|---|------|-------|
| 1 | `nav_panel_01_overview.png` | The whole panel: header, tree, warnings |
| 2 | `nav_panel_02_header.png` | Header controls close up |
| 3 | `nav_panel_03_row_icons.png` | One row with its icon strip, readable |
| 4 | `nav_panel_04_warnings.png` | Warning badges row with one panel open |
| 5 | `nav_panel_05_display.png` | The Icon Visibility / display popover |

### interface/inspector_panel.md

| # | File | Shows |
|---|------|-------|
| 1 | `inspector_01_overview.png` | The panel in Inspector mode |
| 2 | `inspector_02_watchlist.png` | Watchlist with objects and pins |
| 3 | `inspector_03_channels.png` | Channels view with keyable rows |

### interface/context_properties.md

| # | File | Shows |
|---|------|-------|
| 1 | `context_props_01_overview.png` | The panel with the active layer's overrides |
| 2 | `context_props_02_rows.png` | Override rows: value, rule, preset slot |
| 3 | `context_props_03_push.png` | Push to Selected during a multi-selection |

### interface/variant_tree.md

| # | File | Shows |
|---|------|-------|
| 1 | `variant_tree_01_overview.png` | The tree: Products, States, Parts, pools |
| 2 | `variant_tree_02_row.png` | One Product row: LIVE cell, in-use count, stats |

### features/globals.md

| # | File | Shows |
|---|------|-------|
| 1 | `globals_01_modes.png` | Header with the four mode buttons |
| 2 | `globals_02_presets.png` | Presets mode: the 8 categories |
| 3 | `globals_03_rules.png` | Rules mode |
| 4 | `globals_04_tags.png` | Tags mode |

---

## Inside Takes — Features

### features/variant_switch.md

| # | File | Shows |
|---|------|-------|
| 1 | `vsw_01_tree.png` | Product with Parts, pools and States |
| 2 | `vsw_02_live.png` | Live armed: LIVE label on one Product, dimmed marker on another |
| 3 | `vsw_03_diamond.png` | Diamond vs filled circle on State rows |
| 4 | `vsw_04_conflicts.png` | Conflict warning: Collapse and Shared-object entries |

### features/render_presets.md

| # | File | Shows |
|---|------|-------|
| 1 | `presets_01_rows.png` | Preset rows: empty, assigned, dirty, missing |
| 2 | `presets_02_edit.png` | Edit popover of one preset |
| 3 | `presets_03_tiers.png` | The same preset type at two tiers in the tree |

### features/tags.md

| # | File | Shows |
|---|------|-------|
| 1 | `tags_01_library.png` | The library with tags and one group |
| 2 | `tags_02_group.png` | Selected tags becoming a group (+ > Group) |
| 3 | `tags_03_presets.png` | A tag carrying a preset bundle |

### features/rules.md

| # | File | Shows |
|---|------|-------|
| 1 | `rules_01_list.png` | Rules mode with a rule listed |
| 2 | `rules_02_row.png` | One rule: pattern, target, preset |

### features/smart_output.md

| # | File | Shows |
|---|------|-------|
| 1 | `smart_output_01_toggle.png` | Smart Output toggle in the Output panel |
| 2 | `smart_output_02_tokens.png` | The token grid / mega-sheet |
| 3 | `smart_output_03_preview.png` | Pattern with tokens and its live preview |

### features/custom_tokens.md

| # | File | Shows |
|---|------|-------|
| 1 | `custom_tokens_01_editor.png` | The custom token editor in preferences |
| 2 | `custom_tokens_02_in_use.png` | A custom token inside an output pattern |

### features/batch_render.md

| # | File | Shows |
|---|------|-------|
| 1 | `batch_01_menu.png` | The render menu: categories, Calibrate, render modes |
| 2 | `batch_02_queue.png` | The queue with Pending / Rendering / Post / Done rows |
| 3 | `batch_03_jobs.png` | The Render Jobs popover at the pointer |
| 4 | `batch_04_eta.png` | ETA and progress during a background batch |

### features/pie_menus.md

| # | File | Shows |
|---|------|-------|
| 1 | `pies_01_navigation.png` | Navigation pie, eight slots |
| 2 | `pies_02_f12.png` | F12 render pie |
| 3 | `pies_03_mode.png` | Mode pie (Shift+Alt+Q) |
| 4 | `pies_04_keyframe.png` | Keyframe pie on I |
| 5 | `pies_05_config.png` | The pie grid configurator in preferences |

### features/bookmarks.md

| # | File | Shows |
|---|------|-------|
| 1 | `bookmarks_01_menu.png` | Right-click Bookmark Property entry |
| 2 | `bookmarks_02_shelf.png` | The bookmark shelf in Channels |

### features/vl_preview.md

| # | File | Shows |
|---|------|-------|
| 1 | `vl_preview_01_thumbs.png` | Thumbnails beside tree rows |
| 2 | `vl_preview_02_settings.png` | Preview controls in the display popover |

### features/viewport_sync.md

| # | File | Shows |
|---|------|-------|
| 1 | `viewport_sync_01_toggle.png` | The sync control and what it aligns |

### features/still_mode.md

| # | File | Shows |
|---|------|-------|
| 1 | `still_01_row_icons.png` | Still / Anim icons on VL and take rows |
| 2 | `still_02_global_menu.png` | Header button open: Still / Animation / Off (per-take) |
| 3 | `still_03_frame_pin.png` | A Still take pinned to its frame |

### features/value_lock.md

| # | File | Shows |
|---|------|-------|
| 1 | `value_lock_01_button.png` | The header button between Still Mode and Autokey |
| 2 | `value_lock_02_engaged.png` | Lock on: Autokey dimmed, values guarded |

### features/sequencer.md

| # | File | Shows |
|---|------|-------|
| 1 | `sequencer_01_strips.png` | VSE with scene strips driven by takes |
| 2 | `sequencer_02_controls.png` | The Takes controls on a strip |

### features/process_monitor.md

| # | File | Shows |
|---|------|-------|
| 1 | `process_01_overlay.png` | The viewport HUD during a background render |
| 2 | `process_02_list.png` | The process list with a running job |

### features/ai_assistant.md

| # | File | Shows |
|---|------|-------|
| 1 | `ai_01_panel.png` | The AI Assistant surface |

---

## Inside Takes — Preferences

### preferences/index.md

| # | File | Shows |
|---|------|-------|
| 1 | `prefs_01_overview.png` | The preferences with their tab row |

### preferences/workflow.md

| # | File | Shows |
|---|------|-------|
| 1 | `prefs_workflow_01_tab.png` | Workflow tab overview |
| 2 | `prefs_workflow_02_render.png` | The four Render sections |
| 3 | `prefs_workflow_03_pies.png` | Pie & Misc with one pie grid open |

### preferences/ui.md

| # | File | Shows |
|---|------|-------|
| 1 | `prefs_ui_01_tab.png` | Interface tab overview |
| 2 | `prefs_ui_02_tree.png` | Tree design settings |

### preferences/data.md

| # | File | Shows |
|---|------|-------|
| 1 | `prefs_data_01_tab.png` | Data tab overview |
| 2 | `prefs_data_02_snapshots.png` | Snapshots & Recovery section |

### preferences/debug.md

| # | File | Shows |
|---|------|-------|
| 1 | `prefs_debug_01_tab.png` | Developer tab overview |
| 2 | `prefs_debug_02_logging.png` | Logging topics section |

### preferences/advanced.md

| # | File | Shows |
|---|------|-------|
| 1 | `prefs_advanced_01_tab.png` | Advanced tab overview |

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
