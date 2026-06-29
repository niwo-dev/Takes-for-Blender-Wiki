---
icon: material/arrow-decision
---

# Cascade System

The **Cascade** is the core engine of Takes for Blender. It resolves property overrides through a 6-tier hierarchy, allowing any level to override any level above it.

## :material-cog-sync: How It Works

When you switch to a View Layer, the cascade resolves each property (camera, world, action, compositor, presets) by walking the hierarchy from the **most specific tier upward** and using the **first non-empty value** it finds. View Layer Version wins over View Layer, View Layer wins over View Layer Group, and so on up to Global as the final fallback:

```mermaid
graph LR
    Global[Global] --> SceneGrp[Scene Group]
    SceneGrp --> Scene[Scene]
    Scene --> LayerGroup[View Layer Group]
    LayerGroup --> Layer[View Layer]
    Layer --> Version[View Layer Version]

    style Version fill:#e87d0d,color:#fff
```

The arrow direction shows hierarchy (Global is the parent, View Layer Version is the leaf). Resolution priority runs in the **opposite** direction — leaf wins over root.

## :material-stairs: Override Tiers

| Tier | Scope | Example Use |
|------|-------|-------------|
| **Global** | All scenes, all View Layers | Default camera, global world |
| **Scene Group** | All scenes in the group | Shared exterior lighting |
| **Scene** | All View Layers in the scene | Scene-specific compositor |
| **View Layer Group** | All View Layers in the group | Shared camera angle |
| **View Layer** | Single View Layer | Per-shot camera, action, world |
| **View Layer Version** | Named snapshot | Version-specific tweaks |

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

Every Action and World popover carries a **+** button (:material-plus:) next to its picker. Clicking it creates a brand-new datablock — auto-named from the [Smart Output](smart_output.md) naming template for the tier you're on — marks it with a fake user so it survives a save/reload, and assigns it to that tier in one step. This saves you from creating a datablock in Blender's own browser and then pointing the cascade at it.

| Operator | Button | Creates and assigns to |
|----------|--------|------------------------|
| `tks.scene_action_new` | **New Action** | A new Action on the **Scene** tier. |
| `tks.vl_action_new` | **New Action** | A new Action on the **View Layer** tier. |
| `tks.scene_world_new` | **New World** | A new World on the **Scene** tier. |
| `tks.vl_world_new` | **New World** | A new World on the **View Layer** tier. |
| `tks.rest_action_new` | **New Rest Action** | A new Action assigned as the **Rest Action** (see below). |

!!! note "Rest Action"
    The **New Rest Action** button lives on the Rest State popover, not the cascade tier itself. The Rest Action is the snapshot that *unkeyed* properties fall back to: any property without a keyframe snaps to its value in the Rest Action. Creating one here gives you an empty action to pose into as your neutral / rest baseline.

## :material-eye-outline: Visual Indicators

- **Bright icon** — A value is explicitly set at this tier
- **Dimmed icon** — The value is inherited from a parent tier
- **Alt+Click** — Clear the override at this tier

!!! tip "Cascade Debugging"
    Hover over a cascade icon to see a tooltip showing which tier the
    current value is inherited from.

## :material-account-multiple-check: Managing the Cascade Action

The **Action** cascade is special: it doesn't just point at a datablock, it actively pushes that action onto every managed (watched) object on the View Layer. A few operators help keep that in sync:

| Action | Operator | What it does |
|--------|----------|--------------|
| **Re-apply Cascade Action** | `tks.reapply_cascade_action` | Forces the resolved cascade action back onto all watched objects, updates the depsgraph for an immediate viewport refresh, and clears the "action mismatch" entry from the navigation warnings. Use it after manually fiddling with an object's animation data. |
| **Pin Action** | `tks.pin_action_override` | Locks the action *currently* active on an object into that object's own override, so the cascade will leave it alone instead of overwriting it on the next switch. Reports a warning if the object has no action to pin. |
| **Push to Selected** | `tks.push_override_to_selected` | Copies one override value from the active Scene / View Layer to every multi-selected View Layer at once. Works for Camera, World, Action, Compositor, Output Rule, and Variant. Pushing an empty value clears that override on the targets. The button only appears while a multi-selection is active. |

!!! tip "Bulk editing with Push to Selected"
    Select several View Layers in the tree, set the value once on one of them, then use **Push to Selected** to fan it out — handy for giving a batch of shots the same camera or world without touching each row.

## :material-camera-switch: Cross-Scene Camera Linking

When you assign a camera at the **Global** or **Scene Group** tier, that camera has to exist in *every* scene the tier covers. If it doesn't, picking it pops up the **Camera not linked in all scenes** confirmation (`tks.link_camera_and_assign`) listing the missing scenes and offering three choices:

- **Link & Assign** — link the camera into each missing scene (mirroring its current collection placement) and then assign it.
- **Just Assign** — keep the assignment at the source tier and let the cascade silently skip scenes where it can't resolve.
- **Cancel** — do nothing.

The cascade picker also flags an incompatible camera with an error icon before you click, so you can spot the situation in advance.

## :material-vector-difference: Version Variants

[View Layer Versions](#override-tiers) can override which **variant** of a product is shown — this is the highest-priority tier in the [Variant Switch](variant_switch.md) cascade, so a version's choice wins over everything below it. The version's variant popover exposes two operators:

| Action | Operator | What it does |
|--------|----------|--------------|
| **Set Version Variant** | `tks.vlv_set_variant` | Pins a specific product to a chosen variant index on this version. If the version is currently active, the variant cascade re-applies immediately. |
| **Clear Version Variant** | `tks.vlv_clear_variant` | Removes that product's variant override from the version, letting it inherit again. Re-applies live if the version is active. |

## :material-dots-horizontal-circle: Overflow Icon

On narrow panels the per-row cascade icons collapse behind a single **overflow** indicator. Clicking it (`tks.overflow_icon_click`) opens the inline editor for the chosen cascade property; ++alt++ + clicking instead clears **every** assignment for that property at that tier in one go — the direct value, its selection rule, *and* its preset slot together. The status line reports how many values were cleared (or that the slot was already empty).

## :material-keyboard: Hotkeys

Cascade icons on tree rows and in the Context panel respond to modifier-clicks:

| Shortcut | Action |
|----------|--------|
| Click | Open the popover for this property. |
| ++alt++ + click | Clear the override at this tier (revert to inherited value). |
| ++shift++ + click | Toggle the same property across **all items of the same type** in the active scene. |
| ++ctrl+shift++ + click | Toggle the same property **globally** across every scene and group. |

Datablock pickers (Camera, World, Compositor, Action) follow the same convention — ++alt++ + click clears the assignment.

See the full reference on the [Keyboard Shortcuts](../interface/hotkeys.md) page.
