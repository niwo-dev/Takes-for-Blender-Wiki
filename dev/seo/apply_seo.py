"""Apply the approved SEO copy (Option A) from dev/seo/seo-keyword-plan.md.

Every replacement is asserted: a pattern that matches nothing stops the run
instead of silently doing nothing. Line endings (CRLF / LF) are preserved.
"""

from __future__ import annotations

from pathlib import Path

DOCS = Path(__file__).resolve().parents[2] / "docs"

DESCRIPTIONS = {
    "index.md": "Takes for Blender is a scene and shot management add-on for Blender 5.0+. Organize shots in one tree, switch material variants and batch render every take.",
    "features/takes.md": "How Takes organizes Blender scenes, View Layers and shots into one tree — a scene manager built on Blender's own data.",
    "features/cascade.md": "Non-destructive scene states in Blender: set a camera, world or action once and let every shot below inherit it.",
    "features/variant_switch.md": "Material variants in Blender without duplicate objects. Set up finishes once and switch them per shot.",
    "features/batch_render.md": "Batch render every shot and variant in Blender in one go, in the foreground or in the background.",
    "features/render_presets.md": "Blender render presets you save once and assign to any scene, View Layer or shot.",
    "features/rest_state.md": "Keep a neutral pose for unkeyed properties so animation variations in Blender never drift between shots.",
    "features/smart_output.md": "Name Blender render output from tokens, so every shot and variant lands in the right folder.",
    "workflows/material_variants.md": "Step by step: render one product in several finishes. A look dev workflow for Blender.",
    "workflows/animation_variants.md": "Step by step: several animation variations in one .blend file, each with its own camera. A Blender 5.0 animation workflow.",
    "workflows/batch_rendering.md": "Step by step: render every View Layer with its own camera, world and preset in one click.",
    "workflows/set_up_a_project_for_a_team.md": "Set up a Blender project so a whole team shares one shot structure — Takes as a production pipeline tool.",
    "comparisons.md": "Takes for Blender compared with Shot Manager, Renderset, Polyviews, Render+ and View Layer toggling.",
    "getting_started/installation.md": "Install Takes for Blender, the shot and scene management add-on for Blender 5.0+.",
    "faq.md": "Quick answers about Takes for Blender: versions, render engines, shot management and other add-ons.",
}

INDEX_CARD = """-   :material-lightbulb-on:{ .lg .middle } **How It Works**

    ---

    The few ideas behind Takes — the tree, the cascade, and the review loop.

    [:octicons-arrow-right-24: The Takes System](features/takes.md)
"""

COMPARE_CARD = """
-   :material-scale-balance:{ .lg .middle } **Coming from another tool?**

    ---

    How Takes compares with shot managers, render queues and View Layer toggling.

    [:octicons-arrow-right-24: Compare Takes](comparisons.md)
"""

OLD_TABLE = """| :material-movie-open: **Takes Tree** | One tree for your whole project: Scene Groups → Scenes → View Layer Groups → View Layers → Takes. |
| :material-arrow-decision: **The Cascade** | Set a camera, world, action or preset on any level. The deepest level wins, so a single take can override everything above it. |
| :material-swap-horizontal: **Variant Switch** | Ship one product in many finishes. Takes swaps the materials for you. |
| :material-tag-multiple: **Tags & Rules** | Label anything, then let a tag apply a whole bundle of presets. |
| :material-play-box-multiple: **Batch Render** | Render every take in one go, in front of you or quietly in the background. |
| :material-palette-swatch: **Render Presets** | Save render settings once and reuse them anywhere in the tree. |
| :material-form-textbox: **Smart Output** | Build file names from tokens, so every render lands in the right folder. |
| :material-ghost: **Rest State** | A neutral pose your unkeyed properties fall back to, so takes never drift. |
| :material-image-multiple: **View Layer Preview** | A live thumbnail beside every row, so you can see what you are picking. |"""

NEW_TABLE = """| :material-movie-open: **Takes Tree** | Your shot and scene manager. One tree for the whole project: Scene Groups → Scenes → View Layer Groups → View Layers → Takes. |
| :material-arrow-decision: **The Cascade** | Non-destructive scene states. Set a camera, world, action or preset on any level; the deepest level wins. |
| :material-swap-horizontal: **Variant Switch** | Material variants without duplicate objects. Ship one product in many finishes; Takes swaps the materials. |
| :material-tag-multiple: **Tags & Rules** | Label anything, then let a tag apply a whole bundle of presets. |
| :material-play-box-multiple: **Batch Render** | Batch rendering for every take, in front of you or quietly in the background. |
| :material-palette-swatch: **Render Presets** | Save render settings once and reuse them on any shot in the tree. |
| :material-form-textbox: **Smart Output** | Build file names from tokens, so every render lands in the right folder. |
| :material-ghost: **Rest State** | A neutral pose for unkeyed properties, so animation variations never drift. |
| :material-image-multiple: **View Layer Preview** | A live thumbnail beside every row, so you can see which shot you pick. |"""

OLD_COMPARE_HEAD = """# Comparing Takes for Blender

Takes manages the **stage**: the camera, world, materials, action and render settings behind every shot."""

NEW_COMPARE_HEAD = """# Takes vs. Other Blender Shot Managers

Takes is a shot manager for the **stage**: the camera, world, materials, action and render settings behind every shot."""

SECTION_ZERO = """## :material-history: 0. The Built-in Ways

Most artists start with what Blender offers out of the box. Each way works — until the shot count grows.

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

---

## :material-store: 1. The Context Managers"""

FAQ_NEW = """??? question "Is Takes a shot manager?"
    Yes. Takes manages shots, scenes and View Layers in one tree. Each shot keeps
    its own camera, world, action, materials and render preset. See
    [The Takes System](features/takes.md).

??? question "Can Takes batch render material variants?"
    Yes. Set up your finishes with [Variant Switch](features/variant_switch.md),
    assign one per take, then run [Batch Render](features/batch_render.md).

## :material-arrow-decision: Takes & Cascade"""

EDITS = {
    "index.md": [
        ("# Takes for Blender — User Guide\n",
         "# Takes for Blender — Scene & Shot Management\n\n"
         "The shot manager and scene organizer for Blender 5.0+. Keep every shot, look and "
         "render setting in one tree, then batch render them all in one click.\n"),
        (INDEX_CARD, INDEX_CARD + COMPARE_CARD),
        (OLD_TABLE, NEW_TABLE),
    ],
    "comparisons.md": [
        (OLD_COMPARE_HEAD, NEW_COMPARE_HEAD),
        ("## :material-store: 1. The Context Managers", SECTION_ZERO),
        ("- **One panel** — scene manager, variant switcher and batch queue in a single place.",
         "- **One panel** — shot manager, scene organizer, variant switcher and batch renderer in a single place."),
    ],
    "faq.md": [
        ("## :material-arrow-decision: Takes & Cascade", FAQ_NEW),
    ],
    "features/takes.md": [
        ("Takes for Blender turns your scenes and View Layers into one organized tree.",
         "Takes for Blender is a scene manager for your whole project. It turns your Scenes "
         "and View Layers into one organized tree of shots."),
    ],
    "features/cascade.md": [
        ("The cascade decides which camera, world, action, compositor and presets a take uses.",
         "The cascade gives every shot a non-destructive scene state. It decides which camera, "
         "world, action, compositor and presets a take uses."),
    ],
    "features/variant_switch.md": [
        ("Show one product in several finishes",
         "Material variants for Blender: show one product in several finishes"),
    ],
    "workflows/material_variants.md": [
        ("When one product has to render in several finishes, using the Variant Switch system.\n",
         "When one product has to render in several finishes, using the Variant Switch system.\n\n"
         "A look dev workflow: build every finish once, then compare them shot by shot.\n"),
    ],
    "features/batch_render.md": [
        ("Render many takes in one go.",
         "Batch rendering for Blender: render every shot and variant in one go."),
    ],
    "features/render_presets.md": [
        ("A **preset** is a saved snapshot of render settings.",
         "A **render preset** is a saved snapshot of Blender render settings."),
    ],
    "workflows/animation_variants.md": [
        ("When every animation needs its own View Layer and camera.",
         "Animation variations in one file: when every animation needs its own View Layer "
         "and camera. This workflow uses Blender 5.0's action slots."),
    ],
    "features/rest_state.md": [
        ("Every property you have *not* keyed falls back to it.",
         "Every property you have *not* keyed falls back to it. It keeps animation "
         "variations clean when you switch between shots."),
    ],
}


def add_description(text: str, desc: str, name: str) -> str:
    assert text.startswith("---\n"), f"{name}: no front matter"
    end = text.index("\n---\n", 4)
    assert "\ndescription:" not in text[: end + 1], f"{name}: already has a description"
    quoted = desc.replace('"', '\\"')
    return text[: end + 1] + f'description: "{quoted}"\n' + text[end + 1 :]


def main() -> None:
    # Two passes: compute every file first, write only when all edits matched.
    pending: list[tuple[Path, str, str]] = []
    names = set(DESCRIPTIONS) | set(EDITS)
    for name in sorted(names):
        path = DOCS / name
        raw = path.read_bytes().decode("utf-8")
        crlf = "\r\n" in raw
        text = raw.replace("\r\n", "\n")
        for old, new in EDITS.get(name, []):
            count = text.count(old)
            assert count == 1, f"{name}: expected 1 match, found {count}: {old[:60]!r}"
            text = text.replace(old, new)
        if name in DESCRIPTIONS:
            text = add_description(text, DESCRIPTIONS[name], name)
        if crlf:
            text = text.replace("\n", "\r\n")
        pending.append((path, text, name))
    for path, text, name in pending:
        path.write_bytes(text.encode("utf-8"))
        print(f"ok  {name}")


if __name__ == "__main__":
    main()
