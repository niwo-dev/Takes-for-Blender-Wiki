# SEO keyword plan — Takes for Blender Wiki

Status: PROPOSAL. Nothing below is applied yet. Pick, edit, then say "apply".

Written 2026-09-23 against `main` of the wiki repo.

---

## 0. What actually moves Google (read this first)

Ranked by effect, biggest first:

1. **The `<title>` tag of each page.** Today the homepage tab reads
   `Home - Takes for Blender — User Guide`. "Home" and "User Guide" are words
   nobody searches for. This is the single biggest lever.
2. **A `description:` in each page's front matter.** Material for MkDocs turns it
   into `<meta name="description">` automatically. **No page has one today**, so
   every page falls back to the one `site_description` — Google sees 100+ pages
   with the same snippet.
3. **The H1 and the first sentence** of each page.
4. **Link text** between pages ("see the [shot manager tree]" beats "see [here]").
5. **The landing page** (`index.html` at the site root). It is the real front door;
   the wiki homepage lives one level down at `/wiki/`.

Things that do NOT help, so this plan skips them:

- **`<meta name="keywords">`** — Google has ignored it since 2009. Bing treats it as
  a weak spam signal. Not worth a template change in `docs/overrides/main.html`.
- **Repeating keywords.** One natural mention per page, in the first two sentences,
  is enough. More reads as stuffing to readers and to Google.

Two honesty guards:

- **"Render Pass Management"** — Takes does not manage render passes (AOVs). It
  manages View Layers, compositor and presets. Do not claim passes; a searcher who
  lands and finds nothing bounces, which hurts rank. Use "View Layer management"
  instead.
- **Version mismatch found.** `mkdocs.yml` `site_description` and the landing page
  say **Blender 5.1+**. The homepage, FAQ and install page say **5.0+**. Pick one
  (the pages say 5.0, "a few conveniences need 5.1") and use it in every snippet.
  This plan uses **5.0+**.

---

## 1. Keyword map — one home per keyword

Each keyword gets ONE main page. Two pages chasing the same phrase compete with
each other.

| Search phrase | Main page | Supporting pages |
|---|---|---|
| Blender shot management, shot manager | `index.md` | `features/takes.md`, `comparisons.md` |
| Blender scene management, scene organizer | `features/takes.md` | `getting_started/first_steps.md` |
| Non-destructive scene states | `features/cascade.md` | `features/rest_state.md` |
| Material variants, product variants | `features/variant_switch.md` | `workflows/material_variants.md` |
| Look dev management | `workflows/material_variants.md` | `features/variant_switch.md` |
| Batch rendering | `features/batch_render.md` | `workflows/batch_rendering.md` |
| Render presets | `features/render_presets.md` | `workflows/use_render_presets.md` |
| Animation variations, Blender 5.0 animation workflow | `workflows/animation_variants.md` | `features/actions.md` |
| Production pipeline tool | `workflows/set_up_a_project_for_a_team.md` | `comparisons.md` |
| Shot Manager vs Takes, Renderset alternative | `comparisons.md` | — |

---

## 2. Homepage — `docs/index.md`

### 2a. Front matter

Keep `title: Home` — the comment in the file explains why (tab, menu row and
breadcrumb). Add a description:

```yaml
---
icon: material/home
hide:
  - toc
  - title
title: Home
description: >-
  Takes for Blender is a scene and shot management add-on for Blender 5.0+.
  Organize shots in one tree, switch material variants and batch render every take.
---
```

The tab title problem ("Home - …") is fixed in section 3 via `site_name`.

### 2b. H1 and intro — replace `# Takes for Blender — User Guide`

Option A (recommended — plain, matches the house voice):

```markdown
# Takes for Blender — Scene & Shot Management

The shot manager and scene organizer for Blender 5.0+. Keep every shot, look and
render setting in one tree, then batch render them all in one click.
```

Option B (your wording, louder):

```markdown
# The Scene & Shot Management System for Blender

Takes for Blender organizes every shot, material variant and render setting in one
tree — then batch renders them all in one click. Built for Blender 5.0+.
```

Why A over "The Ultimate …": superlatives earn no ranking, and the wiki's
voice elsewhere is calm and plain. The keywords are identical in both.

### 2c. "What Takes Does" table — new wording

Heading stays `## :material-star-circle: What Takes Does` (anchor unchanged).
Each row now leads with the name the user searches for, then says what it does.

```markdown
| | |
|---|---|
| :material-movie-open: **Takes Tree** | Your shot and scene manager. One tree for the whole project: Scene Groups → Scenes → View Layer Groups → View Layers → Takes. |
| :material-arrow-decision: **The Cascade** | Non-destructive scene states. Set a camera, world, action or preset on any level; the deepest level wins. |
| :material-swap-horizontal: **Variant Switch** | Material variants without duplicate objects. Ship one product in many finishes; Takes swaps the materials. |
| :material-tag-multiple: **Tags & Rules** | Label anything, then let a tag apply a whole bundle of presets. |
| :material-play-box-multiple: **Batch Render** | Batch rendering for every take, in front of you or quietly in the background. |
| :material-palette-swatch: **Render Presets** | Save render settings once and reuse them on any shot in the tree. |
| :material-form-textbox: **Smart Output** | Build file names from tokens, so every render lands in the right folder. |
| :material-ghost: **Rest State** | A neutral pose for unkeyed properties, so animation variations never drift. |
| :material-image-multiple: **View Layer Preview** | A live thumbnail beside every row, so you can see which shot you pick. |
| :material-earth: **Globals Panel** | One place for project-wide settings, presets, rules, tags and variants. |
```

Keywords now on the homepage: shot manager, scene manager, non-destructive scene
states, material variants, batch rendering, render presets, animation variations.

### 2d. One new card (optional)

Add after "How It Works", so comparison searchers find their page from the front:

```markdown
-   :material-scale-balance:{ .lg .middle } **Coming from another tool?**

    ---

    How Takes compares with shot managers, render queues and View Layer toggling.

    [:octicons-arrow-right-24: Compare Takes](comparisons.md)
```

---

## 3. `mkdocs.yml`

`mkdocs.yml` is wiki infrastructure. These two lines only change text, but they
still need your explicit go-ahead.

```yaml
site_name: Takes for Blender — Shot & Scene Manager
site_description: >-
  Scene and shot management add-on for Blender 5.0+. Organize shots in one tree,
  switch material variants, reuse render presets and batch render every take.
```

Effect of the new `site_name`: every browser tab becomes
`<Page> - Takes for Blender — Shot & Scene Manager`. The header text changes too.
If you want the header to stay "User Guide", say so; then we only change
`site_description` and rely on per-page descriptions.

No `extra.meta` / keywords block — see section 0.

---

## 4. Per-page descriptions (front matter)

Add one `description:` line to each page. Max ~155 characters, one keyword, plain.

| Page | `description:` |
|---|---|
| `features/takes.md` | How Takes organizes Blender scenes, View Layers and shots into one tree — a scene manager built on Blender's own data. |
| `features/cascade.md` | Non-destructive scene states in Blender: set a camera, world or action once and let every shot below inherit it. |
| `features/variant_switch.md` | Material variants in Blender without duplicate objects. Set up finishes once and switch them per shot. |
| `features/batch_render.md` | Batch render every shot and variant in Blender in one go, in the foreground or in the background. |
| `features/render_presets.md` | Blender render presets you save once and assign to any scene, View Layer or shot. |
| `features/rest_state.md` | Keep a neutral pose for unkeyed properties so animation variations in Blender never drift between shots. |
| `features/smart_output.md` | Name Blender render output from tokens, so every shot and variant lands in the right folder. |
| `workflows/material_variants.md` | Step by step: render one product in several finishes. A look dev workflow for Blender. |
| `workflows/animation_variants.md` | Step by step: several animation variations in one .blend file, each with its own camera. A Blender 5.0 animation workflow. |
| `workflows/batch_rendering.md` | Step by step: render every View Layer with its own camera, world and preset in one click. |
| `workflows/set_up_a_project_for_a_team.md` | Set up a Blender project so a whole team shares one shot structure — Takes as a production pipeline tool. |
| `comparisons.md` | Takes for Blender compared with Shot Manager, Renderset, Polyviews, Render+ and View Layer toggling. |
| `getting_started/installation.md` | Install Takes for Blender, the shot and scene management add-on for Blender 5.0+. |
| `faq.md` | Quick answers about Takes for Blender: versions, render engines, shot management and other add-ons. |

---

## 5. Comparisons page — `docs/comparisons.md`

### 5a. New H1 and intro

```markdown
# Takes vs. Other Blender Shot Managers

Takes is a shot manager for the **stage**: the camera, world, materials, action and
render settings behind every shot.

Use it when one file has to deliver many looks — colourways, lighting setups,
product variants.
```

(The H1 is not a deep-link target; the manual map uses section anchors. Verify
with the manual map before applying.)

### 5b. New first section — "From scene toggling to Takes"

Goes right after the intro, before "1. The Context Managers". This is the part
Google indexes for "how do I manage shots in Blender" searches.

```markdown
## :material-history: 0. The Built-in Ways

Most artists start with what Blender offers out of the box. Each way works — until
the shot count grows.

| Traditional workflow | Where it stops scaling | What Takes does instead |
|---|---|---|
| **One Scene per shot** (linked copies) | Every change must be repeated in every scene. | One change at the top flows down the tree. |
| **Toggling View Layers** and collection visibility by hand | Easy to forget a toggle before a render. | Each View Layer remembers its camera, world, action and preset. |
| **One .blend per variant** | Five finishes means five files to keep in sync. | Material variants live in one file and switch per shot. |
| **Duplicated objects** for each colourway | Heavy files, edits made twice. | Materials swap on the same object; nothing is duplicated. |
| **Render one shot at a time** | You babysit the machine. | Batch rendering runs every take in one go. |

??? info "Why a tree, and not a list"
    A classic shot manager keeps a flat list of shots. Each shot is set up on
    its own.

    Takes rethinks that list as a hierarchy. A camera set on a Scene applies to
    every shot inside it, until one shot says otherwise. That is the
    [Cascade](features/cascade.md) — non-destructive scene states, built on
    Blender's own Scenes, View Layers and action slots.
```

### 5c. Summary bullets — add the searched names

Replace the last bullet:

```markdown
- **One panel** — shot manager, scene organizer, variant switcher and batch renderer in a single place.
```

Wording check: every comparison uses "inspired by / rethinks / reimagines".
No "copy / clone / port" anywhere (public-attribution rule).

---

## 6. Sub-page copy — first-sentence rewrites

Rule: the keyword goes in the first or second sentence, in words an artist would
say out loud. Everything else on the page stays.

### `features/takes.md`

Now:
> Takes for Blender turns your scenes and View Layers into one organized tree.

New:
> Takes for Blender is a scene manager for your whole project. It turns your
> Scenes and View Layers into one organized tree of shots.

### `features/cascade.md`

Now:
> The cascade decides which camera, world, action, compositor and presets a take uses.

New:
> The cascade gives every shot a non-destructive scene state. It decides which
> camera, world, action, compositor and presets a take uses.

### `features/variant_switch.md`

Now:
> Show one product in several finishes — Gold, Silver, Matte Black — without rebuilding anything.

New:
> Material variants for Blender: show one product in several finishes — Gold,
> Silver, Matte Black — without rebuilding anything.

### `workflows/material_variants.md`

Add one line under the H1:
> A look dev workflow: build every finish once, then compare them shot by shot.

### `features/batch_render.md`

Now:
> Render many takes in one go.

New:
> Batch rendering for Blender: render every shot and variant in one go.

### `features/render_presets.md`

Now:
> A **preset** is a saved snapshot of render settings.

New:
> A **render preset** is a saved snapshot of Blender render settings.

### `workflows/animation_variants.md`

Now:
> When every animation needs its own View Layer and camera.

New:
> Animation variations in one file: when every animation needs its own View Layer
> and camera. This workflow uses Blender 5.0's action slots.

### `features/rest_state.md`

Add to the first paragraph:
> It keeps animation variations clean when you switch between shots.

### `faq.md` — two new questions under "General"

These match how people type questions into Google.

```markdown
??? question "Is Takes a shot manager?"
    Yes. Takes manages shots, scenes and View Layers in one tree. Each shot keeps
    its own camera, world, action, materials and render preset. See
    [The Takes System](features/takes.md).

??? question "Can Takes batch render material variants?"
    Yes. Set up your finishes with [Variant Switch](features/variant_switch.md),
    assign one per take, then run [Batch Render](features/batch_render.md).
```

---

## 7. Landing page — `index.html` (site root)

This page ranks for the domain root, so it matters most.

```html
<title>Takes for Blender — Shot & Scene Management Add-on</title>
<meta name="description" content="Scene and shot management for Blender 5.0+. Organize shots in one tree, switch material variants and batch render every take.">
```

The visible `<h1>` ("Stop Managing Chaos. Start Managing Takes.") can stay — it is
a good hook. Add one plain line under it that carries the keywords:

```html
<p class="hero-sub">The shot manager and scene organizer for Blender 5.0+.</p>
```

(Class name is a placeholder — match the landing page's existing sub-heading style.)

Also add Open Graph tags if missing, so links shared on Discord / X / Blender
Artists show a card:

```html
<meta property="og:title" content="Takes for Blender — Shot & Scene Management">
<meta property="og:description" content="Organize shots, switch material variants and batch render every take in Blender 5.0+.">
<meta property="og:type" content="website">
```

---

## 8. Apply order (smallest risk first)

1. Per-page `description:` front matter (section 4) — invisible to readers, pure win.
2. Homepage H1, intro and table (section 2).
3. FAQ questions and first-sentence rewrites (section 6).
4. Comparisons section 0 (section 5).
5. `mkdocs.yml` and landing page (sections 3 and 7) — infrastructure, needs a
   separate go-ahead.
6. Run the local wiki gate/build, then commit + push to `main`.
7. After ~4 weeks: check Google Search Console for impressions on the new phrases.
