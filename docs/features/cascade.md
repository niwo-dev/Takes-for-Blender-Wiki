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

## :material-eye-outline: Visual Indicators

- **Bright icon** — A value is explicitly set at this tier
- **Dimmed icon** — The value is inherited from a parent tier
- **Alt+Click** — Clear the override at this tier

!!! tip "Cascade Debugging"
    Hover over a cascade icon to see a tooltip showing which tier the
    current value is inherited from.

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
