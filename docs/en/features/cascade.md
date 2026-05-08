---
icon: material/arrow-decision
---

# Cascade System

The **Cascade** is the core engine of Takes for Blender. It resolves property overrides through a 6-tier hierarchy, allowing any level to override any level above it.

## :material-cog-sync: How It Works

When you switch to a View Layer, the cascade resolves each property (camera, world, action, compositor, presets) by walking the hierarchy **top-down** and using the **first non-empty value** it finds:

```mermaid
graph LR
    Global[Global] --> SceneGrp[Scene Group]
    SceneGrp --> Scene[Scene]
    Scene --> LayerGroup[View Layer Group]
    LayerGroup --> Layer[View Layer]
    Layer --> Version[View Layer Version]

    style Version fill:#e87d0d,color:#fff
```

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

The following properties participate in the cascade:

| Property | Description |
|----------|-------------|
| **Camera** | Which camera object is used for rendering. |
| **World** | Which world environment is used. |
| **Compositor** | Which node tree drives compositing. |
| **Action** | Which animation action is assigned. |
| **Render Preset** | JSON-based render settings. |
| **Camera Preset** | JSON-based camera settings. |
| **World Preset** | JSON-based world settings. |
| **Output Rule** | Tag-based output path rule. |
| **Camera Rule** | Tag-based camera selection rule. |
| **World Rule** | Tag-based world selection rule. |

## :material-pencil: Setting Overrides

### Via Cascade Icons

Click any cascade icon on a tree row to open its popover. Set a value to create an override at that level, or clear it to inherit from the parent.

### Via Context Properties

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
