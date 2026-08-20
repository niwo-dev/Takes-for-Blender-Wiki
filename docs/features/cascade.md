---
icon: material/arrow-decision
---

# Cascade System

The **Cascade** is the core engine of Takes for Blender. It resolves property overrides through a 6-tier hierarchy, allowing any level to override any level above it.

## :material-cog-sync: How It Works

When you switch to a View Layer, the cascade resolves each property (camera, world, action, compositor, presets) by walking the hierarchy from the **most specific tier upward** and using the **first non-empty value** it finds. Take wins over View Layer, View Layer wins over View Layer Group, and so on up to Global as the final fallback:

```mermaid
graph LR
    Global[Global] --> SceneGrp[Scene Group]
    SceneGrp --> Scene[Scene]
    Scene --> LayerGroup[View Layer Group]
    LayerGroup --> Layer[View Layer]
    Layer --> Take[Take]

    style Take fill:#e87d0d,color:#fff
```

The arrow direction shows hierarchy (Global is the parent, the Take is the leaf). Resolution priority runs in the **opposite** direction — leaf wins over root.

## :material-stairs: Override Tiers

| Tier | Scope | Example Use |
|------|-------|-------------|
| **Global** | All scenes, all View Layers | Default camera, global world |
| **Scene Group** | All scenes in the group | Shared exterior lighting |
| **Scene** | All View Layers in the scene | Scene-specific compositor |
| **View Layer Group** | All View Layers in the group | Shared camera angle |
| **View Layer** | Single View Layer | Per-shot camera, action, world |
| **Take** | Saved review iteration of one layer | Take-specific tweaks between review rounds |

## :material-format-list-bulleted-type: Cascade Properties

Two cascade resolvers live alongside each other. They walk the same 6-tier chain but answer different questions, so the wiki splits them into separate tables to match the source.

### :material-link-variant: Pointer Cascade

These are the cascade's "primary" properties — each one resolves a single datablock reference (or a single rule name) and is driven by the `CascadeProperty` enum / `resolve_cascade` resolver. Each shows up as its own cascade icon on every tree row.

| Property | Resolves to | Description |
|----------|-------------|-------------|
| **Camera** | Camera object | Which camera object is used for rendering. |
| **World** | World datablock | Which world environment is used. |
| **Compositor** | Node tree | Which node tree drives compositing. |
| **Action** | Action datablock | Cascade action applied to managed objects on this View Layer. |
| **Output Rule** | Tag name | The active automation rule that drives the five output-side preset slots. |

### :material-format-list-checkbox: Per-field Cascade

These are name-keyed preset slots and selection rules. Each one cascades independently via the generic `get_cascade_winner` resolver, so a Scene-level Render preset can win while a VL-level Color Management preset overrides it. The Output Popover groups the five output-side slots in one place; Camera Rule and World Rule are surfaced via the Camera and World popovers.

| Slot / rule | Driven by | Description |
|-------------|-----------|-------------|
| **Render preset** | `tks_render_preset` | Engine, samples, resolution. |
| **Output preset** | `tks_output_preset` | Container, dimensions, frame range. |
| **File Output preset** | `tks_fileoutput_preset` | Format, color depth, compression, Smart Output paths. |
| **View Layer preset** | `tks_viewlayer_preset` | Active passes, light groups, holdouts. |
| **Color Management preset** | `tks_colormanagement_preset` | View transform, look, exposure. |
| **Camera preset** | `tks_camera_preset` | Focal length, sensor, DOF. Applied to the cascade-resolved camera. |
| **World preset** | `tks_world_preset` | Background, strength, mist. Applied to the cascade-resolved world. |
| **Camera Rule** | `tks_camera_rule` | Tag-based automatic camera selection. |
| **World Rule** | `tks_world_rule` | Tag-based automatic world selection. |

## :material-pencil: Setting Overrides

### :material-cursor-default-click: Via Cascade Icons
Click any cascade icon on a tree row to open its popover. Set a value to create an override at that level, or clear it to inherit from the parent.

### :material-tune-vertical: Via Context Properties
The Context Properties panel shows all overrides for the active View Layer in one place.

### :material-plus-box: Creating Datablocks per Tier

The Action, World, Camera and Compositor popovers carry a **+** button (:material-plus:) next to their picker — from the Global tier all the way down (tier coverage varies per type, see the table). Clicking it creates a brand-new datablock — auto-named from the [Smart Output](smart_output.md) naming template for the tier you're on — marks it with a fake user so it survives a save/reload, and assigns it to that tier in one step. This saves you from creating a datablock in Blender's own browser and then pointing the cascade at it.

| Button | Creates and assigns to |
| -------- | ------------------------ |
| **{{ op('tks.global_action_new').bl_label }}** | A new Action on the **Global** tier. |
| **New Action** | A new Action on the **Scene** tier. |
| **New Action** | A new Action on the **View Layer** tier. |
| **New World** | A new World on the **Scene** tier. |
| **New World** | A new World on the **View Layer** tier. |
| **{{ op('tks.global_camera_new').bl_label }}** | A new Camera on the **Global** tier. |
| **New Camera** | A new Camera on the **Scene** tier. |
| **New Camera** | A new Camera on the **View Layer** tier. |
| **{{ op('tks.global_compositor_new').bl_label }}** | A new compositor node tree on the **Global** tier. |
| **New Compositor** | A new compositor node tree on a **Scene Group**, **View Layer Group**, or **Take** (one shared operator serves all three group tiers). |
| **New Compositor** | A new compositor node tree on the **Scene** tier. |
| **New Compositor** | A new compositor node tree on the **View Layer** tier. |
| **New Rest Action** | A new Action assigned as the **Rest Action** (see below). |

!!! note "Rest Action"
    The **New Rest Action** button lives on the Rest State popover, not the cascade tier itself. The Rest Action is the snapshot that *unkeyed* properties fall back to: any property without a keyframe snaps to its value in the Rest Action. Creating one here gives you an empty action to pose into as your neutral / rest baseline.

### :material-pencil: Renaming Without Breaking Anything

Cascade assignments are stored by *name*, so renaming a datablock in Blender's own UI would orphan every assignment pointing at it. The popovers therefore carry a **pencil** button, **{{ op('tks.casic_rename').bl_label }}**: it renames the assigned Action / World / Camera / Compositor in a small dialog *and* rewrites every cascade reference to the old name across all tiers in the same step — so the rename can never break an assignment.

### :material-delete-forever: Deleting Assigned Data

++ctrl+shift+alt++-clicking any cascade datablock icon (Action / World / Camera / Compositor, any tier) invokes **{{ op('tks.purge_assigned_data').bl_label }}** — deliberately hidden behind a three-key chord so it can't fire by accident. Its confirmation dialog spells out the full blast radius before you commit: every cascade location the datablock is assigned in, its user count in the file, and whether fake-user protection will be overridden (cameras additionally note that only the object is deleted, its camera data stays). Confirming unassigns the datablock from every slot, then deletes it from the file.

## :material-eye-outline: Visual Indicators

- **Bright icon** — A value is explicitly set at this tier
- **Dimmed icon** — The value is inherited from a parent tier
- **Alt+Click** — Clear the override at this tier

!!! tip "Cascade Debugging"
    Hover over a cascade icon to see a tooltip showing which tier the
    current value is inherited from.

## :material-account-multiple-check: Managing the Cascade Action

The **Action** cascade is special: it doesn't just point at a datablock, it actively pushes that action onto every managed (watched) object on the View Layer. A few operators help keep that in sync:

| Action | What it does |
| -------- | -------------- |
| **Re-apply Cascade Action** | Forces the resolved cascade action back onto all watched objects, updates the depsgraph for an immediate viewport refresh, and clears the "action mismatch" entry from the navigation warnings. Use it after manually fiddling with an object's animation data. |
| **Pin Action** | Locks the action *currently* active on an object into that object's own override, so the cascade will leave it alone instead of overwriting it on the next switch. Reports a warning if the object has no action to pin. |
| **Push to Selected** | Copies one override value from the active Scene / View Layer to every multi-selected View Layer at once. Works for Camera, World, Action, Compositor, Output Rule, and Variant. Pushing an empty value clears that override on the targets. The button only appears while a multi-selection is active. |
| **{{ op('tks.update_action_name').bl_label }}** | Renames the assigned Scene- or View-Layer cascade action to match the current naming template — useful when generated action names have gone stale after renaming a scene or View Layer. No panel button; run it from Blender's operator search. |
| **{{ op('tks.scene_action_unlink').bl_label }}** | Clears the current scene's Scene-tier action assignment (the action datablock itself stays in the file). Also operator-search only — the popover's ++alt++-click clear is the everyday route. |

!!! tip "Bulk editing with Push to Selected"
    Select several View Layers in the tree, set the value once on one of them, then use **Push to Selected** to fan it out — handy for giving a batch of shots the same camera or world without touching each row.

## :material-camera-switch: Cross-Scene Camera Linking

When you assign a camera at the **Global** or **Scene Group** tier, that camera has to exist in *every* scene the tier covers. If it doesn't, the cascade quietly skips the takes in the scenes it can't reach — the assignment itself is fine, it just cannot land everywhere.

**Picking always assigns.** There is no confirmation in the way: choosing a camera writes it to the tier immediately, even when some covered scenes don't have it linked. Interrupting a pick to ask about scene membership put a dialog in front of the common case to serve the rare one, so the gap is *surfaced* afterwards instead — in three places you're already looking:

- **A red camera flag** on the affected tree rows.
- **The Camera Links warning** in the Navigation panel, which names each camera, the tier it came from, and every scene it can't reach.
- **The cascade picker itself**, which offers a **Link '&lt;camera&gt;' into this scene** entry right where you noticed the problem.

All three run the same repair, **{{ op('tks.link_inherited_camera').bl_label }}**, which links the camera into the scenes that are missing it while preserving its collection placement:

| Button | Where | Scope |
|--------|-------|-------|
| **Link** | Per-scene row in the Camera Links warning | That one scene. |
| **Link into all missing scenes** | Footer of a camera's entry, when more than one scene is missing | Every scene in the Scene Group for an SG-tier camera; the whole file for a Global-tier one. Scenes that already have the camera are skipped, so over-covering is harmless. |
| **Link '&lt;camera&gt;' into this scene** | The cascade camera picker | The scene you are working in. |

Nothing is duplicated — linking is Blender's own multi-scene linking, so it stays one camera object. The warning clears as soon as every covered scene can resolve it.

!!! note "Three different camera problems, three different warnings"
    **Camera Links** means the camera exists and is assigned, but can't reach some scenes. That's distinct from a [broken assignment](#broken-assignments) (the camera datablock is gone) and from [drift](#cascade-preset-drift) (a camera was picked natively, outside the tree).

## :material-vector-difference: Take Variants {: #version-variants }

[Takes](#override-tiers) can override which **variant** of a product is shown — this is the highest-priority tier in the [Variant Switch](variant_switch.md) cascade, so a take's choice wins over everything below it. The take's variant popover exposes two operators:

| Action | What it does |
| -------- | -------------- |
| **Set Take Variant** | Pins a specific product to a chosen variant index on this take. If the take is currently active, the variant cascade re-applies immediately. |
| **Clear Take Variant** | Removes that product's variant override from the take, letting it inherit again. Re-applies live if the take is active. |

## :material-link-off: Broken Assignments

Because cascade assignments are stored by name, an assignment **breaks** when the datablock behind it disappears — deleted, or renamed outside the addon's own [rename tool](#renaming-without-breaking-anything). The cascade can then no longer resolve that slot, and a warning sub-panel appears in the Navigation panel's warning row listing every broken reference with its data type and tier.

The panel repairs as well as reports:

- **X** on an entry runs **{{ op('tks.clear_broken_assignment').bl_label }}**, emptying the stale reference(s) to that one datablock; a type row's **Empty all** button clears every broken reference of that data type at once.
- The **magnifier** button runs **{{ op('tks.replace_broken_assignment').bl_label }}**, which reopens that exact tier's cascade popover so you can point the slot at a replacement instead of clearing it.
- **Clear All** at the top runs **{{ op('tks.clear_all_broken_assignments').bl_label }}**, emptying every broken cascade assignment in the file in one click.

Clearing only empties the stored reference — nothing is deleted — and the warning disappears as soon as every assignment resolves again.

## :material-alert-circle-outline: Camera or World Needed {: #needed-rows }

A broken assignment points at something that vanished. This is the other half: nothing is assigned *anywhere* in the tree, and the scene has no camera or no world to fall back on. The Navigation panel's warning row says so and carries everything needed to resolve it, so you never have to leave the panel to find a picker.

Each row offers the same pair of chips:

| Chip | What it does |
| ------ | -------------- |
| **▾** on the camera row | Opens a small popup with a live search field bound to the **adopt tier** — the tier your *Camera handling* preference nominates. Picking a camera writes it straight onto that tier, so the cascade owns it from that moment on. |
| **+** on the camera row | Creates a camera named for the adopt tier, links it into the scene, assigns it to that tier and aligns it to your current 3D view — one click from "no camera" to a framed shot. |
| **▾** on the world row | The same live-search popup for worlds, bound to the world adopt tier. |
| **+** on the world row | Creates a world, assigns it to the adopt tier, and clears the warning. |

Which tier the chips write to is not a fixed choice — it follows the *World handling* and *Camera handling* preferences (see [Globals](globals.md)), so a studio that manages everything on the Scene tier and one that works per View Layer both get a resolve button that lands in the right place.

When the camera row appears because a camera was *removed* rather than never assigned, it also names what was removed, so you can put the same one back instead of guessing.

## :material-compare-horizontal: Cascade & Preset Drift

**Drift** is the opposite failure mode: the assignment is fine, but the *live* value no longer matches it — you changed the world or compositor through Blender's native UI instead of the cascade, or edited settings governed by one of the tier-cascaded preset slots (Render, Output, File Output, View Layer, Color Management, World, Camera). The addon compares the scene's current state against what the cascade last applied and lists each mismatch in a Navigation warning, with a ✓ / ↩ pair per entry:

| Button | What it does |
| -------- | -------------- |
| ✓ on a World / Compositor row | Adopts your manual pick — writes it into the active View Layer's assignment, so the cascade owns the new value from now on. |
| ↩ on a World / Compositor row | Discards the manual change and re-applies the cascade-resolved value. |
| ✓ on a preset row | Pushes the drifted preset assignment onto the active View Layer's cascade tier. |
| ↩ on a preset row | Restores the cascade-assigned preset. |

The rule of thumb: **Accept** when the change was intentional and should stick to this shot; **Revert** when it was an accidental edit in the wrong panel. (Don't confuse this with the preset *dirty state* — drift is about which datablock or preset is assigned, dirty state is about edited values inside an assigned preset; see [Render Presets](render_presets.md#dirty-state).)

## :material-dots-horizontal-circle: Overflow Icon

On narrow panels the per-row cascade icons collapse behind a single **overflow** indicator. Clicking it opens the inline editor for the chosen cascade property; ++alt++ + clicking instead clears **every** assignment for that property at that tier in one go — the direct value, its selection rule, *and* its preset slot together. The status line reports how many values were cleared (or that the slot was already empty).

## :material-keyboard: Hotkeys

Cascade icons on tree rows and in the Context panel respond to modifier-clicks:

| Shortcut | Action |
|----------|--------|
| Click | Open the popover for this property. |
| ++alt++ + click | Clear the override at this tier (revert to inherited value). |
| ++shift++ + click | Toggle the same property across **all items of the same type** in the active scene. |
| ++ctrl+shift++ + click | Toggle the same property **globally** across every scene and group. |
| ++ctrl+shift+alt++ + click | **Delete** the assigned datablock from the file, after a blast-radius confirmation — see [Deleting Assigned Data](#deleting-assigned-data). |

Datablock pickers (Camera, World, Compositor, Action) follow the same convention — ++alt++ + click clears the assignment.

See the full reference on the [Keyboard Shortcuts](../interface/hotkeys.md) page.
