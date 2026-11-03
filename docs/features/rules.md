---
icon: material/auto-fix
---

# Rules

A **Rule** is an automation tag: one named entity that bundles a set of preset assignments. Apply it on any cascade tier and every preset inside it activates together.

If [Tags](tags.md) are the labels, Rules are the *programmable* ones — each carries presets for render, output, camera and world, ready to apply in one click.

## :material-shape: Rule Types

| Type | Drives |
|------|--------|
| **Output** | The Render, Output, File Output, View Layer and Color Management presets. |
| **Camera** | Camera preset + Camera object pick. |
| **World** | World preset. |
| **Material** | Material preset (used by Variant Switch). |
| **Prompts** | No presets: the assistant's [prompts](prompts.md). |

## :material-plus-circle: Creating a Rule

1. Open *Globals > **Rules** mode*.
2. Pick a category (**Output**, **Camera**, **World**, **Material**).
3. Click **+** → **Tag** and name the rule, e.g. *FullHD_Cycles*.
4. Select the new tag — the *Preset Rules for: <name>* panel appears on the right.
5. Fill in any combination of preset slots.

??? info "Which slots each category offers"
    | Slot (Output) | What it drives |
    |---------------|----------------|
    | **Render** | Engine, samples, resolution. |
    | **Output** | Container & dimensions. |
    | **File Output** | Format, color depth, compression, Smart Output paths. |
    | **View Layer** | Active passes, light groups. |
    | **Color Management** | View transform, look, exposure. |

    | Slot (Camera) | What it drives |
    |---------------|----------------|
    | **Camera Preset** | Lens, sensor, DOF. |
    | **Camera Object** | Which camera in the scene. |

    The **World** category has one **World Preset** slot, and **Material** has one **Material Preset** slot.

## :material-link-variant: Assigning a Rule

In the Context panel every tier shows a **rule icon** (system gear). Click it and pick a rule from the tag library — every preset in that rule is applied to the cascade at that tier. A tier without a rule of its own shows the rule it inherits, greyed inside the field.

Resolution follows the standard cascade: the most specific tier with a value wins, the rest fall back to the parent.

```
Take → View Layer → View Layer Group → Scene → Scene Group → Global
```

Rules are evaluated on every View Layer switch, batch render and cascade sync.

## :material-pencil: Editing a Rule

1. Open *Globals > Rules*.
2. Select the rule.
3. Re-pick presets in the *Preset Rules for: <name>* panel.

Your change reaches every tier using that rule on the next sync.

## :material-keyboard: Hotkeys

Cascade icons that select a rule accept these clicks:

| Click | Result |
|-------|--------|
| ++alt++ | Clears that tier's value, rule and preset. |
| ++shift+alt++ | Does the same on every tier below, takes included. |
| ++ctrl+shift+alt++ | On an Automation Rule icon, removes the rule's tag from the Tag Library, after a confirm dialog. |

Full list: [Keyboard Shortcuts](../interface/hotkeys.md)
