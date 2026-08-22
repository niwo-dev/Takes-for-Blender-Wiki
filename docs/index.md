---
icon: material/home
hide:
  - toc
  - title
title: Home
---

<!-- The heading below is deliberate. Material invents a heading from the front
     matter when a page has none, which made this page announce itself as
     "Home" — a position in the menu, not a name. `title: Home` stays, because
     that is what the browser tab, the menu row and the breadcrumb should keep
     saying; only the heading on the page itself is spelled out in full. -->

# Takes for Blender — User Guide

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **Start Here**

    ---

    New to Takes? Install it and build your first take in a few minutes.

    [:octicons-arrow-right-24: Install Takes](getting_started/installation.md)

-   :material-play-circle:{ .lg .middle } **Guides**

    ---

    One page per job. Switch takes, name your files, batch render, and more.

    [:octicons-arrow-right-24: Switch Between Takes](workflows/switch_takes.md)

-   :material-lightbulb-on:{ .lg .middle } **How It Works**

    ---

    The few ideas behind Takes — the tree, the cascade, and the review loop.

    [:octicons-arrow-right-24: How It Works](features/takes.md)

-   :material-view-dashboard:{ .lg .middle } **Buttons & Settings**

    ---

    Look up any panel, button or preference, one short line each.

    [:octicons-arrow-right-24: Navigation Panel](interface/navigation_panel.md)

</div>

## :material-star-circle: What Takes Does

<!-- The two rows below are the table's head and its separator. Markdown needs
     both, even when the head is blank — without them every row collapses into
     one paragraph of pipe characters. Please keep them if you edit this page
     in the CMS. -->

| | |
|---|---|
| :material-movie-open: **Takes Tree** | One tree for your whole project: Scene Groups → Scenes → View Layer Groups → View Layers → Takes. |
| :material-arrow-decision: **The Cascade** | Set a camera, world, action or preset on any level. The deepest level wins, so a single take can override everything above it. |
| :material-swap-horizontal: **Variant Switch** | Ship one product in many finishes. Takes swaps the materials for you. |
| :material-tag-multiple: **Tags & Rules** | Label anything, then let a tag apply a whole bundle of presets. |
| :material-play-box-multiple: **Batch Render** | Render every take in one go, in front of you or quietly in the background. |
| :material-palette-swatch: **Render Presets** | Save render settings once and reuse them anywhere in the tree. |
| :material-form-textbox: **Smart Output** | Build file names from tokens, so every render lands in the right folder. |
| :material-ghost: **Rest State** | A neutral pose your unkeyed properties fall back to, so takes never drift. |
| :material-image-multiple: **View Layer Preview** | A live thumbnail beside every row, so you can see what you are picking. |
| :material-earth: **Globals Panel** | One place for project-wide settings, presets, rules, tags and variants. |

!!! tip "Which Blender do I need?"
    Takes needs **Blender 5.0** or newer. A few newer conveniences need 5.1+.

??? info "Need another language?"
    **The add-on interface** follows Blender's own language setting (_Preferences → Interface → Translation_) — **German** is the first shipped language, covering labels, tooltips, menus, warnings and status messages, with more possible as translation word lists are added. That is separate from **this wiki**, which is published in English.

    To read the wiki in another language, modern browsers can translate the whole page on the fly, free, with no extension to install:

    - **Chrome / Edge / Brave** — right-click anywhere on the page → _Translate to…_, or click the **translate icon** that appears in the address bar.
    - **Firefox** (118+) — right-click → _Translate Page_.
    - **Safari** (Big Sur / iOS 14+) — click the **translate icon** in the address bar.

    Browser translation is private (processed locally where supported) and covers 100+ languages.
