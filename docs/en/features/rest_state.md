---
icon: material/ghost
---

# Rest State

The **Rest State** (reference state) system automatically preserves pristine default property values alongside your per-View Layer animations.

## :material-lightbulb-outline: Concept

When you animate an object differently on each View Layer, you need a "neutral" baseline — the object's default position, rotation, material values, etc. The Rest State system maintains this baseline automatically.

## :material-cog-sync: How It Works

1. A shared **Reference Action** (`Reference_State`) stores the default values for all animated properties at frame 0.
2. When you add a keyframe on any View Layer, the Rest State system automatically mirrors that property's current default value into the Reference Action.
3. When switching View Layers, objects without animation on the target View Layer snap back to their Rest State values.

```mermaid
graph LR
    K[Keyframe Added] --> M[Mirror to Reference]
    Switch[View Layer Switch] --> C{Has Cascade Action?}
    C -->|Yes| A[Apply Action]
    C -->|No| R[Snap to Rest State]
```

## :material-tune: Controls

| Control | Location | Description |
|---------|----------|-------------|
| **Auto-Mirror** | *Globals > Settings > Reference State*, or the Navigation header toggle. | Mirrors unkeyed property values into the Reference Action automatically. |
| **Reference Action picker** | *Globals > Settings > Reference State > Reference Action*. | Selects which Action stores the rest baseline. The **+** button creates a fresh one. |
| **Set Reference Default** | Property right-click menu → *Set Reference Default*. | Records the property's current value as its rest baseline. |

## :material-keyboard: Native Hotkeys That Drive Rest State

The Rest State system reacts to Blender's standard keyframe shortcuts — no addon-specific binding is required:

| Shortcut | Behavior |
|----------|----------|
| ++i++ (Insert Keyframe) | If **Auto-Mirror** is on, the unkeyed value is mirrored into the Reference Action **before** the keyframe is committed, preserving the rest baseline. |
| ++alt+i++ (Delete Keyframe) | After Blender removes the keyframe, the property snaps back to its Reference value automatically. |

## :material-database-check: Supported Datablocks

The Rest State system covers all standard animatable datablocks:

- Objects (transforms, visibility)
- Lights (energy, color, size)
- Cameras (focal length, DOF)
- Materials (shader properties)
- Worlds (environment settings)
- Scenes (gravity, frame range)
- Node Trees (shader nodes, compositor)

!!! warning "Shape Keys & Pose Bones"
    Shape key values and pose bone transforms are not yet supported by the
    Rest State system. This is planned for a future release.
