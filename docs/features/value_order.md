---
icon: material/sort-variant
description: "Which value wins when Blender, the cascade, a mode and animation all want to set the same thing."
---

# The Value Order

Many things can set one value. Takes asks them in a fixed order, and the stronger step wins, field by field.

| Step | What sets the value |
|---|---|
| 1 | Blender's own value |
| 2 | The Default preset, when no level holds a value |
| 3 | The six levels. The nearest wins. |
| 4 | An object you set by hand |
| 5 | A mode, while it is on |
| 6 | Animation |

## :material-stairs: The Six Steps { #the-six-steps }

Step 6 is the strongest. Open the fold for one example each.

??? info "One example for each step"
    1. **Blender's value.** Nothing else is set, so the lamp keeps the power the file holds.
    2. **Default preset.** No level holds a Render preset, so the Default preset from the preferences applies. See [Default Presets](render_presets.md#default-presets).
    3. **Levels.** **Global** says Camera A. Take 7 says Camera B. Take 7 shows Camera B, every other take shows A. The six levels are Global, Scene Group, Scene, View Layer Group, View Layer and Take. See [The Cascade](cascade.md#override-tiers).
    4. **A hand-set object.** You set a logo's **Mode** to **This Take** or **All Takes**. Takes leaves its action alone when you switch. See [Keep an Object's Own Animation](../workflows/keep_an_objects_own_animation.md).
    5. **A mode.** While **Rest Mode** is on, every layer shows its neutral baseline, whatever the levels say. While **Still Mode** is locked on, every take uses the kind you chose. While **Multi-Cam** is on, the take's camera field only reads out the camera the cuts put on screen. **Value Lock**, **Variant Live** and **Isolate** (the camera visibility mode) work the same way. See [The Modes](modes.md).
    6. **Animation.** The lens has keys. A preset wants 50 mm. The keys win.

??? info "Three things that are not steps"
    - **Preset files** only store a value. The four storage places (**Add-on**, **Project**, **Shared**, **Local**) only decide which file of one name is read.
    - **Preferences** decide when and how things apply. Only the Default preset holds a value.
    - **A pick made in Blender itself** is not a step. It is a way to set a level's value: the drift row offers to write it into the level you choose. See [Cascade & Preset Drift](cascade.md#cascade-preset-drift).

## :material-layers-triple: On One Level { #on-one-level }

On one level, the level's own value comes first, then its [rule](rules.md). Then the same two on the level above.

!!! note "Planned"
    Not built yet. Today an output rule's presets apply only when no level holds a preset of that kind.

## :material-eye: Where a Value Comes From { #where-a-value-comes-from }

The panel shows the source.

- A **bright** cascade icon means the value is set on this level. A **dimmed** one means it comes from a level above.
- An inherited value shows greyed in the field.
- Hover the icon. The tooltip names the level the value comes from.
- For the action, the source can read **Rest Mode**.
- A preset row is dim when inherited. It is bright, with an **X**, when set here.

??? info "What the panel does not show yet"
    It does not name a source for the Default preset. A preset row shows an info icon when a keyed value differs from the preset.

!!! note "Planned"
    A message that says a setting cannot apply because the value is animated.

## :material-scale-balance: Without the Add-on and With It { #with-and-without-takes }

The task: ten takes. Seven share Cam_Main. Two need an 85 mm lens. One uses its own free camera. Then the client wants the shared look on Cam_B. Then you check each take's camera.

In plain Blender, the ten scenes share the objects, and each scene holds its own active camera. You set it scene by scene and revisit the seven to move it. To check, you switch into each scene.

| Steps | Without the add-on | With Takes |
|---|---|---|
| Setup | 5 | 4 |
| The change | 14 | 1 |
| The check | 9 scene switches | 0 switches |

The setup costs about the same. The change and the check are where the order pays.

??? info "How the steps were counted"
    Both sides start equal: the ten shots and the cameras Cam_Main, Cam_85 (the 85 mm camera), Cam_Free and Cam_B exist. One step is one camera pick or one switch to another scene. The plain side was done and counted in Blender 5.3.

    **Without the add-on**

    - Setup: switch to two scenes, and pick a camera in three. The other seven already look through Cam_Main.
    - The change: switch to each of the seven scenes and pick Cam_B. Seven switches, seven picks.
    - The check: switch to each of the other nine scenes and read the camera.

    **With Takes**

    - Setup: pick Cam_Main on the **Global** row. Pick Cam_85 on the two 85 mm takes. Pick Cam_Free on the free take. The seven other takes inherit Cam_Main.
    - The change: pick Cam_B on the **Global** row. The three takes with their own camera keep theirs.
    - The check: hover the camera icon on each take row. The tooltip names the camera, and for an inherited one the level it comes from. You do not switch takes.

## :material-link-variant: Where Each Step Lives { #where-each-step-lives }

- Levels: [The Cascade](cascade.md), [Globals Panel](globals.md)
- Rules and presets: [Rules](rules.md), [Render Presets](render_presets.md)
- Actions: [Actions, Managed and Pinned](actions.md)
- Modes: [The Modes](modes.md), [Rest State](rest_state.md), [Still Mode](still_mode.md), [Value Lock](value_lock.md), [Variant Switch](variant_switch.md), [Multi-Cam](multi_cam.md)
- Rendering: [Batch Render](batch_render.md)
