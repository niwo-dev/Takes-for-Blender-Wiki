# A Course to Learn Takes — dev companion

Human plan: `c:/Users/NIWO/Documents/GitHub/.claude/plans/course-to-learn-takes.md`
Card: `doc/roadmap/ideas/course-to-learn-takes.md` (move to `active/` when phase 0 starts; wiki `active/` is empty, WIP is free)

## Audit trail (2026-09-22)

- Read all 52 `docs/**/*.md` pages + `mkdocs.yml` nav + `macros.py` + `dev/*` gates.
- Gaps found across three passes: preferences section (6 pages, 0 lessons), `features/takes.md`, `first_steps.md`;
  no page for spine idea 4 (actions) or 6 (modes); no side-by-side "which tool" page.
- Code checks: `takes_for_blender/blender_manifest.toml:12` `blender_version_min = "5.0.0"`;
  `ViewLayer.tks_is_locked` declared `core/vl_handlers.py:263`, dropped `:303`, read nowhere → dead;
  Value Lock captures whole scene (`features/rest_state/cache.py:187,288` iterate `scene.objects`;
  operator tooltip "Lock the scene's unkeyed values").

## Phase 0 — six fixes (exact)

| # | File | Edit |
|---|---|---|
| 1 | `docs/getting_started/first_steps.md` | rewrite in place as *The Six Levels* (Explanation type). Keep path. Run `dev/required_anchors.py getting_started/first_steps` FIRST; keep every printed anchor (add `{: #old-anchor }` on the nearest heading if a heading is renamed). |
| 2 | `docs/workflows/lock_a_value.md:20` | "selected objects" → whole scene; step 1 "Select the objects…" → drop; matches `features/value_lock.md:24`. |
| 3 | `docs/faq.md` Variant Switch section | delete "Can I mix Swap and Pool modes?" (no modes since pool model); replace with "Swap List or Variant Switch?" → link `interface/inspector_panel.md#swap-list`. |
| 4 | `docs/getting_started/installation.md` Requirements | "Blender 5.1" → "Blender 5.0" (manifest) + "recorded on 5.2" only if user picks that wording. FAQ + `features/globals.md` already say 5.0. |
| 5 | `docs/preferences/ui.md` Confirmations table | remove *Locked Take Protection* row (dead prop). Also file an add-on card: prune `confirm_locked_take_protection` (`preferences/props/props_confirm.py:71`) + `tks_is_locked` + de_DE keys — that is add-on work, NOT this card. |
| 6 | `docs/features/pie_menus.md:~10` | "five" → "six"; add Tree Icon Pie (`Ctrl+Shift+F`, off by default) row; source: `preferences/ui.md` Every Interface Setting → *Tree Icon Pie Menu*. |

Gate after phase 0: `python dev/anchor_check.py --compare` + `python dev/wiki_gate.py`.

## Phase 1 — seven pages

Page type per wiki-writing skill. ≤300 visible words (`dev/readability_check.py --budget 300`). UI names via macros only.

| File | Type | Must contain |
|---|---|---|
| `docs/features/actions.md` | Explanation | cascade action per tier; managed vs pinned; slots per datablock (object/material/node tree/shape key); what a switch does (action on / rest snap); Autokey + *Only Insert Available* one-liner → link `interface/navigation_panel.md#autokey-is-being-blocked`. No steps. |
| `docs/features/modes.md` | Explanation | the 7 mode-row buttons; exclusion table: Value Lock↔Autokey, Value Lock↔Rest Mode, Variant Live↔Autokey, Still↔Frame Sync; viewport pills; Mode Pie link. Source: `interface/navigation_panel.md` header table. |
| `docs/features/which_tool.md` | Explanation | 5-column decision table (Take / View Layer / Variant / Preset / World) × (when · what changes · example); the 5 worked examples (colourway → variant; lighting → world per layer or Studio rule; environment geometry → one View Layer per env, collections excluded, `tks.copy_vl_settings`/`tks.paste_vl_settings` Shift+C/V to clone visibility; quality tier → preset per group; review round → take). Absorb the "Take or new View Layer?" table from `vl_versions.md:23` by LINK, do not duplicate. |
| `docs/workflows/recover_take_organisation.md` | How-to | steps for the restore block (Restore / Dismiss), Rebuild Cache, cache_unlock; "do not reorganise before answering". Sources `preferences/data.md#snapshots`, `preferences/advanced.md#rebuild-cache`. |
| `docs/workflows/set_up_a_project_for_a_team.md` | How-to | Init Project Prefs; Save Mode Project; Shared Presets Folder + Lock Shared; Master Default tier. Source `preferences/index.md` config table, `preferences/data.md`. |
| `docs/troubleshooting.md` | Reference (symptom-first) | rows: keys vanish / object stuck in a pose / list is red / panel locked / render did not start / cascade icon dim / cameras missing / variant conflict. Each: symptom → instrument → fix link. Pull the FAQ Troubleshooting Q&As across; FAQ section becomes 2 lines + link. |
| `docs/getting_started/first_steps.md` | Explanation (rewrite) | the six levels + one mermaid graph (reuse the one already on the page); NO "Your First Take" heading (that is `first_take.md`). |

Also phase 1, one line not a page: `docs/interface/context_properties.md` Tree Housekeeping table gains a row for **Copy / Paste Collection Visibility** (row menu, Shift+C / Shift+V; paste hits every ticked row in multi-select). Today only `changelog/dev.md` mentions it. Use `{{ op('tks.copy_vl_settings').bl_label }}`.

Nav: add `Troubleshooting: troubleshooting.md` after FAQ; add the three concept pages under *How It Works* in the order shown in the human plan. `mkdocs.yml:117-123`.

## Phase 2 — course shell

### Files
- `docs/course/index.md` — syllabus: 4 stage headings, 21 module rows (`| Module | Lessons | Time |`), links.
- `docs/course/<stage><n>-<slug>.md` × 21, slugs: `a1-why-takes`, `a2-install-and-look-around`, `a3-your-first-take`, `a4-the-cascade`, `a5-actions-slots-managed-pinned`, `a6-frame-0-is-home`, `a7-when-it-looks-wrong`, `a8-getting-help`, `b1-cameras-and-lighting`, `b2-looks-swap-then-variants`, `b3-animation-variants`, `b4-presets`, `b5-tags-and-rules`, `b6-which-tool-for-this-job`, `c1-names`, `c2-batch-render`, `c3-project-and-team`, `c4-capstone`, `d1-working-fast`, `d2-beyond-the-viewport`, `d3-ai-assistant`.
- Front matter per page: `icon: material/school` (module pages), `icon: material/book-open-variant` (syllabus).
- Page shape = tutorial template: `# <Module>` · one line (lessons · minutes · idea) · `## 1. <Lesson>` … · `## Done` + next module link.

### Video embed
- Markdown (md_in_html is on):
  ```
  <div class="tks-video" markdown>
  <iframe src="https://www.youtube-nocookie.com/embed/<ID>" title="<Lesson title>" loading="lazy" allowfullscreen></iframe>
  </div>
  ```
- Until an ID exists, use the placeholder form so the gap is VISIBLE on the page (copy the `.tks-shot` idea, `extra.css:530-553`):
  `<div class="tks-video" data-video="a5-2">The Watchlist</div>`
- CSS (`docs/stylesheets/extra.css`, beside `.tks-shot`): `.tks-video{position:relative;margin:1rem 0;aspect-ratio:16/9;border-radius:6px;overflow:hidden}` `.tks-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}` placeholder state: `.tks-video:not(:has(iframe)){display:flex;align-items:center;justify-content:center;border:2px dashed var(--md-default-fg-color--lighter);color:var(--md-default-fg-color--light);font-size:.72rem}` `.tks-video:not(:has(iframe))::before{content:"Video:";font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-right:.4em}`.
- Bump the cache-buster: `mkdocs.yml:203` `extra.css?v=<new hash>`.
- No JS needed. `navigation.instant` is on → iframes reload per page, fine.
- Phone: `aspect-ratio` + `width:100%` keeps 16px gutters; check at 390px.

### Nav
- `mkdocs.yml` after the `Start Here` block (`:94-98`): `- Course:` → `Syllabus: course/index.md` → four `Stage X · …:` sub-groups with the module pages.
- `docs/javascripts/nav-icons.js:18-20` map is keyed by nav TITLE → add `"Course": "<svg …school…>"` (Material `school` path). Sub-group titles (`Stage A · …`) also need entries or they render icon-less; add four or accept plain rows. Bump `nav-icons.js?v=` in `mkdocs.yml:206`.
- `hooks/search_exclude.py` excludes generated pages only; course pages stay indexed.
- `toc_depth: 2` → lesson `##` headings show in the right-hand contents. Good: a module's contents IS its lesson list.

### Backlink line (phase 6)
- One line under the H1 of each feature page: `▶ Watch: [Course › A5.2 The Watchlist](../course/a5-actions-slots-managed-pinned.md#2-the-watchlist) (4 min)`. Anchor = mkdocs slug of the `## 2. The Watchlist` heading → `#2-the-watchlist`. `mkdocs build --strict` catches a bad one.

## Lesson → page map (recap links)

A1 → `comparisons.md`, `index.md` · A2 → `getting_started/installation.md`, `interface/navigation_panel.md`, `features/takes.md`, `getting_started/first_steps.md` · A3 → `getting_started/first_take.md`, `workflows/switch_takes.md`, `features/vl_versions.md` · A4 → `features/cascade.md`, `interface/context_properties.md`, `features/globals.md`, `preferences/workflow.md` (Cameras/World unassigned mode + adopt tier) · A5 → `features/actions.md` (new), `interface/inspector_panel.md`, `workflows/keep_an_objects_own_animation.md`, `interface/navigation_panel.md#autokey-is-being-blocked` · A6 → `features/rest_state.md`, `features/still_mode.md`, `features/value_lock.md`, `features/diff_state.md`, `features/modes.md` (new), `preferences/ui.md#modes` · A7 → `interface/navigation_panel.md#warnings`, `#adopted`, `troubleshooting.md` (new), `workflows/recover_take_organisation.md` (new) · A8 → `troubleshooting.md`, `preferences/debug.md`, `features/process_monitor.md`, `interface/context_properties.md#view-layer-preload`, `whats_new/index.md`, GitHub releases/issues, community links (TBD) · B1 → `workflows/show_one_camera.md`, `features/multi_cam.md`, `features/vl_preview.md`, `features/cascade.md` (world per tier) · B2 → `interface/inspector_panel.md#swap-list`, `features/variant_switch.md`, `interface/variant_tree.md`, `workflows/material_variants.md` · B3 → `workflows/animation_variants.md` · B4 → `features/render_presets.md`, `workflows/use_render_presets.md`, `preferences/workflow.md` (Preset Changes) · B5 → `features/tags.md`, `workflows/tag_and_filter.md`, `features/rules.md` · B6 → `features/which_tool.md` (new) · C1 → `features/smart_output.md`, `workflows/name_output_files.md`, `preferences/workflow.md#syntax`, `features/custom_tokens.md` · C2 → `getting_started/first_batch_render.md`, `workflows/batch_rendering.md`, `features/batch_render.md` · C3 → `workflows/set_up_a_project_for_a_team.md` (new), `preferences/index.md`, `preferences/data.md` · C4 → none new · D1 → `interface/hotkeys.md`, `features/pie_menus.md`, `workflows/bookmark_a_property.md`, `features/tags.md#push-tag-to-selected` · D2 → `features/sequencer.md`, `features/viewport_sync.md` · D3 → `features/ai_assistant.md`.

## Lesson scripts (phases 3–5)

- Location `doc/course/<module-slug>/<nn>-<lesson-slug>.md` (tracked, not published; `doc/` is hand-written repo docs, `docs/` is the site).
- Script = recipe: `Setup` (file, prefs, window) · numbered `Steps` (one click per step, UI label in bold) · `Say` (≤ 60 words per step) · `Show` (what the frame holds) · `Recap` (the 5 lines that go on the page).
- Same recipe drives WikiShot's shot for that step where a screenshot is also wanted → see `WikiShot-for-Blender/doc/roadmap/ideas/` *Shoot the Takes Wiki*.
- Recording env: release ZIP installed in a clean Blender profile (memory: private profile launcher, never the junction/worktree); 1920×1080; Blender 5.2; factory startup + the course `.blend` per stage (Stage A: default cube; B–C: the bottle file (body w/ inner+outer material slots, cap, label, string — each its own collection; env collections `Studio`, `Kitchen`, `Stone`); keep both under `doc/course/files/` — small, no textures > 2 MB, or link them from a release asset).
- Vocabulary on camera: Take = review round, View Layer = shot/layer (post `take-feedback-loop`). Never "version".

## Recording schedule + channel mechanics

- The per-video table (id, minutes, title, search phrase, page) is section 5 of the human plan — single source; do not copy it here.
- Numbering restarts per stage: A1–A8, B1–B6, C1–C4, D1–D3; lesson = `<module>.<n>`. Slugs in "Phase 2" follow.
- YouTube: public, `youtube-nocookie.com` embeds. One playlist per stage (4). Syllabus page links the 4 playlists; each module page links its playlist in the intro line.
- Description template (fill from the table): line 1 = the *Solves* phrase as a sentence · line 2 = wiki page URL (`https://niwo-dev.github.io/Takes-for-Blender-Wiki/wiki/<path>/`) · chapters `00:00 <step>` per recipe step · module page URL · install page URL · `#TakesForBlender #Blender` last.
- Title ≤ 70 chars, problem first, feature name once, no clickbait punctuation beyond one `?`.
- Thumbnail: one template, video id (e.g. `A5.2`) bottom-left, title ≤ 6 words.
- Channel trailer = A1.1. Publish cadence = one module per release (5 videos at a time).
- Backlink line (phase 6) carries the minutes so the page states the cost: `▶ Watch: … (4 min)`.

## Gotchas

- `verify_wiki.py` (CI string drift) scans all `docs/**`: a lesson recap that names a button in bold plain text is invisible to it → use `{{ op('…').bl_label }}` so a rename fails the build instead of aging on the page.
- `mkdocs build --strict` fails on any unresolved link → write backlinks LAST (phase 6).
- `required_anchors.py` cannot see wiki-to-wiki links; strict build does. Run both.
- `docs/roadmap/` and `docs/changelog/` are generated + gitignored → never place course pages there.
- Front matter `hide: [toc]` on the syllabus only; module pages WANT the toc (it is the lesson list).
- 300-word budget counts visible text only → the recap must stay ≤ 5 lines per lesson; a 5-lesson page ≈ 5 × 40 words + headings. Fold nothing on course pages; link instead.
- `navigation.instant`: custom scripts subscribe to `document$` — the video embed needs no script, so nothing to wire.
- German locale: course page strings are wiki-only, no de_DE re-key.

## Tests / gates per phase

- Phase 0/1: `readability_check.py` · `required_anchors.py <page>` (before) · `anchor_check.py --compare` (after) · `wiki_gate.py`.
- Phase 2: `wiki_gate.py` (strict build proves every course link) + headless-Chrome screenshot of a module page at 1280 and 390 px (`dev/cdp_shot.py` exists — reuse).
- Phase 6: `wiki_gate.py` once more; spot-check 3 add-on right-click manual links in Blender.
