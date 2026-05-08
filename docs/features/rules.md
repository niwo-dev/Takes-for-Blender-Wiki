---
icon: material/auto-fix
---

# Rules

A **Rule** is an automation tag — a single named entity that bundles a set of preset assignments. Apply the rule on any cascade tier and every preset listed inside it activates together.

If [Tags](tags.md) are the labels, Rules are the *programmable* tags: each one carries presets for render, output, camera, world, and so on, ready to be applied with one click.

## :material-shape: Rule Types

| Type | Drives |
|------|--------|
| **OUTPUT Rule** | Render preset, Output preset, File Output preset, View Layer preset, Color Management preset. |
| **CAMERA Rule** | Camera preset + Camera object pick. |
| **STUDIO Rule** | World preset. |
| **MATERIAL Rule** | Material preset (used by Variant Switch). |

## :material-plus-circle: Creating a Rule

1. Open *Globals > **Rules** mode*.
2. Pick a category (OUTPUT / CAMERA / STUDIO / MATERIAL).
3. Click **+** → **Tag** and name the rule (e.g. *FullHD_Cycles*, *Hero_Cam*, *Studio_Bright*).
4. Select the new tag — the *Preset Rules for: <name>* panel appears on the right.
5. Fill in any combination of preset slots:

| Slot (OUTPUT) | What it drives |
|---------------|----------------|
| **Render** | Engine, samples, resolution. |
| **Output** | Container & dimensions. |
| **File Output** | Format, color depth, compression, Smart Output paths. |
| **View Layer** | Active passes, light groups. |
| **Color Mgmt** | View transform, look, exposure. |

| Slot (CAMERA) | What it drives |
|---------------|----------------|
| **Camera Preset** | Lens, sensor, DOF. |
| **Camera Object** | Which camera in the scene. |

## :material-link-variant: Assigning a Rule

In the Context panel, every tier (Scene / View Layer / View Layer Group / Scene Group / Global) shows a **rule icon** (system gear). Click it to choose a rule from the tag library — every preset in the rule is applied to the cascade at that tier.

Resolution follows the standard cascade rule — the most specific tier with a value wins, and the rest fall back to the parent:

```
View Layer Version → View Layer → View Layer Group → Scene → Scene Group → Global
```

Rules are evaluated as part of cascade resolution, on every View Layer switch, batch render, and cascade sync.

## :material-pencil: Editing a Rule

1. Open *Globals > Rules*.
2. Select the rule.
3. Re-pick presets from the *Preset Rules for: <name>* panel.
4. The change propagates to every tier already using the rule on the next sync.

## :material-keyboard: Hotkeys

| Shortcut | Action |
|----------|--------|
| ++ctrl+n++ | Add rule. |
| ++f2++ | Rename. |
| ++del++ / ++x++ | Delete. |
| ++ctrl+g++ / ++alt+g++ | Group / ungroup. |
| ++ctrl+t++ | Retarget. |

Cascade icons that select a rule accept ++alt++-click to clear the assignment at that tier. See [Keyboard Shortcuts](../interface/hotkeys.md).
