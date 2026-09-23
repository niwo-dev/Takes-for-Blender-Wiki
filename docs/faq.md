---
icon: material/help-circle
description: "Quick answers about Takes for Blender: versions, render engines, shot management and other add-ons."
---

# FAQ

## :material-information-outline: General

??? question "Is the wiki available in my language?"
    Two separate things. **The add-on itself** now follows Blender's language setting (*Preferences → Interface → Translation*): **German** is the first shipped language — labels, tooltips, menus, warnings and status messages all translate — and more can follow as word lists are added. **This wiki** is published in English, but modern browsers translate full web pages for free, with no extension required:

    - **Chrome / Edge / Brave** — right-click → *Translate to…*, or click the translate icon in the address bar.
    - **Firefox** (118+) — right-click → *Translate Page*.
    - **Safari** (Big Sur / iOS 14+) — click the translate icon in the address bar.

    Browser translation is private (processed locally where supported) and covers 100+ languages.

??? question "What Blender version do I need?"
    Takes for Blender requires **Blender 5.0** or newer — it relies on
    Blender's Slotted Action system. A few newer conveniences need 5.1+.

??? question "Does it work with EEVEE and Cycles?"
    Yes. The cascade and batch render systems are engine-agnostic.
    Render presets capture engine-specific settings automatically.

??? question "Can I use it with other addons?"
    Generally yes. Takes for Blender uses standard Blender API and
    does not monkey-patch core functionality. If you encounter
    conflicts, please report them.

??? question "Is Takes a shot manager?"
    Yes. Takes manages shots, scenes and View Layers in one tree. Each shot keeps
    its own camera, world, action, materials and render preset. See
    [The Takes System](features/takes.md).

??? question "Can Takes batch render material variants?"
    Yes. Set up your finishes with [Variant Switch](features/variant_switch.md),
    assign one per take, then run [Batch Render](features/batch_render.md).

## :material-arrow-decision: Takes & Cascade

??? question "What happens to my animation when I switch View Layers?"
    Objects snap to their Rest State (neutral pose) if they don't have
    animation on the target View Layer. If they do, the cascade action
    is applied automatically.

??? question "Why is my cascade icon dimmed?"
    A dimmed icon means the value is **inherited** from a parent tier.
    A bright icon means it's **explicitly set** at that tier.
    Alt+Click to clear an override.

??? question "Can I have different frame ranges per View Layer?"
    Frame ranges are a Scene-level property in Blender. Use different
    Scenes if you need different frame ranges.

## :material-magnify-scan: Inspector

??? question "Why is my list red?"
    A red highlight in the watchlist indicates a **dangling action** warning —
    an object has animation data that isn't managed by the cascade.
    Pin the object or enable Auto-Assign to resolve it.

??? question "What's the difference between Managed and Pinned?"
    **Managed** objects follow the cascade — their action is assigned
    automatically. **Pinned** objects keep their own action regardless
    of View Layer switches.

## :material-image-multiple: Batch Render

??? question "Why didn't my render start?"
    Check that:

    1. The file is saved (required for background mode).
    2. A camera is assigned in the cascade.
    3. The batch system isn't stuck (Alt+Click the Render button to reset).

??? question "Can I render only specific View Layers?"
    Yes. The batch queue is built from each View Layer's **render-toggle icon**
    (the camera icon at the right of its tree row) — enable it on the takes you
    want, then pick a *Selected Layers* scope in the render menu. Tree
    multi-select drives delete / group / preview operations and has no effect
    on the render queue.

??? question "Where are my renders saved?"
    Output paths are determined by the Smart Output pattern.
    Check **Properties > Output** to see the current pattern.
    Token resolution happens at render time.

## :material-swap-horizontal: Variant Switch

??? question "Swap List or Variant Switch?"
    The **Swap List** changes one material slot on one object, for this take
    only, with no setup. Reach for it first. See
    [Inspector Panel](interface/inspector_panel.md#swap-list).

    **Variant Switch** is for a whole product in several finishes. You build
    Parts and a pool of materials once, then every shot can ask for a finish.
    See [Variant Switch](features/variant_switch.md).

## :material-bug: Troubleshooting

Every symptom, and the one thing to check first, now live on one page.

[:octicons-arrow-right-24: Troubleshooting](troubleshooting.md)
