---
icon: material/help-rhombus
---

# Which Tool for the Job

Takes gives you five ways to make "the same thing, but different". Picking the right one is most of the skill.

The question to ask: **what actually changes?**

## :material-table: The five, side by side

| Reach for | When what changes is | Example |
|---|---|---|
| **Take** | nothing structural — this is another round of the same shot | "Take 2 · warmer light" |
| **View Layer** | which objects render, which passes, which motion | the bottle on a stone, not on a table |
| **Variant** | which material each part wears | matte black, aluminium, rose gold |
| **Preset** | render settings | draft at 64 samples, final at 512 |
| **World** | the lighting and background | studio, kitchen, outdoors |

Variants, presets and worlds all ride the [cascade](cascade.md), so any tier can set one. Takes and View Layers *are* tiers.

## :material-lightbulb-outline: Five real jobs

**Three finishes of one bottle.** A **Variant**. Build Parts once, then any shot asks for a finish. Not three View Layers — the objects are identical.

**Three lighting setups.** A **World** per View Layer, or a Studio [rule](rules.md) if a tag should pick it. Not a variant — no material changes.

**Three environments.** A **View Layer** each, with the other environment collections switched off. Geometry appearing and disappearing is a layer's job, and only a layer's. Copy the visibility across with **Copy** and **Paste Collection Visibility** in the tree's row menu.

**Draft and final quality.** A **Preset**, set on a View Layer Group so every shot in it inherits.

**The client asked for warmer light.** A **Take**. Write the note, click **New Take from Here**, work it in. The old round stays clickable.

??? info "Still not sure? Two questions"
    **Does anything appear or disappear?** Then it is a View Layer.

    **Could you go back to the old one and want both?** Then it is a Take.

    Anything else is a value, and values ride the cascade: a variant, a preset
    or a world.

## :material-arrow-right-circle: Related

Take or View Layer, in more depth: [Takes — the Review Loop](vl_versions.md#when-to-use).
